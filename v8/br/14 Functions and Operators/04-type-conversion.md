## 14.3 Conversão de Tipo na Avaliação de Expressões

Quando um operador é usado com operandos de tipos diferentes, ocorre a conversão de tipo para tornar os operandos compatíveis. Algumas conversões ocorrem implicitamente. Por exemplo, o MySQL converte automaticamente strings em números conforme necessário e vice-versa.

```
mysql> SELECT 1+'1';
        -> 2
mysql> SELECT CONCAT(2,' test');
        -> '2 test'
```

Também é possível converter um número explicitamente para uma string usando a função  `CAST()`. A conversão ocorre implicitamente com a função `CONCAT()` porque ela espera argumentos de string.

```
mysql> SELECT 38.8, CAST(38.8 AS CHAR);
        -> 38.8, '38.8'
mysql> SELECT 38.8, CONCAT(38.8);
        -> 38.8, '38.8'
```

Veja mais adiante nesta seção para obter informações sobre o conjunto de caracteres das conversões implícitas de número para string e para regras modificadas que se aplicam às declarações `CREATE TABLE ... SELECT`.

As seguintes regras descrevem como a conversão ocorre para operações de comparação:

* Se um ou ambos os argumentos são `NULL`, o resultado da comparação é `NULL`, exceto pelo operador de comparação `NULL-safe `<=>` (igualdade). Para `NULL <=> NULL`, o resultado é verdadeiro. Não é necessária nenhuma conversão.
* Se ambos os argumentos em uma operação de comparação são strings, eles são comparados como strings.
* Se ambos os argumentos são inteiros, eles são comparados como inteiros.
* Valores hexadecimais são tratados como strings binárias se não forem comparados com um número.
* Se um dos argumentos é uma coluna `TIMESTAMP` ou `DATETIME` e o outro argumento é uma constante, a constante é convertida para um timestamp antes que a comparação seja realizada. Isso é feito para ser mais amigável com o ODBC. Isso não é feito para os argumentos de `IN()`. Para garantir a segurança, sempre use strings de data, hora ou datetime completas ao fazer comparações. Por exemplo, para obter os melhores resultados ao usar `BETWEEN` com valores de data ou hora, use  `CAST()` para converter explicitamente os valores para o tipo de dado desejado.

Uma subconsulta de uma única linha de uma ou mais tabelas não é considerada uma constante. Por exemplo, se uma subconsulta retorna um inteiro para ser comparado a um valor `DATETIME`, a comparação é feita como dois inteiros. O inteiro não é convertido para um valor temporal. Para comparar os operandos como valores `DATETIME`, use `CAST()` para converter explicitamente o valor da subconsulta para `DATETIME`.
* Se um dos argumentos for um valor decimal, a comparação depende do outro argumento. Os argumentos são comparados como valores decimais se o outro argumento for um valor decimal ou inteiro, ou como valores de ponto flutuante se o outro argumento for um valor de ponto flutuante.
* Em todos os outros casos, os argumentos são comparados como números de ponto flutuante (dupla precisão). Por exemplo, uma comparação de operandos de string e numérico ocorre como uma comparação de números de ponto flutuante.

Para obter informações sobre a conversão de valores de um tipo temporal para outro, consulte a Seção 13.2.8, “Conversão entre Tipos de Data e Hora”.

A comparação de valores JSON ocorre em dois níveis. O primeiro nível de comparação é baseado nos tipos JSON dos valores comparados. Se os tipos diferirem, o resultado da comparação é determinado exclusivamente pelo tipo que tem precedência maior. Se os dois valores tiverem o mesmo tipo JSON, ocorre um segundo nível de comparação usando regras específicas do tipo. Para a comparação de valores JSON e não JSON, o valor não JSON é convertido para JSON e os valores são comparados como valores JSON. Para detalhes, consulte Comparação e Ordenação de Valores JSON.

Os seguintes exemplos ilustram a conversão de strings para números para operações de comparação:

```
mysql> SELECT 1 > '6x';
        -> 0
mysql> SELECT 7 > '6x';
        -> 1
mysql> SELECT 0 > 'x6';
        -> 0
mysql> SELECT 0 = 'x6';
        -> 1
```

Para comparações de uma coluna de string com um número, o MySQL não pode usar um índice na coluna para pesquisar o valor rapidamente. Se *`str_col`* for uma coluna de string indexada, o índice não pode ser usado ao realizar a pesquisa na seguinte instrução:

```
SELECT * FROM tbl_name WHERE str_col=1;
```

A razão para isso é que existem muitas cadeias de caracteres diferentes que podem ser convertidas para o valor `1`, como `'1'`, `' 1'` ou `'1a'`.

Outro problema pode surgir ao comparar uma coluna de cadeia com o inteiro `0`. Considere a tabela `t1` criada e preenchida como mostrado aqui:

```
mysql> CREATE TABLE t1 (
    ->   c1 INT NOT NULL AUTO_INCREMENT,
    ->   c2 INT DEFAULT NULL,
    ->   c3 VARCHAR(25) DEFAULT NULL,
    ->   PRIMARY KEY (c1)
    -> );
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t1 VALUES ROW(1, 52, 'grape'), ROW(2, 139, 'apple'),
    ->                       ROW(3, 37, 'peach'), ROW(4, 221, 'watermelon'),
    ->                       ROW(5, 83, 'pear');
Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

Observe o resultado ao selecionar dessa tabela e comparar `c3`, que é uma coluna `VARCHAR`, com o inteiro `0`:

```
mysql> SELECT * FROM t1 WHERE c3 = 0;
+----+------+------------+
| c1 | c2   | c3         |
+----+------+------------+
|  1 |   52 | grape      |
|  2 |  139 | apple      |
|  3 |   37 | peach      |
|  4 |  221 | watermelon |
|  5 |   83 | pear       |
+----+------+------------+
5 rows in set, 5 warnings (0.00 sec)
```

*Isso ocorre mesmo ao usar o modo SQL rigoroso*. Para evitar que isso aconteça, cite o valor, como mostrado aqui:

```
mysql> SELECT * FROM t1 WHERE c3 = '0';
Empty set (0.00 sec)
```

Isso *não* ocorre quando `SELECT` faz parte de uma declaração de definição de dados, como `CREATE TABLE ... SELECT`; no modo rigoroso, a declaração falha devido à comparação inválida:

```
mysql> CREATE TABLE t2 SELECT * FROM t1 WHERE c3 = 0;
ERROR 1292 (22007): Truncated incorrect DOUBLE value: 'grape'
```

Quando o `0` é citado, a declaração é bem-sucedida, mas a tabela criada não contém nenhuma linha porque não havia nenhuma que correspondesse a `'0'`, como mostrado aqui:

```
mysql> CREATE TABLE t2 SELECT * FROM t1 WHERE c3 = '0';
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Esse é um problema conhecido, que se deve ao fato de que o modo rigoroso não é aplicado ao processamento de `SELECT`. Veja também o Modo SQL Rigoroso.

As comparações entre números de ponto flutuante e valores de inteiro grande são aproximadas porque o inteiro é convertido para ponto flutuante de dupla precisão antes da comparação, o que não é capaz de representar exatamente todos os inteiros de 64 bits. Por exemplo, o valor inteiro 253 + 1 não é representável como um float e é arredondado para 253 ou 253 + 2 antes de uma comparação de float, dependendo da plataforma.

Para ilustrar, apenas a primeira das seguintes comparações compara valores iguais, mas ambas as comparações retornam verdadeiro (1):

```
mysql> SELECT '9223372036854775807' = 9223372036854775807;
        -> 1
mysql> SELECT '9223372036854775807' = 9223372036854775806;
        -> 1
```

Quando as conversões de string para ponto flutuante e de inteiro para ponto flutuante ocorrem, elas nem sempre ocorrem da mesma maneira. O inteiro pode ser convertido para ponto flutuante pela CPU, enquanto a string é convertida caractere por caractere em uma operação que envolve multiplicações em ponto flutuante. Além disso, os resultados podem ser afetados por fatores como a arquitetura do computador ou a versão do compilador ou o nível de otimização. Uma maneira de evitar tais problemas é usar `CAST()` para que um valor não seja convertido implicitamente para um número em ponto flutuante:

```
mysql> SELECT CAST('9223372036854775807' AS UNSIGNED) = 9223372036854775806;
        -> 0
```

Para mais informações sobre comparações em ponto flutuante, consulte a Seção B.3.4.8, “Problemas com Valores em Ponto Flutuante”.

O servidor inclui `dtoa`, uma biblioteca de conversão que fornece a base para conversões aprimoradas entre valores de string ou `DECIMAL` - DECIMAL, NUMERIC") e números de valor aproximado ( `FLOAT` - FLOAT, DOUBLE")/ `DOUBLE` - FLOAT, DOUBLE")):

* Resultados de conversão consistentes em todas as plataformas, o que elimina, por exemplo, diferenças de conversão entre Unix e Windows.
* Representação precisa dos valores nos casos em que os resultados anteriormente não forneciam precisão suficiente, como para valores próximos aos limites do IEEE.
* Conversão de números para formato de string com a melhor precisão possível. A precisão do `dtoa` é sempre a mesma ou melhor que a das funções padrão da biblioteca C.

Como as conversões produzidas por essa biblioteca diferem em alguns casos dos resultados não `dtoa`, existe a possibilidade de incompatibilidades em aplicações que dependem de resultados anteriores. Por exemplo, aplicações que dependem de um resultado exato específico de conversões anteriores podem precisar de ajustes para acomodar uma precisão adicional.

A biblioteca `dtoa` fornece conversões com as seguintes propriedades. *`D`* representa um valor com uma representação `DECIMAL` - DECIMAL, NUMERIC") ou string, e *`F`* representa um número em ponto flutuante no formato binário nativo (IEEE).

* A conversão de *`F`* para *`D`* é feita com a melhor precisão possível, retornando *`D`* como a string mais curta que gera *`F`* ao ser lida de volta e arredondada para o valor mais próximo no formato binário nativo, conforme especificado pelo IEEE.
* A conversão de *`D`* para *`F`* é feita de tal forma que *`F`* é o número binário nativo mais próximo da string decimal de entrada *`D`*.

Essas propriedades implicam que as conversões *`F`* -> *`D`* -> *`F`* são sem perda, a menos que *`F`* seja `-inf`, `+inf` ou `NaN`. Esses valores não são suportados porque o padrão SQL os define como valores inválidos para `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE").

Para as conversões *`D`* -> *`F`* -> *`D`*, uma condição suficiente para a sem perda é que *`D`* use 15 ou menos dígitos de precisão, não seja um valor denormalizado, `-inf`, `+inf` ou `NaN`. Em alguns casos, a conversão é sem perda mesmo que *`D`* tenha mais de 15 dígitos de precisão, mas isso nem sempre é o caso.

A conversão implícita de um valor numérico ou temporal para string produz um valor que tem um conjunto de caracteres e uma collation determinados pelas variáveis de sistema  `character_set_connection` e  `collation_connection`. (Essas variáveis são comumente definidas com `SET NAMES`. Para informações sobre conjuntos de caracteres de conexão, consulte a Seção 12.4, “Conexões de Conjuntos de Caracteres e Collations”).

Isso significa que tal conversão resulta em uma string de caracteres (não binária) (um valor de `CHAR`, `VARCHAR` ou `LONGTEXT`), exceto no caso em que o conjunto de caracteres de conexão é definido como `binary`. Nesse caso, o resultado da conversão é uma string binária (um valor de `BINARY`, `VARBINARY` ou `LONGBLOB`).

Para expressões numéricas, as observações anteriores sobre a *avaliação* da expressão se aplicam de maneira um pouco diferente para a *asignação* da expressão; por exemplo, em uma declaração como esta:

```
CREATE TABLE t SELECT integer_expr;
```

Neste caso, a tabela na coluna resultante da expressão tem o tipo `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") dependendo da extensão da expressão inteira. Se a extensão máxima da expressão não cabe em um `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), é usado `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") em vez disso. A extensão é obtida a partir do valor `max_length` do conjunto de resultados do `SELECT` (metadados, veja Estruturas de Dados Básicas da API C). Isso significa que você pode forçar um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") em vez de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") usando uma expressão suficientemente longa:

```
CREATE TABLE t SELECT 000000000000000000000;
```