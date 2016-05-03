window.onload = function() {

    // Create the canvas
    var mainContainer = document.querySelector('main');
    var canvas = document.createElement("canvas");
    
    var game = new Game(mainContainer, canvas);

};
