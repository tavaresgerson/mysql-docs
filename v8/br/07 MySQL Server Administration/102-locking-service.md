#### 7.6.9.1 O Serviço de Bloqueio

As distribuições do MySQL fornecem uma interface de bloqueio acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis que correspondem a chamadas às rotinas do serviço.
* Como uma interface em linguagem C, acessível como um serviço de plugin a partir de plugins do servidor ou funções carregáveis.

Para informações gerais sobre serviços de plugins, consulte a Seção 7.6.9, “Serviços de Plugin do MySQL”. Para informações gerais sobre funções carregáveis, consulte Adicionando uma Função Carregável.

A interface de bloqueio tem essas características:

* Os bloqueios têm três atributos: Espaço de nome do bloqueio, nome do bloqueio e modo de bloqueio:

+ As chaves são identificadas pela combinação do namespace e do nome da chave. O namespace permite que diferentes aplicativos usem os mesmos nomes de chave sem colidirem ao criar chaves em namespaces separados. Por exemplo, se os aplicativos A e B usarem namespaces de `ns1` e `ns2`, respectivamente, cada aplicativo pode usar os nomes de chave `lock1` e `lock2` sem interferir no outro aplicativo.
  + O modo de bloqueio é de leitura ou escrita. As chaves de leitura são compartilhadas: Se uma sessão tiver uma chave de leitura em um identificador de chave dado, outras sessões podem adquirir uma chave de leitura no mesmo identificador. As chaves de escrita são exclusivas: Se uma sessão tiver uma chave de escrita em um identificador de chave dado, outras sessões não podem adquirir uma chave de leitura ou de escrita no mesmo identificador.
* O namespace e os nomes das chaves devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres. Um namespace ou nome de chave especificado como `NULL`, a string vazia ou uma string com mais de 64 caracteres resulta em um erro `ER_LOCKING_SERVICE_WRONG_NAME`.
* A interface de bloqueio trata o namespace e os nomes das chaves como strings binárias, então as comparações são sensíveis ao caso.
* A interface de bloqueio fornece funções para adquirir chaves e liberar chaves. Não é necessário privilégio especial para chamar essas funções. A verificação de privilégio é responsabilidade do aplicativo que faz a chamada.
* As chaves podem ser esperadas se não estiverem imediatamente disponíveis. As chamadas de aquisição de chaves levam um valor de timeout inteiro que indica quantos segundos esperar para adquirir chaves antes de desistir. Se o timeout for alcançado sem a aquisição bem-sucedida de uma chave, ocorre um erro `ER_LOCKING_SERVICE_TIMEOUT`. Se o timeout for 0, não há espera e a chamada produz um erro se as chaves não puderem ser adquiridas imediatamente.
* A interface de bloqueio detecta um impasse entre chamadas de aquisição de chaves em diferentes sessões. Neste caso, o serviço de bloqueio escolhe um chamador e termina sua solicitação de aquisição de chaves com um erro `ER_LOCKING_SERVICE_DEADLOCK`. Esse erro não faz com que as transações sejam revertidas. Para escolher uma sessão em caso de impasse, o serviço de bloqueio prefere sessões que possuem chaves de leitura em vez de sessões que possuem chaves de escrita.
* Uma sessão pode adquirir múltiplas chaves com uma única chamada de aquisição de chaves. Para uma chamada dada, a aquisição de chaves é atômica: A chamada tem sucesso se todas as chaves forem adquiridas. Se a aquisição de qualquer chave falhar, a chamada não adquire chaves e falha, tipicamente com um erro `ER_LOCKING_SERVICE_TIMEOUT` ou `ER_LOCKING_SERVICE_DEADLOCK`.
* Uma sessão pode adquirir múltiplas chaves para o mesmo identificador de chave (combinação de namespace e nome de chave). Essas instâncias de chaves podem ser chaves de leitura, chaves de escrita ou uma mistura de ambas.
* As chaves adquiridas dentro de uma sessão são liberadas explicitamente chamando uma função de liberar chaves, ou implicitamente quando a sessão termina (normalmente ou anormalmente). As chaves não são liberadas quando as transações são confirmadas ou revertidas.
* Dentro de uma sessão, todas as chaves para um namespace dado são liberadas juntas.

A interface fornecida pelo serviço de bloqueio é distinta daquela fornecida por `GET_LOCK()` e pelas funções SQL relacionadas (consulte a Seção 14.14, “Funções de Bloqueio”). Por exemplo, `GET_LOCK()` não implementa namespaces e fornece apenas bloqueios exclusivos, não bloqueios de leitura e escrita distintos.

##### 7.6.9.1.1 A Interface em C do Serviço de Bloqueio

Esta seção descreve como usar a interface em linguagem C do serviço de bloqueio. Para usar a interface da função em vez disso, consulte a Seção 7.6.9.1.2, “A Interface da Função do Serviço de Bloqueio”. Para características gerais da interface do serviço de bloqueio, consulte a Seção 7.6.9.1, “O Serviço de Bloqueio”. Para informações gerais sobre os serviços de plugins, consulte a Seção 7.6.9, “Serviços de Plugins MySQL”.

Os arquivos de origem que usam o serviço de bloqueio devem incluir este arquivo de cabeçalho:

```
#include <mysql/service_locking.h>
```

Para adquirir um ou mais bloqueios, chame esta função:

```
int mysql_acquire_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace,
                                        const char**lock_names,
                                        size_t lock_num,
                                        enum enum_locking_service_lock_type lock_type,
                                        unsigned long lock_timeout);
```

Os argumentos têm estes significados:

* `opaque_thd`: Um handle de thread. Se especificado como `NULL`, o handle do thread atual é usado.
* `lock_namespace`: Uma string terminada por null que indica o namespace do bloqueio.
* `lock_names`: Um array de strings terminadas por null que fornece os nomes dos bloqueios a serem adquiridos.
* `lock_num`: O número de nomes no array `lock_names`.
* `lock_type`: O modo de bloqueio, `LOCKING_SERVICE_READ` ou `LOCKING_SERVICE_WRITE` para adquirir bloqueios de leitura ou escrita, respectivamente.
* `lock_timeout`: Um número inteiro de segundos para esperar para adquirir os bloqueios antes de desistir.

Para liberar bloqueios adquiridos para um namespace específico, chame esta função:

```
int mysql_release_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace);
```

Os argumentos têm estes significados:

* `opaque_thd`: Um handle de thread. Se especificado como `NULL`, o handle do thread atual é usado.
* `lock_namespace`: Uma string terminada por null que indica o namespace do bloqueio.

Os bloqueios adquiridos ou esperados pelo serviço de bloqueio podem ser monitorados no nível SQL usando o Schema de Desempenho. Para detalhes, consulte Monitoramento do Serviço de Bloqueio.

##### 7.6.9.1.2 Interface da Função de Serviço de Bloqueio

Esta seção descreve como usar a interface do serviço de bloqueio fornecida por suas funções carregáveis. Para usar a interface em linguagem C, consulte a Seção 7.6.9.1.1, “A Interface C do Serviço de Bloqueio”. Para características gerais da interface do serviço de bloqueio, consulte a Seção 7.6.9.1, “O Serviço de Bloqueio”. Para informações gerais sobre funções carregáveis, consulte Adicionando uma Função Carregável.

*  Instalando ou Desinstalando a Interface da Função de Serviço de Bloqueio
*  Usando a Interface da Função de Serviço de Bloqueio
*  Monitoramento do Serviço de Bloqueio
*  Referência da Função da Interface do Serviço de Bloqueio

###### Instalando ou Desinstalando a Interface da Função de Serviço de Bloqueio

As rotinas do serviço de bloqueio descritas na Seção 7.6.9.1.1, “A Interface C do Serviço de Bloqueio” não precisam ser instaladas, pois estão embutidas no servidor. O mesmo não é verdade para as funções carregáveis que mapeiam chamadas para as rotinas do serviço: as funções devem ser instaladas antes do uso. Esta seção descreve como fazer isso. Para informações gerais sobre a instalação de funções carregáveis, consulte a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

As funções do serviço de bloqueio são implementadas em um arquivo de biblioteca de plugins localizado no diretório nomeado pela variável de sistema `plugin_dir`. O nome do arquivo base é `locking_service`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar as funções do serviço de bloqueio, use a instrução `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
CREATE FUNCTION service_get_read_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_get_write_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_release_locks RETURNS INT
  SONAME 'locking_service.so';
```

Se as funções forem usadas em um servidor de fonte de replicação, instale-as em todos os servidores replicados também para evitar problemas de replicação.

Uma vez instaladas, as funções permanecem instaladas até serem desinstaladas. Para removê-las, use a instrução `DROP FUNCTION`:

```
DROP FUNCTION service_get_read_locks;
DROP FUNCTION service_get_write_locks;
DROP FUNCTION service_release_locks;
```

###### Usando a Interface da Função de Serviço de Bloqueio

Antes de usar as funções do serviço de bloqueio, instale-as de acordo com as instruções fornecidas em Instalar ou desinstalar a interface da função do serviço de bloqueio.

Para adquirir um ou mais bloqueios de leitura, chame esta função:

```
mysql> SELECT service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10);
+---------------------------------------------------------------+
| service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10) |
+---------------------------------------------------------------+
|                                                             1 |
+---------------------------------------------------------------+
```

O primeiro argumento é o namespace do bloqueio. O argumento final é um tempo de espera inteiro que indica quantos segundos esperar para adquirir os bloqueios antes de desistir. Os argumentos entre eles são os nomes dos bloqueios.

No exemplo mostrado, a função adquire bloqueios com identificadores de bloqueio `(mynamespace, rlock1)` e `(mynamespace, rlock2)`.

Para adquirir bloqueios de escrita em vez de bloqueios de leitura, chame esta função:

```
mysql> SELECT service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10);
+----------------------------------------------------------------+
| service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10) |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Neste caso, os identificadores de bloqueio são `(mynamespace, wlock1)` e `(mynamespace, wlock2)`.

Para liberar todos os bloqueios para um namespace, use esta função:

```
mysql> SELECT service_release_locks('mynamespace');
+--------------------------------------+
| service_release_locks('mynamespace') |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Cada função de bloqueio retorna um valor diferente para sucesso. Se a função falhar, ocorre um erro. Por exemplo, o seguinte erro ocorre porque os nomes dos bloqueios não podem ser vazios:

```
mysql> SELECT service_get_read_locks('mynamespace', '', 10);
ERROR 3131 (42000): Incorrect locking service lock name ''.
```

Uma sessão pode adquirir múltiplos bloqueios para o mesmo identificador de bloqueio. Enquanto uma sessão diferente não tiver um bloqueio de escrita para um identificador, a sessão pode adquirir qualquer número de bloqueios de leitura ou escrita. Cada solicitação de bloqueio para o identificador adquire um novo bloqueio. As seguintes instruções adquirem três bloqueios de escrita com o mesmo identificador, depois três bloqueios de leitura para o mesmo identificador:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock1', 'lock1', 0);
SELECT service_get_read_locks('ns', 'lock1', 'lock1', 'lock1', 0);
```

Se examinar a tabela `metadata_locks` do Schema de desempenho neste ponto, você deve encontrar que a sessão detém seis bloqueios distintos com o mesmo identificador `(ns, lock1)`. (Para detalhes, consulte Monitoramento do serviço de bloqueio.)

Como a sessão detém pelo menos um bloqueio de escrita em `(ns, lock1)`, nenhuma outra sessão pode adquirir um bloqueio para ele, seja de leitura ou escrita. Se a sessão detentasse apenas bloqueios de leitura para o identificador, outras sessões poderiam adquirir bloqueios de leitura para ele, mas não bloqueios de escrita.

Lås para uma única chamada de aquisição de bloqueio são adquiridos de forma atômica, mas a atómica não se mantém em chamadas diferentes. Assim, para uma declaração como a seguinte, onde `service_get_write_locks()` é chamada uma vez por linha do conjunto de resultados, a atómica se mantém para cada chamada individual, mas não para a declaração como um todo:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock2', 0) FROM t1 WHERE ... ;
```

Cuidado

Como o serviço de bloqueio retorna um bloqueio separado para cada solicitação bem-sucedida para um identificador de bloqueio dado, é possível que uma única declaração adquira um grande número de blocos. Por exemplo:

```
INSERT INTO ... SELECT service_get_write_locks('ns', t1.col_name, 0) FROM t1;
```

Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em parte e for revertida, os blocos adquiridos até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e os blocos adquiridos, essa intenção não é satisfeita. Além disso, se é importante que os blocos sejam concedidos em uma certa ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução escolhido pelo otimizador. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de bloqueio por declaração.

###### Monitoramento do Serviço de Bloqueio

O serviço de bloqueio é implementado usando a estrutura de metadados de bloqueio do MySQL Server, então você monitora os blocos de serviço de bloqueio adquiridos ou aguardados examinando a tabela `metadata_locks` do Schema de Desempenho.

Primeiro, habilite o instrumento de bloqueio de metadados:

```
mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
    -> WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

Em seguida, adquira alguns blocos e verifique o conteúdo da tabela `metadata_locks`:

```
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

Os blocos do serviço de bloqueio têm um valor `OBJECT_TYPE` de `LOCKING SERVICE`. Isso é distinto, por exemplo, dos blocos adquiridos com a função `GET_LOCK()`, que têm um `OBJECT_TYPE` de `USER LEVEL LOCK`.

O namespace, nome e modo do bloqueio aparecem nas colunas `OBJECT_SCHEMA`, `OBJECT_NAME` e `LOCK_TYPE`. Blocos de leitura e escrita têm valores `LOCK_TYPE` de `SHARED` e `EXCLUSIVE`, respectivamente.

O valor `LOCK_STATUS` é `GRANTED` para um bloqueio adquirido, `PENDING` para um bloqueio que está sendo aguardado. Você pode esperar ver `PENDING` se uma sessão estiver segurando um bloqueio de escrita e outra sessão estiver tentando adquirir um bloqueio com o mesmo identificador.

###### Referência de Função da Interface do Serviço de Bloqueio

A interface SQL para o serviço de bloqueio implementa as funções carregáveis descritas nesta seção. Para exemplos de uso, consulte Usando a Interface de Função do Serviço de Bloqueio.

As funções compartilham essas características:

* O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.
* O namespace e os nomes dos blocos devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres.
* Os valores de tempo de espera devem ser inteiros indicando quantos segundos esperar para adquirir blocos antes de desistir com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os blocos não puderem ser adquiridos imediatamente.

Estas funções do serviço de bloqueio estão disponíveis:

* `service_get_read_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais blocos de leitura (compartilhados) no namespace dado usando os nomes de bloqueio dados, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera dado.
* `service_get_write_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais blocos de escrita (exclusivos) no namespace dado usando os nomes de bloqueio dados, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera dado.
*  `service_release_locks(namespace)`

  Para o namespace dado, libera todos os blocos adquiridos dentro da sessão atual usando `service_get_read_locks()` e `service_get_write_locks()`.

Não é um erro que não haja blocos no namespace.