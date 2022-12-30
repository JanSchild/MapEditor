class History
{
    static previous = new Array();
    static next = new Array();

    static do(someChange)
    {
        var next = new Array();
        History.previous.push(someChange);
    }

    static undo()
    {
        var lastChange = History.previous.pop();
        if(lastChange != undefined)
        {
            History.next.unshift(lastChange);
            console.log(`Undo last change: ${lastChange}`);
            console.log(`Type of change: ${lastChange.constructor.name}`);

            if(lastChange.constructor.name == 'TileChangeCollection')
                lastChange.changeToOldTiles();
        }
    }

    static redo()
    {
        var nextChange = History.next.shift();
        if(nextChange != undefined)
        {
            History.previous.push(nextChange);
            console.log(`Redo next change: ${nextChange}`);
            console.log(`Type of change: ${nextChange.constructor.name}`);

            if(nextChange.constructor.name == 'TileChangeCollection')
                nextChange.changeToNewTiles();
        }
    }
}

class TileChange
{
    constructor(mapX, mapY, oldTile, newTile)
    {
        this.mapX = mapX;
        this.mapY = mapY;
        this.oldTile = oldTile;
        this.newTile = newTile;
    }
}

class TileChangeCollection
{
    constructor()
    {
        this.tileChanges = new Array();
    }

    add(tileChange)
    {
        this.tileChanges.push(tileChange);
    }

    changeToNewTiles()
    {
        this.tileChanges.foreach((tileChange) =>
        {
            map.setTile(tileChange.newTile, tileChange.mapX, tileChange.mapY);
        });
    }

    changeToOldTiles()
    {
        this.tileChanges.foreach((tileChange) =>
        {
            map.setTile(tileChange.oldTile, tileChange.mapX, tileChange.mapY);
        });
    }
}