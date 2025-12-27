### 11.1.2 Números Literais

Os números literais incluem números de valor exato (inteiros e `DECIMAL` - DECIMAL, NUMERIC")) e números de valor aproximado (ponto flutuante).

Os inteiros são representados como uma sequência de dígitos. Os números podem incluir `.` como separador decimal. Os números podem ser precedidos por `-` ou `+` para indicar um valor negativo ou positivo, respectivamente. Os números representados em notação científica com uma mantissa e expoente são números de valor aproximado.

Os números literais de valor exato têm uma parte inteira ou fracionária, ou ambas. Eles podem ser assinados. Exemplos: `1`, `.2`, `3.4`, `-5`, `-6.78`, `+9.10`.

Os números literais de valor aproximado são representados em notação científica com uma mantissa e expoente. Uma ou ambas as partes podem ser assinados. Exemplos: `1.2E3`, `1.2E-3`, `-1.2E3`, `-1.2E-3`.

Dois números que parecem semelhantes podem ser tratados de maneira diferente. Por exemplo, `2.34` é um número de valor exato (ponto fixo), enquanto `2.34E0` é um número de valor aproximado (ponto flutuante).

O tipo de dados `DECIMAL` - DECIMAL, NUMERIC") é um tipo de ponto fixo e os cálculos são exatos. No MySQL, o tipo `DECIMAL` - DECIMAL, NUMERIC") tem vários sinônimos: `NUMERIC` - DECIMAL, NUMERIC"), `DEC` - DECIMAL, NUMERIC"), `FIXED` - DECIMAL, NUMERIC"). Os tipos inteiros também são tipos de valor exato. Para mais informações sobre cálculos de valor exato, consulte a Seção 14.25, “Matemática de Precisão”.

Os tipos de dados `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") são tipos de ponto flutuante e os cálculos são aproximados. No MySQL, os tipos que são sinônimos de `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") são `DOUBLE PRECISION` - FLOAT, DOUBLE") e `REAL` - FLOAT, DOUBLE").

Um inteiro pode ser usado em um contexto de ponto flutuante; ele é interpretado como o número equivalente de ponto flutuante.