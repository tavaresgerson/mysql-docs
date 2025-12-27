#### 7.6.8.1 O Serviço de Bloqueio

As distribuições do MySQL fornecem uma interface de bloqueio acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis que correspondem a chamadas às rotinas do serviço.

* Como uma interface em linguagem C, acessível como um serviço de plugin a partir de plugins do servidor ou funções carregáveis.

Para informações gerais sobre serviços de plugin, consulte a Seção 7.6.8, “Serviços de Plugin do MySQL”. Para informações gerais sobre funções carregáveis, consulte Adicionando uma Função Carregável.

A interface de bloqueio tem essas características:

* Os blocos têm três atributos: Espaço de nome do bloqueio, nome do bloqueio e modo de bloqueio:

  + Os blocos são identificados pela combinação do espaço de nome e do nome do bloqueio. O espaço de nome permite que diferentes aplicações usem os mesmos nomes de bloqueio sem colidirem ao criar blocos em espaços de nome separados. Por exemplo, se as aplicações A e B usarem espaços de nome `ns1` e `ns2`, respectivamente, cada aplicação pode usar nomes de bloqueio `lock1` e `lock2` sem interferir na outra aplicação.

  + O modo de bloqueio é leitura ou escrita. Blocos de leitura são compartilhados: Se uma sessão tem um bloqueio de leitura em um identificador de bloqueio dado, outras sessões podem adquirir um bloqueio de leitura no mesmo identificador. Blocos de escrita são exclusivos: Se uma sessão tem um bloqueio de escrita em um identificador de bloqueio dado, outras sessões não podem adquirir um bloqueio de leitura ou escrita no mesmo identificador.

* O espaço de nome e os nomes dos blocos devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres. Um espaço de nome ou nome de bloqueio especificado como `NULL`, a string vazia ou uma string mais longa que 64 caracteres resulta em um erro `ER_LOCKING_SERVICE_WRONG_NAME`.

* A interface de bloqueio trata o espaço de nome e os nomes dos blocos como strings binárias, portanto, as comparações são sensíveis ao caso.

* A interface de bloqueio oferece funções para adquirir e liberar blocos. Não é necessário privilégio especial para chamar essas funções. A verificação de privilégio é responsabilidade do aplicativo que faz a chamada.

* Blocos podem ser esperados se não estiverem imediatamente disponíveis. As chamadas para adquirir blocos aceitam um valor de timeout inteiro que indica quantos segundos devem ser esperados para adquirir blocos antes de desistir. Se o timeout for alcançado sem a aquisição bem-sucedida do bloco, ocorre um erro `ER_LOCKING_SERVICE_TIMEOUT`. Se o timeout for 0, não há espera e a chamada produz um erro se os blocos não puderem ser adquiridos imediatamente.

* A interface de bloqueio detecta impasse entre chamadas de aquisição de blocos em diferentes sessões. Nesse caso, o serviço de bloqueio escolhe um chamador e termina sua solicitação de aquisição de blocos com um erro `ER_LOCKING_SERVICE_DEADLOCK`. Esse erro não faz com que as transações sejam revertidas. Para escolher uma sessão em caso de impasse, o serviço de bloqueio prefere sessões que possuem blocos de leitura em vez de sessões que possuem blocos de escrita.

* Uma sessão pode adquirir múltiplos blocos com uma única chamada de aquisição de blocos. Para uma chamada dada, a aquisição de blocos é atômica: A chamada tem sucesso se todos os blocos forem adquiridos. Se a aquisição de qualquer bloco falhar, a chamada não adquire blocos e falha, tipicamente com um erro `ER_LOCKING_SERVICE_TIMEOUT` ou `ER_LOCKING_SERVICE_DEADLOCK`.

* Uma sessão pode adquirir múltiplos blocos para o mesmo identificador de bloco (combinação de namespace e nome do bloco). Essas instâncias de blocos podem ser blocos de leitura, blocos de escrita ou uma mistura de ambos.

* Blocos adquiridos dentro de uma sessão são liberados explicitamente chamando uma função de liberar blocos, ou implicitamente quando a sessão termina (normalmente ou anormalmente). Os blocos não são liberados quando as transações são confirmadas ou revertidas.

* Durante uma sessão, todas as chaves para um namespace específico são liberadas juntas.

A interface fornecida pelo serviço de bloqueio é distinta daquela fornecida por `GET_LOCK()` e pelas funções SQL relacionadas (consulte a Seção 14.14, “Funções de Bloqueio”). Por exemplo, `GET_LOCK()` não implementa namespaces e fornece apenas blocos exclusivos, não blocos de leitura e escrita distintos.

##### 7.6.8.1.1 A Interface C do Serviço de Bloqueio

Esta seção descreve como usar a interface em linguagem C do serviço de bloqueio. Para usar a interface de função em vez disso, consulte a Seção 7.6.8.1.2, “A Interface de Função do Serviço de Bloqueio”. Para características gerais da interface do serviço de bloqueio, consulte a Seção 7.6.8.1, “O Serviço de Bloqueio”. Para informações gerais sobre os serviços de plugins, consulte a Seção 7.6.8, “Serviços de Plugins MySQL”.

Os arquivos de origem que usam o serviço de bloqueio devem incluir este arquivo de cabeçalho:

```
#include <mysql/service_locking.h>
```

Para adquirir um ou mais blocos, chame esta função:

```
int mysql_acquire_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace,
                                        const char**lock_names,
                                        size_t lock_num,
                                        enum enum_locking_service_lock_type lock_type,
                                        unsigned long lock_timeout);
```

Os argumentos têm esses significados:

* `opaque_thd`: Um handle de thread. Se especificado como `NULL`, o handle do thread atual é usado.

* `lock_namespace`: Uma string terminada por null que indica o namespace do bloqueio.

* `lock_names`: Um array de strings terminadas por null que fornece os nomes dos blocos a serem adquiridos.

* `lock_num`: O número de nomes no array `lock_names`.

* `lock_type`: O modo de bloqueio, `LOCKING_SERVICE_READ` ou `LOCKING_SERVICE_WRITE` para adquirir blocos de leitura ou escrita, respectivamente.

* `lock_timeout`: Um número inteiro de segundos para esperar para adquirir os blocos antes de desistir.

Para liberar blocos adquiridos para um namespace específico, chame esta função:

```
int mysql_release_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace);
```

Os argumentos têm esses significados:

* `opaque_thd`: Um handle de thread. Se especificado como `NULL`, o handle da thread atual é usado.

* `lock_namespace`: Uma string terminada em null que indica o namespace de bloqueio.

Os bloqueios adquiridos ou esperados pelo serviço de bloqueio podem ser monitorados no nível SQL usando o Schema de Desempenho. Para obter detalhes, consulte Monitoramento do Serviço de Bloqueio.

##### 7.6.8.1.2 A Interface da Função do Serviço de Bloqueio

Esta seção descreve como usar a interface do serviço de bloqueio fornecida por suas funções carregáveis. Para usar a interface em linguagem C, consulte a Seção 7.6.8.1.1, “A Interface C do Serviço de Bloqueio”. Para características gerais da interface do serviço de bloqueio, consulte a Seção 7.6.8.1, “O Serviço de Bloqueio”. Para informações gerais sobre funções carregáveis, consulte Adicionando uma Função Carregável.

* Instalando ou Desinstalando a Interface da Função do Serviço de Bloqueio
* Usando a Interface da Função do Serviço de Bloqueio
* Monitoramento do Serviço de Bloqueio
* Referência da Função da Interface do Serviço de Bloqueio

###### Instalando ou Desinstalando a Interface da Função do Serviço de Bloqueio

As rotinas do serviço de bloqueio descritas na Seção 7.6.8.1.1, “A Interface C do Serviço de Bloqueio” não precisam ser instaladas, pois estão integradas ao servidor. O mesmo não é verdade para as funções carregáveis que mapeiam chamadas para as rotinas do serviço: as funções devem ser instaladas antes do uso. Esta seção descreve como fazer isso. Para informações gerais sobre a instalação de funções carregáveis, consulte a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

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

###### Usando a Interface da Função do Serviço de Bloqueio

Antes de usar as funções do serviço de bloqueio, instale-as de acordo com as instruções fornecidas em Instalar ou Desinstalar a Interface da Função do Serviço de Bloqueio.

Para adquirir um ou mais bloqueios de leitura, chame essa função:

```
mysql> SELECT service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10);
+---------------------------------------------------------------+
| service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10) |
+---------------------------------------------------------------+
|                                                             1 |
+---------------------------------------------------------------+
```

O primeiro argumento é o namespace do bloqueio. O argumento final é um tempo de espera inteiro indicando quantos segundos esperar para adquirir os bloqueios antes de desistir. Os argumentos entre eles são os nomes dos bloqueios.

Para o exemplo mostrado, a função adquire blocos com identificadores de bloqueio `(mynamespace, rlock1)` e `(mynamespace, rlock2)`.

Para adquirir blocos de escrita em vez de blocos de leitura, chame essa função:

```
mysql> SELECT service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10);
+----------------------------------------------------------------+
| service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10) |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Neste caso, os identificadores de bloqueio são `(mynamespace, wlock1)` e `(mynamespace, wlock2)`.

Para liberar todos os bloqueios para um namespace, use essa função:

```
mysql> SELECT service_release_locks('mynamespace');
+--------------------------------------+
| service_release_locks('mynamespace') |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Cada função de bloqueio retorna um valor não nulo para sucesso. Se a função falhar, ocorre um erro. Por exemplo, o seguinte erro ocorre porque os nomes dos bloqueios não podem ser vazios:

```
mysql> SELECT service_get_read_locks('mynamespace', '', 10);
ERROR 3131 (42000): Incorrect locking service lock name ''.
```

Uma sessão pode adquirir múltiplos bloqueios para o mesmo identificador de bloqueio. Enquanto uma sessão diferente não tiver um bloqueio de escrita para um identificador, a sessão pode adquirir qualquer número de bloquios de leitura ou escrita. Cada solicitação de bloqueio para o identificador adquire um novo bloqueio. As seguintes declarações adquirem três bloquios de escrita com o mesmo identificador, depois três bloquios de leitura para o mesmo identificador:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock1', 'lock1', 0);
SELECT service_get_read_locks('ns', 'lock1', 'lock1', 'lock1', 0);
```

Se você examinar a tabela `metadata_locks` do Gerenciamento de Desempenho neste ponto, você deve encontrar que a sessão detém seis bloquios distintos com o mesmo identificador `(ns, lock1)`. (Para detalhes, consulte Monitoramento do Serviço de Bloqueio.)

Como a sessão detém pelo menos um bloqueio de escrita em `(ns, lock1)`, nenhuma outra sessão pode adquirir um bloqueio para ele, seja de leitura ou escrita. Se a sessão tivesse apenas bloquios de leitura para o identificador, outras sessões poderiam adquirir bloquios de leitura para ele, mas não bloquios de escrita.

Os bloquios para uma única chamada de aquisição de bloqueio são adquiridos de forma atômica, mas a atonia não se mantém em chamadas cruzadas. Assim, para uma declaração como a seguinte, onde `service_get_write_locks()` é chamada uma vez por linha do conjunto de resultados, a atonia se mantém para cada chamada individual, mas não para a declaração como um todo:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock2', 0) FROM t1 WHERE ... ;
```

Cuidado

Como o serviço de bloqueio retorna um bloqueio separado para cada solicitação bem-sucedida para um identificador de bloqueio dado, é possível que uma única declaração adquira um grande número de bloquios. Por exemplo:

```
INSERT INTO ... SELECT service_get_write_locks('ns', t1.col_name, 0) FROM t1;
```

Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em parte e for revertida, as chaves adquiridas até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e as chaves adquiridas, essa intenção não é satisfeita. Além disso, se é importante que as chaves sejam concedidas em uma ordem específica, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução escolhido pelo otimizador. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de chave por declaração.

###### Monitoramento do Serviço de Acionamento de Chaves

O serviço de acionamento de chaves é implementado usando a estrutura de metadados de chaves do MySQL Server, então você monitora as chaves de acionamento de chaves adquiridas ou aguardadas examinando a tabela `metadata_locks` do Schema de Desempenho.

Primeiro, habilite o instrumento de chave de metadados:

```
mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
    -> WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

Em seguida, adquira algumas chaves e verifique o conteúdo da tabela `metadata_locks`:

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

As chaves de acionamento de serviços têm um valor `OBJECT_TYPE` de `LOCKING SERVICE`. Isso é distinto, por exemplo, das chaves adquiridas com a função `GET_LOCK()`, que têm um `OBJECT_TYPE` de `USER LEVEL LOCK`.

O namespace, nome e modo da chave aparecem nas colunas `OBJECT_SCHEMA`, `OBJECT_NAME` e `LOCK_TYPE`. Chaves de leitura e escrita têm valores `LOCK_TYPE` de `SHARED`, respectivamente.

O valor `LOCK_STATUS` é `GRANTED` para uma chave adquirida, `PENDING` para uma chave que está sendo aguardada. Você pode esperar ver `PENDING` se uma sessão estiver segurando uma chave de escrita e outra sessão estiver tentando adquirir uma chave com o mesmo identificador.

###### Referência de Função de Interface do Serviço de Acionamento de Chaves

A interface SQL do serviço de bloqueio implementa as funções carregáveis descritas nesta seção. Para exemplos de uso, consulte Usando a Interface de Função do Serviço de Bloqueio.

As funções compartilham essas características:

* O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.

* O namespace e os nomes dos blocos devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres.

* Os valores de tempo de espera devem ser inteiros indicando quantos segundos esperar para adquirir blocos antes de desistir com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os blocos não puderem ser adquiridos imediatamente.

Estas funções do serviço de bloqueio estão disponíveis:

* `service_get_read_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais blocos de leitura (compartilhados) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera fornecido.

* `service_get_write_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais blocos de escrita (exclusivos) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera fornecido.

* `service_release_locks(namespace)`

  Para o namespace fornecido, libera todos os blocos adquiridos durante a sessão atual usando `service_get_read_locks()` e `service_get_write_locks()`.

Não é um erro se não houver blocos no namespace.