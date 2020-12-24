export const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    language: false,
    cursorPosition: {
      start: 0,
      end: 0
    },
    toPlay: true,
    inputElement: "",
    shown: false,
    listeners: []
  },

  init(inputElement) {
    // Create main elements
    const listeners = this.properties.listeners;
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    this.properties.inputElement = inputElement;

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for necessary elements set in inputElement
    function listenerFocus(kboard) {
      kboard.open(inputElement.value, currentValue => {
        inputElement.value = currentValue;
        inputElement.focus();
        inputElement.selectionStart = kboard.properties.cursorPosition.start;
        inputElement.selectionEnd = kboard.properties.cursorPosition.end;
      })
    }
    listeners.push({ method: "focus", func: listenerFocus });
    inputElement.addEventListener("focus", listenerFocus(this));
    function listenerEvent(kboard) {
      kboard.properties.cursorPosition.start = inputElement.selectionStart;
      kboard.properties.cursorPosition.end = inputElement.selectionEnd;
    }
    listeners.push({ method: "click", func: listenerEvent });
    inputElement.addEventListener("click", listenerEvent(this));
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        /* "done", */ "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
        "shift", "en", "space", "sound", "<", ">"],
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        /* "done", */ "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", ".", "?",
        "shift", "ru", "space", 'sound', "<", ">"]
    ];

    // Create keyboards for languages
    for (let i = 0; i < keyLayout.length; i++) {
      if (i === 0) {
        this._createKeyLayout(fragment, keyLayout[i], "en", false);
      } else {
        this._createKeyLayout(fragment, keyLayout[i], "ru", true);
      }
    }
    return fragment;
  },

  _createKeyLayout(fragment, keyLayoutLanguage, lang, hidden) {
    // create audio element for each language
    fragment.appendChild(this._createAudioElement(lang));
    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    // create keys and event listeners
    keyLayoutLanguage.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "p", "ъ", "enter", "?"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");
      if (!hidden) {
        keyElement.classList.add(lang);
      } else {
        keyElement.classList.add(lang, "en__hidden");
      }

      switch (key) {

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7": case "9":
        case "8": case "0":
          keyElement.classList.add("key__number");
          keyElement.textContent = key;
          keyElement.addEventListener("click", () => {
            let textValue = this.properties.value;
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            const beforeCursor = (start === 0) ? '' : textValue.slice(0, start);
            const afterCursor = textValue.slice(end);
            const keyEntered = key;
            this.properties.value = beforeCursor + keyEntered + afterCursor;
            if (this._isStartEqualEnd()) {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end += 1;
            } else {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end = this.properties.cursorPosition.start;
            }
            this._playSound(lang, toPlaySound);
            this._triggerEvent("oninput");
          });
          break;

        case "!":
        case "@":
        case "#":
        case "$": case "%":
        case "^":
        case "&":
        case "*": case "(": case ")":
          keyElement.classList.add("special__element", "special__element--hidden");
          keyElement.textContent = key;
          keyElement.addEventListener("click", () => {
            let textValue = this.properties.value;
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            const beforeCursor = (start === 0) ? '' : textValue.slice(0, start);
            const afterCursor = textValue.slice(end);
            const keyEntered = key;
            this.properties.value = beforeCursor + keyEntered + afterCursor;
            if (this._isStartEqualEnd()) {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end += 1;
            } else {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end = this.properties.cursorPosition.start;
            }
            this._playSound(lang, toPlaySound);
            this._triggerEvent("oninput");
          });
          break;

        case "backspace":
          keyElement.classList.add("keyboard__key--wide", "Backspace");
          keyElement.innerHTML = createIconHTML("backspace");
          fragment.appendChild(this._createAudioElement(key));
          keyElement.addEventListener("click", () => {
            let textValue = this.properties.value;
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            let beforeCursor = '';
            if (this._isStartEqualEnd()) {
              beforeCursor = start === 0 ? '' : textValue.slice(0, start - 1);
            } else {
              beforeCursor = start === 0 ? '' : textValue.slice(0, start);
            }
            const afterCursor = textValue.slice(end);
            this.properties.value = beforeCursor + afterCursor;
            if (this._isStartEqualEnd()) {
              this.properties.cursorPosition.start = start === 0 ? 0 : start - 1;
              this.properties.cursorPosition.end = end === 0 ? 0 : end - 1;
            } else {
              this.properties.cursorPosition.start = start === 0 ? 0 : start;
              this.properties.cursorPosition.end = start;
            }
            this._playSound(key, toPlaySound);
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", 'CapsLock');
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          fragment.appendChild(this._createAudioElement(key));
          keyElement.addEventListener("click", () => {
            let toPlaySound = this.properties.toPlay;
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            this._playSound(key, toPlaySound);
            this._triggerEvent("oninput");
          });

          break;

        case "sound":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "keyboard__key--active");
          keyElement.textContent = key.toLowerCase();
          fragment.appendChild(this._createAudioElement(key));
          keyElement.addEventListener("click", () => {
            let toPlaySound = this.properties.toPlay;

            keyElement.classList.toggle("keyboard__key--active", !toPlaySound);
            this._toggleSound();
            this._playSound(key, toPlaySound);
            this._triggerEvent("oninput");
          });
          break;


        case "shift":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.classList.add("keyboard__key-shift", "keyboard__key--activatable", 'Shift');
          keyElement.textContent = key;
          fragment.appendChild(this._createAudioElement(key));
          keyElement.addEventListener("click", () => {
            let toPlaySound = this.properties.toPlay;
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            this._playSound(key, toPlaySound);
            this._triggerEvent("oninput");
          });

          break;

        case lang:
          keyElement.classList.add("keyboard__key--wide");
          keyElement.textContent = key;
          fragment.appendChild(this._createAudioElement(key));
          keyElement.addEventListener("click", () => {
            let toPlaySound = this.properties.toPlay;
            this._toggleLanguage();
            this._playSound(key, toPlaySound);
            this._triggerEvent("oninput");
          });
          break;


        case "enter":
          keyElement.classList.add("keyboard__key--wide", "Enter");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          fragment.appendChild(this._createAudioElement(key));
          keyElement.addEventListener("click", () => {
            let textValue = this.properties.value;
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            const beforeCursor = (start === 0) ? '' : textValue.slice(0, start);
            const afterCursor = textValue.slice(end);
            this.properties.value = beforeCursor + '\n' + afterCursor;
            if (this._isStartEqualEnd()) {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end += 1;
            } else {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end = this.properties.cursorPosition.start;
            }
            this._playSound(key, toPlaySound);
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          fragment.appendChild(this._createAudioElement(key));
          keyElement.addEventListener("click", () => {
            let textValue = this.properties.value;
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            const beforeCursor = (start === 0) ? '' : textValue.slice(0, start);
            const afterCursor = textValue.slice(end);
            this.properties.value = beforeCursor + ' ' + afterCursor;
            if (this._isStartEqualEnd()) {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end += 1;
            } else {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end = this.properties.cursorPosition.start;
            }
            this._playSound(key, toPlaySound);
            this._triggerEvent("oninput");
          });

          break;

          /* case "done":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
            keyElement.innerHTML = createIconHTML("check_circle");
            fragment.appendChild(this._createAudioElement(key));
            keyElement.addEventListener("click", () => {
              let toPlaySound = this.properties.toPlay;
              this.close();
              this._playSound(key, toPlaySound);
              this._triggerEvent("onclose");
            }); */

          break;


        case "<":
          keyElement.textContent = key;
          fragment.appendChild(this._createAudioElement(lang));
          keyElement.addEventListener("click", () => {
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            if (this._isStartEqualEnd()) {
              this.properties.cursorPosition.start = start === 0 ? 0 : start - 1;
              this.properties.cursorPosition.end = end === 0 ? 0 : end - 1;
            } else {
              this.properties.cursorPosition.start = start === 0 ? 0 : start;
              this.properties.cursorPosition.end = start;
            }
            this._playSound(lang, toPlaySound);
            this._triggerEvent("oninput");
          });
          break;

        case ">":
          keyElement.textContent = key;
          fragment.appendChild(this._createAudioElement(lang));
          keyElement.addEventListener("click", () => {
            let textValue = this.properties.value;
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            if (this._isStartEqualEnd()) {
              if (this._isCursorOnLastPosition()) {
                this.properties.cursorPosition.start = end;
                this.properties.cursorPosition.end = end;
              } else {
                this.properties.cursorPosition.start = start + 1;
                this.properties.cursorPosition.end = end + 1;
              }
            } else {
              this.properties.cursorPosition.start = end;
              this.properties.cursorPosition.end = end;
            }
            this._playSound(lang, toPlaySound);
            this._triggerEvent("oninput");
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            let textValue = this.properties.value;
            let start = this.properties.cursorPosition.start;
            let end = this.properties.cursorPosition.end;
            let toPlaySound = this.properties.toPlay;
            const beforeCursor = (start === 0) ? '' : textValue.slice(0, start);
            const afterCursor = textValue.slice(end);
            let keyEntered;
            if (this.properties.capsLock) {
              if (this.properties.shift) {
                keyEntered = key.toLowerCase();
              } else {
                keyEntered = key.toUpperCase();
              }
            } else {
              if (this.properties.shift) {
                keyEntered = key.toUpperCase();
              } else {
                keyEntered = key.toLowerCase();
              }
            }
            this.properties.value = beforeCursor + keyEntered + afterCursor;
            if (this._isStartEqualEnd()) {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end += 1;
            } else {
              this.properties.cursorPosition.start += 1;
              this.properties.cursorPosition.end = this.properties.cursorPosition.start;
            }
            this._playSound(lang, toPlaySound);
            this._triggerEvent("oninput");
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        const brWithClass = document.createElement("br");
        if (!hidden) {
          brWithClass.classList.add(lang);
        } else {
          brWithClass.classList.add(lang, "en__hidden");
        }
        fragment.appendChild(brWithClass);
      }
    });
  },

  _isStartEqualEnd() {
    if (this.properties.cursorPosition.end === this.properties.cursorPosition.start) {
      return true;
    } else {
      return false;
    }
  },

  _isCursorOnLastPosition() {
    if (this.properties.cursorPosition.end === this.properties.value.length) {
      return true;
    } else {
      return false;
    }
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
      this.properties.inputElement.dispatchEvent(new Event('input'));
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.shift) {
          key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
        } else {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    }
  },

  _toggleSound() {
    this.properties.toPlay = !this.properties.toPlay;
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    for (const key of this.elements.keys) {
      if (key.classList.contains("key__number")) {
        key.classList.toggle("key__number--hidden", this.properties.shift);
      };
      if (key.classList.contains("special__element")) {
        key.classList.toggle("special__element--hidden", !this.properties.shift);
      };
      if (key.childElementCount === 0) {
        if (this.properties.capsLock) {
          key.textContent = this.properties.shift ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
        } else {
          key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }

    }
  },

  _toggleLanguage() {
    this.properties.language = !this.properties.language;

    for (const key of document.querySelectorAll(".en")) {
      key.classList.toggle("ru__hidden", this.properties.language);
      if (key.textContent.toLowerCase() === 'sound') {
        key.classList.toggle("keyboard__key--active", this.properties.toPlay);
      };
      if (key.classList.contains("keyboard__key-shift")) {
        key.classList.toggle("keyboard__key--active", this.properties.shift);
      };
      if (key.classList.contains("CapsLock")) {
        key.classList.toggle("keyboard__key--active", this.properties.capsLock);
      };
    };
    for (const key of document.querySelectorAll(".ru")) {
      key.classList.toggle("en__hidden", !this.properties.language);
      if (key.textContent.toLowerCase() === 'sound') {
        key.classList.toggle("keyboard__key--active", this.properties.toPlay);
      };
      if (key.classList.contains("keyboard__key-shift")) {
        key.classList.toggle("keyboard__key--active", this.properties.shift);
      };
      if (key.classList.contains("CapsLock")) {
        key.classList.toggle("keyboard__key--active", this.properties.capsLock);
      };
    };
  },

  _createAudioElement(keyPressed) {
    const audio = document.createElement("Audio");
    audio.classList.add(keyPressed);
    audio.setAttribute("src", `../assets/sound/${keyPressed}.wav`);
    return audio;
  },

  _playSound(forKey, toPlay) {
    if (!toPlay) return;
    const audio = document.querySelector(`audio.${forKey}`);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  },

  _setDefault() {
    const listeners = this.properties.listeners;
    const element = this.properties.inputElement;
    listeners.forEach(elem => { element.removeEventListener(elem.method, elem.func, true); });
    listeners.length = 0;
    //element.removeEventListener("keydown", listenerKeyDown);
    this.elements.main = null;
    this.elements.keysContainer = null;
    this.elements.keys = [];
    this.eventHandlers.oninput = null;
    this.eventHandlers.onclose = null;
    //this.properties.value = "";
    this.properties.capsLock = false;
    this.properties.shift = false;
    this.properties.language = false;
    this.properties.cursorPosition.start = 0;
    this.properties.cursorPosition.end = 0;
    this.properties.toPlay = true;
    this.properties.inputElement = "";
    this.properties.shown = false;
  },

  open(initialValue, oninput, onclose) {
    if (!document.querySelector(".keyboard")) {
      return;
    }
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = null;
    this.eventHandlers.onclose = null;
    this.elements.main.classList.add("keyboard--hidden");
  }
}

export function startListeners(inputElement) {

  Keyboard.init(inputElement);

  let keyShiftNotReleased = false; // to prevent auto repeating of shift;
  let keyCapslockNotReleased = false; // to prevent auto repeating of capslock;
  const listeners = Keyboard.properties.listeners;
  function listenerKeyDown(e) {
    const getElementsFromKeyboard = Keyboard.elements.keys;
    let toPlaySound = Keyboard.properties.toPlay;
    if (e.shiftKey && e.altKey) {
      Keyboard._toggleLanguage();
      return;
    };
    switch (e.key) {
      case ' ':
        Keyboard._playSound('space', toPlaySound);
        document.querySelector(".keyboard__key--extra-wide").classList.add('activeFisKeyboard');
        break;

      case 'Backspace':
        Keyboard._playSound('backspace', toPlaySound);
        document.querySelector('.Backspace').classList.add('activeFisKeyboard');
        break;

      case 'CapsLock':
        if (keyCapslockNotReleased) return;
        Keyboard._toggleCapsLock();
        document.querySelector('.CapsLock').classList.toggle("keyboard__key--active", Keyboard.properties.capsLock);
        Keyboard._playSound('caps', toPlaySound);
        document.querySelector('.CapsLock').classList.add('activeFisKeyboard');
        keyCapslockNotReleased = true;
        break;

      case 'Shift':
        if (keyShiftNotReleased) return;
        Keyboard._toggleShift();
        document.querySelector('.Shift').classList.toggle("keyboard__key--active", Keyboard.properties.shift);
        Keyboard._playSound('shift', toPlaySound);
        document.querySelector('.Shift').classList.add('activeFisKeyboard');
        keyShiftNotReleased = true;
        break;

      case 'Enter':
        Keyboard._playSound('enter', toPlaySound);
        document.querySelector('.Enter').classList.add('activeFisKeyboard');
        break;

      default:
        getElementsFromKeyboard.forEach(item => {
          if (e.key === item.textContent) {
            if (item.textContent.toLowerCase() === 'ru') {
              Keyboard._playSound('ru', toPlaySound)
            } else {
              Keyboard._playSound('en', toPlaySound)
            }
            item.classList.add('activeFisKeyboard')
          }
        })
    }
  };
  listeners.push({ method: 'keydown', func: listenerKeyDown });
  inputElement.addEventListener('keydown', listenerKeyDown, true);

  function listenerKeyUp(e) {
    const getElementsFromKeyboard = Keyboard.elements.keys;
    const textArea = inputElement;
    switch (e.key) {
      case ' ':
        document.querySelector(".keyboard__key--extra-wide").classList.remove('activeFisKeyboard');
        Keyboard.properties.cursorPosition.start = textArea.selectionStart;
        Keyboard.properties.cursorPosition.end = textArea.selectionEnd;
        Keyboard.properties.value = e.target.value;
        break;
      case 'Shift':
        Keyboard._toggleShift();
        document.querySelector("." + e.key).classList.toggle("keyboard__key--active", Keyboard.properties.shift);
        document.querySelector("." + e.key).classList.remove('activeFisKeyboard');
        keyShiftNotReleased = false;
        break;
      case 'CapsLock':
        document.querySelector("." + e.key).classList.remove('activeFisKeyboard');
        keyCapslockNotReleased = false;
        break;
      case 'Backspace':
      case 'Enter':
        document.querySelector("." + e.key).classList.remove('activeFisKeyboard');
        Keyboard.properties.cursorPosition.start = textArea.selectionStart;
        Keyboard.properties.cursorPosition.end = textArea.selectionEnd;
        Keyboard.properties.value = e.target.value;
        break;
      default:
        getElementsFromKeyboard.forEach(item => {
          if (e.key === item.textContent) {
            item.classList.remove('activeFisKeyboard');
            Keyboard.properties.cursorPosition.start = textArea.selectionStart;
            Keyboard.properties.cursorPosition.end = textArea.selectionEnd;
            Keyboard.properties.value = e.target.value;
          }
        })
    }
  };
  listeners.push({ method: 'keyup', func: listenerKeyUp });
  inputElement.addEventListener('keyup', listenerKeyUp, true);
}

export * from './keyboard.js';