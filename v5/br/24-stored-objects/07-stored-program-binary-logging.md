## 23.7 Registro binário de programas armazenados

O log binário contém informações sobre instruções SQL que modificam o conteúdo do banco de dados. Essas informações são armazenadas na forma de "eventos" que descrevem as modificações. (Os eventos do log binário diferem dos objetos de eventos agendados armazenados.) O log binário tem dois propósitos importantes:

- Para a replicação, o log binário é usado nos servidores de replicação de origem como um registro das declarações que serão enviadas aos servidores replicados. A origem envia os eventos contidos em seu log binário para suas réplicas, que executam esses eventos para realizar as mesmas alterações de dados que foram feitas na origem. Veja a Seção 16.2, “Implementação de Replicação”.

- Algumas operações de recuperação de dados exigem o uso do log binário. Após o arquivo de backup ter sido restaurado, os eventos no log binário que foram registrados após a criação do backup são reexecutados. Esses eventos atualizam as bases de dados a partir do ponto do backup. Veja a Seção 7.3.2, “Usando backups para recuperação”.

No entanto, se o registro ocorrer no nível de declaração, há certos problemas de registro binário em relação aos programas armazenados (procedimentos e funções armazenados, gatilhos e eventos):

- Em alguns casos, uma declaração pode afetar diferentes conjuntos de linhas na fonte e na réplica.

- As declarações replicadas executadas em uma replica são processadas pelo thread SQL da replica, que possui privilégios completos. É possível que um procedimento siga caminhos de execução diferentes nos servidores de origem e replicação, portanto, um usuário pode escrever uma rotina que contenha uma declaração perigosa que seja executada apenas na replica, onde é processada por um thread que possui privilégios completos.

- Se um programa armazenado que modifica dados for não determinístico, ele não pode ser repetido. Isso pode resultar em dados diferentes na fonte e na replica, ou fazer com que os dados restaurados se diferenciem dos dados originais.

Esta seção descreve como o MySQL lida com o registro binário para programas armazenados. Ela indica as condições atuais que a implementação impõe ao uso de programas armazenados e o que você pode fazer para evitar problemas de registro. Ela também fornece informações adicionais sobre as razões dessas condições.

A menos que indicado de outra forma, as observações aqui assumem que o registro binário está habilitado no servidor (consulte a Seção 5.4.4, “O Log Binário”). Se o registro binário não estiver habilitado, a replicação não é possível, e o log binário também não está disponível para recuperação de dados. No MySQL 5.7, o registro binário não está habilitado por padrão, e você o habilita usando a opção `--log-bin`.

Em geral, os problemas descritos aqui ocorrem quando o registro binário ocorre no nível da instrução SQL (registro binário baseado em instruções). Se você usar o registro binário baseado em linhas, o log contém as alterações feitas em linhas individuais como resultado da execução de instruções SQL. Quando rotinas ou gatilhos são executados, as alterações de linha são registradas, não as instruções que fazem as alterações. Para procedimentos armazenados, isso significa que a instrução `CALL` não é registrada. Para funções armazenadas, as alterações de linha feitas dentro da função são registradas, não a invocação da função. Para gatilhos, as alterações de linha feitas pelo gatilho são registradas. No lado da replica, apenas as alterações de linha são vistas, não a invocação do programa armazenado.

O registro binário de formato misto (`binlog_format=MIXED`) usa o registro binário baseado em instruções, exceto nos casos em que apenas o registro binário baseado em linhas garante resultados adequados. Com o formato misto, quando uma função armazenada, um procedimento armazenado, um gatilho, um evento ou uma instrução preparada contém algo que não é seguro para o registro binário baseado em instruções, toda a instrução é marcada como insegura e registrada no formato de linha. As instruções usadas para criar e descartar procedimentos, funções, gatilhos e eventos são sempre seguras e são registradas no formato de instrução. Para obter mais informações sobre o registro baseado em linhas, misto e baseado em instruções, e como os termos seguros e inseguros são determinados, consulte a Seção 16.2.1, “Formatos de Replicação”.

As condições de uso de funções armazenadas no MySQL podem ser resumidas da seguinte forma. Essas condições não se aplicam a procedimentos armazenados ou eventos do Agendamento de Eventos e não se aplicam a menos que o registro binário esteja habilitado.

- Para criar ou alterar uma função armazenada, você deve ter o privilégio `SUPER`, além do privilégio `CREATE ROUTINE` ou `ALTER ROUTINE` normalmente necessário. (Dependendo do valor `DEFINER` na definição da função, `SUPER` pode ser necessário, independentemente de o registro binário estar habilitado. Consulte a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

- Ao criar uma função armazenada, você deve declarar se ela é determinística ou se não modifica dados. Caso contrário, ela pode não ser segura para recuperação ou replicação de dados.

  Por padrão, para que uma instrução `CREATE FUNCTION` seja aceita, pelo menos uma das opções `DETERMINISTIC`, `NO SQL` ou `READS SQL DATA` deve ser especificada explicitamente. Caso contrário, ocorrerá um erro:

  ```sql
  ERROR 1418 (HY000): This function has none of DETERMINISTIC, NO SQL,
  or READS SQL DATA in its declaration and binary logging is enabled
  (you *might* want to use the less safe log_bin_trust_function_creators
  variable)
  ```

  Essa função é determinística (e não modifica os dados), portanto, é segura:

  ```sql
  CREATE FUNCTION f1(i INT)
  RETURNS INT
  DETERMINISTIC
  READS SQL DATA
  BEGIN
    RETURN i;
  END;
  ```

  Essa função usa `UUID()`, que não é determinística, portanto, a função também não é determinística e não é segura:

  ```sql
  CREATE FUNCTION f2()
  RETURNS CHAR(36) CHARACTER SET utf8
  BEGIN
    RETURN UUID();
  END;
  ```

  Essa função modifica dados, então pode não ser segura:

  ```sql
  CREATE FUNCTION f3(p_id INT)
  RETURNS INT
  BEGIN
    UPDATE t SET modtime = NOW() WHERE id = p_id;
    RETURN ROW_COUNT();
  END;
  ```

  A avaliação da natureza de uma função é baseada na "honestidade" do criador. O MySQL não verifica se uma função declarada como `DETERMINISTIC` está livre de instruções que produzem resultados não determinísticos.

- Quando você tenta executar uma função armazenada, se `binlog_format=STATEMENT` estiver definido, a palavra-chave `DETERMINISTIC` deve ser especificada na definição da função. Se isso não for o caso, um erro é gerado e a função não é executada, a menos que `log_bin_trust_function_creators=1` seja especificado para ignorar essa verificação (veja abaixo). Para chamadas recursivas de funções, a palavra-chave `DETERMINISTIC` é necessária apenas na chamada mais externa. Se o registro binário baseado em linhas ou misto estiver em uso, a instrução é aceita e replicada mesmo se a função foi definida sem a palavra-chave `DETERMINISTIC`.

- Como o MySQL não verifica se uma função é realmente determinística no momento da criação, a invocação de uma função armazenada com a palavra-chave `DETERMINISTIC` pode realizar uma ação que seja insegura para o registro baseado em instruções, ou invocar uma função ou procedimento que contenha instruções inseguras. Se isso ocorrer quando o `binlog_format=STATEMENT` estiver definido, uma mensagem de aviso é emitida. Se o registro baseado em linhas ou misto binário estiver em uso, nenhum aviso é emitido e a instrução é replicada no formato baseado em linhas.

- Para relaxar as condições anteriores sobre a criação de funções (que você deve ter o privilégio `SUPER` e que uma função deve ser declarada como determinística ou não modificar dados), defina a variável de sistema global `log_bin_trust_function_creators` para 1. Por padrão, essa variável tem o valor 0, mas você pode alterá-la da seguinte forma:

  ```sql
  mysql> SET GLOBAL log_bin_trust_function_creators = 1;
  ```

  Você também pode definir essa variável no início do servidor.

  Se o registro binário não estiver habilitado, o `log_bin_trust_function_creators` não será aplicado. O `SUPER` não é necessário para a criação de funções, a menos que, conforme descrito anteriormente, o valor `DEFINER` na definição da função o exija.

- Para obter informações sobre funções integradas que podem ser inseguras para replicação (e, portanto, fazer com que as funções armazenadas que as utilizam também sejam inseguras), consulte a Seção 16.4.1, “Recursos e problemas de replicação”.

Os gatilhos são semelhantes às funções armazenadas, então as observações anteriores sobre as funções também se aplicam aos gatilhos, com a seguinte exceção: `CREATE TRIGGER` não tem uma característica `DETERMINISTIC` opcional, então os gatilhos são assumidos como sempre determinísticos. No entanto, essa suposição pode ser inválida em alguns casos. Por exemplo, a função `UUID()` é não determinística (e não replica). Tenha cuidado ao usar tais funções em gatilhos.

Os gatilhos podem atualizar tabelas, portanto, mensagens de erro semelhantes às das funções armazenadas ocorrem com `CREATE TRIGGER` se você não tiver os privilégios necessários. No lado da replica, a replica usa o atributo `DEFINER` do gatilho para determinar qual usuário é considerado o criador do gatilho.

O restante desta seção fornece detalhes adicionais sobre a implementação do registro e suas implicações. Você não precisa lê-la, a menos que esteja interessado no contexto da justificativa para as condições atuais relacionadas ao registro para uso rotineiro armazenado. Esta discussão se aplica apenas ao registro baseado em declarações, e não ao registro baseado em linhas, com exceção do primeiro item: as declarações `CREATE` e `DROP` são registradas como declarações, independentemente do modo de registro.

- O servidor escreve as instruções `CREATE EVENT`, `CREATE PROCEDURE`, `CREATE FUNCTION`, `ALTER EVENT`, `ALTER PROCEDURE`, `ALTER FUNCTION`, `DROP EVENT`, `DROP PROCEDURE` e `DROP FUNCTION` no log binário.

- Uma invocação de função armazenada é registrada como uma instrução `SELECT` se a função alterar dados e ocorrer dentro de uma instrução que, de outra forma, não seria registrada. Isso previne a não replicação de alterações de dados resultantes do uso de funções armazenadas em instruções não registradas. Por exemplo, as instruções `SELECT` não são escritas no log binário, mas uma `SELECT` pode invocar uma função armazenada que faça alterações. Para lidar com isso, uma instrução `SELECT func_name()` é escrita no log binário quando a função fornecida faz uma alteração. Suponha que os seguintes comandos sejam executados no servidor de origem:

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

  Quando a instrução `SELECT` é executada, a função `f1()` é chamada três vezes. Duas dessas chamadas inserem uma linha, e o MySQL registra uma instrução `SELECT` para cada uma delas. Ou seja, o MySQL escreve as seguintes instruções no log binário:

  ```sql
  SELECT f1(1);
  SELECT f1(2);
  ```

  O servidor também registra uma instrução `SELECT` para uma invocação de função armazenada quando a função invoca um procedimento armazenado que causa um erro. Nesse caso, o servidor escreve a instrução `SELECT` no log junto com o código de erro esperado. Na replica, se o mesmo erro ocorrer, esse é o resultado esperado e a replicação continua. Caso contrário, a replicação é interrompida.

- A gravação das invocações de funções armazenadas, em vez das declarações executadas por uma função, tem implicações de segurança para a replicação, que surgem de dois fatores:

  - É possível que uma função siga diferentes caminhos de execução nos servidores de origem e réplica.

  - As declarações executadas em uma réplica são processadas pelo thread SQL da réplica, que possui privilégios completos.

  A implicação é que, embora um usuário precise ter o privilégio `CREATE ROUTINE` para criar uma função, ele pode escrever uma função que contenha uma declaração perigosa que seja executada apenas na replica onde ela é processada por um thread com privilégios completos. Por exemplo, se os servidores de origem e replica tiverem os valores de ID de servidor 1 e 2, respectivamente, um usuário no servidor de origem poderia criar e invocar uma função insegura `unsafe_func()` da seguinte forma:

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

  As instruções `CREATE FUNCTION` e `INSERT` são escritas no log binário, então a replica as executa. Como o thread SQL da replica tem privilégios completos, ele executa a declaração perigosa. Assim, a invocação da função tem efeitos diferentes na fonte e na replica e não é segura para replicação.

  Para se proteger desse perigo em servidores com registro binário habilitado, os criadores de funções armazenadas devem ter o privilégio `SUPER`, além do privilégio `CREATE ROUTINE` usualmente necessário. Da mesma forma, para usar `ALTER FUNCTION`, você deve ter o privilégio `SUPER`, além do privilégio `ALTER ROUTINE`. Sem o privilégio `SUPER`, ocorre um erro:

  ```sql
  ERROR 1419 (HY000): You do not have the SUPER privilege and
  binary logging is enabled (you *might* want to use the less safe
  log_bin_trust_function_creators variable)
  ```

  Se você não quiser exigir que os criadores de funções tenham o privilégio `SUPER` (por exemplo, se todos os usuários com o privilégio `CREATE ROUTINE` no seu sistema são desenvolvedores de aplicativos experientes), defina a variável de sistema global `log_bin_trust_function_creators` para 1. Você também pode definir essa variável no início do servidor. Se o registro binário não estiver habilitado, `log_bin_trust_function_creators` não se aplica. `SUPER` não é necessário para a criação de funções, a menos que, como descrito anteriormente, o valor `DEFINER` na definição da função o exija.

- Se uma função que realiza atualizações for não determinística, ela não será repetiível. Isso pode ter dois efeitos indesejáveis:

  - Isso torna uma réplica diferente da fonte.
  - Os dados restaurados são diferentes dos dados originais.

  Para lidar com esses problemas, o MySQL impõe o seguinte requisito: em um servidor de origem, a criação e alteração de uma função são recusadas, a menos que você declare a função como determinística ou que não modifique dados. Dois conjuntos de características de funções se aplicam aqui:

  - As características `DETERMINÍSTICA` e `NÃO DETERMINÍSTICA` indicam se uma função sempre produz o mesmo resultado para entradas específicas. O padrão é `NÃO DETERMINÍSTICA` se nenhuma dessas características for especificada. Para declarar que uma função é determinística, você deve especificar `DETERMINÍSTICA` explicitamente.

  - As características `CONTAINS SQL`, `NO SQL`, `READS SQL DATA` e `MODIFIES SQL DATA` fornecem informações sobre se a função lê ou escreve dados. Seja `NO SQL` ou `READS SQL DATA`, indica que uma função não altera os dados, mas você deve especificar explicitamente uma dessas características, pois o padrão é `CONTAINS SQL` se nenhuma característica for fornecida.

  Por padrão, para que uma instrução `CREATE FUNCTION` seja aceita, pelo menos uma das opções `DETERMINISTIC`, `NO SQL` ou `READS SQL DATA` deve ser especificada explicitamente. Caso contrário, ocorrerá um erro:

  ```sql
  ERROR 1418 (HY000): This function has none of DETERMINISTIC, NO SQL,
  or READS SQL DATA in its declaration and binary logging is enabled
  (you *might* want to use the less safe log_bin_trust_function_creators
  variable)
  ```

  Se você definir `log_bin_trust_function_creators` para 1, a exigência de que as funções sejam determinísticas ou não modifiquem dados é descartada.

- As chamadas de procedimentos armazenados são registradas no nível da instrução, e não no nível `CALL`. Ou seja, o servidor não registra a instrução `CALL`, mas sim as instruções dentro do procedimento que são executadas. Como resultado, as mesmas alterações que ocorrem no servidor de origem são observadas nas réplicas. Isso previne problemas que poderiam resultar de um procedimento ter caminhos de execução diferentes em máquinas diferentes.

  Em geral, as instruções executadas dentro de um procedimento armazenado são escritas no log binário usando as mesmas regras que seriam aplicadas se as instruções fossem executadas de forma independente. Algum cuidado especial é tomado ao registrar instruções de procedimentos porque a execução de instruções dentro de procedimentos não é exatamente a mesma que no contexto não-procedimental:

  - Uma declaração a ser registrada pode conter referências a variáveis de procedimento locais. Essas variáveis não existem fora do contexto do procedimento armazenado, portanto, uma declaração que faça referência a uma dessas variáveis não pode ser registrada literalmente. Em vez disso, cada referência a uma variável local é substituída por essa construção para fins de registro:

    ```sql
    NAME_CONST(var_name, var_value)
    ```

    *`var_name`* é o nome da variável local, e *`var_value`* é uma constante que indica o valor que a variável tem no momento em que a declaração é registrada. `NAME_CONST()` tem um valor de *`var_value`* e um "nome" de *`var_name`*. Assim, se você invocar diretamente essa função, você obterá um resultado como este:

    ```sql
    mysql> SELECT NAME_CONST('myname', 14);
    +--------+
    | myname |
    +--------+
    |     14 |
    +--------+
    ```

    `NAME_CONST()` permite que uma instrução isolada registrada seja executada em uma replica com o mesmo efeito da instrução original que foi executada na fonte dentro de um procedimento armazenado.

    O uso de `NAME_CONST()` pode causar problemas para as instruções `CREATE TABLE ... SELECT` quando as expressões de coluna de origem referem-se a variáveis locais. A conversão dessas referências em expressões `NAME_CONST()` pode resultar em nomes de colunas diferentes nos servidores de origem e réplica, ou em nomes que são muito longos para serem identificadores legítimos de colunas. Uma solução é fornecer aliases para colunas que se referem a variáveis locais. Considere esta declaração quando `myvar` tiver o valor 1:

    ```sql
    CREATE TABLE t1 SELECT myvar;
    ```

    Isso é reescrito da seguinte forma:

    ```sql
    CREATE TABLE t1 SELECT NAME_CONST(myvar, 1);
    ```

    Para garantir que as tabelas de origem e replica tenham os mesmos nomes de colunas, escreva a declaração da seguinte forma:

    ```sql
    CREATE TABLE t1 SELECT myvar AS myvar;
    ```

    A declaração reescrita se torna:

    ```sql
    CREATE TABLE t1 SELECT NAME_CONST(myvar, 1) AS myvar;
    ```

  - Uma declaração a ser registrada pode conter referências a variáveis definidas pelo usuário. Para lidar com isso, o MySQL escreve uma declaração `SET` no log binário para garantir que a variável exista na replica com o mesmo valor que na fonte. Por exemplo, se uma declaração se refere a uma variável `@my_var`, essa declaração é precedida no log binário pela seguinte declaração, onde *`valor`* é o valor de `@my_var` na fonte:

    ```sql
    SET @my_var = value;
    ```

  - As chamadas de procedimentos podem ocorrer dentro de uma transação comprometida ou revertida. O contexto da transação é considerado para que os aspectos transacionais da execução do procedimento sejam replicados corretamente. Ou seja, o servidor registra as declarações dentro do procedimento que realmente executam e modificam dados, e também registra as declarações `BEGIN`, `COMMIT` e `ROLLBACK` conforme necessário. Por exemplo, se um procedimento atualiza apenas tabelas transacionais e é executado dentro de uma transação que é revertida, essas atualizações não são registradas. Se o procedimento ocorrer dentro de uma transação comprometida, as declarações `BEGIN` e `COMMIT` são registradas com as atualizações. Para um procedimento que é executado dentro de uma transação revertida, suas declarações são registradas usando as mesmas regras que seriam aplicadas se as declarações fossem executadas de forma independente:

    - As atualizações nas tabelas transacionais não são registradas.

    - As atualizações em tabelas não transacionais são registradas, pois o rollback não as cancela.

    - As atualizações de uma mistura de tabelas transacionais e não transacionais são registradas entre `BEGIN` e `ROLLBACK`, para que as réplicas façam as mesmas alterações e reversões que na fonte.

- Uma chamada de procedimento armazenado *não* é escrita no log binário no nível da instrução se o procedimento for invocado dentro de uma função armazenada. Nesse caso, a única coisa registrada é a instrução que invoca a função (se ocorrer dentro de uma instrução que é registrada) ou uma instrução `DO` (se ocorrer dentro de uma instrução que não é registrada). Por essa razão, deve-se ter cuidado ao usar funções armazenadas que invocam um procedimento, mesmo que o procedimento seja seguro por si só.
