# Falsos positivos y limpieza

## Caso descartado
### TonDomainInfoBot en Telegram
- El handle visible abre un canal con suscriptores y contenido spam, no un bot funcional de consulta.
- No se usa como prueba de activo ni como herramienta principal.
- El repositorio GitHub solo queda como referencia técnica para dominios TON.

## Regla de limpieza
Se descarta cualquier elemento que cumpla una o más de estas señales:
- interfaz o enlace que no responde como herramienta funcional
- canal o grupo disfrazado de bot
- contenido spam, promocional o irrelevante
- wallet UNINIT sin prueba adicional fuerte
- compute skipped o aborted sin efecto final

## Regla de verificación
Solo se conserva lo que tenga al menos una prueba fuerte:
- ownership actual on-chain
- transferencia ejecutada con efecto final
- claim activo verificable
- balance real en wallet confirmada
