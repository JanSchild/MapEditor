class TileChangeCollection
{
    constructor()
    {
        this.reset();
    }

    reset()
    {
        this.tileChanges = new Array();
    }

    add(tileChange)
    {
        this.tileChanges.push(tileChange);
    }

    changeToNewTiles()
    {
        this.tileChanges.forEach((tileChange) =>
        {
            map.setTile(tileChange.newTile, tileChange.mapX, tileChange.mapY);
        });
    }

    changeToOldTiles()
    {
        this.tileChanges.forEach((tileChange) =>
        {
            map.setTile(tileChange.oldTile, tileChange.mapX, tileChange.mapY);
        });
    }
}