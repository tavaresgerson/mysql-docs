#### 21.6.15.29 A Tabela ndbinfo operations_per_fragment

A tabela `operations_per_fragment` fornece informações sobre as operações realizadas em fragmentos individuais e réplicas de fragmentos, bem como sobre alguns dos resultados dessas operações.

A tabela `operations_per_fragment` contém as seguintes colunas:

* `fq_name`

  Nome deste fragmento

* `parent_fq_name`

  Nome do pai deste fragmento

* `type`

  Tipo de objeto; veja o texto para valores possíveis

* `table_id`

  O ID da Table para esta tabela

* `node_id`

  O ID do Node para este node

* `block_instance`

  ID da Kernel block instance

* `fragment_num`

  ID (número) do Fragment

* `tot_key_reads`

  Número total de key reads para esta réplica de fragmento

* `tot_key_inserts`

  Número total de key inserts para esta réplica de fragmento

* `tot_key_updates`

  Número total de key updates para esta réplica de fragmento

* `tot_key_writes`

  Número total de key writes para esta réplica de fragmento

* `tot_key_deletes`

  Número total de key deletes para esta réplica de fragmento

* `tot_key_refs`

  Número de key operations recusadas

* `tot_key_attrinfo_bytes`

  Tamanho total de todos os atributos `attrinfo`

* `tot_key_keyinfo_bytes`

  Tamanho total de todos os atributos `keyinfo`

* `tot_key_prog_bytes`

  Tamanho total de todos os programas interpretados transportados pelos atributos `attrinfo`

* `tot_key_inst_exec`

  Número total de instruções executadas por programas interpretados para key operations

* `tot_key_bytes_returned`

  Tamanho total de todos os dados e metadados retornados de key read operations

* `tot_frag_scans`

  Número total de scans realizados nesta réplica de fragmento

* `tot_scan_rows_examined`

  Número total de Rows examinadas por scans

* `tot_scan_rows_returned`

  Número total de Rows retornadas ao cliente

* `tot_scan_bytes_returned`

  Tamanho total dos dados e metadados retornados ao cliente

* `tot_scan_prog_bytes`

  Tamanho total dos programas interpretados para scan operations

* `tot_scan_bound_bytes`

  Tamanho total de todos os bounds usados em ordered index scans

* `tot_scan_inst_exec`

  Número total de instruções executadas para scans

* `tot_qd_frag_scans`

  Número de vezes que scans desta réplica de fragmento foram colocados na fila (queued)

* `conc_frag_scans`

  Número de scans atualmente ativos nesta réplica de fragmento (excluindo scans em fila)

* `conc_qd_frag_scans`

  Número de scans atualmente em fila (queued) para esta réplica de fragmento

* `tot_commits`

  Número total de mudanças de Row commitadas para esta réplica de fragmento

##### Notas

O `fq_name` contém o nome totalmente qualificado do objeto de schema ao qual esta réplica de fragmento pertence. Atualmente, ele tem os seguintes formatos:

* Tabela Base: `DbName/def/TblName`

* Tabela `BLOB`: `DbName/def/NDB$BLOB_BaseTblId_ColNo`

* Ordered Index: `sys/def/BaseTblId/IndexName`

* Unique Index: `sys/def/BaseTblId/IndexName$unique`

O sufixo `$unique` mostrado para Unique Indexes é adicionado pelo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"); para um Index criado por uma aplicação cliente NDB API diferente, isso pode ser diferente, ou não estar presente.

A sintaxe mostrada para nomes de objetos totalmente qualificados é uma interface interna sujeita a alterações em versões futuras.

Considere uma Table `t1` criada e modificada pelas seguintes declarações SQL:

```sql
CREATE DATABASE mydb;

USE mydb;

CREATE TABLE t1 (
  a INT NOT NULL,
  b INT NOT NULL,
  t TEXT NOT NULL,
  PRIMARY KEY (b)
) ENGINE=ndbcluster;

CREATE UNIQUE INDEX ix1 ON t1(b) USING HASH;
```

Se `t1` receber o ID de Table 11, isso resultará nos valores de `fq_name` mostrados aqui:

* Tabela Base: `mydb/def/t1`
* Tabela `BLOB`: `mydb/def/NDB$BLOB_11_2`

* Ordered Index (Primary Key): `sys/def/11/PRIMARY`

* Unique Index: `sys/def/11/ix1$unique`

Para Indexes ou tabelas `BLOB`, a coluna `parent_fq_name` contém o `fq_name` da tabela base correspondente. Para tabelas base, esta coluna é sempre `NULL`.

A coluna `type` mostra o tipo de objeto de schema usado para este fragmento, que pode assumir qualquer um dos valores `System table`, `User table`, `Unique hash index`, ou `Ordered index`. Tabelas `BLOB` são mostradas como `User table`.

O valor da coluna `table_id` é único a qualquer momento, mas pode ser reutilizado se o objeto correspondente tiver sido excluído. O mesmo ID pode ser visto usando o utilitário [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables").

A coluna `block_instance` mostra a qual instância LDM esta réplica de fragmento pertence. Você pode usar isso para obter informações sobre Threads específicas da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 A Tabela ndbinfo threadblocks"). A primeira dessas instâncias é sempre numerada como 0.

Como tipicamente existem duas réplicas, e assumindo que seja este o caso, cada valor `fragment_num` deve aparecer duas vezes na tabela, em dois Data Nodes diferentes do mesmo node group.

Como o NDB não utiliza acesso de chave única para Ordered Indexes, as contagens para `tot_key_reads`, `tot_key_inserts`, `tot_key_updates`, `tot_key_writes` e `tot_key_deletes` não são incrementadas por Ordered Index operations.

Nota

Ao usar `tot_key_writes`, você deve ter em mente que uma write operation neste contexto atualiza a Row se a Key existir, e insere uma nova Row caso contrário. (Um uso disso está na implementação NDB da declaração SQL [`REPLACE`](replace.html "13.2.8 REPLACE Statement").)

A coluna `tot_key_refs` mostra o número de key operations recusadas pelo LDM. Geralmente, tal recusa se deve a chaves duplicadas (inserts), erros Key not found (updates, deletes e reads), ou a operação foi rejeitada por um programa interpretado usado como predicado na Row que corresponde à Key.

Os atributos `attrinfo` e `keyinfo` contados pelas colunas `tot_key_attrinfo_bytes` e `tot_key_keyinfo_bytes` são atributos de um sinal `LQHKEYREQ` (veja [The NDB Communication Protocol](/doc/ndb-internals/en/ndb-internals-ndb-protocol.html)) usado para iniciar uma key operation pelo LDM. Um `attrinfo` tipicamente contém valores de campo de tupla (inserts e updates) ou especificações de projeção (para reads); o `keyinfo` contém a Primary Key ou Unique Key necessária para localizar uma determinada tupla neste objeto de schema.

O valor mostrado por `tot_frag_scans` inclui tanto scans completos (que examinam todas as Rows) quanto scans de subconjuntos. Unique Indexes e tabelas `BLOB` nunca são escaneados, portanto este valor, assim como outras contagens relacionadas a scan, é 0 para réplicas de fragmento destes.

`tot_scan_rows_examined` pode exibir menos do que o número total de Rows em uma determinada réplica de fragmento, já que Ordered Index scans podem ser limitados por bounds. Além disso, um cliente pode optar por encerrar um scan antes que todas as Rows potencialmente correspondentes tenham sido examinadas; isso ocorre ao usar uma declaração SQL contendo uma cláusula `LIMIT` ou `EXISTS`, por exemplo. `tot_scan_rows_returned` é sempre menor ou igual a `tot_scan_rows_examined`.

`tot_scan_bytes_returned` inclui, no caso de JOINs empurrados (pushed joins), projeções retornadas ao bloco [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) no kernel NDB.

`tot_qd_frag_scans` pode ser afetado pela configuração do parâmetro de configuração do Data Node [`MaxParallelScansPerFragment`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxparallelscansperfragment), que limita o número de scans que podem ser executados concorrentemente em uma única réplica de fragmento.