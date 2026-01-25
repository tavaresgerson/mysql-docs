#### 13.6.7.4 Instrução RESIGNAL

```sql
RESIGNAL [condition_value]
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

A instrução [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") repassa as informações de condição de erro que estão disponíveis durante a execução de um condition handler dentro de uma instrução composta (compound statement) em uma stored procedure ou function, trigger ou event. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") pode alterar parte ou toda a informação antes de repassá-la. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") está relacionada a [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), mas em vez de originar uma condição como faz [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") retransmite informações de condição existentes, possivelmente após modificá-las.

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") possibilita tanto tratar (handle) um erro quanto retornar a informação do erro. Caso contrário, ao executar uma instrução SQL dentro do handler, a informação que causou a ativação do handler é destruída. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") também pode encurtar algumas procedures se um determinado handler puder tratar parte de uma situação e, em seguida, repassar a condição “para cima” (up the line) para outro handler.

Nenhum privilege é necessário para executar a instrução [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement").

Todas as formas de [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") exigem que o contexto atual seja um condition handler. Caso contrário, [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") é ilegal e ocorre um erro `RESIGNAL when handler not active`.

Para recuperar informações da diagnostics area, use a instrução [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") (consulte [Section 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")). Para obter informações sobre a diagnostics area, consulte [Section 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

* [Visão Geral de RESIGNAL](resignal.html#resignal-overview "RESIGNAL Overview")
* [RESIGNAL Sozinho](resignal.html#resignal-alone "RESIGNAL Alone")
* [RESIGNAL com Nova Informação de Signal](resignal.html#resignal-with-new-signal "RESIGNAL with New Signal Information")
* [RESIGNAL com um Condition Value e Nova Informação de Signal Opcional](resignal.html#resignal-with-condition "RESIGNAL with a Condition Value and Optional New Signal Information")
* [RESIGNAL Exige Contexto de Condition Handler](resignal.html#resignal-handler "RESIGNAL Requires Condition Handler Context")

##### Visão Geral de RESIGNAL

Para *`condition_value`* e *`signal_information_item`*, as definições e regras são as mesmas para [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") e para [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"). Por exemplo, o *`condition_value`* pode ser um valor `SQLSTATE`, e o valor pode indicar errors, warnings, ou “not found.” Para informações adicionais, consulte [Section 13.6.7.5, “SIGNAL Statement”](signal.html "13.6.7.5 SIGNAL Statement").

A instrução [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") aceita *`condition_value`* e cláusulas `SET`, ambas opcionais. Isso leva a vários usos possíveis:

* [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") sozinho:

  ```sql
  RESIGNAL;
  ```

* [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") com nova informação de signal:

  ```sql
  RESIGNAL SET signal_information_item [, signal_information_item] ...;
  ```

* [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") com um condition value e possivelmente nova informação de signal:

  ```sql
  RESIGNAL condition_value
      [SET signal_information_item [, signal_information_item] ...];
  ```

Estes casos de uso causam alterações nas diagnostics area e nas condition areas:

* Uma diagnostics area contém uma ou mais condition areas.
* Uma condition area contém itens de informação de condição, como o valor `SQLSTATE`, `MYSQL_ERRNO` ou `MESSAGE_TEXT`.

Existe uma stack de diagnostics areas. Quando um handler assume o controle, ele empilha (pushes) uma diagnostics area no topo da stack, de modo que há duas diagnostics areas durante a execução do handler:

* A primeira (current) diagnostics area, que começa como uma cópia da última diagnostics area, mas é sobrescrita pela primeira instrução no handler que altera a current diagnostics area.

* A última (stacked) diagnostics area, que possui as condition areas que foram configuradas antes de o handler assumir o controle.

O número máximo de condition areas em uma diagnostics area é determinado pelo valor da variável de sistema [`max_error_count`](server-system-variables.html#sysvar_max_error_count). Consulte [Diagnostics Area-Related System Variables](diagnostics-area.html#diagnostics-area-system-variables "Diagnostics Area-Related System Variables").

##### RESIGNAL Sozinho

Um simples [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") sozinho significa “repassar o erro sem alteração.” Ele restaura a última diagnostics area e a torna a current diagnostics area. Ou seja, ele “desempilha” (pops) a diagnostics area stack.

Dentro de um condition handler que captura uma condição, um uso para [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") sozinho é realizar outras ações e, em seguida, repassar sem alteração a informação da condição original (a informação que existia antes da entrada no handler).

Exemplo:

```sql
DROP TABLE IF EXISTS xx;
delimiter //
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @error_count = @error_count + 1;
    IF @a = 0 THEN RESIGNAL; END IF;
  END;
  DROP TABLE xx;
END//
delimiter ;
SET @error_count = 0;
SET @a = 0;
CALL p();
```

Suponha que a instrução `DROP TABLE xx` falhe. A diagnostics area stack se parece com isto:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

Em seguida, a execução entra no handler `EXIT`. Ele começa empilhando uma diagnostics area no topo da stack, que agora se parece com isto:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, o conteúdo da primeira (current) e da segunda (stacked) diagnostics area é o mesmo. A primeira diagnostics area pode ser modificada por instruções executadas subsequentemente dentro do handler.

Geralmente, uma procedure statement limpa a primeira diagnostics area. `BEGIN` é uma exceção, ele não limpa, não faz nada. `SET` não é uma exceção, ele limpa, executa a operação e produz um resultado de “success.” A diagnostics area stack agora se parece com isto:

```sql
DA 1. ERROR 0000 (00000): Successful operation
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, se `@a = 0`, [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") desempilha a diagnostics area stack, que agora se parece com isto:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

E é isso que o chamador vê.

Se `@a` não for 0, o handler simplesmente termina, o que significa que não há mais uso para a current diagnostics area (ela foi “tratada”), então ela pode ser descartada, fazendo com que a stacked diagnostics area se torne a current diagnostics area novamente. A diagnostics area stack se parece com isto:

```sql
DA 1. ERROR 0000 (00000): Successful operation
```

Os detalhes fazem parecer complexo, mas o resultado final é bastante útil: Handlers podem ser executados sem destruir informações sobre a condição que causou a ativação do handler.

##### RESIGNAL com Nova Informação de Signal

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") com uma cláusula `SET` fornece novas informações de signal, de modo que a instrução significa “repassar o erro com alterações”:

```sql
RESIGNAL SET signal_information_item [, signal_information_item] ...;
```

Assim como acontece com [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") sozinho, a ideia é desempilhar a diagnostics area stack para que a informação original seja repassada. Ao contrário de [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") sozinho, tudo o que for especificado na cláusula `SET` é alterado.

Exemplo:

```sql
DROP TABLE IF EXISTS xx;
delimiter //
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @error_count = @error_count + 1;
    IF @a = 0 THEN RESIGNAL SET MYSQL_ERRNO = 5; END IF;
  END;
  DROP TABLE xx;
END//
delimiter ;
SET @error_count = 0;
SET @a = 0;
CALL p();
```

Lembre-se da discussão anterior de que [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") sozinho resulta em uma diagnostics area stack como esta:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

A instrução `RESIGNAL SET MYSQL_ERRNO = 5` resulta nesta stack, que é o que o chamador vê:

```sql
DA 1. ERROR 5 (42S02): Unknown table 'xx'
```

Em outras palavras, ela altera o número do error, e nada mais.

A instrução [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") pode alterar qualquer ou todos os itens de informação de signal, fazendo com que a primeira condition area da diagnostics area pareça bem diferente.

##### RESIGNAL com um Condition Value e Nova Informação de Signal Opcional

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") com um condition value significa “empilhar uma condição na current diagnostics area.” Se a cláusula `SET` estiver presente, ela também altera as informações de error.

```sql
RESIGNAL condition_value
    [SET signal_information_item [, signal_information_item] ...];
```

Esta forma de [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") restaura a última diagnostics area e a torna a current diagnostics area. Ou seja, ela “desempilha” a diagnostics area stack, o que é o mesmo que um simples [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") sozinho faria. No entanto, ela também altera a diagnostics area dependendo do condition value ou da informação de signal.

Exemplo:

```sql
DROP TABLE IF EXISTS xx;
delimiter //
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @error_count = @error_count + 1;
    IF @a = 0 THEN RESIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=5; END IF;
  END;
  DROP TABLE xx;
END//
delimiter ;
SET @error_count = 0;
SET @a = 0;
SET @@max_error_count = 2;
CALL p();
SHOW ERRORS;
```

Isto é semelhante ao exemplo anterior, e os efeitos são os mesmos, exceto que, se [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") ocorrer, a current condition area se parecerá diferente no final. (O motivo pelo qual a condição se soma em vez de substituir a condição existente é o uso de um condition value.)

A instrução [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") inclui um condition value (`SQLSTATE '45000'`), então ela adiciona uma nova condition area, resultando em uma diagnostics area stack que se parece com isto:

```sql
DA 1. (condition 2) ERROR 1051 (42S02): Unknown table 'xx'
      (condition 1) ERROR 5 (45000) Unknown table 'xx'
```

O resultado de [`CALL p()`](call.html "13.2.1 CALL Statement") e [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") para este exemplo é:

```sql
mysql> CALL p();
ERROR 5 (45000): Unknown table 'xx'
mysql> SHOW ERRORS;
+-------+------+----------------------------------+
| Level | Code | Message                          |
+-------+------+----------------------------------+
| Error | 1051 | Unknown table 'xx'               |
| Error |    5 | Unknown table 'xx'               |
+-------+------+----------------------------------+
```

##### RESIGNAL Exige Contexto de Condition Handler

Todas as formas de [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") exigem que o contexto atual seja um condition handler. Caso contrário, [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") é ilegal e ocorre um erro `RESIGNAL when handler not active`. Por exemplo:

```sql
mysql> CREATE PROCEDURE p () RESIGNAL;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL p();
ERROR 1645 (0K000): RESIGNAL when handler not active
```

Aqui está um exemplo mais difícil:

```sql
delimiter //
CREATE FUNCTION f () RETURNS INT
BEGIN
  RESIGNAL;
  RETURN 5;
END//
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET @a=f();
  SIGNAL SQLSTATE '55555';
END//
delimiter ;
CALL p();
```

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") ocorre dentro da stored function `f()`. Embora `f()` em si seja invocada no contexto do handler `EXIT`, a execução dentro de `f()` tem seu próprio contexto, que não é um contexto de handler. Assim, `RESIGNAL` dentro de `f()` resulta em um erro “handler not active”.