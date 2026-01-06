#### 13.6.7.5 Declaração de Sinal

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

`SIGNAL` é a maneira de "retornar" um erro. `SIGNAL` fornece informações de erro a um manipulador, a uma parte externa da aplicação ou ao cliente. Além disso, fornece controle sobre as características do erro (número de erro, valor `SQLSTATE`, mensagem). Sem `SIGNAL`, é necessário recorrer a soluções alternativas, como referenciar deliberadamente uma tabela inexistente para fazer com que uma rotina retorne um erro.

Não são necessários privilégios para executar a instrução `SIGNAL`.

Para recuperar informações da área de diagnóstico, use a instrução `GET DIAGNOSTICS` (consulte Seção 13.6.7.3, “Instrução GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 13.6.7.7, “A Área de Diagnóstico do MySQL”.

- Visão geral do sinal
- Itens de Informações de Condição de Sinal
- Efeito dos sinais em manipuladores, cursors e declarações

##### SIGNAL Visão geral

O `condition_value` em uma declaração `SIGNAL` indica o valor de erro a ser retornado. Ele pode ser um valor `SQLSTATE` (uma string literal de 5 caracteres) ou um `condition_name` que se refere a uma condição nomeada previamente definida com `DECLARE ... CONDITION` (veja Seção 13.6.7.1, "Declaração ... CONDITION").

Um valor `SQLSTATE` pode indicar erros, avisos ou “não encontrado”. Os primeiros dois caracteres do valor indicam sua classe de erro, conforme discutido em Itens de informações de condição de sinal. Alguns valores de sinal causam a terminação da instrução; veja Efeito dos sinais nos manipuladores, cursors e instruções.

O valor `SQLSTATE` para uma instrução `[SIGNAL]` (signal.html) não deve começar com `'00'` porque esses valores indicam sucesso e não são válidos para sinalizar um erro. Isso é verdadeiro se o valor `SQLSTATE` for especificado diretamente na instrução `[SIGNAL]` ou em uma condição nomeada referenciada na instrução. Se o valor for inválido, ocorrerá um erro `Bad SQLSTATE`.

Para indicar um valor genérico `SQLSTATE`, use `'45000'`, que significa “exceção não tratada definida pelo usuário”.

A declaração `SIGNAL` inclui opcionalmente uma cláusula `SET` que contém vários itens de sinal, em uma lista de atribuições de *`condition_information_item_name`* = *`simple_value_specification`* separadas por vírgulas.

Cada `nome_item_informacao_condicao` pode ser especificado apenas uma vez na cláusula `SET`. Caso contrário, ocorrerá um erro `Condição de informação de item duplicado`.

Os identificadores válidos de especificação de `simple_value_specification` podem ser especificados usando parâmetros de procedimentos ou funções armazenados, variáveis locais de programas armazenados declaradas com `DECLARE`, variáveis definidas pelo usuário, variáveis de sistema ou literais. Um literal de caractere pode incluir um introduzir `_charset`.

Para obter informações sobre os valores permitidos de *`condition_information_item_name`*, consulte Itens de informações de condição de sinal.

O procedimento a seguir sinaliza um erro ou aviso, dependendo do valor de `pval`, seu parâmetro de entrada:

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

Se `pval` for 0, `p()` emite um aviso porque os valores `SQLSTATE` que começam com `'01'` são sinais na classe de aviso. O aviso não termina o procedimento e pode ser visualizado com `[`SHOW WARNINGS\`]\(show-warnings.html) após o procedimento retornar.

Se `pval` for 1, `p()` sinaliza um erro e define o item de informação de condição `MESSAGE_TEXT`. O erro termina o procedimento e o texto é retornado com as informações de erro.

Se `pval` for 2, o mesmo erro é sinalizado, embora o valor `SQLSTATE` seja especificado usando uma condição nomeada neste caso.

Se `pval` for qualquer outra coisa, `p()` primeiro emite um aviso e define os itens de informações do texto da mensagem e do número de erro. Esse aviso não termina o procedimento, então a execução continua e `p()` então emite um erro. O erro termina o procedimento. O texto da mensagem e o número de erro definidos pelo aviso são substituídos pelos valores definidos pelo erro, que são retornados com as informações de erro.

`SIGNAL` é tipicamente usado dentro de programas armazenados, mas é uma extensão do MySQL que é permitida fora do contexto do manipulador. Por exemplo, se você invocar o programa cliente **mysql**, você pode inserir qualquer uma dessas instruções na prompt:

```sql
SIGNAL SQLSTATE '77777';

CREATE TRIGGER t_bi BEFORE INSERT ON t
  FOR EACH ROW SIGNAL SQLSTATE '77777';

CREATE EVENT e ON SCHEDULE EVERY 1 SECOND
  DO SIGNAL SQLSTATE '77777';
```

`SIGNAL` é executado de acordo com as seguintes regras:

Se a declaração `SIGNAL` indicar um valor específico de `SQLSTATE`, esse valor é usado para sinalizar a condição especificada. Exemplo:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  IF divisor = 0 THEN
    SIGNAL SQLSTATE '22012';
  END IF;
END;
```

Se a declaração `SIGNAL` usar uma condição nomeada, a condição deve ser declarada em algum escopo que se aplique à declaração `SIGNAL` e deve ser definida usando um valor `SQLSTATE`, e não um número de erro MySQL. Exemplo:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE divide_by_zero CONDITION FOR SQLSTATE '22012';
  IF divisor = 0 THEN
    SIGNAL divide_by_zero;
  END IF;
END;
```

Se a condição nomeada não existir no escopo da declaração `SIGNAL`, ocorrerá um erro `Condição indefinida`.

Se `SIGNAL` se refere a uma condição nomeada que é definida com um número de erro MySQL em vez de um valor `SQLSTATE`, um `SIGNAL/RESIGNAL` só pode usar uma condição definida com o erro `SQLSTATE` ocorre. As seguintes declarações causam esse erro porque a condição nomeada está associada a um número de erro MySQL:

```sql
DECLARE no_such_table CONDITION FOR 1051;
SIGNAL no_such_table;
```

Se uma condição com um nome específico for declarada várias vezes em diferentes escopos, a declaração com o escopo mais local será aplicada. Considere o seguinte procedimento:

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

Se `divisor` for 0, a primeira instrução `SIGNAL` (signal.html) é executada. A declaração de condição `my_error` mais interna é aplicada, levantando `SQLSTATE` `'22012'`.

Se `divisor` não for 0, a segunda instrução `SIGNAL` (signal.html) é executada. A declaração mais externa de `my_error` é aplicada, elevando `SQLSTATE` para `'45000'`.

Para obter informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte Seção 13.6.7.6, “Regras de escopo para manipuladores”.

Os sinais podem ser levantados dentro dos manipuladores de exceção:

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

A chamada `CALL p()` chega à instrução `DROP TABLE`. Não existe uma tabela chamada `no_such_table`, então o manipulador de erros é ativado. O manipulador de erros destrói o erro original (“tabela não existente”) e cria um novo erro com `SQLSTATE` `'99999'` e a mensagem `Um erro ocorreu`.

##### Itens de Informações de Condição de Sinal

A tabela a seguir lista os nomes dos itens de informações de condição da área de diagnóstico que podem ser definidos em uma declaração de `SIGNAL` (ou `RESIGNAL`. Todos os itens são padrão SQL, exceto `MYSQL_ERRNO`, que é uma extensão do MySQL. Para obter mais informações sobre esses itens, consulte Seção 13.6.7.7, “A Área de Diagnóstico do MySQL”.

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

O conjunto de caracteres para itens de caracteres é UTF-8.

É ilegal atribuir `NULL` a um item de informação de condição em uma declaração de `SIGNAL` (signal.html).

Uma declaração `SIGNAL` sempre especifica um valor `SQLSTATE`, seja diretamente ou indiretamente, referenciando uma condição nomeada definida com um valor `SQLSTATE`. Os dois primeiros caracteres de um valor `SQLSTATE` são sua classe, e a classe determina o valor padrão para os itens de informações da condição:

- Classe = `'00'` (sucesso)

  Ilegal. Os valores `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para `SIGNAL`.

- Classe = `'01'` (aviso)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined warning condition';
  MYSQL_ERRNO = ER_SIGNAL_WARN
  ```

- Classe = `'02'` (não encontrado)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined not found condition';
  MYSQL_ERRNO = ER_SIGNAL_NOT_FOUND
  ```

- Classe > `'02'` (exceção)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined exception condition';
  MYSQL_ERRNO = ER_SIGNAL_EXCEPTION
  ```

Para as classes jurídicas, os outros itens de informações das condições são definidos da seguinte forma:

```sql
CLASS_ORIGIN = SUBCLASS_ORIGIN = '';
CONSTRAINT_CATALOG = CONSTRAINT_SCHEMA = CONSTRAINT_NAME = '';
CATALOG_NAME = SCHEMA_NAME = TABLE_NAME = COLUMN_NAME = '';
CURSOR_NAME = '';
```

Os valores de erro acessíveis após a execução de `SIGNAL` são o valor `SQLSTATE` gerado pela instrução `SIGNAL` e os itens `MESSAGE_TEXT` e `MYSQL_ERRNO`. Esses valores estão disponíveis na API C:

- `mysql_sqlstate()` retorna o valor `SQLSTATE`.

- `mysql_errno()` retorna o valor `MYSQL_ERRNO`.

- `mysql_error()` retorna o valor `MESSAGE_TEXT`.

No nível SQL, o resultado de `SHOW WARNINGS` e `SHOW ERRORS` indica os valores `MYSQL_ERRNO` e `MESSAGE_TEXT` nas colunas `Código` e `Mensagem`.

Para recuperar informações da área de diagnóstico, use a instrução `GET DIAGNOSTICS` (consulte Seção 13.6.7.3, “Instrução GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 13.6.7.7, “A Área de Diagnóstico do MySQL”.

##### Efeito dos sinais nos manipuladores, cursors e declarações

Os sinais têm efeitos diferentes na execução da declaração, dependendo da classe do sinal. A classe determina o quão grave é um erro. O MySQL ignora o valor da variável de sistema `sql_mode`; em particular, o modo SQL rigoroso não importa. O MySQL também ignora `IGNORE`: A intenção do `SIGNAL` é gerar um erro gerado pelo usuário explicitamente, portanto, um sinal nunca é ignorado.

Nas descrições a seguir, “não tratado” significa que nenhum manipulador para o valor `SQLSTATE` sinalizado foi definido com `DECLARE ... HANDLER`.

- Classe = `'00'` (sucesso)

  Ilegal. Os valores `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para `SIGNAL`.

- Classe = `'01'` (aviso)

  O valor da variável de sistema `warning_count` aumenta. O sinal é exibido com ``SHOW WARNINGS`. Os manipuladores `SQLWARNING\` capturam o sinal.

  As avisos não podem ser retornados a partir de funções armazenadas porque a instrução `RETURN` que faz a função retornar limpa a área de diagnóstico. Assim, a instrução limpa quaisquer avisos que possam ter estado presentes lá (e redefini o `warning_count` para 0).

- Classe = `'02'` (não encontrado)

  Os manipuladores `NOT FOUND` capturam o sinal. Não há efeito nos cursors. Se o sinal não for manipulado em uma função armazenada, as instruções terminam.

- Classe > `'02'` (exceção)

  Os manipuladores `SQLEXCEPTION` capturam o sinal. Se o sinal não for tratado em uma função armazenada, as instruções terminam.

- Classe = `'40'`

  Tratado como uma exceção comum.
