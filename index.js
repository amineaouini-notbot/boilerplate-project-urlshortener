require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const busboyBodyParser = require('busboy-body-parser')
const fs = require('fs')

// Basic Configuration
const port = 4000;

app.use(cors());
app.use(busboyBodyParser())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res)=>{
  let {url} = req.body;
  let isValid = url.includes('http://') || url.includes('https://')
  if(!isValid) res.json({error: "Invalid URL"})

  fs.readFile(__dirname + "/db/urls.json", (error, urls) =>{
    if (error) res.json({error})
    urls = JSON.parse(urls)
    
    if(typeof urls[url] === 'number') res.json({ original_url : url, short_url : urls[url]})
    var index = Object.keys(urls).length;
      res.json(index)
    
  })
  //res.redirect("/")
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
