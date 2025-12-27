### 30.4.1 Objeto de Esquema `sys`

As tabelas a seguir listam os objetos de esquema `sys` e fornecem uma breve descrição de cada um.

**Tabela 30.1 Tabelas e Deslizadores de Esquema `sys`**

<table frame="box" rules="all" summary="Tabelas e deslizadores de esquema usados na implementação do esquema `sys`.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela ou Deslizador</th> <th>Descrição</th> </tr></thead><tbody>
<tr><td><a class="link" href="sys-sys-config.html" title="30.4.2.1 A Tabela `sys_config`"><code class="literal">sys_config</code></a></td> <td>tabela de opções de configuração do esquema `sys`</td> </tr>
<tr><td><a class="link" href="sys-sys-config-insert-set-user.html" title="30.4.2.2 O Deslizador `sys_config_insert_set_user`"><code class="literal">sys_config_insert_set_user</code></a></td> <td>deslizador de inserção `sys_config_insert_set_user`</td> </tr>
<tr><td><a class="link" href="sys-sys-config-update-set-user.html" title="30.4.2.3 O Deslizador `sys_config_update_set_user`"><code class="literal">sys_config_update_set_user</code></a></td> <td>deslizador de atualização `sys_config_update_set_user`</td> </tr>
</tbody></table>

**Tabela 30.2 Visões de Esquema `sys`**

Statements with runtimes in the 95th percentile</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-99th-percentile.html" title="30.4.3.39 The statements_with_runtimes_in_99th_percentile and x$statements_with_runtimes_in_99th_percentile Views"><code class="literal">statements_with_runtimes_in_99th_percentile</code>, <code class="literal">x$statements_with_runtimes_in_99th_percentile</code></a></th> <td>Statements with runtimes in the 99th percentile</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-percentile.html" title="30.4.3.40 The statements_with_runtimes_in_percentile and x$statements_with_runtimes_in_percentile Views"><code class="literal">statements_with_runtimes_in_percentile</code>, <code class="literal">x$statements_with_runtimes_in_percentile</code></a></th> <td>Statements with runtimes in a given percentile</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-top-10.html" title="30.4.3.41 The statements_with_runtimes_in_top_10 and x$statements_with_runtimes_in_top_10 Views"><code class="literal">statements_with_runtimes_in_top_10</code>, <code class="literal">x$statements_with_runtimes_in_top_10</code></a></th> <td>Statements with runtimes in the top 10%</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-top-25.html" title="30.4.3.42 The statements_with_runtimes_in_top_25 and x$statements_with_runtimes_in_top_25 Views"><code class="literal">statements_with_runtimes_in_top_25</code>, <code class="literal">x$statements_with_runtimes_in_top_25</code></a></th> <td>Statements with runtimes in the top 25%</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-top-50.html" title="30.4.3.43 The statements_with_runtimes_in_top_50 and x$statements_with_runtimes_in_top_50 Views"><code class="literal">statements_with_runtimes_in_top_50</code>, <code class="literal">x$statements_with_runtimes_in_top_50</code></a></th> <td>Statements with runtimes in the top 50%</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-top-75.html" title="30.4.3.44 The statements_with_runtimes_in_top_75 and x$statements_with_runtimes_in_top_75 Views"><code class="literal">statements_with_runtimes_in_top_75</code>, <code class="literal">x$statements_with_runtimes_in_top_75</code></a></th> <td>Statements with runtimes in the top 75%</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-top-90.html" title="30.4.3.45 The statements_with_runtimes_in_top_90 and x$statements_with_runtimes_in_top_90 Views"><code class="literal">statements_with_runtimes_in_top_90</code>, <code class="literal">x$statements_with_runtimes_in_top_90</code></a></th> <td>Statements with runtimes in the top 90%</td> <td></td> </tr><tr><th scope="row"><a class="link" href="sys-statements-with-runtimes-in-top-percentile.html" title="

**Tabela 30.3 Procedimentos armazenados do esquema sys**

<table> frame="box" rules="all" summary="Procedimentos armazenados usados na implementação do esquema sys."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome do procedimento</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="sys-create-synonym-db.html" title="30.4.4.1 O procedimento create_synonym_db()"><code class="literal">create_synonym_db()</code></a></td> <td>Criar sinônimo para o esquema</td> </tr><tr><td><a class="link" href="sys-diagnostics.html" title="30.4.4.2 O procedimento diagnostics()"><code class="literal">diagnostics()</code></a></td> <td>Coleta de informações de diagnóstico do sistema</td> </tr><tr><td><a class="link" href="sys-execute-prepared-stmt.html" title="30.4.4.3 O procedimento execute_prepared_stmt()"><code class="literal">execute_prepared-stmt()</code></a></td> <td>Execute a instrução preparada</td> </tr><tr><td><a class="link" href="sys-ps-setup-disable-background-threads.html" title="30.4.4.4 O procedimento ps_setup_disable_background_threads()"><code class="literal">ps_setup_disable-background-threads()</code></a></td> <td>Desabilitar instrumentação de threads de fundo</td> </tr><tr><td><a class="link" href="sys-ps-setup-disable-consumer.html" title="30.4.4.5 O procedimento ps_setup_disable_consumer()"><code class="literal">ps_setup_disable-consumer()</code></a></td> <td>Desabilitar consumidores</td> </tr><tr><td><a class="link" href="sys-ps-setup-disable-instrument.html" title="30.4.4.6 O procedimento ps_setup_disable_instrument()"><code class="literal">ps_setup_disable-instrument()</code></a></td> <td>Desabilitar instrumentos</td> </tr><tr><td><a class="link" href="sys-ps-setup-disable-thread.html" title="30.4.4.7 O procedimento ps_setup_disable_thread()"><code class="literal">ps_setup_disable-thread()</code></a></td> <td>Desabilitar instrumentação para thread</td> </tr><tr><td><a class="link" href="sys-ps-setup-enable-background-threads.html" title="30.4.4.8 O procedimento ps_setup_enable_background_threads()"><code class="literal">ps_setup_enable-background-threads()</code></a></td> <td>Habilitar instrumentação de threads de fundo</td> </tr><tr><td><a class="link" href="sys-ps-setup-enable-consumer.html" title="30.4.4.9 O procedimento ps_setup_enable_consumer()"><code class="literal">ps_setup_enable-consumer()</code></a></td> <td>Habilitar consumidores</td> </tr><tr><td><a class="link" href="sys-ps-setup-enable-instrument.html" title="30.4.4.10 O procedimento ps_setup_enable_instrument()"><code class="literal">ps_setup_enable-instrument()</code></a></td> <td>Habilitar instrumentos</td> </tr><tr><td><a class="link" href="sys-ps-setup-enable-thread.html" title="30.4.4.11 O procedimento ps_setup_enable_thread()"><code class="literal">ps_setup_enable-thread()</code></a></td> <td>Habilitar instrumentação para thread</td> </tr><tr><td><a class="link" href="sys-ps-setup-reload-saved.html" title="30.4.4.12 O procedimento ps_setup_reload_saved()"><code class="literal">ps_setup_reload-saved()</code></a></td> <td>Recarregar a configuração do Performance Schema salva</td> </tr><tr><td><a class="link" href="sys-ps-setup-reset-to-default.html" title="30.4.4.13 O procedimento ps_setup_reset_to_default()"><code class="literal">ps_setup_reset-to-default()</code></a></td> <td>Reseta a configuração do Performance Schema salva</td> </tr><tr><td><a class="link" href="sys-ps

**Tabela 30.4 Funções Armazenadas no Schema sys**

<table>
  <tr>
    <th>Nome da Função</th>
    <th>Descrição</th>
    <th>Deprecado</th>
  </tr>
  <tr>
    <th><a class="link" href="sys-extract-schema-from-file-name.html" title="30.4.5.1 A função extract_schema_from_file_name()"><code class="literal">extract_schema_from_file-name()</code></a></th>
    <td>Extrai a parte do nome do arquivo do nome do esquema</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-extract-table-from-file-name.html" title="30.4.5.2 A função extract_table_from_file-name()"><code class="literal">extract_table-from-file-name()</code></a></th>
    <td>Extrai a parte do nome da tabela do nome do arquivo</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-format-bytes.html" title="30.4.5.3 A função format_bytes()"><code class="literal">format-bytes()</code></a></th>
    <td>Converte o número de bytes para um valor com unidades</td>
    <td>Sim</td>
  </tr>
  <tr>
    <th><a class="link" href="sys-format-path.html" title="30.4.5.4 A função format_path()"><code class="literal">format-path()</code></a></th>
    <td>Substitui diretórios no nome do caminho por nomes de variáveis do sistema simbólico</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-format-statement.html" title="30.4.5.5 A função format_statement()"><code class="literal">format-statement()</code></a></th>
    <td>Retorna uma versão truncada do longo comando</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-format-time.html" title="30.4.5.6 A função format_time()"><code class="literal">format-time()</code></a></th>
    <td>Converte o tempo em picosegundos para um valor com unidades</td>
    <td>Sim</td>
  </tr>
  <tr>
    <th><a class="link" href="sys-list-add.html" title="30.4.5.7 A função list_add()"><code class="literal">list-add()</code></a></th>
    <td>Adiciona um item à lista</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-list-drop.html" title="30.4.5.8 A função list_drop()"><code class="literal">list-drop()</code></a></th>
    <td>Remove um item da lista</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-ps-is-account-enabled.html" title="30.4.5.9 A função ps_is_account_enabled()"><code class="literal">ps-is-account-enabled()</code></a></th>
    <td>Se a instrumentação do esquema de desempenho está habilitada para a conta</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-ps-is-consumer-enabled.html" title="30.4.5.10 A função ps_is_consumer_enabled()"><code class="literal">ps-is-consumer-enabled()</code></a></th>
    <td>Se o consumidor do esquema de desempenho está habilitado</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-ps-is-instrument-default-enabled.html" title="30.4.5.11 A função ps_is_instrument_default_enabled()"><code class="literal">ps-is-instrument-default-enabled()</code></a></th>
    <td>Se o instrumento do esquema de desempenho está habilitado por padrão</td>
    <td></td>
  </tr>
  <tr>
    <th><a class="link" href="sys-ps-is-instrument-default-timed.html" title="30.4.5.12 A função ps_is_instrument_default_timed()"><code class="literal">ps-is-instrument-default-timed()</code></a></th>
    <td>