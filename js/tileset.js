class Tileset
{
    constructor(filename, name)
    {
        this.filename = filename;
        this.name = name;
        this.image = new Image();
    }
    
    static filenames = new Set(['tilesets/floor.png', 'tilesets/forest.png', 'tilesets/forest_dead.png']);
    static loadedFiles = new Set();
    
    static current = Tileset.filenames.values().next().value;

    static images = new Array();

    static tileWidth = 32;
    static tileHeight = 32;

    static selectedX = 0;
    static selectedY = 0;    

    static canvas = document.getElementById('tileset');
    static context = Tileset.canvas.getContext('2d');
    static dropdownMenu = document.getElementById('tileset-chooser');

    static currentTile() { return new Tile(Tileset.current, Tileset.selectedX, Tileset.selectedY ) }

    static draw()
    {
        Tileset.context.drawImage(Tileset.image, 0, 0);
    }

    static change(event)
    {
        Tileset.show(event.target.value);
    }

    static show(filename) 
    {
        Tileset.current = filename;
        Tileset.image = Tileset.images[filename];
    
        Tileset.canvas.width = Tileset.image.naturalWidth;
        Tileset.canvas.height = Tileset.image.naturalHeight;
    
        Tileset.selectedX = 0;
        Tileset.selectedY = 0;
        
        Tileset.draw();
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

    static selectTile(event)
    {
        Tileset.context.clearRect(0, 0, Tileset.canvas.width, Tileset.canvas.height);

        Tileset.draw();

        Tileset.selectedX = parseInt(event.offsetX / Tileset.tileWidth);
        Tileset.selectedY = parseInt(event.offsetY / Tileset.tileHeight);

        Tileset.drawSelector();
    }

    static loadTilesets()
    {
        this.filenames.forEach(filename => {
            var image = new Image();
            image.src = filename;
            image.addEventListener("load", (event) =>
            {
                Tileset.loadedFiles.add(filename);
                if(event.target.src.includes(Tileset.current))
                {
                    Tileset.show(Tileset.current);
                }
            });
            Tileset.images[filename] = image;
        });
    }

    static generateDropdownMenu()
    {
        this.filenames.forEach(filename => {
            var option = document.createElement('option');
            if(filename == Tileset.current)
                option.selected = true;
            option.value = filename;
            option.innerHTML = filename;
            Tileset.dropdownMenu.appendChild(option);
        });
    }
}