#### 13.7.5.18 DESCRIÇÃO DOS EVENTOS DE EXPOSIÇÃO

```sql
SHOW EVENTS
    [{FROM | IN} schema_name]
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração exibe informações sobre os eventos do Gerenciador de Eventos, que são discutidos em Seção 23.4, “Usando o Agendamento de Eventos”. Ela requer o privilégio `EVENT` para o banco de dados a partir do qual os eventos devem ser exibidos.

Na sua forma mais simples, `SHOW EVENTS` lista todos os eventos no esquema atual:

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

Para ver eventos de um esquema específico, use a cláusula `FROM`. Por exemplo, para ver eventos do esquema `test`, use a seguinte declaração:

```sql
SHOW EVENTS FROM test;
```

A cláusula `LIKE`, se presente, indica quais nomes de eventos devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

A saída `SHOW EVENTS` tem essas colunas:

- `Db`

  O nome do esquema (banco de dados) ao qual o evento pertence.

- `Nome`

  O nome do evento.

- `Definer`

  A conta do usuário que criou o evento, no formato `'user_name'@'host_name'`.

- `Fuso horário`

  O fuso horário do evento, que é o fuso horário usado para agendar o evento e que está em vigor durante a execução do evento. O valor padrão é `SISTEMA`.

- `Tipo`

  O tipo de repetição do evento, seja `ONE TIME` (transitório) ou `RECURRING` (repetitivo).

- `Execute em`

  Para um evento único, esse é o valor de `DATETIME` especificado na cláusula `AT` da instrução `CREATE EVENT` (criar evento) usada para criar o evento, ou da última instrução `ALTER EVENT` (alterar evento) que modificou o evento. O valor exibido nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento é criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor exibido nesta coluna seria `'2018-02-10 20:05:30'`. Se o cronograma do evento for determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento for recorrente), o valor desta coluna é `NULL`.

- `Valor de intervalo`

  Para um evento recorrente, o número de intervalos a serem esperados entre as execuções do evento. Para um evento transitório, o valor desta coluna é sempre `NULL`.

- Campo de intervalo

  As unidades de tempo usadas para o intervalo que um evento recorrente espera antes de se repetir. Para um evento transitório, o valor desta coluna é sempre `NULL`.

- Começa

  A data e a hora de início de um evento recorrente. Isso é exibido como um valor de `DATETIME` e é `NULL` se nenhuma data e hora de início forem definidas para o evento. Para um evento transitório, essa coluna é sempre `NULL`. Para um evento recorrente cuja definição inclui uma cláusula `STARTS`, essa coluna contém o valor correspondente de `DATETIME`. Como com a coluna `Execute At`, esse valor resolve quaisquer expressões usadas. Se não houver uma cláusula `STARTS` afetando o momento do evento, essa coluna é `NULL`

- `Termina`

  Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor correspondente de `DATETIME`. Como com a coluna `Execute At`, este valor resolve quaisquer expressões usadas. Se não houver uma cláusula `ENDS` que afete o momento do evento, esta coluna é `NULL`.

- `Status`

  O status do evento. Um dos valores `ENABLED`, `DISABLED` ou `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL que atua como fonte de replicação e foi replicada para o servidor MySQL atual que está atuando como replica, mas o evento não está sendo executado no momento na replica. Para mais informações, consulte Seção 16.4.1.16, “Replicação de Recursos Convocados”.

- "Originador"

  O ID do servidor do MySQL no qual o evento foi criado; usado na replicação. Esse valor pode ser atualizado por `ALTER EVENT` para o ID do servidor no qual aquela declaração ocorre, se executada em um servidor de origem. O valor padrão é 0.

- `character_set_client`

  O valor da sessão da variável de sistema `character_set_client` quando o evento foi criado.

- `collation_connection`

  O valor da sessão da variável de sistema `collation_connection` quando o evento foi criado.

- `Colagem de banco de dados`

  A agregação do banco de dados com o qual o evento está associado.

Para obter mais informações sobre `SLAVESIDE_DISABLED` e a coluna `Originator`, consulte Seção 16.4.1.16, “Replicação de Recursos Convocados”.

Os horários exibidos em `SHOW EVENTS` são fornecidos no fuso horário do evento, conforme discutido em Seção 23.4.4, “Metadados do Evento”.

As informações sobre eventos também estão disponíveis na tabela `INFORMATION_SCHEMA` `EVENTS`. Veja Seção 24.3.8, “A Tabela INFORMATION\_SCHEMA EVENTS”.

A declaração de ação do evento não é exibida na saída de `SHOW EVENTS`. Use `SHOW CREATE EVENT` ou a tabela `INFORMATION_SCHEMA` `EVENTS`.
