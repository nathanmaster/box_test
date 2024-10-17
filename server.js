const express = require('express');
const app = express();
const port = 3000;

const colors = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "yellow",
    "pink"
];

const settings = {
    ballSize: 4,
    ballAmount: 10,
    maxDuration: 100
};

// Global random number function
function randomNumber(n, s) {
    return Math.floor(Math.random() * n) + s;
}

// Update direction of balls
function updateDirection(balls, canvasWidth, canvasHeight) {
    for (let i = 0; i < balls.length; i++) {
        if ((balls[i].y + balls[i].dirY * balls[i].speed > canvasHeight - balls[i].size) || (balls[i].y + balls[i].dirY * balls[i].speed < balls[i].size)) {
            balls[i].dirY = -balls[i].dirY;
        }
        if ((balls[i].x + balls[i].dirX * balls[i].speed > canvasWidth - balls[i].size) || (balls[i].x + balls[i].dirX * balls[i].speed < balls[i].size)) {
            balls[i].dirX = -balls[i].dirX;
        }

        balls[i].y += balls[i].dirY * balls[i].speed;
        balls[i].x += balls[i].dirX * balls[i].speed;
    }
}

// Push objects to list, checks ballsOnScreen == ballsAmount
function createBalls(canvas, balls) {
    for (let i = 0; i < settings.ballAmount; i++) {
        balls.push(addBall(canvas));
    }
}

// Draws all objects of balls[] on canvas
function drawBalls(ctx, balls) {
    for (let i = 0; i < balls.length; i++) {
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, balls[i].size, 0, 2 * Math.PI);
        ctx.fillStyle = balls[i].color;
        ctx.fill();
    }
}

// Returns values for ball object with specified values
function addBall(canvas) {
    return {
        x: randomNumber(canvas.width - settings.ballSize * 2, 0) + settings.ballSize,
        y: randomNumber(canvas.height - settings.ballSize * 2, 0) + settings.ballSize,
        size: randomNumber(settings.ballSize, 5),
        color: colors[randomNumber(colors.length, 0)],
        dirX: randomNumber(2, 1) === 1 ? 1 : -1,
        dirY: randomNumber(2, 1) === 1 ? 1 : -1,
        speed: randomNumber(5, 1)
    };
}

// Handle mouse click event
function handleMouseClick(event, balls, canvas) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < balls.length; i++) {
        if (mouseX >= balls[i].x - balls[i].size && mouseX <= balls[i].x + balls[i].size &&
            mouseY >= balls[i].y - balls[i].size && mouseY <= balls[i].y + balls[i].size) {
            balls.splice(i, 1);
            balls.push(addBall(canvas));
            break;
        }
    }
}

// Set up routes and middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});