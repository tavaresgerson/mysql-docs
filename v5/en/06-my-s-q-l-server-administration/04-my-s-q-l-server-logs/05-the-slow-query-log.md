### 5.4.5 O Slow Query Log

O slow query log consiste em SQL Statements que levam mais de [`long_query_time`] segundos para serem executados e que exigem que pelo menos [`min_examined_row_limit`] linhas sejam examinadas. O slow query log pode ser usado para encontrar Queries que demoram muito tempo para serem executadas e que, portanto, são candidatas à otimização. No entanto, examinar um slow query log extenso pode ser uma tarefa demorada. Para facilitar isso, você pode usar o comando [**mysqldumpslow**] para processar um arquivo de slow query log e resumir seu conteúdo. Consulte [Seção 4.6.8, “mysqldumpslow — Summarize Slow Query Log Files”].

O tempo para adquirir os Locks iniciais não é contado como tempo de execução. O [**mysqld**] escreve um Statement no slow query log após ele ter sido executado e após todos os Locks terem sido liberados, portanto, a ordem do Log pode diferir da ordem de execução.

* [Parâmetros do Slow Query Log]
* [Conteúdo do Slow Query Log]

#### Parâmetros do Slow Query Log

Os valores mínimo e padrão de [`long_query_time`] são 0 e 10, respectivamente. O valor pode ser especificado com uma resolução de microssegundos.

Por padrão, os Statements administrativos não são registrados (logged), nem as Queries que não usam Indexes para lookups. Este comportamento pode ser alterado usando [`log_slow_admin_statements`] e [`log_queries_not_using_indexes`], conforme descrito adiante.

Por padrão, o slow query log está desabilitado. Para especificar o estado inicial do slow query log explicitamente, use [`--slow_query_log[={0|1}]`]. Sem argumento ou com um argumento de 1, [`--slow_query_log`] habilita o Log. Com um argumento de 0, esta opção desabilita o Log. Para especificar um nome de arquivo de Log, use [`--slow_query_log_file=file_name`]. Para especificar o destino do Log, use a variável de sistema [`log_output`] (conforme descrito na [Seção 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”]).

Nota

Se você especificar o destino de Log `TABLE`, consulte [Tabelas de Log e Erros de “Too many open files”].

Se você não especificar um nome para o arquivo do slow query log, o nome padrão é `host_name-slow.log`. O Server cria o arquivo no data directory, a menos que um path absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o slow query log ou alterar o nome do arquivo de Log em tempo de execução (runtime), use as variáveis de sistema globais [`slow_query_log`] e [`slow_query_log_file`]. Defina [`slow_query_log`] como 0 para desabilitar o Log ou como 1 para habilitá-lo. Defina [`slow_query_log_file`] para especificar o nome do arquivo de Log. Se um arquivo de Log já estiver aberto, ele será fechado e o novo arquivo será aberto.

O Server escreve menos informações no slow query log se você usar a opção [`--log-short-format`].

Para incluir Statements administrativos lentos no slow query log, habilite a variável de sistema [`log_slow_admin_statements`]. Os Statements administrativos incluem [`ALTER TABLE`], [`ANALYZE TABLE`], [`CHECK TABLE`], [`CREATE INDEX`], [`DROP INDEX`], [`OPTIMIZE TABLE`], e [`REPAIR TABLE`].

Para incluir Queries que não usam Indexes para lookups de linha nos Statements escritos no slow query log, habilite a variável de sistema [`log_queries_not_using_indexes`]. (Mesmo com essa variável habilitada, o Server não registra Queries que não se beneficiariam da presença de um Index devido a tabela ter menos de duas linhas.)

Quando Queries que não usam um Index são registradas, o slow query log pode crescer rapidamente. É possível impor um limite de taxa (rate limit) a essas Queries definindo a variável de sistema [`log_throttle_queries_not_using_indexes`]. Por padrão, essa variável é 0, o que significa que não há limite. Valores positivos impõem um limite por minuto no logging de Queries que não usam Indexes. A primeira Query desse tipo abre uma janela de 60 segundos, dentro da qual o Server registra Queries até o limite fornecido, e então suprime Queries adicionais. Se houver Queries suprimidas quando a janela terminar, o Server registra um resumo que indica quantas foram e o tempo total gasto nelas. A próxima janela de 60 segundos começa quando o Server registra a próxima Query que não usa Indexes.

O Server usa os parâmetros de controle na seguinte ordem para determinar se deve escrever uma Query no slow query log:

1. A Query não deve ser um Statement administrativo, ou [`log_slow_admin_statements`] deve estar habilitado.

2. A Query deve ter levado pelo menos [`long_query_time`] segundos, ou [`log_queries_not_using_indexes`] deve estar habilitado e a Query não usou Indexes para lookups de linha.

3. A Query deve ter examinado pelo menos [`min_examined_row_limit`] linhas.

4. A Query não deve ser suprimida de acordo com a configuração de [`log_throttle_queries_not_using_indexes`].

A variável de sistema [`log_timestamps`] controla o fuso horário dos timestamps nas mensagens escritas no arquivo do slow query log (assim como no arquivo do general query log e no error log). Ela não afeta o fuso horário das mensagens do general query log e slow query log escritas nas tabelas de Log, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com [`CONVERT_TZ()`] ou configurando a variável de sistema de sessão [`time_zone`].

O Server não registra Queries tratadas pela Query Cache.

Por padrão, uma Replica não escreve Queries replicadas no slow query log. Para mudar isso, habilite a variável de sistema [`log_slow_slave_statements`]. Note que se a Replication baseada em linha (row-based) estiver em uso ([`binlog_format=ROW`]), [`log_slow_slave_statements`] não tem efeito. Queries são adicionadas ao slow query log da Replica apenas quando são registradas no formato Statement no Binary Log, ou seja, quando [`binlog_format=STATEMENT`] está definido, ou quando [`binlog_format=MIXED`] está definido e o Statement é registrado no formato Statement. Queries lentas que são registradas no formato row quando [`binlog_format=MIXED`] está definido, ou que são registradas quando [`binlog_format=ROW`] está definido, não são adicionadas ao slow query log da Replica, mesmo que [`log_slow_slave_statements`] esteja habilitado.

#### Conteúdo do Slow Query Log

Quando o slow query log está habilitado, o Server escreve a saída para quaisquer destinos especificados pela variável de sistema [`log_output`]. Se você habilitar o Log, o Server abre o arquivo de Log e escreve mensagens de inicialização nele. No entanto, o registro posterior de Queries no arquivo não ocorre a menos que o destino de Log `FILE` seja selecionado. Se o destino for `NONE`, o Server não escreve Queries, mesmo que o slow query log esteja habilitado. Definir o nome do arquivo de Log não tem efeito no logging se `FILE` não for selecionado como destino de saída.

Se o slow query log estiver habilitado e `FILE` for selecionado como destino de saída, cada Statement escrito no Log é precedido por uma linha que começa com o caractere `#` e possui estes campos (com todos os campos em uma única linha):

* `Query_time: duration`

  O tempo de execução do Statement em segundos.

* `Lock_time: duration`

  O tempo para adquirir Locks em segundos.

* `Rows_sent: N`

  O número de linhas enviadas ao cliente.

* `Rows_examined:`

  O número de linhas examinadas pela camada do Server (sem contar qualquer processamento interno aos storage engines).

Cada Statement escrito no arquivo do slow query log é precedido por um Statement [`SET`] que inclui um timestamp indicando quando o Statement lento foi registrado (o que ocorre após o Statement terminar a execução).

Senhas em Statements escritos no slow query log são reescritas pelo Server para que não apareçam literalmente como texto puro (plain text). Consulte [Seção 6.1.2.3, “Passwords and Logging”].

A partir do MySQL 5.7.38, Statements que não podem ser parseados (devido, por exemplo, a erros de sintaxe) não são escritos no slow query log.