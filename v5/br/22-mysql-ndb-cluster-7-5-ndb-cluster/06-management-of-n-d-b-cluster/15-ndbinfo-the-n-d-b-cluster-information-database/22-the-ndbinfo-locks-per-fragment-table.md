#### 21.6.15.22 Tabela ndbinfo locks_per_fragment

A tabela `locks_per_fragment` fornece informações sobre o número de solicitações de bloqueio e os resultados dessas solicitações por fragmento, servindo como uma tabela complementar a `operations_per_fragment` e `memory_per_fragment`. Esta tabela também mostra o tempo total gasto esperando por bloqueios com sucesso e sem sucesso desde a criação do fragmento ou da tabela, ou desde o reinício mais recente.

A tabela `locks_per_fragment` contém as seguintes colunas:

- `fq_name`

  Nome de tabela totalmente qualificado

- `parent_fq_name`

  Nome completo do objeto pai

- `tipo`

  Tipo de tabela; consulte o texto para valores possíveis

- `table_id`

  Tabela ID

- `node_id`

  ID do nó de relatório

- `block_instance`

  ID da instância do LDM

- `fragment_num`

  Identificador de fragmento

- `ex_req`

  Solicitações de bloqueio exclusivo iniciadas

- `ex_imm_ok`

  Pedidos de bloqueio exclusivos são concedidos imediatamente

- `ex_wait_ok`

  Solicitações de bloqueio exclusivas concedidas após a espera

- `ex_wait_fail`

  Pedidos de bloqueio exclusivos não foram atendidos

- `sh_req`

  Solicitações de bloqueio compartilhado iniciadas

- `sh_imm_ok`

  Solicitações de bloqueio compartilhado concedidas imediatamente

- `sh_wait_ok`

  Solicitações de bloqueio compartilhado concedidas após a espera

- `sh_wait_fail`

  Solicitações de bloqueio compartilhado não concedidas

- `wait_ok_millis`

  Tempo gasto esperando por solicitações de bloqueio que foram concedidas, em milissegundos

- `wait_fail_millis`

  Tempo gasto esperando por solicitações de bloqueio que falharam, em milissegundos

##### Notas

`block_instance` refere-se a uma instância de um bloco de kernel. Juntamente com o nome do bloco, esse número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

`fq_name` é o nome de um objeto de banco de dados totalmente qualificado no formato `database`/*`schema`*/\*`name``, como `test/def/t1`ou`sys/def/10/b$unique\`.

`parent_fq_name` é o nome completo do objeto pai (tabela) deste objeto.

`table_id` é o ID interno da tabela gerado pelo `NDB`. Este é o mesmo ID interno da tabela exibido em outras tabelas `ndbinfo`; também é visível na saída do **ndb_show_tables**.

A coluna `type` mostra o tipo de tabela. Isso é sempre um dos `Tabela do sistema`, `Tabela do usuário`, `Índice de hash único`, `Índice de hash`, `Índice ordenado único`, `Índice ordenado`, `Trigger de índice de hash`, `Trigger de assinatura`, `Restrição de leitura apenas`, `Trigger de índice`, `Trigger de reorganização`, `Tablespace`, `Grupo de arquivos de log`, `Arquivo de dados`, `Arquivo de desfazer`, `Mapa de hash`, `Definição de chave estrangeira`, `Trigger pai de chave estrangeira`, `Trigger filho de chave estrangeira` ou `Transação de esquema`.

Os valores exibidos em todas as colunas `ex_req`, `ex_req_imm_ok`, `ex_wait_ok`, `ex_wait_fail`, `sh_req`, `sh_req_imm_ok`, `sh_wait_ok` e `sh_wait_fail` representam números acumulados de solicitações desde que a tabela ou fragmento foi criada, ou desde o último reinício deste nó, dependendo de qual desses eventos ocorreu mais tarde. Isso também é válido para os valores de tempo exibidos nas colunas `wait_ok_millis` e `wait_fail_millis`.

Cada solicitação de bloqueio é considerada como estando em andamento ou como tendo sido concluída de alguma forma (ou seja, como tendo sido bem-sucedida ou falha). Isso significa que as seguintes relações são verdadeiras:

```sql
ex_req >= (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

sh_req >= (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

O número de solicitações atualmente em andamento é o número atual de solicitações incompletas, que podem ser encontradas conforme mostrado aqui:

```sql
[exclusive lock requests in progress] =
    ex_req - (ex_req_imm_ok + ex_wait_ok + ex_wait_fail)

[shared lock requests in progress] =
    sh_req - (sh_req_imm_ok + sh_wait_ok + sh_wait_fail)
```

Um bloqueio falhado indica uma transação abortada, mas o bloqueio pode ou não ser causado por um tempo limite de espera de bloqueio. Você pode obter o número total de abortos enquanto espera por bloqueios, conforme mostrado aqui:

```sql
[aborts while waiting for locks] = ex_wait_fail + sh_wait_fail
```

A tabela `locks_per_fragment` foi adicionada no NDB 7.5.3.
