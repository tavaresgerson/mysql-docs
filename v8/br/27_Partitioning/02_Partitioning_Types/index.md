## 26.2 Tipos de Partição

26.2.1 Partição de alcance

26.2.2 LIST Partição

26.2.3 COLUNAS Partição

26.2.4 Partição HASH

26.2.5 Partição de chave

26.2.6 Subpartição

26.2.7 Como o Partição do MySQL lida com NULL

Esta seção discute os tipos de particionamento disponíveis no MySQL 8.0. Estes incluem os tipos listados aqui:

- **Partição por intervalo.** Esse tipo de partição atribui linhas a partições com base nos valores de coluna que caem dentro de um intervalo específico. Consulte a Seção 26.2.1, “Partição por intervalo”. Para informações sobre uma extensão deste tipo, `RANGE COLUMNS`, consulte a Seção 26.2.3.1, “Partição de COLUNAS por intervalo”.

- **Partição por LISTA.** Semelhante à partição por `RANGE`, exceto que a partição é selecionada com base em colunas que correspondem a um conjunto de valores discretos. Consulte a Seção 26.2.2, “Partição por LISTA”. Para informações sobre uma extensão deste tipo, `LIST COLUMNS`, consulte a Seção 26.2.3.2, “Partição por COLUNAS LISTAS”.

- **Partição HASH.** Com este tipo de partição, uma partição é selecionada com base no valor retornado por uma expressão definida pelo usuário que opera nos valores das colunas nas linhas a serem inseridas na tabela. A função pode consistir em qualquer expressão válida no MySQL que produza um valor inteiro. Veja a Seção 26.2.4, “Partição HASH”.

  Uma extensão deste tipo, `LINEAR HASH`, também está disponível, veja a Seção 26.2.4.1, “Divisão por Hash Linear”.

- **Partição de chave.** Este tipo de partição é semelhante à partição por `HASH`, exceto que apenas uma ou mais colunas a serem avaliadas são fornecidas, e o servidor MySQL fornece sua própria função de hashing. Essas colunas podem conter valores que não são inteiros, pois a função de hashing fornecida pelo MySQL garante um resultado inteiro, independentemente do tipo de dado da coluna. Uma extensão para este tipo, `LINEAR KEY`, também está disponível. Veja a Seção 26.2.5, “Partição de Chave”.

Um uso muito comum da partição de banco de dados é a segregação de dados por data. Alguns sistemas de banco de dados suportam partição explícita de data, o que o MySQL não implementa no 8.0. No entanto, não é difícil no MySQL criar esquemas de partição com base nas colunas `DATE`, `TIME` ou `DATETIME`, ou com base em expressões que utilizam essas colunas.

Ao particionar por `KEY` ou `LINEAR KEY`, você pode usar uma coluna `DATE`, `TIME` ou `DATETIME` como a coluna de particionamento sem realizar nenhuma modificação no valor da coluna. Por exemplo, essa declaração de criação de tabela é perfeitamente válida no MySQL:

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

No MySQL 8.0, também é possível usar uma coluna `DATE` ou `DATETIME` como coluna de particionamento usando a particionamento `RANGE COLUMNS` e `LIST COLUMNS`.

Outros tipos de particionamento exigem uma expressão de particionamento que produza um valor inteiro ou `NULL`. Se você deseja usar a particionamento baseado em data por `RANGE`, `LIST`, `HASH` ou `LINEAR HASH`, você pode simplesmente usar uma função que opere em uma coluna `DATE`, `TIME` ou `DATETIME` e retorne esse valor, como mostrado aqui:

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

Exemplos adicionais de particionamento usando datas podem ser encontrados nas seções seguintes deste capítulo:

- Seção 26.2.1, “Divisão de alcance”
- Seção 26.2.4, “Divisão por HASH”
- Seção 26.2.4.1, “Divisão por Hash Linear”

Para exemplos mais complexos de partição baseada em data, consulte as seções a seguir:

- Seção 26.4, “Rimação de Partição”
- Seção 26.2.6, “Subpartição”

A partição do MySQL é otimizada para uso com as funções `TO_DAYS()`, `YEAR()` e `TO_SECONDS()`. No entanto, você pode usar outras funções de data e hora que retornam um inteiro ou `NULL`, como `WEEKDAY()`, `DAYOFYEAR()` ou `MONTH()`. Consulte a Seção 14.7, “Funções de Data e Hora”, para obter mais informações sobre essas funções.

É importante lembrar — independentemente do tipo de particionamento que você usar — que as partições são sempre numeradas automaticamente e em sequência ao serem criadas, começando com `0`. Quando uma nova linha é inserida em uma tabela particionada, são esses números de partição que são usados para identificar a partição correta. Por exemplo, se sua tabela usa 4 partições, essas partições são numeradas `0`, `1`, `2` e `3`. Para os tipos de particionamento `RANGE` e `LIST`, é necessário garantir que haja uma partição definida para cada número de partição. Para o particionamento `HASH`, a expressão fornecida pelo usuário deve avaliar a um valor inteiro. Para o particionamento `KEY`, essa questão é cuidada automaticamente pela função de hashing que o servidor MySQL emprega internamente.

Os nomes das partições geralmente seguem as regras que regem outros identificadores do MySQL, como os de tabelas e bancos de dados. No entanto, você deve notar que os nomes das partições não são sensíveis ao caso. Por exemplo, a seguinte instrução `CREATE TABLE` falha, conforme mostrado:

```
mysql> CREATE TABLE t2 (val INT)
    -> PARTITION BY LIST(val)(
    ->     PARTITION mypart VALUES IN (1,3,5),
    ->     PARTITION MyPart VALUES IN (2,4,6)
    -> );
ERROR 1488 (HY000): Duplicate partition name mypart
```

O erro ocorre porque o MySQL não vê nenhuma diferença entre os nomes das partições `mypart` e `MyPart`.

Quando você especificar o número de partições para a tabela, ele deve ser expresso como um literal inteiro positivo e não nulo, sem zeros no início, e não pode ser uma expressão como `0.8E+01` ou `6-2`, mesmo que ele seja avaliado como um valor inteiro. Frações decimais não são permitidas.

Nas seções que se seguem, não fornecemos necessariamente todas as formas possíveis para a sintaxe que pode ser usada para criar cada tipo de partição; para obter essas informações, consulte a Seção 15.1.20, “Instrução CREATE TABLE”.
