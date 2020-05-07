var wnd = null;
function openChartWindow(imgUrl) {
  //This function will open a popup to a given URL.
  //Set the popup size to 600x400  
  const w = 600, h = 400;
  const left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2);
  //Set our popup window options to not be resizable, but it can show scrollbars and should
  //have focus
  const wndOpts = 'scrollbars=yes,resizable=no,width='+w+',height='+h+',top='+top+',left='+left+',modal=yes,dialog=yes,alwaysRaised=yes';

  //If the global popup window is null or closed, open the new window.
  if(!wnd || wnd.closed) {
    wnd = window.open(imgUrl, 'wnd', wndOpts);
  }
}

async function findRates(ctrl) { 
  //Get the control objects to the elements on the field that we need
  let loanAmtCtrl = await elli.script.getObject('LoanAmtBox');
  let priceCtrl = await elli.script.getObject('PriceBox');
  let stateCtrl = await elli.script.getObject('StateBox');
  let loanTypeCtrl = await elli.script.getObject('LoanTypeDD');
  let minficoCtrl = await elli.script.getObject('MinFicoDD');
  let maxficoCtrl = await elli.script.getObject('MaxFicoDD');
  let rateStructureCtrl = await elli.script.getObject('LoanRateDD');
  let loanTermCtrl = await elli.script.getObject('LoanTermDD');

  //Get the values from the inputed controls  
  let loanAmt = await loanAmtCtrl.value();
  let price = await priceCtrl.value();
  //Note:  Our API will not accept ',' in the money fields, so we need to replace 
  //those with empty strings
  loanAmt = loanAmt.replace(',', '');
  price = price.replace(',', '');
  
  let state = await stateCtrl.value();
  //NOTE: The API expects that conventional is passed as Conf, so we are handling that
  //case here.
  let loanType = await loanTypeCtrl.value();
  if (loanType === 'Conventional') {
    loanType = 'Conf';
  }
  let minfico = await minficoCtrl.value();
  let maxfico = await maxficoCtrl.value();
  let rateStructure = await rateStructureCtrl.value();
  let loanTerm = await loanTermCtrl.value();

  //Get the HTTP scripting object  
  let http = await elli.script.getObject('http');
  
  //Declare our endpoint (we will be using a localhost API where our demoServer will be running)
  let rateAPI = 'https://localhost:8443/rate-checker?'
  //Build the query string that our API requires
  let queryString = 'loan_amount='+loanAmt+
    '&loan_type='+loanType+
    '&state='+state+
    '&minfico='+minfico+
    '&maxfico='+maxfico+
    '&rate_structure='+rateStructure+
    '&loan_term='+loanTerm+
    '&price='+price

  //Time to call our API, for this we are using the GET HTTP Method.  Which requires us to pass in 
  //the endpoint and any headers object.  Here we have passed the constructed API Endpoint + query params
  //along with setting our content-type header to be application/json.  
  //We then capture the response in a local variable "resp" which we will use later.
  let resp = await http.get(rateAPI+queryString, { 'Content-type' : 'application/json' });

  //Our popup window takes a URL to open.  In this case our URL is back to our demo server
  //Using the response, which was the name of the chart image to load.
  //Here we construct that url.
  let chartUrl = 'https://localhost:8443/ratechart/'+resp.body

  //Now we call to open our popup window with the proper URL.
  openChartWindow(chartUrl);
}