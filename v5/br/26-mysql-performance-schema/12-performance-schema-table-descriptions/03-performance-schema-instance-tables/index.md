### 25.12.3 Tabelas de Instâncias do Schema de Desempenho

25.12.3.1 A tabela cond_instances

25.12.3.2 A tabela file_instances

25.12.3.3 A tabela mutex_instances

Tabela rwlock_instances

25.12.3.5 A tabela socket_instances

As tabelas de instâncias documentam os tipos de objetos que estão instrumentados. Elas fornecem nomes de eventos e notas explicativas ou informações de status:

- `cond_instances`: Instâncias de objetos de sincronização de condições

- `file_instances`: Instâncias de arquivo

- `mutex_instances`: Instâncias de objetos de sincronização de mutex

- `rwlock_instances`: Instâncias de objetos de sincronização de bloqueio

- `socket_instances`: Instâncias de conexão ativa

Essas tabelas listam objetos de sincronização instrumentados, arquivos e conexões. Existem três tipos de objetos de sincronização: `cond`, `mutex` e `rwlock`. Cada tabela de instância tem uma coluna `EVENT_NAME` ou `NAME` para indicar o instrumento associado a cada linha. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido em Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar gargalos de desempenho ou deadlocks. Para exemplos de como usá-las para esse propósito, consulte Seção 25.19, “Usando o Schema de Desempenho para Diagnosticar Problemas”
