### 13.1.16 Declarações CREATE PROCEDURE e CREATE FUNCTION

```sql
CREATE
    [DEFINER = user]
    PROCEDURE sp_name ([proc_parameter[,...]])
    [characteristic ...] routine_body

CREATE
    [DEFINER = user]
    FUNCTION sp_name ([func_parameter[,...]])
    RETURNS type
    [characteristic ...] routine_body

proc_parameter:
    [ IN | OUT | INOUT ] param_name type

func_parameter:
    param_name type

type:
    Any valid MySQL data type

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

routine_body:
    Valid SQL routine statement
```

Essas declarações são usadas para criar uma rotina armazenada (um procedimento ou função armazenada). Ou seja, a rotina especificada torna-se conhecida pelo servidor. Por padrão, uma rotina armazenada está associada ao banco de dados padrão. Para associar explicitamente a rotina a um determinado banco de dados, especifique o nome como *`db_name.sp_name`* ao criá-la.

A instrução `CREATE FUNCTION` também é usada no MySQL para suportar funções carregáveis. Veja Seção 13.7.3.1, “Instrução CREATE FUNCTION para Funções Carregáveis”. Uma função carregável pode ser considerada uma função armazenada externa. As funções armazenadas compartilham seu namespace com as funções carregáveis. Veja Seção 9.2.5, “Parsimetria e Resolução de Nomes de Função”, para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções.

Para invocar um procedimento armazenado, use a instrução `CALL` (consulte Seção 13.2.1, "Instrução CALL"). Para invocar uma função armazenada, consulte-a em uma expressão. A função retorna um valor durante a avaliação da expressão.

`CREATE PROCEDURE` e `CREATE FUNCTION` exigem o privilégio `CREATE ROUTINE`. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor do *`user`*, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, `CREATE FUNCTION` pode exigir o privilégio `SUPER`, conforme discutido na Seção 23.7, “Registro Binário de Programas Armazenados”.

Por padrão, o MySQL concede automaticamente os privilégios de `ALTER ROUTINE` e `EXECUTE` ao criador da rotina. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges` (server-system-variables.html#sysvar\_automatic\_sp\_privileges). Consulte Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da execução da rotina, conforme descrito mais adiante nesta seção.

Se o nome da rotina for o mesmo do nome de uma função SQL integrada, ocorrerá um erro de sintaxe, a menos que você use um espaço entre o nome e os parênteses seguintes ao definir a rotina ou invocá-la posteriormente. Por essa razão, evite usar os nomes de funções SQL existentes para suas próprias rotinas armazenadas.

O modo SQL `IGNORE_SPACE` se aplica a funções embutidas, não a rotinas armazenadas. É sempre permitido ter espaços após o nome de uma rotina armazenada, independentemente de o `IGNORE_SPACE` estar habilitado ou

A lista de parâmetros entre parênteses deve estar sempre presente. Se não houver parâmetros, deve-se usar uma lista de parâmetros vazia de `()`. Os nomes dos parâmetros não são sensíveis ao caso.

Cada parâmetro é um parâmetro `IN` por padrão. Para especificar de outra forma para um parâmetro, use a palavra-chave `OUT` ou `INOUT` antes do nome do parâmetro.

Nota

Especificar um parâmetro como `IN`, `OUT` ou `INOUT` é válido apenas para um `PROCEDURE`. Para uma `FUNCTION`, os parâmetros são sempre considerados como parâmetros `IN`.

Um parâmetro `IN` passa um valor para um procedimento. O procedimento pode modificar o valor, mas a modificação não é visível para o chamador quando o procedimento retorna. Um parâmetro `OUT` passa um valor do procedimento de volta para o chamador. Seu valor inicial é `NULL` dentro do procedimento, e seu valor é visível para o chamador quando o procedimento retorna. Um parâmetro `INOUT` é inicializado pelo chamador, pode ser modificado pelo procedimento e qualquer alteração feita pelo procedimento é visível para o chamador quando o procedimento retorna.

Para cada parâmetro `OUT` ou `INOUT`, passe uma variável definida pelo usuário na instrução `CALL` (call.html) que invoca o procedimento para que você possa obter seu valor quando o procedimento retornar. Se você estiver chamando o procedimento a partir de outro procedimento armazenado ou função, também pode passar um parâmetro de rotina ou uma variável de rotina local como um parâmetro `OUT` ou `INOUT`. Se você estiver chamando o procedimento a partir de um gatilho, também pode passar `NEW.col_name` como um parâmetro `OUT` ou `INOUT`.

Para obter informações sobre o efeito das condições não tratadas nos parâmetros do procedimento, consulte Seção 13.6.7.8, “Tratamento de Condições e Parâmetros OUT ou INOUT”.

Os parâmetros de rotina não podem ser referenciados em declarações preparadas dentro da rotina; veja Seção 23.8, “Restrições de Programas Armazenados”.

O exemplo a seguir mostra um procedimento armazenado simples que, dado um código de país, conta o número de cidades desse país que aparecem na tabela `cidade` do banco de dados `world`. O código de país é passado usando um parâmetro `IN`, e o número de cidades é retornado usando um parâmetro `OUT`:

```sql
mysql> delimiter //

mysql> CREATE PROCEDURE citycount (IN country CHAR(3), OUT cities INT)
       BEGIN
         SELECT COUNT(*) INTO cities FROM world.city
         WHERE CountryCode = country;
       END//
Query OK, 0 rows affected (0.01 sec)

mysql> delimiter ;

mysql> CALL citycount('JPN', @cities); -- cities in Japan
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|     248 |
+---------+
1 row in set (0.00 sec)

mysql> CALL citycount('FRA', @cities); -- cities in France
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|      40 |
+---------+
1 row in set (0.00 sec)
```

O exemplo usa o comando `delimiter` do cliente `mysql` para alterar o delimitador da instrução de `;` para `//` enquanto o procedimento está sendo definido. Isso permite que o delimitador `;` usado no corpo do procedimento seja passado para o servidor em vez de ser interpretado pelo próprio `mysql`. Veja Seção 23.1, “Definindo Programas Armazenados”.

A cláusula `RETURNS` pode ser especificada apenas para uma `FUNCTION`, para a qual é obrigatória. Ela indica o tipo de retorno da função, e o corpo da função deve conter uma declaração `RETURN value`. Se a declaração `RETURN` retornar um valor de um tipo diferente, o valor é coercido para o tipo apropriado. Por exemplo, se uma função especifica um valor de `ENUM` ou `SET` na cláusula `RETURNS`, mas a declaração `RETURN` retorna um inteiro, o valor retornado da função é a string para o membro correspondente do `ENUM` da coleção de membros do `SET` (set.html).

A função a seguir recebe um parâmetro, realiza uma operação usando uma função SQL e retorna o resultado. Neste caso, não é necessário usar `delimiter`, pois a definição da função não contém delimitadores de declaração `;`.

```sql
mysql> CREATE FUNCTION hello (s CHAR(20))
    ->   RETURNS CHAR(50) DETERMINISTIC
    ->   RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT hello('world');
+----------------+
| hello('world') |
+----------------+
| Hello, world!  |
+----------------+
1 row in set (0.00 sec)
```

Os tipos de parâmetros e os tipos de retorno de funções podem ser declarados para usar qualquer tipo de dado válido. O atributo `COLLATE` pode ser usado se precedido por uma especificação de `CHARACTER SET`.

O *`routine_body`* consiste em uma instrução de rotina SQL válida. Isso pode ser uma instrução simples, como `SELECT` ou `INSERT`, ou uma instrução composta escrita usando `BEGIN` e `END`. As instruções compostas podem conter declarações, loops e outras instruções de estrutura de controle. A sintaxe dessas instruções é descrita em Seção 13.6, “Instruções Compostas”. Na prática, as funções armazenadas tendem a usar instruções compostas, a menos que o corpo consista em uma única instrução `RETURN`.

O MySQL permite que rotinas contenham instruções DDL, como `CREATE` e `DROP`. O MySQL também permite que procedimentos armazenados (mas não funções armazenadas) contenham instruções de transação SQL, como `COMMIT`. As funções armazenadas não podem conter instruções que realizem um commit ou rollback explícito ou implícito. O suporte para essas instruções não é exigido pelo padrão SQL, que afirma que cada fornecedor de SGBD pode decidir se permite ou

As declarações que retornam um conjunto de resultados podem ser usadas dentro de um procedimento armazenado, mas não dentro de uma função armazenada. Essa proibição inclui declarações `SELECT` que não têm a cláusula `INTO var_list` e outras declarações como `SHOW`, `EXPLAIN` e `CHECK TABLE`. Para declarações que podem ser determinadas no momento da definição da função para retornar um conjunto de resultados, ocorre um erro `Não permitido retornar um conjunto de resultados de uma função` (`ER_SP_NO_RETSET`). Para declarações que podem ser determinadas apenas no tempo de execução para retornar um conjunto de resultados, ocorre um erro `O procedimento %s não pode retornar um conjunto de resultados no contexto dado` (`ER_SP_BADSELECT`).

As declarações `USE` dentro de rotinas armazenadas não são permitidas. Quando uma rotina é invocada, uma `USE db_name` implícita é realizada (e desfeita quando a rotina termina). Isso faz com que a rotina tenha o banco de dados padrão especificado enquanto estiver sendo executada. Referências a objetos em bancos de dados diferentes do banco de dados padrão da rotina devem ser qualificadas com o nome do banco de dados apropriado.

Para obter informações adicionais sobre declarações que não são permitidas em rotinas armazenadas, consulte Seção 23.8, “Restrições em Programas Armazenados”.

Para obter informações sobre como invocar procedimentos armazenados a partir de programas escritos em uma linguagem que tenha uma interface MySQL, consulte Seção 13.2.1, "Instrução CALL".

O MySQL armazena o valor da variável de sistema `sql_mode` em vigor quando uma rotina é criada ou alterada, e sempre executa a rotina com esse valor em vigor, *independentemente do modo SQL do servidor atual quando a rotina começa a ser executada*.

A mudança do modo SQL do invocante para o modo da rotina ocorre após a avaliação dos argumentos e a atribuição dos valores resultantes aos parâmetros da rotina. Se você definir uma rotina no modo SQL rigoroso, mas invocá-la no modo não rigoroso, a atribuição dos argumentos aos parâmetros da rotina não ocorrerá no modo rigoroso. Se você precisar que as expressões passadas para uma rotina sejam atribuídas no modo SQL rigoroso, você deve invocar a rotina com o modo rigoroso em vigor.

A característica `COMMENT` é uma extensão do MySQL e pode ser usada para descrever a rotina armazenada. Essa informação é exibida pelas instruções `SHOW CREATE PROCEDURE` e `SHOW CREATE FUNCTION`.

A característica `LANGUAGE` indica o idioma em que a rotina foi escrita. O servidor ignora essa característica; apenas rotinas SQL são suportadas.

Uma rotina é considerada “determinística” se sempre produzir o mesmo resultado para os mesmos parâmetros de entrada e “não determinística” caso contrário. Se nenhuma das opções `DETERMINISTIC` ou `NOT DETERMINISTIC` for especificada na definição da rotina, o padrão é `NOT DETERMINISTIC`. Para declarar que uma função é determinística, você deve especificar `DETERMINISTIC` explicitamente.

A avaliação da natureza de uma rotina é baseada na "honestidade" do criador: o MySQL não verifica se uma rotina declarada como `DETERMINISTIC` está livre de instruções que produzem resultados não determinísticos. No entanto, declarar uma rotina incorretamente pode afetar os resultados ou o desempenho. Declarar uma rotina não determinística como `DETERMINISTIC` pode levar a resultados inesperados, fazendo com que o otimizador faça escolhas incorretas para o plano de execução. Declarar uma rotina determinística como `NONDETERMINISTIC` pode diminuir o desempenho, fazendo com que as otimizações disponíveis não sejam usadas.

Se o registro binário estiver habilitado, a característica `DETERMINISTIC` afeta quais definições de rotina o MySQL aceita. Veja Seção 23.7, “Registro Binário de Programas Armazenados”.

Uma rotina que contém a função `NOW()` (ou seus sinônimos) ou `RAND()` é não determinística, mas ainda pode ser segura para replicação. Para `NOW()`, o log binário inclui o timestamp e replica corretamente. `RAND()` também replica corretamente, desde que seja chamado apenas uma única vez durante a execução de uma rotina. (Você pode considerar o timestamp de execução da rotina e a semente do número aleatório como entradas implícitas que são idênticas na fonte e na replica.)

Várias características fornecem informações sobre a natureza do uso dos dados pela rotina. No MySQL, essas características são apenas indicativas. O servidor não as usa para restringir os tipos de instruções que uma rotina é permitida para executar.

- `CONTAINS SQL` indica que a rotina não contém instruções que leem ou escrevem dados. Isso é o padrão se nenhuma dessas características for especificada explicitamente. Exemplos dessas instruções são `SET @x = 1` ou `DO RELEASE_LOCK('abc')`, que são executadas, mas não leem nem escrevem dados.

- `NO SQL` indica que a rotina não contém instruções SQL.

- `LEIA DADOS SQL` indica que a rotina contém instruções que leem dados (por exemplo, `SELECT`), mas não instruções que escrevem dados.

- `MODIFICA DADOS DO SQL` indica que a rotina contém instruções que podem gravar dados (por exemplo, `INSERT` ou `DELETE`).

A característica `SQL SECURITY` pode ser `DEFINER` ou `INVOKER` para especificar o contexto de segurança, ou seja, se a rotina executa usando os privilégios da conta nomeada na cláusula `DEFINER` ou do usuário que a invoca. Essa conta deve ter permissão para acessar o banco de dados com o qual a rotina está associada. O valor padrão é `DEFINER`. O usuário que invoca a rotina deve ter o privilégio `EXECUTE`, assim como a conta `DEFINER` se a rotina for executada no contexto de segurança do definidor.

A cláusula `DEFINER` especifica a conta MySQL a ser usada ao verificar os privilégios de acesso no momento da execução rotineira para rotinas que possuem a característica `SQL SECURITY DEFINER`.

Se a cláusula `DEFINER` estiver presente, o valor de *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores de *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança de rotinas armazenadas.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a instrução `CREATE PROCEDURE` ou `CREATE FUNCTION`. Isso é o mesmo que especificar `DEFINER = CURRENT_USER` explicitamente.

Dentro do corpo de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, a função `CURRENT_USER` retorna o valor `DEFINER` da rotina. Para informações sobre auditoria de usuários dentro de rotinas armazenadas, consulte Seção 6.2.18, “Auditorização de Atividade de Conta Baseada em SQL”.

Considere o seguinte procedimento, que exibe um contador do número de contas do MySQL listadas na tabela de sistema `mysql.user`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento é atribuído à conta `DEFINER` de `'admin'@'localhost'`, independentemente de qual usuário o defina. Ele é executado com os privilégios dessa conta, independentemente de qual usuário o invocar (porque a característica de segurança padrão é `DEFINER`). O procedimento tem sucesso ou falha dependendo se o invocante tem o privilégio `EXECUTE` para ele e `'admin'@'localhost'` tem o privilégio `SELECT` para a tabela `mysql.user`.

Agora, suponha que o procedimento seja definido com a característica `SQL SECURITY INVOKER`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
SQL SECURITY INVOKER
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento ainda tem um `DEFINER` de `'admin'@'localhost'`, mas, neste caso, ele é executado com os privilégios do usuário que o invocou. Assim, o procedimento tem sucesso ou falha dependendo se o invocante tem o privilégio `EXECUTE` para ele e o privilégio `SELECT` para a tabela `mysql.user`.

O servidor lida com o tipo de dados de um parâmetro de rotina, variável local de rotina criada com `DECLARE` ou valor de retorno de função da seguinte forma:

- As atribuições são verificadas quanto a desalinhamentos de tipos de dados e estouro. Problemas de conversão e estouro resultam em avisos ou erros no modo SQL rigoroso.

- Apenas valores escalares podem ser atribuídos. Por exemplo, uma declaração como `SET x = (SELECT 1, 2)` é inválida.

- Para os tipos de dados de caracteres, se o `CHARACTER SET` for incluído na declaração, o conjunto de caracteres especificado e sua ordenação padrão serão usados. Se o atributo `COLLATE` também estiver presente, essa ordenação será usada em vez da ordenação padrão.

  Se `CHARACTER SET` e `COLLATE` não estiverem presentes, o conjunto de caracteres e a collation do banco de dados em vigor no momento da criação da rotina serão usados. Para evitar que o servidor use o conjunto de caracteres e a collation do banco de dados, forneça um atributo explícito `CHARACTER SET` e `COLLATE` para os parâmetros de dados de caracteres.

  Se você alterar o conjunto de caracteres ou a concordância padrão do banco de dados, as rotinas armazenadas que devem usar os novos padrões do banco de dados devem ser excluídas e recriadas.

  O conjunto de caracteres e a concordância do banco de dados são definidos pelo valor das variáveis de sistema `character_set_database` e `collation_database`. Para mais informações, consulte Seção 10.3.3, “Conjunto de caracteres e concordância do banco de dados”.
