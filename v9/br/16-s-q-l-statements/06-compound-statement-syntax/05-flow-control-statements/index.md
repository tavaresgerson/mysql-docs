### 15.6.5 Declarações de controle de fluxo

15.6.5.1 Declaração CASE

15.6.5.2 Declaração IF

15.6.5.3 Declaração ITERATE

15.6.5.4 Declaração LEAVE

15.6.5.5 Declaração LOOP

15.6.5.6 Declaração REPEAT

15.6.5.7 Declaração RETURN

15.6.5.8 Declaração WHILE

O MySQL suporta as construções `IF`, `CASE`, `ITERATE`, `LEAVE`, `LOOP`, `WHILE` e `REPEAT` para controle de fluxo dentro de programas armazenados. Ele também suporta `RETURN` dentro de funções armazenadas.

Muitas dessas construções contêm outras declarações, conforme indicado pelas especificações gramaticais nas seções seguintes. Tais construções podem ser aninhadas. Por exemplo, uma declaração `IF` pode conter um loop `WHILE`, que por sua vez contém uma declaração `CASE`.

O MySQL não suporta loops `FOR`.