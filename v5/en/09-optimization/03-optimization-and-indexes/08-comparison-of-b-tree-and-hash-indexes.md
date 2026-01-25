### 8.3.8 Comparação de Indexes B-Tree e Hash

Entender as estruturas de dados B-tree e hash pode ajudar a prever como diferentes Queries performam em diferentes storage engines que utilizam essas estruturas de dados em seus Indexes, particularmente para o storage engine `MEMORY`, que permite escolher Indexes B-tree ou hash.

* Características do Index B-tree
* Características do Index Hash

#### Características do Index B-tree

Um Index B-tree pode ser usado para comparações de colunas em expressões que utilizam os operadores `=`, `>`, `>=`, `<`, `<=`, ou `BETWEEN`. O Index também pode ser usado para comparações `LIKE` se o argumento para `LIKE` for uma string constante que não comece com um caractere wildcard. Por exemplo, os seguintes comandos `SELECT` utilizam Indexes:

```sql
SELECT * FROM tbl_name WHERE key_col LIKE 'Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE 'Pat%_ck%';
```

No primeiro comando, apenas as linhas com `'Patrick' <= key_col < 'Patricl'` são consideradas. No segundo comando, apenas as linhas com `'Pat' <= key_col < 'Pau'` são consideradas.

Os seguintes comandos `SELECT` não utilizam Indexes:

```sql
SELECT * FROM tbl_name WHERE key_col LIKE '%Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE other_col;
```

No primeiro comando, o valor `LIKE` começa com um caractere wildcard. No segundo comando, o valor `LIKE` não é uma constante.

Se você usar `... LIKE '%string%'` e *`string`* for mais longa que três caracteres, o MySQL usa o algoritmo Turbo Boyer-Moore para inicializar o padrão da string e então usa esse padrão para realizar a busca mais rapidamente.

Uma busca usando `col_name IS NULL` utiliza Indexes se *`col_name`* for indexada.

Qualquer Index que não abranja todos os níveis `AND` na cláusula `WHERE` não é usado para otimizar a Query. Em outras palavras, para poder usar um Index, um prefixo do Index deve ser usado em cada grupo `AND`.

As seguintes cláusulas `WHERE` usam Indexes:

```sql
... WHERE index_part1=1 AND index_part2=2 AND other_column=3

    /* index = 1 OR index = 2 */
... WHERE index=1 OR A=10 AND index=2

    /* optimized like "index_part1='hello'" */
... WHERE index_part1='hello' AND index_part3=5

    /* Can use index on index1 but not on index2 or index3 */
... WHERE index1=1 AND index2=2 OR index1=3 AND index3=3;
```

Estas cláusulas `WHERE` *não* usam Indexes:

```sql
    /* index_part1 is not used */
... WHERE index_part2=1 AND index_part3=2

    /*  Index is not used in both parts of the WHERE clause  */
... WHERE index=1 OR A=10

    /* No index spans all rows  */
... WHERE index_part1=1 OR index_part2=10
```

Às vezes, o MySQL não usa um Index, mesmo que haja um disponível. Uma circunstância em que isso ocorre é quando o otimizador estima que usar o Index exigiria que o MySQL acessasse uma porcentagem muito grande das linhas na tabela. (Neste caso, um table scan provavelmente seria muito mais rápido porque exige menos seeks.) No entanto, se essa Query usar `LIMIT` para recuperar apenas algumas das linhas, o MySQL usará um Index de qualquer forma, pois pode encontrar muito mais rapidamente as poucas linhas a serem retornadas no resultado.

#### Características do Index Hash

Os hash indexes têm características um pouco diferentes das que acabamos de discutir:

* Eles são usados apenas para comparações de igualdade que utilizam os operadores `=` ou `<=>` (mas são *muito* rápidos). Não são usados para operadores de comparação como `<` que encontram um range de valores. Sistemas que dependem desse tipo de lookup de valor único são conhecidos como “key-value stores”; para usar o MySQL para tais aplicações, utilize hash indexes sempre que possível.

* O otimizador não pode usar um hash index para acelerar operações `ORDER BY`. (Este tipo de Index não pode ser usado para buscar a próxima entrada em ordem.)

* O MySQL não pode determinar aproximadamente quantas linhas existem entre dois valores (isso é usado pelo range optimizer para decidir qual Index utilizar). Isso pode afetar algumas Queries se você alterar uma tabela `MyISAM` ou `InnoDB` para uma tabela `MEMORY` indexada por hash.

* Apenas chaves inteiras podem ser usadas para buscar uma linha. (Com um Index B-tree, qualquer prefixo à esquerda da chave pode ser usado para encontrar linhas.)