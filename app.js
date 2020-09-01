var express = require("express");

var app = express();

app.listen(3030, () => {
 console.log("Server running on port 3000");
});

app.get("/", (req, res, next) => {
  res.send("Node is Working");
})

app.get("/generate", (req, res, next) => {

  let data = {
    server: req.query.name,
    ansible_host: req.query.ip,
    ansible_connection: 'ssh',
    ansible_ssh_user: 'root',
    ansible_ssh_pass: req.query.password,
    ansible_become_user: 'root',
    ansible_become_pass: req.query.password
  };

  const fs = require('fs');
  const yaml = require('js-yaml');

  let yamlStr = yaml.safeDump(data);
  let fileName = "yaml/" + req.query.name + '.yaml';
  fs.writeFileSync(fileName, yamlStr, 'utf8');

    res.setHeader('Access-Control-Allow-Origin', req.protocol + "://" + req.hostname + ":3000" );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.send({data : "success"});

 });

 app.get("/generateAll", (req, res, next) => {
  
  let data = [];

  for ( let i = 0; i< req.query.rows.length; i++) {
    
    let row = JSON.parse(req.query.rows[i]);

    data.push(row);
  }

  const fs = require('fs');
  const yaml = require('js-yaml');

  let yamlStr = yaml.safeDump(data);
  let fileName = 'yaml/all-servers.yaml';
  fs.writeFileSync(fileName, yamlStr, 'utf8');

  res.setHeader('Access-Control-Allow-Origin', req.protocol + "://" + req.hostname + ":3000");

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);


  res.send({data : "success"});


 });

app.get("/log", (req, res, next) => {

  const log = require('log-to-file');
  
  log(req.query.log, 'logFile.log');

  res.setHeader('Access-Control-Allow-Origin', req.protocol + "://" + req.hostname + ":3000");

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);


  res.send({data : "success"});

});

app.get("/import", (req, res, next) => {

  const fs = require('fs');
  const yaml = require('js-yaml');

  try {
      let fileContents = fs.readFileSync('./data.yaml', 'utf8');
      let data = yaml.safeLoad(fileContents);

      console.log(data);
  } catch (e) {
      console.log(e);
  }

});