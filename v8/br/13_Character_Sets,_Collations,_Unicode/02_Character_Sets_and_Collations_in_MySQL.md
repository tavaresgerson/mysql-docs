## 12.2 Conjuntos de caracteres e codificações no MySQL

O MySQL Server suporta vários conjuntos de caracteres, incluindo vários conjuntos de caracteres Unicode. Para exibir os conjuntos de caracteres disponíveis, use a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS` ou a declaração `SHOW CHARACTER SET`. Uma lista parcial segue. Para informações mais completas, consulte a Seção 12.10, “Conjunto de caracteres e colas suportados”.

```
mysql> SHOW CHARACTER SET;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
| binary   | Binary pseudo charset           | binary              |      1 |
...
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
...
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
...
| utf8mb3  | UTF-8 Unicode                   | utf8mb3_general_ci  |      3 |
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_0900_ai_ci  |      4 |
...
```

Por padrão, a declaração `SHOW CHARACTER SET` exibe todos os conjuntos de caracteres disponíveis. Ela aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de conjuntos de caracteres devem ser correspondidos. O exemplo a seguir mostra alguns dos conjuntos de caracteres Unicode (aqueles baseados no Formato de Transformação Unicode):

```
mysql> SHOW CHARACTER SET LIKE 'utf%';
+---------+------------------+--------------------+--------+
| Charset | Description      | Default collation  | Maxlen |
+---------+------------------+--------------------+--------+
| utf16   | UTF-16 Unicode   | utf16_general_ci   |      4 |
| utf16le | UTF-16LE Unicode | utf16le_general_ci |      4 |
| utf32   | UTF-32 Unicode   | utf32_general_ci   |      4 |
| utf8mb3 | UTF-8 Unicode    | utf8mb3_general_ci |      3 |
| utf8mb4 | UTF-8 Unicode    | utf8mb4_0900_ai_ci |      4 |
+---------+------------------+--------------------+--------+
```

Um conjunto de caracteres dado sempre tem pelo menos uma ordenação, e a maioria dos conjuntos de caracteres tem várias. Para listar as ordenações de exibição para um conjunto de caracteres, use a tabela `INFORMATION_SCHEMA` `COLLATIONS` ou a declaração `SHOW COLLATION`.

Por padrão, a declaração `SHOW COLLATION` exibe todas as colatações disponíveis. Ela aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de colatação devem ser exibidos. Por exemplo, para ver as colatações para o conjunto de caracteres padrão, `utf8mb4`, use esta declaração:

```
mysql> SHOW COLLATION WHERE Charset = 'utf8mb4';
+----------------------------+---------+-----+---------+----------+---------+---------------+
| Collation                  | Charset | Id  | Default | Compiled | Sortlen | Pad_attribute |
+----------------------------+---------+-----+---------+----------+---------+---------------+
| utf8mb4_0900_ai_ci         | utf8mb4 | 255 | Yes     | Yes      |       0 | NO PAD        |
| utf8mb4_0900_as_ci         | utf8mb4 | 305 |         | Yes      |       0 | NO PAD        |
| utf8mb4_0900_as_cs         | utf8mb4 | 278 |         | Yes      |       0 | NO PAD        |
| utf8mb4_0900_bin           | utf8mb4 | 309 |         | Yes      |       1 | NO PAD        |
| utf8mb4_bin                | utf8mb4 |  46 |         | Yes      |       1 | PAD SPACE     |
| utf8mb4_croatian_ci        | utf8mb4 | 245 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_cs_0900_ai_ci      | utf8mb4 | 266 |         | Yes      |       0 | NO PAD        |
| utf8mb4_cs_0900_as_cs      | utf8mb4 | 289 |         | Yes      |       0 | NO PAD        |
| utf8mb4_czech_ci           | utf8mb4 | 234 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_danish_ci          | utf8mb4 | 235 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_da_0900_ai_ci      | utf8mb4 | 267 |         | Yes      |       0 | NO PAD        |
| utf8mb4_da_0900_as_cs      | utf8mb4 | 290 |         | Yes      |       0 | NO PAD        |
| utf8mb4_de_pb_0900_ai_ci   | utf8mb4 | 256 |         | Yes      |       0 | NO PAD        |
| utf8mb4_de_pb_0900_as_cs   | utf8mb4 | 279 |         | Yes      |       0 | NO PAD        |
| utf8mb4_eo_0900_ai_ci      | utf8mb4 | 273 |         | Yes      |       0 | NO PAD        |
| utf8mb4_eo_0900_as_cs      | utf8mb4 | 296 |         | Yes      |       0 | NO PAD        |
| utf8mb4_esperanto_ci       | utf8mb4 | 241 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_estonian_ci        | utf8mb4 | 230 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_es_0900_ai_ci      | utf8mb4 | 263 |         | Yes      |       0 | NO PAD        |
| utf8mb4_es_0900_as_cs      | utf8mb4 | 286 |         | Yes      |       0 | NO PAD        |
| utf8mb4_es_trad_0900_ai_ci | utf8mb4 | 270 |         | Yes      |       0 | NO PAD        |
| utf8mb4_es_trad_0900_as_cs | utf8mb4 | 293 |         | Yes      |       0 | NO PAD        |
| utf8mb4_et_0900_ai_ci      | utf8mb4 | 262 |         | Yes      |       0 | NO PAD        |
| utf8mb4_et_0900_as_cs      | utf8mb4 | 285 |         | Yes      |       0 | NO PAD        |
| utf8mb4_general_ci         | utf8mb4 |  45 |         | Yes      |       1 | PAD SPACE     |
| utf8mb4_german2_ci         | utf8mb4 | 244 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_hr_0900_ai_ci      | utf8mb4 | 275 |         | Yes      |       0 | NO PAD        |
| utf8mb4_hr_0900_as_cs      | utf8mb4 | 298 |         | Yes      |       0 | NO PAD        |
| utf8mb4_hungarian_ci       | utf8mb4 | 242 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_hu_0900_ai_ci      | utf8mb4 | 274 |         | Yes      |       0 | NO PAD        |
| utf8mb4_hu_0900_as_cs      | utf8mb4 | 297 |         | Yes      |       0 | NO PAD        |
| utf8mb4_icelandic_ci       | utf8mb4 | 225 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_is_0900_ai_ci      | utf8mb4 | 257 |         | Yes      |       0 | NO PAD        |
| utf8mb4_is_0900_as_cs      | utf8mb4 | 280 |         | Yes      |       0 | NO PAD        |
| utf8mb4_ja_0900_as_cs      | utf8mb4 | 303 |         | Yes      |       0 | NO PAD        |
| utf8mb4_ja_0900_as_cs_ks   | utf8mb4 | 304 |         | Yes      |      24 | NO PAD        |
| utf8mb4_latvian_ci         | utf8mb4 | 226 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_la_0900_ai_ci      | utf8mb4 | 271 |         | Yes      |       0 | NO PAD        |
| utf8mb4_la_0900_as_cs      | utf8mb4 | 294 |         | Yes      |       0 | NO PAD        |
| utf8mb4_lithuanian_ci      | utf8mb4 | 236 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_lt_0900_ai_ci      | utf8mb4 | 268 |         | Yes      |       0 | NO PAD        |
| utf8mb4_lt_0900_as_cs      | utf8mb4 | 291 |         | Yes      |       0 | NO PAD        |
| utf8mb4_lv_0900_ai_ci      | utf8mb4 | 258 |         | Yes      |       0 | NO PAD        |
| utf8mb4_lv_0900_as_cs      | utf8mb4 | 281 |         | Yes      |       0 | NO PAD        |
| utf8mb4_persian_ci         | utf8mb4 | 240 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_pl_0900_ai_ci      | utf8mb4 | 261 |         | Yes      |       0 | NO PAD        |
| utf8mb4_pl_0900_as_cs      | utf8mb4 | 284 |         | Yes      |       0 | NO PAD        |
| utf8mb4_polish_ci          | utf8mb4 | 229 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_romanian_ci        | utf8mb4 | 227 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_roman_ci           | utf8mb4 | 239 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_ro_0900_ai_ci      | utf8mb4 | 259 |         | Yes      |       0 | NO PAD        |
| utf8mb4_ro_0900_as_cs      | utf8mb4 | 282 |         | Yes      |       0 | NO PAD        |
| utf8mb4_ru_0900_ai_ci      | utf8mb4 | 306 |         | Yes      |       0 | NO PAD        |
| utf8mb4_ru_0900_as_cs      | utf8mb4 | 307 |         | Yes      |       0 | NO PAD        |
| utf8mb4_sinhala_ci         | utf8mb4 | 243 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_sk_0900_ai_ci      | utf8mb4 | 269 |         | Yes      |       0 | NO PAD        |
| utf8mb4_sk_0900_as_cs      | utf8mb4 | 292 |         | Yes      |       0 | NO PAD        |
| utf8mb4_slovak_ci          | utf8mb4 | 237 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_slovenian_ci       | utf8mb4 | 228 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_sl_0900_ai_ci      | utf8mb4 | 260 |         | Yes      |       0 | NO PAD        |
| utf8mb4_sl_0900_as_cs      | utf8mb4 | 283 |         | Yes      |       0 | NO PAD        |
| utf8mb4_spanish2_ci        | utf8mb4 | 238 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_spanish_ci         | utf8mb4 | 231 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_sv_0900_ai_ci      | utf8mb4 | 264 |         | Yes      |       0 | NO PAD        |
| utf8mb4_sv_0900_as_cs      | utf8mb4 | 287 |         | Yes      |       0 | NO PAD        |
| utf8mb4_swedish_ci         | utf8mb4 | 232 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_tr_0900_ai_ci      | utf8mb4 | 265 |         | Yes      |       0 | NO PAD        |
| utf8mb4_tr_0900_as_cs      | utf8mb4 | 288 |         | Yes      |       0 | NO PAD        |
| utf8mb4_turkish_ci         | utf8mb4 | 233 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_unicode_520_ci     | utf8mb4 | 246 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_unicode_ci         | utf8mb4 | 224 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_vietnamese_ci      | utf8mb4 | 247 |         | Yes      |       8 | PAD SPACE     |
| utf8mb4_vi_0900_ai_ci      | utf8mb4 | 277 |         | Yes      |       0 | NO PAD        |
| utf8mb4_vi_0900_as_cs      | utf8mb4 | 300 |         | Yes      |       0 | NO PAD        |
| utf8mb4_zh_0900_as_cs      | utf8mb4 | 308 |         | Yes      |       0 | NO PAD        |
+----------------------------+---------+-----+---------+----------+---------+---------------+
```

Para mais informações sobre essas codificações, consulte a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

As refeições têm essas características gerais:

* Duas diferentes conjuntos de caracteres não podem ter a mesma ordem de classificação.
* Cada conjunto de caracteres tem uma *ordem de classificação padrão*. Por exemplo, as ordens de classificação padrão para `utf8mb4` e `latin1` são, respectivamente, `utf8mb4_0900_ai_ci` e `latin1_swedish_ci`. A tabela `INFORMATION_SCHEMA` `CHARACTER_SETS` e a declaração `SHOW CHARACTER SET` indicam a ordem de classificação padrão para cada conjunto de caracteres. A tabela `INFORMATION_SCHEMA` `COLLATIONS` e a declaração `SHOW COLLATION` têm uma coluna que indica, para cada ordem de classificação, se é a padrão para seu conjunto de caracteres (`Yes` se for o caso, vazia se não for).

* Os nomes de coligação começam com o nome do conjunto de caracteres com o qual estão associados, geralmente seguido por um ou mais sufixos que indicam outras características de coligação. Para informações adicionais sobre as convenções de nomeação, consulte a Seção 12.3.1, “Convenções de Nomenclatura de Coligação”.

Quando um conjunto de caracteres tem várias codificações, pode não ser claro qual codificação é mais adequada para um aplicativo específico. Para evitar escolher uma codificação inadequada, realize algumas comparações com valores de dados representativos para garantir que uma determinada codificação ordene os valores da maneira que você espera.

### 12.2.1 Repertório de Caracteres

O repertório de um conjunto de caracteres é a coleção de caracteres no conjunto.

As expressões de cadeia têm um atributo de repertório, que pode ter dois valores:

* `ASCII`: A expressão pode conter apenas caracteres ASCII; ou seja, caracteres no intervalo Unicode `U+0000` a `U+007F`.

* `UNICODE`: A expressão pode conter caracteres no intervalo de Unicode `U+0000` a `U+10FFFF`. Isso inclui caracteres no intervalo da Linguagem Multilíngue Básica (BMP) (`U+0000` a `U+FFFF`) e caracteres suplementares fora do intervalo da BMP (`U+10000` a `U+10FFFF`).

A faixa `ASCII` é um subconjunto da faixa `UNICODE`, portanto, uma string com repertório `ASCII` pode ser convertida com segurança, sem perda de informações, para o conjunto de caracteres de qualquer string com repertório `UNICODE`. Também pode ser convertida com segurança para qualquer conjunto de caracteres que seja um subconjunto do conjunto de caracteres `ascii`. (Todos os conjuntos de caracteres do MySQL são subconjuntos de `ascii`, com exceção de `swe7`, que reutiliza alguns caracteres de pontuação para caracteres acentuados suecos.)

O uso do repertório permite a conversão de conjuntos de caracteres em expressões para muitos casos em que o MySQL, de outra forma, retornaria um erro de “mistura ilegal de colatinas” quando as regras para a coercibilidade da colatina são insuficientes para resolver ambiguidades. (Para informações sobre coercibilidade, consulte a Seção 12.8.4, “Coercibilidade de Colatinas em Expressões”.)

A discussão a seguir fornece exemplos de expressões e seus repertórios, e descreve como o uso do repertório altera a avaliação da expressão de cordas.

* O repertório para uma constante de cadeia depende do conteúdo da cadeia e pode diferir do repertório do conjunto de caracteres de cadeia. Considere essas declarações:

  ```
  SET NAMES utf8mb4; SELECT 'abc';
  SELECT _utf8mb4'def';
  ```

Embora o conjunto de caracteres seja `utf8mb4` em cada um dos casos anteriores, as cadeias de caracteres não contêm, na verdade, caracteres fora do intervalo ASCII, portanto, seu repertório é `ASCII` em vez de `UNICODE`.

* Uma coluna com o conjunto de caracteres `ascii` tem `ASCII` repertório devido ao seu conjunto de caracteres. Na tabela a seguir, `c1` tem `ASCII` repertório:

  ```
  CREATE TABLE t1 (c1 CHAR(1) CHARACTER SET ascii);
  ```

O exemplo a seguir ilustra como o repertório permite determinar um resultado em um caso em que ocorre um erro sem repertório:

  ```
  CREATE TABLE t1 (
    c1 CHAR(1) CHARACTER SET latin1,
    c2 CHAR(1) CHARACTER SET ascii
  );
  INSERT INTO t1 VALUES ('a','b');
  SELECT CONCAT(c1,c2) FROM t1;
  ```

Sem repertório, esse erro ocorre:

  ```
  ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
  and (ascii_general_ci,IMPLICIT) for operation 'concat'
  ```

A conversão de um repertório de subconjunto para superconjunto (`ascii` para `latin1`) pode ocorrer e um resultado é retornado:

  ```
  +---------------+
  | CONCAT(c1,c2) |
  +---------------+
  | ab            |
  +---------------+
  ```

* Funções com um argumento de cadeia herdam o repertório de seu argumento. O resultado de `UPPER(_utf8mb4'abc')` tem o repertório de `ASCII`, pois seu argumento tem o repertório de `ASCII`. (Apesar da introdução de `_utf8mb4`, a cadeia `'abc'` não contém caracteres fora da faixa ASCII.)

* Para funções que retornam uma string, mas não têm argumentos de string e utilizam `character_set_connection` como conjunto de caracteres de resultado, o repertório de resultado é `ASCII` se `character_set_connection` é `ascii`, e `UNICODE` caso contrário:

  ```
  FORMAT(numeric_column, 4);
  ```

O uso do repertório muda a forma como o MySQL avalia o seguinte exemplo:

  ```
  SET NAMES ascii;
  CREATE TABLE t1 (a INT, b VARCHAR(10) CHARACTER SET latin1);
  INSERT INTO t1 VALUES (1,'b');
  SELECT CONCAT(FORMAT(a, 4), b) FROM t1;
  ```

Sem repertório, esse erro ocorre:

  ```
  ERROR 1267 (HY000): Illegal mix of collations (ascii_general_ci,COERCIBLE)
  and (latin1_swedish_ci,IMPLICIT) for operation 'concat'
  ```

Com o repertório, é retornado um resultado:

  ```
  +-------------------------+
  | CONCAT(FORMAT(a, 4), b) |
  +-------------------------+
  | 1.0000b                 |
  +-------------------------+
  ```

* Funções com dois ou mais argumentos de cadeia utilizam o repertório de argumentos "mais amplo" para o repertório de resultados, onde `UNICODE` é mais amplo do que `ASCII`. Considere as seguintes chamadas de `CONCAT()`:

  ```
  CONCAT(_ucs2 X'0041', _ucs2 X'0042')
  CONCAT(_ucs2 X'0041', _ucs2 X'00C2')
  ```

Para a primeira chamada, o repertório é `ASCII`, pois ambos os argumentos estão dentro do intervalo ASCII. Para a segunda chamada, o repertório é `UNICODE`, porque o segundo argumento está fora do intervalo ASCII.

* O repertório para os valores de retorno de função é determinado com base no repertório dos argumentos que afetam o conjunto de caracteres e a correção do resultado.

  ```
  IF(column1 < column2, 'smaller', 'greater')
  ```

O repertório de resultado é `ASCII`, porque os dois argumentos de string (o segundo argumento e o terceiro argumento) têm ambos o repertório [[`ASCII`]. O primeiro argumento não importa para o repertório de resultado, mesmo que a expressão use valores de string.

### 12.2.2 UTF-8 para Metadados

Metadados são “os dados sobre os dados”. Qualquer coisa que *descreva* o banco de dados — em oposição a ser o *conteúdo* do banco de dados — é metadado. Assim, os nomes de colunas, nomes de bancos de dados, nomes de usuários, nomes de versões e a maioria dos resultados de string de `SHOW` são metadados. Isso também é verdade para o conteúdo das tabelas em `INFORMATION_SCHEMA`, porque essas tabelas, por definição, contêm informações sobre objetos do banco de dados.

A representação dos metadados deve satisfazer esses requisitos:

* Todos os metadados devem estar no mesmo conjunto de caracteres. Caso contrário, nem as declarações `SHOW` nem as declarações `SELECT` para tabelas em `INFORMATION_SCHEMA` funcionariam corretamente, porque diferentes linhas na mesma coluna dos resultados dessas operações seriam em diferentes conjuntos de caracteres.

* Os metadados devem incluir todos os caracteres em todos os idiomas. Caso contrário, os usuários não poderão nomear colunas e tabelas usando seus próprios idiomas.

Para satisfazer ambos os requisitos, o MySQL armazena metadados em um conjunto de caracteres Unicode, ou seja, UTF-8. Isso não causa qualquer interrupção se você nunca usar caracteres acentuados ou não latinos. Mas se você fizer isso, deve estar ciente de que os metadados estão em UTF-8.

Os requisitos de metadados significam que os valores de retorno das funções `USER()`, `CURRENT_USER()`, `SESSION_USER()`, `SYSTEM_USER()`, `DATABASE()` e `VERSION()` têm o conjunto de caracteres UTF-8 por padrão.

O servidor define a variável de sistema `character_set_system` pelo nome do conjunto de caracteres de metadados:

```
mysql> SHOW VARIABLES LIKE 'character_set_system';
+----------------------+---------+
| Variable_name        | Value   |
+----------------------+---------+
| character_set_system | utf8mb3 |
+----------------------+---------+
```

O armazenamento de metadados usando Unicode *não* significa que o servidor retorna cabeçalhos de colunas e os resultados das funções `DESCRIBE` no conjunto de caracteres `character_set_system`, definido por padrão. Quando você usa `SELECT column1 FROM t`, o próprio nome `column1` é retornado pelo servidor para o cliente no conjunto de caracteres determinado pelo valor da variável do sistema `character_set_results`, que tem um valor padrão de `utf8mb4`. Se você deseja que o servidor retorne resultados de metadados de volta em um conjunto de caracteres diferente, use a declaração `SET NAMES` para forçar o servidor a realizar a conversão de conjunto de caracteres. `SET NAMES` define os `character_set_results` e outras variáveis do sistema relacionadas. (Veja a Seção 12.4, “Conjunto de caracteres de conexão e colasções.”) Alternativamente, um programa cliente pode realizar a conversão após receber o resultado do servidor. É mais eficiente para o cliente realizar a conversão, mas essa opção não está sempre disponível para todos os clientes.

Se `character_set_results` estiver definido como `NULL`, não é realizada nenhuma conversão e o servidor retorna metadados usando seu conjunto de caracteres original (o conjunto indicado por `character_set_system`).

Mensagens de erro devolvidas pelo servidor ao cliente são convertidas automaticamente para o conjunto de caracteres do cliente, assim como os metadados.

Se você estiver usando, por exemplo, a função `USER()` para comparação ou atribuição em uma única declaração, não se preocupe. O MySQL realiza algumas conversões automáticas para você.

```
SELECT * FROM t1 WHERE USER() = latin1_column;
```

Isso funciona porque o conteúdo de `latin1_column` é convertido automaticamente para UTF-8 antes da comparação.

```
INSERT INTO t1 (latin1_column) SELECT USER();
```

Isso funciona porque o conteúdo de `USER()` é convertido automaticamente para `latin1` antes da atribuição.

Embora a conversão automática não esteja no padrão SQL, o padrão diz que cada conjunto de caracteres é (em termos de caracteres suportados) um “subconjunto” do Unicode. Como é um princípio bem conhecido que “o que se aplica a um superconjunto pode se aplicar a um subconjunto”, acreditamos que uma codificação para Unicode pode ser aplicada para comparações com strings não Unicode. Para mais informações sobre a coerção de strings, consulte a Seção 12.8.4, “Coercibilidade de Codificação em Expressões”.