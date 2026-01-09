#### 26.4.2.1 A Tabela sys_config

Esta tabela contém opções de configuração do esquema `sys`, uma linha por opção. As alterações de configuração feitas ao atualizar esta tabela persistem em todas as sessões do cliente e reinicializações do servidor.

A tabela `sys_config` tem as seguintes colunas:

- `variável`

  O nome da opção de configuração.

- `valor`

  O valor da opção de configuração.

- `set_time`

  O horário da última modificação na linha.

- `set_by`

  A conta que fez a modificação mais recente na linha. O valor é `NULL` se a linha não tiver sido alterada desde que o esquema `sys` foi instalado.

Como medida de eficiência para minimizar o número de leituras diretas da tabela `sys_config`, as funções do esquema `sys` que utilizam um valor dessa tabela verificam uma variável definida pelo usuário com um nome correspondente, que é a variável definida pelo usuário com o mesmo nome mais o prefixo `@sys.`. (Por exemplo, a variável correspondente à opção `diagnostics.include_raw` é `@sys.diagnostics.include_raw`. Se a variável definida pelo usuário existir na sessão atual e não for `NULL`, a função usa seu valor em vez do valor da tabela `sys_config`. Caso contrário, a função lê e usa o valor da tabela. No último caso, o função chamante convencionou também definir a variável definida pelo usuário com o valor da tabela para que referências posteriores à opção de configuração na mesma sessão usem a variável e não precisem ler a tabela novamente.

Por exemplo, a opção `statement_truncate_len` controla o comprimento máximo das declarações retornadas pela função `format_statement()`. O valor padrão é 64. Para alterar temporariamente o valor para 32 na sua sessão atual, defina a variável definida pelo usuário `@sys.statement_truncate_len` correspondente:

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

As invocações subsequentes da função `format_statement()` dentro da sessão continuam a usar o valor da variável definida pelo usuário (32), em vez do valor armazenado na tabela (64).

Para parar de usar a variável definida pelo usuário e voltar a usar o valor da tabela, defina a variável como `NULL` dentro da sua sessão:

```sql
mysql> SET @sys.statement_truncate_len = NULL;
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
```

Alternativamente, encerre a sessão atual (fazendo com que a variável definida pelo usuário deixe de existir) e comece uma nova sessão.

A relação convencional descrita acima entre as opções na tabela `sys_config` e as variáveis definidas pelo usuário pode ser explorada para fazer alterações temporárias na configuração que terminam quando a sessão termina. No entanto, se você definir uma variável definida pelo usuário e, em seguida, alterar o valor correspondente na mesma sessão, o valor alterado da tabela não será usado naquela sessão, desde que a variável definida pelo usuário exista e não seja `NULL`. (O valor alterado da tabela *é* usado em outras sessões que não têm a variável definida pelo usuário atribuída.)

A lista a seguir descreve as opções na tabela `sys_config` e as variáveis definidas pelo usuário correspondentes:

- `diagnostics.allow_i_s_tables`, `@sys.diagnostics.allow_i_s_tables`

  Se esta opção estiver ativada, o procedimento `diagnostics()` pode realizar varreduras de tabelas na tabela do esquema de informações `TABLES`. Isso pode ser caro se houver muitas tabelas. O padrão é `OFF`.

- `diagnostics.include_raw`, `@sys.diagnostics.include_raw`

  Se esta opção estiver ativada, o procedimento `diagnostics()` inclui a saída bruta da consulta à vista `metrics`. O padrão é `OFF`.

- `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

  O comprimento máximo para a saída JSON produzida pela função `ps_thread_trx_info()`") é de 65535. O valor padrão é 65535.

- `statement_performance_analyzer.limit`, `@sys.statement_performance_analyzer.limit`

  O número máximo de linhas a serem retornadas para visualizações que não tenham um limite embutido. (Por exemplo, a visualização `statements_with_runtimes_in_95th_percentile` tem um limite embutido no sentido de retornar apenas declarações com tempo médio de execução no 95º percentil.) O padrão é 100.

- `statement_performance_analyzer.view`, `@sys.statement_performance_analyzer.view`

  A consulta ou visualização personalizada a ser usada pelo procedimento `statement_performance_analyzer()` (que é chamado pelo procedimento `diagnostics()`). Se o valor da opção contiver um espaço, ele será interpretado como uma consulta. Caso contrário, deve ser o nome de uma visualização existente que faz uma consulta à tabela `events_statements_summary_by_digest` do Schema de desempenho. Não pode haver nenhuma cláusula `LIMIT` na definição da consulta ou visualização se a opção de configuração `statement_performance_analyzer.limit` for maior que 0. O padrão é `NULL` (nenhuma visualização personalizada definida).

- `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo das declarações retornadas pela função `format_statement()`") é o comprimento máximo das declarações. Declarações mais longas são truncadas para esse comprimento. O padrão é 64.

Outras opções podem ser adicionadas à tabela `sys_config`. Por exemplo, os procedimentos `diagnostics()` e `execute_prepared_stmt()` usam a opção `debug` (se existir), mas essa opção não faz parte da tabela `sys_config` por padrão, porque a saída de depuração normalmente é habilitada apenas temporariamente, definindo a variável definida pelo usuário `@sys.debug` correspondente. Para habilitar a saída de depuração sem precisar definir essa variável em sessões individuais, adicione a opção à tabela:

```sql
mysql> INSERT INTO sys.sys_config (variable, value) VALUES('debug', 'ON');
```

Para alterar a configuração de depuração na tabela, faça duas coisas. Primeiro, modifique o valor na própria tabela:

```sql
mysql> UPDATE sys.sys_config
       SET value = 'OFF'
       WHERE variable = 'debug';
```

Em segundo lugar, para garantir que as invocações de procedimento dentro da sessão atual usem o valor alterado da tabela, defina a variável definida pelo usuário correspondente para `NULL`:

```sql
mysql> SET @sys.debug = NULL;
```
