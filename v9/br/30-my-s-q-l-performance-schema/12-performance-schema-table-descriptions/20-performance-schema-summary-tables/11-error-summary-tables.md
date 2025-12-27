#### 29.12.20.11 Tabelas de Resumo de Erros

O Schema de Desempenho mantém tabelas de resumo para agregação de informações estatísticas sobre erros do servidor (e avisos). Para uma lista de erros do servidor, consulte a Referência de Mensagens de Erro do Servidor.

A coleta de informações de erro é controlada pelo instrumento `error`, que é ativado por padrão. As informações de temporização não são coletadas.

Cada tabela de resumo de erro tem três colunas que identificam o erro:

* `ERROR_NUMBER` é o valor numérico do erro. O valor é único.

* `ERROR_NAME` é o nome simbólico do erro correspondente ao valor de `ERROR_NUMBER`. O valor é único.

* `SQLSTATE` é o valor `SQLSTATE` correspondente ao valor de `ERROR_NUMBER`. O valor não é necessariamente único.

Por exemplo, se `ERROR_NUMBER` for 1050, `ERROR_NAME` é `ER_TABLE_EXISTS_ERROR` e `SQLSTATE` é `42S01`.

Informações de resumo de evento de erro de exemplo:

```
mysql> SELECT *
       FROM performance_schema.events_errors_summary_global_by_error
       WHERE SUM_ERROR_RAISED <> 0\G
*************************** 1. row ***************************
     ERROR_NUMBER: 1064
       ERROR_NAME: ER_PARSE_ERROR
        SQL_STATE: 42000
 SUM_ERROR_RAISED: 1
SUM_ERROR_HANDLED: 0
       FIRST_SEEN: 2016-06-28 07:34:02
        LAST_SEEN: 2016-06-28 07:34:02
*************************** 2. row ***************************
     ERROR_NUMBER: 1146
       ERROR_NAME: ER_NO_SUCH_TABLE
        SQL_STATE: 42S02
 SUM_ERROR_RAISED: 2
SUM_ERROR_HANDLED: 0
       FIRST_SEEN: 2016-06-28 07:34:05
        LAST_SEEN: 2016-06-28 07:36:18
*************************** 3. row ***************************
     ERROR_NUMBER: 1317
       ERROR_NAME: ER_QUERY_INTERRUPTED
        SQL_STATE: 70100
 SUM_ERROR_RAISED: 1
SUM_ERROR_HANDLED: 0
       FIRST_SEEN: 2016-06-28 11:01:49
        LAST_SEEN: 2016-06-28 11:01:49
```

Cada tabela de resumo de erro tem uma ou mais colunas de agrupamento para indicar como a tabela agrupa erros:

* `events_errors_summary_by_account_by_error` tem as colunas `USER`, `HOST` e `ERROR_NUMBER`. Cada linha resume eventos para uma conta específica (combinação de usuário e host) e erro.

* `events_errors_summary_by_host_by_error` tem as colunas `HOST` e `ERROR_NUMBER`. Cada linha resume eventos para um host específico e erro.

* `events_errors_summary_by_thread_by_error` tem as colunas `THREAD_ID` e `ERROR_NUMBER`. Cada linha resume eventos para um thread específico e erro.

* `events_errors_summary_by_user_by_error` tem as colunas `USER` e `ERROR_NUMBER`. Cada linha resume eventos para um usuário específico e erro.

* `events_errors_summary_global_by_error` tem uma coluna `ERROR_NUMBER`. Cada linha resume eventos para um erro específico.

Cada tabela de resumo de erros tem essas colunas de resumo contendo valores agregados:

* `SUM_ERROR_RAISED`

  Esta coluna agrega o número de vezes que o erro ocorreu.

* `SUM_ERROR_HANDLED`

  Esta coluna agrega o número de vezes que o erro foi tratado por um manipulador de exceção do SQL.

* `FIRST_SEEN`, `LAST_SEEN`

  Tempo de registro indicando quando o erro foi visto pela primeira vez e quando foi visto pela última vez.

Uma linha `NULL` em cada tabela de resumo de erros é usada para agregar estatísticas para todos os erros que estão fora do intervalo dos erros instrumentados. Por exemplo, se os erros do MySQL Server estiverem no intervalo de *`M`* a *`N`* e um erro for gerado com o número *`Q`* que não está nesse intervalo, o erro é agregado na linha `NULL`. A linha `NULL` é a linha com `ERROR_NUMBER=0`, `ERROR_NAME=NULL` e `SQLSTATE=NULL`.

As tabelas de resumo de erros têm esses índices:

* `events_errors_summary_by_account_by_error`:

  + Chave primária em (`USER`, `HOST`, `ERROR_NUMBER`)

* `events_errors_summary_by_host_by_error`:

  + Chave primária em (`HOST`, `ERROR_NUMBER`)

* `events_errors_summary_by_thread_by_error`:

  + Chave primária em (`THREAD_ID`, `ERROR_NUMBER`)

* `events_errors_summary_by_user_by_error`:

  + Chave primária em (`USER`, `ERROR_NUMBER`)

* `events_errors_summary_global_by_error`:

  + Chave primária em (`ERROR_NUMBER`)

A `TRUNCATE TABLE` é permitida para tabelas de resumo de erros. Ela tem esses efeitos:

* Para tabelas de resumo não agregadas por conta, host ou usuário, a truncagem reescreve as colunas de resumo para zero ou `NULL` em vez de remover linhas.

* Para tabelas de resumo agregadas por conta, host ou usuário, a truncagem remove linhas para contas, hosts ou usuários sem conexões e reescreve as colunas de resumo para zero ou `NULL` para as linhas restantes.

Além disso, cada tabela de resumo de erros que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão da qual depende, ou pela truncagem de `events_errors_summary_global_by_error`. Para obter detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.