### Build Status
[![Build Status](https://travis-ci.org/FergusLemon/FrontEndTest.svg?branch=master)](https://travis-ci.org/FergusLemon/FrontEndTest)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)

### Overview

A simple website that allows users to enter an amount in £GBP and retrieve the equivalent amounts in $USD and €EUR, the results are displayed on screen and the user can sort them in ascending order.  A third party service is used for the currency conversions.  The website is avaiable [here](https://forexratesconversion.herokuapp.com/).

![Forex Service Homepage](/public/homepage.jpg)

### Installation

`git clone https://github.com/FergusLemon/FrontEndTest.git`

`cd` into the `capco-front-end` dir.

Run `npm install` to install dependencies.

Run `npm run build` to create an optimised production build.

Run `npm start` to start serving the app on port 3000.

Visit `http:\\localhost:3000` in your favourite browser if it hasn't already opened for you.

### Testing

Unit tests - Jest and Enzyme

Functional tests - Cypress

### Technology

Languages - Javascript

Front End - React, CSS

Back End - Axios (for API calls)
