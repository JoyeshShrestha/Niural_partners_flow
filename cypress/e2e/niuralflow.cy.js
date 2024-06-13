import "cypress-mailosaur";
const emailInput = 'resalize.joyesh@gmail.com'; 

//Function that uses Mailosour to access OTP from email
const emailOTP = () => {
  cy.mailosaurGetMessage("SERVER_ID", {
    sentTo: "social-meant@nl2ocmli.mailosaur.net", 
    apiKey: Cypress.env('MAILOSAUR_API_KEY'), // Access the API key from environment variables
  }).then((email) => {
    const emailBody = email.body;
    // Regular expression to match the OTP code from the email body
    const otpMatch = emailBody.match(/Enter this code\s(\d{6})/);
    if (otpMatch) {
      const otpCode = otpMatch[1];
      cy.log(`OTP Code: ${otpCode}`);
      
      cy.get('div.outline-none:nth-child(1) > input:nth-child(1)',{timeout:60000}).type(otpCode); 

    } else {
      cy.log("OTP code not found in the email body");
    }
  });
}



//function that logins in the system
const login = (email,baseUrl) => {
  cy.session(email, () => {
    cy.visit(`${baseUrl}/auth`);
    cy.get('[data-cy="accountant-login"] > .border-2').click()
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button.py-2').click()
    cy.url({ timeout: 60000 }).should('match', /https:\/\/qa\.niural\.com\/[0-9a-fA-F-]{36}\/accountant\/dashboard/)
    

    cy.url().then((url) => {
      Cypress.env('dashboardUrl', url);
    });
  })

}


// SIGN UP SPEC
describe('Sign up spec', () => {
  const baseUrl = 'https://qa.niural.com';

  
  
  it.skip('Register as a Niural Partner', () => {
    const baseUrl = 'https://qa.niural.com'; 
  
    cy.visit(`${baseUrl}/auth/accountant/signup`);
  
    // Fill the registration form
    cy.get('input[name="firstName"]').type('Joyesh');
    cy.get('input[name="lastName"]').type('Shrestha');
    cy.get('input[name="email"]').type(emailInput);
    cy.get('input[name="companyName"]').type('Company Test');
    cy.get('input[name="companyWebsite"]').type('jo-portfolio-alpha.vercel.app');
    cy.get('#select-business-clients-number > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('5{enter}');
    cy.get('input[data-cy="input-password"]').type('Password@123');
    cy.get('input[data-cy="input-confirm-password"]').type('Password@123');
    cy.get('#select-phone-extension > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('977{enter}');
    cy.get('[data-cy="input-phone-number"]').type('9843375283');
    cy.get('[data-cy="button-next"]').click();
  
  
    
    emailOTP()
      cy.get('.py-2').click(); 
    });
  });
  



// other tests after Sign Up
describe('template spec', () => {
  const baseUrl = 'https://qa.niural.com';
  const companyName = 'Company B';
  const companyEmail = emailInput;
  const firstName = 'John';
  const lastName = 'Doe';


  beforeEach(() => {
    // cy.clearCookies();
   
    login(emailInput,baseUrl);
    
  });
  

  
//Adding new cient
  it('Add a New Client', () => {
    
    const dashboardUrl = Cypress.env('dashboardUrl');

    // Visit the dashboard URL
    cy.visit(dashboardUrl, { timeout: 60000 });
    
    
    // I had to comment this line because it doesnt appear the second time
    // cy.get('div.space-y-3:nth-child(2) > div:nth-child(2) > a:nth-child(1) > button:nth-child(1)').click();  
    
    
    // Fill client information
    cy.get('button.bg-primary-light-500').click();
    cy.get('[data-cy="input-company-name"]').type(companyName);
    cy.get('[data-cy="input-first-name"]').type(firstName);
    cy.get('[data-cy="input-last-name"]').type(lastName);
    cy.get('[data-cy="input-email"]').type('johndoes@gmail.com');
    cy.get('[data-cy="input-company-website"]').type('facebook.com');
    cy.get('#select-company-number-members > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('5{enter}');
    cy.get('#select-phone-extension > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('977{enter}');
    cy.get('[data-cy="input-phone-number"]').type('9843375283');

    cy.get('[data-cy="button-next"]',{ timeout: 60000 }).click()
    cy.url({ timeout: 20000 }).should('match', /https:\/\/qa\.niural\.com\/[0-9a-fA-F-]{36}\/accountant\/clients/);

  
  });


  // Select the client from our client list
  it('Select Client Onboarding', () => {

    const dashboardUrl = Cypress.env('dashboardUrl');

    const clientsUrl = dashboardUrl.replace('/accountant/dashboard', '/accountant/clients');
   
    cy.visit(clientsUrl, { timeout: 60000 });
  cy.window().then((win) => {
    cy.stub(win, 'open').as('open');
});



    // Find the row containing the company name within the specified CSS selector
    cy.get('.sc-dAbbOL .rdt_TableRow', { timeout: 60000 }).contains('div', companyName).then($row => {
       cy.wrap($row).click();
    });
    
   

    cy.get('@open').should('have.been.called').then((stub) => {
      const url = stub.args[0][0]; // Get the URL from the stub
      Cypress.env('onboardUrl', url);
     
  });

    

    
  });

  
  // Completes the other Clinet Onboarding 
  it('Complete Client Onboarding', () => {

    const onboardingUrl = Cypress.env('onboardUrl');
    cy.log(onboardingUrl)
    cy.visit(onboardingUrl,{timeout:120000});
   
    
    // commenting this part out because i have to run this again due to error and this part doesnt pop when I run back
    // ---------------------------------------------------------------------------------------------
    // cy.get('.py-2',{timeout:60000}).click();
    // cy.get('div.grid:nth-child(2) > button:nth-child(1) > div:nth-child(1)').click();
    // cy.get('.py-2').click();
    // ---------------------------------------------------------------------------------------------
  

    cy.get('#dropdown-country-of-registration > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp',{timeout:60000}).type('United States{enter}');
    cy.get('[data-cy="input-ein"]').type('111111111')
    cy.get('#date-registered-date').type('06-25-2023{enter}');
    cy.get('#dropdown-business-entity-type > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('LLC{enter}');
    cy.get('#dropdown-nature-of-business > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('Computer{enter}');
    cy.get('[data-cy="button-next"]').click();



    cy.get('[data-cy="input-registeredAddress-address1"]').type('New York st{enter}');

    cy.get('[data-cy="input-registeredAddress-city"]').type('New York{enter}');
    
    cy.get('[data-cy="input-registeredAddress-zipCode"]',{ timeout: 30000 }).type('10005{enter}');
    cy.get('[data-cy="button-next"]').click();

    // Type into the dropdown and select the option
    cy.get('.bg-grey-primary > :nth-child(2) > .space-x-4 > :nth-child(1) > .mt-1 > #dropdown-state > .css-jw8liv-control > .css-hlgwow > .css-ww1uop', { timeout: 30000 }).click().type('New York{enter}', { delay: 1000 });

    
    cy.get('[data-cy="button-next"]',{timeout: 30000}).click();

    cy.url().then((url) => {
      const capturedUrl = url;
      cy.log('Captured URL:', capturedUrl);
      Cypress.env('afteronboardUrl', url);
  });

  

  });



  // Verifing the Client
// I think I wrote the correct code but it runs sometimes and it doesnt in the beginning.

  it('Verify Client ', () => {
   
    const onboardingUrl = Cypress.env('onboardUrl');
    // const verifyUrl = Cypress.env('afteronboardUrl');

    const clientsUrl = onboardingUrl.replace('/company-details', '');
    cy.visit(clientsUrl,{timeout:120000});

    cy.get('button.bg-primary-light-500',{timeout:120000}).click();
    


  // Use the captured URL later in the test
  cy.get('button.py-2:nth-child(3)',{timeout:30000}).click();

    cy.get('div.border-2:nth-child(2) > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)',{timeout:60000}).click();


 // Load the file from the fixtures folder
    cy.get('input[type="file"]').should('exist').then(input => {
      const fileName = 'JoyeshShrestha2024.pdf';

      // Load the file from the fixtures folder
      cy.fixture(fileName, 'base64').then(fileContent => {
          // Convert the base64 string to a Blob
          const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
          const file = new File([blob], fileName, { type: 'application/pdf' });

          // Create a DataTransfer object and add the file to it
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          // Set the files property of the input to the file
          input[0].files = dataTransfer.files;

          // Trigger the change event on the input element
          cy.wrap(input).trigger('change', { force: true });
      });
  });



  cy.get('div.border-2:nth-child(3) > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)',{timeout:60000}).click();


  // Load the file from the fixtures folder
     cy.get('input[type="file"]').should('exist').then(input => {
       const fileName = 'JoyeshShrestha2024.pdf';
 
       // Load the file from the fixtures folder
       cy.fixture(fileName, 'base64').then(fileContent => {
           // Convert the base64 string to a Blob
           const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
           const file = new File([blob], fileName, { type: 'application/pdf' });
 
           // Create a DataTransfer object and add the file to it
           const dataTransfer = new DataTransfer();
           dataTransfer.items.add(file);
 
           // Set the files property of the input to the file
           input[0].files = dataTransfer.files;
 
           // Trigger the change event on the input element
           cy.wrap(input).trigger('change', { force: true });
       });
   });
 

    cy.get('button.py-2:nth-child(4)').click()

    cy.get('#react-select-8-input').type('CEO{enter}')
    cy.get('#react-select-9-input').type('Lawyer{enter}')
    cy.get('#react-select-10-input').type('5{enter}')
    cy.get('#react-select-11-input').type('empl{enter}')
    cy.get('#input-date').type('11-06-2000{enter}')

    cy.get('#react-select-12-input').type('United States{enter}')
    cy.get('.space-y-6 > div:nth-child(2) > input:nth-child(2)').type('New York{enter}')
    cy.get('div.space-x-4:nth-child(4) > div:nth-child(1) > input:nth-child(2)').type('New York{enter}', { delay: 1000 })
    cy.get('#react-select-13-input').type('New York{enter}')
    cy.get('.space-y-6 > div:nth-child(5) > input:nth-child(2)').type('10005')
    cy.get('.mb-4 > input:nth-child(2)').type('112121121')
    cy.get('button.py-2:nth-child(2)').click()

    cy.get('#dropdown-phone-extension > div:nth-child(3) > div:nth-child(1)',{timeout:60000}).type('977');
    cy.get('input.outline-none:nth-child(1)').type('9843375283');
    cy.get('div.outline-none:nth-child(1) > input:nth-child(1)').type('122529');
    cy.get('button.py-2:nth-child(4)').click();

    cy.get('#dropdown-business-entity-type > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('LLC{enter}');
    cy.get('#dropdown-nature-of-business > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp').type('Computer{enter}');
    cy.get('[data-cy="button-next"]').click();

    cy.get('button.w-full:nth-child(2)').click();
    cy.get('._checkboxLabel_agc6n_33').click();
    cy.get('button.bg-primary-light-500',{timeout:60000}).click();





    
  });
// Hire a US Employee
  it('Hire a US Employee', () => {
    // https://qa.niural.com/b201295b-59a9-406a-b193-0962fc156611/onboarding/welcome
    const onboardingUrlagain = Cypress.env('onboardUrl');
     cy.log(onboardingUrlagain)
    const paymentUrl = onboardingUrlagain.replace('/dashboard', '/payroll/team');
    cy.visit(paymentUrl,{timeout:120000});
    
    // cy.get('#collapsible-trigger-1718254407965 > button:nth-child(1) > div:nth-child(1)',{timeout:60000}).click();
    // cy.get('.bg-primary-subtle-focus',{timeout:60000}).click();
    // cy.get('button.bg-primary-light-500',{timeout:60000}).click();


    cy.get('[data-cy="button-hire-member"]',{timeout:60000}).click();

    cy.get('[data-cy="button-add-employee"] > .text-link-light-500 > .button1',{timeout:60000}).click();


    // div.mt-4 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)
    cy.get('div.mt-4 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)',{timeout:60000}).type('Employee');
 
     cy.get('div.mt-4 > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)',{timeout:60000}).type('One')
     cy.get('div.mt-4 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)').type('employeeone@gmail.com');
     
     cy.get('div.items-start:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)', { timeout: 30000 }).click().type('Online Teacher{enter}');
     
 
 
     // cy.get('#dropdown-work-state > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp', { timeout: 30000 }).click().type('United State{enter}');
  
  
     cy.get('#dropdown-work-state > .css-17q6p1l-control > .css-hlgwow > .css-1u6tjmp', { timeout: 30000 }).click().type('New York{enter}', { delay: 1000 });
  
  
     cy.get('input._input_1ddde_1:nth-child(2)', { timeout: 30000 }).type('1500');
     cy.get('div.space-y-1:nth-child(4) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)', { timeout: 30000 }).type('6');
 
     cy.get('#date-start-date', { timeout: 60000 }).type('2024-06-14{enter}');
  
     cy.get('button.bg-primary-light-500').click();
  

   });

  
 

// Run the payroll
  it('Run Payroll', () => {
    const onboardingUrlagain = Cypress.env('onboardUrl');
    cy.log(onboardingUrlagain)
    
    cy.visit(onboardingUrlagainUrl,{timeout:120000});
    
    cy.get('div.space-y-3:nth-child(2) > div:nth-child(2) > a:nth-child(1) > button:nth-child(1)').click();
    cy.get('.py-2').click();

    
  
    cy.get('div.p-6:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1) > button:nth-child(1) > p:nth-child(2)').click();
    cy.get('.css-17q6p1l-control').click().type('{downArrow}{enter}');
    cy.get('div.space-y-1:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)').click().type('{downArrow}{downArrow}{downArrow}{enter}');

    cy.get('div.p-6:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1) > button:nth-child(1) > p:nth-child(2)').click();
    
    cy.get('div.p-6:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1) > button:nth-child(1) > p:nth-child(2)').click();
    cy.get('div.cursor-pointer:nth-child(2) > div:nth-child(2) > button:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)').click();


  
    cy.contains('div.space-y-1:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)').click().type('{downArrow}{downArrow}{downArrow}{enter}');

    cy.get('button.py-2:nth-child(2)').click();
    cy.get('button.w-full:nth-child(2)').click();



  });
  
});

