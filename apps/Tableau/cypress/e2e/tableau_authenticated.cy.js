describe('Tableau Authenticated State', () => {
    it('Successfully Load and Register', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=currentUser]').contains('testing_purpose', {
            matchCase: false,
        })
    })
    it('Successfully Perform Visual Test', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.wait(4000)
        cy.matchImageSnapshot('tableau-authenticated_state')
    })
})
