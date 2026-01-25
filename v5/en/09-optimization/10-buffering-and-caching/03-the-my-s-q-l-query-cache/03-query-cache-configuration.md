#### 8.10.3.3 Configuração do Query Cache

Nota

O query cache está obsoleto (deprecated) a partir do MySQL 5.7.20 e foi removido no MySQL 8.0.

A variável de sistema do servidor `have_query_cache` indica se o query cache está disponível:

```sql
mysql> SHOW VARIABLES LIKE 'have_query_cache';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| have_query_cache | YES   |
+------------------+-------+
```

Ao usar um binário MySQL padrão, este valor é sempre `YES`, mesmo que o cache de Querys (query caching) esteja desativado.

Várias outras variáveis de sistema controlam a operação do query cache. Elas podem ser definidas em um arquivo de opções ou na linha de comando ao iniciar o **mysqld**. As variáveis de sistema do query cache têm nomes que começam com `query_cache_`. Elas são descritas brevemente na Seção 5.1.7, “Server System Variables”, com informações adicionais de configuração fornecidas aqui.

Para definir o tamanho do query cache, defina a variável de sistema `query_cache_size`. Defini-la como 0 desativa o query cache, assim como definir `query_cache_type=0`. Por padrão, o query cache está desativado. Isso é alcançado usando um tamanho padrão de 1M, com um padrão de 0 para `query_cache_type`.

Para reduzir significativamente o overhead, inicie o servidor com `query_cache_type=0` se você não pretende usar o query cache.

Nota

Ao usar o Windows Configuration Wizard para instalar ou configurar o MySQL, o valor padrão para `query_cache_size` é configurado automaticamente para você, baseado nos diferentes tipos de configuração disponíveis. Ao usar o Windows Configuration Wizard, o query cache pode ser ativado (ou seja, definido para um valor diferente de zero) devido à configuração selecionada. O query cache também é controlado pela definição da variável `query_cache_type`. Verifique os valores dessas variáveis conforme definidos no seu arquivo `my.ini` após a conclusão da configuração.

Ao definir `query_cache_size` para um valor diferente de zero, tenha em mente que o query cache precisa de um tamanho mínimo de cerca de 40KB para alocar suas estruturas. (O tamanho exato depende da arquitetura do sistema.) Se você definir um valor muito pequeno, receberá um aviso, como neste exemplo:

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

Para que o query cache seja realmente capaz de armazenar quaisquer resultados de Query, seu tamanho deve ser definido como maior:

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

O valor de `query_cache_size` é alinhado ao bloco de 1024 bytes mais próximo. O valor relatado pode, portanto, ser diferente do valor que você atribui.

Se o tamanho do query cache for maior que 0, a variável `query_cache_type` influencia seu funcionamento. Esta variável pode ser definida com os seguintes valores:

* Um valor de `0` ou `OFF` impede o caching ou a recuperação de resultados em cache.

* Um valor de `1` ou `ON` habilita o caching, exceto para as instruções que começam com `SELECT SQL_NO_CACHE`.

* Um valor de `2` ou `DEMAND` faz com que o caching ocorra apenas para as instruções que começam com `SELECT SQL_CACHE`.

Se `query_cache_size` for 0, você também deve definir a variável `query_cache_type` como 0. Neste caso, o servidor não adquire o mutex do query cache, o que significa que o query cache não pode ser ativado em tempo de execução (runtime) e há uma redução no overhead na execução de Querys.

Definir o valor `GLOBAL` de `query_cache_type` determina o comportamento do query cache para todos os clientes que se conectarem após a alteração ser feita. Clientes individuais podem controlar o comportamento do cache para sua própria conexão definindo o valor `SESSION` de `query_cache_type`. Por exemplo, um cliente pode desabilitar o uso do query cache para suas próprias Querys desta forma:

```sql
mysql> SET SESSION query_cache_type = OFF;
```

Se você definir `query_cache_type` na inicialização do servidor (em vez de em tempo de execução (runtime) com uma instrução `SET`), apenas os valores numéricos são permitidos.

Para controlar o tamanho máximo dos resultados individuais de Query que podem ser armazenados em cache, defina a variável de sistema `query_cache_limit`. O valor padrão é 1MB.

Tenha cuidado para não definir o tamanho do cache muito grande. Devido à necessidade de Threads travarem (lock) o cache durante as atualizações, você pode observar problemas de contenção de Lock (lock contention issues) com um cache muito grande.

Nota

Você pode definir o tamanho máximo que pode ser especificado para o query cache em tempo de execução (runtime) com a instrução `SET`, usando a opção `--maximum-query_cache_size=32M` na linha de comando ou no arquivo de configuração.

Quando uma Query deve ser armazenada em cache, seu resultado (os dados enviados ao cliente) é armazenado no query cache durante a recuperação do resultado. Portanto, os dados geralmente não são tratados em um único bloco grande (chunk). O query cache aloca blocos para armazenar esses dados sob demanda, de modo que, quando um bloco é preenchido, um novo bloco é alocado. Como a operação de alocação de memória é custosa (em termos de tempo), o query cache aloca blocos com um tamanho mínimo dado pela variável de sistema `query_cache_min_res_unit`. Quando uma Query é executada, o último bloco de resultado é ajustado ao tamanho real dos dados, para que a memória não utilizada seja liberada. Dependendo dos tipos de Querys que seu servidor executa, pode ser útil ajustar (tune) o valor de `query_cache_min_res_unit`:

* O valor padrão de `query_cache_min_res_unit` é 4KB. Isso deve ser adequado para a maioria dos casos.

* Se você tiver muitas Querys com resultados pequenos, o tamanho padrão do bloco pode levar à fragmentação da memória, conforme indicado por um grande número de blocos livres. A fragmentação pode forçar o query cache a "podar" (prune/excluir) Querys do cache devido à falta de memória. Neste caso, diminua o valor de `query_cache_min_res_unit`. O número de blocos livres e Querys removidas devido à poda é dado pelos valores das variáveis de status `Qcache_free_blocks` e `Qcache_lowmem_prunes`.

* Se a maioria das suas Querys tiver resultados grandes (verifique as variáveis de status `Qcache_total_blocks` e `Qcache_queries_in_cache`), você pode aumentar a performance elevando `query_cache_min_res_unit`. No entanto, tome cuidado para não defini-lo muito grande (consulte o item anterior).