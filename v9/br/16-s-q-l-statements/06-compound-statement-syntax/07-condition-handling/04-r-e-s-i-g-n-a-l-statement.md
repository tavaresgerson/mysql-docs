#### 15.6.7.4 Declaração `RESIGNAL`

```
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

`RESIGNAL` transmite as informações sobre a condição de erro que estão disponíveis durante a execução de um manipulador de condição dentro de uma instrução composta dentro de um procedimento armazenado, função, gatilho ou evento. `RESIGNAL` pode alterar algumas ou todas as informações antes de transmiti-las. `RESIGNAL` está relacionado a `SIGNAL`, mas, em vez de originar uma condição como `SIGNAL`, `RESIGNAL` retransmite as informações existentes sobre a condição, possivelmente após modificá-las.

`RESIGNAL` permite tanto lidar com um erro quanto retornar as informações do erro. Caso contrário, ao executar uma instrução SQL dentro do manipulador, as informações que causaram a ativação do manipulador são destruídas. `RESIGNAL` também pode tornar alguns procedimentos mais curtos se um manipulador dado puder lidar com parte de uma situação e, em seguida, passar a condição “para cima da linha” para outro manipulador.

Não são necessários privilégios para executar a declaração `RESIGNAL`.

Todas as formas de `RESIGNAL` exigem que o contexto atual seja um manipulador de condição. Caso contrário, `RESIGNAL` é ilegal e ocorre um erro `RESIGNAL when handler not active` (RESIGNAL quando o manipulador não está ativo).

Para recuperar informações da área de diagnóstico, use a declaração `GET DIAGNOSTICS` (consulte a Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte a Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.

* Visão geral de RESIGNAL
* RESIGNAL sozinho
* RESIGNAL com novas informações de sinal
* RESIGNAL com um valor de condição e informações opcionais de novo sinal
* RESIGNAL requer contexto de manipulador de condição

Para `condition_value` e `signal_information_item`, as definições e regras são as mesmas para `RESIGNAL` quanto para `SIGNAL`. Por exemplo, o *`condition_value`* pode ser um valor `SQLSTATE`, e o valor pode indicar erros, avisos ou "não encontrado". Para informações adicionais, consulte a Seção 15.6.7.5, "Instrução SIGNAL".

A instrução `RESIGNAL` aceita cláusulas `condition_value` e `SET`, ambas opcionais. Isso leva a vários usos possíveis:

* `RESIGNAL` sozinho:

  ```
  RESIGNAL;
  ```

* `RESIGNAL` com nova informação de sinal:

  ```
  RESIGNAL SET signal_information_item [, signal_information_item] ...;
  ```

* `RESIGNAL` com um valor de condição e possivelmente nova informação de sinal:

  ```
  RESIGNAL condition_value
      [SET signal_information_item [, signal_information_item] ...];
  ```

Esses casos de uso causam mudanças nas áreas de diagnóstico e condição:

* Uma área de diagnóstico contém uma ou mais áreas de condição.
* Uma área de condição contém itens de informação de condição, como o valor `SQLSTATE`, `MYSQL_ERRNO` ou `MESSAGE_TEXT`.

Há uma pilha de áreas de diagnóstico. Quando um manipulador assume o controle, ele empurra uma área de diagnóstico para a parte superior da pilha, então há duas áreas de diagnóstico durante a execução do manipulador:

* A primeira (atual) área de diagnóstico, que começa como uma cópia da última área de diagnóstico, mas é sobrescrita pelo primeiro comando no manipulador que altera a área de diagnóstico atual.

* A última (em pilha) área de diagnóstico, que contém as áreas de condição que foram configuradas antes do manipulador assumir o controle.

O número máximo de áreas de condição em uma área de diagnóstico é determinado pelo valor da variável de sistema `max_error_count`. Consulte Variáveis de Sistema Relacionadas à Área de Diagnóstico.

##### RESIGNAL Sozinho

Um simples `RESIGNAL` sozinho significa “passar o erro sem alterações”. Ele restaura a última área de diagnóstico e a torna a área de diagnóstico atual. Ou seja, ele “desloca” a pilha de áreas de diagnóstico.

Dentro de um manipulador de condição que captura uma condição, um uso para `RESIGNAL` sozinho é realizar algumas outras ações e, em seguida, passar sem alterações as informações originais da condição (as informações que existiam antes da entrada no manipulador).

Exemplo:

```
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

Suponha que a instrução `DROP TABLE xx` falhe. A pilha de áreas de diagnóstico parece assim:

```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

Então, a execução entra no manipulador `EXIT`. Ele começa empurrando uma área de diagnóstico para o topo da pilha, que agora parece assim:

```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, o conteúdo da primeira (atual) e da segunda (em pilha) áreas de diagnóstico são os mesmos. A primeira área de diagnóstico pode ser modificada por instruções que executam posteriormente dentro do manipulador.

Normalmente, uma instrução de procedimento limpa a primeira área de diagnóstico. `BEGIN` é uma exceção, ele não limpa, ele não faz nada. `SET` não é uma exceção, ele limpa, executa a operação e produz um resultado de “sucesso”. A pilha de áreas de diagnóstico agora parece assim:

```
DA 1. ERROR 0000 (00000): Successful operation
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, se `@a = 0`, `RESIGNAL` desloca a pilha de áreas de diagnóstico, que agora parece assim:

```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

E é isso que o chamador vê.

Se `@a` não for 0, o manipulador simplesmente termina, o que significa que não há mais uso para a área de diagnóstico atual (ela foi “tratada”), então ela pode ser descartada, fazendo com que a área de diagnóstico em pilha volte a ser a área de diagnóstico atual. A pilha de áreas de diagnóstico parece assim:

```
DA 1. ERROR 0000 (00000): Successful operation
```RRwwAYDvuE```
RESIGNAL SET signal_information_item [, signal_information_item] ...;
```juIzOUa7s9```
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
```k6VitoBLUR```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```7IAbeIvqWf```
DA 1. ERROR 5 (42S02): Unknown table 'xx'
```vHq4SJd2xQ```
RESIGNAL condition_value
    [SET signal_information_item [, signal_information_item] ...];
```qL7V9gYMAR```
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
```4I2cp5AECb```
DA 1. (condition 2) ERROR 1051 (42S02): Unknown table 'xx'
      (condition 1) ERROR 5 (45000) Unknown table 'xx'
```FHct7mQX2W```
mysql> CALL p();
ERROR 5 (45000): Unknown table 'xx'
mysql> SHOW ERRORS;
+-------+------+----------------------------------+
| Level | Code | Message                          |
+-------+------+----------------------------------+
| Error | 1051 | Unknown table 'xx'               |
| Error |    5 | Unknown table 'xx'               |
+-------+------+----------------------------------+
```yI7z8YKvPl```
mysql> CREATE PROCEDURE p () RESIGNAL;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL p();
ERROR 1645 (0K000): RESIGNAL when handler not active
```kJ1oOnI4NU```

`RESIGNAL` ocorre dentro da função armazenada `f()`. Embora `f()` em si seja invocado dentro do contexto do manipulador `EXIT`, a execução dentro de `f()` tem seu próprio contexto, que não é o contexto do manipulador. Assim, `RESIGNAL` dentro de `f()` resulta em um erro de “manipulador não ativo”.