### 7.4.5 O Log de Consultas Lentas

O log de consultas lentas consiste em instruções SQL que levam mais de `long_query_time` segundos para serem executadas e exigem que pelo menos `min_examined_row_limit` linhas sejam examinadas. O log de consultas lentas pode ser usado para encontrar consultas que levam muito tempo para serem executadas e, portanto, são candidatas à otimização. No entanto, examinar um log de consultas lentas longo pode ser uma tarefa demorada. Para facilitar isso, você pode usar o comando **mysqldumpslow** para processar um arquivo de log de consulta lenta e resumir seu conteúdo. Veja a Seção 6.6.10, “mysqldumpslow — Resumir Arquivos de Log de Consultas Lentas”.

O tempo para adquirir os bloqueios iniciais não é contado como tempo de execução. O **mysqld** escreve uma instrução no log de consultas lentas após ela ter sido executada e após todos os bloqueios terem sido liberados, então a ordem do log pode diferir da ordem de execução.

* Parâmetros do Log de Consultas Lentas
* Conteúdo do Log de Consultas Lentas

#### Parâmetros do Log de Consultas Lentas

Os valores mínimo e padrão de `long_query_time` são 0 e 10, respectivamente. O valor pode ser especificado com uma resolução de microsegundos.

Por padrão, as declarações administrativas não são registradas, nem são registradas consultas que não usam índices para buscas. Esse comportamento pode ser alterado usando `log_slow_admin_statements` e `log_queries_not_using_indexes`, conforme descrito mais adiante.

Por padrão, o log de consultas lentas está desativado. Para especificar explicitamente o estado inicial do log de consultas lentas, use `--slow_query_log[={0|1}]`. Sem argumento ou com um argumento de 1, `--slow_query_log` habilita o log. Com um argumento de 0, essa opção desativa o log. Para especificar o nome de um arquivo de log, use `--slow_query_log_file=file_name`. Para especificar o destino do log, use a variável de sistema `log_output` (como descrito na Seção 7.4.1, “Selecionando Destinos de Saída do Log de Consultas Gerais e de Consultas Lentas”).

Nota

Se você especificar o destino de registro `TABLE`, consulte Registros de consultas lentas e erros de "Excesso de arquivos abertos".

Se você não especificar um nome para o arquivo de registro de consultas lentas, o nome padrão é `host_name-slow.log`. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o registro de consultas lentas ou alterar o nome do arquivo de registro em tempo de execução, use as variáveis de sistema globais `slow_query_log` e `slow_query_log_file`. Defina `slow_query_log` para 0 para desabilitar o registro ou para 1 para habilitá-lo. Defina `slow_query_log_file` para especificar o nome do arquivo de registro. Se um arquivo de registro já estiver aberto, ele será fechado e o novo arquivo será aberto.

O servidor escreve menos informações no registro de consultas lentas se você usar a opção `--log-short-format`.

Para incluir declarações administrativas lentas no registro de consultas lentas, habilite a variável de sistema `log_slow_admin_statements`. As declarações administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

Para incluir consultas que não usam índices para buscas de linhas no registro de consultas lentas, habilite a variável de sistema `log_queries_not_using_indexes`. (Mesmo com essa variável habilitada, o servidor não registra consultas que não se beneficiariam da presença de um índice devido à tabela ter menos de duas linhas.)

Quando as consultas que não utilizam um índice são registradas, o log de consultas lentas pode crescer rapidamente. É possível definir um limite de taxa para essas consultas, configurando a variável de sistema `log_throttle_queries_not_using_indexes`. Por padrão, essa variável é 0, o que significa que não há limite. Valores positivos impõem um limite por minuto para o registro de consultas que não utilizam índices. A primeira consulta desse tipo abre uma janela de 60 segundos, dentro da qual o servidor registra consultas até o limite dado, e depois suprime consultas adicionais. Se houver consultas suprimidas quando a janela terminar, o servidor registra um resumo que indica quantas havia e o tempo agregado gasto nelas. A próxima janela de 60 segundos começa quando o servidor registra a próxima consulta que não utiliza índices.

O servidor usa os parâmetros de controle na seguinte ordem para determinar se deve escrever uma consulta no log de consultas lentas:

1. A consulta não pode ser uma declaração administrativa, ou `log_slow_admin_statements` deve estar habilitado.

2. A consulta deve ter levado pelo menos `long_query_time` segundos, ou `log_queries_not_using_indexes` deve estar habilitado e a consulta não usar índices para consultas de busca de linhas.

3. A consulta deve ter examinado pelo menos `min_examined_row_limit` linhas.

4. A consulta não deve ser suprimida de acordo com a configuração `log_throttle_queries_not_using_indexes`.

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps nas mensagens escritas no arquivo de log de consultas lentas (assim como no arquivo de log de consultas gerais e no log de erros). Ela não afeta o fuso horário das mensagens do log de consultas gerais e do log de consultas lentas escritas em tabelas de log, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema `time_zone` da sessão.

Por padrão, uma replica não escreve consultas replicadas no log de consultas lentas. Para alterar isso, habilite a variável de sistema `log_slow_replica_statements`. Observe que, se a replicação baseada em linhas estiver em uso (`binlog_format=ROW`), essas variáveis de sistema não terão efeito. As consultas são adicionadas apenas ao log de consultas lentas da replica quando são registradas no formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` é definido, ou quando `binlog_format=MIXED` é definido e a declaração é registrada no formato de declaração. Consultas lentas registradas em formato de linha quando `binlog_format=MIXED` é definido, ou registradas quando `binlog_format=ROW` é definido, não são adicionadas ao log de consultas lentas da replica, mesmo que `log_slow_replica_statements` esteja habilitado.

#### Conteúdo do Log de Consultas Lentas

Quando o log de consultas lentas é habilitado, o servidor escreve a saída para quaisquer destinos especificados pela variável de sistema `log_output`. Se você habilitar o log, o servidor abre o arquivo de log e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve consultas, mesmo que o log de consultas lentas esteja habilitado. Definir o nome do arquivo de log não tem efeito no registro se `FILE` não for selecionado como destino de saída.

Se o registro de consultas lentas estiver habilitado e `FILE` estiver selecionado como destino de saída, cada instrução escrita no log é precedida por uma linha que começa com o caractere `#` e possui esses campos (com todos os campos em uma única linha):

* `Query_time: duration`

  O tempo de execução da instrução em segundos.

* `Lock_time: duration`

  O tempo para adquirir travamentos em segundos.

* `Rows_sent: N`

  O número de linhas enviadas ao cliente.

* `Rows_examined:`

  O número de linhas examinadas pela camada do servidor (não contando qualquer processamento interno dos motores de armazenamento).

Ativação da variável de sistema `log_slow_extra` faz com que o servidor escreva os seguintes campos extras no `FILE` de saída, além dos listados acima (`TABLE` de saída não é afetada). Algumas descrições de campos referem-se a nomes de variáveis de status. Consulte as descrições das variáveis de status para mais informações. No entanto, no registro de consultas lentas, os contadores são valores por instrução, não valores cumulativos por sessão.

* `Thread_id: ID`

  O identificador do thread da instrução.

* `Errno: error_number`

  O número de erro da instrução, ou 0 se nenhum erro ocorrer.

* `Killed: N`

  Se a instrução foi terminada, o número de erro indicando o motivo, ou 0 se a instrução foi terminada normalmente.

* `Bytes_received: N`

  O valor `Bytes_received` para a instrução.

* `Bytes_sent: N`

  O valor `Bytes_sent` para a instrução.

* `Read_first: N`

  O valor `Handler_read_first` para a instrução.

* `Read_last: N`

  O valor `Handler_read_last` para a instrução.

* `Read_key: N`

  O valor `Handler_read_key` para a instrução.

* `Read_next: N`

  O valor `Handler_read_next` para a instrução.

* `Read_prev: N`

  O valor `Handler_read_prev` para a instrução.

* `Read_rnd: N`

  O valor `Handler_read_rnd` para a instrução.

* `Read_rnd_next: N`

  O valor `Handler_read_rnd_next` para a instrução.

* `Sort_merge_passes: N`

  O valor `Sort_merge_passes` para a instrução.

* `Sort_range_count: N`

  O valor `Sort_range` para a instrução.

* `Sort_rows: N`

  O valor `Sort_rows` para a instrução.

* `Sort_scan_count: N`

  O valor `Sort_scan` para a instrução.

* `Created_tmp_disk_tables: N`

  O valor `Created_tmp_disk_tables` para a instrução.

* `Created_tmp_tables: N`

  O valor `Created_tmp_tables` para a instrução.

* `Start: timestamp`

  O horário de início da execução da instrução.

* `End: timestamp`

  O horário de término da execução da instrução.

Um arquivo de log de consultas lentas pode conter uma mistura de linhas com e sem os campos extras adicionados ao habilitar `log_slow_extra`. Os analisadores de arquivos de log podem determinar se uma linha contém os campos adicionais pelo número de campos.

Cada instrução escrita no arquivo de log de consultas lentas é precedida por uma instrução `SET` que inclui um timestamp, que indica quando a instrução lenta começou a ser executada.

As senhas nas instruções escritas no log de consultas lentas são reescritas pelo servidor para não ocorrerem literalmente em texto plano. Veja a Seção 8.1.2.3, “Senhas e Log”.

As instruções que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consultas lentas.