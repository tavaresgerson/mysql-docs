### 30.4.1 Objeto de Esquema `sys`

As tabelas a seguir listam os objetos de esquema `sys` e fornecem uma breve descrição de cada um.

**Tabela 30.1 Tabelas e Deslizadores de Esquema `sys`**

<table frame="box" rules="all" summary="Tabelas e deslizadores de esquema usados na implementação do esquema `sys`.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela ou Deslizador</th> <th>Descrição</th> </tr></thead><tbody>
<tr><td><code>sys_config</code></td> <td>tabela de opções de configuração do esquema `sys`</td> </tr>
<tr><td><code>sys_config_insert_set_user</code></td> <td>deslizador de inserção `sys_config_insert_set_user`</td> </tr>
<tr><td><code>sys_config_update_set_user</code></td> <td>deslizador de atualização `sys_config_update_set_user`</td> </tr>
</tbody></table>

**Tabela 30.2 Visões de Esquema `sys`**

Statements with runtimes in the 95th percentile</td> <td></td> </tr><tr><th><code>statements_with_runtimes_in_99th_percentile</code>, <code>x$statements_with_runtimes_in_99th_percentile</code></th> <td>Statements with runtimes in the 99th percentile</td> <td></td> </tr><tr><th><code>statements_with_runtimes_in_percentile</code>, <code>x$statements_with_runtimes_in_percentile</code></th> <td>Statements with runtimes in a given percentile</td> <td></td> </tr><tr><th><code>statements_with_runtimes_in_top_10</code>, <code>x$statements_with_runtimes_in_top_10</code></th> <td>Statements with runtimes in the top 10%</td> <td></td> </tr><tr><th><code>statements_with_runtimes_in_top_25</code>, <code>x$statements_with_runtimes_in_top_25</code></th> <td>Statements with runtimes in the top 25%</td> <td></td> </tr><tr><th><code>statements_with_runtimes_in_top_50</code>, <code>x$statements_with_runtimes_in_top_50</code></th> <td>Statements with runtimes in the top 50%</td> <td></td> </tr><tr><th><code>statements_with_runtimes_in_top_75</code>, <code>x$statements_with_runtimes_in_top_75</code></th> <td>Statements with runtimes in the top 75%</td> <td></td> </tr><tr><th><code>statements_with_runtimes_in_top_90</code>, <code>x$statements_with_runtimes_in_top_90</code></th> <td>Statements with runtimes in the top 90%</td> <td></td> </tr><tr><th><a class="link" href="sys-statements-with-runtimes-in-top-percentile.html" title="

**Tabela 30.3 Procedimentos armazenados do esquema sys**

<table> frame="box" rules="all" summary="Procedimentos armazenados usados na implementação do esquema sys."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome do procedimento</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>create_synonym_db()</code></td> <td>Criar sinônimo para o esquema</td> </tr><tr><td><code>diagnostics()</code></td> <td>Coleta de informações de diagnóstico do sistema</td> </tr><tr><td><code>execute_prepared-stmt()</code></td> <td>Execute a instrução preparada</td> </tr><tr><td><code>ps_setup_disable-background-threads()</code></td> <td>Desabilitar instrumentação de threads de fundo</td> </tr><tr><td><code>ps_setup_disable-consumer()</code></td> <td>Desabilitar consumidores</td> </tr><tr><td><code>ps_setup_disable-instrument()</code></td> <td>Desabilitar instrumentos</td> </tr><tr><td><code>ps_setup_disable-thread()</code></td> <td>Desabilitar instrumentação para thread</td> </tr><tr><td><code>ps_setup_enable-background-threads()</code></td> <td>Habilitar instrumentação de threads de fundo</td> </tr><tr><td><code>ps_setup_enable-consumer()</code></td> <td>Habilitar consumidores</td> </tr><tr><td><code>ps_setup_enable-instrument()</code></td> <td>Habilitar instrumentos</td> </tr><tr><td><code>ps_setup_enable-thread()</code></td> <td>Habilitar instrumentação para thread</td> </tr><tr><td><code>ps_setup_reload-saved()</code></td> <td>Recarregar a configuração do Performance Schema salva</td> </tr><tr><td><code>ps_setup_reset-to-default()</code></td> <td>Reseta a configuração do Performance Schema salva</td> </tr><tr><td><a class="link" href="sys-ps

**Tabela 30.4 Funções Armazenadas no Schema sys**

<table>
  <tr>
    <th>Nome da Função</th>
    <th>Descrição</th>
    <th>Deprecado</th>
  </tr>
  <tr>
    <th><code>extract_schema_from_file-name()</code></th>
    <td>Extrai a parte do nome do arquivo do nome do esquema</td>
    <td></td>
  </tr>
  <tr>
    <th><code>extract_table-from-file-name()</code></th>
    <td>Extrai a parte do nome da tabela do nome do arquivo</td>
    <td></td>
  </tr>
  <tr>
    <th><code>format-bytes()</code></th>
    <td>Converte o número de bytes para um valor com unidades</td>
    <td>Sim</td>
  </tr>
  <tr>
    <th><code>format-path()</code></th>
    <td>Substitui diretórios no nome do caminho por nomes de variáveis do sistema simbólico</td>
    <td></td>
  </tr>
  <tr>
    <th><code>format-statement()</code></th>
    <td>Retorna uma versão truncada do longo comando</td>
    <td></td>
  </tr>
  <tr>
    <th><code>format-time()</code></th>
    <td>Converte o tempo em picosegundos para um valor com unidades</td>
    <td>Sim</td>
  </tr>
  <tr>
    <th><code>list-add()</code></th>
    <td>Adiciona um item à lista</td>
    <td></td>
  </tr>
  <tr>
    <th><code>list-drop()</code></th>
    <td>Remove um item da lista</td>
    <td></td>
  </tr>
  <tr>
    <th><code>ps-is-account-enabled()</code></th>
    <td>Se a instrumentação do esquema de desempenho está habilitada para a conta</td>
    <td></td>
  </tr>
  <tr>
    <th><code>ps-is-consumer-enabled()</code></th>
    <td>Se o consumidor do esquema de desempenho está habilitado</td>
    <td></td>
  </tr>
  <tr>
    <th><code>ps-is-instrument-default-enabled()</code></th>
    <td>Se o instrumento do esquema de desempenho está habilitado por padrão</td>
    <td></td>
  </tr>
  <tr>
    <th><code>ps-is-instrument-default-timed()</code></th>
    <td>