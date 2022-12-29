class Tile
{
    constructor(filename, x, y)
    {
        this.filename = filename;
        this.x = x;
        this.y = y;
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
        return this.toString() === otherTile.asString();
    }
}