#### 13.7.6.5. Declaração de carregamento de índice em cache

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

A instrução `LOAD INDEX INTO CACHE` pré-carrega um índice de tabela no cache de chaves ao qual ele foi atribuído por uma instrução explícita `CACHE INDEX`, ou, caso contrário, no cache de chaves padrão.

`CARREGAR ÍNDICE NA CACHE` aplica-se apenas a tabelas `MyISAM`, incluindo tabelas `MyISAM` particionadas. Além disso, índices em tabelas particionadas podem ser pré-carregados para uma, várias ou todas as partições.

O modificador `IGNORE LEAVES` faz com que apenas os blocos dos nós não-folha do índice sejam pré-carregados.

O comando `IGNORE LEAVES` também é suportado para tabelas `MyISAM` particionadas.

A seguinte declaração pré-carrega os nós (blocos de índice) dos índices para as tabelas `t1` e `t2`:

```sql
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

Esta declaração pré-carrega todos os blocos de índice de `t1`. Ela pré-carrega apenas os blocos dos nós não-folha de `t2`.

A sintaxe de `LOAD INDEX INTO CACHE` permite que você especifique que apenas certos índices de uma tabela devem ser pré-carregados. No entanto, a implementação pré-carrega todos os índices da tabela no cache, então não há motivo para especificar nada além do nome da tabela.

É possível pré-carregar índices em partições específicas de tabelas `MyISAM` particionadas. Por exemplo, das seguintes duas instruções, a primeira pré-carrega índices para a partição `p0` de uma tabela `pt` particionada, enquanto a segunda pré-carrega os índices para as partições `p1` e `p3` da mesma tabela:

```sql
LOAD INDEX INTO CACHE pt PARTITION (p0);
LOAD INDEX INTO CACHE pt PARTITION (p1, p3);
```

Para pré-carregar os índices para todas as partições na tabela `pt`, você pode usar uma das duas seguintes instruções:

```sql
LOAD INDEX INTO CACHE pt PARTITION (ALL);

LOAD INDEX INTO CACHE pt;
```

As duas declarações mostradas acima são equivalentes, e emitir qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja pré-carregar índices para todas as partições de uma tabela particionada, a cláusula `PARTITION (ALL)` é opcional.

Ao pré-carregar índices para múltiplas partições, as partições não precisam ser contínuas e você não precisa listar seus nomes em qualquer ordem específica.

`LOAD INDEX INTO CACHE ... IGNORE LEAVES` falha a menos que todos os índices em uma tabela tenham o mesmo tamanho de bloco. Para determinar os tamanhos de bloco de índice para uma tabela, use **myisamchk -dv** e verifique a coluna `Blocksize`.
