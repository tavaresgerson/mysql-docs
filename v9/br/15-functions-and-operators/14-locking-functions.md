## 14.14 Funções de Bloqueio

Esta seção descreve as funções usadas para manipular bloqueios de nível de usuário.

**Tabela 14.19 Funções de Bloqueio**

<table frame="box" rules="all" summary="Uma referência que lista as funções de bloqueio."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>GET_LOCK()</code></td> <td> Obter um bloqueio nomeado </td> </tr><tr><td><code>IS_FREE_LOCK()</code></td> <td> Se o bloqueio nomeado está livre </td> </tr><tr><td><code>IS_USED_LOCK()</code></td> <td> Se o bloqueio nomeado está em uso; retornar o identificador de conexão se verdadeiro </td> </tr><tr><td><code>RELEASE_ALL_LOCKS()</code></td> <td> Liberar todos os bloqueios nomeados atuais </td> </tr><tr><td><code>RELEASE_LOCK()</code></td> <td> Liberar o bloqueio nomeado </td> </tr></tbody></table>

* `GET_LOCK(str,timeout)`

  Tenta obter um bloqueio com um nome dado pelo string *`str`*, usando um timeout de *`timeout`* segundos. Um valor negativo de *`timeout`* significa timeout infinito. O bloqueio é exclusivo. Enquanto estiver mantido por uma sessão, outras sessões não podem obter um bloqueio do mesmo nome.

Retorna `1` se a trava foi obtida com sucesso, `0` se a tentativa expirar (por exemplo, porque outro cliente já havia bloqueado o nome anteriormente) ou `NULL` se ocorrer um erro (como esgotamento de memória ou o thread ser interrompido com **mysqladmin kill**).

Uma trava obtida com `GET_LOCK()` é liberada explicitamente executando `RELEASE_LOCK()` ou implicitamente quando a sessão é encerrada (normalmente ou anormalmente). As trava obtidas com `GET_LOCK()` não são liberadas quando as transações são confirmadas ou revertidas.

`GET_LOCK()` é implementado usando o subsistema de bloqueio de metadados (MDL). Várias travações simultâneas podem ser adquiridas e `GET_LOCK()` não libera nenhuma trava existente. Por exemplo, suponha que você execute essas instruções:

```
  SELECT GET_LOCK('lock1',10);
  SELECT GET_LOCK('lock2',10);
  SELECT RELEASE_LOCK('lock2');
  SELECT RELEASE_LOCK('lock1');
  ```

A segunda chamada de `GET_LOCK()` adquire uma segunda trava e ambas as chamadas de `RELEASE_LOCK()` retornam `1` (sucesso).

É possível que uma sessão específica adquira múltiplas travações para o mesmo nome. Outras sessões não podem adquirir uma trava com esse nome até que a sessão que adquiriu libere todas as suas travações para o nome.

Travas com nomes únicos adquiridas com `GET_LOCK()` aparecem na tabela `metadata_locks` do Schema de Desempenho. A coluna `OBJECT_TYPE` diz `LOCK DE NÍVEL DE USUÁRIO` e a coluna `OBJECT_NAME` indica o nome da trava. No caso de múltiplas travações serem adquiridas para o *mesmo* nome, apenas a primeira trava para o nome registra uma linha na tabela `metadata_locks`. Travas subsequentes para o nome incrementam um contador na trava, mas não adquirem travações de metadados adicionais. A linha `metadata_locks` para a trava é excluída quando a última instância da trava para o nome é liberada.

A capacidade de adquirir múltiplas bloqueadoras significa que há a possibilidade de um impasse entre os clientes. Quando isso acontece, o servidor escolhe um solicitante e termina sua solicitação de aquisição de bloqueadora com um erro `ER_USER_LOCK_DEADLOCK`. Esse erro não faz com que as transações sejam revertidas.

O MySQL impõe um comprimento máximo para os nomes de bloqueadoras de 64 caracteres.

`GET_LOCK()` pode ser usado para implementar bloqueadoras de aplicativo ou para simular bloqueadoras de registro. Os nomes são bloqueados em nível de servidor. Se um nome tiver sido bloqueado dentro de uma sessão, `GET_LOCK()` bloqueia qualquer solicitação de outra sessão por uma bloqueadora com o mesmo nome. Isso permite que clientes que concordam com um nome de bloqueadora específico usem o nome para realizar bloqueadoras de aconselhamento cooperativo. Mas esteja ciente de que também permite que um cliente que não esteja no conjunto de clientes cooperantes bloqueie um nome, seja acidentalmente ou deliberadamente, e assim impeça que qualquer um dos clientes cooperantes bloqueie esse nome. Uma maneira de reduzir a probabilidade disso é usar nomes de bloqueadoras que sejam específicos do banco de dados ou do aplicativo. Por exemplo, use nomes de bloqueadoras do formato *`db_name.str`* ou *`app_name.str`*.

Se vários clientes estão aguardando uma bloqueadora, a ordem em que a adquirem é indefinida. As aplicações não devem assumir que os clientes adquirem a bloqueadora na mesma ordem em que emitiram as solicitações de bloqueadora.

`GET_LOCK()` é inseguro para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

Como `GET_LOCK()` estabelece uma bloqueadora apenas em um **mysqld** único, ele não é adequado para uso com o NDB Cluster, que não tem como impor uma bloqueadora SQL em múltiplos servidores MySQL. Consulte a Seção 25.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”, para obter mais informações.

Cuidado

Com a capacidade de adquirir múltiplas chaves nomeadas, é possível que uma única instrução adquira um grande número de chaves. Por exemplo:

```
  INSERT INTO ... SELECT GET_LOCK(t1.col_name) FROM t1;
  ```

Estes tipos de instruções podem ter certos efeitos adversos. Por exemplo, se a instrução falhar em algum momento e for revertida, as chaves adquiridas até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e as chaves adquiridas, essa intenção não é satisfeita. Além disso, se é importante que as chaves sejam concedidas em uma determinada ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução escolhido pelo otimizador. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de chave por instrução.

Uma interface de bloqueio diferente está disponível como um serviço de plugin ou um conjunto de funções carregáveis. Esta interface fornece namespaces de chaves e chaves de leitura e escrita distintas, ao contrário da interface fornecida por `GET_LOCK()` e funções relacionadas. Para detalhes, consulte a Seção 7.6.8.1, “O Serviço de Bloqueio”.

* `IS_FREE_LOCK(str)`

  Verifica se a chave nomeada *`str`* está livre para uso (ou seja, não está bloqueada). Retorna `1` se a chave estiver livre (ninguém estiver usando a chave), `0` se a chave estiver em uso e `NULL` se ocorrer um erro (como um argumento incorreto).

  Esta função é insegura para a replicação baseada em instruções. Um aviso é registrado se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

* `IS_USED_LOCK(str)`

  Verifica se a chave nomeada *`str`* está em uso (ou seja, bloqueada). Se estiver, ela retorna o identificador de conexão da sessão do cliente que detém a chave. Caso contrário, ela retorna `NULL`.

Essa função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

* `RELEASE_ALL_LOCKS()`

  Libera todas as bloqueadoras nomeadas mantidas pela sessão atual e retorna o número de bloqueadoras liberadas (0 se não houver nenhuma).

  Essa função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

* `RELEASE_LOCK(str)`

  Libera a bloqueadora nomeada pelo string *`str`* que foi obtida com `GET_LOCK()`. Retorna `1` se a bloqueadora foi liberada, `0` se a bloqueadora não foi estabelecida por este thread (neste caso, a bloqueadora não é liberada) e `NULL` se a bloqueadora nomeada não existia. A bloqueadora não existe se ela nunca foi obtida por uma chamada a `GET_LOCK()` ou se ela foi liberada anteriormente.

  A instrução `DO` é conveniente para usar com `RELEASE_LOCK()`. Veja a Seção 15.2.3, “Instrução DO”.

  Essa função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.