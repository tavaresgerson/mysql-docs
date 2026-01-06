### 23.5.3 Visualizações atualizáveis e inseríveis

Algumas visualizações são atualizáveis e as referências a elas podem ser usadas para especificar as tabelas a serem atualizadas em declarações de alteração de dados. Ou seja, você pode usá-las em declarações como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Tabelas derivadas também podem ser especificadas em declarações `UPDATE` e `DELETE` de múltiplas tabelas, mas só podem ser usadas para ler dados para especificar linhas a serem atualizadas ou excluídas. Geralmente, as referências da visualização devem ser atualizáveis, o que significa que elas podem ser unidas e não materializadas. Visualizações compostas têm regras mais complexas.

Para que uma visualização seja atualizável, deve haver uma relação um-para-um entre as linhas da visualização e as linhas da tabela subjacente. Existem também certas outras construções que tornam uma visualização não atualizável. Para ser mais específico, uma visualização não é atualizável se contiver qualquer uma das seguintes:

- Funções agregadas (`SUM()`, `MIN()`, `MAX()`, `COUNT()`, e assim por diante)

- DISTINCT

- `GROUP BY`

- `HAVENDO`

- `UNÍON` ou `UNÍON TODO`

- Subconsulta na lista de seleção

  Antes do MySQL 5.7.11, as subconsultas na lista de seleção falhavam para `INSERT`, mas funcionavam bem para `UPDATE`, `DELETE`. A partir do MySQL 5.7.11, isso ainda é verdadeiro para subconsultas não dependentes. Para subconsultas dependentes na lista de seleção, não são permitidas declarações de alteração de dados.

- Certos junções (veja a discussão adicional sobre junções mais adiante nesta seção)

- Referência a uma visão não atualizável na cláusula `FROM`

- Subconsulta na cláusula `WHERE` que se refere a uma tabela na cláusula `FROM`

- Se refere apenas a valores literais (neste caso, não há uma tabela subjacente para atualizar)

- `ALGORITHM = TEMPTABLE` (o uso de uma tabela temporária torna a visual sempre não atualizável)

- Múltiplas referências a qualquer coluna de uma tabela base (falha para `INSERT`, ok para `UPDATE`, `DELETE`)

Uma coluna gerada em uma visualização é considerada atualizável porque é possível atribuir a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

Às vezes, é possível que uma visualização de múltiplas tabelas seja atualizável, desde que possa ser processada com o algoritmo `MERGE`. Para que isso funcione, a visualização deve usar uma junção interna (não uma junção externa ou uma `UNION`). Além disso, apenas uma única tabela na definição da visualização pode ser atualizada, então a cláusula `SET` deve nomear apenas colunas de uma das tabelas na visualização. Visualizações que usam `UNION ALL` não são permitidas, mesmo que possam ser teoricamente atualizáveis.

Em relação à insertibilidade (poder de atualização com instruções `INSERT`), uma visão atualizável é inserível se também atender a esses requisitos adicionais para as colunas da visão:

- Não pode haver nomes de colunas de visualização duplicados.

- A vista deve conter todas as colunas da tabela base que não têm um valor padrão.

- As colunas de visualização devem ser referências de coluna simples. Elas não podem ser expressões, como estas:

  ```sql
  3.14159
  col1 + 3
  UPPER(col2)
  col3 / col4
  (subquery)
  ```

O MySQL define uma bandeira, chamada de bandeira de atualizabilidade da visualização, no momento do `CREATE VIEW`. A bandeira é definida como `YES` (verdadeiro) se as operações `UPDATE` e `DELETE` (e operações semelhantes) forem legais para a visualização. Caso contrário, a bandeira é definida como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` do Schema de Informações exibe o status dessa bandeira.

Se uma visualização não for atualizável, declarações como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma visualização seja atualizável, pode não ser possível inseri-la nela, conforme descrito em outras partes desta seção.)

A bandeira `IS_UPDATABLE` pode não ser confiável se uma visualização depender de uma ou mais outras visualizações e uma dessas visualizações subjacentes for atualizada. Independentemente do valor `IS_UPDATABLE`, o servidor mantém o controle da atualizabilidade de uma visualização e rejeita corretamente as operações de alteração de dados para visualizações que não são atualizáveis. Se o valor `IS_UPDATABLE` para uma visualização se tornar impreciso devido a alterações em visualizações subjacentes, o valor pode ser atualizado excluindo e recriando a visualização.

A atualizabilidade das visualizações pode ser afetada pelo valor da variável de sistema `updatable_views_with_limit`. Consulte a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Para a discussão a seguir, vamos supor que essas tabelas e visualizações existam:

```sql
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

As instruções `INSERT`, `UPDATE` e `DELETE` são permitidas da seguinte forma:

- `INSERT`: A tabela de inserção de uma instrução `INSERT` pode ser uma referência de visualização que está sendo unificada. Se a visualização for uma visualização de junção, todos os componentes da visualização devem ser atualizáveis (não materializados). Para uma visualização atualizável de várias tabelas, o `INSERT` pode funcionar se ele inserir em uma única tabela.

  Esta declaração é inválida porque um componente da visualização de junção não é atualizável:

  ```sql
  INSERT INTO vjoin (c) VALUES (1);
  ```

  Esta declaração é válida; a vista não contém componentes materializados:

  ```sql
  INSERT INTO vup (c) VALUES (1);
  ```

- `ATUALIZAR`: A(s) tabela(s) a serem atualizadas em uma instrução `UPDATE` pode(m) ser referências de visualização que estão sendo unidas. Se uma visualização for uma visualização de junção, pelo menos um componente da visualização deve ser atualizável (isso difere de `INSERT`).

  Em uma declaração `UPDATE` de várias tabelas, as referências de tabela atualizadas da declaração devem ser tabelas base ou referências de visualização atualizáveis. As referências de tabela não atualizadas podem ser visualizações materializadas ou tabelas derivadas.

  Esta declaração é válida; a coluna `c` é da parte atualizável da vista de junção:

  ```sql
  UPDATE vjoin SET c=c+1;
  ```

  Esta declaração é inválida; a coluna `x` é da parte não atualizável:

  ```sql
  UPDATE vjoin SET x=x+1;
  ```

  Esta afirmação é válida; a referência de tabela atualizada da `UPDATE` de várias tabelas é uma visão atualizável (`vup`):

  ```sql
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET c=c+1;
  ```

  Esta declaração é inválida; ela tenta atualizar uma tabela derivada materializada:

  ```sql
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET s=s+1;
  ```

- `DELETE`: A(s) tabela(s) a serem excluídas em uma instrução `DELETE` deve(m) ser vistas unidas. Não são permitidas vistas de junção (isso difere de `INSERT` e `UPDATE`).

  Esta declaração é inválida porque a visualização é uma visualização de junção:

  ```sql
  DELETE vjoin WHERE ...;
  ```

  Esta declaração é válida porque a visualização é uma visualização unificada (atualizável):

  ```sql
  DELETE vup WHERE ...;
  ```

  Esta declaração é válida porque exclui de uma visão combinada (atualizável):

  ```sql
  DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;
  ```

Segue-se uma discussão adicional e exemplos.

A discussão anterior nesta seção apontou que uma visualização não pode ser inserida se não todas as colunas forem referências de coluna simples (por exemplo, se contiver colunas que são expressões ou expressões compostas). Embora uma tal visualização não possa ser inserida, ela pode ser atualizada se você atualizar apenas as colunas que não são expressões. Considere esta visualização:

```sql
CREATE VIEW v AS SELECT col1, 1 AS col2 FROM t;
```

Essa visão não pode ser inserida porque `col2` é uma expressão. No entanto, ela pode ser atualizada se a atualização não tentar atualizar `col2`. Essa atualização é permitida:

```sql
UPDATE v SET col1 = 0;
```

Esta atualização não é permitida porque tenta atualizar uma coluna de expressão:

```sql
UPDATE v SET col2 = 0;
```

Se uma tabela contiver uma coluna `AUTO_INCREMENT`, a inserção em uma visualização inserível na tabela que não inclui a coluna `AUTO_INCREMENT` não altera o valor de `LAST_INSERT_ID()`, porque os efeitos colaterais da inserção de valores padrão em colunas que não fazem parte da visualização não devem ser visíveis.
