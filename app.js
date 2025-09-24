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
  openModal: null,
  toastTimeout: null,
  lastTrigger: null,
};

const stepsOrder = ["kitty", "travel", "drink", "final"];

const elements = {
  startScreen: document.getElementById("startScreen"),
  game: document.getElementById("game"),
  toast: document.getElementById("toast"),
  kittyDisplay: document.getElementById("kittyDisplay"),
  kittyMessage: document.getElementById("kittyMessage"),
  kittyReset: document.getElementById("kittyReset"),
  travelMessage: document.getElementById("travelMessage"),
  drinkMessage: document.getElementById("drinkMessage"),
  finalMessage: document.getElementById("finalMessage"),
  finalCodeInput: document.getElementById("finalCode"),
};

const progressMap = stepsOrder.reduce((acc, step) => {
  const element = document.querySelector(`[data-step="${step}"]`);
  if (element) acc[step] = element;
  return acc;
}, {});

const modals = stepsOrder
  .concat("celebration")
  .reduce((acc, key) => {
    const id = key === "celebration" ? "modal-celebration" : `modal-${key}`;
    const modal = document.getElementById(id);
    if (modal) acc[key] = modal;
    return acc;
  }, {});

function requirementMessage(missingSteps) {
  if (missingSteps.includes("kitty")) {
    return "Empieza con el tocador del lazo antes de explorar más.";
  }
  if (missingSteps.includes("travel")) {
    return "Cuando completes la ventana, podrás preparar la bebida.";
  }
  if (missingSteps.includes("drink")) {
    return "Prepara el Caramel Macchiato antes de intentar abrir el cofre.";
  }
  return "Aún hay retos pendientes antes de abrir esto.";
}

function showToast(message) {
  const toast = elements.toast;
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  if (state.toastTimeout) clearTimeout(state.toastTimeout);
  state.toastTimeout = window.setTimeout(() => {
    toast.classList.remove("show");
    state.toastTimeout = window.setTimeout(() => {
      toast.classList.add("hidden");
    }, 300);
  }, 2800);
}

function openModal(key) {
  const modal = modals[key];
  if (!modal) return;
  closeModal(state.openModal);
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  const focusable = modal.querySelector(
    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );
  if (focusable) focusable.focus({ preventScroll: true });
  state.openModal = key;
}

function closeModal(key = state.openModal) {
  if (!key) return;
  const modal = modals[key];
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  if (state.openModal === key) {
    state.openModal = null;
  }
  if (state.lastTrigger && typeof state.lastTrigger.focus === "function") {
    state.lastTrigger.focus({ preventScroll: true });
  }
}

function updateProgress(completedStep) {
  const current = progressMap[completedStep];
  if (current) {
    current.classList.add("completed");
    current.classList.remove("active");
  }
  Object.entries(progressMap).forEach(([key, element]) => {
    if (key !== completedStep) {
      element.classList.remove("active");
    }
  });
  const currentIndex = stepsOrder.indexOf(completedStep);
  const nextStep = stepsOrder[currentIndex + 1];
  if (nextStep && progressMap[nextStep]) {
    progressMap[nextStep].classList.add("active");
  }
}

function resetKittyWord() {
  state.kittyWord = "";
  elements.kittyDisplay.textContent = "";
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
  elements.kittyDisplay.textContent = state.kittyWord;

  if (state.kittyWord.length === 5) {
    const attempt = state.kittyWord.toLowerCase();
    if (attempt === "kitty") {
      state.solved.kitty = true;
      elements.kittyMessage.textContent = `¡Perfecto! Primer número: ${state.digits.kitty}`;
      updateProgress("kitty");
      showToast("Número 1 conseguido: 2");
      setTimeout(() => {
        closeModal("kitty");
      }, 600);
    } else {
      elements.kittyMessage.textContent = "Casi... prueba otra combinación con estilo.";
      setTimeout(() => {
        resetKittyWord();
      }, 650);
    }
  } else {
    elements.kittyMessage.textContent = "Sigue tocando los stickers para completar la palabra.";
  }
}

function setupKittyPuzzle() {
  document.querySelectorAll(".kitty-sticker").forEach((btn) => {
    btn.addEventListener("click", handleKittyStickerClick);
  });
  elements.kittyReset.addEventListener("click", () => {
    resetKittyWord();
    elements.kittyMessage.textContent = "¡Reiniciado! Intenta conseguir el lazo correcto.";
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
    elements.travelMessage.textContent = `¡Lo lograste! Segundo número: ${state.digits.travel}`;
    updateProgress("travel");
    showToast("Ventana resuelta: 9");
    document.querySelectorAll(".destination-card").forEach((card) => {
      card.disabled = true;
    });
    setTimeout(() => {
      closeModal("travel");
    }, 600);
  } else {
    button.classList.add("incorrect");
    elements.travelMessage.textContent = "No exactamente... piensa en el universo alegre de Sanrio.";
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
  const hasOnlyAllowed = selected.every((item) => required.includes(item) || optional.includes(item));

  if (hasAllRequired && hasOnlyAllowed) {
    state.solved.drink = true;
    elements.drinkMessage.textContent = `¡Barista estrella! Tercer número: ${state.digits.drink}`;
    updateProgress("drink");
    showToast("Receta lista: 0");
    event.target.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.disabled = true;
    });
    setTimeout(() => {
      closeModal("drink");
    }, 600);
  } else {
    elements.drinkMessage.textContent = "Mmm... esa mezcla no sabe a Caramel Macchiato. Intenta de nuevo.";
  }
}

function setupDrinkPuzzle() {
  const form = document.getElementById("drinkForm");
  form.addEventListener("submit", handleDrinkSubmit);
}

function handleFinalSubmit(event) {
  event.preventDefault();
  if (state.solved.final) return;

  const value = elements.finalCodeInput.value.replace(/\D/g, "");
  const expected = `${state.digits.kitty}${state.digits.travel}${state.digits.drink}`;

  if (value === expected) {
    state.solved.final = true;
    elements.finalMessage.textContent = "¡Código correcto!";
    updateProgress("final");
    showToast("Cofre abierto. ¡Hora de la sorpresa!");
    elements.finalCodeInput.disabled = true;
    event.target.querySelector("button").disabled = true;
    closeModal("final");
    openModal("celebration");
    launchConfetti();
    if (navigator.vibrate) {
      navigator.vibrate([140, 60, 140]);
    }
  } else {
    elements.finalMessage.textContent = "El código no abre el candado. Revisa los números mágicos.";
  }
}

function setupFinalPuzzle() {
  const form = document.getElementById("finalForm");
  form.addEventListener("submit", handleFinalSubmit);
}

function launchConfetti() {
  const colors = ["#3b0f28", "#d3567c", "#2a8c82", "#f5c16c", "#3e2d68"];
  const pieces = 90;

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.setProperty("--x-move", `${Math.random() * 200 - 100}px`);
    piece.style.setProperty("--rotation", `${Math.random() * 720 - 360}deg`);
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
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

function handleRoomObjectClick(event) {
  const button = event.currentTarget;
  const target = button.dataset.target;
  const requires = button.dataset.requires;
  if (requires) {
    const needed = requires.split(",").map((item) => item.trim());
    const missing = needed.filter((key) => !state.solved[key]);
    if (missing.length) {
      showToast(requirementMessage(missing));
      return;
    }
  }
  state.lastTrigger = button;
  const key = target.replace("modal-", "");
  openModal(key);
}

function setupRoomObjects() {
  document.querySelectorAll(".room-object").forEach((button) => {
    button.addEventListener("click", handleRoomObjectClick);
  });
}

function setupModalClose() {
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal();
    });
  });

  document.querySelectorAll(".modal__overlay").forEach((overlay) => {
    overlay.addEventListener("click", () => closeModal());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.openModal) {
      closeModal();
    }
  });
}

function startGame() {
  elements.startScreen.classList.add("hidden");
  elements.startScreen.setAttribute("aria-hidden", "true");
  elements.game.classList.remove("hidden");
  elements.game.setAttribute("aria-hidden", "false");
  state.lastTrigger = null;
  showToast("Busca el lazo brillante para empezar.");
}

function init() {
  elements.game.setAttribute("aria-hidden", "true");
  document.getElementById("startGame").addEventListener("click", startGame);

  setupRoomObjects();
  setupModalClose();
  setupKittyPuzzle();
  setupTravelPuzzle();
  setupDrinkPuzzle();
  setupFinalPuzzle();
  registerServiceWorker();

  elements.kittyMessage.textContent = "Pulsa los stickers para formar la palabra secreta.";
  progressMap.kitty?.classList.add("active");
}

document.addEventListener("DOMContentLoaded", init);
