#### 13.6.7.1 DECLARAR ... Instrução de condição

```sql
DECLARE condition_name CONDITION FOR condition_value

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
}
```

A declaração `DECLARE ... CONDITION` declara uma condição de erro nomeada, associando um nome a uma condição que precisa de um tratamento específico. O nome pode ser referido numa declaração subsequente `DECLARE ... HANDLER` (ver Seção 13.6.7.2, “Declaração ... HANDLER”).

As declarações de condição devem aparecer antes das declarações de cursor ou manipulador.

O `valor_condição` para `DECLARE ... CONDITION` indica a condição específica ou a classe de condições a serem associadas ao nome da condição. Ele pode assumir as seguintes formas:

- *`mysql_error_code`*: Um literal inteiro que indica um código de erro do MySQL.

  Não use o código de erro do MySQL 0, pois ele indica sucesso em vez de uma condição de erro. Para uma lista de códigos de erro do MySQL, consulte Referência de Mensagem de Erro do Servidor.

- SQLSTATE [VALOR] *`sqlstate_value`*: Uma literal de cadeia de caracteres de 5 caracteres que indica um valor SQLSTATE.

  Não use valores SQLSTATE que comecem com `'00'`, pois esses indicam sucesso em vez de uma condição de erro. Para uma lista de valores SQLSTATE, consulte Referência de Mensagem de Erro do Servidor.

Os nomes de condição referidos em `SIGNAL` ou use as instruções `RESIGNAL` devem ser associados a valores SQLSTATE, não a códigos de erro do MySQL.

Usar nomes para condições pode ajudar a tornar o código do programa armazenado mais claro. Por exemplo, este manipulador se aplica a tentativas de excluir uma tabela inexistente, mas isso só fica claro se você souber que o código de erro MySQL 1051 é para "tabela desconhecida":

```sql
DECLARE CONTINUE HANDLER FOR 1051
  BEGIN
    -- body of handler
  END;
```

Ao declarar um nome para a condição, o propósito do manipulador é mais facilmente compreendido:

```sql
DECLARE no_such_table CONDITION FOR 1051;
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```

Aqui está uma condição nomeada para a mesma condição, mas com base no valor correspondente do SQLSTATE, em vez do código de erro do MySQL:

```sql
DECLARE no_such_table CONDITION FOR SQLSTATE '42S02';
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```
