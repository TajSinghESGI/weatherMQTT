var mqtt = require('mqtt')
var express = require('express')
var bodyParser = require('body-parser')
var rest = require('unirest');

const apiKey = '3d7731af7d6c87b1d66a50237aee5740';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

var client  = mqtt.connect('mqtt://bluecase:bluecase@2.tcp.ngrok.io:18058')

app.listen(3000, ()=> {
    console.log('Server running on port 3000');
})

client.on('connect', function () {
  client.subscribe('esgi/relai', function (err) {
    if (!err) {
      client.publish('esgi/relai', 'Hello mqtt')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  //client.end()
})

app.post("/send-mqtt", (req, res, next) =>{
    rest('GET', 'https://api.openweathermap.org/data/2.5/weather?q=Paris&appid='+apiKey+'&units=metric')
    .end(function (res) {
        client.publish('test', JSON.parse(res.raw_body).main.temp.toString())
        result.json(res.body)
    })
})

//TEMPERATURE
function publishTemperature(topic) {
    setInterval(() => {
        rest('GET', 'https://api.openweathermap.org/data/2.5/weather?q=Paris&appid='+apiKey+'&units=metric')
        .end(function (res) {
            client.publish(topic, JSON.parse(res.raw_body).main.temp.toString())
        })
    }, 30000);
}

//PRESSURE
function publishPressure(topic) {
    setInterval(() => {
        rest('GET', 'https://api.openweathermap.org/data/2.5/weather?q=Paris&appid='+apiKey+'&units=metric')
        .end(function (res) {
            client.publish(topic, JSON.parse(res.raw_body).main.pressure.toString())
        })
    }, 30000);
}

//HUMIDITY
function publishHumidity(topic) {
    setInterval(() => {
        rest('GET', 'https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=9f77fba820f5a1a1f8ed9bc6edc7eead&units=metric')
        .end(function (res) {
            client.publish(topic, JSON.parse(res.raw_body).main.humidity.toString())
        })
    }, 30000);
}

//publishTemp('esgi/taj/wether');
publishHumidity('sensors/demo/esgi/taj/humidity');
publishTemperature('esgi/relai');
publishPressure('sensors/demo/esgi/taj/pressure');