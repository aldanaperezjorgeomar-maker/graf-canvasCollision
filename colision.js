const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Ajustar el tamaño del canvas a la ventana
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8"; // Fondo amarillo claro

// -------------------- Clase Circle --------------------
class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.text = text;
    this.speed = speed;

    // Direcciones iniciales aleatorias
    this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;

    this.isFlashing = false; // Control de “flash” temporal
  }

  // Dibuja el círculo solo con contorno
  draw(context) {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = this.color;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();

    // Dibujar texto en el centro
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "16px Arial";
    context.fillText(this.text, this.posX, this.posY);
  }

  // Actualiza posición y rebotes contra bordes
  update() {
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote en bordes del canvas
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  // Detecta si colisiona con otro círculo (distancia entre centros)
  detectCollision(otherCircle) {
    const dx = this.posX - otherCircle.posX;
    const dy = this.posY - otherCircle.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + otherCircle.radius;
  }

  // Método que maneja la colisión con otro círculo
  handleCollision(otherCircle) {
    // Invertir direcciones (rebote)
    this.dx = -this.dx;
    this.dy = -this.dy;
    otherCircle.dx = -otherCircle.dx;
    otherCircle.dy = -otherCircle.dy;

    // Efecto “flash” azul breve
    this.flashBlue();
    otherCircle.flashBlue();
  }

  // Hace que el círculo parpadee en azul y regrese al color original
  flashBlue() {
    if (this.isFlashing) return; // Evitar múltiples flashes simultáneos

    this.isFlashing = true;
    const previousColor = this.color;
    this.color = "#0000FF"; // Azul

    // Regresar al color original después de 150 ms
    setTimeout(() => {
      this.color = previousColor;
      this.isFlashing = false;
    }, 150);
  }
}

// -------------------- Generación de círculos --------------------
let circles = [];

function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 25 + 15; // Radio entre 15 y 40
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
    let text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

// -------------------- Animación --------------------
function animate() {
  ctx.clearRect(0, 0, window_width, window_height);

  // Actualizar posiciones
  circles.forEach(circle => circle.update());

  // Detectar colisiones entre círculos
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      if (circles[i].detectCollision(circles[j])) {
        circles[i].handleCollision(circles[j]);
      }
    }
  }

  // Dibujar círculos
  circles.forEach(circle => circle.draw(ctx));

  requestAnimationFrame(animate);
}

// -------------------- Inicio --------------------
generateCircles(20);
animate();