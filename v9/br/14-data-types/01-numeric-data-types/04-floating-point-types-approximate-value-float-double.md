### 13.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE

Os tipos `FLOAT` e `DOUBLE` representam valores de dados numéricos aproximados. O MySQL utiliza quatro bytes para valores de precisão simples e oito bytes para valores de precisão dupla.

Para `FLOAT`, o padrão SQL permite uma especificação opcional da precisão (mas não da faixa do expoente) em bits após a palavra-chave `FLOAT` entre parênteses, ou seja, `FLOAT(p)` - FLOAT, DOUBLE"). O MySQL também suporta essa especificação opcional de precisão, mas o valor de precisão em `FLOAT(p)` - FLOAT, DOUBLE") é usado apenas para determinar o tamanho de armazenamento. Uma precisão de 0 a 23 resulta em uma coluna `FLOAT` de precisão simples de 4 bytes. Uma precisão de 24 a 53 resulta em uma coluna `DOUBLE` de precisão dupla de 8 bytes.

O MySQL permite uma sintaxe não padrão: `FLOAT(M,D)` ou `REAL(M,D)` ou `DOUBLE PRECISION(M,D)`. Aqui, `(M,D)` significa que os valores podem ser armazenados com até *`M`* dígitos no total, dos quais *`D`* dígitos podem estar após a vírgula. Por exemplo, uma coluna definida como `FLOAT(7,4)` é exibida como `-999.9999`. O MySQL realiza arredondamento ao armazenar valores, então, se você inserir `999.00009` em uma coluna `FLOAT(7,4)`, o resultado aproximado é `999.0001`.

`FLOAT(M,D)` e `DOUBLE(M,D)` são extensões não padrão do MySQL; e são desaconselhadas. Você deve esperar que o suporte para essas variantes seja removido em uma versão futura do MySQL.

Como os valores de ponto flutuante são aproximados e não armazenados como valores exatos, tentativas de tratá-los como exatos em comparações podem levar a problemas. Eles também estão sujeitos a dependências de plataforma ou implementação. Para mais informações, consulte a Seção B.3.4.8, “Problemas com Valores de Ponto Flutuante”.

Para máxima portabilidade, o código que exija o armazenamento de valores de dados numéricos aproximados deve usar `FLOAT` ou `DOUBLE PRECISION` sem especificar a precisão ou o número de dígitos.