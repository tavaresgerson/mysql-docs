## 12.14 Funções de Locking

Esta seção descreve funções usadas para manipular locks de nível de usuário.

**Tabela 12.19 Funções de Locking**

<table frame="box" rules="all" summary="Uma referência que lista funções de locking."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>GET_LOCK()</code></td> <td> Obtém um lock nomeado </td> </tr><tr><td><code>IS_FREE_LOCK()</code></td> <td> Verifica se o lock nomeado está livre </td> </tr><tr><td><code>IS_USED_LOCK()</code></td> <td> Verifica se o lock nomeado está em uso; retorna o identificador de conexão se verdadeiro </td> </tr><tr><td><code>RELEASE_ALL_LOCKS()</code></td> <td> Libera todos os locks nomeados atuais </td> </tr><tr><td><code>RELEASE_LOCK()</code></td> <td> Libera o lock nomeado </td> </tr></tbody></table>

* `GET_LOCK(str,timeout)`

  Tenta obter um lock com um nome fornecido pela string *`str`*, usando um timeout de *`timeout`* segundos. Um valor de *`timeout`* negativo significa timeout infinito. O lock é exclusivo. Enquanto retido por uma sessão, outras sessões não podem obter um lock com o mesmo nome.

  Retorna `1` se o lock foi obtido com sucesso, `0` se a tentativa expirou (por exemplo, porque outro cliente bloqueou o nome anteriormente), ou `NULL` se ocorreu um erro (como falta de memória ou se a Thread foi encerrada com **mysqladmin kill**).

  Um lock obtido com `GET_LOCK()` é liberado explicitamente pela execução de `RELEASE_LOCK()` ou implicitamente quando sua sessão termina (tanto normal quanto anormalmente). Locks obtidos com `GET_LOCK()` não são liberados quando transações fazem commit ou rollback.

  No MySQL 5.7, `GET_LOCK()` foi reimplementado usando o subsistema de metadata locking (MDL) e suas capacidades foram estendidas. Múltiplos locks simultâneos podem ser adquiridos, e `GET_LOCK()` não libera nenhum lock existente.

  É até possível para uma determinada sessão adquirir múltiplos locks para o mesmo nome. Outras sessões não podem adquirir um lock com esse nome até que a sessão adquirente libere todos os seus locks para o nome.

  Como resultado da reimplementação do MDL, locks com nomes exclusivos adquiridos com `GET_LOCK()` aparecem na tabela `metadata_locks` do Performance Schema. A coluna `OBJECT_TYPE` indica `USER LEVEL LOCK` e a coluna `OBJECT_NAME` indica o nome do lock. No caso de múltiplos locks serem adquiridos para o *mesmo* nome, apenas o primeiro lock para o nome registra uma linha na tabela `metadata_locks`. Locks subsequentes para o nome incrementam um contador no lock, mas não adquirem locks de metadata adicionais. A linha `metadata_locks` para o lock é excluída quando a última instância do lock com esse nome é liberada.

  A capacidade de adquirir múltiplos locks significa que existe a possibilidade de Deadlock entre clientes. Quando isso acontece, o servidor escolhe um chamador e encerra sua requisição de aquisição de lock com um erro `ER_USER_LOCK_DEADLOCK`. Este erro não causa o rollback das transações.

  Antes do MySQL 5.7, apenas um único lock simultâneo podia ser adquirido, e `GET_LOCK()` liberava qualquer lock existente. A diferença no comportamento de aquisição de lock a partir do MySQL 5.7 pode ser vista pelo seguinte exemplo. Suponha que você execute estas instruções:

  ```sql
  SELECT GET_LOCK('lock1',10);
  SELECT GET_LOCK('lock2',10);
  SELECT RELEASE_LOCK('lock2');
  SELECT RELEASE_LOCK('lock1');
  ```

  No MySQL 5.7 ou posterior, o segundo `GET_LOCK()` adquire um segundo lock e ambas as chamadas `RELEASE_LOCK()` retornam 1 (sucesso). Antes do MySQL 5.7, o segundo `GET_LOCK()` liberava o primeiro lock (`'lock1'`) e o segundo `RELEASE_LOCK()` retornava `NULL` (falha) porque não havia `'lock1'` para liberar.

  O MySQL 5.7 e posterior impõem um comprimento máximo de 64 caracteres para nomes de lock. Anteriormente, nenhum limite era imposto.

  `GET_LOCK()` pode ser usado para implementar locks de aplicação ou para simular locks de registro. Nomes são bloqueados em nível de servidor. Se um nome foi bloqueado dentro de uma sessão, `GET_LOCK()` bloqueia qualquer requisição de outra sessão para um lock com o mesmo nome. Isso permite que clientes que concordam com um determinado nome de lock usem o nome para realizar locking consultivo cooperativo. Mas esteja ciente de que isso também permite que um cliente que não esteja entre o conjunto de clientes cooperativos bloqueie um nome, inadvertidamente ou deliberadamente, impedindo assim que qualquer um dos clientes cooperativos bloqueie esse nome. Uma maneira de reduzir a probabilidade disso é usar nomes de lock que sejam específicos do Database ou da aplicação. Por exemplo, use nomes de lock na forma *`db_name.str`* ou *`app_name.str`*.

  Se múltiplos clientes estiverem esperando por um lock, a ordem em que eles o adquirem é indefinida. Aplicações não devem presumir que os clientes adquirem o lock na mesma ordem em que emitiram as requisições de lock.

  `GET_LOCK()` não é seguro para Statement-Based Replication. Um aviso é registrado se você usar esta função quando `binlog_format` estiver configurado como `STATEMENT`.

  Visto que `GET_LOCK()` estabelece um lock apenas em um único **mysqld**, ele não é adequado para uso com NDB Cluster, que não tem como impor um SQL Lock em múltiplos servidores MySQL. Consulte a Seção 21.2.7.10, “Limitações Relacionadas a Múltiplos NDB Cluster Nodes”, para mais informações.

  Atenção

  Com a capacidade de adquirir múltiplos locks nomeados, é possível que uma única instrução adquira um grande número de locks. Por exemplo:

  ```sql
  INSERT INTO ... SELECT GET_LOCK(t1.col_name) FROM t1;
  ```

  Esses tipos de instruções podem ter certos efeitos adversos. Por exemplo, se a instrução falhar no meio do caminho e fizer rollback, os locks adquiridos até o ponto da falha ainda existirão. Se a intenção é que haja uma correspondência entre as linhas inseridas e os locks adquiridos, essa intenção não é satisfeita. Além disso, se for importante que os locks sejam concedidos em uma determinada ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução que o otimizador escolher. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de lock por instrução.

  Uma interface de locking diferente está disponível como um serviço de plugin ou um conjunto de funções carregáveis. Esta interface fornece Namespaces de lock e locks de leitura e escrita distintos, ao contrário da interface fornecida por `GET_LOCK()` e funções relacionadas. Para detalhes, consulte a Seção 5.5.6.1, “The Locking Service”.

* `IS_FREE_LOCK(str)`

  Verifica se o lock nomeado *`str`* está livre para uso (ou seja, não bloqueado). Retorna `1` se o lock estiver livre (ninguém está usando o lock), `0` se o lock estiver em uso, e `NULL` se ocorrer um erro (como um argumento incorreto).

  Esta função não é segura para Statement-Based Replication. Um aviso é registrado se você usar esta função quando `binlog_format` estiver configurado como `STATEMENT`.

* `IS_USED_LOCK(str)`

  Verifica se o lock nomeado *`str`* está em uso (ou seja, bloqueado). Se estiver, retorna o identificador de conexão da sessão do cliente que detém o lock. Caso contrário, retorna `NULL`.

  Esta função não é segura para Statement-Based Replication. Um aviso é registrado se você usar esta função quando `binlog_format` estiver configurado como `STATEMENT`.

* `RELEASE_ALL_LOCKS()`

  Libera todos os locks nomeados retidos pela sessão atual e retorna o número de locks liberados (0 se não houver nenhum).

  Esta função não é segura para Statement-Based Replication. Um aviso é registrado se você usar esta função quando `binlog_format` estiver configurado como `STATEMENT`.

* `RELEASE_LOCK(str)`

  Libera o lock nomeado pela string *`str`* que foi obtido com `GET_LOCK()`. Retorna `1` se o lock foi liberado, `0` se o lock não foi estabelecido por esta Thread (nesse caso o lock não é liberado), e `NULL` se o lock nomeado não existia. O lock não existe se nunca foi obtido por uma chamada a `GET_LOCK()` ou se já foi liberado anteriormente.

  A instrução `DO` é conveniente para usar com `RELEASE_LOCK()`. Consulte a Seção 13.2.3, “Instrução DO”.

  Esta função não é segura para Statement-Based Replication. Um aviso é registrado se você usar esta função quando `binlog_format` estiver configurado como `STATEMENT`.