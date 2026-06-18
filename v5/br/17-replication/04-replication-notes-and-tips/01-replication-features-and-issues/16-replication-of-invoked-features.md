#### 16.4.1.16 Replicação de Recursos Invocados

A Replicação de recursos invocados, como loadable functions e stored programs (stored procedures e functions, triggers e events), oferece as seguintes características:

* Os efeitos do recurso são sempre replicados.
* As seguintes Statements são replicadas utilizando statement-based replication:

  + `CREATE EVENT`
  + `ALTER EVENT`
  + `DROP EVENT`
  + `CREATE PROCEDURE`
  + `DROP PROCEDURE`
  + `CREATE FUNCTION`
  + `DROP FUNCTION`
  + `CREATE TRIGGER`
  + `DROP TRIGGER`

  Entretanto, os *efeitos* dos recursos criados, modificados ou descartados utilizando estas Statements são replicados utilizando row-based replication.

  Nota

  A tentativa de replicar recursos invocados utilizando statement-based replication produz o aviso Statement is not safe to log in statement format. Por exemplo, tentar replicar uma loadable function com statement-based replication gera este aviso porque, atualmente, o MySQL server não consegue determinar se a function é determinística. Se você tiver certeza absoluta de que os efeitos do recurso invocado são determinísticos, você pode desconsiderar tais avisos com segurança.

* No caso de `CREATE EVENT` e `ALTER EVENT`:

  + O status do event é definido como `SLAVESIDE_DISABLED` na Replica, independentemente do estado especificado (isto não se aplica a `DROP EVENT`).

  + O Source onde o event foi criado é identificado na Replica por seu Server ID. A coluna `ORIGINATOR` na tabela Information Schema `EVENTS` e a coluna `originator` em `mysql.event` armazenam esta informação. Consulte Seção 24.3.8, “The INFORMATION_SCHEMA EVENTS Table” e Seção 13.7.5.18, “SHOW EVENTS Statement”, para mais informações.

* A implementação do recurso reside na Replica em um estado renovável, de modo que, se o Source falhar, a Replica possa ser usada como Source sem perda do processamento de Event.

Para determinar se há algum scheduled event em um MySQL server que foi criado em um Server diferente (que estava atuando como um replication source server), consulte a tabela Information Schema `EVENTS` de maneira semelhante ao que é mostrado aqui:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Alternativamente, você pode usar a Statement `SHOW EVENTS`, desta forma:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Ao promover uma Replica que possui tais Events para um replication source server, você deve habilitar cada Event usando `ALTER EVENT event_name ENABLE`, onde *`event_name`* é o nome do Event.

Se mais de um Source estiver envolvido na criação de Events nesta Replica, e você desejar identificar Events que foram criados apenas em um determinado Source que possui o Server ID *`source_id`*, modifique a Query anterior na tabela `EVENTS` para incluir a coluna `ORIGINATOR`, conforme mostrado aqui:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME, ORIGINATOR
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Você pode empregar `ORIGINATOR` com a Statement `SHOW EVENTS` de maneira semelhante:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Antes de habilitar Events que foram replicados do Source, você deve desabilitar o MySQL Event Scheduler na Replica (usando uma Statement como `SET GLOBAL event_scheduler = OFF;`), executar quaisquer Statements `ALTER EVENT` necessárias, reiniciar o Server e, em seguida, reabilitar o Event Scheduler na Replica (usando uma Statement como `SET GLOBAL event_scheduler = ON;`)-

Se você mais tarde rebaixar o novo Source para ser uma Replica novamente, você deve desabilitar manualmente todos os Events habilitados pelas Statements `ALTER EVENT`. Você pode fazer isso armazenando em uma tabela separada os nomes dos Events da Statement `SELECT` mostrada anteriormente, ou usando Statements `ALTER EVENT` para renomear os Events com um prefixo comum, como `replicated_`, para identificá-los.

Se você renomear os Events, ao rebaixar este Server para ser uma Replica novamente, você pode identificar os Events consultando a tabela `EVENTS`, conforme mostrado aqui:

```sql
SELECT CONCAT(EVENT_SCHEMA, '.', EVENT_NAME) AS 'Db.Event'
      FROM INFORMATION_SCHEMA.EVENTS
      WHERE INSTR(EVENT_NAME, 'replicated_') = 1;
```