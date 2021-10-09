/*
write on oct 21 - author : Benj & Max
in direction of connection between arduino/mqtt and prometheus/grafana
*/
// declaration of requires and port connection
const express = require('express')
const app = express()
const port = 3001

/////////////////////////////////////////           mqtt              /////////////////////////////////////////////////////////
/* mosquitto_sub -h test.mosquitto.org -t test 
mosquitto_pub -h test.mosquitto.org -t test -m "calap" */
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://test.mosquitto.org') // mqtt broker connection

// mqtt topics declaration
const GLOBAL = "tipio"; 
const RDN = "test/rdn_temp";
const LUM = "sensor_lum/lum";
const TEMP = "sensor_temp/temp";
const MOV = "sensor_mov/mov";

// mqtt suscribe & publish
client.on('connect', () => {
  client.subscribe(GLOBAL, (err) => {
    if (!err) {
      client.publish(GLOBAL, 'Hello mqtt')
    }
  })
}) 

client.on('connect', () => {
  client.subscribe(RDN, (err) => {
    if (!err) {
      client.publish(RDN, 'Hello rdn_temp')
    }
  })
}) 

client.on('connect', () => {
  client.subscribe(LUM, (err) => {
    if (!err) {
      client.publish(LUM, 'Hello lum')
    }
  })
}) 

client.on('connect', () => {
  client.subscribe(TEMP, (err) => {
    if (!err) {
      client.publish(TEMP, 'Hello temp')
    }
  })
}) 

client.on('connect', () => {
  client.subscribe(MOV, (err) => {
    if (!err) {
      client.publish(MOV, 'Hello mov')
    }
  })
}) 

// mqtt update metrics
client.on('message', (topic, message) => {
  if (topic === GLOBAL) {
    updateMetric('tipio', message);
  }
  // message is Buffer
  // console.log("NEW calap")
  console.log(topic.toString())
  console.log(message.toString())
  // client.end()
})

client.on('message', (topic1, message1) => {
  if (topic1 === RDN) {
    updateMetric('rdn_temp', message1);
  }
})

client.on('message', (topic2, message2) => {
  if (topic2 === LUM) {
    updateMetric('lum', message2);
  }
})

client.on('message', (topic3, message3) => {
  if (topic3 === TEMP) {
    updateMetric('temp', message3);
  }
})

client.on('message', (topic1, message4) => {
  if (topic1 === MOV) {
    updateMetric('mov', message4);
  }
})
/////////////////////////////////////////           mqtt              /////////////////////////////////////////////////////////

//function to have two digits displayed in the date function with .slice : '0' + MyDate.getDate()).slice(-2)
const twoNum = (nombre) => {
  return ('0' + nombre).slice(-2)
}

////////////////////////////////////////         date  metrics      ////////////////////////////////////////////////////////////
// function to display the date on the server
/*
07/10/2021 12:36:22 = chosen format
two methods are possible, this one with parentheses, "+" symbol and separators in quotes :
const date = ('0' + timestamp.getDate()).slice(-2) + '/' + ('0' + (timestamp.getMonth()+1)).slice(-2) + '/' + timestamp.getFullYear();
const hours = twoNum(timestamp.getHours()) + ":" + twoNum(timestamp.getMinutes()) + ":" + twoNum(timestamp.getSeconds());
this one, choosen here, below with $ whiskers and between apostrophe tilted
*/
const formatDate = (timestamp) => {
  const date = `${twoNum(timestamp.getDate())}/${twoNum(timestamp.getMonth() + 1)}/${timestamp.getFullYear()}`;
  const hours = `${twoNum(timestamp.getHours())}:${twoNum(timestamp.getMinutes())}:${twoNum(timestamp.getSeconds())}`;
  const fullDate = date + ' ' + hours;
  return fullDate;
}

const getHours = (t) => {
  const hour = `${twoNum(t.getHours())}`;
  return hour;
}

const getMinutes = (timestamp) => {
  const minutes = `${twoNum(timestamp.getMinutes())}`;
  return minutes;
}

const getSeconds = (timestamp) => {
  const secondes = `${twoNum(timestamp.getSeconds())}`;
  return secondes;
}
////////////////////////////////////////         date  metrics      ///////////////////////////////////////////////////////////////
/* metrics registry : declaration of metrics in an array
for Prometheus, only use a name column and a value column or it may return an "NNAME" error */
let metrics = [
    { name: "today_is", value: 1}, //, string: "a"},
    { name: "hello_one", value: 2}, //, string: "b" },
    { name: "world_two", value: 3}, //, string: "c" },
    { name: "caracters_three", value: 4}, //, string: "d"},
    { name: "hour", value: 5},
    { name: "minute", value: 6}, 
    { name: "seconde", value: 7}, // (`${formatSeconds(seconde)}`)}, 
    { name: "tipio", value: 8},
    { name:"rdn_temp", value: 9},
    { name:"lum", value: 10},
    { name:"temp", value: 11},
    { name:"mov", value: 12},
  ];

/* internal metrics update : the metric is updated after having been processed by the function: "setInterval"
otherwise, she would return the value entered in the initial array to the server */
const updateMetric = (title, numb) => {
    return metrics.map((metric) => {
      if (metric.name === title) { // what exactly does this if ? and why the other metrics are outside parentheses ?
        metric.value = numb
        // metric.string === string  // '==' or '===' is possible
      }
      return metric;
    })
}

// uses the "random" function to retrieve a random value at the mentioned value: here a number for the value
setInterval(() => {
  const now = new Date;
    // get the date in timestamp
    metrics = updateMetric('today_is', Math.floor(Date.now() / 1000));
    // hours
    metrics = updateMetric('hour', getHours(now));
    // minutes
    metrics = updateMetric('minute', getMinutes(now));
    // seconds
    metrics = updateMetric('seconde', getSeconds(now));
    // get a random number in interval
    metrics = updateMetric('hello_one', Math.floor(Math.random(min = 0, max = 100) * (100 - 0) + 0));
    // get a random number
    metrics = updateMetric('world_two', Math.random());
    // get a random number in interval
    metrics = updateMetric('tipio', Math.floor(Math.random(min = 0, max = 100) * (100 - 0) + 0));
    // get a random number
    //metrics = updateMetric('rdn_temp', Math.random());
    // metrics = updateMetric('lum', Math.floor(Math.random(min = 0, max = 100) * (100 - 0) + 0));
    // get a random number
    // metrics = updateMetric('temp', Math.random());
    // get a random number
    // metrics = updateMetric('mov', Math.random());
    // get random number and a random caracter : toString in base16 and don't realy undersatnd what is generating by "substring"
    metrics = updateMetric('caracters_three', Math.random()); 
}, 1000)

// route declaration & Metrics exposition (to prometheus)
    // 1 => main road
app.get('/', (req, res) => {
  const now = new Date();
  res.send(`today is ${formatDate(now)}`)
});

    // 2 => metric exposure route
app.get('/metrics', (req, res) => {
  /* current date display on the server
  const now = new Date();
  res.send(`today is ${formatDate(now)}`)

  why is it not possible to display several successive information ? use "next" ?

  */
  // display array metrics with the map
  const expose = metrics.map((metric) => {
    return `${metric.name} ${metric.value}` // ${metric.string}`
  }).join('\n'); // line break
  res.setHeader('Content-Type', 'text/plain') // text rendering for prometheus
  res.send(expose); // display of values on the server
});

//listening port
app.listen(port, () => {
  console.log(`Test app listening at http://localhost:${port}`)
})

// random sting in console
let r = Math.random().toString(36).substring(7);
console.log("hello", r);
// metrics = updateMetric('caracters_three', Math.random())+' '+ Math.random().toString(16).substring(3)); 
// => only one value is accepted by prometheus

////////////////////////////////////////         explanations of the "map" function      ///////////////////////////////////////////
const ex1 = [0, 1, 2, 3, 4] // array
const ex2 = ex1.map((numb) => { //"map" function passes through all the instances of the array and executes a "map" on each of them
  if (numb > 2) { // if "numb > 2, if execute its action on each of the values greater than 2" and return "0" : ext2 result
    return 0;
  }
  return numb * 2 // "else" map execute the multiplication action on values not affected by the "if"
})
// ex2 = [0, 2, 4, 0, 0]

////////////////////////////////////////         explanations of the "map" function      ////////////////////////////////////////////