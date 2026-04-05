# Auditoría Final — Real y Verificable

Objetivo: registrar solo hallazgos con prueba fuerte y separar lo recuperable de lo muerto.

## Criterio obligatorio
Solo entra un caso si tiene al menos una prueba fuerte:
- ownership on-chain actual
- transferencia ejecutada con éxito
- claim activo verificable
- balance real en wallet confirmada

## Clasificación final
- real_consolidado
- recuperable_accionable
- intento_fallido_legitimo
- spam_scam_ruido
- revision_manual

## Estructura
- `wallets_confirmadas.csv`
- `hallazgos_reales.csv`
- `recuperables_accionables.csv`
- `intentos_fallidos_legitimos.csv`
- `spam_scam_ruido.csv`
- `revision_manual.csv`
- `metodologia.md`

## Regla operativa
UNINIT / nonexist / compute skipped / aborted no equivalen a activo real, salvo prueba adicional fuerte.
