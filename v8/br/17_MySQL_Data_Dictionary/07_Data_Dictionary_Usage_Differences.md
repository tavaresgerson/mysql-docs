## 16.7 Diferenças no uso do dicionário de dados

O uso de um servidor MySQL com dicionário de dados implica algumas diferenças operacionais em comparação com um servidor que não possui um dicionário de dados:

* Anteriormente, habilitar a variável de sistema `innodb_read_only` impediu a criação e a eliminação de tabelas apenas para o mecanismo de armazenamento `InnoDB`. A partir do MySQL 8.0, habilitar `innodb_read_only` impede essas operações para todos os mecanismos de armazenamento. As operações de criação e eliminação de tabelas para qualquer mecanismo de armazenamento modificam as tabelas do dicionário de dados no banco de dados do sistema `mysql`, mas essas tabelas usam o mecanismo de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está habilitado. O mesmo princípio se aplica a outras operações de tabela que exigem a modificação de tabelas do dicionário de dados. Exemplos:

+ `ANALYZE TABLE` falha porque atualiza as estatísticas da tabela, que são armazenadas no dicionário de dados.

+ `ALTER TABLE tbl_name ENGINE=engine_name`](alter-table.html "15.1.9 ALTER TABLE Statement") falha porque atualiza a designação do motor de armazenamento, que é armazenada no dicionário de dados.

Nota

A ativação de `innodb_read_only` também tem implicações importantes para as tabelas de dicionário de dados não relacionadas ao sistema de banco de dados `mysql`. Para detalhes, consulte a descrição de `innodb_read_only` na Seção 17.14, “Opções de inicialização do InnoDB e variáveis do sistema”

* Anteriormente, as tabelas no banco de dados do sistema `mysql` eram visíveis para as declarações DML e DDL. A partir do MySQL 8.0, as tabelas do dicionário de dados são invisíveis e não podem ser modificadas ou consultadas diretamente. No entanto, na maioria dos casos, existem tabelas correspondentes `INFORMATION_SCHEMA` que podem ser consultadas em vez disso. Isso permite que as tabelas subjacentes do dicionário de dados sejam alteradas à medida que o desenvolvimento do servidor prossegue, mantendo uma interface estável `INFORMATION_SCHEMA` para uso de aplicativos.

* As tabelas `INFORMATION_SCHEMA` no MySQL 8.0 estão intimamente ligadas ao dicionário de dados, resultando em várias diferenças de uso:

Anteriormente, as consultas `INFORMATION_SCHEMA` para estatísticas de tabela nas tabelas `STATISTICS` e `TABLES` recuperavam estatísticas diretamente dos motores de armazenamento. A partir do MySQL 8.0, as estatísticas de tabela cache são usadas por padrão. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas de tabela cache expirem. O padrão é de 86400 segundos (24 horas). (Para atualizar os valores cache em qualquer momento para uma tabela específica, use [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement").). Se não houver estatísticas cache ou se as estatísticas expiraram, as estatísticas são recuperadas dos motores de armazenamento ao fazer consultas a colunas de estatísticas de tabela. Para sempre recuperar as estatísticas mais recentes diretamente dos motores de armazenamento, defina `information_schema_stats_expiry` para `0`. Para mais informações, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION_SCHEMA”.

+ Várias tabelas `INFORMATION_SCHEMA` são visualizações de tabelas do dicionário de dados, o que permite que o otimizador use índices nessas tabelas subjacentes. Consequentemente, dependendo das escolhas do otimizador, a ordem das linhas dos resultados para consultas `INFORMATION_SCHEMA` pode diferir dos resultados anteriores. Se o resultado de uma consulta deve ter características específicas de ordem de linha, inclua uma cláusula `ORDER BY`.

+ As consultas nas tabelas `INFORMATION_SCHEMA` podem retornar os nomes dos colunas em uma grafia de letras diferente daquela das versões anteriores do MySQL. As aplicações devem testar os nomes dos colunas do conjunto de resultados de forma insensível ao caso. Se isso não for viável, uma solução é usar aliases de coluna na lista de seleção que retorne os nomes dos colunas na grafia de letras necessária. Por exemplo:

    ```
    SELECT TABLE_SCHEMA AS table_schema, TABLE_NAME AS table_name
    FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users';
    ```

+ O **mysqldump** e o **mysqlpump** não fazem mais o dump do banco de dados `INFORMATION_SCHEMA`, mesmo que explicitamente nomeado na linha de comando.

+ `CREATE TABLE dst_tbl LIKE src_tbl` exige que *(create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement")* seja uma tabela base e falha se for uma tabela `INFORMATION_SCHEMA` que é uma visão em tabelas do dicionário de dados.

+ Anteriormente, os cabeçalhos dos conjuntos de resultados das colunas selecionadas das tabelas `INFORMATION_SCHEMA` utilizavam a minificação especificada na consulta. Esta consulta produz um conjunto de resultados com um cabeçalho de `table_name`:

    ```
    SELECT table_name FROM INFORMATION_SCHEMA.TABLES;
    ```

A partir do MySQL 8.0, esses cabeçalhos são maiúsculos; a consulta anterior produz um conjunto de resultados com um cabeçalho de `TABLE_NAME`. Se necessário, pode-se usar um alias de coluna para obter uma letra maiúscula diferente. Por exemplo:

    ```
    SELECT table_name AS 'table_name' FROM INFORMATION_SCHEMA.TABLES;
    ```

* O diretório de dados afeta a forma como o **mysqldump** e o **mysqlpump** fazem o dump de informações do banco de dados do sistema `mysql`:

+ Anteriormente, era possível descartar todas as tabelas no banco de dados do sistema `mysql`. A partir do MySQL 8.0, o **mysqldump** e o **mysqlpump** descartam apenas as tabelas do dicionário que não são de dados nesse banco de dados.

+ Anteriormente, as opções `--routines` e `--events` não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: O dump incluía o banco de dados do sistema `mysql`, e, portanto, também as tabelas `proc` e `event` que contêm definições de rotinas e eventos armazenados. A partir do MySQL 8.0, as tabelas `event` e `proc` não são usadas. As definições dos objetos correspondentes são armazenadas em tabelas do dicionário de dados, mas essas tabelas não são feitas. Para incluir rotinas e eventos armazenados em um dump feito usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.

+ Anteriormente, a opção `--routines` exigia o privilégio `SELECT` para a tabela `proc`. A partir do MySQL 8.0, essa tabela não é usada; `--routines` requer o privilégio global `SELECT` em vez disso.

+ Anteriormente, era possível descartar definições de rotina e eventos armazenados juntamente com seus timestamps de criação e modificação, descartando as tabelas `proc` e `event`. A partir do MySQL 8.0, essas tabelas não são usadas, portanto, não é possível descartar timestamps.

* Anteriormente, a criação de uma rotina armazenada que contém caracteres ilegais produzia um aviso. A partir do MySQL 8.0, esse é um erro.