class Tile
{
    /**
     * @param {string} filename - name of tileset.
     * @param {number} x - position in tileset.
     * @param {number} y - position in tileset.
     */
    constructor(filename, x, y)
    {
        this.filename = filename;
        this.x = x;
        this.y = y;
    }

    static emptyTile()
    {
        return new Tile(null, null, null);
    }

    isEmpty()
    {
        return this.filename == 'empty' || this.filename == '' || this.filename == undefined;
    }

    toString()
    {
        if(this.isEmpty())
            return 'emptyTile';
        else
            return this.filename + ',' + this.x + ',' + this.y;
    }

    isIdentical(otherTile)
    {
        return this.toString() === otherTile.toString();
    }
}