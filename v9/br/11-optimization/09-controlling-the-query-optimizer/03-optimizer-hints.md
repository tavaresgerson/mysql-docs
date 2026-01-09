### 10.9.3 Dicas de otimização

Uma maneira de controlar as estratégias de otimização é definir a variável de sistema `optimizer_switch` (veja a Seção 10.9.2, “Otimizações comutadas”). Alterações nesta variável afetam a execução de todas as consultas subsequentes; para alterar uma consulta de maneira diferente de outra, é necessário alterar `optimizer_switch` antes de cada uma.

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

As dicas de otimização, descritas aqui, diferem das dicas de índice, descritas na Seção 10.9.4, “Dicas de índice”. Dicas de otimizador e de índice podem ser usadas separadamente ou juntas.

* Visão geral das dicas de otimização
* Sintaxe das dicas de otimização
* Dicas de ordem de junção
* Dicas de otimização de nível de tabela
* Dicas de otimização de nível de índice
* Dicas de otimização de subconsultas
* Dicas de otimização do tempo de execução da instrução
* Sintaxe de dicas de definição de variáveis
* Sintaxe de dicas de grupo de recursos
* Dicas de otimização para o nome dos blocos de consulta

#### Visão geral das dicas de otimização

As dicas de otimização são aplicadas em diferentes níveis de escopo:

* Global: A dica afeta toda a instrução
* Bloco de consulta: A dica afeta um bloco de consulta específico dentro de uma instrução
* Nível de tabela: A dica afeta uma tabela específica dentro de um bloco de consulta
* Nível de índice: A dica afeta um índice específico dentro de uma tabela

A tabela a seguir resume as dicas de otimização disponíveis, as estratégias de otimização que elas afetam e o escopo ou escopos nos quais elas se aplicam. Mais detalhes serão fornecidos mais adiante.

**Tabela 10.2 Dicas de Otimização Disponíveis**

<table summary="Nomes, descrições e contextos em que os hints do otimizador são aplicados.">
<tr>
<th>Nome do Hint</th>
<th>Descrição</th>
<th>Áreas de Aplicação</th>
</tr>
<tr>
<th>BKA</th>
<td>Afeta o processamento de junções em lote</td>
<td>Bloco de consulta, tabela</td>
</tr>
<tr>
<th>BNL</th>
<td>Afeta a otimização da junção hash</td>
<td>Bloco de consulta, tabela</td>
</tr>
<tr>
<th>DERIVED_CONDITION_PUSHDOWN</th>
<td>Usa ou ignora a otimização de empurrão de condição derivada para tabelas derivadas materializadas</td>
<td>Bloco de consulta, tabela</td>
</tr>
<tr>
<th>GROUP_INDEX</th>
<td>Usa ou ignora o índice especificado ou índices para varreduras em operações <code>GROUP BY</code></td>
<td>Índice</td>
</tr>
<tr>
<th>HASH_JOIN</th>
<td>Afeta a otimização da junção hash (sem efeito no MySQL 9.5)</td>
<td>Bloco de consulta, tabela</td>
</tr>
<tr>
<th>INDEX</th>
<td>Atua como combinação de <code>JOIN_INDEX</code>, <code>GROUP_INDEX</code> e <code>ORDER_INDEX</code>, ou como combinação de <code>NO_JOIN_INDEX</code>, <code>NO_GROUP_INDEX</code> e <code>NO_ORDER_INDEX</code></td>
<td>Índice</td>
</tr>
<tr>
<th>INDEX_MERGE</th>
<td>Afeta a otimização de junção de tabelas</td>
<td>Tabela, índice</td>
</tr>
<tr>
<th>JOIN_FIXED_ORDER</th>
<td>Usa a ordem de tabela especificada na cláusula <code>FROM</code> para a ordem de junção</td>
<td>Bloco de consulta</td>
</tr>
<tr>
<th>JOIN_INDEX</th>
<td>Usa ou ignora o índice ou índices especificados para qualquer método de acesso</td>
<td>Índice</td>
</tr>
<tr>
<th>JOIN_ORDER</th>
<td>Usa a ordem de tabela especificada no hint para a ordem de junção</td>
<td>Bloco de consulta</td>
</tr>
<tr>
<th>JOIN_PREFIX</th>
<td>Usa a ordem de tabela especificada no hint para a primeira tabela da ordem de junção</td>
<td>Bloco de consulta</td>
</tr>
<tr>
<th>JOIN_SUFFIX</th>
<td>Usa a ordem de tabela especificada no hint para a última tabela da ordem de junção</td>
<td>Bloco de consulta</td>
</tr>
<tr>
<th>MAX_EXECUTION_TIME</th>
<td>Limita o tempo de execução da declaração</td>
<td>Global</td>
</tr>
<tr>
<th>MERGE</th>
<td>Afeta a junção derivada de tabela/visual para o bloco de consulta externo</td>
<td>Tabela</td>
</tr>
<tr>
<th>MRR</th>
<td>Afeta a otimização de leitura multi-intervalo</td>
<td>Tabela, índice</td>
</tr>
<tr>
<th>NO_ICP</th>
<td>Afeta a otimização de empurrão de condição indexada</td>
<td>Tabela, índice</td>
</tr>
<tr>
<th>NO_RANGE_OPTIMIZATION</th>
<td>Afeta a otimização de intervalo</td>
<td>Tabela, índice</td>
</tr>
<tr>
<th>ORDER_INDEX</th>
<td>Usa ou ignora o índice ou índices especificados para a ordenação de linhas</td>
<td>Índice</td>
</tr>
<tr>
<th>RESOURCE_GROUP</th>
<td>Define o grupo de recursos durante a execução da declaração</td>
<td>Global</td>
</tr>
<tr>
<th>SEMIJOIN</th>
<td>Afeta as estratégias de junção semijoin e antijoin</td>
<td>Bloco de consulta</td>
</tr>
<tr>
<th>SKIP_SCAN</th>
<td>Afeta a varredura por omissão</td>
<td>Tabela, índice</td>
</tr>
<tr>

Desativar uma otimização impede que o otimizador a use. Ativá-la significa que o otimizador pode usar a estratégia se ela se aplicar à execução da instrução, não que o otimizador necessariamente a use.

#### Sintaxe de Dicas do Otimizador

O MySQL suporta comentários em instruções SQL, conforme descrito na Seção 11.7, “Comentários”. As dicas do otimizador devem ser especificadas dentro dos comentários `/*+ ... */`. Ou seja, as dicas do otimizador usam uma variante da sintaxe de comentário em estilo C `/* ... */`, com um caractere `+` após a sequência de abertura do comentário `/*`. Exemplos:

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

  A implicação é que você pode usar `EXPLAIN` para ver como as dicas do otimizador afetam os planos de execução. Use `SHOW WARNINGS` imediatamente após `EXPLAIN` para ver como as dicas são usadas. A saída do `EXPLAIN` estendido exibida por um `SHOW WARNINGS` subsequente indica quais dicas foram usadas. Dicas ignoradas não são exibidas.

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

Os nomes das dicas, dos blocos de consulta e dos nomes das estratégias não são sensíveis ao caso. As referências a nomes de tabelas e índices seguem as regras habituais de sensibilidade ao caso dos identificadores (consulte a Seção 11.2.3, “Sensibilidade ao Caso dos Identificadores”).

#### Dicas do Otimizador de Ordem de Conclusão

As dicas de ordem de conclusão afetam a ordem em que o otimizador junta as tabelas.

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

  + `JOIN_FIXED_ORDER`: Forçar o otimizador a juntar as tabelas usando a ordem em que elas aparecem na cláusula `FROM`. Isso é o mesmo que especificar `SELECT STRAIGHT_JOIN`.

  + `JOIN_ORDER`: Instruir o otimizador a juntar as tabelas usando a ordem de tabela especificada. A dica aplica-se às tabelas nomeadas. O otimizador pode colocar tabelas que não estão nomeadas em qualquer lugar na ordem de conclusão do plano de execução da junção, incluindo entre tabelas especificadas.

  + `JOIN_PREFIX`: Instruir o otimizador a juntar as tabelas usando a ordem de tabela especificada para as primeiras tabelas do plano de execução da junção. A dica aplica-se às tabelas nomeadas. O otimizador coloca todas as outras tabelas após as tabelas nomeadas.

+ `JOIN_SUFFIX`: Instrua o otimizador a unir tabelas usando a ordem de tabela especificada para as últimas tabelas do plano de execução da união. O indicativo se aplica às tabelas nomeadas. O otimizador coloca todas as outras tabelas antes das tabelas nomeadas.

* *`tbl_name`*: O nome de uma tabela usada na declaração. Um indicativo que nomeia tabelas se aplica a todas as tabelas que ele nomeia. O indicativo `JOIN_FIXED_ORDER` não nomeia tabelas e se aplica a todas as tabelas na cláusula `FROM` do bloco de consulta no qual ele ocorre.

  Se uma tabela tiver um alias, os indicativos devem se referir ao alias, não ao nome da tabela.

  Os nomes das tabelas nos indicativos não podem ser qualificados com nomes de esquema.

* *`query_block_name`*: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o nome do bloco de consulta `@query_block_name`, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Indicativos de Otimizador para Nomeação de Blocos de Consulta.

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

Os indicativos controlam o comportamento das tabelas de junção que são unidas ao bloco de consulta externo. Se as subconsultas `subq1` e `subq2` forem convertidas em junções semijoin, as tabelas `t4@subq1` e `t5@subq2` são unidas ao bloco de consulta externo. Neste caso, o indicativo especificado no bloco de consulta externo controla o comportamento das tabelas `t4@subq1`, `t5@subq2`.

O otimizador resolve os indicativos de ordem de junção de acordo com esses princípios:

* Múltiplos instâncias de indicativo

  Apenas um `JOIN_PREFIX` e `JOIN_SUFFIX` de cada tipo são aplicados. Quaisquer indicativos posteriores do mesmo tipo são ignorados com um aviso. `JOIN_ORDER` pode ser especificado várias vezes.

  Exemplos:

  ```
  /*+ JOIN_PREFIX(t1) JOIN_PREFIX(t2) */
  ```

  O segundo indicativo `JOIN_PREFIX` é ignorado com um aviso.

  ```
  /*+ JOIN_PREFIX(t1) JOIN_SUFFIX(t2) */
  ```

  Ambos os indicativos são aplicáveis. Não ocorre aviso.

```
  /*+ JOIN_ORDER(t1, t2) JOIN_ORDER(t2, t3) */
  ```

Ambos os dicas são aplicáveis. Não há aviso.

* Dicas conflitantes

Em alguns casos, as dicas podem conflitar, como quando `JOIN_ORDER` e `JOIN_PREFIX` têm ordens de tabela que são impossíveis de aplicar ao mesmo tempo:

```
  SELECT /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */ ... FROM t1, t2;
  ```

Neste caso, a primeira dica especificada é aplicada e as dicas conflitantes subsequentes são ignoradas sem aviso. Uma dica válida que é impossível de aplicar é ignorada silenciosamente sem aviso.

* Dicas ignoradas

Uma dica é ignorada se uma tabela especificada na dica tiver uma dependência circular.

Exemplo:

```
  /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */
  ```

A dica `JOIN_ORDER` define a tabela `t2` como dependente de `t1`. A dica `JOIN_PREFIX` é ignorada porque a tabela `t1` não pode ser dependente de `t2`. Dicas ignoradas não são exibidas na saída ampliada do `EXPLAIN`.

* Interação com tabelas `const`

O otimizador MySQL coloca as tabelas `const` primeiro na ordem de junção, e a posição de uma tabela `const` não pode ser afetada por dicas. Referências a tabelas `const` nas dicas de ordem de junção são ignoradas, embora a dica ainda seja aplicável. Por exemplo, estas são equivalentes:

```
  JOIN_ORDER(t1, const_tbl, t2)
  JOIN_ORDER(t1, t2)
  ```

Dicas aceitas mostradas na saída ampliada do `EXPLAIN` incluem tabelas `const` conforme especificadas.

* Interação com tipos de operações de junção

O MySQL suporta vários tipos de junções: `LEFT`, `RIGHT`, `INNER`, `CROSS`, `STRAIGHT_JOIN`. Uma dica que conflita com o tipo de junção especificado é ignorada sem aviso.

Exemplo:

```
  SELECT /*+ JOIN_PREFIX(t1, t2) */FROM t2 LEFT JOIN t1;
  ```

Aqui ocorre um conflito entre a ordem de junção solicitada na dica e a ordem exigida pelo `LEFT JOIN`. A dica é ignorada sem aviso.

#### Dicas de otimizador de nível de tabela

Dicas de nível de tabela afetam:

* Uso dos algoritmos de processamento de junções de Loop Aninhado em Bloco (BNL) e Acesso a Chave em Massa (BKA) (consulte a Seção 10.2.1.12, “Junções de Loop Aninhado em Bloco e Acesso a Chave em Massa”).

* As tabelas derivadas, referências de visualizações ou expressões de tabela comuns devem ser unidas ao bloco da consulta externa ou materializadas usando uma tabela temporária interna.

* Uso da otimização de empurrão de condição de tabela derivada. Consulte a Seção 10.2.2.5, “Otimização de Empurrão de Condição de Tabela Derivada”.

Esses tipos de dicas se aplicam a tabelas específicas ou a todas as tabelas em um bloco de consulta.

Sintaxe de dicas de nível de tabela:

```
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes de dicas são permitidos:

  + `BKA`, `NO_BKA`: Ative ou desative o acesso a chave em massa para as tabelas especificadas.

  + `BNL`, `NO_BNL`: Ative e desative a otimização de junção hash.

  + `DERIVED_CONDITION_PUSHDOWN`, `NO_DERIVED_CONDITION_PUSHDOWN`: Ative ou desative o uso de empurrão de condição de tabela derivada para as tabelas especificadas. Para mais informações, consulte a Seção 10.2.2.5, “Otimização de Empurrão de Condição de Tabela Derivada”.

  + `HASH_JOIN`, `NO_HASH_JOIN`: Essas dicas não têm efeito no MySQL 9.5; use `BNL` ou `NO_BNL` em vez disso.

  + `MERGE`, `NO_MERGE`: Ative a junção para as tabelas especificadas, referências de visualizações ou expressões de tabela comuns; ou desative a junção e use materialização.

  Nota

  Para usar uma dica de loop aninhado em bloco ou acesso a chave em massa para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve estar habilitado para todas as tabelas internas da junção externa.
* *`tbl_name`*: O nome de uma tabela usada na declaração. A dica se aplica a todas as tabelas que ela nomeia. Se a dica não nomear tabelas, ela se aplica a todas as tabelas do bloco de consulta em que ocorre.

Se uma tabela tiver um alias, as dicas devem se referir ao alias, e não ao nome da tabela.

Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.

* `query_block_name`*: O bloco de consulta ao qual a dica se aplica. Se a dica não incluir o prefixo `@query_block_name`, a dica se aplica ao bloco de consulta em que ocorre. Para a sintaxe `tbl_name@query_block_name`, a dica se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomeação de blocos de consulta.

Exemplos:

```
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_MERGE(dt) */ * FROM (SELECT * FROM t1) AS dt;
```

Uma dica de nível de tabela se aplica a tabelas que recebem registros de tabelas anteriores, e não às tabelas de emissor. Considere esta declaração:

```
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

Se o otimizador optar por processar `t1` primeiro, ele aplica uma junção Nested-Loop de blocos para `t2`, armazenando as linhas de `t1` antes de começar a ler de `t2`. Se o otimizador, em vez disso, optar por processar `t2` primeiro, a dica não tem efeito porque `t2` é uma tabela de emissor.

Para as dicas `MERGE` e `NO_MERGE`, essas regras de precedência se aplicam:

* Uma dica tem precedência sobre qualquer heurística do otimizador que não seja uma restrição técnica. (Se fornecer uma dica como sugestão não tiver efeito, o otimizador tem um motivo para ignorá-la.)

* Uma dica tem precedência sobre o sinalizador `derived_merge` da variável de sistema `optimizer_switch`.

* Para referências de visualizações, uma cláusula `ALGORITHM={MERGE|TEMPTABLE}` na definição da visualização tem precedência sobre uma dica especificada na consulta que faz referência à visualização.

#### Dicas de otimizador de nível de índice

Dicas de nível de índice afetam quais estratégias de processamento de índices o otimizador usa para tabelas ou índices particulares. Esses tipos de dicas afetam o uso de Pushdown de Condição de Índice (ICP), Leitura de Múltiplos Intervalos (MRR), Fusão de Índice e otimizações de intervalo (consulte Seção 10.2.1, “Otimizando Instruções SELECT”).

Sintaxe de dicas de nível de índice:

```
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

A sintaxe refere-se a esses termos:

* `hint_name`: Esses nomes de dicas são permitidos:

  + `GROUP_INDEX`, `NO_GROUP_INDEX`: Ative ou desative o(s) índice(s) especificado(s) para varreduras de índice para operações `GROUP BY`. Equivalente às dicas de índice `FORCE INDEX FOR GROUP BY`, `IGNORE INDEX FOR GROUP BY`.

  + `INDEX`, `NO_INDEX`: Atua como a combinação de `JOIN_INDEX`, `GROUP_INDEX` e `ORDER_INDEX`, forçando o servidor a usar o(s) índice(s) especificado(s) para todos os escopos, ou como a combinação de `NO_JOIN_INDEX`, `NO_GROUP_INDEX` e `NO_ORDER_INDEX`, que faz o servidor ignorar o(s) índice(s) especificado(s) para todos os escopos. Equivalente a `FORCE INDEX`, `IGNORE INDEX`.

  + `INDEX_MERGE`, `NO_INDEX_MERGE`: Ative ou desative o método de acesso de Merge de Índice para a tabela ou índices especificados. Para informações sobre este método de acesso, consulte a Seção 10.2.1.3, “Otimização de Merge de Índice”. Essas dicas se aplicam a todos os três algoritmos de Merge de Índice.

    A dica `INDEX_MERGE` força o otimizador a usar o Merge de Índice para a tabela especificada usando o conjunto especificado de índices. Se nenhum índice for especificado, o otimizador considera todas as combinações de índice possíveis e seleciona a menos dispendiosa. A dica pode ser ignorada se a combinação de índice não for aplicável à declaração dada.

    A dica `NO_INDEX_MERGE` desativa combinações de Merge de Índice que envolvem qualquer um dos índices especificados. Se a dica especificar nenhum índice, o Merge de Índice não é permitido para a tabela.

  + `JOIN_INDEX`, `NO_JOIN_INDEX`: Força o MySQL a usar ou ignorar o(s) índice(s) especificado(s) para qualquer método de acesso, como `ref`, `range`, `index_merge`, e assim por diante. Equivalente a `FORCE INDEX FOR JOIN`, `IGNORE INDEX FOR JOIN`.

+ `MRR`, `NO_MRR`: Ative ou desative o MRR para a tabela ou índices especificados. As dicas de MRR aplicam-se apenas às tabelas `InnoDB` e `MyISAM`. Para obter informações sobre esse método de acesso, consulte a Seção 10.2.1.11, “Otimização de Leitura de Múltiplos Intervalos”.

  + `NO_ICP`: Desative o ICP para a tabela ou índices especificados. Por padrão, o ICP é uma estratégia de otimização candidata, então não há dica para ativá-lo. Para obter informações sobre esse método de acesso, consulte a Seção 10.2.1.6, “Otimização de Puxada de Condição de Índice”.

  + `NO_RANGE_OPTIMIZATION`: Desative o acesso por intervalo de índice para a tabela ou índices especificados. Essa dica também desativa a Fusão de Índices e a Busca de Índice Solto para a tabela ou índices. Por padrão, o acesso por intervalo é uma estratégia de otimização candidata, então não há dica para ativá-lo.

    Essa dica pode ser útil quando o número de intervalos pode ser alto e a otimização por intervalo exigiria muitos recursos.

  + `ORDER_INDEX`, `NO_ORDER_INDEX`: Faça com que o MySQL use ou ignore o índice ou índices especificados para a ordenação de linhas. Equivalente a `FORCE INDEX FOR ORDER BY`, `IGNORE INDEX FOR ORDER BY`.

  + `SKIP_SCAN`, `NO_SKIP_SCAN`: Ative ou desative o método de acesso de varredura de salto para a tabela ou índices especificados. Para obter informações sobre esse método de acesso, consulte o Método de Acesso de Varredura de Salto.

    A dica `SKIP_SCAN` força o otimizador a usar a varredura de salto para a tabela especificada usando o conjunto especificado de índices. Se nenhum índice for especificado, o otimizador considera todos os índices possíveis e seleciona o menos dispendioso. A dica pode ser ignorada se o índice não for aplicável à declaração dada.

    A dica `NO_SKIP_SCAN` desativa a varredura de salto para os índices especificados. Se a dica especificar nenhum índice, a varredura de salto não é permitida para a tabela.

* `tbl_name`*: A tabela à qual a dica se aplica.

* `nome_índice`: O nome de um índice na tabela nomeada. O hint aplica-se a todos os índices que ele nomeia. Se o hint não nomear nenhum índice, ele aplica-se a todos os índices na tabela.

Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use `SHOW INDEX`.

* `nome_bloco_consulta`: O bloco de consulta ao qual o hint se aplica. Se o hint não incluir nenhum `@nome_bloco_consulta` no início, o hint se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@nome_bloco_consulta`, o hint se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões de otimizador para nomear blocos de consulta.

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

Os seguintes exemplos usam as sugestões de junção de índices, mas outras sugestões de nível de índice seguem os mesmos princípios em relação à ignorância do hint e à precedência das sugestões de otimizador em relação à variável de sistema `optimizer_switch` ou sugestões de índice.

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

`NO_INDEX_MERGE` é ignorado porque há um hint anterior para a mesma tabela.

```
/*+ NO_INDEX_MERGE(t1 i_a, i_b) INDEX_MERGE(t1 i_b) */
```

`INDEX_MERGE` é ignorado porque há um hint anterior para a mesma tabela.

Para as sugestões de otimizador `INDEX_MERGE` e `NO_INDEX_MERGE`, essas regras de precedência se aplicam:

* Se uma sugestão de otimizador for especificada e aplicável, ela tem precedência sobre os flags relacionados à junção de índices da variável de sistema `optimizer_switch`.

  ```
  SET optimizer_switch='index_merge_intersection=off';
  SELECT /*+ INDEX_MERGE(t1 i_b, i_c) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

  O hint tem precedência sobre `optimizer_switch`. A junção de índices é usada para `(i_b, i_c)` neste caso.

  ```
  SET optimizer_switch='index_merge_intersection=on';
  SELECT /*+ INDEX_MERGE(t1 i_b) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

O aviso especifica apenas um índice, portanto, é inaplicável, e a bandeira `optimizer_switch` (`off`) é aplicada. A junção de índices não é usada.

* Os avisos de otimização de nível de índice `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` têm precedência sobre os avisos equivalentes `FORCE INDEX`; ou seja, eles fazem com que os avisos `FORCE INDEX` sejam ignorados. Da mesma forma, os avisos `NO_GROUP_INDEX`, `NO_INDEX`, `NO_JOIN_INDEX` e `NO_ORDER_INDEX` têm precedência sobre quaisquer equivalentes `IGNORE INDEX`, também fazendo com que eles sejam ignorados.

  Os avisos de otimização de nível de índice `GROUP_INDEX`, `NO_GROUP_INDEX`, `INDEX`, `NO_INDEX`, `JOIN_INDEX`, `NO_JOIN_INDEX`, `ORDER_INDEX` e `NO_ORDER_INDEX` têm precedência sobre todos os outros avisos de otimização, incluindo outros avisos de otimização de nível de índice. Todos os outros avisos de otimização são aplicados apenas aos índices permitidos por esses.

  Os avisos `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` são equivalentes a `FORCE INDEX` e não a `USE INDEX`. Isso ocorre porque o uso de um ou mais desses avisos significa que uma varredura da tabela é usada apenas se não houver maneira de usar um dos índices nomeados para encontrar linhas na tabela. Para fazer com que o MySQL use o mesmo índice ou conjunto de índices que com uma instância específica de `USE INDEX`, você pode usar `NO_INDEX`, `NO_JOIN_INDEX`, `NO_GROUP_INDEX`, `NO_ORDER_INDEX` ou alguma combinação desses.

  Para replicar o efeito que `USE INDEX` tem na consulta `SELECT a,c FROM t1 USE INDEX FOR ORDER BY (i_a) ORDER BY a`, você pode usar o aviso de otimização `NO_ORDER_INDEX` para cobrir todos os índices da tabela, exceto o desejado, da seguinte forma:

Tentando combinar `NO_ORDER_INDEX` para a tabela como um todo com `USE INDEX FOR ORDER BY` não funciona para isso, porque `NO_ORDER_BY` faz com que `USE INDEX` seja ignorado, como mostrado aqui:

```
  SET optimizer_switch='index_merge_intersection=off';
  SELECT /*+ INDEX_MERGE(t1 i_b) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

* As dicas de índice `USE INDEX`, `FORCE INDEX` e `IGNORE INDEX` têm prioridade maior que as dicas de otimizador `INDEX_MERGE` e `NO_INDEX_MERGE`.

```
  SELECT /*+ NO_ORDER_INDEX(t1 i_b,i_c) */ a,c
      FROM t1
      ORDER BY a;
  ```

`IGNORE INDEX` tem precedência sobre `INDEX_MERGE`, então o índice `i_a` é excluído dos possíveis intervalos para a Fusão de Índices.

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

A Fusão de Índices é desativada para `i_a, i_b` devido ao `FORCE INDEX`, mas o otimizador é forçado a usar `i_a` ou `i_b` para acessos `range` ou `ref`. Não há conflitos; ambas as dicas são aplicáveis.

* Se uma dica `IGNORE INDEX` nomear vários índices, esses índices ficam indisponíveis para a Fusão de Índices.

* As dicas `FORCE INDEX` e `USE INDEX` tornam apenas os índices nomeados disponíveis para a Fusão de Índices.

```
  /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ ... IGNORE INDEX i_a
  ```

O algoritmo de acesso de interseção da Fusão de Índices é usado para `(i_a, i_b)`. O mesmo vale se `FORCE INDEX` for alterado para `USE INDEX`.

#### Dicas de Otimizador de Subconsultas

As dicas de subconsulta afetam se usar transformações de semijoin e quais estratégias de semijoin permitir, e, quando semijoins não são usados, se usar materialização de subconsulta ou transformações `IN` para `EXISTS`. Para mais informações sobre essas otimizações, consulte a Seção 10.2.2, “Otimizando Subconsultas, Tabelas Derivadas, Referências de Visual e Expressões de Tabela Comuns”.

Sintaxe das dicas que afetam estratégias de semijoin:

```
  /*+ NO_INDEX_MERGE(t1 i_a, i_b) */ ... FORCE INDEX i_a, i_b
  ```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes de dica são permitidos:

  + `SEMIJOIN`, `NO_SEMIJOIN`: Ative ou desative as estratégias de semijoin nomeadas.

* `strategy`*: Uma estratégia de semijoin para ser habilitada ou desabilitada. Esses nomes de estratégia são permitidos: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

  Para dicas `SEMIJOIN`, se nenhuma estratégia for nomeada, o semijoin é usado se possível com base nas estratégias habilitadas de acordo com a variável de sistema `optimizer_switch`. Se as estratégias forem nomeadas, mas inapropriadas para a declaração, `DUPSWEEDOUT` é usado.

  Para dicas `NO_SEMIJOIN`, se nenhuma estratégia for nomeada, o semijoin não é usado. Se as estratégias forem nomeadas e excluírem todas as estratégias aplicáveis para a declaração, `DUPSWEEDOUT` é usado.

Se uma subconsulta estiver aninhada em outra e ambas forem unidas em um semijoin de uma consulta externa, qualquer especificação de estratégias de semijoin para a subconsulta mais interna é ignorada. As dicas `SEMIJOIN` e `NO_SEMIJOIN` ainda podem ser usadas para habilitar ou desabilitar transformações de semijoin para tais subconsultas aninhadas.

Se `DUPSWEEDOUT` for desabilitado, ocasionalmente o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, o que pode ser evitado configurando `optimizer_prune_level=0`.

Exemplos:

```
  SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ a FROM t1
  FORCE INDEX (i_a, i_b) WHERE c = 'h' AND a = 2 AND b = 'b';
  ```

Sintaxe de dicas que afetam se usar materialização de subconsulta ou transformações `IN` para `EXISTS`:

```
hint_name([@query_block_name] [strategy [, strategy] ...])
```

O nome da dica é sempre `SUBQUERY`.

Para dicas `SUBQUERY`, esses valores de `strategy` são permitidos: `INTOEXISTS`, `MATERIALIZATION`.

Exemplos:

```
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Para dicas de semijoin e `SUBQUERY`, um `@query_block_name` inicial especifica o bloco de consulta ao qual a dica se aplica. Se a dica não incluir um `@query_block_name` inicial, a dica se aplica ao bloco de consulta em que ocorre. Para atribuir um nome a um bloco de consulta, consulte Dicas do Otimizador para Nomear Blocos de Consulta.

Se um comentário de dica de execução de declaração contém várias dicas de subconsultas, a primeira é usada. Se houver outras dicas desse tipo, elas geram uma mensagem de aviso. Dicas de outros tipos são ignoradas silenciosamente.

#### Dicas de Otimização do Tempo de Execução da Declaração

A dica `MAX_EXECUTION_TIME` é permitida apenas para declarações `SELECT`. Ela coloca um limite *`N`* (um valor de tempo de espera em milissegundos) sobre o tempo máximo que uma declaração pode ser executada antes que o servidor a termine:

```
SUBQUERY([@query_block_name] strategy)
```

Exemplo com um tempo de espera de 1 segundo (1000 milissegundos):

```
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

A dica `MAX_EXECUTION_TIME(N)` define um tempo de espera de execução da declaração de *`N`* milissegundos. Se essa opção estiver ausente ou se `N` for 0, o tempo de espera estabelecido pela variável de sistema `max_execution_time` se aplica.

A dica `MAX_EXECUTION_TIME` é aplicável da seguinte forma:

* Para declarações com várias palavras-chave `SELECT`, como uniões ou declarações com subconsultas, `MAX_EXECUTION_TIME` se aplica à declaração inteira e deve aparecer após a primeira `SELECT`.

* Se aplica a declarações `SELECT` somente de leitura. As declarações que não são somente de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

* Não se aplica a declarações `SELECT` em programas armazenados e é ignorada.

#### Sintaxe de Dicas de Definição de Variáveis

A dica `SET_VAR` define o valor de sessão de uma variável de sistema temporariamente (por toda a duração de uma única declaração). Exemplos:

```
MAX_EXECUTION_TIME(N)
```

Sintaxe da dica `SET_VAR`:

```
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

* `var_name`* nomeia uma variável de sistema que tem um valor de sessão (embora nem todas as tais variáveis possam ser nomeadas, conforme explicado mais adiante). `value` é o valor a ser atribuído à variável; o valor deve ser escalar.

`SET_VAR` faz uma mudança temporária na variável, como demonstrado por essas declarações:

```
SELECT /*+ SET_VAR(sort_buffer_size = 16M) */ name FROM people ORDER BY name;
INSERT /*+ SET_VAR(foreign_key_checks=OFF) */ INTO t2 VALUES(2);
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off') */ 1;
```

Com `SET_VAR`, não é necessário salvar e restaurar o valor da variável. Isso permite que você substitua várias instruções por uma única instrução. Considere esta sequência de instruções:

```
SET_VAR(var_name = value)
```

A sequência pode ser substituída por esta única instrução:

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

As instruções `SET` independentes permitem qualquer uma dessas sintaxes para nomear variáveis de sessão:

```
SET @saved_val = @@SESSION.var_name;
SET @@SESSION.var_name = value;
SELECT ...
SET @@SESSION.var_name = @saved_val;
```

Como o aviso `SET_VAR` se aplica apenas a variáveis de sessão, o escopo de sessão é implícito, e `SESSION`, `@@SESSION.`, e `@@` não são necessários nem permitidos. Incluir a sintaxe explícita de indicação de sessão resulta no aviso `SET_VAR` sendo ignorado.

Nem todas as variáveis de sessão são permitidas para uso com `SET_VAR`. As descrições individuais das variáveis do sistema indicam se cada variável é hintable; veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”. Você também pode verificar uma variável do sistema em tempo de execução tentando usá-la com `SET_VAR`. Se a variável não for hintable, ocorre um aviso:

```
SELECT /*+ SET_VAR(var_name = value) ...
```

A sintaxe `SET_VAR` permite definir apenas uma variável, mas várias dicas podem ser dadas para definir várias variáveis:

```
SET SESSION var_name = value;
SET @@SESSION.var_name = value;
SET @@.var_name = value;
```

Se várias dicas com o mesmo nome de variável aparecerem na mesma instrução, a primeira é aplicada e as outras são ignoradas com um aviso:

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

Neste caso, a segunda dica é ignorada com um aviso de que está em conflito.

Um aviso `SET_VAR` é ignorado se nenhuma variável do sistema tiver o nome especificado ou se o valor da variável estiver incorreto:

```
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off')
           SET_VAR(max_heap_table_size = 1G) */ 1;
```

Para a primeira instrução, não há variável `max_size`. Para a segunda instrução, `mrr_cost_based` assume valores de `on` ou `off`, então tentar defini-lo para `yes` é incorreto. Em cada caso, a dica é ignorada com um aviso.

O indicativo `SET_VAR` é permitido apenas no nível da instrução. Se usado em uma subconsulta, o indicativo é ignorado com um aviso.

As réplicas ignoram os indicativos `SET_VAR` em instruções replicadas para evitar potenciais problemas de segurança.

#### Sintaxe do Indicação de Grupo de Recursos

O indicativo de otimizador `RESOURCE_GROUP` é usado para a gestão de grupos de recursos (consulte a Seção 7.1.16, “Grupos de Recursos”). Este indicativo atribui o fio que executa uma instrução ao grupo de recursos nomeado temporariamente (durante a duração da instrução). Requer o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

Exemplos:

```
SELECT /*+ SET_VAR(max_heap_table_size = 1G)
           SET_VAR(max_heap_table_size = 3G) */ 1;
```

Sintaxe do indicativo `RESOURCE_GROUP`:

```
SELECT /*+ SET_VAR(max_size = 1G) */ 1;
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=yes') */ 1;
```

*`group_name`* indica o grupo de recursos ao qual o fio deve ser atribuído durante a execução da instrução. Se o grupo não existir, ocorre um aviso e o indicativo é ignorado.

O indicativo `RESOURCE_GROUP` deve aparecer após a palavra-chave inicial da instrução (`SELECT`, `INSERT`, `REPLACE`, `UPDATE` ou `DELETE`).

Uma alternativa ao `RESOURCE_GROUP` é a instrução `SET RESOURCE GROUP`, que atribui temporariamente os fios a um grupo de recursos. Consulte a Seção 15.7.2.4, “Instrução SET RESOURCE GROUP”.

#### Indicação de Otimizador para Blocos de Consulta de Nomes

Os indicativos de otimizador de nível de tabela, índice e subconsulta permitem que blocos de consulta específicos sejam nomeados como parte de sua sintaxe de argumento. Para criar esses nomes, use o indicativo `QB_NAME`, que atribui um nome ao bloco de consulta em que ocorre:

```
SELECT /*+ RESOURCE_GROUP(USR_default) */ name FROM people ORDER BY name;
INSERT /*+ RESOURCE_GROUP(Batch) */ INTO t2 VALUES(2);
```

Os indicativos `QB_NAME` podem ser usados para especificar de forma explícita e clara quais blocos de consulta outros indicativos se aplicam. Eles também permitem que todos os indicativos de nomes de blocos que não são de consulta sejam especificados dentro de um único comentário do indicativo para uma compreensão mais fácil de instruções complexas. Considere a seguinte instrução:

```
RESOURCE_GROUP(group_name)
```tZdK1IBcJP```
QB_NAME(name)
```XYKawonGpZ```
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```MYx9NyfF08```
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```uvzdW8Bb5t```