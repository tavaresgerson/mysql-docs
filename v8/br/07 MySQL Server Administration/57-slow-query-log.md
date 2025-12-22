### 7.4.5 Registro de consultas lentas

O registro de consulta lenta consiste em instruções SQL que levam mais de `long_query_time` segundos para serem executadas e exigem pelo menos `min_examined_row_limit` linhas para serem examinadas. O registro de consulta lenta pode ser usado para encontrar consultas que levam muito tempo para serem executadas e, portanto, são candidatas a otimização. No entanto, examinar um registro de consulta lenta longo pode ser uma tarefa demorada. Para tornar isso mais fácil, você pode usar o comando **mysqldumpslow** para processar um arquivo de registro de consulta lenta e resumir seu conteúdo. Veja Seção 6.6.10, mysqldumpslow  Resumir arquivos de consulta lenta.

O tempo para adquirir os bloqueios iniciais não é contado como tempo de execução. `mysqld` escreve uma instrução para o registro de consulta lenta depois que ele foi executado e depois que todos os bloqueios foram liberados, então a ordem do registro pode diferir da ordem de execução.

- Parâmetros de registo de consulta lenta
- Conteúdo do registo de consultas lentas

#### Parâmetros de registo de consulta lenta

Os valores mínimos e padrão de `long_query_time` são 0 e 10, respectivamente. O valor pode ser especificado com uma resolução de microssegundos.

Por padrão, as instruções administrativas não são registradas, nem as consultas que não usam índices para pesquisas. Este comportamento pode ser alterado usando `log_slow_admin_statements` e `log_queries_not_using_indexes`, como descrito mais tarde.

Por padrão, o registro de consulta lenta está desativado. Para especificar o estado inicial do registro de consulta lenta explicitamente, use `--slow_query_log[={0|1}]`. Sem argumento ou com um argumento de 1, `--slow_query_log` habilita o registro. Com um argumento de 0, esta opção desativa o registro. Para especificar um nome de arquivo de registro, use `--slow_query_log_file=file_name`. Para especificar o destino do registro, use a variável de sistema `log_output` (como descrito na Seção 7.4.1, Selecionando Log de consulta geral e Destinos de saída de registro de consulta lenta).

::: info Note

Se você especificar o `TABLE` destino do log, veja Tabelas de log e Arquivos abertos em excesso Erros.

:::

Se você não especificar nenhum nome para o arquivo de registro de consulta lenta, o nome padrão é `host_name-slow.log`. O servidor cria o arquivo no diretório de dados a menos que um nome de caminho absoluto seja dado para especificar um diretório diferente.

Para desativar ou habilitar o registro de consulta lenta ou alterar o nome do arquivo de registro no tempo de execução, use as variáveis globais de sistema `slow_query_log` e `slow_query_log_file`. Defina `slow_query_log` em 0 para desativar o registro ou em 1 para habilitá-lo. Defina `slow_query_log_file` para especificar o nome do arquivo de registro. Se um arquivo de registro já estiver aberto, ele será fechado e o novo arquivo será aberto.

O servidor escreve menos informações para o registro de consulta lento se você usar a opção `--log-short-format`.

Para incluir instruções administrativas lentas no registro de consulta lenta, habilite a variável de sistema `log_slow_admin_statements`.

Para incluir consultas que não usam índices para pesquisas de linhas nas instruções escritas para o registro lento de consultas, habilite a variável do sistema `log_queries_not_using_indexes` (mesmo com essa variável habilitada, o servidor não registra consultas que não se beneficiariam da presença de um índice devido à tabela ter menos de duas linhas).

Quando as consultas que não usam um índice são registradas, o registro de consultas lento pode crescer rapidamente. É possível colocar um limite de taxa nessas consultas definindo a variável do sistema `log_throttle_queries_not_using_indexes` . Por padrão, essa variável é 0, o que significa que não há limite. Valores positivos impõem um limite por minuto no registro de consultas que não usam índices. A primeira consulta abre uma janela de 60 segundos dentro da qual o servidor registra consultas até o limite dado e, em seguida, suprime consultas adicionais. Se houver consultas suprimidas quando a janela termina, o servidor registra um resumo que indica quantas foram e o tempo agregado gasto nelas. A próxima janela de 60 segundos começa quando o servidor registra a próxima consulta que não usa índices.

O servidor usa os parâmetros de controle na seguinte ordem para determinar se deve escrever uma consulta para o registro de consultas lento:

1. A consulta não deve ser uma instrução administrativa, ou \[`log_slow_admin_statements`]] deve ser habilitada.
2. A consulta deve ter levado pelo menos `long_query_time` segundos, ou `log_queries_not_using_indexes` deve estar habilitado e a consulta não usou índices para pesquisas de linhas.
3. A consulta deve ter examinado pelo menos `min_examined_row_limit` linhas.
4. A consulta não deve ser suprimida de acordo com a configuração `log_throttle_queries_not_using_indexes`.

A variável do sistema `log_timestamps` controla o fuso horário das marcas de tempo nas mensagens escritas no arquivo de registro de consulta lenta (bem como no arquivo de registro de consulta geral e no registro de erros). Ela não afeta o fuso horário do registro de consulta geral e mensagens de registro de consulta lenta escritas em tabelas de registro, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável do sistema `time_zone` de sessão.

Por padrão, uma réplica não escreve consultas replicadas no registro de consultas lentas. Para alterar isso, habilite a variável do sistema `log_slow_replica_statements`. Observe que, se a replicação baseada em linhas estiver em uso (`binlog_format=ROW`), essas variáveis do sistema não terão efeito. As consultas só são adicionadas ao registro de consultas lentas da réplica quando são registradas em formato de instrução no registro binário, ou seja, quando `binlog_format=STATEMENT` é definido, ou quando `binlog_format=MIXED` é definido e a instrução é registrada em formato de instrução. Consultas lentas que são registradas em formato de linha quando `binlog_format=MIXED` é definido, ou que são registradas quando \[\[PH\_CODE\_CODE\_5]] é definido, não são adicionadas ao registro de consultas lentas da réplica, mesmo se \[\[PH\_CODE\_CODE6]] estiver ativado.

#### Conteúdo do registo de consultas lentas

Quando o registro de consulta lenta é habilitado, o servidor escreve a saída para qualquer destino especificado pela variável de sistema `log_output`. Se você habilitar o registro, o servidor abre o arquivo de registro e escreve mensagens de inicialização para ele. No entanto, o registro adicional de consultas no arquivo não ocorre a menos que o destino de registro `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve nenhuma consulta mesmo que o registro de consulta lenta seja habilitado. A configuração do nome do arquivo de registro não tem efeito no registro se `FILE` não for selecionado como destino de saída.

Se o log de consulta lenta estiver habilitado e `FILE` for selecionado como destino de saída, cada instrução escrita no log é precedida por uma linha que começa com um `#` e tem esses campos (com todos os campos em uma única linha):

- `Query_time: duration`

  O tempo de execução da instrução em segundos.
- `Lock_time: duration`

  O tempo para adquirir fechaduras em segundos.
- `Rows_sent: N`

  O número de linhas enviadas ao cliente.
- `Rows_examined:`

  O número de linhas examinadas pela camada de servidor (sem contar qualquer processamento interno aos motores de armazenamento).

A ativação da variável de sistema `log_slow_extra` faz com que o servidor escreva os seguintes campos extras para a saída `FILE` além dos listados (a saída `TABLE` não é afetada). Algumas descrições de campos referem-se a nomes de variáveis de status. Consulte as descrições de variáveis de status para obter mais informações. No entanto, no registro de consulta lento, os contadores são valores por declaração, não valores cumulativos por sessão.

- `Thread_id: ID`

  O identificador de thread de instrução.
- `Errno: error_number`

  O número de erro da instrução, ou 0 se não ocorrer nenhum erro.
- `Killed: N`

  Se a instrução foi encerrada, o número de erro indicando o motivo, ou 0 se a instrução terminou normalmente.
- `Bytes_received: N`

  O valor `Bytes_received` para a instrução.
- `Bytes_sent: N`

  O valor `Bytes_sent` para a instrução.
- `Read_first: N`

  O valor `Handler_read_first` para a instrução.
- `Read_last: N`

  O valor `Handler_read_last` para a instrução.
- `Read_key: N`

  O valor `Handler_read_key` para a instrução.
- `Read_next: N`

  O valor `Handler_read_next` para a instrução.
- `Read_prev: N`

  O valor `Handler_read_prev` para a instrução.
- `Read_rnd: N`

  O valor `Handler_read_rnd` para a instrução.
- `Read_rnd_next: N`

  O valor `Handler_read_rnd_next` para a instrução.
- `Sort_merge_passes: N`

  O valor `Sort_merge_passes` para a instrução.
- `Sort_range_count: N`

  O valor `Sort_range` para a instrução.
- `Sort_rows: N`

  O valor `Sort_rows` para a instrução.
- `Sort_scan_count: N`

  O valor `Sort_scan` para a instrução.
- `Created_tmp_disk_tables: N`

  O valor `Created_tmp_disk_tables` para a instrução.
- `Created_tmp_tables: N`

  O valor `Created_tmp_tables` para a instrução.
- `Start: timestamp`

  Hora de início da execução da instrução.
- `End: timestamp`

  O tempo de execução da instrução.

Um dado arquivo de registro de consulta lenta pode conter uma mistura de linhas com e sem os campos extras adicionados ativando o `log_slow_extra`.

Cada instrução escrita no arquivo de registro de consulta lenta é precedida por uma instrução `SET` que inclui um carimbo de tempo, que indica quando a instrução lenta começou a ser executada.

As senhas nas instruções escritas no registro de consulta lenta são reescritas pelo servidor para não ocorrer literalmente em texto simples.

As instruções que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no registro de consulta lento.
