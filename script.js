const canvas = document.getElementById("hillCanvas");
const ctx = canvas.getContext("2d");

let waveOffset = 0; // Offset for drawing the hills
let amplitude = 40; // Height of the hills
let frequency = 0.005; // Frequency for the smooth rolling hills
let boulder;
let isMoving = false; // Flag to prevent overlapping movements

// Set the canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 200;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Boulder class representing the rolling boulder with an image and momentum-based movement
class Boulder {
    constructor() {
        this.x = canvas.width / 2; // Fixed horizontal position (centered)
        this.radius = 25;
        this.y = this.getYOnHill(this.x); // Start y-position on the hill
        this.rotation = 0;

        // Physical properties
        this.velocity = 0; // Horizontal velocity
        this.gravity = 0.05; // Gravity-like effect for downhill acceleration
        this.friction = 0.02; // Friction for uphill deceleration

        // Load the boulder image
        this.image = new Image();
        this.image.src = 'boulder.png';

        // Wait for the image to load
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        };
    }

    // Draw the boulder image with rotation
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
    }

    // Calculate the y position of the hill at a given x based on the sine wave
    getYOnHill(x) {
        return Math.sin((x + waveOffset) * frequency) * amplitude + canvas.height / 2;
    }

    // Calculate the slope of the hill at a given x
    getSlope(x) {
        const deltaX = 1; // Small value to calculate slope
        const y1 = this.getYOnHill(x - deltaX);
        const y2 = this.getYOnHill(x + deltaX);
        return (y2 - y1) / (2 * deltaX); // Rise over run
    }

    // Update the boulder's movement based on momentum and hill slope
    update() {
        const slope = this.getSlope(this.x);

        // Adjust velocity based on slope
        if (slope > 0) {
            // Uphill - apply friction to slow down
            this.velocity -= this.friction;
        } else if (slope < 0) {
            // Downhill - apply gravity to accelerate
            this.velocity += this.gravity;
        }

        // Limit the velocity to a reasonable range
        this.velocity = Math.max(Math.min(this.velocity, 5), -5);

        // Update waveOffset based on the boulder's velocity to scroll the hills
        waveOffset += this.velocity;

        // Update y position to follow the hill’s curve and rotation
        this.y = this.getYOnHill(this.x);
        this.rotation += this.velocity / this.radius; // Adjust rotation based on velocity
    }
}

// Function to move the boulder by a specified initial velocity when a task is completed
function moveBoulder(distance) {
    if (boulder && !isMoving) {
        isMoving = true;

        // Set initial velocity based on distance and difficulty
        boulder.velocity = distance / 100; // Adjust this divisor for initial speed sensitivity

        // Allow the boulder to naturally slow down or speed up based on the slope
        const animate = () => {
            boulder.update();
            boulder.draw();

            if (Math.abs(boulder.velocity) > 0.01) {
                requestAnimationFrame(animate); // Continue animation if velocity is significant
            } else {
                isMoving = false; // Stop movement when velocity is very low
            }
        };

        animate();
    }
}

// Draw the smooth rolling hills as a continuous sine wave
function drawHills() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#333";

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    // Create a smooth sine wave across the width of the canvas
    for (let x = 0; x <= canvas.width; x++) {
        const y = Math.sin((x + waveOffset) * frequency) * amplitude + canvas.height / 2;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
}

// Update function for drawing and animation
function update() {
    drawHills(); // Draw the hills with the current waveOffset
    boulder.draw(); // Draw the boulder at its current position
    requestAnimationFrame(update); // Continuously update
}

// Initialize the boulder and start the animation loop
function init() {
    boulder = new Boulder();
    update();
}

init();
