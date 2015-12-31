var canvasId = 'qpcr-crush';
var AE = new AdamEngine(canvasId);

AE.inputMan.addMBInput(0, 'LEFTCLICK');
AE.inputMan.setup();

AE.assetMan.newAtlas('tiles', '/gfx/atlas.png', '/gfx/atlas.json');

var grid = AE.createWorldObj('grid');

grid.setup = function() {
  this.state.pos.x = 0;
  this.state.pos.y = 0;
  this.state.size.w = 650;
  this.state.size.h = 650;
  this.state.worldObjType = 'invis';
  this.createGrid();
};

grid.createGrid = function() {
  this.state.grid = [];
  this.state.tilesCreated = 0;

  var currY = 0;
  var tileSize = 70;
  var marginYOffset = 2;
  var tileNames = ['BHQ2.png', 'FAM2.png', 'GOLD2.png', 'ORANGE2.png', 'QUASAR2.png', 'RED2.png'];

  // create tiles within grid
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
      tile.state.size.w = tileSize;
      tile.state.size.h = tileSize;
      tile.state.zIndex = 2;
      tile.state.worldObjType = 'img';
      tile.state.stroke = {
        pos: tile.state.pos,
        size: {w: tileSize, h: tileSize},
        color: '#FF0000'
      };
      tile.state.gridLoc = {x: j, y: i};

      var atlas = tile.state.atlas.data;
      var randNum = Math.floor(Math.random() * (0, 6));
      var randTileName = tileNames[randNum];

      tile.state.tileType = randTileName;
      tile.state.img = tile.state.atlas.img;
      tile.state.imgData = {
        sx: atlas.frames[randTileName].frame.x,
        sy: atlas.frames[randTileName].frame.y,
        sw: atlas.frames[randTileName].sourceSize.w,
        sh: atlas.frames[randTileName].sourceSize.h
      };

      row.push(tile);

      currX += tileSize;
      marginXOffset += 2;
    }

    this.state.grid.push(row);
    currY += tileSize;
    marginYOffset += 2;
  }

  AE.updateRenderPipe();
};

grid.findMatches = function() {
  var grid = this.state.grid;
  var matchesFound = 0;

  console.log('X check');
  // breadth check tiles
  for(var y=0; y < 9; ++y) {
    var prevSameXTiles = [];
    for(var x=0; x < 9; ++x) {
      if(prevSameXTiles.length === 0) {
        prevSameXTiles.push(grid[y][x]);
      } else {
        // there is a match!
        if(prevSameXTiles[0].state.tileType === grid[y][x].state.tileType) {
          prevSameXTiles.push(grid[y][x]);
        } else {
          // match is broken
          if(prevSameXTiles.length > 2) {
            console.log('>3 match occurred');
            for(var i in prevSameXTiles) {
              console.log(prevSameXTiles[i].state.gridLoc.x, prevSameXTiles[i].state.gridLoc.y);
            }
            console.log('\n');

            ++matchesFound;
          }

          prevSameXTiles = [];
          prevSameXTiles.push(grid[y][x]);
        }
      }
    }

    if(prevSameXTiles.length > 2) {
      console.log('>3 match occurred');
      for(var i in prevSameXTiles) {
        console.log(prevSameXTiles[i].state.gridLoc.x, prevSameXTiles[i].state.gridLoc.y);
      }
      console.log('\n');

      ++matchesFound;
    }
  }

  console.log('Y check');
  // depth check tiles
  for(var x=0; x < 9; ++x) {
    var prevSameYTiles = [];
    for(var y=0; y < 9; ++y) {
      if(prevSameYTiles.length === 0) {
        prevSameYTiles.push(grid[y][x]);
      } else {
        // there is a match!
        if(prevSameYTiles[0].state.tileType === grid[y][x].state.tileType) {
          prevSameYTiles.push(grid[y][x]);
        } else {
          // match is broken
          if(prevSameYTiles.length > 2) {
            console.log('>3 match occurred');
            for(var i in prevSameYTiles) {
              console.log(prevSameYTiles[i].state.gridLoc.x, prevSameYTiles[i].state.gridLoc.y);
            }
            console.log('\n');

            ++matchesFound;
          }

          prevSameYTiles = [];
          prevSameYTiles.push(grid[y][x]);
        }
      }
    }

    if(prevSameYTiles.length > 2) {
      console.log('>3 match occurred');
      for(var i in prevSameYTiles) {
        console.log(prevSameYTiles[i].state.gridLoc.x, prevSameYTiles[i].state.gridLoc.y);
      }
      console.log('\n');

      ++matchesFound;
    }
  }

  return matchesFound;
};

grid.deleteTile = function(x, y) {
  var tile = this.state.grid[x][y];
  AE.deleteWorldObj(tile.name);
  this.state.grid[x][y] = null;
  AE.updateRenderPipe();
};

grid.update = function() {
  if(AE.inputMan.getMBState('LEFTCLICK').isActive) {
    var mousePos = AE.inputMan.getMBState('LEFTCLICK').pos;
    console.log(mousePos);
  }
};

AE.start();