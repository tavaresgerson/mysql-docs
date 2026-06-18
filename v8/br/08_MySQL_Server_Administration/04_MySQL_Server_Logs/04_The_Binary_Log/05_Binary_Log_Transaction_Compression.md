#### 7.4.4.5 Compressão de Transações de Registro Binário

A partir do MySQL 8.0.20, você pode habilitar a compressão de transações do log binário em uma instância do servidor MySQL. Quando a compressão de transações do log binário é habilitada, os payloads das transações são comprimidos usando o algoritmo zstd e, em seguida, escritos no arquivo de log binário do servidor como um único evento (um `Transaction_payload_event`).

Os payloads de transações compactados permanecem em estado compactado enquanto são enviados na corrente de replicação para réplicas, outros membros do grupo de replicação do grupo ou clientes como o **mysqlbinlog**. Eles não são descompactados pelos threads do receptor e são escritos no log de retransmissão ainda em seu estado compactado. A compactação de transações de log binário, portanto, economiza espaço de armazenamento tanto no remetente da transação quanto no destinatário (e para seus backups) e economiza largura de banda de rede quando as transações são enviadas entre instâncias do servidor.

Os payloads de transações compactados são descompactados quando os eventos individuais contidos neles precisam ser inspecionados. Por exemplo, o `Transaction_payload_event` é descompactado por um fio de aplicação para aplicar os eventos que ele contém no destinatário. A descompactação também é realizada durante a recuperação, pelo **mysqlbinlog** ao refazer transações, e pelas instruções `SHOW BINLOG EVENTS` e `SHOW RELAYLOG EVENTS`.

Você pode habilitar a compressão de transações de log binário em uma instância do servidor MySQL usando a variável de sistema `binlog_transaction_compression`, que tem como padrão `OFF`. Você também pode usar a variável de sistema `binlog_transaction_compression_level_zstd` para definir o nível do algoritmo zstd usado para compressão. Esse valor determina o esforço de compressão, de 1 (o menor esforço) a 22 (o maior esforço). À medida que o nível de compressão aumenta, a taxa de compressão também aumenta, o que reduz o espaço de armazenamento e a largura de banda da rede necessárias para o payload da transação. No entanto, o esforço necessário para a compressão de dados também aumenta, consumindo tempo e recursos de CPU e memória no servidor de origem. Aumentos no esforço de compressão não têm uma relação linear com aumentos na taxa de compressão.

Definir `binlog_transaction_compression` ou `binlog_transaction_compression_level_zstd` (ou ambos) não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA` (`START SLAVE`).

No NDB 8.0.31 e versões posteriores, você pode habilitar o registro binário de transações compactadas para tabelas usando o mecanismo de armazenamento `NDB` no tempo de execução usando a variável de sistema `ndb_log_transaction_compression` introduzida nessa versão, e controlar o nível de compactação usando `ndb_log_transaction_compression_level_zstd`. Iniciar o **mysqld** com `--binlog-transaction-compression` na linha de comando ou em um arquivo `my.cnf` faz com que `ndb_log_transaction_compression` seja habilitado automaticamente e qualquer configuração para a opção `--ndb-log-transaction-compression` seja ignorada; para desabilitar a compactação de transações de log binário para o mecanismo de armazenamento *apenas* `NDB`, defina `ndb_log_transaction_compression=OFF` em uma sessão do cliente após iniciar o **mysqld**.

(*Antes da NDB 8.0.31*: A compressão de transações de log binário pode ser habilitada no NDB Cluster, mas apenas ao iniciar o servidor usando a opção --binlog-transaction-compression (e possivelmente --binlog-transaction-compression-level-zstd também); alterar o valor de qualquer uma ou ambas as variáveis de sistema `binlog_transaction_compression` e `binlog_transaction_compression_level_zstd` no momento da execução não tem efeito na logagem das tabelas `NDB`.

Os seguintes tipos de evento são excluídos da compressão de transações do log binário, portanto, são sempre escritos sem compressão no log binário:

- Eventos relacionados ao GTID para a transação (incluindo eventos anônimos do GTID).

- Outros tipos de eventos de controle, como eventos de mudança de visualização e eventos de batimento cardíaco.

- Eventos de incidente e todas as transações que os contenham.

- Eventos não transacionais e todas as transações que os contêm. Uma transação que envolve uma mistura de motores de armazenamento não transacionais e transacionais não tem seu payload comprimido.

- Eventos registrados usando o registro binário baseado em declarações. A compressão de transações de registro binário é aplicada apenas para o formato de registro binário baseado em linhas.

A criptografia de log binário pode ser usada em arquivos de log binário que contêm transações comprimidas.

##### 7.4.4.5.1 Comportamentos quando a Compressão de Transações de Registro Binário está habilitada

As transações com cargas úteis compactadas podem ser desfeitas como qualquer outra transação e também podem ser filtradas em uma replica pelas opções de filtragem habituais. A compactação de transações de log binário pode ser aplicada a transações XA.

Quando a compressão de transações de log binário está habilitada, os limites `max_allowed_packet` e `replica_max_allowed_packet` ou `slave_max_allowed_packet` para o servidor ainda se aplicam e são medidos no tamanho comprimido do `Transaction_payload_event`, mais os bytes usados para o cabeçalho do evento.

Importante

Os payloads de transações compactados são enviados como um único pacote, em vez de cada evento da transação ser enviado em um pacote individual, como ocorre quando a compressão de transações de log binário não está em uso. Se sua topologia de replicação lida com transações grandes, esteja ciente de que uma grande transação que pode ser replicada com sucesso quando a compressão de transações de log binário não está em uso, pode interromper a replicação devido ao seu tamanho quando a compressão de transações de log binário estiver em uso.

Para trabalhadores multithreads, cada transação (incluindo seu evento GTID e `Transaction_payload_event`) é atribuída a um fio de trabalho. O fio de trabalho descomprime o payload da transação e aplica os eventos individuais nela um por um. Se um erro for encontrado ao aplicar qualquer evento dentro do `Transaction_payload_event`, a transação completa é relatada ao coordenador como tendo falhado. Quando `replica_parallel_type` ou `slave_parallel_type` é definido como `DATABASE`, todas as bases de dados afetadas pela transação são mapeadas antes que a transação seja agendada. O uso da compressão de transações de log binário com a política `DATABASE` pode reduzir o paralelismo em comparação com transações não compactadas, que são mapeadas e agendadas para cada evento.

Para a replicação semiesincronizada (consulte a Seção 19.4.10, “Replicação semiesincronizada”), a replica reconhece a transação quando o `Transaction_payload_event` completo for recebido.

Quando os checksums de log binário estão habilitados (o que é o padrão), o servidor de origem da replicação não escreve checksums para eventos individuais em um payload de transação comprimido. Em vez disso, um checksum é escrito para o `Transaction_payload_event` completo, e checksums individuais são escritos para quaisquer eventos que não foram comprimidos, como eventos relacionados a GTIDs.

Para as instruções `SHOW BINLOG EVENTS` e `SHOW RELAYLOG EVENTS`, o `Transaction_payload_event` é impresso primeiro como uma única unidade, depois é descompactado e cada evento dentro dele é impresso.

Para operações que fazem referência à posição final de um evento, como `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`) com a cláusula `UNTIL`, `SOURCE_POS_WAIT()` ou `MASTER_POS_WAIT()`, e `sql_replica_skip_counter` ou `sql_slave_skip_counter`, você deve especificar a posição final do payload da transação comprimida (o `Transaction_payload_event`). Ao pular eventos usando `sql_replica_skip_counter` ou `sql_slave_skip_counter`, um payload de transação comprimida é contado como um único valor de contador, então todos os eventos dentro dele são ignorados como uma unidade.

##### 7.4.4.5.2 Combinando cargas de transação comprimidas e não comprimidas

Os lançamentos do MySQL Server que suportam a compressão de transações de log binário podem lidar com uma mistura de cargas de trabalho de transações compactadas e não compactadas.

- As variáveis de sistema relacionadas à compressão de transações de log binário não precisam ser definidas da mesma forma em todos os membros do grupo de replicação em grupo e não são replicadas de fontes para réplicas em uma topologia de replicação. Você pode decidir se a compressão de transações de log binário é apropriada ou não para cada instância do servidor MySQL que possui um log binário.

- Se a compressão de transações estiver habilitada e depois desabilitada em um servidor, a compressão não será aplicada a transações futuras originadas nesse servidor, mas os payloads das transações que já foram comprimidos ainda podem ser processados e exibidos.

- Se a compressão de transações for especificada para sessões individuais, definindo o valor da sessão de `binlog_transaction_compression`, o log binário pode conter uma mistura de payloads de transações comprimidos e não comprimidos.

Quando uma fonte em uma topologia de replicação e sua réplica têm a compressão de transações de log binário habilitada, a réplica recebe os payloads de transações compactados e os escreve compactados no seu log de retransmissão. Ela descompacta os payloads de transações para aplicar as transações e, em seguida, os compacta novamente após a aplicação para escrita no seu log binário. Quaisquer réplicas subsequentes recebem os payloads de transações compactados.

Quando uma fonte em uma topologia de replicação tem a compressão de transações de log binário habilitada, mas sua replica não, a replica recebe os payloads de transações compactados e os escreve compactados em seu log de retransmissão. Ela descompacta os payloads de transações para aplicar as transações e, em seguida, os escreve não compactados em seu próprio log binário, se tiver um. Quaisquer réplicas subsequentes recebem os payloads de transações não compactados.

Quando uma fonte em uma topologia de replicação não tem a compressão de transações de log binário habilitada, mas sua replica sim, se a replica tiver um log binário, ela comprime os payloads das transações após aplicá-los e escreve os payloads das transações comprimidos em seu log binário. Quaisquer réplicas subsequentes recebem os payloads das transações comprimidos.

Quando uma instância do servidor MySQL não tem um log binário, se estiver em uma versão anterior do MySQL 8.0.20, ela pode receber, processar e exibir cargas de trabalho de transações compactadas, independentemente de seu valor para `binlog_transaction_compression`. As cargas de trabalho de transações compactadas recebidas por essas instâncias de servidor são escritas em seu estado compactado no log de retransmissão, então elas se beneficiam indiretamente da compressão realizada por outros servidores na topologia de replicação.

Uma replica antes da versão 8.0.20 do MySQL não pode replicar de uma fonte com a compressão de transações de log binário habilitada. Uma replica na versão 8.0.20 ou superior pode replicar de uma fonte em uma versão anterior que não suporte compressão de transações de log binário e pode realizar sua própria compressão nas transações recebidas dessa fonte ao escrevê-las em seu próprio log binário.

##### 7.4.4.5.3 Monitoramento da Compressão de Transações de Registro Binário

Você pode monitorar os efeitos da compressão de transações de log binário usando a tabela do Schema de Desempenho `binary_log_transaction_compression_stats`. As estatísticas incluem a taxa de compressão dos dados para o período monitorado, e você também pode visualizar o efeito da compressão na última transação no servidor. Você pode reiniciar as estatísticas truncando a tabela. As estatísticas para logs binários e logs de retransmissão são separadas para que você possa ver o impacto da compressão para cada tipo de log. A instância do servidor MySQL deve ter um log binário para produzir essas estatísticas.

A tabela do Schema de Desempenho `events_stages_current` mostra quando uma transação está na fase de descompactação ou compactação do seu payload de transação e exibe seu progresso para essa fase. A compactação é realizada pelo fio de trabalho que lida com a transação, logo antes da transação ser confirmada, desde que não haja eventos na cache de captura finalizada que excluam a transação da compactação de transações do log binário (por exemplo, eventos incidentes). Quando a descompactação é necessária, ela é realizada para um evento do payload de cada vez.

O **mysqlbinlog** com a opção `--verbose` inclui comentários que indicam o tamanho comprimido e o tamanho descomprimido dos payloads de transações compactados, além do algoritmo de compressão utilizado.

Você pode habilitar a compressão de conexão ao nível do protocolo para conexões de replicação, usando as opções `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL` | `MASTER_ZSTD_COMPRESSION_LEVEL` da instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23), ou a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol`. Se você habilitar a compressão de transações de log binário em um sistema onde a compressão de conexão também está habilitada, o impacto da compressão de conexão é reduzido, pois pode haver pouca oportunidade de comprimir ainda mais os payloads das transações comprimidas. No entanto, a compressão de conexão ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagem. A compressão de transações de log binário pode ser habilitada em combinação com a compressão de conexão se você precisar economizar espaço de armazenamento e largura de banda de rede. Para mais informações sobre compressão de conexão para conexões de replicação, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Para a Replicação em Grupo, a compressão é habilitada por padrão para mensagens que excederem o limite definido pela variável de sistema `group_replication_compression_threshold`. Você também pode configurar a compressão para mensagens enviadas para recuperação distribuída pelo método de transferência de estado de um log binário do doador, usando as variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level`. Se você habilitar a compressão de transações de log binário em um sistema onde essas são configuradas, a compressão de mensagens da Replicação em Grupo ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagem, mas seu impacto é reduzido. Para obter mais informações sobre a compressão de mensagens para a Replicação em Grupo, consulte a Seção 20.7.4, “Compressão de Mensagens”.
