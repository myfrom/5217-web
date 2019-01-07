// Import ripple to add it to generated buttons
import {MDCRipple} from '@material/ripple';

// Detect a returning visitor
let returnVisit = false;
if (document.cookie && /returning=1/.test(document.cookie))
  returnVisit = true;
// Add a cookie to detect returning visits, expires after 3 months
const d = new Date();
d.setTime(d.getTime() + 7776000);
document.cookie = 'foo=bar;path=/;expires='+d.toGMTString()+';';
document.cookie = `returning=1;samesite=strict,expires=${d.toGMTString()};`;


window.installPrompt.then(installPromptEvent => {

  // Add a button in options menu
  const menu = document.querySelector('#uidiv .mdc-menu ul');
  const menuItem = document.createElement('li');
  menuItem.textContent = 'Install';
  menuItem.classList.add('mdc-list-item');
  menuItem.setAttribute('role', 'menuitem');
  menuItem.setAttribute('tabindex', 0);
  new MDCRipple(menuItem);
  menuItem.addEventListener('click', () => {
    installPromptEvent.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('Installed to homescreen')
      } else {
        console.log('Install prompt rejected');
      }
      window.dispatchEvent(new CustomEvent('delete-a2hs-buttons'));
    }, { once: true, passive: true });
    installPromptEvent.prompt();
  });
  window.addEventListener('delete-a2hs-buttons', () => {
    menuItem.remove();
  }, { once: true });
  menu.appendChild(menuItem);

  // Add a button in pause screen
  const button = document.createElement('button');
  button.textContent = 'Install';
  button.classList.add('mdc-button', 'mdc-button--outlined');
  button.style.position = 'fixed';
  button.style.bottom = '120px';
  button.style.left = '50%';
  button.style.transform = 'translateX(-50%)';
  button.style.display = 'none';
  button.style.zIndex = 1;
  new MDCRipple(button);
  window.addEventListener('cyclechange', e => {
    const cycle = e.detail;
    if (cycle === 'break') {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  });
  button.addEventListener('click', () => {
    installPromptEvent.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('Installed to homescreen')
      } else {
        console.log('Install prompt rejected');
      }
      window.dispatchEvent(new CustomEvent('delete-a2hs-buttons'));
    }, { once: true, passive: true });
    installPromptEvent.prompt();
  });
  window.addEventListener('delete-a2hs-buttons', () => {
    button.remove();
  }, { once: true });
  document.body.insertAdjacentElement('afterbegin', button);

  // Show that button for returning visitors at start
  if (returnVisit && window.currentCycle !== 'work') { // Assumes currentCycle var is global
    button.style.color = 'white';
    button.style.borderColor = 'white';
    button.style.display = 'block';
    window.addEventListener('cyclechange', () => {
      button.style.color = 'unset';
      button.style.borderColor = 'unset';
    });
  }
});