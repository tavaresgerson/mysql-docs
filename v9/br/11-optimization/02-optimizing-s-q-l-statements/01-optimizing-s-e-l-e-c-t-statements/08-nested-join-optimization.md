#### 10.2.1.8 Otimização de Conjunções Aninhadas

A sintaxe para expressar junções permite junções aninhadas. A discussão a seguir se refere à sintaxe de junção descrita na Seção 15.2.13.2, “Cláusula JOIN”.

A sintaxe de *`table_factor`* é estendida em comparação com o Padrão SQL. Este último aceita apenas *`table_reference`*, não uma lista delas dentro de um par de parênteses. Esta é uma extensão conservadora se considerarmos cada vírgula em uma lista de itens de *`table_reference`* como equivalente a uma junção interna. Por exemplo:

```
SELECT * FROM t1 LEFT JOIN (t2, t3, t4)
                 ON (t2.a=t1.a AND t3.b=t1.b AND t4.c=t1.c)
```

É equivalente a:

```
SELECT * FROM t1 LEFT JOIN (t2 CROSS JOIN t3 CROSS JOIN t4)
                 ON (t2.a=t1.a AND t3.b=t1.b AND t4.c=t1.c)
```

No MySQL, `CROSS JOIN` é sintaticamente equivalente a `INNER JOIN`; eles podem substituir um ao outro. No SQL padrão, eles não são equivalentes. `INNER JOIN` é usado com uma cláusula `ON`; `CROSS JOIN` é usado de outra forma.

De forma geral, os parênteses podem ser ignorados em expressões de junção que contêm apenas operações de junção interna. Considere esta expressão de junção:

```
t1 LEFT JOIN (t2 LEFT JOIN t3 ON t2.b=t3.b OR t2.b IS NULL)
   ON t1.a=t2.a
```

Após remover os parênteses e as operações de agrupamento para a esquerda, essa expressão de junção se transforma nesta expressão:

```
(t1 LEFT JOIN t2 ON t1.a=t2.a) LEFT JOIN t3
    ON t2.b=t3.b OR t2.b IS NULL
```

No entanto, as duas expressões não são equivalentes. Para ver isso, suponha que as tabelas `t1`, `t2` e `t3` tenham o seguinte estado:

* A tabela `t1` contém as linhas `(1)`, `(2)`
* A tabela `t2` contém a linha `(1,101)`
* A tabela `t3` contém a linha `(101)`

Neste caso, a primeira expressão retorna um conjunto de resultados que inclui as linhas `(1,1,101,101)`, `(2,NULL,NULL,NULL)`, enquanto a segunda expressão retorna as linhas `(1,1,101,101)`, `(2,NULL,NULL,101)`:

```
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

No exemplo seguinte, uma operação de junção externa é usada juntamente com uma operação de junção interna:

```
t1 LEFT JOIN (t2, t3) ON t1.a=t2.a
```

Essa expressão não pode ser transformada na seguinte expressão:

```
t1 LEFT JOIN t2 ON t1.a=t2.a, t3
```

Para as expressões da tabela fornecidas, as duas expressões retornam conjuntos diferentes de linhas:

```
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

Portanto, se omitirmos as chaves em uma expressão de junção com operadores de junção externa, podemos alterar o conjunto de resultados da expressão original.

Mais precisamente, não podemos ignorar as chaves no operando direito da operação de junção externa esquerda e no operando esquerdo de uma operação de junção direita. Em outras palavras, não podemos ignorar as chaves para as expressões da tabela interna das operações de junção externa. As chaves para o outro operando (operando para a tabela externa) podem ser ignoradas.

A seguinte expressão:

```
(t1,t2) LEFT JOIN t3 ON P(t2.b,t3.b)
```

É equivalente a esta expressão para quaisquer tabelas `t1,t2,t3` e qualquer condição `P` sobre os atributos `t2.b` e `t3.b`:

```
t1, t2 LEFT JOIN t3 ON P(t2.b,t3.b)
```

Sempre que a ordem de execução das operações de junção em uma expressão de junção (*`joined_table`*) não for de esquerda para direita, falamos em junções aninhadas. Considere as seguintes consultas:

```
SELECT * FROM t1 LEFT JOIN (t2 LEFT JOIN t3 ON t2.b=t3.b) ON t1.a=t2.a
  WHERE t1.a > 1

SELECT * FROM t1 LEFT JOIN (t2, t3) ON t1.a=t2.a
  WHERE (t2.b=t3.b OR t2.b IS NULL) AND t1.a > 1
```

Essas consultas são consideradas conter essas junções aninhadas:

```
t2 LEFT JOIN t3 ON t2.b=t3.b
t2, t3
```

Na primeira consulta, a junção aninhada é formada com uma operação de junção externa esquerda. Na segunda consulta, é formada com uma operação de junção interna esquerda.

Na primeira consulta, as chaves podem ser omitidas: A estrutura gramatical da expressão de junção dita a mesma ordem de execução para as operações de junção. Para a segunda consulta, as chaves não podem ser omitidas, embora a expressão de junção aqui possa ser interpretada de forma inequívoca sem elas. Em nossa sintaxe estendida, as chaves em `(t2, t3)` da segunda consulta são necessárias, embora, teoricamente, a consulta possa ser analisada sem elas: Ainda teríamos uma estrutura sintática inequívoca para a consulta porque `LEFT JOIN` e `ON` desempenham o papel de delimitadores esquerdo e direito para a expressão `(t2,t3)`.

Os exemplos anteriores demonstram esses pontos:

* Para expressões de junção que envolvem apenas junções internas (e não externas), as chaves podem ser removidas e as junções avaliadas da esquerda para a direita. De fato, as tabelas podem ser avaliadas em qualquer ordem.

* O mesmo não é verdade, em geral, para junções externas ou para junções externas misturadas com junções internas. A remoção das chaves pode alterar o resultado.

Consultas com junções externas aninhadas são executadas da mesma maneira que consultas com junções internas. Mais precisamente, é explorada uma variação do algoritmo de junção de loop aninhado. Lembre-se do algoritmo pelo qual a junção de loop aninhado executa uma consulta (veja a Seção 10.2.1.7, “Algoritmos de Junção de Loop Aninhado”). Suponha que uma consulta de junção sobre 3 tabelas `T1, T2, T3` tenha esta forma:

```
SELECT * FROM T1 INNER JOIN T2 ON P1(T1,T2)
                 INNER JOIN T3 ON P2(T2,T3)
  WHERE P(T1,T2,T3)
```

Aqui, `P1(T1, T2)` e `P2(T3, T3)` são algumas condições de junção (expressões de junção), enquanto `P(T1, T2, T3)` é uma condição sobre as colunas das tabelas `T1, T2, T3`.

O algoritmo de junção de loop aninhado executaria esta consulta da seguinte maneira:

```
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

A notação `t1||t2||t3` indica uma linha construída concatenando as colunas das linhas `t1`, `t2` e `t3`. Em alguns dos exemplos seguintes, `NULL` onde aparece o nome de uma tabela significa uma linha na qual `NULL` é usado para cada coluna daquela tabela. Por exemplo, `t1||t2||NULL` indica uma linha construída concatenando as colunas das linhas `t1` e `t2`, e `NULL` para cada coluna de `t3`. Tal linha é dita ser `NULL`-completada.

Agora, considere uma consulta com junções externas aninhadas:

```
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON P2(T2,T3))
              ON P1(T1,T2)
  WHERE P(T1,T2,T3)
```

Para esta consulta, modifique o padrão de loop aninhado para obter:

```
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

Em geral, para qualquer loop aninhado na primeira tabela interna em uma operação de junção externa, é introduzida uma bandeira que é desligada antes do loop e verificada após o loop. A bandeira é ligada quando, para a linha atual da tabela externa, é encontrada uma correspondência na tabela que representa o operando interno. Se, no final do ciclo do loop, a bandeira ainda estiver desligada, não foi encontrada nenhuma correspondência para a linha atual da tabela externa. Nesse caso, a linha é completada com valores `NULL` para as colunas das tabelas internas. A linha resultante é passada para a verificação final para a saída ou para o próximo loop aninhado, mas apenas se a linha satisfazer a condição de junção de todas as junções externas incorporadas.

No exemplo, a tabela de junção externa expressa pela seguinte expressão está incorporada:

```
(T2 LEFT JOIN T3 ON P2(T2,T3))
```

Para a consulta com junções internas, o otimizador pode escolher uma ordem diferente de loops aninhados, como esta:

```
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

Para consultas com junções externas, o otimizador pode escolher apenas uma ordem em que os loops das tabelas externas precedem os loops das tabelas internas. Assim, para nossa consulta com junções externas, apenas uma ordem de aninhamento é possível. Para a consulta seguinte, o otimizador avalia duas diferentes ordenações. Em ambas as ordenações, `T1` deve ser processado no loop externo porque é usado em uma junção externa. `T2` e `T3` são usados em uma junção interna, então essa junção deve ser processada no loop interno. No entanto, como a junção é interna, `T2` e `T3` podem ser processados em qualquer ordem.

```
SELECT * T1 LEFT JOIN (T2,T3) ON P1(T1,T2) AND P2(T1,T3)
  WHERE P(T1,T2,T3)
```

Uma ordenação avalia `T2`, depois `T3`:

```
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

A outra ordenação avalia `T3`, depois `T2`:

```
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

Ao discutir o algoritmo de laço aninhado para junções internas, omitimos alguns detalhes cujo impacto na execução da consulta pode ser enorme. Não mencionamos as chamadas condições "empurradas para baixo". Suponha que nossa condição `WHERE` `P(T1, T2, T3)` possa ser representada por uma fórmula conjuntiva:

```
P(T1,T2,T2) = C1(T1) AND C2(T2) AND C3(T3).
```

Neste caso, o MySQL realmente usa o seguinte algoritmo de laço aninhado para a execução da consulta com junções internas:

```
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

Você vê que cada um dos conjuntos `C1(T1)`, `C2(T2)`, `C3(T3)` é empurrado para fora do laço mais interno para o laço mais externo, onde pode ser avaliado. Se `C1(T1)` for uma condição muito restritiva, essa empurrada para baixo da condição pode reduzir significativamente o número de linhas da tabela `T1` passadas para os laços internos. Como resultado, o tempo de execução da consulta pode melhorar imensamente.

Para uma consulta com junções externas, a condição `WHERE` deve ser verificada apenas depois de ter sido encontrado que a linha atual da tabela externa tem uma correspondência nas tabelas internas. Assim, a otimização de empurrar condições para fora dos laços aninhados internos não pode ser aplicada diretamente a consultas com junções externas. Aqui, devemos introduzir predicados empurrados para baixo condicionalmente, protegidos pelas bandeiras que são ativadas quando uma correspondência é encontrada.

Lembre-se deste exemplo com junções externas:

```
P(T1,T2,T3)=C1(T1) AND C(T2) AND C3(T3)
```

Para esse exemplo, o algoritmo de laço aninhado usando predicados empurrados para baixo protegidos por bandeiras parece assim:

```
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

Em geral, predicados empurrados para baixo podem ser extraídos de condições de junção, como `P1(T1, T2)` e `P(T2, T3)`. Neste caso, um predicado empurrado para baixo também é protegido por uma bandeira que impede a verificação do predicado para a linha `NULL` complementada gerada pela operação de junção externa correspondente.

O acesso por chave de uma tabela interna para outra na mesma junção aninhada é proibido se for induzido por um predicado da condição `WHERE`.