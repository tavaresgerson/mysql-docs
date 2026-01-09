#### 7.4.2.9 Formato de Saída do Log de Erros

Cada componente de canal de saída (escritor) de log de erros tem um formato de saída característico que ele usa para escrever mensagens para seu destino, mas outros fatores podem influenciar o conteúdo das mensagens:

* As informações disponíveis para o canal de saída de log. Se um componente de filtro de log executado antes da execução do componente de saída remover um campo de evento de log, esse campo não estará disponível para escrita. Para informações sobre filtragem de log, consulte a Seção 7.4.2.4, “Tipos de Filtragem de Log de Erros”.

* As informações relevantes para o canal de saída de log. Nem todos os canais de saída escrevem todos os campos disponíveis nos eventos de erro.

* Variáveis do sistema podem afetar os canais de saída de log. Consulte Variáveis do Sistema que Afetam o Formato do Log de Erros.

Para os nomes e descrições dos campos nos eventos de erro, consulte a Seção 7.4.2.3, “Campos de Eventos de Erro”. Para todos os canais de saída de log, o ID do thread incluído nas mensagens do log de erro é o do thread dentro do **mysqld** responsável por escrever a mensagem. Esse ID indica qual parte do servidor produziu a mensagem e é consistente com as mensagens gerais do log de consultas e do log de consultas lentas, que incluem o ID do thread da conexão.

* Formato de Saída log_sink_internal
* Formato de Saída log_sink_json
* Formato de Saída log_sink_syseventlog
* Formato de Saída de Log de Inicialização Antecipada
* Variáveis do Sistema que Afetam o Formato do Log de Erros

##### Formato de Saída log_sink_internal

O canal de saída de log interno produz a saída tradicional do log de erros. Por exemplo:

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

O valor `label` corresponde à forma de string do campo de prioridade do evento de erro `prio`.

O repositório de logs no formato JSON produz mensagens como objetos JSON que contêm pares chave-valor. Por exemplo:

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

A mensagem mostrada foi reformatada para melhor legibilidade. Os eventos escritos no log de erro aparecem uma mensagem por linha.

A chave `ts` (timestamp) é exclusiva do repositório de logs no formato JSON. O valor é um inteiro que indica milissegundos desde a época (`'1970-01-01 00:00:00'` UTC).

Os valores `ts` e `buffered` são valores de timestamp Unix e podem ser convertidos usando `FROM_UNIXTIME()` e um divisor apropriado:

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

##### Formato de Saída do log_sink_syseventlog

O repositório de logs do sistema produz saída que se conforma ao formato de log do sistema usado na plataforma local.

##### Formato de Saída de Log de Inicialização Antecipada

O servidor gera alguns mensagens do log de erro antes que as opções de inicialização sejam processadas e, portanto, antes que ele saiba os valores das variáveis de sistema `log_error_verbosity` e `log_timestamps`, e antes que ele saiba quais componentes de log devem ser usados. O servidor lida com as mensagens do log de erro geradas no início do processo de inicialização da seguinte forma:

* O servidor armazena eventos de log (em vez de mensagens de log formatadas), o que permite que ele aplique configurações a esses eventos retroativamente, após os ajustes serem conhecidos, com o resultado de que as mensagens descarregadas usam as configurações configuradas, não os valores padrão. Além disso, as mensagens são descarregadas para todos os repositórios configurados, não apenas para o repositório padrão.

Se um erro fatal ocorrer antes que a configuração do log seja conhecida e o servidor precisar sair, o servidor formata as mensagens em buffer usando os padrões de registro para que não sejam perdidas. Se não ocorrer um erro fatal, mas a inicialização for excessivamente lenta antes do processamento das opções de inicialização, o servidor formata e esvazia periodicamente as mensagens em buffer usando os padrões de registro para não parecer inativo. Embora esse comportamento use os padrões, é preferível perder mensagens quando condições excepcionais ocorrerem.

##### Variáveis de Sistema que Afetam o Formato do Log de Erros

A variável de sistema `log_timestamps` controla a zona horária dos timestamps nas mensagens escritas no log de erros (assim como nos arquivos de log de consultas gerais e log de consultas lentas). O servidor aplica `log_timestamps` aos eventos de erro antes que eles atinjam qualquer canal de registro; assim, afeta a saída de mensagens de erro de todos os canais.

Os valores permitidos de `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (a zona horária do sistema local). Os timestamps são escritos no formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` significando hora de Zulu (UTC) ou `±hh:mm` (um deslocamento que indica o ajuste da zona horária do sistema local em relação ao UTC). Por exemplo:

```
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```