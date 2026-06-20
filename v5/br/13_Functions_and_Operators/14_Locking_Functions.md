## 12.14 Funções de bloqueio

Esta seção descreve as funções usadas para manipular bloqueios de nível de usuário.

**Tabela 12.19 Funções de bloqueio**

<table frame="box" rules="all" summary="A reference that lists locking functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>GET_LOCK()</code></td> <td>Obtenha um bloqueio com nome</td> </tr><tr><td><code>IS_FREE_LOCK()</code></td> <td>Se o bloqueio nomeado está livre</td> </tr><tr><td><code>IS_USED_LOCK()</code></td> <td>Se o bloqueio nomeado estiver em uso; retorne o identificador de conexão se for verdadeiro</td> </tr><tr><td><code>RELEASE_ALL_LOCKS()</code></td> <td>Liberar todas as trancas nomeadas atuais</td> </tr><tr><td><code>RELEASE_LOCK()</code></td> <td>Liberar o bloqueio nomeado</td> </tr></tbody></table>

* `GET_LOCK(str,timeout)`

Tenta obter um bloqueio com um nome fornecido pela string *`str`*, usando um tempo de espera de *`timeout`* segundos. Um valor negativo *`timeout`* significa tempo de espera infinito. O bloqueio é exclusivo. Enquanto estiver sendo mantido por uma sessão, outras sessões não podem obter um bloqueio com o mesmo nome.

Retorna `1` se a chave foi obtida com sucesso, `0` se a tentativa expirou (por exemplo, porque outro cliente já havia bloqueado o nome anteriormente), ou `NULL` se ocorreu um erro (como esgotar a memória ou o thread de execução foi interrompido com **mysqladmin kill**).

Uma chave obtida com `GET_LOCK()` é liberada explicitamente ao executar `RELEASE_LOCK()` ou implicitamente quando sua sessão é encerrada (normalmente ou anormalmente). Chaves obtidas com `GET_LOCK()` não são liberadas quando as transações são confirmadas ou revertidas.

Em MySQL 5.7, `GET_LOCK()` foi reimplementado usando o subsistema de bloqueio de metadados (MDL) e suas capacidades foram estendidas. Múltiplos bloqueios simultâneos podem ser adquiridos e `GET_LOCK()` não libera quaisquer bloqueios existentes.

É possível que uma sessão específica adquira múltiplos locks para o mesmo nome. Outras sessões não podem adquirir um lock com esse nome até que a sessão que está adquirindo libere todos os seus locks para o nome.

Como resultado da reimplementação do MDL, as chaves de acesso de nome único adquiridas com `GET_LOCK()` aparecem na tabela do Schema de Desempenho `metadata_locks`. A coluna `OBJECT_TYPE` diz `USER LEVEL LOCK` e a coluna `OBJECT_NAME` indica o nome da chave de acesso. No caso de múltiplas chaves de acesso serem adquiridas para o *mesmo* nome, apenas a primeira chave de acesso para o nome registra uma string na tabela `metadata_locks`. As chaves de acesso subsequentes para o nome incrementam um contador na chave de acesso, mas não adquirem chaves de metadados adicionais. A string `metadata_locks` da chave de acesso é excluída quando a última instância de chave de acesso no nome é liberada.

A capacidade de adquirir múltiplos bloqueios significa que há a possibilidade de um impasse entre os clientes. Quando isso acontece, o servidor escolhe um chamador e termina sua solicitação de aquisição de bloqueio com um erro `ER_USER_LOCK_DEADLOCK`. Esse erro não faz com que as transações sejam revertidas.

Antes do MySQL 5.7, apenas uma única bloqueio simultâneo pode ser adquirido e `GET_LOCK()` libera qualquer bloqueio existente. A diferença no comportamento de aquisição de bloqueio a partir do MySQL 5.7 pode ser vista pelo seguinte exemplo. Suponha que você execute essas declarações:

  ```sql
  SELECT GET_LOCK('lock1',10);
  SELECT GET_LOCK('lock2',10);
  SELECT RELEASE_LOCK('lock2');
  SELECT RELEASE_LOCK('lock1');
  ```

Em MySQL 5.7 ou posterior, o segundo `GET_LOCK()` adquire um segundo bloqueio e ambas as chamadas de `RELEASE_LOCK()` retornam 1 (sucesso). Antes do MySQL 5.7, o segundo `GET_LOCK()` libera o primeiro bloqueio (`'lock1')` e o segundo `RELEASE_LOCK()` retorna `NULL` (falha) porque não há `'lock1'` para liberar.

MySQL 5.7 e versões posteriores importam um comprimento máximo para os nomes de bloqueio de 64 caracteres. Anteriormente, não havia limite.

`GET_LOCK()` pode ser usado para implementar bloqueios de aplicação ou para simular bloqueios de registro. Os nomes são bloqueados em nível de servidor. Se um nome tiver sido bloqueado em uma sessão, `GET_LOCK()` bloqueia qualquer solicitação de outra sessão para um bloqueio com o mesmo nome. Isso permite que clientes que concordem em um nome de bloqueio dado usem o nome para realizar bloqueio consultivo cooperativo. Mas esteja ciente de que também permite que um cliente que não esteja entre o conjunto de clientes cooperadores bloqueie um nome, seja inadvertidamente ou deliberadamente, e assim impeça qualquer um dos clientes cooperadores de bloquear esse nome. Uma maneira de reduzir a probabilidade disso é usar nomes de bloqueio que sejam específicos do banco de dados ou específicos da aplicação. Por exemplo, use nomes de bloqueio na forma de *`db_name.str`* ou *`app_name.str`*.

Se vários clientes estão esperando por um bloqueio, a ordem em que eles o adquirem é indefinida. As aplicações não devem assumir que os clientes adquirem o bloqueio na mesma ordem em que emitiram as solicitações de bloqueio.

`GET_LOCK()` não é seguro para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

Como o `GET_LOCK()` estabelece um bloqueio apenas em um único `mysqld`, ele não é adequado para uso com o NDB Cluster, que não tem como impor um bloqueio SQL em vários servidores MySQL. Consulte a Seção 21.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”, para obter mais informações.

Cuidado

Com a capacidade de adquirir vários bloqueios nomeados, é possível que uma única declaração adquira um grande número de bloqueios. Por exemplo:

  ```sql
  INSERT INTO ... SELECT GET_LOCK(t1.col_name) FROM t1;
  ```

Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em meio caminho e for revertida, as chaves adquiridas até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as strings inseridas e as chaves adquiridas, essa intenção não é satisfeita. Além disso, se é importante que as chaves sejam concedidas em uma certa ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução que o otimizador escolhe. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de chave por declaração.

Uma interface de bloqueio diferente está disponível como um serviço de plugin ou um conjunto de funções carregáveis. Essa interface fornece namespaces de bloqueio e bloqueios de leitura e escrita distintos, ao contrário da interface fornecida por `GET_LOCK()` e funções relacionadas. Para detalhes, consulte a Seção 5.5.6.1, “O Serviço de Bloqueio”.

* `IS_FREE_LOCK(str)`

Verifica se o bloqueio denominado *`str`* está livre para uso (ou seja, não está bloqueado). Retorna `1` se o bloqueio estiver livre (ninguém estiver usando o bloqueio), `0` se o bloqueio estiver em uso e `NULL` se ocorrer um erro (como um argumento incorreto).

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

* `IS_USED_LOCK(str)`

Verifica se o bloqueio denominado *`str`* está em uso (ou seja, bloqueado). Se estiver, ele retorna o identificador de conexão da sessão do cliente que detém o bloqueio. Caso contrário, ele retorna `NULL`.

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

* `RELEASE_ALL_LOCKS()`

Libera todas as chaves nomeadas mantidas pela sessão atual e retorna o número de chaves liberadas (0 se não houver nenhuma)

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

* `RELEASE_LOCK(str)`

Libera o bloqueio nomeado pela string *`str`* que foi obtido com `GET_LOCK()`. Retorna `1` se o bloqueio foi liberado, `0` se o bloqueio não foi estabelecido por este thread (neste caso, o bloqueio não é liberado) e `NULL` se o bloqueio nomeado não existia. O bloqueio não existe se nunca foi obtido por uma chamada a `GET_LOCK()` ou se já foi liberado anteriormente.

A declaração `DO` é conveniente para uso com `RELEASE_LOCK()`. Veja a Seção 13.2.3, “DO Statement”.

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.