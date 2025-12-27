### 15.1.21 Declarações `CREATE PROCEDURE` e `CREATE FUNCTION`

```
CREATE
    [DEFINER = user]
    PROCEDURE [IF NOT EXISTS] sp_name ([proc_parameter[,...]])
    [characteristic ...]
    [USING library_reference[, library_reference][, ...]]
    routine_body

CREATE
    [DEFINER = user]
    FUNCTION [IF NOT EXISTS] sp_name ([func_parameter[,...]])
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
  | LANGUAGE {SQL | JAVASCRIPT }
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

library_reference:
    [database.]library_name [[AS] alias]

routine_body:
    SQL routine | AS JavaScript statements
```

Essas declarações são usadas para criar uma rotina armazenada (uma rotina armazenada ou função). Ou seja, a rotina especificada torna-se conhecida pelo servidor. Por padrão, uma rotina armazenada é associada à base de dados padrão. Para associar explicitamente a rotina a uma base de dados específica, especifique o nome como *`db_name.sp_name`* ao criá-la.

A declaração `CREATE FUNCTION` também é usada no MySQL para suportar funções carregáveis. Veja a Seção 15.7.4.1, “Declaração CREATE FUNCTION para Funções Carregáveis”. Uma função carregável pode ser considerada uma função armazenada externa. Rotinas armazenadas compartilham seu namespace com funções carregáveis. Veja a Seção 11.2.5, “Parsimetria e Resolução de Nomes de Funções”, para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções.

Para invocar uma rotina armazenada, use a declaração `CALL` (veja a Seção 15.2.1, “Declaração CALL”). Para invocar uma função armazenada, consulte-a em uma expressão. A função retorna um valor durante a avaliação da expressão.

`CREATE PROCEDURE` e `CREATE FUNCTION` requerem o privilégio `CREATE ROUTINE`. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor de *`user`*, conforme discutido na Seção 27.8, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, a `CREATE FUNCTION` pode exigir o privilégio `SUPER`, conforme discutido na Seção 27.9, “Registro Binário de Programas Armazenados”.

Por padrão, o MySQL concede automaticamente os privilégios `ALTER ROUTINE` e `EXECUTE` ao criador da rotina. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges`. Veja a Seção 27.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da execução da rotina, conforme descrito mais adiante nesta seção.

Se o nome da rotina for o mesmo do nome de uma função SQL integrada, ocorrerá um erro sintático, a menos que você use um espaço entre o nome e os parênteses seguintes ao definir a rotina ou invocá-la mais tarde. Por essa razão, evite usar os nomes de funções SQL integradas para suas próprias rotinas armazenadas.

O modo SQL `IGNORE_SPACE` se aplica a funções integradas, não a rotinas armazenadas. Sempre é permitido ter espaços após o nome de uma rotina armazenada, independentemente de `IGNORE_SPACE` estar habilitado.

`IF NOT EXISTS` impede que um erro ocorra se já existir uma rotina com o mesmo nome. Esta opção é suportada tanto com `CREATE FUNCTION` quanto com `CREATE PROCEDURE`.

Se uma função integrada com o mesmo nome já existir, tentar criar uma função armazenada com `CREATE FUNCTION ... IF NOT EXISTS` terá sucesso com um aviso indicando que ela tem o mesmo nome de uma função nativa; isso não é diferente quando se executa a mesma declaração `CREATE FUNCTION` sem especificar `IF NOT EXISTS`.

Se uma função carregável com o mesmo nome já existir, tentar criar uma função armazenada usando `IF NOT EXISTS` terá sucesso com um aviso. Isso é o mesmo que sem especificar `IF NOT EXISTS`.

Consulte Resolução de Nome de Função para obter mais informações.

A lista de parâmetros fechada entre parênteses deve estar sempre presente. Se não houver parâmetros, deve ser usada uma lista de parâmetros vazia de `()`. Os nomes dos parâmetros não são sensíveis ao caso.

Cada parâmetro é um parâmetro `IN` por padrão. Para especificar de outra forma para um parâmetro, use a palavra-chave `OUT` ou `INOUT` antes do nome do parâmetro.

Nota

Especificar um parâmetro como `IN`, `OUT` ou `INOUT` é válido apenas para uma `PROCEDURE`. Para uma `FUNCTION`, os parâmetros são sempre considerados parâmetros `IN`.

Um parâmetro `IN` passa um valor para uma procedure. A procedure pode modificar o valor, mas a modificação não é visível para o chamador quando a procedure retorna. Um parâmetro `OUT` passa um valor da procedure de volta para o chamador. Seu valor inicial é `NULL` dentro da procedure, e seu valor é visível para o chamador quando a procedure retorna. Um parâmetro `INOUT` é inicializado pelo chamador, pode ser modificado pela procedure, e qualquer alteração feita pela procedure é visível para o chamador quando a procedure retorna.

Para cada `OUT` ou `INOUT` parâmetro, passe uma variável definida pelo usuário na instrução `CALL` que invoca a procedure para que você possa obter seu valor quando a procedure retorna. Se você estiver chamando a procedure de dentro de outra procedure armazenada ou função, também pode passar um parâmetro de rotina ou variável de rotina local como um parâmetro `OUT` ou `INOUT`. Se você estiver chamando a procedure de dentro de um gatilho, também pode passar `NEW.col_name` como um parâmetro `OUT` ou `INOUT`.

Para informações sobre o efeito das condições não tratadas nos parâmetros da procedure, consulte a Seção 15.6.7.8, “Tratamento de Condições e Parâmetros OUT ou INOUT”.

Os parâmetros de rotina não podem ser referenciados em instruções preparadas dentro da rotina; consulte a Seção 27.10, “Restrições em Programas Armazenados”.

O exemplo seguinte mostra uma procedure armazenada simples que, dado um código de país, conta o número de cidades para esse país que aparecem na tabela `city` do banco de dados `world`. O código de país é passado usando um parâmetro `IN`, e o contagem de cidades é retornado usando um parâmetro `OUT`:

```
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

O exemplo usa o comando `delimiter` do cliente **mysql** para alterar o delimitador da instrução de `;` para `//` enquanto o procedimento está sendo definido. Isso permite que o delimitador `;` usado no corpo do procedimento seja passado para o servidor em vez de ser interpretado pelo próprio **mysql**. Veja a Seção 27.1, “Definindo Programas Armazenados”.

A cláusula `RETURNS` pode ser especificada apenas para uma `FUNCTION`, para a qual é obrigatória. Ela indica o tipo de retorno da função, e o corpo da função deve conter uma declaração `RETURN value`. Se a declaração `RETURN` retornar um valor de um tipo diferente, o valor é coercido para o tipo apropriado. Por exemplo, se uma função especifica um valor `ENUM` ou `SET` na cláusula `RETURNS`, mas a declaração `RETURN` retorna um inteiro, o valor retornado da função é a string para o membro correspondente do `ENUM` do conjunto de membros do `SET`.

O seguinte exemplo de função recebe um parâmetro, realiza uma operação usando uma função SQL e retorna o resultado. Neste caso, não é necessário usar `delimiter` porque a definição da função não contém delimitadores internos de declarações `;`.

```
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

Os tipos de parâmetros e tipos de retorno da função podem ser declarados para usar qualquer tipo de dado válido. O atributo `COLLATE` pode ser usado se precedido por uma especificação de `CHARACTER SET`.

O *`routine_body`* consiste em uma instrução de rotina SQL válida. Isso pode ser uma instrução simples, como `SELECT` ou `INSERT`, ou uma instrução composta escrita usando `BEGIN` e `END`. Instruções compostas podem conter declarações, loops e outras instruções de estrutura de controle. A sintaxe dessas instruções é descrita na Seção 15.6, “Sintaxe de Instrução Composta”. Na prática, as funções armazenadas tendem a usar instruções compostas, a menos que o corpo consista em uma única instrução `RETURN`.

A palavra-chave `AS` é usada para indicar que o corpo da rotina que segue é escrito em uma linguagem diferente do SQL; ela vem imediatamente antes do delimitador ou aspas dolarizadas de abertura do corpo da rotina. Veja a Seção 27.3, “Programas Armazenados em JavaScript”.

O MySQL permite que as rotinas contenham instruções DDL, como `CREATE` e `DROP`. O MySQL também permite que os procedimentos armazenados (mas não as funções armazenadas) contenham instruções de transação SQL, como `COMMIT`. As funções armazenadas podem não conter instruções que realizem um commit ou rollback explícito ou implícito. O suporte para essas instruções não é exigido pelo padrão SQL, que afirma que cada fornecedor de SGBD pode decidir se permite-as.

Instruções que retornam um conjunto de resultados podem ser usadas dentro de um procedimento armazenado, mas não dentro de uma função armazenada. Essa proibição inclui instruções `SELECT` que não têm uma cláusula `INTO var_list` e outras instruções como `SHOW`, `EXPLAIN` e `CHECK TABLE`. Para instruções que podem ser determinadas no momento da definição da função para retornar um conjunto de resultados, ocorre um erro `ER_SP_NO_RETSET` (`ER_SP_NO_RETSET`). Para instruções que podem ser determinadas apenas no tempo de execução para retornar um conjunto de resultados, ocorre um erro `ER_SP_BADSELECT` (`ER_SP_BADSELECT`) para a `PROCEDURE %s não pode retornar um conjunto de resultados no contexto dado`.

As instruções `USE` dentro de rotinas armazenadas não são permitidas. Quando uma rotina é invocada, uma `USE db_name` implícita é realizada (e desfeita quando a rotina termina). Isso faz com que a rotina tenha o banco de dados padrão especificado enquanto está sendo executada. Referências a objetos em bancos de dados diferentes do banco de dados padrão da rotina devem ser qualificadas com o nome do banco de dados apropriado.

Para obter informações adicionais sobre instruções que não são permitidas em rotinas armazenadas, consulte a Seção 27.10, “Restrições em Programas Armazenados”.

Para obter informações sobre como invocar procedimentos armazenados a partir de programas escritos em uma linguagem que tenha uma interface MySQL, consulte a Seção 15.2.1, “Instrução CALL”.

O MySQL armazena o ajuste da variável de sistema `sql_mode` em vigor quando uma rotina é criada ou alterada, e sempre executa a rotina com esse ajuste em vigor, *independentemente do modo SQL do servidor atual quando a rotina começa a ser executada*.

A mudança do modo SQL do invocante para o modo da rotina ocorre após a avaliação dos argumentos e a atribuição dos valores resultantes aos parâmetros da rotina. Se você definir uma rotina em modo SQL estrito, mas invocá-la em modo não estrito, a atribuição dos argumentos aos parâmetros da rotina não ocorre em modo estrito. Se você precisar que as expressões passadas para uma rotina sejam atribuídas em modo SQL estrito, você deve invocar a rotina com o modo estrito em vigor.

A característica `COMMENT` é uma extensão do MySQL e pode ser usada para descrever a rotina armazenada. Essa informação é exibida pelas instruções `SHOW CREATE PROCEDURE` e `SHOW CREATE FUNCTION`.

A característica `LANGUAGE` indica o idioma em que a rotina é escrita. Se o componente MLE (Multilingual Engine Component) não estiver disponível (consulte a Seção 7.5.7, “Componente do Motor Multilíngue (MLE”)”), o servidor ignora essa característica, e apenas rotinas SQL são suportadas. Se o componente MLE estiver presente, o servidor suporta rotinas armazenadas escritas em JavaScript (consulte a Seção 27.3, “Programas Armazenados em JavaScript”), que exigem que isso seja especificado usando `LANGUAGE JAVASCRIPT`. Independentemente de o componente MLE estar instalado, quando essa característica não for fornecida, a linguagem usada na rotina armazenada é assumida como SQL.

Uma rotina é considerada “determinística” se sempre produzir o mesmo resultado para os mesmos parâmetros de entrada, e “não determinística” caso contrário. Se nenhuma das características `DETERMINISTIC` ou `NOT DETERMINISTIC` for especificada na definição da rotina, o padrão é `NOT DETERMINISTIC`. Para declarar que uma função é determinística, você deve especificar `DETERMINISTIC` explicitamente.

A avaliação da natureza de uma rotina é baseada na “honestidade” do criador: o MySQL não verifica se uma rotina declarada `DETERMINISTIC` está livre de instruções que produzem resultados não determinísticos. No entanto, declarar uma rotina incorretamente como determinística pode afetar os resultados ou afetar o desempenho. Declarar uma rotina não determinística como `DETERMINISTIC` pode levar a resultados inesperados, fazendo com que o otimizador faça escolhas incorretas de plano de execução. Declarar uma rotina determinística como `NONDETERMINISTIC` pode diminuir o desempenho, fazendo com que as otimizações disponíveis não sejam usadas.

Se o registro binário estiver habilitado, a característica `DETERMINISTIC` afeta quais definições de rotina o MySQL aceita. Consulte a Seção 27.9, “Registro Binário de Programas Armazenados”.

Uma rotina que contém a função `NOW()` (ou seus sinônimos) ou `RAND()` é não determinística, mas ainda pode ser segura para replicação. Para `NOW()`, o log binário inclui o timestamp e replica corretamente. O `RAND()` também replica corretamente, desde que seja chamado apenas uma única vez durante a execução de uma rotina. (Você pode considerar o timestamp de execução da rotina e a semente do número aleatório como entradas implícitas que são idênticas na fonte e na replica.)

Várias características fornecem informações sobre a natureza do uso dos dados pela rotina. No MySQL, essas características são apenas indicativas. O servidor não as usa para restringir os tipos de instruções que uma rotina é permitida para executar.

* `CONTAINS SQL` indica que a rotina não contém instruções que leem ou escrevem dados. Isso é o padrão se nenhuma dessas características for dada explicitamente. Exemplos de tais instruções são `SET @x = 1` ou `DO RELEASE_LOCK('abc')`, que são executadas, mas não leem nem escrevem dados.

* `NO SQL` indica que a rotina não contém instruções SQL.

* `READS SQL DATA` indica que a rotina contém instruções que leem dados (por exemplo, `SELECT`), mas não instruções que escrevem dados.

* `MODIFIES SQL DATA` indica que a rotina contém instruções que podem escrever dados (por exemplo, `INSERT` ou `DELETE`).

A característica `SQL SECURITY` pode ser `DEFINER` ou `INVOKER` para especificar o contexto de segurança, ou seja, se a rotina executa usando os privilégios da conta nomeada na cláusula `DEFINER` ou do usuário que a invoca. Essa conta deve ter permissão para acessar o banco de dados com o qual a rotina está associada. O valor padrão é `DEFINER`. O usuário que invoca a rotina deve ter o privilégio `EXECUTE` para isso, assim como a conta `DEFINER` se a rotina for executada no contexto de segurança do definidor.

A cláusula `DEFINER` especifica a conta MySQL a ser usada ao verificar os privilégios de acesso no momento da execução da rotina para rotinas que têm a característica `SQL SECURITY DEFINER`.

Se a cláusula `DEFINER` estiver presente, o valor de *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores de *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 27.8, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança da rotina armazenada.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração `CREATE PROCEDURE` ou `CREATE FUNCTION`. Isso é o mesmo que especificar `DEFINER = CURRENT_USER` explicitamente.

Dentro do corpo de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, a função `CURRENT_USER` retorna o valor de `DEFINER` da rotina. Para informações sobre auditoria de usuários dentro de rotinas armazenadas, consulte a Seção 8.2.23, “Auditorização de Atividades de Conta Baseada em SQL”.

Considere o seguinte procedimento, que exibe um contador do número de contas MySQL listadas na tabela de sistema `mysql.user`:

```
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento é atribuído uma conta `DEFINER` de `'admin'@'localhost'` independentemente de qual usuário a definir. Ele é executado com os privilégios dessa conta, independentemente de qual usuário a invocar (porque a característica de segurança padrão é `DEFINER`). O procedimento tem sucesso ou falha dependendo se o invocante tem o privilégio `EXECUTE` para ele e `'admin'@'localhost'` tem o privilégio `SELECT` para a tabela `mysql.user`.

Agora, suponha que o procedimento seja definido com a característica `SQL SECURITY INVOKER`:

```
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
SQL SECURITY INVOKER
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento ainda tem uma `DEFINER` de `'admin'@'localhost'`, mas, neste caso, ele é executado com os privilégios do usuário invocante. Assim, o procedimento tem sucesso ou falha dependendo se o invocante tem o privilégio `EXECUTE` para ele e `'admin'@'localhost'` tem o privilégio `SELECT` para a tabela `mysql.user`.

Por padrão, quando uma rotina com a característica `SQL SECURITY DEFINER` é executada, o MySQL Server não define nenhum papel ativo para a conta MySQL nomeada na cláusula `DEFINER`, apenas os papéis padrão. A exceção é se a variável de sistema `activate_all_roles_on_login` estiver habilitada, caso em que o MySQL Server define todos os papéis concedidos ao usuário `DEFINER`, incluindo papéis obrigatórios. Quaisquer privilégios concedidos por meio de papéis não são, portanto, verificados por padrão quando a instrução `CREATE PROCEDURE` ou `CREATE FUNCTION` é emitida. Para programas armazenados, se a execução deve ocorrer com papéis diferentes dos padrão, o corpo do programa pode executar `SET ROLE` para ativar os papéis necessários. Isso deve ser feito com cautela, pois os privilégios atribuídos aos papéis podem ser alterados.

O servidor lida com o tipo de dados de um parâmetro de rotina, variável local de rotina criada com `DECLARE` ou valor de retorno de função da seguinte forma:

* As atribuições são verificadas quanto a desalinhamentos de tipos de dados e estouro. Problemas de conversão e estouro resultam em avisos ou erros no modo SQL rigoroso.

* Apenas valores escalares podem ser atribuídos. Por exemplo, uma declaração como `SET x = (SELECT 1, 2)` é inválida.

* Para tipos de dados de caracteres, se `CHARACTER SET` estiver incluído na declaração, o conjunto de caracteres especificado e sua ordenação padrão são usados. Se o atributo `COLLATE` também estiver presente, essa ordenação é usada em vez da ordenação padrão.

  Se `CHARACTER SET` e `COLLATE` não estiverem presentes, o conjunto de caracteres e a ordenação do banco de dados em vigor no momento da criação da rotina são usados. Para evitar que o servidor use o conjunto de caracteres e a ordenação do banco de dados, forneça um atributo `CHARACTER SET` explícito e um atributo `COLLATE` para os parâmetros de dados de caracteres.

  Se você alterar o conjunto de caracteres padrão ou a ordenação do banco de dados, as rotinas armazenadas que devem usar os novos padrões do banco de dados devem ser excluídas e recriadas.

  O conjunto de caracteres e a ordenação do banco de dados são definidos pelo valor das variáveis de sistema `character_set_database` e `collation_database`. Para mais informações, consulte a Seção 12.3.3, “Conjunto de caracteres e ordenação do banco de dados”.

O `CREATE PROCEDURE` e o `CREATE FUNCTION` suportam uma opção `USING` para importar uma ou mais bibliotecas JavaScript, sendo as referências listadas em um conjunto de parênteses após a palavra-chave `USING`. Cada referência tem a forma `[database.]library_name [[AS] alias]`, composta pelas partes listadas aqui:

* O nome do banco de dados ou esquema onde a biblioteca está localizada, seguido de um caractere ponto. Isso é opcional; se não especificado, o banco de dados em que a rotina armazenada foi criada é usado.

* O nome do banco de dados.
* Um alias opcional para o banco de dados, precedido por uma palavra-chave `AS` opcional. Isso pode ser usado para indicar um namespace para objetos do banco de dados dentro da função armazenada ou do procedimento armazenado.

Exemplo:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib2 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function g(n) {
    $>         return n * 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE FUNCTION foo(n INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    ->     USING (jslib.lib1 AS mylib, jslib.lib2 AS yourlib)
    ->     AS $$
    $>       return mylib.f(n) + yourlib.g(n)
    $>     $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT foo(8);
+--------+
| foo(8) |
+--------+
|     24 |
+--------+
1 row in set (0.00 sec)

mysql> SELECT * FROM information_schema.routines WHERE ROUTINE_NAME='foo'\G
*************************** 1. row ***************************
           SPECIFIC_NAME: foo
         ROUTINE_CATALOG: def
          ROUTINE_SCHEMA: jslib
            ROUTINE_NAME: foo
            ROUTINE_TYPE: FUNCTION
               DATA_TYPE: int
CHARACTER_MAXIMUM_LENGTH: NULL
  CHARACTER_OCTET_LENGTH: NULL
       NUMERIC_PRECISION: 10
           NUMERIC_SCALE: 0
      DATETIME_PRECISION: NULL
      CHARACTER_SET_NAME: NULL
          COLLATION_NAME: NULL
          DTD_IDENTIFIER: int
            ROUTINE_BODY: EXTERNAL
      ROUTINE_DEFINITION:
      return mylib.f(n) + otherlib.g(n)

           EXTERNAL_NAME: NULL
       EXTERNAL_LANGUAGE: JAVASCRIPT
         PARAMETER_STYLE: SQL
        IS_DETERMINISTIC: NO
         SQL_DATA_ACCESS: CONTAINS SQL
                SQL_PATH: NULL
           SECURITY_TYPE: DEFINER
                 CREATED: 2024-12-16 11:27:28
            LAST_ALTERED: 2024-12-16 11:27:28
                SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
         ROUTINE_COMMENT:
                 DEFINER: me@localhost
    CHARACTER_SET_CLIENT: utf8mb4
    COLLATION_CONNECTION: utf8mb4_0900_ai_ci
      DATABASE_COLLATION: utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

O `USING` pode ser incluído em uma declaração `CREATE PROCEDURE` ou `CREATE FUNCTION` apenas quando a declaração também inclui uma cláusula explícita `LANGUAGE=JAVASCRIPT`.

Para usar uma biblioteca específica no código de procedimento em JavaScript, você deve ter o privilégio `EXECUTE` naquela biblioteca. Isso é verificado ao executar uma declaração `CREATE FUNCTION` ou `CREATE PROCEDURE`, para cada biblioteca listada na cláusula `USING` da declaração.

`SQL SECURITY DEFINER` e `SQL SECURITY INVOKER` se aplicam a bibliotecas, independentemente de terem sido importadas diretamente ou indiretamente. Além disso, a variável de sistema `automatic_sp_privileges` se aplica a bibliotecas da mesma forma que se aplica a funções armazenadas e procedimentos armazenados.

Para obter informações sobre a criação de bibliotecas JavaScript que podem ser importadas com `USING`, consulte a Seção 15.1.19, “Declaração CREATE LIBRARY”. Para informações adicionais e exemplos, consulte também a Seção 27.3.8, “Usando Bibliotecas JavaScript”.