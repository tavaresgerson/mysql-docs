### 5.1.10 Modos do SQL do servidor

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender aos requisitos do servidor do site, e cada aplicativo pode definir seu próprio modo SQL de sessão de acordo com suas necessidades.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

- Definindo o modo SQL
- Os modos SQL mais importantes
- Lista completa dos modos SQL
- Modos de combinação SQL
- Modo SQL Estrito
- Comparação do Palavra-Chave IGNORE e Modo SQL Estrito
- Mudanças no modo SQL no MySQL 5.7

Para respostas a perguntas frequentemente feitas sobre os modos SQL do servidor no MySQL, consulte Seção A.3, “Perguntas frequentes sobre o modo SQL do servidor do MySQL 5.7”.

Ao trabalhar com tabelas do `InnoDB`, considere também a variável de sistema `innodb_strict_mode`. Ela habilita verificações de erro adicionais para tabelas do `InnoDB`.

#### Definindo o Modo SQL

O modo SQL padrão no MySQL 5.7 inclui esses modos: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`.

Esses modos foram adicionados ao modo SQL padrão no MySQL 5.7: Os modos `ONLY_FULL_GROUP_BY` e `STRICT_TRANS_TABLES` foram adicionados no MySQL 5.7.5. O modo `NO_AUTO_CREATE_USER` foi adicionado no MySQL 5.7.7. Os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` foram adicionados no MySQL 5.7.8. Para uma discussão adicional sobre essas alterações no valor do modo SQL padrão, consulte Alterações no Modo SQL no MySQL 5.7.

Para definir o modo SQL na inicialização do servidor, use a opção `--sql-mode="modes"` na linha de comando ou `sql-mode="modes"` em um arquivo de opções, como `my.cnf` (sistemas operacionais Unix) ou `my.ini` (Windows). *`modes`* é uma lista de diferentes modos separados por vírgulas. Para limpar explicitamente o modo SQL, defina-o como uma string vazia usando `--sql-mode=""` na linha de comando ou `sql-mode=""` em um arquivo de opções.

Nota

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação. Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê ao iniciar.

Para alterar o modo SQL em tempo de execução, defina a variável de sistema global ou de sessão `sql_mode` usando uma instrução `SET`:

```sql
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

Definir a variável `GLOBAL` requer o privilégio `SUPER` e afeta o funcionamento de todos os clientes que se conectam a partir desse momento. Definir a variável `SESSION` afeta apenas o cliente atual. Cada cliente pode alterar o valor da sua sessão `sql_mode` (variáveis do sistema do servidor) a qualquer momento.

Para determinar o valor atual do conjunto de configurações global ou de sessão `sql_mode`, selecione seu valor:

```sql
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

Importante

**Modo SQL e particionamento definido pelo usuário.** Mudar o modo SQL do servidor após a criação e inserção de dados em tabelas particionadas pode causar mudanças significativas no comportamento dessas tabelas e pode levar à perda ou corrupção de dados. É altamente recomendável que você nunca mude o modo SQL uma vez que tenha criado tabelas que utilizam particionamento definido pelo usuário.

Ao replicar tabelas particionadas, modos SQL diferentes no banco de dados fonte e na replica também podem causar problemas. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor no banco de dados fonte e na replica.

Para mais informações, consulte Seção 22.6, “Restrições e Limitações de Partição”.

#### Os modos SQL mais importantes

Os valores mais importantes de `sql_mode` são provavelmente estes:

- `ANSI`

  Esse modo altera a sintaxe e o comportamento para se adequar mais ao SQL padrão. É um dos modos especiais de combinação [sql-mode.html#sql-mode-combo] listados no final desta seção.

- `STRICT_TRANS_TABLES`

  Se um valor não puder ser inserido conforme especificado em uma tabela transacional, interrompa a instrução. Para uma tabela não transacional, interrompa a instrução se o valor ocorrer em uma instrução de uma única linha ou na primeira linha de uma instrução de várias linhas. Mais detalhes serão fornecidos mais adiante nesta seção.

  A partir do MySQL 5.7.5, o modo SQL padrão inclui `STRICT_TRANS_TABLES`.

- `TRADICIONAL`

  Faça o MySQL se comportar como um sistema de banco de dados SQL “tradicional”. Uma descrição simples desse modo é “dar um erro em vez de um aviso” ao inserir um valor incorreto em uma coluna. É um dos modos especiais de combinação [sql-mode.html#sql-mode-combo] listados no final desta seção.

  Nota

  Com o modo `TRADITIONAL` ativado, uma instrução `INSERT` ou `UPDATE` é interrompida assim que ocorre um erro. Se você estiver usando um mecanismo de armazenamento não transacional, isso pode não ser o que você deseja, pois as alterações de dados feitas antes do erro podem não ser revertidas, resultando em uma atualização "parcialmente concluída".

Quando este manual se refere ao “modo estrito”, ele significa um modo com o `STRICT_TRANS_TABLES` ou o `STRICT_ALL_TABLES` ativado, ou ambos.

#### Lista completa dos modos SQL

A lista a seguir descreve todos os modos de SQL suportados:

- `ALLOW_INVALID_DATES`

  Não realize verificações completas das datas. Verifique apenas que o mês esteja no intervalo de 1 a 12 e o dia no intervalo de 1 a 31. Isso pode ser útil para aplicações web que obtêm ano, mês e dia em três campos diferentes e armazenam exatamente o que o usuário inseriu, sem validação de data. Esse modo se aplica às colunas `DATE` e `DATETIME`. Não se aplica às colunas `TIMESTAMP`, que sempre exigem uma data válida.

  Com `ALLOW_INVALID_DATES` desativado, o servidor exige que os valores de mês e dia sejam válidos e não apenas dentro do intervalo de 1 a 12 e 1 a 31, respectivamente. Com o modo rigoroso desativado, datas inválidas como `'2004-04-31'` são convertidas em `'0000-00-00'` e um aviso é gerado. Com o modo rigoroso ativado, datas inválidas geram um erro. Para permitir tais datas, habilite `ALLOW_INVALID_DATES`.

- `ANSI_QUOTES`

  Trate `"` como um caractere de citação de identificador (como o caractere `de citação) e não como um caractere de citação de string. Você ainda pode usar` para citar identificadores com este modo ativado. Com `ANSI_QUOTES` ativado, você não pode usar aspas duplas para citar strings literais, porque elas são interpretadas como identificadores.

- `ERRO_PARA_DIVISÃO_POR_ZERO`

  O modo `ERROR_FOR_DIVISION_BY_ZERO` afeta o tratamento da divisão por zero, o que inclui `MOD(N,0)`. Para operações de alteração de dados (`INSERT`, `UPDATE`), seu efeito também depende se o modo SQL rigoroso está habilitado.

  - Se esse modo não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.

  - Se este modo estiver ativado, a divisão por zero insere `NULL` e gera uma mensagem de aviso.

  - Se este modo e o modo estrito estiverem ativados, a divisão por zero produz um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

  Para `SELECT`, a divisão por zero retorna `NULL`. Ativação de `ERROR_FOR_DIVISION_BY_ZERO` também gera uma mensagem de aviso, independentemente de o modo estrito estar ativado.

  `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado. `ERROR_FOR_DIVISION_BY_ZERO` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `ERROR_FOR_DIVISION_BY_ZERO` estiver ativado sem ativar também o modo estrito ou vice-versa. Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

  Porque `ERROR_FOR_DIVISION_BY_ZERO` está desatualizado; espere-se que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

- `HIGH_NOT_PRECEDENCE`

  A precedência do operador [`NOT`]\(operadores lógicos.html#operador_not) é tal que expressões como `NOT a BETWEEN b AND c` são analisadas como `NOT (a BETWEEN b AND c)`. Em algumas versões mais antigas do MySQL, a expressão era analisada como `(NOT a) BETWEEN b AND c`. O comportamento antigo de precedência mais alta pode ser obtido ao habilitar o modo SQL `HIGH_NOT_PRECEDENCE`.

  ```sql
  mysql> SET sql_mode = '';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 0
  mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 1
  ```

- `IGNORE_SPACE`

  Permita espaços entre o nome da função e o caractere `(`. Isso faz com que os nomes de funções embutidas sejam tratados como palavras reservadas. Como resultado, identificadores que são iguais aos nomes das funções devem ser citados conforme descrito em Seção 9.2, “Nomes de Objetos de Esquema”. Por exemplo, porque existe uma função `COUNT()`, o uso de `count` como nome de tabela na seguinte declaração causa um erro:

  ```sql
  mysql> CREATE TABLE count (i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax
  ```

  O nome da tabela deve ser citado:

  ```sql
  mysql> CREATE TABLE `count` (i INT);
  Query OK, 0 rows affected (0.00 sec)
  ```

  O modo SQL `IGNORE_SPACE` se aplica a funções embutidas, não a funções carregáveis ou funções armazenadas. É sempre permitido ter espaços após o nome de uma função carregável ou armazenada, independentemente de o `IGNORE_SPACE` estar habilitado.

  Para uma discussão mais aprofundada sobre `IGNORE_SPACE`, consulte Seção 9.2.5, "Análise e resolução de nomes de funções".

- `NO_AUTO_CREATE_USER`

  Impedir que a instrução `GRANT` crie automaticamente novas contas de usuário, a menos que as informações de autenticação sejam especificadas. A instrução deve especificar uma senha não vazia usando `IDENTIFIED BY` ou um plugin de autenticação usando `IDENTIFIED WITH`.

  É preferível criar contas MySQL com `CREATE USER` em vez de `GRANT`. `NO_AUTO_CREATE_USER` está desatualizado e o modo SQL padrão inclui `NO_AUTO_CREATE_USER`. Atribuições ao `sql_mode` que alteram o estado do modo `NO_AUTO_CREATE_USER` produzem uma mensagem de aviso, exceto as atribuições que definem `sql_mode` como `DEFAULT`. Espera-se que `NO_AUTO_CREATE_USER` seja removido em uma futura versão do MySQL, e seu efeito seja ativado o tempo todo (e para que `GRANT` não crie contas mais).

  Anteriormente, antes de `NO_AUTO_CREATE_USER` fosse desaconselhado, uma das razões para não a habilitar era que não era segura para replicação. Agora, ela pode ser habilitada e a gestão segura de usuários pode ser realizada com `CREATE USER IF NOT EXISTS`, `DROP USER IF EXISTS` e `ALTER USER IF EXISTS`, em vez de `GRANT`. Essas instruções permitem uma replicação segura quando as réplicas podem ter diferentes concessões do que as do banco de origem. Veja Seção 13.7.1.2, “Instrução CREATE USER”, Seção 13.7.1.3, “Instrução DROP USER” e Seção 13.7.1.1, “Instrução ALTER USER”.

- `NO_AUTO_VALUE_ON_ZERO`

  `NO_AUTO_VALUE_ON_ZERO` afeta o tratamento das colunas `AUTO_INCREMENT`. Normalmente, você gera o próximo número de sequência para a coluna inserindo `NULL` ou `0` nela. `NO_AUTO_VALUE_ON_ZERO` suprime esse comportamento para `0`, de modo que apenas `NULL` gera o próximo número de sequência.

  Esse modo pode ser útil se o valor `0` tiver sido armazenado na coluna `AUTO_INCREMENT` de uma tabela. (É importante notar que armazenar `0` não é uma prática recomendada.) Por exemplo, se você fazer o dump da tabela com **mysqldump** e depois recarregar, o MySQL normalmente gera novos números de sequência quando encontra os valores `0`, resultando em uma tabela com conteúdo diferente do que foi feito o dump. Ativação de `NO_AUTO_VALUE_ON_ZERO` antes de recarregar o arquivo de dump resolve esse problema. Por essa razão, **mysqldump** inclui automaticamente em sua saída uma declaração que habilita `NO_AUTO_VALUE_ON_ZERO`.

- `NO_BACKSLASH_ESCAPES`

  Ativação deste modo desabilita o uso do caractere barra invertida (`\`) como caractere de escape dentro de strings e identificadores. Com este modo ativado, a barra invertida se torna um caractere comum como qualquer outro, e a sequência de escape padrão para expressões de comparação de strings `LIKE` é alterada para que nenhum caractere de escape seja usado.

- `NO_DIR_IN_CREATE`

  Ao criar uma tabela, ignore todas as diretivas `INDEX DIRECTORY` e `DATA DIRECTORY`. Esta opção é útil em servidores de replicação de replicação.

- `NO_ENGINE_SUBSTITUTION`

  Controle a substituição automática do motor de armazenamento padrão quando uma declaração como `CREATE TABLE` ou `ALTER TABLE` especifica um motor de armazenamento desativado ou não compilado.

  Por padrão, `NO_ENGINE_SUBSTITUTION` está habilitado.

  Como os motores de armazenamento podem ser plugáveis em tempo de execução, os motores indisponíveis são tratados da mesma maneira:

  Com `NO_ENGINE_SUBSTITUTION` desativado, para `CREATE TABLE` é usado o motor padrão e uma mensagem de aviso é exibida se o motor desejado estiver indisponível. Para `ALTER TABLE`, um aviso é exibido e a tabela não é alterada.

  Com `NO_ENGINE_SUBSTITUTION` habilitado, um erro ocorre e a tabela não é criada ou alterada se o motor desejado estiver indisponível.

- `NO_FIELD_OPTIONS`

  Não imprima opções de coluna específicas do MySQL no resultado de `SHOW CREATE TABLE` (show-create-table.html). Esse modo é usado pelo **mysqldump** no modo de portabilidade.

  Nota

  A partir do MySQL 5.7.22, `NO_FIELD_OPTIONS` está desatualizado. Ele será removido no MySQL 8.0.

- `NO_KEY_OPTIONS`

  Não imprima opções de índice específicas do MySQL na saída de `SHOW CREATE TABLE`. Esse modo é usado pelo **mysqldump** no modo de portabilidade.

  Nota

  A partir do MySQL 5.7.22, `NO_KEY_OPTIONS` está desatualizado. Ele será removido no MySQL 8.0.

- `NO_TABLE_OPTIONS`

  Não imprima opções de tabela específicas do MySQL (como `ENGINE`) na saída de `SHOW CREATE TABLE`. Esse modo é usado pelo **mysqldump** no modo de portabilidade.

  Nota

  A partir do MySQL 5.7.22, `NO_TABLE_OPTIONS` está desatualizado. Ele será removido no MySQL 8.0.

- `NO_UNSIGNED_SUBTRACTION`

  A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado, de outra forma, fosse negativo, ocorreria um erro:

  ```sql
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
  ```

  Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado será negativo:

  ```sql
  mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  +-------------------------+
  | CAST(0 AS UNSIGNED) - 1 |
  +-------------------------+
  |                      -1 |
  +-------------------------+
  ```

  Se o resultado de uma operação desse tipo for usado para atualizar uma coluna de inteiro `UNSIGNED`, o resultado é recortado para o valor máximo do tipo da coluna, ou recortado para 0 se o modo SQL estrito estiver habilitado. Com o modo SQL estrito habilitado, ocorre um erro e a coluna permanece inalterada.

  Quando o `NO_UNSIGNED_SUBTRACTION` está habilitado, o resultado da subtração é assinado, *mesmo que qualquer operando seja não assinado*. Por exemplo, compare o tipo da coluna `c2` na tabela `t1` com o da coluna `c2` na tabela `t2`:

  ```sql
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

  Isso significa que `BIGINT UNSIGNED` não é 100% utilizável em todos os contextos. Veja Seção 12.10, “Funções e Operadores de Casting”.

- `NO_ZERO_DATE`

  O modo `NO_ZERO_DATE` afeta se o servidor permite o uso de `'0000-00-00'` como uma data válida. Seu efeito também depende se o modo SQL rigoroso está habilitado.

  - Se esse modo não estiver habilitado, o valor `'0000-00-00'` é permitido e os produtos inseridos não geram nenhum aviso.

  - Se esse modo estiver habilitado, o `'0000-00-00'` é permitido e os produtos inseridos geram uma mensagem de alerta.

  - Se este modo e o modo estrito estiverem habilitados, o `'0000-00-00'` não é permitido e as inserções geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e as inserções geram uma mensagem de aviso.

  `NO_ZERO_DATE` está desatualizado. `NO_ZERO_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `NO_ZERO_DATE` estiver ativado sem ativar também o modo estrito ou vice-versa. Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

  Como `NO_ZERO_DATE` está desatualizado; espere que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

- `NO_ZERO_IN_DATE`

  O modo `NO_ZERO_IN_DATE` afeta se o servidor permite datas em que a parte do ano é não nula, mas a parte do mês ou dia é 0. (Esse modo afeta datas como `'2010-00-01'` ou `'2010-01-00'`, mas não `'0000-00-00'`. Para controlar se o servidor permite `'0000-00-00'`, use o modo `NO_ZERO_DATE`. O efeito do `NO_ZERO_IN_DATE` também depende se o modo SQL rigoroso está habilitado.

  - Se esse modo não estiver habilitado, datas com zero partes são permitidas e os insertos não produzem nenhum aviso.

  - Se esse modo estiver ativado, as datas com zero partes serão inseridas como `'0000-00-00'` e gerará uma mensagem de alerta.

  - Se este modo e o modo estrito estiverem ativados, datas com zero partes não são permitidas e os insertos geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com zero partes são inseridas como `'0000-00-00'` e geram um aviso.

  `NO_ZERO_IN_DATE` está desatualizado. `NO_ZERO_IN_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `NO_ZERO_IN_DATE` estiver ativado sem ativar também o modo estrito ou vice-versa. Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

  Porque `NO_ZERO_IN_DATE` está desatualizado; espere-se que ele seja removido em uma futura versão do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

- `ONLY_FULL_GROUP_BY`

  Rejeitar consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não estão nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes (determinadas de forma única) das colunas `GROUP BY`.

  A partir do MySQL 5.7.5, o modo SQL padrão inclui `ONLY_FULL_GROUP_BY`. (Antes do 5.7.5, o MySQL não detecta a dependência funcional e `ONLY_FULL_GROUP_BY` não está habilitado por padrão.)

  Uma extensão do MySQL para o SQL padrão permite referências em cláusulas `HAVING` a expressões aliadas na lista de seleção. Antes do MySQL 5.7.5, a ativação de `ONLY_FULL_GROUP_BY` desativa essa extensão, exigindo, assim, que a cláusula `HAVING` seja escrita usando expressões não aliadas. A partir do MySQL 5.7.5, essa restrição é levantada para que a cláusula `HAVING` possa referenciar aliases, independentemente de a opção `ONLY_FULL_GROUP_BY` estar habilitada.

  Para discussões adicionais e exemplos, consulte Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

- `PAD_CHAR_TO_FULL_LENGTH`

  Por padrão, os espaços finais são removidos dos valores da coluna `[CHAR]` (char.html) durante a recuperação. Se o `[PAD_CHAR_TO_FULL_LENGTH]` (sql-mode.html#sqlmode_pad_char_to_full_length) estiver habilitado, o corte não ocorre e os valores de `[CHAR]` (char.html) recuperados são preenchidos com o comprimento total. Esse modo não se aplica às colunas `[VARCHAR]` (char.html), para as quais os espaços finais são mantidos durante a recuperação.

  ```sql
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

  Trate `REAL` como sinônimo de `FLOAT`. Por padrão, o MySQL trata `REAL` como sinônimo de `DOUBLE`.

- `STRICT_ALL_TABLES`

  Ative o modo SQL rigoroso para todos os motores de armazenamento. Valores de dados inválidos são rejeitados. Para obter detalhes, consulte Modo SQL Rigoroso.

  De MySQL 5.7.4 a 5.7.7, `STRICT_ALL_TABLES` inclui o efeito dos modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`. Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

- `STRICT_TRANS_TABLES`

  Ative o modo SQL estrito para os motores de armazenamento transacionais e, quando possível, para os motores de armazenamento não transacionais. Para obter detalhes, consulte Modo SQL Estrito.

  De MySQL 5.7.4 a 5.7.7, `STRICT_TRANS_TABLES` inclui o efeito dos modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`. Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

#### Modos de combinação SQL

Os seguintes modos especiais são fornecidos como abreviações para combinações de valores de modo da lista anterior.

- `ANSI`

  Equivalente a `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE` e (a partir do MySQL 5.7.5) `ONLY_FULL_GROUP_BY`.

  O modo `ANSI` também faz com que o servidor retorne um erro para consultas em que uma função de conjunto *`S`* com uma referência externa `S(outer_ref)` não pode ser agregada na consulta externa contra a qual a referência externa foi resolvida. Essa é uma consulta desse tipo:

  ```sql
  SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
  ```

  Aqui, `MAX(t1.b)` não pode ser agregado na consulta externa porque aparece na cláusula `WHERE` dessa consulta. O SQL padrão exige um erro nessa situação. Se o modo `ANSI` (sql-mode.html#sqlmode_ansi) não estiver habilitado, o servidor trata `S(outer_ref)` nessas consultas da mesma maneira que interpretaria `S(const)`.

  Veja Seção 1.6, “Conformidade com Padrões MySQL”.

- `DB2`

  Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`.

  Nota

  A partir do MySQL 5.7.22, o `DB2` está desatualizado. Ele será removido no MySQL 8.0.

- `MAXDB`

  Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`, `NO_AUTO_CREATE_USER`.

  Nota

  A partir do MySQL 5.7.22, o `MAXDB` está desatualizado. Ele será removido no MySQL 8.0.

- `MSSQL`

  Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`.

  Nota

  A partir do MySQL 5.7.22, o `MSSQL` está desatualizado. Ele será removido no MySQL 8.0.

- `MYSQL323`

  Equivalente a `MYSQL323`, `HIGH_NOT_PRECEDENCE`. Isso significa `HIGH_NOT_PRECEDENCE` mais alguns comportamentos de `SHOW CREATE TABLE` específicos de `MYSQL323`:

  - A exibição da coluna `[TIMESTAMP]` (datetime.html) não inclui os atributos `DEFAULT` ou `ON UPDATE`.

  - A exibição de coluna de string não inclui atributos de conjunto de caracteres e ordenação. Para as colunas `CHAR` e `VARCHAR`, se a ordenação for binária, o `BINARY` é anexado ao tipo da coluna.

  - A opção `ENGINE=engine_name` é exibida como `TYPE=engine_name`.

  - Para as tabelas de ``MEMORY`, o mecanismo de armazenamento é exibido como `HEAP\`.

  Nota

  A partir do MySQL 5.7.22, `MYSQL323` está desatualizado. Ele será removido no MySQL 8.0.

- `MYSQL40`

  Equivalente a `MYSQL40`, `HIGH_NOT_PRECEDENCE`. Isso significa `HIGH_NOT_PRECEDENCE` mais alguns comportamentos específicos de `MYSQL40`. Estes são os mesmos que para `MYSQL323`, exceto que `SHOW CREATE TABLE` não exibe `HEAP` como o mecanismo de armazenamento para as tabelas de `MEMORY`.

  Nota

  A partir do MySQL 5.7.22, o `MYSQL40` está desatualizado. Ele será removido no MySQL 8.0.

- `ORACLE`

  Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`, `NO_AUTO_CREATE_USER`.

  Nota

  A partir do MySQL 5.7.22, o `ORACLE` está desatualizado. Ele será removido no MySQL 8.0.

- `POSTGRESQL`

  Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`.

  Nota

  A partir do MySQL 5.7.22, `POSTGRESQL` está desatualizado. Ele será removido no MySQL 8.0.

- `TRADICIONAL`

  Antes do MySQL 5.7.4, e no MySQL 5.7.8 e versões posteriores, `TRADITIONAL` é equivalente a `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, [`ERROR_FOR_DIVISION_BY_ZERO`]\(sql-mode.html#sqlmode_error_for_division_by_zero], `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`.

  A partir do MySQL 5.7.4 até o 5.7.7, `TRADITIONAL` é equivalente a `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`. Os modos `NO_ZERO_IN_DATE`, `NO_ZERO_DATE` e `ERROR_FOR_DIVISION_BY_ZERO` não têm nomes porque, nessas versões, seus efeitos estão incluídos nos efeitos do modo SQL rigoroso (`STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES`). Assim, os efeitos de `TRADITIONAL` são os mesmos em todas as versões do MySQL 5.7 (e os mesmos do MySQL 5.6). Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

#### Modo SQL rigoroso

O modo estrito controla como o MySQL lida com valores inválidos ou ausentes em declarações de alteração de dados, como `INSERT` ou `UPDATE`. Um valor pode ser inválido por várias razões. Por exemplo, ele pode ter o tipo de dado errado para a coluna ou estar fora do intervalo. Um valor está ausente quando uma nova linha a ser inserida não contém um valor para uma coluna que não é `NULL` e que não tem uma cláusula `DEFAULT` explícita em sua definição. (Para uma coluna `NULL`, `NULL` é inserido se o valor estiver ausente.) O modo estrito também afeta declarações DDL, como `CREATE TABLE`.

Se o modo estrito não estiver em vigor, o MySQL insere valores ajustados para valores inválidos ou ausentes e produz avisos (consulte Seção 13.7.5.40, "Instrução SHOW WARNINGS"). No modo estrito, você pode produzir esse comportamento usando `INSERT IGNORE` (insert.html) ou `UPDATE IGNORE` (update.html).

Para declarações como `SELECT` que não alteram dados, valores inválidos geram um aviso no modo estrito, não um erro.

O modo estrito gera um erro para tentativas de criar uma chave que exceda o comprimento máximo da chave. Quando o modo estrito não está habilitado, isso resulta em um aviso e na redução da chave ao comprimento máximo da chave.

O modo estrito não afeta se as restrições de chave estrangeira são verificadas. Para isso, você pode usar `foreign_key_checks`. (Veja Seção 5.1.7, "Variáveis do Sistema do Servidor").

O modo SQL rigoroso está em vigor se estiver habilitado `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES`, embora os efeitos desses modos sejam um pouco diferentes:

- Para tabelas transacionais, ocorre um erro para valores inválidos ou ausentes em uma declaração de alteração de dados quando o `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` está habilitado. A declaração é interrompida e revertida.

- Para tabelas não transacionais, o comportamento é o mesmo em qualquer modo se o valor inválido ocorrer na primeira linha a ser inserida ou atualizada: a instrução é abortada e a tabela permanece inalterada. Se a instrução inserir ou modificar várias linhas e o valor inválido ocorrer na segunda ou em uma linha posterior, o resultado depende do modo estrito habilitado:

  - Para `STRICT_ALL_TABLES`, o MySQL retorna um erro e ignora o resto das linhas. No entanto, como as linhas anteriores já foram inseridas ou atualizadas, o resultado é uma atualização parcial. Para evitar isso, use instruções de uma única linha, que podem ser interrompidas sem alterar a tabela.

  - Para `STRICT_TRANS_TABLES`, o MySQL converte um valor inválido para o valor válido mais próximo da coluna e insere o valor ajustado. Se um valor estiver ausente, o MySQL insere o valor padrão implícito para o tipo de dados da coluna. Em qualquer caso, o MySQL gera uma mensagem de aviso em vez de um erro e continua processando a instrução. Os valores padrão implícitos são descritos em Seção 11.6, “Valores padrão de tipo de dados”.

O modo rigoroso afeta o tratamento da divisão por zero, datas zero e zeros em datas da seguinte forma:

- O modo rigoroso afeta o tratamento da divisão por zero, o que inclui `MOD(N,0)`:

  Para operações de alteração de dados (`INSERT`, `UPDATE`):

  - Se o modo rigoroso não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.

  - Se o modo estrito estiver ativado, a divisão por zero produzirá um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

  Para `SELECT`, a divisão por zero retorna `NULL`. Ativação do modo estrito também gera uma mensagem de aviso.

- O modo rigoroso afeta se o servidor permite o uso de `'0000-00-00'` como uma data válida:

  - Se o modo rigoroso não estiver habilitado, o valor `'0000-00-00'` é permitido e os registros de inserção não geram avisos.

  - Se o modo estrito estiver ativado, o `'0000-00-00'` não é permitido e os insertos geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e os insertos geram uma mensagem de aviso.

- O modo rigoroso afeta se o servidor permite datas em que a parte do ano é diferente de zero, mas a parte do mês ou do dia é 0 (datas como `'2010-00-01'` ou `'2010-01-00'`).

  - Se o modo rigoroso não estiver habilitado, datas com zero partes são permitidas e os insertos não produzem nenhum aviso.

  - Se o modo estrito estiver ativado, datas com zero partes não são permitidas e os insertos geram um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com zero partes são inseridas como `'0000-00-00'` (que é considerada válida com `IGNORE`) e geram um aviso.

Para obter mais informações sobre o modo estrito com relação ao `IGNORE`, consulte Comparação do Palavra-chave IGNORE e o Modo SQL Estrito.

Antes do MySQL 5.7.4, e no MySQL 5.7.8 e versões posteriores, o modo estrito afeta o tratamento da divisão por zero, datas zero e zeros em datas em conjunto com os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`. A partir do MySQL 5.7.4 até 5.7.7, os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` não fazem nada quando nomeados explicitamente e seus efeitos são incluídos nos efeitos do modo estrito. Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

#### Comparação do Palavra-chave IGNORE e Modo SQL Estrito

Esta seção compara o efeito na execução da declaração da palavra-chave `IGNORE` (que reduz erros a avisos) e o modo SQL rigoroso (que eleva avisos a erros). Ela descreve quais declarações elas afetam e quais erros elas aplicam.

A tabela a seguir apresenta uma comparação resumida do comportamento da declaração quando o padrão é gerar um erro em vez de uma mensagem de aviso. Um exemplo de quando o padrão é gerar um erro é inserir um `NULL` em uma coluna `NOT NULL`. Um exemplo de quando o padrão é gerar um aviso é inserir um valor do tipo de dado errado em uma coluna (como inserir a string `'abc'` em uma coluna de inteiro).

<table summary="Comparação do comportamento da declaração quando o padrão é produzir um erro em vez de um aviso."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Modo Operacional</th> <th>Quando o padrão da declaração é Erro</th> <th>Quando a opção Padrão de declaração é Aviso</th> </tr></thead><tbody><tr> <th>Sem o modo <code>IGNORE</code> ou modo SQL rigoroso</th> <td>Erro</td> <td>Aviso</td> </tr><tr> <th>Com <code>IGNORE</code></th> <td>Aviso</td> <td>Aviso (mesmo que sem <code>IGNORE</code> ou modo SQL rigoroso)</td> </tr><tr> <th>Com modo SQL rigoroso</th> <td>Erro (mesmo que sem <code>IGNORE</code> ou modo SQL rigoroso)</td> <td>Erro</td> </tr><tr> <th>Com <code>IGNORE</code> e modo SQL rigoroso</th> <td>Aviso</td> <td>Aviso</td> </tr></tbody></table>

Uma conclusão que podemos tirar da tabela é que, quando a palavra-chave `IGNORE` e o modo SQL rigoroso estão em vigor, a `IGNORE` tem precedência. Isso significa que, embora `IGNORE` e o modo SQL rigoroso possam ser considerados como tendo efeitos opostos no tratamento de erros, eles não se cancelam quando usados juntos.

- O efeito do IGNORE na execução da declaração
- O efeito do modo SQL estrito na execução das instruções

##### O efeito do IGNORE na execução da declaração

Várias declarações no MySQL suportam a palavra-chave opcional `IGNORE`. Essa palavra-chave faz com que o servidor reduza certos tipos de erros e gere avisos em vez disso. Para uma declaração com várias linhas, reduzir um erro a um aviso pode permitir que uma linha seja processada. Caso contrário, `IGNORE` faz com que a declaração pule para a próxima linha em vez de abortar. (Para erros não ignoráveis, um erro ocorre independentemente da palavra-chave `IGNORE`.)

Exemplo: Se a tabela `t` tiver uma coluna de chave primária `i` contendo valores únicos, tentar inserir o mesmo valor de `i` em várias linhas normalmente produz um erro de chave duplicada:

```sql
mysql> CREATE TABLE t (i INT NOT NULL PRIMARY KEY);
mysql> INSERT INTO t (i) VALUES(1),(1);
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
```

Com `IGNORE`, a linha contendo a chave duplicada ainda não é inserida, mas um aviso ocorre em vez de um erro:

```sql
mysql> INSERT IGNORE INTO t (i) VALUES(1),(1);
Query OK, 1 row affected, 1 warning (0.01 sec)
Records: 2  Duplicates: 1  Warnings: 1

mysql> SHOW WARNINGS;
+---------+------+---------------------------------------+
| Level   | Code | Message                               |
+---------+------+---------------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 'PRIMARY' |
+---------+------+---------------------------------------+
1 row in set (0.00 sec)
```

Exemplo: Se a tabela `t2` tiver uma coluna `NOT NULL` chamada `id`, tentar inserir `NULL` produz um erro no modo SQL rigoroso:

```sql
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Se o modo SQL não for rigoroso, o `IGNORE` faz com que o `NULL` seja inserido como o valor padrão implícito da coluna (0 neste caso), o que permite que a linha seja tratada sem ser ignorada:

```sql
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

- `CREATE TABLE ... SELECT`: O comando `IGNORE` não se aplica às partes `CREATE TABLE` ou `SELECT` da instrução, mas sim aos insertos na tabela de linhas produzidas pelo comando `SELECT`. As linhas que duplicam uma linha existente com um valor de chave única são descartadas.

- `DELETE`: `IGNORE` faz com que o MySQL ignore erros durante o processo de exclusão de linhas.

- `INSERT`: Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave única são descartadas. As linhas definidas com valores que causariam erros de conversão de dados são definidas com os valores válidos mais próximos.

  Para tabelas particionadas onde não é encontrado um particionamento que corresponda a um valor dado, o `IGNORE` faz com que a operação de inserção falhe silenciosamente para as linhas que contêm o valor não correspondente.

- `LOAD DATA`, `LOAD XML`: Com `IGNORE`, as linhas que duplicam uma linha existente com um valor de chave único são descartadas.

- `ATUALIZAR`: Com `IGNORE`, as linhas para as quais conflitos de chave duplicada ocorrem em um valor de chave único não são atualizadas. As linhas atualizadas para valores que causariam erros de conversão de dados são atualizadas para os valores válidos mais próximos, em vez disso.

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

O servidor MySQL pode operar em diferentes modos SQL e aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. No modo SQL "estricto", o servidor eleva certos avisos a erros.

Por exemplo, no modo SQL não estrito, inserir a string `'abc'` em uma coluna inteira resulta na conversão do valor para 0 e em uma mensagem de aviso:

```sql
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

```sql
mysql> SET sql_mode = 'STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
ERROR 1366 (HY000): Incorrect integer value: 'abc' for column 'i' at row 1
```

Para obter mais informações sobre as possíveis configurações da variável de sistema `sql_mode`, consulte Seção 5.1.10, “Modos SQL do Servidor”.

O modo SQL rigoroso é aplicado às seguintes instruções em condições nas quais algum valor pode estar fora do intervalo ou uma linha inválida pode ser inserida ou excluída de uma tabela:

- `ALTER TABLE`

- `CREATE TABLE`

- `CREATE TABLE ... SELECT`

- `DELETE` (tanto para uma tabela única quanto para várias tabelas)

- `INSERT`

- `CARREGAR DADOS`

- `CARREGAR XML`

- `ESCOLHA DORME`

- `ATUALIZAR` (tanto para uma tabela única quanto para várias tabelas)

Dentro dos programas armazenados, as declarações individuais dos tipos listados acima são executadas no modo SQL estrito se o programa foi definido enquanto o modo estrito estava em vigor.

O modo SQL rigoroso se aplica aos seguintes erros, que representam uma classe de erros em que um valor de entrada é inválido ou está ausente. Um valor é inválido se tiver o tipo de dado errado para a coluna ou estiver fora do intervalo. Um valor está ausente se uma nova linha a ser inserida não contiver um valor para uma coluna `NOT NULL` que não tenha uma cláusula `DEFAULT` explícita em sua definição.

```sql
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

#### Mudanças no modo SQL no MySQL 5.7

No MySQL 5.7.22, esses modos SQL são desaconselhados e serão removidos no MySQL 8.0: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`.

No MySQL 5.7, o modo SQL `ONLY_FULL_GROUP_BY` está habilitado por padrão, pois o processamento de `GROUP BY` tornou-se mais sofisticado para incluir a detecção de dependências funcionais. No entanto, se você perceber que o habilitação do `ONLY_FULL_GROUP_BY` faz com que as consultas de aplicações existentes sejam rejeitadas, uma dessas ações deve restaurar o funcionamento:

- Se for possível modificar uma consulta que contenha erros, faça isso de modo que as colunas não agregadas dependam funcionalmente das colunas `GROUP BY`, ou referencie as colunas não agregadas usando `ANY_VALUE()`.

- Se não for possível modificar uma consulta que contenha erros (por exemplo, se ela for gerada por um aplicativo de terceiros), configure a variável de sistema `sql_mode` na inicialização do servidor para não habilitar `ONLY_FULL_GROUP_BY`.

No MySQL 5.7, os modos de consulta `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` estão desatualizados. O plano a longo prazo é incluir esses três modos no modo SQL estrito e removê-los como modos explícitos em uma futura versão do MySQL. Para garantir a compatibilidade no MySQL 5.7 com o modo SQL estrito do MySQL 5.6 e fornecer tempo adicional para que as aplicações afetadas sejam modificadas, os seguintes comportamentos são aplicáveis:

- `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` não fazem parte do modo SQL estrito, mas é intencional que sejam usados junto com o modo estrito. Como um lembrete, um aviso ocorre se eles forem habilitados sem também habilitar o modo estrito ou vice-versa.

- `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` estão habilitados por padrão.

Com as mudanças anteriores, a verificação de dados mais rigorosa ainda está habilitada por padrão, mas os modos individuais podem ser desativados em ambientes onde atualmente seja desejável ou necessário fazê-lo.
