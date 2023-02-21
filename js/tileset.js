class Tileset
{
    static tileWidth = 32;
    static tileHeight = 32;

    constructor(filename, displayName)
    {
        this.filename = filename;
        this.displayName = displayName;
        this.image = new Image();
    } 
}