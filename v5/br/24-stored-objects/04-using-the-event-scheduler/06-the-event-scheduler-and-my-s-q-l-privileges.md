### 23.4.6 O Agendamento de Eventos e Permissões do MySQL

Para habilitar ou desabilitar a execução de eventos agendados, é necessário definir o valor da variável de sistema global `event_scheduler`. Isso requer privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

O privilégio `EVENT` rege a criação, modificação e exclusão de eventos. Este privilégio pode ser concedido usando `GRANT`. Por exemplo, esta declaração `GRANT` confere o privilégio `EVENT` para o esquema chamado `myschema` para o usuário `jon@ghidora`:

```sql
GRANT EVENT ON myschema.* TO jon@ghidora;
```

(Suponhamos que essa conta de usuário já exista e que queiramos que ela permaneça inalterada, caso contrário.)

Para conceder ao mesmo usuário o privilégio `EVENT` em todos os esquemas, use a seguinte declaração:

```sql
GRANT EVENT ON *.* TO jon@ghidora;
```

O privilégio `EVENT` tem escopo global ou de nível de esquema. Portanto, tentar concedê-lo em uma única tabela resulta em um erro, conforme mostrado:

```sql
mysql> GRANT EVENT ON myschema.mytable TO jon@ghidora;
ERROR 1144 (42000): Illegal GRANT/REVOKE command; please
consult the manual to see which privileges can be used
```

É importante entender que um evento é executado com os privilégios do seu definidor e que ele não pode realizar nenhuma ação para a qual seu definidor não tenha os privilégios necessários. Por exemplo, suponha que `jon@ghidora` tenha o privilégio `EVENT` para `myschema`. Suponha também que esse usuário tenha o privilégio `SELECT` para `myschema`, mas nenhum outro privilégio para esse esquema. É possível que `jon@ghidora` crie um novo evento como este:

```sql
CREATE EVENT e_store_ts
    ON SCHEDULE
      EVERY 10 SECOND
    DO
      INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
```

O usuário espera por cerca de um minuto e, em seguida, executa uma consulta `SELECT * FROM mytable;`, esperando ver várias novas linhas na tabela. Em vez disso, a tabela está vazia. Como o usuário não tem o privilégio de `INSERT` para a tabela em questão, o evento não tem efeito.

Se você verificar o log de erros do MySQL (`hostname.err`), você pode ver que o evento está sendo executado, mas a ação que ele está tentando realizar falha:

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

Como esse usuário provavelmente não tem acesso ao log de erros, é possível verificar se a declaração de ação do evento é válida executando-a diretamente:

```sql
mysql> INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
ERROR 1142 (42000): INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
```

A inspeção da tabela do esquema de informações `EVENTS` mostra que `e_store_ts` existe e está habilitada, mas sua coluna `LAST_EXECUTED` está em `NULL`:

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

Para revogar o privilégio `EVENT`, use a instrução `REVOKE`. Neste exemplo, o privilégio `EVENT` no esquema `myschema` é removido da conta de usuário `jon@ghidora`:

```sql
REVOKE EVENT ON myschema.* FROM jon@ghidora;
```

Importante

Retirar o privilégio `EVENT` de um usuário não exclui ou desabilita quaisquer eventos que possam ter sido criados por esse usuário.

Um evento não é migrado ou excluído como resultado da renomeação ou exclusão do usuário que o criou.

Suponha que o usuário `jon@ghidora` tenha sido concedido os privilégios `EVENT` e `INSERT` no esquema `myschema`. Esse usuário, então, cria o seguinte evento:

```sql
CREATE EVENT e_insert
    ON SCHEDULE
      EVERY 7 SECOND
    DO
      INSERT INTO myschema.mytable;
```

Após a criação desse evento, o `root` revoga o privilégio `EVENT` para `jon@ghidora`. No entanto, `e_insert` continua a ser executado, inserindo uma nova linha na `mytable` a cada sete segundos. O mesmo aconteceria se o `root` tivesse emitido qualquer uma dessas declarações:

- `DROP USER jon@ghidora;`
- `RENOMEIE o usuário jon@ghidora para someotherguy@ghidora;`

Você pode verificar se isso é verdade examinando a tabela `mysql.event` (discutida mais adiante nesta seção) ou a tabela `EVENTS` do Schema de Informações antes e depois de emitir uma declaração `DROP USER` ou `RENAME USER`.

As definições dos eventos são armazenadas na tabela `mysql.event`. Para excluir um evento criado por outra conta de usuário, o usuário `root` do MySQL (ou outro usuário com os privilégios necessários) pode excluir linhas dessa tabela. Por exemplo, para remover o evento `e_insert` mostrado anteriormente, o `root` pode usar a seguinte instrução:

```sql
DELETE FROM mysql.event
    WHERE db = 'myschema'
      AND name = 'e_insert';
```

É muito importante combinar o nome do evento e o nome do esquema do banco de dados ao excluir linhas da tabela `mysql.event`. Isso ocorre porque diferentes eventos com o mesmo nome podem existir em diferentes esquemas.

Os privilégios `EVENT` dos usuários são armazenados nas colunas `Event_priv` das tabelas `mysql.user` e `mysql.db`. Em ambos os casos, essa coluna contém um dos valores `'Y'` ou `'N'`. `'N'` é o padrão. `mysql.user.Event_priv` é definido como `'Y'` para um usuário específico apenas se esse usuário tiver o privilégio global `EVENT` (ou seja, se o privilégio foi concedido usando `GRANT EVENT ON *.*`). Para um privilégio `EVENT` em nível de esquema, o `GRANT` cria uma linha na `mysql.db` e define a coluna `Db` dessa linha para o nome do esquema, a coluna `User` para o nome do usuário e a coluna `Event_priv` para `'Y'`. Nunca haverá necessidade de manipular essas tabelas diretamente, uma vez que as instruções `GRANT EVENT` e `REVOKE EVENT` realizam as operações necessárias nelas.

Cinco variáveis de status fornecem contagens de operações relacionadas a eventos (mas *não* de declarações executadas por eventos; veja a Seção 23.8, “Restrições sobre Programas Armazenados”). Elas são:

- `Com_create_event`: O número de declarações `CREATE EVENT` executadas desde o último reinício do servidor.

- `Com_alter_event`: O número de declarações `ALTER EVENT` executadas desde o último reinício do servidor.

- `Com_drop_event`: O número de declarações `DROP EVENT` executadas desde o último reinício do servidor.

- `Com_show_create_event`: O número de declarações `SHOW CREATE EVENT` executadas desde o último reinício do servidor.

- `Com_show_events`: O número de declarações `SHOW EVENTS` executadas desde o último reinício do servidor.

Você pode visualizar os valores atuais para todos esses itens de uma só vez, executando a instrução `SHOW STATUS LIKE '%event%';`.
