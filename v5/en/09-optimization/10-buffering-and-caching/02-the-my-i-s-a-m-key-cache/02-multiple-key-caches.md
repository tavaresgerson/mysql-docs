#### 8.10.2.2 Múltiplos Key Caches

O acesso compartilhado ao key cache melhora o desempenho, mas não elimina totalmente a contenção entre as sessões. Elas ainda competem por estruturas de controle que gerenciam o acesso aos buffers do key cache. Para reduzir ainda mais a contenção de acesso ao key cache, o MySQL também oferece múltiplos key caches. Este recurso permite que você atribua diferentes table indexes a diferentes key caches.

Onde há múltiplos key caches, o server deve saber qual cache usar ao processar queries para uma determinada tabela `MyISAM`. Por padrão, todos os table indexes `MyISAM` são armazenados em cache no default key cache. Para atribuir table indexes a um key cache específico, use a instrução `CACHE INDEX` (consulte a Seção 13.7.6.2, “Instrução CACHE INDEX”). Por exemplo, a instrução a seguir atribui indexes das tabelas `t1`, `t2` e `t3` ao key cache denominado `hot_cache`:

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

O key cache referenciado em uma instrução `CACHE INDEX` pode ser criado definindo seu tamanho com uma instrução de configuração de parâmetro `SET GLOBAL` ou usando opções de startup do server. Por exemplo:

```sql
mysql> SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Para destruir um key cache, defina seu tamanho como zero:

```sql
mysql> SET GLOBAL keycache1.key_buffer_size=0;
```

Você não pode destruir o default key cache. Qualquer tentativa de fazer isso é ignorada:

```sql
mysql> SET GLOBAL key_buffer_size = 0;

mysql> SHOW VARIABLES LIKE 'key_buffer_size';
+-----------------+---------+
| Variable_name   | Value   |
+-----------------+---------+
| key_buffer_size | 8384512 |
+-----------------+---------+
```

Variáveis de key cache são structured system variables que possuem um nome e componentes. Para `keycache1.key_buffer_size`, `keycache1` é o nome da variável do cache e `key_buffer_size` é o componente do cache. Consulte a Seção 5.1.8.3, “Structured System Variables”, para obter uma descrição da sintaxe usada para se referir a structured key cache system variables.

Por padrão, table indexes são atribuídos ao key cache principal (default) criado durante o startup do server. Quando um key cache é destruído, todos os indexes atribuídos a ele são reatribuídos ao default key cache.

Para um server movimentado, você pode usar uma estratégia que envolve três key caches:

* Um key cache “hot” (quente) que ocupa 20% do espaço alocado para todos os key caches. Use-o para tabelas que são muito usadas para buscas (searches), mas que não são atualizadas.

* Um key cache “cold” (frio) que ocupa 20% do espaço alocado para todos os key caches. Use este cache para tabelas de tamanho médio intensamente modificadas, como temporary tables.

* Um key cache “warm” (morno) que ocupa 60% do espaço do key cache. Empregue-o como o default key cache, a ser usado por padrão para todas as outras tabelas.

Uma razão pela qual o uso de três key caches é benéfico é que o acesso à estrutura de um key cache não bloqueia o acesso aos outros. Instruções que acessam tabelas atribuídas a um cache não competem com instruções que acessam tabelas atribuídas a outro cache. Os ganhos de performance ocorrem também por outras razões:

* O hot cache é usado apenas para retrieval queries, portanto, seu conteúdo nunca é modificado. Consequentemente, sempre que um index block precisar ser puxado do disk, o conteúdo do cache block escolhido para substituição não precisa ser descarregado (flushed) primeiro.

* Para um index atribuído ao hot cache, se não houver queries que exijam um index scan, há uma alta probabilidade de que os index blocks correspondentes aos nonleaf nodes da B-tree do index permaneçam no cache.

* Uma operation de update executada com mais frequência para temporary tables é realizada muito mais rapidamente quando o node atualizado está no cache e não precisa ser lido do disk primeiro. Se o tamanho dos indexes das temporary tables for comparável ao tamanho do cold key cache, a probabilidade é muito alta de que o node atualizado esteja no cache.

A instrução `CACHE INDEX` estabelece uma associação entre uma tabela e um key cache, mas a associação é perdida toda vez que o server reinicia. Se você quiser que a associação entre em vigor toda vez que o server iniciar, uma maneira de conseguir isso é usar um option file: Inclua configurações de variáveis que configurem seus key caches e uma system variable `init_file` que nomeie um arquivo contendo instruções `CACHE INDEX` a serem executadas. Por exemplo:

```sql
key_buffer_size = 4G
hot_cache.key_buffer_size = 2G
cold_cache.key_buffer_size = 2G
init_file=/path/to/data-directory/mysqld_init.sql
```

As instruções em `mysqld_init.sql` são executadas toda vez que o server inicia. O arquivo deve conter uma instrução SQL por linha. O exemplo a seguir atribui várias tabelas a `hot_cache` e `cold_cache`:

```sql
CACHE INDEX db1.t1, db1.t2, db2.t3 IN hot_cache
CACHE INDEX db1.t4, db2.t5, db2.t6 IN cold_cache
```