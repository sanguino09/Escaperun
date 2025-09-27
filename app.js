const CODE_VALUES = {
  diary: "7",
  chest: "4",
  window: "2",
  bookshelf: "9",
  archive: "5",
  laboratory: "8",
  observatory: "1",
  radio: "6",
  greenhouse: "3",
  musicbox: "0",
};

const CODE_ORDER = [
  "diary",
  "chest",
  "window",
  "bookshelf",
  "archive",
  "laboratory",
  "observatory",
  "radio",
  "greenhouse",
  "musicbox",
];

const FINAL_CODE = CODE_ORDER.map((key) => CODE_VALUES[key]).join("");

const ROOMS = [
  {
    key: "estudio",
    note:
      "El estudio vibra con mapas iluminados y olor a tinta fresca. El cuaderno de viaje late como un corazón que guarda la primera coordenada.",
  },
  {
    key: "vestidor",
    note:
      "El vestidor neón chisporrotea con maletas abiertas y pistas cosidas al forro. El baúl magnético promete revelar una secuencia secreta.",
  },
  {
    key: "mirador",
    note:
      "El mirador nocturno parpadea entre luces, persianas y música. Ajusta el ambiente correcto para despertar el reflejo oculto.",
  },
  {
    key: "biblioteca",
    note:
      "La biblioteca susurra historias y alumbra títulos prohibidos. Ordena las letras doradas para pronunciar la palabra clave.",
  },
  {
    key: "archivo",
    note:
      "El archivo blindado guarda expedientes con sellos cromáticos. Solo los timbres dorado y violeta abren el registro clandestino.",
  },
  {
    key: "laboratorio",
    note:
      "El laboratorio de luz tiembla al ritmo del termostato. Encuentra la temperatura exacta para domar la mezcla fluorescente.",
  },
  {
    key: "observatorio",
    note:
      "El observatorio proyecta constelaciones suspendidas. El cometa correcto enviará una llamada a través del domo.",
  },
  {
    key: "radio",
    note:
      "La cabina de radio zumba con interferencias. Ajusta el dial hasta que la frecuencia 98.7 FM cante su número oculto.",
  },
  {
    key: "greenhouse",
    note:
      "El invernadero violeta respira vapor aromático. Equilibra clima templado y humedad exacta para que las flores revelen el código.",
  },
  {
    key: "lounge",
    note:
      "El salón del festejo destella con luces cálidas. Despierta la caja musical para liberar la última cifra y abrir la puerta final.",
  },
];

const TRAVELS = {
  gallery: {
    unlockType: "immediate",
    requirements: [],
    to: "vestidor",
    lockedText: "El pasillo está en penumbra, aguardando a que reúnas valor para cruzarlo.",
    unlockedText:
      "El panel corredero se aparta y un resplandor fucsia invita a explorar el vestidor de neón.",
    note: "Te deslizas por el pasillo lateral y entras en el vestidor chispeante.",
  },
  terrace: {
    unlockType: "any",
    requirements: ["diary", "chest"],
    to: "mirador",
    lockedText: "El acceso al mirador permanece sellado hasta que descifres el cuaderno o el baúl.",
    unlockedText:
      "Las notas del cuaderno o la secuencia del baúl iluminan la escalera hacia el mirador panorámico.",
    note: "Asciendes al mirador nocturno, donde la ciudad titila bajo tus pies.",
  },
  library: {
    unlockType: "all",
    requirements: ["window"],
    to: "biblioteca",
    lockedText: "La biblioteca resiste. Ajusta la ventana nocturna para invocar la contraseña luminosa.",
    unlockedText:
      "El reflejo de la ventana revela la palabra secreta y la puerta corrediza se abre sin ruido.",
    note: "La biblioteca te envuelve con perfume a papel antiguo y destellos dorados.",
  },
  archives: {
    unlockType: "all",
    requirements: ["bookshelf"],
    to: "archivo",
    lockedText: "Aún falta recomponer la palabra oculta entre los libros iluminados.",
    unlockedText:
      "Las letras se alinean, un sello magnético chasquea y el archivo clasificado cede su cerradura.",
    note: "Cruzas hacia el archivo blindado, rodeado de expedientes codificados.",
  },
  labgate: {
    unlockType: "all",
    requirements: ["archive"],
    to: "laboratorio",
    lockedText: "Las puertas del laboratorio se alimentan de los sellos dorado y violeta correctos.",
    unlockedText:
      "Los sellos brillan al unísono y la compuerta del laboratorio se desliza entre destellos.",
    note: "El laboratorio vibra con neones expectantes y tubos centelleantes.",
  },
  observatoryGate: {
    unlockType: "all",
    requirements: ["laboratory"],
    to: "observatorio",
    lockedText: "El planetario sigue oscuro hasta que estabilices la mezcla luminosa.",
    unlockedText:
      "Los tubos neón emiten un zumbido triunfal y liberan la escalera en espiral hacia el domo.",
    note: "Subes al observatorio privado, rodeado de constelaciones flotantes.",
  },
  radioGate: {
    unlockType: "all",
    requirements: ["observatory"],
    to: "radio",
    lockedText: "La cabina de radio permanece cerrada sin la señal del cometa.",
    unlockedText:
      "El cometa proyectado envía una ráfaga eléctrica que abre el acceso a la cabina de radio.",
    note: "Desciendes entre cables incandescentes hacia la cabina llena de controles.",
  },
  greenhouseGate: {
    unlockType: "all",
    requirements: ["radio"],
    to: "greenhouse",
    lockedText: "El invernadero reclama una frecuencia estable para liberar sus compuertas.",
    unlockedText:
      "La transmisión secreta pulsa en verde y la puerta del invernadero se desliza cubierta de rocío.",
    note: "El aire húmedo del invernadero te rodea con fragancias nocturnas.",
  },
  loungeGate: {
    unlockType: "all",
    requirements: ["greenhouse"],
    to: "lounge",
    lockedText: "El salón sigue sellado hasta que equilibres el clima violeta del invernadero.",
    unlockedText:
      "Los sensores celebran el clima perfecto y la puerta del salón gira entre chispas doradas.",
    note: "Accedes al salón resplandeciente donde la música espera tu final heroico.",
  },
};

const MAP_DEFAULT_STATUS = {
  current: "Aquí mismo",
  available: "Disponible",
  visited: "Visitada",
};

function createFoundMap() {
  return CODE_ORDER.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});
}

function getSolvedCount(foundMap) {
  return CODE_ORDER.reduce((total, clue) => (foundMap[clue] ? total + 1 : total), 0);
}

function evaluateTravelUnlocked(travel, foundMap) {
  if (!travel) return false;
  const requirements = travel.requirements ?? [];
  const solvedCount = getSolvedCount(foundMap);
  switch (travel.unlockType) {
    case "immediate":
      return true;
    case "any":
      return requirements.some((clue) => foundMap[clue]);
    case "count":
      return solvedCount >= (travel.minimumSolved ?? requirements.length);
    case "all":
    default:
      if (!requirements.length) {
        return false;
      }
      return requirements.every((clue) => foundMap[clue]);
  }
}

function createTravelMap(foundMap = null) {
  const resolvedFound = foundMap ?? createFoundMap();
  return Object.entries(TRAVELS).reduce((acc, [key, travel]) => {
    acc[key] = evaluateTravelUnlocked(travel, resolvedFound);
    return acc;
  }, {});
}

const state = {
  started: false,
  found: createFoundMap(),
  chestSequence: [],
  musicSequence: [],
  toggles: {
    lights: true,
    blind: false,
    music: false,
  },
  victory: false,
  currentModal: null,
  previousFocus: null,
  room: ROOMS[0].key,
  visitedRooms: new Set([ROOMS[0].key]),
  travelUnlocked: createTravelMap(),
};

const elements = {
  introScreen: document.getElementById("introScreen"),
  enterRoom: document.getElementById("enterRoom"),
  game: document.getElementById("game"),
  room: document.getElementById("roomStage"),
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
  replay: document.getElementById("replay"),
  bookshelfForm: document.getElementById("bookshelfForm"),
  bookshelfFeedback: document.getElementById("bookshelfFeedback"),
  archiveForm: document.getElementById("archiveForm"),
  archiveFeedback: document.getElementById("archiveFeedback"),
  labTemperature: document.getElementById("labTemperature"),
  labTemperatureValue: document.getElementById("labTemperatureValue"),
  labCheck: document.getElementById("labCheck"),
  laboratoryFeedback: document.getElementById("laboratoryFeedback"),
  observatoryForm: document.getElementById("observatoryForm"),
  observatoryFeedback: document.getElementById("observatoryFeedback"),
  radioDial: document.getElementById("radioDial"),
  radioDialValue: document.getElementById("radioDialValue"),
  radioCheck: document.getElementById("radioCheck"),
  radioFeedback: document.getElementById("radioFeedback"),
  greenhouseTemp: document.getElementById("greenhouseTemp"),
  greenhouseTempValue: document.getElementById("greenhouseTempValue"),
  greenhouseHumidity: document.getElementById("greenhouseHumidity"),
  greenhouseHumidityValue: document.getElementById("greenhouseHumidityValue"),
  greenhouseCheck: document.getElementById("greenhouseCheck"),
  greenhouseFeedback: document.getElementById("greenhouseFeedback"),
  musicSequenceProgress: document.getElementById("musicSequenceProgress"),
  musicSequenceReset: document.getElementById("musicSequenceReset"),
  musicboxFeedback: document.getElementById("musicboxFeedback"),
  travelStatus: {
    gallery: document.getElementById("galleryStatus"),
    terrace: document.getElementById("terraceStatus"),
    library: document.getElementById("libraryStatus"),
    archives: document.getElementById("archivesStatus"),
    labgate: document.getElementById("labgateStatus"),
    observatoryGate: document.getElementById("observatoryGateStatus"),
    radioGate: document.getElementById("radioGateStatus"),
    greenhouseGate: document.getElementById("greenhouseGateStatus"),
    loungeGate: document.getElementById("loungeGateStatus"),
  },
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
  bookshelf: document.getElementById("modal-bookshelf"),
  archive: document.getElementById("modal-archive"),
  laboratory: document.getElementById("modal-laboratory"),
  observatory: document.getElementById("modal-observatory"),
  radio: document.getElementById("modal-radio"),
  greenhouse: document.getElementById("modal-greenhouse"),
  musicbox: document.getElementById("modal-musicbox"),
  door: document.getElementById("modal-door"),
  victory: document.getElementById("modal-victory"),
  gallery: document.getElementById("modal-gallery"),
  terrace: document.getElementById("modal-terrace"),
  library: document.getElementById("modal-library"),
  archives: document.getElementById("modal-archives"),
  labgate: document.getElementById("modal-labgate"),
  observatoryGate: document.getElementById("modal-observatoryGate"),
  radioGate: document.getElementById("modal-radioGate"),
  greenhouseGate: document.getElementById("modal-greenhouseGate"),
  loungeGate: document.getElementById("modal-loungeGate"),
  map: document.getElementById("modal-map"),
  "explore-estudio": document.getElementById("modal-explore-estudio"),
  "explore-vestidor": document.getElementById("modal-explore-vestidor"),
  "explore-mirador": document.getElementById("modal-explore-mirador"),
  "explore-biblioteca": document.getElementById("modal-explore-biblioteca"),
  "explore-archivo": document.getElementById("modal-explore-archivo"),
  "explore-laboratorio": document.getElementById("modal-explore-laboratorio"),
  "explore-observatorio": document.getElementById("modal-explore-observatorio"),
  "explore-radio": document.getElementById("modal-explore-radio"),
  "explore-greenhouse": document.getElementById("modal-explore-greenhouse"),
  "explore-lounge": document.getElementById("modal-explore-lounge"),
};

elements.sequenceButtons = Array.from(
  document.querySelectorAll(".sequence__token[data-symbol]")
);

elements.toggleButtons = Array.from(
  document.querySelectorAll(".toggle[data-toggle]")
);

elements.travelButtons = Object.entries(TRAVELS).reduce((acc, [key]) => {
  acc[key] = document.querySelector(`[data-travel="${key}"]`);
  return acc;
}, {});

elements.hotspots = Array.from(document.querySelectorAll(".hotspot[data-target]"));

elements.mapButtons = {};
document.querySelectorAll("[data-room-target]").forEach((button) => {
  const room = button.dataset.roomTarget;
  if (room) {
    elements.mapButtons[room] = button;
  }
});

elements.mapStatuses = {};
document.querySelectorAll("[data-room-status]").forEach((status) => {
  const room = status.dataset.roomStatus;
  if (room) {
    elements.mapStatuses[room] = status;
  }
});

elements.musicButtons = Array.from(
  document.querySelectorAll(".sequence__token[data-note]")
);

elements.ambientButtons = Array.from(
  document.querySelectorAll(".ambient-option")
);

function findRoom(key) {
  return ROOMS.find((room) => room.key === key);
}

function updateHotspotsForRoom() {
  elements.hotspots.forEach((hotspot) => {
    const { room: rooms } = hotspot.dataset;
    const allowedRooms = rooms ? rooms.split(/\s+/) : [];
    const isVisible = !rooms || allowedRooms.includes(state.room);
    if (isVisible) {
      hotspot.removeAttribute("hidden");
    } else {
      hotspot.setAttribute("hidden", "");
    }
  });
}

function setRoom(key, { updateNote = false, note } = {}) {
  const roomInfo = findRoom(key);
  if (!roomInfo) return;
  state.room = roomInfo.key;
  if (!state.visitedRooms) {
    state.visitedRooms = new Set();
  }
  state.visitedRooms.add(state.room);
  if (elements.room) {
    elements.room.setAttribute("data-room", state.room);
  }
  updateHotspotsForRoom();
  const nextNote = note ?? roomInfo.note;
  if (updateNote && nextNote) {
    updateHudNote(nextNote);
  }
  updateMapDestinations();
}

function setTravelState(key, unlocked) {
  const travel = TRAVELS[key];
  if (!travel) return;
  const isUnlocked =
    typeof unlocked === "boolean" ? unlocked : evaluateTravelUnlocked(travel, state.found);
  state.travelUnlocked[key] = isUnlocked;
  const button = elements.travelButtons[key];
  const status = elements.travelStatus[key];
  if (button) {
    button.disabled = !isUnlocked;
  }
  if (status) {
    status.textContent = isUnlocked ? travel.unlockedText : travel.lockedText;
    status.classList.toggle("modal__status--active", isUnlocked);
  }
  updateMapDestinations();
}

function handleTravel(event) {
  const button = event.currentTarget;
  const key = button?.dataset.travel;
  if (!key || !TRAVELS[key]) {
    return;
  }
  if (!state.travelUnlocked[key]) {
    setTravelState(key, false);
    return;
  }
  const travel = TRAVELS[key];
  setRoom(travel.to, { updateNote: true, note: travel.note });
  closeModal();
}

function updateHudNote(text) {
  if (text) {
    elements.hudNote.textContent = text;
  }
}

function updateMapDestinations() {
  if (!elements.mapButtons) return;
  Object.entries(elements.mapButtons).forEach(([room, button]) => {
    if (!button) return;
    const requirement = button.dataset.requirement || "";
    const unlocked = requirement ? !!state.travelUnlocked[requirement] : true;
    const isCurrent = state.room === room;
    const visited = state.visitedRooms?.has(room);
    button.disabled = !unlocked;
    button.setAttribute("aria-disabled", unlocked ? "false" : "true");
    button.classList.toggle("map-list__button--locked", !unlocked);
    button.classList.toggle("map-list__button--current", isCurrent);
    const status = elements.mapStatuses?.[room];
    if (!status) return;
    const lockedText = status.dataset.locked || "Ruta bloqueada";
    const statusText = !unlocked
      ? lockedText
      : isCurrent
      ? MAP_DEFAULT_STATUS.current
      : visited
      ? MAP_DEFAULT_STATUS.visited
      : MAP_DEFAULT_STATUS.available;
    status.textContent = statusText;
    status.classList.toggle("map-list__status--locked", !unlocked);
    status.classList.toggle("map-list__status--current", unlocked && isCurrent);
    status.classList.toggle(
      "map-list__status--visited",
      unlocked && visited && !isCurrent
    );
  });
}

function handleMapTravel(event) {
  const button = event.currentTarget;
  const room = button?.dataset.roomTarget;
  if (!room) return;
  const requirement = button.dataset.requirement || "";
  if (requirement && !state.travelUnlocked[requirement]) {
    updateMapDestinations();
    return;
  }
  const note = button.dataset.note;
  setRoom(room, { updateNote: true, note });
  closeModal();
}

function handleAmbientOption(event) {
  const button = event.currentTarget;
  const group = button.closest("[data-ambient-group]");
  if (!group) return;
  group.querySelectorAll(".ambient-option").forEach((option) => {
    option.classList.remove("ambient-option--active");
  });
  button.classList.add("ambient-option--active");
  const output = group.querySelector("[data-ambient-output]");
  if (output) {
    const description = button.dataset.description || "";
    output.textContent = description;
  }
  const note = button.dataset.note;
  if (note) {
    updateHudNote(note);
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
  Object.keys(TRAVELS).forEach((travelKey) => {
    setTravelState(travelKey);
  });
  updateMapDestinations();
  if (CODE_ORDER.every((clue) => state.found[clue])) {
    updateHudNote("Tienes las diez cifras. Vuelve al salón y abre la puerta final.");
  }
  updateDoorStatus();
}

function startGame() {
  if (state.started) return;
  state.started = true;
  elements.introScreen.classList.add("hidden");
  elements.game.dataset.started = "true";
  elements.game.setAttribute("aria-hidden", "false");
  setRoom(state.room, { updateNote: true });
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
  modal.querySelectorAll("[data-ambient-group]").forEach((group) => {
    group.querySelectorAll(".ambient-option").forEach((button) => {
      button.classList.remove("ambient-option--active");
    });
    const output = group.querySelector("[data-ambient-output]");
    if (output) {
      const defaultText = output.dataset.default || "Selecciona un punto para inspeccionarlo.";
      output.textContent = defaultText;
    }
  });
  if (key === "map") {
    updateMapDestinations();
  }
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
      "Todavía faltan números. Explora todas las habitaciones para encontrar las diez cifras.";
    elements.doorCode.value = "";
    elements.doorCode.disabled = true;
    elements.doorButton.disabled = true;
  } else {
    elements.doorStatus.textContent =
      "Introduce los diez números en el orden en el que los descubriste.";
    elements.doorCode.disabled = false;
    elements.doorButton.disabled = false;
  }
  elements.doorFeedback.textContent = "";
}

function resetChestSequence(reactivate = true) {
  state.chestSequence = [];
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
  state.chestSequence.push(symbol);
  button.classList.add("active");
  elements.sequenceProgress.textContent = `Orden actual: ${formatSequence(state.chestSequence)}`;
  if (state.chestSequence.length === 3) {
    elements.sequenceButtons.forEach((btn) => {
      btn.disabled = true;
    });
    const goal = ["cat", "plane", "coffee"];
    const success = goal.every((item, index) => state.chestSequence[index] === item);
    if (success) {
      elements.chestFeedback.textContent = `¡Perfecto! El número revelado es ${CODE_VALUES.chest}.`;
      markClueSolved(
        "chest",
        "El baúl mostró el número secreto y encendió la escalera al mirador."
      );
    } else {
      elements.chestFeedback.textContent = "La secuencia no coincide. El baúl se reinicia.";
      setTimeout(() => {
        elements.chestFeedback.textContent = "";
        resetChestSequence();
      }, 900);
    }
  }
}

function handleSequenceReset() {
  if (state.found.chest) return;
  elements.chestFeedback.textContent = "";
  resetChestSequence();
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
      "El cuaderno confirma que Tokio guarda la primera cifra. El pasillo lateral se desliza y revela el vestidor luminoso."
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
      "La ventana nocturna deja ver la pista luminosa. La puerta a la biblioteca responde a la señal."
    );
    elements.toggleButtons.forEach((button) => {
      button.disabled = true;
    });
    elements.toggleCheck.disabled = true;
  } else {
    elements.windowFeedback.textContent = "Algo no encaja aún. Ajusta el ambiente otra vez.";
  }
}

function handleBookshelfSubmit(event) {
  event.preventDefault();
  if (state.found.bookshelf) return;
  const answer = elements.bookshelfForm
    .querySelector("#bookshelfAnswer")
    .value.trim()
    .toLowerCase();
  if (!answer) {
    elements.bookshelfFeedback.textContent = "Escribe la palabra que forman los libros.";
    return;
  }
  const validAnswers = ["love", "amor"];
  if (validAnswers.includes(answer)) {
    elements.bookshelfFeedback.textContent = `Las letras se iluminan y muestran el número ${CODE_VALUES.bookshelf}.`;
    markClueSolved(
      "bookshelf",
      "Las historias se alinean y revelan el acceso al archivo clasificado."
    );
    elements.bookshelfForm.querySelector("input").disabled = true;
    elements.bookshelfForm.querySelector("button[type='submit']").disabled = true;
  } else {
    elements.bookshelfFeedback.textContent = "Esa palabra no activa los libros iluminados.";
  }
}

function handleArchiveSubmit(event) {
  event.preventDefault();
  if (state.found.archive) return;
  const formData = new FormData(elements.archiveForm);
  const folders = formData.getAll("folders").sort();
  const goal = ["gold", "violet"];
  const success = folders.length === goal.length && goal.every((value, index) => folders[index] === value);
  if (success) {
    elements.archiveFeedback.textContent = `Los sellos correctos revelan el número ${CODE_VALUES.archive}.`;
    markClueSolved(
      "archive",
      "Los expedientes dorado y violeta liberan la puerta al laboratorio."
    );
    elements.archiveForm.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });
    elements.archiveForm.querySelector("button[type='submit']").disabled = true;
  } else {
    elements.archiveFeedback.textContent = "Las carpetas seleccionadas no activan la cerradura.";
  }
}

function updateLabValue() {
  if (elements.labTemperatureValue && elements.labTemperature) {
    elements.labTemperatureValue.textContent = elements.labTemperature.value;
  }
}

function handleLabCheck() {
  if (state.found.laboratory) return;
  const value = Number(elements.labTemperature.value);
  const success = value >= 67 && value <= 69;
  if (success) {
    elements.laboratoryFeedback.textContent = `La mezcla se estabiliza en ${value}°. Apunta el número ${CODE_VALUES.laboratory}.`;
    markClueSolved(
      "laboratory",
      "La luz perfecta abre la escalera al planetario."
    );
    elements.labTemperature.disabled = true;
    elements.labCheck.disabled = true;
  } else {
    elements.laboratoryFeedback.textContent = "La mezcla vibra demasiado. Ajusta la temperatura.";
  }
}

function handleObservatorySubmit(event) {
  event.preventDefault();
  if (state.found.observatory) return;
  const formData = new FormData(elements.observatoryForm);
  const answer = formData.get("constellation");
  if (!answer) {
    elements.observatoryFeedback.textContent = "Selecciona una constelación.";
    return;
  }
  if (answer === "comet") {
    elements.observatoryFeedback.textContent = `El cometa ilumina el domo y revela el número ${CODE_VALUES.observatory}.`;
    markClueSolved(
      "observatory",
      "La señal del cometa baja la escalera hacia la cabina de radio."
    );
    elements.observatoryForm.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });
    elements.observatoryForm.querySelector("button[type='submit']").disabled = true;
  } else {
    elements.observatoryFeedback.textContent = "Esa constelación no coincide con la pista del cometa.";
  }
}

function updateRadioValue() {
  if (elements.radioDialValue && elements.radioDial) {
    elements.radioDialValue.textContent = Number(elements.radioDial.value).toFixed(1);
  }
}

function handleRadioCheck() {
  if (state.found.radio) return;
  const value = Number(elements.radioDial.value);
  const success = Math.abs(value - 98.7) <= 0.15;
  if (success) {
    elements.radioFeedback.textContent = `La señal se fija en ${value.toFixed(1)} FM y muestra el número ${CODE_VALUES.radio}.`;
    markClueSolved(
      "radio",
      "La frecuencia correcta envía la señal que abre el invernadero."
    );
    elements.radioDial.disabled = true;
    elements.radioCheck.disabled = true;
  } else {
    elements.radioFeedback.textContent = "La transmisión se pierde. Ajusta de nuevo el dial.";
  }
}

function updateGreenhouseValues() {
  if (elements.greenhouseTempValue && elements.greenhouseTemp) {
    elements.greenhouseTempValue.textContent = elements.greenhouseTemp.value;
  }
  if (elements.greenhouseHumidityValue && elements.greenhouseHumidity) {
    elements.greenhouseHumidityValue.textContent = elements.greenhouseHumidity.value;
  }
}

function handleGreenhouseCheck() {
  if (state.found.greenhouse) return;
  const temp = Number(elements.greenhouseTemp.value);
  const humidity = Number(elements.greenhouseHumidity.value);
  const tempOk = temp >= 22 && temp <= 24;
  const humidityOk = humidity >= 69 && humidity <= 71;
  if (tempOk && humidityOk) {
    elements.greenhouseFeedback.textContent = `Los sensores celebran el clima perfecto. Anota el número ${CODE_VALUES.greenhouse}.`;
    markClueSolved(
      "greenhouse",
      "El ambiente equilibrado revela la entrada al salón del festejo."
    );
    elements.greenhouseTemp.disabled = true;
    elements.greenhouseHumidity.disabled = true;
    elements.greenhouseCheck.disabled = true;
  } else {
    elements.greenhouseFeedback.textContent = "Los reguladores parpadean en rojo. Ajusta temperatura y humedad.";
  }
}

function resetMusicSequence(reactivate = true) {
  state.musicSequence = [];
  if (elements.musicSequenceProgress) {
    elements.musicSequenceProgress.textContent = "Notas activas: —";
  }
  elements.musicButtons.forEach((button) => {
    button.classList.remove("active");
    if (reactivate && !state.found.musicbox) {
      button.disabled = false;
    }
  });
}

function formatMusicSequence(sequence) {
  if (!sequence.length) return "—";
  return sequence.map((note) => note.toUpperCase()).join(" · ");
}

function handleMusicNote(event) {
  if (state.found.musicbox) return;
  const button = event.currentTarget;
  const note = button.dataset.note;
  state.musicSequence.push(note);
  button.classList.add("active");
  if (elements.musicSequenceProgress) {
    elements.musicSequenceProgress.textContent = `Notas activas: ${formatMusicSequence(state.musicSequence)}`;
  }
  if (state.musicSequence.length === 4) {
    elements.musicButtons.forEach((btn) => {
      btn.disabled = true;
    });
    const goal = ["do", "mi", "sol", "la"];
    const success = goal.every((item, index) => state.musicSequence[index] === item);
    if (success) {
      elements.musicboxFeedback.textContent = `La melodía resuena y muestra el número final ${CODE_VALUES.musicbox}.`;
      markClueSolved(
        "musicbox",
        "La caja musical completa el código. La puerta blindada espera tu combinación de diez cifras."
      );
    } else {
      elements.musicboxFeedback.textContent = "Las notas desafinan. Intenta otra vez.";
      setTimeout(() => {
        elements.musicboxFeedback.textContent = "";
        resetMusicSequence();
      }, 900);
    }
  }
}

function handleMusicReset() {
  if (state.found.musicbox) return;
  elements.musicboxFeedback.textContent = "";
  resetMusicSequence();
}

function handleDoorSubmit(event) {
  event.preventDefault();
  if (!CODE_ORDER.every((clue) => state.found[clue])) {
    elements.doorFeedback.textContent = "Necesitas las diez cifras antes de intentarlo.";
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
    elements.doorFeedback.textContent = "Ese código no abre la puerta. Repasa los números encontrados.";
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

function resetBookshelf() {
  elements.bookshelfForm.reset();
  const input = elements.bookshelfForm.querySelector("input");
  if (input) input.disabled = false;
  const submit = elements.bookshelfForm.querySelector("button[type='submit']");
  if (submit) submit.disabled = false;
  elements.bookshelfFeedback.textContent = "";
}

function resetArchive() {
  elements.archiveForm.reset();
  elements.archiveForm.querySelectorAll("input").forEach((input) => {
    input.disabled = false;
  });
  const submit = elements.archiveForm.querySelector("button[type='submit']");
  if (submit) submit.disabled = false;
  elements.archiveFeedback.textContent = "";
}

function resetLab() {
  if (elements.labTemperature) {
    elements.labTemperature.disabled = false;
    elements.labTemperature.value = "50";
  }
  if (elements.labCheck) {
    elements.labCheck.disabled = false;
  }
  updateLabValue();
  elements.laboratoryFeedback.textContent = "";
}

function resetObservatory() {
  elements.observatoryForm.reset();
  elements.observatoryForm.querySelectorAll("input").forEach((input) => {
    input.disabled = false;
  });
  const submit = elements.observatoryForm.querySelector("button[type='submit']");
  if (submit) submit.disabled = false;
  elements.observatoryFeedback.textContent = "";
}

function resetRadio() {
  if (elements.radioDial) {
    elements.radioDial.disabled = false;
    elements.radioDial.value = "95";
  }
  if (elements.radioCheck) {
    elements.radioCheck.disabled = false;
  }
  updateRadioValue();
  elements.radioFeedback.textContent = "";
}

function resetGreenhouse() {
  if (elements.greenhouseTemp) {
    elements.greenhouseTemp.disabled = false;
    elements.greenhouseTemp.value = "24";
  }
  if (elements.greenhouseHumidity) {
    elements.greenhouseHumidity.disabled = false;
    elements.greenhouseHumidity.value = "55";
  }
  if (elements.greenhouseCheck) {
    elements.greenhouseCheck.disabled = false;
  }
  updateGreenhouseValues();
  elements.greenhouseFeedback.textContent = "";
}

function resetMusicbox() {
  resetMusicSequence();
  elements.musicboxFeedback.textContent = "";
}

function resetGame(resetVictory = false) {
  state.found = createFoundMap();
  state.travelUnlocked = createTravelMap(state.found);
  state.visitedRooms = new Set();
  resetChestSequence();
  resetMusicSequence();
  if (resetVictory) {
    state.victory = false;
  }
  setRoom(ROOMS[0].key, { updateNote: false });
  Object.keys(TRAVELS).forEach((key) => {
    setTravelState(key, state.travelUnlocked[key]);
  });
  Object.values(elements.numberSlots).forEach((span) => {
    span.textContent = "_";
  });
  document.querySelectorAll(".clue-list li").forEach((item) => {
    item.classList.remove("found");
  });
  updateHudNote("Necesitas encontrar diez números antes de abrir la puerta.");
  updateCodeDisplay();
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
    "Todavía faltan números. Explora todas las habitaciones para encontrar las diez cifras.";
  resetBookshelf();
  resetArchive();
  resetLab();
  resetObservatory();
  resetRadio();
  resetGreenhouse();
  resetMusicbox();
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
  elements.bookshelfForm.addEventListener("submit", handleBookshelfSubmit);
  elements.archiveForm.addEventListener("submit", handleArchiveSubmit);
  elements.labTemperature.addEventListener("input", updateLabValue);
  elements.labCheck.addEventListener("click", handleLabCheck);
  elements.observatoryForm.addEventListener("submit", handleObservatorySubmit);
  elements.radioDial.addEventListener("input", updateRadioValue);
  elements.radioCheck.addEventListener("click", handleRadioCheck);
  elements.greenhouseTemp.addEventListener("input", updateGreenhouseValues);
  elements.greenhouseHumidity.addEventListener("input", updateGreenhouseValues);
  elements.greenhouseCheck.addEventListener("click", handleGreenhouseCheck);
  elements.musicButtons.forEach((button) => {
    button.addEventListener("click", handleMusicNote);
  });
  elements.musicSequenceReset.addEventListener("click", handleMusicReset);
  elements.doorForm.addEventListener("submit", handleDoorSubmit);
  elements.replay.addEventListener("click", handleReplay);
  Object.entries(elements.travelButtons).forEach(([key, button]) => {
    if (!button) return;
    button.addEventListener("click", handleTravel);
  });
  Object.values(elements.mapButtons).forEach((button) => {
    if (!button) return;
    button.addEventListener("click", handleMapTravel);
  });
  elements.ambientButtons.forEach((button) => {
    button.addEventListener("click", handleAmbientOption);
  });
  updateLabValue();
  updateRadioValue();
  updateGreenhouseValues();
  updateMapDestinations();
}

init();
