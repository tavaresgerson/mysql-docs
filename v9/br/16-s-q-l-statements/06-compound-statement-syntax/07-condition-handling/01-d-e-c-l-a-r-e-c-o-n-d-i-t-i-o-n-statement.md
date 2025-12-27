#### 15.6.7.1 DECLARE ... CONDITION Declaração

```
DECLARE condition_name CONDITION FOR condition_value

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
}
```

A declaração `DECLARE ... CONDITION` declara uma condição de erro nomeada, associando um nome a uma condição que precisa de um tratamento específico. O nome pode ser referenciado em uma declaração `DECLARE ... HANDLER` subsequente (consulte a Seção 15.6.7.2, “Declaração ... HANDLER”).

As declarações de condições devem aparecer antes das declarações de cursor ou manipuladores.

O *`condition_value`* para `DECLARE ... CONDITION` indica a condição específica ou classe de condições a associar ao nome da condição. Ele pode assumir as seguintes formas:

* *`mysql_error_code`*: Um literal inteiro indicando um código de erro MySQL.

  Não use o código de erro MySQL 0 porque isso indica sucesso em vez de uma condição de erro. Para uma lista de códigos de erro MySQL, consulte Referência de Mensagem de Erro do Servidor.

* SQLSTATE [VALOR] *`sqlstate_value`*: Uma string literal de 5 caracteres indicando um valor SQLSTATE.

  Não use valores SQLSTATE que comecem com `'00'` porque esses indicam sucesso em vez de uma condição de erro. Para uma lista de valores SQLSTATE, consulte Referência de Mensagem de Erro do Servidor.

Os nomes de condição referenciados em declarações `SIGNAL` ou `RESIGNAL` devem ser associados a valores SQLSTATE, não a códigos de erro MySQL.

Usar nomes para condições pode ajudar a tornar o código do programa armazenado mais claro. Por exemplo, este manipulador se aplica a tentativas de descartar uma tabela inexistente, mas isso só é aparente se você souber que 1051 é o código de erro MySQL para “tabela desconhecida”:

```
DECLARE CONTINUE HANDLER FOR 1051
  BEGIN
    -- body of handler
  END;
```

Ao declarar um nome para a condição, o propósito do manipulador é mais facilmente visto:

```
DECLARE no_such_table CONDITION FOR 1051;
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```

Aqui está uma condição nomeada para a mesma condição, mas com base no valor SQLSTATE correspondente, em vez do código de erro MySQL:

```
DECLARE no_such_table CONDITION FOR SQLSTATE '42S02';
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```