var canvasId = 'qpcr-crush';
var AE = new AdamEngine(canvasId);

AE.inputMan.addMBInput(0, 'LEFTCLICK');
AE.inputMan.setup();

AE.assetMan.newAtlas('tiles', '/gfx/atlas.png', '/gfx/atlas.json');

var grid = AE.createWorldObj('grid');

grid.createGrid = function() {
  this.state.grid = [];
  this.state.tilesCreated = 0;

  var currY = 0;
  var tileSize = 70;
  var marginYOffset = 2;

  for(var i=0; i < 9; ++i) {
    var row = [];
    var currX = 0;
    var marginXOffset = 2;

    for(var j=0; j < 9; ++j) {
      ++this.state.tilesCreated;
      var tile = AE.createWorldObj('tile' + this.state.tilesCreated);

      tile.state.atlas = AE.assetMan.getAtlas('tiles');
      tile.state.pos.x = currX + marginXOffset;
      tile.state.pos.y = currY + marginYOffset;

      tile.state.size = {
        w: tileSize,
        h: tileSize
      };

      var atlas = tile.state.atlas.data;

      tile.state.img = tile.state.atlas.img;
      tile.state.imgData = {
        sx: atlas.frames['BHQ2.png'].frame.x,
        sy: atlas.frames['BHQ2.png'].frame.y,
        sw: atlas.frames['BHQ2.png'].sourceSize.w,
        sh: atlas.frames['BHQ2.png'].sourceSize.h
      };

      tile.state.zIndex = 9000;

      tile.state.worldObjType = 'img';
      row.push(tile);

      currX += tileSize;
      marginXOffset += 2;
    }

    this.state.grid.push(row);
    currY += tileSize;
    marginYOffset += 2;
  }

  AE.updateRenderPipe();
  console.log(grid);
};

grid.setup = function() {
  this.state.pos.x = 0;
  this.state.pos.y = 0;
  this.state.size.w = 650;
  this.state.size.h = 650;

  this.state.worldObjType = 'rect';
  this.state.color = '#0000FF';

  this.createGrid();
};

grid.update = function() {
  if(AE.inputMan.getMBState('LEFTCLICK').isActive) {
    var mousePos = AE.inputMan.getMBState('LEFTCLICK').pos;
    console.log(mousePos);
  }
};

AE.start();