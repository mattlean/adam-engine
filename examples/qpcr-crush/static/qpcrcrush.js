var canvasId = 'qpcr-crush';
var AE = new AdamEngine(canvasId);
var startTime = 60;

//AE.inputMan.addMBInput(0, 'LEFTCLICK');
AE.inputMan.addTouchInput();
AE.inputMan.setup();

AE.assetMan.newImg('bg', '/static/gfx/bg.jpg');
AE.assetMan.newAtlas('tiles', '/static/gfx/atlas.png', '/static/gfx/atlas.json');
AE.assetMan.newSound('score', '/static/sfx/score.wav');
AE.assetMan.newSound('swap', '/static/sfx/swap.wav');
AE.assetMan.newSound('select', '/static/sfx/select.wav');
AE.assetMan.newSound('illegal', '/static/sfx/illegalmove.wav');

var grid = AE.createWorldObj('grid');

grid.setup = function() {
  this.state.pos.x = 0;
  this.state.pos.y = 0;
  this.state.size.w = 650;
  this.state.size.h = 650;
  this.state.score = 0;
  this.state.timeUp = true;
  this.state.worldObjType = 'invis';

  this.spawnGrid();
};

grid.createGrid = function() {
  if (this.state.grid !== undefined) {
    this.clearGrid();
    this.state.tilesToDel = [];
  }

  this.state.grid = []; // grid visible to players
  this.state.gridCheck = []; // grid used to check if player moves are valid
  this.state.tilesCreated = 0;
  this.state.prevClickedTile = null;

  // swapping
  this.state.swapping = null;
  this.state.swapDone = 0;

  // fading
  this.state.fading = false;
  this.state.fadeDone = 0;
  this.state.tilesToDel = [];

  // falling
  this.state.falling = false;
  this.state.fallNum = 0;
  this.state.fallDone = 0;

  // appearing
  this.state.appearing = false;
  this.state.appearNum = 0;
  this.state.appearDone = 0;

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

      // default state vals
      tile.state.atlas = AE.assetMan.getAtlas('tiles');
      tile.state.pos.x = currX + marginXOffset;
      tile.state.pos.y = currY + marginYOffset;
      tile.state.size.w = tileSize;
      tile.state.size.h = tileSize;
      tile.state.zIndex = 2;
      tile.state.alpha = null;
      tile.state.worldObjType = 'img';

      // custom state vals
      tile.state.gridLoc = {x: j, y: i};

      // atlas state
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

      // move loc
      tile.state.moveTo = null;

      // move tile to moveTo destination
      tile.move = function() {
        var unoffsetPosX = Math.floor(this.state.pos.x / 10) * 10;
        var unoffsetPosY = Math.floor(this.state.pos.y / 10) * 10;
        var offsetPosX = this.state.pos.x - unoffsetPosX;
        var offsetPosY = this.state.pos.y - unoffsetPosY;
        console.log('pos');
        console.log(unoffsetPosX, offsetPosX, this.state.pos.x);
        console.log(unoffsetPosY, offsetPosY, this.state.pos.y);

        var unoffsetMoveToX = Math.floor(this.state.moveTo.x/ 10) * 10;
        var unoffsetMoveToY = Math.floor(this.state.moveTo.y/ 10) * 10;
        var offsetMoveToX = this.state.moveTo.x - unoffsetMoveToX;
        var offsetMoveToY = this.state.moveTo.y - unoffsetMoveToY;
        console.log('moveTo');
        console.log(unoffsetMoveToX, offsetMoveToX, this.state.moveTo.x);
        console.log(unoffsetMoveToY, offsetMoveToY, this.state.moveTo.y);

        if(unoffsetPosX === unoffsetMoveToX) {
          this.state.pos.x = this.state.moveTo.x;
        } else if(unoffsetPosX < unoffsetMoveToX) {
          unoffsetPosX += 10;
          this.state.pos.x = unoffsetPosX;
        } else if(unoffsetPosX > unoffsetMoveToX) {
          unoffsetPosX -= 10;
          this.state.pos.x = unoffsetPosX;
        }

        if(unoffsetPosY === unoffsetMoveToY) {
          this.state.pos.y = this.state.moveTo.y;
        } else if(unoffsetPosY < unoffsetMoveToY) {
          unoffsetPosY += 10;
          this.state.pos.y = unoffsetPosY;
        } else if(unoffsetPosY > unoffsetMoveToY) {
          unoffsetPosY -= 10;
          this.state.pos.y = unoffsetPosY;
        }
      };

      tile.update = function() {
        if(grid.state.swapping && (this.state.moveTo !== null)) {
          this.move();

          // add to swapDone to notify grid when all tiles are done moving
          if((this.state.pos.x === this.state.moveTo.x) && (this.state.pos.y === this.state.moveTo.y)) {
            this.state.moveTo = null;
            ++grid.state.swapDone;
          }
        }

        if(grid.state.fading && this.state.alpha) {
          // fade out the tile
          if(this.state.alpha > 0) {
            this.state.alpha = this.state.alpha - 0.2;
          } else {
            this.state.alpha = 0;
          }

          // add to fadeDone to notify grid when all tiles are done fading
          if(this.state.alpha === 0) {
            this.state.alpha = null;
            ++grid.state.fadeDone;
          }
        }

        if(grid.state.falling && (this.state.moveTo !== null)) {
          this.move();

          // add to fallDone to notify grid when all tiles are done falling
          if((this.state.pos.x === this.state.moveTo.x) && (this.state.pos.y === this.state.moveTo.y)) {
            this.state.moveTo = null;
            ++grid.state.fallDone;
          }
        }
      };

      row.push(tile);

      currX += tileSize;
      marginXOffset += 2;
    }

    this.state.grid.push(row);
    currY += tileSize;
    marginYOffset += 2;
  }
};

grid.spawnGrid = function() {
  // keep recreating grid until there isn't a match
  do {
    this.createGrid();
  } while(this.findMatches(this.state.grid));

  this.state.gridCheck = this.copyGrid(this.state.grid); // copy grid to gridCheck
  AE.updateRenderPipe();
};

grid.copyGrid = function(grid) {
  var newGrid = [];
  for(var y=0; y < grid.length; ++y) {
    newGrid[y] = grid[y].slice();
  }

  return newGrid;
};

grid.addTilesToDel = function(prevSameTiles) {
  if(prevSameTiles.length > 2) {
    // console.log('>3 match occurred');
    for(var i in prevSameTiles) {
      var alreadyInTilesToDel = false;
      // console.log(prevSameTiles[i].state.gridLoc.x, prevSameTiles[i].state.gridLoc.y);

      for(var j in this.state.tilesToDel) {
        if(this.state.tilesToDel[j].name === prevSameTiles[i].name) {
          alreadyInTilesToDel = true;
          break;
        }
      }

      if(alreadyInTilesToDel === false) {
        this.state.tilesToDel.push(prevSameTiles[i]);
      }
    }
    // console.log('\n');

    return true;
  }
  return false;
};

grid.findMatches = function(grid) {
  var matchesFound = 0;

  // breadth check tiles
  // console.log('X check');
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
          if(this.addTilesToDel(prevSameXTiles)) {
            ++matchesFound;
          }

          prevSameXTiles = [];
          prevSameXTiles.push(grid[y][x]);
        }
      }
    }

    if(this.addTilesToDel(prevSameXTiles)) {
      ++matchesFound;
    }

  }

  // depth check tiles
  // console.log('Y check');
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
          if(this.addTilesToDel(prevSameYTiles)) {
            ++matchesFound;
          }

          prevSameYTiles = [];
          prevSameYTiles.push(grid[y][x]);
        }
      }
    }

    if(this.addTilesToDel(prevSameYTiles)) {
      ++matchesFound;
    }
  }

  return matchesFound;
};

grid.deleteTile = function(x, y) {
  var tile = this.state.grid[y][x];
  if(tile) {
    AE.deleteWorldObj(tile.name);
  }
  this.state.grid[y][x] = null;
  AE.updateRenderPipe();
};

grid.clearGrid = function() {
  for(var y=0; y < 9; ++y) {
    for(var x=0; x < 9; ++x) {
      this.deleteTile(x, y);
    }
  }
};

grid.tileClicked = function() {
  var mousePos = AE.inputMan.getMBState('LEFTCLICK').pos;

  // check if a tile was clicked
  for(var y=0; y < this.state.grid.length; ++y) {
    for(var x=0; x < this.state.grid.length; ++x) {
      var tile = this.state.grid[y][x];
        
      if(
        (mousePos.x < (tile.state.pos.x + tile.state.size.w)) &&
        (mousePos.x > tile.state.pos.x) &&
        (mousePos.y < (tile.state.pos.y + tile.state.size.h)) &&
        (mousePos.y > tile.state.pos.y)
      ) {
        return tile;
      }
    }
  }
};

grid.tilePressed = function() {
  var touch = {start: null, end: null};

  var touchState = AE.inputMan.getTouchState();

  // check if the touch path is valid
  for(var y=0; y < this.state.grid.length; ++y) {
    for(var x=0; x < this.state.grid.length; ++x) {
      var tile = this.state.grid[y][x];

      if(
        (touchState.pos.startX < (tile.state.pos.x + tile.state.size.w)) &&
        (touchState.pos.startX > tile.state.pos.x) &&
        (touchState.pos.startY < (tile.state.pos.y + tile.state.size.h)) &&
        (touchState.pos.startY > tile.state.pos.y)
      ) {
        touch.start = tile;
        this.state.prevClickedTile = touch.start;
        // touch.start.state.stroke = {
        //   pos: touch.start.state.pos,
        //   size: {w: touch.start.state.size.w, h: touch.start.state.size.h},
        //   color: '#FF0000'
        // };
      }

      if(
        (touchState.pos.endX < (tile.state.pos.x + tile.state.size.w)) &&
        (touchState.pos.endX > tile.state.pos.x) &&
        (touchState.pos.endY < (tile.state.pos.y + tile.state.size.h)) &&
        (touchState.pos.endY > tile.state.pos.y)
      ) {
        touch.end = tile;
      }
    }
  }

  return touch;
};

grid.validSwap = function(clickedTile, prevClickedTile) {
  if(
    (clickedTile.state.gridLoc.y === (prevClickedTile.state.gridLoc.y - 1) &&
    clickedTile.state.gridLoc.x === (prevClickedTile.state.gridLoc.x)) ||
    (clickedTile.state.gridLoc.x === (prevClickedTile.state.gridLoc.x + 1) &&
    clickedTile.state.gridLoc.y === prevClickedTile.state.gridLoc.y) ||
    (clickedTile.state.gridLoc.y === (prevClickedTile.state.gridLoc.y + 1) &&
    clickedTile.state.gridLoc.x === (prevClickedTile.state.gridLoc.x)) ||
    (clickedTile.state.gridLoc.x === (prevClickedTile.state.gridLoc.x - 1) &&
    clickedTile.state.gridLoc.y === prevClickedTile.state.gridLoc.y)
  ) {
    return true;
  }
  return false;
};

grid.processInput = function(clickedTile, prevClickedTile) {
  if(clickedTile) {
    console.log(this.state.grid);
    console.log('clicked a tile');
    // check if clicked tile is within range of prev
    if(prevClickedTile) {
      console.log('prevClickedTile is set');
      this.state.prevClickedTile.state.stroke = null;

      if(this.validSwap(clickedTile, prevClickedTile)) {
        console.log('swap is valid');
        // if player clicked up, right, down, or left of prevClickedTile
        var clickedTileGridLoc = clickedTile.state.gridLoc;
        var prevClickedTileGridLoc = prevClickedTile.state.gridLoc;

        var tempTile = this.state.gridCheck[clickedTileGridLoc.y][clickedTileGridLoc.x];
        this.state.gridCheck[clickedTileGridLoc.y][clickedTileGridLoc.x] = this.state.gridCheck[prevClickedTileGridLoc.y][prevClickedTileGridLoc.x];
        this.state.gridCheck[prevClickedTileGridLoc.y][prevClickedTileGridLoc.x] = tempTile;

        console.log(this.state.gridCheck);
        if(this.findMatches(this.state.gridCheck)) {
          console.log('match found');
          // if swap results to a match, updated grid
          var grid = this.state.grid;
          var gridCheck = this.state.gridCheck;

          var newClickedTile = gridCheck[prevClickedTileGridLoc.y][prevClickedTileGridLoc.x];
          var newPrevClickedTile = gridCheck[clickedTileGridLoc.y][clickedTileGridLoc.x];

          // begin swap animation
          var tile1 = grid[clickedTileGridLoc.y][clickedTileGridLoc.x];
          var tile2 = grid[prevClickedTileGridLoc.y][prevClickedTileGridLoc.x];

          this.state.swapping = {tile1: tile1, tile2: tile2};
          tile1.state.moveTo = {x: tile2.state.pos.x, y: tile2.state.pos.y};
          tile2.state.moveTo = {x: tile1.state.pos.x, y: tile1.state.pos.y};

          AE.soundMan.playSound('swap');

          this.finishSwap = function() {
            // swap gridLoc
            var tempGridLoc = {x: newClickedTile.state.gridLoc.x, y: newClickedTile.state.gridLoc.y};
            newClickedTile.state.gridLoc.x = newPrevClickedTile.state.gridLoc.x;
            newClickedTile.state.gridLoc.y = newPrevClickedTile.state.gridLoc.y;
            newPrevClickedTile.state.gridLoc.x = tempGridLoc.x;
            newPrevClickedTile.state.gridLoc.y = tempGridLoc.y;

            this.state.grid = this.copyGrid(this.state.gridCheck); // update grid with valid gridCheck

            // delete tiles
            this.state.fading = true;

            // assign each tile an alpha value
            for(var i in this.state.tilesToDel) {
              var currTile = this.state.tilesToDel[i];
              currTile.state.alpha = 1;
            }

            AE.soundMan.playSound('score');
          };
        } else {
          console.log('no match');
          AE.soundMan.playSound('illegal');
          this.state.gridCheck = this.copyGrid(this.state.grid); // sync grid check with grid
        }
      } else {
        console.log('illegal swap');
        AE.soundMan.playSound('illegal');
      }
    }

    if(this.state.prevClickedTile) {
      this.state.prevClickedTile = null;
    } else {
      this.state.prevClickedTile = clickedTile;

      clickedTile.state.stroke = {
        pos: clickedTile.state.pos,
        size: {w: clickedTile.state.size.w, h: clickedTile.state.size.h},
        color: '#FF0000'
      };

      AE.soundMan.playSound('select');
    }
  }
};

grid.calcFall = function() {
  var gridSize = this.state.grid.length;

  for(var x=0; x < gridSize; ++x) {
    for(var y=0; y < gridSize; ++y) {
      // move tile to the cell below it if it is an empty space
      if(y < 8) {
        if((this.state.grid[y][x] !== null) && (this.state.grid[y + 1][x] === null)) {
          var tile = this.state.grid[y][x];

          // update tile state
          tile.state.moveTo = {x: tile.state.pos.x, y: ((y + 1) * 70) + (y * 2)};
          ++tile.state.gridLoc.y;

          // swap tile locs in grid
          this.state.grid[y + 1][x] = this.state.grid[y][x];
          this.state.grid[y][x] = null;

          // reset grid traversal
          x = 0;
          y = 0;
        }
      }
    }
  }

  // count how many tiles need to move
  for(var y=0; y < gridSize; ++y) {
    for(var x=0; x < gridSize; ++x) {
      if(this.state.grid[y][x]) {
        if(this.state.grid[y][x].state.moveTo !== null) {
          ++this.state.fallNum;
        }
      }
    }
  }
};

grid.spawnNewTiles = function() {
  var gridSize = this.state.grid.length;
  var tileNames = ['BHQ2.png', 'FAM2.png', 'GOLD2.png', 'ORANGE2.png', 'QUASAR2.png', 'RED2.png'];
  var tileSize = 70;

  for(var y=0; y < gridSize; ++y) {
    for(var x=0; x < gridSize; ++x) {
      if(this.state.grid[y][x] === null) {
        ++this.state.tilesCreated;
        var newTile = AE.createWorldObj('tile' + this.state.tilesCreated);

        // default state vals
        newTile.state.atlas = AE.assetMan.getAtlas('tiles');
        newTile.state.pos.x = (x * 70) + (x * 2);
        newTile.state.pos.y = (y * 70) + (y * 2);
        newTile.state.size.w = tileSize;
        newTile.state.size.h = tileSize;
        newTile.state.zIndex = 2;
        newTile.state.alpha = 0;
        newTile.state.worldObjType = 'img';

        // custom state vals
        newTile.state.gridLoc = {x: x, y: y};

        // atlas state
        var atlas = newTile.state.atlas.data;
        var randNum = Math.floor(Math.random() * (0, 6));
        var randTileName = tileNames[randNum];

        newTile.state.tileType = randTileName;
        newTile.state.img = newTile.state.atlas.img;
        newTile.state.imgData = {
          sx: atlas.frames[randTileName].frame.x,
          sy: atlas.frames[randTileName].frame.y,
          sw: atlas.frames[randTileName].sourceSize.w,
          sh: atlas.frames[randTileName].sourceSize.h
        };

        // move loc
        newTile.state.moveTo = null;

        // move tile to moveTo destination
        newTile.move = function() {
          var unoffsetPosX = Math.floor(this.state.pos.x / 10) * 10;
          var unoffsetPosY = Math.floor(this.state.pos.y / 10) * 10;
          var offsetPosX = this.state.pos.x - unoffsetPosX;
          var offsetPosY = this.state.pos.y - unoffsetPosY;
          console.log('pos');
          console.log(unoffsetPosX, offsetPosX, this.state.pos.x);
          console.log(unoffsetPosY, offsetPosY, this.state.pos.y);

          var unoffsetMoveToX = Math.floor(this.state.moveTo.x/ 10) * 10;
          var unoffsetMoveToY = Math.floor(this.state.moveTo.y/ 10) * 10;
          var offsetMoveToX = this.state.moveTo.x - unoffsetMoveToX;
          var offsetMoveToY = this.state.moveTo.y - unoffsetMoveToY;
          console.log('moveTo');
          console.log(unoffsetMoveToX, offsetMoveToX, this.state.moveTo.x);
          console.log(unoffsetMoveToY, offsetMoveToY, this.state.moveTo.y);

          if(unoffsetPosX === unoffsetMoveToX) {
            this.state.pos.x = this.state.moveTo.x;
          } else if(unoffsetPosX < unoffsetMoveToX) {
            unoffsetPosX += 10;
            this.state.pos.x = unoffsetPosX;
          } else if(unoffsetPosX > unoffsetMoveToX) {
            unoffsetPosX -= 10;
            this.state.pos.x = unoffsetPosX;
          }

          if(unoffsetPosY === unoffsetMoveToY) {
            this.state.pos.y = this.state.moveTo.y;
          } else if(unoffsetPosY < unoffsetMoveToY) {
            unoffsetPosY += 10;
            this.state.pos.y = unoffsetPosY;
          } else if(unoffsetPosY > unoffsetMoveToY) {
            unoffsetPosY -= 10;
            this.state.pos.y = unoffsetPosY;
          }
        };

        newTile.update = function() {
          if(grid.state.swapping && (this.state.moveTo !== null)) {
            this.move();

            // add to swapDone to notify grid when all tiles are done moving
            if((this.state.pos.x === this.state.moveTo.x) && (this.state.pos.y === this.state.moveTo.y)) {
              this.state.moveTo = null;
              ++grid.state.swapDone;
            }
          }

          if(grid.state.fading && this.state.alpha) {
            // fade out the tile
            if(this.state.alpha > 0) {
              this.state.alpha = this.state.alpha - 0.2;
            } else {
              this.state.alpha = 0;
            }

            // add to fadeDone to notify grid when all tiles are done fading
            if(this.state.alpha === 0) {
              this.state.alpha = null;
              ++grid.state.fadeDone;
            }
          }

          if(grid.state.falling && (this.state.moveTo !== null)) {
            this.move();

            // add to fallDone to notify grid when all tiles are done falling
            if((this.state.pos.x === this.state.moveTo.x) && (this.state.pos.y === this.state.moveTo.y)) {
              this.state.moveTo = null;
              ++grid.state.fallDone;
            }
          }

          if(grid.state.appearing && (this.state.alpha !== null)) {
            // fade out the tile
            if(this.state.alpha < 1) {
              this.state.alpha = this.state.alpha + 0.1;
            } else {
              this.state.alpha = 1;
            }

            // add to fadeDone to notify grid when all tiles are done fading
            if(this.state.alpha >= 1) {
              this.state.alpha = null;
              ++grid.state.appearDone;
            }
          }
        };

        this.state.grid[y][x] = newTile;
        ++this.state.appearNum;
      }
    }
  }

  this.state.gridCheck = this.copyGrid(this.state.grid); // sync grid check with grid
  AE.updateRenderPipe();
};

grid.update = function() {
  var touchState = AE.inputMan.getTouchState();

  // disable inputs when an animation is occurring
  if(
    (this.state.swapping === null) &&
    (this.state.fading === false) &&
    (this.state.falling === false) &&
    (this.state.appearing === false) &&
    (this.state.timeUp === false)
  ) {
    if(touchState.fullPress) {
      var touch = this.tilePressed();

      if(touch.start && touch.end) {
        grid.processInput(touch.start, touch.end);
      }
    }/* else if(AE.inputMan.getMBState('LEFTCLICK').fullClick) {
      var clickedTile = this.tileClicked();
      var prevClickedTile = this.state.prevClickedTile;

      grid.processInput(clickedTile, prevClickedTile);
    }*/
  }

  // if swapping is done
  if(this.state.swapping && (this.state.swapDone === 2)) {
    console.log('swapping done');
    this.state.swapping = null;
    this.state.swapDone = 0;
    this.finishSwap();
  }

  // if fading is done
  if(this.state.fading && (this.state.fadeDone === this.state.tilesToDel.length)) {
    console.log('fading done');
    this.state.fading = false;
    this.state.fadeDone = 0;
    
    // delete tiles from grid
    for(var i in this.state.tilesToDel) {
      var currTile = this.state.tilesToDel[i];
      if(this.state.timeUp === false) {
        this.state.score = this.state.score + ((parseInt(i) + 1) * 10);
      }
      console.log(this.state.score);
      score.state.text = this.state.score;
      this.deleteTile(currTile.state.gridLoc.x, currTile.state.gridLoc.y);
    }

    this.state.tilesToDel = [];
    this.state.gridCheck = this.copyGrid(this.state.grid); // sync grid check with grid

    // start falling
    this.state.falling = true;
    this.calcFall();
  }

  // if falling is done
  if(this.state.falling && (this.state.fallDone === this.state.fallNum)) {
    console.log('falling done');
    this.state.falling = false;
    this.state.fallNum = 0;
    this.state.fallDone = 0;

    this.state.gridCheck = this.copyGrid(this.state.grid); // sync grid check with grid

    // start appearing
    this.state.appearing = true;
    this.spawnNewTiles();
  }

  // if appearing is done
  if(this.state.appearing && (this.state.appearDone === this.state.appearNum)) {
    console.log('appearing done');
    this.state.appearing = false;
    this.state.appearNum = 0;
    this.state.appearDone = 0;

    this.state.gridCheck = this.copyGrid(this.state.grid); // sync grid check with grid

    if(this.findMatches(this.state.grid)) {
      // start fading
      this.state.fading = true;

      // assign each tile an alpha value
      for(var i in this.state.tilesToDel) {
        var currTile = this.state.tilesToDel[i];
        currTile.state.alpha = 1;
      }

      AE.soundMan.playSound('score');
    }
  }
};

var bg = AE.createWorldObj('bg');

bg.setup = function() {
  this.state.img = AE.assetMan.getImg('bg');
  this.state.pos.x = 0;
  this.state.pos.y = 0;
  this.state.size.w = 1020;
  this.state.size.h = 650;
  this.state.zIndex = 1;
  this.state.alpha = null;
  this.state.worldObjType = 'img';
};

var scoreTitle = AE.createWorldObj('scoreTitle');

scoreTitle.setup = function() {
  this.state.pos.x = 850;
  this.state.pos.y = 350;
  this.state.color = '#FFF';
  this.state.font = '24px Arial';
  this.state.textAlign = 'center';
  this.state.text = 'AMPLICONS';
  this.state.zIndex = 2;
  this.state.worldObjType = 'text';
};

var score = AE.createWorldObj('score');

score.setup = function() {
  this.state.pos.x = 850;
  this.state.pos.y = 410;
  this.state.color = '#FFF';
  this.state.font = '48px Arial';
  this.state.textAlign = 'center';
  this.state.text = 0;
  this.state.zIndex = 2;
  this.state.worldObjType = 'text';
};

var timerTitle = AE.createWorldObj('timerTitle');

timerTitle.setup = function() {
  this.state.pos.x = 850;
  this.state.pos.y = 550;
  this.state.color = '#FFF';
  this.state.font = '24px Arial';
  this.state.textAlign = 'center';
  this.state.text = 'TIME LEFT';
  this.state.zIndex = 2;
  this.state.worldObjType = 'text';
};

var timer = AE.createWorldObj('timer');

timer.setup = function() {
  this.state.pos.x = 850;
  this.state.pos.y = 610;
  this.state.color = '#FFF';
  this.state.font = '48px Arial';
  this.state.textAlign = 'center';
  this.state.text = 60;
  this.state.frameCount = 0;
  this.state.zIndex = 2;
  this.state.worldObjType = 'text';
};

timer.update = function() {
  if(grid.state.timeUp === false) {
    if(this.state.frameCount > 60) {
      --this.state.text;
      this.state.frameCount = 0;
    }

    if(this.state.text === 0) {
      this.state.frameCount = 0;
      grid.state.timeUp = true;
      $('[name="score"]').val(score.state.text);
      $('[data-score]').text(score.state.text);
      $('#game-over-modal').modal('show');
    } else {
      ++this.state.frameCount;
    }
  }
};

var scoreGraph = AE.createWorldObj('scoreGraph');

scoreGraph.setup = function() {
  this.state.pos.x = 750;
  this.state.pos.y = 540;
  this.state.zIndex = 2;
  this.state.worldObjType = 'custom';
  this.state.graphVal = 0;
};

scoreGraph.render = function() {
  var highScore = 1000;
  var MAXGRAPHFILL = 290;
  var offsetX = 680;
  var offsetY = 60;

  AE.ctx.beginPath();
  AE.ctx.moveTo(700, 20);
  AE.ctx.lineTo(700, 300);
  AE.ctx.lineWidth = 2;
  AE.ctx.strokeStyle = '#FFF';
  AE.ctx.stroke();

  AE.ctx.beginPath();
  AE.ctx.moveTo(700, 300);
  AE.ctx.lineTo(1000, 300);
  AE.ctx.lineWidth = 2;
  AE.ctx.strokeStyle = '#FFF';
  AE.ctx.stroke();

  AE.ctx.save();
  AE.ctx.scale(0.9, 0.9);
  AE.ctx.beginPath();
  AE.ctx.moveTo(129.5, 205.5);
  AE.ctx.bezierCurveTo(127.2 + offsetX, 205.5 + offsetY, 125.8 + offsetX, 205.5 + offsetY, 125.5 + offsetX, 205.5 + offsetY);
  AE.ctx.bezierCurveTo(124.1 + offsetX, 205.4 + offsetY, 123.0 + offsetX, 204.3 + offsetY, 123.0 + offsetX, 202.9 + offsetY);
  AE.ctx.bezierCurveTo(123.0 + offsetX, 201.6 + offsetY, 124.1 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
  AE.ctx.bezierCurveTo(125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
  AE.ctx.bezierCurveTo(126.2 + offsetX, 200.5 + offsetY, 196.0 + offsetX, 201.1 + offsetY, 211.9 + offsetX, 191.9 + offsetY);
  AE.ctx.bezierCurveTo(225.8 + offsetX, 183.9 + offsetY, 231.6 + offsetX, 156.9 + offsetY, 237.2 + offsetX, 130.8 + offsetY);
  AE.ctx.bezierCurveTo(243.0 + offsetX, 104.0 + offsetY, 248.4 + offsetX, 78.7 + offsetY, 262.3 + offsetX, 68.6 + offsetY);
  AE.ctx.bezierCurveTo(269.7 + offsetX, 63.2 + offsetY, 281.6 + offsetX, 59.2 + offsetY, 294.9 + offsetX, 57.6 + offsetY);
  AE.ctx.bezierCurveTo(340.0 + offsetX, 52.2 + offsetY, 409.9 + offsetX, 52.9 + offsetY, 410.6 + offsetX, 52.9 + offsetY);
  AE.ctx.bezierCurveTo(412.0 + offsetX, 52.9 + offsetY, 413.1 + offsetX, 54.0 + offsetY, 413.1 + offsetX, 55.4 + offsetY);
  AE.ctx.bezierCurveTo(413.0 + offsetX, 56.8 + offsetY, 411.9 + offsetX, 57.9 + offsetY, 410.6 + offsetX, 57.9 + offsetY);
  AE.ctx.bezierCurveTo(410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY);
  AE.ctx.bezierCurveTo(409.8 + offsetX, 57.9 + offsetY, 340.3 + offsetX, 57.2 + offsetY, 295.5 + offsetX, 62.6 + offsetY);
  AE.ctx.bezierCurveTo(283.2 + offsetX, 64.0 + offsetY, 271.9 + offsetX, 67.8 + offsetY, 265.2 + offsetX, 72.7 + offsetY);
  AE.ctx.bezierCurveTo(252.9 + offsetX, 81.7 + offsetY, 247.4 + offsetX, 107.2 + offsetY, 242.1 + offsetX, 131.9 + offsetY);
  AE.ctx.bezierCurveTo(236.3 + offsetX, 159.0 + offsetY, 230.2 + offsetX, 187.1 + offsetY, 214.4 + offsetX, 196.2 + offsetY);
  AE.ctx.bezierCurveTo(199.5 + offsetX, 204.8 + offsetY, 144.9 + offsetX, 205.5 + offsetY, 129.5 + offsetX, 205.5 + offsetY);
  AE.ctx.closePath();
  // AE.ctx.fillStyle = '#333';
  // AE.ctx.fill();

  AE.ctx.clip();
  var scorepercent = score.state.text / highScore;
  console.log(scorepercent);
  if (scorepercent <= 1) {
    this.state.graphVal = scorepercent * MAXGRAPHFILL;
    AE.ctx.fillStyle = '#ee3e33';
  } else {
    this.state.graphVal = MAXGRAPHFILL;
    AE.ctx.fillStyle = '#00ff00';
  }

  AE.ctx.fillRect(120 + offsetX, 20 + offsetY, this.state.graphVal, 200); //max is 290
  AE.ctx.restore();
};

$('#game-over-modal').modal({
  backdrop: 'static',
  keyboard: false,
  show: false
});

$('#start-modal').modal({
  backdrop: 'static',
  keyboard: false,
  show: true
});

$('#start-game').click(function() {
  $('[name="score"]').val(0);
  grid.state.score = 0;
  score.state.text = 0;
  grid.state.timeUp = false;
  timer.state.text = startTime;
  $('[name="alias"]').val('');
  $('[name="badgeId"]').val('');
});

$('[data-replay]').click(function() {
  /*grid.spawnGrid();
  $('#start-modal').modal('show');
  $('#error').hide();*/
  document.location.reload(true);
});

$('#score-submit-form').submit(function(e) {
  e.preventDefault();

  $('#error').fadeOut();
  var formData = $('#score-submit-form').serialize();

  $.ajax({
    url: '/ep',
    type: 'POST',
    data: formData,
    success: function() {
      $('#game-over-modal').modal('hide');
      $('#submit-success-modal').modal('show');
      setInterval(function() {
        document.location.reload(true)
      }, 60000);
    },
    error: function() {
      $('#error').slideDown();
      console.error('Score submission failed.');
    }
  });
});

AE.start();