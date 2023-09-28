context('App', () => {
  describe('Attract', () => {
    Cypress._.times(100, () => {
      it('should go to intro screen when attract screen is clicked', () => {
        cy.visit('/');
        cy.wait(2000)
          .findByTestId('attract')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/intro`);
        cy.wait(1000)
          .findByTestId('intro-closeButton')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/main`);

        cy.wait(1000)
          .get('.small-planet')
          .trigger('mousedown')
          .trigger('mousemove', { clientX: 800, clientY: 400 })
          .trigger('mouseup');
        cy.wait(1000)
          .findByTestId('help-button')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/intro`);
        cy.wait(2000)
          .findByTestId('intro-closeButton')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/main`);
        cy.wait(3000);
      });
    });
  });
});
