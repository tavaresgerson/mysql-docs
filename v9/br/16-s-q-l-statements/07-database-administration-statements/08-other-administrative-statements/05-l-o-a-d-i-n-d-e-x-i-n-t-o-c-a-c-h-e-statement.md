#### 15.7.8.5 Declaração de CARREGAR ÍNDICE NA CACHE

```
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

A declaração `LOAD INDEX INTO CACHE` pré-carrega um índice de tabela na cache de chaves para a qual ele foi atribuído por uma declaração explícita `CACHE INDEX`, ou na cache de chaves de chaves padrão, caso contrário.

`LOAD INDEX INTO CACHE` aplica-se apenas a tabelas `MyISAM`, incluindo tabelas `MyISAM` particionadas. Além disso, índices em tabelas particionadas podem ser pré-carregados para uma, várias ou todas as particionamentos.

O modificador `IGNORE LEAVES` faz com que apenas os blocos dos nós não-folha do índice sejam pré-carregados.

`IGNORE LEAVES` também é suportado para tabelas `MyISAM` particionadas.

A seguinte declaração pré-carrega nós (blocos de índice) de índices para as tabelas `t1` e `t2`:

```
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

Esta declaração pré-carrega todos os blocos de índice de `t1`. Ela pré-carrega apenas blocos dos nós não-folha de `t2`.

A sintaxe de `LOAD INDEX INTO CACHE` permite que você especifique que apenas índices particulares de uma tabela devem ser pré-carregados. No entanto, a implementação pré-carrega todos os índices da tabela na cache, então não há razão para especificar nada além do nome da tabela.

É possível pré-carregar índices em particionamentos específicos de tabelas `MyISAM` particionadas. Por exemplo, das seguintes duas declarações, a primeira pré-carrega índices para o particionamento `p0` de uma tabela `pt`, enquanto a segunda pré-carrega os índices para os particionamentos `p1` e `p3` da mesma tabela:

```
LOAD INDEX INTO CACHE pt PARTITION (p0);
LOAD INDEX INTO CACHE pt PARTITION (p1, p3);
```

Para pré-carregar os índices para todos os particionamentos na tabela `pt`, você pode usar uma das seguintes duas declarações:

```
LOAD INDEX INTO CACHE pt PARTITION (ALL);

LOAD INDEX INTO CACHE pt;
```

As duas declarações mostradas são equivalentes, e emitir qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja pré-carregar índices para todos os particionamentos de uma tabela particionada, a cláusula `PARTITION (ALL)` é opcional.

Ao pré-carregar índices para múltiplas partições, as partições não precisam ser contínuas e você não precisa listar seus nomes em uma ordem específica.

O comando `LOAD INDEX INTO CACHE ... IGNORE LEAVES` falha a menos que todos os índices de uma tabela tenham o mesmo tamanho de bloco. Para determinar os tamanhos de bloco de índice de uma tabela, use **myisamchk -dv** e verifique a coluna `Blocksize`.