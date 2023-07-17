class TileChange
{
    constructor(mapX, mapY, oldTile, newTile, layer)
    {
        this.mapX = mapX;
        this.mapY = mapY;
        this.oldTile = Object.assign(Tile.emptyTile(), oldTile);
        this.newTile = Object.assign(Tile.emptyTile(), newTile);
        this.layer = layer;
    }
}
