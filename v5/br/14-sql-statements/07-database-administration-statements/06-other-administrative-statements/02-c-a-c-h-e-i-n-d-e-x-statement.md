#### 13.7.6.2 Instrução CACHE INDEX

```sql
CACHE INDEX {
      tbl_index_list [, tbl_index_list] ...
    | tbl_name PARTITION (partition_list)
  }
  IN key_cache_name

tbl_index_list:
  tbl_name [{INDEX|KEY} (index_name[, index_name] ...)]

partition_list: {
    partition_name[, partition_name] ...
  | ALL
}
```

A instrução [`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement") atribui Indexes de uma Table a um Key Cache específico. Ela se aplica apenas a Tables `MyISAM`, incluindo Tables `MyISAM` particionadas. Após os Indexes serem atribuídos, eles podem ser pré-carregados no Cache, se desejado, com [`LOAD INDEX INTO CACHE`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement").

A instrução a seguir atribui Indexes das Tables `t1`, `t2` e `t3` ao Key Cache chamado `hot_cache`:

```sql
mysql> CACHE INDEX t1, t2, t3 IN hot_cache;
+---------+--------------------+----------+----------+
| Table   | Op                 | Msg_type | Msg_text |
+---------+--------------------+----------+----------+
| test.t1 | assign_to_keycache | status   | OK       |
| test.t2 | assign_to_keycache | status   | OK       |
| test.t3 | assign_to_keycache | status   | OK       |
+---------+--------------------+----------+----------+
```

A sintaxe de [`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement") permite especificar que apenas Indexes particulares de uma Table devem ser atribuídos ao Cache. No entanto, a implementação atribui todos os Indexes da Table ao Cache, então não há razão para especificar nada além do nome da Table.

O Key Cache referenciado em uma instrução [`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement") pode ser criado definindo seu tamanho com uma instrução de configuração de parâmetro ou nas configurações de parâmetro do Server. Por exemplo:

```sql
SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Os parâmetros de Key Cache são acessados como membros de uma Structured System Variable. Consulte [Seção 5.1.8.3, “Structured System Variables”](structured-system-variables.html "5.1.8.3 Structured System Variables").

Um Key Cache deve existir antes que você possa atribuir Indexes a ele, ou ocorrerá um erro:

```sql
mysql> CACHE INDEX t1 IN non_existent_cache;
ERROR 1284 (HY000): Unknown key cache 'non_existent_cache'
```

Por padrão, os Indexes de Table são atribuídos ao Key Cache principal (default) criado na inicialização do Server. Quando um Key Cache é destruído, todos os Indexes atribuídos a ele são reatribuídos ao Key Cache default.

A atribuição de Indexes afeta o Server globalmente: Se um Client atribui um Index a um determinado Cache, este Cache é usado para todas as Queries que envolvem o Index, independentemente de qual Client emite as Queries.

[`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement") é suportado para Tables `MyISAM` particionadas. Você pode atribuir um ou mais Indexes para uma, várias ou todas as Partitions a um Key Cache específico. Por exemplo, você pode fazer o seguinte:

```sql
CREATE TABLE pt (c1 INT, c2 VARCHAR(50), INDEX i(c1))
    ENGINE=MyISAM
    PARTITION BY HASH(c1)
    PARTITIONS 4;

SET GLOBAL kc_fast.key_buffer_size = 128 * 1024;
SET GLOBAL kc_slow.key_buffer_size = 128 * 1024;

CACHE INDEX pt PARTITION (p0) IN kc_fast;
CACHE INDEX pt PARTITION (p1, p3) IN kc_slow;
```

O conjunto de instruções anterior realiza as seguintes ações:

* Cria uma Table particionada com 4 Partitions; essas Partitions são automaticamente nomeadas `p0`, ..., `p3`; esta Table possui um Index chamado `i` na coluna `c1`.

* Cria 2 Key Caches chamados `kc_fast` e `kc_slow`.

* Atribui o Index para a Partition `p0` ao Key Cache `kc_fast` e o Index para as Partitions `p1` e `p3` ao Key Cache `kc_slow`; o Index para a Partition restante (`p2`) usa o Key Cache default do Server.

Se você desejar, em vez disso, atribuir os Indexes para todas as Partitions na Table `pt` a um único Key Cache chamado `kc_all`, você pode usar qualquer uma das duas instruções a seguir:

```sql
CACHE INDEX pt PARTITION (ALL) IN kc_all;

CACHE INDEX pt IN kc_all;
```

As duas instruções mostradas são equivalentes, e emitir qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja atribuir Indexes para todas as Partitions de uma Table particionada ao mesmo Key Cache, a cláusula `PARTITION (ALL)` é opcional.

Ao atribuir Indexes para múltiplas Partitions a um Key Cache, as Partitions não precisam ser contíguas e você não precisa listar seus nomes em nenhuma ordem específica. Indexes para quaisquer Partitions que não sejam explicitamente atribuídas a um Key Cache usam automaticamente o Key Cache default do Server.

O pré-carregamento de Index também é suportado para Tables `MyISAM` particionadas. Para mais informações, consulte [Seção 13.7.6.5, “LOAD INDEX INTO CACHE Statement”](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement").