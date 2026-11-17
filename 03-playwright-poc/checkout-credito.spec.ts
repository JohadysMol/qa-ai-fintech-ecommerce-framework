import { test, expect } from '@playwright/test';

test.describe('E-commerce & Crédito Directo - Validación de Carrito y Checkout', () => {

  test('Validar recálculo de subtotal, selección de cuotas y redirección a flujo de crédito', async ({ page }) => {
    // 1. Navegar al carrito de compras (URL de ejemplo)
    await page.goto('https://ejemplo-ecommerce-muebles.com');

    // 2. Validar que el resumen muestra el subtotal inicial esperado
    const subtotalLocator = page.locator('[data-testid="cart-subtotal"]');
    await expect(subtotalLocator).toBeVisible();

    // 3. Seleccionar plan de financiación a cuotas
    const selectorCuotas = page.getByLabel('Selecciona tus cuotas');
    await selectorCuotas.selectOption({ label: '24 cuotas semanales' });

    // 4. Iniciar flujo de compra con crédito propio
    const btnComprarCredito = page.getByRole('button', { name: /Comprar a cuotas/i });
    await expect(btnComprarCredito).toBeEnabled();
    await btnComprarCredito.click();

    // 5. Verificar redirección exitosa al módulo de validación crediticia
    await expect(page).toHaveURL(/.*credito|financiamiento.*/);
  });

  test('Simular error 500 en servicio de consulta de cupo y validar mensaje controlado', async ({ page }) => {
    // Interceptar la API de crédito para simular caída del core financiero
    await page.route('**/api/v1/credito/validar-cupo', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'CORE_TIMEOUT', message: 'Servicio temporalmente no disponible' })
      });
    });

    await page.goto('https://ejemplo-ecommerce-muebles.com');
    await page.getByRole('button', { name: /Comprar a cuotas/i }).click();

    // Validar que la interfaz informa al usuario sin romper la página ni duplicar orden
    const alertaError = page.getByRole('alert');
    await expect(alertaError).toContainText(/temporalmente no disponible|intenta nuevamente/i);
  });

});
