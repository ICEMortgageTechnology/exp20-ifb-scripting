# Step 2: Using Web-IFB for laying out elements (basic)
Next, we will finalize our form's layout by adding the additional fields and then binding those to our loan.  

# Instructions
Follow the steps below to complete this step. The files in this folder provide the initial form image you'll need for this step.

1. For the property address group box we will add a new textbox between the city and zip.  Give this field a label of "State" and then associate (bind) it to encompass field ID: 14 (Subject Property State).  For asthetics you should also set this to a column width of 3.  Finally, so this has an easy/unique control ID for us to use later, rename the control id to StateBox. 

2. For the loan details group box we'll add a new textbox for Loan House Price and bind that to encompass field ID:  136 (Trans Details Purchase Price).  We should place this before the %Down textbox. Adn for asthetics give it a column width of 6.  You may also want to select the $ symbol in the textbox since this is a money field.  Finally, so this has an easy/unique control ID for us to use later, rename the control id to PriceBox. 

3. Back in the loan details group box we'll need to add an additional label and textbox to capture the total loan amount.  In this case we are not using the text boxes label, but are instead adding a label on the left.  
	Once you add the label element, you can select remove top row.  
	You will also want to set the column to a size of 3 so the whole text will fit.
	For the textbox, we will select Remove Label = YES.  Then we will choose the $ symbol as this is a money field.  The textbox field will bound to encompass field ID 1109 (Trans Details Loan Amt). 
	Finally, so this textbox has an easy/unique control ID for us to use later, rename the control id to LoanAmtBox. 

Your form is now complete and ready for you to move onto step 3.
