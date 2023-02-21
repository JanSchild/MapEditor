class TilePicker
{
    static context = UI.canvas.tileset.getContext('2d');

    static filenames = new Set(['tilesets/floor.png', 'tilesets/forest.png', 'tilesets/forest_dead.png']);
    static loadedFiles = new Set();

    static currentTile = new Tile(TilePicker.filenames.values().next().value, 0, 0);

    static image;
    static images = new Array();

    static draw()
    {
        TilePicker.context.drawImage(TilePicker.image, 0, 0);
    }

    static drawSelector()
    {
        TilePicker.context.beginPath();
        TilePicker.context.rect(TilePicker.currentTile.x * Tileset.tileWidth, 
                                TilePicker.currentTile.y * Tileset.tileHeight, 
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
        TilePicker.currentTile.filename = filename;
        TilePicker.image = TilePicker.images[filename];
    
        UI.canvas.tileset.width = TilePicker.image.naturalWidth;
        UI.canvas.tileset.height = TilePicker.image.naturalHeight;
    
        TilePicker.currentTile.x = 0;
        TilePicker.currentTile.y = 0;
        
        TilePicker.draw();
        TilePicker.drawSelector();
    }

    static selectTile(event)
    {
        TilePicker.context.clearRect(0, 0, UI.canvas.tileset.width, UI.canvas.tileset.height);

        TilePicker.draw();

        TilePicker.currentTile.x = parseInt(event.offsetX / Tileset.tileWidth);
        TilePicker.currentTile.y = parseInt(event.offsetY / Tileset.tileHeight);

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
                if(filename == TilePicker.currentTile.filename)
                    TilePicker.show(TilePicker.currentTile.filename);
            });
            TilePicker.images[filename] = image;
        });
    }

    static generateDropdownMenu()
    {
        TilePicker.filenames.forEach(filename => 
        {
            var option = document.createElement('option');
            if(filename == TilePicker.currentTile.filename)
                option.selected = true;
            option.value = filename;
            option.innerHTML = filename;
            UI.dropdown.tilesets.appendChild(option);
        });
    }
}