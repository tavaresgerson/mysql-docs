## 22.2 Tipos de Partitioning

[22.2.1 RANGE Partitioning](partitioning-range.html)

[22.2.2 LIST Partitioning](partitioning-list.html)

[22.2.3 COLUMNS Partitioning](partitioning-columns.html)

[22.2.4 HASH Partitioning](partitioning-hash.html)

[22.2.5 KEY Partitioning](partitioning-key.html)

[22.2.6 Subpartitioning](partitioning-subpartitions.html)

[22.2.7 Como o Partitioning do MySQL Lida com NULL](partitioning-handling-nulls.html)

Esta seção discute os tipos de partitioning disponíveis no MySQL 5.7. Estes incluem os tipos listados aqui:

* **RANGE partitioning.** Este tipo de partitioning atribui linhas a partições com base em valores de coluna que se enquadram em um determinado range. Consulte [Section 22.2.1, “RANGE Partitioning”](partitioning-range.html "22.2.1 RANGE Partitioning"). Para obter informações sobre uma extensão a este tipo, `RANGE COLUMNS`, consulte [Section 22.2.3.1, “RANGE COLUMNS partitioning”](partitioning-columns-range.html "22.2.3.1 RANGE COLUMNS partitioning").

* **LIST partitioning.** Semelhante ao partitioning por `RANGE`, exceto que a partição é selecionada com base em colunas que correspondem a um conjunto de valores discretos. Consulte [Section 22.2.2, “LIST Partitioning”](partitioning-list.html "22.2.2 LIST Partitioning"). Para obter informações sobre uma extensão a este tipo, `LIST COLUMNS`, consulte [Section 22.2.3.2, “LIST COLUMNS partitioning”](partitioning-columns-list.html "22.2.3.2 LIST COLUMNS partitioning").

* **HASH partitioning.** Com este tipo de partitioning, uma partição é selecionada com base no valor retornado por uma expressão definida pelo usuário que opera em valores de coluna nas linhas a serem inseridas na tabela. A função pode consistir em qualquer expressão válida no MySQL que produza um valor inteiro. Consulte [Section 22.2.4, “HASH Partitioning”](partitioning-hash.html "22.2.4 HASH Partitioning").

  Uma extensão a este tipo, `LINEAR HASH`, também está disponível; consulte [Section 22.2.4.1, “LINEAR HASH Partitioning”](partitioning-linear-hash.html "22.2.4.1 LINEAR HASH Partitioning").

* **KEY partitioning.** Este tipo de partitioning é semelhante ao partitioning por `HASH`, exceto que apenas uma ou mais colunas a serem avaliadas são fornecidas, e o servidor MySQL fornece sua própria função de hashing. Essas colunas podem conter valores diferentes de inteiros, uma vez que a função de hashing fornecida pelo MySQL garante um resultado inteiro, independentemente do tipo de dados da coluna. Uma extensão a este tipo, `LINEAR KEY`, também está disponível. Consulte [Section 22.2.5, “KEY Partitioning”](partitioning-key.html "22.2.5 KEY Partitioning").

Um uso muito comum do database partitioning é segregar dados por data. Alguns sistemas de banco de dados suportam partitioning explícito por data, o que o MySQL não implementa no 5.7. No entanto, não é difícil no MySQL criar esquemas de partitioning baseados em colunas [`DATE`], [`TIME`] ou [`DATETIME`], ou baseados em expressões que utilizam tais colunas.

Ao particionar por `KEY` ou `LINEAR KEY`, você pode usar uma coluna [`DATE`], [`TIME`] ou [`DATETIME`] como a coluna de partitioning sem realizar qualquer modificação no valor da coluna. Por exemplo, esta instrução de criação de tabela é perfeitamente válida no MySQL:

```sql
CREATE TABLE members (
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(35),
    joined DATE NOT NULL
)
PARTITION BY KEY(joined)
PARTITIONS 6;
```

No MySQL 5.7, também é possível usar uma coluna [`DATE`] ou [`DATETIME`] como a coluna de partitioning usando partitioning `RANGE COLUMNS` e `LIST COLUMNS`.

No entanto, os outros tipos de partitioning do MySQL exigem uma expressão de partitioning que produza um valor inteiro ou `NULL`. Se você deseja usar partitioning baseado em data por `RANGE`, `LIST`, `HASH` ou `LINEAR HASH`, você pode simplesmente empregar uma função que opere em uma coluna [`DATE`], [`TIME`] ou [`DATETIME`] e retorne tal valor, conforme mostrado aqui:

```sql
CREATE TABLE members (
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(35),
    joined DATE NOT NULL
)
PARTITION BY RANGE( YEAR(joined) ) (
    PARTITION p0 VALUES LESS THAN (1960),
    PARTITION p1 VALUES LESS THAN (1970),
    PARTITION p2 VALUES LESS THAN (1980),
    PARTITION p3 VALUES LESS THAN (1990),
    PARTITION p4 VALUES LESS THAN MAXVALUE
);
```

Exemplos adicionais de partitioning usando datas podem ser encontrados nas seguintes seções deste capítulo:

* [Section 22.2.1, “RANGE Partitioning”](partitioning-range.html "22.2.1 RANGE Partitioning")
* [Section 22.2.4, “HASH Partitioning”](partitioning-hash.html "22.2.4 HASH Partitioning")
* [Section 22.2.4.1, “LINEAR HASH Partitioning”](partitioning-linear-hash.html "22.2.4.1 LINEAR HASH Partitioning")

Para exemplos mais complexos de partitioning baseado em data, consulte as seguintes seções:

* [Section 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning")
* [Section 22.2.6, “Subpartitioning”](partitioning-subpartitions.html "22.2.6 Subpartitioning")

O partitioning do MySQL é otimizado para uso com as funções [`TO_DAYS()`], [`YEAR()`] e [`TO_SECONDS()`]. No entanto, você pode usar outras funções de data e hora que retornam um inteiro ou `NULL`, como [`WEEKDAY()`], [`DAYOFYEAR()`] ou [`MONTH()`]. Consulte [Section 12.7, “Date and Time Functions”], para obter mais informações sobre tais funções.

É importante lembrar—independentemente do tipo de partitioning que você utilize—que as partições são sempre numeradas automaticamente e em sequência quando criadas, começando por `0`. Quando uma nova row é inserida em uma tabela particionada, são esses números de partição que são usados para identificar a partição correta. Por exemplo, se sua tabela usa 4 partições, estas são numeradas como `0`, `1`, `2` e `3`. Para os tipos de partitioning `RANGE` e `LIST`, é necessário garantir que haja uma partição definida para cada número de partição. Para o partitioning `HASH`, a expressão fornecida pelo usuário deve ser avaliada como um valor inteiro. Para o partitioning `KEY`, esta questão é tratada automaticamente pela função de hashing que o servidor MySQL emprega internamente.

Os nomes das partições geralmente seguem as regras que governam outros identificadores do MySQL, como aqueles para tables e databases. No entanto, você deve notar que os nomes das partições não diferenciam maiúsculas de minúsculas (case-sensitive). Por exemplo, a seguinte instrução [`CREATE TABLE`] falha conforme mostrado:

```sql
mysql> CREATE TABLE t2 (val INT)
    -> PARTITION BY LIST(val)(
    ->     PARTITION mypart VALUES IN (1,3,5),
    ->     PARTITION MyPart VALUES IN (2,4,6)
    -> );
ERROR 1488 (HY000): Duplicate partition name mypart
```

A falha ocorre porque o MySQL não vê diferença entre os nomes de partição `mypart` e `MyPart`.

Ao especificar o número de partições para a tabela, ele deve ser expresso como um literal inteiro positivo, diferente de zero e sem zeros à esquerda, e não pode ser uma expressão como `0.8E+01` ou `6-2`, mesmo que seja avaliada como um valor inteiro. Frações decimais não são permitidas.

Nas seções a seguir, não fornecemos necessariamente todas as formas possíveis para a sintaxe que pode ser usada para criar cada tipo de partição; esta informação pode ser encontrada em [Section 13.1.18, “CREATE TABLE Statement”].