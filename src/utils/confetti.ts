import confetti from 'canvas-confetti';

export function fireMansionConfetti() {
  // Electric cyan, soft gold, ice white, navy blue sparkles
  const colors = ['#00F0FF', '#FCD34D', '#F59E0B', '#38BDF8', '#FFFFFF', '#60A5FA'];

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors,
    ticks: 200,
    gravity: 1.1,
    scalar: 1.1,
  });
}

export function fireGrandFinaleConfetti() {
  const colors = ['#00F0FF', '#FCD34D', '#F59E0B', '#E2E8F0', '#38BDF8', '#D97706'];
  const end = Date.now() + 2500;

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      startVelocity: 35,
      spread: 360,
      ticks: 80,
      origin: { x: Math.random(), y: Math.random() * 0.4 },
      colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });
  }, 250);
}

export function fireShower() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#00F0FF', '#FCD34D', '#38BDF8', '#FFFFFF'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
