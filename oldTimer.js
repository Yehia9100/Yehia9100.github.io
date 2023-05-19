import { publish ,client} from "./js/mqtt.js";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
var timeLeft = 20;
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  },
 };



var TIME_LIMIT = 120;
let timePassed = 0;
let timeLeft = 20;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

var live =0
client.onMessageArrived = (message) => {
    if(message.destinationName == "time"){
      
      const value = parseInt(message.payloadString)
      if(value == -1){
        watering()
      }
      else if(!isNaN(value)){
        
        live = value
      }
      
    }
}

function watering(){
  document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(watering.color);
}

document.getElementById("setter").addEventListener('click',(e) =>{
  var value = parseFloat(document.getElementById("input").value)
  console.log(value)
  if(value > 0 ){
    publish("setTime","" + value)
    TIME_LIMIT = value*60
    timePassed = 0
    timeLeft = 20;
    onTimesUp()
    startTimer()
    remainingPathColor = COLOR_CODES.info.color;
  }
  else{
    prompt("error")
  }
  

})
document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;


function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft =20
    //mocking time sent from esp2866
    console.log("time produced")
    publish("time","" + timeLeft)
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if(timeLeft>warning.threshold){
    document
    .getElementById("base-timer-path-remaining")
    .classList.remove(warning.color);
    document
    .getElementById("base-timer-path-remaining")
    .classList.remove(alert.color);
  document
    .getElementById("base-timer-path-remaining")
    .classList.add(info.color);

  }
  else if(timeLeft <= warning.threshold &&timeLeft>alert.threshold){
    document
    .getElementById("base-timer-path-remaining")
    .classList.remove(info.color);
    document
    .getElementById("base-timer-path-remaining")
    .classList.remove(alert.color);
  document
    .getElementById("base-timer-path-remaining")
    .classList.add(warning.color);

  }
  else {
    document
    .getElementById("base-timer-path-remaining")
    .classList.remove(warning.color);
    document
    .getElementById("base-timer-path-remaining")
    .classList.remove(info.color);
  document
    .getElementById("base-timer-path-remaining")
    .classList.add(alert.color);

  }

}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}