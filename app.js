var express = require("express");

var app = express();

app.listen(3030, () => {
 console.log("Server running on port 3000");
});

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

 });

 app.get("/generateAll", (req, res, next) => {
  
  let data = [];

  for ( let i = 0; i< req.query.rows.length; i++) {
    
    let row = JSON.parse(req.query.rows[i]);

    data.push({
      server: row.name,
      ansible_host: row.ip,
      ansible_connection: 'ssh',
      ansible_ssh_user: 'root',
      ansible_ssh_pass: row.password,
      ansible_become_user: 'root',
      ansible_become_pass: row.password
    })
  }

  const fs = require('fs');
  const yaml = require('js-yaml');

  let yamlStr = yaml.safeDump(data);
  let fileName = 'yaml/all-servers.yaml';
  fs.writeFileSync(fileName, yamlStr, 'utf8');

 });

app.get("/log", (req, res, next) => {

  console.log(req.query.log);

  const log = require('log-to-file');
  
  log(req.query.log, 'logFile.log');

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