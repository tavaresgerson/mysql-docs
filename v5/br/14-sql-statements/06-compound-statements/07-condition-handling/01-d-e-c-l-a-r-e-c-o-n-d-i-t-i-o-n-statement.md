#### 13.6.7.1 DECLARE ... CONDITION Statement

```sql
DECLARE condition_name CONDITION FOR condition_value

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
}
```

A instrução [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement") declara uma Condition de erro nomeada, associando um nome a uma Condition que precisa de um Handler específico. O nome pode ser referenciado em uma instrução [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement") subsequente (veja [Seção 13.6.7.2, “DECLARE ... HANDLER Statement”](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement")).

Declarações de Condition devem aparecer antes de declarações de Cursor ou Handler.

O *`condition_value`* para [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement") indica a Condition específica ou classe de Conditions a ser associada ao nome da Condition. Ele pode assumir as seguintes formas:

* *`mysql_error_code`*: Um literal inteiro que indica um MySQL error code.

  Não use o MySQL error code 0, pois ele indica sucesso em vez de uma Condition de erro. Para obter uma lista de MySQL error codes, consulte [Referência de Mensagens de Erro do Servidor](/doc/mysql-errors/5.7/en/server-error-reference.html).

* SQLSTATE [VALUE] *`sqlstate_value`*: Um literal de string de 5 caracteres indicando um SQLSTATE value.

  Não use SQLSTATE values que comecem com `'00'`, pois eles indicam sucesso em vez de uma Condition de erro. Para obter uma lista de SQLSTATE values, consulte [Referência de Mensagens de Erro do Servidor](/doc/mysql-errors/5.7/en/server-error-reference.html).

Nomes de Condition referenciados nas instruções [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") ou [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") devem ser associados a SQLSTATE values, e não a MySQL error codes.

Usar nomes para Conditions pode ajudar a tornar o código de programas armazenados mais claro. Por exemplo, este Handler se aplica a tentativas de fazer DROP em uma tabela inexistente, mas isso só fica aparente se você souber que 1051 é o MySQL error code para "unknown table":

```sql
DECLARE CONTINUE HANDLER FOR 1051
  BEGIN
    -- body of handler
  END;
```

Ao declarar um nome para a Condition, o propósito do Handler é mais facilmente percebido:

```sql
DECLARE no_such_table CONDITION FOR 1051;
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```

Aqui está uma Condition nomeada para a mesma Condition, mas baseada no SQLSTATE value correspondente em vez do MySQL error code:

```sql
DECLARE no_such_table CONDITION FOR SQLSTATE '42S02';
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```
