describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('successfully loads', () => {})

  it('has the brand name', () => {
    cy.get('header').contains(`Forex Rates Service`)
  })

  it('has an input field for entering a price', () => {
    cy.get('input').should('have.class', 'price-input-field')
  })

  it('has a label for the input field', () => {
    cy.get('label').contains(`Enter a price in £GBP up to 4 decimal places`)
  })

  it('has a button for submitting a price', () => {
    cy.get('button').should('have.id', 'Search')
  })

  it('captures the price entered by the user', () => {
    cy.get('input').type('10.00')
    cy.get('input').should('have.value', '10.00')
  })

  it('clears the input value when the user hits enter', () => {
    cy.get('input').type('10.00{enter}')
    cy.get('input').should('have.value', '')
  })

  it('clears the input value when the user clicks the submit button', () => {
    cy.get('input').type('10.00')
    cy.get('button').click()
    cy.get('input').should('have.value', '')
  })

  it('displays the result when the user submits a price', () => {
    cy.get('input').type('10.00{enter}')
    cy.wait(500)
    cy.get('input').type('21.10')
    cy.get('button').click()
    cy.get('tbody > tr').should($trs => {
      expect($trs).to.have.length(2)
      expect($trs.eq(0)).to.contain('10')
      expect($trs.eq(1)).to.contain('21.1')
    })
  })
})
