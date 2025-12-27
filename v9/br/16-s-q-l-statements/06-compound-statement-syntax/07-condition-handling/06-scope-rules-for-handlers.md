#### 15.6.7.6 Regras de escopo para manipuladores

Um programa armazenado pode incluir manipuladores a serem invocados quando certas condições ocorrem dentro do programa. A aplicabilidade de cada manipulador depende de sua localização dentro da definição do programa e das condições ou condições que ele trata:

* Um manipulador declarado em um bloco `BEGIN ... END` está em escopo apenas para as instruções SQL que seguem as declarações de manipulador no bloco. Se o próprio manipulador levantar uma condição, ele não pode tratar essa condição, nem qualquer outro manipulador declarado no bloco. No exemplo a seguir, os manipuladores `H1` e `H2` estão em escopo para condições levantadas por as instruções *`stmt1`* e *`stmt2`*. Mas nem `H1` nem `H2` estão em escopo para condições levantadas no corpo de `H1` ou `H2`.

  ```
  BEGIN -- outer block
    DECLARE EXIT HANDLER FOR ...;  -- handler H1
    DECLARE EXIT HANDLER FOR ...;  -- handler H2
    stmt1;
    stmt2;
  END;
  ```

* Um manipulador está em escopo apenas para o bloco em que é declarado e não pode ser ativado para condições que ocorrem fora desse bloco. No exemplo a seguir, o manipulador `H1` está em escopo para *`stmt1`* no bloco interno, mas não para *`stmt2`* no bloco externo:

  ```
  BEGIN -- outer block
    BEGIN -- inner block
      DECLARE EXIT HANDLER FOR ...;  -- handler H1
      stmt1;
    END;
    stmt2;
  END;
  ```

* Um manipulador pode ser específico ou geral. Um manipulador específico é para um código de erro MySQL, valor `SQLSTATE` ou nome de condição. Um manipulador geral é para uma condição na classe `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`. A especificidade da condição está relacionada à precedência da condição, conforme descrito mais adiante.

Múltiplos manipuladores podem ser declarados em diferentes escopos e com diferentes especificidades. Por exemplo, pode haver um manipulador específico para um código de erro MySQL em um bloco externo e um manipulador geral `SQLWARNING` em um bloco interno. Ou pode haver manipuladores para um código de erro MySQL específico e a classe geral `SQLWARNING` no mesmo bloco.

Se um manipulador é ativado, isso depende não apenas do seu escopo e do valor da condição, mas também dos manipuladores presentes. Quando uma condição ocorre em um programa armazenado, o servidor busca por manipuladores aplicáveis no escopo atual (bloco `BEGIN ... END` atual). Se não houver manipuladores aplicáveis, a busca continua para fora, com os manipuladores em cada escopo contendo sucessivamente (bloco). Quando o servidor encontra um ou mais manipuladores aplicáveis em um escopo dado, ele escolhe entre eles com base na precedência da condição:

* Um manipulador de código de erro do MySQL tem precedência sobre um manipulador de valor `SQLSTATE`.

* Um manipulador de valor `SQLSTATE` tem precedência sobre manipuladores gerais `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`.

* Um manipulador `SQLEXCEPTION` tem precedência sobre um manipulador `SQLWARNING`.

* É possível ter vários manipuladores aplicáveis com a mesma precedência. Por exemplo, uma instrução pode gerar múltiplos avisos com diferentes códigos de erro, para cada um dos quais existe um manipulador específico para o erro. Neste caso, a escolha de qual manipulador o servidor ativa é não-determinística e pode mudar dependendo das circunstâncias em que a condição ocorre.

Uma implicação das regras de seleção de manipuladores é que, se houver vários manipuladores aplicáveis em diferentes escopos, os manipuladores com o escopo mais local têm precedência sobre manipuladores em escopos externos, mesmo sobre aqueles para condições mais específicas.

Se não houver um manipulador apropriado quando uma condição ocorre, a ação tomada depende da classe da condição:

* Para as condições `SQLEXCEPTION`, o programa armazenado termina na instrução que gerou a condição, como se houvesse um manipulador `EXIT`. Se o programa foi chamado por outro programa armazenado, o programa que o chamou lida com a condição usando as regras de seleção de manipulador aplicadas aos seus próprios manipuladores.

* Para as condições `SQLWARNING`, o programa continua executando, como se houvesse um manipulador `CONTINUE`.

* Para as condições `NOT FOUND`, se a condição foi gerada normalmente, a ação é `CONTINUE`. Se foi gerada por `SIGNAL` ou `RESIGNAL`, a ação é `EXIT`.

Os seguintes exemplos demonstram como o MySQL aplica as regras de seleção de manipulador.

Este procedimento contém dois manipuladores, um para o valor específico de `SQLSTATE` (`'42S02'`) que ocorre para tentativas de excluir uma tabela inexistente, e um para a classe geral `SQLEXCEPTION`:

```
CREATE PROCEDURE p1()
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
    SELECT 'SQLSTATE handler was activated' AS msg;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    SELECT 'SQLEXCEPTION handler was activated' AS msg;

  DROP TABLE test.t;
END;
```

Ambos os manipuladores são declarados no mesmo bloco e têm o mesmo escopo. No entanto, os manipuladores `SQLSTATE` têm precedência sobre os manipuladores `SQLEXCEPTION`, então se a tabela `t` for inexistente, a instrução `DROP TABLE` gera uma condição que ativa o manipulador `SQLSTATE`:

```
mysql> CALL p1();
+--------------------------------+
| msg                            |
+--------------------------------+
| SQLSTATE handler was activated |
+--------------------------------+
```

Este procedimento contém os mesmos dois manipuladores. Mas desta vez, a instrução `DROP TABLE` e o manipulador `SQLEXCEPTION` estão em um bloco interno em relação ao manipulador `SQLSTATE`:

```
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

Neste caso, o manipulador que é mais local ao local onde a condição ocorre tem precedência. O manipulador `SQLEXCEPTION` é ativado, mesmo que seja mais geral do que o manipulador `SQLSTATE`:

```
mysql> CALL p2();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Neste procedimento, um dos manipuladores é declarado em um bloco interno ao escopo da instrução `DROP TABLE`:

```
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

Apenas o manipulador `SQLEXCEPTION` se aplica porque o outro não está no escopo para a condição gerada pelo `DROP TABLE`:

Neste procedimento, ambos os manipuladores são declarados em um bloco interno ao escopo da instrução `DROP TABLE`:

```
mysql> CALL p3();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Nenhum dos manipuladores é aplicado porque não estão no escopo da `DROP TABLE`. A condição levantada pela instrução não é tratada e o procedimento é encerrado com um erro:

```
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