#### 15.7.7.20 EVENTOS DE MOSTRA Declaração

```
SHOW EVENTS
    [{FROM | IN} schema_name]
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração exibe informações sobre os eventos do Gerenciador de Eventos, que são discutidos na Seção 27.5, “Usando o Agendamento de Eventos”. Ela requer o privilégio `EVENT` para o banco de dados a partir do qual os eventos devem ser exibidos.

Em sua forma mais simples, `SHOW EVENTS` lista todos os eventos no esquema atual:

```
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
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

Para ver eventos para um esquema específico, use a cláusula `FROM`. Por exemplo, para ver eventos para o esquema `test`, use a seguinte declaração:

```
SHOW EVENTS FROM test;
```

A cláusula `LIKE`, se presente, indica quais nomes de eventos devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas usando condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

A saída de `SHOW EVENTS` tem essas colunas:

* `Db`

  O nome do esquema (banco de dados) ao qual o evento pertence.

* `Name`

  O nome do evento.

* `Definer`

  A conta do usuário que criou o evento, no formato `'user_name'@'host_name'`.

* `Time zone`

  O fuso horário do evento, que é o fuso horário usado para agendar o evento e que está em vigor dentro do evento conforme ele é executado. O valor padrão é `SYSTEM`.

* `Type`

  O tipo de repetição do evento, seja `ONE TIME` (transitório) ou `RECURRING` (repetitivo).

* `Execute At`

Para um evento único, este é o valor `DATETIME` especificado na cláusula `AT` da instrução `CREATE EVENT` usada para criar o evento, ou da última instrução `ALTER EVENT` que modificou o evento. O valor exibido nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento é criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor exibido nesta coluna seria `'2018-02-10 20:05:30'`. Se o cronograma do evento for determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento for recorrente), o valor desta coluna é `NULL`.

* `Valor do Intervalo`

  Para um evento recorrente, o número de intervalos a serem esperados entre as execuções do evento. Para um evento transitório, o valor desta coluna é sempre `NULL`.

* `Campo do Intervalo`

  As unidades de tempo usadas para o intervalo que um evento recorrente espera antes de se repetir. Para um evento transitório, o valor desta coluna é sempre `NULL`.

* `Começa`

  A data e hora de início de um evento recorrente. Isso é exibido como um valor `DATETIME`, e é `NULL` se nenhuma data e hora de início forem definidas para o evento. Para um evento transitório, esta coluna é sempre `NULL`. Para um evento recorrente cuja definição inclui uma cláusula `STARTS`, esta coluna contém o valor `DATETIME` correspondente. Como com a coluna `Execute At`, este valor resolve quaisquer expressões usadas. Se não houver uma cláusula `STARTS` afetando o cronograma do evento, esta coluna é `NULL`

* `Termina`

Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor correspondente `DATETIME`. Como com a coluna `Execute At`, este valor resolve quaisquer expressões usadas. Se não houver uma cláusula `ENDS` que afete o momento do evento, esta coluna é `NULL`.

* `Status`

  O status do evento. Um dos valores `ENABLED`, `DISABLED` ou `REPLICA_SIDE_DISABLED`. `REPLICA_SIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL que atua como fonte de replicação e foi replicada para o servidor MySQL atual que está atuando como replica, mas o evento não está sendo executado atualmente na replica. Para mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

  `REPLICA_SIDE_DISABLED` substitui `SLAVESIDE_DISABLED`, que agora está desatualizado e sujeito à remoção em uma versão futura do MySQL.

* `Originator`

  O ID do servidor do servidor MySQL em que o evento foi criado; usado na replicação. Este valor pode ser atualizado por `ALTER EVENT` para o ID do servidor do servidor em que a declaração ocorre, se executada em um servidor de origem. O valor padrão é 0.

* `character_set_client`

  O valor de sessão da variável de sistema `character_set_client` quando o evento foi criado.

* `collation_connection`

  O valor de sessão da variável de sistema `collation_connection` quando o evento foi criado.

* `Database Collation`

  A collation do banco de dados com o qual o evento está associado.

Para mais informações sobre `REPLICA_SIDE_DISABLED` e a coluna `Originator`, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Os tempos exibidos por `SHOW EVENTS` são fornecidos no fuso horário do evento, conforme discutido na Seção 27.5.4, “Metadados do Evento”.

As informações sobre eventos também estão disponíveis na tabela `INFORMATION_SCHEMA` `EVENTS`. Veja a Seção 28.3.14, “A tabela INFORMATION_SCHEMA EVENTS”.

A declaração de ação do evento não é exibida na saída do `SHOW EVENTS`. Use `SHOW CREATE EVENT` ou a tabela `EVENTS` da `INFORMATION_SCHEMA`.