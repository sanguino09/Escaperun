const CODE_VALUES = {
  diary: "7",
  chest: "4",
  window: "2",
};

const CODE_ORDER = ["diary", "chest", "window"];
const FINAL_CODE = CODE_ORDER.map((key) => CODE_VALUES[key]).join("");

const state = {
  started: false,
  found: {
    diary: false,
    chest: false,
    window: false,
  },
  sequence: [],
  toggles: {
    lights: true,
    blind: false,
    music: false,
  },
  victory: false,
  currentModal: null,
  previousFocus: null,
};

const elements = {
  introScreen: document.getElementById("introScreen"),
  enterRoom: document.getElementById("enterRoom"),
  game: document.getElementById("game"),
  hudNote: document.getElementById("hudNote"),
  doorStatus: document.getElementById("doorStatus"),
  doorFeedback: document.getElementById("doorFeedback"),
  doorCode: document.getElementById("doorCode"),
  doorForm: document.getElementById("doorForm"),
  doorButton: document.querySelector("#doorForm button[type='submit']"),
  sequenceProgress: document.getElementById("sequenceProgress"),
  chestFeedback: document.getElementById("chestFeedback"),
  sequenceReset: document.getElementById("sequenceReset"),
  diaryForm: document.getElementById("diaryForm"),
  diaryFeedback: document.getElementById("diaryFeedback"),
  windowFeedback: document.getElementById("windowFeedback"),
  toggleCheck: document.getElementById("toggleCheck"),
  doorFeedbackContainer: document.getElementById("doorFeedback"),
  replay: document.getElementById("replay"),
};

elements.numberSlots = CODE_ORDER.reduce((acc, key) => {
  const span = document.querySelector(`[data-number="${key}"]`);
  if (span) acc[key] = span;
  return acc;
}, {});

elements.codeSlots = Array.from(document.querySelectorAll("[data-slot]"));

elements.modals = {
  diary: document.getElementById("modal-diary"),
  chest: document.getElementById("modal-chest"),
  window: document.getElementById("modal-window"),
  door: document.getElementById("modal-door"),
  victory: document.getElementById("modal-victory"),
};

elements.sequenceButtons = Array.from(
  document.querySelectorAll(".sequence__token[data-symbol]")
);

elements.toggleButtons = Array.from(
  document.querySelectorAll(".toggle[data-toggle]")
);

function updateHudNote(text) {
  if (text) {
    elements.hudNote.textContent = text;
  }
}

function updateCodeDisplay() {
  CODE_ORDER.forEach((key, index) => {
    const slot = elements.codeSlots[index];
    if (!slot) return;
    slot.textContent = state.found[key] ? CODE_VALUES[key] : "_";
  });
}

function markClueSolved(key, noteText) {
  if (state.found[key]) return;
  state.found[key] = true;
  const listItem = document.querySelector(`[data-clue="${key}"]`);
  listItem?.classList.add("found");
  const numberSpan = elements.numberSlots[key];
  if (numberSpan) numberSpan.textContent = CODE_VALUES[key];
  updateCodeDisplay();
  if (noteText) {
    updateHudNote(noteText);
  }
  if (CODE_ORDER.every((clue) => state.found[clue])) {
    updateHudNote("Ya tienes los tres números. Ve a la puerta e introdúcelos.");
  }
  updateDoorStatus();
}

function startGame() {
  if (state.started) return;
  state.started = true;
  elements.introScreen.classList.add("hidden");
  elements.game.dataset.started = "true";
  elements.game.setAttribute("aria-hidden", "false");
  updateHudNote("Explora la habitación tocando los puntos iluminados.");
  setTimeout(() => {
    elements.game.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
}

function openModal(key) {
  const modal = elements.modals[key];
  if (!modal) return;
  if (state.currentModal === modal) return;
  closeModal();
  state.previousFocus = document.activeElement;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  state.currentModal = modal;
  const focusable = modal.querySelector(
    "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
  );
  focusable?.focus({ preventScroll: true });
  if (key === "door") {
    updateDoorStatus();
  }
}

function closeModal() {
  if (!state.currentModal) return;
  state.currentModal.classList.add("hidden");
  state.currentModal.setAttribute("aria-hidden", "true");
  state.currentModal = null;
  if (state.previousFocus instanceof HTMLElement) {
    state.previousFocus.focus({ preventScroll: true });
  }
  state.previousFocus = null;
}

function updateDoorStatus() {
  const allFound = CODE_ORDER.every((clue) => state.found[clue]);
  if (state.victory) {
    elements.doorStatus.textContent = "La puerta ya está abierta. Puedes volver a la fiesta.";
    elements.doorCode.disabled = true;
    elements.doorButton.disabled = true;
    return;
  }
  if (!allFound) {
    elements.doorStatus.textContent =
      "Todavía faltan números. Explora la habitación hasta encontrar los tres códigos.";
    elements.doorCode.value = "";
    elements.doorCode.disabled = true;
    elements.doorButton.disabled = true;
  } else {
    elements.doorStatus.textContent =
      "Introduce los tres números en el orden en el que los descubriste.";
    elements.doorCode.disabled = false;
    elements.doorButton.disabled = false;
  }
  elements.doorFeedback.textContent = "";
}

function resetSequence(reactivate = true) {
  state.sequence = [];
  elements.sequenceProgress.textContent = "Orden actual: —";
  elements.sequenceButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (reactivate && !state.found.chest) {
      btn.disabled = false;
    }
  });
}

function formatSequence(sequence) {
  const labels = {
    cat: "Gato",
    plane: "Avión",
    coffee: "Café",
    camera: "Cámara",
  };
  return sequence.length ? sequence.map((key) => labels[key] ?? key).join(" · ") : "—";
}

function handleSequenceClick(event) {
  if (state.found.chest) return;
  const button = event.currentTarget;
  const symbol = button.dataset.symbol;
  state.sequence.push(symbol);
  button.classList.add("active");
  elements.sequenceProgress.textContent = `Orden actual: ${formatSequence(state.sequence)}`;
  if (state.sequence.length === 3) {
    elements.sequenceButtons.forEach((btn) => {
      btn.disabled = true;
    });
    const goal = ["cat", "plane", "coffee"];
    const success = goal.every((item, index) => state.sequence[index] === item);
    if (success) {
      elements.chestFeedback.textContent = `¡Perfecto! El número revelado es ${CODE_VALUES.chest}.`;
      markClueSolved(
        "chest",
        "El baúl mostró el número secreto que esperabas para tu próximo viaje."
      );
    } else {
      elements.chestFeedback.textContent = "La secuencia no coincide. El baúl se reinicia.";
      setTimeout(() => {
        elements.chestFeedback.textContent = "";
        resetSequence();
      }, 900);
    }
  }
}

function handleSequenceReset() {
  if (state.found.chest) return;
  elements.chestFeedback.textContent = "";
  resetSequence();
}

function handleDiarySubmit(event) {
  event.preventDefault();
  if (state.found.diary) return;
  const formData = new FormData(elements.diaryForm);
  const answer = formData.get("diaryAnswer");
  if (!answer) {
    elements.diaryFeedback.textContent = "El cuaderno espera una respuesta.";
    return;
  }
  if (answer === "tokio") {
    elements.diaryFeedback.textContent = `Tokio abre el cuaderno. Apunta el número ${CODE_VALUES.diary}.`;
    markClueSolved(
      "diary",
      "El cuaderno confirma que Tokio guarda el primer número de la cerradura."
    );
    elements.diaryForm.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });
    elements.diaryForm.querySelector("button[type='submit']").disabled = true;
  } else {
    elements.diaryFeedback.textContent = "Ese no fue el primer destino. Busca otra pista en las páginas.";
  }
}

function setToggleState(button, isOn) {
  const span = button.querySelector("span");
  const key = button.dataset.toggle;
  button.setAttribute("aria-pressed", isOn ? "true" : "false");
  if (span) {
    const labels = {
      lights: isOn ? "Encendidas" : "Apagadas",
      blind: isOn ? "Entreabierta" : "Cerrada",
      music: isOn ? "Girando" : "Detenido",
    };
    span.textContent = labels[key];
  }
}

function handleToggleClick(event) {
  if (state.found.window) return;
  const button = event.currentTarget;
  const key = button.dataset.toggle;
  const nextValue = !state.toggles[key];
  state.toggles[key] = nextValue;
  setToggleState(button, nextValue);
}

function handleToggleCheck() {
  if (state.found.window) return;
  const desired = {
    lights: false,
    blind: true,
    music: true,
  };
  const matches = Object.entries(desired).every(([key, value]) => state.toggles[key] === value);
  if (matches) {
    elements.windowFeedback.textContent = `El reflejo revela el número ${CODE_VALUES.window}.`;
    markClueSolved(
      "window",
      "La ventana nocturna deja ver el último número con luces vibrantes."
    );
    elements.toggleButtons.forEach((button) => {
      button.disabled = true;
    });
    elements.toggleCheck.disabled = true;
  } else {
    elements.windowFeedback.textContent = "Algo no encaja aún. Ajusta el ambiente otra vez.";
  }
}

function handleDoorSubmit(event) {
  event.preventDefault();
  if (!CODE_ORDER.every((clue) => state.found[clue])) {
    elements.doorFeedback.textContent = "Necesitas los tres números antes de intentarlo.";
    return;
  }
  const code = elements.doorCode.value.trim();
  if (code === FINAL_CODE) {
    elements.doorFeedback.textContent = "La cerradura gira y escuchas la música del festejo.";
    state.victory = true;
    updateDoorStatus();
    setTimeout(() => {
      openModal("victory");
    }, 400);
  } else {
    elements.doorFeedback.textContent = "Ese código no abre la puerta. Prueba combinando los números encontrados.";
  }
}

function handleReplay() {
  closeModal();
  resetGame(true);
}

function resetToggles() {
  state.toggles = {
    lights: true,
    blind: false,
    music: false,
  };
  elements.toggleButtons.forEach((button) => {
    button.disabled = false;
    const key = button.dataset.toggle;
    setToggleState(button, state.toggles[key]);
  });
  elements.toggleCheck.disabled = false;
  elements.windowFeedback.textContent = "";
}

function resetDiary() {
  elements.diaryForm.reset();
  elements.diaryForm.querySelectorAll("input").forEach((input) => {
    input.disabled = false;
  });
  const submit = elements.diaryForm.querySelector("button[type='submit']");
  if (submit) submit.disabled = false;
  elements.diaryFeedback.textContent = "";
}

function resetGame(resetVictory = false) {
  state.found = {
    diary: false,
    chest: false,
    window: false,
  };
  state.sequence = [];
  if (resetVictory) {
    state.victory = false;
  }
  Object.values(elements.numberSlots).forEach((span) => {
    span.textContent = "_";
  });
  document.querySelectorAll(".clue-list li").forEach((item) => {
    item.classList.remove("found");
  });
  updateHudNote("Necesitas encontrar tres números antes de abrir la puerta.");
  updateCodeDisplay();
  resetSequence();
  resetToggles();
  resetDiary();
  elements.chestFeedback.textContent = "";
  elements.sequenceProgress.textContent = "Orden actual: —";
  elements.windowFeedback.textContent = "";
  elements.doorFeedback.textContent = "";
  elements.doorForm.reset();
  elements.doorCode.disabled = true;
  elements.doorButton.disabled = true;
  elements.doorStatus.textContent =
    "Todavía faltan números. Explora la habitación hasta encontrar los tres códigos.";
}

function bindHotspots() {
  const hotspots = document.querySelectorAll(".hotspot[data-target]");
  hotspots.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      openModal(target);
    });
  });
}

function bindModalClose() {
  document.querySelectorAll("[data-action='close']").forEach((element) => {
    element.addEventListener("click", () => {
      closeModal();
    });
  });
}

function bindKeyboardClose() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

function init() {
  bindHotspots();
  bindModalClose();
  bindKeyboardClose();
  resetGame();
  elements.enterRoom.addEventListener("click", startGame);
  elements.diaryForm.addEventListener("submit", handleDiarySubmit);
  elements.sequenceButtons.forEach((button) => {
    button.addEventListener("click", handleSequenceClick);
  });
  elements.sequenceReset.addEventListener("click", handleSequenceReset);
  elements.toggleButtons.forEach((button) => {
    setToggleState(button, state.toggles[button.dataset.toggle]);
    button.addEventListener("click", handleToggleClick);
  });
  elements.toggleCheck.addEventListener("click", handleToggleCheck);
  elements.doorForm.addEventListener("submit", handleDoorSubmit);
  elements.replay.addEventListener("click", handleReplay);
}

init();
