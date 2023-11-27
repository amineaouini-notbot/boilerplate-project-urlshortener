require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const { json } = require('body-parser');
const bodyParser = require('body-parser');

// Basic Configuration
const port = 4000;

app.use(cors());

// parse incoming data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
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
  // if url isn't a valid website send error
  let isValid = url.includes('http://') || url.includes('https://')
  if(!isValid) res.json({ error: 'invalid url' })

  // retreive inserted urls
  fs.readFile(__dirname + "/db/urls.json", (error, data) =>{
    if (error) res.json({error})
    data = JSON.parse(data)

    // if url is already in db send response
    if(typeof data.urls[url] === 'number') res.json({ original_url : url, short_url : data.urls[url]})
    else{
      // if not inserted in in db add it
      var index = Object.keys(data.urls).length+1;
      
      data.urls[url] = index;
      data.byIndex[index] = url
      let toJson = JSON.stringify(data)

      fs.writeFileSync(__dirname + '/db/urls.json', toJson)
      let result = {
        original_url : url,
        short_url : index
      }
      res.json(result) // send result afted new url inserted
    }
    
  })
})

app.get('/api/shorturl/:short_url', (req, res)=>{
  let {short_url} = req.params;
  // get inserted urls data
  fs.readFile(__dirname + '/db/urls.json', (error, data) =>{ 
    if (error) res.json({error})
    data = JSON.parse(data)

    res.redirect(data.byIndex[short_url]) // redirect shortened url to it's path
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
