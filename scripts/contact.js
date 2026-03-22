const form = document.querySelector("form");

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const fire = {
  x: () => canvas.width / 2,
  y: () => canvas.height - 120,
};

let animationStarted = false;
let envelope;
let particles = [];
let pendingSubmit = null; // 👈 store form submit event

class Envelope {
  constructor() {
    this.reset();
  }

  reset(x = canvas.width / 2, y = 100) {
    this.startX = x;
    this.startY = y;

    this.x = x;
    this.y = y;

    this.ctrlX = canvas.width * 0.5;
    this.ctrlY = canvas.height * 0.1;

    this.t = 0;
    this.angle = 0;
    this.burn = 0;
    this.dead = false;
  }

  bezier(t, p0, p1, p2) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  update() {
    if (this.t < 1) {
      this.t += 0.0045;
      if (this.t > 1) this.t = 1;
    }

    this.x = this.bezier(this.t, this.startX, this.ctrlX, fire.x());
    this.y = this.bezier(this.t, this.startY, this.ctrlY, fire.y());

    this.angle = Math.sin(this.t * Math.PI) * 0.8;

    const dist = Math.hypot(this.x - fire.x(), this.y - fire.y());

    if (dist < 90 && this.t >= 1) {
      this.burn += 0.02;
      if (this.burn >= 1) this.dead = true;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const size = 42 * (1 - this.burn);

    ctx.fillStyle = `rgba(${255 - this.burn * 120}, ${255 - this.burn * 140}, ${255 - this.burn * 140}, 1)`;
    ctx.strokeStyle = "#ddd";

    // body
    ctx.beginPath();
    ctx.rect(-size, -size / 2, size * 2, size);
    ctx.fill();
    ctx.stroke();

    // flap
    ctx.beginPath();
    ctx.moveTo(-size, -size / 2);
    ctx.lineTo(0, 0);
    ctx.lineTo(size, -size / 2);
    ctx.closePath();
    ctx.fillStyle = "#eee";
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = Math.random() * -2;
    this.life = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.type === "smoke") this.life -= 0.008;
    else this.life -= 0.02;

    this.vy -= 0.02;
  }

  draw() {
    ctx.beginPath();

    if (this.type === "fire") {
      ctx.fillStyle = `rgba(255,160,0,${this.life})`;
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    } else if (this.type === "spark") {
      ctx.fillStyle = `rgba(255,220,120,${this.life})`;
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    } else {
      ctx.fillStyle = `rgba(160,160,160,${this.life})`;
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    }

    ctx.fill();
  }
}

function spawnFire() {
  particles.push(
    new Particle(fire.x() + (Math.random() - 0.5) * 50, fire.y(), "fire"),
  );

  if (Math.random() < 0.25) {
    particles.push(
      new Particle(fire.x() + (Math.random() - 0.5) * 80, fire.y(), "spark"),
    );
  }

  if (Math.random() < 0.15) {
    particles.push(
      new Particle(
        fire.x() + (Math.random() - 0.5) * 60,
        fire.y() - 10,
        "smoke",
      ),
    );
  }
}

function drawFireGlow() {
  const g = ctx.createRadialGradient(
    fire.x(),
    fire.y(),
    10,
    fire.x(),
    fire.y(),
    120,
  );

  g.addColorStop(0, "rgba(255,140,0,0.25)");
  g.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(fire.x(), fire.y(), 120, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawFireGlow();
  spawnFire();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  if (envelope && !envelope.dead) {
    envelope.update();
    envelope.draw();
  }

  requestAnimationFrame(loop);
}

// 🔥 START ANIMATION FUNCTION
function startAnimation() {
  if (animationStarted) return;
  animationStarted = true;

  canvas.style.display = "block";

  envelope = new Envelope();
  particles = [];

  envelope.reset(window.innerWidth / 2, 100);
}

// 🚀 FORM SUBMIT HOOK
const main = document.querySelector("main");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 🔥 hide everything in main while animation runs
  main.classList.add("is-hidden");

  // show canvas ONLY now
  canvas.style.display = "block";

  // reset animation state
  envelope = new Envelope();
  particles = [];
  envelope.reset(window.innerWidth / 2, 100);

  startLoop();

  // after animation → submit form
  setTimeout(() => {
    e.target.submit();
  }, 2500);
});
let running = false;

function startLoop() {
  if (running) return;
  running = true;
  loop();
}
/*
// when the "submit-button" is clicked, the contents of the contact-page are replaced with a single <p> element that reads "Thank you for your message" in size 24 font.
const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {
  const contactPage = document.getElementById("contact-page");
  contactPage.innerHTML =
    "<h2>Thank you for your message!</h2>" +
    '<p id="home-message">Click the home below to return to the homepage.</p>';
  const homePage = document.getElementById("home-page");
  homePage.id = "show-home-page";
  contactPage.style.fontSize = "24px";
});
// hint: you can change the style of an element by modifying the value of that element's .style.fontSize, or by updating its .classList.
*/
