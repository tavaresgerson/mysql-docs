### 5.1.10 Modos SQL do Servidor

O servidor MySQL pode operar em diferentes SQL modes e pode aplicar esses modos de forma diferente para clients distintos, dependendo do valor da system variable [`sql_mode`](server-system-variables.html#sysvar_sql_mode). Os DBAs podem definir o SQL mode global para corresponder aos requisitos operacionais do servidor do site, e cada aplicação pode definir seu SQL mode de sessão conforme seus próprios requisitos.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso torna mais fácil usar o MySQL em diferentes ambientes e usá-lo em conjunto com outros database servers.

* [Configurando o SQL Mode](sql-mode.html#sql-mode-setting "Setting the SQL Mode")
* [Os SQL Modes Mais Importantes](sql-mode.html#sql-mode-important "The Most Important SQL Modes")
* [Lista Completa de SQL Modes](sql-mode.html#sql-mode-full "Full List of SQL Modes")
* [SQL Modes de Combinação](sql-mode.html#sql-mode-combo "Combination SQL Modes")
* [Strict SQL Mode](sql-mode.html#sql-mode-strict "Strict SQL Mode")
* [Comparação da Keyword IGNORE e do Strict SQL Mode](sql-mode.html#ignore-strict-comparison "Comparison of the IGNORE Keyword and Strict SQL Mode")
* [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7")

Para respostas a perguntas frequentemente feitas sobre os SQL modes do servidor no MySQL, veja [Seção A.3, “FAQ do MySQL 5.7: Server SQL Mode”](faqs-sql-modes.html "A.3 MySQL 5.7 FAQ: Server SQL Mode").

Ao trabalhar com tabelas `InnoDB`, considere também a system variable [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode). Ela habilita verificações de error adicionais para tabelas `InnoDB`.

#### Configurando o SQL Mode

O SQL mode padrão no MySQL 5.7 inclui estes modos: [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by), [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables), [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date), [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) e [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution).

Estes modos foram adicionados ao SQL mode padrão no MySQL 5.7: Os modos [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) e [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables) foram adicionados no MySQL 5.7.5. O modo [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) foi adicionado no MySQL 5.7.7. Os modos [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) foram adicionados no MySQL 5.7.8. Para uma discussão adicional sobre estas mudanças no valor padrão do SQL mode, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

Para definir o SQL mode na inicialização do servidor, use a opção [`--sql-mode="modes"`](server-options.html#option_mysqld_sql-mode) na linha de comando, ou [`sql-mode="modes"`](server-options.html#option_mysqld_sql-mode) em um arquivo de opção como `my.cnf` (sistemas operacionais Unix) ou `my.ini` (Windows). *`modes`* é uma lista de diferentes modos separados por vírgulas. Para limpar o SQL mode explicitamente, defina-o como uma string vazia usando [`--sql-mode=""`](server-options.html#option_mysqld_sql-mode) na linha de comando, ou [`sql-mode=""`](server-options.html#option_mysqld_sql-mode) em um arquivo de opção.

Nota

Programas de instalação do MySQL podem configurar o SQL mode durante o processo de instalação. Se o SQL mode for diferente do padrão ou do que você espera, verifique uma configuração em um arquivo de opção que o servidor lê na inicialização.

Para alterar o SQL mode em tempo de execução, defina a system variable [`sql_mode`](server-system-variables.html#sysvar_sql_mode) global ou de sessão usando um statement [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"):

```sql
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

Definir a variável `GLOBAL` requer o privilégio [`SUPER`](privileges-provided.html#priv_super) e afeta a operação de todos os clients que se conectarem a partir daquele momento. Definir a variável `SESSION` afeta apenas o client atual. Cada client pode alterar seu valor de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) de sessão a qualquer momento.

Para determinar a configuração atual de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) global ou de sessão, selecione seu valor:

```sql
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

Importante

**SQL mode e particionamento definido pelo usuário.** Alterar o SQL mode do servidor após criar e inserir dados em partitioned tables pode causar grandes mudanças no comportamento de tais tabelas, e pode levar à perda ou corrupção de dados. É fortemente recomendado que você nunca altere o SQL mode depois de criar tabelas que empregam particionamento definido pelo usuário.

Ao replicar partitioned tables, SQL modes diferentes na source e na replica também podem levar a problemas. Para obter melhores resultados, você deve sempre usar o mesmo SQL mode do servidor na source e na replica.

Para mais informações, veja [Seção 22.6, “Restrictions and Limitations on Partitioning”](partitioning-limitations.html "22.6 Restrictions and Limitations on Partitioning").

#### Os SQL Modes Mais Importantes

Os valores de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) mais importantes são provavelmente estes:

* [`ANSI`](sql-mode.html#sqlmode_ansi)

  Este modo altera a sintaxe e o comportamento para se adequar mais de perto ao SQL padrão. É um dos [modos de combinação](sql-mode.html#sql-mode-combo "Combination SQL Modes") especiais listados no final desta seção.

* [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables)

  Se um valor não puder ser inserido como fornecido em uma transactional table, o statement é abortado. Para uma nontransactional table, o statement é abortado se o valor ocorrer em um statement de linha única ou na primeira linha de um statement de múltiplas linhas. Mais detalhes são fornecidos adiante nesta seção.

  A partir do MySQL 5.7.5, o SQL mode padrão inclui [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables).

* [`TRADITIONAL`](sql-mode.html#sqlmode_traditional)

  Faz com que o MySQL se comporte como um sistema de database SQL “tradicional”. Uma descrição simples deste modo é “gerar um error em vez de um warning” ao inserir um valor incorreto em uma column. É um dos [modos de combinação](sql-mode.html#sql-mode-combo "Combination SQL Modes") especiais listados no final desta seção.

  Nota

  Com o modo [`TRADITIONAL`](sql-mode.html#sqlmode_traditional) habilitado, um [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`UPDATE`](update.html "13.2.11 UPDATE Statement") é abortado assim que um error ocorre. Se você estiver usando um nontransactional storage engine, isso pode não ser o que você deseja, pois as alterações de dados feitas antes do error podem não ser rolled back, resultando em um update “parcialmente concluído”.

Quando este manual se refere a “strict mode”, significa um modo com um ou ambos [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables) ou [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables) habilitados.

#### Lista Completa de SQL Modes

A lista a seguir descreve todos os SQL modes suportados:

* [`ALLOW_INVALID_DATES`](sql-mode.html#sqlmode_allow_invalid_dates)

  Não realiza a checagem completa de datas. Verifica apenas se o mês está no range de 1 a 12 e o dia está no range de 1 a 31. Isso pode ser útil para aplicações Web que obtêm ano, mês e dia em três fields diferentes e armazenam exatamente o que o user inseriu, sem validação de data. Este modo se aplica às columns [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). Não se aplica às columns [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), que sempre requerem uma data válida.

  Com [`ALLOW_INVALID_DATES`](sql-mode.html#sqlmode_allow_invalid_dates) desabilitado, o servidor exige que os valores de mês e dia sejam legais, e não apenas no range de 1 a 12 e 1 a 31, respectivamente. Com o strict mode desabilitado, datas inválidas como `'2004-04-31'` são convertidas para `'0000-00-00'` e um warning é gerado. Com o strict mode habilitado, datas inválidas geram um error. Para permitir tais datas, habilite [`ALLOW_INVALID_DATES`](sql-mode.html#sqlmode_allow_invalid_dates).

* [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes)

  Trata `"` como um caractere de citação de identifier (como o caractere `` ` ``) e não como um caractere de citação de string. Você ainda pode usar `` ` `` para citar identifiers com este modo habilitado. Com [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes) habilitado, você não pode usar aspas duplas para citar strings literais porque elas são interpretadas como identifiers.

* [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero)

  O modo [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero) afeta o tratamento de divisão por zero, o que inclui [`MOD(N,0)`](mathematical-functions.html#function_mod). Para operações de alteração de dados ([`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement")), seu efeito também depende se o strict SQL mode está habilitado.

  + Se este modo não estiver habilitado, a divisão por zero insere `NULL` e não produz warning.

  + Se este modo estiver habilitado, a divisão por zero insere `NULL` e produz um warning.

  + Se este modo e o strict mode estiverem habilitados, a divisão por zero produz um error, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um warning.

  Para [`SELECT`](select.html "13.2.9 SELECT Statement"), a divisão por zero retorna `NULL`. Habilitar [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero) faz com que um warning seja produzido também, independentemente de o strict mode estar habilitado.

  [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero) está deprecated. [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero) não faz parte do strict mode, mas deve ser usado em conjunto com o strict mode e é habilitado por padrão. Um warning ocorre se [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero) for habilitado sem também habilitar o strict mode ou vice-versa. Para discussão adicional, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

  Como [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero) está deprecated; espere que ele seja removido em um release futuro do MySQL como um nome de modo separado e seu efeito seja incluído nos efeitos do strict SQL mode.

* [`HIGH_NOT_PRECEDENCE`](sql-mode.html#sqlmode_high_not_precedence)

  A precedência do operador [`NOT`](logical-operators.html#operator_not) é tal que expressões como `NOT a BETWEEN b AND c` são analisadas como `NOT (a BETWEEN b AND c)`. Em algumas versões mais antigas do MySQL, a expressão era analisada como `(NOT a) BETWEEN b AND c`. O antigo comportamento de precedência mais alta pode ser obtido habilitando o SQL mode [`HIGH_NOT_PRECEDENCE`](sql-mode.html#sqlmode_high_not_precedence).

  ```sql
  mysql> SET sql_mode = '';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 0
  mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 1
  ```

* [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space)

  Permite espaços entre um nome de função e o caractere `(`. Isso faz com que os nomes das built-in functions sejam tratados como reserved words. Como resultado, identifiers que são os mesmos que nomes de funções devem ser citados conforme descrito na [Seção 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names"). Por exemplo, como existe uma função [`COUNT()`](aggregate-functions.html#function_count), o uso de `count` como nome de table no statement a seguir causa um error:

  ```sql
  mysql> CREATE TABLE count (i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax
  ```

  O nome da table deve ser citado:

  ```sql
  mysql> CREATE TABLE `count` (i INT);
  Query OK, 0 rows affected (0.00 sec)
  ```

  O SQL mode [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space) se aplica às built-in functions, não às loadable functions ou stored functions. É sempre permitido ter espaços após o nome de uma loadable function ou stored function, independentemente de [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space) estar habilitado.

  Para discussão adicional de [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space), veja [Seção 9.2.5, “Function Name Parsing and Resolution”](function-resolution.html "9.2.5 Function Name Parsing and Resolution").

* [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user)

  Impede que o statement [`GRANT`](grant.html "13.7.1.4 GRANT Statement") crie automaticamente novas contas de user se o fizesse de outra forma, a menos que as informações de autenticação sejam especificadas. O statement deve especificar um password não vazio usando `IDENTIFIED BY` ou um authentication plugin usando `IDENTIFIED WITH`.

  É preferível criar contas MySQL com [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") em vez de [`GRANT`](grant.html "13.7.1.4 GRANT Statement"). [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) está deprecated e o SQL mode padrão inclui [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user). Atribuições a [`sql_mode`](server-system-variables.html#sysvar_sql_mode) que alteram o estado do modo [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) produzem um warning, exceto atribuições que definem [`sql_mode`](server-system-variables.html#sysvar_sql_mode) para `DEFAULT`. Espere que [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) seja removido em um release futuro do MySQL, e seu efeito seja habilitado o tempo todo (e para que [`GRANT`](grant.html "13.7.1.4 GRANT Statement") não crie mais contas).

  Anteriormente, antes que [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) fosse deprecated, uma razão para não habilitá-lo era que ele não era replication safe. Agora ele pode ser habilitado e o user management replication-safe pode ser realizado com `CREATE USER IF NOT EXISTS`, `DROP USER IF EXISTS` e `ALTER USER IF EXISTS` em vez de `GRANT`. Estes statements habilitam replication segura quando replicas podem ter grants diferentes daqueles na source. Veja [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"), [Seção 13.7.1.3, “DROP USER Statement”](drop-user.html "13.7.1.3 DROP USER Statement") e [Seção 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement").

* [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero)

  [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero) afeta o tratamento de columns `AUTO_INCREMENT`. Normalmente, você gera o próximo sequence number para a column inserindo `NULL` ou `0` nela. [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero) suprime este comportamento para `0`, de modo que apenas `NULL` gera o próximo sequence number.

  Este modo pode ser útil se `0` tiver sido armazenado na column `AUTO_INCREMENT` de uma table. (Armazenar `0` não é uma prática recomendada, a propósito.) Por exemplo, se você fizer o dump da table com [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e depois carregá-la novamente, o MySQL normalmente gera novos sequence numbers quando encontra os valores `0`, resultando em uma table com conteúdo diferente daquela que foi dumpada. Habilitar [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero) antes de recarregar o dump file resolve este problema. Por esta razão, [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") inclui automaticamente em sua output um statement que habilita [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero).

* [`NO_BACKSLASH_ESCAPES`](sql-mode.html#sqlmode_no_backslash_escapes)

  Habilitar este modo desabilita o uso do caractere de barra invertida (`\`) como um caractere escape dentro de strings e identifiers. Com este modo habilitado, a barra invertida se torna um caractere comum como qualquer outro, e a escape sequence padrão para expressões [`LIKE`](string-comparison-functions.html#operator_like) é alterada para que nenhum caractere escape seja usado.

* [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create)

  Ao criar uma table, ignora todas as diretivas `INDEX DIRECTORY` e `DATA DIRECTORY`. Esta opção é útil em replication servers de replica.

* [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution)

  Controla a substituição automática do default storage engine quando um statement como [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") especifica um storage engine que está desabilitado ou não compilado.

  Por padrão, [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution) está habilitado.

  Como os storage engines podem ser plugable em tempo de execução, os engines indisponíveis são tratados da mesma forma:

  Com [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution) desabilitado, para [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") o default engine é usado e um warning ocorre se o engine desejado estiver indisponível. Para [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), um warning ocorre e a table não é alterada.

  Com [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution) habilitado, um error ocorre e a table não é criada ou alterada se o engine desejado estiver indisponível.

* [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options)

  Não imprimir opções de column específicas do MySQL na output de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"). Este modo é usado pelo [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") em modo de portabilidade.

  Nota

  A partir do MySQL 5.7.22, [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options) está deprecated. Ele é removido no MySQL 8.0.

* [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options)

  Não imprimir opções de Index específicas do MySQL na output de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"). Este modo é usado pelo [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") em modo de portabilidade.

  Nota

  A partir do MySQL 5.7.22, [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options) está deprecated. Ele é removido no MySQL 8.0.

* [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options)

  Não imprimir opções de table específicas do MySQL (como `ENGINE`) na output de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"). Este modo é usado pelo [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") em modo de portabilidade.

  Nota

  A partir do MySQL 5.7.22, [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options) está deprecated. Ele é removido no MySQL 8.0.

* [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction)

  A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado unsigned por padrão. Se o resultado teria sido negativo de outra forma, um error resulta:

  ```sql
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
  ```

  Se o SQL mode [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction) estiver habilitado, o resultado é negativo:

  ```sql
  mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  +-------------------------+
  | CAST(0 AS UNSIGNED) - 1 |
  +-------------------------+
  |                      -1 |
  +-------------------------+
  ```

  Se o resultado de tal operação for usado para atualizar uma column integer `UNSIGNED`, o resultado é truncado para o valor máximo do column type, ou truncado para 0 se [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction) estiver habilitado. Com o strict SQL mode habilitado, um error ocorre e a column permanece inalterada.

  Quando [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction) está habilitado, o resultado da subtração é signed, *mesmo que qualquer operando seja unsigned*. Por exemplo, compare o type da column `c2` na table `t1` com o da column `c2` na table `t2`:

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

  Isso significa que `BIGINT UNSIGNED` não é 100% utilizável em todos os contextos. Veja [Seção 12.10, “Cast Functions and Operators”](cast-functions.html "12.10 Cast Functions and Operators").

* [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date)

  O modo [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) afeta se o servidor permite `'0000-00-00'` como uma data válida. Seu efeito também depende se o strict SQL mode está habilitado.

  + Se este modo não estiver habilitado, `'0000-00-00'` é permitido e os inserts não produzem warning.

  + Se este modo estiver habilitado, `'0000-00-00'` é permitido e os inserts produzem um warning.

  + Se este modo e o strict mode estiverem habilitados, `'0000-00-00'` não é permitido e os inserts produzem um error, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e os inserts produzem um warning.

  [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) está deprecated. [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) não faz parte do strict mode, mas deve ser usado em conjunto com o strict mode e é habilitado por padrão. Um warning ocorre se [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) for habilitado sem também habilitar o strict mode ou vice-versa. Para discussão adicional, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

  Como [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) está deprecated; espere que ele seja removido em um release futuro do MySQL como um nome de modo separado e seu efeito seja incluído nos efeitos do strict SQL mode.

* [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date)

  O modo [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) afeta se o servidor permite datas nas quais a parte do ano é diferente de zero, mas a parte do mês ou do dia é 0. (Este modo afeta datas como `'2010-00-01'` ou `'2010-01-00'`, mas não `'0000-00-00'`. Para controlar se o servidor permite `'0000-00-00'`, use o modo [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date).) O efeito de [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) também depende se o strict SQL mode está habilitado.

  + Se este modo não estiver habilitado, datas com partes zero são permitidas e os inserts não produzem warning.

  + Se este modo estiver habilitado, datas com partes zero são inseridas como `'0000-00-00'` e produzem um warning.

  + Se este modo e o strict mode estiverem habilitados, datas com partes zero não são permitidas e os inserts produzem um error, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com partes zero são inseridas como `'0000-00-00'` e produzem um warning.

  [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) está deprecated. [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) não faz parte do strict mode, mas deve ser usado em conjunto com o strict mode e é habilitado por padrão. Um warning ocorre se [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) for habilitado sem também habilitar o strict mode ou vice-versa. Para discussão adicional, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

  Como [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) está deprecated; espere que ele seja removido em um release futuro do MySQL como um nome de modo separado e seu efeito seja incluído nos efeitos do strict SQL mode.

* [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by)

  Rejeita Queries para as quais a select list, a condição `HAVING` ou a lista `ORDER BY` referem-se a columns não agregadas que não estão nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes (determinadas exclusivamente) de columns `GROUP BY`.

  A partir do MySQL 5.7.5, o SQL mode padrão inclui [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by). (Antes do 5.7.5, o MySQL não detecta dependência funcional e [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) não é habilitado por padrão.)

  Uma extensão MySQL para o SQL padrão permite referências na cláusula `HAVING` a expressões com alias na select list. Antes do MySQL 5.7.5, habilitar [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) desabilita esta extensão, exigindo assim que a cláusula `HAVING` seja escrita usando expressões sem alias. A partir do MySQL 5.7.5, esta restrição é suspensa para que a cláusula `HAVING` possa se referir a aliases independentemente de [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) estar habilitado.

  Para discussão e exemplos adicionais, veja [Seção 12.19.3, “MySQL Handling of GROUP BY”](group-by-handling.html "12.19.3 MySQL Handling of GROUP BY").

* [`PAD_CHAR_TO_FULL_LENGTH`](sql-mode.html#sqlmode_pad_char_to_full_length)

  Por padrão, os espaços à direita são removidos dos valores de column [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") na recuperação. Se [`PAD_CHAR_TO_FULL_LENGTH`](sql-mode.html#sqlmode_pad_char_to_full_length) estiver habilitado, o trim não ocorre e os valores [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") recuperados são preenchidos até seu full length. Este modo não se aplica às columns [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), para as quais os espaços à direita são mantidos na recuperação.

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

* [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat)

  Trata [`||`](logical-operators.html#operator_or) como um operador de concatenação de string (o mesmo que [`CONCAT()`](string-functions.html#function_concat)) em vez de um sinônimo para [`OR`](logical-operators.html#operator_or).

* [`REAL_AS_FLOAT`](sql-mode.html#sqlmode_real_as_float)

  Trata [`REAL`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") como um sinônimo para [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"). Por padrão, o MySQL trata [`REAL`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") como um sinônimo para [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE").

* [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables)

  Habilita o strict SQL mode para todos os storage engines. Valores de dados inválidos são rejeitados. Para detalhes, veja [Strict SQL Mode](sql-mode.html#sql-mode-strict "Strict SQL Mode").

  Do MySQL 5.7.4 ao 5.7.7, [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables) inclui o efeito dos modos [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date). Para discussão adicional, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

* [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables)

  Habilita o strict SQL mode para transactional storage engines e, quando possível, para nontransactional storage engines. Para detalhes, veja [Strict SQL Mode](sql-mode.html#sql-mode-strict "Strict SQL Mode").

  Do MySQL 5.7.4 ao 5.7.7, [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables) inclui o efeito dos modos [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date). Para discussão adicional, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

#### SQL Modes de Combinação

Os seguintes modos especiais são fornecidos como atalhos para combinações de valores de modo da lista precedente.

* [`ANSI`](sql-mode.html#sqlmode_ansi)

  Equivalente a [`REAL_AS_FLOAT`](sql-mode.html#sqlmode_real_as_float), [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat), [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes), [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space) e (a partir do MySQL 5.7.5) [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by).

  O modo [`ANSI`](sql-mode.html#sqlmode_ansi) também faz com que o servidor retorne um error para queries onde uma set function *`S`* com uma outer reference `S(outer_ref)` não pode ser agregada na outer query contra a qual a outer reference foi resolvida. Este é um exemplo de tal query:

  ```sql
  SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
  ```

  Aqui, [`MAX(t1.b)`](aggregate-functions.html#function_max) não pode ser agregada na outer query porque aparece na cláusula `WHERE` dessa query. O SQL padrão requer um error nesta situação. Se o modo [`ANSI`](sql-mode.html#sqlmode_ansi) não estiver habilitado, o servidor trata `S(outer_ref)` em tais queries da mesma forma que interpretaria `S(const)`.

  Veja [Seção 1.6, “MySQL Standards Compliance”](compatibility.html "1.6 MySQL Standards Compliance").

* [`DB2`](sql-mode.html#sqlmode_db2)

  Equivalente a [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat), [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes), [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space), [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options), [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options), [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options).

  Nota

  A partir do MySQL 5.7.22, [`DB2`](sql-mode.html#sqlmode_db2) está deprecated. Ele é removido no MySQL 8.0.

* [`MAXDB`](sql-mode.html#sqlmode_maxdb)

  Equivalente a [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat), [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes), [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space), [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options), [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options), [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options), [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user).

  Nota

  A partir do MySQL 5.7.22, [`MAXDB`](sql-mode.html#sqlmode_maxdb) está deprecated. Ele é removido no MySQL 8.0.

* [`MSSQL`](sql-mode.html#sqlmode_mssql)

  Equivalente a [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat), [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes), [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space), [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options), [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options), [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options).

  Nota

  A partir do MySQL 5.7.22, [`MSSQL`](sql-mode.html#sqlmode_mssql) está deprecated. Ele é removido no MySQL 8.0.

* [`MYSQL323`](sql-mode.html#sqlmode_mysql323)

  Equivalente a [`MYSQL323`](sql-mode.html#sqlmode_mysql323), [`HIGH_NOT_PRECEDENCE`](sql-mode.html#sqlmode_high_not_precedence). Isso significa [`HIGH_NOT_PRECEDENCE`](sql-mode.html#sqlmode_high_not_precedence) mais alguns comportamentos de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") específicos do [`MYSQL323`](sql-mode.html#sqlmode_mysql323):

  + A exibição da column [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") não inclui atributos `DEFAULT` ou `ON UPDATE`.

  + A exibição da column string não inclui atributos de character set e collation. Para columns [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") e [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), se o collation for binary, `BINARY` é anexado ao column type.

  + A opção de table `ENGINE=engine_name` é exibida como `TYPE=engine_name`.

  + Para tabelas [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine"), o storage engine é exibido como `HEAP`.

  Nota

  A partir do MySQL 5.7.22, [`MYSQL323`](sql-mode.html#sqlmode_mysql323) está deprecated. Ele é removido no MySQL 8.0.

* [`MYSQL40`](sql-mode.html#sqlmode_mysql40)

  Equivalente a [`MYSQL40`](sql-mode.html#sqlmode_mysql40), [`HIGH_NOT_PRECEDENCE`](sql-mode.html#sqlmode_high_not_precedence). Isso significa [`HIGH_NOT_PRECEDENCE`](sql-mode.html#sqlmode_high_not_precedence) mais alguns comportamentos específicos do [`MYSQL40`](sql-mode.html#sqlmode_mysql40). Estes são os mesmos que para [`MYSQL323`](sql-mode.html#sqlmode_mysql323), exceto que [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") não exibe `HEAP` como o storage engine para tabelas [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine").

  Nota

  A partir do MySQL 5.7.22, [`MYSQL40`](sql-mode.html#sqlmode_mysql40) está deprecated. Ele é removido no MySQL 8.0.

* [`ORACLE`](sql-mode.html#sqlmode_oracle)

  Equivalente a [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat), [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes), [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space), [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options), [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options), [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options), [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user).

  Nota

  A partir do MySQL 5.7.22, [`ORACLE`](sql-mode.html#sqlmode_oracle) está deprecated. Ele é removido no MySQL 8.0.

* [`POSTGRESQL`](sql-mode.html#sqlmode_postgresql)

  Equivalente a [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat), [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes), [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space), [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options), [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options), [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options).

  Nota

  A partir do MySQL 5.7.22, [`POSTGRESQL`](sql-mode.html#sqlmode_postgresql) está deprecated. Ele é removido no MySQL 8.0.

* [`TRADITIONAL`](sql-mode.html#sqlmode_traditional)

  Antes do MySQL 5.7.4, e no MySQL 5.7.8 e posterior, [`TRADITIONAL`](sql-mode.html#sqlmode_traditional) é equivalente a [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables), [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables), [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date), [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) e [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution).

  Do MySQL 5.7.4 até 5.7.7, [`TRADITIONAL`](sql-mode.html#sqlmode_traditional) é equivalente a [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables), [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables), [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) e [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution). Os modos [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero) não são nomeados porque nessas versões seus efeitos estão incluídos nos efeitos do strict SQL mode ([`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables) ou [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables)). Assim, os efeitos de [`TRADITIONAL`](sql-mode.html#sqlmode_traditional) são os mesmos em todas as versões do MySQL 5.7 (e os mesmos do MySQL 5.6). Para discussão adicional, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

#### Strict SQL Mode

O Strict mode controla como o MySQL trata valores inválidos ou ausentes em data-change statements como [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Um valor pode ser inválido por várias razões. Por exemplo, ele pode ter o data type errado para a column, ou pode estar fora do range. Um valor está ausente quando uma nova linha a ser inserida não contém um valor para uma column `NOT NULL` que não tem uma cláusula `DEFAULT` explícita em sua definição. (Para uma column `NULL`, `NULL` é inserido se o valor estiver ausente.) O Strict mode também afeta DDL statements como [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

Se o strict mode não estiver em vigor, o MySQL insere valores ajustados para valores inválidos ou ausentes e produz warnings (veja [Seção 13.7.5.40, “SHOW WARNINGS Statement”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement")). No strict mode, você pode produzir este comportamento usando [`INSERT IGNORE`](insert.html "13.2.5 INSERT Statement") ou [`UPDATE IGNORE`](update.html "13.2.11 UPDATE Statement").

Para statements como [`SELECT`](select.html "13.2.9 SELECT Statement") que não alteram dados, valores inválidos geram um warning no strict mode, não um error.

O Strict mode produz um error para tentativas de criar um key que excede o key length máximo. Quando o strict mode não está habilitado, isso resulta em um warning e truncamento do key para o key length máximo.

O Strict mode não afeta se foreign key constraints são checados. [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) pode ser usado para isso. (Veja [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").)

O Strict SQL mode está em vigor se [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables) ou [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables) estiverem habilitados, embora os efeitos desses modos difiram um pouco:

* Para transactional tables, um error ocorre para valores inválidos ou ausentes em um data-change statement quando [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables) ou [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables) estiverem habilitados. O statement é abortado e rolled back.

* Para nontransactional tables, o comportamento é o mesmo para qualquer modo se o valor inválido ocorrer na primeira linha a ser inserida ou atualizada: O statement é abortado e a table permanece inalterada. Se o statement inserir ou modificar múltiplas linhas e o valor inválido ocorrer na segunda linha ou posterior, o resultado depende de qual strict mode está habilitado:

  + Para [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables), o MySQL retorna um error e ignora o resto das linhas. No entanto, como as linhas anteriores foram inseridas ou atualizadas, o resultado é um update parcial. Para evitar isso, use single-row statements, que podem ser abortados sem alterar a table.

  + Para [`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables), o MySQL converte um valor inválido para o valor válido mais próximo para a column e insere o valor ajustado. Se um valor estiver ausente, o MySQL insere o implicit default value para o data type da column. Em ambos os casos, o MySQL gera um warning em vez de um error e continua processando o statement. Os implicit defaults são descritos na [Seção 11.6, “Data Type Default Values”](data-type-defaults.html "11.6 Data Type Default Values").

O Strict mode afeta o tratamento de divisão por zero, zero dates e zeros em datas da seguinte forma:

* O Strict mode afeta o tratamento de divisão por zero, o que inclui [`MOD(N,0)`](mathematical-functions.html#function_mod):

  Para operações de alteração de dados ([`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement")):

  + Se o strict mode não estiver habilitado, a divisão por zero insere `NULL` e não produz warning.

  + Se o strict mode estiver habilitado, a divisão por zero produz um error, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um warning.

  Para [`SELECT`](select.html "13.2.9 SELECT Statement"), a divisão por zero retorna `NULL`. Habilitar o strict mode faz com que um warning seja produzido também.

* O Strict mode afeta se o servidor permite `'0000-00-00'` como uma data válida:

  + Se o strict mode não estiver habilitado, `'0000-00-00'` é permitido e os inserts não produzem warning.

  + Se o strict mode estiver habilitado, `'0000-00-00'` não é permitido e os inserts produzem um error, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e os inserts produzem um warning.

* O Strict mode afeta se o servidor permite datas nas quais a parte do ano é diferente de zero, mas a parte do mês ou do dia é 0 (datas como `'2010-00-01'` ou `'2010-01-00'`):

  + Se o strict mode não estiver habilitado, datas com partes zero são permitidas e os inserts não produzem warning.

  + Se o strict mode estiver habilitado, datas com partes zero não são permitidas e os inserts produzem um error, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com partes zero são inseridas como `'0000-00-00'` (o que é considerado válido com `IGNORE`) e produzem um warning.

Para mais informações sobre o strict mode em relação a `IGNORE`, veja [Comparação da Keyword IGNORE e do Strict SQL Mode](sql-mode.html#ignore-strict-comparison "Comparison of the IGNORE Keyword and Strict SQL Mode").

Antes do MySQL 5.7.4, e no MySQL 5.7.8 e posterior, o strict mode afeta o tratamento de divisão por zero, zero dates e zeros em datas em conjunto com os modos [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date). Do MySQL 5.7.4 até 5.7.7, os modos [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) não fazem nada quando nomeados explicitamente e seus efeitos estão incluídos nos efeitos do strict mode. Para discussão adicional, veja [Mudanças no SQL Mode no MySQL 5.7](sql-mode.html#sql-mode-changes "SQL Mode Changes in MySQL 5.7").

#### Comparação da Keyword IGNORE e do Strict SQL Mode

Esta seção compara o efeito na execução do statement da keyword `IGNORE` (que rebaixa errors para warnings) e do strict SQL mode (que eleva warnings para errors). Ela descreve quais statements eles afetam e a quais errors eles se aplicam.

A tabela a seguir apresenta uma comparação resumida do comportamento do statement quando o padrão é produzir um error versus um warning. Um exemplo de quando o padrão é produzir um error é inserir um `NULL` em uma column `NOT NULL`. Um exemplo de quando o padrão é produzir um warning é inserir um valor do data type errado em uma column (como inserir a string `'abc'` em uma integer column).

<table summary="Comparação do comportamento do statement quando o padrão é produzir um error versus um warning."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Modo Operacional</th> <th>Quando o Padrão do Statement é Error</th> <th>Quando o Padrão do Statement é Warning</th> </tr></thead><tbody><tr> <th>Sem <code>IGNORE</code> ou strict SQL mode</th> <td>Error</td> <td>Warning</td> </tr><tr> <th>Com <code>IGNORE</code></th> <td>Warning</td> <td>Warning (o mesmo que sem <code>IGNORE</code> ou strict SQL mode)</td> </tr><tr> <th>Com strict SQL mode</th> <td>Error (o mesmo que sem <code>IGNORE</code> ou strict SQL mode)</td> <td>Error</td> </tr><tr> <th>Com <code>IGNORE</code> e strict SQL mode</th> <td>Warning</td> <td>Warning</td> </tr></tbody></table>

Uma conclusão a ser tirada da table é que quando a keyword `IGNORE` e o strict SQL mode estão ambos em vigor, `IGNORE` tem precedência. Isso significa que, embora `IGNORE` e o strict SQL mode possam ser considerados opostos nos efeitos no tratamento de errors, eles não se anulam quando usados juntos.

* [O Efeito de IGNORE na Execução do Statement](sql-mode.html#ignore-effect-on-execution "The Effect of IGNORE on Statement Execution")
* [O Efeito do Strict SQL Mode na Execução do Statement](sql-mode.html#strict-sql-mode-effect-on-execution "The Effect of Strict SQL Mode on Statement Execution")

##### O Efeito de IGNORE na Execução do Statement

Vários statements no MySQL suportam uma keyword `IGNORE` opcional. Esta keyword faz com que o servidor rebaixe certos tipos de errors e gere warnings em seu lugar. Para um statement de múltiplas linhas, rebaixar um error para um warning pode permitir que uma linha seja processada. Caso contrário, `IGNORE` faz com que o statement pule para a próxima linha em vez de abortar. (Para errors que não podem ser ignorados, um error ocorre independentemente da keyword `IGNORE`.)

Exemplo: Se a table `t` tiver uma column Primary Key `i` contendo valores unique, a tentativa de inserir o mesmo valor de `i` em múltiplas linhas normalmente produz um duplicate-key error:

```sql
mysql> CREATE TABLE t (i INT NOT NULL PRIMARY KEY);
mysql> INSERT INTO t (i) VALUES(1),(1);
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
```

Com `IGNORE`, a linha que contém o duplicate key ainda não é inserida, mas um warning ocorre em vez de um error:

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

Exemplo: Se a table `t2` tiver uma column `NOT NULL` chamada `id`, a tentativa de inserir `NULL` produz um error no strict SQL mode:

```sql
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Se o SQL mode não for strict, `IGNORE` faz com que o `NULL` seja inserido como o column implicit default (0 neste caso), o que permite que a linha seja tratada sem ser pulada:

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

Estes statements suportam a keyword `IGNORE`:

* [`CREATE TABLE ... SELECT`](create-table.html "13.1.18 CREATE TABLE Statement"): `IGNORE` não se aplica às partes [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`SELECT`](select.html "13.2.9 SELECT Statement") do statement, mas sim aos inserts na table de linhas produzidas pelo [`SELECT`](select.html "13.2.9 SELECT Statement"). Linhas que duplicam uma linha existente em um valor unique key são descartadas.

* [`DELETE`](delete.html "13.2.2 DELETE Statement"): `IGNORE` faz com que o MySQL ignore errors durante o processo de exclusão de linhas.

* [`INSERT`](insert.html "13.2.5 INSERT Statement"): Com `IGNORE`, linhas que duplicam uma linha existente em um valor unique key são descartadas. Linhas definidas com valores que causariam errors de data conversion são definidas para os valores válidos mais próximos.

  Para partitioned tables onde nenhuma partition correspondente a um determinado valor é encontrada, `IGNORE` faz com que a operação de insert falhe silenciosamente para linhas contendo o valor não correspondente.

* [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement"): Com `IGNORE`, linhas que duplicam uma linha existente em um valor unique key são descartadas.

* [`UPDATE`](update.html "13.2.11 UPDATE Statement"): Com `IGNORE`, linhas para as quais ocorrem conflitos de duplicate-key em um valor unique key não são atualizadas. Linhas atualizadas com valores que causariam errors de data conversion são atualizadas para os valores válidos mais próximos.

A keyword `IGNORE` se aplica aos seguintes errors que podem ser ignorados:

* [`ER_BAD_NULL_ERROR`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_bad_null_error)
* [`ER_DUP_ENTRY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_dup_entry)
* [`ER_DUP_ENTRY_WITH_KEY_NAME`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_dup_entry_with_key_name)
* [`ER_DUP_KEY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_dup_key)
* [`ER_NO_PARTITION_FOR_GIVEN_VALUE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_partition_for_given_value)
* [`ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_partition_for_given_value_silent)
* [`ER_NO_REFERENCED_ROW_2`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_referenced_row_2)
* [`ER_ROW_DOES_NOT_MATCH_GIVEN_PARTITION_SET`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_row_does_not_match_given_partition_set)
* [`ER_ROW_IS_REFERENCED_2`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_row_is_referenced_2)
* [`ER_SUBQUERY_NO_1_ROW`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_subquery_no_1_row)
* [`ER_VIEW_CHECK_FAILED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_view_check_failed)

##### O Efeito do Strict SQL Mode na Execução do Statement

O servidor MySQL pode operar em diferentes SQL modes e pode aplicar esses modos de forma diferente para clients distintos, dependendo do valor da system variable [`sql_mode`](server-system-variables.html#sysvar_sql_mode). No “strict” SQL mode, o servidor eleva certos warnings para errors.

Por exemplo, no non-strict SQL mode, inserir a string `'abc'` em uma integer column resulta na conversão do valor para 0 e um warning:

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

No strict SQL mode, o valor inválido é rejeitado com um error:

```sql
mysql> SET sql_mode = 'STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
ERROR 1366 (HY000): Incorrect integer value: 'abc' for column 'i' at row 1
```

Para mais informações sobre as configurações possíveis da system variable [`sql_mode`](server-system-variables.html#sysvar_sql_mode), veja [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

O Strict SQL mode se aplica aos seguintes statements sob condições em que algum valor pode estar fora do range ou uma linha inválida é inserida ou excluída de uma table:

* [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement")
* [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")
* [`CREATE TABLE ... SELECT`](create-table.html "13.1.18 CREATE TABLE Statement")

* [`DELETE`](delete.html "13.2.2 DELETE Statement") (tanto single table quanto multiple table)

* [`INSERT`](insert.html "13.2.5 INSERT Statement")
* [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement")
* [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement")
* [`SELECT SLEEP()`](select.html "13.2.9 SELECT Statement")

* [`UPDATE`](update.html "13.2.11 UPDATE Statement") (tanto single table quanto multiple table)

Dentro de stored programs, statements individuais dos tipos listados acima são executados no strict SQL mode se o programa foi definido enquanto o strict mode estava em vigor.

O Strict SQL mode se aplica aos seguintes errors, que representam uma classe de errors em que um valor de input é inválido ou ausente. Um valor é inválido se tiver o data type errado para a column ou estiver fora do range. Um valor está ausente se uma nova linha a ser inserida não contiver um valor para uma column `NOT NULL` que não tem uma cláusula `DEFAULT` explícita em sua definição.

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

Devido ao desenvolvimento contínuo do MySQL definir novos errors, pode haver errors que não estão na lista precedente aos quais o strict SQL mode se aplica.

#### Mudanças no SQL Mode no MySQL 5.7

No MySQL 5.7.22, estes SQL modes estão deprecated e serão removidos no MySQL 8.0: [`DB2`](sql-mode.html#sqlmode_db2), [`MAXDB`](sql-mode.html#sqlmode_maxdb), [`MSSQL`](sql-mode.html#sqlmode_mssql), [`MYSQL323`](sql-mode.html#sqlmode_mysql323), [`MYSQL40`](sql-mode.html#sqlmode_mysql40), [`ORACLE`](sql-mode.html#sqlmode_oracle), [`POSTGRESQL`](sql-mode.html#sqlmode_postgresql), [`NO_FIELD_OPTIONS`](sql-mode.html#sqlmode_no_field_options), [`NO_KEY_OPTIONS`](sql-mode.html#sqlmode_no_key_options), [`NO_TABLE_OPTIONS`](sql-mode.html#sqlmode_no_table_options).

No MySQL 5.7, o SQL mode [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) é habilitado por padrão porque o processamento de `GROUP BY` se tornou mais sofisticado para incluir a detecção de functional dependencies. No entanto, se você descobrir que ter [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) habilitado faz com que queries para aplicações existentes sejam rejeitadas, qualquer uma destas ações deve restaurar a operação:

* Se for possível modificar uma query ofensora, faça-o, seja para que as columns não agregadas sejam funcionalmente dependentes das columns `GROUP BY`, ou referindo-se a columns não agregadas usando [`ANY_VALUE()`](miscellaneous-functions.html#function_any-value).

* Se não for possível modificar uma query ofensora (por exemplo, se ela for gerada por uma aplicação de terceiros), defina a system variable `sql_mode` na inicialização do servidor para não habilitar [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by).

No MySQL 5.7, os SQL modes [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) estão deprecated. O plano de longo prazo é que os três modos sejam incluídos no strict SQL mode e removidos como modos explícitos em um release futuro do MySQL. Para compatibilidade no MySQL 5.7 com o strict mode do MySQL 5.6 e para fornecer tempo adicional para que as aplicações afetadas sejam modificadas, os seguintes comportamentos se aplicam:

* [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) não fazem parte do strict SQL mode, mas a intenção é que sejam usados em conjunto com o strict mode. Como lembrete, um warning ocorre se eles forem habilitados sem também habilitar o strict mode ou vice-versa.

* [`ERROR_FOR_DIVISION_BY_ZERO`](sql-mode.html#sqlmode_error_for_division_by_zero), [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) e [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) são habilitados por padrão.

Com as mudanças precedentes, a checagem de dados mais rigorosa ainda está habilitada por padrão, mas os modos individuais podem ser desabilitados em ambientes onde atualmente seja desejável ou necessário fazê-lo.