class History
{
    static previous = new Array();
    static next = new Array();

    static tileChangeCollection = new TileChangeCollection();

    static addToCollection(someChange)
    {
        History.tileChangeCollection.add(someChange);
    }

    static submitCollection()
    {
        History.next = new Array();
        History.previous.push(History.tileChangeCollection);
        this.tileChangeCollection = new TileChangeCollection();
    }

    static undo()
    {
        var lastChange = History.previous.pop();
        if(lastChange != undefined)
        {
            History.next.unshift(lastChange);
            lastChange.changeToOldTiles();
        }
    }

    static redo()
    {
        var nextChange = History.next.shift();
        if(nextChange != undefined)
        {
            History.previous.push(nextChange);
            nextChange.changeToNewTiles();
        }
    }
}