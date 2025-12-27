### 10.15.4 Limpeza de Rastros de Otimização

Por padrão, cada novo rastreamento sobrescreve o rastreamento anterior. Assim, se uma instrução contém subinstruções (como invocar procedimentos armazenados, funções armazenadas ou gatilhos), a instrução mais alta e as subinstruções geram cada uma um rastreamento, mas, no final da execução, o rastreamento do último subinstrução é visível.

Um usuário que deseja ver o rastreamento de uma subinstrução diferente pode habilitar ou desabilitar o rastreamento para a subinstrução desejada, mas isso requer a edição do código da rotina, o que nem sempre é possível. Outra solução é ajustar a limpeza de rastros. Isso é feito definindo as variáveis de sistema `optimizer_trace_offset` e `optimizer_trace_limit`, da seguinte forma:

```
SET optimizer_trace_offset=offset, optimizer_trace_limit=limit;
```

*`offset`* é um inteiro assinado (padrão `-1`); *`limit`* é um inteiro positivo (padrão `1`). Uma instrução `SET` com esse formato tem os seguintes efeitos:

* Todos os rastros previamente armazenados são apagados da memória.
* Uma consulta subsequente à tabela `OPTIMIZER_TRACE` retorna os primeiros *`limit`* rastros dos rastros armazenados mais antigos com o *`offset`* mais antigo (se *`offset`* >= 0), ou os primeiros *`limit`* rastros dos rastros armazenados mais novos com o *`-offset`* mais novo (se *`offset`* < 0).

Exemplos:

* `SET optimizer_trace_offset=-1, optimizer_trace_limit=1`: O rastreamento mais recente é exibido (o padrão).

* `SET optimizer_trace_offset=-2, optimizer_trace_limit=1`: O rastreamento imediatamente anterior é exibido.

* `SET optimizer_trace_offset=-5, optimizer_trace_limit=5`: Os últimos cinco rastros são exibidos.

Valores negativos para *`offset`* podem ser úteis quando as subinstruções de interesse são as últimas em uma rotina armazenada. Por exemplo:

```
SET optimizer_trace_offset=-5, optimizer_trace_limit=5;

CALL stored_routine(); # more than 5 substatements in this routine

SELECT * FROM information_schema.OPTIMIZER_TRACE; # see only the last 5 traces
```

Um *`offset`* positivo pode ser útil quando se sabe que as subinstruções interessantes são as primeiras em uma rotina armazenada.

Quanto mais precisamente essas duas variáveis forem definidas, menos memória será usada. Por exemplo, `SET optimizer_trace_offset=0, optimizer_trace_limit=5` requer memória suficiente para armazenar cinco traços, então, se apenas os três primeiros forem necessários, é melhor usar `SET optimizer_trace_offset=0, optimizer_trace_limit=3`, pois o rastreamento para de após os *`limit`* traços. Uma rotina armazenada pode ter um loop que executa muitos subinstruções e, assim, gera muitos traços, o que pode consumir muita memória; nesses casos, escolher valores apropriados para *`offset`* e *`limit`* pode restringir o rastreamento, por exemplo, a uma única iteração do loop. Isso também diminui o impacto do rastreamento na velocidade de execução.

Se *`offset`* for igual ou maior que 0, apenas os *`limit`* traços serão mantidos na memória. Se *`offset`* for menor que 0, isso não é verdade: em vez disso, os *`-offset`* traços serão mantidos na memória. Mesmo que *`limit`* seja menor que *`-offset`*, excluindo a última instrução, a última instrução ainda deve ser rastreada porque estará dentro do limite após executar mais uma instrução. Como um offset menor que 0 é contado a partir do final, a “janela” se move à medida que mais instruções são executadas.

Usar `optimizer_trace_offset` e `optimizer_trace_limit`, que são restrições no nível do produtor do rastreamento, proporciona melhor (maior) velocidade e (menos) uso de memória do que definir offsets ou limites no nível do consumidor do rastreamento (SQL) com `SELECT * FROM OPTIMIZER_TRACE LIMIT limit OFFSET offset`, o que não economiza quase nada.