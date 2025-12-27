### 12.8.4 Coerção de Cotações em Expressões

Na grande maioria das declarações, é óbvio qual a codificação que o MySQL usa para resolver uma operação de comparação. Por exemplo, nos seguintes casos, deve ficar claro que a codificação é a da coluna `x`:

```
SELECT x FROM T ORDER BY x;
SELECT x FROM T WHERE x = x;
SELECT DISTINCT x FROM T;
```

No entanto, com múltiplos operandos, pode haver ambiguidade. Por exemplo, esta declaração realiza uma comparação entre a coluna `x` e a literal de string `'Y'`:

```
SELECT x FROM T WHERE x = 'Y';
```

Se `x` e `'Y'` tiverem a mesma codificação, não há ambiguidade sobre a codificação a ser usada para a comparação. Mas se tiverem codificações diferentes, a comparação deve usar a codificação de `x`, ou de `'Y'`. Tanto `x` quanto `'Y'` têm codificações, então qual codificação tem precedência?

Uma mistura de codificações também pode ocorrer em contextos diferentes da comparação. Por exemplo, uma operação de concatenação de múltiplos argumentos, como  `CONCAT(x,'Y')`, combina seus argumentos para produzir uma única string. Qual codificação o resultado deve ter?

Para resolver questões como essas, o MySQL verifica se a codificação de um item pode ser coercida para a codificação do outro. O MySQL atribui valores de coerção da seguinte forma:

* Uma cláusula explícita `COLLATE` tem um valor de coerção de 0 (não coercível de forma alguma).
* A concatenação de duas strings com codificações diferentes tem um valor de coerção de 1.
* A codificação de uma coluna ou de um parâmetro de rotina armazenada ou de uma variável local tem um valor de coerção de 2.
* Uma "constante do sistema" (a string retornada por funções como  `USER()` ou `VERSION()`) tem um valor de coerção de 3.
* A codificação de uma literal tem um valor de coerção de 4.
* A codificação de um valor numérico ou temporal tem um valor de coerção de 5.
* `NULL` ou uma expressão derivada de `NULL` tem um valor de coerção de 6.

O MySQL usa valores de coerção com as seguintes regras para resolver ambiguidades:

* Use a codificação com o valor de coerção mais baixo.
* Se ambos os lados tiverem a mesma coerção, então:

+ Se ambos os lados forem Unicode, ou se ambos os lados não forem Unicode, há um erro.
+ Se um dos lados tiver um conjunto de caracteres Unicode e o outro tiver um conjunto de caracteres não Unicode, o lado com o conjunto de caracteres Unicode vence, e a conversão automática de conjunto de caracteres é aplicada ao lado não Unicode. Por exemplo, a seguinte declaração não retorna um erro:

    ```
    SELECT CONCAT(utf8mb4_column, latin1_column) FROM t1;
    ```

    Ela retorna um resultado que tem um conjunto de caracteres de `utf8mb4` e a mesma ordenação que `utf8mb4_column`. Os valores de `latin1_column` são convertidos automaticamente para `utf8mb4` antes da concatenação.
+ Para uma operação com operandos do mesmo conjunto de caracteres, mas que misturam uma ordenação `_bin` e uma ordenação `_ci` ou `_cs`, a ordenação `_bin` é usada. Isso é semelhante a como operações que misturam strings não binárias e binárias avaliam os operandos como strings binárias, aplicadas a ordenações em vez de tipos de dados.
+ Embora a conversão automática não esteja no padrão SQL, o padrão diz que todo conjunto de caracteres é (em termos de caracteres suportados) um “subconjunto” do Unicode. Como é um princípio bem conhecido que “o que se aplica a um superconjunto pode se aplicar a um subconjunto”, acreditamos que uma ordenação para Unicode pode ser aplicada para comparações com strings não Unicode. Mais genericamente, o MySQL usa o conceito de repertório de conjuntos de caracteres, que às vezes pode ser usado para determinar relações de subconjunto entre conjuntos de caracteres e permitir a conversão de operandos em operações que, de outra forma, produziriam um erro. Veja  Seção 12.2.1, “Repertório de Conjuntos de Caracteres”.
A tabela a seguir ilustra algumas aplicações das regras anteriores.

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Comparação</th> <th>Coligação Usada</th> </tr></thead><tbody><tr> <td><code>column1 = 'A'</code></td> <td>Use a coligação de <code>column1</code></td> </tr><tr> <td><code>column1 = 'A' COLLATE x</code></td> <td>Use a coligação de <code>'A' COLLATE x</code></td> </tr><tr> <td><code>column1 COLLATE x = 'A' COLLATE y</code></td> <td>Erro</td> </tr></tbody></table>

Para determinar a coercibilidade de uma expressão de string, use a função `COERCIBILITY()` (consulte a Seção 14.15, “Funções de Informação”):

```
mysql> SELECT COERCIBILITY(_utf8mb4'A' COLLATE utf8mb4_bin);
        -> 0
mysql> SELECT COERCIBILITY(VERSION());
        -> 3
mysql> SELECT COERCIBILITY('A');
        -> 4
mysql> SELECT COERCIBILITY(1000);
        -> 5
mysql> SELECT COERCIBILITY(NULL);
        -> 6
```

Para conversão implícita de um valor numérico ou temporal para uma string, como ocorre com o argumento `1` na expressão  `CONCAT(1, 'abc')`, o resultado é uma string de caracteres (não binária) que tem um conjunto de caracteres e uma coligação determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Consulte a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.