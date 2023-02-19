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
            GameMap.flood(map_x, map_y, new_tile);
            return;
        }
        // single tile
        GameMap.setTile(new_tile, map_x, map_y);  

        var changes = new TileChangeCollection();
        changes.add(new TileChange(map_x, map_y, old_tile, new_tile));
        History.add(changes);
    }
}

// TILESET
Tileset.generateDropdownMenu();
Tileset.loadTilesets();

