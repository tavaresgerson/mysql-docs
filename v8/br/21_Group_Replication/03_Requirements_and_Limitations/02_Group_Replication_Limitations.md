### 20.3.2 Limitações da Replicação em Grupo

- Limite de tamanho do grupo
- Limites de tamanho da transação

As seguintes limitações conhecidas existem para a Replicação em Grupo. Observe que as limitações e problemas descritos para grupos em modo multi-primário também podem se aplicar em clústeres em modo único-primário durante um evento de falha, enquanto o primário recém-eleito elimina sua fila de aplicadores do primário antigo.

Dica

A replicação em grupo é baseada na replicação baseada em GTID, portanto, você também deve estar ciente da Seção 19.1.3.7, “Restrições na replicação com GTIDs”.

- Opção `--upgrade=MINIMAL`. A replicação em grupo não pode ser iniciada após uma atualização do servidor MySQL que utiliza a opção MINIMAL (`--upgrade=MINIMAL`), que não atualiza as tabelas do sistema nas quais dependem os recursos internos da replicação.

- **Bloqueios de Lacunas.** O processo de certificação da Group Replication para transações concorrentes não leva em conta os bloqueios de lacunas, pois as informações sobre bloqueios de lacunas não estão disponíveis fora do `InnoDB`. Veja Bloqueios de Lacunas para obter mais informações.

  Nota

  Para um grupo no modo multi-primário, a menos que você dependa da semântica `REPEATABLE READ` em seus aplicativos, recomendamos o uso do nível de isolamento `READ COMMITTED` com a Replicação por Grupo. O InnoDB não usa bloqueios de lacuna em `READ COMMITTED`, o que alinha a detecção de conflitos local dentro do InnoDB com a detecção de conflitos distribuída realizada pela Replicação por Grupo. Para um grupo no modo single-primário, apenas o primário aceita escritas, então o nível de isolamento `READ COMMITTED` não é importante para a Replicação por Grupo.

- **Bloqueios de tabela e bloqueios nomeados.** O processo de certificação não leva em conta os bloqueios de tabela (consulte a Seção 15.3.6, “Instruções LOCK TABLES e UNLOCK TABLES”) ou bloqueios nomeados (consulte `GET_LOCK()`).

- **Checksums do log binário.** Até e incluindo o MySQL 8.0.20, a Replicação por Grupo não pode utilizar checksums e não suporta sua presença no log binário, portanto, você deve definir `binlog_checksum=NONE` ao configurar uma instância do servidor para se tornar membro do grupo. A partir do MySQL 8.0.21, a Replicação por Grupo suporta checksums, então os membros do grupo podem usar o ajuste padrão `binlog_checksum=CRC32`. O ajuste para `binlog_checksum` não precisa ser o mesmo para todos os membros de um grupo.

  Quando os checksums estão disponíveis, a Replicação em Grupo não os usa para verificar eventos recebidos no canal `group_replication_applier`, porque os eventos são escritos nesse log de retransmissão a partir de várias fontes e antes de serem realmente escritos no log binário do servidor de origem, momento em que um checksum é gerado. Os checksums são usados para verificar a integridade dos eventos no canal `group_replication_recovery` e em quaisquer outros canais de replicação dos membros do grupo.

- Nível de isolamento SERIALIZABLE. O nível de isolamento `SERIALIZABLE` não é suportado por padrão em grupos multi-primário. Configurar o nível de isolamento de transação para `SERIALIZABLE` configura a Replicação de Grupo para recusar o commit da transação.

- **Operações DDL concorrentes versus DML.** Operações de definição de dados e manipulação de dados concorrentes que executam contra o mesmo objeto, mas em servidores diferentes, não são suportadas ao usar o modo multi-primário. Durante a execução de instruções de Linguagem de Definição de Dados (DDL) em um objeto, a execução de DML (Linguagem de Manipulação de Dados) concorrente no mesmo objeto, mas em uma instância de servidor diferente, tem o risco de conflitos entre as DDL (Linguagem de Definição de Dados) sendo executadas em instâncias diferentes não serem detectadas.

- **Chave Estrangeira com Restrições em Cascata.** Modelos de grupos com múltiplas chaves estrangeiras primárias (membros configurados com `group_replication_single_primary_mode=OFF`) não suportam tabelas com dependências de chave estrangeira em múltiplos níveis, especificamente tabelas que possuem restrições de chave estrangeira `CASCADING` definidas. Isso ocorre porque as restrições de chave estrangeira que resultam em operações em cascata executadas por um grupo de múltiplas chaves estrangeiras primárias podem resultar em conflitos não detectados e levar a dados inconsistentes entre os membros do grupo. Portanto, recomendamos definir `group_replication_enforce_update_everywhere_checks=ON` em instâncias do servidor usadas em grupos de múltiplas chaves estrangeiras primárias para evitar conflitos não detectados.

  No modo de primário único, isso não é um problema, pois não permite escritas concorrentes em vários membros do grupo, e, portanto, não há risco de conflitos não detectados.

- **Bloqueio de modo multi-primário.** Quando um grupo está operando no modo multi-primário, as instruções `SELECT .. FOR UPDATE` podem resultar em um bloqueio. Isso ocorre porque o bloqueio não é compartilhado entre os membros do grupo, portanto, a expectativa para tal instrução pode não ser alcançada.

- **Filtros de replicação.** Os filtros de replicação globais não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

- **Conexões Encriptadas.** O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL tenha sido compilado com o OpenSSL 1.1.1 ou superior. No MySQL 8.0.16 e no MySQL 8.0.17, se o servidor suportar TLSv1.3, o protocolo não é suportado no motor de comunicação de grupos e não pode ser usado pela Replicação de Grupos. A Replicação de Grupos suporta TLSv1.3 a partir do MySQL 8.0.18, onde pode ser usado para conexões de comunicação de grupos e conexões de recuperação distribuída.

  No MySQL 8.0.18, o TLSv1.3 pode ser usado na Replicação por Grupo para a conexão de recuperação distribuída, mas as variáveis de sistema `group_replication_recovery_tls_version` e `group_replication_recovery_tls_ciphersuites` não estão disponíveis. Portanto, os servidores doadores devem permitir o uso de pelo menos um conjunto de criptografia TLSv1.3 habilitado por padrão, conforme listado na Seção 8.3.2, “Protocolos e conjuntos de criptografia TLS de conexão encriptada”. A partir do MySQL 8.0.19, você pode usar as opções para configurar o suporte ao cliente para qualquer seleção de conjuntos de criptografia, incluindo apenas conjuntos de criptografia não padrão, se desejar.

- **Operações de Clonagem.** A Replicação em Grupo inicia e gerencia operações de clonagem para recuperação distribuída, mas os membros do grupo que foram configurados para suportar a clonagem também podem participar de operações de clonagem iniciadas manualmente por um usuário. Em versões anteriores ao MySQL 8.0.20, você não pode iniciar uma operação de clonagem manualmente se a operação envolver um membro do grupo em que a Replicação em Grupo está sendo executada. A partir do MySQL 8.0.20, você pode fazer isso, desde que a operação de clonagem não remova e substitua os dados do destinatário. Portanto, a declaração para iniciar a operação de clonagem deve incluir a cláusula `DATA DIRECTORY` se a Replicação em Grupo estiver sendo executada. Veja a Seção 20.5.4.2.4, “Clonagem para Outros Fins”.

#### Limite de tamanho do grupo

O número máximo de servidores MySQL que podem ser membros de um único grupo de replicação é de 9. Se mais membros tentarem se juntar ao grupo, seu pedido será recusado. Esse limite foi identificado por meio de testes e benchmarks como um limite seguro onde o grupo funciona de forma confiável em uma rede local estável.

#### Limites de tamanho da transação

Se uma transação individual resultar em conteúdos de mensagem grandes o suficiente para que a mensagem não possa ser copiada entre os membros do grupo pela rede em um período de 5 segundos, os membros podem ser suspeitos de falha e, em seguida, expulsos, apenas porque estão ocupados processando a transação. Transações grandes também podem fazer com que o sistema fique lento devido a problemas com a alocação de memória. Para evitar esses problemas, use as seguintes mitigações:

- Se ocorrerem expulsões desnecessárias devido a mensagens grandes, use a variável de sistema `group_replication_member_expel_timeout` para permitir um tempo adicional antes de um membro suspeito de ter falhado ser expulso. Você pode permitir até uma hora após o período inicial de detecção de 5 segundos antes que um membro suspeito seja expulso do grupo. A partir do MySQL 8.0.21, um adicional de 5 segundos é permitido por padrão.

- Se possível, tente limitar o tamanho das suas transações antes de serem processadas pela Replicação em Grupo. Por exemplo, divida os arquivos usados com `LOAD DATA` em partes menores.

- Use a variável de sistema `group_replication_transaction_size_limit` para especificar um tamanho máximo de transação que o grupo aceita. No MySQL 8.0, essa variável de sistema tem um tamanho máximo de transação padrão de 150000000 bytes (aproximadamente 143 MB). Transações acima desse tamanho são revertidas e não são enviadas para o Sistema de Comunicação de Grupo (GCS) do Grupo de Replicação para distribuição para o grupo. Ajuste o valor dessa variável dependendo do tamanho máximo de mensagem que o grupo precisa tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho.

- Use a variável de sistema `group_replication_compression_threshold` para especificar o tamanho da mensagem acima do qual a compressão é aplicada. Essa variável de sistema tem o valor padrão de 1.000.000 de bytes (1 MB), portanto, mensagens grandes são automaticamente comprimidas. A compressão é realizada pelo Sistema de Comunicação de Grupo (GCS) da Replicação em Grupo quando ele recebe uma mensagem que foi permitida pela configuração `group_replication_transaction_size_limit`, mas excede a configuração `group_replication_compression_threshold`. Para mais informações, consulte a Seção 20.7.4, “Compressão de Mensagens”.

- Use a variável de sistema `group_replication_communication_max_message_size` para especificar o tamanho da mensagem acima do qual as mensagens são fragmentadas. Essa variável de sistema tem o valor padrão de 10485760 bytes (10 MiB), portanto, mensagens grandes são automaticamente fragmentadas. O GCS realiza a fragmentação após a compressão se a mensagem comprimida ainda exceder o limite `group_replication_communication_max_message_size`. Para que um grupo de replicação use a fragmentação, todos os membros do grupo devem estar no MySQL 8.0.16 ou superior, e a versão do protocolo de comunicação de Replicação de Grupo em uso pelo grupo deve permitir a fragmentação. Para mais informações, consulte a Seção 20.7.5, “Fragmentação de Mensagens”.

O tamanho máximo da transação, a compressão de mensagens e a fragmentação de mensagens podem ser desativados especificando um valor zero para a variável de sistema relevante. Se você desativar todas essas proteções, o limite máximo de tamanho para uma mensagem que pode ser processada pelo fio de aplicação em um membro de um grupo de replicação é o valor da variável de sistema `replica_max_allowed_packet` ou `slave_max_allowed_packet` do membro, que têm um valor padrão e máximo de 1073741824 bytes (1 GB). Uma mensagem que excede esse limite falha quando o membro receptor tenta processá-la. O limite máximo de tamanho para uma mensagem que um membro do grupo pode originar e tentar transmitir para o grupo é de 4294967295 bytes (aproximadamente 4 GB). Esse é um limite rígido no tamanho do pacote que é aceito pelo motor de comunicação do grupo para a Replicação em Grupo (XCom, uma variante do Paxos), que recebe mensagens após o GCS as ter processado. Uma mensagem que excede esse limite falha quando o membro que a originou tenta transmiti-la.
