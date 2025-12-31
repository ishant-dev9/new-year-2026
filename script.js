/* ---------------- SCREEN CONTROL ---------------- */
let celebrationStarted = false;

let current = 0;
const screens = document.querySelectorAll(".screen");

function nextScreen() {
    screens[current].classList.remove("active");
    current++;
    if (current < screens.length) {
        screens[current].classList.add("active");
    }
}

/* ---------------- ROCKET ---------------- */

function launchRocket() {
    const rocket = document.getElementById("rocket");
    rocket.style.transform = "translateY(-260px)";

    setTimeout(nextScreen, 1300);
}

/* ---------------- MUSIC ---------------- */

function playMusic() {
    const song = document.getElementById("song");
    if (!song) return;

    song.volume = 1;
    song.muted = false;

    song.play().catch(() => {
        alert("Tap once more to allow music 🎵");
    });
}

/* ---------------- CELEBRATE CONTROLLER ---------------- */

function celebrate() {
    if (celebrationStarted) return;
    celebrationStarted = true;

    startCountdown(() => {
        startSnowfall();
        fireworksBurst();
        burstConfetti();
        showCelebrationText();

        setTimeout(fireworksBurst, 600);
    });
}




/* ---------------- CONFETTI ---------------- */

let confettiActive = false;

function burstConfetti() {
    if (confettiActive) return; // prevent stacking
    confettiActive = true;

    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const pieces = 90; // reduced but smoother

    for (let i = 0; i < pieces; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: -20,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 3 + 2,
            r: Math.random() * 4 + 2,
            color: `hsl(${Math.random() * 360},100%,60%)`,
            life: 200
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((c, i) => {
            c.x += c.vx;
            c.y += c.vy;
            c.life--;

            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();

            if (c.life <= 0) confetti.splice(i, 1);
        });

        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confettiActive = false;
        }
    }

    animate();
}


let angle = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(c => {
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt, c.y);
        ctx.lineTo(c.x + c.tilt + c.r, c.y + c.tilt);
        ctx.stroke();
    });

    update();
}

function update() {
    angle += 0.01;
    confetti.forEach(c => {
        c.y += Math.cos(angle + c.d) + 2;
        c.x += Math.sin(angle);
        c.tilt += Math.sin(c.tiltSpeed);

        if (c.y > canvas.height) {
            c.y = -10;
            c.x = Math.random() * canvas.width;
        }
    });
}

const interval = setInterval(draw, 16);

setTimeout(() => {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}, 5000);


/* ---------------- FIREWORKS ---------------- */

function fireworksBurst() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const bursts = 3;

    for (let b = 0; b < bursts; b++) {
        const cx = Math.random() * canvas.width;
        const cy = Math.random() * canvas.height * 0.5;

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: cx,
                y: cy,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 5 + 2,
                r: Math.random() * 2 + 1,
                alpha: 1,
                color: `hsl(${Math.random() * 360},100%,60%)`
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.alpha -= 0.015;

            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            if (p.alpha <= 0) particles.splice(i, 1);
        });

        ctx.globalAlpha = 1;

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

/* ---------------- TEXT ANIMATION ---------------- */

function showCelebrationText() {
    const textEl = document.getElementById("celebrationText");
    const message = "🎉 Happy New Year 2026 🎉";

    textEl.textContent = "";
    textEl.classList.add("show");

    let index = 0;

    const typing = setInterval(() => {
        textEl.textContent += message[index];
        index++;

        if (index >= message.length) {
            clearInterval(typing);

            setTimeout(() => {
                textEl.classList.remove("show");
                textEl.textContent = "";
            }, 2500);
        }
    }, 80);
}


function startCountdown(onComplete) {
    const countdown = document.getElementById("countdown");
    let count = 5;

    countdown.textContent = count;
    countdown.classList.add("show");

    const interval = setInterval(() => {
        count--;

        if (count > 0) {
            countdown.textContent = count;
        } else {
            clearInterval(interval);
            countdown.classList.remove("show");
            countdown.textContent = "";
            onComplete(); // trigger celebration
        }
    }, 800);
}

/* ---------------- SNOWFALL MODE ---------------- */

let snowActive = false;
let snowflakes = [];
let snowCtx, snowCanvas;

function startSnowfall() {
    if (snowActive) return;
    snowActive = true;

    snowCanvas = document.getElementById("snowCanvas");
    snowCtx = snowCanvas.getContext("2d");

    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;

    snowflakes = [];

    const count = Math.min(120, Math.floor(window.innerWidth / 8));

    for (let i = 0; i < count; i++) {
        snowflakes.push(createSnowflake());
    }

    animateSnow();
}

function createSnowflake() {
    return {
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height,
        r: Math.random() * 3 + 1,
        speedY: Math.random() * 1.5 + 0.5,
        drift: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.5 + 0.4
    };
}

function animateSnow() {
    if (!snowActive) return;

    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    snowflakes.forEach(flake => {
        flake.y += flake.speedY;
        flake.x += flake.drift;

        if (flake.y > snowCanvas.height) {
            flake.y = -10;
            flake.x = Math.random() * snowCanvas.width;
        }

        snowCtx.globalAlpha = flake.opacity;
        snowCtx.fillStyle = "#ffffff";
        snowCtx.beginPath();
        snowCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        snowCtx.fill();
    });

    snowCtx.globalAlpha = 1;
    requestAnimationFrame(animateSnow);
}

function stopSnowfall() {
    snowActive = false;
    if (snowCtx) {
        snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    }
}
startSnowfall();
