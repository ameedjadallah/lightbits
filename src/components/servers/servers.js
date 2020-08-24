import React from 'react';
import { FaDownload, FaTrash } from 'react-icons/fa';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';

import './servers.css';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function createData(name, ip, password) {
  return { name, ip, password };
}


class Servers extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      rows: [
      ],
      showModal: false,
      open : false,
      name: 'server0',
      ip: '',
      password: 'testpass',
      range1: '',
      range2:'',
      isValidIp : true,
      isValidRange1 : true,
      isValidRange2 : true,
      isValidServerName: true,
      successMesssage: '',
      success: false,
      serverURL: "http://"+ window.location.hostname + ":3030",
      headers: {
        'Access-Control-Allow-Origin' : window.location.href,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers':  'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
      }
    };
  }

  onInputchange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    

    if (event.target.name === "name") {
      this.isServerNameValid(event.target.value);
    }
  }

  ValidateServerName = (server) => {
    
    if (server.startsWith("server0")) {
      
      return (true)
    } else {
      
      return (false);
    }
  }
  
  ValidateIPaddress = (ipaddress) => {
    if (/^(25[0-5]|2[0-4][0-9]|1[0-4][0-9]|[01]?[1-9][0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1[0-4][0-9]|[01]?[1-9][0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1[0-4][0-9]|[1]?[1-9][0-9][0-9]?)\.(25[1-5]|2[0-4][0-9]|1[0-4][0-9]|[1]?[1-9][0-9]?)$/.test(ipaddress) || !ipaddress.length) {  
      return (true)  
    }
    return (false)  
  }
  
  isIpValid = (ipaddress) => {  
    this.setState(state => {
      const isValidIp = this.ValidateIPaddress(ipaddress);
 
      return {
        isValidIp
      };
    }); 
  }
  
  isRange1Valid = (ipaddress) => {
    this.setState(state => {
      const isValidRange1 = this.ValidateIPaddress(ipaddress);
 
      return {
        isValidRange1
      };
    }); 
  }

  isRange2Valid = (ipaddress) => {
    this.setState(state => {
      const isValidRange2 = this.ValidateIPaddress(ipaddress);
 
      return {
        isValidRange2
      };
    }); 
  }

  isServerNameValid = (server) => {
    this.setState(state => {
      const isValidServerName = this.ValidateServerName(server);

      return {
        isValidServerName
      }
    })
  }

  handleIP = (event) => {
    let newValue = event.target.value;
    let length = newValue.length;
    let index = newValue.lastIndexOf('.') + 1;
    let noOfDots = newValue.split('.').length - 1;
    let updatedVal = '';
    if (length !== index && noOfDots < 3 && this.state.ip.length < length && (length - index)%3 === 0) {
      updatedVal = newValue + '.';

    } else if (noOfDots > 3 || length - index > 3) {
      // let newString = newValue.substrint(0, length-1);
       //updatedVal = newValue;
    } else {
      updatedVal = newValue
    }
    this.isIpValid(updatedVal);
    this.setState({ip: updatedVal});
  }

  handleRange1 = (event) => {
    let newValue = event.target.value;
    
    let length = newValue.length;
    let index = newValue.lastIndexOf('.') + 1;
    let noOfDots = newValue.split('.').length - 1;
    let updatedVal = '';
    if (length !== index && noOfDots < 3 && this.state.ip.length < length && (length - index)%3 === 0) {
      updatedVal = newValue + '.';

    } else if (noOfDots > 3 || length - index > 3) {
      // let newString = newValue.substrint(0, length-1);
       //updatedVal = newValue;
    } else {
      updatedVal = newValue
    }
    //this.ValidateIPaddress(updatedVal);
    this.isRange1Valid(updatedVal);
    this.setState({range1: updatedVal});
  }

  handleRange2 = (event) => {
    let newValue = event.target.value;
    
    let length = newValue.length;
    let index = newValue.lastIndexOf('.') + 1;
    let noOfDots = newValue.split('.').length - 1;
    let updatedVal = '';
    if (length !== index && noOfDots < 3 && this.state.ip.length < length && (length - index)%3 === 0) {
      updatedVal = newValue + '.';

    } else if (noOfDots > 3 || length - index > 3) {
      // let newString = newValue.substrint(0, length-1);
       //updatedVal = newValue;
    } else {
      updatedVal = newValue
    }
    //this.ValidateIPaddress(updatedVal);
    this.isRange2Valid(updatedVal);
    this.setState({range2: updatedVal});
  }

  generateAllYaml = () => {
    const state = this.state;
    
    axios.get(`${state.serverURL}/generateAll`,{
        params: {
          rows: state.rows
        }
      })
      .then(res => {
        this.showSuccessMessage("YML file is generated for all servers");
      })   
  }

  generateYamlFile(server) {
    const state = this.state;

    axios.get(`${state.serverURL}/generate`,{
        params: {
          name: server.name,
          ip: server.ip,
          password: server.password
        }
      })
      .then(res => {
        this.showSuccessMessage("Yaml file generated successfully");
      })
  }

  addServer = () => {
    // show add modal
    const state = this.state;

    if ( !state.isValidServerName || !state.isValidIp || !state.isValidRange1 || !state.isValidRange2 ) {
      return;
    }

    if ( state.range1.length !== 0 && state.range2.length !== 0 ) {

      // get last digit in range 1
      let range1 = state.range1;
      let range2 = state.range2;
      let lastIndexRange1 = range1.lastIndexOf(".");
      let lastIndexRange2 = range2.lastIndexOf(".");
      let startRange = parseInt(range1.substring(lastIndexRange1+ 1));
      let endRange = parseInt(range2.substring(lastIndexRange2+ 1));

      let range = range1.substring(0,range1.lastIndexOf(".")+1);

      for (let i = startRange; i<= endRange; i++ ) {
        let newServer = createData(state.name + "" + (i-1), range + "" + i, state.password);
        this.setState(state => {
          const rows = state.rows.concat(newServer);
          return {
            rows
          };
        });

        axios.get(`${state.serverURL}/generate`,{
          params: {
            name: state.name + "" + (i-1),
            ip: range + "" + i,
            password: state.password
          }
        })
        .then(res => {
          console.log(res);
        })

        this.logServer("added",newServer);
        this.logServer(undefined,"ansible -i hosts all -m ping");
        
      }
      this.handleClose();

    } else {
      // add to servers list
      const state = this.state;
      let newServer = createData(state.name, state.ip, state.password);
      this.setState(state => {
        const rows = state.rows.concat(newServer);
   
        return {
          rows
        };
      });

      
      this.logServer("added",newServer);
      this.logServer(undefined,"ansible -i hosts all -m ping");


      this.handleClose();
    }

    this.showSuccessMessage("server's added successfully");

  }
  
  handleOpen = () => {
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  removeServer = (index) => {
    var array = [...this.state.rows]; // make a separate copy of the array
    if (index !== -1) {
      this.logServer("deleted",this.state.rows[index]);
      array.splice(index, 1);
      this.setState({rows: array});
      this.showSuccessMessage("server deleted successfully");
    }
  }

  logServer(status, server) {
    const state = this.state;
    let logMessage = status === undefined ? "ansible -i hosts all -m ping" : status + " " + server.name + " , ip:" + server.ip;

    axios.get(`${state.serverURL}/log`,{
        params: {
          log: logMessage
        }
      })
      .then(res => {
        console.log(res);
      })
  }

  showSuccessMessage = (message) => {
    this.setState({
      success: true,
      successMesssage : message
    });
    setTimeout(()=> {
      this.setState({
        success: false,
        successMesssage : ''
      });
    }, 4000);
  }
  
  render(){

    return (

      <div className="servers">

        { this.state.success && 
          <div className="alert-section">
            <Alert severity="success">{this.state.successMesssage}</Alert>
          </div>
        }
        


        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className="dialog-section"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Add Server"}</DialogTitle>
          <DialogContent>
            
          
            <TextField
              margin="dense"
              id="name"
              label="Server Name"
              type="text"
              name="name"
              fullWidth
              value={this.state.name}
              onChange={this.onInputchange}
            />
            {!this.state.isValidServerName && <Alert severity="error">Server name should start with <b>(server0)</b></Alert>}
            


            <TextField
              margin="dense"
              id="server-ip"
              name="ip"
              label="Server IP"
              type="text"
              fullWidth
              value={this.state.ip}
              onChange={this.handleIP}
            />

            {!this.state.isValidIp && <Alert severity="error">Invalid IP Address</Alert>}
          
            <div className="dialog-divider">OR Add ip range</div>
            <div className="d-flex justify-between range-fields">
              <div>
                <TextField
                  margin="dense"
                  id="range-1"
                  label="Range 1"
                  type="text"
                  name="range1"
                  value={this.state.range1}
                  onChange={this.handleRange1}
                />
                {!this.state.isValidRange1 && <Alert severity="error">Invalid IP Address</Alert>}
              </div>

              <div>
                <TextField
                  margin="dense"
                  id="range-2"
                  label="Range 2"
                  type="text"
                  name="range2"
                  value={this.state.range2}
                  onChange={this.handleRange2}
                />
                {!this.state.isValidRange2 && <Alert severity="error">Invalid IP Address</Alert>}
              </div>
              
              
            </div>

            <TextField
              margin="dense"
              id="server-password"
              label="Server Password"
              type="password"
              name="password"
              fullWidth
              value={this.state.password}
              onChange={this.onInputchange}
            />
            <small><b>Note:</b> password will set "testpass" as default pass if you left this field empty</small>

            
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.addServer} variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>


        <div className="servers-header d-flex justify-between align-center ">
          <h2 className="header-title">Servers</h2>
          <ul className="header-actions d-flex">
            <li className="item">
            <Button onClick={this.handleOpen} color="primary" variant="contained">
              Add
            </Button>
            </li>
            <li className="item">
            <Button onClick={this.generateAllYaml} color="default" variant="contained" disabled={!this.state.rows.length}>
              Export to YML
            </Button>
            </li>
          </ul>
        </div>
  
        <div className="servers-list">
          {this.state.rows && 
          <TableContainer component={Paper}>
          <Table className="table" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Server Name</TableCell>
                <TableCell align="left">Server IP</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row" align="left">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.ip}</TableCell>
                  <TableCell align="right">
                  <Tooltip title="Export to yaml file">
                    <Button onClick={this.generateYamlFile.bind(this, row)} color="primary">
                      <FaDownload/>
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete server">
                    <Button onClick={this.removeServer.bind(this, index)} color="secondary">
                      <FaTrash/>
                    </Button>
                  </Tooltip>
                    
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          }
          {!this.state.rows.length && <div className="empty-list">No Servers Added Yet</div> }
        
        </div>
      </div>
    );
  }
}

export default Servers;
