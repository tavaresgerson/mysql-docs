### 27.5.3 Visualizações atualizáveis e inseríveis

Algumas visualizações são atualizáveis e as referências a elas podem ser usadas para especificar as tabelas a serem atualizadas em declarações de alteração de dados. Ou seja, você pode usá-las em declarações como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Tabelas derivadas e expressões de tabela comum também podem ser especificadas em declarações de múltiplas tabelas `UPDATE` e `DELETE`, mas só podem ser usadas para ler dados para especificar linhas a serem atualizadas ou excluídas. Geralmente, as referências da visualização devem ser atualizáveis, o que significa que elas podem ser unidas e não materializadas. Visualizações compostas têm regras mais complexas.

Para que uma visualização seja atualizável, deve haver uma relação um-para-um entre as linhas da visualização e as linhas da tabela subjacente. Existem também certas outras construções que tornam uma visualização não atualizável. Para ser mais específico, uma visualização não é atualizável se contiver qualquer uma das seguintes:

- Funções agregadas ou funções de janela (`SUM()`, `MIN()`, `MAX()`, `COUNT()` e assim por diante)

- `DISTINCT`

- `GROUP BY`

- `HAVING`

- `UNION` ou `UNION ALL`

- Subconsulta na lista de seleção

  As subconsultas não dependentes na lista de seleção falham para `INSERT`, mas estão bem para `UPDATE`, `DELETE`. Para as subconsultas dependentes na lista de seleção, não são permitidas declarações de alteração de dados.

- Certos junções (veja a discussão adicional sobre junções mais adiante nesta seção)

- Referência a uma visão não atualizável na cláusula `FROM`

- Subconsulta na cláusula `WHERE` que se refere a uma tabela na cláusula `FROM`

- Se refere apenas a valores literais (neste caso, não há uma tabela subjacente para atualizar)

- `ALGORITHM = TEMPTABLE` (o uso de uma tabela temporária torna a visualização sempre não atualizável)

- Múltiplas referências a qualquer coluna de uma tabela base (falha para `INSERT`, ok para `UPDATE`, `DELETE`)

Uma coluna gerada em uma visualização é considerada atualizável porque é possível atribuí-la. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

Às vezes, é possível que uma visualização de múltiplas tabelas seja atualizável, desde que possa ser processada com o algoritmo `MERGE`. Para que isso funcione, a visualização deve usar uma junção interna (não uma junção externa ou uma `UNION`). Além disso, apenas uma única tabela na definição da visualização pode ser atualizada, portanto, a cláusula `SET` deve nomear apenas colunas de uma das tabelas na visualização. Visualizações que usam `UNION ALL` não são permitidas, mesmo que possam ser teoricamente atualizáveis.

Em relação à insertibilidade (poder de atualização com declarações `INSERT`), uma visão atualizável é inserível se também atender a esses requisitos adicionais para as colunas da visão:

- Não pode haver nomes de colunas de visualização duplicados.

- A vista deve conter todas as colunas da tabela base que não têm um valor padrão.

- As colunas de visualização devem ser referências de coluna simples. Elas não podem ser expressões, como estas:

  ```
  3.14159
  col1 + 3
  UPPER(col2)
  col3 / col4
  (subquery)
  ```

O MySQL define uma bandeira, chamada de bandeira de atualizabilidade da visualização, no momento `CREATE VIEW`. A bandeira é definida como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) forem legais para a visualização. Caso contrário, a bandeira é definida como `NO` (falso). A coluna `IS_UPDATABLE` na tabela do Schema de Informações `VIEWS` exibe o status dessa bandeira. Isso significa que o servidor sempre sabe se uma visualização é atualizável.

Se uma visualização não for atualizável, declarações como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma visualização seja atualizável, pode não ser possível inseri-la nela, conforme descrito em outras partes desta seção.)

A atualizabilidade das visualizações pode ser afetada pelo valor da variável de sistema `updatable_views_with_limit`. Consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Para a discussão a seguir, vamos supor que essas tabelas e visualizações existam:

```
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

As declarações `INSERT`, `UPDATE` e `DELETE` são permitidas da seguinte forma:

- `INSERT`: A tabela de inserção de uma declaração `INSERT` pode ser uma referência de visualização que está sendo unificada. Se a visualização for uma visualização de junção, todos os componentes da visualização devem ser atualizáveis (não materializados). Para uma visualização atualizável de várias tabelas, `INSERT` pode funcionar se ela inserir em uma única tabela.

  Esta declaração é inválida porque um componente da visualização de junção não é atualizável:

  ```
  INSERT INTO vjoin (c) VALUES (1);
  ```

  Esta declaração é válida; a vista não contém componentes materializados:

  ```
  INSERT INTO vup (c) VALUES (1);
  ```

- `UPDATE`: A(s) tabela(s) a serem atualizadas em uma declaração `UPDATE` pode(m) ser referências de visualização que são unidas. Se uma visualização for uma visualização de junção, pelo menos um componente da visualização deve ser atualizável (isso difere de `INSERT`).

  Em uma declaração `UPDATE` de múltiplas tabelas, as referências de tabela atualizadas da declaração devem ser tabelas base ou referências de visualização atualizáveis. Referências de tabela não atualizadas podem ser visualizações materializadas ou tabelas derivadas.

  Esta declaração é válida; a coluna `c` é da parte atualizável da vista de junção:

  ```
  UPDATE vjoin SET c=c+1;
  ```

  Esta declaração é inválida; a coluna `x` é da parte não atualizável:

  ```
  UPDATE vjoin SET x=x+1;
  ```

  Esta declaração é válida; a referência da tabela atualizada do múltiplo `UPDATE` é uma visualização atualizável (`vup`):

  ```
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET c=c+1;
  ```

  Esta declaração é inválida; ela tenta atualizar uma tabela derivada materializada:

  ```
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET s=s+1;
  ```

- `DELETE`: A(s) tabela(s) a serem excluídas de uma declaração `DELETE` deve(m) ser vistas unidas. Não são permitidas vistas de junção (isso difere de `INSERT` e `UPDATE`).

  Esta declaração é inválida porque a visualização é uma visualização de junção:

  ```
  DELETE vjoin WHERE ...;
  ```

  Esta declaração é válida porque a visualização é uma visualização unificada (atualizável):

  ```
  DELETE vup WHERE ...;
  ```

  Esta declaração é válida porque exclui de uma visão combinada (atualizável):

  ```
  DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;
  ```

Segue-se uma discussão adicional e exemplos.

A discussão anterior nesta seção apontou que uma visualização não pode ser inserida se não todas as colunas forem referências de coluna simples (por exemplo, se contiver colunas que são expressões ou expressões compostas). Embora uma tal visualização não possa ser inserida, ela pode ser atualizada se você atualizar apenas as colunas que não são expressões. Considere esta visualização:

```
CREATE VIEW v AS SELECT col1, 1 AS col2 FROM t;
```

Essa visão não pode ser inserida porque `col2` é uma expressão. No entanto, ela pode ser atualizada se a atualização não tentar atualizar `col2`. Essa atualização é permitida:

```
UPDATE v SET col1 = 0;
```

Esta atualização não é permitida porque tenta atualizar uma coluna de expressão:

```
UPDATE v SET col2 = 0;
```

Se uma tabela contiver uma coluna `AUTO_INCREMENT`, inserir em uma visualizável inserível na tabela que não inclua a coluna `AUTO_INCREMENT` não altera o valor de `LAST_INSERT_ID()`, porque os efeitos colaterais de inserir valores padrão em colunas que não fazem parte da visualizável não devem ser visíveis.
