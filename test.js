/*
write on Oct 21 - author : benj
test with hello world
*/
const express = require('express')
const app = express()
const port = 3001


app.get('/metrics', (req, res) => {
  res.send('Hello express test!')
});

// app.use('/metrics', express.static('/home/pi/express_apps/metrics'));

/*app.get('/', (req, res) => {
  res.send('Hello test express!');
});*/

app.listen(port, () => {
  console.log(`Test app listening at http://localhost:${port}`)
})
