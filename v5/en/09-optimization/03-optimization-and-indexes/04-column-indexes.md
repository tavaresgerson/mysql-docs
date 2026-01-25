### 8.3.4 Indexes de Coluna

O tipo de Index mais comum envolve uma única coluna, armazenando cópias dos valores dessa coluna em uma estrutura de dados, permitindo buscas rápidas (fast lookups) pelas linhas com os valores de coluna correspondentes. A estrutura de dados B-tree permite que o Index encontre rapidamente um valor específico, um conjunto de valores ou um intervalo de valores, correspondendo a operadores como `=`, `>`, `≤`, `BETWEEN`, `IN`, e assim por diante, em uma cláusula `WHERE`.

O número máximo de Indexes por tabela e o comprimento máximo do Index são definidos por Storage Engine. Consulte o Capítulo 14, *The InnoDB Storage Engine*, e o Capítulo 15, *Alternative Storage Engines*. Todos os Storage Engines suportam pelo menos 16 Indexes por tabela e um comprimento total de Index de pelo menos 256 bytes. A maioria dos Storage Engines possui limites mais altos.

Para informações adicionais sobre Indexes de coluna, consulte a Seção 13.1.14, “CREATE INDEX Statement”.

* Prefixos de Index
* Indexes FULLTEXT
* Indexes Espaciais
* Indexes no Storage Engine MEMORY

#### Prefixos de Index

Com a sintaxe `col_name(N)` em uma especificação de Index para uma coluna de string, você pode criar um Index que usa apenas os primeiros *`N`* caracteres da coluna. Indexar apenas um prefixo dos valores da coluna dessa forma pode tornar o arquivo de Index muito menor. Ao indexar uma coluna `BLOB` ou `TEXT`, você *deve* especificar um comprimento de prefixo para o Index. Por exemplo:

```sql
CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
```

Prefixos podem ter até 1000 bytes de comprimento (767 bytes para tabelas `InnoDB`, a menos que você tenha `innodb_large_prefix` configurado).

Nota

Limites de prefixo são medidos em bytes, enquanto o comprimento do prefixo nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` é interpretado como o número de caracteres para tipos de string não binárias (`CHAR`, `VARCHAR`, `TEXT`) e o número de bytes para tipos de string binárias (`BINARY`, `VARBINARY`, `BLOB`). Leve isso em consideração ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

Se um termo de busca exceder o comprimento do prefixo do Index, o Index é usado para excluir linhas não correspondentes, e as linhas restantes são examinadas para possíveis correspondências.

Para informações adicionais sobre prefixos de Index, consulte a Seção 13.1.14, “CREATE INDEX Statement”.

#### Indexes FULLTEXT

Indexes `FULLTEXT` são usados para buscas de texto completo (full-text searches). Apenas os Storage Engines `InnoDB` e `MyISAM` suportam Indexes `FULLTEXT`, e somente para colunas `CHAR`, `VARCHAR` e `TEXT`. A Indexação sempre ocorre sobre a coluna inteira e a Indexação de prefixo de coluna não é suportada. Para detalhes, consulte a Seção 12.9, “Full-Text Search Functions”.

Otimizações são aplicadas a certos tipos de Queries `FULLTEXT` contra tabelas `InnoDB` únicas. Queries com estas características são particularmente eficientes:

* Queries `FULLTEXT` que retornam apenas o ID do documento, ou o ID do documento e o rank de busca.

* Queries `FULLTEXT` que ordenam as linhas correspondentes em ordem decrescente de score e aplicam uma cláusula `LIMIT` para obter as N linhas correspondentes principais. Para que esta otimização se aplique, não deve haver cláusulas `WHERE` e apenas uma única cláusula `ORDER BY` em ordem decrescente.

* Queries `FULLTEXT` que recuperam apenas o valor `COUNT(*)` de linhas correspondentes a um termo de busca, sem cláusulas `WHERE` adicionais. Codifique a cláusula `WHERE` como `WHERE MATCH(text) AGAINST ('other_text')`, sem nenhum operador de comparação `> 0`.

Para Queries que contêm expressões de texto completo, o MySQL avalia essas expressões durante a fase de otimização da execução da Query. O optimizer não apenas examina expressões de texto completo e faz estimativas, ele as avalia de fato no processo de desenvolvimento de um plano de execução.

Uma implicação desse comportamento é que o `EXPLAIN` para Queries de texto completo é tipicamente mais lento do que para Queries sem texto completo, para as quais nenhuma avaliação de expressão ocorre durante a fase de otimização.

O `EXPLAIN` para Queries de texto completo pode mostrar `Select tables optimized away` na coluna `Extra` devido à correspondência que ocorre durante a otimização; neste caso, nenhum acesso à tabela precisa ocorrer durante a execução posterior.

#### Indexes Espaciais

Você pode criar Indexes em tipos de dados espaciais (spatial data types). `MyISAM` e `InnoDB` suportam Indexes R-tree em tipos espaciais. Outros Storage Engines usam B-trees para Indexação de tipos espaciais (exceto para `ARCHIVE`, que não suporta Indexação de tipo espacial).

#### Indexes no Storage Engine MEMORY

O Storage Engine `MEMORY` usa Indexes `HASH` por padrão, mas também suporta Indexes `BTREE`.