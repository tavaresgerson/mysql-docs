## 14.14 Funções de Bloqueio

Esta seção descreve as funções usadas para manipular bloqueios de nível de usuário.

**Tabela 14.19 Funções de Bloqueio**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>GET_LOCK()</code></td> <td> Obter um bloqueio nomeado</td> </tr><tr><td><code>IS_FREE_LOCK()</code></td> <td> Se o bloqueio nomeado está livre</td> </tr><tr><td><code>IS_USED_LOCK()</code></td> <td> Se o bloqueio nomeado está em uso; retornar o identificador de conexão se verdadeiro</td> </tr><tr><td><code>RELEASE_ALL_LOCKS()</code></td> <td> Liberar todos os bloqueios nomeados atuais</td> </tr><tr><td><code>RELEASE_LOCK()</code></td> <td> Liberar o bloqueio nomeado</td> </tr></tbody></table>

*  `GET_LOCK(str,timeout)`

  Tenta obter um bloqueio com um nome dado pelo string *`str`*, usando um timeout de *`timeout`* segundos. Um valor negativo de *`timeout`* significa timeout infinito. O bloqueio é exclusivo. Enquanto estiver mantido por uma sessão, outras sessões não podem obter um bloqueio do mesmo nome.

  Retorna `1` se o bloqueio foi obtido com sucesso, `0` se a tentativa expirar (por exemplo, porque outro cliente já bloqueou o nome), ou `NULL` se ocorrer um erro (como esgotamento de memória ou o thread ser morto com `mysqladmin kill`).

  Um bloqueio obtido com  `GET_LOCK()` é liberado explicitamente executando `RELEASE_LOCK()` ou implicitamente quando sua sessão termina (normalmente ou anormalmente). Bloqueios obtidos com  `GET_LOCK()` não são liberados quando as transações são confirmadas ou revertidas.

   `GET_LOCK()` é implementado usando o subsistema de bloqueio de metadados (MDL). Vários bloqueios simultâneos podem ser adquiridos e `GET_LOCK()` não libera quaisquer bloqueios existentes. Por exemplo, suponha que você execute estas instruções:

  ```
  SELECT GET_LOCK('lock1',10);
  SELECT GET_LOCK('lock2',10);
  SELECT RELEASE_LOCK('lock2');
  SELECT RELEASE_LOCK('lock1');
  ```

  O segundo  `GET_LOCK()` adquire um segundo bloqueio e ambas as chamadas de `RELEASE_LOCK()` retornam `1` (sucesso).

É possível que uma sessão específica adquira múltiplas bloqueadoras para o mesmo nome. Outras sessões não podem adquirir uma bloqueadora com esse nome até que a sessão que está adquirindo libere todas as suas bloqueadoras para o nome.

Bloqueadoras com nomes únicos adquiridas com `GET_LOCK()` aparecem na tabela `metadata_locks` do Schema de Desempenho. A coluna `OBJECT_TYPE` diz `LOCK DE NÍVEL DE USUÁRIO` e a coluna `OBJECT_NAME` indica o nome da bloqueadora. No caso de múltiplas bloqueadoras serem adquiridas para o *mesmo* nome, apenas a primeira bloqueadora para o nome registra uma linha na tabela `metadata_locks`. Bloqueadoras subsequentes para o nome incrementam um contador na bloqueadora, mas não adquirem bloqueadoras de metadados adicionais. A linha de bloqueadoras `metadata_locks` para a bloqueadora é excluída quando a última instância de bloqueadora no nome é liberada.

A capacidade de adquirir múltiplas bloqueadoras significa que há a possibilidade de um impasse entre os clientes. Quando isso acontece, o servidor escolhe um solicitador e termina sua solicitação de aquisição de bloqueadoras com um erro `ER_USER_LOCK_DEADLOCK`. Esse erro não faz com que as transações sejam revertidas.

O MySQL impõe um comprimento máximo para os nomes de bloqueadoras de 64 caracteres.

`GET_LOCK()` pode ser usado para implementar bloqueadoras de aplicativo ou para simular bloqueadoras de registro. Os nomes são bloqueados em uma base de nível de servidor. Se um nome tiver sido bloqueado dentro de uma sessão, `GET_LOCK()` bloqueia qualquer solicitação de outra sessão por uma bloqueadora com o mesmo nome. Isso permite que clientes que concordam com um nome de bloqueadora específico usem o nome para realizar bloqueio orientado a cooperação. Mas esteja ciente de que também permite que um cliente que não está no conjunto de clientes cooperantes bloqueie um nome, seja acidentalmente ou deliberadamente, e assim impeça que qualquer um dos clientes cooperantes bloqueie esse nome. Uma maneira de reduzir a probabilidade disso é usar nomes de bloqueadoras que sejam específicos do banco de dados ou específicos do aplicativo. Por exemplo, use nomes de bloqueadoras na forma *`db_name.str`* ou *`app_name.str`*.

Se vários clientes estiverem aguardando por um bloqueio, a ordem em que eles o obtêm é indefinida. As aplicações não devem assumir que os clientes obtêm o bloqueio na mesma ordem em que emitiram os pedidos de bloqueio.

`GET_LOCK()` é inseguro para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

Como `GET_LOCK()` estabelece um bloqueio apenas em um único `mysqld`, ele não é adequado para uso com o NDB Cluster, que não tem como impor um bloqueio SQL em vários servidores MySQL. Consulte a Seção 25.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”, para obter mais informações.

Cuidado

Com a capacidade de adquirir múltiplos bloqueios nomeados, é possível que uma única declaração adquira um grande número de bloqueios. Por exemplo:

```
  INSERT INTO ... SELECT GET_LOCK(t1.col_name) FROM t1;
  ```

Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em algum momento e for revertida, os bloqueios adquiridos até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e os bloqueios adquiridos, essa intenção não é satisfeita. Além disso, se é importante que os bloqueios sejam concedidos em uma certa ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução escolhido pelo otimizador. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de bloqueio por declaração.

Uma interface de bloqueio diferente está disponível como um serviço de plugin ou um conjunto de funções carregáveis. Essa interface fornece namespaces de bloqueio e bloqueios de leitura e escrita distintos, ao contrário da interface fornecida por `GET_LOCK()` e funções relacionadas. Para detalhes, consulte a Seção 7.6.9.1, “O Serviço de Bloqueio”.
*  `IS_FREE_LOCK(str)`

  Verifica se o bloqueio nomeado *`str`* está livre para uso (ou seja, não está bloqueado). Retorna `1` se o bloqueio estiver livre (ninguém estiver usando o bloqueio), `0` se o bloqueio estiver em uso e `NULL` se ocorrer um erro (como um argumento incorreto).

Esta função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.
*  `IS_USED_LOCK(str)`

  Verifica se o bloqueio nomeado por *`str`* está em uso (ou seja, bloqueado). Se estiver, ele retorna o identificador de conexão da sessão do cliente que detém o bloqueio. Caso contrário, ele retorna `NULL`.

  Esta função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.
*  `RELEASE_ALL_LOCKS()`

  Libera todos os bloqueios nomeados mantidos pela sessão atual e retorna o número de bloqueios liberados (0 se não houver nenhum).

  Esta função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.
*  `RELEASE_LOCK(str)`

  Libera o bloqueio nomeado pela string *`str`* que foi obtido com `GET_LOCK()`. Retorna `1` se o bloqueio foi liberado, `0` se o bloqueio não foi estabelecido por este thread (neste caso, o bloqueio não é liberado) e `NULL` se o bloqueio nomeado não existia. O bloqueio não existe se ele nunca foi obtido por uma chamada a `GET_LOCK()` ou se foi previamente liberado.

  A  instrução `DO` é conveniente para usar com `RELEASE_LOCK()`. Veja a Seção 15.2.3, “Instrução DO”.

  Esta função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.