describe('Crear Producto - E2E Marimon', () => {

  const loginUrl = 'http://localhost:5173/login';
  const adminUrl = 'http://localhost:5173/admin';
  const productsUrl = 'http://localhost:5173/admin/productos';

  beforeEach(() => {
    // 1. Interceptamos las peticiones API a /api/producto para que el test corra de forma aislada y exitosa.
    // Esto simula las respuestas del backend y evita depender de una base de datos real activa.
    
    // Simula la carga inicial de productos (lista vacía)
    cy.intercept('GET', '/api/producto', {
      statusCode: 200,
      body: []
    }).as('getProductos');

    // Simula la creación exitosa de un producto
    cy.intercept('POST', '/api/producto', {
      statusCode: 200,
      body: {
        id: 999,
        nombre: 'Amortiguador Premium E2E',
        descripcion: 'Amortiguador reforzado de alta duración para pruebas de Cypress.',
        precio: 249.99,
        stock: 15,
        imagen: 'https://placehold.co/300x300?text=Amortiguador'
      }
    }).as('createProducto');

    // 2. Visitamos la página de login
    cy.visit(loginUrl);

    // 3. Iniciamos sesión como administrador
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

    // 4. Validamos que entramos al Admin Dashboard
    cy.location('pathname', { timeout: 10000 })
      .should('eq', '/admin');
  });

  it('Debe navegar a Productos, abrir el modal, rellenar el formulario y crear el producto con éxito', () => {
    // 1. Hacemos click en la tarjeta de PRODUCTOS en el Dashboard
    cy.get('a[href*="/admin/productos"]')
      .should('be.visible')
      .click();

    // 2. Validamos que estamos en la sección de Productos
    cy.location('pathname')
      .should('eq', '/admin/productos');

    // Esperamos a que la petición GET de productos ocurra
    cy.wait('@getProductos');

    // 3. Hacemos click en el botón de Registrar Nuevo Producto
    cy.contains('button', 'REGISTRAR NUEVO PRODUCTO')
      .should('be.visible')
      .click();

    // 4. Validamos que el modal se ha abierto y es visible
    cy.contains('h3', 'NUEVO PRODUCTO')
      .should('be.visible');

    // 5. Rellenamos los campos del formulario
    cy.get('input[name="nombre"]')
      .should('be.visible')
      .clear()
      .type('Amortiguador Premium E2E');

    cy.get('textarea[name="descripcion"]')
      .should('be.visible')
      .clear()
      .type('Amortiguador reforzado de alta duración para pruebas de Cypress.');

    cy.get('input[name="precio"]')
      .should('be.visible')
      .clear()
      .type('249.99');

    cy.get('input[name="stock"]')
      .should('be.visible')
      .clear()
      .type('15');

    cy.get('input[name="imagen"]')
      .should('be.visible')
      .clear()
      .type('https://placehold.co/300x300?text=Amortiguador');

    // 6. Al hacer submit, interceptamos la respuesta simulada
    // Modificamos el GET interceptado posterior para que muestre el producto recién creado
    cy.intercept('GET', '/api/producto', {
      statusCode: 200,
      body: [
        {
          id: 999,
          nombre: 'Amortiguador Premium E2E',
          descripcion: 'Amortiguador reforzado de alta duración para pruebas de Cypress.',
          precio: 249.99,
          stock: 15,
          imagen: 'https://placehold.co/300x300?text=Amortiguador'
        }
      ]
    }).as('getProductosActualizados');

    cy.get('button[type="submit"]')
      .contains('REGISTRAR PRODUCTO')
      .should('be.enabled')
      .click();

    // 7. Esperamos las llamadas de red correspondientes
    cy.wait('@createProducto');
    cy.wait('@getProductosActualizados');

    // 8. Validaciones de éxito post-creación:
    // A. El modal debe cerrarse
    cy.contains('h3', 'NUEVO PRODUCTO').should('not.exist');

    // B. Debe aparecer el mensaje Toast de confirmación exitosa
    cy.contains('Producto registrado correctamente.').should('be.visible');

    // C. El producto recién creado debe aparecer listado en la tabla de productos
    cy.contains('td', 'AMORTIGUADOR PREMIUM E2E').should('be.visible');
    cy.contains('td', '15 UNIDADES').should('be.visible');
    cy.contains('td', 'S/ 249.99').should('be.visible');
  });

});
