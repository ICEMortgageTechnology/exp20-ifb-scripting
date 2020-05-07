# Step 3: Custom scripting and the EllieMae Scripting Framework (basic)
In this step we will wire up the Find Rates button utilizing the EllieMae Scripting Framework to access loan fields and conduct API calls.

# Instructions
1. On your form in the builder and click on the <> code icone to open the code editor.  You are now ready to start writing custom code for your form.  
NOTE: Alternatively you can write the code in your favorite javascript editor and then paste it into the code editor.


2. Create a function findRates.  This will be an asynchronous function and as it will be associated to a UI Control, specifically the find rates button, it will take a parameter of "ctrl".
```javascript
async function findRates(ctrl) { 

}
```

3. Our API that we are going to call requires us to pass in the loan amount, house price, state, loan type, min fico, max fico, loan rate and loan terms.  To do this we will need to use the EllieMae Scripting Framework to get the Control objects so that we can pull down their values. 

```javascript
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
}
```

4. Now we will setup our API call.  For this we will use the HTTP object from the EllieMae Scripting Framework.
```javascript
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
}
```

5. Associate your new function to your "find rates" button's onClick event.
![Alt text](./step3.png?raw=true)

6. Start your demo server so you can test your code.
	a) Please make sure that you have NODE installed.  If not, you will need to do this.
	b) In this repo you will find a "demoServer" folder.  Open a console / terminal window and navigate to it.
	c) Install the required NPM modules by running "npm install".  NOTE:  The highcharts module will ask you some questions.  You willneed to agree to the license, but you only need the basics and can answer N to the rest.
	d) To run the server, type "node server.js"

_NOTE: To be safe and ensure you won't get an SSL issue, you may want to visit: https://localhost:8443/ and accept the SSL safety message._

7. Now in the LO Connect Admin, enable your form (if it isn't already).  Then navigate to the a loan within LO Connect.  Once there, you can view the form by going to `Forms > Custom Input Forms > Mortgage Rate Explorer - Step1` NOTE: if you've changed the name or are using the zip from this step, make sure to use that name in your navigation.  Now that you are there, open your developer console so you can see the request/response of your API.  Fill out the form and click "Find Rates".

![Alt text](./step3.7.png?raw=true)

You are now ready to proceed to step 4.
