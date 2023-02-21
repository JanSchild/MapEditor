class TilePicker
{
    static context = UI.canvas.tileset.getContext('2d');

    static filenames = new Set(['tilesets/floor.png', 'tilesets/forest.png', 'tilesets/forest_dead.png']);
    static loadedFiles = new Set();

    static currentFilename = TilePicker.filenames.values().next().value;
    static currentTile() { return new Tile(TilePicker.currentFilename, TilePicker.selectedX, TilePicker.selectedY ) }

    static image;
    static images = new Array();

    static selectedX = 0;
    static selectedY = 0;   

    static draw()
    {
        TilePicker.context.drawImage(TilePicker.image, 0, 0);
    }

    static drawSelector()
    {
        TilePicker.context.beginPath();
        TilePicker.context.rect(TilePicker.selectedX * Tileset.tileWidth, 
                                TilePicker.selectedY * Tileset.tileHeight, 
                                Tileset.tileWidth, Tileset.tileHeight);
        TilePicker.context.closePath();
        TilePicker.context.strokeStyle = "black";
        TilePicker.context.stroke();
    }

    static change(event)
    {
        TilePicker.show(event.target.value);
    }

    static show(filename) 
    {
        TilePicker.currentFilename = filename;
        TilePicker.image = TilePicker.images[filename];
    
        UI.canvas.tileset.width = TilePicker.image.naturalWidth;
        UI.canvas.tileset.height = TilePicker.image.naturalHeight;
    
        TilePicker.selectedX = 0;
        TilePicker.selectedY = 0;
        
        TilePicker.draw();
        TilePicker.drawSelector();
    }

    static selectTile(event)
    {
        TilePicker.context.clearRect(0, 0, UI.canvas.tileset.width, UI.canvas.tileset.height);

        TilePicker.draw();

        TilePicker.selectedX = parseInt(event.offsetX / Tileset.tileWidth);
        TilePicker.selectedY = parseInt(event.offsetY / Tileset.tileHeight);

        TilePicker.drawSelector();
    }

    static loadTilesets()
    {
        TilePicker.filenames.forEach(filename => 
        {
            var image = new Image();
            image.src = filename;
            image.addEventListener("load", (event) =>
            {
                TilePicker.loadedFiles.add(filename);
                if(filename == TilePicker.currentFilename)
                    TilePicker.show(TilePicker.currentFilename);
            });
            TilePicker.images[filename] = image;
        });
    }

    static generateDropdownMenu()
    {
        TilePicker.filenames.forEach(filename => 
        {
            var option = document.createElement('option');
            if(filename == TilePicker.currentFilename)
                option.selected = true;
            option.value = filename;
            option.innerHTML = filename;
            UI.dropdown.tilesets.appendChild(option);
        });
    }
}