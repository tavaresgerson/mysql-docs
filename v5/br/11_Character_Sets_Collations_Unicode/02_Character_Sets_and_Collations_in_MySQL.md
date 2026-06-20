## 10.2 Conjuntos de caracteres e codificações no MySQL

O MySQL Server suporta vários conjuntos de caracteres. Para exibir os conjuntos de caracteres disponíveis, use a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS` ou a declaração `SHOW CHARACTER SET`. Uma lista parcial segue. Para informações mais completas, consulte a Seção 10.10, “Conjunto de caracteres e colatinas suportadas”.

```sql
mysql> SHOW CHARACTER SET;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
...
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
...
| utf8     | UTF-8 Unicode                   | utf8_general_ci     |      3 |
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
...
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_general_ci  |      4 |
...
| binary   | Binary pseudo charset           | binary              |      1 |
...
```

Por padrão, a declaração `SHOW CHARACTER SET` exibe todos os conjuntos de caracteres disponíveis. Ela aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de conjuntos de caracteres devem ser correspondidos. Por exemplo:

```sql
mysql> SHOW CHARACTER SET LIKE 'latin%';
+---------+-----------------------------+-------------------+--------+
| Charset | Description                 | Default collation | Maxlen |
+---------+-----------------------------+-------------------+--------+
| latin1  | cp1252 West European        | latin1_swedish_ci |      1 |
| latin2  | ISO 8859-2 Central European | latin2_general_ci |      1 |
| latin5  | ISO 8859-9 Turkish          | latin5_turkish_ci |      1 |
| latin7  | ISO 8859-13 Baltic          | latin7_general_ci |      1 |
+---------+-----------------------------+-------------------+--------+
```

Um conjunto de caracteres dado sempre tem pelo menos uma ordenação, e a maioria dos conjuntos de caracteres tem várias. Para listar as ordenações de exibição para um conjunto de caracteres, use a tabela `INFORMATION_SCHEMA` `COLLATIONS` ou a declaração `SHOW COLLATION`.

Por padrão, a declaração `SHOW COLLATION` exibe todas as colatinas disponíveis. Ela aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de colatinas devem ser exibidos. Por exemplo, para ver as colatinas para o conjunto de caracteres padrão, `latin1` (cp1252 da Europa Ocidental), use esta declaração:

```sql
mysql> SHOW COLLATION WHERE Charset = 'latin1';
+-------------------+---------+----+---------+----------+---------+
| Collation         | Charset | Id | Default | Compiled | Sortlen |
+-------------------+---------+----+---------+----------+---------+
| latin1_german1_ci | latin1  |  5 |         | Yes      |       1 |
| latin1_swedish_ci | latin1  |  8 | Yes     | Yes      |       1 |
| latin1_danish_ci  | latin1  | 15 |         | Yes      |       1 |
| latin1_german2_ci | latin1  | 31 |         | Yes      |       2 |
| latin1_bin        | latin1  | 47 |         | Yes      |       1 |
| latin1_general_ci | latin1  | 48 |         | Yes      |       1 |
| latin1_general_cs | latin1  | 49 |         | Yes      |       1 |
| latin1_spanish_ci | latin1  | 94 |         | Yes      |       1 |
+-------------------+---------+----+---------+----------+---------+
```

As colatações `latin1` têm os seguintes significados.

<table summary="latin1 character set collations, as described in the preceding example, and the meaning of each collation."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Collation</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>latin1_bin</code></td> <td>Binário de acordo com<code>latin1</code>codificação</td> </tr><tr> <td><code>latin1_danish_ci</code></td> <td>Dinamarquês/Norueguesa</td> </tr><tr> <td><code>latin1_general_ci</code></td> <td>Multilíngue (Europa Ocidental)</td> </tr><tr> <td><code>latin1_general_cs</code></td> <td>Multilíngue (ISO Europa Ocidental), sensível ao caso</td> </tr><tr> <td><code>latin1_german1_ci</code></td> <td>alemão DIN-1 (ordem do dicionário)</td> </tr><tr> <td><code>latin1_german2_ci</code></td> <td>alemão DIN-2 (ordem de livro telefônico)</td> </tr><tr> <td><code>latin1_spanish_ci</code></td> <td>Espanhol moderno</td> </tr><tr> <td><code>latin1_swedish_ci</code></td> <td>Sueca/Finlandesa</td> </tr></tbody></table>

As refeições têm essas características gerais:

* Duas diferentes conjuntos de caracteres não podem ter a mesma ordem de classificação.
* Cada conjunto de caracteres tem uma *ordem de classificação padrão*. Por exemplo, as ordens de classificação padrão para `latin1` e `utf8` são, respectivamente, `latin1_swedish_ci` e `utf8_general_ci`. A tabela `INFORMATION_SCHEMA` `CHARACTER_SETS` e a declaração `SHOW CHARACTER SET` indicam a ordem de classificação padrão para cada conjunto de caracteres. A tabela `INFORMATION_SCHEMA` `COLLATIONS` e a declaração `SHOW COLLATION` têm uma coluna que indica, para cada ordem de classificação, se é a padrão para seu conjunto de caracteres (`Yes` se for, vazio se não for).

* Os nomes de coligação começam com o nome do conjunto de caracteres com o qual estão associados, geralmente seguido por um ou mais sufixos que indicam outras características de coligação. Para informações adicionais sobre as convenções de nomeação, consulte a Seção 10.3.1, “Convenções de Nomenclatura de Coligação”.

Quando um conjunto de caracteres tem várias codificações, pode não ser claro qual codificação é mais adequada para um aplicativo específico. Para evitar escolher uma codificação inadequada, realize algumas comparações com valores de dados representativos para garantir que uma determinada codificação ordene os valores da maneira que você espera.

### 10.2.1 Repertório de Caracteres

O repertório de um conjunto de caracteres é a coleção de caracteres no conjunto.

As expressões de cadeia têm um atributo de repertório, que pode ter dois valores:

* `ASCII`: A expressão pode conter apenas caracteres ASCII; ou seja, caracteres no intervalo Unicode `U+0000` a `U+007F`.

* `UNICODE`: A expressão pode conter caracteres no intervalo de Unicode `U+0000` a `U+10FFFF`. Isso inclui caracteres no intervalo da Linguagem Multilíngue Básica (BMP) (`U+0000` a `U+FFFF`) e caracteres suplementares fora do intervalo da BMP (`U+10000` a `U+10FFFF`).

A faixa `ASCII` é um subconjunto da faixa `UNICODE`, portanto, uma string com repertório `ASCII` pode ser convertida com segurança, sem perda de informações, para o conjunto de caracteres de qualquer string com repertório `UNICODE`. Também pode ser convertida com segurança para qualquer conjunto de caracteres que seja um subconjunto do conjunto de caracteres `ascii`. (Todos os conjuntos de caracteres do MySQL são subconjuntos de `ascii`, com exceção de `swe7`, que reutiliza alguns caracteres de pontuação para caracteres acentuados suecos.)

O uso do repertório permite a conversão de conjuntos de caracteres em expressões para muitos casos em que o MySQL, de outra forma, retornaria um erro de “mistura ilegal de colatinas” quando as regras para a coercibilidade da colatina são insuficientes para resolver ambiguidades. (Para informações sobre coercibilidade, consulte a Seção 10.8.4, “Coercibilidade de Colatinas em Expressões”.)

A discussão a seguir fornece exemplos de expressões e seus repertórios, e descreve como o uso do repertório altera a avaliação da expressão de cordas.

* O repertório para uma constante de cadeia depende do conteúdo da cadeia e pode diferir do repertório do conjunto de caracteres de cadeia. Considere essas declarações:

  ```sql
  SET NAMES utf8; SELECT 'abc';
  SELECT _utf8'def';
  SELECT N'MySQL';
  ```

Embora o conjunto de caracteres seja `utf8` em cada um dos casos anteriores, as cadeias de caracteres não contêm, na verdade, caracteres fora do intervalo ASCII, portanto, seu repertório é `ASCII` em vez de `UNICODE`.

* Uma coluna com o conjunto de caracteres `ascii` tem `ASCII` repertório devido ao seu conjunto de caracteres. Na tabela a seguir, `c1` tem `ASCII` repertório:

  ```sql
  CREATE TABLE t1 (c1 CHAR(1) CHARACTER SET ascii);
  ```

O exemplo a seguir ilustra como o repertório permite determinar um resultado em um caso em que ocorre um erro sem repertório:

  ```sql
  CREATE TABLE t1 (
    c1 CHAR(1) CHARACTER SET latin1,
    c2 CHAR(1) CHARACTER SET ascii
  );
  INSERT INTO t1 VALUES ('a','b');
  SELECT CONCAT(c1,c2) FROM t1;
  ```

Sem repertório, esse erro ocorre:

  ```sql
  ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
  and (ascii_general_ci,IMPLICIT) for operation 'concat'
  ```

A conversão de um repertório de subconjunto para superconjunto (`ascii` para `latin1`) pode ocorrer e um resultado é retornado:

  ```sql
  +---------------+
  | CONCAT(c1,c2) |
  +---------------+
  | ab            |
  +---------------+
  ```

* Funções com um argumento de cadeia herdam o repertório de seu argumento. O resultado de `UPPER(_utf8'abc')` tem o repertório de `ASCII`, pois seu argumento tem o repertório de `ASCII`. (Apesar da introdução de `_utf8`, a cadeia `'abc'` não contém caracteres fora da faixa ASCII.)

* Para funções que retornam uma string, mas não têm argumentos de string e utilizam `character_set_connection` como conjunto de caracteres de resultado, o repertório de resultado é `ASCII` se `character_set_connection` é `ascii`, e `UNICODE` caso contrário:

  ```sql
  FORMAT(numeric_column, 4);
  ```

O uso do repertório muda a forma como o MySQL avalia o seguinte exemplo:

  ```sql
  SET NAMES ascii;
  CREATE TABLE t1 (a INT, b VARCHAR(10) CHARACTER SET latin1);
  INSERT INTO t1 VALUES (1,'b');
  SELECT CONCAT(FORMAT(a, 4), b) FROM t1;
  ```

Sem repertório, esse erro ocorre:

  ```sql
  ERROR 1267 (HY000): Illegal mix of collations (ascii_general_ci,COERCIBLE)
  and (latin1_swedish_ci,IMPLICIT) for operation 'concat'
  ```

Com o repertório, é retornado um resultado:

  ```sql
  +-------------------------+
  | CONCAT(FORMAT(a, 4), b) |
  +-------------------------+
  | 1.0000b                 |
  +-------------------------+
  ```

* Funções com dois ou mais argumentos de cadeia utilizam o repertório de argumentos "mais amplo" para o repertório de resultados, onde `UNICODE` é mais amplo do que `ASCII`. Considere as seguintes chamadas de `CONCAT()`:

  ```sql
  CONCAT(_ucs2 X'0041', _ucs2 X'0042')
  CONCAT(_ucs2 X'0041', _ucs2 X'00C2')
  ```

Para a primeira chamada, o repertório é `ASCII`, porque ambos os argumentos estão dentro do intervalo ASCII. Para a segunda chamada, o repertório é `UNICODE`, porque o segundo argumento está fora do intervalo ASCII.

* O repertório para os valores de retorno de função é determinado com base no repertório dos argumentos que afetam o conjunto de caracteres e a correção do resultado.

  ```sql
  IF(column1 < column2, 'smaller', 'greater')
  ```

O repertório de resultado é `ASCII`, porque os dois argumentos de string (o segundo argumento e o terceiro argumento) têm ambos o repertório `ASCII`. O primeiro argumento não importa para o repertório de resultado, mesmo que a expressão utilize valores de string.

### 10.2.2 UTF-8 para Metadados

Metadados são “os dados sobre os dados”. Qualquer coisa que *descreva* o banco de dados — em oposição a ser o *conteúdo* do banco de dados — é metadado. Assim, os nomes de colunas, nomes de bancos de dados, nomes de usuários, nomes de versões e a maioria dos resultados de string de `SHOW` são metadados. Isso também é verdade para o conteúdo das tabelas em `INFORMATION_SCHEMA`, porque essas tabelas, por definição, contêm informações sobre objetos do banco de dados.

A representação dos metadados deve satisfazer esses requisitos:

* Todos os metadados devem estar no mesmo conjunto de caracteres. Caso contrário, nem as declarações `SHOW` nem as declarações `SELECT` para tabelas em `INFORMATION_SCHEMA` funcionariam corretamente, porque diferentes linhas na mesma coluna dos resultados dessas operações seriam em diferentes conjuntos de caracteres.

* Os metadados devem incluir todos os caracteres em todos os idiomas. Caso contrário, os usuários não poderão nomear colunas e tabelas usando seus próprios idiomas.

Para satisfazer ambos os requisitos, o MySQL armazena metadados em um conjunto de caracteres Unicode, ou seja, UTF-8. Isso não causa qualquer interrupção se você nunca usar caracteres acentuados ou não latinos. Mas se você fizer isso, deve estar ciente de que os metadados estão em UTF-8.

Os requisitos de metadados significam que os valores de retorno das funções `USER()`, `CURRENT_USER()`, `SESSION_USER()`, `SYSTEM_USER()`, `DATABASE()` e `VERSION()` têm o conjunto de caracteres UTF-8 por padrão.

O servidor define a variável de sistema `character_set_system` pelo nome do conjunto de caracteres de metadados:

```sql
mysql> SHOW VARIABLES LIKE 'character_set_system';
+----------------------+-------+
| Variable_name        | Value |
+----------------------+-------+
| character_set_system | utf8  |
+----------------------+-------+
```

O armazenamento de metadados usando Unicode *não* significa que o servidor retorna cabeçalhos de colunas e os resultados das funções `DESCRIBE` no conjunto de caracteres `character_set_system`, definido por padrão. Quando você usa `SELECT column1 FROM t`, o próprio nome `column1` é retornado pelo servidor para o cliente no conjunto de caracteres determinado pelo valor da variável do sistema `character_set_results`, que tem um valor padrão de `utf8`. Se você deseja que o servidor retorne os resultados dos metadados de volta em um conjunto de caracteres diferente, use a declaração [`SET NAMES`](set-names.html "13.7.4.3 SET NAMES Statement") para forçar o servidor a realizar a conversão de conjunto de caracteres. [`SET NAMES`](set-names.html "13.7.4.3 SET NAMES Statement") define os `character_set_results` e outras variáveis do sistema relacionadas. (Veja a Seção 10.4, “Conjunto de caracteres e colas de conexão”.) Alternativamente, um programa cliente pode realizar a conversão após receber o resultado do servidor. É mais eficiente para o cliente realizar a conversão, mas essa opção nem sempre está disponível para todos os clientes.

Se `character_set_results` estiver definido como `NULL`, não é realizada nenhuma conversão e o servidor retorna metadados usando seu conjunto de caracteres original (o conjunto indicado por `character_set_system`).

Mensagens de erro devolvidas pelo servidor ao cliente são convertidas automaticamente para o conjunto de caracteres do cliente, assim como os metadados.

Se você estiver usando, por exemplo, a função `USER()` para comparação ou atribuição em uma única declaração, não se preocupe. O MySQL realiza algumas conversões automáticas para você.

```sql
SELECT * FROM t1 WHERE USER() = latin1_column;
```

Isso funciona porque o conteúdo de `latin1_column` é convertido automaticamente para UTF-8 antes da comparação.

```sql
INSERT INTO t1 (latin1_column) SELECT USER();
```

Isso funciona porque o conteúdo de `USER()` é convertido automaticamente para `latin1` antes da atribuição.

Embora a conversão automática não esteja no padrão SQL, o padrão diz que cada conjunto de caracteres é (em termos de caracteres suportados) um “subconjunto” do Unicode. Como é um princípio bem conhecido que “o que se aplica a um superconjunto pode se aplicar a um subconjunto”, acreditamos que uma codificação para Unicode pode ser aplicada para comparações com strings não Unicode. Para mais informações sobre a coerção de strings, consulte a Seção 10.8.4, “Coercibilidade de Codificação em Expressões”.