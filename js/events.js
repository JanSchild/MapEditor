// TILESET
UI.canvas.tileset.addEventListener('click', TilePicker.selectTile);
UI.dropdown.tilesets.addEventListener('change', TilePicker.change);

// MAP
UI.textfield.mapName.addEventListener('change', (event) =>
{
    MapEditor.currentMap.name = event.target.value;
});

UI.textfield.mapWidth.addEventListener('change', (event) =>
{
    let newValue = parseInt(event.target.value);
    if(isNaN(newValue)) { UI.textfield.mapWidth.value = MapEditor.currentMap.width; return; }
    MapEditor.currentMap.width = newValue;
    MapEditor.drawMap();
});

UI.textfield.mapHeight.addEventListener('change', (event) =>
{
    let newValue = parseInt(event.target.value);
    if(isNaN(newValue)) { UI.textfield.mapHeight.value = MapEditor.currentMap.height; return; }
    MapEditor.currentMap.height = newValue;
    MapEditor.drawMap();
});

// FILE
UI.button.saveMap.addEventListener('click', MapEditor.export);
UI.filechooser.mapUpload.addEventListener('change', MapEditor.import);

// TOOL
UI.button.singleTool.addEventListener('change', changeTool);
UI.button.fillTool.addEventListener('change', changeTool);
UI.button.eraserTool.addEventListener('change', changeTool);

function changeTool()
{
    let tool = document.querySelector("input[name='tool']:checked").value;

    switch(tool)
        {
            case "single":
                UI.canvas.map.style.cursor = 'auto';
                break;
            case "fill":
                UI.canvas.map.style.cursor = 'copy';
                break;
            case "eraser":
                UI.canvas.map.style.cursor = 'not-allowed';
                break;
            default:
                UI.canvas.map.style.cursor = 'auto';
                break;
        }
}

// HISTORY
UI.button.undo.addEventListener('click', History.undo);
UI.button.redo.addEventListener('click', History.redo);

// MAPPING
UI.canvas.map.addEventListener('mousedown', setTile);
UI.canvas.map.addEventListener('mousemove', setTile);
document.addEventListener('mouseup', () => { History.submitCollection() });

function setTile(event)
{ 
    // check if left mouse button is held down
    if(event.buttons == 1)
    {
        let map_x = parseInt(event.offsetX / Tileset.tileWidth);
        let map_y = parseInt(event.offsetY / Tileset.tileHeight);
        let new_tile = Object.assign(Tile.emptyTile(), TilePicker.currentTile);
        let old_tile = MapEditor.currentMap.layer.tile(map_x, map_y);

        let tool = document.querySelector("input[name='tool']:checked").value;

        switch(tool)
        {
            case "eraser":
                new_tile = Tile.emptyTile();
            case "single":
                MapEditor.setTile(new_tile, map_x, map_y);  

                History.addToCollection(new TileChange(map_x, map_y, old_tile, new_tile));
                break;
            case "fill":
                MapEditor.flood(map_x, map_y, new_tile);
                break;
        }
    }
}

// ACTIVE KEYS
let activeKeys = new Set();
window.addEventListener('keydown', (event) => { activeKeys.add(event.code) });
window.addEventListener('keyup', (event) => { activeKeys.delete(event.code) });