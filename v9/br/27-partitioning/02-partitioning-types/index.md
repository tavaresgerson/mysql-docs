## Tipos de Partição

26.2.1 Partição POR CAMPO

26.2.2 Partição POR LISTA

26.2.3 Partição POR COLUNAS

26.2.4 Partição POR HASH

26.2.5 Partição POR CHAVE

26.2.6 Subpartição

26.2.7 Como a Partição do MySQL Lida com NULL

Esta seção discute os tipos de partição disponíveis no MySQL 9.5. Eles incluem os tipos listados aqui:

* **Partição POR CAMPO.** Este tipo de partição atribui linhas a partições com base nos valores de coluna que caem dentro de um intervalo específico. Consulte a Seção 26.2.1, “Partição POR CAMPO”. Para informações sobre uma extensão deste tipo, `Partição POR COLUNAS`, consulte a Seção 26.2.3.1, “Partição POR COLUNAS”.

* **Partição POR LISTA.** Semelhante à partição por `RANGE`, exceto que a partição é selecionada com base em colunas que correspondem a um dos conjuntos de valores discretos. Consulte a Seção 26.2.2, “Partição POR LISTA”. Para informações sobre uma extensão deste tipo, `Partição POR COLUNAS`, consulte a Seção 26.2.3.2, “Partição POR COLUNAS”.

* **Partição POR HASH.** Com este tipo de partição, uma partição é selecionada com base no valor retornado por uma expressão definida pelo usuário que opera nos valores de coluna das linhas a serem inseridas na tabela. A função pode consistir em qualquer expressão válida no MySQL que produza um valor inteiro. Consulte a Seção 26.2.4, “Partição POR HASH”.

  Uma extensão deste tipo, `HASH LINEAR`, também está disponível, consulte a Seção 26.2.4.1, “Partição POR HASH LINEAR”.

* **Partição de chave.** Este tipo de partição é semelhante à partição por `HASH`, exceto que apenas uma ou mais colunas a serem avaliadas são fornecidas, e o servidor MySQL fornece sua própria função de hashing. Essas colunas podem conter valores que não são inteiros, uma vez que a função de hashing fornecida pelo MySQL garante um resultado inteiro, independentemente do tipo de dado da coluna. Uma extensão deste tipo, `LINEAR KEY`, também está disponível. Veja a Seção 26.2.5, “Partição de Chave”.

Um uso muito comum da partição de banco de dados é segregar dados por data. Alguns sistemas de banco de dados suportam partição explícita por data, o que o MySQL não implementa no 9.5. No entanto, não é difícil no MySQL criar esquemas de partição baseados em colunas `DATE`, `TIME` ou `DATETIME`, ou baseados em expressões que fazem uso dessas colunas.

Ao partir por `KEY` ou `LINEAR KEY`, você pode usar uma coluna `DATE`, `TIME` ou `DATETIME` como a coluna de partição sem realizar nenhuma modificação no valor da coluna. Por exemplo, esta declaração de criação de tabela é perfeitamente válida no MySQL:

```
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

No MySQL 9.5, também é possível usar uma coluna `DATE` ou `DATETIME` como a coluna de partição usando a partição `RANGE COLUMNS` e `LIST COLUMNS`.

Outros tipos de partição requerem uma expressão de partição que produza um valor inteiro ou `NULL`. Se você deseja usar a partição baseada em data por `RANGE`, `LIST`, `HASH` ou `LINEAR HASH`, você pode simplesmente usar uma função que opere em uma coluna `DATE`, `TIME` ou `DATETIME` e retorne tal valor, como mostrado aqui:

```
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

Exemplos adicionais de partição usando datas podem ser encontrados nas seções seguintes deste capítulo:

* Seção 26.2.1, “Divisão por intervalo”
* Seção 26.2.4, “Divisão por hash”
* Seção 26.2.4.1, “Divisão por hash linear”

Para exemplos mais complexos de divisão por data, consulte as seções seguintes:

* Seção 26.4, “Limpeza de partições”
* Seção 26.2.6, “Subdivisão”

A divisão por partições do MySQL é otimizada para uso com as funções `TO_DAYS()`, `YEAR()` e `TO_SECONDS()`. No entanto, você pode usar outras funções de data e hora que retornam um inteiro ou `NULL`, como `WEEKDAY()`, `DAYOFYEAR()` ou `MONTH()`. Consulte a Seção 14.7, “Funções de data e hora”, para obter mais informações sobre essas funções.

É importante lembrar — independentemente do tipo de divisão que você usar — que as partições são sempre numeradas automaticamente e em sequência ao serem criadas, começando com `0`. Quando uma nova linha é inserida em uma tabela dividida, são esses números de partição que são usados para identificar a partição correta. Por exemplo, se sua tabela usa 4 partições, essas partições são numeradas `0`, `1`, `2` e `3`. Para os tipos de divisão `RANGE` e `LIST`, é necessário garantir que haja uma partição definida para cada número de partição. Para a divisão `HASH`, a expressão fornecida pelo usuário deve avaliar a um valor inteiro. Para a divisão `KEY`, essa questão é cuidada automaticamente pela função de hashing que o servidor MySQL emprega internamente.

Os nomes das partições geralmente seguem as regras que regem outros identificadores do MySQL, como os de tabelas e bancos de dados. No entanto, você deve notar que os nomes das partições não são case-sensitive. Por exemplo, a seguinte instrução `CREATE TABLE` falha como mostrado:

```
mysql> CREATE TABLE t2 (val INT)
    -> PARTITION BY LIST(val)(
    ->     PARTITION mypart VALUES IN (1,3,5),
    ->     PARTITION MyPart VALUES IN (2,4,6)
    -> );
ERROR 1488 (HY000): Duplicate partition name mypart
```

A falha ocorre porque o MySQL não vê nenhuma diferença entre os nomes das partições `mypart` e `MyPart`.

Quando você especificar o número de partições para a tabela, ele deve ser expresso como um literal inteiro positivo e não nulo, sem zeros no início, e não pode ser uma expressão como `0.8E+01` ou `6-2`, mesmo que ele seja avaliado a um valor inteiro. Frações decimais não são permitidas.

Nas seções a seguir, não fornecemos necessariamente todas as formas possíveis para a sintaxe que pode ser usada para criar cada tipo de partição; para obter essas informações, consulte a Seção 15.1.24, “Instrução CREATE TABLE”.