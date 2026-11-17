# Prompt 2: Generación de Matriz de Casos de Prueba (Positivos, Negativos y Borde)

## Prompt Maestro
> "Actúa como un Analista de Pruebas Senior especializado en sistemas transaccionales y pasarelas de pago. 
> Basado en los siguientes criterios de aceptación: **[PEGAR CRITERIOS]**, diseña una matriz de casos de prueba en formato tabla con las columnas: `ID`, `Escenario`, `Tipo de Prueba (Positiva/Negativa/Borde/Integración)`, `Precondiciones`, `Datos de Entrada`, `Paso a Paso`, `Resultado Esperado en UI` y `Validación Esperada en Base de Datos (SQL)`.
> Incluye obligatoriamente pruebas de:
> - Cálculo exacto de subtotales, descuentos, fletes por ubicación y cuotas.
> - Idempotencia (doble clic en botón de pago o recarga de página).
> - Timeouts o errores 500 en la API de consulta de cupo crediticio."
