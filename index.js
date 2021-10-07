/*
write on oct 21 - author : benj & Max
in direction of connection between arduino/mqtt and prometheus/grafana
*/
// declaration of requires and port connection
const express = require('express')
const app = express()
const port = 3001

//function to have two digits displayed in the date with .slice : '0' + MyDate.getDate()).slice(-2)
const twoNum = (nombre) => {
  return ('0' + nombre).slice(-2)
}

/*
function to display the date on the server
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

// metrics registry : declaration of metrics in an array
let metrics = [
    { name: "initial_model", value: 1, string: "a"},
    { name: "hello_one", value: 2, string: "b" },
    { name: "world_two", value: 3, string: "c" },
    { name: "caracters_three", value: 4, string: "d"},
  ];
  
/*
internal metrics update : the metric is updated after having been processed by the function: "setInterval"
otherwise, she would return the value entered in the initial array to the server
*/
const updateMetric = (name, value, string) => {
    return metrics.map((metric) => {
      if (metric.name === name) { // what exactly does this if ? and why the other metrics are outside parentheses ?
        metric.value = value
        metric.string === string  // '==' or '===' is possible 
      }
      return metric;
    })
}
  
// uses the "random" function to retrieve a random value at the mentioned value: here a number for the value
setInterval(() => {
    // get a random integer in an open right interval
    metrics = updateMetric('hello_one', Math.floor(Math.random(min = Math.ceil(0),max = Math.floor(100)) * (100 - 0) + 0)); 
    // get a random number
    metrics = updateMetric('world_two', Math.random());
    // get random number and a random caracter : toString in base16 and don't realy undersatnd what is generating by "substring"
    metrics = updateMetric('caracters_three', Math.random() +' '+ Math.random().toString(16).substring(3)); 
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

  why is it not possible to display several successive information ?

  */ 
  // display array metrics with the map
  const expose = metrics.map((metric) => {
    return `${metric.name} ${metric.value} ${metric.string}`
  }).join('\n'); // line break
  res.setHeader('Content-Type', 'text/plain') // text rendering for prometheus
  res.send(expose); // display of values on the server
});

// random sting in console
let r = Math.random().toString(36).substring(7); 
console.log("hello", r);

//listening port
app.listen(port, () => {
  console.log(`Test app listening at http://localhost:${port}`)
})