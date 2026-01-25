### 8.4.4 Uso de Tabelas Temporárias Internas no MySQL

Em alguns casos, o servidor cria tabelas temporárias internas durante o processamento de *statements*. Os usuários não têm controle direto sobre quando isso ocorre.

O servidor cria tabelas temporárias em condições como estas:

*   Avaliação de *statements* `UNION`, com algumas exceções descritas posteriormente.
*   Avaliação de algumas *views*, como aquelas que usam o *algorithm* `TEMPTABLE`, `UNION`, ou agregação.
*   Avaliação de *derived tables* (consulte a Seção 13.2.10.8, “Derived Tables”).
*   Tabelas criadas para *subquery* ou *semijoin materialization* (consulte a Seção 8.2.2, “Otimizando Subqueries, Derived Tables e Referências de View”).
*   Avaliação de *statements* que contêm uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou para as quais o `ORDER BY` ou `GROUP BY` contém colunas de tabelas diferentes da primeira tabela na fila do *join*.
*   Avaliação de `DISTINCT` combinada com `ORDER BY` pode exigir uma tabela temporária.
*   Para *queries* que usam o modificador `SQL_SMALL_RESULT`, o MySQL utiliza uma tabela temporária em memória, a menos que a *query* também contenha elementos (descritos posteriormente) que exijam armazenamento em disco.
*   Para avaliar *statements* `INSERT ... SELECT` que selecionam e inserem na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as linhas do `SELECT`, e então insere essas linhas na tabela de destino. Consulte a Seção 13.2.5.1, “INSERT ... SELECT Statement”.
*   Avaliação de *statements* `UPDATE` de múltiplas tabelas.
*   Avaliação de expressões `GROUP_CONCAT()` ou `COUNT(DISTINCT)`.

Para determinar se um *statement* requer uma tabela temporária, use `EXPLAIN` e verifique a coluna `Extra` para ver se ela indica `Using temporary` (consulte a Seção 8.8.1, “Otimizando Queries com EXPLAIN”). `EXPLAIN` não indica necessariamente `Using temporary` para *derived tables* ou tabelas temporárias *materialized*.

Algumas condições de *query* impedem o uso de uma tabela temporária em memória, caso em que o servidor usa uma tabela em disco:

*   Presença de uma coluna `BLOB` ou `TEXT` na tabela. Isso inclui variáveis definidas pelo usuário com um valor de *string*, pois são tratadas como colunas `BLOB` ou `TEXT`, dependendo se seu valor é uma *string* binária ou não binária, respectivamente.
*   Presença de qualquer coluna de *string* com um comprimento máximo superior a 512 (*bytes* para *strings* binárias, caracteres para *strings* não binárias) na lista `SELECT`, se `UNION` ou `UNION ALL` for usado.
*   Os *statements* `SHOW COLUMNS` e `DESCRIBE` usam `BLOB` como tipo para algumas colunas, portanto, a tabela temporária usada para os resultados é uma tabela em disco.

O servidor não usa uma tabela temporária para *statements* `UNION` que atendem a certas qualificações. Em vez disso, ele retém da criação da tabela temporária apenas as estruturas de dados necessárias para realizar a conversão de tipo das colunas de resultado (*typecasting*). A tabela não é totalmente instanciada e nenhuma linha é escrita ou lida dela; as linhas são enviadas diretamente ao cliente. O resultado é a redução dos requisitos de memória e disco, e uma demora menor antes que a primeira linha seja enviada ao cliente, pois o servidor não precisa esperar até que o último bloco de *query* seja executado. A saída de `EXPLAIN` e do *optimizer trace* reflete esta estratégia de execução: o bloco de *query* `UNION RESULT` não está presente porque esse bloco corresponde à parte que lê da tabela temporária.

Estas condições qualificam um `UNION` para avaliação sem uma tabela temporária:

*   O *union* é `UNION ALL`, e não `UNION` ou `UNION DISTINCT`.
*   Não há cláusula `ORDER BY` global.
*   O *union* não é o bloco de *query* de nível superior de um *statement* `{INSERT | REPLACE} ... SELECT ...`.

#### Storage Engine de Tabela Temporária Interna

Uma tabela temporária interna pode ser mantida em memória e processada pelo *storage engine* `MEMORY`, ou armazenada em disco pelo *storage engine* `InnoDB` ou `MyISAM`.

Se uma tabela temporária interna for criada como uma tabela em memória, mas se tornar muito grande, o MySQL a converte automaticamente para uma tabela em disco. O tamanho máximo para tabelas temporárias em memória é definido pelo valor de `tmp_table_size` ou `max_heap_table_size`, o que for menor. Isso difere das tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`. Para tais tabelas, apenas a variável `max_heap_table_size` determina o quão grande uma tabela pode crescer, e não há conversão para o formato em disco.

A variável `internal_tmp_disk_storage_engine` define o *storage engine* que o servidor usa para gerenciar tabelas temporárias internas em disco. Os valores permitidos são `INNODB` (o padrão) e `MYISAM`.

Nota

Ao usar `internal_tmp_disk_storage_engine=INNODB`, *queries* que geram tabelas temporárias internas em disco que excedem os limites de linha ou coluna do `InnoDB` retornam erros como *Row size too large* ou *Too many columns*. A solução alternativa é definir `internal_tmp_disk_storage_engine` como `MYISAM`.

Quando uma tabela temporária interna é criada em memória ou em disco, o servidor incrementa o valor `Created_tmp_tables`. Quando uma tabela temporária interna é criada em disco, o servidor incrementa o valor `Created_tmp_disk_tables`. Se muitas tabelas temporárias internas forem criadas em disco, considere aumentar as configurações `tmp_table_size` e `max_heap_table_size`.

#### Formato de Armazenamento de Tabela Temporária Interna

Tabelas temporárias em memória são gerenciadas pelo *storage engine* `MEMORY`, que usa o formato de linha de comprimento fixo (*fixed-length row format*). Os valores das colunas `VARCHAR` e `VARBINARY` são preenchidos até o comprimento máximo da coluna, armazenando-os, na prática, como colunas `CHAR` e `BINARY`.

Tabelas temporárias em disco são gerenciadas pelos *storage engines* `InnoDB` ou `MyISAM` (dependendo da configuração de `internal_tmp_disk_storage_engine`). Ambos os *engines* armazenam tabelas temporárias usando o formato de linha de largura dinâmica (*dynamic-width row format*). As colunas ocupam apenas o armazenamento necessário, o que reduz o *disk I/O*, os requisitos de espaço e o tempo de processamento em comparação com tabelas em disco que usam linhas de comprimento fixo.

Para *statements* que inicialmente criam uma tabela temporária interna em memória e depois a convertem para uma tabela em disco, um desempenho melhor pode ser alcançado ignorando a etapa de conversão e criando a tabela em disco desde o início. A variável `big_tables` pode ser usada para forçar o armazenamento em disco de tabelas temporárias internas.