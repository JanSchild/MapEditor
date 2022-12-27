class Map
{
    static maxWidth = 1000;
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

        // (2D array: layer[y][x] = row y, column x)
        // (values are arrays: [tilesetName, tileX, tileY] )
        this.layer = new Array();

        this.setSize(width, height);

        this.mapNameInput.value = this.name;
        this.mapNameInput.addEventListener('change', (event) =>
        {
            this.name = event.target.value;
        });

        this.mapWidthInput.addEventListener('change', (event) =>
        {
            var newValue = parseInt(event.target.value);

            if(isNaN(newValue))
            {
                this.mapWidthInput.value = this.width;
                return;
            }

            if(newValue > 0) this.setSize(newValue, this.height);
        });

        this.mapHeightInput.addEventListener('change', (event) =>
        {
            var newValue = parseInt(event.target.value);

            if(isNaN(newValue))
            {
                this.mapHeightInput.value = this.height;
                return;
            }

            if(newValue > 0) this.setSize(this.width, newValue);
        });

    }

    setSize(width, height)
    {
        if(width > Map.maxWidth) width = Map.maxWidth;
        if(height > Map.maxHeight) height = Map.maxHeight;

        this.width = width;
        this.height = height;
        
        this.canvas.width = Tileset.tileWidth * width;
        this.canvas.height = Tileset.tileHeight * height;

        this.mapWidthInput.value = width;
        this.mapHeightInput.value = height;

        while(this.layer.length < height) this.layer.push(new Array());

        this.drawMap();
    }

    clearCanvas()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearTile(x, y)
    {
        this.context.clearRect(x * Tileset.tileWidth, y * Tileset.tileHeight, Tileset.tileWidth, Tileset.tileHeight);
        this.layer[y][x] = null;
    }
      
    setTile(x, y, new_tile) 
    {
        if(this.layer[y][x] != undefined)
        {
            if(this.layer[y][x].isIdentical(new_tile));
            {
                console.log('identical');
                return; // identical tile doesn't need to be redrawn
            }
        }
        
        this.clearTile(x, y);

        this.layer[y][x] = new_tile;

        this.drawTile(new_tile, x, y);
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

        this.layer.forEach((row, map_y) => 
        {
            if(row === null)
                return;

            if(map_y > this.height)
                return;

            row.forEach((tile, map_x) =>
            {
                if(tile === null)
                    return;

                if(map_x > this.width)
                    return;

                this.drawTile(tile, map_x, map_y);
            });
        });
    }

    flood(startX, startY, newTile)
    {
        console.log("FLOOD!");
    }
}