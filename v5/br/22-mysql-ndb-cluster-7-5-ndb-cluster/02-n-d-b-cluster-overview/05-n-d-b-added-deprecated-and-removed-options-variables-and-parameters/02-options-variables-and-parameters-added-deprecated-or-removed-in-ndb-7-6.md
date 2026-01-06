#### 21.2.5.2 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 7.6

- Parâmetros Introduzidos no NDB 7.6
- Parâmetros Desatualizados no NDB 7.6
- Parâmetros removidos na NDB 7.6
- Opções e variáveis introduzidas no NDB 7.6
- Opções e variáveis descontinuadas no NDB 7.6
- Opções e variáveis removidas na NDB 7.6

As próximas seções contêm informações sobre os parâmetros de configuração do nó `NDB` e as opções e variáveis específicas do NDB **mysqld** que foram adicionadas, descontinuadas ou removidas do NDB 7.6.

##### Parâmetros Introduzidos no NDB 7.6

Os seguintes parâmetros de configuração de nó foram adicionados no NDB 7.6.

- `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falhas no nó da API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é

  10. Adicionado na NDB 7.6.34.

- `EnablePartialLcp`: Ative LCP parcial (verdadeiro); se estiver desativado (falso), todos os LCPs escreverão pontos de verificação completos. Adicionado no NDB 7.6.4.

- `EnableRedoControl`: Ative a velocidade adaptativa de verificação de ponto de controle para controlar o uso do log de reverso. Adicionada no NDB 7.6.7.

- `InsertRecoveryWork`: Porcentagem de Trabalho de Recuperação usada para as linhas inseridas; não tem efeito a menos que pontos de verificação locais parciais estejam em uso. Adicionada no NDB 7.6.5.

- `LocationDomainId`: Atribua este nó da API a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco. Adicionado no NDB 7.6.4.

- `LocationDomainId`: Atribua este nó de gerenciamento a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco. Adicionado no NDB 7.6.4.

- `LocationDomainId`: Atribua este nó de dados a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco. Adicionado no NDB 7.6.4.

- `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves estrangeiras. Aumentar esse valor pode acelerar a construção de chaves estrangeiras, mas também afeta o tráfego em andamento. Adicionado no NDB 7.6.4.

- `MaxReorgBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a reorganização de partições de tabela. Aumentar esse valor pode acelerar a reorganização de partições de tabela, mas também afeta o tráfego em andamento. Adicionado no NDB 7.6.4.

- `MaxUIBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves únicas. Aumentar esse valor pode acelerar a construção de chaves únicas, mas também afeta o tráfego em andamento. Adicionado no NDB 7.6.4.

- `ODirectSyncFlag`: As escritas O\_DIRECT são tratadas como escritas sincronizadas; são ignoradas quando o ODirect não está habilitado, o InitFragmentLogFiles está configurado para SPARSE ou ambos. Adicionada no NDB 7.6.4.

- `PreSendChecksum`: Se este parâmetro e o Checksum estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós em busca de erros. Adicionado no NDB 7.6.6.

- `PreSendChecksum`: Se este parâmetro e o Checksum estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros. Adicionado no NDB 7.6.6.

- `RecoveryWork`: Porcentagem de overhead de armazenamento para arquivos LCP: um valor maior significa menos trabalho em operações normais, mais trabalho durante a recuperação. Adicionado no NDB 7.6.4.

- `SendBufferMemory`: Bytes no buffer de memória compartilhada para sinais enviados a partir deste nó. Adicionada no NDB 7.6.6.

- `ShmSpinTime`: Número de microsegundos para girar antes de dormir ao receber. Adicionado no NDB 7.6.6.

- `UseShm`: Use conexões de memória compartilhada entre este nó de dados e o nó da API que também está sendo executado neste host. Adicionada no NDB 7.6.6.

- `WatchDogImmediateKill`: Quando verdadeiro, os threads são imediatamente eliminados sempre que ocorrerem problemas com o watchdog; usado para testes e depuração. Adicionado no NDB 7.6.7.

##### Parâmetros desatualizados na NDB 7.6

Os seguintes parâmetros de configuração de nó foram descontinuados no NDB 7.6.

- `BackupDataBufferSize`: Tamanho padrão do buffer de dados para backup (em bytes). Desatualizado na NDB 7.6.4.

- `BackupMaxWriteSize`: Tamanho máximo de escritas no sistema de arquivos feitas pelo backup (em bytes). Desatualizado na NDB 7.6.4.

- `BackupWriteSize`: Tamanho padrão de escritas no sistema de arquivos feitas pelo backup (em bytes). Desatualizado na NDB 7.6.4.

- `IndexMemory`: Número de bytes em cada nó de dados alocados para armazenar índices; sujeito à RAM disponível do sistema e ao tamanho da DataMemory. Desatualizado na NDB 7.6.2.

- `Signum`: Número de sinal a ser usado para sinalização. Desatualizado na NDB 7.6.6.

##### Parâmetros removidos na NDB 7.6

Nenhum parâmetro de configuração de nó foi removido no NDB 7.6.

##### Opções e variáveis introduzidas no NDB 7.6

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no NDB 7.6.

- `Ndb_system_name`: Nome do sistema do clúster configurado; vazio se o servidor não estiver conectado ao NDB. Adicionado no NDB 5.7.18-ndb-7.6.2.

- `ndb-log-fail-terminate`: Finalizar o processo mysqld se a conclusão do registro completo de todos os eventos das linhas encontradas não for possível. Adicionado no NDB 5.7.29-ndb-7.6.14.

- `ndb-log-update-minimal`: Atualizações de log no formato mínimo. Adicionado no NDB 5.7.18-ndb-7.6.3.

- `ndb_row_checksum`: Quando ativado, defina os checksums das linhas; ativado por padrão. Adicionado no NDB 5.7.23-ndb-7.6.8.

##### Opções e variáveis descontinuadas no NDB 7.6

Nenhuma variável de sistema, variável de status ou opção do servidor foi descontinuada no NDB 7.6.

##### Opções e variáveis removidas na NDB 7.6

Nenhuma variável de sistema, variável de status ou opção foi removida no NDB 7.6.
