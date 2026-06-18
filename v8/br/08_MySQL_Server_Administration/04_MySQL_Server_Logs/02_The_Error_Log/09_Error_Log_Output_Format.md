#### 7.4.2.9 Formato de Saída do Log de Erros

Cada componente de canalizador (escritor) do log de erros tem um formato de saída característico que ele usa para escrever mensagens para seu destino, mas outros fatores podem influenciar o conteúdo das mensagens:

- As informações disponíveis para o repositório de logs. Se um componente de filtro de logs for executado antes da execução do componente de repositório, ele removerá um campo de evento de logs. Nesse caso, esse campo não estará disponível para escrita. Para obter informações sobre o filtro de logs, consulte a Seção 7.4.2.4, “Tipos de Filtro de Log de Erros”.

- As informações relevantes para o repositório de logs. Nem todos os sinks escrevem todos os campos disponíveis em eventos de erro.

- As variáveis do sistema podem afetar os destinos do log. Consulte Variáveis do sistema que afetam o formato do log de erro.

Para nomes e descrições dos campos nos eventos de erro, consulte a Seção 7.4.2.3, “Campos de Eventos de Erro”. Para todos os pontos de registro de logs, o ID do thread incluído nas mensagens de log de erro é o do thread dentro do **mysqld** responsável por escrever a mensagem. Esse ID indica qual parte do servidor produziu a mensagem e é consistente com as mensagens gerais de log de consulta e log de consultas lentas, que incluem o ID do thread de conexão.

- log\_sink\_internal Formato de saída
- log\_sink\_json Formato de saída
- Formato de saída do log\_sink\_syseventlog
- Formato de saída de registro de inicialização precoce
- Variáveis do sistema que afetam o formato do log de erros

##### log\_sink\_internal Formato de saída

O repositório de logs interno produz a saída tradicional do log de erros. Por exemplo:

```
2020-08-06T14:25:02.835618Z 0 [Note] [MY-012487] [InnoDB] DDL log recovery : begin
2020-08-06T14:25:02.936146Z 0 [Warning] [MY-010068] [Server] CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
2020-08-06T14:25:02.963127Z 0 [Note] [MY-010253] [Server] IPv6 is available.
2020-08-06T14:25:03.109022Z 5 [Note] [MY-010051] [Server] Event Scheduler: scheduler thread started with id 5
```

As mensagens no formato tradicional têm esses campos:

```
time thread [label] [err_code] [subsystem] msg
```

Os caracteres de colchetes `[` e `]` são caracteres literais no formato da mensagem. Eles não indicam que os campos são opcionais.

O valor `label` corresponde ao campo de prioridade do evento de erro `prio` na forma de string.

Os campos `[err_code]` e `[subsystem]` foram adicionados no MySQL 8.0. Eles estão ausentes nos logs gerados por servidores mais antigos. Os analisadores de logs podem tratar esses campos como partes do texto da mensagem que está presente apenas para logs escritos por servidores recentes o suficiente para incluí-los. Os analisadores devem tratar a parte `err_code` dos indicadores `[err_code]` como um valor de string, não como um número, porque valores como `MY-012487` e `MY-010051` contêm caracteres não numéricos.

##### log\_sink\_json Formato de saída

O repositório de log no formato JSON produz mensagens como objetos JSON que contêm pares chave-valor. Por exemplo:

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

A mensagem exibida é reformatada para melhor legibilidade. Os eventos registrados no log de erro aparecem uma mensagem por linha.

A chave `ts` (timestamp) foi adicionada no MySQL 8.0.20 e é exclusiva para o canal de registro no formato JSON. O valor é um inteiro que indica milissegundos desde o início (`'1970-01-01 00:00:00'` UTC).

Os valores `ts` e `buffered` são valores de marcação de tempo Unix e podem ser convertidos usando `FROM_UNIXTIME()` e um divisor apropriado:

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

##### Formato de saída do log\_sink\_syseventlog

O repositório de log do sistema produz uma saída que está em conformidade com o formato de log do sistema usado na plataforma local.

##### Formato de saída de registro de inicialização precoce

O servidor gera algumas mensagens de log de erro antes que as opções de inicialização tenham sido processadas, e, portanto, antes de conhecer os valores das variáveis de sistema `log_error_verbosity` e `log_timestamps`, e antes de saber quais componentes do log devem ser usados. O servidor lida com as mensagens de log de erro geradas no início do processo de inicialização da seguinte forma:

- Antes do MySQL 8.0.14, o servidor gera mensagens com o timestamp, o formato e o nível de verbosidade padrão e as armazena em buffer. Após as opções de inicialização serem processadas e a configuração do log de erro ser conhecida, o servidor descarrega as mensagens armazenadas em buffer. Como essas mensagens iniciais usam a configuração padrão do log, elas podem diferir do que é especificado pelas opções de inicialização. Além disso, as mensagens iniciais não são descarregadas em fontes de log que não sejam a padrão. Por exemplo, o registro no canal JSON não inclui essas mensagens iniciais porque elas não estão no formato JSON.

- A partir do MySQL 8.0.14, o servidor armazena os eventos de log em tampões em vez de mensagens de log formatadas. Isso permite que ele aplique retroativamente as configurações desses eventos após a configuração ser conhecida, com o resultado de que as mensagens descarregadas usam as configurações configuradas, e não as padrão. Além disso, as mensagens são descarregadas em todos os sinks configurados, e não apenas no sink padrão.

  Se um erro fatal ocorrer antes que a configuração do log seja conhecida e o servidor precisar sair, o servidor formata as mensagens armazenadas usando os parâmetros padrão de registro para que não sejam perdidas. Se não ocorrer um erro fatal, mas a inicialização for excessivamente lenta antes do processamento das opções de inicialização, o servidor formata e libera periodicamente as mensagens armazenadas usando os parâmetros padrão de registro para não parecer inativo. Embora esse comportamento seja semelhante ao do comportamento anterior à versão 8.0.14, pois os parâmetros padrão são usados, é preferível perder mensagens quando condições excepcionais ocorrerem.

##### Variáveis do sistema que afetam o formato do log de erros

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps nas mensagens escritas no log de erros (assim como nos arquivos de log de consultas gerais e log de consultas lentas). O servidor aplica `log_timestamps` aos eventos de erro antes que eles cheguem a qualquer canal de armazenamento de logs; assim, ele afeta a saída das mensagens de erro de todos os canais.

Os valores permitidos `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local). Os timestamps são escritos no formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de `Z` que indica a hora Zulu (UTC) ou `±hh:mm` (um deslocamento que indica o ajuste do fuso horário do sistema local em relação ao UTC). Por exemplo:

```
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```
