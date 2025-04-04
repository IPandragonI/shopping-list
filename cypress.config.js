import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        supportFile: false, // ← désactive le fichier support par défaut
        specPattern: "cypress/e2e/**/*.cy.js",
    },
});