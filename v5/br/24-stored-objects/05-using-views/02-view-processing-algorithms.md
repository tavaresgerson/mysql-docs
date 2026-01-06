### 23.5.2 Ver algoritmos de processamento

A cláusula `ALGORITHM` opcional para `CREATE VIEW` ou `ALTER VIEW` é uma extensão do MySQL para o SQL padrão. Ela afeta a forma como o MySQL processa a visão. `ALGORITHM` aceita três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`.

- Para `MERGE`, o texto de uma declaração que se refere à vista e à definição da vista são mesclados de tal forma que partes da definição da vista substituem partes correspondentes da declaração.

- Para `TEMPTABLE`, os resultados da consulta são recuperados em uma tabela temporária, que é então usada para executar a instrução.

- Para `UNDEFINED`, o MySQL escolhe qual algoritmo usar. Ele prefere `MERGE` em vez de `TEMPTABLE` se possível, porque `MERGE` geralmente é mais eficiente e porque uma visão não pode ser atualizada se uma tabela temporária for usada.

- Se a cláusula `ALGORITHM` não estiver presente, o algoritmo padrão é determinado pelo valor da bandeira `derived_merge` da variável de sistema `optimizer_switch`. Para uma discussão adicional, consulte a Seção 8.2.2.4, “Otimizando tabelas derivadas e referências de visualizações com mesclagem ou materialização”.

Uma razão para especificar `TEMPTABLE` explicitamente é que as bloqueadas podem ser liberadas nas tabelas subjacentes após a criação da tabela temporária e antes de ela ser usada para finalizar o processamento da instrução. Isso pode resultar em liberação de bloqueio mais rápida do que o algoritmo `MERGE`, para que outros clientes que utilizam a visualização não sejam bloqueados por mais tempo.

Um algoritmo de visualização pode ser `UNDEFINED` por três razões:

- Não há nenhuma cláusula `ALGORITHM` na instrução `CREATE VIEW`.

- A instrução `CREATE VIEW` tem uma cláusula explícita `ALGORITHM = UNDEFINED`.

- O algoritmo `MERGE` é especificado para uma visualização que pode ser processada apenas com uma tabela temporária. Nesse caso, o MySQL gera uma mensagem de aviso e define o algoritmo como `UNDEFINED`.

Como mencionado anteriormente, o `MERGE` é tratado ao combinar partes correspondentes de uma definição de visualização na declaração que faz referência à visualização. Os exemplos a seguir ilustram brevemente como o algoritmo `MERGE` funciona. Os exemplos assumem que existe uma visualização `v_merge` que tem esta definição:

```sql
CREATE ALGORITHM = MERGE VIEW v_merge (vc1, vc2) AS
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 1: Suponha que façamos essa declaração:

```sql
SELECT * FROM v_merge;
```

O MySQL trata a declaração da seguinte forma:

- `v_merge` se torna `t`

- `*` se torna `vc1, vc2`, o que corresponde a `c1, c2`

- A cláusula `WHERE` da vista foi adicionada

A declaração resultante a ser executada se torna:

```sql
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 2: Suponha que façamos essa declaração:

```sql
SELECT * FROM v_merge WHERE vc1 < 100;
```

Esta declaração é tratada de maneira semelhante à anterior, exceto que `vc1 < 100` se torna `c1 < 100` e a cláusula `WHERE` da vista é adicionada à cláusula `WHERE` da declaração usando um conectivo `AND` (e parênteses são adicionados para garantir que as partes da cláusula sejam executadas com a precedência correta). A declaração resultante a ser executada se torna:

```sql
SELECT c1, c2 FROM t WHERE (c3 > 100) AND (c1 < 100);
```

Efetivamente, a declaração a ser executada tem uma cláusula `WHERE` dessa forma:

```sql
WHERE (select WHERE) AND (view WHERE)
```

Se o algoritmo `MERGE` não puder ser usado, uma tabela temporária deve ser utilizada em vez disso. Os construtos que impedem a junção são os mesmos que impedem a junção em tabelas derivadas. Exemplos são `SELECT DISTINCT` ou `LIMIT` na subconsulta. Para obter detalhes, consulte a Seção 8.2.2.4, “Otimizando tabelas derivadas e referências de visualizações com junção ou materialização”.
