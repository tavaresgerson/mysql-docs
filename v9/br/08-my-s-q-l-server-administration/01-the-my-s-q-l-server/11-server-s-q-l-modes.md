### 7.1.11 Modos SQL do Servidor

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender aos requisitos de operação do servidor do site, e cada aplicativo pode definir seu próprio modo SQL de sessão para atender aos seus próprios requisitos.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

* Definindo o Modo SQL
* Os Modos SQL Mais Importantes
* Lista Completa dos Modos SQL
* Modos SQL Combinados
* Modo SQL Rigoroso
* Comparação do Palavra-Chave IGNORE e do Modo SQL Rigoroso

Para respostas a perguntas frequentemente feitas sobre os modos SQL do servidor no MySQL, consulte a Seção A.3, “MySQL 9.5 FAQ: Modo SQL do Servidor”.

Ao trabalhar com tabelas `InnoDB`, considere também a variável de sistema `innodb_strict_mode`. Ela habilita verificações de erro adicionais para tabelas `InnoDB`.

#### Definindo o Modo SQL

O modo SQL padrão no MySQL 9.5 inclui esses modos: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO` e `NO_ENGINE_SUBSTITUTION`.

Para definir o modo SQL no início do servidor, use a opção `--sql-mode="modes"` na linha de comando ou `sql-mode="modes"` em um arquivo de opção, como `my.cnf` (sistemas operacionais Unix) ou `my.ini` (Windows). *`modes`* é uma lista de diferentes modos separados por vírgulas. Para limpar explicitamente o modo SQL, defina-o como uma string vazia usando `--sql-mode=""` na linha de comando ou `sql-mode=""` em um arquivo de opção.

Observação

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opções que o servidor lê ao iniciar.

Para alterar o modo SQL em tempo de execução, defina a variável de sistema `sql_mode` global ou de sessão usando uma instrução `SET`:

```
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

Definir a variável `GLOBAL` requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o desatualizado privilégio `SUPER`) e afeta o funcionamento de todos os clientes que se conectam a partir desse momento. Definir a variável `SESSION` afeta apenas o cliente atual. Cada cliente pode alterar o valor da variável `sql_mode` de sessão a qualquer momento.

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

Os valores de `sql_mode` mais importantes são provavelmente esses:

* `ANSI`

  Esse modo altera a sintaxe e o comportamento para se conformar mais com o SQL padrão. É um dos modos de combinação especiais listados no final desta seção.

* `STRICT_TRANS_TABLES`

Se um valor não puder ser inserido conforme especificado em uma tabela transacional, interrompa a instrução. Para uma tabela não transacional, interrompa a instrução se o valor ocorrer em uma instrução de uma única linha ou na primeira linha de uma instrução de várias linhas. Mais detalhes são fornecidos mais adiante nesta seção.

* `TRADICIONAL`

  Faça com que o MySQL se comporte como um sistema de banco de dados SQL "tradicional". Uma descrição simples deste modo é "dar um erro em vez de um aviso" ao inserir um valor incorreto em uma coluna. É um dos modos de combinação especiais listados no final desta seção.

  Nota

  Com o modo `TRADICIONAL` ativado, uma `INSERT` ou `UPDATE` é interrompida assim que um erro ocorre. Se você estiver usando um mecanismo de armazenamento não transacional, isso pode não ser o que você deseja, pois as alterações de dados feitas antes do erro podem não ser revertidas, resultando em uma atualização "parcialmente concluída".

Quando este manual se refere a "modo estrito", significa um modo com `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES` habilitados.

#### Lista Completa dos Modos SQL

A lista a seguir descreve todos os modos SQL suportados:

* `ALLOW_INVALID_DATES`

  Não realize verificações completas de datas. Verifique apenas que o mês esteja no intervalo de 1 a 12 e o dia esteja no intervalo de 1 a 31. Isso pode ser útil para aplicações web que obtêm ano, mês e dia em três campos diferentes e armazenam exatamente o que o usuário inseriu, sem validação de data. Este modo se aplica às colunas `DATE` e `DATETIME`. Não se aplica às colunas `TIMESTAMP`, que sempre requerem uma data válida.

Com `ALLOW_INVALID_DATES` desativado, o servidor exige que os valores de mês e dia sejam válidos e não apenas dentro do intervalo de 1 a 12 e 1 a 31, respectivamente. Com o modo rigoroso desativado, datas inválidas como `'2004-04-31'` são convertidas em `'0000-00-00'` e um aviso é gerado. Com o modo rigoroso ativado, datas inválidas geram um erro. Para permitir tais datas, ative `ALLOW_INVALID_DATES`.

* `ANSI_QUOTES`

  Trate `"` como um caractere de citação de identificador (como o caractere de citação ```
  mysql> SET sql_mode = '';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 0
  mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 1
  ``` ` para citar identificadores com este modo ativado. Com `ANSI_QUOTES` ativado, não pode usar aspas duplas para citar strings literais porque são interpretadas como identificadores.

* `ERROR_FOR_DIVISION_BY_ZERO`

  O modo `ERROR_FOR_DIVISION_BY_ZERO` afeta o tratamento da divisão por zero, que inclui `MOD(N,0)`. Para operações de alteração de dados (`INSERT`, `UPDATE`), seu efeito também depende se o modo SQL rigoroso está ativado.

  + Se este modo não estiver ativado, a divisão por zero insere `NULL` e não produz aviso.

  + Se este modo estiver ativado, a divisão por zero insere `NULL` e produz um aviso.

  + Se este modo e o modo rigoroso estiverem ativados, a divisão por zero produz um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

  Para `SELECT`, a divisão por zero retorna `NULL`. Ativando `ERROR_FOR_DIVISION_BY_ZERO`, um aviso é produzido também, independentemente de o modo rigoroso estar ativado.

`ERROR_FOR_DIVISION_BY_ZERO` está desatualizado. `ERROR_FOR_DIVISION_BY_ZERO` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `ERROR_FOR_DIVISION_BY_ZERO` for ativado sem também ativar o modo estrito ou vice-versa.

Como `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL estrito.

* `HIGH_NOT_PRECEDENCE`

  A precedência do operador `NOT` é tal que expressões como `NOT a BETWEEN b AND c` são analisadas como `NOT (a BETWEEN b AND c)`. Em algumas versões mais antigas do MySQL, a expressão era analisada como `(NOT a) BETWEEN b AND c`. O comportamento antigo de precedência mais alta pode ser obtido ativando o modo SQL `HIGH_NOT_PRECEDENCE`.

  ```
  mysql> CREATE TABLE count (i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax
  ```

* `IGNORE_SPACE`

  Permite espaços entre o nome de uma função e o caractere `(`. Isso faz com que os nomes de funções embutidas sejam tratados como palavras reservadas. Como resultado, identificadores que são iguais aos nomes de funções devem ser citados conforme descrito na Seção 11.2, “Nomes de Objetos de Schema”. Por exemplo, porque existe uma função `COUNT()`, o uso de `count` como nome de tabela na seguinte declaração causa um erro:

  ```
  mysql> CREATE TABLE `count` (i INT);
  Query OK, 0 rows affected (0.00 sec)
  ```

  O nome da tabela deve ser citado:

  ```
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
  ```

  O modo SQL `IGNORE_SPACE` se aplica a funções embutidas, não a funções carregáveis ou funções armazenadas. É sempre permitido ter espaços após o nome de uma função carregável ou armazenada, independentemente de `IGNORE_SPACE` estar ativado.

  Para mais discussão sobre `IGNORE_SPACE`, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Função”.

* `NO_AUTO_VALUE_ON_ZERO`

`NO_AUTO_VALUE_ON_ZERO` afeta o tratamento das colunas `AUTO_INCREMENT`. Normalmente, você gera o próximo número de sequência para a coluna inserindo `NULL` ou `0` nela. `NO_AUTO_VALUE_ON_ZERO` suprime esse comportamento para `0`, de modo que apenas `NULL` gera o próximo número de sequência.

Esse modo pode ser útil se `0` tiver sido armazenado na coluna `AUTO_INCREMENT` de uma tabela. (Armazenar `0` não é uma prática recomendada, aliás.) Por exemplo, se você fazer o dump da tabela com **mysqldump** e depois recarregar, o MySQL normalmente gera novos números de sequência quando encontra os valores `0`, resultando em uma tabela com conteúdo diferente do que foi dumpado. Habilitar `NO_AUTO_VALUE_ON_ZERO` antes de recarregar o arquivo de dump resolve esse problema. Por essa razão, **mysqldump** inclui automaticamente em sua saída uma declaração que habilita `NO_AUTO_VALUE_ON_ZERO`.

* `NO_BACKSLASH_ESCAPES`

  Habilitar esse modo desabilita o uso do caractere barra invertida (`\`) como caractere de escape dentro de strings e identificadores. Com esse modo habilitado, a barra invertida se torna um caractere comum como qualquer outro, e a sequência de escape padrão para expressões `LIKE` é alterada para que nenhum caractere de escape seja usado.

* `NO_DIR_IN_CREATE`

  Ao criar uma tabela, ignore todas as diretivas `INDEX DIRECTORY` e `DATA DIRECTORY`. Essa opção é útil em servidores replicados.

* `NO_ENGINE_SUBSTITUTION`

  Controle a substituição automática do motor de armazenamento padrão quando uma declaração como `CREATE TABLE` ou `ALTER TABLE` especifica um motor de armazenamento que está desativado ou não compilado.

Por padrão, `NO_ENGINE_SUBSTITUTION` está habilitado.

Como os motores de armazenamento podem ser plugáveis em tempo de execução, os motores indisponíveis são tratados da mesma maneira:

Com `NO_ENGINE_SUBSTITUTION` desativado, para `CREATE TABLE`, o motor padrão é usado e uma mensagem de aviso é exibida se o motor desejado estiver indisponível. Para `ALTER TABLE`, uma mensagem de aviso é exibida e a tabela não é alterada.

Com `NO_ENGINE_SUBSTITUTION` ativado, um erro ocorre e a tabela não é criada ou alterada se o motor desejado estiver indisponível.

* `NO_UNSIGNED_SUBTRACTION`

  A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado de outra forma fosse negativo, um erro ocorre:

  ```
  mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  +-------------------------+
  | CAST(0 AS UNSIGNED) - 1 |
  +-------------------------+
  |                      -1 |
  +-------------------------+
  ```

  Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver ativado, o resultado é negativo:

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

  Se o resultado de uma operação desse tipo for usado para atualizar uma coluna inteira `UNSIGNED`, o resultado é recortado para o valor máximo do tipo da coluna, ou recortado para 0 se `NO_UNSIGNED_SUBTRACTION` estiver ativado. Com o modo SQL rigoroso ativado, um erro ocorre e a coluna permanece inalterada.

  Quando `NO_UNSIGNED_SUBTRACTION` está ativado, o resultado da subtração é assinado, *mesmo que qualquer operando seja não assinado*. Por exemplo, compare o tipo da coluna `c2` na tabela `t1` com o tipo da coluna `c2` na tabela `t2`:

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

  Isso significa que `BIGINT UNSIGNED` não é 100% utilizável em todos os contextos. Veja a Seção 14.10, “Funções e Operadores de Cast”.

* `NO_ZERO_DATE`

  O modo `NO_ZERO_DATE` afeta se o servidor permite `'0000-00-00'` como uma data válida. Seu efeito também depende se o modo SQL rigoroso está ativado.

  + Se este modo não estiver ativado, `'0000-00-00'` é permitido e as inserções não produzem aviso.

  + Se este modo estiver ativado, `'0000-00-00'` é permitido e as inserções produzem um aviso.

+ Se este modo e o modo estrito estiverem habilitados, a data `'0000-00-00'` não é permitida e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a data `'0000-00-00'` é permitida e as inserções produzem um aviso.

`NO_ZERO_DATE` está desatualizado. `NO_ZERO_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é habilitado por padrão. Um aviso ocorre se `NO_ZERO_DATE` for habilitado sem também habilitar o modo estrito ou vice-versa.

Como `NO_ZERO_DATE` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL estrito.

* `NO_ZERO_IN_DATE`

  O modo `NO_ZERO_IN_DATE` afeta se o servidor permite datas em que a parte do ano é não nula, mas a parte do mês ou do dia é 0. (Este modo afeta datas como `'2010-00-01'` ou `'2010-01-00`, mas não `'0000-00-00'`. Para controlar se o servidor permite `'0000-00-00', use o modo `NO_ZERO_DATE`. O efeito de `NO_ZERO_IN_DATE` também depende se o modo SQL estrito está habilitado.

  + Se este modo não estiver habilitado, datas com partes zero são permitidas e as inserções não produzem nenhum aviso.

  + Se este modo estiver habilitado, datas com partes zero são inseridas como `'0000-00-00'` e produzem um aviso.

  + Se este modo e o modo estrito estiverem habilitados, datas com partes zero não são permitidas e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com partes zero são inseridas como `'0000-00-00'` e produzem um aviso.

`NO_ZERO_IN_DATE` está desatualizado. `NO_ZERO_IN_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `NO_ZERO_IN_DATE` for ativado sem ativar também o modo estrito ou vice-versa.

Como `NO_ZERO_IN_DATE` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL estrito.

* `ONLY_FULL_GROUP_BY`

  Rejeitar consultas para as quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` referem-se a colunas não agregadas que não são nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes (determinadas de forma única) das colunas `GROUP BY`.

  Uma extensão MySQL ao SQL padrão permite referências na cláusula `HAVING` a expressões aliadas na lista de seleção. A cláusula `HAVING` pode referir-se a aliases, independentemente de `ONLY_FULL_GROUP_BY` estar ativado.

  Para discussões e exemplos adicionais, consulte a Seção 14.19.3, “Manejo do MySQL do GROUP BY”.

* `PAD_CHAR_TO_FULL_LENGTH`

  Por padrão, espaços finais são removidos dos valores da coluna `CHAR` na recuperação. Se `PAD_CHAR_TO_FULL_LENGTH` estiver ativado, o corte não ocorre e os valores `CHAR` recuperados são preenchidos até seu comprimento total. Este modo não se aplica às colunas `VARCHAR`, para as quais espaços finais são retidos na recuperação.

  Nota

  `PAD_CHAR_TO_FULL_LENGTH` está desatualizado. Espere que ele seja removido em uma versão futura do MySQL.

  ```
  CREATE TABLE t (id INT, tval TIME(1));
  SET sql_mode='';
  INSERT INTO t (id, tval) VALUES(1, 1.55);
  SET sql_mode='TIME_TRUNCATE_FRACTIONAL';
  INSERT INTO t (id, tval) VALUES(2, 1.55);
  ```

* `PIPES_AS_CONCAT`

  Tratar `||` como um operador de concatenação de strings (mesmo que `CONCAT()`) em vez de como um sinônimo de `OR`.

Trate `REAL` - FLOAT, DOUBLE") como sinônimo de `FLOAT` - FLOAT, DOUBLE"). Por padrão, o MySQL trata `REAL` - FLOAT, DOUBLE") como sinônimo de `DOUBLE` - FLOAT, DOUBLE").

* `STRICT_ALL_TABLES`

  Ative o modo SQL rigoroso para todos os motores de armazenamento. Valores de dados inválidos são rejeitados. Para detalhes, consulte Modo SQL Rigoroso.

* `STRICT_TRANS_TABLES`

  Ative o modo SQL rigoroso para os motores de armazenamento transacionais e, quando possível, para os motores de armazenamento não transacionais. Para detalhes, consulte Modo SQL Rigoroso.

* `TIME_TRUNCATE_FRACTIONAL`

  Controle se a arredondagem ou truncação ocorre ao inserir um valor de `TIME`, `DATE` ou `TIMESTAMP` com uma parte de segundos fracionários em uma coluna com o mesmo tipo, mas com menos dígitos fracionários. O comportamento padrão é usar a arredondagem. Se este modo for ativado, a truncação ocorre em vez disso. A sequência de declarações a seguir ilustra a diferença:

  ```
  mysql> SELECT id, tval FROM t ORDER BY id;
  +------+------------+
  | id   | tval       |
  +------+------------+
  |    1 | 00:00:01.6 |
  |    2 | 00:00:01.5 |
  +------+------------+
  ```

  O conteúdo da tabela resultante parece assim, onde o primeiro valor foi submetido à arredondagem e o segundo à truncação:

  ```
  SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
  ```

  Veja também a Seção 13.2.6, “Segundos Fracionários em Valores de Tempo”.

#### Modos SQL Combinados

Os seguintes modos especiais são fornecidos como abreviações para combinações de valores de modo da lista anterior.

* `ANSI`

  Equivalente a `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE` e `ONLY_FULL_GROUP_BY`.

  O modo `ANSI` também faz com que o servidor retorne um erro para consultas onde uma função de conjunto *`S`* com uma referência externa `S(outer_ref)` não pode ser agregada na consulta externa contra a qual a referência externa foi resolvida. Essa é uma consulta:

  ```
mysql> CREATE TABLE t (i INT NOT NULL PRIMARY KEY);
mysql> INSERT INTO t (i) VALUES(1),(1);
ERROR 1062 (23000): Duplicate entry '1' for key 't.PRIMARY'
```

Aqui, `MAX(t1.b)` não pode ser agregado na consulta externa porque aparece na cláusula `WHERE` dessa consulta. O SQL padrão exige um erro nessa situação. Se o modo `ANSI` não estiver habilitado, o servidor trata `S(outer_ref)` nessas consultas da mesma maneira que interpretaria `S(const)`.

Veja a Seção 1.7, “Conformidade com Padrões MySQL”.

* `TRADITIONAL`

  `TRADITIONAL` é equivalente a `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO` e `NO_ENGINE_SUBSTITUTION`.

#### Modo SQL Estrito

O modo estrito controla como o MySQL lida com valores inválidos ou ausentes em declarações de alteração de dados, como `INSERT` ou `UPDATE`. Um valor pode ser inválido por várias razões. Por exemplo, ele pode ter o tipo de dado errado para a coluna ou estar fora de faixa. Um valor está ausente quando uma nova linha a ser inserida não contém um valor para uma coluna que não é `NULL` e não tem uma cláusula `DEFAULT` explícita em sua definição. (Para uma coluna `NULL`, `NULL` é inserido se o valor estiver ausente.) O modo estrito também afeta declarações DDL, como `CREATE TABLE`.

Se o modo estrito não estiver em vigor, o MySQL insere valores ajustados para valores inválidos ou ausentes e produz avisos (veja a Seção 15.7.7.43, “Instrução SHOW WARNINGS”). No modo estrito, você pode produzir esse comportamento usando `INSERT IGNORE` ou `UPDATE IGNORE`.

Para declarações como `SELECT` que não alteram dados, valores inválidos geram um aviso no modo estrito, não um erro.

O modo estrito produz um erro para tentativas de criar uma chave que exceda o comprimento máximo da chave. Quando o modo estrito não está habilitado, isso resulta em um aviso e truncação da chave para o comprimento máximo da chave.

O modo estrito não afeta se as restrições de chave estrangeira são verificadas. Isso pode ser feito com `foreign_key_checks`. (Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.)

O modo SQL estrito está em vigor se `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` estiverem habilitados, embora os efeitos desses modos sejam um pouco diferentes:

* Para tabelas transacionais, ocorre um erro para valores inválidos ou ausentes em uma declaração de alteração de dados quando `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` estiverem habilitados. A declaração é abortada e revertida.

* Para tabelas não transacionais, o comportamento é o mesmo para qualquer um dos modos se o valor ruim ocorrer na primeira linha a ser inserida ou atualizada: A declaração é abortada e a tabela permanece inalterada. Se a declaração inserir ou modificar várias linhas e o valor ruim ocorrer na segunda ou linha subsequente, o resultado depende do modo estrito habilitado:

  + Para `STRICT_ALL_TABLES`, o MySQL retorna um erro e ignora o resto das linhas. No entanto, como as linhas anteriores foram inseridas ou atualizadas, o resultado é uma atualização parcial. Para evitar isso, use declarações de uma única linha, que podem ser abortadas sem alterar a tabela.

  + Para `STRICT_TRANS_TABLES`, o MySQL converte um valor inválido para o valor válido mais próximo da coluna e insere o valor ajustado. Se um valor estiver ausente, o MySQL insere o valor padrão implícito para o tipo de dados da coluna. Em qualquer caso, o MySQL gera uma mensagem de aviso em vez de um erro e continua processando a declaração. Os valores padrão implícitos são descritos na Seção 13.6, “Valores Padrão de Tipo de Dado”.

O modo estrito afeta o tratamento da divisão por zero, datas zero e zeros em datas da seguinte forma:

* O modo estrito afeta o tratamento da divisão por zero, que inclui `MOD(N,0)`:

  Para operações de alteração de dados (`INSERT`, `UPDATE`):

+ Se o modo rigoroso não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.

+ Se o modo rigoroso estiver habilitado, a divisão por zero produz um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

+ Para `SELECT`, a divisão por zero retorna `NULL`. Habilitar o modo rigoroso também produz um aviso.

* O modo rigoroso afeta se o servidor permite `'0000-00-00'` como uma data válida:

  + Se o modo rigoroso não estiver habilitado, `'0000-00-00'` é permitido e as inserções não produzem nenhum aviso.

  + Se o modo rigoroso estiver habilitado, `'0000-00-00'` não é permitido e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e as inserções produzem um aviso.

* O modo rigoroso afeta se o servidor permite datas em que a parte do ano é não nula, mas a parte do mês ou do dia é 0 (datas como `'2010-00-01'` ou `'2010-01-00'`)

  + Se o modo rigoroso não estiver habilitado, datas com partes zero são permitidas e as inserções não produzem nenhum aviso.

  + Se o modo rigoroso estiver habilitado, datas com partes zero não são permitidas e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com partes zero são inseridas como `'0000-00-00'` (que é considerada válida com `IGNORE`) e produzem um aviso.

Para mais informações sobre o modo rigoroso em relação ao `IGNORE`, consulte Comparação do Palavra-chave IGNORE e o Modo SQL Rigoroso.

O modo rigoroso afeta o tratamento da divisão por zero, datas zero e zeros em datas em conjunto com os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`.

Esta seção compara o efeito na execução da declaração do termo `IGNORE` (que degrada erros em avisos) e o modo SQL rigoroso (que eleva avisos a erros). Ela descreve quais declarações eles afetam e quais erros eles aplicam.

A tabela a seguir apresenta uma comparação resumida do comportamento das declarações quando o padrão é produzir um erro versus um aviso. Um exemplo de quando o padrão é produzir um erro é inserir um `NULL` em uma coluna `NOT NULL`. Um exemplo de quando o padrão é produzir um aviso é inserir um valor do tipo de dado errado em uma coluna (como inserir a string `'abc'` em uma coluna de inteiro).

<table summary="Comparação do comportamento das declarações quando o padrão é produzir um erro versus um aviso."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Modo Operacional</th> <th>Quando o Padrão da Declaração é Erro</th> <th>Quando o Padrão da Declaração é Aviso</th> </tr></thead><tbody><tr> <th>Sem <code>IGNORE</code> ou modo SQL rigoroso</th> <td>Erro</td> <td>Aviso</td> </tr><tr> <th>Com <code>IGNORE</code></th> <td>Aviso</td> <td>Aviso (mesmo que sem <code>IGNORE</code> ou modo SQL rigoroso)</td> </tr><tr> <th>Com modo SQL rigoroso</th> <td>Erro (mesmo que sem <code>IGNORE</code> ou modo SQL rigoroso)</td> <td>Erro</td> </tr><tr> <th>Com <code>IGNORE</code> e modo SQL rigoroso</th> <td>Aviso</td> <td>Aviso</td> </tr></tbody></table>

Uma conclusão que podemos tirar da tabela é que, quando a palavra-chave `IGNORE` e o modo SQL rigoroso estão em vigor, a `IGNORE` tem precedência. Isso significa que, embora a `IGNORE` e o modo SQL rigoroso possam ser considerados como tendo efeitos opostos no tratamento de erros, eles não se cancelam quando usados juntos.

* O Efeito da IGNORE na Execução da Instrução
* O Efeito do Modo SQL Rigoroso na Execução da Instrução

##### O Efeito da IGNORE na Execução da Instrução

Várias instruções no MySQL suportam a palavra-chave opcional `IGNORE`. Essa palavra-chave faz com que o servidor desvalorize certos tipos de erros e gere avisos em vez disso. Para uma instrução de múltiplas linhas, desvalorizar um erro para um aviso pode permitir que uma linha seja processada. Caso contrário, a `IGNORE` faz com que a instrução passe para a próxima linha em vez de abortar. (Para erros não ignoráveis, um erro ocorre independentemente da palavra-chave `IGNORE`.)

Exemplo: Se a tabela `t` tiver uma coluna de chave primária `i` contendo valores únicos, tentar inserir o mesmo valor de `i` em várias linhas normalmente produz um erro de chave duplicada:

```
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
```

Com `IGNORE`, a linha contendo a chave duplicada ainda não é inserida, mas um aviso ocorre em vez de um erro:

```
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Exemplo: Se a tabela `t2` tiver uma coluna `id` com `NOT NULL`, tentar inserir `NULL` produz um erro no modo SQL rigoroso:

```
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
mysql> SELECT * FROM t2;
+----+
| id |
+----+
|  1 |
|  0 |
|  3 |
+----+
```

Se o modo SQL não for rigoroso, a `IGNORE` faz com que o `NULL` seja inserido como o padrão implícito do colun (0 neste caso), o que permite que a linha seja tratada sem ignorá-la:

```
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
```

Essas instruções suportam a palavra-chave `IGNORE:
```
mysql> SET sql_mode = 'STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
ERROR 1366 (HY000): Incorrect integer value: 'abc' for column 'i' at row 1
```

* `CREATE TABLE ... SELECT`: O `IGNORE` não se aplica às partes `CREATE TABLE` ou `SELECT` da instrução, mas sim aos insertos na tabela de linhas geradas pela `SELECT`. As linhas que duplicam uma linha existente com um valor de chave única são descartadas.

* `DELETE`: O `IGNORE` faz com que o MySQL ignore erros durante o processo de exclusão de linhas.

* `INSERT`: Com `IGNORE`, as linhas que duplicam uma linha existente com um valor de chave única são descartadas. As linhas definidas com valores que causariam erros de conversão de dados são definidas com os valores mais próximos válidos.

  Para tabelas particionadas onde não é encontrado uma partição que corresponda a um valor dado, o `IGNORE` faz com que a operação de inserção falhe silenciosamente para linhas que contêm o valor não correspondente.

* `LOAD DATA`, `LOAD XML`: Com `IGNORE`, as linhas que duplicam uma linha existente com um valor de chave única são descartadas.

* `UPDATE`: Com `IGNORE`, as linhas para as quais conflitos de chave duplicada ocorrem com um valor de chave única não são atualizadas. As linhas atualizadas com valores que causariam erros de conversão de dados são atualizadas com os valores mais próximos válidos.

A palavra-chave `IGNORE` se aplica aos seguintes erros ignoráveis:

* `ER_BAD_NULL_ERROR`
* `ER_DUP_ENTRY`
* `ER_DUP_ENTRY_WITH_KEY_NAME`
* `ER_DUP_KEY`
* `ER_NO_PARTITION_FOR_GIVEN_VALUE`
* `ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT`
* `ER_NO_REFERENCED_ROW_2`
* `ER_ROW_DOES_NOT_MATCH_GIVEN_PARTITION_SET`
* `ER_ROW_IS_REFERENCED_2`
* `ER_SUBQUERY_NO_1_ROW`
* `ER_VIEW_CHECK_FAILED`

##### O Efeito do Modo SQL Estrito na Execução da Instrução

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. No modo SQL "estricto", o servidor converte certos avisos em erros.

Por exemplo, no modo SQL não estrito, inserir a string `'abc'` em uma coluna inteira resulta na conversão do valor para 0 e em uma mensagem de alerta:

```
ER_BAD_NULL_ERROR
ER_CUT_VALUE_GROUP_CONCAT
ER_DATA_TOO_LONG
ER_DATETIME_FUNCTION_OVERFLOW
ER_DIVISION_BY_ZERO
ER_INVALID_ARGUMENT_FOR_LOGARITHM
ER_NO_DEFAULT_FOR_FIELD
ER_NO_DEFAULT_FOR_VIEW_FIELD
ER_TOO_LONG_KEY
ER_TRUNCATED_WRONG_VALUE
ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
ER_WARN_DATA_OUT_OF_RANGE
ER_WARN_NULL_TO_NOTNULL
ER_WARN_TOO_FEW_RECORDS
ER_WRONG_ARGUMENTS
ER_WRONG_VALUE_FOR_TYPE
WARN_DATA_TRUNCATED
```

No modo SQL estrito, o valor inválido é rejeitado com um erro:



Para obter mais informações sobre as configurações possíveis da variável de sistema `sql_mode`, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

O modo SQL estrito se aplica às seguintes instruções sob condições nas quais algum valor pode estar fora de faixa ou uma linha inválida pode ser inserida ou excluída de uma tabela:

* `ALTER TABLE`
* `CREATE TABLE`
* `CREATE TABLE ... SELECT`

* `DELETE` (tanto para uma única tabela quanto para múltiplas tabelas)

* `INSERT`
* `LOAD DATA`
* `LOAD XML`
* `SELECT SLEEP()`

* `UPDATE` (tanto para uma única tabela quanto para múltiplas tabelas)

Dentro dos programas armazenados, as instruções individuais dos tipos listados acima são executadas no modo SQL estrito se o programa foi definido enquanto o modo estrito estava em vigor.

O modo SQL estrito se aplica aos seguintes erros, que representam uma classe de erros em que um valor de entrada é inválido ou está ausente. Um valor é inválido se tiver o tipo de dados errado para a coluna ou pode estar fora de faixa. Um valor está ausente se uma nova linha a ser inserida não contiver um valor para uma coluna `NOT NULL` que não tenha uma cláusula `DEFAULT` explícita em sua definição.



Nota

Como o desenvolvimento contínuo do MySQL define novos erros, pode haver erros que não estão na lista anterior aos quais o modo SQL estrito se aplica.