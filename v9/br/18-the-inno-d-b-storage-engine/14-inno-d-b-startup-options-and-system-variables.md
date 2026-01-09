## 17.14 Opções de Inicialização e Variáveis de Sistema do InnoDB

* Opções de Inicialização do InnoDB
* Variáveis de Sistema do InnoDB

* Variáveis de sistema que são verdadeiras ou falsas podem ser habilitadas na inicialização do servidor nomeando-as ou desabilitadas usando o prefixo `--skip-`. Por exemplo, para habilitar ou desabilitar o índice de hash adaptativo do `InnoDB`, você pode usar `--innodb-adaptive-hash-index` ou `--skip-innodb-adaptive-hash-index` na linha de comando, ou `innodb_adaptive_hash_index` ou `skip_innodb_adaptive_hash_index` em um arquivo de opções.

* Algumas descrições de variáveis referem-se a “habilitar” ou “desabilitar” uma variável. Essas variáveis podem ser habilitadas com a instrução `SET` definindo-as para `ON` ou `1`, ou desabilitadas definindo-as para `OFF` ou `0`. Variáveis booleanas podem ser definidas na inicialização com os valores `ON`, `TRUE`, `OFF` e `FALSE` (não case-sensitive), bem como `1` e `0`. Consulte a Seção 6.2.2.4, “Modificadores de Opções do Programa”.

* Variáveis de sistema que aceitam um valor numérico podem ser especificadas como `--var_name=value` na linha de comando ou como `var_name=value` em arquivos de opções.

* Muitas variáveis de sistema podem ser alteradas em tempo de execução (consulte a Seção 7.1.9.2, “Variáveis de Sistema Dinâmicas”).

* Para informações sobre os modificadores de escopo de variáveis `GLOBAL` e `SESSION`, consulte a documentação da instrução `SET`.

* Algumas opções controlam os locais e o layout dos arquivos de dados do `InnoDB`. A Seção 17.8.1, “Configuração de Inicialização do InnoDB”, explica como usar essas opções.

* Algumas opções, que você pode não usar inicialmente, ajudam a ajustar as características de desempenho do `InnoDB` com base na capacidade da máquina e no volume de trabalho do banco de dados.

* Para mais informações sobre a especificação de opções e variáveis de sistema, consulte a Seção 6.2.2, “Especificação de Opções do Programa”.

**Tabela 17.21 Referência de Opções e Variáveis do InnoDB**

<tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_now">innodb_data_write_now</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-status-variables.html#statvar_Innodb_data_write_at_shutdown">innodb_data_write_at_shutdown</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_pct">innodb_data_write_pct</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-status-variables.html#statvar_Innodb_data_write_status">Innodb_data_write_status</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_wait">innodb_data_write_wait</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_evicted">innodb_data_write_evicted</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="server-status-variables.html#statvar_Innodb_data_write_requests">Innodb_data_write_requests</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_latched">innodb_data_write_latched</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_misc">innodb_data_write_misc</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_total">innodb_data_write_total</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_evicted_status">innodb_data_write_evicted_status</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_wait_status">innodb_data_write_wait_status</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_evicted_requests">innodb_data_write_evicted_requests</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="innodb-parameters.html#sysvar_innodb_data_write_wait_requests">innodb_data_write_wait_requests</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="

### Opções de Inicialização do InnoDB

* `--innodb-dedicated-server`

  <table frame="box" rules="all" summary="Propriedades para o `innodb-dedicated-server`"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Definição de Variável</th> <td><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Hinta de Definição de Variável" target="_blank">SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Quando esta opção é definida ao iniciar o servidor com `--innodb-dedicated-server` ou `--innodb-dedicated-server=ON`, seja na linha de comando ou em um arquivo `my.cnf`, o `InnoDB` calcula e define automaticamente os valores das seguintes variáveis:

  + `innodb_buffer_pool_size`
  + `innodb_redo_log_capacity`

  Você deve considerar usar `--innodb-dedicated-server` apenas se a instância do MySQL estiver em um servidor dedicado onde ela possa usar todos os recursos do sistema disponíveis. Não é recomendado usar esta opção se a instância do MySQL compartilhar recursos do sistema com outras aplicações.

  É altamente recomendável que você leia a Seção 17.8.13, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”, antes de usar esta opção em produção.

* `--innodb-status-file`

<table frame="box" rules="all" summary="Propriedades para o arquivo de status do InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  A opção de inicialização `--innodb-status-file` controla se o `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e escreve a saída do comando `SHOW ENGINE INNODB STATUS` nele a cada 15 segundos, aproximadamente.

  O arquivo `innodb_status.pid` não é criado por padrão. Para criá-lo, inicie o **mysqld** com a opção `--innodb-status-file`. O `InnoDB` remove o arquivo quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode ter que ser removido manualmente.

  A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída do comando `SHOW ENGINE INNODB STATUS` pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.

  Para informações relacionadas, consulte a Seção 17.17.2, “Habilitar monitores do InnoDB”.

### Variáveis de sistema do InnoDB

* `innodb_adaptive_flushing`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

Especifica se é necessário ajustar dinamicamente a taxa de esvaziamento de páginas sujas no pool de buffers do `InnoDB` com base na carga de trabalho. Ajustar a taxa de esvaziamento dinamicamente visa evitar picos de atividade de E/S. Esta configuração está habilitada por padrão. Consulte a Seção 17.8.3.5, “Configurando o Esvaziamento do Pool de Buffers”, para obter mais informações. Para obter conselhos gerais sobre o ajuste do E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

* `innodb_adaptive_flushing_lwm`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

  Define o limite de água baixa que representa a porcentagem da capacidade do log de refazer em que o esvaziamento adaptativo é habilitado. Para mais informações, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

* `innodb_adaptive_hash_index`

<table frame="box" rules="all" summary="Propriedades para o índice hash adaptável do InnoDB">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
</table>

  Se o índice hash adaptável do `InnoDB` estiver habilitado ou desabilitado. Pode ser desejável, dependendo da sua carga de trabalho, habilitar ou desabilitar dinamicamente o índice hash adaptável para melhorar o desempenho das consultas. Como o índice hash adaptável pode não ser útil para todas as cargas de trabalho, realize benchmarks com ele habilitado e desabilitado, usando cargas de trabalho realistas. Veja a Seção 17.5.3, “Índice Hash Adaptável” para detalhes.

  Esta variável está desabilitada por padrão. Você pode modificar este parâmetro usando a instrução `SET GLOBAL`, sem reiniciar o servidor. Alterar o ajuste em tempo de execução requer privilégios suficientes para configurar variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Você também pode usar `--innodb-adaptive-hash-index` no início do servidor para habilitá-lo.

Desativar o índice de hash adaptável esvazia a tabela de hash imediatamente. As operações normais podem continuar enquanto a tabela de hash está sendo esvaziada, e as consultas que estavam usando o acesso à tabela de hash acessam o índice B-trees diretamente. Quando o índice de hash adaptável é reativado, a tabela de hash é preenchida novamente durante a operação normal.

Antes do MySQL 8.4, essa opção estava habilitada por padrão.

* `innodb_adaptive_hash_index_parts`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index_parts"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>8</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>512</code></td> </tr></tbody></table>

  Divide o sistema de busca do índice de hash adaptável. Cada índice está vinculado a uma partição específica, com cada partição protegida por um gatilho separado.

  O sistema de busca do índice de hash adaptável é dividido em 8 partes por padrão. O valor máximo é 512.

  Para informações relacionadas, consulte a Seção 17.5.3, “Índice de Hash Adaptável”.

* `innodb_adaptive_max_sleep_delay`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>150000</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000000</code></td> </tr>
  <tr><th>Unidade</th> <td>microsegundos</td> </tr>
</table>

Permite que o `InnoDB` ajuste automaticamente o valor de `innodb_thread_sleep_delay` para cima ou para baixo de acordo com a carga de trabalho atual. Qualquer valor não nulo habilita o ajuste dinâmico e automático do valor de `innodb_thread_sleep_delay`, até o valor máximo especificado na opção `innodb_adaptive_max_sleep_delay`. O valor representa o número de microsegundos. Esta opção pode ser útil em sistemas ocupados, com mais de 16 threads `InnoDB`. (Na prática, é mais valiosa para sistemas MySQL com centenas ou milhares de conexões simultâneas.)

Para mais informações, consulte a Seção 17.8.4, “Configurando a Concorrência de Threads para o InnoDB”.

* `innodb_autoextend_increment`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

  O tamanho do incremento (em megabytes) para a extensão do tamanho de um arquivo de espaço de tabela do sistema `InnoDB` que se expande automaticamente quando ele fica cheio. O valor padrão é 64. Para informações relacionadas, consulte Configuração do arquivo de dados do espaço de tabela e Redimensionamento do espaço de tabela.

  A configuração `innodb_autoinc_lock_mode` não afeta arquivos de espaço de tabela por tabela ou arquivos de espaço de tabela gerais. Esses arquivos estão se expandindo automaticamente independentemente da configuração `innodb_autoinc_lock_mode`. As extensões iniciais são em pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4 MB.

* `innodb_autoinc_lock_mode`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-autoinc-lock-mode=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Dica de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  O modo de bloqueio a ser usado para gerar valores de autoincremento. Os valores permitidos são 0, 1 ou 2, para tradicional, consecutivo ou entrelaçado, respectivamente.

  O valor padrão é 2 (entrelaçado), para compatibilidade com a replicação baseada em linhas.

  Para as características de cada modo de bloqueio de autoincremento, consulte Modos de bloqueio de autoincremento InnoDB.

* `innodb_background_drop_list_empty`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

* Ativação da opção de depuração `innodb_background_drop_list_empty` ajuda a evitar falhas nos casos de teste, atrasando a criação da tabela até que a lista de exclusão em segundo plano esteja vazia. Por exemplo, se o caso de teste A colocar a tabela `t1` na lista de exclusão em segundo plano, o caso de teste B aguarda até que a lista de exclusão em segundo plano esteja vazia antes de criar a tabela `t1`.

* `innodb_buffer_pool_chunk_size`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  `innodb_buffer_pool_chunk_size` define o tamanho do bloco para as operações de redimensionamento do buffer pool do `InnoDB`.

  Para evitar a cópia de todas as páginas do buffer pool durante as operações de redimensionamento, a operação é realizada em "blocos". Por padrão, `innodb_buffer_pool_chunk_size` é de 128 MB (134217728 bytes). O número de páginas contidas em um bloco depende do valor de `innodb_page_size`. `innodb_buffer_pool_chunk_size` pode ser aumentado ou diminuído em unidades de 1 MB (1048576 bytes).

  As seguintes condições se aplicam ao alterar o valor de `innodb_buffer_pool_chunk_size`:

  + Se `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances` for maior que o tamanho atual do buffer pool quando o buffer pool é inicializado, `innodb_buffer_pool_chunk_size` é truncado para `innodb_buffer_pool_size` / `innodb_buffer_pool_instances`.

O tamanho do pool de tampão deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances`. Se você alterar `innodb_buffer_pool_chunk_size`, `innodb_buffer_pool_size` será arredondado automaticamente para um valor que seja igual ou múltiplo de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances`. O ajuste ocorre quando o pool de tampão é inicializado.

Importante

Cuidado ao alterar `innodb_buffer_pool_chunk_size`, pois alterar esse valor pode aumentar automaticamente o tamanho do pool de tampão. Antes de alterar `innodb_buffer_pool_chunk_size`, calcule seu efeito em `innodb_buffer_pool_size` para garantir que o tamanho resultante do pool de tampão seja aceitável.

Para evitar potenciais problemas de desempenho, o número de fragmentos (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`) não deve exceder 1000.

A variável `innodb_buffer_pool_size` é dinâmica, o que permite redimensionar o pool de tampão enquanto o servidor estiver online. No entanto, o tamanho do pool de tampão deve ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances`, e alterar qualquer uma dessas configurações de variáveis requer reiniciar o servidor.

Consulte a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Tampão InnoDB”, para obter mais informações.

* `innodb_buffer_pool_debug`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

* `innodb_buffer_pool_dump_at_shutdown`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica se as páginas cacheadas no pool de buffer do `InnoDB` devem ser registradas quando o servidor MySQL é desligado, para encurtar o processo de aquecimento na próxima reinicialização. Tipicamente, é usado em combinação com `innodb_buffer_pool_load_at_startup`. A opção `innodb_buffer_pool_dump_pct` define a porcentagem das páginas do pool de buffer mais recentemente usadas para serem excluídas.

  Tanto `innodb_buffer_pool_dump_at_shutdown` quanto `innodb_buffer_pool_load_at_startup` estão habilitados por padrão.

  Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_dump_now`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Faz um registro imediato das páginas armazenadas em cache no pool de buffer do `InnoDB`. Tipicamente usado em combinação com `innodb_buffer_pool_load_now`.

  Ativação de `innodb_buffer_pool_dump_now` aciona a ação de registro, mas não altera a configuração da variável, que sempre permanece em `OFF` ou `0`. Para ver o status do dump do pool de buffer após a execução de um dump, consulte a variável `Innodb_buffer_pool_dump_status`.

  Ativação de `innodb_buffer_pool_dump_now` aciona a ação de dump, mas não altera a configuração da variável, que sempre permanece em `OFF` ou `0`. Para ver o status do dump do pool de buffer após a execução de um dump, consulte a variável `Innodb_buffer_pool_dump_status`.

  Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_dump_pct`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Especifica a porcentagem das páginas mais recentemente usadas para cada pool de buffers para serem lidas e descartadas. O intervalo é de 1 a 100. O valor padrão é 25. Por exemplo, se houver 4 pools de buffers com 100 páginas cada, e `innodb_buffer_pool_dump_pct` estiver configurado para 25, as 25 páginas mais recentemente usadas de cada pool de buffers serão descartadas.

* `innodb_buffer_pool_filename`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica o nome do arquivo que contém a lista de IDs de tablespace e IDs de página produzidos por `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`. Os IDs de tablespace e IDs de página são salvos no seguinte formato: `space, page_id`. Por padrão, o arquivo é chamado `ib_buffer_pool` e está localizado no diretório de dados do `InnoDB`. Uma localização não padrão deve ser especificada em relação ao diretório de dados.

  O nome do arquivo pode ser especificado em tempo de execução, usando uma instrução `SET`:

  ```
  SET GLOBAL innodb_buffer_pool_filename='file_name';
  ```

  Você também pode especificar um nome de arquivo no momento do início, em uma string de inicialização ou em um arquivo de configuração do MySQL. Ao especificar um nome de arquivo no momento do início, o arquivo deve existir ou o `InnoDB` retorna um erro de inicialização indicando que não existe tal arquivo ou diretório.

  Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do buffer pool”.

* `innodb_buffer_pool_in_core_file`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Desabilitando (padrão) a variável `innodb_buffer_pool_in_core_file`, o tamanho dos arquivos de núcleo é reduzido, excluindo as páginas do buffer pool do `InnoDB`.

Para usar essa variável, a variável `core_file` deve estar habilitada, e para desabilitar essa opção, o sistema operacional deve suportar a extensão não POSIX `MADV_DONTDUMP` para `madvise()`, que é suportada no Linux 3.4 e versões posteriores. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo ou incluindo páginas do buffer pool dos arquivos de núcleo”.

Isso é desabilitado por padrão em sistemas que suportam `MADV_DONTDUMP`, que normalmente são apenas Linux e não macOS ou Windows.

Antes do MySQL 8.4, essa opção estava habilitada por padrão.

* `innodb_buffer_pool_instances`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de regiões em que o pool de buffer do `InnoDB` é dividido. Para sistemas com pools de buffer na faixa de vários gigabytes, dividir o pool de buffer em instâncias separadas pode melhorar a concorrência, reduzindo a concorrência à medida que diferentes threads leem e escrevem em páginas armazenadas em cache. Cada página que é armazenada ou lida do pool de buffer é atribuída aleatoriamente a uma das instâncias do pool de buffer, usando uma função de hashing. Cada instância do pool de buffer gerencia suas próprias listas de livre, listas de esvaziamento, LRUs e todas as outras estruturas de dados conectadas a um pool de buffer, e é protegida por seu próprio mutex do pool de buffer.

  O tamanho total do pool de buffer é dividido entre todos os pools de buffer. Para a melhor eficiência, especifique uma combinação de `innodb_buffer_pool_instances` e `innodb_buffer_pool_size` para que cada instância do pool de buffer tenha pelo menos 1 GB.

  Se `innodb_buffer_pool_size` ≤ 1 GiB, então o valor padrão de `innodb_buffer_pool_instances` é 1.

Se `innodb_buffer_pool_size` for maior que 1 GiB, o valor padrão de `innodb_buffer_pool_instances` será o valor mínimo dos seguintes dois valores calculados, dentro de um intervalo de 1 a 64:

  + Dicas de pool de buffer: calculadas como 1/2 de (`innodb_buffer_pool_size` / `innodb_buffer_pool_chunk_size`)

  + Dicas de CPU: calculadas como 1/4 dos processadores lógicos disponíveis

  Para informações relacionadas, consulte a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Buffer InnoDB”.

* `innodb_buffer_pool_load_abort`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado a InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da dica <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Interrompe o processo de restauração do conteúdo do pool de buffer `InnoDB`, acionado por `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`.

  Ativação de `innodb_buffer_pool_load_abort` aciona a ação de interrupção, mas não altera a configuração da variável, que sempre permanece em `OFF` ou `0`. Para ver o status da carga do pool de buffer após a ativação de uma ação de interrupção, consulte a variável `Innodb_buffer_pool_load_status`.

  Para mais informações, consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffer”.

* `innodb_buffer_pool_load_at_startup`

<table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica que, ao inicializar o servidor MySQL, o pool de buffer `InnoDB` é aquecido automaticamente carregando as mesmas páginas que ele continha em um momento anterior. Tipicamente usado em combinação com `innodb_buffer_pool_dump_at_shutdown`.

  Tanto `innodb_buffer_pool_dump_at_shutdown` quanto `innodb_buffer_pool_load_at_startup` são habilitados por padrão.

  Para mais informações, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `innodb_buffer_pool_load_now`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Aqueca imediatamente o pool de buffer `InnoDB` carregando páginas de dados sem esperar por uma reinicialização do servidor. Pode ser útil para devolver a memória cache a um estado conhecido durante o benchmarking ou para preparar o servidor MySQL para retomar sua carga de trabalho normal após executar consultas para relatórios ou manutenção.

  Habilitar `innodb_buffer_pool_load_now` aciona a ação de carregamento, mas não altera o ajuste da variável, que sempre permanece `OFF` ou `0`. Para visualizar o progresso do carregamento do pool de buffer após acionar um carregamento, consulte a variável `Innodb_buffer_pool_load_status`.

Para mais informações, consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffer”.

* `innodb_buffer_pool_size`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O tamanho em bytes do pool de buffer, a área de memória onde o `InnoDB` armazena em cache os dados das tabelas e índices. O valor padrão é de 134217728 bytes (128 MB). O valor máximo depende da arquitetura da CPU; o máximo é de 4294967295 (232-1) em sistemas de 32 bits e 18446744073709551615 (264-1) em sistemas de 64 bits. Em sistemas de 32 bits, a arquitetura da CPU e o sistema operacional podem impor um tamanho máximo prático menor que o máximo declarado. Quando o tamanho do pool de buffer é maior que 1 GB, definir `innodb_buffer_pool_instances` para um valor maior que 1 pode melhorar a escalabilidade em um servidor ocupado.

  Um pool de buffer maior requer menos I/O de disco para acessar os mesmos dados da tabela mais de uma vez. Em um servidor de banco de dados dedicado, você pode definir o tamanho do pool de buffer para 80% do tamanho da memória física da máquina. Esteja ciente dos seguintes problemas potenciais ao configurar o tamanho do pool de buffer e esteja preparado para reduzir o tamanho do pool de buffer, se necessário.

  + A competição pela memória física pode causar paginação no sistema operacional.

  + O `InnoDB` reserva memória adicional para buffers e estruturas de controle, para que o espaço total alocado seja aproximadamente 10% maior que o tamanho especificado do pool de buffer.

+ O espaço de endereçamento do pool de buffers deve ser contínuo, o que pode ser um problema em sistemas Windows com DLLs que são carregadas em endereços específicos.

+ O tempo para inicializar o pool de buffers é aproximadamente proporcional ao seu tamanho. Em instâncias com pools de buffers grandes, o tempo de inicialização pode ser significativo. Para reduzir o período de inicialização, você pode salvar o estado do pool de buffers ao desligar o servidor e restaurá-lo ao iniciar o servidor. Veja a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffers”.

Quando você aumenta ou diminui o tamanho do pool de buffers, a operação é realizada em lotes. O tamanho do lote é definido pela variável `innodb_buffer_pool_chunk_size`, que tem um valor padrão de 128 MB.

O tamanho do pool de buffers deve sempre ser igual ou múltiplo de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances`. Se você alterar o tamanho do pool de buffers para um valor que não é igual ou múltiplo de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances`, o tamanho do pool de buffers é automaticamente ajustado para um valor que é igual ou múltiplo de `innodb_buffer_pool_chunk_size` * `innodb_buffer_pool_instances`.

`innodb_buffer_pool_size` pode ser definido dinamicamente, o que permite redimensionar o pool de buffers sem reiniciar o servidor. A variável de status `Innodb_buffer_pool_resize_status` relata o status das operações de redimensionamento online do pool de buffers. Veja a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Buffers InnoDB” para mais informações.

Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_buffer_pool_size` é definido automaticamente se não for explicitamente definido. Para mais informações, veja a Seção 17.8.13, “Habilitando a Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

* `innodb_change_buffer_max_size`

<table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Tamanho máximo do buffer de alterações do `InnoDB`, como porcentagem do tamanho total do pool de buffers. Você pode aumentar esse valor para um servidor MySQL com alta atividade de inserção, atualização e exclusão, ou diminuí-lo para um servidor MySQL com dados inalterados usados para relatórios. Para mais informações, consulte a Seção 17.5.2, “Buffer de Alterações”. Para conselhos gerais de ajuste de I/O, consulte a Seção 10.5.8, “Otimização do I/O de Disco InnoDB”.

* `innodb_change_buffering`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o `InnoDB` realiza a bufferização de alterações, uma otimização que adiatra as operações de escrita em índices secundários para que as operações de I/O possam ser realizadas sequencialmente. Os valores permitidos estão descritos na tabela a seguir. Os valores também podem ser especificados numericamente.

**Tabela 17.22 Valores Permitidos para innodb\_change\_buffering**

<table frame="box" rules="all" summary="Propriedades para innodb-status-file">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
</table>

  Antes do MySQL 8.4, o valor padrão era `all`.

  Para mais informações, consulte a Seção 17.5.2, “Alterar o buffer de mudanças”. Para conselhos gerais sobre o ajuste do I/O, consulte a Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

* `innodb_change_buffering_debug`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file">
    <tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
  </table>

  Define uma bandeira de depuração para o buffer de mudanças do `InnoDB`. Um valor de 1 força todas as mudanças no buffer de mudanças. Um valor de 2 causa uma saída inesperada na fusão. Um valor padrão de 0 indica que a bandeira de depuração do buffer de mudanças não está definida. Esta opção só está disponível quando o suporte de depuração está compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_checkpoint_disabled`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file">
    <tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
  </table>

Esta é uma opção de depuração destinada apenas ao uso de depuração por especialistas. Ela desabilita os pontos de verificação para que uma saída deliberada do servidor sempre inicie a recuperação do `InnoDB`. Ela só deve ser habilitada por um curto período, geralmente antes de executar operações DML que escrevem entradas do log de refazer que exigiriam recuperação após uma saída do servidor. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**.

* `innodb_checksum_algorithm`

  <table frame="box" rules="all" summary="Propriedades para innodb-status-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica como gerar e verificar o checksum armazenado nos blocos de disco dos espaços de tabelas `InnoDB`. O valor padrão para `innodb_checksum_algorithm` é `crc32`.

  O valor `innodb` é compatível com versões anteriores do MySQL. O valor `crc32` usa um algoritmo que é mais rápido para calcular o checksum para cada bloco modificado e para verificar os checksums para cada leitura de disco. Ele examina blocos de 64 bits de cada vez, o que é mais rápido que o algoritmo de checksum `innodb`, que examina blocos de 8 bits de cada vez. O valor `none` escreve um valor constante no campo checksum em vez de calcular um valor baseado nos dados do bloco. Os blocos em um espaço de tabelas podem usar uma mistura de valores antigos, novos e sem checksum, sendo atualizados gradualmente à medida que os dados são modificados; uma vez que os blocos em um espaço de tabelas são modificados para usar o algoritmo `crc32`, as tabelas associadas não podem ser lidas por versões anteriores do MySQL.

A forma rigorosa de um algoritmo de verificação de integridade reporta um erro se encontrar um valor de verificação de integridade válido, mas não correspondente, em um espaço de tabelas. Recomenda-se que você use apenas configurações rigorosas em uma nova instância, para configurar espaços de tabelas pela primeira vez. As configurações rigorosas são um pouco mais rápidas, pois não precisam calcular todos os valores de verificação de integridade durante as leituras do disco.

A tabela a seguir mostra a diferença entre os valores das opções `none`, `innodb` e `crc32`, e suas contrapartes rigorosas. `none`, `innodb` e `crc32` escrevem o tipo especificado de valor de verificação de integridade em cada bloco de dados, mas, para compatibilidade, aceitam outros valores de verificação de integridade ao verificar um bloco durante uma operação de leitura. As configurações rigorosas também aceitam valores de verificação de integridade válidos, mas imprimem uma mensagem de erro quando um valor de verificação de integridade válido, mas não correspondente, é encontrado. O uso da forma rigorosa pode tornar a verificação mais rápida se todos os arquivos de dados `InnoDB` em uma instância forem criados com o mesmo valor de `innodb_checksum_algorithm`.

**Tabela 17.23 Valores permitidos para `innodb\_checksum\_algorithm`**

<table frame="box" rules="all" summary="Propriedades para `innodb-status-file`"><tr><th>Formato de linha de comando</th> <td><code>--innodb-status-file[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Habilita estatísticas relacionadas à compressão por índice por índice na tabela do esquema de informações `INNODB_CMP_PER_INDEX`. Como essas estatísticas podem ser caras de coletar, apenas habilite essa opção em instâncias de desenvolvimento, teste ou replica durante o ajuste de desempenho relacionado a tabelas compactadas do `InnoDB`.

  Para mais informações, consulte a Seção 28.4.8, “As tabelas INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET do esquema de informações”, e a Seção 17.9.1.4, “Monitoramento da compressão de tabelas InnoDB em tempo de execução”.

* `innodb_commit_concurrency`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>ON</code></td> </tr>
</table>

  O número de threads que podem confirmar ao mesmo tempo. Um valor de 0 (o padrão) permite que qualquer número de transações seja confirmado simultaneamente.

  O valor de `innodb_commit_concurrency` não pode ser alterado em tempo de execução de zero para não zero ou vice-versa. O valor pode ser alterado de um valor não zero para outro.

* `innodb_compress_debug`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de dica de configuração <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Compreende todas as tabelas usando um algoritmo de compressão especificado sem precisar definir um atributo `COMPRESSION` para cada tabela. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção **CMake** `WITH_DEBUG`.

Para informações relacionadas, consulte a Seção 17.9.2, “Compressão de páginas do InnoDB”.

* `innodb_compression_failure_threshold_pct`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Define o limiar de taxa de falha de compressão para uma tabela, como porcentagem, no qual o MySQL começa a adicionar preenchimento dentro das páginas compactadas para evitar falhas de compactação caras. Quando esse limiar é ultrapassado, o MySQL começa a deixar espaço livre adicional dentro de cada nova página compactada, ajustando dinamicamente a quantidade de espaço livre até a porcentagem do tamanho da página especificada por `innodb_compression_pad_pct_max`. Um valor de zero desativa o mecanismo que monitora a eficiência da compactação e ajusta dinamicamente a quantidade de preenchimento.

  Para mais informações, consulte a Seção 17.9.1.6, “Compactação para cargas de trabalho OLTP”.

* `innodb_compression_level`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de configuração da dica <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Especifica o nível de compressão zlib a ser usado para tabelas e índices compactados do `InnoDB`. Um valor maior permite que você coloque mais dados em um dispositivo de armazenamento, às custas de mais overhead de CPU durante a compressão. Um valor menor permite reduzir o overhead de CPU quando o espaço de armazenamento não é crítico ou você espera que os dados não sejam especialmente compressivos.

  Para mais informações, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

* `innodb_compression_pad_pct_max`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de Aplicação do Hino <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hino de Definição de Variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

  Especifica a porcentagem máxima que pode ser reservada como espaço livre dentro de cada página compactada, permitindo espaço para reorganizar o log de dados e de modificação dentro da página quando uma tabela ou índice compactado é atualizado e os dados podem ser compactados novamente. Aplica-se apenas quando `innodb_compression_failure_threshold_pct` é definido para um valor não nulo e a taxa de falhas de compactação ultrapassa o ponto de corte.

  Para mais informações, consulte a Seção 17.9.1.6, “Compactação para Cargas de Trabalho OLTP”.

* `innodb_concurrency_tickets`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Determina o número de threads que podem entrar no `InnoDB` simultaneamente. Um thread é colocado em uma fila quando tenta entrar no `InnoDB` se o número de threads já tiver atingido o limite de concorrência. Quando um thread é permitido entrar no `InnoDB`, ele recebe um número de “bilhetes” igual ao valor de `innodb_concurrency_tickets`, e o thread pode entrar e sair livremente do `InnoDB` até esgotar seus bilhetes. Após esse ponto, o thread novamente fica sujeito à verificação de concorrência (e possível colocação em fila) da próxima vez que tentar entrar no `InnoDB`. O valor padrão é 5000.

Com um pequeno valor de `innodb_concurrency_tickets`, as pequenas transações que precisam processar apenas algumas linhas competem de forma justa com as transações maiores que processam muitas linhas. A desvantagem de um pequeno valor de `innodb_concurrency_tickets` é que as grandes transações precisam percorrer a fila muitas vezes antes de poderem ser concluídas, o que aumenta o tempo necessário para concluir sua tarefa.

Com um grande valor de `innodb_concurrency_tickets`, as grandes transações gastam menos tempo esperando uma posição no final da fila (controlada por `innodb_thread_concurrency`) e mais tempo recuperando linhas. As grandes transações também requerem menos viagens pela fila para concluir sua tarefa. A desvantagem de um grande valor de `innodb_concurrency_tickets` é que muitas transações grandes rodando ao mesmo tempo podem deixar transações menores famintas, fazendo com que elas precisem esperar por um tempo mais longo antes de serem executadas.

Com um valor de `innodb_thread_concurrency` não nulo, você pode precisar ajustar o valor de `innodb_concurrency_tickets` para cima ou para baixo para encontrar o equilíbrio ótimo entre transações maiores e menores. O relatório `SHOW ENGINE INNODB STATUS` mostra o número de tickets restantes para uma transação em execução em sua passagem atual pela fila. Esses dados também podem ser obtidos da coluna `TRX_CONCURRENCY_TICKETS` da tabela `INNODB_TRX` do Schema de Informações.

Para mais informações, consulte a Seção 17.8.4, “Configurando a Concorrência de Threads para InnoDB”.

* `innodb_data_file_path`

<table frame="box" rules="all" summary="Propriedades para o espaço de dados do `innodb_adaptive_flushing`">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code></a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>ON</code></td> </tr>
</table>

  Define o nome, tamanho e atributos dos arquivos de dados do espaço de dados do `InnoDB`. Se você não especificar um valor para `innodb_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensível, ligeiramente maior que 12 MB, com o nome `ibdata1`.

  A sintaxe completa para uma especificação de arquivo de dados inclui o nome do arquivo, o tamanho do arquivo, o atributo `autoextend` e o atributo `max`:

  ```
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

  Os tamanhos dos arquivos são especificados em kilobytes, megabytes ou gigabytes, anexando `K`, `M` ou `G` ao valor do tamanho. Se você especificar o tamanho do arquivo de dados em kilobytes, faça isso em múltiplos de 1024. Caso contrário, os valores em KB são arredondados para o limite mais próximo de megabyte (MB). A soma dos tamanhos dos arquivos deve, no mínimo, ser ligeiramente maior que 12 MB.

  Para informações adicionais de configuração, consulte Configuração do arquivo de dados do espaço de tabelas do sistema. Para instruções de redimensionamento, consulte Redimensionamento do espaço de tabelas do sistema.

* `innodb_data_home_dir`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_flushing`">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de Ajuda <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Ajuda para Definir Variáveis">SET_VAR</a> Aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</tbody></table>

  A parte comum do caminho de diretório para os arquivos de dados do espaço de tabela do sistema `InnoDB`. O valor padrão é o diretório `data` do MySQL. O ajuste é concatenado com o ajuste `innodb_data_file_path`, a menos que esse ajuste seja definido com um caminho absoluto.

  Uma barra invertida final é necessária ao especificar um valor para `innodb_data_home_dir`. Por exemplo:

  ```
  [mysqld]
  innodb_data_home_dir = /path/to/myibdata/
  ```

  Esse ajuste não afeta a localização dos espaços de tabela por tabela.

  Para informações relacionadas, consulte a Seção 17.8.1, “Configuração de Inicialização do InnoDB”.

* `innodb_ddl_buffer_size`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing">innodb_adaptive_flushing</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

  Define o tamanho máximo do buffer para operações DDL. O ajuste padrão é de 1048576 bytes (aproximadamente 1 MB). Aplica-se a operações DDL online que criam ou reconstroem índices secundários. Consulte a Seção 17.12.4, “Gestão de Memória DDL Online”. O tamanho máximo do buffer por thread DDL é o tamanho máximo do buffer dividido pelo número de threads DDL (`innodb_ddl_buffer_size`/`innodb_ddl_threads`).

* `innodb_ddl_log_crash_reset_debug`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>70</code></td> </tr>
</table>

  Ative esta opção de depuração para reiniciar os contadores de injeção de crash do log de DDL para 1. Esta opção só está disponível quando o suporte de depuração é compilado com a opção `WITH_DEBUG` do **CMake**.

* `innodb_ddl_threads`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

  Define o número máximo de threads paralelos para as fases de ordenação e construção da criação de índices. Aplica-se a operações DDL online que criam ou reconstroem índices secundários. Para informações relacionadas, consulte a Seção 17.12.5, “Configurando Threads Paralelos para Operações DDL Online”, e a Seção 17.12.4, “Gestão de Memória DDL Online”.

* `innodb_deadlock_detect`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de Ajuda <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Ajuda para Definir Variáveis">SET_VAR</a> Aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

  Esta opção é usada para desabilitar a detecção de trancos. Em sistemas de alta concorrência, a detecção de trancos pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de trancos e confiar no ajuste do parâmetro `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um tranco.

  Para informações relacionadas, consulte a Seção 17.7.5.2, “Detecção de Trancos”.

* `innodb_default_row_format`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

  A opção `innodb_default_row_format` define o formato de linha padrão para as tabelas `InnoDB` e tabelas temporárias criadas pelo usuário. O ajuste padrão é `DINÂMICO`. Outros valores permitidos são `COMPACT` e `REDUNDANT`. O formato de linha `COMPRESSED`, que não é suportado para uso no espaço de tabela do sistema, não pode ser definido como padrão.

  Tabelas recém-criadas usam o formato de linha definido por `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usada.

  Quando uma opção `ROW_FORMAT` não é especificada explicitamente ou quando `ROW_FORMAT=DEFAULT` é usada, qualquer operação que reconstrua uma tabela também altera silenciosamente o formato de linha da tabela para o formato definido por `innodb_default_row_format`. Para mais informações, consulte Definindo o Formato de Linha de uma Tabela.

Tabelas temporárias internas do `InnoDB` criadas pelo servidor para processar consultas usam o formato de linha `DYNAMIC`, independentemente da configuração do `innodb_default_row_format`.

* `innodb_directories`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>70</code></td> </tr></tbody></table>

  Define diretórios para varredura no início em busca de arquivos de espaço de tabelas. Esta opção é usada ao mover ou restaurar arquivos de espaço de tabelas para um novo local enquanto o servidor está offline. Também é usada para especificar diretórios de arquivos de espaço de tabelas criados usando um caminho absoluto ou que residem fora do diretório de dados.

  A descoberta do espaço de tabela durante a recuperação após falha depende da configuração `innodb_directories` para identificar os espaços de tabela referenciados nos logs de redo. Para mais informações, consulte Descoberta de Espaço de Tabela Durante a Recuperação após Falha.

O valor padrão é NULL, mas os diretórios definidos por `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são sempre anexados ao valor do argumento `innodb_directories` quando o `InnoDB` constrói uma lista de diretórios para varredura no momento do inicialização. Esses diretórios são anexados independentemente de uma configuração de `innodb_directories` ser especificada explicitamente.

`innodb_directories` pode ser especificado como uma opção em um comando de inicialização ou em um arquivo de opção do MySQL. Aspas cercam o valor do argumento porque, caso contrário, alguns interpretadores de comandos interpretam ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as shells Unix o tratam como um marcador de fim de comando.)

Comando de inicialização:

```
  mysqld --innodb-directories="directory_path_1;directory_path_2"
  ```

Arquivo de opção do MySQL:

```
  [mysqld]
  innodb_directories="directory_path_1;directory_path_2"
  ```

Expressões com asteriscos não podem ser usadas para especificar diretórios.

A varredura de `innodb_directories` também percorre os subdiretórios dos diretórios especificados. Diretórios e subdiretórios duplicados são descartados da lista de diretórios a serem varridos.

Para mais informações, consulte a Seção 17.6.3.6, “Movendo arquivos do espaço de tabelas enquanto o servidor está offline”.

* `innodb_disable_sort_file_cache`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

Desabilita o cache do sistema de arquivos do sistema operacional para arquivos temporários de ordenação por junção. O efeito é abrir esses arquivos com o equivalente a `O_DIRECT`.

* `innodb_doublewrite`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>70</code></td> </tr>
</table>

  A variável `innodb_doublewrite` controla o bufferamento de escrita dupla. O bufferamento de escrita dupla está habilitado por padrão na maioria dos casos.

  Você pode definir `innodb_doublewrite` para `ON` ou `OFF` ao iniciar o servidor para habilitar ou desabilitar o bufferamento de escrita dupla, respectivamente. `DETECT_AND_RECOVER` é o mesmo que `ON`. Com essa configuração, exceto que o buffer de escrita dupla está totalmente habilitado, com o conteúdo da página do banco de dados escrito no buffer de escrita dupla onde é acessado durante a recuperação para corrigir escritas de página incompletas. Com `DETECT_ONLY`, apenas os metadados são escritos no buffer de escrita dupla. O conteúdo da página do banco de dados não é escrito no buffer de escrita dupla, e a recuperação não usa o buffer de escrita dupla para corrigir escritas de página incompletas. Esta configuração leve é destinada a detectar escritas de página incompletas apenas.

O MySQL suporta alterações dinâmicas no ajuste `innodb_doublewrite` que habilita o buffer de dupla gravação, entre `ON`, `DETECT_AND_RECOVER` e `DETECT_ONLY`. O MySQL não suporta alterações dinâmicas entre um ajuste que habilita o buffer de dupla gravação e `OFF` ou vice-versa.

Se o buffer de dupla gravação estiver localizado em um dispositivo Fusion-io que suporte escritas atômicas, o buffer de dupla gravação é desativado automaticamente e as escritas de arquivos de dados são realizadas usando escritas atômicas do Fusion-io. No entanto, esteja ciente de que o ajuste `innodb_doublewrite` é global. Quando o buffer de dupla gravação é desativado, ele é desativado para todos os arquivos de dados, incluindo aqueles que não residem no hardware Fusion-io. Esta funcionalidade é suportada apenas no hardware Fusion-io e é habilitada apenas para o Fusion-io NVMFS no Linux. Para aproveitar ao máximo esta funcionalidade, é recomendado o ajuste `innodb_flush_method` de `O_DIRECT`.

Para informações relacionadas, consulte a Seção 17.6.4, “Buffer de Dupla Gravação”.

* `innodb_doublewrite_batch_size`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

  Esta variável foi criada para representar o número de páginas de dupla escrita a serem escritas em um lote. Essa funcionalidade foi substituída por `innodb_doublewrite_pages`.

  Para mais informações, consulte a Seção 17.6.4, “Buffer de Dupla Escrita”.

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

  Define o diretório para arquivos de doublewrite. Se nenhum diretório for especificado, os arquivos de doublewrite são criados no diretório `innodb_data_home_dir`, que é o diretório de dados padrão se não for especificado.

  Para mais informações, consulte a Seção 17.6.4, “Buffer de Doublewrite”.

* `innodb_doublewrite_files`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_flushing_lwm">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-flushing-lwm=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_flushing_lwm">innodb_adaptive_flushing_lwm</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>70</code></td> </tr>
</table>

  Define o número de arquivos de dupla gravação. Por padrão, dois arquivos de dupla gravação são criados para cada instância de pool de buffers.

  No mínimo, existem dois arquivos de dupla gravação. O número máximo de arquivos de dupla gravação é duas vezes o número de instâncias de pool de buffers. (O número de instâncias de pool de buffers é controlado pela variável `innodb_buffer_pool_instances`.)

  Para mais informações, consulte a Seção 17.6.4, “Buffer de Dupla Gravação”.

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
</table>

  Define o número máximo de páginas de dupla gravação por thread para uma gravação em lote. Se nenhum valor for especificado, o valor de `innodb_doublewrite_pages` é definido como 128.

  Antes do MySQL 8.4, o valor padrão era o valor de `innodb_write_io_threads`, que é 4 por padrão.

  Para mais informações, consulte a Seção 17.6.4, “Buffer de dupla gravação”.

* `innodb_extend_and_initialize`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
</table>

Controla como o espaço é alocado para file-per-table e file-per-table general nos sistemas Linux.

Quando habilitado, o `InnoDB` escreve NULLs em páginas recém-alocadas. Quando desabilitado, o espaço é alocado usando chamadas `posix_fallocate()`, que reservam espaço sem escrever fisicamente NULLs.

Para mais informações, consulte a Seção 17.6.3.8, “Otimização da alocação de espaço do tablespace no Linux”.

* `innodb_fast_shutdown`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hint de configuração de variável</th> <td><code>SET_VAR</code></a> HINT Aplica</td> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr>
</table>

  O modo de desligamento do `InnoDB`. Se o valor for 0, o `InnoDB` realiza um desligamento lento, uma purga completa e uma fusão do buffer de mudança antes de desligar. Se o valor for 1 (o padrão), o `InnoDB` ignora essas operações ao desligar, um processo conhecido como desligamento rápido. Se o valor for 2, o `InnoDB` esvazia seus logs e desliga completamente, como se o MySQL tivesse falhado; nenhuma transação confirmada é perdida, mas a operação de recuperação de falha faz com que a próxima inicialização demore mais tempo.

  O desligamento lento pode levar minutos, ou até horas em casos extremos, onde quantidades substanciais de dados ainda estão em buffer. Use a técnica de desligamento lento antes de fazer uma atualização ou downgrade entre as versões principais do MySQL, para que todos os arquivos de dados estejam totalmente preparados para o caso de o processo de atualização atualizar o formato do arquivo.

  Use `innodb_fast_shutdown=2` em situações de emergência ou depuração, para obter o desligamento mais rápido possível se os dados estiverem em risco de corrupção.

* `innodb_fil_make_page_dirty_debug`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr>
</table>

* `innodb_file_per_table`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr>
</table>

  Quando o `innodb_file_per_table` é habilitado, as tabelas são criadas em espaços de tabelas por arquivo por padrão. Quando desabilitado, as tabelas são criadas no espaço de tabelas do sistema por padrão. Para informações sobre espaços de tabelas por arquivo, consulte a Seção 17.6.3.2, “Espaços de tabelas por arquivo”. Para informações sobre o espaço de tabelas do sistema `InnoDB`, consulte a Seção 17.6.3.1, “O espaço de tabelas do sistema”.

  A variável `innodb_file_per_table` pode ser configurada em tempo de execução usando uma instrução `SET GLOBAL`, especificada na linha de comando ao iniciar ou especificada em um arquivo de opções. A configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 7.1.9.1, “Privilégios de variáveis de sistema”) e afeta imediatamente o funcionamento de todas as conexões.

Quando uma tabela que reside em um espaço de tabelas por arquivo é truncada ou removida, o espaço liberado é devolvido ao sistema operacional. A truncação ou remoção de uma tabela que reside no espaço de tabelas do sistema apenas libera espaço no espaço de tabelas do sistema. O espaço liberado no espaço de tabelas do sistema pode ser usado novamente para dados do `InnoDB`, mas não é devolvido ao sistema operacional, pois os arquivos de dados do espaço de tabelas do sistema nunca encolhem.

A configuração `innodb_file_per-table` não afeta a criação de tabelas temporárias; as tabelas temporárias são criadas em espaços de tabelas temporárias de sessão. Consulte a Seção 17.6.3.5, “Espaços de Tabelas Temporárias”.

* `innodb_fill_factor`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

O `InnoDB` realiza uma carga em lote ao criar ou reconstruir índices. Esse método de criação de índices é conhecido como “construção de índice ordenado”.

`innodb_fill_factor` define a porcentagem de espaço em cada página da árvore B que é preenchida durante a construção de um índice ordenado, com o espaço restante reservado para o crescimento futuro do índice. Por exemplo, definir `innodb_fill_factor` para 80 reserva 20% do espaço em cada página da árvore B para o crescimento futuro do índice. As porcentagens reais podem variar. O ajuste `innodb_fill_factor` é interpretado como um indicativo em vez de um limite rígido.

Um ajuste de `innodb_fill_factor` de 100 deixa 1/16 do espaço em páginas de índice agrupado livre para o crescimento futuro do índice.

`innodb_fill_factor` se aplica tanto às páginas de folha da árvore B quanto às páginas não-folha. Não se aplica a páginas externas usadas para entradas `TEXT` ou `BLOB`.

Para mais informações, consulte a Seção 17.6.2.3, “Construção de Índices Ordenados”.

* `innodb_flush_log_at_timeout`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Escreva e limpe os logs a cada `N` segundos. `innodb_flush_log_at_timeout` permite que o período de espera entre limpos seja aumentado para reduzir o processo de limpeza e evitar o impacto no desempenho do commit do grupo de log binário. O valor padrão para `innodb_flush_log_at_timeout` é uma vez por segundo.

* `innodb_flush_log_at_trx_commit`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controla o equilíbrio entre a conformidade estrita com ACID para operações de commit e o desempenho mais alto que é possível quando as operações de I/O relacionadas ao commit são reorganizadas e realizadas em lotes. Você pode obter um melhor desempenho alterando o valor padrão, mas então pode perder transações em um crash.

  + O valor padrão de 1 é necessário para a conformidade completa com ACID. Logs são escritos e limpos no disco a cada commit de transação.

  + Com um valor de 0, logs são escritos e limpos no disco uma vez por segundo. Transações para as quais os logs não foram limpos podem ser perdidas em um crash.

+ Com um valor de 2, os logs são escritos após cada commit de transação e descarregados no disco uma vez por segundo. As transações para as quais os logs não foram descarregados podem ser perdidas em um travamento.

+ Para os valores 0 e 2, o descarregamento uma vez por segundo não é garantido a 100%. O descarregamento pode ocorrer com mais frequência devido a alterações no DDL e outras atividades internas do `InnoDB` que fazem com que os logs sejam descarregados independentemente do valor de `innodb_flush_log_at_trx_commit`, e, às vezes, com menos frequência devido a problemas de agendamento. Se os logs forem descarregados uma vez por segundo, até um segundo de transações pode ser perdido em um travamento. Se os logs forem descarregados com mais ou menos frequência do que uma vez por segundo, a quantidade de transações que podem ser perdidas varia de acordo.

+ A frequência de descarregamento dos logs é controlada por `innodb_flush_log_at_timeout`, que permite definir a frequência de descarregamento dos logs para *`N`* segundos (onde *`N`* é `1 ... 2700`, com um valor padrão de 1). No entanto, qualquer saída inesperada do processo `mysqld` pode apagar até *`N`* segundos de transações.

+ Alterações no DDL e outras atividades internas do `InnoDB` descarregam o log independentemente do valor de `innodb_flush_log_at_trx_commit`.

+ A recuperação de falhas do `InnoDB` funciona independentemente do valor de `innodb_flush_log_at_trx_commit`. As transações são aplicadas totalmente ou apagadas totalmente.

Para a durabilidade e consistência em uma configuração de replicação que usa `InnoDB` com transações:

+ Se o registro binário estiver habilitado, defina `sync_binlog=1`.

+ Defina sempre `innodb_flush_log_at_trx_commit=1`.

Para obter informações sobre a combinação de configurações em uma replica que é mais resistente a interrupções inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Interrupção Inesperada de uma Replica”.

Cuidado

Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de gravação para disco. Eles podem informar ao **mysqld** que a gravação foi realizada, mesmo que não tenha sido. Nesse caso, a durabilidade das transações não é garantida, mesmo com as configurações recomendadas, e, no pior dos casos, uma queda de energia pode corromper os dados do `InnoDB`. O uso de um cache de disco com reserva de bateria no controlador de disco SCSI ou no próprio disco acelera as gravação de arquivos e torna a operação mais segura. Você também pode tentar desabilitar o cache de gravação de disco em caches de hardware.

* `innodb_flush_method`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define o método usado para gravar dados nos arquivos de dados e arquivos de log do `InnoDB`, o que pode afetar o desempenho de E/S.

  Em sistemas semelhantes ao Unix, o valor padrão é `O_DIRECT` se suportado, caso contrário, o padrão é `fsync`. Em Windows, o valor padrão é `unbuffered`.

  As opções `innodb_flush_method` para sistemas semelhantes ao Unix incluem:

+ `fsync` ou `0`: O `InnoDB` usa a chamada de sistema `fsync()` para esvaziar tanto os arquivos de dados quanto os de log.

  + `O_DSYNC` ou `1`: O `InnoDB` usa `O_SYNC` para abrir e esvaziar os arquivos de log e `fsync()` para esvaziar os arquivos de dados. O `InnoDB` não usa `O_DSYNC` diretamente porque houve problemas com isso em muitas variedades de Unix.

  + `littlesync` ou `2`: Esta opção é usada para testes de desempenho internos e atualmente não é suportada. Use por sua conta e risco.

  + `nosync` ou `3`: Esta opção é usada para testes de desempenho interno e atualmente não é suportada. Use por sua conta e risco.

  + `O_DIRECT` ou `4`: O `InnoDB` usa `O_DIRECT` (ou `directio()` em Solaris) para abrir os arquivos de dados e usa `fsync()` para esvaziar tanto os arquivos de dados quanto os de log. Esta opção está disponível em algumas versões do GNU/Linux, FreeBSD e Solaris.

  + `O_DIRECT_NO_FSYNC`: O `InnoDB` usa `O_DIRECT` durante o esvaziamento de I/O, mas ignora a chamada de sistema `fsync()` após cada operação de escrita.

    O MySQL chama `fsync()` após a criação de um novo arquivo, após o aumento do tamanho do arquivo e após a fechamento de um arquivo, para garantir que as mudanças nos metadados do sistema de arquivos sejam sincronizadas. A chamada de sistema `fsync()` ainda é ignorada após cada operação de escrita.

    A perda de dados é possível se os arquivos de log de refazer e os arquivos de dados estiverem em dispositivos de armazenamento diferentes e uma saída inesperada ocorrer antes que as escritas nos arquivos de dados sejam esvaziadas de um cache de dispositivo que não seja alimentado por bateria. Se você usar ou pretende usar diferentes dispositivos de armazenamento para arquivos de log de refazer e arquivos de dados, e seus arquivos de dados estiverem em um dispositivo com um cache que não seja alimentado por bateria, use `O_DIRECT`.

Em plataformas que suportam as chamadas de sistema `fdatasync()`, a variável `innodb_use_fdatasync` permite que as opções de `innodb_flush_method` que usam `fsync()` usem `fdatasync()` em vez disso. Uma chamada de sistema `fdatasync()` não esvazia as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um potencial benefício de desempenho.

As opções de `innodb_flush_method` para sistemas Windows incluem:

+ `unbuffered` ou `0`: O `InnoDB` usa I/O não bufferizado.

Nota

Executar o servidor MySQL em um disco rígido de 4K em sistemas Windows não é suportado com `unbuffered`. A solução é usar `innodb_flush_method=normal`.

+ `normal` ou `1`: O `InnoDB` usa I/O bufferizado.

Como cada configuração afeta o desempenho depende da configuração do hardware e da carga de trabalho. Faça um benchmark da sua configuração específica para decidir qual configuração usar ou se manter a configuração padrão. Examine a variável `Innodb_data_fsyncs` para ver o número total de chamadas `fsync()` (ou chamadas `fdatasync()` se `innodb_use_fdatasync` estiver habilitado) para cada configuração. A mistura de operações de leitura e escrita na sua carga de trabalho pode afetar o desempenho de uma configuração. Por exemplo, em um sistema com um controlador de RAID de hardware e cache de escrita com bateria, o `O_DIRECT` pode ajudar a evitar o buffer duplo entre o pool de buffers do `InnoDB` e o cache do sistema de arquivos do sistema operacional. Em alguns sistemas onde os arquivos de dados e log do `InnoDB` estão localizados em um SAN, o valor padrão ou `O_DSYNC` pode ser mais rápido para uma carga de trabalho com leitura pesada e principalmente instruções `SELECT`. Sempre teste este parâmetro com hardware e carga de trabalho que reflitam seu ambiente de produção. Para conselhos gerais de ajuste de I/O, consulte a Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

* `innodb_flush_neighbors`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_hash_index`">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--innodb-adaptive-hash-index[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index">innodb_adaptive_hash_index</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
</table>

  Especifica se o esvaziamento de uma página do pool de buffer `InnoDB` também esvazia outras páginas sujas da mesma extensão.

  + Uma configuração de 0 desativa `innodb_flush_neighbors`. Páginas sujas da mesma extensão não são esvaziadas.

  + Uma configuração de 1 esvazia páginas sujas contiguas da mesma extensão.

  + Uma configuração de 2 esvazia páginas sujas da mesma extensão.

  Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, o esvaziamento de páginas vizinhas em uma única operação reduz o overhead de I/O (principalmente para operações de busca no disco) em comparação com o esvaziamento de páginas individuais em momentos diferentes. Para dados de tabela armazenados em SSD, o tempo de busca não é um fator significativo e você pode configurar essa opção para 0 para espalhar as operações de escrita. Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do pool de buffer”.

* `innodb_flush_sync`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index_parts">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor padrão</th> <td><code>8</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>512</code></td> </tr>
</table>

A variável `innodb_flush_sync`, que é habilitada por padrão, faz com que as configurações `innodb_io_capacity` e `innodb_io_capacity_max` sejam ignoradas durante os picos de atividade de E/S que ocorrem nos pontos de verificação. Para aderir à taxa de E/S definida por `innodb_io_capacity` e `innodb_io_capacity_max`, desabilite `innodb_flush_sync`.

Para obter informações sobre a configuração da variável `innodb_flush_sync`, consulte a Seção 17.8.7, “Configurando a Capacidade de E/S do InnoDB”.

* `innodb_flushing_avg_loops`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_hash_index_parts`">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor padrão</th> <td><code>8</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>512</code></td> </tr>
</table>

Número de iterações para as quais o `InnoDB` mantém o snapshot de estado de varredura calculado anteriormente, controlando a rapidez com que a varredura adaptativa responde às mudanças na carga de trabalho. Aumentar o valor faz com que a taxa de operações de varredura mude de forma suave e gradual à medida que a carga de trabalho muda. Diminuir o valor faz com que a varredura adaptativa ajuste-se rapidamente às mudanças na carga de trabalho, o que pode causar picos na atividade de varredura se a carga de trabalho aumentar e diminuir de repente.

Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando a varredura do pool de buffers”.

* `innodb_force_load_corrupted`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_hash_index_parts`">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>8</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>512</code></td> </tr>
</table>

Permite que o `InnoDB` carregue tabelas ao inicializar que estejam marcadas como corrompidas. Use apenas durante a solução de problemas, para recuperar dados que, de outra forma, seriam inacessíveis. Quando a solução de problemas for concluída, desative esta configuração e reinicie o servidor.

* `innodb_force_recovery`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index_parts">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor padrão</th> <td><code>8</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>512</code></td> </tr>
</table>

  O modo de recuperação em caso de falha, normalmente alterado apenas em situações graves de depuração. Os valores possíveis são de 0 a 6. Para saber o significado desses valores e informações importantes sobre `innodb_force_recovery`, consulte a Seção 17.20.3, “Forçar a recuperação do InnoDB”.

  Aviso

  Configure apenas esse valor para um valor maior que 0 em uma situação de emergência para que você possa iniciar o `InnoDB` e drenar suas tabelas. Como medida de segurança, o `InnoDB` impede as operações de <code>INSERT</code>, <code>UPDATE</code> ou <code>DELETE</code> quando `innodb_force_recovery` é maior que 0. Um ajuste de `innodb_force_recovery` de 4 ou maior coloca o `InnoDB` no modo de leitura apenas.

  Essas restrições podem fazer com que os comandos de administração de replicação falhem com um erro, pois a replicação armazena os logs do status da replica em tabelas do `InnoDB`.

* `innodb_fsync_threshold`

  <table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_hash_index_parts`"><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>8</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>512</code></td> </tr></table>

  Por padrão, quando o `InnoDB` cria um novo arquivo de dados, como um novo arquivo de log ou arquivo de espaço de tabelas, o arquivo é totalmente escrito na cache do sistema operacional antes de ser descarregado no disco, o que pode causar uma grande quantidade de atividade de escrita no disco de uma só vez. Para forçar limpezas periódicas e menores do conteúdo da cache do sistema operacional, você pode usar a variável `innodb_fsync_threshold` para definir um valor limite, em bytes. Quando o limite de bytes é atingido, o conteúdo da cache do sistema operacional é descarregado no disco. O valor padrão de 0 força o comportamento padrão, que é descarregar os dados no disco apenas após um arquivo ser totalmente escrito na cache.

Especificar um limite para forçar limpezas periódicas menores pode ser benéfico em casos em que múltiplas instâncias do MySQL utilizam os mesmos dispositivos de armazenamento. Por exemplo, criar uma nova instância do MySQL e seus arquivos de dados associados pode causar grandes picos de atividade de escrita no disco, impedindo o desempenho de outras instâncias do MySQL que utilizam os mesmos dispositivos de armazenamento. Configurar um limite ajuda a evitar tais picos de atividade de escrita.

* `innodb_ft_aux_table`

  <table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_hash_index_parts`">
    
    <tbody>
      <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr>
      <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr>
      <tr><th>Alcance</th> <td>Global</td> </tr>
      <tr><th>Dinâmico</th> <td>Não</td> </tr>
      <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
      <tr><th>Tipo</th> <td>Numérico</td> </tr>
      <tr><th>Valor padrão</th> <td><code>8</code></td> </tr>
      <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
      <tr><th>Valor máximo</th> <td><code>512</code></td> </tr>
    </tbody>
  </table>

  Especifica o nome qualificado de uma tabela `InnoDB` que contém um índice `FULLTEXT`. Esta variável é destinada a fins de diagnóstico e só pode ser definida em tempo de execução. Por exemplo:

  ```
  SET GLOBAL innodb_ft_aux_table = 'test/t1';
  ```

Depois de definir essa variável para um nome no formato `db_name/table_name`, as tabelas do `INFORMATION_SCHEMA` `INNODB_FT_INDEX_TABLE`, `INNODB_FT_INDEX_CACHE`, `INNODB_FT_CONFIG`, `INNODB_FT_DELETED` e `INNODB_FT_BEING_DELETED` mostram informações sobre o índice de busca para a tabela especificada.

Para mais informações, consulte a Seção 17.15.4, “Tabelas de índice FULLTEXT do INFORMATION_SCHEMA InnoDB”.

* `innodb_ft_cache_size`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index_parts"><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>8</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>512</code></td> </tr></table>

A memória alocada, em bytes, para o cache do índice de pesquisa full-text (`FULLTEXT`) do `InnoDB`, que armazena um documento analisado na memória durante a criação de um índice `FULLTEXT` do `InnoDB`. As inserções e atualizações do índice são comprometidas no disco apenas quando o limite de tamanho do `innodb_ft_cache_size` é atingido. O `innodb_ft_cache_size` define o tamanho do cache por tabela. Para definir um limite global para todas as tabelas, consulte `innodb_ft_total_cache_size`.

Para obter mais informações, consulte o cache de índice full-text do InnoDB.

* `innodb_ft_enable_diag_print`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index_parts"><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>8</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>512</code></td> </tr></table>

  Se habilitar a saída de diagnóstico adicional de pesquisa full-text (FTS). Esta opção é destinada principalmente ao depuração avançada do FTS e não é de interesse para a maioria dos usuários. A saída é impressa no log de erro e inclui informações como:

+ Progresso da sincronização do índice FTS (quando o limite do cache FTS é atingido). Por exemplo:

    ```
    FTS SYNC for table test, deleted count: 100 size: 10000 bytes
    SYNC words: 100
    ```

+ Progresso da otimização do FTS. Por exemplo:

    ```
    FTS start optimize test
    FTS_OPTIMIZE: optimize "mysql"
    FTS_OPTIMIZE: processed "mysql"
    ```

+ Progresso da construção do índice FTS. Por exemplo:

    ```
    Number of doc processed: 1000
    ```

+ Para consultas FTS, a árvore de análise da consulta, o peso das palavras, o tempo de processamento da consulta e o uso de memória são impressos. Por exemplo:

    ```
    FTS Search Processing time: 1 secs: 100 millisec: row(s) 10000
    Full Search Memory: 245666 (bytes),  Row: 10000
    ```

* `innodb_ft_enable_stopword`

  <table frame="box" rules="all" summary="Propriedades para innodb_adaptive_hash_index_parts"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</a></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>8</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>512</code></td> </tr></tbody></table>

  Especifica que um conjunto de palavras-chave é associado a um índice `FULLTEXT` `InnoDB` no momento em que o índice é criado. Se a opção `innodb_ft_user_stopword_table` for definida, as palavras-chave são tiradas dessa tabela. Caso contrário, se a opção `innodb_ft_server_stopword_table` for definida, as palavras-chave são tiradas dessa tabela. Caso contrário, um conjunto padrão de palavras-chave padrão é usado.

Para obter mais informações, consulte a Seção 14.9.4, “Palavras-chave Full-Text Completas”.

* `innodb_ft_max_token_size`

  <table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_hash_index_parts`"><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-hash-index-parts=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts">innodb_adaptive_hash_index_parts</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Definição de Variável</th> <td><code>SET_VAR</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>8</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>512</code></td> </tr></table>

  Comprimento máximo de caracteres das palavras que são armazenadas em um índice `FULLTEXT` de `InnoDB`. Definir um limite para esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras longas ou coleções arbitrárias de letras que não são palavras reais e que provavelmente não serão termos de busca.

  Para obter mais informações, consulte a Seção 14.9.6, “Ajuste Fíno da Pesquisa Full-Text do MySQL”.

* `innodb_ft_min_token_size`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--innodb-adaptive-max-sleep-delay=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> se aplica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>150000</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>1000000</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>microsegundos</td>
  </tr>
</table>

  Comprimento mínimo das palavras que são armazenadas em um índice `FULLTEXT` de `InnoDB`. Aumentar esse valor reduz o tamanho do índice, acelerando assim as consultas, ao omitir palavras comuns que são improváveis de serem significativas em um contexto de busca, como as palavras em inglês “a” e “to”. Para conteúdo que usa um conjunto de caracteres CJK (Chinês, Japonês, Coreano), especifique um valor de 1.

  Para mais informações, consulte a Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

* `innodb_ft_num_word_optimize`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_max_sleep_delay">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive-max-sleep-delay">innodb_adaptive-max-sleep-delay</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>150000</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000000</code></td> </tr>
  <tr><th>Unidade</th> <td>microsegundos</td> </tr>
</table>

Número de palavras a serem processadas durante cada operação `OPTIMIZE TABLE` em um índice `FULLTEXT` de `InnoDB`. Como uma operação de inserção ou atualização em massa em uma tabela que contém um índice de pesquisa full-text pode exigir uma manutenção substancial do índice para incorporar todas as alterações, você pode executar uma série de declarações `OPTIMIZE TABLE`, cada uma retomando o ponto onde a última parou.

Para mais informações, consulte a Seção 14.9.6, “Ajuste fino da pesquisa full-text MySQL”.

* `innodb_ft_result_cache_limit`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_max_sleep_delay">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>150000</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000000</code></td> </tr>
  <tr><th>Unidade</th> <td>microsegundos</td> </tr>
</table>
2

O limite de cache do resultado da consulta de pesquisa de texto completo do `InnoDB` (definido em bytes) por consulta de pesquisa de texto completo ou por thread. Os resultados intermediários e finais da consulta de pesquisa de texto completo do `InnoDB` são mantidos na memória. Use `innodb_ft_result_cache_limit` para definir um limite de tamanho para o cache de resultados da consulta de pesquisa de texto completo para evitar o consumo excessivo de memória no caso de resultados muito grandes da consulta de pesquisa de texto completo do `InnoDB` (milhões ou centenas de milhões de linhas, por exemplo). A memória é alocada conforme necessário quando uma consulta de pesquisa de texto completo é processada. Se o limite de tamanho do cache de resultados da consulta for atingido, um erro é retornado indicando que a consulta excede a memória máxima permitida.

O valor máximo de `innodb_ft_result_cache_limit` para todos os tipos de plataforma e tamanhos de bits é 2\*\*32-1.

* `innodb_ft_server_stopword_table`

  <table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`"><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</a></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>150000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>1000000</code></td> </tr><tr><th>Unidade</th> <td>microsegundos</td> </tr></tbody></table>

  Esta opção é usada para especificar sua própria lista de stopwords para o índice `FULLTEXT` do `InnoDB` para todas as tabelas `InnoDB`. Para configurar sua própria lista de stopwords para uma tabela específica do `InnoDB`, use `innodb_ft_user_stopword_table`.

  Configure `innodb_ft_server_stopword_table` com o nome da tabela que contém uma lista de stopwords, no formato `db_name/table_name`.

  A tabela de stopwords deve existir antes de você configurar `innodb_ft_server_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e a opção `innodb_ft_server_stopword_table` deve ser configurada antes de você criar o índice `FULLTEXT`.

A tabela de palavras-chave de stop deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` chamada `valor`.

Para obter mais informações, consulte a Seção 14.9.4, “Palavras-chave de stop de texto completo”.

* `innodb_ft_sort_pll_degree`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`"><tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>150000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>1000000</code></td> </tr><tr><th>Unidade</th> <td>microsegundos</td> </tr></table>

Número de threads usados em paralelo para indexar e tokenizar texto em um índice `FULLTEXT` `InnoDB` ao construir um índice de busca.

Para informações relacionadas, consulte a Seção 17.6.2.4, “Indizes de texto completo do InnoDB” e `innodb_sort_buffer_size`.

* `innodb_ft_total_cache_size`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive-max-sleep-delay">innodb_adaptive-max-sleep-delay</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de sintaxe de definição de variável</th> <td><code>SET_VAR</a></code></td> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>150000</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000000</code></td> </tr>
  <tr><th>Unidade</th> <td>microsegundos</td> </tr>
</table>

  A memória total alocada, em bytes, para o cache de índice de pesquisa full-text `InnoDB` para todas as tabelas. A criação de inúmeras tabelas, cada uma com um índice de pesquisa `FULLTEXT`, pode consumir uma parte significativa da memória disponível. `innodb_ft_total_cache_size` define um limite de memória global para todos os índices de pesquisa full-text para ajudar a evitar o consumo excessivo de memória. Se o limite global for atingido por uma operação de índice, uma sincronização forçada é acionada.

  Para mais informações, consulte Cache de índice de pesquisa full-text do InnoDB.

* `innodb_ft_user_stopword_table`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>150000</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1000000</code></td> </tr>
  <tr><th>Unidade</th> <td>microsegundos</td> </tr>
</table>

  Esta opção é usada para especificar sua própria lista de palavras-chave de parada do índice `FULLTEXT` do `InnoDB` em uma tabela específica. Para configurar sua própria lista de palavras-chave para todas as tabelas `InnoDB`, use `innodb_ft_server_stopword_table`.

  Defina `innodb_ft_user_stopword_table` com o nome da tabela que contém uma lista de palavras-chave, no formato `db_name/table_name`.

  A tabela de palavras-chave deve existir antes de configurar `innodb_ft_user_stopword_table`. `innodb_ft_enable_stopword` deve estar habilitado e `innodb_ft_user_stopword_table` deve ser configurado antes de criar o índice `FULLTEXT`.

  A tabela de palavras-chave deve ser uma tabela `InnoDB`, contendo uma única coluna `VARCHAR` chamada `value`.

  Para mais informações, consulte a Seção 14.9.4, “Palavras-Chave de Parada de Texto Completo”.

* `innodb_idle_flush_pct`

  <table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`"><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Configuração da Variável"><code>SET_VAR</code></a></code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>150000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1000000</code></td> </tr><tr><th>Unidade</th> <td>microsegundos</td> </tr></table>

  Limita o esvaziamento da página quando o `InnoDB` está idle. O valor `innodb_idle_flush_pct` é uma porcentagem do ajuste `innodb_io_capacity`, que define o número de operações de I/O por segundo disponíveis para o `InnoDB`. Para mais informações, consulte Limitar o Esvaziamento do Buffer Durante Períodos Idle.

* `innodb_io_capacity`

<table frame="box" rules="all" summary="Propriedades para `innodb_adaptive_max_sleep_delay`">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de Configuração do <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>150000</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1000000</code></td> </tr>
  <tr><th>Unidade</th> <td>microsegundos</td> </tr>
</table>

A variável `innodb_io_capacity` define o número de operações de E/S por segundo (IOPS) disponíveis para as tarefas de segundo plano do `InnoDB`, como o esvaziamento de páginas do pool de buffer e a fusão de dados do buffer de alterações.

Para obter informações sobre a configuração da variável `innodb_io_capacity`, consulte a Seção 17.8.7, “Configurando a Capacidade de E/S do InnoDB”.

* `innodb_io_capacity_max`

<table frame="box" rules="all" summary="Propriedades para innodb_adaptive_max_sleep_delay">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-adaptive-max-sleep-delay=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_adaptive_max_sleep_delay">innodb_adaptive_max_sleep_delay</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>150000</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000000</code></td> </tr>
  <tr><th>Unidade</th> <td>microsegundos</td> </tr>
</table>

Se a atividade de varredura ficar para trás, o `InnoDB` pode realizar varreduras mais agressivas, com uma taxa maior de operações de I/O por segundo (IOPS) do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizados pelas tarefas de fundo do `InnoDB` nessas situações. Esta opção não controla o comportamento do `innodb_flush_sync`.

O valor padrão é o dobro do valor de `innodb_io_capacity`.

Para obter informações sobre a configuração da variável `innodb_io_capacity_max`, consulte a Seção 17.8.7, “Configurando a Capacidade de I/O do InnoDB”.

* `innodb_limit_optimistic_insert_debug`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

Limita o número de registros por página de árvore B. Um valor padrão de 0 significa que nenhum limite é imposto. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**.

* `innodb_lock_wait_timeout`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> se aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

  O tempo em segundos que uma transação `InnoDB` espera por um bloqueio de linha antes de desistir. O valor padrão é de 50 segundos. Uma transação que tenta acessar uma linha bloqueada por outra transação `InnoDB` aguarda, no máximo, esse número de segundos para obter acesso de escrita à linha antes de emitir o seguinte erro:

  ```
  ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
  ```

  Quando ocorre um timeout de espera por bloqueio, a declaração atual é revertida (não a transação inteira). Para que a transação inteira seja revertida, inicie o servidor com a opção `--innodb-rollback-on-timeout`. Veja também a Seção 17.20.5, “Tratamento de Erros do InnoDB”.

Você pode diminuir esse valor para aplicações altamente interativas ou sistemas OLTP, para exibir o feedback do usuário rapidamente ou colocar a atualização em uma fila para processamento mais tarde. Você pode aumentar esse valor para operações de back-end de longa duração, como uma etapa de transformação em um armazém de dados que espera que outras operações de inserção ou atualização grandes sejam concluídas.

`innodb_lock_wait_timeout` se aplica aos bloqueios de linha `InnoDB`. Um bloqueio de tabela MySQL não ocorre dentro do `InnoDB` e esse tempo de espera não se aplica a espera por bloqueios de tabela.

O valor do tempo de espera do bloqueio de espera não se aplica a deadlocks quando `innodb_deadlock_detect` está habilitado (o padrão) porque o `InnoDB` detecta deadlocks imediatamente e desfaz uma das transações em deadlock. Quando `innodb_deadlock_detect` está desabilitado, o `InnoDB` depende do `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um deadlock. Veja a Seção 17.7.5.2, “Detecção de Deadlocks”.

`innodb_lock_wait_timeout` pode ser definido em tempo de execução com a instrução `SET GLOBAL` ou `SET SESSION`. Alterar o ajuste `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar o ajuste `SESSION` para `innodb_lock_wait_timeout`, o que afeta apenas esse cliente.

* `innodb_log_buffer_size`

<table frame="box" rules="all" summary="Propriedades para `innodb_autoextend_increment`">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> se aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

  O tamanho em bytes do buffer que o `InnoDB` usa para gravar nos arquivos de log no disco. O padrão é 64MB. Um buffer de log grande permite que transações grandes sejam executadas sem a necessidade de gravar o log no disco antes do commit das transações. Portanto, se você tiver transações que atualizam, inserem ou excluem muitas linhas, aumentar o buffer de log salva o I/O de disco. Para informações relacionadas, consulte Configuração de Memória e Seção 10.5.4, “Otimização da Logicação de Regra de Refazimento do InnoDB”. Para conselhos gerais sobre o ajuste de I/O, consulte Seção 10.5.8, “Otimização do I/O de Disco do InnoDB”.

<table frame="box" rules="all" summary="Propriedades para `innodb_autoextend_increment`">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

  Ative esta opção de depuração para forçar o `InnoDB` a escrever um ponto de verificação fuzzy. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` no **CMake**.

* `innodb_log_checkpoint_now`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

4. Ative esta opção de depuração para forçar o `InnoDB` a escrever um ponto de verificação. Esta opção só está disponível se o suporte de depuração estiver compilado com a opção `WITH_DEBUG` do **CMake**.

* `innodb_log_checksums`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

  Habilita ou desabilita verificações de checksums para páginas do log de reverso.

  `innodb_log_checksums=ON` habilita o algoritmo de verificação de checksum `CRC-32C` para páginas do log de reverso. Quando `innodb_log_checksums` é desativado, o conteúdo do campo de verificação de checksum da página do log de reverso é ignorado.

  As verificações nas páginas do cabeçalho do log de reverso e nas páginas de verificação de ponto de controle do log de reverso nunca são desativadas.
* `innodb_log_compressed_pages`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th></a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

  Especifica se as imagens de páginas recompressas são escritas no log de refazer. A recompressão pode ocorrer quando alterações são feitas em dados comprimidos.

  `innodb_log_compressed_pages` está habilitado por padrão para evitar corrupção que poderia ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante a recuperação. Se você tem certeza de que a versão do `zlib` não será alterada, pode desabilitar `innodb_log_compressed_pages` para reduzir a geração do log de refazer para cargas de trabalho que modificam dados comprimidos.

Para medir o efeito de habilitar ou desabilitar `innodb_log_compressed_pages`, compare a geração de log de redo para ambas as configurações sob a mesma carga de trabalho. As opções para medir a geração de log de redo incluem observar o número de sequência de log (LSN) na seção `LOG` do resultado do comando `SHOW ENGINE INNODB STATUS`, ou monitorar o status de `Innodb_os_log_written` para o número de bytes escritos nos arquivos de log de redo.

Para informações relacionadas, consulte a Seção 17.9.1.6, “Compressão para cargas de trabalho OLTP”.

* `innodb_log_group_home_dir`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment"><tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</code></a> Hint Aplica</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>64</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>1000</code></td> </tr><tr><th>Unidade</th> <td>megabytes</td> </tr></tbody></table>

O caminho do diretório para os arquivos de log de redo de `InnoDB`.

Para informações relacionadas, consulte Configuração do Log de Redo.

* `innodb_log_spin_cpu_abs_lwm`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-autoextend-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hint de Configuração de Variável</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>64</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1000</code></td> </tr>
  <tr><th>Unidade</th> <td>megabytes</td> </tr>
</table>

  Define a quantidade mínima de uso de CPU abaixo da qual os threads dos usuários não giram mais enquanto aguardam a logagem de redo esvaziada. O valor é expresso como a soma do uso de núcleos de CPU. Por exemplo, o valor padrão de 80 é 80% de um único núcleo de CPU. Em um sistema com um processador multi-core, um valor de 150 representa o uso de 100% de um núcleo de CPU mais 50% de um segundo núcleo de CPU.

  Para informações relacionadas, consulte a Seção 10.5.4, “Otimização da Logagem de Redo InnoDB”.

* `innodb_log_spin_cpu_pct_hwm`

<table frame="box" rules="all" summary="Propriedades para innodb_autoextend_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-autoextend_increment=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoextend_increment">innodb_autoextend_increment</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Dicas Aplica</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>64</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>1000</code></td> </tr><tr><th>Unidade</th> <td>megabytes</td> </tr></tbody></table>

  Define a quantidade máxima de uso de CPU acima da qual os threads do usuário não giram mais enquanto aguardam o término do redo esvaziado. O valor é expresso como uma porcentagem do poder de processamento total combinado de todos os núcleos da CPU. O valor padrão é de 50%. Por exemplo, o uso de 100% de dois núcleos da CPU é de 50% do poder de processamento total da CPU em um servidor com quatro núcleos da CPU.

  A variável `innodb_log_spin_cpu_pct_hwm` respeita a afinidade do processador. Por exemplo, se um servidor tem 48 núcleos, mas o processo **mysqld** está fixado apenas em quatro núcleos da CPU, os outros 44 núcleos da CPU são ignorados.

  Para informações relacionadas, consulte a Seção 10.5.4, “Otimização do Registro de Redo InnoDB”.

* `innodb_log_wait_for_flush_spin_cpu_pct_hwm`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-autoinc-lock-mode=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de dica de configuração <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  Define o tempo médio máximo de gravação de log além do qual os threads do usuário não retornam ao estado de espera enquanto aguardam o log redo ser gravado. O valor padrão é de 400 microsegundos.

  Para informações relacionadas, consulte a Seção 10.5.4, “Otimização do Registro de Log InnoDB”.

* `innodb_log_write_ahead_size`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-autoinc_lock_mode=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>2</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr>
</table>

  Define o tamanho do bloco de pré-gravação para o log de refazer, em bytes. Para evitar o "leitura durante a gravação", defina `innodb_log_write_ahead_size` para corresponder ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos. O valor padrão é de 8192 bytes. A leitura durante a gravação ocorre quando os blocos do log de refazer não são completamente cacheados no sistema operacional ou no sistema de arquivos devido a uma incompatibilidade entre o tamanho do bloco de pré-gravação do log de refazer e o tamanho do bloco de cache do sistema operacional ou do sistema de arquivos.

Os valores válidos para `innodb_log_write_ahead_size` são múltiplos do tamanho do bloco do arquivo de log do `InnoDB` (2n). O valor mínimo é o tamanho do bloco do arquivo de log do `InnoDB` (512). A escrita antecipada não ocorre quando o valor mínimo é especificado. O valor máximo é igual ao valor de `innodb_page_size`. Se você especificar um valor para `innodb_log_write_ahead_size` que é maior que o valor de `innodb_page_size`, o ajuste `innodb_log_write_ahead_size` é truncado para o valor de `innodb_page_size`.

Definir o valor de `innodb_log_write_ahead_size` muito baixo em relação ao tamanho do bloco do cache do sistema operacional ou do sistema de arquivos resulta em "leitura na escrita". Definir o valor muito alto pode ter um pequeno impacto no desempenho do `fsync` para escritas de arquivos de log devido a vários blocos sendo escritos de uma vez.

Para informações relacionadas, consulte a Seção 10.5.4, “Otimizando o Registro de Refazimento do InnoDB”.

* `innodb_log_writer_threads`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoinc-lock-mode=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>2</code></td> </tr>
  <tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr>
</table>

  Habilita threads de escritor de log dedicado para escrever registros de log de revisão da memória da memória de buffer para os buffers do sistema e para esvaziar os buffers do sistema para os arquivos de log de revisão. Threads de escritor de log dedicado podem melhorar o desempenho em sistemas de alta concorrência, mas para sistemas de baixa concorrência, desativar threads de escritor de log dedicado proporciona um melhor desempenho.

  Para mais informações, consulte a Seção 10.5.4, “Otimização da Logística de Revisão de Memória do InnoDB”.

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-autoinc-lock-mode=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>2</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr>
</table>

Um valor menor que o padrão geralmente é adequado para a maioria das cargas de trabalho. Um valor muito maior do que o necessário pode afetar o desempenho. Considere apenas aumentar o valor se você tiver capacidade de E/S disponível sob uma carga de trabalho típica. Por outro lado, se uma carga de trabalho intensiva em escrita saturar sua capacidade de E/S, diminua o valor, especialmente no caso de um grande pool de tampões.

Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure o ajuste para cima com o objetivo de raramente ver páginas livres. Além disso, considere ajustar `innodb_lru_scan_depth` ao alterar o número de instâncias do pool de tampões, pois `innodb_lru_scan_depth` * `innodb_buffer_pool_instances` define a quantidade de trabalho realizada pelo fio de limpeza de páginas a cada segundo.

Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o Limpeza de Tampões”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

* `innodb_max_dirty_pages_pct`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode">
  <tr><th>Formato de linha de comando</th> <td><code>--innodb-autoinc-lock-mode=#</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de aplicação do HINT <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>2</code></td> </tr>
  <tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr>
</table>

O `InnoDB` tenta esvaziar os dados do buffer pool para que a porcentagem de páginas sujas não exceda este valor.

A configuração `innodb_max_dirty_pages_pct` estabelece um alvo para a atividade de esvaziamento. Ela não afeta a taxa de esvaziamento. Para obter informações sobre a gestão da taxa de esvaziamento, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do buffer pool”.

Para informações relacionadas, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do buffer pool”. Para conselhos gerais sobre o ajuste de I/O, consulte a Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

* `innodb_max_dirty_pages_pct_lwm`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-autoinc_lock_mode=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  Define um limiar de água baixa que representa a porcentagem de páginas sujas na qual o preflush é habilitado para controlar a proporção de páginas sujas. Um valor de 0 desabilita o comportamento de preflush completamente. O valor configurado deve sempre ser menor que o valor de `innodb_max_dirty_pages_pct`. Para mais informações, consulte a Seção 17.8.3.5, “Configurando o preflush do pool de buffers”.

* `innodb_max_purge_lag`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-autoinc_lock_mode=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  Define o atraso máximo de purga desejado. Se esse valor for excedido, uma demora é imposta nas operações `INSERT`, `UPDATE` e `DELETE` para permitir que a purga alcance o atraso. O valor padrão é 0, o que significa que não há atraso máximo de purga e nenhuma demora.

  Para mais informações, consulte a Seção 17.8.9, “Configuração de purga”.

* `innodb_max_purge_lag_delay`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-autoinc_lock_mode=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  Especifica o atraso máximo em microsegundos para o atraso imposto quando o limite `innodb_max_purge_lag` é excedido. O valor especificado de `innodb_max_purge_lag_delay` é um limite superior para o período de atraso calculado pela fórmula `innodb_max_purge_lag`.

  Para mais informações, consulte a Seção 17.8.9, “Configuração de purga”.

* `innodb_max_undo_log_size`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-autoinc-lock-mode=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>2</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr>
</table>

  Define um tamanho limite para os espaços de tabelas de undo. Se um espaço de tabelas de undo exceder o limite, ele pode ser marcado para truncação quando o `innodb_undo_log_truncate` estiver habilitado. O valor padrão é 1073741824 bytes (1024 MiB).

  Para mais informações, consulte Truncar Espaços de Tabelas de Undo.

* `innodb_merge_threshold_set_all_debug`

<table frame="box" rules="all" summary="Propriedades para innodb_autoinc_lock_mode">
  <tr><th>Formato de Linha de Comando</th> <td><code>--innodb-autoinc-lock-mode=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="innodb-parameters.html#sysvar_innodb_autoinc_lock_mode">innodb_autoinc_lock_mode</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>2</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr>
</table>

  Define um valor percentual de página para páginas de índice que substitui o ajuste atual de `MERGE_THRESHOLD` para todos os índices que estão atualmente na cache do dicionário. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção **CMake** `WITH_DEBUG`. Para informações relacionadas, consulte a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índices”.

* `innodb_monitor_disable`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta variável atua como um interruptor, desativando os contadores de métricas do `InnoDB`. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de métricas do InnoDB INFORMATION_SCHEMA”.

`innodb_monitor_disable='latch'` desativa a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 15.7.7.17, “Instrução SHOW ENGINE”.

* `innodb_monitor_enable`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta variável atua como um interruptor, habilitando os contadores de métricas do `InnoDB`. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de métricas do InnoDB INFORMATION_SCHEMA”.

`innodb_monitor_enable='latch'` habilita a coleta de estatísticas para `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 15.7.7.17, “Instrução SHOW ENGINE”.

* `innodb_monitor_reset`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta variável atua como um interruptor, redefinindo o valor de contagem para os contadores de métricas do `InnoDB` para zero. Os dados dos contadores podem ser consultados usando a tabela do Schema de Informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de métricas do InnoDB INFORMATION_SCHEMA”.

`innodb_monitor_reset='latch'` redefiniu as estatísticas relatadas pelo `SHOW ENGINE INNODB MUTEX`. Para mais informações, consulte a Seção 15.7.7.17, “Instrução SHOW ENGINE”.

* `innodb_monitor_reset_all`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta variável atua como um interruptor, redefinindo todos os valores (mínimo, máximo, etc.) para os contadores de métricas do `InnoDB`. Os dados dos contadores podem ser consultados usando a tabela do esquema de informações `INNODB_METRICS`. Para informações de uso, consulte a Seção 17.15.6, “Tabela de métricas do esquema de informações InnoDB”.

* `innodb_numa_interleave`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Habilita a política de interligação de memória NUMA para a alocação do pool de buffers do `InnoDB`. Quando `innodb_numa_interleave` é habilitado, a política de memória NUMA é definida como `MPOL_INTERLEAVE` para o processo **mysqld**. Após a alocação do pool de buffers do `InnoDB`, a política de memória NUMA é definida de volta como `MPOL_DEFAULT`. Para que a opção `innodb_numa_interleave` esteja disponível, o MySQL deve ser compilado em um sistema Linux com suporte a NUMA. O valor padrão é `ON` se o sistema o suportar, caso contrário, ele é definido como `OFF`.

  O **CMake** define o valor padrão `WITH_NUMA` com base se a plataforma atual tem suporte a `NUMA`. Para mais informações, consulte a Seção 2.8.7, “Opções de configuração de fonte do MySQL”.

* `innodb_old_blocks_pct`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Especifica a porcentagem aproximada do `InnoDB` buffer pool usado para a sublista de blocos antigos. A faixa de valores é de 5 a 95. O valor padrão é 37 (ou seja, 3/8 do pool). Frequentemente usado em combinação com `innodb_old_blocks_time`.

Para mais informações, consulte a Seção 17.8.3.3, “Tornando o varredura do buffer pool resistente”. Para informações sobre a gestão do buffer pool, o algoritmo LRU e as políticas de despejo, consulte a Seção 17.5.1, “Buffer Pool”.

* `innodb_old_blocks_time`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Valores não nulos protegem contra o pool de buffers sendo preenchido por dados que são referenciados apenas por um curto período, como durante uma varredura completa da tabela. Aumentar esse valor oferece mais proteção contra varreduras completas da tabela que interferem com os dados cacheados no pool de buffers.

Especifica por quanto tempo em milissegundos um bloco inserido na sublista antiga deve permanecer lá após seu primeiro acesso antes de poder ser movido para a nova sublista. Se o valor for 0, um bloco inserido na sublista antiga é movido imediatamente para a nova sublista na primeira vez que é acessado, não importa o quão cedo após a inserção o acesso ocorra. Se o valor for maior que 0, os blocos permanecem na sublista antiga até que um acesso ocorra pelo menos tantos milissegundos após o primeiro acesso. Por exemplo, um valor de 1000 faz com que os blocos permaneçam na sublista antiga por 1 segundo após o primeiro acesso antes de se tornarem elegíveis para serem movidos para a nova sublista.

O valor padrão é 1000.

Esta variável é frequentemente usada em combinação com `innodb_old_blocks_pct`. Para mais informações, consulte a Seção 17.8.3.3, “Tornando o Scan do Pool de Armazenamento de Buffer Resistente”. Para informações sobre a gestão do pool de armazenamento de buffer, o algoritmo LRU e as políticas de despejo, consulte a Seção 17.5.1, “Pool de Armazenamento de Buffer”.

* `innodb_online_alter_log_max_size`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Configuração da Hinta <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Hinta de Configuração de Variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Especifica um limite superior em bytes para o tamanho dos arquivos de registro temporários usados durante operações DDL online para tabelas `InnoDB`. Há um arquivo de registro para cada índice sendo criado ou tabela sendo alterada. Esse arquivo de registro armazena dados inseridos, atualizados ou excluídos na tabela durante a operação DDL. O arquivo de registro temporário é estendido conforme necessário pelo valor de `innodb_sort_buffer_size`, até o máximo especificado por `innodb_online_alter_log_max_size`. Se um arquivo de registro temporário exceder o limite de tamanho superior, a operação `ALTER TABLE` falha e todas as operações DML concorrentes não confirmadas são revertidas. Assim, um valor grande para essa opção permite que mais DML ocorra durante uma operação DDL online, mas também estende o período de tempo no final da operação DDL quando a tabela é bloqueada para aplicar os dados do log.

* `innodb_open_files`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Especifica o número máximo de arquivos que o `InnoDB` pode ter abertos de uma só vez. O valor mínimo é 10. Se `innodb_file_per_table` estiver desativado, o valor padrão é 300; caso contrário, o valor padrão é 300 ou o ajuste `table_open_cache`, dependendo do valor maior.

O limite `innodb_open_files` pode ser definido em tempo de execução usando uma instrução `SELECT innodb_set_open_files_limit(N)`, onde *`N`* é o limite desejado de `innodb_open_files`; por exemplo:

```
  mysql> SELECT innodb_set_open_files_limit(1000);
  ```

A instrução executa um procedimento armazenado que define o novo limite. Se o procedimento for bem-sucedido, ele retorna o valor do limite recém-definido; caso contrário, uma mensagem de falha é retornada.

Não é permitido definir `innodb_open_files` usando uma instrução `SET`. Para definir `innodb_open_files` em tempo de execução, use a instrução `SELECT innodb_set_open_files_limit(N)` descrita acima.

Definir `innodb_open_files=default` não é suportado. Apenas valores inteiros são permitidos.

Para evitar que arquivos não gerenciados LRU consumam todo o limite de `innodb_open_files`, arquivos não gerenciados LRU são limitados a 90% desse limite, o que reserva 10% para arquivos gerenciados LRU.

* `innodb_optimize_fulltext_only`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Altera a forma como o `OPTIMIZE TABLE` opera em tabelas `InnoDB`. Destinado a ser habilitado temporariamente, durante operações de manutenção para tabelas `InnoDB` com índices `FULLTEXT`.

Por padrão, o `OPTIMIZE TABLE` reorganiza os dados no índice agrupado da tabela. Quando esta opção é habilitada, o `OPTIMIZE TABLE` ignora a reorganização dos dados da tabela e, em vez disso, processa os dados de token recém-adicionados, excluídos e atualizados para os índices `FULLTEXT` de `InnoDB`. Para mais informações, consulte Otimização de índices de texto completo InnoDB.

* `innodb_page_cleaners`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de threads de limpador de página que limpem páginas sujas das instâncias do pool de buffers. Os threads de limpador de página realizam a limpeza da lista e a limpeza LRU. Quando há vários threads de limpador de página, as tarefas de limpeza de buffers para cada instância do pool de buffers são enviadas para os threads de limpador de página ociosos. O valor padrão de `innodb_page_cleaners` é definido com o mesmo valor que `innodb_buffer_pool_instances`. Se o número especificado de threads de limpador de página exceder o número de instâncias do pool de buffers, então `innodb_page_cleaners` é automaticamente definido com o mesmo valor que `innodb_buffer_pool_instances`.

  Se sua carga de trabalho for mais voltada para I/O de escrita ao limpar páginas sujas das instâncias do pool de buffers para arquivos de dados, e se o hardware do seu sistema tiver capacidade disponível, aumentar o número de threads de limpador de página pode ajudar a melhorar o desempenho do I/O de escrita.

  O suporte a limpadores de página multithread se estende às fases de desligamento e recuperação.

A chamada de sistema `setpriority()` é usada em plataformas Linux onde é suportada e onde o usuário de execução do **mysqld** está autorizado a dar prioridade às threads do `page_cleaner` em relação a outras threads do MySQL e do **InnoDB**, para ajudar a manter o esvaziamento de páginas em ritmo com a carga de trabalho atual. O suporte a `setpriority()` é indicado por esta mensagem de inicialização do **InnoDB**:

  ```
  [Note] InnoDB: If the mysqld execution user is authorized, page cleaner
  thread priority can be changed. See the man page of setpriority().
  ```

  Em sistemas onde o inicialização e o desligamento do servidor não são gerenciados pelo systemd, a autorização do usuário de execução do **mysqld** pode ser configurada em `/etc/security/limits.conf`. Por exemplo, se o **mysqld** for executado com o usuário `mysql`, você pode autorizar o usuário `mysql` adicionando essas linhas em `/etc/security/limits.conf`:

  ```
  mysql              hard    nice       -20
  mysql              soft    nice       -20
  ```

  Em sistemas gerenciados pelo systemd, o mesmo pode ser alcançado especificando `LimitNICE=-20` em um arquivo de configuração localizado do systemd. Por exemplo, crie um arquivo chamado `override.conf` em `/etc/systemd/system/mysqld.service.d/override.conf` e adicione esta entrada:

  ```
  [Service]
  LimitNICE=-20
  ```

  Após criar ou alterar o `override.conf`, recarregue a configuração do systemd e, em seguida, informe ao systemd para reiniciar o serviço MySQL:

  ```
  systemctl daemon-reload
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

  Para obter mais informações sobre o uso de um arquivo de configuração localizado do systemd, consulte Configurando o systemd para MySQL.

  Após autorizar o usuário de execução do **mysqld**, use o comando `cat` para verificar os limites de `Nice` configurados para o processo do **mysqld**:

  ```
  $> cat /proc/mysqld_pid/limits | grep nice
  Max nice priority         18446744073709551596 18446744073709551596
  ```

* `innodb_page_size`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica o tamanho da página para os espaços de tabelas `InnoDB`. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um valor de tamanho de página de 16 kilobytes pode ser especificado como 16384, 16KB ou 16k.

  `innodb_page_size` só pode ser configurado antes de inicializar a instância do MySQL e não pode ser alterado depois. Se nenhum valor for especificado, a instância é inicializada usando o tamanho de página padrão. Veja a Seção 17.8.1, “Configuração de inicialização do InnoDB”.

  Para tamanhos de página de 32KB e 64KB, o comprimento máximo da linha é aproximadamente 16000 bytes. `ROW_FORMAT=COMPRESSED` não é suportado quando `innodb_page_size` é definido para 32KB ou 64KB. Para `innodb_page_size=32KB`, o tamanho do intervalo é de 2MB. Para `innodb_page_size=64KB`, o tamanho do intervalo é de 4MB. `innodb_log_buffer_size` deve ser definido para pelo menos 16MB (o padrão é 64MB) ao usar tamanhos de página de 32KB ou 64KB.

O tamanho padrão de página de 16 KB ou maior é apropriado para uma ampla gama de cargas de trabalho, especialmente para consultas que envolvem varreduras de tabelas e operações de manipulação de dados de massa (DML) que envolvem atualizações em massa. Tamanhos de página menores podem ser mais eficientes para cargas de trabalho OLTP que envolvem muitos pequenos registros, onde a concorrência pode ser um problema quando páginas únicas contêm muitas linhas. Páginas menores também podem ser eficientes com dispositivos de armazenamento SSD, que geralmente usam tamanhos de bloco pequenos. Manter o tamanho da página do `InnoDB` próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

O tamanho mínimo do arquivo para o primeiro arquivo de dados do espaço de tabelas do sistema (`ibdata1`) difere dependendo do valor de `innodb_page_size`. Consulte a descrição da opção `innodb_data_file_path` para obter mais informações.

Uma instância do MySQL que usa um tamanho de página `InnoDB` específico não pode usar arquivos de dados ou arquivos de log de uma instância que usa um tamanho de página diferente.

Para obter conselhos gerais sobre o ajuste de I/O, consulte a Seção 10.5.8, “Otimizando o I/O de Disco do InnoDB”.

* `innodb_parallel_read_threads`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Define o número de threads que podem ser usados para leituras paralelas de índices agrupados. O varredura paralela de partições também é suportado. Os threads de leitura paralelos podem melhorar o desempenho da consulta `CHECK TABLE`. O `InnoDB` lê o índice agrupado duas vezes durante uma operação `CHECK TABLE`. A segunda leitura pode ser realizada em paralelo. Este recurso não se aplica às varreduras de índices secundários. A variável de sessão `innodb_parallel_read_threads` deve ser definida para um valor maior que 1 para que as leituras paralelas de índices agrupados ocorram. O número real de threads usados para realizar uma leitura paralela de índice agrupado é determinado pelo ajuste `innodb_parallel_read_threads` ou pelo número de subárvores de índice a serem varridas, o que for menor. As páginas lidas no pool de buffer durante a varredura são mantidas na extremidade da lista LRU do pool de buffer para que possam ser descartadas rapidamente quando páginas do pool de buffer estão livres.

O número máximo de threads de leitura paralelas (256) é o número total de threads para todas as conexões de cliente. Se o limite de threads for atingido, as conexões retornam a usar um único thread. O valor padrão é calculado pelo número de processadores lógicos disponíveis no sistema dividido por 8, com um valor padrão mínimo de 4.

Antes do MySQL 8.4, o valor padrão era sempre 4.

* `innodb_print_all_deadlocks`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Quando esta opção é habilitada, as informações sobre todos os bloqueios em transações do usuário do `InnoDB` são registradas no log de erro do `mysqld`. Caso contrário, você verá informações apenas sobre o último bloqueio, usando a instrução `SHOW ENGINE INNODB STATUS`. Um bloqueio ocasional no `InnoDB` não é necessariamente um problema, porque o `InnoDB` detecta a condição imediatamente e desfaz uma das transações automaticamente. Você pode usar esta opção para solucionar o motivo pelo qual os bloqueios estão ocorrendo se um aplicativo não tiver a lógica apropriada de tratamento de erros para detectar o desfazimento e tentar novamente sua operação. Um grande número de bloqueios pode indicar a necessidade de reestruturar transações que emitem instruções DML ou `SELECT ... FOR UPDATE` para múltiplas tabelas, para que cada transação acesse as tabelas na mesma ordem, evitando assim a condição de bloqueio.

  Para informações relacionadas, consulte a Seção 17.7.5, “Bloqueios no InnoDB”.

* `innodb_print_ddl_logs`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Ao habilitar essa opção, o MySQL começa a gravar logs de DDL no `stderr`. Para mais informações, consulte Visualizando logs de DDL.

* `innodb_purge_batch_size`

  <table frame="box" rules="all" summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Define o número de páginas do log de desfazer que são limpas e processadas em um único lote da lista de histórico. Em uma configuração de limpeza multisserial, o fio de limpeza do coordenador divide `innodb_purge_batch_size` por `innodb_purge_threads` e atribui esse número de páginas a cada fio de limpeza. A variável `innodb_purge_batch_size` também define o número de páginas do log de desfazer que são liberadas após cada 128 iterações pelos logs de desfazer.

A opção `innodb_purge_batch_size` é destinada ao ajuste avançado do desempenho em combinação com a configuração `innodb_purge_threads`. A maioria dos usuários não precisa alterar `innodb_purge_batch_size` do seu valor padrão.

Para informações relacionadas, consulte a Seção 17.8.9, “Configuração de Limpeza”.

* `innodb_purge_threads`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de threads de segundo plano dedicados à operação de limpeza do `InnoDB`. Aumentar o valor cria threads de limpeza adicionais, o que pode melhorar a eficiência em sistemas onde operações DML são realizadas em múltiplas tabelas.

  Para informações relacionadas, consulte a Seção 17.8.9, “Configuração de Limpeza”.

* `innodb_purge_rseg_truncate_frequency`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define a frequência com que o sistema de purga libera segmentos de rollback em termos do número de vezes que a purga é invocada. Um espaço de tabelas de desfazer não pode ser truncado até que seus segmentos de rollback sejam liberados. Normalmente, o sistema de purga libera segmentos de rollback uma vez a cada 128 vezes que a purga é invocada. O valor padrão é 128. Reduzir esse valor aumenta a frequência com que o thread de purga libera segmentos de rollback.

  `innodb_purge_rseg_truncate_frequency` é destinado para uso com `innodb_undo_log_truncate`. Para mais informações, consulte Truncar Espaços de Tabelas de Desfazer.

* `innodb_random_read_ahead`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Habilita a técnica de leitura prévia aleatória para otimizar o I/O do `InnoDB`.

Para obter detalhes sobre as considerações de desempenho para diferentes tipos de solicitações de leitura prévia, consulte a Seção 17.8.3.4, “Configurando a pré-visualização do pool de buffers do InnoDB (Leitura Prévia”). Para conselhos gerais sobre o ajuste do I/O, consulte a Seção 10.5.8, “Otimizando o I/O de disco do InnoDB”.

* `innodb_read_ahead_threshold`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Controla a sensibilidade do pré-visualização linear que o `InnoDB` usa para pré-carregar páginas no pool de buffer. Se o `InnoDB` ler pelo menos `innodb_read_ahead_threshold` páginas sequencialmente de um intervalo (64 páginas), ele inicia uma leitura assíncrona para todo o intervalo seguinte. A faixa de valores permitida é de 0 a 64. Um valor de 0 desativa a pré-visualização. Para o valor padrão de 56, o `InnoDB` deve ler pelo menos 56 páginas sequencialmente de um intervalo para iniciar uma leitura assíncrona para o intervalo seguinte.

Saber quantos páginas são lidas pelo mecanismo de leitura antecipada e quantas dessas páginas são expulsas do pool de buffer sem nunca serem acessadas pode ser útil ao ajustar o ajuste `innodb_read_ahead_threshold`. A saída `SHOW ENGINE INNODB STATUS` exibe informações de contador das variáveis de status globais `Innodb_buffer_pool_read_ahead` e `Innodb_buffer_pool_read_ahead_evicted`, que relatam o número de páginas trazidas para o pool de buffer por solicitações de leitura antecipada e o número de páginas expulsas do pool de buffer sem nunca serem acessadas, respectivamente. As variáveis de status relatam valores globais desde a última reinicialização do servidor.

`SHOW ENGINE INNODB STATUS` também mostra a taxa na qual as páginas de leitura antecipada são lidas e a taxa na qual essas páginas são expulsas sem serem acessadas. As médias por segundo são baseadas nas estatísticas coletadas desde a última invocação de `SHOW ENGINE INNODB STATUS` e são exibidas na seção `POOL DE BUFFER E MEMÓRIA` da saída `SHOW ENGINE INNODB STATUS`.

Para mais informações, consulte a Seção 17.8.3.4, “Configurando a Pré-visualização do Pool de Buffer InnoDB (Leitura Antecipada”)”). Para conselhos gerais sobre o ajuste de I/O, consulte a Seção 10.5.8, “Otimizando o I/O de Disco InnoDB”.

* `innodb_read_io_threads`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de threads de E/S para operações de leitura no `InnoDB`. Sua contraparte para threads de escrita é `innodb_write_io_threads`. Para mais informações, consulte a Seção 17.8.5, “Configurando o Número de Threads de E/S InnoDB em Segundo Plano”. Para conselhos gerais sobre o ajuste do E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”. O valor padrão é o número de processadores lógicos disponíveis no sistema dividido por 2, com um valor padrão mínimo de 4.

  Antes do MySQL 8.4, o valor padrão era sempre 4.

  Nota

  Em sistemas Linux, executar múltiplos servidores MySQL (tipicamente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e o ajuste `aio-max-nr` do Linux pode exceder os limites do sistema. Idealmente, aumente o ajuste `aio-max-nr`; como solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis do MySQL.

* `innodb_read_only`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Começa o `InnoDB` no modo de leitura somente. Para distribuir aplicações de banco de dados ou conjuntos de dados em mídia de leitura somente. Também pode ser usado em data warehouses para compartilhar o mesmo diretório de dados entre múltiplas instâncias. Para mais informações, consulte a Seção 17.8.2, “Configurando o InnoDB para operação de leitura somente”.

Ativação de `innodb_read_only` impede a criação e remoção de tabelas para todos os motores de armazenamento, e não apenas o `InnoDB`. As operações de criação e remoção de tabelas para qualquer motor de armazenamento modificam as tabelas do dicionário de dados na base de dados do sistema `mysql`, mas essas tabelas usam o motor de armazenamento `InnoDB` e não podem ser modificadas quando `innodb_read_only` está habilitado. O mesmo princípio se aplica a outras operações de tabela que requerem a modificação de tabelas do dicionário de dados. Exemplos:

+ Se a variável de sistema `innodb_read_only` estiver habilitada, a operação `ANALYZE TABLE` pode falhar porque não consegue atualizar as tabelas de estatísticas no dicionário de dados, que usam `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, o erro pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

+ `ALTER TABLE tbl_name ENGINE=engine_name` falha porque atualiza a designação do motor de armazenamento, que é armazenada no dicionário de dados.

Além disso, outras tabelas no banco de dados `mysql` usam o motor de armazenamento `InnoDB`. Tornar essas tabelas apenas de leitura resulta em restrições em operações que as modificam. Exemplos:

+ Declarações de gerenciamento de contas, como `CREATE USER` e `GRANT`, falham porque as tabelas de concessão usam `InnoDB`.

+ As declarações de gerenciamento de plugins `INSTALL PLUGIN` e `UNINSTALL PLUGIN` falham porque a tabela de sistema `mysql.plugin` usa `InnoDB`.

+ As declarações de gerenciamento de funções carregáveis `CREATE FUNCTION` e `DROP FUNCTION` falham porque a tabela de sistema `mysql.func` usa `InnoDB`.

* `innodb_redo_log_archive_dirs`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Define diretórios com rótulos onde os arquivos de arquivo de log de reverso podem ser criados. Você pode definir vários diretórios com rótulos em uma lista separada por ponto e vírgula. Por exemplo:

```
  innodb_redo_log_archive_dirs='label1:/backups1;label2:/backups2'
  ```

Uma etiqueta pode ser qualquer string de caracteres, com exceção de colchetes (:), que não são permitidos. Uma etiqueta vazia também é permitida, mas o colon (:) ainda é necessário nesse caso.

Um caminho deve ser especificado, e o diretório deve existir. O caminho pode conter colchetes (''), mas ponto e vírgula (;) não são permitidos.

* `innodb_redo_log_capacity`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define a quantidade de espaço em disco ocupada pelos arquivos de log de refazer.

  A variável de estado `Innodb_redo_log_capacity_resized` indica a capacidade total do log de refazer para todos os arquivos de log de refazer.

  Se o servidor for iniciado com `--innodb-dedicated-server`, o valor de `innodb_redo_log_capacity` é definido automaticamente, se não for explicitamente definido. Para obter mais informações, consulte a Seção 17.8.13, “Habilitar configuração automática do InnoDB para um servidor MySQL dedicado”.

  Para mais informações, consulte a Seção 17.6.5, “Log de refazer”.

* `innodb_redo_log_encrypt`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado ao InnoDB"><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis" target="_blank"><code>SET_VAR</code></a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></table>

Controla a criptografia dos dados do log de revisão para tabelas criptografadas usando a funcionalidade de criptografia de dados em repouso do `InnoDB`. A criptografia dos dados do log de revisão é desativada por padrão. Para mais informações, consulte Criptografia do Log de Revisão.

* `innodb_replication_delay`

O atraso do fio de replicação em milissegundos em um servidor dedicado a `innodb`. Se o `innodb_thread_concurrency` for atingido.

* `innodb_rollback_on_timeout`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado a `innodb`"><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></table>

  O `InnoDB` reverte apenas a última instrução de uma transação no limite de tempo de espera por padrão. Se `--innodb-rollback-on-timeout` for especificado, um limite de tempo de espera do `InnoDB` faz com que o `InnoDB` abordem e reverta toda a transação.

  Para mais informações, consulte a Seção 17.20.5, “Tratamento de Erros do `InnoDB`”.

* `innodb_rollback_segments`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

`innodb_rollback_segments` define o número de segmentos de rollback alocados para cada espaço de tabelas undo e para o espaço de tabelas temporárias global para transações que geram registros de undo. O número de transações que cada segmento de rollback suporta depende do tamanho da página do `InnoDB` e do número de logs de undo atribuídos a cada transação. Para mais informações, consulte a Seção 17.6.6, “Logs de undo”.

Para informações relacionadas, consulte a Seção 17.3, “Multiversão do InnoDB”. Para informações sobre espaços de tabelas undo, consulte a Seção 17.6.3.4, “Espaços de tabelas undo”.

* `innodb_saved_page_number_debug`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Salva um número de página. Ao definir a opção `innodb_fil_make_page_dirty_debug`, a página definida por `innodb_saved_page_number_debug` é suja. A opção `innodb_saved_page_number_debug` só está disponível se o suporte de depuração estiver compilado com a opção **CMake** `WITH_DEBUG`.

* `innodb_segment_reserve_factor`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Define a porcentagem de páginas do segmento do espaço de tabela reservadas como páginas vazias. O ajuste é aplicável a espaços de tabela por arquivo e espaços de tabela gerais. O ajuste padrão de `innodb_segment_reserve_factor` é de 12,5%, que é a mesma porcentagem de páginas reservadas em versões anteriores do MySQL.

Para obter mais informações, consulte Configurando a porcentagem de páginas do segmento de arquivo reservadas.

* `innodb_sort_buffer_size`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta variável define a quantidade pela qual o arquivo de log temporário é estendido ao registrar DML concorrente durante uma operação de DDL online, e o tamanho do buffer de leitura e do buffer de escrita do arquivo de log temporário.

Para mais informações, consulte a Seção 17.12.3, “Requisitos de espaço para DDL online”.

* `innodb_spin_wait_delay`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

O atraso máximo entre as pesquisas para um bloqueio de rotação. A implementação de nível baixo deste mecanismo varia dependendo da combinação de hardware e sistema operacional, portanto, o atraso não corresponde a um intervalo de tempo fixo.

Pode ser usado em combinação com a variável `innodb_spin_wait_pause_multiplier` para maior controle sobre a duração dos atrasos nas pesquisas de bloqueio de rotação.

Para mais informações, consulte a Seção 17.8.8, “Configurando a Pesquisa de Bloqueio de Rotação”.

* `innodb_spin_wait_pause_multiplier`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define um valor de multiplicador usado para determinar o número de instruções PAUSE em loops de espera de rotação que ocorrem quando um thread espera para adquirir um mutex ou bloqueio de leitura/escrita.

  Para mais informações, consulte a Seção 17.8.8, “Configurando a Pesquisa de Bloqueio de Rotação”.

* `innodb_stats_auto_recalc`

Faz com que o `InnoDB` recalcule automaticamente as estatísticas persistentes após as alterações substanciais dos dados em uma tabela. O valor limite é de 10% das linhas da tabela. Esta configuração aplica-se a tabelas criadas quando a opção `innodb_stats_persistent` está habilitada. A recálculo automático das estatísticas também pode ser configurado especificando `STATS_AUTO_RECALC=1` em uma instrução `CREATE TABLE` ou `ALTER TABLE`. A quantidade de dados amostrados para produzir as estatísticas é controlada pela variável `innodb_stats_persistent_sample_pages`.

Para obter mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Pessoais”.

* `innodb_stats_include_delete_marked`

<table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Por padrão, o `InnoDB` lê dados não confirmados ao calcular estatísticas. No caso de uma transação não confirmada que exclui linhas de uma tabela, o `InnoDB` exclui registros marcados para exclusão ao calcular estimativas de linhas e estatísticas de índices, o que pode levar a planos de execução não ótimos para outras transações que operam na tabela simultaneamente usando um nível de isolamento de transação diferente de `READ UNCOMMITTED`. Para evitar esse cenário, o `innodb_stats_include_delete_marked` pode ser habilitado para garantir que o `InnoDB` inclua registros marcados para exclusão ao calcular estatísticas do otimizador persistentes.

Quando o `innodb_stats_include_delete_marked` está habilitado, o `ANALYZE TABLE` considera registros marcados para exclusão ao recalcular as estatísticas.

`innodb_stats_include_delete_marked` é um ajuste global que afeta todas as tabelas `InnoDB`. É aplicável apenas a estatísticas do otimizador persistentes.

Para informações relacionadas, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

* `innodb_stats_method`

<table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Como o servidor trata os valores `NULL` ao coletar estatísticas sobre a distribuição dos valores de índice para tabelas `InnoDB`. Os valores permitidos são `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores `NULL` são considerados iguais e formam um único grupo de valor com um tamanho igual ao número de valores `NULL`. Para `nulls_unequal`, os valores `NULL` são considerados desiguais, e cada `NULL` forma um grupo de valor distinto de tamanho

1. Para `nulls_ignored`, os valores `NULL` são ignorados.

O método usado para gerar estatísticas de tabela influencia como o otimizador escolhe índices para a execução de consultas, conforme descrito na Seção 10.3.8, “Coleta de Estatísticas de Índices de InnoDB e MyISAM”.

* `innodb_stats_on_metadata`

  <table frame="box" rules="all" summary="Propriedades para servidor dedicado a InnoDB"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta opção só se aplica quando as estatísticas do otimizador estão configuradas para não serem persistentes. As estatísticas do otimizador não são armazenadas em disco quando o `innodb_stats_persistent` está desativado ou quando tabelas individuais são criadas ou alteradas com `STATS_PERSISTENT=0`. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas do Otimizador Não Persistentes”.

Quando o `innodb_stats_on_metadata` está habilitado, o `InnoDB` atualiza as estatísticas não persistentes quando instruções de metadados, como `SHOW TABLE STATUS` ou quando acessa as tabelas do Schema `TABLES` ou `STATISTICS` (Information Schema). (Essas atualizações são semelhantes ao que acontece com `ANALYZE TABLE`.) Quando desativado, o `InnoDB` não atualiza as estatísticas durante essas operações. Deixar a configuração desativada pode melhorar a velocidade de acesso para esquemas que têm um grande número de tabelas ou índices. Também pode melhorar a estabilidade dos planos de execução para consultas que envolvem tabelas `InnoDB`.

Para alterar a configuração, execute a instrução `SET GLOBAL innodb_stats_on_metadata=mode`, onde `mode` é `ON` ou `OFF` (ou `1` ou `0`). Alterar a configuração requer privilégios suficientes para definir variáveis de sistema globais (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta imediatamente o funcionamento de todas as conexões.

* `innodb_stats_persistent`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Especifica se as estatísticas de índices do InnoDB são persistidas no disco. Caso contrário, as estatísticas podem ser recalculadas frequentemente, o que pode levar a variações nos planos de execução das consultas. Esta configuração é armazenada com cada tabela quando a tabela é criada. Você pode definir `innodb_stats_persistent` no nível global antes de criar uma tabela ou usar a cláusula `STATS_PERSISTENT` das instruções `CREATE TABLE` e `ALTER TABLE` para sobrescrever a configuração de nível global e configurar estatísticas persistentes para tabelas individuais.

Para obter mais informações, consulte a Seção 17.8.10.1, “Configurando parâmetros de estatísticas de otimizador persistentes”.

* `innodb_stats_persistent_sample_pages`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o plano de execução da consulta, em detrimento do aumento do I/O durante a execução de `ANALYZE TABLE` para uma tabela `InnoDB`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

  Nota

  Definir um valor alto para `innodb_stats_persistent_sample_pages` pode resultar em um tempo de execução prolongado para `ANALYZE TABLE`. Para estimar o número de páginas do banco de dados acessadas por `ANALYZE TABLE`, consulte a Seção 17.8.10.3, “Estimativa da Complexidade de ANALYZE TABLE para Tabelas InnoDB”.

  `innodb_stats_persistent_sample_pages` só se aplica quando `innodb_stats_persistent` está habilitado para uma tabela; quando `innodb_stats_persistent` está desabilitado, `innodb_stats_transient_sample_pages` se aplica.

* `innodb_stats_transient_sample_pages`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. O valor padrão é 8. Aumentar o valor melhora a precisão das estatísticas do índice, o que pode melhorar o plano de execução da consulta, em detrimento do aumento do I/O ao abrir uma tabela `InnoDB` ou recalcular as estatísticas. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistentes”.

Nota

Definir um valor alto para `innodb_stats_transient_sample_pages` pode resultar em um tempo de execução prolongado do `ANALYZE TABLE`. Para estimar o número de páginas do banco de dados acessadas pelo `ANALYZE TABLE`, consulte a Seção 17.8.10.3, “Estimativa da Complexidade do ANALYZE TABLE para Tabelas InnoDB”.

`innodb_stats_transient_sample_pages` só se aplica quando `innodb_stats_persistent` está desativado para uma tabela; quando `innodb_stats_persistent` está ativado, `innodb_stats_persistent_sample_pages` se aplica em vez disso. Toma o lugar de `innodb_stats_sample_pages` que foi removido no MySQL 8.0. Para mais informações, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistentes”.

* `innodb_status_output`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado `innodb`"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Habilita ou desabilita a saída periódica para o monitor padrão `InnoDB`. Também é usado em combinação com `innodb_status_output_locks` para habilitar ou desabilitar a saída periódica para o Monitor de Bloqueio `InnoDB`. Para mais informações, consulte a Seção 17.17.2, “Habilitando Monitores `InnoDB’”.

* `innodb_status_output_locks`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

* `innodb_strict_mode`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Quando o `innodb_strict_mode` é habilitado, o `InnoDB` retorna erros em vez de avisos ao verificar opções de tabela inválidas ou incompatíveis.

Ele verifica se as opções `KEY_BLOCK_SIZE`, `ROW_FORMAT`, `DATA DIRECTORY`, `TEMPORARY` e `TABLESPACE` são compatíveis entre si e com outras configurações.

`innodb_strict_mode=ON` também habilita uma verificação de tamanho de linha ao criar ou alterar uma tabela, para evitar que a operação `INSERT` ou `UPDATE` falhe devido ao registro ser muito grande para o tamanho de página selecionado.

Você pode habilitar ou desabilitar `innodb_strict_mode` na linha de comando ao iniciar o `mysqld`, ou em um arquivo de configuração do MySQL. Você também pode habilitar ou desabilitar `innodb_strict_mode` em tempo de execução com a instrução `SET [GLOBAL|SESSION] innodb_strict_mode=mode`, onde `mode` é `ON` ou `OFF`. Alterar o ajuste `GLOBAL` requer privilégios suficientes para definir variáveis de sistema globais (veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) e afeta o funcionamento de todos os clientes que se conectam posteriormente. Qualquer cliente pode alterar o ajuste `SESSION` para `innodb_strict_mode`, e o ajuste afeta apenas esse cliente.

Definir o valor da variável de sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

* `innodb_sync_array_size`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Definição de Variável"><code>SET_VAR</a></code></a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Define o tamanho da matriz de espera do mutex/bloqueio. Aumentar o valor divide a estrutura de dados interna usada para coordenar os threads, para maior concorrência em cargas de trabalho com um grande número de threads em espera. Este ajuste deve ser configurado quando a instância do MySQL está sendo iniciada e não pode ser alterado posteriormente. O aumento do valor é recomendado para cargas de trabalho que frequentemente produzem um grande número de threads em espera, tipicamente maior que 768.

* `innodb_sync_spin_loops`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de vezes que um thread espera por um mutex `InnoDB` ser liberado antes de ser suspenso.

* `innodb_sync_debug`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></table>

Habilita a verificação de depuração de sincronização para o mecanismo de armazenamento `InnoDB`. Esta opção só está disponível se o suporte de depuração for compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_table_locks`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></table>

Se `autocommit = 0`, o `InnoDB` respeita `LOCK TABLES`; o MySQL não retorna do `LOCK TABLES ... WRITE` até que todos os outros threads tenham liberado todos os seus bloqueios para a tabela. O valor padrão de `innodb_table_locks` é 1, o que significa que `LOCK TABLES` faz com que o InnoDB bloqueie uma tabela internamente se `autocommit = 0`.

`innodb_table_locks = 0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Tem efeito para tabelas bloqueadas para leitura ou escrita por `LOCK TABLES ... WRITE` implicitamente (por exemplo, por meio de gatilhos) ou por `LOCK TABLES ... READ`.

Para informações relacionadas, consulte a Seção 17.7, “Modelo de Bloqueio e Transação do InnoDB”.

* `innodb_temp_data_file_path`

<table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</code></a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define o caminho relativo, nome, tamanho e atributos dos arquivos de dados do espaço de tabelas temporárias globais. O espaço de tabelas temporárias globais armazena segmentos de rollback para alterações feitas em tabelas temporárias criadas pelo usuário.

Se não for especificado nenhum valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um único arquivo de dados auto-extensível chamado `ibtmp1` no diretório `innodb_data_home_dir`. O tamanho inicial do arquivo é ligeiramente maior que 12 MB.

A sintaxe para a especificação de um arquivo de dados de um espaço de tabelas temporárias global inclui o nome do arquivo, o tamanho do arquivo e os atributos `autoextend` e `max`:

```
  file_name:file_size[:autoextend[:max:max_file_size]]
  ```

O arquivo de dados do espaço de tabelas temporárias global não pode ter o mesmo nome que outro arquivo de dados `InnoDB`. Qualquer incapacidade ou erro ao criar o arquivo de dados do espaço de tabelas temporárias global é tratado como fatal e o inicialização do servidor é recusada.

Os tamanhos dos arquivos são especificados em KB, MB ou GB, anexando `K`, `M` ou `G` ao valor do tamanho. A soma dos tamanhos dos arquivos deve ser ligeiramente maior que 12 MB.

O limite de tamanho dos arquivos individuais é determinado pelo sistema operacional. O tamanho do arquivo pode ser maior que 4 GB em sistemas operacionais que suportam arquivos grandes. O uso de partições de disco bruto para arquivos de dados de espaço de tabelas temporárias globais não é suportado.

Os atributos `autoextend` e `max` podem ser usados apenas para o arquivo de dados especificado na última posição na configuração `innodb_temp_data_file_path`. Por exemplo:

```
  [mysqld]
  innodb_temp_data_file_path=ibtmp1:50M;ibtmp2:12M:autoextend:max:500M
  ```

A opção `autoextend` faz com que o arquivo de dados aumente automaticamente de tamanho quando ele fica sem espaço livre. O incremento `autoextend` é de 64 MB por padrão. Para modificar o incremento, altere a configuração da variável `innodb_autoextend_increment`.

O caminho do diretório para arquivos de dados de espaço de tabelas temporárias globais é formado concatenando os caminhos definidos por `innodb_data_home_dir` e `innodb_temp_data_file_path`.

Antes de executar o `InnoDB` no modo de leitura apenas, defina `innodb_temp_data_file_path` para uma localização fora do diretório de dados. O caminho deve ser relativo ao diretório de dados. Por exemplo:

Para obter mais informações, consulte Espaços de Tabela Temporários Dedicados ao InnoDB.

* `innodb_temp_tablespaces_dir`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Configuração de Variável <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></th> <td>Não Aplica</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define a localização onde o `InnoDB` cria um conjunto de espaços de tabela temporários para sessões ao iniciar. O local padrão é o diretório `#innodb_temp` no diretório de dados. É permitido um caminho completo ou relativo ao diretório de dados.

  Os espaços de tabela temporários para sessões armazenam sempre tabelas temporárias criadas pelo usuário e tabelas temporárias internas criadas pelo otimizador usando o `InnoDB`. (Anteriormente, o motor de armazenamento em disco para tabelas temporárias internas era determinado pela variável de sistema `internal_tmp_disk_storage_engine`, que não é mais suportada. Consulte Motor de Armazenamento para Tabelas Temporárias Internas em Disco.)

  Para obter mais informações, consulte Espaços de Tabela Temporários para Sessões.

* `innodb_thread_concurrency`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado `innodb`"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define o número máximo de threads permitido dentro do `InnoDB`. Um valor de 0 (o padrão) é interpretado como concorrência infinita (sem limite). Esta variável é destinada ao ajuste de desempenho em sistemas de alta concorrência.

  O `InnoDB` tenta manter o número de threads dentro do `InnoDB` menor ou igual ao limite de `innodb_thread_concurrency`. Os threads aguardando por bloqueios não são contados no número de threads executados simultaneamente.

  A configuração correta depende do volume de trabalho e do ambiente de computação. Considere configurar esta variável se sua instância do MySQL compartilhar recursos de CPU com outras aplicações ou se seu volume de trabalho ou número de usuários simultâneos estiver crescendo. Teste uma gama de valores para determinar a configuração que oferece o melhor desempenho. `innodb_thread_concurrency` é uma variável dinâmica, o que permite experimentar com diferentes configurações em um sistema de teste em tempo real. Se uma configuração específica tiver um desempenho ruim, você pode rapidamente configurar `innodb_thread_concurrency` de volta para 0.

Use as seguintes diretrizes para ajudar a encontrar e manter um ambiente apropriado:

+ Se o número de threads de usuário concorrentes para uma carga de trabalho for consistentemente pequeno e não afetar o desempenho, defina `innodb_thread_concurrency=0` (sem limite).

+ Se sua carga de trabalho for consistentemente pesada ou ocasionalmente aumentar, defina um valor de `innodb_thread_concurrency` e ajuste até encontrar o número de threads que proporciona o melhor desempenho. Por exemplo, suponha que seu sistema tenha tipicamente de 40 a 50 usuários, mas periodicamente o número aumenta para 60, 70 ou mais. Por meio de testes, você descobre que o desempenho permanece amplamente estável com um limite de 80 usuários concorrentes. Neste caso, defina `innodb_thread_concurrency` para 80.

+ Se você não quiser que o `InnoDB` use mais de um certo número de CPUs virtuais para threads de usuário (20 CPUs virtuais, por exemplo), defina `innodb_thread_concurrency` para esse número (ou possivelmente menor, dependendo dos testes de desempenho). Se o seu objetivo é isolar o MySQL de outras aplicações, considere vincular o processo `mysqld` exclusivamente às CPUs virtuais. No entanto, esteja ciente de que a vinculação exclusiva pode resultar em uso de hardware não ótimo se o processo `mysqld` não estiver consistentemente ocupado. Neste caso, você pode vincular o processo `mysqld` às CPUs virtuais, mas permitir que outras aplicações usem algumas ou todas as CPUs virtuais.

Observação

Do ponto de vista do sistema operacional, usar uma solução de gerenciamento de recursos para gerenciar como o tempo do CPU é compartilhado entre as aplicações pode ser preferível a vincular o processo `mysqld`. Por exemplo, você poderia atribuir 90% do tempo de CPU virtual a uma determinada aplicação enquanto outros processos críticos *não* estão em execução, e escalar esse valor de volta para 40% quando outros processos críticos *estão* em execução.

+ Em alguns casos, o ajuste ótimo de `innodb_thread_concurrency` pode ser menor que o número de CPUs virtuais.

+ Um valor de `innodb_thread_concurrency` muito alto pode causar uma regressão de desempenho devido ao aumento da concorrência nos recursos internos do sistema.

+ Monitore e analise seu sistema regularmente. Alterações na carga de trabalho, no número de usuários ou no ambiente de computação podem exigir que você ajuste o ajuste de `innodb_thread_concurrency`.

+ Um valor de 0 desativa os contadores `consultas dentro do InnoDB` e `consultas na fila` na seção `OPERACOES DE LINHAS` do resultado `SHOW ENGINE INNODB STATUS`.

+ Para informações relacionadas, consulte a Seção 17.8.4, “Configurando Concorrência de Fios para InnoDB”.

* `innodb_thread_sleep_delay`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Quanto tempo as threads do `InnoDB` permanecem em espera antes de se juntarem à fila do `InnoDB`, em microsegundos. O valor padrão é 10000. Um valor de 0 desativa a espera. Você pode definir `innodb_adaptive_max_sleep_delay` para o maior valor que você permitiria para `innodb_thread_sleep_delay`, e o `InnoDB` ajusta automaticamente `innodb_thread_sleep_delay` para cima ou para baixo, dependendo da atividade atual de escalonamento de threads. Esse ajuste dinâmico ajuda o mecanismo de escalonamento de threads a funcionar de forma suave durante momentos em que o sistema está levemente carregado ou quando está operando próximo da capacidade máxima.

Para mais informações, consulte a Seção 17.8.4, “Configurando Concorrência de Threads para InnoDB”.

* `innodb_tmpdir`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Usado para definir um diretório alternativo para arquivos de classificação temporários criados durante operações `ALTER TABLE` online que reconstroem a tabela.

  Operações `ALTER TABLE` online que reconstroem a tabela também criam um arquivo de *intermediário* na mesma pasta da tabela original. A opção `innodb_tmpdir` não é aplicável a arquivos de tabela intermediários.

Um valor válido é qualquer caminho de diretório, exceto o caminho do diretório de dados do MySQL. Se o valor for NULL (o padrão), os arquivos temporários são criados no diretório temporário do MySQL (`$TMPDIR` no Unix, `%TEMP%` no Windows ou o diretório especificado pela opção de configuração `--tmpdir`). Se um diretório for especificado, a existência do diretório e as permissões são verificadas apenas quando o `innodb_tmpdir` é configurado usando uma instrução `SET`. Se um sintoma for fornecido em uma string de diretório, o sintoma é resolvido e armazenado como um caminho absoluto. O caminho não deve exceder 512 bytes. Uma operação `ALTER TABLE` online relata um erro se o `innodb_tmpdir` for definido como um diretório inválido. O `innodb_tmpdir` substitui a configuração `tmpdir` do MySQL, mas apenas para operações `ALTER TABLE` online.

O privilégio `FILE` é necessário para configurar o `innodb_tmpdir`.

A opção `innodb_tmpdir` foi introduzida para ajudar a evitar o esvaziamento de um diretório de arquivo temporário localizado em um sistema de arquivos `tmpfs`. Tais esvaziamentos poderiam ocorrer como resultado de grandes arquivos de classificação temporários criados durante operações `ALTER TABLE` online que reconstruem a tabela.

Em ambientes de replicação, considere apenas replicar a configuração `innodb_tmpdir` se todos os servidores tiverem o mesmo ambiente de sistema operacional. Caso contrário, replicar a configuração `innodb_tmpdir` pode resultar em uma falha de replicação ao executar operações `ALTER TABLE` online que reconstruem a tabela. Se os ambientes operacionais dos servidores forem diferentes, recomenda-se que você configure o `innodb_tmpdir` em cada servidor individualmente.

Para mais informações, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”. Para informações sobre operações `ALTER TABLE` online, consulte a Seção 17.12, “InnoDB e DDL Online”.

* `innodb_trx_purge_view_update_only_debug`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Pausa a limpeza de registros marcados para exclusão enquanto permite que a visualização de limpeza seja atualizada. Esta opção cria artificialmente uma situação em que a visualização de limpeza é atualizada, mas as purges ainda não foram realizadas. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção `WITH_DEBUG` do **CMake**.

* `innodb_trx_rseg_n_slots_debug`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define uma bandeira de depuração que limita `TRX_RSEG_N_SLOTS` a um valor específico para a função `trx_rsegf_undo_find_free` que procura por slots livres para segmentos do log de desfazer. Esta opção só está disponível se o suporte de depuração estiver compilado usando a opção **CMake** `WITH_DEBUG`.

* `innodb_undo_directory`

O caminho onde o `InnoDB` cria espaços de tabelas de desfazer. Tipicamente usado para colocar espaços de tabelas de desfazer em um dispositivo de armazenamento diferente.

Não há um valor padrão (é NULL). Se a variável `innodb_undo_directory` não for definida, os espaços de tabelas de desfazer são criados no diretório de dados.

Os espaços de tabelas de desfazer padrão (`innodb_undo_001` e `innodb_undo_002`) criados quando a instância do MySQL é inicializada residem sempre no diretório definido pela variável `innodb_undo_directory`.

Espaços de tabelas de desfazer criados usando a sintaxe `CREATE UNDO TABLESPACE` são criados no diretório definido pela variável `innodb_undo_directory` se um caminho diferente não for especificado.

Para mais informações, consulte a Seção 17.6.3.4, “Espaços de tabelas de desfazer”.

* `innodb_undo_log_encrypt`

<table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Controla a criptografia dos dados do log de desfazer para tabelas criptografadas usando o recurso de criptografia de dados em repouso do `InnoDB`. Aplica-se apenas aos logs de desfazer que residem em espaços de tabelas de desfazer separados. Consulte a Seção 17.6.3.4, “Espaços de Tabelas de Desfazer”. A criptografia não é suportada para dados de log de desfazer que residem no espaço de tabelas do sistema. Para mais informações, consulte Criptografia de Log de Desfazer.

* `innodb_undo_log_truncate`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Quando habilitado, os espaços de tabelas de desfazer que excedem o valor limite definido por `innodb_max_undo_log_size` são marcados para truncação. Apenas espaços de tabelas de desfazer podem ser truncados. A truncação de logs de desfazer que residem no espaço de tabelas do sistema não é suportada. Para que a truncação ocorra, deve haver pelo menos dois espaços de tabelas de desfazer.

  A variável `innodb_purge_rseg_truncate_frequency` pode ser usada para acelerar a truncação de espaços de tabelas de desfazer.

  Para mais informações, consulte Truncação de Espaços de Tabelas de Desfazer.

* `innodb_use_fdatasync`

<table frame="box" rules="all" summary="Propriedades para servidor dedicado innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Em plataformas que suportam chamadas de sistema `fdatasync()`, ter `innodb_use_fdatasync` habilitado permite o uso de `fdatasync()` em vez de chamadas de sistema `fsync()`. Uma chamada `fdatasync()` não esvazia as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um potencial benefício de desempenho.

Um subconjunto das configurações de `innodb_flush_method`, como `fsync`, `O_DSYNC` e `O_DIRECT`, usa chamadas de sistema `fsync()`. A variável `innodb_use_fdatasync` é aplicável ao usar essas configurações.

Antes do MySQL 8.4, essa opção estava desabilitada por padrão.

* `innodb_use_native_aio`

<table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao innodb"><tbody><tr><th>Formato de linha de comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Especifica se usar o subsistema de E/S assíncrona. Essa variável não pode ser alterada enquanto o servidor estiver em execução. Normalmente, você não precisa configurar essa opção, pois ela está habilitada por padrão.

Essa funcionalidade melhora a escalabilidade de sistemas com muitos pedidos de leitura/escrita, que geralmente mostram muitos leitores/escritores pendentes na saída do comando `SHOW ENGINE INNODB STATUS`.

Executar com um grande número de threads de E/S do `InnoDB` e, especialmente, executar várias instâncias desse tipo na mesma máquina do servidor pode exceder os limites de capacidade nos sistemas Linux. Nesse caso, você pode receber o seguinte erro:

```
  --innodb-temp-data-file-path=../../../tmp/ibtmp1:12M:autoextend
  ```

Você geralmente pode resolver esse erro escrevendo um limite maior em `/proc/sys/fs/aio-max-nr`.

No entanto, se um problema com o subsistema de E/S assíncrona no SO impedir que o `InnoDB` seja iniciado, você pode iniciar o servidor com `innodb_use_native_aio=0`. Essa opção também pode ser desativada automaticamente durante o inicialização se o `InnoDB` detectar um problema potencial, como uma combinação de localizações de `tmpdir`, sistema de arquivos `tmpfs` e kernel Linux que não suportam AIO em `tmpfs`.

Para mais informações, consulte a Seção 17.8.6, “Usando E/S Assíncrona no Linux”.

* `innodb_validate_tablespace_paths`

  <table frame="box" rules="all" summary="Propriedades para innodb-dedicated-server"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controla a validação do caminho do arquivo do tablespace. Durante o inicialização, o `InnoDB` valida os caminhos dos arquivos de tablespace conhecidos contra os caminhos de arquivos de tablespace armazenados no dicionário de dados, caso os arquivos de tablespace tenham sido movidos para um local diferente. A variável `innodb_validate_tablespace_paths` permite desativar a validação de caminhos de tablespace. Esse recurso é destinado a ambientes onde os arquivos de tablespace não são movidos. Desativar a validação de caminhos melhora o tempo de inicialização em sistemas com um grande número de arquivos de tablespace.

  Aviso

Iniciar o servidor com a validação do caminho do espaço de tabelas desativada após a movimentação dos arquivos do espaço de tabelas pode levar a comportamentos indefinidos.

Para mais informações, consulte a Seção 17.6.3.7, “Desativar a Validação do Caminho do Espaço de Tabelas”.

* `innodb_version`

  O número da versão do `InnoDB`. Esta é uma variável legada, o valor é o mesmo que a versão do servidor MySQL.

* `innodb_write_io_threads`

  <table frame="box" rules="all" summary="Propriedades para o servidor dedicado ao InnoDB"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--innodb-dedicated-server[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>innodb_dedicated_server</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O número de threads de E/S para operações de escrita no `InnoDB`. O valor padrão é 4. Sua contraparte para threads de leitura é `innodb_read_io_threads`. Para mais informações, consulte a Seção 17.8.5, “Configurando o Número de Threads de E/S de InnoDB em Segundo Plano”. Para conselhos gerais sobre o ajuste de E/S, consulte a Seção 10.5.8, “Otimizando o E/S de Disco do InnoDB”.

  Nota

Em sistemas Linux, executar vários servidores MySQL (tipicamente mais de 12) com configurações padrão para `innodb_read_io_threads`, `innodb_write_io_threads` e o ajuste `aio-max-nr` do Linux pode exceder os limites do sistema. Idealmente, aumente o ajuste `aio-max-nr`; como solução alternativa, você pode reduzir as configurações de uma ou ambas as variáveis MySQL.

Além disso, considere o valor de `sync_binlog`, que controla a sincronização do log binário com o disco.

Para obter conselhos gerais sobre o ajuste de I/O, consulte a Seção 10.5.8, “Otimizando o I/O do disco InnoDB”.