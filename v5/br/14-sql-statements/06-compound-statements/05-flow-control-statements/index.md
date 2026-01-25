### 13.6.5 Declarações de Controle de Fluxo

[13.6.5.1 Declaração CASE](case.html)

[13.6.5.2 Declaração IF](if.html)

[13.6.5.3 Declaração ITERATE](iterate.html)

[13.6.5.4 Declaração LEAVE](leave.html)

[13.6.5.5 Declaração LOOP](loop.html)

[13.6.5.6 Declaração REPEAT](repeat.html)

[13.6.5.7 Declaração RETURN](return.html)

[13.6.5.8 Declaração WHILE](while.html)

O MySQL suporta as construções [`IF`](if.html "13.6.5.2 Declaração IF"), [`CASE`](case.html "13.6.5.1 Declaração CASE"), [`ITERATE`](iterate.html "13.6.5.3 Declaração ITERATE"), [`LEAVE`](leave.html "13.6.5.4 Declaração LEAVE") [`LOOP`](loop.html "13.6.5.5 Declaração LOOP"), [`WHILE`](while.html "13.6.5.8 Declaração WHILE") e [`REPEAT`](repeat.html "13.6.5.6 Declaração REPEAT") para controle de fluxo dentro de stored programs. Ele também suporta [`RETURN`](return.html "13.6.5.7 Declaração RETURN") dentro de stored functions.

Muitas dessas construções contêm outras declarações, conforme indicado pelas especificações de gramática nas seções seguintes. Tais construções podem ser aninhadas (nested). Por exemplo, uma declaração [`IF`](if.html "13.6.5.2 Declaração IF") pode conter um loop [`WHILE`](while.html "13.6.5.8 Declaração WHILE"), que por sua vez contém uma declaração [`CASE`](case.html "13.6.5.1 Declaração CASE").

O MySQL não suporta loops `FOR`.