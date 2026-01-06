### 24.3.19 A tabela INFORMATION\_SCHEMA PROFILING

A tabela `PROFILING` fornece informações de perfilamento de declarações. Seu conteúdo corresponde às informações produzidas pelas declarações `SHOW PROFILE` e `SHOW PROFILES` (veja Seção 13.7.5.30, “Declaração SHOW PROFILE”). A tabela está vazia, a menos que a variável de sessão `profiling` esteja definida como 1.

Nota

Esta tabela está desatualizada; espere-se que ela seja removida em uma futura versão do MySQL. Use o Schema de Desempenho em vez disso; veja Seção 25.19.1, “Profilagem de Consulta Usando o Schema de Desempenho”.

A tabela `PROFILING` tem essas colunas:

- `QUERY_ID`

  Um identificador de declaração numérica.

- `SEQ`

  Um número de sequência que indica a ordem de exibição das linhas com o mesmo valor de `QUERY_ID`.

- `ESTADO`

  O estado de perfilamento ao qual as medições da linha se aplicam.

- `DURACAO`

  Quanto tempo a execução da declaração permaneceu no estado especificado, em segundos.

- `CPU_USER`, `CPU_SYSTEM`

  Uso do CPU do usuário e do sistema, em segundos.

- `CONTEXT_VOLUNTÁRIO`, `CONTEXT_INVOLUNTÁRIO`

  Quantas trocas de contexto voluntárias e involuntárias ocorreram.

- `BLOCK_OPS_IN`, `BLOCK_OPS_OUT`

  O número de operações de entrada e saída de blocos.

- `MESSAGES_SENT`, `MESSAGES_RECEIVED`

  O número de mensagens de comunicação enviadas e recebidas.

- `PAGE_FAULTS_MAJOR`, `PAGE_FAULTS_MINOR`

  O número de falhas de página principais e secundárias.

- `SWAPS`

  Quantas trocas ocorreram.

- `SOURCE_FUNCTION`, `SOURCE_FILE` e `SOURCE_LINE`

  Informações que indicam onde no código-fonte o estado perfilado é executado.

#### Notas

- `PROFILING` é uma tabela `INFORMATION_SCHEMA` não padrão.

As informações de perfilamento também estão disponíveis nas declarações `SHOW PROFILE` e `SHOW PROFILES`. Veja Seção 13.7.5.30, “Declaração SHOW PROFILE”. Por exemplo, as seguintes consultas são equivalentes:

```sql
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```
