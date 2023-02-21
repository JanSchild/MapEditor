class Layer
{
    constructor(rows)
    {
        this.data = new Array();
        this.#expandToRows(rows);
    }

    #expandToRows(rows)
    {
        while(this.data.length < rows) this.data.push(new Array());
    }

    #row(y)
    {
        return this.data[y] ?? new Array();
    }

    tile(x, y)
    {
        return this.#row(y)[x] ?? Tile.emptyTile();
    }

    setTile(tile, x, y)
    {
        this.#expandToRows(y + 1);
        if(tile != null)
            this.data[y][x] = new Tile(tile.filename, tile.x, tile.y);
        else
            this.data[y][x] = null;
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
        this.data.forEach((row, map_y) => 
        {
            row.forEach((tile, map_x) =>
            {
                if(tile == null || tile.filename == null)
                    this.data[map_y][map_x] = Tile.emptyTile();
                else
                    this.data[map_y][map_x] = Object.assign(new Tile, tile);
            });
        });
    }
}