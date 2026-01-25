#### 8.2.1.5 Otimização de Index Condition Pushdown

Index Condition Pushdown (ICP) é uma otimização para o caso em que o MySQL recupera linhas de uma table usando um Index. Sem o ICP, o Storage Engine percorre o Index para localizar linhas na tabela base e as retorna ao servidor MySQL, que avalia a condição `WHERE` para as linhas. Com o ICP ativado, e se partes da condição `WHERE` puderem ser avaliadas usando apenas colunas do Index, o servidor MySQL envia (pushes down) essa parte da condição `WHERE` para o Storage Engine. O Storage Engine então avalia a Index Condition enviada, usando a entrada do Index, e somente se esta for satisfeita, a linha é lida da table. O ICP pode reduzir o número de vezes que o Storage Engine deve acessar a tabela base e o número de vezes que o servidor MySQL deve acessar o Storage Engine.

A aplicabilidade da otimização Index Condition Pushdown está sujeita a estas condições:

* O ICP é usado para os métodos de acesso `range`, `ref`, `eq_ref` e `ref_or_null` quando há necessidade de acessar linhas completas da table.

* O ICP pode ser usado para tables `InnoDB` e `MyISAM`, incluindo tables `InnoDB` e `MyISAM` particionadas.

* Para tables `InnoDB`, o ICP é usado apenas para Secondary Indexes. O objetivo do ICP é reduzir o número de leituras de linha completa e, consequentemente, reduzir operações de I/O. Para Clustered Indexes `InnoDB`, o registro completo já é lido para o `InnoDB Buffer Pool`. Usar ICP neste caso não reduz I/O.

* O ICP não é suportado com Secondary Indexes criados em colunas geradas virtuais. O `InnoDB` suporta Secondary Indexes em colunas geradas virtuais.

* Conditions que se referem a Subqueries não podem ser enviadas para baixo (pushed down).
* Conditions que se referem a stored functions não podem ser enviadas para baixo. Storage Engines não podem invocar stored functions.

* Triggered conditions não podem ser enviadas para baixo. (Para informações sobre *triggered conditions*, consulte a Seção 8.2.2.3, “Optimizing Subqueries with the EXISTS Strategy”.)

Para entender como esta otimização funciona, considere primeiro como um Index Scan prossegue quando o Index Condition Pushdown não é usado:

1. Obtenha a próxima linha, primeiro lendo o Index tuple, e depois usando o Index tuple para localizar e ler a linha completa da table.

2. Teste a parte da condição `WHERE` que se aplica a esta table. Aceite ou rejeite a linha com base no resultado do teste.

Usando o Index Condition Pushdown, o Scan prossegue da seguinte forma:

1. Obtenha o Index tuple da próxima linha (mas não a linha completa da table).

2. Teste a parte da condição `WHERE` que se aplica a esta table e que pode ser verificada usando apenas Index Columns. Se a Condition não for satisfeita, prossiga para o Index tuple da próxima linha.

3. Se a Condition for satisfeita, use o Index tuple para localizar e ler a linha completa da table.

4. Teste a parte restante da condição `WHERE` que se aplica a esta table. Aceite ou rejeite a linha com base no resultado do teste.

A saída do `EXPLAIN` mostra `Using index condition` na coluna `Extra` quando o Index Condition Pushdown é usado. Não mostra `Using index` porque isso não se aplica quando linhas completas da table devem ser lidas.

Suponha que uma table contenha informações sobre pessoas e seus endereços e que a table tenha um Index definido como `INDEX (zipcode, lastname, firstname)`. Se soubermos o valor do `zipcode` de uma pessoa, mas não tivermos certeza sobre o último nome, podemos pesquisar assim:

```sql
SELECT * FROM people
  WHERE zipcode='95054'
  AND lastname LIKE '%etrunia%'
  AND address LIKE '%Main Street%';
```

O MySQL pode usar o Index para realizar um Scan pelas pessoas com `zipcode='95054'`. A segunda parte (`lastname LIKE '%etrunia%'`) não pode ser usada para limitar o número de linhas que devem ser *scanned* (percorridas), então, sem o Index Condition Pushdown, esta Query deve recuperar linhas completas da table para todas as pessoas que têm `zipcode='95054'`.

Com o Index Condition Pushdown, o MySQL verifica a parte `lastname LIKE '%etrunia%'` antes de ler a linha completa da table. Isso evita a leitura de linhas completas correspondentes a Index tuples que correspondam à condição `zipcode`, mas não à condição `lastname`.

O Index Condition Pushdown é habilitado por padrão. Ele pode ser controlado com a variável de sistema `optimizer_switch` configurando o *flag* `index_condition_pushdown`:

```sql
SET optimizer_switch = 'index_condition_pushdown=off';
SET optimizer_switch = 'index_condition_pushdown=on';
```

Consulte a Seção 8.9.2, “Switchable Optimizations”.