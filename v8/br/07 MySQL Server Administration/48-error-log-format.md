#### Formato de saída do registo de erros

Cada componente de sink (escritor) de registro de erros tem um formato de saída característico que ele usa para escrever mensagens para seu destino, mas outros fatores podem influenciar o conteúdo das mensagens:

- As informações disponíveis para o sink de log. Se um componente de filtro de log executado antes da execução do componente de sink remover um campo de evento de log, esse campo não estará disponível para gravação. Para informações sobre filtragem de log, consulte a Seção 7.4.2.4, "Tipos de filtragem de log de erro".
- As informações relevantes para o sink de log. Nem todos os sinks escrevem todos os campos disponíveis em eventos de erro.
- As variáveis do sistema podem afetar os sinks de log. Veja Variables do sistema que afetam o formato de log de erro.

Para nomes e descrições dos campos em eventos de erro, veja Seção 7.4.2.3, "Camps de Eventos de Erro". Para todos os sinks de log, o ID de thread incluído nas mensagens de log de erro é o do thread dentro de `mysqld` responsável por escrever a mensagem. Este ID indica qual parte do servidor produziu a mensagem, e é consistente com o log de consulta geral e mensagens de log de consulta lenta, que incluem o ID de thread de conexão.

- Formato de saída
- log\_sink\_json Formato de saída
- Formato de saída log\_sink\_syseventlog
- Formato de saída de registro de inicialização
- Variaveis do sistema que afectam o formato do registo de erros

##### Formato de saída

O sink de log interno produz uma saída de log de erro tradicional.

```
2020-08-06T14:25:02.835618Z 0 [Note] [MY-012487] [InnoDB] DDL log recovery : begin
2020-08-06T14:25:02.936146Z 0 [Warning] [MY-010068] [Server] CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
2020-08-06T14:25:02.963127Z 0 [Note] [MY-010253] [Server] IPv6 is available.
2020-08-06T14:25:03.109022Z 5 [Note] [MY-010051] [Server] Event Scheduler: scheduler thread started with id 5
```

As mensagens de formato tradicional têm estes campos:

```
time thread [label] [err_code] [subsystem] msg
```

Os caracteres entre parênteses quadrados `[` e `]` são caracteres literais no formato da mensagem. Eles não indicam que os campos são opcionais.

O valor `label` corresponde à forma de string do campo de prioridade de evento de erro `prio`.

Os campos `[err_code]` e `[subsystem]` foram adicionados no MySQL 8.0, e, portanto, estão ausentes dos registros gerados por servidores mais antigos. Os analisadores de registro podem tratar esses campos como partes do texto da mensagem que está presente apenas para registros escritos por servidores recentes o suficiente para incluí-los. Os analisadores devem tratar a parte `err_code` dos indicadores `[err_code]` como um valor de string, não um número, porque valores como `MY-012487` e `MY-010051` contêm caracteres não numéricos.

##### log\_sink\_json Formato de saída

O sink de log em formato JSON produz mensagens como objetos JSON que contêm pares chave-valor.

```
{
  "prio": 3,
  "err_code": 10051,
  "source_line": 561,
  "source_file": "event_scheduler.cc",
  "function": "run",
  "msg": "Event Scheduler: scheduler thread started with id 5",
  "time": "2020-08-06T14:25:03.109022Z",
  "ts": 1596724012005,
  "thread": 5,
  "err_symbol": "ER_SCHEDULER_STARTED",
  "SQL_state": "HY000",
  "subsystem": "Server",
  "buffered": 1596723903109022,
  "label": "Note"
}
```

A mensagem mostrada é reformatada para maior legibilidade.

A chave `ts` (timestamp) é exclusiva para o sink de registro em formato JSON. O valor é um número inteiro indicando milissegundos desde a época (UTC).

Os valores `ts` e `buffered` são valores de marca de tempo Unix e podem ser convertidos usando `FROM_UNIXTIME()` e um divisor apropriado:

```
mysql> SET time_zone = '+00:00';
mysql> SELECT FROM_UNIXTIME(1596724012005/1000.0);
+-------------------------------------+
| FROM_UNIXTIME(1596724012005/1000.0) |
+-------------------------------------+
| 2020-08-06 14:26:52.0050            |
+-------------------------------------+
mysql> SELECT FROM_UNIXTIME(1596723903109022/1000000.0);
+-------------------------------------------+
| FROM_UNIXTIME(1596723903109022/1000000.0) |
+-------------------------------------------+
| 2020-08-06 14:25:03.1090                  |
+-------------------------------------------+
```

##### Formato de saída log\_sink\_syseventlog

O sink de log do sistema produz uma saída que está em conformidade com o formato de log do sistema utilizado na plataforma local.

##### Formato de saída de registro de inicialização

O servidor gera algumas mensagens de log de erro antes que as opções de inicialização tenham sido processadas e, portanto, antes de conhecer as configurações de log de erro, como os valores das variáveis do sistema `log_error_verbosity` e `log_timestamps`, e antes de saber quais componentes de log devem ser usados. O servidor lida com mensagens de log de erro geradas no início do processo de inicialização da seguinte forma:

- O servidor armazena eventos de log (em vez de mensagens de log formatadas), o que lhe permite aplicar as configurações de configuração a esses eventos retroativamente, depois que as configurações forem conhecidas, com o resultado de que as mensagens despejadas usam as configurações configuradas, não os padrões.

  Se um erro fatal ocorre antes da configuração do log ser conhecida e o servidor deve sair, o servidor formata mensagens em buffer usando os padrões de log para que não sejam perdidos. Se nenhum erro fatal ocorre, mas a inicialização é excessivamente lenta antes de processar as opções de inicialização, o servidor periodicamente formata e limpa mensagens em buffer usando os padrões de log para que não pareçam sem resposta. Embora esse comportamento use os padrões, é preferível perder mensagens quando ocorrem condições excepcionais.

##### Variaveis do sistema que afectam o formato do registo de erros

A variável do sistema `log_timestamps` controla o fuso horário das marcas de tempo nas mensagens escritas no log de erros (bem como no log de consulta geral e nos arquivos de log de consulta lentos). O servidor aplica `log_timestamps` aos eventos de erro antes que eles atinjam qualquer sink de log; assim, afeta a saída da mensagem de erro de todos os sinks.

Os valores permitidos de `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local). Os timestamps são escritos usando o formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` significando o tempo Zulu (UTC) ou `±hh:mm` (um deslocamento que indica o ajuste do fuso horário do sistema local em relação ao UTC).

```
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```
