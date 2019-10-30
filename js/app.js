// MDC
import {MDCRipple} from '@material/ripple';
import {MDCMenu} from '@material/menu';
import {MDCDialog} from '@material/dialog';
import {MDCList} from '@material/list';
import {MDCSwitch} from '@material/switch';


// Instate settings object
window.SETTINGS = {
  notification: true,
  sound: false,
  theme: 'auto',
  getComputedTheme: function() {
    if (this.theme == 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      return this.theme;
    }
  }
};


// Add 2 Home Screen enhancements

window.installPrompt = new Promise(resolve => {
  window.addEventListener('beforeinstallprompt', e => {
    // Prevent default, we want our own install banner
    e.preventDefault();
    // Pass the event
    resolve(e);
  });
});

('BeforeInstallPromptEvent' in window) && import('./a2hs');


// MDC initialisation

const rippleElsList = document.querySelectorAll('[data-mdc-auto-init="ripple"]');
rippleElsList.forEach(el => new MDCRipple(el));
const rippleUnElsList = document.querySelectorAll('[data-mdc-auto-init="ripple-unbounded"]');
rippleUnElsList.forEach(el => {
  const ripple = new MDCRipple(el);
  ripple.unbounded = true;
});

// Hook up theme selection
const themeMenu = new MDCMenu(document.querySelector('#themeMenu'));
themeMenu.hoistMenuToBody();
themeMenu.setAnchorCorner(4); // Sets to top right corner
const themeSelectContainer = document.querySelector('#themeSelectContainer');
const themeSelect = document.querySelector('#themeSelectContainer select');
themeSelectContainer.addEventListener('click', () => {
  const position = themeSelectContainer.getBoundingClientRect();
  themeMenu.setAbsolutePosition(
    position.right - 24,
    position.y - 48 * themeSelect.selectedIndex
  );
  themeMenu.list_.selectedIndex = themeSelect.selectedIndex;
  themeMenu.open = !themeMenu.open;
});
themeMenu.items.forEach(el => {
  el.addEventListener('click', e => {
    const selectedIndex = Number(e.target.getAttribute('data-option-index'));
    themeSelect.selectedIndex = selectedIndex;
    themeSelectContainer.querySelector('.settings-select-value').textContent =
      themeSelect.item(selectedIndex).textContent;
    // Notify about change if necessary
    const oldTheme = SETTINGS.getComputedTheme();
    SETTINGS.theme = themeSelect.value;
    const newTheme = SETTINGS.getComputedTheme();
    if (newTheme !== oldTheme) {
      /**
       * Event indicating that the theme needs to be changed,
       * @event themechange
       * @type {CustomEvent}
       * @property {string} detail - New theme ('light' or 'dark')
       */
      window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
    }
  });
});

const notificationToggle = new MDCSwitch(document.getElementById("notificationSwitch"));
const soundToggle = new MDCSwitch(document.getElementById("soundSwitch"));

notificationToggle.listen('change', () => {
  if (!notificationToggle.checked) {
    soundToggle.checked = false;
    soundToggle.disabled = true;
    // We also need to change hint text
    const settingsHints = document.querySelectorAll('.settingslist:nth-child(2) .settings-hint');
    settingsHints[0].classList.add('hide');
    settingsHints[1].classList.remove('hide');
  } else {
    soundToggle.disabled = false;
  }
});

const handleSwitchSettingsHint = e => {
  const checked = e.target.checked;
  const hints = e.target.closest('li').querySelectorAll('.settings-hint');
  hints[0].classList.toggle('hide', !checked);
  hints[1].classList.toggle('hide', checked);
};

notificationToggle.listen('change', handleSwitchSettingsHint);
soundToggle.listen('change', handleSwitchSettingsHint);

const settingsList = new MDCList(document.querySelector('#settingsList'));

const aboutDialog = new MDCDialog(document.querySelector('#about-dialog'));
const settingsDialog = new MDCDialog(document.querySelector('#settings-dialog'));

document.querySelector('#about-dialog-trigger')
  .addEventListener('click', () => aboutDialog.open());

document.querySelector('#settings-dialog-close-button')
  .addEventListener('click', () => settingsDialog.close('close'));

settingsDialog.listen('MDCDialog:opened', () => {
  settingsList.layout();
});

settingsDialog.listen('MDCDialog:closed', e => saveSettings({
  notification: notificationToggle.checked,
  sound: soundToggle.checked,
  theme: themeSelect.value
}));

document.querySelector('#settings-dialog-trigger')
  .addEventListener('click', () => settingsDialog.open());

const threeDotMenu = new MDCMenu(document.querySelector('#uidiv .mdc-menu'));
threeDotMenu.setAnchorCorner(1); // Sets to bottom left corner
threeDotMenu.setAnchorMargin({ top: 20, bottom: 20, left: 20, right: 20 }); // Mind button padding
document.querySelector('#morebutton').addEventListener('click', () => threeDotMenu.open = !threeDotMenu.open);


// Expose a function to change settings from code
function updateSettingsState(settings = {}) {
  if (typeof settings != 'object')
    throw new Error('changeSettingsState called with invalid input, expected { notification, sound, theme }, got ', settings);

  if (settings.notification) {
    notificationToggle.checked = true;
    soundToggle.disabled = false;
  } else {
    notificationToggle.checked = false;
    soundToggle.checked = false;
    soundToggle.disabled = true;
  }
  if (settings.sound) {
    soundToggle.checked = true;
  } else {
    soundToggle.checked = false;
  }

  let selectedThemeIndex = 0;
  switch (settings.theme) {
    case 'light':
      selectedThemeIndex = 1;
      break;
    case 'dark':
      selectedThemeIndex = 2;
      break;
    default:
      selectedThemeIndex = 0;
  }
  themeSelect.selectedIndex = selectedThemeIndex;

  // Also change settings hints
  const settingsItems = document.querySelectorAll('.settingslist');
  const settingsHints = Array.from(settingsItems).map(item => item.querySelectorAll('.settings-hint'));
  // Notification
  settingsHints[0][0].classList.toggle('hide', !settings.notification);
  settingsHints[0][1].classList.toggle('hide', settings.notification);
  // Sound
  settingsHints[1][0].classList.toggle('hide', !settings.sound);
  settingsHints[1][1].classList.toggle('hide', settings.sound);
  // Theme
  themeSelectContainer.querySelector('.settings-select-value').textContent =
    themeSelect.item(selectedThemeIndex).textContent;
}






/*
    5217 - Web
    Based on 5217 by Francisco Franco
    Developed by Jackson Hayes
*/

/*
  Constants
*/

const minute = (window.DEBUG && window.DEBUG.MINUTE) ? window.DEBUG.MINUTE : 60000;

const worktime = (window.DEBUG && window.DEBUG.WORKTIME) ? window.DEBUG.WORKTIME : 52;
const breaktime = (window.DEBUG && window.DEBUG.BREAKTIME) ? window.DEBUG.BREAKTIME : 17;

const originalTitle = document.title;

/*
  Variables
*/

var startTime;
var endTime;
var minutesAway;
var currentTime;
var placeHolderTime;
var currentCycle;

var workColors = generateColorsList(worktime, '#237aff', '#ffffff');

var breakMessages = ["have a cup of tea!", "put your feet up!", "take a deep breath!", "ponder infinity…", "enjoy the moment!", "order a pizza?", "say hi to a stranger!", "take a walk around!", "stand up and stretch!", "grab some coffee!", "strike a pose!", "catch up on reading!", "have a brainstorm!", "clean your junk drawer!", "have a daydream!", "share your progress!", "clear your mind!", "meditate!", "just relax!", "find a good playlist!", "rest your eyes!", "stretch your legs!", "think of a joke!", "make a quick call!", "read a listicle!", "have a snack!", "play a quick game!", "consider the universe!", "watch a funny video!", "treat yo self!", "… have a KitKat!", "tweet the world!", "tell someone you love 'em"];

var notificationTitle = {
  "break": "Time for a break",
  "work": "Keep working!",
};
var notificationBody = {
  "break": " minutes left - ",
  "work": " minutes left in this cycle",
}

var chosenBreakMessage;

var minutesAwayRounded = worktime;
var frontLayer = 2;
var backLayer = 1;
var timerRunning = false;

/*
  Elements
*/

var timerFab1Element = document.getElementById("timerfab1");
var resetButton1Element = document.getElementById("resetButton");
var pulsingDot1Element = document.getElementById("pulsingDot1");
var pulsingDot1ContainerElement = document.getElementById("pulsing-dot-container");
var hero1Element = document.getElementById("heroNumber1");
var hero2Element = document.getElementById("heroNumber2");
var shareFab1Element = document.getElementById("sharefab1");
var moreButton1Element = document.getElementById("morebutton");
var layer1DivElement = document.getElementById("layer1div");
var layer2DivElement = document.getElementById("layer2div");
/* var breakMessage1Element = document.getElementById("breakMessage1");
var breakMessage2Element = document.getElementById("breakMessage2"); */

/*
  Event Listeners
*/

// An event listener must be added for both copies of the elements, as there are two.
timerFab1Element.addEventListener("click", startTimer);
resetButton1Element.addEventListener("click", reset);


/* Listen for theme changes */
window.addEventListener('themechange', e => {
  const themeLight = e.detail == 'light';
  const darkThemeLink = document.querySelector('#dark-theme-preload');
  if (themeLight) {
    if (darkThemeLink.rel == 'stylesheet')
      darkThemeLink.sheet.disabled = true;
  } else {
    if (darkThemeLink.rel == 'stylesheet')
      darkThemeLink.sheet.disabled = false;
    else
      darkThemeLink.rel = 'stylesheet';
  }
  // Swap colours in runtime
  workColors = themeLight ?
    generateColorsList(worktime, '#237aff', '#ffffff') :
    generateColorsList(worktime, '#183767', '#121212');
  setMinuteColors();
  // Set status bar colour
  document.querySelector('meta[name="theme-color"]')
    .setAttribute('content', themeLight ? '#237aff' : '#183767');
});

/*
  Functions
*/
function generateColorsList(steps, original, target) {
  // Catch invalid values
  if (typeof original != 'string' && original.length != 7)
    throw new Error('Original parameter passed to renderColorsList isn\'t valid hex color value', original);
  if (typeof target != 'string' && target.length != 7)
    throw new Error('Target parameter passed to renderColorsList isn\'t valid hex color value', target);

  original = original.slice(1, 7);
  target = target.slice(1, 7);
  
  const originalRgb = new Uint8ClampedArray(3);
  // Get each value from the string #HEX color
  originalRgb[0] = parseInt(original.slice(0,2), 16);
  originalRgb[1] = parseInt(original.slice(2,4), 16);
  originalRgb[2] = parseInt(original.slice(4,6), 16);

  const targetRgb = new Uint8ClampedArray(3);
  // Get each value from the string #HEX color
  targetRgb[0] = parseInt(target.slice(0,2), 16);
  targetRgb[1] = parseInt(target.slice(2,4), 16);
  targetRgb[2] = parseInt(target.slice(4,6), 16);

  const colorsRgbArray = [ originalRgb ];

  const colorDiffs = [
    (originalRgb[0] - targetRgb[0]) / (steps - 1),
    (originalRgb[1] - targetRgb[1]) / (steps - 1),
    (originalRgb[2] - targetRgb[2]) / (steps - 1)
  ];

  for (let i = 1; i < steps; i++) {
    colorsRgbArray[i] = new Uint8ClampedArray(3);
    colorsRgbArray[i][0] = originalRgb[0] - colorDiffs[0] * i;
    colorsRgbArray[i][1] = originalRgb[1] - colorDiffs[1] * i;
    colorsRgbArray[i][2] = originalRgb[2] - colorDiffs[2] * i;
  }

  const hexColorsArray = colorsRgbArray.map(rgb =>
    `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`);

  return hexColorsArray;
}

function setCookies() {
  if (typeof Storage !== 'undefined') {
    if (typeof localStorage.notifpref === 'undefined') {
      localStorage.notifpref = true;
    }
    if (typeof localStorage.soundpref === 'undefined') {
      localStorage.soundpref = false;
    }
    if (typeof localStorage.themepref === 'undefined') {
      localStorage.themepref = 'auto';
    }

    SETTINGS.notification = localStorage.notifpref == 'true';
    SETTINGS.sound = SETTINGS.notification && localStorage.soundpref == 'true';
    SETTINGS.theme = localStorage.themepref;

    updateSettingsState(SETTINGS);

    // If we need a theme different than default, notify
    if (SETTINGS.getComputedTheme() != 'light') {
      /**
       * Event indicating that the theme needs to be changed,
       * @event themechange
       * @type {CustomEvent}
       * @property {string} detail - New theme ('light' or 'dark')
       */
      window.dispatchEvent(new CustomEvent('themechange', { detail: 'dark' }));
    }
  }
}

function saveSettings(input = {}) {
  if (typeof input != 'object')
    throw new Error('saveSettings called with invalid input, expected { notification, sound, theme }, got ', input);
  const notificationSetting = input.notification || false;
  const soundSetting = input.sound || false;
  const themeSetting = input.theme || 'auto';
  localStorage.notifpref = notificationSetting;
  localStorage.soundpref = soundSetting;
  localStorage.themepref = themeSetting;
  SETTINGS.notification = notificationSetting;
  SETTINGS.sound = soundSetting;
  SETTINGS.theme = themeSetting;
}

function startTimer() {
  currentCycle = "work";
  timerRunning = true;

  startNewType();

  setTimeout(function() {
    /* Animate FAB out */
    timerFab1Element.classList.add("hide");
  }, 200);

  resetButton1Element.disabled = false;

  timerFab1Element.classList.add("hide-fab");
  timerFab1Element.classList.remove("show-fab");

  /* Animate Pulsing Dot in */
  pulsingDot1Element.classList.remove("hide");
  pulsingDot1Element.classList.add("show-dot");
  pulsingDot1ContainerElement.classList.add("pulseStart");

  var x = setInterval(function() {
    if (!timerRunning) {
      // TODO: Try to animate this down the road
      hero1Element.innerHTML = worktime;
      hero2Element.innerHTML = worktime;

      clearInterval(x);
      return;
    }

    getCurrentTime();
    getMinutesAway(currentTime, endTime);
    updateTimer(currentCycle);

    if (timerRunning && (minutesAwayRounded <= 0)) {
      switchCycles();
      startNewType();
    }
  }, 1000);

  /** 
   * Event letting the app know about cycle changes,
   * @event cyclechange
   * @type {CustomEvent}
   * @property {string} detail - New cycle name ('work' or 'break')
   */
  var event = new CustomEvent('cyclechange', { detail: 'work' });
  window.dispatchEvent(event);
}

function switchCycles() {
  currentCycle = currentCycle === "work" ? "break" : "work";
  /** 
   * Event letting the app know about cycle changes,
   * @event cyclechange
   * @type {CustomEvent}
   * @property {string} detail - New cycle name ('work' or 'break')
   */
  var event = new CustomEvent('cyclechange', { detail: currentCycle });
  window.dispatchEvent(event);
}

function startNewType() {
  setTheme(currentCycle);

  getStartTime();
  getEndTime(currentCycle);
  getCurrentTime();
  getMinutesAway(currentTime, endTime);

  updateTitle(currentCycle);
  notify(currentCycle, minutesAwayRounded);
}

function reset() {

  if (timerRunning !== true) return;

  resetButton1Element.classList.add("spinit");


  setTimeout(function() {
    resetButton1Element.classList.remove("spinit");
    resetButton1Element.disabled = true;
  }, 610);

  timerRunning = false;
  updateTitle(null);

  shareFab1Element.classList.add("hide-fab");

  timerFab1Element.classList.remove("hide-fab", "hide");

  if (!timerFab1Element.classList.contains("show-fab")) {
    timerFab1Element.classList.add("show-fab");
  }
  if (!pulsingDot1Element.classList.contains("hide")) {
    pulsingDot1Element.classList.add("hide");
  }
  setTheme("work");

  currentCycle = null;
}

function setTheme(cycleType) {
  if (cycleType === "work") {
    increaseAnimation(worktime);
    // breakMessage1Element.style.visibility = "hidden";
    // breakMessage2Element.style.visibility = "hidden";
    document.body.classList.remove('invert');
    layer2DivElement.style.backgroundColor = workColors[0];
    layer1DivElement.style.backgroundColor = workColors[0];
    if (shareFab1Element.classList.contains("show-fab")) {
      shareFab1Element.classList.add("hide-fab");
      shareFab1Element.classList.add("hide");
      shareFab1Element.classList.remove("show-fab");
    }
  }
  if (cycleType === "break") {
    increaseAnimation(breaktime);
    // chosenBreakMessage = "Time for a break!" + "<br>" + capitalizeFirstLetter(chooseBreakMessage());
    // breakMessage1Element.innerHTML = chosenBreakMessage;
    // breakMessage2Element.innerHTML = chosenBreakMessage;
    // breakMessage1Element.style.visibility = "visible";
    // breakMessage2Element.style.visibility = "visible";
    document.body.classList.add('invert');
    layer2DivElement.style.backgroundColor = workColors[worktime - 1];
    layer1DivElement.style.backgroundColor = workColors[worktime - 1];
    if (!shareFab1Element.classList.contains("show-fab")) {
      shareFab1Element.classList.add("show-fab");
      shareFab1Element.classList.remove("hide-fab");
      shareFab1Element.classList.remove("hide");
    }
    swipeLayer();
  }
}

function updateTimer(cycleType) {
  getLayerOrder();
  if (frontLayer === 2) {
    hero1Element.innerHTML = minutesAwayRounded;
    setTimeout(function() {
      hero2Element.innerHTML = minutesAwayRounded;
    }, 520);
  } else if (frontLayer === 1) {
    hero2Element.innerHTML = minutesAwayRounded;
    setTimeout(function() {
      hero1Element.innerHTML = minutesAwayRounded;
    }, 520);
  }

  // Run notification at 51 mins
  if (placeHolderTime === minutesAwayRounded) return;

  updateTitle(cycleType);

  switch (minutesAwayRounded) {
    case 35:
    case 14:
    case 5:
      notify(cycleType, minutesAwayRounded);
  }

  placeHolderTime = minutesAwayRounded;

  if (cycleType === "work") {
    setMinuteColors(currentCycle);

    if (minutesAwayRounded < worktime) {
      swipeLayer();
    }
  }
}

function getStartTime() {
  startTime = new Date().getTime();
  return startTime;
}

function getCurrentTime() {
  currentTime = new Date().getTime();
  return currentTime;
}

function getEndTime(cycleType) {
  if (cycleType === "work") {
    endTime = new Date(startTime + (worktime * minute)).getTime();
    placeHolderTime = worktime;
  } else if (cycleType === "break") {
    endTime = new Date(startTime + (breaktime * minute)).getTime();
    placeHolderTime = breaktime;
  }
  return endTime;
}

function getMinutesAway(now, finish) {
  minutesAway = (finish - now) / minute;
  minutesAwayRounded = Math.ceil(minutesAway);
  return minutesAwayRounded;
}

function getLayerOrder() {
  var aLayer = layer1DivElement;
  var aLayerProp = window.getComputedStyle(aLayer, null).getPropertyValue("z-index");
  var bLayer = layer2DivElement;
  var bLayerProp = window.getComputedStyle(bLayer, null).getPropertyValue("z-index");
  if (bLayerProp > aLayerProp) {
    frontLayer = 2;
    backLayer = 1;
  } else if (aLayerProp > bLayerProp) {
    frontLayer = 1;
    backLayer = 2;
  }
}

function setMinuteColors(cycleType = currentCycle) {
  getLayerOrder();
  if (cycleType === 'break') {
    layer1DivElement.style.backgroundColor = workColors[worktime - 1];
    layer2DivElement.style.backgroundColor = workColors[worktime - 1];
    document.body.classList.add('invert');
  } else {
    (frontLayer === 1 ? layer1DivElement : layer2DivElement).style.backgroundColor = workColors[Math.abs(worktime - minutesAwayRounded)];
    (backLayer === 1 ? layer1DivElement : layer2DivElement).style.backgroundColor = workColors[Math.abs(worktime - minutesAwayRounded) + 1];
    if (minutesAwayRounded / worktime < 0.58)
      document.body.classList.add('invert')
    else
      document.body.classList.remove('invert');
  }
}

function swipeLayer() {
  getLayerOrder();

  if (frontLayer === 2) {
    layer2DivElement.classList.add("swipe-background");
    setTimeout(function() {
      layer2DivElement.classList.add("unswipe-background");
    }, 520);
    setTimeout(function() {
      layer2DivElement.style.zIndex = "-2";
      setTimeout(function() {
        layer1DivElement.style.zIndex = "0";
      }, 1);
      setTimeout(function() {
        layer2DivElement.style.zIndex = "-1";
      }, 2);
    }, 512);
    setTimeout(function() {
      layer2DivElement.classList.remove("unswipe-background", "swipe-background");
    }, 1000);
  } else if (frontLayer === 1) {
    layer1DivElement.classList.add("swipe-background");
    setTimeout(function() {
      layer1DivElement.classList.add("unswipe-background");
    }, 520);
    setTimeout(function() {
      layer1DivElement.style.zIndex = "-2";
      setTimeout(function() {
        layer2DivElement.style.zIndex = "0";
      }, 1);
      setTimeout(function() {
        layer1DivElement.style.zIndex = "-1";
      }, 2);
    }, 512);
    setTimeout(function() {
      layer1DivElement.classList.remove("unswipe-background", "swipe-background");
    }, 1000);
  }
}

function updateTitle(cycleType) {
  if (cycleType == null) {
    document.title = originalTitle;
  } else {
    document.title = `${minutesAwayRounded}m ${cycleType} remaining - ${originalTitle}`;
  }
}

function increaseAnimation(animType) {
    var increase = setInterval(function() {
      hero1Element.innerHTML = minutesAwayRounded;
      hero2Element.innerHTML = minutesAwayRounded;
      if (minutesAwayRounded === animType) {
        clearInterval(increase);
        return;
      }
      minutesAwayRounded++;
    }, 30);
  }

/* Break Message Code */
function chooseBreakMessage() {
  return breakMessages[Math.floor(Math.random() * breakMessages.length)];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
  Notification code
*/

// request notification permission on page load
document.addEventListener('DOMContentLoaded', function() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

function notify(type, minutes) {
  if (SETTINGS.notification){
    showNotification(type, notificationTitle[type], getNotificationBody(type, minutes))
  }
}

function showNotification(type, title, body) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  } else {
    var options = {
      icon: 'images/icon.png',
      body: body,
    };
    var notification = new Notification(title, options);
    setPlayAudio(type);
    notification.onclick = function () {
      window.focus();
      notification.close();
    }
  }
}

function getNotificationBody(type, remainingMinutes) {
  if (type === "break") {
    return remainingMinutes + notificationBody[type] + chooseBreakMessage();
  } else if (type === "work") {
    return remainingMinutes + notificationBody[type];
  } else if (type === "unpaused") {
    return remainingMinutes + notificationBody[type];
  }
}

function setPlayAudio(type) {
  if (SETTINGS.sound && (minutesAwayRounded === 52 || (minutesAwayRounded === 17 && cycleType === "break"))) {
    if (type ==="work"){
      let audio = new Audio("sound/end_break.wav");
      audio.play();
    } else if (type === "break") {
      let audio = new Audio("sound/end_work.wav");
      audio.play();
    }
  }
}

// Prompt user if they try to close the tab when timerRunning
window.onbeforeunload = function (e) {
  if (timerRunning === true) {
    e = e || window.event;
    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = '5217 is still running! Are you sure you want to quit?';
    }
    // For Safari
    return '5217 is still running! Are you sure you want to quit?';
  }
};



/* Load settings and other important things */
setCookies();
// If supported, notify about system theme chnages
if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    // If theme isn't auto, skip
    if (SETTINGS.theme !== 'auto')
      return;
    /**
     * Event indicating that the theme needs to be changed,
     * @event themechange
     * @type {CustomEvent}
     * @property {string} detail - New theme ('light' or 'dark')
     */
    window.dispatchEvent(new CustomEvent('themechange', { detail: e.matches ? 'dark' : 'light' }));
  })
}
