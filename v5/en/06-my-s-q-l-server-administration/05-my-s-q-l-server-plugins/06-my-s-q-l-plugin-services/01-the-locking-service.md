#### 5.5.6.1 O Locking Service

As distribuições MySQL fornecem uma interface de Lock que é acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis (loadable functions) que se mapeiam para chamadas às rotinas do service.

* Como uma interface de linguagem C, chamável como um plugin service a partir de plugins de servidor ou funções carregáveis.

Para informações gerais sobre plugin services, consulte [Seção 5.5.6, “MySQL Plugin Services”](plugin-services.html "5.5.6 MySQL Plugin Services"). Para informações gerais sobre funções carregáveis, consulte [Adding a Loadable Function](/doc/extending-mysql/5.7/en/adding-loadable-function.html).

A interface de Lock possui estas características:

* Locks têm três atributos: Lock namespace, lock name e lock mode:
  + Locks são identificados pela combinação de namespace e lock name. O namespace permite que diferentes aplicações usem os mesmos lock names sem colisão, criando Locks em namespaces separados. Por exemplo, se as aplicações A e B usam namespaces `ns1` e `ns2`, respectivamente, cada aplicação pode usar os lock names `lock1` e `lock2` sem interferir com a outra aplicação.
  + Um lock mode é do tipo read (leitura) ou write (escrita). Read locks são compartilhados (shared): Se uma session tem um read lock em um determinado identificador de Lock, outras sessions podem adquirir um read lock no mesmo identificador. Write locks são exclusivos (exclusive): Se uma session tem um write lock em um determinado identificador de Lock, outras sessions não podem adquirir um read lock ou write lock no mesmo identificador.

* Namespace e lock names devem ser não-`NULL`, não vazios e ter um comprimento máximo de 64 caracteres. Um namespace ou lock name especificado como `NULL`, string vazia ou uma string com mais de 64 caracteres resulta em um erro [`ER_LOCKING_SERVICE_WRONG_NAME`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_locking_service_wrong_name).

* A interface de Lock trata namespace e lock names como binary strings, portanto, as comparações diferenciam maiúsculas de minúsculas (case-sensitive).

* A interface de Lock fornece funções para adquirir locks e liberar locks. Nenhum privilégio especial é exigido para chamar essas funções. A verificação de privilégios é responsabilidade da aplicação chamadora.

* Locks podem ser esperados caso não estejam imediatamente disponíveis. As chamadas de aquisição de Lock aceitam um valor inteiro de timeout que indica quantos segundos esperar para adquirir Locks antes de desistir. Se o timeout for atingido sem aquisição bem-sucedida do Lock, ocorre um erro [`ER_LOCKING_SERVICE_TIMEOUT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_locking_service_timeout). Se o timeout for 0, não há espera, e a chamada produz um erro se os Locks não puderem ser adquiridos imediatamente.

* A interface de Lock detecta Deadlock entre chamadas de aquisição de Lock em diferentes sessions. Neste caso, o locking service escolhe um chamador e encerra sua solicitação de aquisição de Lock com um erro [`ER_LOCKING_SERVICE_DEADLOCK`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_locking_service_deadlock). Este erro não causa o rollback das transactions. Para escolher uma session em caso de Deadlock, o locking service prefere sessions que detêm read locks em detrimento daquelas que detêm write locks.

* Uma session pode adquirir múltiplos locks com uma única chamada de aquisição de Lock. Para uma determinada chamada, a aquisição de Lock é atomic: A chamada é bem-sucedida se todos os Locks forem adquiridos. Se a aquisição de qualquer Lock falhar, a chamada não adquire Locks e falha, tipicamente com um erro [`ER_LOCKING_SERVICE_TIMEOUT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_locking_service_timeout) ou [`ER_LOCKING_SERVICE_DEADLOCK`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_locking_service_deadlock).

* Uma session pode adquirir múltiplos Locks para o mesmo identificador de Lock (combinação de namespace e lock name). Essas instâncias de Lock podem ser read locks, write locks ou uma mistura de ambos.

* Locks adquiridos dentro de uma session são liberados explicitamente chamando uma função de liberação de Locks, ou implicitamente quando a session é encerrada (normalmente ou anormalmente). Locks não são liberados quando as transactions fazem commit ou rollback.

* Dentro de uma session, todos os Locks para um determinado namespace são liberados em conjunto quando a liberação é solicitada.

A interface fornecida pelo locking service é distinta daquela fornecida por [`GET_LOCK()`](locking-functions.html#function_get-lock) e funções SQL relacionadas (consulte [Seção 12.14, “Locking Functions”](locking-functions.html "12.14 Locking Functions")). Por exemplo, [`GET_LOCK()`](locking-functions.html#function_get-lock) não implementa namespaces e fornece apenas exclusive locks, não read locks e write locks distintos.

##### 5.5.6.1.1 A Interface C do Locking Service

Esta seção descreve como usar a interface de linguagem C do locking service. Para usar a interface de função em vez disso, consulte [Seção 5.5.6.1.2, “A Interface de Função do Locking Service”](locking-service.html#locking-service-interface "5.5.6.1.2 A Interface de Função do Locking Service") Para características gerais da interface do locking service, consulte [Seção 5.5.6.1, “O Locking Service”](locking-service.html "5.5.6.1 O Locking Service"). Para informações gerais sobre plugin services, consulte [Seção 5.5.6, “MySQL Plugin Services”](plugin-services.html "5.5.6 MySQL Plugin Services").

Os arquivos de código-fonte que usam o locking service devem incluir este arquivo header:

```sql
#include <mysql/service_locking.h>
```

Para adquirir um ou mais locks, chame esta função:

```sql
int mysql_acquire_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace,
                                        const char**lock_names,
                                        size_t lock_num,
                                        enum enum_locking_service_lock_type lock_type,
                                        unsigned long lock_timeout);
```

Os argumentos têm estes significados:

* `opaque_thd`: Um handle de Thread. Se especificado como `NULL`, o handle para o Thread atual é usado.

* `lock_namespace`: Uma string terminada em null que indica o lock namespace.

* `lock_names`: Um array de strings terminadas em null que fornece os nomes dos Locks a serem adquiridos.

* `lock_num`: O número de nomes no array `lock_names`.

* `lock_type`: O lock mode, sendo `LOCKING_SERVICE_READ` ou `LOCKING_SERVICE_WRITE` para adquirir read locks ou write locks, respectivamente.

* `lock_timeout`: Um número inteiro de segundos a esperar para adquirir os Locks antes de desistir.

Para liberar Locks adquiridos para um determinado namespace, chame esta função:

```sql
int mysql_release_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace);
```

Os argumentos têm estes significados:

* `opaque_thd`: Um handle de Thread. Se especificado como `NULL`, o handle para o Thread atual é usado.

* `lock_namespace`: Uma string terminada em null que indica o lock namespace.

Locks adquiridos ou esperados pelo locking service podem ser monitorados no nível SQL usando o Performance Schema. Para detalhes, consulte [Locking Service Monitoring](locking-service.html#locking-service-monitoring "Locking Service Monitoring").

##### 5.5.6.1.2 A Interface de Função do Locking Service

Esta seção descreve como usar a interface do locking service fornecida por suas funções carregáveis (loadable functions). Para usar a interface de linguagem C em vez disso, consulte [Seção 5.5.6.1.1, “A Interface C do Locking Service”](locking-service.html#locking-service-c-interface "5.5.6.1.1 A Interface C do Locking Service") Para características gerais da interface do locking service, consulte [Seção 5.5.6.1, “O Locking Service”](locking-service.html "5.5.6.1 O Locking Service"). Para informações gerais sobre funções carregáveis, consulte [Adding a Loadable Function](/doc/extending-mysql/5.7/en/adding-loadable-function.html).

* [Instalando ou Desinstalando a Interface de Função do Locking Service](locking-service.html#locking-service-function-installation "Instalando ou Desinstalando a Interface de Função do Locking Service")
* [Usando a Interface de Função do Locking Service](locking-service.html#locking-service-function-usage "Usando a Interface de Função do Locking Service")
* [Locking Service Monitoring](locking-service.html#locking-service-monitoring "Locking Service Monitoring")
* [Referência da Função da Interface do Locking Service](locking-service.html#locking-service-function-reference "Referência da Função da Interface do Locking Service")

###### Instalando ou Desinstalando a Interface de Função do Locking Service

As rotinas do locking service descritas em [Seção 5.5.6.1.1, “A Interface C do Locking Service”](locking-service.html#locking-service-c-interface "5.5.6.1.1 A Interface C do Locking Service") não precisam ser instaladas porque estão integradas ao servidor. O mesmo não se aplica às funções carregáveis que se mapeiam para chamadas às rotinas do service: As funções devem ser instaladas antes do uso. Esta seção descreve como fazer isso. Para informações gerais sobre a instalação de funções carregáveis, consulte [Seção 5.6.1, “Installing and Uninstalling Loadable Functions”](function-loading.html "5.6.1 Installing and Uninstalling Loadable Functions").

As funções do locking service são implementadas em um arquivo de biblioteca de plugin localizado no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir). O nome base do arquivo é `locking_service`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar as funções do locking service, use a instrução [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement"), ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
CREATE FUNCTION service_get_read_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_get_write_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_release_locks RETURNS INT
  SONAME 'locking_service.so';
```

Se as funções forem usadas em um replication source server, instale-as em todos os replica servers também para evitar problemas de replicação.

Uma vez instaladas, as funções permanecem instaladas até serem desinstaladas. Para removê-las, use a instrução [`DROP FUNCTION`](drop-function.html "13.1.24 DROP FUNCTION Statement"):

```sql
DROP FUNCTION service_get_read_locks;
DROP FUNCTION service_get_write_locks;
DROP FUNCTION service_release_locks;
```

###### Usando a Interface de Função do Locking Service

Antes de usar as funções do locking service, instale-as de acordo com as instruções fornecidas em [Instalando ou Desinstalando a Interface de Função do Locking Service](locking-service.html#locking-service-function-installation "Instalando ou Desinstalando a Interface de Função do Locking Service").

Para adquirir um ou mais read locks, chame esta função:

```sql
mysql> SELECT service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10);
+---------------------------------------------------------------+
| service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10) |
+---------------------------------------------------------------+
|                                                             1 |
+---------------------------------------------------------------+
```

O primeiro argumento é o lock namespace. O argumento final é um inteiro de timeout indicando quantos segundos esperar para adquirir os Locks antes de desistir. Os argumentos intermediários são os lock names.

Para o exemplo recém-mostrado, a função adquire Locks com identificadores de Lock `(mynamespace, rlock1)` e `(mynamespace, rlock2)`.

Para adquirir write locks em vez de read locks, chame esta função:

```sql
mysql> SELECT service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10);
+----------------------------------------------------------------+
| service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10) |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Neste caso, os identificadores de Lock são `(mynamespace, wlock1)` e `(mynamespace, wlock2)`.

Para liberar todos os Locks para um namespace, use esta função:

```sql
mysql> SELECT service_release_locks('mynamespace');
+--------------------------------------+
| service_release_locks('mynamespace') |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Cada função de Lock retorna um valor diferente de zero para sucesso. Se a função falhar, ocorre um erro. Por exemplo, o seguinte erro ocorre porque lock names não podem ser vazios:

```sql
mysql> SELECT service_get_read_locks('mynamespace', '', 10);
ERROR 3131 (42000): Incorrect locking service lock name ''.
```

Uma session pode adquirir múltiplos Locks para o mesmo identificador de Lock. Contanto que uma session diferente não tenha um write lock para um identificador, a session pode adquirir qualquer número de read locks ou write locks. Cada solicitação de Lock para o identificador adquire um novo Lock. As seguintes instruções adquirem três write locks com o mesmo identificador, e depois três read locks para o mesmo identificador:

```sql
SELECT service_get_write_locks('ns', 'lock1', 'lock1', 'lock1', 0);
SELECT service_get_read_locks('ns', 'lock1', 'lock1', 'lock1', 0);
```

Se você examinar a tabela `metadata_locks` do Performance Schema neste ponto, você descobrirá que a session detém seis Locks distintos com o mesmo identificador `(ns, lock1)`. (Para detalhes, consulte [Locking Service Monitoring](locking-service.html#locking-service-monitoring "Locking Service Monitoring").)

Como a session detém pelo menos um write lock em `(ns, lock1)`, nenhuma outra session pode adquirir um Lock para ele, seja read ou write. Se a session detivesse apenas read locks para o identificador, outras sessions poderiam adquirir read locks para ele, mas não write locks.

Locks para uma única chamada de aquisição de Lock são adquiridos atomicamente, mas a atomicidade não se aplica entre chamadas. Assim, para uma instrução como a seguinte, onde [`service_get_write_locks()`](locking-service.html#function_service-get-write-locks) é chamada uma vez por linha do result set, a atomicidade se mantém para cada chamada individual, mas não para a instrução como um todo:

```sql
SELECT service_get_write_locks('ns', 'lock1', 'lock2', 0) FROM t1 WHERE ... ;
```

Cuidado

Como o locking service retorna um Lock separado para cada solicitação bem-sucedida para um determinado identificador de Lock, é possível que uma única instrução adquira um grande número de Locks. Por exemplo:

```sql
INSERT INTO ... SELECT service_get_write_locks('ns', t1.col_name, 0) FROM t1;
```

Estes tipos de instruções podem ter certos efeitos adversos. Por exemplo, se a instrução falhar no meio do caminho e fizer rollback, os Locks adquiridos até o ponto de falha ainda existirão. Se a intenção é que haja uma correspondência entre as linhas inseridas e os Locks adquiridos, essa intenção não é satisfeita. Além disso, se for importante que os Locks sejam concedidos em uma determinada ordem, esteja ciente de que a ordem do result set pode diferir dependendo do execution plan que o optimizer escolher. Por estas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de Lock por instrução.

###### Locking Service Monitoring

O locking service é implementado usando a estrutura de metadata locks do MySQL Server, portanto, você monitora os locks do locking service adquiridos ou esperados examinando a tabela `metadata_locks` do Performance Schema.

Primeiro, habilite o instrumento de metadata lock:

```sql
mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
    -> WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

Em seguida, adquira alguns Locks e verifique o conteúdo da tabela `metadata_locks`:

```sql
mysql> SELECT service_get_write_locks('mynamespace', 'lock1', 0);
+----------------------------------------------------+
| service_get_write_locks('mynamespace', 'lock1', 0) |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
mysql> SELECT service_get_read_locks('mynamespace', 'lock2', 0);
+---------------------------------------------------+
| service_get_read_locks('mynamespace', 'lock2', 0) |
+---------------------------------------------------+
|                                                 1 |
+---------------------------------------------------+
mysql> SELECT OBJECT_TYPE, OBJECT_SCHEMA, OBJECT_NAME, LOCK_TYPE, LOCK_STATUS
    -> FROM performance_schema.metadata_locks
    -> WHERE OBJECT_TYPE = 'LOCKING SERVICE'\G
*************************** 1. row ***************************
  OBJECT_TYPE: LOCKING SERVICE
OBJECT_SCHEMA: mynamespace
  OBJECT_NAME: lock1
    LOCK_TYPE: EXCLUSIVE
  LOCK_STATUS: GRANTED
*************************** 2. row ***************************
  OBJECT_TYPE: LOCKING SERVICE
OBJECT_SCHEMA: mynamespace
  OBJECT_NAME: lock2
    LOCK_TYPE: SHARED
  LOCK_STATUS: GRANTED
```

Os Locks do locking service têm um valor `OBJECT_TYPE` de `LOCKING SERVICE`. Isto é distinto de, por exemplo, Locks adquiridos com a função [`GET_LOCK()`](locking-functions.html#function_get-lock), que têm um `OBJECT_TYPE` de `USER LEVEL LOCK`.

O lock namespace, o nome e o modo aparecem nas colunas `OBJECT_SCHEMA`, `OBJECT_NAME` e `LOCK_TYPE`. Read locks e write locks têm valores `LOCK_TYPE` de `SHARED` e `EXCLUSIVE`, respectivamente.

O valor de `LOCK_STATUS` é `GRANTED` para um Lock adquirido, e `PENDING` para um Lock que está sendo esperado. Você verá `PENDING` se uma session detiver um write lock e outra session estiver tentando adquirir um Lock com o mesmo identificador.

###### Referência da Função da Interface do Locking Service

A interface SQL para o locking service implementa as funções carregáveis descritas nesta seção. Para exemplos de uso, consulte [Usando a Interface de Função do Locking Service](locking-service.html#locking-service-function-usage "Usando a Interface de Função do Locking Service").

As funções compartilham estas características:

* O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.

* Namespace e lock names devem ser não-`NULL`, não vazios e ter um comprimento máximo de 64 caracteres.

* Os valores de timeout devem ser inteiros que indicam quantos segundos esperar para adquirir Locks antes de desistir com um erro. Se o timeout for 0, não há espera e a função produz um erro se os Locks não puderem ser adquiridos imediatamente.

Estas funções do locking service estão disponíveis:

* [`service_get_read_locks(namespace, lock_name[, lock_name] ..., timeout)`](locking-service.html#function_service-get-read-locks)

  Adquire um ou mais read locks (shared) no namespace fornecido usando os lock names especificados, retornando erro se os Locks não forem adquiridos dentro do valor de timeout determinado.

* [`service_get_write_locks(namespace, lock_name[, lock_name] ..., timeout)`](locking-service.html#function_service-get-write-locks)

  Adquire um ou mais write locks (exclusive) no namespace fornecido usando os lock names especificados, retornando erro se os Locks não forem adquiridos dentro do valor de timeout determinado.

* [`service_release_locks(namespace)`](locking-service.html#function_service-release-locks)

  Para o namespace fornecido, libera todos os Locks que foram adquiridos dentro da session atual usando [`service_get_read_locks()`](locking-service.html#function_service-get-read-locks) e [`service_get_write_locks()`](locking-service.html#function_service-get-write-locks).

  Não é considerado um erro se não houver Locks no namespace.