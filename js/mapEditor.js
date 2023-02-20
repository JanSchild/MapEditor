class MapEditor
{
    static minWidth = 20;
    static maxWidth = 1000;
    
    static minHeight = 15;
    static maxHeight = 100;
    
    static context = UI.canvas.map.getContext('2d');

    static currentMap = new MapEditor('Sample map', 30, 20);

    #name;
    get name() { return this.#name; }
    set name(value)
    {
        this.#name = value;
        UI.textfield.mapName.value = this.name;
    }

    #width;
    get width() { return this.#width; }
    set width(value)
    {
        this.#width = limitValue(value, MapEditor.minWidth, MapEditor.maxWidth);
        UI.canvas.map.width = Tileset.tileWidth * this.width;
        UI.textfield.mapWidth.value = this.width;
    }

    #height;
    get height() { return this.#height; }
    set height(value)
    {
        this.#height = limitValue(value, MapEditor.minHeight, MapEditor.maxHeight);
        UI.canvas.map.height = Tileset.tileHeight * this.height;
        UI.textfield.mapHeight.value = this.height;
    }

    constructor(name, width, height)
    {
        this.layer = new Layer(height);

        this.name = name;
        this.width = width;
        this.height = height;
    }

    static clearCanvas()
    {
        MapEditor.context.clearRect(0, 0, UI.canvas.map.width, UI.canvas.map.height);
    }

    static clearTile(x, y)
    {
        MapEditor.context.clearRect(x * Tileset.tileWidth, y * Tileset.tileHeight, Tileset.tileWidth, Tileset.tileHeight);
        MapEditor.currentMap.layer.unsetTile(x, y);
    }
      
    static setTile(newTile, x, y) 
    {
        if(!MapEditor.coordinateExists(x, y)) return;
        if(MapEditor.currentMap.layer.tile(x, y).isIdentical(newTile)) return;
        
        MapEditor.clearTile(x, y);
        MapEditor.currentMap.layer.setTile(newTile, x, y);
        MapEditor.drawTile(newTile, x, y);
    }

    static drawTile(newTile, map_x, map_y)
    {
        if(newTile.isEmpty()) return;

        if(!Tileset.filenames.has(newTile.filename))
        {
            console.error(`${newTile.filename} not found.`);
            return;
        }

        if(!Tileset.loadedFiles.has(newTile.filename))
        {
            console.error(`${newTile.filename} has not loaded yet.`);
            return;
        }

        var tileset_image = Tileset.images[newTile.filename];

        var draw_x = map_x * Tileset.tileWidth;
        var draw_y = map_y * Tileset.tileHeight;
        
        var source_x = newTile.x * Tileset.tileWidth;
        var source_y = newTile.y * Tileset.tileHeight;

        MapEditor.context.drawImage(tileset_image, source_x, source_y, Tileset.tileWidth, Tileset.tileHeight, 
            draw_x, draw_y, Tileset.tileWidth, Tileset.tileHeight);
    }

    static drawMap()
    {
        MapEditor.clearCanvas();

        MapEditor.currentMap.layer.data.forEach((row, map_y) => 
        {
            if(map_y >= MapEditor.currentMap.height) return;

            row.forEach((tile, map_x) =>
            {
                if(tile == null || tile.isEmpty()) return;
                if(map_x >= MapEditor.currentMap.width) return;

                MapEditor.drawTile(tile, map_x, map_y);
            });
        });
    }

    static export()
    {
        var exportData =
        {
            name: MapEditor.currentMap.name,
            width: MapEditor.currentMap.width,
            height: MapEditor.currentMap.height,
            layer: MapEditor.currentMap.layer
        };
        exportJSON(exportData, 'map.json');
    }

    static import(event)
    {
        const fileList = event.target.files;
        if(fileList[0] !== undefined)
        {
            var file = fileList[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => 
            { 
                var importedMap = JSON.parse(reader.result);
                MapEditor.currentMap = Object.assign(new MapEditor, importedMap);
                MapEditor.currentMap.layer = Object.assign(new Layer, importedMap.layer);
                MapEditor.currentMap.layer.convertDataToTiles();
                MapEditor.drawMap();
            }
        }
    }

    static coordinateExists(x, y)
    {
        if(x < 0) return false;
        if(x >= MapEditor.currentMap.width) return false;
        if(y < 0) return false;
        if(y >= MapEditor.currentMap.height) return false;

        return true;
    }

    static flood(x, y, newTile)
    {
        var tryFlood = function(x, y, startTile, newTile)
        {
            if(MapEditor.coordinateExists(x, y) && MapEditor.currentMap.layer.tile(x, y).isIdentical(startTile))
            {
                MapEditor.currentMap.tileChangeCollection.add(new TileChange(x, y, startTile, newTile));
                MapEditor.setTile(newTile, x, y);
                newFloodCenter(x, y, startTile, newTile);
            }
        }

        var newFloodCenter = function(centerX, centerY, startTile, newTile)
        {
            var x, y;
    
            // top
            x = centerX;
            y = centerY - 1;
            tryFlood(x, y, startTile, newTile);
    
            // bottom
            x = centerX;
            y = centerY + 1;
            tryFlood(x, y, startTile, newTile);
    
            // left
            x = centerX - 1;
            y = centerY;
            tryFlood(x, y, startTile, newTile);
            
            // right
            x = centerX + 1;
            y = centerY;
            tryFlood(x, y, startTile, newTile);
        }
    
        var startTile = MapEditor.currentMap.layer.tile(x, y);

        if(newTile.isIdentical(startTile)) return;
        
        MapEditor.setTile(newTile, x, y);
        MapEditor.currentMap.tileChangeCollection = new TileChangeCollection();
        MapEditor.currentMap.tileChangeCollection.add(new TileChange(x, y, startTile, newTile));
        
        newFloodCenter(x, y, startTile, newTile);

        History.add(MapEditor.currentMap.tileChangeCollection);
    }
}