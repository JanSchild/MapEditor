class UI
{
    static button = 
    {
        saveMap: document.getElementById('map-download'),
        singleTool: document.getElementById('tool-single'),
        fillTool: document.getElementById('tool-fill'),
        eraserTool: document.getElementById('tool-eraser'),
        undo: document.getElementById('undo-button'),
        redo: document.getElementById('redo-button')
    };

    static textfield = 
    {
        mapName: document.getElementById('map-name'),
        mapWidth: document.getElementById('map-width'),
        mapHeight: document.getElementById('map-height')
    };

    static dropdown = 
    {
        tilesets: document.getElementById('tileset-chooser')
    }

    static filechooser = 
    {
        mapUpload: document.getElementById('map-importer')
    };

    static canvas = 
    {
        map: document.getElementById('map'),
        tileset: document.getElementById('tileset')
    };
}