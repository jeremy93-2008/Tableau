describe('Tableau Default State', () => {
    it('Successfully Load in the expected state', () => {
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=signIn]').contains('Sign in', { matchCase: false })
    })
    it('Successfully Perform Visual Test', () => {
        cy.visit('http://localhost:3000')
        cy.wait(4000)
        cy.matchImageSnapshot('tableau-default_state')
    })
})
