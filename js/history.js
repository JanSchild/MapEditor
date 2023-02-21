class History
{
    static previous = new Array();
    static next = new Array();

    static tileChangeCollection = new Array();

    static addToCollection(someChange)
    {
        History.tileChangeCollection.push(someChange);
    }

    static submitCollection()
    {
        History.next = new Array();
        History.previous.push(History.tileChangeCollection);
        History.tileChangeCollection = new Array();
    }

    static undo()
    {
        var lastChange = History.previous.pop();
        if(lastChange != undefined)
        {
            History.next.unshift(lastChange);
            lastChange.forEach((tileChange) =>
            {
                MapEditor.setTile(tileChange.oldTile, tileChange.mapX, tileChange.mapY);
            });
        }
    }

    static redo()
    {
        var nextChange = History.next.shift();
        if(nextChange != undefined)
        {
            History.previous.push(nextChange);
            nextChange.forEach((tileChange) =>
            {
                MapEditor.setTile(tileChange.newTile, tileChange.mapX, tileChange.mapY);
            });
        }
    }
}