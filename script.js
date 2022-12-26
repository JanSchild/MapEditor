// CONSTANTS
const TILE_WIDTH = 32, TILE_HEIGHT = 32;
const TILESET_NAMES = ["tilesets/floor.png", "tilesets/forest.png", "tilesets/forest_dead.png"];

// CLASSES
class Map
{
    constructor(name, width, height)
    {
        this.name = name;
        this.width = width;
        this.height = height;
    
        this.canvas = document.getElementById('map');
        this.context = this.canvas.getContext('2d');
    
        // (2D array: layer[y][x] = row y, column x)
        // (values are arrays: [tilesetName, tileX, tileY] )
        this.layer = new Array();

        this.canvas.addEventListener("click", this.mapClick);
        this.canvas.addEventListener("mousemove", this.mapClick);
    }

    drawMap()
    {
        this.clearMap();

        this.layer.forEach((row, map_y) => 
        {
            if(row === null)
                return;

            row.forEach((tile, map_x) =>
            {
                if(tile === null)
                    return;

                var tileset_name = tile[0];
                var tile_x = tile[1];
                var tile_y = tile[2];
                this.drawTile(tileset_name, tile_x, tile_y, map_x, map_y);
            });
        });
    }

    clearMap()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearTile(x, y)
    {
        this.context.clearRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
    }

    drawTile(tileset_name, tile_x, tile_y, map_x, map_y)
    {
        if(!TILESET_NAMES.includes(tileset_name))
        {
            console.error(`${tileset_name} not found.`);
            return;
        }

        var tileset_image = tileset_images[tileset_name];

        var draw_x = map_x * TILE_WIDTH;
        var draw_y = map_y * TILE_HEIGHT;
        
        var source_x = tile_x * TILE_WIDTH;
        var source_y = tile_y * TILE_HEIGHT;

        this.context.drawImage(tileset_image, source_x, source_y, TILE_WIDTH, TILE_HEIGHT, 
            draw_x, draw_y, TILE_WIDTH, TILE_HEIGHT);
    }
        
    mapClick(event) 
    {
        // check if left mouse button is held down
        if(event.which == 1)
        {
            var map_x = parseInt(event.offsetX / TILE_WIDTH);
            var map_y = parseInt(event.offsetY / TILE_HEIGHT);

            var new_tile = [current_tileset_name, selected_tile_x, selected_tile_y];

            if(map.layer[map_y] == undefined)
            {
                map.layer[map_y] = new Array();
            }

            if(map.layer[map_y][map_x] != undefined)
            {
                if(map.layer[map_y][map_x].join(',') == new_tile.join(','))
                {
                    return; // identical tile doesn't need to be redrawn
                }
            }
            
            map.layer[map_y][map_x] = new_tile;

            map.clearTile(map_x, map_y);
            map.drawTile(current_tileset_name, selected_tile_x, selected_tile_y, map_x, map_y);
        }
    }
}

var map = new Map('My first map', 20, 15);




// elements 
var tileset_canvas = document.getElementById("tileset");
var tileset_context = tileset_canvas.getContext("2d");
var tileset_chooser = document.getElementById('tileset-chooser');

// events
tileset_canvas.addEventListener("click", selectTile);
tileset_chooser.addEventListener("change", changeTileset);

function changeTileset(event)
{
    showTileset(event.target.value);
}


// tilesets
var selected_tile_x = 0, selected_tile_y = 0, tileset_load_counter = 0;

var tileset_images = new Array();

var current_tileset_name = TILESET_NAMES[0];
var current_tileset_image = new Image();

createTilesetDropdown();

function createTilesetDropdown()
{
    for(var tileset_name of TILESET_NAMES)
    {
        var option = document.createElement('option');
        if(tileset_name == current_tileset_name)
            option.selected = true;
        option.value = tileset_name;
        option.innerHTML = tileset_name;
        tileset_chooser.appendChild(option);
    }
}

loadTilesets();

function loadTilesets()
{
    for(var tileset_name of TILESET_NAMES)
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
    current_tileset_name = tileset_name;
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