#### 30.4.2.1 A tabela sys_config

Esta tabela contém opções de configuração do esquema `sys`, uma linha por opção. As alterações de configuração feitas ao atualizar esta tabela persistem em todas as sessões do cliente e reinicializações do servidor.

A tabela `sys_config` tem as seguintes colunas:

* `variable`

  O nome da opção de configuração.

* `value`

  O valor da opção de configuração.

* `set_time`

  O timestamp da última modificação na linha.

* `set_by`

  A conta que fez a última modificação na linha. O valor é `NULL` se a linha não tiver sido alterada desde que o esquema `sys` foi instalado.

Como medida de eficiência para minimizar o número de leituras diretas da tabela `sys_config`, as funções do esquema `sys` que usam um valor desta tabela verificam se há uma variável definida pelo usuário com um nome correspondente, que é a variável definida pelo usuário com o mesmo nome mais o prefixo `@sys.`. (Por exemplo, a variável correspondente à opção `diagnostics.include_raw` é `@sys.diagnostics.include_raw`.) Se a variável definida pelo usuário existir na sessão atual e não for `NULL`, a função usa seu valor em preferência ao valor na tabela `sys_config`. Caso contrário, a função lê e usa o valor da tabela. No último caso, a função que a chama convencionadamente também define a variável definida pelo usuário correspondente ao valor da tabela para que futuras referências à opção de configuração dentro da mesma sessão usem a variável e não precisem ler a tabela novamente.

Por exemplo, a opção `statement_truncate_len` controla o comprimento máximo das declarações retornadas pela função `format_statement()`")". O valor padrão é 64. Para alterar temporariamente o valor para 32 para a sua sessão atual, defina a variável definida pelo usuário `@sys.statement_truncate_len` correspondente:

As chamadas subsequentes à função `format_statement()` dentro da sessão continuam a usar o valor da variável definida pelo usuário (32), em vez do valor armazenado na tabela (64).

Para parar de usar a variável definida pelo usuário e voltar a usar o valor na tabela, defina a variável para `NULL` dentro da sua sessão:

```
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

Alternativamente, encerre a sessão atual (causando a não existência da variável definida pelo usuário) e inicie uma nova sessão.

A relação convencional descrita anteriormente entre as opções na tabela `sys_config` e as variáveis definidas pelo usuário pode ser explorada para fazer alterações de configuração temporárias que terminam quando a sua sessão termina. No entanto, se você definir uma variável definida pelo usuário e, em seguida, alterar o valor correspondente na tabela dentro da mesma sessão, o valor alterado da tabela não é usado nessa sessão enquanto a variável definida pelo usuário existir com um valor não `NULL`. (O valor alterado da tabela *é* usado em outras sessões nas quais a variável definida pelo usuário não é atribuída.)

A lista a seguir descreve as opções na tabela `sys_config` e as variáveis definidas pelo usuário correspondentes:

* `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  Se esta opção estiver `ON`, o procedimento `diagnostics()` é permitido realizar varreduras de tabela na tabela `TABLES` do Schema de Informações. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

* `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  Se esta opção estiver `ON`, o procedimento `diagnostics()` inclui a saída bruta da consulta à vista `metrics`. O padrão é `OFF`.

* `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

O comprimento máximo para a saída JSON produzida pela função `ps_thread_trx_info()`. O valor padrão é 65535.

* `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

  O número máximo de linhas a serem retornadas para views que não têm um limite embutido. (Por exemplo, a view `statements_with_runtimes_in_95th_percentile` tem um limite embutido no sentido de retornar apenas as instruções com tempo de execução médio no 95º percentil.) O valor padrão é 100.

* `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

  A consulta ou view personalizada a ser usada pelo procedimento `statement_performance_analyzer()`") (que é ele mesmo invocado pelo procedimento `diagnostics()`")). Se o valor da opção contiver um espaço, ele é interpretado como uma consulta. Caso contrário, deve ser o nome de uma view existente que consulta a tabela `events_statements_summary_by_digest` do Schema de Desempenho. Não pode haver nenhuma cláusula `LIMIT` na definição da consulta ou view se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. O valor padrão é `NULL` (sem view personalizada definida).

* `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo das instruções retornadas pelo função `format_statement()`") função. Instruções mais longas são truncadas para esse comprimento. O valor padrão é 64.

Outras opções podem ser adicionadas à tabela `sys_config`. Por exemplo, os procedimentos `diagnostics()` e `execute_prepared_stmt()` usam a opção `debug` se ela existir, mas essa opção não faz parte da tabela `sys_config` por padrão, porque a saída de depuração normalmente é habilitada apenas temporariamente, definindo a variável definida pelo usuário `@sys.debug` correspondente. Para habilitar a saída de depuração sem precisar definir essa variável em sessões individuais, adicione a opção à tabela:

```
mysql> SET @sys.statement_truncate_len = NULL;
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
```

Para alterar o ajuste de depuração na tabela, faça duas coisas. Primeiro, modifique o valor na própria tabela:

```
mysql> INSERT INTO sys.sys_config (variable, value) VALUES('debug', 'ON');
```

Em segundo lugar, para garantir que as chamadas de procedimento dentro da sessão atual usem o valor alterado da tabela, defina a variável definida pelo usuário correspondente para `NULL`:

```
mysql> UPDATE sys.sys_config
       SET value = 'OFF'
       WHERE variable = 'debug';
```