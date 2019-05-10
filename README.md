### Build Status
[![Build Status](https://travis-ci.org/FergusLemon/FrontEndTest.svg?branch=master)](https://travis-ci.org/FergusLemon/FrontEndTest)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)

### Overview

A simple website that allows users to enter an amount in £GBP and retrieve the equivalent amounts in $USD and €EUR, the results are displayed on screen and the user can sort them in ascending order.  A third party service is used for the currency conversions.  The website is avaiable [here](https://forexratesconversion.herokuapp.com/).

![Forex Service Homepage](/public/homepage.jpg)

#### Design Decisions

Certain design decisions were made which are easily changeable should the client want.  The maximum number of digits a user can enter into the search field is 12 followed by a maximum of 4 decimal places.  The response from the third party service is also trimmed to 4 decimal places.  These decisions were primarily made for formatting and styling purposes.

### Installation

`git clone https://github.com/FergusLemon/FrontEndTest.git`

`cd` into the `FrontEndTest` dir.

Run `npm install` to install dependencies.

Run `npm run build` to create an optimised production build.

Run `npm start` to start serving the app on port 3000.

Visit `http:\\localhost:3000` in your favourite browser if it hasn't already opened for you.

### Testing

All tests can be run from the root directory.

Unit tests - Jest and Enzyme

`npm test` hit `a` to run all tests if nothing happens.

Functional tests - Cypress

`npm start`
`npm run cypress:open` then hit `run all tests` in the Cypress window that opens up.

### Technology

Languages - Javascript

Front End - React, CSS

Back End - Axios (for API calls)

### Some ways to improve

Better styling.

Better test coverage and testing of edge cases.

Allow users to sort the results in descending order.
