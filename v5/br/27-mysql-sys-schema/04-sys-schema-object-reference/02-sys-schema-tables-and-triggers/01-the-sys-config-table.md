#### 26.4.2.1 A Tabela sys_config

Esta tabela contém opções de configuração do `sys` schema, uma linha por opção. As alterações de configuração feitas ao atualizar esta tabela persistem entre as SESSIONS de cliente e reinicializações do servidor.

A tabela `sys_config` possui as seguintes colunas:

* `variable`

  O nome da opção de configuração.

* `value`

  O valor da opção de configuração.

* `set_time`

  O TIMESTAMP da modificação mais recente na linha.

* `set_by`

  A conta que fez a modificação mais recente na linha. O valor é `NULL` se a linha não foi alterada desde que o `sys` schema foi instalado.

Como medida de eficiência para minimizar o número de leituras diretas da tabela `sys_config`, as Functions do `sys` schema que utilizam um valor desta tabela verificam a existência de uma *user-defined variable* (variável definida pelo usuário) com um nome correspondente, que é a *user-defined variable* tendo o mesmo nome acrescido do prefixo `@sys.`. (Por exemplo, a Variable correspondente à opção `diagnostics.include_raw` é `@sys.diagnostics.include_raw`.) Se a *user-defined variable* existir na SESSION atual e for diferente de `NULL`, a Function utiliza seu valor em preferência ao valor na tabela `sys_config`. Caso contrário, a Function lê e utiliza o valor da tabela. Neste último caso, a Function chamadora define convencionalmente a *user-defined variable* correspondente para o valor da tabela, de modo que referências futuras à opção de configuração dentro da mesma SESSION utilizem a Variable e não precisem ler a tabela novamente.

Por exemplo, a opção `statement_truncate_len` controla o comprimento máximo de *Statements* retornados pela Function `format_statement()` Function"). O padrão é 64. Para alterar temporariamente o valor para 32 para sua SESSION atual, defina a *user-defined variable* `@sys.statement_truncate_len` correspondente:

```sql
mysql> SET @stmt = 'SELECT variable, value, set_time, set_by FROM sys_config';
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
mysql> SET @sys.statement_truncate_len = 32;
mysql> SELECT sys.format_statement(@stmt);
+-----------------------------------+
| sys.format_statement(@stmt)       |
+-----------------------------------+
| SELECT variabl ... ROM sys_config |
+-----------------------------------+
```

Invocações subsequentes de `format_statement()` Function") dentro da SESSION continuarão a usar o valor da *user-defined variable* (32), em vez do valor armazenado na tabela (64).

Para parar de usar a *user-defined variable* e reverter para usar o valor na tabela, defina a Variable como `NULL` dentro da sua SESSION:

```sql
mysql> SET @sys.statement_truncate_len = NULL;
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
```

Alternativamente, encerre sua SESSION atual (fazendo com que a *user-defined variable* deixe de existir) e inicie uma nova SESSION.

O relacionamento convencional recém-descrito entre as opções na tabela `sys_config` e as *user-defined variables* pode ser explorado para fazer alterações temporárias de configuração que terminam quando sua SESSION termina. No entanto, se você definir uma *user-defined variable* e subsequentemente alterar o valor da tabela correspondente dentro da mesma SESSION, o valor alterado da tabela não será usado nessa SESSION, desde que a *user-defined variable* exista e não seja `NULL`. (O valor alterado da tabela *é* usado em outras SESSIONS que não têm a *user-defined variable* atribuída.)

A lista a seguir descreve as opções na tabela `sys_config` e as *user-defined variables* correspondentes:

* `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  Se esta opção estiver `ON`, o Procedure `diagnostics()` Procedure") tem permissão para realizar *table scans* na tabela `TABLES` do Information Schema. Isso pode ser custoso se houver muitas tabelas. O padrão é `OFF`.

* `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  Se esta opção estiver `ON`, o Procedure `diagnostics()` Procedure") inclui a saída "raw" (bruta) da Query à View `metrics`. O padrão é `OFF`.

* `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

  O comprimento máximo para a saída JSON produzida pela Function `ps_thread_trx_info()` Function"). O padrão é 65535.

* `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

  O número máximo de linhas a serem retornadas para Views que não possuem um LIMIT interno. (Por exemplo, a View `statements_with_runtimes_in_95th_percentile` tem um LIMIT interno no sentido de que retorna apenas *Statements* com tempo médio de execução no percentil 95.) O padrão é 100.

* `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

  A Query customizada ou View a ser usada pelo Procedure `statement_performance_analyzer()` Procedure") (que é invocado pelo Procedure `diagnostics()` Procedure")). Se o valor da opção contiver um espaço, ele será interpretado como uma Query. Caso contrário, deve ser o nome de uma View existente que faça Query na tabela `events_statements_summary_by_digest` do Performance Schema. Não pode haver nenhuma cláusula `LIMIT` na definição da Query ou View se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. O padrão é `NULL` (nenhuma View customizada definida).

* `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo de *Statements* retornados pela Function `format_statement()` Function"). *Statements* mais longos são truncados para este comprimento. O padrão é 64.

Outras opções podem ser adicionadas à tabela `sys_config`. Por exemplo, os Procedures `diagnostics()` Procedure") e `execute_prepared_stmt()` Procedure") usam a opção `debug` se ela existir, mas esta opção não faz parte da tabela `sys_config` por padrão, pois a saída de debug normalmente é habilitada apenas temporariamente, definindo a *user-defined variable* `@sys.debug` correspondente. Para habilitar a saída de debug sem ter que definir essa Variable em SESSIONS individuais, adicione a opção à tabela:

```sql
mysql> INSERT INTO sys.sys_config (variable, value) VALUES('debug', 'ON');
```

Para alterar a configuração de debug na tabela, faça duas coisas. Primeiro, modifique o valor na própria tabela:

```sql
mysql> UPDATE sys.sys_config
       SET value = 'OFF'
       WHERE variable = 'debug';
```

Segundo, para também garantir que as invocações de Procedures dentro da SESSION atual usem o valor alterado da tabela, defina a *user-defined variable* correspondente como `NULL`:

```sql
mysql> SET @sys.debug = NULL;
```