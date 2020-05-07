const express = require('express');
const app = express();
const https = require('https');
const port = 8443;
const fs = require('fs');
const requestModule = require('request');
const chartExporter = require("highcharts-export-server");

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization, X-Token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

let options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
  ca: fs.readFileSync('./certs/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};

const server = https.createServer(options, app);
server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`);
});

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})

app.get('/ratechart/:name', (request, response) => {
  let imagPath = './charts/'+request.params.name+'.png';
  if (fs.existsSync(fs.realpathSync(imagPath))) {
    response.sendFile(fs.realpathSync(imagPath));
  } else {
    response.status('404').send('Chart not found');
  }


});

app.get('/rate-checker', (request, response) => {
  let paramsStr = 'loan_amount='+request.query.loan_amount+
    '&loan_type='+request.query.loan_type+
    '&state='+request.query.state+
    '&minfico='+request.query.minfico+
    '&maxfico='+request.query.maxfico+
    '&rate_structure='+request.query.rate_structure+
    '&loan_term='+request.query.loan_term+
    '&price='+request.query.price

    callExternalRateChecker(paramsStr).then((res) => {
      console.log("response code: " + res.body);
      let data = JSON.parse(res.body);
      let chartName = 'bar';
      try {
        createChart(data.data, chartName, response);
      } catch (err) {
        response.status('500').send('Something went wrong - ' + error);
      }
    }).catch((error) => {
      response.status('500').send('Something went wrong - ' + error);
    });    
});

function callExternalRateChecker(params) {
  return new Promise((resolve, reject) => {
    requestModule({
        headers: {
          'accept': 'application/json, */*',
        },
        uri: 'https://www.consumerfinance.gov/oah-api/rates/rate-checker?' + params,
        method: 'GET'
      }, function (error, response, body) {
        console.log("response code: " + response.statusCode);
        if (!error && response.statusCode === 200) {
          resolve(response);
        } else {
          reject({ error: error, response: response });
        }
      }) 
    }); 
}

function createChart(data, chartName, response) {
  console.log('creating chart');
  // Initialize the exporter
  chartExporter.initPool();
  // Chart details object specifies chart type and data to plot
  let chartDetails = {
     type: "png",
     options: {
         chart: {
             type: "column"
         },
         title: {
             text: "Heading of Chart"
         },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
         xAxis: {
          categories: Object.keys(data)
        },
        yAxis: {
          min: 0,
          title: {
              text: 'Lenders (count)'
          }
       },
         series: [
             {
                name: 'rates',
                data: Object.values(data)
             }
         ]
     }
  };

  console.log('exporting chart');
  try {
    chartExporter.export(chartDetails, (err, res) => {
     // Get the image data (base64)
     let imageb64 = res.data;
     // Filename of the output
     let outputFile = './charts/' + chartName + '.png';
     // Save the image to file
     fs.writeFileSync(outputFile, imageb64, "base64", function(err) {
         if (err) {
          console.log(err);
          throw err;
        }
     });
     console.log("Saved image!");
     chartExporter.killPool();
     response.send(chartName);
    });
  } catch (err) {
    throw err;
  }
}
