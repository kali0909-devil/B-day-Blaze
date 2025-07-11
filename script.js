document.getElementById("ageForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const birthdate = new Date(document.getElementById("birthdate").value);
  const today = new Date();

  let ageYears = today.getFullYear() - birthdate.getFullYear();
  let ageMonths = today.getMonth() - birthdate.getMonth();
  let ageDays = today.getDate() - birthdate.getDate();

  if (ageDays < 0) {
    ageMonths -= 1;
    ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (ageMonths < 0) {
    ageYears -= 1;
    ageMonths += 12;
  }

  const lastBirthday = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
  if (lastBirthday > today) lastBirthday.setFullYear(today.getFullYear() - 1);

  const nextBirthday = new Date(lastBirthday);
  nextBirthday.setFullYear(lastBirthday.getFullYear() + 1);

  const daysSinceLast = Math.floor((today - lastBirthday) / (1000 * 60 * 60 * 24));
  const daysUntilNext = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  const output = `
    🎉 You are <strong>${ageYears} years, ${ageMonths} months, ${ageDays} days</strong> old.<br/>
    🕒 <strong>${daysSinceLast}</strong> days have passed since your last birthday.<br/>
    🎂 Only <strong>${daysUntilNext}</strong> days left until your next birthday!
  `;

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = output;
  outputDiv.classList.remove("hidden");
  outputDiv.classList.add("visible");

  launchFireworks();
});

// --- Fireworks ---
function launchFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fireworks = [];

  function createFirework() {
    const colors = ["#ff4d4d", "#ffcc00", "#66ff66", "#66ccff", "#cc66ff"];
    return {
      x: Math.random() * canvas.width,
      y: canvas.height,
      targetY: Math.random() * canvas.height / 2,
      radius: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      dy: -5 - Math.random() * 5,
      exploded: false,
      particles: []
    };
  }

  function createParticles(firework) {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 4 + 2;
      firework.particles.push({
        x: firework.x,
        y: firework.targetY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        alpha: 1,
        color: firework.color
      });
    }
  }

  for (let i = 0; i < 4; i++) {
    fireworks.push(createFirework());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((fw, index) => {
      if (!fw.exploded) {
        fw.y += fw.dy;
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.fill();

        if (fw.y <= fw.targetY) {
          fw.exploded = true;
          createParticles(fw);
        }
      } else {
        fw.particles.forEach(p => {
          p.x += p.dx;
          p.y += p.dy;
          p.alpha -= 0.02;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
          ctx.fill();
        });
        fw.particles = fw.particles.filter(p => p.alpha > 0);
      }
    });

    fireworks = fireworks.filter(fw => fw.particles.length > 0 || !fw.exploded);

    if (fireworks.length > 0) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
