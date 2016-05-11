window.onload = function() {

    // TODO: move this into another class in actual implementation
    window.cubeCamera = new THREE.CubeCamera(1, 1000, 256);
    window.cubeCamera.renderTarget.mapping = THREE.CubeRefractionMapping;

    // Create the canvas
    var mainContainer = document.querySelector('main');
    var game = new Game(mainContainer);
    game.pause();
    $(mainContainer).hide();

    $('intro button').click(function() {
      $('intro').fadeOut(350, function() {
        $(this).remove();
        $(mainContainer).fadeIn(200);
        game.unpause();
      });
      return false;
    });    


    function color_cycle() {
      $('intro #title span').each(function() {
        $(this).css('color', Please.make_color({
            saturation: .7,
            value: .7
        }));
      });
    }
    color_cycle();
    setInterval(color_cycle, 1000);

};
