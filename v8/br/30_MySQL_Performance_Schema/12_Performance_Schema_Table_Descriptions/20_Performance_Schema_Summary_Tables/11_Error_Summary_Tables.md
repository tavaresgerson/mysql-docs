#### 29.12.20.11 Tabelas de Resumo de Erros

O Schema de Desempenho mantém tabelas resumidas para agregação de informações estatísticas sobre erros do servidor (e avisos). Para uma lista de erros do servidor, consulte a Referência de Mensagem de Erro do Servidor.

A coleta de informações de erro é controlada pelo instrumento `error`, que é ativado por padrão. As informações de temporização não são coletadas.

Cada tabela de resumo de erros tem três colunas que identificam o erro:

- `ERROR_NUMBER` é o valor numérico de erro. O valor é único.

- `ERROR_NAME` é o nome simbólico do erro correspondente ao valor `ERROR_NUMBER`. O valor é único.

- `SQLSTATE` é o valor SQLSTATE correspondente ao valor `ERROR_NUMBER`. O valor não é necessariamente único.

Por exemplo, se `ERROR_NUMBER` é 1050, `ERROR_NAME` é `ER_TABLE_EXISTS_ERROR` e `SQLSTATE` é `42S01`.

Resumo das informações de evento de erro:

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

Cada tabela de resumo de erros tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os erros:

- A tabela `events_errors_summary_by_account_by_error` possui as colunas `USER`, `HOST` e `ERROR_NUMBER`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e erro.

- A tabela `events_errors_summary_by_host_by_error` possui as colunas `HOST` e `ERROR_NUMBER`. Cada linha resume os eventos para um determinado hospedeiro e erro.

- A coluna `events_errors_summary_by_thread_by_error` tem as colunas `THREAD_ID` e `ERROR_NUMBER`. Cada linha resume os eventos para um determinado fio e erro.

- A tabela `events_errors_summary_by_user_by_error` possui as colunas `USER` e `ERROR_NUMBER`. Cada linha resume os eventos para um usuário e um erro específicos.

- A coluna `events_errors_summary_global_by_error` tem uma coluna `ERROR_NUMBER`. Cada linha resume os eventos para um erro específico.

Cada tabela de resumo de erros tem essas colunas de resumo contendo valores agregados:

- `SUM_ERROR_RAISED`

  Esta coluna agrega o número de vezes que o erro ocorreu.

- `SUM_ERROR_HANDLED`

  Esta coluna agrega o número de vezes que o erro foi tratado por um manipulador de exceção do SQL.

- `FIRST_SEEN`, `LAST_SEEN`

  Data e hora que indica quando o erro foi visto pela primeira vez e quando foi visto pela última vez.

Uma linha `NULL` em cada tabela de resumo de erros é usada para agreger estatísticas para todos os erros que estão fora do intervalo dos erros instrumentados. Por exemplo, se os erros do MySQL Server estiverem no intervalo de `M` a `N` e um erro for gerado com o número `Q` que não está nesse intervalo, o erro é agregado na linha `NULL`. A linha `NULL` é a linha com `ERROR_NUMBER=0`, `ERROR_NAME=NULL` e `SQLSTATE=NULL`.

As tabelas de resumo de erros têm esses índices:

- `events_errors_summary_by_account_by_error`:

  - Chave primária em (`USER`, `HOST`, `ERROR_NUMBER`)

- `events_errors_summary_by_host_by_error`:

  - Chave primária em (`HOST`, `ERROR_NUMBER`)

- `events_errors_summary_by_thread_by_error`:

  - Chave primária em (`THREAD_ID`, `ERROR_NUMBER`)

- `events_errors_summary_by_user_by_error`:

  - Chave primária em (`USER`, `ERROR_NUMBER`)

- `events_errors_summary_global_by_error`:

  - Chave primária em (`ERROR_NUMBER`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de erros. Ele tem esses efeitos:

- Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefini o valor das colunas resumidas para zero ou `NULL` em vez de remover as linhas.

- Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefiniu as colunas resumidas para zero ou `NULL` para as linhas restantes.

Além disso, cada tabela de resumo de erros que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão da qual depende, ou pela truncagem de `events_errors_summary_global_by_error`. Para obter detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.
