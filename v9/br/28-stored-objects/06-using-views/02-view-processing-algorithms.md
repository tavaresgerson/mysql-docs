### 27.6.2 Verificar Algoritmos de Processamento

A cláusula opcional `ALGORITHM` para `CREATE VIEW` ou `ALTER VIEW` é uma extensão do MySQL para o SQL padrão. Ela afeta como o MySQL processa a vista. `ALGORITHM` aceita três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`.

* Para `MERGE`, o texto de uma instrução que se refere à vista e à definição da vista são mesclados de modo que partes da definição da vista substituem partes correspondentes da instrução.

* Para `TEMPTABLE`, os resultados da vista são recuperados em uma tabela temporária, que é então usada para executar a instrução.

* Para `UNDEFINED`, o MySQL escolhe qual algoritmo usar. Ele prefere `MERGE` sobre `TEMPTABLE` se possível, porque `MERGE` geralmente é mais eficiente e porque uma vista não pode ser atualizada se uma tabela temporária for usada.

* Se nenhuma cláusula `ALGORITHM` estiver presente, o algoritmo padrão é determinado pelo valor da variável de sistema `optimizer_switch` do sinalizador `derived_merge`. Para uma discussão adicional, consulte a Seção 10.2.2.4, “Otimizando Tabelas Derivadas, Referências de Vistas e Expressões de Tabela Comuns com Mesclagem ou Materialização”.

Uma razão para especificar `TEMPTABLE` explicitamente é que as bloquagens podem ser liberadas nas tabelas subjacentes após a criação da tabela temporária e antes de ela ser usada para finalizar o processamento da instrução. Isso pode resultar em liberação de bloquagens mais rápida do que o algoritmo `MERGE`, para que outros clientes que usam a vista não sejam bloqueados por tanto tempo.

Um algoritmo de vista pode ser `UNDEFINED` por três razões:

* Não há cláusula `ALGORITHM` na instrução `CREATE VIEW`.

* A instrução `CREATE VIEW` tem uma cláusula explícita `ALGORITHM = UNDEFINED`.

* `ALGORITMO = MERGE` é especificado para uma visualização que pode ser processada apenas com uma tabela temporária. Neste caso, o MySQL gera um aviso e define o algoritmo como `UNDEFINED`.

Como mencionado anteriormente, o `MERGE` é tratado ao mesclar partes correspondentes de uma definição de visualização na instrução que faz referência à visualização. Os seguintes exemplos ilustram brevemente como o algoritmo `MERGE` funciona. Os exemplos assumem que existe uma visualização `v_merge` que tem esta definição:

```
CREATE ALGORITHM = MERGE VIEW v_merge (vc1, vc2) AS
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 1: Suponha que emitimos esta instrução:

```
SELECT * FROM v_merge;
```

O MySQL trata a instrução da seguinte forma:

* `v_merge` se torna `t`
* `*` se torna `vc1, vc2`, o que corresponde a `c1, c2`

* A cláusula `WHERE` da visualização é adicionada

A instrução resultante a ser executada se torna:

```
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 2: Suponha que emitimos esta instrução:

```
SELECT * FROM v_merge WHERE vc1 < 100;
```

Esta instrução é tratada de forma semelhante à anterior, exceto que `vc1 < 100` se torna `c1 < 100` e a cláusula `WHERE` da visualização é adicionada à cláusula `WHERE` da instrução usando um conectivo `AND` (e parênteses são adicionados para garantir que as partes da cláusula sejam executadas com a precedência correta). A instrução resultante a ser executada se torna:

```
SELECT c1, c2 FROM t WHERE (c3 > 100) AND (c1 < 100);
```

Efetivamente, a instrução a ser executada tem uma cláusula `WHERE` desta forma:

```
WHERE (select WHERE) AND (view WHERE)
```

Se o algoritmo `MERGE` não puder ser usado, uma tabela temporária deve ser usada em vez disso. Os construtos que impedem a junção são os mesmos que impedem a junção em tabelas derivadas e expressões de tabela comuns. Exemplos são `SELECT DISTINCT` ou `LIMIT` na subconsulta. Para detalhes, consulte a Seção 10.2.2.4, “Otimizando Tabelas Derivadas, Referências a Visualizações e Expressões de Tabela Comuns com Junção ou Materialização”.