### 6.2.8 Controle de compressão da ligação

As conexões com o servidor podem usar compressão no tráfego entre o cliente e o servidor para reduzir o número de bytes enviados pela conexão. Por padrão, as conexões não são comprimidas, mas podem ser comprimidas se o servidor e o cliente concordarem com um algoritmo de compressão mutuamente permitido.

As conexões compactadas se originam no lado do cliente, mas afetam a carga da CPU tanto no lado do cliente quanto no do servidor, porque ambos os lados realizam operações de compressão e descompressão.

Esta secção descreve os parâmetros de configuração de controlo de compressão disponíveis e as fontes de informação disponíveis para o controlo da utilização da compressão.

O controle de compressão aplica-se às conexões com o servidor por programas cliente e por servidores que participam da replicação de fonte / réplica ou replicação de grupo. O controle de compressão não se aplica às conexões para tabelas `FEDERATED`. Na discussão a seguir, conexão cliente é um abreviado para uma conexão com o servidor originada de qualquer fonte para a qual a compressão é suportada, a menos que o contexto indique um tipo de conexão específico.

::: info Note

As conexões do protocolo X para uma instância do MySQL Server suportam a compressão, mas a compressão para conexões do protocolo X opera independentemente da compressão para conexões clássicas do protocolo MySQL descritas aqui e é controlada separadamente.

:::

- Configurar a compressão da conexão
- Configurar a compressão de conexão legada
- Monitorização da compressão da ligação

#### Configurar a compressão da conexão

Os seguintes parâmetros de configuração estão disponíveis para controlar a compressão da conexão:

- A variável de sistema `protocol_compression_algorithms` configura quais algoritmos de compressão o servidor permite para conexões de entrada.
- As opções de linha de comando `--compression-algorithms` e `--zstd-compression-level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para esses programas cliente: `mysql`, `mysqladmin`, **mysqlbinlog**, `mysqlcheck`, `mysqldump`, `mysqlimport`, `mysqlshow`, **mysqlslap** e **mysqltest**. O MySQL Shell também oferece essas opções de linha de comando.
- As opções `MYSQL_OPT_COMPRESSION_ALGORITHMS` e `MYSQL_OPT_ZSTD_COMPRESSION_LEVEL` para a função `mysql_options()` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para programas cliente que usam a API C do MySQL.
- As opções `SOURCE_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL` para a instrução \[`CHANGE REPLICATION SOURCE TO`] ((change-replication-source-to.html) configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para servidores de réplica que participam da replicação de fonte/replica.
- As variáveis do sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para conexões de recuperação de replicação de grupo quando um novo membro se junta a um grupo e se conecta a um doador.

Os parâmetros de configuração que permitem especificar algoritmos de compressão são valorizados em cadeia de caracteres e consistem numa lista de um ou mais nomes de algoritmos de compressão separados por vírgulas, em qualquer ordem, escolhidos entre os seguintes itens (não sensíveis a maiúsculas e minúsculas):

- `zlib`: Permitir conexões que usam o algoritmo de compressão `zlib`.
- `zstd`: Permitir conexões que usam o algoritmo de compressão `zstd`.
- `uncompressed`: Permitir conexões não comprimidas.

::: info Note

Como `uncompressed` é um nome de algoritmo que pode ou não ser configurado, é possível configurar o MySQL \* não \* para permitir conexões não comprimidas.

:::

Exemplos:

- Para configurar quais algoritmos de compressão o servidor permite para conexões de entrada, defina a variável de sistema `protocol_compression_algorithms`. Por padrão, o servidor permite todos os algoritmos disponíveis. Para configurar essa configuração explicitamente na inicialização, use estas linhas no arquivo do servidor `my.cnf`:

  ```
  [mysqld]
  protocol_compression_algorithms=zlib,zstd,uncompressed
  ```

  Para definir e persistir a variável de sistema `protocol_compression_algorithms` para esse valor no tempo de execução, use esta instrução:

  ```
  SET PERSIST protocol_compression_algorithms='zlib,zstd,uncompressed';
  ```

  \[`SET PERSIST`]]]{set-variable.html} define um valor para a instância em execução do MySQL. Ele também salva o valor, fazendo com que ele seja carregado para reinicializações subsequentes do servidor. Para alterar o valor para a instância em execução do MySQL sem que ele seja carregado para reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`.
- Para permitir apenas conexões de entrada que usam compressão `zstd`, configure o servidor no início desta forma:

  ```
  [mysqld]
  protocol_compression_algorithms=zstd
  ```

  Ou, para fazer a mudança no tempo de execução:

  ```
  SET PERSIST protocol_compression_algorithms='zstd';
  ```
- Para permitir que o cliente `mysql` inicie conexões `zlib` ou `uncompressed`, invoque-o assim:

  ```
  mysql --compression-algorithms=zlib,uncompressed
  ```
- Para configurar réplicas para se conectar à fonte usando conexões `zlib` ou `zstd`, com um nível de compressão de 7 para conexões `zstd`, use uma instrução `CHANGE REPLICATION SOURCE TO`:

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_COMPRESSION_ALGORITHMS = 'zlib,zstd',
    SOURCE_ZSTD_COMPRESSION_LEVEL = 7;
  ```

  Isso pressupõe que a variável de sistema `replica_compressed_protocol` está desativada, por razões descritas em Configurar a Compressão de Conexão Legada.

Para uma conexão bem-sucedida, ambos os lados da conexão devem concordar com um algoritmo de compressão mutuamente permitido. O processo de negociação do algoritmo tenta usar `zlib`, então `zstd`, então `uncompressed`. Se os dois lados não conseguem encontrar um algoritmo comum, a tentativa de conexão falha.

Como ambos os lados precisam concordar com o algoritmo de compressão, e porque \[`uncompressed`] é um valor de algoritmo que não é necessariamente permitido, o fallback para uma conexão não comprimida não ocorre necessariamente. Por exemplo, se o servidor estiver configurado para permitir \[`zstd`] e um cliente estiver configurado para permitir \[`zlib,uncompressed`], o cliente não pode se conectar. Neste caso, nenhum algoritmo é comum a ambos os lados, então as tentativas de conexão falham.

Os parâmetros de configuração que permitem especificar o nível de compressão `zstd` têm um valor inteiro de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão `zstd` padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não usam compressão `zstd`.

Um nível de compressão configurável permite escolher entre menos tráfego de rede e maior carga da CPU versus mais tráfego de rede e menor carga da CPU. Níveis de compressão mais altos reduzem o congestionamento da rede, mas a carga adicional da CPU pode reduzir o desempenho do servidor.

#### Configurar a compressão de conexão legada

Antes do MySQL 8.0.18, estes parâmetros de configuração estão disponíveis para controlar a compressão de conexão:

- Os programas cliente suportam uma opção de linha de comando `--compress` para especificar o uso de compressão para a conexão com o servidor.
- Para programas que usam a API C do MySQL, habilitar a opção `MYSQL_OPT_COMPRESS` para a função `mysql_options()` especifica o uso de compressão para a conexão com o servidor.
- Para a replicação de fonte / réplica, habilitando a variável do sistema `replica_compressed_protocol` especifica o uso de compressão para conexões de réplica com a fonte.

Em cada caso, quando o uso de compressão é especificado, a conexão usa o algoritmo de compressão `zlib` se ambos os lados o permitirem, com recurso a uma conexão não comprimida caso contrário.

A partir do MySQL 8.0.18, os parâmetros de compressão descritos acabam se tornando parâmetros legados, devido aos parâmetros de compressão adicionais introduzidos para mais controle sobre a compressão de conexão que são descritos em Configurar a Compressão de Conexão. Uma exceção é o MySQL Shell, onde a opção de linha de comando `--compress` permanece atual e pode ser usada para solicitar compressão sem selecionar algoritmos de compressão.

Os parâmetros de compressão herdados interagem com os parâmetros mais novos e sua semântica muda da seguinte forma:

- O significado da opção legada `--compress` depende de se `--compression-algorithms` é especificado:

  - Quando `--compression-algorithms` não é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos do lado do cliente de `zlib,uncompressed`.
  - Quando `--compression-algorithms` é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos de `zlib` e o conjunto completo de algoritmos do lado do cliente é a união de `zlib` mais os algoritmos especificados por `--compression-algorithms`. Por exemplo, com ambos `--compress` e `--compression-algorithms=zlib,zstd`, o conjunto de algoritmos permitido é `zlib` mais `zlib,zstd`; isto é, `zlib,zstd`. Com ambos `--compress` e `--compression-algorithms=zstd,uncompressed`, o conjunto de algoritmos permitido é `zlib` mais `zstd,uncompressed`; isto é, \[\[PH\_CODE\_CODE\_14]].
- O mesmo tipo de interação ocorre entre a opção legada `MYSQL_OPT_COMPRESS` e a opção `MYSQL_OPT_COMPRESSION_ALGORITHMS` para a função `mysql_options()` C API.
- Se a variável de sistema `replica_compressed_protocol` estiver ativada, ela terá precedência sobre `SOURCE_COMPRESSION_ALGORITHMS` e as conexões com a fonte usarão a compressão `zlib` se a fonte e a réplica permitirem esse algoritmo. Se `replica_compressed_protocol` estiver desativado, o valor de `SOURCE_COMPRESSION_ALGORITHMS` será aplicado.

#### Monitorização da compressão da ligação

A variável de status `Compression` é `ON` ou `OFF` para indicar se a conexão atual usa compressão.

O comando do cliente `mysql` `\status` exibe uma linha que diz `Protocol: Compressed` se a compressão estiver habilitada para a conexão atual. Se essa linha não estiver presente, a conexão não está comprimida.

O comando MySQL Shell `\status` exibe uma linha `Compression:` que diz `Disabled` ou `Enabled` para indicar se a conexão está comprimida.

As seguintes fontes de informação adicionais estão disponíveis para o controlo da compressão da ligação:

- Para monitorar a compressão em uso para conexões de cliente, use as variáveis de status `Compression_algorithm` e `Compression_level`.
- Para determinar quais algoritmos de compressão o servidor está configurado para permitir conexões de entrada, verifique a variável de sistema `protocol_compression_algorithms`.
- Para conexões de replicação fonte/replica, os algoritmos de compressão configurados e o nível de compressão estão disponíveis a partir de várias fontes:

  - A tabela do Esquema de Desempenho `replication_connection_configuration` tem colunas `COMPRESSION_ALGORITHMS` e `ZSTD_COMPRESSION_LEVEL`.
  - A tabela de sistema `mysql.slave_master_info` tem colunas `Master_compression_algorithms` e `Master_zstd_compression_level`. Se o arquivo `master.info` existe, ele contém linhas para esses valores também.
