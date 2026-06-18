### 8.3.8 Comparação de índices B-Tree e Hash

Entender as estruturas de dados B-tree e hash pode ajudar a prever como diferentes consultas se comportam em diferentes motores de armazenamento que utilizam essas estruturas de dados em seus índices, especialmente para o motor de armazenamento `MEMORY`, que permite que você escolha índices B-tree ou hash.

- Características do índice B-Tree
- Características do Índice Hash

#### Características do índice B-Tree

Um índice de árvore B pode ser usado para comparações de colunas em expressões que utilizam os operadores `=`, `>`, `>=`, `<`, `<=` ou `BETWEEN`. O índice também pode ser usado para comparações `LIKE` se o argumento de `LIKE` for uma string constante que não comece com um caractere de curinga. Por exemplo, as seguintes instruções `SELECT` utilizam índices:

```sql
SELECT * FROM tbl_name WHERE key_col LIKE 'Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE 'Pat%_ck%';
```

Na primeira declaração, apenas as linhas com `'Patrick' <= key_col < 'Patricl'` são consideradas. Na segunda declaração, apenas as linhas com `'Pat' <= key_col < 'Pau'` são consideradas.

As seguintes instruções `SELECT` não usam índices:

```sql
SELECT * FROM tbl_name WHERE key_col LIKE '%Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE other_col;
```

Na primeira declaração, o valor `LIKE` começa com um caractere de comodínio. Na segunda declaração, o valor `LIKE` não é uma constante.

Se você usar `... LIKE '%string%'` e *`string`* tiver mais de três caracteres, o MySQL usa o algoritmo Turbo Boyer-Moore para inicializar o padrão para a string e, em seguida, usa esse padrão para realizar a pesquisa mais rapidamente.

Uma pesquisa usando `col_name IS NULL` utiliza índices se *`col_name`* estiver indexado.

Qualquer índice que não abranja todos os níveis `AND` na cláusula `WHERE` não é usado para otimizar a consulta. Em outras palavras, para poder usar um índice, um prefixo do índice deve ser usado em cada grupo `AND`.

As seguintes cláusulas `WHERE` usam índices:

```sql
... WHERE index_part1=1 AND index_part2=2 AND other_column=3

    /* index = 1 OR index = 2 */
... WHERE index=1 OR A=10 AND index=2

    /* optimized like "index_part1='hello'" */
... WHERE index_part1='hello' AND index_part3=5

    /* Can use index on index1 but not on index2 or index3 */
... WHERE index1=1 AND index2=2 OR index1=3 AND index3=3;
```

Essas cláusulas `WHERE` *não* usam índices:

```sql
    /* index_part1 is not used */
... WHERE index_part2=1 AND index_part3=2

    /*  Index is not used in both parts of the WHERE clause  */
... WHERE index=1 OR A=10

    /* No index spans all rows  */
... WHERE index_part1=1 OR index_part2=10
```

Às vezes, o MySQL não usa um índice, mesmo que ele esteja disponível. Uma circunstância em que isso ocorre é quando o otimizador estima que o uso do índice exigiria que o MySQL acessasse uma porcentagem muito grande das linhas da tabela. (Neste caso, uma varredura da tabela provavelmente será muito mais rápida, pois requer menos buscas.) No entanto, se uma consulta desse tipo usar `LIMIT` para recuperar apenas algumas das linhas, o MySQL usa o índice de qualquer forma, porque pode encontrar muito mais rapidamente as poucas linhas a serem retornadas no resultado.

#### Características do Índice Hash

Os índices hash têm características um pouco diferentes das discutidas anteriormente:

- Eles são usados apenas para comparações de igualdade que utilizam os operadores `=` ou `=>` (mas são *muito* rápidos). Eles não são usados para operadores de comparação, como `<`, que encontram uma faixa de valores. Os sistemas que dependem desse tipo de busca de um único valor são conhecidos como "armazenamentos de chave-valor"; para usar o MySQL para tais aplicações, use índices hash sempre que possível.

- O otimizador não pode usar um índice de hash para acelerar as operações de `ORDER BY`. (Esse tipo de índice não pode ser usado para buscar a próxima entrada na ordem.)

- O MySQL não consegue determinar aproximadamente quantas linhas existem entre dois valores (isso é usado pelo otimizador de intervalo para decidir qual índice usar). Isso pode afetar algumas consultas se você alterar uma tabela `MyISAM` ou `InnoDB` para uma tabela `MEMORY` indexada por hash.

- Apenas chaves inteiras podem ser usadas para pesquisar uma linha. (Com um índice de árvore B, qualquer prefixo mais à esquerda da chave pode ser usado para encontrar linhas.)
