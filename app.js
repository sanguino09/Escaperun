const state = {
  kittyWord: "",
  solved: {
    kitty: false,
    travel: false,
    drink: false,
    final: false,
  },
  digits: {
    kitty: "2",
    travel: "9",
    drink: "0",
  },
};

const stepsOrder = ["kitty", "travel", "drink", "final"];

const sections = {
  intro: document.getElementById("intro"),
  kitty: document.getElementById("kitty-puzzle"),
  travel: document.getElementById("travel-puzzle"),
  drink: document.getElementById("drink-puzzle"),
  final: document.getElementById("final-lock"),
  celebration: document.getElementById("celebration"),
};

const progressMap = stepsOrder.reduce((acc, step) => {
  const element = document.querySelector(`[data-step="${step}"]`);
  if (element) acc[step] = element;
  return acc;
}, {});

const kittyDisplay = document.getElementById("kittyDisplay");
const kittyMessage = document.getElementById("kittyMessage");
const kittyReset = document.getElementById("kittyReset");
const travelMessage = document.getElementById("travelMessage");
const drinkMessage = document.getElementById("drinkMessage");
const finalMessage = document.getElementById("finalMessage");
const finalCodeInput = document.getElementById("finalCode");

function revealSection(key) {
  const section = sections[key];
  if (!section) return;
  section.classList.remove("hidden");
  section.setAttribute("aria-hidden", "false");
  section.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hideSection(key) {
  const section = sections[key];
  if (!section) return;
  section.classList.add("hidden");
  section.setAttribute("aria-hidden", "true");
}

function updateProgress(completedStep) {
  const element = progressMap[completedStep];
  if (element) {
    element.classList.add("completed");
    element.classList.remove("active");
  }
  const currentIndex = stepsOrder.indexOf(completedStep);
  const nextStep = stepsOrder[currentIndex + 1];
  if (nextStep && progressMap[nextStep]) {
    progressMap[nextStep].classList.add("active");
  }
}

function resetKittyWord() {
  state.kittyWord = "";
  kittyDisplay.textContent = "";
  document.querySelectorAll(".kitty-sticker").forEach((btn) => {
    btn.classList.remove("selected");
  });
}

function handleKittyStickerClick(event) {
  if (state.solved.kitty) return;
  const button = event.currentTarget;
  button.classList.add("selected");
  const letter = button.dataset.letter;
  state.kittyWord += letter;
  kittyDisplay.textContent = state.kittyWord;

  if (state.kittyWord.length === 5) {
    const attempt = state.kittyWord.toLowerCase();
    if (attempt === "kitty") {
      state.solved.kitty = true;
      kittyMessage.textContent = `¡Perfecto! Primer número: ${state.digits.kitty}`;
      updateProgress("kitty");
      setTimeout(() => {
        revealSection("travel");
      }, 400);
    } else {
      kittyMessage.textContent = "Casi... prueba otra combinación con estilo.";
      setTimeout(() => {
        resetKittyWord();
      }, 600);
    }
  } else {
    kittyMessage.textContent = "Sigue tocando los stickers para completar la palabra.";
  }
}

function setupKittyPuzzle() {
  document.querySelectorAll(".kitty-sticker").forEach((btn) => {
    btn.addEventListener("click", handleKittyStickerClick);
  });
  kittyReset.addEventListener("click", () => {
    resetKittyWord();
    kittyMessage.textContent = "¡Reiniciado! Intenta conseguir el lazo correcto.";
  });
}

function handleDestinationClick(event) {
  if (state.solved.travel) return;
  const button = event.currentTarget;
  const key = button.dataset.key;

  document.querySelectorAll(".destination-card").forEach((card) => {
    card.classList.remove("incorrect");
  });

  if (key === "tokyo") {
    state.solved.travel = true;
    button.classList.add("correct");
    travelMessage.textContent = `¡Lo lograste! Segundo número: ${state.digits.travel}`;
    updateProgress("travel");
    document.querySelectorAll(".destination-card").forEach((card) => {
      card.disabled = true;
    });
    setTimeout(() => {
      revealSection("drink");
    }, 400);
  } else {
    button.classList.add("incorrect");
    travelMessage.textContent = "No exactamente... piensa en el universo alegre de Sanrio.";
  }
}

function setupTravelPuzzle() {
  document.querySelectorAll(".destination-card").forEach((card) => {
    card.addEventListener("click", handleDestinationClick);
  });
}

function handleDrinkSubmit(event) {
  event.preventDefault();
  if (state.solved.drink) return;

  const formData = new FormData(event.target);
  const selected = formData.getAll("ingredient");
  const required = ["espresso", "leche", "caramelo"];
  const optional = ["hielo", "crema"];

  const hasAllRequired = required.every((item) => selected.includes(item));
  const hasOnlyAllowed = selected.every((item) =>
    required.includes(item) || optional.includes(item)
  );

  if (hasAllRequired && hasOnlyAllowed) {
    state.solved.drink = true;
    drinkMessage.textContent = `¡Barista estrella! Tercer número: ${state.digits.drink}`;
    updateProgress("drink");
    event.target.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.disabled = true;
    });
    setTimeout(() => {
      revealSection("final");
    }, 400);
  } else {
    drinkMessage.textContent = "Mmm... esa mezcla no sabe a Caramel Macchiato. Intenta de nuevo.";
  }
}

function setupDrinkPuzzle() {
  const form = document.getElementById("drinkForm");
  form.addEventListener("submit", handleDrinkSubmit);
}

function handleFinalSubmit(event) {
  event.preventDefault();
  if (state.solved.final) return;

  const value = finalCodeInput.value.replace(/\D/g, "");
  const expected = `${state.digits.kitty}${state.digits.travel}${state.digits.drink}`;

  if (value === expected) {
    state.solved.final = true;
    finalMessage.textContent = "¡Código correcto!";
    updateProgress("final");
    revealSection("celebration");
    finalCodeInput.disabled = true;
    event.target.querySelector("button").disabled = true;
    launchConfetti();
    if (navigator.vibrate) {
      navigator.vibrate([120, 60, 120]);
    }
  } else {
    finalMessage.textContent = "El código no abre el candado. Revisa los números mágicos.";
  }
}

function setupFinalPuzzle() {
  const form = document.getElementById("finalForm");
  form.addEventListener("submit", handleFinalSubmit);
}

function launchConfetti() {
  const colors = ["#5a1033", "#b31c52", "#2a8c82", "#f5c16c", "#3e2d68"];
  const pieces = 80;

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.setProperty("--x-move", `${Math.random() * 200 - 100}px`);
    piece.style.setProperty("--rotation", `${Math.random() * 720 - 360}deg`);
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((error) => {
        console.warn("SW registration failed", error);
      });
    });
  }
}

function init() {
  hideSection("kitty");
  hideSection("travel");
  hideSection("drink");
  hideSection("final");
  hideSection("celebration");

  document.getElementById("startGame").addEventListener("click", () => {
    hideSection("intro");
    revealSection("kitty");
  });

  setupKittyPuzzle();
  setupTravelPuzzle();
  setupDrinkPuzzle();
  setupFinalPuzzle();
  registerServiceWorker();

  kittyMessage.textContent = "Presiona los stickers para formar la palabra secreta.";
  progressMap.kitty?.classList.add("active");
}

document.addEventListener("DOMContentLoaded", init);
