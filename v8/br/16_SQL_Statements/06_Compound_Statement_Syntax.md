## 15.6 Sintaxe de Declarações Compostas

Esta seção descreve a sintaxe para a declaração composta `BEGIN ... END` e outras declarações que podem ser usadas no corpo de programas armazenados: procedimentos e funções armazenadas, gatilhos e eventos. Esses objetos são definidos em termos de código SQL que é armazenado no servidor para invocação posterior (consulte o Capítulo 27, *Objetos Armazenados*).

Uma declaração composta é um bloco que pode conter outros blocos; declarações para variáveis, manipuladores de condição e cursors; e construções de controle de fluxo, como loops e testes condicionais.

### 15.6.1 COMEÇAR ... FIM Declaração Composta

```
[begin_label:] BEGIN
    [statement_list]
END [end_label]
```

A sintaxe `BEGIN ... END` é usada para escrever instruções compostas, que podem aparecer dentro de programas armazenados (procedimentos e funções armazenados, gatilhos e eventos). Uma instrução composta pode conter múltiplas instruções, encerradas pelas palavras-chave `BEGIN` e `END`. *`statement_list`* representa uma lista de uma ou mais instruções, cada uma terminada por um delimitador de instrução ponto-e-vírgula (`;`). O *`statement_list`* em si é opcional, portanto, a instrução composta vazia (`BEGIN END`) é legal.

Os blocos `BEGIN ... END` podem ser aninhados.

O uso de múltiplas declarações exige que um cliente seja capaz de enviar strings de declaração que contenham o delimitador de declaração `;`. No cliente de linha de comando **mysql**, isso é tratado com o comando `delimiter`. Alterar o delimitador de fim de declaração `;` (por exemplo, para `//`) permite que `;` seja usado em um corpo de programa. Para um exemplo, consulte a Seção 27.1, “Definindo programas armazenados”.

Um bloco `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") pode ser rotulado. Veja a Seção 15.6.2, “Rotulagem de Declarações”.

A cláusula opcional `[NOT] ATOMIC` não é suportada. Isso significa que nenhum ponto de salvamento transacional é definido no início do bloco de instruções e a cláusula `BEGIN` usada neste contexto não tem efeito na transação atual.

Nota

Dentro de todos os programas armazenados, o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement"). Para iniciar uma transação neste contexto, use `START TRANSACTION`(commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") em vez disso.

### 15.6.2 Etiquetas de declaração

```
[begin_label:] BEGIN
    [statement_list]
END [end_label]

[begin_label:] LOOP
    statement_list
END LOOP [end_label]

[begin_label:] REPEAT
    statement_list
UNTIL search_condition
END REPEAT [end_label]

[begin_label:] WHILE search_condition DO
    statement_list
END WHILE [end_label]
```

Os rótulos são permitidos para os blocos `BEGIN ... END` e para as declarações `LOOP`, `REPEAT` e `WHILE`. O uso de rótulos para essas declarações segue estas regras:

* *`begin_label`* deve ser seguido por um ponto e vírgula.

* *`begin_label`* pode ser administrado sem *`end_label`*. Se *`end_label`* estiver presente, ele deve ser o mesmo que *`begin_label`*.

* *`end_label`* não pode ser dado sem *`begin_label`*.

* Os rótulos no mesmo nível de nidificação devem ser distintos.
* Os rótulos podem ter até 16 caracteres.

Para se referir a uma etiqueta dentro do construtor etiquetado, use uma declaração `ITERATE` ou `LEAVE`. O exemplo a seguir usa essas declarações para continuar a iterar ou finalizar o loop:

```
CREATE PROCEDURE doiterate(p1 INT)
BEGIN
  label1: LOOP
    SET p1 = p1 + 1;
    IF p1 < 10 THEN ITERATE label1; END IF;
    LEAVE label1;
  END LOOP label1;
END;
```

O escopo de uma etiqueta de bloco não inclui o código para manipuladores declarados dentro do bloco. Para obter detalhes, consulte a Seção 15.6.7.2, “Declaração DECLARE ... HANDLER”.

### 15.6.3 Declaração de DECLARE

A declaração `DECLARE` é usada para definir vários itens específicos de um programa:

* Variáveis locais. Veja a Seção 15.6.4, “Variáveis em programas armazenados”.

* Condições e manipuladores. Veja a Seção 15.6.7, “Manipulação de Condições”.

* Cursors. Veja a Seção 15.6.6, “Cursors”.

`DECLARE` é permitido apenas dentro de uma `BEGIN ... END` declaração composta e deve estar em sua início, antes de qualquer outra declaração.

As declarações devem seguir uma certa ordem. As declarações de cursor devem aparecer antes das declarações de manipulador. As declarações de variáveis e condições devem aparecer antes das declarações de cursor ou de manipulador.

### 15.6.4 Variáveis em programas armazenados

As variáveis de sistema e as variáveis definidas pelo usuário podem ser usadas em programas armazenados, assim como podem ser usadas fora do contexto de programas armazenados. Além disso, os programas armazenados podem usar `DECLARE` para definir variáveis locais, e as rotinas armazenadas (procedimentos e funções) podem ser declaradas para receber parâmetros que comunicam valores entre a rotina e seu solicitador.

* Para declarar variáveis locais, use a declaração `DECLARE`, conforme descrito na Seção 15.6.4.1, “Declaração de Variável Local DECLARE”.

* As variáveis podem ser definidas diretamente com a declaração `SET`. Veja a Seção 15.7.6.1, “Sintaxe de definição para atribuição de variáveis”.

* Os resultados das consultas podem ser recuperados em variáveis locais usando `SELECT ... INTO var_list`(select-into.html "15.2.13.1 SELECT ... INTO Statement") ou abrindo um cursor e usando `FETCH ... INTO var_list`(fetch.html "15.6.6.3 Cursor FETCH Statement"). Veja a Seção 15.2.13.1, "Instrução SELECT ... INTO", e a Seção 15.6.6, "Cursors".

Para obter informações sobre o escopo das variáveis locais e como o MySQL resolve nomes ambíguos, consulte a Seção 15.6.4.2, “Escopo e Resolução de Variáveis Locais”.

Não é permitido atribuir o valor `DEFAULT` a parâmetros de procedimentos ou funções armazenados ou variáveis locais de programas armazenados (por exemplo, com uma declaração `SET var_name = DEFAULT`). No MySQL 8.0, isso resulta em um erro de sintaxe.

#### 15.6.4.1 Declaração de declaração de variável local

```
DECLARE var_name [, var_name] ... type [DEFAULT value]
```

Esta declaração declara variáveis locais dentro de programas armazenados. Para fornecer um valor padrão para uma variável, inclua uma cláusula `DEFAULT`. O valor pode ser especificado como uma expressão; não precisa ser uma constante. Se a cláusula `DEFAULT` estiver ausente, o valor inicial é `NULL`.

As variáveis locais são tratadas como parâmetros de rotina armazenados em relação ao tipo de dados e verificação de estouro. Veja a Seção 15.1.17, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.

As declarações de variáveis devem aparecer antes das declarações de cursor ou manipuladores.

Os nomes de variáveis locais não são sensíveis ao caso. Os caracteres permitidos e as regras de citação são os mesmos que para outros identificadores, conforme descrito na Seção 11.2, “Nomes de Objetos do Esquema”.

O escopo de uma variável local é o bloco `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") dentro do qual ela é declarada. A variável pode ser referenciada em blocos aninhados dentro do bloco declarador, exceto aqueles blocos que declaram uma variável com o mesmo nome.

Para exemplos de declarações de variáveis, consulte a Seção 15.6.4.2, “Âmbito e Resolução de Variáveis Locais”.

#### 15.6.4.2 Âmbito e resolução de variáveis locais

O escopo de uma variável local é o bloco `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") dentro do qual ela é declarada. A variável pode ser referenciada em blocos aninhados dentro do bloco declarador, exceto aqueles blocos que declaram uma variável com o mesmo nome.

Como as variáveis locais estão no escopo apenas durante a execução do programa armazenado, as referências a elas não são permitidas em declarações preparadas criadas dentro de um programa armazenado. O escopo da declaração preparada é a sessão atual, não o programa armazenado, portanto, a declaração pode ser executada após o término do programa, momento em que as variáveis não estarão mais no escopo. Por exemplo, `SELECT ... INTO local_var` não pode ser usado como uma declaração preparada. Essa restrição também se aplica aos parâmetros de procedimentos armazenados e funções. Veja a Seção 15.5.1, “Declaração PREPARE”.

Uma variável local não deve ter o mesmo nome que uma coluna de tabela. Se uma declaração SQL, como a declaração `SELECT ... INTO`(select.html "15.2.13 SELECT Statement"), contém uma referência a uma coluna e uma variável local declarada com o mesmo nome, o MySQL atualmente interpreta a referência como o nome de uma variável. Considere a seguinte definição de procedimento:

```
CREATE PROCEDURE sp1 (x VARCHAR(5))
BEGIN
  DECLARE xname VARCHAR(5) DEFAULT 'bob';
  DECLARE newname VARCHAR(5);
  DECLARE xid INT;

  SELECT xname, id INTO newname, xid
    FROM table1 WHERE xname = xname;
  SELECT newname;
END;
```

O MySQL interpreta `xname` na declaração `SELECT` como uma referência à *variável* `xname`, e não à *coluna* `xname`. Consequentemente, quando o procedimento `sp1()` é chamado, a variável `newname` retorna o valor `'bob'`, independentemente do valor da coluna `table1.xname`.

Da mesma forma, a definição do cursor no procedimento a seguir contém uma declaração `SELECT` que se refere a `xname`. O MySQL interpreta isso como uma referência à variável desse nome, em vez de uma referência a uma coluna.

```
CREATE PROCEDURE sp2 (x VARCHAR(5))
BEGIN
  DECLARE xname VARCHAR(5) DEFAULT 'bob';
  DECLARE newname VARCHAR(5);
  DECLARE xid INT;
  DECLARE done TINYINT DEFAULT 0;
  DECLARE cur1 CURSOR FOR SELECT xname, id FROM table1;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur1;
  read_loop: LOOP
    FETCH FROM cur1 INTO newname, xid;
    IF done THEN LEAVE read_loop; END IF;
    SELECT newname;
  END LOOP;
  CLOSE cur1;
END;
```

Veja também a Seção 27.8, “Restrições sobre programas armazenados”.

### 15.6.5 Declarações de controle de fluxo

O MySQL suporta os construtos `IF`, `CASE`, `ITERATE`, `LEAVE` `LOOP`, `WHILE` e `REPEAT` para controle de fluxo dentro de programas armazenados. Também suporta `RETURN` dentro de funções armazenadas.

Muitos desses construtos contêm outras declarações, conforme indicado pelas especificações gramaticais nas seções a seguir. Têm-se construtos que podem ser aninhados. Por exemplo, uma declaração `IF` pode conter um loop `WHILE`, que por sua vez contém uma declaração `CASE`.

MySQL não suporta loops `FOR`.

#### 15.6.5.1 Declaração CASE

```
CASE case_value
    WHEN when_value THEN statement_list
    [WHEN when_value THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

Ou:

```
CASE
    WHEN search_condition THEN statement_list
    [WHEN search_condition THEN statement_list] ...
    [ELSE statement_list]
END CASE
```

A declaração `CASE` para programas armazenados implementa uma construção condicional complexa.

Nota

Existe também um operador `CASE` * que difere do *declaração* `CASE` descrito aqui. Veja a Seção 14.5, “Funções de Controle de Fluxo”. A declaração `CASE` não pode ter uma cláusula `ELSE NULL`, e é terminada com `END CASE` em vez de `END`.

Para a primeira sintaxe, *`case_value`* é uma expressão. Esse valor é comparado com a expressão *`when_value`* em cada cláusula `WHEN` até que uma delas seja igual. Quando é encontrada uma *`when_value`* igual, a cláusula correspondente *`THEN`* *`statement_list`* é executada. Se nenhuma *`when_value`* for igual, a cláusula `ELSE` *`statement_list`* é executada, se houver uma.

Essa sintaxe não pode ser usada para testar a igualdade com `NULL`, porque `NULL = NULL` é falsa. Veja a Seção 5.3.4.6, “Trabalhando com valores NULL”.

Para a segunda sintaxe, cada cláusula `WHEN` *`search_condition`* é avaliada até que uma seja verdadeira, momento em que sua cláusula correspondente `THEN` *`statement_list`* é executada. Se não houver um *`search_condition`*, a cláusula `ELSE` *`statement_list`* é executada, se houver uma.

Se nenhum *`when_value`* ou *`search_condition`* corresponder ao valor testado e a declaração `CASE` não contiver nenhuma cláusula `ELSE`, o resultado será um erro de não encontrado de caso para declaração CASE.

Cada *`statement_list`* consiste em uma ou mais instruções SQL; um *`statement_list`* vazio não é permitido.

Para lidar com situações em que nenhum valor é correspondido por qualquer cláusula `WHEN`, use um `ELSE` contendo um bloco `BEGIN ... END` (begin-end.html "15.6.1 BEGIN ... END Compound Statement") vazio, conforme mostrado neste exemplo. (A indentação usada aqui na cláusula `ELSE` é apenas para fins de clareza e não tem importância adicional.)

```
DELIMITER |

CREATE PROCEDURE p()
  BEGIN
    DECLARE v INT DEFAULT 1;

    CASE v
      WHEN 2 THEN SELECT v;
      WHEN 3 THEN SELECT 0;
      ELSE
        BEGIN
        END;
    END CASE;
  END;
  |
```

#### 15.6.5.2 Instrução IF

```
IF search_condition THEN statement_list
    [ELSEIF search_condition THEN statement_list] ...
    [ELSE statement_list]
END IF
```

A declaração `IF` para programas armazenados implementa uma construção condicional básica.

Nota

Existe também uma função `IF()` *que difere da declaração `IF` *descrita aqui*. Veja a Seção 14.5, “Funções de Controle de Fluxo”. A declaração `IF` pode ter cláusulas `THEN`, `ELSE` e `ELSEIF`, e é terminada com `END IF`.

Se um dado *`search_condition`* avaliar como verdadeiro, a cláusula correspondente `THEN` ou `ELSEIF` *`statement_list`* é executada. Se não houver um *`search_condition`* correspondente, a cláusula `ELSE` *`statement_list`* é executada.

Cada *`statement_list`* consiste em uma ou mais instruções SQL; um *`statement_list`* vazio não é permitido.

Um bloco `IF ... END IF`, como todos os outros blocos de controle de fluxo utilizados dentro de programas armazenados, deve ser encerrado com um ponto e vírgula, como mostrado neste exemplo:

```
DELIMITER //

CREATE FUNCTION SimpleCompare(n INT, m INT)
  RETURNS VARCHAR(20)

  BEGIN
    DECLARE s VARCHAR(20);

    IF n > m THEN SET s = '>';
    ELSEIF n = m THEN SET s = '=';
    ELSE SET s = '<';
    END IF;

    SET s = CONCAT(n, ' ', s, ' ', m);

    RETURN s;
  END //

DELIMITER ;
```

Assim como outros construtos de controle de fluxo, os blocos `IF ... END IF` podem ser aninhados em outros construtos de controle de fluxo, incluindo outras declarações `IF`. Cada `IF` deve ser terminado por seu próprio `END IF`, seguido por um ponto e vírgula. Você pode usar indentação para tornar os blocos aninhados de controle de fluxo mais facilmente legíveis por humanos (embora isso não seja exigido pelo MySQL), como mostrado aqui:

```
DELIMITER //

CREATE FUNCTION VerboseCompare (n INT, m INT)
  RETURNS VARCHAR(50)

  BEGIN
    DECLARE s VARCHAR(50);

    IF n = m THEN SET s = 'equals';
    ELSE
      IF n > m THEN SET s = 'greater';
      ELSE SET s = 'less';
      END IF;

      SET s = CONCAT('is ', s, ' than');
    END IF;

    SET s = CONCAT(n, ' ', s, ' ', m, '.');

    RETURN s;
  END //

DELIMITER ;
```

Neste exemplo, o `IF` interno é avaliado apenas se `n` não for igual a `m`.

#### 15.6.5.3 Declaração de ITERATE

```
ITERATE label
```

`ITERATE` pode aparecer apenas dentro das declarações `LOOP`, `REPEAT` e `WHILE`. `ITERATE` significa “começar o loop novamente”.

Para um exemplo, veja a Seção 15.6.5.5, “Declaração LOOP”.

#### 15.6.5.4 Declaração LEAVE

```
LEAVE label
```

Essa declaração é usada para sair da construção de controle de fluxo que tem o rótulo dado. Se o rótulo for para o bloco de programa armazenado mais externo, `LEAVE` sai do programa.

`LEAVE` pode ser usado dentro de `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") ou construções de loop (`LOOP`, `REPEAT`, `WHILE`).

Para um exemplo, veja a Seção 15.6.5.5, “Declaração LOOP”.

#### 15.6.5.5 Declaração LOOP

```
[begin_label:] LOOP
    statement_list
END LOOP [end_label]
```

`LOOP` implementa uma construção de laço simples, permitindo a execução repetida da lista de declarações, que consiste em uma ou mais declarações, cada uma terminada por um delimitador de declaração ponto-e-vírgula (`;`) A declarações dentro do laço são repetidas até que o laço seja terminado. Geralmente, isso é realizado com uma declaração `LEAVE`. Dentro de uma função armazenada, `RETURN` também pode ser usado, que sai completamente da função.

Negligenciar a inclusão de uma declaração de término de laço resulta em um laço infinito.

Uma declaração `LOOP` pode ser rotulada. Para as regras relativas ao uso da etiqueta, consulte a Seção 15.6.2, “Etiqueta da declaração”.

Exemplo:

```
CREATE PROCEDURE doiterate(p1 INT)
BEGIN
  label1: LOOP
    SET p1 = p1 + 1;
    IF p1 < 10 THEN
      ITERATE label1;
    END IF;
    LEAVE label1;
  END LOOP label1;
  SET @x = p1;
END;
```

#### 15.6.5.6 Declaração REPEAT

```
[begin_label:] REPEAT
    statement_list
UNTIL search_condition
END REPEAT [end_label]
```

A lista de declarações dentro de uma declaração `REPEAT` é repetida até que a expressão *`search_condition`* seja verdadeira. Assim, um `REPEAT` sempre entra no loop pelo menos uma vez. *`statement_list`* consiste em uma ou mais declarações, cada uma terminada por um delimitador de declaração ponto e vírgula (`;`).

Uma declaração `REPEAT` pode ser rotulada. Para as regras relativas ao uso da etiqueta, consulte a Seção 15.6.2, “Etiqueta da declaração”.

Exemplo:

```
mysql> delimiter //

mysql> CREATE PROCEDURE dorepeat(p1 INT)
       BEGIN
         SET @x = 0;
         REPEAT
           SET @x = @x + 1;
         UNTIL @x > p1 END REPEAT;
       END
       //
Query OK, 0 rows affected (0.00 sec)

mysql> CALL dorepeat(1000)//
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x//
+------+
| @x   |
+------+
| 1001 |
+------+
1 row in set (0.00 sec)
```

#### 15.6.5.7 Declaração de retorno

```
RETURN expr
```

A declaração `RETURN` termina a execução de uma função armazenada e retorna o valor *`expr`* para o chamador da função. Deve haver pelo menos uma declaração `RETURN` em uma função armazenada. Pode haver mais de uma se a função tiver vários pontos de saída.

Essa declaração não é usada em procedimentos armazenados, gatilhos ou eventos. A declaração `LEAVE` pode ser usada para sair de um programa armazenado desses tipos.

#### 15.6.5.8 A declaração WHILE

```
[begin_label:] WHILE search_condition DO
    statement_list
END WHILE [end_label]
```

A lista de declarações dentro de uma declaração `WHILE` é repetida enquanto a expressão *`search_condition`* for verdadeira. *`statement_list`* consiste em uma ou mais declarações SQL, cada uma terminada por um delimitador de declaração ponto-e-vírgula (`;`).

Uma declaração `WHILE` pode ser rotulada. Para as regras relativas ao uso da etiqueta, consulte a Seção 15.6.2, “Etiqueta da declaração”.

Exemplo:

```
CREATE PROCEDURE dowhile()
BEGIN
  DECLARE v1 INT DEFAULT 5;

  WHILE v1 > 0 DO
    ...
    SET v1 = v1 - 1;
  END WHILE;
END;
```

### 15.6.6 Cursor

O MySQL suporta cursor dentro de programas armazenados. A sintaxe é como na SQL embutida. Os cursors têm essas propriedades:

* Inespecífico: O servidor pode ou não fazer uma cópia de sua tabela de resultados

* Apenas leitura: Não atualizável  
* Não scrollable: Pode ser percorrido apenas em uma direção e não pode pular linhas

As declarações de cursor devem aparecer antes das declarações de manipulador e após as declarações de variáveis e condições.

Exemplo:

```
CREATE PROCEDURE curdemo()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE a CHAR(16);
  DECLARE b, c INT;
  DECLARE cur1 CURSOR FOR SELECT id,data FROM test.t1;
  DECLARE cur2 CURSOR FOR SELECT i FROM test.t2;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;
  OPEN cur2;

  read_loop: LOOP
    FETCH cur1 INTO a, b;
    FETCH cur2 INTO c;
    IF done THEN
      LEAVE read_loop;
    END IF;
    IF b < c THEN
      INSERT INTO test.t3 VALUES (a,b);
    ELSE
      INSERT INTO test.t3 VALUES (a,c);
    END IF;
  END LOOP;

  CLOSE cur1;
  CLOSE cur2;
END;
```

#### 15.6.6.1 Declaração de cursor CLOSE

```
CLOSE cursor_name
```

Essa declaração fecha um cursor que estava previamente aberto. Para um exemplo, veja a Seção 15.6.6, “Cursors”.

Um erro ocorre se o cursor não estiver aberto.

Se não for fechado explicitamente, um cursor é fechado no final do bloco `BEGIN ... END` (begin-end.html "15.6.1 BEGIN ... END Compound Statement") no qual foi declarado.

#### 15.6.6.2 Declaração de cursor DECLARE

```
DECLARE cursor_name CURSOR FOR select_statement
```

Essa declaração declara um cursor e o associa a uma declaração `SELECT` que recupera as linhas que serão percorridas pelo cursor. Para recuperar as linhas posteriormente, use uma declaração `FETCH`. O número de colunas recuperado pela declaração `SELECT` deve corresponder ao número de variáveis de saída especificadas na declaração `FETCH`.

A declaração `SELECT` não pode ter uma cláusula `INTO`.

As declarações de cursor devem aparecer antes das declarações de manipulador e após as declarações de variáveis e condições.

Um programa armazenado pode conter várias declarações de cursor, mas cada cursor declarado em um bloco dado deve ter um nome único. Para um exemplo, veja a Seção 15.6.6, “Cursors”.

Para informações disponíveis através das declarações `SHOW`, é possível, em muitos casos, obter informações equivalentes usando um cursor com uma tabela `INFORMATION_SCHEMA`.

#### 15.6.6.3 Declaração FETCH do cursor

```
FETCH [[NEXT] FROM] cursor_name INTO var_name [, var_name] ...
```

Essa declaração recupera a próxima linha da declaração `SELECT` associada ao cursor especificado (que deve estar aberto) e avança o ponteiro do cursor. Se uma linha existir, as colunas recuperadas são armazenadas nas variáveis nomeadas. O número de colunas recuperadas pela declaração `SELECT` deve corresponder ao número de variáveis de saída especificadas na declaração `FETCH`.

Se não houver mais linhas disponíveis, uma condição sem dados ocorre com o valor SQLSTATE `'02000'`. Para detectar essa condição, você pode configurar um manipulador para ela (ou para uma condição `NOT FOUND`). Para um exemplo, consulte a Seção 15.6.6, “Cursors”.

Tenha em atenção que outra operação, como uma `SELECT` ou outra `FETCH`, também pode fazer com que o manipulador execute ao levantar a mesma condição. Se for necessário distinguir qual operação levantou a condição, coloque a operação dentro do seu próprio bloco [`BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") para que ela possa ser associada ao seu próprio manipulador.

#### 15.6.6.4 Declaração Cursor OPEN

```
OPEN cursor_name
```

Essa declaração abre um cursor previamente declarado. Para um exemplo, veja a Seção 15.6.6, “Cursors”.

#### 15.6.6.5 Restrições em cursors do lado do servidor

Os cursors do lado do servidor são implementados na API C usando a função `mysql_stmt_attr_set()`. A mesma implementação é usada para cursors em rotinas armazenadas. Um cursor do lado do servidor permite que um conjunto de resultados seja gerado no lado do servidor, mas não transferido para o cliente, exceto para as linhas que o cliente solicita. Por exemplo, se um cliente executa uma consulta, mas está interessado apenas na primeira linha, as linhas restantes não são transferidas.

Em MySQL, um cursor do lado do servidor é materializado em uma tabela temporária interna. Inicialmente, esta é uma tabela `MEMORY`, mas é convertida em uma tabela `MyISAM` quando seu tamanho excede o valor mínimo das variáveis de sistema `max_heap_table_size` e `tmp_table_size`. As mesmas restrições se aplicam às tabelas temporárias internas criadas para armazenar o conjunto de resultados de um cursor, como para outros usos de tabelas temporárias internas. Veja a Seção 10.4.4, “Uso de Tabela Temporária Interna em MySQL”. Uma limitação da implementação é que, para um conjunto de resultados grande, recuperar suas linhas através de um cursor pode ser lento.

Os cursors são apenas de leitura; você não pode usar um cursor para atualizar linhas.

`UPDATE WHERE CURRENT OF` e `DELETE WHERE CURRENT OF` não são implementados, porque os cursors atualizáveis não são suportados.

Os cursors não podem ser mantidos abertos (não permanecem abertos após um commit).

Os cursors são sensíveis.

Os cursors não são roláveis.

Os cursors não são nomeados. O manipulador de declaração atua como o ID do cursor.

Você pode ter apenas um cursor aberto por declaração preparada. Se você precisar de vários cursors, você deve preparar várias declarações.

Você não pode usar um cursor para uma declaração que gera um conjunto de resultados se a declaração não for suportada no modo preparado. Isso inclui declarações como `CHECK TABLE`, (check-table.html "15.7.3.2 CHECK TABLE Statement"), `HANDLER READ` e `SHOW BINLOG EVENTS`.

### 15.6.7 Tratamento de Condições

Podem surgir condições durante a execução do programa armazenado que exijam um tratamento especial, como sair do bloco atual do programa ou continuar a execução. Os manipuladores podem ser definidos para condições gerais, como avisos ou exceções, ou para condições específicas, como um código de erro particular. Condições específicas podem ser atribuídas nomes e referenciadas dessa forma nos manipuladores.

Para nomear uma condição, use a declaração `DECLARE ... CONDITION` (declare-condition.html "15.6.7.1 DECLARE ... CONDITION Statement"). Para declarar um manipulador, use a declaração `DECLARE ... HANDLER` (declare-handler.html "15.6.7.2 DECLARE ... HANDLER Statement"). Consulte a Seção 15.6.7.1, “DECLARE ... Statement Condition”, e a Seção 15.6.7.2, “DECLARE ... Statement Handler”. Para informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte a Seção 15.6.7.6, “Regras de escopo para manipuladores”.

Para criar uma condição, use a declaração `SIGNAL`. Para modificar as informações da condição dentro de um manipulador de condição, use `RESIGNAL`. Veja a Seção 15.6.7.1, “DECLARE ... Statement de CONDICAO”, e a Seção 15.6.7.2, “DECLARE ... Statement de HANDLER”.

Para obter informações da área de diagnóstico, use a declaração `GET DIAGNOSTICS` (consulte Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.

#### 15.6.7.1 DECLARAR ... Declaração de condição

```
DECLARE condition_name CONDITION FOR condition_value

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
}
```

A declaração `DECLARE ... CONDITION` (declare-condition.html "15.6.7.1 DECLARE ... CONDITION Statement") declara uma condição de erro nomeada, associando um nome a uma condição que precisa de tratamento específico. O nome pode ser referido em uma declaração subsequente `DECLARE ... HANDLER` (declare-handler.html "15.6.7.2 DECLARE ... HANDLER Statement") (ver Seção 15.6.7.2, “DECLARE ... HANDLER Statement”).

As declarações de condição devem aparecer antes das declarações de cursor ou manipulador.

O *`condition_value` para [`DECLARE ... CONDITION`](declare-condition.html "15.6.7.1 DECLARE ... CONDITION Statement") indica a condição específica ou classe de condições a associar ao nome da condição. Pode assumir as seguintes formas:

* *`mysql_error_code`*: Um literal inteiro que indica um código de erro do MySQL.

Não use o código de erro MySQL 0, pois isso indica sucesso em vez de uma condição de erro. Para uma lista de códigos de erro MySQL, consulte o Referência de Mensagem de Erro do Servidor.

* SQLSTATE [VALOR] *`sqlstate_value`*: Uma cadeia literal de 5 caracteres que indica um valor SQLSTATE.

Não use valores SQLSTATE que comecem com `'00'`, pois esses indicam sucesso em vez de uma condição de erro. Para uma lista de valores SQLSTATE, consulte o Referência de Mensagem de Erro do Servidor.

Os nomes de condição referenciados em `SIGNAL` ou use as declarações `RESIGNAL` devem ser associados a valores SQLSTATE, não códigos de erro do MySQL.

Usar nomes para as condições pode ajudar a tornar o código de programa armazenado mais claro. Por exemplo, este manipulador se aplica a tentativas de excluir uma tabela inexistente, mas isso só é aparente se você souber que o código de erro MySQL 1051 é para "tabela desconhecida":

```
DECLARE CONTINUE HANDLER FOR 1051
  BEGIN
    -- body of handler
  END;
```

Ao declarar um nome para a condição, o propósito do manipulador é mais facilmente visto:

```
DECLARE no_such_table CONDITION FOR 1051;
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```

Aqui está uma condição nomeada para a mesma condição, mas com base no valor correspondente do SQLSTATE, em vez do código de erro do MySQL:

```
DECLARE no_such_table CONDITION FOR SQLSTATE '42S02';
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
    -- body of handler
  END;
```

#### 15.6.7.2 DECLARAR ... declaração de manipulador

```
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

A declaração `DECLARE ... HANDLER`(declare-handler.html "15.6.7.2 DECLARE ... HANDLER Statement") especifica um manipulador que lida com uma ou mais condições. Se uma dessas condições ocorrer, o *`statement`* especificado é executado. *`statement`* pode ser uma declaração simples, como `SET var_name = value`, ou uma declaração composta escrita usando `BEGIN` e `END` (consulte Seção 15.6.1, “BEGIN ... END Declaração Composta”).

As declarações de manipulador devem aparecer após as declarações de variáveis ou condições.

O valor *`handler_action`* indica a ação que o manipulador realiza após a execução da instrução do manipulador:

* `CONTINUE`: A execução do programa atual continua.

* `EXIT`: A execução termina para a instrução composta `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") na qual o manipulador é declarado. Isso é verdadeiro mesmo que a condição ocorra em um bloco interno.

* `UNDO`: Não é suportado.

O *`condition_value` para [`DECLARE ... HANDLER`](declare-handler.html "15.6.7.2 DECLARE ... HANDLER Statement") indica a condição específica ou classe de condições que ativa o manipulador. Pode assumir as seguintes formas:

* *`mysql_error_code`*: Um literal inteiro que indica um código de erro do MySQL, como 1051 para especificar “tabela desconhecida”:

  ```
  DECLARE CONTINUE HANDLER FOR 1051
    BEGIN
      -- body of handler
    END;
  ```

Não use o código de erro MySQL 0, pois isso indica sucesso em vez de uma condição de erro. Para uma lista de códigos de erro MySQL, consulte o Referência de Mensagem de Erro do Servidor.

* SQLSTATE [VALOR] *`sqlstate_value`*: Uma string literal de 5 caracteres que indica um valor SQLSTATE, como `'42S01'` para especificar “tabela desconhecida”:

  ```
  DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
    BEGIN
      -- body of handler
    END;
  ```

Não use valores SQLSTATE que comecem com `'00'`, pois esses indicam sucesso em vez de uma condição de erro. Para uma lista de valores SQLSTATE, consulte o Referência de Mensagem de Erro do Servidor.

* *`condition_name`*: Um nome de condição previamente especificado com [`DECLARE ... CONDITION`](declare-condition.html "15.6.7.1 DECLARE ... CONDITION Statement"). Um nome de condição pode ser associado a um código de erro MySQL ou valor SQLSTATE. Veja a Seção 15.6.7.1, “DECLARE ... Statement CONDITION”.

* `SQLWARNING`: Abreviação para a classe de valores SQLSTATE que começam com `'01'`.

  ```
  DECLARE CONTINUE HANDLER FOR SQLWARNING
    BEGIN
      -- body of handler
    END;
  ```

* `NOT FOUND`: Abreviação para a classe de valores SQLSTATE que começam com `'02'`. Isso é relevante no contexto de cursor e é usado para controlar o que acontece quando um cursor atinge o final de um conjunto de dados. Se não houver mais linhas disponíveis, uma condição de Nenhum dado ocorre com o valor SQLSTATE `'02000'`. Para detectar essa condição, você pode configurar um manipulador para ela ou para uma condição de `NOT FOUND`.

  ```
  DECLARE CONTINUE HANDLER FOR NOT FOUND
    BEGIN
      -- body of handler
    END;
  ```

Para outro exemplo, veja a Seção 15.6.6, “Cursors”. A condição `NOT FOUND` também ocorre para as declarações `SELECT ... INTO var_list` que não recuperam nenhuma linha.

* `SQLEXCEPTION`: Abreviação para a classe de valores SQLSTATE que não começam com `'00'`, `'01'` ou `'02'`.

  ```
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      -- body of handler
    END;
  ```

Para obter informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte a Seção 15.6.7.6, “Regras de escopo para manipuladores”.

Se ocorrer uma condição para a qual nenhum manipulador tenha sido declarado, a ação tomada depende da classe da condição:

* Para as condições de `SQLEXCEPTION`, o programa armazenado termina na declaração que levantou a condição, como se houvesse um manipulador de [[`EXIT`]. Se o programa foi chamado por outro programa armazenado, o programa que o chamou lida com a condição usando as regras de seleção de manipulador aplicadas aos seus próprios manipuladores.

* Para as condições de `SQLWARNING`, o programa continua a ser executado, como se houvesse um manipulador de `CONTINUE`.

* Para as condições de `NOT FOUND`, se a condição foi levantada normalmente, a ação é `CONTINUE`. Se foi levantada por `SIGNAL` ou `RESIGNAL`, a ação é `EXIT`.

O exemplo a seguir utiliza um manipulador para `SQLSTATE '23000'`, que ocorre em caso de erro de chave duplicada:

```
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

Observe que `@x` é `3` após o procedimento ser executado, o que mostra que a execução continuou até o final do procedimento após o erro ter ocorrido. Se a declaração (declare-handler.html "15.6.7.2 DECLARE ... HANDLER Statement") não tivesse sido presente, o MySQL teria tomado a ação padrão (`EXIT`) após o segundo `INSERT` ter falhado devido à restrição `PRIMARY KEY`, e `SELECT @x` teria retornado `2`.

Para ignorar uma condição, declare um manipulador `CONTINUE` para ela e associe-a a um bloco vazio. Por exemplo:

```
DECLARE CONTINUE HANDLER FOR SQLWARNING BEGIN END;
```

O escopo de uma etiqueta de bloco não inclui o código para manipuladores declarados dentro do bloco. Portanto, a declaração associada a um manipulador não pode usar `ITERATE` ou `LEAVE` para referir-se a etiquetas para blocos que encerram a declaração do manipulador. Considere o exemplo a seguir, onde o bloco `REPEAT` tem uma etiqueta de `retry`:

```
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

A etiqueta `retry` está no escopo para a declaração `IF` dentro do bloco. Não está no escopo para o manipulador `CONTINUE`, portanto, a referência lá é inválida e resulta em um erro:

```
ERROR 1308 (42000): LEAVE with no matching label: retry
```

Para evitar referências a rótulos externos nos manipuladores, use uma dessas estratégias:

* Para sair do bloco, use um manipulador `EXIT`. Se não for necessário limpar o bloco, o corpo do manipulador [`BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") pode ser vazio:

  ```
  DECLARE EXIT HANDLER FOR SQLWARNING BEGIN END;
  ```

Caso contrário, coloque as declarações de limpeza no corpo do manipulador:

  ```
  DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
      block cleanup statements
    END;
  ```

* Para continuar a execução, defina uma variável de status em um manipulador `CONTINUE` que possa ser verificada no bloco envolvente para determinar se o manipulador foi invocado. O exemplo a seguir usa a variável `done` para esse propósito:

  ```
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

#### 15.6.7.3 Declaração de DIAGNÓSTICO GET

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

As instruções SQL produzem informações diagnósticas que preenchem a área de diagnóstico. A instrução `GET DIAGNOSTICS` (get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") permite que as aplicações inspecionem essas informações. (Você também pode usar `SHOW WARNINGS` (show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") ou `SHOW ERRORS` para ver condições ou erros.)

Não são necessários privilégios especiais para executar `GET DIAGNOSTICS`.

A palavra-chave `CURRENT` significa recuperar informações da área de diagnóstico atual. A palavra-chave `STACKED` significa recuperar informações da segunda área de diagnóstico, que está disponível apenas se o contexto atual for um manipulador de condição. Se nenhuma palavra-chave for dada, o padrão é usar a área de diagnóstico atual.

A declaração `GET DIAGNOSTICS` é tipicamente usada em um manipulador dentro de um programa armazenado. É uma extensão do MySQL que `GET [CURRENT] DIAGNOSTICS` (get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") é permitido fora do contexto do manipulador para verificar a execução de qualquer declaração SQL. Por exemplo, se você invocar o programa cliente **mysql**, pode inserir essas declarações na prompt:

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

Esta extensão só se aplica à área de diagnóstico atual. Não se aplica à segunda área de diagnóstico porque `GET STACKED DIAGNOSTICS` é permitido apenas se o contexto atual for um manipulador de condição. Se esse não for o caso, ocorre um erro `GET STACKED DIAGNOSTICS when handler not active`.

Para uma descrição da área de diagnóstico, consulte a Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”. Em resumo, ela contém dois tipos de informações:

* Informações de declaração, como o número de condições que ocorreram ou o número de linhas afetadas.

* Informações sobre a condição, como o código e a mensagem de erro. Se uma declaração levantar várias condições, esta parte da área de diagnóstico tem uma área de condição para cada uma. Se uma declaração não levantar condições, esta parte da área de diagnóstico está vazia.

Para uma declaração que produz três condições, a área de diagnóstico contém informações sobre declaração e condição, como esta:

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

`GET DIAGNOSTICS` pode obter informações de declaração ou condição, mas não ambas na mesma declaração:

* Para obter informações de declaração, obtenha os itens desejados da declaração nas variáveis de destino. Esta instância de `GET DIAGNOSTICS` atribui o número de condições disponíveis e o número de linhas afetadas às variáveis de usuário `@p1` e `@p2`:

  ```
  GET DIAGNOSTICS @p1 = NUMBER, @p2 = ROW_COUNT;
  ```

* Para obter informações sobre a condição, especifique o número da condição e retorne os itens de condição desejados nas variáveis de destino. Esta instância de `GET DIAGNOSTICS`(get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") atribui o valor SQLSTATE e a mensagem de erro às variáveis de usuário `@p3` e `@p4`:

  ```
  GET DIAGNOSTICS CONDITION 1
    @p3 = RETURNED_SQLSTATE, @p4 = MESSAGE_TEXT;
  ```

A lista de recuperação especifica uma ou mais atribuições `target = item_name`, separadas por vírgulas. Cada atribuição nomeia uma variável-alvo e um *`statement_information_item_name`* ou *`condition_information_item_name`* designador, dependendo se a declaração recupera informações de declaração ou condição.

Os identificadores válidos *`target`* para armazenar informações de itens podem ser armazenados em parâmetros de procedimento ou função, variáveis locais de programa armazenadas declaradas com `DECLARE`, ou variáveis definidas pelo usuário.

Os identificadores válidos *`condition_number`* podem ser parâmetros de procedimentos ou funções armazenados, variáveis locais de programa armazenadas declaradas com `DECLARE`, variáveis definidas pelo usuário, variáveis de sistema ou literais. Um literal de caractere pode incluir um *`_charset`* introducer. Um aviso ocorre se o número de condições não estiver na faixa de 1 a número de áreas de condição que têm informações. Neste caso, o aviso é adicionado à área de diagnóstico sem ser apagado.

Quando uma condição ocorre, o MySQL não preenche todos os itens de condição reconhecidos por `GET DIAGNOSTICS`(get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement"). Por exemplo:

```
mysql> GET DIAGNOSTICS CONDITION 1
         @p5 = SCHEMA_NAME, @p6 = TABLE_NAME;
mysql> SELECT @p5, @p6;
+------+------+
| @p5  | @p6  |
+------+------+
|      |      |
+------+------+
```

No SQL padrão, se houver várias condições, a primeira condição está relacionada ao valor `SQLSTATE` retornado para a declaração SQL anterior. No MySQL, isso não é garantido. Para obter o erro principal, você não pode fazer isso:

```
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Em vez disso, obtenha primeiro o número da condição, e depois use-o para especificar qual número de condição deve ser inspecionado:

```
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```

Para obter informações sobre os itens de informação de declaração e condição permitidos, e quais são preenchidos quando uma condição ocorre, consulte os itens de informação da área de diagnóstico.

Aqui está um exemplo que usa `GET DIAGNOSTICS` e um manipulador de exceção no contexto de um procedimento armazenado para avaliar o resultado de uma operação de inserção. Se a inserção foi bem-sucedida, o procedimento usa `GET DIAGNOSTICS` para obter o número de linhas afetadas. Isso mostra que você pode usar `GET DIAGNOSTICS` várias vezes para recuperar informações sobre uma declaração, desde que a área de diagnóstico atual não tenha sido limpa.

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

Suponha que `t1.int_col` seja uma coluna inteira declarada como `NOT NULL`. O procedimento produz esses resultados quando invocado para inserir valores não `NULL` e `NULL`, respectivamente:

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

Quando um manipulador de condição é ativado, ocorre um empurrão para a pilha de área de diagnóstico:

* A primeira (atual) área de diagnóstico se torna a segunda (em pilha) área de diagnóstico e uma nova área de diagnóstico atual é criada como uma cópia dela.

* `GET [CURRENT] DIAGNOSTICS` e (get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") e `GET STACKED DIAGNOSTICS` podem ser utilizados no manipulador para acessar os conteúdos das áreas de diagnóstico atuais e empilhadas.

* Inicialmente, ambas as áreas de diagnóstico retornam o mesmo resultado, portanto é possível obter informações da área de diagnóstico atual sobre a condição que ativou o manipulador, *desde que* você não execute nenhuma declaração dentro do manipulador que mude sua área de diagnóstico atual.

* No entanto, as declarações que são executadas no manipulador podem modificar a área de diagnóstico atual, apagando e definindo seu conteúdo de acordo com as regras normais (veja Como a Área de Diagnóstico é Limpada e Populada).

Uma maneira mais confiável de obter informações sobre a condição de ativação do manipulador é usar a área de diagnóstico empilhada, que não pode ser modificada por declarações que executam dentro do manipulador, exceto `RESIGNAL`. Para informações sobre quando a área de diagnóstico atual é definida e apagada, consulte a Seção 15.6.7.7, “A Área de Diagnóstico MySQL”.

O próximo exemplo mostra como o `GET STACKED DIAGNOSTICS` pode ser usado dentro de um manipulador para obter informações sobre a exceção manipulada, mesmo após a área de diagnóstico atual ter sido modificada por declarações do manipulador.

Dentro de um procedimento armazenado `p()`, tentamos inserir dois valores em uma tabela que contém uma coluna `TEXT NOT NULL`. O primeiro valor é uma string que não é `NULL` e o segundo é `NULL`. A coluna proíbe valores de `NULL`, então o primeiro inserção tem sucesso, mas a segunda causa uma exceção. O procedimento inclui um manipulador de exceção que mapeia tentativas de inserir `NULL` em inserções da string vazia:

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

Quando o manipulador é ativado, uma cópia da área de diagnóstico atual é empurrada para a pilha de áreas de diagnóstico. O manipulador primeiro exibe o conteúdo das áreas de diagnóstico atual e empilhada, que são ambas iguais inicialmente:

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

As declarações que executam após as declarações `GET DIAGNOSTICS` podem redefinir a área de diagnóstico atual. As declarações podem redefinir a área de diagnóstico atual. Por exemplo, o manipulador mapeia a inserção `NULL` em uma inserção de cadeia vazia e exibe o resultado. A nova inserção é bem-sucedida e limpa a área de diagnóstico atual, mas a área de diagnóstico empilhada permanece inalterada e ainda contém informações sobre a condição que ativou o manipulador:

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

Após o procedimento retornar, a tabela contém duas linhas. A linha vazia resulta da tentativa de inserir `NULL` que foi mapeada a uma inserção de cadeia vazia:

```
+----------+
| c1       |
+----------+
| string 1 |
|          |
+----------+
```

No exemplo anterior, as duas primeiras `GET DIAGNOSTICS` (get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") declarações dentro do manipulador de condição que recuperam informações das áreas de diagnóstico atuais e empilhadas retornam os mesmos valores. Este não é o caso se as declarações que reinicializam a área de diagnóstico atual forem executadas anteriormente dentro do manipulador. Suponha que `p()` seja reescrita para colocar as declarações `DECLARE` dentro da definição do manipulador em vez de antecedê-las:

```
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

* Antes do MySQL 5.7.2, `DECLARE` não altera a área de diagnóstico atual, portanto, as duas primeiras declarações `GET DIAGNOSTICS` retornam o mesmo resultado, assim como na versão original do `p()`.

Em MySQL 5.7.2, foi feito o trabalho para garantir que todas as declarações não diagnósticas preencham a área de diagnóstico, de acordo com o padrão SQL. `DECLARE` é uma delas, então, em 5.7.2 e versões posteriores, as declarações `DECLARE` que são executadas no início do manipulador limpam a área de diagnóstico atual e as declarações [`GET DIAGNOSTICS`(get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") produzem resultados diferentes:

  ```
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

Para evitar esse problema em um manipulador de condição ao buscar informações sobre a condição que ativou o manipulador, certifique-se de acessar a área de diagnósticos empilhada, e não a área de diagnósticos atual.

#### 15.6.7.4 Declaração RESIGNAL

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

`RESIGNAL` transmite as informações de condição de erro que estão disponíveis durante a execução de um manipulador de condição dentro de uma declaração composta dentro de um procedimento armazenado ou função, gatilho ou evento. `RESIGNAL` pode alterar algumas ou todas as informações antes de transmiti-las. `RESIGNAL` está relacionado a `SIGNAL`, mas, em vez de originar uma condição como o `SIGNAL` faz, `RESIGNAL` retransmite informações de condição existentes, possivelmente após modificá-las.

`RESIGNAL` permite tanto lidar com um erro quanto retornar as informações do erro. Caso contrário, ao executar uma declaração SQL dentro do manipulador, as informações que causaram a ativação do manipulador são destruídas. `RESIGNAL` também pode tornar alguns procedimentos mais curtos se um manipulador dado pode lidar com parte de uma situação, então passar a condição “para cima da linha” para outro manipulador.

Não são necessários privilégios para executar a declaração `RESIGNAL`.

Todas as formas de `RESIGNAL` exigem que o contexto atual seja um manipulador de condição. Caso contrário, `RESIGNAL` é ilegal e ocorre um erro de `RESIGNAL when handler not active`.

Para obter informações da área de diagnóstico, use a declaração `GET DIAGNOSTICS` (consulte Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.

* RESIGNAL Visão geral
* RESIGNAL Sozinho
* RESIGNAL com novas informações de sinal
* RESIGNAL com um valor de condição e informações opcionais de novo sinal
* RESIGNAL Requer contexto do manipulador de condição

##### RESIGNAL Visão geral

Para *`condition_value`* e *`signal_information_item`*, as definições e regras são as mesmas para `RESIGNAL` e para `SIGNAL`. Por exemplo, o *`condition_value`* pode ser um valor de `SQLSTATE`, e o valor pode indicar erros, avisos ou “não encontrado”. Para informações adicionais, consulte a Seção 15.6.7.5, “Declaração de SINAL”.

A declaração `RESIGNAL` assume as cláusulas *`condition_value`* e `SET`*, ambas opcionais. Isso leva a vários usos possíveis:

* Apenas `RESIGNAL`:

  ```
  RESIGNAL;
  ```

* `RESIGNAL` com novas informações sobre o sinal:

  ```
  RESIGNAL SET signal_information_item [, signal_information_item] ...;
  ```

* `RESIGNAL` com um valor de condição e, possivelmente, novas informações sobre o sinal:

  ```
  RESIGNAL condition_value
      [SET signal_information_item [, signal_information_item] ...];
  ```

Todos esses casos de uso causam mudanças nas áreas de diagnóstico e condição:

* Uma área de diagnóstico contém uma ou mais áreas de condição.
* Uma área de condição contém itens de informações de condição, como o valor `SQLSTATE`, `MYSQL_ERRNO` ou `MESSAGE_TEXT`.

Há uma pilha de áreas de diagnóstico. Quando um manipulador assume o controle, ele empurra uma área de diagnóstico para a parte superior da pilha, de modo que há duas áreas de diagnóstico durante a execução do manipulador:

* A primeira (atual) área de diagnóstico, que começa como uma cópia da última área de diagnóstico, mas é sobrescrita pela primeira declaração no manipulador que altera a área de diagnóstico atual.

* A última área de diagnóstico (em pilha), que possui as áreas de condição que foram configuradas antes do manipulador assumir o controle.

O número máximo de áreas de condição em uma área de diagnóstico é determinado pelo valor da variável do sistema `max_error_count`. Veja Variáveis do sistema relacionadas à área de diagnóstico.

##### RESIGNAL Sozinho

Um simples `RESIGNAL` sozinho significa “passar o erro sem alterações”. Ele restaura a última área de diagnóstico e a torna a área de diagnóstico atual. Ou seja, ele “expande” a pilha de áreas de diagnóstico.

Dentro de um manipulador de condição que captura uma condição, uma utilização exclusiva do `RESIGNAL` é realizar algumas outras ações e, em seguida, passar sem alterações as informações originais da condição (as informações que existiam antes da entrada no manipulador).

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

Suponha que a declaração `DROP TABLE xx` falhe. A pilha de área de diagnóstico parece assim:

```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

Então, a execução entra no manipulador `EXIT`. Ela começa empurrando uma área de diagnóstico para o topo da pilha, que agora parece assim:

```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, o conteúdo da primeira (atual) e da segunda (em pilha) áreas de diagnóstico são os mesmos. A primeira área de diagnóstico pode ser modificada por declarações que são executadas posteriormente dentro do manipulador.

Normalmente, uma declaração de procedimento limpa a primeira área de diagnóstico. `BEGIN` é uma exceção, não limpa, não faz nada. `SET` não é uma exceção, limpa, realiza a operação e produz um resultado de “sucesso”. A pilha de áreas de diagnóstico agora parece assim:

```
DA 1. ERROR 0000 (00000): Successful operation
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

Neste ponto, se `@a = 0`, `RESIGNAL` expande a pilha de áreas de diagnóstico, que agora parece assim:

```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

E é isso que o chamador vê.

Se `@a` não for 0, o manipulador simplesmente termina, o que significa que não há mais uso para a área de diagnóstico atual (já foi "manipulada"), então ela pode ser descartada, fazendo com que a pilha de áreas de diagnóstico se torne novamente a área de diagnóstico atual. A pilha de áreas de diagnóstico tem a seguinte aparência:

```
DA 1. ERROR 0000 (00000): Successful operation
```

Os detalhes fazem parecer complexo, mas o resultado final é bastante útil: os manipuladores podem executar sem destruir informações sobre a condição que causou a ativação do manipulador.

##### RESIGNAL com novas informações de sinal

`RESIGNAL` com uma cláusula `SET` fornece novas informações de sinal, então a declaração significa “transmitir o erro com alterações”:

```
RESIGNAL SET signal_information_item [, signal_information_item] ...;
```

Assim como com o `RESIGNAL` sozinho, a ideia é empurrar a pilha de área de diagnóstico para que as informações originais saiam. Ao contrário do `RESIGNAL` sozinho, qualquer coisa especificada na cláusula do `SET` muda.

Exemplo:

```
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

Lembre-se da discussão anterior de que `RESIGNAL` por si só resulta em uma pilha de áreas de diagnóstico como esta:

```
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

A declaração `RESIGNAL SET MYSQL_ERRNO = 5` resulta neste pilha, que é o que o chamador vê:

```
DA 1. ERROR 5 (42S02): Unknown table 'xx'
```

Em outras palavras, ele muda o número de erro, e nada mais.

A declaração `RESIGNAL` pode alterar alguns ou todos os itens de informações de sinal, fazendo com que a primeira área de condição da área de diagnóstico pareça bastante diferente.

##### RESIGNAL com um Valor de Condição e Informações Opcionais sobre Novo Sinal

`RESIGNAL` com um valor de condição significa “empurrar uma condição para a área de diagnóstico atual”. Se a cláusula `SET` estiver presente, ela também altera as informações de erro.

```
RESIGNAL condition_value
    [SET signal_information_item [, signal_information_item] ...];
```

Essa forma de `RESIGNAL` restaura a última área de diagnóstico e a torna a área de diagnóstico atual. Isso é, ela "expande" a pilha de áreas de diagnóstico, o que é o mesmo que o que um simples `RESIGNAL` sozinho faria. No entanto, ela também altera a área de diagnóstico dependendo do valor da condição ou das informações do sinal.

Exemplo:

```
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

Isso é semelhante ao exemplo anterior, e os efeitos são os mesmos, exceto que, se `RESIGNAL` acontecer, a área atual da condição parecerá diferente no final. (A razão pela qual a condição se soma em vez de substituir a condição existente é o uso de um valor de condição.)

A declaração `RESIGNAL` inclui um valor de condição (`SQLSTATE '45000'`), portanto, ela adiciona uma nova área de condição, resultando em uma pilha de áreas de diagnóstico que parece assim:

```
DA 1. (condition 2) ERROR 1051 (42S02): Unknown table 'xx'
      (condition 1) ERROR 5 (45000) Unknown table 'xx'
```

O resultado de `CALL p()`(call.html "15.2.1 CALL Statement") e `SHOW ERRORS` para este exemplo é:

```
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

##### RESIGNAL Requer o Contextor de Manipulador de Condição

Todas as formas de `RESIGNAL` exigem que o contexto atual seja um manipulador de condição. Caso contrário, `RESIGNAL` é ilegal e ocorre um erro de `RESIGNAL when handler not active`. Por exemplo:

```
mysql> CREATE PROCEDURE p () RESIGNAL;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL p();
ERROR 1645 (0K000): RESIGNAL when handler not active
```

Aqui está um exemplo mais difícil:

```
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

`RESIGNAL` ocorre dentro da função armazenada `f()`. Embora o próprio `f()` seja invocado dentro do contexto do manipulador `EXIT`, a execução dentro de `f()` tem seu próprio contexto, que não é o contexto do manipulador. Assim, `RESIGNAL` dentro de `f()` resulta em um erro de “manipulador não ativo”.

#### 15.6.7.5 Declaração de Sinal

```
SIGNAL condition_value
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

`SIGNAL` é a forma de "retornar" um erro. `SIGNAL` fornece informações de erro a um manipulador, a uma parte externa da aplicação ou ao cliente. Além disso, fornece controle sobre as características do erro (número de erro, valor `SQLSTATE`, mensagem). Sem `SIGNAL`, é necessário recorrer a soluções alternativas, como referir deliberadamente a uma tabela inexistente para fazer com que uma rotina retorne um erro.

Não são necessários privilégios para executar a declaração `SIGNAL`.

Para obter informações da área de diagnóstico, use a declaração `GET DIAGNOSTICS` (consulte Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.

* Visão geral do sinal
* Informações sobre condições do sinal
* Efeito dos sinais nos manipuladores, cursors e declarações

##### SINAL Visão geral

O *`condition_value` em uma declaração `SIGNAL` indica o valor de erro a ser retornado. Pode ser um valor `SQLSTATE` (uma string literal de 5 caracteres) ou um *`condition_name`* que se refere a uma condição nomeada previamente definida com [`DECLARE ... CONDITION`](declare-condition.html "15.6.7.1 DECLARE ... CONDITION Statement") (ver Seção 15.6.7.1, “DECLARE ... DECLARAR Condição”).

Um valor de `SQLSTATE` pode indicar erros, avisos ou “não encontrado”. Os dois primeiros caracteres do valor indicam sua classe de erro, conforme discutido nos Itens de Informações de Condição de Sinal. Alguns valores de sinal causam a terminação da declaração; veja o Efeito dos Sinais nos Manipuladores, Cursores e Declarações.

O valor `SQLSTATE` para uma declaração `SIGNAL` não deve começar com `'00'`, pois tais valores indicam sucesso e não são válidos para sinalizar um erro. Isso é verdadeiro, independentemente de o valor `SQLSTATE` ser especificado diretamente na declaração `SIGNAL` ou em uma condição nomeada referenciada na declaração. Se o valor for inválido, ocorre um erro `Bad SQLSTATE`.

Para indicar um valor genérico de `SQLSTATE`, use `'45000'`, que significa “exceção não controlada definida pelo usuário”.

A declaração `SIGNAL` inclui opcionalmente uma cláusula `SET` que contém vários itens de sinal, em uma lista de atribuições de *`condition_information_item_name`* = *`simple_value_specification`*, separadas por vírgulas.

Cada *`condition_information_item_name`* pode ser especificado apenas uma vez na cláusula `SET`. Caso contrário, ocorre um erro `Duplicate condition information item`.

Os identificadores válidos *`simple_value_specification`* podem ser especificados usando parâmetros de procedimentos ou funções armazenadas, variáveis locais de programa armazenadas declaradas com `DECLARE`, variáveis definidas pelo usuário, variáveis do sistema ou literais. Um literal de caractere pode incluir um *`_charset`* introducer.

Para informações sobre os valores permitidos de *`condition_information_item_name`*, consulte os itens de informações sobre condições de sinal.

O procedimento a seguir sinaliza um erro ou aviso, dependendo do valor de `pval`, seu parâmetro de entrada:

```
CREATE PROCEDURE p (pval INT)
BEGIN
  DECLARE specialty CONDITION FOR SQLSTATE '45000';
  IF pval = 0 THEN
    SIGNAL SQLSTATE '01000';
  ELSEIF pval = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred';
  ELSEIF pval = 2 THEN
    SIGNAL specialty
      SET MESSAGE_TEXT = 'An error occurred';
  ELSE
    SIGNAL SQLSTATE '01000'
      SET MESSAGE_TEXT = 'A warning occurred', MYSQL_ERRNO = 1000;
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred', MYSQL_ERRNO = 1001;
  END IF;
END;
```

Se `pval` for 0, `p()` sinaliza um aviso porque os valores de `SQLSTATE` que começam com `'01'` são sinais na classe de aviso. O aviso não termina o procedimento, e pode ser visto com [`SHOW WARNINGS`](show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") após o procedimento retornar.

Se `pval` for 1, `p()` sinaliza um erro e define o item de informação da condição `MESSAGE_TEXT`. O erro termina o procedimento, e o texto é retornado com as informações de erro.

Se `pval` for 2, o mesmo erro é sinalizado, embora o valor `SQLSTATE` seja especificado usando uma condição nomeada neste caso.

Se `pval` for algo mais, `p()` primeiro sinaliza um aviso e define os itens de informações do texto de mensagem e número de erro. Esse aviso não termina o procedimento, então a execução continua e `p()` então sinaliza um erro. O erro termina o procedimento. O texto de mensagem e o número de erro definidos pelo aviso são substituídos pelos valores definidos pelo erro, que são retornados com as informações de erro.

`SIGNAL` é tipicamente usado dentro de programas armazenados, mas é uma extensão do MySQL que é permitida fora do contexto do manipulador. Por exemplo, se você invocar o programa cliente **mysql**, pode inserir qualquer uma dessas declarações na prompt:

```
SIGNAL SQLSTATE '77777';

CREATE TRIGGER t_bi BEFORE INSERT ON t
  FOR EACH ROW SIGNAL SQLSTATE '77777';

CREATE EVENT e ON SCHEDULE EVERY 1 SECOND
  DO SIGNAL SQLSTATE '77777';
```

`SIGNAL` é executado de acordo com as seguintes regras:

Se a declaração `SIGNAL` indicar um valor específico de `SQLSTATE`, esse valor é usado para sinalizar a condição especificada. Exemplo:

```
CREATE PROCEDURE p (divisor INT)
BEGIN
  IF divisor = 0 THEN
    SIGNAL SQLSTATE '22012';
  END IF;
END;
```

Se a declaração `SIGNAL` utilizar uma condição nomeada, a condição deve ser declarada em algum escopo que se aplique à declaração `SIGNAL`, e deve ser definida usando um valor `SQLSTATE`, não um número de erro do MySQL. Exemplo:

```
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE divide_by_zero CONDITION FOR SQLSTATE '22012';
  IF divisor = 0 THEN
    SIGNAL divide_by_zero;
  END IF;
END;
```

Se a condição nomeada não existir no escopo da declaração `SIGNAL`, ocorre um erro `Undefined CONDITION`.

Se `SIGNAL` se refere a uma condição nomeada que é definida com um número de erro MySQL em vez de um valor de `SQLSTATE`, ocorre um erro de `SIGNAL/RESIGNAL can only use a CONDITION defined with SQLSTATE`. As seguintes declarações causam esse erro porque a condição nomeada está associada a um número de erro MySQL:

```
DECLARE no_such_table CONDITION FOR 1051;
SIGNAL no_such_table;
```

Se uma condição com um nome específico for declarada várias vezes em diferentes escopos, a declaração com o escopo mais local será aplicada. Considere o seguinte procedimento:

```
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE my_error CONDITION FOR SQLSTATE '45000';
  IF divisor = 0 THEN
    BEGIN
      DECLARE my_error CONDITION FOR SQLSTATE '22012';
      SIGNAL my_error;
    END;
  END IF;
  SIGNAL my_error;
END;
```

Se `divisor` for 0, a primeira declaração `SIGNAL` é executada. A declaração de condição mais interna `my_error` é aplicada, elevando `SQLSTATE` `'22012'`.

Se `divisor` não for 0, a segunda declaração `SIGNAL` é executada. A declaração de condição mais externa `my_error` é aplicada, elevando `SQLSTATE` `'45000'`.

Para obter informações sobre como o servidor escolhe manipuladores quando uma condição ocorre, consulte a Seção 15.6.7.6, “Regras de escopo para manipuladores”.

Os sinais podem ser levantados dentro dos manipuladores de exceção:

```
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SIGNAL SQLSTATE VALUE '99999'
      SET MESSAGE_TEXT = 'An error occurred';
  END;
  DROP TABLE no_such_table;
END;
```

`CALL p()` alcança a declaração `DROP TABLE`. Não há uma tabela chamada `no_such_table`, então o manipulador de erro é ativado. O manipulador de erro destrói o erro original (“nenhuma tabela desse tipo”) e faz um novo erro com `SQLSTATE` `'99999'` e mensagem `An error occurred`.

##### Informações sobre a condição do sinal

A tabela a seguir lista os nomes dos itens de informações de condição da área de diagnóstico que podem ser definidos em uma declaração `SIGNAL` (ou `RESIGNAL`). Todos os itens são SQL padrão, exceto `MYSQL_ERRNO`, que é uma extensão do MySQL. Para mais informações sobre esses itens, consulte a Seção 15.6.7.7, “A Área de Diagnóstico MySQL”.

```
Item Name             Definition
---------             ----------
CLASS_ORIGIN          VARCHAR(64)
SUBCLASS_ORIGIN       VARCHAR(64)
CONSTRAINT_CATALOG    VARCHAR(64)
CONSTRAINT_SCHEMA     VARCHAR(64)
CONSTRAINT_NAME       VARCHAR(64)
CATALOG_NAME          VARCHAR(64)
SCHEMA_NAME           VARCHAR(64)
TABLE_NAME            VARCHAR(64)
COLUMN_NAME           VARCHAR(64)
CURSOR_NAME           VARCHAR(64)
MESSAGE_TEXT          VARCHAR(128)
MYSQL_ERRNO           SMALLINT UNSIGNED
```

O conjunto de caracteres para itens de caracteres é UTF-8.

É ilegal atribuir `NULL` a um item de informação de condição em uma declaração `SIGNAL`.

Uma declaração `SIGNAL` sempre especifica um valor `SQLSTATE`, diretamente ou indiretamente, referenciando uma condição nomeada definida com um valor `SQLSTATE`. Os dois primeiros caracteres de um valor `SQLSTATE` são sua classe, e a classe determina o valor padrão para os itens de informações de condição:

* Classe = `'00'` (sucesso)

Ilegal. Os valores `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para `SIGNAL`.

* Classe = `'01'` (advertido)

  ```
  MESSAGE_TEXT = 'Unhandled user-defined warning condition';
  MYSQL_ERRNO = ER_SIGNAL_WARN
  ```

* Classe = `'02'` (não encontrada)

  ```
  MESSAGE_TEXT = 'Unhandled user-defined not found condition';
  MYSQL_ERRNO = ER_SIGNAL_NOT_FOUND
  ```

* Classe > `'02'` (exceção)

  ```
  MESSAGE_TEXT = 'Unhandled user-defined exception condition';
  MYSQL_ERRNO = ER_SIGNAL_EXCEPTION
  ```

Para as classes jurídicas, os outros itens de informações das condições são definidos da seguinte forma:

```
CLASS_ORIGIN = SUBCLASS_ORIGIN = '';
CONSTRAINT_CATALOG = CONSTRAINT_SCHEMA = CONSTRAINT_NAME = '';
CATALOG_NAME = SCHEMA_NAME = TABLE_NAME = COLUMN_NAME = '';
CURSOR_NAME = '';
```

Os valores de erro que são acessíveis após a execução de `SIGNAL` são o valor `SQLSTATE` elevado pela declaração `SIGNAL` e os itens `MESSAGE_TEXT` e `MYSQL_ERRNO`. Esses valores estão disponíveis na API C:

* `mysql_sqlstate()` retorna o valor de `SQLSTATE`.

* `mysql_errno()` retorna o valor `MYSQL_ERRNO`.

* `mysql_error()` retorna o valor `MESSAGE_TEXT`.

No nível SQL, a saída de `SHOW WARNINGS` e (show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") e `SHOW ERRORS` e (show-errors.html "15.7.7.17 SHOW ERRORS Statement") indica os valores de `MYSQL_ERRNO` e `MESSAGE_TEXT` nas colunas `Code` e `Message`.

Para obter informações da área de diagnóstico, use a declaração `GET DIAGNOSTICS` (consulte Seção 15.6.7.3, “Declaração GET DIAGNOSTICS”). Para informações sobre a área de diagnóstico, consulte Seção 15.6.7.7, “A Área de Diagnóstico do MySQL”.

##### Efeito dos sinais nos manipuladores, cursors e declarações

Os sinais têm efeitos diferentes na execução da declaração, dependendo da classe do sinal. A classe determina o quão grave é um erro. O MySQL ignora o valor da variável do sistema `sql_mode`; em particular, o modo SQL rigoroso não importa. O MySQL também ignora `IGNORE`: A intenção de `SIGNAL` é gerar um erro explicitamente gerado pelo usuário, portanto, um sinal nunca é ignorado.

Nas descrições a seguir, “não controlada” significa que nenhum manipulador para o valor sinalizado `SQLSTATE` foi definido com (declare-handler.html "15.6.7.2 DECLARE ... HANDLER Statement") [[PH_LNK_648]].

* Classe = `'00'` (sucesso)

Ilegal. Os valores `SQLSTATE` que começam com `'00'` indicam sucesso e não são válidos para `SIGNAL`.

* Classe = `'01'` (advertido)

O valor da variável de sistema `warning_count` aumenta. (show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") `SHOW WARNINGS` mostra o sinal. Os manipuladores `SQLWARNING` capturam o sinal.

As advertências não podem ser devolvidas a partir de funções armazenadas porque a declaração `RETURN` que faz com que a função retorne limpa a área de diagnóstico. A declaração, portanto, limpa quaisquer advertências que possam ter estado lá (e redefine `warning_count` para 0).

* Classe = `'02'` (não encontrada)

Os manipuladores `NOT FOUND` captam o sinal. Não há efeito nos cursors. Se o sinal não for manipulado em uma função armazenada, as instruções terminam.

* Classe > `'02'` (exceção)

Os manipuladores `SQLEXCEPTION` captam o sinal. Se o sinal não for manipulado em uma função armazenada, as instruções terminam.

* Classe = `'40'`

Tratado como uma exceção comum.

#### 15.6.7.6 Regras de escopo para manipuladores

Um programa armazenado pode incluir manipuladores que serão invocados quando certas condições ocorrem dentro do programa. A aplicabilidade de cada manipulador depende de sua localização dentro da definição do programa e das condições ou condições que ele manipula:

* Um manipulador declarado em um bloco `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") está em escopo apenas para as instruções SQL que seguem as declarações de manipulador no bloco. Se o próprio manipulador levantar uma condição, ele não pode lidar com essa condição, nem qualquer outro manipulador declarado no bloco. No exemplo a seguir, os manipuladores `H1` e `H2` estão em escopo para condições levantadas por declarações *`stmt1`* e *`stmt2`*. Mas nem `H1` nem `H2` estão em escopo para condições levantadas no corpo de `H1` ou `H2`.

  ```
  BEGIN -- outer block
    DECLARE EXIT HANDLER FOR ...;  -- handler H1
    DECLARE EXIT HANDLER FOR ...;  -- handler H2
    stmt1;
    stmt2;
  END;
  ```

* Um manipulador está no escopo apenas para o bloco em que é declarado e não pode ser ativado para condições que ocorrem fora desse bloco. No exemplo a seguir, o manipulador `H1` está no escopo para *`stmt1`* no bloco interno, mas não para *`stmt2`* no bloco externo:

  ```
  BEGIN -- outer block
    BEGIN -- inner block
      DECLARE EXIT HANDLER FOR ...;  -- handler H1
      stmt1;
    END;
    stmt2;
  END;
  ```

* Um manipulador pode ser específico ou geral. Um manipulador específico é para um código de erro MySQL, valor de `SQLSTATE` ou nome da condição. Um manipulador geral é para uma condição na classe `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`. A especificidade da condição está relacionada à precedência da condição, conforme descrito mais adiante.

Podem ser declaradas várias manipuladoras em diferentes escopos e com especificidades diferentes. Por exemplo, pode haver um manipulador específico de código de erro MySQL em um bloco externo, e um manipulador geral `SQLWARNING` em um bloco interno. Ou pode haver manipuladores para um código de erro específico de MySQL e a classe geral `SQLWARNING` no mesmo bloco.

Se um manipulador é ativado, isso depende não apenas do seu escopo e do valor da condição, mas também dos outros manipuladores presentes. Quando uma condição ocorre em um programa armazenado, o servidor busca manipuladores aplicáveis no escopo atual (bloco `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement")). Se não houver manipuladores aplicáveis, a busca continua para fora, com os manipuladores em cada escopo sucessivo contendo (bloco). Quando o servidor encontra um ou mais manipuladores aplicáveis em um escopo dado, ele escolhe entre eles com base na precedência da condição:

* Um manipulador de código de erro MySQL tem precedência sobre um manipulador de valor `SQLSTATE`.

Um manipulador de valor `SQLSTATE` tem precedência sobre os manipuladores gerais `SQLWARNING`, `SQLEXCEPTION` ou `NOT FOUND`.

* Um manipulador `SQLEXCEPTION` tem precedência sobre um manipulador `SQLWARNING`.

* É possível ter vários manipuladores aplicáveis com a mesma precedência. Por exemplo, uma declaração pode gerar múltiplos avisos com diferentes códigos de erro, para cada um dos quais existe um manipulador específico para erros. Neste caso, a escolha de qual manipulador o servidor ativa é não determinístico e pode mudar dependendo das circunstâncias em que a condição ocorre.

Uma implicação das regras de seleção de manipuladores é que, se houver vários manipuladores aplicáveis em diferentes escopos, os manipuladores com o escopo mais local têm precedência sobre os manipuladores em escopos externos, mesmo sobre aqueles para condições mais específicas.

Se não houver um manipulador apropriado quando uma condição ocorre, a ação tomada depende da classe da condição:

* Para as condições de `SQLEXCEPTION`, o programa armazenado termina na declaração que gerou a condição, como se houvesse um manipulador `EXIT`. Se o programa foi chamado por outro programa armazenado, o programa que o chamou lida com a condição usando as regras de seleção de manipulador aplicadas aos seus próprios manipuladores.

* Para as condições de `SQLWARNING`, o programa continua a ser executado, como se houvesse um manipulador de `CONTINUE`.

* Para as condições de `NOT FOUND`, se a condição foi levantada normalmente, a ação é `CONTINUE`. Se foi levantada por `SIGNAL` ou `RESIGNAL`, a ação é `EXIT`.

Os exemplos a seguir demonstram como o MySQL aplica as regras de seleção do manipulador.

Este procedimento contém dois manipuladores, um para o valor específico `SQLSTATE` (`'42S02'`) que ocorre para tentativas de excluir uma tabela inexistente, e outro para a classe geral `SQLEXCEPTION`:

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

Ambos os manipuladores são declarados no mesmo bloco e têm o mesmo escopo. No entanto, os manipuladores `SQLSTATE` têm precedência sobre os manipuladores `SQLEXCEPTION`, portanto, se a tabela `t` não existir, a declaração `DROP TABLE` gera uma condição que ativa o manipulador `SQLSTATE`:

```
mysql> CALL p1();
+--------------------------------+
| msg                            |
+--------------------------------+
| SQLSTATE handler was activated |
+--------------------------------+
```

Este procedimento contém os mesmos dois manipuladores. Mas desta vez, a declaração `DROP TABLE` e o manipulador `SQLEXCEPTION` estão em um bloco interno em relação ao manipulador `SQLSTATE`:

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

Neste caso, o manipulador que é mais próximo ao local onde a condição ocorre tem precedência. O manipulador `SQLEXCEPTION` é ativado, mesmo que seja mais geral do que o manipulador `SQLSTATE`:

```
mysql> CALL p2();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Neste procedimento, um dos manipuladores é declarado em um bloco interno ao escopo da declaração `DROP TABLE`(drop-table.html "15.1.32 DROP TABLE Statement"):

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

Apenas o manipulador `SQLEXCEPTION` é aplicado porque o outro não está no escopo para a condição levantada pelo `DROP TABLE`:

```
mysql> CALL p3();
+------------------------------------+
| msg                                |
+------------------------------------+
| SQLEXCEPTION handler was activated |
+------------------------------------+
```

Neste procedimento, ambos os manipuladores são declarados em um bloco interno ao escopo da declaração `DROP TABLE`:

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

Nenhum dos manipuladores é aplicado porque não estão abrangidos pelo `DROP TABLE`. A condição levantada pela declaração não é tratada e termina o procedimento com um erro:

```
mysql> CALL p4();
ERROR 1051 (42S02): Unknown table 'test.t'
```

#### 15.6.7.7 Área de Diagnóstico do MySQL

As instruções SQL produzem informações de diagnóstico que preenchem a área de diagnóstico. O SQL padrão tem uma pilha de área de diagnóstico, contendo uma área de diagnóstico para cada contexto de execução aninhado. O SQL padrão também suporta a sintaxe `GET STACKED DIAGNOSTICS` (get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") para referenciar a segunda área de diagnóstico durante a execução do manipulador de condição.

A discussão a seguir descreve a estrutura da área de diagnóstico no MySQL, os itens de informação reconhecidos pelo MySQL, como as declarações limpam e definem a área de diagnóstico, e como as áreas de diagnóstico são empurradas para e removidas da pilha.

* Estrutura da Área de Diagnóstico * Itens de Informação da Área de Diagnóstico * Como a Área de Diagnóstico é Limpada e Populada * Como o Empilhamento da Área de Diagnóstico Funciona * Variáveis de Sistema Relacionadas à Área de Diagnóstico

##### Estrutura da Área de Diagnóstico

A área de diagnóstico contém dois tipos de informações:

* Informações de declaração, como o número de condições que ocorreram ou o número de linhas afetadas.

* Informações sobre a condição, como o código e a mensagem de erro. Se uma declaração levantar várias condições, esta parte da área de diagnóstico tem uma área de condição para cada uma. Se uma declaração não levantar condições, esta parte da área de diagnóstico está vazia.

Para uma declaração que produz três condições, a área de diagnóstico contém informações sobre declaração e condição, como esta:

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

##### Informações sobre a área de diagnóstico

A área de diagnóstico contém itens de informações de declaração e condição. Os itens numéricos são inteiros. O conjunto de caracteres para itens de caracteres é UTF-8. Nenhum item pode ser `NULL`. Se um item de declaração ou condição não for definido por uma declaração que preencha a área de diagnóstico, seu valor é 0 ou a string vazia, dependendo do tipo de dados do item.

A parte de informações de declaração da área de diagnóstico contém esses itens:

* `NUMBER`: Um número inteiro que indica o número de áreas de condição que possuem informações.

* `ROW_COUNT`: Um número inteiro que indica o número de linhas afetadas pela declaração. `ROW_COUNT` tem o mesmo valor que a função `ROW_COUNT()` (ver Seção 14.15, “Funções de Informação”).

A parte de informações de condição da área de diagnóstico contém uma área de condição para cada condição. As áreas de condição são numeradas de 1 até o valor do item de condição da declaração `NUMBER`. Se `NUMBER` for 0, não há áreas de condição.

Cada área de condição contém os itens da lista a seguir. Todos os itens são padrões do SQL, exceto `MYSQL_ERRNO`, que é uma extensão do MySQL. As definições se aplicam a condições geradas de outra forma que não por um sinal (ou seja, por uma declaração `SIGNAL` ou `RESIGNAL`). Para condições não sinalizadas, o MySQL preenche apenas os itens de condição que não são descritos como sempre vazios. Os efeitos dos sinais na área de condição são descritos mais adiante.

* `CLASS_ORIGIN`: Uma cadeia que contém a classe do valor `RETURNED_SQLSTATE`. Se o valor `RETURNED_SQLSTATE` começar com um valor de classe definido nos documentos de padrões SQL ISO 975-2 (seção 24.1, SQLSTATE), `CLASS_ORIGIN` é `'ISO 9075'`. Caso contrário, `CLASS_ORIGIN` é `'MySQL'`.

* `SUBCLASS_ORIGIN`: Uma cadeia que contém a subclasse do valor `RETURNED_SQLSTATE`. Se `CLASS_ORIGIN` for `'ISO 9075'` ou `RETURNED_SQLSTATE` e terminar com `'000'`, `SUBCLASS_ORIGIN` é `'ISO 9075'`. Caso contrário, `SUBCLASS_ORIGIN` é `'MySQL'`.

* `RETURNED_SQLSTATE`: Uma cadeia que indica o valor `SQLSTATE` para a condição.

* `MESSAGE_TEXT`: Uma string que indica a mensagem de erro para a condição.

* `MYSQL_ERRNO`: Um número inteiro que indica o código de erro do MySQL para a condição.

* `CONSTRAINT_CATALOG`, `CONSTRAINT_SCHEMA`, `CONSTRAINT_NAME`: Strings que indicam o catálogo, o esquema e o nome para uma restrição violada. Elas são sempre vazias.

* `CATALOG_NAME`, `SCHEMA_NAME`, `TABLE_NAME`, `COLUMN_NAME`: Strings que indicam o catálogo, o esquema, a tabela e a coluna relacionadas à condição. Elas são sempre vazias.

* `CURSOR_NAME`: Uma cadeia que indica o nome do cursor. Isso é sempre vazio.

Para os valores `RETURNED_SQLSTATE`, `MESSAGE_TEXT` e `MYSQL_ERRNO` para erros específicos, consulte a Referência de Mensagem de Erro do Servidor.

Se uma declaração `SIGNAL` (ou `RESIGNAL`) preencher a área de diagnóstico, sua cláusula `SET` pode atribuir a qualquer item de informação de condição, exceto `RETURNED_SQLSTATE`, qualquer valor que seja legal para o tipo de dados do item. `SIGNAL` também define o valor de `RETURNED_SQLSTATE`, mas não diretamente em sua cláusula `SET`. Esse valor vem do argumento `SIGNAL` da declaração `SQLSTATE`.

`SIGNAL` também define itens de informações de declaração. Define `NUMBER` para 1. Define `ROW_COUNT` para −1 para erros e 0 de outra forma.

##### Como a Área de Diagnóstico é Limpada e Populada

As instruções SQL não diagnósticas preenchem a área de diagnóstico automaticamente, e seu conteúdo pode ser definido explicitamente com as instruções `SIGNAL` e `RESIGNAL`. A área de diagnóstico pode ser examinada com [`GET DIAGNOSTICS`](get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") para extrair itens específicos, ou com `SHOW WARNINGS` ou `SHOW ERRORS` para ver condições ou erros.

As instruções SQL definem e definem a área de diagnóstico da seguinte forma:

* Quando o servidor começa a executar uma declaração após analisá-la, ele limpa a área de diagnóstico para declarações não diagnósticas. As declarações diagnósticas não limpam a área de diagnóstico. Essas declarações são diagnósticas:

+ `GET DIAGNOSTICS`
  + `SHOW ERRORS`
  + `SHOW WARNINGS` * Se uma declaração levantar uma condição, a área de diagnóstico é limpa das condições que pertencem a declarações anteriores. A exceção é que as condições levantadas por `GET DIAGNOSTICS` e `RESIGNAL` são adicionadas à área de diagnóstico sem ser limpa.

Assim, mesmo uma declaração que normalmente não limpa a área de diagnóstico quando começa a ser executada, a limpa se a declaração gerar uma condição.

O exemplo a seguir mostra o efeito de várias declarações na área de diagnóstico, usando `SHOW WARNINGS`(show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") para exibir informações sobre as condições armazenadas lá.

Esta declaração `DROP TABLE` limpa a área de diagnóstico e a preenche quando a condição ocorre:

```
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------+
| Level | Code | Message                            |
+-------+------+------------------------------------+
| Note  | 1051 | Unknown table 'test.no_such_table' |
+-------+------+------------------------------------+
1 row in set (0.00 sec)
```

Essa declaração `SET` gera um erro, então ela limpa e preenche a área de diagnóstico:

```
mysql> SET @x = @@x;
ERROR 1193 (HY000): Unknown system variable 'x'

mysql> SHOW WARNINGS;
+-------+------+-----------------------------+
| Level | Code | Message                     |
+-------+------+-----------------------------+
| Error | 1193 | Unknown system variable 'x' |
+-------+------+-----------------------------+
1 row in set (0.00 sec)
```

A declaração anterior `SET` produziu uma única condição, portanto, 1 é o único número de condição válido para [`GET DIAGNOSTICS`](get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") neste ponto. A declaração seguinte usa um número de condição de 2, que produz um aviso que é adicionado à área de diagnóstico sem ser apagado:

```
mysql> GET DIAGNOSTICS CONDITION 2 @p = MESSAGE_TEXT;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------+
| Level | Code | Message                      |
+-------+------+------------------------------+
| Error | 1193 | Unknown system variable 'xx' |
| Error | 1753 | Invalid condition number     |
+-------+------+------------------------------+
2 rows in set (0.00 sec)
```

Agora, há duas condições na área de diagnóstico, então a mesma declaração `GET DIAGNOSTICS` é válida:

```
mysql> GET DIAGNOSTICS CONDITION 2 @p = MESSAGE_TEXT;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @p;
+--------------------------+
| @p                       |
+--------------------------+
| Invalid condition number |
+--------------------------+
1 row in set (0.01 sec)
```

##### Como funciona o Stack da Área de Diagnóstico

Quando ocorre um empurrão para a pilha da área de diagnóstico, a primeira (atual) área de diagnóstico se torna a segunda (empilhada) área de diagnóstico e uma nova área de diagnóstico atual é criada como uma cópia dela. As áreas de diagnóstico são empurradas para a pilha e removidas dela sob as seguintes circunstâncias:

* Execução de um programa armazenado

Uma empurrada ocorre antes de o programa ser executado e uma explosão ocorre depois. Se o programa armazenado terminar enquanto os manipuladores estão sendo executados, pode haver mais de uma área de diagnóstico para ser expulsa; isso ocorre devido a uma exceção para a qual não há manipuladores apropriados ou devido a `RETURN` no manipulador.

Quaisquer condições de alerta ou erro nas áreas de diagnóstico exibidas são então adicionadas à área de diagnóstico atual, exceto que, para os gatilhos, apenas os erros são adicionados. Quando o programa armazenado termina, o chamador vê essas condições em sua área de diagnóstico atual.

* Execução de um manipulador de condição dentro de um programa armazenado

Quando uma empurrada ocorre como resultado da ativação do manipulador de condições, a área de diagnóstico empilhada é a área que estava atual dentro do programa armazenado antes da empurrada. A nova área de diagnóstico atual é a área de diagnóstico atual do manipulador. `GET [CURRENT] DIAGNOSTICS` (get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") e `GET STACKED DIAGNOSTICS` (get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") podem ser usados dentro do manipulador para acessar os conteúdos das áreas de diagnóstico atuais (manipulador) e empilhadas (programa armazenado). Inicialmente, eles retornam o mesmo resultado, mas as declarações que são executadas dentro do manipulador modificam a área de diagnóstico atual, apagando e definindo seus conteúdos de acordo com as regras normais (veja Como a Área de Diagnóstico é Apagada e Populada). A área de diagnóstico empilhada não pode ser modificada por declarações que são executadas dentro do manipulador, exceto `RESIGNAL`.

Se o manipulador for executado com sucesso, a área de diagnóstico atual (manipulador) é eliminada e a área de diagnóstico empilhada (programa armazenado) volta a se tornar a área de diagnóstico atual. As condições adicionadas à área de diagnóstico do manipulador durante a execução do manipulador são adicionadas à área de diagnóstico atual.

* Execução de `RESIGNAL`

A declaração `RESIGNAL` transfere as informações sobre a condição de erro que estão disponíveis durante a execução de um manipulador de condição dentro de uma declaração composta dentro de um programa armazenado. `RESIGNAL` pode alterar algumas ou todas as informações antes de transmiti-las, modificando a pilha de diagnóstico conforme descrito na Seção 15.6.7.4, "Declaração RESIGNAL".

##### Área de Diagnóstico - Variáveis do Sistema Relacionadas

Algumas variáveis do sistema controlam ou estão relacionadas a alguns aspectos da área de diagnóstico:

* `max_error_count` controla o número de áreas de condição na área de diagnóstico. Se ocorrerem mais condições do que essa, o MySQL descarta silenciosamente as informações para as condições em excesso. (As condições adicionadas por `RESIGNAL` são sempre adicionadas, com condições mais antigas sendo descartadas conforme necessário para fazer espaço.)

* `warning_count` indica o número de condições que ocorreram. Isso inclui erros, avisos e notas. Normalmente, `NUMBER` e `warning_count` são os mesmos. No entanto, à medida que o número de condições geradas excede `max_error_count`, o valor de `warning_count` continua a aumentar, enquanto `NUMBER` permanece limitado a `max_error_count`, porque não são armazenadas condições adicionais na área de diagnóstico.

* `error_count` indica o número de erros que ocorreram. Esse valor inclui condições de "não encontrado" e exceções, mas exclui avisos e notas. Assim como `warning_count`, seu valor pode exceder `max_error_count`.

* Se a variável de sistema `sql_notes` estiver definida como 0, as notas não são armazenadas e não incrementam `warning_count`.

Exemplo: Se `max_error_count` é 10, a área de diagnóstico pode conter um máximo de 10 áreas de condição. Suponha que uma declaração gere 20 condições, das quais 12 são erros. Nesse caso, a área de diagnóstico contém as primeiras 10 condições, `NUMBER` é 10, `warning_count` é 20 e `error_count` é 12.

As alterações no valor de `max_error_count` não têm efeito até a próxima tentativa de modificar a área de diagnóstico. Se a área de diagnóstico contiver 10 áreas de condição e `max_error_count` estiver definido como 5, isso não tem efeito imediato no tamanho ou no conteúdo da área de diagnóstico.

#### 15.6.7.8 Tratamento de condições e parâmetros OUT ou INOUT

Se um procedimento armazenado sair com uma exceção não controlada, os valores modificados dos parâmetros `OUT` e `INOUT` não são propagados de volta ao chamador.

Se uma exceção for tratada por um manipulador `CONTINUE` ou `EXIT` que contém uma declaração `RESIGNAL`, a execução de `RESIGNAL` empurra a pilha da Área de Diagnóstico, sinalizando assim a exceção (ou seja, as informações que existiam antes da entrada no manipulador). Se a exceção for um erro, os valores dos parâmetros `OUT` e `INOUT` não são propagados de volta ao chamador.

### 15.6.8 Restrições sobre o manuseio de condições

`SIGNAL`, `RESIGNAL` e `GET DIAGNOSTICS` não são permitidos como declarações preparadas. Por exemplo, esta declaração é inválida:

```
PREPARE stmt1 FROM 'SIGNAL SQLSTATE "02000"';
```

Os valores de `SQLSTATE` na classe `'04'` não são tratados de forma especial. Eles são tratados da mesma forma que outras exceções.

No SQL padrão, a primeira condição se relaciona ao valor `SQLSTATE` retornado para a declaração SQL anterior. No MySQL, isso não é garantido, então para obter o erro principal, você não pode fazer isso:

```
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Em vez disso, faça isso:

```
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```
