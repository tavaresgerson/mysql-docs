### 17.3.1 Requisitos de Replicação em Grupo

As instâncias do servidor que você deseja usar para a Replicação em Grupo devem atender aos seguintes requisitos.

#### Infraestrutura

- **Motor de Armazenamento InnoDB.** Os dados devem ser armazenados no motor de armazenamento transacional `InnoDB`. As transações são executadas de forma otimista e, em seguida, no momento do commit, são verificadas quanto a conflitos. Se houver conflitos, para manter a consistência em todo o grupo, algumas transações são revertidas. Isso significa que é necessário um motor de armazenamento transacional. Além disso, `InnoDB` oferece algumas funcionalidades adicionais que permitem uma melhor gestão e tratamento de conflitos ao operar junto com a Replicação de Grupo. O uso de outros motores de armazenamento, incluindo o temporário `MEMORY`, pode causar erros na Replicação de Grupo. Converta todas as tabelas em outros motores de armazenamento para usar `InnoDB` antes de usar a instância com a Replicação de Grupo. Você pode impedir o uso de outros motores de armazenamento configurando a variável de sistema `disabled_storage_engines` nos membros do grupo, por exemplo:

  ```sql
  disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
  ```

- **Chaves Primárias.** Toda tabela que será replicada pelo grupo deve ter uma chave primária definida, ou uma chave primária equivalente, onde a equivalente é uma chave única não nula. Tais chaves são necessárias como um identificador único para cada linha dentro de uma tabela, permitindo que o sistema determine quais transações entram em conflito, identificando exatamente quais linhas cada transação modificou.

- **Rede IPv4.** O mecanismo de comunicação em grupo utilizado pelo MySQL Group Replication suporta apenas IPv4. Portanto, a Replicação em Grupo requer uma infraestrutura de rede IPv4.

- **Desempenho da rede.** A Replicação em Grupo do MySQL é projetada para ser implantada em um ambiente de cluster, onde as instâncias do servidor estão muito próximas umas das outras. O desempenho e a estabilidade de um grupo podem ser impactados tanto pela latência da rede quanto pela largura de banda da rede. A comunicação bidirecional deve ser mantida em todos os momentos entre todos os membros do grupo. Se a comunicação de entrada ou saída for bloqueada para uma instância do servidor (por exemplo, por um firewall ou por problemas de conectividade), o membro não poderá funcionar no grupo, e os membros do grupo (incluindo o membro com problemas) podem não ser capazes de relatar o status correto do membro para a instância do servidor afetada.

#### Configuração da Instância do Servidor

As seguintes opções devem ser configuradas nas instâncias do servidor que são membros de um grupo.

- **Identificador de servidor único.** Use a variável de sistema `server_id` para configurar o servidor com um ID de servidor único, conforme exigido para todos os servidores em topologias de replicação. Com o ID de servidor padrão de 0, os servidores em uma topologia de replicação não podem se conectar uns aos outros. O ID do servidor deve ser um número inteiro positivo entre 1 e (232) - 1, e deve ser diferente de todos os outros IDs de servidor em uso por qualquer outro servidor na topologia de replicação.

- **Registro Binário Ativo.** Defina `--log-bin[=log_file_name]`. A Replicação do Grupo MySQL replica o conteúdo do registro binário, portanto, o registro binário precisa estar ativo para que ele funcione. Esta opção está habilitada por padrão. Veja Seção 5.4.4, “O Registro Binário”.

- **Atualizações de réplica registradas.** Defina `--log-slave-updates`. Os servidores precisam registrar logs binários que são aplicados pelo aplicativo de replicação. Os servidores do grupo precisam registrar todas as transações que recebem e aplicarem do grupo. Isso é necessário porque a recuperação é realizada com base em logs binários dos participantes do grupo. Portanto, cópias de cada transação precisam existir em cada servidor, mesmo para aquelas transações que não foram iniciadas no próprio servidor.

- **Formato de linha do log binário.** Defina `--binlog-format=row`. A replicação por grupo depende do formato de replicação baseado em linhas para propagar as alterações de forma consistente entre os servidores do grupo. Ela depende de uma infraestrutura baseada em linhas para poder extrair as informações necessárias para detectar conflitos entre as transações que são executadas simultaneamente em diferentes servidores do grupo. Veja Seção 16.2.1, “Formatos de replicação”.

- **Verificação de checksums de log binário desativada.** Defina [`--binlog-checksum=NONE`](https://replication-options-binary-log.html#sysvar_binlog_checksum). Devido a uma limitação de design dos checksums de eventos de replicação, a Replicação em Grupo não pode usá-los e eles devem ser desativados.

- **Identificadores de Transações Globais Ativados.** Defina `gtid_mode=ON` e `enforce_gtid_consistency=ON`. A replicação em grupo usa identificadores de transações globais para rastrear exatamente quais transações foram comprometidas em cada instância do servidor e, assim, ser capaz de inferir quais servidores executaram transações que poderiam entrar em conflito com transações já comprometidas em outros lugares. Em outras palavras, identificadores de transações explícitos são uma parte fundamental do framework para poder determinar quais transações podem entrar em conflito. Veja Seção 16.1.3, “Replicação com Identificadores de Transações Globais”.

  Além disso, se você precisar definir o valor de `gtid_purged`, você deve fazer isso enquanto a Replicação por Grupo não estiver em execução.

- **Repositórios de Informações de Replicação.** Defina `master_info_repository=TABLE` e `relay_log_info_repository=TABLE`. O aplicativo de replicação precisa ter os metadados da fonte e da replica escritos nas tabelas de sistema `mysql.slave_master_info` e `mysql.slave_relay_log_info`. Isso garante que o plugin de Replicação em Grupo tenha uma recuperação consistente e gerenciamento transacional dos metadados da replicação. Veja Seção 16.2.4.2, “Repositórios de Metadados de Replicação”.

- **Extração do Conjunto de Escrita de Transação.** Defina `--transaction-write-set-extraction=XXHASH64` para que, ao coletar linhas para registrá-las no log binário, o servidor também colete o conjunto de escrita. O conjunto de escrita é baseado nas chaves primárias de cada linha e é uma visão simplificada e compacta de um rótulo que identifica de forma única a linha que foi alterada. Esse rótulo é então usado para detectar conflitos.

- **Nomes de tabelas em minúsculas.** Defina `--lower-case-table-names` com o mesmo valor em todos os membros do grupo. Um valor de 1 é correto para o uso do motor de armazenamento `InnoDB`, que é necessário para a Replicação de Grupo. Observe que essa configuração não é a padrão em todas as plataformas.

- **Aplicativos multithreads.** Os membros da Replicação em Grupo podem ser configurados como réplicas multithreads, permitindo que as transações sejam aplicadas em paralelo. Um valor diferente de zero para `slave_parallel_workers` habilita o aplicativo multithreads no membro, e até 1024 threads de aplicativo paralelos podem ser especificados. Se você fizer isso, as seguintes configurações também são necessárias:

  `slave_preserve_commit_order=1` :   Esta configuração é necessária para garantir que o commit final das transações paralelas esteja na mesma ordem que as transações originais. A replicação em grupo depende de mecanismos de consistência construídos em torno da garantia de que todos os membros participantes recebam e apliquem as transações confirmadas na mesma ordem.

  `slave_parallel_type=CLOCK_LOGICAL`:   Esta configuração é necessária com `slave_preserve_commit_order=1`. Especifica a política usada para decidir quais transações são permitidas para serem executadas em paralelo na replica.

  Definir [`slave_parallel_workers=0`](https://pt.wikipedia.org/wiki/Replicação_\(computação_distribuída\)#Op%C3%A7%C3%B5es_de_replicac%C3%A3o.html#sysvar_slave_parallel_workers) desativa a execução paralela e dá à replica um único thread de aplicador e nenhum thread de coordenador. Com essa configuração, as opções [`slave_parallel_type`](https://pt.wikipedia.org/wiki/Replicação_\(computação_distribuída\)#Op%C3%A7%C3%B5es_de_replicac%C3%A3o.html#sysvar_slave_parallel_type) e [`slave_preserve_commit_order`](https://pt.wikipedia.org/wiki/Replicação_\(computação_distribuída\)#Op%C3%A7%C3%B5es_de_replicac%C3%A3o.html#sysvar_slave_preserve_commit_order) não têm efeito e são ignoradas.
