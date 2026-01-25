#### 21.2.5.2 Opções, Variáveis e Parâmetros Adicionados, Obsoletos ou Removidos no NDB 7.6

* [Parâmetros Introduzidos no NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#params-added-ndb-7.6 "Parâmetros Introduzidos no NDB 7.6")
* [Parâmetros Obsoletos no NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#params-deprecated-ndb-7.6 "Parâmetros Obsoletos no NDB 7.6")
* [Parâmetros Removidos no NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#params-removed-ndb-7.6 "Parâmetros Removidos no NDB 7.6")
* [Opções e Variáveis Introduzidas no NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#optvars-added-ndb-7.6 "Opções e Variáveis Introduzidas no NDB 7.6")
* [Opções e Variáveis Obsoletas no NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#optvars-deprecated-ndb-7.6 "Opções e Variáveis Obsoletas no NDB 7.6")
* [Opções e Variáveis Removidas no NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#optvars-removed-ndb-7.6 "Opções e Variáveis Removidas no NDB 7.6")

As próximas seções contêm informações sobre os **parameters** de configuração de **node** do `NDB` e **options** e **variables** específicas do NDB para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que foram adicionados, tornados obsoletos ou removidos no NDB 7.6.

##### Parâmetros Introduzidos no NDB 7.6

Os seguintes **parameters** de configuração de **node** foram adicionados no NDB 7.6.

* `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falhas do **API node** antes da escalação. 0 significa sem limite de tempo; o valor mínimo utilizável é 10. Adicionado no NDB 7.6.34.
* `EnablePartialLcp`: Habilita **LCP** parcial (true); se desabilitado (false), todos os **LCPs** gravam **checkpoints** completos. Adicionado no NDB 7.6.4.

* `EnableRedoControl`: Habilita velocidade de **checkpointing** adaptativa para controlar o uso do **redo log**. Adicionado no NDB 7.6.7.

* `InsertRecoveryWork`: Porcentagem de **RecoveryWork** usada para linhas inseridas; não tem efeito a menos que **checkpoints** locais parciais estejam em uso. Adicionado no NDB 7.6.5.

* `LocationDomainId`: Atribui este **API node** a um domínio ou zona de disponibilidade específico. 0 (**default**) deixa este valor não definido. Adicionado no NDB 7.6.4.

* `LocationDomainId`: Atribui este **management node** a um domínio ou zona de disponibilidade específico. 0 (**default**) deixa este valor não definido. Adicionado no NDB 7.6.4.

* `LocationDomainId`: Atribui este **data node** a um domínio ou zona de disponibilidade específico. 0 (**default**) deixa este valor não definido. Adicionado no NDB 7.6.4.

* `MaxFKBuildBatchSize`: Tamanho máximo do **scan batch size** a ser usado para construir **foreign keys**. Aumentar este valor pode acelerar as construções de **foreign keys**, mas também impacta o tráfego em andamento. Adicionado no NDB 7.6.4.

* `MaxReorgBuildBatchSize`: Tamanho máximo do **scan batch size** a ser usado para reorganização de partições de tabela. Aumentar este valor pode acelerar a reorganização de partições de tabela, mas também impacta o tráfego em andamento. Adicionado no NDB 7.6.4.

* `MaxUIBuildBatchSize`: Tamanho máximo do **scan batch size** a ser usado para construir **unique keys**. Aumentar este valor pode acelerar as construções de **unique keys**, mas também impacta o tráfego em andamento. Adicionado no NDB 7.6.4.

* `ODirectSyncFlag`: As gravações O_DIRECT são tratadas como gravações sincronizadas; ignorado quando **ODirect** não está habilitado, **InitFragmentLogFiles** está definido como SPARSE ou ambos. Adicionado no NDB 7.6.4.

* `PreSendChecksum`: Se este **parameter** e **Checksum** estiverem ambos habilitados, executa verificações de **checksum** pré-envio e verifica todos os **SHM signals** entre **nodes** em busca de erros. Adicionado no NDB 7.6.6.

* `PreSendChecksum`: Se este **parameter** e **Checksum** estiverem ambos habilitados, executa verificações de **checksum** pré-envio e verifica todos os **TCP signals** entre **nodes** em busca de erros. Adicionado no NDB 7.6.6.

* `RecoveryWork`: Porcentagem de sobrecarga de armazenamento para arquivos **LCP**: um valor maior significa menos trabalho em operações normais e mais trabalho durante a recuperação. Adicionado no NDB 7.6.4.

* `SendBufferMemory`: Bytes no **buffer** de **shared memory** para **signals** enviados deste **node**. Adicionado no NDB 7.6.6.

* `ShmSpinTime`: Ao receber, número de microssegundos para "spin" antes de entrar em **sleep**. Adicionado no NDB 7.6.6.

* `UseShm`: Usa conexões de **shared memory** entre este **data node** e o **API node** que também está sendo executado neste **host**. Adicionado no NDB 7.6.6.

* `WatchDogImmediateKill`: Quando true, as **threads** são imediatamente encerradas sempre que ocorrem problemas de **watchdog**; usado para testes e **debugging**. Adicionado no NDB 7.6.7.

##### Parâmetros Obsoletos no NDB 7.6

Os seguintes **parameters** de configuração de **node** foram tornados obsoletos no NDB 7.6.

* `BackupDataBufferSize`: Tamanho **default** do **databuffer** para **backup** (em bytes). Obsoleto no NDB 7.6.4.

* `BackupMaxWriteSize`: Tamanho máximo das **file system writes** feitas pelo **backup** (em bytes). Obsoleto no NDB 7.6.4.

* `BackupWriteSize`: Tamanho **default** das **file system writes** feitas pelo **backup** (em bytes). Obsoleto no NDB 7.6.4.

* `IndexMemory`: Número de bytes em cada **data node** alocado para armazenar **indexes**; sujeito à **RAM** do sistema disponível e ao tamanho de **DataMemory**. Obsoleto no NDB 7.6.2.

* `Signum`: Número de **Signal** a ser usado para sinalização. Obsoleto no NDB 7.6.6.

##### Parâmetros Removidos no NDB 7.6

Nenhum **parameter** de configuração de **node** foi removido no NDB 7.6.

##### Opções e Variáveis Introduzidas no NDB 7.6

As seguintes **system variables**, **status variables** e **server options** foram adicionadas no NDB 7.6.

* `Ndb_system_name`: Nome do sistema do **cluster** configurado; vazio se o servidor não estiver conectado ao NDB. Adicionado no NDB 5.7.18-ndb-7.6.2.

* `ndb-log-fail-terminate`: Encerra o **mysqld process** se o logging completo de todos os eventos de linha encontrados não for possível. Adicionado no NDB 5.7.29-ndb-7.6.14.

* `ndb-log-update-minimal`: Loga updates em formato minimalista. Adicionado no NDB 5.7.18-ndb-7.6.3.

* `ndb_row_checksum`: Quando habilitado, define **row checksums**; habilitado por **default**. Adicionado no NDB 5.7.23-ndb-7.6.8.

##### Opções e Variáveis Obsoletas no NDB 7.6

Nenhuma **system variable**, **status variable** ou **server option** foi tornada obsoleta no NDB 7.6.

##### Opções e Variáveis Removidas no NDB 7.6

Nenhuma **system variable**, **status variable** ou **option** foi removida no NDB 7.6.