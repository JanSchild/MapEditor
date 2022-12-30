// MAP
var map = new Map('My first map', 50, 30);
map.canvas.addEventListener('click', mapClicked);
map.canvas.addEventListener('mousemove', mapClicked);

document.addEventListener('keydown', (event) =>
{
    if(event.code == 'KeyF')
        map.canvas.style.cursor = 'copy';
});

document.addEventListener('keyup', (event) =>
{
    if(event.code == 'KeyF')
        map.canvas.style.cursor = 'auto';
});

function mapClicked(event)
{
    // check if left mouse button is held down
    if(event.which == 1)
    {
        var map_x = parseInt(event.offsetX / Tileset.tileWidth);
        var map_y = parseInt(event.offsetY / Tileset.tileHeight);
        var new_tile = new Tile(Tileset.current, Tileset.selectedX, Tileset.selectedY);

        // flood tool 
        if(activeKeys.has('KeyF'))
        {
            map.flood(new_tile, map_x, map_y);
            return;
        }
        // single tile
        map.setTile(new_tile, map_x, map_y);        
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
            map = new Map(importedMap.name, importedMap.width, importedMap.height);
            map.layer = importedMap.layer;
            map.setSize(importedMap.width, importedMap.height);
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
window.addEventListener('keydown', (event) => { activeKeys.add(event.code); console.log(activeKeys) });
window.addEventListener('keyup', (event) => { activeKeys.delete(event.code) });
window.addEventListener('keydown', (event) => 
{
    if(event.ctrlKey && event.code == 'KeyZ')
        console.log('Undo!');
    if(event.ctrlKey && event.code == 'KeyY')
        console.log('Redo!');
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