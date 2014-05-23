var snakejs = {};

snakejs.game = (function() {

    var ctx;
    var frameLength = 500; 
    snakejs.width = 200;
    snakejs.height = 200;
    snakejs.snakeBlock = 10;
    var distanceX = snakejs.snakeBlock;
    var distanceY = 0;
    var snake;
    
    function init() {
        $('body').append('<canvas id="jsSnake">');
        var $canvas = $('#jsSnake');
        $canvas.attr('width', snakejs.width);
        $canvas.attr('height', snakejs.height);
        var canvas = $canvas[0];
        ctx = canvas.getContext('2d');
        snake = snakejs.snake();
          
        gameLoop();
    }
    
    function gameLoop() {
        ctx.clearRect(0,0,snakejs.width,snakejs.height);
        
        snake.setMove();
        snake.render(ctx);
        
        setTimeout(gameLoop, frameLength);
    }
    
    return {
        init: init
    };
})();
    
snakejs.snake = function() {
    var snakeArray = [];
    
    snakeArray.push([2,2]); // x / y coordinates
    snakeArray.push([3,2]);
    snakeArray.push([4,2]);
    snakeArray.push([5,2]);
    
    var distanceY = 0;
    var distanceX = 1;
    var xPos = snakejs.width/2;
    var yPos = snakejs.height/2;
    document.onkeydown = function() {
        switch (window.event.keyCode) {
        case 37:
            //left 
            distanceY = 0;
            distanceX = -1;
            break;
        case 38:
            //up
            distanceY = -1;
            distanceX = 0;        
            break;
        case 39:
            //right
            distanceY = 0;
            distanceX = 1;
            break;
        case 40:
            //down
            distanceY  = 1;
            distanceX = 0;
            break;
        }
    };
    
    function setMove(){
        var next = snakeArray[0].slice();
        next[0] += distanceX;
        next[1] += distanceY;
        snakeArray.unshift(next);
        snakeArray.pop();
        for (var i = 0 ; i < snakeArray.length ; i++) {
            snakeArray[i] = [snakeArray[i][0] + distanceX,snakeArray[i][1] + distanceY] 
        }
    }
    function render(ctx){
        for (var i = 0 ; i < snakeArray.length ; i++) {
            ctx.fillRect(snakeArray[i][0] * snakejs.snakeBlock, snakeArray[i][1] * snakejs.snakeBlock, snakejs.snakeBlock - 1, snakejs.snakeBlock - 1);
        }
    }
    
    return {
        setMove: setMove,
        render: render
    };
}

$(document).ready(function() {
    snakejs.game.init();
});

