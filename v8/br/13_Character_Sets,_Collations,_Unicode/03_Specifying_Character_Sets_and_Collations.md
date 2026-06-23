## 12.3 Especificação de Conjuntos de Caracteres e Colagens

Existem configurações padrão para conjuntos de caracteres e colas em quatro níveis: servidor, banco de dados, tabela e coluna. A descrição nas seções a seguir pode parecer complexa, mas foi verificado na prática que a definição padrão em múltiplos níveis resulta em resultados naturais e óbvios.

`CHARACTER SET` é utilizado em cláusulas que especificam um conjunto de caracteres. `CHARSET` pode ser utilizado como sinônimo de `CHARACTER SET`.

Problemas com o conjunto de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre os programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, você precisa indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, faça esta declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para obter mais informações sobre questões relacionadas ao conjunto de caracteres na comunicação cliente/servidor, consulte a Seção 12.4, “Conjunto de caracteres de conexão e codificações”.

### 12.3.1 Convenções de Nomenclatura de Colaboração

Os nomes das collation do MySQL seguem essas convenções:

* O nome de uma collation começa com o nome do conjunto de caracteres com o qual está associado, geralmente seguido por um ou mais sufixos que indicam outras características da collation. Por exemplo, `utf8mb4_0900_ai_ci` e `latin1_swedish_ci` são collation para os conjuntos de caracteres `utf8mb4` e `latin1`, respectivamente. O conjunto de caracteres `binary` tem uma única collation, também chamada `binary`, sem sufixos.

* Uma ordenação específica para uma língua inclui um código de localização ou nome de idioma. Por exemplo, `utf8mb4_tr_0900_ai_ci` e `utf8mb4_hu_0900_ai_ci` ordenam caracteres para o conjunto de caracteres `utf8mb4` usando as regras do turco e do húngaro, respectivamente. `utf8mb4_turkish_ci` e `utf8mb4_hungarian_ci` são semelhantes, mas baseados em uma versão menos recente do Algoritmo de Ordenação Unicode.

* Sufixos de ordenação indicam se uma ordenação é sensível ao caso, sensível ao acento ou sensível ao kana (ou alguma combinação desses), ou binário. O quadro a seguir mostra os sufixos usados para indicar essas características.

**Tabela 12.1 Significados dos Sufixos de Colagem**

  <table summary="Collation suffixes that indicate lettercase sensitivity, accent sensitivity, kana sensitivity, binary."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Suffix</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>_ai</code></td> <td>Accent-insensitive</td> </tr><tr> <td><code>_as</code></td> <td>Accent-sensitive</td> </tr><tr> <td><code>_ci</code></td> <td>Case-insensitive</td> </tr><tr> <td><code>_cs</code></td> <td>Case-sensitive</td> </tr><tr> <td><code>_ks</code></td> <td>Kana-sensitive</td> </tr><tr> <td><code>_bin</code></td> <td>Binary</td> </tr></tbody></table>

Para nomes de ordenação não binários que não especificam sensibilidade ao acento, é determinado pela sensibilidade ao caso. Se um nome de ordenação não contém `_ai` ou `_as`, `_ci` no nome implica em `_ai` e `_cs` no nome implica em `_as`. Por exemplo, `latin1_general_ci` é explicitamente insensível ao caso e implicitamente insensível ao acento, `latin1_general_cs` é explicitamente sensível ao caso e implicitamente sensível ao acento, e `utf8mb4_0900_ai_ci` é explicitamente insensível ao caso e insensível ao acento.

Para as codificações japonesas, o sufixo `_ks` indica que uma codificação é sensível ao kana; ou seja, distingue caracteres Katakana de caracteres Hiragana. As codificações japonesas sem o sufixo `_ks` não são sensíveis ao kana e tratam caracteres Katakana e Hiragana como iguais para ordenação.

Para a ordenação `binary` do conjunto de caracteres `binary`, as comparações são baseadas em valores numéricos de byte. Para a ordenação `_bin` de um conjunto de caracteres não binário, as comparações são baseadas em valores de código de caracteres numéricos, que diferem dos valores de byte para caracteres multibyte. Para informações sobre as diferenças entre a ordenação `binary` do conjunto de caracteres `binary` e as ordenações `_bin` de conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A ordenação binária em comparação com as ordenações _bin”.

* Os nomes de cotação para conjuntos de caracteres Unicode podem incluir um número de versão para indicar a versão do Algoritmo de Cotação Unicode (UCA) em que a cotação se baseia. As cotações baseadas no UCA sem número de versão no nome utilizam as chaves de peso UCA versão-4.0.0. Por exemplo:

+ `utf8mb4_0900_ai_ci` é baseado nas chaves de peso da UCA 9.0.0 (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).

+ `utf8mb4_unicode_520_ci` é baseado nas chaves de peso da UCA 5.2.0 (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).

+ `utf8mb4_unicode_ci` (sem nome de versão) é baseado nas chaves de peso UCA 4.0.0 (<http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>).

* Para conjuntos de caracteres Unicode, as colatações `xxx_general_mysql500_ci` preservam a ordem pré-5.1.24 das colatações originais `xxx_general_ci` e permitem atualizações para tabelas criadas antes do MySQL 5.1.24 (Bug #27877).

### 12.3.2 Conjunto de caracteres e codificação do servidor

O MySQL Server tem um conjunto de caracteres do servidor e uma correção de dados do servidor. Por padrão, esses são `utf8mb4` e `utf8mb4_0900_ai_ci`, mas eles podem ser definidos explicitamente na inicialização do servidor na linha de comando ou em um arquivo de opção e alterados em tempo de execução.

Inicialmente, o conjunto de caracteres do servidor e a correção dependem das opções que você usa ao iniciar o **mysqld**. Você pode usar `--character-set-server` para o conjunto de caracteres. Junto com isso, você pode adicionar `--collation-server` para a correção. Se você não especificar um conjunto de caracteres, isso é o mesmo que dizer `--character-set-server=utf8mb4`. Se você especificar apenas um conjunto de caracteres (por exemplo, `utf8mb4`) mas não uma correção, isso é o mesmo que dizer `--character-set-server=utf8mb4` `--collation-server=utf8mb4_0900_ai_ci`, porque `utf8mb4_0900_ai_ci` é a correção padrão para `utf8mb4`. Portanto, os seguintes três comandos têm o mesmo efeito:

```
mysqld
mysqld --character-set-server=utf8mb4
mysqld --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_0900_ai_ci
```

Uma maneira de alterar as configurações é recompilar. Para alterar o conjunto de caracteres e a correção padrão do servidor ao construir a partir de fontes, use as opções `DEFAULT_CHARSET` e `DEFAULT_COLLATION` para **CMake**. Por exemplo:

```
cmake . -DDEFAULT_CHARSET=latin1
```

Ou:

```
cmake . -DDEFAULT_CHARSET=latin1 \
  -DDEFAULT_COLLATION=latin1_german1_ci
```

Tanto o **mysqld** quanto o **CMake** verificam se a combinação de conjunto de caracteres/colação é válida. Se não for, cada programa exibe uma mensagem de erro e termina.

O conjunto de caracteres do servidor e a correção de caracteres são usados como valores padrão se o conjunto de caracteres do banco de dados e a correção de caracteres não forem especificados nas declarações `CREATE DATABASE`. Eles não têm outro propósito.

O conjunto de caracteres e a ordenação do servidor atual podem ser determinados a partir dos valores das variáveis de sistema `character_set_server` e `collation_server`. Essas variáveis podem ser alteradas em tempo de execução.

### 12.3.3 Conjunto de caracteres e codificação do banco de dados

Cada banco de dados tem um conjunto de caracteres do banco de dados e uma combinação de caracteres do banco de dados. As declarações `CREATE DATABASE` e `ALTER DATABASE` têm cláusulas opcionais para especificar o conjunto de caracteres do banco de dados e a combinação de caracteres do banco de dados:

```
CREATE DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]

ALTER DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]
```

A palavra-chave `SCHEMA` pode ser usada em vez de `DATABASE`.

As cláusulas `CHARACTER SET` e `COLLATE` permitem criar bancos de dados com diferentes conjuntos de caracteres e colatinas no mesmo servidor MySQL.

As opções de banco de dados são armazenadas no dicionário de dados e podem ser examinadas verificando a tabela do esquema de informações `SCHEMATA`.

Exemplo:

```
CREATE DATABASE db_name CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

O MySQL escolhe o conjunto de caracteres do banco de dados e a correção de dados do banco de dados da seguinte maneira:

* Se ambos os `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão utilizados.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua correção padrão são usados. Para ver a correção padrão para cada conjunto de caracteres, use a declaração [`SHOW CHARACTER SET`(show-character-set.html "15.7.7.3 SHOW CHARACTER SET Statement") ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a ordenação *`collation_name`* são utilizados.

* Caso contrário (nem `CHARACTER SET` nem `COLLATE` seja especificado), o conjunto de caracteres do servidor e a correção de dados do servidor são usados.

O conjunto de caracteres e a ordenação do banco de dados padrão podem ser determinados a partir dos valores das variáveis de sistema `character_set_database` e `collation_database`. O servidor define essas variáveis sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, as variáveis têm o mesmo valor que as variáveis de sistema do nível do servidor, `character_set_server` e `collation_server`.

Para ver o conjunto de caracteres padrão e a correção de dados para um banco de dados específico, use essas instruções:

```
USE db_name;
SELECT @@character_set_database, @@collation_database;
```

Como alternativa, para exibir os valores sem alterar o banco de dados padrão:

```
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'db_name';
```

O conjunto de caracteres e a correção de dados do banco de dados afetam esses aspectos da operação do servidor:

* Para as declarações `CREATE TABLE`, o conjunto de caracteres e a correção de dados do banco de dados são usados como valores padrão para as definições de tabela, se o conjunto de caracteres e a correção de dados da tabela não forem especificados. Para ignorar isso, forneça opções de tabela explícitas `CHARACTER SET` e `COLLATE`.

* Para as declarações `LOAD DATA` que não incluem nenhuma cláusula `CHARACTER SET`, o servidor usa o conjunto de caracteres indicado pela variável de sistema `character_set_database` para interpretar as informações no arquivo. Para contornar isso, forneça uma cláusula `CHARACTER SET` explícita.

* Para rotinas armazenadas (procedimentos e funções), o conjunto de caracteres e a correção de dados do banco de dados em vigor no momento da criação da rotina são utilizados como o conjunto de caracteres e a correção de dados dos parâmetros de caracteres para os quais a declaração não inclui `CHARACTER SET` ou um atributo `COLLATE`. Para contornar isso, forneça explicitamente `CHARACTER SET` e `COLLATE`.

### 12.3.4 Conjunto de caracteres de tabela e correção de caracteres

Cada tabela tem um conjunto de caracteres de tabela e uma correção de tabela. As declarações `CREATE TABLE` e `ALTER TABLE` têm cláusulas opcionais para especificar o conjunto de caracteres de tabela e a correção de tabela:

```
CREATE TABLE tbl_name (column_list)
    [[DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name]]

ALTER TABLE tbl_name
    [[DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Exemplo:

```
CREATE TABLE t1 ( ... )
CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

O MySQL escolhe o conjunto de caracteres e a codificação de tabela da seguinte maneira:

* Se ambos os `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão utilizados.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua correção padrão são usados. Para ver a correção padrão para cada conjunto de caracteres, use a declaração [`SHOW CHARACTER SET`(show-character-set.html "15.7.7.3 SHOW CHARACTER SET Statement") ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e à ordenação *`collation_name`* são utilizados.

* Caso contrário (nem `CHARACTER SET` nem `COLLATE` seja especificado), o conjunto de caracteres e a correção de dados do banco de dados são utilizados.

O conjunto de caracteres de tabela e a correção de caracteres são usados como valores padrão para as definições de coluna se o conjunto de caracteres de coluna e a correção de caracteres não forem especificados nas definições de coluna individuais. O conjunto de caracteres de tabela e a correção de caracteres são extensões do MySQL; não há tais coisas no SQL padrão.

### 12.3.5 Conjunto de caracteres da coluna e correção de caracteres

Cada coluna de “caractere” (ou seja, uma coluna do tipo `CHAR`, `VARCHAR`, um tipo `TEXT` ou qualquer sinônimo) tem um conjunto de caracteres da coluna e uma correção de coluna. A sintaxe de definição de coluna para `CREATE TABLE` e `ALTER TABLE` tem cláusulas opcionais para especificar o conjunto de caracteres da coluna e a correção de coluna:

```
col_name {CHAR | VARCHAR | TEXT} (col_length)
    [CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Essas cláusulas também podem ser usadas para as colunas `ENUM` e `SET`:

```
col_name {ENUM | SET} (val_list)
    [CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Exemplos:

```
CREATE TABLE t1
(
    col1 VARCHAR(5)
      CHARACTER SET latin1
      COLLATE latin1_german1_ci
);

ALTER TABLE t1 MODIFY
    col1 VARCHAR(5)
      CHARACTER SET latin1
      COLLATE latin1_swedish_ci;
```

O MySQL escolhe o conjunto de caracteres e a codificação de caracteres da coluna da seguinte maneira:

* Se ambos os `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão utilizados.

  ```
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

O conjunto de caracteres e a correção são especificados para a coluna, então eles são usados. A coluna tem conjunto de caracteres `utf8mb4` e correção `utf8mb4_unicode_ci`.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua correção padrão serão utilizados.

  ```
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8mb4
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

O conjunto de caracteres é especificado para a coluna, mas a correção não está definida. A coluna tem o conjunto de caracteres `utf8mb4` e a correção padrão para `utf8mb4`, que é `utf8mb4_0900_ai_ci`. Para ver a correção padrão para cada conjunto de caracteres, use a declaração `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e à ordenação *`collation_name`* são utilizados.

  ```
  CREATE TABLE t1
  (
      col1 CHAR(10) COLLATE utf8mb4_polish_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

A correção é especificada para a coluna, mas o conjunto de caracteres não é. A coluna tem correção `utf8mb4_polish_ci` e o conjunto de caracteres é o associado à correção, que é `utf8mb4`.

* Caso contrário (nem `CHARACTER SET` nem `COLLATE` seja especificado), o conjunto de caracteres da tabela e a correção são usados.

  ```
  CREATE TABLE t1
  (
      col1 CHAR(10)
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

Não foi especificado o conjunto de caracteres ou a correção para a coluna, então os valores padrão da tabela são usados. A coluna tem o conjunto de caracteres `latin1` e a correção `latin1_bin`.

As cláusulas `CHARACTER SET` e `COLLATE` são SQL padrão.

Se você usar `ALTER TABLE` para converter uma coluna de um conjunto de caracteres para outro, o MySQL tenta mapear os valores dos dados, mas se os conjuntos de caracteres forem incompatíveis, pode haver perda de dados.

### 12.3.6 Conjunto de caracteres de literal de cadeia de caracteres e cotação de caracteres

Cada literal de cadeia de caracteres tem um conjunto de caracteres e uma ordenação.

Para a simples declaração `SELECT 'string'`, a cadeia de caracteres tem o conjunto de caracteres de conexão padrão e a correção definida pelas variáveis de sistema `character_set_connection` e `collation_connection`.

Uma literal de cadeia de caracteres pode ter um introduzidor de conjunto de caracteres opcional e a cláusula `COLLATE`, para designá-la como uma cadeia de caracteres que utiliza um conjunto de caracteres e uma ordenação específicos:

```
[_charset_name]'string' [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introduzir*. Ela informa ao analisador: “a string que segue usa o conjunto de caracteres *`charset_name`*”. Um introduzir não altera a string para o conjunto de caracteres introduzidor, como o `CONVERT()` faria. Não altera o valor da string, embora possa ocorrer preenchimento. O introduzir é apenas um sinal. Veja a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Exemplos:

```
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8mb4'abc' COLLATE utf8mb4_danish_ci;
```

Os introdutores de conjuntos de caracteres e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

O MySQL determina o conjunto de caracteres e a ordenação de uma literal de cadeia de caracteres da seguinte maneira:

* Se ambos *`_charset_name`* e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão utilizados. *`collation_name`* deve ser uma ordenação permitida para *`charset_name`*.

* Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o conjunto de caracteres *`charset_name`* e sua correção padrão são usados. Para ver a correção padrão para cada conjunto de caracteres, use a declaração [`SHOW CHARACTER SET`](show-character-set.html "15.7.7.3 SHOW CHARACTER SET Statement") ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado, o conjunto de caracteres padrão de conexão dado pela variável de sistema `character_set_connection` e a correção *`collation_name`* são usados. *`collation_name`* deve ser uma correção permitida para o conjunto de caracteres padrão de conexão.

* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` seja especificado), o conjunto de caracteres e a correção de conexão padrão da variável do sistema `character_set_connection` e `collation_connection` são utilizados.

Exemplos:

* Uma cadeia não binária com o conjunto de caracteres `latin1` e a ordenação `latin1_german1_ci`:

  ```
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  ```

* Uma cadeia não binária com o conjunto de caracteres `utf8mb4` e sua codificação padrão (ou seja, `utf8mb4_0900_ai_ci`):

  ```
  SELECT _utf8mb4'Müller';
  ```

* Uma string binária com o conjunto de caracteres `binary` e sua codificação padrão (ou seja, `binary`):

  ```
  SELECT _binary'Müller';
  ```

* Uma cadeia não binária com o conjunto de caracteres padrão de conexão e a collation `utf8mb4_0900_ai_ci` (falha se o conjunto de caracteres de conexão não for `utf8mb4`):

  ```
  SELECT 'Müller' COLLATE utf8mb4_0900_ai_ci;
  ```

* Uma cadeia com o conjunto de caracteres padrão de conexão e a correção de texto:

  ```
  SELECT 'Müller';
  ```

Um introducer indica o conjunto de caracteres para a string a seguir, mas não altera a forma como o analisador processa os escapes dentro da string. Os escapes são sempre interpretados pelo analisador de acordo com o conjunto de caracteres dado por `character_set_connection`.

Os exemplos a seguir mostram que o processamento de escape ocorre usando `character_set_connection`, mesmo na presença de um introducer. Os exemplos utilizam `SET NAMES` (que altera `character_set_connection`, conforme discutido na Seção 12.4, “Conjunto de caracteres de conexão e codificações”), e exibem os conteúdos das strings resultantes usando a função `HEX()` para que os conteúdos exatos das strings possam ser vistos.

Exemplo 1:

```
mysql> SET NAMES latin1;
mysql> SELECT HEX('à\n'), HEX(_sjis'à\n');
+------------+-----------------+
| HEX('à\n')  | HEX(_sjis'à\n')  |
+------------+-----------------+
| E00A       | E00A            |
+------------+-----------------+
```

Aqui, `à` (valor hexadecimal `E0`) é seguido por `\n`, a sequência de escape para nova linha. A sequência de escape é interpretada usando o valor `character_set_connection` de `latin1` para produzir uma nova linha literal (valor hexadecimal `0A`). Isso acontece mesmo para a segunda string. Ou seja, o `_sjis` introducer não afeta o processamento de escape do analisador.

Exemplo 2:

```
mysql> SET NAMES sjis;
mysql> SELECT HEX('à\n'), HEX(_latin1'à\n');
+------------+-------------------+
| HEX('à\n')  | HEX(_latin1'à\n')  |
+------------+-------------------+
| E05C6E     | E05C6E            |
+------------+-------------------+
```

Aqui, `character_set_connection` é `sjis`, um conjunto de caracteres no qual a sequência de `à` seguida por `\` (valores hexadecimais `05` e `5C`) é um caractere multibyte válido. Portanto, os dois primeiros bytes da string são interpretados como um único caractere `sjis`, e o `\` não é interpretado como um caractere de escape. O seguinte `n` (valor hexadecimal `6E`) não é interpretado como parte de uma sequência de escape. Isso é verdade mesmo para a segunda string; o `_latin1` introducer não afeta o processamento de escape.

### 12.3.7 O Conjunto de Caracteres Nacional

O SQL padrão define `NCHAR` ou `NATIONAL CHAR` como uma maneira de indicar que uma coluna `CHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8` como este conjunto de caracteres pré-definido. Por exemplo, essas declarações de tipo de dados são equivalentes:

```
CHAR(10) CHARACTER SET utf8
NATIONAL CHARACTER(10)
NCHAR(10)
```

Esses são os exemplos:

```
VARCHAR(10) CHARACTER SET utf8
NATIONAL VARCHAR(10)
NVARCHAR(10)
NCHAR VARCHAR(10)
NATIONAL CHARACTER VARYING(10)
NATIONAL CHAR VARYING(10)
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Essas declarações são equivalentes:

```
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

O MySQL 8.0 interpreta o conjunto de caracteres nacional como `utf8mb3`, que agora é descontinuado. Assim, ao usar `NATIONAL CHARACTER` ou um de seus sinônimos para definir o conjunto de caracteres para um banco de dados, tabela ou coluna, uma advertência semelhante à seguinte é exibida:

```
NATIONAL/NCHAR/NVARCHAR implies the character set UTF8MB3, which will be
replaced by UTF8MB4 in a future release. Please consider using CHAR(x) CHARACTER
SET UTF8MB4 in order to be unambiguous.
```

### 12.3.8 Introdutores de Conjunto de Caracteres

Uma literal de cadeia de caracteres, literal hexadecimal ou literal de valor de bit pode ter um introducer de conjunto de caracteres opcional e a cláusula `COLLATE`, para designá-la como uma cadeia de caracteres que usa um conjunto de caracteres e uma ordenação específicos:

```
[_charset_name] literal [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introduzir*. Ela informa ao analisador: “a string que segue usa o conjunto de caracteres *`charset_name`*”. Um introduzir não altera a string para o conjunto de caracteres introduzir como o `CONVERT()` faria. Não altera o valor da string, embora possa ocorrer preenchimento. O introduzir é apenas um sinal.

Para as referências de cadeia de caracteres, o espaço entre o introduzidor e a cadeia é permitido, mas opcional.

Para literais de conjunto de caracteres, um introduzidor indica o conjunto de caracteres para a string seguinte, mas não altera a forma como o analisador processa as escamas dentro da string. As escamas são sempre interpretadas pelo analisador de acordo com o conjunto de caracteres dado por `character_set_connection`. Para discussão adicional e exemplos, consulte a Seção 12.3.6, “Conjunto de caracteres de literal de string de caracteres e cotação”.

Exemplos:

```
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8mb4'abc' COLLATE utf8mb4_danish_ci;

SELECT _latin1 X'4D7953514C';
SELECT _utf8mb4 0x4D7953514C COLLATE utf8mb4_danish_ci;

SELECT _latin1 b'1000001';
SELECT _utf8mb4 0b1000001 COLLATE utf8mb4_danish_ci;
```

Os introdutores de conjuntos de caracteres e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

As letras de cadeia de caracteres podem ser designadas como strings binárias usando o introduzidor `_binary`. As letras hexadecimais e de valor de bit são strings binárias por padrão, então `_binary` é permitido, mas normalmente desnecessário. `_binary` pode ser útil para preservar uma letra hexadecimal ou de bit como uma string binária em contextos para os quais a letra é tratada como um número. Por exemplo, as operações de bit permitem argumentos de número ou string binária no MySQL 8.0 e superior, mas tratam letras hexadecimais e de bit como números por padrão. Para especificar explicitamente o contexto de string binária para tais letras, use um introduzidor `_binary` para pelo menos um dos argumentos:

```
mysql> SET @v1 = X'000D' | X'0BC0';
mysql> SET @v2 = _binary X'000D' | X'0BC0';
mysql> SELECT HEX(@v1), HEX(@v2);
+----------+----------+
| HEX(@v1) | HEX(@v2) |
+----------+----------+
| BCD      | 0BCD     |
+----------+----------+
```

O resultado exibido parece semelhante para ambas as operações de bits, mas o resultado sem `_binary` é um valor de `BIGINT`, enquanto o resultado com `_binary` é uma string binária. Devido à diferença nos tipos de resultados, os valores exibidos diferem: os dígitos de alta ordem não são exibidos para o resultado numérico.

O MySQL determina o conjunto de caracteres e a ordenação de uma literal de cadeia de caracteres, literal hexadecimal ou literal de valor de bit da seguinte maneira:

* Se ambos *`_charset_name`* e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão utilizados. *`collation_name`* deve ser uma ordenação permitida para *`charset_name`*.

* Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o conjunto de caracteres *`charset_name`* e sua correção padrão são usados. Para ver a correção padrão para cada conjunto de caracteres, use a declaração [`SHOW CHARACTER SET`](show-character-set.html "15.7.7.3 SHOW CHARACTER SET Statement") ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado:

+ Para uma cadeia de caracteres literal, o conjunto de caracteres padrão de conexão fornecido pela variável de sistema `character_set_connection` e a *`collation_name`* são usados. *`collation_name`* deve ser uma codificação permitida para o conjunto de caracteres padrão de conexão.

+ Para um literal hexadecimal ou literal de valor de bit, a única collation permitida é `binary`, pois esses tipos de literais são strings binárias por padrão.

* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` seja especificado):

+ Para uma cadeia de caracteres literal, o conjunto de caracteres padrão de conexão e a correção de dados fornecidos pelas variáveis de sistema `character_set_connection` e `collation_connection` são utilizados.

+ Para um literal hexadecimal ou literal de valor de bit, o conjunto de caracteres e a ordenação são `binary`.

Exemplos:

* Cadeias não binárias com conjunto de caracteres `latin1` e ordenação `latin1_german1_ci`:

  ```
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  SELECT _latin1 X'0A0D' COLLATE latin1_german1_ci;
  SELECT _latin1 b'0110' COLLATE latin1_german1_ci;
  ```

* Cadeias não binárias com o conjunto de caracteres `utf8mb4` e sua collation padrão (ou seja, `utf8mb4_0900_ai_ci`):

  ```
  SELECT _utf8mb4'Müller';
  SELECT _utf8mb4 X'0A0D';
  SELECT _utf8mb4 b'0110';
  ```

* Strings binárias com o conjunto de caracteres `binary` e sua collation padrão (ou seja, `binary`):

  ```
  SELECT _binary'Müller';
  SELECT X'0A0D';
  SELECT b'0110';
  ```

Os literais hexadecimais e os literais de valor de bit não precisam de introdução, pois são cadeias binárias por padrão.

* Uma cadeia não binária com o conjunto de caracteres padrão de conexão e a collation `utf8mb4_0900_ai_ci` (falha se o conjunto de caracteres de conexão não for `utf8mb4`):

  ```
  SELECT 'Müller' COLLATE utf8mb4_0900_ai_ci;
  ```

Essa construção (somente `COLLATE`) não funciona para literais hexadecimais ou literais de bits porque seu conjunto de caracteres é `binary`, independentemente do conjunto de caracteres de conexão, e `binary` não é compatível com a `utf8mb4_0900_ai_ci` collation. A única cláusula `COLLATE` permitida na ausência de um introduzir é `COLLATE binary`.

* Uma cadeia com o conjunto de caracteres padrão de conexão e a correção de texto:

  ```
  SELECT 'Müller';
  ```

### 12.3.9 Exemplos de atribuição de conjuntos de caracteres e de ordenação

Os exemplos a seguir mostram como o MySQL determina os valores padrão de conjunto de caracteres e collation.

**Exemplo 1: Definição de tabela e coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1 COLLATE latin1_german1_ci
) DEFAULT CHARACTER SET latin2 COLLATE latin2_bin;
```

Aqui temos uma coluna com um conjunto de caracteres `latin1` e uma ordenação `latin1_german1_ci`. A definição é explícita, então é direta. Observe que não há problema em armazenar uma coluna `latin1` em uma tabela `latin2`.

**Exemplo 2: Definição de tabela e coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10) CHARACTER SET latin1
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Desta vez, temos uma coluna com um conjunto de caracteres `latin1` e uma codificação padrão. Embora possa parecer natural, a codificação padrão não é tirada do nível da tabela. Em vez disso, como a codificação padrão para `latin1` é sempre `latin1_swedish_ci`, a codificação da coluna `c1` é `latin1_swedish_ci` (não `latin1_danish_ci`).

**Exemplo 3: Definição de tabela e coluna**

```
CREATE TABLE t1
(
    c1 CHAR(10)
) DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

Temos uma coluna com um conjunto de caracteres padrão e uma codificação padrão. Nestas circunstâncias, o MySQL verifica o nível da tabela para determinar o conjunto de caracteres da coluna. Consequentemente, o conjunto de caracteres da coluna `c1` é `latin1` e sua codificação é `latin1_danish_ci`.

**Exemplo 4: Definição de banco de dados, tabela e coluna**

```
CREATE DATABASE d1
    DEFAULT CHARACTER SET latin2 COLLATE latin2_czech_cs;
USE d1;
CREATE TABLE t1
(
    c1 CHAR(10)
);
```

Criamos uma coluna sem especificar seu conjunto de caracteres e correção. Também não estamos especificando um conjunto de caracteres e uma correção no nível da tabela. Nestas circunstâncias, o MySQL verifica o nível do banco de dados para determinar as configurações da tabela, que, posteriormente, se tornam as configurações da coluna.) Consequentemente, o conjunto de caracteres para a coluna `c1` é `latin2` e sua correção é `latin2_czech_cs`.

### 12.3.10 Compatibilidade com outros SGBD (Sistemas Gerenciadores de Banco de Dados)

Para compatibilidade com o MaxDB, essas duas declarações são iguais:

```
CREATE TABLE t1 (f1 CHAR(N) UNICODE);
CREATE TABLE t1 (f1 CHAR(N) CHARACTER SET ucs2);
```

Tanto o atributo `UNICODE` quanto o conjunto de caracteres `ucs2` são descontinuados no MySQL 8.0.28.