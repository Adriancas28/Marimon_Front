describe('Flujo de Compra Completo con Stripe - E2E Marimon', () => {

  const loginUrl = 'http://localhost:5173/login';
  const catalogoUrl = 'http://localhost:5173/catalogo';
  const apiBaseUrl = 'https://marimonbackend.onrender.com';

  beforeEach(() => {
    // 1. Interceptamos las llamadas de categorías y productos para independizar la prueba del backend real
    cy.intercept('GET', `${apiBaseUrl}/api/categoria`, {
      statusCode: 200,
      body: [
        { id: 1, nombre: 'Amortiguadores' },
        { id: 2, nombre: 'Filtros' }
      ]
    }).as('getCategorias');

    cy.intercept('GET', '**/api/producto**', {
      statusCode: 200,
      body: [
        {
          id: 101,
          nombre: 'Filtro de Aceite Premium',
          descripcion: 'Filtro de alto rendimiento para motor a gasolina.',
          precio: 89.90,
          stock: 10,
          imagen: 'https://placehold.co/150x150?text=Filtro',
          categoriaId: 2
        }
      ]
    }).as('getProductos');

    // Interceptamos el registro de venta del checkout exitoso
    cy.intercept('POST', '**/api/venta', {
      statusCode: 200,
      body: { success: true, id: 5001 }
    }).as('postVenta');

    // 2. Iniciamos sesión con un usuario Cliente Real (Prueba Sincronizada)
    cy.visit(loginUrl);

    cy.get('input[type="email"]')
      .should('be.visible')
      .clear()
      .type('prueba_5224@test.com');

    cy.get('input[type="password"]')
      .should('be.visible')
      .clear()
      .type('password123');

    cy.contains('button', 'Iniciar sesión')
      .should('be.enabled')
      .click();

    // Al ser un cliente normal, el sistema debe redirigir a /inicio
    cy.location('pathname', { timeout: 15000 })
      .should('eq', '/inicio');
  });

  it('Debe iniciar sesión, añadir producto al carrito, completar datos de Boleta y pagar con tarjeta (Stripe) exitosamente', () => {
    // 1. Vamos directamente al Catálogo de productos
    cy.visit(catalogoUrl);
    cy.wait(['@getCategorias', '@getProductos']);

    // 2. Buscamos el producto en el catálogo y lo añadimos al carrito
    cy.contains('h2', 'Filtro de Aceite Premium')
      .should('be.visible');

    cy.contains('article', 'Filtro de Aceite Premium')
      .contains('button', 'AÑADIR')
      .should('be.visible')
      .click();

    // 3. Verificamos que el carrito se abre y contiene el producto agregado
    cy.contains('h2', 'Tu Carrito')
      .should('be.visible');

    cy.get('ul')
      .contains('h3', 'Filtro de Aceite Premium')
      .should('be.visible');

    // 4. Procedemos a pagar (hacemos clic en "Ir a Pagar")
    cy.contains('button', 'Ir a Pagar')
      .should('be.visible')
      .click();

    // 5. Verificamos que llegamos a la pantalla de Pago
    cy.location('pathname')
      .should('eq', '/pago');

    // 6. Rellenamos el formulario de Comprobante: en este caso una Boleta de venta
    cy.get('input[value="boleta"]').should('be.checked');

    // Los nombres y apellidos del admin ya vienen precargados por sesión, pero aseguramos o editamos
    cy.get('input[placeholder="Ingresa tu nombre"]')
      .clear()
      .type('Juan');

    cy.get('input[placeholder="Ingresa tus apellidos"]')
      .clear()
      .type('Pérez');

    // Seleccionamos tipo y número de documento (DNI de 8 dígitos)
    cy.get('select').select('DNI');
    cy.get('input').eq(4).type('73928104'); // DNI de ejemplo

    // Seleccionamos método de pago por tarjeta (es el seleccionado por defecto)
    cy.get('input[value="tarjeta"]').should('be.checked');

    // Aceptamos los términos y condiciones haciendo clic en el checkbox
    cy.get('input[type="checkbox"]').check({ force: true });

    // Hacemos submit haciendo clic en "Pagar con Tarjeta"
    cy.contains('button', 'Pagar con Tarjeta')
      .should('be.visible')
      .click();

    // 7. Verificamos que navegamos a la pasarela de Stripe
    cy.location('pathname')
      .should('eq', '/pago-stripe');

    // Validamos que se muestre el total correcto en la pasarela
    cy.contains('S/ 89.90').should('exist');

    // Rellenamos el nombre del titular de la tarjeta
    cy.get('input[placeholder="Ej. Juan Pérez"]')
      .should('be.visible')
      .type('Juan Pérez');

    // 8. Rellenamos los datos en la tarjeta dentro del iframe seguro de Stripe Elements
    // Stripe monta un iframe dentro de la clase .StripeElement
    cy.get('.StripeElement iframe', { timeout: 15000 })
      .should('be.visible')
      .its('0.contentDocument')
      .should('exist')
      .its('body')
      .should('not.be.null')
      .then(cy.wrap)
      .as('stripeIframe');

    // Tarjeta de pruebas estándar de Stripe: 4242 4242 4242 4242
    cy.get('@stripeIframe')
      .find('input[name="cardnumber"]')
      .should('be.visible')
      .type('4242424242424242');

    // Fecha de expiración (MM/YY)
    cy.get('@stripeIframe')
      .find('input[name="exp-date"]')
      .should('be.visible')
      .type('1230'); // Expiración en 12/30

    // CVC
    cy.get('@stripeIframe')
      .find('input[name="cvc"]')
      .should('be.visible')
      .type('123');

    // 9. Presionamos el botón de pagar
    cy.contains('button', 'Pagar S/ 89.90')
      .should('be.enabled')
      .click();

    // 10. Esperamos la animación y la llamada a /api/venta
    cy.wait('@postVenta', { timeout: 15000 });

    // 11. Validamos la llegada exitosa a la página de Confirmación
    cy.location('pathname', { timeout: 15000 })
      .should('eq', '/pago-exitoso');

    cy.contains('h1', '¡Pago Completado con Éxito!')
      .should('be.visible');

    cy.contains('Tu compra ha sido procesada correctamente.')
      .should('be.visible');
  });

});

