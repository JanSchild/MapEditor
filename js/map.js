class Map
{
    static minWidth = 20;
    static maxWidth = 1000;
    
    static minHeight = 15;
    static maxHeight = 100;
    
    constructor(name, width, height)
    {
        this.name = name;
        this.width = width;
        this.height = height;
        
        this.mapNameInput = document.getElementById('map-name');
        this.mapWidthInput = document.getElementById('map-width');
        this.mapHeightInput = document.getElementById('map-height');

        this.canvas = document.getElementById('map');
        this.context = this.canvas.getContext('2d');

        this.layer = new Layer(height);

        this.setSize(width, height);

        this.mapNameInput.value = this.name;
        this.mapNameInput.addEventListener('change', (event) =>
        {
            this.name = event.target.value;
        });

        this.mapWidthInput.addEventListener('change', (event) =>
        {
            var newValue = parseInt(event.target.value);
            if(isNaN(newValue)) { this.mapWidthInput.value = this.width; return; }
            this.setSize(newValue, this.height);
        });

        this.mapHeightInput.addEventListener('change', (event) =>
        {
            var newValue = parseInt(event.target.value);
            if(isNaN(newValue)) { this.mapHeightInput.value = this.height; return; }
            this.setSize(this.width, newValue);
        });

    }

    setSize(width, height)
    {
        width = valueRange(width, Map.minWidth, Map.maxWidth);
        height = valueRange(height, Map.minHeight, Map.maxHeight);

        this.width = width;
        this.height = height;
        
        this.canvas.width = Tileset.tileWidth * width;
        this.canvas.height = Tileset.tileHeight * height;

        this.mapWidthInput.value = width;
        this.mapHeightInput.value = height;

        this.drawMap();
    }

    clearCanvas()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearTile(x, y)
    {
        this.context.clearRect(x * Tileset.tileWidth, y * Tileset.tileHeight, Tileset.tileWidth, Tileset.tileHeight);
        this.layer.unsetTile(x, y);
    }
      
    setTile(newTile, x, y) 
    {
        if(this.layer.tile(x, y).isIdentical(newTile))
        {
            console.log('identical');
            return; // identical tile doesn't need to be redrawn
        }
        
        this.clearTile(x, y);
        this.layer.setTile(newTile, x, y);
        this.drawTile(newTile, x, y);
    }

    drawTile(newTile, map_x, map_y)
    {
        if(!Tileset.filenames.includes(newTile.filename))
        {
            console.error(`${newTile.filename} not found.`);
            return;
        }

        var tileset_image = Tileset.images[newTile.filename];

        var draw_x = map_x * Tileset.tileWidth;
        var draw_y = map_y * Tileset.tileHeight;
        
        var source_x = newTile.x * Tileset.tileWidth;
        var source_y = newTile.y * Tileset.tileHeight;

        this.context.drawImage(tileset_image, source_x, source_y, Tileset.tileWidth, Tileset.tileHeight, 
            draw_x, draw_y, Tileset.tileWidth, Tileset.tileHeight);
    }

    drawMap()
    {
        this.clearCanvas();

        this.layer.data.forEach((row, map_y) => 
        {
            if(map_y >= this.height) return;

            row.forEach((tile, map_x) =>
            {
                if(tile.isEmpty()) return;
                if(map_x >= this.width) return;

                this.drawTile(tile, map_x, map_y);
            });
        });
    }

    download()
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

    // flood(startX, startY, newTile)
    // {
    //     var x = startX;
    //     var y = startY;

    //     var startTile = this.layer[y][x];
        

    //     if(y - 1 < 0) return;
    //     if(y + 1 >= this.height) return;
    //     if(x - 1 < 0) return;
    //     if(x + 1 >= this.width) return;
    // }
}