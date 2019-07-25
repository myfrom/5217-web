// MDC
import {MDCRipple} from '@material/ripple';
import {MDCMenu} from '@material/menu';
import {MDCDialog} from '@material/dialog';
import {MDCList} from '@material/list';
import {MDCSwitch} from '@material/switch';


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
}

notificationToggle.listen('change', handleSwitchSettingsHint);
soundToggle.listen('change', handleSwitchSettingsHint);

const settingsList = new MDCList(document.querySelector('#settingsList'));

const aboutDialog = new MDCDialog(document.querySelector('#about-dialog'));
const settingsDialog = new MDCDialog(document.querySelector('#settings-dialog'));

document.querySelector('#about-dialog-trigger')
  .addEventListener('click', () => aboutDialog.open());

settingsDialog.listen('MDCDialog:opened', () => {
  settingsList.layout();
})

settingsDialog.listen('MDCDialog:closed', e => {
  if (e.detail.action == 'save') {
    saveSettings({
      notification: notificationToggle.checked,
      sound: soundToggle.checked
    });
  }
})

document.querySelector('#settings-dialog-trigger')
  .addEventListener('click', () => settingsDialog.open());

const menu = new MDCMenu(document.querySelector('.mdc-menu'));
menu.setAnchorCorner(1); // Sets to bottom left corner
menu.setAnchorMargin({ top: 20, bottom: 20, left: 20, right: 20 }); // Mind button padding
document.querySelector('#morebutton').addEventListener('click', () => menu.open = !menu.open);


// Expose a function to change settings from code
function updateSettingsState(settings = {}) {
  if (typeof settings != 'object')
    throw new Error('changeSettingsState called with invalid input, expected { notification, sound }, got ', settings);

  if (settings.notification) {
    notificationToggle.checked = true;
  } else {
    notificationToggle.checked = false;
    soundToggle.checked = false;
    soundToggle.disabled = true;
  }
  if (sound === 'true') {
    let checked = document.createAttribute('checked');
    soundToggleElement.attributes.setNamedItem(checked);
  }
  if (notification === 'false') {
    soundToggleElement.setAttribute('disabled', '');
    soundToggleElement.removeAttribute('checked');
  }

  // Also change settings hints
  const settingsItems = document.querySelectorAll('.settingslist');
    settingsHints[0].classList.add('hide');
    settingsHints[1].classList.remove('hide');
  const settingsHints = settingsItems.map(item => item.querySelectorAll('.settings-hint'));
  // Notification
  settingsHints[0][0].classList.toggle('hide', !notification);
  settingsHints[0][1].classList.toggle('hide', notification);
  // Sound
  settingsHints[1][0].classList.toggle('hide', !sound);
  settingsHints[1][1].classList.toggle('hide', sound);
}