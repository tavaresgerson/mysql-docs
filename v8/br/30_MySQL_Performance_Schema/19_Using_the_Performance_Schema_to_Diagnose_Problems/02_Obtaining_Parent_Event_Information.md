### 29.19.2 Obter informações sobre o evento pai

A tabela `data_locks` mostra bloqueios de dados mantidos e solicitados. As linhas desta tabela têm uma coluna `THREAD_ID` que indica o ID do thread da sessão que possui o bloqueio, e uma coluna `EVENT_ID` que indica o evento do Schema de Desempenho que causou o bloqueio. Os tuplas de valores (`THREAD_ID`, `EVENT_ID`) implicitamente identificam um evento pai em outras tabelas do Schema de Desempenho:

- O evento de espera do pai nas tabelas `events_waits_xxx`

- O evento principal da tabela `events_stages_xxx`

- O evento de declaração principal nas tabelas `events_statements_xxx`

- O evento de transação principal na tabela `events_transactions_current`

Para obter detalhes sobre o evento pai, conecte as colunas `THREAD_ID` e `EVENT_ID` às colunas com o mesmo nome na tabela do evento pai apropriado. A relação é baseada em um modelo de dados de conjunto aninhado, então a junção tem várias cláusulas. Dado que as tabelas pai e filho são representadas por `parent` e `child`, respectivamente, a junção parece assim:

```
WHERE
  parent.THREAD_ID = child.THREAD_ID        /* 1 */
  AND parent.EVENT_ID < child.EVENT_ID      /* 2 */
  AND (
    child.EVENT_ID <= parent.END_EVENT_ID   /* 3a */
    OR parent.END_EVENT_ID IS NULL          /* 3b */
  )
```

As condições para a adesão são:

1. Os eventos pai e filho estão na mesma thread.

2. O evento filho começa após o evento pai, portanto, seu valor `EVENT_ID` é maior que o do pai.

3. O evento principal já foi concluído ou ainda está em andamento.

Para encontrar informações de bloqueio, `data_locks` é a tabela que contém eventos filhos.

A tabela `data_locks` mostra apenas bloqueios existentes, portanto, essas considerações se aplicam em relação à qual tabela contém o evento pai:

- Para transações, a única opção é `events_transactions_current`. Se uma transação for concluída, ela pode estar nas tabelas de histórico de transações, mas os bloqueios já foram removidos.

- Para declarações, tudo depende se a declaração que levou um bloqueio é uma declaração em uma transação que já foi concluída (use `events_statements_history`) ou se a declaração ainda está em execução (use `events_statements_current`).

- Para etapas, a lógica é semelhante à das declarações; use `events_stages_history` ou `events_stages_current`.

- Para espera, a lógica é semelhante à das declarações; use `events_waits_history` ou `events_waits_current`. No entanto, há tantas espera registradas que a espera que causou um bloqueio provavelmente já foi removida das tabelas de histórico.

Eventos de espera, de estágio e de declaração desaparecem rapidamente do histórico. Se uma declaração que foi executada há muito tempo bloqueou, mas ainda está em uma transação aberta, pode não ser possível encontrar a declaração, mas é possível encontrar a transação.

É por isso que o modelo de dados de conjuntos aninhados funciona melhor para localizar eventos pai. Seguir links em uma relação pai/filho (bloqueio de dados -> espera do pai -> estágio do pai -> transação do pai) não funciona bem quando os nós intermediários já foram removidos das tabelas de histórico.

O seguinte cenário ilustra como encontrar a transação principal de uma declaração em que uma bloqueio foi realizado:

Sessão A:

```
[1] START TRANSACTION;
[2] SELECT * FROM t1 WHERE pk = 1;
[3] SELECT 'Hello, world';
```

Sessão B:

```
SELECT ...
FROM performance_schema.events_transactions_current AS parent
  INNER JOIN performance_schema.data_locks AS child
WHERE
  parent.THREAD_ID = child.THREAD_ID
  AND parent.EVENT_ID < child.EVENT_ID
  AND (
    child.EVENT_ID <= parent.END_EVENT_ID
    OR parent.END_EVENT_ID IS NULL
  );
```

A consulta para a sessão B deve mostrar que a declaração \[2] possui um bloqueio de dados no registro com `pk=1`.

Se a sessão A executar mais instruções, \[2] ela desaparecerá da tabela de histórico.

A consulta deve mostrar a transação que começou em \[1], independentemente de quantos registros, etapas ou espera foram executados.

Para ver mais dados, você também pode usar as tabelas `events_xxx_history_long`, exceto para transações, assumindo que nenhuma outra consulta esteja sendo executada no servidor (para que o histórico seja preservado).
