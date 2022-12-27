class Tile
{
    constructor(filename, x, y)
    {
        this.filename = filename;
        this.x = x;
        this.y = y;
    }

    asString()
    {
        return this.filename + ',' + this.x + ',' + this.y;
    }

    isIdentical(otherTile)
    {
        return this.asString() === otherTile.asString();
    }
}