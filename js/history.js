class History
{
    static previous = new Array();
    static next = new Array();

    static add(someChange)
    {
        History.next = new Array();
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