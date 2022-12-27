class Map
{
    constructor(name, width, height)
    {
        this.name = name;
        this.canvas = document.getElementById('map');
        this.context = this.canvas.getContext('2d');

        this.setSize(width, height);
    
        // (2D array: layer[y][x] = row y, column x)
        // (values are arrays: [tilesetName, tileX, tileY] )
        this.layer = new Array();
    }

    setSize(width, height)
    {
        this.width = width;
        this.height = height;
        
        this.canvas.width = Tileset.tileWidth * width;
        this.canvas.height = Tileset.tileHeight * height;
    }

    drawMap()
    {
        this.clearMap();

        this.layer.forEach((row, map_y) => 
        {
            if(row === null)
                return;

            row.forEach((tile, map_x) =>
            {
                if(tile === null)
                    return;

                var tileset_name = tile[0];
                var tile_x = tile[1];
                var tile_y = tile[2];
                this.drawTile(tileset_name, tile_x, tile_y, map_x, map_y);
            });
        });
    }

    clearMap()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearTile(x, y)
    {
        this.context.clearRect(x * Tileset.tileWidth, y * Tileset.tileHeight, Tileset.tileWidth, Tileset.tileHeight);
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
                return; // identical tile doesn't need to be redrawn
            }
        }
        
        this.layer[y][x] = new_tile;

        this.clearTile(x, y);
        this.drawTile(current_tileset_name, Tileset.selectedX, Tileset.selectedY, x, y);
    }
}