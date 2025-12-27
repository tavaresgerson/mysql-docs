#### 25.6.15.49 Tabela ndbinfo operations_per_fragment

A tabela `operations_per_fragment` fornece informações sobre as operações realizadas em fragmentos individuais e réplicas de fragmentos, bem como sobre alguns dos resultados dessas operações.

A tabela `operations_per_fragment` contém as seguintes colunas:

* `fq_name`

  Nome deste fragmento

* `parent_fq_name`

  Nome do fragmento pai deste

* `type`

  Tipo de objeto; veja o texto para os valores possíveis

* `table_id`

  ID da tabela para esta tabela

* `node_id`

  ID do nó para este nó

* `block_instance`

  ID de instância de bloco do kernel

* `fragment_num`

  ID de fragmento (número)

* `tot_key_reads`

  Número total de leituras de chave para esta replica de fragmento

* `tot_key_inserts`

  Número total de inserções de chave para esta replica de fragmento

* `tot_key_updates`

  Número total de atualizações de chave para esta replica de fragmento

* `tot_key_writes`

  Número total de escritas de chave para esta replica de fragmento

* `tot_key_deletes`

  Número total de apagamentos de chave para esta replica de fragmento

* `tot_key_refs`

  Número de operações de chave recusadas

* `tot_key_attrinfo_bytes`

  Tamanho total de todos os atributos `attrinfo`

* `tot_key_keyinfo_bytes`

  Tamanho total de todos os atributos `keyinfo`

* `tot_key_prog_bytes`

  Tamanho total de todos os programas interpretados carregados pelos atributos `attrinfo`

* `tot_key_inst_exec`

  Número total de instruções executadas por programas interpretados para operações de chave

* `tot_key_bytes_returned`

  Tamanho total de todos os dados e metadados retornados de operações de leitura de chave

* `tot_frag_scans`

  Número total de varreduras realizadas nesta replica de fragmento

* `tot_scan_rows_examined`

  Número total de linhas examinadas por varreduras

* `tot_scan_rows_returned`

  Número total de linhas devolvidas ao cliente

* `tot_scan_bytes_returned`

Tamanho total dos dados e metadados retornados ao cliente

* `tot_scan_prog_bytes`

  Tamanho total dos programas interpretados para operações de varredura

* `tot_scan_bound_bytes`

  Tamanho total de todos os limites usados em varreduras de índices ordenados

* `tot_scan_inst_exec`

  Número total de instruções executadas para varreduras

* `tot_qd_frag_scans`

  Número de vezes que varreduras desse fragmento replica foram colocadas em fila

* `conc_frag_scans`

  Número de varreduras atualmente ativas nessa replica de fragmento (excluindo varreduras em fila)

* `conc_qd_frag_scans`

  Número de varreduras atualmente em fila para essa replica de fragmento

* tot\_commits

  Número total de alterações de linha comprometidas nessa replica de fragmento

##### Notas

O `fq_name` contém o nome completo do objeto do esquema ao qual essa replica de fragmento pertence. Ele atualmente tem os seguintes formatos:

* Tabela base: `DbName/def/TblName`

* Tabela `BLOB`: `DbName/def/NDB$BLOB_BaseTblId_ColNo`

* Índice ordenado: `sys/def/BaseTblId/IndexName`

* Índice único: `sys/def/BaseTblId/IndexName$unique`

O sufixo `$unique` mostrado para índices únicos é adicionado pelo **mysqld**. Para um índice criado por um aplicativo cliente da API NDB diferente, isso pode diferir ou não estar presente.

A sintaxe mostrada acima para nomes de objetos completos é uma interface interna que está sujeita a mudanças em futuras versões.

Considere uma tabela `t1` criada e modificada pelas seguintes instruções SQL:

```
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

Se `t1` receber o ID de tabela 11, isso gera os valores `fq_name` mostrados aqui:

* Tabela base: `mydb/def/t1`
* Tabela `BLOB`: `mydb/def/NDB$BLOB_11_2`

* Índice ordenado (chave primária): `sys/def/11/PRIMARY`

* Índice único: `sys/def/11/ix1$unique`

Para índices ou tabelas `BLOB`, a coluna `parent_fq_name` contém o `fq_name` da tabela base correspondente. Para tabelas base, essa coluna é sempre `NULL`.

A coluna `type` mostra o tipo do objeto do esquema usado para este fragmento, que pode assumir qualquer um dos valores `Tabela do sistema`, `Tabela do usuário`, `Índice hash único` ou `Índice ordenado`. As tabelas `BLOB` são mostradas como `Tabela do usuário`.

O valor da coluna `table_id` é único em qualquer momento, mas pode ser reutilizado se o objeto correspondente tiver sido excluído. O mesmo ID pode ser visto usando o utilitário **ndb\_show\_tables**.

A coluna `block_instance` mostra a qual instância do LDM pertence este fragmento de replica. Você pode usar isso para obter informações sobre threads específicas da tabela `threadblocks`. A primeira instância desse tipo é sempre numerada 0.

Como normalmente existem duas réplicas de fragmento, e assumindo que assim seja, cada valor `fragment_num` deve aparecer duas vezes na tabela, em dois nós de dados diferentes do mesmo grupo de nós.

Como o `NDB` não usa acesso de chave única para índices ordenados, os contos para `tot_key_reads`, `tot_key_inserts`, `tot_key_updates`, `tot_key_writes` e `tot_key_deletes` não são incrementados por operações de índice ordenado.

Nota

Ao usar `tot_key_writes`, você deve ter em mente que uma operação de escrita neste contexto atualiza a linha se a chave existir e insere uma nova linha caso contrário. (Uma utilização disso é na implementação do `NDB` da instrução SQL `REPLACE`.)

A coluna `tot_key_refs` mostra o número de operações de chave recusadas pelo LDM. Geralmente, tal recusa é devido a chaves duplicadas (inserções), erros de chave não encontrada (atualizações, exclusões e leituras) ou a operação foi rejeitada por um programa interpretado usado como um predicado na linha que corresponde à chave.

Os atributos `attrinfo` e `keyinfo` contados nas colunas `tot_key_attrinfo_bytes` e `tot_key_keyinfo_bytes` são atributos de um sinal `LQHKEYREQ` (ver O Protocolo de Comunicação NDB), usado para iniciar uma operação de chave pelo LDM. Um `attrinfo` geralmente contém valores de campos tupla (inserções e atualizações) ou especificações de projeção (para leituras); `keyinfo` contém a chave primária ou única necessária para localizar uma tupla dada neste objeto de esquema.

O valor exibido por `tot_frag_scans` inclui tanto varreduras completas (que examinam cada linha) quanto varreduras de subconjuntos. Índices únicos e tabelas `BLOB` nunca são varridas, então esse valor, como outros contagem relacionadas a varreduras, é 0 para réplicas de fragmentos dessas.

`tot_scan_rows_examined` pode exibir menos que o número total de linhas em uma réplica de fragmento dada, pois varreduras de índices ordenados podem ser limitadas por limites. Além disso, um cliente pode optar por encerrar uma varredura antes que todas as linhas potencialmente correspondentes tenham sido examinadas; isso ocorre ao usar uma declaração SQL que contém uma cláusula `LIMIT` ou `EXISTS`, por exemplo. `tot_scan_rows_returned` é sempre menor ou igual a `tot_scan_rows_examined`.

`tot_scan_bytes_returned` inclui, no caso de junções empurradas, projeções devolvidas ao bloco `DBSPJ` no kernel NDB.

`tot_qd_frag_scans` pode ser efetivado pelo ajuste do parâmetro de configuração do nó de dados `MaxParallelScansPerFragment`, que limita o número de varreduras que podem ser executadas concorrentemente em uma única réplica de fragmento.