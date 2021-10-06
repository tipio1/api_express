
// declaration of express require
var express = require('express');
var app = express();

//declaration of date
var dateday = function (req, res, next) {
  var d = new Date();
  var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  var hours = d.getHours() + " h " + d.getMinutes() + " et " + d.getSeconds() + " sec" ;
  var fullDate = date+' '+hours;
  req.dateday = new Date();
  console.log(fullDate);
  next();
};

//declaration of request date = not understand his value
var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

//call/use functions
app.use(requestTime);
app.use(dateday);

//script run
app.get('/metrics', function (req, res, next) {
  var responseText = 'Hello date!';
  responseText += ' ' + req.dateday + ' ' + ' Requested at: ' + req.requestTime + ' ';
  res.send(responseText);
  next();
});

//listening port
app.listen(3001);

