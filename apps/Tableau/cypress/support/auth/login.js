export function loginViaAuth0() {
    cy.visit('http://localhost:3000')

    cy.get('[data-cy=signIn]').click()

    cy.origin('https://dev-x2lhncgfa7nsb6jp.us.auth0.com', () => {
        cy.get('input#username').type('testing_purpose@cypress.com')

        cy.get('button[value=default]').contains('Continue').click()

        cy.get('input#password').type('Testing_Purpose_2023', { log: false })

        cy.get('button[value=default]').contains('Continue').click()
    })
}
