### 10.8.4 Coercibilidade de Collation em Expressões

Na grande maioria das instruções, é óbvio qual collation o MySQL usa para resolver uma operação de comparação. Por exemplo, nos seguintes casos, deve ficar claro que o collation é o collation da coluna `x`:

```sql
SELECT x FROM T ORDER BY x;
SELECT x FROM T WHERE x = x;
SELECT DISTINCT x FROM T;
```

No entanto, com múltiplos operandos, pode haver ambiguidade. Por exemplo, esta instrução executa uma comparação entre a coluna `x` e o literal string `'Y'`:

```sql
SELECT x FROM T WHERE x = 'Y';
```

Se `x` e `'Y'` tiverem o mesmo collation, não há ambiguidade sobre qual collation usar para a comparação. Mas se eles tiverem collations diferentes, a comparação deve usar o collation de `x` ou de `'Y'`? Ambos, `x` e `'Y'`, têm collations, então qual collation tem precedência?

Uma mistura de collations também pode ocorrer em contextos que não sejam de comparação. Por exemplo, uma operação de concatenação de múltiplos argumentos, como `CONCAT(x,'Y')`, combina seus argumentos para produzir uma única string. Que collation o resultado deve ter?

Para resolver questões como essas, o MySQL verifica se o collation de um item pode ser coagido (coerced) ao collation do outro. O MySQL atribui valores de coercibilidade da seguinte forma:

* Uma cláusula `COLLATE` explícita tem uma coercibilidade de 0 (não coercível de forma alguma).

* A concatenação de duas strings com collations diferentes tem uma coercibilidade de 1.

* O collation de uma coluna ou de um parâmetro de stored routine ou variável local tem uma coercibilidade de 2.

* Uma “constante de sistema” (a string retornada por funções como `USER()` ou `VERSION()`) tem uma coercibilidade de 3.

* O collation de um literal tem uma coercibilidade de 4.

* O collation de um valor numérico ou temporal tem uma coercibilidade de 5.

* `NULL` ou uma expressão derivada de `NULL` tem uma coercibilidade de 6.

O MySQL usa valores de coercibilidade com as seguintes regras para resolver ambiguidades:

* Use o collation com o valor de coercibilidade mais baixo.
* Se ambos os lados tiverem a mesma coercibilidade, então:

  + Se ambos os lados forem Unicode, ou ambos os lados não forem Unicode, é um erro.

  + Se um dos lados tiver um character set Unicode e o outro lado tiver um character set não-Unicode, o lado com o character set Unicode vence, e a conversão automática do character set é aplicada ao lado não-Unicode. Por exemplo, a instrução a seguir não retorna um erro:

    ```sql
    SELECT CONCAT(utf8_column, latin1_column) FROM t1;
    ```

    Isso retorna um resultado que tem um character set de `utf8` e o mesmo collation que `utf8_column`. Os valores de `latin1_column` são automaticamente convertidos para `utf8` antes da concatenação.

  + Para uma operação com operandos do mesmo character set, mas que misturam um collation `_bin` e um collation `_ci` ou `_cs`, o collation `_bin` é usado. Isso é semelhante a como as operações que misturam strings não binárias e binárias avaliam os operandos como strings binárias, aplicado a collations em vez de data types.

Embora a conversão automática não esteja no padrão SQL, o padrão diz que todo character set é (em termos de caracteres suportados) um “subset” (subconjunto) de Unicode. Como é um princípio bem conhecido que “o que se aplica a um superset pode se aplicar a um subset”, acreditamos que um collation para Unicode pode se aplicar a comparações com strings não-Unicode. Mais genericamente, o MySQL usa o conceito de repertório de character set, que às vezes pode ser usado para determinar relações de subset entre character sets e permitir a conversão de operandos em operações que, de outra forma, produziriam um erro. Consulte a Seção 10.2.1, “Character Set Repertoire”.

A tabela a seguir ilustra algumas aplicações das regras precedentes.

| Comparação | Collation Utilizado |
| :--- | :--- |
| `column1 = 'A'` | Use o collation de `column1` |
| `column1 = 'A' COLLATE x` | Use o collation de `'A' COLLATE x` |
| `column1 COLLATE x = 'A' COLLATE y` | Erro |

Para determinar a coercibilidade de uma expressão string, use a função `COERCIBILITY()` (consulte a Seção 12.15, “Information Functions”):

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

Para a conversão implícita de um valor numérico ou temporal para uma string, como ocorre para o argumento `1` na expressão `CONCAT(1, 'abc')`, o resultado é uma string de caractere (não binária) que tem um character set e collation determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Consulte a Seção 12.3, “Type Conversion in Expression Evaluation”.