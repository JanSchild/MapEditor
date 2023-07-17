class TileChange
{
    constructor(mapX, mapY, oldTile, newTile, layer)
    {
        this.mapX = mapX;
        this.mapY = mapY;
        this.oldTile = oldTile; // TODO: replace with Object.assign()
        this.newTile = newTile;
        this.layer = layer;
    }
}
