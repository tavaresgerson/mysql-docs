#### 13.7.6.2 Declaração de ÍNDICE DE CACHE

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

A declaração `CACHE INDEX` atribui índices de tabela a um cache de chave específico. Ela se aplica apenas a tabelas `MyISAM`, incluindo tabelas `MyISAM` particionadas. Após os índices terem sido atribuídos, eles podem ser pré-carregados no cache, se desejado, com `LOAD INDEX INTO CACHE`.

A seguinte declaração atribui índices das tabelas `t1`, `t2` e `t3` ao cache de chaves denominado `hot_cache`:

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

A sintaxe de `CACHE INDEX` permite que você especifique que apenas certos índices de uma tabela devem ser atribuídos ao cache. No entanto, a implementação atribui todos os índices da tabela ao cache, portanto, não há motivo para especificar nada além do nome da tabela.

O cache de chave mencionado em uma declaração `CACHE INDEX` pode ser criado definindo seu tamanho com uma declaração de configuração de parâmetro ou nas configurações de parâmetros do servidor. Por exemplo:

```sql
SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Os parâmetros de cache principais são acessados como membros de uma variável de sistema estruturada. Veja Seção 5.1.8.3, “Variáveis de Sistema Estruturadas”.

Um cache principal deve existir antes de você atribuir índices a ele, ou ocorrerá um erro:

```sql
mysql> CACHE INDEX t1 IN non_existent_cache;
ERROR 1284 (HY000): Unknown key cache 'non_existent_cache'
```

Por padrão, os índices de tabela são atribuídos ao cache de chave principal (padrão) criado na inicialização do servidor. Quando um cache de chave é destruído, todos os índices atribuídos a ele são realocados para o cache de chave padrão.

A atribuição de índice afeta o servidor globalmente: se um cliente atribuir um índice a um cache específico, esse cache será usado para todas as consultas que envolvam o índice, independentemente de qual cliente emitir as consultas.

O `CACHE INDEX` é suportado para tabelas `MyISAM` particionadas. Você pode atribuir um ou mais índices para uma, várias ou todas as partições de uma cache de chave específica. Por exemplo, você pode fazer o seguinte:

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

O conjunto anterior de declarações realiza as seguintes ações:

- Cria uma tabela particionada com 4 particionações; essas particionações são nomeadas automaticamente como `p0`, ..., `p3`; essa tabela tem um índice chamado `i` na coluna `c1`.

- Cria 2 caches principais chamados `kc_fast` e `kc_slow`

- Atribui o índice para a partição `p0` ao cache de cache de chaves `kc_fast` e o índice para as partições `p1` e `p3` ao cache de cache de chaves `kc_slow`; o índice para a partição restante (`p2`) usa o cache de cache de chaves padrão do servidor.

Se você preferir atribuir os índices para todas as partições na tabela `pt` a um cache de chave único chamado `kc_all`, você pode usar uma das duas seguintes instruções:

```sql
CACHE INDEX pt PARTITION (ALL) IN kc_all;

CACHE INDEX pt IN kc_all;
```

As duas declarações mostradas acima são equivalentes, e emitir qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja atribuir índices para todas as partições de uma tabela particionada ao mesmo cache de chaves, a cláusula `PARTITION (ALL)` é opcional.

Ao atribuir índices para múltiplas partições a um cache de chaves, as partições não precisam ser contínuas, e você não precisa listar seus nomes em qualquer ordem específica. Os índices para quaisquer partições que não sejam explicitamente atribuídas a um cache de chaves de servidor usam automaticamente o cache de chaves padrão do servidor.

O pré-carregamento do índice também é suportado para tabelas `MyISAM` particionadas. Para mais informações, consulte Seção 13.7.6.5, “Instrução LOAD INDEX INTO CACHE”.
