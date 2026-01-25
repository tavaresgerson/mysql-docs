### 13.1.20 Instrução CREATE TRIGGER

```sql
CREATE
    [DEFINER = user]
    TRIGGER trigger_name
    trigger_time trigger_event
    ON tbl_name FOR EACH ROW
    [trigger_order]
    trigger_body

trigger_time: { BEFORE | AFTER }

trigger_event: { INSERT | UPDATE | DELETE }

trigger_order: { FOLLOWS | PRECEDES } other_trigger_name
```

Esta instrução cria um novo **Trigger**. Um **Trigger** é um objeto de **Database** nomeado que está associado a uma tabela e que é ativado quando um evento particular ocorre para a tabela. O **Trigger** é associado à tabela denominada *`tbl_name`*, que deve se referir a uma tabela permanente. Você não pode associar um **Trigger** a uma tabela `TEMPORARY` ou a uma **view**.

Nomes de **Triggers** existem no **namespace** do **schema**, o que significa que todos os **Triggers** devem ter nomes únicos dentro de um **schema**. **Triggers** em **schemas** diferentes podem ter o mesmo nome.

Esta seção descreve a sintaxe de [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement"). Para discussão adicional, consulte [Section 23.3.1, “Trigger Syntax and Examples”](trigger-syntax.html "23.3.1 Trigger Syntax and Examples").

[`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") requer o privilégio [`TRIGGER`](privileges-provided.html#priv_trigger) para a tabela associada ao **Trigger**. Se a cláusula `DEFINER` estiver presente, os privilégios exigidos dependem do valor *`user`*, conforme discutido em [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control"). Se o **binary logging** estiver habilitado, [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") pode exigir o privilégio [`SUPER`](privileges-provided.html#priv_super), conforme discutido em [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

A cláusula `DEFINER` determina o contexto de segurança a ser usado ao verificar privilégios de acesso no momento da ativação do **Trigger**, conforme descrito posteriormente nesta seção.

*`trigger_time`* é o momento da ação do **Trigger**. Pode ser `BEFORE` ou `AFTER` para indicar que o **Trigger** é ativado antes ou depois de cada linha a ser modificada.

As verificações básicas de valores de coluna ocorrem antes da ativação do **Trigger**, portanto, você não pode usar **Triggers** `BEFORE` para converter valores inapropriados para o tipo de coluna em valores válidos.

*`trigger_event`* indica o tipo de operação que ativa o **Trigger**. Estes valores de *`trigger_event`* são permitidos:

* [`INSERT`](insert.html "13.2.5 INSERT Statement"): O **Trigger** é ativado sempre que uma nova linha é inserida na tabela (por exemplo, através das instruções [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") e [`REPLACE`](replace.html "13.2.8 REPLACE Statement")).

* [`UPDATE`](update.html "13.2.11 UPDATE Statement"): O **Trigger** é ativado sempre que uma linha é modificada (por exemplo, através de instruções [`UPDATE`](update.html "13.2.11 UPDATE Statement")).

* [`DELETE`](delete.html "13.2.2 DELETE Statement"): O **Trigger** é ativado sempre que uma linha é excluída da tabela (por exemplo, através das instruções [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`REPLACE`](replace.html "13.2.8 REPLACE Statement")). As instruções [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") e [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") na tabela *não* ativam este **Trigger**, pois elas não usam [`DELETE`](delete.html "13.2.2 DELETE Statement"). Excluir uma partição também não ativa **Triggers** de [`DELETE`](delete.html "13.2.2 DELETE Statement").

O *`trigger_event`* não representa um tipo literal de instrução SQL que ativa o **Trigger**, mas sim um tipo de operação de tabela. Por exemplo, um **Trigger** [`INSERT`](insert.html "13.2.5 INSERT Statement") é ativado não apenas para instruções [`INSERT`](insert.html "13.2.5 INSERT Statement"), mas também para instruções [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), pois ambas inserem linhas em uma tabela.

Um exemplo potencialmente confuso disso é a sintaxe `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`: um **Trigger** `BEFORE INSERT` é ativado para cada linha, seguido por um **Trigger** `AFTER INSERT` ou pelos **Triggers** `BEFORE UPDATE` e `AFTER UPDATE`, dependendo se houve uma **duplicate key** para a linha.

Note

Ações de **Foreign Key** em cascata não ativam **Triggers**.

É possível definir múltiplos **Triggers** para uma determinada tabela que tenham o mesmo evento de **Trigger** e tempo de ação. Por exemplo, você pode ter dois **Triggers** `BEFORE UPDATE` para uma tabela. Por padrão, **Triggers** que têm o mesmo evento de **Trigger** e tempo de ação são ativados na ordem em que foram criados. Para afetar a ordem dos **Triggers**, especifique uma cláusula *`trigger_order`* que indique `FOLLOWS` ou `PRECEDES` e o nome de um **Trigger** existente que também tenha o mesmo evento de **Trigger** e tempo de ação. Com `FOLLOWS`, o novo **Trigger** é ativado após o **Trigger** existente. Com `PRECEDES`, o novo **Trigger** é ativado antes do **Trigger** existente.

*`trigger_body`* é a instrução a ser executada quando o **Trigger** é ativado. Para executar múltiplas instruções, use a construção de instrução composta [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement"). Isso também permite que você use as mesmas instruções que são permitidas em **stored routines**. Consulte [Section 13.6.1, “BEGIN ... END Compound Statement”](begin-end.html "13.6.1 BEGIN ... END Compound Statement"). Algumas instruções não são permitidas em **Triggers**; consulte [Section 23.8, “Restrictions on Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs").

Dentro do corpo do **Trigger**, você pode se referir a colunas na tabela em questão (a tabela associada ao **Trigger**) usando os **aliases** `OLD` e `NEW`. `OLD.col_name` se refere a uma coluna de uma linha existente antes de ser atualizada ou excluída. `NEW.col_name` se refere à coluna de uma nova linha a ser inserida ou de uma linha existente após ser atualizada.

**Triggers** não podem usar `NEW.col_name` ou `OLD.col_name` para se referir a colunas geradas. Para obter informações sobre colunas geradas, consulte [Section 13.1.18.7, “CREATE TABLE and Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

O MySQL armazena a configuração da variável de sistema [`sql_mode`](server-system-variables.html#sysvar_sql_mode) em vigor quando um **Trigger** é criado e sempre executa o corpo do **Trigger** com essa configuração ativa, *independentemente do **SQL mode** atual do **server** quando o **Trigger** começa a ser executado*.

A cláusula `DEFINER` especifica a conta MySQL a ser usada ao verificar os privilégios de acesso no momento da ativação do **Trigger**. Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, [`CURRENT_USER`](information-functions.html#function_current-user) ou [`CURRENT_USER()`](information-functions.html#function_current-user). Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido em [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control"). Consulte também essa seção para obter informações adicionais sobre a segurança de **Triggers**.

Se a cláusula `DEFINER` for omitida, o **definer** padrão é o usuário que executa a instrução [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement"). Isso é o mesmo que especificar `DEFINER = CURRENT_USER` explicitamente.

O MySQL leva o usuário `DEFINER` em consideração ao verificar os privilégios do **Trigger** da seguinte forma:

* No momento do [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement"), o usuário que emite a instrução deve ter o privilégio [`TRIGGER`](privileges-provided.html#priv_trigger).

* No momento da ativação do **Trigger**, os privilégios são verificados em relação ao usuário `DEFINER`. Este usuário deve ter os seguintes privilégios:

  + O privilégio [`TRIGGER`](privileges-provided.html#priv_trigger) para a tabela em questão.

  + O privilégio [`SELECT`](privileges-provided.html#priv_select) para a tabela em questão se referências às colunas da tabela ocorrerem usando `OLD.col_name` ou `NEW.col_name` no corpo do **Trigger**.

  + O privilégio [`UPDATE`](privileges-provided.html#priv_update) para a tabela em questão se as colunas da tabela forem alvos de atribuições `SET NEW.col_name = value` no corpo do **Trigger**.

  + Quaisquer outros privilégios que sejam normalmente exigidos para as instruções executadas pelo **Trigger**.

Dentro do corpo de um **Trigger**, a função [`CURRENT_USER`](information-functions.html#function_current-user) retorna a conta usada para verificar privilégios no momento da ativação do **Trigger**. Este é o usuário `DEFINER`, e não o usuário cujas ações causaram a ativação do **Trigger**. Para obter informações sobre auditoria de usuários em **Triggers**, consulte [Section 6.2.18, “SQL-Based Account Activity Auditing”](account-activity-auditing.html "6.2.18 SQL-Based Account Activity Auditing").

Se você usar [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") para bloquear uma tabela que possui **Triggers**, as tabelas usadas dentro do **Trigger** também são bloqueadas, conforme descrito em [LOCK TABLES and Triggers](lock-tables.html#lock-tables-and-triggers "LOCK TABLES and Triggers").

Para discussão adicional sobre o uso de **Triggers**, consulte [Section 23.3.1, “Trigger Syntax and Examples”](trigger-syntax.html "23.3.1 Trigger Syntax and Examples").