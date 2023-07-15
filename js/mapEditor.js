class MapEditor
{
    static context = UI.canvas.map.getContext('2d');

    static currentMap = new GameMap('Sample map', 30, 20);

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
        if(!MapEditor.currentMap.coordinateExists(x, y)) return;
        if(MapEditor.currentMap.layer.tile(x, y).isIdentical(newTile)) return;
        
        MapEditor.clearTile(x, y);
        MapEditor.currentMap.layer.setTile(newTile, x, y);
        MapEditor.drawTile(newTile, x, y);
    }

    static drawTile(newTile, map_x, map_y)
    {
        if(newTile.isEmpty()) return;

        if(!TilePicker.filenames.has(newTile.filename))
        {
            console.error(`${newTile.filename} not found.`);
            return;
        }

        if(!TilePicker.loadedFiles.has(newTile.filename))
        {
            console.error(`${newTile.filename} has not loaded yet.`);
            return;
        }

        let tileset_image = TilePicker.images[newTile.filename];

        let draw_x = map_x * Tileset.tileWidth;
        let draw_y = map_y * Tileset.tileHeight;
        
        let source_x = newTile.x * Tileset.tileWidth;
        let source_y = newTile.y * Tileset.tileHeight;

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

    static flood(x, y, newTile)
    {
        let tryFlood = function(x, y, startTile, newTile)
        {
            if(MapEditor.currentMap.coordinateExists(x, y) && MapEditor.currentMap.layer.tile(x, y).isIdentical(startTile))
            {
                History.addToCollection(new TileChange(x, y, startTile, newTile));
                MapEditor.setTile(newTile, x, y);
                newFloodCenter(x, y, startTile, newTile);
            }
        }

        let newFloodCenter = function(centerX, centerY, startTile, newTile)
        {
            let x, y;
    
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
    
        let startTile = MapEditor.currentMap.layer.tile(x, y);

        if(newTile.isIdentical(startTile)) return;
        
        MapEditor.setTile(newTile, x, y);
        History.addToCollection(new TileChange(x, y, startTile, newTile));
        
        newFloodCenter(x, y, startTile, newTile);

        History.submitCollection();
    }

    static export()
    {
        let exportData = MapEditor.currentMap.serialize();
        let blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });

        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.setAttribute('download', 'map.json');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    static import(event)
    {
        let fileList = event.target.files;
        if(fileList[0] !== undefined)
        {
            let file = fileList[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => 
            { 
                MapEditor.currentMap = GameMap.deserialize(reader.result);
                MapEditor.drawMap();
            }
        }
    }
}