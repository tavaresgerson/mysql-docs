#### 8.10.3.3 Configuração do Cache de Consulta

Nota

O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

A variável de sistema `have_query_cache` indica se o cache de consultas está disponível:

```sql
mysql> SHOW VARIABLES LIKE 'have_query_cache';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| have_query_cache | YES   |
+------------------+-------+
```

Ao usar um binário padrão do MySQL, esse valor é sempre `SIM`, mesmo que o cache de consultas esteja desativado.

Várias outras variáveis do sistema controlam a operação do cache de consultas. Essas podem ser definidas em um arquivo de opções ou na linha de comando ao iniciar o **mysqld**. As variáveis de sistema do cache de consultas têm todos nomes que começam com `query_cache_`. Elas são descritas brevemente na Seção 5.1.7, “Variáveis do Sistema do Servidor”, com informações adicionais de configuração fornecidas aqui.

Para definir o tamanho do cache de consultas, defina a variável de sistema `query_cache_size`. Definindo-a como 0, desativa o cache de consultas, assim como definir `query_cache_type=0`. Por padrão, o cache de consultas está desativado. Isso é alcançado usando um tamanho padrão de 1M, com um valor padrão para `query_cache_type` de 0.

Para reduzir significativamente os custos operacionais, inicie o servidor com `query_cache_type=0` se você não pretende usar o cache de consultas.

Nota

Ao usar o Assistente de Configuração do Windows para instalar ou configurar o MySQL, o valor padrão para `query_cache_size` é configurado automaticamente para você com base nos diferentes tipos de configuração disponíveis. Ao usar o Assistente de Configuração do Windows, o cache de consultas pode ser habilitado (ou seja, definido para um valor diferente de zero) devido à configuração selecionada. O cache de consultas também é controlado pelo ajuste da variável `query_cache_type`. Verifique os valores dessas variáveis conforme configuradas no seu arquivo `my.ini` após a configuração ter sido realizada.

Quando você define `query_cache_size` para um valor não nulo, lembre-se de que o cache de consultas precisa de um tamanho mínimo de cerca de 40 KB para alocar suas estruturas. (O tamanho exato depende da arquitetura do sistema.) Se você definir o valor muito pequeno, receberá uma mensagem de aviso, como neste exemplo:

```sql
mysql> SET GLOBAL query_cache_size = 40000;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1282
Message: Query cache failed to set size 39936;
         new query cache size is 0

mysql> SET GLOBAL query_cache_size = 41984;
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW VARIABLES LIKE 'query_cache_size';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| query_cache_size | 41984 |
+------------------+-------+
```

Para que o cache de consultas possa realmente armazenar resultados de qualquer consulta, seu tamanho deve ser definido como maior:

```sql
mysql> SET GLOBAL query_cache_size = 1000000;
Query OK, 0 rows affected (0.04 sec)

mysql> SHOW VARIABLES LIKE 'query_cache_size';
+------------------+--------+
| Variable_name    | Value  |
+------------------+--------+
| query_cache_size | 999424 |
+------------------+--------+
1 row in set (0.00 sec)
```

O valor `query_cache_size` é ajustado para o bloco de bytes mais próximo de 1024. O valor reportado pode, portanto, ser diferente do valor que você atribuiu.

Se o tamanho do cache de consultas for maior que 0, a variável `query_cache_type` influencia o seu funcionamento. Essa variável pode ser definida para os seguintes valores:

- Um valor de `0` ou `OFF` impede o armazenamento em cache ou a recuperação de resultados armazenados em cache.

- Um valor de `1` ou `ON` habilita o cache, exceto para as instruções que começam com `SELECT SQL_NO_CACHE`.

- Um valor de `2` ou `DEMAND` faz com que o cache seja armazenado apenas para as instruções que começam com `SELECT SQL_CACHE`.

Se `query_cache_size` for 0, você também deve definir a variável `query_cache_type` para

0. Nesse caso, o servidor não adquire o mutex do cache de consulta de forma alguma, o que significa que o cache de consulta não pode ser ativado em tempo de execução e há um overhead reduzido na execução da consulta.

Definir o valor `GLOBAL` de `query_cache_type` determina o comportamento do cache de consultas para todos os clientes que se conectam após a alteração ser feita. Clientes individuais podem controlar o comportamento do cache para sua própria conexão, definindo o valor `SESSION` de `query_cache_type`. Por exemplo, um cliente pode desabilitar o uso do cache de consultas para suas próprias consultas da seguinte maneira:

```sql
mysql> SET SESSION query_cache_type = OFF;
```

Se você definir `query_cache_type` durante a inicialização do servidor (em vez de durante a execução com uma instrução `SET`), apenas os valores numéricos são permitidos.

Para controlar o tamanho máximo dos resultados individuais de consulta que podem ser cacheados, defina a variável de sistema `query_cache_limit`. O valor padrão é de 1 MB.

Tenha cuidado para não definir o tamanho do cache como muito grande. Devido à necessidade de os threads bloquear o cache durante as atualizações, você pode encontrar problemas de disputa de bloqueio com um cache muito grande.

Nota

Você pode definir o tamanho máximo que pode ser especificado para o cache de consultas em tempo de execução com a instrução `SET` usando a opção `--maximum-query_cache_size=32M` na linha de comando ou no arquivo de configuração.

Quando uma consulta deve ser armazenada no cache, seu resultado (os dados enviados ao cliente) é armazenado no cache da consulta durante a recuperação do resultado. Portanto, os dados geralmente não são manipulados em um único bloco. O cache da consulta aloca blocos para armazenar esses dados conforme necessário, então, quando um bloco é preenchido, um novo bloco é alocado. Como a operação de alocação de memória é custosa (em termos de tempo), o cache da consulta aloca blocos com um tamanho mínimo definido pela variável de sistema `query_cache_min_res_unit`. Quando uma consulta é executada, o último bloco de resultado é reduzido ao tamanho real dos dados para liberar a memória não utilizada. Dependendo dos tipos de consultas que seu servidor executa, você pode achar útil ajustar o valor de `query_cache_min_res_unit`:

- O valor padrão de `query_cache_min_res_unit` é de 4 KB. Isso deve ser adequado para a maioria dos casos.

- Se você tiver muitas consultas com resultados pequenos, o tamanho padrão do bloco pode levar à fragmentação da memória, conforme indicado por um grande número de blocos livres. A fragmentação pode forçar o cache de consultas a remover (deletar) consultas do cache devido à falta de memória. Nesse caso, diminua o valor de `query_cache_min_res_unit`. O número de blocos livres e de consultas removidas devido à poda é dado pelos valores das variáveis `Qcache_free_blocks` e `Qcache_lowmem_prunes`.

- Se a maioria das suas consultas tiver muitos resultados (verifique as variáveis de status `Qcache_total_blocks` e `Qcache_queries_in_cache`), você pode aumentar o desempenho aumentando `query_cache_min_res_unit`. No entanto, tenha cuidado para não torná-lo muito grande (veja o item anterior).
