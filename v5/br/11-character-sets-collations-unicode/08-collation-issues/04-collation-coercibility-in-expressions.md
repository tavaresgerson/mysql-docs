### 10.8.4 Coerção na Cotação de Expressões

Na grande maioria das declarações, é óbvio qual é a collation que o MySQL usa para resolver uma operação de comparação. Por exemplo, nos seguintes casos, deve ficar claro que a collation é a collation da coluna `x`:

```sql
SELECT x FROM T ORDER BY x;
SELECT x FROM T WHERE x = x;
SELECT DISTINCT x FROM T;
```

No entanto, com múltiplos operadores, pode haver ambiguidade. Por exemplo, esta declaração realiza uma comparação entre a coluna `x` e o literal de string `'Y'`:

```sql
SELECT x FROM T WHERE x = 'Y';
```

Se `x` e `'Y'` tiverem a mesma ordem de comparação, não há ambiguidade sobre a ordem de comparação a ser usada. Mas se tiverem ordens de comparação diferentes, a comparação deve usar a ordem de comparação de `x` ou de `'Y'`. Ambos `x` e `'Y'` têm ordens de comparação, então qual ordem de comparação tem precedência?

Uma mistura de collation também pode ocorrer em contextos diferentes da comparação. Por exemplo, uma operação de concatenação de múltiplos argumentos, como `CONCAT(x, 'Y')`, combina seus argumentos para produzir uma única string. Qual collation o resultado deve ter?

Para resolver questões como essas, o MySQL verifica se a collation de um item pode ser coercida para a collation do outro. O MySQL atribui valores de coercibilidade da seguinte forma:

- Uma cláusula `COLLATE` explícita tem uma coercibilidade de 0 (não é coercitiva).

- A concatenação de duas cadeias com colorações diferentes tem uma coercibilidade de 1.

- A colagem de uma coluna ou de um parâmetro de rotina armazenada ou de uma variável local tem uma coercibilidade de 2.

- Uma "constante do sistema" (a string retornada por funções como `USER()` ou `VERSION()`) tem uma coercibilidade de 3.

- A collation de um literal tem uma coercibilidade de 4.

- A colagem de um valor numérico ou temporal tem uma coercibilidade de 5.

- `NULL` ou uma expressão derivada de `NULL` tem uma coercibilidade de 6.

O MySQL utiliza valores de coercibilidade com as seguintes regras para resolver ambiguidades:

- Use a ordenação com o menor valor de coercibilidade.
- Se ambos os lados tiverem a mesma coercibilidade, então:

  - Se ambos os lados forem Unicode ou se ambos os lados não forem Unicode, será um erro.

  - Se um dos lados tiver um conjunto de caracteres Unicode e o outro tiver um conjunto de caracteres não Unicode, o lado com o conjunto de caracteres Unicode vence, e a conversão automática de conjunto de caracteres é aplicada ao lado não Unicode. Por exemplo, a seguinte declaração não retorna um erro:

    ```sql
    SELECT CONCAT(utf8_column, latin1_column) FROM t1;
    ```

    Ele retorna um resultado que tem um conjunto de caracteres de `utf8` e a mesma ordem de classificação que `utf8_column`. Os valores de `latin1_column` são automaticamente convertidos para `utf8` antes da concatenação.

  - Para uma operação com operandos do mesmo conjunto de caracteres, mas que misturam uma classificação `_bin` e uma classificação `_ci` ou `_cs`, a classificação `_bin` é usada. Isso é semelhante à forma como operações que misturam strings não binárias e binárias avaliam os operandos como strings binárias, aplicadas a classificações em vez de tipos de dados.

Embora a conversão automática não esteja no padrão SQL, o padrão diz que cada conjunto de caracteres é (em termos de caracteres suportados) um “subconjunto” do Unicode. Como é um princípio bem conhecido que “o que se aplica a um superconjunto pode se aplicar a um subconjunto”, acreditamos que uma cotação para o Unicode pode ser aplicada para comparações com strings não Unicode. Mais genericamente, o MySQL usa o conceito de repertório de conjuntos de caracteres, que às vezes pode ser usado para determinar relações de subconjuntos entre conjuntos de caracteres e permitir a conversão de operandos em operações que, de outra forma, produziriam um erro. Veja a Seção 10.2.1, “Repertório de Conjuntos de Caracteres”.

A tabela a seguir ilustra algumas aplicações das regras anteriores.

<table summary="Comparativos e a comparação utilizada para cada comparação."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Comparação</th> <th>Collation Used</th> </tr></thead><tbody><tr> <td><code>column1 = 'A'</code></td> <td>Utilize a colagem de <code>column1</code></td> </tr><tr> <td><code>column1 = 'A' COLLATE x</code></td> <td>Utilize a colagem de <code>'A' COLLATE x</code></td> </tr><tr> <td><code>column1 COLLATE x = 'A' COLLATE y</code></td> <td>Erro</td> </tr></tbody></table>

Para determinar a coercibilidade de uma expressão de cadeia, use a função `COERCIBILITY()` (consulte a Seção 12.15, “Funções de Informação”):

```sql
mysql> SELECT COERCIBILITY(_utf8'A' COLLATE utf8_bin);
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

Para a conversão implícita de um valor numérico ou temporal em uma string, como ocorre com o argumento `1` na expressão `CONCAT(1, 'abc')`, o resultado é uma string de caracteres (não binária) que tem um conjunto de caracteres e uma ordenação determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Veja a Seção 12.3, “Conversão de Tipo na Avaliação da Expressão”.
