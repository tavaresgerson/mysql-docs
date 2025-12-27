### 6.2.8 Controle de Compressão de Conexão

As conexões ao servidor podem usar compressão no tráfego entre o cliente e o servidor para reduzir o número de bytes enviados pela conexão. Por padrão, as conexões não são comprimidas, mas podem ser comprimidas se o servidor e o cliente concordarem em um algoritmo de compressão mutuamente permitido.

As conexões comprimidas são originadas do lado do cliente, mas afetam a carga da CPU tanto no lado do cliente quanto no do servidor, pois ambos os lados realizam operações de compressão e descompactação. Como a ativação da compressão diminui o desempenho, seus benefícios ocorrem principalmente quando há baixa largura de banda da rede, o tempo de transferência de rede domina o custo das operações de compressão e descompactação, e os conjuntos de resultados são grandes.

Esta seção descreve os parâmetros de configuração disponíveis para o controle de compressão e as fontes de informações disponíveis para monitoramento do uso da compressão. Ela se aplica a conexões de protocolo MySQL clássicas.

O controle de compressão se aplica a conexões ao servidor por programas cliente e por servidores que participam da replicação de origem/replica ou da Replicação em Grupo. O controle de compressão não se aplica a conexões para tabelas `FEDERATED`. Na discussão a seguir, “conexão do cliente” é uma abreviação para uma conexão ao servidor originada de qualquer fonte para a qual a compressão é suportada, a menos que o contexto indique um tipo específico de conexão.

::: info Nota

As conexões de protocolo X a uma instância do Servidor MySQL suportam compressão, mas a compressão para conexões de protocolo X opera de forma independente da compressão para conexões de protocolo MySQL clássico descritas aqui e é controlada separadamente. Consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X” para informações sobre a compressão de conexões de protocolo X.

:::

*  Configurando a Compressão de Conexão
*  Configurando a Compressão de Conexão Legado
*  Monitorando a Compressão de Conexão

Esses parâmetros de configuração estão disponíveis para controlar a compressão da conexão:

* A variável de sistema `protocol_compression_algorithms` configura quais algoritmos de compressão o servidor permite para conexões de entrada.
* As opções de linha de comando `--compression-algorithms` e `--zstd-compression-level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para esses programas cliente: `mysql`, `mysqladmin`, `mysqlbinlog`, `mysqlcheck`, `mysqldump`, `mysqlimport`, `mysqlshow`, `mysqlslap` e `mysqltest`. O MySQL Shell também oferece essas opções de linha de comando.
* As opções `MYSQL_OPT_COMPRESSION_ALGORITHMS` e `MYSQL_OPT_ZSTD_COMPRESSION_LEVEL` para a função `mysql_options()` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para programas cliente que usam a API C do MySQL.
* As opções `SOURCE_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL` para a declaração `CHANGE REPLICATION SOURCE TO` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para servidores de replica que participam da replicação de origem/replica.
* As variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para conexões de recuperação da Replicação em Grupo quando um novo membro se junta a um grupo e se conecta a um doador.

Os parâmetros de configuração que permitem especificar algoritmos de compressão são de valor de string e aceitam uma lista de um ou mais nomes de algoritmos de compressão separados por vírgula, em qualquer ordem, escolhidos dos seguintes itens (não case-sensitive):

* `zlib`: Permitir conexões que usam o algoritmo de compressão `zlib`.
* `zstd`: Permitir conexões que usam o algoritmo de compressão `zstd`.
* `uncompressed`: Permitir conexões não comprimidas.

Como "não compactado" é um nome de algoritmo que pode ou não ser configurado, é possível configurar o MySQL para **não** permitir conexões não compactadas.

Exemplos:

* Para configurar quais algoritmos de compactação o servidor permite para conexões de entrada, defina a variável de sistema `protocol_compression_algorithms`. Por padrão, o servidor permite todos os algoritmos disponíveis. Para configurar essa configuração explicitamente no início, use essas linhas no arquivo `my.cnf` do servidor:

  ```
  [mysqld]
  protocol_compression_algorithms=zlib,zstd,uncompressed
  ```

  Para definir e persistir a variável de sistema `protocol_compression_algorithms` nesse valor em tempo de execução, use essa declaração:

  ```
  SET PERSIST protocol_compression_algorithms='zlib,zstd,uncompressed';
  ```

  `SET PERSIST` define um valor para a instância do MySQL em execução. Também salva o valor, fazendo com que ele seja transferido para reinicializações subsequentes do servidor. Para alterar o valor para a instância do MySQL em execução sem que ele seja transferido para reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe de SET para atribuição de variáveis”.

* Para permitir apenas conexões de entrada que usam compactação `zstd`, configure o servidor no início da seguinte forma:

  ```
  [mysqld]
  protocol_compression_algorithms=zstd
  ```

  Ou, para fazer a mudança em tempo de execução:

  ```
  SET PERSIST protocol_compression_algorithms='zstd';
  ```
* Para permitir que o cliente `mysql` inicie conexões `zlib` ou `não compactado`, invólucvelo-o da seguinte forma:

  ```
  mysql --compression-algorithms=zlib,uncompressed
  ```
* Para configurar réplicas para se conectarem à fonte usando conexões `zlib` ou `zstd`, com um nível de compactação de 7 para conexões `zstd`, use uma declaração `CHANGE REPLICATION SOURCE TO`:

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_COMPRESSION_ALGORITHMS = 'zlib,zstd',
    SOURCE_ZSTD_COMPRESSION_LEVEL = 7;
  ```

  Isso assume que a variável de sistema `replica_compressed_protocol` está desabilitada, por razões descritas em Configurando Compressão de Conexão Legado.

Para a configuração bem-sucedida da conexão, ambos os lados da conexão devem concordar em um algoritmo de compactação mutuamente permitido. O processo de negociação de algoritmos tenta usar `zlib`, depois `zstd`, depois `não compactado`. Se os dois lados não conseguirem encontrar um algoritmo comum, a tentativa de conexão falha.

Como ambos os lados devem concordar com o algoritmo de compressão, e porque `uncompressed` é um valor de algoritmo que não é necessariamente permitido, o fallback para uma conexão não comprimida não ocorre necessariamente. Por exemplo, se o servidor estiver configurado para permitir `zstd` e um cliente estiver configurado para permitir `zlib,uncompressed`, o cliente não poderá se conectar. Neste caso, nenhum algoritmo é comum a ambos os lados, então as tentativas de conexão falham.

Os parâmetros de configuração que permitem especificar o nível de compressão `zstd` aceitam um valor inteiro de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não tem efeito em conexões que não usam compressão `zstd`.

Um nível de compressão `zstd` configurável permite escolher entre menos tráfego de rede e maior carga de CPU versus mais tráfego de rede e menor carga de CPU. Níveis de compressão mais altos reduzem a congestão de rede, mas a carga adicional de CPU pode reduzir o desempenho do servidor.

#### Configurando Compressão de Conexão Legado

Antes do MySQL 8.0.18, esses parâmetros de configuração estão disponíveis para controlar a compressão da conexão:

* Os programas cliente suportam a opção de linha de comando `--compress` para especificar o uso de compressão para a conexão com o servidor.
* Para programas que usam a API C do MySQL, habilitar a opção `MYSQL_OPT_COMPRESS` na função `mysql_options()` especifica o uso de compressão para a conexão com o servidor.
* Para replicação de origem/replica, habilitar a variável de sistema `replica_compressed_protocol` especifica o uso de compressão para conexões de replica para a origem.

Em cada caso, quando o uso de compressão é especificado, a conexão usa o algoritmo de compressão `zlib` se ambos os lados o permitirem, com fallback para uma conexão não comprimida caso contrário.

A partir do MySQL 8.0.18, os parâmetros de compressão descritos acima se tornam parâmetros legados, devido aos parâmetros de compressão adicionais introduzidos para maior controle sobre a compressão de conexões, que são descritos em Configurando a Compressão de Conexão. Uma exceção é o MySQL Shell, onde a opção de linha de comando `--compress` permanece atual e pode ser usada para solicitar compressão sem selecionar algoritmos de compressão. Para informações sobre o controle de compressão de conexão do MySQL Shell, consulte Usando Conexões Compridas.

Os parâmetros de compressão legados interagem com os parâmetros mais recentes e sua semântica muda da seguinte forma:

* O significado da opção legada `--compress` depende se `--compression-algorithms` é especificado:

  + Quando `--compression-algorithms` não é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos do lado do cliente `zlib,uncompressed`.
  + Quando `--compression-algorithms` é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos de `zlib` e o conjunto completo de algoritmos do lado do cliente é a união de `zlib` mais os algoritmos especificados por `--compression-algorithms`. Por exemplo, com tanto `--compress` quanto `--compression-algorithms=zlib,zstd`, o conjunto de algoritmos permitido é `zlib` mais `zlib,zstd`; ou seja, `zlib,zstd`. Com tanto `--compress` quanto `--compression-algorithms=zstd,uncompressed`, o conjunto de algoritmos permitido é `zlib` mais `zstd,uncompressed`; ou seja, `zlib,zstd,uncompressed`.
* O mesmo tipo de interação ocorre entre a opção legada `MYSQL_OPT_COMPRESS` e a opção `MYSQL_OPT_COMPRESSION_ALGORITHMS` para a função `mysql_options()` da API C.
* Se a variável de sistema `replica_compressed_protocol` estiver habilitada, ela tem precedência sobre `SOURCE_COMPRESSION_ALGORITHMS` e as conexões à fonte usam compressão `zlib` se tanto a fonte quanto a replica permitirem esse algoritmo. Se `replica_compressed_protocol` estiver desabilitada, o valor de `SOURCE_COMPRESSION_ALGORITHMS` se aplica.

#### Monitoramento da Compressão de Conexão

A variável de status `Compression` é `ON` ou `OFF` para indicar se a conexão atual usa compressão.

O comando `\status` do cliente `mysql` exibe uma linha que diz `Protocol: Compressed` se a compressão estiver habilitada para a conexão atual. Se essa linha não estiver presente, a conexão não está comprimida.

O comando `\status` do MySQL Shell exibe uma linha `Compression:` que diz `Disabled` ou `Enabled` para indicar se a conexão está comprimida.

Essas fontes adicionais de informações estão disponíveis para monitorar a compressão da conexão:

* Para monitorar a compressão em uso para conexões de clientes, use as variáveis de status `Compression_algorithm` e `Compression_level`. Para a conexão atual, seus valores indicam o algoritmo de compressão e o nível de compressão, respectivamente.
* Para determinar quais algoritmos de compressão o servidor está configurado para permitir para conexões de entrada, verifique a variável de sistema `protocol_compression_algorithms`.
* Para conexões de replicação de origem/replica, os algoritmos de compressão configurados e o nível de compressão estão disponíveis em várias fontes:

  + A tabela `replication_connection_configuration` do Schema de Desempenho tem as colunas `COMPRESSION_ALGORITHMS` e `ZSTD_COMPRESSION_LEVEL`.
  + A tabela de sistema `mysql.slave_master_info` tem as colunas `Master_compression_algorithms` e `Master_zstd_compression_level`. Se o arquivo `master.info` existir, ele contém linhas para esses valores também.