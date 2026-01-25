#### 8.2.1.12 Filtragem de Condição (Condition Filtering)

No processamento de JOIN, as "prefix rows" (linhas prefixo) são aquelas linhas passadas de uma tabela em um JOIN para a próxima. Em geral, o otimizador tenta colocar tabelas com baixas contagens de prefixo no início da ordem do JOIN para evitar que o número de combinações de linhas aumente rapidamente. Quanto mais o otimizador puder usar informações sobre as condições nas linhas selecionadas de uma tabela e passadas para a próxima, mais precisamente ele poderá calcular as estimativas de linhas e escolher o melhor plano de execução.

Sem a filtragem de condição, a contagem de linhas prefixo para uma tabela é baseada no número estimado de linhas selecionadas pela cláusula `WHERE`, de acordo com o método de acesso que o otimizador escolher. A filtragem de condição permite que o otimizador use outras condições relevantes na cláusula `WHERE` que não foram consideradas pelo método de acesso, melhorando assim suas estimativas de contagem de linhas prefixo. Por exemplo, mesmo que possa haver um método de acesso baseado em Index que possa ser usado para selecionar linhas da tabela atual em um JOIN, pode haver também condições adicionais para a tabela na cláusula `WHERE` que podem filtrar (restringir ainda mais) a estimativa de linhas qualificadas passadas para a próxima tabela.

Uma condição contribui para a estimativa de filtragem somente se:

* Ela se refere à tabela atual.
* Ela depende de um valor constante ou de valores de tabelas anteriores na sequência do JOIN.
* Ela ainda não foi considerada pelo método de acesso.

Na saída do `EXPLAIN`, a coluna `rows` indica a estimativa de linhas para o método de acesso escolhido, e a coluna `filtered` reflete o efeito da filtragem de condição. Os valores `filtered` são expressos como porcentagens. O valor máximo é 100, o que significa que não ocorreu filtragem de linhas. Valores decrescentes a partir de 100 indicam quantidades crescentes de filtragem.

A contagem de linhas prefixo (o número de linhas estimado a ser passado da tabela atual em um JOIN para a próxima) é o produto dos valores de `rows` e `filtered`. Ou seja, a contagem de linhas prefixo é a contagem de linhas estimada, reduzida pelo efeito de filtragem estimado. Por exemplo, se `rows` for 1000 e `filtered` for 20%, a filtragem de condição reduz a contagem estimada de 1000 para uma contagem de linhas prefixo de 1000 × 20% = 1000 × 0,2 = 200.

Considere a seguinte Query:

```sql
SELECT *
  FROM employee JOIN department ON employee.dept_no = department.dept_no
  WHERE employee.first_name = 'John'
  AND employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01';
```

Suponha que o conjunto de dados tenha estas características:

* A tabela `employee` tem 1024 linhas.
* A tabela `department` tem 12 linhas.
* Ambas as tabelas têm um Index em `dept_no`.
* A tabela `employee` tem um Index em `first_name`.

* 8 linhas satisfazem esta condição em `employee.first_name`:

  ```sql
  employee.first_name = 'John'
  ```

* 150 linhas satisfazem esta condição em `employee.hire_date`:

  ```sql
  employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01'
  ```

* 1 linha satisfaz ambas as condições:

  ```sql
  employee.first_name = 'John'
  AND employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01'
  ```

Sem a filtragem de condição, `EXPLAIN` produz uma saída como esta:

```sql
+----+------------+--------+------------------+---------+---------+------+----------+
| id | table      | type   | possible_keys    | key     | ref     | rows | filtered |
+----+------------+--------+------------------+---------+---------+------+----------+
| 1  | employee   | ref    | name,h_date,dept | name    | const   | 8    | 100.00   |
| 1  | department | eq_ref | PRIMARY          | PRIMARY | dept_no | 1    | 100.00   |
+----+------------+--------+------------------+---------+---------+------+----------+
```

Para `employee`, o método de acesso no Index `name` seleciona as 8 linhas que correspondem ao nome `'John'`. Nenhuma filtragem é feita (`filtered` é 100%), então todas as linhas são linhas prefixo para a próxima tabela: A contagem de linhas prefixo é `rows` × `filtered` = 8 × 100% = 8.

Com a filtragem de condição, o otimizador considera adicionalmente as condições da cláusula `WHERE` não consideradas pelo método de acesso. Neste caso, o otimizador usa heurísticas para estimar um efeito de filtragem de 16,31% para a condição `BETWEEN` em `employee.hire_date`. Como resultado, `EXPLAIN` produz uma saída como esta:

```sql
+----+------------+--------+------------------+---------+---------+------+----------+
| id | table      | type   | possible_keys    | key     | ref     | rows | filtered |
+----+------------+--------+------------------+---------+---------+------+----------+
| 1  | employee   | ref    | name,h_date,dept | name    | const   | 8    | 16.31    |
| 1  | department | eq_ref | PRIMARY          | PRIMARY | dept_no | 1    | 100.00   |
+----+------------+--------+------------------+---------+---------+------+----------+
```

Agora, a contagem de linhas prefixo é `rows` × `filtered` = 8 × 16,31% = 1,3, o que reflete mais de perto o conjunto de dados real.

Normalmente, o otimizador não calcula o efeito de filtragem de condição (redução da contagem de linhas prefixo) para a última tabela unida (joined) porque não há uma próxima tabela para a qual passar as linhas. Uma exceção ocorre para `EXPLAIN`: Para fornecer mais informações, o efeito de filtragem é calculado para todas as tabelas unidas, incluindo a última.

Para controlar se o otimizador considera condições de filtragem adicionais, use o flag `condition_fanout_filter` da variável de sistema `optimizer_switch` (consulte Seção 8.9.2, “Otimizações Alternáveis”). Este flag está habilitado por padrão, mas pode ser desabilitado para suprimir a filtragem de condição (por exemplo, se for descoberto que uma Query específica apresenta melhor desempenho sem ela).

Se o otimizador superestimar o efeito da filtragem de condição, o desempenho pode ser pior do que se a filtragem de condição não for usada. Nesses casos, as seguintes técnicas podem ajudar:

* Se uma coluna não estiver indexada, crie um Index nela para que o otimizador tenha alguma informação sobre a distribuição dos valores da coluna e possa melhorar suas estimativas de linha.

* Altere a ordem do JOIN. As maneiras de conseguir isso incluem hints de otimização de ordem de JOIN (consulte Seção 8.9.3, “Optimizer Hints”), `STRAIGHT_JOIN` imediatamente após o `SELECT`, e o operador de JOIN `STRAIGHT_JOIN`.

* Desabilite a filtragem de condição para a sessão:

  ```sql
  SET optimizer_switch = 'condition_fanout_filter=off';
  ```