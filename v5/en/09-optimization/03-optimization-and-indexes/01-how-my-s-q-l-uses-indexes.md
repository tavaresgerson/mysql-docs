### 8.3.1 Como o MySQL Usa Indexes

Indexes são usados para encontrar rapidamente linhas com valores de coluna específicos. Sem um index, o MySQL deve começar pela primeira linha e, em seguida, ler a tabela inteira para encontrar as linhas relevantes. Quanto maior a tabela, maior o custo disso. Se a tabela tiver um index para as colunas em questão, o MySQL pode determinar rapidamente a posição a ser buscada no meio do arquivo de dados sem ter que analisar todos os dados. Isso é muito mais rápido do que ler todas as linhas sequencialmente.

A maioria dos indexes do MySQL (`PRIMARY KEY`, `UNIQUE`, `INDEX` e `FULLTEXT`) são armazenados em B-trees. Exceções: Indexes em tipos de dados espaciais usam R-trees; tabelas `MEMORY` também suportam hash indexes; o `InnoDB` usa listas invertidas para indexes `FULLTEXT`.

Em geral, indexes são usados conforme descrito na discussão a seguir. As características específicas dos hash indexes (usados em tabelas `MEMORY`) são descritas na Seção 8.3.8, “Comparison of B-Tree and Hash Indexes”.

O MySQL usa indexes para estas operações:

* Para encontrar rapidamente as linhas que correspondem a uma cláusula `WHERE`.

* Para eliminar linhas da consideração. Se houver uma escolha entre múltiplos indexes, o MySQL normalmente usa o index que encontra o menor número de linhas (o index mais seletivo).

* Se a tabela tiver um multiple-column index, qualquer prefixo mais à esquerda do index pode ser usado pelo optimizer para fazer o lookup das linhas. Por exemplo, se você tiver um index de três colunas em `(col1, col2, col3)`, você terá recursos de busca indexada em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`. Para mais informações, consulte a Seção 8.3.5, “Multiple-Column Indexes”.

* Para recuperar linhas de outras tabelas ao realizar joins. O MySQL pode usar indexes em colunas de forma mais eficiente se estas forem declaradas com o mesmo tipo e tamanho. Neste contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. Por exemplo, `VARCHAR(10)` e `CHAR(10)` têm o mesmo tamanho, mas `VARCHAR(10)` e `CHAR(15)` não.

  Para comparações entre colunas de string não binárias, ambas as colunas devem usar o mesmo character set. Por exemplo, comparar uma coluna `utf8` com uma coluna `latin1` impede o uso de um index.

  A comparação de colunas não semelhantes (comparar uma coluna de string com uma coluna temporal ou numérica, por exemplo) pode impedir o uso de indexes se os valores não puderem ser comparados diretamente sem conversão. Para um determinado valor, como `1` na coluna numérica, ele pode ser comparado como igual a qualquer número de valores na coluna string, como `'1'`, `' 1'`, `'00001'` ou `'01.e1'`. Isso impede o uso de qualquer index para a coluna string.

* Para encontrar o valor `MIN()` ou `MAX()` para uma coluna indexada específica *`key_col`*. Isso é otimizado por um pré-processador que verifica se você está usando `WHERE key_part_N = constant` em todas as partes da key que ocorrem antes de *`key_col`* no index. Neste caso, o MySQL faz um único key lookup para cada expressão `MIN()` ou `MAX()` e a substitui por uma constante. Se todas as expressões forem substituídas por constantes, a Query retorna imediatamente. Por exemplo:

  ```sql
  SELECT MIN(key_part2),MAX(key_part2)
    FROM tbl_name WHERE key_part1=10;
  ```

* Para ordenar ou agrupar uma tabela se a ordenação ou agrupamento for feita em um prefixo mais à esquerda de um index utilizável (por exemplo, `ORDER BY key_part1, key_part2`). Se todas as partes da key forem seguidas por `DESC`, a key é lida em ordem inversa. Consulte a Seção 8.2.1.14, “ORDER BY Optimization”, e a Seção 8.2.1.15, “GROUP BY Optimization”.

* Em alguns casos, uma Query pode ser otimizada para recuperar valores sem consultar as linhas de dados. (Um index que fornece todos os resultados necessários para uma Query é chamado de covering index.) Se uma Query usar de uma tabela apenas colunas que estão incluídas em algum index, os valores selecionados podem ser recuperados da árvore do index para maior velocidade:

  ```sql
  SELECT key_part3 FROM tbl_name
    WHERE key_part1=1
  ```

Indexes são menos importantes para Queries em tabelas pequenas, ou em tabelas grandes onde Queries de relatório processam a maioria ou todas as linhas. Quando uma Query precisa acessar a maioria das linhas, a leitura sequencial é mais rápida do que trabalhar através de um index. Leituras sequenciais minimizam as buscas em disco (disk seeks), mesmo que nem todas as linhas sejam necessárias para a Query. Consulte a Seção 8.2.1.20, “Avoiding Full Table Scans” para detalhes.