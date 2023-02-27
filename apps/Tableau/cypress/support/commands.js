/// <reference types="cypress" />
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'
import { loginViaAuth0 } from './auth/login'

addMatchImageSnapshotCommand()

Cypress.Commands.add('login', () => {
    cy.session(
        `auth0-testing`,
        () => {
            loginViaAuth0()
        },
        {
            validate: () => {
                cy.getCookie('next-auth.session-token').should('exist')
            },
            cacheAcrossSpecs: true,
        }
    )
})
