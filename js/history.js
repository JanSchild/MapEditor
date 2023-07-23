class History
{
    static previous = new Array();
    static next = new Array();

    static tileChangeCollection = new Array();

    static addToCollection(tileChange)
    {
        if(tileChange.newTile.isIdentical(tileChange.oldTile)) return;
        History.tileChangeCollection.push(tileChange);
        console.log("Added to collection!");
        console.log(this.tileChangeCollection);
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
            // undo changes in reverse order
            for(let i = lastChange.length - 1; i >= 0; i--)
            {
                let tileChange = lastChange[i];
                MapEditor.setTile(tileChange.oldTile, tileChange.mapX, tileChange.mapY, false);
            }
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
                MapEditor.setTile(tileChange.newTile, tileChange.mapX, tileChange.mapY, false);
            });
        }
        History.updateButtons();
    }

    static clear()
    {
        History.previous = new Array();
        History.next = new Array();
        History.tileChangeCollection = new Array();
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