### 28.3.24 A tabela INFORMATION\_SCHEMA PROFILING

A tabela `PROFILING` fornece informações de perfilagem de declarações. Seu conteúdo corresponde às informações produzidas pelas declarações `SHOW PROFILE` e `SHOW PROFILES` (consulte a Seção 15.7.7.30, “Declaração SHOW PROFILE”). A tabela está vazia, a menos que a variável de sessão `profiling` seja definida como 1.

Nota

Esta tabela está desatualizada; espere-se que seja removida em uma futura versão do MySQL. Use o Gerenciamento de Desempenho em vez disso; veja a Seção 29.19.1, “Profilagem de Consulta Usando o Gerenciamento de Desempenho”.

A tabela `PROFILING` tem essas colunas:

- `QUERY_ID`

  Um identificador de declaração numérica.

- `SEQ`

  Um número de sequência que indica a ordem de exibição das linhas com o mesmo valor de `QUERY_ID`.

- `STATE`

  O estado de perfilamento ao qual as medições da linha se aplicam.

- `DURATION`

  Quanto tempo a execução da declaração permaneceu no estado especificado, em segundos.

- `CPU_USER`, `CPU_SYSTEM`

  Uso do CPU do usuário e do sistema, em segundos.

- `CONTEXT_VOLUNTARY`, `CONTEXT_INVOLUNTARY`

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

- `PROFILING` é uma tabela não padrão `INFORMATION_SCHEMA`.

As informações de perfilamento também estão disponíveis nas declarações `SHOW PROFILE` e `SHOW PROFILES`. Veja a Seção 15.7.7.30, “Declaração SHOW PROFILE”. Por exemplo, as seguintes consultas são equivalentes:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```
