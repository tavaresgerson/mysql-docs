### 7.1.11 Modos SQL do Servidor

O servidor MySQL pode operar em diferentes modos SQL, e pode aplicar esses modos de forma diferente para diferentes clientes, dependendo do valor da variável do sistema `sql_mode`. Os DBAs podem definir o modo SQL global para corresponder aos requisitos operacionais do servidor do site, e cada aplicativo pode definir seu modo SQL de sessão para seus próprios requisitos.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele executa. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

- Configuração do modo SQL
- Os modos SQL mais importantes
- Lista completa de modos SQL
- Combinação de modos SQL
- Modo SQL rígido
- Comparação entre a palavra-chave IGNORE e o modo SQL estrito

Para respostas a perguntas frequentes sobre os modos SQL do servidor no MySQL, consulte a Seção A.3, MySQL 8.4 FAQ: Server SQL Mode.

Ao trabalhar com tabelas `InnoDB`, considere também a variável de sistema `innodb_strict_mode`, que permite verificações de erros adicionais para tabelas `InnoDB`.

#### Configuração do modo SQL

O modo SQL padrão no MySQL 8.4 inclui estes modos: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, e `NO_ENGINE_SUBSTITUTION`.

Para definir o modo SQL na inicialização do servidor, use a opção `--sql-mode="modes"` na linha de comando, ou `sql-mode="modes"` em um arquivo de opções como `my.cnf` (sistemas operacionais Unix) ou `my.ini` (Windows). `modes` é uma lista de diferentes modos separados por vírgulas. Para limpar o modo SQL explicitamente, defina-o em uma string vazia usando `--sql-mode=""` na linha de comando, ou `sql-mode=""` em um arquivo de opções.

::: info Note

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

Se o modo SQL difere do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opções que o servidor lê no início.

:::

Para alterar o modo SQL em tempo de execução, defina a variável de sistema global ou de sessão `sql_mode` usando uma instrução `SET`:

```
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

A definição da variável `GLOBAL` requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio `SUPER` obsoleto) e afeta a operação de todos os clientes que se conectam a partir desse momento. A definição da variável `SESSION` afeta apenas o cliente atual. Cada cliente pode alterar seu valor de sessão `sql_mode` a qualquer momento.

Para determinar a configuração global ou de sessão atual, selecione o seu valor:

```
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

Importância

\*\* Modo SQL e particionamento definido pelo usuário. \*\* Mudar o modo SQL do servidor depois de criar e inserir dados em tabelas particionadas pode causar grandes mudanças no comportamento dessas tabelas e pode levar à perda ou corrupção de dados. É altamente recomendável que você nunca mude o modo SQL depois de criar tabelas empregando particionamento definido pelo usuário.

Ao replicar tabelas particionadas, modos SQL diferentes na fonte e na réplica também podem levar a problemas. Para melhores resultados, você deve sempre usar o mesmo modo SQL do servidor na fonte e na réplica.

Para mais informações, ver secção 26.6, "Restrições e limitações à partição".

#### Os modos SQL mais importantes

Os valores mais importantes do `sql_mode` são provavelmente estes:

- `ANSI`

Este modo altera a sintaxe e o comportamento para se conformar mais de perto com o SQL padrão. É um dos modos de combinação especial listados no final desta seção.

- `STRICT_TRANS_TABLES`

Se um valor não puder ser inserido como dado em uma tabela transacional, abortar a instrução. Para uma tabela não transacional, abortar a instrução se o valor ocorrer em uma instrução de linha única ou na primeira linha de uma instrução de linha múltipla. Mais detalhes são dados mais adiante nesta seção.

- `TRADITIONAL`

Faça o MySQL se comportar como um sistema de banco de dados SQL "tradicional". Uma descrição simples deste modo é "dar um erro em vez de um aviso" ao inserir um valor incorreto em uma coluna. É um dos modos de combinação especial listados no final desta seção.

::: info Note

Com o modo `TRADITIONAL` ativado, um `INSERT` ou `UPDATE` é interrompido assim que ocorre um erro. Se você estiver usando um mecanismo de armazenamento não transacional, isso pode não ser o que você deseja porque as alterações de dados feitas antes do erro podem não ser revertidas, resultando em uma atualização parcialmente feita.

:::

Quando este manual se refere a modo rígido, significa um modo com um ou ambos os `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES` ativados.

#### Lista completa de modos SQL

A lista a seguir descreve todos os modos SQL suportados:

- `ALLOW_INVALID_DATES`

Este modo aplica-se às colunas `DATE` e `DATETIME` e não às colunas `TIMESTAMP`, que sempre requerem uma data válida.

Com `ALLOW_INVALID_DATES` desativado, o servidor exige que os valores de mês e dia sejam legais, e não apenas na faixa de 1 a 12 e 1 a 31, respectivamente. Com o modo rígido desativado, datas inválidas como `'2004-04-31'` são convertidas em `'0000-00-00'` e um aviso é gerado. Com o modo rígido habilitado, datas inválidas geram um erro. Para permitir tais datas, habilite `ALLOW_INVALID_DATES`.

- `ANSI_QUOTES`

Trate `"` como um caractere de citação de identificador (como o `` ` ``) e não como um caractere de citação de string. Você ainda pode usar `` ` `` para citar identificadores com este modo habilitado. Com `ANSI_QUOTES` habilitado, você não pode usar aspas duplas para citar strings literais porque elas são interpretadas como identificadores.

- `ERROR_FOR_DIVISION_BY_ZERO`

O `ERROR_FOR_DIVISION_BY_ZERO` afeta a manipulação da divisão por zero, o que inclui `MOD(N,0)`.

- Se este modo não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.
- Se este modo estiver habilitado, a divisão por zero insere `NULL` e produz um aviso.
- Se este modo e o modo estrito estiverem habilitados, a divisão por zero produz um erro, a menos que o `IGNORE` também seja dado. Para o `INSERT IGNORE` e o `UPDATE IGNORE`, a divisão por zero insere o `NULL` e produz um aviso.

Para `SELECT`, a divisão por zero retorna `NULL`. A habilitação de `ERROR_FOR_DIVISION_BY_ZERO` faz com que um aviso seja produzido também, independentemente de o modo estrito estar habilitado.

\[`ERROR_FOR_DIVISION_BY_ZERO`]] é depreciado. \[`ERROR_FOR_DIVISION_BY_ZERO`]] não faz parte do modo rígido, mas deve ser usado em conjunto com o modo rígido e é habilitado por padrão. Um aviso ocorre se \[`ERROR_FOR_DIVISION_BY_ZERO`]] é habilitado sem também habilitar o modo rígido ou vice-versa.

Como `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado, você deve esperar que ele seja removido em uma versão futura do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL estrito.

- `HIGH_NOT_PRECEDENCE`

A precedência do operador `NOT` é tal que expressões como `NOT a BETWEEN b AND c` são analisadas como `NOT (a BETWEEN b AND c)`.

```
mysql> SET sql_mode = '';
mysql> SELECT NOT 1 BETWEEN -5 AND 5;
        -> 0
mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
mysql> SELECT NOT 1 BETWEEN -5 AND 5;
        -> 1
```

- `IGNORE_SPACE`

Permitir espaços entre o nome de uma função e o caractere `(`. Isso faz com que os nomes de função incorporados sejam tratados como palavras reservadas. Como resultado, os identificadores que são os mesmos que os nomes de função devem ser citados como descrito na Seção 11.2, Nomes de Objetos de Esquema. Por exemplo, porque há uma função `COUNT()`, o uso de `count` como um nome de tabela na seguinte instrução causa um erro:

```
mysql> CREATE TABLE count (i INT);
ERROR 1064 (42000): You have an error in your SQL syntax
```

O nome da tabela deve ser citado:

```
mysql> CREATE TABLE `count` (i INT);
Query OK, 0 rows affected (0.00 sec)
```

O `IGNORE_SPACE` modo SQL aplica-se a funções embutidas, não a funções carregáveis ou funções armazenadas. É sempre permitido ter espaços após uma função carregável ou nome de função armazenada, independentemente de `IGNORE_SPACE` estar habilitado.

Para uma discussão mais aprofundada do `IGNORE_SPACE`, consulte a Seção 11.2.5, Function Name Parsing and Resolution.

- `NO_AUTO_VALUE_ON_ZERO`

  O `NO_AUTO_VALUE_ON_ZERO` afeta o manuseio das colunas `AUTO_INCREMENT`. Normalmente, você gera o próximo número de seqüência para a coluna inserindo `NULL` ou `0` nele. O `NO_AUTO_VALUE_ON_ZERO` suprime esse comportamento para o `0` de modo que apenas o `NULL` gera o próximo número de seqüência.

Este modo pode ser útil se `0` foi armazenado na coluna `AUTO_INCREMENT` de uma tabela. (Armazenar `0` não é uma prática recomendada, a propósito.) Por exemplo, se você despejar a tabela com `mysqldump` e depois recarregar, o MySQL normalmente gera novos números de sequência quando encontra os valores `0`, resultando em uma tabela com conteúdos diferentes do que foi despejado. Ativar `NO_AUTO_VALUE_ON_ZERO` antes de recarregar o arquivo de despejo resolve este problema. Por esta razão, **mysldqump** inclui automaticamente em sua saída uma instrução que habilita `NO_AUTO_VALUE_ON_ZERO`.

- `NO_BACKSLASH_ESCAPES`

A habilitação deste modo desativa o uso do caractere backslash (`\`) como um caractere de escape dentro de strings e identificadores. Com este modo habilitado, o backslash se torna um caractere comum como qualquer outro, e a sequência de escape padrão para expressões `LIKE` é alterada para que nenhum caractere de escape seja usado.

- `NO_DIR_IN_CREATE`

Ao criar uma tabela, ignore todas as diretrizes `INDEX DIRECTORY` e `DATA DIRECTORY`.

- `NO_ENGINE_SUBSTITUTION`

Controle a substituição automática do motor de armazenamento padrão quando uma instrução como `CREATE TABLE` ou `ALTER TABLE` especifica um motor de armazenamento que está desativado ou não compilado.

Por padrão, `NO_ENGINE_SUBSTITUTION` está habilitado.

Uma vez que os motores de armazenamento podem ser conectados durante a execução, os motores indisponíveis são tratados da mesma forma:

Com `NO_ENGINE_SUBSTITUTION` desativado, para `CREATE TABLE` o motor padrão é usado e um aviso ocorre se o motor desejado não estiver disponível. Para `ALTER TABLE`, um aviso ocorre e a tabela não é alterada.

Com `NO_ENGINE_SUBSTITUTION` habilitado, ocorre um erro e a tabela não é criada ou alterada se o motor desejado não estiver disponível.

- `NO_UNSIGNED_SUBTRACTION`

A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado fosse negativo, um erro resulta:

```
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT CAST(0 AS UNSIGNED) - 1;
ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
```

Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado é negativo:

```
mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
mysql> SELECT CAST(0 AS UNSIGNED) - 1;
+-------------------------+
| CAST(0 AS UNSIGNED) - 1 |
+-------------------------+
|                      -1 |
+-------------------------+
```

Se o resultado de tal operação é usado para atualizar uma coluna inteira `UNSIGNED`, o resultado é cortado para o valor máximo para o tipo de coluna, ou cortado para 0 se `NO_UNSIGNED_SUBTRACTION` estiver habilitado. Com o modo SQL estrito habilitado, ocorre um erro e a coluna permanece inalterada.

Quando `NO_UNSIGNED_SUBTRACTION` está habilitado, o resultado da subtração é assinado, *mesmo que qualquer operando não esteja assinado*. Por exemplo, compare o tipo da coluna `c2` na tabela `t1` com o da coluna `c2` na tabela `t2`:

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

Isso significa que o `BIGINT UNSIGNED` não é 100% utilizável em todos os contextos.

- `NO_ZERO_DATE`

O `NO_ZERO_DATE` modo afeta se o servidor permite `'0000-00-00'` como uma data válida. Seu efeito também depende se o modo SQL estrito está habilitado.

- Se este modo não estiver habilitado, `'0000-00-00'` é permitido e as inserções não produzem nenhum aviso.
- Se este modo estiver habilitado, o `'0000-00-00'` é permitido e as inserções produzem um aviso.
- Se este modo e o modo estrito estiverem ativados, `'0000-00-00'` não é permitido e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e as inserções produzem um aviso.

\[`NO_ZERO_DATE`]] é depreciado. \[`NO_ZERO_DATE`]] não faz parte do modo rígido, mas deve ser usado em conjunto com o modo rígido e é habilitado por padrão. Um aviso ocorre se \[`NO_ZERO_DATE`]] é habilitado sem também habilitar o modo rígido ou vice-versa.

Como `NO_ZERO_DATE` está desatualizado, você deve esperar que ele seja removido em uma versão futura do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL estrito.

- `NO_ZERO_IN_DATE`

O `NO_ZERO_IN_DATE` afeta se o servidor permite datas em que a parte do ano é diferente de zero, mas a parte do mês ou dia é 0. (Este modo afeta datas como `'2010-00-01'` ou `'2010-01-00'`, mas não `'0000-00-00'`.

- Se este modo não estiver ativado, são permitidas datas com partes nulas e os inseridos não produzem aviso.
- Se este modo estiver ativado, as datas com partes zero são inseridas como `'0000-00-00'` e produzem um aviso.
- Se este modo e o modo estrito estiverem habilitados, as datas com partes zero não são permitidas e as inserções produzem um erro, a menos que `IGNORE` também seja dado. Para `INSERT IGNORE` e `UPDATE IGNORE`, as datas com partes zero são inseridas como `'0000-00-00'` e produzem um aviso.

\[`NO_ZERO_IN_DATE`]] é depreciado. \[`NO_ZERO_IN_DATE`]] não faz parte do modo rígido, mas deve ser usado em conjunto com o modo rígido e é habilitado por padrão. Um aviso ocorre se \[`NO_ZERO_IN_DATE`]] é habilitado sem também habilitar o modo rígido ou vice-versa.

Como `NO_ZERO_IN_DATE` está desatualizado, você deve esperar que ele seja removido em uma versão futura do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL estrito.

- `ONLY_FULL_GROUP_BY`

Rejeitar consultas para as quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não são nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes (determinadas exclusivamente por) colunas `GROUP BY`.

Uma extensão do MySQL para o SQL padrão permite referências na cláusula `HAVING` para expressões alias na lista de seleção. A cláusula `HAVING` pode se referir a aliases independentemente de `ONLY_FULL_GROUP_BY` estar habilitado.

Para discussão e exemplos adicionais, consulte a Seção 14.19.3, MySQL Handling of GROUP BY.

- `PAD_CHAR_TO_FULL_LENGTH`

Por padrão, os espaços de rastreamento são recortados a partir dos valores da coluna `CHAR` na recuperação. Se `PAD_CHAR_TO_FULL_LENGTH` estiver habilitado, o recorte não ocorre e os valores de `CHAR` recuperados são preenchidos em todo o seu comprimento. Este modo não se aplica às colunas `VARCHAR`, para as quais os espaços de rastreamento são mantidos na recuperação.

::: info Note

`PAD_CHAR_TO_FULL_LENGTH` é depreciado. Espera-se que seja removido em uma versão futura do MySQL.

:::

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

- `PIPES_AS_CONCAT`

Trate `||` como um operador de concatenação de cadeia (o mesmo que `CONCAT()`) e não como um sinônimo de `OR`.

- `REAL_AS_FLOAT`

Por padrão, o MySQL trata o `REAL` como um sinônimo de `DOUBLE` - FLOAT, DOUBLE".

- `STRICT_ALL_TABLES`

Ativar o modo SQL rígido para todos os motores de armazenamento. Valores de dados inválidos são rejeitados. Para detalhes, consulte o Modo SQL rígido.

- `STRICT_TRANS_TABLES`

Ative o modo SQL rigoroso para mecanismos de armazenamento transacionais e, quando possível, para mecanismos de armazenamento não transacionais.

- `TIME_TRUNCATE_FRACTIONAL`

Controle se o arredondamento ou o truncamento ocorrem ao inserir um valor \[`TIME`], \[`DATE`], ou \[`TIMESTAMP`] com uma fração de segundos em uma coluna com o mesmo tipo, mas menos dígitos fracionários. O comportamento padrão é usar o arredondamento. Se este modo estiver habilitado, o truncamento ocorre em vez disso. A seguinte sequência de instruções ilustra a diferença:

```
CREATE TABLE t (id INT, tval TIME(1));
SET sql_mode='';
INSERT INTO t (id, tval) VALUES(1, 1.55);
SET sql_mode='TIME_TRUNCATE_FRACTIONAL';
INSERT INTO t (id, tval) VALUES(2, 1.55);
```

O conteúdo da tabela resultante é o seguinte, onde o primeiro valor foi sujeito a arredondamento e o segundo a truncamento:

```
mysql> SELECT id, tval FROM t ORDER BY id;
+------+------------+
| id   | tval       |
+------+------------+
|    1 | 00:00:01.6 |
|    2 | 00:00:01.5 |
+------+------------+
```

Ver também a secção 13.2.6, "Frações de segundos em valores de tempo".

#### Combinação de modos SQL

Os seguintes modos especiais são fornecidos como abreviação para combinações de valores de modos da lista anterior.

- `ANSI`

Equivalente a `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, e `ONLY_FULL_GROUP_BY`.

O modo `ANSI` também faz com que o servidor retorne um erro para consultas em que uma função de conjunto `S` com uma referência externa `S(outer_ref)` não pode ser agregada na consulta externa contra a qual a referência externa foi resolvida. Esta é uma consulta:

```
SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
```

Aqui, `MAX(t1.b)` não pode ser agregado na consulta externa porque aparece na cláusula `WHERE` dessa consulta. O SQL padrão requer um erro nesta situação. Se o modo `ANSI` não estiver habilitado, o servidor trata `S(outer_ref)` em tais consultas da mesma maneira que interpretaria `S(const)`.

Ver Secção 1.7, "Conformidade com os padrões MySQL".

- `TRADITIONAL`

  `TRADITIONAL` é equivalente a `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, e `NO_ENGINE_SUBSTITUTION`.

#### Modo SQL rígido

O modo rígido controla como o MySQL lida com valores inválidos ou ausentes em instruções de alteração de dados, como `INSERT` ou `UPDATE`. Um valor pode ser inválido por várias razões. Por exemplo, pode ter o tipo de dados errado para a coluna, ou pode estar fora do alcance. Um valor está faltando quando uma nova linha a ser inserida não contém um valor para uma coluna não-`NULL` que não tem uma cláusula `DEFAULT` explícita em sua definição. (Para uma coluna `NULL`, `NULL` é inserido se o valor estiver faltando.) O modo rígido também afeta instruções DDL, como `CREATE TABLE`.

Se o modo rígido não estiver em vigor, o MySQL inserirá valores ajustados para valores inválidos ou ausentes e produzirá avisos (ver Seção 15.7.7.42, SHOW WARNINGS Statement).

Para instruções como `SELECT` que não alteram os dados, os valores inválidos geram um aviso no modo rigoroso, não um erro.

O modo rígido produz um erro para tentativas de criar uma chave que exceda o comprimento máximo da chave. Quando o modo rígido não está habilitado, isso resulta em um aviso e truncamento da chave para o comprimento máximo da chave.

O modo estrito não afeta se as restrições de chave externa são verificadas. `foreign_key_checks` pode ser usado para isso. (Veja Seção 7.1.8, Variaveis do Sistema do Servidor.)

O modo SQL estrito está em vigor se `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` estiver ativado, embora os efeitos desses modos sejam um pouco diferentes:

- Para tabelas transacionais, ocorre um erro para valores inválidos ou ausentes em uma instrução de alteração de dados quando `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` está habilitado. A instrução é abortada e revertida.
- Para tabelas não transacionais, o comportamento é o mesmo para ambos os modos se o valor ruim ocorrer na primeira linha a ser inserida ou atualizada: A instrução é abortada e a tabela permanece inalterada. Se a instrução inserir ou modificar várias linhas e o valor ruim ocorrer na segunda linha ou posterior, o resultado depende de qual modo rígido está habilitado:

  - Para `STRICT_ALL_TABLES`, o MySQL retorna um erro e ignora o resto das linhas. No entanto, como as linhas anteriores foram inseridas ou atualizadas, o resultado é uma atualização parcial. Para evitar isso, use instruções de linha única, que podem ser abortadas sem alterar a tabela.
  - Para `STRICT_TRANS_TABLES`, o MySQL converte um valor inválido para o valor válido mais próximo para a coluna e insere o valor ajustado. Se um valor estiver faltando, o MySQL insere o valor padrão implícito para o tipo de dados da coluna. Em ambos os casos, o MySQL gera um aviso em vez de um erro e continua a processar a instrução.

O modo rigoroso afeta o manuseio da divisão por zero, datas zero e zeros em datas da seguinte forma:

- O modo rigoroso afeta o manuseio da divisão por zero, que inclui `MOD(N,0)`:

  Para as operações de alteração de dados (`INSERT` e `UPDATE`):

  - Se o modo estrito não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.
  - Se o modo estrito estiver ativado, a divisão por zero produz um erro, a menos que o `IGNORE` também seja dado. Para o `INSERT IGNORE` e o `UPDATE IGNORE`, a divisão por zero insere o `NULL` e produz um aviso.

  Para `SELECT`, a divisão por zero retorna `NULL`.
- O modo rigoroso afeta se o servidor permite `'0000-00-00'` como uma data válida:

  - Se o modo estrito não estiver habilitado, o `'0000-00-00'` é permitido e as inserções não produzem nenhum aviso.
  - Se o modo rígido estiver ativado, `'0000-00-00'` não é permitido e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e as inserções produzem um aviso.
- O modo estrito afeta se o servidor permite datas nas quais a parte do ano é diferente de zero, mas a parte do mês ou dia é 0 (datas como `'2010-00-01'` ou `'2010-01-00'`):

  - Se o modo estrito não estiver habilitado, são permitidas datas com partes nulas e as inserções não produzem nenhum aviso.
  - Se o modo rígido estiver ativado, as datas com partes zero não são permitidas e as inserções produzem um erro, a menos que `IGNORE` também seja dado. Para `INSERT IGNORE` e `UPDATE IGNORE`, as datas com partes zero são inseridas como `'0000-00-00'` (que é considerado válido com `IGNORE`) e produzem um aviso.

Para mais informações sobre o modo rígido em relação ao `IGNORE`, consulte Comparação da palavra-chave IGNORE e o modo SQL rígido.

O modo rigoroso afeta o manuseio da divisão por zero, datas zero e zeros em datas em conjunto com os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`.

#### Comparação entre a palavra-chave IGNORE e o modo SQL estrito

Esta seção compara o efeito sobre a execução de instruções da palavra-chave `IGNORE` (que degrada erros para avisos) e o modo SQL estrito (que atualiza avisos para erros).

A tabela a seguir apresenta uma comparação resumida do comportamento da instrução quando o padrão é produzir um erro versus um aviso. Um exemplo de quando o padrão é produzir um erro é inserir um `NULL` em uma coluna `NOT NULL`. Um exemplo de quando o padrão é produzir um aviso é inserir um valor do tipo de dados errado em uma coluna (como inserir a string `'abc'` em uma coluna inteira).

<table><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Modo de operação</th> <th scope="col">Quando o padrão da instrução é erro</th> <th scope="col">Quando o padrão da declaração é um aviso</th> </tr></thead><tbody><tr> <th>Sem [[<code>IGNORE</code>]] ou modo SQL estrito</th> <td>Erro</td> <td>Advertência</td> </tr><tr> <th>Com [[<code>IGNORE</code>]]</th> <td>Advertência</td> <td>Aviso (igual que sem [[<code>IGNORE</code>]] ou modo SQL estrito)</td> </tr><tr> <th>Com modo SQL estrito</th> <td>Erro (igual a sem [[<code>IGNORE</code>]] ou modo SQL estrito)</td> <td>Erro</td> </tr><tr> <th>Com [[<code>IGNORE</code>]] e modo SQL estrito</th> <td>Advertência</td> <td>Advertência</td> </tr></tbody></table>

Uma conclusão a tirar da tabela é que, quando a palavra-chave `IGNORE` e o modo SQL estrito estão ambos em vigor, o `IGNORE` tem precedência. Isso significa que, embora `IGNORE` e o modo SQL estrito possam ser considerados como tendo efeitos opostos no tratamento de erros, eles não se cancelam quando usados juntos.

- Efeito do IGNORE na execução de declarações
- O Efeito do Modo SQL Estricto na Execução de Declarações

##### Efeito do IGNORE na execução de declarações

Várias instruções no MySQL suportam uma palavra-chave `IGNORE` opcional. Esta palavra-chave faz com que o servidor reduza certos tipos de erros e, em vez disso, gere avisos. Para uma instrução de várias linhas, o rebaixamento de um erro para um aviso pode permitir que uma linha seja processada. Caso contrário, `IGNORE` faz com que a instrução salte para a próxima linha em vez de abortar.

Exemplo: Se a tabela `t` tem uma coluna de chave primária `i` contendo valores únicos, tentar inserir o mesmo valor de `i` em várias linhas normalmente produz um erro de chave duplicada:

```
mysql> CREATE TABLE t (i INT NOT NULL PRIMARY KEY);
mysql> INSERT INTO t (i) VALUES(1),(1);
ERROR 1062 (23000): Duplicate entry '1' for key 't.PRIMARY'
```

Com `IGNORE`, a linha contendo a chave duplicada ainda não é inserida, mas um aviso ocorre em vez de um erro:

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

Exemplo: Se a tabela `t2` tem uma coluna `NOT NULL` `id`, tentar inserir `NULL` produz um erro no modo SQL estrito:

```
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Se o modo SQL não for rigoroso, `IGNORE` faz com que o `NULL` seja inserido como o padrão implícito da coluna (0 neste caso), o que permite que a linha seja manipulada sem ignorá-la:

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

Estas declarações suportam a palavra-chave:

- `CREATE TABLE ... SELECT`: `IGNORE` não se aplica às partes `CREATE TABLE` ou `SELECT` da instrução, mas às inserções na tabela de linhas produzidas pelo `SELECT`.
- `DELETE`: `IGNORE` faz com que o MySQL ignore erros durante o processo de exclusão de linhas.
- `INSERT`: Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave única são descartadas. Linhas definidas para valores que causariam erros de conversão de dados são definidas para os valores válidos mais próximos.

Para tabelas particionadas onde nenhuma partição correspondente a um determinado valor é encontrada, `IGNORE` faz com que a operação de inserção falhe silenciosamente para linhas contendo o valor não correspondido.

- `LOAD DATA`, `LOAD XML`: Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave exclusivo são descartadas.
- `UPDATE`: Com `IGNORE`, linhas para as quais ocorrem conflitos de chaves duplicadas em um valor de chave exclusivo não são atualizadas. Linhas atualizadas para valores que causariam erros de conversão de dados são atualizadas para os valores válidos mais próximos.

A palavra-chave `IGNORE` aplica-se aos seguintes erros ignoráveis:

- `ER_BAD_NULL_ERROR`
- `ER_DUP_ENTRY`
- `ER_DUP_ENTRY_WITH_KEY_NAME`
- `ER_DUP_KEY`
- `ER_NO_PARTITION_FOR_GIVEN_VALUE`
- `ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT`
- `ER_NO_REFERENCED_ROW_2`
- `ER_ROW_DOES_NOT_MATCH_GIVEN_PARTITION_SET`
- `ER_ROW_IS_REFERENCED_2`
- `ER_SUBQUERY_NO_1_ROW`
- `ER_VIEW_CHECK_FAILED`

##### O Efeito do Modo SQL Estricto na Execução de Declarações

O servidor MySQL pode operar em diferentes modos SQL, e pode aplicar esses modos de forma diferente para diferentes clientes, dependendo do valor da variável do sistema `sql_mode`. No modo SQL strict, o servidor atualiza certos avisos para erros.

Por exemplo, no modo SQL não rígido, inserir a string `'abc'` em uma coluna inteira resulta na conversão do valor para 0 e um aviso:

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

No modo SQL estrito, o valor inválido é rejeitado com um erro:

```
mysql> SET sql_mode = 'STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
ERROR 1366 (HY000): Incorrect integer value: 'abc' for column 'i' at row 1
```

Para obter mais informações sobre as possíveis configurações da variável de sistema `sql_mode`, consulte a Seção 7.1.11, "Server SQL Modes".

O modo SQL rigoroso aplica-se às seguintes instruções sob condições em que algum valor pode estar fora do intervalo ou uma linha inválida é inserida ou excluída de uma tabela:

- `ALTER TABLE`
- `CREATE TABLE`
- `CREATE TABLE ... SELECT`
- `DELETE` (tanto tabela única como tabela múltipla)
- `INSERT`
- `LOAD DATA`
- `LOAD XML`
- `SELECT SLEEP()`
- `UPDATE` (tanto tabela única como tabela múltipla)

Dentro de programas armazenados, instruções individuais dos tipos listados apenas executar no modo SQL estrito se o programa foi definido enquanto o modo estrito estava em vigor.

O modo SQL rigoroso aplica-se aos seguintes erros, que representam uma classe de erros em que um valor de entrada é inválido ou ausente. Um valor é inválido se tiver o tipo de dados errado para a coluna ou pode estar fora do intervalo. Um valor está faltando se uma nova linha a ser inserida não contiver um valor para uma coluna `NOT NULL` que não tenha uma cláusula `DEFAULT` explícita em sua definição.

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

::: info Note

Como o desenvolvimento contínuo do MySQL define novos erros, pode haver erros não na lista anterior aos quais o modo SQL estrito se aplica.

:::
