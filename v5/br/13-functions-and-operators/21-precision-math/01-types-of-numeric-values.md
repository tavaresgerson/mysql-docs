### 12.21.1 Tipos de Valores Numéricos

O escopo da matemática de precisão para operações de valor exato inclui os tipos de dados de valor exato (tipos `integer` e `DECIMAL` - DECIMAL, NUMERIC") - tipos) e literais numéricos de valor exato. Os tipos de dados de valor aproximado e os literais numéricos são tratados como números de ponto flutuante.

Literais numéricos de valor exato possuem uma parte inteira ou parte fracionária, ou ambas. Eles podem ser sinalizados. Exemplos: `1`, `.2`, `3.4`, `-5`, `-6.78`, `+9.10`.

Literais numéricos de valor aproximado são representados em notação científica com uma mantissa e um expoente. Uma ou ambas as partes podem ser sinalizadas. Exemplos: `1.2E3`, `1.2E-3`, `-1.2E3`, `-1.2E-3`.

Dois números que parecem semelhantes podem ser tratados de forma diferente. Por exemplo, `2.34` é um número de valor exato (ponto fixo), enquanto `2.34E0` é um número de valor aproximado (ponto flutuante).

O tipo de dado `DECIMAL` - DECIMAL, NUMERIC") é um tipo de ponto fixo e os cálculos são exatos. No MySQL, o tipo `DECIMAL` - DECIMAL, NUMERIC") possui diversos sinônimos: `NUMERIC` - DECIMAL, NUMERIC"), `DEC` - DECIMAL, NUMERIC"), `FIXED` - DECIMAL, NUMERIC"). Os tipos `integer` também são tipos de valor exato.

Os tipos de dado `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") são tipos de ponto flutuante e os cálculos são aproximados. No MySQL, os tipos que são sinônimos de `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") são `DOUBLE PRECISION` - FLOAT, DOUBLE") e `REAL` - FLOAT, DOUBLE").