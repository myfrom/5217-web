/*
    5217 - Web
    Based on 5217 by Francisco Franco
    Developed by Jackson Hayes
*/
/*
  Variables
*/

var startTimeStamp;
var endTimeStamp;
var minutesAwayStamp;
var currentTimeStamp;
var placeHolderTime;
var currentCycle;

// A literal ARRAY of colors. Ha!
var workColors = ["#238aff", "#278cff", "#2c8fff", "#3091ff", "#3493ff", "#3996ff", "#3d98ff", "#419aff", "#469cff", "#4a9fff", "#4ea1ff", "#53a3ff", "#57a6ff", "#5ba8ff", "#60aaff", "#64adff", "#68afff", "#6db1ff", "#71b4ff", "#75b6ff", "#7ab8ff", "#7ebaff", "#82bdff", "#87bfff", "#8bc1ff", "#8fc4ff", "#94c6ff", "#98c8ff", "#9ccbff", "#a1cdff", "#a5cfff", "#a9d1ff", "#aed4ff", "#b2d6ff", "#b6d8ff", "#bbdbff", "#bfddff", "#c3dfff", "#c8e2ff", "#cce4ff", "#d0e6ff", "#d5e9ff", "#d9ebff", "#ddedff", "#e2efff", "#e6f2ff", "#eaf4ff", "#eff6ff", "#f3f9ff", "#f7fbff", "#fcfdff", "#ffffff"];

var minutesAwayRounded = 52;
var frontLayer = "2";
var backLayer = "1";
var timerRunning = false;

const worktime = 52;
const breaktime = 17;

/*
  Event Listeners
*/

// An event listener must be added for both copies of the elements, as there are two.
document.getElementById("timerfab1").addEventListener("click", startWork);
document.getElementById("resetButton1").addEventListener("click", reset);
document.getElementById("timerfab2").addEventListener("click", startWork);
document.getElementById("resetButton2").addEventListener("click", reset);
/*
  Functions
*/
function startWork() {
  currentCycle = "work";
  timerRunning = true;

  document.getElementById("resetButton1").classList.remove("inactive-element");
  document.getElementById("resetButton2").classList.remove("inactive-element");

  document.getElementById("resetButton1").classList.add("active-element");
  document.getElementById("resetButton2").classList.add("active-element");

  setTheme(currentCycle);

  getStartTime();
  getEndTime(currentCycle);
  getCurrentTime();
  getMinutesAway(currentTime, endTime);

  notify(currentCycle, minutesAwayRounded);

  /* Animate FAB out */
  document.getElementById("timerfab1").classList.add("hide-fab");
  document.getElementById("timerfab1").classList.remove("show-fab");
  setTimeout(function() {
    document.getElementById("timerfab1").classList.add("hide");
  }, 200);

  /* Animate FAB out */
  document.getElementById("timerfab2").classList.add("hide-fab");
  document.getElementById("timerfab2").classList.remove("show-fab");
  setTimeout(function() {
    document.getElementById("timerfab2").classList.add("hide");
  }, 200);

  /* Animate Pulsing Dot in */
  document.getElementById("pulsingDot1").classList.remove("hide");
  document.getElementById("pulsingDot1").classList.add("show-dot");
  document.getElementById("pulsingDotContainer1").classList.add("pulseStart");

  document.getElementById("pulsingDot2").classList.remove("hide");
  document.getElementById("pulsingDot2").classList.add("show-dot");
  document.getElementById("pulsingDotContainer2").classList.add("pulseStart");

  var x = setInterval(function() {
    getCurrentTime();
    getMinutesAway(currentTime, endTime);
    updateTimer(currentCycle);
    if (!timerRunning) {
      // TODO: Try to animate this down the road
      document.getElementById("heroNumber1").innerHTML = 52;
      document.getElementById("heroNumber2").innerHTML = 52;

      clearInterval(x);
      return;
    }
    if (timerRunning && (minutesAwayRounded === 0)) {
      startBreak();
      clearInterval(x);
      return;
    }
  }, 10);

}

function startBreak() {
  currentCycle = "break";
  timerRunning = true;
  document.getElementById("resetButton1").classList.add("activeElement");
  document.getElementById("resetButton2").classList.add("activeElement");

  setTheme(currentCycle);

  getStartTime();
  getEndTime(currentCycle);
  getCurrentTime();
  getMinutesAway(currentTime, endTime);

  notify(currentCycle, minutesAwayRounded);

  // No longer needed? updateTimer(currentCycle);

  var y = setInterval(function() {
    getCurrentTime();
    getMinutesAway(currentTime, endTime);
    updateTimer(currentCycle);
    if (!timerRunning) {
      // TODO: Try to animate this down the road
      document.getElementById("heroNumber1").innerHTML = 52;
      document.getElementById("heroNumber2").innerHTML = 52;

      clearInterval(y);
      return;
    }
    if (timerRunning && (minutesAwayRounded === 0)) {
      startTimer();
      clearInterval(y);
      return;
    }
  }, 10);

}

function reset() {


  if (timerRunning === true) {
    document.getElementById("resetButton1").classList.remove("active-element");
    document.getElementById("resetButton2").classList.remove("active-element");
    document.getElementById("resetButton1").classList.add("spinit");
    document.getElementById("resetButton2").classList.add("spinit");


    setTimeout(function() {
      document.getElementById("resetButton1").classList.remove("spinit");
      document.getElementById("resetButton2").classList.remove("spinit");
      document.getElementById("resetButton1").classList.add("inactive-element");
      document.getElementById("resetButton2").classList.add("inactive-element");
    }, 610);

    timerRunning = false;
    minutesAwayRounded = 52;

    document.getElementById("sharefab1").classList.add("hide-fab");
    document.getElementById("sharefab2").classList.add("hide-fab");

    document.getElementById("timerfab1").classList.remove("hide-fab");
    document.getElementById("timerfab2").classList.remove("hide-fab");

    if (!document.getElementById("timerfab1").classList.contains("show-fab") || !document.getElementById("timerfab2").classList.contains("show-fab")) {
      document.getElementById("timerfab1").classList.add("show-fab");
      document.getElementById("timerfab2").classList.add("show-fab");
    }
    if (!document.getElementById("pulsingDot1").classList.contains("hide") || !document.getElementById("pulsingDot2").classList.contains("hide")) {
      document.getElementById("pulsingDot1").classList.add("hide");
      document.getElementById("pulsingDot2").classList.add("hide");
    }

    setTheme("work");
  }
  currentCycle = null;
}

function setTheme(cycleType) {
  if (cycleType === "work") {
    document.getElementById("heroNumber1").style.color = "#ffffff";
    document.getElementById("resetButton1").style.color = "#ffffff";
    document.getElementById("moreButton1").style.color = "#ffffff";
    document.getElementById("heroNumber2").style.color = "#ffffff";
    document.getElementById("resetButton2").style.color = "#ffffff";
    document.getElementById("moreButton2").style.color = "#ffffff";
    document.getElementById("layer2div").style.backgroundColor = "#237aff";
    document.getElementById("layer1div").style.backgroundColor = "#237aff";
    if (document.getElementById("sharefab1").classList.contains("show-fab") || document.getElementById("sharefab2").classList.contains("show-fab")) {
      document.getElementById("sharefab1").classList.add("hide-fab");
      document.getElementById("sharefab1").classList.add("hide");
      document.getElementById("sharefab2").classList.add("hide-fab");
      document.getElementById("sharefab2").classList.add("hide");
      document.getElementById("sharefab1").classList.remove("show-fab");
      document.getElementById("sharefab2").classList.remove("show-fab");
    }
    if (document.getElementById("timerfab1").classList.contains("hide") || document.getElementById("timerfab2").classList.contains("hide")) {
      document.getElementById("timerfab1").classList.remove("hide");
      document.getElementById("timerfab2").classList.remove("hide");
      document.getElementById("timerfab1").classList.remove("hide-fab");
      document.getElementById("timerfab2").classList.remove("hide-fab");
      document.getElementById("timerfab1").classList.add("show-fab");
      document.getElementById("timerfab2").classList.add("show-fab");
    }
    if (!document.getElementById("pulsingDot1").classList.contains("hide") || !document.getElementById("pulsingDot2").classList.contains("hide")) {
      document.getElementById("pulsingDot1").classList.add("hide");
      document.getElementById("pulsingDot1").classList.remove("show-dot");
      document.getElementById("pulsingDotContainer1").classList.remove("pulseStart");
      document.getElementById("pulsingDot2").classList.add("hide");
      document.getElementById("pulsingDot2").classList.remove("show-dot");
      document.getElementById("pulsingDotContainer2").classList.remove("pulseStart");
    }
  }
  if (cycleType === "break") {
    document.getElementById("heroNumber1").style.color = "#237aff";
    document.getElementById("resetButton1").style.color = "#237aff";
    document.getElementById("moreButton1").style.color = "#237aff";
    document.getElementById("heroNumber2").style.color = "#237aff";
    document.getElementById("resetButton2").style.color = "#237aff";
    document.getElementById("moreButton2").style.color = "#237aff";
    document.getElementById("layer2div").style.backgroundColor = "#ffffff";
    document.getElementById("layer1div").style.backgroundColor = "#ffffff";
    if (!document.getElementById("sharefab1").classList.contains("show-fab") || !document.getElementById("sharefab2").classList.contains("show-fab")) {
      document.getElementById("sharefab1").classList.add("show-fab");
      document.getElementById("sharefab2").classList.add("show-fab");
      document.getElementById("sharefab1").classList.remove("hide-fab");
      document.getElementById("sharefab2").classList.remove("hide-fab");
      document.getElementById("sharefab1").classList.remove("hide");
      document.getElementById("sharefab2").classList.remove("hide");
    }
    if (!document.getElementById("timerfab1").classList.contains("hide") || !document.getElementById("timerfab2").classList.contains("hide")) {
      document.getElementById("timerfab1").classList.add("hide");
      document.getElementById("timerfab2").classList.add("hide");
      document.getElementById("timerfab1").classList.add("hide-fab");
      document.getElementById("timerfab2").classList.add("hide-fab");
      document.getElementById("timerfab1").classList.remove("show-fab");
      document.getElementById("timerfab2").classList.remove("show-fab");
    }
    if (!document.getElementById("pulsingDot1").classList.contains("hide") || !document.getElementById("pulsingDot2").classList.contains("hide")) {
      document.getElementById("pulsingDot1").classList.add("hide");
      document.getElementById("pulsingDot2").classList.add("hide");
      document.getElementById("pulsingDot1").classList.remove("show-dot");
      document.getElementById("pulsingDot2").classList.remove("show-dot");
      document.getElementById("pulsingDotContainer1").classList.remove("pulseStart");
      document.getElementById("pulsingDotContainer2").classList.remove("pulseStart");
    }
    swipeLayer();
  }
}

function updateTimer(cycleType) {
  document.getElementById("heroNumber1").innerHTML = minutesAwayRounded;
  document.getElementById("heroNumber2").innerHTML = minutesAwayRounded;
  // Run notification at 51 mins
  if ((placeHolderTime != minutesAwayRounded) && minutesAwayRounded === 51) {
    notify(cycleType, minutesAwayRounded);
    console.log("Tried to notify.");
  }

  if (placeHolderTime != minutesAwayRounded) {
    placeHolderTime = minutesAwayRounded;
    if (cycleType === "work") {
      setMinuteColors(currentCycle);
    }
    if (minutesAwayRounded != 52 && cycleType === "work") {
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
    endTime = new Date(startTime + (worktime * 60000)).getTime();
    placeHolderTime = worktime;
  } else if (cycleType === "break") {
    endTime = new Date(startTime + (breaktime * 60000)).getTime();
    placeHolderTime = breaktime;
  }
  return endTime;
}

function getMinutesAway(now, finish) {
  minutesAway = (finish - now) / 60000;
  minutesAwayRounded = Math.ceil(minutesAway);
  return minutesAwayRounded;
}

function getLayerOrder() {
  var aLayer = document.getElementById("layer1div");
  var aLayerProp = window.getComputedStyle(aLayer, null).getPropertyValue("z-index");
  var bLayer = document.getElementById("layer2div");
  var bLayerProp = window.getComputedStyle(bLayer, null).getPropertyValue("z-index");
  if (bLayerProp > aLayerProp) {
    console.log("layer2div is in front, at position: " + bLayerProp);
    f = "2";
    r = "1";
  } else if (aLayerProp > bLayerProp) {
    console.log("layer1div is in front, at position: " + aLayerProp);
    f = "1";
    r = "2";
  }
}

function setMinuteColors(cycleType) {
  getLayerOrder();
  document.getElementById("layer" + f + "div").style.backgroundColor = workColors[Math.abs(worktime - minutesAwayRounded)];
  document.getElementById("layer" + r + "div").style.backgroundColor = workColors[Math.abs(worktime - minutesAwayRounded) + 1];
  if (minutesAwayRounded === "35") {
    document.getElementById("heroNumber1").style.color = "#237aff";
    document.getElementById("heroNumber2").style.color = "#237aff";
    document.getElementById("resetButton1").style.color = "#237aff";
    document.getElementById("moreButton1").style.color = "#237aff";
    document.getElementById("resetButton2").style.color = "#237aff";
    document.getElementById("moreButton2").style.color = "#237aff";

  }
}

function swipeLayer() {
  getLayerOrder();
  console.log("swipeLayer() run");

  if (f === "2") {
    document.getElementById("layer2div").classList.add("swipe-background");
    setTimeout(function() {
      document.getElementById("layer2div").classList.add("unswipe-background");
    }, 520);
    setTimeout(function() {
      document.getElementById("layer2div").style.zIndex = "-2";
      setTimeout(function() {
        document.getElementById("layer1div").style.zIndex = "0";
      }, 1);
      setTimeout(function() {
        document.getElementById("layer2div").style.zIndex = "-1";
      }, 2);
    }, 512);
    setTimeout(function() {
      document.getElementById("layer2div").classList.remove("unswipe-background", "swipe-background");
    }, 1000);
  } else if (f === "1") {
    document.getElementById("layer1div").classList.add("swipe-background");
    setTimeout(function() {
      document.getElementById("layer1div").classList.add("unswipe-background");
    }, 520);
    setTimeout(function() {
      document.getElementById("layer1div").style.zIndex = "-2";
      setTimeout(function() {
        document.getElementById("layer2div").style.zIndex = "0";
      }, 1);
      setTimeout(function() {
        document.getElementById("layer1div").style.zIndex = "-1";
      }, 2);
    }, 512);
    setTimeout(function() {
      document.getElementById("layer1div").classList.remove("unswipe-background", "swipe-background");
    }, 1000);
  }
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

function checkIfMobile() {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    return true;
  } else {
    return false;
  }
}

function notify(type, remainingMinutes) {
  if (!checkIfMobile()) {
    if (type === "break") {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      } else {
        var options = {
          icon: '/images/icon.png',
          body: remainingMinutes + " minutes left - relax!",
        };
        var notification = new Notification('Time for a break', options);
        notification.onclick = function() {
          window.focus();
          notification.close();
        }
      }
    } else if (type === "work") {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      } else {
        var options = {
          icon: '/images/icon.png',
          body: remainingMinutes + " minutes left in this cycle",
        };
        var notification = new Notification('Keep working!', options);
        notification.onclick = function() {
          window.focus();
          notification.close();
        }
      }
    }
  }
}
