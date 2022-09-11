const { log, error } = console;
const express = require('express');
const got = require('got');
const cors = require('cors');
const connectUtils =require("./connectUtils");
const CronJob = require('cron').CronJob;

tokens=['BNBUSDT','ETHUSDT','MATICUSDT']
interval='1m';

// This function fetches price data for tokens(ETH, MATIC, BNB) every 10 seconds
const queue = new CronJob({
    cronTime: '*/10 * * * * *',  
    onTick: function() {
      console.log('<=============start fetches data ==========>',new Date());

      tokens.forEach(async function(name){
        try {
      
          const resp = await got(
            `https://api.binance.com/api/v3/klines?symbol=${name}&interval=${interval}`
          );
          const data = JSON.parse(resp.body);
          let lastdata=data[data.length-1];
          await connectUtils.save(name,lastdata[4] * 1,new Date());  
          
        } catch (err) {
          console.log(err)
        }
      });
      
    },
    start: false,
    timeZone: 'Asia/Calcutta'
  });
  
  queue.start();