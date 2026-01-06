### 8.15.4 Limpeza da trilha de ajuste

Por padrão, cada nova traça sobrescreve a traça anterior. Assim, se uma declaração contém subdeclarações (como invocar procedimentos armazenados, funções armazenadas ou gatilhos), a declaração mais alta e as subdeclarações geram cada uma uma traça, mas no final da execução, a traça apenas da última subdeclaração é visível.

Um usuário que deseja ver a traça de um subdeclaração diferente pode habilitar ou desabilitar a traça para a subdeclaração desejada, mas isso requer a edição do código da rotina, o que nem sempre é possível. Outra solução é ajustar a limpeza da traça. Isso é feito definindo as variáveis de sistema `optimizer_trace_offset` e `optimizer_trace_limit`, da seguinte forma:

```sql
SET optimizer_trace_offset=offset, optimizer_trace_limit=limit;
```

- `offset`\* é um inteiro assinado (padrão `-1`); \* `limit`\* é um inteiro positivo (padrão `1`). Uma declaração `SET` desse tipo tem os seguintes efeitos:

- Todos os rastros armazenados anteriormente são apagados da memória.
- Uma consulta subsequente a partir da tabela `OPTIMIZER_TRACE` retorna os primeiros *`limit`* traços dos traços armazenados mais antigos com *`offset`* (se *`offset`* >= 0) ou os primeiros *`limit`* traços dos traços armazenados mais recentes com *`-offset`* (se *`offset`* < 0).

Exemplos:

- `SET optimizer_trace_offset=-1, optimizer_trace_limit=1`: A traça mais recente é mostrada (o padrão).

- `SET optimizer_trace_offset=-2, optimizer_trace_limit=1`: O último traço antes do último é mostrado.

- `SET optimizer_trace_offset=-5, optimizer_trace_limit=5`: Os últimos cinco traços são mostrados.

Valores negativos para *`offset`* podem, portanto, ser úteis quando as instruções subseqüentes de interesse são as últimas em uma rotina armazenada. Por exemplo:

```sql
SET optimizer_trace_offset=-5, optimizer_trace_limit=5;

CALL stored_routine(); # more than 5 substatements in this routine

SELECT * FROM information_schema.OPTIMIZER_TRACE; # see only the last 5 traces
```

Um *`offset`* positivo pode ser útil quando se sabe que os subinstruções interessantes são as primeiras em uma rotina armazenada.

Quanto mais precisamente essas duas variáveis forem definidas, menos memória será usada. Por exemplo, `SET optimizer_trace_offset=0, optimizer_trace_limit=5` requer memória suficiente para armazenar cinco traços, então, se apenas os três primeiros forem necessários, é melhor usar `SET optimizer_trace_offset=0, optimizer_trace_limit=3`, pois o rastreamento para de após *`limit`* traços. Uma rotina armazenada pode ter um loop que executa muitos subinstruções e, assim, gera muitos traços, o que pode consumir muita memória; nesses casos, escolher valores apropriados para *`offset`* e *`limit`* pode restringir o rastreamento a, por exemplo, uma única iteração do loop. Isso também diminui o impacto do rastreamento na velocidade de execução.

Se *`offset`* for igual ou maior que 0, apenas as traças de *`limit`* são mantidas na memória. Se *`offset`* for menor que 0, isso não é verdade: em vez disso, as traças de *`-offset`* são mantidas na memória. Mesmo que *`limit`* seja menor que *`-offset`*, excluindo a última declaração, a última declaração ainda deve ser rastreada porque estará dentro do limite após executar mais uma declaração. Como um deslocamento menor que 0 é contado a partir do final, a “janela” se move à medida que mais declarações são executadas.

Usar `optimizer_trace_offset` e `optimizer_trace_limit`, que são restrições no nível do produtor de traços, oferece melhor (maior) velocidade e (menos) uso de memória do que definir offsets ou limites no nível do consumidor de traços (SQL) com `SELECT * FROM OPTIMIZER_TRACE LIMIT limit OFFSET offset`, o que não economiza quase nada.
