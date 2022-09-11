const { log, error } = console;
const express = require('express');
const app = express();
const server = app.listen(3000, log('Proxy server is running on port 3000'));
const got = require('got');
const cors = require('cors');
const crypto = require('crypto');
const buffer = require('buffer');
const connectUtils =require("./connectUtils");
const { Console } = require('console');

// Create a private key
const { privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});


// API for get all data with paramter token name ex: http://127.0.0.1:3000/MATICUSDT
app.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const resp =  await connectUtils.findByName(name);  
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).send(err);
  }
});


// API for get signed data with paramter multi token name split with coma and date  ex: http://127.0.0.1:3000/MATICUSDT,BNBUSDT\2022-09-11T20:54:30.613Z
app.get('/:names/:time_', async (req, res) => {
  try {
    const { names ,time_} = req.params;
    console.log(names,"hhhhhhh");
    const namelist = names.split(",");
    const resp =  await connectUtils.findByNameList(namelist,time_); 
    
    // Convert Stringified json data to buffer 
    const data = Buffer.from( JSON.stringify(resp) );
  
    // Sign the data and returned signature in buffer 
    const sign = crypto.sign("SHA256", data , privateKey);
      
    // Convert returned buffer to base64
    const signature = sign.toString('base64');

    res.status(200).json(signature);
  } catch (err) {
    res.status(500).send(err);
  }
});


// API for verifying signed data  
// app.get('/:signature/:names/:time_', async (req, res) => {
//   try {
//     const { signature,names ,time_} = req.params;
//     const namelist = names.split(",");
//     const resp =  await connectUtils.findByNameList(namelist,time_); 
    
//     const isVerified = crypto.verify(
//       "sha256",
//       Buffer.from(resp),
//       {
//         key: publicKey,
//         padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
//       },
//       signature
//     );
    
//     // isVerified should be `true` if the signature is valid
//     console.log("signature verified: ", isVerified);

//     res.status(200).json(isVerified);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

