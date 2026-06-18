#### 5.5.6.1 O Serviço de Bloqueio

As distribuições do MySQL fornecem uma interface de bloqueio acessível em dois níveis:

- No nível SQL, como um conjunto de funções carregáveis que correspondem a chamadas às rotinas de serviço.

- Como uma interface em linguagem C, acessível como um serviço de plugin a partir de plugins do servidor ou funções carregáveis.

Para informações gerais sobre os serviços de plugins, consulte Seção 5.5.6, “Serviços de Plugins MySQL”. Para informações gerais sobre funções carregáveis, consulte Adicionar uma Função Carregável.

A interface de bloqueio tem essas características:

- As chaves têm três atributos: namespace da chave, nome da chave e modo da chave:

  - As chaves são identificadas pela combinação do namespace e do nome da chave. O namespace permite que diferentes aplicativos usem os mesmos nomes de chave sem colidirem ao criar chaves em namespaces separados. Por exemplo, se os aplicativos A e B usarem namespaces de `ns1` e `ns2`, respectivamente, cada aplicativo pode usar os nomes de chave `lock1` e `lock2` sem interferir no outro aplicativo.

  - Um modo de bloqueio é de leitura ou de escrita. Os bloqueios de leitura são compartilhados: se uma sessão tiver um bloqueio de leitura em um identificador de bloqueio específico, outras sessões podem adquirir um bloqueio de leitura no mesmo identificador. Os bloqueios de escrita são exclusivos: se uma sessão tiver um bloqueio de escrita em um identificador de bloqueio específico, outras sessões não podem adquirir um bloqueio de leitura ou de escrita no mesmo identificador.

- Os nomes de namespace e bloqueio devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres. Um namespace ou nome de bloqueio especificado como `NULL`, a string vazia ou uma string com mais de 64 caracteres resulta em um erro `ER_LOCKING_SERVICE_WRONG_NAME`.

- A interface de bloqueio trata o nome do namespace e o nome do bloqueio como strings binárias, portanto, as comparações são sensíveis a maiúsculas e minúsculas.

- A interface de bloqueio oferece funções para adquirir e liberar bloqueios. Não é necessário privilégio especial para chamar essas funções. A verificação de privilégio é responsabilidade do aplicativo que faz a chamada.

- É possível aguardar por bloqueios se eles não estiverem imediatamente disponíveis. As chamadas de aquisição de bloqueios aceitam um valor de timeout inteiro que indica quantos segundos devem ser esperados para adquirir os bloqueios antes de desistir. Se o timeout for alcançado sem a aquisição bem-sucedida do bloqueio, ocorre um erro `ER_LOCKING_SERVICE_TIMEOUT`. Se o timeout for 0, não há espera e a chamada produz um erro se os bloqueios não puderem ser adquiridos imediatamente.

- A interface de bloqueio detecta um impasse entre chamadas de aquisição de bloqueio em diferentes sessões. Nesse caso, o serviço de bloqueio escolhe um chamador e termina sua solicitação de aquisição de bloqueio com um erro `ER_LOCKING_SERVICE_DEADLOCK`. Esse erro não faz com que as transações sejam revertidas. Para escolher uma sessão em caso de impasse, o serviço de bloqueio prefere sessões que possuem blocos de leitura em vez de sessões que possuem blocos de escrita.

- Uma sessão pode adquirir múltiplas bloqueadoras com uma única chamada de aquisição de bloqueador. Para uma chamada específica, a aquisição de bloqueador é atômica: a chamada é bem-sucedida se todos os bloqueadoras forem adquiridos. Se a aquisição de qualquer bloqueador falhar, a chamada não adquire bloqueadoras e falha, tipicamente com um erro `ER_LOCKING_SERVICE_TIMEOUT` ou `ER_LOCKING_SERVICE_DEADLOCK`.

- Uma sessão pode adquirir múltiplas bloqueadoras para o mesmo identificador de bloqueador (combinação de namespace e nome do bloqueador). Essas instâncias de bloqueador podem ser bloqueadoras de leitura, bloqueadoras de escrita ou uma mistura de ambas.

- As bloqueadoras adquiridas durante uma sessão são liberadas explicitamente ao chamar uma função de liberação de bloqueadoras, ou implicitamente quando a sessão termina (normalmente ou anormalmente). As bloqueadoras não são liberadas quando as transações são confirmadas ou revertidas.

- Durante uma sessão, todas as chaves para um namespace específico são liberadas juntas.

A interface fornecida pelo serviço de bloqueio é distinta daquela fornecida por `GET_LOCK()` e pelas funções SQL relacionadas (veja Seção 12.14, “Funções de Bloqueio”). Por exemplo, `GET_LOCK()` não implementa namespaces e fornece apenas bloqueios exclusivos, não bloqueios de leitura e escrita distintos.

##### 5.5.6.1.1 Interface do Serviço de Fechamento C

Esta seção descreve como usar a interface do serviço de bloqueio em linguagem C. Para usar a interface da função do serviço de bloqueio, consulte Seção 5.5.6.1.2, “A Interface da Função do Serviço de Bloqueio”. Para obter informações gerais sobre a interface do serviço de bloqueio, consulte Seção 5.5.6.1, “O Serviço de Bloqueio”. Para informações gerais sobre os serviços de plugins, consulte Seção 5.5.6, “Serviços de Plugins MySQL”.

Os arquivos de origem que utilizam o serviço de bloqueio devem incluir este arquivo de cabeçalho:

```sql
#include <mysql/service_locking.h>
```

Para adquirir um ou mais bloqueios, chame esta função:

```sql
int mysql_acquire_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace,
                                        const char**lock_names,
                                        size_t lock_num,
                                        enum enum_locking_service_lock_type lock_type,
                                        unsigned long lock_timeout);
```

Os argumentos têm esses significados:

- `opaque_thd`: Um handle de thread. Se especificado como `NULL`, o handle do thread atual é usado.

- `lock_namespace`: Uma string terminada por nulo que indica o namespace de bloqueio.

- `lock_names`: Um array de strings terminadas por null que fornece os nomes das chaves a serem adquiridas.

- `lock_num`: O número de nomes no array `lock_names`.

- `lock_type`: O modo de bloqueio, que pode ser `LOCKING_SERVICE_READ` ou `LOCKING_SERVICE_WRITE`, para adquirir bloqueios de leitura ou bloqueios de escrita, respectivamente.

- `lock_timeout`: Um número inteiro de segundos para esperar para adquirir as bloqueadas antes de desistir.

Para liberar bloqueados adquiridos para um namespace específico, chame essa função:

```sql
int mysql_release_locking_service_locks(MYSQL_THD opaque_thd,
                                        const char* lock_namespace);
```

Os argumentos têm esses significados:

- `opaque_thd`: Um handle de thread. Se especificado como `NULL`, o handle do thread atual é usado.

- `lock_namespace`: Uma string terminada por nulo que indica o namespace de bloqueio.

As chaves adquiridas ou aguardadas pelo serviço de bloqueio podem ser monitoradas no nível SQL usando o Gerenciador de Desempenho. Para obter detalhes, consulte Monitoramento do Serviço de Bloqueio.

##### 5.5.6.1.2 Interface da Função de Serviço de Bloqueio

Esta seção descreve como usar a interface do serviço de bloqueio fornecida por suas funções carregáveis. Para usar a interface em C, consulte Seção 5.5.6.1.1, “A Interface C do Serviço de Bloqueio”. Para obter informações gerais sobre a interface do serviço de bloqueio, consulte Seção 5.5.6.1, “O Serviço de Bloqueio”. Para informações gerais sobre funções carregáveis, consulte Adicionar uma Função Carregável.

- Instalando ou Desinstalando a Interface da Função de Serviço de Fechamento
- Usando a Interface de Função do Serviço de Acionamento
- Monitoramento do Serviço de Bloqueio
- Referência da Função de Interface de Serviço de Acionamento

###### Instalando ou Desinstalando a Interface da Função de Serviço de Fechamento

Os procedimentos de serviço de bloqueio descritos na Seção 5.5.6.1.1, “A Interface C do Serviço de Bloqueio” não precisam ser instalados, pois estão embutidos no servidor. O mesmo não é verdade para as funções carregáveis que mapeiam chamadas para as rotinas de serviço: as funções devem ser instaladas antes de serem usadas. Esta seção descreve como fazer isso. Para informações gerais sobre a instalação de funções carregáveis, consulte Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

As funções do serviço de bloqueio são implementadas em um arquivo de biblioteca de plugins localizado no diretório nomeado pela variável de sistema `plugin_dir`. O nome do arquivo base é `locking_service`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para instalar as funções do serviço de bloqueio, use a instrução `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
CREATE FUNCTION service_get_read_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_get_write_locks RETURNS INT
  SONAME 'locking_service.so';
CREATE FUNCTION service_release_locks RETURNS INT
  SONAME 'locking_service.so';
```

Se as funções forem usadas em um servidor de origem de replicação, instale-as em todos os servidores replicados para evitar problemas de replicação.

Uma vez instaladas, as funções permanecem instaladas até serem desinstaladas. Para removê-las, use a instrução `DROP FUNCTION`:

```sql
DROP FUNCTION service_get_read_locks;
DROP FUNCTION service_get_write_locks;
DROP FUNCTION service_release_locks;
```

###### Usando a Interface de Função de Serviço de Bloqueio

Antes de usar as funções do serviço de bloqueio, instale-as de acordo com as instruções fornecidas em Instalando ou Desinstalando a Interface do Serviço de Bloqueio.

Para adquirir um ou mais bloqueios de leitura, chame esta função:

```sql
mysql> SELECT service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10);
+---------------------------------------------------------------+
| service_get_read_locks('mynamespace', 'rlock1', 'rlock2', 10) |
+---------------------------------------------------------------+
|                                                             1 |
+---------------------------------------------------------------+
```

O primeiro argumento é o namespace do bloqueio. O último argumento é um tempo de espera inteiro que indica quantos segundos esperar para adquirir os bloqueios antes de desistir. Os argumentos entre eles são os nomes dos bloqueios.

Para o exemplo mostrado, a função obtém locks com identificadores de bloqueio `(mynamespace, rlock1)` e `(mynamespace, rlock2)`.

Para adquirir bloqueios de escrita em vez de bloqueios de leitura, chame essa função:

```sql
mysql> SELECT service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10);
+----------------------------------------------------------------+
| service_get_write_locks('mynamespace', 'wlock1', 'wlock2', 10) |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Neste caso, os identificadores de bloqueio são `(mynamespace, wlock1)` e `(mynamespace, wlock2)`.

Para liberar todos os bloqueios de um namespace, use esta função:

```sql
mysql> SELECT service_release_locks('mynamespace');
+--------------------------------------+
| service_release_locks('mynamespace') |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Cada função de bloqueio retorna um valor diferente de zero para sucesso. Se a função falhar, ocorre um erro. Por exemplo, o seguinte erro ocorre porque os nomes de bloqueio não podem ser vazios:

```sql
mysql> SELECT service_get_read_locks('mynamespace', '', 10);
ERROR 3131 (42000): Incorrect locking service lock name ''.
```

Uma sessão pode adquirir múltiplas bloqueadoras para o mesmo identificador de bloqueador. Desde que uma sessão diferente não tenha uma bloqueadora de escrita para um identificador, a sessão pode adquirir qualquer número de bloqueadoras de leitura ou escrita. Cada solicitação de bloqueador para o identificador adquire um novo bloqueador. As seguintes declarações adquirem três bloqueadoras de escrita com o mesmo identificador, depois três bloqueadoras de leitura para o mesmo identificador:

```sql
SELECT service_get_write_locks('ns', 'lock1', 'lock1', 'lock1', 0);
SELECT service_get_read_locks('ns', 'lock1', 'lock1', 'lock1', 0);
```

Se você examinar a tabela `metadata_locks` do Schema de Desempenho neste momento, você verá que a sessão possui seis bloqueios distintos com o mesmo identificador `(ns, lock1)` (Para detalhes, consulte Monitoramento do Serviço de Bloqueio.)

Como a sessão possui pelo menos um bloqueio de escrita em `(ns, lock1)`, nenhuma outra sessão pode adquirir um bloqueio para ela, seja de leitura ou escrita. Se a sessão tivesse apenas bloqueios de leitura para o identificador, outras sessões poderiam adquirir bloqueios de leitura para ele, mas não bloqueios de escrita.

As chaves para uma única chamada de aquisição de locks são adquiridas de forma atômica, mas a atómica não se mantém em chamadas subsequentes. Assim, para uma declaração como a seguinte, onde `service_get_write_locks()` é chamada uma vez por linha do conjunto de resultados, a atómica se mantém para cada chamada individual, mas não para a declaração como um todo:

```sql
SELECT service_get_write_locks('ns', 'lock1', 'lock2', 0) FROM t1 WHERE ... ;
```

Cuidado

Como o serviço de bloqueio retorna um bloqueio separado para cada solicitação bem-sucedida para um identificador de bloqueio específico, é possível que uma única instrução adquira um grande número de bloqueios. Por exemplo:

```sql
INSERT INTO ... SELECT service_get_write_locks('ns', t1.col_name, 0) FROM t1;
```

Esses tipos de declarações podem ter certos efeitos adversos. Por exemplo, se a declaração falhar em algum momento e for revertida, as chaves adquiridas até o ponto de falha ainda existem. Se a intenção é que haja uma correspondência entre as linhas inseridas e as chaves adquiridas, essa intenção não é satisfeita. Além disso, se é importante que as chaves sejam concedidas em uma ordem específica, esteja ciente de que a ordem do conjunto de resultados pode diferir dependendo do plano de execução escolhido pelo otimizador. Por essas razões, pode ser melhor limitar as aplicações a uma única chamada de aquisição de chave por declaração.

###### Monitoramento do Serviço de Bloqueio

O serviço de bloqueio é implementado usando o framework de bloqueios de metadados do MySQL Server, então você monitora os bloqueios do serviço de bloqueio adquiridos ou esperados examinando a tabela `metadata_locks` do Schema de Desempenho.

Primeiro, habilite o instrumento de bloqueio de metadados:

```sql
mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
    -> WHERE NAME = 'wait/lock/metadata/sql/mdl';
```

Em seguida, obtenha algumas chaves de acesso e verifique o conteúdo da tabela `metadata_locks`:

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

As chaves de serviço de bloqueio têm um valor `OBJECT_TYPE` de `SERVIÇO DE BLOQUEIO`. Isso é distinto, por exemplo, das chaves adquiridas com a função `GET_LOCK()`, que têm um `OBJECT_TYPE` de `BLOQUEIO DE NÍVEL DE USUÁRIO`.

O namespace, nome e modo do bloqueio aparecem nas colunas `OBJECT_SCHEMA`, `OBJECT_NAME` e `LOCK_TYPE`. Os bloqueios de leitura e escrita têm os valores `LOCK_TYPE` de `SHARED` e `EXCLUSIVE`, respectivamente.

O valor `LOCK_STATUS` é `GRANTED` para um bloqueio adquirido, `PENDING` para um bloqueio que está sendo aguardado. Você verá `PENDING` se uma sessão estiver segurando um bloqueio de escrita e outra sessão estiver tentando adquirir um bloqueio com o mesmo identificador.

###### Referência da Função de Interface de Serviço de Bloqueio

A interface SQL do serviço de bloqueio implementa as funções carregáveis descritas nesta seção. Para exemplos de uso, consulte Usando a Interface de Função do Serviço de Bloqueio.

As funções compartilham essas características:

- O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.

- Os nomes de namespace e de bloqueio devem ser não `NULL`, não vazios e ter um comprimento máximo de 64 caracteres.

- Os valores de tempo de espera devem ser inteiros, indicando quantos segundos esperar para adquirir blocos antes de desistir com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os blocos não puderem ser adquiridos imediatamente.

Estes serviços de bloqueio estão disponíveis:

- `service_get_read_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais bloqueios de leitura (compartilhados) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de espera fornecido.

- `service_get_write_locks(namespace, lock_name[, lock_name] ..., timeout)`

  Adquire um ou mais bloqueios de escrita (exclusivos) no namespace fornecido usando os nomes de bloqueio fornecidos, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de espera fornecido.

- `service_release_locks(namespace)`

  Para o namespace fornecido, libera todos os bloqueios adquiridos durante a sessão atual usando `service_get_read_locks()` e `service_get_write_locks()`.

  Não há erro em não haver bloqueios no namespace.
