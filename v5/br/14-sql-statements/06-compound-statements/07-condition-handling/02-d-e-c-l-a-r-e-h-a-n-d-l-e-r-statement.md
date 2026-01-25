#### 13.6.7.2 Instrução DECLARE ... HANDLER

```sql
DECLARE handler_action HANDLER
    FOR condition_value [, condition_value] ...
    statement

handler_action: {
    CONTINUE
  | EXIT
  | UNDO
}

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
  | condition_name
  | SQLWARNING
  | NOT FOUND
  | SQLEXCEPTION
}
```

A instrução [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 Instrução DECLARE ... HANDLER") especifica um HANDLER que lida com uma ou mais condições. Se uma dessas condições ocorrer, o *`statement`* especificado é executado. O *`statement`* pode ser uma instrução simples, como `SET var_name = value`, ou uma instrução composta escrita usando `BEGIN` e `END` (consulte [Seção 13.6.1, “Instrução Composta BEGIN ... END”](begin-end.html "13.6.1 BEGIN ... END Compound Statement")).

As declarações de HANDLER devem aparecer após as declarações de variáveis ou condições.

O valor *`handler_action`* indica qual ação o HANDLER executa após a execução da instrução do HANDLER:

* `CONTINUE`: A execução do programa atual continua.

* `EXIT`: A execução é encerrada para a instrução composta [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") na qual o HANDLER é declarado. Isso é verdade mesmo que a condição ocorra em um bloco interno.

* `UNDO`: Não suportado.

O *`condition_value`* para [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 Instrução DECLARE ... HANDLER") indica a condição específica ou classe de condições que ativa o HANDLER. Ele pode assumir as seguintes formas:

* *`mysql_error_code`*: Um literal inteiro indicando um código de erro do MySQL, como 1051 para especificar “unknown table”:

  ```sql
  DECLARE CONTINUE HANDLER FOR 1051
    BEGIN
      -- body of handler
    END;
  ```

  Não utilize o código de erro 0 do MySQL, pois ele indica sucesso em vez de uma condição de erro. Para uma lista de códigos de erro do MySQL, consulte [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* SQLSTATE [VALUE] *`sqlstate_value`*: Um literal string de 5 caracteres indicando um valor SQLSTATE, como `'42S01'` para especificar “unknown table”:

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
    BEGIN
      -- body of handler
    END;
  ```

  Não utilize valores SQLSTATE que comecem com `'00'`, pois eles indicam sucesso em vez de uma condição de erro. Para uma lista de valores SQLSTATE, consulte [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* *`condition_name`*: Um nome de condição previamente especificado com [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement"). Um nome de condição pode ser associado a um código de erro do MySQL ou a um valor SQLSTATE. Consulte [Seção 13.6.7.1, “Instrução DECLARE ... CONDITION”](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement").

* `SQLWARNING`: Abreviação para a classe de valores SQLSTATE que começam com `'01'`.

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLWARNING
    BEGIN
      -- body of handler
    END;
  ```

* `NOT FOUND`: Abreviação para a classe de valores SQLSTATE que começam com `'02'`. Isso é relevante no contexto de Cursors e é usado para controlar o que acontece quando um Cursor atinge o fim de um conjunto de dados. Se não houver mais linhas disponíveis, ocorre uma condição No Data com valor SQLSTATE `'02000'`. Para detectar esta condição, você pode configurar um HANDLER para ela ou para uma condição `NOT FOUND`.

  ```sql
  DECLARE CONTINUE HANDLER FOR NOT FOUND
    BEGIN
      -- body of handler
    END;
  ```

  Para outro exemplo, consulte [Seção 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors"). A condição `NOT FOUND` também ocorre para instruções `SELECT ... INTO var_list` que não recuperam nenhuma linha.

* `SQLEXCEPTION`: Abreviação para a classe de valores SQLSTATE que não começam com `'00'`, `'01'` ou `'02'`.

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      -- body of handler
    END;
  ```

Para obter informações sobre como o servidor escolhe os HANDLERs quando uma condição ocorre, consulte [Seção 13.6.7.6, “Regras de Escopo para Handlers”](handler-scope.html "13.6.7.6 Scope Rules for Handlers").

Se ocorrer uma condição para a qual nenhum HANDLER foi declarado, a ação tomada depende da classe da condição:

* Para condições `SQLEXCEPTION`, o programa armazenado é encerrado na instrução que levantou a condição, como se houvesse um HANDLER `EXIT`. Se o programa foi chamado por outro programa armazenado, o programa chamador lida com a condição usando as regras de seleção de HANDLER aplicadas aos seus próprios HANDLERs.

* Para condições `SQLWARNING`, o programa continua a execução, como se houvesse um HANDLER `CONTINUE`.

* Para condições `NOT FOUND`, se a condição foi levantada normalmente, a ação é `CONTINUE`. Se foi levantada por [`SIGNAL`](signal.html "13.6.7.5 Instrução SIGNAL") ou [`RESIGNAL`](resignal.html "13.6.7.4 Instrução RESIGNAL"), a ação é `EXIT`.

O exemplo a seguir usa um HANDLER para `SQLSTATE '23000'`, que ocorre para um erro de duplicate-key:

```sql
mysql> CREATE TABLE test.t (s1 INT, PRIMARY KEY (s1));
Query OK, 0 rows affected (0.00 sec)

mysql> delimiter //

mysql> CREATE PROCEDURE handlerdemo ()
       BEGIN
         DECLARE CONTINUE HANDLER FOR SQLSTATE '23000' SET @x2 = 1;
         SET @x = 1;
         INSERT INTO test.t VALUES (1);
         SET @x = 2;
         INSERT INTO test.t VALUES (1);
         SET @x = 3;
       END;
       //
Query OK, 0 rows affected (0.00 sec)

mysql> CALL handlerdemo()//
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x//
    +------+
    | @x   |
    +------+
    | 3    |
    +------+
    1 row in set (0.00 sec)
```

Observe que `@x` é `3` após a execução do procedure, o que demonstra que a execução continuou até o final do procedure após o erro ocorrer. Se a instrução [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 Instrução DECLARE ... HANDLER") não estivesse presente, o MySQL teria tomado a ação padrão (`EXIT`) após o segundo [`INSERT`](insert.html "13.2.5 Instrução INSERT") falhar devido à restrição `PRIMARY KEY`, e `SELECT @x` teria retornado `2`.

Para ignorar uma condição, declare um HANDLER `CONTINUE` para ela e associe-o a um bloco vazio. Por exemplo:

```sql
DECLARE CONTINUE HANDLER FOR SQLWARNING BEGIN END;
```

O escopo de um label de bloco não inclui o código para HANDLERs declarados dentro do bloco. Portanto, a instrução associada a um HANDLER não pode usar [`ITERATE`](iterate.html "13.6.5.3 Instrução ITERATE") ou [`LEAVE`](leave.html "13.6.5.4 Instrução LEAVE") para se referir a labels de blocos que englobam a declaração do HANDLER. Considere o exemplo a seguir, onde o bloco [`REPEAT`](repeat.html "13.6.5.6 Instrução REPEAT") tem um label `retry`:

```sql
CREATE PROCEDURE p ()
BEGIN
  DECLARE i INT DEFAULT 3;
  retry:
    REPEAT
      BEGIN
        DECLARE CONTINUE HANDLER FOR SQLWARNING
          BEGIN
            ITERATE retry;    # illegal
          END;
        IF i < 0 THEN
          LEAVE retry;        # legal
        END IF;
        SET i = i - 1;
      END;
    UNTIL FALSE END REPEAT;
END;
```

O label `retry` está no escopo para a instrução [`IF`](if.html "13.6.5.2 Instrução IF") dentro do bloco. Ele não está no escopo para o HANDLER `CONTINUE`, portanto, a referência é inválida e resulta em um erro:

```sql
ERROR 1308 (42000): LEAVE with no matching label: retry
```

Para evitar referências a labels externos em HANDLERs, utilize uma destas estratégias:

* Para sair do bloco, use um HANDLER `EXIT`. Se nenhuma limpeza do bloco for necessária, o corpo do HANDLER [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") pode ser vazio:

  ```sql
  DECLARE EXIT HANDLER FOR SQLWARNING BEGIN END;
  ```

  Caso contrário, coloque as instruções de limpeza no corpo do HANDLER:

  ```sql
  DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
      block cleanup statements
    END;
  ```

* Para continuar a execução, defina uma variável de status em um HANDLER `CONTINUE` que pode ser verificada no bloco englobante para determinar se o HANDLER foi invocado. O exemplo a seguir usa a variável `done` para essa finalidade:

  ```sql
  CREATE PROCEDURE p ()
  BEGIN
    DECLARE i INT DEFAULT 3;
    DECLARE done INT DEFAULT FALSE;
    retry:
      REPEAT
        BEGIN
          DECLARE CONTINUE HANDLER FOR SQLWARNING
            BEGIN
              SET done = TRUE;
            END;
          IF done OR i < 0 THEN
            LEAVE retry;
          END IF;
          SET i = i - 1;
        END;
      UNTIL FALSE END REPEAT;
  END;
  ```
