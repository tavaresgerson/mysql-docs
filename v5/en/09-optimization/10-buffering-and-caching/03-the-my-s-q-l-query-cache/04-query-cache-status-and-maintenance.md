#### 8.10.3.4 Status e Manutenção do Query Cache

Nota

O Query Cache foi descontinuado (deprecated) a partir do MySQL 5.7.20 e foi removido no MySQL 8.0.

Para verificar se o Query Cache está presente no seu servidor MySQL, use a seguinte instrução:

```sql
mysql> SHOW VARIABLES LIKE 'have_query_cache';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| have_query_cache | YES   |
+------------------+-------+
```

Você pode desfragmentar o Query Cache para melhor utilizar sua memória com a instrução `FLUSH QUERY CACHE`. A instrução não remove nenhuma Query do Cache.

A instrução `RESET QUERY CACHE` remove todos os resultados de Query do Query Cache. A instrução `FLUSH TABLES` também faz isso.

Para monitorar o desempenho do Query Cache, use `SHOW STATUS` para visualizar as variáveis de Status do Cache:

```sql
mysql> SHOW STATUS LIKE 'Qcache%';
+-------------------------+--------+
| Variable_name           | Value  |
+-------------------------+--------+
| Qcache_free_blocks      | 36     |
| Qcache_free_memory      | 138488 |
| Qcache_hits             | 79570  |
| Qcache_inserts          | 27087  |
| Qcache_lowmem_prunes    | 3114   |
| Qcache_not_cached       | 22989  |
| Qcache_queries_in_cache | 415    |
| Qcache_total_blocks     | 912    |
+-------------------------+--------+
```

As descrições de cada uma dessas variáveis são fornecidas na Seção 5.1.9, “Server Status Variables”. Alguns usos delas são descritos aqui.

O número total de Queries `SELECT` é dado por esta fórmula:

```sql
  Com_select
+ Qcache_hits
+ queries with errors found by parser
```

O valor de `Com_select` é dado por esta fórmula:

```sql
  Qcache_inserts
+ Qcache_not_cached
+ queries with errors found during the column-privileges check
```

O Query Cache utiliza blocos de comprimento variável, portanto, `Qcache_total_blocks` e `Qcache_free_blocks` podem indicar fragmentação da memória do Query Cache. Após o `FLUSH QUERY CACHE`, resta apenas um único bloco livre.

Cada Query em Cache requer um mínimo de dois blocos (um para o texto da Query e um ou mais para os resultados da Query). Além disso, cada Table usada por uma Query requer um bloco. No entanto, se duas ou mais Queries usarem a mesma Table, apenas um bloco de Table precisa ser alocado.

As informações fornecidas pela variável de Status `Qcache_lowmem_prunes` podem ajudar você a ajustar (tune) o tamanho do Query Cache. Ela contabiliza o número de Queries que foram removidas do Cache para liberar memória para o Cache de novas Queries. O Query Cache utiliza uma estratégia de least recently used (LRU) para decidir quais Queries remover do Cache. Informações de ajuste (tuning) são fornecidas na Seção 8.10.3.3, “Query Cache Configuration”.