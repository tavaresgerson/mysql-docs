### 8.15.4 Ajustando a Limpeza de Traces (Purging)

Por padrão, cada novo *trace* sobrescreve o *trace* anterior. Assim, se uma *statement* contiver *substatements* (como invocar *stored procedures*, *stored functions* ou *triggers*), a *statement* de nível superior e as *substatements* geram cada uma um *trace*, mas ao final da execução, o *trace* visível é apenas o da última *substatement*.

Um usuário que deseja visualizar o *trace* de uma *substatement* diferente pode habilitar ou desabilitar o *tracing* para a *substatement* desejada, mas isso exige a edição do código da rotina, o que nem sempre é possível. Outra solução é ajustar a limpeza de *traces* (*purging*). Isso é feito configurando as variáveis de sistema `optimizer_trace_offset` e `optimizer_trace_limit`, da seguinte forma:

```sql
SET optimizer_trace_offset=offset, optimizer_trace_limit=limit;
```

*`offset`* é um *integer* assinado (padrão `-1`); *`limit`* é um *integer* positivo (padrão `1`). Uma *statement* `SET` como essa tem os seguintes efeitos:

* Todos os *traces* armazenados anteriormente são limpos da memória.
* Um `SELECT` subsequente da tabela `OPTIMIZER_TRACE` retorna os primeiros *`limit`* *traces* dos *`offset`* *traces* armazenados mais antigos (se *`offset`* >= 0), ou os primeiros *`limit`* *traces* dos *-offset* *traces* armazenados mais recentes (se *`offset`* < 0).

Exemplos:

* `SET optimizer_trace_offset=-1, optimizer_trace_limit=1`: O *trace* mais recente é exibido (o padrão).

* `SET optimizer_trace_offset=-2, optimizer_trace_limit=1`: O penúltimo *trace* é exibido.

* `SET optimizer_trace_offset=-5, optimizer_trace_limit=5`: Os últimos cinco *traces* são exibidos.

Valores negativos para *`offset`* podem, portanto, ser úteis quando as *substatements* de interesse são as últimas em uma *stored routine*. Por exemplo:

```sql
SET optimizer_trace_offset=-5, optimizer_trace_limit=5;

CALL stored_routine(); # more than 5 substatements in this routine

SELECT * FROM information_schema.OPTIMIZER_TRACE; # see only the last 5 traces
```

Um *`offset`* positivo pode ser útil quando se sabe que as *substatements* interessantes são as primeiras em uma *stored routine*.

Quanto mais precisamente essas duas variáveis forem definidas, menos memória será usada. Por exemplo, `SET optimizer_trace_offset=0, optimizer_trace_limit=5` requer memória suficiente para armazenar cinco *traces*, então, se apenas os três primeiros forem necessários, é melhor usar `SET optimizer_trace_offset=0, optimizer_trace_limit=3`, visto que o *tracing* para após *`limit`* *traces*. Uma *stored routine* pode ter um *loop* que executa muitas *substatements* e, consequentemente, gera muitos *traces*, o que pode consumir muita memória; nesses casos, escolher valores apropriados para *`offset`* e *`limit`* pode restringir o *tracing* a, por exemplo, uma única iteração do *loop*. Isso também diminui o impacto do *tracing* na velocidade de execução.

Se *`offset`* for maior ou igual a 0, apenas *`limit`* *traces* são mantidos na memória. Se *`offset`* for menor que 0, isso não é verdade: em vez disso, *-offset* *traces* são mantidos na memória. Mesmo que *`limit`* seja menor que *-offset*, excluindo a última *statement*, a última *statement* ainda deve ser rastreada porque estará dentro do *limit* após a execução de mais uma *statement*. Como um *offset* menor que 0 é contado a partir do final, a "janela" se move à medida que mais *statements* são executadas.

O uso de `optimizer_trace_offset` e `optimizer_trace_limit`, que são restrições no nível do produtor de *traces*, proporciona melhor velocidade (maior) e uso de memória (menor) do que definir *offsets* ou *limits* no nível do consumidor de *traces* (SQL) com `SELECT * FROM OPTIMIZER_TRACE LIMIT limit OFFSET offset`, o que economiza quase nada.