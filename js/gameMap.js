class GameMap
{
    static minWidth = 20;
    static maxWidth = 1000;
    
    static minHeight = 15;
    static maxHeight = 100;
    
    #name;
    get name() { return this.#name; }
    set name(value)
    {
        this.#name = value;
        UI.textfield.mapName.value = this.name;
    }

    #width;
    get width() { return this.#width; }
    set width(value)
    {
        this.#width = limitValue(value, GameMap.minWidth, GameMap.maxWidth);
        UI.canvas.map.width = Tileset.tileWidth * this.width;
        UI.textfield.mapWidth.value = this.width;
    }

    #height;
    get height() { return this.#height; }
    set height(value)
    {
        this.#height = limitValue(value, GameMap.minHeight, GameMap.maxHeight);
        UI.canvas.map.height = Tileset.tileHeight * this.height;
        UI.textfield.mapHeight.value = this.height;
    }

    constructor(name, width, height)
    {
        this.layer = new Layer(height);

        this.name = name;
        this.width = width;
        this.height = height;
    }

    serialize()
    {
        var exportData =
        {
            name: this.name,
            width: this.width,
            height: this.height,
            layer: this.layer
        };
        exportJSON(exportData, 'map.json');
    }

    static deserialize(raw)
    {
        var mapJSON = JSON.parse(raw);
        var map = Object.assign(new GameMap, mapJSON);
        map.layer = Object.assign(new Layer, mapJSON.layer);
        map.layer.convertDataToTiles();
        return map;
    }}