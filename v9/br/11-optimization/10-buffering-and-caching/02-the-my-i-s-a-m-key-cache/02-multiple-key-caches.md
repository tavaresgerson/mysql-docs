#### 10.10.2.2 Caches de Chave Múltiplos

Nota

A partir do MySQL 9.5, a sintaxe de variável estruturada com parte composta discutida aqui para se referir a múltiplos caches de chave `MyISAM` é desatualizada.

O acesso compartilhado ao cache de chave melhora o desempenho, mas não elimina completamente a concorrência entre as sessões. Elas ainda competem pelo controle das estruturas que gerenciam o acesso aos buffers do cache de chave. Para reduzir ainda mais a concorrência no acesso ao cache de chave, o MySQL também fornece múltiplos caches de chave. Essa funcionalidade permite que você atribua diferentes índices de tabela a diferentes caches de chave.

Quando há múltiplos caches de chave, o servidor deve saber qual cache usar ao processar consultas para uma determinada tabela `MyISAM`. Por padrão, todos os índices de tabela `MyISAM` são cacheados no cache de chave padrão. Para atribuir índices de tabela a um cache de chave específico, use a instrução `CACHE INDEX` (consulte a Seção 15.7.8.2, “Instrução CACHE INDEX”). Por exemplo, a seguinte instrução atribui índices das tabelas `t1`, `t2` e `t3` ao cache de chave chamado `hot_cache`:

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

O cache de chave referenciado em uma instrução `CACHE INDEX` pode ser criado definindo seu tamanho com uma instrução de definição de parâmetro global ou usando opções de inicialização do servidor. Por exemplo:

```
mysql> SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Para destruir um cache de chave, defina seu tamanho para zero:

```
mysql> SET GLOBAL keycache1.key_buffer_size=0;
```

Você não pode destruir o cache de chave padrão. Qualquer tentativa de fazer isso é ignorada:

```
mysql> SET GLOBAL key_buffer_size = 0;

mysql> SHOW VARIABLES LIKE 'key_buffer_size';
+-----------------+---------+
| Variable_name   | Value   |
+-----------------+---------+
| key_buffer_size | 8384512 |
+-----------------+---------+
```

As variáveis de cache de chave são variáveis de sistema estruturadas que têm um nome e componentes. Para `keycache1.key_buffer_size`, `keycache1` é o nome da variável de cache e `key_buffer_size` é o componente de cache. Consulte a Seção 7.1.9.5, “Variáveis de Sistema Estruturadas”, para uma descrição da sintaxe usada para se referir a variáveis de sistema de cache de chave estruturadas.

Por padrão, os índices de tabela são atribuídos ao cache de chave principal (padrão) criado na inicialização do servidor. Quando um cache de chave é destruído, todos os índices atribuídos a ele são realocados para o cache de chave padrão.

Para um servidor ocupado, você pode usar uma estratégia que envolve três caches de chave:

* Um cache de chave "quente" que ocupa 20% do espaço alocado para todos os caches de chave. Use isso para tabelas que são muito usadas em buscas, mas que não são atualizadas.

* Um cache de chave "frio" que ocupa 20% do espaço alocado para todos os caches de chave. Use esse cache para tabelas de tamanho médio e que são modificadas intensamente, como tabelas temporárias.

* Um cache de chave "quente" que ocupa 60% do espaço do cache de chave. Empregue esse como o cache de chave padrão, para ser usado por padrão para todas as outras tabelas.

Uma das razões pelas quais o uso de três caches de chave é benéfico é que o acesso a uma estrutura de cache de chave não bloqueia o acesso aos outros. As instruções que acessam tabelas atribuídas a um cache não competem com instruções que acessam tabelas atribuídas a outro cache. Ganhos de desempenho ocorrem também por outros motivos:

* O cache quente é usado apenas para consultas de recuperação, então seu conteúdo nunca é modificado. Consequentemente, sempre que um bloco de índice precisa ser puxado do disco, o conteúdo do bloco de cache escolhido para substituição não precisa ser esvaziado primeiro.

* Para um índice atribuído ao cache quente, se não houver consultas que exijam uma varredura do índice, há uma alta probabilidade de que os blocos de índice correspondentes aos nós não-folha do índice B-tree permaneçam no cache.

Uma operação de atualização executada com mais frequência para tabelas temporárias é realizada muito mais rapidamente quando o nó atualizado está no cache e não precisa ser lido do disco primeiro. Se o tamanho dos índices das tabelas temporárias for comparável ao tamanho do cache de chaves frias, a probabilidade é muito alta de que o nó atualizado esteja no cache.

A instrução `CACHE INDEX` estabelece uma associação entre uma tabela e um cache de chaves, mas a associação é perdida toda vez que o servidor é reiniciado. Se você deseja que a associação tenha efeito cada vez que o servidor for iniciado, uma maneira de realizar isso é usar um arquivo de opções: Inclua configurações variáveis que configurem seus caches de chaves e uma variável de sistema `init_file` que nomeia um arquivo contendo as instruções `CACHE INDEX` a serem executadas. Por exemplo:

```
key_buffer_size = 4G
hot_cache.key_buffer_size = 2G
cold_cache.key_buffer_size = 2G
init_file=/path/to/data-directory/mysqld_init.sql
```

As instruções em `mysqld_init.sql` são executadas toda vez que o servidor é iniciado. O arquivo deve conter uma instrução SQL por linha. O exemplo a seguir atribui várias tabelas a cada um dos `hot_cache` e `cold_cache`:

```
CACHE INDEX db1.t1, db1.t2, db2.t3 IN hot_cache
CACHE INDEX db1.t4, db2.t5, db2.t6 IN cold_cache
```