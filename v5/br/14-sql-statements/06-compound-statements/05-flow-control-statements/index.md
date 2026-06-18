### 13.6.5 Declarações de Controle de Fluxo

13.6.5.1 Declaração CASE

13.6.5.2 Declaração IF

13.6.5.3 Declaração ITERATE

13.6.5.4 Declaração LEAVE

13.6.5.5 Declaração LOOP

13.6.5.6 Declaração REPEAT

13.6.5.7 Declaração RETURN

13.6.5.8 Declaração WHILE

O MySQL suporta as construções `IF`, `CASE`, `ITERATE`, `LEAVE` `LOOP`, `WHILE` e `REPEAT` para controle de fluxo dentro de stored programs. Ele também suporta `RETURN` dentro de stored functions.

Muitas dessas construções contêm outras declarações, conforme indicado pelas especificações de gramática nas seções seguintes. Tais construções podem ser aninhadas (nested). Por exemplo, uma declaração `IF` pode conter um loop `WHILE`, que por sua vez contém uma declaração `CASE`.

O MySQL não suporta loops `FOR`.