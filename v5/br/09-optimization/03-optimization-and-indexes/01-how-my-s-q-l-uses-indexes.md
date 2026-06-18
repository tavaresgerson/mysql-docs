### 8.3.1 Como o MySQL usa índices

Os índices são usados para encontrar linhas com valores específicos de coluna rapidamente. Sem um índice, o MySQL deve começar com a primeira linha e, em seguida, ler toda a tabela para encontrar as linhas relevantes. Quanto maior a tabela, mais isso custa. Se a tabela tiver um índice para as colunas em questão, o MySQL pode determinar rapidamente a posição a ser procurada no meio do arquivo de dados sem precisar olhar todos os dados. Isso é muito mais rápido do que ler cada linha sequencialmente.

A maioria dos índices do MySQL (`PRIMARY KEY`, `UNIQUE`, `INDEX` e `FULLTEXT`) são armazenados em árvores B. Exceções: índices em tipos de dados espaciais usam árvores R; as tabelas `MEMORY` também suportam índices de hash; o `InnoDB` usa listas invertidas para índices `FULLTEXT`.

Em geral, os índices são usados conforme descrito na discussão a seguir. As características específicas dos índices de hash (como os usados em tabelas `MEMORY`) são descritas na Seção 8.3.8, “Comparação entre Índices B-Tree e Índices de Hash”.

O MySQL utiliza índices para essas operações:

- Para encontrar as linhas que correspondem a uma cláusula `WHERE` rapidamente.

- Para eliminar linhas da consideração. Se houver uma escolha entre vários índices, o MySQL normalmente usa o índice que encontra o menor número de linhas (o índice mais seletivo).

- Se a tabela tiver um índice de múltiplas colunas, qualquer prefixo da esquerda do índice pode ser usado pelo otimizador para pesquisar linhas. Por exemplo, se você tiver um índice de três colunas em `(col1, col2, col3)`, você terá capacidades de pesquisa indexadas em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`. Para mais informações, consulte a Seção 8.3.5, “Indekses de Múltiplas Colunas”.

- Para recuperar linhas de outras tabelas ao realizar junções. O MySQL pode usar índices em colunas de forma mais eficiente se eles forem declarados com o mesmo tipo e tamanho. Nesse contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. Por exemplo, `VARCHAR(10)` e `CHAR(10)` têm o mesmo tamanho, mas `VARCHAR(10)` e `CHAR(15)`

  Para comparações entre colunas de texto não binárias, ambas as colunas devem usar o mesmo conjunto de caracteres. Por exemplo, comparar uma coluna `utf8` com uma coluna `latin1` impede o uso de um índice.

  A comparação de colunas diferentes (por exemplo, comparando uma coluna de texto com uma coluna temporal ou numérica) pode impedir o uso de índices, pois os valores não podem ser comparados diretamente sem conversão. Para um valor específico, como `1` na coluna numérica, ele pode ser igual a qualquer número de valores na coluna de texto, como `'1'`, `' 1'`, `'00001'` ou `'01.e1'`. Isso exclui o uso de quaisquer índices para a coluna de texto.

- Para encontrar o valor `MIN()` ou `MAX()` para uma coluna indexada específica *`key_col`*. Isso é otimizado por um pré-processador que verifica se você está usando `WHERE key_part_N = constante` em todas as partes da chave que ocorrem antes de *`key_col`* no índice. Nesse caso, o MySQL faz uma única busca por chave para cada expressão `MIN()` ou `MAX()` e a substitui por uma constante. Se todas as expressões forem substituídas por constantes, a consulta retorna de uma vez. Por exemplo:

  ```sql
  SELECT MIN(key_part2),MAX(key_part2)
    FROM tbl_name WHERE key_part1=10;
  ```

- Para ordenar ou agrupar uma tabela se a ordenação ou agregação for feita em um prefixo da esquerda de um índice utilizável (por exemplo, `ORDER BY key_part1, key_part2`). Se todas as partes da chave forem seguidas por `DESC`, a chave será lida em ordem inversa. Veja a Seção 8.2.1.14, “Otimização de ORDER BY”, e a Seção 8.2.1.15, “Otimização de GROUP BY”.

- Em alguns casos, uma consulta pode ser otimizada para recuperar valores sem consultar as linhas de dados. (Um índice que fornece todos os resultados necessários para uma consulta é chamado de índice coberto.) Se uma consulta usa apenas colunas de uma tabela que estão incluídas em algum índice, os valores selecionados podem ser recuperados da árvore do índice para maior velocidade:

  ```sql
  SELECT key_part3 FROM tbl_name
    WHERE key_part1=1
  ```

Os índices são menos importantes para consultas em tabelas pequenas ou grandes, onde as consultas de relatórios processam a maioria ou todas as linhas. Quando uma consulta precisa acessar a maioria das linhas, a leitura sequencial é mais rápida do que trabalhar com um índice. As leituras sequenciais minimizam os buscas no disco, mesmo que nem todas as linhas sejam necessárias para a consulta. Veja a Seção 8.2.1.20, “Evitar varreduras completas da tabela”, para detalhes.
