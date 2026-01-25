### 25.12.6 Tabelas de Eventos de Statement do Performance Schema

[25.12.6.1 A Tabela events_statements_current](performance-schema-events-statements-current-table.html)

[25.12.6.2 A Tabela events_statements_history](performance-schema-events-statements-history-table.html)

[25.12.6.3 A Tabela events_statements_history_long](performance-schema-events-statements-history-long-table.html)

[25.12.6.4 A Tabela prepared_statements_instances](performance-schema-prepared-statements-instances-table.html)

O Performance Schema instrumenta a execução de Statement. Statement Events (Eventos de Declaração) ocorrem em um nível alto na hierarquia de eventos. Dentro da hierarquia de eventos, Wait Events (Eventos de Espera) aninham-se dentro de Stage Events (Eventos de Estágio), que se aninham dentro de Statement Events, que se aninham dentro de Transaction Events (Eventos de Transação).

Estas tabelas armazenam Statement Events:

* [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 A Tabela events_statements_current"): O Statement Event atual para cada Thread.

* [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 A Tabela events_statements_history"): Os Statement Events mais recentes que terminaram por Thread.

* [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 A Tabela events_statements_history_long"): Os Statement Events mais recentes que terminaram globalmente (em todas as Threads).

* [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 A Tabela prepared_statements_instances"): Instâncias e estatísticas de Prepared Statement.

As seções a seguir descrevem as tabelas de Statement Event. Existem também tabelas de summary que agregam informações sobre Statement Events; consulte [Section 25.12.15.3, “Tabelas de Statement Summary”](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables").

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte [Section 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

* [Configurando a Coleta de Statement Event](performance-schema-statement-tables.html#performance-schema-statement-tables-configuration "Configuring Statement Event Collection")
* [Monitoramento de Statement](performance-schema-statement-tables.html#performance-schema-statement-tables-monitoring "Statement Monitoring")

#### Configurando a Coleta de Statement Event

Para controlar se Statement Events devem ser coletados, defina o estado dos Instruments e Consumers relevantes:

* A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") contém Instruments com nomes que começam com `statement`. Use estes Instruments para habilitar ou desabilitar a coleta de classes individuais de Statement Event.

* A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") contém valores de Consumer com nomes correspondentes aos nomes das tabelas de Statement Event atuais e históricas, e o Statement Digest Consumer. Use estes Consumers para filtrar a coleta de Statement Events e o Statement Digesting.

Os Statement Instruments são habilitados por padrão, e os Statement Consumers `events_statements_current`, `events_statements_history` e `statements_digest` são habilitados por padrão:

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'statement/%';
+---------------------------------------------+---------+-------+
| NAME                                        | ENABLED | TIMED |
+---------------------------------------------+---------+-------+
| statement/sql/select                        | YES     | YES   |
| statement/sql/create_table                  | YES     | YES   |
| statement/sql/create_index                  | YES     | YES   |
...
| statement/sp/stmt                           | YES     | YES   |
| statement/sp/set                            | YES     | YES   |
| statement/sp/set_trigger_field              | YES     | YES   |
| statement/scheduler/event                   | YES     | YES   |
| statement/com/Sleep                         | YES     | YES   |
| statement/com/Quit                          | YES     | YES   |
| statement/com/Init DB                       | YES     | YES   |
...
| statement/abstract/Query                    | YES     | YES   |
| statement/abstract/new_packet               | YES     | YES   |
| statement/abstract/relay_log                | YES     | YES   |
+---------------------------------------------+---------+-------+
```

```sql
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE '%statements%';
+--------------------------------+---------+
| NAME                           | ENABLED |
+--------------------------------+---------+
| events_statements_current      | YES     |
| events_statements_history      | YES     |
| events_statements_history_long | NO      |
| statements_digest              | YES     |
+--------------------------------+---------+
```

Para controlar a coleta de Statement Event na inicialização do servidor (server startup), use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='statement/%=ON'
  performance-schema-consumer-events-statements-current=ON
  performance-schema-consumer-events-statements-history=ON
  performance-schema-consumer-events-statements-history-long=ON
  performance-schema-consumer-statements-digest=ON
  ```

* Desabilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='statement/%=OFF'
  performance-schema-consumer-events-statements-current=OFF
  performance-schema-consumer-events-statements-history=OFF
  performance-schema-consumer-events-statements-history-long=OFF
  performance-schema-consumer-statements-digest=OFF
  ```

Para controlar a coleta de Statement Event em tempo de execução (runtime), atualize as tabelas [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") e [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"):

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE '%statements%';
  ```

* Desabilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE '%statements%';
  ```

Para coletar apenas Statement Events específicos, habilite apenas os Statement Instruments correspondentes. Para coletar Statement Events apenas para tabelas específicas de Statement Event, habilite os Statement Instruments, mas somente os Statement Consumers correspondentes às tabelas desejadas.

A tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") contém uma linha com um valor `NAME` de `statement` que indica a unidade para o timing de Statement Event. A unidade padrão é `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'statement';
+-----------+------------+
| NAME      | TIMER_NAME |
+-----------+------------+
| statement | NANOSECOND |
+-----------+------------+
```

Para alterar a unidade de timing, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'statement';
```

Para informações adicionais sobre a configuração da coleta de eventos, consulte [Section 25.3, “Configuração de Inicialização do Performance Schema”](performance-schema-startup-configuration.html "25.3 Performance Schema Startup Configuration") e [Section 25.4, “Configuração em Tempo de Execução do Performance Schema”](performance-schema-runtime-configuration.html "25.4 Performance Schema Runtime Configuration").

#### Monitoramento de Statement

O monitoramento de Statement começa a partir do momento em que o servidor detecta que uma atividade é solicitada em uma Thread, até o momento em que toda a atividade cessou. Tipicamente, isso significa desde o momento em que o servidor recebe o primeiro packet do cliente até o momento em que o servidor termina de enviar a response. Statements dentro de stored programs (programas armazenados) são monitorados como outros Statements.

Quando o Performance Schema instrumenta uma request (comando do servidor ou SQL Statement), ele usa nomes de Instrument que progridem em estágios do mais geral (ou "abstract") para o mais específico, até chegar a um nome de Instrument final.

Os nomes de Instrument finais correspondem a comandos do servidor e SQL Statements:

* Comandos do servidor correspondem aos códigos `COM_xxx` definidos no arquivo header `mysql_com.h` e processados em `sql/sql_parse.cc`. Exemplos são `COM_PING` e `COM_QUIT`. Instruments para comandos têm nomes que começam com `statement/com`, como `statement/com/Ping` e `statement/com/Quit`.

* SQL Statements são expressos como texto, como `DELETE FROM t1` ou `SELECT * FROM t2`. Instruments para SQL Statements têm nomes que começam com `statement/sql`, como `statement/sql/delete` e `statement/sql/select`.

Alguns nomes de Instrument finais são específicos para tratamento de erros:

* `statement/com/Error` contabiliza mensagens recebidas pelo servidor que estão fora de banda. Pode ser usado para detectar comandos enviados por clientes que o servidor não entende. Isso pode ser útil para fins como identificar clientes que estão mal configurados ou usando uma versão do MySQL mais recente que a do servidor, ou clientes que estão tentando atacar o servidor.

* `statement/sql/error` contabiliza SQL Statements que falham no Parsing. Pode ser usado para detectar Querys malformadas enviadas por clientes. Uma Query que falha no Parsing difere de uma Query que é analisada (parsed) mas falha devido a um erro durante a execução. Por exemplo, `SELECT * FROM` é malformado, e o Instrument `statement/sql/error` é usado. Em contraste, `SELECT *` é analisado, mas falha com um erro `No tables used`. Neste caso, `statement/sql/select` é usado e o Statement Event contém informações para indicar a natureza do erro.

Uma request pode ser obtida de qualquer uma destas fontes:

* Como um comando ou Statement request de um cliente, que envia a request como packets.

* Como uma Statement string lida do relay log em uma replica.
* Como um Event do Event Scheduler.

Os detalhes de uma request não são inicialmente conhecidos e o Performance Schema procede de nomes de Instrument abstratos para específicos em uma sequência que depende da origem da request.

Para uma request recebida de um cliente:

1. Quando o servidor detecta um novo packet no nível do socket, um novo Statement é iniciado com um nome de Instrument abstrato de `statement/abstract/new_packet`.

2. Quando o servidor lê o número do packet, ele sabe mais sobre o tipo de request recebida, e o Performance Schema refina o nome do Instrument. Por exemplo, se a request for um packet `COM_PING`, o nome do Instrument se torna `statement/com/Ping` e esse é o nome final. Se a request for um packet `COM_QUERY`, sabe-se que corresponde a um SQL Statement, mas não o tipo particular de Statement. Neste caso, o Instrument muda de um nome abstrato para um nome mais específico, mas ainda abstrato, `statement/abstract/Query`, e a request requer classificação adicional.

3. Se a request for um Statement, o Statement text é lido e entregue ao parser. Após o Parsing, o tipo exato de Statement é conhecido. Se a request for, por exemplo, um Statement [`INSERT`](insert.html "13.2.5 INSERT Statement"), o Performance Schema refina o nome do Instrument de `statement/abstract/Query` para `statement/sql/insert`, que é o nome final.

Para uma request lida como um Statement do relay log em uma replica:

1. Statements no relay log são armazenados como texto e são lidos como tal. Não há protocolo de rede, portanto o Instrument `statement/abstract/new_packet` não é usado. Em vez disso, o Instrument inicial é `statement/abstract/relay_log`.

2. Quando o Statement é analisado (parsed), o tipo exato de Statement é conhecido. Se a request for, por exemplo, um Statement [`INSERT`](insert.html "13.2.5 INSERT Statement"), o Performance Schema refina o nome do Instrument de `statement/abstract/Query` para `statement/sql/insert`, que é o nome final.

A descrição anterior se aplica apenas à replicação baseada em Statement. Para replicação baseada em Row, o I/O da tabela feito na replica enquanto processa as alterações de row pode ser instrumentado, mas os Row Events no relay log não aparecem como Statements discretos.

Para uma request recebida do Event Scheduler:

A execução do Event é instrumentada usando o nome `statement/scheduler/event`. Este é o nome final.

Statements executados dentro do corpo do Event são instrumentados usando nomes `statement/sql/*`, sem o uso de qualquer Instrument abstrato precedente. Um Event é um stored program, e stored programs são pré-compilados na memória antes da execução. Consequentemente, não há Parsing em tempo de execução (runtime) e o tipo de cada Statement é conhecido no momento em que é executado.

Statements executados dentro do corpo do Event são child statements (Statements filhos). Por exemplo, se um Event executa um Statement [`INSERT`](insert.html "13.2.5 INSERT Statement"), a execução do Event em si é o parent (pai), instrumentado usando `statement/scheduler/event`, e o [`INSERT`] é o child, instrumentado usando `statement/sql/insert`. A relação parent/child é válida *entre* operações instrumentadas separadas. Isso difere da sequência de refinamento que ocorre *dentro* de uma única operação instrumentada, de nomes de Instrument abstratos para finais.

Para que as estatísticas de Statements sejam coletadas, não é suficiente habilitar apenas os Instruments finais `statement/sql/*` usados para tipos de Statement individuais. Os Instruments abstratos `statement/abstract/*` também devem ser habilitados. Isso normalmente não deve ser um problema, pois todos os Statement Instruments são habilitados por padrão. No entanto, uma aplicação que habilita ou desabilita Statement Instruments seletivamente deve levar em consideração que desabilitar Instruments abstratos também desabilita a coleta de estatísticas para os Statement Instruments individuais. Por exemplo, para coletar estatísticas para Statements [`INSERT`], `statement/sql/insert` deve ser habilitado, mas também `statement/abstract/new_packet` e `statement/abstract/Query`. Da mesma forma, para que Statements replicados sejam instrumentados, `statement/abstract/relay_log` deve ser habilitado.

Nenhuma estatística é agregada para Instruments abstratos como `statement/abstract/Query`, pois nenhum Statement é classificado com um Instrument abstrato como nome final do Statement.