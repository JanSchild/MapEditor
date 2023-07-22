class TilePicker
{
    static context = UI.canvas.tileset.getContext('2d');

    static filenames = new Set(['tilesets/floor.png', 'tilesets/forest.png', 'tilesets/forest_dead.png']);
    static loadedFiles = new Set();

    static currentFilename = TilePicker.filenames.values().next().value;
    static currentTile = new Tile(TilePicker.currentFilename, 0, 0); // TODO - remove

    static selectionStart = { x: 0, y: 0 };
    static selectionEnd = { x: 0, y: 0 };

    static dragging = false;

    static image;
    static images = new Array();

    static drawTileset()
    {
        TilePicker.context.clearRect(0, 0, UI.canvas.tileset.width, UI.canvas.tileset.height);
        TilePicker.context.drawImage(TilePicker.image, 0, 0);
    }

    static drawSelector()
    {
        TilePicker.drawTileset();
        
        let startX = TilePicker.selectionStart.x < TilePicker.selectionEnd.x ? TilePicker.selectionStart.x : TilePicker.selectionEnd.x;
        let startY = TilePicker.selectionStart.y < TilePicker.selectionEnd.y ? TilePicker.selectionStart.y : TilePicker.selectionEnd.y;

        let endX = TilePicker.selectionEnd.x > TilePicker.selectionStart.x ? TilePicker.selectionEnd.x : TilePicker.selectionStart.x;
        let endY = TilePicker.selectionEnd.y > TilePicker.selectionStart.y ? TilePicker.selectionEnd.y : TilePicker.selectionStart.y;

        let selectionWidth = endX - startX + 1;
        let selectionHeight = endY - startY + 1;

        TilePicker.context.beginPath();
        TilePicker.context.rect(startX * Tileset.tileWidth, 
                                startY * Tileset.tileHeight, 
                                selectionWidth * Tileset.tileWidth, 
                                selectionHeight * Tileset.tileHeight);
        TilePicker.context.closePath();
        TilePicker.context.strokeStyle = "black";
        TilePicker.context.stroke();
    }

    static coordinatesFromPixels(x, y)
    {
        return {
            x: parseInt(x / Tileset.tileWidth),
            y: parseInt(y / Tileset.tileHeight)
        }
    }

    static changeTileset(event)
    {
        TilePicker.selectionStart = { x: 0, y: 0 };
        TilePicker.selectionEnd = { x: 0, y: 0 };
        TilePicker.showTileset(event.target.value);
    }

    static showTileset(filename)
    {
        TilePicker.currentTile.filename = filename; // TODO - remove
        TilePicker.currentFilename = filename;
        TilePicker.image = TilePicker.images[filename];
    
        UI.canvas.tileset.width = TilePicker.image.naturalWidth;
        UI.canvas.tileset.height = TilePicker.image.naturalHeight;
    
        TilePicker.currentTile.x = 0;
        TilePicker.currentTile.y = 0;
        
        TilePicker.drawTileset();
        TilePicker.drawSelector();
    }

    static selectTile(event)
    {
        TilePicker.drawTileset();

        TilePicker.currentTile.x = parseInt(event.offsetX / Tileset.tileWidth);
        TilePicker.currentTile.y = parseInt(event.offsetY / Tileset.tileHeight);

        TilePicker.drawSelector();
    }

    static loadTilesets() // TODO: move to tileSet.js
    {
        TilePicker.filenames.forEach(filename => 
        {
            let image = new Image();
            image.src = filename;
            image.addEventListener("load", (event) =>
            {
                TilePicker.loadedFiles.add(filename);
                if(filename == TilePicker.currentTile.filename)
                    TilePicker.showTileset(TilePicker.currentTile.filename);
            });
            TilePicker.images[filename] = image;
        });
    }

    static generateDropdownMenu() // TODO: move to tileSet.js
    {
        TilePicker.filenames.forEach(filename => 
        {
            let option = document.createElement('option');
            if(filename == TilePicker.currentTile.filename)
                option.selected = true;
            option.value = filename;
            option.innerHTML = filename;
            UI.dropdown.tilesets.appendChild(option);
        });
    }
}