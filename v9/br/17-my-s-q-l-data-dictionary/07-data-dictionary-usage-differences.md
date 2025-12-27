## Diferenças no Uso do Dicionário de Dados

O uso de um servidor MySQL com dicionário de dados implica algumas diferenças operacionais em comparação com um servidor que não possui um dicionário de dados:

* Anteriormente, a ativação da variável de sistema `innodb_read_only` impediu a criação e a remoção de tabelas apenas para o motor de armazenamento `InnoDB`. A partir do MySQL 9.5, a ativação de `innodb_read_only` impede essas operações para todos os motores de armazenamento. As operações de criação e remoção de tabelas para qualquer motor de armazenamento modificam as tabelas do dicionário de dados no banco de dados do sistema `mysql`, mas essas tabelas usam o motor de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está ativado. O mesmo princípio se aplica a outras operações de tabela que requerem a modificação de tabelas do dicionário de dados. Exemplos:

  + `ANALYZE TABLE` falha porque atualiza as estatísticas da tabela, que são armazenadas no dicionário de dados.

  + `ALTER TABLE tbl_name ENGINE=engine_name` falha porque atualiza a designação do motor de armazenamento, que é armazenada no dicionário de dados.

Observação

Ativação de `innodb_read_only` também tem implicações importantes para tabelas que não fazem parte do dicionário de dados no banco de dados do sistema `mysql`. Para detalhes, consulte a descrição de `innodb_read_only` na Seção 17.14, “Opções de Inicialização do InnoDB e Variáveis de Sistema”

* Anteriormente, as tabelas no banco de dados do sistema `mysql` eram visíveis para instruções DML e DDL. A partir do MySQL 9.5, as tabelas do dicionário de dados são invisíveis e não podem ser modificadas ou consultadas diretamente. No entanto, na maioria dos casos, existem tabelas correspondentes do `INFORMATION_SCHEMA` que podem ser consultadas. Isso permite que as tabelas do dicionário de dados subjacentes sejam alteradas à medida que o desenvolvimento do servidor prossegue, mantendo uma interface estável do `INFORMATION_SCHEMA` para uso de aplicativos.

* As tabelas `INFORMATION_SCHEMA` no MySQL 9.5 estão intimamente ligadas ao dicionário de dados, resultando em várias diferenças de uso:

  + Anteriormente, as consultas `INFORMATION_SCHEMA` para estatísticas de tabelas nas tabelas `STATISTICS` e `TABLES` recuperavam estatísticas diretamente dos mecanismos de armazenamento. A partir do MySQL 9.5, estatísticas de tabelas em cache são usadas por padrão. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas de tabelas em cache expirem. O padrão é de 86400 segundos (24 horas). (Para atualizar os valores em cache a qualquer momento para uma determinada tabela, use `ANALYZE TABLE`.) Se não houver estatísticas em cache ou se as estatísticas expiraram, as estatísticas são recuperadas dos mecanismos de armazenamento ao consultar colunas de estatísticas de tabelas. Para sempre recuperar as estatísticas mais recentes diretamente dos mecanismos de armazenamento, defina `information_schema_stats_expiry` para `0`. Para mais informações, consulte a Seção 10.2.3, “Otimizando Consultas INFORMATION_SCHEMA”.

  + Várias tabelas `INFORMATION_SCHEMA` são visualizações de tabelas do dicionário de dados, o que permite que o otimizador use índices nessas tabelas subjacentes. Consequentemente, dependendo das escolhas do otimizador, a ordem das linhas dos resultados para consultas `INFORMATION_SCHEMA` pode diferir dos resultados anteriores. Se o resultado de uma consulta deve ter características específicas de ordem de linha, inclua uma cláusula `ORDER BY`.

  + Consultas em tabelas `INFORMATION_SCHEMA` podem retornar nomes de colunas em uma case maiúscula diferente da série anterior do MySQL. As aplicações devem testar os nomes de colunas do conjunto de resultados de forma case-insensitive. Se isso não for viável, uma solução é usar aliases de coluna na lista de seleção que retornem nomes de colunas na case maiúscula requerida. Por exemplo:

    ```
    SELECT TABLE_SCHEMA AS table_schema, TABLE_NAME AS table_name
    FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users';
    ```

+ **mysqldump** não exclui mais o banco de dados `INFORMATION_SCHEMA`, mesmo que seja explicitamente nomeado na linha de comando.

+ `CREATE TABLE dst_tbl LIKE src_tbl` exige que *`src_tbl`* seja uma tabela base e falha se for uma tabela `INFORMATION_SCHEMA` que é uma visão em tabelas do dicionário de dados.

+ Anteriormente, os cabeçalhos dos conjuntos de resultados de colunas selecionadas de tabelas `INFORMATION_SCHEMA` usavam a maiúscula especificada na consulta. Esta consulta produz um conjunto de resultados com um cabeçalho de `table_name`:

    ```
    SELECT table_name FROM INFORMATION_SCHEMA.TABLES;
    ```

    A partir do MySQL 9.5, esses cabeçalhos são maiúsculos; a consulta anterior produz um conjunto de resultados com um cabeçalho de `TABLE_NAME`. Se necessário, pode-se usar um alias de coluna para obter uma grafia diferente. Por exemplo:

    ```
    SELECT table_name AS 'table_name' FROM INFORMATION_SCHEMA.TABLES;
    ```

* O diretório de dados afeta como **mysqldump** exclui informações do banco de dados `mysql`:

  + **mysqldump** exclui apenas tabelas que não fazem parte do dicionário de dados nesse banco de dados, enquanto anteriormente era possível excluir todas as tabelas no banco de dados `mysql`.

  + Anteriormente, as opções `--routines` e `--events` não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: O dump incluía o banco de dados `mysql`, e, portanto, também as tabelas `proc` e `event` que contêm definições de rotinas e eventos armazenados. A partir do MySQL 9.5, as tabelas `event` e `proc` não são usadas. As definições dos objetos correspondentes são armazenadas em tabelas do dicionário de dados, mas essas tabelas não são excluídas. Para incluir rotinas e eventos armazenados em um dump feito usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.

+ Anteriormente, a opção `--routines` exigia o privilégio `SELECT` para a tabela `proc`. A partir do MySQL 9.5, essa tabela não é usada; `--routines` requer o privilégio global `SELECT` em vez disso.

+ Anteriormente, era possível descartar definições de rotinas e eventos armazenados junto com seus timestamps de criação e modificação, descartando as tabelas `proc` e `event`. A partir do MySQL 9.5, essas tabelas não são usadas, portanto, não é possível descartar timestamps.

* Anteriormente, criar uma rotina armazenada que contém caracteres ilegais produzia um aviso. A partir do MySQL 9.5, isso é um erro.