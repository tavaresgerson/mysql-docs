## 15.2 Declarações de manipulação de dados

### 15.2.1 Declaração CALL

```
CALL sp_name([parameter[,...]])
CALL sp_name[()]
```

A declaração `CALL` invoca um procedimento armazenado que foi definido anteriormente com `CREATE PROCEDURE`.

Procedimentos armazenados que não aceitam argumentos podem ser invocados sem parênteses. Ou seja, `CALL p()` e `CALL p` são equivalentes.

`CALL` pode transmitir valores de volta para seu chamador usando parâmetros que são declarados como parâmetros `OUT` ou `INOUT`. Quando o procedimento retornar, um programa cliente também pode obter o número de linhas afetadas para a declaração final executada dentro da rotina: No nível SQL, chame a função `ROW_COUNT()`; a partir da API C, chame a função `mysql_affected_rows()`.

Para informações sobre o efeito das condições não tratadas nos parâmetros do procedimento, consulte a Seção 15.6.7.8, “Tratamento de condições e parâmetros OUT ou INOUT”.

Para obter um valor de um procedimento usando um parâmetro `OUT` ou `INOUT`, passe o parâmetro por meio de uma variável do usuário e, em seguida, verifique o valor da variável após o procedimento retornar. (Se você estiver chamando o procedimento de outro procedimento armazenado ou função armazenada, também pode passar um parâmetro de rotina ou uma variável de rotina local como um parâmetro `IN` ou `INOUT`. Para um parâmetro `INOUT`, inicialize seu valor antes de passá-lo ao procedimento. O procedimento a seguir tem um parâmetro `OUT` que o procedimento define para a versão atual do servidor e um valor `INOUT` que o procedimento incrementa em um de seu valor atual:

```
DELIMITER //

CREATE PROCEDURE p (OUT ver_param VARCHAR(25), INOUT incr_param INT)
BEGIN
  # Set value of OUT parameter
  SELECT VERSION() INTO ver_param;
  # Increment value of INOUT parameter
  SET incr_param = incr_param + 1;
END //

DELIMITER ;
```

Antes de chamar o procedimento, inicialize a variável que será passada como o parâmetro `INOUT`. Após chamar o procedimento, você pode ver que os valores das duas variáveis são definidos ou modificados:

```
mysql> SET @increment = 10;
mysql> CALL p(@version, @increment);
mysql> SELECT @version, @increment;
+----------+------------+
| @version | @increment |
+----------+------------+
| 8.0.44   |         11 |
+----------+------------+
```

Em declarações preparadas `CALL` usadas com `PREPARE` e `EXECUTE`, os marcadores podem ser usados para os parâmetros `IN`, `OUT` e `INOUT`. Esses tipos de parâmetros podem ser usados da seguinte forma:

```
mysql> SET @increment = 10;
mysql> PREPARE s FROM 'CALL p(?, ?)';
mysql> EXECUTE s USING @version, @increment;
mysql> SELECT @version, @increment;
+----------+------------+
| @version | @increment |
+----------+------------+
| 8.0.44   |         11 |
+----------+------------+
```

Para escrever programas em C que utilizam a instrução SQL `CALL` para executar procedimentos armazenados que produzem conjuntos de resultados, a bandeira `CLIENT_MULTI_RESULTS` deve ser habilitada. Isso ocorre porque cada `CALL` retorna um resultado para indicar o status da chamada, além de quaisquer conjuntos de resultados que possam ser retornados por declarações executadas dentro do procedimento. `CLIENT_MULTI_RESULTS` também deve ser habilitado se `CALL` for usado para executar qualquer procedimento armazenado que contenha declarações preparadas. Não pode ser determinado quando tal procedimento é carregado se essas declarações produzem conjuntos de resultados, então é necessário assumir que elas o fazem.

`CLIENT_MULTI_RESULTS` pode ser habilitado quando você chama `mysql_real_connect()`, explicitamente passando a própria bandeira `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (que também habilita `CLIENT_MULTI_RESULTS`). `CLIENT_MULTI_RESULTS` é habilitado por padrão.

Para processar o resultado de uma declaração `CALL` executada usando `mysql_query()` ou `mysql_real_query()`, use um loop que chame `mysql_next_result()` para determinar se há mais resultados. Para um exemplo, veja Suporte à execução de múltiplas declarações.

Os programas em C podem usar a interface de declaração preparada para executar as declarações `CALL` e acessar os parâmetros `OUT` e `INOUT`. Isso é feito processando o resultado de uma declaração `CALL` usando um loop que chama `mysql_stmt_next_result()` para determinar se há mais resultados. Para um exemplo, veja Suporte a Declaração CALL Preparada. Linguagens que fornecem uma interface MySQL podem usar declarações preparadas `CALL` para recuperar diretamente os parâmetros de procedimento `OUT` e `INOUT`.

Alterações de metadados em objetos referenciados por programas armazenados são detectadas e causam a reparsa automática das declarações afetadas quando o programa é executado novamente. Para mais informações, consulte a Seção 10.10.3, “Cache de Declarações Preparadas e Programas Armazenados”.

### 15.2.2 Declaração DELETE

`DELETE` é uma declaração DML que remove linhas de uma tabela.

Uma declaração `DELETE` pode começar com uma cláusula `WITH`") para definir expressões de tabela comuns acessíveis dentro do `DELETE`. Veja a Seção 15.2.20, “COM (Expressões de Tabela Comuns”)”).

#### Sintaxe de tabela única

```
DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name [[AS] tbl_alias]
    [PARTITION (partition_name [, partition_name] ...)]
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]
```

A declaração `DELETE` exclui linhas de *`tbl_name`* e retorna o número de linhas excluídas. Para verificar o número de linhas excluídas, chame a função `ROW_COUNT()` descrita na Seção 14.15, “Funções de Informação”.

#### Cláusulas Principais

As condições na cláusula opcional `WHERE` identificam quais linhas devem ser excluídas. Sem a cláusula `WHERE`, todas as linhas são excluídas.

*`where_condition`* é uma expressão que avalia como verdadeira para cada linha que será excluída. É especificado conforme descrito na Seção 15.2.13, "Instrução SELECT".

Se a cláusula `ORDER BY` for especificada, as linhas serão excluídas na ordem especificada. A cláusula `LIMIT` estabelece um limite para o número de linhas que podem ser excluídas. Essas cláusulas se aplicam a excluíções de uma única tabela, mas não a excluíções de várias tabelas.

#### Sintaxe de Tabela Múltipla

```
DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    tbl_name[.*] [, tbl_name[.*]] ...
    FROM table_references
    [WHERE where_condition]

DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
    FROM tbl_name[.*] [, tbl_name[.*]] ...
    USING table_references
    [WHERE where_condition]
```

#### Privilegios

Você precisa do privilégio `DELETE` em uma tabela para excluí-la. Você precisa apenas do privilégio `SELECT` para quaisquer colunas que sejam apenas de leitura, como as nomeadas na cláusula `WHERE`.

#### Desempenho

Quando você não precisa saber o número de linhas excluídas, a declaração `TRUNCATE TABLE` é uma maneira mais rápida de esvaziar uma tabela do que uma declaração `DELETE` sem a cláusula `WHERE`. Ao contrário de `DELETE`, `TRUNCATE TABLE` não pode ser usado dentro de uma transação ou se você tiver um bloqueio na tabela. Veja Seção 15.1.37, “Declaração TRUNCATE TABLE” e Seção 15.3.6, “Declarações LOCK TABLES e UNLOCK TABLES”.

A velocidade das operações de exclusão também pode ser afetada por fatores discutidos na Seção 10.2.5.3, “Otimizando declarações DELETE”.

Para garantir que uma declaração específica do `DELETE` não leve muito tempo, a cláusula específica do MySQL do `LIMIT row_count` para o `DELETE` especifica o número máximo de linhas a serem excluídas. Se o número de linhas a serem excluídas for maior que o limite, repita a declaração do `DELETE` até que o número de linhas afetadas seja menor que o valor do `LIMIT`.

#### Subconsultas

Você não pode excluir de uma tabela e selecionar da mesma tabela em uma subconsulta.

#### Suporte para Tabela Partida

`DELETE` suporta a seleção explícita de partições usando a cláusula `PARTITION`, que recebe uma lista de nomes separados por vírgula de uma ou mais partições ou subpartições (ou ambas) das quais selecionar as linhas a serem excluídas. Partições não incluídas na lista são ignoradas. Dado uma tabela particionada `t` com uma partição denominada `p0`, a execução da declaração `DELETE FROM t PARTITION (p0)` tem o mesmo efeito na tabela que a execução de [`ALTER TABLE t TRUNCATE PARTITION (p0)`(alter-table.html "15.1.9 ALTER TABLE Statement")]; em ambos os casos, todas as linhas na partição `p0` são excluídas.

`PARTITION` pode ser usado juntamente com uma condição `WHERE`, nesse caso, a condição é testada apenas nas linhas das partições listadas. Por exemplo, `DELETE FROM t PARTITION (p0) WHERE c < 5` exclui linhas apenas da partição `p0` para a qual a condição `c < 5` é verdadeira; as linhas de qualquer outra partição não são verificadas e, portanto, não são afetadas pelo `DELETE`.

A cláusula `PARTITION` também pode ser usada em declarações `DELETE` de múltiplas tabelas. Você pode usar até uma dessas opções por tabela nomeada na opção `FROM`.

Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partição”.

#### Colunas de Auto-Incremento

Se você excluir a linha que contém o valor máximo para uma coluna de `AUTO_INCREMENT`, o valor não será reutilizado para uma tabela de `MyISAM` ou `InnoDB`. Se você excluir todas as linhas da tabela com `DELETE FROM tbl_name` (sem a cláusula `WHERE` em modo `autocommit`, a sequência será refeita para todos os motores de armazenamento, exceto `InnoDB` e `MyISAM`. Há algumas exceções a esse comportamento para tabelas de `InnoDB`, conforme discutido na Seção 17.6.1.6, “Tratamento de AUTO_INCREMENT em InnoDB”.

Para as tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma chave de múltiplos campos. Nesse caso, a reutilização de valores excluídos do topo da sequência ocorre mesmo para as tabelas `MyISAM`. Veja a Seção 5.6.9, “Usando AUTO_INCREMENT”.

#### Modificadores

A declaração `DELETE` suporta os seguintes modificadores:

* Se você especificar o modificador `LOW_PRIORITY`, o servidor adiará a execução do `DELETE` até que nenhum outro cliente esteja lendo a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* Para as tabelas `MyISAM`, se você usar o modificador `QUICK`, o mecanismo de armazenamento não mescla folhas de índice durante a exclusão, o que pode acelerar alguns tipos de operações de exclusão.

* O modificador `IGNORE` faz com que o MySQL ignore erros ignoráveis durante o processo de exclusão de linhas. (Os erros encontrados durante a fase de análise são processados da maneira usual.) Erros que são ignorados devido ao uso de `IGNORE` são retornados como avisos. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

#### Ordem de Deleção

Se a declaração `DELETE` incluir uma cláusula `ORDER BY`, as linhas são excluídas na ordem especificada pela cláusula. Isso é útil principalmente em conjunto com `LIMIT`. Por exemplo, a seguinte declaração encontra linhas que correspondem à cláusula `WHERE`, as ordena por `timestamp_column` e exclui a primeira (mais antiga):

```
DELETE FROM somelog WHERE user = 'jcole'
ORDER BY timestamp_column LIMIT 1;
```

`ORDER BY` também ajuda a excluir linhas em uma ordem necessária para evitar violações de integridade referencial.

#### Tabelas InnoDB

Se você está excluindo muitas linhas de uma tabela grande, pode exceder o tamanho da tabela de bloqueio para uma tabela `InnoDB`. Para evitar esse problema, ou simplesmente para minimizar o tempo que a tabela permanece bloqueada, a seguinte estratégia (que não usa `DELETE` de forma alguma) pode ser útil:

1. Selecione as linhas *que não* devem ser excluídas em uma tabela vazia que tenha a mesma estrutura que a tabela original:

   ```
   INSERT INTO t_copy SELECT * FROM t WHERE ... ;
   ```

2. Use `RENAME TABLE` para mover a tabela original de forma atômica e renomear a cópia para o nome original:

   ```
   RENAME TABLE t TO t_old, t_copy TO t;
   ```

3. Descarte a tabela original:

   ```
   DROP TABLE t_old;
   ```

Nenhuma outra sessão pode acessar as tabelas envolvidas enquanto o `RENAME TABLE` está sendo executado, portanto, a operação de renomeação não está sujeita a problemas de concorrência. Veja a Seção 15.1.36, “Instrução RENAME TABLE”.

#### Tabelas MyISAM

Nas tabelas `MyISAM`, as linhas excluídas são mantidas em uma lista vinculada e as operações subsequentes `INSERT` reutilizam as posições de linha antigas. Para recuperar o espaço não utilizado e reduzir os tamanhos dos arquivos, use a declaração `OPTIMIZE TABLE` ou o utilitário **myisamchk** para reorganizar as tabelas. `OPTIMIZE TABLE` é mais fácil de usar, mas **myisamchk** é mais rápido. Veja a Seção 15.7.3.4, “Declaração OPTIMIZE TABLE”, e a Seção 6.6.4, “myisamchk — Utilitário de manutenção de tabelas MyISAM”.

O modificador `QUICK` afeta se as folhas de índice são unidas para operações de exclusão. `DELETE QUICK` é mais útil para aplicações onde os valores do índice para as linhas excluídas são substituídos por valores semelhantes de índice de linhas inseridas posteriormente. Nesse caso, os buracos deixados pelos valores excluídos são reutilizados.

`DELETE QUICK` não é útil quando os valores excluídos levam a blocos de índice com valores incompletos que abrangem uma faixa de valores de índice para os quais novos insertos ocorrem novamente. Neste caso, o uso de `QUICK` pode resultar em espaço desperdiçado no índice que permanece não recuperado. Aqui está um exemplo de tal cenário:

1. Crie uma tabela que contenha uma coluna indexada `AUTO_INCREMENT`.

2. Insira muitas linhas na tabela. Cada inserção resulta em um valor de índice que é adicionado à extremidade alta do índice.

3. Exclua um bloco de linhas na extremidade inferior da faixa de colunas usando `DELETE QUICK`.

Nesse cenário, os blocos de índice associados aos valores de índice excluídos ficam subcheios, mas não são mesclados com outros blocos de índice devido ao uso de `QUICK`. Eles permanecem subcheios quando ocorrem novas inserções, porque as novas linhas não têm valores de índice na faixa excluída. Além disso, eles permanecem subcheios mesmo se você usar posteriormente `DELETE` sem `QUICK`, a menos que alguns dos valores de índice excluídos aconteçam a cair em blocos de índice dentro ou adjacentes aos blocos subcheios. Para recuperar espaço de índice não utilizado nessas circunstâncias, use `OPTIMIZE TABLE`.

Se você vai excluir muitas linhas de uma tabela, pode ser mais rápido usar `DELETE QUICK` seguido por `OPTIMIZE TABLE`. Isso reconstrui o índice em vez de realizar muitas operações de fusão de blocos de índice.

#### Excluições de mesa múltipla

Você pode especificar várias tabelas em uma declaração `DELETE` para excluir linhas de uma ou mais tabelas, dependendo da condição na cláusula `WHERE`. Não é possível usar `ORDER BY` ou `LIMIT` em uma declaração multitabela `DELETE`. A cláusula *`table_references`* lista as tabelas envolvidas na junção, conforme descrito na Seção 15.2.13.2, “Cláusula de JUNÇÃO”.

Para a primeira sintaxe de múltiplas tabelas, apenas as linhas que correspondem às tabelas listadas antes da cláusula `FROM` são excluídas. Para a segunda sintaxe de múltiplas tabelas, apenas as linhas que correspondem às tabelas listadas na cláusula `FROM` (antes da cláusula `USING`) são excluídas. O efeito é que você pode excluir linhas de muitas tabelas ao mesmo tempo e ter tabelas adicionais que são usadas apenas para pesquisa:

```
DELETE t1, t2 FROM t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Ou:

```
DELETE FROM t1, t2 USING t1 INNER JOIN t2 INNER JOIN t3
WHERE t1.id=t2.id AND t2.id=t3.id;
```

Essas declarações utilizam todas as três tabelas ao pesquisar linhas para excluir, mas exclui as linhas correspondentes apenas das tabelas `t1` e `t2`.

Os exemplos anteriores usam `INNER JOIN`, mas as declarações de junção múltipla `DELETE` podem usar outros tipos de junção permitidos nas declarações de `SELECT`, como `LEFT JOIN`. Por exemplo, para excluir linhas que existem em `t1` que não têm correspondência em `t2`, use uma `LEFT JOIN`:

```
DELETE t1 FROM t1 LEFT JOIN t2 ON t1.id=t2.id WHERE t2.id IS NULL;
```

A sintaxe permite `.*` após cada *`tbl_name`* para compatibilidade com o **Access**.

Se você usar uma declaração múltipla `DELETE` envolvendo tabelas `InnoDB` para as quais existem restrições de chave estrangeira, o otimizador do MySQL pode processar as tabelas em uma ordem que difere daquela de sua relação pai/filho. Neste caso, a declaração falha e é revertida. Em vez disso, você deve excluir de uma única tabela e confiar nas capacidades da `ON DELETE` que a `InnoDB` fornece para fazer com que as outras tabelas sejam modificadas conforme necessário.

Nota

Se você declarar um alias para uma tabela, você deve usar o alias ao se referir à tabela:

```
DELETE t1 FROM test AS t1, test2 WHERE ...
```

Os aliases de tabela em uma tabela múltipla `DELETE` devem ser declarados apenas na parte *`table_references`* da declaração. Em outros lugares, as referências de alias são permitidas, mas não as declarações de alias.

Correto:

```
DELETE a1, a2 FROM t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;

DELETE FROM a1, a2 USING t1 AS a1 INNER JOIN t2 AS a2
WHERE a1.id=a2.id;
```

Incorreto:

```
DELETE t1 AS a1, t2 AS a2 FROM t1 INNER JOIN t2
WHERE a1.id=a2.id;

DELETE FROM t1 AS a1, t2 AS a2 USING t1 INNER JOIN t2
WHERE a1.id=a2.id;
```

Os aliases de tabela também são suportados para declarações `DELETE` de tabela única que começam com o MySQL 8.0.16. (Bug #89410, Bug #27455809)

### 15.2.3 Declaração DO

```
DO expr [, expr] ...
```

`DO` executa as expressões, mas não retorna nenhum resultado. Na maioria dos aspectos, `DO` é uma abreviação de `SELECT expr, ...`, mas tem a vantagem de ser um pouco mais rápido quando você não se importa com o resultado.

`DO` é útil principalmente com funções que têm efeitos colaterais, como `RELEASE_LOCK()`.

Exemplo: Esta declaração `SELECT` pausa, mas também produz um conjunto de resultados:

```
mysql> SELECT SLEEP(5);
+----------+
| SLEEP(5) |
+----------+
|        0 |
+----------+
1 row in set (5.02 sec)
```

`DO`, por outro lado, pára sem produzir um conjunto de resultados.:

```
mysql> DO SLEEP(5);
Query OK, 0 rows affected (4.99 sec)
```

Isso pode ser útil, por exemplo, em uma função ou gatilho armazenado, que proíbem declarações que produzem conjuntos de resultados.

`DO` executa apenas expressões. Não pode ser usado em todos os casos em que `SELECT` pode ser usado. Por exemplo, `DO id FROM t1` é inválido porque faz referência a uma tabela.

### 15.2.4 Cláusula de Exceção

```
query_expression_body EXCEPT [ALL | DISTINCT] query_expression_body
    [EXCEPT [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

`EXCEPT` limita o resultado do primeiro bloco de consulta aos registros que também não são encontrados no segundo. Assim como em `UNION` e `INTERSECT`, qualquer um dos blocos de consulta pode utilizar qualquer um dos `SELECT`, `TABLE` ou `VALUES`. Um exemplo que utiliza as tabelas `a`, `b` e `c`, definidas na Seção 15.2.8, "Cláusula INTERSECT", é mostrado aqui:

```
mysql> TABLE a EXCEPT TABLE b;
+------+------+
| m    | n    |
+------+------+
|    2 |    3 |
+------+------+
1 row in set (0.00 sec)

mysql> TABLE a EXCEPT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    2 |    3 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE b EXCEPT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
+------+------+
1 row in set (0.00 sec)
```

Assim como em `UNION` e `INTERSECT`, se nem `DISTINCT` nem `ALL` for especificado, o padrão é `DISTINCT`.

`DISTINCT` remove duplicatas encontradas em ambos os lados da relação, como mostrado aqui:

```
mysql> TABLE c EXCEPT DISTINCT TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
+------+------+
1 row in set (0.00 sec)

mysql> TABLE c EXCEPT ALL TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    1 |    3 |
+------+------+
2 rows in set (0.00 sec)
```

(A primeira declaração tem o mesmo efeito que `TABLE c EXCEPT TABLE a`.)

Ao contrário de `UNION` ou `INTERSECT`, `EXCEPT` *não* é comutativo — ou seja, o resultado depende da ordem dos operandos, como mostrado aqui:

```
mysql> TABLE a EXCEPT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    2 |    3 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE c EXCEPT TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
+------+------+
1 row in set (0.00 sec)
```

Assim como em `UNION`, os conjuntos de resultados a serem comparados devem ter o mesmo número de colunas. Os tipos de colunas do conjunto de resultados também são determinados como para `UNION`.

`EXCEPT` foi adicionado no MySQL 8.0.31.

### 15.2.5 Declaração do Gestor

```
HANDLER tbl_name OPEN [ [AS] alias]

HANDLER tbl_name READ index_name { = | <= | >= | < | > } (value1,value2,...)
    [ WHERE where_condition ] [LIMIT ... ]
HANDLER tbl_name READ index_name { FIRST | NEXT | PREV | LAST }
    [ WHERE where_condition ] [LIMIT ... ]
HANDLER tbl_name READ { FIRST | NEXT }
    [ WHERE where_condition ] [LIMIT ... ]

HANDLER tbl_name CLOSE
```

A declaração `HANDLER` fornece acesso direto às interfaces do motor de armazenamento de tabela. Está disponível para as tabelas `InnoDB` e `MyISAM`.

A declaração `HANDLER ... OPEN` abre uma tabela, tornando-a acessível usando declarações subsequentes `HANDLER ... READ`. Esse objeto de tabela não é compartilhado por outras sessões e não é fechado até que a sessão chame `HANDLER ... CLOSE` ou a sessão termine.

Se você abrir a tabela usando um alias, referências adicionais à tabela aberta com outras declarações `HANDLER` devem usar o alias em vez do nome da tabela. Se você não usar um alias, mas abrir a tabela usando um nome de tabela qualificado pelo nome do banco de dados, referências adicionais devem usar o nome da tabela não qualificada. Por exemplo, para uma tabela aberta usando `mydb.mytable`, referências adicionais devem usar `mytable`.

A sintaxe `HANDLER ... READ` recupera uma linha onde o índice especificado satisfaz os valores fornecidos e a condição `WHERE` é atendida. Se você tiver um índice de múltiplas colunas, especifique os valores da coluna do índice como uma lista de valores separados por vírgula. Especifique valores para todas as colunas do índice ou especifique valores para um prefixo da esquerda das colunas do índice. Suponha que um índice `my_idx` inclua três colunas com os nomes `col_a`, `col_b` e `col_c`, nessa ordem. A declaração `HANDLER` pode especificar valores para todas as três colunas do índice ou para as colunas em um prefixo da esquerda. Por exemplo:

```
HANDLER ... READ my_idx = (col_a_val,col_b_val,col_c_val) ...
HANDLER ... READ my_idx = (col_a_val,col_b_val) ...
HANDLER ... READ my_idx = (col_a_val) ...
```

Para utilizar a interface `HANDLER` para referenciar a tabela `PRIMARY KEY`, use o identificador citado `` `PRIMARY` ``:

```
HANDLER tbl_name READ `PRIMARY` ...
```

A segunda sintaxe `HANDLER ... READ` recupera uma linha da tabela em ordem de índice que corresponde à condição `WHERE`.

A sintaxe do terceiro `HANDLER ... READ` recupera uma linha da tabela em ordem natural de linha que corresponde à condição do `WHERE`. É mais rápido do que o `HANDLER tbl_name READ index_name` quando se deseja uma varredura completa da tabela. A ordem natural de linha é a ordem em que as linhas são armazenadas em um arquivo de dados de tabela do `MyISAM`. Esta declaração também funciona para tabelas do `InnoDB`, mas não há tal conceito porque não há um arquivo de dados separado.

Sem uma cláusula `LIMIT`, todas as formas de `HANDLER ... READ` buscam uma única linha se estiver disponível. Para retornar um número específico de linhas, inclua uma cláusula `LIMIT`. Tem a mesma sintaxe que para a declaração `SELECT`. Veja a Seção 15.2.13, “Declaração SELECT”.

`HANDLER ... CLOSE` fecha uma tabela que foi aberta com `HANDLER ... OPEN`.

Há várias razões para usar a interface `HANDLER` em vez das declarações normais `SELECT`:

* `HANDLER` é mais rápido do que `SELECT`:

+ Um objeto designado para manipulação de motor de armazenamento é alocado para o `HANDLER ... OPEN`. O objeto é reutilizado para as declarações subsequentes `HANDLER` para essa tabela; ele não precisa ser reiniciado para cada uma.

+ Há menos análise envolvida.  
+ Não há sobrecarga de otimização ou verificação de consultas.  
+ A interface do manipulador não precisa fornecer uma aparência consistente dos dados (por exemplo, leituras sujas são permitidas), então o mecanismo de armazenamento pode usar otimizações que `SELECT` normalmente não permite.

* `HANDLER` facilita a migração para aplicações que utilizam uma interface de baixo nível semelhante à `ISAM`. (Consulte a Seção 17.20, “InnoDB memcached Plugin” para uma maneira alternativa de adaptar aplicações que utilizam o paradigma de armazenamento de chave-valor.)

* `HANDLER` permite que você navegue por um banco de dados de uma maneira que é difícil (ou até impossível) de realizar com `SELECT`. A interface `HANDLER` é uma maneira mais natural de olhar os dados ao trabalhar com aplicativos que fornecem uma interface de usuário interativa para o banco de dados.

`HANDLER` é uma declaração de nível um tanto baixo. Por exemplo, ela não fornece consistência. Isso significa que `HANDLER ... OPEN` *não* tira uma captura de tela da tabela e *não* bloqueia a tabela. Isso significa que, após uma declaração `HANDLER ... OPEN` ser emitida, os dados da tabela podem ser modificados (pela sessão atual ou outras sessões) e essas modificações podem ser apenas parcialmente visíveis para `HANDLER ... NEXT` ou `HANDLER ... PREV` scans.

Um manipulador aberto pode ser fechado e marcado para ser reaberto, nesse caso, o manipulador perde sua posição na tabela. Isso ocorre quando ambas as seguintes circunstâncias são verdadeiras:

* Qualquer sessão executa as instruções `FLUSH TABLES`](flush.html#flush-tables) ou DDL na tabela do manipulador.

* A sessão na qual o manipulador está aberto executa instruções que não utilizam tabelas, como as que utilizam `HANDLER`.

`TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

Se uma tabela foi esvaziada com `FLUSH TABLES tbl_name WITH READ LOCK` e (flush.html#flush-tables-with-read-lock-with-list) foi aberta com `HANDLER`, o manipulador é implicitamente esvaziado e perde sua posição.

### 15.2.6 Declaração de Tabela de IMPORTAÇÃO

```
IMPORT TABLE FROM sdi_file [, sdi_file] ...
```

A declaração `IMPORT TABLE` importa as tabelas `MyISAM` com base nas informações contidas nos arquivos de metadados `.sdi` (informações de dicionário serializadas). A `IMPORT TABLE` requer o privilégio `FILE` para ler os arquivos de conteúdo `.sdi` e tabela, e o privilégio `CREATE` para que a tabela seja criada.

As tabelas podem ser exportadas de um servidor usando **mysqldump** para escrever um arquivo de declarações SQL e importadas em outro servidor usando **mysql** para processar o arquivo de dump. `IMPORT TABLE` oferece uma alternativa mais rápida usando os arquivos de tabela “cru” (raw).

Antes da importação, os arquivos que fornecem o conteúdo da tabela devem ser colocados no diretório apropriado do esquema do servidor de importação, e o arquivo `.sdi` deve estar localizado em um diretório acessível ao servidor. Por exemplo, o arquivo `.sdi` pode ser colocado no diretório nomeado pela variável de sistema `secure_file_priv`, ou (se `secure_file_priv` estiver vazio) em um diretório sob o diretório de dados do servidor.

O exemplo a seguir descreve como exportar as tabelas `MyISAM` chamadas `employees` e `managers` do esquema `hr` de um servidor e importá-las no esquema `hr` de outro servidor. O exemplo utiliza essas suposições (para realizar uma operação semelhante no seu próprio sistema, modifique os nomes dos caminhos conforme apropriado):

* Para o servidor de exportação, *`export_basedir`* representa seu diretório base, e seu diretório de dados é `export_basedir/data`.

* Para o servidor de importação, *`import_basedir`* representa seu diretório base, e seu diretório de dados é `import_basedir/data`.

* Os arquivos de tabela são exportados do servidor de exportação para o diretório `/tmp/export` e este diretório é seguro (não acessível a outros usuários).

* O servidor de importação usa `/tmp/mysql-files` como o diretório nomeado por sua variável de sistema `secure_file_priv`.

Para exportar tabelas do servidor de exportação, use este procedimento:

1. Garanta uma instantânea consistente executando esta declaração para bloquear as tabelas, para que não possam ser modificadas durante a exportação:

   ```
   mysql> FLUSH TABLES hr.employees, hr.managers WITH READ LOCK;
   ```

Enquanto o bloqueio estiver em vigor, as tabelas ainda podem ser usadas, mas apenas para acesso de leitura.

2. No nível do sistema de arquivos, copie os arquivos de conteúdo do `.sdi` e da tabela do diretório do esquema `hr` para o diretório de exportação segura:

* O arquivo `.sdi` está localizado no diretório do esquema `hr`, mas pode não ter exatamente o mesmo nome de base que o nome da tabela. Por exemplo, os arquivos `.sdi` para as tabelas `employees` e `managers` podem ser nomeados `employees_125.sdi` e `managers_238.sdi`.

* Para uma tabela `MyISAM`, os arquivos de conteúdo são seus arquivos de dados `.MYD` e arquivo de índice `.MYI`.

Dadas essas denominações de arquivo, os comandos de cópia são os seguintes:

   ```
   $> cd export_basedir/data/hr
   $> cp employees_125.sdi /tmp/export
   $> cp managers_238.sdi /tmp/export
   $> cp employees.{MYD,MYI} /tmp/export
   $> cp managers.{MYD,MYI} /tmp/export
   ```

3. Desbloqueie as tabelas:

   ```
   mysql> UNLOCK TABLES;
   ```

Para importar tabelas no servidor de importação, use este procedimento:

1. O esquema de importação deve existir. Se necessário, execute esta declaração para criá-lo:

   ```
   mysql> CREATE SCHEMA hr;
   ```

2. No nível do sistema de arquivos, copie os arquivos `.sdi` para o diretório do servidor de importação `secure_file_priv`, `/tmp/mysql-files`. Além disso, copie os arquivos de conteúdo da tabela para o diretório do esquema `hr`:

   ```
   $> cd /tmp/export
   $> cp employees_125.sdi /tmp/mysql-files
   $> cp managers_238.sdi /tmp/mysql-files
   $> cp employees.{MYD,MYI} import_basedir/data/hr
   $> cp managers.{MYD,MYI} import_basedir/data/hr
   ```

3. Importe as tabelas executando uma declaração `IMPORT TABLE` (import-table.html "15.2.6 IMPORT TABLE Statement") que nomeia os arquivos `.sdi`:

   ```
   mysql> IMPORT TABLE FROM
          '/tmp/mysql-files/employees.sdi',
          '/tmp/mysql-files/managers.sdi';
   ```

O arquivo `.sdi` não precisa ser colocado no diretório do servidor de importação nomeado pela variável de sistema `secure_file_priv`, se essa variável estiver vazia; ele pode estar em qualquer diretório acessível ao servidor, incluindo o diretório do esquema da tabela importada. Se o arquivo `.sdi` for colocado nesse diretório, no entanto, ele pode ser reescrito; a operação de importação cria um novo arquivo `.sdi` para a tabela, que sobrescreve o arquivo antigo `.sdi` se a operação usar o mesmo nome de arquivo para o novo arquivo.

Cada valor *`sdi_file`* deve ser uma literal de string que nomeia o arquivo `.sdi` para uma tabela ou é um padrão que corresponde aos arquivos `.sdi`. Se a string for um padrão, qualquer caminho de diretório inicial e o sufixo do nome do arquivo `.sdi` devem ser dados literalmente. Os caracteres de padrão são permitidos apenas na parte do nome de base do nome do arquivo:

* `?` corresponde a qualquer caracter único
* `*` corresponde a qualquer sequência de caracteres, incluindo nenhum caractere

Usando um padrão, a declaração anterior `IMPORT TABLE`(import-table.html "15.2.6 IMPORT TABLE Statement") poderia ter sido escrita assim (assumindo que o diretório `/tmp/mysql-files` não contém outros arquivos `.sdi` que correspondam ao padrão):

```
IMPORT TABLE FROM '/tmp/mysql-files/*.sdi';
```

Para interpretar os nomes dos caminhos de arquivos do arquivo `.sdi`, o servidor utiliza as mesmas regras para `IMPORT TABLE` que as regras do lado do servidor para `LOAD DATA` (ou seja, as regras que não são `LOCAL`). Veja a Seção 15.2.9, “Instrução LOAD DATA”, prestando atenção especial às regras usadas para interpretar nomes de caminhos relativos.

`IMPORT TABLE` falha se os arquivos de tabela `.sdi` ou de tabela não puderem ser localizados. Após a importação de uma tabela, o servidor tenta abri-la e reporta como avisos quaisquer problemas detectados. Para tentar uma correção para corrigir quaisquer problemas relatados, use `REPAIR TABLE`.

`IMPORT TABLE` não é escrito no log binário.

#### Restrições e Limitações

`IMPORT TABLE` aplica-se apenas a tabelas não `TEMPORARY` `MyISAM`. Não se aplica a tabelas criadas com um motor de armazenamento transacional, tabelas criadas com [`CREATE TEMPORARY TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"), ou visualizações.

Um arquivo `.sdi` usado em uma operação de importação deve ser gerado em um servidor com a mesma versão do dicionário de dados e versão sdi do servidor de importação. As informações sobre a versão do servidor gerador são encontradas no arquivo `.sdi`:

```
{
   "mysqld_version_id":80019,
   "dd_version":80017,
   "sdi_version":80016,
   ...
}
```

Para determinar o dicionário de dados e a versão do sdi do servidor de importação, você pode verificar o arquivo `.sdi` de uma tabela criada recentemente no servidor de importação.

Os dados da tabela e os arquivos de índice devem ser colocados no diretório do esquema do servidor de importação antes da operação de importação, a menos que a tabela, conforme definida no servidor de exportação, utilize as opções de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`. Nesse caso, modifique o procedimento de importação usando uma dessas alternativas antes de executar a declaração `IMPORT TABLE`:

* Coloque os arquivos de dados e de índice no mesmo diretório no host do servidor de importação, como no host do servidor de exportação, e crie links simbólicos no diretório do esquema do servidor de importação para esses arquivos.

* Coloque os arquivos de dados e de índice em um diretório de hospedagem de servidor de importação diferente do da hospedagem do servidor de exportação, e crie links simbólicos no diretório do esquema do servidor de importação para esses arquivos. Além disso, modifique o arquivo `.sdi` para refletir os diferentes locais dos arquivos.

* Coloque os arquivos de dados e índice no diretório do esquema no host do servidor de importação e modifique o arquivo `.sdi` para remover as opções de tabela de diretórios de dados e índice.

Qualquer ID de collation armazenada no arquivo `.sdi` deve se referir às mesmas collation nos servidores de exportação e importação.

As informações de ativação para uma tabela não são serializadas no arquivo `.sdi`, portanto, os gatilhos não são restaurados pela operação de importação.

Algumas edições em um arquivo `.sdi` são permitidas antes de executar a declaração `IMPORT TABLE`(import-table.html "15.2.6 IMPORT TABLE Statement"), enquanto outras são problemáticas ou podem até causar o fracasso da operação de importação:

* É necessário alterar as opções de diretório de dados e diretório de índice se os locais dos arquivos de dados e índice forem diferentes entre os servidores de exportação e importação.

* É necessário alterar o nome do esquema para importar a tabela em um esquema diferente no servidor de importação do que no servidor de exportação.

* Pode ser necessário alterar os nomes dos esquemas e das tabelas para acomodar diferenças entre a semântica de sensibilidade de caso do sistema de arquivos nos servidores de exportação e importação ou diferenças nas configurações do `lower_case_table_names`. Alterar os nomes das tabelas no arquivo `.sdi` pode exigir a renomeação dos arquivos das tabelas também.

* Em alguns casos, as alterações nas definições das colunas são permitidas. Alterar os tipos de dados provavelmente causará problemas.

### 15.2.7 Instrução INSERT

```
INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    { {VALUES | VALUE} (value_list) [, (value_list)] ... }
    [AS row_alias[(col_alias [, col_alias] ...)]]
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list
    [AS row_alias[(col_alias [, col_alias] ...)]]
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    { SELECT ...
      | TABLE table_name
      | VALUES row_constructor_list
    }
    [ON DUPLICATE KEY UPDATE assignment_list]

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

assignment:
    col_name =
          value
        | [row_alias.]col_name
        | [tbl_name.]col_name
        | [row_alias.]col_alias

assignment_list:
    assignment [, assignment] ...
```

`INSERT` insere novas linhas em uma tabela existente. As formas [(insert.html "15.2.7 INSERT Statement")`INSERT ... VALUES`, [(values.html "15.2.19 VALUES Statement")`INSERT ... VALUES ROW()` e [(insert-select.html "15.2.7.1 INSERT ... SELECT Statement")`INSERT ... SET`]] da declaração inserem linhas com base em valores explicitamente especificados. A forma [[[PH_LNK_712]]`INSERT ... SELECT` insere linhas selecionadas de outra(s) tabela(s). Você também pode usar [[PH_LNK_713]] no MySQL 8.0.19 e posterior para inserir linhas de uma única tabela. [[PH_LNK_714]] com uma cláusula [[[PH_LNK_715]]`ON DUPLICATE KEY UPDATE` permite que as linhas existentes sejam atualizadas se uma linha a ser inserida causasse um valor duplicado em um índice [[[PH_LNK_716]]`UNIQUE` ou [[[PH_LNK_717]]`PRIMARY KEY`]. No MySQL 8.0.19 e posterior, um alias de linha com uma ou mais aliases de coluna opcionais pode ser usado com [[PH_LNK_718]]`ON DUPLICATE KEY UPDATE` para referenciar a linha a ser inserida.

Para informações adicionais sobre `INSERT ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") e `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), consulte a Seção 15.2.7.1, “INSERÇÃO ... Instrução SELECT”, e a Seção 15.2.7.2, “INSERÇÃO ... ON DUPLICATE KEY UPDATE”.

Em MySQL 8.0, a palavra-chave `DELAYED` é aceita, mas ignorada pelo servidor. Para as razões por trás disso, consulte a Seção 15.2.7.3, “Instrução POSTPÓSADO”,

Para inserir em uma tabela, é necessário o privilégio `INSERT` para a tabela. Se a cláusula `ON DUPLICATE KEY UPDATE` for usada e uma chave duplicada causar a execução de um `UPDATE`, a declaração requer o privilégio `UPDATE` para as colunas serem atualizadas. Para colunas que são lidas, mas não modificadas, você precisa apenas do privilégio `SELECT` (como para uma coluna referenciada apenas no lado direito de uma atribuição *`col_name`=*`expr`* em uma cláusula `ON DUPLICATE KEY UPDATE`).

Ao inserir em uma tabela particionada, você pode controlar quais particionações e subparticionações aceitam novas linhas. A cláusula `PARTITION` recebe uma lista de nomes separados por vírgula de uma ou mais particionações ou subparticionações (ou ambas) da tabela. Se alguma das linhas a serem inseridas por uma declaração `INSERT` não corresponder a uma das particionações listadas, a declaração `INSERT` falha com o erro "Foi encontrada uma linha que não corresponde ao conjunto de particionações dado". Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de particionações”.

*`tbl_name`* é a tabela na qual as linhas devem ser inseridas. Especifique as colunas para as quais a declaração fornece valores da seguinte forma:

* Forneça uma lista entre parênteses com nomes de colunas separados por vírgula após o nome da tabela. Nesse caso, um valor para cada coluna nomeada deve ser fornecido pela lista `VALUES`, lista `VALUES ROW()` ou declaração `SELECT`. Para o formulário `INSERT TABLE`, o número de colunas na tabela de origem deve corresponder ao número de colunas a serem inseridas.

* Se você não especificar uma lista de nomes de colunas para `INSERT ... VALUES`(insert.html "15.2.7 INSERT Statement") ou `INSERT ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement"), os valores para cada coluna na tabela devem ser fornecidos pela lista `VALUES`, declaração `SELECT` ou declaração `TABLE`. Se você não sabe a ordem das colunas na tabela, use `DESCRIBE tbl_name` para descobrir.

* Uma cláusula `SET` indica colunas explicitamente pelo nome, juntamente com o valor a ser atribuído a cada uma delas.

Os valores das colunas podem ser fornecidos de várias maneiras:

* Se o modo SQL rigoroso não estiver habilitado, qualquer coluna que não tenha sido explicitamente atribuída um valor será definida pelo seu valor padrão (explícito ou implícito). Por exemplo, se você especificar uma lista de colunas que não nomeia todas as colunas da tabela, as colunas não nomeadas serão definidas pelos seus valores padrão. A atribuição de valor padrão é descrita na Seção 13.6, “Valores padrão de tipo de dados”. Veja também a Seção 1.6.3.3, “Restrições aplicadas a dados inválidos”.

Se o modo SQL rigoroso estiver habilitado, uma declaração `INSERT` gera um erro se não especificar um valor explícito para cada coluna que não tenha um valor padrão. Veja a Seção 7.1.11, “Modos SQL do servidor”.

* Se a lista de colunas e a lista `VALUES` estiverem vazias, `INSERT` cria uma linha com cada coluna definida com seu valor padrão:

  ```
  INSERT INTO tbl_name () VALUES();
  ```

Se o modo estrito não estiver habilitado, o MySQL usa o valor padrão implícito para qualquer coluna que não tenha um valor padrão definido explicitamente. Se o modo estrito estiver habilitado, ocorrerá um erro se qualquer coluna não tiver um valor padrão.

* Use a palavra-chave `DEFAULT` para definir uma coluna explicitamente ao seu valor padrão. Isso facilita a escrita de declarações `INSERT` que atribuem valores a todas as colunas, exceto algumas, porque permite evitar a escrita de uma lista `VALUES` incompleta que não inclui um valor para cada coluna na tabela. Caso contrário, você deve fornecer a lista de nomes de colunas correspondentes a cada valor na lista `VALUES`.

* Se uma coluna gerada for inserida explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

* Nas expressões, você pode usar `DEFAULT(col_name)` para produzir o valor padrão para a coluna *`col_name`*.

A conversão de tipo de uma expressão *`expr`*, que fornece um valor de coluna, pode ocorrer se o tipo de dados da expressão não corresponder ao tipo de dados da coluna. A conversão de um valor dado pode resultar em diferentes valores inseridos, dependendo do tipo da coluna. Por exemplo, inserir a string `'1999.0e-2'` em uma coluna `INT` (INTEIRO, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT), `FLOAT` (FLUTADO, DÚBLIO), `DECIMAL(10,6)` (DECIMAL, NUMÉRICO), ou `YEAR` insere o valor `1999`, `19.9921`, `19.992100`, ou `1999`, respectivamente. O valor armazenado nas colunas `INT` (INTEIRO, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) e `YEAR` é `1999`, pois a conversão de string para número só considera tanta parte da parte inicial da string quanto pode ser considerada um número inteiro ou ano válido. Para as colunas `FLOAT` (FLUTADO), `DECIMAL` (DECIMAL, NUMÉRICO) e `expr` (NUMÉRICO), a conversão de string para número considera toda a string como um valor numérico válido.

* Uma expressão *`expr`* pode se referir a qualquer coluna que foi definida anteriormente em uma lista de valores. Por exemplo, você pode fazer isso porque o valor para `col2` se refere a `col1`, que foi previamente atribuído:

  ```
  INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
  ```

Mas o que se segue não é legal, porque o valor para `col1` refere-se a `col2`, que é atribuído após `col1`:

  ```
  INSERT INTO tbl_name (col1,col2) VALUES(col2*2,15);
  ```

Uma exceção ocorre para as colunas que contêm valores de `AUTO_INCREMENT`. Como os valores de `AUTO_INCREMENT` são gerados após outras atribuições de valores, qualquer referência a uma coluna `AUTO_INCREMENT` na atribuição retorna um `0`.

`INSERT` declarações que utilizam a sintaxe `VALUES` podem inserir múltiplas linhas. Para fazer isso, inclua múltiplas listas de valores de coluna separados por vírgulas, com listas dentro de parênteses e separadas por vírgulas. Exemplo:

```
INSERT INTO tbl_name (a,b,c)
    VALUES(1,2,3), (4,5,6), (7,8,9);
```

Cada lista de valores deve conter exatamente tantos valores quanto devem ser inseridos por linha. A seguinte declaração é inválida porque contém uma lista de nove valores, em vez de três listas de três valores cada uma:

```
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3,4,5,6,7,8,9);
```

`VALUE` é sinônimo de `VALUES` neste contexto. Nenhum deles implica em nada sobre o número de listas de valores, nem sobre o número de valores por lista. Qualquer um pode ser usado, independentemente de haver uma única lista de valores ou múltiplas listas, e independentemente do número de valores por lista.

As declarações `INSERT` que utilizam a sintaxe `VALUES ROW()` também podem inserir várias linhas. Neste caso, cada lista de valores deve estar contida dentro de um `ROW()` (construtor de linha), como este:

```
INSERT INTO tbl_name (a,b,c)
    VALUES ROW(1,2,3), ROW(4,5,6), ROW(7,8,9);
```

O valor de affected-rows para um `INSERT` pode ser obtido usando a função SQL `ROW_COUNT()` ou a função C API `mysql_affected_rows()`. Veja a Seção 14.15, “Funções de Informação”, e mysql_affected_rows().

Se você usar `INSERT ... VALUES`](insert.html "15.2.7 INSERT Statement") ou `INSERT ... VALUES ROW()` com listas de valores múltiplos, ou [`INSERT ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") ou `INSERT ... TABLE`, a declaração retorna uma string de informações neste formato:

```
Records: N1 Duplicates: N2 Warnings: N3
```

Se você estiver usando a API C, a string de informações pode ser obtida invocando a função `mysql_info()`. Veja mysql_info().

`Records` indica o número de linhas processadas pela declaração. (Isso não é necessariamente o número de linhas realmente inseridas, porque `Duplicates` pode ser não nulo.) `Duplicates` indica o número de linhas que não puderam ser inseridas porque elas duplicariam algum valor único do índice existente. `Warnings` indica o número de tentativas de inserir valores de coluna que foram problemáticos de alguma forma. As advertências podem ocorrer em qualquer uma das seguintes condições:

* Inserir `NULL` em uma coluna que tenha sido declarada como `NOT NULL`. Para declarações de múltiplas linhas `INSERT` ou declarações `INSERT INTO ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement"), a coluna é definida pelo valor padrão implícito para o tipo de dados da coluna. Isso é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor “zero” para tipos de data e hora. As declarações `INSERT INTO ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") são tratadas da mesma maneira que as inserções de múltiplas linhas, porque o servidor não examina o conjunto de resultados da `SELECT` para ver se ele retorna uma única linha. (Para uma declaração de uma única linha `INSERT`, não ocorre aviso quando `NULL` é inserido em uma coluna `NOT NULL`. Em vez disso, a declaração falha com um erro.)

* Definir uma coluna numérica para um valor que esteja fora do intervalo da coluna. O valor é recortado para o ponto final mais próximo do intervalo.

* Atribuir um valor como `'10.34 a'` a uma coluna numérica. O texto não numérico final é removido e a parte numérica restante é inserida. Se o valor da string não tiver uma parte numérica inicial, a coluna é definida como `0`.

* Inserindo uma cadeia em uma coluna de cadeia (`CHAR`, `VARCHAR`, `TEXT` ou `BLOB`) que excede o comprimento máximo da coluna. O valor é truncado para o comprimento máximo da coluna.

* Inserir um valor em uma coluna de data ou hora que é ilegal para o tipo de dados. A coluna é definida com o valor zero apropriado para o tipo.

* Para exemplos de `INSERT` que envolvem valores da coluna `AUTO_INCREMENT`, consulte a Seção 5.6.9, “Usando AUTO_INCREMENT”.

Se o `INSERT` inserir uma linha em uma tabela que possui uma coluna `AUTO_INCREMENT`, você pode encontrar o valor usado para essa coluna usando a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`.

Nota

Essas duas funções não sempre se comportam de maneira idêntica. O comportamento das declarações `INSERT` em relação às colunas `AUTO_INCREMENT` é discutido mais detalhadamente na Seção 14.15, “Funções de Informação”, e em mysql_insert_id().

A declaração `INSERT` suporta os seguintes modificadores:

* Se você usar o modificador `LOW_PRIORITY`, a execução do `INSERT` é adiada até que nenhum outro cliente esteja lendo a tabela. Isso inclui outros clientes que começaram a ler enquanto clientes existentes estão lendo e enquanto a declaração `INSERT LOW_PRIORITY` está esperando. Portanto, é possível que um cliente que emite uma declaração `INSERT LOW_PRIORITY` espere por um período muito longo.

`LOW_PRIORITY` afeta apenas os motores de armazenamento que utilizam bloqueio apenas em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

Nota

`LOW_PRIORITY` normalmente não deve ser usado com as tabelas `MyISAM`, pois isso desativa as inserções concorrentes. Veja a Seção 10.11.3, “Inserções Concorrentes”.

* Se você especificar `HIGH_PRIORITY`, ele substitui o efeito da opção `--low-priority-updates` se o servidor foi iniciado com essa opção. Ele também faz com que as inserções concorrentes não sejam usadas. Veja a Seção 10.11.3, “Inserções Concorrentes”.

`HIGH_PRIORITY` afeta apenas os motores de armazenamento que utilizam bloqueio apenas em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* Se você usar o modificador `IGNORE`, erros ignoráveis que ocorrem ao executar a declaração `INSERT` são ignorados. Por exemplo, sem `IGNORE`, uma linha que duplica um índice existente de `UNIQUE` ou valor de `PRIMARY KEY` na tabela causa um erro de chave duplicada e a declaração é interrompida. Com `IGNORE`, a linha é descartada e não ocorre nenhum erro. Os erros ignorados geram avisos em vez disso.

`IGNORE` tem um efeito semelhante em inserções em tabelas particionadas onde não é encontrado uma partição que corresponda a um valor dado. Sem `IGNORE`, tais declarações `INSERT` são abortadas com um erro. Quando `INSERT IGNORE`(insert.html "15.2.7 INSERT Statement") é usado, a operação de inserção falha silenciosamente para as linhas que contêm o valor não correspondente, mas insere as linhas que são correspondentes. Para um exemplo, veja a Seção 26.2.2, “LIST Partitioning”.

As conversões de dados que acionarão erros abortarão a declaração se `IGNORE` não for especificado. Com `IGNORE`, os valores inválidos são ajustados para os valores mais próximos e inseridos; são produzidos avisos, mas a declaração não é abortada. Você pode determinar com a função C API `mysql_info()` quantas linhas foram realmente inseridas na tabela.

Para mais informações, consulte O efeito de IGNORE na execução de declarações.

Você pode usar `REPLACE` em vez de `INSERT` para sobrescrever linhas antigas. `REPLACE` é o equivalente a [`INSERT IGNORE`](insert.html "15.2.7 INSERT Statement") no tratamento de novas linhas que contêm valores de chave únicos que duplicam as linhas antigas: As novas linhas substituem as linhas antigas em vez de serem descartadas. Veja a Seção 15.2.12, “Instrução REPLACE”.

* Se você especificar `ON DUPLICATE KEY UPDATE`, e uma linha é inserida que causaria um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`, ocorre um `UPDATE` da linha antiga. O valor de affected-rows por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a bandeira `CLIENT_FOUND_ROWS` para a função C API `mysql_real_connect()` ao se conectar ao **mysqld**, o valor de affected-rows é 1 (não 0) se uma linha existente for definida com seus valores atuais. Veja a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

* `INSERT DELAYED` foi descontinuado no MySQL 5.6 e está previsto para eventual remoção. No MySQL 8.0, o modificador `DELAYED` é aceito, mas ignorado. Use `INSERT` (sem `DELAYED`) em vez disso. Veja a Seção 15.2.7.3, “Instrução INSERT DELAYED”.

#### 15.2.7.1 INSERIR ... Instrução SELECT

```
INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {   SELECT ...
      | TABLE table_name
      | VALUES row_constructor_list
    }
    [ON DUPLICATE KEY UPDATE assignment_list]


value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

assignment:
    col_name =
          value
        | [row_alias.]col_name
        | [tbl_name.]col_name
        | [row_alias.]col_alias

assignment_list:
    assignment [, assignment] ...
```

Com `INSERT ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement"), você pode inserir rapidamente muitas linhas em uma tabela a partir do resultado de uma declaração `SELECT`, que pode selecionar uma ou mais tabelas. Por exemplo:

```
INSERT INTO tbl_temp2 (fld_id)
  SELECT tbl_temp1.fld_order_id
  FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

A partir do MySQL 8.0.19, você pode usar uma declaração `TABLE` em vez de `SELECT`, conforme mostrado aqui:

```
INSERT INTO ta TABLE tb;
```

`TABLE tb` é equivalente a `SELECT * FROM tb`. Pode ser útil ao inserir todas as colunas da tabela de origem na tabela de destino, e não é necessário filtrar com WHERE. Além disso, as linhas de `TABLE` podem ser ordenadas por uma ou mais colunas usando `ORDER BY`, e o número de linhas inseridas pode ser limitado usando uma cláusula `LIMIT`. Para mais informações, consulte a Seção 15.2.16, “Declaração TABLE”.

As seguintes condições se aplicam às declarações `INSERT ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") e, salvo indicação em contrário, também às declarações `INSERT ... TABLE`:

* Especifique `IGNORE` para ignorar linhas que causariam violações de chave duplicada.

* A tabela-alvo da declaração `INSERT` pode aparecer na cláusula `FROM` da parte `SELECT` da consulta, ou como a tabela nomeada por `TABLE`. No entanto, você não pode inserir em uma tabela e selecionar da mesma tabela em uma subconsulta.

Ao selecionar e inserir na mesma tabela, o MySQL cria uma tabela temporária interna para armazenar as linhas do `SELECT` e, em seguida, insere essas linhas na tabela de destino. No entanto, você não pode usar `INSERT INTO t ... SELECT ... FROM t` quando `t` é uma tabela `TEMPORARY`, porque as tabelas `TEMPORARY` não podem ser referenciadas duas vezes na mesma declaração. Por motivos semelhantes, você não pode usar `INSERT INTO t ... TABLE t` quando `t` é uma tabela temporária. Veja a Seção 10.4.4, “Uso de Tabela Temporária Interna no MySQL”, e a Seção B.3.6.2, “Problemas com Tabela TEMPORARY”.

As colunas `AUTO_INCREMENT` funcionam como de costume. * Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes para as declarações `INSERT ... SELECT` e (insert-select.html "15.2.7.1 INSERT ... SELECT Statement") ou `INSERT ... TABLE` (consulte a Seção 10.11.3, “Inserções Concorrentes”).

* Para evitar problemas de referência ambígua de coluna quando o `SELECT` e o `INSERT` se referirem à mesma tabela, forneça um alias único para cada tabela usada na parte `SELECT`, e qualifique os nomes das colunas naquela parte com o alias apropriado.

A declaração `TABLE` não suporta aliases.

Você pode selecionar explicitamente quais partições ou subpartições (ou ambas) da tabela de origem ou de destino (ou ambas) devem ser usadas com uma cláusula `PARTITION` após o nome da tabela. Quando `PARTITION` é usado com o nome da tabela de origem na parte `SELECT` da declaração, as linhas são selecionadas apenas das partições ou subpartições nomeadas em sua lista de partições. Quando `PARTITION` é usado com o nome da tabela de destino para a parte `INSERT` da declaração, deve ser possível inserir todas as linhas selecionadas nas partições ou subpartições nomeadas na lista de partições que segue a opção. Caso contrário, a declaração `INSERT ... SELECT` falha. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

`TABLE` não suporta uma cláusula `PARTITION`.

Para as declarações de `INSERT ... SELECT`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), consulte a Seção 15.2.7.2, “Declaração INSERT ... ON DUPLICATE KEY UPDATE”, para as condições sob as quais as colunas `SELECT` podem ser referenciadas em uma cláusula de `ON DUPLICATE KEY UPDATE`. Isso também funciona para `INSERT ... TABLE`.

A ordem em que uma declaração `SELECT` ou `TABLE` sem cláusula `ORDER BY` retorna linhas é não determinística. Isso significa que, ao usar replicação, não há garantia de que tal declaração `SELECT` retorne linhas no mesmo ordem na fonte e na replica, o que pode levar a inconsistências entre elas. Para evitar que isso ocorra, sempre escreva declarações `INSERT ... SELECT` ou `INSERT ... TABLE` que devem ser replicadas usando uma cláusula `ORDER BY` que produz o mesmo ordem de linha na fonte e na replica. Veja também a Seção 19.5.1.18, “Replicação e LIMIT”.

Devido a essa questão, as declarações `INSERT ... SELECT ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") e `INSERT IGNORE ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") são marcadas como inseguras para replicação baseada em declarações. Essas declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linha quando usar o modo `MIXED`. (Bug #11758262, Bug #50439)

Veja também [Seção 19.2.1.1, “Vantagens e desvantagens da replicação baseada em declaração e baseada em linha”][(replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication")].

#### 15.2.7.2 Inserir ... na declaração DUPLICATE KEY UPDATE

Se você especificar uma cláusula `ON DUPLICATE KEY UPDATE` e uma linha a ser inserida causará um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`, ocorre um `UPDATE` da linha antiga. Por exemplo, se a coluna `a` for declarada como `UNIQUE` e contiver o valor `1`, as seguintes duas declarações têm efeito semelhante:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=c+1;

UPDATE t1 SET c=c+1 WHERE a=1;
```

Os efeitos não são exatamente idênticos: Para uma tabela `InnoDB` onde `a` é uma coluna de auto-incremento, a declaração `INSERT` aumenta o valor de auto-incremento, mas a `UPDATE`

Se a coluna `b` também for única, a `INSERT` é equivalente a esta declaração `UPDATE` em vez disso:

```
UPDATE t1 SET c=c+1 WHERE a=1 OR b=2 LIMIT 1;
```

Se `a=1 OR b=2` corresponder a várias linhas, apenas uma linha é atualizada. Em geral, você deve tentar evitar o uso de uma cláusula `ON DUPLICATE KEY UPDATE` em tabelas com vários índices exclusivos.

Com `ON DUPLICATE KEY UPDATE`, o valor de `ON DUPLICATE KEY UPDATE` por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a bandeira `CLIENT_FOUND_ROWS` para a função C API `mysql_real_connect()` ao se conectar ao **mysqld**, o valor de `ON DUPLICATE KEY UPDATE` é 1 (não 0) se uma linha existente for definida com seus valores atuais.

Se uma tabela contiver uma coluna `AUTO_INCREMENT` e o [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") inserir ou atualizar uma linha, a função `LAST_INSERT_ID()` retornará o valor `AUTO_INCREMENT`.

A cláusula `ON DUPLICATE KEY UPDATE` pode conter múltiplas atribuições de coluna, separadas por vírgulas.

É possível usar `IGNORE` com `ON DUPLICATE KEY UPDATE` em uma declaração `INSERT`, mas isso pode não se comportar como você espera ao inserir várias linhas em uma tabela que tem várias chaves únicas. Isso se torna aparente quando um valor atualizado é ele mesmo um valor de chave duplicado. Considere a tabela `t`, criada e preenchida pelas declarações mostradas aqui:

```
mysql> CREATE TABLE t (a SERIAL, b BIGINT NOT NULL, UNIQUE KEY (b));;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t VALUES ROW(1,1), ROW(2,2);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> TABLE t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

Agora, tentamos inserir duas linhas, uma das quais contém um valor de chave duplicado, usando `ON DUPLICATE KEY UPDATE`, onde a própria cláusula `UPDATE` resulta em um valor de chave duplicado:

```
mysql> INSERT INTO t VALUES ROW(2,3), ROW(3,3) ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
ERROR 1062 (23000): Duplicate entry '1' for key 't.b'
mysql> TABLE t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

A primeira linha contém um valor duplicado para uma das chaves únicas da tabela (coluna `a`), mas `b=b+1` na cláusula `UPDATE` resulta em uma violação de chave única para a coluna `b`; a declaração é imediatamente rejeitada com um erro e nenhuma linha é atualizada. Vamos repetir a declaração, desta vez adicionando a palavra-chave **`IGNORE`**, assim:

```
mysql> INSERT IGNORE INTO t VALUES ROW(2,3), ROW(3,3)
    -> ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
Query OK, 1 row affected, 1 warning (0.00 sec)
Records: 2  Duplicates: 1  Warnings: 1
```

Desta vez, o erro anterior é desvalorizado para um aviso, conforme mostrado aqui:

```
mysql> SHOW WARNINGS;
+---------+------+-----------------------------------+
| Level   | Code | Message                           |
+---------+------+-----------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 't.b' |
+---------+------+-----------------------------------+
1 row in set (0.00 sec)
```

Como a declaração não foi rejeitada, a execução continua. Isso significa que a segunda linha é inserida em `t`, como podemos ver aqui:

```
mysql> TABLE t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
+---+---+
3 rows in set (0.00 sec)
```

Nas expressões de valor de atribuição na cláusula `ON DUPLICATE KEY UPDATE`, você pode usar a função `VALUES(col_name)` para referenciar valores de coluna da parte `INSERT` da declaração [`INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement")]. Em outras palavras, `VALUES(col_name)` na cláusula `ON DUPLICATE KEY UPDATE` refere-se ao valor de *`col_name`* que seria inserido, caso não ocorresse conflito de chave duplicada. Esta função é especialmente útil em inserções de múltiplas linhas. A função `VALUES()` é significativa apenas como introduzidor para listas de valores da declaração `INSERT`, ou na cláusula `ON DUPLICATE KEY UPDATE` de uma declaração `INSERT`, e retorna `NULL` caso contrário. Por exemplo:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6)
  ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
```

Essa declaração é idêntica às seguintes duas declarações:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=3;
INSERT INTO t1 (a,b,c) VALUES (4,5,6)
  ON DUPLICATE KEY UPDATE c=9;
```

Nota

O uso de `VALUES()` para se referir à nova linha e colunas é desaconselhável a partir do MySQL 8.0.20 e está sujeito à remoção em uma versão futura do MySQL. Em vez disso, use aliases de linha e coluna, conforme descrito nos próximos parágrafos desta seção.

Começando com o MySQL 8.0.19, é possível usar um alias para a linha, com, opcionalmente, uma ou mais de suas colunas a serem inseridas, seguindo a cláusula `VALUES` ou `SET`, e precedida pela palavra-chave `AS`. Usando o alias da linha `new`, a declaração mostrada anteriormente usando `VALUES()` para acessar os novos valores da coluna pode ser escrita na forma mostrada aqui:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6) AS new
  ON DUPLICATE KEY UPDATE c = new.a+new.b;
```

Se, além disso, você usar os aliases de coluna `m`, `n` e `p`, você pode omitir o alias da linha na cláusula de atribuição e escrever a mesma declaração assim:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6) AS new(m,n,p)
  ON DUPLICATE KEY UPDATE c = m+n;
```

Ao usar aliases de coluna dessa forma, você ainda deve usar um alias de linha seguindo a cláusula `VALUES`, mesmo que você não faça uso direto dela na cláusula de atribuição.

Começando com o MySQL 8.0.20, uma declaração `INSERT ... SELECT ... ON DUPLICATE KEY UPDATE` que usa `VALUES()` na cláusula `UPDATE`, como esta, lança um aviso:

```
INSERT INTO t1
  SELECT c, c+d FROM t2
  ON DUPLICATE KEY UPDATE b = VALUES(b);
```

Você pode eliminar esses avisos usando uma subconsulta em vez disso, como este:

```
INSERT INTO t1
  SELECT * FROM (SELECT c, c+d AS e FROM t2) AS dt
  ON DUPLICATE KEY UPDATE b = e;
```

Você também pode usar aliases de linha e coluna com uma cláusula `SET`, conforme mencionado anteriormente. Empregar `SET` em vez de `VALUES` nas duas declarações `INSERT ... ON DUPLICATE KEY UPDATE` mostradas anteriormente pode ser feito como mostrado aqui:

```
INSERT INTO t1 SET a=1,b=2,c=3 AS new
  ON DUPLICATE KEY UPDATE c = new.a+new.b;

INSERT INTO t1 SET a=1,b=2,c=3 AS new(m,n,p)
  ON DUPLICATE KEY UPDATE c = m+n;
```

O alias da linha não deve ser o mesmo que o nome da tabela. Se os aliases de coluna não forem usados ou se forem os mesmos que os nomes das colunas, eles devem ser distinguidos usando o alias da linha na cláusula `ON DUPLICATE KEY UPDATE`. Os aliases de coluna devem ser exclusivos em relação ao alias da linha ao qual se aplicam (ou seja, nenhum alias de coluna que se refira a colunas da mesma linha pode ser o mesmo).

Para as declarações `INSERT ... SELECT`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), essas regras se aplicam em relação às formas aceitáveis de expressões de consulta `SELECT` que você pode referenciar em uma cláusula `ON DUPLICATE KEY UPDATE`:

* Referências a colunas de consultas em uma única tabela, que pode ser uma tabela derivada.

* Referências a colunas de consultas em uma junção em várias tabelas.

* Referências a colunas de consultas de `DISTINCT`.

* Referências a colunas em outras tabelas, desde que o `SELECT` não utilize `GROUP BY`. Um efeito colateral é que você deve qualificar referências a nomes de colunas não únicos.

As referências a colunas de um `UNION` não são suportadas. Para contornar essa restrição, reescreva o `UNION` como uma tabela derivada, para que suas linhas possam ser tratadas como um conjunto de resultados de uma única tabela. Por exemplo, esta declaração produz um erro:

```
INSERT INTO t1 (a, b)
  SELECT c, d FROM t2
  UNION
  SELECT e, f FROM t3
ON DUPLICATE KEY UPDATE b = b + c;
```

Em vez disso, use uma declaração equivalente que reescreva o `UNION` como uma tabela derivada:

```
INSERT INTO t1 (a, b)
SELECT * FROM
  (SELECT c, d FROM t2
   UNION
   SELECT e, f FROM t3) AS dt
ON DUPLICATE KEY UPDATE b = b + c;
```

A técnica de reescrita de uma consulta como uma tabela derivada também permite referências a colunas de consultas de `GROUP BY`.

Como os resultados das declarações `INSERT ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") dependem da ordem das linhas do `SELECT` e essa ordem nem sempre pode ser garantida, é possível que, ao registrar declarações `INSERT ... SELECT ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") para a fonte e a replica divergirem. Assim, as declarações `INSERT ... SELECT ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") são marcadas como inseguras para replicação baseada em declarações. Essas declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. Uma declaração `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") contra uma tabela com mais de uma chave única ou primária também é marcada como insegura. (Bug #11765650, Bug #58637)

Veja também [Seção 19.2.1.1, “Vantagens e desvantagens da replicação baseada em declaração e baseada em linha”][(replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication")].

#### 15.2.7.3 Declaração de adiamento INSERT

```
INSERT DELAYED ...
```

A opção `DELAYED` para a declaração `INSERT` é uma extensão do MySQL ao SQL padrão. Em versões anteriores do MySQL, ela pode ser usada para certos tipos de tabelas (como `MyISAM`, por exemplo), de modo que, quando um cliente usa `INSERT DELAYED`, ele recebe uma resposta positiva do servidor de uma só vez, e a linha é colocada em fila para ser inserida quando a tabela não estiver sendo usada por qualquer outro thread.

Os insertos e substitutos `DELAYED` foram descontinuados no MySQL 5.6. No MySQL 8.0, o `DELAYED` não é suportado. O servidor reconhece, mas ignora a palavra-chave `DELAYED`, trata o inserto como um inserto não atrasado e gera um aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`: O INSERT DELAYED já não é suportado. A declaração foi convertida para INSERT. A palavra-chave `DELAYED` está programada para ser removida em uma versão futura.

### 15.2.8 Cláusula de Interseção

```
query_expression_body INTERSECT [ALL | DISTINCT] query_expression_body
    [INTERSECT [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

`INTERSECT` limita o resultado de vários blocos de consulta aos registros que são comuns a todos. Exemplo:

```
mysql> TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    2 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)

mysql> TABLE b;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    1 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)

mysql> TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    1 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)

mysql> TABLE a INTERSECT TABLE b;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    3 |    4 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE a INTERSECT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    3 |    4 |
+------+------+
1 row in set (0.00 sec)
```

Assim como em `UNION` e `EXCEPT`, se não for especificado `DISTINCT` ou `ALL`, o padrão é `DISTINCT`.

`DISTINCT` pode remover duplicatas de qualquer lado da interseção, como mostrado aqui:

```
mysql> TABLE c INTERSECT DISTINCT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    3 |    4 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE c INTERSECT ALL TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    1 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)
```

(`TABLE c INTERSECT TABLE c` é o equivalente à primeira das duas declarações que acabamos de mostrar.)

Assim como em `UNION`, os operandos devem ter o mesmo número de colunas. Os tipos de colunas do conjunto de resultados também são determinados como para `UNION`.

`INTERSECT` tem precedência maior do que e é avaliada antes de `UNION` e `EXCEPT`, de modo que as duas declarações mostradas aqui são equivalentes:

```
TABLE r EXCEPT TABLE s INTERSECT TABLE t;

TABLE r EXCEPT (TABLE s INTERSECT TABLE t);
```

Para `INTERSECT ALL`, o número máximo de duplicatas de qualquer linha única na tabela à esquerda é `4294967295`.

`INTERSECT` foi adicionado no MySQL 8.0.31.

### 15.2.9 Declaração LOAD DATA

```
LOAD DATA
    [LOW_PRIORITY | CONCURRENT] [LOCAL]
    INFILE 'file_name'
    [REPLACE | IGNORE]
    INTO TABLE tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [CHARACTER SET charset_name]
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        [[OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
    [IGNORE number {LINES | ROWS}]
    [(col_name_or_user_var
        [, col_name_or_user_var] ...)]
    [SET col_name={expr | DEFAULT}
        [, col_name={expr | DEFAULT}] ...]
```

A declaração `LOAD DATA` lê linhas de um arquivo de texto em uma tabela em alta velocidade. O arquivo pode ser lido do host do servidor ou do host do cliente, dependendo se o modificador `LOCAL` é dado. `LOCAL` também afeta a interpretação dos dados e o tratamento de erros.

`LOAD DATA` é o complemento de `SELECT ... INTO OUTFILE`(select-into.html "15.2.13.1 SELECT ... INTO Statement"). (Veja a Seção 15.2.13.1, “Instrução SELECT ... INTO”.) Para escrever dados de uma tabela em um arquivo, use `SELECT ... INTO OUTFILE`(select-into.html "15.2.13.1 SELECT ... INTO Statement"). Para ler o arquivo de volta em uma tabela, use `LOAD DATA`. A sintaxe das cláusulas `FIELDS` e `LINES` é a mesma para ambas as instruções.

O utilitário **mysqlimport** oferece outra maneira de carregar arquivos de dados; ele opera enviando uma declaração `LOAD DATA` para o servidor. Veja a Seção 6.5.5, “mysqlimport — Um programa de importação de dados”.

Para informações sobre a eficiência de `INSERT` em relação a `LOAD DATA` e sobre a aceleração de `LOAD DATA`, consulte a Seção 10.2.5.1, “Otimizando os Entradas de Inserção”.

* Operação LOCAL versus NÃO LOCAL
* Conjunto de caracteres do arquivo de entrada
* Localização do arquivo de entrada
* Requisitos de segurança
* Gerenciamento de chaves duplicadas e erros
* Gerenciamento de índice
* Manipulação de campo e linha
* Especificação da lista de colunas
* Pré-processamento de entrada
* Atribuição de valor de coluna
* Suporte para tabela particionada
* Considerações sobre concorrência
* Informações sobre o resultado da declaração
* Considerações sobre replicação
* Tópicos diversos

#### Operação Não LOCAL versus OPERAÇÃO LOCAL

O modificador `LOCAL` afeta esses aspectos do `LOAD DATA`, em comparação com a operação não `LOCAL`:

* Altera a localização esperada do arquivo de entrada; veja Localização do arquivo de entrada.

* Altera os requisitos de segurança; veja Requisitos de segurança.

* A menos que `REPLACE` também seja especificado, `LOCAL` tem o mesmo efeito que o modificador `IGNORE` na interpretação do conteúdo do arquivo de entrada e no tratamento de erros; veja Duplo-Chave e Tratamento de Erros e Atribuição de Valor de Coluna.

`LOCAL` só funciona se o servidor e seu cliente tiverem sido configurados para permitir isso. Por exemplo, se o **mysqld** foi iniciado com a variável de sistema `local_infile` desativada, `LOCAL` produz um erro. Veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

#### Conjunto de caracteres do arquivo de entrada

O nome do arquivo deve ser fornecido como uma string literal. Em Windows, especifique barras invertidas em nomes de caminho como barras verticais ou barras invertidas duplas. O servidor interpreta o nome do arquivo usando o conjunto de caracteres indicado pela variável do sistema `character_set_filesystem`.

Por padrão, o servidor interpreta o conteúdo do arquivo usando o conjunto de caracteres indicado pela variável de sistema `character_set_database`. Se o conteúdo do arquivo usar um conjunto de caracteres diferente desse padrão, é uma boa ideia especificar esse conjunto de caracteres usando a cláusula `CHARACTER SET`. Um conjunto de caracteres de `binary` especifica “sem conversão”.

`SET NAMES` e a definição de `character_set_client` não afetam a interpretação do conteúdo do arquivo.

`LOAD DATA` interpreta todos os campos no arquivo como tendo o mesmo conjunto de caracteres, independentemente dos tipos de dados das colunas nas quais os valores dos campos são carregados. Para uma interpretação adequada do arquivo, você deve garantir que ele foi escrito com o conjunto de caracteres correto. Por exemplo, se você escrever um arquivo de dados com **mysqldump -T** ou ao emitir uma declaração `SELECT ... INTO OUTFILE`(select-into.html "15.2.13.1 SELECT ... INTO Statement") em **mysql**, certifique-se de usar uma opção `--default-character-set` para escrever a saída no conjunto de caracteres a ser usado quando o arquivo for carregado com `LOAD DATA`.

Nota

Não é possível carregar arquivos de dados que utilizam o conjunto de caracteres `ucs2`, `utf16`, `utf16le` ou `utf32`.

#### Localização do arquivo de entrada

Essas regras determinam a localização do arquivo de entrada `LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement"):

* Se `LOCAL` não for especificado, o arquivo deve estar localizado no host do servidor. O servidor lê o arquivo diretamente, localizando-o da seguinte forma:

+ Se o nome do arquivo for um nome de caminho absoluto, o servidor o usa conforme especificado.

+ Se o nome do arquivo for um nome de caminho relativo com componentes iniciais, o servidor procura o arquivo em relação ao seu diretório de dados.

+ Se o nome do arquivo não tiver componentes iniciais, o servidor procura o arquivo no diretório do banco de dados padrão.

* Se `LOCAL` for especificado, o arquivo deve estar localizado no host do cliente. O programa do cliente lê o arquivo, localizando-o da seguinte forma:

+ Se o nome do arquivo for um nome de caminho absoluto, o programa cliente o usa conforme fornecido.

+ Se o nome do arquivo for um nome de caminho relativo, o programa cliente procura o arquivo em relação ao seu diretório de invocação.

Quando o `LOCAL` é usado, o programa cliente lê o arquivo e envia seu conteúdo para o servidor. O servidor cria uma cópia do arquivo no diretório onde armazena os arquivos temporários. Veja a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”. A falta de espaço suficiente para a cópia neste diretório pode fazer com que a declaração [`LOAD DATA LOCAL`(load-data.html "15.2.9 LOAD DATA Statement") falhe.

As regras que não são `LOCAL` significam que o servidor lê um arquivo denominado `./myfile.txt` em relação ao seu diretório de dados, enquanto lê um arquivo denominado `myfile.txt` do diretório de banco de dados do banco de dados padrão. Por exemplo, se a seguinte declaração `LOAD DATA` for executada enquanto `db1` é o banco de dados padrão, o servidor lê o arquivo `data.txt` do diretório de banco de dados para `db1`, embora a declaração carregue explicitamente o arquivo em uma tabela no banco de dados `db2`:

```
LOAD DATA INFILE 'data.txt' INTO TABLE db2.my_table;
```

Nota

O servidor também utiliza as regras não `LOCAL` para localizar os arquivos `.sdi` para a declaração `IMPORT TABLE`.

#### Requisitos de segurança

Para uma operação de carregamento que não seja `LOCAL`, o servidor lê um arquivo de texto localizado no host do servidor, portanto, esses requisitos de segurança devem ser satisfeitos:

* Você deve ter o privilégio `FILE`. Veja a Seção 8.2.2, “Privilégios fornecidos pelo MySQL”.

* A operação está sujeita à definição da variável de sistema `secure_file_priv`:

+ Se o valor da variável for um nome de diretório não vazio, o arquivo deve estar localizado nesse diretório.

+ Se o valor da variável estiver vazio (o que é inseguro), o arquivo só precisa ser legível pelo servidor.

Para uma operação de carregamento `LOCAL`, o programa de cliente lê um arquivo de texto localizado no host do cliente. Como o conteúdo do arquivo é enviado pela conexão do cliente para o servidor, usando `LOCAL` é um pouco mais lento do que quando o servidor acessa o arquivo diretamente. Por outro lado, você não precisa do privilégio `FILE`, e o arquivo pode estar localizado em qualquer diretório que o programa de cliente possa acessar.

#### Gerenciamento de Chave Duplicada e Erro

Os modificadores `REPLACE` e `IGNORE` controlam o tratamento de novas (linhas de entrada) que duplicam as linhas existentes da tabela em valores de chave única (valores de índices `PRIMARY KEY` ou `UNIQUE`):

* Com `REPLACE`, novas linhas que têm o mesmo valor que um valor de chave única em uma linha existente substituem a linha existente. Veja a Seção 15.2.12, “Instrução REPLACE”.

* Com `IGNORE`, novas linhas que duplicam uma linha existente em um valor de chave única são descartadas. Para mais informações, consulte O efeito do IGNORE na execução da declaração.

O modificador `LOCAL` tem o mesmo efeito que o `IGNORE`. Isso ocorre porque o servidor não tem como interromper a transmissão do arquivo durante a operação.

Se nenhum dos valores de chave duplicados `REPLACE`, `IGNORE` ou `LOCAL` for especificado, ocorrerá um erro quando for encontrado um valor de chave duplicado e o restante do arquivo de texto será ignorado.

Além de afetar o tratamento de chaves duplicadas, conforme descrito acima, `IGNORE` e `LOCAL` também afetam o tratamento de erros:

* Quando nem `IGNORE` nem `LOCAL` é especificado, erros de interpretação de dados terminam a operação.

* Quando `IGNORE`—ou `LOCAL` sem `REPLACE`—é especificado, os erros de interpretação de dados tornam-se avisos e a operação de carga continua, mesmo que o modo SQL seja restritivo. Para exemplos, veja Atribuição de Valor de Coluna.

#### Gerenciamento de Índice

Para ignorar as restrições de chave estrangeira durante a operação de carregamento, execute uma declaração `SET foreign_key_checks = 0` antes de executar [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement").

Se você usar `LOAD DATA` em uma tabela `MyISAM` vazia, todos os índices não exclusivos são criados em um lote separado (como no caso de `REPAIR TABLE`(repair-table.html "15.7.3.5 REPAIR TABLE Statement")). Normalmente, isso torna `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement") muito mais rápido quando você tem muitos índices. Em alguns casos extremos, você pode criar os índices ainda mais rápido, desligando-os com `ALTER TABLE ... DISABLE KEYS`(alter-table.html "15.1.9 ALTER TABLE Statement") antes de carregar o arquivo na tabela e recriar os índices com `ALTER TABLE ... ENABLE KEYS`(alter-table.html "15.1.9 ALTER TABLE Statement") após carregar o arquivo. Veja a Seção 10.2.5.1, “Otimizando Entradas de Inserção”.

#### Manipulação de Campo e Linha

Para as declarações `LOAD DATA` e `SELECT ... INTO OUTFILE` (select-into.html "15.2.13.1 SELECT ... INTO Statement"), a sintaxe das cláusulas `FIELDS` e `LINES` é a mesma. Ambas as cláusulas são opcionais, mas `FIELDS` deve preceder `LINES` se ambas forem especificadas.

Se você especificar uma cláusula `FIELDS`, cada uma de suas subcláusulas (`TERMINATED BY`, `[OPTIONALLY] ENCLOSED BY` e `ESCAPED BY`) também é opcional, exceto que você deve especificar pelo menos uma delas. Os argumentos dessas cláusulas são permitidos para conter apenas caracteres ASCII.

Se você não especificar nenhuma cláusula `FIELDS` ou `LINES`, os valores padrão são os mesmos se você tivesse escrito o seguinte:

```
FIELDS TERMINATED BY '\t' ENCLOSED BY '' ESCAPED BY '\\'
LINES TERMINATED BY '\n' STARTING BY ''
```

O backslash é o caractere de fuga do MySQL dentro das strings nas declarações SQL. Assim, para especificar um backslash literal, você deve especificar dois backslashes para que o valor seja interpretado como um único backslash. As sequências de escape `'\t'` e `'\n'` especificam, respectivamente, caracteres de tabulação e nova linha.

Em outras palavras, os padrões fazem com que `LOAD DATA` (load-data.html "15.2.9 LOAD DATA Statement") atue da seguinte forma ao ler a entrada:

* Procure limites de linha em novas linhas.
* Não ignore nenhum prefixo de linha.
* Divida as linhas em campos com tabulações.
* Não espere que os campos estejam encerrados por quaisquer caracteres de citação.

* Interprete os caracteres precedidos pelo caractere de escape `\` como sequências de escape. Por exemplo, `\t`, `\n` e `\\` significam, respectivamente, tabulação, nova linha e barra invertida. Consulte a discussão de `FIELDS ESCAPED BY` mais adiante para obter a lista completa de sequências de escape.

Por outro lado, os defeitos fazem com que `SELECT ... INTO OUTFILE`(select-into.html "15.2.13.1 SELECT ... INTO Statement") atue da seguinte forma ao escrever a saída:

* Escreva guias entre os campos.
* Não inclua campos dentro de caracteres de citação.
* Use `\` para escapar instâncias de guia, nova linha ou `\` que ocorram dentro dos valores dos campos.

* Escreva novas linhas nas extremidades das linhas.

Nota

Para um arquivo de texto gerado em um sistema Windows, a leitura adequada do arquivo pode exigir `LINES TERMINATED BY '\r\n'`, pois os programas do Windows geralmente usam dois caracteres como terminador de linha. Alguns programas, como o **WordPad**, podem usar `\r` como terminador de linha ao escrever arquivos. Para ler tais arquivos, use `LINES TERMINATED BY '\r'`.

Se todas as linhas de entrada tiverem um prefixo comum que você deseja ignorar, você pode usar `LINES STARTING BY 'prefix_string'` para ignorar o prefixo *e qualquer coisa antes dele*. Se uma linha não incluir o prefixo, toda a linha é ignorada. Suponha que você emita a seguinte declaração:

```
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test
  FIELDS TERMINATED BY ','  LINES STARTING BY 'xxx';
```

Se o arquivo de dados tiver este formato:

```
xxx"abc",1
something xxx"def",2
"ghi",3
```

As linhas resultantes são `("abc",1)` e `("def",2)`. A terceira linha do arquivo é ignorada porque não contém o prefixo.

A cláusula `IGNORE number LINES` pode ser usada para ignorar linhas no início do arquivo. Por exemplo, você pode usar `IGNORE 1 LINES` para ignorar uma linha de cabeçalho inicial que contém os nomes das colunas:

```
LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test IGNORE 1 LINES;
```

Quando você usa `SELECT ... INTO OUTFILE` em conjunto com (select-into.html "15.2.13.1 SELECT ... INTO Statement") para escrever dados de um banco de dados em um arquivo e, em seguida, ler o arquivo de volta ao banco de dados mais tarde, as opções de manipulação de campos e linhas para ambas as declarações devem corresponder. Caso contrário, `LOAD DATA` não interpreta os conteúdos do arquivo corretamente. Suponha que você use `SELECT ... INTO OUTFILE` para escrever um arquivo com campos delimitados por vírgulas:

```
SELECT * INTO OUTFILE 'data.txt'
  FIELDS TERMINATED BY ','
  FROM table2;
```

Para ler o arquivo delimitado por vírgula, a declaração correta é:

```
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY ',';
```

Se, em vez disso, você tentasse ler o arquivo com a declaração mostrada a seguir, não funcionaria, porque instrui o `LOAD DATA` a procurar guias entre os campos:

```
LOAD DATA INFILE 'data.txt' INTO TABLE table2
  FIELDS TERMINATED BY '\t';
```

O resultado provável é que cada linha de entrada seria interpretada como um único campo.

`LOAD DATA` pode ser usado para ler arquivos obtidos de fontes externas. Por exemplo, muitos programas podem exportar dados no formato de valores separados por vírgula (CSV), de modo que as linhas tenham campos separados por vírgulas e encerrados entre aspas duplas, com uma linha inicial de nomes de colunas. Se as linhas em tal arquivo forem terminadas por pares de retorno de carro/nova linha, a declaração mostrada aqui ilustra as opções de manipulação de campos e linhas que você usaria para carregar o arquivo:

```
LOAD DATA INFILE 'data.txt' INTO TABLE tbl_name
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\r\n'
  IGNORE 1 LINES;
```

Se os valores de entrada não forem necessariamente encerrados entre aspas, use `OPTIONALLY` antes da opção `ENCLOSED BY`.

Qualquer uma das opções de manipulação de campo ou linha pode especificar uma string vazia (`''`). Se não estiver vazia, os valores de `FIELDS [OPTIONALLY] ENCLOSED BY` e `FIELDS ESCAPED BY` devem ser um único caractere. Os valores de `FIELDS TERMINATED BY`, `LINES STARTING BY` e `LINES TERMINATED BY` podem ser mais de um caractere. Por exemplo, para escrever linhas que são terminadas por pares de retorno de carro/retorno de linha, ou para ler um arquivo contendo tais linhas, especifique uma cláusula de `LINES TERMINATED BY '\r\n'`.

Para ler um arquivo que contém piadas separadas por linhas que consistem em `%%`, você pode fazer isso

```
CREATE TABLE jokes
  (a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  joke TEXT NOT NULL);
LOAD DATA INFILE '/tmp/jokes.txt' INTO TABLE jokes
  FIELDS TERMINATED BY ''
  LINES TERMINATED BY '\n%%\n' (joke);
```

`FIELDS [OPTIONALLY] ENCLOSED BY` controla a citação de campos. Para a saída ([`SELECT ... INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement")), se você omitir a palavra `OPTIONALLY`, todos os campos são fechados pelo caractere `ENCLOSED BY`. Um exemplo de tal saída (usando uma vírgula como delimitador de campo) é mostrado aqui:

```
"1","a string","100.20"
"2","a string containing a , comma","102.20"
"3","a string containing a \" quote","102.20"
"4","a string containing a \", quote and comma","102.20"
```

Se você especificar `OPTIONALLY`, o caractere `ENCLOSED BY` é usado apenas para encerrar valores de colunas que têm um tipo de dados de string (como `CHAR`, `BINARY`, `TEXT` ou `ENUM`):

```
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a \" quote",102.20
4,"a string containing a \", quote and comma",102.20
```

Os ocorrencias do caractere `ENCLOSED BY` dentro de um valor de campo são escapadas prefixando-os com o caractere `ESCAPED BY`. Além disso, se você especificar um valor vazio `ESCAPED BY`, é possível gerar inadvertidamente uma saída que não pode ser lida corretamente pelo `LOAD DATA`. Por exemplo, a saída anterior que acabou de ser mostrada apareceria da seguinte forma se o caractere de escape estiver vazio. Observe que o segundo campo na quarta linha contém uma vírgula após a citação, que (erradamente) parece terminar o campo:

```
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a " quote",102.20
4,"a string containing a ", quote and comma",102.20
```

Para a entrada, o caractere `ENCLOSED BY` (se presente) é removido das extremidades dos valores do campo. (Isso é verdadeiro, independentemente de `OPTIONALLY` ser especificado; `OPTIONALLY` não tem efeito na interpretação da entrada.) Ocorrências do caractere `ENCLOSED BY` precedidas pelo caractere `ESCAPED BY` são interpretadas como parte do valor atual do campo.

Se o campo começar com o caractere `ENCLOSED BY`, as ocorrências desse caractere são reconhecidas como terminando um valor de campo apenas se forem seguidas pela sequência de campo ou linha `TERMINATED BY`. Para evitar ambiguidade, as ocorrências do caractere `ENCLOSED BY` dentro de um valor de campo podem ser duplicadas e são interpretadas como uma única ocorrência do caractere. Por exemplo, se `ENCLOSED BY '"'` for especificado, as aspas são tratadas como mostrado aqui:

```
"The ""BIG"" boss"  -> The "BIG" boss
The "BIG" boss      -> The "BIG" boss
The ""BIG"" boss    -> The ""BIG"" boss
```

`FIELDS ESCAPED BY` controla como ler ou escrever caracteres especiais:

* Para entrada, se o caractere `FIELDS ESCAPED BY` não estiver vazio, as ocorrências desse caractere são removidas e o caractere seguinte é tomado literalmente como parte do valor de um campo. Algumas sequências de dois caracteres que são exceções, onde o primeiro caractere é o caractere de escape. Essas sequências são mostradas na tabela a seguir (usando `\` para o caractere de escape). As regras para o tratamento de `NULL` são descritas mais adiante nesta seção.

  <table summary="Two-character sequences for which the first character (a \) is the escape character."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Character</th> <th>Sequência de fuga</th> </tr></thead><tbody><tr> <td><code>\0</code></td> <td>Um ASCII NUL (<code>X'00'</code>) personagem</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere de recuo</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação.</td> </tr><tr> <td><code>\Z</code></td> <td>ASCII 26 (Ctrl+Z)</td> </tr><tr> <td><code>\N</code></td> <td>NULL</td> </tr></tbody></table>

Para mais informações sobre a sintaxe de `\`-escape, consulte a Seção 11.1.1, “Literais de String”.

Se o caractere `FIELDS ESCAPED BY` estiver vazio, a interpretação da sequência de escape não ocorre.

* Para a saída, se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado para prefixar os caracteres seguintes na saída:

+ O caractere `FIELDS ESCAPED BY`.  
+ O caractere `FIELDS [OPTIONALLY] ENCLOSED BY`.

+ O primeiro caractere dos valores de `FIELDS TERMINATED BY` e `LINES TERMINATED BY`, se o caractere `ENCLOSED BY` estiver vazio ou não especificado.

+ ASCII `0` (o que é realmente escrito após o caractere de escape é ASCII `0`, não um byte de valor nulo).

Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere é escapado e `NULL` é exibido como `NULL`, e não `\N`. Provavelmente não é uma boa ideia especificar um caractere de escape vazio, especialmente se os valores dos campos em seus dados contiverem algum dos caracteres da lista que acabou de ser fornecida.

Em certos casos, as opções de manipulação de campo e linha interagem:

* Se `LINES TERMINATED BY` for uma string vazia e `FIELDS TERMINATED BY` não estiver vazia, as linhas também são terminadas com `FIELDS TERMINATED BY`.

* Se os valores de `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estiverem ambos vazios (`''`), é utilizado um formato de linha fixa (não delimitado). Com o formato de linha fixa, não são utilizados delimitadores entre os campos (mas você ainda pode ter um terminador de linha). Em vez disso, os valores das colunas são lidos e escritos usando uma largura de campo o suficiente para conter todos os valores no campo. Para `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), as larguras dos campos são 4, 6, 8, 11 e 20, respectivamente, independentemente da largura de exibição declarada.

`LINES TERMINATED BY` ainda é usado para separar as linhas. Se uma linha não contiver todos os campos, o resto das colunas é definido com seus valores padrão. Se você não tem um finalizador de linha, deve definir isso para `''`. Neste caso, o arquivo de texto deve conter todos os campos para cada linha.

O formato de linha fixa também afeta o manuseio dos valores de `NULL`, conforme descrito mais adiante.

Nota

O formato de tamanho fixo não funciona se você estiver usando um conjunto de caracteres multibyte.

O tratamento dos valores de `NULL` varia de acordo com as opções de `FIELDS` e `LINES` em uso:

* Para os valores padrão `FIELDS` e `LINES`, `NULL` é escrito como um valor de campo de `\N` para saída, e um valor de campo de `\N` é lido como `NULL` para entrada (assumindo que o caractere `ESCAPED BY` é `\`).

* Se `FIELDS ENCLOSED BY` não estiver vazio, um campo que contém a palavra literal `NULL` como seu valor é lido como um valor de `NULL`. Isso difere da palavra `NULL` encerrada dentro de caracteres `FIELDS ENCLOSED BY`, que é lida como a string `'NULL'`.

* Se `FIELDS ESCAPED BY` estiver vazio, `NULL` é escrito como a palavra `NULL`.

* Com o formato de linha fixa (que é usado quando `FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` estão ambos vazios), `NULL` é escrito como uma string vazia. Isso faz com que tanto os valores de `NULL` quanto as strings vazias na tabela sejam indistinguíveis quando escritos no arquivo, porque ambos são escritos como strings vazias. Se você precisa ser capaz de distinguir os dois quando lê o arquivo novamente, você não deve usar o formato de linha fixa.

Uma tentativa de carregar `NULL` em uma coluna `NOT NULL` produz um aviso ou um erro de acordo com as regras descritas na Atribuição de Valor da Coluna.

Alguns casos não são suportados por `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement"):

* Linhas de tamanho fixo (`FIELDS TERMINATED BY` e `FIELDS ENCLOSED BY` vazias) e colunas `BLOB` ou `TEXT`.

* Se você especificar um separador que é o mesmo que outro ou um prefixo dele, `LOAD DATA` não pode interpretar a entrada corretamente. Por exemplo, a seguinte cláusula `FIELDS` causaria problemas:

  ```
  FIELDS TERMINATED BY '"' ENCLOSED BY '"'
  ```

* Se `FIELDS ESCAPED BY` estiver vazio, um valor de campo que contém uma ocorrência de `FIELDS ENCLOSED BY` ou `LINES TERMINATED BY`, seguida pelo valor de `FIELDS TERMINATED BY`, faz com que [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") pare de ler um campo ou linha muito cedo. Isso acontece porque [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") não pode determinar corretamente onde o valor do campo ou linha termina.

#### Especificação da Lista de Colunas

O exemplo a seguir carrega todas as colunas da tabela `persondata`:

```
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata;
```

Por padrão, quando não é fornecida uma lista de colunas no final da declaração `LOAD DATA`, espera-se que as linhas de entrada contenham um campo para cada coluna da tabela. Se você deseja carregar apenas algumas das colunas de uma tabela, especifique uma lista de colunas:

```
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata
(col_name_or_user_var [, col_name_or_user_var] ...);
```

Você também deve especificar uma lista de colunas se a ordem dos campos no arquivo de entrada for diferente da ordem das colunas na tabela. Caso contrário, o MySQL não consegue determinar como combinar os campos de entrada com as colunas da tabela.

#### Pré-processamento de entrada

Cada instância de *`col_name_or_user_var`* na sintaxe de `LOAD DATA` é ou um nome de coluna ou uma variável do usuário. Com as variáveis do usuário, a cláusula `SET` permite que você realize transformações de pré-processamento em seus valores antes de atribuir o resultado às colunas.

As variáveis de usuário na cláusula `SET` podem ser usadas de várias maneiras. O exemplo a seguir usa a primeira coluna de entrada diretamente para o valor de `t1.column1`, e atribui a segunda coluna de entrada a uma variável de usuário que é submetida a uma operação de divisão antes de ser usada para o valor de `t1.column2`:

```
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @var1)
  SET column2 = @var1/100;
```

A cláusula `SET` pode ser usada para fornecer valores que não são derivados do arquivo de entrada. A seguinte declaração define `column3` para a data e hora atuais:

```
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, column2)
  SET column3 = CURRENT_TIMESTAMP;
```

Você também pode descartar um valor de entrada ao atribuí-lo a uma variável do usuário e não atribuir a variável a nenhuma coluna da tabela:

```
LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, @dummy, column2, @dummy, column3);
```

O uso da lista de colunas/variáveis e da cláusula `SET` está sujeito às seguintes restrições:

* As atribuições na cláusula `SET` devem ter apenas nomes de colunas do lado esquerdo dos operadores de atribuição.

* Você pode usar subconsultas no lado direito das atribuições de `SET`. Uma subconsulta que retorna um valor a ser atribuído a uma coluna pode ser apenas uma subconsulta escalar. Além disso, você não pode usar uma subconsulta para selecionar a tabela que está sendo carregada.

* As linhas ignoradas por uma cláusula `IGNORE number LINES` não são processadas para a lista de colunas/variáveis ou cláusula `SET`.

* As variáveis do usuário não podem ser usadas ao carregar dados com formato de linha fixa, porque as variáveis do usuário não têm largura de exibição.

#### Atribuição de Valor à Coluna

Para processar uma linha de entrada, `LOAD DATA` (load-data.html "15.2.9 LOAD DATA Statement") a divide em campos e utiliza os valores de acordo com a lista de colunas/variáveis e a cláusula `SET`, se estiverem presentes. Em seguida, a linha resultante é inserida na tabela. Se houver gatilhos `BEFORE INSERT` ou `AFTER INSERT` para a tabela, eles são ativados antes ou após a inserção da linha, respectivamente.

A interpretação dos valores do campo e a atribuição às colunas da tabela dependem desses fatores:

* O modo SQL (o valor da variável de sistema `sql_mode`). O modo pode ser não restritivo ou restritivo de várias maneiras. Por exemplo, o modo SQL estrito pode ser habilitado, ou o modo pode incluir valores como `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE`.

* Presença ou ausência dos modificadores `IGNORE` e `LOCAL`.

Esses fatores combinam para produzir uma interpretação de dados restritiva ou não restritiva por `LOAD DATA`:

* A interpretação dos dados é restritiva se o modo SQL for restritivo e nem o modificador `IGNORE` nem o `LOCAL` for especificado. Os erros terminam a operação de carregamento.

A interpretação dos dados não é restritiva se o modo SQL não for restritivo ou se o modificador `IGNORE` ou `LOCAL` for especificado. (Em particular, qualquer modificador especificado *sobrepõe* um modo SQL restritivo quando o modificador `REPLACE` é omitido.) Os erros se tornam avisos e a operação de carga continua.

A interpretação restritiva dos dados utiliza essas regras:

* Ter muitos ou poucos campos resulta em um erro.
* Atribuir `NULL` (ou seja, `\N`) a uma coluna que não é `NULL` resulta em um erro.

* Um valor que está fora do intervalo para o tipo de dados da coluna resulta em um erro.

* Os valores inválidos produzem erros. Por exemplo, um valor como `'x'` para uma coluna numérica resulta em um erro, não em conversão para 0.

Em contraste, a interpretação de dados não restritiva utiliza essas regras:

* Se uma linha de entrada tiver muitos campos, os campos extras são ignorados e o número de avisos é incrementado.

* Se uma linha de entrada tiver poucos campos, as colunas nas quais os campos de entrada estão ausentes são atribuídos seus valores padrão. A atribuição de valores padrão de tipo de dados é descrita na Seção 13.6, “Valores padrão de tipo de dados”.

Atribuir `NULL` (ou seja, `\N`) a uma coluna que não é `NULL` resulta na atribuição do valor padrão implícito para o tipo de dados da coluna. Os valores padrão implícitos são descritos na Seção 13.6, “Valores padrão do tipo de dados”.

* Os valores inválidos produzem avisos em vez de erros e são convertidos para o valor "mais próximo" válido para o tipo de dados da coluna. Exemplos:

+ Um valor como `'x'` para uma coluna numérica resulta em conversão para 0.

+ Um valor numérico ou temporal fora do intervalo é recortado para o ponto final mais próximo do intervalo para o tipo de dados da coluna.

+ Um valor inválido para uma coluna `DATETIME`, `DATE` ou `TIME` é inserido como o valor padrão implícito, independentemente da configuração do modo SQL `NO_ZERO_DATE`. O valor padrão implícito é o apropriado “zero” para o tipo (`'0000-00-00 00:00:00'`, `'0000-00-00'` ou `'00:00:00'`). Veja a Seção 13.2, “Tipos de Dados de Data e Hora”.

* `LOAD DATA` interpreta um valor de campo vazio de maneira diferente de um campo ausente:

+ Para tipos de string, a coluna é definida como uma string vazia.  
+ Para tipos numéricos, a coluna é definida como `0`.

+ Para os tipos de data e hora, a coluna é definida com o valor apropriado para o tipo. Veja a Seção 13.2, “Tipos de dados de data e hora”.

Esses são os mesmos valores que resultam se você atribuir uma string vazia explicitamente a um tipo de string, numérico ou de data ou hora explicitamente em uma declaração `INSERT` ou `UPDATE`.

As colunas `TIMESTAMP` são definidas para a data e hora atuais apenas se houver um valor `NULL` para a coluna (ou seja, `\N`) e a coluna não for declarada para permitir valores `NULL`, ou se o valor padrão da coluna `TIMESTAMP` for o timestamp atual e ele for omitido da lista de campos quando uma lista de campos é especificada.

`LOAD DATA` considera todos os dados como strings, portanto, você não pode usar valores numéricos para as colunas `ENUM` ou `SET` da mesma maneira que pode com as declarações `INSERT`. Todos os valores de `ENUM` e `SET` devem ser especificados como strings.

Os valores de `BIT` não podem ser carregados diretamente usando notação binária (por exemplo, `b'011010'`). Para contornar isso, use a cláusula `SET` para remover os `b'` e `'` iniciais e finais e realize uma conversão de base-2 para base-10 para que o MySQL carregue os valores na coluna `BIT` corretamente:

```
$> cat /tmp/bit_test.txt
b'10'
b'1111111'
$> mysql test
mysql> LOAD DATA INFILE '/tmp/bit_test.txt'
       INTO TABLE bit_test (@var1)
       SET b = CAST(CONV(MID(@var1, 3, LENGTH(@var1)-3), 2, 10) AS UNSIGNED);
Query OK, 2 rows affected (0.00 sec)
Records: 2  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT BIN(b+0) FROM bit_test;
+----------+
| BIN(b+0) |
+----------+
| 10       |
| 1111111  |
+----------+
2 rows in set (0.00 sec)
```

Para os valores de `BIT` na notação binária de `0b` (por exemplo, `0b011010`, use esta cláusula de `SET` em vez disso para remover o `0b` inicial:

```
SET b = CAST(CONV(MID(@var1, 3, LENGTH(@var1)-2), 2, 10) AS UNSIGNED)
```

#### Suporte para Tabela Partida

`LOAD DATA` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de um ou mais nomes separados por vírgula de partições, subpartições ou ambos. Quando esta cláusula é usada, se quaisquer linhas do arquivo não puderem ser inseridas em nenhuma das partições ou subpartições nomeadas na lista, a declaração falha com o erro Encontrou uma linha que não corresponde ao conjunto de partições dado. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

#### Considerações sobre Concorrência

Com o modificador `LOW_PRIORITY`, a execução da declaração `LOAD DATA` é adiada até que nenhum outro cliente esteja lendo a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

Com o modificador `CONCURRENT` e uma tabela `MyISAM` que satisfaça a condição para inserções concorrentes (ou seja, que não contenha blocos livres no meio), outros threads podem recuperar dados da tabela enquanto o `LOAD DATA` está sendo executado. Este modificador afeta um pouco o desempenho do [`LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement")], mesmo que nenhum outro thread esteja usando a tabela ao mesmo tempo.

#### Informações sobre o resultado da declaração

Quando a declaração `LOAD DATA` terminar, ela retorna uma string de informações no seguinte formato:

```
Records: 1  Deleted: 0  Skipped: 0  Warnings: 0
```

As advertências ocorrem nas mesmas circunstâncias em que os valores são inseridos usando a declaração `INSERT` (consulte Seção 15.2.7, “Declaração INSERT”), exceto que `LOAD DATA` também gera advertências quando há poucos ou muitos campos na linha de entrada.

Você pode usar `SHOW WARNINGS` para obter uma lista dos primeiros avisos `max_error_count` como informações sobre o que deu errado. Veja a Seção 15.7.7.42, “Declaração de avisos”.

Se você estiver usando a API C, pode obter informações sobre a declaração chamando a função `mysql_info()`. Veja mysql_info().

#### Considerações sobre a replicação

`LOAD DATA` é considerado inseguro para replicação baseada em declarações. Se você usar `LOAD DATA` com `binlog_format=STATEMENT`, cada replica na qual as alterações devem ser aplicadas cria um arquivo temporário contendo os dados. Este arquivo temporário não é criptografado, mesmo que a criptografia de log binário esteja ativa na fonte. Se a criptografia for necessária, use o formato de registro baseado em linhas ou misto, para o qual as réplicas não criam o arquivo temporário. Para mais informações sobre a interação entre `LOAD DATA` e a replicação, consulte a Seção 19.5.1.19, “Replicação e LOAD DATA”.

#### Tópicos Diversos

Em Unix, se você precisar de `LOAD DATA` para ler de uma tubulação, você pode usar a seguinte técnica (o exemplo carrega uma lista do diretório `/` na tabela `db1.t1`):

```
mkfifo /mysql/data/db1/ls.dat
chmod 666 /mysql/data/db1/ls.dat
find / -ls > /mysql/data/db1/ls.dat &
mysql -e "LOAD DATA INFILE 'ls.dat' INTO TABLE t1" db1
```

Aqui, você deve executar o comando que gera os dados a serem carregados e os comandos **mysql** em terminais separados, ou executar o processo de geração de dados em segundo plano (como mostrado no exemplo anterior). Se você não fizer isso, o tubo fica bloqueado até que os dados sejam lidos pelo processo **mysql**.

### 15.2.10 Declaração de CARREGAR XML

```
LOAD XML
    [LOW_PRIORITY | CONCURRENT] [LOCAL]
    INFILE 'file_name'
    [REPLACE | IGNORE]
    INTO TABLE [db_name.]tbl_name
    [CHARACTER SET charset_name]
    [ROWS IDENTIFIED BY '<tagname>']
    [IGNORE number {LINES | ROWS}]
    [(field_name_or_user_var
        [, field_name_or_user_var] ...)]
    [SET col_name={expr | DEFAULT}
        [, col_name={expr | DEFAULT}] ...]
```

A declaração `LOAD XML` lê dados de um arquivo XML em uma tabela. O *`file_name`* deve ser fornecido como uma string literal. O *`tagname`* na cláusula opcional `ROWS IDENTIFIED BY` também deve ser fornecido como uma string literal, e deve ser rodeado por chaves angulares (`<` e `>`).

`LOAD XML` atua como complemento para executar o cliente **mysql** no modo de saída XML (ou seja, iniciar o cliente com a opção `--xml`). Para escrever dados de uma tabela em um arquivo XML, você pode invocar o cliente **mysql** com as opções `--xml` e `-e` a partir da linha de comandos do sistema, conforme mostrado aqui:

```
$> mysql --xml -e 'SELECT * FROM mydb.mytable' > file.xml
```

Para ler o arquivo de volta em uma tabela, use `LOAD XML`(load-xml.html "15.2.10 LOAD XML Statement"). Por padrão, o elemento `<row>` é considerado equivalente a uma linha de tabela de banco de dados; isso pode ser alterado usando a cláusula `ROWS IDENTIFIED BY`.

Esta declaração suporta três formatos XML diferentes:

* Nomes das colunas como atributos e valores das colunas como valores de atributo:

  ```
  <row column1="value1" column2="value2" .../>
  ```

* Nomes das colunas como etiquetas e valores das colunas como conteúdo dessas etiquetas:

  ```
  <row>
    <column1>value1</column1>
    <column2>value2</column2>
  </row>
  ```

* Os nomes das colunas são os atributos `name` das etiquetas `<field>`, e os valores são os conteúdos dessas etiquetas:

  ```
  <row>
    <field name='column1'>value1</field>
    <field name='column2'>value2</field>
  </row>
  ```

Este é o formato utilizado por outras ferramentas do MySQL, como o **mysqldump**.

Todos os três formatos podem ser usados no mesmo arquivo XML; a rotina de importação detecta automaticamente o formato de cada linha e interpreta-o corretamente. As tags são correspondidas com base no nome da tag ou atributo e no nome da coluna.

Antes do MySQL 8.0.21, o `LOAD XML` não suportava as seções do `CDATA` no XML de origem. (Bug #30753708, Bug #98199)

As seguintes cláusulas funcionam essencialmente da mesma maneira para `LOAD XML` como para `LOAD DATA`:

* `LOW_PRIORITY` ou `CONCURRENT`

* `LOCAL`
* `REPLACE` ou `IGNORE`
* `CHARACTER SET`
* `SET`

Consulte a Seção 15.2.9, “Instrução LOAD DATA”, para obter mais informações sobre essas cláusulas.

`(field_name_or_user_var, ...)` é uma lista de um ou mais campos XML separados por vírgula ou variáveis de usuário. O nome de uma variável de usuário usada para esse propósito deve corresponder ao nome de um campo do arquivo XML, precedido por `@`. Você pode usar os nomes dos campos para selecionar apenas os campos desejados. As variáveis de usuário podem ser empregadas para armazenar os valores correspondentes dos campos para uso subsequente.

A cláusula `IGNORE number LINES` ou `IGNORE number ROWS` faz com que as primeiras linhas *`number`* no arquivo XML sejam ignoradas. É análogo à cláusula `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement") da cláusula `IGNORE ... LINES`.

Suponha que tenhamos uma tabela chamada `person`, criada conforme mostrado aqui:

```
USE test;

CREATE TABLE person (
    person_id INT NOT NULL PRIMARY KEY,
    fname VARCHAR(40) NULL,
    lname VARCHAR(40) NULL,
    created TIMESTAMP
);
```

Suponha que, inicialmente, essa tabela esteja vazia.

Agora, vamos supor que temos um arquivo XML simples `person.xml`, cujos conteúdos são mostrados aqui:

```
<list>
  <person person_id="1" fname="Kapek" lname="Sainnouine"/>
  <person person_id="2" fname="Sajon" lname="Rondela"/>
  <person person_id="3"><fname>Likame</fname><lname>Örrtmons</lname></person>
  <person person_id="4"><fname>Slar</fname><lname>Manlanth</lname></person>
  <person><field name="person_id">5</field><field name="fname">Stoma</field>
    <field name="lname">Milu</field></person>
  <person><field name="person_id">6</field><field name="fname">Nirtam</field>
    <field name="lname">Sklöd</field></person>
  <person person_id="7"><fname>Sungam</fname><lname>Dulbåd</lname></person>
  <person person_id="8" fname="Sraref" lname="Encmelt"/>
</list>
```

Cada um dos formatos XML permitidos discutidos anteriormente é representado neste arquivo de exemplo.

Para importar os dados do `person.xml` para a tabela `person`, você pode usar esta declaração:

```
mysql> LOAD XML LOCAL INFILE 'person.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';

Query OK, 8 rows affected (0.00 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0
```

Aqui, assumimos que `person.xml` está localizado no diretório de dados do MySQL. Se o arquivo não for encontrado, o seguinte erro será gerado:

```
ERROR 2 (HY000): File '/person.xml' not found (Errcode: 2)
```

A cláusula `ROWS IDENTIFIED BY '<person>'` significa que cada elemento `<person>` no arquivo XML é considerado equivalente a uma linha na tabela na qual os dados devem ser importados. Neste caso, esta é a tabela `person` no banco de dados `test`.

Como pode ser visto na resposta do servidor, 8 linhas foram importadas na tabela `test.person`. Isso pode ser verificado por meio de uma simples declaração `SELECT`:

```
mysql> SELECT * FROM person;
+-----------+--------+------------+---------------------+
| person_id | fname  | lname      | created             |
+-----------+--------+------------+---------------------+
|         1 | Kapek  | Sainnouine | 2007-07-13 16:18:47 |
|         2 | Sajon  | Rondela    | 2007-07-13 16:18:47 |
|         3 | Likame | Örrtmons   | 2007-07-13 16:18:47 |
|         4 | Slar   | Manlanth   | 2007-07-13 16:18:47 |
|         5 | Stoma  | Nilu       | 2007-07-13 16:18:47 |
|         6 | Nirtam | Sklöd      | 2007-07-13 16:18:47 |
|         7 | Sungam | Dulbåd     | 2007-07-13 16:18:47 |
|         8 | Sreraf | Encmelt    | 2007-07-13 16:18:47 |
+-----------+--------+------------+---------------------+
8 rows in set (0.00 sec)
```

Isso mostra, conforme mencionado anteriormente nesta seção, que qualquer um ou todos os 3 formatos XML permitidos podem aparecer em um único arquivo e serem lidos usando `LOAD XML`.

A operação inversa da operação de importação que acabou de ser mostrada, ou seja, a liberação dos dados da tabela do MySQL em um arquivo XML, pode ser realizada usando o cliente **mysql** do shell do sistema, conforme mostrado aqui:

```
$> mysql --xml -e "SELECT * FROM test.person" > person-dump.xml
$> cat person-dump.xml
<?xml version="1.0"?>

<resultset statement="SELECT * FROM test.person" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <row>
	<field name="person_id">1</field>
	<field name="fname">Kapek</field>
	<field name="lname">Sainnouine</field>
  </row>

  <row>
	<field name="person_id">2</field>
	<field name="fname">Sajon</field>
	<field name="lname">Rondela</field>
  </row>

  <row>
	<field name="person_id">3</field>
	<field name="fname">Likema</field>
	<field name="lname">Örrtmons</field>
  </row>

  <row>
	<field name="person_id">4</field>
	<field name="fname">Slar</field>
	<field name="lname">Manlanth</field>
  </row>

  <row>
	<field name="person_id">5</field>
	<field name="fname">Stoma</field>
	<field name="lname">Nilu</field>
  </row>

  <row>
	<field name="person_id">6</field>
	<field name="fname">Nirtam</field>
	<field name="lname">Sklöd</field>
  </row>

  <row>
	<field name="person_id">7</field>
	<field name="fname">Sungam</field>
	<field name="lname">Dulbåd</field>
  </row>

  <row>
	<field name="person_id">8</field>
	<field name="fname">Sreraf</field>
	<field name="lname">Encmelt</field>
  </row>
</resultset>
```

Nota

A opção `--xml` faz com que o cliente **mysql** use o formato XML para sua saída; a opção `-e` faz com que o cliente execute a instrução SQL imediatamente após a opção. Veja a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

Você pode verificar se o dump é válido ao criar uma cópia da tabela `person` e importar o arquivo de dump na nova tabela, da seguinte forma:

```
mysql> USE test;
mysql> CREATE TABLE person2 LIKE person;
Query OK, 0 rows affected (0.00 sec)

mysql> LOAD XML LOCAL INFILE 'person-dump.xml'
    ->   INTO TABLE person2;
Query OK, 8 rows affected (0.01 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT * FROM person2;
+-----------+--------+------------+---------------------+
| person_id | fname  | lname      | created             |
+-----------+--------+------------+---------------------+
|         1 | Kapek  | Sainnouine | 2007-07-13 16:18:47 |
|         2 | Sajon  | Rondela    | 2007-07-13 16:18:47 |
|         3 | Likema | Örrtmons   | 2007-07-13 16:18:47 |
|         4 | Slar   | Manlanth   | 2007-07-13 16:18:47 |
|         5 | Stoma  | Nilu       | 2007-07-13 16:18:47 |
|         6 | Nirtam | Sklöd      | 2007-07-13 16:18:47 |
|         7 | Sungam | Dulbåd     | 2007-07-13 16:18:47 |
|         8 | Sreraf | Encmelt    | 2007-07-13 16:18:47 |
+-----------+--------+------------+---------------------+
8 rows in set (0.00 sec)
```

Não há necessidade de cada campo no arquivo XML ser correspondido a uma coluna na tabela correspondente. Os campos que não têm colunas correspondentes são ignorados. Você pode ver isso primeiro esvaziando a tabela `person2` e excluindo a coluna `created`, em seguida, usando a mesma declaração `LOAD XML` que acabamos de empregar anteriormente, como este:

```
mysql> TRUNCATE person2;
Query OK, 8 rows affected (0.26 sec)

mysql> ALTER TABLE person2 DROP COLUMN created;
Query OK, 0 rows affected (0.52 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE person2\G
*************************** 1. row ***************************
       Table: person2
Create Table: CREATE TABLE `person2` (
  `person_id` int NOT NULL,
  `fname` varchar(40) DEFAULT NULL,
  `lname` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> LOAD XML LOCAL INFILE 'person-dump.xml'
    ->   INTO TABLE person2;
Query OK, 8 rows affected (0.01 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT * FROM person2;
+-----------+--------+------------+
| person_id | fname  | lname      |
+-----------+--------+------------+
|         1 | Kapek  | Sainnouine |
|         2 | Sajon  | Rondela    |
|         3 | Likema | Örrtmons   |
|         4 | Slar   | Manlanth   |
|         5 | Stoma  | Nilu       |
|         6 | Nirtam | Sklöd      |
|         7 | Sungam | Dulbåd     |
|         8 | Sreraf | Encmelt    |
+-----------+--------+------------+
8 rows in set (0.00 sec)
```

A ordem em que os campos são apresentados em cada linha do arquivo XML não afeta o funcionamento do `LOAD XML`(load-xml.html "15.2.10 LOAD XML Statement"); a ordem dos campos pode variar de uma linha para outra e não é necessário que esteja no mesmo ordem que as colunas correspondentes na tabela.

Como mencionado anteriormente, você pode usar uma lista `(field_name_or_user_var, ...)` de um ou mais campos XML (para selecionar apenas os campos desejados) ou variáveis de usuário (para armazenar os valores correspondentes do campo para uso posterior). As variáveis de usuário podem ser especialmente úteis quando você deseja inserir dados de um arquivo XML em colunas de tabela cujos nomes não correspondem aos dos campos XML. Para ver como isso funciona, primeiro criamos uma tabela chamada `individual` cuja estrutura corresponde à da tabela `person`, mas cujas colunas são nomeadas de maneira diferente:

```
mysql> CREATE TABLE individual (
    ->     individual_id INT NOT NULL PRIMARY KEY,
    ->     name1 VARCHAR(40) NULL,
    ->     name2 VARCHAR(40) NULL,
    ->     made TIMESTAMP
    -> );
Query OK, 0 rows affected (0.42 sec)
```

Neste caso, você não pode simplesmente carregar o arquivo XML diretamente na tabela, porque os nomes do campo e da coluna não correspondem:

```
mysql> LOAD XML INFILE '../bin/person-dump.xml' INTO TABLE test.individual;
ERROR 1263 (22004): Column set to default value; NULL supplied to NOT NULL column 'individual_id' at row 1
```

Isso acontece porque o servidor MySQL procura nomes de campo que correspondam aos nomes dos campos da tabela de destino. Você pode contornar esse problema selecionando os valores do campo em variáveis do usuário, depois definindo as colunas da tabela de destino iguais aos valores dessas variáveis usando `SET`. Você pode realizar ambas as operações em uma única declaração, como mostrado aqui:

```
mysql> LOAD XML INFILE '../bin/person-dump.xml'
    ->     INTO TABLE test.individual (@person_id, @fname, @lname, @created)
    ->     SET individual_id=@person_id, name1=@fname, name2=@lname, made=@created;
Query OK, 8 rows affected (0.05 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT * FROM individual;
+---------------+--------+------------+---------------------+
| individual_id | name1  | name2      | made                |
+---------------+--------+------------+---------------------+
|             1 | Kapek  | Sainnouine | 2007-07-13 16:18:47 |
|             2 | Sajon  | Rondela    | 2007-07-13 16:18:47 |
|             3 | Likema | Örrtmons   | 2007-07-13 16:18:47 |
|             4 | Slar   | Manlanth   | 2007-07-13 16:18:47 |
|             5 | Stoma  | Nilu       | 2007-07-13 16:18:47 |
|             6 | Nirtam | Sklöd      | 2007-07-13 16:18:47 |
|             7 | Sungam | Dulbåd     | 2007-07-13 16:18:47 |
|             8 | Srraf  | Encmelt    | 2007-07-13 16:18:47 |
+---------------+--------+------------+---------------------+
8 rows in set (0.00 sec)
```

Os nomes das variáveis do usuário *devem* corresponder aos campos correspondentes do arquivo XML, com a adição do prefixo `@` necessário para indicar que elas são variáveis. As variáveis do usuário não precisam ser listadas ou atribuídas na mesma ordem que os campos correspondentes.

Usando uma cláusula `ROWS IDENTIFIED BY '<tagname>'`, é possível importar dados do mesmo arquivo XML para tabelas de banco de dados com definições diferentes. Para este exemplo, suponha que você tenha um arquivo chamado `address.xml` que contém o seguinte XML:

```
<?xml version="1.0"?>

<list>
  <person person_id="1">
    <fname>Robert</fname>
    <lname>Jones</lname>
    <address address_id="1" street="Mill Creek Road" zip="45365" city="Sidney"/>
    <address address_id="2" street="Main Street" zip="28681" city="Taylorsville"/>
  </person>

  <person person_id="2">
    <fname>Mary</fname>
    <lname>Smith</lname>
    <address address_id="3" street="River Road" zip="80239" city="Denver"/>
    <!-- <address address_id="4" street="North Street" zip="37920" city="Knoxville"/> -->
  </person>

</list>
```

Você pode novamente usar a tabela `test.person` conforme definido anteriormente nesta seção, após limpar todos os registros existentes da tabela e, em seguida, mostrar sua estrutura conforme mostrado aqui:

```
mysql< TRUNCATE person;
Query OK, 0 rows affected (0.04 sec)

mysql< SHOW CREATE TABLE person\G
*************************** 1. row ***************************
       Table: person
Create Table: CREATE TABLE `person` (
  `person_id` int(11) NOT NULL,
  `fname` varchar(40) DEFAULT NULL,
  `lname` varchar(40) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Agora, crie uma tabela `address` no banco de dados `test` usando a seguinte declaração `CREATE TABLE`:

```
CREATE TABLE address (
    address_id INT NOT NULL PRIMARY KEY,
    person_id INT NULL,
    street VARCHAR(40) NULL,
    zip INT NULL,
    city VARCHAR(40) NULL,
    created TIMESTAMP
);
```

Para importar os dados do arquivo XML para a tabela `person`, execute a seguinte instrução `LOAD XML`, que especifica que as linhas devem ser especificadas pelo elemento `<person>`, conforme mostrado aqui;

```
mysql> LOAD XML LOCAL INFILE 'address.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';
Query OK, 2 rows affected (0.00 sec)
Records: 2  Deleted: 0  Skipped: 0  Warnings: 0
```

Você pode verificar que os registros foram importados usando uma declaração `SELECT`:

```
mysql> SELECT * FROM person;
+-----------+--------+-------+---------------------+
| person_id | fname  | lname | created             |
+-----------+--------+-------+---------------------+
|         1 | Robert | Jones | 2007-07-24 17:37:06 |
|         2 | Mary   | Smith | 2007-07-24 17:37:06 |
+-----------+--------+-------+---------------------+
2 rows in set (0.00 sec)
```

Como os elementos `<address>` no arquivo XML não têm colunas correspondentes na tabela `person`, eles são ignorados.

Para importar os dados dos elementos `<address>` para a tabela `address`, use a declaração `LOAD XML` mostrada aqui:

```
mysql> LOAD XML LOCAL INFILE 'address.xml'
    ->   INTO TABLE address
    ->   ROWS IDENTIFIED BY '<address>';
Query OK, 3 rows affected (0.00 sec)
Records: 3  Deleted: 0  Skipped: 0  Warnings: 0
```

Você pode ver que os dados foram importados usando uma declaração `SELECT`, como esta:

```
mysql> SELECT * FROM address;
+------------+-----------+-----------------+-------+--------------+---------------------+
| address_id | person_id | street          | zip   | city         | created             |
+------------+-----------+-----------------+-------+--------------+---------------------+
|          1 |         1 | Mill Creek Road | 45365 | Sidney       | 2007-07-24 17:37:37 |
|          2 |         1 | Main Street     | 28681 | Taylorsville | 2007-07-24 17:37:37 |
|          3 |         2 | River Road      | 80239 | Denver       | 2007-07-24 17:37:37 |
+------------+-----------+-----------------+-------+--------------+---------------------+
3 rows in set (0.00 sec)
```

Os dados do elemento `<address>` que está encerrado em comentários XML não são importados. No entanto, uma vez que há uma coluna `person_id` na tabela `address`, o valor do atributo `person_id` do elemento pai `<person>` para cada `<address>` *é* importado para a tabela `address`.

**Considerações de segurança.** Assim como a declaração `LOAD DATA`, a transferência do arquivo XML do host do cliente para o host do servidor é iniciada pelo servidor MySQL. Em teoria, pode-se construir um servidor com correções que informará ao programa do cliente que transfira um arquivo escolhido pelo servidor, em vez do arquivo nomeado pelo cliente na declaração `LOAD XML`(load-xml.html "15.2.10 LOAD XML Statement"). Tal servidor poderá acessar qualquer arquivo no host do cliente para o qual o usuário do cliente tenha acesso de leitura.

Em um ambiente Web, os clientes geralmente se conectam ao MySQL a partir de um servidor Web. Um usuário que pode executar qualquer comando contra o servidor MySQL pode usar `LOAD XML LOCAL` para ler quaisquer arquivos para os quais o processo do servidor Web tenha acesso de leitura. Neste ambiente, o cliente em relação ao servidor MySQL é na verdade o servidor Web, não o programa remoto que está sendo executado pelo usuário que se conecta ao servidor Web.

Você pode desativar o carregamento de arquivos XML dos clientes iniciando o servidor com `--local-infile=0` ou `--local-infile=OFF`. Esta opção também pode ser usada ao iniciar o cliente **mysql** para desativar `LOAD XML` durante a duração da sessão do cliente.

Para impedir que um cliente carregue arquivos XML do servidor, não conceda o privilégio `FILE` à conta de usuário correspondente do MySQL, ou revogue esse privilégio se a conta do usuário do cliente já o tiver.

Importante

Retirar o privilégio `FILE` (ou não concedi-lo em primeiro lugar) impede que o usuário execute apenas a declaração `LOAD XML` (assim como a função `LOAD_FILE()`; isso *não* impede que o usuário execute [`LOAD XML LOCAL`](load-xml.html "15.2.10 LOAD XML Statement"). Para impedir essa declaração, você deve iniciar o servidor ou o cliente com `--local-infile=OFF`.

Em outras palavras, o privilégio `FILE` afeta apenas se o cliente pode ler arquivos no servidor; não tem influência sobre se o cliente pode ler arquivos no sistema de arquivos local.

### 15.2.11 Expressões de consulta entre parênteses

```
parenthesized_query_expression:
    ( query_expression [order_by_clause] [limit_clause] )
      [order_by_clause]
      [limit_clause]
      [into_clause]

query_expression:
    query_block [set_op query_block [set_op query_block ...]]
      [order_by_clause]
      [limit_clause]
      [into_clause]

query_block:
    SELECT ... | TABLE | VALUES

order_by_clause:
    ORDER BY as for SELECT

limit_clause:
    LIMIT as for SELECT

into_clause:
    INTO as for SELECT

set_op:
    UNION | INTERSECT | EXCEPT
```

O MySQL 8.0.22 e versões posteriores suportam expressões de consulta entre parênteses de acordo com a sintaxe anterior. No seu formato mais simples, uma expressão de consulta entre parênteses contém uma única `SELECT` ou outra declaração que retorna um conjunto de resultados e sem cláusulas opcionais subsequentes:

```
(SELECT 1);
(SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'mysql');

TABLE t;

VALUES ROW(2, 3, 4), ROW(1, -2, 3);
```

(O suporte para as declarações `TABLE` e `VALUES` está disponível a partir do MySQL 8.0.19.)

Uma expressão de consulta entre parênteses também pode conter consultas vinculadas por uma ou mais operações de conjunto, como `UNION`, e terminar com qualquer uma ou todas as cláusulas opcionais:

```
mysql> (SELECT 1 AS result UNION SELECT 2);
+--------+
| result |
+--------+
|      1 |
|      2 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2) LIMIT 1;
+--------+
| result |
+--------+
|      1 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2) LIMIT 1 OFFSET 1;
+--------+
| result |
+--------+
|      2 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2)
       ORDER BY result DESC LIMIT 1;
+--------+
| result |
+--------+
|      2 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2)
       ORDER BY result DESC LIMIT 1 OFFSET 1;
+--------+
| result |
+--------+
|      1 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 3 UNION SELECT 2)
       ORDER BY result LIMIT 1 OFFSET 1 INTO @var;
mysql> SELECT @var;
+------+
| @var |
+------+
|    2 |
+------+
```

Além do operador de conjuntos `UNION`, os operadores de conjuntos `INTERSECT` e `EXCEPT` estão disponíveis a partir do MySQL 8.0.31. `INTERSECT` age antes de `UNION` e `EXCEPT`, de modo que as seguintes duas declarações sejam equivalentes:

```
SELECT a FROM t1 EXCEPT SELECT b FROM t2 INTERSECT SELECT c FROM t3;

SELECT a FROM t1 EXCEPT (SELECT b FROM t2 INTERSECT SELECT c FROM t3);
```

As expressões de consulta entre parênteses também são usadas como expressões de consulta, portanto, uma expressão de consulta, geralmente composta por blocos de consulta, também pode consistir em expressões de consulta entre parênteses:

```
(TABLE t1 ORDER BY a) UNION (TABLE t2 ORDER BY b) ORDER BY z;
```

Os blocos de consulta podem ter cláusulas finais `ORDER BY` e `LIMIT`, que são aplicadas antes da operação de conjunto externo, `ORDER BY`, e `LIMIT`.

Você não pode ter um bloco de consulta com um `ORDER BY` ou `LIMIT` final sem envolvê-lo em parênteses, mas os parênteses podem ser usados para aplicação de várias maneiras:

* Para aplicar `LIMIT` em cada bloco de consulta:

  ```
  (SELECT 1 LIMIT 1) UNION (VALUES ROW(2) LIMIT 1);

  (VALUES ROW(1), ROW(2) LIMIT 2) EXCEPT (SELECT 2 LIMIT 1);
  ```

* Para aplicar `LIMIT` tanto nos blocos de consulta quanto na expressão de consulta como um todo:

  ```
  (SELECT 1 LIMIT 1) UNION (SELECT 2 LIMIT 1) LIMIT 1;
  ```

* Para aplicar `LIMIT` em toda a expressão da consulta (sem parênteses):

  ```
  VALUES ROW(1), ROW(2) INTERSECT VALUES ROW(2), ROW(1) LIMIT 1;
  ```

* Execução híbrida: `LIMIT` no primeiro bloco de consulta e na expressão de consulta inteira:

  ```
  (SELECT 1 LIMIT 1) UNION SELECT 2 LIMIT 1;
  ```

A sintaxe descrita nesta seção está sujeita a certas restrições:

* Uma cláusula `INTO` de expressão de consulta não é permitida se houver outra cláusula `INTO` dentro de parênteses.

* Antes do MySQL 8.0.31, quando `ORDER BY` ou `LIMIT` ocorria dentro de uma expressão de consulta entre parênteses e também era aplicada na consulta externa, o resultado era indefinido. Esse não é um problema no MySQL 8.0.31 e versões posteriores, onde isso é tratado de acordo com o padrão SQL.

Antes do MySQL 8.0.31, as expressões de consulta entre parênteses não permitiam múltiplos níveis de operações de `ORDER BY` ou `LIMIT`, e as declarações que as continham eram rejeitadas com `ER_NOT_SUPPORTED_YET`. No MySQL 8.0.31 e versões posteriores, essa restrição é levantada e expressões de consulta entre parênteses aninhadas são permitidas. O nível máximo de aninhamento suportado é de 63; isso é após quaisquer simplificações ou fusões realizadas pelo analisador.

Um exemplo de tal declaração é mostrado aqui:

  ```
  mysql> (SELECT 'a' UNION SELECT 'b' LIMIT 2) LIMIT 3;
  +---+
  | a |
  +---+
  | a |
  | b |
  +---+
  2 rows in set (0.00 sec)
  ```

Você deve estar ciente de que, no MySQL 8.0.31 e versões posteriores, ao comprimir os corpos de expressão entre parênteses, o MySQL segue a semântica padrão do SQL, de modo que um limite externo superior não pode substituir um limite interno inferior. Por exemplo, `(SELECT ... LIMIT 5) LIMIT 10` não pode retornar mais de cinco linhas.

### 15.2.12 Declaração de REPLACAR

```
REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    { {VALUES | VALUE} (value_list) [, (value_list)] ...
      |
      VALUES row_constructor_list
    }

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {SELECT ... | TABLE table_name}

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

`REPLACE` funciona exatamente como `INSERT`, exceto que, se uma linha antiga na tabela tiver o mesmo valor que uma nova linha para um índice de `PRIMARY KEY` ou `UNIQUE`, a linha antiga é excluída antes de a nova linha ser inserida. Veja a Seção 15.2.7, “Instrução de Inserção”.

`REPLACE` é uma extensão do MySQL ao padrão SQL. Ela insere, ou *deleta* e insere. Para outra extensão do MySQL ao SQL padrão — que insere ou *atualiza* — consulte a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

As inserções e substituições `DELAYED` foram descontinuadas no MySQL 5.6. No MySQL 8.0, a palavra-chave `DELAYED` não é suportada. O servidor reconhece, mas ignora a palavra-chave `DELAYED`, trata a substituição como uma substituição não atrasada e gera um aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`: A substituição ATRASADA NÃO É MAIS SUPORTADA. A declaração foi convertida para REPLACE. A palavra-chave `DELAYED` está prevista para ser removida em uma versão futura.

Nota

`REPLACE` faz sentido apenas se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE`. Caso contrário, ele se torna equivalente a `INSERT`, porque não há índice para ser usado para determinar se uma nova linha duplica outra.

Os valores de todas as colunas são retirados dos valores especificados na declaração `REPLACE`. Quaisquer colunas ausentes são definidas com seus valores padrão, assim como acontece com `INSERT`. Você não pode referenciar valores da linha atual e usá-los na nova linha. Se você usar uma atribuição como `SET col_name = col_name + 1`, a referência ao nome da coluna do lado direito é tratada como `DEFAULT(col_name)`, então a atribuição é equivalente a `SET col_name = DEFAULT(col_name) + 1`.

Em MySQL 8.0.19 e versões posteriores, você pode especificar os valores da coluna que o `REPLACE` tenta inserir usando o `VALUES ROW()`.

Para usar `REPLACE`, você deve ter os privilégios de `INSERT` e `DELETE` para a tabela.

Se uma coluna gerada for substituída explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

`REPLACE` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de nomes separados por vírgula de partições, subpartições ou ambos. Como com `INSERT`, se não for possível inserir a nova linha em nenhuma dessas partições ou subpartições, a declaração `REPLACE` falha com o erro Encontrou uma linha que não corresponde ao conjunto de partições fornecido. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

A declaração `REPLACE` retorna um contador para indicar o número de linhas afetadas. Esta é a soma das linhas excluídas e inseridas. Se o contador for 1 para uma única linha `REPLACE`, uma linha foi inserida e nenhuma linha foi excluída. Se o contador for maior que 1, uma ou mais linhas antigas foram excluídas antes de a nova linha ser inserida. É possível que uma única linha substitua mais de uma linha antiga se a tabela contiver vários índices exclusivos e a nova linha duplique valores para diferentes linhas antigas em diferentes índices exclusivos.

O número de linhas afetadas facilita a determinação de se o `REPLACE` apenas adicionou uma linha ou se também substituiu quaisquer linhas: Verifique se o número é 1 (adicionado) ou maior (substituído).

Se você estiver usando a API C, o número de linhas afetadas pode ser obtido usando a função `mysql_affected_rows()`.

Você não pode substituir em uma tabela e selecionar da mesma tabela em uma subconsulta.

O MySQL utiliza o seguinte algoritmo para `REPLACE` (e [`LOAD DATA ... REPLACE`](load-data.html "15.2.9 LOAD DATA Statement")):

1. Tente inserir a nova linha na tabela.
2. Enquanto a inserção falha porque ocorre um erro de chave duplicada para uma chave primária ou índice único:

1. Exclua da tabela a linha em conflito que possui o valor de chave duplicado

2. Tente novamente inserir a nova linha na tabela

É possível que, no caso de um erro de chave duplicada, um mecanismo de armazenamento possa realizar a `REPLACE` como uma atualização em vez de uma exclusão mais inserção, mas a semântica é a mesma. Não há efeitos visíveis para o usuário, exceto uma possível diferença em como o mecanismo de armazenamento incrementa as variáveis de status `Handler_xxx`.

Como os resultados das declarações de `REPLACE ... SELECT` dependem da ordem das linhas do `SELECT` e essa ordem nem sempre pode ser garantida, é possível que, ao registrar essas declarações para a fonte e a replica divergirem. Por essa razão, as declarações de `REPLACE ... SELECT` são marcadas como inseguras para replicação baseada em declarações. Essas declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. Veja também [Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linha”][(replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication")].

O MySQL 8.0.19 e versões posteriores suportam `TABLE` e `SELECT` com `REPLACE`, assim como com `INSERT`. Consulte a Seção 15.2.7.1, “Instrução INSERT ... SELECT”, para obter mais informações e exemplos.

Ao modificar uma tabela existente que não está particionada para acomodar a partição, ou ao modificar a partição de uma tabela já particionada, você pode considerar alterar a chave primária da tabela (consulte a Seção 26.6.1, “Chaves de Partição, Chave Primária e Chaves Únicas”). Você deve estar ciente de que, se você fizer isso, os resultados das declarações `REPLACE` podem ser afetados, assim como aconteceria se você modificasse a chave primária de uma tabela não particionada. Considere a tabela criada pela seguinte declaração `CREATE TABLE`:

```
CREATE TABLE test (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

Quando criamos esta tabela e executamos as declarações mostradas no cliente mysql, o resultado é o seguinte:

```
mysql> REPLACE INTO test VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.04 sec)

mysql> REPLACE INTO test VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 2 rows affected (0.04 sec)

mysql> SELECT * FROM test;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
1 row in set (0.00 sec)
```

Agora, criamos uma segunda tabela quase idêntica à primeira, exceto que a chave primária agora cobre 2 colunas, como mostrado aqui (texto destacado):

```
CREATE TABLE test2 (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id, ts)
);
```

Quando executamos no `test2`, as mesmas duas declarações `REPLACE` que fizemos na tabela original `test`, obtemos um resultado diferente:

```
mysql> REPLACE INTO test2 VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.05 sec)

mysql> REPLACE INTO test2 VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 1 row affected (0.06 sec)

mysql> SELECT * FROM test2;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | Old  | 2014-08-20 18:47:00 |
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
2 rows in set (0.00 sec)
```

Isso ocorre porque, quando executado em `test2`, os valores das colunas `id` e `ts` devem corresponder aos de uma linha existente para que a linha seja substituída; caso contrário, uma linha é inserida.

### 15.2.13 Instrução SELECT

```
SELECT
    [ALL | DISTINCT | DISTINCTROW ]
    [HIGH_PRIORITY]
    [STRAIGHT_JOIN]
    [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
    [SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]
    select_expr [, select_expr] ...
    [into_option]
    [FROM table_references
      [PARTITION partition_list]]
    [WHERE where_condition]
    [GROUP BY {col_name | expr | position}, ... [WITH ROLLUP]]
    [HAVING where_condition]
    [WINDOW window_name AS (window_spec)
        [, window_name AS (window_spec)] ...]
    [ORDER BY {col_name | expr | position}
      [ASC | DESC], ... [WITH ROLLUP]]
    [LIMIT {[offset,] row_count | row_count OFFSET offset}]
    [into_option]
    [FOR {UPDATE | SHARE}
        [OF tbl_name [, tbl_name] ...]
        [NOWAIT | SKIP LOCKED]
      | LOCK IN SHARE MODE]
    [into_option]

into_option: {
    INTO OUTFILE 'file_name'
        [CHARACTER SET charset_name]
        export_options
  | INTO DUMPFILE 'file_name'
  | INTO var_name [, var_name] ...
}

export_options:
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        [[OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
```

`SELECT` é usado para recuperar linhas selecionadas de uma ou mais tabelas, e pode incluir operações `UNION` e subconsultas. A partir do MySQL 8.0.31, as operações `INTERSECT` e `EXCEPT` também são suportadas. Os operadores `UNION`, `INTERSECT` e `EXCEPT` são descritos com mais detalhes mais adiante nesta seção. Veja também a Seção 15.2.15, “Subconsultas”.

Uma declaração `SELECT` pode começar com uma cláusula `WITH`") para definir expressões de tabela comuns acessíveis dentro do `SELECT`. Veja a Seção 15.2.20, “COM (Expressões de Tabela Comuns”)”).

As cláusulas mais comumente utilizadas das declarações do `SELECT` são estas:

* Cada *`select_expr`* indica uma coluna que você deseja recuperar. Deve haver pelo menos um *`select_expr`*.

* *`table_references`* indica a tabela ou as tabelas a partir das quais devem ser recuperadas as linhas. Sua sintaxe é descrita na Seção 15.2.13.2, “Cláusula JOIN”.

* `SELECT` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de partições ou subpartições (ou ambas) após o nome da tabela em um *`table_reference`* (consulte Seção 15.2.13.2, “Cláusula JOIN”). Neste caso, as linhas são selecionadas apenas das partições listadas, e quaisquer outras partições da tabela são ignoradas. Para mais informações e exemplos, consulte Seção 26.5, “Seleção de Partições”.

* A cláusula `WHERE`, se fornecida, indica a condição ou condições que as linhas devem satisfazer para serem selecionadas. *`where_condition`* é uma expressão que avalia como verdadeira para cada linha a ser selecionada. A declaração seleciona todas as linhas se não houver cláusula `WHERE`.

Na expressão `WHERE`, você pode usar qualquer uma das funções e operadores que o MySQL suporta, exceto as funções agregadas (de grupo). Veja a Seção 11.5, “Expressões”, e o Capítulo 14, *Funções e Operadores*.

`SELECT` também pode ser usado para recuperar linhas calculadas sem referência a qualquer tabela.

Por exemplo:

```
mysql> SELECT 1 + 1;
        -> 2
```

Você pode especificar `DUAL` como um nome de tabela fictício em situações em que nenhuma tabela é referenciada:

```
mysql> SELECT 1 + 1 FROM DUAL;
        -> 2
```

`DUAL` é puramente para a conveniência das pessoas que exigem que todas as declarações `SELECT` tenham `FROM` e, possivelmente, outras cláusulas. O MySQL pode ignorar as cláusulas. O MySQL não exige `FROM DUAL` se nenhuma tabela for referenciada.

Em geral, as cláusulas utilizadas devem ser dadas exatamente na ordem mostrada na descrição da sintaxe. Por exemplo, uma cláusula `HAVING` deve vir após qualquer cláusula `GROUP BY` e antes de qualquer cláusula `ORDER BY`. A cláusula `INTO`, se presente, pode aparecer em qualquer posição indicada pela descrição da sintaxe, mas dentro de uma declaração dada pode aparecer apenas uma vez, não em múltiplas posições. Para mais informações sobre `INTO`, consulte a Seção 15.2.13.1, “Declaração SELECT ... INTO”.

A lista de termos *`select_expr`* compreende a lista selecionada que indica quais colunas devem ser recuperadas. Os termos especificam uma coluna ou expressão ou podem usar a abreviação `*`:

* Uma lista selecionada que consiste apenas em um único `*` não qualificado pode ser usada como abreviação para selecionar todas as colunas de todas as tabelas:

  ```
  SELECT * FROM t1 INNER JOIN t2 ...
  ```

* `tbl_name.*` pode ser usado como uma abreviação qualificada para selecionar todas as colunas da tabela nomeada:

  ```
  SELECT t1.*, t2.* FROM t1 INNER JOIN t2 ...
  ```

* Se uma tabela tiver colunas invisíveis, `*` e `tbl_name.*` não as incluem. Para serem incluídas, as colunas invisíveis devem ser referenciadas explicitamente.

* O uso de um `*` não qualificado com outros itens na lista de seleção pode produzir um erro de análise. Por exemplo:

  ```
  SELECT id, * FROM t1
  ```

Para evitar esse problema, use uma referência qualificada do `tbl_name.*`:

  ```
  SELECT id, t1.* FROM t1
  ```

Utilize referências qualificadas `tbl_name.*` para cada tabela na lista de seleção:

  ```
  SELECT AVG(score), t1.* FROM t1 ...
  ```

A lista a seguir fornece informações adicionais sobre outras cláusulas do `SELECT`:

* Um *`select_expr`* pode receber um alias usando `AS alias_name`. O alias é usado como o nome da coluna da expressão e pode ser usado em cláusulas de `GROUP BY`, `ORDER BY` ou `HAVING`. Por exemplo:

  ```
  SELECT CONCAT(last_name,', ',first_name) AS full_name
    FROM mytable ORDER BY full_name;
  ```

A palavra-chave `AS` é opcional ao aliar um *`select_expr`* com um identificador. O exemplo anterior poderia ter sido escrito da seguinte forma:

  ```
  SELECT CONCAT(last_name,', ',first_name) full_name
    FROM mytable ORDER BY full_name;
  ```

No entanto, como o `AS` é opcional, pode ocorrer um problema sutil se você esquecer a vírgula entre duas expressões de *`select_expr`*: o MySQL interpreta a segunda como um nome de alias. Por exemplo, na seguinte declaração, `columnb` é tratado como um nome de alias:

  ```
  SELECT columna columnb FROM mytable;
  ```

Por essa razão, é uma boa prática estar acostumado a usar `AS` explicitamente ao especificar aliases de coluna.

Não é permitido referir-se a um alias de coluna em uma cláusula `WHERE`, porque o valor da coluna pode não estar ainda determinado quando a cláusula `WHERE` é executada. Veja a Seção B.3.4.4, “Problemas com aliases de coluna”.

* A cláusula `FROM table_references` indica a(s) tabela(s) a partir da qual(em) as linhas devem ser recuperadas. Se você nomear mais de uma tabela, está realizando uma junção. Para informações sobre a sintaxe de junção, consulte a Seção 15.2.13.2, “Cláusula JOIN”. Para cada tabela especificada, você pode especificar um alias opcionalmente.

  ```
  tbl_name [[AS] alias] [index_hint]
  ```

O uso de dicas de índice fornece ao otimizador informações sobre como escolher índices durante o processamento de consultas. Para uma descrição da sintaxe para especificar essas dicas, consulte a Seção 10.9.4, “Dicas de índice”.

Você pode usar `SET max_seeks_for_key=value` como uma maneira alternativa para forçar o MySQL a preferir varreduras de chave em vez de varreduras de tabela. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* Você pode se referir a uma tabela dentro do banco de dados padrão como *`tbl_name`*, ou como *`db_name`*.*`tbl_name`* para especificar um banco de dados explicitamente. Você pode se referir a uma coluna como *`col_name`*, *`tbl_name`*.*`col_name`*, ou *`db_name`*.*`tbl_name`*.*`col_name`*. Você não precisa especificar um *`tbl_name`* ou *`db_name`*.*`tbl_name`* prefixo para uma referência de coluna, a menos que a referência seja ambígua. Veja a Seção 11.2.2, “Qualificadores de Identificador”, para exemplos de ambiguidade que requerem os formulários de referência de coluna mais explícitos.

* Uma referência de tabela pode ser aliada usando `tbl_name AS alias_name` ou *`tbl_name alias_name`*. Essas declarações são equivalentes:

  ```
  SELECT t1.name, t2.salary FROM employee AS t1, info AS t2
    WHERE t1.name = t2.name;

  SELECT t1.name, t2.salary FROM employee t1, info t2
    WHERE t1.name = t2.name;
  ```

* As colunas selecionadas para saída podem ser referenciadas nas cláusulas `ORDER BY` e `GROUP BY` usando nomes de colunas, aliases de coluna ou posições de coluna. As posições de coluna são inteiros e começam com 1:

  ```
  SELECT college, region, seed FROM tournament
    ORDER BY region, seed;

  SELECT college, region AS r, seed AS s FROM tournament
    ORDER BY r, s;

  SELECT college, region, seed FROM tournament
    ORDER BY 2, 3;
  ```

Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (decrescente) ao nome da coluna na cláusula `ORDER BY` pela qual você está ordenando. O padrão é a ordem ascendente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`.

Se `ORDER BY` ocorrer dentro de uma expressão de consulta entre parênteses e também for aplicada na consulta externa, os resultados serão indefinidos e podem mudar em uma versão futura do MySQL.

O uso de posições de coluna é desaconselhado porque a sintaxe foi removida do padrão SQL.

* Antes do MySQL 8.0.13, o MySQL suportava uma extensão de sintaxe não padrão que permitia designadores explícitos de `ASC` ou `DESC` para colunas `GROUP BY`. O MySQL 8.0.12 e versões posteriores suportam `ORDER BY` com funções de agrupamento, de modo que o uso dessa extensão não é mais necessário. (Bug #86312, Bug #26073525) Isso também significa que você pode ordenar em uma coluna ou colunas arbitrárias ao usar `GROUP BY`, assim:

  ```
  SELECT a, b, COUNT(c) AS t FROM test_table GROUP BY a,b ORDER BY a,t DESC;
  ```

A partir do MySQL 8.0.13, a extensão `GROUP BY` não é mais suportada: os identificadores `ASC` ou `DESC` para as colunas `GROUP BY` não são permitidos.

* Quando você usa `ORDER BY` ou `GROUP BY` para ordenar uma coluna em um `SELECT`, o servidor ordena os valores usando apenas o número inicial de bytes indicado pela variável de sistema `max_sort_length`.

* O MySQL estende o uso do `GROUP BY` para permitir a seleção de campos que não são mencionados na cláusula `GROUP BY`. Se você não está obtendo os resultados que espera de sua consulta, por favor, leia a descrição do `GROUP BY` encontrada na Seção 14.19, “Funções Agregadas”.

* `GROUP BY` permite um modificador `WITH ROLLUP`. Veja a Seção 14.19.2, “Modificadores GROUP BY”.

Anteriormente, não era permitido usar `ORDER BY` em uma consulta que tivesse um modificador `WITH ROLLUP`. Essa restrição é levantada a partir do MySQL 8.0.12. Veja a Seção 14.19.2, “Modificadores GROUP BY”.

* A cláusula `HAVING`, assim como a cláusula `WHERE`, especifica condições de seleção. A cláusula `WHERE` especifica condições em colunas da lista de seleção, mas não pode se referir a funções agregadas. A cláusula `HAVING` especifica condições em grupos, tipicamente formados pela cláusula `GROUP BY`. O resultado da consulta inclui apenas grupos que satisfazem as condições da `HAVING`. (Se não houver `GROUP BY`, todas as linhas implicitamente formam um único grupo agregado.)

A cláusula `HAVING` é aplicada quase na última posição, logo antes de os itens serem enviados ao cliente, sem otimização. (A cláusula `LIMIT` é aplicada após a `HAVING`.

O padrão SQL exige que `HAVING` deve referenciar apenas colunas da cláusula `GROUP BY` ou colunas utilizadas em funções agregadas. No entanto, o MySQL suporta uma extensão a esse comportamento e permite que `HAVING` se refira a colunas da lista `SELECT` e também a colunas de subconsultas externas.

Se a cláusula `HAVING` se referir a uma coluna ambígua, um aviso ocorre. Na declaração a seguir, `col2` é ambígua porque é usada tanto como um alias quanto como um nome de coluna:

  ```
  SELECT COUNT(col1) AS col2 FROM t GROUP BY col2 HAVING col2 = 2;
  ```

A preferência é dada ao comportamento padrão do SQL, portanto, se o nome da coluna `HAVING` for usado tanto no `GROUP BY` quanto como uma coluna aliased na lista de colunas do select, a preferência é dada à coluna na coluna `GROUP BY`.

* Não use `HAVING` para itens que devem estar na cláusula `WHERE`. Por exemplo, não escreva o seguinte:

  ```
  SELECT col_name FROM tbl_name HAVING col_name > 0;
  ```

Escreva o seguinte em vez disso:

  ```
  SELECT col_name FROM tbl_name WHERE col_name > 0;
  ```

* A cláusula `HAVING` pode se referir a funções agregadas, que a cláusula `WHERE` não pode:

  ```
  SELECT user, MAX(salary) FROM users
    GROUP BY user HAVING MAX(salary) > 10;
  ```

(Isso não funcionou em algumas versões mais antigas do MySQL.)

* O MySQL permite nomes de colunas duplicados. Ou seja, pode haver mais de um *`select_expr`* com o mesmo nome. Esta é uma extensão do SQL padrão. Como o MySQL também permite que `GROUP BY` e `HAVING` se refiram a valores de *`select_expr`*, isso pode resultar em uma ambiguidade:

  ```
  SELECT 12 AS a, a FROM t GROUP BY a;
  ```

Nessa declaração, ambas as colunas têm o nome `a`. Para garantir que a coluna correta seja usada para agrupamento, use nomes diferentes para cada *`select_expr`*.

* A cláusula `WINDOW`, se presente, define janelas nomeadas que podem ser referenciadas por funções de janela. Para detalhes, consulte a Seção 14.20.4, “Janelas Nomeadas”.

* O MySQL resolve referências de coluna ou alias não qualificadas nas cláusulas `ORDER BY` procurando nos valores de *`select_expr`*, em seguida, nas colunas das tabelas na cláusula `FROM`. Para as cláusulas `GROUP BY` ou `HAVING`, ele procura na cláusula `FROM` antes de procurar nos valores de *`select_expr`*. (Para `GROUP BY` e `HAVING`, isso difere do comportamento anterior ao MySQL 5.0, que usava as mesmas regras que para `ORDER BY`.)

* A cláusula `LIMIT` pode ser usada para restringir o número de linhas retornadas pela declaração `SELECT`. `LIMIT` aceita um ou dois argumentos numéricos, que devem ser ambos constantes inteiras não negativas, com essas exceções:

+ Dentro das declarações preparadas, os parâmetros `LIMIT` podem ser especificados usando os marcadores de marcador de posição `?`.

+ Dentro dos programas armazenados, os parâmetros `LIMIT` podem ser especificados usando parâmetros de rotina com valores inteiros ou variáveis locais.

Com dois argumentos, o primeiro argumento especifica o deslocamento da primeira linha a ser devolvida, e o segundo especifica o número máximo de linhas a ser devolvido. O deslocamento da linha inicial é 0 (não 1):

  ```
  SELECT * FROM tbl LIMIT 5,10;  # Retrieve rows 6-15
  ```

Para recuperar todas as linhas a partir de um certo deslocamento até o final do conjunto de resultados, você pode usar um número grande para o segundo parâmetro. Esta declaração recupera todas as linhas da 96ª linha até a última:

  ```
  SELECT * FROM tbl LIMIT 95,18446744073709551615;
  ```

Com um argumento, o valor especifica o número de linhas a serem retornadas a partir do início do conjunto de resultados:

  ```
  SELECT * FROM tbl LIMIT 5;     # Retrieve first 5 rows
  ```

Em outras palavras, `LIMIT row_count` é equivalente a `LIMIT 0, row_count`.

Para declarações preparadas, você pode usar marcadores. As seguintes declarações retornam uma linha da tabela `tbl`:

  ```
  SET @a=1;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?';
  EXECUTE STMT USING @a;
  ```

As seguintes declarações retornam as segunda a sexta linhas da tabela `tbl`:

  ```
  SET @skip=1; SET @numrows=5;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?, ?';
  EXECUTE STMT USING @skip, @numrows;
  ```

Para compatibilidade com o PostgreSQL, o MySQL também suporta a sintaxe `LIMIT row_count OFFSET offset`.

Se `LIMIT` ocorrer dentro de uma expressão de consulta entre parênteses e também for aplicada na consulta externa, os resultados serão indefinidos e podem mudar em uma versão futura do MySQL.

A forma `SELECT ... INTO`(select-into.html "15.2.13.1 SELECT ... INTO Statement") de `SELECT` permite que o resultado da consulta seja escrito em um arquivo ou armazenado em variáveis. Para mais informações, consulte a Seção 15.2.13.1, “Instrução SELECT ... INTO”.

* Se você usar `FOR UPDATE` com um mecanismo de armazenamento que utiliza bloqueios de página ou de linha, as linhas examinadas pela consulta são bloqueadas para escrita até o final da transação atual.

Você não pode usar `FOR UPDATE` como parte do `SELECT` em uma declaração como [`CREATE TABLE new_table SELECT ... FROM old_table ...`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"). (Se você tentar fazer isso, a declaração é rejeitada com o erro "Não é possível atualizar a tabela '*`old_table`'*" enquanto '*`new_table`'* está sendo criado.)

`FOR SHARE` e `LOCK IN SHARE MODE` definem bloqueios compartilhados que permitem que outras transações leiam as linhas examinadas, mas não as atualizem ou excluam. `FOR SHARE` e `LOCK IN SHARE MODE` são equivalentes. No entanto, `FOR SHARE`, assim como `FOR UPDATE`, suporta as opções `NOWAIT`, `SKIP LOCKED` e `OF tbl_name`. `FOR SHARE` é um substituto de `LOCK IN SHARE MODE`, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa.

`NOWAIT` faz com que uma consulta `FOR UPDATE` ou `FOR SHARE` seja executada imediatamente, retornando um erro se uma restrição de linha não puder ser obtida devido a uma restrição mantida por outra transação.

`SKIP LOCKED` faz com que uma consulta `FOR UPDATE` ou `FOR SHARE` seja executada imediatamente, excluindo as linhas do conjunto de resultados que estão bloqueadas por outra transação.

As opções `NOWAIT` e `SKIP LOCKED` não são seguras para replicação baseada em declarações.

Nota

As consultas que ignoram as linhas bloqueadas retornam uma visão inconsistente dos dados. `SKIP LOCKED` não é, portanto, adequado para trabalhos gerais de transação. No entanto, ele pode ser usado para evitar a disputa de bloqueio quando várias sessões acessam a mesma tabela semelhante a uma fila.

`OF tbl_name` aplica as consultas `FOR UPDATE` e `FOR SHARE` a tabelas nomeadas. Por exemplo:

  ```
  SELECT * FROM t1, t2 FOR SHARE OF t1 FOR UPDATE OF t2;
  ```

Todas as tabelas referenciadas pelo bloco de consulta são bloqueadas quando `OF tbl_name` é omitido. Consequentemente, usar uma cláusula de bloqueio sem `OF tbl_name` em combinação com outra cláusula de bloqueio retorna um erro. Especificar a mesma tabela em várias cláusulas de bloqueio retorna um erro. Se um alias é especificado como o nome da tabela na declaração `SELECT`, uma cláusula de bloqueio pode usar apenas o alias. Se a declaração `SELECT` não especificar um alias explicitamente, a cláusula de bloqueio pode especificar apenas o nome da tabela real.

Para mais informações sobre `FOR UPDATE` e `FOR SHARE`, consulte a Seção 17.7.2.4, “Leitura de bloqueio”. Para informações adicionais sobre as opções `NOWAIT` e `SKIP LOCKED`, consulte Concorrência de leitura de bloqueio com NOWAIT e SKIP LOCKED.

Após a palavra-chave `SELECT`, você pode usar vários modificadores que afetam o funcionamento da declaração. `HIGH_PRIORITY`, `STRAIGHT_JOIN` e modificadores que começam com `SQL_` são extensões do MySQL ao SQL padrão.

* Os modificadores `ALL` e `DISTINCT` especificam se as linhas duplicadas devem ser retornadas. `ALL` (o padrão) especifica que todas as linhas correspondentes devem ser retornadas, incluindo as duplicadas. `DISTINCT` especifica a remoção de linhas duplicadas do conjunto de resultados. É um erro especificar ambos os modificadores. `DISTINCTROW` é sinônimo de `DISTINCT`.

Em MySQL 8.0.12 e versões posteriores, `DISTINCT` pode ser usado com uma consulta que também utiliza `WITH ROLLUP`. (Bug #87450, Bug #26640100)

* `HIGH_PRIORITY` dá prioridade maior ao `SELECT` do que a uma declaração que atualiza uma tabela. Você deve usar isso apenas para consultas que são muito rápidas e devem ser feitas de uma só vez. Uma consulta `SELECT HIGH_PRIORITY` que é emitida enquanto a tabela está bloqueada para leitura funciona mesmo que haja uma declaração de atualização esperando a tabela ficar livre. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

`HIGH_PRIORITY` não pode ser usado com declarações `SELECT` que fazem parte de um `UNION`.

* `STRAIGHT_JOIN` obriga o otimizador a unir as tabelas na ordem em que elas estão listadas na cláusula `FROM`. Você pode usar isso para acelerar uma consulta se o otimizador unir as tabelas em ordem não ótima. `STRAIGHT_JOIN` também pode ser usado na lista *`table_references`*. Veja a Seção 15.2.13.2, “Cláusula JOIN”.

`STRAIGHT_JOIN` não se aplica a qualquer tabela que o otimizador trate como uma tabela `const` ou `system`. Tal tabela produz uma única linha, é lida durante a fase de otimização da execução da consulta e as referências às suas colunas são substituídas pelos valores apropriados das colunas antes de a execução da consulta prosseguir. Essas tabelas aparecem primeiro no plano de consulta exibido por `EXPLAIN`. Veja a Seção 10.8.1, “Otimizando consultas com EXPLAIN”. Esta exceção pode não se aplicar a tabelas `const` ou `system` que são usadas no lado complementado com `NULL` (ou seja, a tabela do lado direito de um `LEFT JOIN` ou a tabela do lado esquerdo de um `RIGHT JOIN`.

* `SQL_BIG_RESULT` ou `SQL_SMALL_RESULT` pode ser usado com `GROUP BY` ou `DISTINCT` para informar o otimizador que o conjunto de resultados tem muitas linhas ou é pequeno, respectivamente. Para `SQL_BIG_RESULT`, o MySQL usa diretamente tabelas temporárias baseadas em disco se elas forem criadas e prefere a ordenação em vez de usar uma tabela temporária com uma chave nos elementos do `GROUP BY`. Para `SQL_SMALL_RESULT`, o MySQL usa tabelas temporárias de memória para armazenar a tabela resultante em vez de usar a ordenação. Isso normalmente não é necessário.

* `SQL_BUFFER_RESULT` obriga o resultado a ser colocado em uma tabela temporária. Isso ajuda o MySQL a liberar os bloqueios da tabela precocemente e ajuda em casos em que leva um longo tempo enviar o conjunto de resultados ao cliente. Este modificador pode ser usado apenas para declarações de nível superior `SELECT`, não para subconsultas ou seguindo `UNION`.

* `SQL_CALC_FOUND_ROWS` indica ao MySQL que calcule quantas linhas haveriam no conjunto de resultados, ignorando qualquer cláusula `LIMIT`. O número de linhas pode então ser recuperado com `SELECT FOUND_ROWS()`. Veja a Seção 14.15, “Funções de Informação”.

Nota

O modificador de consulta `SQL_CALC_FOUND_ROWS` e a função acompanhante `FOUND_ROWS()` são descontinuados a partir do MySQL 8.0.17; espera-se que eles sejam removidos em uma versão futura do MySQL. Consulte a descrição `FOUND_ROWS()` para obter informações sobre uma estratégia alternativa.

Os modificadores `SQL_CACHE` e `SQL_NO_CACHE` foram usados com o cache de consulta antes do MySQL 8.0. O cache de consulta foi removido no MySQL 8.0. O modificador `SQL_CACHE` também foi removido. O `SQL_NO_CACHE` é desatualizado e não tem efeito; espere que ele seja removido em uma versão futura do MySQL.

#### 15.2.13.1 Instrução SELECT ... INTO

A forma `SELECT ... INTO` do (select-into.html "15.2.13.1 SELECT ... INTO Statement") permite que o resultado de uma consulta seja armazenado em variáveis ou escrito em um arquivo:

* `SELECT ... INTO var_list` seleciona os valores da coluna e os armazena em variáveis.

* `SELECT ... INTO OUTFILE` escreve as linhas selecionadas em um arquivo. Os terminadores de coluna e linha podem ser especificados para produzir um formato de saída específico.

* `SELECT ... INTO DUMPFILE` escreve uma única linha em um arquivo sem qualquer formatação.

Uma declaração `SELECT` dada pode conter no máximo uma cláusula `INTO`, embora, como mostrado pela descrição da sintaxe `SELECT` (ver Seção 15.2.13, “Declaração SELECT”), o `INTO` pode aparecer em diferentes posições:

* Antes de `FROM`. Exemplo:

  ```
  SELECT * INTO @myvar FROM t1;
  ```

* Antes de uma cláusula de travamento posterior. Exemplo:

  ```
  SELECT * FROM t1 INTO @myvar FOR UPDATE;
  ```

* No final do `SELECT`. Exemplo:

  ```
  SELECT * FROM t1 FOR UPDATE INTO @myvar;
  ```

A posição `INTO` no final da declaração é suportada a partir do MySQL 8.0.20 e é a posição preferida. A posição antes de uma cláusula de bloqueio é desaconselhada a partir do MySQL 8.0.20; espera-se que o suporte para ela seja removido em uma versão futura do MySQL. Em outras palavras, `INTO` após `FROM`, mas não no final do `SELECT`, produz um aviso.

Uma cláusula `INTO` não deve ser usada em uma cláusula `SELECT` aninhada, porque tal `SELECT` deve retornar seu resultado ao contexto externo. Há também restrições sobre o uso de `INTO` dentro das declarações `UNION`; veja Seção 15.2.18, “Cláusula UNION”.

Para a variante `INTO var_list`:

* *`var_list`* nomeia uma lista de uma ou mais variáveis, cada uma das quais pode ser uma variável definida pelo usuário, parâmetro de procedimento ou função armazenada, ou variável local de programa armazenado. (Dentro de uma declaração preparada `SELECT ... INTO var_list`, apenas variáveis definidas pelo usuário são permitidas; veja Seção 15.6.4.2, “Escopo e Resolução de Variáveis Locais”.)

* Os valores selecionados são atribuídos às variáveis. O número de variáveis deve corresponder ao número de colunas. A consulta deve retornar uma única linha. Se a consulta não retornar nenhuma linha, ocorre um aviso com o código de erro 1329 (`No data`), e os valores das variáveis permanecem inalterados. Se a consulta retornar várias linhas, ocorre o erro 1172 (`Result consisted of more than one row`). Se é possível que a declaração possa recuperar várias linhas, você pode usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha.

  ```
  SELECT id, data INTO @x, @y FROM test.t1 LIMIT 1;
  ```

`INTO var_list` também pode ser usado com uma declaração `TABLE`, sujeito a essas restrições:

* O número de variáveis deve corresponder ao número de colunas na tabela.

* Se a tabela contiver mais de uma linha, você deve usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha. `LIMIT 1` deve preceder a palavra-chave `INTO`.

Um exemplo de tal declaração é mostrado aqui:

```
TABLE employees ORDER BY lname DESC LIMIT 1
    INTO @id, @fname, @lname, @hired, @separated, @job_code, @store_id;
```

Você também pode selecionar valores de uma declaração `VALUES` que gera uma única linha em um conjunto de variáveis do usuário. Neste caso, você deve usar um alias de tabela e deve atribuir cada valor da lista de valores a uma variável. Cada uma das duas declarações mostradas aqui é equivalente a [`SET @x=2, @y=4, @z=8`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"):

```
SELECT * FROM (VALUES ROW(2,4,8)) AS t INTO @x,@y,@z;

SELECT * FROM (VALUES ROW(2,4,8)) AS t(a,b,c) INTO @x,@y,@z;
```

Os nomes de variáveis do usuário não são sensíveis ao caso. Veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

A forma `SELECT ... INTO OUTFILE 'file_name'` do (select-into.html "15.2.13.1 SELECT ... INTO Statement") escreve as linhas selecionadas em um arquivo. O arquivo é criado no host do servidor, portanto, você deve ter o privilégio `FILE` para usar essa sintaxe. *`file_name`* não pode ser um arquivo existente, o que, entre outras coisas, impede que arquivos como `/etc/passwd` e tabelas de banco de dados sejam modificados. A variável de sistema `character_set_filesystem` controla a interpretação do nome do arquivo.

A declaração `SELECT ... INTO OUTFILE` (select-into.html "15.2.13.1 SELECT ... INTO Statement") destina-se a permitir o descarregamento de uma tabela para um arquivo de texto no host do servidor. Para criar o arquivo resultante em outro host, `SELECT ... INTO OUTFILE` (select-into.html "15.2.13.1 SELECT ... INTO Statement") normalmente é inadequado, pois não há como escrever um caminho para o arquivo em relação ao sistema de arquivos do host do servidor, a menos que a localização do arquivo no host remoto possa ser acessada usando um caminho mapeado na rede no sistema de arquivos do host do servidor.

Como alternativa, se o software de cliente MySQL estiver instalado no host remoto, você pode usar um comando do cliente, como `mysql -e "SELECT ..." > file_name`, para gerar o arquivo nesse host.

`SELECT ... INTO OUTFILE` é o complemento de (select-into.html "15.2.13.1 SELECT ... INTO Statement"). Os valores das colunas são escritos convertidos para o conjunto de caracteres especificado na cláusula `LOAD DATA`. Se tal cláusula não estiver presente, os valores são descarregados usando o conjunto de caracteres `CHARACTER SET`. Na prática, não há conversão de conjunto de caracteres. Se um conjunto de resultados contém colunas em vários conjuntos de caracteres, o mesmo acontece com o arquivo de dados de saída, e pode não ser possível recarregar o arquivo corretamente.

A sintaxe da parte *`export_options`* da declaração consiste nas mesmas cláusulas `FIELDS` e `LINES` que são usadas com a declaração `LOAD DATA`. Para informações mais detalhadas sobre as cláusulas `FIELDS` e `LINES`, incluindo seus valores padrão e valores permitidos, consulte a Seção 15.2.9, “Declaração LOAD DATA”.

`FIELDS ESCAPED BY` controla como escrever caracteres especiais. Se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado quando necessário para evitar ambiguidade como um prefixo que precede os caracteres seguintes na saída:

* O caractere `FIELDS ESCAPED BY`
* O caractere `FIELDS [OPTIONALLY] ENCLOSED BY`

* O primeiro caractere dos valores de `FIELDS TERMINATED BY` e `LINES TERMINATED BY`

* ASCII `NUL` (o byte de valor zero; o que é realmente escrito após o caractere de escape é ASCII `0`, não um byte de valor zero)

Os caracteres `FIELDS TERMINATED BY`, `ENCLOSED BY`, `ESCAPED BY` ou `LINES TERMINATED BY` *devem* ser escapados para que você possa ler o arquivo de volta de forma confiável. O ASCII `NUL` é escapado para facilitar a visualização com alguns pagers.

O arquivo resultante não precisa seguir a sintaxe SQL, portanto, nada mais precisa ser escamado.

Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere é escapado e `NULL` é exibido como `NULL`, e não `\N`. Provavelmente não é uma boa ideia especificar um caractere de escape vazio, especialmente se os valores dos campos em seus dados contiverem algum dos caracteres da lista que acabou de ser fornecida.

`INTO OUTFILE` também pode ser usado com uma declaração `TABLE` quando você deseja descartar todas as colunas de uma tabela em um arquivo de texto. Neste caso, a ordem e o número de linhas podem ser controlados usando `ORDER BY` e `LIMIT`; essas cláusulas devem preceder `INTO OUTFILE`. `TABLE ... INTO OUTFILE` suporta o mesmo *`export_options`* que `SELECT ... INTO OUTFILE`, e está sujeito às mesmas restrições de escrita no sistema de arquivos. Um exemplo de tal declaração é mostrado aqui:

```
TABLE employees ORDER BY lname LIMIT 1000
    INTO OUTFILE '/tmp/employee_data_1.txt'
    FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"', ESCAPED BY '\'
    LINES TERMINATED BY '\n';
```

Você também pode usar `SELECT ... INTO OUTFILE` com uma declaração `VALUES` para escrever valores diretamente em um arquivo. Um exemplo é mostrado aqui:

```
SELECT * FROM (VALUES ROW(1,2,3),ROW(4,5,6),ROW(7,8,9)) AS t
    INTO OUTFILE '/tmp/select-values.txt';
```

Você deve usar um alias de tabela; aliases de coluna também são suportados e podem ser usados opcionalmente para escrever valores apenas das colunas desejadas. Você também pode usar qualquer uma ou todas as opções de exportação suportadas por `SELECT ... INTO OUTFILE` para formatar a saída para o arquivo.

Aqui está um exemplo que produz um arquivo no formato de valores separados por vírgula (CSV), usado por muitos programas:

```
SELECT a,b,a+b INTO OUTFILE '/tmp/result.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM test_table;
```

Se você usar `INTO DUMPFILE` em vez de `INTO OUTFILE`, o MySQL escreve apenas uma linha no arquivo, sem nenhuma terminação de coluna ou linha e sem realizar nenhum processamento de escape. Isso é útil para selecionar um valor de `BLOB` e armazená-lo em um arquivo.

`TABLE` também suporta `INTO DUMPFILE`. Se a tabela contiver mais de uma linha, você também deve usar `LIMIT 1` para limitar a saída a uma única linha. `INTO DUMPFILE` também pode ser usado com `SELECT * FROM (VALUES ROW()[, ...]) AS table_alias [LIMIT 1]`. Veja a Seção 15.2.19, “Declaração VALUES”.

Nota

Qualquer arquivo criado por `INTO OUTFILE` ou `INTO DUMPFILE` pertence ao usuário do sistema operacional sob cuja conta o **mysqld** está rodando. (Você *nunca* deve rodar **mysqld** como `root` por este e outros motivos.) A partir do MySQL 8.0.17, a máscara de arquivo para criação é 0640; você deve ter privilégios de acesso suficientes para manipular o conteúdo do arquivo. Antes do MySQL 8.0.17, a máscara é 0666 e o arquivo é legível por todos os usuários no host do servidor.

Se a variável de sistema `secure_file_priv` estiver definida como um nome de diretório não vazio, o arquivo a ser escrito deve estar localizado nesse diretório.

No contexto das declarações de `SELECT ... INTO` (select-into.html "15.2.13.1 SELECT ... INTO Statement") que ocorrem como parte de eventos executados pelo Cronograma de Eventos, mensagens de diagnóstico (não apenas erros, mas também avisos) são escritas no log de erro e, no Windows, no log de eventos da aplicação. Para informações adicionais, consulte a Seção 27.4.5, “Status do Cronograma de Eventos”.

A partir do MySQL 8.0.22, é fornecido suporte para a sincronização periódica de arquivos de saída escritos por `SELECT INTO OUTFILE` e `SELECT INTO DUMPFILE`, habilitada pela definição da variável de sistema do servidor `select_into_disk_sync`, introduzida nessa versão. O tamanho do buffer de saída e o atraso opcional podem ser definidos, respectivamente, por meio de `select_into_buffer_size` e `select_into_disk_sync_delay`. Para mais informações, consulte as descrições dessas variáveis de sistema.

#### 15.2.13.2 Cláusula de UNIFICAÇÃO

O MySQL suporta a seguinte sintaxe `JOIN` para a parte *`table_references`* das declarações `SELECT` e declarações de múltiplas tabelas `DELETE` e `UPDATE`:

```
table_references:
    escaped_table_reference [, escaped_table_reference] ...

escaped_table_reference: {
    table_reference
  | { OJ table_reference }
}

table_reference: {
    table_factor
  | joined_table
}

table_factor: {
    tbl_name [PARTITION (partition_names)]
        [[AS] alias] [index_hint_list]
  | [LATERAL] table_subquery [AS] alias [(col_list)]
  | ( table_references )
}

joined_table: {
    table_reference {[INNER | CROSS] JOIN | STRAIGHT_JOIN} table_factor [join_specification]
  | table_reference {LEFT|RIGHT} [OUTER] JOIN table_reference join_specification
  | table_reference NATURAL [INNER | {LEFT|RIGHT} [OUTER]] JOIN table_factor
}

join_specification: {
    ON search_condition
  | USING (join_column_list)
}

join_column_list:
    column_name[, column_name] ...

index_hint_list:
    index_hint[ index_hint] ...

index_hint: {
    USE {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] ([index_list])
  | {IGNORE|FORCE} {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)
}

index_list:
    index_name [, index_name] ...
```

Uma referência de tabela também é conhecida como expressão de junção.

Uma referência de tabela (quando se refere a uma tabela dividida) pode conter uma cláusula `PARTITION`, incluindo uma lista de partições, subpartições ou ambas, separadas por vírgulas. Esta opção segue o nome da tabela e precede qualquer declaração de alias. O efeito desta opção é que as linhas são selecionadas apenas das partições ou subpartições listadas. Quaisquer partições ou subpartições não mencionadas na lista são ignoradas. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

A sintaxe de *`table_factor`* é estendida no MySQL em comparação com o SQL padrão. O padrão aceita apenas *`table_reference`*, não uma lista deles dentro de um par de parênteses.

Essa é uma extensão conservadora se cada vírgula em uma lista de itens de *`table_reference`* é considerada equivalente a uma junção interna. Por exemplo:

```
SELECT * FROM t1 LEFT JOIN (t2, t3, t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

é equivalente a:

```
SELECT * FROM t1 LEFT JOIN (t2 CROSS JOIN t3 CROSS JOIN t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

Em MySQL, `JOIN`, `CROSS JOIN` e `INNER JOIN` são equivalentes sintáticos (podem substituir um ao outro). Em SQL padrão, eles não são equivalentes. `INNER JOIN` é usado com uma cláusula `ON`, `CROSS JOIN` é usado de outra forma.

De forma geral, as chaves de parênteses podem ser ignoradas em expressões de junção que contenham apenas operações de junção interna. O MySQL também suporta junções aninhadas. Veja a Seção 10.2.1.8, “Otimização de Junção Aninhada”.

Os indicadores de índice podem ser especificados para influenciar a forma como o otimizador do MySQL utiliza os índices. Para mais informações, consulte a Seção 10.9.4, “Indicadores de índice”. Os indicadores do otimizador e a variável `optimizer_switch` são outras maneiras de influenciar o uso de índices pelo otimizador. Consulte a Seção 10.9.3, “Indicadores do otimizador”, e a Seção 10.9.2, “Otimizações comutais”.

A lista a seguir descreve os fatores gerais a serem considerados ao escrever junções:

* Uma referência de tabela pode ser aliada usando `tbl_name AS alias_name` ou *`tbl_name alias_name`*:

  ```
  SELECT t1.name, t2.salary
    FROM employee AS t1 INNER JOIN info AS t2 ON t1.name = t2.name;

  SELECT t1.name, t2.salary
    FROM employee t1 INNER JOIN info t2 ON t1.name = t2.name;
  ```

* Um *`table_subquery`* também é conhecido como uma tabela derivada ou subconsulta na cláusula `FROM`. Veja a Seção 15.2.15.8, “Tabelas Derivadas”. Tais subconsultas *devem* incluir um alias para dar ao resultado da subconsulta um nome de tabela, e podem opcionalmente incluir uma lista de nomes de colunas de tabela entre parênteses. Um exemplo trivial segue:

  ```
  SELECT * FROM (SELECT 1, 2, 3) AS t1;
  ```

* O número máximo de tabelas que podem ser referenciadas em uma única junção é de 61. Isso inclui uma junção que é tratada pela fusão de tabelas derivadas e visualizações na cláusula `FROM` no bloco de consulta externa (consulte [Seção 10.2.2.4, “Otimizando tabelas derivadas, referências a visualizações e expressões de tabela comuns com fusão ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")]).

* `INNER JOIN` e `,` (vírgula) são semanticamente equivalentes na ausência de uma condição de junção: ambos produzem um produto cartesiano entre as tabelas especificadas (ou seja, cada e cada linha da primeira tabela é unida a cada e cada linha da segunda tabela).

No entanto, a precedência do operador de vírgula é menor do que a dos `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN`, e assim por diante. Se você misturar junções por vírgula com os outros tipos de junção quando houver uma condição de junção, pode ocorrer um erro na forma de `Unknown column 'col_name' in 'on clause'`. Informações sobre como lidar com esse problema são fornecidas mais adiante nesta seção.

* O *`search_condition`* utilizado com `ON` é qualquer expressão condicional na forma que pode ser usada em uma cláusula `WHERE`. Geralmente, a cláusula `ON` serve para condições que especificam como unir tabelas, e a cláusula `WHERE` restringe quais linhas devem ser incluídas no conjunto de resultados.

* Se não houver uma linha correspondente à tabela correta na parte `ON` ou `USING` em um `LEFT JOIN`, uma linha com todas as colunas definidas como `NULL` é usada para a tabela correta. Você pode usar esse fato para encontrar linhas em uma tabela que não tenham correspondência em outra tabela:

  ```
  SELECT left_tbl.*
    FROM left_tbl LEFT JOIN right_tbl ON left_tbl.id = right_tbl.id
    WHERE right_tbl.id IS NULL;
  ```

Este exemplo encontra todas as linhas em `left_tbl` com um valor em `id` que não está presente em `right_tbl` (ou seja, todas as linhas em `left_tbl` sem uma linha correspondente em `right_tbl`). Veja a Seção 10.2.1.9, “Otimização de Conjunção Externa”.

* A cláusula `USING(join_column_list)` nomeia uma lista de colunas que devem existir em ambas as tabelas. Se as tabelas `a` e `b` contenham as colunas `c1`, `c2` e `c3`, a seguinte junção compara as colunas correspondentes das duas tabelas:

  ```
  a LEFT JOIN b USING (c1, c2, c3)
  ```

* O `NATURAL [LEFT] JOIN` de duas tabelas é definido como semanticamente equivalente a um `INNER JOIN` ou a um `LEFT JOIN`, com uma cláusula `USING` que nomeia todas as colunas que existem em ambas as tabelas.

* `RIGHT JOIN` funciona de forma análoga a `LEFT JOIN`. Para manter o código portátil em diferentes bancos de dados, é recomendável que você use `LEFT JOIN` em vez de `RIGHT JOIN`.

* A sintaxe `{ OJ ... }` mostrada na descrição da sintaxe de junção existe apenas para compatibilidade com ODBC. As chaves espirais na sintaxe devem ser escritas literalmente; elas não são metacaracteres como usado em outras descrições de sintaxe.

  ```
  SELECT left_tbl.*
      FROM { OJ left_tbl LEFT OUTER JOIN right_tbl
             ON left_tbl.id = right_tbl.id }
      WHERE right_tbl.id IS NULL;
  ```

Você pode usar outros tipos de junções dentro de `{ OJ ... }`, como `INNER JOIN` ou `RIGHT OUTER JOIN`. Isso ajuda na compatibilidade com alguns aplicativos de terceiros, mas não é a sintaxe oficial ODBC.

* `STRAIGHT_JOIN` é semelhante a `JOIN`, exceto que a tabela à esquerda é sempre lida antes da tabela à direita. Isso pode ser usado para aqueles (poucos) casos para os quais o otimizador de junção processa as tabelas em uma ordem subótima.

Alguns exemplos:

```
SELECT * FROM table1, table2;

SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 USING (id);

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id
  LEFT JOIN table3 ON table2.id = table3.id;
```

As junções naturais e as junções com `USING`, incluindo as variantes de junção externa, são processadas de acordo com o padrão SQL:2003:

* Colunas redundantes de uma junção de `NATURAL` não aparecem. Considere este conjunto de declarações:

  ```
  CREATE TABLE t1 (i INT, j INT);
  CREATE TABLE t2 (k INT, j INT);
  INSERT INTO t1 VALUES(1, 1);
  INSERT INTO t2 VALUES(1, 1);
  SELECT * FROM t1 NATURAL JOIN t2;
  SELECT * FROM t1 JOIN t2 USING (j);
  ```

Na primeira declaração `SELECT`, a coluna `j` aparece em ambas as tabelas e, portanto, torna-se uma coluna de junção, então, de acordo com o SQL padrão, ela deve aparecer apenas uma vez no resultado, não duas vezes. Da mesma forma, na segunda declaração SELECT, a coluna `j` é nomeada na cláusula `USING` e deve aparecer apenas uma vez no resultado, não duas vezes.

Assim, as declarações produzem esta saída:

  ```
  +------+------+------+
  | j    | i    | k    |
  +------+------+------+
  |    1 |    1 |    1 |
  +------+------+------+
  +------+------+------+
  | j    | i    | k    |
  +------+------+------+
  |    1 |    1 |    1 |
  +------+------+------+
  ```

A eliminação de colunas redundantes e a ordenação de colunas ocorrem de acordo com o SQL padrão, produzindo este pedido de exibição:

+ Em primeiro lugar, coligamos as colunas comuns das duas tabelas unidas, na ordem em que elas ocorrem na primeira tabela.

+ Em segundo lugar, colunas exclusivas da primeira tabela, na ordem em que ocorrem nessa tabela.

+ Terceiro, colunas exclusivas da segunda tabela, na ordem em que ocorrem nessa tabela

A coluna de resultado única que substitui duas colunas comuns é definida usando a operação coalesce. Ou seja, para dois `t1.a` e `t2.a`, a coluna de junção única resultante `a` é definida como `a = COALESCE(t1.a, t2.a)`, onde:

  ```
  COALESCE(x, y) = (CASE WHEN x IS NOT NULL THEN x ELSE y END)
  ```

Se a operação de junção for qualquer outra junção, as colunas de resultado da junção consistem na concatenação de todas as colunas das tabelas unidas.

Uma consequência da definição de colunas coalescidas é que, para junções externas, a coluna coalescida contém o valor da coluna não `NULL` se uma das duas colunas é sempre `NULL`. Se nenhuma ou ambas as colunas são `NULL`, ambas as colunas comuns têm o mesmo valor, então não importa qual delas seja escolhida como o valor da coluna coalescida. Uma maneira simples de interpretar isso é considerar que uma coluna coalescida de uma junção externa é representada pela coluna comum da tabela interna de um `JOIN`. Suponha que as tabelas `t1(a, b)` e `t2(a, c)` tenham os seguintes conteúdos:

  ```
  t1    t2
  ----  ----
  1 x   2 z
  2 y   3 w
  ```

Então, para esta associação, a coluna `a` contém os valores de `t1.a`:

  ```
  mysql> SELECT * FROM t1 NATURAL LEFT JOIN t2;
  +------+------+------+
  | a    | b    | c    |
  +------+------+------+
  |    1 | x    | NULL |
  |    2 | y    | z    |
  +------+------+------+
  ```

Em contrapartida, para esta junção, a coluna `a` contém os valores de `t2.a`.

  ```
  mysql> SELECT * FROM t1 NATURAL RIGHT JOIN t2;
  +------+------+------+
  | a    | c    | b    |
  +------+------+------+
  |    2 | z    | y    |
  |    3 | w    | NULL |
  +------+------+------+
  ```

Compare esses resultados com as consultas equivalentes, que são as mesmas, mas com `JOIN ... ON`:

  ```
  mysql> SELECT * FROM t1 LEFT JOIN t2 ON (t1.a = t2.a);
  +------+------+------+------+
  | a    | b    | a    | c    |
  +------+------+------+------+
  |    1 | x    | NULL | NULL |
  |    2 | y    |    2 | z    |
  +------+------+------+------+
  ```

  ```
  mysql> SELECT * FROM t1 RIGHT JOIN t2 ON (t1.a = t2.a);
  +------+------+------+------+
  | a    | b    | a    | c    |
  +------+------+------+------+
  |    2 | y    |    2 | z    |
  | NULL | NULL |    3 | w    |
  +------+------+------+------+
  ```

* Uma cláusula `USING` pode ser reescrita como uma cláusula `ON` que compara colunas correspondentes. No entanto, embora `USING` e `ON` sejam semelhantes, não são exatamente as mesmas. Considere as seguintes duas consultas:

  ```
  a LEFT JOIN b USING (c1, c2, c3)
  a LEFT JOIN b ON a.c1 = b.c1 AND a.c2 = b.c2 AND a.c3 = b.c3
  ```

Em relação à determinação de quais linhas satisfazem a condição de junção, ambas as junções são semanticamente idênticas.

Em relação à determinação das colunas a serem exibidas para a expansão de `SELECT *`, as duas junções não são semanticamente idênticas. A junção `USING` seleciona o valor coalescido das colunas correspondentes, enquanto a junção `ON` seleciona todas as colunas de todas as tabelas. Para a junção `USING`, `SELECT *` seleciona esses valores:

  ```
  COALESCE(a.c1, b.c1), COALESCE(a.c2, b.c2), COALESCE(a.c3, b.c3)
  ```

Para a participação no `ON`, o `SELECT *` seleciona esses valores:

  ```
  a.c1, a.c2, a.c3, b.c1, b.c2, b.c3
  ```

Com uma junção interna, `COALESCE(a.c1, b.c1)` (comparison-operators.html#function_coalesce) é igual a `a.c1` ou `b.c1`, porque ambas as colunas têm o mesmo valor. Com uma junção externa (como `LEFT JOIN`), uma das duas colunas pode ser `NULL`. Essa coluna é omitida do resultado.

* Uma cláusula `ON` pode se referir apenas aos seus operandos.

Exemplo:

  ```
  CREATE TABLE t1 (i1 INT);
  CREATE TABLE t2 (i2 INT);
  CREATE TABLE t3 (i3 INT);
  SELECT * FROM t1 JOIN t2 ON (i1 = i3) JOIN t3;
  ```

A declaração falha com um erro `Unknown column 'i3' in 'on clause'`, porque `i3` é uma coluna em `t3`, que não é um operador da cláusula `ON`. Para permitir que a junção seja processada, reescreva a declaração da seguinte forma:

  ```
  SELECT * FROM t1 JOIN t2 JOIN t3 ON (i1 = i3);
  ```

* `JOIN` tem precedência maior que o operador de vírgula (`,`), portanto, a expressão de junção `t1, t2 JOIN t3` é interpretada como `(t1, (t2 JOIN t3))`, e não como `((t1, t2) JOIN t3)`. Isso afeta as declarações que utilizam uma cláusula de `ON`, porque essa cláusula pode se referir apenas a colunas nos operandos da junção, e a precedência afeta a interpretação do que esses operandos são.

Exemplo:

  ```
  CREATE TABLE t1 (i1 INT, j1 INT);
  CREATE TABLE t2 (i2 INT, j2 INT);
  CREATE TABLE t3 (i3 INT, j3 INT);
  INSERT INTO t1 VALUES(1, 1);
  INSERT INTO t2 VALUES(1, 1);
  INSERT INTO t3 VALUES(1, 1);
  SELECT * FROM t1, t2 JOIN t3 ON (t1.i1 = t3.i3);
  ```

O `JOIN` tem precedência sobre o operador de vírgula, portanto, os operandos para a cláusula `ON` são `t2` e `t3`. Como `t1.i1` não é uma coluna em nenhum dos operandos, o resultado é um erro `Unknown column 't1.i1' in 'on clause'`.

Para permitir que a junção seja processada, use uma dessas estratégias:

+ Agrupe as duas primeiras tabelas explicitamente entre parênteses para que os operandos para a cláusula `ON` sejam `(t1, t2)` e `t3`:

    ```
    SELECT * FROM (t1, t2) JOIN t3 ON (t1.i1 = t3.i3);
    ```

+ Evite o uso do operador de vírgula e use `JOIN` em vez disso:

    ```
    SELECT * FROM t1 JOIN t2 JOIN t3 ON (t1.i1 = t3.i3);
    ```

A mesma interpretação de precedência também se aplica a declarações que misturam o operador de vírgula com `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN` e `RIGHT JOIN`, todas as quais têm precedência maior do que o operador de vírgula.

* Uma extensão do MySQL em comparação com o padrão SQL:2003 é que o MySQL permite que você qualifique as colunas comuns (coalescidas) das junções de `NATURAL` ou `USING`, enquanto o padrão não permite isso.

### 15.2.14 Operações de conjunto com UNION, INTERSECT e EXCEPT

* Nomes das Colunas do Conjunto de Resultado e Tipos de Dados * Operações de Conjunto com Declarações TABLE e VALUES * Operações de Conjunto usando DISTINCT e ALL * Operações de Conjunto com ORDER BY e LIMIT * Limitações das Operações de Conjunto

As operações de conjunto do SQL combinam os resultados de vários blocos de consulta em um único resultado. Um *bloco de consulta*, às vezes também conhecido como *tabela simples*, é qualquer declaração SQL que retorne um conjunto de resultados, como `SELECT`. O MySQL 8.0 (8.0.19 e posterior) também suporta as declarações `TABLE` e `VALUES`. Consulte as descrições individuais dessas declarações em outros lugares neste capítulo para obter informações adicionais.

O padrão SQL define as seguintes três operações de conjunto:

* `UNION`: Combine todos os resultados de dois blocos de consulta em um único resultado, omitindo quaisquer duplicatas.

* `INTERSECT`: Combine apenas as linhas que os resultados de dois blocos de consulta têm em comum, omitindo quaisquer duplicatas.

* `EXCEPT`: Para os dois blocos de consulta *`A`* e *`B`*, retorne todos os resultados de *`A`* que não estejam também presentes em *`B`*, omitindo quaisquer duplicatas.

(Alguns sistemas de banco de dados, como o Oracle, usam `MINUS` para o nome desse operador. Isso não é suportado no MySQL.)

O MySQL já oferece suporte ao `UNION`; o MySQL 8.0 adiciona suporte ao `INTERSECT` e ao `EXCEPT` (MySQL 8.0.31 e versões posteriores).

Cada um desses operadores de conjunto suporta um modificador `ALL`. Quando a palavra-chave `ALL` segue um operador de conjunto, isso faz com que os duplicados sejam incluídos no resultado. Consulte as seções seguintes que cobrem os operadores individuais para mais informações e exemplos.

Todos os três operadores de conjunto também suportam a palavra-chave `DISTINCT`, que suprime os duplicados no resultado. Como este é o comportamento padrão dos operadores de conjunto, geralmente não é necessário especificar explicitamente `DISTINCT`.

Em geral, blocos de consulta e operações de conjunto podem ser combinados em qualquer número e ordem. Uma representação muito simplificada é mostrada aqui:

```
query_block [set_op query_block] [set_op query_block] ...

query_block:
    SELECT | TABLE | VALUES

set_op:
    UNION | INTERSECT | EXCEPT
```

Isso pode ser representado de forma mais precisa e com mais detalhes, assim:

```
query_expression:
  [with_clause] /* WITH clause */
  query_expression_body
  [order_by_clause] [limit_clause] [into_clause]

query_expression_body:
    query_term
 |  query_expression_body UNION [ALL | DISTINCT] query_term
 |  query_expression_body EXCEPT [ALL | DISTINCT] query_term

query_term:
    query_primary
 |  query_term INTERSECT [ALL | DISTINCT] query_primary

query_primary:
    query_block
 |  '(' query_expression_body [order_by_clause] [limit_clause] [into_clause] ')'

query_block:   /* also known as a simple table */
    query_specification                     /* SELECT statement */
 |  table_value_constructor                 /* VALUES statement */
 |  explicit_table                          /* TABLE statement  */
```

Você deve estar ciente de que `INTERSECT` é avaliado antes de `UNION` ou `EXCEPT`. Isso significa, por exemplo, que `TABLE x UNION TABLE y INTERSECT TABLE z` é sempre avaliado como `TABLE x UNION (TABLE y INTERSECT TABLE z)`. Consulte a Seção 15.2.8, “Cláusula INTERSECT”, para obter mais informações.

Além disso, você deve ter em mente que, embora os operadores de conjuntos `UNION` e `INTERSECT` sejam compostos (a ordem não é significativa), o `EXCEPT` não é (a ordem dos operandos afeta o resultado). Em outras palavras, todas as seguintes afirmações são verdadeiras:

* `TABLE x UNION TABLE y` e `TABLE y UNION TABLE x` produzem o mesmo resultado, embora a ordem das linhas possa diferir. Você pode forçá-las a serem iguais usando `ORDER BY`; veja ORDER BY e LIMIT em Unions.

* `TABLE x INTERSECT TABLE y` e `TABLE y INTERSECT TABLE x` retornam o mesmo resultado.

* `TABLE x EXCEPT TABLE y` e `TABLE y EXCEPT TABLE x` não produzem o mesmo resultado. Veja a Seção 15.2.4, “Cláusula de EXCEÇÃO”, para um exemplo.

Mais informações e exemplos podem ser encontrados nas seções que seguem.

#### Nomes das Colunas e Tipos de Dados do Conjunto de Resultados

Os nomes das colunas para o resultado de uma operação de conjunto são tomados dos nomes das colunas do primeiro bloco de consulta. Exemplo:

```
mysql> CREATE TABLE t1 (x INT, y INT);
Query OK, 0 rows affected (0.04 sec)

mysql> INSERT INTO t1 VALUES ROW(4,-2), ROW(5,9);
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> CREATE TABLE t2 (a INT, b INT);
Query OK, 0 rows affected (0.04 sec)

mysql> INSERT INTO t2 VALUES ROW(1,2), ROW(3,4);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> TABLE t1 UNION TABLE t2;
+------+------+
| x    | y    |
+------+------+
|    4 |   -2 |
|    5 |    9 |
|    1 |    2 |
|    3 |    4 |
+------+------+
4 rows in set (0.00 sec)

mysql> TABLE t2 UNION TABLE t1;
+------+------+
| a    | b    |
+------+------+
|    1 |    2 |
|    3 |    4 |
|    4 |   -2 |
|    5 |    9 |
+------+------+
4 rows in set (0.00 sec)
```

Isso é verdadeiro para as consultas `UNION`, `EXCEPT` e `INTERSECT`.

As colunas selecionadas listadas nas posições correspondentes de cada bloco de consulta devem ter o mesmo tipo de dados. Por exemplo, a primeira coluna selecionada pelo primeiro comando deve ter o mesmo tipo que a primeira coluna selecionada pelos outros comandos. Se os tipos de dados das colunas correspondentes dos resultados não corresponderem, os tipos e comprimentos das colunas no resultado levam em conta os valores recuperados por todos os blocos de consulta. Por exemplo, o comprimento da coluna no conjunto de resultados não é limitado ao comprimento do valor do primeiro comando, como mostrado aqui:

```
mysql> SELECT REPEAT('a',1) UNION SELECT REPEAT('b',20);
+----------------------+
| REPEAT('a',1)        |
+----------------------+
| a                    |
| bbbbbbbbbbbbbbbbbbbb |
+----------------------+
```

#### Operações de conjunto com instruções TABLE e VALUES

Começando com o MySQL 8.0.19, você também pode usar uma declaração `TABLE` ou declaração `VALUES` sempre que você pode empregar a declaração equivalente `SELECT`. Suponha que as tabelas `t1` e `t2` sejam criadas e preenchidas conforme mostrado aqui:

```
CREATE TABLE t1 (x INT, y INT);
INSERT INTO t1 VALUES ROW(4,-2),ROW(5,9);

CREATE TABLE t2 (a INT, b INT);
INSERT INTO t2 VALUES ROW(1,2),ROW(3,4);
```

Dado o caso anterior e ignorando os nomes das colunas na saída das consultas que começam com `VALUES`, todas as seguintes consultas `UNION` produzem o mesmo resultado:

```
SELECT * FROM t1 UNION SELECT * FROM t2;
TABLE t1 UNION SELECT * FROM t2;
VALUES ROW(4,-2), ROW(5,9) UNION SELECT * FROM t2;
SELECT * FROM t1 UNION TABLE t2;
TABLE t1 UNION TABLE t2;
VALUES ROW(4,-2), ROW(5,9) UNION TABLE t2;
SELECT * FROM t1 UNION VALUES ROW(4,-2),ROW(5,9);
TABLE t1 UNION VALUES ROW(4,-2),ROW(5,9);
VALUES ROW(4,-2), ROW(5,9) UNION VALUES ROW(4,-2),ROW(5,9);
```

Para forçar que os nomes das colunas sejam os mesmos, envolva o bloco de consulta do lado esquerdo em uma declaração `SELECT` e use aliases, assim:

```
mysql> SELECT * FROM (TABLE t2) AS t(x,y) UNION TABLE t1;
+------+------+
| x    | y    |
+------+------+
|    1 |    2 |
|    3 |    4 |
|    4 |   -2 |
|    5 |    9 |
+------+------+
4 rows in set (0.00 sec)
```

#### Operações de conjunto usando DISTINCT e ALL

Por padrão, as linhas duplicadas são removidas dos resultados das operações definidas. A palavra-chave opcional `DISTINCT` tem o mesmo efeito, mas torna-o explícito. Com a palavra-chave opcional `ALL`, a remoção de linhas duplicadas não ocorre e o resultado inclui todas as linhas correspondentes de todas as consultas na união.

Você pode misturar `ALL` e `DISTINCT` na mesma consulta. Os tipos mistos são tratados de forma que uma operação de conjunto usando `DISTINCT` substitui qualquer operação desse tipo usando `ALL` à sua esquerda. Uma operação de conjunto de `DISTINCT` pode ser produzida explicitamente usando `DISTINCT` com `UNION`, `INTERSECT` ou `EXCEPT`, ou implicitamente usando as operações de conjunto sem a palavra-chave subsequente `DISTINCT` ou `ALL`.

Em MySQL 8.0.19 e versões posteriores, as operações de conjunto funcionam da mesma maneira quando uma ou mais declarações `TABLE` ou `VALUES` ou ambas são usadas para gerar o conjunto.

#### Operações de conjunto com ORDER BY e LIMIT

Para aplicar uma cláusula `ORDER BY` ou `LIMIT` a um bloco de consulta individual utilizado como parte de uma união, interseção ou outra operação de conjunto, coloque o bloco de consulta entre parênteses, colocando a cláusula dentro dos parênteses, assim:

```
(SELECT a FROM t1 WHERE a=10 AND b=1 ORDER BY a LIMIT 10)
UNION
(SELECT a FROM t2 WHERE a=11 AND b=2 ORDER BY a LIMIT 10);

(TABLE t1 ORDER BY x LIMIT 10)
INTERSECT
(TABLE t2 ORDER BY a LIMIT 10);
```

O uso de `ORDER BY` para blocos ou declarações de consulta individual não implica em nada sobre a ordem em que as linhas aparecem no resultado final, porque as linhas produzidas por uma operação de conjunto são, por padrão, não ordenadas. Portanto, `ORDER BY` neste contexto é tipicamente usado em conjunto com `LIMIT`, para determinar o subconjunto das linhas selecionadas a serem recuperadas, embora isso não afete necessariamente a ordem dessas linhas no resultado final. Se `ORDER BY` aparece sem `LIMIT` dentro de um bloco de consulta, ele é otimizado, pois não tem efeito em nenhum caso.

Para usar uma cláusula `ORDER BY` ou `LIMIT` para ordenar ou limitar todo o resultado de uma operação de conjunto, coloque a cláusula `ORDER BY` ou `LIMIT` após a última declaração:

```
SELECT a FROM t1
EXCEPT
SELECT a FROM t2 WHERE a=11 AND b=2
ORDER BY a LIMIT 10;

TABLE t1
UNION
TABLE t2
ORDER BY a LIMIT 10;
```

Se uma ou mais declarações individuais utilizarem `ORDER BY`, `LIMIT`, ou ambas, e, além disso, você deseja aplicar uma ORDER BY, LIMIT ou ambas ao resultado total, então cada uma dessas declarações individuais deve ser fechada entre parênteses.

```
(SELECT a FROM t1 WHERE a=10 AND b=1)
EXCEPT
(SELECT a FROM t2 WHERE a=11 AND b=2)
ORDER BY a LIMIT 10;

(TABLE t1 ORDER BY a LIMIT 10)
UNION
TABLE t2
ORDER BY a LIMIT 10;
```

Uma declaração sem cláusula `ORDER BY` ou `LIMIT` não precisa ser colocada entre parênteses; substituir `TABLE t2` por `(TABLE t2)` na segunda declaração dos dois que acabamos de mostrar não altera o resultado do `UNION`.

Você também pode usar `ORDER BY` e `LIMIT` com declarações `VALUES` em operações de conjunto, como mostrado neste exemplo usando o cliente **mysql**:

```
mysql> VALUES ROW(4,-2), ROW(5,9), ROW(-1,3)
    -> UNION
    -> VALUES ROW(1,2), ROW(3,4), ROW(-1,3)
    -> ORDER BY column_0 DESC LIMIT 3;
+----------+----------+
| column_0 | column_1 |
+----------+----------+
|        5 |        9 |
|        4 |       -2 |
|        3 |        4 |
+----------+----------+
3 rows in set (0.00 sec)
```

(Você deve ter em mente que nem as declarações `TABLE` nem as declarações `VALUES` aceitam uma cláusula `WHERE`.

Esse tipo de `ORDER BY` não pode usar referências de coluna que incluam um nome de tabela (ou seja, nomes no formato *`tbl_name`*.*`col_name`*). Em vez disso, forneça um alias de coluna no primeiro bloco de consulta e faça referência ao alias na cláusula `ORDER BY`. (Você também pode fazer referência à coluna na cláusula `ORDER BY` usando sua posição na coluna, mas tal uso de posições de coluna é desaconselhado e, portanto, sujeito à eventual remoção em uma futura versão do MySQL.)

Se uma coluna a ser ordenada estiver aliada, a cláusula `ORDER BY` *deve* se referir ao alias, não ao nome da coluna. A primeira das seguintes declarações é permitida, mas a segunda falha com um erro `Unknown column 'a' in 'order clause'`:

```
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY b;
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY a;
```

Para fazer com que as linhas de um resultado do `UNION` consistem em conjuntos de linhas recuperadas por cada bloco de consulta um após o outro, selecione uma coluna adicional em cada bloco de consulta para usar como coluna de classificação e adicione uma cláusula `ORDER BY` que classifique nessa coluna após o último bloco de consulta:

```
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col;
```

Para manter a ordem de classificação dentro dos resultados individuais, adicione uma coluna secundária à cláusula `ORDER BY`:

```
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col, col1a;
```

O uso de uma coluna adicional também permite determinar de qual bloco de consulta cada linha vem. Colunas extras podem fornecer outras informações de identificação, como uma string que indica o nome de uma tabela.

#### Limitações das operações de conjunto

As operações definidas no MySQL estão sujeitas a algumas limitações, que são descritas nos próximos parágrafos.

As operações definidas, incluindo as declarações `SELECT`, têm as seguintes limitações:

* `HIGH_PRIORITY` no primeiro `SELECT` não tem efeito. `HIGH_PRIORITY` em qualquer `SELECT` subsequente produz um erro de sintaxe.

* Somente a última declaração `SELECT` pode utilizar uma cláusula `INTO`. No entanto, todo o resultado `UNION` é escrito no destino de saída `INTO`.

A partir do MySQL 8.0.20, essas duas variantes `UNION` que contêm `INTO` são desaconselhadas; você deve esperar que o suporte para elas seja removido em uma versão futura do MySQL:

* No bloco de consulta subsequente de uma expressão de consulta, o uso de `INTO` antes de `FROM` produz um aviso. Exemplo:

  ```
  ... UNION SELECT * INTO OUTFILE 'file_name' FROM table_name;
  ```

* Em um bloco de fechamento entre parênteses de uma expressão de consulta, o uso de `INTO` (independentemente de sua posição em relação a `FROM`) produz um aviso. Exemplo:

  ```
  ... UNION (SELECT * INTO OUTFILE 'file_name' FROM table_name);
  ```

Essas variantes são desaconselhadas porque são confusas, como se coletassem informações da tabela nomeada em vez da expressão de consulta inteira (o `UNION`).

As operações de conjunto com uma função agregada em uma cláusula `ORDER BY` são rejeitadas com `ER_AGGREGATE_ORDER_FOR_UNION`. Embora o nome do erro possa sugerir que isso seja exclusivo para consultas `UNION`, o que foi dito anteriormente também é verdadeiro para consultas `EXCEPT` e `INTERSECT`, como mostrado aqui:

```
mysql> TABLE t1 INTERSECT TABLE t2 ORDER BY MAX(x);
ERROR 3028 (HY000): Expression #1 of ORDER BY contains aggregate function and applies to a UNION, EXCEPT or INTERSECT
```

Uma cláusula de bloqueio (como `FOR UPDATE` ou `LOCK IN SHARE MODE`) se aplica ao bloco de consulta que a segue. Isso significa que, em uma declaração `SELECT` usada com operações de conjunto, uma cláusula de bloqueio pode ser usada apenas se o bloco de consulta e a cláusula de bloqueio estiverem entre parênteses.

### 15.2.15 Subconsultas

Uma subconsulta é uma declaração `SELECT` dentro de outra declaração.

Todos os formulários e operações de subconsulta que o padrão SQL exige são suportados, além de algumas funcionalidades específicas do MySQL.

Aqui está um exemplo de uma subconsulta:

```
SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
```

Neste exemplo, `SELECT * FROM t1 ...` é a *consulta externa* (ou *declaração externa*), e `(SELECT column1 FROM t2)` é a *subconsulta*. Dizemos que a subconsulta está *aninhada* dentro da consulta externa, e, de fato, é possível aninhar subconsultas dentro de outras subconsultas, até uma profundidade considerável. Uma subconsulta deve sempre aparecer dentro de parênteses.

As principais vantagens das subconsultas são:

* Permitem consultas que são *estruturadas* para que seja possível isolar cada parte de uma declaração.

* Eles oferecem maneiras alternativas de realizar operações que, de outra forma, exigiriam junções e uniões complexas.

* Muitas pessoas acham que as subconsultas são mais legíveis do que as junções ou uniões complexas. De fato, foi a inovação das subconsultas que deu às pessoas a ideia original de chamar o SQL inicial de "Linguagem de Consulta Estruturada".

Aqui está uma declaração de exemplo que mostra os principais pontos sobre a sintaxe de subconsultas, conforme especificado pelo padrão SQL e suportado no MySQL:

```
DELETE FROM t1
WHERE s11 > ANY
 (SELECT COUNT(*) /* no hint */ FROM t2
  WHERE NOT EXISTS
   (SELECT * FROM t3
    WHERE ROW(5*t2.s1,77)=
     (SELECT 50,11*s1 FROM t4 UNION SELECT 50,77 FROM
      (SELECT * FROM t5) AS t5)));
```

Uma subconsulta pode retornar um escalar (um único valor), uma única linha, uma única coluna ou uma tabela (uma ou mais linhas de uma ou mais colunas). Essas são chamadas de subconsultas escalares, coluna, linha e tabela. Subconsultas que retornam um tipo específico de resultado muitas vezes podem ser usadas apenas em certos contextos, conforme descrito nas seções a seguir.

Há poucas restrições quanto ao tipo de declarações nas quais subconsultas podem ser usadas. Uma subconsulta pode conter muitas das palavras-chave ou cláusulas que uma `SELECT` comum pode conter: `DISTINCT`, `GROUP BY`, `ORDER BY`, `LIMIT`, junções, dicas de índice, `UNION` construções, comentários, funções, e assim por diante.

Começando com o MySQL 8.0.19, as declarações `TABLE` e `VALUES` podem ser usadas em subconsultas. Subconsultas que utilizam `VALUES` são, geralmente, versões mais extensas de subconsultas que podem ser reescritas de forma mais compacta usando notação de conjunto, ou com a sintaxe de `SELECT` ou `TABLE`. Supondo que a tabela `ts` seja criada usando a declaração [`CREATE TABLE ts VALUES ROW(2), ROW(4), ROW(6)`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"), as declarações mostradas aqui são todas equivalentes:

```
SELECT * FROM tt
    WHERE b > ANY (VALUES ROW(2), ROW(4), ROW(6));

SELECT * FROM tt
    WHERE b > ANY (SELECT * FROM ts);

SELECT * FROM tt
    WHERE b > ANY (TABLE ts);
```

Exemplos de subconsultas de `TABLE` são mostrados nas seções a seguir.

A declaração externa de uma subconsulta pode ser qualquer uma das seguintes: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `SET` ou `DO`.

Para informações sobre como o otimizador lida com subconsultas, consulte [Seção 10.2.2, “Otimização de subconsultas, tabelas derivadas, referências de visão e expressões de tabela comum”][(subquery-optimization.html "10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions")]. Para uma discussão sobre as restrições de uso de subconsultas, incluindo questões de desempenho para certas formas de sintaxe de subconsulta, consulte Seção 15.2.15.12, “Restrições de subconsultas”.

#### 15.2.15.1 A subconsulta como operador escalar

Na sua forma mais simples, uma subconsulta é uma subconsulta escalar que retorna um único valor. Uma subconsulta escalar é um operador simples, e você pode usá-la quase em qualquer lugar onde um valor de coluna única ou literal é legal, e você pode esperar que ela tenha as características que todos os operadores têm: um tipo de dados, uma comprimento, uma indicação de que ela pode ser `NULL`, e assim por diante. Por exemplo:

```
CREATE TABLE t1 (s1 INT, s2 CHAR(5) NOT NULL);
INSERT INTO t1 VALUES(100, 'abcde');
SELECT (SELECT s2 FROM t1);
```

A subconsulta nesta `SELECT` retorna um único valor (`'abcde'`) que tem um tipo de dados de `CHAR`, uma extensão de 5 caracteres, um conjunto de caracteres e uma ordenação iguais aos padrões em vigor no momento de `CREATE TABLE`, e uma indicação de que o valor na coluna pode ser `NULL`. A nulidade do valor selecionado por uma subconsulta escalar não é copiada porque, se o resultado da subconsulta for vazio, o resultado é `NULL`. Para a subconsulta mostrada acima, se `t1` fosse vazio, o resultado seria `NULL`, embora `s2` seja `NOT NULL`.

Há alguns contextos em que uma subconsulta escalar não pode ser usada. Se uma declaração permite apenas um valor literal, você não pode usar uma subconsulta. Por exemplo, `LIMIT` requer argumentos inteiros literais, e [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") requer um nome de arquivo literal de cadeia. Você não pode usar subconsultas para fornecer esses valores.

Quando você ver exemplos nas seções a seguir que contêm o construtor bastante austero `(SELECT column1 FROM t1)`, imagine que seu próprio código contém construções muito mais diversas e complexas.

Suponha que façamos duas tabelas:

```
CREATE TABLE t1 (s1 INT);
INSERT INTO t1 VALUES (1);
CREATE TABLE t2 (s1 INT);
INSERT INTO t2 VALUES (2);
```

Em seguida, realize um `SELECT`:

```
SELECT (SELECT s1 FROM t2) FROM t1;
```

O resultado é `2`, porque há uma linha em `t2` que contém uma coluna `s1` que tem um valor de `2`.

Em MySQL 8.0.19 e versões posteriores, a consulta anterior também pode ser escrita da seguinte forma, usando `TABLE`:

```
SELECT (TABLE t2) FROM t1;
```

Uma subconsulta escalar pode fazer parte de uma expressão, mas lembre-se das chaves, mesmo que a subconsulta seja um operador que fornece um argumento para uma função. Por exemplo:

```
SELECT UPPER((SELECT s1 FROM t1)) FROM t2;
```

O mesmo resultado pode ser obtido no MySQL 8.0.19 e versões posteriores usando `SELECT UPPER((TABLE t1)) FROM t2`.

#### 15.2.15.2 Comparativos usando subconsultas

O uso mais comum de uma subconsulta é na forma:

```
non_subquery_operand comparison_operator (subquery)
```

Onde *`comparison_operator`* é um desses operadores:

```
=  >  <  >=  <=  <>  !=  <=>
```

Por exemplo:

```
... WHERE 'a' = (SELECT column1 FROM t1)
```

O MySQL também permite essa construção:

```
non_subquery_operand LIKE (subquery)
```

Em um determinado momento, o único local legal para uma subconsulta era no lado direito de uma comparação, e ainda pode encontrar alguns sistemas de gerenciamento de banco de dados antigos que insistem nisso.

Aqui está um exemplo de uma comparação de subconsulta de forma comum que você não pode fazer com uma junção. Ela encontra todas as linhas na tabela `t1` para as quais o valor de `column1` é igual a um valor máximo na tabela `t2`:

```
SELECT * FROM t1
  WHERE column1 = (SELECT MAX(column2) FROM t2);
```

Aqui está outro exemplo, que, novamente, é impossível com uma junção porque envolve agregação para uma das tabelas. Ele encontra todas as linhas na tabela `t1` que contêm um valor que ocorre duas vezes em uma coluna dada:

```
SELECT * FROM t1 AS t
  WHERE 2 = (SELECT COUNT(*) FROM t1 WHERE t1.id = t.id);
```

Para uma comparação da subconsulta com um escalar, a subconsulta deve retornar um escalar. Para uma comparação da subconsulta com um construtor de linha, a subconsulta deve ser uma subconsulta de linha que retorne uma linha com o mesmo número de valores que o construtor de linha. Veja a Seção 15.2.15.5, “Subconsultas de Linha”.

#### 15.2.15.3 Subconsultas com ANY, IN ou SOME

Sintaxe:

```
operand comparison_operator ANY (subquery)
operand IN (subquery)
operand comparison_operator SOME (subquery)
```

Onde *`comparison_operator`* é um desses operadores:

```
=  >  <  >=  <=  <>  !=
```

A palavra-chave `ANY`, que deve seguir um operador de comparação, significa “retorne `TRUE` se a comparação for `TRUE` para `ANY` dos valores na coluna que a subconsulta retorna”. Por exemplo:

```
SELECT s1 FROM t1 WHERE s1 > ANY (SELECT s1 FROM t2);
```

Suponha que haja uma linha na tabela `t1` contendo `(10)`. A expressão é `TRUE` se a tabela `t2` contiver `(21,14,7)`, porque há um valor `7` em `t2` que é menor que `10`. A expressão é `FALSE` se a tabela `t2` contiver `(20,10)`, ou se a tabela `t2` estiver vazia. A expressão é *desconhecida* (ou seja, `NULL`) se a tabela `t2` contiver `(NULL,NULL,NULL)`.

Quando usado com uma subconsulta, a palavra `IN` é um alias para `= ANY`. Assim, essas duas declarações são iguais:

```
SELECT s1 FROM t1 WHERE s1 = ANY (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 IN    (SELECT s1 FROM t2);
```

`IN` e `= ANY` não são sinônimos quando usados com uma lista de expressão. `IN` pode receber uma lista de expressão, mas `= ANY` não pode. Veja a Seção 14.4.2, “Funções e Operadores de Comparação”.

`NOT IN` não é um alias para `<> ANY`, mas para `<> ALL`. Veja a Seção 15.2.15.4, “Subconsultas com ALL”.

A palavra `SOME` é um alias para `ANY`. Assim, essas duas declarações são iguais:

```
SELECT s1 FROM t1 WHERE s1 <> ANY  (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 <> SOME (SELECT s1 FROM t2);
```

O uso da palavra `SOME` é raro, mas este exemplo mostra por que ela pode ser útil. Para a maioria das pessoas, a frase em inglês “a não é igual a qualquer b” significa “não existe b que seja igual a a”, mas isso não é o que se quer dizer com a sintaxe SQL. A sintaxe significa “existe algum b a que a não é igual”. Usando `<> SOME` em vez disso, ajuda a garantir que todos entendam o verdadeiro significado da consulta.

Começando com o MySQL 8.0.19, você pode usar `TABLE` em uma subconsulta escalar `IN`, `ANY` ou `SOME`, desde que a tabela contenha apenas uma única coluna. Se `t2` tiver apenas uma coluna, as declarações mostradas anteriormente nesta seção podem ser escritas como mostrado aqui, substituindo, em cada caso, `TABLE t2` por `SELECT s1 FROM t2`:

```
SELECT s1 FROM t1 WHERE s1 > ANY (TABLE t2);

SELECT s1 FROM t1 WHERE s1 = ANY (TABLE t2);

SELECT s1 FROM t1 WHERE s1 IN (TABLE t2);

SELECT s1 FROM t1 WHERE s1 <> ANY  (TABLE t2);

SELECT s1 FROM t1 WHERE s1 <> SOME (TABLE t2);
```

#### 15.2.15.4 Subconsultas com ALL

Sintaxe:

```
operand comparison_operator ALL (subquery)
```

A palavra `ALL`, que deve ser seguida por um operador de comparação, significa “retorne `TRUE` se a comparação for `TRUE` para `ALL` dos valores na coluna que a subconsulta retorna”. Por exemplo:

```
SELECT s1 FROM t1 WHERE s1 > ALL (SELECT s1 FROM t2);
```

Suponha que haja uma linha na tabela `t1` contendo `(10)`. A expressão é `TRUE` se a tabela `t2` contiver `(-5,0,+5)` porque `10` é maior que os três valores em `t2`. A expressão é `FALSE` se a tabela `t2` contiver `(12,6,NULL,-100)` porque há um único valor `12` na tabela `t2` que é maior que `10`. A expressão é *desconhecida* (ou seja, `NULL`) se a tabela `t2` contiver `(0,NULL,1)`.

Por fim, a expressão é `TRUE` se a tabela `t2` estiver vazia. Portanto, a expressão a seguir é `TRUE` quando a tabela `t2` estiver vazia:

```
SELECT * FROM t1 WHERE 1 > ALL (SELECT s1 FROM t2);
```

Mas essa expressão é `NULL` quando a tabela `t2` está vazia:

```
SELECT * FROM t1 WHERE 1 > (SELECT s1 FROM t2);
```

Além disso, a seguinte expressão é `NULL` quando a tabela `t2` está vazia:

```
SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);
```

Em geral, as tabelas que contêm valores de `NULL` e as tabelas vazias são "casos de borda". Ao escrever subconsultas, sempre considere se você levou essas duas possibilidades em conta.

`NOT IN` é um alias para `<> ALL`. Assim, essas duas declarações são iguais:

```
SELECT s1 FROM t1 WHERE s1 <> ALL (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 NOT IN (SELECT s1 FROM t2);
```

O MySQL 8.0.19 suporta a declaração `TABLE`. Assim como `IN`, `ANY` e `SOME`, você pode usar `TABLE` com `ALL` e `NOT IN`, desde que as duas condições a seguir sejam atendidas:

* A tabela na subconsulta contém apenas uma coluna * A subconsulta não depende de uma expressão de coluna

Por exemplo, supondo que a tabela `t2` consista em uma única coluna, as duas últimas declarações mostradas anteriormente podem ser escritas usando `TABLE t2` da seguinte forma:

```
SELECT s1 FROM t1 WHERE s1 <> ALL (TABLE t2);
SELECT s1 FROM t1 WHERE s1 NOT IN (TABLE t2);
```

Uma consulta como `SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);` não pode ser escrita usando `TABLE t2`, porque a subconsulta depende de uma expressão de coluna.

#### 15.2.15.5 Subconsultas de linha

Subconsultas escalares ou de coluna retornam um único valor ou uma coluna de valores. Uma subconsulta *de linha* é uma variante de subconsulta que retorna uma única linha e, portanto, pode retornar mais de um valor de coluna. Operadores legais para comparações de subconsultas de linha são:

```
=  >  <  >=  <=  <>  !=  <=>
```

Aqui estão dois exemplos:

```
SELECT * FROM t1
  WHERE (col1,col2) = (SELECT col3, col4 FROM t2 WHERE id = 10);
SELECT * FROM t1
  WHERE ROW(col1,col2) = (SELECT col3, col4 FROM t2 WHERE id = 10);
```

Para ambas as consultas, se a tabela `t2` contiver uma única linha com `id = 10`, a subconsulta retorna uma única linha. Se essa linha tiver os valores `col3` e `col4` iguais aos valores `col1` e `col2` de quaisquer linhas em `t1`, a expressão `WHERE` é `TRUE` e cada consulta retorna essas linhas `t1`. Se os valores da linha `t2` `col3` e `col4` não forem iguais aos valores `col1` e `col2` de qualquer linha em `t1`, a expressão é `FALSE` e a consulta retorna um conjunto de resultados vazio. A expressão é *desconhecida* (ou seja, `NULL`) se a subconsulta não produzir nenhuma linha. Um erro ocorre se a subconsulta produzir várias linhas, pois uma subconsulta de linha pode retornar no máximo uma linha.

Para informações sobre como cada operador funciona para comparações de linha, consulte a Seção 14.4.2, “Funções e operadores de comparação”.

As expressões `(1,2)` e `ROW(1,2)` são às vezes chamadas de construtores de linha. As duas são equivalentes. O construtor de linha e a linha devolvida pela subconsulta devem conter o mesmo número de valores.

Um construtor de linha é usado para comparações com subconsultas que retornam duas ou mais colunas. Quando uma subconsulta retorna uma única coluna, isso é considerado um valor escalar e não como uma linha, portanto, um construtor de linha não pode ser usado com uma subconsulta que não retorne pelo menos duas colunas. Assim, a seguinte consulta falha com um erro de sintaxe:

```
SELECT * FROM t1 WHERE ROW(1) = (SELECT column1 FROM t2)
```

Os construtores de linha são válidos em outros contextos. Por exemplo, as seguintes duas declarações são semanticamente equivalentes (e são tratadas da mesma maneira pelo otimizador):

```
SELECT * FROM t1 WHERE (column1,column2) = (1,1);
SELECT * FROM t1 WHERE column1 = 1 AND column2 = 1;
```

A seguinte consulta responde à solicitação: “encontrar todas as linhas na tabela `t1` que também existem na tabela `t2`”:

```
SELECT column1,column2,column3
  FROM t1
  WHERE (column1,column2,column3) IN
         (SELECT column1,column2,column3 FROM t2);
```

Para mais informações sobre o otimizador e os construtores de linha, consulte a Seção 10.2.1.22, “Otimização da expressão do construtor de linha”.

#### 15.2.15.6 Subconsultas com EXISTS ou NOT EXISTS

Se uma subconsulta retornar qualquer número de linhas, `EXISTS subquery` é `TRUE`, e `NOT EXISTS subquery` é `FALSE`. Por exemplo:

```
SELECT column1 FROM t1 WHERE EXISTS (SELECT * FROM t2);
```

Tradicionalmente, uma subconsulta `EXISTS` começa com `SELECT *`, mas poderia começar com `SELECT 5` ou `SELECT column1` ou qualquer outra coisa. O MySQL ignora a lista `SELECT` em uma subconsulta desse tipo, então não faz diferença.

Para o exemplo anterior, se `t2` contiver quaisquer linhas, mesmo linhas com apenas valores de `NULL`, a condição `EXISTS` é `TRUE`. Esse é, na verdade, um exemplo improvável, porque uma subconsulta `[NOT] EXISTS` quase sempre contém correlações. Aqui estão alguns exemplos mais realistas:

* Que tipo de loja está presente em uma ou mais cidades?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE EXISTS (SELECT * FROM cities_stores
                  WHERE cities_stores.store_type = stores.store_type);
  ```

* Que tipo de loja está presente em nenhuma cidade?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (SELECT * FROM cities_stores
                      WHERE cities_stores.store_type = stores.store_type);
  ```

* Que tipo de loja está presente em todas as cidades?

  ```
  SELECT DISTINCT store_type FROM stores
    WHERE NOT EXISTS (
      SELECT * FROM cities WHERE NOT EXISTS (
        SELECT * FROM cities_stores
         WHERE cities_stores.city = cities.city
         AND cities_stores.store_type = stores.store_type));
  ```

O último exemplo é uma consulta dupla `NOT EXISTS`. Ou seja, ela tem uma cláusula `NOT EXISTS` dentro de uma cláusula `NOT EXISTS`. Formalmente, ela responde à pergunta “existe uma cidade com uma loja que não está em `Stores`?”. Mas é mais fácil dizer que uma consulta `NOT EXISTS` aninhada responde à pergunta “*`x`* é `TRUE` para todos os *`y`*?”.

Em MySQL 8.0.19 e versões posteriores, você também pode usar `NOT EXISTS` ou `NOT EXISTS` com `TABLE` na subconsulta, assim:

```
SELECT column1 FROM t1 WHERE EXISTS (TABLE t2);
```

Os resultados são os mesmos quando se usa `SELECT *` sem a cláusula `WHERE` na subconsulta.

#### 15.2.15.7 Subconsultas correlacionadas

Uma *subconsulta correlacionada* é uma subconsulta que contém uma referência a uma tabela que também aparece na consulta externa. Por exemplo:

```
SELECT * FROM t1
  WHERE column1 = ANY (SELECT column1 FROM t2
                       WHERE t2.column2 = t1.column2);
```

Observe que a subconsulta contém uma referência a uma coluna de `t1`, embora a cláusula `FROM` da subconsulta não mencione uma tabela `t1`. Portanto, o MySQL procura fora da subconsulta e encontra `t1` na consulta externa.

Suponha que a tabela `t1` contenha uma linha onde `column1 = 5` e `column2 = 6`; enquanto isso, a tabela `t2` contém uma linha onde `column1 = 5` e `column2 = 7`. A expressão simples `... WHERE column1 = ANY (SELECT column1 FROM t2)` seria `TRUE`, mas, neste exemplo, a cláusula `WHERE` dentro da subconsulta é `FALSE` (porque `(5,6)` não é igual a `(5,7)`,) então a expressão como um todo é `FALSE`.

**Regra de escopo:** O MySQL avalia de dentro para fora. Por exemplo:

```
SELECT column1 FROM t1 AS x
  WHERE x.column1 = (SELECT column1 FROM t2 AS x
    WHERE x.column1 = (SELECT column1 FROM t3
      WHERE x.column2 = t3.column1));
```

Nesta declaração, `x.column2` deve ser uma coluna na tabela `t2`, porque `SELECT column1 FROM t2 AS x ...` renomeia `t2`. Não é uma coluna na tabela `t1`, porque `SELECT column1 FROM t1 ...` é uma consulta externa que está *mais distante*.

Começando com o MySQL 8.0.24, o otimizador pode transformar uma subconsulta escalar correlacionada em uma tabela derivada quando a bandeira `subquery_to_derived` da variável `optimizer_switch` é habilitada. Considere a consulta mostrada aqui:

```
SELECT * FROM t1
    WHERE ( SELECT a FROM t2
              WHERE t2.a=t1.a ) > 0;
```

Para evitar materializar várias vezes para uma tabela derivada dada, podemos, em vez disso, materializar — uma vez — uma tabela derivada que adicione um agrupamento na coluna de junção da tabela referenciada na consulta interna (`t2.a`) e, em seguida, uma junção externa no predicado levantado (`t1.a = derived.a`) para selecionar o grupo correto para combinar com a linha externa. (Se a subconsulta já tiver um agrupamento explícito, o agrupamento extra é adicionado ao final da lista de agrupamento.) A consulta anteriormente mostrada pode, portanto, ser reescrita da seguinte forma:

```
SELECT t1.* FROM t1
    LEFT OUTER JOIN
        (SELECT a, COUNT(*) AS ct FROM t2 GROUP BY a) AS derived
    ON  t1.a = derived.a
        AND
        REJECT_IF(
            (ct > 1),
            "ERROR 1242 (21000): Subquery returns more than 1 row"
            )
    WHERE derived.a > 0;
```

Na consulta reescrita, `REJECT_IF()` representa uma função interna que testa uma condição dada (aqui, a comparação `ct > 1`) e gera um erro dado (neste caso, `ER_SUBQUERY_NO_1_ROW`) se a condição for verdadeira. Isso reflete a verificação de cardinalidade que o otimizador realiza como parte da avaliação da cláusula `JOIN` ou `WHERE`, antes de avaliar qualquer predicado levantado, o que é feito apenas se a subconsulta não retornar mais de uma linha.

Esse tipo de transformação pode ser realizado, desde que as seguintes condições sejam atendidas:

* A subconsulta pode fazer parte de uma lista `SELECT`, condição `WHERE` ou condição `HAVING`, mas não pode fazer parte de uma condição `JOIN`, e não pode conter uma cláusula `LIMIT` ou `OFFSET`. Além disso, a subconsulta não pode conter operações de conjunto, como `UNION`.

* A cláusula `WHERE` pode conter um ou mais predicados, combinados com `AND`. Se a cláusula `WHERE` contiver uma cláusula `OR`, ela não pode ser transformada. Pelo menos um dos predicados da cláusula `WHERE` deve ser elegível para transformação, e nenhum deles pode rejeitar a transformação.

* Para ser elegível para transformação, um predicado da cláusula `WHERE` deve ser um predicado de igualdade em que cada operando deve ser uma referência simples de coluna. Outros predicados, incluindo outros predicados de comparação, não são elegíveis para transformação. O predicado deve empregar o operador de igualdade `=` para fazer a comparação; o operador `<=>` seguro para nulos não é suportado neste contexto.

* Um predicado de cláusula `WHERE` que contém apenas referências internas não é elegível para transformação, uma vez que pode ser avaliado antes do agrupamento. Um predicado de cláusula `WHERE` que contém apenas referências externas é elegível para transformação, mesmo que possa ser elevado até o bloco de consulta externa. Isso é possível ao adicionar uma verificação de cardinalidade sem agrupamento na tabela derivada.

* Para ser elegível, um predicado da cláusula `WHERE` deve ter um operando que contenha apenas referências internas e um operando que contenha apenas referências externas. Se o predicado não for elegível devido a essa regra, a transformação da consulta é rejeitada.

* Uma coluna correlacionada pode estar presente apenas na cláusula `WHERE` da subconsulta (e não na lista `SELECT`, na cláusula `JOIN` ou `ORDER BY`, na lista `GROUP BY` ou na cláusula `HAVING`). Além disso, não pode haver nenhuma coluna correlacionada dentro de uma tabela derivada na lista `FROM` da subconsulta.

* Uma coluna correlacionada não pode ser contida na lista de argumentos de uma função agregada.

* Uma coluna correlacionada deve ser resolvida no bloco de consulta diretamente contendo a subconsulta considerada para transformação.

* Uma coluna correlacionada não pode estar presente em uma subconsulta escalar aninhada na cláusula `WHERE`.

* A subconsulta não pode conter quaisquer funções de janela e não deve conter nenhuma função agregada que agregue em um bloco de consulta externo à subconsulta. Uma função agregada `COUNT()`, se contida no elemento de lista `SELECT` do elemento da subconsulta, deve estar no nível mais alto e não pode fazer parte de uma expressão.

Veja também a Seção 15.2.15.8, “Tabelas Derivadas”.

#### 15.2.15.8 Tabelas Derivadas

Esta seção discute as características gerais das tabelas derivadas. Para informações sobre tabelas derivadas laterais precedidas pela palavra-chave `LATERAL`, consulte a Seção 15.2.15.9, “Tabelas Derivadas Laterais”.

Uma tabela derivada é uma expressão que gera uma tabela dentro do escopo de uma cláusula da consulta `FROM`. Por exemplo, uma subconsulta em uma cláusula da declaração `SELECT` `FROM` é uma tabela derivada:

```
SELECT ... FROM (subquery) [AS] tbl_name ...
```

A função `JSON_TABLE()` gera uma tabela e oferece outra maneira de criar uma tabela derivada:

```
SELECT * FROM JSON_TABLE(arg_list) [AS] tbl_name ...
```

A cláusula `[AS] tbl_name` é obrigatória porque cada tabela em uma cláusula `FROM` deve ter um nome. Quaisquer colunas na tabela derivada devem ter nomes únicos. Alternativamente, *`tbl_name`* pode ser seguido por uma lista entre parênteses de nomes para as colunas da tabela derivada:

```
SELECT ... FROM (subquery) [AS] tbl_name (col_list) ...
```

O número de nomes de colunas deve ser igual ao número de colunas da tabela.

Por motivos ilustrativos, vamos supor que você tenha esta tabela:

```
CREATE TABLE t1 (s1 INT, s2 CHAR(5), s3 FLOAT);
```

Veja como usar uma subconsulta na cláusula `FROM`, usando a tabela de exemplo:

```
INSERT INTO t1 VALUES (1,'1',1.0);
INSERT INTO t1 VALUES (2,'2',2.0);
SELECT sb1,sb2,sb3
  FROM (SELECT s1 AS sb1, s2 AS sb2, s3*2 AS sb3 FROM t1) AS sb
  WHERE sb1 > 1;
```

Resultado:

```
+------+------+------+
| sb1  | sb2  | sb3  |
+------+------+------+
|    2 | 2    |    4 |
+------+------+------+
```

Aqui está outro exemplo: Suponha que você queira saber a média de um conjunto de somas para uma tabela agrupada. Isso não funciona:

```
SELECT AVG(SUM(column1)) FROM t1 GROUP BY column1;
```

No entanto, essa consulta fornece as informações desejadas:

```
SELECT AVG(sum_column1)
  FROM (SELECT SUM(column1) AS sum_column1
        FROM t1 GROUP BY column1) AS t1;
```

Observe que o nome da coluna usado na subconsulta (`sum_column1`) é reconhecido na consulta externa.

Os nomes das colunas para uma tabela derivada vêm da sua lista de seleção:

```
mysql> SELECT * FROM (SELECT 1, 2, 3, 4) AS dt;
+---+---+---+---+
| 1 | 2 | 3 | 4 |
+---+---+---+---+
| 1 | 2 | 3 | 4 |
+---+---+---+---+
```

Para fornecer nomes de colunas explicitamente, siga o nome da tabela derivada com uma lista entre parênteses dos nomes de colunas:

```
mysql> SELECT * FROM (SELECT 1, 2, 3, 4) AS dt (a, b, c, d);
+---+---+---+---+
| a | b | c | d |
+---+---+---+---+
| 1 | 2 | 3 | 4 |
+---+---+---+---+
```

Uma tabela derivada pode retornar um escalar, coluna, linha ou tabela.

As tabelas derivadas estão sujeitas a essas restrições:

* Uma tabela derivada não pode conter referências a outras tabelas da mesma `SELECT` (use uma tabela derivada `LATERAL` para isso; veja Seção 15.2.15.9, “Tabelas Derivadas Laterais”).

* Antes do MySQL 8.0.14, uma tabela derivada não pode conter referências externas. Essa é uma restrição do MySQL que é levantada no MySQL 8.0.14, e não uma restrição do padrão SQL. Por exemplo, a tabela derivada `dt` na seguinte consulta contém uma referência `t1.b` para a tabela `t1` na consulta externa:

  ```
  SELECT * FROM t1
  WHERE t1.d > (SELECT AVG(dt.a)
                  FROM (SELECT SUM(t2.a) AS a
                        FROM t2
                        WHERE t2.b = t1.b GROUP BY t2.c) dt
                WHERE dt.a > 10);
  ```

A consulta é válida no MySQL 8.0.14 e superior. Antes de 8.0.14, ela produz um erro: `Unknown column 't1.b' in 'where clause'`

O otimizador determina informações sobre tabelas derivadas de tal forma que `EXPLAIN` não precisa materializá-las. Veja [Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visão e expressões de tabela comum com junção ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")].

É possível, em determinadas circunstâncias, que o uso de `EXPLAIN SELECT` modifique os dados da tabela. Isso pode ocorrer se a consulta externa acessar quaisquer tabelas e uma consulta interna invocando uma função armazenada que altera uma ou mais linhas de uma tabela. Suponha que existam duas tabelas `t1` e `t2` no banco de dados `d1`, e uma função armazenada `f1` que modifica `t2`, criada conforme mostrado aqui:

```
CREATE DATABASE d1;
USE d1;
CREATE TABLE t1 (c1 INT);
CREATE TABLE t2 (c1 INT);
CREATE FUNCTION f1(p1 INT) RETURNS INT
  BEGIN
    INSERT INTO t2 VALUES (p1);
    RETURN p1;
  END;
```

Referenciar a função diretamente em `EXPLAIN SELECT` (explain.html "15.8.2 EXPLAIN Statement") não tem efeito sobre `t2`, conforme mostrado aqui:

```
mysql> SELECT * FROM t2;
Empty set (0.02 sec)

mysql> EXPLAIN SELECT f1(5)\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: NULL
   partitions: NULL
         type: NULL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
     filtered: NULL
        Extra: No tables used
1 row in set (0.01 sec)

mysql> SELECT * FROM t2;
Empty set (0.01 sec)
```

Isso ocorre porque a declaração `SELECT` não fez referência a nenhuma tabela, como pode ser visto nas colunas `table` e `Extra` do resultado. Isso também é verdadeiro para os `SELECT` aninhados a seguir:

```
mysql> EXPLAIN SELECT NOW() AS a1, (SELECT f1(5)) AS a2\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: NULL
         type: NULL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
     filtered: NULL
        Extra: No tables used
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------------+
| Level | Code | Message                                  |
+-------+------+------------------------------------------+
| Note  | 1249 | Select 2 was reduced during optimization |
+-------+------+------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

No entanto, se as referências externas do `SELECT` apontarem para quaisquer tabelas, o otimizador executa a declaração na subconsulta também, com o resultado de que o `t2` é modificado:

```
mysql> EXPLAIN SELECT * FROM t1 AS a1, (SELECT f1(5)) AS a2\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
   partitions: NULL
         type: system
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: NULL
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: a1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: NULL
*************************** 3. row ***************************
           id: 2
  select_type: DERIVED
        table: NULL
   partitions: NULL
         type: NULL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
     filtered: NULL
        Extra: No tables used
3 rows in set (0.00 sec)

mysql> SELECT * FROM t2;
+------+
| c1   |
+------+
|    5 |
+------+
1 row in set (0.00 sec)
```

A otimização da tabela derivada também pode ser empregada com muitas subconsultas correlacionadas (escalares) (MySQL 8.0.24 e versões posteriores). Para mais informações e exemplos, consulte a Seção 15.2.15.7, “Subconsultas correlacionadas”.

#### 15.2.15.9 Tabelas Derivadas Laterais

Uma tabela derivada normalmente não pode se referir (dependere) a colunas de tabelas anteriores na mesma cláusula `FROM`. A partir do MySQL 8.0.14, uma tabela derivada pode ser definida como uma tabela derivada lateral para especificar que tais referências são permitidas.

As tabelas derivadas não laterais são especificadas usando a sintaxe discutida na Seção 15.2.15.8, “Tabelas Derivadas”. A sintaxe para uma tabela derivada lateral é a mesma que para uma tabela derivada não lateral, exceto que a palavra-chave `LATERAL` é especificada antes da especificação da tabela derivada. A palavra-chave `LATERAL` deve preceder cada tabela que será usada como uma tabela derivada lateral.

As tabelas derivadas laterais estão sujeitas a essas restrições:

* Uma tabela derivada lateral pode ocorrer apenas em uma cláusula `FROM`, seja em uma lista de tabelas separadas por vírgulas ou em uma especificação de junção (`JOIN`, `INNER JOIN`, `CROSS JOIN`, `LEFT [OUTER] JOIN` ou `RIGHT [OUTER] JOIN`).

* Se uma tabela derivada lateral estiver no operador direito de uma cláusula de junção e contiver uma referência ao operador esquerdo, a operação de junção deve ser uma `INNER JOIN`, `CROSS JOIN` ou `LEFT [OUTER] JOIN`.

Se a tabela estiver no operando esquerdo e contiver uma referência ao operando direito, a operação de junção deve ser uma `INNER JOIN`, `CROSS JOIN` ou `RIGHT [OUTER] JOIN`.

* Se uma tabela derivada lateral referenciar uma função agregada, a consulta de agregação da função não pode ser aquela que possui a cláusula `FROM` na qual a tabela derivada lateral ocorre.

* De acordo com o padrão SQL, o MySQL sempre trata uma junção com uma função de tabela, como `JSON_TABLE()`, como se tivesse sido usada `LATERAL`. Isso é verdade, independentemente da versão da versão do MySQL, e é por isso que é possível realizar uma junção contra essa função, mesmo em versões do MySQL anteriores a 8.0.14. No MySQL 8.0.14 e posterior, a palavra-chave `LATERAL` é implícita e não é permitida antes de `JSON_TABLE()`. Isso também está de acordo com o padrão SQL.

A discussão a seguir mostra como as tabelas derivadas laterais tornam possíveis certas operações SQL que não podem ser realizadas com tabelas derivadas não laterais ou que exigem soluções menos eficientes.

Suponha que queira resolver este problema: Dado um quadro de pessoas em uma força de vendas (onde cada linha descreve um membro da força de vendas) e um quadro de todas as vendas (onde cada linha descreve uma venda: vendedor, cliente, valor, data), determine o tamanho e o cliente da maior venda para cada vendedor. Este problema pode ser abordado de duas maneiras.

Primeira abordagem para resolver o problema: Para cada vendedor, calcule o tamanho máximo da venda e também encontre o cliente que forneceu esse tamanho máximo. No MySQL, isso pode ser feito da seguinte forma:

```
SELECT
  salesperson.name,
  -- find maximum sale size for this salesperson
  (SELECT MAX(amount) AS amount
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id)
  AS amount,
  -- find customer for this maximum size
  (SELECT customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    AND all_sales.amount =
         -- find maximum size, again
         (SELECT MAX(amount) AS amount
           FROM all_sales
           WHERE all_sales.salesperson_id = salesperson.id))
  AS customer_name
FROM
  salesperson;
```

Essa consulta é ineficiente porque calcula o tamanho máximo duas vezes por vendedor (uma vez na primeira subconsulta e uma vez na segunda).

Podemos tentar obter um ganho de eficiência calculando o máximo uma vez por vendedor e "cacheando" esse valor em uma tabela derivada, conforme demonstrado por esta consulta modificada:

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale_customer.customer_name
FROM
  salesperson,
  -- calculate maximum size, cache it in transient derived table max_sale
  (SELECT MAX(amount) AS amount
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id)
  AS max_sale,
  -- find customer, reusing cached maximum size
  (SELECT customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    AND all_sales.amount =
        -- the cached maximum size
        max_sale.amount)
  AS max_sale_customer;
```

No entanto, a consulta é ilegal no SQL-92 porque as tabelas derivadas não podem depender de outras tabelas na mesma cláusula `FROM`. As tabelas derivadas devem ser constantes ao longo da duração da consulta, não devem conter referências a colunas de outras tabelas da cláusula `FROM`. Como está escrito, a consulta produz esse erro:

```
ERROR 1054 (42S22): Unknown column 'salesperson.id' in 'where clause'
```

No SQL:1999, a consulta se torna legal se as tabelas derivadas forem precedidas pela palavra-chave `LATERAL` (o que significa “esta tabela derivada depende das tabelas anteriores do seu lado esquerdo”):

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale_customer.customer_name
FROM
  salesperson,
  -- calculate maximum size, cache it in transient derived table max_sale
  LATERAL
  (SELECT MAX(amount) AS amount
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id)
  AS max_sale,
  -- find customer, reusing cached maximum size
  LATERAL
  (SELECT customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    AND all_sales.amount =
        -- the cached maximum size
        max_sale.amount)
  AS max_sale_customer;
```

Uma tabela derivada lateral não precisa ser constante e é atualizada sempre que uma nova linha de uma tabela anterior da qual depende é processada pela consulta principal.

Segunda abordagem para resolver o problema: Uma solução diferente poderia ser usada se uma subconsulta na lista `SELECT` pudesse retornar várias colunas:

```
SELECT
  salesperson.name,
  -- find maximum size and customer at same time
  (SELECT amount, customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    ORDER BY amount DESC LIMIT 1)
FROM
  salesperson;
```

Isso é eficiente, mas ilegal. Não funciona porque essas subconsultas podem retornar apenas uma única coluna:

```
ERROR 1241 (21000): Operand should contain 1 column(s)
```

Uma tentativa de reescrever a consulta é selecionar várias colunas de uma tabela derivada:

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale.customer_name
FROM
  salesperson,
  -- find maximum size and customer at same time
  (SELECT amount, customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    ORDER BY amount DESC LIMIT 1)
  AS max_sale;
```

No entanto, isso também não funciona. A tabela derivada depende da tabela `salesperson` e, portanto, falha sem `LATERAL`:

```
ERROR 1054 (42S22): Unknown column 'salesperson.id' in 'where clause'
```

Adicionar a palavra-chave `LATERAL` torna a consulta legal:

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale.customer_name
FROM
  salesperson,
  -- find maximum size and customer at same time
  LATERAL
  (SELECT amount, customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    ORDER BY amount DESC LIMIT 1)
  AS max_sale;
```

Em suma, `LATERAL` é a solução eficiente para todos os inconvenientes nas duas abordagens discutidas anteriormente.

#### 15.2.15.10 Erros de subconsulta

Existem alguns erros que se aplicam apenas a subconsultas. Esta seção os descreve.

* Sintaxe de subconsulta não suportada:

  ```
  ERROR 1235 (ER_NOT_SUPPORTED_YET)
  SQLSTATE = 42000
  Message = "This version of MySQL doesn't yet support
  'LIMIT & IN/ALL/ANY/SOME subquery'"
  ```

Isso significa que o MySQL não suporta declarações como as seguintes:

  ```
  SELECT * FROM t1 WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1)
  ```

* Número incorreto de colunas da subconsulta:

  ```
  ERROR 1241 (ER_OPERAND_COL)
  SQLSTATE = 21000
  Message = "Operand should contain 1 column(s)"
  ```

Esse erro ocorre em casos como este:

  ```
  SELECT (SELECT column1, column2 FROM t2) FROM t1;
  ```

Você pode usar uma subconsulta que retorne várias colunas, se o propósito for a comparação de linhas. Em outros contextos, a subconsulta deve ser um operador escalar. Veja a Seção 15.2.15.5, “Subconsultas de Linhas”.

* Número incorreto de linhas da subconsulta:

  ```
  ERROR 1242 (ER_SUBSELECT_NO_1_ROW)
  SQLSTATE = 21000
  Message = "Subquery returns more than 1 row"
  ```

Esse erro ocorre em declarações em que a subconsulta deve retornar no máximo uma linha, mas retorna várias linhas. Considere o seguinte exemplo:

  ```
  SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
  ```

Se `SELECT column1 FROM t2` retornar apenas uma linha, a consulta anterior funciona. Se a subconsulta retornar mais de uma linha, o erro 1242 ocorre. Nesse caso, a consulta deve ser reescrita da seguinte forma:

  ```
  SELECT * FROM t1 WHERE column1 = ANY (SELECT column1 FROM t2);
  ```

* Tabela usada incorretamente na subconsulta:

  ```
  Error 1093 (ER_UPDATE_TABLE_USED)
  SQLSTATE = HY000
  Message = "You can't specify target table 'x'
  for update in FROM clause"
  ```

Esse erro ocorre em casos como os seguintes, que tenta modificar uma tabela e selecionar da mesma tabela na subconsulta:

  ```
  UPDATE t1 SET column2 = (SELECT MAX(column1) FROM t1);
  ```

Você pode usar uma expressão de tabela comum ou uma tabela derivada para contornar isso. Veja a Seção 15.2.15.12, “Restrições em subconsultas”.

Em MySQL 8.0.19 e versões posteriores, todos os erros descritos nesta seção também se aplicam ao uso de `TABLE` em subconsultas.

Para motores de armazenamento transacional, o erro de uma subconsulta faz com que toda a declaração falhe. Para motores de armazenamento não transacional, as modificações de dados feitas antes de o erro ser encontrado são preservadas.

#### 15.2.15.11 Otimizando subconsultas

O desenvolvimento está em andamento, portanto, nenhuma dica de otimização é confiável a longo prazo. A lista a seguir fornece alguns truques interessantes que você pode querer experimentar. Veja também [Seção 10.2.2, “Otimizando subconsultas, tabelas derivadas, referências de visão e expressões de tabela comum”][(subquery-optimization.html "10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions")].

* Mova as cláusulas de fora para dentro da subconsulta. Por exemplo, use esta consulta:

  ```
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1 UNION ALL SELECT s1 FROM t2);
  ```

Em vez dessa consulta:

  ```
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1) OR s1 IN (SELECT s1 FROM t2);
  ```

Para outro exemplo, use esta consulta:

  ```
  SELECT (SELECT column1 + 5 FROM t1) FROM t2;
  ```

Em vez dessa consulta:

  ```
  SELECT (SELECT column1 FROM t1) + 5 FROM t2;
  ```

#### 15.2.15.12 Restrições em subconsultas

* Em geral, você não pode modificar uma tabela e selecionar dados da mesma tabela em uma subconsulta. Por exemplo, essa limitação se aplica a declarações dos seguintes formatos:

  ```
  DELETE FROM t WHERE ... (SELECT ... FROM t ...);
  UPDATE t ... WHERE col = (SELECT ... FROM t ...);
  {INSERT|REPLACE} INTO t (SELECT ... FROM t ...);
  ```

Exceção: A proibição anterior não se aplica se, para a tabela modificada, você estiver usando uma tabela derivada e essa tabela derivada estiver materializada, em vez de ser mesclada na consulta externa. (Veja [Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visão e expressões de tabela comuns com mesclagem ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")]). Exemplo:

  ```
  UPDATE t ... WHERE col = (SELECT * FROM (SELECT ... FROM t...) AS dt ...);
  ```

Aqui, o resultado da tabela derivada é materializado como uma tabela temporária, portanto, as linhas relevantes em `t` já foram selecionadas no momento em que a atualização para `t` ocorre.

Em geral, você pode influenciar o otimizador para materializar uma tabela derivada, adicionando uma dica de otimizador `NO_MERGE`. Veja a Seção 10.9.3, “Dicas de otimizador”.

* As operações de comparação de linhas são suportadas apenas parcialmente:

+ Para `expr [NOT] IN subquery`, *`expr`* pode ser um *`n`*-tuplo (especificado usando sintaxe de construtor de linha) e a subconsulta pode retornar linhas de *`n`*-tuplos. A sintaxe permitida é, portanto, expressa de forma mais específica como `row_constructor [NOT] IN table_subquery`

+ Para `expr op {ALL|ANY|SOME} subquery`, *`expr`* deve ser um valor escalar e a subconsulta deve ser uma subconsulta de coluna; não pode retornar linhas de múltiplos colunas.

Em outras palavras, para uma subconsulta que retorna linhas de *`n`*-tuplas, isso é suportado:

  ```
  (expr_1, ..., expr_n) [NOT] IN table_subquery
  ```

Mas isso não é suportado:

  ```
  (expr_1, ..., expr_n) op {ALL|ANY|SOME} subquery
  ```

A razão para apoiar comparações de linha para `IN`, mas não para as outras é que `IN` é implementada reescrevendo-a como uma sequência de comparações de `=` e operações de `AND`. Essa abordagem não pode ser usada para `ALL`, `ANY` ou `SOME`.

* Antes do MySQL 8.0.14, as subconsultas na cláusula `FROM` não podem ser subconsultas correlacionadas. Elas são materializadas no seu todo (evaluadas para produzir um conjunto de resultados) durante a execução da consulta, portanto, não podem ser avaliadas por linha da consulta externa. O otimizador adista a materialização até que o resultado seja necessário, o que pode permitir que a materialização seja evitada. Veja [Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visão e expressões de tabela comuns com mesclagem ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")].

* O MySQL não suporta `LIMIT` em subconsultas para certos operadores de subconsulta:

  ```
  mysql> SELECT * FROM t1
         WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1);
  ERROR 1235 (42000): This version of MySQL doesn't yet support
   'LIMIT & IN/ALL/ANY/SOME subquery'
  ```

Veja a Seção 15.2.15.10, “Erros de subconsulta”.

* O MySQL permite que uma subconsulta faça referência a uma função armazenada que tenha efeitos colaterais que modificam dados, como inserir linhas em uma tabela. Por exemplo, se `f()` inserir linhas, a seguinte consulta pode modificar os dados:

  ```
  SELECT ... WHERE x IN (SELECT f() ...);
  ```

Esse comportamento é uma extensão do padrão SQL. No MySQL, ele pode produzir resultados não determinísticos porque `f()` pode ser executado um número diferente de vezes para diferentes execuções de uma consulta dada, dependendo de como o otimizador decide lidar com isso.

Para replicação baseada em declarações ou em formato misto, uma implicação desse indeterminismo é que uma consulta desse tipo pode produzir resultados diferentes na fonte e em suas réplicas.

### 15.2.16 Declaração de Tabela

`TABLE` é uma declaração DML introduzida no MySQL 8.0.19 que retorna linhas e colunas da tabela nomeada.

```
TABLE table_name
    [ORDER BY column_name]
    [LIMIT number [OFFSET number]]
    [INTO OUTFILE 'file_name'
        [{FIELDS | COLUMNS}
            [TERMINATED BY 'string']
            [[OPTIONALLY] ENCLOSED BY 'char']
            [ESCAPED BY 'char']
        ]
        [LINES
            [STARTING BY 'string']
            [TERMINATED BY 'string']
        ]
    | INTO DUMPFILE 'file_name'
    | INTO var_name [, var_name] ...]
```

A declaração `TABLE` age, de certa forma, como a declaração `SELECT`. Dada a existência de uma tabela denominada `t`, as seguintes duas declarações produzem uma saída idêntica:

```
TABLE t;

SELECT * FROM t;
```

Você pode ordenar e limitar o número de linhas produzidas por `TABLE` usando as cláusulas `ORDER BY` e `LIMIT`, respectivamente. Essas funções são idênticas às mesmas cláusulas quando usadas com `SELECT` (incluindo uma cláusula opcional `OFFSET` com `LIMIT`), como você pode ver aqui:

```
mysql> TABLE t;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
|  9 |  5 |
| 10 | -4 |
| 11 | -1 |
| 13 |  3 |
| 14 |  6 |
+----+----+
7 rows in set (0.00 sec)

mysql> TABLE t ORDER BY b;
+----+----+
| a  | b  |
+----+----+
| 10 | -4 |
| 11 | -1 |
|  1 |  2 |
| 13 |  3 |
|  9 |  5 |
| 14 |  6 |
|  6 |  7 |
+----+----+
7 rows in set (0.00 sec)

mysql> TABLE t LIMIT 3;
+---+---+
| a | b |
+---+---+
| 1 | 2 |
| 6 | 7 |
| 9 | 5 |
+---+---+
3 rows in set (0.00 sec)

mysql> TABLE t ORDER BY b LIMIT 3;
+----+----+
| a  | b  |
+----+----+
| 10 | -4 |
| 11 | -1 |
|  1 |  2 |
+----+----+
3 rows in set (0.00 sec)

mysql> TABLE t ORDER BY b LIMIT 3 OFFSET 2;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
| 13 |  3 |
|  9 |  5 |
+----+----+
3 rows in set (0.00 sec)
```

`TABLE` difere de `SELECT` em dois aspectos fundamentais:

* `TABLE` sempre exibe todas as colunas da tabela.

*Exceção*: A saída de `TABLE` *não* inclui colunas invisíveis. Veja a Seção 15.1.20.10, “Colunas Invisíveis”.

* `TABLE` não permite qualquer filtragem arbitrária de linhas; ou seja, `TABLE` não suporta nenhuma cláusula `WHERE`.

Para limitar quais colunas da tabela serão retornadas, filtrar linhas além do que pode ser realizado usando `ORDER BY` e `LIMIT`, ou ambos, use `SELECT`.

`TABLE` pode ser usado com tabelas temporárias.

`TABLE` também pode ser usado no lugar de `SELECT` em vários outros construtos, incluindo os listados aqui:

* Com operadores de conjunto, como `UNION`, conforme mostrado aqui:

  ```
  mysql> TABLE t1;
  +---+----+
  | a | b  |
  +---+----+
  | 2 | 10 |
  | 5 |  3 |
  | 7 |  8 |
  +---+----+
  3 rows in set (0.00 sec)

  mysql> TABLE t2;
  +---+---+
  | a | b |
  +---+---+
  | 1 | 2 |
  | 3 | 4 |
  | 6 | 7 |
  +---+---+
  3 rows in set (0.00 sec)

  mysql> TABLE t1 UNION TABLE t2;
  +---+----+
  | a | b  |
  +---+----+
  | 2 | 10 |
  | 5 |  3 |
  | 7 |  8 |
  | 1 |  2 |
  | 3 |  4 |
  | 6 |  7 |
  +---+----+
  6 rows in set (0.00 sec)
  ```

O `UNION` que acabou de ser mostrado é equivalente à seguinte declaração:

  ```
  mysql> SELECT * FROM t1 UNION SELECT * FROM t2;
  +---+----+
  | a | b  |
  +---+----+
  | 2 | 10 |
  | 5 |  3 |
  | 7 |  8 |
  | 1 |  2 |
  | 3 |  4 |
  | 6 |  7 |
  +---+----+
  6 rows in set (0.00 sec)
  ```

`TABLE` também pode ser usado em conjunto em operações de conjunto com declarações `SELECT`, declarações `VALUES`, ou ambas. Consulte a Seção 15.2.18, “Cláusula UNION”, a Seção 15.2.4, “Cláusula EXCEPT”, e a Seção 15.2.8, “Cláusula INTERSECT”, para mais informações e exemplos. Consulte também a Seção 15.2.14, “Operações de Conjunto com UNION, INTERSECT e EXCEPT”.

* Com `INTO` para preencher as variáveis do usuário e, com `INTO OUTFILE` ou `INTO DUMPFILE`, para escrever dados da tabela em um arquivo. Consulte a Seção 15.2.13.1, “Instrução SELECT ... INTO”, para obter informações e exemplos mais específicos.

* Em muitos casos, é possível utilizar subconsultas. Dado qualquer tabela `t1` com uma coluna denominada `a`, e uma segunda tabela `t2` com uma única coluna, são possíveis declarações como as seguintes:

  ```
  SELECT * FROM t1 WHERE a IN (TABLE t2);
  ```

Supondo que a única coluna da tabela `t1` seja denominada `x`, o que foi dito anteriormente é equivalente a cada uma das declarações mostradas aqui (e produz exatamente o mesmo resultado em qualquer caso):

  ```
  SELECT * FROM t1 WHERE a IN (SELECT x FROM t2);

  SELECT * FROM t1 WHERE a IN (SELECT * FROM t2);
  ```

Veja a Seção 15.2.15, “Subconsultas”, para mais informações.

* Com as declarações `INSERT` e `REPLACE`, onde você usaria `SELECT *` de outra forma. Consulte a Seção 15.2.7.1, “Instrução INSERT ... SELECT”, para mais informações e exemplos.

* `TABLE` também pode ser usado em muitos casos no lugar do `SELECT` em [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") ou [`CREATE VIEW ... SELECT`](create-view.html "15.1.23 CREATE VIEW Statement"). Consulte as descrições dessas declarações para mais informações e exemplos.

### 15.2.17 Declaração de Atualização

`UPDATE` é uma declaração DML que modifica linhas em uma tabela.

Uma declaração `UPDATE` pode começar com uma cláusula `WITH` para definir expressões de tabela comuns acessíveis dentro do `UPDATE`. Veja a Seção 15.2.20, “COM (Expressões de Tabela Comuns”)”).

Sintaxe de tabela única:

```
UPDATE [LOW_PRIORITY] [IGNORE] table_reference
    SET assignment_list
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT row_count]

value:
    {expr | DEFAULT}

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

Sintaxe de múltiplas tabelas:

```
UPDATE [LOW_PRIORITY] [IGNORE] table_references
    SET assignment_list
    [WHERE where_condition]
```

Para a sintaxe de tabela única, a declaração `UPDATE` atualiza as colunas das linhas existentes na tabela nomeada com novos valores. A cláusula `SET` indica quais colunas devem ser modificadas e os valores que devem ser dados. Cada valor pode ser dado como uma expressão ou a palavra-chave `DEFAULT` para definir uma coluna explicitamente ao seu valor padrão. A cláusula `WHERE`, se dada, especifica as condições que identificam quais linhas devem ser atualizadas. Sem a cláusula `WHERE`, todas as linhas são atualizadas. Se a cláusula `ORDER BY` for especificada, as linhas são atualizadas na ordem que é especificada. A cláusula `LIMIT` coloca um limite no número de linhas que podem ser atualizadas.

Para a sintaxe de múltiplas tabelas, `UPDATE` atualiza as linhas em cada tabela nomeada em *`table_references`* que satisfazem as condições. Cada linha correspondente é atualizada uma vez, mesmo que corresponda às condições várias vezes. Para a sintaxe de múltiplas tabelas, `ORDER BY` e `LIMIT` não podem ser usados.

Para tabelas particionadas, tanto as formas de formulário único quanto as múltiplas de esta declaração suportam o uso de uma cláusula `PARTITION` como parte de uma referência de tabela. Esta opção recebe uma lista de uma ou mais particionamentos ou subparticionamentos (ou ambos). Apenas as particionamentos (ou subparticionamentos) listados são verificados quanto a correspondências, e uma linha que não está em nenhuma dessas particionamentos ou subparticionamentos não é atualizada, seja ela satisfatória ou não para *`where_condition`*.

Nota

Ao contrário do caso em que se usa `PARTITION` com uma declaração `INSERT` ou `REPLACE`, uma declaração `UPDATE ... PARTITION` válida, mesmo que não haja linhas nas partições (ou subpartições) listadas que correspondam ao *`where_condition`*, é considerada bem-sucedida.

Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partição”.

*`where_condition`* é uma expressão que avalia como verdadeira para cada linha que deve ser atualizada. Para a sintaxe da expressão, consulte a Seção 11.5, “Expressões”.

*`table_references`* e *`where_condition`* são especificados conforme descrito na Seção 15.2.13, “Instrução SELECT”.

Você precisa do privilégio `UPDATE` apenas para as colunas referenciadas em um `UPDATE` que são realmente atualizadas. Você precisa apenas do privilégio `SELECT` para quaisquer colunas que sejam lidas, mas não modificadas.

A declaração `UPDATE` suporta os seguintes modificadores:

* Com o modificador `LOW_PRIORITY`, a execução do `UPDATE` é adiada até que nenhum outro cliente esteja lendo a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio em nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* Com o modificador `IGNORE`, a declaração de atualização não é interrompida, mesmo que ocorram erros durante a atualização. As linhas para as quais ocorrem conflitos de chave duplicada em um valor de chave única não são atualizadas. As linhas atualizadas para valores que causariam erros de conversão de dados são atualizadas para os valores mais próximos dos válidos, em vez disso. Para mais informações, consulte O efeito do IGNORE na execução da declaração.

As declarações `UPDATE IGNORE`, incluindo aquelas que possuem uma cláusula `ORDER BY`, são marcadas como inseguras para replicação baseada em declarações. (Isso ocorre porque a ordem em que as linhas são atualizadas determina quais linhas são ignoradas.) Tais declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linha quando usar o modo `MIXED`. (Bug #11758262, Bug #50439) Consulte a Seção 19.2.1.3, “Determinação de declarações seguras e inseguras no registro binário”, para obter mais informações.

Se você acessar uma coluna da tabela que será atualizada em uma expressão, o `UPDATE` usa o valor atual da coluna. Por exemplo, a seguinte declaração define o `col1` como um valor maior que seu valor atual:

```
UPDATE t1 SET col1 = col1 + 1;
```

A segunda atribuição na seguinte declaração define `col2` para o valor atual (atualizado) de `col1`, e não o valor original de `col1`. O resultado é que `col1` e `col2` têm o mesmo valor. Esse comportamento difere do SQL padrão.

```
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```

As atribuições de tabela única `UPDATE` são geralmente avaliadas de esquerda para direita. Para atualizações de múltiplas tabelas, não há garantia de que as atribuições sejam realizadas em qualquer ordem específica.

Se você definir uma coluna para o valor que ela tem atualmente, o MySQL percebe isso e não a atualiza.

Se você atualizar uma coluna que foi declarada como `NOT NULL` definindo-a como `NULL`, um erro ocorre se o modo SQL rigoroso estiver habilitado; caso contrário, a coluna é definida pelo valor padrão implícito para o tipo de dados da coluna e a contagem de avisos é incrementada. O valor padrão implícito é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor “zero” para tipos de data e hora. Veja a Seção 13.6, “Valores padrão de tipo de dados”.

Se uma coluna gerada for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

`UPDATE` retorna o número de linhas que foram realmente alteradas. A função API C `mysql_info()` retorna o número de linhas que foram correspondidas e atualizadas, além do número de avisos que ocorreram durante o `UPDATE`.

Você pode usar `LIMIT row_count` para restringir o escopo do `UPDATE`. Uma cláusula `LIMIT` é uma restrição de correspondência de linhas. A declaração para de assim que encontrar *`row_count`* linhas que satisfazem a cláusula `WHERE`, independentemente de elas terem sido alteradas ou

Se uma declaração `UPDATE` incluir uma cláusula `ORDER BY`, as linhas são atualizadas na ordem especificada pela cláusula. Isso pode ser útil em certas situações que, de outra forma, poderiam resultar em um erro. Suponha que uma tabela `t` contenha uma coluna `id` que possui um índice único. A declaração seguinte pode falhar com um erro de chave duplicada, dependendo da ordem em que as linhas são atualizadas:

```
UPDATE t SET id = id + 1;
```

Por exemplo, se a tabela contiver 1 e 2 na coluna `id` e 1 for atualizado para 2 antes de 2 ser atualizado para 3, um erro ocorre. Para evitar esse problema, adicione uma cláusula `ORDER BY` para fazer com que as linhas com valores maiores de `id` sejam atualizadas antes daquelas com valores menores:

```
UPDATE t SET id = id + 1 ORDER BY id DESC;
```

Você também pode realizar operações `UPDATE` que cobrem várias tabelas. No entanto, você não pode usar `ORDER BY` ou `LIMIT` com uma `UPDATE` de múltiplas tabelas. A cláusula *`table_references`* lista as tabelas envolvidas na junção. Sua sintaxe é descrita na Seção 15.2.13.2, “Cláusula de JOIN”. Aqui está um exemplo:

```
UPDATE items,month SET items.price=month.price
WHERE items.id=month.id;
```

O exemplo anterior mostra uma junção interna que utiliza o operador de vírgula, mas as declarações de múltiplas tabelas `UPDATE` podem utilizar qualquer tipo de junção permitida nas declarações de `SELECT`, como `LEFT JOIN`.

Se você usar uma declaração múltipla `UPDATE` que envolve tabelas `InnoDB` para as quais existem restrições de chave estrangeira, o otimizador do MySQL pode processar as tabelas em uma ordem que difere daquela de sua relação pai/filho. Neste caso, a declaração falha e é revertida. Em vez disso, atualize uma única tabela e confie nas capacidades da `ON UPDATE` que a `InnoDB` fornece para fazer com que as outras tabelas sejam modificadas conforme necessário. Veja a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

Você não pode atualizar uma tabela e selecionar diretamente da mesma tabela em uma subconsulta. Você pode contornar isso usando uma atualização multitabela na qual uma das tabelas é derivada da tabela que você realmente deseja atualizar e referenciando a tabela derivada usando um alias. Suponha que você queira atualizar uma tabela chamada `items` que é definida usando a declaração mostrada aqui:

```
CREATE TABLE items (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    wholesale DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    retail DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    quantity BIGINT NOT NULL DEFAULT 0
);
```

Para reduzir o preço de venda de quaisquer itens para os quais a margem de lucro é de 30% ou mais e dos quais você tenha menos de cem em estoque, você pode tentar usar uma declaração `UPDATE` como a seguinte, que utiliza uma subconsulta na cláusula `WHERE`. Como mostrado aqui, essa declaração não funciona:

```
mysql> UPDATE items
     > SET retail = retail * 0.9
     > WHERE id IN
     >     (SELECT id FROM items
     >         WHERE retail / wholesale >= 1.3 AND quantity > 100);
ERROR 1093 (HY000): You can't specify target table 'items' for update in FROM clause
```

Em vez disso, você pode usar uma atualização de várias tabelas na qual a subconsulta é movida para a lista de tabelas a serem atualizadas, usando um alias para referenciá-la na cláusula mais externa do `WHERE`, como este:

```
UPDATE items,
       (SELECT id FROM items
        WHERE id IN
            (SELECT id FROM items
             WHERE retail / wholesale >= 1.3 AND quantity < 100))
        AS discounted
SET items.retail = items.retail * 0.9
WHERE items.id = discounted.id;
```

Como o otimizador tenta, por padrão, combinar a tabela derivada `discounted` no bloco de consulta mais externo, isso só funciona se você forçar a materialização da tabela derivada. Você pode fazer isso definindo a bandeira `derived_merge` da variável de sistema `optimizer_switch` para `off` antes de executar a atualização, ou usando a dica de otimizador `NO_MERGE`, como mostrado aqui:

```
UPDATE /*+ NO_MERGE(discounted) */ items,
       (SELECT id FROM items
        WHERE retail / wholesale >= 1.3 AND quantity < 100)
        AS discounted
    SET items.retail = items.retail * 0.9
    WHERE items.id = discounted.id;
```

A vantagem de usar a dica de otimização nesse caso é que ela se aplica apenas dentro do bloco de consulta onde é usada, de modo que não é necessário alterar o valor de `optimizer_switch` novamente após a execução do `UPDATE`.

Outra possibilidade é reescrever a subconsulta para que ela não utilize `IN` ou `EXISTS`, como este:

```
UPDATE items,
       (SELECT id, retail / wholesale AS markup, quantity FROM items)
       AS discounted
    SET items.retail = items.retail * 0.9
    WHERE discounted.markup >= 1.3
    AND discounted.quantity < 100
    AND items.id = discounted.id;
```

Neste caso, a subconsulta é materializada por padrão, em vez de ser mesclada, portanto, não é necessário desativar a mesclagem da tabela derivada.

### 15.2.18 Cláusula de UNIÃO

```
query_expression_body UNION [ALL | DISTINCT] query_block
    [UNION [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

`UNION` combina o resultado de vários blocos de consulta em um único conjunto de resultados. Este exemplo usa as declarações `SELECT`:

```
mysql> SELECT 1, 2;
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
+---+---+
mysql> SELECT 'a', 'b';
+---+---+
| a | b |
+---+---+
| a | b |
+---+---+
mysql> SELECT 1, 2 UNION SELECT 'a', 'b';
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
| a | b |
+---+---+
```

#### UNIÃO Entrega de MySQL 8.0 em comparação com MySQL 5.7

No MySQL 8.0, as regras do analisador para `SELECT` e `UNION` foram refeitas para serem mais consistentes (a mesma sintaxe `SELECT` se aplica uniformemente em cada contexto) e reduzir a duplicação. Comparado ao MySQL 5.7, vários efeitos visíveis para o usuário resultaram desse trabalho, que podem exigir a reescrita de certas declarações:

* `NATURAL JOIN` permite a palavra-chave opcional `INNER` (`NATURAL INNER JOIN`), em conformidade com o SQL padrão.

* Conexões de direita-profunda sem parênteses são permitidas (por exemplo, `... JOIN ... JOIN ... ON ... ON`), em conformidade com o SQL padrão.

* `STRAIGHT_JOIN` agora permite uma cláusula `USING`, semelhante a outras junções internas.

* O analisador aceita parênteses em torno de expressões de consulta. Por exemplo, `(SELECT ... UNION SELECT ...)` é permitido. Veja também a Seção 15.2.11, “Expressões de consulta com parênteses”.

* O analisador se conforma melhor à colocação documentada permitida dos modificadores das consultas `SQL_CACHE` e `SQL_NO_CACHE`.

* A nidificação de esquerda de uniões, anteriormente permitida apenas em subconsultas, agora é permitida em declarações de nível superior. Por exemplo, esta declaração agora é aceita como válida:

  ```
  (SELECT 1 UNION SELECT 1) UNION SELECT 1;
  ```

* As cláusulas de bloqueio (`FOR UPDATE`, `LOCK IN SHARE MODE`) são permitidas apenas em consultas que não são `UNION`. Isso significa que as chaves devem ser usadas para as declarações `SELECT` que contêm cláusulas de bloqueio. Esta declaração não é mais aceita como válida:

  ```
  SELECT 1 FOR UPDATE UNION SELECT 1 FOR UPDATE;
  ```

Em vez disso, escreva a declaração assim:

  ```
  (SELECT 1 FOR UPDATE) UNION (SELECT 1 FOR UPDATE);
  ```

### 15.2.19 Declaração de VALORES

`VALUES` é uma declaração DML introduzida no MySQL 8.0.19 que retorna um conjunto de uma ou mais linhas como uma tabela. Em outras palavras, é um construtor de valor de tabela que também funciona como uma declaração SQL autônoma.

```
VALUES row_constructor_list [ORDER BY column_designator] [LIMIT number]

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

value_list:
    value[, value][, ...]

column_designator:
    column_index
```

A declaração `VALUES` é composta pela palavra-chave `VALUES`, seguida por uma lista de um ou mais construtores de linha, separados por vírgulas. Um construtor de linha consiste na cláusula do construtor de linha `ROW()` com uma lista de valores escalares, contida entre parênteses. Um valor pode ser um literal de qualquer tipo de dados MySQL ou uma expressão que resolva a um valor escalar.

`ROW()` não pode ficar vazio (mas cada um dos valores escalares fornecidos pode ficar `NULL`). Cada `ROW()` na mesma declaração `VALUES` deve ter o mesmo número de valores em sua lista de valores.

A palavra-chave `DEFAULT` não é suportada por `VALUES` e causa um erro de sintaxe, exceto quando é usada para fornecer valores em uma declaração `INSERT`.

A saída de `VALUES` é uma tabela:

```
mysql> VALUES ROW(1,-2,3), ROW(5,7,9), ROW(4,6,8);
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |       -2 |        3 |
|        5 |        7 |        9 |
|        4 |        6 |        8 |
+----------+----------+----------+
3 rows in set (0.00 sec)
```

As colunas da tabela que saem de `VALUES` têm as colunas implicitamente nomeadas `column_0`, `column_1`, `column_2`, e assim por diante, sempre começando com `0`. Esse fato pode ser usado para ordenar as linhas por coluna usando uma cláusula opcional `ORDER BY` na mesma maneira que essa cláusula funciona com uma declaração `SELECT`, como mostrado aqui:

```
mysql> VALUES ROW(1,-2,3), ROW(5,7,9), ROW(4,6,8) ORDER BY column_1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |       -2 |        3 |
|        4 |        6 |        8 |
|        5 |        7 |        9 |
+----------+----------+----------+
3 rows in set (0.00 sec)
```

Em MySQL 8.0.21 e versões posteriores, a declaração `VALUES` também suporta uma cláusula `LIMIT` para limitar o número de linhas no resultado. (Anteriormente, `LIMIT` era permitido, mas não fazia nada.)

A declaração `VALUES` é permissiva em relação aos tipos de dados dos valores das colunas; você pode misturar tipos dentro da mesma coluna, como mostrado aqui:

```
mysql> VALUES ROW("q", 42, '2019-12-18'),
    ->     ROW(23, "abc", 98.6),
    ->     ROW(27.0002, "Mary Smith", '{"a": 10, "b": 25}');
+----------+------------+--------------------+
| column_0 | column_1   | column_2           |
+----------+------------+--------------------+
| q        | 42         | 2019-12-18         |
| 23       | abc        | 98.6               |
| 27.0002  | Mary Smith | {"a": 10, "b": 25} |
+----------+------------+--------------------+
3 rows in set (0.00 sec)
```

Importante

`VALUES` com uma ou mais instâncias de `ROW()` atua como construtor de valor de tabela; embora possa ser usado para fornecer valores em uma declaração de `INSERT` ou `REPLACE`, não confunda com a palavra-chave `VALUES` que também é usada para esse propósito. Você também não deve confundi-lo com a função `VALUES()` que se refere a valores de coluna em [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

Você também deve ter em mente que `ROW()` é um construtor de valor de linha (veja Seção 15.2.15.5, “Subconsultas de linha”), enquanto `VALUES ROW()` é um construtor de valor de tabela; os dois não podem ser usados de forma intercambiável.

`VALUES` pode ser usado em muitos casos em que você poderia usar `SELECT`, incluindo os listados aqui:

* Com `UNION`, conforme mostrado aqui:

  ```
  mysql> SELECT 1,2 UNION SELECT 10,15;
  +----+----+
  | 1  | 2  |
  +----+----+
  |  1 |  2 |
  | 10 | 15 |
  +----+----+
  2 rows in set (0.00 sec)

  mysql> VALUES ROW(1,2) UNION VALUES ROW(10,15);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |       10 |       15 |
  +----------+----------+
  2 rows in set (0.00 sec)
  ```

Você pode unir tabelas construídas juntas que tenham mais de uma linha, como este:

  ```
  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6)
       >     UNION VALUES ROW(10,15),ROW(20,25);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |        3 |        4 |
  |        5 |        6 |
  |       10 |       15 |
  |       20 |       25 |
  +----------+----------+
  5 rows in set (0.00 sec)
  ```

Você também pode (e geralmente é preferível) omitir completamente `UNION` nesses casos e usar uma única declaração **`VALUES`**, como esta:

  ```
  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6), ROW(10,15), ROW(20,25);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |        3 |        4 |
  |        5 |        6 |
  |       10 |       15 |
  |       20 |       25 |
  +----------+----------+
  ```

`VALUES` também pode ser usado em uniões com declarações `SELECT`, declarações `TABLE` ou ambas.

As tabelas construídas no `UNION` devem conter o mesmo número de colunas, assim como se estivesse usando `SELECT`. Veja a Seção 15.2.18, “Cláusula UNION”, para mais exemplos.

Em MySQL 8.0.31 e versões posteriores, você pode usar `EXCEPT` e `INTERSECT` com `VALUES` de maneira muito semelhante à `UNION`, conforme mostrado aqui:

  ```
  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6)
      ->   INTERSECT
      -> VALUES ROW(10,15), ROW(20,25), ROW(3,4);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        3 |        4 |
  +----------+----------+
  1 row in set (0.00 sec)

  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6)
      ->   EXCEPT
      -> VALUES ROW(10,15), ROW(20,25), ROW(3,4);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |        5 |        6 |
  +----------+----------+
  2 rows in set (0.00 sec)
  ```

Veja a Seção 15.2.4, “Cláusula de EXCEÇÃO”, e a Seção 15.2.8, “Cláusula de INTERSEÇÃO”, para mais informações.

* Em junções. Consulte a Seção 15.2.13.2, “Cláusula JOIN”, para mais informações e exemplos.

* No lugar de `VALUES()` em uma declaração `INSERT` ou `REPLACE`, nesse caso, sua semântica difere ligeiramente daquela descrita aqui. Consulte a Seção 15.2.7, “Declaração INSERT”, para detalhes.

* No lugar da tabela de origem em `CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") e `CREATE VIEW ... SELECT`(create-view.html "15.1.23 CREATE VIEW Statement"). Consulte as descrições dessas declarações para mais informações e exemplos.

### 15.20.20 COM (Expressões de Tabela Comum)

Uma expressão de tabela comum (CTE) é um conjunto de resultados temporário nomeado que existe no escopo de uma única declaração e que pode ser referido posteriormente dentro dessa declaração, possivelmente várias vezes. O seguinte texto descreve como escrever declarações que utilizam CTEs.

* Expressões de Tabela Comum
* Expressões de Tabela Comum Recursivas
* Limitação da Recursividade das Expressões de Tabela Comum
* Exemplos de Expressões de Tabela Comum
* Expressões de Tabela Comum Comparadas a Construções Similares

Para informações sobre otimização de CTE, consulte [Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visão e expressões de tabela comuns com fusão ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")].

#### Recursos adicionais

Esses artigos contêm informações adicionais sobre o uso de CTEs no MySQL, incluindo muitos exemplos:

* [MySQL 8.0 Labs: Expressões de Tabela Comuns Recíprocas no MySQL (CTEs)](https://dev.mysql.com/blog-archive/mysql-8-0-labs-recursive-common-table-expressions-in-mysql-ctes/)

* [MySQL 8.0 Labs: Expressões de Tabela Comuns Recíprocas no MySQL (CTEs), Parte Dois – como gerar séries](https://dev.mysql.com/blog-archive/mysql-8-0-labs-recursive-common-table-expressions-in-mysql-ctes-part-two-how-to-generate-series/)

* [MySQL 8.0 Labs: Expressões de Tabela Comuns Recíprocas no MySQL (CTEs), Parte Três – hierarquias](https://dev.mysql.com/blog-archive/mysql-8-0-labs-recursive-common-table-expressions-in-mysql-ctes-part-three-hierarchies/)

* [MySQL 8.0.1: [Recursivo] Expressões de tabela comum no MySQL (CTEs), Parte Quatro – travessia de primeira profundidade ou de primeira largura, fechamento transitivo, evitação de ciclos](https://dev.mysql.com/blog-archive/mysql-8-0-1-recursive-common-table-expressions-in-mysql-ctes-part-four-depth-first-or-breadth-first-traversal-transitive-closure-cycle-avoidance/)

#### Expressões de Tabela Comuns

Para especificar expressões de tabela comuns, use uma cláusula `WITH`") que tenha uma ou mais subcláusulas separadas por vírgula. Cada subcláusula fornece uma subconsulta que produz um conjunto de resultados e associa um nome à subconsulta. O exemplo seguinte define CTEs nomeados `cte1` e `cte2` na cláusula `WITH`") e os refere no `SELECT` de nível superior que segue a cláusula `WITH`"):

```
WITH
  cte1 AS (SELECT a, b FROM table1),
  cte2 AS (SELECT c, d FROM table2)
SELECT b, d FROM cte1 JOIN cte2
WHERE cte1.a = cte2.c;
```

Na declaração que contém a cláusula `WITH`"), cada nome de CTE pode ser referenciado para acessar o conjunto de resultados correspondente do CTE.

Um nome de CTE pode ser referenciado em outros CTEs, permitindo que os CTEs sejam definidos com base em outros CTEs.

Um CTE pode se referir a si mesmo para definir um CTE recursivo. Aplicações comuns de CTE recursivos incluem a geração de séries e a travessia de dados hierárquicos ou estruturados em forma de árvore.

As expressões comuns de tabela são uma parte opcional da sintaxe para declarações de DML. Elas são definidas usando uma cláusula `WITH`"):

```
with_clause:
    WITH [RECURSIVE]
        cte_name [(col_name [, col_name] ...)] AS (subquery)
        [, cte_name [(col_name [, col_name] ...)] AS (subquery)] ...
```

*`cte_name`* nomeia uma única expressão de tabela comum e pode ser usado como referência de tabela na declaração que contém a cláusula `WITH`")

A parte *`subquery`* de `AS (subquery)` é chamada de “subconsulta do CTE” e é o que produz o conjunto de resultados do CTE. As chaves na sequência de `AS` são necessárias.

Uma expressão comum de tabela é recursiva se sua subconsulta se refere ao seu próprio nome. A palavra-chave `RECURSIVE` deve ser incluída se qualquer CTE na cláusula `WITH`") for recursiva. Para mais informações, consulte Expressões comuns de tabela recursivas.

A determinação dos nomes das colunas para um CTE específico ocorre da seguinte forma:

* Se uma lista entre parênteses de nomes segue o nome do CTE, esses nomes são os nomes das colunas:

  ```
  WITH cte (col1, col2) AS
  (
    SELECT 1, 2
    UNION ALL
    SELECT 3, 4
  )
  SELECT col1, col2 FROM cte;
  ```

O número de nomes na lista deve ser igual ao número de colunas no conjunto de resultados.

* Caso contrário, os nomes das colunas vêm da lista de seleção do primeiro `SELECT` dentro da parte `AS (subquery)`:

  ```
  WITH cte AS
  (
    SELECT 1 AS col1, 2 AS col2
    UNION ALL
    SELECT 3, 4
  )
  SELECT col1, col2 FROM cte;
  ```

Uma cláusula `WITH` é permitida nesses contextos:

* No início das declarações `SELECT`, `UPDATE` e `DELETE`.

  ```
  WITH ... SELECT ...
  WITH ... UPDATE ...
  WITH ... DELETE ...
  ```

* No início de subconsultas (incluindo subconsultas de tabela derivada):

  ```
  SELECT ... WHERE id IN (WITH ... SELECT ...) ...
  SELECT * FROM (WITH ... SELECT ...) AS dt ...
  ```

* Imediatamente antes de `SELECT` para declarações que incluem uma declaração `SELECT`:

  ```
  INSERT ... WITH ... SELECT ...
  REPLACE ... WITH ... SELECT ...
  CREATE TABLE ... WITH ... SELECT ...
  CREATE VIEW ... WITH ... SELECT ...
  DECLARE CURSOR ... WITH ... SELECT ...
  EXPLAIN ... WITH ... SELECT ...
  ```

Apenas uma cláusula `WITH` é permitida no mesmo nível. `WITH` seguido por `WITH` no mesmo nível não é permitido, portanto, isso é ilegal:

```
WITH cte1 AS (...) WITH cte2 AS (...) SELECT ...
```

Para tornar a declaração legal, use uma única cláusula `WITH`") que separe as subcláusulas por vírgula:

```
WITH cte1 AS (...), cte2 AS (...) SELECT ...
```

No entanto, uma declaração pode conter múltiplas cláusulas `WITH`") se elas ocorrem em diferentes níveis:

```
WITH cte1 AS (SELECT 1)
SELECT * FROM (WITH cte2 AS (SELECT 2) SELECT * FROM cte2 JOIN cte1) AS dt;
```

Uma cláusula `WITH` pode definir uma ou mais expressões de tabela comuns, mas cada nome do CTE deve ser único para a cláusula. Isso é ilegal:

```
WITH cte1 AS (...), cte1 AS (...) SELECT ...
```

Para tornar a declaração legal, defina os CTEs com nomes únicos:

```
WITH cte1 AS (...), cte2 AS (...) SELECT ...
```

Um CTE pode se referir a si mesmo ou a outros CTEs:

* Um CTE autoreferencial é recursivo. * Um CTE pode se referir a CTEs definidos anteriormente na mesma cláusula `WITH`") , mas não aqueles definidos posteriormente.

Essa restrição exclui CTEs mutuamente recursivas, onde `cte1` faz referência a `cte2` e `cte2` faz referência a `cte1`. Uma dessas referências deve ser para um CTE definido mais tarde, o que não é permitido.

* Um CTE em um bloco de consulta específico pode se referir a CTEs definidas em blocos de consulta em um nível mais externo, mas não a CTEs definidas em blocos de consulta em um nível mais interno.

Para resolver referências a objetos com nomes iguais, as tabelas derivadas ocultam CTEs; e as CTEs ocultam tabelas base, `TEMPORARY` e visualizações. A resolução de nomes ocorre ao procurar por objetos no mesmo bloco de consulta, e, em seguida, procede-se aos blocos externos, uma a uma, enquanto nenhum objeto com o nome é encontrado.

Assim como as tabelas derivadas, uma CTE não pode conter referências externas antes do MySQL 8.0.14. Essa é uma restrição do MySQL que é levantada no MySQL 8.0.14, e não uma restrição do padrão SQL. Para considerações de sintaxe adicionais específicas para CTE recursiva, consulte Expressões comuns de tabela recursivas.

#### Expressões Comuns de Tabela Recíproca

Uma expressão comum de tabela recursiva é aquela que possui uma subconsulta que se refere ao seu próprio nome. Por exemplo:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte WHERE n < 5
)
SELECT * FROM cte;
```

Quando executada, a declaração produz este resultado, uma única coluna contendo uma simples sequência linear:

```
+------+
| n    |
+------+
|    1 |
|    2 |
|    3 |
|    4 |
|    5 |
+------+
```

Um CTE recursivo tem essa estrutura:

* A cláusula `WITH` deve começar com `WITH RECURSIVE` se qualquer CTE na cláusula `WITH` se referir a si mesma. (Se nenhum CTE se referir a si mesmo, `RECURSIVE` é permitido, mas não é exigido.)

Se você esquecer `RECURSIVE` para um CTE recursivo, esse erro é provavelmente o resultado:

  ```
  ERROR 1146 (42S02): Table 'cte_name' doesn't exist
  ```

* A subconsulta recursiva CTE tem duas partes, separadas por `UNION ALL` ou [`UNION [DISTINCT]`](union.html "15.2.18 UNION Clause"):

  ```
  SELECT ...      -- return initial row set
  UNION ALL
  SELECT ...      -- return additional row sets
  ```

O primeiro `SELECT` produz a(s) primeira(s) linha(s) para o CTE e não se refere ao nome do CTE. O segundo `SELECT` produz linhas adicionais e recursiva, referenciando o nome do CTE em sua cláusula `FROM`. A recursão termina quando esta parte não produz nenhuma nova linha. Assim, um CTE recursivo consiste em uma parte não recursiva `SELECT` seguida por uma parte recursiva `SELECT`.

Cada parte `SELECT` pode ser, por si mesma, uma união de múltiplas declarações `SELECT`.

* Os tipos das colunas dos resultados do CTE são inferidos apenas pelos tipos das colunas da parte não recursiva `SELECT`, e todas as colunas são nulos. Para a determinação do tipo, a parte recursiva `SELECT` é ignorada.

* Se as partes não recursivas e recursivas são separadas por `UNION DISTINCT`(union.html "15.2.18 UNION Clause"), as linhas duplicadas são eliminadas. Isso é útil para consultas que realizam fechamentos transitivos, para evitar loops infinitos.

* Cada iteração da parte recursiva opera apenas nas linhas produzidas pela iteração anterior. Se a parte recursiva tiver vários blocos de consulta, as iterações de cada bloco de consulta são agendadas em ordem não especificada, e cada bloco de consulta opera em linhas que foram produzidas ou pela sua iteração anterior ou por outros blocos de consulta desde o fim daquela iteração anterior.

A subconsulta recursiva CTE mostrada anteriormente tem essa parte não recursiva que recupera uma única linha para produzir o conjunto de linhas inicial:

```
SELECT 1
```

A subconsulta do CTE também tem essa parte recursiva:

```
SELECT n + 1 FROM cte WHERE n < 5
```

Em cada iteração, esse `SELECT` produz uma linha com um novo valor um maior que o valor de `n` da linha anterior do conjunto de linhas. A primeira iteração opera no conjunto inicial de linhas (`1`) e produz `1+1=2`; a segunda iteração opera no conjunto de linhas da primeira iteração (`2`) e produz `2+1=3`; e assim por diante. Isso continua até que a recursão termine, o que ocorre quando `n` não é mais menor que 5.

Se a parte recursiva de um CTE produzir valores mais amplos para uma coluna do que a parte não recursiva, pode ser necessário ampliar a coluna na parte não recursiva para evitar o corte de dados. Considere esta afirmação:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, 'abc' AS str
  UNION ALL
  SELECT n + 1, CONCAT(str, str) FROM cte WHERE n < 3
)
SELECT * FROM cte;
```

No modo SQL não estrito, a declaração produz esta saída:

```
+------+------+
| n    | str  |
+------+------+
|    1 | abc  |
|    2 | abc  |
|    3 | abc  |
+------+------+
```

Os valores da coluna `str` são todos `'abc'` porque o não recursivo `SELECT` determina as larguras das colunas. Consequentemente, os valores mais largos `str` produzidos pelo recursivo `SELECT` são truncados.

No modo SQL estrito, a declaração produz um erro:

```
ERROR 1406 (22001): Data too long for column 'str' at row 1
```

Para resolver esse problema, de modo que a declaração não produza truncamentos ou erros, use `CAST()` no `SELECT` não recursivo para tornar a coluna `str` mais larga:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, CAST('abc' AS CHAR(20)) AS str
  UNION ALL
  SELECT n + 1, CONCAT(str, str) FROM cte WHERE n < 3
)
SELECT * FROM cte;
```

Agora, a declaração produz esse resultado, sem corte:

```
+------+--------------+
| n    | str          |
+------+--------------+
|    1 | abc          |
|    2 | abcabc       |
|    3 | abcabcabcabc |
+------+--------------+
```

As colunas são acessadas pelo nome, não pela posição, o que significa que as colunas na parte recursiva podem acessar colunas na parte não recursiva que têm uma posição diferente, como ilustra este CTE:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, 1 AS p, -1 AS q
  UNION ALL
  SELECT n + 1, q * 2, p * 2 FROM cte WHERE n < 5
)
SELECT * FROM cte;
```

Como `p` em uma linha é derivado de `q` na linha anterior, e vice-versa, os valores positivos e negativos trocam posições em cada linha subsequente do resultado:

```
+------+------+------+
| n    | p    | q    |
+------+------+------+
|    1 |    1 |   -1 |
|    2 |   -2 |    2 |
|    3 |    4 |   -4 |
|    4 |   -8 |    8 |
|    5 |   16 |  -16 |
+------+------+------+
```

Algumas restrições de sintaxe se aplicam em subconsultas de CTE recursiva:

* A parte recursiva `SELECT` não deve conter esses constructos:

+ Funções agregadas, como `SUM()`
  + Funções de janela
  + `GROUP BY`
  + `ORDER BY`
  + `DISTINCT`

Antes do MySQL 8.0.19, a parte recursiva `SELECT` de uma CTE recursiva também não podia usar uma cláusula `LIMIT`. Essa restrição é levantada no MySQL 8.0.19, e `LIMIT` é agora suportada nesses casos, juntamente com uma cláusula opcional `OFFSET`. O efeito no conjunto de resultados é o mesmo quando se usa `LIMIT` no `SELECT` mais externo, mas também é mais eficiente, pois usá-lo com a `SELECT` recursiva para parar a geração de linhas assim que o número solicitado delas tiver sido produzido.

Essas restrições não se aplicam à parte não recursiva do `SELECT` de um CTE recursivo. A proibição do `DISTINCT` se aplica apenas aos membros do `UNION`; o `UNION DISTINCT` é permitido.

* A parte recursiva `SELECT` deve referenciar o CTE apenas uma vez e apenas em sua cláusula `FROM`, não em nenhuma subconsulta. Ela pode referenciar tabelas que não são do CTE e combiná-las com o CTE. Se usada em uma junção como essa, o CTE não deve estar do lado direito de um `LEFT JOIN`.

Essas restrições vêm do padrão SQL, além das exclusões específicas do MySQL `ORDER BY`, `LIMIT` (MySQL 8.0.18 e versões anteriores) e `DISTINCT`.

Para CTE recursiva, as linhas de saída do `EXPLAIN` para partes recursivas `SELECT` exibem `Recursive` na coluna `Extra`.

As estimativas de custo exibidas por `EXPLAIN` representam o custo por iteração, o que pode diferir consideravelmente do custo total. O otimizador não pode prever o número de iterações porque não pode prever em que ponto a cláusula `WHERE` se torna falsa.

O custo real do CTE também pode ser afetado pelo tamanho do conjunto de resultados. Um CTE que produz muitas linhas pode exigir uma tabela temporária interna grande o suficiente para ser convertida de formato de memória para formato em disco e pode sofrer uma penalização de desempenho. Se assim for, aumentar o tamanho da tabela temporária permitida em memória pode melhorar o desempenho; veja Seção 10.4.4, “Uso de Tabela Temporária Interna no MySQL”.

#### Limitação da Recursividade da Expressão Comum da Tabela

É importante que as CTE recursivas que utilizem a parte recursiva `SELECT` incluam uma condição para interromper a recursão. Como uma técnica de desenvolvimento para evitar uma CTE recursiva descontrolada, você pode forçar o término colocando um limite no tempo de execução:

* A variável de sistema `cte_max_recursion_depth` estabelece um limite para o número de níveis de recursão para CTEs. O servidor termina a execução de qualquer CTE que realize mais níveis do que o valor desta variável.

* A variável de sistema `max_execution_time` estabelece um limite de tempo de execução para as instruções `SELECT` executadas dentro da sessão atual.

* A dica de otimização `MAX_EXECUTION_TIME` imposta um limite de tempo de execução por consulta para a declaração `SELECT` na qual ela aparece.

Suponha que uma CTE recursiva seja escrita erroneamente sem uma condição de término de execução recursiva:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT * FROM cte;
```

Por padrão, `cte_max_recursion_depth` tem um valor de 1000, fazendo com que o CTE termine quando ele recursar além de 1000 níveis. As aplicações podem alterar o valor da sessão para ajustar-se às suas necessidades:

```
SET SESSION cte_max_recursion_depth = 10;      -- permit only shallow recursion
SET SESSION cte_max_recursion_depth = 1000000; -- permit deeper recursion
```

Você também pode definir o valor global `cte_max_recursion_depth` para afetar todas as sessões que começam posteriormente.

Para consultas que executam e, portanto, recursem lentamente ou em contextos para os quais há razão para definir o valor do `cte_max_recursion_depth` muito alto, outra maneira de evitar a recursão profunda é definir um tempo limite por sessão. Para fazer isso, execute uma declaração como esta antes de executar a declaração CTE:

```
SET max_execution_time = 1000; -- impose one second timeout
```

Como alternativa, inclua uma dica de otimização dentro da própria declaração do CTE:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT /*+ SET_VAR(cte_max_recursion_depth = 1M) */ * FROM cte;

WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM cte;
```

A partir do MySQL 8.0.19, você também pode usar `LIMIT` na consulta recursiva para impor um número máximo de linhas a serem retornadas ao `SELECT` mais externo, por exemplo:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte LIMIT 10000
)
SELECT * FROM cte;
```

Você pode fazer isso em adição ou em vez de definir um limite de tempo. Assim, o seguinte CTE termina após retornar dez mil linhas ou rodar por um segundo (1000 milissegundos), o que ocorrer primeiro:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte LIMIT 10000
)
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM cte;
```

Se uma consulta recursiva sem um limite de tempo de execução entrar em um loop infinito, você pode terminá-la a partir de outra sessão usando `KILL QUERY`. Dentro da própria sessão, o programa cliente usado para executar a consulta pode fornecer uma maneira de interromper a consulta. Por exemplo, no **mysql**, digitar **Control+C** interrompe a declaração atual.

#### Exemplos de Expressão Comum de Tabela Recorrente

Como mencionado anteriormente, as expressões comuns de tabela recursivas (CTEs) são frequentemente usadas para geração de séries e para percorrer dados hierárquicos ou estruturados em forma de árvore. Esta seção mostra alguns exemplos simples dessas técnicas.

* Geração de série de Fibonacci
* Geração de série de datas
* Traçado de dados hierárquico

##### Geração da Série de Fibonacci

Uma série de Fibonacci começa com os dois números 0 e 1 (ou 1 e 1) e cada número depois disso é a soma dos dois números anteriores. Uma expressão de tabela comum recursiva pode gerar uma série de Fibonacci se cada linha produzida pelo `SELECT` recursivo tiver acesso aos dois números anteriores da série. A CTE a seguir gera uma série de 10 números usando 0 e 1 como os dois primeiros números:

```
WITH RECURSIVE fibonacci (n, fib_n, next_fib_n) AS
(
  SELECT 1, 0, 1
  UNION ALL
  SELECT n + 1, next_fib_n, fib_n + next_fib_n
    FROM fibonacci WHERE n < 10
)
SELECT * FROM fibonacci;
```

O CTE produz este resultado:

```
+------+-------+------------+
| n    | fib_n | next_fib_n |
+------+-------+------------+
|    1 |     0 |          1 |
|    2 |     1 |          1 |
|    3 |     1 |          2 |
|    4 |     2 |          3 |
|    5 |     3 |          5 |
|    6 |     5 |          8 |
|    7 |     8 |         13 |
|    8 |    13 |         21 |
|    9 |    21 |         34 |
|   10 |    34 |         55 |
+------+-------+------------+
```

Como o CTE funciona:

* `n` é uma coluna de exibição para indicar que a linha contém o `n`-ésimo número de Fibonacci. Por exemplo, o 8º número de Fibonacci é 13.

* A coluna `fib_n` exibe o número de Fibonacci `n`.

* A coluna `next_fib_n` exibe o próximo número de Fibonacci após o número `n`. Esta coluna fornece o próximo valor da série para a próxima linha, de modo que essa linha possa produzir a soma dos dois valores anteriores da série em sua coluna `fib_n`.

* A recursão termina quando `n` atinge 10. Esta é uma escolha arbitrária, para limitar a saída a um pequeno conjunto de linhas.

A saída anterior mostra todo o resultado do CTE. Para selecionar apenas uma parte dele, adicione uma cláusula apropriada `WHERE` ao nível superior do `SELECT`. Por exemplo, para selecionar o 8º número de Fibonacci, faça isso:

```
mysql> WITH RECURSIVE fibonacci ...
       ...
       SELECT fib_n FROM fibonacci WHERE n = 8;
+-------+
| fib_n |
+-------+
|    13 |
+-------+
```

##### Geração de Série de Data

Uma expressão de tabela comum pode gerar uma série de datas sucessivas, o que é útil para gerar resumos que incluem uma linha para todas as datas da série, incluindo datas que não estão representadas nos dados resumidos.

Suponha que uma tabela de números de vendas contenha essas linhas:

```
mysql> SELECT * FROM sales ORDER BY date, price;
+------------+--------+
| date       | price  |
+------------+--------+
| 2017-01-03 | 100.00 |
| 2017-01-03 | 200.00 |
| 2017-01-06 |  50.00 |
| 2017-01-08 |  10.00 |
| 2017-01-08 |  20.00 |
| 2017-01-08 | 150.00 |
| 2017-01-10 |   5.00 |
+------------+--------+
```

Esta consulta resume as vendas por dia:

```
mysql> SELECT date, SUM(price) AS sum_price
       FROM sales
       GROUP BY date
       ORDER BY date;
+------------+-----------+
| date       | sum_price |
+------------+-----------+
| 2017-01-03 |    300.00 |
| 2017-01-06 |     50.00 |
| 2017-01-08 |    180.00 |
| 2017-01-10 |      5.00 |
+------------+-----------+
```

No entanto, esse resultado contém "buracos" para datas que não estão representadas na faixa de datas abrangidas pela tabela. Um resultado que representa todas as datas na faixa pode ser produzido usando uma CTE recursiva para gerar esse conjunto de datas, unido com um `LEFT JOIN` aos dados de vendas.

Aqui está o CTE para gerar a série de datas:

```
WITH RECURSIVE dates (date) AS
(
  SELECT MIN(date) FROM sales
  UNION ALL
  SELECT date + INTERVAL 1 DAY FROM dates
  WHERE date + INTERVAL 1 DAY <= (SELECT MAX(date) FROM sales)
)
SELECT * FROM dates;
```

O CTE produz este resultado:

```
+------------+
| date       |
+------------+
| 2017-01-03 |
| 2017-01-04 |
| 2017-01-05 |
| 2017-01-06 |
| 2017-01-07 |
| 2017-01-08 |
| 2017-01-09 |
| 2017-01-10 |
+------------+
```

Como o CTE funciona:

* O não recursivo `SELECT` produz a data mais baixa no intervalo de datas abrangido pela tabela `sales`.

* Cada linha produzida pelo recursivo `SELECT` adiciona um dia à data produzida pela linha anterior.

* A recursão termina após as datas atingirem a data mais alta no intervalo de datas abrangido pela tabela `sales`.

A combinação do CTE com um `LEFT JOIN` contra a tabela `sales` produz o resumo de vendas com uma linha para cada data na faixa:

```
WITH RECURSIVE dates (date) AS
(
  SELECT MIN(date) FROM sales
  UNION ALL
  SELECT date + INTERVAL 1 DAY FROM dates
  WHERE date + INTERVAL 1 DAY <= (SELECT MAX(date) FROM sales)
)
SELECT dates.date, COALESCE(SUM(price), 0) AS sum_price
FROM dates LEFT JOIN sales ON dates.date = sales.date
GROUP BY dates.date
ORDER BY dates.date;
```

A saída tem a seguinte aparência:

```
+------------+-----------+
| date       | sum_price |
+------------+-----------+
| 2017-01-03 |    300.00 |
| 2017-01-04 |      0.00 |
| 2017-01-05 |      0.00 |
| 2017-01-06 |     50.00 |
| 2017-01-07 |      0.00 |
| 2017-01-08 |    180.00 |
| 2017-01-09 |      0.00 |
| 2017-01-10 |      5.00 |
+------------+-----------+
```

Alguns pontos a serem observados:

* As consultas são ineficientes, especialmente a que contém a subconsulta `MAX()` executada para cada linha no recursivo `SELECT`? `EXPLAIN` mostra que a subconsulta contendo `MAX()` é avaliada apenas uma vez e o resultado é armazenado em cache.

* O uso de `COALESCE()` evita a exibição de `NULL` na coluna `sum_price` nos dias para os quais não ocorrem dados de vendas na tabela `sales`.

##### Traversal Hierárquico de Dados

As expressões comuns de tabela recursivas são úteis para percorrer dados que formam uma hierarquia. Considere essas declarações que criam um conjunto de dados pequeno que mostra, para cada funcionário de uma empresa, o nome do funcionário e o número de identificação, e o ID do gerente do funcionário. O funcionário de nível superior (o CEO) tem um ID de gerente de `NULL` (sem gerente).

```
CREATE TABLE employees (
  id         INT PRIMARY KEY NOT NULL,
  name       VARCHAR(100) NOT NULL,
  manager_id INT NULL,
  INDEX (manager_id),
FOREIGN KEY (manager_id) REFERENCES employees (id)
);
INSERT INTO employees VALUES
(333, "Yasmina", NULL),  # Yasmina is the CEO (manager_id is NULL)
(198, "John", 333),      # John has ID 198 and reports to 333 (Yasmina)
(692, "Tarek", 333),
(29, "Pedro", 198),
(4610, "Sarah", 29),
(72, "Pierre", 29),
(123, "Adil", 692);
```

O conjunto de dados resultante tem a seguinte aparência:

```
mysql> SELECT * FROM employees ORDER BY id;
+------+---------+------------+
| id   | name    | manager_id |
+------+---------+------------+
|   29 | Pedro   |        198 |
|   72 | Pierre  |         29 |
|  123 | Adil    |        692 |
|  198 | John    |        333 |
|  333 | Yasmina |       NULL |
|  692 | Tarek   |        333 |
| 4610 | Sarah   |         29 |
+------+---------+------------+
```

Para produzir o organograma com a cadeia de gestão para cada funcionário (ou seja, o caminho do CEO ao funcionário), use um CTE recursivo:

```
WITH RECURSIVE employee_paths (id, name, path) AS
(
  SELECT id, name, CAST(id AS CHAR(200))
    FROM employees
    WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, CONCAT(ep.path, ',', e.id)
    FROM employee_paths AS ep JOIN employees AS e
      ON ep.id = e.manager_id
)
SELECT * FROM employee_paths ORDER BY path;
```

O CTE produz essa saída:

```
+------+---------+-----------------+
| id   | name    | path            |
+------+---------+-----------------+
|  333 | Yasmina | 333             |
|  198 | John    | 333,198         |
|   29 | Pedro   | 333,198,29      |
| 4610 | Sarah   | 333,198,29,4610 |
|   72 | Pierre  | 333,198,29,72   |
|  692 | Tarek   | 333,692         |
|  123 | Adil    | 333,692,123     |
+------+---------+-----------------+
```

Como o CTE funciona:

* O não recursivo `SELECT` produz a linha para o CEO (a linha com o ID de gerente `NULL`).

A coluna `path` é ampliada para `CHAR(200)` para garantir que haja espaço para os valores mais longos `path` produzidos pelo `SELECT` recursivo.

* Cada linha produzida pelo recursivo `SELECT` encontra todos os funcionários que relatam diretamente para um funcionário produzido por uma linha anterior. Para cada funcionário dessa natureza, a linha inclui o ID e o nome do funcionário, e a cadeia de gestão do funcionário. A cadeia é a cadeia do gerente, com o ID do funcionário adicionado ao final.

* A recursão termina quando os funcionários não têm outros que lhes reportem.

Para encontrar o caminho para um funcionário específico ou funcionários, adicione uma cláusula `WHERE` ao nível superior do `SELECT`. Por exemplo, para exibir os resultados para Tarek e Sarah, modifique esse `SELECT` da seguinte forma:

```
mysql> WITH RECURSIVE ...
       ...
       SELECT * FROM employees_extended
       WHERE id IN (692, 4610)
       ORDER BY path;
+------+-------+-----------------+
| id   | name  | path            |
+------+-------+-----------------+
| 4610 | Sarah | 333,198,29,4610 |
|  692 | Tarek | 333,692         |
+------+-------+-----------------+
```

#### Expressões de Tabela Comuns Comparadas a Construções Similares

As expressões de tabela comuns (CTEs) são semelhantes às tabelas derivadas em alguns aspectos:

* Ambos os construtos são nomeados. * Ambos os construtos existem para o escopo de uma única declaração.

Devido a essas semelhanças, os CTEs e as tabelas derivadas podem ser usados de forma intercambiável. Como um exemplo trivial, essas declarações são equivalentes:

```
WITH cte AS (SELECT 1) SELECT * FROM cte;
SELECT * FROM (SELECT 1) AS dt;
```

No entanto, as CTEs têm algumas vantagens em relação às tabelas derivadas:

* Uma tabela derivada pode ser referenciada apenas uma única vez dentro de uma consulta. Uma CTE pode ser referenciada várias vezes. Para usar várias instâncias de um resultado de tabela derivada, você deve derivar o resultado várias vezes.

* Um CTE pode ser autoreferencial (recursivo). * Um CTE pode se referir a outro. * Um CTE pode ser mais fácil de ler quando sua definição aparece no início da declaração, em vez de estar embutida nela.

As CTEs são semelhantes às tabelas criadas com `CREATE [TEMPORARY] TABLE`(create-table.html "15.1.20 CREATE TABLE Statement"), mas não precisam ser definidas ou descartadas explicitamente. Para uma CTE, você não precisa de privilégios para criar tabelas.