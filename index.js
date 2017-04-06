/*
Concept of A* algorithm
1. Start by selecting a start point and an end point
2. At every point, consider all possible directions (neighbors) or the next points you can go to
3. For every neighbor calculate the least expected cost to reach your end goal from that neighbor
4. The least expected cost is calculated using two things: (i) The actual cost of reaching the neighbor, which is the cost of reaching the current point plus cost of a step, (ii) The least possible cost to travel from the neighbor to the end point (i.e. the cost considering a straight line from the neighbor to the end)
5. This information is then stored as a part of the neighbor. What is the least expected cost from this point and what was the point previous to this point (if every point stores the information about previous point we can draw a path)
6. It is possible that you may encounter a point twice, first time coming from some other point and now coming from this current point. In such cases we see if we have found a cheaper way to reach that point or an expensive way. If the current path is cheaper, we update the cost and path information of that point.
6. All these possible points are then stored in an array called the open set, with all the other possible points from the previous steps that were not chosen at the time. This ensures that if you have come down a path that started out as cheap but is proving to be expensive, you can go back to a less expensive option
7. Hence the point that offers the minimum cost, from the open set, is selected. Once a point is selected it is moved from open set to the closed set so that we don't select the same point again if it doesn't work out.
8. This process is repeated till we reach the end or find out that there is no possible way to reach the end point.
*/

var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;

//width and height of each spot
var w, h;

var path = [];

function removeFromArray(arr, elt){
  for(i = arr.length - 1 ; i >= 0 ; i--){
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  // var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

function setup(){
  frameRate(1);
  createCanvas(400,400);
  w = width/cols;
  h = height/rows;

  //creating a 2D array
  for (i = 0 ; i < grid.length ; i++){
    grid[i] = new Array(rows);
  }

  for (i = 0 ; i < grid.length ; i++){
    for (j = 0 ; j < grid[i].length ; j++){
      grid[i][j] = new Spot(i, j);
    }
  }
  for (i = 0 ; i < grid.length ; i++){
    for (j = 0 ; j < grid[i].length ; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1 ][rows - 1];
  // end = grid[cols - 1][4];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

function draw(){
  if(openSet.length > 0) {
    var winner = 0;
    for(i = 0 ; i < openSet.length ; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

    var current = openSet[winner];

    if(openSet[winner] == end) {
      console.log("DONE!");
      noLoop();
    } else{
      removeFromArray(openSet, current);
      closedSet.push(current);

      var neighbors = current.neighbors;
      for(i = 0 ; i < neighbors.length ; i++){
        var neighbor = neighbors[i];

        if (!closedSet.includes(neighbor) && !neighbor.wall){
          var tempG = current.g + 1;

          var newPath = false;
          if(openSet.includes(neighbor)){
            if(tempG < neighbor.g){
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            openSet.push(neighbor);
            newPath = true;
          }
          if(newPath){
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
    }
  } else{
    console.log("no solution");
    noLoop();
    return;
    // No Solution
  }

  for (i = 0 ; i < grid.length ; i++){
    for (j = 0 ; j < grid[i].length ; j++){
      grid[i][j].show(color(255));
    }
  }

  for(i = 0; i < closedSet.length ; i++){
    closedSet[i].show(color(255, 0, 0));
  }
  for(i = 0; i < openSet.length ; i++){
    openSet[i].show(color(0, 255, 0));
  }

  //Find the path
  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  for(i = 0 ; i < path.length ; i++) {
    path[i].show(color(0, 0, 255));
  }
}

//Every spot in the grid needs to know the cost associated with it.
function Spot(i, j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if(random(1) < 0.4){
    this.wall = true;
  }
}

Spot.prototype.show = function(col){
  if(this.wall) {
    col = color(0);
  }
  fill(col);
  stroke(0);
  rect(this.i * w, this.j * h, w - 1, h - 1);
}

Spot.prototype.addNeighbors = function(grid){
  var i = this.i;
  var j = this.j;
  if(i < cols - 1){
    this.neighbors.push(grid[i + 1][j]);
  }
  if(i > 0){
    this.neighbors.push(grid[i - 1][j]);
  }
  if(j < rows - 1){
    this.neighbors.push(grid[i][j + 1]);
  }
  if(j > 0){
    this.neighbors.push(grid[i][j - 1]);
  }
  if(i > 0 && j > 0) {
    this.neighbors.push(grid[i - 1][j - 1]);
  }
  if(i < cols - 1 && j > 0) {
    this.neighbors.push(grid[i + 1][j - 1]);
  }
  if(i > 0 && j < rows - 1) {
    this.neighbors.push(grid[i - 1][j + 1]);
  }
  if(i < cols - 1 && j < rows - 1) {
    this.neighbors.push(grid[i + 1][j + 1]);
  }
}
