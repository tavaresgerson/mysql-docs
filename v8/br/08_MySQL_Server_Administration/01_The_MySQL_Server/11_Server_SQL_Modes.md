### 7.1.11 Modos do SQL do servidor

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender às necessidades do servidor do site, e cada aplicativo pode definir seu próprio modo de sessão SQL.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

- Definindo o Modo SQL
- Os modos SQL mais importantes
- Lista completa dos modos SQL
- Modos de combinação SQL
- Modo SQL rigoroso
- Comparação do Palavra-chave IGNORE e Modo SQL Estrito

Para respostas a perguntas frequentemente feitas sobre os modos SQL do servidor no MySQL, consulte a Seção A.3, “Perguntas Frequentes do MySQL 8.0: Modo SQL do Servidor”.

Ao trabalhar com tabelas `InnoDB`, considere também a variável de sistema `innodb_strict_mode`. Ela permite verificações de erro adicionais para tabelas `InnoDB`.

#### Definindo o Modo SQL

O modo SQL padrão no MySQL 8.0 inclui esses modos: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO` e `NO_ENGINE_SUBSTITUTION`.

Para definir o modo SQL na inicialização do servidor, use a opção `--sql-mode="modes"` na linha de comando ou `sql-mode="modes"` em um arquivo de opções, como `my.cnf` (sistemas operacionais Unix) ou `my.ini` (Windows). `modes` é uma lista de diferentes modos separados por vírgulas. Para limpar explicitamente o modo SQL, defina-o como uma string vazia usando `--sql-mode=""` na linha de comando ou `sql-mode=""` em um arquivo de opções.

Nota

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opções que o servidor lê ao iniciar.

Para alterar o modo SQL em tempo de execução, defina a variável de sistema global ou de sessão `sql_mode` usando uma instrução `SET`:

```
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

Definir a variável `GLOBAL` requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`) e afeta o funcionamento de todos os clientes que se conectam a partir desse momento. Definir a variável `SESSION` afeta apenas o cliente atual. Cada cliente pode alterar o valor da sessão `sql_mode` a qualquer momento.

Para determinar o valor atual do ajuste global ou de sessão `sql_mode`, selecione seu valor:

```
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

Importante

**Modo SQL e particionamento definido pelo usuário.** Mudar o modo SQL do servidor após a criação e inserção de dados em tabelas particionadas pode causar mudanças significativas no comportamento dessas tabelas e pode levar à perda ou corrupção de dados. É altamente recomendável que você nunca mude o modo SQL uma vez que tenha criado tabelas que utilizam particionamento definido pelo usuário.

Ao replicar tabelas particionadas, modos SQL diferentes no banco de dados fonte e na replica também podem causar problemas. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor no banco de dados fonte e na replica.

Para obter mais informações, consulte a Seção 26.6, “Restrições e Limitações de Partição”.

#### Os modos SQL mais importantes

Os valores mais importantes do `sql_mode` são provavelmente estes:

- `ANSI`

  Esse modo altera a sintaxe e o comportamento para se adequar mais ao SQL padrão. É um dos modos de combinação especiais listados no final desta seção.

- `STRICT_TRANS_TABLES`

  Se um valor não puder ser inserido conforme especificado em uma tabela transacional, interrompa a instrução. Para uma tabela não transacional, interrompa a instrução se o valor ocorrer em uma instrução de uma única linha ou na primeira linha de uma instrução de várias linhas. Mais detalhes serão fornecidos mais adiante nesta seção.

- `TRADITIONAL`

  Faça o MySQL se comportar como um sistema de banco de dados SQL “tradicional”. Uma descrição simples desse modo é “dar um erro em vez de um aviso” ao inserir um valor incorreto em uma coluna. É um dos modos de combinação especiais listados no final desta seção.

  Nota

  Com o modo `TRADITIONAL` ativado, um `INSERT` ou `UPDATE` é interrompido assim que ocorre um erro. Se você estiver usando um motor de armazenamento não transacional, isso pode não ser o que você deseja, pois as alterações de dados feitas antes do erro podem não ser revertidas, resultando em uma atualização "parcialmente concluída".

Quando este manual se refere ao "modo estrito", ele significa um modo com `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES` habilitado ou ambos.

#### Lista completa dos modos SQL

A lista a seguir descreve todos os modos de SQL suportados:

- `ALLOW_INVALID_DATES`

  Não realize verificações completas das datas. Verifique apenas que o mês esteja no intervalo de 1 a 12 e o dia no intervalo de 1 a 31. Isso pode ser útil para aplicações web que obtêm ano, mês e dia em três campos diferentes e armazenam exatamente o que o usuário inseriu, sem validação de data. Esse modo se aplica às colunas `DATE` e `DATETIME`. Não se aplica às colunas `TIMESTAMP`, que sempre exigem uma data válida.

  Com `ALLOW_INVALID_DATES` desativado, o servidor exige que os valores de mês e dia sejam válidos e não apenas dentro do intervalo de 1 a 12 e 1 a 31, respectivamente. Com o modo rigoroso desativado, datas inválidas como `'2004-04-31'` são convertidas para `'0000-00-00'` e um aviso é gerado. Com o modo rigoroso ativado, datas inválidas geram um erro. Para permitir tais datas, ative `ALLOW_INVALID_DATES`.

- `ANSI_QUOTES`

  Trate `"` como um caractere de citação de identificador (como o caractere de citação `` ` ``) e não como um caractere de citação de string. Você ainda pode usar `` ` `` para citar identificadores com este modo ativado. Com `ANSI_QUOTES` ativado, você não pode usar aspas duplas para citar strings literais, pois elas são interpretadas como identificadores.

- `ERROR_FOR_DIVISION_BY_ZERO`

  O modo `ERROR_FOR_DIVISION_BY_ZERO` afeta o tratamento da divisão por zero, o que inclui `MOD(N,0)`. Para operações de alteração de dados (`INSERT`, `UPDATE`), seu efeito também depende se o modo SQL rigoroso está habilitado.

  - Se esse modo não estiver habilitado, a divisão por zero insere `NULL` e não gera nenhum aviso.

  - Se este modo estiver ativado, a divisão por zero insere `NULL` e gera uma mensagem de alerta.

  - Se este modo e o modo estrito estiverem ativados, a divisão por zero produzirá um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

  Para `SELECT`, a divisão por zero retorna `NULL`. Ativação de `ERROR_FOR_DIVISION_BY_ZERO` também gera uma mensagem de aviso, independentemente de o modo estrito estar ativado.

  `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado. `ERROR_FOR_DIVISION_BY_ZERO` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `ERROR_FOR_DIVISION_BY_ZERO` for ativado sem ativar também o modo estrito ou vice-versa.

  Como o `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

- `HIGH_NOT_PRECEDENCE`

  A precedência do operador `NOT` é tal que expressões como `NOT a BETWEEN b AND c` são analisadas como `NOT (a BETWEEN b AND c)`. Em algumas versões mais antigas do MySQL, a expressão era analisada como `(NOT a) BETWEEN b AND c`. O comportamento antigo de precedência mais alta pode ser obtido ao habilitar o modo SQL `HIGH_NOT_PRECEDENCE`.

  ```
  mysql> SET sql_mode = '';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 0
  mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 1
  ```

- `IGNORE_SPACE`

  Permita espaços entre o nome de uma função e o caractere `(`. Isso faz com que os nomes de funções embutidas sejam tratados como palavras reservadas. Como resultado, identificadores que são iguais aos nomes de funções devem ser citados conforme descrito na Seção 11.2, “Nomes de Objetos de Esquema”. Por exemplo, porque existe uma função `COUNT()`, o uso de `count` como nome de tabela na seguinte declaração causa um erro:

  ```
  mysql> CREATE TABLE count (i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax
  ```

  O nome da tabela deve ser citado:

  ```
  mysql> CREATE TABLE `count` (i INT);
  Query OK, 0 rows affected (0.00 sec)
  ```

  O modo SQL `IGNORE_SPACE` se aplica a funções embutidas, não a funções carregáveis ou funções armazenadas. É sempre permitido ter espaços após o nome de uma função carregável ou armazenada, independentemente de `IGNORE_SPACE` estar habilitado.

  Para uma discussão mais aprofundada sobre `IGNORE_SPACE`, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Função”.

- `NO_AUTO_VALUE_ON_ZERO`

  `NO_AUTO_VALUE_ON_ZERO` afeta o gerenciamento das colunas `AUTO_INCREMENT`. Normalmente, você gera o próximo número de sequência para a coluna inserindo `NULL` ou `0` nela. `NO_AUTO_VALUE_ON_ZERO` suprime esse comportamento para `0`, de modo que apenas `NULL` gere o próximo número de sequência.

  Este modo pode ser útil se `0` tiver sido armazenado na coluna `AUTO_INCREMENT` de uma tabela. (Por sinal, armazenar `0` não é uma prática recomendada.) Por exemplo, se você fazer o dump da tabela com **mysqldump** e depois recarregar, o MySQL normalmente gera novos números de sequência quando encontra os valores de `0`, resultando em uma tabela com conteúdo diferente do que foi dumpado. Ativação de `NO_AUTO_VALUE_ON_ZERO` antes de recarregar o arquivo de dump resolve esse problema. Por essa razão, **mysqldump** inclui automaticamente em sua saída uma declaração que habilita `NO_AUTO_VALUE_ON_ZERO`.

- `NO_BACKSLASH_ESCAPES`

  Ativação deste modo desativa o uso do caractere barra invertida (`\`) como caractere de escape dentro de strings e identificadores. Com este modo ativado, a barra invertida se torna um caractere comum como qualquer outro, e a sequência de escape padrão para expressões `LIKE` é alterada para que nenhum caractere de escape seja usado.

- `NO_DIR_IN_CREATE`

  Ao criar uma tabela, ignore todas as diretivas `INDEX DIRECTORY` e `DATA DIRECTORY`. Esta opção é útil em servidores replicados.

- `NO_ENGINE_SUBSTITUTION`

  Controle a substituição automática do motor de armazenamento padrão quando uma declaração como `CREATE TABLE` ou `ALTER TABLE` especifica um motor de armazenamento desativado ou não compilado.

  Por padrão, `NO_ENGINE_SUBSTITUTION` está habilitado.

  Como os motores de armazenamento podem ser plugáveis em tempo de execução, os motores indisponíveis são tratados da mesma maneira:

  Com `NO_ENGINE_SUBSTITUTION` desativado, para `CREATE TABLE`, o motor padrão é usado e uma mensagem de aviso é exibida se o motor desejado estiver indisponível. Para `ALTER TABLE`, uma mensagem de aviso é exibida e a tabela não é alterada.

  Com o `NO_ENGINE_SUBSTITUTION` ativado, ocorre um erro e a tabela não é criada ou alterada se o motor desejado estiver indisponível.

- `NO_UNSIGNED_SUBTRACTION`

  A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado, de outra forma, fosse negativo, ocorreria um erro:

  ```
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
  ```

  Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver ativado, o resultado será negativo:

  ```
  mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  +-------------------------+
  | CAST(0 AS UNSIGNED) - 1 |
  +-------------------------+
  |                      -1 |
  +-------------------------+
  ```

  Se o resultado de uma operação for usado para atualizar uma coluna inteira `UNSIGNED`, o resultado é limitado ao valor máximo do tipo da coluna ou limitado a 0 se `NO_UNSIGNED_SUBTRACTION` estiver habilitado. Com o modo SQL rigoroso habilitado, ocorre um erro e a coluna permanece inalterada.

  Quando o `NO_UNSIGNED_SUBTRACTION` está ativado, o resultado da subtração é assinado, *mesmo que qualquer operando seja não assinado*. Por exemplo, compare o tipo da coluna `c2` na tabela `t1` com o da coluna `c2` na tabela `t2`:

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

  Isso significa que `BIGINT UNSIGNED` não é 100% utilizável em todos os contextos. Veja a Seção 14.10, “Funções e Operadores de Lançamento”.

- `NO_ZERO_DATE`

  O modo `NO_ZERO_DATE` afeta se o servidor permite `'0000-00-00'` como uma data válida. Seu efeito também depende se o modo SQL rigoroso está habilitado.

  - Se esse modo não estiver habilitado, `'0000-00-00'` é permitido e os produtos sem aviso são inseridos.

  - Se este modo estiver ativado, `'0000-00-00'` é permitido e os produtos com esse código geram uma mensagem de alerta.

  - Se este modo e o modo estrito estiverem habilitados, o `'0000-00-00'` não é permitido e os insertos geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, o `'0000-00-00'` é permitido e os insertos geram uma mensagem de alerta.

  `NO_ZERO_DATE` está desatualizado. `NO_ZERO_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `NO_ZERO_DATE` for ativado sem ativar também o modo estrito ou vice-versa.

  Como o `NO_ZERO_DATE` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

- `NO_ZERO_IN_DATE`

  O modo `NO_ZERO_IN_DATE` afeta se o servidor permite datas em que a parte do ano é diferente de zero, mas a parte do mês ou do dia é 0. (Esse modo afeta datas como `'2010-00-01'` ou `'2010-01-00'`, mas não `'0000-00-00'`. Para controlar se o servidor permite `'0000-00-00'`, use o modo `NO_ZERO_DATE`. O efeito de `NO_ZERO_IN_DATE` também depende se o modo SQL rigoroso está ativado.)

  - Se esse modo não estiver habilitado, datas com zero partes são permitidas e os insertos não produzem nenhum aviso.

  - Se este modo estiver ativado, as datas com zero partes serão inseridas como `'0000-00-00'` e gerará um aviso.

  - Se este modo e o modo estrito estiverem ativados, datas com zero partes não são permitidas e os insertos geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com zero partes são inseridas como `'0000-00-00'` e geram uma mensagem de aviso.

  `NO_ZERO_IN_DATE` está desatualizado. `NO_ZERO_IN_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `NO_ZERO_IN_DATE` for ativado sem ativar também o modo estrito ou vice-versa.

  Como o `NO_ZERO_IN_DATE` está desatualizado, você deve esperar que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

- `ONLY_FULL_GROUP_BY`

  Rejeitar consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não estão nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes (determinadas de forma única) das colunas `GROUP BY`.

  Uma extensão do MySQL para o SQL padrão permite referências em cláusulas `HAVING` a expressões aliadas na lista de seleção. A cláusula `HAVING` pode referenciar aliases, independentemente de `ONLY_FULL_GROUP_BY` estar habilitado ou

  Para discussões adicionais e exemplos, consulte a Seção 14.19.3, “Manejo do MySQL do GROUP BY”.

- `PAD_CHAR_TO_FULL_LENGTH`

  Por padrão, os espaços finais são removidos dos valores da coluna `CHAR` durante a recuperação. Se `PAD_CHAR_TO_FULL_LENGTH` estiver ativado, o corte não ocorre e os valores recuperados de `CHAR` são preenchidos até o comprimento total. Esse modo não se aplica às colunas `VARCHAR`, para as quais os espaços finais são mantidos durante a recuperação.

  Nota

  A partir do MySQL 8.0.13, `PAD_CHAR_TO_FULL_LENGTH` está desatualizado. Espere que ele seja removido em uma versão futura do MySQL.

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

  Trate `||` como um operador de concatenação de strings (mesmo que `CONCAT()`) e não como um sinônimo de `OR`.

- `REAL_AS_FLOAT`

  Trate `REAL` - FLOAT, DOUBLE") como sinônimo de `FLOAT` - FLOAT, DOUBLE"). Por padrão, o MySQL trata `REAL` - FLOAT, DOUBLE") como sinônimo de `DOUBLE` - FLOAT, DOUBLE").

- `STRICT_ALL_TABLES`

  Ative o modo SQL rigoroso para todos os motores de armazenamento. Valores de dados inválidos são rejeitados. Para obter detalhes, consulte o modo SQL rigoroso.

- `STRICT_TRANS_TABLES`

  Ative o modo SQL rigoroso para os motores de armazenamento transacionais e, quando possível, para os motores de armazenamento não transacionais. Para obter detalhes, consulte o modo SQL rigoroso.

- `TIME_TRUNCATE_FRACTIONAL`

  Controle se a arredondamento ou truncação ocorrerá ao inserir um valor `TIME`, `DATE` ou `TIMESTAMP` com uma parte de segundos fracionários em uma coluna com o mesmo tipo, mas com menos dígitos fracionários. O comportamento padrão é usar o arredondamento. Se este modo estiver habilitado, a truncação ocorrerá em vez disso. A seguinte sequência de instruções ilustra a diferença:

  ```
  CREATE TABLE t (id INT, tval TIME(1));
  SET sql_mode='';
  INSERT INTO t (id, tval) VALUES(1, 1.55);
  SET sql_mode='TIME_TRUNCATE_FRACTIONAL';
  INSERT INTO t (id, tval) VALUES(2, 1.55);
  ```

  O conteúdo da tabela resultante parece assim, onde o primeiro valor foi arredondado e o segundo truncado:

  ```
  mysql> SELECT id, tval FROM t ORDER BY id;
  +------+------------+
  | id   | tval       |
  +------+------------+
  |    1 | 00:00:01.6 |
  |    2 | 00:00:01.5 |
  +------+------------+
  ```

  Veja também a Seção 13.2.6, “Segundos Fracionários em Valores de Tempo”.

#### Modos de combinação SQL

Os seguintes modos especiais são fornecidos como abreviações para combinações de valores de modo da lista anterior.

- `ANSI`

  Equivalente a `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE` e `ONLY_FULL_GROUP_BY`.

  O modo `ANSI` também faz com que o servidor retorne um erro para consultas em que uma função de conjunto `S` com uma referência externa `S(outer_ref)` não pode ser agregada na consulta externa contra a qual a referência externa foi resolvida. Essa é uma consulta desse tipo:

  ```
  SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
  ```

  Aqui, `MAX(t1.b)` não pode ser agregado na consulta externa porque aparece na cláusula `WHERE` dessa consulta. O SQL padrão exige um erro nessa situação. Se o modo `ANSI` não estiver habilitado, o servidor trata `S(outer_ref)` nessas consultas da mesma maneira que interpretaria `S(const)`.

  Consulte a Seção 1.6, “Conformidade com os Padrões MySQL”.

- `TRADITIONAL`

  `TRADITIONAL` é equivalente a `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO` e `NO_ENGINE_SUBSTITUTION`.

#### Modo SQL rigoroso

O modo estrito controla como o MySQL lida com valores inválidos ou ausentes em declarações de alteração de dados, como `INSERT` ou `UPDATE`. Um valor pode ser inválido por várias razões. Por exemplo, ele pode ter o tipo de dado errado para a coluna ou estar fora do intervalo. Um valor está ausente quando uma nova linha a ser inserida não contém um valor para uma coluna que não é `NULL` e que não tem uma cláusula explícita `DEFAULT` em sua definição. (Para uma coluna `NULL`, `NULL` é inserida se o valor estiver ausente.) O modo estrito também afeta declarações DDL, como `CREATE TABLE`.

Se o modo rigoroso não estiver em vigor, o MySQL insere valores ajustados para valores inválidos ou ausentes e produz avisos (consulte a Seção 15.7.7.42, “Instrução SHOW WARNINGS”). No modo rigoroso, você pode produzir esse comportamento usando `INSERT IGNORE` ou `UPDATE IGNORE`.

Para declarações como `SELECT` que não alteram dados, valores inválidos geram um aviso no modo estrito, não um erro.

O modo estrito gera um erro para tentativas de criar uma chave que exceda o comprimento máximo da chave. Quando o modo estrito não está habilitado, isso resulta em um aviso e na redução da chave ao comprimento máximo da chave.

O modo rigoroso não afeta se as restrições de chave estrangeira são verificadas. `foreign_key_checks` pode ser usado para isso. (Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.)

O modo SQL rigoroso está em vigor se `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` estiverem habilitados, embora os efeitos desses modos sejam um pouco diferentes:

- Para tabelas transacionais, ocorre um erro para valores inválidos ou ausentes em uma declaração de alteração de dados quando o `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` está habilitado. A declaração é interrompida e revertida.

- Para tabelas não transacionais, o comportamento é o mesmo em qualquer modo se o valor inválido ocorrer na primeira linha a ser inserida ou atualizada: a instrução é abortada e a tabela permanece inalterada. Se a instrução inserir ou modificar várias linhas e o valor inválido ocorrer na segunda ou em uma linha posterior, o resultado depende do modo estrito habilitado:

  - Para `STRICT_ALL_TABLES`, o MySQL retorna um erro e ignora o resto das linhas. No entanto, como as linhas anteriores foram inseridas ou atualizadas, o resultado é uma atualização parcial. Para evitar isso, use instruções de uma única linha, que podem ser interrompidas sem alterar a tabela.

  - Para `STRICT_TRANS_TABLES`, o MySQL converte um valor inválido para o valor válido mais próximo da coluna e insere o valor ajustado. Se um valor estiver ausente, o MySQL insere o valor padrão implícito para o tipo de dados da coluna. Em qualquer caso, o MySQL gera um aviso em vez de um erro e continua processando a instrução. Os valores padrão implícitos são descritos na Seção 13.6, “Valores padrão de tipo de dados”.

O modo rigoroso afeta o tratamento da divisão por zero, datas zero e zeros em datas da seguinte forma:

- O modo estrito afeta o tratamento da divisão por zero, o que inclui `MOD(N,0)`:

  Para operações de alteração de dados (`INSERT`, `UPDATE`):

  - Se o modo rigoroso não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.

  - Se o modo estrito estiver ativado, a divisão por zero produzirá um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

  Para `SELECT`, a divisão por zero retorna `NULL`. Ativação do modo estrito também gera uma mensagem de aviso.

- O modo rigoroso afeta se o servidor permite `'0000-00-00'` como uma data válida:

  - Se o modo estrito não estiver habilitado, `'0000-00-00'` é permitido e os produtores não recebem nenhum aviso.

  - Se o modo estrito estiver ativado, `'0000-00-00'` não é permitido e os insertos geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e os insertos geram uma mensagem de aviso.

- O modo rigoroso afeta se o servidor permite datas em que a parte do ano é diferente de zero, mas a parte do mês ou do dia é 0 (datas como `'2010-00-01'` ou `'2010-01-00'`):

  - Se o modo rigoroso não estiver habilitado, datas com zero partes são permitidas e os insertos não produzem nenhum aviso.

  - Se o modo estrito estiver ativado, datas com zero partes não são permitidas e os insertos geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com zero partes são inseridas como `'0000-00-00'` (que é considerada válida com `IGNORE`) e geram um aviso.

Para obter mais informações sobre o modo estrito em relação ao `IGNORE`, consulte a comparação entre o sintoma IGNORE e o modo SQL estrito.

O modo rigoroso afeta o tratamento da divisão por zero, datas zero e zeros em datas em conjunto com os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`.

#### Comparação do Palavra-chave IGNORE e Modo SQL Estrito

Esta seção compara o efeito na execução da declaração da palavra-chave `IGNORE` (que desvaloriza erros em avisos) e o modo SQL rigoroso (que eleva avisos a erros). Ela descreve quais declarações elas afetam e quais erros elas aplicam.

A tabela a seguir apresenta uma comparação resumida do comportamento da declaração quando o padrão é gerar um erro em vez de uma mensagem de aviso. Um exemplo de quando o padrão é gerar um erro é inserir um `NULL` em uma coluna `NOT NULL`. Um exemplo de quando o padrão é gerar um aviso é inserir um valor do tipo de dado errado em uma coluna (como inserir a string `'abc'` em uma coluna de número inteiro).

<table summary="Comparação do comportamento da declaração quando o padrão é produzir um erro em vez de um aviso."><thead><tr> <th scope="col">Modo Operacional</th> <th scope="col">Quando o padrão da declaração é Erro</th> <th scope="col">Quando a opção Padrão de declaração é Aviso</th> </tr></thead><tbody><tr> <th>Sem o modo [[<code>IGNORE</code>]] ou modo SQL rigoroso</th> <td>Erro</td> <td>Aviso</td> </tr><tr> <th>Com [[<code>IGNORE</code>]]</th> <td>Aviso</td> <td>Aviso (mesmo que sem [[<code>IGNORE</code>]] ou modo SQL rigoroso)</td> </tr><tr> <th>Com modo SQL rigoroso</th> <td>Erro (mesmo que sem [[<code>IGNORE</code>]] ou modo SQL rigoroso)</td> <td>Erro</td> </tr><tr> <th>Com [[<code>IGNORE</code>]] e modo SQL rigoroso</th> <td>Aviso</td> <td>Aviso</td> </tr></tbody></table>

Uma conclusão que podemos tirar da tabela é que, quando a palavra-chave `IGNORE` e o modo SQL rigoroso estão em vigor, o `IGNORE` tem precedência. Isso significa que, embora o `IGNORE` e o modo SQL rigoroso possam ser considerados ter efeitos opostos no tratamento de erros, eles não se cancelam quando usados juntos.

- O efeito do IGNORE na execução da declaração
- O efeito do modo SQL rigoroso na execução das declarações

##### O efeito do IGNORE na execução da declaração

Várias declarações no MySQL suportam a palavra-chave opcional `IGNORE`. Esta palavra-chave faz com que o servidor reduza certos tipos de erros e gere avisos em vez disso. Para uma declaração com várias linhas, a redução de um erro para um aviso pode permitir que uma linha seja processada. Caso contrário, `IGNORE` faz com que a declaração passe para a próxima linha em vez de abortar. (Para erros não ignoráveis, um erro ocorre independentemente da palavra-chave `IGNORE`.)

Exemplo: Se a tabela `t` tiver uma coluna de chave primária `i` contendo valores únicos, tentar inserir o mesmo valor de `i` em várias linhas normalmente produz um erro de chave duplicada:

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

Exemplo: Se a tabela `t2` tiver uma coluna `NOT NULL` `id`, tentar inserir `NULL` produz um erro no modo SQL rigoroso:

```
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Se o modo SQL não for rigoroso, `IGNORE` faz com que `NULL` seja inserido como o valor padrão implícito da coluna (0 neste caso), o que permite que a linha seja tratada sem saltos:

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

Essas declarações suportam a palavra-chave `IGNORE`:

- `CREATE TABLE ... SELECT`: `IGNORE` não se aplica às partes `CREATE TABLE` ou `SELECT` da declaração, mas sim aos insertos na tabela de linhas produzidos pelo `SELECT`. As linhas que duplicam uma linha existente com um valor de chave única são descartadas.

- `DELETE`: `IGNORE` faz com que o MySQL ignore erros durante o processo de exclusão de linhas.

- `INSERT`: Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave única são descartadas. As linhas definidas com valores que causariam erros de conversão de dados são definidas com os valores válidos mais próximos.

  Para tabelas particionadas onde não é encontrado um particionamento que corresponda a um valor dado, `IGNORE` faz com que a operação de inserção falhe silenciosamente para as linhas que contêm o valor não correspondente.

- `LOAD DATA`, `LOAD XML`: Com `IGNORE`, as linhas que duplicam uma linha existente com um valor de chave único são descartadas.

- `UPDATE`: Com `IGNORE`, as linhas para as quais conflitos de chave duplicada ocorrem em um valor de chave único não são atualizadas. As linhas atualizadas para valores que causariam erros de conversão de dados são atualizadas para os valores válidos mais próximos, em vez disso.

A palavra-chave `IGNORE` se aplica aos seguintes erros ignoráveis:

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

##### O efeito do modo SQL rigoroso na execução das declarações

O servidor MySQL pode operar em diferentes modos SQL e aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. No modo SQL “estricto”, o servidor eleva certos avisos a erros.

Por exemplo, no modo SQL não estrito, inserir a string `'abc'` em uma coluna inteira resulta na conversão do valor para 0 e em uma mensagem de aviso:

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

Para obter mais informações sobre as configurações possíveis da variável de sistema `sql_mode`, consulte a Seção 7.1.11, “Modos SQL do servidor”.

O modo SQL rigoroso é aplicado às seguintes instruções em condições nas quais algum valor pode estar fora do intervalo ou uma linha inválida pode ser inserida ou excluída de uma tabela:

- `ALTER TABLE`

- `CREATE TABLE`

- `CREATE TABLE ... SELECT`

- `DELETE` (tanto para uma única tabela quanto para várias tabelas)

- `INSERT`

- `LOAD DATA`

- `LOAD XML`

- `SELECT SLEEP()`

- `UPDATE` (tanto para uma única tabela quanto para várias tabelas)

Dentro dos programas armazenados, as declarações individuais dos tipos listados acima são executadas no modo SQL estrito se o programa foi definido enquanto o modo estrito estava em vigor.

O modo SQL rigoroso se aplica aos seguintes erros, que representam uma classe de erros em que um valor de entrada é inválido ou está ausente. Um valor é inválido se tiver o tipo de dado errado para a coluna ou estiver fora do intervalo. Um valor está ausente se uma nova linha a ser inserida não contiver um valor para uma coluna `NOT NULL` que não tenha uma cláusula `DEFAULT` explícita em sua definição.

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

Nota

Como o desenvolvimento contínuo do MySQL define novos erros, pode haver erros que não estão na lista anterior para os quais o modo SQL rigoroso se aplica.
