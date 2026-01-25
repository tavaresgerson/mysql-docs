### 22.2.4 HASH Partitioning

[22.2.4.1 LINEAR HASH Partitioning](partitioning-linear-hash.html)

O Partitioning por `HASH` é usado principalmente para garantir uma distribuição uniforme de dados entre um número predeterminado de partitions. Com range ou list partitioning, você deve especificar explicitamente em qual partition um determinado valor de coluna ou conjunto de valores de coluna deve ser armazenado; com hash partitioning, o MySQL cuida disso para você, e você só precisa especificar um valor de coluna ou uma expression baseada em um valor de coluna a ser hashed e o número de partitions nas quais a tabela particionada deve ser dividida.

Para particionar uma tabela usando `HASH` partitioning, é necessário anexar à instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") uma cláusula `PARTITION BY HASH (expr)`, onde *`expr`* é uma expression que retorna um integer. Isso pode ser simplesmente o nome de uma coluna cujo tipo é um dos tipos integer do MySQL. Além disso, é muito provável que você queira seguir isso com `PARTITIONS num`, onde *`num`* é um integer positivo que representa o número de partitions nas quais a tabela deve ser dividida.

Note

Por uma questão de simplicidade, as tabelas nos exemplos a seguir não utilizam nenhuma key. Você deve estar ciente de que, se uma tabela tiver qualquer unique key, toda coluna usada na expression de partitioning para esta tabela deve fazer parte de toda unique key, incluindo a primary key. Consulte [Seção 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys"), para obter mais informações.

A instrução a seguir cria uma tabela que usa hashing na coluna `store_id` e é dividida em 4 partitions:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY HASH(store_id)
PARTITIONS 4;
```

Se você não incluir uma cláusula `PARTITIONS`, o número de partitions assume o valor padrão de `1`.

Usar a palavra-chave `PARTITIONS` sem um número subsequente resulta em um erro de sintaxe.

Você também pode usar uma expression SQL que retorna um integer para *`expr`*. Por exemplo, você pode querer particionar com base no ano em que um funcionário foi contratado. Isso pode ser feito conforme mostrado aqui:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY HASH( YEAR(hired) )
PARTITIONS 4;
```

*`expr`* deve retornar um valor integer não constante e não randômico (em outras palavras, deve ser variável, mas determinístico), e não deve conter quaisquer construções proibidas, conforme descrito em [Seção 22.6, “Restrictions and Limitations on Partitioning”](partitioning-limitations.html "22.6 Restrictions and Limitations on Partitioning"). Você também deve ter em mente que esta expression é avaliada toda vez que uma row é inserida ou atualizada (ou possivelmente deletada); isso significa que expressions muito complexas podem causar problemas de performance, particularmente ao realizar operações (como inserts em lote) que afetam um grande número de rows de uma só vez.

A hashing function mais eficiente é aquela que opera em uma única coluna da tabela e cujo valor aumenta ou diminui consistentemente com o valor da coluna, pois isso permite o “pruning” (poda) em ranges de partitions. Ou seja, quanto mais de perto a expression variar com o valor da coluna na qual ela está baseada, mais eficientemente o MySQL pode usar a expression para hash partitioning.

Por exemplo, onde `date_col` é uma coluna do tipo [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), a expression [`TO_DAYS(date_col)`](date-and-time-functions.html#function_to-days) varia diretamente com o valor de `date_col`, pois para cada alteração no valor de `date_col`, o valor da expression muda de maneira consistente. A variação da expression [`YEAR(date_col)`](date-and-time-functions.html#function_year) em relação a `date_col` não é tão direta quanto a de [`TO_DAYS(date_col)`](date-and-time-functions.html#function_to-days), porque nem toda mudança possível em `date_col` produz uma mudança equivalente em [`YEAR(date_col)`](date-and-time-functions.html#function_year). Mesmo assim, [`YEAR(date_col)`](date-and-time-functions.html#function_year) é uma boa candidata para uma hashing function, pois varia diretamente com uma porção de `date_col` e não há nenhuma mudança possível em `date_col` que produza uma alteração desproporcional em [`YEAR(date_col)`](date-and-time-functions.html#function_year).

Em contraste, suponha que você tenha uma coluna chamada `int_col` cujo tipo é [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Agora considere a expression [`POW(5-int_col,3) + 6`](mathematical-functions.html#function_pow). Esta seria uma escolha ruim para uma hashing function porque uma alteração no valor de `int_col` não garante a produção de uma alteração proporcional no valor da expression. Alterar o valor de `int_col` em uma determinada quantidade pode produzir alterações amplamente divergentes no valor da expression. Por exemplo, mudar `int_col` de `5` para `6` produz uma alteração de `-1` no valor da expression, mas mudar o valor de `int_col` de `6` para `7` produz uma alteração de `-7` no valor da expression.

Em outras palavras, quanto mais de perto o gráfico do valor da coluna em comparação com o valor da expression seguir uma linha reta traçada pela equação `y=cx`, onde *`c`* é alguma constante diferente de zero, melhor a expression é adequada para hashing. Isso está relacionado ao fato de que quanto mais não linear for uma expression, mais desigual será a distribuição de dados entre as partitions que ela tende a produzir.

Em teoria, o pruning também é possível para expressions que envolvem mais de um valor de coluna, mas determinar quais dessas expressions são adequadas pode ser bastante difícil e demorado. Por esse motivo, o uso de hashing expressions que envolvam múltiplas colunas não é particularmente recomendado.

Quando `PARTITION BY HASH` é usado, o MySQL determina qual partition das *`num`* partitions usar com base no módulo do resultado da expression. Em outras palavras, para uma determinada expression *`expr`*, a partition na qual o registro é armazenado é a partition número *`N`*, onde `N = MOD(expr, num)`. Suponha que a tabela `t1` seja definida da seguinte forma, de modo que tenha 4 partitions:

```sql
CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATE)
    PARTITION BY HASH( YEAR(col3) )
    PARTITIONS 4;
```

Se você inserir um registro em `t1` cujo valor de `col3` é `'2005-09-15'`, a partition na qual ele é armazenado é determinada da seguinte forma:

```sql
MOD(YEAR('2005-09-01'),4)
=  MOD(2005,4)
=  1
```

O MySQL 5.7 também suporta uma variante de `HASH` partitioning conhecida como linear hashing, que emprega um algoritmo mais complexo para determinar o posicionamento de novas rows inseridas na tabela particionada. Consulte [Seção 22.2.4.1, “LINEAR HASH Partitioning”](partitioning-linear-hash.html "22.2.4.1 LINEAR HASH Partitioning"), para obter uma descrição deste algoritmo.

A expression fornecida pelo usuário é avaliada toda vez que um registro é inserido ou atualizado. Ela também pode — dependendo das circunstâncias — ser avaliada quando registros são deletados.