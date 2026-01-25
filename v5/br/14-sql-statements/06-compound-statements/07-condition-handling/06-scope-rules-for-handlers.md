#### 13.6.7.6 Regras de Scope para Handlers

Um programa armazenado pode incluir *handlers* para serem invocados quando certas *conditions* ocorrerem dentro do programa. A aplicabilidade de cada *handler* depende de sua localização dentro da definição do programa e da *condition* ou *conditions* que ele manipula:

* Um *handler* declarado em um bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") está em *scope* apenas para as instruções SQL que seguem as declarações de *handler* no bloco. Se o próprio *handler* levantar uma *condition*, ele não pode manipular essa *condition*, nem qualquer outro *handler* declarado no bloco. No exemplo a seguir, os *handlers* `H1` e `H2` estão em *scope* para *conditions* levantadas pelas instruções *`stmt1`* e *`stmt2`*. Mas nem `H1` nem `H2` estão em *scope* para *conditions* levantadas no corpo de `H1` ou `H2`.

  ```sql
  BEGIN -- outer block
    DECLARE EXIT HANDLER FOR ...;  -- handler H1
    DECLARE EXIT HANDLER FOR ...;  -- handler H2
    stmt1;
    stmt2;
  END;
  ```

* Um *handler* está em *scope* apenas para o bloco em que é declarado e não pode ser ativado para *conditions* que ocorram fora desse bloco. No exemplo a seguir, o *handler* `H1` está em *scope* para *`stmt1`* no bloco interno, mas não para *`stmt2`* no bloco externo:

  ```sql
  BEGIN -- outer block
    BEGIN -- inner block
      DECLARE EXIT HANDLER FOR ...;  -- handler H1
      stmt1;
    END;
    stmt2;
  END;
  ```

* Um *handler* pode ser específico ou geral. Um *handler* específico é para um código de erro MySQL, valor `SQLSTATE` ou nome de *condition*. Um *handler* geral é para uma *condition* nas classes `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`. A especificidade da *condition* está relacionada à precedência da *condition*, conforme descrito adiante.

Múltiplos *handlers* podem ser declarados em diferentes *scopes* e com diferentes especificidades. Por exemplo, pode haver um *handler* específico de código de erro MySQL em um bloco externo e um *handler* geral `SQLWARNING` em um bloco interno. Ou pode haver *handlers* para um código de erro MySQL específico e para a classe geral `SQLWARNING` no mesmo bloco.

Se um *handler* é ativado depende não apenas de seu próprio *scope* e valor de *condition*, mas também de quais outros *handlers* estão presentes. Quando uma *condition* ocorre em um programa armazenado, o servidor procura por *handlers* aplicáveis no *scope* atual (bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") atual). Se não houver *handlers* aplicáveis, a busca continua para fora com os *handlers* em cada *scope* (bloco) sucessivo contendo. Quando o servidor encontra um ou mais *handlers* aplicáveis em um determinado *scope*, ele escolhe entre eles com base na precedência da *condition*:

* Um *handler* de código de erro MySQL tem precedência sobre um *handler* de valor `SQLSTATE`.

* Um *handler* de valor `SQLSTATE` tem precedência sobre os *handlers* gerais `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`.

* Um *handler* `SQLEXCEPTION` tem precedência sobre um *handler* `SQLWARNING`.

* É possível ter vários *handlers* aplicáveis com a mesma precedência. Por exemplo, uma instrução pode gerar múltiplos *warnings* com diferentes códigos de erro, para cada um dos quais existe um *handler* específico de erro. Neste caso, a escolha de qual *handler* o servidor ativa é não determinística e pode mudar dependendo das circunstâncias sob as quais a *condition* ocorre.

Uma implicação das regras de seleção de *handler* é que se múltiplos *handlers* aplicáveis ocorrerem em diferentes *scopes*, *handlers* com o *scope* mais local têm precedência sobre *handlers* em *scopes* externos, mesmo sobre aqueles para *conditions* mais específicas.

Se não houver um *handler* apropriado quando uma *condition* ocorre, a ação tomada depende da classe da *condition*:

* Para *conditions* `SQLEXCEPTION`, o programa armazenado é encerrado na instrução que levantou a *condition*, como se houvesse um *handler* `EXIT`. Se o programa foi chamado por outro programa armazenado, o programa chamador manipula a *condition* usando as regras de seleção de *handler* aplicadas aos seus próprios *handlers*.

* Para *conditions* `SQLWARNING`, o programa continua a execução, como se houvesse um *handler* `CONTINUE`.

* Para *conditions* `NOT FOUND`, se a *condition* foi levantada normalmente, a ação é `CONTINUE`. Se foi levantada por [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") ou [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement"), a ação é `EXIT`.

Os exemplos a seguir demonstram como o MySQL aplica as regras de seleção de *handler*.

Este *procedure* contém dois *handlers*, um para o valor `SQLSTATE` específico (`'42S02'`) que ocorre em tentativas de *drop* de uma *table* inexistente, e um para a classe geral `SQLEXCEPTION`:

```sql
CREATE PROCEDURE p1()
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
    SELECT 'SQLSTATE handler was activated' AS msg;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    SELECT 'SQLEXCEPTION handler was activated' AS msg;

  DROP TABLE test.t;
END;
```

Ambos os *handlers* são declarados no mesmo bloco e têm o mesmo *scope*. No entanto, os *handlers* `SQLSTATE` têm precedência sobre os *handlers* `SQLEXCEPTION`, portanto, se a *table* `t` for inexistente, a instrução [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") levanta uma *condition* que ativa o *handler* `SQLSTATE`:

```sql
mysql> CALL p1();
+--------------------------------+
| msg                            |
+--------------------------------+
| SQLSTATE handler was activated |
+--------------------------------+
```

Este *procedure* contém os mesmos dois *handlers*. Mas, desta vez, a instrução [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") e o *handler* `SQLEXCEPTION` estão em um bloco interno em relação ao *handler* `SQLSTATE`:

```sql
CREATE PROCEDURE p2()
BEGIN -- outer block
    DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
      SELECT 'SQLSTATE handler was activated' AS msg;
  BEGIN -- inner block
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
      SELECT 'SQLEXCEPTION handler was activated' AS msg;

    DROP TABLE test.t; -- occurs within inner block
  END;
END;
```

Neste caso, o *handler* que é mais local ao local onde a *condition* ocorre tem precedência. O *handler* `SQLEXCEPTION` é ativado, mesmo sendo mais geral do que o *handler* `SQLSTATE`:

```sql
mysql> CALL p2();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Neste *procedure*, um dos *handlers* é declarado em um bloco interno ao *scope* da instrução [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"):

```sql
CREATE PROCEDURE p3()
BEGIN -- outer block
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    SELECT 'SQLEXCEPTION handler was activated' AS msg;
  BEGIN -- inner block
    DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
      SELECT 'SQLSTATE handler was activated' AS msg;
  END;

  DROP TABLE test.t; -- occurs within outer block
END;
```

Apenas o *handler* `SQLEXCEPTION` se aplica porque o outro não está em *scope* para a *condition* levantada pelo [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"):

```sql
mysql> CALL p3();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Neste *procedure*, ambos os *handlers* são declarados em um bloco interno ao *scope* da instrução [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"):

```sql
CREATE PROCEDURE p4()
BEGIN -- outer block
  BEGIN -- inner block
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
      SELECT 'SQLEXCEPTION handler was activated' AS msg;
    DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
      SELECT 'SQLSTATE handler was activated' AS msg;
  END;

  DROP TABLE test.t; -- occurs within outer block
END;
```

Nenhum dos *handlers* se aplica porque eles não estão em *scope* para o [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"). A *condition* levantada pela instrução não é manipulada e encerra o *procedure* com um erro:

```sql
mysql> CALL p4();
ERROR 1051 (42S02): Unknown table 'test.t'
```