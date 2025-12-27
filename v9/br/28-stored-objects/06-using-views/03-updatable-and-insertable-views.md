### 27.6.3 Visualizações Atualizáveis e Inseríveis

Algumas visualizações são atualizáveis e as referências a elas podem ser usadas para especificar tabelas a serem atualizadas em declarações de alteração de dados. Isso significa que você pode usá-las em declarações como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Tabelas derivadas e expressões de tabela comuns também podem ser especificadas em declarações `UPDATE` e `DELETE` de múltiplas tabelas, mas só podem ser usadas para ler dados para especificar linhas a serem atualizadas ou excluídas. Geralmente, as referências da visão devem ser atualizáveis, o que significa que elas podem ser unidas e não materializadas. Visualizações compostas têm regras mais complexas.

Para que uma visão seja atualizável, deve haver uma relação um-para-um entre as linhas da visão e as linhas da tabela subjacente. Há também certas outras construções que tornam uma visão não atualizável. Para ser mais específico, uma visão não é atualizável se contiver qualquer uma das seguintes:

* Funções agregadas ou funções de janela (`SUM()`, `MIN()`, `MAX()`, `COUNT()` e assim por diante)
* `DISTINCT`
* `GROUP BY`
* `HAVING`
* `UNION` ou `UNION ALL`
* Subconsulta na lista de seleção

Subconsultas não dependentes na lista de seleção falham para `INSERT`, mas estão bem para `UPDATE`, `DELETE`. Para subconsultas dependentes na lista de seleção, nenhuma declaração de alteração de dados é permitida.
* Certos junções (veja a discussão adicional sobre junções mais adiante nesta seção)
* Referência a uma visão não atualizável na cláusula `FROM`
* Subconsulta na cláusula `WHERE` que se refere a uma tabela na cláusula `FROM`
* Refere-se apenas a valores literais (neste caso, não há tabela subjacente para atualizar)
* `ALGORITHM = TEMPTABLE` (o uso de uma tabela temporária sempre torna uma visão não atualizável)
* Múltiplas referências a qualquer coluna de uma tabela base (falha para `INSERT`, está bem para `UPDATE`, `DELETE`)

Uma coluna gerada em uma visualização é considerada atualizável porque é possível atribuir a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte a Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”.

Às vezes, é possível que uma visualização de várias tabelas seja atualizável, assumindo que ela pode ser processada com o algoritmo `MERGE`. Para que isso funcione, a visualização deve usar uma junção interna (não uma junção externa ou uma `UNION`). Além disso, apenas uma única tabela na definição da visualização pode ser atualizada, então a cláusula `SET` deve nomear apenas colunas de uma das tabelas na visualização. Visualizações que usam `UNION ALL` não são permitidas, mesmo que possam ser teoricamente atualizáveis.

Em relação à insertabilidade (ser atualizável com instruções `INSERT`), uma visualização atualizável é inserível se também atender a esses requisitos adicionais para as colunas da visualização:

* Não deve haver nomes de colunas da visualização duplicados.
* A visualização deve conter todas as colunas da tabela base que não têm um valor padrão.

* As colunas da visualização devem ser referências de coluna simples. Elas não devem ser expressões, como estas:

  ```
  3.14159
  col1 + 3
  UPPER(col2)
  col3 / col4
  (subquery)
  ```

O MySQL define um sinalizador, chamado sinalizador de atualizabilidade da visualização, no momento da criação da visualização. O sinalizador é definido como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) forem legais para a visualização. Caso contrário, o sinalizador é definido como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` do Schema de Informações exibe o status desse sinalizador. Isso significa que o servidor sempre sabe se uma visualização é atualizável.

Se uma visualização não for atualizável, instruções como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma visualização seja atualizável, pode não ser possível inseri-la nela, como descrito em outras partes desta seção.)

A atualizabilidade das visualizações pode ser afetada pelo valor da variável de sistema `updatable_views_with_limit`. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Para a discussão a seguir, vamos supor que essas tabelas e visualizações existam:

```
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

As instruções `INSERT`, `UPDATE` e `DELETE` são permitidas da seguinte forma:

* `INSERT`: A tabela de inserção de uma instrução `INSERT` pode ser uma referência de visualização que é mesclada. Se a visualização for uma visualização de junção, todos os componentes da visualização devem ser atualizáveis (não materializados). Para uma visualização atualizável de múltiplas tabelas, a instrução `INSERT` pode funcionar se inserir em uma única tabela.

Esta instrução é inválida porque um componente da visualização de junção é não atualizável:

```
  INSERT INTO vjoin (c) VALUES (1);
  ```

Esta instrução é válida; a visualização não contém componentes materializados:

```
  INSERT INTO vup (c) VALUES (1);
  ```

* `UPDATE`: A tabela ou tabelas a serem atualizadas em uma instrução `UPDATE` podem ser referências de visualização que são mescladas. Se uma visualização for uma visualização de junção, pelo menos um componente da visualização deve ser atualizável (isso difere de `INSERT`).

Em uma instrução `UPDATE` de múltiplas tabelas, as referências de tabela atualizadas da instrução devem ser tabelas base ou referências de visualização atualizáveis. Referências de tabela não atualizadas podem ser visualizações materializadas ou tabelas derivadas.

Esta instrução é válida; a coluna `c` é da parte atualizável da visualização de junção:

```
  UPDATE vjoin SET c=c+1;
  ```

Esta instrução é inválida; a coluna `x` é da parte não atualizável:

```
  UPDATE vjoin SET x=x+1;
  ```

Esta instrução é válida; a referência de tabela atualizada da instrução `UPDATE` de múltiplas tabelas é uma referência de visualização atualizável (`vup`):

```
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET c=c+1;
  ```

Esta instrução é inválida; ela tenta atualizar uma visualização derivada materializada:

```
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET s=s+1;
  ```

* `DELETE`: A(s) tabela(s) a ser(em) excluída(s) de uma instrução `DELETE` deve(m) ser vistas unidas. Vistas de junção não são permitidas (isso difere de `INSERT` e `UPDATE`).

Esta instrução é inválida porque a vista é uma vista de junção:

```
  DELETE vjoin WHERE ...;
  ```

Esta instrução é válida porque a vista é uma vista unida (atualizável):

```
  DELETE vup WHERE ...;
  ```

Esta instrução é válida porque exclui de uma vista unida (atualizável):

```
  DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;
  ```

Discussão adicional e exemplos seguem.

A discussão anterior nesta seção apontou que uma vista não é inserível se não todas as colunas forem referências de coluna simples (por exemplo, se contiver colunas que são expressões ou expressões compostas). Embora uma vista assim não seja inserível, ela pode ser atualizável se você atualizar apenas colunas que não são expressões. Considere esta vista:

```
CREATE VIEW v AS SELECT col1, 1 AS col2 FROM t;
```

Esta vista não é inserível porque `col2` é uma expressão. Mas é atualizável se a atualização não tentar atualizar `col2`. Esta atualização é permitida:

```
UPDATE v SET col1 = 0;
```

Esta atualização não é permitida porque tenta atualizar uma coluna de expressão:

```
UPDATE v SET col2 = 0;
```

Se uma tabela contiver uma coluna `AUTO_INCREMENT`, inserir em uma vista inserível na tabela que não inclui a coluna `AUTO_INCREMENT` não altera o valor de `LAST_INSERT_ID()`, porque os efeitos colaterais de inserir valores padrão em colunas que não fazem parte da vista não devem ser visíveis.