#### 13.6.7.4 Declaração RESIGNAL

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

`RESIGNAL` transmite as informações sobre a condição de erro que estão disponíveis durante a execução de um manipulador de condição dentro de uma instrução composta dentro de um procedimento ou função armazenada, um gatilho ou um evento. `RESIGNAL` pode alterar algumas ou todas as informações antes de transmiti-las. `RESIGNAL` está relacionado a `SIGNAL`, mas, em vez de originar uma condição como o faz o `SIGNAL`, o `RESIGNAL` retransmite as informações existentes sobre a condição, possivelmente após modificá-las.

`RESIGNAL` permite tanto lidar com um erro quanto retornar as informações do erro. Caso contrário, ao executar uma instrução SQL dentro do manipulador, as informações que causaram a ativação do manipulador são destruídas. O `RESIGNAL` também pode tornar alguns procedimentos mais curtos se um manipulador específico puder lidar com parte de uma situação, passando então a condição para outro manipulador.

Não são necessários privilégios para executar a declaração `RESIGNAL`.

Todas as formas de `RESIGNAL` exigem que o contexto atual seja um manipulador de condição. Caso contrário, `RESIGNAL` é ilegal e ocorre um erro `RESIGNAL when handler not active` (RESIGNAL quando o manipulador não está ativo).

Para recuperar informações da área de diagnóstico, use a instrução `GET DIAGNOSTICS` (consulte Seção 13.6.7.3, “Instrução GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 13.6.7.7, “A Área de Diagnóstico do MySQL”.

- Visão geral do RESIGNAL
- RESIGNAL Apenas
- Reenviar com Novas Informações de Sinal
- Reenviar com um Valor de Condição e Informações Opcionais sobre Novo Sinal
- RESIGNAL Requer o contexto do manipulador de condições

##### RESIGNAL Visão geral

Para `condition_value` e `signal_information_item`, as definições e regras são as mesmas para `RESIGNAL` (resignal.html) e `SIGNAL` (signal.html). Por exemplo, o `condition_value` pode ser um valor `SQLSTATE`, e o valor pode indicar erros, avisos ou "não encontrado". Para obter informações adicionais, consulte a Seção 13.6.7.5, "Instrução SIGNAL".

A declaração `RESIGNAL` aceita cláusulas *`condition_value`* e `SET`, ambas opcionais. Isso leva a vários usos possíveis:

- Apenas `RESIGNAL`:

  ```sql
  RESIGNAL;
  ```

- `RESIGNAL` com novas informações sobre o sinal:

  ```sql
  RESIGNAL SET signal_information_item [, signal_information_item] ...;
  ```

- `RESIGNAL` com um valor de condição e, possivelmente, novas informações sobre o sinal:

  ```sql
  RESIGNAL condition_value
      [SET signal_information_item [, signal_information_item] ...];
  ```

Todos esses casos de uso causam alterações nas áreas de diagnóstico e condição:

- Uma área de diagnóstico contém uma ou mais áreas de condição.
- Uma área de condição contém itens de informações de condição, como o valor `SQLSTATE`, `MYSQL_ERRNO` ou `MESSAGE_TEXT`.

Há uma pilha de áreas de diagnóstico. Quando um manipulador assume o controle, ele empurra uma área de diagnóstico para o topo da pilha, então há duas áreas de diagnóstico durante a execução do manipulador:

- A primeira (atual) área de diagnóstico, que começa como uma cópia da última área de diagnóstico, mas é sobrescrita pela primeira instrução no manipulador que altera a área de diagnóstico atual.

- A última área de diagnóstico (em pilha), que contém as áreas de condição configuradas antes de o manipulador assumir o controle.

O número máximo de áreas de condição em uma área de diagnóstico é determinado pelo valor da variável de sistema `max_error_count`. Veja Variáveis de sistema relacionadas à área de diagnóstico.

##### RESIGNAL Sozinho

Um simples `RESIGNAL` significa apenas “passar o erro sem alterações”. Ele restaura a última área de diagnóstico e a torna a área de diagnóstico atual. Ou seja, ele “desloca” a pilha de áreas de diagnóstico.

Dentro de um manipulador de condições que captura uma condição, um uso único para `RESIGNAL` por si só é realizar algumas outras ações e, em seguida, passar sem alterações as informações originais da condição (as informações que existiam antes da entrada no manipulador).

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

Suponha que a instrução `DROP TABLE xx` falhe. A pilha de área de diagnóstico parece assim:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

Em seguida, a execução entra no manipulador `EXIT`. Ela começa impondo uma área de diagnóstico no topo da pilha, que agora parece assim:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, o conteúdo das primeiras (atual) e segundas (em pilha) áreas de diagnóstico são os mesmos. A primeira área de diagnóstico pode ser modificada por instruções que sejam executadas posteriormente dentro do manipulador.

Normalmente, uma declaração de procedimento limpa a primeira área de diagnóstico. `BEGIN` é uma exceção, não limpa, não faz nada. `SET` não é uma exceção, limpa, executa a operação e produz um resultado de “sucesso”. A pilha da área de diagnóstico agora parece assim:

```sql
DA 1. ERROR 0000 (00000): Successful operation
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, se `@a = 0`, o `RESIGNAL` exibe a pilha da área de diagnóstico, que agora parece assim:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

E é isso que o chamador vê.

Se `@a` não for 0, o manipulador simplesmente termina, o que significa que não há mais necessidade da área de diagnóstico atual (já foi "manipulada"), então ela pode ser descartada, fazendo com que a pilha de áreas de diagnóstico volte a ser a área de diagnóstico atual. A pilha de áreas de diagnóstico fica assim:

```sql
DA 1. ERROR 0000 (00000): Successful operation
```

Os detalhes fazem parecer complexo, mas o resultado final é bastante útil: os manipuladores podem ser executados sem destruir informações sobre a condição que causou a ativação do manipulador.

##### RESIGNAL com novas informações de sinal

`RESIGNAL` com uma cláusula `SET` fornece novas informações sobre o sinal, então a declaração significa “transmitir o erro com alterações”:

```sql
RESIGNAL SET signal_information_item [, signal_information_item] ...;
```

Assim como com `RESIGNAL` sozinho, a ideia é empurrar a pilha de área de diagnóstico para que a informação original saia. Ao contrário de `RESIGNAL` sozinho, qualquer coisa especificada na cláusula `SET` muda.

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

Lembre-se da discussão anterior de que `RESIGNAL` sozinho resulta em uma pilha de área de diagnóstico como esta:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

A instrução `RESIGNAL SET MYSQL_ERRNO = 5` resulta na pilha a seguir, que é o que o chamador vê:

```sql
DA 1. ERROR 5 (42S02): Unknown table 'xx'
```

Em outras palavras, ele altera o número de erro, e nada mais.

A declaração `RESIGNAL` pode alterar qualquer um ou todos os itens de informações de sinal, fazendo com que a primeira área de condição da área de diagnóstico pareça bastante diferente.

##### RESIGNAL com um valor de condição e informações de sinal novas opcionais

`RESIGNAL` com um valor de condição significa "empurrar uma condição para a área de diagnóstico atual". Se a cláusula `SET` estiver presente, ela também altera as informações de erro.

```sql
RESIGNAL condition_value
    [SET signal_information_item [, signal_information_item] ...];
```

Essa forma de `RESIGNAL` restaura a última área de diagnóstico e a torna a área de diagnóstico atual. Ou seja, ela "põe em destaque" a pilha de áreas de diagnóstico, o que é o mesmo que fazer um simples `RESIGNAL` sozinho. No entanto, ela também altera a área de diagnóstico dependendo do valor da condição ou das informações do sinal.

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

Isso é semelhante ao exemplo anterior, e os efeitos são os mesmos, exceto que, se `RESIGNAL` ocorrer, a área da condição atual parecerá diferente no final. (A razão pela qual a condição adiciona em vez de substituir a condição existente é o uso de um valor de condição.)

A declaração `RESIGNAL` inclui um valor de condição (`SQLSTATE '45000'`), então ela adiciona uma nova área de condição, resultando em uma pilha de áreas de diagnóstico que parece assim:

```sql
DA 1. (condition 2) ERROR 1051 (42S02): Unknown table 'xx'
      (condition 1) ERROR 5 (45000) Unknown table 'xx'
```

O resultado de `CALL p()` e `SHOW ERRORS` para este exemplo é:

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

##### RESIGNAL Requer o contexto do manipulador de condições

Todas as formas de `RESIGNAL` exigem que o contexto atual seja um manipulador de condição. Caso contrário, `RESIGNAL` é ilegal e ocorre um erro `RESIGNAL when handler not active` (RESIGNAL quando o manipulador não está ativo). Por exemplo:

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

`RESIGNAL` ocorre dentro da função armazenada `f()`. Embora `f()` em si seja invocado dentro do contexto do manipulador `EXIT`, a execução dentro de `f()` tem seu próprio contexto, que não é o contexto do manipulador. Assim, `RESIGNAL` dentro de `f()` resulta em um erro de "manipulador não ativo".
