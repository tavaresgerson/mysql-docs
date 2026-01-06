## 12.14 Funções de bloqueio

Esta seção descreve as funções usadas para manipular bloqueios de nível de usuário.

**Tabela 12.19 Funções de bloqueio**

<table frame="box" rules="all" summary="Uma referência que lista as funções de bloqueio."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="locking-functions.html#function_get-lock">[[<code class="literal">GET_LOCK()</code>]]</a></td> <td>Obtenha uma trava com nome</td> </tr><tr><td><a class="link" href="locking-functions.html#function_is-free-lock">[[<code class="literal">IS_FREE_LOCK()</code>]]</a></td> <td>Se a trava nomeada está livre</td> </tr><tr><td><a class="link" href="locking-functions.html#function_is-used-lock">[[<code class="literal">IS_USED_LOCK()</code>]]</a></td> <td>Se o bloqueio nomeado estiver em uso; retorne o identificador de conexão se for verdadeiro</td> </tr><tr><td><a class="link" href="locking-functions.html#function_release-all-locks">[[<code class="literal">RELEASE_ALL_LOCKS()</code>]]</a></td> <td>Liberar todas as trancas nomeadas atuais</td> </tr><tr><td><a class="link" href="locking-functions.html#function_release-lock">[[<code class="literal">RELEASE_LOCK()</code>]]</a></td> <td>Liberar o bloqueio nomeado</td> </tr></tbody></table>

- `GET_LOCK(str, timeout)`

  Tenta obter um bloqueio com um nome fornecido pela string *`str`*, usando um tempo de espera de *`timeout`* segundos. Um valor negativo de *`timeout`* significa tempo de espera infinito. O bloqueio é exclusivo. Enquanto estiver sendo mantido por uma sessão, outras sessões não podem obter um bloqueio com o mesmo nome.

  Retorna `1` se o bloqueio for obtido com sucesso, `0` se a tentativa expirar (por exemplo, porque outro cliente já bloqueou o nome anteriormente) ou `NULL` se ocorrer um erro (como esgotamento de memória ou o thread ser interrompido com **mysqladmin kill**).

  Uma chave obtida com `GET_LOCK()` é liberada explicitamente ao executar `RELEASE_LOCK()` ou implicitamente quando sua sessão termina (normalmente ou anormalmente). Chaves obtidas com `GET_LOCK()` não são liberadas quando as transações são confirmadas ou revertidas.

  No MySQL 5.7, o `GET_LOCK()` foi reimplementado usando o subsistema de bloqueio de metadados (MDL) e suas capacidades foram ampliadas. Vários bloqueios simultâneos podem ser adquiridos e o `GET_LOCK()` não libera nenhum bloqueio existente.

  É possível que uma sessão específica adquira múltiplas bloqueadoras para o mesmo nome. Outras sessões não podem adquirir uma bloqueadora com esse nome até que a sessão que está adquirindo libere todas as suas bloqueadoras para o nome.

  Como resultado da reimplementação do MDL, as bloqueadoras com nomes únicos adquiridas com `GET_LOCK()` aparecem na tabela `metadata_locks` do Schema de Desempenho. A coluna `OBJECT_TYPE` diz `LOCK DE NÍVEL DE USUÁRIO` e a coluna `OBJECT_NAME` indica o nome da bloqueadora. No caso de múltiplas bloqueadoras serem adquiridas para o mesmo nome, apenas a primeira bloqueadora para o nome registra uma linha na tabela `metadata_locks`. Bloqueadoras subsequentes para o nome incrementam um contador na bloqueadora, mas não adquirem bloqueadoras de metadados adicionais. A linha `metadata_locks` para a bloqueadora é excluída quando a última instância da bloqueadora para o nome é liberada.

  A capacidade de adquirir múltiplas bloqueadas significa que há a possibilidade de um impasse entre os clientes. Quando isso acontece, o servidor escolhe um chamador e termina sua solicitação de aquisição de bloqueio com um erro `ER_USER_LOCK_DEADLOCK`. Esse erro não faz com que as transações sejam revertidas.

  Antes do MySQL 5.7, apenas um único bloqueio simultâneo poderia ser adquirido e o `GET_LOCK()` liberava qualquer bloqueio existente. A diferença no comportamento de aquisição de bloqueio a partir do MySQL 5.7 pode ser vista no seguinte exemplo. Suponha que você execute essas instruções:

  ```sql
  SELECT GET_LOCK('lock1',10);
  SELECT GET_LOCK('lock2',10);
  SELECT RELEASE_LOCK('lock2');
  SELECT RELEASE_LOCK('lock1');
  ```

  No MySQL 5.7 ou posterior, o segundo `GET_LOCK()` adquire um segundo bloqueio e ambas as chamadas `RELEASE_LOCK()` retornam 1 (sucesso). Antes do MySQL 5.7, o segundo `GET_LOCK()` libera o primeiro bloqueio (`'lock1')` e a segunda `RELEASE_LOCK()` retorna `NULL` (falha) porque não há `'lock1'` para ser liberado.

  O MySQL 5.7 e versões posteriores impõem um comprimento máximo de 64 caracteres para os nomes de bloqueio. Anteriormente, não havia limite.

  `GET_LOCK()` pode ser usado para implementar bloqueios de aplicativos ou para simular bloqueios de registros. Os nomes são bloqueados em nível de servidor. Se um nome tiver sido bloqueado em uma sessão, `GET_LOCK()` bloqueia qualquer solicitação de outra sessão para um bloqueio com o mesmo nome. Isso permite que clientes que concordam com um nome de bloqueio específico usem o nome para realizar bloqueios cooperativos de aconselhamento. Mas esteja ciente de que também permite que um cliente que não esteja no conjunto de clientes cooperantes bloqueie um nome, seja acidentalmente ou deliberadamente, e assim impeça que qualquer um dos clientes cooperantes bloqueie esse nome. Uma maneira de reduzir a probabilidade disso é usar nomes de bloqueio específicos do banco de dados ou específicos do aplicativo. Por exemplo, use nomes de bloqueio na forma de *`db_name.str`* ou *`app_name.str`*.

  Se vários clientes estiverem aguardando por um bloqueio, a ordem em que eles o obtêm não é definida. As aplicações não devem assumir que os clientes obtêm o bloqueio na mesma ordem em que emitiram os pedidos de bloqueio.

  `GET_LOCK()` é inseguro para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

  Como o `GET_LOCK()` estabelece um bloqueio apenas em um único **mysqld**, ele não é adequado para uso com o NDB Cluster, que não tem como impor um bloqueio SQL em vários servidores MySQL. Consulte a Seção 21.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”, para obter mais informações.

  Cuidado

  Com a capacidade de adquirir múltiplas chaves nomeadas, é possível que uma única declaração adquira um grande número de chaves. Por exemplo:

  ```sql
  INSERT INTO ... SELECT GET_LOCK(t1.col_name) FROM t1;
  ```

  Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em algum momento e for revertida, as chaves adquiridas até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e as chaves adquiridas, essa intenção não é satisfeita. Além disso, se é importante que as chaves sejam concedidas em uma ordem específica, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução escolhido pelo otimizador. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de chave por declaração.

  Uma interface de bloqueio diferente está disponível como um serviço de plugin ou um conjunto de funções carregáveis. Essa interface fornece namespaces de bloqueio e bloqueios de leitura e escrita distintos, ao contrário da interface fornecida pelo `GET_LOCK()` e funções relacionadas. Para detalhes, consulte a Seção 5.5.6.1, “O Serviço de Bloqueio”.

- `IS_FREE_LOCK(str)`

  Verifica se o bloqueio nomeado *`str`* está livre para uso (ou seja, não está bloqueado). Retorna `1` se o bloqueio estiver livre (ninguém estiver usando o bloqueio), `0` se o bloqueio estiver em uso e `NULL` se ocorrer um erro (como um argumento incorreto).

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

- `IS_USED_LOCK(str)`

  Verifica se o bloqueio nomeado *`str`* está em uso (ou seja, bloqueado). Se estiver, ele retorna o identificador de conexão da sessão do cliente que detém o bloqueio. Caso contrário, ele retorna `NULL`.

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

- `RELEASE_ALL_LOCKS()`

  Libera todas as chaves nomeadas mantidas pela sessão atual e retorna o número de chaves liberadas (0 se não houver nenhuma).

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

- `RELEASE_LOCK(str)`

  Libera o bloqueio nomeado pela string *`str`* que foi obtido com `GET_LOCK()`. Retorna `1` se o bloqueio foi liberado, `0` se o bloqueio não foi estabelecido por este thread (neste caso, o bloqueio não é liberado) e `NULL` se o bloqueio nomeado não existia. O bloqueio não existe se ele nunca foi obtido por uma chamada a `GET_LOCK()` ou se ele já foi liberado anteriormente.

  A instrução `DO` é conveniente para ser usada com `RELEASE_LOCK()`. Veja a Seção 13.2.3, “Instrução DO”.

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.
