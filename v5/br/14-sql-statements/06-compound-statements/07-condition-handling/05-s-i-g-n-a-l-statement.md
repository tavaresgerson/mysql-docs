#### 13.6.7.5 Instrução SIGNAL

```sql
SIGNAL condition_value
    [SET signal_information_item
    [, signal_information_item] ...]

condition_value: {
    SQLSTATE [VALUE] sqlstate_value
  | condition_name
}

signal_information_item:
    condition_information_item_name = simple_value_specification

condition_information_item_name: {
    CLASS_ORIGIN
  | SUBCLASS_ORIGIN
  | MESSAGE_TEXT
  | MYSQL_ERRNO
  | CONSTRAINT_CATALOG
  | CONSTRAINT_SCHEMA
  | CONSTRAINT_NAME
  | CATALOG_NAME
  | SCHEMA_NAME
  | TABLE_NAME
  | COLUMN_NAME
  | CURSOR_NAME
}

condition_name, simple_value_specification:
    (see following discussion)
```

A instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") é a maneira de "retornar" um erro. [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") fornece informações de erro a um HANDLER, a uma porção externa da aplicação, ou ao CLIENT. Além disso, ela oferece controle sobre as características do erro (número do erro, valor `SQLSTATE`, mensagem). Sem [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), é necessário recorrer a soluções alternativas (workarounds), como referenciar deliberadamente uma tabela inexistente para fazer com que uma rotina retorne um erro.

Nenhuma permissão (privilege) é exigida para executar a instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement").

Para recuperar informações da área de diagnostics, use a instrução [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") (veja [Seção 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")). Para informações sobre a área de diagnostics, veja [Seção 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

* [Visão Geral do SIGNAL](signal.html#signal-overview "SIGNAL Overview")
* [Itens de Informação de Condition do Signal](signal.html#signal-condition-information-items "Signal Condition Information Items")
* [Efeito de Signals em Handlers, Cursors e Instructions](signal.html#signal-effects "Effect of Signals on Handlers, Cursors, and Statements")

##### Visão Geral do SIGNAL

O *`condition_value`* em uma instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") indica o valor de erro a ser retornado. Ele pode ser um valor `SQLSTATE` (um literal de string de 5 caracteres) ou um *`condition_name`* que se refere a uma condição nomeada definida anteriormente com [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement") (veja [Seção 13.6.7.1, “DECLARE ... CONDITION Statement”](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement")).

Um valor `SQLSTATE` pode indicar erros, warnings, ou "not found". Os dois primeiros caracteres do valor indicam sua classe de erro, conforme discutido em [Itens de Informação de Condition do Signal](signal.html#signal-condition-information-items "Signal Condition Information Items"). Alguns valores de signal causam o encerramento da instrução (statement); veja [Efeito de Signals em Handlers, Cursors e Instructions](signal.html#signal-effects "Efeito de Signals em Handlers, Cursors e Instructions").

O valor `SQLSTATE` para uma instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") não deve começar com `'00'` porque tais valores indicam sucesso e não são válidos para sinalizar um erro. Isso é verdade quer o valor `SQLSTATE` seja especificado diretamente na instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") ou em uma condição nomeada referenciada na instrução. Se o valor for inválido, ocorre um erro `Bad SQLSTATE`.

Para sinalizar um valor `SQLSTATE` genérico, use `'45000'`, que significa "exceção definida pelo usuário não tratada" ("unhandled user-defined exception").

A instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") inclui opcionalmente uma cláusula `SET` que contém múltiplos itens de signal, em uma lista de atribuições *`condition_information_item_name`* = *`simple_value_specification`*, separadas por vírgulas.

Cada *`condition_information_item_name`* pode ser especificado apenas uma vez na cláusula `SET`. Caso contrário, ocorre um erro `Duplicate condition information item`.

Designadores válidos de *`simple_value_specification`* podem ser especificados usando parâmetros de stored procedure ou FUNCTION, variáveis locais de stored program declaradas com [`DECLARE`](declare.html "13.6.3 DECLARE Statement"), variáveis definidas pelo usuário, system variables ou literais. Um literal de caractere pode incluir um introdutor *`_charset`*.

Para informações sobre valores permitidos para *`condition_information_item_name`*, veja [Itens de Informação de Condition do Signal](signal.html#signal-condition-information-items "Signal Condition Information Items").

O seguinte PROCEDURE sinaliza um erro ou warning dependendo do valor de `pval`, seu parâmetro de entrada:

```sql
CREATE PROCEDURE p (pval INT)
BEGIN
  DECLARE specialty CONDITION FOR SQLSTATE '45000';
  IF pval = 0 THEN
    SIGNAL SQLSTATE '01000';
  ELSEIF pval = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred';
  ELSEIF pval = 2 THEN
    SIGNAL specialty
      SET MESSAGE_TEXT = 'An error occurred';
  ELSE
    SIGNAL SQLSTATE '01000'
      SET MESSAGE_TEXT = 'A warning occurred', MYSQL_ERRNO = 1000;
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred', MYSQL_ERRNO = 1001;
  END IF;
END;
```

Se `pval` for 0, `p()` sinaliza um warning porque valores `SQLSTATE` que começam com `'01'` são signals na classe warning. O warning não encerra o PROCEDURE e pode ser visto com [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") após o PROCEDURE retornar.

Se `pval` for 1, `p()` sinaliza um erro e define o item de informação de condition `MESSAGE_TEXT`. O erro encerra o PROCEDURE, e o texto é retornado com a informação de erro.

Se `pval` for 2, o mesmo erro é sinalizado, embora o valor `SQLSTATE` seja especificado usando uma condição nomeada neste caso.

Se `pval` for qualquer outro valor, `p()` primeiro sinaliza um warning e define os itens de informação de condition de texto da mensagem e número do erro. Este warning não encerra o PROCEDURE, então a execução continua e `p()` em seguida sinaliza um erro. O erro encerra o PROCEDURE. O texto da mensagem e o número do erro definidos pelo warning são substituídos pelos valores definidos pelo erro, que são retornados com a informação de erro.

[`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") é tipicamente usado dentro de stored programs, mas é uma extensão do MySQL que permite seu uso fora do contexto de HANDLER. Por exemplo, se você invocar o programa CLIENT [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), você pode inserir qualquer uma destas instruções no prompt:

```sql
SIGNAL SQLSTATE '77777';

CREATE TRIGGER t_bi BEFORE INSERT ON t
  FOR EACH ROW SIGNAL SQLSTATE '77777';

CREATE EVENT e ON SCHEDULE EVERY 1 SECOND
  DO SIGNAL SQLSTATE '77777';
```

[`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") é executada de acordo com as seguintes regras:

Se a instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") indicar um valor `SQLSTATE` específico, esse valor é usado para sinalizar a CONDITION especificada. Exemplo:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  IF divisor = 0 THEN
    SIGNAL SQLSTATE '22012';
  END IF;
END;
```

Se a instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") usar uma condição nomeada, a condição deve ser declarada em algum escopo que se aplique à instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") e deve ser definida usando um valor `SQLSTATE`, e não um número de erro do MySQL. Exemplo:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE divide_by_zero CONDITION FOR SQLSTATE '22012';
  IF divisor = 0 THEN
    SIGNAL divide_by_zero;
  END IF;
END;
```

Se a condição nomeada não existir no escopo da instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), ocorre um erro `Undefined CONDITION`.

Se [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") se referir a uma condição nomeada que é definida com um número de erro do MySQL em vez de um valor `SQLSTATE`, ocorre um erro `SIGNAL/RESIGNAL can only use a CONDITION defined with SQLSTATE`. As instruções a seguir causam esse erro porque a condição nomeada está associada a um número de erro do MySQL:

```sql
DECLARE no_such_table CONDITION FOR 1051;
SIGNAL no_such_table;
```

Se uma condição com um determinado nome for declarada múltiplas vezes em escopos diferentes, a declaração com o escopo mais local é aplicada. Considere o seguinte PROCEDURE:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE my_error CONDITION FOR SQLSTATE '45000';
  IF divisor = 0 THEN
    BEGIN
      DECLARE my_error CONDITION FOR SQLSTATE '22012';
      SIGNAL my_error;
    END;
  END IF;
  SIGNAL my_error;
END;
```

Se `divisor` for 0, a primeira instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") é executada. A declaração de condição `my_error` mais interna se aplica, levantando `SQLSTATE` `'22012'`.

Se `divisor` não for 0, a segunda instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") é executada. A declaração de condição `my_error` mais externa se aplica, levantando `SQLSTATE` `'45000'`.

Para informações sobre como o SERVER escolhe os HANDLERS quando uma condição ocorre, veja [Seção 13.6.7.6, “Scope Rules for Handlers”](handler-scope.html "13.6.7.6 Scope Rules for Handlers").

Signals podem ser levantados dentro de exception HANDLERS:

```sql
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SIGNAL SQLSTATE VALUE '99999'
      SET MESSAGE_TEXT = 'An error occurred';
  END;
  DROP TABLE no_such_table;
END;
```

`CALL p()` alcança a instrução [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"). Não há nenhuma tabela chamada `no_such_table`, então o error HANDLER é ativado. O error HANDLER destrói o erro original ("no such table") e cria um novo erro com `SQLSTATE` `'99999'` e mensagem `An error occurred`.

##### Itens de Informação de Condition do Signal

A tabela a seguir lista os nomes dos itens de informação de condition da área de diagnostics que podem ser definidos em uma instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") (ou [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement")). Todos os itens são SQL padrão, exceto `MYSQL_ERRNO`, que é uma extensão do MySQL. Para mais informações sobre esses itens, veja [Seção 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

```sql
Item Name             Definition
---------             ----------
CLASS_ORIGIN          VARCHAR(64)
SUBCLASS_ORIGIN       VARCHAR(64)
CONSTRAINT_CATALOG    VARCHAR(64)
CONSTRAINT_SCHEMA     VARCHAR(64)
CONSTRAINT_NAME       VARCHAR(64)
CATALOG_NAME          VARCHAR(64)
SCHEMA_NAME           VARCHAR(64)
TABLE_NAME            VARCHAR(64)
COLUMN_NAME           VARCHAR(64)
CURSOR_NAME           VARCHAR(64)
MESSAGE_TEXT          VARCHAR(128)
MYSQL_ERRNO           SMALLINT UNSIGNED
```

O conjunto de caracteres para itens de caractere é UTF-8.

É ilegal atribuir `NULL` a um item de informação de condition em uma instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement").

Uma instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") sempre especifica um valor `SQLSTATE`, seja diretamente ou indiretamente, referenciando uma condição nomeada definida com um valor `SQLSTATE`. Os dois primeiros caracteres de um valor `SQLSTATE` são sua classe, e a classe determina o valor padrão para os itens de informação de condition:

* Classe = `'00'` (success)

  Ilegal. Valores `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement").

* Classe = `'01'` (warning)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined warning condition';
  MYSQL_ERRNO = ER_SIGNAL_WARN
  ```

* Classe = `'02'` (not found)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined not found condition';
  MYSQL_ERRNO = ER_SIGNAL_NOT_FOUND
  ```

* Classe > `'02'` (exception)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined exception condition';
  MYSQL_ERRNO = ER_SIGNAL_EXCEPTION
  ```

Para classes válidas, os outros itens de informação de condition são definidos da seguinte forma:

```sql
CLASS_ORIGIN = SUBCLASS_ORIGIN = '';
CONSTRAINT_CATALOG = CONSTRAINT_SCHEMA = CONSTRAINT_NAME = '';
CATALOG_NAME = SCHEMA_NAME = TABLE_NAME = COLUMN_NAME = '';
CURSOR_NAME = '';
```

Os valores de erro que são acessíveis após a execução de [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") são o valor `SQLSTATE` levantado pela instrução [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") e os itens `MESSAGE_TEXT` e `MYSQL_ERRNO`. Esses valores estão disponíveis através da C API:

* [`mysql_sqlstate()`](/doc/c-api/5.7/en/mysql-sqlstate.html) retorna o valor `SQLSTATE`.

* [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html) retorna o valor `MYSQL_ERRNO`.

* [`mysql_error()`](/doc/c-api/5.7/en/mysql-error.html) retorna o valor `MESSAGE_TEXT`.

No nível SQL, a saída de [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") e [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") indica os valores `MYSQL_ERRNO` e `MESSAGE_TEXT` nas colunas `Code` e `Message`.

Para recuperar informações da área de diagnostics, use a instrução [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") (veja [Seção 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")). Para informações sobre a área de diagnostics, veja [Seção 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

##### Efeito de Signals em Handlers, Cursors e Instructions

Signals têm diferentes efeitos na execução de instructions dependendo da classe do signal. A classe determina a gravidade de um erro. O MySQL ignora o valor da system variable [`sql_mode`](server-system-variables.html#sysvar_sql_mode); em particular, o modo SQL estrito não importa. O MySQL também ignora `IGNORE`: A intenção de [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") é levantar explicitamente um erro gerado pelo usuário, então um signal nunca é ignorado.

Nas descrições a seguir, "não tratado" (unhandled) significa que nenhum HANDLER para o valor `SQLSTATE` sinalizado foi definido com [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement").

* Classe = `'00'` (success)

  Ilegal. Valores `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement").

* Classe = `'01'` (warning)

  O valor da system variable [`warning_count`](server-system-variables.html#sysvar_warning_count) é incrementado. [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") mostra o signal. HANDLERS `SQLWARNING` capturam o signal.

  Warnings não podem ser retornados de stored FUNCTIONS porque a instrução [`RETURN`](return.html "13.6.5.7 RETURN Statement") que faz com que a FUNCTION retorne limpa a área de diagnostics. A instrução, portanto, limpa quaisquer warnings que possam estar presentes (e redefine [`warning_count`](server-system-variables.html#sysvar_warning_count) para 0).

* Classe = `'02'` (not found)

  HANDLERS `NOT FOUND` capturam o signal. Não há efeito em CURSORS. Se o signal não for tratado (unhandled) em uma stored FUNCTION, as instructions terminam.

* Classe > `'02'` (exception)

  HANDLERS `SQLEXCEPTION` capturam o signal. Se o signal não for tratado (unhandled) em uma stored FUNCTION, as instructions terminam.

* Classe = `'40'`

  Tratado como uma exception comum.