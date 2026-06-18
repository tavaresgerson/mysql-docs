#### 30.4.2.1 Tabela sys\_config

Esta tabela contém as opções de configuração do esquema `sys`, uma linha por opção. As alterações de configuração feitas ao atualizar esta tabela persistem em todas as sessões do cliente e reinicializações do servidor.

A tabela `sys_config` tem essas colunas:

- `variable`

  O nome da opção de configuração.

- `value`

  O valor da opção de configuração.

- `set_time`

  O horário da última modificação na linha.

- `set_by`

  A conta que fez a modificação mais recente na linha. O valor é `NULL` se a linha não tiver sido alterada desde que o esquema `sys` foi instalado.

Como medida de eficiência para minimizar o número de leituras diretas da tabela `sys_config`, as funções do esquema `sys` que utilizam um valor dessa tabela verificam se há uma variável definida pelo usuário com um nome correspondente, que é a variável definida pelo usuário com o mesmo nome mais o prefixo `@sys.`. (Por exemplo, a variável correspondente à opção `diagnostics.include_raw` é `@sys.diagnostics.include_raw`. Se a variável definida pelo usuário existir na sessão atual e não for `NULL`, a função usa seu valor em vez do valor da tabela `sys_config`. Caso contrário, a função lê e usa o valor da tabela. No último caso, a função que a chama convencionou também define a variável definida pelo usuário com o valor da tabela para que futuras referências à opção de configuração na mesma sessão usem a variável e não precisem ler a tabela novamente.

Por exemplo, a opção `statement_truncate_len` controla o comprimento máximo das declarações retornadas pela função `format_statement()`). O valor padrão é 64. Para alterar temporariamente o valor para 32 para a sua sessão atual, defina a variável definida pelo usuário `@sys.statement_truncate_len` correspondente:

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

As invocações subsequentes da função `format_statement()` dentro da sessão continuam a usar o valor da variável definida pelo usuário (32), em vez do valor armazenado na tabela (64).

Para parar de usar a variável definida pelo usuário e voltar a usar o valor da tabela, defina a variável para `NULL` dentro da sua sessão:

```
mysql> SET @sys.statement_truncate_len = NULL;
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
```

Alternativamente, encerre a sessão atual (fazendo com que a variável definida pelo usuário deixe de existir) e comece uma nova sessão.

A relação convencional descrita acima entre as opções na tabela `sys_config` e as variáveis definidas pelo usuário pode ser explorada para fazer alterações de configuração temporárias que terminam quando sua sessão termina. No entanto, se você definir uma variável definida pelo usuário e, em seguida, alterar o valor correspondente na mesma sessão, o valor alterado da tabela não será usado naquela sessão, desde que a variável definida pelo usuário exista com um valor não `NULL`. (O valor alterado da tabela *é* usado em outras sessões nas quais a variável definida pelo usuário não é atribuída.)

A lista a seguir descreve as opções na tabela `sys_config` e as variáveis definidas pelo usuário correspondentes:

- `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  Se esta opção for `ON`, o procedimento `diagnostics()` é permitido para realizar varreduras de tabela na tabela do Schema de Informações `TABLES`. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

- `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  Se esta opção for `ON`, o procedimento `diagnostics()` inclui a saída bruta da consulta à vista `metrics`. O padrão é `OFF`.

- `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

  O comprimento máximo para a saída JSON produzida pela função `ps_thread_trx_info()`") A função. O padrão é 65535.

- `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

  O número máximo de linhas a serem retornadas para visualizações que não têm um limite embutido. (Por exemplo, a visualização `statements_with_runtimes_in_95th_percentile` tem um limite embutido no sentido de que ela retorna apenas instruções com tempo de execução médio no percentil 95. O padrão é 100.

- `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

  A consulta ou visualização personalizada a ser usada pelo procedimento `statement_performance_analyzer()`") (que é ele mesmo invocado pelo procedimento `diagnostics()`")). Se o valor da opção contiver um espaço, ele será interpretado como uma consulta. Caso contrário, deve ser o nome de uma visualização existente que consulta a tabela do Schema de Desempenho `events_statements_summary_by_digest`. Não pode haver nenhuma cláusula `LIMIT` na definição da consulta ou visualização se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. O padrão é `NULL` (sem visualização personalizada definida).

- `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo das declarações retornadas pela função `format_statement()`") é este comprimento. Declarações mais longas são truncadas para este comprimento. O padrão é 64.

Outras opções podem ser adicionadas à tabela `sys_config`. Por exemplo, os procedimentos `diagnostics()` e `execute_prepared_stmt()` usam a opção `debug` se ela existir, mas essa opção não faz parte da tabela `sys_config` por padrão, porque a saída de depuração normalmente é habilitada apenas temporariamente, definindo a variável definida pelo usuário `@sys.debug` correspondente. Para habilitar a saída de depuração sem precisar definir essa variável em sessões individuais, adicione a opção à tabela:

```
mysql> INSERT INTO sys.sys_config (variable, value) VALUES('debug', 'ON');
```

Para alterar a configuração de depuração na tabela, faça duas coisas. Primeiro, modifique o valor na própria tabela:

```
mysql> UPDATE sys.sys_config
       SET value = 'OFF'
       WHERE variable = 'debug';
```

Em segundo lugar, para garantir que as invocações de procedimento dentro da sessão atual usem o valor alterado da tabela, defina a variável definida pelo usuário correspondente para `NULL`:

```
mysql> SET @sys.debug = NULL;
```
