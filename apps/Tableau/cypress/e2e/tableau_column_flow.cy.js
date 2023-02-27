describe('Tableau Column Flow', () => {
    it('Successfully Add a Board', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardAdd]').click()
        cy.get('[data-cy=boardAddForm] form [name=name]')
            .clear()
            .type('Testing Board for Use')
        cy.get('[data-cy=boardAddForm] form [name=description]')
            .clear()
            .type('A Description for a Testing Board')
        cy.get('[data-cy=boardAddForm] form [data-cy=boardAddSave]').click()
        cy.get('[data-cy=boardItem]').contains('Testing Board for Use')
    })
    it('Successfully Add a Column', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardItem]').click()
        cy.get('[data-cy=columnAdd]').click()
        cy.get('[data-cy=columnAddForm] form [name=statusName]')
            .clear()
            .type('Testing')
        cy.get('[data-cy=columnAddSave]').click()
        cy.get('[data-cy=columnItem] p').contains('Testing')
    })
    it('Successfully Edit a Column', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardItem]').first().click()
        cy.get('[data-cy=columnItem]')
            .contains('Testing')
            .first()
            .click()
            .get('[data-cy=columnEdit]')
            .click()
        cy.get('[data-cy=columnEditForm] form [name=statusName]')
            .clear()
            .type('Testing Edited')
        cy.get('[data-cy=columnEditSave]').click()
        cy.get('[data-cy=columnItem] p').contains('Testing Edited')
    })
    it('Successfully Move a Column', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardItem]').first().click()
        cy.get('[data-cy=columnItem]')
            .contains('Testing Edited')
            .first()
            .click()
            .get('[data-cy=columnMoveLeft]')
            .click()
        cy.get('[data-cy=columnMoveLeft]')
            .should('have.attr', 'data-order')
            .and('match', /2/)
    })
    it('Successfully Perform Visual Test when Column are created', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.wait(4000)
        cy.matchImageSnapshot('tableau-board_column_state')
    })
    it('Successfully Delete a Column', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardItem]').first().click()
        cy.get('[data-cy=columnItem]')
            .contains('Testing Edited')
            .first()
            .click()
            .get('[data-cy=columnEdit]')
            .click()
        cy.get('[data-cy=columnDeleteSave]').click()
        cy.get('[data-cy=modalDeleteButton]').click()
        cy.get('[data-cy=columnItem] p').should(
            'not.have.text',
            'Testing Edited'
        )
    })
})
