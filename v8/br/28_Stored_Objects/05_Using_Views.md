## 27.5 Usando Visualizações

O MySQL suporta vistas, incluindo vistas atualizáveis. As vistas são consultas armazenadas que, quando invocadas, produzem um conjunto de resultados. Uma vista atua como uma tabela virtual.

A discussão a seguir descreve a sintaxe para criar e descartar visualizações e mostra alguns exemplos de como usá-las.

### Recursos adicionais

* Você pode achar os [Fóruns de Usuários do MySQL][(https://forums.mysql.com/list.php?20)] úteis ao trabalhar com visualizações.

* Para respostas a algumas perguntas comumente feitas sobre vistas no MySQL, consulte a Seção A.6, “Perguntas frequentes do MySQL 8.0: Vistas”.

* Há algumas restrições sobre o uso de visualizações; consulte a Seção 27.9, “Restrições sobre visualizações”.

### 27.5.1 Sintaxe de visualização

A declaração `CREATE VIEW` cria uma nova visualização (consulte Seção 15.1.23, “Declaração CREATE VIEW”). Para alterar a definição de uma visualização ou descartar uma visualização, use `ALTER VIEW` (consulte Seção 15.1.11, “Declaração ALTER VIEW”), ou `DROP VIEW`(drop-view.html "15.1.35 DROP VIEW Statement") (consulte Seção 15.1.35, “Declaração DROP VIEW”).

Uma visão pode ser criada a partir de muitos tipos de declarações `SELECT`. Ela pode se referir a tabelas base ou outras visões. Ela pode usar junções, `UNION` e subconsultas. A `SELECT` não precisa nem mesmo se referir a nenhuma tabela. O exemplo a seguir define uma visão que seleciona duas colunas de outra tabela, bem como uma expressão calculada a partir dessas colunas:

```
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50), (5, 60);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
|    5 |    60 |   300 |
+------+-------+-------+
mysql> SELECT * FROM v WHERE qty = 5;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    5 |    60 |   300 |
+------+-------+-------+
```

### 27.5.2 Algoritmos de Processamento de Visualização

A cláusula opcional `ALGORITHM` para `CREATE VIEW` ou `ALTER VIEW` é uma extensão do MySQL ao SQL padrão. Ela afeta a forma como o MySQL processa a visão. `ALGORITHM` recebe três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`.

* Para `MERGE`, o texto de uma declaração que se refere à visão e à definição da visão são fundidos de tal forma que partes da definição da visão substituem partes correspondentes da declaração.

* Para `TEMPTABLE`, os resultados da consulta são recuperados em uma tabela temporária, que é então usada para executar a declaração.

* Para `UNDEFINED`, o MySQL escolhe qual algoritmo usar. Ele prefere `MERGE` sobre `TEMPTABLE` se possível, porque `MERGE` geralmente é mais eficiente e porque uma visão não pode ser atualizada se uma tabela temporária for usada.

* Se não houver uma cláusula `ALGORITHM`, o algoritmo padrão é determinado pelo valor da bandeira `derived_merge` da variável de sistema `optimizer_switch`. Para uma discussão adicional, consulte [Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visão e expressões de tabela comum com fusão ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")].

Uma razão para especificar explicitamente `TEMPTABLE` é que as chaves podem ser liberadas em tabelas subjacentes após a criação da tabela temporária e antes de ser usada para finalizar o processamento da declaração. Isso pode resultar em liberação de bloqueio mais rápida do que o algoritmo `MERGE`, de modo que outros clientes que utilizam a visão não sejam bloqueados por tanto tempo.

Um algoritmo de visão pode ser `UNDEFINED` por três razões:

* Não há cláusula `ALGORITHM` na declaração `CREATE VIEW`.

* A declaração `CREATE VIEW` possui uma cláusula explícita `ALGORITHM = UNDEFINED`.

* `ALGORITHM = MERGE` é especificado para uma visão que pode ser processada apenas com uma tabela temporária. Neste caso, o MySQL gera um aviso e define o algoritmo para `UNDEFINED`.

Como mencionado anteriormente, `MERGE` é tratado pela fusão de partes correspondentes de uma definição de visão na declaração que se refere à visão. Os exemplos seguintes ilustram brevemente como o algoritmo `MERGE` funciona. Os exemplos assumem que existe uma visão `v_merge` que tem esta definição:

```
CREATE ALGORITHM = MERGE VIEW v_merge (vc1, vc2) AS
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 1: Suponha que façamos essa declaração:

```
SELECT * FROM v_merge;
```

O MySQL trata a declaração da seguinte forma:

* `v_merge` se torna `t`
* `*` se torna `vc1, vc2`, que corresponde a `c1, c2`

* A cláusula de visão `WHERE` é adicionada

A declaração resultante a ser executada se torna:

```
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Exemplo 2: Suponha que façamos essa declaração:

```
SELECT * FROM v_merge WHERE vc1 < 100;
```

Essa declaração é tratada de maneira semelhante à anterior, exceto que `vc1 < 100` se torna `c1 < 100` e a cláusula de visão `WHERE` é adicionada à cláusula `WHERE` usando um conectivo `AND` (e parênteses são adicionados para garantir que as partes da cláusula sejam executadas com a precedência correta). A declaração resultante a ser executada se torna:

```
SELECT c1, c2 FROM t WHERE (c3 > 100) AND (c1 < 100);
```

Efetivamente, a declaração a ser executada possui uma cláusula `WHERE` da seguinte forma:

```
WHERE (select WHERE) AND (view WHERE)
```

Se o algoritmo `MERGE` não puder ser utilizado, uma tabela temporária deve ser usada em vez disso. Os construtos que impedem a fusão são os mesmos que os que impedem a fusão em tabelas derivadas e expressões de tabela comuns. Exemplos são `SELECT DISTINCT` ou `LIMIT` na subconsulta. Para detalhes, consulte [Seção 10.2.2.4, “Otimizando Tabelas Derivadas, Referências de Visualização e Expressões de Tabela Comuns com Fusão ou Materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")].

### 27.5.3 Visões Atualizáveis e Inseríveis

Algumas visualizações são atualizáveis e as referências a elas podem ser usadas para especificar as tabelas que devem ser atualizadas em declarações de mudança de dados. Isso significa que você pode usá-las em declarações como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Tabelas derivadas e expressões de tabela comum também podem ser especificadas em declarações de múltiplas tabelas `UPDATE` e `DELETE`, mas só podem ser usadas para leitura de dados para especificar linhas que devem ser atualizadas ou excluídas. Geralmente, as referências da visualização devem ser atualizáveis, o que significa que elas podem ser unidas e não materializadas. Visões compostas têm regras mais complexas.

Para que uma visão seja atualizável, deve haver uma relação um-a-um entre as linhas da visão e as linhas da tabela subjacente. Existem também certos outros construtos que tornam uma visão não atualizável. Para ser mais específico, uma visão não é atualizável se contiver qualquer uma das seguintes:

* Funções agregadas ou funções de janela (`SUM()`, `MIN()`, `MAX()`, `COUNT()`, e assim por diante)

* `DISTINCT`
* `GROUP BY`
* `HAVING`
* `UNION` ou `UNION ALL`

* Subconsulta na lista de seleção

As subconsultas não dependentes na lista de seleção falham para `INSERT`, mas estão bem para `UPDATE`, `DELETE`. Para as subconsultas dependentes na lista de seleção, não são permitidas declarações de mudança de dados.

* Certos junções (consulte a discussão adicional sobre junções mais adiante nesta seção)

* Referência a visão não atualizável na cláusula `FROM`

* Subconsulta na cláusula `WHERE` que se refere a uma tabela na cláusula `FROM`

* Se refere apenas a valores literais (neste caso, não há uma tabela subjacente a ser atualizada)

* `ALGORITHM = TEMPTABLE` (o uso de uma tabela temporária sempre torna uma visão não atualizável)

* Múltiplas referências a qualquer coluna de uma tabela de base (não funciona para `INSERT`, ok para `UPDATE`, `DELETE`)

Uma coluna gerada em uma visualização é considerada atualizável, pois é possível atribuí-la. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

Às vezes, é possível que uma visão de múltiplas tabelas seja atualizável, assumindo que ela pode ser processada com o algoritmo `MERGE`. Para que isso funcione, a visão deve usar uma junção interna (não uma junção externa ou uma `UNION`). Além disso, apenas uma única tabela na definição da visão pode ser atualizada, então a cláusula `SET` deve nomear apenas colunas de uma das tabelas na visão. Visões que usam `UNION ALL` não são permitidas, embora possam ser teoricamente atualizáveis.

Em relação à insertibilidade (poder de atualização com declarações `INSERT`), uma visão atualizável é inserível se também atender a esses requisitos adicionais para as colunas da visão:

* Não pode haver nomes de colunas de visualização duplicados. * A visualização deve conter todas as colunas da tabela base que não têm um valor padrão.

* As colunas de visão devem ser referências de coluna simples. Elas não podem ser expressões, como estas:

  ```
  3.14159
  col1 + 3
  UPPER(col2)
  col3 / col4
  (subquery)
  ```

O MySQL define uma bandeira, chamada de bandeira de atualizabilidade de visão, no momento `CREATE VIEW`. A bandeira é definida como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) são legais para a visão. Caso contrário, a bandeira é definida como `NO` (falso). A coluna `IS_UPDATABLE` na tabela Schema de Informações `VIEWS` exibe o status desta bandeira. Isso significa que o servidor sempre sabe se uma visão é atualizável.

Se uma visão não for atualizável, declarações como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma visão seja atualizável, pode não ser possível inseri-la nela, conforme descrito em outras partes desta seção.)

A atualizabilidade das visualizações pode ser afetada pelo valor da variável de sistema `updatable_views_with_limit`. Consulte a Seção 7.1.8, “Variáveis do sistema do servidor”.

Para a discussão a seguir, vamos supor que essas tabelas e visualizações existam:

```
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

As declarações `INSERT`, `UPDATE` e `DELETE` são permitidas conforme a seguir:

* `INSERT`: A tabela de inserção de uma declaração `INSERT` pode ser uma referência de visão que é mesclada. Se a visão for uma visão de junção, todos os componentes da visão devem ser atualizáveis (não materializados). Para uma visão atualizável de várias tabelas, `INSERT` pode funcionar se for inserida em uma única tabela.

Essa declaração é inválida porque um componente da visão de junção não é atualizável:

  ```
  INSERT INTO vjoin (c) VALUES (1);
  ```

Essa declaração é válida; a visão não contém componentes materializados:

  ```
  INSERT INTO vup (c) VALUES (1);
  ```

* `UPDATE`: A tabela ou tabelas a serem atualizadas em uma declaração `UPDATE` podem ser referências de visualização que são unidas. Se uma visualização for uma visualização de junção, pelo menos um componente da visualização deve ser atualizável (isso difere de `INSERT`).

Em uma declaração múltipla de tabela `UPDATE`, as referências de tabela atualizadas da declaração devem ser tabelas de base ou referências de visão atualizável. As referências de tabela não atualizadas podem ser vistas materializadas ou tabelas derivadas.

Essa declaração é válida; a coluna `c` é da parte atualizável da vista de junção:

  ```
  UPDATE vjoin SET c=c+1;
  ```

Essa declaração é inválida; a coluna `x` é da parte não atualizável:

  ```
  UPDATE vjoin SET x=x+1;
  ```

Essa declaração é válida; a referência de tabela atualizada do múltiplo `UPDATE` é uma visão atualizável (`vup`):

  ```
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET c=c+1;
  ```

Essa declaração é inválida; ela tenta atualizar uma tabela derivada materializada:

  ```
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET s=s+1;
  ```

* `DELETE`: A tabela ou tabelas que devem ser excluídas em uma declaração `DELETE` devem ser vistas unidas. Não são permitidas junções de vistas (isso difere de `INSERT` e `UPDATE`).

Essa declaração é inválida porque a visão é uma visão de junção:

  ```
  DELETE vjoin WHERE ...;
  ```

Essa declaração é válida porque a visão é uma visão unificada (atualizável):

  ```
  DELETE vup WHERE ...;
  ```

Essa declaração é válida porque exclui de uma visão combinada (atualizável):

  ```
  DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;
  ```

Segue-se uma discussão adicional e exemplos.

A discussão anterior nesta seção apontou que uma visão não pode ser inserida se não todas as colunas forem referências de coluna simples (por exemplo, se contiver colunas que são expressões ou expressões compostas). Embora essa visão não possa ser inserida, ela pode ser atualizável se você atualizar apenas as colunas que não são expressões. Considere esta visão:

```
CREATE VIEW v AS SELECT col1, 1 AS col2 FROM t;
```

Essa visão não pode ser inserida porque `col2` é uma expressão. Mas ela pode ser atualizada se a atualização não tentar atualizar `col2`. Essa atualização é permitida:

```
UPDATE v SET col1 = 0;
```

Essa atualização não é permitida porque tenta atualizar uma coluna de expressão:

```
UPDATE v SET col2 = 0;
```

Se uma tabela contiver uma coluna `AUTO_INCREMENT`, inserir em uma visão inserível na tabela que não inclui a coluna `AUTO_INCREMENT` não altera o valor de `LAST_INSERT_ID()`, porque os efeitos colaterais de inserir valores padrão em colunas que não fazem parte da visão não devem ser visíveis.

### 27.5.4 A cláusula de opção de visualização com verificação

A cláusula `WITH CHECK OPTION` pode ser aplicada em uma visão atualizável para impedir inserções em linhas para as quais a cláusula `WHERE` no *`select_statement`* não é verdadeira. Ela também impede atualizações em linhas para as quais a cláusula `WHERE` é verdadeira, mas a atualização causaria que ela não fosse verdadeira (em outras palavras, ela impede que linhas visíveis sejam atualizadas para linhas não visíveis).

Em uma cláusula `WITH CHECK OPTION` para uma visão atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo dos testes de verificação quando a visão é definida em termos de outra visão. Quando nenhuma dessas palavras-chave é dada, o padrão é `CASCADED`.

O teste `WITH CHECK OPTION` é compatível com normas padrão:

* Com `LOCAL`, a cláusula de visão `WHERE` é verificada, verificando recursivamente as vistas subjacentes e aplicando as mesmas regras.

* Com `CASCADED`, a cláusula de visão `WHERE` é verificada, em seguida, verificando recursivamente as vistas subjacentes, adiciona `WITH CASCADED CHECK OPTION` a elas (para fins de verificação; suas definições permanecem inalteradas) e aplica as mesmas regras.

* Sem opção de verificação, a cláusula da vista `WHERE` não é verificada, então a verificação recursívamente aos pontos de vista subjacentes e aplica as mesmas regras.

Considere as definições para a tabela e o conjunto de visualizações a seguir:

```
CREATE TABLE t1 (a INT);
CREATE VIEW v1 AS SELECT * FROM t1 WHERE a < 2
WITH CHECK OPTION;
CREATE VIEW v2 AS SELECT * FROM v1 WHERE a > 0
WITH LOCAL CHECK OPTION;
CREATE VIEW v3 AS SELECT * FROM v1 WHERE a > 0
WITH CASCADED CHECK OPTION;
```

Aqui, as visões `v2` e `v3` são definidas em termos de outra visão, `v1`.

Os insertos para `v2` são verificados contra sua opção de verificação `LOCAL`, então a verificação recurs ao `v1` e as regras são aplicadas novamente. As regras para `v1` causam um fracasso na verificação. A verificação para `v3` também falha:

```
mysql> INSERT INTO v2 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v2'
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```

### 27.5.5 Visualizar Metadados

Para obter metadados sobre visualizações:

* Consulte a tabela `VIEWS` do banco de dados `INFORMATION_SCHEMA`. Veja a Seção 28.3.48, “A tabela VIEWS do INFORMATION_SCHEMA”.

* Utilize a declaração `SHOW CREATE VIEW`. Veja a Seção 15.7.7.13, “Declaração SHOW CREATE VIEW”.