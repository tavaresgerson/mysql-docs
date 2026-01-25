### 5.4.1 Selecionando Destinos de Saída para o General Query Log e Slow Query Log

O MySQL Server oferece controle flexível sobre o destino da saída escrita no general query log e no slow query log, caso esses logs estejam habilitados. Os destinos possíveis para as entradas de log são arquivos de log ou as tabelas `general_log` e `slow_log` no database de sistema `mysql`. Pode-se selecionar a saída para arquivo, saída para tabela, ou ambas.

* [Controle de Log na Inicialização do Server](log-destinations.html#log-destinations-startup "Log Control at Server Startup")
* [Controle de Log em Tempo de Execução](log-destinations.html#log-destinations-runtime "Log Control at Runtime")
* [Benefícios e Características das Tabelas de Log](log-destinations.html#log-destinations-tables "Log Table Benefits and Characteristics")

#### Controle de Log na Inicialização do Server

A variável de sistema [`log_output`](server-system-variables.html#sysvar_log_output) especifica o destino para a saída de log. Definir esta variável não habilita os logs por si só; eles devem ser habilitados separadamente.

* Se [`log_output`](server-system-variables.html#sysvar_log_output) não for especificada na inicialização, o destino de logging padrão é `FILE`.

* Se [`log_output`](server-system-variables.html#sysvar_log_output) for especificada na inicialização, seu valor é uma lista de uma ou mais palavras separadas por vírgula, escolhidas entre `TABLE` (log para tabelas), `FILE` (log para arquivos), ou `NONE` (não registra log em tabelas ou arquivos). `NONE`, se presente, tem precedência sobre quaisquer outros especificadores.

A variável de sistema [`general_log`](server-system-variables.html#sysvar_general_log) controla o logging para o general query log para os destinos de log selecionados. Se especificada na inicialização do server, [`general_log`](server-system-variables.html#sysvar_general_log) aceita um argumento opcional de 1 ou 0 para habilitar ou desabilitar o log. Para especificar um nome de arquivo diferente do padrão para o logging de arquivo, defina a variável [`general_log_file`](server-system-variables.html#sysvar_general_log_file). Da mesma forma, a variável [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log) controla o logging para o slow query log para os destinos selecionados e definir [`slow_query_log_file`](server-system-variables.html#sysvar_slow_query_log_file) especifica um nome de arquivo para o logging de arquivo. Se qualquer um dos logs estiver habilitado, o server abre o arquivo de log correspondente e escreve as mensagens de inicialização nele. No entanto, o logging subsequente de Querys para o arquivo não ocorrerá, a menos que o destino de log `FILE` seja selecionado.

Exemplos:

* Para escrever entradas do general query log para a tabela de log e o arquivo de log, use [`--log_output=TABLE,FILE`](server-system-variables.html#sysvar_log_output) para selecionar ambos os destinos de log e [`--general_log`](server-system-variables.html#sysvar_general_log) para habilitar o general query log.

* Para escrever entradas do general e slow query log apenas nas tabelas de log, use [`--log_output=TABLE`](server-system-variables.html#sysvar_log_output) para selecionar tabelas como destino de log e [`--general_log`](server-system-variables.html#sysvar_general_log) e [`--slow_query_log`](server-system-variables.html#sysvar_slow_query_log) para habilitar ambos os logs.

* Para escrever entradas do slow query log apenas no arquivo de log, use [`--log_output=FILE`](server-system-variables.html#sysvar_log_output) para selecionar arquivos como destino de log e [`--slow_query_log`](server-system-variables.html#sysvar_slow_query_log) para habilitar o slow query log. Neste caso, como o destino de log padrão é `FILE`, você poderia omitir a configuração de [`log_output`](server-system-variables.html#sysvar_log_output).

#### Controle de Log em Tempo de Execução

As variáveis de sistema associadas a tabelas e arquivos de log permitem o controle de logging em tempo de execução:

* A variável [`log_output`](server-system-variables.html#sysvar_log_output) indica o destino de logging atual. Ela pode ser modificada em tempo de execução para alterar o destino.

* As variáveis [`general_log`](server-system-variables.html#sysvar_general_log) e [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log) indicam se o general query log e o slow query log estão habilitados (`ON`) ou desabilitados (`OFF`). Você pode definir essas variáveis em tempo de execução para controlar se os logs estão habilitados.

* As variáveis [`general_log_file`](server-system-variables.html#sysvar_general_log_file) e [`slow_query_log_file`](server-system-variables.html#sysvar_slow_query_log_file) indicam os nomes dos arquivos do general query log e do slow query log. Você pode definir essas variáveis na inicialização do server ou em tempo de execução para alterar os nomes dos arquivos de log.

* Para desabilitar ou habilitar o logging de Querys gerais para a sessão atual, defina a variável de sessão [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off) como `ON` ou `OFF`. (Isso pressupõe que o general query log em si esteja habilitado.)

#### Benefícios e Características das Tabelas de Log

O uso de tabelas para saída de log oferece os seguintes benefícios:

* As entradas de log têm um formato padrão. Para exibir a estrutura atual das tabelas de log, use estas instruções:

  ```sql
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```

* O conteúdo do log é acessível por meio de comandos SQL. Isso permite o uso de Querys que selecionam apenas as entradas de log que satisfazem critérios específicos. Por exemplo, para selecionar o conteúdo de log associado a um cliente específico (o que pode ser útil para identificar Querys problemáticas desse cliente), é mais fácil fazer isso usando uma tabela de log do que um arquivo de log.

* Os logs são acessíveis remotamente por meio de qualquer cliente que possa se conectar ao server e emitir Querys (se o cliente tiver os privilégios de tabela de log apropriados). Não é necessário fazer login no host do server e acessar diretamente o file system.

A implementação da tabela de log tem as seguintes características:

* Em geral, o objetivo principal das tabelas de log é fornecer uma interface para que os usuários observem a execução em tempo de execução do server, e não interferir na sua execução em tempo de execução.

* [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") são operações válidas em uma tabela de log. Para [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), a tabela de log não pode estar em uso e deve ser desabilitada, conforme descrito posteriormente.

* Por padrão, as tabelas de log usam o storage engine `CSV` que grava dados no formato de valores separados por vírgula (`comma-separated values`). Para usuários que têm acesso aos arquivos `.CSV` que contêm dados da tabela de log, os arquivos são fáceis de importar para outros programas, como planilhas, que podem processar a entrada `CSV`.

  As tabelas de log podem ser alteradas para usar o storage engine `MyISAM`. Você não pode usar [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para alterar uma tabela de log que esteja em uso. O log deve ser desabilitado primeiro. Nenhum engine além de `CSV` ou `MyISAM` é permitido para as tabelas de log.

  **Tabelas de Log e Erros de “Too many open files” (Muitos arquivos abertos).** Se você selecionar `TABLE` como destino de log e as tabelas de log usarem o storage engine `CSV`, você pode descobrir que desabilitar e habilitar repetidamente o general query log ou slow query log em tempo de execução resulta em um grande número de descritores de arquivo abertos para o arquivo `.CSV`, possivelmente resultando em um erro de “Too many open files”. Para contornar esse problema, execute [`FLUSH TABLES`](flush.html "13.7.6.3 FLUSH Statement") ou garanta que o valor de [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) seja maior do que o valor de [`table_open_cache_instances`](server-system-variables.html#sysvar_table_open_cache_instances).

* Para desabilitar o logging para que você possa alterar (ou remover) uma tabela de log, você pode usar a seguinte estratégia. O exemplo usa o general query log; o procedimento para o slow query log é semelhante, mas usa a tabela `slow_log` e a variável de sistema [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log).

  ```sql
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```

* [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é uma operação válida em uma tabela de log. Pode ser usada para expirar entradas de log.

* [`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") é uma operação válida em uma tabela de log. Você pode renomear atomicamente uma tabela de log (para executar a rotação de log, por exemplo) usando a seguinte estratégia:

  ```sql
  USE mysql;
  DROP TABLE IF EXISTS general_log2;
  CREATE TABLE general_log2 LIKE general_log;
  RENAME TABLE general_log TO general_log_backup, general_log2 TO general_log;
  ```

* [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") é uma operação válida em uma tabela de log.

* [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") não pode ser usado em uma tabela de log.

* [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement") não podem ser usados em uma tabela de log. Essas operações são permitidas apenas internamente ao próprio server.

* [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) e o estado da variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) não têm efeito nas tabelas de log. O server sempre pode escrever nas tabelas de log.

* As entradas escritas nas tabelas de log não são escritas no binary log e, portanto, não são replicadas para as réplicas.

* Para fazer o flush das tabelas de log ou arquivos de log, use [`FLUSH TABLES`](flush.html#flush-tables) ou [`FLUSH LOGS`](flush.html#flush-logs), respectivamente.

* O Partitioning de tabelas de log não é permitido.
* Um dump do [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") inclui instruções para recriar essas tabelas para que elas não estejam ausentes após recarregar o arquivo de dump. O conteúdo da tabela de log não é incluído no dump.