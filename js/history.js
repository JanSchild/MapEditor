class History
{
    static previous = new Array();
    static next = new Array();

    static tileChangeCollection = new Array();

    static addToCollection(tileChange)
    {
        if(tileChange.newTile.isIdentical(tileChange.oldTile)) return;
        History.tileChangeCollection.push(tileChange);
    }

    static submitCollection()
    {
        if(History.tileChangeCollection.length == 0) return;
        History.next = new Array();
        History.previous.push(History.tileChangeCollection);
        History.tileChangeCollection = new Array();
        History.updateButtons();
    }

    static undo()
    {
        let lastChange = History.previous.pop();
        if(lastChange != undefined)
        {
            History.next.unshift(lastChange);
            lastChange.forEach((tileChange) =>
            {
                MapEditor.setTile(tileChange.oldTile, tileChange.mapX, tileChange.mapY);
            });
        }
        History.updateButtons();
    }

    static redo()
    {
        let nextChange = History.next.shift();
        if(nextChange != undefined)
        {
            History.previous.push(nextChange);
            nextChange.forEach((tileChange) =>
            {
                MapEditor.setTile(tileChange.newTile, tileChange.mapX, tileChange.mapY);
            });
        }
        History.updateButtons();
    }

    static updateButtons()
    {
        if(History.previous.length > 0)
            UI.button.undo.removeAttribute("disabled");
        else
            UI.button.undo.setAttribute("disabled", "disabled");

        if(History.next.length > 0)
            UI.button.redo.removeAttribute("disabled");
        else
            UI.button.redo.setAttribute("disabled", "disabled");
    }
}