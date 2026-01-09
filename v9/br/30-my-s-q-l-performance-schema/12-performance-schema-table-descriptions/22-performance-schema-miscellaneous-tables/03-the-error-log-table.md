#### 29.12.22.3 A tabela `error_log`

Entre os logs que o servidor MySQL mantém, um deles é o log de erros, ao qual ele escreve mensagens de diagnóstico (veja a Seção 7.4.2, “O Log de Erros”). Tipicamente, o servidor escreve diagnósticos em um arquivo no host do servidor ou em um serviço de log do sistema. Dependendo da configuração do log de erros, o servidor também pode escrever os eventos de erro mais recentes na tabela do Schema de Desempenho `error_log`. Conceder o privilégio `SELECT` para a tabela `error_log`, portanto, dá aos clientes e aplicativos acesso ao conteúdo do log usando consultas SQL, permitindo que os DBAs forneçam acesso ao log sem a necessidade de permitir o acesso direto ao sistema de arquivos no host do servidor.

A tabela `error_log` suporta consultas focadas com base em suas colunas mais estruturadas. Ela também inclui o texto completo das mensagens de erro para suportar uma análise mais livre.

A implementação da tabela usa um buffer de anel de tamanho fixo, em memória, com eventos antigos descartados automaticamente conforme necessário para fazer espaço para novos.

Exemplos de conteúdo do `error_log`:

```
mysql> SELECT * FROM performance_schema.error_log\G
*************************** 1. row ***************************
    LOGGED: 2020-08-06 09:25:00.338624
 THREAD_ID: 0
      PRIO: System
ERROR_CODE: MY-010116
 SUBSYSTEM: Server
      DATA: mysqld (mysqld 9.5.0) starting as process 96344
*************************** 2. row ***************************
    LOGGED: 2020-08-06 09:25:00.363521
 THREAD_ID: 1
      PRIO: System
ERROR_CODE: MY-013576
 SUBSYSTEM: InnoDB
      DATA: InnoDB initialization has started.
...
*************************** 65. row ***************************
    LOGGED: 2020-08-06 09:25:02.936146
 THREAD_ID: 0
      PRIO: Warning
ERROR_CODE: MY-010068
 SUBSYSTEM: Server
      DATA: CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
...
*************************** 89. row ***************************
    LOGGED: 2020-08-06 09:25:03.112801
 THREAD_ID: 0
      PRIO: System
ERROR_CODE: MY-013292
 SUBSYSTEM: Server
      DATA: Admin interface ready for connections, address: '127.0.0.1' port: 33062
```

A tabela `error_log` tem as seguintes colunas. Como indicado nas descrições, todas, exceto a coluna `DATA`, correspondem a campos da estrutura subjacente do evento de erro, que é descrita na Seção 7.4.2.3, “Campos de Evento de Erro”.

* `LOGGED`

  O timestamp do evento, com precisão em microsegundos. `LOGGED` corresponde ao campo `time` dos eventos de erro, embora com certas diferenças potenciais:

  + Os valores de `time` no log de erros são exibidos de acordo com a configuração da variável de sistema `log_timestamps`; veja o Formato de Saída de Registro de Log de Inicialização Antecipada.

+ A coluna `LOGGED` armazena valores usando o tipo de dados `TIMESTAMP`, para os quais os valores são armazenados em UTC, mas exibidos ao serem recuperados no fuso horário da sessão atual; consulte a Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”.

Para exibir os valores de `LOGGED` no mesmo fuso horário exibido no arquivo de log de erros, primeiro defina o fuso horário da sessão da seguinte forma:

```
  SET @@session.time_zone = @@global.log_timestamps;
  ```

Se o valor `log_timestamps` for `UTC` e o seu sistema não tiver o suporte de fuso horário nomeado instalado (consulte a Seção 7.1.15, “Suporte de fuso horário do MySQL”), defina o fuso horário da seguinte forma:

```
  SET @@session.time_zone = '+00:00';
  ```

* `THREAD_ID`

  O ID do thread do MySQL. `THREAD_ID` corresponde ao campo `thread` dos eventos de erro.

  Dentro do Schema de Desempenho, a coluna `THREAD_ID` na tabela `error_log` é mais semelhante à coluna `PROCESSLIST_ID` da tabela `threads`:

  + Para threads em primeiro plano, `THREAD_ID` e `PROCESSLIST_ID` representam um identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `Id` da saída `SHOW PROCESSLIST` e retornada pela função `CONNECTION_ID()` dentro do thread.

  + Para threads em segundo plano, `THREAD_ID` é 0 e `PROCESSLIST_ID` é `NULL`.

  Muitas tabelas do Schema de Desempenho, além da `error_log`, têm uma coluna chamada `THREAD_ID`, mas nessas tabelas, a coluna `THREAD_ID` é um valor atribuído internamente pelo Schema de Desempenho.

* `PRIO`

  A prioridade do evento. Os valores permitidos são `System`, `Error`, `Warning`, `Note`. A coluna `PRIO` é baseada no campo `label` dos eventos de erro, que por sua vez é baseado no valor subjacente do campo numérico `prio`.

* `ERROR_CODE`

  O código de erro numérico do evento. `ERROR_CODE` corresponde ao campo `error_code` dos eventos de erro.

O subsistema em que o evento ocorreu. `SUBSYSTEM` corresponde ao campo `subsystem` dos eventos de erro.

* `DATA`

  A representação textual do evento de erro. O formato deste valor depende do formato produzido pelo componente de canal de registro que gera a linha `error_log`. Por exemplo, se o canal de registro for `log_sink_internal` ou `log_sink_json`, os valores de `DATA` representam eventos de erro no formato tradicional ou JSON, respectivamente. (Veja a Seção 7.4.2.9, “Formato de Saída do Log de Erro”.)

  Como o log de erro pode ser reconfigurado para alterar o componente de canal de registro que fornece linhas para a tabela `error_log`, e como diferentes canais de registro produzem diferentes formatos de saída, é possível que linhas escritas na tabela `error_log` em momentos diferentes tenham formatos de `DATA` diferentes.

A tabela `error_log` tem esses índices:

* Chave primária em (`LOGGED`)
* Índice em (`THREAD_ID`)
* Índice em (`PRIO`)
* Índice em (`ERROR_CODE`)
* Índice em (`SUBSYSTEM`)

O `TRUNCATE TABLE` não é permitido para a tabela `error_log`.

##### Implementação e Configuração da tabela error\_log

A tabela `error_log` do Schema de Desempenho é preenchida por componentes de canal de registro de erro que escrevem na tabela, além de escrever eventos de erro formatados no log de erro. O suporte do Schema de Desempenho por canais de registro tem duas partes:

* Um canal de registro pode escrever novos eventos de erro na tabela `error_log` à medida que ocorrem.

* Um canal de registro pode fornecer um analisador para a extração de mensagens de erro previamente escritas. Isso permite que uma instância do servidor leia mensagens escritas em um arquivo de log de erro pela instância anterior e as armazene na tabela `error_log`. Mensagens escritas durante o desligamento pela instância anterior podem ser úteis para diagnosticar por que o desligamento ocorreu.

Atualmente, os descarregadores de formato tradicional `log_sink_internal` e de formato JSON `log_sink_json` suportam a escrita de novos eventos na tabela `error_log` e fornecem um analisador para ler arquivos de log de erros já escritos.

A variável de sistema `log_error_services` controla quais componentes de log devem ser habilitados para registro de erros. Seu valor é uma cadeia de componentes de filtro de log e descarregador de log a serem executados em ordem de esquerda para direita quando eventos de erro ocorrerem. O valor de `log_error_services` se refere à preenchimento da tabela `error_log` da seguinte forma:

* Na inicialização, o servidor examina o valor de `log_error_services` e escolhe o descarregador de log mais à esquerda que satisfaça essas condições:

  + Um descarregador que suporte a tabela `error_log` e forneça um analisador.

  + Se nenhum, um descarregador que suporte a tabela `error_log`, mas não forneça analisador.

Se nenhum descarregador de log satisfaça essas condições, a tabela `error_log` permanece vazia. Caso contrário, se o descarregador forneça um analisador e a configuração de log permita que um arquivo de log de erro já escrito seja encontrado, o servidor usa o analisador do descarregador para ler a última parte do arquivo e escreve os eventos antigos que ele contém na tabela. O descarregador então escreve novos eventos de erro na tabela à medida que ocorrem.

* Em tempo de execução, se o valor de `log_error_services` mudar, o servidor o examina novamente, desta vez procurando o descarregador de log habilitado mais à esquerda que suporte a tabela `error_log`, independentemente de ele fornecer um analisador.

Se não existir tal descarregador de log, nenhum evento de erro adicional será escrito na tabela `error_log`. Caso contrário, o descarregador recém-configurado escreve novos eventos de erro na tabela à medida que ocorrem.

Qualquer configuração que afete a saída escrita no log de erro afeta o conteúdo da tabela `error_log`. Isso inclui configurações como a de verbosidade, supressão de mensagens e filtragem de mensagens. Isso também se aplica às informações lidas no início de um arquivo de log anterior. Por exemplo, mensagens não escritas durante uma instância anterior do servidor configurada com baixa verbosidade não ficam disponíveis se o arquivo for lido por uma instância atual configurada com maior verbosidade.

A tabela `error_log` é uma visualização de um buffer de anel de memória de tamanho fixo, com eventos antigos descartados automaticamente conforme necessário para dar lugar a novos. Como mostrado na tabela a seguir, várias variáveis de status fornecem informações sobre a operação em andamento da tabela `error_log`.

<table summary="variáveis de status da tabela `error_log`."><col style="width: 35%"/><col style="width: 35%"/><thead><tr> <th>Variável de Status</th> <th>Significado</th> </tr></thead><tbody><tr> <td><a class="link" href="server-status-variables.html#statvar_Error_log_buffered_bytes"><code>Error_log_buffered_bytes</code></a></td> <td>Bytes usados na tabela</td> </tr><tr> <td><a class="link" href="server-status-variables.html#statvar_Error_log_buffered_events"><code>Error_log_buffered_events</code></a></td> <td>Eventos presentes na tabela</td> </tr><tr> <td><a class="link" href="server-status-variables.html#statvar_Error_log_expired_events"><code>Error_log_expired_events</code></a></td> <td>Eventos descartados da tabela</td> </tr><tr> <td><a class="link" href="server-status-variables.html#statvar_Error_log_latest_write"><code>Error_log_latest_write</code></a></td> <td>Tempo da última escrita na tabela</td> </tr></tbody></table>