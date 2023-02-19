// TILESET
UI.canvas.tileset.addEventListener('click', Tileset.selectTile);
UI.dropdown.tilesets.addEventListener('change', Tileset.change);

// MAP
UI.button.saveMap.addEventListener('click', GameMap.current.download);
UI.filechooser.mapUpload.addEventListener('change', importMap);

UI.textfield.mapName.addEventListener('change', (event) =>
{
    GameMap.current.name = event.target.value;
});

UI.textfield.mapWidth.addEventListener('change', (event) =>
{
    var newValue = parseInt(event.target.value);
    if(isNaN(newValue)) { UI.textfield.mapWidth.value = GameMap.current.width; return; }
    GameMap.current.width = newValue;
});

UI.textfield.mapHeight.addEventListener('change', (event) =>
{
    var newValue = parseInt(event.target.value);
    if(isNaN(newValue)) { UI.textfield.mapHeight.value = GameMap.current.height; return; }
    GameMap.current.height = newValue;
});

// MAPPING
UI.canvas.map.addEventListener('mousedown', placeTileOnMap);
UI.canvas.map.addEventListener('mousemove', placeTileOnMap);

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