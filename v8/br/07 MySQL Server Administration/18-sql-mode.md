### 7.1.11 Modos SQL do Servidor

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender aos requisitos de operação do servidor do site, e cada aplicativo pode definir seu próprio modo SQL de sessão para atender aos seus próprios requisitos.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

* Definindo o Modo SQL
* Os Modos SQL Mais Importantes
* Lista Completa dos Modos SQL
* Modos SQL Combinados
* Modo SQL Rigoroso
* Comparação do Palavra-Chave IGNORE e Modo SQL Rigoroso

Para respostas a perguntas frequentemente feitas sobre os modos SQL do servidor no MySQL, consulte a Seção A.3, “MySQL 8.4 FAQ: Modo SQL do Servidor”.

Ao trabalhar com tabelas `InnoDB`, considere também a variável de sistema `innodb_strict_mode`. Ela habilita verificações de erro adicionais para tabelas `InnoDB`.

#### Definindo o Modo SQL

O modo SQL padrão no MySQL 8.4 inclui esses modos: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO` e `NO_ENGINE_SUBSTITUTION`.

Para definir o modo SQL no início do servidor, use a opção `--sql-mode="modes"` na linha de comando ou `sql-mode="modes"` em um arquivo de opção, como `my.cnf` (sistemas operacionais Unix) ou `my.ini` (Windows). *`modes`* é uma lista de diferentes modos separados por vírgulas. Para limpar explicitamente o modo SQL, defina-o como uma string vazia usando `--sql-mode=""` na linha de comando ou `sql-mode=""` em um arquivo de opção.

::: info Nota

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê no início.

Para alterar o modo SQL em tempo de execução, defina a variável de sistema `sql_mode` global ou de sessão usando uma instrução `SET`:

```
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

Definir a variável `GLOBAL` requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o desatualizado privilégio `SUPER`) e afeta o funcionamento de todos os clientes que se conectam a partir desse momento. Definir a variável `SESSION` afeta apenas o cliente atual. Cada cliente pode alterar o valor da sua sessão `sql_mode` a qualquer momento.

Para determinar o valor atual da variável global ou de sessão `sql_mode`, selecione seu valor:

```
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

Importante

**Modo SQL e particionamento definido pelo usuário.** Alterar o modo SQL do servidor após a criação e inserção de dados em tabelas particionadas pode causar mudanças significativas no comportamento dessas tabelas e pode levar à perda ou corrupção de dados. É altamente recomendável que você nunca altere o modo SQL uma vez que tenha criado tabelas que utilizam particionamento definido pelo usuário.

Ao replicar tabelas particionadas, modos SQL diferentes na fonte e na replica também podem causar problemas. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor na fonte e na replica.

Para mais informações, consulte a Seção 26.6, “Restrições e Limitações no Particionamento”.

#### Os Modos SQL Mais Importantes

Os valores de `sql_mode` mais importantes são provavelmente estes:

*  `ANSI`

  Este modo altera a sintaxe e o comportamento para se conformar mais com o SQL padrão. É um dos modos de combinação especiais listados no final desta seção.
*  `STRICT_TRANS_TABLES`

  Se um valor não puder ser inserido conforme especificado em uma tabela transacional, interrompa a instrução. Para uma tabela não transacional, interrompa a instrução se o valor ocorrer em uma instrução de uma única linha ou na primeira linha de uma instrução de várias linhas. Mais detalhes são fornecidos mais adiante nesta seção.
*  `TRADITIONAL`

Faça com que o MySQL se comporte como um sistema de banco de dados SQL "tradicional". Uma descrição simples desse modo é "dar um erro em vez de um aviso" ao inserir um valor incorreto em uma coluna. É um dos modos de combinação especiais listados no final desta seção.

::: info Nota

  Com o modo  `TRADITIONAL` ativado, uma  `INSERT` ou  `UPDATE` é interrompida assim que um erro ocorre. Se você estiver usando um motor de armazenamento não transacional, isso pode não ser o que você deseja, pois as alterações de dados feitas antes do erro podem não ser revertidas, resultando em uma atualização "parcialmente concluída".

  :::

Quando este manual menciona "modo estrito", ele significa um modo com `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES` habilitados.

#### Lista Completa dos Modos SQL

A lista a seguir descreve todos os modos SQL suportados:

*  `ALLOW_INVALID_DATES`

  Não realize verificações completas de datas. Verifique apenas que o mês esteja no intervalo de 1 a 12 e o dia esteja no intervalo de 1 a 31. Isso pode ser útil para aplicações web que obtêm ano, mês e dia em três campos diferentes e armazenam exatamente o que o usuário inseriu, sem validação de data. Esse modo se aplica a colunas `DATE` e `DATETIME`. Não se aplica a colunas `TIMESTAMP`, que sempre requerem uma data válida.

  Com  `ALLOW_INVALID_DATES` desativado, o servidor exige que os valores de mês e dia sejam legais, e não apenas no intervalo de 1 a 12 e 1 a 31, respectivamente. Com o modo estrito desativado, datas inválidas como `'2004-04-31'` são convertidas para `'0000-00-00'` e um aviso é gerado. Com o modo estrito ativado, datas inválidas geram um erro. Para permitir tais datas, habilite `ALLOW_INVALID_DATES`.
*  `ANSI_QUOTES`

Trate `"` como um caractere de citação de identificador (como o caractere de citação `` ` ``) e não como um caractere de citação de string. Você ainda pode usar `` ` `` para citar identificadores com esse modo habilitado. Com  `ANSI_QUOTES` habilitado, você não pode usar aspas duplas para citar strings literais porque elas são interpretadas como identificadores.
*  `ERROR_FOR_DIVISION_BY_ZERO`

  O modo `ERROR_FOR_DIVISION_BY_ZERO` afeta o tratamento da divisão por zero, que inclui `MOD(N,0)`. Para operações de alteração de dados ( `INSERT`, `UPDATE`), seu efeito também depende se o modo SQL rigoroso está habilitado.

  + Se esse modo não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.
  + Se esse modo estiver habilitado, a divisão por zero insere `NULL` e produz um aviso.
  + Se esse modo e o modo rigoroso estiverem habilitados, a divisão por zero produz um erro, a menos que `IGNORE` seja fornecido também. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

  Para  `SELECT`, a divisão por zero retorna `NULL`. Habilitar `ERROR_FOR_DIVISION_BY_ZERO` produz um aviso também, independentemente de o modo rigoroso estar habilitado.

   `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado. `ERROR_FOR_DIVISION_BY_ZERO` não faz parte do modo rigoroso, mas deve ser usado em conjunto com o modo rigoroso e é habilitado por padrão. Um aviso ocorre se `ERROR_FOR_DIVISION_BY_ZERO` estiver habilitado sem também habilitar o modo rigoroso ou vice-versa.

  Como `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.
*  `HIGH_NOT_PRECEDENCE`

  A precedência do operador `NOT` é tal que expressões como `NOT a BETWEEN b AND c` são parseadas como `NOT (a BETWEEN b AND c)`. Em algumas versões mais antigas do MySQL, a expressão era parseada como `(NOT a) BETWEEN b AND c`. O comportamento antigo de precedência mais alta pode ser obtido ao habilitar o modo SQL `HIGH_NOT_PRECEDENCE`.

```
  mysql> SET sql_mode = '';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 0
  mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 1
  ```
*  `IGNORE_SPACE`

  Permite espaços entre o nome de uma função e o caractere `(`. Isso faz com que os nomes de funções embutidas sejam tratados como palavras reservadas. Como resultado, identificadores que são iguais aos nomes de funções devem ser citados conforme descrito na  Seção 11.2, “Nomes de Objetos de Esquema”. Por exemplo, porque existe uma função `COUNT()`, o uso de `count` como nome de tabela na seguinte declaração causa um erro:

  ```
  mysql> CREATE TABLE count (i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax
  ```

  O nome da tabela deve ser citado:

  ```
  mysql> CREATE TABLE `count` (i INT);
  Query OK, 0 rows affected (0.00 sec)
  ```

  O modo SQL  `IGNORE_SPACE` se aplica a funções embutidas, não a funções carregáveis ou funções armazenadas. É sempre permitido ter espaços após o nome de uma função carregável ou armazenada, independentemente de `IGNORE_SPACE` estar habilitado.

  Para mais discussões sobre `IGNORE_SPACE`, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Função”.
*  `NO_AUTO_VALUE_ON_ZERO`

   `NO_AUTO_VALUE_ON_ZERO` afeta o tratamento de colunas `AUTO_INCREMENT`. Normalmente, você gera o próximo número de sequência para a coluna inserindo `NULL` ou `0` nela. `NO_AUTO_VALUE_ON_ZERO` suprime esse comportamento para `0` para que apenas `NULL` gere o próximo número de sequência.

  Esse modo pode ser útil se `0` tiver sido armazenado na coluna `AUTO_INCREMENT` de uma tabela. (Armazenar `0` não é uma prática recomendada, aliás.) Por exemplo, se você fazer o dump da tabela com `mysqldump` e depois recarregar, o MySQL normalmente gera novos números de sequência quando encontra os valores `0`, resultando em uma tabela com conteúdo diferente do que foi dumpado. Habilitar `NO_AUTO_VALUE_ON_ZERO` antes de recarregar o arquivo de dump resolve esse problema. Por essa razão, o `mysqldump` inclui automaticamente em sua saída uma declaração que habilita `NO_AUTO_VALUE_ON_ZERO`.
*  `NO_BACKSLASH_ESCAPES`

Ativação deste modo desabilita o uso do caractere barra invertida (`\`) como caractere de escape dentro de strings e identificadores. Com este modo ativado, a barra invertida se torna um caractere comum como qualquer outro, e a sequência de escape padrão para expressões `LIKE` é alterada para que nenhum caractere de escape seja usado.
*  `NO_DIR_IN_CREATE`

  Ao criar uma tabela, ignore todas as diretivas `INDEX DIRECTORY` e `DATA DIRECTORY`. Esta opção é útil em servidores replicados.
*  `NO_ENGINE_SUBSTITUTION`

  Controle a substituição automática do motor de armazenamento padrão quando uma declaração como `CREATE TABLE` ou `ALTER TABLE` especifica um motor de armazenamento que está desativado ou não compilado.

  Por padrão, `NO_ENGINE_SUBSTITUTION` está ativado.

  Como os motores de armazenamento podem ser plugáveis em tempo de execução, os motores indisponíveis são tratados da mesma maneira:

  Com `NO_ENGINE_SUBSTITUTION` desativado, para `CREATE TABLE`, o motor padrão é usado e uma mensagem de aviso ocorre se o motor desejado estiver indisponível. Para `ALTER TABLE`, uma mensagem de aviso ocorre e a tabela não é alterada.

  Com `NO_ENGINE_SUBSTITUTION` ativado, ocorre um erro e a tabela não é criada ou alterada se o motor desejado estiver indisponível.
*  `NO_UNSIGNED_SUBTRACTION`

  A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado não nulo por padrão. Se o resultado de outra forma fosse negativo, ocorre um erro:

  ```
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
  ```

  Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver ativado, o resultado é negativo:

  ```
  mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  +-------------------------+
  | CAST(0 AS UNSIGNED) - 1 |
  +-------------------------+
  |                      -1 |
  +-------------------------+
  ```

  Se o resultado de uma operação desse tipo for usado para atualizar uma coluna inteira `UNSIGNED`, o resultado é recortado para o valor máximo do tipo da coluna, ou recortado para 0 se `NO_UNSIGNED_SUBTRACTION` estiver ativado. Com o modo SQL rigoroso ativado, ocorre um erro e a coluna permanece inalterada.

Quando `NO_UNSIGNED_SUBTRACTION` está habilitado, o resultado da subtração é assinado, *mesmo que qualquer operando seja unsigned*. Por exemplo, compare o tipo da coluna `c2` na tabela `t1` com o da coluna `c2` na tabela `t2`:

  ```
  mysql> SET sql_mode='';
  mysql> CREATE TABLE test (c1 BIGINT UNSIGNED NOT NULL);
  mysql> CREATE TABLE t1 SELECT c1 - 1 AS c2 FROM test;
  mysql> DESCRIBE t1;
  +-------+---------------------+------+-----+---------+-------+
  | Field | Type                | Null | Key | Default | Extra |
  +-------+---------------------+------+-----+---------+-------+
  | c2    | bigint(21) unsigned | NO   |     | 0       |       |
  +-------+---------------------+------+-----+---------+-------+

  mysql> SET sql_mode='NO_UNSIGNED_SUBTRACTION';
  mysql> CREATE TABLE t2 SELECT c1 - 1 AS c2 FROM test;
  mysql> DESCRIBE t2;
  +-------+------------+------+-----+---------+-------+
  | Field | Type       | Null | Key | Default | Extra |
  +-------+------------+------+-----+---------+-------+
  | c2    | bigint(21) | NO   |     | 0       |       |
  +-------+------------+------+-----+---------+-------+
  ```

  Isso significa que `BIGINT UNSIGNED` não é 100% utilizável em todos os contextos. Veja a Seção 14.10, “Funções e Operadores de Cast”.
*  `NO_ZERO_DATE`

  O modo `NO_ZERO_DATE` afeta se o servidor permite `'0000-00-00'` como uma data válida. Seu efeito também depende se o modo SQL rigoroso está habilitado.

  + Se este modo não estiver habilitado, `'0000-00-00'` é permitido e as inserções não produzem avisos.
  + Se este modo estiver habilitado, `'0000-00-00'` é permitido e as inserções produzem um aviso.
  + Se este modo e o modo rigoroso estiverem habilitados, `'0000-00-00'` não é permitido e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e as inserções produzem um aviso.

   `NO_ZERO_DATE` está desatualizado. `NO_ZERO_DATE` não faz parte do modo rigoroso, mas deve ser usado em conjunto com o modo rigoroso e é habilitado por padrão. Um aviso ocorre se `NO_ZERO_DATE` estiver habilitado sem também habilitar o modo rigoroso ou vice-versa.

  Como `NO_ZERO_DATE` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.
*  `NO_ZERO_IN_DATE`

  O modo `NO_ZERO_IN_DATE` afeta se o servidor permite datas em que a parte do ano é não nula, mas a parte do mês ou dia é 0. (Este modo afeta datas como `'2010-00-01'` ou `'2010-01-00`, mas não `'0000-00-00'`. Para controlar se o servidor permite `'0000-00-00'`, use o modo `NO_ZERO_DATE`. O efeito de `NO_ZERO_IN_DATE` também depende se o modo SQL rigoroso está habilitado.

+ Se este modo não estiver habilitado, datas com partes zero são permitidas e os insertos não produzem nenhum aviso.
+ Se este modo estiver habilitado, datas com partes zero são inseridas como `'0000-00-00'` e produzem um aviso.
+ Se este modo e o modo rigoroso estiverem habilitados, datas com partes zero não são permitidas e os insertos produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com partes zero são inseridas como `'0000-00-00'` e produzem um aviso.

`NO_ZERO_IN_DATE` está desatualizado. `NO_ZERO_IN_DATE` não faz parte do modo rigoroso, mas deve ser usado em conjunto com o modo rigoroso e é habilitado por padrão. Um aviso ocorre se `NO_ZERO_IN_DATE` estiver habilitado sem também habilitar o modo rigoroso ou vice-versa.

Como `NO_ZERO_IN_DATE` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.
*  `ONLY_FULL_GROUP_BY`

  Recuse consultas para as quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` referem-se a colunas não agregadas que não são nomeadas na cláusula `GROUP BY` nem são dependentes funcionalmente de (determinadas de forma única por) as colunas `GROUP BY`.

  Uma extensão MySQL ao SQL padrão permite referências na cláusula `HAVING` a expressões aliadas na lista de seleção. A cláusula `HAVING` pode referir-se a aliases independentemente de `ONLY_FULL_GROUP_BY` estar habilitado.

  Para discussões e exemplos adicionais, consulte a Seção 14.19.3, “Manejo de MySQL de GROUP BY”.
*  `PAD_CHAR_TO_FULL_LENGTH`

  Por padrão, espaços finais são removidos dos valores da coluna `CHAR` na recuperação. Se `PAD_CHAR_TO_FULL_LENGTH` estiver habilitado, o corte não ocorre e os valores `CHAR` recuperados são preenchidos até seu comprimento total. Este modo não se aplica a colunas `VARCHAR`, para as quais espaços finais são retidos na recuperação.

  ::: info Nota

  `PAD_CHAR_TO_FULL_LENGTH` está desatualizado. Espere que ele seja removido em uma versão futura do MySQL.

  :::

Trate `||` como um operador de concatenação de strings (mesmo que `CONCAT()`) e não como um sinônimo de `OU`.
* `REAL_AS_FLOAT`

Trate `REAL` - (`FLOAT`, `DOUBLE`) como um sinônimo de `FLOAT` - (`FLOAT`, `DOUBLE`). Por padrão, o MySQL trata `REAL` - (`FLOAT`, `DOUBLE`) como um sinônimo de `DOUBLE` - (`FLOAT`, `DOUBLE`).
* `STRICT_ALL_TABLES`

Ative o modo SQL rigoroso para todos os mecanismos de armazenamento. Valores de dados inválidos são rejeitados. Para detalhes, consulte o Modo SQL Rigoroso.
* `STRICT_TRANS_TABLES`

Ative o modo SQL rigoroso para mecanismos de armazenamento transacionais e, quando possível, para mecanismos de armazenamento não transacionais. Para detalhes, consulte o Modo SQL Rigoroso.
* `TIME_TRUNCATE_FRACTIONAL`

Controle se a arredondagem ou truncação ocorre ao inserir um valor de `TIME`, `DATE` ou `TIMESTAMP` com uma parte de segundos fracionários em uma coluna com o mesmo tipo, mas com menos dígitos fracionários. O comportamento padrão é usar a arredondagem. Se este modo for ativado, a truncação ocorre em vez disso. A seguinte sequência de instruções ilustra a diferença:

```
  mysql> CREATE TABLE t1 (c1 CHAR(10));
  Query OK, 0 rows affected (0.37 sec)

  mysql> INSERT INTO t1 (c1) VALUES('xy');
  Query OK, 1 row affected (0.01 sec)

  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT c1, CHAR_LENGTH(c1) FROM t1;
  +------+-----------------+
  | c1   | CHAR_LENGTH(c1) |
  +------+-----------------+
  | xy   |               2 |
  +------+-----------------+
  1 row in set (0.00 sec)

  mysql> SET sql_mode = 'PAD_CHAR_TO_FULL_LENGTH';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT c1, CHAR_LENGTH(c1) FROM t1;
  +------------+-----------------+
  | c1         | CHAR_LENGTH(c1) |
  +------------+-----------------+
  | xy         |              10 |
  +------------+-----------------+
  1 row in set (0.00 sec)
  ```

O conteúdo da tabela resultante parece assim, onde o primeiro valor foi submetido à arredondagem e o segundo à truncação:

```
  CREATE TABLE t (id INT, tval TIME(1));
  SET sql_mode='';
  INSERT INTO t (id, tval) VALUES(1, 1.55);
  SET sql_mode='TIME_TRUNCATE_FRACTIONAL';
  INSERT INTO t (id, tval) VALUES(2, 1.55);
  ```

Veja também a Seção 13.2.6, “Segundos Fracionários em Valores de Tempo”.

#### Modos SQL de Combinação

Os seguintes modos especiais são fornecidos como abreviações para combinações de valores de modo da lista anterior.

* `ANSI`

Equivalente a `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE` e `ONLY_FULL_GROUP_BY`.

O modo `ANSI` também faz com que o servidor retorne um erro para consultas onde uma função de conjunto *`S`* com uma referência externa `S(outer_ref)` não pode ser agregada na consulta externa contra a qual a referência externa foi resolvida. Essa é uma consulta como esta:

```
  mysql> SELECT id, tval FROM t ORDER BY id;
  +------+------------+
  | id   | tval       |
  +------+------------+
  |    1 | 00:00:01.6 |
  |    2 | 00:00:01.5 |
  +------+------------+
  ```apwAr61hwp```
  SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
  ```JAfeq7EPIi```
mysql> CREATE TABLE t (i INT NOT NULL PRIMARY KEY);
mysql> INSERT INTO t (i) VALUES(1),(1);
ERROR 1062 (23000): Duplicate entry '1' for key 't.PRIMARY'
```Bt3WavosOj```
mysql> INSERT IGNORE INTO t (i) VALUES(1),(1);
Query OK, 1 row affected, 1 warning (0.01 sec)
Records: 2  Duplicates: 1  Warnings: 1

mysql> SHOW WARNINGS;
+---------+------+-----------------------------------------+
| Level   | Code | Message                                 |
+---------+------+-----------------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 't.PRIMARY' |
+---------+------+-----------------------------------------+
1 row in set (0.00 sec)
```5DDWgOz01g```
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```yA8H7hYUAM```
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
mysql> SELECT * FROM t2;
+----+
| id |
+----+
|  1 |
|  0 |
|  3 |
+----+
```JDu7tKjlwM```
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
Query OK, 1 row affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+---------+------+--------------------------------------------------------+
| Level   | Code | Message                                                |
+---------+------+--------------------------------------------------------+
| Warning | 1366 | Incorrect integer value: 'abc' for column 'i' at row 1 |
+---------+------+--------------------------------------------------------+
1 row in set (0.00 sec)
```b9nMTYI5QS```

::: info Nota
Português (Brasil):

Como o desenvolvimento contínuo do MySQL define novos erros, pode haver erros que não estão na lista anterior para os quais o modo SQL rigoroso se aplica.