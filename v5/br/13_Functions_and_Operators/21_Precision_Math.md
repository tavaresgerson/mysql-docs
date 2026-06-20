## 12.21 Matemática de Precisão

O MySQL oferece suporte para matemática de precisão: manipulação de valores numéricos que resulta em resultados extremamente precisos e um alto grau de controle sobre valores inválidos. A matemática de precisão é baseada nesses dois recursos:

* modos SQL que controlam a estríça com que o servidor aceita ou rejeita dados inválidos.

* A biblioteca MySQL para aritmética de ponto fixo.

Essas características têm várias implicações para operações numéricas e oferecem um alto grau de conformidade com o SQL padrão:

* **Cálculos precisos**: Para números com valor exato, os cálculos não introduzem erros de ponto flutuante. Em vez disso, é usada precisão exata. Por exemplo, o MySQL trata um número como `.0001` como um valor exato, em vez de uma aproximação, e somando-o 10.000 vezes, produz um resultado de exatamente `1`, não um valor que é apenas "próximo" de 1.

* **Comportamento de arredondamento bem definido**: Para números com valor exato, o resultado de `ROUND()` depende de seu argumento, e não de fatores ambientais, como a forma como a biblioteca C subjacente funciona.

* **Independência da plataforma**: As operações com valores numéricos exatos são as mesmas em diferentes plataformas, como Windows e Unix.

* **Controle sobre o tratamento de valores inválidos**: O excesso e a divisão por zero são detectáveis e podem ser tratados como erros. Por exemplo, você pode tratar um valor que é muito grande para uma coluna como um erro, em vez de ter o valor truncado para ficar dentro da faixa do tipo de dados da coluna. Da mesma forma, você pode tratar a divisão por zero como um erro, em vez de como uma operação que produz um resultado de `NULL`. A escolha da abordagem a ser adotada é determinada pelo ajuste do modo SQL do servidor.

A discussão a seguir abrange vários aspectos sobre como a matemática de precisão funciona, incluindo possíveis incompatibilidades com aplicações mais antigas. No final, são fornecidos alguns exemplos que demonstram como o MySQL lida com operações numéricas com precisão. Para informações sobre o controle do modo SQL, consulte a Seção 5.1.10, “Modos SQL do servidor”.

### 12.21.1 Tipos de Valores Numéricos

O escopo da matemática de precisão para operações de valor exato inclui os tipos de dados de valor exato (inteiro e `DECIMAL` - DECIMAL, NUMERIC") e literais numéricos de valor exato. Os tipos de dados de valor aproximado e literais numéricos são tratados como números em ponto flutuante.

Os literais numéricos de valor exato têm uma parte inteira ou fracionária, ou ambas. Eles podem ser assinados. Exemplos: `1`, `.2`, `3.4`, `-5`, `-6.78`, `+9.10`.

Os literais numéricos de valor aproximado são representados em notação científica com uma mantissa e expoente. Uma ou ambas as partes podem ser assinadas. Exemplos: `1.2E3`, `1.2E-3`, `-1.2E3`, `-1.2E-3`.

Dois números que parecem semelhantes podem ser tratados de maneira diferente. Por exemplo, `2.34` é um número de valor exato (ponto fixo), enquanto `2.34E0` é um número de valor aproximado (ponto flutuante).

O tipo de dados `DECIMAL` - DECIMAL, NUMERIC]") é um tipo de ponto fixo e os cálculos são exatos. No MySQL, o tipo `DECIMAL` - DECIMAL, NUMERIC]") tem vários sinônimos: `NUMERIC` - DECIMAL, NUMERIC"), `DEC` - DECIMAL, NUMERIC"), `FIXED` - DECIMAL, NUMERIC"). Os tipos inteiros também são tipos de valor exato.

Os tipos de dados `FLOAT` - FLOAT, DOUBLE]") e `DOUBLE` - FLOAT, DOUBLE]") são tipos de ponto flutuante e os cálculos são aproximados. No MySQL, os tipos que são sinônimos de `FLOAT` - FLOAT, DOUBLE]") ou `DOUBLE` - FLOAT, DOUBLE]") são `DOUBLE PRECISION` - FLOAT, DOUBLE]") e `REAL` - FLOAT, DOUBLE").

### 12.21.2 Características do tipo de dados DECIMAL

Esta seção discute as características do tipo de dados `DECIMAL` - DECIMAL, NUMERIC") (e seus sinônimos), com especial atenção aos seguintes tópicos:

* Número máximo de dígitos * Formato de armazenamento * Requisitos de armazenamento * A extensão MySQL não padrão para o intervalo superior de colunas `DECIMAL` - DECIMAL, NUMERIC")

A sintaxe de declaração para uma coluna `DECIMAL` - DECIMAL, NUMERIC]") é `DECIMAL(M,D)`. As faixas de valores para os argumentos são as seguintes:

* *`M`* é o número máximo de dígitos (a precisão). Tem um intervalo de 1 a 65.

* *`D`* é o número de dígitos à direita do ponto decimal (a escala). Tem um intervalo de 0 a 30 e não deve ser maior que *`M`*.

Se *`D`* for omitido, o padrão é 0. Se *`M`* for omitido, o padrão é 10.

O valor máximo de 65 para *`M`* significa que os cálculos nos valores de `DECIMAL` - DECIMAL, NUMERIC") são precisos até 65 dígitos. Esse limite de 65 dígitos de precisão também se aplica a literais numéricos de valor exato, portanto, a faixa máxima desses literais difere da anterior. (Há também um limite sobre o comprimento do texto dos literais de `DECIMAL` - DECIMAL, NUMERIC") literais; veja Seção 12.21.3, “Tratamento de Expressões”).

Os valores das colunas `DECIMAL` - DECIMAL, NUMERIC") são armazenados usando um formato binário que compacta nove dígitos decimais em 4 bytes. Os requisitos de armazenamento para as partes inteiras e fracionárias de cada valor são determinados separadamente. Cada múltiplo de nove dígitos requer 4 bytes, e quaisquer dígitos restantes excedentes requerem alguma fração de 4 bytes. Os requisitos de armazenamento para os dígitos restantes são dados pela tabela a seguir.

<table summary="The number of bytes required for remaining/leftover digits in DECIMAL values."><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Leftover Digits</th> <th>Number of Bytes</th> </tr></thead><tbody><tr> <td>0</td> <td>0</td> </tr><tr> <td>1–2</td> <td>1</td> </tr><tr> <td>3–4</td> <td>2</td> </tr><tr> <td>5–6</td> <td>3</td> </tr><tr> <td>7–9</td> <td>4</td> </tr></tbody></table>

Por exemplo, uma coluna `DECIMAL(18,9)` tem nove dígitos de um lado e outro do ponto decimal, então a parte inteira e a parte fracionária exigem cada uma 4 bytes. Uma coluna `DECIMAL(20,6)` tem quatorze dígitos inteiros e seis dígitos fracionários. Os dígitos inteiros exigem quatro bytes para nove dos dígitos e 3 bytes para os cinco dígitos restantes. Os seis dígitos fracionários exigem 3 bytes.

As colunas `DECIMAL` - DECIMAL, NUMERIC não armazenam um caractere inicial `+` ou `-` ou dígitos iniciais `0`. Se você inserir `+0003.1` em uma coluna `DECIMAL(5,1)`, ele é armazenado como `3.1`. Para números negativos, um caractere literal `-` não é armazenado.

As colunas `DECIMAL` - DECIMAL, NUMERIC não permitem valores maiores que o intervalo implícito pela definição da coluna. Por exemplo, uma coluna `DECIMAL(3,0)` suporta um intervalo de `-999` a `999`. Uma coluna `DECIMAL(M,D)` permite até *`M`* - *`D`* dígitos à esquerda do ponto decimal.

O padrão SQL exige que a precisão de `NUMERIC(M,D)` seja exatamente *`M`* dígitos. Para `DECIMAL(M,D)`, o padrão exige uma precisão de pelo menos *`M`* dígitos, mas permite mais. No MySQL, `DECIMAL(M,D)` e `NUMERIC(M,D)` são os mesmos, e ambos têm uma precisão de exatamente *`M`* dígitos.

Para uma explicação completa do formato interno dos valores de `DECIMAL`, consulte o arquivo `strings/decimal.c` em uma distribuição de fonte MySQL. O formato é explicado (com um exemplo) na função `decimal2bin()`.

### 12.21.3 Tratamento de Expressões

Com matemática de precisão, números de valor exato são usados sempre que possível. Por exemplo, os números em comparações são usados exatamente como dados fornecidos, sem alteração de valor. No modo SQL estrito, para `INSERT` em uma coluna com um tipo de dados exato (`DECIMAL` - DECIMAL, NUMERIC") ou inteiro), um número é inserido com seu valor exato se estiver dentro do intervalo da coluna. Quando recuperado, o valor deve ser o mesmo que o que foi inserido. (Se o modo SQL estrito não estiver habilitado, a troncamento para `INSERT` é permitido.)

O tratamento de uma expressão numérica depende do tipo de valores que a expressão contém:

* Se houver valores aproximados, a expressão é aproximada e é avaliada usando aritmética de ponto flutuante.

* Se não houver valores aproximados, a expressão contém apenas valores exatos. Se qualquer valor exato contiver uma parte fracionária (um valor que segue o ponto decimal), a expressão é avaliada usando `DECIMAL` - DECIMAL, NUMERIC") aritmética exata e tem uma precisão de 65 dígitos. O termo “exato” está sujeito aos limites do que pode ser representado em binário. Por exemplo, `1.0/3.0` pode ser aproximado em notação decimal como `.333...`, mas não escrito como um número exato, então `(1.0/3.0)*3.0` não avalia exatamente a `1.0`.

* Caso contrário, a expressão contém apenas valores inteiros. A expressão é exata e é avaliada usando aritmética inteira e tem uma precisão igual a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (64 bits).

Se uma expressão numérica contiver qualquer cadeia de caracteres, elas são convertidas em valores de ponto flutuante de dupla precisão e a expressão é aproximada.

Os insertos em colunas numéricas são afetados pelo modo SQL, que é controlado pela variável de sistema `sql_mode`. (Veja a Seção 5.1.10, “Modos SQL do servidor”.) A discussão a seguir menciona o modo estrito (selecionado pelos valores dos modos `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES`) e `ERROR_FOR_DIVISION_BY_ZERO`. Para ativar todas as restrições, você pode simplesmente usar o modo `TRADITIONAL`, que inclui tanto os valores do modo estrito quanto `ERROR_FOR_DIVISION_BY_ZERO`:

```sql
SET sql_mode='TRADITIONAL';
```

Se um número for inserido em uma coluna de tipo exato (`DECIMAL` - DECIMAL, NUMERIC") ou inteiro), ele será inserido com seu valor exato se estiver dentro do intervalo e da precisão da coluna.

Se o valor tiver muitas casas decimais na parte fracionária, ocorre a arredondamento e uma nota é gerada. O arredondamento é feito conforme descrito na Seção 12.21.4, “Comportamento de Arredondamento”. A truncagem devido ao arredondamento da parte fracionária não é um erro, mesmo no modo estrito.

Se o valor tiver muitas casas decimais na parte inteira, ele é muito grande (fora do intervalo) e é tratado da seguinte forma:

* Se o modo rigoroso não estiver habilitado, o valor é truncado para o valor legal mais próximo e um aviso é gerado.

* Se o modo rigoroso estiver ativado, ocorrerá um erro de excesso.

Para os literais `DECIMAL` - DECIMAL, NUMERIC"), além do limite de precisão de 65 dígitos, há um limite para a quantidade de texto que o literal pode ter. Se o valor exceder aproximadamente 80 caracteres, podem ocorrer resultados inesperados. Por exemplo:

```sql
mysql> SELECT
       CAST(0000000000000000000000000000000000000000000000000000000000000000000000000000000020.01 AS DECIMAL(15,2)) as val;
+------------------+
| val              |
+------------------+
| 9999999999999.99 |
+------------------+
1 row in set, 2 warnings (0.00 sec)

mysql> SHOW WARNINGS;
+---------+------+----------------------------------------------+
| Level   | Code | Message                                      |
+---------+------+----------------------------------------------+
| Warning | 1292 | Truncated incorrect DECIMAL value: '20'      |
| Warning | 1264 | Out of range value for column 'val' at row 1 |
+---------+------+----------------------------------------------+
2 rows in set (0.00 sec)
```

Não há detecção de subfluxo, portanto, o tratamento do subfluxo não está definido.

Para inserções de cadeias de caracteres em colunas numéricas, a conversão de cadeia de caracteres para número é tratada da seguinte forma, se a cadeia de caracteres tiver conteúdo não numérico:

* Uma cadeia que não começa com um número não pode ser usada como um número e produz um erro no modo estrito, ou uma advertência de outra forma. Isso inclui a cadeia vazia.

* Uma cadeia que começa com um número pode ser convertida, mas a parte não numérica final é truncada. Se a parte truncada contiver algo além de espaços, isso produz um erro no modo estrito, ou um aviso caso contrário.

Por padrão, a divisão por zero produz um resultado de `NULL` e nenhum aviso. Ao definir o modo SQL apropriadamente, a divisão por zero pode ser restringida.

Com o modo `ERROR_FOR_DIVISION_BY_ZERO` SQL habilitado, o MySQL lida com a divisão por zero de maneira diferente:

* Se o modo rigoroso não estiver habilitado, uma mensagem de alerta é exibida. * Se o modo rigoroso estiver habilitado, as inserções e atualizações que envolvem divisão por zero são proibidas e ocorre um erro.

Em outras palavras, os insertos e atualizações que envolvem expressões que realizam divisão por zero podem ser tratados como erros, mas isso requer `ERROR_FOR_DIVISION_BY_ZERO`, além do modo estrito.

Suponha que tenhamos esta declaração:

```sql
INSERT INTO t SET i = 1/0;
```

Isso é o que acontece para combinações de modos estritos e `ERROR_FOR_DIVISION_BY_ZERO`.

<table summary="What happens for combinations of strict and ERROR_FOR_DIVISION_BY_ZERO modes."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><code>sql_mode</code> Value</th> <th>Resultado</th> </tr></thead><tbody><tr> <td><code>''</code> (Default)</td> <td>Sem aviso, sem erro;<code>i</code>está previsto<code>NULL</code>.</td> </tr><tr> <td>strict</td> <td>Sem aviso, sem erro;<code>i</code>está previsto<code>NULL</code>.</td> </tr><tr> <td><code>ERROR_FOR_DIVISION_BY_ZERO</code></td> <td>Aviso, sem erro;<code>i</code>está previsto<code>NULL</code>.</td> </tr><tr> <td>strict,<code>ERROR_FOR_DIVISION_BY_ZERO</code></td> <td>Condição de erro; nenhuma linha foi inserida.</td> </tr></tbody></table>

### 12.21.4 Comportamento de arredondamento

Esta seção discute a arredondamento de matemática de precisão para a função `ROUND()` e para inserções em colunas com tipos de valor exato (`DECIMAL` - DECIMAL, NUMERIC") e inteiro).

A função `ROUND()` arredonda de maneira diferente, dependendo se seu argumento é exato ou aproximado:

* Para números com valor exato, `ROUND()` usa a regra de arredondamento para a metade superior: um valor com uma parte fracionária de 0,5 ou superior é arredondado para o próximo inteiro se positivo ou para a próxima parte inteira se negativo. (Em outras palavras, é arredondado para longe de zero.) Um valor com uma parte fracionária menor que 0,5 é arredondado para o próximo inteiro se positivo ou para a próxima parte inteira se negativo. (Em outras palavras, é arredondado em direção a zero.)

* Para números com valor aproximado, o resultado depende da biblioteca C. Em muitos sistemas, isso significa que `ROUND()` usa a regra de arredondamento para o número par mais próximo: um valor com uma parte fracionária exatamente no meio entre dois inteiros é arredondado para o número inteiro par mais próximo.

O exemplo a seguir mostra como a arredondagem difere para valores exatos e aproximados:

```sql
mysql> SELECT ROUND(2.5), ROUND(25E-1);
+------------+--------------+
| ROUND(2.5) | ROUND(25E-1) |
+------------+--------------+
| 3          |            2 |
+------------+--------------+
```

Para inserções em uma coluna `DECIMAL` - DECIMAL, NUMERIC") ou NUMÉRICA, o alvo é um tipo de dado exato, portanto, a arredondagem usa "arredondar para metade, afastando-se do zero", independentemente de o valor a ser inserido ser exato ou aproximado:

```sql
mysql> CREATE TABLE t (d DECIMAL(10,0));
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t VALUES(2.5),(2.5E0);
Query OK, 2 rows affected, 2 warnings (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 2

mysql> SHOW WARNINGS;
+-------+------+----------------------------------------+
| Level | Code | Message                                |
+-------+------+----------------------------------------+
| Note  | 1265 | Data truncated for column 'd' at row 1 |
| Note  | 1265 | Data truncated for column 'd' at row 2 |
+-------+------+----------------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT d FROM t;
+------+
| d    |
+------+
|    3 |
|    3 |
+------+
2 rows in set (0.00 sec)
```

A declaração `SHOW WARNINGS` exibe as notas que são geradas por truncação devido à arredondamento da parte fracionária. Tal truncação não é um erro, mesmo no modo SQL estrito (ver Seção 12.21.3, “Tratamento de Expressões”).

### 12.21.5 Exemplos de matemática de precisão

Esta seção fornece alguns exemplos que mostram os resultados de consultas de matemática de precisão no MySQL. Esses exemplos demonstram os princípios descritos na Seção 12.21.3, “Tratamento de Expressões”, e na Seção 12.21.4, “Comportamento de Arredondamento”.

**Exemplo 1**. Os números são usados com seu valor exato conforme dado quando possível:

```sql
mysql> SELECT (.1 + .2) = .3;
+----------------+
| (.1 + .2) = .3 |
+----------------+
|              1 |
+----------------+
```

Para valores de ponto flutuante, os resultados são inexatos:

```sql
mysql> SELECT (.1E0 + .2E0) = .3E0;
+----------------------+
| (.1E0 + .2E0) = .3E0 |
+----------------------+
|                    0 |
+----------------------+
```

Outra maneira de ver a diferença no manuseio de valores exatos e aproximados é adicionar um pequeno número a uma soma muitas vezes. Considere o seguinte procedimento armazenado, que adiciona `.0001` a uma variável 1.000 vezes.

```sql
CREATE PROCEDURE p ()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE d DECIMAL(10,4) DEFAULT 0;
  DECLARE f FLOAT DEFAULT 0;
  WHILE i < 10000 DO
    SET d = d + .0001;
    SET f = f + .0001E0;
    SET i = i + 1;
  END WHILE;
  SELECT d, f;
END;
```

A soma para ambos os `d` e `f` logicamente deve ser 1, mas isso é verdadeiro apenas para o cálculo decimal. O cálculo de ponto flutuante introduz pequenos erros:

```sql
+--------+------------------+
| d      | f                |
+--------+------------------+
| 1.0000 | 0.99999999999991 |
+--------+------------------+
```

**Exemplo 2**. A multiplicação é realizada com a escala exigida pelo SQL padrão. Ou seja, para dois números *`X1`* e *`X2`* que têm escala *`S1`* e *`S2`*, a escala do resultado é `S1

+ S2`:

```sql
mysql> SELECT .01 * .01;
+-----------+
| .01 * .01 |
+-----------+
| 0.0001    |
+-----------+
```

**Exemplo 3**. O comportamento de arredondamento para números com valor exato é bem definido:

O comportamento de arredondamento (por exemplo, com a função `ROUND()`) é independente da implementação da biblioteca C subjacente, o que significa que os resultados são consistentes em todas as plataformas.

* O arredondamento para colunas de valor exato (`DECIMAL` - DECIMAL, NUMERIC) e números inteiros) e números com valor exato usa a regra "arredonde metade para longe do zero". Um valor com uma parte fracionária de .5 ou maior é arredondado para longe do zero para o número inteiro mais próximo, conforme mostrado aqui:

  ```sql
  mysql> SELECT ROUND(2.5), ROUND(-2.5);
  +------------+-------------+
  | ROUND(2.5) | ROUND(-2.5) |
  +------------+-------------+
  | 3          | -3          |
  +------------+-------------+
  ```

* O arredondamento para valores de ponto flutuante utiliza a biblioteca C, que, em muitos sistemas, usa a regra "arredondar para o número par mais próximo". Um valor com uma parte fracionária exatamente no meio entre dois inteiros é arredondado para o número inteiro par mais próximo:

  ```sql
  mysql> SELECT ROUND(2.5E0), ROUND(-2.5E0);
  +--------------+---------------+
  | ROUND(2.5E0) | ROUND(-2.5E0) |
  +--------------+---------------+
  |            2 |            -2 |
  +--------------+---------------+
  ```

**Exemplo 4**. Em modo estrito, inserir um valor que está fora do intervalo para uma coluna causa um erro, em vez de um corte para um valor legal.

Quando o MySQL não está em modo estrito, ocorre a truncação para um valor legal:

```sql
mysql> SET sql_mode='';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO t SET i = 128;
Query OK, 1 row affected, 1 warning (0.00 sec)

mysql> SELECT i FROM t;
+------+
| i    |
+------+
|  127 |
+------+
1 row in set (0.00 sec)
```

No entanto, um erro ocorre se o modo estrito estiver em vigor:

```sql
mysql> SET sql_mode='STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t SET i = 128;
ERROR 1264 (22003): Out of range value adjusted for column 'i' at row 1

mysql> SELECT i FROM t;
Empty set (0.00 sec)
```

**Exemplo 5**: No modo estrito e com `ERROR_FOR_DIVISION_BY_ZERO` definido, a divisão por zero causa um erro, não um resultado de `NULL`.

No modo não estrito, a divisão por zero tem como resultado `NULL`:

```sql
mysql> SET sql_mode='';
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t SET i = 1 / 0;
Query OK, 1 row affected (0.00 sec)

mysql> SELECT i FROM t;
+------+
| i    |
+------+
| NULL |
+------+
1 row in set (0.03 sec)
```

No entanto, a divisão por zero é um erro se os modos SQL adequados estiverem em vigor:

```sql
mysql> SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t SET i = 1 / 0;
ERROR 1365 (22012): Division by 0

mysql> SELECT i FROM t;
Empty set (0.01 sec)
```

**Exemplo 6**. Literais de valor exato são avaliados como valores exatos.

As expressões literais de valor aproximado são avaliadas usando ponto flutuante, mas as expressões literais de valor exato são tratadas como `DECIMAL` - DECIMAL, NUMERIC").

```sql
mysql> CREATE TABLE t SELECT 2.5 AS a, 25E-1 AS b;
Query OK, 1 row affected (0.01 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> DESCRIBE t;
+-------+-----------------------+------+-----+---------+-------+
| Field | Type                  | Null | Key | Default | Extra |
+-------+-----------------------+------+-----+---------+-------+
| a     | decimal(2,1) unsigned | NO   |     | 0.0     |       |
| b     | double                | NO   |     | 0       |       |
+-------+-----------------------+------+-----+---------+-------+
2 rows in set (0.01 sec)
```

**Exemplo 7**. Se o argumento de uma função agregada for um tipo numérico exato, o resultado também será um tipo numérico exato, com uma escala pelo menos igual à do argumento.

Considere essas declarações:

```sql
mysql> CREATE TABLE t (i INT, d DECIMAL, f FLOAT);
mysql> INSERT INTO t VALUES(1,1,1);
mysql> CREATE TABLE y SELECT AVG(i), AVG(d), AVG(f) FROM t;
```

O resultado é um duplo apenas para o argumento de ponto flutuante. Para argumentos de tipo exato, o resultado também é um tipo exato:

```sql
mysql> DESCRIBE y;
+--------+---------------+------+-----+---------+-------+
| Field  | Type          | Null | Key | Default | Extra |
+--------+---------------+------+-----+---------+-------+
| AVG(i) | decimal(14,4) | YES  |     | NULL    |       |
| AVG(d) | decimal(14,4) | YES  |     | NULL    |       |
| AVG(f) | double        | YES  |     | NULL    |       |
+--------+---------------+------+-----+---------+-------+
```

O resultado é um duplo apenas para o argumento de ponto flutuante. Para argumentos de tipo exato, o resultado também é um tipo exato.