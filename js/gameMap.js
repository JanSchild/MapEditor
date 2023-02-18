class GameMap
{
    static minWidth = 20;
    static maxWidth = 1000;
    
    static minHeight = 15;
    static maxHeight = 100;
    
    static canvas = document.getElementById('map');
    static context = GameMap.canvas.getContext('2d');

    constructor(name, width, height)
    {
        this.name = name;
        this.width = width;
        this.height = height;
        
        this.layer = new Layer(height);

        this.setSize(width, height);

        UI.textfield.mapName.value = this.name;
        UI.textfield.mapName.addEventListener('change', (event) =>
        {
            this.name = event.target.value;
        });

        UI.textfield.mapWidth.addEventListener('change', (event) =>
        {
            var newValue = parseInt(event.target.value);
            if(isNaN(newValue)) { UI.textfield.mapWidth.value = this.width; return; }
            this.setSize(newValue, this.height);
        });

        UI.textfield.mapHeight.addEventListener('change', (event) =>
        {
            var newValue = parseInt(event.target.value);
            if(isNaN(newValue)) { UI.textfield.mapHeight.value = this.height; return; }
            this.setSize(this.width, newValue);
        });

    }

    // add GETTERS and SETTERS for NAME, WIDTH, HEIGHT !!!

    setSize(width, height)
    {
        width = limitValue(width, GameMap.minWidth, GameMap.maxWidth);
        height = limitValue(height, GameMap.minHeight, GameMap.maxHeight);

        this.width = width;
        this.height = height;
        
        GameMap.canvas.width = Tileset.tileWidth * width;
        GameMap.canvas.height = Tileset.tileHeight * height;

        UI.textfield.mapWidth.value = width;
        UI.textfield.mapHeight.value = height;

        this.drawMap();
    }

    clearCanvas()
    {
        GameMap.context.clearRect(0, 0, GameMap.canvas.width, GameMap.canvas.height);
    }

    clearTile(x, y)
    {
        GameMap.context.clearRect(x * Tileset.tileWidth, y * Tileset.tileHeight, Tileset.tileWidth, Tileset.tileHeight);
        this.layer.unsetTile(x, y);
    }
      
    setTile(newTile, x, y) 
    {
        if(!this.coordinateExists(x, y)) return;
        if(this.layer.tile(x, y).isIdentical(newTile)) return;
        
        this.clearTile(x, y);
        this.layer.setTile(newTile, x, y);
        this.drawTile(newTile, x, y);
    }

    drawTile(newTile, map_x, map_y) // TODO: make static
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

        GameMap.context.drawImage(tileset_image, source_x, source_y, Tileset.tileWidth, Tileset.tileHeight, 
            draw_x, draw_y, Tileset.tileWidth, Tileset.tileHeight);
    }

    drawMap() // TODO: make static
    {
        this.clearCanvas();

        this.layer.data.forEach((row, map_y) => 
        {
            if(map_y >= this.height) return;

            row.forEach((tile, map_x) =>
            {
                if(tile == null || tile.isEmpty()) return;
                if(map_x >= this.width) return;

                this.drawTile(tile, map_x, map_y);
            });
        });
    }

    download() // TODO: make static
    {
        var exportData =
        {
            name: this.name,
            width: this.width,
            height: this.height,
            layer: this.layer
        };
        exportJSON(exportData, 'map.json');
    }

    import(importedMap) // TODO: make static
    {
        this.layer.import(importedMap);

        UI.textfield.mapName.value = importedMap.name;
        this.setSize(importedMap.width, importedMap.height);
    }

    coordinateExists(x, y)
    {
        if(x < 0) return false;
        if(x >= this.width) return false;
        if(y < 0) return false;
        if(y >= this.height) return false;

        return true;
    }

    flood(x, y, newTile)
    {
        var startTile = this.layer.tile(x, y);

        if(newTile.isIdentical(startTile)) return;
        
        this.setTile(newTile, x, y);
        this.tileChangeCollection = new TileChangeCollection();
        this.tileChangeCollection.add(new TileChange(x, y, startTile, newTile));
        
        this.#newFloodCenter(x, y, startTile, newTile);

        History.add(this.tileChangeCollection);
    }

    #newFloodCenter(centerX, centerY, startTile, newTile)
    {
        var x, y;

        // top
        x = centerX;
        y = centerY - 1;
        this.#tryFlood(x, y, startTile, newTile);

        // bottom
        x = centerX;
        y = centerY + 1;
        this.#tryFlood(x, y, startTile, newTile);

        // left
        x = centerX - 1;
        y = centerY;
        this.#tryFlood(x, y, startTile, newTile);
        
        // right
        x = centerX + 1;
        y = centerY;
        this.#tryFlood(x, y, startTile, newTile);
    }

    #tryFlood(x, y, startTile, newTile)
    {
        if(this.coordinateExists(x, y) && this.layer.tile(x, y).isIdentical(startTile))
        {
            this.tileChangeCollection.add(new TileChange(x, y, startTile, newTile));
            this.setTile(newTile, x, y);
            this.#newFloodCenter(x, y, startTile, newTile);
        }
    }
}