### 10.9.3 Dicas de otimização

Uma maneira de controlar as estratégias de otimização é definir a variável de sistema `optimizer_switch` (consulte a Seção 10.9.2, “Otimizações comutadas”). Alterações nesta variável afetam a execução de todas as consultas subsequentes; para alterar uma consulta de maneira diferente da outra, é necessário alterar `optimizer_switch` antes de cada uma.

Outra maneira de controlar o otimizador é usando dicas de otimização, que podem ser especificadas dentro de instruções individuais. Como as dicas de otimização são aplicadas por instrução, elas fornecem um controle mais preciso sobre os planos de execução das instruções do que o que pode ser alcançado usando `optimizer_switch`. Por exemplo, você pode habilitar uma otimização para uma tabela em uma instrução e desabilitar a otimização para uma tabela diferente. As dicas dentro de uma instrução têm precedência sobre os flags de `optimizer_switch`.

Exemplos:

```
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
SELECT /*+ BKA(t1) NO_BKA(t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ NO_ICP(t1, t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ SEMIJOIN(FIRSTMATCH, LOOSESCAN) */ * FROM t1 ...;
EXPLAIN SELECT /*+ NO_ICP(t1) */ * FROM t1 WHERE ...;
SELECT /*+ MERGE(dt) */ * FROM (SELECT * FROM t1) AS dt;
INSERT /*+ SET_VAR(foreign_key_checks=OFF) */ INTO t2 VALUES(2);
```

As dicas de otimização, descritas aqui, diferem das dicas de índice, descritas na Seção 10.9.4, “Dicas de índice”. Dicas de otimização e dicas de índice podem ser usadas separadamente ou juntas.

*  Visão geral das dicas de otimização
*  Sintaxe das dicas de otimização
*  Dicas de ordem de junção
*  Dicas de otimização de nível de tabela
*  Dicas de otimização de nível de índice
*  Dicas de otimização de subconsultas
*  Dicas de otimização de tempo de execução de instruções
*  Sintaxe de dicas de definição de variáveis
*  Sintaxe de dicas de grupo de recursos
*  Dicas de otimização para blocos de consultas de nomeação

#### Visão geral das dicas de otimização

As dicas de otimização são aplicadas em diferentes níveis de escopo:

* Global: A dica afeta toda a instrução
* Bloco de consulta: A dica afeta um bloco de consulta específico dentro de uma instrução
* Nível de tabela: A dica afeta uma tabela específica dentro de um bloco de consulta
* Nível de índice: A dica afeta um índice específico dentro de uma tabela

A tabela a seguir resume as dicas de otimização disponíveis, as estratégias de otimização que elas afetam e o escopo ou escopos nos quais elas são aplicadas. Mais detalhes são fornecidos mais adiante.

**Tabela 10.2 Dicas de otimização disponíveis**

<table><thead><tr> <th>Nome da Dicas</th> <th>Descrição</th> <th>Áreas de Aplicação</th> </tr></thead><tbody><tr> <th><code>BKA</code>, <code>NO_BKA</code></th> <td>Afeta o processamento de junções com acesso a chave em lote</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th><code>BNL</code>, <code>NO_BNL</code></th> <td>Afeta a otimização da junção hash</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th><code>DERIVED_CONDITION_PUSHDOWN</code>, <code>NO_DERIVED_CONDITION_PUSHDOWN</code></th> <td>Use ou ignore a otimização de empurrão de condição derivada para tabelas derivadas materializadas</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th><code>GROUP_INDEX</code>, <code>NO_GROUP_INDEX</code></th> <td>Use ou ignore o índice especificado ou índices para varreduras de índice em operações de <code>GROUP BY</code></td> <td>Índice</td> </tr><tr> <th><code>HASH_JOIN</code>, <code>NO_HASH_JOIN</code></th> <td>Afeta a otimização da junção hash (sem efeito no MySQL 8.4)</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th><code>INDEX</code>, <code>NO_INDEX</code></th> <td>Atua como a combinação de <code>JOIN_INDEX</code>, <code>GROUP_INDEX</code> e <code>ORDER_INDEX</code>, ou como a combinação de <code>NO_JOIN_INDEX</code>, <code>NO_GROUP_INDEX</code> e <code>NO_ORDER_INDEX</code></td> <td>Índice</td> </tr><tr> <th><code>INDEX_MERGE</code>, <code>NO_INDEX_MERGE</code></th> <td>Afeta a otimização da junção de índices</td> <td>Tabela, índice</td> </tr><tr> <th><code>JOIN_FIXED_ORDER</code></th> <td>Use a ordem da tabela especificada na cláusula <code>FROM</code> para a ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th><code>JOIN_INDEX</code>, <code>NO_JOIN_INDEX</code></th> <td>Use ou ignore o índice ou índices especificados para qualquer método de acesso</td> <td>Índice</td> </tr><tr> <th><code>JOIN_ORDER</code></th> <td>Use a ordem da tabela especificada na dica para a ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th><code>JOIN_PREFIX</code></th> <td>Use a ordem da tabela especificada na dica para as primeiras tabelas da ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th><code>JOIN_SUFFIX</code></th> <td>Use a ordem da tabela especificada na dica para as últimas tabelas da ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th><code>MAX_EXECUTION_TIME</code></th> <td>Limita o tempo de execução da declaração</td> <td>Global</td> </tr><tr> <th><code>MERGE</code>, <code>NO_MERGE</code></th> <td>Afeta a junção de tabelas/visões em um bloco de consulta externo</td> <td>Tabela</td> </tr><tr> <th><code>MRR</code>, <code>NO_MRR</code></th> <td>Afeta a otimização de leitura de múltiplos intervalos</td> <td>Tabela, índice</td> </tr><tr> <th><code>NO_ICP</code></th> <td>Afeta a otimização de empurrão de condição de índice</td> <td>Tabela, índice</td> </tr><tr> <th><code>NO_RANGE_OPTIMIZATION</code></th> <td>Afeta a otimização de intervalo</td> <td>Tabela, índice</td> </tr><tr> <th><code>ORDER_INDEX</code>, <code>NO_ORDER_INDEX</code></th> <td>Use ou ignore o índice ou índices especificados para a ordenação de linhas</td> <td>Índice</td> </tr><tr> <th><code>QB_NAME</code></th> <td>Atribui um nome ao bloco de consulta</td> <td>Bloco de consulta</td> </tr><tr> <th><code>RESOURCE_GROUP</code></th> <td>Defina o grupo de recursos durante a execução da declaração</td> <td>Global</td> </tr><tr> <th><code>SEMIJOIN</code>, <code>NO_SEMIJOIN</code></th> <td>Afeta as estratégias de junção semijoin e antijoin</td> <td>Bloco de consulta</td> </tr><tr> <th><code>SKIP_SCAN</code>, <code>NO_SKIP_SCAN</code></th> <td>Afeta a otimização de varredura de omissão</td> <td>Tabela, índice</td> </tr><tr> <th><code>SET_VAR</code></th> <td>Defina variável durante a execução da declaração</td> <td>Global</td> </tr><tr> <th><code>SUBQUERY</code></th> <td>Afeta a materialização e estratégias de subconsultas <code>IN</code>-to-<code>EXISTS</code></td> <td>Bloco de

Desativar uma otimização impede que o otimizador a use. Ativá-la significa que o otimizador pode usar a estratégia se ela se aplicar à execução da instrução, não que o otimizador necessariamente a use.

#### Sintaxe de Dicas do Otimizador

O MySQL suporta comentários em instruções SQL, conforme descrito na Seção 11.7, “Comentários”. As dicas do otimizador devem ser especificadas dentro dos comentários `/*+ ... */`. Ou seja, as dicas do otimizador usam uma variante da sintaxe de comentário `/* ... */` em estilo C, com um caractere `+` após a sequência de abertura do comentário `/*`. Exemplos:

```
/*+ BKA(t1) */
/*+ BNL(t1, t2) */
/*+ NO_RANGE_OPTIMIZATION(t4 PRIMARY) */
/*+ QB_NAME(qb2) */
```

Espaçamento é permitido após o caractere `+`.

O analisador reconhece comentários de dicas do otimizador após a palavra-chave inicial de instruções `SELECT`, `UPDATE`, `INSERT`, `REPLACE` e `DELETE`. As dicas são permitidas nesses contextos:

* No início de instruções de consulta e mudança de dados:

  ```
  SELECT /*+ ... */ ...
  INSERT /*+ ... */ ...
  REPLACE /*+ ... */ ...
  UPDATE /*+ ... */ ...
  DELETE /*+ ... */ ...
  ```
* No início de blocos de consulta:

  ```
  (SELECT /*+ ... */ ... )
  (SELECT ... ) UNION (SELECT /*+ ... */ ... )
  (SELECT /*+ ... */ ... ) UNION (SELECT /*+ ... */ ... )
  UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  INSERT ... SELECT /*+ ... */ ...
  ```
* Em instruções hintaveis precedidas por `EXPLAIN`. Por exemplo:

  ```
  EXPLAIN SELECT /*+ ... */ ...
  EXPLAIN UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  ```

  A implicação é que você pode usar `EXPLAIN` para ver como as dicas do otimizador afetam os planos de execução. Use `SHOW WARNINGS` imediatamente após `EXPLAIN` para ver como as dicas são usadas. A saída detalhada do `EXPLAIN` exibida por um `SHOW WARNINGS` subsequente indica quais dicas foram usadas. Dicas ignoradas não são exibidas.

Um comentário de dica pode conter múltiplas dicas, mas um bloco de consulta não pode conter múltiplos comentários de dica. Isso é válido:

```
SELECT /*+ BNL(t1) BKA(t2) */ ...
```

Mas isso é inválido:

```
SELECT /*+ BNL(t1) */ /* BKA(t2) */ ...
```

Quando um comentário de dica contém múltiplas dicas, existe a possibilidade de duplicatas e conflitos. As seguintes diretrizes gerais se aplicam. Para tipos específicos de dicas, regras adicionais podem se aplicar, conforme indicado nas descrições das dicas.

* Dúvidas de dicas: Para uma dica como `/*+ MRR(idx1) MRR(idx1) */`, o MySQL usa a primeira dica e emite uma advertência sobre a dica duplicada.
* Dicas conflitantes: Para uma dica como `/*+ MRR(idx1) NO_MRR(idx1) */`, o MySQL usa a primeira dica e emite uma advertência sobre a segunda dica conflitante.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como devem ser citados (consulte a Seção 11.2, “Nomes de Objetos do Esquema”).

Os nomes das dicas, dos blocos de consulta e dos nomes de estratégias não são sensíveis ao caso. As referências a nomes de tabelas e índices seguem as regras habituais de sensibilidade ao caso dos identificadores (consulte a Seção 11.2.3, “Sensibilidade ao Caso dos Identificadores”).

#### Dicas do Otimizador de Ordem de Conclusão

As dicas de ordem de conclusão afetam a ordem em que o otimizador conclui as tabelas.

Sintaxe da dica `JOIN_FIXED_ORDER`:

```
hint_name([@query_block_name])
```

Sintaxe de outras dicas de ordem de conclusão:

```
hint_name([@query_block_name] tbl_name [, tbl_name] ...)
hint_name(tbl_name[@query_block_name] [, tbl_name[@query_block_name]] ...)
```

A sintaxe refere-se a esses termos:
* *`hint_name`*: Esses nomes de dicas são permitidos:

+  `JOIN_FIXED_ORDER`: Forçar o otimizador a unir tabelas usando a ordem em que aparecem na cláusula `FROM`. Isso é o mesmo que especificar `SELECT STRAIGHT_JOIN`.
  +  `JOIN_ORDER`: Instruir o otimizador a unir tabelas usando a ordem de tabela especificada. O indicativo se aplica às tabelas nomeadas. O otimizador pode colocar tabelas que não são nomeadas em qualquer lugar na ordem de junção, incluindo entre tabelas especificadas.
  +  `JOIN_PREFIX`: Instruir o otimizador a unir tabelas usando a ordem de tabela especificada para as primeiras tabelas do plano de execução da junção. O indicativo se aplica às tabelas nomeadas. O otimizador coloca todas as outras tabelas após as tabelas nomeadas.
  +  `JOIN_SUFFIX`: Instruir o otimizador a unir tabelas usando a ordem de tabela especificada para as últimas tabelas do plano de execução da junção. O indicativo se aplica às tabelas nomeadas. O otimizador coloca todas as outras tabelas antes das tabelas nomeadas.
* *`tbl_name`*: O nome de uma tabela usada na declaração. Um indicativo que nomeia tabelas se aplica a todas as tabelas que ele nomeia. O indicativo `JOIN_FIXED_ORDER` não nomeia tabelas e se aplica a todas as tabelas na cláusula `FROM` do bloco de consulta em que ocorre.

  Se uma tabela tiver um alias, os indicativos devem se referir ao alias, não ao nome da tabela.

  Os nomes das tabelas nos indicativos não podem ser qualificados com nomes de esquema.
* *`query_block_name`*: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o prefixo `@query_block_name`, o indicativo se aplica ao bloco de consulta em que ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Indicativos de Otimizador para Nomeação de Blocos de Consulta.

Exemplo:

```
SELECT
/*+ JOIN_PREFIX(t2, t5@subq2, t4@subq1)
    JOIN_ORDER(t4@subq1, t3)
    JOIN_SUFFIX(t1) */
COUNT(*) FROM t1 JOIN t2 JOIN t3
           WHERE t1.f1 IN (SELECT /*+ QB_NAME(subq1) */ f1 FROM t4)
             AND t2.f1 IN (SELECT /*+ QB_NAME(subq2) */ f1 FROM t5);
```

Os indicadores controlam o comportamento das tabelas de junção parcial que são unidas ao bloco de consulta externa. Se as subconsultas `subq1` e `subq2` forem convertidas em junções parciais, as tabelas `t4@subq1` e `t5@subq2` serão unidas ao bloco de consulta externa. Neste caso, o indicador especificado no bloco de consulta externa controla o comportamento das tabelas `t4@subq1`, `t5@subq2`.

O otimizador resolve os indicadores de ordem de junção de acordo com esses princípios:

* Múltiplas instâncias de indicadores

  Apenas um `JOIN_PREFIX` e `JOIN_SUFFIX` de cada tipo são aplicados. Quaisquer indicadores posteriores do mesmo tipo são ignorados com um aviso. `JOIN_ORDER` pode ser especificado várias vezes.

  Exemplos:

  ```
  /*+ JOIN_PREFIX(t1) JOIN_PREFIX(t2) */
  ```

  O segundo indicador `JOIN_PREFIX` é ignorado com um aviso.

  ```
  /*+ JOIN_PREFIX(t1) JOIN_SUFFIX(t2) */
  ```

  Ambos os indicadores são aplicáveis. Não há aviso.

  ```
  /*+ JOIN_ORDER(t1, t2) JOIN_ORDER(t2, t3) */
  ```

  Ambos os indicadores são aplicáveis. Não há aviso.
* Indicadores conflitantes

  Em alguns casos, os indicadores podem conflitar, como quando `JOIN_ORDER` e `JOIN_PREFIX` têm ordens de tabela que são impossíveis de aplicar ao mesmo tempo:

  ```
  SELECT /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */ ... FROM t1, t2;
  ```

  Neste caso, o primeiro indicador especificado é aplicado e os indicadores conflitantes subsequentes são ignorados sem aviso. Um indicador válido que é impossível de aplicar é ignorado silenciosamente sem aviso.
* Indicadores ignorados

  Um indicador é ignorado se uma tabela especificada no indicador tiver uma dependência circular.

  Exemplo:

  ```
  /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */
  ```

  O indicador `JOIN_ORDER` define a tabela `t2` como dependente de `t1`. O indicador `JOIN_PREFIX` é ignorado porque a tabela `t1` não pode ser dependente de `t2`. Os indicadores ignorados não são exibidos na saída detalhada do `EXPLAIN`.
* Interação com tabelas `const`

  O otimizador MySQL coloca as tabelas `const` primeiro na ordem de junção, e a posição de uma tabela `const` não pode ser afetada por indicadores. As referências a tabelas `const` nas dicas de ordem de junção são ignoradas, embora a dica ainda seja aplicável. Por exemplo, estas são equivalentes:

  ```
  JOIN_ORDER(t1, const_tbl, t2)
  JOIN_ORDER(t1, t2)
  ```

Os hints aceitos mostrados na saída estendida `EXPLAIN` incluem tabelas `const` conforme especificadas.
* Interação com tipos de operações de junção

O MySQL suporta vários tipos de junções: `LEFT`, `RIGHT`, `INNER`, `CROSS`, `STRAIGHT_JOIN`. Um hint que conflita com o tipo de junção especificado é ignorado sem aviso.

Exemplo:

```
  SELECT /*+ JOIN_PREFIX(t1, t2) */FROM t2 LEFT JOIN t1;
  ```

Aqui, ocorre um conflito entre a ordem de junção solicitada no hint e a ordem exigida pelo `LEFT JOIN`. O hint é ignorado sem aviso.

#### Hints de Otimização de Nível de Tabela

Os hints de nível de tabela afetam:

* Uso dos algoritmos de processamento de junção `Block Nested-Loop (BNL)` e `Batched Key Access (BKA)` (consulte a Seção 10.2.1.12, “Junções Block Nested-Loop e Batched Key Access”).
* Se tabelas derivadas, referências a vistas ou expressões de tabela comuns devem ser unidas no bloco da consulta externa, ou materializadas usando uma tabela temporária interna.
* Uso da otimização de empurrão de condição de tabela derivada. Consulte a Seção 10.2.2.5, “Otimização de Empurrão de Condição de Tabela Derivada”.

Esses tipos de hints se aplicam a tabelas específicas ou a todas as tabelas em um bloco de consulta.

Sintaxe dos hints de nível de tabela:

```
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes de hint são permitidos:

  +  `BKA`, `NO_BKA`: Habilitar ou desabilitar o acesso por chave em lote para as tabelas especificadas.
  +  `BNL`, `NO_BNL`: Habilitar e desabilitar a otimização de junção hash.
  +  `DERIVED_CONDITION_PUSHDOWN`, `NO_DERIVED_CONDITION_PUSHDOWN`: Habilitar ou desabilitar o uso de empurrão de condição de tabela derivada para as tabelas especificadas. Para mais informações, consulte a Seção 10.2.2.5, “Otimização de Empurrão de Condição de Tabela Derivada”.
  +  `HASH_JOIN`, `NO_HASH_JOIN`: Esses hints não têm efeito no MySQL 8.4; use `BNL` ou `NO_BNL` em vez disso.
  +  `MERGE`, `NO_MERGE`: Habilitar a junção para as tabelas especificadas, referências a vistas ou expressões de tabela comuns; ou desabilitar a junção e usar materialização em vez disso. ::: info Nota

Para usar uma dica de hint de loop aninhado de bloco ou acesso de chave em lote para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve ser habilitado para todas as tabelas internas da junção externa.


:::
* *`tbl_name`*: O nome de uma tabela usada na declaração. A dica aplica-se a todas as tabelas que ela nomeia. Se a dica não nomear tabelas, ela aplica-se a todas as tabelas do bloco de consulta no qual ocorre.

Se uma tabela tiver um alias, as dicas devem se referir ao alias, não ao nome da tabela.

Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.
* *`query_block_name`*: O bloco de consulta ao qual a dica se aplica. Se a dica não incluir o nome do bloco de consulta `@query_block_name`, a dica aplica-se ao bloco de consulta no qual ocorre. Para a sintaxe `tbl_name@query_block_name`, a dica aplica-se à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomeação de blocos de consulta.

Exemplos:

```
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_MERGE(dt) */ * FROM (SELECT * FROM t1) AS dt;
```

Uma dica de nível de tabela aplica-se a tabelas que recebem registros de tabelas anteriores, não às tabelas de origem. Considere esta declaração:

```
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

Se o otimizador optar por processar `t1` primeiro, ele aplica uma junção de loop aninhado de bloco a `t2` bufferizando as linhas de `t1` antes de começar a ler de `t2`. Se o otimizador, em vez disso, optar por processar `t2` primeiro, a dica não tem efeito porque `t2` é uma tabela de origem.

Para as dicas  `MERGE` e `NO_MERGE`, essas regras de precedência se aplicam:

* Uma dica tem precedência sobre qualquer heurística do otimizador que não seja uma restrição técnica. (Se fornecer uma dica como sugestão não tiver efeito, o otimizador tem um motivo para ignorá-la.)
* Uma dica tem precedência sobre o sinalizador `derived_merge` da variável de sistema `optimizer_switch`.
* Para referências de visualizações, uma cláusula `ALGORITHM={MERGE|TEMPTABLE}` na definição da visualização tem precedência sobre uma dica especificada na consulta que faz referência à visualização.

#### Dicas de Otimizador de Nível de Índice


Os dicas de nível de índice afetam quais estratégias de processamento de índice o otimizador usa para tabelas ou índices específicos. Esses tipos de dicas afetam o uso do Pushdown de Condição de Índice (ICP), Leitura de Múltiplos Intervalos (MRR), Fusão de Índice e otimizações de intervalo (veja a Seção 10.2.1, “Otimização de Instruções SELECT”).

Sintaxe de dicas de nível de índice:

```
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes de dicas são permitidos:

  +  `GROUP_INDEX`, `NO_GROUP_INDEX`: Ativa ou desativa o(s) índice(s) especificado(s) para varreduras de índice para operações `GROUP BY`. Equivalente às dicas de índice `FORCE INDEX FOR GROUP BY`, `IGNORE INDEX FOR GROUP BY`.
  +  `INDEX`, `NO_INDEX`: Atua como a combinação de `JOIN_INDEX`, `GROUP_INDEX` e `ORDER_INDEX`, forçando o servidor a usar o(s) índice(s) especificado(s) para todos os escopos, ou como a combinação de `NO_JOIN_INDEX`, `NO_GROUP_INDEX` e `NO_ORDER_INDEX`, o que faz com que o servidor ignore o(s) índice(s) especificado(s) para todos os escopos. Equivalente a `FORCE INDEX`, `IGNORE INDEX`.
  +  `INDEX_MERGE`, `NO_INDEX_MERGE`: Ativa ou desativa o método de acesso de Fusão de Índice para a tabela ou índices especificados. Para informações sobre esse método de acesso, consulte a Seção 10.2.1.3, “Otimização de Fusão de Índice”. Essas dicas se aplicam a todos os três algoritmos de Fusão de Índice.

    A dica `INDEX_MERGE` força o otimizador a usar a Fusão de Índice para a tabela especificada usando o conjunto especificado de índices. Se nenhum índice for especificado, o otimizador considera todas as combinações de índice possíveis e seleciona a menos dispendiosa. A dica pode ser ignorada se a combinação de índice não for aplicável à declaração dada.

O  assinale `NO_INDEX_MERGE` desativa as combinações de fusão de índices que envolvem qualquer um dos índices especificados. Se o sinalizador especificar nenhum índice, a fusão de índices não é permitida para a tabela.
  +  `JOIN_INDEX`, `NO_JOIN_INDEX`: Força o MySQL a usar ou ignorar o índice ou índices especificados para qualquer método de acesso, como `ref`, `range`, `index_merge`, e assim por diante. É equivalente a `FORCE INDEX FOR JOIN`, `IGNORE INDEX FOR JOIN`.
  +  `MRR`, `NO_MRR`: Habilita ou desabilita o MRR para a tabela ou índices especificados. Os sinais de MRR aplicam-se apenas a tabelas `InnoDB` e `MyISAM`. Para obter informações sobre este método de acesso, consulte a Seção 10.2.1.11, “Otimização de Leitura de Múltiplos Intervalos”.
  +  `NO_ICP`: Desabilita o ICP para a tabela ou índices especificados. Por padrão, o ICP é uma estratégia de otimização candidata, portanto, não há sinalizador para a ativá-lo. Para obter informações sobre este método de acesso, consulte a Seção 10.2.1.6, “Otimização de Puxada de Condição de Índice”.
  +  `NO_RANGE_OPTIMIZATION`: Desabilita o acesso de intervalo de índice para a tabela ou índices especificados. Este sinalizador também desativa a fusão de índices e a varredura de índice solto para a tabela ou índices. Por padrão, o acesso de intervalo é uma estratégia de otimização candidata, portanto, não há sinalizador para ativá-lo.

Este sinalizador pode ser útil quando o número de intervalos pode ser alto e a otimização de intervalo exigiria muitos recursos.
  +  `ORDER_INDEX`, `NO_ORDER_INDEX`: Faz com que o MySQL use ou ignore o índice ou índices especificados para a ordenação de linhas. É equivalente a `FORCE INDEX FOR ORDER BY`, `IGNORE INDEX FOR ORDER BY`.
  +  `SKIP_SCAN`, `NO_SKIP_SCAN`: Habilita ou desabilita o método de acesso de varredura de salto para a tabela ou índices especificados. Para obter informações sobre este método de acesso, consulte o Método de Acesso de Varredura de Salto.

O  assinale `SKIP_SCAN` força o otimizador a usar a varredura de salto para a tabela especificada usando o conjunto de índices especificado. Se nenhum índice for especificado, o otimizador considera todos os índices possíveis e seleciona o menos dispendioso. O sinalizador pode ser ignorado se o índice não for aplicável à declaração dada.

O  assinatura `NO_SKIP_SCAN` desabilita o Desvio de Escaneio para os índices especificados. Se a assinatura especificar nenhum índice, o Desvio de Escaneio não é permitido para a tabela.
* *`tbl_name`*: A tabela à qual a assinatura se aplica.
* *`index_name`*: O nome de um índice na tabela nomeada. A assinatura se aplica a todos os índices que ela nomeia. Se a assinatura não nomear nenhum índice, ela se aplica a todos os índices na tabela.

Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use `SHOW INDEX`.
* *`query_block_name`*: O bloco de consulta ao qual a assinatura se aplica. Se a assinatura não incluir nenhum `@query_block_name` no início, a assinatura se aplica ao bloco de consulta no qual ocorre. Para a sintaxe `tbl_name@query_block_name`, a assinatura se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões de otimização para nomear blocos de consulta.
* *`query_block_name`*: O bloco de consulta ao qual a assinatura se aplica. Se a assinatura não incluir nenhum `@query_block_name` no início, a assinatura se aplica ao bloco de consulta no qual ocorre. Para a sintaxe `tbl_name@query_block_name`, a assinatura se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões de otimização para nomear blocos de consulta.

Exemplos:

```
SELECT /*+ INDEX_MERGE(t1 f3, PRIMARY) */ f2 FROM t1
  WHERE f1 = 'o' AND f2 = f3 AND f3 <= 4;
SELECT /*+ MRR(t1) */ * FROM t1 WHERE f2 <= 3 AND 3 <= f3;
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
INSERT INTO t3(f1, f2, f3)
  (SELECT /*+ NO_ICP(t2) */ t2.f1, t2.f2, t2.f3 FROM t1,t2
   WHERE t1.f1=t2.f1 AND t2.f2 BETWEEN t1.f1
   AND t1.f2 AND t2.f2 + 1 >= t1.f1 + 1);
SELECT /*+ SKIP_SCAN(t1 PRIMARY) */ f1, f2
  FROM t1 WHERE f2 > 40;
```

Os seguintes exemplos usam as assinaturas de junção de índices, mas outras assinaturas de nível de índice seguem os mesmos princípios em relação à ignorância da assinatura e à precedência das assinaturas do otimizador em relação à variável de sistema `optimizer_switch` ou assinaturas de índice.

Suponha que a tabela `t1` tenha as colunas `a`, `b`, `c` e `d`; e que existam índices nomeados `i_a`, `i_b` e `i_c` em `a`, `b` e `c`, respectivamente:

```
SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c)*/ * FROM t1
  WHERE a = 1 AND b = 2 AND c = 3 AND d = 4;
```

A junção de índices é usada para `(i_a, i_b, i_c)` neste caso.

```
SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c)*/ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
```

A junção de índices é usada para `(i_b, i_c)` neste caso.

```
/*+ INDEX_MERGE(t1 i_a, i_b) NO_INDEX_MERGE(t1 i_b) */
```

`NO_INDEX_MERGE` é ignorado porque há uma assinatura anterior para a mesma tabela.

```
/*+ NO_INDEX_MERGE(t1 i_a, i_b) INDEX_MERGE(t1 i_b) */
```

`INDEX_MERGE` é ignorado porque há uma assinatura anterior para a mesma tabela.

Para as assinaturas de otimizador `INDEX_MERGE` e `NO_INDEX_MERGE`, essas regras de precedência se aplicam:

* Se uma assinatura de otimizador for especificada e aplicável, ela tem precedência sobre os flags de junção de índice da variável de sistema `optimizer_switch`.

  ```
  SET optimizer_switch='index_merge_intersection=off';
  SELECT /*+ INDEX_MERGE(t1 i_b, i_c) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

  A assinatura tem precedência sobre `optimizer_switch`. A junção de índices é usada para `(i_b, i_c)` neste caso.

  ```
  SET optimizer_switch='index_merge_intersection=on';
  SELECT /*+ INDEX_MERGE(t1 i_b) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

O aviso especifica apenas um índice, portanto, é inaplicável, e a bandeira `optimizer_switch` (`off`) é aplicada. A junção de índices é usada se o otimizador a considerar eficiente em termos de custo.

```
  SET optimizer_switch='index_merge_intersection=off';
  SELECT /*+ INDEX_MERGE(t1 i_b) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

O aviso especifica apenas um índice, portanto, é inaplicável, e a bandeira `optimizer_switch` (`on`) é aplicada. A junção de índices não é usada.

* Os avisos de otimização de nível de índice `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` têm precedência sobre os avisos equivalentes `FORCE INDEX`; ou seja, eles fazem com que os avisos `FORCE INDEX` sejam ignorados. Da mesma forma, os avisos `NO_GROUP_INDEX`, `NO_INDEX`, `NO_JOIN_INDEX` e `NO_ORDER_INDEX` têm precedência sobre quaisquer equivalentes `IGNORE INDEX`, também fazendo com que eles sejam ignorados.

Os avisos de otimização de nível de índice `GROUP_INDEX`, `NO_GROUP_INDEX`, `INDEX`, `NO_INDEX`, `JOIN_INDEX`, `NO_JOIN_INDEX`, `ORDER_INDEX` e `NO_ORDER_INDEX` têm precedência sobre todos os outros avisos do otimizador, incluindo outros avisos de otimização de nível de índice. Todos os outros avisos do otimizador são aplicados apenas aos índices permitidos por esses.

Os avisos `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` são equivalentes a `FORCE INDEX` e não a `USE INDEX`. Isso ocorre porque o uso de um ou mais desses avisos significa que uma varredura da tabela é usada apenas se não houver maneira de usar um dos índices nomeados para encontrar linhas na tabela. Para fazer com que o MySQL use o mesmo índice ou conjunto de índices que com uma instância específica de `USE INDEX`, você pode usar `NO_INDEX`, `NO_JOIN_INDEX`, `NO_GROUP_INDEX`, `NO_ORDER_INDEX` ou alguma combinação desses.

Para replicar o efeito que `USE INDEX` tem na consulta `SELECT a,c FROM t1 USE INDEX FOR ORDER BY (i_a) ORDER BY a`, você pode usar o aviso de otimização `NO_ORDER_INDEX` para cobrir todos os índices na tabela, exceto o desejado, da seguinte forma:

```
  SELECT /*+ NO_ORDER_INDEX(t1 i_b,i_c) */ a,c
      FROM t1
      ORDER BY a;
  ```

Tentar combinar `NO_ORDER_INDEX` para a tabela como um todo com `USE INDEX FOR ORDER BY` não funciona para isso, porque `NO_ORDER_BY` faz com que `USE INDEX` seja ignorado, como mostrado aqui:

```
  mysql> EXPLAIN SELECT /*+ NO_ORDER_INDEX(t1) */ a,c FROM t1
      ->     USE INDEX FOR ORDER BY (i_a) ORDER BY a\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: t1
     partitions: NULL
           type: ALL
  possible_keys: NULL
            key: NULL
        key_len: NULL
            ref: NULL
           rows: 256
       filtered: 100.00
          Extra: Using filesort
  ```
* As dicas de índice `USE INDEX`, `FORCE INDEX` e `IGNORE INDEX` têm prioridade maior que as dicas de otimizador `INDEX_MERGE` e `NO_INDEX_MERGE`.

```
  /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ ... IGNORE INDEX i_a
  ```

`IGNORE INDEX` tem precedência sobre `INDEX_MERGE`, então o índice `i_a` é excluído dos possíveis intervalos para a Fusão de Índices.

```
  /*+ NO_INDEX_MERGE(t1 i_a, i_b) */ ... FORCE INDEX i_a, i_b
  ```

A Fusão de Índices é desativada para `i_a, i_b` devido ao `FORCE INDEX`, mas o otimizador é forçado a usar o índice `i_a` ou `i_b` para acessos `range` ou `ref`. Não há conflitos; ambas as dicas são aplicáveis.
* Se uma dica `IGNORE INDEX` nomear vários índices, esses índices ficam indisponíveis para a Fusão de Índices.
* As dicas `FORCE INDEX` e `USE INDEX` tornam disponíveis apenas os índices nomeados para a Fusão de Índices.

```
  SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ a FROM t1
  FORCE INDEX (i_a, i_b) WHERE c = 'h' AND a = 2 AND b = 'b';
  ```

O algoritmo de acesso de interseção da Fusão de Índices é usado para `(i_a, i_b)`. O mesmo vale se `FORCE INDEX` for alterado para `USE INDEX`.

#### Dicas de Otimizador de Subconsultas

As dicas de subconsulta afetam se usar transformações de junção parcial e quais estratégias de junção parcial permitir, e, quando junções não são usadas, se usar materialização de subconsulta ou transformações `IN` para `EXISTS`. Para mais informações sobre essas otimizações, consulte a Seção 10.2.2, “Otimizando Subconsultas, Tabelas Derivadas, Referências de Visual e Expressões de Tabela Comuns”.

Sintaxe das dicas que afetam estratégias de junção parcial:

```
hint_name([@query_block_name] [strategy [, strategy] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes de dica são permitidos:

  +  `SEMIJOIN`, `NO_SEMIJOIN`: Ative ou desative as estratégias de junção parcial nomeadas.
* *`strategy`*: Uma estratégia de junção parcial a ser ativada ou desativada. Esses nomes de estratégia são permitidos: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

Para dicas `SEMIJOIN`, se não houver estratégias nomeadas, o semijoin é usado, se possível, com base nas estratégias habilitadas de acordo com a variável de sistema `optimizer_switch`. Se as estratégias forem nomeadas, mas inapropriadas para a instrução, o `DUPSWEEDOUT` é usado.

Para dicas `NO_SEMIJOIN`, se não houver estratégias nomeadas, o semijoin não é usado. Se as estratégias forem nomeadas e excluírem todas as estratégias aplicáveis para a instrução, o `DUPSWEEDOUT` é usado.

Se uma subconsulta estiver aninhada em outra e ambas forem unidas em um semijoin de uma consulta externa, qualquer especificação de estratégias de semijoin para a subconsulta mais interna é ignorada. As dicas `SEMIJOIN` e `NO_SEMIJOIN` ainda podem ser usadas para habilitar ou desabilitar transformações de semijoin para tais subconsultas aninhadas.

Se o `DUPSWEEDOUT` for desabilitado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, o que pode ser evitado definindo `optimizer_prune_level=0`.

Exemplos:

```
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Sintaxe das dicas que afetam se usar materialização de subconsulta ou transformações `IN` para `EXISTS`:

```
SUBQUERY([@query_block_name] strategy)
```

O nome da dica é sempre `SUBQUERY`.

Para dicas `SUBQUERY`, esses valores de `strategy` são permitidos: `INTOEXISTS`, `MATERIALIZATION`.

Exemplos:

```
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

Para dicas de semijoin e `SUBQUERY`, um `@query_block_name` inicial especifica o bloco de consulta ao qual a dica se aplica. Se a dica não incluir um `@query_block_name` inicial, a dica se aplica ao bloco de consulta em que ocorre. Para atribuir um nome a um bloco de consulta, consulte Dicas do Otimizador para Nomear Blocos de Consulta.

Se um comentário de dica contém múltiplas dicas de subconsulta, a primeira é usada. Se houver outras dicas desse tipo, elas geram uma mensagem de aviso. Dicas de outros tipos são ignoradas silenciosamente.

#### Dicas de Tempo de Execução da Instrução
Português (Brasil):

O  assinado `MAX_EXECUTION_TIME` é permitido apenas para instruções `SELECT`. Ele estabelece um limite *`N`* (um valor de tempo de espera em milissegundos) para o tempo máximo que uma instrução pode ser executada antes que o servidor a termine:

```
MAX_EXECUTION_TIME(N)
```

Exemplo com um tempo de espera de 1 segundo (1000 milissegundos):

```
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

O  assinado `MAX_EXECUTION_TIME(N)` define um tempo de espera de execução de uma instrução de *`N`* milissegundos. Se essa opção estiver ausente ou se `N` for 0, o tempo de espera estabelecido pela variável de sistema `max_execution_time` será aplicado.

O  assinado `MAX_EXECUTION_TIME` é aplicável da seguinte forma:

* Para instruções com múltiplas palavras-chave `SELECT`, como uniões ou instruções com subconsultas, `MAX_EXECUTION_TIME` se aplica a toda a instrução e deve aparecer após a primeira `SELECT`.
* Se aplica a instruções `SELECT` somente de leitura. As instruções que não são somente de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.
* Não se aplica a instruções `SELECT` em programas armazenados e é ignorado.

#### Sintaxe de Assinatura de Definição de Variável

O  assinado `SET_VAR` define temporariamente o valor de sessão de uma variável de sistema (por toda a duração de uma única instrução). Exemplos:

```
SELECT /*+ SET_VAR(sort_buffer_size = 16M) */ name FROM people ORDER BY name;
INSERT /*+ SET_VAR(foreign_key_checks=OFF) */ INTO t2 VALUES(2);
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off') */ 1;
```

Sintaxe do  assinado `SET_VAR`:

```
SET_VAR(var_name = value)
```

* `var_name`* nomeia uma variável de sistema que tem um valor de sessão (embora nem todas as variáveis assim nomeadas possam ser nomeadas, conforme explicado mais adiante). * `value`* é o valor a ser atribuído à variável; o valor deve ser escalar.

 `SET_VAR` faz uma mudança temporária na variável, como demonstrado por essas instruções:

```
mysql> SELECT @@unique_checks;
+-----------------+
| @@unique_checks |
+-----------------+
|               1 |
+-----------------+
mysql> SELECT /*+ SET_VAR(unique_checks=OFF) */ @@unique_checks;
+-----------------+
| @@unique_checks |
+-----------------+
|               0 |
+-----------------+
mysql> SELECT @@unique_checks;
+-----------------+
| @@unique_checks |
+-----------------+
|               1 |
+-----------------+
```

Com  `SET_VAR`, não é necessário salvar e restaurar o valor da variável. Isso permite que você substitua várias instruções por uma única instrução. Considere esta sequência de instruções:

```
SET @saved_val = @@SESSION.var_name;
SET @@SESSION.var_name = value;
SELECT ...
SET @@SESSION.var_name = @saved_val;
```

A sequência pode ser substituída por esta única instrução:

```
SELECT /*+ SET_VAR(var_name = value) ...
```

Instruções `SET` independentes permitem qualquer uma dessas sintaxes para nomear variáveis de sessão:

```
SET SESSION var_name = value;
SET @@SESSION.var_name = value;
SET @@.var_name = value;
```

Como o assinho `SET_VAR` só se aplica a variáveis de sessão, o escopo de sessão é implícito, e `SESSION`, `@@SESSION.`, e `@@` não são necessários nem permitidos. Incluir a sintaxe explícita de indicação de sessão resulta no assinho `SET_VAR` ser ignorado com um aviso.

Nem todas as variáveis de sessão são permitidas para uso com `SET_VAR`. As descrições individuais das variáveis do sistema indicam se cada variável é hintable; veja  Seção 7.1.8, “Variáveis do Sistema do Servidor”. Você também pode verificar uma variável do sistema em tempo de execução tentando usá-la com `SET_VAR`. Se a variável não for hintable, ocorre um aviso:

```
mysql> SELECT /*+ SET_VAR(collation_server = 'utf8mb4') */ 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 4537
Message: Variable 'collation_server' cannot be set using SET_VAR hint.
```

A sintaxe `SET_VAR` permite definir apenas uma variável, mas vários assinhos podem ser dados para definir várias variáveis:

```
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off')
           SET_VAR(max_heap_table_size = 1G) */ 1;
```

Se vários assinhos com o mesmo nome de variável aparecerem na mesma declaração, o primeiro é aplicado e os outros são ignorados com um aviso:

```
SELECT /*+ SET_VAR(max_heap_table_size = 1G)
           SET_VAR(max_heap_table_size = 3G) */ 1;
```

Neste caso, o segundo aviso é ignorado com um aviso de conflito.

Um assinho `SET_VAR` é ignorado com um aviso se nenhuma variável do sistema tiver o nome especificado ou se o valor da variável estiver incorreto:

```
SELECT /*+ SET_VAR(max_size = 1G) */ 1;
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=yes') */ 1;
```

Para a primeira declaração, não há variável `max_size`. Para a segunda declaração, `mrr_cost_based` assume valores de `on` ou `off`, então tentar defini-lo como `yes` é incorreto. Em cada caso, o aviso é ignorado.

O assinho `SET_VAR` é permitido apenas no nível da declaração. Se usado em uma subconsulta, o aviso é ignorado.

As réplicas ignoram os assinhos `SET_VAR` em declarações replicadas para evitar potenciais problemas de segurança.

#### Sintaxe de Assinho de Grupo de Recursos

O assinho `RESOURCE_GROUP` (Grupo de Recursos) é usado para a gestão de grupos de recursos (veja Seção 7.1.16, “Grupos de Recursos”). Este aviso atribui o fio que executa uma declaração ao grupo de recursos nomeado temporariamente (pelo tempo da declaração). Requer o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

Exemplos:

```
SELECT /*+ RESOURCE_GROUP(USR_default) */ name FROM people ORDER BY name;
INSERT /*+ RESOURCE_GROUP(Batch) */ INTO t2 VALUES(2);
```

Sintaxe da dica `RESOURCE_GROUP`:

```
RESOURCE_GROUP(group_name)
```

* `group_name`* indica o grupo de recursos ao qual o thread deve ser atribuído durante a execução da instrução. Se o grupo não existir, uma mensagem de aviso é exibida e a dica é ignorada.

A dica `RESOURCE_GROUP` deve aparecer após a palavra-chave inicial da instrução (`SELECT`, `INSERT`, `REPLACE`, `UPDATE` ou `DELETE`).

Uma alternativa a `RESOURCE_GROUP` é a instrução `SET RESOURCE GROUP`, que atribui temporariamente threads a um grupo de recursos. Veja a Seção 15.7.2.4, “Instrução SET RESOURCE GROUP”.

#### Dicas de otimizador para nomes de blocos de consulta

Dicas de otimizador de nível de tabela, índice e subconsulta permitem que blocos de consulta específicos sejam nomeados como parte de sua sintaxe de argumento. Para criar esses nomes, use a dica `QB_NAME`, que atribui um nome ao bloco de consulta em que ocorre:

```
QB_NAME(name)
```

 As dicas `QB_NAME` podem ser usadas para indicar explicitamente de maneira clara quais blocos de consulta outras dicas se aplicam. Elas também permitem que todas as dicas de nomes de blocos de consulta não-consulta sejam especificadas dentro de um único comentário de dica para facilitar a compreensão de instruções complexas. Considere a seguinte instrução:

```
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```

 As dicas `QB_NAME` atribuem nomes aos blocos de consulta na instrução:

```
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

 Então, outras dicas podem usar esses nomes para referenciar os blocos de consulta apropriados:

```
SELECT /*+ QB_NAME(qb1) MRR(@qb1 t1) BKA(@qb2) NO_MRR(@qb3t1 idx1, id2) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

 O efeito resultante é o seguinte:

* `MRR(@qb1 t1)` se aplica à tabela `t1` no bloco de consulta `qb1`.
* `BKA(@qb2)` se aplica ao bloco de consulta `qb2`.
* `NO_MRR(@qb3 t1 idx1, id2)` se aplica aos índices `idx1` e `idx2` na tabela `t1` no bloco de consulta `qb3`.

 Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como devem ser citados (veja a Seção 11.2, “Nomes de objetos do esquema”). Por exemplo, um nome de bloco de consulta que contém espaços deve ser citado, o que pode ser feito usando aspas:

```
SELECT /*+ BKA(@`my hint name`) */ ...
  FROM (SELECT /*+ QB_NAME(`my hint name`) */ ...) ...
```

 Se o modo SQL `ANSI_QUOTES` estiver habilitado, também é possível citar nomes de blocos de consulta entre aspas duplas:

```
SELECT /*+ BKA(@"my hint name") */ ...
  FROM (SELECT /*+ QB_NAME("my hint name") */ ...) ...
```