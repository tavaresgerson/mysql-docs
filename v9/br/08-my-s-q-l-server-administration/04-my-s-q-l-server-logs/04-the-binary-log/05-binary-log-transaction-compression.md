#### 7.4.4.5 Compressão de Transações de Log Binário

O MySQL suporta a compressão de transações de log binário; quando habilitada, os payloads das transações são comprimidos usando o algoritmo `zstd`, e então escritos no arquivo de log binário do servidor como um único evento (um `Evento_payload_Transaction`).

Os payloads de transações comprimidos permanecem em estado comprimido enquanto são enviados na corrente de replicação para réplicas, outros membros do grupo de replicação em grupo ou clientes como **mysqlbinlog**. Eles não são descomprimidos por threads de recebimento e são escritos no log de retransmissão ainda em seu estado comprimido. Portanto, a compressão de transações de log binário economiza espaço de armazenamento tanto no remetente quanto no destinatário (e para seus backups) e economiza largura de banda de rede quando as transações são enviadas entre instâncias do servidor.

Os payloads de transações comprimidos são descomprimidos quando os eventos individuais contidos neles precisam ser inspecionados. Por exemplo, o `Evento_payload_Transaction` é descomprimido por um thread de aplicação para aplicar os eventos que ele contém no destinatário. A descomprimagem também é realizada durante a recuperação, pelo **mysqlbinlog** ao refazer transações, e pelas declarações `SHOW BINLOG EVENTS` e `SHOW RELAYLOG EVENTS`.

Você pode habilitar a compressão de transações de log binário em uma instância do servidor MySQL usando a variável de sistema `binlog_transaction_compression`, que tem o valor padrão `OFF`. Você também pode usar a variável de sistema `binlog_transaction_compression_level_zstd` para definir o nível do algoritmo zstd usado para a compressão. Esse valor determina o esforço de compressão, de 1 (o menor esforço) a 22 (o maior esforço). À medida que o nível de compressão aumenta, a taxa de compressão também aumenta, o que reduz o espaço de armazenamento e a largura de banda da rede necessários para o payload da transação. No entanto, o esforço necessário para a compressão de dados também aumenta, consumindo tempo e recursos de CPU e memória no servidor de origem. Aumentos no esforço de compressão não têm uma relação linear com aumentos na taxa de compressão.

Definir `binlog_transaction_compression` ou `binlog_transaction_compression_level_zstd` (ou ambos) não tem efeito imediato, mas aplica-se a todas as declarações subsequentes de `START REPLICA`.

Observação

Você pode habilitar o registro binário de transações comprimidas para tabelas usando o mecanismo de armazenamento `NDB` em tempo de execução usando a variável de sistema `ndb_log_transaction_compression`, e controlar o nível de compressão usando `ndb_log_transaction_compression_level_zstd`. Começar o **mysqld** com `--binlog-transaction-compression` na linha de comando ou em um arquivo `my.cnf` faz com que `ndb_log_transaction_compression` seja habilitado automaticamente e qualquer configuração da opção `--ndb-log-transaction-compression` seja ignorada; para desabilitar a compressão de transações de log binário para o mecanismo de armazenamento `NDB *apenas*, configure `ndb_log_transaction_compression=OFF` em uma sessão do cliente após iniciar o **mysqld**.

Os seguintes tipos de evento são excluídos da compressão de transações do log binário, portanto, são sempre escritos sem compressão no log binário:

* Eventos relacionados ao GTID da transação (incluindo eventos de GTID anônimos).

* Outros tipos de evento de controle, como eventos de mudança de visualização e eventos de batida de coração.

* Eventos de incidente e toda a transação que os contém.

* Eventos não transacionais e toda a transação que os contém. Uma transação que envolve uma mistura de motores de armazenamento não transacionais e transacionais não terá seu payload comprimido.

* Eventos registrados usando o registro binário baseado em instruções. A compressão de transações do log binário só é aplicada para o formato de registro binário baseado em linhas.

A criptografia do log binário pode ser usada em arquivos de log binário que contêm transações comprimidas.

##### 7.4.4.5.1 Comportamentos Quando a Compressão de Transações do Log Binário Está Ativa

Transações com payloads comprimidos podem ser desfeitas como qualquer outra transação e também podem ser filtradas em uma replica pelas opções de filtragem usuais. A compressão de transações do log binário pode ser aplicada a transações XA.

Quando a compressão de transações do log binário está ativada, os limites `max_allowed_packet` e `replica_max_allowed_packet` do servidor ainda se aplicam e são medidos no tamanho comprimido do `Transaction_payload_event`, mais os bytes usados para o cabeçalho do evento.

Importante

Os payloads de transações compactados são enviados como um único pacote, em vez de cada evento da transação ser enviado em um pacote individual, como é o caso quando a compressão de transações de log binário não está em uso. No caso de o pacote de transação compactado exceder o tamanho máximo de pacote usado na replicação, que é de 1 GiB, o servidor de origem escreve a transação descompactada, para que possa ser enviada em pedaços menores.

Para trabalhadores multithreads, cada transação (incluindo seu evento GTID e `Transaction_payload_event`) é atribuída a um thread de trabalhador. O thread de trabalhador descompacta o payload da transação e aplica os eventos individuais nele, um por um. Se um erro for encontrado ao aplicar qualquer evento dentro do `Transaction_payload_event`, a transação completa é relatada ao coordenador como tendo falhado.

Para a replicação semissíncrona (veja a Seção 19.4.10, “Replicação Semissíncrona”), a replica reconhece a transação quando o `Transaction_payload_event` completo é recebido.

Quando os checksums de log binário estão habilitados (o que é o padrão), o servidor de origem da replicação não escreve checksums para eventos individuais em um payload de transação compactado. Em vez disso, um checksum é escrito para o `Transaction_payload_event` completo, e checksums individuais são escritos para quaisquer eventos que não foram compactados, como eventos relacionados a GTIDs.

Para as instruções `SHOW BINLOG EVENTS` e `SHOW RELAYLOG EVENTS`, o `Transaction_payload_event` é primeiro impresso como uma única unidade, então é descompactado e cada evento dentro dele é impresso.

Para operações que fazem referência à posição final de um evento, como `START REPLICA` com a cláusula `UNTIL`, `SOURCE_POS_WAIT()` e `sql_replica_skip_counter`, você deve especificar a posição final do payload de transação comprimido (o `Transaction_payload_event`). Ao ignorar eventos usando `sql_replica_skip_counter`, um payload de transação comprimido é contado como um único valor de contador, então todos os eventos dentro dele são ignorados como uma unidade.

##### 7.4.4.5.2 Combinando Payloads de Transação Compressados e Não Compressados

Os servidores MySQL que suportam a compressão de transações de log binário podem lidar com uma mistura de payloads de transação comprimidos e não comprimidos.

* As variáveis de sistema relacionadas à compressão de transações de log binário não precisam ser definidas da mesma forma em todos os membros do grupo de replicação e não são replicadas de fontes para réplicas em uma topologia de replicação. Você pode decidir se a compressão de transações de log binário é apropriada para cada instância do MySQL Server que tem um log binário.

* Se a compressão de transações é habilitada e depois desabilitada em um servidor, a compressão não é aplicada a transações futuras originadas nesse servidor, mas os payloads de transação que foram comprimidos ainda podem ser manipulados e exibidos.

* Se a compressão de transações é especificada para sessões individuais definindo o valor da sessão `binlog_transaction_compression`, o log binário pode conter uma mistura de payloads de transação comprimidos e não comprimidos.

Quando uma fonte em uma topologia de replicação e sua réplica têm a compressão de transações de log binário habilitada, a réplica recebe cargas de trabalho de transações comprimidas e as escreve comprimidas em seu log de retransmissão. Ela descomprime as cargas de trabalho de transações para aplicar as transações e, em seguida, as comprime novamente após a aplicação para escrita em seu log binário. Quaisquer réplicas descendentes recebem as cargas de trabalho de transações comprimidas.

Quando uma fonte em uma topologia de replicação tem a compressão de transações de log binário habilitada, mas sua réplica não, a réplica recebe cargas de trabalho de transações comprimidas e as escreve comprimidas em seu log de retransmissão. Ela descomprime as cargas de trabalho de transações para aplicar as transações e, em seguida, as escreve não comprimidas em seu próprio log binário, se tiver um. Quaisquer réplicas descendentes recebem as cargas de trabalho de transações não comprimidas.

Quando uma fonte em uma topologia de replicação não tem a compressão de transações de log binário habilitada, mas sua réplica sim, se a réplica tiver um log binário, ela comprime as cargas de trabalho de transações após aplicá-las e escreve as cargas de trabalho de transações comprimidas em seu log binário. Quaisquer réplicas descendentes recebem as cargas de trabalho de transações comprimidas.

Quando uma instância do servidor MySQL não tem log binário, ela pode receber, manipular e exibir cargas de trabalho de transações comprimidas, independentemente de seu valor para `binlog_transaction_compression`. Cargas de trabalho de transações comprimidas recebidas por tais instâncias do servidor são escritas em seu estado comprimido no log de retransmissão, então elas se beneficiam indiretamente da compressão que foi realizada por outros servidores na topologia de replicação.

##### 7.4.4.5.3 Monitoramento da Compressão de Transações de Log Binário

Você pode monitorar os efeitos da compressão de transações de log binário usando a tabela do Schema de Desempenho `binary_log_transaction_compression_stats`. As estatísticas incluem a taxa de compressão dos dados para o período monitorado, e você também pode visualizar o efeito da compressão na última transação no servidor. Você pode reiniciar as estatísticas truncando a tabela. As estatísticas para logs binários e logs de retransmissão são separadas para que você possa ver o impacto da compressão para cada tipo de log. A instância do servidor MySQL deve ter um log binário para produzir essas estatísticas.

A tabela do Schema de Desempenho `events_stages_current` mostra quando uma transação está na fase de descompactação ou compactação para seu payload de transação e exibe seu progresso para essa fase. A compactação é realizada pelo thread do trabalhador que lida com a transação, logo antes da transação ser confirmada, desde que não haja eventos na cache de captura finalizada que excluam a transação da compressão de transações de log binário (por exemplo, eventos incidentes). Quando a descompactação é necessária, ela é realizada para um evento do payload de cada vez.

O **mysqlbinlog** com a opção `--verbose` inclui comentários indicando o tamanho comprimido e o tamanho descomprimido para os payloads de transações compactados, e o algoritmo de compressão que foi usado.

Você pode habilitar a compressão de conexão ao nível do protocolo para conexões de replicação, usando as opções `SOURCE_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL` da instrução `CHANGE REPLICATION SOURCE TO`, ou a variável de sistema `replica_compressed_protocol`. Se você habilitar a compressão de transações de log binário em um sistema onde a compressão de conexão também está habilitada, o impacto da compressão de conexão é reduzido, pois pode haver pouca oportunidade de comprimir ainda mais os payloads das transações comprimidas. No entanto, a compressão de conexão ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagem. A compressão de transações de log binário pode ser habilitada em combinação com a compressão de conexão se você precisar economizar espaço de armazenamento e largura de banda de rede. Para mais informações sobre compressão de conexão para conexões de replicação, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Para a Replicação em Grupo, a compressão é habilitada por padrão para mensagens que excedem o limite definido pela variável de sistema `group_replication_compression_threshold`. Você também pode configurar a compressão para mensagens enviadas para recuperação distribuída pelo método de transferência de estado de um log binário do doador, usando as variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level`. Se você habilitar a compressão de transações de log binário em um sistema onde essas são configuradas, a compressão de mensagens da Replicação em Grupo ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagem, mas seu impacto é reduzido. Para mais informações sobre compressão de mensagens para a Replicação em Grupo, consulte a Seção 20.7.4, “Compressão de Mensagens”.