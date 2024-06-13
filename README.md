# Niural Partner Flow Cypress Automation

This repository contains Cypress automation tests for the Niural Partner Flow. The tests cover various aspects of the user flow to ensure the application works as expected.

Link to the recorded test : https://drive.google.com/drive/folders/1dPZyEGrcaLQw4MqKvzoCrAcHn3CZtXYl?usp=sharing

## Getting Started

Follow the steps below to set up and run the Cypress automation tests.

### Prerequisites

- Node.js (https://nodejs.org/)
- npm (https://www.npmjs.com/)
- Cypress (https://www.cypress.io/)
- Mailosour(npm install cypress-mailosaur)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JoyeshShrestha/Niural_partners_flow/tree/main

   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Tests

1. Open Cypress Test Runner:

   ```bash
   npx cypress open
   ```

2. In the Cypress Test Runner:
   - Click on **E2E Testing**.
   - Select **Google Chrome** as the browser.
   - Click on `niural.flow.cy.js` to run the test.

### Notes

- Ensure that the Niural Partner Flow application is accessible and running before executing the tests.
- The test stability can be influenced by the network speed and the server response time.

### Challenges and Learning

This project was a significant learning experience as it was my first time working with Cypress. The tests occasionally fail due to website load issues or other external factors. Despite these challenges, I have done my best to create a reliable automation flow.
