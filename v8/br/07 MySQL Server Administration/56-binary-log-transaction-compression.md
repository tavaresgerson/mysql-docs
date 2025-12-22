#### 7.4.4.5 Compressão de transações de log binário

O MySQL suporta a compressão de transações de log binário; quando isso é ativado, as cargas úteis de transação são comprimidas usando o algoritmo `zstd` e, em seguida, escritas no arquivo de log binário do servidor como um único evento (um `Transaction_payload_event`).

As cargas úteis de transações compactadas permanecem em um estado compactado enquanto são enviadas no fluxo de replicação para réplicas, outros membros do grupo de replicação de grupo ou clientes como **mysqlbinlog**. Eles não são descompactados por threads de receptor e são escritos no registro de retransmissão ainda em seu estado compactado. A compressão de transações de log binário, portanto, economiza espaço de armazenamento tanto no originador da transação quanto no destinatário (e para seus backups), e economiza largura de banda de rede quando as transações são enviadas entre instâncias de servidor.

As cargas úteis de transações compactadas são descompactadas quando os eventos individuais contidos nelas precisam ser inspecionados. Por exemplo, o `Transaction_payload_event` é descompactado por um thread de aplicador para aplicar os eventos que ele contém no destinatário. A descompactação também é realizada durante a recuperação, pelo **mysqlbinlog** ao reproduzir transações e pelas instruções `SHOW BINLOG EVENTS` e `SHOW RELAYLOG EVENTS`.

Você pode habilitar a compressão de transações de log binário em uma instância de servidor MySQL usando a variável de sistema `binlog_transaction_compression`, que é padrão para `OFF`. Você também pode usar a variável de sistema `binlog_transaction_compression_level_zstd` para definir o nível para o algoritmo zstd que é usado para compressão. Este valor determina o esforço de compressão, de 1 (o menor esforço) para 22 (o maior esforço). À medida que o nível de compressão aumenta, a relação de compressão aumenta, o que reduz o espaço de armazenamento e a largura de banda da rede necessária para a carga útil da transação. No entanto, o esforço necessário para a compressão de dados também aumenta, consumindo tempo e recursos de CPU e memória no servidor de origem. O aumento do esforço de compressão não tem uma relação linear com o aumento da relação de compressão.

A definição de `binlog_transaction_compression` ou `binlog_transaction_compression_level_zstd` (ou ambos) não tem efeito imediato, mas sim se aplica a todas as instruções subsequentes de `START REPLICA`.

::: info Note

Você pode ativar o registro binário de transações compactadas para tabelas usando o motor de armazenamento `NDB` no tempo de execução usando a variável de sistema `ndb_log_transaction_compression` e controlar o nível de compressão usando `ndb_log_transaction_compression_level_zstd`. Iniciar `mysqld` com `--binlog-transaction-compression` na linha de comando ou em um arquivo `my.cnf` faz com que `ndb_log_transaction_compression` seja ativado automaticamente e qualquer configuração para a opção `--ndb-log-transaction-compression` seja ignorada; para desativar a compressão de transação de log binário para o motor de armazenamento `NDB` \* somente definir \*, `ndb_log_transaction_compression=OFF` em uma sessão de cliente após iniciar **mysldq**.

:::

Os seguintes tipos de eventos são excluídos da compressão de transações de log binário, então são sempre escritos sem compressão no log binário:

- Eventos relacionados com o GTID da transação (incluindo eventos GTID anónimos).
- Outros tipos de eventos de controlo, tais como eventos de alteração de visão e eventos de batimentos cardíacos.
- Incidentes e o conjunto de quaisquer transacções que os contenham.
- Eventos não transacionais e o conjunto de quaisquer transações que os contenham.
- Eventos que são registrados usando registro binário baseado em instruções. A compressão de transações de registro binário é aplicada apenas para o formato de registro binário baseado em linhas.

A criptografia de log binário pode ser usada em arquivos de log binários que contenham transações compactadas.

##### 7.4.4.5.1 Comportamentos quando a compressão de transações de log binário está habilitada

Transações com cargas úteis que são comprimidas podem ser revertidas como qualquer outra transação, e também podem ser filtradas em uma réplica pelas opções de filtragem habituais.

Quando a compressão de transações de log binário é ativada, os limites de `max_allowed_packet` e `replica_max_allowed_packet` para o servidor ainda se aplicam, e são medidos no tamanho comprimido do `Transaction_payload_event`, mais os bytes usados para o cabeçalho do evento.

Importância

As cargas úteis de transação compactadas são enviadas como um único pacote, em vez de cada evento da transação ser enviado em um pacote individual, como é o caso quando a compressão de transação de log binário não está em uso.

Para trabalhadores multithreaded, cada transação (incluindo seu evento GTID e `Transaction_payload_event`) é atribuída a um thread de trabalho. O thread de trabalho descomprime a carga útil da transação e aplica os eventos individuais um a um. Se for encontrado um erro aplicando qualquer evento dentro do `Transaction_payload_event`, a transação completa é relatada ao coordenador como tendo falhado. Quando `replica_parallel_type` ou `replica_parallel_type` é definido como `DATABASE`, todos os bancos de dados afetados pela transação são mapeados antes da transação ser agendada. O uso da compressão de log de transações binárias com a política `DATABASE` pode reduzir o paralelismo em comparação com transações não comprimidas, que são mapeadas e agendadas para cada evento.

Para a replicação semisíncrona (ver Secção 19.4.10, "Replicação semisíncrona"), a réplica reconhece a transação quando o `Transaction_payload_event` completo foi recebido.

Quando checksums de log binário são habilitados (o que é o padrão), o servidor de origem de replicação não escreve checksums para eventos individuais em uma carga útil de transação comprimida. Em vez disso, uma checksum é escrita para o `Transaction_payload_event` completo, e checksums individuais são escritos para quaisquer eventos que não foram comprimidos, como eventos relacionados a GTIDs.

Para as instruções `SHOW BINLOG EVENTS` e `SHOW RELAYLOG EVENTS`, o `Transaction_payload_event` é primeiramente impresso como uma única unidade, depois é desembalado e cada evento dentro dele é impresso.

Para operações que referenciam a posição final de um evento, como `START REPLICA` com a cláusula `UNTIL`, `SOURCE_POS_WAIT()`, e `sql_replica_skip_counter`, você deve especificar a posição final da carga útil de transação comprimida (a `Transaction_payload_event`). Ao pular eventos usando `sql_replica_skip_counter`, uma carga útil de transação comprimida é contada como um único valor de contador, então todos os eventos dentro dela são ignorados como uma unidade.

##### 7.4.4.5.2 Combinação de cargas úteis de transacções comprimidas e não comprimidas

As versões do MySQL Server que suportam a compressão de transações de log binário podem lidar com uma mistura de cargas úteis de transações comprimidas e não comprimidas.

- As variáveis de sistema relacionadas à compressão de transações de log binário não precisam ser definidas da mesma forma em todos os membros do grupo de replicação de grupo, e não são replicadas de fontes para réplicas em uma topologia de replicação.
- Se a compressão de transações for ativada e desativada em um servidor, a compressão não é aplicada a transações futuras originadas nesse servidor, mas as cargas úteis de transações que foram comprimidas ainda podem ser manipuladas e exibidas.
- Se a compressão de transações for especificada para sessões individuais, definindo o valor de sessão de \[`binlog_transaction_compression`], o log binário pode conter uma mistura de cargas úteis de transações comprimidas e não comprimidas.

Quando uma fonte em uma topologia de replicação e sua réplica têm a compressão de transações de log binário ativada, a réplica recebe cargas úteis de transações compactadas e as escreve comprimidas em seu log de retransmissão.

Quando uma fonte em uma topologia de replicação tem a compressão de transações de log binário ativada, mas sua réplica não, a réplica recebe cargas úteis de transações compactadas e as escreve comprimidas em seu log de retransmissão.

Quando uma fonte em uma topologia de replicação não tem compressão de transação de log binário ativada, mas sua réplica tem, se a réplica tiver um log binário, ela comprime as cargas úteis de transação depois de aplicá-las e escreve as cargas úteis de transação comprimidas em seu log binário.

Quando uma instância de servidor MySQL não tem log binário, ela pode receber, lidar e exibir cargas úteis de transação compactadas, independentemente de seu valor para `binlog_transaction_compression`. Cargas úteis de transação compactadas recebidas por tais instâncias de servidor são escritas em seu estado compactado para o log de retransmissão, de modo que elas se beneficiam indiretamente da compressão realizada por outros servidores na topologia de replicação.

##### 7.4.4.5.3 Monitorização da compressão de transações de log binário

Você pode monitorar os efeitos da compressão de transações de log binário usando a tabela de esquema de desempenho `binary_log_transaction_compression_stats`. As estatísticas incluem a taxa de compressão de dados para o período monitorado, e você também pode ver o efeito da compressão na última transação no servidor. Você pode redefinir as estatísticas truncando a tabela. As estatísticas para logs binários e logs de retransmissão são divididas para que você possa ver o impacto da compressão para cada tipo de log. A instância do servidor MySQL deve ter um log binário para produzir essas estatísticas.

A tabela de esquema de desempenho `events_stages_current` mostra quando uma transação está no estágio de descompressão ou compressão para sua carga útil de transação, e exibe seu progresso para essa fase. A compressão é realizada pelo thread de trabalho que lida com a transação, pouco antes da transação ser comprometida, desde que não haja eventos no cache de captura finalizado que excluam a transação da compressão de transações de log binário (por exemplo, eventos de incidente). Quando a descompressão é necessária, ela é realizada para um evento da carga útil de cada vez.

**mysqlbinlog** com a opção `--verbose` inclui comentários indicando o tamanho comprimido e o tamanho não comprimido para cargas úteis de transação comprimidas, e o algoritmo de compressão que foi usado.

Você pode ativar a compressão de conexão no nível do protocolo para conexões de replicação, usando as opções `SOURCE_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL` da instrução `CHANGE REPLICATION SOURCE TO`, ou a variável do sistema `replica_compressed_protocol`. Se você ativar a compressão de transações de log binário em um sistema onde a compressão de conexão também é ativada, o impacto da compressão de conexão é reduzido, pois pode haver pouca oportunidade de comprimir ainda mais as cargas úteis de transações comprimidas. No entanto, a compressão de conexão ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagem. A compressão de transações de log binário pode ser ativada em combinação com a compressão se você precisar economizar espaço de armazenamento e largura de banda de rede.

Para a replicação em grupo, a compressão é ativada por padrão para mensagens que excedem o limite definido pela variável de sistema `group_replication_compression_threshold`. Você também pode configurar a compressão para mensagens enviadas para recuperação distribuída pelo método de transferência de estado do log binário de um doador, usando as variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level`. Se você habilitar a compressão de transações de log binário em um sistema onde estas são configuradas, a compressão de mensagens da replicação em grupo ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagens, mas seu impacto é reduzido. Para mais informações sobre a compressão de mensagens para a replicação em grupo, consulte a Seção 20.7.4, Compressão de mensagens.
