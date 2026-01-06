### 8.3.4 Índices de Colunas

O tipo mais comum de índice envolve uma única coluna, armazenando cópias dos valores dessa coluna em uma estrutura de dados, permitindo buscas rápidas para as linhas com os valores correspondentes da coluna. A estrutura de dados B-tree permite que o índice encontre rapidamente um valor específico, um conjunto de valores ou uma faixa de valores, correspondendo a operadores como `=`, `>`, `≤`, `BETWEEN`, `IN`, e assim por diante, em uma cláusula `WHERE`.

O número máximo de índices por tabela e o comprimento máximo do índice são definidos por motor de armazenamento. Consulte o Capítulo 14, *O Motor de Armazenamento InnoDB*, e o Capítulo 15, *Motores de Armazenamento Alternativos*. Todos os motores de armazenamento suportam pelo menos 16 índices por tabela e um comprimento total de índice de pelo menos 256 bytes. A maioria dos motores de armazenamento tem limites mais altos.

Para obter informações adicionais sobre índices de colunas, consulte a Seção 13.1.14, “Instrução CREATE INDEX”.

- Prefixos do índice
- Índices FULLTEXT
- Índices Espaciais
- Índices no Motor de Armazenamento de MEMÓRIA

#### Prefixos do índice

Com a sintaxe `col_name(N)` em uma especificação de índice para uma coluna de texto, você pode criar um índice que usa apenas os primeiros *`N`* caracteres da coluna. Indexar apenas um prefixo dos valores da coluna dessa maneira pode tornar o arquivo de índice muito menor. Quando você indexa uma coluna `BLOB` ou `TEXT`, você *deve* especificar um comprimento de prefixo para o índice. Por exemplo:

```sql
CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
```

Os prefixos podem ter até 1000 bytes de comprimento (767 bytes para tabelas `InnoDB`, a menos que você tenha `innodb_large_prefix` definido).

Nota

Os limites de prefixo são medidos em bytes, enquanto a extensão do prefixo nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` é interpretada como o número de caracteres para tipos de strings não binários (`CHAR`, `VARCHAR`, `TEXT`) e o número de bytes para tipos de strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar uma extensão de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

Se um termo de busca exceder o comprimento do prefixo do índice, o índice é usado para excluir linhas que não correspondem, e as linhas restantes são examinadas em busca de possíveis correspondências.

Para obter informações adicionais sobre prefixos de índice, consulte a Seção 13.1.14, “Instrução CREATE INDEX”.

#### Índices FULLTEXT

Os índices `FULLTEXT` são usados para pesquisas de texto completo. Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam índices `FULLTEXT` e apenas para colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna e a indexação de prefixo de coluna não é suportada. Para obter detalhes, consulte a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

As otimizações são aplicadas a certos tipos de consultas `FULLTEXT` contra tabelas `InnoDB` individuais. As consultas com essas características são particularmente eficientes:

- Consultas `FULLTEXT` que retornam apenas o ID do documento ou o ID do documento e o ranking de pesquisa.

- As consultas `FULLTEXT` que ordenam as linhas correspondentes em ordem decrescente de pontuação e aplicam uma cláusula `LIMIT` para obter as N primeiras linhas correspondentes. Para que essa otimização seja aplicada, não deve haver cláusulas `WHERE` e apenas uma única cláusula `ORDER BY` em ordem decrescente.

- Consultas `FULLTEXT` que recuperam apenas o valor `COUNT(*)` das linhas que correspondem a um termo de pesquisa, sem cláusulas `WHERE` adicionais. Códice a cláusula `WHERE` como `WHERE MATCH(text) AGAINST ('other_text')`, sem qualquer operador de comparação `> 0`.

Para consultas que contêm expressões de texto completo, o MySQL avalia essas expressões durante a fase de otimização da execução da consulta. O otimizador não apenas analisa as expressões de texto completo e faz estimativas, ele as avalia na verdade no processo de desenvolvimento de um plano de execução.

Uma implicação desse comportamento é que a consulta `EXPLAIN` para consultas de texto completo é, normalmente, mais lenta do que para consultas sem texto completo, nas quais não ocorre avaliação de expressão durante a fase de otimização.

As consultas de pesquisa de texto completo podem exibir `Selecionar tabelas otimizadas` na coluna `Extra` devido à ocorrência de correspondências durante a otimização; nesse caso, nenhum acesso à tabela será necessário durante a execução posterior.

#### Índices Espaciais

Você pode criar índices em tipos de dados espaciais. `MyISAM` e `InnoDB` suportam índices de árvore R em tipos espaciais. Outros motores de armazenamento usam árvores B para indexar tipos espaciais (exceto para `ARCHIVE`, que não suporta indexação de tipos espaciais).

#### Índices no Motor de Armazenamento de MEMÓRIA

O mecanismo de armazenamento `MEMORY` usa índices `HASH` por padrão, mas também suporta índices `BTREE`.
