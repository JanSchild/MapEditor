class Layer
{
    constructor(rows)
    {
        this.tiles = new Array(); // TODO - rename to this.tiles
        this.#expandToRows(rows);
    }

    #expandToRows(rows)
    {
        while(this.tiles.length < rows) this.tiles.push(new Array());
    }

    #row(y)
    {
        return this.tiles[y] ?? new Array();
    }

    tile(x, y)
    {
        return this.#row(y)[x] ?? Tile.emptyTile();
    }

    setTile(tile, x, y)
    {
        this.#expandToRows(y + 1);
        if(tile != null)
            this.tiles[y][x] = Object.assign(new Tile, tile);
        else
            this.tiles[y][x] = Tile.emptyTile();;
    }

    unsetTile(x, y)
    {
        this.setTile(null, x, y);
    }

    /**
     * This function deserializes layer data from a JSON file.
     */    
    convertDataToTiles()
    {
        this.tiles.forEach((row, map_y) => 
        {
            row.forEach((tile, map_x) =>
            {
                this.setTile(tile, map_x, map_y);
            });
        });
    }
}