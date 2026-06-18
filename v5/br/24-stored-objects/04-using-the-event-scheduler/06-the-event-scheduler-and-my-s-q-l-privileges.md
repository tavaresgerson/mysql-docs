### 23.4.6 O Event Scheduler e os Privilégios do MySQL

Para habilitar ou desabilitar a execução de eventos agendados, é necessário definir o valor da variável de sistema global `event_scheduler`. Isso exige privilégios suficientes para definir variáveis de sistema globais. Veja Seção 5.1.8.1, “System Variable Privileges”.

O privilégio `EVENT` governa a criação, modificação e exclusão de eventos. Este privilégio pode ser concedido usando `GRANT`. Por exemplo, esta instrução `GRANT` confere o privilégio `EVENT` para o schema chamado `myschema` ao usuário `jon@ghidora`:

```sql
GRANT EVENT ON myschema.* TO jon@ghidora;
```

(Assumimos que esta conta de usuário já existe e que não desejamos alterá-la de outra forma.)

Para conceder a este mesmo usuário o privilégio `EVENT` em todos os schemas, use a seguinte instrução:

```sql
GRANT EVENT ON *.* TO jon@ghidora;
```

O privilégio `EVENT` tem escopo global ou em nível de schema. Portanto, tentar concedê-lo em uma única table resulta em um erro conforme demonstrado:

```sql
mysql> GRANT EVENT ON myschema.mytable TO jon@ghidora;
ERROR 1144 (42000): Illegal GRANT/REVOKE command; please
consult the manual to see which privileges can be used
```

É importante entender que um event é executado com os privilégios do seu *definer*, e que ele não pode realizar nenhuma ação para a qual seu *definer* não tenha os privilégios necessários. Por exemplo, suponha que `jon@ghidora` tenha o privilégio `EVENT` para `myschema`. Suponha também que este usuário tenha o privilégio `SELECT` para `myschema`, mas nenhum outro privilégio para este schema. É possível para `jon@ghidora` criar um novo event como este:

```sql
CREATE EVENT e_store_ts
    ON SCHEDULE
      EVERY 10 SECOND
    DO
      INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
```

O usuário espera por um minuto ou mais e então executa uma Query `SELECT * FROM mytable;`, esperando ver várias novas rows na table. Em vez disso, a table está vazia. Visto que o usuário não tem o privilégio `INSERT` para a table em questão, o event não tem efeito.

Se você inspecionar o log de erros do MySQL (`hostname.err`), você pode ver que o event está sendo executado, mas a ação que ele está tentando realizar falha:

```sql
2013-09-24T12:41:31.261992Z 25 [ERROR] Event Scheduler:
[jon@ghidora][cookbook.e_store_ts] INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
2013-09-24T12:41:31.262022Z 25 [Note] Event Scheduler:
[jon@ghidora].[myschema.e_store_ts] event execution failed.
2013-09-24T12:41:41.271796Z 26 [ERROR] Event Scheduler:
[jon@ghidora][cookbook.e_store_ts] INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
2013-09-24T12:41:41.272761Z 26 [Note] Event Scheduler:
[jon@ghidora].[myschema.e_store_ts] event execution failed.
```

Visto que este usuário muito provavelmente não tem acesso ao log de erros, é possível verificar se a instrução de ação do event é válida, executando-a diretamente:

```sql
mysql> INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
ERROR 1142 (42000): INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
```

A inspeção da table `EVENTS` do Information Schema mostra que `e_store_ts` existe e está habilitado, mas sua coluna `LAST_EXECUTED` é `NULL`:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
     >     WHERE EVENT_NAME='e_store_ts'
     >     AND EVENT_SCHEMA='myschema'\G
*************************** 1. row ***************************
   EVENT_CATALOG: NULL
    EVENT_SCHEMA: myschema
      EVENT_NAME: e_store_ts
         DEFINER: jon@ghidora
      EVENT_BODY: SQL
EVENT_DEFINITION: INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP())
      EVENT_TYPE: RECURRING
      EXECUTE_AT: NULL
  INTERVAL_VALUE: 5
  INTERVAL_FIELD: SECOND
        SQL_MODE: NULL
          STARTS: 0000-00-00 00:00:00
            ENDS: 0000-00-00 00:00:00
          STATUS: ENABLED
   ON_COMPLETION: NOT PRESERVE
         CREATED: 2006-02-09 22:36:06
    LAST_ALTERED: 2006-02-09 22:36:06
   LAST_EXECUTED: NULL
   EVENT_COMMENT:
1 row in set (0.00 sec)
```

Para revogar o privilégio `EVENT`, use a instrução `REVOKE`. Neste exemplo, o privilégio `EVENT` no schema `myschema` é removido da conta de usuário `jon@ghidora`:

```sql
REVOKE EVENT ON myschema.* FROM jon@ghidora;
```

Importante

Revogar o privilégio `EVENT` de um usuário não exclui nem desabilita quaisquer events que possam ter sido criados por esse usuário.

Um event não é migrado ou descartado (*dropped*) como resultado de renomear ou descartar o usuário que o criou.

Suponha que o usuário `jon@ghidora` tenha recebido os privilégios `EVENT` e `INSERT` no schema `myschema`. Este usuário então cria o seguinte event:

```sql
CREATE EVENT e_insert
    ON SCHEDULE
      EVERY 7 SECOND
    DO
      INSERT INTO myschema.mytable;
```

Após a criação deste event, o usuário `root` revoga o privilégio `EVENT` para `jon@ghidora`. No entanto, `e_insert` continua a ser executado, inserindo uma nova row em `mytable` a cada sete segundos. O mesmo seria verdade se o `root` tivesse emitido qualquer uma destas instruções:

* `DROP USER jon@ghidora;`
* `RENAME USER jon@ghidora TO someotherguy@ghidora;`

Você pode verificar se isso é verdade examinando a table `mysql.event` (discutida posteriormente nesta seção) ou a table `EVENTS` do Information Schema antes e depois de emitir uma instrução `DROP USER` ou `RENAME USER`.

As definições de events são armazenadas na table `mysql.event`. Para dar um DROP em um event criado por outra conta de usuário, o usuário `root` do MySQL (ou outro usuário com os privilégios necessários) pode deletar rows desta table. Por exemplo, para remover o event `e_insert` mostrado anteriormente, o `root` pode usar a seguinte instrução:

```sql
DELETE FROM mysql.event
    WHERE db = 'myschema'
      AND name = 'e_insert';
```

É muito importante corresponder o nome do event e o nome do database schema ao deletar rows da table `mysql.event`. Isso ocorre porque diferentes events com o mesmo nome podem existir em schemas diferentes.

Os privilégios `EVENT` dos usuários são armazenados nas colunas `Event_priv` das tables `mysql.user` e `mysql.db`. Em ambos os casos, esta coluna armazena um dos valores '`Y`' ou '`N`'. '`N`' é o default. `mysql.user.Event_priv` é definido como '`Y`' para um determinado usuário apenas se esse usuário tiver o privilégio `EVENT` global (ou seja, se o privilégio foi concedido usando `GRANT EVENT ON *.*`). Para um privilégio `EVENT` em nível de schema, `GRANT` cria uma row em `mysql.db` e define a coluna `Db` dessa row para o nome do schema, a coluna `User` para o nome do usuário e a coluna `Event_priv` para '`Y`'. Nunca deve haver necessidade de manipular essas tables diretamente, visto que as instruções `GRANT EVENT` e `REVOKE EVENT` realizam as operações necessárias nelas.

Cinco variáveis de status fornecem contagens de operações relacionadas a events (mas *não* de instruções executadas por events; veja Seção 23.8, “Restrictions on Stored Programs”). Elas são:

* `Com_create_event`: O número de instruções `CREATE EVENT` executadas desde o último restart do servidor.

* `Com_alter_event`: O número de instruções `ALTER EVENT` executadas desde o último restart do servidor.

* `Com_drop_event`: O número de instruções `DROP EVENT` executadas desde o último restart do servidor.

* `Com_show_create_event`: O número de instruções `SHOW CREATE EVENT` executadas desde o último restart do servidor.

* `Com_show_events`: O número de instruções `SHOW EVENTS` executadas desde o último restart do servidor.

Você pode visualizar os valores atuais de todas elas de uma vez executando a instrução `SHOW STATUS LIKE '%event%';`.