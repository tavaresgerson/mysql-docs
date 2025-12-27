#### 15.7.8.2 Declaração de CACHE INDEX

```
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

A declaração `CACHE INDEX` atribui índices de tabela a um cache de chave específico. Ela se aplica apenas a tabelas `MyISAM`, incluindo tabelas `MyISAM` particionadas. Após os índices terem sido atribuídos, eles podem ser pré-carregados no cache, se desejado, com `LOAD INDEX INTO CACHE`.

A seguinte declaração atribui índices das tabelas `t1`, `t2` e `t3` ao cache de chave denominado `hot_cache`:

```
mysql> CACHE INDEX t1, t2, t3 IN hot_cache;
+---------+--------------------+----------+----------+
| Table   | Op                 | Msg_type | Msg_text |
+---------+--------------------+----------+----------+
| test.t1 | assign_to_keycache | status   | OK       |
| test.t2 | assign_to_keycache | status   | OK       |
| test.t3 | assign_to_keycache | status   | OK       |
+---------+--------------------+----------+----------+
```

A sintaxe de `CACHE INDEX` permite que você especifique que apenas certos índices de uma tabela devem ser atribuídos ao cache. No entanto, a implementação atribui todos os índices da tabela ao cache, então não há razão para especificar nada além do nome da tabela.

O cache de chave referido em uma declaração `CACHE INDEX` pode ser criado definindo seu tamanho com uma declaração de configuração de parâmetro ou nas configurações de parâmetros do servidor. Por exemplo:

```
SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Os parâmetros do cache de chave são acessados como membros de uma variável de sistema estruturada. Veja a Seção 7.1.9.5, “Variáveis de Sistema Estruturadas”.

Um cache de chave deve existir antes de você atribuir índices a ele, ou ocorrerá um erro:

```
mysql> CACHE INDEX t1 IN non_existent_cache;
ERROR 1284 (HY000): Unknown key cache 'non_existent_cache'
```

Por padrão, os índices de tabela são atribuídos ao cache de chave principal (padrão) criado no início do servidor. Quando um cache de chave é destruído, todos os índices atribuídos a ele são reatribuídos ao cache de chave padrão.

A atribuição de índice afeta o servidor globalmente: Se um cliente atribuir um índice a um cache específico, esse cache é usado para todas as consultas que envolvem o índice, independentemente de qual cliente emitir as consultas.

`CACHE INDEX` é suportado para tabelas `MyISAM` particionadas. Você pode atribuir um ou mais índices para uma, várias ou todas as particionamentos a um cache de chave específico. Por exemplo, você pode fazer o seguinte:

```
CREATE TABLE pt (c1 INT, c2 VARCHAR(50), INDEX i(c1))
    ENGINE=MyISAM
    PARTITION BY HASH(c1)
    PARTITIONS 4;

SET GLOBAL kc_fast.key_buffer_size = 128 * 1024;
SET GLOBAL kc_slow.key_buffer_size = 128 * 1024;

CACHE INDEX pt PARTITION (p0) IN kc_fast;
CACHE INDEX pt PARTITION (p1, p3) IN kc_slow;
```

O conjunto anterior de declarações realiza as seguintes ações:

* Cria uma tabela particionada com 4 particionamentos; esses particionamentos são nomeados automaticamente como `p0`, ..., `p3`; essa tabela tem um índice chamado `i` na coluna `c1`.

* Cria 2 caches de chave chamados `kc_fast` e `kc_slow`.

* Atribui o índice para a particionamento `p0` ao cache de chave `kc_fast` e o índice para as particionamentos `p1` e `p3` ao cache de chave `kc_slow`; o índice para a particionamento restante (`p2`) usa o cache de chave padrão do servidor.

Se você deseja, em vez disso, atribuir os índices para todas as particionamentos na tabela `pt` a um único cache de chave chamado `kc_all`, você pode usar uma das duas seguintes declarações:

```
CACHE INDEX pt PARTITION (ALL) IN kc_all;

CACHE INDEX pt IN kc_all;
```

As duas declarações mostradas acima são equivalentes, e emitir qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja atribuir índices para todas as particionamentos de uma tabela particionada ao mesmo cache de chave, a cláusula `PARTITION (ALL)` é opcional.

Ao atribuir índices para múltiplos particionamentos a um cache de chave, os particionamentos não precisam ser contínuos e você não precisa listar seus nomes em qualquer ordem específica. Os índices para quaisquer particionamentos não explicitamente atribuídos a um cache de chave usam automaticamente o cache de chave padrão do servidor.

O pré-carregamento de índice também é suportado para tabelas `MyISAM` particionadas. Para mais informações, consulte a Seção 15.7.8.5, “Declaração LOAD INDEX INTO CACHE”.