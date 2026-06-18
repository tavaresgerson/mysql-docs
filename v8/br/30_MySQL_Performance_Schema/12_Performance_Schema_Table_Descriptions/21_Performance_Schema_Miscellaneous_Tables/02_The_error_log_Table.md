#### 29.12.21.2 Tabela error\_log

Entre os logs que o servidor MySQL mantém, um deles é o log de erros, no qual ele escreve mensagens de diagnóstico (veja a Seção 7.4.2, “O Log de Erros”). Normalmente, o servidor escreve diagnósticos em um arquivo no host do servidor ou em um serviço de log do sistema. A partir do MySQL 8.0.22, dependendo da configuração do log de erros, o servidor também pode escrever os eventos de erro mais recentes na tabela do Schema de Desempenho `error_log`. Portanto, conceder o privilégio `SELECT` para a tabela `error_log` dá aos clientes e aplicativos acesso ao conteúdo do log usando consultas SQL, permitindo que os DBAs forneçam acesso ao log sem a necessidade de permitir o acesso direto ao sistema de arquivos no host do servidor.

A tabela `error_log` suporta consultas focadas com base em suas colunas mais estruturadas. Ela também inclui o texto completo das mensagens de erro para suportar análises mais livres.

A implementação da tabela utiliza um buffer de anel de memória com tamanho fixo, com eventos antigos descartados automaticamente conforme necessário para dar espaço para novos eventos.

Exemplo: o conteúdo do `error_log` é:

```
mysql> SELECT * FROM performance_schema.error_log\G
*************************** 1. row ***************************
    LOGGED: 2020-08-06 09:25:00.338624
 THREAD_ID: 0
      PRIO: System
ERROR_CODE: MY-010116
 SUBSYSTEM: Server
      DATA: mysqld (mysqld 8.0.23) starting as process 96344
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

- `LOGGED`

  O timestamp do evento, com precisão em microsegundos. `LOGGED` corresponde ao campo `time` de eventos de erro, embora com certas diferenças potenciais:

  - Os valores `time` no log de erros são exibidos de acordo com a configuração da variável de sistema `log_timestamps`; veja o formato de saída do registro de inicialização precoce.

  - A coluna `LOGGED` armazena valores usando o tipo de dados `TIMESTAMP`, para os quais os valores são armazenados no UTC, mas exibidos ao serem recuperados no fuso horário da sessão atual; consulte a Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”.

  Para exibir os valores de `LOGGED` na mesma zona horária que os exibidos no arquivo de log de erro, primeiro defina a zona horária da sessão da seguinte forma:

  ```
  SET @@session.time_zone = @@global.log_timestamps;
  ```

  Se o valor `log_timestamps` for `UTC` e o seu sistema não tiver o suporte de fuso horário nomeado instalado (consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”), defina o fuso horário da seguinte forma:

  ```
  SET @@session.time_zone = '+00:00';
  ```

- `THREAD_ID`

  O ID do fio MySQL. `THREAD_ID` corresponde ao campo `thread` dos eventos de erro.

  No Schema de Desempenho, a coluna `THREAD_ID` na tabela `error_log` é mais semelhante à coluna `PROCESSLIST_ID` da tabela `threads`:

  - Para os threads de primeiro plano, `THREAD_ID` e `PROCESSLIST_ID` representam um identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `Id` da saída `SHOW PROCESSLIST` e retornada pela função `CONNECTION_ID()` dentro do thread.

  - Para os threads de fundo, `THREAD_ID` é 0 e `PROCESSLIST_ID` é `NULL`.

  Muitas tabelas do Schema de Desempenho, além da `error_log`, possuem uma coluna chamada `THREAD_ID`, mas, nessas tabelas, a coluna `THREAD_ID` é um valor atribuído internamente pelo Schema de Desempenho.

- `PRIO`

  A prioridade do evento. Os valores permitidos são `System`, `Error`, `Warning`, `Note`. A coluna `PRIO` é baseada no campo `label` de eventos de erro, que por sua vez é baseado no valor subjacente do campo numérico `prio`.

- `ERROR_CODE`

  O código de erro numérico do evento. `ERROR_CODE` corresponde ao campo `error_code` de eventos de erro.

- `SUBSYSTEM`

  O subsistema em que o evento ocorreu. `SUBSYSTEM` corresponde ao campo `subsystem` de eventos de erro.

- `DATA`

  A representação textual do evento de erro. O formato deste valor depende do formato produzido pelo componente de destino de log que gera a linha `error_log`. Por exemplo, se o destino de log for `log_sink_internal` ou `log_sink_json`, os valores `DATA` representam eventos de erro no formato tradicional ou JSON, respectivamente. (Veja a Seção 7.4.2.9, “Formato de Saída do Log de Erro”.)

  Como o log de erros pode ser reconfigurado para alterar o componente de destino do log que fornece linhas para a tabela `error_log`, e porque diferentes destinos produzem diferentes formatos de saída, é possível que as linhas escritas na tabela `error_log` em diferentes momentos tenham diferentes formatos de `DATA`.

A tabela `error_log` tem esses índices:

- Chave primária em (`LOGGED`)
- Índice sobre (`THREAD_ID`)
- Índice sobre (`PRIO`)
- Índice sobre (`ERROR_CODE`)
- Índice sobre (`SUBSYSTEM`)

`TRUNCATE TABLE` não é permitido para a tabela `error_log`.

##### Implementação e Configuração da Tabela error\_log

A tabela do Schema de Desempenho `error_log` é preenchida por componentes de canal de registro de erros que escrevem na tabela, além de registrar eventos de erro formatados no log de erros. O suporte do Schema de Desempenho por canais de registro tem duas partes:

- Um sink de logs pode escrever novos eventos de erro na tabela `error_log` à medida que ocorrem.

- Um repositório de logs pode fornecer um analisador para a extração de mensagens de erro previamente escritas. Isso permite que uma instância do servidor leia mensagens escritas em um arquivo de log de erro pela instância anterior e as armazene na tabela `error_log`. Mensagens escritas durante o desligamento pela instância anterior podem ser úteis para diagnosticar por que o desligamento ocorreu.

Atualmente, os repositórios de formato tradicional `log_sink_internal` e de formato JSON `log_sink_json` suportam a escrita de novos eventos na tabela `error_log` e fornecem um analisador para ler arquivos de log de erros previamente escritos.

A variável de sistema `log_error_services` controla quais componentes de log para habilitar para registro de erros. Seu valor é uma cadeia de componentes de filtro de log e de destino de log a serem executados em ordem de esquerda para direita quando eventos de erro ocorrerem. O valor `log_error_services` diz respeito ao preenchimento da tabela `error_log` da seguinte forma:

- Ao inicializar, o servidor examina o valor `log_error_services` e escolhe o canal de registro mais à esquerda que satisfaça essas condições:

  - Um lava-louças que suporta a tabela `error_log` e fornece um analisador.

  - Se não houver, um reator que suporte a tabela `error_log`, mas não forneça um analisador.

  Se nenhuma tabela de armazenamento de logs satisfaça essas condições, a tabela `error_log` permanece vazia. Caso contrário, se o armazenamento de logs fornecer um analisador e a configuração de logs permitir que um arquivo de log de erro previamente escrito seja encontrado, o servidor usa o analisador do armazenamento de logs para ler a última parte do arquivo e escreve os eventos antigos que ele contém na tabela. O armazenamento de logs então escreve novos eventos de erro na tabela à medida que ocorrem.

- Durante a execução, se o valor de `log_error_services` mudar, o servidor o examinará novamente, desta vez procurando o canal de registro habilitado mais à esquerda que suporte a tabela `error_log`, independentemente de ele fornecer um analisador.

  Se não existir um repositório de logs desse tipo, nenhum evento de erro adicional será escrito na tabela `error_log`. Caso contrário, o repositório recém-configurado escreverá novos eventos de erro na tabela à medida que ocorrerem.

Qualquer configuração que afete a saída escrita no log de erro afeta o conteúdo da tabela `error_log`. Isso inclui configurações como as de verbosidade, supressão de mensagens e filtragem de mensagens. Isso também se aplica às informações lidas no início de um arquivo de log anterior. Por exemplo, mensagens não escritas durante uma instância anterior do servidor configurada com baixa verbosidade não ficam disponíveis se o arquivo for lido por uma instância atual configurada com maior verbosidade.

A tabela `error_log` é uma visualização de um buffer de anel de memória de tamanho fixo, com eventos antigos descartados automaticamente conforme necessário para dar espaço para novos. Como mostrado na tabela a seguir, várias variáveis de status fornecem informações sobre a operação em andamento `error_log`.

<table summary="variáveis de status da tabela error_log."><thead><tr> <th>Status Variável</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>Error_log_buffered_bytes</code>]]</td> <td>Bytes usados na tabela</td> </tr><tr> <td>[[<code>Error_log_buffered_events</code>]]</td> <td>Eventos apresentados na tabela</td> </tr><tr> <td>[[<code>Error_log_expired_events</code>]]</td> <td>Eventos descartados da tabela</td> </tr><tr> <td>[[<code>Error_log_latest_write</code>]]</td> <td>Tempo da última escrita na tabela</td> </tr></tbody></table>
