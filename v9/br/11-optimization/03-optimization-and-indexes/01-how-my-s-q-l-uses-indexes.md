### 10.3.1 Como o MySQL Usa Índices

Os índices são usados para encontrar linhas com valores específicos de colunas rapidamente. Sem um índice, o MySQL deve começar com a primeira linha e, em seguida, ler toda a tabela para encontrar as linhas relevantes. Quanto maior a tabela, mais isso custa. Se a tabela tiver um índice para as colunas em questão, o MySQL pode determinar rapidamente a posição a ser procurada no meio do arquivo de dados sem precisar olhar todos os dados. Isso é muito mais rápido do que ler cada linha sequencialmente.

A maioria dos índices do MySQL (`PRIMARY KEY`, `UNIQUE`, `INDEX` e `FULLTEXT`) é armazenada em árvores B. Exceções: índices em tipos de dados espaciais usam árvores R; as tabelas `MEMORY` também suportam índices de hash; o `InnoDB` usa listas invertidas para índices `FULLTEXT`.

Em geral, os índices são usados conforme descrito na discussão a seguir. Características específicas de índices de hash (como usados em tabelas `MEMORY`) são descritas na Seção 10.3.9, “Comparação de Índices B-Tree e Hash”.

O MySQL usa índices para essas operações:

* Para encontrar as linhas que correspondem a uma cláusula `WHERE` rapidamente.

* Para eliminar linhas da consideração. Se houver uma escolha entre vários índices, o MySQL normalmente usa o índice que encontra o menor número de linhas (o índice mais seletivo).

* Se a tabela tiver um índice de múltiplas colunas, qualquer prefixo da esquerda do índice pode ser usado pelo otimizador para procurar linhas. Por exemplo, se você tiver um índice de três colunas em `(col1, col2, col3)`, você tem capacidades de busca indexadas em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`. Para mais informações, consulte a Seção 10.3.6, “Índices de Múltiplas Colunas”.

* Para recuperar linhas de outras tabelas ao realizar junções. O MySQL pode usar índices em colunas de forma mais eficiente se eles forem declarados como o mesmo tipo e tamanho. Nesse contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. Por exemplo, `VARCHAR(10)` e `CHAR(10)` têm o mesmo tamanho, mas `VARCHAR(10)` e `CHAR(15)` não.

  Para comparações entre colunas de strings não binárias, ambas as colunas devem usar o mesmo conjunto de caracteres. Por exemplo, comparar uma coluna `utf8mb4` com uma coluna `latin1` impede o uso de um índice.

  A comparação de colunas diferentes (comparando uma coluna de string com uma coluna temporal ou numérica, por exemplo) pode impedir o uso de índices se os valores não puderem ser comparados diretamente sem conversão. Para um valor dado, como `1` na coluna numérica, ele pode ser comparado como igual a qualquer número de valores na coluna de string, como `'1'`, `' 1'`, `'00001'`, ou `'01.e1'`. Isso exclui o uso de quaisquer índices para a coluna de string.

* Para encontrar o valor `MIN()` ou `MAX()` para uma coluna indexada específica *`key_col`*. Isso é otimizado por um pré-processador que verifica se você está usando `WHERE key_part_N = constant` em todas as partes da chave que ocorrem antes de *`key_col`* no índice. Nesse caso, o MySQL faz uma única busca de chave para cada expressão `MIN()` ou `MAX()` e a substitui por uma constante. Se todas as expressões forem substituídas por constantes, a consulta retorna de uma vez. Por exemplo:

  ```
  SELECT MIN(key_part2),MAX(key_part2)
    FROM tbl_name WHERE key_part1=10;
  ```

* Para ordenar ou agrupar uma tabela se a ordenação ou agregação for feita em um prefixo à esquerda de um índice utilizável (por exemplo, `ORDER BY key_part1, key_part2`). Se todas as partes da chave forem seguidas por `DESC`, a chave é lida em ordem inversa. (Ou, se o índice for um índice descendente, a chave é lida em ordem ascendente.) Veja a Seção 10.2.1.16, “Otimização de ORDER BY”, a Seção 10.2.1.17, “Otimização de GROUP BY” e a Seção 10.3.13, “Indizes Decrescentes”.

* Em alguns casos, uma consulta pode ser otimizada para recuperar valores sem consultar as linhas de dados. (Um índice que fornece todos os resultados necessários para uma consulta é chamado de índice coberto.) Se uma consulta usa apenas colunas de uma tabela que estão incluídas em algum índice, os valores selecionados podem ser recuperados da árvore de índice para maior velocidade:

  ```
  SELECT key_part3 FROM tbl_name
    WHERE key_part1=1
  ```

Os índices são menos importantes para consultas em tabelas pequenas ou grandes, onde as consultas de relatório processam a maioria ou todas as linhas. Quando uma consulta precisa acessar a maioria das linhas, a leitura sequencial é mais rápida do que trabalhar com um índice. Leitura sequencial minimiza buscas no disco, mesmo que nem todas as linhas sejam necessárias para a consulta. Veja a Seção 10.2.1.23, “Evitar Pesquisas Completas de Tabela” para detalhes.