### 20.3.1 Requisitos de Replicação em Grupo

- Infraestrutura
- Configuração da Instância do Servidor

As instâncias do servidor que você deseja usar para a Replicação em Grupo devem atender aos seguintes requisitos.

#### Infraestrutura

- **Motor de Armazenamento InnoDB.** Os dados devem ser armazenados no motor de armazenamento transacional `InnoDB`. As transações são executadas de forma otimista e, em seguida, no momento do commit, são verificadas quanto a conflitos. Se houver conflitos, para manter a consistência em todo o grupo, algumas transações são revertidas. Isso significa que é necessário um motor de armazenamento transacional. Além disso, `InnoDB` fornece algumas funcionalidades adicionais que permitem uma melhor gestão e tratamento de conflitos ao operar em conjunto com a Replicação de Grupo. O uso de outros motores de armazenamento, incluindo o motor de armazenamento temporário `MEMORY`, pode causar erros na Replicação de Grupo. Converta quaisquer tabelas em outros motores de armazenamento para usar `InnoDB` antes de usar a instância com a Replicação de Grupo. Você pode impedir o uso de outros motores de armazenamento configurando a variável de sistema `disabled_storage_engines` nos membros do grupo, por exemplo:

  ```
  disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
  ```

- **Chaves Primárias.** Toda tabela que será replicada pelo grupo deve ter uma chave primária definida ou um equivalente de chave primária, onde o equivalente é uma chave única não nula. Tais chaves são necessárias como um identificador único para cada linha dentro de uma tabela, permitindo que o sistema determine quais transações entram em conflito, identificando exatamente quais linhas cada transação modificou. A Replicação por Grupo tem seu próprio conjunto de verificações embutidas para chaves primárias ou equivalentes de chave primária e não usa as verificações realizadas pela variável de sistema `sql_require_primary_key`. Você pode definir `sql_require_primary_key=ON` para uma instância do servidor onde a Replicação por Grupo está em execução e pode definir a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para `ON` para um canal de Replicação por Grupo. No entanto, esteja ciente de que você pode encontrar algumas transações que são permitidas nas verificações embutidas da Replicação por Grupo, mas não são permitidas nas verificações realizadas quando você define `sql_require_primary_key=ON` ou `REQUIRE_TABLE_PRIMARY_KEY_CHECK=ON`.

- **Desempenho da rede.** A Replicação em Grupo do MySQL é projetada para ser implantada em um ambiente de cluster, onde as instâncias do servidor estão muito próximas umas das outras. O desempenho e a estabilidade de um grupo podem ser impactados tanto pela latência da rede quanto pela largura de banda da rede. A comunicação bidirecional deve ser mantida em todos os momentos entre todos os membros do grupo. Se a comunicação de entrada ou saída for bloqueada para uma instância do servidor (por exemplo, por um firewall ou por problemas de conectividade), o membro não poderá funcionar no grupo, e os membros do grupo (incluindo o membro com problemas) podem não ser capazes de relatar o status correto do membro para a instância do servidor afetada.

  A partir do MySQL 8.0.14, você pode usar uma infraestrutura de rede IPv4 ou IPv6 ou uma combinação das duas para a comunicação TCP entre servidores remotos de replicação de grupo. Além disso, não há nada que impeça a replicação de grupo de funcionar em uma rede privada virtual (VPN).

  Também a partir do MySQL 8.0.14, onde as instâncias do servidor de replicação por grupo estão localizadas juntas e compartilham uma instância do motor de comunicação de grupo local (XCom), um canal de entrada dedicado com menor sobrecarga é usado para a comunicação, quando possível, em vez da porta TCP. Para certas tarefas de replicação por grupo que exigem comunicação entre instâncias remotas do XCom, como a junção de um grupo, a rede TCP ainda é usada, portanto, o desempenho da rede influencia o desempenho do grupo.

#### Configuração da Instância do Servidor

As seguintes opções devem ser configuradas conforme mostrado nas instâncias do servidor que são membros de um grupo.

- **Identificador de servidor único.** Use a variável de sistema `server_id` para configurar o servidor com um ID de servidor único, conforme exigido para todos os servidores em topologias de replicação. O ID do servidor deve ser um número inteiro positivo entre 1 e (232) - 1, e deve ser diferente de todos os outros IDs de servidor em uso por qualquer outro servidor na topologia de replicação.

- **Registro Binário Ativo.** Defina `--log-bin[=log_file_name]`. A partir do MySQL 8.0, o registro binário está habilitado por padrão, e você não precisa especificar essa opção, a menos que queira alterar o nome dos arquivos de registro binário. A Replicação em Grupo replica o conteúdo do registro binário, portanto, o registro binário precisa estar ativo para que ele funcione. Veja a Seção 7.4.4, “O Registro Binário”.

- **Atualizações de réplica registradas.** Defina `log_replica_updates=ON` (a partir do MySQL 8.0.26) ou `log_slave_updates=ON` (antes do MySQL 8.0.26). A partir do MySQL 8.0, este ajuste é o padrão, então você não precisa especificá-lo. Os membros do grupo precisam registrar as transações recebidas de seus doadores no momento da adesão e aplicadas por meio do aplicativo de replicação, e registrar todas as transações que recebem e aplicam do grupo. Isso permite que a Replicação de Grupo realize a recuperação distribuída por transferência de estado de um log binário de um membro existente do grupo.

- **Formato de linha do log binário.** Defina `binlog_format=row`. Este ajuste é o padrão, então você não precisa especificá-lo. A Replicação em Grupo depende do formato de replicação baseado em linhas para propagar as alterações de forma consistente entre os servidores do grupo e extrair as informações necessárias para detectar conflitos entre as transações que são executadas simultaneamente em diferentes servidores do grupo. A partir do MySQL 8.0.19, o ajuste `REQUIRE_ROW_FORMAT` é adicionado automaticamente aos canais da Replicação em Grupo para impor o uso da replicação baseada em linhas quando as transações são aplicadas. Consulte a Seção 19.2.1, “Formatos de replicação” e a Seção 19.3.3, “Verificação de privilégios de replicação”.

- **Desative os checksums do log binário (para o MySQL 8.0.20).** Até e incluindo o MySQL 8.0.20, defina `binlog_checksum=NONE`. Nesses lançamentos, a Replicação em Grupo não pode usar checksums e não suporta sua presença no log binário. A partir do MySQL 8.0.21, a Replicação em Grupo suporta checksums, então os membros do grupo podem usar o ajuste padrão `binlog_checksum=CRC32`, e você não precisa especificá-lo.

- **Identificador de Transações Globais Ativado.** Defina `gtid_mode=ON` e `enforce_gtid_consistency=ON`. Esses ajustes não são os padrões. A replicação baseada em GTID é necessária para a Replicação de Grupo, que utiliza identificadores de transações globais para rastrear as transações que foram comprometidas em cada instância do servidor no grupo. Consulte a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”.

  Além disso, se você precisar definir o valor de `gtid_purged`, isso deve ser feito enquanto a Replicação em Grupo não estiver em execução.

- **Repositórios de Informações de Replicação.** Defina `master_info_repository=TABLE` e `relay_log_info_repository=TABLE`. No MySQL 8.0, esses ajustes são os padrão, e o ajuste `FILE` é desatualizado. A partir do MySQL 8.0.23, o uso dessas variáveis de sistema é desatualizado, então omita as variáveis de sistema e permita apenas o padrão. O aplicativo de replicação precisa ter os metadados de replicação escritos nas tabelas de sistema `mysql.slave_master_info` e `mysql.slave_relay_log_info` para garantir que o plugin de replicação em grupo tenha recuperação consistente e gerenciamento transacional dos metadados de replicação. Veja a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

- **Extração do Conjunto de Escrita da Transação.** Defina `transaction_write_set_extraction=XXHASH64` para que, ao coletar linhas para registrá-las no log binário, o servidor também colete o conjunto de escrita. No MySQL 8.0, este ajuste é o padrão, e a partir do MySQL 8.0.26, o uso da variável do sistema é desaconselhado. O conjunto de escrita é baseado nas chaves primárias de cada linha e é uma visão simplificada e compacta de um rótulo que identifica de forma única a linha que foi alterada. A Replicação em Grupo usa essas informações para detecção de conflitos e certificação em todos os membros do grupo.

- **Criptografia de tabela padrão.** Defina `default_table_encryption` com o mesmo valor em todos os membros do grupo. A criptografia do esquema e do espaço de tabelas padrão pode ser habilitada (`ON`) ou desabilitada (`OFF`, o padrão), desde que a configuração seja a mesma em todos os membros.

  O valor de `default_table_encryption` não pode ser alterado enquanto a replicação em grupo estiver em execução.

- **Nomes de tabelas em minúsculas.** Defina `lower_case_table_names` com o mesmo valor em todos os membros do grupo. Um valor de 1 é correto para o uso do mecanismo de armazenamento `InnoDB`, que é necessário para a Replicação de Grupo. Observe que essa configuração não é a padrão em todas as plataformas.

- **Rastreamento de Dependências de Log Binário.** Definir `binlog_transaction_dependency_tracking` para `WRITESET` pode melhorar o desempenho de um membro do grupo, dependendo da carga de trabalho do grupo. Embora a Replicação em Grupo realize sua própria paralelização após a certificação ao aplicar transações do log de retransmissão, independentemente de qualquer valor definido para `binlog_transaction_dependency_tracking`, esse valor afeta a forma como as transações são escritas nos logs binários dos membros da Replicação em Grupo. As informações de dependência nesses logs são usadas para auxiliar o processo de transferência de estado para a recuperação distribuída a partir do log binário de um doador, que ocorre sempre que um membro se junta ou retorna ao grupo.

  Nota

  Quando `replica_preserve_commit_order` é `ON`, definir `binlog_transaction_dependency_tracking` para `WRITESET` tem o mesmo efeito que definir para `WRITESET_SESSION`.

- **Aplicativos Multifiltrados.** Os membros da Replicação em Grupo podem ser configurados como réplicas multifiltradas, permitindo que as transações sejam aplicadas em paralelo. A partir do MySQL 8.0.27, todas as réplicas são configuradas como multifiltradas por padrão. Um valor diferente de zero para a variável de sistema `replica_parallel_workers` (a partir do MySQL 8.0.26) ou `slave_parallel_workers` (antes do MySQL 8.0.26) habilita o aplicativo multifiltrado no membro. A configuração padrão a partir do MySQL 8.0.27 é de 4 threads de aplicativo paralelos, e até 1024 threads de aplicativo paralelos podem ser especificados. Para uma réplica multifiltrada, os seguintes ajustes também são necessários, que são os padrões a partir do MySQL 8.0.27:

  `replica_preserve_commit_order=ON` (a partir do MySQL 8.0.26) ou `slave_preserve_commit_order=ON` (antes do MySQL 8.0.26):   Este ajuste é necessário para garantir que o commit final das transações paralelas esteja na mesma ordem que as transações originais. A replicação em grupo depende de mecanismos de consistência construídos em torno da garantia de que todos os membros participantes recebam e apliquem as transações comprometidas na mesma ordem.

  `replica_parallel_type=LOGICAL_CLOCK` (a partir do MySQL 8.0.26) ou `slave_parallel_type=LOGICAL_CLOCK` (antes do MySQL 8.0.26):   Este ajuste é necessário com `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON`. Ele especifica a política usada para decidir quais transações são permitidas para serem executadas em paralelo na replica.

  Definir `replica_parallel_workers=0` ou `slave_parallel_workers=0` desativa a execução paralela e dá à replica um único fio de aplicador e nenhum fio de coordenador. Com essa configuração, as opções `replica_parallel_type` ou `slave_parallel_type` e `replica_preserve_commit_order` ou `slave_preserve_commit_order` não têm efeito e são ignoradas. A partir do MySQL 8.0.27, se a execução paralela for desativada quando GTIDs estão em uso em uma replica, a replica realmente usa um trabalhador paralelo, para aproveitar o método para refazer transações sem acessar as posições do arquivo. No entanto, esse comportamento não altera nada para o usuário.

- **Transações XA isoladas.** O MySQL 8.0.29 e versões posteriores suportam transações XA isoladas. Uma transação isolada é aquela que, uma vez preparada, não está mais conectada à sessão atual. Isso acontece automaticamente como parte da execução de `XA PREPARE`. A transação XA preparada pode ser confirmada ou revertida por outra conexão, e a sessão atual pode então iniciar outra transação XA ou transação local sem esperar que a transação que acabou de ser preparada seja concluída.

  Quando o suporte à transação XA desvinculada está habilitado (`xa_detach_on_prepare = ON`), qualquer conexão com esse servidor pode listar (usando `XA RECOVER`), reverter ou confirmar qualquer transação preparada XA. Além disso, você não pode usar tabelas temporárias dentro de transações XA desvinculadas.

  Você pode desativar o suporte para transações XA desvinculadas configurando `xa_detach_on_prepare` para `OFF`, mas isso não é recomendado. Em particular, se este servidor estiver sendo configurado como uma instância na replicação de grupo do MySQL, você deve deixar essa variável configurada com seu valor padrão (`ON`).

  Consulte a Seção 15.3.8.2, “Estados de Transação XA”, para obter mais informações.
