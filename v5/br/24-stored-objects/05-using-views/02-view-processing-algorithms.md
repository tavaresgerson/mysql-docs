### 23.5.2 Algoritmos de Processamento de View

A cláusula opcional `ALGORITHM` para `CREATE VIEW` ou `ALTER VIEW` é uma extensão do MySQL para o SQL padrão. Ela afeta como o MySQL processa a view. `ALGORITHM` aceita três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`.

* Para `MERGE`, o texto de uma instrução que faz referência à view e a definição da view são mesclados de modo que partes da definição da view substituam as partes correspondentes da instrução.

* Para `TEMPTABLE`, os resultados da view são recuperados em uma temporary table, que então é usada para executar a instrução.

* Para `UNDEFINED`, o MySQL escolhe qual algoritmo usar. Ele prefere `MERGE` em relação a `TEMPTABLE` se possível, pois `MERGE` geralmente é mais eficiente e porque uma view não pode ser atualizada se uma temporary table for usada.

* Se nenhuma cláusula `ALGORITHM` estiver presente, o algoritmo padrão é determinado pelo valor do flag `derived_merge` da `optimizer_switch` system variable. Para discussão adicional, consulte Seção 8.2.2.4, “Otimizando Derived Tables e Referências de View com Mesclagem ou Materialização”.

Um motivo para especificar `TEMPTABLE` explicitamente é que Locks podem ser liberados nas tabelas subjacentes após a temporary table ter sido criada e antes de ser usada para finalizar o processamento da instrução. Isso pode resultar em uma liberação de Lock mais rápida do que o algoritmo `MERGE`, de modo que outros clients que usam a view não fiquem bloqueados por tanto tempo.

O algoritmo de uma view pode ser `UNDEFINED` por três motivos:

* Nenhuma cláusula `ALGORITHM` está presente na instrução `CREATE VIEW`.

* A instrução `CREATE VIEW` possui uma cláusula explícita `ALGORITHM = UNDEFINED`.

* `ALGORITHM = MERGE` é especificado para uma view que só pode ser processada com uma temporary table. Neste caso, o MySQL gera um aviso e define o algoritmo como `UNDEFINED`.

Conforme mencionado anteriormente, `MERGE` é tratado mesclando partes correspondentes de uma definição de view na instrução que faz referência à view. Os exemplos a seguir ilustram brevemente como o algoritmo `MERGE` funciona. Os exemplos assumem que existe uma view `v_merge` que possui esta definição:

```sql
CREATE ALGORITHM = MERGE VIEW v_merge (vc1, vc2) AS
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 1: Suponha que emitimos esta instrução:

```sql
SELECT * FROM v_merge;
```

O MySQL manipula a instrução da seguinte forma:

* `v_merge` torna-se `t`
* `*` torna-se `vc1, vc2`, que corresponde a `c1, c2`
* A `WHERE clause` da view é adicionada

A instrução resultante a ser executada torna-se:

```sql
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 2: Suponha que emitimos esta instrução:

```sql
SELECT * FROM v_merge WHERE vc1 < 100;
```

Esta instrução é manipulada de forma semelhante à anterior, exceto que `vc1 < 100` torna-se `c1 < 100` e a `WHERE clause` da view é adicionada à `WHERE clause` da instrução usando um conectivo `AND` (e parênteses são adicionados para garantir que as partes da cláusula sejam executadas com a precedência correta). A instrução resultante a ser executada torna-se:

```sql
SELECT c1, c2 FROM t WHERE (c3 > 100) AND (c1 < 100);
```

Efetivamente, a instrução a ser executada tem uma `WHERE clause` desta forma:

```sql
WHERE (select WHERE) AND (view WHERE)
```

Se o algoritmo `MERGE` não puder ser usado, uma temporary table deve ser usada. As construções que impedem a mesclagem são as mesmas que impedem a mesclagem em derived tables. Exemplos são `SELECT DISTINCT` ou `LIMIT` na subquery. Para detalhes, consulte Seção 8.2.2.4, “Otimizando Derived Tables e Referências de View com Mesclagem ou Materialização”.