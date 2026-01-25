### 9.1.2 Literais Numéricos

Literais numéricos incluem literais de valor exato (inteiro e `DECIMAL` - DECIMAL, NUMERIC")) e literais de valor aproximado (floating-point).

Inteiros são representados como uma sequência de dígitos. Números podem incluir `.` como separador decimal. Números podem ser precedidos por `-` ou `+` para indicar um valor negativo ou positivo, respectivamente. Números representados em notação científica com uma mantissa e um expoente são números de valor aproximado.

Literais numéricos de valor exato possuem uma parte inteira ou uma parte fracionária, ou ambas. Eles podem ser sinalizados (signed). Exemplos: `1`, `.2`, `3.4`, `-5`, `-6.78`, `+9.10`.

Literais numéricos de valor aproximado são representados em notação científica com uma mantissa e um expoente. Uma ou ambas as partes podem ser sinalizadas. Exemplos: `1.2E3`, `1.2E-3`, `-1.2E3`, `-1.2E-3`.

Dois números que parecem semelhantes podem ser tratados de forma diferente. Por exemplo, `2.34` é um número de valor exato (fixed-point), enquanto `2.34E0` é um número de valor aproximado (floating-point).

O tipo de dado `DECIMAL` - DECIMAL, NUMERIC") é um tipo fixed-point e seus cálculos são exatos. No MySQL, o tipo `DECIMAL` - DECIMAL, NUMERIC") possui vários sinônimos: `NUMERIC` - DECIMAL, NUMERIC"), `DEC` - DECIMAL, NUMERIC"), `FIXED` - DECIMAL, NUMERIC"). Os tipos inteiros também são tipos de valor exato. Para mais informações sobre cálculos de valor exato, consulte a Seção 12.21, “Precision Math”.

Os tipos de dado `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") são tipos floating-point e seus cálculos são aproximados. No MySQL, os tipos que são sinônimos de `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") são `DOUBLE PRECISION` - FLOAT, DOUBLE") e `REAL` - FLOAT, DOUBLE").

Um inteiro pode ser usado em um contexto floating-point; ele é interpretado como o número floating-point equivalente.