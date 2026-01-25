### 24.3.19 A Tabela PROFILING do INFORMATION_SCHEMA

A tabela [`PROFILING`](information-schema-profiling-table.html "24.3.19 A Tabela PROFILING do INFORMATION_SCHEMA") fornece informações de profiling de instrução (statement). Seu conteúdo corresponde à informação produzida pelas instruções [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") e [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") (consulte [Section 13.7.5.30, “SHOW PROFILE Statement”](show-profile.html "13.7.5.30 SHOW PROFILE Statement")). A tabela estará vazia a menos que a variável de sessão [`profiling`](server-system-variables.html#sysvar_profiling) esteja definida como 1.

Nota

Esta tabela está descontinuada (deprecated); espere que ela seja removida em uma futura versão do MySQL. Use o [Performance Schema](performance-schema.html "Chapter 25 MySQL Performance Schema") em vez disso; consulte [Section 25.19.1, “Query Profiling Using Performance Schema”](performance-schema-query-profiling.html "25.19.1 Query Profiling Using Performance Schema").

A tabela [`PROFILING`](information-schema-profiling-table.html "24.3.19 A Tabela PROFILING do INFORMATION_SCHEMA") possui estas colunas:

* `QUERY_ID`

  Um identificador numérico da instrução (statement).

* `SEQ`

  Um número de sequência que indica a ordem de exibição para linhas com o mesmo valor de `QUERY_ID`.

* `STATE`

  O estado de profiling ao qual as medições da linha se aplicam.

* `DURATION`

  Por quanto tempo a execução da instrução permaneceu no estado fornecido, em segundos.

* `CPU_USER`, `CPU_SYSTEM`

  Uso da CPU do usuário e do sistema, em segundos.

* `CONTEXT_VOLUNTARY`, `CONTEXT_INVOLUNTARY`

  Quantos *context switches* (trocas de contexto) voluntárias e involuntárias ocorreram.

* `BLOCK_OPS_IN`, `BLOCK_OPS_OUT`

  O número de operações de input e output de bloco.

* `MESSAGES_SENT`, `MESSAGES_RECEIVED`

  O número de mensagens de comunicação enviadas e recebidas.

* `PAGE_FAULTS_MAJOR`, `PAGE_FAULTS_MINOR`

  O número de *page faults* (falhas de página) maiores e menores.

* `SWAPS`

  Quantas trocas (*swaps*) ocorreram.

* `SOURCE_FUNCTION`, `SOURCE_FILE`, e `SOURCE_LINE`

  Informações que indicam onde no código-fonte o estado com profiling é executado.

#### Notas

* [`PROFILING`](information-schema-profiling-table.html "24.3.19 A Tabela PROFILING do INFORMATION_SCHEMA") é uma tabela `INFORMATION_SCHEMA` não padrão.

As informações de profiling também estão disponíveis nas instruções [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") e [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement"). Consulte [Section 13.7.5.30, “SHOW PROFILE Statement”](show-profile.html "13.7.5.30 SHOW PROFILE Statement"). Por exemplo, as seguintes Queries são equivalentes:

```sql
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```