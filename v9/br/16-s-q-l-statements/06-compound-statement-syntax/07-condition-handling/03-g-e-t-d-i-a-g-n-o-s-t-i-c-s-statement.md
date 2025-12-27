#### 15.6.7.3 Declaração de DIAGNÓSTICOS

```
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

As declarações SQL produzem informações de diagnóstico que preenchem a área de diagnóstico. A declaração `GET DIAGNOSTICS` permite que as aplicações inspecionem essas informações. (Você também pode usar `SHOW WARNINGS` ou `SHOW ERRORS` para ver condições ou erros.)

Não são necessários privilégios especiais para executar `GET DIAGNOSTICS`.

A palavra-chave `CURRENT` significa recuperar informações da área de diagnóstico atual. A palavra-chave `STACKED` significa recuperar informações da segunda área de diagnóstico, que está disponível apenas se o contexto atual for um manipulador de condição. Se nenhuma das palavras-chave for fornecida, o padrão é usar a área de diagnóstico atual.

A declaração `GET DIAGNOSTICS` é tipicamente usada em um manipulador dentro de um programa armazenado. É uma extensão do MySQL que `GET [CURRENT] DIAGNOSTICS` é permitido fora do contexto do manipulador para verificar a execução de qualquer declaração SQL. Por exemplo, se você invocar o programa cliente **mysql**, você pode inserir essas declarações na prompt:

```
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

Essa extensão se aplica apenas à área de diagnóstico atual. Não se aplica à segunda área de diagnóstico porque `GET STACKED DIAGNOSTICS` é permitido apenas se o contexto atual for um manipulador de condição. Se esse não for o caso, ocorre um erro `GET STACKED DIAGNOSTICS when handler not active`.

Para uma descrição da área de diagnóstico, consulte a Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”. Em resumo, ela contém dois tipos de informações:

* Informações sobre a declaração, como o número de condições que ocorreram ou o número de linhas afetadas.

* Informações sobre a condição, como o código de erro e a mensagem. Se uma instrução gerar várias condições, esta parte da área de diagnóstico contém uma área de condição para cada uma. Se uma instrução não gerar condições, esta parte da área de diagnóstico está vazia.

Para uma instrução que gera três condições, a área de diagnóstico contém informações sobre a instrução e as condições da seguinte forma:

```
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

`GET DIAGNOSTICS` pode obter informações sobre a instrução ou as condições, mas não ambas na mesma instrução:

* Para obter informações sobre a instrução, retorne os itens desejados da instrução em variáveis de destino. Esta instância de `GET DIAGNOSTICS` atribui o número de condições disponíveis e o número de linhas afetadas às variáveis de usuário `@p1` e `@p2`:

  ```
  GET DIAGNOSTICS @p1 = NUMBER, @p2 = ROW_COUNT;
  ```

* Para obter informações sobre as condições, especifique o número da condição e retorne os itens desejados das condições em variáveis de destino. Esta instância de `GET DIAGNOSTICS` atribui o valor SQLSTATE e a mensagem de erro às variáveis de usuário `@p3` e `@p4`:

  ```
  GET DIAGNOSTICS CONDITION 1
    @p3 = RETURNED_SQLSTATE, @p4 = MESSAGE_TEXT;
  ```

A lista de recuperação especifica uma ou mais atribuições `target = item_name`, separadas por vírgulas. Cada atribuição nomeia uma variável de destino e um *`item_name_de_informação_da_instrução`* ou *`item_name_de_informação_da_condição`*, dependendo se a instrução recupera informações sobre a instrução ou as condições.

Os identificadores válidos de *`target`* para armazenar informações de itens podem ser parâmetros de procedimento ou função armazenados, variáveis locais de programa armazenadas declaradas com `DECLARE` ou variáveis definidas pelo usuário.

Os identificadores válidos de *`condition_number`* podem ser parâmetros de procedimento ou função armazenados, variáveis locais de programa armazenadas declaradas com `DECLARE`, variáveis definidas pelo usuário, variáveis de sistema ou literais. Um literal de caractere pode incluir um introduzir *`_charset`*. Um aviso ocorre se o número de condição não estiver no intervalo de 1 a o número de áreas de condição que têm informações. Neste caso, o aviso é adicionado à área de diagnóstico sem ser apagado.

Quando ocorre uma condição, o MySQL não preenche todos os itens de condição reconhecidos por `GET DIAGNOSTICS`. Por exemplo:

```
mysql> GET DIAGNOSTICS CONDITION 1
         @p5 = SCHEMA_NAME, @p6 = TABLE_NAME;
mysql> SELECT @p5, @p6;
+------+------+
| @p5  | @p6  |
+------+------+
|||
+------+------+
```

No SQL padrão, se houver várias condições, a primeira condição se relaciona ao valor `SQLSTATE` retornado para a declaração SQL anterior. No MySQL, isso não é garantido. Para obter o erro principal, você não pode fazer isso:

```
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Em vez disso, obtenha primeiro o número de condições, então use-o para especificar qual número de condição deve ser inspecionado:

```
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```

Para informações sobre os itens de informações de declarações e condições permitidas, e quais são preenchidos quando ocorre uma condição, consulte Itens de Informações da Área de Diagnóstico.

Aqui está um exemplo que usa `GET DIAGNOSTICS` e um manipulador de exceção no contexto do procedimento armazenado para avaliar o resultado de uma operação de inserção. Se a inserção foi bem-sucedida, o procedimento usa `GET DIAGNOSTICS` para obter o número de linhas afetadas. Isso mostra que você pode usar `GET DIAGNOSTICS` várias vezes para recuperar informações sobre uma declaração, desde que a área de diagnóstico atual não tenha sido apagada.

```
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

Suponha que `t1.int_col` seja uma coluna inteira que é declarada como `NOT NULL`. O procedimento produz esses resultados quando invocado para inserir valores `NULL` e `NULL`, respectivamente:

```
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

Quando um manipulador de condição é ativado, ocorre um empurrão para a pilha da área de diagnóstico:

* A primeira (atual) área de diagnóstico se torna a segunda (em pilha) área de diagnóstico e uma nova área de diagnóstico atual é criada como uma cópia dela.

* `GET [CURRENT] DIAGNOSTICS` e `GET STACKED DIAGNOSTICS` podem ser usados dentro do manipulador para acessar o conteúdo das áreas de diagnóstico atual e em pilha.

* Inicialmente, ambas as áreas de diagnóstico retornam o mesmo resultado, então é possível obter informações da área de diagnóstico atual sobre a condição que ativou o manipulador, *desde que* você não execute nenhuma instrução dentro do manipulador que mude sua área de diagnóstico atual.

* No entanto, instruções que executam dentro do manipulador podem modificar a área de diagnóstico atual, apagando e definindo seu conteúdo de acordo com as regras normais (veja Como a Área de Diagnóstico é Limpada e Populada).

Uma maneira mais confiável de obter informações sobre a condição que ativa o manipulador é usar a área de diagnóstico em pilha, que não pode ser modificada por instruções que executam dentro do manipulador, exceto `RESIGNAL`. Para informações sobre quando a área de diagnóstico atual é definida e apagada, consulte a Seção 15.6.7.7, “A Área de Diagnóstico MySQL”.

O próximo exemplo mostra como `GET STACKED DIAGNOSTICS` pode ser usado dentro de um manipulador para obter informações sobre a exceção tratada, mesmo após a área de diagnóstico atual ter sido modificada por instruções do manipulador.

Dentro de um procedimento armazenado `p()`, tentamos inserir dois valores em uma tabela que contém uma coluna `TEXT NOT NULL`. O primeiro valor é uma string que não é `NULL` e o segundo é `NULL`. A coluna proíbe valores `NULL`, então o primeiro inserção tem sucesso, mas a segunda causa uma exceção. O procedimento inclui um manipulador de exceção que mapeia tentativas de inserir `NULL` em inserções da string vazia:

```
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

Quando o manipulador é ativado, uma cópia da área de diagnóstico atual é empurrada para a pilha de áreas de diagnóstico. O manipulador primeiro exibe o conteúdo das áreas de diagnóstico atual e empilhada, que são ambas as mesmas inicialmente:

```
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

As instruções que executam após as instruções `GET DIAGNOSTICS` podem reiniciar a área de diagnóstico atual. As instruções podem reiniciar a área de diagnóstico atual. Por exemplo, o manipulador mapeia a inserção `NULL` para uma inserção de string vazia e exibe o resultado. A nova inserção tem sucesso e limpa a área de diagnóstico atual, mas a área de diagnóstico empilhada permanece inalterada e ainda contém informações sobre a condição que ativou o manipulador:

```
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

Quando o manipulador de condição termina, sua área de diagnóstico atual é removida da pilha e a área de diagnóstico empilhada se torna a área de diagnóstico atual no procedimento armazenado.

Após o procedimento retornar, a tabela contém duas linhas. A linha vazia resulta da tentativa de inserir `NULL` que foi mapeada para uma inserção de string vazia:

```
+----------+
| c1       |
+----------+
| string 1 |
||
+----------+
```