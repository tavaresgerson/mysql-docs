#### 13.6.7.6 Regras de escopo para manipuladores

Um programa armazenado pode incluir manipuladores a serem invocados quando certas condições ocorrem dentro do programa. A aplicabilidade de cada manipulador depende de sua localização dentro da definição do programa e das condições ou condições que ele trata:

- Um manipulador declarado em um bloco ``BEGIN ... END` está em escopo apenas para as instruções SQL que seguem as declarações do manipulador no bloco. Se o próprio manipulador levantar uma condição, ele não pode lidar com essa condição, nem qualquer outro manipulador declarado no bloco. No exemplo a seguir, os manipuladores `H1`e`H2` estão em escopo para condições levantadas pelas instruções *`stmt1`* e *`stmt2`*. Mas nem `H1`nem`H2`estão em escopo para condições levantadas no corpo de`H1`ou`H2\`.

  ```sql
  BEGIN -- outer block
    DECLARE EXIT HANDLER FOR ...;  -- handler H1
    DECLARE EXIT HANDLER FOR ...;  -- handler H2
    stmt1;
    stmt2;
  END;
  ```

- Um manipulador está em escopo apenas para o bloco em que é declarado e não pode ser ativado para condições que ocorrem fora desse bloco. No exemplo a seguir, o manipulador `H1` está em escopo para *`stmt1`* no bloco interno, mas não para *`stmt2`* no bloco externo:

  ```sql
  BEGIN -- outer block
    BEGIN -- inner block
      DECLARE EXIT HANDLER FOR ...;  -- handler H1
      stmt1;
    END;
    stmt2;
  END;
  ```

- Um manipulador pode ser específico ou geral. Um manipulador específico é para um código de erro do MySQL, valor `SQLSTATE` ou nome de condição. Um manipulador geral é para uma condição na classe `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`. A especificidade da condição está relacionada à precedência da condição, conforme descrito mais adiante.

Vários manipuladores podem ser declarados em diferentes escopos e com especificidades diferentes. Por exemplo, pode haver um manipulador específico para um código de erro MySQL em um bloco externo e um manipulador geral de `SQLWARNING` em um bloco interno. Ou pode haver manipuladores para um código de erro MySQL específico e a classe `SQLWARNING` geral no mesmo bloco.

Se um manipulador é ativado, isso depende não apenas do seu escopo e do valor da condição, mas também dos manipuladores presentes. Quando uma condição ocorre em um programa armazenado, o servidor busca por manipuladores aplicáveis no escopo atual (bloco atual `BEGIN ... END`). Se não houver manipuladores aplicáveis, a busca continua para fora, com os manipuladores em cada escopo contendo sucessivamente (bloco). Quando o servidor encontrar um ou mais manipuladores aplicáveis em um escopo dado, ele escolhe entre eles com base na precedência da condição:

- Um manipulador de código de erro do MySQL tem precedência sobre um manipulador de valor `SQLSTATE`.

- Um manipulador de `SQLSTATE` tem precedência sobre os manipuladores gerais `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`.

- Um manipulador `SQLEXCEPTION` tem precedência sobre um manipulador `SQLWARNING`.

- É possível ter vários manipuladores aplicáveis com a mesma precedência. Por exemplo, uma instrução pode gerar múltiplos avisos com diferentes códigos de erro, para cada um dos quais existe um manipulador específico para erros. Neste caso, a escolha de qual manipulador o servidor ativa é não determinístico e pode mudar dependendo das circunstâncias em que a condição ocorre.

Uma implicação das regras de seleção de manipuladores é que, se houver vários manipuladores aplicáveis em escopos diferentes, os manipuladores com o escopo mais local têm precedência sobre os manipuladores em escopos externos, mesmo sobre aqueles para condições mais específicas.

Se não houver um manipulador apropriado quando uma condição ocorrer, a ação tomada depende da classe da condição:

- Para as condições `SQLEXCEPTION`, o programa armazenado termina na instrução que gerou a condição, como se houvesse um manipulador `EXIT`. Se o programa foi chamado por outro programa armazenado, o programa que o chamou lida com a condição usando as regras de seleção de manipulador aplicadas aos seus próprios manipuladores.

- Para as condições `SQLWARNING`, o programa continua executando, como se houvesse um manipulador `CONTINUE`.

- Para condições de `NOT FOUND`, se a condição foi levantada normalmente, a ação é `CONTINUE`. Se foi levantada por `SIGNAL` ou `RESIGNAL`, a ação é `EXIT`.

Os exemplos a seguir demonstram como o MySQL aplica as regras de seleção de manipulador.

Este procedimento contém dois manipuladores, um para o valor específico `SQLSTATE` (`'42S02'`) que ocorre em tentativas de excluir uma tabela inexistente, e outro para a classe geral `SQLEXCEPTION`:

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

Ambos os manipuladores são declarados no mesmo bloco e têm o mesmo escopo. No entanto, os manipuladores `SQLSTATE` têm precedência sobre os manipuladores `SQLEXCEPTION`, portanto, se a tabela `t` não existir, a instrução `DROP TABLE` gera uma condição que ativa o manipulador `SQLSTATE`:

```sql
mysql> CALL p1();
+--------------------------------+
| msg                            |
+--------------------------------+
| SQLSTATE handler was activated |
+--------------------------------+
```

Este procedimento contém os mesmos dois manipuladores. Mas desta vez, a instrução `DROP TABLE` e o manipulador `SQLEXCEPTION` estão em um bloco interno em relação ao manipulador `SQLSTATE`:

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

Nesse caso, o manipulador que está mais próximo da condição em questão tem precedência. O manipulador `SQLEXCEPTION` é ativado, mesmo que seja mais geral do que o manipulador `SQLSTATE`:

```sql
mysql> CALL p2();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Neste procedimento, um dos manipuladores é declarado dentro de um bloco que está dentro do escopo da instrução `DROP TABLE`:

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

Apenas o manipulador `SQLEXCEPTION` é aplicado porque o outro não está no escopo da condição levantada pelo `DROP TABLE`:

```sql
mysql> CALL p3();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Neste procedimento, ambos os manipuladores são declarados dentro de um bloco que está dentro do escopo da instrução `DROP TABLE`:

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

Nenhum dos manipuladores é aplicado porque eles não estão abrangidos pelo `DROP TABLE`. A condição levantada pela declaração não é tratada e termina o procedimento com um erro:

```sql
mysql> CALL p4();
ERROR 1051 (42S02): Unknown table 'test.t'
```
