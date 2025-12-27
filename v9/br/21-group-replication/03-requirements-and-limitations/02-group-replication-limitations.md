### 20.3.2 Limitações da Replicação em Grupo

* Limite de Tamanho do Grupo
* Limites no Tamanho da Transação

Existem as seguintes limitações conhecidas para a Replicação em Grupo. Note que as limitações e problemas descritos para grupos em modo multi-primário também podem se aplicar em clusters em modo único-primário durante um evento de falha, enquanto o primário recém-eleito descarta sua fila de aplicador do primário antigo.

Dica

A Replicação em Grupo é construída sobre a replicação baseada em GTID, portanto, você também deve estar ciente da Seção 19.1.3.7, “Restrições na Replicação com GTIDs”.

* Opção `--upgrade=MINIMAL`. A Replicação em Grupo não pode ser iniciada após uma atualização do Servidor MySQL que usa a opção MINIMAL (`--upgrade=MINIMAL`), que não atualiza as tabelas de sistema nas quais o interno da replicação depende.

* **Bloqueios de Lacunas.** O processo de certificação da Replicação em Grupo para transações concorrentes não leva em conta os bloqueios de lacunas, pois as informações sobre bloqueios de lacunas não estão disponíveis fora do `InnoDB`. Consulte Bloqueios de Lacunas para mais informações.

Nota

Para um grupo em modo multi-primário, a menos que você dependa da semântica `REPEATABLE READ` em seus aplicativos, recomendamos usar o nível de isolamento `READ COMMITTED` com a Replicação em Grupo. O `InnoDB` não usa bloqueios de lacunas em `READ COMMITTED`, o que alinha a detecção de conflitos local dentro do `InnoDB` com a detecção de conflitos distribuída realizada pela Replicação em Grupo. Para um grupo em modo único-primário, apenas o primário aceita escritas, então o nível de isolamento `READ COMMITTED` não é importante para a Replicação em Grupo.

* **Bloqueios de Tabela e Bloqueios Nomeados.** O processo de certificação não leva em conta bloqueios de tabela (consulte a Seção 15.3.6, “Instruções LOCK TABLES e UNLOCK TABLES”) ou bloqueios nomeados (consulte `GET_LOCK()`).

* **Cheksums de log binário.** A Replicação em Grupo no MySQL 9.5 suporta checksums, então os membros do grupo podem usar o ajuste padrão `binlog_checksum=CRC32`. O ajuste para `binlog_checksum` não precisa ser o mesmo para todos os membros de um grupo.

Quando os checksums estão disponíveis, a Replicação em Grupo não os usa para verificar eventos recebidos no canal `group_replication_applier`, porque os eventos são escritos nesse log de retransmissão a partir de várias fontes e antes de serem realmente escritos no log binário do servidor de origem, quando um checksum é gerado. Os checksums são usados para verificar a integridade dos eventos no canal `group_replication_recovery` e em quaisquer outros canais de replicação dos membros do grupo.

* **Nível de isolamento SERIALIZABLE.** O nível de isolamento `SERIALIZABLE` não é suportado por padrão em grupos multi-primari. Configurar o nível de isolamento de transação para `SERIALIZABLE` configura a Replicação em Grupo para recusar o commit da transação.

* **Operações de DDL concorrentes versus DML.** Operações de definição de dados e de manipulação de dados concorrentes executando contra o mesmo objeto, mas em servidores diferentes, não são suportadas ao usar o modo multi-primari. Durante a execução de declarações de Linguagem de Definição de Dados (DDL) em um objeto, a execução de DML concorrente (DML) no mesmo objeto, mas em uma instância diferente do servidor, tem o risco de conflitos de DDL sendo executados em instâncias diferentes não sendo detectados.

* **Chaves Estrangeiras com Restrições em Cascata.** Modelos de grupos com múltiplos primários (membros configurados com `group_replication_single_primary_mode=OFF`) não suportam tabelas com dependências de chave estrangeira em múltiplos níveis, especificamente tabelas que possuem restrições de chave estrangeira em cascata definidas. Isso ocorre porque as restrições de chave estrangeira que resultam em operações em cascata executadas por um grupo de modo multi-primário podem resultar em conflitos não detectados e levar a dados inconsistentes entre os membros do grupo. Portanto, recomendamos definir `group_replication_enforce_update_everywhere_checks=ON` em instâncias do servidor usadas em grupos de modo multi-primário para evitar conflitos não detectados.

  No modo de único primário, isso não é um problema, pois não permite escritas concorrentes em vários membros do grupo e, portanto, não há risco de conflitos não detectados.

* **Bloqueio em Modo Multi-Primário.** Quando um grupo está operando no modo multi-primário, as instruções `SELECT .. FOR UPDATE` podem resultar em um bloqueio. Isso ocorre porque o bloqueio não é compartilhado entre os membros do grupo, portanto, a expectativa para tal instrução pode não ser alcançada.

* **Filtros de Replicação.** Filtros de replicação globais não podem ser usados em uma instância do servidor MySQL configurada para Replicação em Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos de canal podem ser usados em canais de replicação que não estão diretamente envolvidos com a Replicação em Grupo, como quando um membro do grupo também atua como uma replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

* **Conexões Encriptadas.** O suporte ao protocolo TLSv1.3 está disponível no MySQL, desde que tenha sido compilado usando o OpenSSL 1.1.1 ou superior. A Replicação em Grupo suporta TLSv1.3, onde pode ser usado para conexões de comunicação em grupo e conexões de recuperação distribuída.

  `group_replication_recovery_tls_version` e `group_replication_recovery_tls_ciphersuites` podem ser usados para configurar o suporte do cliente para qualquer seleção de suites de cifra, incluindo apenas suites de cifra não padrão, se desejado. Veja a Seção 8.3.2, “Protocolos e Suites de Cifra TLS de Conexão Encriptada”.

* **Operações de Clonagem.** A Replicação em Grupo inicia e gerencia operações de clonagem para recuperação distribuída, mas os membros do grupo que foram configurados para suportar clonagem também podem participar de operações de clonagem iniciadas manualmente por um usuário. Você pode iniciar uma operação de clonagem manualmente se a operação envolver um membro do grupo em que a Replicação em Grupo está sendo executada, desde que a operação de clonagem não remova e substitua os dados do destinatário. A declaração para iniciar a operação de clonagem deve, portanto, incluir a cláusula `DIRIGENTE DE DADOS` se a Replicação em Grupo estiver sendo executada. Veja a Seção 20.5.4.2.4, “Clonagem para Outros Fins”.

#### Limite de Tamanho do Grupo

O número máximo de servidores MySQL que podem ser membros de um único grupo de replicação é de 9. Se mais membros tentarem se juntar ao grupo, sua solicitação será recusada. Esse limite foi identificado por meio de testes e benchmarks como um limite seguro onde o grupo funciona de forma confiável em uma rede local estável.

#### Limites de Tamanho da Transação

Se uma transação individual resultar em conteúdos de mensagens grandes o suficiente para que a mensagem não possa ser copiada entre os membros do grupo pela rede em um período de 5 segundos, os membros podem ser suspeitos de terem falhado e, em seguida, expulsos, apenas porque estão ocupados processando a transação. Transações grandes também podem fazer com que o sistema fique lento devido a problemas com a alocação de memória. Para evitar esses problemas, use as seguintes mitigações:

* Se ocorrerem expulsões desnecessárias devido a mensagens grandes, use a variável de sistema `group_replication_member_expel_timeout` para permitir um tempo adicional antes de um membro suspeito de ter falhado ser expulso. Você pode permitir até uma hora após o período inicial de detecção de 5 segundos antes que um membro suspeito seja expulso do grupo. Um adicional de 5 segundos é permitido por padrão.

* Sempre que possível, tente limitar o tamanho das suas transações antes de serem processadas pela Replicação do Grupo. Por exemplo, divida os arquivos usados com `LOAD DATA` em partes menores.

* Use a variável de sistema `group_replication_transaction_size_limit` para especificar um tamanho máximo de transação que o grupo aceita. O tamanho máximo de transação padrão é de 150000000 bytes (aproximadamente 143 MB); transações acima desse tamanho são revertidas e não são enviadas para o Sistema de Comunicação de Grupo (GCS) da Replicação do Grupo para distribuição ao grupo. Ajuste o valor dessa variável dependendo do tamanho máximo de mensagem que o grupo precisa tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho.

* Use a variável de sistema `group_replication_compression_threshold` para especificar o tamanho de uma mensagem acima do qual a compressão é aplicada. Esta variável de sistema tem o valor padrão de 1.000.000 de bytes (1 MB), portanto, mensagens grandes são automaticamente comprimidas. A compressão é realizada pelo Sistema de Comunicação de Grupo (GCS) do Grupo de Replicação quando ele recebe uma mensagem que foi permitida pelo ajuste `group_replication_transaction_size_limit`, mas excede o ajuste `group_replication_compression_threshold`. Para mais informações, consulte a Seção 20.7.4, “Compressão de Mensagens”.

* Use a variável de sistema `group_replication_communication_max_message_size` para especificar o tamanho de uma mensagem acima do qual as mensagens são fragmentadas. Esta variável de sistema tem o valor padrão de 1.048.5760 bytes (10 MiB), portanto, mensagens grandes são automaticamente fragmentadas. O GCS realiza a fragmentação após a compressão se a mensagem comprimida ainda exceder o limite `group_replication_communication_max_message_size`. Para mais informações, consulte a Seção 20.7.5, “Fragmentação de Mensagens”.

O tamanho máximo da transação, a compressão de mensagens e a fragmentação de mensagens podem ser desativados especificando um valor zero para a variável de sistema relevante. Se você desativar todas essas proteções, o limite máximo de tamanho para uma mensagem que pode ser processada pelo fio de aplicação em um membro de um grupo de replicação é o valor da variável de sistema `replica_max_allowed_packet` do membro, que tem um valor padrão e máximo de 1073741824 bytes (1 GB). Uma mensagem que excede esse limite falha quando o membro receptor tenta processá-la. O limite máximo de tamanho para uma mensagem que um membro do grupo pode originar e tentar transmitir para o grupo é de 4294967295 bytes (aproximadamente 4 GB). Esse é um limite rígido do tamanho do pacote que é aceito pelo motor de comunicação do grupo para a Replicação em Grupo (XCom, uma variante do Paxos), que recebe mensagens após o GCS as ter processado. Uma mensagem que excede esse limite falha quando o membro que a originou tenta transmiti-la.