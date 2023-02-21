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

function mapClick(event)
{ 
    // check if left mouse button is held down
    if(event.buttons == 1)
    {
        var map_x = parseInt(event.offsetX / Tileset.tileWidth);
        var map_y = parseInt(event.offsetY / Tileset.tileHeight);
        var new_tile = new Tile(Tileset.current, TilePicker.selectedX, TilePicker.selectedY);
        var old_tile = MapEditor.currentMap.layer.tile(map_x, map_y);

        if(new_tile.isIdentical(old_tile)) return;

        // flood tool 
        if(activeKeys.has('KeyF'))
        {
            MapEditor.flood(map_x, map_y, new_tile);
            return;
        }
        // single tile
        MapEditor.setTile(new_tile, map_x, map_y);  

        History.addToCollection(new TileChange(map_x, map_y, old_tile, new_tile));
        History.submitCollection();
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