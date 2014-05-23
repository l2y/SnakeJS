var snakejs = {};
                
snakejs.game = (function() {

    var ctx;
    var frameLengthStart = 250;
    var frameLengthMax = 50;
    snakejs.width = 200;
    snakejs.height = 200;
    snakejs.snakeBlock = 10;
    var distanceX = snakejs.snakeBlock;
    var distanceY = 0;
    var snake;
    var loop;
    var apple;
    var score = 0;
    var frameLength = frameLengthStart;
    var highScore = (localStorage["highscore"]) ? localStorage["highscore"] : 0;
    
    function init() {
        $('body').append('<canvas id="jsSnake">');
        var $canvas = $('#jsSnake');
        $canvas.attr('width', snakejs.width);
        $canvas.attr('height', snakejs.height);
        var canvas = $canvas[0];
        ctx = canvas.getContext('2d');
        newGame();
        gameOpen();
    }
    
    function gameOpen() {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, snakejs.width, snakejs.height);
        ctx.fillStyle="#FFFFFF";
        ctx.font = "bold 16px Arial";
        ctx.fillText("Play? Press 'Enter'", snakejs.width / 4, snakejs.height / 2);
        ctx.globalAlpha = 1;
        document.onkeydown = function() {enterKey();};
    }
    
    function enterKey() {
        switch (window.event.keyCode) {
            case 13:
                newGame();
                document.onkeydown = function() {snake.arrowKeys()};
                gameLoop();
                break;
        }
    }
    function newGame() {
        ctx.clearRect(0,0,snakejs.width,snakejs.height);
        distanceX = snakejs.snakeBlock;
        distanceY = 0;
        score = 0;
        frameLength = frameLengthStart;
        highScore = localStorage["highscore"];
        snake = snakejs.snake();
        apple = snakejs.apple();
        apple.setPosition();   
    }
    
    function gameLoop() {
        if(!snake.isOver()) {
            ctx.clearRect(0,0,snakejs.width,snakejs.height);

            ctx.rect(0,0,snakejs.width,snakejs.height);
            ctx.stroke();
            snake.setMove();
            if(snake.getHeadPosition()[0] == apple.getPosition()[0] && snake.getHeadPosition()[1] == apple.getPosition()[1]) {
                apple.setPosition();
                score++;
                frameLength = (frameLengthStart - (score*10) > frameLengthMax) ? (frameLengthStart - (score*10)) : frameLengthMax; 
            } else {
                snake.removeTail();
            }
            ctx.fillStyle="#000000";
            snake.render(ctx);
            apple.render(ctx);

            ctx.fillStyle="#d3d3d3";
            ctx.font = "12px Arial";
            ctx.fillText("Score: " + score, 10, 15);
            
            ctx.fillText("High Score: " + highScore, 100, 15);

            ctx.fillStyle="#000000";

            loop = setTimeout(gameLoop, frameLength);
        } else {
            snake.retreat();
            snake.render(ctx);
            gameOver();
        }
    }
    
    function gameOver(){
        clearTimeout(loop);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, snakejs.width, snakejs.height);
        ctx.fillStyle="#FFFFFF";
        ctx.font = "bold 16px Arial";
        ctx.fillText("Game Over", snakejs.width / 2, snakejs.height / 2);
        ctx.fillText("Again? Press 'Enter'", snakejs.width / 2 - 75, snakejs.height / 2 + 50);
        localStorage["highscore"] = (highScore > score) ? highScore : score;
        ctx.globalAlpha = 1;
        document.onkeydown = function() {enterKey();};
        
    }
    
    return {
        init: init,
        gameOver: gameOver,
        gameOpen: gameOpen
    };
})();
    
snakejs.snake = function() {
    var snakeArray = [];
    var previousSnakeArray = [];
    
    snakeArray.push([10,10]); // x / y coordinates
    
    var distanceY = 0;
    var distanceX = 1;
    var xPos = snakejs.width/2;
    var yPos = snakejs.height/2;
    
    function retreat() {
        snakeArray = previousSnakeArray.slice();
    }
    
    function arrowKeys() {
        switch (window.event.keyCode) {
        case 37:
            //left 
            if(!isBackwards(-1,0)) {
                distanceY = 0;
                distanceX = -1;
            }
            break;
        case 38:
            //up
            if(!isBackwards(0,-1)) {
                distanceY = -1;
                distanceX = 0;    
            }
            break;
        case 39:
            //right
            if(!isBackwards(1,0)) {
                distanceY = 0;
                distanceX = 1;
            }
            break;
        case 40:
            //down
            if(!isBackwards(0,1)) {
                distanceY  = 1;
                distanceX = 0;
            }
            break;
        }
    }
    
    function isBackwards(x,y) {
        if(snakeArray.length > 1)
            if((snakeArray[1][0] == snakeArray[0][0] + x && x != 0) ||
               (snakeArray[1][1] == snakeArray[0][1] + y && y != 0))
                return true;
        return false;
    }
    
    function setMove(){
            previousSnakeArray = snakeArray.slice();
        
            var next = snakeArray[0].slice();
            next[0] += distanceX;
            next[1] += distanceY;
            snakeArray.unshift(next);
    }
    
    function render(ctx){
        for (var i = 1 ; i < snakeArray.length ; i++) {
            ctx.fillRect(snakeArray[i][0] * snakejs.snakeBlock, 
                         snakeArray[i][1] * snakejs.snakeBlock, 
                         snakejs.snakeBlock - 1, 
                         snakejs.snakeBlock - 1);
        }
        ctx.fillStyle="#FF0000";
        ctx.fillRect(snakeArray[0][0] * snakejs.snakeBlock, 
                     snakeArray[0][1] * snakejs.snakeBlock, 
                     snakejs.snakeBlock -1, 
                     snakejs.snakeBlock -1);
        ctx.fillStyle="#000000";
    }
    
    function isOver() {
        for ( var i = 1 ; i < snakeArray.length ; i++){
            if (snakeArray[i][0] == snakeArray[0][0] && snakeArray[i][1] == snakeArray[0][1])
                return true;
        }
        if (snakejs.height / snakejs.snakeBlock - 1 < snakeArray[0][1] || 
            snakejs.width / snakejs.snakeBlock - 1 < snakeArray[0][0] || 
            snakeArray[0][0] < 0 || 
            snakeArray[0][1] < 0 ) return true;
        return false;
    }
    
    function getHeadPosition() {
        return snakeArray[0]; // return head
        alert(getHeadPosition());
    }
    
    function removeTail() {
        snakeArray.pop();
    }
    
    return {
        setMove: setMove,
        render: render,
        getHeadPosition: getHeadPosition,
        removeTail: removeTail,
        isOver:isOver,
        arrowKeys: arrowKeys,
        retreat: retreat
    };
}

snakejs.apple = function() {
    var x;
    var y;
    
    function setPosition(){
        x = Math.floor(((Math.random() * snakejs.width) / snakejs.snakeBlock));
        y = Math.floor(((Math.random() * snakejs.width) / snakejs.snakeBlock));

    }
    function render(ctx){
        ctx.fillStyle="#007FFF";
        ctx.fillRect(x * snakejs.snakeBlock,y * snakejs.snakeBlock, snakejs.snakeBlock - 1,snakejs.snakeBlock - 1);   
    }
    function getPosition() {
        return [x,y];   
    }
    
    return {
        setPosition: setPosition,
        render:render,
        getPosition: getPosition
    };
}

$(document).ready(function() {
    snakejs.game.init();
});

