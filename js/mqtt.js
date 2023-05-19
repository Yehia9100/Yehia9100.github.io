


//---------------------------------------------------------------------------------------------------------------------

//const site = https://networksPro.github.io/my-website

//"ws://34.76.26.22:8080/"
const client = new Paho.MQTT.Client("ws://broker.hivemq.com:8080/", "myClientId" + new Date().getTime());

client.connect({
	onSuccess: onConnect, 
	//userName : "yehia",
	//password : "yehia1234"
});



function onConnect() {
  console.log("connection successful")
  client.subscribe("time") //subscribe to our topic
  client.subscribe("setTimer")
  client.subscribe("waternow")
}                    

const publish = (topic, msg) => {  //takes topic and message string
  let message = new Paho.MQTT.Message(msg);
  message.destinationName = topic;
  client.send(message);
  console.log("sending at topic " + topic + '\t message ' + message.payloadString)
}
client.onMessageArrived = (message) => {
  const topic = message.destinationName
  console.log("message arrived at topic " + topic + " " + message.payloadString)

  if (topic == "time") {
    
    const value = parseFloat(message.payloadString)/1000
    document.getElementById("base-timer-label").innerHTML = formatTime(
      value
    );
    timeLeft = value
    setCircleDasharray();
    setRemainingPathColor(value);
  }
  
  else if (topic == "waternow"){
    const value = parseInt(message.payloadString)
    if (value==3){
      document.getElementById("btnwater").classList.add('blinking')
      document.getElementById("base-timer-path-remaining").classList.add(COLOR_CODES.watering.color);
    }
    else if(value == 2){
      document.getElementById("btnwater").classList.remove('blinking')
      document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.watering.color);
    }
  }
  else if (topic == "setTimer"){
    const value = parseInt(message.payloadString)*60
    TIME_LIMIT = value;
  }
}

client.onConnectionLost = onConnectionLost;

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  client.connect({ onSuccess: onConnect });
}

//-----------------------------------------------------



