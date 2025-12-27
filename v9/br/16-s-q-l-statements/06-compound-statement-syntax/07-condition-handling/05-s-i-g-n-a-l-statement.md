#### 15.6.7.5 Declaração `SIGNAL`

```
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

`SIGNAL` é a maneira de “retornar” um erro. `SIGNAL` fornece informações de erro a um manipulador, a uma parte externa da aplicação ou ao cliente. Além disso, fornece controle sobre as características do erro (número de erro, valor `SQLSTATE`, mensagem). Sem `SIGNAL`, é necessário recorrer a soluções alternativas, como referenciar deliberadamente uma tabela inexistente para fazer com que uma rotina retorne um erro.

Não são necessários privilégios para executar a declaração `SIGNAL`.

Para recuperar informações da área de diagnóstico, use a declaração `GET DIAGNOSTICS` (consulte Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.

* Visão geral do `SIGNAL`
* Itens de informações de condição de sinal
* Efeito dos sinais nos manipuladores, cursors e declarações

##### Visão geral do `SIGNAL`

O *`condition_value`* em uma declaração `SIGNAL` indica o valor de erro a ser retornado. Pode ser um valor `SQLSTATE` (uma literal de string de 5 caracteres) ou um *`condition_name`* que se refere a uma condição nomeada previamente definida com `DECLARE ... CONDITION` (consulte Seção 15.6.7.1, “Declaração ... CONDITION”).

Um valor `SQLSTATE` pode indicar erros, avisos ou “não encontrado”. Os primeiros dois caracteres do valor indicam sua classe de erro, conforme discutido em Itens de informações de condição de sinal. Alguns valores de sinal causam a terminação da declaração; veja Efeito dos sinais nos manipuladores, cursors e declarações.

O valor `SQLSTATE` para uma instrução `SIGNAL` não deve começar com `'00'` porque tais valores indicam sucesso e não são válidos para sinalizar um erro. Isso é verdadeiro se o valor `SQLSTATE` for especificado diretamente na instrução `SIGNAL` ou em uma condição nomeada referenciada na instrução. Se o valor for inválido, ocorre um erro `Bad SQLSTATE`.

Para sinalizar um valor genérico `SQLSTATE`, use `'45000'`, que significa “exceção definida pelo usuário não tratada”.

A instrução `SIGNAL` inclui opcionalmente uma cláusula `SET` que contém múltiplos itens de sinal, em uma lista de atribuições de *`condition_information_item_name`* = *`simple_value_specification`* separadas por vírgulas.

Cada *`condition_information_item_name`* pode ser especificado apenas uma vez na cláusula `SET`. Caso contrário, ocorre um erro `Duplicate condition information item`.

Os designadores de *`simple_value_specification`* válidos podem ser especificados usando parâmetros de procedimento armazenado ou função, variáveis locais de programa armazenado declaradas com `DECLARE`, variáveis definidas pelo usuário, variáveis de sistema ou literais. Um literal de caractere pode incluir um introduzir `_charset`.

Para informações sobre os valores permitidos de *`condition_information_item_name`*, consulte Itens de Informações de Condição de Sinal.

O seguinte procedimento sinaliza um erro ou aviso dependendo do valor de `pval`, seu parâmetro de entrada:

```
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

Se `pval` for 0, `p()` sinaliza um aviso porque os valores `SQLSTATE` que começam com `'01'` são sinais na classe de aviso. O aviso não termina o procedimento e pode ser visto com `SHOW WARNINGS` após o procedimento retornar.

Se `pval` for 1, `p()` sinaliza um erro e define o item de informação de condição `MESSAGE_TEXT`. O erro termina o procedimento e o texto é retornado com as informações de erro.

Se `pval` for 2, o mesmo erro é sinalizado, embora o valor `SQLSTATE` seja especificado usando uma condição nomeada neste caso.

Se `pval` for qualquer outra coisa, `p()` primeiro sinaliza um aviso e define os itens de informações do texto da mensagem e do número do erro. Esse aviso não termina o procedimento, então a execução continua e `p()` então sinaliza um erro. O erro termina o procedimento. O texto da mensagem e o número do erro definidos pelo aviso são substituídos pelos valores definidos pelo erro, que são retornados com as informações do erro.

`SIGNAL` é tipicamente usado dentro de programas armazenados, mas é uma extensão do MySQL que é permitida fora do contexto do manipulador. Por exemplo, se você invocar o programa cliente **mysql**, você pode inserir qualquer uma dessas instruções na prompt:

```
SIGNAL SQLSTATE '77777';

CREATE TRIGGER t_bi BEFORE INSERT ON t
  FOR EACH ROW SIGNAL SQLSTATE '77777';

CREATE EVENT e ON SCHEDULE EVERY 1 SECOND
  DO SIGNAL SQLSTATE '77777';
```

`SIGNAL` executa de acordo com as seguintes regras:

Se a declaração `SIGNAL` indica um valor `SQLSTATE` específico, esse valor é usado para sinalizar a condição especificada. Exemplo:

```
CREATE PROCEDURE p (divisor INT)
BEGIN
  IF divisor = 0 THEN
    SIGNAL SQLSTATE '22012';
  END IF;
END;
```

Se a declaração `SIGNAL` usa uma condição nomeada, a condição deve ser declarada em algum escopo que se aplique à declaração `SIGNAL` e deve ser definida usando um valor `SQLSTATE`, não um número de erro do MySQL. Exemplo:

```
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE divide_by_zero CONDITION FOR SQLSTATE '22012';
  IF divisor = 0 THEN
    SIGNAL divide_by_zero;
  END IF;
END;
```

Se a condição nomeada não existir no escopo da declaração `SIGNAL`, ocorre um erro `Undefined CONDITION`.

Se `SIGNAL` se refere a uma condição nomeada que é definida com um número de erro do MySQL em vez de um valor `SQLSTATE`, ocorre um erro `SIGNAL/RESIGNAL que só pode usar uma condição definida com o erro `SQLSTATE`. As seguintes instruções causam esse erro porque a condição nomeada está associada a um número de erro do MySQL:

```
DECLARE no_such_table CONDITION FOR 1051;
SIGNAL no_such_table;
```

Se uma condição com um nome específico for declarada várias vezes em diferentes escopos, a declaração com o escopo mais local será aplicada. Considere o seguinte procedimento:

```
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

Se `divisor` for 0, a primeira declaração `SIGNAL` é executada. A declaração de condição `my_error` mais interna é aplicada, levantando `SQLSTATE` `'22012'`.

Se `divisor` não for 0, a segunda declaração `SIGNAL` é executada. A declaração de condição `my_error` mais externa é aplicada, levantando `SQLSTATE` `'45000'`.

Para informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte a Seção 15.6.7.6, “Regras de escopo para manipuladores”.

Sinais podem ser acionados dentro de manipuladores de exceção:

```
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

`CALL p()` alcança a declaração `DROP TABLE`. Não há tabela chamada `no_such_table`, então o manipulador de erro é ativado. O manipulador de erro destrói o erro original (“tabela não existente”) e cria um novo erro com `SQLSTATE` `'99999'` e mensagem `Um erro ocorreu`.

##### Itens de Informações de Condição de Sinal

A tabela a seguir lista os nomes dos itens de informações de condição da área de diagnóstico que podem ser definidos em uma declaração `SIGNAL` (ou `RESIGNAL`). Todos os itens são SQL padrão, exceto `MYSQL_ERRNO`, que é uma extensão do MySQL. Para mais informações sobre esses itens, consulte a Seção 15.6.7.7, “A Área de Diagnóstico MySQL”.

```
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

O conjunto de caracteres para itens de caracteres é UTF-8.

É ilegal atribuir `NULL` a um item de informação de condição em uma declaração `SIGNAL`.

Uma declaração `SIGNAL` sempre especifica um valor `SQLSTATE`, diretamente ou indiretamente, referenciando uma condição nomeada definida com um valor `SQLSTATE`. Os dois primeiros caracteres de um valor `SQLSTATE` são sua classe, e a classe determina o valor padrão para os itens de informação de condição:

* Classe = `'00'` (sucesso)

Ilegal. Os valores `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para `SIGNAL`.

* Classe = `'01'` (aviso)

  ```
  MESSAGE_TEXT = 'Unhandled user-defined warning condition';
  MYSQL_ERRNO = ER_SIGNAL_WARN
  ```

* Classe = `'02'` (não encontrado)

  ```
  MESSAGE_TEXT = 'Unhandled user-defined not found condition';
  MYSQL_ERRNO = ER_SIGNAL_NOT_FOUND
  ```

* Classe > `'02'` (exceção)

  ```
  MESSAGE_TEXT = 'Unhandled user-defined exception condition';
  MYSQL_ERRNO = ER_SIGNAL_EXCEPTION
  ```

Para classes legais, os outros itens de informações de condições são definidos da seguinte forma:

```
CLASS_ORIGIN = SUBCLASS_ORIGIN = '';
CONSTRAINT_CATALOG = CONSTRAINT_SCHEMA = CONSTRAINT_NAME = '';
CATALOG_NAME = SCHEMA_NAME = TABLE_NAME = COLUMN_NAME = '';
CURSOR_NAME = '';
```

Os valores de erro acessíveis após a execução de `SIGNAL` são o valor `SQLSTATE` gerado pela instrução `SIGNAL` e os itens `MYSQL_ERRNO` e `MESSAGE_TEXT`. Esses valores estão disponíveis na API C:

* `mysql_sqlstate()` retorna o valor `SQLSTATE`.

* `mysql_errno()` retorna o valor `MYSQL_ERRNO`.

* `mysql_error()` retorna o valor `MESSAGE_TEXT`.

No nível SQL, a saída de `SHOW WARNINGS` e `SHOW ERRORS` indica os valores `MYSQL_ERRNO` e `MESSAGE_TEXT` nas colunas `Code` e `Message`.

Para recuperar informações da área de diagnóstico, use a instrução `GET DIAGNOSTICS` (consulte a Seção 15.6.7.3, “Instrução GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte a Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.

##### Efeito dos Sinais nos Manipuladores, Cursors e Instruções

Os sinais têm diferentes efeitos na execução das instruções dependendo da classe do sinal. A classe determina o quão grave é um erro. O MySQL ignora o valor da variável de sistema `sql_mode`; em particular, o modo SQL rigoroso não importa. O MySQL também ignora `IGNORE`: A intenção de `SIGNAL` é gerar um erro gerado pelo usuário explicitamente, então um sinal nunca é ignorado.

Nas descrições a seguir, “não tratado” significa que nenhum manipulador para o valor `SQLSTATE` sinalizado foi definido com `DECLARE ... HANDLER`.

* Classe = `'00'` (sucesso)

Ilegal. Os valores de `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para `SIGNAL`.

* Classe = `'01'` (aviso)

  O valor da variável de sistema `warning_count` aumenta. `SHOW WARNINGS` mostra o sinal. Os manipuladores `SQLWARNING` capturam o sinal.

  Os avisos não podem ser retornados de funções armazenadas porque a instrução `RETURN` que faz a função retornar limpa a área de diagnóstico. A instrução, portanto, limpa quaisquer avisos que possam ter estado lá (e reinicia `warning_count` para 0).

* Classe = `'02'` (não encontrado)

  Manipuladores `NOT FOUND` capturam o sinal. Não há efeito nos cursors. Se o sinal não for tratado em uma função armazenada, as instruções terminam.

* Classe > `'02'` (exceção)

  Manipuladores `SQLEXCEPTION` capturam o sinal. Se o sinal não for tratado em uma função armazenada, as instruções terminam.

* Classe = `'40'`

  Tratado como uma exceção comum.