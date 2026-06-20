## 26.4 Objeto de esquema do sistema de referência ##

O esquema `sys` inclui tabelas e gatilhos, visualizações e procedimentos e funções armazenadas. As seções a seguir fornecem detalhes para cada um desses objetos.

### 26.4.1 Objeto de esquema do sistema sys

As tabelas a seguir listam os objetos do esquema `sys` e fornecem uma breve descrição de cada um.

**Tabela 26.1 Tabelas e gatilhos do esquema sys**

<table frame="box" rules="all" summary="Tables and triggers used in the sys schema implementation."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table or Trigger Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>sys_config</code></td> <td>sys schema configuration options table</td> </tr><tr><td><code>sys_config_insert_set_user</code></td> <td>sys_config insert trigger</td> </tr><tr><td><code>sys_config_update_set_user</code></td> <td>sys_config update trigger</td> </tr></tbody></table>

**Tabela 26.2 Visões do esquema sys**

<table frame="box" rules="all" summary="Views used in the sys schema implementation.">
<col style="width: 25%"/>
<col style="width: 62%"/>
<col style="width: 12%"/>
<thead>
<tr>
<th>View Name</th>
<th>Description</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>host_summary</code>, <code>x$host_summary</code></th>
<td>Statement activity, file I/O, and connections, grouped by host</td>
<td></td>
</tr>
<tr>
<th><code>host_summary_by_file_io</code>, <code>x$host_summary_by_file_io</code></th>
<td>File I/O, grouped by host</td>
<td></td>
</tr>
<tr>
<th><code>host_summary_by_file_io_type</code>, <code>x$host_summary_by_file_io_type</code></th>
<td>File I/O, grouped by host and event type</td>
<td></td>
</tr>
<tr>
<th><code>host_summary_by_stages</code>,<code>x$host_summary_by_stages</code></th>
<td>Etapas de declaração, agrupadas por anfitrião</td>
<td></td>
</tr>
<tr>
<th><code>host_summary_by_statement_latency</code>,<code>x$host_summary_by_statement_latency</code></th>
<td>Estatísticas de declaração, agrupadas por anfitrião</td>
<td></td>
</tr>
<tr>
<th><code>host_summary_by_statement_type</code>,<code>x$host_summary_by_statement_type</code></th>
<td>Declarações executadas, agrupadas por anfitrião e declaração</td>
<td></td>
</tr>
<tr>
<th><code>innodb_buffer_stats_by_schema</code>,<code>x$innodb_buffer_stats_by_schema</code></th>
<td>Informações do buffer do InnoDB, agrupadas por esquema</td>
<td></td>
</tr>
<tr>
<th><code>innodb_buffer_stats_by_table</code>,<code>x$innodb_buffer_stats_by_table</code></th>
<td>Informações do buffer do InnoDB, agrupadas por esquema e tabela</td>
<td></td>
</tr>
<tr>
<th><code>innodb_lock_waits</code>,<code>x$innodb_lock_waits</code></th>
<td>Informações de bloqueio do InnoDB</td>
<td></td>
</tr>
<tr>
<th><code>io_by_thread_by_latency</code>, <code>x$io_by_thread_by_latency</code></th>
<td>I/O consumers, grouped by thread</td>
<td></td>
</tr>
<tr>
<th><code>io_global_by_file_by_bytes</code>, <code>x$io_global_by_file_by_bytes</code></th>
<td>Global I/O consumers, grouped by file and bytes</td>
<td></td>
</tr>
<tr>
<th><code>io_global_by_file_by_latency</code>, <code>x$io_global_by_file_by_latency</code></th>
<td>Global I/O consumers, grouped by file and latency</td>
<td></td>
</tr>
<tr>
<th><code>io_global_by_wait_by_bytes</code>, <code>x$io_global_by_wait_by_bytes</code></th>
<td>Global I/O consumers, grouped by bytes</td>
<td></td>
</tr>
<tr>
<th><code>io_global_by_wait_by_latency</code>, <code>x$io_global_by_wait_by_latency</code></th>
<td>Global I/O consumers, grouped by latency</td>
<td></td>
</tr>
<tr>
<th><code>latest_file_io</code>, <code>x$latest_file_io</code></th>
<td>Most recent I/O, grouped by file and thread</td>
<td></td>
</tr>
<tr>
<th><code>memory_by_host_by_current_bytes</code>,<code>x$memory_by_host_by_current_bytes</code></th>
<td>Uso da memória, agrupado por host</td>
<td></td>
</tr>
<tr>
<th><code>memory_by_thread_by_current_bytes</code>,<code>x$memory_by_thread_by_current_bytes</code></th>
<td>Uso da memória, agrupado por thread</td>
<td></td>
</tr>
<tr>
<th><code>memory_by_user_by_current_bytes</code>,<code>x$memory_by_user_by_current_bytes</code></th>
<td>Uso da memória, agrupado por usuário</td>
<td></td>
</tr>
<tr>
<th><code>memory_global_by_current_bytes</code>,<code>x$memory_global_by_current_bytes</code></th>
<td>Uso da memória, agrupado por tipo de alocação</td>
<td></td>
</tr>
<tr>
<th><code>memory_global_total</code>,<code>x$memory_global_total</code></th>
<td>Uso total da memória</td>
<td></td>
</tr>
<tr>
<th><code>metrics</code></th>
<td>Server metrics</td>
<td></td>
</tr>
<tr>
<th><code>processlist</code>,<code>x$processlist</code></th>
<td>Informações sobre o Processlist</td>
<td></td>
</tr>
<tr>
<th><code>ps_check_lost_instrumentation</code></th>
<td>Variáveis que perderam instrumentos</td>
<td></td>
</tr>
<tr>
<th><code>schema_auto_increment_columns</code></th>
<td>AUTO_INCREMENT column information</td>
<td></td>
</tr>
<tr>
<th><code>schema_index_statistics</code>,<code>x$schema_index_statistics</code></th>
<td>Estatísticas do índice</td>
<td></td>
</tr>
<tr>
<th><code>schema_object_overview</code></th>
<td>Tipos de objetos dentro de cada esquema</td>
<td></td>
</tr>
<tr>
<th><code>schema_redundant_indexes</code></th>
<td>Indekses duplicados ou redundantes</td>
<td></td>
</tr>
<tr>
<th><code>schema_table_lock_waits</code>,<code>x$schema_table_lock_waits</code></th>
<td>Sessões aguardando bloqueios de metadados</td>
<td></td>
</tr>
<tr>
<th><code>schema_table_statistics</code>,<code>x$schema_table_statistics</code></th>
<td>Estatísticas da tabela</td>
<td></td>
</tr>
<tr>
<th><code>schema_table_statistics_with_buffer</code>,<code>x$schema_table_statistics_with_buffer</code></th>
<td>Estatísticas de tabela, incluindo estatísticas do pool de buffer do InnoDB</td>
<td></td>
</tr>
<tr>
<th><code>schema_tables_with_full_table_scans</code>,<code>x$schema_tables_with_full_table_scans</code></th>
<td>Tabelas acessadas com varreduras completas</td>
<td></td>
</tr>
<tr>
<th><code>schema_unused_indexes</code></th>
<td>Indicadores não em uso ativo</td>
<td></td>
</tr>
<tr>
<th><code>session</code>,<code>x$session</code></th>
<td>Informações do Processlist para sessões do usuário</td>
<td></td>
</tr>
<tr>
<th><code>session_ssl_status</code></th>
<td>Connection SSL information</td>
<td></td>
</tr>
<tr>
<th><code>statement_analysis</code>,<code>x$statement_analysis</code></th>
<td>Estatísticas agregadas de declaração</td>
<td></td>
</tr>
<tr>
<th><code>statements_with_errors_or_warnings</code>,<code>x$statements_with_errors_or_warnings</code></th>
<td>Declarações que produziram erros ou avisos</td>
<td></td>
</tr>
<tr>
<th><code>statements_with_full_table_scans</code>,<code>x$statements_with_full_table_scans</code></th>
<td>Declarações que realizaram varreduras completas da tabela</td>
<td></td>
</tr>
<tr>
<th><code>statements_with_runtimes_in_95th_percentile</code>,<code>x$statements_with_runtimes_in_95th_percentile</code></th>
<td>Declarações com maior tempo médio de execução</td>
<td></td>
</tr>
<tr>
<th><code>statements_with_sorting</code>,<code>x$statements_with_sorting</code></th>
<td>Declarações que realizaram classificações</td>
<td></td>
</tr>
<tr>
<th><code>statements_with_temp_tables</code>,<code>x$statements_with_temp_tables</code></th>
<td>Declarações que utilizaram tabelas temporárias</td>
<td></td>
</tr>
<tr>
<th><code>user_summary</code>,<code>x$user_summary</code></th>
<td>Declaração do usuário e atividade de conexão</td>
<td></td>
</tr>
<tr>
<th><code>user_summary_by_file_io</code>, <code>x$user_summary_by_file_io</code></th>
<td>File I/O, grouped by user</td>
<td></td>
</tr>
<tr>
<th><code>user_summary_by_file_io_type</code>, <code>x$user_summary_by_file_io_type</code></th>
<td>File I/O, grouped by user and event</td>
<td></td>
</tr>
<tr>
<th><code>user_summary_by_stages</code>,<code>x$user_summary_by_stages</code></th>
<td>Eventos em andamento, agrupados por usuário</td>
<td></td>
</tr>
<tr>
<th><code>user_summary_by_statement_latency</code>,<code>x$user_summary_by_statement_latency</code></th>
<td>Estatísticas de declaração, agrupadas por usuário</td>
<td></td>
</tr>
<tr>
<th><code>user_summary_by_statement_type</code>,<code>x$user_summary_by_statement_type</code></th>
<td>Declarações executadas, agrupadas por usuário e declaração</td>
<td></td>
</tr>
<tr>
<th><code>version</code></th>
<td>Atual sistema de esquema e versões do servidor MySQL</td>
<td>5.7.28</td>
</tr>
<tr>
<th><code>wait_classes_global_by_avg_latency</code>,<code>x$wait_classes_global_by_avg_latency</code></th>
<td>Esperar latência média de classe, agrupada por classe de evento</td>
<td></td>
</tr>
<tr>
<th><code>wait_classes_global_by_latency</code>,<code>x$wait_classes_global_by_latency</code></th>
<td>Espere a latência total da classe, agrupada por classe de evento</td>
<td></td>
</tr>
<tr>
<th><code>waits_by_host_by_latency</code>,<code>x$waits_by_host_by_latency</code></th>
<td>Eventos de espera, agrupados por anfitrião e evento</td>
<td></td>
</tr>
<tr>
<th><code>waits_by_user_by_latency</code>,<code>x$waits_by_user_by_latency</code></th>
<td>Eventos de espera, agrupados por usuário e evento</td>
<td></td>
</tr>
<tr>
<th><code>waits_global_by_latency</code>,<code>x$waits_global_by_latency</code></th>
<td>Eventos de espera, agrupados por evento</td>
<td></td>
</tr>
<tr>
<th><code>x$ps_digest_95th_percentile_by_avg_us</code></th>
<td>Visualização de auxílio para visualizações do 95º percentil</td>
<td></td>
</tr>
<tr>
<th><code>x$ps_digest_avg_latency_distribution</code></th>
<td>Visualização de auxílio para visualizações do 95º percentil</td>
<td></td>
</tr>
<tr>
<th><code>x$ps_schema_table_statistics_io</code></th>
<td>Visualização de auxílio para visualizações de estatísticas de tabela</td>
<td></td>
</tr>
<tr>
<th><code>x$schema_flattened_keys</code></th>
<td>Helper view for schema_redundant_indexes</td>
<td></td>
</tr>
</tbody>
</table>

**Tabela 26.3 Schema Sys Stored Procedures**

<table frame="box" rules="all" summary="Stored procedures used in the sys schema implementation."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Procedure Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>create_synonym_db()</code></td> <td>Crie sinônimos para o esquema</td> </tr><tr><td><code>diagnostics()</code></td> <td>Colete informações de diagnóstico do sistema</td> </tr><tr><td><code>execute_prepared_stmt()</code></td> <td>Executar a declaração preparada</td> </tr><tr><td><code>ps_setup_disable_background_threads()</code></td> <td>Desative a instrumentação de thread de fundo</td> </tr><tr><td><code>ps_setup_disable_consumer()</code></td> <td>Desative os consumidores</td> </tr><tr><td><code>ps_setup_disable_instrument()</code></td> <td>Desative os instrumentos</td> </tr><tr><td><code>ps_setup_disable_thread()</code></td> <td>Desative a instrumentação para o thread</td> </tr><tr><td><code>ps_setup_enable_background_threads()</code></td> <td>Habilitar a instrumentação de threads de fundo</td> </tr><tr><td><code>ps_setup_enable_consumer()</code></td> <td>Ative os consumidores</td> </tr><tr><td><code>ps_setup_enable_instrument()</code></td> <td>Habilitar instrumentos</td> </tr><tr><td><code>ps_setup_enable_thread()</code></td> <td>Ative a instrumentação para o thread</td> </tr><tr><td><code>ps_setup_reload_saved()</code></td> <td>Recarregar a configuração salva do Schema de desempenho</td> </tr><tr><td><code>ps_setup_reset_to_default()</code></td> <td>Redefinir a configuração salva do Schema de desempenho</td> </tr><tr><td><code>ps_setup_save()</code></td> <td>Salvar a configuração do Schema de desempenho</td> </tr><tr><td><code>ps_setup_show_disabled()</code></td> <td>Exibição da configuração do Schema de desempenho desativado</td> </tr><tr><td><code>ps_setup_show_disabled_consumers()</code></td> <td>Exibir consumidores do Schema de desempenho desabilitados</td> </tr><tr><td><code>ps_setup_show_disabled_instruments()</code></td> <td>Exibir instrumentos do Schema de desempenho desabilitados</td> </tr><tr><td><code>ps_setup_show_enabled()</code></td> <td>Exibição da configuração do Schema de desempenho habilitada</td> </tr><tr><td><code>ps_setup_show_enabled_consumers()</code></td> <td>Exibir consumidores do Schema de desempenho habilitado</td> </tr><tr><td><code>ps_setup_show_enabled_instruments()</code></td> <td>Exibir instrumentos do Schema de desempenho habilitados</td> </tr><tr><td><code>ps_statement_avg_latency_histogram()</code></td> <td>Histograma de latência da declaração de exibição</td> </tr><tr><td><code>ps_trace_statement_digest()</code></td> <td>Instrumentação do esquema de desempenho Trace para digestão</td> </tr><tr><td><code>ps_trace_thread()</code></td> <td>Dados do esquema de desempenho do thread</td> </tr><tr><td><code>ps_truncate_all_tables()</code></td> <td>Resumo das tabelas do Schema de desempenho</td> </tr><tr><td><code>statement_performance_analyzer()</code></td> <td>Relatório de declarações em execução no servidor</td> </tr><tr><td><code>table_exists()</code></td> <td>Se uma tabela existe</td> </tr></tbody></table>

**Tabela 26.4 Funções Armazenadas no Schema sys**

<table frame="box" rules="all" summary="Stored functions used in the sys schema implementation."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Function Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th><code>extract_schema_from_file_name()</code></th> <td>Nome do esquema extraído da parte do nome do arquivo</td> <td></td> </tr><tr><th><code>extract_table_from_file_name()</code></th> <td>Extrair parte do nome do arquivo que é o nome da tabela</td> <td></td> </tr><tr><th><code>format_bytes()</code></th> <td>Converte o número de bytes em valor com unidades</td> <td></td> </tr><tr><th><code>format_path()</code></th> <td>Substitua diretórios no nome do caminho por nomes de variáveis simbólicas do sistema</td> <td></td> </tr><tr><th><code>format_statement()</code></th> <td>Reduzir declarações longas a um comprimento fixo</td> <td></td> </tr><tr><th><code>format_time()</code></th> <td>Converte o tempo em picosegundos para valor com unidades</td> <td></td> </tr><tr><th><code>list_add()</code></th> <td>Adicione o item à lista</td> <td></td> </tr><tr><th><code>list_drop()</code></th> <td>Remova o item da lista</td> <td></td> </tr><tr><th><code>ps_is_account_enabled()</code></th> <td>Se a instrumentação do Schema de Desempenho para conta está habilitada</td> <td></td> </tr><tr><th><code>ps_is_consumer_enabled()</code></th> <td>Se o consumidor do Schema de desempenho está habilitado</td> <td></td> </tr><tr><th><code>ps_is_instrument_default_enabled()</code></th> <td>Se o instrumento do Schema de Desempenho é ativado por padrão</td> <td></td> </tr><tr><th><code>ps_is_instrument_default_timed()</code></th> <td>Se o instrumento do Schema de Desempenho é temporizado por padrão</td> <td></td> </tr><tr><th><code>ps_is_thread_instrumented()</code></th> <td>Se a instrumentação do Schema de Desempenho para o ID de conexão está habilitada</td> <td></td> </tr><tr><th><code>ps_thread_account()</code></th> <td>Conta associada ao ID de thread do Schema de desempenho</td> <td></td> </tr><tr><th><code>ps_thread_id()</code></th> <td>ID do thread do esquema de desempenho associado ao ID de conexão</td> <td></td> </tr><tr><th><code>ps_thread_stack()</code></th> <td>Informações sobre o evento para o ID de conexão</td> <td></td> </tr><tr><th><code>ps_thread_trx_info()</code></th> <td>Informações sobre a transação para o ID de tópico</td> <td></td> </tr><tr><th><code>quote_identifier()</code></th> <td>Quote string as identifier</td> <td>5.7.14</td> </tr><tr><th><code>sys_get_config()</code></th> <td>valor da opção de configuração do esquema do sys</td> <td></td> </tr><tr><th><code>version_major()</code></th> <td>Número principal da versão do servidor MySQL</td> <td></td> </tr><tr><th><code>version_minor()</code></th> <td>Número menor da versão do servidor MySQL</td> <td></td> </tr><tr><th><code>version_patch()</code></th> <td>Número da versão de correção do servidor MySQL</td> <td></td> </tr></tbody></table>

### 26.4.2 Tabelas e gatilhos do esquema sys

As seções a seguir descrevem as tabelas e gatilhos do esquema `sys`.

#### 26.4.2.1 A tabela sys\_config

Esta tabela contém as opções de configuração do esquema `sys`, uma string por opção. As alterações de configuração feitas ao atualizar esta tabela persistem em todas as sessões do cliente e reinício do servidor.

A tabela `sys_config` tem essas colunas:

* `variable`

O nome da opção de configuração.

* `value`

O valor da opção de configuração.

* `set_time`

O horário de data da modificação mais recente da string.

* `set_by`

A conta que fez a modificação mais recente na string. O valor é `NULL` se a string não tiver sido alterada desde que o esquema `sys` foi instalado.

Como uma medida de eficiência para minimizar o número de leituras diretas da tabela `sys_config`, as funções do esquema `sys` que utilizam um valor desta tabela verificam uma variável definida pelo usuário com um nome correspondente, que é a variável definida pelo usuário com o mesmo nome mais um prefixo de `@sys.`. (Por exemplo, a variável correspondente à opção `diagnostics.include_raw` é `@sys.diagnostics.include_raw`. Se a variável definida pelo usuário existir na sessão atual e não for `NULL`, a função utiliza seu valor em preferência ao valor na tabela `sys_config`. Caso contrário, a função lê e utiliza o valor da tabela. No último caso, a função que realiza a chamada define convencionalmente também a variável definida pelo usuário para o valor da tabela, para que referências adicionais à opção de configuração dentro da mesma sessão utilizem a variável e não precisem ler a tabela novamente.

Por exemplo, a opção `statement_truncate_len` controla o comprimento máximo das declarações retornadas pela função `format_statement()`). O valor padrão é 64. Para alterar temporariamente o valor para 32 para sua sessão atual, defina a variável definida pelo usuário correspondente `@sys.statement_truncate_len`:

```sql
mysql> SET @stmt = 'SELECT variable, value, set_time, set_by FROM sys_config';
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
mysql> SET @sys.statement_truncate_len = 32;
mysql> SELECT sys.format_statement(@stmt);
+-----------------------------------+
| sys.format_statement(@stmt)       |
+-----------------------------------+
| SELECT variabl ... ROM sys_config |
+-----------------------------------+
```

As invocações subsequentes da função `format_statement()` dentro da sessão continuam a utilizar o valor da variável definida pelo usuário (32), em vez do valor armazenado na tabela (64).

Para parar de usar a variável definida pelo usuário e voltar a usar o valor da tabela, defina a variável como `NULL` dentro da sua sessão:

```sql
mysql> SET @sys.statement_truncate_len = NULL;
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
```

Alternativamente, termine sua sessão atual (causando a variável definida pelo usuário para não existir mais) e comece uma nova sessão.

A relação convencional descrita acima entre as opções na tabela `sys_config` e as variáveis definidas pelo usuário pode ser explorada para fazer alterações temporárias de configuração que terminam quando a sessão termina. No entanto, se você definir uma variável definida pelo usuário e, em seguida, alterar o valor correspondente da tabela na mesma sessão, o valor alterado da tabela não será usado nessa sessão, desde que a variável definida pelo usuário exista e não seja `NULL`. (O valor alterado da tabela *é* usado em outras sessões que não têm a variável definida pelo usuário atribuída.)

A lista a seguir descreve as opções na tabela `sys_config` e as variáveis definidas pelo usuário correspondentes:

* `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

Se esta opção for `ON`, o procedimento `diagnostics()` é permitido para realizar varreduras de tabela na tabela do esquema de informação `TABLES`. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

* `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

Se esta opção for `ON`, o procedimento `diagnostics()` inclui a saída bruta da consulta à visão `metrics`. O padrão é `OFF`.

* `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

O comprimento máximo para a saída JSON produzida pela função `ps_thread_trx_info()`") é o padrão 65535.

* `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

O número máximo de strings a serem retornadas para visualizações que não possuem um limite embutido. (Por exemplo, a visualização `statements_with_runtimes_in_95th_percentile` tem um limite embutido no sentido de que ela retorna apenas declarações com tempo de execução médio no percentil 95. O padrão é 100.

* `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

A consulta ou visualização personalizada a ser usada pelo procedimento `statement_performance_analyzer()`") (que é invocado por si mesmo pelo procedimento `diagnostics()`")). Se o valor da opção contiver um espaço, ele é interpretado como uma consulta. Caso contrário, deve ser o nome de uma visualização existente que consulta a tabela do Gerador de desempenho `events_statements_summary_by_digest`. Não pode haver nenhuma cláusula `LIMIT` na definição da consulta ou visualização se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. O padrão é `NULL` (sem visualização personalizada definida).

* `statement_truncate_len`, `@sys.statement_truncate_len`

O comprimento máximo das declarações retornadas pela função `format_statement()`") é esse comprimento. As declarações mais longas são truncadas para esse comprimento. O padrão é 64.

Outras opções podem ser adicionadas à tabela `sys_config`. Por exemplo, os procedimentos `diagnostics()` e `execute_prepared_stmt()` usam a opção `debug` se ela existir, mas essa opção não faz parte da tabela `sys_config` por padrão, porque a saída de depuração normalmente é habilitada apenas temporariamente, definindo a variável definida pelo usuário `@sys.debug` correspondente. Para habilitar a saída de depuração sem precisar definir essa variável em sessões individuais, adicione a opção à tabela:

```sql
mysql> INSERT INTO sys.sys_config (variable, value) VALUES('debug', 'ON');
```

Para alterar a configuração de depuração na tabela, faça duas coisas. Primeiro, modifique o valor na própria tabela:

```sql
mysql> UPDATE sys.sys_config
       SET value = 'OFF'
       WHERE variable = 'debug';
```

Em segundo lugar, para garantir também que as invocações de procedimento dentro da sessão atual usem o valor alterado da tabela, defina a variável definida pelo usuário correspondente para `NULL`:

```sql
mysql> SET @sys.debug = NULL;
```

#### 26.4.2.2 O gatilho sys\_config\_insert\_set\_user

Para as strings adicionadas à tabela `sys_config` por declarações do `INSERT`, o gatilho `sys_config_insert_set_user` define a coluna `set_by` para o usuário atual.

#### 26.4.2.3 O gatilho sys\_config\_update\_set\_user

O gatilho `sys_config_update_set_user` para a tabela `sys_config` é semelhante ao gatilho `sys_config_insert_set_user`, mas para as declarações `UPDATE`.

### 26.4.3 Visões do esquema sys

As seções a seguir descrevem as visualizações do esquema `sys`.

O esquema `sys` contém muitas visualizações que resumem as tabelas do Gerador de Desempenho de várias maneiras. A maioria dessas visualizações vem em pares, de modo que um membro do par tem o mesmo nome que o outro membro, além do prefixo `x$`. Por exemplo, a visualização `host_summary_by_file_io` resume o I/O de arquivos agrupado por host e exibe latências convertidas de picosegundos para valores mais legíveis (com unidades);

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

A visualização `x$host_summary_by_file_io` resume os mesmos dados, mas exibe latências de picosegundo não formatadas:

```sql
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

A visão sem o prefixo `x$` é destinada a fornecer uma saída mais amigável ao usuário e mais fácil de ler. A visão com o prefixo `x$` que exibe os mesmos valores em forma bruta é destinada a ser usada com outras ferramentas que realizam seu próprio processamento dos dados.

As visualizações sem o prefixo `x$` diferem das visualizações correspondentes `x$` nesses aspectos:

* Os contagem de bytes são formatados com unidades de tamanho usando a função `format_bytes()`).

* Os valores de tempo são formatados com unidades temporais usando a função `format_time()`).

* As instruções SQL são truncadas até uma largura máxima de exibição usando a função `format_statement()`).

* O nome do caminho é abreviado usando a função `format_path()`).

#### 26.4.3.1 O resumo do host e as visualizações x$host\_summary

Esses pontos resumem a atividade de declaração, a entrada/saída de arquivos e as conexões, agrupados por host.

As visões `host_summary` e `x$host_summary` possuem essas colunas:

* `host`

O host a partir do qual o cliente se conectou. As strings para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `statements`

O número total de declarações para o anfitrião.

* `statement_latency`

O tempo total de espera de declarações cronometradas para o host.

* `statement_avg_latency`

O tempo médio de espera por declaração cronometrada para o anfitrião.

* `table_scans`

O número total de varreduras de tabela para o host.

* `file_ios`

O número total de eventos de E/S de arquivo para o host.

* `file_io_latency`

O tempo total de espera de eventos de E/S de arquivos temporizados para o host.

* `current_connections`

O número atual de conexões para o host.

* `total_connections`

O número total de conexões para o host.

* `unique_users`

O número de usuários distintos para o host.

* `current_memory`

O valor atual da memória alocada para o host.

* `total_memory_allocated`

O valor total de memória alocada para o host.

#### 26.4.3.2 Visões host\_summary\_by\_file\_io e x$host\_summary\_by\_file\_io do host

Esses pontos de vista resumem o I/O de arquivos, agrupados por host. Por padrão, as strings são ordenadas por latência total de I/O de arquivos em ordem decrescente.

As visões `host_summary_by_file_io` e `x$host_summary_by_file_io` possuem essas colunas:

* `host`

O host a partir do qual o cliente se conectou. As strings para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `ios`

O número total de eventos de E/S de arquivo para o host.

* `io_latency`

O tempo total de espera de eventos de E/S de arquivos temporizados para o host.

#### 26.4.3.3 Resumo do host por tipo de arquivo de I/O e x$host\_summary\_by\_file\_io\_type Visões

Esses pontos resumem o I/O de arquivos, agrupados por host e tipo de evento. Por padrão, as strings são ordenadas por host e latência total de I/O em ordem decrescente.

As visões `host_summary_by_file_io_type` e `x$host_summary_by_file_io_type` possuem essas colunas:

* `host`

O host a partir do qual o cliente se conectou. As strings para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `event_name`

O nome do evento de I/O do arquivo.

* `total`

O número total de ocorrências do evento de E/S do arquivo para o host.

* `total_latency`

O tempo total de espera de eventos de tempo para o arquivo de entrada/saída do host.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos de E/S de arquivo para o host.

#### 26.4.3.4 Resumo do host por etapas e x$host\_summary\_by\_stages Visualizações

Esses pontos de vista resumem as etapas da declaração, agrupadas por host. Por padrão, as strings são ordenadas por host e latência total decrescente.

As visões `host_summary_by_stages` e `x$host_summary_by_stages` possuem essas colunas:

* `host`

O host a partir do qual o cliente se conectou. As strings para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `event_name`

O nome do evento em palco.

* `total`

O número total de ocorrências do evento em andamento para o anfitrião.

* `total_latency`

O tempo total de espera de eventos cronometrados do evento em andamento para o anfitrião.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada do evento em andamento para o anfitrião.

#### 26.4.3.5 Resumo do host por latência de declaração e x$host\_summary\_by\_statement\_latency Views

Esses pontos de vista resumem as estatísticas de declaração geral, agrupadas por host. Por padrão, as strings são ordenadas por latência total decrescente.

As visões `host_summary_by_statement_latency` e `x$host_summary_by_statement_latency` possuem essas colunas:

* `host`

O host a partir do qual o cliente se conectou. As strings para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `total`

O número total de declarações para o anfitrião.

* `total_latency`

O tempo total de espera de declarações cronometradas para o host.

* `max_latency`

O tempo máximo de espera individual para declarações temporizadas do host.

* `lock_latency`

O tempo total de espera por bloqueios por declarações temporizadas para o host.

* `rows_sent`

O número total de strings devolvidas por declarações para o host.

* `rows_examined`

O número total de strings lidas dos motores de armazenamento por declarações para o host.

* `rows_affected`

O número total de strings afetadas por declarações para o host.

* `full_scans`

O número total de varreduras completas da tabela por declarações para o host.

#### 26.4.3.6 Resumo do host por tipo de declaração e x$host\_summary\_by\_statement\_type Visitas

Essas visualizações resumem informações sobre declarações executadas, agrupadas por host e tipo de declaração. Por padrão, as strings são ordenadas por host e latência total decrescente.

As visões `host_summary_by_statement_type` e `x$host_summary_by_statement_type` possuem essas colunas:

* `host`

O host a partir do qual o cliente se conectou. As strings para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `statement`

O componente final do nome do evento de declaração.

* `total`

O número total de ocorrências do evento de declaração para o host.

* `total_latency`

O tempo total de espera de eventos temporizados do evento de declaração para o host.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos temporizados do evento de declaração para o host.

* `lock_latency`

O tempo total de espera por bloqueios por ocorrências temporizadas do evento de declaração para o host.

* `rows_sent`

O número total de strings devolvidas por ocorrências do evento de declaração para o host.

* `rows_examined`

O número total de strings lidas dos motores de armazenamento por ocorrências do evento de declaração para o host.

* `rows_affected`

O número total de strings afetadas por ocorrências do evento de declaração para o host.

* `full_scans`

O número total de varreduras completas da tabela por ocorrências do evento de declaração para o host.

#### 26.4.3.7 As vistas innodb\_buffer\_stats\_by\_schema e x$innodb\_buffer\_stats\_by\_schema

Esses pontos resumem as informações na tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`, agrupada por esquema. Por padrão, as strings são ordenadas por tamanho de buffer descendente.

Aviso

Consultar visualizações que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte essas visualizações em um sistema de produção, a menos que você esteja ciente do impacto no desempenho e tenha determinado que é aceitável. Para evitar impactar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffer em uma instância de teste.

As visões `innodb_buffer_stats_by_schema` e `x$innodb_buffer_stats_by_schema` possuem essas colunas:

* `object_schema`

O nome do esquema para o objeto, ou `InnoDB System`, se a tabela pertence ao mecanismo de armazenamento `InnoDB`.

* `allocated`

O número total de bytes alocados para o esquema.

* `data`

O número total de bytes de dados alocados para o esquema.

* `pages`

O número total de páginas alocadas para o esquema.

* `pages_hashed`

O número total de páginas hasheadas alocadas para o esquema.

* `pages_old`

O número total de páginas antigas alocadas para o esquema.

* `rows_cached`

O número total de strings armazenadas em cache para o esquema.

#### 26.4.3.8 As vistas innodb\_buffer\_stats\_by\_table e x$innodb\_buffer\_stats\_by\_table

Esses pontos resumem as informações na tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`, agrupada por esquema e tabela. Por padrão, as strings são ordenadas em ordem decrescente de tamanho do buffer.

Aviso

Consultar visualizações que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte essas visualizações em um sistema de produção, a menos que você esteja ciente do impacto no desempenho e tenha determinado que é aceitável. Para evitar impactar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffer em uma instância de teste.

As visões `innodb_buffer_stats_by_table` e `x$innodb_buffer_stats_by_table` possuem essas colunas:

* `object_schema`

O nome do esquema para o objeto, ou `InnoDB System`, se a tabela pertence ao mecanismo de armazenamento `InnoDB`.

* `object_name`

O nome da tabela.

* `allocated`

O número total de bytes alocados para a tabela.

* `data`

O número de bytes de dados alocados para a tabela.

* `pages`

O número total de páginas alocadas para a tabela.

* `pages_hashed`

O número de páginas hasheadas alocadas para a tabela.

* `pages_old`

O número de páginas antigas alocadas para a tabela.

* `rows_cached`

O número de strings armazenadas em cache para a tabela.

#### 26.4.3.9 As vistas innodb_lock_waits e x$innodb_lock_waits

Esses pontos resumem as `InnoDB` de bloqueio para as quais as transações estão esperando. Por padrão, as strings são ordenadas por idade de bloqueio descendente.

As visões `innodb_lock_waits` e `x$innodb_lock_waits` possuem essas colunas:

* `wait_started`

O momento em que a espera do bloqueio começou.

* `wait_age`

Quanto tempo o bloqueio tem sido esperado, como um valor de `TIME`.

* `wait_age_secs`

Quanto tempo o bloqueio foi esperado, em segundos.

* `locked_table`

O nome da tabela bloqueada. Esta coluna contém valores combinados de nome de esquema/tabela.

* `locked_index`

O nome do índice bloqueado.

* `locked_type`

O tipo do bloqueio de espera.

* `waiting_trx_id`

O ID da transação em espera.

* `waiting_trx_started`

O momento em que a transação de espera começou.

* `waiting_trx_age`

Quanto tempo a transação está esperando, como um valor `TIME`.

* `waiting_trx_rows_locked`

O número de strings bloqueadas pela transação em espera.

* `waiting_trx_rows_modified`

O número de strings modificadas pela transação em espera.

* `waiting_pid`

O ID do processo da transação em espera.

* `waiting_query`

A declaração que está à espera do bloqueio.

* `waiting_lock_id`

O ID do bloqueio em espera.

* `waiting_lock_mode`

O modo do bloqueio de espera.

* `blocking_trx_id`

O ID da transação que está bloqueando o bloqueio de espera.

* `blocking_pid`

O ID do processo da transação que está bloqueando.

* `blocking_query`

A declaração que a transação de bloqueio está executando. Este campo informa NULL se a sessão que emitiu a consulta de bloqueio se torna inativa. Para mais informações, consulte Identificando uma consulta de bloqueio após a sessão de emissão se tornar inativa.

* `blocking_lock_id`

O ID do bloqueio que está bloqueando o bloqueio em espera.

* `blocking_lock_mode`

O modo do bloqueio que está bloqueando o bloqueio em espera.

* `blocking_trx_started`

O momento em que a transação de bloqueio começou.

* `blocking_trx_age`

Quanto tempo a transação de bloqueio está sendo executada, como um valor `TIME`.

* `blocking_trx_rows_locked`

O número de strings bloqueadas pela transação de bloqueio.

* `blocking_trx_rows_modified`

O número de strings modificadas pela transação de bloqueio.

* `sql_kill_blocking_query`

A declaração `KILL` para executar para matar a declaração de bloqueio.

* `sql_kill_blocking_connection`

A declaração `KILL` para executar para matar a sessão que está executando a declaração de bloqueio.

#### 26.4.3.10 As visualizações io\_by\_thread\_by\_latency e x$io\_by\_thread\_by\_latency

Esses pontos resumem os consumidores de E/S para exibir o tempo de espera por E/S, agrupados por thread. Por padrão, as strings são ordenadas em ordem decrescente de latência total de E/S.

As visões `io_by_thread_by_latency` e `x$io_by_thread_by_latency` possuem essas colunas:

* `user`

Para os threads de primeiro plano, a conta associada ao thread. Para os threads de segundo plano, o nome do thread.

* `total`

O número total de eventos de E/S para o thread.

* `total_latency`

O tempo total de espera de eventos de E/S temporizados para o thread.

* `min_latency`

O tempo mínimo de espera individual para eventos de E/S temporizados para o thread.

* `avg_latency`

O tempo de espera médio por evento de E/S temporizado para a thread.

* `max_latency`

O tempo máximo de espera único de eventos de E/S temporizados para o thread.

* `thread_id`

O ID do thread.

* `processlist_id`

Para os threads de primeiro plano, o ID do processo list para o thread. Para os threads de segundo plano, `NULL`.

#### 26.4.3.11 As visualizações io\_global\_by\_file\_by\_bytes e x$io\_global\_by\_file\_by\_bytes

Esses pontos de vista resumem os consumidores globais de E/S para exibir o volume de E/S, agrupado por arquivo. Por padrão, as strings são ordenadas em ordem decrescente de total de E/S (bytes lidos e escritos).

As visões `io_global_by_file_by_bytes` e `x$io_global_by_file_by_bytes` possuem essas colunas:

* `file`

O nome do caminho do arquivo.

* `count_read`

O número total de eventos de leitura para o arquivo.

* `total_read`

O número total de bytes lidos do arquivo.

* `avg_read`

O número médio de bytes por leitura do arquivo.

* `count_write`

O número total de eventos de escrita para o arquivo.

* `total_written`

O número total de bytes escritos no arquivo.

* `avg_write`

O número médio de bytes por escrita no arquivo.

* `total`

O número total de bytes lidos e escritos para o arquivo.

* `write_pct`

A porcentagem dos bytes totais de E/S que foram escritos.

#### 26.4.3.12 As visualizações io\_global\_by\_file\_by\_latency e x$io\_global\_by\_file\_by\_latency

Esses pontos de vista resumem os consumidores globais de E/S para exibir o tempo de espera por E/S, agrupados por arquivo. Por padrão, as strings são ordenadas por latência total decrescente.

As visões `io_global_by_file_by_latency` e `x$io_global_by_file_by_latency` possuem essas colunas:

* `file`

O nome do caminho do arquivo.

* `total`

O número total de eventos de E/S para o arquivo.

* `total_latency`

O tempo total de espera de eventos de E/S temporizados para o arquivo.

* `count_read`

O número total de eventos de leitura de E/S do arquivo.

* `read_latency`

O tempo total de espera de eventos de leitura de E/A temporizados para o arquivo.

* `count_write`

O número total de eventos de escrita de E/S para o arquivo.

* `write_latency`

O tempo total de espera de eventos de escrita de E/A temporizados para o arquivo.

* `count_misc`

O número total de outros eventos de E/S para o arquivo.

* `misc_latency`

O tempo total de espera de outros eventos de E/S temporizados para o arquivo.

#### 26.4.3.13 As vistas io\_global\_by\_wait\_by\_bytes e x$io\_global\_by\_wait\_by\_bytes

Esses pontos resumem os consumidores globais de E/S para exibir o volume de E/S e o tempo de espera para E/S, agrupados por evento. Por padrão, as strings são ordenadas em ordem decrescente de total de E/S (bytes lidos e escritos).

As visões `io_global_by_wait_by_bytes` e `x$io_global_by_wait_by_bytes` possuem essas colunas:

* `event_name`

O nome do evento de I/O, com o prefixo `wait/io/file/` removido.

* `total`

O número total de ocorrências do evento de E/S.

* `total_latency`

O tempo total de espera de eventos de entrada/saída com temporização.

* `min_latency`

O tempo mínimo de espera individual para ocorrência temporizada do evento de E/S.

* `avg_latency`

O tempo médio de espera por ocorrência temporizada do evento de E/S.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos de E/S com temporização.

* `count_read`

O número de solicitações de leitura para o evento de E/S.

* `total_read`

O número de bytes lidos para o evento de E/S.

* `avg_read`

O número médio de bytes por leitura para o evento de E/S.

* `count_write`

O número de solicitações de escrita para o evento de E/S.

* `total_written`

O número de bytes escritos para o evento de E/S.

* `avg_written`

O número médio de bytes por escrita para o evento de E/S.

* `total_requested`

O número total de bytes lidos e escritos para o evento de E/S.

#### 26.4.3.14 As vistas io\_global\_by\_wait\_by\_latency e x$io\_global\_by\_wait\_by\_latency

Esses pontos de vista resumem os consumidores globais de E/S para exibir o volume de E/S e o tempo de espera para E/S, agrupados por evento. Por padrão, as strings são ordenadas por latência total decrescente.

As visões `io_global_by_wait_by_latency` e `x$io_global_by_wait_by_latency` possuem essas colunas:

* `event_name`

O nome do evento de I/O, com o prefixo `wait/io/file/` removido.

* `total`

O número total de ocorrências do evento de E/S.

* `total_latency`

O tempo total de espera de eventos de entrada/saída com temporização.

* `avg_latency`

O tempo médio de espera por ocorrência temporizada do evento de E/S.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos de E/S com temporização.

* `read_latency`

O tempo total de espera de leituras temporizadas de eventos de E/S.

* `write_latency`

O tempo total de espera de ocorrências de escrita temporizadas do evento de E/S.

* `misc_latency`

O tempo total de espera de outras ocorrências do evento de E/S temporizadas.

* `count_read`

O número de solicitações de leitura para o evento de E/S.

* `total_read`

O número de bytes lidos para o evento de E/S.

* `avg_read`

O número médio de bytes por leitura para o evento de E/S.

* `count_write`

O número de solicitações de escrita para o evento de E/S.

* `total_written`

O número de bytes escritos para o evento de E/S.

* `avg_written`

O número médio de bytes por escrita para o evento de E/S.

#### 26.4.3.15 As vistas latest\_file\_io e x$latest\_file\_io mais recentes

Esses pontos de vista resumem a atividade de E/S de arquivos, agrupados por arquivo e thread. Por padrão, as strings são ordenadas com a I/O mais recente primeiro.

As visões `latest_file_io` e `x$latest_file_io` possuem essas colunas:

* `thread`

Para os threads de primeiro plano, a conta associada ao thread (e o número de porta para conexões TCP/IP). Para os threads de segundo plano, o nome do thread e o ID do thread

* `file`

O nome do caminho do arquivo.

* `latency`

O tempo de espera do evento de E/S de arquivo.

* `operation`

O tipo de operação.

* `requested`

O número de bytes de dados solicitados para o evento de E/S do arquivo.

#### 26.4.3.16 Memória por host por bytes atuais e x$Memória por host por bytes atuais Visões

Esses pontos resumem o uso da memória, agrupados por host. Por padrão, as strings são ordenadas por quantidade de memória usada em ordem decrescente.

As visões `memory_by_host_by_current_bytes` e `x$memory_by_host_by_current_bytes` possuem essas colunas:

* `host`

O host a partir do qual o cliente se conectou. As strings para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `current_count_used`

O número atual de blocos de memória alocados que ainda não foram liberados para o host.

* `current_allocated`

O número atual de bytes alocados que ainda não foram liberados para o host.

* `current_avg_alloc`

O número atual de bytes alocados por bloco de memória para o host.

* `current_max_alloc`

A maior alocação de memória de memória corrente em bytes para o host.

* `total_allocated`

A alocação total de memória em bytes para o host.

#### 26.4.3.17 Memória por thread por bytes atuais e x$Memória por thread por bytes atuais Visões

Esses pontos resumem o uso da memória, agrupados por thread. Por padrão, as strings são ordenadas por quantidade de memória usada em ordem decrescente.

As visões `memory_by_thread_by_current_bytes` e `x$memory_by_thread_by_current_bytes` possuem essas colunas:

* `thread_id`

O ID do thread.

* `user`

O usuário do thread ou o nome do thread.

* `current_count_used`

O número atual de blocos de memória alocados que ainda não foram liberados para o thread.

* `current_allocated`

O número atual de bytes alocados que ainda não foram liberados para o thread.

* `current_avg_alloc`

O número atual de bytes alocados por bloco de memória para o thread.

* `current_max_alloc`

A maior alocação de memória de memória corrente em bytes para o thread.

* `total_allocated`

A alocação total de memória em bytes para o thread.

#### 26.4.3.18 Memória\_por\_usuário\_por\_bytes\_curto e x$Memória\_por\_usuário\_por\_bytes\_curto Visitas

Esses pontos resumem o uso da memória, agrupados por usuário. Por padrão, as strings são ordenadas por quantidade de memória usada em ordem decrescente.

As visões `memory_by_user_by_current_bytes` e `x$memory_by_user_by_current_bytes` possuem essas colunas:

* `user`

O nome do usuário do cliente. As strings para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `current_count_used`

O número atual de blocos de memória alocados que ainda não foram liberados para o usuário.

* `current_allocated`

O número atual de bytes alocados que ainda não foram liberados para o usuário.

* `current_avg_alloc`

O número atual de bytes alocados por bloco de memória para o usuário.

* `current_max_alloc`

A maior alocação de memória de memória corrente em bytes para o usuário.

* `total_allocated`

A alocação total de memória em bytes para o usuário.

#### 26.4.3.19 Memória\_global\_by\_current\_bytes e x$memory\_global\_by\_current\_bytes Visualizações

Esses pontos resumem o uso da memória, agrupados por tipo de alocação (ou seja, por evento). Por padrão, as strings são ordenadas por quantidade de memória usada em ordem decrescente.

As visões `memory_global_by_current_bytes` e `x$memory_global_by_current_bytes` possuem essas colunas:

* `event_name`

O nome do evento de memória.

* `current_count`

O número total de ocorrências do evento.

* `current_alloc`

O número atual de bytes alocados que ainda não foram liberados para o evento.

* `current_avg_alloc`

O número atual de bytes alocados por bloco de memória para o evento.

* `high_count`

O limite máximo de blocos de memória alocados para o evento.

* `high_alloc`

O limite máximo de bytes alocados para o evento.

* `high_avg_alloc`

O limite máximo para o número médio de bytes por bloco de memória alocado para o evento.

#### 26.4.3.20 Memória\_global\_total e x$Memória\_global\_total Visualizações

Esses pontos resumem o uso total da memória dentro do servidor.

As visões `memory_global_total` e `x$memory_global_total` possuem essas colunas:

* `total_allocated`

Os bytes totais de memória alocados dentro do servidor.

#### 26.4.3.21 Metricas de visualização

Essa visão resume as métricas do servidor MySQL para mostrar os nomes das variáveis, valores, tipos e se elas estão habilitadas. Por padrão, as strings são ordenadas por tipo e nome de variável.

A visualização `metrics` inclui essas informações:

* Variáveis de status global da tabela do Schema de desempenho `global_status`

* `InnoDB` métricas da tabela `INFORMATION_SCHEMA` `INNODB_METRICS`

* Alocação de memória atual e total, com base na instrumentação de memória do Schema de desempenho

* O horário atual (formatos legíveis para humanos e de marcação de tempo Unix)

Há alguma duplicação de informações entre as tabelas `global_status` e `INNODB_METRICS`, que a visão `metrics` elimina.

A vista `metrics` tem essas colunas:

* `Variable_name`

O nome métrico. O tipo métrico determina a fonte de onde o nome é retirado:

+ Para variáveis de status global: A coluna `VARIABLE_NAME` da tabela `global_status`

+ Para métricas de `InnoDB`: A coluna `NAME` da tabela `INNODB_METRICS`

+ Para outras métricas: uma string descritiva fornecida pela visualização
* `Variable_value`

O valor métrico. O tipo de métrica determina a fonte de onde o valor é retirado:

+ Para variáveis de status global: A coluna `VARIABLE_VALUE` da tabela `global_status`

+ Para métricas de `InnoDB`: A coluna `COUNT` da tabela `INNODB_METRICS`

+ Para métricas de memória: A coluna relevante da tabela do Gerador de desempenho `memory_summary_global_by_event_name`

+ Para o momento atual: O valor de `NOW(3)` ou `UNIX_TIMESTAMP(NOW(3))`

* `Type`

O tipo métrico:

+ Para variáveis de status global: `Global Status`

+ Para as métricas `InnoDB`: `InnoDB Metrics - %`, onde `%` é substituído pelo valor da coluna `SUBSYSTEM` da tabela `INNODB_METRICS`

+ Para métricas de memória: `Performance Schema`

+ Para o momento atual: `System Time`
* `Enabled`

Se a métrica está habilitada:

+ Para variáveis de status global: `YES`  
+ Para métricas de `InnoDB`: `YES` se a coluna `STATUS` da tabela `INNODB_METRICS` for `enabled`, `NO` caso contrário

+ Para métricas de memória: `NO`, `YES` ou `PARTIAL` (atualmente, `PARTIAL` ocorre apenas para métricas de memória e indica que nem todos os instrumentos de memória do `memory/%` estão habilitados; os instrumentos de memória do Schema de Desempenho estão sempre habilitados)

+ Para o momento atual: `YES`

#### 26.4.3.22 A lista de processos e as visualizações x$processlist

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. As visualizações `processlist` e `x$processlist` resumem as informações dos processos. Elas fornecem informações mais completas do que a declaração `SHOW PROCESSLIST` e a tabela `INFORMATION_SCHEMA` `PROCESSLIST`, e também são não-bloqueantes. Por padrão, as strings são ordenadas por tempo de processo descendente e tempo de espera descendente. Para uma comparação das fontes de informações de processo, consulte Fontes de Informações de Processo.

As descrições das colunas aqui são breves. Para informações adicionais, consulte a descrição da tabela do Schema de desempenho `threads` na Seção 25.12.16.4, “A tabela de threads”.

As visões `processlist` e `x$processlist` possuem essas colunas:

* `thd_id`

O ID do thread.

* `conn_id`

O ID de conexão.

* `user`

O usuário do thread ou o nome do thread.

* `db`

O banco de dados padrão para o tópico, ou `NULL` se não houver nenhum.

* `command`

Para os threads de primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa.

* `state`

Uma ação, evento ou estado que indica o que o thread está fazendo.

* `time`

O tempo em segundos que o thread esteve em seu estado atual.

* `current_statement`

A declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração.

* `statement_latency`

Quanto tempo a declaração tem estado em execução.

* `progress`

A porcentagem de trabalho concluído para etapas que suportam relatórios de progresso. Veja a Seção 26.3, “Relatório de progresso do esquema sys”.

* `lock_latency`

O tempo gasto esperando por trancas pelo presente comunicado.

* `rows_examined`

O número de strings lidas dos motores de armazenamento pelo comando atual.

* `rows_sent`

O número de strings devolvidas pelo comando atual.

* `rows_affected`

O número de strings afetadas pela declaração atual.

* `tmp_tables`

O número de tabelas temporárias internas criadas pela declaração atual.

* `tmp_disk_tables`

O número de tabelas temporárias internas criadas pelo comando atual no disco.

* `full_scan`

O número de varreduras completas da tabela realizadas pela declaração atual.

* `last_statement`

A última declaração executada pelo thread, se não houver nenhuma declaração ou espera atualmente em execução.

* `last_statement_latency`

Quanto tempo a última declaração foi executada.

* `current_memory`

O número de bytes alocados pelo thread.

* `last_wait`

O nome do evento de espera mais recente para o thread.

* `last_wait_latency`

O tempo de espera do evento de espera mais recente para o thread.

* `source`

O arquivo de origem e o número de string que contêm o código instrumentado que produziu o evento.

* `trx_latency`

O tempo de espera da transação atual para o thread.

* `trx_state`

O estado para a transação atual para o thread.

* `trx_autocommit`

Se o modo de autocommit foi habilitado quando a transação atual foi iniciada.

* `pid`

O ID do processo do cliente.

* `program_name`

O nome do programa cliente.

#### 26.4.3.23 A vista ps\_check\_lost\_instrumentation

Essa exibição retorna informações sobre instrumentos perdidos do Schema de Desempenho, para indicar se o Schema de Desempenho não consegue monitorar todos os dados de execução.

A vista `ps_check_lost_instrumentation` tem essas colunas:

* `variable_name`

O nome da variável de status do Schema de desempenho que indica que tipo de instrumento foi perdido.

* `variable_value`

O número de instrumentos perdidos.

#### 26.4.3.24 A visão schema\_auto\_increment\_columns

Essa visão indica quais tabelas têm colunas `AUTO_INCREMENT` e fornece informações sobre essas colunas, como os valores atuais e máximos da coluna e a proporção de uso (proporção de valores usados em relação aos possíveis). Por padrão, as strings são ordenadas por proporção de uso decrescente e valor máximo da coluna.

As tabelas nesses esquemas são excluídas da saída de visualização: `mysql`, `sys`, `INFORMATION_SCHEMA`, `performance_schema`.

A vista `schema_auto_increment_columns` tem essas colunas:

* `table_schema`

O esquema que contém a tabela.

* `table_name`

A tabela que contém a coluna `AUTO_INCREMENT`.

* `column_name`

O nome da coluna `AUTO_INCREMENT`.

* `data_type`

O tipo de dados da coluna.

* `column_type`

O tipo de coluna da coluna, que é o tipo de dado mais possivelmente outras informações. Por exemplo, para uma coluna com um tipo de coluna `bigint(20) unsigned`, o tipo de dado é apenas `bigint`.

* `is_signed`

Se o tipo de coluna é assinado.

* `is_unsigned`

Se o tipo da coluna é assinado.

* `max_value`

O valor máximo permitido para a coluna.

* `auto_increment`

O valor atual `AUTO_INCREMENT` para a coluna.

* `auto_increment_ratio`

A proporção de valores utilizados em relação aos permitidos para a coluna. Isso indica quanto da sequência de valores está "esgotado".

#### 26.4.3.25 Os esquemas \_index\_statistics e x$schema\_index\_statistics Views

Esses pontos de vista fornecem estatísticas de índice. Por padrão, as strings são ordenadas por latência total de índice descendente.

As visões `schema_index_statistics` e `x$schema_index_statistics` possuem essas colunas:

* `table_schema`

O esquema que contém a tabela.

* `table_name`

A tabela que contém o índice.

* `index_name`

O nome do índice.

* `rows_selected`

O número total de strings lidas usando o índice.

* `select_latency`

O tempo total de espera de leituras temporizadas usando o índice.

* `rows_inserted`

O número total de strings inseridas no índice.

* `insert_latency`

O tempo total de espera de inserções temporizadas no índice.

* `rows_updated`

O número total de strings atualizadas no índice.

* `update_latency`

O tempo total de espera de atualizações temporizadas no índice.

* `rows_deleted`

O número total de strings excluídas do índice.

* `delete_latency`

O tempo total de espera de apagamentos temporizados do índice.

#### 26.4.3.26 A visão do esquema\_objeto

Essa visão resume os tipos de objetos dentro de cada esquema. Por padrão, as strings são ordenadas por esquema e tipo de objeto.

Nota

Para instâncias do MySQL com um grande número de objetos, essa visão pode levar um longo tempo para ser executada.

A vista `schema_object_overview` tem essas colunas:

* `db`

O nome do esquema.

* `object_type`

O tipo de objeto: `BASE TABLE`, `INDEX (index_type)`, `EVENT`, `FUNCTION`, `PROCEDURE`, `TRIGGER`, `VIEW`.

* `count`

O número de objetos no esquema do tipo dado.

#### 26.4.3.27 Os esquemas redundantes e as vistas x$schema\_flattened\_keys

A visualização `schema_redundant_indexes` exibe índices que duplicam outros índices ou que são tornados redundantes por eles. A visualização `x$schema_flattened_keys` é uma visualização auxiliar para `schema_redundant_indexes`.

Nas descrições das colunas a seguir, o índice dominante é aquele que torna o índice redundante redundante.

A vista `schema_redundant_indexes` tem essas colunas:

* `table_schema`

O esquema que contém a tabela.

* `table_name`

A tabela que contém o índice.

* `redundant_index_name`

O nome do índice redundante.

* `redundant_index_columns`

Os nomes das colunas no índice redundante.

* `redundant_index_non_unique`

O número de colunas não únicas no índice redundante.

* `dominant_index_name`

O nome do índice dominante.

* `dominant_index_columns`

Os nomes das colunas no índice dominante.

* `dominant_index_non_unique`

O número de colunas não únicas no índice dominante.

* `subpart_exists`

Se o índice indexa apenas uma parte de uma coluna.

* `sql_drop_index`

A declaração para executar para descartar o índice redundante.

A vista `x$schema_flattened_keys` tem essas colunas:

* `table_schema`

O esquema que contém a tabela.

* `table_name`

A tabela que contém o índice.

* `index_name`

Um nome de índice.

* `non_unique`

O número de colunas não únicas no índice.

* `subpart_exists`

Se o índice indexa apenas uma parte de uma coluna.

* `index_columns`

O nome das colunas no índice.

#### 26.4.3.28 As tabelas schema\_table\_lock\_waits e x$schema\_table\_lock\_waits Views

Essas visualizações mostram quais sessões estão bloqueadas aguardando bloqueios de metadados e o que as está bloqueando.

As descrições das colunas aqui são breves. Para informações adicionais, consulte a descrição da tabela do Schema de desempenho `metadata_locks` na Seção 25.12.12.1, “A tabela de metadados\_locks”.

As visões `schema_table_lock_waits` e `x$schema_table_lock_waits` possuem essas colunas:

* `object_schema`

O esquema que contém o objeto a ser bloqueado.

* `object_name`

O nome do objeto instrumentado.

* `waiting_thread_id`

O ID do thread do thread que está aguardando o bloqueio.

* `waiting_pid`

O ID do processo da thread que está esperando pelo bloqueio.

* `waiting_account`

A conta associada à sessão que está esperando o bloqueio.

* `waiting_lock_type`

O tipo do bloqueio de espera.

* `waiting_lock_duration`

Quanto tempo o bloqueio de espera tem estado à espera.

* `waiting_query`

A declaração que está à espera do bloqueio.

* `waiting_query_secs`

Quanto tempo a declaração está esperando, em segundos.

* `waiting_query_rows_affected`

O número de strings afetadas pela declaração.

* `waiting_query_rows_examined`

O número de strings lidas dos motores de armazenamento pelo comando.

* `blocking_thread_id`

O ID do thread do thread que está bloqueando o bloqueio de espera.

* `blocking_pid`

O ID do processo da thread que está bloqueando o bloqueio de espera.

* `blocking_account`

A conta associada ao tópico que está bloqueando o bloqueio de espera.

* `blocking_lock_type`

O tipo de bloqueio que está bloqueando o bloqueio de espera.

* `blocking_lock_duration`

Quanto tempo o bloqueio foi mantido.

* `sql_kill_blocking_query`

A declaração `KILL` para executar para matar a declaração de bloqueio.

* `sql_kill_blocking_connection`

A declaração `KILL` para executar para matar a sessão que está executando a declaração de bloqueio.

#### 26.4.3.29 As tabelas de estatísticas schema\_table e as vistas x$schema\_table\_statistics

Esses pontos de vista resumem as estatísticas da tabela. Por padrão, as strings são ordenadas por tempo de espera total descendente (as tabelas com mais contenção primeiro).

Essas visualizações utilizam uma visualização auxiliar, `x$ps_schema_table_statistics_io`.

As visões `schema_table_statistics` e `x$schema_table_statistics` possuem essas colunas:

* `table_schema`

O esquema que contém a tabela.

* `table_name`

O nome da tabela.

* `total_latency`

O tempo total de espera de eventos de E/S temporizados para a tabela.

* `rows_fetched`

O número total de strings lidas da tabela.

* `fetch_latency`

O tempo total de espera de eventos de leitura de E/S com temporizador para a tabela.

* `rows_inserted`

O número total de strings inseridas na tabela.

* `insert_latency`

O tempo total de espera dos eventos de inserção de I/O temporizados para a tabela.

* `rows_updated`

O número total de strings atualizadas na tabela.

* `update_latency`

O tempo total de espera dos eventos de E/S com atualização cronometrada para a tabela.

* `rows_deleted`

O número total de strings excluídas da tabela.

* `delete_latency`

O tempo total de espera dos eventos de E/S de exclusão temporizada para a tabela.

* `io_read_requests`

O número total de solicitações de leitura para a tabela.

* `io_read`

O número total de bytes lidos da tabela.

* `io_read_latency`

O tempo total de espera das leituras da tabela.

* `io_write_requests`

O número total de solicitações de escrita para a tabela.

* `io_write`

O número total de bytes escritos na tabela.

* `io_write_latency`

O tempo total de espera para gravação na tabela.

* `io_misc_requests`

O número total de solicitações de E/S diversas para a tabela.

* `io_misc_latency`

O tempo total de espera de solicitações de E/S variadas para a tabela.

#### 26.4.3.30 As tabelas de estatísticas schema\_table\_statistics\_with\_buffer e as vistas x$schema\_table\_statistics\_with\_buffer

Esses pontos resumem as estatísticas da tabela, incluindo as estatísticas do pool de buffer `InnoDB`. Por padrão, as strings são ordenadas por tempo de espera total decrescente (as tabelas com mais concorrência primeiro).

Essas visualizações utilizam uma visualização auxiliar, `x$ps_schema_table_statistics_io`.

As visões `schema_table_statistics_with_buffer` e `x$schema_table_statistics_with_buffer` possuem essas colunas:

* `table_schema`

O esquema que contém a tabela.

* `table_name`

O nome da tabela.

* `rows_fetched`

O número total de strings lidas da tabela.

* `fetch_latency`

O tempo total de espera de eventos de leitura de E/S com temporizador para a tabela.

* `rows_inserted`

O número total de strings inseridas na tabela.

* `insert_latency`

O tempo total de espera dos eventos de inserção de I/O temporizados para a tabela.

* `rows_updated`

O número total de strings atualizadas na tabela.

* `update_latency`

O tempo total de espera dos eventos de E/S com atualização cronometrada para a tabela.

* `rows_deleted`

O número total de strings excluídas da tabela.

* `delete_latency`

O tempo total de espera dos eventos de E/S de exclusão temporizada para a tabela.

* `io_read_requests`

O número total de solicitações de leitura para a tabela.

* `io_read`

O número total de bytes lidos da tabela.

* `io_read_latency`

O tempo total de espera das leituras da tabela.

* `io_write_requests`

O número total de solicitações de escrita para a tabela.

* `io_write`

O número total de bytes escritos na tabela.

* `io_write_latency`

O tempo total de espera para gravação na tabela.

* `io_misc_requests`

O número total de solicitações de E/S diversas para a tabela.

* `io_misc_latency`

O tempo total de espera de solicitações de E/S variadas para a tabela.

* `innodb_buffer_allocated`

O número total de bytes de buffer `InnoDB` alocados para a tabela.

* `innodb_buffer_data`

O número total de bytes de dados `InnoDB` alocados para a tabela.

* `innodb_buffer_free`

O número total de bytes nondata `InnoDB` alocados para a tabela (`innodb_buffer_allocated` − `innodb_buffer_data`).

* `innodb_buffer_pages`

O número total de páginas `InnoDB` alocadas para a tabela.

* `innodb_buffer_pages_hashed`

O número total de páginas `InnoDB` hasheadas alocadas para a tabela.

* `innodb_buffer_pages_old`

O número total de páginas antigas `InnoDB` alocadas para a tabela.

* `innodb_buffer_rows_cached`

O número total de strings `InnoDB` armazenadas em cache para a tabela.

#### 26.4.3.31 os esquemas\_tables\_with\_full\_table\_scans e as vistas x$schema\_tables\_with\_full\_table\_scans

Essas visualizações mostram quais tabelas estão sendo acessadas com varreduras completas da tabela. Por padrão, as strings são ordenadas por varreduras descendentes.

As visões `schema_tables_with_full_table_scans` e `x$schema_tables_with_full_table_scans` possuem essas colunas:

* `object_schema`

O nome do esquema.

* `object_name`

O nome da tabela.

* `rows_full_scanned`

O número total de strings que são varridas por varreduras completas da tabela.

* `latency`

O tempo total de espera para varreduras completas da tabela.

#### 26.4.3.32 A visão schema\_unused\_indexes

Essas visualizações exibem índices para os quais não há eventos, o que indica que eles não estão sendo usados. Por padrão, as strings são ordenadas por esquema e tabela.

Essa visão é muito útil quando o servidor está ativo e processando por tempo suficiente para que sua carga de trabalho seja representativa. Caso contrário, a presença de um índice nessa visão pode não ser significativa.

A vista `schema_unused_indexes` tem essas colunas:

* `object_schema`

O nome do esquema.

* `object_name`

O nome da tabela.

* `index_name`

O nome do índice não utilizado.

#### 26.4.3.33 A sessão e x$session Views

Essas visualizações são semelhantes a `processlist` e `x$processlist`, mas elas filtram os processos de fundo para exibir apenas as sessões do usuário. Para descrições das colunas, consulte a Seção 26.4.3.22, “As visualizações processlist e x$processlist”.

#### 26.4.3.34 Visualização da sessão ssl_status

Para cada conexão, essa visualização exibe a versão SSL, o cifrador e o número de sessões SSL reutilizadas.

A vista `session_ssl_status` tem essas colunas:

* `thread_id`

O ID do thread para a conexão.

* `ssl_version`

A versão do SSL utilizada para a conexão.

* `ssl_cipher`

O cifrador SSL utilizado para a conexão.

* `ssl_sessions_reused`

O número de sessões SSL reutilizadas para a conexão.

#### 26.4.3.35 A análise de declaração e as visualizações de análise de declaração x$

Essas visualizações listam declarações normalizadas com estatísticas agregadas. O conteúdo imita a visualização Análise de consulta do MySQL Enterprise Monitor. Por padrão, as strings são ordenadas por latência total decrescente.

As visões `statement_analysis` e `x$statement_analysis` possuem essas colunas:

* `query`

A string de declaração normalizada.

* `db`

O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `full_scan`

O número total de varreduras completas da tabela realizadas por ocorrências da declaração.

* `exec_count`

O número total de vezes que a declaração foi executada.

* `err_count`

O número total de erros produzidos por ocorrências da declaração.

* `warn_count`

O número total de avisos produzidos por ocorrências da declaração.

* `total_latency`

O tempo total de espera de eventos temporizados da declaração.

* `max_latency`

O tempo máximo de espera de uma única ocorrência temporizada da declaração.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada da declaração.

* `lock_latency`

O tempo total de espera por bloqueios por ocorrências temporizadas da declaração.

* `rows_sent`

O número total de strings devolvidas por ocorrências da declaração.

* `rows_sent_avg`

O número médio de strings devolvidas por ocorrência da declaração.

* `rows_examined`

O número total de strings lidas dos motores de armazenamento por ocorrências da declaração.

* `rows_examined_avg`

O número médio de strings lidas dos motores de armazenamento por ocorrência da declaração.

* `rows_affected`

O número total de strings afetadas por ocorrências da declaração.

* `rows_affected_avg`

O número médio de strings afetadas por cada ocorrência da declaração.

* `tmp_tables`

O número total de tabelas temporárias internas criadas por meio das ocorrências da declaração.

* `tmp_disk_tables`

O número total de tabelas temporárias internas criadas no disco, geradas por ocorrências da declaração.

* `rows_sorted`

O número total de strings ordenadas por ocorrências da declaração.

* `sort_merge_passes`

O número total de passes de fusão de classificação por ocorrências da declaração.

* `digest`

O extrato do comunicado.

* `first_seen`

O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

O horário em que a declaração foi vista pela última vez.

#### 26.4.3.36 Declarações com erros ou avisos e x$Declarações com erros ou avisos Visualizações

Essas visualizações exibem declarações normalizadas que produziram erros ou avisos. Por padrão, as strings são ordenadas por contagem de erros e avisos em ordem decrescente.

As visões `statements_with_errors_or_warnings` e `x$statements_with_errors_or_warnings` possuem essas colunas:

* `query`

A string de declaração normalizada.

* `db`

O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `exec_count`

O número total de vezes que a declaração foi executada.

* `errors`

O número total de erros produzidos por ocorrências da declaração.

* `error_pct`

A porcentagem de ocorrências de declaração que produziu erros.

* `warnings`

O número total de avisos produzidos por ocorrências da declaração.

* `warning_pct`

A porcentagem de ocorrências de declaração que produziu alertas.

* `first_seen`

O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

O horário em que a declaração foi vista pela última vez.

* `digest`

O extrato do comunicado.

#### 26.4.3.37 Declarações com varreduras completas da tabela e x$Declarações com varreduras completas da tabela Views

Essas visualizações exibem declarações normalizadas que realizaram varreduras completas da tabela. Por padrão, as strings são ordenadas por porcentagem descendente de tempo em que uma varredura completa foi realizada e latência total descendente.

As visões `statements_with_full_table_scans` e `x$statements_with_full_table_scans` possuem essas colunas:

* `query`

A string de declaração normalizada.

* `db`

O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `exec_count`

O número total de vezes que a declaração foi executada.

* `total_latency`

O tempo total de espera de eventos de declaração cronometrados para a declaração.

* `no_index_used_count`

O número total de vezes em que não foi usado um índice para digitalizar a tabela.

* `no_good_index_used_count`

O número total de vezes em que não foi usado um bom índice para digitalizar a tabela.

* `no_index_used_pct`

A porcentagem do tempo em que não foi usado um índice para digitalizar a tabela.

* `rows_sent`

O número total de strings devolvidas da tabela.

* `rows_examined`

O número total de strings lidas do mecanismo de armazenamento para a tabela.

* `rows_sent_avg`

O número médio de strings devolvidas da tabela.

* `rows_examined_avg`

O número médio de strings lidas do mecanismo de armazenamento para a tabela.

* `first_seen`

O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

O horário em que a declaração foi vista pela última vez.

* `digest`

O extrato do comunicado.

#### 26.4.3.38 As declarações com tempos de execução no 95º percentil e x declarações com tempos de execução no 95º percentil de visualizações

Essas visualizações listam declarações com tempos de execução no percentil 95. Por padrão, as strings são ordenadas por latência média descendente.

Ambas as visualizações utilizam duas visualizações auxiliares, `x$ps_digest_avg_latency_distribution` e `x$ps_digest_95th_percentile_by_avg_us`.

As visões `statements_with_runtimes_in_95th_percentile` e `x$statements_with_runtimes_in_95th_percentile` possuem essas colunas:

* `query`

A string de declaração normalizada.

* `db`

O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `full_scan`

O número total de varreduras completas da tabela realizadas por ocorrências da declaração.

* `exec_count`

O número total de vezes que a declaração foi executada.

* `err_count`

O número total de erros produzidos por ocorrências da declaração.

* `warn_count`

O número total de avisos produzidos por ocorrências da declaração.

* `total_latency`

O tempo total de espera de eventos temporizados da declaração.

* `max_latency`

O tempo máximo de espera de uma única ocorrência temporizada da declaração.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada da declaração.

* `rows_sent`

O número total de strings devolvidas por ocorrências da declaração.

* `rows_sent_avg`

O número médio de strings devolvidas por ocorrência da declaração.

* `rows_examined`

O número total de strings lidas dos motores de armazenamento por ocorrências da declaração.

* `rows_examined_avg`

O número médio de strings lidas dos motores de armazenamento por ocorrência da declaração.

* `first_seen`

O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

O horário em que a declaração foi vista pela última vez.

* `digest`

O extrato do comunicado.

#### 26.4.3.39. As declarações com classificação e as visualizações x$declarativas com classificação

Essas visualizações listam declarações normalizadas que realizaram classificações. Por padrão, as strings são classificadas por latência total decrescente.

As visões `statements_with_sorting` e `x$statements_with_sorting` possuem essas colunas:

* `query`

A string de declaração normalizada.

* `db`

O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `exec_count`

O número total de vezes que a declaração foi executada.

* `total_latency`

O tempo total de espera de eventos temporizados da declaração.

* `sort_merge_passes`

O número total de passes de fusão de classificação por ocorrências da declaração.

* `avg_sort_merges`

O número médio de passes de junção de classificação por ocorrência da declaração.

* `sorts_using_scans`

O número total de tipos que utilizam varreduras de tabela por ocorrências da declaração.

* `sort_using_range`

O número total de tipos que utilizam acessos de intervalo por ocorrências da declaração.

* `rows_sorted`

O número total de strings ordenadas por ocorrências da declaração.

* `avg_rows_sorted`

O número médio de strings ordenadas por ocorrência da declaração.

* `first_seen`

O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

O horário em que a declaração foi vista pela última vez.

* `digest`

O extrato do comunicado.

#### 26.4.3.40 As declarações com tabelas temporárias e as vistas x$declarativas\_com\_tabelas\_temporárias

Essas visualizações listam declarações normalizadas que utilizaram tabelas temporárias. Por padrão, as strings são ordenadas por número descendente de tabelas temporárias no disco utilizadas e número descendente de tabelas temporárias em memória utilizadas.

As visões `statements_with_temp_tables` e `x$statements_with_temp_tables` possuem essas colunas:

* `query`

A string de declaração normalizada.

* `db`

O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `exec_count`

O número total de vezes que a declaração foi executada.

* `total_latency`

O tempo total de espera de eventos temporizados da declaração.

* `memory_tmp_tables`

O número total de tabelas temporárias internas criadas por meio das ocorrências da declaração.

* `disk_tmp_tables`

O número total de tabelas temporárias internas criadas no disco, geradas por ocorrências da declaração.

* `avg_tmp_tables_per_query`

O número médio de tabelas temporárias internas criadas por ocorrência da declaração.

* `tmp_tables_to_disk_pct`

A porcentagem de tabelas temporárias internas de memória que foram convertidas em tabelas em disco.

* `first_seen`

O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

O horário em que a declaração foi vista pela última vez.

* `digest`

O extrato do comunicado.

#### 26.4.3.41 Resumo do usuário e x$user\_summary Views

Esses pontos resumem a atividade de declaração, a entrada/saída de arquivos e as conexões, agrupados por usuário. Por padrão, as strings são ordenadas por latência total decrescente.

As visões `user_summary` e `x$user_summary` possuem essas colunas:

* `user`

O nome do usuário do cliente. As strings para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `statements`

O número total de declarações para o usuário.

* `statement_latency`

O tempo total de espera de declarações temporizadas para o usuário.

* `statement_avg_latency`

O tempo médio de espera por declaração cronometrada para o usuário.

* `table_scans`

O número total de varreduras de tabela para o usuário.

* `file_ios`

O número total de eventos de E/S de arquivo para o usuário.

* `file_io_latency`

O tempo total de espera de eventos de E/S de arquivos temporizados para o usuário.

* `current_connections`

O número atual de conexões para o usuário.

* `total_connections`

O número total de conexões para o usuário.

* `unique_hosts`

O número de hosts distintos de onde as conexões do usuário se originaram.

* `current_memory`

O valor atual da memória alocada para o usuário.

* `total_memory_allocated`

O valor total de memória alocada para o usuário.

#### 26.4.3.42 Visões de resumo do usuário por arquivo e x$user\_summary\_by\_file\_io

Esses pontos resumem o I/O de arquivos, agrupados por usuário. Por padrão, as strings são ordenadas em ordem decrescente de latência total de I/O de arquivos.

As visões `user_summary_by_file_io` e `x$user_summary_by_file_io` possuem essas colunas:

* `user`

O nome do usuário do cliente. As strings para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `ios`

O número total de eventos de E/S de arquivo para o usuário.

* `io_latency`

O tempo total de espera de eventos de E/S de arquivos temporizados para o usuário.

#### 26.4.3.43 Resumo do usuário por tipo de arquivo e x$Resumo do usuário por tipo de arquivo Views

Esses pontos resumem o I/O de arquivos, agrupados por usuário e tipo de evento. Por padrão, as strings são ordenadas por usuário e latência total decrescente.

As visões `user_summary_by_file_io_type` e `x$user_summary_by_file_io_type` possuem essas colunas:

* `user`

O nome do usuário do cliente. As strings para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `event_name`

O nome do evento de I/O do arquivo.

* `total`

O número total de ocorrências do evento de E/S do arquivo para o usuário.

* `latency`

O tempo total de espera de eventos de leitura/escrita de arquivo com temporização para o usuário.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos de E/S de arquivo para o usuário.

#### 26.4.3.44 Resumo do usuário por etapas e x$Resumo do usuário por etapas Visualizações

Esses pontos de vista resumem as etapas, agrupadas por usuário. Por padrão, as strings são ordenadas por usuário e latência total de etapa em ordem decrescente.

As visões `user_summary_by_stages` e `x$user_summary_by_stages` possuem essas colunas:

* `user`

O nome do usuário do cliente. As strings para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `event_name`

O nome do evento em palco.

* `total`

O número total de ocorrências do evento de estágio para o usuário.

* `total_latency`

O tempo total de espera de eventos cronometrados do evento em andamento para o usuário.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada do evento em andamento para o usuário.

#### 26.4.3.45 Resumo do usuário por latência de declaração e x$Resumo do usuário por latência de declaração Visualizações

Esses pontos de vista resumem as estatísticas de declaração geral, agrupadas por usuário. Por padrão, as strings são ordenadas por latência total decrescente.

As visões `user_summary_by_statement_latency` e `x$user_summary_by_statement_latency` possuem essas colunas:

* `user`

O nome do usuário do cliente. As strings para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `total`

O número total de declarações para o usuário.

* `total_latency`

O tempo total de espera de declarações temporizadas para o usuário.

* `max_latency`

O tempo máximo de espera de uma única declaração cronometrada para o usuário.

* `lock_latency`

O tempo total de espera por bloqueios por declarações temporizadas para o usuário.

* `rows_sent`

O número total de strings devolvidas por declarações para o usuário.

* `rows_examined`

O número total de strings lidas dos motores de armazenamento por declarações para o usuário.

* `rows_affected`

O número total de strings afetadas por declarações para o usuário.

* `full_scans`

O número total de varreduras completas da tabela por declarações para o usuário.

#### 26.4.3.46 Resumo do usuário por tipo de declaração e x$Resumo do usuário por tipo de declaração Visualizações

Esses pontos resumem informações sobre declarações executadas, agrupadas por usuário e tipo de declaração. Por padrão, as strings são ordenadas por usuário e latência total decrescente.

As visões `user_summary_by_statement_type` e `x$user_summary_by_statement_type` possuem essas colunas:

* `user`

O nome do usuário do cliente. As strings para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de fundo e são relatadas com um nome de host de `background`.

* `statement`

O componente final do nome do evento de declaração.

* `total`

O número total de ocorrências do evento de declaração para o usuário.

* `total_latency`

O tempo total de espera de eventos temporizados do evento de declaração para o usuário.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos temporizados do evento de declaração para o usuário.

* `lock_latency`

O tempo total de espera por bloqueios por ocorrências temporizadas do evento de declaração para o usuário.

* `rows_sent`

O número total de strings devolvidas por ocorrências do evento de declaração para o usuário.

* `rows_examined`

O número total de strings lidas dos motores de armazenamento por ocorrências do evento de declaração para o usuário.

* `rows_affected`

O número total de strings afetadas por ocorrências do evento de declaração para o usuário.

* `full_scans`

O número total de varreduras completas da tabela por ocorrências do evento de declaração para o usuário.

#### 26.4.3.47 A versão Visualizar

Essa visão fornece o esquema atual do `sys` e as versões do servidor MySQL.

Nota

A partir do MySQL 5.7.28, essa visão é desatualizada e está sujeita à remoção em uma versão futura do MySQL. Aplicações que a utilizam devem ser migradas para usar uma alternativa. Por exemplo, use a função `VERSION()` para recuperar a versão do servidor MySQL.

A vista `version` tem essas colunas:

* `sys_version`

A versão do esquema `sys`.

* `mysql_version`

A versão do servidor MySQL.

#### 26.4.3.48 As classes de espera global por latência média e as vistas x$wait\_classes\_global\_by\_avg\_latency

Esses pontos mostram as médias de latência do tipo de espera, agrupadas por classe de evento. Por padrão, as strings são ordenadas em ordem decrescente de latência média. Eventos ociosos são ignorados.

Uma classe de evento é determinada ao remover do nome do evento tudo o que vem após os três primeiros componentes. Por exemplo, a classe para `wait/io/file/sql/slow_log` é `wait/io/file`.

As visões `wait_classes_global_by_avg_latency` e `x$wait_classes_global_by_avg_latency` possuem essas colunas:

* `event_class`

A classe de evento.

* `total`

O número total de ocorrências de eventos na classe.

* `total_latency`

O tempo total de espera de eventos com prazos na classe.

* `min_latency`

O tempo mínimo de espera individual para eventos com tempo determinado na classe.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada de eventos na aula.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos na classe.

#### 26.4.3.49 As vistas wait\_classes\_global\_by\_latency e x$wait\_classes\_global\_by\_latency

Esses pontos resumem as latências totais da classe de espera, agrupadas por classe de evento. Por padrão, as strings são ordenadas em ordem decrescente de latência total. Eventos ociosos são ignorados.

Uma classe de evento é determinada ao remover do nome do evento tudo o que vem após os três primeiros componentes. Por exemplo, a classe para `wait/io/file/sql/slow_log` é `wait/io/file`.

As visões `wait_classes_global_by_latency` e `x$wait_classes_global_by_latency` possuem essas colunas:

* `event_class`

A classe de evento.

* `total`

O número total de ocorrências de eventos na classe.

* `total_latency`

O tempo total de espera de eventos com prazos na classe.

* `min_latency`

O tempo mínimo de espera individual para eventos com tempo determinado na classe.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada de eventos na aula.

* `max_latency`

O tempo máximo de espera de uma única ocorrência de eventos na classe.

#### 26.4.3.50 As visualizações waits\_by\_host\_by\_latency e x$waits\_by\_host\_by\_latency

Esses pontos de vista resumem eventos de espera, agrupados por host e evento. Por padrão, as strings são ordenadas por host e latência total decrescente. Eventos ociosos são ignorados.

As visões `waits_by_host_by_latency` e `x$waits_by_host_by_latency` possuem essas colunas:

* `host`

O host de onde a conexão se originou.

* `event`

O nome do evento.

* `total`

O número total de ocorrências do evento para o anfitrião.

* `total_latency`

O tempo total de espera de eventos temporizados do evento para o anfitrião.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada do evento para o anfitrião.

* `max_latency`

O tempo máximo de espera de uma única ocorrência cronometrada do evento para o anfitrião.

#### 26.4.3.51 As visualizações waits\_by\_user\_by\_latency e x$waits\_by\_user\_by\_latency

Esses pontos de vista resumem eventos de espera, agrupados por usuário e evento. Por padrão, as strings são ordenadas por usuário e latência total decrescente. Eventos ociosos são ignorados.

As visões `waits_by_user_by_latency` e `x$waits_by_user_by_latency` possuem essas colunas:

* `user`

O usuário associado à conexão.

* `event`

O nome do evento.

* `total`

O número total de ocorrências do evento para o usuário.

* `total_latency`

O tempo total de espera de eventos temporizados do evento para o usuário.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada do evento para o usuário.

* `max_latency`

O tempo máximo de espera de uma única ocorrência cronometrada do evento para o usuário.

#### 26.4.3.52 As visualizações waits\_global\_by\_latency e x$waits\_global\_by\_latency

Esses pontos de vista resumem eventos de espera, agrupados por evento. Por padrão, as strings são ordenadas por latência total descendente. Eventos ociosos são ignorados.

As visões `waits_global_by_latency` e `x$waits_global_by_latency` possuem essas colunas:

* `events`

O nome do evento.

* `total`

O número total de ocorrências do evento.

* `total_latency`

O tempo total de espera de eventos temporizados do evento.

* `avg_latency`

O tempo médio de espera por ocorrência cronometrada do evento.

* `max_latency`

O tempo máximo de espera de uma única ocorrência temporizada do evento.

### 26.4.4 Procedimentos armazenados do esquema sys

As seções a seguir descrevem os procedimentos de esquema `sys`.

#### 26.4.4.1 O procedimento create\_synonym\_db()

Dado um nome de esquema, este procedimento cria um esquema sinônimo contendo visualizações que fazem referência a todas as tabelas e visualizações do esquema original. Isso pode ser usado, por exemplo, para criar um nome mais curto pelo qual se pode referir a um esquema com um nome longo (como `info` em vez de `INFORMATION_SCHEMA`).

##### Parâmetros

* `in_db_name VARCHAR(64)`: O nome do esquema para o qual se deseja criar o sinônimo.

* `in_synonym VARCHAR(64)`: O nome a ser usado para o esquema de sinônimos. Esse esquema não deve já existir.

##### Exemplo

```sql
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| world              |
+--------------------+
mysql> CALL sys.create_synonym_db('INFORMATION_SCHEMA', 'info');
+---------------------------------------+
| summary                               |
+---------------------------------------+
| Created 63 views in the info database |
+---------------------------------------+
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| info               |
| mysql              |
| performance_schema |
| sys                |
| world              |
+--------------------+
mysql> SHOW FULL TABLES FROM info;
+---------------------------------------+------------+
| Tables_in_info                        | Table_type |
+---------------------------------------+------------+
| character_sets                        | VIEW       |
| collation_character_set_applicability | VIEW       |
| collations                            | VIEW       |
| column_privileges                     | VIEW       |
| columns                               | VIEW       |
...
```

#### 26.4.4.2 O procedimento diagnostics()

Cria um relatório do status atual do servidor para fins de diagnóstico.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável do sistema `sql_log_bin`. Esse é um procedimento restrito, portanto, requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

Os dados coletados para o procedimento `diagnostics()` incluem essas informações:

* Informações da visão `metrics` (consulte a Seção 26.4.3.21, “A visão de métricas”)

* Informações de outras visões relevantes do esquema `sys`, como a que determina consultas no percentil 95

* Informações do esquema `ndbinfo`, se o servidor MySQL faz parte do NDB Cluster

* Status de replicação (tanto da fonte quanto da replica)

Alguns dos pontos de vista do esquema sys são calculados como valores iniciais (opcionais), gerais e delta:

* A visão inicial é o conteúdo da visão no início do procedimento `diagnostics()`") procedimento. Essa saída é a mesma que os valores iniciais usados para a visão delta. A visão inicial é incluída se a opção de configuração `diagnostics.include_raw` for `ON`.

* A visão geral é o conteúdo da visão no final do procedimento `diagnostics()`") procedimento. Essa saída é a mesma dos valores finais utilizados para a visão delta. A visão geral é sempre incluída.

* A visão do delta é a diferença entre o início e o fim da execução do procedimento. Os valores mínimo e máximo são os valores mínimo e máximo da visão final, respectivamente. Eles não refletem necessariamente os valores mínimo e máximo no período monitorado. Exceto para a visão `metrics`, o delta é calculado apenas entre as primeiras e as últimas saídas.

##### Parâmetros

* `in_max_runtime INT UNSIGNED`: O tempo máximo de coleta de dados em segundos. Use `NULL` para coletar dados para o vencimento de 60 segundos. Caso contrário, use um valor maior que 0.

* `in_interval INT UNSIGNED`: O tempo de sono entre as coletas de dados em segundos. Use `NULL` para dormir o tempo padrão de 30 segundos. Caso contrário, use um valor maior que 0.

* `in_auto_config ENUM('current', 'medium', 'full')`: A configuração do Schema de Desempenho a ser usada. Os valores permitidos são:

+ `current`: Use o instrumento e as configurações atuais do consumidor.

+ `medium`: Ative alguns instrumentos e consumidores.

+ `full`: Ative todos os instrumentos e consumidores.

Nota

Quanto mais instrumentos e consumidores habilitados, maior o impacto no desempenho do servidor MySQL. Tenha cuidado com o ajuste `medium` e, especialmente, o ajuste `full`, que tem um grande impacto no desempenho.

O uso do ajuste `medium` ou `full` requer o privilégio `SUPER`.

Se uma configuração diferente de `current` for escolhida, as configurações atuais serão restauradas no final do procedimento.

Opções de configuração

`diagnostics()` O procedimento de operação pode ser modificado usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, "A Tabela sys_config"):

* `debug`, `@sys.debug`

Se esta opção for `ON`, produza saída de depuração. O padrão é `OFF`.

* `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

Se esta opção for `ON`, o procedimento `diagnostics()` é permitido para realizar varreduras de tabela na tabela do esquema de informações `TABLES`. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

* `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

Se esta opção for `ON`, a saída do procedimento `diagnostics()`") inclui a saída bruta da consulta à visão `metrics`. O padrão é `OFF`.

* `statement_truncate_len`, `@sys.statement_truncate_len`

O comprimento máximo das declarações retornadas pela função `format_statement()`") é esse comprimento. As declarações mais longas são truncadas para esse comprimento. O padrão é 64.

##### Exemplo

Crie um relatório de diagnóstico que inicie uma iteração a cada 30 segundos e execute por no máximo 120 segundos, usando as configurações atuais do Schema de desempenho:

```sql
mysql> CALL sys.diagnostics(120, 30, 'current');
```

Para capturar a saída do procedimento `diagnostics()` em um arquivo enquanto ele está sendo executado, use os comandos do cliente **mysql** `tee filename` e `notee` (consulte a Seção 4.5.1.2, “Comandos do Cliente mysql”):

```sql
mysql> tee diag.out;
mysql> CALL sys.diagnostics(120, 30, 'current');
mysql> notee;
```

#### 26.4.4.3 O procedimento execute\_prepared\_stmt()

Dado uma declaração SQL como uma string, executa-a como uma declaração preparada. A declaração preparada é realocada após a execução, portanto, não é suscetível de ser reutilizada. Assim, este procedimento é útil principalmente para executar declarações dinâmicas de forma única.

Este procedimento usa `sys_execute_prepared_stmt` como o nome da declaração preparada. Se esse nome de declaração existir quando o procedimento for chamado, seu conteúdo anterior é destruído.

##### Parâmetros

* `in_query LONGTEXT CHARACTER SET utf8`: A string de declaração a ser executada.

Opções de configuração

`execute_prepared_stmt()` O procedimento de operação pode ser modificado usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, "A Tabela sys_config"):

* `debug`, `@sys.debug`

Se esta opção for `ON`, produza saída de depuração. O padrão é `OFF`.

##### Exemplo

```sql
mysql> CALL sys.execute_prepared_stmt('SELECT COUNT(*) FROM mysql.user');
+----------+
| COUNT(*) |
+----------+
|       15 |
+----------+
```

#### 26.4.4.4 O procedimento ps\_setup\_disable\_background\_threads()

Desabilita a instrumentação do Schema de desempenho para todos os threads de plano de fundo. Produz um conjunto de resultados que indica quantos threads de plano de fundo foram desativados. Os threads já desativados não são contados.

##### Parâmetros

None.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_disable_background_threads();
+--------------------------------+
| summary                        |
+--------------------------------+
| Disabled 24 background threads |
+--------------------------------+
```

#### 26.4.4.5 O procedimento ps\_setup\_disable\_consumer()

Desabilita os consumidores do Schema de desempenho com nomes que contêm o argumento. Produz um conjunto de resultados que indica quantos consumidores foram desativados. Os consumidores já desativados não são contados.

##### Parâmetros

* `consumer VARCHAR(128)`: O valor utilizado para corresponder aos nomes dos consumidores, que são identificados usando `%consumer%` como um operando para uma correspondência de padrão `LIKE`.

Um valor de `''` corresponde a todos os consumidores.

##### Exemplo

Desative todos os consumidores de declaração:

```sql
mysql> CALL sys.ps_setup_disable_consumer('statement');
+----------------------+
| summary              |
+----------------------+
| Disabled 4 consumers |
+----------------------+
```

#### 26.4.4.6 O procedimento ps\_setup\_disable\_instrument()

Desabilita instrumentos do Schema de desempenho com nomes que contenham o argumento. Produz um conjunto de resultados que indica quantos instrumentos foram desativados. Os instrumentos já desativados não são contados.

##### Parâmetros

* `in_pattern VARCHAR(128)`: O valor utilizado para corresponder aos nomes dos instrumentos, que são identificados usando `%in_pattern%` como um operando para uma correspondência de padrão `LIKE`.

Um valor de `''` corresponde a todos os instrumentos.

##### Exemplo

Desativar um instrumento específico:

```sql
mysql> CALL sys.ps_setup_disable_instrument('wait/lock/metadata/sql/mdl');
+-----------------------+
| summary               |
+-----------------------+
| Disabled 1 instrument |
+-----------------------+
```

Desative todos os instrumentos de mutex:

```sql
mysql> CALL sys.ps_setup_disable_instrument('mutex');
+--------------------------+
| summary                  |
+--------------------------+
| Disabled 177 instruments |
+--------------------------+
```

#### 26.4.4.7 O procedimento ps\_setup\_disable\_thread()

Dada uma identificação de conexão, desativa a instrumentação do Schema de desempenho para o thread. Produz um conjunto de resultados que indica quantos threads foram desativados. Threads já desativados não são contados.

##### Parâmetros

* `in_connection_id BIGINT`: O ID de conexão. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela do Gerador de Desempenho `threads` ou na coluna `Id` da saída `SHOW PROCESSLIST`.

##### Exemplo

Desabilitar uma conexão específica pelo seu ID de conexão:

```sql
mysql> CALL sys.ps_setup_disable_thread(225);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```

Desative a conexão atual:

```sql
mysql> CALL sys.ps_setup_disable_thread(CONNECTION_ID());
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```

#### 26.4.4.8 O procedimento ps\_setup\_enable\_background\_threads()

Habilita a instrumentação do Schema de desempenho para todos os threads de segundo plano. Produz um conjunto de resultados que indica quantos threads de segundo plano foram habilitados. Os threads já habilitados não são contados.

##### Parâmetros

None.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_enable_background_threads();
+-------------------------------+
| summary                       |
+-------------------------------+
| Enabled 24 background threads |
+-------------------------------+
```

#### 26.4.4.9 O procedimento ps\_setup\_enable\_consumer()

Permite que os consumidores do Schema de desempenho com nomes que contenham o argumento. Produz um conjunto de resultados que indica quantos consumidores foram habilitados. Os consumidores já habilitados não são contados.

##### Parâmetros

* `consumer VARCHAR(128)`: O valor utilizado para corresponder aos nomes dos consumidores, que são identificados usando `%consumer%` como um operando para uma correspondência de padrão `LIKE`.

Um valor de `''` corresponde a todos os consumidores.

##### Exemplo

Ative todos os consumidores de declaração:

```sql
mysql> CALL sys.ps_setup_enable_consumer('statement');
+---------------------+
| summary             |
+---------------------+
| Enabled 4 consumers |
+---------------------+
```

#### 26.4.4.10 O procedimento ps\_setup\_enable\_instrument()

Habilita instrumentos do Schema de desempenho com nomes que contenham o argumento. Produz um conjunto de resultados que indica quantos instrumentos foram habilitados. Os instrumentos já habilitados não são contados.

##### Parâmetros

* `in_pattern VARCHAR(128)`: O valor utilizado para corresponder aos nomes dos instrumentos, que são identificados usando `%in_pattern%` como um operando para uma correspondência de padrão `LIKE`.

Um valor de `''` corresponde a todos os instrumentos.

##### Exemplo

Ative um instrumento específico:

```sql
mysql> CALL sys.ps_setup_enable_instrument('wait/lock/metadata/sql/mdl');
+----------------------+
| summary              |
+----------------------+
| Enabled 1 instrument |
+----------------------+
```

Ative todos os instrumentos de mutex:

```sql
mysql> CALL sys.ps_setup_enable_instrument('mutex');
+-------------------------+
| summary                 |
+-------------------------+
| Enabled 177 instruments |
+-------------------------+
```

#### 26.4.4.11 O procedimento ps\_setup\_enable\_thread()

Dado um ID de conexão, habilita a instrumentação do Schema de desempenho para o thread. Produz um conjunto de resultados que indica quantos threads foram habilitados. Os threads já habilitados não são contados.

##### Parâmetros

* `in_connection_id BIGINT`: O ID de conexão. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela do Gerador de Desempenho `threads` ou na coluna `Id` do `SHOW PROCESSLIST` de saída.

##### Exemplo

Ative uma conexão específica pelo seu ID de conexão:

```sql
mysql> CALL sys.ps_setup_enable_thread(225);
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```

Ative a conexão atual:

```sql
mysql> CALL sys.ps_setup_enable_thread(CONNECTION_ID());
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```

#### 26.4.4.12 O procedimento ps\_setup\_reload\_saved()

Recarregar uma configuração do esquema de desempenho salva anteriormente na mesma sessão usando o `ps_setup_save()` (Procedimento]"). Para mais informações, consulte a descrição do `ps_setup_save()` (Procedimento").

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável do sistema `sql_log_bin`. Esse é um procedimento restrito, portanto, requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

##### Parâmetros

None.

#### 26.4.4.13 O procedimento ps\_setup\_reset\_to\_default()

Redefine a configuração do esquema de desempenho para as configurações padrão.

##### Parâmetros

* `in_verbose BOOLEAN`: Se deve exibir informações sobre cada etapa de configuração durante a execução do procedimento. Isso inclui as instruções SQL executadas.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_reset_to_default(TRUE)\G
*************************** 1. row ***************************
status: Resetting: setup_actors
DELETE
FROM performance_schema.setup_actors
WHERE NOT (HOST = '%' AND USER = '%' AND ROLE = '%')

*************************** 1. row ***************************
status: Resetting: setup_actors
INSERT IGNORE INTO performance_schema.setup_actors
VALUES ('%', '%', '%')

...
```

#### 26.4.4.14 O procedimento ps\_setup\_save()

Salva a configuração atual do Schema de Desempenho. Isso permite que você altere a configuração temporariamente para depuração ou outros fins, e depois a restaure ao estado anterior, invocando o procedimento `ps_setup_reload_saved()`".

Para evitar outras chamadas simultâneas para salvar a configuração, o `ps_setup_save()` "Procedimento"] adquire um bloqueio de aconselhamento denominado `sys.ps_setup_save` ao chamar a função `GET_LOCK()`. O `ps_setup_save()` "Procedimento"] assume um parâmetro de tempo de espera para indicar quantos segundos esperar se o bloqueio já existir (o que indica que alguma outra sessão tem uma configuração salva pendente). Se o tempo de espera expirar sem obter o bloqueio, o `ps_setup_save()` "Procedimento"] falha.

É pretendido que você chame `ps_setup_reload_saved()` Procedimento") mais tarde na *mesma* sessão como `ps_setup_save()` Procedimento") porque a configuração é salva nas tabelas de `TEMPORARY`. O `ps_setup_save()` Procedimento") elimina as tabelas temporárias e libera o bloqueio. Se você encerrar sua sessão sem invocar `ps_setup_save()` Procedimento"), as tabelas e o bloqueio desaparecerão automaticamente.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável do sistema `sql_log_bin`. Esse é um procedimento restrito, portanto, requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

##### Parâmetros

* `in_timeout INT`: Quantos segundos esperar para obter o bloqueio `sys.ps_setup_save`. Um valor de tempo de espera negativo significa tempo de espera infinito.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_save(10);

... make Performance Schema configuration changes ...

mysql> CALL sys.ps_setup_reload_saved();
```

#### 26.4.4.15 O procedimento ps\_setup\_show\_disabled()

Exibe todas as configurações de esquema de desempenho atualmente desativadas.

##### Parâmetros

* `in_show_instruments BOOLEAN`: Se deve exibir instrumentos desativados. Isso pode ser uma longa lista.

* `in_show_threads BOOLEAN`: Se deve exibir temas desabilitados.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_disabled(TRUE, TRUE);
+----------------------------+
| performance_schema_enabled |
+----------------------------+
|                          1 |
+----------------------------+

+---------------+
| enabled_users |
+---------------+
| '%'@'%'       |
+---------------+

+-------------+----------------------+---------+-------+
| object_type | objects              | enabled | timed |
+-------------+----------------------+---------+-------+
| EVENT       | mysql.%              | NO      | NO    |
| EVENT       | performance_schema.% | NO      | NO    |
| EVENT       | information_schema.% | NO      | NO    |
| FUNCTION    | mysql.%              | NO      | NO    |
| FUNCTION    | performance_schema.% | NO      | NO    |
| FUNCTION    | information_schema.% | NO      | NO    |
| PROCEDURE   | mysql.%              | NO      | NO    |
| PROCEDURE   | performance_schema.% | NO      | NO    |
| PROCEDURE   | information_schema.% | NO      | NO    |
| TABLE       | mysql.%              | NO      | NO    |
| TABLE       | performance_schema.% | NO      | NO    |
| TABLE       | information_schema.% | NO      | NO    |
| TRIGGER     | mysql.%              | NO      | NO    |
| TRIGGER     | performance_schema.% | NO      | NO    |
| TRIGGER     | information_schema.% | NO      | NO    |
+-------------+----------------------+---------+-------+

...
```

#### 26.4.4.16 O procedimento ps\_setup\_show\_disabled\_consumers()

Exibe todos os consumidores do Schema de Desempenho atualmente desabilitados.

##### Parâmetros

None.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_disabled_consumers();
+----------------------------------+
| disabled_consumers               |
+----------------------------------+
| events_stages_current            |
| events_stages_history            |
| events_stages_history_long       |
| events_statements_history        |
| events_statements_history_long   |
| events_transactions_history      |
| events_transactions_history_long |
| events_waits_current             |
| events_waits_history             |
| events_waits_history_long        |
+----------------------------------+
```

#### 26.4.4.17 O procedimento ps\_setup\_show\_disabled\_instruments()

Exibe todos os instrumentos do Schema de desempenho atualmente desabilitados. Isso pode ser uma longa lista.

##### Parâmetros

None.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_disabled_instruments()\G
*************************** 1. row ***************************
disabled_instruments: wait/synch/mutex/sql/TC_LOG_MMAP::LOCK_tc
               timed: NO
*************************** 2. row ***************************
disabled_instruments: wait/synch/mutex/sql/THD::LOCK_query_plan
               timed: NO
*************************** 3. row ***************************
disabled_instruments: wait/synch/mutex/sql/MYSQL_BIN_LOG::LOCK_commit
               timed: NO
...
```

#### 26.4.4.18 O procedimento ps\_setup\_show\_enabled()

Exibe todas as configurações da Schema de desempenho atualmente habilitadas.

##### Parâmetros

* `in_show_instruments BOOLEAN`: Se deve exibir instrumentos habilitados. Isso pode ser uma longa lista.

* `in_show_threads BOOLEAN`: Se deve exibir os tópicos habilitados.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_enabled(FALSE, FALSE);
+----------------------------+
| performance_schema_enabled |
+----------------------------+
|                          1 |
+----------------------------+
1 row in set (0.00 sec)

+---------------+
| enabled_users |
+---------------+
| '%'@'%'       |
+---------------+
1 row in set (0.00 sec)

+-------------+---------+---------+-------+
| object_type | objects | enabled | timed |
+-------------+---------+---------+-------+
| EVENT       | %.%     | YES     | YES   |
| FUNCTION    | %.%     | YES     | YES   |
| PROCEDURE   | %.%     | YES     | YES   |
| TABLE       | %.%     | YES     | YES   |
| TRIGGER     | %.%     | YES     | YES   |
+-------------+---------+---------+-------+
5 rows in set (0.00 sec)

+---------------------------+
| enabled_consumers         |
+---------------------------+
| events_statements_current |
| events_statements_history |
| global_instrumentation    |
| statements_digest         |
| thread_instrumentation    |
+---------------------------+
```

#### 26.4.4.19 O procedimento ps\_setup\_show\_enabled\_consumers()

Exibe todos os consumidores do Schema de Desempenho atualmente habilitados.

##### Parâmetros

None.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_enabled_consumers();
+---------------------------+
| enabled_consumers         |
+---------------------------+
| events_statements_current |
| events_statements_history |
| global_instrumentation    |
| statements_digest         |
| thread_instrumentation    |
+---------------------------+
```

#### 26.4.4.20 O procedimento ps\_setup\_show\_enabled\_instruments()

Exibe todos os instrumentos do Schema de desempenho atualmente habilitados. Isso pode ser uma longa lista.

##### Parâmetros

None.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_enabled_instruments()\G
*************************** 1. row ***************************
enabled_instruments: wait/io/file/sql/map
              timed: YES
*************************** 2. row ***************************
enabled_instruments: wait/io/file/sql/binlog
              timed: YES
*************************** 3. row ***************************
enabled_instruments: wait/io/file/sql/binlog_cache
              timed: YES
...
```

#### 26.4.4.21 O procedimento ps\_statement\_avg\_latency\_histogram()

Exibe um gráfico de histograma textual dos valores médios de latência em todas as declarações normalizadas rastreadas na tabela do Schema de desempenho `events_statements_summary_by_digest`.

Esse procedimento pode ser usado para exibir uma imagem de alto nível da distribuição de latência das declarações que estão em execução nessa instância do MySQL.

##### Parâmetros

None.

##### Exemplo

A saída do histograma em unidades de declaração. Por exemplo, `* = 2 units` na legenda do histograma significa que cada caractere `*` representa 2 declarações.

```sql
mysql> CALL sys.ps_statement_avg_latency_histogram()\G
*************************** 1. row ***************************
Performance Schema Statement Digest Average Latency Histogram:

  . = 1 unit
  * = 2 units
  # = 3 units

(0 - 66ms)     88  | #############################
(66 - 133ms)   14  | ..............
(133 - 199ms)  4   | ....
(199 - 265ms)  5   | **
(265 - 332ms)  1   | .
(332 - 398ms)  0   |
(398 - 464ms)  1   | .
(464 - 531ms)  0   |
(531 - 597ms)  0   |
(597 - 663ms)  0   |
(663 - 730ms)  0   |
(730 - 796ms)  0   |
(796 - 863ms)  0   |
(863 - 929ms)  0   |
(929 - 995ms)  0   |
(995 - 1062ms) 0   |

  Total Statements: 114; Buckets: 16; Bucket Size: 66 ms;
```

#### 26.4.4.22 O procedimento ps\_trace\_statement\_digest()

Registra todas as ferramentas de instrumentação do Schema de Desempenho para um digest específico de declaração.

Se você encontrar uma declaração de interesse na tabela do Schema de Desempenho `events_statements_summary_by_digest`, especifique o valor da coluna MD5 `DIGEST` desta procedure e indique a duração e o intervalo de verificação. O resultado é um relatório de todas as estatísticas rastreadas no Schema de Desempenho para esse digest no intervalo.

O procedimento também tenta executar `EXPLAIN` para o exemplo de digestão com maior duração durante o intervalo. Essa tentativa pode falhar porque o Schema de Desempenho truncata valores longos de `SQL_TEXT`. Consequentemente, `EXPLAIN` falha devido a erros de análise.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável do sistema `sql_log_bin`. Esse é um procedimento restrito, portanto, requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

##### Parâmetros

* `in_digest VARCHAR(32)`: O identificador do resumo de declaração para análise.

* `in_runtime INT`: Quanto tempo executar a análise em segundos.

* `in_interval DECIMAL(2,2)`: O intervalo de análise em segundos (que pode ser fracionário) em que se tenta capturar instantâneos.

* `in_start_fresh BOOLEAN`: Se deve truncar as tabelas do Schema de Desempenho `events_statements_history_long` e `events_stages_history_long` antes de começar.

* `in_auto_enable BOOLEAN`: Se os consumidores obrigatórios devem ser habilitados automaticamente.

##### Exemplo

```sql
mysql> CALL sys.ps_trace_statement_digest('891ec6860f98ba46d89dd20b0c03652c', 10, 0.1, TRUE, TRUE);
+--------------------+
| SUMMARY STATISTICS |
+--------------------+
| SUMMARY STATISTICS |
+--------------------+
1 row in set (9.11 sec)

+------------+-----------+-----------+-----------+---------------+------------+------------+
| executions | exec_time | lock_time | rows_sent | rows_examined | tmp_tables | full_scans |
+------------+-----------+-----------+-----------+---------------+------------+------------+
|         21 | 4.11 ms   | 2.00 ms   |         0 |            21 |          0 |          0 |
+------------+-----------+-----------+-----------+---------------+------------+------------+
1 row in set (9.11 sec)

+------------------------------------------+-------+-----------+
| event_name                               | count | latency   |
+------------------------------------------+-------+-----------+
| stage/sql/checking query cache for query |    16 | 724.37 us |
| stage/sql/statistics                     |    16 | 546.92 us |
| stage/sql/freeing items                  |    18 | 520.11 us |
| stage/sql/init                           |    51 | 466.80 us |
...
| stage/sql/cleaning up                    |    18 | 11.92 us  |
| stage/sql/executing                      |    16 | 6.95 us   |
+------------------------------------------+-------+-----------+
17 rows in set (9.12 sec)

+---------------------------+
| LONGEST RUNNING STATEMENT |
+---------------------------+
| LONGEST RUNNING STATEMENT |
+---------------------------+
1 row in set (9.16 sec)

+-----------+-----------+-----------+-----------+---------------+------------+-----------+
| thread_id | exec_time | lock_time | rows_sent | rows_examined | tmp_tables | full_scan |
+-----------+-----------+-----------+-----------+---------------+------------+-----------+
|    166646 | 618.43 us | 1.00 ms   |         0 |             1 |          0 |         0 |
+-----------+-----------+-----------+-----------+---------------+------------+-----------+
1 row in set (9.16 sec)

# Truncated for clarity...
+-----------------------------------------------------------------+
| sql_text                                                        |
+-----------------------------------------------------------------+
| select hibeventhe0_.id as id1382_, hibeventhe0_.createdTime ... |
+-----------------------------------------------------------------+
1 row in set (9.17 sec)

+------------------------------------------+-----------+
| event_name                               | latency   |
+------------------------------------------+-----------+
| stage/sql/init                           | 8.61 us   |
| stage/sql/Waiting for query cache lock   | 453.23 us |
| stage/sql/init                           | 331.07 ns |
| stage/sql/checking query cache for query | 43.04 us  |
...
| stage/sql/freeing items                  | 30.46 us  |
| stage/sql/cleaning up                    | 662.13 ns |
+------------------------------------------+-----------+
18 rows in set (9.23 sec)

+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+
| id | select_type | table        | type  | possible_keys | key       | key_len | ref         | rows | Extra |
+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+
|  1 | SIMPLE      | hibeventhe0_ | const | fixedTime     | fixedTime | 775     | const,const |    1 | NULL  |
+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+
1 row in set (9.27 sec)

Query OK, 0 rows affected (9.28 sec)
```

#### 26.4.4.23 O procedimento ps\_trace\_thread()

Descarrega todos os dados do Schema de Desempenho de um thread instrumentado em um arquivo de gráfico formatado `.dot` (para a linguagem de descrição de gráficos DOT). Cada conjunto de resultados retornado pelo procedimento deve ser usado para um gráfico completo.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável do sistema `sql_log_bin`. Esse é um procedimento restrito, portanto, requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

##### Parâmetros

* `in_thread_id INT`: O thread a ser rastreado.

* `in_outfile VARCHAR(255)`: O nome a ser usado para o arquivo de saída `.dot`.

* `in_max_runtime DECIMAL(20,2)`: O número máximo de segundos (que pode ser fracionário) para coletar dados. Use `NULL` para coletar dados para o atraso padrão de 60 segundos.

* `in_interval DECIMAL(20,2)`: O número de segundos (que pode ser fracionário) para dormir entre as coletas de dados. Use `NULL` para dormir por padrão de 1 segundo.

* `in_start_fresh BOOLEAN`: Se deve reiniciar todos os dados do Schema de Desempenho antes da análise.

* `in_auto_setup BOOLEAN`: Se deseja desabilitar todos os outros threads e habilitar todos os instrumentos e consumidores. Isso também redefre os ajustes no final da execução.

* `in_debug BOOLEAN`: Se incluir as informações do `file:lineno` no gráfico.

##### Exemplo

```sql
mysql> CALL sys.ps_trace_thread(25, CONCAT('/tmp/stack-', REPLACE(NOW(), ' ', '-'), '.dot'), NULL, NULL, TRUE, TRUE, TRUE);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
1 row in set (0.00 sec)

+---------------------------------------------+
| Info                                        |
+---------------------------------------------+
| Data collection starting for THREAD_ID = 25 |
+---------------------------------------------+
1 row in set (0.03 sec)

+-----------------------------------------------------------+
| Info                                                      |
+-----------------------------------------------------------+
| Stack trace written to /tmp/stack-2014-02-16-21:18:41.dot |
+-----------------------------------------------------------+
1 row in set (60.07 sec)

+-------------------------------------------------------------------+
| Convert to PDF                                                    |
+-------------------------------------------------------------------+
| dot -Tpdf -o /tmp/stack_25.pdf /tmp/stack-2014-02-16-21:18:41.dot |
+-------------------------------------------------------------------+
1 row in set (60.07 sec)

+-------------------------------------------------------------------+
| Convert to PNG                                                    |
+-------------------------------------------------------------------+
| dot -Tpng -o /tmp/stack_25.png /tmp/stack-2014-02-16-21:18:41.dot |
+-------------------------------------------------------------------+
1 row in set (60.07 sec)

+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
1 row in set (60.32 sec)
```

#### 26.4.4.24 O procedimento ps\_truncate\_all\_tables()

Trunca todas as tabelas de resumo do Schema de desempenho, redefinindo toda a instrumentação agregada como um instantâneo. Produz um conjunto de resultados que indica quantos tabelas foram truncadas.

##### Parâmetros

* `in_verbose BOOLEAN`: Se deve exibir cada declaração `TRUNCATE TABLE` (truncate-table.html "13.1.34 TRUNCATE TABLE Statement") antes de executá-la.

##### Exemplo

```sql
mysql> CALL sys.ps_truncate_all_tables(FALSE);
+---------------------+
| summary             |
+---------------------+
| Truncated 44 tables |
+---------------------+
```

#### 26.4.4.25 O procedimento statement\_performance\_analyzer()

Cria um relatório das declarações em execução no servidor. As visualizações são calculadas com base na atividade geral e/ou delta.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável do sistema `sql_log_bin`. Esse é um procedimento restrito, portanto, requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

##### Parâmetros

* `in_action ENUM('snapshot', 'overall', 'delta', 'create_tmp', 'create_table', 'save', 'cleanup')`: A ação a ser tomada. Esses valores são permitidos:

+ `snapshot`: Armazenar um instantâneo. O padrão é fazer um instantâneo do conteúdo atual da tabela do Schema de Desempenho `events_statements_summary_by_digest`. Ao definir `in_table`, isso pode ser sobrescrito para copiar o conteúdo da tabela especificada. O instantâneo é armazenado na tabela temporária do esquema `sys` `tmp_digests`.

+ `overall`: Gerar uma análise com base no conteúdo da tabela especificada por `in_table`. Para a análise geral, `in_table` pode ser `NOW()` para usar uma captura de tela fresca. Isso sobrescreve uma captura de tela existente. Use `NULL` para `in_table` para usar a captura de tela existente. Se `in_table` for `NULL` e não existir uma captura de tela, uma nova captura de tela é criada. O parâmetro `in_views` e a opção de configuração `statement_performance_analyzer.limit` afetam o funcionamento deste procedimento.

+ `delta`: Gerar uma análise delta. O delta é calculado entre a tabela de referência especificada por `in_table` e o instantâneo, que deve existir. Esta ação utiliza a tabela temporária do esquema `sys` `tmp_digests_delta`. O parâmetro `in_views` e a opção de configuração `statement_performance_analyzer.limit` afetam o funcionamento deste procedimento.

+ `create_table`: Crie uma tabela regular adequada para armazenar o instantâneo para uso posterior (por exemplo, para calcular deltas).

+ `create_tmp`: Crie uma tabela temporária adequada para armazenar o instantâneo para uso posterior (por exemplo, para calcular deltas).

+ `save`: Salve o instantâneo na tabela especificada por `in_table`. A tabela deve existir e ter a estrutura correta. Se não existir nenhum instantâneo, um novo instantâneo é criado.

+ `cleanup`: Remova as tabelas temporárias usadas para o instantâneo e o delta.

* `in_table VARCHAR(129)`: O parâmetro de tabela usado para algumas das ações especificadas pelo parâmetro `in_action`. Use o formato *`db_name.tbl_name`* ou *`tbl_name`* sem usar nenhuma barra invertida (`` ` ``) identifier-quoting characters. Periods (`.). Não são suportados em nomes de banco de dados e tabelas.

O significado do valor `in_table` para cada valor `in_action` é detalhado nas descrições individuais do valor `in_action`.

* `in_views SET ('with_runtimes_in_95th_percentile', 'analysis', 'with_errors_or_warnings', 'with_full_table_scans', 'with_sorting', 'with_temp_tables', 'custom')`: Quais vistas incluir. Este parâmetro é um valor `SET`, portanto, pode conter vários nomes de vistas, separados por vírgulas. O padrão é incluir todas as vistas, exceto `custom`. Os seguintes valores são permitidos:

+ `with_runtimes_in_95th_percentile`: Use a visualização `statements_with_runtimes_in_95th_percentile`.

+ `analysis`: Use a visualização `statement_analysis`.

+ `with_errors_or_warnings`: Use a visualização `statements_with_errors_or_warnings`.

+ `with_full_table_scans`: Use a visualização `statements_with_full_table_scans`.

+ `with_sorting`: Use a visualização `statements_with_sorting`.

+ `with_temp_tables`: Use a visualização `statements_with_temp_tables`.

+ `custom`: Use uma visualização personalizada. Essa visualização deve ser especificada usando a opção de configuração `statement_performance_analyzer.view` para nomear uma consulta ou uma visualização existente.

Opções de configuração

`statement_performance_analyzer()` O procedimento de operação pode ser modificado usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, "A Tabela sys\_config"):

* `debug`, `@sys.debug`

Se esta opção for `ON`, produza saída de depuração. O padrão é `OFF`.

* `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

O número máximo de strings a serem retornadas para visualizações que não têm um limite embutido. O padrão é 100.

* `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

A consulta ou visualização personalizada a ser usada. Se o valor da opção contiver um espaço, ela é interpretada como uma consulta. Caso contrário, deve ser o nome de uma visualização existente que consulta a tabela do Schema de desempenho `events_statements_summary_by_digest`. Não pode haver nenhuma cláusula `LIMIT` na definição da consulta ou visualização se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. Se especificar uma visualização, use o mesmo formato que para o parâmetro `in_table`. O padrão é `NULL` (sem visualização personalizada definida).

##### Exemplo

Para criar um relatório com as consultas no percentil 95 desde a última truncagem de `events_statements_summary_by_digest` e com um período de delta de um minuto:

1. Crie uma tabela temporária para armazenar o instantâneo inicial.
2. Crie o instantâneo inicial.
3. Salve o instantâneo inicial na tabela temporária.
4. Aguarde um minuto.
5. Crie um novo instantâneo.
6. Realize análises com base no novo instantâneo.
7. Realize análises com base no delta entre os instantâneos inicial e novo.

```sql
mysql> CALL sys.statement_performance_analyzer('create_tmp', 'mydb.tmp_digests_ini', NULL);
Query OK, 0 rows affected (0.08 sec)

mysql> CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
Query OK, 0 rows affected (0.02 sec)

mysql> CALL sys.statement_performance_analyzer('save', 'mydb.tmp_digests_ini', NULL);
Query OK, 0 rows affected (0.00 sec)

mysql> DO SLEEP(60);
Query OK, 0 rows affected (1 min 0.00 sec)

mysql> CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
Query OK, 0 rows affected (0.02 sec)

mysql> CALL sys.statement_performance_analyzer('overall', NULL, 'with_runtimes_in_95th_percentile');
+-----------------------------------------+
| Next Output                             |
+-----------------------------------------+
| Queries with Runtime in 95th Percentile |
+-----------------------------------------+
1 row in set (0.05 sec)

...

mysql> CALL sys.statement_performance_analyzer('delta', 'mydb.tmp_digests_ini', 'with_runtimes_in_95th_percentile');
+-----------------------------------------+
| Next Output                             |
+-----------------------------------------+
| Queries with Runtime in 95th Percentile |
+-----------------------------------------+
1 row in set (0.03 sec)

...
```

Crie um relatório geral das consultas do 95º percentil e das 10 consultas com varreduras completas da tabela:

```sql
mysql> CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
Query OK, 0 rows affected (0.01 sec)

mysql> SET @sys.statement_performance_analyzer.limit = 10;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL sys.statement_performance_analyzer('overall', NULL, 'with_runtimes_in_95th_percentile,with_full_table_scans');
+-----------------------------------------+
| Next Output                             |
+-----------------------------------------+
| Queries with Runtime in 95th Percentile |
+-----------------------------------------+
1 row in set (0.01 sec)

...

+-------------------------------------+
| Next Output                         |
+-------------------------------------+
| Top 10 Queries with Full Table Scan |
+-------------------------------------+
1 row in set (0.09 sec)

...
```

Use uma visualização personalizada que mostre as 10 consultas mais frequentes, ordenadas pelo tempo total de execução, atualizando a visualização a cada minuto usando o comando **watch** no Linux:

```sql
mysql> CREATE OR REPLACE VIEW mydb.my_statements AS
       SELECT sys.format_statement(DIGEST_TEXT) AS query,
              SCHEMA_NAME AS db,
              COUNT_STAR AS exec_count,
              sys.format_time(SUM_TIMER_WAIT) AS total_latency,
              sys.format_time(AVG_TIMER_WAIT) AS avg_latency,
              ROUND(IFNULL(SUM_ROWS_SENT / NULLIF(COUNT_STAR, 0), 0)) AS rows_sent_avg,
              ROUND(IFNULL(SUM_ROWS_EXAMINED / NULLIF(COUNT_STAR, 0), 0)) AS rows_examined_avg,
              ROUND(IFNULL(SUM_ROWS_AFFECTED / NULLIF(COUNT_STAR, 0), 0)) AS rows_affected_avg,
              DIGEST AS digest
         FROM performance_schema.events_statements_summary_by_digest
       ORDER BY SUM_TIMER_WAIT DESC;
Query OK, 0 rows affected (0.10 sec)

mysql> CALL sys.statement_performance_analyzer('create_table', 'mydb.digests_prev', NULL);
Query OK, 0 rows affected (0.10 sec)

$> watch -n 60 "mysql sys --table -e \"
> SET @sys.statement_performance_analyzer.view = 'mydb.my_statements';
> SET @sys.statement_performance_analyzer.limit = 10;
> CALL statement_performance_analyzer('snapshot', NULL, NULL);
> CALL statement_performance_analyzer('delta', 'mydb.digests_prev', 'custom');
> CALL statement_performance_analyzer('save', 'mydb.digests_prev', NULL);
> \""

Every 60.0s: mysql sys --table -e "        ...  Mon Dec 22 10:58:51 2014

+----------------------------------+
| Next Output                      |
+----------------------------------+
| Top 10 Queries Using Custom View |
+----------------------------------+
+-------------------+-------+------------+---------------+-------------+---------------+-------------------+-------------------+----------------------------------+
| query             | db    | exec_count | total_latency | avg_latency | rows_sent_avg | rows_examined_avg | rows_affected_avg | digest                           |
+-------------------+-------+------------+---------------+-------------+---------------+-------------------+-------------------+----------------------------------+
...
```

#### 26.4.4.26 O procedimento table_exists()

Verifica se uma tabela específica existe como uma tabela regular, uma tabela `TEMPORARY` ou uma visão. O procedimento retorna o tipo de tabela em um parâmetro `OUT`. Se existir uma tabela temporária e uma permanente com o nome especificado, `TEMPORARY` é retornado.

##### Parâmetros

* `in_db VARCHAR(64)`: O nome do banco de dados no qual verificar a existência da tabela.

* `in_table VARCHAR(64)`: O nome da tabela para verificar a existência.

* `out_exists ENUM('', 'BASE TABLE', 'VIEW', 'TEMPORARY')`: O valor de retorno. Este é um parâmetro `OUT`, portanto, deve ser uma variável na qual o tipo de tabela pode ser armazenado. Quando o procedimento retornar, a variável terá um dos seguintes valores para indicar se a tabela existe:

+ `''`: O nome da tabela não existe como tabela de base, tabela `TEMPORARY` ou visão.

+ `BASE TABLE`: O nome da tabela existe como uma tabela base (permanente).

+ `VIEW`: O nome da tabela existe como uma visão.

+ `TEMPORARY`: O nome da tabela existe como uma tabela `TEMPORARY`.

##### Exemplo

```sql
mysql> CREATE DATABASE db1;
Query OK, 1 row affected (0.01 sec)

mysql> USE db1;
Database changed

mysql> CREATE TABLE t1 (id INT PRIMARY KEY);
Query OK, 0 rows affected (0.03 sec)

mysql> CREATE TABLE t2 (id INT PRIMARY KEY);
Query OK, 0 rows affected (0.20 sec)

mysql> CREATE view v_t1 AS SELECT * FROM t1;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE TEMPORARY TABLE t1 (id INT PRIMARY KEY);
Query OK, 0 rows affected (0.00 sec)

mysql> CALL sys.table_exists('db1', 't1', @exists); SELECT @exists;
Query OK, 0 rows affected (0.01 sec)

+-----------+
| @exists   |
+-----------+
| TEMPORARY |
+-----------+
1 row in set (0.00 sec)

mysql> CALL sys.table_exists('db1', 't2', @exists); SELECT @exists;
Query OK, 0 rows affected (0.02 sec)

+------------+
| @exists    |
+------------+
| BASE TABLE |
+------------+
1 row in set (0.00 sec)

mysql> CALL sys.table_exists('db1', 'v_t1', @exists); SELECT @exists;
Query OK, 0 rows affected (0.02 sec)

+---------+
| @exists |
+---------+
| VIEW    |
+---------+
1 row in set (0.00 sec)

mysql> CALL sys.table_exists('db1', 't3', @exists); SELECT @exists;
Query OK, 0 rows affected (0.00 sec)

+---------+
| @exists |
+---------+
|         |
+---------+
1 row in set (0.00 sec)
```

### 26.4.5 Funções Armazenadas no Schema sys Schema

As seções a seguir descrevem as funções de esquema armazenado `sys`.

#### 26.4.5.1 A função extract\_schema\_from\_file\_name()

Dado um nome de caminho de arquivo, retorna o componente do caminho que representa o nome do esquema. Esta função assume que o nome do arquivo está dentro do diretório do esquema. Por essa razão, não funciona com partições ou tabelas definidas usando a opção de tabela própria `DATA_DIRECTORY`.

Essa função é útil ao extrair informações de E/S de arquivo do Schema de desempenho que inclui nomes de caminho de arquivo. Ela fornece uma maneira conveniente de exibir os nomes do esquema, que podem ser mais facilmente compreendidos do que os nomes completos de caminho, e pode ser usada em junções contra nomes de esquema de objeto.

##### Parâmetros

* `path VARCHAR(512)`: O caminho completo para um arquivo de dados a partir do qual extrair o nome do esquema.

##### Valor de retorno

Um valor de `VARCHAR(64)`.

##### Exemplo

```sql
mysql> SELECT sys.extract_schema_from_file_name('/usr/local/mysql/data/world/City.ibd');
+---------------------------------------------------------------------------+
| sys.extract_schema_from_file_name('/usr/local/mysql/data/world/City.ibd') |
+---------------------------------------------------------------------------+
| world                                                                     |
+---------------------------------------------------------------------------+
```

#### 26.4.5.2 A função extract_table_from_file_name()

Dado o nome de um caminho de arquivo, retorna o componente do caminho que representa o nome da tabela.

Essa função é útil ao extrair informações de E/S de arquivo do Schema de Desempenho que incluem nomes de caminho de arquivo. Ela fornece uma maneira conveniente de exibir os nomes das tabelas, que podem ser mais facilmente compreendidos do que os nomes completos de caminho, e pode ser usada em junções contra nomes de tabelas de objetos.

##### Parâmetros

* `path VARCHAR(512)`: O caminho completo para um arquivo de dados a partir do qual extrair o nome da tabela.

##### Valor de retorno

Um valor de `VARCHAR(64)`.

##### Exemplo

```sql
mysql> SELECT sys.extract_table_from_file_name('/usr/local/mysql/data/world/City.ibd');
+--------------------------------------------------------------------------+
| sys.extract_table_from_file_name('/usr/local/mysql/data/world/City.ibd') |
+--------------------------------------------------------------------------+
| City                                                                     |
+--------------------------------------------------------------------------+
```

#### 26.4.5.3 A função format_bytes()

Dado um contador de bytes, o converte para um formato legível pelo ser humano e retorna uma string que consiste em um valor e um indicador de unidades. Dependendo do tamanho do valor, a parte das unidades é `bytes`, `KiB` (kibibytes), `MiB` (mebibytes), `GiB` (gibibytes), `TiB` (tebibytes) ou `PiB` (pebibytes).

##### Parâmetros

* `bytes TEXT`: O número de bytes para formatar.

##### Valor de retorno

Um valor de `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.format_bytes(512), sys.format_bytes(18446644073709551615);
+-----------------------+----------------------------------------+
| sys.format_bytes(512) | sys.format_bytes(18446644073709551615) |
+-----------------------+----------------------------------------+
| 512 bytes             | 16383.91 PiB                           |
+-----------------------+----------------------------------------+
```

#### 26.4.5.4 A função format_path()

Dado um nome de caminho, retorna o nome de caminho modificado após a substituição de subcaminhos que correspondem aos valores das seguintes variáveis do sistema, em ordem:

```sql
datadir
tmpdir
slave_load_tmpdir
innodb_data_home_dir
innodb_log_group_home_dir
innodb_undo_directory
basedir
```

Um valor que corresponde ao valor da variável do sistema *`sysvar`* é substituído pela string `@@GLOBAL.sysvar`.

Antes do MySQL 5.7.14, os traços de retorno em nomes de caminho do Windows são convertidos em barras inclinadas no resultado.

##### Parâmetros

* `path VARCHAR(512)`: O nome do caminho para o formato.

##### Valor de retorno

Um valor de `VARCHAR(512) CHARACTER SET utf8`.

##### Exemplo

```sql
mysql> SELECT sys.format_path('/usr/local/mysql/data/world/City.ibd');
+---------------------------------------------------------+
| sys.format_path('/usr/local/mysql/data/world/City.ibd') |
+---------------------------------------------------------+
| @@datadir/world/City.ibd                                |
+---------------------------------------------------------+
```

#### 26.4.5.5 A função format_statement()

Dado uma string (normalmente representando uma declaração SQL), reduz-a ao comprimento dado pela opção de configuração `statement_truncate_len`, e retorna o resultado. Não ocorre nenhum corte se a string for mais curta que `statement_truncate_len`. Caso contrário, a parte do meio da string é substituída por uma elipse (`...`).

Essa função é útil para formatar declarações possivelmente longas recuperadas das tabelas do Gerador de Desempenho para um comprimento máximo fixo conhecido.

##### Parâmetros

* `statement LONGTEXT`: A declaração para o formato.

Opções de configuração

A operação `format_statement()` (Função) pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, “A Tabela sys\_config”):

* `statement_truncate_len`, `@sys.statement_truncate_len`

O comprimento máximo das declarações retornadas pela função `format_statement()`") é esse comprimento. As declarações mais longas são truncadas para esse comprimento. O padrão é 64.

##### Valor de retorno

Um valor de `LONGTEXT`.

##### Exemplo

Por padrão, a função `format_statement()` ("Função") truncata as declarações para não ultrapassar 64 caracteres. Definindo `@sys.statement_truncate_len`, muda o comprimento de truncamento para a sessão atual:

```sql
mysql> SET @stmt = 'SELECT variable, value, set_time, set_by FROM sys_config';
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
mysql> SET @sys.statement_truncate_len = 32;
mysql> SELECT sys.format_statement(@stmt);
+-----------------------------------+
| sys.format_statement(@stmt)       |
+-----------------------------------+
| SELECT variabl ... ROM sys_config |
+-----------------------------------+
```

#### 26.4.5.6 A função format_time()

Dado um tempo de latência ou espera de um esquema de desempenho em picosegundos, ele é convertido para um formato legível pelo ser humano e retorna uma string que consiste em um valor e um indicador de unidades. Dependendo do tamanho do valor, a parte das unidades é `ps` (picosegundos), `ns` (nanossegundos), `us` (microsegundos), `ms` (milissegundos), `s` (segundos), `m` (minutos), `h` (horas), `d` (dias) ou `w` (semanas).

##### Parâmetros

* `picoseconds TEXT`: O valor em picosegundos para formatação.

##### Valor de retorno

Um valor de `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.format_time(3501), sys.format_time(188732396662000);
+-----------------------+----------------------------------+
| sys.format_time(3501) | sys.format_time(188732396662000) |
+-----------------------+----------------------------------+
| 3.50 ns               | 3.15 m                           |
+-----------------------+----------------------------------+
```

#### 26.4.5.7 A função list\_add()

Adiciona um valor a uma lista de valores separados por vírgula e retorna o resultado.

Essa função e `list_drop()` Função ") pode ser útil para manipular o valor das variáveis do sistema, como `sql_mode` e `optimizer_switch` que aceitam uma lista de valores separados por vírgula.

##### Parâmetros

* `in_list TEXT`: A lista que será modificada.

* `in_add_value TEXT`: O valor a ser adicionado à lista.

##### Valor de retorno

Um valor de `TEXT`.

##### Exemplo

```sql
mysql> SELECT @@sql_mode;
+----------------------------------------+
| @@sql_mode                             |
+----------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES |
+----------------------------------------+
mysql> SET @@sql_mode = sys.list_add(@@sql_mode, 'NO_ENGINE_SUBSTITUTION');
mysql> SELECT @@sql_mode;
+---------------------------------------------------------------+
| @@sql_mode                                                    |
+---------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+---------------------------------------------------------------+
mysql> SET @@sql_mode = sys.list_drop(@@sql_mode, 'ONLY_FULL_GROUP_BY');
mysql> SELECT @@sql_mode;
+--------------------------------------------+
| @@sql_mode                                 |
+--------------------------------------------+
| STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+--------------------------------------------+
```

#### 26.4.5.8 A função list\_drop()

Remove um valor de uma lista de valores separados por vírgula e retorna o resultado. Para mais informações, consulte a descrição da função `list_add()`).

##### Parâmetros

* `in_list TEXT`: A lista que será modificada.

* `in_drop_value TEXT`: O valor a ser excluído da lista.

##### Valor de retorno

Um valor de `TEXT`.

#### 26.4.5.9 A função ps\_is\_account\_enabled()

Retorna `YES` ou `NO` para indicar se a instrumentação do Schema de Desempenho para uma conta específica está habilitada.

##### Parâmetros

* `in_host VARCHAR(60)`: O nome do host da conta a ser verificada.

* `in_user VARCHAR(32)`: O nome do usuário da conta a ser verificada.

##### Valor de retorno

Um valor de `ENUM('YES','NO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_account_enabled('localhost', 'root');
+------------------------------------------------+
| sys.ps_is_account_enabled('localhost', 'root') |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```

#### 26.4.5.10 A função ps\_is\_consumer\_enabled()

Retorna `YES` ou `NO` para indicar se um determinado consumidor do Schema de Desempenho está habilitado, ou `NULL` se o argumento for `NULL`. Se o argumento não for um nome de consumidor válido, ocorre um erro. (Antes do MySQL 5.7.28, a função retorna `NULL` se o argumento não for um nome de consumidor válido.)

Essa função leva em conta a hierarquia do consumidor, portanto, um consumidor não é considerado habilitado a menos que todos os consumidores dos quais depende também estejam habilitados. Para informações sobre a hierarquia do consumidor, consulte a Seção 25.4.7, “Pré-filtragem por Consumidor”.

##### Parâmetros

* `in_consumer VARCHAR(64)`: O nome do consumidor a ser verificado.

##### Valor de retorno

Um valor de `ENUM('YES','NO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_consumer_enabled('thread_instrumentation');
+------------------------------------------------------+
| sys.ps_is_consumer_enabled('thread_instrumentation') |
+------------------------------------------------------+
| YES                                                  |
+------------------------------------------------------+
```

#### 26.4.5.11 A função ps\_is\_instrument\_default\_enabled()

Retorna `YES` ou `NO` para indicar se um instrumento do Schema de Desempenho é habilitado por padrão.

##### Parâmetros

* `in_instrument VARCHAR(128)`: O nome do instrumento a ser verificado.

##### Valor de retorno

Um valor de `ENUM('YES','NO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_instrument_default_enabled('memory/innodb/row_log_buf');
+-------------------------------------------------------------------+
| sys.ps_is_instrument_default_enabled('memory/innodb/row_log_buf') |
+-------------------------------------------------------------------+
| NO                                                                |
+-------------------------------------------------------------------+
mysql> SELECT sys.ps_is_instrument_default_enabled('statement/sql/alter_user');
+------------------------------------------------------------------+
| sys.ps_is_instrument_default_enabled('statement/sql/alter_user') |
+------------------------------------------------------------------+
| YES                                                              |
+------------------------------------------------------------------+
```

#### 26.4.5.12 A função ps\_is\_instrument\_default\_timed()

Retorna `YES` ou `NO` para indicar se um instrumento do Schema de Desempenho é temporizado por padrão.

##### Parâmetros

* `in_instrument VARCHAR(128)`: O nome do instrumento a ser verificado.

##### Valor de retorno

Um valor de `ENUM('YES','NO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_instrument_default_timed('memory/innodb/row_log_buf');
+-----------------------------------------------------------------+
| sys.ps_is_instrument_default_timed('memory/innodb/row_log_buf') |
+-----------------------------------------------------------------+
| NO                                                              |
+-----------------------------------------------------------------+
mysql> SELECT sys.ps_is_instrument_default_timed('statement/sql/alter_user');
+----------------------------------------------------------------+
| sys.ps_is_instrument_default_timed('statement/sql/alter_user') |
+----------------------------------------------------------------+
| YES                                                            |
+----------------------------------------------------------------+
```

#### 26.4.5.13 A função ps\_is\_thread\_instrumented()

Retorna `YES` ou `NO` para indicar se a instrumentação do Schema de Desempenho para um ID de conexão dado está habilitada, `UNKNOWN` se o ID é desconhecido, ou `NULL` se o ID é `NULL`.

##### Parâmetros

* `in_connection_id BIGINT UNSIGNED`: O ID de conexão. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela do Gerador de Desempenho `threads` ou na coluna `Id` do `SHOW PROCESSLIST` de saída.

##### Valor de retorno

Um valor de `ENUM('YES','NO','UNKNOWN')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_thread_instrumented(43);
+-----------------------------------+
| sys.ps_is_thread_instrumented(43) |
+-----------------------------------+
| UNKNOWN                           |
+-----------------------------------+
mysql> SELECT sys.ps_is_thread_instrumented(CONNECTION_ID());
+------------------------------------------------+
| sys.ps_is_thread_instrumented(CONNECTION_ID()) |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```

#### 26.4.5.14 A função ps\_thread\_account()

Dado um ID de thread do Schema de Desempenho, retorna a conta `user_name@host_name` associada ao thread.

##### Parâmetros

* `in_thread_id BIGINT UNSIGNED`: O ID do thread para o qual deve ser retornado a conta. O valor deve corresponder à coluna `THREAD_ID` de algumas strings da tabela do Schema de Desempenho `threads`.

##### Valor de retorno

Um valor de `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID()));
+----------------------------------------------------------+
| sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID())) |
+----------------------------------------------------------+
| root@localhost                                           |
+----------------------------------------------------------+
```

#### 26.4.5.15 A função ps\_thread\_id()

Retorna o ID do thread do Schema de Desempenho atribuído a um ID de conexão dado, ou o ID do thread para a conexão atual se o ID de conexão for `NULL`.

##### Parâmetros

* `in_connection_id BIGINT UNSIGNED`: O ID da conexão para a qual deve ser retornado o ID do thread. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads` ou na coluna `Id` da saída de `SHOW PROCESSLIST`.

##### Valor de retorno

Um valor de `BIGINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT sys.ps_thread_id(260);
+-----------------------+
| sys.ps_thread_id(260) |
+-----------------------+
|                   285 |
+-----------------------+
```

#### 26.4.5.16 A função ps\_thread\_stack()

Retorna uma pilha formatada em JSON de todas as declarações, estágios e eventos dentro do Schema de Desempenho para um ID de thread dado.

##### Parâmetros

* `in_thread_id BIGINT`: O ID do thread a ser rastreado. O valor deve corresponder à coluna `THREAD_ID` de alguma string da tabela do Schema de Desempenho `threads`.

* `in_verbose BOOLEAN`: Se incluir as informações do `file:lineno` nos eventos.

##### Valor de retorno

Um valor de `LONGTEXT CHARACTER SET latin1`.

##### Exemplo

```sql
mysql> SELECT sys.ps_thread_stack(37, FALSE) AS thread_stack\G
*************************** 1. row ***************************
thread_stack: {"rankdir": "LR","nodesep": "0.10",
"stack_created": "2014-02-19 13:39:03", "mysql_version": "5.7.3-m13",
"mysql_user": "root@localhost","events": [{"nesting_event_id": "0",
"event_id": "10", "timer_wait": 256.35, "event_info": "sql/select",
"wait_info": "select @@version_comment limit 1\nerrors: 0\nwarnings: 0\nlock time:
...
```

#### 26.4.5.17 A função ps\_thread\_trx\_info()

Retorna um objeto JSON contendo informações sobre um determinado thread. As informações incluem a transação atual e as declarações que já foram executadas, derivadas das tabelas do Schema de Desempenho `events_transactions_current` e `events_statements_history`. (Os consumidores dessas tabelas devem estar habilitados para obter dados completos no objeto JSON.)

Se a saída exceder o comprimento de truncação (padrão 65535), um objeto de erro JSON é retornado, como:

```sql
{ "error": "Trx info truncated: Row 6 was cut by GROUP_CONCAT()" }
```

Objetos de erro semelhantes são retornados para outros avisos e exceções que são lançados durante a execução da função.

##### Parâmetros

* `in_thread_id BIGINT UNSIGNED`: O ID do thread para o qual retornar informações sobre a transação. O valor deve corresponder à coluna `THREAD_ID` de algumas strings da tabela do Schema de Desempenho `threads`.

Opções de configuração

A operação `ps_thread_trx_info()` (Função) pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, “A Tabela sys\_config”):

* `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

O comprimento máximo do resultado. O padrão é 65535.

##### Valor de retorno

Um valor de `LONGTEXT`.

##### Exemplo

```sql
mysql> SELECT sys.ps_thread_trx_info(48)\G
*************************** 1. row ***************************
sys.ps_thread_trx_info(48): [
  {
    "time": "790.70 us",
    "state": "COMMITTED",
    "mode": "READ WRITE",
    "autocommitted": "NO",
    "gtid": "AUTOMATIC",
    "isolation": "REPEATABLE READ",
    "statements_executed": [
      {
        "sql_text": "INSERT INTO info VALUES (1, \'foo\')",
        "time": "471.02 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 1,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      },
      {
        "sql_text": "COMMIT",
        "time": "254.42 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 0,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      }
    ]
  },
  {
    "time": "426.20 us",
    "state": "COMMITTED",
    "mode": "READ WRITE",
    "autocommitted": "NO",
    "gtid": "AUTOMATIC",
    "isolation": "REPEATABLE READ",
    "statements_executed": [
      {
        "sql_text": "INSERT INTO info VALUES (2, \'bar\')",
        "time": "107.33 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 1,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      },
      {
        "sql_text": "COMMIT",
        "time": "213.23 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 0,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      }
    ]
  }
]
```

#### 26.4.5.18 A função quote\_identifier()

Dado um argumento de string, essa função produz um identificador citado adequado para inclusão em declarações SQL. Isso é útil quando um valor a ser usado como um identificador é uma palavra reservada ou contém caracteres de barra tensa (`` ` ``). Foi adicionado no MySQL 5.7.14.

##### Parâmetros

`in_identifier TEXT`: O identificador a ser citado.

##### Valor de retorno

Um valor de `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.quote_identifier('plain');
+-------------------------------+
| sys.quote_identifier('plain') |
+-------------------------------+
| `plain`                       |
+-------------------------------+
mysql> SELECT sys.quote_identifier('trick`ier');
+-----------------------------------+
| sys.quote_identifier('trick`ier') |
+-----------------------------------+
| `trick``ier`                      |
+-----------------------------------+
mysql> SELECT sys.quote_identifier('integer');
+---------------------------------+
| sys.quote_identifier('integer') |
+---------------------------------+
| `integer`                       |
+---------------------------------+
```

#### 26.4.5.19 A função sys\_get\_config()

Dado o nome de uma opção de configuração, retorna o valor da opção da tabela `sys_config`, ou o valor padrão fornecido (que pode ser `NULL`) se a opção não existir na tabela.

Se a função `sys_get_config()`") retornar o valor padrão e esse valor for `NULL`, espera-se que o chamador seja capaz de lidar com `NULL` para a opção de configuração dada.

Por convenção, as rotinas que chamam à função `sys_get_config()` primeiro verificam se a variável definida pelo usuário correspondente existe e não é `NULL`. Se sim, a rotina usa o valor da variável sem ler a tabela `sys_config`. Se a variável não existir ou for `NULL`, a rotina lê o valor da opção da tabela e define a variável definida pelo usuário para esse valor. Para mais informações sobre a relação entre as opções de configuração e suas variáveis definidas pelo usuário correspondentes, consulte a Seção 26.4.2.1, “A tabela sys\_config”.

Se você deseja verificar se a opção de configuração já foi definida e, se não for o caso, use o valor de retorno de `sys_get_config()`, você pode usar `IFNULL(...)` (veja o exemplo mais adiante). No entanto, isso não deve ser feito dentro de um loop (por exemplo, para cada string em um conjunto de resultados), porque para chamadas repetidas onde a atribuição é necessária apenas na primeira iteração, espera-se que o uso de `IFNULL(...)` seja significativamente mais lento do que o uso de um bloco `IF (...) THEN ... END IF;` (veja o exemplo mais adiante).

##### Parâmetros

* `in_variable_name VARCHAR(128)`: O nome da opção de configuração para a qual o valor deve ser retornado.

* `in_default_value VARCHAR(128)`: O valor padrão a ser retornado se a opção de configuração não for encontrada na tabela `sys_config`.

##### Valor de retorno

Um valor de `VARCHAR(128)`.

##### Exemplo

Obtenha um valor de configuração da tabela `sys_config`, retornando 128 como padrão se a opção não estiver presente na tabela:

```sql
mysql> SELECT sys.sys_get_config('statement_truncate_len', 128) AS Value;
+-------+
| Value |
+-------+
| 64    |
+-------+
```

Exemplo em uma string: Verifique se a opção já está definida; se não estiver, atribua o resultado `IFNULL(...)` (usando o valor da tabela `sys_config`):

```sql
mysql> SET @sys.statement_truncate_len =
       IFNULL(@sys.statement_truncate_len,
              sys.sys_get_config('statement_truncate_len', 64));
```

Exemplo de bloco `IF (...) THEN ... END IF;`: Verifique se a opção já está definida; se não estiver, atribua o valor da tabela `sys_config`:

```sql
IF (@sys.statement_truncate_len IS NULL) THEN
  SET @sys.statement_truncate_len = sys.sys_get_config('statement_truncate_len', 64);
END IF;
```

#### 26.4.5.20 A função version\_major()

Essa função retorna a versão principal do servidor MySQL.

##### Parâmetros

None.

##### Valor de retorno

Um valor de `TINYINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT VERSION(), sys.version_major();
+------------------+---------------------+
| VERSION()        | sys.version_major() |
+------------------+---------------------+
| 5.7.24-debug-log |                   5 |
+------------------+---------------------+
```

#### 26.4.5.21 A função version\_minor()

Essa função retorna a versão menor do servidor MySQL.

##### Parâmetros

None.

##### Valor de retorno

Um valor de `TINYINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT VERSION(), sys.version_minor();
+------------------+---------------------+
| VERSION()        | sys.version_minor() |
+------------------+---------------------+
| 5.7.24-debug-log |                   7 |
+------------------+---------------------+
```

#### 26.4.5.22 A função version\_patch()

Essa função retorna a versão de liberação de patches do servidor MySQL.

##### Parâmetros

None.

##### Valor de retorno

Um valor de `TINYINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT VERSION(), sys.version_patch();
+------------------+---------------------+
| VERSION()        | sys.version_patch() |
+------------------+---------------------+
| 5.7.24-debug-log |                  24 |
+------------------+---------------------+
```
