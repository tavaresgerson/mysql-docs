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

Se `x` e `'Y'` tiverem a mesma codificação, não há ambiguidade sobre a codificação a ser usada para a comparação. Mas se tiverem codificações diferentes, a comparação deve usar a codificação de `x`, ou de `'Y'`, não é mesmo? Tanto `x` quanto `'Y'` têm codificações, então qual codificação tem precedência?

Uma mistura de codificações também pode ocorrer em contextos diferentes da comparação. Por exemplo, uma operação de concatenação de múltiplos argumentos, como `CONCAT(x,'Y')`, combina seus argumentos para produzir uma única string. Qual codificação o resultado deve ter?

Para resolver questões como essas, o MySQL verifica se a codificação de um item pode ser coercida para a codificação do outro. O MySQL atribui valores de coerção da seguinte forma:

* Uma cláusula explícita `COLLATE` tem uma coerção de 0 (não coercível de forma alguma).

* A codificação de uma coluna ou de um parâmetro de rotina armazenada ou variável local tem uma coerção de 2.

* Uma "constante do sistema" (a string retornada por funções como `USER()` ou `VERSION()`) tem uma coerção de 3.

* A codificação de uma literal tem uma coerção de 4.
* A codificação de um valor numérico ou temporal tem uma coerção de 5.

* `NULL` ou uma expressão derivada de `NULL` tem uma coerção de 6.

* A concatenação de duas cadeias herda a maior força de qualquer um dos argumentos, a menos que ambas as cadeias tenham a mesma força e o mesmo conjunto de caracteres, mas coligaciones diferentes, caso em que a coercibilidade é 7.

Um exemplo usando a função `COERCIBILITY()` é mostrado aqui:

```
  mysql> SET @x = 'x' COLLATE utf8mb4_0900_ai_ci;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @y = 'y' COLLATE utf8mb4_0900_as_cs;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT COERCIBILITY(CONCAT(@x, @y));
  +------------------------------+
  | COERCIBILITY(CONCAT(@x, @y)) |
  +------------------------------+
  |                            7 |
  +------------------------------+
  1 row in set (0.00 sec)
  ```

Nota

`1` como valor de coercibilidade não é usado no MySQL 9.5, mas ainda é considerado válido para compatibilidade reversa. (Bug #37285902)

O MySQL usa valores de coercibilidade com as seguintes regras para resolver ambiguidades:

* Use a coligação com o menor valor de coercibilidade.
* Se ambos os lados tiverem a mesma coercibilidade, então:

  + Se ambos os lados forem Unicode, ou ambos os lados não forem Unicode, é um erro.

  + Se um dos lados tiver um conjunto de caracteres Unicode, e o outro lado tiver um conjunto de caracteres não Unicode, o lado com o conjunto de caracteres Unicode vence, e a conversão automática de conjunto de caracteres é aplicada ao lado não Unicode. Por exemplo, a seguinte declaração não retorna um erro:

    ```
    SELECT CONCAT(utf8mb4_column, latin1_column) FROM t1;
    ```

    Ela retorna um resultado que tem um conjunto de caracteres de `utf8mb4` e a mesma coligação que `utf8mb4_column`. Os valores de `latin1_column` são automaticamente convertidos para `utf8mb4` antes da concatenação.

  + Para uma operação com operandos do mesmo conjunto de caracteres, mas que misturam uma coligação `_bin` e uma coligação `_ci` ou `_cs`, a coligação `_bin` é usada. Isso é semelhante a como operações que misturam strings não binárias e binárias avaliam os operandos como strings binárias, aplicadas a coligaciones em vez de tipos de dados.

Embora a conversão automática não esteja no padrão SQL, o padrão diz que cada conjunto de caracteres é (em termos de caracteres suportados) um “subconjunto” do Unicode. Como é um princípio bem conhecido que “o que se aplica a um superconjunto pode se aplicar a um subconjunto”, acreditamos que uma cotação para o Unicode pode ser usada para comparações com strings não Unicode. De forma mais geral, o MySQL usa o conceito de repertório de conjuntos de caracteres, que às vezes pode ser usado para determinar relações de subconjuntos entre conjuntos de caracteres e permitir a conversão de operandos em operações que, de outra forma, produziriam um erro. Veja a Seção 12.2.1, “Repertório de Conjuntos de Caracteres”.

A tabela a seguir ilustra algumas aplicações das regras anteriores.

<table summary="Comparações e a cotação usada para cada comparação."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Comparações</th> <th>Cotação Usada</th> </tr></thead><tbody><tr> <td><code>column1 = 'A'</code></td> <td>Use a cotação de <code>column1</code></td> </tr><tr> <td><code>column1 = 'A' COLLATE x</code></td> <td>Use a cotação de <code>'A' COLLATE x</code></td> </tr><tr> <td><code>column1 COLLATE x = 'A' COLLATE y</code></td> <td>Erro</td> </tr></tbody></table>

Para determinar a coercibilidade de uma expressão de string, use a função `COERCIBILITY()` (veja a Seção 14.15, “Funções de Informação”):

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

Para a conversão implícita de um valor numérico ou temporal para uma string, como ocorre com o argumento `1` na expressão `CONCAT(1, 'abc')`, o resultado é uma string de caracteres (não binária) que tem um conjunto de caracteres e uma ordenação determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.