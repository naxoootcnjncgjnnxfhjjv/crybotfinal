# Metodología estricta

## Objetivo
Cerrar el caso con tres salidas únicas:
1. real_consolidado
2. recuperable_accionable
3. muerto o descartado

## Pruebas fuertes válidas
- owner actual confirmado en cadena
- transferencia ejecutada con éxito y efecto final
- claim activo comprobable
- balance real en wallet confirmada

## Señales insuficientes por sí solas
- nonexist
- uninit
- compute skipped
- aborted true
- interfaz antigua o captura sin contexto
- spam dust o blacklisted assets

## Regla
No se marca como tuyo ningún activo si no existe una prueba fuerte actual.

## Flujo
1. identificar wallet
2. confirmar estado técnico
3. revisar ownership o balance
4. estimar valor real y liquidez
5. clasificar
6. definir acción o descarte
