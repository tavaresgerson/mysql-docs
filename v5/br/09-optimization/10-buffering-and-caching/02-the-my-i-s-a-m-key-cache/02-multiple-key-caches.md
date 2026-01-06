#### 8.10.2.2 Caches de Chave Múltiplos

O acesso compartilhado ao cache de chaves melhora o desempenho, mas não elimina completamente a concorrência entre as sessões. Elas ainda competem por estruturas de controle que gerenciam o acesso aos buffers do cache de chaves. Para reduzir ainda mais a concorrência no acesso ao cache de chaves, o MySQL também fornece vários caches de chaves. Essa funcionalidade permite que você atribua diferentes índices de tabela a diferentes caches de chaves.

Quando existem vários caches de chave, o servidor deve saber qual cache usar ao processar consultas para uma determinada tabela `MyISAM`. Por padrão, todos os índices de tabela `MyISAM` são armazenados em um cache de chave padrão. Para atribuir índices de tabela a um cache de chave específico, use a instrução `CACHE INDEX` (consulte a Seção 13.7.6.2, “Instrução CACHE INDEX”). Por exemplo, a seguinte instrução atribui índices das tabelas `t1`, `t2` e `t3` ao cache de chave `hot_cache`:

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

O cache de chaves mencionado em uma declaração `CACHE INDEX` pode ser criado definindo seu tamanho com uma declaração de configuração do parâmetro `SET GLOBAL` ou usando opções de inicialização do servidor. Por exemplo:

```sql
mysql> SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Para destruir um cache de chave, defina seu tamanho para zero:

```sql
mysql> SET GLOBAL keycache1.key_buffer_size=0;
```

Você não pode destruir o cache de chaves padrão. Qualquer tentativa de fazer isso será ignorada:

```sql
mysql> SET GLOBAL key_buffer_size = 0;

mysql> SHOW VARIABLES LIKE 'key_buffer_size';
+-----------------+---------+
| Variable_name   | Value   |
+-----------------+---------+
| key_buffer_size | 8384512 |
+-----------------+---------+
```

As variáveis de cache de chave são variáveis de sistema estruturadas que possuem um nome e componentes. Para `keycache1.key_buffer_size`, `keycache1` é o nome da variável de cache e `key_buffer_size` é o componente da cache. Consulte a Seção 5.1.8.3, “Variáveis de Sistema Estruturadas”, para uma descrição da sintaxe usada para referenciar variáveis de cache de chave estruturadas.

Por padrão, os índices de tabela são atribuídos ao cache de chave principal (padrão) criado na inicialização do servidor. Quando um cache de chave é destruído, todos os índices atribuídos a ele são realocados para o cache de chave padrão.

Para um servidor ocupado, você pode usar uma estratégia que envolve três caches principais:

- Um cache de teclas "quentes" que ocupa 20% do espaço alocado para todos os caches de teclas. Use isso para tabelas que são muito usadas em pesquisas, mas que não são atualizadas.

- Um cache de chave "frio" que ocupa 20% do espaço alocado para todos os caches de chave. Use este cache para tabelas de tamanho médio e com modificações intensas, como tabelas temporárias.

- Um cache de chave "quente" que ocupa 60% do espaço do cache de chave. Use isso como o cache de chave padrão, que será usado por padrão para todas as outras tabelas.

Uma das razões pelas quais o uso de três caches principais é benéfico é que o acesso a uma estrutura de cache principal não bloqueia o acesso aos outros. As declarações que acessam tabelas atribuídas a um cache não competem com as declarações que acessam tabelas atribuídas a outro cache. Ganhos de desempenho também ocorrem por outras razões:

- O cache quente é usado apenas para consultas de recuperação, portanto, seu conteúdo nunca é modificado. Consequentemente, sempre que um bloco de índice precisar ser extraído do disco, o conteúdo do bloco do cache escolhido para substituição não precisa ser descartado primeiro.

- Para um índice atribuído ao cache quente, se não houver consultas que exijam uma varredura do índice, há uma alta probabilidade de que os blocos do índice correspondentes aos nós não-folha do B-tree permaneçam no cache.

- Uma operação de atualização executada com maior frequência para tabelas temporárias é realizada muito mais rapidamente quando o nó atualizado está no cache e não precisa ser lido do disco primeiro. Se o tamanho dos índices das tabelas temporárias for comparável ao tamanho do cache de chaves frias, a probabilidade é muito alta de que o nó atualizado esteja no cache.

A instrução `CACHE INDEX` configura uma associação entre uma tabela e um cache de chave, mas essa associação é perdida toda vez que o servidor é reiniciado. Se você deseja que a associação seja efetiva a cada vez que o servidor for iniciado, uma maneira de realizar isso é usar um arquivo de opções: Inclua configurações variáveis que configurem seus caches de chave e uma variável de sistema `init_file` que nomeia um arquivo contendo as instruções `CACHE INDEX` a serem executadas. Por exemplo:

```sql
key_buffer_size = 4G
hot_cache.key_buffer_size = 2G
cold_cache.key_buffer_size = 2G
init_file=/path/to/data-directory/mysqld_init.sql
```

As declarações no `mysqld_init.sql` são executadas sempre que o servidor é iniciado. O arquivo deve conter uma declaração SQL por linha. O exemplo a seguir atribui várias tabelas a `hot_cache` e `cold_cache`:

```sql
CACHE INDEX db1.t1, db1.t2, db2.t3 IN hot_cache
CACHE INDEX db1.t4, db2.t5, db2.t6 IN cold_cache
```
