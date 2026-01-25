#### 13.7.6.5 Declaração LOAD INDEX INTO CACHE

```sql
LOAD INDEX INTO CACHE
  tbl_index_list [, tbl_index_list] ...

tbl_index_list:
  tbl_name
    [PARTITION (partition_list)]
    [{INDEX|KEY} (index_name[, index_name] ...)]
    [IGNORE LEAVES]

partition_list: {
    partition_name[, partition_name] ...
  | ALL
}
```

O [`LOAD INDEX INTO CACHE`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement") pré-carrega um Index de tabela no key cache ao qual ele foi atribuído por uma declaração [`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement") explícita, ou no default key cache, caso contrário.

O [`LOAD INDEX INTO CACHE`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement") aplica-se apenas a tabelas `MyISAM`, incluindo tabelas `MyISAM` particionadas. Além disso, Indexes em tabelas particionadas podem ser pré-carregados para uma, várias ou todas as partições.

O modificador `IGNORE LEAVES` faz com que apenas Blocks para os nós nonleaf do Index sejam pré-carregados.

`IGNORE LEAVES` também é suportado para tabelas `MyISAM` particionadas.

A declaração a seguir pré-carrega nós (Blocks de Index) de Indexes para as tabelas `t1` e `t2`:

```sql
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

Esta declaração pré-carrega todos os Blocks de Index de `t1`. Ela pré-carrega apenas Blocks para os nós nonleaf de `t2`.

A sintaxe do [`LOAD INDEX INTO CACHE`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement") permite que você especifique que apenas Indexes específicos de uma tabela devem ser pré-carregados. No entanto, a implementação pré-carrega todos os Indexes da tabela no cache, portanto, não há razão para especificar nada além do nome da tabela.

É possível pré-carregar Indexes em partições específicas de tabelas `MyISAM` particionadas. Por exemplo, das 2 declarações a seguir, a primeira pré-carrega Indexes para a Partition `p0` de uma tabela particionada `pt`, enquanto a segunda pré-carrega os Indexes para as Partitions `p1` e `p3` da mesma tabela:

```sql
LOAD INDEX INTO CACHE pt PARTITION (p0);
LOAD INDEX INTO CACHE pt PARTITION (p1, p3);
```

Para pré-carregar os Indexes para todas as partições na tabela `pt`, você pode usar qualquer uma das duas declarações a seguir:

```sql
LOAD INDEX INTO CACHE pt PARTITION (ALL);

LOAD INDEX INTO CACHE pt;
```

As duas declarações que acabamos de mostrar são equivalentes, e executar qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja pré-carregar Indexes para todas as partições de uma tabela particionada, a cláusula `PARTITION (ALL)` é opcional.

Ao pré-carregar Indexes para múltiplas partições, as partições não precisam ser contíguas, e você não precisa listar seus nomes em nenhuma ordem específica.

O [`LOAD INDEX INTO CACHE ... IGNORE LEAVES`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement") falha a menos que todos os Indexes em uma tabela tenham o mesmo block size. Para determinar os block sizes de Index para uma tabela, use [**myisamchk -dv**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") e verifique a coluna `Blocksize`.