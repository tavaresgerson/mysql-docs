### 8.9.3 Optimizer Hints

Uma forma de controlar as estratégias do optimizer é definir a variável de sistema `optimizer_switch` (consulte a Seção 8.9.2, “Switchable Optimizations”). Alterações nesta variável afetam a execução de todas as Queries subsequentes; para afetar uma Query de maneira diferente de outra, é necessário alterar `optimizer_switch` antes de cada uma.

Outra maneira de controlar o optimizer é usando *optimizer hints* (dicas do optimizer), que podem ser especificadas dentro de comandos individuais. Como os optimizer hints se aplicam por comando, eles fornecem um controle mais detalhado sobre os planos de execução de comandos do que o que pode ser alcançado usando `optimizer_switch`. Por exemplo, você pode habilitar uma otimização para uma tabela em um comando e desabilitar a otimização para uma tabela diferente. Hints dentro de um comando têm precedência sobre os sinalizadores `optimizer_switch`.

Exemplos:

```sql
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
SELECT /*+ BKA(t1) NO_BKA(t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ NO_ICP(t1, t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ SEMIJOIN(FIRSTMATCH, LOOSESCAN) */ * FROM t1 ...;
EXPLAIN SELECT /*+ NO_ICP(t1) */ * FROM t1 WHERE ...;
```

Nota

O cliente **mysql** por padrão remove comentários de comandos SQL enviados ao servidor (incluindo optimizer hints) até o MySQL 5.7.7, quando foi alterado para passar os optimizer hints para o servidor. Para garantir que os optimizer hints não sejam removidos se você estiver usando uma versão antiga do cliente **mysql** com uma versão do servidor que entenda os optimizer hints, invoque **mysql** com a opção `--comments`.

Os Optimizer Hints, descritos aqui, diferem dos Index Hints, descritos na Seção 8.9.4, “Index Hints”. Optimizer hints e Index hints podem ser usados separadamente ou em conjunto.

* Visão Geral dos Optimizer Hints
* Sintaxe dos Optimizer Hints
* Optimizer Hints em Nível de Tabela (Table-Level)
* Optimizer Hints em Nível de Index (Index-Level)
* Optimizer Hints de Subquery
* Optimizer Hints de Tempo de Execução do Comando
* Optimizer Hints para Nomear Query Blocks

#### Visão Geral dos Optimizer Hints

Os Optimizer Hints se aplicam em diferentes níveis de escopo:

* Global: O hint afeta o comando inteiro.
* Query block: O hint afeta um Query Block específico dentro de um comando.

* Table-level: O hint afeta uma tabela específica dentro de um Query Block.

* Index-level: O hint afeta um Index específico dentro de uma tabela.

A tabela a seguir resume os optimizer hints disponíveis, as estratégias do optimizer que eles afetam e o escopo ou escopos nos quais eles se aplicam. Mais detalhes são fornecidos adiante.

**Tabela 8.2 Optimizer Hints Disponíveis**

<table summary="Nomes, descrições e contextos dos optimizer hints em que eles se aplicam.">
  <col style="width: 30%"/>
  <col style="width: 40%"/>
  <col style="width: 30%"/>
  <thead>
    <tr>
      <th>Nome do Hint</th>
      <th>Descrição</th>
      <th>Escopos Aplicáveis</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>BKA</code>, <code>NO_BKA</code></th>
      <td>Afeta o processamento de JOIN Batched Key Access</td>
      <td>Query block, table</td>
    </tr>
    <tr>
      <th><code>BNL</code>, <code>NO_BNL</code></th>
      <td>Afeta o processamento de JOIN Block Nested-Loop</td>
      <td>Query block, table</td>
    </tr>
    <tr>
      <th><code>MAX_EXECUTION_TIME</code></th>
      <td>Limita o tempo de execução do comando</td>
      <td>Global</td>
    </tr>
    <tr>
      <th><code>MRR</code>, <code>NO_MRR</code></th>
      <td>Afeta a otimização Multi-Range Read</td>
      <td>Table, index</td>
    </tr>
    <tr>
      <th><code>NO_ICP</code></th>
      <td>Afeta a otimização Index Condition Pushdown</td>
      <td>Table, index</td>
    </tr>
    <tr>
      <th><code>NO_RANGE_OPTIMIZATION</code></th>
      <td>Afeta a otimização de range (intervalo)</td>
      <td>Table, index</td>
    </tr>
    <tr>
      <th><code>QB_NAME</code></th>
      <td>Atribui nome ao Query Block</td>
      <td>Query block</td>
    </tr>
    <tr>
      <th><code>SEMIJOIN</code>, <code>NO_SEMIJOIN</code></th>
      <td>Estratégias semijoin</td>
      <td>Query block</td>
    </tr>
    <tr>
      <th><code>SUBQUERY</code></th>
      <td>Afeta a materialization, estratégias de Subquery <code>IN</code>-to-<code>EXISTS</code></td>
      <td>Query block</td>
    </tr>
  </tbody>
</table>

Desabilitar uma otimização impede que o optimizer a utilize. Habilitar uma otimização significa que o optimizer está livre para usar a estratégia se ela for aplicável à execução do comando, mas não que o optimizer necessariamente a utilize.

#### Sintaxe dos Optimizer Hints

O MySQL suporta comentários em comandos SQL, conforme descrito na Seção 9.6, “Comentários”. Os Optimizer Hints devem ser especificados dentro de comentários `/*+ ... */`. Ou seja, os optimizer hints usam uma variante da sintaxe de comentário `/* ... */` estilo C, com um caractere `+` seguindo a sequência de abertura de comentário `/*`. Exemplos:

```sql
/*+ BKA(t1) */
/*+ BNL(t1, t2) */
/*+ NO_RANGE_OPTIMIZATION(t4 PRIMARY) */
/*+ QB_NAME(qb2) */
```

Espaços em branco são permitidos após o caractere `+`.

O parser reconhece comentários de optimizer hint após a palavra-chave inicial dos comandos `SELECT`, `UPDATE`, `INSERT`, `REPLACE` e `DELETE`. Hints são permitidos nestes contextos:

* No início dos comandos de Query e de alteração de dados:

  ```sql
  SELECT /*+ ... */ ...
  INSERT /*+ ... */ ...
  REPLACE /*+ ... */ ...
  UPDATE /*+ ... */ ...
  DELETE /*+ ... */ ...
  ```

* No início dos Query Blocks:

  ```sql
  (SELECT /*+ ... */ ... )
  (SELECT ... ) UNION (SELECT /*+ ... */ ... )
  (SELECT /*+ ... */ ... ) UNION (SELECT /*+ ... */ ... )
  UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  INSERT ... SELECT /*+ ... */ ...
  ```

* Em comandos passíveis de hints, precedidos por `EXPLAIN`. Por exemplo:

  ```sql
  EXPLAIN SELECT /*+ ... */ ...
  EXPLAIN UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  ```

  A implicação é que você pode usar `EXPLAIN` para ver como os optimizer hints afetam os planos de execução. Use `SHOW WARNINGS` imediatamente após `EXPLAIN` para ver como os hints são utilizados. A saída estendida do `EXPLAIN` exibida por um `SHOW WARNINGS` subsequente indica quais hints foram usados. Hints ignorados não são exibidos.

Um comentário de hint pode conter múltiplos hints, mas um Query Block não pode conter múltiplos comentários de hint. Isto é válido:

```sql
SELECT /*+ BNL(t1) BKA(t2) */ ...
```

Mas isto é inválido:

```sql
SELECT /*+ BNL(t1) */ /* BKA(t2) */ ...
```

Quando um comentário de hint contém múltiplos hints, existe a possibilidade de duplicatas e conflitos. As seguintes diretrizes gerais se aplicam. Para tipos de hint específicos, regras adicionais podem ser aplicadas, conforme indicado nas descrições dos hints.

* Hints duplicados: Para um hint como `/*+ MRR(idx1) MRR(idx1) */`, o MySQL usa o primeiro hint e emite um warning sobre o hint duplicado.

* Hints conflitantes: Para um hint como `/*+ MRR(idx1) NO_MRR(idx1) */`, o MySQL usa o primeiro hint e emite um warning sobre o segundo hint conflitante.

Os nomes dos Query Blocks são identificadores e seguem as regras usuais sobre quais nomes são válidos e como citá-los (consulte a Seção 9.2, “Schema Object Names”).

Os nomes dos hints, nomes dos Query Blocks e nomes das estratégias não diferenciam maiúsculas de minúsculas (case-sensitive). As referências aos nomes de tabelas e Indexes seguem as regras usuais de diferenciação de maiúsculas e minúsculas de identificadores (consulte a Seção 9.2.3, “Identifier Case Sensitivity”).

#### Optimizer Hints em Nível de Tabela

Os hints em nível de tabela afetam o uso dos algoritmos de processamento de JOIN Block Nested-Loop (BNL) e Batched Key Access (BKA) (consulte a Seção 8.2.1.11, “Block Nested-Loop and Batched Key Access Joins”). Esses tipos de hints se aplicam a tabelas específicas, ou a todas as tabelas em um Query Block.

Sintaxe dos hints em nível de tabela:

```sql
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

A sintaxe refere-se a estes termos:

* *`hint_name`*: Estes nomes de hint são permitidos:

  + `BKA`, `NO_BKA`: Habilita ou desabilita BKA para as tabelas especificadas.

  + `BNL`, `NO_BNL`: Habilita ou desabilita BNL para as tabelas especificadas.

  Nota

  Para usar um hint BNL ou BKA para habilitar o *join buffering* para qualquer tabela interna de um Outer JOIN, o *join buffering* deve ser habilitado para todas as tabelas internas do Outer JOIN.

* *`tbl_name`*: O nome de uma tabela usada no comando. O hint se aplica a todas as tabelas que ele nomeia. Se o hint não nomear nenhuma tabela, ele se aplica a todas as tabelas do Query Block em que ocorre.

  Se uma tabela tiver um alias, os hints devem se referir ao alias, e não ao nome da tabela.

  Os nomes de tabelas nos hints não podem ser qualificados com nomes de schema.

* *`query_block_name`*: O Query Block ao qual o hint se aplica. Se o hint não incluir um `@query_block_name` principal, o hint se aplica ao Query Block em que ocorre. Para a sintaxe `tbl_name@query_block_name`, o hint se aplica à tabela nomeada no Query Block nomeado. Para atribuir um nome a um Query Block, consulte Optimizer Hints para Nomear Query Blocks.

Exemplos:

```sql
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
```

Um hint em nível de tabela aplica-se a tabelas que recebem registros de tabelas anteriores, e não a tabelas remetentes (*sender tables*). Considere este comando:

```sql
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

Se o optimizer escolher processar `t1` primeiro, ele aplicará um Block Nested-Loop JOIN a `t2`, armazenando em Buffer as linhas de `t1` antes de começar a ler de `t2`. Se o optimizer escolher processar `t2` primeiro, o hint não terá efeito porque `t2` é uma tabela remetente.

#### Optimizer Hints em Nível de Index

Os hints em nível de Index afetam quais estratégias de processamento de Index o optimizer utiliza para tabelas ou Indexes específicos. Esses tipos de hints afetam o uso de Index Condition Pushdown (ICP), Multi-Range Read (MRR) e otimizações de range (intervalo) (consulte a Seção 8.2.1, “Optimizing SELECT Statements”).

Sintaxe dos hints em nível de Index:

```sql
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

A sintaxe refere-se a estes termos:

* *`hint_name`*: Estes nomes de hint são permitidos:

  + `MRR`, `NO_MRR`: Habilita ou desabilita MRR para a tabela ou Indexes especificados. Os hints MRR se aplicam apenas a tabelas `InnoDB` e `MyISAM`.

  + `NO_ICP`: Desabilita ICP para a tabela ou Indexes especificados. Por padrão, ICP é uma estratégia de otimização candidata, portanto, não há um hint para habilitá-la.

  + `NO_RANGE_OPTIMIZATION`: Desabilita o acesso ao Index por range para a tabela ou Indexes especificados. Este hint também desabilita Index Merge e Loose Index Scan para a tabela ou Indexes. Por padrão, o acesso por range é uma estratégia de otimização candidata, portanto, não há um hint para habilitá-la.

    Este hint pode ser útil quando o número de ranges pode ser alto e a otimização de range exigiria muitos recursos.

* *`tbl_name`*: A tabela à qual o hint se aplica.

* *`index_name`*: O nome de um Index na tabela nomeada. O hint se aplica a todos os Indexes que ele nomeia. Se o hint não nomear Indexes, ele se aplica a todos os Indexes da tabela.

  Para se referir a uma Primary Key, use o nome `PRIMARY`. Para ver os nomes dos Indexes de uma tabela, use `SHOW INDEX`.

* *`query_block_name`*: O Query Block ao qual o hint se aplica. Se o hint não incluir um `@query_block_name` principal, o hint se aplica ao Query Block em que ocorre. Para a sintaxe `tbl_name@query_block_name`, o hint se aplica à tabela nomeada no Query Block nomeado. Para atribuir um nome a um Query Block, consulte Optimizer Hints para Nomear Query Blocks.

Exemplos:

```sql
SELECT /*+ MRR(t1) */ * FROM t1 WHERE f2 <= 3 AND 3 <= f3;
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
INSERT INTO t3(f1, f2, f3)
  (SELECT /*+ NO_ICP(t2) */ t2.f1, t2.f2, t2.f3 FROM t1,t2
   WHERE t1.f1=t2.f1 AND t2.f2 BETWEEN t1.f1
   AND t1.f2 AND t2.f2 + 1 >= t1.f1 + 1);
```

#### Optimizer Hints de Subquery

Os hints de Subquery afetam se devem ser usadas transformações semijoin e quais estratégias semijoin devem ser permitidas e, quando semijoins não são usados, se deve ser usada a materialization de Subquery ou transformações `IN`-to-`EXISTS`. Para obter mais informações sobre essas otimizações, consulte a Seção 8.2.2, “Optimizing Subqueries, Derived Tables, and View References”.

Sintaxe dos hints que afetam as estratégias semijoin:

```sql
hint_name([@query_block_name] [strategy [, strategy] ...])
```

A sintaxe refere-se a estes termos:

* *`hint_name`*: Estes nomes de hint são permitidos:

  + `SEMIJOIN`, `NO_SEMIJOIN`: Habilita ou desabilita as estratégias semijoin nomeadas.

* *`strategy`*: Uma estratégia semijoin a ser habilitada ou desabilitada. Estes nomes de estratégia são permitidos: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

  Para hints `SEMIJOIN`, se nenhuma estratégia for nomeada, o semijoin será usado se possível com base nas estratégias habilitadas de acordo com a variável de sistema `optimizer_switch`. Se estratégias forem nomeadas, mas não forem aplicáveis ao comando, `DUPSWEEDOUT` será usado.

  Para hints `NO_SEMIJOIN`, se nenhuma estratégia for nomeada, o semijoin não será usado. Se estratégias nomeadas excluírem todas as estratégias aplicáveis ao comando, `DUPSWEEDOUT` será usado.

Se uma Subquery estiver aninhada dentro de outra e ambas forem mescladas em um semijoin de uma Query externa, qualquer especificação de estratégias semijoin para a Query mais interna será ignorada. Os hints `SEMIJOIN` e `NO_SEMIJOIN` ainda podem ser usados para habilitar ou desabilitar transformações semijoin para tais subqueries aninhadas.

Se `DUPSWEEDOUT` for desabilitado, ocasionalmente o optimizer pode gerar um plano de Query que está longe de ser ideal. Isso ocorre devido à poda heurística durante a busca gulosa (greedy search), o que pode ser evitado definindo `optimizer_prune_level=0`.

Exemplos:

```sql
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Sintaxe dos hints que afetam se deve ser usada materialization de Subquery ou transformações `IN`-to-`EXISTS`:

```sql
SUBQUERY([@query_block_name] strategy)
```

O nome do hint é sempre `SUBQUERY`.

Para hints `SUBQUERY`, estes valores de *`strategy`* são permitidos: `INTOEXISTS`, `MATERIALIZATION`.

Exemplos:

```sql
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

Para hints semijoin e `SUBQUERY`, um `@query_block_name` principal especifica o Query Block ao qual o hint se aplica. Se o hint não incluir um `@query_block_name` principal, o hint se aplica ao Query Block em que ocorre. Para atribuir um nome a um Query Block, consulte Optimizer Hints para Nomear Query Blocks.

Se um comentário de hint contiver múltiplos hints de Subquery, o primeiro será usado. Se houver outros hints seguintes desse tipo, eles gerarão um warning. Hints seguintes de outros tipos são ignorados silenciosamente.

#### Optimizer Hints de Tempo de Execução do Comando

O hint `MAX_EXECUTION_TIME` é permitido apenas para comandos `SELECT`. Ele impõe um limite *`N`* (um valor de timeout em milissegundos) sobre por quanto tempo um comando tem permissão para ser executado antes que o servidor o encerre:

```sql
MAX_EXECUTION_TIME(N)
```

Exemplo com um timeout de 1 segundo (1000 milissegundos):

```sql
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

O hint `MAX_EXECUTION_TIME(N)` define um timeout de execução de comando de *`N`* milissegundos. Se esta opção estiver ausente ou *`N`* for 0, aplica-se o timeout de comando estabelecido pela variável de sistema `max_execution_time`.

O hint `MAX_EXECUTION_TIME` é aplicável da seguinte forma:

* Para comandos com múltiplas palavras-chave `SELECT`, como unions ou comandos com subqueries, `MAX_EXECUTION_TIME` aplica-se ao comando inteiro e deve aparecer após o primeiro `SELECT`.

* Ele se aplica a comandos `SELECT` somente leitura (*read-only*). Comandos que não são somente leitura são aqueles que invocam uma stored function que modifica dados como um efeito colateral.

* Ele não se aplica a comandos `SELECT` em stored programs e é ignorado.

#### Optimizer Hints para Nomear Query Blocks

Os optimizer hints em nível de tabela, em nível de Index e de Subquery permitem que Query Blocks específicos sejam nomeados como parte de sua sintaxe de argumento. Para criar esses nomes, use o hint `QB_NAME`, que atribui um nome ao Query Block no qual ocorre:

```sql
QB_NAME(name)
```

Os hints `QB_NAME` podem ser usados para tornar explícito de forma clara a quais Query Blocks outros hints se aplicam. Eles também permitem que todos os hints sem nome de Query Block sejam especificados dentro de um único comentário de hint para facilitar a compreensão de comandos complexos. Considere o seguinte comando:

```sql
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```

Os hints `QB_NAME` atribuem nomes aos Query Blocks no comando:

```sql
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

Então, outros hints podem usar esses nomes para se referir aos Query Blocks apropriados:

```sql
SELECT /*+ QB_NAME(qb1) MRR(@qb1 t1) BKA(@qb2) NO_MRR(@qb3t1 idx1, id2) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

O efeito resultante é o seguinte:

* `MRR(@qb1 t1)` aplica-se à tabela `t1` no Query Block `qb1`.

* `BKA(@qb2)` aplica-se ao Query Block `qb2`.

* `NO_MRR(@qb3 t1 idx1, id2)` aplica-se aos Indexes `idx1` e `idx2` na tabela `t1` no Query Block `qb3`.

Os nomes dos Query Blocks são identificadores e seguem as regras usuais sobre quais nomes são válidos e como citá-los (consulte a Seção 9.2, “Schema Object Names”). Por exemplo, um nome de Query Block que contenha espaços deve ser citado, o que pode ser feito usando crases:

```sql
SELECT /*+ BKA(@`my hint name`) */ ...
  FROM (SELECT /*+ QB_NAME(`my hint name`) */ ...) ...
```

Se o modo SQL `ANSI_QUOTES` estiver habilitado, também é possível citar nomes de Query Blocks entre aspas duplas:

```sql
SELECT /*+ BKA(@"my hint name") */ ...
  FROM (SELECT /*+ QB_NAME("my hint name") */ ...) ...
```