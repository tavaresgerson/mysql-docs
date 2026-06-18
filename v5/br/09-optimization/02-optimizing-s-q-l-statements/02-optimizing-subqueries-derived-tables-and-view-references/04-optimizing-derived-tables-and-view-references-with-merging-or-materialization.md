#### 8.2.2.4 Otimização de tabelas derivadas e referências de visualizações com fusão ou materialização

O otimizador pode lidar com referências a tabelas derivadas usando duas estratégias (que também se aplicam a referências de visualização):

- Junte a tabela derivada ao bloco de consulta externa
- Materialize a tabela derivada em uma tabela temporária interna

Exemplo 1:

```sql
SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

Com a fusão da tabela derivada `derived_t1`, essa consulta é executada de forma semelhante a:

```sql
SELECT * FROM t1;
```

Exemplo 2:

```sql
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2 ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Com a fusão da tabela derivada `derived_t2`, essa consulta é executada de forma semelhante a:

```sql
SELECT t1.*, t2.f1
  FROM t1 JOIN t2 ON t1.f2=t2.f1
  WHERE t1.f1 > 0;
```

Com a materialização, `derived_t1` e `derived_t2` são tratados como tabelas separadas dentro de suas respectivas consultas.

O otimizador lida com tabelas derivadas e referências de visualizações da mesma maneira: ele evita a materialização desnecessária sempre que possível, o que permite que as condições sejam empurradas das consultas externas para as tabelas derivadas e produz planos de execução mais eficientes. (Para um exemplo, consulte a Seção 8.2.2.2, “Otimizando Subconsultas com Materialização”.)

Se a fusão resultar em um bloco de consulta externa que faça referência a mais de 61 tabelas de base, o otimizador opta pela materialização.

O otimizador propaga uma cláusula `ORDER BY` em uma referência de tabela derivada ou visual para o bloco de consulta externa se todas essas condições forem verdadeiras:

- A consulta externa não está agrupada ou agregada.

- A consulta externa não especifica `DISTINCT`, `HAVING` ou `ORDER BY`.

- A consulta externa tem essa referência de tabela ou visualização derivada como a única fonte na cláusula `FROM`.

Caso contrário, o otimizador ignora a cláusula `ORDER BY`.

Os seguintes meios estão disponíveis para influenciar se o otimizador tenta combinar tabelas derivadas e referências de visualizações no bloco de consulta externa:

- A bandeira `derived_merge` da variável de sistema `optimizer_switch` pode ser usada, assumindo que nenhuma outra regra impeça a fusão. Veja a Seção 8.9.2, “Otimizações Switchable”. Por padrão, a bandeira está habilitada para permitir a fusão. Desabilitar a bandeira impede a fusão e evita erros `ER_UPDATE_TABLE_USED`.

  A bandeira `derived_merge` também se aplica a visualizações que não contêm nenhuma cláusula `ALGORITHM`. Assim, se ocorrer um erro `ER_UPDATE_TABLE_USED` para uma referência de visualização que usa uma expressão equivalente à subconsulta, adicionar `ALGORITHM=TEMPTABLE` à definição da visualização impede a fusão e tem precedência sobre o valor `derived_merge`.

- É possível desativar a junção usando na subconsulta quaisquer construções que impeçam a junção, embora essas não sejam tão explícitas em seu efeito na materialização. As construções que impedem a junção são as mesmas para tabelas derivadas e referências de visualização:

  - Funções agregadas (`SUM()`, `MIN()`, `MAX()`, `COUNT()`, e assim por diante)
  - `DISTINCT`
  - `GROUP BY`
  - `HAVING`
  - `LIMIT`
  - `UNION` ou `UNION ALL`
  - Subconsultas na lista de seleção
  - Atribuições a variáveis de usuário
  - Referências apenas a valores literais (neste caso, não há uma tabela subjacente)

A bandeira `derived_merge` também se aplica a visualizações que não contêm nenhuma cláusula `ALGORITHM`. Assim, se ocorrer um erro `ER_UPDATE_TABLE_USED` para uma referência de visualização que usa uma expressão equivalente à subconsulta, adicionar `ALGORITHM=TEMPTABLE` à definição da visualização impede a fusão e tem precedência sobre o valor atual de `derived_merge`.

Se o otimizador optar pela estratégia de materialização em vez de junção para uma tabela derivada, ele processará a consulta da seguinte forma:

- O otimizador adiou a materialização da tabela derivada até que seu conteúdo seja necessário durante a execução da consulta. Isso melhora o desempenho, pois a adição da materialização pode resultar em não precisar fazê-la. Considere uma consulta que junta o resultado de uma tabela derivada a outra tabela: Se o otimizador processar essa outra tabela primeiro e descobrir que ela não retorna nenhuma linha, a junção não precisa ser realizada e o otimizador pode pular completamente a materialização da tabela derivada.

- Durante a execução da consulta, o otimizador pode adicionar um índice a uma tabela derivada para acelerar a recuperação de linhas dela.

Considere a seguinte instrução `EXPLAIN` para uma consulta `SELECT` que contém uma tabela derivada:

```sql
EXPLAIN SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

O otimizador evita a materialização da tabela derivada, adiando-a até que o resultado seja necessário durante a execução do `SELECT`. Neste caso, a consulta não é executada (porque ocorre em uma instrução `EXPLAIN`), então o resultado nunca é necessário.

Mesmo para consultas que são executadas, o atraso na materialização da tabela derivada pode permitir que o otimizador evite a materialização completamente. Quando isso acontece, a execução da consulta é mais rápida no momento necessário para realizar a materialização. Considere a seguinte consulta, que junta o resultado de uma tabela derivada a outra tabela:

```sql
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2
          ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Se os processos de otimização `t1` forem executados primeiro e a cláusula `WHERE` produzir um resultado vazio, a junção deve ser necessariamente vazia e a tabela derivada pode não ser materializada.

Para casos em que uma tabela derivada requer materialização, o otimizador pode adicionar um índice à tabela materializada para acelerar o acesso a ela. Se tal índice permitir o acesso `ref` à tabela, pode reduzir significativamente a quantidade de dados lidos durante a execução da consulta. Considere a seguinte consulta:

```sql
SELECT *
 FROM t1 JOIN (SELECT DISTINCT f1 FROM t2) AS derived_t2
         ON t1.f1=derived_t2.f1;
```

O otimizador constrói um índice sobre a coluna `f1` de `derived_t2` se isso permitir o uso do acesso `ref` para o plano de execução de menor custo. Após a adição do índice, o otimizador pode tratar a tabela derivada materializada da mesma forma que uma tabela regular com um índice, e se beneficia da mesma maneira do índice gerado. O custo da criação do índice é desprezível em comparação com o custo da execução da consulta sem o índice. Se o acesso `ref` resultar em um custo maior do que algum outro método de acesso, o otimizador não cria o índice e não perde nada.

Para a saída de rastreamento do otimizador, uma referência de tabela ou visão derivada combinada não é exibida como um nó. Apenas suas tabelas subjacentes aparecem no plano da consulta principal.
