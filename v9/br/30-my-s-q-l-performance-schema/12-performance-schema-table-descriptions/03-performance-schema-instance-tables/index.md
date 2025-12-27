### 29.12.3 Instâncias do Schema de Desempenho

29.12.3.1 Tabela cond_instances

29.12.3.2 Tabela file_instances

29.12.3.3 Tabela mutex_instances

29.12.3.4 Tabela rwlock_instances

29.12.3.5 Tabela socket_instances

As tabelas de instâncias documentam os tipos de objetos instrumentados. Elas fornecem nomes de eventos e notas explicativas ou informações de status:

* `cond_instances`: Instâncias de objetos de sincronização de condições

* `file_instances`: Instâncias de arquivos
* `mutex_instances`: Instâncias de objetos de sincronização de mutex

* `rwlock_instances`: Instâncias de objetos de sincronização de bloqueio

* `socket_instances`: Instâncias de conexões ativas

Essas tabelas listam os objetos de sincronização instrumentados, arquivos e conexões. Existem três tipos de objetos de sincronização: `cond`, `mutex` e `rwlock`. Cada tabela de instâncias tem uma coluna `EVENT_NAME` ou `NAME` para indicar o instrumento associado a cada linha. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar gargalos de desempenho ou deadlocks. Para exemplos de como usá-las para esse propósito, consulte a Seção 29.19, “Usando o Schema de Desempenho para Diagnosticar Problemas”