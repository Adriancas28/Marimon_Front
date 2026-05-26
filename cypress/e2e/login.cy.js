describe('Login Marimon', () => {

  const url = 'http://localhost:5173/login';

  beforeEach(() => {
    cy.visit(url);
  });

  it('Login correcto - debe entrar a /admin', () => {

    cy.get('input[type="email"]')
      .should('be.visible')
      .clear()
      .type('admin@marimon.com');

    cy.get('input[type="password"]')
      .should('be.visible')
      .clear()
      .type('admin');

    cy.contains('button', 'Iniciar sesión')
      .should('be.enabled')
      .click();

    // 🔥 validación de éxito
    cy.location('pathname', { timeout: 10000 })
      .should('eq', '/admin');

  });


  it('Login incorrecto - debe quedarse en /login', () => {

    cy.get('input[type="email"]')
      .should('be.visible')
      .clear()
      .type('admin@marimon.com');

    cy.get('input[type="password"]')
      .should('be.visible')
      .clear()
      .type('claveincorrecta');

    cy.contains('button', 'Iniciar sesión')
      .should('be.enabled')
      .click();

    // 🔥 validación de fallo
    cy.location('pathname')
      .should('eq', '/login');

    // opcional (si tienes mensaje de error)
    // cy.contains('Credenciales incorrectas').should('be.visible');

  });

});