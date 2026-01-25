#### 16.4.1.16 Replicação de Recursos Invocados

A Replicação de recursos invocados, como loadable functions e stored programs (stored procedures e functions, triggers e events), oferece as seguintes características:

* Os efeitos do recurso são sempre replicados.
* As seguintes Statements são replicadas utilizando statement-based replication:

  + [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement")
  + [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement")
  + [`DROP EVENT`](drop-event.html "13.1.23 DROP EVENT Statement")
  + [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements")
  + [`DROP PROCEDURE`](drop-procedure.html "13.1.27 DROP PROCEDURE and DROP FUNCTION Statements")
  + [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement")
  + [`DROP FUNCTION`](drop-function.html "13.1.24 DROP FUNCTION Statement")
  + [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement")
  + [`DROP TRIGGER`](drop-trigger.html "13.1.31 DROP TRIGGER Statement")

  Entretanto, os *efeitos* dos recursos criados, modificados ou descartados utilizando estas Statements são replicados utilizando row-based replication.

  Nota

  A tentativa de replicar recursos invocados utilizando statement-based replication produz o aviso Statement is not safe to log in statement format. Por exemplo, tentar replicar uma loadable function com statement-based replication gera este aviso porque, atualmente, o MySQL server não consegue determinar se a function é determinística. Se você tiver certeza absoluta de que os efeitos do recurso invocado são determinísticos, você pode desconsiderar tais avisos com segurança.

* No caso de [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") e [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement"):

  + O status do event é definido como `SLAVESIDE_DISABLED` na Replica, independentemente do estado especificado (isto não se aplica a [`DROP EVENT`](drop-event.html "13.1.23 DROP EVENT Statement")).

  + O Source onde o event foi criado é identificado na Replica por seu Server ID. A coluna `ORIGINATOR` na tabela Information Schema [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") e a coluna `originator` em `mysql.event` armazenam esta informação. Consulte [Seção 24.3.8, “The INFORMATION_SCHEMA EVENTS Table”](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") e [Seção 13.7.5.18, “SHOW EVENTS Statement”](show-events.html "13.7.5.18 SHOW EVENTS Statement"), para mais informações.

* A implementação do recurso reside na Replica em um estado renovável, de modo que, se o Source falhar, a Replica possa ser usada como Source sem perda do processamento de Event.

Para determinar se há algum scheduled event em um MySQL server que foi criado em um Server diferente (que estava atuando como um replication source server), consulte a tabela Information Schema [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") de maneira semelhante ao que é mostrado aqui:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Alternativamente, você pode usar a Statement [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement"), desta forma:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Ao promover uma Replica que possui tais Events para um replication source server, você deve habilitar cada Event usando [`ALTER EVENT event_name ENABLE`](alter-event.html "13.1.2 ALTER EVENT Statement"), onde *`event_name`* é o nome do Event.

Se mais de um Source estiver envolvido na criação de Events nesta Replica, e você desejar identificar Events que foram criados apenas em um determinado Source que possui o Server ID *`source_id`*, modifique a Query anterior na tabela [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") para incluir a coluna `ORIGINATOR`, conforme mostrado aqui:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME, ORIGINATOR
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Você pode empregar `ORIGINATOR` com a Statement [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") de maneira semelhante:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Antes de habilitar Events que foram replicados do Source, você deve desabilitar o MySQL Event Scheduler na Replica (usando uma Statement como `SET GLOBAL event_scheduler = OFF;`), executar quaisquer Statements [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") necessárias, reiniciar o Server e, em seguida, reabilitar o Event Scheduler na Replica (usando uma Statement como `SET GLOBAL event_scheduler = ON;`)-

Se você mais tarde rebaixar o novo Source para ser uma Replica novamente, você deve desabilitar manualmente todos os Events habilitados pelas Statements [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement"). Você pode fazer isso armazenando em uma tabela separada os nomes dos Events da Statement [`SELECT`](select.html "13.2.9 SELECT Statement") mostrada anteriormente, ou usando Statements [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") para renomear os Events com um prefixo comum, como `replicated_`, para identificá-los.

Se você renomear os Events, ao rebaixar este Server para ser uma Replica novamente, você pode identificar os Events consultando a tabela [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table"), conforme mostrado aqui:

```sql
SELECT CONCAT(EVENT_SCHEMA, '.', EVENT_NAME) AS 'Db.Event'
      FROM INFORMATION_SCHEMA.EVENTS
      WHERE INSTR(EVENT_NAME, 'replicated_') = 1;
```