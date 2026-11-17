# Prompt 3: Simulación de Usuario Real y Validación de Carga en Solicitud de Préstamo

## Prompt Maestro
> "Actúa como un motor de simulación de pruebas de usuario y validador de reglas de negocio financieras.
> Te proporcionaré la estructura del formulario de solicitud de crédito: **[CAMPOS: TipoDoc, NumDoc, IngresosMensuales, CuotaSolicitada, PlazoSemanas, Departamento]**.
> 1. Genera **5 perfiles de clientes simulados** (1 aprobado estándar, 1 rechazado por capacidad de endeudamiento, 1 con datos de formato inválido, 1 cliente existente con cupo bloqueado y 1 caso límite de monto máximo).
> 2. Simula el envío de cada perfil evaluando estas reglas: [Regla 1: Cuota no puede superar el 30% de ingresos; Regla 2: Plazo válido entre 12 y 48 semanas; Regla 3: Documento obligatorio].
> 3. Entrega un **Reporte de Resultado de Carga** indicando por cada simulación: `Estado (Aceptado/Rechazado)`, `Código de Error Simulado`, `Mensaje esperado para el cliente` y `Consistencia de datos a verificar en el Core`."
