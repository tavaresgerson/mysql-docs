## 17.3 Requisitos e Limitações

Esta seção lista e explica os requisitos e limitações da Replicação em Grupo.

### 17.3.1 Requisitos de Replicação em Grupo

As instâncias do servidor que você deseja usar para a Replicação em Grupo devem atender aos seguintes requisitos.

#### Infraestrutura

* **Engenho de Armazenamento InnoDB.** Os dados devem ser armazenados no `InnoDB` engenho de armazenamento transacional. As transações são executadas otimisticamente e, em seguida, no momento do commit, são verificadas quanto a conflitos. Se houver conflitos, para manter a consistência em todo o grupo, algumas transações são revertidas. Isso significa que é necessário um engenho de armazenamento transacional. Além disso, o `InnoDB` oferece algumas funcionalidades adicionais que permitem uma melhor gestão e tratamento de conflitos ao operar em conjunto com a Replicação de Grupo. O uso de outros engenhos de armazenamento, incluindo o temporário `MEMORY`, pode causar erros na Replicação de Grupo. Converta todas as tabelas em outros engenhos de armazenamento para usar o `InnoDB` antes de usar a instância com Replicação de Grupo. Você pode impedir o uso de outros engenhos de armazenamento definindo a variável de sistema `disabled_storage_engines` nos membros do grupo, por exemplo:

  ```sql
  disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
  ```

* **Chaves primárias.** Toda tabela que deve ser replicada pelo grupo deve ter uma chave primária definida, ou equivalente de chave primária, onde o equivalente é uma chave única não nula. Tais chaves são necessárias como um identificador único para cada string dentro de uma tabela, permitindo que o sistema determine quais transações entram em conflito, identificando exatamente quais strings cada transação modificou.

* **Rede IPv4.** O motor de comunicação em grupo utilizado pelo MySQL Group Replication suporta apenas IPv4. Portanto, o Grupo de Replicação requer uma infraestrutura de rede IPv4.

* **Desempenho da rede.** A Replicação em Grupo do MySQL é projetada para ser implantada em um ambiente de clúster, onde as instâncias do servidor estão muito próximas umas das outras. O desempenho e a estabilidade de um grupo podem ser impactados tanto pela latência da rede quanto pela largura de banda da rede. A comunicação bidirecional deve ser mantida em todos os momentos entre todos os membros do grupo. Se a comunicação de entrada ou saída for bloqueada para uma instância do servidor (por exemplo, por um firewall ou por problemas de conectividade), o membro não poderá funcionar no grupo, e os membros do grupo (incluindo o membro com problemas) podem não ser capazes de relatar o status correto do membro para a instância do servidor afetada.

#### Configuração da Instância do Servidor

As seguintes opções devem ser configuradas nas instâncias do servidor que são membros de um grupo.

* **Identificador único do servidor.** Use a variável de sistema `server_id` para configurar o servidor com um ID de servidor único, conforme exigido para todos os servidores em topologias de replicação. Com o ID de servidor padrão de 0, os servidores em uma topologia de replicação não podem se conectar entre si. O ID do servidor deve ser um número inteiro positivo entre 1 e (232) - 1, e deve ser diferente de todos os outros IDs de servidor em uso por qualquer outro servidor na topologia de replicação.

* **Diário binário ativo.** Defina `--log-bin[=log_file_name]`. A replicação do grupo de MySQL do diário binário replica o conteúdo do diário binário, portanto, o diário binário precisa estar ativo para que ele opere. Esta opção é habilitada por padrão. Veja a Seção 5.4.4, “O Diário Binário”.

* **Atualizações de réplica registradas.** Defina `--log-slave-updates`. Os servidores precisam registrar logs binários que são aplicados através do aplicativo de aplicação de replicação. Os servidores do grupo precisam registrar todas as transações que recebem e aplicam do grupo. Isso é necessário porque a recuperação é conduzida confiando em logs binários dos participantes do grupo. Portanto, cópias de cada transação precisam existir em cada servidor, mesmo para aquelas transações que não foram iniciadas no próprio servidor.

* **Formato de string do registro binário.** Defina `--binlog-format=row`. A Replicação por grupo depende do formato de replicação baseado em string para propagar as alterações de forma consistente entre os servidores do grupo. Depende de uma infraestrutura baseada em string para poder extrair as informações necessárias para detectar conflitos entre as transações que são executadas simultaneamente em diferentes servidores do grupo. Consulte a Seção 16.2.1, “Formatos de replicação”.

* **Verificação de checksums de registro binário desativada.** Defina `--binlog-checksum=NONE`. Devido a uma limitação de design dos checksums de eventos de replicação, a Replicação em Grupo não pode utilizá-los, e eles devem ser desativados.

* **Identificadores de Transações Globais Ativados.** Defina `gtid_mode=ON` e `enforce_gtid_consistency=ON`. A Replicação em Grupo utiliza identificadores de transações globais para rastrear exatamente quais transações foram comprometidas em cada instância do servidor e, assim, ser capaz de inferir quais servidores executaram transações que poderiam entrar em conflito com transações já comprometidas em outros lugares. Em outras palavras, identificadores explícitos de transações são uma parte fundamental do quadro para poder determinar quais transações podem entrar em conflito. Veja a Seção 16.1.3, “Replicação com Identificadores de Transações Globais”.

Além disso, se você precisar definir o valor de `gtid_purged`, você deve fazer isso enquanto a Replicação em Grupo não estiver em execução.

* **Repositórios de Informações de Replicação.** Defina `master_info_repository=TABLE` e `relay_log_info_repository=TABLE`. O aplicativo de replicação precisa ter os metadados da fonte e da replica escritos nas tabelas de sistema `mysql.slave_master_info` e `mysql.slave_relay_log_info`. Isso garante que o plugin de Replicação de Grupo tenha recuperação consistente e gerenciamento transacional dos metadados de replicação. Veja a Seção 16.2.4.2, “Repositórios de Metadados de Replicação”.

* **Extração do Conjunto de Escrita de Transação.** Configure `--transaction-write-set-extraction=XXHASH64` para que, ao coletar strings e registrá-las no log binário, o servidor também colete o conjunto de escrita. O conjunto de escrita é baseado nas chaves primárias de cada string e é uma visão simplificada e compacta de uma etiqueta que identifica de forma única a string que foi alterada. Essa etiqueta é, então, usada para detectar conflitos.

* **Tabelas com nomes em minúsculas.** Defina `--lower-case-table-names` com o mesmo valor em todos os membros do grupo. Um valor de 1 é correto para o uso do mecanismo de armazenamento `InnoDB`, que é necessário para a Replicação de Grupo. Observe que essa configuração não é a padrão em todas as plataformas.

* **Aplicativos multifilares.** Os membros da Replicação em grupo podem ser configurados como réplicas multifilares, permitindo que as transações sejam aplicadas em paralelo. Um valor não nulo para `slave_parallel_workers` habilita o aplicador multifilares no membro, e até 1024 threads de aplicador paralelos podem ser especificados. Se você fizer isso, os seguintes ajustes também são necessários:

`slave_preserve_commit_order=1` :   Este ajuste é necessário para garantir que o compromisso final das transações paralelas esteja na mesma ordem que as transações originais. A Replicação em Grupo depende de mecanismos de consistência construídos em torno da garantia de que todos os membros participantes recebam e apliquem as transações comprometidas na mesma ordem.

`slave_parallel_type=LOGICAL_CLOCK` :   Este ajuste é necessário com `slave_preserve_commit_order=1`. Especifica a política usada para decidir quais transações são permitidas para executar em paralelo na replica.

A definição de `slave_parallel_workers=0` desativa a execução paralela e dá à replica um único thread de aplicador e nenhum thread de coordenador. Com essa definição, as opções `slave_parallel_type` e `slave_preserve_commit_order` não têm efeito e são ignoradas.

### 17.3.2 Limitações da Replicação em Grupo

As seguintes limitações conhecidas existem para a Replicação em Grupo. Note que as limitações e problemas descritos para grupos em modo multi-primário também podem se aplicar em clústeres em modo único-primário durante um evento de falha, enquanto o primário recém-eleito esvazia sua fila de aplicador do primário antigo.

Dica

A Replicação em Grupo é construída sobre a replicação baseada em GTID, portanto, você também deve estar ciente da Seção 16.1.3.6, “Restrições sobre Replicação com GTIDs”.

* **Blocos de lacuna.** O processo de certificação do Grupo de Replicação para transações concorrentes não leva em conta os blocos de lacuna, pois as informações sobre blocos de lacuna não estão disponíveis fora de `InnoDB`. Consulte Blocos de lacuna para obter mais informações.

Nota

Para um grupo no modo multi-primaria, a menos que você se baseie na semântica `REPEATABLE READ` em seus aplicativos, recomendamos o uso do nível de isolamento `READ COMMITTED` com Replicação de Grupo. O InnoDB não usa bloqueios de lacuna em `READ COMMITTED`, o que alinha a detecção de conflitos local dentro do InnoDB com a detecção de conflitos distribuída realizada pela Replicação de Grupo. Para um grupo no modo single-primary, apenas o primário aceita escritas, então o nível de isolamento `READ COMMITTED` não é importante para a Replicação de Grupo.

* **Blocos de tabela e blocos nomeados.** O processo de certificação não leva em conta os blocos de tabela (consulte a Seção 13.3.5, "Instruções LOCK TABLES e UNLOCK TABLES") ou blocos nomeados (consulte `GET_LOCK()`).

* **Checksums de eventos de replicação.** Devido a uma limitação de design dos checksums de eventos de replicação, a Replicação por Grupo não pode atualmente utilizá-los. Portanto, defina `--binlog-checksum=NONE`.

* **Nível de isolamento SERIALIZABLE.** O nível de isolamento `SERIALIZABLE` não é suportado por padrão em grupos multi-primárias. Configurar o nível de isolamento de transação para `SERIALIZABLE` configura a Replicação de Grupo para recusar o compromisso da transação.

* **Operações de DDL concorrentes versus operações de DML.** Declarações de definição de dados concorrentes e declarações de manipulação de dados que executam contra o mesmo objeto, mas em servidores diferentes, não são suportadas ao usar o modo multi-primário. Durante a execução de declarações de Linguagem de Definição de Dados (DDL) em um objeto, executar declarações de Linguagem de Manipulação de Dados (DML) concorrentes no mesmo objeto, mas em uma instância diferente do servidor, corre o risco de não ser detectado que o DDL em execução em diferentes instâncias está em conflito.

* **Chaves Estrangeiras com Restrições de Cascagem.** Grupos de modo multi-primário (membros configurados todos com `group_replication_single_primary_mode=OFF`) não suportam tabelas com dependências de chave estrangeira de vários níveis, especificamente tabelas que têm restrições de chave estrangeira `CASCADING` definidas. Isso ocorre porque as restrições de chave estrangeira que resultam em operações de casca executadas por um grupo de modo multi-primário podem resultar em conflitos não detectados e levar a dados inconsistentes entre os membros do grupo. Portanto, recomendamos definir `group_replication_enforce_update_everywhere_checks=ON` em instâncias do servidor usadas em grupos de modo multi-primário para evitar conflitos não detectados.

No modo de primário único, isso não é um problema, pois não permite gravações concorrentes em vários membros do grupo, e, portanto, não há risco de conflitos não detectados.

* **MySQL Enterprise Audit e MySQL Enterprise Firewall.** Antes da versão 5.7.21, o MySQL Enterprise Audit e o MySQL Enterprise Firewall utilizam as tabelas `MyISAM` no banco de dados do sistema `mysql`. A Replicação de grupo não suporta as tabelas `MyISAM`.

* **Modo Deadlock de múltiplos primários.** Quando um grupo está operando no modo multi-primário, as declarações `SELECT .. FOR UPDATE` podem resultar em um deadlock. Isso ocorre porque o bloqueio não é compartilhado entre os membros do grupo, portanto, a expectativa para tal declaração pode não ser alcançada.

* **Filtros de replicação.** Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

#### Limite de tamanho do grupo

O número máximo de servidores MySQL que podem ser membros de um único grupo de replicação é de 9. Se mais membros tentarem se juntar ao grupo, seu pedido será recusado. Esse limite foi identificado por meio de testes e benchmarks como um limite seguro onde o grupo funciona de forma confiável em uma rede local estável.

#### Limites do tamanho da transação

Se uma transação individual resultar em conteúdos de mensagem que são grandes o suficiente para que a mensagem não possa ser copiada entre os membros do grupo pela rede em uma janela de 5 segundos, os membros podem ser suspeitos de terem falhado e, em seguida, expulsos, apenas porque estão ocupados processando a transação. Grandes transações também podem fazer com que o sistema fique lento devido a problemas com alocação de memória. Para evitar esses problemas, use as seguintes mitigações:

* Quando possível, tente limitar o tamanho das suas transações. Por exemplo, divida os arquivos usados com `LOAD DATA` em partes menores.

* Use a variável de sistema `group_replication_transaction_size_limit` para especificar o tamanho máximo da transação que o grupo aceita. Em versões até e incluindo o MySQL 5.7.37, essa variável de sistema tem como padrão zero, mas a partir do MySQL 5.7.38 e no MySQL 8.0, ela tem como padrão um tamanho máximo de transação de 15.000.000 bytes (aproximadamente 143 MB). As transações acima desse limite são revertidas e não são enviadas para o Sistema de Comunicação do Grupo (GCS) da Replicação do Grupo (Group Replication's Group Communication System) para distribuição para o grupo. Ajuste o valor dessa variável de acordo com o tamanho máximo da mensagem que o grupo precisa tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho.

Nota

Quando você faz uma atualização do MySQL 5.7.37 ou anterior para o MySQL 5.7.38 ou posterior, se seus servidores de Replicação de Grupo anteriormente aceitavam transações maiores que o novo limite padrão, e você estava permitindo que `group_replication_transaction_size_limit` defaultasse para o limite zero antigo, essas transações começarão a falhar após a atualização para o novo limite padrão. Você deve especificar um limite de tamanho apropriado que permita o tamanho máximo de mensagem que o grupo precisa tolerar (que é a solução recomendada), ou especificar um valor zero para restaurar o comportamento anterior.

* Use a variável de sistema `group_replication_compression_threshold` para especificar um tamanho de mensagem acima do qual a compressão é aplicada. Essa variável de sistema tem como padrão 1.000.000 de bytes (1 MB), portanto, mensagens grandes são automaticamente comprimidas. A compressão é realizada pelo Sistema de Comunicação de Replicação por Grupo (GCS) do Grupo de Replicação quando ele recebe uma mensagem que foi permitida pela configuração `group_replication_transaction_size_limit`, mas excede a configuração `group_replication_compression_threshold`. Se você definir o valor da variável de sistema para zero, a compressão é desativada. Para mais informações, consulte a Seção 17.9.7.2, “Compressão de Mensagens”.

Se você desativou a compressão de mensagens e não especificar um tamanho máximo de transação, o limite máximo de tamanho para uma mensagem que pode ser tratada pelo thread do aplicável em um membro de um grupo de replicação é o valor da variável de sistema `slave_max_allowed_packet` do membro, que tem um valor padrão e máximo de 1073741824 bytes (1 GB). Uma mensagem que excede esse limite falha quando o membro receptor tenta tratá-la. O limite máximo de tamanho para uma mensagem que um membro do grupo pode originar e tentar transmitir para o grupo é de 4294967295 bytes (aproximadamente 4 GB). Esse é um limite rígido no tamanho do pacote que é aceito pelo motor de comunicação do grupo para a Replicação de Grupo (XCom, uma variante Paxos), que recebe mensagens após o GCS as ter tratadas. Uma mensagem que excede esse limite falha quando o membro originador tenta transmiti-la.