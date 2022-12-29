// MAP
var map = new Map('My first map', 50, 30);

map.canvas.addEventListener('click', mapClicked);
map.canvas.addEventListener('mousemove', mapClicked);

function mapClicked(event)
{
    // check if left mouse button is held down
    if(event.which == 1)
    {
        var map_x = parseInt(event.offsetX / Tileset.tileWidth);
        var map_y = parseInt(event.offsetY / Tileset.tileHeight);
        var new_tile = new Tile(Tileset.current, Tileset.selectedX, Tileset.selectedY);

        // flood tool 
        // if(event.altKey)
        // {
        //     map.flood(map_x, map_y, new_tile);
        //     return;
        // }
        // single tile
        map.setTile(new_tile, map_x, map_y);        
    }
}


// TILESET
Tileset.canvas.addEventListener('click', Tileset.selectTile);
Tileset.chooser.addEventListener('change', Tileset.change);

Tileset.generateDropdownMenu();
Tileset.loadTilesets();

// FUNCTIONS

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

const fileSelector = document.getElementById("map-importer");
fileSelector.addEventListener('change', importMap);

function valueRange(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}