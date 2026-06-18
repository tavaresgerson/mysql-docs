#### 10.2.1.13 Filtragem de Condições

No processamento de junções, as linhas de prefixo são aquelas linhas passadas de uma tabela para outra durante uma junção. Geralmente, o otimizador tenta colocar tabelas com baixo número de linhas de prefixo no início da ordem de junção para evitar que o número de combinações de linhas aumente rapidamente. Na medida em que o otimizador pode usar informações sobre condições nas linhas selecionadas de uma tabela e passadas para a próxima, mais precisamente ele pode calcular estimativas de linhas e escolher o melhor plano de execução.

Sem filtragem condicional, o número de linhas de prefixo para uma tabela é baseado no número estimado de linhas selecionadas pela cláusula `WHERE`, de acordo com o método de acesso escolhido pelo otimizador. A filtragem condicional permite que o otimizador use outras condições relevantes na cláusula `WHERE`, que não são consideradas pelo método de acesso, e, assim, melhore suas estimativas de número de linhas de prefixo. Por exemplo, embora possa haver um método de acesso baseado em índice que pode ser usado para selecionar linhas da tabela atual em uma junção, também pode haver condições adicionais para a tabela na cláusula `WHERE` que podem filtrar (restrição adicional) a estimativa para as linhas qualificadoras passadas para a próxima tabela.

Uma condição contribui para a estimativa de filtragem apenas se:

- Isso se refere à tabela atual.

- Depende de um valor constante ou de valores de tabelas anteriores na sequência de junção.

- Isso não estava sendo considerado pelo método de acesso.

Na saída `EXPLAIN`, a coluna `rows` indica a estimativa da linha para o método de acesso escolhido, e a coluna `filtered` reflete o efeito da filtragem de condições. Os valores de `filtered` são expressos como porcentagens. O valor máximo é de 100, o que significa que não houve filtragem de linhas. Valores que diminuem de 100 indicam quantidades crescentes de filtragem.

O número de linhas de prefixo (o número de linhas estimadas para serem passadas da tabela atual em uma junção para a próxima) é o produto dos valores `rows` e `filtered`. Ou seja, o número de linhas de prefixo é o número de linhas estimado, reduzido pelo efeito de filtragem estimado. Por exemplo, se `rows` for 1000 e `filtered` for 20%, o filtro de condição reduz o número de linhas estimado de 1000 para um número de linhas de prefixo de 1000 × 20% = 1000 × .2 = 200.

Considere a seguinte consulta:

```
SELECT *
  FROM employee JOIN department ON employee.dept_no = department.dept_no
  WHERE employee.first_name = 'John'
  AND employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01';
```

Suponha que o conjunto de dados tenha essas características:

- A tabela `employee` tem 1024 linhas.

- A tabela `department` tem 12 linhas.

- Ambas as tabelas têm um índice em `dept_no`.

- A tabela `employee` tem um índice em `first_name`.

- 8 linhas satisfazem essa condição em `employee.first_name`:

  ```
  employee.first_name = 'John'
  ```

- 150 linhas satisfazem essa condição em `employee.hire_date`:

  ```
  employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01'
  ```

- Uma única linha satisfaz ambas as condições:

  ```
  employee.first_name = 'John'
  AND employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01'
  ```

Sem o filtro de condição, `EXPLAIN` produz uma saída como esta:

```
+----+------------+--------+------------------+---------+---------+------+----------+
| id | table      | type   | possible_keys    | key     | ref     | rows | filtered |
+----+------------+--------+------------------+---------+---------+------+----------+
| 1  | employee   | ref    | name,h_date,dept | name    | const   | 8    | 100.00   |
| 1  | department | eq_ref | PRIMARY          | PRIMARY | dept_no | 1    | 100.00   |
+----+------------+--------+------------------+---------+---------+------+----------+
```

Para `employee`, o método de acesso no índice `name` recupera as 8 linhas que correspondem a um nome de `'John'`. Não há filtragem (`filtered` é 100%), portanto, todas as linhas são linhas de prefixo para a próxima tabela: O número de linhas de prefixo é `rows` × `filtered` = 8 × 100% = 8.

Com o filtro de condições, o otimizador também leva em consideração as condições da cláusula `WHERE` que não são consideradas pelo método de acesso. Neste caso, o otimizador usa heurísticas para estimar um efeito de filtragem de 16,31% para a condição `BETWEEN` em `employee.hire_date`. Como resultado, `EXPLAIN` produz uma saída como esta:

```
+----+------------+--------+------------------+---------+---------+------+----------+
| id | table      | type   | possible_keys    | key     | ref     | rows | filtered |
+----+------------+--------+------------------+---------+---------+------+----------+
| 1  | employee   | ref    | name,h_date,dept | name    | const   | 8    | 16.31    |
| 1  | department | eq_ref | PRIMARY          | PRIMARY | dept_no | 1    | 100.00   |
+----+------------+--------+------------------+---------+---------+------+----------+
```

Agora, o número de linhas de prefixo é `rows` × `filtered` = 8 × 16,31% = 1,3, o que reflete mais fielmente o conjunto de dados reais.

Normalmente, o otimizador não calcula o efeito de filtragem de condição (redução do número de linhas de prefixo) para a última tabela unida, porque não há a próxima tabela para passar as linhas. Uma exceção ocorre para `EXPLAIN`: Para fornecer mais informações, o efeito de filtragem é calculado para todas as tabelas unidas, incluindo a última.

Para controlar se o otimizador considera condições de filtragem adicionais, use a bandeira `condition_fanout_filter` da variável de sistema `optimizer_switch` (consulte a Seção 10.9.2, “Otimizações Desativáveis”). Essa bandeira está habilitada por padrão, mas pode ser desativada para suprimir o filtro de condições (por exemplo, se uma consulta específica for encontrada para produzir um melhor desempenho sem ela).

Se o otimizador superestimar o efeito da filtragem de condições, o desempenho pode ser pior do que se a filtragem de condições não fosse usada. Nesses casos, essas técnicas podem ajudar:

- Se uma coluna não estiver indexada, indexá-la para que o otimizador tenha alguma informação sobre a distribuição dos valores da coluna e possa melhorar suas estimativas de linhas.

- Da mesma forma, se não houver informações sobre o histograma de coluna, gere um histograma (consulte a Seção 10.9.6, "Estatísticas do otimizador").

- Altere a ordem de junção. As maneiras de realizar isso incluem dicas de otimização da ordem de junção (consulte a Seção 10.9.3, “Dicas de otimização”), `STRAIGHT_JOIN` imediatamente após o `SELECT` e o operador de junção `STRAIGHT_JOIN`.

- Desative a filtragem de condições para a sessão:

  ```
  SET optimizer_switch = 'condition_fanout_filter=off';
  ```

  Ou, para uma consulta específica, usando uma dica de otimizador:

  ```
  SELECT /*+ SET_VAR(optimizer_switch = 'condition_fanout_filter=off') */ ...
  ```
