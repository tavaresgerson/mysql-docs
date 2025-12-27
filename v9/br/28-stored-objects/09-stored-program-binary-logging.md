## Registro Binário de Programas Armazenados

O log binário contém informações sobre instruções SQL que modificam o conteúdo do banco de dados. Essas informações são armazenadas na forma de “eventos” que descrevem as modificações. (Os eventos do log binário diferem dos objetos de eventos agendados armazenados.) O log binário tem dois propósitos importantes:

* Para a replicação, o log binário é usado nos servidores de replicação de origem como um registro das instruções a serem enviadas aos servidores replicados. A origem envia os eventos contidos em seu log binário para suas réplicas, que executam esses eventos para realizar as mesmas alterações de dados que foram feitas na origem. Veja a Seção 19.2, “Implementação de Replicação”.

* Algumas operações de recuperação de dados requerem o uso do log binário. Após a restauração de um arquivo de backup, os eventos no log binário que foram registrados após a realização do backup são reexecutados. Esses eventos atualizam os bancos de dados a partir do ponto do backup. Veja a Seção 9.3.2, “Uso de Backups para Recuperação”.

No entanto, se o registro ocorrer ao nível da instrução, existem certos problemas de registro binário em relação aos programas armazenados (procedimentos e funções armazenados, gatilhos e eventos):

* Em alguns casos, uma instrução pode afetar diferentes conjuntos de linhas na origem e na replica.

* As instruções replicadas executadas em uma replica são processadas pelo fio de aplicável da replica. A menos que você implemente verificações de privilégios de replicação (veja a Seção 19.3.3, “Verificações de Privilégios de Replicação”), o fio de aplicável tem privilégios completos. Nessa situação, é possível que um procedimento siga caminhos de execução diferentes nos servidores de origem e replica, então um usuário poderia escrever uma rotina contendo uma instrução perigosa que é executada apenas na replica.

* Se um programa armazenado que modifica dados for não determinístico, ele não é reprodutível. Isso pode resultar em dados diferentes na fonte e na replica, ou fazer com que os dados restaurados difiram dos dados originais.

Esta seção descreve como o MySQL lida com o registro binário para programas armazenados. Ela indica as condições atuais que a implementação coloca sobre o uso de programas armazenados e o que você pode fazer para evitar problemas de registro. Ela também fornece informações adicionais sobre as razões dessas condições.

A menos que indicado de outra forma, as observações aqui assumem que o registro binário está habilitado no servidor (veja a Seção 7.4.4, “O Log Binário”). Se o log binário não estiver habilitado, a replicação não é possível, nem o log binário está disponível para recuperação de dados. O registro binário está habilitado por padrão e é desabilitado apenas se você iniciar o servidor com `--skip-log-bin` ou `--disable-log-bin` na inicialização.

Em geral, os problemas descritos aqui resultam quando o registro binário ocorre no nível da instrução SQL (registro binário baseado em instruções). Se você usar o registro binário baseado em linhas, o log contém as alterações feitas em linhas individuais como resultado da execução de instruções SQL. Quando rotinas ou gatilhos são executados, as alterações de linha são registradas, não as instruções que fazem as alterações. Para procedimentos armazenados, isso significa que a instrução `CALL` não é registrada. Para funções armazenadas, as alterações de linha feitas dentro da função são registradas, não a invocação da função. Para gatilhos, as alterações de linha feitas pelo gatilho são registradas. No lado da replica, apenas as alterações de linha são vistas, não a invocação do programa armazenado.

O registro binário de formato misto (`binlog_format=MIXED`) usa o registro binário baseado em instruções, exceto em casos em que apenas o registro binário baseado em linhas garanta resultados adequados. Com o formato misto, quando uma função armazenada, um procedimento armazenado, um gatilho, um evento ou uma instrução preparada contém algo que não é seguro para o registro binário baseado em instruções, toda a instrução é marcada como insegura e registrada no formato de linha. As instruções usadas para criar e excluir procedimentos, funções, gatilhos e eventos são sempre seguras e são registradas no formato de instrução. Para obter mais informações sobre o registro baseado em linhas, misto e baseado em instruções, e como os termos seguros e inseguros são determinados, consulte a Seção 19.2.1, “Formatos de Replicação”.

As condições de uso de funções armazenadas no MySQL podem ser resumidas da seguinte forma. Essas condições não se aplicam a procedimentos armazenados ou eventos do Agendamento de Eventos e não se aplicam a menos que o registro binário esteja habilitado.

* Para criar ou alterar uma função armazenada, você deve ter o privilégio `SET_ANY_DEFINER`, além do privilégio `CREATE ROUTINE` ou `ALTER ROUTINE` normalmente necessário. (Dependendo do valor `DEFINER` na definição da função, `SET_ANY_DEFINER` pode ser necessário, independentemente de o registro binário estar habilitado. Consulte a Seção 15.1.21, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.)

* Ao criar uma função armazenada, você deve declarar que ela é determinística ou que não modifica dados. Caso contrário, ela pode ser insegura para a recuperação ou replicação de dados.

Por padrão, para que uma instrução `CREATE FUNCTION` seja aceita, pelo menos uma das opções `DETERMINISTIC`, `NO SQL` ou `READS SQL DATA` deve ser especificada explicitamente. Caso contrário, ocorre um erro:

```
  ERROR 1418 (HY000): This function has none of DETERMINISTIC, NO SQL,
  or READS SQL DATA in its declaration and binary logging is enabled
  (you *might* want to use the less safe log_bin_trust_function_creators
  variable)
  ```

Essa função é determinista (e não modifica dados), portanto, é segura:

```
  CREATE FUNCTION f1(i INT)
  RETURNS INT
  DETERMINISTIC
  READS SQL DATA
  BEGIN
    RETURN i;
  END;
  ```

Essa função usa `UUID()`, que não é determinista, portanto, a função também não é determinista e não é segura:

```
  CREATE FUNCTION f2()
  RETURNS CHAR(36) CHARACTER SET utf8mb4
  BEGIN
    RETURN UUID();
  END;
  ```

Essa função modifica dados, portanto, pode não ser segura:

```
  CREATE FUNCTION f3(p_id INT)
  RETURNS INT
  BEGIN
    UPDATE t SET modtime = NOW() WHERE id = p_id;
    RETURN ROW_COUNT();
  END;
  ```

A avaliação da natureza de uma função é baseada na "honestidade" do criador. O MySQL não verifica se uma função declarada como `DETERMINISTIC` está livre de instruções que produzem resultados não determinísticos.

* Quando você tenta executar uma função armazenada, se `binlog_format=STATEMENT` estiver definido, a palavra-chave `DETERMINISTIC` deve ser especificada na definição da função. Se isso não for o caso, um erro é gerado e a função não é executada, a menos que `log_bin_trust_function_creators=1` seja especificado para ignorar essa verificação (veja abaixo). Para chamadas recursivas de funções, a palavra-chave `DETERMINISTIC` é necessária apenas na chamada mais externa. Se estiver sendo usado o registro baseado em linhas ou o registro misto binário, a instrução é aceita e replicada mesmo se a função foi definida sem a palavra-chave `DETERMINISTIC`.

* Como o MySQL não verifica se uma função realmente é determinista no momento da criação, a invocação de uma função armazenada com a palavra-chave `DETERMINISTIC` pode realizar uma ação que é insegura para o registro baseado em instruções, ou invocar uma função ou procedimento que contenha instruções inseguras. Se isso ocorrer quando `binlog_format=STATEMENT` estiver definido, uma mensagem de aviso é emitida. Se estiver sendo usado o registro baseado em linhas ou o registro misto binário, nenhum aviso é emitido, e a instrução é replicada no formato baseado em linhas.

* Para relaxar as condições anteriores sobre a criação de funções (que você deve ter o privilégio `SUPER` e que uma função deve ser declarada como determinística ou não modificar dados), defina a variável de sistema global `log_bin_trust_function_creators` para 1. Por padrão, essa variável tem o valor 0, mas você pode alterá-la da seguinte forma:

  ```
  mysql> SET GLOBAL log_bin_trust_function_creators = 1;
  ```

  Você também pode definir essa variável no início do servidor.

  Se o registro binário não estiver habilitado, `log_bin_trust_function_creators` não se aplica. `SUPER` não é necessário para a criação de funções, a menos que, como descrito anteriormente, o valor `DEFINER` na definição da função o exija.

* Para informações sobre funções embutidas que podem ser inseguras para a replicação (e, portanto, fazer com que funções armazenadas que as usam também sejam inseguras), consulte a Seção 19.5.1, “Recursos e Problemas de Replicação”.

Os gatilhos são semelhantes às funções armazenadas, então as observações anteriores sobre as funções também se aplicam aos gatilhos, com a seguinte exceção: `CREATE TRIGGER` não tem uma característica `DETERMINISTIC` opcional, então os gatilhos são assumidos como sempre determinísticos. No entanto, essa suposição pode ser inválida em alguns casos. Por exemplo, a função `UUID()` é não determinística (e não replica). Tenha cuidado ao usar tais funções em gatilhos.

Os gatilhos podem atualizar tabelas, então mensagens de erro semelhantes às das funções armazenadas ocorrem com `CREATE TRIGGER` se você não tiver os privilégios necessários. No lado da replica, a replica usa o atributo `DEFINER` do gatilho para determinar qual usuário é considerado o criador do gatilho.

O restante desta seção fornece detalhes adicionais sobre a implementação do registro e suas implicações. Você não precisa lê-la, a menos que esteja interessado no contexto da justificativa para as atuais condições relacionadas ao registro para uso rotineiro armazenado. Esta discussão se aplica apenas ao registro baseado em declarações, e não ao registro baseado em linhas, com exceção do primeiro item: as declarações `CREATE` e `DROP` são registradas como declarações, independentemente do modo de registro.

* O servidor escreve as declarações `CREATE EVENT`, `CREATE PROCEDURE`, `CREATE FUNCTION`, `ALTER EVENT`, `ALTER PROCEDURE`, `ALTER FUNCTION`, `DROP EVENT`, `DROP PROCEDURE` e `DROP FUNCTION` no log binário.

* Uma invocação de função armazenada é registrada como uma declaração `SELECT` se a função alterar dados e ocorrer dentro de uma declaração que, de outra forma, não seria registrada. Isso previne a não replicação de alterações de dados resultantes do uso de funções armazenadas em declarações não registradas. Por exemplo, as declarações `SELECT` não são escritas no log binário, mas uma `SELECT` pode invocar uma função armazenada que faça alterações. Para lidar com isso, uma declaração `SELECT func_name()` é escrita no log binário quando a função fornecida faz uma alteração. Suponha que os seguintes comandos sejam executados no servidor de origem:

  ```
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

  Quando a declaração `SELECT` é executada, a função `f1()` é invocada três vezes. Duas dessas invocações inserem uma linha, e o MySQL registra uma declaração `SELECT` para cada uma delas. Ou seja, o MySQL escreve as seguintes declarações no log binário:

  ```
  SELECT f1(1);
  SELECT f1(2);
  ```

O servidor também registra uma instrução `SELECT` para uma invocação de função armazenada quando a função invoca um procedimento armazenado que causa um erro. Neste caso, o servidor escreve a instrução `SELECT` no log juntamente com o código de erro esperado. Na replica, se o mesmo erro ocorrer, isso é o resultado esperado e a replicação continua. Caso contrário, a replicação é interrompida.

* A logagem de invocações de funções armazenadas em vez das instruções executadas por uma função tem uma implicação de segurança para a replicação, que surge de dois fatores:

  + É possível que uma função siga diferentes caminhos de execução nos servidores de origem e replica.

  + As instruções executadas em uma replica são processadas pelo fio de aplicável da replica. A menos que você implemente verificações de privilégios de replicação (consulte a Seção 19.3.3, “Verificações de Privilégios de Replicação”), o fio de aplicável tem privilégios completos.

A implicação é que, embora um usuário deva ter o privilégio `CREATE ROUTINE` para criar uma função, o usuário pode escrever uma função contendo uma instrução perigosa que é executada apenas na replica, onde é processada por um fio que tem privilégios completos. Por exemplo, se os servidores de origem e replica tiverem os valores de ID do servidor 1 e 2, respectivamente, um usuário no servidor de origem poderia criar e invocar uma função insegura `unsafe_func()` da seguinte forma:

```
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

As instruções `CREATE FUNCTION` e `INSERT` são escritas no log binário, então a replica as executa. Como o fio de aplicável da replica tem privilégios completos, ele executa a instrução perigosa. Assim, a invocação da função tem efeitos diferentes na origem e na replica e não é segura para a replicação.

Para se proteger contra esse perigo em servidores com registro binário habilitado, os criadores de funções armazenadas devem ter o privilégio `SUPER`, além do privilégio `CREATE ROUTINE` usual que é necessário. Da mesma forma, para usar `ALTER FUNCTION`, você deve ter o privilégio `SUPER`, além do privilégio `ALTER ROUTINE`. Sem o privilégio `SUPER`, ocorre um erro:

  ```
  ERROR 1419 (HY000): You do not have the SUPER privilege and
  binary logging is enabled (you *might* want to use the less safe
  log_bin_trust_function_creators variable)
  ```

  Se você não quiser exigir que os criadores de funções tenham o privilégio `SUPER` (por exemplo, se todos os usuários com o privilégio `CREATE ROUTINE` em seu sistema são desenvolvedores de aplicativos experientes), defina a variável de sistema `log_bin_trust_function_creators` global para 1. Você também pode definir essa variável na inicialização do servidor. Se o registro binário não estiver habilitado, `log_bin_trust_function_creators` não se aplica. `SUPER` não é necessário para a criação de funções, a menos que, como descrito anteriormente, o valor `DEFINER` na definição da função o exija.

* O uso de verificações de privilégios de replicação é recomendado independentemente das escolhas que você fizer sobre os privilégios para os criadores de funções. As verificações de privilégios de replicação podem ser configuradas para garantir que apenas operações esperadas e relevantes sejam autorizadas para o canal de replicação. Para obter instruções sobre como fazer isso, consulte a Seção 19.3.3, “Verificações de Privilégios de Replicação”.

* Se uma função que realiza atualizações for não determinística, ela não é repetiível. Isso pode ter dois efeitos indesejáveis:

  + Causa uma replica a diferir da fonte.
  + Os dados restaurados não correspondem aos dados originais.

Para lidar com esses problemas, o MySQL impõe o seguinte requisito: Em um servidor fonte, a criação e alteração de uma função são recusadas, a menos que você declare a função como determinística ou que não modifique dados. Dois conjuntos de características de função se aplicam aqui:

As características `DETERMINÍSTICA` e `NÃO DETERMINÍSTICA` indicam se uma função sempre produz o mesmo resultado para entradas dadas. O padrão é `NÃO DETERMINÍSTICA` se nenhuma dessas características for fornecida. Para declarar que uma função é determinística, você deve especificar `DETERMINÍSTICA` explicitamente.

  + As características `CONTEVE SQL`, `NÃO SQL`, `LEIA DADOS SQL` e `MODIFIQUE DADOS SQL` fornecem informações sobre se a função lê ou escreve dados. `NÃO SQL` ou `LEIA DADOS SQL` indica que uma função não altera dados, mas você deve especificar explicitamente uma dessas características, pois o padrão é `CONTEVE SQL` se nenhuma característica for fornecida.

  Por padrão, para que uma instrução `CREATE FUNCTION` seja aceita, pelo menos uma das características `DETERMINÍSTICA`, `NÃO SQL` ou `LEIA DADOS SQL` deve ser especificada explicitamente. Caso contrário, ocorre um erro:

  ```
  ERROR 1418 (HY000): This function has none of DETERMINISTIC, NO SQL,
  or READS SQL DATA in its declaration and binary logging is enabled
  (you *might* want to use the less safe log_bin_trust_function_creators
  variable)
  ```

  Se você definir `log_bin_trust_function_creators` para 1, a exigência de que as funções sejam determinísticas ou não modifiquem dados é descartada.

* As chamadas de procedimento armazenado são registradas no nível da instrução, em vez do nível `CALL`. Isso significa que o servidor não registra a instrução `CALL`, mas registra aquelas instruções dentro do procedimento que são realmente executadas. Como resultado, as mesmas alterações que ocorrem no servidor de origem também ocorrem nas réplicas. Isso previne problemas que poderiam resultar de um procedimento ter caminhos de execução diferentes em diferentes máquinas.

  Em geral, as instruções executadas dentro de um procedimento armazenado são escritas no log binário usando as mesmas regras que seriam aplicadas se as instruções fossem executadas de forma independente. Algum cuidado especial é tomado ao registrar instruções de procedimento porque a execução de instruções dentro de procedimentos não é exatamente a mesma que em um contexto não de procedimento:

Uma declaração que será registrada pode conter referências a variáveis de procedimento locais. Essas variáveis não existem fora do contexto do procedimento armazenado, então uma declaração que se refere a tal variável não pode ser registrada literalmente. Em vez disso, cada referência a uma variável local é substituída por essa construção para fins de registro:

    ```
    NAME_CONST(var_name, var_value)
    ```

    *`var_name`* é o nome da variável local, e *`var_value`* é uma constante indicando o valor que a variável tem no momento em que a declaração é registrada. `NAME_CONST()` tem um valor de *`var_value`* e um "nome" de *`var_name`*. Assim, se você invocar essa função diretamente, você obterá um resultado como este:

    ```
    mysql> SELECT NAME_CONST('myname', 14);
    +--------+
    | myname |
    +--------+
    |     14 |
    +--------+
    ```

    `NAME_CONST()` permite que uma declaração registrada seja executada em uma réplica com o mesmo efeito que a declaração original que foi executada na fonte dentro de um procedimento armazenado.

O uso de `NAME_CONST()` pode resultar em um problema para declarações `CREATE TABLE ... SELECT` quando as expressões de colunas da fonte referem-se a variáveis locais. Converter essas referências em expressões `NAME_CONST()` pode resultar em nomes de colunas diferentes nos servidores de origem e réplica, ou nomes que são muito longos para serem identificadores de colunas legais. Uma solução é fornecer aliases para colunas que se referem a variáveis locais. Considere esta declaração quando `myvar` tem o valor 1:

    ```
    CREATE TABLE t1 SELECT myvar;
    ```

    Isso é reescrito da seguinte forma:

    ```
    CREATE TABLE t1 SELECT NAME_CONST(myvar, 1);
    ```

    Para garantir que as tabelas de origem e réplica tenham os mesmos nomes de colunas, escreva a declaração da seguinte forma:

    ```
    CREATE TABLE t1 SELECT myvar AS myvar;
    ```

    A declaração reescrita se torna:

    ```
    CREATE TABLE t1 SELECT NAME_CONST(myvar, 1) AS myvar;
    ```

+ Uma declaração que será registrada pode conter referências a variáveis definidas pelo usuário. Para lidar com isso, o MySQL escreve uma declaração `SET` no log binário para garantir que a variável exista na replica com o mesmo valor que na fonte. Por exemplo, se uma declaração se refere a uma variável `@my_var`, essa declaração é precedida no log binário pela seguinte declaração, onde *`value`* é o valor de `@my_var` na fonte:

    ```
    SET @my_var = value;
    ```

  + Chamadas de procedimento podem ocorrer dentro de uma transação comprometida ou revertida. O contexto da transação é considerado para que os aspectos transacionais da execução do procedimento sejam replicados corretamente. Ou seja, o servidor registra essas declarações dentro do procedimento que realmente executa e modifica dados, e também registra as declarações `BEGIN`, `COMMIT` e `ROLLBACK` conforme necessário. Por exemplo, se um procedimento atualiza apenas tabelas transacionais e é executado dentro de uma transação que é revertida, essas atualizações não são registradas. Se o procedimento ocorrer dentro de uma transação comprometida, as declarações `BEGIN` e `COMMIT` são registradas com as atualizações. Para um procedimento que é executado dentro de uma transação revertida, suas declarações são registradas usando as mesmas regras que seriam aplicadas se as declarações fossem executadas de forma independente:

    - Atualizações em tabelas transacionais não são registradas.
    - Atualizações em tabelas não transacionais são registradas porque o rollback não as cancela.

    - Atualizações em uma mistura de tabelas transacionais e não transacionais são registradas cercadas por `BEGIN` e `ROLLBACK` para que as réplicas façam as mesmas alterações e reversões que na fonte.

* Uma chamada de procedimento armazenado *não* é escrita no log binário no nível de instrução se o procedimento for invocado dentro de uma função armazenada. Nesse caso, a única coisa registrada é a instrução que invoca a função (se ocorrer dentro de uma instrução que é registrada) ou uma instrução `DO` (se ocorrer dentro de uma instrução que não é registrada). Por essa razão, deve-se ter cuidado ao usar funções armazenadas que invocam um procedimento, mesmo que o procedimento seja seguro por si só.