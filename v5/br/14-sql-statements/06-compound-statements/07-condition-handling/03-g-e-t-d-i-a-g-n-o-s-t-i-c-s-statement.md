#### 13.6.7.3 Instrução GET DIAGNOSTICS

```sql
GET [CURRENT | STACKED] DIAGNOSTICS {
    statement_information_item
    [, statement_information_item] ...
  | CONDITION condition_number
    condition_information_item
    [, condition_information_item] ...
}

statement_information_item:
    target = statement_information_item_name

condition_information_item:
    target = condition_information_item_name

statement_information_item_name: {
    NUMBER
  | ROW_COUNT
}

condition_information_item_name: {
    CLASS_ORIGIN
  | SUBCLASS_ORIGIN
  | RETURNED_SQLSTATE
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

condition_number, target:
    (see following discussion)
```

As instruções SQL produzem informações de diagnóstico que preenchem a diagnostics area. A instrução [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") permite que as aplicações inspecionem essas informações. (Você também pode usar [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") ou [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") para visualizar conditions ou errors.)

Não são necessários privilégios especiais para executar [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement").

A keyword `CURRENT` significa recuperar informações da current diagnostics area. A keyword `STACKED` significa recuperar informações da segunda diagnostics area, que está disponível apenas se o contexto atual for um condition handler. Se nenhuma keyword for fornecida, o padrão é usar a current diagnostics area.

A instrução [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") é tipicamente usada em um handler dentro de um stored program. É uma extensão do MySQL que permite que [`GET [CURRENT] DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") seja usada fora do contexto do handler para verificar a execução de qualquer instrução SQL. Por exemplo, se você invocar o programa cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), você pode inserir estas instruções no prompt:

```sql
mysql> DROP TABLE test.no_such_table;
ERROR 1051 (42S02): Unknown table 'test.no_such_table'
mysql> GET DIAGNOSTICS CONDITION 1
         @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
mysql> SELECT @p1, @p2;
+-------+------------------------------------+
| @p1   | @p2                                |
+-------+------------------------------------+
| 42S02 | Unknown table 'test.no_such_table' |
+-------+------------------------------------+
```

Esta extensão se aplica apenas à current diagnostics area. Não se aplica à segunda diagnostics area porque `GET STACKED DIAGNOSTICS` é permitida apenas se o contexto atual for um condition handler. Caso contrário, ocorre um erro `GET STACKED DIAGNOSTICS when handler not active`.

Para uma descrição da diagnostics area, consulte [Seção 13.6.7.7, “A Diagnostics Area do MySQL”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area"). Em resumo, ela contém dois tipos de informação:

* Informação da instrução (Statement information), como o número de conditions que ocorreram ou a contagem de affected-rows.

* Informação da condition (Condition information), como o código de erro (error code) e a mensagem. Se uma instrução gerar múltiplas conditions, esta parte da diagnostics area possui uma condition area para cada uma. Se uma instrução não gerar conditions, esta parte da diagnostics area estará vazia.

Para uma instrução que produz três conditions, a diagnostics area contém informações de instrução e condition como esta:

```sql
Statement information:
  row count
  ... other statement information items ...
Condition area list:
  Condition area 1:
    error code for condition 1
    error message for condition 1
    ... other condition information items ...
  Condition area 2:
    error code for condition 2:
    error message for condition 2
    ... other condition information items ...
  Condition area 3:
    error code for condition 3
    error message for condition 3
    ... other condition information items ...
```

[`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") pode obter informações da instrução ou informações da condition, mas não ambas na mesma instrução:

* Para obter informações da instrução, recupere os statement items desejados em target variables. Esta instância de [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") atribui o número de conditions disponíveis e a contagem de rows-affected às user variables `@p1` e `@p2`:

  ```sql
  GET DIAGNOSTICS @p1 = NUMBER, @p2 = ROW_COUNT;
  ```

* Para obter informações da condition, especifique o condition number e recupere os condition items desejados em target variables. Esta instância de [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") atribui o valor SQLSTATE e a mensagem de erro às user variables `@p3` e `@p4`:

  ```sql
  GET DIAGNOSTICS CONDITION 1
    @p3 = RETURNED_SQLSTATE, @p4 = MESSAGE_TEXT;
  ```

A lista de recuperação especifica uma ou mais atribuições `target = item_name`, separadas por vírgulas. Cada atribuição nomeia uma target variable e um designador *`statement_information_item_name`* ou *`condition_information_item_name`*, dependendo se a instrução recupera informações da instrução (statement) ou da condition.

Designadores *`target`* válidos para armazenar informações de item podem ser parâmetros de stored procedure ou function, stored program local variables declaradas com [`DECLARE`](declare.html "13.6.3 DECLARE Statement"), ou user-defined variables.

Designadores *`condition_number`* válidos podem ser parâmetros de stored procedure ou function, stored program local variables declaradas com [`DECLARE`](declare.html "13.6.3 DECLARE Statement"), user-defined variables, system variables ou literals. Um literal de caractere pode incluir um *`_charset`* introducer. Um warning ocorre se o condition number não estiver no intervalo de 1 até o número de condition areas que possuem informação. Neste caso, o warning é adicionado à diagnostics area sem limpá-la.

Quando uma condition ocorre, o MySQL não preenche todos os condition items reconhecidos por [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement"). Por exemplo:

```sql
mysql> GET DIAGNOSTICS CONDITION 1
         @p5 = SCHEMA_NAME, @p6 = TABLE_NAME;
mysql> SELECT @p5, @p6;
+------+------+
| @p5  | @p6  |
+------+------+
|      |      |
+------+------+
```

No SQL padrão, se houver múltiplas conditions, a primeira condition está relacionada ao valor `SQLSTATE` retornado para a instrução SQL anterior. No MySQL, isso não é garantido. Para obter o erro principal, você não pode fazer o seguinte:

```sql
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Em vez disso, recupere primeiro a contagem de conditions e, em seguida, use-a para especificar qual condition number inspecionar:

```sql
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```

Para obter informações sobre os statement e condition information items permitidos e quais são preenchidos quando uma condition ocorre, consulte [Itens de Informação da Diagnostics Area](diagnostics-area.html#diagnostics-area-information-items "Diagnostics Area Information Items").

Aqui está um exemplo que usa [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") e um exception handler no contexto de stored procedure para avaliar o resultado de uma operação `INSERT`. Se o `INSERT` for bem-sucedido, o procedure usa [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") para obter a contagem de rows-affected. Isso demonstra que você pode usar [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") múltiplas vezes para recuperar informações sobre uma instrução, contanto que a current diagnostics area não tenha sido limpa.

```sql
CREATE PROCEDURE do_insert(value INT)
BEGIN
  -- Declare variables to hold diagnostics area information
  DECLARE code CHAR(5) DEFAULT '00000';
  DECLARE msg TEXT;
  DECLARE nrows INT;
  DECLARE result TEXT;
  -- Declare exception handler for failed insert
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

  -- Perform the insert
  INSERT INTO t1 (int_col) VALUES(value);
  -- Check whether the insert was successful
  IF code = '00000' THEN
    GET DIAGNOSTICS nrows = ROW_COUNT;
    SET result = CONCAT('insert succeeded, row count = ',nrows);
  ELSE
    SET result = CONCAT('insert failed, error = ',code,', message = ',msg);
  END IF;
  -- Say what happened
  SELECT result;
END;
```

Suponha que `t1.int_col` seja uma coluna integer que é declarada como `NOT NULL`. O procedure produz estes resultados quando invocado para inserir valores non-`NULL` e `NULL`, respectivamente:

```sql
mysql> CALL do_insert(1);
+---------------------------------+
| result                          |
+---------------------------------+
| insert succeeded, row count = 1 |
+---------------------------------+

mysql> CALL do_insert(NULL);
+-------------------------------------------------------------------------+
| result                                                                  |
+-------------------------------------------------------------------------+
| insert failed, error = 23000, message = Column 'int_col' cannot be null |
+-------------------------------------------------------------------------+
```

Quando um condition handler é ativado, ocorre um push na diagnostics area stack:

* A primeira (current) diagnostics area se torna a segunda (stacked) diagnostics area e uma nova current diagnostics area é criada como uma cópia dela.

* [`GET [CURRENT] DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") e [`GET STACKED DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") podem ser usadas dentro do handler para acessar o conteúdo das current e stacked diagnostics areas.

* Inicialmente, ambas as diagnostics areas retornam o mesmo resultado, portanto, é possível obter informações da current diagnostics area sobre a condition que ativou o handler, *contanto que* você não execute instruções dentro do handler que alterem a sua current diagnostics area.

* No entanto, instruções executadas dentro do handler podem modificar a current diagnostics area, limpando e definindo seu conteúdo de acordo com as regras normais (consulte [Como a Diagnostics Area é Limpa e Preenchida](diagnostics-area.html#diagnostics-area-populating "How the Diagnostics Area is Cleared and Populated")).

  Uma maneira mais confiável de obter informações sobre a condition que ativa o handler é usar a stacked diagnostics area, que não pode ser modificada por instruções executadas dentro do handler, exceto [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement"). Para informações sobre quando a current diagnostics area é definida e limpa, consulte [Seção 13.6.7.7, “A Diagnostics Area do MySQL”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

O próximo exemplo mostra como `GET STACKED DIAGNOSTICS` pode ser usado dentro de um handler para obter informações sobre a exception tratada, mesmo depois que a current diagnostics area tenha sido modificada por instruções do handler.

Dentro de uma stored procedure `p()`, tentamos inserir dois valores em uma tabela que contém uma coluna `TEXT NOT NULL`. O primeiro valor é uma string non-`NULL` e o segundo é `NULL`. A coluna proíbe valores `NULL`, então o primeiro `INSERT` é bem-sucedido, mas o segundo causa uma exception. O procedure inclui um exception handler que mapeia tentativas de inserir `NULL` para inserts de string vazia:

```sql
DROP TABLE IF EXISTS t1;
CREATE TABLE t1 (c1 TEXT NOT NULL);
DROP PROCEDURE IF EXISTS p;
delimiter //
CREATE PROCEDURE p ()
BEGIN
  -- Declare variables to hold diagnostics area information
  DECLARE errcount INT;
  DECLARE errno INT;
  DECLARE msg TEXT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    -- Here the current DA is nonempty because no prior statements
    -- executing within the handler have cleared it
    GET CURRENT DIAGNOSTICS CONDITION 1
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'current DA before mapped insert' AS op, errno, msg;
    GET STACKED DIAGNOSTICS CONDITION 1
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'stacked DA before mapped insert' AS op, errno, msg;

    -- Map attempted NULL insert to empty string insert
    INSERT INTO t1 (c1) VALUES('');

    -- Here the current DA should be empty (if the INSERT succeeded),
    -- so check whether there are conditions before attempting to
    -- obtain condition information
    GET CURRENT DIAGNOSTICS errcount = NUMBER;
    IF errcount = 0
    THEN
      SELECT 'mapped insert succeeded, current DA is empty' AS op;
    ELSE
      GET CURRENT DIAGNOSTICS CONDITION 1
        errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
      SELECT 'current DA after mapped insert' AS op, errno, msg;
    END IF ;
    GET STACKED DIAGNOSTICS CONDITION 1
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'stacked DA after mapped insert' AS op, errno, msg;
  END;
  INSERT INTO t1 (c1) VALUES('string 1');
  INSERT INTO t1 (c1) VALUES(NULL);
END;
//
delimiter ;
CALL p();
SELECT * FROM t1;
```

Quando o handler é ativado, uma cópia da current diagnostics area é enviada para a diagnostics area stack. O handler primeiro exibe o conteúdo das current e stacked diagnostics areas, que são idênticos inicialmente:

```sql
+---------------------------------+-------+----------------------------+
| op                              | errno | msg                        |
+---------------------------------+-------+----------------------------+
| current DA before mapped insert |  1048 | Column 'c1' cannot be null |
+---------------------------------+-------+----------------------------+

+---------------------------------+-------+----------------------------+
| op                              | errno | msg                        |
+---------------------------------+-------+----------------------------+
| stacked DA before mapped insert |  1048 | Column 'c1' cannot be null |
+---------------------------------+-------+----------------------------+
```

Instruções executadas após as instruções [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") podem redefinir a current diagnostics area. Por exemplo, o handler mapeia o `INSERT` de `NULL` para um `INSERT` de string vazia e exibe o resultado. O novo `INSERT` é bem-sucedido e limpa a current diagnostics area, mas a stacked diagnostics area permanece inalterada e ainda contém informações sobre a condition que ativou o handler:

```sql
+----------------------------------------------+
| op                                           |
+----------------------------------------------+
| mapped insert succeeded, current DA is empty |
+----------------------------------------------+

+--------------------------------+-------+----------------------------+
| op                             | errno | msg                        |
+--------------------------------+-------+----------------------------+
| stacked DA after mapped insert |  1048 | Column 'c1' cannot be null |
+--------------------------------+-------+----------------------------+
```

Quando o condition handler termina, sua current diagnostics area é retirada da stack (popped) e a stacked diagnostics area se torna a current diagnostics area na stored procedure.

Após o retorno do procedure, a tabela contém duas linhas. A linha vazia resulta da tentativa de inserir `NULL` que foi mapeada para um `INSERT` de string vazia:

```sql
+----------+
| c1       |
+----------+
| string 1 |
|          |
+----------+
```

No exemplo anterior, as duas primeiras instruções [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") dentro do condition handler que recuperam informações das current e stacked diagnostics areas retornam os mesmos valores. Este não é o caso se instruções que redefinem a current diagnostics area forem executadas anteriormente dentro do handler. Suponha que `p()` seja reescrito para colocar as instruções [`DECLARE`](declare.html "13.6.3 DECLARE Statement") dentro da definição do handler, em vez de antes dela:

```sql
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    -- Declare variables to hold diagnostics area information
    DECLARE errcount INT;
    DECLARE errno INT;
    DECLARE msg TEXT;
    GET CURRENT DIAGNOSTICS CONDITION 1
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'current DA before mapped insert' AS op, errno, msg;
    GET STACKED DIAGNOSTICS CONDITION 1
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'stacked DA before mapped insert' AS op, errno, msg;
...
```

Neste caso, o resultado depende da versão:

* Antes do MySQL 5.7.2, [`DECLARE`](declare.html "13.6.3 DECLARE Statement") não altera a current diagnostics area, então as duas primeiras instruções [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") retornam o mesmo resultado, assim como na versão original de `p()`.

  No MySQL 5.7.2, foi realizado um trabalho para garantir que todas as instruções não diagnósticas preencham a diagnostics area, conforme o padrão SQL. [`DECLARE`](declare.html "13.6.3 DECLARE Statement") é uma delas, portanto, no 5.7.2 e superior, as instruções [`DECLARE`](declare.html "13.6.3 DECLARE Statement") executadas no início do handler limpam a current diagnostics area e as instruções [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") produzem resultados diferentes:

  ```sql
  +---------------------------------+-------+------+
  | op                              | errno | msg  |
  +---------------------------------+-------+------+
  | current DA before mapped insert |  NULL | NULL |
  +---------------------------------+-------+------+

  +---------------------------------+-------+----------------------------+
  | op                              | errno | msg                        |
  +---------------------------------+-------+----------------------------+
  | stacked DA before mapped insert |  1048 | Column 'c1' cannot be null |
  +---------------------------------+-------+----------------------------+
  ```

Para evitar essa questão dentro de um condition handler ao buscar obter informações sobre a condition que ativou o handler, certifique-se de acessar a stacked diagnostics area, e não a current diagnostics area.
