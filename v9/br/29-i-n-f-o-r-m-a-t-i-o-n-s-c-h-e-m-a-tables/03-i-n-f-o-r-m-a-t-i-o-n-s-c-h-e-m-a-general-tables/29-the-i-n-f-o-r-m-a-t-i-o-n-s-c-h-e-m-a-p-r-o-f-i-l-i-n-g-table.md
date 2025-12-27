### 28.3.29 A Tabela `INFORMATION_SCHEMA PROFILING`

A tabela `PROFILING` fornece informações de perfilagem de declarações. Seu conteúdo corresponde às informações produzidas pelas declarações `SHOW PROFILE` e `SHOW PROFILES` (veja a Seção 15.7.7.33, “Declaração SHOW PROFILE”). A tabela está vazia, a menos que a variável de sessão `profiling` seja definida como 1.

Nota

Esta tabela está desatualizada; espera-se que ela seja removida em uma futura versão do MySQL. Use o Schema de Desempenho em vez disso; veja a Seção 29.19.1, “Perfilagem de Consultas Usando o Schema de Desempenho”.

A tabela `PROFILING` tem as seguintes colunas:

* `QUERY_ID`

  Um identificador numérico da declaração.

* `SEQ`

  Um número de sequência que indica a ordem de exibição das linhas com o mesmo valor de `QUERY_ID`.

* `STATE`

  O estado de perfilagem ao qual as medições da linha se aplicam.

* `DURATION`

  Quanto tempo a execução da declaração permaneceu no estado dado, em segundos.

* `CPU_USER`, `CPU_SYSTEM`

  Uso do CPU do usuário e do sistema, em segundos.

* `CONTEXT_VOLUNTARY`, `CONTEXT_INVOLUNTARY`

  Quantos trocas de contexto voluntárias e involuntárias ocorreram.

* `BLOCK_OPS_IN`, `BLOCK_OPS_OUT`

  O número de operações de entrada e saída de blocos.

* `MESSAGES_SENT`, `MESSAGES_RECEIVED`

  O número de mensagens de comunicação enviadas e recebidas.

* `PAGE_FAULTS_MAJOR`, `PAGE_FAULTS_MINOR`

  O número de falhas de página major e minor.

* `SWAPS`

  Quantos trocas ocorreram.

* `SOURCE_FUNCTION`, `SOURCE_FILE` e `SOURCE_LINE`

  Informações que indicam onde no código-fonte o estado perfilado é executado.

#### Notas

* `PROFILING` é uma tabela `INFORMATION_SCHEMA` não padrão.

As informações de perfilagem também estão disponíveis nas declarações `SHOW PROFILE` e `SHOW PROFILES`. Veja a Seção 15.7.7.33, “Declaração SHOW PROFILE”. Por exemplo, as seguintes consultas são equivalentes:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```