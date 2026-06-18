### 10.9.3 Dicas de otimização

Uma maneira de controlar as estratégias de otimização é definir a variável de sistema `optimizer_switch` (consulte a Seção 10.9.2, “Otimizações Alternativas”). Alterações nesta variável afetam a execução de todas as consultas subsequentes; para alterar uma consulta de maneira diferente da outra, é necessário alterar `optimizer_switch` antes de cada uma.

Outra maneira de controlar o otimizador é usando dicas de otimizador, que podem ser especificadas dentro de declarações individuais. Como as dicas de otimizador são aplicadas de forma individual, elas oferecem um controle mais preciso sobre os planos de execução das declarações do que o que pode ser alcançado usando `optimizer_switch`. Por exemplo, você pode habilitar uma otimização para uma tabela em uma declaração e desabilitar a otimização para uma tabela diferente. As dicas dentro de uma declaração têm precedência sobre os flags `optimizer_switch`.

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

Os dicas de otimização, descritas aqui, diferem das dicas de índice, descritas na Seção 10.9.4, “Dicas de Índice”. As dicas de otimização e de índice podem ser usadas separadamente ou juntas.

- Visão geral do Dicas de otimização
- Sinal de dica do otimizador
- Dicas do Otimizador de Ordem de Compra
- Dicas de otimização de nível de tabela
- Dicas do otimizador de nível de índice
- Dicas de otimização de subconsultas
- Dicas de otimização do tempo de execução de declarações
- Sintaxe de dica de configuração variável
- Sintaxe de dica do grupo de recursos
- Dicas de otimização para nomear blocos de consulta

#### Visão geral do Dicas de otimização

Os dicas do otimizador são aplicadas em diferentes níveis de escopo:

- Global: O indício afeta toda a declaração

- Bloco de consulta: O aviso afeta um bloco de consulta específico dentro de uma declaração

- Nível de tabela: O aviso afeta uma tabela específica dentro de um bloco de consulta

- Nível de índice: O indicador afeta um índice específico dentro de uma tabela

A tabela a seguir resume as dicas de otimização disponíveis, as estratégias de otimização que elas afetam e o escopo ou escopos em que elas se aplicam. Mais detalhes serão fornecidos mais adiante.

**Tabela 10.2 Sugestões de otimizador disponíveis**

<table summary="Nomeie, descreva e explique os contextos em que os otimizadores são aplicados."><thead><tr> <th scope="col">Nome do Sugestão</th> <th scope="col">Descrição</th> <th scope="col">Âmbito de aplicação</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>NO_HASH_JOIN</code>], [[PH_HTML_CODE_<code>NO_HASH_JOIN</code>]</th> <td>Afeta o processamento de junção de acesso de chave em lote</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th>[[PH_HTML_CODE_<code>NO_INDEX</code>], [[PH_HTML_CODE_<code>JOIN_INDEX</code>]</th> <td>Antes do MySQL 8.0.20: afeta o processamento de junções de laço aninhado; MySQL 8.0.18 e versões posteriores: também afeta a otimização de junções hash; MySQL 8.0.20 e versões posteriores: afeta apenas a otimização de junções hash</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th>[[PH_HTML_CODE_<code>GROUP_INDEX</code>], [[PH_HTML_CODE_<code>ORDER_INDEX</code>]</th> <td>Use ou ignore a otimização de empilhamento de condições derivadas para tabelas derivadas materializadas (adicionada no MySQL 8.0.22)</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th>[[PH_HTML_CODE_<code>NO_JOIN_INDEX</code>], [[PH_HTML_CODE_<code>NO_GROUP_INDEX</code>]</th> <td>Use ou ignore o(s) índice(s) especificado(s) para varreduras de índice em operações [[PH_HTML_CODE_<code>NO_ORDER_INDEX</code>] (Adicionado no MySQL 8.0.20)</td> <td>Índice</td> </tr><tr> <th>[[PH_HTML_CODE_<code>INDEX_MERGE</code>], [[<code>NO_HASH_JOIN</code>]]</th> <td>Afeta a otimização da junção hash (apenas no MySQL 8.0.18</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th>[[<code>NO_BKA</code><code>NO_HASH_JOIN</code>], [[<code>NO_INDEX</code>]]</th> <td>Funciona como a combinação de [[<code>JOIN_INDEX</code>]], [[<code>GROUP_INDEX</code>]] e [[<code>ORDER_INDEX</code>]], ou como a combinação de [[<code>NO_JOIN_INDEX</code>]], [[<code>NO_GROUP_INDEX</code>]] e [[<code>NO_ORDER_INDEX</code>]] (Adicionado no MySQL 8.0.20)</td> <td>Índice</td> </tr><tr> <th>[[<code>INDEX_MERGE</code>]], [[<code>BNL</code><code>NO_HASH_JOIN</code>]</th> <td>Afeta a otimização da junção do índice</td> <td>Tabela, índice</td> </tr><tr> <th>[[<code>BNL</code><code>NO_HASH_JOIN</code>]</th> <td>Use a ordem da tabela especificada na cláusula [[<code>BNL</code><code>NO_INDEX</code>] para a ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th>[[<code>BNL</code><code>JOIN_INDEX</code>], [[<code>BNL</code><code>GROUP_INDEX</code>]</th> <td>Use ou ignore o(s) índice(s) especificado(s) para qualquer método de acesso (Adicionado no MySQL 8.0.20)</td> <td>Índice</td> </tr><tr> <th>[[<code>BNL</code><code>ORDER_INDEX</code>]</th> <td>Use a ordem da tabela especificada na dica para a ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th>[[<code>BNL</code><code>NO_JOIN_INDEX</code>]</th> <td>Use a ordem da tabela especificada na dica para as primeiras tabelas da ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th>[[<code>BNL</code><code>NO_GROUP_INDEX</code>]</th> <td>Use a ordem da tabela especificada na dica para as últimas tabelas da ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th>[[<code>BNL</code><code>NO_ORDER_INDEX</code>]</th> <td>Limites para a execução do tempo de declaração</td> <td>Global</td> </tr><tr> <th>[[<code>BNL</code><code>INDEX_MERGE</code>], [[<code>NO_BNL</code><code>NO_HASH_JOIN</code>]</th> <td>Tabelas/visualizações derivadas afetadas pela fusão no bloco de consulta externa</td> <td>Tabela</td> </tr><tr> <th>[[<code>NO_BNL</code><code>NO_HASH_JOIN</code>], [[<code>NO_BNL</code><code>NO_INDEX</code>]</th> <td>Afeta a otimização da leitura de Multi-Range</td> <td>Tabela, índice</td> </tr><tr> <th>[[<code>NO_BNL</code><code>JOIN_INDEX</code>]</th> <td>Afeta a otimização da condição do índice Pushdown</td> <td>Tabela, índice</td> </tr><tr> <th>[[<code>NO_BNL</code><code>GROUP_INDEX</code>]</th> <td>Otimização da faixa de efeitos</td> <td>Tabela, índice</td> </tr><tr> <th>[[<code>NO_BNL</code><code>ORDER_INDEX</code>], [[<code>NO_BNL</code><code>NO_JOIN_INDEX</code>]</th> <td>Use ou ignore o(s) índice(s) especificado(s) para ordenar as linhas (Adicionado no MySQL 8.0.20)</td> <td>Índice</td> </tr><tr> <th>[[<code>NO_BNL</code><code>NO_GROUP_INDEX</code>]</th> <td>Atribui nome ao bloco de consulta</td> <td>Bloco de consulta</td> </tr><tr> <th>[[<code>NO_BNL</code><code>NO_ORDER_INDEX</code>]</th> <td>Definir o grupo de recursos durante a execução da declaração</td> <td>Global</td> </tr><tr> <th>[[<code>NO_BNL</code><code>INDEX_MERGE</code>], [[<code>DERIVED_CONDITION_PUSHDOWN</code><code>NO_HASH_JOIN</code>]</th> <td>Afeta as estratégias de semijoin; a partir do MySQL 8.0.17, isso também se aplica aos antijoins</td> <td>Bloco de consulta</td> </tr><tr> <th>[[<code>DERIVED_CONDITION_PUSHDOWN</code><code>NO_HASH_JOIN</code>], [[<code>DERIVED_CONDITION_PUSHDOWN</code><code>NO_INDEX</code>]</th> <td>Afeta a otimização do Descartar varredura</td> <td>Tabela, índice</td> </tr><tr> <th>[[<code>DERIVED_CONDITION_PUSHDOWN</code><code>JOIN_INDEX</code>]</th> <td>Definir variável durante a execução da declaração</td> <td>Global</td> </tr><tr> <th>[[<code>DERIVED_CONDITION_PUSHDOWN</code><code>GROUP_INDEX</code>]</th> <td>Afeta as estratégias de subconsulta de materialização, [[<code>DERIVED_CONDITION_PUSHDOWN</code><code>ORDER_INDEX</code>]-a-[[<code>DERIVED_CONDITION_PUSHDOWN</code><code>NO_JOIN_INDEX</code>]</td> <td>Bloco de consulta</td> </tr></tbody></table>

Desativar uma otimização impede que o otimizador a use. Habilitar uma otimização significa que o otimizador pode usar a estratégia se ela se aplicar à execução da instrução, não que o otimizador a use necessariamente.

#### Sinal de dica do otimizador

O MySQL suporta comentários em instruções SQL conforme descrito na Seção 11.7, “Comentários”. Os hints do otimizador devem ser especificados dentro dos comentários `/*+ ... */`. Ou seja, os hints do otimizador usam uma variante da sintaxe de comentário em estilo C `/* ... */`, com um caractere `+` após a sequência de abertura do comentário `/*`. Exemplos:

```
/*+ BKA(t1) */
/*+ BNL(t1, t2) */
/*+ NO_RANGE_OPTIMIZATION(t4 PRIMARY) */
/*+ QB_NAME(qb2) */
```

Espaços em branco são permitidos após o caractere `+`.

O analisador reconhece comentários de dicas de otimização após a palavra-chave inicial das instruções `SELECT`, `UPDATE`, `INSERT`, `REPLACE` e `DELETE`. As dicas são permitidas nesses contextos:

- No início das declarações de consulta e alteração de dados:

  ```
  SELECT /*+ ... */ ...
  INSERT /*+ ... */ ...
  REPLACE /*+ ... */ ...
  UPDATE /*+ ... */ ...
  DELETE /*+ ... */ ...
  ```

- No início dos blocos de consulta:

  ```
  (SELECT /*+ ... */ ... )
  (SELECT ... ) UNION (SELECT /*+ ... */ ... )
  (SELECT /*+ ... */ ... ) UNION (SELECT /*+ ... */ ... )
  UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  INSERT ... SELECT /*+ ... */ ...
  ```

- Em declarações pré-enchíveis precedidas por `EXPLAIN`. Por exemplo:

  ```
  EXPLAIN SELECT /*+ ... */ ...
  EXPLAIN UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  ```

  A implicação é que você pode usar `EXPLAIN` para ver como as dicas do otimizador afetam os planos de execução. Use `SHOW WARNINGS` imediatamente após `EXPLAIN` para ver como as dicas são usadas. A saída `EXPLAIN` estendida exibida por um `SHOW WARNINGS` subsequente indica quais dicas foram usadas. As dicas ignoradas não são exibidas.

Um comentário de dica pode conter múltiplas dicas, mas um bloco de consulta não pode conter múltiplos comentários de dica. Isso é válido:

```
SELECT /*+ BNL(t1) BKA(t2) */ ...
```

Mas isso é inválido:

```
SELECT /*+ BNL(t1) */ /* BKA(t2) */ ...
```

Quando um comentário com dicas contém várias dicas, existe a possibilidade de duplicatas e conflitos. As seguintes diretrizes gerais se aplicam. Para tipos específicos de dicas, podem ser aplicadas regras adicionais, conforme indicado nas descrições das dicas.

- Dicas duplicadas: Para uma dica como `/*+ MRR(idx1) MRR(idx1) */`, o MySQL usa a primeira dica e emite uma mensagem de alerta sobre a dica duplicada.

- Dúvidas sobre dicas: Para uma dica como `/*+ MRR(idx1) NO_MRR(idx1) */`, o MySQL usa a primeira dica e emite um aviso sobre a segunda dica conflitante.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 11.2, “Nomes de Objetos do Esquema”).

Os nomes de dicas, nomes de blocos de consulta e nomes de estratégias não são sensíveis ao caso. As referências a nomes de tabelas e índices seguem as regras habituais de sensibilidade ao caso dos identificadores (consulte a Seção 11.2.3, “Sensibilidade ao Caso dos Identificadores”).

#### Dicas do Otimizador de Ordem de Compra

Os dicas de ordem de junção afetam a ordem em que o otimizador junta as tabelas.

Sintaxe da dica `JOIN_FIXED_ORDER`:

```
hint_name([@query_block_name])
```

Sintaxe de outras dicas de ordem de junção:

```
hint_name([@query_block_name] tbl_name [, tbl_name] ...)
hint_name(tbl_name[@query_block_name] [, tbl_name[@query_block_name]] ...)
```

A sintaxe refere-se a esses termos:

- `hint_name`: Esses nomes de dicas são permitidos:

  - `JOIN_FIXED_ORDER`: Forçar o otimizador a unir tabelas usando a ordem em que elas aparecem na cláusula `FROM`. Isso é o mesmo que especificar `SELECT STRAIGHT_JOIN`.

  - `JOIN_ORDER`: Instrua o otimizador a unir as tabelas usando a ordem de tabela especificada. O indicativo se aplica às tabelas nomeadas. O otimizador pode colocar tabelas que não estão nomeadas em nenhum lugar na ordem de junção, incluindo entre tabelas especificadas.

  - `JOIN_PREFIX`: Instrua o otimizador a unir as tabelas usando a ordem de tabela especificada para as primeiras tabelas do plano de execução da união. O indicativo se aplica às tabelas nomeadas. O otimizador coloca todas as outras tabelas após as tabelas nomeadas.

  - `JOIN_SUFFIX`: Instrua o otimizador a unir as tabelas usando a ordem de tabela especificada para as últimas tabelas do plano de execução da união. O indicativo se aplica às tabelas nomeadas. O otimizador coloca todas as outras tabelas antes das tabelas nomeadas.

- `tbl_name`: O nome de uma tabela usada na declaração. Um aviso de que nomes de tabelas se aplicam a todas as tabelas que ele nomeia. O aviso `JOIN_FIXED_ORDER` não nomeia tabelas e se aplica a todas as tabelas na cláusula `FROM` do bloco de consulta em que ocorre.

  Se uma tabela tiver um alias, as dicas devem se referir ao alias, e não ao nome da tabela.

  Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.

- `query_block_name`: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o prefixo `@query_block_name`, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomeação de blocos de consulta.

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

Os indicadores controlam o comportamento das tabelas de junção parcial que são unidas ao bloco de consulta externa. Se as subconsultas `subq1` e `subq2` forem convertidas em junções parciais, as tabelas `t4@subq1` e `t5@subq2` serão unidas ao bloco de consulta externa. Nesse caso, o indicador especificado no bloco de consulta externa controla o comportamento das tabelas `t4@subq1` e `t5@subq2`.

O otimizador resolve os hints de ordem de junção de acordo com esses princípios:

- Várias instâncias de dicas

  Apenas uma dica `JOIN_PREFIX` e `JOIN_SUFFIX` de cada tipo é aplicada. Quaisquer dicas posteriores do mesmo tipo são ignoradas com um aviso. `JOIN_ORDER` pode ser especificado várias vezes.

  Exemplos:

  ```
  /*+ JOIN_PREFIX(t1) JOIN_PREFIX(t2) */
  ```

  A segunda dica `JOIN_PREFIX` é ignorada com um aviso.

  ```
  /*+ JOIN_PREFIX(t1) JOIN_SUFFIX(t2) */
  ```

  Ambas as dicas são aplicáveis. Nenhum aviso ocorre.

  ```
  /*+ JOIN_ORDER(t1, t2) JOIN_ORDER(t2, t3) */
  ```

  Ambas as dicas são aplicáveis. Nenhum aviso ocorre.

- Dúvidas sobre o que fazer

  Em alguns casos, as dicas podem entrar em conflito, como quando `JOIN_ORDER` e `JOIN_PREFIX` têm ordens de tabela que são impossíveis de aplicar ao mesmo tempo:

  ```
  SELECT /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */ ... FROM t1, t2;
  ```

  Neste caso, o primeiro aviso especificado é aplicado e os avisos conflitantes subsequentes são ignorados sem aviso. Um aviso válido que é impossível de aplicar é ignorado silenciosamente sem aviso.

- Dúvidas ignoradas

  Uma dica é ignorada se uma tabela especificada na dica tiver uma dependência circular.

  Exemplo:

  ```
  /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */
  ```

  O `JOIN_ORDER` hint define a tabela `t2` como dependente de `t1`. O `JOIN_PREFIX` hint é ignorado porque a tabela `t1` não pode ser dependente de `t2`. Os hints ignorados não são exibidos na saída `EXPLAIN` estendida.

- Interação com tabelas `const`

  O otimizador do MySQL coloca as tabelas `const` em primeiro lugar na ordem de junção, e a posição de uma tabela `const` não pode ser afetada por dicas. As referências às tabelas `const` nas dicas de ordem de junção são ignoradas, embora a dica ainda seja aplicável. Por exemplo, estas são equivalentes:

  ```
  JOIN_ORDER(t1, const_tbl, t2)
  JOIN_ORDER(t1, t2)
  ```

  Os suportes aceitos mostrados na saída `EXPLAIN` estendida incluem tabelas `const` conforme especificadas.

- Interação com tipos de operações de junção

  O MySQL suporta vários tipos de junções: `LEFT`, `RIGHT`, `INNER`, `CROSS`, `STRAIGHT_JOIN`. Uma dica que entra em conflito com o tipo de junção especificado é ignorada sem aviso.

  Exemplo:

  ```
  SELECT /*+ JOIN_PREFIX(t1, t2) */FROM t2 LEFT JOIN t1;
  ```

  Aqui ocorre um conflito entre a ordem de junção solicitada no aviso e a ordem exigida pelo `LEFT JOIN`. O aviso é ignorado sem aviso.

#### Dicas de otimização de nível de tabela

Os dicas de nível de tabela afetam:

- Uso dos algoritmos de processamento de junções de laço aninhado (BNL) e acesso a chave em lote (BKA) (consulte a Seção 10.2.1.12, “Junções de laço aninhado e acesso a chave em lote”).

- As tabelas derivadas, as referências de visualização ou as expressões de tabela comuns devem ser incorporadas ao bloco de consulta externa ou materializadas usando uma tabela temporária interna.

- Uso da otimização de empilhamento de condições de tabela derivada (adicionada no MySQL 8.0.22). Consulte a Seção 10.2.2.5, “Otimização de Empilhamento de Condições Derivadas”.

Esses tipos de dicas aplicam-se a tabelas específicas ou a todas as tabelas em um bloco de consulta.

Sintaxe de dicas de nível de tabela:

```
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

A sintaxe refere-se a esses termos:

- `hint_name`: Esses nomes de dicas são permitidos:

  - `BKA`, `NO_BKA`: Ative ou desative o acesso por chave em lote para as tabelas especificadas.

  - `BNL`, `NO_BNL`: Ative ou desative o bloqueio de loop aninhado para as tabelas especificadas. No MySQL 8.0.18 e versões posteriores, esses hints também ativam e desativam a otimização de junção hash.

    Nota

    A otimização do loop aninhado em blocos foi removida no MySQL 8.0.20 e em versões posteriores, mas `BNL` e `NO_BNL` continuam sendo suportados para habilitar e desabilitar junções de hash.

  - `DERIVED_CONDITION_PUSHDOWN`, `NO_DERIVED_CONDITION_PUSHDOWN`: Ative ou desative o uso da otimização de empilhamento de condições de tabela derivada para as tabelas especificadas (adicionado no MySQL 8.0.22). Para mais informações, consulte a Seção 10.2.2.5, “Otimização de Empilhamento de Condições Derivadas”.

  - `HASH_JOIN`, `NO_HASH_JOIN`: Apenas no MySQL 8.0.18, habilite ou desabilite o uso de uma junção hash para as tabelas especificadas. Esses hints não têm efeito no MySQL 8.0.19 ou versões posteriores, onde você deve usar `BNL` ou `NO_BNL` em vez disso.

  - `MERGE`, `NO_MERGE`: Ative a fusão para as tabelas especificadas, referências de visualização ou expressões de tabela comuns; ou desative a fusão e use materialização.

  Nota

  Para usar uma dica de loop aninhado de bloco ou acesso a chave em lote para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve ser habilitado para todas as tabelas internas da junção externa.

- `tbl_name`: O nome de uma tabela usada na declaração. O hint se aplica a todas as tabelas que ele nomeia. Se o hint não nomear nenhuma tabela, ele se aplica a todas as tabelas do bloco de consulta em que ocorre.

  Se uma tabela tiver um alias, as dicas devem se referir ao alias, e não ao nome da tabela.

  Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.

- `query_block_name`: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o prefixo `@query_block_name`, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomeação de blocos de consulta.

Exemplos:

```
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_MERGE(dt) */ * FROM (SELECT * FROM t1) AS dt;
```

Uma dica de nível de tabela se aplica a tabelas que recebem registros de tabelas anteriores, não de tabelas de remetente. Considere esta declaração:

```
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

Se o otimizador optar por processar `t1` primeiro, ele aplica uma junção de laço aninhado de bloco a `t2` armazenando as linhas de `t1` antes de começar a ler de `t2`. Se, em vez disso, o otimizador optar por processar `t2` primeiro, o indicador não terá efeito porque `t2` é uma tabela de remetente.

Para as dicas `MERGE` e `NO_MERGE`, essas regras de precedência se aplicam:

- Uma dica tem precedência sobre qualquer heurística de otimização que não seja uma restrição técnica. (Se fornecer uma dica como sugestão não tiver efeito, o otimizador tem um motivo para ignorá-la.)

- Uma dica tem precedência sobre a bandeira `derived_merge` da variável de sistema `optimizer_switch`.

- Para referências de visualização, uma cláusula `ALGORITHM={MERGE|TEMPTABLE}` na definição da visualização tem precedência sobre um hint especificado na consulta que faz referência à visualização.

#### Dicas do otimizador de nível de índice

Os indicadores de nível de índice afetam quais estratégias de processamento de índice o otimizador usa para tabelas ou índices específicos. Esses tipos de indicadores afetam o uso do Index Condition Pushdown (ICP), Multi-Range Read (MRR), Merge de índice e otimizações de intervalo (veja a Seção 10.2.1, “Otimizando instruções SELECT”).

Sintaxe de dicas de nível de índice:

```
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

A sintaxe refere-se a esses termos:

- `hint_name`: Esses nomes de dicas são permitidos:

  - `GROUP_INDEX`, `NO_GROUP_INDEX`: Ative ou desative o(s) índice(s) especificado(s) para varreduras de índice para operações `GROUP BY`. Equivalente às dicas de índice `FORCE INDEX FOR GROUP BY`, `IGNORE INDEX FOR GROUP BY`. Disponível no MySQL 8.0.20 e versões posteriores.

  - `INDEX`, `NO_INDEX`: Funciona como a combinação de `JOIN_INDEX`, `GROUP_INDEX` e `ORDER_INDEX`, forçando o servidor a usar o índice ou índices especificados para todos os escopos, ou como a combinação de `NO_JOIN_INDEX`, `NO_GROUP_INDEX` e `NO_ORDER_INDEX`, o que faz com que o servidor ignore o índice ou índices especificados para todos os escopos. Equivalente a `FORCE INDEX`, `IGNORE INDEX`. Disponível a partir do MySQL 8.0.20.

  - `INDEX_MERGE`, `NO_INDEX_MERGE`: Ative ou desative o método de acesso à junção de índices para a tabela ou índices especificados. Para obter informações sobre esse método de acesso, consulte a Seção 10.2.1.3, “Otimização da Junção de Índices”. Esses dicas se aplicam a todos os três algoritmos de junção de índices.

    O `INDEX_MERGE` força o otimizador a usar a Mesclagem de Índices para a tabela especificada usando o conjunto especificado de índices. Se nenhum índice for especificado, o otimizador considera todas as combinações possíveis de índices e seleciona a menos dispendiosa. O aviso pode ser ignorado se a combinação de índices não for aplicável à declaração dada.

    O `NO_INDEX_MERGE` desativa as combinações de junção de índice que envolvem qualquer um dos índices especificados. Se o aviso não especificar nenhum índice, a junção de índice não é permitida para a tabela.

  - `JOIN_INDEX`, `NO_JOIN_INDEX`: Força o MySQL a usar ou ignorar o índice ou índices especificados para qualquer método de acesso, como `ref`, `range`, `index_merge` e assim por diante. Equivalente a `FORCE INDEX FOR JOIN`, `IGNORE INDEX FOR JOIN`. Disponível no MySQL 8.0.20 e versões posteriores.

  - `MRR`, `NO_MRR`: Ative ou desative o MRR para a tabela ou índices especificados. As dicas de MRR se aplicam apenas às tabelas `InnoDB` e `MyISAM`. Para obter informações sobre esse método de acesso, consulte a Seção 10.2.1.11, “Otimização de Leitura de Múltiplos Intervalos”.

  - `NO_ICP`: Desative o ICP para a tabela ou índices especificados. Por padrão, o ICP é uma estratégia de otimização candidata, portanto, não há indicação para ativá-lo. Para obter informações sobre esse método de acesso, consulte a Seção 10.2.1.6, “Otimização de Pushdown de Condição de Índice”.

  - `NO_RANGE_OPTIMIZATION`: Desative o acesso ao intervalo de índice para a tabela ou índices especificados. Esse indicativo também desativa a Mesclagem de Índices e a Pesquisa de Índices Ligeros para a tabela ou índices. Por padrão, o acesso ao intervalo é uma estratégia de otimização candidata, portanto, não há indicativo para ativá-lo.

    Essa dica pode ser útil quando o número de faixas pode ser alto e a otimização das faixas exigiria muitos recursos.

  - `ORDER_INDEX`, `NO_ORDER_INDEX`: Faça com que o MySQL use ou ignore o(s) índice(s) especificado(s) para ordenar as linhas. Equivalente a `FORCE INDEX FOR ORDER BY`, `IGNORE INDEX FOR ORDER BY`. Disponível a partir do MySQL 8.0.20.

  - `SKIP_SCAN`, `NO_SKIP_SCAN`: Ative ou desative o método de acesso Salte varredura para a tabela ou índices especificados. Para obter informações sobre esse método de acesso, consulte o método de acesso Salte intervalo de varredura. Esses dicas estão disponíveis a partir do MySQL 8.0.13.

    O `SKIP_SCAN` força o otimizador a usar o Skip Scan para a tabela especificada usando o conjunto especificado de índices. Se nenhum índice for especificado, o otimizador considera todos os índices possíveis e seleciona o menos dispendioso. O aviso pode ser ignorado se o índice não for aplicável à declaração dada.

    O `NO_SKIP_SCAN` desativa o Desvio de varredura para os índices especificados. Se o índice não especificar nenhum índice, o Desvio de varredura não é permitido para a tabela.

- `tbl_name`: A tabela à qual o hint se aplica.

- `index_name`: O nome de um índice na tabela nomeada. O hint se aplica a todos os índices que ele nomeia. Se o hint não nomear nenhum índice, ele se aplica a todos os índices na tabela.

  Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use `SHOW INDEX`.

- `query_block_name`: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o prefixo `@query_block_name`, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomeação de blocos de consulta.

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

Os exemplos a seguir utilizam as dicas de junção de índices, mas outras dicas de nível de índice seguem os mesmos princípios em relação à ignorância das dicas e à precedência das dicas do otimizador em relação à variável de sistema `optimizer_switch` ou às dicas de índice.

Suponha que a tabela `t1` tenha as colunas `a`, `b`, `c` e `d`; e que existam índices chamados `i_a`, `i_b` e `i_c` em `a`, `b` e `c`, respectivamente:

```
SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c)*/ * FROM t1
  WHERE a = 1 AND b = 2 AND c = 3 AND d = 4;
```

O Índice de Fusão é usado para `(i_a, i_b, i_c)` neste caso.

```
SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c)*/ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
```

O Índice de Fusão é usado para `(i_b, i_c)` neste caso.

```
/*+ INDEX_MERGE(t1 i_a, i_b) NO_INDEX_MERGE(t1 i_b) */
```

`NO_INDEX_MERGE` é ignorado porque há um aviso anterior para a mesma tabela.

```
/*+ NO_INDEX_MERGE(t1 i_a, i_b) INDEX_MERGE(t1 i_b) */
```

`INDEX_MERGE` é ignorado porque há um aviso anterior para a mesma tabela.

Para as dicas de otimização `INDEX_MERGE` e `NO_INDEX_MERGE`, essas regras de precedência se aplicam:

- Se uma dica de otimização for especificada e aplicável, ela terá precedência sobre as flags relacionadas à junção de índices da variável de sistema `optimizer_switch`.

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

  O indicador especifica apenas um índice, portanto, é inapropriado, e a bandeira `optimizer_switch` (`on`) se aplica. A junção de índices é usada se o otimizador avaliar que seja econômica.

  ```
  SET optimizer_switch='index_merge_intersection=off';
  SELECT /*+ INDEX_MERGE(t1 i_b) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

  O indicador especifica apenas um índice, portanto, é inapropriado, e a bandeira `optimizer_switch` (`off`) se aplica. A fusão de índices não é usada.

- Os indicadores de otimização `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` têm precedência sobre os indicadores equivalentes `FORCE INDEX`, ou seja, eles fazem com que os indicadores `FORCE INDEX` sejam ignorados. Da mesma forma, os indicadores `NO_GROUP_INDEX`, `NO_INDEX`, `NO_JOIN_INDEX` e `NO_ORDER_INDEX` têm precedência sobre quaisquer equivalentes `IGNORE INDEX`, também fazendo com que eles sejam ignorados.

  Os índices de otimização `GROUP_INDEX`, `NO_GROUP_INDEX`, `INDEX`, `NO_INDEX`, `JOIN_INDEX`, `NO_JOIN_INDEX`, `ORDER_INDEX` e `NO_ORDER_INDEX` têm precedência sobre todos os outros índices de otimização, incluindo outros índices de otimização de nível de índice. Todos os outros índices de otimização são aplicados apenas aos índices permitidos por esses índices.

  Os `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` são equivalentes a `FORCE INDEX` e não a `USE INDEX`. Isso ocorre porque o uso de um ou mais desses índices significa que uma varredura da tabela é usada apenas se não houver maneira de usar um dos índices nomeados para encontrar linhas na tabela. Para fazer com que o MySQL use o mesmo índice ou conjunto de índices que uma instância específica de `USE INDEX`, você pode usar `NO_INDEX`, `NO_JOIN_INDEX`, `NO_GROUP_INDEX`, `NO_ORDER_INDEX` ou uma combinação desses.

  Para replicar o efeito que o `USE INDEX` tem na consulta `SELECT a,c FROM t1 USE INDEX FOR ORDER BY (i_a) ORDER BY a`, você pode usar a dica de otimização `NO_ORDER_INDEX` para cobrir todos os índices da tabela, exceto o desejado, da seguinte forma:

  ```
  SELECT /*+ NO_ORDER_INDEX(t1 i_b,i_c) */ a,c
      FROM t1
      ORDER BY a;
  ```

  Tentar combinar `NO_ORDER_INDEX` para a tabela como um todo com `USE INDEX FOR ORDER BY` não funciona para fazer isso, porque `NO_ORDER_BY` faz com que `USE INDEX` seja ignorado, como mostrado aqui:

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

- As dicas de índice `USE INDEX`, `FORCE INDEX` e `IGNORE INDEX` têm prioridade maior do que as dicas de otimização `INDEX_MERGE` e `NO_INDEX_MERGE`.

  ```
  /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ ... IGNORE INDEX i_a
  ```

  `IGNORE INDEX` tem precedência sobre `INDEX_MERGE`, portanto, o índice `i_a` é excluído dos possíveis intervalos para a Mesclagem de Índices.

  ```
  /*+ NO_INDEX_MERGE(t1 i_a, i_b) */ ... FORCE INDEX i_a, i_b
  ```

  A junção de índices é desativada para `i_a, i_b` devido a `FORCE INDEX`, mas o otimizador é forçado a usar `i_a` ou `i_b` para o acesso a `range` ou `ref`. Não há conflitos; ambos os dicas são aplicáveis.

- Se uma dica `IGNORE INDEX` nomear vários índices, esses índices não estarão disponíveis para a Fusão de Índices.

- Os indicadores `FORCE INDEX` e `USE INDEX` fazem com que apenas os índices nomeados estejam disponíveis para a junção de índices.

  ```
  SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ a FROM t1
  FORCE INDEX (i_a, i_b) WHERE c = 'h' AND a = 2 AND b = 'b';
  ```

  O algoritmo de acesso de interseção da junção do Índice é utilizado para `(i_a, i_b)`. O mesmo vale se `FORCE INDEX` for alterado para `USE INDEX`.

#### Dicas de otimização de subconsultas

Os indicativos de subconsultas afetam se as transformações de junção parcial devem ser usadas e quais estratégias de junção parcial devem ser permitidas, e, quando as junções não são usadas, se as materializações de subconsultas ou as transformações `IN`-para-`EXISTS` devem ser usadas. Para mais informações sobre essas otimizações, consulte a Seção 10.2.2, “Otimizando subconsultas, tabelas derivadas, referências de visualizações e expressões de tabela comum”.

Sintaxe de dicas que afetam estratégias de junção parcial:

```
hint_name([@query_block_name] [strategy [, strategy] ...])
```

A sintaxe refere-se a esses termos:

- `hint_name`: Esses nomes de dicas são permitidos:

  - `SEMIJOIN`, `NO_SEMIJOIN`: Ative ou desative as estratégias de junção semijunta nomeadas.

- `strategy`: Uma estratégia de junção parcial a ser habilitada ou desabilitada. Esses nomes de estratégia são permitidos: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

  Para dicas de `SEMIJOIN`, se nenhuma estratégia for nomeada, o semijoin é usado, se possível, com base nas estratégias habilitadas de acordo com a variável de sistema `optimizer_switch`. Se as estratégias forem nomeadas, mas inapropriadas para a declaração, é usado `DUPSWEEDOUT`.

  Para dicas de `NO_SEMIJOIN`, se não houver estratégias nomeadas, o semijoin não é usado. Se houver estratégias nomeadas que excluam todas as estratégias aplicáveis para a declaração, o `DUPSWEEDOUT` é usado.

Se uma subconsulta estiver aninhada em outra e ambas forem unidas em uma junção parcial de uma consulta externa, qualquer especificação de estratégias de junção parcial para a consulta mais interna será ignorada. As dicas `SEMIJOIN` e `NO_SEMIJOIN` ainda podem ser usadas para habilitar ou desabilitar as transformações de junção parcial para essas subconsultas aninhadas.

Se `DUPSWEEDOUT` estiver desativado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, o que pode ser evitado ao definir `optimizer_prune_level=0`.

Exemplos:

```
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Sintaxe de dicas que afetam se deve usar materialização de subconsulta ou transformações de `IN` para `EXISTS`:

```
SUBQUERY([@query_block_name] strategy)
```

O nome do indicador é sempre `SUBQUERY`.

Para dicas de `SUBQUERY`, esses valores `strategy` são permitidos: `INTOEXISTS`, `MATERIALIZATION`.

Exemplos:

```
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

Para dicas de junção parcial e `SUBQUERY` , um prefixo `@query_block_name` especifica o bloco de consulta ao qual a dica se aplica. Se a dica não incluir nenhum prefixo `@query_block_name`, a dica se aplica ao bloco de consulta em que ocorre. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomear blocos de consulta.

Se um comentário de dica contiver várias dicas de subconsulta, a primeira será usada. Se houver outras dicas desse tipo, elas produzirão uma mensagem de aviso. Dicas de outros tipos são ignoradas silenciosamente.

#### Dicas de otimização do tempo de execução de declarações

O `MAX_EXECUTION_TIME` hint é permitido apenas para instruções `SELECT`. Ele coloca um limite `N` (um valor de tempo de espera em milissegundos) sobre o tempo em que uma instrução é permitida para ser executada antes que o servidor a termine:

```
MAX_EXECUTION_TIME(N)
```

Exemplo com um tempo de espera de 1 segundo (1000 milissegundos):

```
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

O `MAX_EXECUTION_TIME(N)` hint define o tempo de espera para a execução de uma declaração em `N` milissegundos. Se esta opção estiver ausente ou se `N` for 0, o tempo de espera para a declaração estabelecido pela variável de sistema `max_execution_time` será aplicado.

O `MAX_EXECUTION_TIME` é aplicável da seguinte forma:

- Para declarações com múltiplas palavras-chave `SELECT` como uniões ou declarações com subconsultas, `MAX_EXECUTION_TIME` se aplica a toda a declaração e deve aparecer após a primeira `SELECT`.

- Isso se aplica a declarações `SELECT` apenas de leitura. As declarações que não são apenas de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

- Não se aplica às declarações `SELECT` em programas armazenados e é ignorado.

#### Sintaxe de dica de configuração variável

O `SET_VAR` hint define o valor da sessão de uma variável de sistema temporariamente (por toda a duração de uma única instrução). Exemplos:

```
SELECT /*+ SET_VAR(sort_buffer_size = 16M) */ name FROM people ORDER BY name;
INSERT /*+ SET_VAR(foreign_key_checks=OFF) */ INTO t2 VALUES(2);
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off') */ 1;
```

Sintaxe da dica `SET_VAR`:

```
SET_VAR(var_name = value)
```

`var_name` nomeia uma variável de sistema que tem um valor de sessão (embora nem todas essas variáveis possam ser nomeadas, conforme explicado mais adiante). `value` é o valor a ser atribuído à variável; o valor deve ser escalar.

`SET_VAR` faz uma alteração na variável temporária, conforme demonstrado por essas declarações:

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

Com `SET_VAR`, não é necessário salvar e restaurar o valor da variável. Isso permite que você substitua várias instruções por uma única instrução. Considere esta sequência de instruções:

```
SET @saved_val = @@SESSION.var_name;
SET @@SESSION.var_name = value;
SELECT ...
SET @@SESSION.var_name = @saved_val;
```

A sequência pode ser substituída por esta única declaração:

```
SELECT /*+ SET_VAR(var_name = value) ...
```

As declarações `SET` independentes permitem qualquer uma dessas sintáticas para nomear variáveis de sessão:

```
SET SESSION var_name = value;
SET @@SESSION.var_name = value;
SET @@.var_name = value;
```

Como o `SET_VAR` não se aplica a variáveis de sessão, o escopo da sessão é implícito, e os `SESSION`, `@@SESSION.` e `@@` não são necessários nem permitidos. A inclusão da sintaxe explícita de indicação de sessão faz com que o `SET_VAR` seja ignorado com um aviso.

Nem todas as variáveis de sessão são permitidas para uso com `SET_VAR`. As descrições individuais das variáveis do sistema indicam se cada variável é hintilável; veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”. Você também pode verificar uma variável do sistema em tempo de execução, tentando usá-la com `SET_VAR`. Se a variável não for hintilável, uma mensagem de aviso é exibida:

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

A sintaxe `SET_VAR` permite definir apenas uma variável, mas múltiplos hints podem ser fornecidos para definir múltiplas variáveis:

```
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off')
           SET_VAR(max_heap_table_size = 1G) */ 1;
```

Se houver várias dicas com o mesmo nome de variável na mesma declaração, a primeira é aplicada e as outras são ignoradas com um aviso:

```
SELECT /*+ SET_VAR(max_heap_table_size = 1G)
           SET_VAR(max_heap_table_size = 3G) */ 1;
```

Neste caso, o segundo indício é ignorado com um aviso de que ele está em conflito.

Uma dica `SET_VAR` é ignorada com um aviso se nenhuma variável do sistema tiver o nome especificado ou se o valor da variável estiver incorreto:

```
SELECT /*+ SET_VAR(max_size = 1G) */ 1;
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=yes') */ 1;
```

Para a primeira declaração, não há a variável `max_size`. Para a segunda declaração, `mrr_cost_based` assume valores de `on` ou `off`, portanto, tentar atribuir um valor de `yes` é incorreto. Em cada caso, o aviso é ignorado.

O `SET_VAR` é permitido apenas no nível da instrução. Se usado em uma subconsulta, o aviso é ignorado.

As réplicas ignoram os `SET_VAR` hints em declarações replicadas para evitar potenciais problemas de segurança.

#### Sintaxe de dica do grupo de recursos

A dica de otimização `RESOURCE_GROUP` é usada para a gestão de grupos de recursos (consulte a Seção 7.1.16, “Grupos de Recursos”). Essa dica atribui o thread que executa uma instrução ao grupo de recursos nomeado temporariamente (por toda a duração da instrução). Ela requer o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

Exemplos:

```
SELECT /*+ RESOURCE_GROUP(USR_default) */ name FROM people ORDER BY name;
INSERT /*+ RESOURCE_GROUP(Batch) */ INTO t2 VALUES(2);
```

Sintaxe da dica `RESOURCE_GROUP`:

```
RESOURCE_GROUP(group_name)
```

`group_name` indica o grupo de recursos ao qual o thread deve ser atribuído durante a execução da instrução. Se o grupo não existir, um aviso é exibido e o hint é ignorado.

O aviso `RESOURCE_GROUP` deve aparecer após a palavra-chave inicial do comando (`SELECT`, `INSERT`, `REPLACE`, `UPDATE` ou `DELETE`).

Uma alternativa ao comando `RESOURCE_GROUP` é o comando `SET RESOURCE GROUP`, que atribui temporariamente os threads a um grupo de recursos. Consulte a Seção 15.7.2.4, “Comando SET RESOURCE GROUP”.

#### Dicas de otimização para nomear blocos de consulta

As dicas de nível de tabela, nível de índice e subconsultas permitem que blocos de consulta específicos sejam nomeados como parte de sua sintaxe de argumento. Para criar esses nomes, use a dica `QB_NAME`, que atribui um nome ao bloco de consulta em que ocorre:

```
QB_NAME(name)
```

As dicas `QB_NAME` podem ser usadas para indicar de forma explícita e clara quais blocos de consulta aplicam-se a outros blocos de dicas. Elas também permitem que todas as dicas de nome de bloco que não sejam de consulta sejam especificadas em um único comentário de dica para facilitar a compreensão de declarações complexas. Considere a seguinte declaração:

```
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```

Os hints `QB_NAME` atribuem nomes aos blocos de consulta na declaração:

```
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

Em seguida, outros indicadores podem usar esses nomes para se referir aos blocos de consulta apropriados:

```
SELECT /*+ QB_NAME(qb1) MRR(@qb1 t1) BKA(@qb2) NO_MRR(@qb3t1 idx1, id2) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

O efeito resultante é o seguinte:

- `MRR(@qb1 t1)` se aplica à tabela `t1` no bloco de consulta `qb1`.

- `BKA(@qb2)` se aplica ao bloco de consulta `qb2`.

- `NO_MRR(@qb3 t1 idx1, id2)` se aplica aos índices `idx1` e `idx2` na tabela `t1` no bloco de consulta `qb3`.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 11.2, “Nomes de Objetos de Esquema”). Por exemplo, um nome de bloco de consulta que contém espaços deve ser citado, o que pode ser feito usando aspas:

```
SELECT /*+ BKA(@`my hint name`) */ ...
  FROM (SELECT /*+ QB_NAME(`my hint name`) */ ...) ...
```

Se o modo SQL `ANSI_QUOTES` estiver ativado, também é possível citar os nomes dos blocos de consulta entre aspas duplas:

```
SELECT /*+ BKA(@"my hint name") */ ...
  FROM (SELECT /*+ QB_NAME("my hint name") */ ...) ...
```
