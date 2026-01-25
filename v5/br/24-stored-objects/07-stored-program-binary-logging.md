## 23.7 Log Binário de Programas Armazenados

O Binary Log contém informações sobre SQL statements que modificam o conteúdo do Database. Esta informação é armazenada na forma de “eventos” que descrevem as modificações. (Eventos de Binary Log diferem de objetos armazenados de eventos agendados.) O Binary Log tem dois propósitos importantes:

* Para Replicação, o Binary Log é usado em Source servers de Replicação como um registro dos statements a serem enviados aos Replica servers. O Source envia os eventos contidos em seu Binary Log para suas Replicas, que executam esses eventos para realizar as mesmas alterações de dados que foram feitas no Source. Consulte a Seção 16.2, “Implementação de Replicação”.

* Certas operações de recuperação de dados exigem o uso do Binary Log. Após um arquivo de backup ter sido restaurado, os eventos no Binary Log que foram registrados após o backup ser feito são reexecutados. Estes eventos atualizam os Databases a partir do ponto do backup. Consulte a Seção 7.3.2, “Usando Backups para Recuperação”.

No entanto, se o logging ocorrer no statement level, há certos problemas de Binary Logging em relação a Stored Programs (Stored Procedures e Functions, Triggers e Events):

* Em alguns casos, um statement pode afetar diferentes conjuntos de rows no Source e no Replica.

* Statements replicados executados em um Replica são processados pelo SQL Thread do Replica, que possui full privileges. É possível que uma Procedure siga diferentes caminhos de execução nos Source e Replica servers, de modo que um usuário possa escrever uma rotina contendo um statement perigoso que é executado apenas no Replica, onde é processado por um Thread que possui full privileges.

* Se um Stored Program que modifica dados for nondeterministic, ele não é repetível. Isso pode resultar em dados diferentes no Source e no Replica, ou fazer com que os dados restaurados difiram dos dados originais.

Esta seção descreve como o MySQL lida com o Binary Logging para Stored Programs. Ela estabelece as condições atuais que a implementação impõe ao uso de Stored Programs, e o que você pode fazer para evitar problemas de logging. Ela também fornece informações adicionais sobre as razões para estas condições.

A menos que indicado de outra forma, as observações aqui assumem que o Binary Logging está habilitado no server (consulte a Seção 5.4.4, “O Binary Log”). Se o Binary Log não estiver habilitado, a Replicação não é possível, nem o Binary Log está disponível para recuperação de dados. No MySQL 5.7, o Binary Logging não é habilitado por padrão, e você o habilita usando a opção `--log-bin`.

Em geral, os problemas aqui descritos resultam quando o Binary Logging ocorre no nível do SQL statement (statement-based binary logging). Se você usar row-based binary logging, o log contém as alterações feitas em rows individuais como resultado da execução de SQL statements. Quando rotinas ou Triggers são executados, as alterações de rows são logadas, e não os statements que fazem as alterações. Para Stored Procedures, isso significa que o statement `CALL` não é logado. Para Stored Functions, as alterações de rows feitas dentro da Function são logadas, e não a invocation da Function. Para Triggers, as alterações de rows feitas pelo Trigger são logadas. No lado do Replica, apenas as alterações de rows são vistas, e não a invocation do Stored Program.

O Binary Logging de formato misto (`binlog_format=MIXED`) usa statement-based binary logging, exceto para casos em que apenas o row-based binary logging é garantido para levar a resultados adequados. Com o formato misto, quando uma Stored Function, Stored Procedure, Trigger, Event ou Prepared Statement contém algo que não é seguro para statement-based binary logging, o statement inteiro é marcado como inseguro e logado em row format. Os statements usados para criar e dropar Procedures, Functions, Triggers e Events são sempre seguros e são logados em statement format. Para mais informações sobre logging row-based, misto e statement-based, e como os statements seguros e inseguros são determinados, consulte a Seção 16.2.1, “Formatos de Replicação”.

As condições para o uso de Stored Functions no MySQL podem ser resumidas da seguinte forma. Estas condições não se aplicam a Stored Procedures ou Event Scheduler events e não se aplicam a menos que o Binary Logging esteja habilitado.

* Para criar ou alterar uma Stored Function, você deve ter o privilege `SUPER`, além do privilege `CREATE ROUTINE` ou `ALTER ROUTINE` que é normalmente exigido. (Dependendo do valor `DEFINER` na definição da Function, `SUPER` pode ser exigido independentemente de o Binary Logging estar habilitado. Consulte a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

* Ao criar uma Stored Function, você deve declarar que ela é deterministic ou que não modifica dados. Caso contrário, ela pode ser insegura para recuperação de dados ou Replicação.

  Por padrão, para que um statement `CREATE FUNCTION` seja aceito, pelo menos um de `DETERMINISTIC`, `NO SQL` ou `READS SQL DATA` deve ser especificado explicitamente. Caso contrário, ocorre um erro:

  ```sql
  ERROR 1418 (HY000): This function has none of DETERMINISTIC, NO SQL,
  or READS SQL DATA in its declaration and binary logging is enabled
  (you *might* want to use the less safe log_bin_trust_function_creators
  variable)
  ```

  Esta Function é deterministic (e não modifica dados), então é segura:

  ```sql
  CREATE FUNCTION f1(i INT)
  RETURNS INT
  DETERMINISTIC
  READS SQL DATA
  BEGIN
    RETURN i;
  END;
  ```

  Esta Function usa `UUID()`, que é nondeterministic, então a Function também não é deterministic e não é segura:

  ```sql
  CREATE FUNCTION f2()
  RETURNS CHAR(36) CHARACTER SET utf8
  BEGIN
    RETURN UUID();
  END;
  ```

  Esta Function modifica dados, então pode não ser segura:

  ```sql
  CREATE FUNCTION f3(p_id INT)
  RETURNS INT
  BEGIN
    UPDATE t SET modtime = NOW() WHERE id = p_id;
    RETURN ROW_COUNT();
  END;
  ```

  A avaliação da natureza de uma Function é baseada na “honestidade” do criador. O MySQL não verifica se uma Function declarada `DETERMINISTIC` está livre de statements que produzem resultados nondeterministic.

* Quando você tenta executar uma Stored Function, se `binlog_format=STATEMENT` estiver definido, a keyword `DETERMINISTIC` deve ser especificada na definição da Function. Se este não for o caso, um erro é gerado e a Function não é executada, a menos que `log_bin_trust_function_creators=1` seja especificado para anular esta verificação (veja abaixo). Para chamadas de Function recursivas, a keyword `DETERMINISTIC` é exigida apenas na chamada mais externa. Se row-based ou mixed binary logging estiver em uso, o statement é aceito e replicado mesmo que a Function tenha sido definida sem a keyword `DETERMINISTIC`.

* Como o MySQL não verifica se uma Function é realmente deterministic no momento da criação, a invocation de uma Stored Function com a keyword `DETERMINISTIC` pode realizar uma ação que é insegura para statement-based logging, ou invocar uma Function ou Procedure contendo statements inseguros. Se isso ocorrer quando `binlog_format=STATEMENT` estiver definido, uma mensagem de warning é emitida. Se row-based ou mixed binary logging estiver em uso, nenhum warning é emitido, e o statement é replicado em formato row-based.

* Para relaxar as condições precedentes sobre a criação de Functions (que você deve ter o privilege `SUPER` e que uma Function deve ser declarada como deterministic ou não modificar dados), defina a system variable global `log_bin_trust_function_creators` como 1. Por padrão, esta variável tem o valor 0, mas você pode alterá-la assim:

  ```sql
  mysql> SET GLOBAL log_bin_trust_function_creators = 1;
  ```

  Você também pode definir esta variável na inicialização do server.

  Se o Binary Logging não estiver habilitado, `log_bin_trust_function_creators` não se aplica. `SUPER` não é exigido para a criação de Function, a menos que, conforme descrito anteriormente, o valor `DEFINER` na definição da Function o exija.

* Para informações sobre built-in functions que podem ser inseguras para Replicação (e, portanto, fazer com que as Stored Functions que as utilizam também sejam inseguras), consulte a Seção 16.4.1, “Recursos e Problemas de Replicação”.

Triggers são semelhantes a Stored Functions, então as observações precedentes sobre Functions também se aplicam a Triggers com a seguinte exceção: `CREATE TRIGGER` não tem uma característica `DETERMINISTIC` opcional, então os Triggers são assumidos como sendo sempre deterministic. No entanto, esta suposição pode ser inválida em alguns casos. Por exemplo, a Function `UUID()` é nondeterministic (e não replica). Tenha cuidado ao usar tais Functions em Triggers.

Triggers podem atualizar tabelas, então mensagens de erro semelhantes às de Stored Functions ocorrem com `CREATE TRIGGER` se você não tiver os privileges exigidos. No lado do Replica, o Replica usa o atributo `DEFINER` do Trigger para determinar qual usuário é considerado o criador do Trigger.

O restante desta seção fornece detalhes adicionais sobre a implementação do logging e suas implicações. Você não precisa lê-lo, a menos que esteja interessado no contexto da lógica para as condições atuais relacionadas ao logging sobre o uso de rotinas armazenadas. Esta discussão se aplica apenas ao statement-based logging, e não ao row-based logging, com exceção do primeiro item: statements `CREATE` e `DROP` são logados como statements, independentemente do modo de logging.

* O server grava os statements `CREATE EVENT`, `CREATE PROCEDURE`, `CREATE FUNCTION`, `ALTER EVENT`, `ALTER PROCEDURE`, `ALTER FUNCTION`, `DROP EVENT`, `DROP PROCEDURE` e `DROP FUNCTION` no Binary Log.

* Uma Stored Function invocation é logada como um statement `SELECT` se a Function alterar dados e ocorrer dentro de um statement que de outra forma não seria logado. Isso evita a não-replicação de alterações de dados que resultam do uso de Stored Functions em statements não logados. Por exemplo, statements `SELECT` não são escritos no Binary Log, mas um `SELECT` pode invocar uma Stored Function que faça alterações. Para lidar com isso, um statement `SELECT func_name()` é escrito no Binary Log quando a Function dada realiza uma alteração. Suponha que os seguintes statements sejam executados no Source server:

  ```sql
  CREATE FUNCTION f1(a INT) RETURNS INT
  BEGIN
    IF (a < 3) THEN
      INSERT INTO t2 VALUES (a);
    END IF;
    RETURN 0;
  END;

  CREATE TABLE t1 (a INT);
  INSERT INTO t1 VALUES (1),(2),(3);

  SELECT f1(a) FROM t1;
  ```

  Quando o statement `SELECT` é executado, a Function `f1()` é invocada três vezes. Duas dessas invocations inserem uma row, e o MySQL loga um statement `SELECT` para cada uma delas. Ou seja, o MySQL escreve os seguintes statements no Binary Log:

  ```sql
  SELECT f1(1);
  SELECT f1(2);
  ```

  O server também loga um statement `SELECT` para uma Stored Function invocation quando a Function invoca uma Stored Procedure que causa um erro. Neste caso, o server escreve o statement `SELECT` no log juntamente com o código de erro esperado. No Replica, se o mesmo erro ocorrer, esse é o resultado esperado e a Replicação continua. Caso contrário, a Replicação para.

* O logging de Stored Function invocations em vez dos statements executados por uma Function tem uma implicação de segurança para a Replicação, que surge de dois fatores:

  + É possível que uma Function siga diferentes execution paths nos Source e Replica servers.

  + Statements executados em um Replica são processados pelo SQL Thread do Replica, que possui full privileges.

  A implicação é que, embora um usuário deva ter o privilege `CREATE ROUTINE` para criar uma Function, o usuário pode escrever uma Function contendo um statement perigoso que é executado apenas no Replica, onde é processado por um Thread que possui full privileges. Por exemplo, se os Source e Replica servers tiverem valores de ID de server de 1 e 2, respectivamente, um usuário no Source server poderia criar e invocar uma Function insegura `unsafe_func()` da seguinte forma:

  ```sql
  mysql> delimiter //
  mysql> CREATE FUNCTION unsafe_func () RETURNS INT
      -> BEGIN
      ->   IF @@server_id=2 THEN dangerous_statement; END IF;
      ->   RETURN 1;
      -> END;
      -> //
  mysql> delimiter ;
  mysql> INSERT INTO t VALUES(unsafe_func());
  ```

  Os statements `CREATE FUNCTION` e `INSERT` são escritos no Binary Log, então o Replica os executa. Como o SQL Thread do Replica possui full privileges, ele executa o statement perigoso. Assim, a Stored Function invocation tem efeitos diferentes no Source e no Replica e não é safe para Replicação.

  Para se proteger contra este perigo em servers que têm o Binary Logging habilitado, os criadores de Stored Function devem ter o privilege `SUPER`, além do privilege `CREATE ROUTINE` usualmente exigido. Da mesma forma, para usar `ALTER FUNCTION`, você deve ter o privilege `SUPER` além do privilege `ALTER ROUTINE`. Sem o privilege `SUPER`, ocorre um erro:

  ```sql
  ERROR 1419 (HY000): You do not have the SUPER privilege and
  binary logging is enabled (you *might* want to use the less safe
  log_bin_trust_function_creators variable)
  ```

  Se você não quiser exigir que os criadores de Functions tenham o privilege `SUPER` (por exemplo, se todos os usuários com o privilege `CREATE ROUTINE` em seu sistema forem desenvolvedores de aplicações experientes), defina a system variable global `log_bin_trust_function_creators` como 1. Você também pode definir esta variável na inicialização do server. Se o Binary Logging não estiver habilitado, `log_bin_trust_function_creators` não se aplica. `SUPER` não é exigido para a criação de Function, a menos que, conforme descrito anteriormente, o valor `DEFINER` na definição da Function o exija.

* Se uma Function que realiza updates for nondeterministic, ela não é repetível. Isso pode ter dois efeitos indesejáveis:

  + Torna um Replica diferente do Source.
  + Dados restaurados são diferentes dos dados originais.

  Para lidar com esses problemas, o MySQL impõe o seguinte requisito: Em um Source server, a criação e alteração de uma Function são recusadas, a menos que você declare a Function como deterministic ou que ela não modifique dados. Dois conjuntos de características de Function se aplicam aqui:

  + As características `DETERMINISTIC` e `NOT DETERMINISTIC` indicam se uma Function sempre produz o mesmo resultado para inputs fornecidos. O default é `NOT DETERMINISTIC` se nenhuma característica for fornecida. Para declarar que uma Function é deterministic, você deve especificar `DETERMINISTIC` explicitamente.

  + As características `CONTAINS SQL`, `NO SQL`, `READS SQL DATA` e `MODIFIES SQL DATA` fornecem informações sobre se a Function lê ou escreve dados. `NO SQL` ou `READS SQL DATA` indica que uma Function não altera dados, mas você deve especificar uma delas explicitamente porque o default é `CONTAINS SQL` se nenhuma característica for fornecida.

  Por padrão, para que um statement `CREATE FUNCTION` seja aceito, pelo menos um de `DETERMINISTIC`, `NO SQL` ou `READS SQL DATA` deve ser especificado explicitamente. Caso contrário, ocorre um erro:

  ```sql
  ERROR 1418 (HY000): This function has none of DETERMINISTIC, NO SQL,
  or READS SQL DATA in its declaration and binary logging is enabled
  (you *might* want to use the less safe log_bin_trust_function_creators
  variable)
  ```

  Se você definir `log_bin_trust_function_creators` como 1, o requisito de que Functions sejam deterministic ou não modifiquem dados é descartado.

* As chamadas de Stored Procedure são logadas no statement level em vez de no nível `CALL`. Ou seja, o server não loga o statement `CALL`, ele loga os statements dentro da Procedure que realmente executam. Como resultado, as mesmas alterações que ocorrem no Source server são observadas nas Replicas. Isso evita problemas que poderiam resultar de uma Procedure ter diferentes execution paths em diferentes máquinas.

  Em geral, os statements executados dentro de uma Stored Procedure são escritos no Binary Log usando as mesmas regras que se aplicariam se os statements fossem executados de forma standalone. Um cuidado especial é tomado ao logar statements de Procedure porque a execução de statements dentro de Procedures não é exatamente a mesma que em um contexto não-Procedure:

  + Um statement a ser logado pode conter referências a local procedure variables. Estas variáveis não existem fora do contexto da Stored Procedure, então um statement que se refere a tal variável não pode ser logado literalmente. Em vez disso, cada referência a uma local variable é substituída por esta construção para fins de logging:

    ```sql
    NAME_CONST(var_name, var_value)
    ```

    *`var_name`* é o nome da local variable, e *`var_value`* é uma constante indicando o valor que a variável tem no momento em que o statement é logado. `NAME_CONST()` tem um valor de *`var_value`*, e um “name” de *`var_name`*. Assim, se você invocar esta Function diretamente, você obtém um resultado como este:

    ```sql
    mysql> SELECT NAME_CONST('myname', 14);
    +--------+
    | myname |
    +--------+
    |     14 |
    +--------+
    ```

    `NAME_CONST()` permite que um statement standalone logado seja executado em um Replica com o mesmo efeito que o statement original que foi executado no Source dentro de uma Stored Procedure.

    O uso de `NAME_CONST()` pode resultar em um problema para statements `CREATE TABLE ... SELECT` quando as expressões de coluna Source se referem a local variables. Converter essas referências para expressões `NAME_CONST()` pode resultar em nomes de coluna diferentes nos Source e Replica servers, ou nomes que são muito longos para serem legal column identifiers. Uma solução alternativa é fornecer aliases para colunas que se referem a local variables. Considere este statement quando `myvar` tem o valor 1:

    ```sql
    CREATE TABLE t1 SELECT myvar;
    ```

    Isso é reescrito da seguinte forma:

    ```sql
    CREATE TABLE t1 SELECT NAME_CONST(myvar, 1);
    ```

    Para garantir que as tabelas Source e Replica tenham os mesmos nomes de coluna, escreva o statement assim:

    ```sql
    CREATE TABLE t1 SELECT myvar AS myvar;
    ```

    O statement reescrito se torna:

    ```sql
    CREATE TABLE t1 SELECT NAME_CONST(myvar, 1) AS myvar;
    ```

  + Um statement a ser logado pode conter referências a user-defined variables. Para lidar com isso, o MySQL escreve um statement `SET` no Binary Log para garantir que a variável exista no Replica com o mesmo valor que no Source. Por exemplo, se um statement se refere a uma variável `@my_var`, esse statement é precedido no Binary Log pelo seguinte statement, onde *`value`* é o valor de `@my_var` no Source:

    ```sql
    SET @my_var = value;
    ```

  + Chamadas de Procedure podem ocorrer dentro de uma Transaction committed ou rolled-back. O contexto Transactional é contabilizado para que os aspectos Transactional da execução da Procedure sejam replicados corretamente. Ou seja, o server loga os statements dentro da Procedure que realmente executam e modificam dados, e também loga os statements `BEGIN`, `COMMIT` e `ROLLBACK` conforme necessário. Por exemplo, se uma Procedure atualiza apenas tabelas Transactional e é executada dentro de uma Transaction que é rolled back, essas updates não são logadas. Se a Procedure ocorrer dentro de uma Transaction committed, os statements `BEGIN` e `COMMIT` são logados com as updates. Para uma Procedure que é executada dentro de uma Transaction rolled-back, seus statements são logados usando as mesmas regras que se aplicariam se os statements fossem executados de forma standalone:

    - Updates para tabelas Transactional não são logadas.
    - Updates para tabelas não-Transactional são logadas porque o rollback não as cancela.
    - Updates para uma mistura de tabelas Transactional e não-Transactional são logadas envolvidas por `BEGIN` e `ROLLBACK` para que as Replicas façam as mesmas alterações e rollbacks que no Source.

* Uma chamada de Stored Procedure *não* é escrita no Binary Log no statement level se a Procedure for invocada de dentro de uma Stored Function. Nesse caso, a única coisa logada é o statement que invoca a Function (se ocorrer dentro de um statement que é logado) ou um statement `DO` (se ocorrer dentro de um statement que não é logado). Por esta razão, deve-se ter cuidado no uso de Stored Functions que invocam uma Procedure, mesmo que a Procedure seja de outra forma segura em si mesma.