### 23.5.3 Views Atualizáveis e Inseríveis

Algumas views são atualizáveis, e referências a elas podem ser usadas para especificar tabelas a serem atualizadas em instruções de mudança de dados. Ou seja, você pode usá-las em instruções como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Tabelas derivadas também podem ser especificadas em instruções `UPDATE` e `DELETE` de múltiplas tabelas, mas só podem ser usadas para leitura de dados, a fim de especificar linhas a serem atualizadas ou excluídas. Geralmente, as referências de view devem ser atualizáveis, o que significa que podem ser submetidas ao algoritmo MERGE e não materializadas. Views compostas possuem regras mais complexas.

Para que uma view seja atualizável, deve haver um relacionamento um-para-um entre as linhas na view e as linhas na tabela subjacente. Existem também outras construções que tornam uma view não atualizável. Mais especificamente, uma view não é atualizável se contiver algum dos seguintes elementos:

* Funções de agregação (`SUM()`, `MIN()`, `MAX()`, `COUNT()`, etc.)

* `DISTINCT`
* `GROUP BY`
* `HAVING`
* `UNION` ou `UNION ALL`

* Subquery na lista SELECT

  Antes do MySQL 5.7.11, subqueries na lista SELECT falhavam para `INSERT`, mas eram aceitas para `UPDATE`, `DELETE`. A partir do MySQL 5.7.11, isso ainda é verdade para subqueries não dependentes. Para subqueries dependentes na lista SELECT, nenhuma instrução de alteração de dados é permitida.

* Certos JOINs (veja a discussão adicional sobre JOINs mais adiante nesta seção)

* Referência a view não atualizável na cláusula `FROM`

* Subquery na cláusula `WHERE` que se refere a uma tabela na cláusula `FROM`

* Refere-se apenas a valores literais (neste caso, não há tabela subjacente para atualizar)

* `ALGORITHM = TEMPTABLE` (o uso de uma tabela temporária sempre torna a view não atualizável)

* Múltiplas referências a qualquer coluna de uma tabela base (falha para `INSERT`, aceita para `UPDATE`, `DELETE`)

Uma coluna gerada em uma view é considerada atualizável porque é possível atribuir a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

Às vezes, é possível que uma view de múltiplas tabelas seja atualizável, presumindo que ela possa ser processada com o algoritmo `MERGE`. Para que isso funcione, a view deve usar um inner JOIN (não um outer JOIN ou um `UNION`). Além disso, apenas uma única tabela na definição da view pode ser atualizada, então a cláusula `SET` deve nomear apenas colunas de uma das tabelas na view. Views que usam `UNION ALL` não são permitidas, mesmo que possam ser teoricamente atualizáveis.

Em relação à inseribilidade (ser atualizável com instruções `INSERT`), uma view atualizável é inserível se também satisfizer estes requisitos adicionais para as colunas da view:

* Não deve haver nomes de colunas duplicados na view.
* A view deve conter todas as colunas na tabela base que não possuem um valor `DEFAULT`.

* As colunas da view devem ser referências de coluna simples. Elas não devem ser expressões, como estas:

  ```sql
  3.14159
  col1 + 3
  UPPER(col2)
  col3 / col4
  (subquery)
  ```

O MySQL define um flag, chamado flag de atualizabilidade da view, no momento do `CREATE VIEW`. O flag é definido como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) forem legais para a view. Caso contrário, o flag é definido como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` do Information Schema exibe o status deste flag.

Se uma view não for atualizável, instruções como `UPDATE`, `DELETE` e `INSERT` são ilegais e rejeitadas. (Mesmo que uma view seja atualizável, pode não ser possível inserir dados nela, conforme descrito em outra parte desta seção.)

O flag `IS_UPDATABLE` pode não ser confiável se uma view depender de uma ou mais outras views, e uma dessas views subjacentes for atualizada. Independentemente do valor de `IS_UPDATABLE`, o servidor rastreia a atualizabilidade de uma view e rejeita corretamente as operações de alteração de dados em views que não são atualizáveis. Se o valor de `IS_UPDATABLE` para uma view se tornar impreciso devido a alterações nas views subjacentes, o valor pode ser atualizado excluindo e recriando a view.

A atualizabilidade das views pode ser afetada pelo valor da variável de sistema `updatable_views_with_limit`. Consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”.

Para a discussão a seguir, suponha que estas tabelas e views existam:

```sql
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

As instruções `INSERT`, `UPDATE` e `DELETE` são permitidas da seguinte forma:

* `INSERT`: A tabela de inserção de uma instrução `INSERT` pode ser uma referência de view que é submetida ao algoritmo MERGE. Se a view for uma view JOIN, todos os componentes da view devem ser atualizáveis (não materializados). Para uma view atualizável de múltiplas tabelas, `INSERT` pode funcionar se inserir em uma única tabela.

  Esta instrução é inválida porque um componente da view JOIN não é atualizável:

  ```sql
  INSERT INTO vjoin (c) VALUES (1);
  ```

  Esta instrução é válida; a view não contém componentes materializados:

  ```sql
  INSERT INTO vup (c) VALUES (1);
  ```

* `UPDATE`: A tabela ou tabelas a serem atualizadas em uma instrução `UPDATE` podem ser referências de view que são submetidas ao algoritmo MERGE. Se uma view for uma view JOIN, pelo menos um componente da view deve ser atualizável (isso difere do `INSERT`).

  Em uma instrução `UPDATE` de múltiplas tabelas, as referências de tabela atualizadas da instrução devem ser tabelas base ou referências de view atualizáveis. Referências de tabela não atualizadas podem ser views materializadas ou tabelas derivadas.

  Esta instrução é válida; a coluna `c` é da parte atualizável da view JOIN:

  ```sql
  UPDATE vjoin SET c=c+1;
  ```

  Esta instrução é inválida; a coluna `x` é da parte não atualizável:

  ```sql
  UPDATE vjoin SET x=x+1;
  ```

  Esta instrução é válida; a referência de tabela atualizada do `UPDATE` de múltiplas tabelas é uma view atualizável (`vup`):

  ```sql
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET c=c+1;
  ```

  Esta instrução é inválida; ela tenta atualizar uma tabela derivada materializada:

  ```sql
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET s=s+1;
  ```

* `DELETE`: A tabela ou tabelas a serem excluídas em uma instrução `DELETE` devem ser views submetidas ao algoritmo MERGE. Views JOIN não são permitidas (isso difere de `INSERT` e `UPDATE`).

  Esta instrução é inválida porque a view é uma view JOIN:

  ```sql
  DELETE vjoin WHERE ...;
  ```

  Esta instrução é válida porque a view é uma view submetida ao algoritmo MERGE (atualizável):

  ```sql
  DELETE vup WHERE ...;
  ```

  Esta instrução é válida porque exclui dados de uma view submetida ao algoritmo MERGE (atualizável):

  ```sql
  DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;
  ```

Seguem discussões e exemplos adicionais.

A discussão anterior nesta seção apontou que uma view não é inserível se nem todas as colunas forem referências de coluna simples (por exemplo, se contiver colunas que são expressões ou expressões compostas). Embora tal view não seja inserível, ela pode ser atualizável se você atualizar apenas colunas que não são expressões. Considere esta view:

```sql
CREATE VIEW v AS SELECT col1, 1 AS col2 FROM t;
```

Esta view não é inserível porque `col2` é uma expressão. Mas ela é atualizável se o `UPDATE` não tentar atualizar `col2`. Este `UPDATE` é permitido:

```sql
UPDATE v SET col1 = 0;
```

Este `UPDATE` não é permitido porque tenta atualizar uma coluna de expressão:

```sql
UPDATE v SET col2 = 0;
```

Se uma tabela contiver uma coluna `AUTO_INCREMENT`, a inserção em uma view inserível nessa tabela que não inclui a coluna `AUTO_INCREMENT` não altera o valor de `LAST_INSERT_ID()`, porque os efeitos colaterais da inserção de valores `DEFAULT` em colunas que não fazem parte da view não devem ser visíveis.