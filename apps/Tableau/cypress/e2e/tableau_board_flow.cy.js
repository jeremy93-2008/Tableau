describe('Tableau Board Flow', () => {
    it('Successfully Add a Board', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardAdd]').click()

        cy.get('[data-cy=boardAddForm] form [name=name]')
            .clear()
            .type('Testing Board')
        cy.get('[data-cy=boardAddForm] form [name=description]')
            .clear()
            .type('A Description for a Testing Board')
        cy.get('[data-cy=boardAddForm] form [data-cy=boardAddSave]').click()

        cy.get('[data-cy=boardItem]').contains('Testing Board')
    })
    it('Successfully Edit a Board', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardEdit]').click()

        cy.get('[data-cy=boardEditForm] form [name=name]')
            .clear()
            .type('Testing Board Edited')
        cy.get('[data-cy=boardEditForm] form [name=description]')
            .clear()
            .type('A Description for a Testing Board Edited')
        cy.get('[data-cy=boardEditForm] form [data-cy=boardEditSave]').click()

        cy.get('[data-cy=boardItem]').contains('Testing Board Edited')
    })
    it('Successfully Perform Visual Test when Board are created', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.wait(4000)
        cy.matchImageSnapshot('tableau-board_flow_state')
    })
    it('Successfully Delete a Board', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.get('[data-cy=boardDelete]').click()

        cy.get('[data-cy=modalDeleteButton]').click()

        cy.get('[data-cy=boardItem]').should('not.exist')
    })
    it('Successfully Perform Visual Test when Board was deleted', () => {
        cy.visit('http://localhost:3000')
        cy.login()
        cy.visit('http://localhost:3000')
        cy.wait(4000)
        cy.matchImageSnapshot('tableau-board_flow_deleted_state')
    })
})
