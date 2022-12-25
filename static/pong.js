const canvas = document.querySelector('.pong-game');
const width = canvas.width = 1120;
var css_width = width;
const height = canvas.height = width / 16 * 9;
var css_height = height;
const ctx = canvas.getContext('2d');
class Ball {
    ballWidth = 20;
    ballSpeed = 12.5;
    ballDelta = this.ballSpeed / css_height * height;
    speeds = [-1, 1];
    ballSpeedX = this.ballDelta * this.speeds[(Math.floor(Math.random() * 2))];
    ballSpeedY = this.ballDelta * this.speeds[(Math.floor(Math.random() * 2))];
    waiting = false;
    winscreen = false;
    countdown = 3;
    ballCoords = {
        x: width / 2,
        y: height / 2
    };

    checkIfTouching() {
        if (this.ballCoords.x > width - ((this.ballWidth / 2) + paddleWidth + margin) &&
            this.ballCoords.y <= currentYR + (paddleHeight / 2) &&
            this.ballCoords.y >= currentYR - (paddleHeight / 2)) {
            // console.log("right paddle");
            this.ballSpeedX *= -1;
            this.ballSpeedY = ((this.ballCoords.y - currentYR) / (paddleHeight / 2) * this.ballDelta);
        }
        else if (this.ballCoords.x < ((this.ballWidth / 2) + paddleWidth + margin) &&
                 this.ballCoords.y <= currentYL + (paddleHeight / 2) &&
                 this.ballCoords.y >= currentYL - (paddleHeight / 2)) {
            // console.log("left paddle");
            this.ballSpeedX *= -1;
            this.ballSpeedY = ((this.ballCoords.y - currentYL) / (paddleHeight / 2) * this.ballDelta);
        }
    }

    countingDown() {
        this.waiting = true;
        this.countdown = 3;
        var self = this;
        setTimeout(() => {
            self.countdown = 2;
        }, 1000);
        setTimeout(() => {
            self.countdown = 1;
        }, 2000);
        setTimeout(() => {
            self.countdown = "Go!";
        }, 3000);
        setTimeout(() => {
            self.waiting = false;
        }, 4000);
    }

    checkWall() {
        if (this.ballCoords.y < (this.ballWidth)) {
            // console.log("top wall");
            this.ballSpeedY *= -1;  
        }
        else if (this.ballCoords.y > (height - this.ballWidth)) {
            // console.log("bottom wall");
            this.ballSpeedY *= -1;  
        }
        else if (this.ballCoords.x < this.ballWidth) {
            // console.log("passed the left");
            rscore++;
            currentYL = height/2;
            currentYR = height/2;
            this.ballSpeedX = this.ballDelta * this.speeds[(Math.floor(Math.random() * 2))];
            this.ballSpeedY = this.ballDelta * this.speeds[(Math.floor(Math.random() * 2))];
            this.ballCoords = {
                x: width / 2,
                y: height / 2
            };
            this.countingDown();
        }
        else if (this.ballCoords.x > (width - this.ballWidth)) {
            // console.log("passed the right");
            lscore++;
            currentYL = height / 2;
            currentYR = height / 2;
            this.ballSpeedX = this.ballDelta * this.speeds[(Math.floor(Math.random() * 2))];
            this.ballSpeedY = this.ballDelta * this.speeds[(Math.floor(Math.random() * 2))];
            this.ballCoords = {
                x: width / 2,
                y: height / 2
            };
            this.countingDown();
        }
    }

    moveBall() {
        if (!this.waiting && !paused) {
            this.checkIfTouching();
            this.checkWall();
            this.ballCoords.x += this.ballSpeedX;
            this.ballCoords.y += this.ballSpeedY;
        }
    }

    get ballCoords() {
        return this.ballCoords;
    }

    get ballWidth() {
        return this.ballWidth;
    }

    get waiting() {
        return this.waiting;
    }
    
    get winscreen() {
        return this.winscreen;
    }

    set winscreen(val) {
        this.winscreen = val;
    }
}
var pong_ball = new Ball();
const paddleWidth = 20;
const paddleHeight = 200;
const margin = paddleWidth;
var currentYL = height/2;
var currentYR = height/2;
const height_incr = 20;
const winning_pts = 5;
var game_started = false;
var lscore = 0;
var rscore = 0;
var paused = false;
var keysPressed = {
    'w': false,
    's': false,
    'up': false,
    'dn': false
};
// const fontname = 'monospace';
const fontname = 'share-tech-mono';
const sharetechmono = new FontFace(fontname, 'url(/static/fonts/sharetechmono-regular.ttf)');
sharetechmono.load().then(() => {
    document.fonts.add(sharetechmono);
});

const getMouseY = (e) => {
    var rect = canvas.getBoundingClientRect();
    return (e.clientY - rect.top) / css_height * height;
}
const haveAWinner = () => {
    if (lscore >= winning_pts && (lscore - rscore >= 2)) {
        drawBlank();
        game_started = false;
        drawWinner("l");
        return true;
    }
    else if (rscore >= winning_pts && (rscore - lscore >= 2)) {
        drawBlank();
        game_started = false;
        drawWinner("r");
        return true;
    }
    return false;
}

const updateCanvasWidth = () => {
    let onerem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var new_width = Math.min((window.innerWidth - 6 * onerem), 1120);
    canvas.style.width = new_width + 'px';
    css_width = new_width;
    css_height = canvas.style.height = ((new_width / 16 * 9) + 'px')
    css_height = (new_width / 16 * 9);
}

const drawBlank = () => {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
    ctx.fillRect(0, 0, width, height);
}

const drawWinner = (winner) => {
    switch (winner) {
        case "l":
            // console.log("p1 won");
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
            ctx.font = "90px " + fontname;
            ctx.textAlign = "center";
            ctx.fillText("PLAYER 1 WINS", width / 2, (height / 2) - 50);
            ctx.fillText("CLICK TO PLAY AGAIN", width / 2, (height / 2) + 50);
            game_started = false;
            // console.log("setting winscreen to true");
            pong_ball.winscreen = true;
            break;
        case "r":
            // console.log("p2 won");
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
            ctx.font = "90px " + fontname;
            ctx.textAlign = "center";
            ctx.fillText("PLAYER 2 WINS", width / 2, (height / 2) - 50);
            ctx.font = "50px " + fontname;
            ctx.fillText("CLICK TO PLAY AGAIN", width / 2, (height / 2) + 50);
            game_started = false;
            // console.log("setting winscreen to true");
            pong_ball.winscreen = true;
            break;
        default:
            break;
    }
}

const drawPaddles = (yL, yR) => {
    drawBlank();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    ctx.fillRect(margin, (yL) - (paddleHeight / 2), paddleWidth, paddleHeight);
    ctx.fillRect(width - (margin + paddleWidth), (yR) - (paddleHeight / 2), paddleWidth, paddleHeight);
}

const drawBall = (x, y, ballWidth) => {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    ctx.textAlign = "center";
    var canvas_x = (x - (ballWidth / 2)); 
    var canvas_y = (y - (ballWidth / 2));
    if (!pong_ball.waiting) {
        ctx.fillRect(canvas_x, canvas_y, ballWidth, ballWidth);
    }
    else {
        ctx.font = '70px ' + fontname;
        ctx.fillText(pong_ball.countdown, (width / 2), height / 2);
    }
    if (paused) {
        ctx.textAlign = "start";
        ctx.font = '30px ' + fontname;
        ctx.fillText("Paused", 15, 40);
    }
}

const drawScores = () => {
    ctx.font = '30px ' + fontname;
    ctx.textAlign = "center";
    ctx.fillText(lscore + " - " + rscore, (width / 2), 40); 
}

const drawStartScreen = () => {
    drawBlank();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    ctx.font = "90px " + fontname;
    ctx.textAlign = "center";
    ctx.fillText("CLICK TO PLAY", width / 2, height / 2);
}

const drawPong = (yL, yR) => {  
    // console.log('did the window change');
    updateCanvasWidth();

    if (game_started) {
        if (!paused) {
            canvas.style.cursor = "none";
        }
        else {
            canvas.style.cursor = "default";
        }
        if (!haveAWinner()) {
            drawPaddles(yL, yR);
            var coords = pong_ball.ballCoords;
            var x = coords.x;
            var y = coords.y;
            // printKeysDown();
            var width = pong_ball.ballWidth;
            drawBall(x, y, width);
            drawScores();
        }
    } else {
        canvas.style.cursor = "default";
    }
}

// canvas.addEventListener('mousemove', (e) => {
//     y = getMouseY(e);
//     if (y > (paddleHeight / 2) && y < (height - (paddleHeight / 2))) { 
//         drawPong(y);
//         currentY = y;
//     }
// }, false);

const updatePaddlePos = () => {
    var dY = height_incr / css_height * height;
    if (!pong_ball.waiting && !paused) {
        if (keysPressed['w'] && !keysPressed['s'] && currentYL > (paddleHeight / 2)) {
            currentYL -= dY;
        }
        else if (keysPressed['s'] && !keysPressed['w'] && currentYL < (height - (paddleHeight / 2))) {
            currentYL += dY;
        }
    
        if (keysPressed['up'] && !keysPressed['dn'] && currentYR > (paddleHeight / 2)) {
            currentYR -= dY;
        }
        else if (keysPressed['dn'] && !keysPressed['up'] && currentYR < (height - (paddleHeight / 2))) {
            currentYR += dY;
        }
    }
}

const printKeysDown = () => {
    console.log('w:    ' + keysPressed['w'] +
              '\ns:    ' + keysPressed['s'] +
              '\nup:   ' + keysPressed['up'] +
              '\ndown: ' + keysPressed['dn']);
}

window.addEventListener('keydown', (e) => {
    e.preventDefault();
    switch (e.key) {
        case 'w':
            keysPressed['w'] = true;
            break;
        case 's':
            keysPressed['s'] = true;
            break;
        case 'ArrowUp':
            keysPressed['up'] = true;
            break;
        case 'ArrowDown':
            keysPressed['dn'] = true;
            break;
        case ' ':
        case 'Enter':
            if (!pong_ball.waiting) {
                paused = !paused;
            }
            break;
        default:
            break;
    }
}, false);

window.addEventListener('keyup', (e) => {
    e.preventDefault();
    switch (e.key) {
        case 'w':
            keysPressed['w'] = false;
            break;
        case 's':
            keysPressed['s'] = false;
            break;
        case 'ArrowUp':
            keysPressed['up'] = false;
            break;
        case 'ArrowDown':
            keysPressed['dn'] = false;
            break;
        default:
            break;
    }
}, false);


canvas.addEventListener("click", (e) => {
    e.preventDefault();
    if (!game_started) {
        keysPressed = {
            'w': false,
            's': false,
            'up': false,
            'dn': false
        };
        pong_ball.ballCoords = {
            x: width / 2,
            y: height / 2
        };
        pong_ball.ballSpeedX = pong_ball.ballDelta * pong_ball.speeds[(Math.floor(Math.random() * 2))];
        pong_ball.ballSpeedY = pong_ball.ballDelta * pong_ball.speeds[(Math.floor(Math.random() * 2))];
        paused = false;
        lscore = rscore = 0;
        currentYL = currentYR = height / 2;
        game_started = true;
        // console.log("setting winscreen to false");
        pong_ball.winscreen = false;
        pong_ball.countingDown();
    }
    else if (!pong_ball.waiting) {
        paused = !paused;
    }
}, false);

var updatingPaddles = setInterval(() => {
    if (game_started) {
        updatePaddlePos();
        pong_ball.moveBall();
    }
}, 20);

var drawingPong = setInterval(() => {
    if (!game_started && !(pong_ball.winscreen)) {
        drawStartScreen();
    } else if (game_started) {
        drawPong(currentYL, currentYR);
    }
}, 1000/144);

window.addEventListener('DOMContentLoaded', () => {
    drawPong(currentYL, currentYR);
}, false);
window.addEventListener('resize', () => {
    drawPong(currentYL, currentYR);
}, false);