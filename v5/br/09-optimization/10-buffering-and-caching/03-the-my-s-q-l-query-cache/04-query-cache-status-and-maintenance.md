#### 8.10.3.4 Verificar o status e a manutenção do cache de consultas

Nota

O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

Para verificar se o cache de consultas está presente no seu servidor MySQL, use a seguinte instrução:

```sql
mysql> SHOW VARIABLES LIKE 'have_query_cache';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| have_query_cache | YES   |
+------------------+-------+
```

Você pode desfragmentar o cache de consultas para utilizar melhor sua memória com a instrução `FLUSH QUERY CACHE`. A instrução não remove nenhuma consulta do cache.

A instrução `RESET QUERY CACHE` remove todos os resultados da consulta do cache de consulta. A instrução `FLUSH TABLES` também faz isso.

Para monitorar o desempenho do cache de consultas, use `SHOW STATUS` para visualizar as variáveis de status do cache:

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

As descrições de cada uma dessas variáveis estão disponíveis na Seção 5.1.9, “Variáveis de Status do Servidor”. Algumas utilizações delas são descritas aqui.

O número total de consultas `SELECT` é dado por esta fórmula:

```sql
  Com_select
+ Qcache_hits
+ queries with errors found by parser
```

O valor `Com_select` é dado por esta fórmula:

```sql
  Qcache_inserts
+ Qcache_not_cached
+ queries with errors found during the column-privileges check
```

O cache de consulta usa blocos de comprimento variável, portanto, `Qcache_total_blocks` e `Qcache_free_blocks` podem indicar fragmentação da memória do cache de consulta. Após `FLUSH QUERY CACHE`, apenas um único bloco livre permanece.

Cada consulta armazenada em cache requer um mínimo de dois blocos (um para o texto da consulta e um ou mais para os resultados da consulta). Além disso, cada tabela usada por uma consulta requer um bloco. No entanto, se duas ou mais consultas usarem a mesma tabela, apenas um bloco de tabela precisa ser alocado.

As informações fornecidas pela variável de status `Qcache_lowmem_prunes` podem ajudá-lo a ajustar o tamanho do cache de consultas. Ela conta o número de consultas que foram removidas do cache para liberar memória para o armazenamento de novas consultas. O cache de consultas usa uma estratégia de uso menos recentemente (LRU) para decidir quais consultas remover do cache. As informações de ajuste estão disponíveis na Seção 8.10.3.3, “Configuração do Cache de Consultas”.
