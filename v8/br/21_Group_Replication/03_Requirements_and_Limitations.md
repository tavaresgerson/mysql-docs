## 20.3 Requisitos e Limitações

Esta seção lista e explica os requisitos e limitações da Replicação em Grupo.

### 20.3.1 Requisitos de Replicação em Grupo

* Infraestrutura
* Configuração da Instância do Servidor

As instâncias do servidor que você deseja usar para a Replicação em Grupo devem atender aos seguintes requisitos.

#### Infraestrutura

* **Engenho de Armazenamento InnoDB.** Os dados devem ser armazenados no `InnoDB` engenho de armazenamento transacional. As transações são executadas otimisticamente e, em seguida, no momento do commit, são verificadas quanto a conflitos. Se houver conflitos, para manter a consistência em todo o grupo, algumas transações são revertidas. Isso significa que é necessário um engenho de armazenamento transacional. Além disso, o `InnoDB` oferece algumas funcionalidades adicionais que permitem uma melhor gestão e tratamento de conflitos ao operar em conjunto com a Replicação de Grupo. O uso de outros engenhos de armazenamento, incluindo o temporário `MEMORY`, pode causar erros na Replicação de Grupo. Converta todas as tabelas em outros engenhos de armazenamento para usar o `InnoDB` antes de usar a instância com Replicação de Grupo. Você pode impedir o uso de outros engenhos de armazenamento definindo a variável de sistema `disabled_storage_engines` nos membros do grupo, por exemplo:

  ```
  disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
  ```

* **Chaves Primárias.** Toda tabela que deve ser replicada pelo grupo deve ter uma chave primária definida, ou equivalente de chave primária, onde o equivalente é uma chave única não nula. Tais chaves são necessárias como um identificador único para cada linha dentro de uma tabela, permitindo que o sistema determine quais transações entram em conflito, identificando exatamente quais linhas cada transação modificou. A Replicação de Grupo tem seu próprio conjunto de verificações integrado para chaves primárias ou equivalentes de chave primária, e não usa as verificações realizadas pela variável de sistema `sql_require_primary_key`. Você pode definir `sql_require_primary_key=ON` para uma instância do servidor onde a Replicação de Grupo está sendo executada, e pode definir a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") para `ON` para um canal de Replicação de Grupo. No entanto, esteja ciente de que você pode encontrar algumas transações que são permitidas nas verificações integrais da Replicação de Grupo, mas não são permitidas nas verificações realizadas quando você define `sql_require_primary_key=ON` ou `REQUIRE_TABLE_PRIMARY_KEY_CHECK=ON`.

* **Desempenho da rede.** A Replicação em Grupo do MySQL é projetada para ser implantada em um ambiente de clúster onde as instâncias do servidor estão muito próximas umas das outras. O desempenho e a estabilidade de um grupo podem ser impactados tanto pela latência da rede quanto pela largura de banda da rede. A comunicação bidirecional deve ser mantida em todos os momentos entre todos os membros do grupo. Se a comunicação de entrada ou saída for bloqueada para uma instância do servidor (por exemplo, por um firewall ou por problemas de conectividade), o membro não poderá funcionar no grupo, e os membros do grupo (incluindo o membro com problemas) podem não ser capazes de relatar o status correto do membro para a instância do servidor afetada.

A partir do MySQL 8.0.14, você pode usar uma infraestrutura de rede IPv4 ou IPv6, ou uma combinação das duas, para comunicação TCP entre servidores remotos de Replicação de Grupo. Além disso, não há nada que impeça a Replicação de Grupo de operar em uma rede privada virtual (VPN).

Também a partir do MySQL 8.0.14, onde as instâncias do servidor de Replicação por Grupo estão localizadas juntas e compartilham uma instância do motor de comunicação de grupo local (XCom), um canal de entrada dedicado com menor sobrecarga é usado para comunicação, quando possível, em vez do soquete TCP. Para certas tarefas de Replicação por Grupo que requerem comunicação entre instâncias remotas do XCom, como a adesão a um grupo, a rede TCP ainda é usada, portanto, o desempenho da rede influencia o desempenho do grupo.

#### Configuração da Instância do Servidor

As opções a seguir devem ser configuradas conforme mostrado nas instâncias do servidor que fazem parte de um grupo.

* **Identificador único do servidor.** Use a variável de sistema `server_id` para configurar o servidor com um ID de servidor único, conforme exigido para todos os servidores em topologias de replicação. O ID do servidor deve ser um número inteiro positivo entre 1 e (232)−1, e deve ser diferente de todos os outros IDs de servidor em uso por qualquer outro servidor na topologia de replicação.

* **Registro binário ativo.** Defina `--log-bin[=log_file_name]`. A partir do MySQL 8.0, o registro binário é ativado por padrão, e você não precisa especificar essa opção, a menos que queira alterar o nome dos arquivos de registro binário. A Replicação de grupo replica o conteúdo do registro binário, portanto, o registro binário precisa estar ativo para que ele opere. Veja a Seção 7.4.4, “O Registro Binário”.

* **Atualizações de réplica registradas.** Defina `log_replica_updates=ON` (do MySQL 8.0.26) ou `log_slave_updates=ON` (antes do MySQL 8.0.26). A partir do MySQL 8.0, este ajuste é o padrão, então você não precisa especificá-lo. Os membros do grupo precisam registrar transações que são recebidas de seus doadores no momento da adesão e aplicadas através do aplicativo de aplicação de replicação, e registrar todas as transações que eles recebem e aplicam do grupo. Isso permite que a Replicação de Grupo realize recuperação distribuída por transferência de estado de um registro binário de um membro existente do grupo.

* **Formato de linha de registro binário.** Defina `binlog_format=row`. Este ajuste é o padrão, então você não precisa especificá-lo. A Replicação por Grupo depende do formato de replicação baseado em linha para propagar as alterações de forma consistente entre os servidores do grupo e extrair as informações necessárias para detectar conflitos entre as transações que são executadas simultaneamente em diferentes servidores do grupo. A partir do MySQL 8.0.19, o ajuste `REQUIRE_ROW_FORMAT` é adicionado automaticamente aos canais da Replicação por Grupo para impor o uso de replicação baseada em linha quando as transações são aplicadas. Veja a Seção 19.2.1, “Formatos de Replicação” e a Seção 19.3.3, “Verificações de Privilégio de Replicação”.

* **Verificação de checksums de registro binário desativada (para MySQL 8.0.20).** Até e incluindo o MySQL 8.0.20, defina `binlog_checksum=NONE`. Nesses lançamentos, a Replicação de Grupo não pode utilizar checksums e não suporta sua presença no registro binário. A partir do MySQL 8.0.21, a Replicação de Grupo suporta checksums, então os membros do grupo podem usar o ajuste padrão `binlog_checksum=CRC32`, e você não precisa especificá-lo.

* **Identificador de Transação Global Ativado.** Defina `gtid_mode=ON` e `enforce_gtid_consistency=ON`. Esses ajustes não são os padrões. A replicação com base em identificadores de transação global é necessária para a Replicação de Grupo, que utiliza identificadores de transação global para rastrear as transações que foram comprometidas em todas as instâncias do servidor no grupo. Veja a Seção 19.1.3, “Replicação com Identificadores de Transação Global”.

Além disso, se você precisar definir o valor de `gtid_purged`, você deve fazer isso enquanto a Replicação em Grupo não estiver em execução.

* **Repositórios de Informações de Replicação.** Defina `master_info_repository=TABLE` e `relay_log_info_repository=TABLE`. No MySQL 8.0, esses ajustes são os padrão, e o ajuste `FILE` é desatualizado. A partir do MySQL 8.0.23, o uso dessas variáveis de sistema é desatualizado, então omita as variáveis de sistema e apenas permita o padrão. O aplicativo de replicação precisa ter os metadados de replicação escritos nas tabelas de sistema `mysql.slave_master_info` e `mysql.slave_relay_log_info` para garantir que o plugin de Replicação de Grupo tenha recuperação consistente e gerenciamento transacional dos metadados de replicação. Veja a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

* **Extração do Conjunto de Escrita de Transação.** Configure `transaction_write_set_extraction=XXHASH64` para que, ao coletar linhas e registrá-las no log binário, o servidor também colete o conjunto de escrita. No MySQL 8.0, este ajuste é o padrão, e a partir do MySQL 8.0.26, o uso da variável do sistema é desaconselhado. O conjunto de escrita é baseado nas chaves primárias de cada linha e é uma visão simplificada e compacta de uma etiqueta que identifica de forma única a linha que foi alterada. A Replicação em Grupo usa essas informações para detecção de conflitos e certificação em todos os membros do grupo.

* **Encriptação de tabela padrão.** Defina `default_table_encryption` com o mesmo valor em todos os membros do grupo. A encriptação do esquema e do espaço de tabela padrão pode ser habilitada (`ON`) ou desabilitada (`OFF`, o padrão), desde que o ajuste seja o mesmo em todos os membros.

O valor de `default_table_encryption` não pode ser alterado enquanto a Replicação em grupo estiver em execução.

* **Tabelas com nomes em minúsculas.** Defina `lower_case_table_names` com o mesmo valor em todos os membros do grupo. Um valor de 1 é correto para o uso do mecanismo de armazenamento `InnoDB`, que é necessário para a Replicação de Grupo. Observe que essa configuração não é a padrão em todas as plataformas.

* **Rastreamento de Dependência de Registro Binário.** Definir `binlog_transaction_dependency_tracking` como `WRITESET` pode melhorar o desempenho de um membro do grupo, dependendo da carga de trabalho do grupo. Embora a Replicação de Grupo realize sua própria paralelização após a certificação ao aplicar transações do registro de relevo, independentemente de qualquer valor definido para `binlog_transaction_dependency_tracking`, esse valor afeta a forma como as transações são escritas nos registros binários dos membros da Replicação de Grupo. As informações de dependência nesses registros são usadas para auxiliar o processo de transferência de estado para a recuperação distribuída a partir do registro binário de um doador, que ocorre sempre que um membro se junta ou se reinserta no grupo.

Nota

Quando `replica_preserve_commit_order` é `ON`, definir `binlog_transaction_dependency_tracking` para `WRITESET` tem o mesmo efeito que definí-lo para `WRITESET_SESSION`.

* **Aplicativos multithread.** Os membros da Replicação em grupo podem ser configurados como réplicas multithread, permitindo que as transações sejam aplicadas em paralelo. A partir do MySQL 8.0.27, todas as réplicas são configuradas como multithread padrão. Um valor não nulo para a variável do sistema `replica_parallel_workers` (a partir do MySQL 8.0.26) ou `slave_parallel_workers` (antes do MySQL 8.0.26) habilita o aplicador multithread no membro. A configuração padrão do MySQL 8.0.27 é 4 threads de aplicador paralelo, e até 1024 threads de aplicador paralelo podem ser especificados. Para uma réplica multithread, os seguintes ajustes também são necessários, que são os padrões do MySQL 8.0.27:

`replica_preserve_commit_order=ON` (do MySQL 8.0.26) ou `slave_preserve_commit_order=ON` (antes do MySQL 8.0.26):   Este ajuste é necessário para garantir que o compromisso final das transações paralelas esteja na mesma ordem que as transações originais. A Replicação em Grupo depende de mecanismos de consistência construídos em torno da garantia de que todos os membros participantes recebem e aplicam transações comprometidas na mesma ordem.

`replica_parallel_type=LOGICAL_CLOCK` (do MySQL 8.0.26) ou `slave_parallel_type=LOGICAL_CLOCK` (antes do MySQL 8.0.26):   Este ajuste é necessário com `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON`. Especifica a política usada para decidir quais transações são permitidas para executar em paralelo na replica.

Definindo `replica_parallel_workers=0` ou `slave_parallel_workers=0`, a execução paralela é desativada e a réplica recebe um único fio de aplicador e nenhum fio de coordenador. Com essa configuração, as opções `replica_parallel_type` ou `slave_parallel_type` e `replica_preserve_commit_order` ou `slave_preserve_commit_order` não têm efeito e são ignoradas. A partir do MySQL 8.0.27, se a execução paralela for desativada quando GTIDs estão em uso em uma réplica, a réplica, na verdade, usa um trabalhador paralelo, para aproveitar o método para refazer transações sem acessar as posições do arquivo. No entanto, esse comportamento não altera nada para o usuário.

* Transações XA separadas. O MySQL 8.0.29 e versões posteriores suportam transações XA separadas. Uma transação separada é aquela que, uma vez preparada, não está mais conectada à sessão atual. Isso acontece automaticamente como parte da execução de `XA PREPARE`(xa-statements.html "15.3.8.1 XA Transaction SQL Statements"). A transação XA preparada pode ser comprometida ou desfeita por outra conexão, e a sessão atual pode então iniciar outra transação XA ou transação local sem esperar que a transação que foi preparada apenas tenha sido concluída.

Quando o suporte a transações XA desvinculadas é habilitado (`xa_detach_on_prepare = ON`) é possível que qualquer conexão neste servidor liste (usando `XA RECOVER` (xa-statements.html "15.3.8.1 XA Transaction SQL Statements")), desconsidere ou realize qualquer transação preparada XA. Além disso, você não pode usar tabelas temporárias dentro de transações XA desvinculadas.

Você pode desativar o suporte para transações XA desvinculadas definindo `xa_detach_on_prepare` como `OFF`, mas isso não é recomendado. Em particular, se este servidor estiver sendo configurado como uma instância na replicação do grupo MySQL, você deve deixar essa variável definida no seu valor padrão (`ON`).

Veja a Seção 15.3.8.2, “Estados de Transação XA”, para mais informações.

### 20.3.2 Limitações da Replicação em Grupo

* Limite de tamanho do grupo * Limites de tamanho da transação

As seguintes limitações conhecidas existem para a Replicação em Grupo. Note que as limitações e problemas descritos para grupos em modo multi-primário também podem se aplicar em clústeres em modo único-primário durante um evento de falha, enquanto o primário recém-eleito esvazia sua fila de aplicador do primário antigo.

Dica

A Replicação em Grupo é construída sobre a replicação baseada em GTID, portanto, você também deve estar ciente da Seção 19.1.3.7, “Restrições sobre Replicação com GTIDs”.

* **Opção `--upgrade=MINIMAL`.** A Replicação em grupo não pode ser iniciada após uma atualização do servidor MySQL que utiliza a opção MINIMAL (`--upgrade=MINIMAL`, que não atualiza as tabelas do sistema nas quais dependem os recursos internos da replicação.

* **Blocos de lacuna.** O processo de certificação do Grupo de Replicação para transações concorrentes não leva em conta os blocos de lacuna, pois as informações sobre blocos de lacuna não estão disponíveis fora de `InnoDB`. Consulte Blocos de lacuna para obter mais informações.

Nota

Para um grupo no modo multi-primaria, a menos que você confie na semântica `REPEATABLE READ` em seus aplicativos, recomendamos o uso do nível de isolamento `READ COMMITTED` com a Replicação de Grupo. O InnoDB não usa bloqueios de lacuna em `READ COMMITTED`, o que alinha a detecção de conflitos local dentro do InnoDB com a detecção de conflitos distribuída realizada pela Replicação de Grupo. Para um grupo no modo de único primário, apenas o primário aceita escritas, então o nível de isolamento [`READ COMMITTED`(innodb-transaction-isolation-levels.html#isolevel_read-committed) não é importante para a Replicação de Grupo.

* **Blocos de tabela e blocos nomeados.** O processo de certificação não leva em conta os blocos de tabela (consulte a Seção 15.3.6, "Instruções LOCK TABLES e UNLOCK TABLES") ou blocos nomeados (consulte `GET_LOCK()`).

* **Checksums de registro binário.** Até e incluindo o MySQL 8.0.20, a Replicação por Grupo não pode utilizar checksums e não suporta sua presença no registro binário, portanto, você deve definir `binlog_checksum=NONE` ao configurar uma instância do servidor para se tornar um membro do grupo. A partir do MySQL 8.0.21, a Replicação por Grupo suporta checksums, portanto, os membros do grupo podem usar o ajuste padrão `binlog_checksum=CRC32`. O ajuste para `binlog_checksum` não precisa ser o mesmo para todos os membros de um grupo.

Quando os checksums estão disponíveis, a Replicação em Grupo não os utiliza para verificar eventos recebidos no canal `group_replication_applier`, porque os eventos são escritos nesse log do relé a partir de várias fontes e antes de serem realmente escritos no log binário do servidor original, que é quando um checksum é gerado. Os checksums são usados para verificar a integridade dos eventos no canal `group_replication_recovery` e em quaisquer outros canais de replicação nos membros do grupo.

* **Nível de isolamento SERIALIZABLE.** O nível de isolamento `SERIALIZABLE` não é suportado por padrão em grupos multi-primárias. Configurar o nível de isolamento de transação para `SERIALIZABLE` configura a Replicação de Grupo para recusar o compromisso da transação.

* **Operações de DDL concorrentes versus operações de DML.** Declarações de definição de dados concorrentes e declarações de manipulação de dados que executam contra o mesmo objeto, mas em servidores diferentes, não são suportadas ao usar o modo multi-primário. Durante a execução de declarações de Linguagem de Definição de Dados (DDL) em um objeto, executar declarações de Linguagem de Manipulação de Dados (DML) concorrentes no mesmo objeto, mas em uma instância diferente do servidor, corre o risco de não ser detectado que o DDL em execução em diferentes instâncias está em conflito.

* **Chaves Estrangeiras com Restrições de Cascagem.** Grupos de modo multi-primário (membros configurados todos com `group_replication_single_primary_mode=OFF`) não suportam tabelas com dependências de chave estrangeira de vários níveis, especificamente tabelas que têm definido `CASCADING` [restrições de chave estrangeira](glossary.html#glos_foreign_key_constraint "FOREIGN KEY constraint"). Isso ocorre porque as restrições de chave estrangeira que resultam em operações de casca executadas por um grupo de modo multi-primário podem resultar em conflitos não detectados e levar a dados inconsistentes entre os membros do grupo. Portanto, recomendamos definir `group_replication_enforce_update_everywhere_checks=ON` em instâncias do servidor usadas em grupos de modo multi-primário para evitar conflitos não detectados.

No modo de primário único, isso não é um problema, pois não permite gravações concorrentes em vários membros do grupo, e, portanto, não há risco de conflitos não detectados.

* **Modo Deadlock de múltiplos primários.** Quando um grupo está operando no modo multi-primário, as declarações `SELECT .. FOR UPDATE` podem resultar em um deadlock. Isso ocorre porque o bloqueio não é compartilhado entre os membros do grupo, portanto, a expectativa para tal declaração pode não ser alcançada.

* **Filtros de replicação.** Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

* **Conexões Encriptadas.** O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL tenha sido compilado usando OpenSSL 1.1.1 ou superior. No MySQL 8.0.16 e no MySQL 8.0.17, se o servidor suportar TLSv1.3, o protocolo não é suportado no motor de comunicação de grupo e não pode ser usado pela Replicação de Grupo. A Replicação de Grupo suporta TLSv1.3 a partir do MySQL 8.0.18, onde pode ser usado para conexões de comunicação de grupo e conexões de recuperação distribuídas.

No MySQL 8.0.18, o TLSv1.3 pode ser usado na Replicação por Grupo para a conexão de recuperação distribuída, mas as variáveis de sistema `group_replication_recovery_tls_version` e `group_replication_recovery_tls_ciphersuites` não estão disponíveis. Portanto, os servidores doadores devem permitir o uso de pelo menos um conjunto de cifras TLSv1.3 que seja habilitado por padrão, conforme listado na Seção 8.3.2, "Protocolos e cifras de conexão TLS criptografadas". A partir do MySQL 8.0.19, você pode usar as opções para configurar o suporte ao cliente para qualquer seleção de conjuntos de cifras, incluindo apenas conjuntos de cifras não padrão, se desejar.

* **Operações de Clonagem.** A Replicação em Grupo inicia e gerencia operações de clonagem para recuperação distribuída, mas os membros do grupo que foram configurados para suportar clonagem também podem participar de operações de clonagem que um usuário inicia manualmente. Em versões anteriores ao MySQL 8.0.20, você não pode iniciar uma operação de clonagem manualmente se a operação envolver um membro do grupo em que a Replicação em Grupo está em execução. A partir do MySQL 8.0.20, você pode fazer isso, desde que a operação de clonagem não remova e não substitua os dados do destinatário. A declaração para iniciar a operação de clonagem deve, portanto, incluir a cláusula `DATA DIRECTORY` se a Replicação em Grupo estiver em execução. Veja a Seção 20.5.4.2.4, “Clonagem para Outros Propósitos”.

#### Limite de tamanho do grupo

O número máximo de servidores MySQL que podem ser membros de um único grupo de replicação é de 9. Se mais membros tentarem se juntar ao grupo, seu pedido será recusado. Esse limite foi identificado por meio de testes e benchmarks como um limite seguro onde o grupo funciona de forma confiável em uma rede local estável.

#### Limites do tamanho da transação

Se uma transação individual resultar em conteúdos de mensagem que são grandes o suficiente para que a mensagem não possa ser copiada entre os membros do grupo pela rede em uma janela de 5 segundos, os membros podem ser suspeitos de terem falhado e, em seguida, expulsos, apenas porque estão ocupados processando a transação. Grandes transações também podem fazer com que o sistema fique lento devido a problemas com alocação de memória. Para evitar esses problemas, use as seguintes mitigações:

* Se ocorrerem expulsões desnecessárias devido a mensagens grandes, use a variável do sistema `group_replication_member_expel_timeout` para permitir um tempo adicional antes de um membro sob suspeita de ter falhado ser expulso. Você pode permitir até uma hora após o período inicial de detecção de 5 segundos antes de um membro suspeito ser expulso do grupo. A partir do MySQL 8.0.21, um adicional de 5 segundos é permitido por padrão.

* Quando possível, tente limitar o tamanho das suas transações antes de elas serem manipuladas pela Replicação do Grupo. Por exemplo, divida os arquivos usados com `LOAD DATA` em partes menores.

* Use a variável de sistema `group_replication_transaction_size_limit` para especificar o tamanho máximo de transação que o grupo aceita. No MySQL 8.0, essa variável de sistema tem como padrão um tamanho máximo de transação de 15.000.000 bytes (aproximadamente 143 MB). Transações acima desse tamanho são revertidas e não são enviadas ao Sistema de Comunicação do Grupo (GCS) da Replicação do Grupo para distribuição ao grupo. Ajuste o valor dessa variável de acordo com o tamanho máximo da mensagem que o grupo precisa tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho.

* Use a variável de sistema `group_replication_compression_threshold` para especificar um tamanho de mensagem acima do qual a compressão é aplicada. Essa variável de sistema tem como padrão 1.000.000 de bytes (1 MB), portanto, mensagens grandes são automaticamente comprimidas. A compressão é realizada pelo Sistema de Comunicação de Grupo (GCS) da Replicação em Grupo quando ele recebe uma mensagem que foi permitida pela configuração `group_replication_transaction_size_limit`, mas excede a configuração `group_replication_compression_threshold`. Para mais informações, consulte a Seção 20.7.4, “Compressão de Mensagens”.

* Use a variável de sistema `group_replication_communication_max_message_size` para especificar um tamanho de mensagem acima do qual as mensagens são fragmentadas. Esta variável de sistema tem como padrão 10485760 bytes (10 MiB), portanto, mensagens grandes são automaticamente fragmentadas. O GCS realiza a fragmentação após a compressão se a mensagem comprimida ainda exceder o limite `group_replication_communication_max_message_size`. Para que um grupo de replicação possa usar fragmentação, todos os membros do grupo devem estar no MySQL 8.0.16 ou superior, e a versão do protocolo de comunicação de Replicação de Grupo utilizada pelo grupo deve permitir a fragmentação. Para mais informações, consulte a Seção 20.7.5, “Fragmentação de Mensagens”.

O tamanho máximo da transação, a compressão de mensagens e a fragmentação de mensagens podem ser desativados especificando um valor zero para a variável do sistema relevante. Se você desativou todas essas proteções, o limite máximo de tamanho para uma mensagem que pode ser tratada pelo thread do aplicável em um membro de um grupo de replicação é o valor da variável do sistema `replica_max_allowed_packet` ou `slave_max_allowed_packet` do membro, que têm um valor padrão e máximo de 1073741824 bytes (1 GB). Uma mensagem que excede esse limite falha quando o membro receptor tenta tratá-la. O limite máximo de tamanho para uma mensagem que um membro do grupo pode originar e tentar transmitir para o grupo é de 4294967295 bytes (aproximadamente 4 GB). Esse é um limite rígido no tamanho do pacote que é aceito pelo motor de comunicação do grupo para a Replicação de Grupo (XCom, uma variante Paxos), que recebe mensagens após o GCS as ter tratadas. Uma mensagem que excede esse limite falha quando o membro originador tenta transmiti-la.