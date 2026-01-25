### 10.8.4 Coercibilidade de Collation em Expressões

Na grande maioria das instruções, é óbvio qual collation o MySQL usa para resolver uma operação de comparação. Por exemplo, nos seguintes casos, deve ficar claro que o collation é o collation da coluna `x`:

```sql
SELECT x FROM T ORDER BY x;
SELECT x FROM T WHERE x = x;
SELECT DISTINCT x FROM T;
```

No entanto, com múltiplos operands, pode haver ambiguidade. Por exemplo, esta instrução realiza uma comparação entre a coluna `x` e o string literal `'Y'`:

```sql
SELECT x FROM T WHERE x = 'Y';
```

Se `x` e `'Y'` tiverem o mesmo collation, não há ambiguidade sobre qual collation usar para a comparação. Mas se eles tiverem collations diferentes, a comparação deve usar o collation de `x` ou de `'Y'`? Ambos, `x` e `'Y'`, têm collations. Então, qual collation tem precedência?

Uma mistura de collations também pode ocorrer em contextos que não sejam de comparação. Por exemplo, uma operação de concatenação de múltiplos argumentos, como `CONCAT(x,'Y')`, combina seus argumentos para produzir um único string. Qual collation o resultado deve ter?

Para resolver questões como estas, o MySQL verifica se o collation de um item pode ser coagido ao collation do outro. O MySQL atribui valores de coercibilidade da seguinte forma:

* Uma cláusula `COLLATE` explícita tem uma coercibilidade de 0 (não coercível de forma alguma).

* A concatenação de dois strings com collations diferentes tem uma coercibilidade de 1.

* O collation de uma column ou de um parameter de rotina armazenada ou variável local tem uma coercibilidade de 2.

* Uma "constante de sistema" (o string retornado por funções como `USER()` ou `VERSION()`) tem uma coercibilidade de 3.

* O collation de um literal tem uma coercibilidade de 4.
* O collation de um valor numérico ou temporal tem uma coercibilidade de 5.

* `NULL` ou uma expressão derivada de `NULL` tem uma coercibilidade de 6.

O MySQL usa valores de coercibilidade com as seguintes regras para resolver ambiguidades:

* Use o collation com o menor valor de coercibilidade.
* Se ambos os lados tiverem a mesma coercibilidade, então:

  + Se ambos os lados forem Unicode, ou se ambos os lados não forem Unicode, é um erro.

  + Se um dos lados tiver um character set Unicode, e o outro lado tiver um character set não-Unicode, o lado com o character set Unicode prevalece, e a conversão automática de character set é aplicada ao lado não-Unicode. Por exemplo, a seguinte instrução não retorna um erro:

    ```sql
    SELECT CONCAT(utf8_column, latin1_column) FROM t1;
    ```

    Ela retorna um resultado que tem um character set `utf8` e o mesmo collation que `utf8_column`. Os valores de `latin1_column` são automaticamente convertidos para `utf8` antes da concatenação.

  + Para uma operação com operands do mesmo character set, mas que misturam um collation `_bin` e um collation `_ci` ou `_cs`, o collation `_bin` é usado. Isso é semelhante a como as operações que misturam strings não binários e binários avaliam os operands como strings binários, aplicado a collations em vez de tipos de dados.

Embora a conversão automática não esteja no padrão SQL, o padrão afirma que todo character set é (em termos de caracteres suportados) um "subset" do Unicode. Por ser um princípio bem conhecido que "o que se aplica a um superset pode se aplicar a um subset", acreditamos que um collation para Unicode pode ser aplicado para comparações com strings não-Unicode. Mais geralmente, o MySQL usa o conceito de repertório de character set, que pode às vezes ser usado para determinar relações de subset entre character sets e habilitar a conversão de operands em operações que, de outra forma, produziriam um erro. Veja Seção 10.2.1, "Repertório de Character Set".

A tabela a seguir ilustra algumas aplicações das regras precedentes.

| Comparação | Collation Usado |
|---|---|
| `column1 = 'A'` | Usa o collation de `column1` |
| `column1 = 'A' COLLATE x` | Usa o collation de `'A' COLLATE x` |
| `column1 COLLATE x = 'A' COLLATE y` | Erro |

Para determinar a coercibilidade de uma expressão string, use a função `COERCIBILITY()` (veja Seção 12.15, "Funções de Informação"):

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

Para a conversão implícita de um valor numérico ou temporal para um string, como ocorre para o argumento `1` na expressão `CONCAT(1, 'abc')`, o resultado é um string de caractere (não binário) que tem um character set e collation determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Veja Seção 12.3, "Conversão de Tipo na Avaliação de Expressão".