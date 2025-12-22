#### 7.6.9.1 O serviço de fecho

As distribuições MySQL fornecem uma interface de bloqueio que é acessível em dois níveis:

- No nível SQL, como um conjunto de funções carregáveis que cada mapa em chamadas para as rotinas de serviço.
- Como uma interface de linguagem C, chamável como um serviço de plug-in de plug-ins de servidor ou funções carregáveis.

Para informações gerais sobre serviços de plugins, consulte a Seção 7.6.9, "Serviços de Plugins do MySQL". Para informações gerais sobre funções carregáveis, consulte Adicionar uma Função Carregável.

A interface de bloqueio tem as seguintes características:

- Bloqueios têm três atributos: espaço de nomes de bloqueio, nome de bloqueio e modo de bloqueio:

  - Os bloqueios são identificados pela combinação de namespace e nome de bloqueio. O namespace permite que diferentes aplicativos usem os mesmos nomes de bloqueio sem colisão, criando bloqueios em espaços de nomes separados. Por exemplo, se os aplicativos A e B usam espaços de nomes de `ns1` e `ns2`, respectivamente, cada aplicativo pode usar nomes de bloqueio `lock1` e `lock2` sem interferir com o outro aplicativo.
  - Um modo de bloqueio é de leitura ou gravação. Os bloqueios de leitura são compartilhados: Se uma sessão tiver um bloqueio de leitura em um determinado identificador de bloqueio, outras sessões podem adquirir um bloqueio de leitura no mesmo identificador. Os bloqueios de gravação são exclusivos: Se uma sessão tiver um bloqueio de gravação em um determinado identificador de bloqueio, outras sessões não podem adquirir um bloqueio de leitura ou gravação no mesmo identificador.
- Os nomes de espaço de nomes e de bloqueio devem ser não-`NULL`, não vazios e ter um comprimento máximo de 64 caracteres. Um nome de espaço de nomes ou de bloqueio especificado como `NULL`, a cadeia vazia ou uma cadeia com mais de 64 caracteres resulta em um erro `ER_LOCKING_SERVICE_WRONG_NAME`.
- A interface de bloqueio trata namespace e nomes de bloqueio como strings binárias, então as comparações são case-sensitivas.
- A interface de bloqueio fornece funções para adquirir bloqueios e liberar bloqueios. Nenhum privilégio especial é necessário para chamar essas funções. A verificação de privilégios é responsabilidade do aplicativo chamador.
- As fechaduras podem ser aguardadas se não estiverem disponíveis imediatamente. As chamadas de aquisição de fechaduras tomam um valor de tempo de espera inteiro que indica quantos segundos esperar para adquirir fechaduras antes de desistir. Se o tempo de espera for alcançado sem aquisição de fechadura bem-sucedida, ocorre um erro `ER_LOCKING_SERVICE_TIMEOUT`. Se o tempo de espera for 0, não há espera e a chamada produz um erro se as fechaduras não puderem ser adquiridas imediatamente.
- A interface de bloqueio detecta o impasse entre chamadas de aquisição de bloqueio em diferentes sessões. Neste caso, o serviço de bloqueio escolhe um chamador e termina sua solicitação de aquisição de bloqueio com um erro `ER_LOCKING_SERVICE_DEADLOCK`. Este erro não faz com que as transações sejam revertidas. Para escolher uma sessão em caso de impasse, o serviço de bloqueio prefere sessões que possuem bloqueios de leitura em vez de sessões que possuem bloqueios de escrita.
- Uma sessão pode adquirir vários bloqueios com uma única chamada de aquisição de bloqueio. Para uma determinada chamada, a aquisição de bloqueio é atômica: a chamada é bem-sucedida se todos os bloqueios forem adquiridos. Se a aquisição de qualquer bloqueio falhar, a chamada não adquire bloqueios e falha, normalmente com um erro de `ER_LOCKING_SERVICE_TIMEOUT` ou `ER_LOCKING_SERVICE_DEADLOCK`.
- Uma sessão pode adquirir vários bloqueios para o mesmo identificador de bloqueio (espaço de nomes e combinação de nome de bloqueio).
- Os bloqueios adquiridos dentro de uma sessão são liberados explicitamente chamando uma função de bloqueio de liberação, ou implicitamente quando a sessão termina (normal ou anormalmente).
- Dentro de uma sessão, todos os bloqueios para um determinado namespace quando liberados são liberados juntos.

A interface fornecida pelo serviço de bloqueio é distinta da fornecida pelo `GET_LOCK()` e funções SQL relacionadas (ver Seção 14.14, Funções de bloqueio). Por exemplo, o `GET_LOCK()` não implementa espaços de nomes e fornece apenas bloqueios exclusivos, não bloqueios de leitura e gravação distintos.

##### Interface C do serviço de bloqueio

Esta seção descreve como usar a interface de linguagem C do serviço de bloqueio. Para usar a interface de função em vez disso, veja a Seção 7.6.9.1.2, A Interface de Função do Serviço de Bloqueio Para características gerais da interface do serviço de bloqueio, veja a Seção 7.6.9.1, O Serviço de Bloqueio. Para informações gerais sobre serviços de plug-in, veja a Seção 7.6.9, Serviços de Plug-in do MySQL.

Os arquivos de origem que usam o serviço de bloqueio devem incluir este arquivo de cabeçalho:

```
#include <mysql/service_locking.h>
```

Para adquirir uma ou mais fechaduras, chame esta função:

```
int mysql_acquire_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace,
                                        const char**lock_names,
                                        size_t lock_num,
                                        enum enum_locking_service_lock_type lock_type,
                                        unsigned long lock_timeout);
```

Os argumentos têm os seguintes significados:

- `opaque_thd`: Uma alça de thread. Se especificado como `NULL`, a alça para o thread atual é usada.
- `lock_namespace`: Uma string com terminação nula que indica o namespace de bloqueio.
- `lock_names`: Uma matriz de strings com terminação nula que fornece os nomes das fechaduras a serem adquiridas.
- `lock_num`: O número de nomes na matriz `lock_names`.
- `lock_type`: O modo de bloqueio, seja `LOCKING_SERVICE_READ` ou `LOCKING_SERVICE_WRITE` para adquirir bloqueios de leitura ou de gravação, respectivamente.
- `lock_timeout`: Um número inteiro de segundos para esperar para adquirir as fechaduras antes de desistir.

Para liberar bloqueios adquiridos para um determinado espaço de nomes, chame esta função:

```
int mysql_release_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace);
```

Os argumentos têm os seguintes significados:

- `opaque_thd`: Uma alça de thread. Se especificado como `NULL`, a alça para o thread atual é usada.
- `lock_namespace`: Uma string com terminação nula que indica o namespace de bloqueio.

Os bloqueios adquiridos ou aguardados pelo serviço de bloqueio podem ser monitorados no nível SQL usando o Esquema de Desempenho.

##### Interface da função de serviço de bloqueio

Esta seção descreve como usar a interface de serviço de bloqueio fornecida por suas funções carregáveis. Para usar a interface de linguagem C, veja a Seção 7.6.9.1.1, "A Interface de Serviço de Bloqueio C" Para características gerais da interface de serviço de bloqueio, veja a Seção 7.6.9.1, "O Serviço de Bloqueio". Para informações gerais sobre funções carregáveis, veja Adicionar uma Função Carregável.

- Instalação ou Desinstalação da Interface de Função de Serviço de Bloqueio
- Utilizando a Interface de Função de Serviço de Bloqueio
- Monitorização do serviço de bloqueio
- Função de referência da interface de serviço de bloqueio

###### Instalação ou Desinstalação da Interface de Função de Serviço de Bloqueio

As rotinas de serviço de bloqueio descritas na Seção 7.6.9.1.1, A Interface de Serviço de Bloqueio C não precisam ser instaladas porque estão integradas no servidor. O mesmo não é verdade para as funções carregáveis que mapeiam as chamadas para as rotinas de serviço: As funções devem ser instaladas antes do uso. Esta seção descreve como fazer isso. Para informações gerais sobre a instalação de funções carregáveis, consulte a Seção 7.7.1, Instalar e Desinstalar Funções Carregáveis.

As funções de serviço de bloqueio são implementadas em um arquivo de biblioteca de plugins localizado no diretório chamado pela variável de sistema `plugin_dir`. O nome de base do arquivo é `locking_service`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar as funções de serviço de bloqueio, use a instrução `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
CREATE FUNCTION service_get_read_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_get_write_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_release_locks RETURNS INT
  SONAME 'locking_service.so';
```

Se as funções forem usadas em um servidor de origem de réplica, instale-as em todos os servidores de réplica também para evitar problemas de réplica.

Uma vez instaladas, as funções permanecem instaladas até serem desinstaladas. Para removê-las, use a instrução `DROP FUNCTION`:

```
DROP FUNCTION service_get_read_locks;
DROP FUNCTION service_get_write_locks;
DROP FUNCTION service_release_locks;
```

###### Utilizando a Interface de Função de Serviço de Bloqueio

Antes de utilizar as funções de serviço de bloqueio, instale-as de acordo com as instruções fornecidas na secção Instalar ou desinstalar a interface de função de serviço de bloqueio.

Para adquirir um ou mais bloqueios de leitura, chame esta função:

```
mysql> SELECT service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10);
+---------------------------------------------------------------+
| service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10) |
+---------------------------------------------------------------+
|                                                             1 |
+---------------------------------------------------------------+
```

O primeiro argumento é o espaço de nomes do bloqueio. O argumento final é um tempo de espera inteiro indicando quantos segundos esperar para adquirir os bloqueios antes de desistir. Os argumentos intermediários são os nomes do bloqueio.

Para o exemplo exibido, a função adquire bloqueios com identificadores de bloqueio `(mynamespace, rlock1)` e `(mynamespace, rlock2)`.

Para adquirir bloqueios de gravação em vez de bloqueios de leitura, chame esta função:

```
mysql> SELECT service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10);
+----------------------------------------------------------------+
| service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10) |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Neste caso, os identificadores de bloqueio são `(mynamespace, wlock1)` e `(mynamespace, wlock2)`.

Para liberar todos os bloqueios para um espaço de nomes, use esta função:

```
mysql> SELECT service_release_locks('mynamespace');
+--------------------------------------+
| service_release_locks('mynamespace') |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Cada função de bloqueio retorna um valor diferente de zero para sucesso. Se a função falhar, ocorre um erro. Por exemplo, o seguinte erro ocorre porque os nomes de bloqueio não podem ser vazios:

```
mysql> SELECT service_get_read_locks('mynamespace', '', 10);
ERROR 3131 (42000): Incorrect locking service lock name ''.
```

Uma sessão pode adquirir vários bloqueios para o mesmo identificador de bloqueio. Desde que uma sessão diferente não tenha um bloqueio de gravação para um identificador, a sessão pode adquirir qualquer número de bloqueios de leitura ou gravação. Cada solicitação de bloqueio para o identificador adquire um novo bloqueio. As seguintes instruções adquirem três bloqueios de gravação com o mesmo identificador, em seguida, três bloqueios de leitura para o mesmo identificador:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock1', 'lock1', 0);
SELECT service_get_read_locks('ns', 'lock1', 'lock1', 'lock1', 0);
```

Se você examinar a tabela do Esquema de Desempenho `metadata_locks` neste ponto, você deve achar que a sessão possui seis bloqueios distintos com o mesmo identificador `(ns, lock1)` (Para detalhes, veja Locking Service Monitoring).

Como a sessão possui pelo menos um bloqueio de gravação em `(ns, lock1)`, nenhuma outra sessão pode adquirir um bloqueio para ela, seja leitura ou gravação. Se a sessão tiver apenas bloqueios de leitura para o identificador, outras sessões poderiam adquirir bloqueios de leitura para ela, mas não bloqueios de gravação.

Bloqueios para uma única chamada de aquisição de bloqueio são adquiridos atomicamente, mas a atomicidade não se mantém em todas as chamadas. Assim, para uma instrução como a seguinte, onde `service_get_write_locks()` é chamada uma vez por linha do conjunto de resultados, a atomicidade se mantém para cada chamada individual, mas não para a instrução como um todo:

```
SELECT service_get_write_locks('ns', 'lock1', 'lock2', 0) FROM t1 WHERE ... ;
```

Precaução

Como o serviço de bloqueio retorna um bloqueio separado para cada solicitação bem-sucedida para um determinado identificador de bloqueio, é possível que uma única instrução adquira um grande número de bloqueios.

```
INSERT INTO ... SELECT service_get_write_locks('ns', t1.col_name, 0) FROM t1;
```

Esses tipos de instruções podem ter certos efeitos adversos. Por exemplo, se a instrução falhar em parte e rolar de volta, bloqueios adquiridos até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre linhas inseridas e bloqueios adquiridos, essa intenção não é satisfeita. Além disso, se é importante que os bloqueios sejam concedidos em uma certa ordem, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo de qual plano de execução o otimizador escolher. Por essas razões, pode ser melhor limitar os aplicativos a uma única chamada de aquisição de bloqueio por instrução.

###### Monitorização do serviço de bloqueio

O serviço de bloqueio é implementado usando a estrutura de bloqueio de metadados do MySQL Server, para que você monitore os bloqueios de serviço de bloqueio adquiridos ou esperados examinando a tabela de Esquema de Desempenho `metadata_locks`.

Primeiro, ative o instrumento de bloqueio de metadados:

```
mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
    -> WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

Em seguida, adquirir alguns bloqueios e verificar o conteúdo da tabela `metadata_locks`:

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

As fechaduras de serviço de bloqueio têm um valor de `OBJECT_TYPE` de `LOCKING SERVICE`. Isto é distinto, por exemplo, das fechaduras adquiridas com a função `GET_LOCK()`, que têm um `OBJECT_TYPE` de `USER LEVEL LOCK`.

O espaço de nomes do bloqueio, nome e modo aparecem nas colunas `OBJECT_SCHEMA`, `OBJECT_NAME`, e `LOCK_TYPE`.

O valor `LOCK_STATUS` é `GRANTED` para um bloqueio adquirido, `PENDING` para um bloqueio que está sendo aguardado. Você pode esperar ver `PENDING` se uma sessão tiver um bloqueio de gravação e outra sessão estiver tentando adquirir um bloqueio com o mesmo identificador.

###### Função de referência da interface de serviço de bloqueio

A interface SQL para o serviço de bloqueio implementa as funções de carregamento descritas nesta seção.

As funções partilham as seguintes características:

- O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.
- Os nomes de espaço de nomes e de bloqueio não devem ser `NULL`, não devem ser vazios e devem ter um comprimento máximo de 64 caracteres.
- Os valores de tempo de espera devem ser inteiros indicando quantos segundos esperar para adquirir bloqueios antes de desistir com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os bloqueios não puderem ser adquiridos imediatamente.

Estas funções de serviço de bloqueio estão disponíveis:

- `service_get_read_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais bloqueios de leitura (compartilhados) no espaço de nomes fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo limite fornecido.
- `service_get_write_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais bloqueios de gravação (exclusivos) no espaço de nomes dado usando os nomes de bloqueio dados, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo limite dado.
- `service_release_locks(namespace)`

Para o espaço de nomes dado, libera todos os bloqueios que foram adquiridos dentro da sessão atual usando `service_get_read_locks()` e `service_get_write_locks()`.

Não é um erro que não haja bloqueios no namespace.
