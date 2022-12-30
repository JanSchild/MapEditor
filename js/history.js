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
        }
    }

    static redo()
    {
        var nextChange = History.next.shift();
        if(nextChange != undefined)
        {
            History.previous.push(nextChange);
            console.log(`Redo next change: ${nextChange}`);
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