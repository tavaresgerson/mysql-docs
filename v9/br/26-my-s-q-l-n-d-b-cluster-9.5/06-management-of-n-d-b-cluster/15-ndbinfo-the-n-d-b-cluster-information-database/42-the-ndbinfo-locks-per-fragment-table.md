#### 25.6.15.42 A tabela locks\_per\_fragment do ndbinfo

A tabela `locks_per_fragment` fornece informações sobre o número de solicitações de bloqueio e os resultados dessas solicitações em uma base por fragmento, servindo como uma tabela complementar à `operations_per_fragment` e `memory_per_fragment`. Esta tabela também mostra o tempo total gasto esperando por bloqueios com sucesso e sem sucesso desde a criação do fragmento ou da tabela, ou desde o reinício mais recente.

A tabela `locks_per_fragment` contém as seguintes colunas:

* `fq_name`

  Nome completo da tabela

* `parent_fq_name`

  Nome completo do objeto pai

* `type`

  Tipo de tabela; consulte o texto para os valores possíveis

* `table_id`

  ID da tabela

* `node_id`

  ID do nó de relatório

* `block_instance`

  ID da instância do LDM

* `fragment_num`

  Identificador do fragmento

* `ex_req`

  Solicitações de bloqueio exclusivas iniciadas

* `ex_imm_ok`

  Solicitações de bloqueio exclusivo concedidas imediatamente

* `ex_wait_ok`

  Solicitações de bloqueio exclusivo concedidas após a espera

* `ex_wait_fail`

  Solicitações de bloqueio exclusivo não concedidas

* `sh_req`

  Solicitações de bloqueio compartilhado iniciadas

* `sh_imm_ok`

  Solicitações de bloqueio compartilhado concedidas imediatamente

* `sh_wait_ok`

  Solicitações de bloqueio compartilhado concedidas após a espera

* `sh_wait_fail`

  Solicitações de bloqueio compartilhado não concedidas

* `wait_ok_millis`

  Tempo gasto esperando por solicitações de bloqueio que foram concedidas, em milissegundos

* `wait_fail_millis`

  Tempo gasto esperando por solicitações de bloqueio que falharam, em milissegundos

##### Notas

`block_instance` refere-se a uma instância de um bloco do kernel. Juntamente com o nome do bloco, este número pode ser usado para procurar uma determinada instância na tabela `threadblocks`.

`fq_name` é um nome de objeto de banco de dados totalmente qualificado no formato `database`/*`schema`*/*`name`*, como `test/def/t1` ou `sys/def/10/b$unique`.

`parent_fq_name` é o nome completo do objeto pai (tabela) deste objeto.

`table_id` é o ID interno da tabela gerado pelo `NDB`. Este é o mesmo ID interno da tabela mostrado em outras tabelas `ndbinfo`; também é visível na saída do **ndb\_show\_tables**.

A coluna `type` mostra o tipo de tabela. Isso é sempre um dos `System table`, `User table`, `Unique hash index`, `Hash index`, `Unique ordered index`, `Ordered index`, `Hash index trigger`, `Subscription trigger`, `Read only constraint`, `Index trigger`, `Reorganize trigger`, `Tablespace`, `Log file group`, `Data file`, `Undo file`, `Hash map`, `Foreign key definition`, `Foreign key parent trigger`, `Foreign key child trigger`, ou `Schema transaction`.

Os valores mostrados em todas as colunas `ex_req`, `ex_req_imm_ok`, `ex_wait_ok`, `ex_wait_fail`, `sh_req`, `sh_req_imm_ok`, `sh_wait_ok` e `sh_wait_fail` representam números acumulados de solicitações desde que a tabela ou fragmento foi criada, ou desde o último reinício deste nó, o que ocorrer posteriormente. Isso também é verdadeiro para os valores de tempo mostrados nas colunas `wait_ok_millis` e `wait_fail_millis`.

Cada solicitação de bloqueio é considerada como estando em andamento ou como tendo sido concluída de alguma forma (ou seja, como tendo sido bem-sucedida ou falha). Isso significa que as seguintes relações são verdadeiras:

```
ex_req >= (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

sh_req >= (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

O número de solicitações atualmente em andamento é o número atual de solicitações incompletas, que pode ser encontrado como mostrado aqui:

```
[exclusive lock requests in progress] =
    ex_req - (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

[shared lock requests in progress] =
    sh_req - (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

Uma espera falha indica uma transação abortada, mas o abort pode ou não ser causado por um timeout de espera de bloqueio. Você pode obter o número total de abortos enquanto espera por bloqueios como mostrado aqui:

```
[aborts while waiting for locks] = ex_wait_fail + sh_wait_fail
```