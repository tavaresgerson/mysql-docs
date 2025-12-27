### 10.3.5 Índices de Colunas

O tipo mais comum de índice envolve uma única coluna, armazenando cópias dos valores dessa coluna em uma estrutura de dados, permitindo buscas rápidas para as linhas com os valores correspondentes da coluna. A estrutura de dados B-tree permite que o índice encontre rapidamente um valor específico, um conjunto de valores ou uma faixa de valores, correspondendo a operadores como `=`, `>`, `≤`, `BETWEEN`, `IN`, e assim por diante, em uma cláusula `WHERE`.

O número máximo de índices por tabela e o comprimento máximo do índice são definidos por motor de armazenamento. Consulte o Capítulo 17, *O Motor de Armazenamento InnoDB*, e o Capítulo 18, *Motores de Armazenamento Alternativos*. Todos os motores de armazenamento suportam pelo menos 16 índices por tabela e um comprimento total do índice de pelo menos 256 bytes. A maioria dos motores de armazenamento tem limites mais altos.

Para obter informações adicionais sobre índices de colunas, consulte a Seção 15.1.18, “Instrução CREATE INDEX”.

* Prefixos de Índices
* Índices FULLTEXT
* Índices Espaciais
* Índices no Motor de Armazenamento MEMORY

#### Prefixos de Índices

Com a sintaxe `col_name(N)` em uma especificação de índice para uma coluna de texto, você pode criar um índice que usa apenas os primeiros *`N`* caracteres da coluna. Indexar apenas um prefixo de valores da coluna dessa maneira pode tornar o arquivo do índice muito menor. Ao indexar uma coluna `BLOB` ou `TEXT`, você *deve* especificar um comprimento de prefixo para o índice. Por exemplo:

```
CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
```

Os prefixos podem ter até 767 bytes de comprimento para tabelas `InnoDB` que usam o formato de linha `REDUNDANT` ou `COMPACT`. O limite de comprimento do prefixo é de 3072 bytes para tabelas `InnoDB` que usam o formato de linha `DYNAMIC` ou `COMPRESSED`. Para tabelas MyISAM, o limite de comprimento do prefixo é de 1000 bytes.

Nota

Os limites de prefixo são medidos em bytes, enquanto a extensão do prefixo nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` é interpretada como número de caracteres para tipos de strings não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar uma extensão de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

Se um termo de busca exceder o comprimento do prefixo do índice, o índice é usado para excluir linhas que não correspondem, e as linhas restantes são examinadas em busca de possíveis correspondências.

Para obter informações adicionais sobre índices de prefixo, consulte a Seção 15.1.18, “Instrução CREATE INDEX”.

#### Índices FULLTEXT

Os índices `FULLTEXT` são usados para buscas de texto completo. Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam índices `FULLTEXT` e apenas para colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna e a indexação de prefixo de coluna não é suportada. Para detalhes, consulte a Seção 14.9, “Funções de Busca de Texto Completo”.

As otimizações são aplicadas a certos tipos de consultas `FULLTEXT` em tabelas `InnoDB` individuais. Consultas com essas características são particularmente eficientes:

* Consultas `FULLTEXT` que retornam apenas o ID do documento ou o ID do documento e o ranking de busca.
* Consultas `FULLTEXT` que ordenam as linhas correspondentes em ordem decrescente de pontuação e aplicam uma cláusula `LIMIT` para obter as N linhas correspondentes. Para que essa otimização seja aplicada, não deve haver cláusulas `WHERE` e apenas uma cláusula `ORDER BY` em ordem decrescente.
* Consultas `FULLTEXT` que recuperam apenas o valor `COUNT(*)` de linhas que correspondem a um termo de busca, sem cláusulas `WHERE` adicionais. Crie a cláusula `WHERE` como `WHERE MATCH(text) AGAINST ('other_text')`, sem qualquer operador de comparação `> 0`.

Para consultas que contêm expressões de texto completo, o MySQL avalia essas expressões durante a fase de otimização da execução da consulta. O otimizador não apenas analisa as expressões de texto completo e faz estimativas, mas as avalia realmente no processo de desenvolvimento de um plano de execução.

Uma implicação desse comportamento é que o `EXPLAIN` para consultas de texto completo é tipicamente mais lento do que para consultas sem texto completo, para as quais não ocorre avaliação de expressões durante a fase de otimização.

O `EXPLAIN` para consultas de texto completo pode mostrar `Tabelas selecionadas otimizadas` na coluna `Extra` devido à correspondência que ocorre durante a otimização; nesse caso, nenhum acesso à tabela precisa ocorrer durante a execução posterior.

#### Índices Espaciais

Você pode criar índices em tipos de dados espaciais. `MyISAM` e `InnoDB` suportam índices R-tree em tipos espaciais. Outros motores de armazenamento usam B-trees para indexar tipos espaciais (exceto para `ARCHIVE`, que não suporta indexação de tipos espaciais).

#### Índices no Motor de Armazenamento MEMORY

O motor de armazenamento `MEMORY` usa índices `HASH` por padrão, mas também suporta índices `BTREE`.