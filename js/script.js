// MAP
var map = new Map('My first map', 50, 30);

map.canvas.addEventListener("click", mapClicked);
map.canvas.addEventListener("mousemove", mapClicked);

function mapClicked(event)
{
    // check if left mouse button is held down
    if(event.which == 1)
    {
        var map_x = parseInt(event.offsetX / Tileset.tileWidth);
        var map_y = parseInt(event.offsetY / Tileset.tileHeight);
        var new_tile = [current_tileset_name, Tileset.selectedX, Tileset.selectedY];
        map.setTile(map_x, map_y, new_tile);        
    }
}


// TILESET
Tileset.canvas.addEventListener("click", Tileset.selectTile);
Tileset.chooser.addEventListener("change", Tileset.change);

var current_tileset_name = Tileset.filenames[0];

Tileset.generateDropdownMenu();
Tileset.loadTilesets();




















// var map =
// {
//     name: "A little grass",
//     width: 20,
//     height: 20,
//     layers:
//     [
//         [0,44,4,5,3,23,4,5,6],
//         [3,34,5,45,3,5,66,5453,43]
//     ]
// };


function exportJSON(data) 
{
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], 
        { type: "application/json" }));
    a.setAttribute("download", "map.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function downloadMap()
{
    exportJSON(map.layer);
}

function importMap(event)
{
    const fileList = event.target.files;
    if(fileList[0] !== undefined)
    {
        var file = fileList[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => { map.layer = JSON.parse(reader.result); map.drawMap(); };
    }
}

const fileSelector = document.getElementById("map-importer");
fileSelector.addEventListener('change', importMap);