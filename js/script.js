// MAP
function placeTileOnMap(event)
{ 
    // check if left mouse button is held down
    if(event.buttons == 1)
    {
        var map_x = parseInt(event.offsetX / Tileset.tileWidth);
        var map_y = parseInt(event.offsetY / Tileset.tileHeight);
        var new_tile = new Tile(Tileset.current, Tileset.selectedX, Tileset.selectedY);
        var old_tile = GameMap.current.layer.tile(map_x, map_y);

        if(new_tile.isIdentical(old_tile)) return;

        // flood tool 
        if(activeKeys.has('KeyF'))
        {
            GameMap.current.flood(map_x, map_y, new_tile);
            return;
        }
        // single tile
        GameMap.current.setTile(new_tile, map_x, map_y);  

        var changes = new TileChangeCollection();
        changes.add(new TileChange(map_x, map_y, old_tile, new_tile));
        History.add(changes);
    }
}

// MAP IMPORT, EXPORT
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
            GameMap.current.import(importedMap);
        }
    }
}

// TILESET
Tileset.generateDropdownMenu();
Tileset.loadTilesets();

