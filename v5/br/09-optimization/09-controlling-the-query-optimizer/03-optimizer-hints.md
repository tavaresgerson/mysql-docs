### 8.9.3 Dicas de otimização

Uma maneira de controlar as estratégias de otimização é definir a variável de sistema `optimizer_switch` (consulte a Seção 8.9.2, “Otimizações Desligáveis”). Alterações nesta variável afetam a execução de todas as consultas subsequentes; para alterar uma consulta de maneira diferente da outra, é necessário alterar `optimizer_switch` antes de cada uma.

Outra maneira de controlar o otimizador é usando dicas de otimizador, que podem ser especificadas dentro de declarações individuais. Como as dicas de otimizador são aplicadas por declaração, elas oferecem um controle mais preciso sobre os planos de execução das declarações do que o que pode ser alcançado usando `optimizer_switch`. Por exemplo, você pode habilitar uma otimização para uma tabela em uma declaração e desabilitar a otimização para uma tabela diferente. As dicas dentro de uma declaração têm precedência sobre os flags do `optimizer_switch`.

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

O cliente **mysql**, por padrão, remove comentários das instruções SQL enviadas ao servidor (incluindo dicas do otimizador) até o MySQL 5.7.7, quando foi alterado para enviar dicas do otimizador ao servidor. Para garantir que as dicas do otimizador não sejam removidas se você estiver usando uma versão mais antiga do cliente **mysql** com uma versão do servidor que entende dicas do otimizador, inicie o **mysql** com a opção `--comments`.

Os dicas de otimização, descritas aqui, diferem das dicas de índice, descritas na Seção 8.9.4, “Dicas de Índice”. As dicas de otimização e de índice podem ser usadas separadamente ou juntas.

- Visão geral do Dicas de otimização
- Sinal de dica do otimizador
- Dicas de otimização de nível de tabela
- Dicas do otimizador de nível de índice
- Dicas de otimização de subconsultas
- Dicas de otimização do tempo de execução de declarações
- Dicas de otimização para nomear blocos de consulta

#### Visão geral do Dicas de otimização

Os dicas do otimizador são aplicadas em diferentes níveis de escopo:

- Global: O indício afeta toda a declaração

- Bloco de consulta: O aviso afeta um bloco de consulta específico dentro de uma declaração

- Nível de tabela: O aviso afeta uma tabela específica dentro de um bloco de consulta

- Nível de índice: O indicador afeta um índice específico dentro de uma tabela

A tabela a seguir resume as dicas de otimização disponíveis, as estratégias de otimização que elas afetam e o escopo ou escopos em que elas se aplicam. Mais detalhes serão fornecidos mais adiante.

**Tabela 8.2 Sugestões de otimizador disponíveis**

<table summary="Nomeie, descreva e explique os contextos em que os otimizadores são aplicados."><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th scope="col">Nome do Sugestão</th> <th scope="col">Descrição</th> <th scope="col">Âmbito de aplicação</th> </tr></thead><tbody><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Dicas de otimização de nível de tabela">[[PH_HTML_CODE_<code>SEMIJOIN</code>]</a>,<a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Dicas de otimização de nível de tabela">[[PH_HTML_CODE_<code>SEMIJOIN</code>]</a></th> <td>Afeta o processamento de junção de acesso de chave em lote</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Dicas de otimização de nível de tabela">[[PH_HTML_CODE_<code>SUBQUERY</code>]</a>,<a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Dicas de otimização de nível de tabela">[[PH_HTML_CODE_<code>IN</code>]</a></th> <td>Afeta o processamento de junção de laço aninhado</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-execution-time" title="Dicas de otimização do tempo de execução de declarações">[[PH_HTML_CODE_<code>EXISTS</code>]</a></th> <td>Limites para a execução do tempo de declaração</td> <td>Global</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Dicas do otimizador de nível de índice">[[<code>MRR</code>]]</a>,<a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Dicas do otimizador de nível de índice">[[<code>NO_MRR</code>]]</a></th> <td>Afeta a otimização da leitura de Multi-Range</td> <td>Tabela, índice</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Dicas do otimizador de nível de índice">[[<code>NO_ICP</code>]]</a></th> <td>Afeta a otimização da condição do índice Pushdown</td> <td>Tabela, índice</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Dicas do otimizador de nível de índice">[[<code>NO_RANGE_OPTIMIZATION</code>]]</a></th> <td>Otimização da faixa de efeitos</td> <td>Tabela, índice</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-query-block-naming" title="Dicas de otimização para nomear blocos de consulta">[[<code>QB_NAME</code>]]</a></th> <td>Atribui nome ao bloco de consulta</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Dicas de otimização de subconsultas">[[<code>SEMIJOIN</code>]]</a>,<a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Dicas de otimização de subconsultas">[[<code>NO_BKA</code><code>SEMIJOIN</code>]</a></th> <td>estratégias semijoin</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Dicas de otimização de subconsultas">[[<code>SUBQUERY</code>]]</a></th> <td>Afeta as estratégias de subconsulta [[<code>IN</code>]]-a-[[<code>EXISTS</code>]] de materialização</td> <td>Bloco de consulta</td> </tr></tbody></table>

Desativar uma otimização impede que o otimizador a use. Habilitar uma otimização significa que o otimizador pode usar a estratégia se ela se aplicar à execução da instrução, não que o otimizador a use necessariamente.

#### Sinal de dica do otimizador

O MySQL suporta comentários em instruções SQL conforme descrito na Seção 9.6, “Comentários”. Os hints do otimizador devem ser especificados dentro dos comentários `/*+ ... */`. Ou seja, os hints do otimizador usam uma variante da sintaxe de comentário em estilo C `/* ... */`, com um caractere `+` após a sequência de abertura do comentário `/*`. Exemplos:

```sql
/*+ BKA(t1) */
/*+ BNL(t1, t2) */
/*+ NO_RANGE_OPTIMIZATION(t4 PRIMARY) */
/*+ QB_NAME(qb2) */
```

Espaços em branco são permitidos após o caractere `+`.

O analisador reconhece comentários de dicas de otimização após a palavra-chave inicial das instruções `SELECT`, `UPDATE`, `INSERT`, `REPLACE` e `DELETE`. As dicas são permitidas nesses contextos:

- No início das declarações de consulta e alteração de dados:

  ```sql
  SELECT /*+ ... */ ...
  INSERT /*+ ... */ ...
  REPLACE /*+ ... */ ...
  UPDATE /*+ ... */ ...
  DELETE /*+ ... */ ...
  ```

- No início dos blocos de consulta:

  ```sql
  (SELECT /*+ ... */ ... )
  (SELECT ... ) UNION (SELECT /*+ ... */ ... )
  (SELECT /*+ ... */ ... ) UNION (SELECT /*+ ... */ ... )
  UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  INSERT ... SELECT /*+ ... */ ...
  ```

- Em declarações hintables precedidas por `EXPLAIN`. Por exemplo:

  ```sql
  EXPLAIN SELECT /*+ ... */ ...
  EXPLAIN UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  ```

  A implicação é que você pode usar `EXPLAIN` para ver como as dicas do otimizador afetam os planos de execução. Use `SHOW WARNINGS` imediatamente após `EXPLAIN` para ver como as dicas são usadas. A saída `EXPLAIN` estendida exibida por um `SHOW WARNINGS` subsequente indica quais dicas foram usadas. As dicas ignoradas não são exibidas.

Um comentário de dica pode conter múltiplas dicas, mas um bloco de consulta não pode conter múltiplos comentários de dica. Isso é válido:

```sql
SELECT /*+ BNL(t1) BKA(t2) */ ...
```

Mas isso é inválido:

```sql
SELECT /*+ BNL(t1) */ /* BKA(t2) */ ...
```

Quando um comentário com dicas contém várias dicas, existe a possibilidade de duplicatas e conflitos. As seguintes diretrizes gerais se aplicam. Para tipos específicos de dicas, podem ser aplicadas regras adicionais, conforme indicado nas descrições das dicas.

- Dicas duplicadas: Para uma dica como `/*+ MRR(idx1) MRR(idx1) */`, o MySQL usa a primeira dica e emite uma mensagem de alerta sobre a dica duplicada.

- Dúvidas sobre dicas: Para uma dica como `/*+ MRR(idx1) NO_MRR(idx1) */`, o MySQL usa a primeira dica e emite uma advertência sobre a segunda dica conflitante.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 9.2, “Nomes de Objetos do Esquema”).

Os nomes de dicas, nomes de blocos de consulta e nomes de estratégias não são sensíveis ao caso. As referências a nomes de tabelas e índices seguem as regras habituais de sensibilidade ao caso do identificador (consulte a Seção 9.2.3, “Sensibilidade ao Caso do Identificador”).

#### Dicas de otimização de nível de tabela

Os dicas de nível de tabela afetam o uso dos algoritmos de processamento de junções de Bloco em Nexo (BNL) e Acesso a Chave em Batelada (BKA) (consulte a Seção 8.2.1.11, “Junções de Bloco em Nexo e Acesso a Chave em Batelada”). Esses tipos de dicas se aplicam a tabelas específicas ou a todas as tabelas de um bloco de consulta.

Sintaxe de dicas de nível de tabela:

```sql
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

A sintaxe refere-se a esses termos:

- *`hint_name`*: Esses nomes de dicas são permitidos:

  - `BKA`, `NO_BKA`: Ative ou desative o BKA para as tabelas especificadas.

  - `BNL`, `NO_BNL`: Ative ou desative o BNL para as tabelas especificadas.

  Nota

  Para usar uma dica BNL ou BKA para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve ser habilitado para todas as tabelas internas da junção externa.

- *`tbl_name`*: O nome de uma tabela usada na declaração. O hint se aplica a todas as tabelas que ele nomeia. Se o hint não nomear nenhuma tabela, ele se aplica a todas as tabelas do bloco de consulta em que ocorre.

  Se uma tabela tiver um alias, as dicas devem se referir ao alias, e não ao nome da tabela.

  Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.

- *`query_block_name`*: O bloco de consulta ao qual a dica se aplica. Se a dica não incluir o prefixo `@query_block_name`, a dica se aplica ao bloco de consulta no qual ela ocorre. Para a sintaxe `tbl_name@query_block_name`, a dica se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomear blocos de consulta.

Exemplos:

```sql
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
```

Uma dica de nível de tabela se aplica a tabelas que recebem registros de tabelas anteriores, não de tabelas de remetente. Considere esta declaração:

```sql
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

Se o otimizador optar por processar `t1` primeiro, ele aplica uma junção Bloco em Rede a `t2` armazenando as linhas de `t1` antes de começar a ler `t2`. Se o otimizador, em vez disso, optar por processar `t2` primeiro, o indicador não terá efeito porque `t2` é uma tabela de emissor.

#### Dicas do otimizador de nível de índice

Os índices de dicas afetam quais estratégias de processamento de índices o otimizador usa para tabelas ou índices específicos. Esses tipos de dicas afetam o uso do Pushdown de Condição de Índice (ICP), da Leitura de Múltiplos Intervalos (MRR) e das otimizações de intervalo (veja a Seção 8.2.1, “Otimizando Instruções SELECT”).

Sintaxe de dicas de nível de índice:

```sql
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

A sintaxe refere-se a esses termos:

- *`hint_name`*: Esses nomes de dicas são permitidos:

  - `MRR`, `NO_MRR`: Ative ou desative o MRR para a tabela ou índices especificados. As dicas de MRR só se aplicam a tabelas `InnoDB` e `MyISAM`.

  - `NO_ICP`: Desative o ICP para a tabela ou índices especificados. Por padrão, o ICP é uma estratégia de otimização candidata, portanto, não há indicação para ativá-lo.

  - `NO_RANGE_OPTIMIZATION`: Desative o acesso por intervalo de índice para a tabela ou índices especificados. Esse indicativo também desativa a Mesclagem de Índices e a Pesquisa de Índices Ligeros para a tabela ou índices. Por padrão, o acesso por intervalo é uma estratégia de otimização candidata, portanto, não há indicativo para ativá-lo.

    Essa dica pode ser útil quando o número de faixas pode ser alto e a otimização das faixas exigiria muitos recursos.

- *`tbl_name`*: A tabela à qual o hint se aplica.

- *`index_name`*: O nome de um índice na tabela nomeada. O hint se aplica a todos os índices que ele nomeia. Se o hint não nomear nenhum índice, ele se aplica a todos os índices na tabela.

  Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use `SHOW INDEX`.

- *`query_block_name`*: O bloco de consulta ao qual a dica se aplica. Se a dica não incluir o prefixo `@query_block_name`, a dica se aplica ao bloco de consulta no qual ela ocorre. Para a sintaxe `tbl_name@query_block_name`, a dica se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomear blocos de consulta.

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

#### Dicas de otimização de subconsultas

Os indicativos de subconsultas afetam se as transformações de junção parcial devem ser usadas e quais estratégias de junção parcial devem ser permitidas, e, quando as junções não são usadas, se as materializações de subconsultas ou as transformações `IN` para `EXISTS` devem ser utilizadas. Para obter mais informações sobre essas otimizações, consulte a Seção 8.2.2, “Otimizando subconsultas, tabelas derivadas e referências de visualizações”.

Sintaxe de dicas que afetam estratégias de junção parcial:

```sql
hint_name([@query_block_name] [strategy [, strategy] ...])
```

A sintaxe refere-se a esses termos:

- *`hint_name`*: Esses nomes de dicas são permitidos:

  - `SEMIJOIN`, `NO_SEMIJOIN`: Ative ou desative as estratégias de semijoin nomeadas.

- *`strategy`*: Uma estratégia de junção parcial para ser habilitada ou desabilitada. Esses nomes de estratégia são permitidos: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

  Para dicas de `SEMIJOIN`, se nenhuma estratégia for nomeada, o semijoin é usado, se possível, com base nas estratégias habilitadas de acordo com a variável de sistema `optimizer_switch`. Se as estratégias forem nomeadas, mas inapropriadas para a declaração, o `DUPSWEEDOUT` é usado.

  Para dicas `NO_SEMIJOIN`, se não houver estratégias nomeadas, o semijoin não é usado. Se houver estratégias nomeadas que excluam todas as estratégias aplicáveis à declaração, o `DUPSWEEDOUT` é usado.

Se uma subconsulta estiver aninhada em outra e ambas forem unidas em uma junção parcial de uma consulta externa, qualquer especificação de estratégias de junção parcial para a consulta mais interna será ignorada. Os hints `SEMIJOIN` e `NO_SEMIJOIN` ainda podem ser usados para habilitar ou desabilitar as transformações de junção parcial para essas subconsultas aninhadas.

Se o `DUPSWEEDOUT` estiver desativado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, o que pode ser evitado definindo `optimizer_prune_level=0`.

Exemplos:

```sql
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Sintaxe de dicas que afetam se deve usar materialização de subconsulta ou transformações `IN` para `EXISTS`:

```sql
SUBQUERY([@query_block_name] strategy)
```

O nome do indicador é sempre `SUBQUERY`.

Para dicas de `SUBQUERY`, esses valores de *`strategy`* são permitidos: `INTOEXISTS`, `MATERIALIZATION`.

Exemplos:

```sql
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

Para dicas de junção parcial e `SUBQUERY`, um caractere inicial `@query_block_name` especifica o bloco de consulta ao qual a dica se aplica. Se a dica não incluir um caractere inicial `@query_block_name`, a dica se aplica ao bloco de consulta em que ocorre. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomear blocos de consulta.

Se um comentário de dica contiver várias dicas de subconsulta, a primeira será usada. Se houver outras dicas desse tipo, elas produzirão uma mensagem de aviso. Dicas de outros tipos são ignoradas silenciosamente.

#### Dicas de otimização do tempo de execução de declarações

O hint `MAX_EXECUTION_TIME` é permitido apenas para instruções `SELECT`. Ele define um limite *`N`* (um valor de tempo de espera em milissegundos) para o tempo máximo que uma instrução pode ser executada antes de o servidor interromper:

```sql
MAX_EXECUTION_TIME(N)
```

Exemplo com um tempo de espera de 1 segundo (1000 milissegundos):

```sql
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

O hint `MAX_EXECUTION_TIME(N)` define um limite de tempo de execução de uma instrução de *`N`* milissegundos. Se esta opção estiver ausente ou se `N` for 0, o limite de tempo de execução da instrução estabelecido pela variável de sistema `max_execution_time` será aplicado.

O hint `MAX_EXECUTION_TIME` é aplicável da seguinte forma:

- Para declarações com múltiplas palavras-chave `SELECT`, como uniões ou declarações com subconsultas, o `MAX_EXECUTION_TIME` se aplica a toda a declaração e deve aparecer após a primeira `SELECT`.

- Isso se aplica a instruções `SELECT` somente de leitura. As instruções que não são somente de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

- Não se aplica a instruções `SELECT` em programas armazenados e é ignorado.

#### Dicas de otimização para nomear blocos de consulta

As dicas de otimização de nível de tabela, de nível de índice e de subconsulta permitem que blocos de consulta específicos sejam nomeados como parte de sua sintaxe de argumento. Para criar esses nomes, use a dica `QB_NAME`, que atribui um nome ao bloco de consulta em que ocorre:

```sql
QB_NAME(name)
```

As dicas `QB_NAME` podem ser usadas para indicar de forma clara quais blocos de consulta aplicam-se a outras dicas. Elas também permitem que todas as dicas de nomes de blocos que não sejam de consulta sejam especificadas em um único comentário de dica para facilitar a compreensão de declarações complexas. Considere a seguinte declaração:

```sql
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```

Os hints `QB_NAME` atribuem nomes aos blocos de consulta na declaração:

```sql
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

Em seguida, outros indicadores podem usar esses nomes para se referir aos blocos de consulta apropriados:

```sql
SELECT /*+ QB_NAME(qb1) MRR(@qb1 t1) BKA(@qb2) NO_MRR(@qb3t1 idx1, id2) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

O efeito resultante é o seguinte:

- `MRR(@qb1 t1)` se aplica à tabela `t1` no bloco de consulta `qb1`.

- `BKA(@qb2)` se aplica ao bloco de consulta `qb2`.

- `NO_MRR(@qb3 t1 idx1, id2)` se aplica aos índices `idx1` e `idx2` na tabela `t1` no bloco de consulta `qb3`.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 9.2, “Nomes de Objetos de Esquema”). Por exemplo, um nome de bloco de consulta que contém espaços deve ser citado, o que pode ser feito usando aspas:

```sql
SELECT /*+ BKA(@`my hint name`) */ ...
  FROM (SELECT /*+ QB_NAME(`my hint name`) */ ...) ...
```

Se o modo `ANSI_QUOTES` do SQL estiver ativado, também é possível citar os nomes dos blocos de consulta entre aspas duplas:

```sql
SELECT /*+ BKA(@"my hint name") */ ...
  FROM (SELECT /*+ QB_NAME("my hint name") */ ...) ...
```
