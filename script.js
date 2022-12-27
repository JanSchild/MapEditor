// CLASSES
class Map
{
    constructor(name, width, height)
    {
        this.name = name;
        this.canvas = document.getElementById('map');
        this.context = this.canvas.getContext('2d');

        this.setSize(width, height);
    
        // (2D array: layer[y][x] = row y, column x)
        // (values are arrays: [tilesetName, tileX, tileY] )
        this.layer = new Array();
    }

    setSize(width, height)
    {
        this.width = width;
        this.height = height;
        
        this.canvas.width = Tileset.tileWidth * width;
        this.canvas.height = Tileset.tileHeight * height;
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
        this.context.clearRect(x * Tileset.tileWidth, y * Tileset.tileHeight, Tileset.tileWidth, Tileset.tileHeight);
    }

    drawTile(tileset_name, tile_x, tile_y, map_x, map_y)
    {
        if(!Tileset.filenames.includes(tileset_name))
        {
            console.error(`${tileset_name} not found.`);
            return;
        }

        var tileset_image = Tileset.images[tileset_name];

        var draw_x = map_x * Tileset.tileWidth;
        var draw_y = map_y * Tileset.tileHeight;
        
        var source_x = tile_x * Tileset.tileWidth;
        var source_y = tile_y * Tileset.tileHeight;

        this.context.drawImage(tileset_image, source_x, source_y, Tileset.tileWidth, Tileset.tileHeight, 
            draw_x, draw_y, Tileset.tileWidth, Tileset.tileHeight);
    }
        
    setTile(x, y, new_tile) 
    {
        if(this.layer[y] == undefined)
        {
            this.layer[y] = new Array();
        }

        if(this.layer[y][x] != undefined)
        {
            if(this.layer[y][x].join(',') == new_tile.join(','))
            {
                return; // identical tile doesn't need to be redrawn
            }
        }
        
        this.layer[y][x] = new_tile;

        this.clearTile(x, y);
        this.drawTile(current_tileset_name, Tileset.selectedX, Tileset.selectedY, x, y);
    }
}


class Tileset
{
    constructor(filename, name)
    {
        this.filename = filename;
        this.name = name;
        this.image = new Image();
        this.current = Tileset.filenames[0];
    }

    static filenames = ['tilesets/floor.png', 'tilesets/forest.png', 'tilesets/forest_dead.png'];
    static loadedFiles = new Array();

    static images = new Array();

    static tileWidth = 32;
    static tileHeight = 32;

    static selectedX = 0;
    static selectedY = 0;    

    static canvas = document.getElementById('tileset');
    static context = Tileset.canvas.getContext('2d');
    static chooser = document.getElementById('tileset-chooser');

    static generateDropdownMenu()
    {
        for(var tileset_name of Tileset.filenames)
        {
            var option = document.createElement('option');
            if(tileset_name == current_tileset_name)
                option.selected = true;
            option.value = tileset_name;
            option.innerHTML = tileset_name;
            Tileset.chooser.appendChild(option);
        }
    }

    static loadTilesets()
    {
        for(var filename of Tileset.filenames)
        {
            var image = new Image();
            image.src = filename;
            image.addEventListener("load", (event) =>
            {
                Tileset.loadedFiles.push(event.target.src);
                if(Tileset.loadedFiles.length === 1)
                {
                    Tileset.show(current_tileset_name);
                }
            });
            Tileset.images[filename] = image;
        }
    }

    static show(filename) 
    {
        current_tileset_name = filename;
        Tileset.image = Tileset.images[filename];
    
        Tileset.canvas.width = Tileset.image.naturalWidth;
        Tileset.canvas.height = Tileset.image.naturalHeight;
    
        Tileset.selectedX = 0;
        Tileset.selectedY = 0;
        
        Tileset.draw();
        Tileset.drawSelector();
    }

    static change(event)
    {
        Tileset.show(event.target.value);
    }

    static draw()
    {
        Tileset.context.drawImage(Tileset.image, 0, 0);
    }

    static selectTile(event)
    {
        Tileset.context.clearRect(0, 0, Tileset.canvas.width, Tileset.canvas.height);

        Tileset.draw();

        Tileset.selectedX = parseInt(event.offsetX / Tileset.tileWidth);
        Tileset.selectedY = parseInt(event.offsetY / Tileset.tileHeight);

        Tileset.drawSelector();
    }

    static drawSelector()
    {
        Tileset.context.beginPath();
        Tileset.context.rect(Tileset.selectedX * Tileset.tileWidth, 
                                Tileset.selectedY * Tileset.tileHeight, 
                                Tileset.tileWidth, Tileset.tileHeight);
        Tileset.context.closePath();
        Tileset.context.strokeStyle = "black";
        Tileset.context.stroke();
    }
}



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