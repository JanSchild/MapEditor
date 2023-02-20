// TILESET
UI.canvas.tileset.addEventListener('click', Tileset.selectTile);
UI.dropdown.tilesets.addEventListener('change', Tileset.change);

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