#### 8.2.1.7 Otimização de Nested Join

A sintaxe para expressar JOINs permite nested joins. A discussão a seguir se refere à sintaxe de JOIN descrita na Seção 13.2.9.2, “Cláusula JOIN”.

A sintaxe de *`table_factor`* é estendida em comparação com o Padrão SQL. Este último aceita apenas *`table_reference`*, e não uma lista deles dentro de um par de parênteses. Esta é uma extensão conservadora se considerarmos cada vírgula em uma lista de itens *`table_reference`* como equivalente a um INNER JOIN. Por exemplo:

```sql
SELECT * FROM t1 LEFT JOIN (t2, t3, t4)
                 ON (t2.a=t1.a AND t3.b=t1.b AND t4.c=t1.c)
```

É equivalente a:

```sql
SELECT * FROM t1 LEFT JOIN (t2 CROSS JOIN t3 CROSS JOIN t4)
                 ON (t2.a=t1.a AND t3.b=t1.b AND t4.c=t1.c)
```

No MySQL, `CROSS JOIN` é sintaticamente equivalente a `INNER JOIN`; eles podem se substituir mutuamente. No SQL padrão, eles não são equivalentes. `INNER JOIN` é usado com uma cláusula `ON`; `CROSS JOIN` é usado em outras situações.

Em geral, parênteses podem ser ignorados em expressões de JOIN que contêm apenas operações de INNER JOIN. Considere esta expressão de JOIN:

```sql
t1 LEFT JOIN (t2 LEFT JOIN t3 ON t2.b=t3.b OR t2.b IS NULL)
   ON t1.a=t2.a
```

Após remover os parênteses e agrupar as operações para a esquerda, essa expressão de JOIN se transforma nesta expressão:

```sql
(t1 LEFT JOIN t2 ON t1.a=t2.a) LEFT JOIN t3
    ON t2.b=t3.b OR t2.b IS NULL
```

No entanto, as duas expressões não são equivalentes. Para verificar isso, suponha que as tabelas `t1`, `t2` e `t3` tenham o seguinte estado:

* A Tabela `t1` contém linhas `(1)`, `(2)`

* A Tabela `t2` contém a linha `(1,101)`

* A Tabela `t3` contém a linha `(101)`

Neste caso, a primeira expressão retorna um conjunto de resultados incluindo as linhas `(1,1,101,101)`, `(2,NULL,NULL,NULL)`, enquanto a segunda expressão retorna as linhas `(1,1,101,101)`, `(2,NULL,NULL,101)`:

```sql
mysql> SELECT *
       FROM t1
            LEFT JOIN
            (t2 LEFT JOIN t3 ON t2.b=t3.b OR t2.b IS NULL)
            ON t1.a=t2.a;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL | NULL |
+------+------+------+------+

mysql> SELECT *
       FROM (t1 LEFT JOIN t2 ON t1.a=t2.a)
            LEFT JOIN t3
            ON t2.b=t3.b OR t2.b IS NULL;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL |  101 |
+------+------+------+------+
```

No exemplo a seguir, uma operação de OUTER JOIN é usada em conjunto com uma operação de INNER JOIN:

```sql
t1 LEFT JOIN (t2, t3) ON t1.a=t2.a
```

Essa expressão não pode ser transformada na seguinte expressão:

```sql
t1 LEFT JOIN t2 ON t1.a=t2.a, t3
```

Para os estados de tabela fornecidos, as duas expressões retornam conjuntos de linhas diferentes:

```sql
mysql> SELECT *
       FROM t1 LEFT JOIN (t2, t3) ON t1.a=t2.a;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL | NULL |
+------+------+------+------+

mysql> SELECT *
       FROM t1 LEFT JOIN t2 ON t1.a=t2.a, t3;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL |  101 |
+------+------+------+------+
```

Portanto, se omitirmos parênteses em uma expressão de JOIN com operadores de OUTER JOIN, podemos alterar o conjunto de resultados da expressão original.

Mais precisamente, não podemos ignorar parênteses no operando direito da operação de LEFT OUTER JOIN e no operando esquerdo de uma operação de RIGHT JOIN. Em outras palavras, não podemos ignorar parênteses para as expressões de tabelas internas (inner table expressions) das operações de OUTER JOIN. Os parênteses para o outro operando (o operando para a tabela externa) podem ser ignorados.

A seguinte expressão:

```sql
(t1,t2) LEFT JOIN t3 ON P(t2.b,t3.b)
```

É equivalente a esta expressão para quaisquer tabelas `t1,t2,t3` e qualquer condição `P` sobre os atributos `t2.b` e `t3.b`:

```sql
t1, t2 LEFT JOIN t3 ON P(t2.b,t3.b)
```

Sempre que a ordem de execução das operações de JOIN em uma expressão de JOIN (*`joined_table`*) não é da esquerda para a direita, falamos sobre nested joins. Considere as seguintes Queries:

```sql
SELECT * FROM t1 LEFT JOIN (t2 LEFT JOIN t3 ON t2.b=t3.b) ON t1.a=t2.a
  WHERE t1.a > 1

SELECT * FROM t1 LEFT JOIN (t2, t3) ON t1.a=t2.a
  WHERE (t2.b=t3.b OR t2.b IS NULL) AND t1.a > 1
```

Essas Queries são consideradas como contendo estes nested joins:

```sql
t2 LEFT JOIN t3 ON t2.b=t3.b
t2, t3
```

Na primeira Query, o nested join é formado com uma operação de LEFT JOIN. Na segunda Query, ele é formado com uma operação de INNER JOIN.

Na primeira Query, os parênteses podem ser omitidos: A estrutura gramatical da expressão de JOIN dita a mesma ordem de execução para as operações de JOIN. Para a segunda Query, os parênteses não podem ser omitidos, embora a expressão de JOIN aqui possa ser interpretada de forma não ambígua sem eles. Em nossa sintaxe estendida, os parênteses em `(t2, t3)` da segunda Query são obrigatórios, embora teoricamente a Query pudesse ser analisada sem eles: Ainda teríamos uma estrutura sintática não ambígua para a Query porque `LEFT JOIN` e `ON` desempenham o papel dos delimitadores esquerdo e direito para a expressão `(t2,t3)`.

Os exemplos anteriores demonstram estes pontos:

* Para expressões de JOIN que envolvem apenas INNER JOINs (e não OUTER JOINs), os parênteses podem ser removidos e os JOINs avaliados da esquerda para a direita. Na verdade, as tabelas podem ser avaliadas em qualquer ordem.

* O mesmo não é verdade, em geral, para OUTER JOINs ou para OUTER JOINs misturados com INNER JOINs. A remoção de parênteses pode alterar o resultado.

Queries com nested outer joins são executadas da mesma forma pipeline que as Queries com INNER JOINs. Mais precisamente, uma variação do algoritmo de nested-loop JOIN é explorada. Lembre-se do algoritmo pelo qual o nested-loop JOIN executa uma Query (veja a Seção 8.2.1.6, “Algoritmos de Nested-Loop Join”). Suponha que uma Query de JOIN sobre 3 tabelas `T1,T2,T3` tenha esta forma:

```sql
SELECT * FROM T1 INNER JOIN T2 ON P1(T1,T2)
                 INNER JOIN T3 ON P2(T2,T3)
  WHERE P(T1,T2,T3)
```

Aqui, `P1(T1,T2)` e `P2(T3,T3)` são algumas condições de JOIN (em expressões), enquanto `P(T1,T2,T3)` é uma condição sobre colunas das tabelas `T1,T2,T3`.

O algoritmo de nested-loop JOIN executaria esta Query da seguinte maneira:

```sql
FOR each row t1 in T1 {
  FOR each row t2 in T2 such that P1(t1,t2) {
    FOR each row t3 in T3 such that P2(t2,t3) {
      IF P(t1,t2,t3) {
         t:=t1||t2||t3; OUTPUT t;
      }
    }
  }
}
```

A notação `t1||t2||t3` indica uma linha construída pela concatenação das colunas das linhas `t1`, `t2` e `t3`. Em alguns dos exemplos a seguir, `NULL` onde um nome de tabela aparece significa uma linha na qual `NULL` é usado para cada coluna dessa tabela. Por exemplo, `t1||t2||NULL` indica uma linha construída pela concatenação das colunas das linhas `t1` e `t2`, e `NULL` para cada coluna de `t3`. Essa linha é dita ser complementada por `NULL` (`NULL`-complemented).

Agora considere uma Query com nested outer joins:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON P2(T2,T3))
              ON P1(T1,T2)
  WHERE P(T1,T2,T3)
```

Para esta Query, modifique o padrão de nested-loop para obter:

```sql
FOR each row t1 in T1 {
  BOOL f1:=FALSE;
  FOR each row t2 in T2 such that P1(t1,t2) {
    BOOL f2:=FALSE;
    FOR each row t3 in T3 such that P2(t2,t3) {
      IF P(t1,t2,t3) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f2=TRUE;
      f1=TRUE;
    }
    IF (!f2) {
      IF P(t1,t2,NULL) {
        t:=t1||t2||NULL; OUTPUT t;
      }
      f1=TRUE;
    }
  }
  IF (!f1) {
    IF P(t1,NULL,NULL) {
      t:=t1||NULL||NULL; OUTPUT t;
    }
  }
}
```

Em geral, para qualquer nested loop para a primeira tabela interna em uma operação de OUTER JOIN, uma *flag* (bandeira) é introduzida, a qual é desativada antes do loop e verificada após o loop. A *flag* é ativada quando, para a linha atual da tabela externa, uma correspondência da tabela que representa o operando interno é encontrada. Se no final do ciclo do loop a *flag* ainda estiver desativada, nenhuma correspondência foi encontrada para a linha atual da tabela externa. Neste caso, a linha é complementada por valores `NULL` para as colunas das tabelas internas. A linha resultante é passada para a verificação final para o output ou para o próximo nested loop, mas somente se a linha satisfizer a condição de JOIN de todos os outer joins embutidos.

No exemplo, a tabela de OUTER JOIN expressa pela seguinte expressão está embutida:

```sql
(T2 LEFT JOIN T3 ON P2(T2,T3))
```

Para a Query com INNER JOINs, o OPTIMIZER poderia escolher uma ordem diferente de nested loops, como esta:

```sql
FOR each row t3 in T3 {
  FOR each row t2 in T2 such that P2(t2,t3) {
    FOR each row t1 in T1 such that P1(t1,t2) {
      IF P(t1,t2,t3) {
         t:=t1||t2||t3; OUTPUT t;
      }
    }
  }
}
```

Para Queries com OUTER JOINs, o OPTIMIZER pode escolher apenas uma ordem em que os loops para tabelas externas precedem os loops para tabelas internas. Assim, para nossa Query com OUTER JOINs, apenas uma ordem de nesting é possível. Para a seguinte Query, o OPTIMIZER avalia dois diferentes nestings. Em ambos os nestings, `T1` deve ser processada no loop externo porque é usada em um OUTER JOIN. `T2` e `T3` são usadas em um INNER JOIN, então esse JOIN deve ser processado no loop interno. No entanto, como o JOIN é um INNER JOIN, `T2` e `T3` podem ser processadas em qualquer ordem.

```sql
SELECT * T1 LEFT JOIN (T2,T3) ON P1(T1,T2) AND P2(T1,T3)
  WHERE P(T1,T2,T3)
```

Um nesting avalia `T2`, depois `T3`:

```sql
FOR each row t1 in T1 {
  BOOL f1:=FALSE;
  FOR each row t2 in T2 such that P1(t1,t2) {
    FOR each row t3 in T3 such that P2(t1,t3) {
      IF P(t1,t2,t3) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f1:=TRUE
    }
  }
  IF (!f1) {
    IF P(t1,NULL,NULL) {
      t:=t1||NULL||NULL; OUTPUT t;
    }
  }
}
```

O outro nesting avalia `T3`, depois `T2`:

```sql
FOR each row t1 in T1 {
  BOOL f1:=FALSE;
  FOR each row t3 in T3 such that P2(t1,t3) {
    FOR each row t2 in T2 such that P1(t1,t2) {
      IF P(t1,t2,t3) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f1:=TRUE
    }
  }
  IF (!f1) {
    IF P(t1,NULL,NULL) {
      t:=t1||NULL||NULL; OUTPUT t;
    }
  }
}
```

Ao discutir o algoritmo de nested-loop para INNER JOINs, omitimos alguns detalhes cujo impacto no performance da execução da Query pode ser enorme. Não mencionamos as chamadas condições "pushed-down" (empurradas para baixo). Suponha que nossa condição `WHERE` `P(T1,T2,T3)` possa ser representada por uma fórmula conjuntiva:

```sql
P(T1,T2,T2) = C1(T1) AND C2(T2) AND C3(T3).
```

Neste caso, o MySQL realmente usa o seguinte algoritmo de nested-loop para a execução da Query com INNER JOINs:

```sql
FOR each row t1 in T1 such that C1(t1) {
  FOR each row t2 in T2 such that P1(t1,t2) AND C2(t2)  {
    FOR each row t3 in T3 such that P2(t2,t3) AND C3(t3) {
      IF P(t1,t2,t3) {
         t:=t1||t2||t3; OUTPUT t;
      }
    }
  }
}
```

Você percebe que cada uma das conjunções `C1(T1)`, `C2(T2)`, `C3(T3)` é empurrada para fora do loop mais interno para o loop mais externo onde pode ser avaliada. Se `C1(T1)` for uma condição muito restritiva, esse *condition pushdown* pode reduzir drasticamente o número de linhas da tabela `T1` passadas para os loops internos. Como resultado, o tempo de execução da Query pode melhorar imensamente.

Para uma Query com OUTER JOINs, a condição `WHERE` deve ser verificada somente depois de ter sido descoberto que a linha atual da tabela externa tem uma correspondência nas tabelas internas. Assim, a otimização de empurrar condições para fora dos nested loops internos não pode ser aplicada diretamente a Queries com OUTER JOINs. Aqui, devemos introduzir predicados *pushed-down* condicionais guardados pelas *flags* que são ativadas quando uma correspondência é encontrada.

Lembre-se deste exemplo com OUTER JOINs:

```sql
P(T1,T2,T3)=C1(T1) AND C(T2) AND C3(T3)
```

Para esse exemplo, o algoritmo de nested-loop usando condições *pushed-down* guardadas se parece com isto:

```sql
FOR each row t1 in T1 such that C1(t1) {
  BOOL f1:=FALSE;
  FOR each row t2 in T2
      such that P1(t1,t2) AND (f1?C2(t2):TRUE) {
    BOOL f2:=FALSE;
    FOR each row t3 in T3
        such that P2(t2,t3) AND (f1&&f2?C3(t3):TRUE) {
      IF (f1&&f2?TRUE:(C2(t2) AND C3(t3))) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f2=TRUE;
      f1=TRUE;
    }
    IF (!f2) {
      IF (f1?TRUE:C2(t2) && P(t1,t2,NULL)) {
        t:=t1||t2||NULL; OUTPUT t;
      }
      f1=TRUE;
    }
  }
  IF (!f1 && P(t1,NULL,NULL)) {
      t:=t1||NULL||NULL; OUTPUT t;
  }
}
```

Em geral, predicados *pushed-down* podem ser extraídos de condições de JOIN, como `P1(T1,T2)` e `P(T2,T3)`. Neste caso, um predicado *pushed-down* também é guardado por uma *flag* que impede a verificação do predicado para a linha complementada por `NULL` gerada pela operação de OUTER JOIN correspondente.

O acesso por KEY de uma tabela interna para outra no mesmo nested join é proibido se for induzido por um predicado da condição `WHERE`.