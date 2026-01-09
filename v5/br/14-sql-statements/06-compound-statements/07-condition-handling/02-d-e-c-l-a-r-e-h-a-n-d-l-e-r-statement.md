#### 13.6.7.2 DECLARAR ... declaração do manipulador

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

A declaração `DECLARE ... HANDLER` especifica um manipulador que lida com uma ou mais condições. Se uma dessas condições ocorrer, a *`declaração`* especificada é executada. *`declaração`* pode ser uma declaração simples, como `SET var_name = value`, ou uma declaração composta escrita usando `BEGIN` e `END` (veja Seção 13.6.1, “Declaração Composta BEGIN ... END”).

As declarações de manipulador devem aparecer após as declarações de variáveis ou condições.

O valor *`handler_action`* indica a ação que o manipulador executa após a execução da instrução do manipulador:

- `CONTINUE`: A execução do programa atual continua.

- `EXIT`: A execução termina para a instrução composta `BEGIN ... END` na qual o manipulador é declarado. Isso é verdadeiro mesmo que a condição ocorra em um bloco interno.

- `UNDO`: Não é suportado.

O `valor_condição` para `DECLARE ... HANDLER` indica a condição específica ou a classe de condições que ativa o manipulador. Ele pode assumir as seguintes formas:

- *`mysql_error_code`*: Um literal inteiro que indica um código de erro MySQL, como 1051 para especificar “tabela desconhecida”:

  ```sql
  DECLARE CONTINUE HANDLER FOR 1051
    BEGIN
      -- body of handler
    END;
  ```

  Não use o código de erro do MySQL 0, pois ele indica sucesso em vez de uma condição de erro. Para uma lista de códigos de erro do MySQL, consulte Referência de Mensagem de Erro do Servidor.

- SQLSTATE [VALOR] *`sqlstate_value`*: Uma literal de cadeia de caracteres de 5 caracteres que indica um valor SQLSTATE, como `'42S01'` para especificar “tabela desconhecida”:

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
    BEGIN
      -- body of handler
    END;
  ```

  Não use valores SQLSTATE que comecem com `'00'`, pois esses indicam sucesso em vez de uma condição de erro. Para uma lista de valores SQLSTATE, consulte Referência de Mensagem de Erro do Servidor.

- *`condition_name`*: Um nome de condição previamente especificado com `DECLARE ... CONDITION`. Um nome de condição pode ser associado a um código de erro MySQL ou valor SQLSTATE. Veja Seção 13.6.7.1, “Instrução ... CONDITION”.

- `SQLWARNING`: Abreviação para a classe de valores SQLSTATE que começam com `'01'`.

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLWARNING
    BEGIN
      -- body of handler
    END;
  ```

- `NOT FOUND`: Abreviação para a classe de valores SQLSTATE que começam com `'02'`. Isso é relevante no contexto de cursors e é usado para controlar o que acontece quando um cursor atinge o final de um conjunto de dados. Se mais linhas não estiverem disponíveis, uma condição de Nenhum dado ocorre com o valor SQLSTATE `'02000'`. Para detectar essa condição, você pode configurar um manipulador para ela ou para uma condição `NOT FOUND`.

  ```sql
  DECLARE CONTINUE HANDLER FOR NOT FOUND
    BEGIN
      -- body of handler
    END;
  ```

  Para outro exemplo, veja Seção 13.6.6, "Cursors". A condição `NOT FOUND` também ocorre para instruções `SELECT ... INTO var_list` que não recuperam nenhuma linha.

- `SQLEXCEPTION`: Abreviação para a classe de valores SQLSTATE que não começam com `'00'`, `'01'` ou `'02'`.

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      -- body of handler
    END;
  ```

Para obter informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte Seção 13.6.7.6, “Regras de escopo para manipuladores”.

Se ocorrer uma condição para a qual nenhum manipulador foi declarado, a ação tomada depende da classe da condição:

- Para as condições `SQLEXCEPTION`, o programa armazenado termina na instrução que gerou a condição, como se houvesse um manipulador `EXIT`. Se o programa foi chamado por outro programa armazenado, o programa que o chamou lida com a condição usando as regras de seleção de manipulador aplicadas aos seus próprios manipuladores.

- Para as condições `SQLWARNING`, o programa continua executando, como se houvesse um manipulador `CONTINUE`.

- Para condições de `NOT FOUND`, se a condição foi levantada normalmente, a ação é `CONTINUE`. Se foi levantada por `SIGNAL` ou `RESIGNAL`, a ação é `EXIT`.

O exemplo a seguir utiliza um manipulador para `SQLSTATE '23000'`, que ocorre em caso de erro de chave duplicada:

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

Observe que `@x` é `3` após a execução do procedimento, o que mostra que a execução continuou até o final do procedimento após o erro ocorrer. Se a instrução `DECLARE ... HANDLER` não tivesse sido presente, o MySQL teria tomado a ação padrão (`EXIT`) após o segundo `INSERT` falhar devido à restrição `PRIMARY KEY`, e `SELECT @x` teria retornado `2`.

Para ignorar uma condição, declare um manipulador `CONTINUE` para ela e associe-o a um bloco vazio. Por exemplo:

```sql
DECLARE CONTINUE HANDLER FOR SQLWARNING BEGIN END;
```

O escopo de uma etiqueta de bloco não inclui o código para manipuladores declarados dentro do bloco. Portanto, a declaração associada a um manipulador não pode usar `ITERATE` ou `LEAVE` para referir-se a etiquetas de blocos que encerram a declaração do manipulador. Considere o seguinte exemplo, onde o bloco `REPEAT` tem uma etiqueta de `retry`:

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

A etiqueta `retry` está no escopo da instrução `IF` dentro do bloco. Não está no escopo do manipulador `CONTINUE`, então a referência lá é inválida e resulta em um erro:

```sql
ERROR 1308 (42000): LEAVE with no matching label: retry
```

Para evitar referências a rótulos externos nos manipuladores, use uma dessas estratégias:

- Para sair do bloco, use um manipulador `EXIT`. Se não for necessário limpar o bloco, o corpo do manipulador `[BEGIN ... END` (begin-end.html) pode ser vazio:

  ```sql
  DECLARE EXIT HANDLER FOR SQLWARNING BEGIN END;
  ```

  Caso contrário, coloque as declarações de limpeza no corpo do manipulador:

  ```sql
  DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
      block cleanup statements
    END;
  ```

- Para continuar a execução, defina uma variável de status em um manipulador de `CONTINUE` que possa ser verificada no bloco envolvente para determinar se o manipulador foi invocado. O exemplo a seguir usa a variável `done` para esse propósito:

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
