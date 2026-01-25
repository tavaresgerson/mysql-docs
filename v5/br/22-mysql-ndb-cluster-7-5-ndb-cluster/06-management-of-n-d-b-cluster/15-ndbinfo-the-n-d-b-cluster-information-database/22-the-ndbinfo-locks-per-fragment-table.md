#### 21.6.15.22 A Tabela ndbinfo locks_per_fragment

A tabela `locks_per_fragment` fornece informações sobre a contagem de solicitações de reivindicação de Lock e os resultados dessas solicitações por fragmento (per-fragment basis), servindo como uma tabela complementar a [`operations_per_fragment`](mysql-cluster-ndbinfo-operations-per-fragment.html "21.6.15.29 The ndbinfo operations_per_fragment Table") e [`memory_per_fragment`](mysql-cluster-ndbinfo-memory-per-fragment.html "21.6.15.27 The ndbinfo memory_per-fragment Table"). Esta tabela também mostra o tempo total gasto esperando por Locks com sucesso e sem sucesso desde a criação do fragmento ou da tabela, ou desde o reinício mais recente.

A tabela `locks_per_fragment` contém as seguintes colunas:

* `fq_name`

  Nome de tabela totalmente qualificado

* `parent_fq_name`

  Nome totalmente qualificado do objeto pai

* `type`

  Tipo de tabela; veja o texto para valores possíveis

* `table_id`

  ID da Tabela

* `node_id`

  ID do Node de relatório

* `block_instance`

  ID da instância LDM

* `fragment_num`

  Identificador do Fragmento

* `ex_req`

  Solicitações de Lock Exclusivo iniciadas

* `ex_imm_ok`

  Solicitações de Lock Exclusivo concedidas imediatamente

* `ex_wait_ok`

  Solicitações de Lock Exclusivo concedidas após espera

* `ex_wait_fail`

  Solicitações de Lock Exclusivo não concedidas

* `sh_req`

  Solicitações de Lock Compartilhado iniciadas

* `sh_imm_ok`

  Solicitações de Lock Compartilhado concedidas imediatamente

* `sh_wait_ok`

  Solicitações de Lock Compartilhado concedidas após espera

* `sh_wait_fail`

  Solicitações de Lock Compartilhado não concedidas

* `wait_ok_millis`

  Tempo gasto esperando por solicitações de Lock que foram concedidas, em milissegundos

* `wait_fail_millis`

  Tempo gasto esperando por solicitações de Lock que falharam, em milissegundos

##### Notas

`block_instance` refere-se a uma instância de um bloco do kernel. Juntamente com o nome do bloco, este número pode ser usado para procurar uma determinada instância na tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").

`fq_name` é um nome de objeto de Database totalmente qualificado no formato *`database`*/*`schema`*/*`name`*, como `test/def/t1` ou `sys/def/10/b$unique`.

`parent_fq_name` é o nome totalmente qualificado do objeto pai (tabela) deste objeto.

`table_id` é o ID interno da tabela gerado pelo `NDB`. Este é o mesmo ID interno da tabela mostrado em outras tabelas `ndbinfo`; também está visível na saída de [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables").

A coluna `type` mostra o tipo de tabela. Este é sempre um dos seguintes: `System table` (Tabela do Sistema), `User table` (Tabela do Usuário), `Unique hash index` (Index Hash Exclusivo), `Hash index` (Index Hash), `Unique ordered index` (Index Ordenado Exclusivo), `Ordered index` (Index Ordenado), `Hash index trigger` (Gatilho de Index Hash), `Subscription trigger` (Gatilho de Assinatura), `Read only constraint` (Restrição Somente Leitura), `Index trigger` (Gatilho de Index), `Reorganize trigger` (Gatilho de Reorganização), `Tablespace`, `Log file group` (Grupo de Arquivos de Log), `Data file` (Arquivo de Dados), `Undo file` (Arquivo de Undo), `Hash map` (Mapa Hash), `Foreign key definition` (Definição de Chave Estrangeira), `Foreign key parent trigger` (Gatilho Pai de Chave Estrangeira), `Foreign key child trigger` (Gatilho Filho de Chave Estrangeira), ou `Schema transaction` (Transação de Schema).

Os valores mostrados em todas as colunas `ex_req`, `ex_imm_ok`, `ex_wait_ok`, `ex_wait_fail`, `sh_req`, `sh_imm_ok`, `sh_wait_ok` e `sh_wait_fail` representam números cumulativos de solicitações desde que a tabela ou fragmento foi criado, ou desde o último restart deste Node, o que tiver ocorrido por último. Isso também é verdade para os valores de tempo mostrados nas colunas `wait_ok_millis` e `wait_fail_millis`.

Cada solicitação de Lock é considerada em progresso ou concluída de alguma forma (ou seja, bem-sucedida ou malsucedida). Isso significa que as seguintes relações são verdadeiras:

```sql
ex_req >= (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

sh_req >= (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

O número de solicitações atualmente em progresso é o número atual de solicitações incompletas, que pode ser encontrado conforme mostrado aqui:

```sql
[exclusive lock requests in progress] =
    ex_req - (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

[shared lock requests in progress] =
    sh_req - (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

Uma espera com falha indica uma Transaction abortada, mas o aborto pode ou não ser causado por um timeout de Lock wait. Você pode obter o número total de abortos enquanto espera por Locks conforme mostrado aqui:

```sql
[aborts while waiting for locks] = ex_wait_fail + sh_wait_fail
```

A tabela `locks_per_fragment` foi adicionada no NDB 7.5.3.