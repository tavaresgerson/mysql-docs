### 8.4.4 Uso de Tabela Temporária Interna no MySQL

Em alguns casos, o servidor cria tabelas temporárias internas durante o processamento de instruções. Os usuários não têm controle direto sobre quando isso ocorre.

O servidor cria tabelas temporárias em condições como essas:

- Avaliação das declarações `UNION`, com algumas exceções descritas mais adiante.

- Avaliação de algumas visualizações, como as que utilizam o algoritmo `TEMPTABLE`, `UNION` ou agregação.

- Avaliação de tabelas derivadas (consulte a Seção 13.2.10.8, “Tabelas Derivadas”).

- Tabelas criadas para materialização de subconsultas ou junções parciais (consulte a Seção 8.2.2, “Otimização de subconsultas, tabelas derivadas e referências de visualizações”).

- Avaliação de declarações que contêm uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou para as quais a cláusula `ORDER BY` ou `GROUP BY` contém colunas de tabelas diferentes da primeira tabela na fila de junção.

- A avaliação de `DISTINCT` combinada com `ORDER BY` pode exigir uma tabela temporária.

- Para consultas que utilizam o modificador `SQL_SMALL_RESULT`, o MySQL usa uma tabela temporária de memória, a menos que a consulta também contenha elementos (descritos mais adiante) que exijam armazenamento em disco.

- Para avaliar as instruções `INSERT ... SELECT` que selecionam e inserem na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as linhas do `SELECT`, e depois insere essas linhas na tabela de destino. Veja a Seção 13.2.5.1, “Instrução INSERT ... SELECT”.

- Avaliação de declarações `UPDATE` de múltiplas tabelas.

- Avaliação das expressões `GROUP_CONCAT()` ou `COUNT(DISTINCT)`.

Para determinar se uma declaração requer uma tabela temporária, use `EXPLAIN` e verifique a coluna `Extra` para ver se diz `Using temporary` (consulte a Seção 8.8.1, “Otimizando consultas com EXPLAIN”). `EXPLAIN` não diz necessariamente `Using temporary` para tabelas temporárias derivadas ou materializadas.

Algumas condições de consulta impedem o uso de uma tabela temporária de memória, caso em que o servidor usa uma tabela em disco em vez disso:

- Presença de uma coluna `BLOB` ou `TEXT` na tabela. Isso inclui variáveis definidas pelo usuário com um valor de string, pois elas são tratadas como colunas `BLOB` ou `TEXT`, dependendo se seu valor é uma string binária ou não binária, respectivamente.

- Presença de qualquer coluna de texto com comprimento máximo maior que 512 (bytes para strings binárias, caracteres para strings não binárias) na lista `SELECT`, se `UNION` ou `UNION ALL` for usado.

- As instruções `SHOW COLUMNS` e `DESCRIBE` usam `BLOB` como tipo para algumas colunas, portanto, a tabela temporária usada para os resultados é uma tabela em disco.

O servidor não usa uma tabela temporária para as instruções `UNION` que atendem a certas qualificações. Em vez disso, ele retém apenas as estruturas de dados necessárias para realizar a tipificação das colunas do resultado a partir da criação da tabela temporária. A tabela não é totalmente instanciada e nenhuma linha é escrita nela ou lida dela; as linhas são enviadas diretamente ao cliente. O resultado é a redução dos requisitos de memória e disco, e um atraso menor antes que a primeira linha seja enviada ao cliente, porque o servidor não precisa esperar até que o último bloco de consulta seja executado. A saída do registro de execução `EXPLAIN` e do otimizador reflete essa estratégia de execução: O bloco de consulta `UNION RESULT` não está presente porque esse bloco corresponde à parte que lê da tabela temporária.

Essas condições qualificam uma `UNION` para avaliação sem uma tabela temporária:

- A união é `UNION ALL`, não `UNION` ou `UNION DISTINCT`.

- Não há uma cláusula `ORDER BY` global.

- A união não é o bloco de consulta de nível superior de uma instrução `{INSERT | REPLACE} ... SELECT ...`.

#### Motor de Armazenamento Temporário de Tabelas Internas

Uma tabela temporária interna pode ser mantida na memória e processada pelo mecanismo de armazenamento `MEMORY`, ou armazenada em disco pelo mecanismo de armazenamento `InnoDB` ou `MyISAM`.

Se uma tabela temporária interna for criada como uma tabela em memória, mas ficar muito grande, o MySQL a converte automaticamente para uma tabela em disco automaticamente. O tamanho máximo para tabelas temporárias em memória é definido pelo valor `tmp_table_size` ou `max_heap_table_size`, dependendo do menor valor. Isso difere das tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`. Para essas tabelas, apenas a variável `max_heap_table_size` determina o tamanho máximo que uma tabela pode crescer, e não há conversão para o formato em disco.

A variável `internal_tmp_disk_storage_engine` define o mecanismo de armazenamento que o servidor usa para gerenciar tabelas internas temporárias no disco. Os valores permitidos são `INNODB` (o padrão) e `MYISAM`.

Nota

Ao usar `internal_tmp_disk_storage_engine=INNODB`, as consultas que geram tabelas temporárias internas no disco que excedem os limites de linha ou coluna do `InnoDB` retornam erros de Tamanho da linha muito grande ou Muitas colunas. A solução é definir `internal_tmp_disk_storage_engine` para `MYISAM`.

Quando uma tabela temporária interna é criada na memória ou no disco, o servidor incrementa o valor `Created_tmp_tables`. Quando uma tabela temporária interna é criada no disco, o servidor incrementa o valor `Created_tmp_disk_tables`. Se forem criadas muitas tabelas temporárias internas no disco, considere aumentar os valores de `tmp_table_size` e `max_heap_table_size`.

#### Formato de Armazenamento Temporário de Tabela Interna

As tabelas temporárias de memória são gerenciadas pelo motor de armazenamento `MEMORY`, que utiliza um formato de linha de comprimento fixo. Os valores das colunas `VARCHAR` e `VARBINARY` são preenchidos com o máximo comprimento da coluna, armazenando-os efetivamente como colunas `CHAR` e `BINARY`.

As tabelas temporárias no disco são gerenciadas pelo motor de armazenamento `InnoDB` ou `MyISAM` (dependendo da configuração `internal_tmp_disk_storage_engine`). Ambos os motores armazenam tabelas temporárias usando o formato de linha de largura dinâmica. As colunas ocupam apenas o armazenamento necessário, o que reduz o I/O de disco, os requisitos de espaço e o tempo de processamento em comparação com tabelas no disco que usam linhas de comprimento fixo.

Para declarações que inicialmente criam uma tabela temporária interna na memória e, em seguida, a convertem em uma tabela em disco, um melhor desempenho pode ser alcançado ignorando a etapa de conversão e criando a tabela em disco desde o início. A variável `big_tables` pode ser usada para forçar o armazenamento em disco de tabelas temporárias internas.
