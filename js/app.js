window.onload = function() {

    // Create the canvas
    var mainContainer = document.querySelector('main');
    var game = new Game(mainContainer);
    game.pause();

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
