# Historia de Usuario: Compra de Muebles a Cuotas con Crédito Directo en Carrito Web

## Descripción
**Como** cliente comprador en la tienda online de muebles,  
**Quiero** seleccionar un plan de financiación a cuotas directamente desde el resumen de mi carrito de compras,  
**Para** conocer el valor de mi cuota semanal y completar la adquisición de mis productos utilizando mi cupo de crédito aprobado.

---

## Criterios de Aceptación (Gherkin / BDD)

### Escenario 1: Selección de cuotas y recálculo exitoso (Happy Path)
- **Dado** que el cliente tiene productos agregados en el carrito de compras con un subtotal válido y ha seleccionado su departamento de despacho,
- **Cuando** elige un plazo de financiación en el selector de cuotas (ej. 24 cuotas semanales),
- **Entonces** el sistema debe calcular y mostrar dinámicamente el valor de la cuota semanal incluyendo los intereses aplicables,
- **Y** al hacer clic en *"Comprar a cuotas con Crédito Directo"*, debe redirigir al módulo de validación de identidad y cupo enviando el monto total exacto.

### Escenario 2: Cupo crediticio insuficiente
- **Dado** que el cliente inicia el flujo de compra a cuotas por un monto total de `$7.676.000`,
- **Cuando** el servicio de consulta al Core Financiero responde que el cliente solo dispone de `$5.000.000` de cupo aprobado,
- **Entonces** el sistema debe impedir la creación de la obligación financiera,
- **Y** mostrar un mensaje claro ofreciendo ajustar el carrito o completar el pago mediante otro medio (pasarela externa).

### Escenario 3: Indisponibilidad o timeout del Core Financiero (Error 500 / 504)
- **Dado** que el cliente confirma su compra a cuotas,
- **Cuando** la API de integración con el Core Financiero tarda más de 10 segundos o retorna un error HTTP `500`,
- **Entonces** el sistema debe abortar la transacción de forma segura sin bloquear el inventario ni generar cargos duplicados,
- **Y** mostrar una notificación amigable invitando a reintentar en unos minutos.

---

## Checklist Definition of Ready (DoR)
- [ ] Reglas de tasa de interés, seguros y cálculo de cuota semanal aprobadas por el área de Riesgo y Crédito.
- [ ] Contrato de API (Swagger/OpenAPI) definido para los endpoints `POST /credito/simular-cuota` y `POST /credito/validar-cupo`.
- [ ] Catálogo de códigos de error del Core Financiero mapeado a mensajes amigables en interfaz web.
- [ ] Datos de prueba preparados en ambiente QA (clientes con cupo activo, cupo insuficiente, cliente en mora y cliente nuevo).

## Checklist Definition of Done (DoD)
- [ ] Pruebas funcionales, negativas y de regresión ejecutadas al 100% sin defectos críticos o bloqueantes abiertos.
- [ ] Validación de integridad de datos ejecutada mediante consultas SQL en las tablas de pedidos y obligaciones del Core.
- [ ] Pruebas de idempotencia verificadas (sin duplicidad de transacciones ante doble clic o recarga de navegador).
- [ ] Evidencias de certificación y métricas de calidad documentadas en Jira / HP ALM.
