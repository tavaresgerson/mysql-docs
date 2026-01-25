### 11.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

Os tipos `FLOAT` e `DOUBLE` representam valores de dados numéricos aproximados. O MySQL usa quatro bytes para valores de precisão simples e oito bytes para valores de precisão dupla.

Para `FLOAT`, o padrão SQL permite uma especificação opcional da precisão (mas não do intervalo do expoente) em bits após a palavra-chave `FLOAT` entre parênteses, ou seja, `FLOAT(p)`. O MySQL também suporta esta especificação opcional de precisão, mas o valor da precisão em `FLOAT(p)` é usado apenas para determinar o tamanho do armazenamento (storage size). Uma precisão de 0 a 23 resulta em uma coluna `FLOAT` de precisão simples de 4 bytes. Uma precisão de 24 a 53 resulta em uma coluna `DOUBLE` de precisão dupla de 8 bytes.

O MySQL permite uma sintaxe não padrão: `FLOAT(M,D)` ou `REAL(M,D)` ou `DOUBLE PRECISION(M,D)`. Aqui, `(M,D)` significa que os valores podem ser armazenados com até *`M`* dígitos no total, dos quais *`D`* dígitos podem estar após o ponto decimal. Por exemplo, uma coluna definida como `FLOAT(7,4)` é exibida como `-999.9999`. O MySQL realiza arredondamento ao armazenar valores, portanto, se você inserir `999.00009` em uma coluna `FLOAT(7,4)`, o resultado aproximado será `999.0001`.

Como os valores de ponto flutuante são aproximados e não armazenados como valores exatos, tentativas de tratá-los como exatos em comparações podem levar a problemas. Eles também estão sujeitos a dependências de plataforma ou de implementação. Para mais informações, consulte a Seção B.3.4.8, “Problems with Floating-Point Values”.

Para máxima portabilidade, o código que exige o armazenamento de valores de dados numéricos aproximados deve usar `FLOAT` ou `DOUBLE PRECISION` sem especificação de precisão ou número de dígitos.