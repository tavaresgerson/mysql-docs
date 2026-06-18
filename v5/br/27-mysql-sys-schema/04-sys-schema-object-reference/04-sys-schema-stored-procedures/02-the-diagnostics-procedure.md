#### 26.4.4.2 O Procedure diagnostics()

Cria um relatório do status atual do servidor para fins de diagnóstico.

Este procedure desabilita o binary logging durante sua execução ao manipular o valor de sessão da system variable `sql_log_bin`. Essa é uma operação restrita, portanto, o procedure requer privilégios suficientes para definir session variables restritas. Consulte a Seção 5.1.8.1, “System Variable Privileges”.

Os dados coletados para o `diagnostics()` Procedure incluem as seguintes informações:

* Informações da `metrics` view (consulte a Seção 26.4.3.21, “The metrics View”)

* Informações de outras `sys` schema views relevantes, como aquela que determina as queries no 95º percentil.

* Informações do `ndbinfo` schema, se o MySQL server fizer parte de um NDB Cluster.

* Status da Replication (tanto source quanto replica).

Algumas das sys schema views são calculadas como valores inicial (opcional), geral (overall) e delta:

* A initial view é o conteúdo da view no início do `diagnostics()` Procedure. Esta saída é a mesma que os valores de início usados para a delta view. A initial view é incluída se a configuration option `diagnostics.include_raw` estiver como `ON`.

* A overall view é o conteúdo da view no final do `diagnostics()` Procedure. Esta saída é a mesma que os valores finais usados para a delta view. A overall view é sempre incluída.

* A delta view é a diferença do início ao fim da execução do procedure. Os valores mínimo e máximo são os valores mínimo e máximo da end view, respectivamente. Eles não refletem necessariamente os valores mínimo e máximo no período monitorado. Exceto pela `metrics` view, o delta é calculado apenas entre a primeira e a última saída.

##### Parâmetros

* `in_max_runtime INT UNSIGNED`: O tempo máximo de coleta de dados em segundos. Use `NULL` para coletar dados pelo padrão de 60 segundos. Caso contrário, use um valor maior que 0.

* `in_interval INT UNSIGNED`: O tempo de "sono" (sleep time) entre as coletas de dados em segundos. Use `NULL` para pausar pelo padrão de 30 segundos. Caso contrário, use um valor maior que 0.

* `in_auto_config ENUM('current', 'medium', 'full')`: A Performance Schema configuration a ser utilizada. Os valores permitidos são:

  + `current`: Usa as configurações atuais de instrument e consumer.

  + `medium`: Habilita alguns instruments e consumers.

  + `full`: Habilita todos os instruments e consumers.

  Nota

  Quanto mais instruments e consumers habilitados, maior o impacto no performance do MySQL server. Tenha cuidado com a configuração `medium` e especialmente com a configuração `full`, que possui um grande impacto no performance.

  O uso da configuração `medium` ou `full` requer o `SUPER` privilege.

  Se uma configuração diferente de `current` for escolhida, as configurações atuais serão restauradas ao final do procedure.

##### Configuration Options (Opções de Configuração)

A operação do `diagnostics()` Procedure pode ser modificada usando as seguintes configuration options ou suas user-defined variables correspondentes (consulte a Seção 26.4.2.1, “The sys_config Table”):

* `debug`, `@sys.debug`

  Se esta opção estiver `ON`, produz saída de debugging. O padrão é `OFF`.

* `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  Se esta opção estiver `ON`, o `diagnostics()` Procedure tem permissão para realizar table scans na tabela `TABLES` do Information Schema. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

* `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  Se esta opção estiver `ON`, a saída do `diagnostics()` Procedure inclui a saída raw (bruta) da consulta à `metrics` view. O padrão é `OFF`.

* `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo dos statements retornados pela `format_statement()` Function. Statements mais longos são truncados para este comprimento. O padrão é 64.

##### Exemplo

Crie um relatório de diagnóstico que inicie uma iteração a cada 30 segundos e execute por no máximo 120 segundos usando as configurações atuais do Performance Schema:

```sql
mysql> CALL sys.diagnostics(120, 30, 'current');
```

Para capturar a saída do `diagnostics()` procedure em um arquivo enquanto ele é executado, use os comandos `tee filename` e `notee` do **mysql** client (consulte a Seção 4.5.1.2, “mysql Client Commands”):

```sql
mysql> tee diag.out;
mysql> CALL sys.diagnostics(120, 30, 'current');
mysql> notee;
```
