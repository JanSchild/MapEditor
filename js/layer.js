class Layer
{
    constructor(rows)
    {
        this.data = new Array();
        this.expandToRows(rows);
    }

    expandToRows(rows)
    {
        while(this.data.length < rows) this.data.push(new Array());
    }

    row(y)
    {
        return this.data[y] ?? new Array();
    }

    tile(x, y)
    {
        return this.row(y)[x] ?? Tile.emptyTile();
    }

    setTile(tile, x, y)
    {
        this.expandToRows(y + 1);
        this.data[y][x] = tile;
    }

    unsetTile(x, y)
    {
        this.setTile(null, x, y);
    }

    import(importedMap)
    {
        this.data = new Array();

        importedMap.layer.data.forEach((row, map_y) => 
        {
            this.data.push(new Array());

            row.forEach((tile, map_x) =>
            {
                if(tile == null || tile.filename == null)
                    this.data[map_y].push(Tile.emptyTile());
                else
                    this.data[map_y].push(new Tile(tile.filename, tile.x, tile.y));
            });
        });
    }
}