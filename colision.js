const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_width = window.innerWidth;
const window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

let astronauts = [];
let destroyedCount = 0;

// ----------- Clase ASTRONAUTA -----------
class Astronaut {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.baseSpeed = speed;
        this.speed = speed;

        // Parámetros de rotación
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1);
    }

    // Dibuja un astronauta
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        
        // Cuerpo del astronauta (traje espacial)
        context.fillStyle = this.color;
        
        // Casco (círculo)
        context.beginPath();
        context.arc(0, -this.height * 0.2, this.width * 0.4, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#fff";
        context.lineWidth = 2;
        context.stroke();
        
        // Visor del casco
        context.fillStyle = "#87CEEB";
        context.beginPath();
        context.arc(0, -this.height * 0.2, this.width * 0.25, 0, Math.PI * 2);
        context.fill();
        
        // Torso (rectángulo)
        context.fillStyle = this.color;
        context.fillRect(-this.width * 0.3, -this.height * 0.1, this.width * 0.6, this.height * 0.4);
        context.strokeRect(-this.width * 0.3, -this.height * 0.1, this.width * 0.6, this.height * 0.4);
        
        // Brazos
        context.fillRect(-this.width * 0.4, -this.height * 0.1, this.width * 0.1, this.height * 0.3);
        context.fillRect(this.width * 0.3, -this.height * 0.1, this.width * 0.1, this.height * 0.3);
        
        // Piernas
        context.fillRect(-this.width * 0.2, this.height * 0.3, this.width * 0.15, this.height * 0.3);
        context.fillRect(this.width * 0.05, this.height * 0.3, this.width * 0.15, this.height * 0.3);
        
        // Mochila
        context.fillStyle = "#666";
        context.fillRect(this.width * 0.15, -this.height * 0.05, this.width * 0.2, this.height * 0.3);
        
        context.restore();
    }

    update() {
        this.speed = this.baseSpeed + Math.random() * 0.3;
        this.y += this.speed;
        this.angle += this.rotationSpeed;

        if (this.y - this.height > canvas.height) {
            this.y = -this.height;
            this.x = Math.random() * canvas.width;
            this.baseSpeed = Math.random() * 2 + 1.5;
            this.rotationSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1);
        }

        this.draw(ctx);
    }

    // Detecta si el clic ocurre dentro del área del astronauta
    isClicked(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < Math.max(this.width, this.height);
    }
}

// ----------- Genera astronautas aleatorios -----------
function generateAstronauts(n) {
    for (let i = 0; i < n; i++) {
        let width = Math.random() * 30 + 40;
        let height = Math.random() * 40 + 60;
        let x = Math.random() * (canvas.width - width) + width/2;
        let y = Math.random() * -canvas.height;
        let color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`; // Tonos azules/verdes para trajes espaciales
        let speed = Math.random() * 2 + 1.5;
        astronauts.push(new Astronaut(x, y, width, height, color, speed));
    }
}

// ----------- Detecta clic para eliminar astronauta -----------
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < astronauts.length; i++) {
        if (astronauts[i].isClicked(mouseX, mouseY)) {
            destroyedCount++;

            // Reemplaza el astronauta con uno nuevo que cae desde arriba
            let width = Math.random() * 30 + 40;
            let height = Math.random() * 40 + 60;
            let x = Math.random() * (canvas.width - width) + width/2;
            let y = -height;
            let color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
            let speed = Math.random() * 2 + 1.5;
            astronauts[i] = new Astronaut(x, y, width, height, color, speed);
        }
    }
});

// ----------- Animación -----------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar y actualizar astronautas
    for (let astronaut of astronauts) {
        astronaut.update();
    }

    // Mostrar contador
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "right";
    ctx.fillText(`Astronautas eliminados: ${destroyedCount}`, canvas.width - 20, 30);

    requestAnimationFrame(animate);
}

// ----------- Iniciar simulación -----------
generateAstronauts(15);
animate();