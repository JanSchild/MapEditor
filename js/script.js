// MAP
var map = new GameMap('My first map', 50, 30);
GameMap.canvas.addEventListener('mousedown', placeTileOnMap);
GameMap.canvas.addEventListener('mousemove', placeTileOnMap);

function placeTileOnMap(event)
{ 
    // check if left mouse button is held down
    if(event.buttons == 1)
    {
        var map_x = parseInt(event.offsetX / Tileset.tileWidth);
        var map_y = parseInt(event.offsetY / Tileset.tileHeight);
        var new_tile = new Tile(Tileset.current, Tileset.selectedX, Tileset.selectedY);
        var old_tile = map.layer.tile(map_x, map_y);

        if(new_tile.isIdentical(old_tile)) return;

        // flood tool 
        if(activeKeys.has('KeyF'))
        {
            map.flood(map_x, map_y, new_tile);
            return;
        }
        // single tile
        map.setTile(new_tile, map_x, map_y);  

        var changes = new TileChangeCollection();
        changes.add(new TileChange(map_x, map_y, old_tile, new_tile));
        History.add(changes);
    }
}

// MAP IMPORT, EXPORT
var fileSelector = document.getElementById('map-importer');
fileSelector.addEventListener('change', importMap);

function importMap(event)
{
    const fileList = event.target.files;
    if(fileList[0] !== undefined)
    {
        var file = fileList[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => 
        { 
            var importedMap = JSON.parse(reader.result);
            // map = new GameMap(importedMap.name, importedMap.width, importedMap.height);
            // map.layer.import(importedMap);
            // map.drawMap();
            map.import(importedMap);
        }
    }
}

// TILESET
Tileset.generateDropdownMenu();
Tileset.loadTilesets();
Tileset.canvas.addEventListener('click', Tileset.selectTile);
Tileset.chooser.addEventListener('change', Tileset.change);

// KEYBOARD MANAGEMENT
var activeKeys = new Set();
window.addEventListener('keydown', (event) => { activeKeys.add(event.code) });
window.addEventListener('keyup', (event) => { activeKeys.delete(event.code) });
window.addEventListener('keydown', (event) => 
{
    if(event.ctrlKey && event.code == 'KeyZ')
        History.undo();
    if(event.ctrlKey && event.code == 'KeyY')
        History.redo();
});
window.addEventListener('keydown', (event) =>
{
    if(event.code == 'KeyF')
        GameMap.canvas.style.cursor = 'copy';
});

window.addEventListener('keyup', (event) =>
{
    if(event.code == 'KeyF')
        GameMap.canvas.style.cursor = 'auto';
});

// UTILITY FUNCTIONS
function limitValue(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

function exportJSON(data, filename) 
{
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], 
        { type: 'application/json' }));
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}