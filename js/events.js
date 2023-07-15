// TILESET
UI.canvas.tileset.addEventListener('click', TilePicker.selectTile);
UI.dropdown.tilesets.addEventListener('change', TilePicker.change);

// MAP
UI.button.saveMap.addEventListener('click', MapEditor.export);
UI.filechooser.mapUpload.addEventListener('change', MapEditor.import);

UI.textfield.mapName.addEventListener('change', (event) =>
{
    MapEditor.currentMap.name = event.target.value;
});

UI.textfield.mapWidth.addEventListener('change', (event) =>
{
    var newValue = parseInt(event.target.value);
    if(isNaN(newValue)) { UI.textfield.mapWidth.value = MapEditor.currentMap.width; return; }
    MapEditor.currentMap.width = newValue;
    MapEditor.drawMap();
});

UI.textfield.mapHeight.addEventListener('change', (event) =>
{
    var newValue = parseInt(event.target.value);
    if(isNaN(newValue)) { UI.textfield.mapHeight.value = MapEditor.currentMap.height; return; }
    MapEditor.currentMap.height = newValue;
    MapEditor.drawMap();
});

// MAPPING
UI.canvas.map.addEventListener('mousedown', mapClick);
UI.canvas.map.addEventListener('mousemove', mapClick);

function mapClick(event)
{ 
    // check if left mouse button is held down
    if(event.buttons == 1)
    {
        var map_x = parseInt(event.offsetX / Tileset.tileWidth);
        var map_y = parseInt(event.offsetY / Tileset.tileHeight);
        var new_tile = TilePicker.currentTile;
        var old_tile = MapEditor.currentMap.layer.tile(map_x, map_y);

        if(new_tile.isIdentical(old_tile)) return;

        var tool = document.querySelector("input[name='tool']:checked").value;

        switch(tool)
        {
            case "single":
                MapEditor.setTile(new_tile, map_x, map_y);  

                History.addToCollection(new TileChange(map_x, map_y, old_tile, new_tile));
                History.submitCollection();
                break;
            case "fill":
                MapEditor.flood(map_x, map_y, new_tile);
                break;
        }
    }
}

// ACTIVE KEYS
var activeKeys = new Set();
window.addEventListener('keydown', (event) => { activeKeys.add(event.code) });
window.addEventListener('keyup', (event) => { activeKeys.delete(event.code) });

// HISTORY
window.addEventListener('keydown', (event) => 
{
    if(event.ctrlKey && event.code == 'KeyZ')
        History.undo();
    if(event.ctrlKey && event.code == 'KeyY')
        History.redo();
});

// CURSOR
window.addEventListener('keydown', (event) =>
{
    if(event.code == 'KeyF')
        UI.canvas.map.style.cursor = 'copy';
});

window.addEventListener('keyup', (event) =>
{
    if(event.code == 'KeyF')
        UI.canvas.map.style.cursor = 'auto';
});

UI.button.singleTool.addEventListener('change', changeTool);
UI.button.fillTool.addEventListener('change', changeTool);

function changeTool()
{
    var tool = document.querySelector("input[name='tool']:checked").value;

    switch(tool)
        {
            case "single":
                UI.canvas.map.style.cursor = 'auto';
                break;
            case "fill":
                UI.canvas.map.style.cursor = 'copy';
                break;
        }
}