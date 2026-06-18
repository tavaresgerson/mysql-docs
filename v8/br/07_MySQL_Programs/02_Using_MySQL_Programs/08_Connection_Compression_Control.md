### 6.2.8 Controle de compressão da conexão

As conexões com o servidor podem usar compressão no tráfego entre o cliente e o servidor para reduzir o número de bytes enviados pela conexão. Por padrão, as conexões não são comprimidas, mas podem ser comprimidas se o servidor e o cliente concordarem em um algoritmo de compressão mutuamente permitido.

As conexões compactadas têm origem no lado do cliente, mas afetam a carga da CPU tanto no lado do cliente quanto no do servidor, pois ambos os lados realizam operações de compressão e descompactação. Como a ativação da compressão diminui o desempenho, seus benefícios ocorrem principalmente quando há baixa largura de banda da rede, o tempo de transferência de rede domina o custo das operações de compressão e descompactação, e os conjuntos de resultados são grandes.

Esta seção descreve os parâmetros de configuração de controle de compressão disponíveis e as fontes de informações disponíveis para monitoramento do uso da compressão. Ela se aplica a conexões clássicas do protocolo MySQL.

O controle de compressão se aplica às conexões ao servidor por programas de cliente e por servidores que participam da replicação de origem/replica ou da Replicação em Grupo. O controle de compressão não se aplica às conexões para tabelas `FEDERATED`. Na discussão a seguir, “conexão de cliente” é uma abreviação para uma conexão ao servidor que tem origem em qualquer fonte para a qual a compressão é suportada, a menos que o contexto indique um tipo específico de conexão.

Nota

As conexões do protocolo X a uma instância do servidor MySQL suportam compressão a partir do MySQL 8.0.19, mas a compressão para conexões do protocolo X opera de forma independente da compressão para conexões clássicas do protocolo MySQL descritas aqui e é controlada separadamente. Consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X”, para obter informações sobre a compressão de conexões do protocolo X.

- Configurando a Compressão de Conexão
- Configurando a Compressão de Conexão Legado
- Monitoramento da compressão da conexão

#### Configurando a Compressão de Conexão

A partir do MySQL 8.0.18, esses parâmetros de configuração estão disponíveis para controlar a compressão de conexão:

- A variável de sistema `protocol_compression_algorithms` configura quais algoritmos de compressão o servidor permite para conexões de entrada.

- As opções de linha de comando `--compression-algorithms` e `--zstd-compression-level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para esses programas cliente: **mysql**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap** e **mysqltest**, e **mysql\_upgrade**. O MySQL Shell também oferece essas opções de linha de comando a partir de sua versão 8.0.20.

- As opções `MYSQL_OPT_COMPRESSION_ALGORITHMS` e `MYSQL_OPT_ZSTD_COMPRESSION_LEVEL` para a função `mysql_options()` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para programas cliente que utilizam a API C do MySQL.

- As opções `MASTER_COMPRESSION_ALGORITHMS` e `MASTER_ZSTD_COMPRESSION_LEVEL` para a declaração `CHANGE MASTER TO` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para os servidores de replica que participam da replicação de origem/replica. A partir do MySQL 8.0.23, use a declaração `CHANGE REPLICATION SOURCE TO` e as opções `SOURCE_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL`.

- As variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para as conexões de recuperação da replicação por grupo quando um novo membro se junta a um grupo e se conecta a um doador.

Os parâmetros de configuração que permitem especificar algoritmos de compressão são de valor de string e aceitam uma lista de um ou mais nomes de algoritmos de compressão separados por vírgula, em qualquer ordem, escolhidos dos seguintes itens (não case-sensitive):

- `zlib`: Permita conexões que utilizem o algoritmo de compressão `zlib`.

- `zstd`: Permita conexões que utilizem o algoritmo de compressão `zstd`.

- `uncompressed`: Permita conexões não compactadas.

Nota

Como o `uncompressed` é um nome de algoritmo que pode ou não ser configurado, é possível configurar o MySQL para **não** permitir conexões não compactadas.

Exemplos:

- Para configurar quais algoritmos de compressão o servidor permite para conexões de entrada, defina a variável de sistema `protocol_compression_algorithms`. Por padrão, o servidor permite todos os algoritmos disponíveis. Para configurar essa configuração explicitamente no início, use essas linhas no arquivo do servidor `my.cnf`:

  ```
  [mysqld]
  protocol_compression_algorithms=zlib,zstd,uncompressed
  ```

  Para definir e manter a variável de sistema `protocol_compression_algorithms` com esse valor durante a execução, use a seguinte instrução:

  ```
  SET PERSIST protocol_compression_algorithms='zlib,zstd,uncompressed';
  ```

  `SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar o valor da instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

- Para permitir apenas conexões de entrada que utilizem a compressão `zstd`, configure o servidor no início da seguinte forma:

  ```
  [mysqld]
  protocol_compression_algorithms=zstd
  ```

  Ou, para fazer a mudança em tempo de execução:

  ```
  SET PERSIST protocol_compression_algorithms='zstd';
  ```

- Para permitir que o cliente **mysql** inicie conexões `zlib` ou `uncompressed`, invólucvelo-o da seguinte maneira:

  ```
  mysql --compression-algorithms=zlib,uncompressed
  ```

- Para configurar réplicas para se conectarem à fonte usando conexões `zlib` ou `zstd`, com um nível de compressão de 7 para conexões `zstd`, use uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23):

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_COMPRESSION_ALGORITHMS = 'zlib,zstd',
    SOURCE_ZSTD_COMPRESSION_LEVEL = 7;
  ```

  Isso pressupõe que a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol` esteja desativada, por razões descritas na Configuração da Compressão de Conexão Legado.

Para a configuração de conexão bem-sucedida, ambos os lados da conexão devem concordar em um algoritmo de compressão mutuamente permitido. O processo de negociação do algoritmo tenta usar `zlib`, depois `zstd`, depois `uncompressed`. Se os dois lados não conseguirem encontrar um algoritmo comum, a tentativa de conexão falha.

Como ambos os lados devem concordar com o algoritmo de compressão, e porque `uncompressed` é um valor de algoritmo que não é necessariamente permitido, o fallback para uma conexão não comprimida não ocorre necessariamente. Por exemplo, se o servidor estiver configurado para permitir `zstd` e um cliente estiver configurado para permitir `zlib,uncompressed`, o cliente não poderá se conectar. Neste caso, nenhum algoritmo é comum a ambos os lados, então as tentativas de conexão falham.

Os parâmetros de configuração que permitem especificar o nível de compressão `zstd` aceitam um valor inteiro de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam a compressão `zstd`.

Um nível de compressão `zstd` configurável permite escolher entre menos tráfego de rede e maior carga da CPU versus mais tráfego de rede e menor carga da CPU. Níveis de compressão mais altos reduzem o congestionamento da rede, mas a carga adicional da CPU pode reduzir o desempenho do servidor.

#### Configurando a Compressão de Conexão Legado

Antes do MySQL 8.0.18, esses parâmetros de configuração estão disponíveis para controlar a compressão de conexão:

- Os programas do cliente suportam a opção de linha de comando `--compress` para especificar o uso de compressão para a conexão com o servidor.

- Para programas que utilizam a API C do MySQL, a opção `MYSQL_OPT_COMPRESS` para a função `mysql_options()` especifica o uso da compressão para a conexão com o servidor.

- Para a replicação de origem/replica, a ativação da variável de sistema `replica_compressed_protocol` (a partir do MySQL 8.0.26) ou `slave_compressed_protocol` (antes do MySQL 8.0.26) especifica o uso da compressão para as conexões de replica à origem.

Em cada caso, quando o uso de compressão é especificado, a conexão usa o algoritmo de compressão `zlib` se ambas as partes permitirem, com fallback para uma conexão não comprimida caso contrário.

A partir do MySQL 8.0.18, os parâmetros de compressão descritos acima se tornam parâmetros obsoletos, devido aos parâmetros de compressão adicionais introduzidos para maior controle sobre a compressão de conexões, descritos na Configuração da Compressão de Conexão. Uma exceção é o MySQL Shell, onde a opção de linha de comando `--compress` permanece atual e pode ser usada para solicitar compressão sem selecionar algoritmos de compressão. Para obter informações sobre o controle de compressão de conexões do MySQL Shell, consulte Usar Conexões Compridas.

Os parâmetros de compactação do legado interagem com os novos parâmetros e sua semântica muda da seguinte forma:

- O significado da opção `--compress` depende se `--compression-algorithms` é especificado:

  - Quando `--compression-algorithms` não é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos do lado do cliente `zlib,uncompressed`.

  - Quando `--compression-algorithms` é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos de `zlib` e o conjunto completo de algoritmos do lado do cliente é a união de `zlib` mais os algoritmos especificados por `--compression-algorithms`. Por exemplo, com ambos `--compress` e `--compression-algorithms=zlib,zstd`, o conjunto de algoritmos permitidos é `zlib` mais `zlib,zstd`; ou seja, `zlib,zstd`. Com ambos `--compress` e `--compression-algorithms=zstd,uncompressed`, o conjunto de algoritmos permitidos é `zlib` mais `zstd,uncompressed`; ou seja, `zlib,zstd,uncompressed`.

- O mesmo tipo de interação ocorre entre a opção `MYSQL_OPT_COMPRESS` e a opção `MYSQL_OPT_COMPRESSION_ALGORITHMS` para a função C API `mysql_options()`.

- Se a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol` estiver habilitada, ela tem precedência sobre `MASTER_COMPRESSION_ALGORITHMS` e as conexões à fonte utilizam a compressão `zlib` se tanto a fonte quanto a réplica permitirem esse algoritmo. Se `replica_compressed_protocol` ou `slave_compressed_protocol` estiver desabilitada, o valor de `MASTER_COMPRESSION_ALGORITHMS` será aplicado.

Nota

Os parâmetros de controle de compactação do legado estão desatualizados a partir do MySQL 8.0.18; espere-se que sejam removidos em uma versão futura do MySQL.

#### Monitoramento da compressão da conexão

A variável de status `Compression` é `ON` ou `OFF` para indicar se a conexão atual usa compressão.

O comando do cliente **mysql** `\status` exibe uma linha que diz `Protocol: Compressed` se a compressão estiver habilitada para a conexão atual. Se essa linha não estiver presente, a conexão não está comprimida.

A partir da versão 8.0.14, o comando MySQL Shell `\status` exibe uma linha `Compression:` que diz `Disabled` ou `Enabled` para indicar se a conexão está comprimida.

A partir do MySQL 8.0.18, essas fontes adicionais de informações estão disponíveis para monitorar a compressão de conexões:

- Para monitorar a compressão em uso para conexões de clientes, use as variáveis de status `Compression_algorithm` e `Compression_level`. Para a conexão atual, seus valores indicam o algoritmo de compressão e o nível de compressão, respectivamente.

- Para determinar quais algoritmos de compressão o servidor está configurado para permitir para conexões de entrada, verifique a variável de sistema `protocol_compression_algorithms`.

- Para conexões de replicação de origem/replica, os algoritmos de compressão configurados e o nível de compressão estão disponíveis em várias fontes:

  - A tabela do Schema de Desempenho `replication_connection_configuration` tem as colunas `COMPRESSION_ALGORITHMS` e `ZSTD_COMPRESSION_LEVEL`.

  - A tabela de sistema `mysql.slave_master_info` tem as colunas `Master_compression_algorithms` e `Master_zstd_compression_level`. Se o arquivo `master.info` existir, ele contém linhas para esses valores também.
