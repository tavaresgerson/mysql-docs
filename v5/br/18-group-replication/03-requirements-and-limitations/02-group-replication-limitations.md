### 17.3.2 Limitações da Replicação em Grupo

As seguintes limitações conhecidas existem para a Replicação em Grupo. Observe que as limitações e problemas descritos para grupos em modo multi-primário também podem se aplicar em clústeres em modo único-primário durante um evento de falha, enquanto o primário recém-eleito elimina sua fila de aplicadores do primário antigo.

Dica

A replicação em grupo é baseada na replicação baseada em GTID, portanto, você também deve estar ciente da Seção 16.1.3.6, “Restrições para replicação com GTIDs”.

- **Bloqueios de lacuna.** O processo de certificação do Grupo de Replicação para transações concorrentes não leva em conta os bloqueios de lacuna, pois as informações sobre bloqueios de lacuna não estão disponíveis fora de `InnoDB`. Consulte Bloqueios de lacuna para obter mais informações.

  Nota

  Para um grupo no modo multi-primário, a menos que você dependa da semântica de `REPETIR` em seus aplicativos, recomendamos o uso do nível de isolamento `LEIA COM PROMESSA` com a Replicação de Grupo. O InnoDB não usa bloqueios de lacuna no `LEIA COM PROMESSA`, o que alinha a detecção de conflitos local dentro do InnoDB com a detecção de conflitos distribuída realizada pela Replicação de Grupo. Para um grupo no modo de único primário, apenas o primário aceita escritas, então o nível de isolamento `LEIA COM PROMESSA` não é importante para a Replicação de Grupo.

- **Bloqueios de tabela e bloqueios nomeados.** O processo de certificação não leva em conta os bloqueios de tabela (consulte Seção 13.3.5, “Instruções LOCK TABLES e UNLOCK TABLES”) ou bloqueios nomeados (consulte `GET_LOCK()`).

- **Checksums de eventos de replicação.** Devido a uma limitação de design dos checksums de eventos de replicação, a Replicação em Grupo não pode atualmente utilizá-los. Portanto, configure `--binlog-checksum=NONE`.

- Nível de isolamento SERIALIZABLE. O nível de isolamento `SERIALIZABLE` (innodb-transaction-isolation-levels.html#isolevel\_serializable) não é suportado por padrão em grupos multi-primário. Ao definir um nível de isolamento de transação para `SERIALIZABLE`, o Grupo de Replicação é configurado para recusar o commit da transação.

- **Operações DDL concorrentes versus DML.** Operações de definição de dados e manipulação de dados concorrentes que executam contra o mesmo objeto, mas em servidores diferentes, não são suportadas ao usar o modo multi-primário. Durante a execução de instruções de Linguagem de Definição de Dados (DDL) em um objeto, a execução de DML (Linguagem de Manipulação de Dados) concorrente no mesmo objeto, mas em uma instância de servidor diferente, tem o risco de conflitos entre as DDL (Linguagem de Definição de Dados) sendo executadas em instâncias diferentes não serem detectadas.

- **Chave estrangeira com restrições em cascata.** Os grupos de modo multi-primário (membros configurados com `group_replication_single_primary_mode=OFF`) não suportam tabelas com dependências de chave estrangeira em cascata, especificamente tabelas que têm restrições de chave estrangeira definidas como `CASCADING` restrições de chave estrangeira. Isso ocorre porque as restrições de chave estrangeira que resultam em operações em cascata executadas por um grupo de modo multi-primário podem resultar em conflitos não detectados e levar a dados inconsistentes entre os membros do grupo. Portanto, recomendamos definir `group_replication_enforce_update_everywhere_checks=ON` nas instâncias do servidor usadas em grupos de modo multi-primário para evitar conflitos não detectados.

  No modo de primário único, isso não é um problema, pois não permite escritas concorrentes em vários membros do grupo, e, portanto, não há risco de conflitos não detectados.

- **MySQL Enterprise Audit e MySQL Enterprise Firewall.** Antes da versão 5.7.21, o MySQL Enterprise Audit e o MySQL Enterprise Firewall usavam tabelas `MyISAM` no banco de dados do sistema `mysql`. A Replicação por Grupo não suporta tabelas `MyISAM`.

- **Bloqueio de modo multi-primário.** Quando um grupo está operando no modo multi-primário, as instruções `SELECT .. FOR UPDATE` podem resultar em um bloqueio. Isso ocorre porque o bloqueio não é compartilhado entre os membros do grupo, portanto, a expectativa para tal declaração pode não ser alcançada.

- **Filtros de replicação.** Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

#### Limite de tamanho do grupo

O número máximo de servidores MySQL que podem ser membros de um único grupo de replicação é de 9. Se mais membros tentarem se juntar ao grupo, seu pedido será recusado. Esse limite foi identificado por meio de testes e benchmarks como um limite seguro onde o grupo funciona de forma confiável em uma rede local estável.

#### Limites de tamanho da transação

Se uma transação individual resultar em conteúdos de mensagem grandes o suficiente para que a mensagem não possa ser copiada entre os membros do grupo pela rede em um período de 5 segundos, os membros podem ser suspeitos de falha e, em seguida, expulsos, apenas porque estão ocupados processando a transação. Transações grandes também podem fazer com que o sistema fique lento devido a problemas com a alocação de memória. Para evitar esses problemas, use as seguintes mitigações:

- Se possível, tente limitar o tamanho das suas transações. Por exemplo, divida os arquivos usados com `LOAD DATA` em partes menores.

- Use a variável de sistema `group_replication_transaction_size_limit` para especificar o tamanho máximo de transação que o grupo aceita. Em versões até e incluindo o MySQL 5.7.37, essa variável de sistema tem o valor padrão de zero, mas a partir do MySQL 5.7.38 e no MySQL 8.0, ela tem o valor padrão de um tamanho máximo de transação de 150000000 bytes (aproximadamente 143 MB). Transações acima desse limite são revertidas e não são enviadas para o Sistema de Comunicação do Grupo (GCS) do Grupo de Replicação para distribuição para o grupo. Ajuste o valor dessa variável dependendo do tamanho máximo de mensagem que o grupo precisa tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho.

  Nota

  Quando você atualizar do MySQL 5.7.37 ou versões anteriores para o MySQL 5.7.38 ou versões posteriores, se seus servidores de Replicação por Grupo anteriormente aceitavam transações maiores que o novo limite padrão, e você estava permitindo que `group_replication_transaction_size_limit` fosse definido como o antigo limite zero, essas transações começarão a falhar após a atualização para o novo limite padrão. Você deve especificar um limite de tamanho apropriado que permita o tamanho máximo de mensagem que o grupo precisa tolerar (o que é a solução recomendada) ou especificar um valor zero para restaurar o comportamento anterior.

- Use a variável de sistema `group_replication_compression_threshold` para especificar o tamanho da mensagem acima do qual a compressão é aplicada. Esta variável de sistema tem o valor padrão de 1.000.000 de bytes (1 MB), portanto, mensagens grandes são automaticamente comprimidas. A compressão é realizada pelo Sistema de Comunicação do Grupo de Replicação (GCS) quando ele recebe uma mensagem que foi permitida pela configuração \[`group_replication_transaction_size_limit`]\(group-replication-system-variables.html#sysvar\_group\_replication\_transaction\_size\_limit], mas excede a configuração `group_replication_compression_threshold`. Se você definir o valor da variável de sistema para zero, a compressão é desativada. Para mais informações, consulte Seção 17.9.7.2, “Compressão de Mensagens”.

Se você desativou a compressão de mensagens e não especificar um tamanho máximo de transação, o limite máximo de tamanho para uma mensagem que pode ser processada pelo thread do aplicável em um membro de um grupo de replicação é o valor da variável de sistema `slave_max_allowed_packet` do membro, que tem um valor padrão e máximo de 1073741824 bytes (1 GB). Uma mensagem que excede esse limite falha quando o membro receptor tenta processá-la. O limite máximo de tamanho para uma mensagem que um membro do grupo pode originar e tentar transmitir para o grupo é de 4294967295 bytes (aproximadamente 4 GB). Esse é um limite rígido do tamanho do pacote que é aceito pelo motor de comunicação do grupo para a Replicação em Grupo (XCom, uma variante do Paxos), que recebe mensagens após o GCS as ter processado. Uma mensagem que excede esse limite falha quando o membro que a originou tenta transmiti-la.
