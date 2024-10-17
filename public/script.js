console.log("Script loaded");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const balls = [];
let frameCount = 0;

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
    ballSize: 40,
    ballAmount: 1000,
    maxDuration: 100
};

// Global random number function
function randomNumber(n, s) {
    return Math.floor(Math.random() * n) + s;
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

// Attach functions to the window object
window.createBalls = function(canvas, balls) {
    console.log("Creating balls...");
    for (let i = 0; i < settings.ballAmount; i++) {
        balls.push(addBall(canvas));
    }
    console.log("Balls created:", balls);
};

window.drawBalls = function(ctx, balls) {
    for (let i = 0; i < balls.length; i++) {
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, balls[i].size, 0, 2 * Math.PI);
        ctx.fillStyle = balls[i].color;
        ctx.fill();
    }
};

window.updateDirection = function(balls, canvasWidth, canvasHeight) {
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
};

window.handleMouseClick = function(event, balls, canvas) {
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
};

// Create balls
window.createBalls(canvas, balls);

// Main loop
function runCode() {
    frameCount++;
    console.log(`Frame: ${frameCount}`);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.drawBalls(ctx, balls);
    window.updateDirection(balls, canvas.width, canvas.height);
    /*setTimeout(() => {
        requestAnimationFrame(runCode);
    }, 1); // Adding a delay of 100ms between frames */
    requestAnimationFrame(runCode);
}

// Start loop
runCode();

// Handle mouse click event
canvas.addEventListener('click', (event) => {
    window.handleMouseClick(event, balls, canvas);
});

console.log("Script executed successfully.");