class Map
{
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

        this.mapWidthInput.value = this.width;
        this.mapWidthInput.addEventListener('change', (event) =>
        {
            this.setSize(event.target.value, this.height);
        });

        this.mapHeightInput.value = this.height;
        this.mapHeightInput.addEventListener('change', (event) =>
        {
            this.setSize(this.width, event.target.value);
        });

    }

    setSize(width, height)
    {
        this.width = width;
        this.height = height;
        
        this.canvas.width = Tileset.tileWidth * width;
        this.canvas.height = Tileset.tileHeight * height;

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
        if(this.layer[y] == undefined)
        {
            this.layer[y] = new Array();
        }

        if(this.layer[y][x] != undefined)
        {
            if(this.layer[y][x].join(',') == new_tile.join(','))
            {
                console.log('identical');
                return; // identical tile doesn't need to be redrawn
            }
        }
        
        this.clearTile(x, y);

        this.layer[y][x] = new_tile;

        this.drawTile(current_tileset_name, Tileset.selectedX, Tileset.selectedY, x, y);
    }

    drawTile(tileset_name, tile_x, tile_y, map_x, map_y)
    {
        if(!Tileset.filenames.includes(tileset_name))
        {
            console.error(`${tileset_name} not found.`);
            return;
        }

        var tileset_image = Tileset.images[tileset_name];

        var draw_x = map_x * Tileset.tileWidth;
        var draw_y = map_y * Tileset.tileHeight;
        
        var source_x = tile_x * Tileset.tileWidth;
        var source_y = tile_y * Tileset.tileHeight;

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

                var tileset_name = tile[0];
                var tile_x = tile[1];
                var tile_y = tile[2];
                this.drawTile(tileset_name, tile_x, tile_y, map_x, map_y);
            });
        });
    }

    flood(startX, startY, newTile)
    {
        console.log("FLOOD!");
    }
}