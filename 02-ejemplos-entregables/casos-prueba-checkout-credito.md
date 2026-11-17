# Matriz de Casos de Prueba: Checkout E-commerce y Core Financiero

## 1. Matriz de Ejecución (UI + API + Core)

| ID | Escenario de Prueba | Tipo | Datos de Entrada | Pasos de Ejecución | Resultado Esperado (UI / API) | Validación en Base de Datos (SQL Core) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-01** | Recálculo de carrito y aplicación de descuentos | Funcional Positiva | 2 juegos de alcoba + 2 muebles TV con descuento (-27%, -29%, -33%) | 1. Ingresar al carrito.<br>2. Incrementar cantidad de un ítem.<br>3. Seleccionar departamento de envío. | El contador superior pasa a 5 ítems, el subtotal suma los precios con descuento y el total suma el flete exacto. | Verificar en `TABLA_CARRITO_DETALLE` que `PRECIO_UNITARIO` corresponda al valor con descuento aplicado. |
| **CP-02** | Compra exitosa con Crédito Directo (Happy Path) | Integración E2E | Cliente activo con cupo `$10.000.000`, compra por `$7.676.000` a 24 cuotas | 1. Elegir 24 cuotas.<br>2. Clic en *Comprar a cuotas*.<br>3. Ingresar OTP de confirmación. | API retorna `200 OK`. Se muestra pantalla de confirmación con número de orden y plan de pagos. | Verificar en `CORE_OBLIGACIONES` estado `ACTIVA`, monto `$7.676.000` y descuento exacto en `CORE_CUPOS`. |
| **CP-03** | Rechazo por cupo crediticio insuficiente | Negativa / Regla Negocio | Cliente con cupo `$3.000.000`, compra por `$7.676.000` | 1. Clic en *Comprar a cuotas*.<br>2. Validar identidad del cliente. | API retorna `422 Unprocessable Entity` (`ERR_CUPO_INSUFICIENTE`). UI muestra alerta sin bloquear carrito. | Confirmar en `CORE_OBLIGACIONES` que **no** se creó registro y `CORE_CUPOS` mantiene saldo `$3.000.000`. |
| **CP-04** | Prevención de doble cobro por doble clic (Idempotencia) | Seguridad / Borde | Cliente aprobado, token de sesión válido | 1. En confirmación final, hacer doble clic rápido en *Confirmar Crédito*.<br>2. Enviar dos peticiones simultáneas con mismo `ID_TRANSACCION`. | La primera petición retorna `201 Created`; la segunda retorna `409 Conflict` y se ignora en UI. | Ejecutar consulta de conteo por `ID_TRANSACCION` y validar que exista **exactamente 1 registro**. |
| **CP-05** | Error 500 / Timeout en pasarela externa (ePayco / Addi) | Integración Negativa | Tarjeta de prueba con simulación de timeout | 1. Seleccionar *Comprar con otro medio de pago*.<br>2. Simular error `504 Gateway Timeout` en pasarela. | UI captura el error controladamente, mantiene los productos en el carrito y permite reintentar. | Verificar en `ECOM_ORDENES` que la orden quede en estado `PENDIENTE_PAGO` y el inventario no se descuente. |
| **CP-06** | Validación de límite máximo de endeudamiento (30% ingresos) | Valor Límite | Cliente con ingresos `$1.000.000`, cuota semanal de `$140.361` (~$561.444/mes > 30%) | 1. Diligenciar formulario de solicitud de crédito.<br>2. Enviar solicitud. | El motor de reglas rechaza el plazo de 24 semanas y sugiere ampliar el plazo a 48 semanas. | Validar en `CORE_SOLICITUDES_LOG` el código de rechazo `REGLA_CAPACIDAD_PAGO_EXCEDIDA`. |

---

## 2. Consultas SQL de Verificación (Evidencia Técnica)

### A. Verificar consistencia entre orden e-commerce, obligación financiera y descuento de cupo
```sql
SELECT 
    o.id_orden,
    o.estado_orden,
    o.monto_total AS total_ecommerce,
    ob.numero_obligacion,
    ob.monto_financiado AS total_core,
    ob.cantidad_cuotas,
    c.cupo_anterior,
    c.cupo_disponible_actual
FROM ecom_ordenes o
INNER JOIN core_obligaciones ob ON o.id_orden = ob.id_referencia_externa
INNER JOIN core_cupos_clientes c ON ob.id_cliente = c.id_cliente
WHERE o.id_orden = 'ORD-2026-98451'
  AND o.monto_total = ob.monto_financiado
  AND (c.cupo_anterior - c.cupo_disponible_actual) = ob.monto_financiado;
```

### B. Detectar transacciones duplicadas (Validación de Idempotencia)
```sql
SELECT 
    id_transaccion_pasarela,
    id_cliente,
    COUNT(*) AS total_registros,
    SUM(monto_transaccion) AS monto_acumulado
FROM core_movimientos_transaccionales
WHERE fecha_creacion >= TRUNC(SYSDATE)
GROUP BY id_transaccion_pasarela, id_cliente
HAVING COUNT(*) > 1;
```
