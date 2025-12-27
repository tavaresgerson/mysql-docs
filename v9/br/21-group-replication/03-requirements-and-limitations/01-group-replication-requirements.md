### 20.3.1 Requisitos de Replicação em Grupo

* Infraestrutura
* Configuração da Instância do Servidor

As instâncias do servidor que você deseja usar para a Replicação em Grupo devem atender aos seguintes requisitos.

#### Infraestrutura

* **Engenharia de Armazenamento InnoDB.** Os dados devem ser armazenados no motor de armazenamento transacional `InnoDB`. As transações são executadas de forma otimista e, em seguida, no momento do commit, são verificadas quanto a conflitos. Se houver conflitos, para manter a consistência em todo o grupo, algumas transações são revertidas. Isso significa que é necessário um motor de armazenamento transacional. Além disso, o `InnoDB` fornece algumas funcionalidades adicionais que permitem uma melhor gestão e tratamento de conflitos ao operar em conjunto com a Replicação em Grupo. O uso de outros motores de armazenamento, incluindo o motor de armazenamento temporário `MEMORY`, pode causar erros na Replicação em Grupo. Converta todas as tabelas em outros motores de armazenamento para usar `InnoDB` antes de usar a instância com a Replicação em Grupo. Você pode impedir o uso de outros motores de armazenamento configurando a variável de sistema `disabled_storage_engines` nos membros do grupo, por exemplo:

  ```
  disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
  ```

* **Chaves Primárias.** Toda tabela que será replicada pelo grupo deve ter uma chave primária definida ou um equivalente de chave primária, onde o equivalente é uma chave única não nula. Essas chaves são necessárias como um identificador único para cada linha dentro de uma tabela, permitindo que o sistema determine quais transações entram em conflito, identificando exatamente quais linhas cada transação modificou. A Replicação por Grupo tem seu próprio conjunto de verificações embutidas para chaves primárias ou equivalentes de chave primária e não usa as verificações realizadas pela variável de sistema `sql_require_primary_key`. Você pode definir `sql_require_primary_key=ON` para uma instância do servidor onde a Replicação por Grupo está em execução e pode definir a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração `CHANGE REPLICATION SOURCE TO` para `ON` para um canal de Replicação por Grupo. No entanto, esteja ciente de que você pode encontrar algumas transações que são permitidas pelas verificações embutidas da Replicação por Grupo, mas não são permitidas pelas verificações realizadas quando você define `sql_require_primary_key=ON` ou `REQUIRE_TABLE_PRIMARY_KEY_CHECK=ON`.

* **Desempenho da Rede.** A Replicação por Grupo MySQL é projetada para ser implantada em um ambiente de cluster, onde as instâncias do servidor estão muito próximas umas das outras. O desempenho e a estabilidade de um grupo podem ser impactados tanto pela latência da rede quanto pela largura de banda da rede. A comunicação bidirecional deve ser mantida em todos os momentos entre todos os membros do grupo. Se a comunicação de entrada ou saída for bloqueada para uma instância do servidor (por exemplo, por um firewall ou por problemas de conectividade), o membro não poderá funcionar no grupo, e os membros do grupo (incluindo o membro com problemas) podem não ser capazes de relatar o status correto do membro para a instância do servidor afetada.

Você pode usar uma infraestrutura de rede baseada em IPv4, IPv6 ou uma mistura dos dois, para a comunicação TCP entre servidores remotos de Replicação em Grupo. Além disso, não há nada que impeça a Replicação em Grupo de operar em uma rede privada virtual (VPN).

Quando as instâncias do servidor de Replicação em Grupo estão localizadas juntas e compartilham uma instância do motor de comunicação de grupo local (XCom), um canal de entrada dedicado com menor overhead é usado para a comunicação, quando possível, em vez da porta TCP. Para certas tarefas de Replicação em Grupo que requerem comunicação entre instâncias remotas do XCom, como a junção de um grupo, a rede TCP ainda é usada, portanto, o desempenho da rede influencia o desempenho do grupo.

#### Configuração da Instância do Servidor

As seguintes opções devem ser configuradas conforme mostrado nas instâncias do servidor que são membros de um grupo.

* **Identificador Único do Servidor.** Use a variável de sistema `server_id` para configurar o servidor com um ID de servidor único, conforme exigido para todos os servidores nas topologias de replicação. O ID do servidor deve ser um inteiro positivo entre 1 e (232)−1, e deve ser diferente de todos os outros IDs de servidor em uso por qualquer outro servidor na topologia de replicação.

* **Binary Log Ativo.** No MySQL 9.5, o registro binário é ativado por padrão. Você pode especificar opcionalmente os nomes dos arquivos de log binário usando `--log-bin[=log_file_name]`. A Replicação em Grupo replica o conteúdo do log binário, portanto, o log binário precisa estar ativado para que ele opere. Veja a Seção 7.4.4, “O Log Binário”.

* **Atualizações de Replicação Registradas.** Defina `log_replica_updates=ON` se ainda não estiver habilitado. (No MySQL 9.5, isso é o padrão.) Os membros do grupo precisam registrar as transações recebidas de seus doadores no momento da adesão e aplicadas por meio do aplicativo de replicação, além de registrar todas as transações que recebem e aplicam do grupo. Isso permite que a Replicação de Grupo realize a recuperação distribuída por transferência de estado de um log binário de um membro do grupo existente.

* **Formato de Linha do Log Binário.** Defina `binlog_format=ROW` se necessário; no MySQL 9.5, isso é o padrão. A Replicação de Grupo depende do formato de replicação baseado em linha para propagar as alterações de forma consistente entre os servidores do grupo e extrair as informações necessárias para detectar conflitos entre as transações que são executadas simultaneamente em diferentes servidores do grupo. O ajuste para `REQUIRE_ROW_FORMAT` é adicionado automaticamente aos canais da Replicação de Grupo para impor o uso de replicação baseada em linha quando as transações são aplicadas. Veja a Seção 19.2.1, “Formatos de Replicação” e a Seção 19.3.3, “Verificações de Privilégios de Replicação”.

* **Transações Globais de Identificadores Ativados.** Defina `gtid_mode=ON` e `enforce_gtid_consistency=ON`. Esses ajustes não são os padrões. A replicação baseada em GTID é necessária para a Replicação de Grupo, que usa identificadores de transações globais para rastrear as transações que foram comprometidas em cada instância do servidor no grupo. Veja a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”.

Além disso, se você precisar definir o valor de `gtid_purged`, deve fazê-lo enquanto a Replicação de Grupo não estiver em execução.

* **Criptografia de tabela padrão.** Defina `default_table_encryption` com o mesmo valor em todos os membros do grupo. A criptografia do esquema e do espaço de tabelas padrão pode ser habilitada (`ON`) ou desabilitada (`OFF`, o padrão), desde que a configuração seja a mesma em todos os membros.

  O valor de `default_table_encryption` não pode ser alterado enquanto a Replicação de Grupo estiver em execução.

* **Nomes de tabelas minúsculas.** Defina `lower_case_table_names` com o mesmo valor em todos os membros do grupo. Um valor de 1 é correto para o uso do motor de armazenamento `InnoDB`, que é necessário para a Replicação de Grupo. Note que essa configuração não é padrão em todas as plataformas.

* **Aplicativos multithread.** Os membros da Replicação de Grupo podem ser configurados como réplicas multithread, permitindo que as transações sejam aplicadas em paralelo. Todas as réplicas são configuradas como multithread por padrão. O padrão é de 4 threads de aplicador paralelos; até 1024 threads de aplicador paralelos podem ser especificados. Para uma réplica multithread, também é necessário:

  `replica_preserve_commit_order=ON` :   Esta configuração é necessária para garantir que o commit final das transações paralelas seja na mesma ordem que as transações originais. A Replicação de Grupo depende de mecanismos de consistência construídos em torno da garantia de que todos os membros participantes recebam e apliquem transações comprometidas na mesma ordem.

* Transações XA isoladas. O MySQL 9.5 e versões posteriores suportam transações XA isoladas. Uma transação isolada é aquela que, uma vez preparada, não está mais conectada à sessão atual. Isso acontece automaticamente como parte da execução de `XA PREPARE`. A transação XA preparada pode ser confirmada ou revertida por outra conexão, e a sessão atual pode então iniciar outra transação XA ou transação local sem esperar que a transação que acabou de ser preparada seja concluída.

Quando o suporte para transações XA isoladas é habilitado (`xa_detach_on_prepare = ON`), qualquer conexão com este servidor pode listar (usando `XA RECOVER`), reverter ou confirmar qualquer transação XA preparada. Além disso, você não pode usar tabelas temporárias dentro de transações XA isoladas.

Você pode desabilitar o suporte para transações XA isoladas configurando `xa_detach_on_prepare` para `OFF`, mas isso não é recomendado. Em particular, se este servidor estiver sendo configurado como uma instância na replicação de grupo do MySQL, você deve deixar essa variável definida para seu valor padrão (`ON`).

Consulte a Seção 15.3.8.2, “Estados de Transações XA”, para obter mais informações.