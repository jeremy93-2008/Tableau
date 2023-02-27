import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin'

export default defineConfig({
    chromeWebSecurity: false,
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            require('@cypress/code-coverage/task')(on, config)
            // include any other plugin code...
            addMatchImageSnapshotPlugin(on, config)
            // It's IMPORTANT to return the config object
            // with any changed environment variables
            return config
        },
    },
})
