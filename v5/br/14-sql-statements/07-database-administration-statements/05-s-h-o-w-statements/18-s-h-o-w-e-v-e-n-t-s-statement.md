#### 13.7.5.18 Declaração SHOW EVENTS

```sql
SHOW EVENTS
    [{FROM | IN} schema_name]
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração exibe informações sobre eventos do Event Manager, que são discutidos na [Seção 23.4, “Usando o Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler"). Ela requer o privilégio [`EVENT`](privileges-provided.html#priv_event) para o Database do qual os eventos devem ser mostrados.

Em sua forma mais simples, [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") lista todos os eventos no schema atual:

```sql
mysql> SELECT CURRENT_USER(), SCHEMA();
+----------------+----------+
| CURRENT_USER() | SCHEMA() |
+----------------+----------+
| jon@ghidora    | myschema |
+----------------+----------+
1 row in set (0.00 sec)

mysql> SHOW EVENTS\G
*************************** 1. row ***************************
                  Db: myschema
                Name: e_daily
             Definer: jon@ghidora
           Time zone: SYSTEM
                Type: RECURRING
          Execute at: NULL
      Interval value: 1
      Interval field: DAY
              Starts: 2018-08-08 11:06:34
                Ends: NULL
              Status: ENABLED
          Originator: 1
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

Para ver eventos de um schema específico, use a cláusula `FROM`. Por exemplo, para ver eventos para o schema `test`, use a seguinte declaração:

```sql
SHOW EVENTS FROM test;
```

A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de evento devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensões para Declarações SHOW”](extended-show.html "24.8 Extensions to SHOW Statements").

A saída de [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") possui estas colunas:

* `Db`

  O nome do schema (Database) ao qual o evento pertence.

* `Name`

  O nome do evento.

* `Definer`

  A conta do usuário que criou o evento, no formato `'user_name'@'host_name'`.

* `Time zone`

  O time zone do evento, que é o time zone usado para agendar o evento e que está em vigor dentro do evento enquanto ele é executado. O valor default é `SYSTEM`.

* `Type`

  O tipo de repetição do evento, ou `ONE TIME` (transiente) ou `RECURRING` (repetitivo).

* `Execute At`

  Para um evento de execução única, este é o valor [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") especificado na cláusula `AT` da declaração [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") usada para criar o evento, ou da última declaração [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") que modificou o evento. O valor exibido nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento for criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor exibido nesta coluna seria `'2018-02-10 20:05:30'`. Se o tempo do evento for determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento for `recurring`), o valor desta coluna é `NULL`.

* `Interval Value`

  Para um evento recorrente, o número de intervalos a aguardar entre as execuções do evento. Para um evento transiente, o valor desta coluna é sempre `NULL`.

* `Interval Field`

  As unidades de tempo usadas para o intervalo que um evento recorrente aguarda antes de se repetir. Para um evento transiente, o valor desta coluna é sempre `NULL`.

* `Starts`

  A data e hora de início para um evento recorrente. Isso é exibido como um valor [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e é `NULL` se nenhuma data e hora de início for definida para o evento. Para um evento transiente, esta coluna é sempre `NULL`. Para um evento recorrente cuja definição inclui uma cláusula `STARTS`, esta coluna contém o valor [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") correspondente. Assim como na coluna `Execute At`, este valor resolve quaisquer expressões utilizadas. Se não houver uma cláusula `STARTS` afetando o tempo do evento, esta coluna é `NULL`.

* `Ends`

  Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") correspondente. Assim como na coluna `Execute At`, este valor resolve quaisquer expressões utilizadas. Se não houver uma cláusula `ENDS` afetando o tempo do evento, esta coluna é `NULL`.

* `Status`

  O status do evento. Um de `ENABLED`, `DISABLED` ou `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL atuando como uma fonte de Replication e foi replicado para o servidor MySQL atual que está atuando como uma replica, mas o evento não está sendo executado no momento na replica. Para mais informações, consulte [Seção 16.4.1.16, “Replication de Funcionalidades Invocadas”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features").

* `Originator`

  O Server ID do servidor MySQL no qual o evento foi criado; usado na Replication. Este valor pode ser atualizado por [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") para o Server ID do servidor no qual essa declaração ocorre, se executada em um servidor source. O valor default é 0.

* `character_set_client`

  O valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando o evento foi criado.

* `collation_connection`

  O valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando o evento foi criado.

* `Database Collation`

  A collation do Database ao qual o evento está associado.

Para mais informações sobre `SLAVESIDE_DISABLED` e a coluna `Originator`, consulte [Seção 16.4.1.16, “Replication de Funcionalidades Invocadas”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features").

Os horários exibidos por [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") são fornecidos no time zone do evento, conforme discutido na [Seção 23.4.4, “Metadados de Eventos”](events-metadata.html "23.4.4 Event Metadata").

As informações do evento também estão disponíveis na tabela `INFORMATION_SCHEMA` [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table"). Consulte [Seção 24.3.8, “A Tabela INFORMATION_SCHEMA EVENTS”](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table").

A declaração de ação do evento não é exibida na saída de [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement"). Use [`SHOW CREATE EVENT`](show-create-event.html "13.7.5.7 SHOW CREATE EVENT Statement") ou a tabela `INFORMATION_SCHEMA` [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table").