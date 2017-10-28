/* 
    5217 - Web
    Based on 5217 by Francisco Franco
    Developed by Jackson Hayes
*/

// Variables
var startTime;
var endTime;
var minutesAway;
var minutesAwayRounded = 52;
var secondsAway;
var currentTime;
var runTimer = false;
var changeTime;
var workColors = ["#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff", "#237aff"];
var breakColors = ["#ffffff",  "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"];
var frontBackground = "f";
var rearBackground = "b";
var currentCycle;

const work = 52;
const breaktime = 17;

// request notification permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

function getStartTime() {
    startTime = new Date().getTime();
}

function getEndTime(cycleType) {
    if (cycleType === work) {
        endTime = new Date(startTime + work * 60000).getTime();
        changeTime = work;
        console.log("Endtime: " + endTime);
    } else if (cycleType === breaktime) {
        endTime = new Date(startTime + breaktime * 60000).getTime();
        changeTime = breaktime;
        console.log("Endtime: " + endTime);
    }
    return endTime;
}

function getCurrentTime() {
    currentTime = new Date().getTime();
    return currentTime;
}

function getMinutesAway(now, finish) {
    minutesAway = (finish - now) / 60000;
    secondsAway = minutesAway * 60;
    minutesAwayRounded = Math.ceil(minutesAway);
}

function updateTimer(cycleType) {
    document.getElementById("heroNumber").innerHTML = minutesAwayRounded;
    if ((changeTime != minutesAwayRounded) && minutesAwayRounded === 51) {
        notify(cycleType, minutesAwayRounded);
    }
    if (changeTime != minutesAwayRounded) {
        changeTime = minutesAwayRounded;
        swipeBackground(currentCycle);
        console.log("changeTime updated to " + changeTime);
    }
}

function getBackgroundOrder() {
    var firstElement = document.getElementById("backgroundfcontainer");
    var firstElementProp = window.getComputedStyle(firstElement,null).getPropertyValue("z-index");
    var secondElement = document.getElementById("backgroundbcontainer");
    var secondElementProp = window.getComputedStyle(secondElement,null).getPropertyValue("z-index");
    if (secondElementProp > firstElementProp) {
        console.log("secondElementProp is in front, at position: " + secondElementProp);
        frontBackground = "b";
        rearBackground = "f";
    } else if (firstElementProp > secondElementProp) {
        console.log("firstElementProp is in front, at position: " + firstElementProp);        
        frontBackground = "f";
        rearBackground = "b";
    }
}

function swipeBackground(cycleType) {
    getBackgroundOrder();
    var t = rearBackground;
    var s = frontBackground;
    if (minutesAwayRounded === 52) {
        document.getElementById("background" + s).style.backgroundColor = "#237aff";
        document.getElementById("background" + t).style.backgroundColor = "#237aff";
        document.getElementById("background" + t).classList.add("swipe-background");
        document.getElementById("background" + t + "container").classList.add("fade-background");
        console.log("swipeBackground() run");
        setTimeout(function () {        
            document.getElementById("background" + t).style.backgroundColor = document.getElementById("background" + s).style.backgroundColor;
        }, 300);
        setTimeout(function () {
            document.getElementById("background" + t + "container").style.zIndex = "-3";
            setTimeout(function () {
                document.getElementById("background" + t + "container").style.zIndex = "-2";
            }, 2);
            setTimeout(function () {
                document.getElementById("background" + s + "container").style.zIndex = "-1";
            }, 4);
        }, 410);
        document.getElementById("background" + t).classList.add("unswipe-background");
        document.getElementById("background" + t + "container").classList.add("unfade-background");
        setTimeout(function () {
            document.getElementById("background" + t).classList.remove("unswipe-background", "swipe-background");
            document.getElementById("background" + t + "container").classList.remove("fade-background", "unfade-background");
        }, 430);
    } else if (minutesAwayRounded === 17 && cycleType === "work") {
        document.getElementById("background" + s).style.backgroundColor = "#ffffff";
        document.getElementById("background" + t).style.backgroundColor = "#ffffff";
        document.getElementById("background" + t).classList.add("swipe-background");
        document.getElementById("background" + t + "container").classList.add("fade-background");
        console.log("swipeBackground() run");
        setTimeout(function () {        
            document.getElementById("background" + t).style.backgroundColor = document.getElementById("background" + s).style.backgroundColor;
        }, 300);
        setTimeout(function () {
            document.getElementById("background" + t + "container").style.zIndex = "-3";
            setTimeout(function () {
                document.getElementById("background" + t + "container").style.zIndex = "-2";
            }, 2);
            setTimeout(function () {
                document.getElementById("background" + s + "container").style.zIndex = "-1";
            }, 4);
        }, 410);
        document.getElementById("background" + t).classList.add("unswipe-background");
        document.getElementById("background" + t + "container").classList.add("unfade-background");
        setTimeout(function () {
            document.getElementById("background" + t).classList.remove("unswipe-background", "swipe-background");
            document.getElementById("background" + t + "container").classList.remove("fade-background", "unfade-background");
        }, 430);    
    } else {
        if (cycleType === "work") {
            document.getElementById("background" + s).style.backgroundColor = workColors[Math.abs(work - minutesAwayRounded)];
            document.getElementById("background" + t).style.backgroundColor = workColors[Math.abs(work - minutesAwayRounded) + 1];
        } else if (cycleType === "break") {
            document.getElementById("background" + s).style.backgroundColor = breakColors[Math.abs(breaktime - minutesAwayRounded)];
            document.getElementById("background" + t).style.backgroundColor = breakColors[Math.abs(breaktime - minutesAwayRounded) + 1];
        }
        document.getElementById("background" + t).classList.add("swipe-background");
        document.getElementById("background" + t + "container").classList.add("fade-background");
        console.log("swipeBackground() run");
        setTimeout(function () {        
            document.getElementById("background" + t).style.backgroundColor = document.getElementById("background" + s).style.backgroundColor;
        }, 300);
        setTimeout(function () {
            document.getElementById("background" + t + "container").style.zIndex = "-3";
            setTimeout(function () {
                document.getElementById("background" + t + "container").style.zIndex = "-2";
            }, 2);
            setTimeout(function () {
                document.getElementById("background" + s + "container").style.zIndex = "-1";
            }, 4);
        }, 410);
        document.getElementById("background" + t).classList.add("unswipe-background");
        document.getElementById("background" + t + "container").classList.add("unfade-background");
        setTimeout(function () {
            document.getElementById("background" + t).classList.remove("unswipe-background", "swipe-background");
            document.getElementById("background" + t + "container").classList.remove("fade-background", "unfade-background");
        }, 430);
    }
}

function resetTimer() {
    if (runTimer === true) {
        document.getElementById("resetButton").classList.add("spinit");
        setTimeout(function () {
            document.getElementById("resetButton").classList.remove("spinit");
        }, 610);
        runTimer = false;
        minutesAwayRounded = 52;
        updateTimer("work");
        document.getElementById("sharefab").classList.add("hide-fab");
        document.getElementById("timerfab").classList.remove("hide-fab");
        if (document.getElementById("timerfab").classList.contains("show-fab")) {
            //DoNothing
        } else {
            document.getElementById("timerfab").classList.add("show-fab");
        }
        if (document.getElementById("pulsingDot").classList.contains("hide")) {
            // Don't do anything 
        } else {
            document.getElementById("pulsingDot").classList.add("hide");
        }
        setTheme(work);
    }
    currentCycle = null;
}

function setTheme(cycleType) {
    if (cycleType === work) {
        document.getElementById("heroNumber").style.color = "#ffffff";
        document.getElementById("resetButton").style.color = "#ffffff";
        document.getElementById("moreButton").style.color = "#ffffff";
        if (document.getElementById("sharefab").classList.contains("show-fab")) {
            document.getElementById("sharefab").classList.add("hide-fab");
            document.getElementById("sharefab").classList.add("hide");
        }
        if (document.getElementById("timerfab").classList.contains("hide")) {
            document.getElementById("timerfab").classList.remove("hide");
        }
        if (document.getElementById("pulsingDot").classList.contains("hide")) {
            // Don't do anything 
        } else {
            document.getElementById("pulsingDot").classList.add("hide");
            document.getElementById("pulsingDot").classList.remove("show-dot");
            document.getElementById("pulsingDotContainer").classList.remove("pulseStart");
        }
        swipeBackground("work");
    } 
    if (cycleType === breaktime) {
        document.getElementById("heroNumber").style.color = "#237aff";
        document.getElementById("resetButton").style.color = "#237aff";
        document.getElementById("moreButton").style.color = "#237aff";
        if (document.getElementById("sharefab").classList.contains("hide")) {
            document.getElementById("sharefab").classList.remove("hide");
        }
        if (document.getElementById("sharefab").classList.contains("show-fab")) {
            // Don't do anything 
        } else {
            document.getElementById("sharefab").classList.add("show-fab");
        }
        if (document.getElementById("timerfab").classList.contains("hide")) { 
            // Don't do anything 
        } else {
            document.getElementById("timerfab").classList.add("hide");
        }
        if (document.getElementById("pulsingDot").classList.contains("hide")) { 
            // Don't do anything 
        } else {
            document.getElementById("pulsingDot").classList.add("hide");
        }
        swipeBackground("break");

    }
}

function startTimer() {
    currentCycle = "work";
    runTimer = true;
    setTheme(work);
    getStartTime();
    getEndTime(work);
    getCurrentTime();
    getMinutesAway(currentTime, endTime);
    notify("work", minutesAwayRounded);
    document.getElementById("timerfab").classList.add("hide-fab");
    document.getElementById("timerfab").classList.remove("show-fab");
    setTimeout(function () {
        document.getElementById("timerfab").classList.add("hide");
    }, 200);
    document.getElementById("pulsingDot").classList.remove("hide");
    document.getElementById("pulsingDot").classList.add("show-dot");
    document.getElementById("pulsingDotContainer").classList.add("pulseStart");
    var x = setInterval(function () {
        getCurrentTime();
        getMinutesAway(currentTime, endTime);
        updateTimer("work");
        if (!runTimer) { 
            // TODO: Try to animate this down the road 
            document.getElementById("heroNumber").innerHTML = 52;
            clearInterval(x);
            return;
        }
        if (runTimer && (minutesAwayRounded === 0)) {
            startBreak();
            clearInterval(x);
            return;
        }
    }, 100);
}

function startBreak() {
    currentCycle = "break";
    runTimer = true;
    getStartTime();
    getEndTime(breaktime);
    getCurrentTime();
    getMinutesAway(currentTime, endTime);
    setTheme(breaktime);
    notify("break", minutesAwayRounded);
    updateTimer("break");
    var y = setInterval(function () {
        getCurrentTime();
        getMinutesAway(currentTime, endTime);
        updateTimer("break");
        if (!runTimer) { 
            // TODO: Try to animate this down the road 
            document.getElementById("heroNumber").innerHTML = 52;
            clearInterval(y);
            return;
        }
        if (runTimer && (minutesAwayRounded === 0)) {
            startTimer();
            clearInterval(y);
            return;
        }
    }, 100);
}

function checkIfMobile() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        console.log("MOBILE!");
        return true;
    } else {
        console.log("NOT MOBILE!");
        return false;
    }
}

function notify(type, remainingMinutes) {
    if (type === "break") {
        if (!checkIfMobile()) {

            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            } else {
                var options = {
                    icon: '/images/icon.png',
                    body: remainingMinutes + " minutes left - relax!",
                };
                var notification = new Notification('Time for a break', options);
                notification.onclick = function () {
                    window.focus();
                    notification.close();
                }
            }
        }
    } else if (type === "work") {
        if (!checkIfMobile()) {
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            } else {
                var options = {
                    icon: '/images/icon.png',
                    body: remainingMinutes + " minutes left in this cycle",
                };
                var notification = new Notification('Keep working!', options);
                notification.onclick = function () {}
            }
        }
    }
}

document.getElementById("timerfab").addEventListener("click", startTimer);
document.getElementById("resetButton").addEventListener("click", resetTimer);