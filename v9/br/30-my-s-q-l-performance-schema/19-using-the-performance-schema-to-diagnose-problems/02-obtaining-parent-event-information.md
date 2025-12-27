### 29.19.2 Obter Informações do Evento Pais

A tabela `data_locks` mostra as bloqueadas e as solicitadas. As linhas desta tabela têm uma coluna `THREAD_ID` que indica o ID do thread da sessão que possui o bloqueio, e uma coluna `EVENT_ID` que indica o evento do Schema de Desempenho que causou o bloqueio. Os tuplos de valores (`THREAD_ID`, `EVENT_ID`) identificam implicitamente um evento pai em outras tabelas do Schema de Desempenho:

* O evento de espera pai nas tabelas `events_waits_xxx`

* O evento de estágio pai nas tabelas `events_stages_xxx`

* O evento de declaração pai nas tabelas `events_statements_xxx`

* O evento de transação pai na tabela `events_transactions_current`

Para obter detalhes sobre o evento pai, faça uma junção das colunas `THREAD_ID` e `EVENT_ID` com as colunas de nome semelhante na tabela do evento pai apropriada. A relação é baseada em um modelo de dados de conjunto aninhado, então a junção tem várias cláusulas. Dado que as tabelas pai e filho são representadas por `parent` e `child`, respectivamente, a junção é a seguinte:

```
WHERE
  parent.THREAD_ID = child.THREAD_ID        /* 1 */
  AND parent.EVENT_ID < child.EVENT_ID      /* 2 */
  AND (
    child.EVENT_ID <= parent.END_EVENT_ID   /* 3a */
    OR parent.END_EVENT_ID IS NULL          /* 3b */
  )
```

As condições para a junção são:

1. Os eventos pai e filho estão no mesmo thread.
2. O evento filho começa após o evento pai, então seu valor `EVENT_ID` é maior que o do pai.
3. O evento pai foi concluído ou ainda está em execução.

Para encontrar informações sobre o bloqueio, `data_locks` é a tabela que contém os eventos filhos.

A tabela `data_locks` mostra apenas bloqueados existentes, então essas considerações se aplicam em relação à qual tabela contém o evento pai:

* Para transações, a única escolha é `events_transactions_current`. Se uma transação for concluída, ela pode estar nas tabelas de histórico de transações, mas os bloqueios já foram removidos.

* Para declarações, tudo depende se a declaração que adquiriu um bloqueio é uma declaração em uma transação que já foi concluída (use `events_statements_history`) ou se a declaração ainda está em execução (use `events_statements_current`).

* Para estágios, a lógica é semelhante à das declarações; use `events_stages_history` ou `events_stages_current`.

* Para espera, a lógica é semelhante à das declarações; use `events_waits_history` ou `events_waits_current`. No entanto, há tantas espera que o bloqueio que causou o bloqueio provavelmente já foi removido das tabelas de histórico.

Eventos de espera, estágio e declaração desaparecem rapidamente do histórico. Se uma declaração que executou há muito tempo adquiriu um bloqueio, mas está em uma transação ainda aberta, pode não ser possível encontrar a declaração, mas é possível encontrar a transação.

É por isso que o modelo de dados de conjunto aninhado funciona melhor para localizar eventos pai. Seguir links em uma relação pai/filho (bloqueio de dados -> espera pai -> estágio pai -> transação pai) não funciona bem quando os nós intermediários já foram removidos das tabelas de histórico.

O seguinte cenário ilustra como encontrar a transação pai de uma declaração na qual um bloqueio foi adquirido:

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

A consulta para a sessão B deve mostrar a declaração [2] como possuindo um bloqueio de dados no registro com `pk=1`.

Se a sessão A executar mais declarações, [2] desaparecerá da tabela de histórico.

A consulta deve mostrar a transação que começou em [1], independentemente de quantas declarações, estágios ou espera foram executadas.

Para ver mais dados, você também pode usar as tabelas `events_xxx_history_long`, exceto para transações, assumindo que nenhuma outra consulta esteja sendo executada no servidor (para que o histórico seja preservado).