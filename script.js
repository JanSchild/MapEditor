// elements 
var tileset_canvas = document.getElementById("tileset");
var tileset_context = tileset_canvas.getContext("2d");

var map_canvas = document.getElementById("map");
var map_context = map_canvas.getContext("2d");

// events
tileset_canvas.addEventListener("click", selectTile);
map_canvas.addEventListener("click", mapClick);
map_canvas.addEventListener("mousemove", mapClick);

// layer
// (multi-dimensional: layer[y][x] = row y, column x)
// (values are arrays: [tilesetName, tileX, tileY] )
var layer = new Array();

// tilesets
const TILE_WIDTH = 32, TILE_HEIGHT = 32;
var selected_tile_x = 0, selected_tile_y = 0, tileset_load_counter = 0;

var tileset_names = ["tilesets/floor.png", "tilesets/forest.png", "tilesets/forest_dead.png"];
var tileset_images = new Array();

var current_tileset_name = tileset_names[0];
var current_tileset_image = new Image();

loadTilesets();

function loadTilesets()
{
    for(var tileset_name of tileset_names)
    {
        var image = new Image();
        image.src = tileset_name;
        image.addEventListener("load", tilesetHasLoaded);
        tileset_images[tileset_name] = image;
    }
}

function tilesetHasLoaded()
{
    tileset_load_counter++;
    if(tileset_load_counter == 1)
    {
        showTileset(current_tileset_name);
    }
}

function showTileset(tileset_name) 
{
    current_tileset_image = tileset_images[tileset_name];

    tileset_canvas.width = current_tileset_image.naturalWidth;
    tileset_canvas.height = current_tileset_image.naturalHeight;

    selected_tile_x = 0;
    selected_tile_y = 0;
    
    drawTileset();
    drawSelector();
}

function drawTileset()
{
    tileset_context.drawImage(current_tileset_image, 0, 0);
}

function selectTile(event)
{
    tileset_context.clearRect(0, 0, tileset_canvas.width, tileset_canvas.height);

    drawTileset();

    selected_tile_x = parseInt(event.offsetX / TILE_WIDTH);
    selected_tile_y = parseInt(event.offsetY / TILE_HEIGHT);

    drawSelector();
}

function drawSelector()
{
    tileset_context.beginPath();
    tileset_context.rect(selected_tile_x * TILE_WIDTH, selected_tile_y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
    tileset_context.closePath();
    tileset_context.strokeStyle = "black";
    tileset_context.stroke();
}

// map 

function drawMap()
{
    clearMap();

    layer.forEach((element, map_y) => {
        if(element === null)
            return;

        element.forEach((tile, map_x) =>
        {
            if(tile === null)
                return;

            var tileset_name = tile[0];
            var tile_x = tile[1];
            var tile_y = tile[2];
            drawTile(tileset_name, tile_x, tile_y, map_x, map_y);
        });
    });
}

function clearMap()
{
    map_context.clearRect(0, 0, map_canvas.width, map_canvas.height);
}

function clearTile(x, y)
{
    map_context.clearRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
}

function drawTile(tileset_name, tile_x, tile_y, map_x, map_y)
{
    if(!tileset_names.includes(tileset_name))
    {
        console.log(`${tileset_name} not found.`);
        return;
    }

    var tileset_image = tileset_images[tileset_name];

    var draw_x = map_x * TILE_WIDTH;
    var draw_y = map_y * TILE_HEIGHT;
    
    var source_x = tile_x * TILE_WIDTH;
    var source_y = tile_y * TILE_HEIGHT;

    map_context.drawImage(tileset_image, source_x, source_y, TILE_WIDTH, TILE_HEIGHT, 
        draw_x, draw_y, TILE_WIDTH, TILE_HEIGHT);
}
    
function mapClick(event) 
{
    // check if left mouse button is held down
    if(event.which == 1)
    {
        var map_x = parseInt(event.offsetX / TILE_WIDTH);
        var map_y = parseInt(event.offsetY / TILE_HEIGHT);

        var new_tile = [current_tileset_name, selected_tile_x, selected_tile_y];

        if(layer[map_y] == undefined)
        {
            layer[map_y] = new Array();
        }

        if(layer[map_y][map_x] != undefined)
        {
            if(layer[map_y][map_x].join(',') == new_tile.join(','))
            {
                return; // identical tile doesn't need to be redrawn
            }
        }
        
        layer[map_y][map_x] = new_tile;

        clearTile(map_x, map_y);
        drawTile(current_tileset_name, selected_tile_x, selected_tile_y, map_x, map_y);
    }
}













var map =
{
    name: "A little grass",
    width: 20,
    height: 20,
    layers:
    [
        [0,44,4,5,3,23,4,5,6],
        [3,34,5,45,3,5,66,5453,43]
    ]
};


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
    exportJSON(layer);
}

function importMap(event)
{
    const fileList = event.target.files;
    if(fileList[0] !== undefined)
    {
        var file = fileList[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => { layer = JSON.parse(reader.result); drawMap(); };
    }
}

  const fileSelector = document.getElementById("map-importer");
  fileSelector.addEventListener('change', importMap);