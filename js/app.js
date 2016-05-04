window.onload = function() {

    // Create the canvas
    var mainContainer = document.querySelector('main');
    var canvas = document.createElement("canvas");
    
    var game = new Game(mainContainer, canvas);

    // helper func for mouse coords relative to canvas
    // https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
    function relMouseCoords(event){
      var totalOffsetX = 0;
      var totalOffsetY = 0;
      var canvasX = 0;
      var canvasY = 0;
      var currentElement = this;

      do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      }
      while(currentElement = currentElement.offsetParent)

      canvasX = event.pageX - totalOffsetX;
      canvasY = event.pageY - totalOffsetY;

      return {x:canvasX, y:canvasY}
    }
    HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

};
