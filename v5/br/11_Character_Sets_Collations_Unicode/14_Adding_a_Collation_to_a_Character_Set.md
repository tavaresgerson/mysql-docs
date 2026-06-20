## 10.14 Adicionando uma Colaboração a um Conjunto de Caracteres

Uma correção é um conjunto de regras que define como comparar e ordenar cadeias de caracteres. Cada correção em MySQL pertence a um único conjunto de caracteres. Cada conjunto de caracteres tem pelo menos uma correção e a maioria tem duas ou mais correções.

Uma ordenação de correspondência ordena os caracteres com base em pesos. Cada caractere em um conjunto de caracteres é mapeado para um peso. Caracteres com pesos iguais são comparados como iguais, e caracteres com pesos desiguais são comparados de acordo com a magnitude relativa de seus pesos.

A função `WEIGHT_STRING()` pode ser usada para ver os pesos dos caracteres em uma string. O valor que ela retorna para indicar pesos é uma string binária, então é conveniente usar `HEX(WEIGHT_STRING(str))` para exibir os pesos em forma imprimível. O exemplo a seguir mostra que os pesos não diferem para maiúsculas e minúsculas para as letras em `'AaBb'` se for uma string que não é sensível a maiúsculas e minúsculas, mas diferem se for uma string binária:

```sql
mysql> SELECT HEX(WEIGHT_STRING('AaBb' COLLATE latin1_swedish_ci));
+------------------------------------------------------+
| HEX(WEIGHT_STRING('AaBb' COLLATE latin1_swedish_ci)) |
+------------------------------------------------------+
| 41414242                                             |
+------------------------------------------------------+
mysql> SELECT HEX(WEIGHT_STRING(BINARY 'AaBb'));
+-----------------------------------+
| HEX(WEIGHT_STRING(BINARY 'AaBb')) |
+-----------------------------------+
| 41614262                          |
+-----------------------------------+
```

O MySQL suporta várias implementações de cotação, conforme discutido na Seção 10.14.1, “Tipos de Implementação de Cotação”. Algumas dessas podem ser adicionadas ao MySQL sem recompilar:

* Colagens simples para conjuntos de caracteres de 8 bits.
* Colagens baseadas em UCA para conjuntos de caracteres Unicode.
* Colagens binárias (`xxx_bin`)

As seções a seguir descrevem como adicionar colatelias definidas pelo usuário dos dois primeiros tipos a conjuntos de caracteres existentes. Todos os conjuntos de caracteres existentes já têm uma colatelia binária, portanto, não há necessidade de descrever como adicionar uma.

Resumo do procedimento para adicionar uma nova combinação de ordenação definida pelo usuário:

1. Escolha um ID de collation. 2. Adicione informações de configuração que nomeiam a collation e descrevem as regras de ordenação de caracteres.

3. Reinicie o servidor.  
4. Verifique se o servidor reconhece a codificação.

As instruções aqui cobrem apenas as collation definidas pelo usuário que podem ser adicionadas sem recompilar o MySQL. Para adicionar uma collation que exige recompilação (implementada por meio de funções em um arquivo de fonte C), use as instruções na Seção 10.13, “Adicionando um Conjunto de Caracteres”. No entanto, em vez de adicionar todas as informações necessárias para um conjunto de caracteres completo, modifique apenas os arquivos apropriados para um conjunto de caracteres existente. Ou seja, com base no que já está presente para as collation atuais do conjunto de caracteres, adicione estruturas de dados, funções e informações de configuração para a nova collation.

Nota

Se você modificar uma colagem definida pelo usuário existente, isso pode afetar a ordem das linhas para índices em colunas que utilizam a colagem. Nesse caso, reconstrua quaisquer índices desse tipo para evitar problemas, como resultados incorretos de consulta. Veja a Seção 2.10.12, “Reconstruir ou Reparar Tabelas ou Índices”.

### Recursos adicionais

* Exemplo que mostra como adicionar uma codificação para pesquisas de texto completo: Seção 12.9.7, “Adicionar uma codificação definida pelo usuário para indexação de texto completo”

* Especificação do Algoritmo de Cotação Unicode (UCA): <http://www.unicode.org/reports/tr10/>

* Especificação do Locale Data Markup Language (LDML): <http://www.unicode.org/reports/tr35/>

### 10.14.1 Tipos de Implementação de Collation

MySQL implementa vários tipos de colatões:

**Coleções simples para conjuntos de caracteres de 8 bits**

Esse tipo de ordenação é implementado usando um conjunto de 256 pesos que define uma correspondência um-para-um de códigos de caracteres para pesos. `latin1_swedish_ci` é um exemplo. É uma ordenação que não é sensível ao caso, portanto, as versões maiúsculas e minúsculas de um caractere têm os mesmos pesos e são comparadas como iguais.

```sql
mysql> SET NAMES 'latin1' COLLATE 'latin1_swedish_ci';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT HEX(WEIGHT_STRING('a')), HEX(WEIGHT_STRING('A'));
+-------------------------+-------------------------+
| HEX(WEIGHT_STRING('a')) | HEX(WEIGHT_STRING('A')) |
+-------------------------+-------------------------+
| 41                      | 41                      |
+-------------------------+-------------------------+
1 row in set (0.01 sec)

mysql> SELECT 'a' = 'A';
+-----------+
| 'a' = 'A' |
+-----------+
|         1 |
+-----------+
1 row in set (0.12 sec)
```

Para obter instruções de implementação, consulte a Seção 10.14.3, “Adicionando uma colagem simples a um conjunto de caracteres de 8 bits”.

**Colagens complexas para conjuntos de caracteres de 8 bits**

Esse tipo de ordenação é implementado usando funções em um arquivo de código fonte em C que definem como ordenar caracteres, conforme descrito na Seção 10.13, “Adicionando um Conjunto de Caracteres”.

**Colagens para conjuntos de caracteres multibyte não Unicode**

Para este tipo de cotação, os caracteres de 8 bits (único byte) e multibyte são tratados de maneira diferente. Para caracteres de 8 bits, os códigos de caracteres mapeiam em uma maneira insensível ao caso (por exemplo, os caracteres de único byte `'a'` e `'A'` têm ambos um peso de `0x41`). Para caracteres multibyte, existem dois tipos de relação entre os códigos de caracteres e os pesos:

* Os pesos correspondem aos códigos de caracteres. `sjis_japanese_ci` é um exemplo desse tipo de ordenação. O caractere multibyte `'ぢ'` tem um código de caracteres de `0x82C0`, e o peso também é `0x82C0`.

  ```sql
  mysql> CREATE TABLE t1
         (c1 VARCHAR(2) CHARACTER SET sjis COLLATE sjis_japanese_ci);
  Query OK, 0 rows affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES ('a'),('A'),(0x82C0);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
  +------+---------+------------------------+
  | c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
  +------+---------+------------------------+
  | a    | 61      | 41                     |
  | A    | 41      | 41                     |
  | ぢ    | 82C0    | 82C0                   |
  +------+---------+------------------------+
  3 rows in set (0.00 sec)
  ```

* Os códigos de caracteres mapeiam um para um aos pesos, mas um código não é necessariamente igual ao peso. `gbk_chinese_ci` é um exemplo desse tipo de ordenação. O caractere multibyte `'膰'` tem um código de caracteres de `0x81B0`, mas um peso de `0xC286`.

  ```sql
  mysql> CREATE TABLE t1
         (c1 VARCHAR(2) CHARACTER SET gbk COLLATE gbk_chinese_ci);
  Query OK, 0 rows affected (0.33 sec)

  mysql> INSERT INTO t1 VALUES ('a'),('A'),(0x81B0);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
  +------+---------+------------------------+
  | c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
  +------+---------+------------------------+
  | a    | 61      | 41                     |
  | A    | 41      | 41                     |
  | 膰    | 81B0    | C286                   |
  +------+---------+------------------------+
  3 rows in set (0.00 sec)
  ```

Para obter instruções de implementação, consulte a Seção 10.13, “Adicionar um conjunto de caracteres”.

**Colagens para conjuntos de caracteres multibyte Unicode**

Algumas dessas ordenações são baseadas no Algoritmo de Ordenação Unicode (UCA), outras

As codificações que não são da UCA têm uma correspondência um-a-um entre o código de caracteres e o peso. No MySQL, essas codificações são insensíveis ao caso e ao acento. `utf8_general_ci` é um exemplo: `'a'`, `'A'`, `'À'` e `'á'` têm diferentes códigos de caracteres, mas todos têm um peso de `0x0041` e são comparados como iguais.

```sql
mysql> SET NAMES 'utf8' COLLATE 'utf8_general_ci';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t1
       (c1 CHAR(1) CHARACTER SET UTF8 COLLATE utf8_general_ci);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO t1 VALUES ('a'),('A'),('À'),('á');
Query OK, 4 rows affected (0.00 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
+------+---------+------------------------+
| c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
+------+---------+------------------------+
| a    | 61      | 0041                   |
| A    | 41      | 0041                   |
| À    | C380    | 0041                   |
| á    | C3A1    | 0041                   |
+------+---------+------------------------+
4 rows in set (0.00 sec)
```

As colatões baseadas em UCA no MySQL têm essas propriedades:

* Se um caractere tiver pesos, cada peso usa 2 bytes (16 bits).

* Um caractere pode ter zero peso (ou um peso vazio). Nesse caso, o caractere é ignorável. Exemplo: "U+0000 NULL" não tem peso e é ignorável.

* Um personagem pode ter um peso. Exemplo: `'a'` tem um peso de `0x0E33`.

  ```sql
  mysql> SET NAMES 'utf8' COLLATE 'utf8_unicode_ci';
  Query OK, 0 rows affected (0.05 sec)

  mysql> SELECT HEX('a'), HEX(WEIGHT_STRING('a'));
  +----------+-------------------------+
  | HEX('a') | HEX(WEIGHT_STRING('a')) |
  +----------+-------------------------+
  | 61       | 0E33                    |
  +----------+-------------------------+
  1 row in set (0.02 sec)
  ```

* Um caractere pode ter várias pesos. Esta é uma expansão. Exemplo: A letra alemã `'ß'` (ligadura `0x0FEA0FEA` ou SHARP S) tem um peso de `0x0FEA0FEA`.

  ```sql
  mysql> SET NAMES 'utf8' COLLATE 'utf8_unicode_ci';
  Query OK, 0 rows affected (0.11 sec)

  mysql> SELECT HEX('ß'), HEX(WEIGHT_STRING('ß'));
  +-----------+--------------------------+
  | HEX('ß')  | HEX(WEIGHT_STRING('ß'))  |
  +-----------+--------------------------+
  | C39F      | 0FEA0FEA                 |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```

* Muitos caracteres podem ter um peso. Isso é uma contração. Exemplo: `'ch'` é uma única letra em checo e tem um peso de `0x0EE2`.

  ```sql
  mysql> SET NAMES 'utf8' COLLATE 'utf8_czech_ci';
  Query OK, 0 rows affected (0.09 sec)

  mysql> SELECT HEX('ch'), HEX(WEIGHT_STRING('ch'));
  +-----------+--------------------------+
  | HEX('ch') | HEX(WEIGHT_STRING('ch')) |
  +-----------+--------------------------+
  | 6368      | 0EE2                     |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```

Uma mapeo de muitos caracteres para muitos pesos também é possível (essa é uma contração com expansão), mas não é suportada pelo MySQL.

Para obter instruções de implementação, para uma combinação não UCA, consulte a Seção 10.13, “Adicionar um conjunto de caracteres”. Para uma combinação UCA, consulte a Seção 10.14.4, “Adicionar uma combinação UCA a um conjunto de caracteres Unicode”.

**Colagens variadas**

Há também algumas colorações que não se enquadram em nenhuma das categorias anteriores.

### 10.14.2 Escolhendo um ID de Colagem

Cada conjunto de ordenação deve ter um ID único. Para adicionar um conjunto de ordenação, você deve escolher um valor de ID que não esteja sendo usado atualmente. O MySQL suporta IDs de ordenação de dois bytes. A faixa de IDs de 1024 a 2047 é reservada para colatões definidos pelo usuário.

O ID de agregação que você escolheu aparece nesses contextos:

* A coluna `ID` do esquema de informações da tabela `COLLATIONS`.

* A coluna `Id` do `SHOW COLLATION` de saída.

* O membro `charsetnr` da estrutura de dados da API C `MYSQL_FIELD`.

* O membro `number` da estrutura de dados `MY_CHARSET_INFO` retornado pela função C API `mysql_get_character_set_info()`.

Para determinar o ID mais utilizado atualmente, emita a seguinte declaração:

```sql
mysql> SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
+---------+
| MAX(ID) |
+---------+
|     247 |
+---------+
```

Para exibir uma lista de todos os IDs atualmente utilizados, emita esta declaração:

```sql
mysql> SELECT ID FROM INFORMATION_SCHEMA.COLLATIONS ORDER BY ID;
+-----+
| ID  |
+-----+
|   1 |
|   2 |
| ... |
|  52 |
|  53 |
|  57 |
|  58 |
| ... |
|  98 |
|  99 |
| 128 |
| 129 |
| ... |
| 247 |
+-----+
```

Aviso

Antes de fazer a atualização, você deve salvar os arquivos de configuração que você altera. Se você fizer a atualização no local, o processo substituirá os arquivos modificados.

### 10.14.3 Adicionando uma Colagem Simples a um Conjunto de Caracteres de 8 Bits

Esta seção descreve como adicionar uma collation simples para um conjunto de caracteres de 8 bits, escrevendo os elementos `<collation>` associados a uma descrição de conjunto de caracteres `<charset>` no arquivo `Index.xml` do MySQL. O procedimento descrito aqui não requer recompilação do MySQL. O exemplo adiciona uma collation nomeada `latin1_test_ci` ao conjunto de caracteres `latin1`.

1. Escolha um ID de collation, conforme mostrado na Seção 10.14.2, “Escolhendo um ID de collation”. Os passos a seguir utilizam um ID de 1024.

2. Modifique os arquivos de configuração `Index.xml` e `latin1.xml`. Esses arquivos estão localizados no diretório nomeado pela variável de sistema `character_sets_dir`. Você pode verificar o valor da variável da seguinte forma, embora o nome do caminho possa ser diferente no seu sistema:

   ```sql
   mysql> SHOW VARIABLES LIKE 'character_sets_dir';
   +--------------------+-----------------------------------------+
   | Variable_name      | Value                                   |
   +--------------------+-----------------------------------------+
   | character_sets_dir | /user/local/mysql/share/mysql/charsets/ |
   +--------------------+-----------------------------------------+
   ```

3. Escolha um nome para a ordenação e liste-o no arquivo `Index.xml`. Encontre o elemento `<charset>` para o conjunto de caracteres ao qual a ordenação está sendo adicionada e adicione um elemento `<collation>` que indique o nome e o ID da ordenação, para associar o nome ao ID. Por exemplo:

   ```sql
   <charset name="latin1">
     ...
     <collation name="latin1_test_ci" id="1024"/>
     ...
   </charset>
   ```

4. No arquivo de configuração `latin1.xml`, adicione um elemento `<collation>` que nomeie a codificação e que contenha um elemento `<map>` que defina uma tabela de mapeamento de código de caracteres para peso dos códigos de caracteres de 0 a 255. Cada valor dentro do elemento `<map>` deve ser um número no formato hexadecimal.

   ```sql
   <collation name="latin1_test_ci">
   <map>
    00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
    10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F
    20 21 22 23 24 25 26 27 28 29 2A 2B 2C 2D 2E 2F
    30 31 32 33 34 35 36 37 38 39 3A 3B 3C 3D 3E 3F
    40 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
    50 51 52 53 54 55 56 57 58 59 5A 5B 5C 5D 5E 5F
    60 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
    50 51 52 53 54 55 56 57 58 59 5A 7B 7C 7D 7E 7F
    80 81 82 83 84 85 86 87 88 89 8A 8B 8C 8D 8E 8F
    90 91 92 93 94 95 96 97 98 99 9A 9B 9C 9D 9E 9F
    A0 A1 A2 A3 A4 A5 A6 A7 A8 A9 AA AB AC AD AE AF
    B0 B1 B2 B3 B4 B5 B6 B7 B8 B9 BA BB BC BD BE BF
    41 41 41 41 5B 5D 5B 43 45 45 45 45 49 49 49 49
    44 4E 4F 4F 4F 4F 5C D7 5C 55 55 55 59 59 DE DF
    41 41 41 41 5B 5D 5B 43 45 45 45 45 49 49 49 49
    44 4E 4F 4F 4F 4F 5C F7 5C 55 55 55 59 59 DE FF
   </map>
   </collation>
   ```

5. Reinicie o servidor e use esta declaração para verificar se a collation está presente:

   ```sql
   mysql> SHOW COLLATION WHERE Collation = 'latin1_test_ci';
   +----------------+---------+------+---------+----------+---------+
   | Collation      | Charset | Id   | Default | Compiled | Sortlen |
   +----------------+---------+------+---------+----------+---------+
   | latin1_test_ci | latin1  | 1024 |         |          |       1 |
   +----------------+---------+------+---------+----------+---------+
   ```

### 10.14.4 Adicionando uma Colaboração UCA a um Conjunto de Caracteres Unicode

10.14.4.1 Definindo uma Colaboração UCA usando sintaxe LDML

10.14.4.2 Sintaxe LDML suportada no MySQL

10.14.4.3 Diagnósticos durante a análise do Index.xml

Esta seção descreve como adicionar uma codificação UCA para um conjunto de caracteres Unicode escrevendo o elemento `<collation>` dentro de uma descrição de conjunto de caracteres `<charset>` no arquivo MySQL `Index.xml`. O procedimento descrito aqui não requer recompilação do MySQL. Ele usa um subconjunto da especificação do Locale Data Markup Language (LDML), que está disponível em <http://www.unicode.org/reports/tr35/>. Com este método, você não precisa definir toda a codificação. Em vez disso, você começa com uma codificação “base” existente e descreve a nova codificação em termos de como ela difere da codificação base. A tabela a seguir lista as codificações base dos conjuntos de caracteres Unicode para os quais podem ser definidas codificações UCA. Não é possível criar codificações UCA definidas pelo usuário para `utf16le`; não há uma codificação `utf16le_unicode_ci` que serviria como base para tais codificações.

**Tabela 10.4 Conjuntos de caracteres MySQL disponíveis para colas de UCA definidas pelo usuário**

<table summary="Unicode character sets for which user-defined UCA collations can be defined and their base collations."><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Character Set</th> <th>Base Collation</th> </tr></thead><tbody><tr> <td><code>utf8</code></td> <td><code>utf8_unicode_ci</code></td> </tr><tr> <td><code>ucs2</code></td> <td><code>ucs2_unicode_ci</code></td> </tr><tr> <td><code>utf16</code></td> <td><code>utf16_unicode_ci</code></td> </tr><tr> <td><code>utf32</code></td> <td><code>utf32_unicode_ci</code></td> </tr></tbody></table>

As seções a seguir mostram como adicionar uma codificação definida usando a sintaxe LDML e fornecem um resumo das regras LDML suportadas no MySQL.

#### 10.14.4.1 Definindo uma Colaboração UCA Usando Sintaxe LDML

Para adicionar uma codificação de UCA para um conjunto de caracteres Unicode sem recompilar o MySQL, use o procedimento a seguir. Se você não estiver familiarizado com as regras LDML usadas para descrever as características de ordenação da codificação, consulte a Seção 10.14.4.2, “Sintaxe LDML suportada no MySQL”.

O exemplo adiciona uma ordenação chamada `utf8_phone_ci` ao conjunto de caracteres `utf8`. A ordenação é projetada para um cenário que envolve uma aplicação web para a qual os usuários postam seus nomes e números de telefone. Os números de telefone podem ser fornecidos em formatos muito diferentes:

```sql
+7-12345-67
+7-12-345-67
+7 12 345 67
+7 (12) 345 67
+71234567
```

O problema levantado ao lidar com esse tipo de valor é que os formatos permitidos variam, o que torna a busca por um número de telefone específico muito difícil. A solução é definir uma nova ordenação que reordene os caracteres de pontuação, tornando-os ignoráveis.

1. Escolha um ID de collation, conforme mostrado na Seção 10.14.2, “Escolhendo um ID de collation”. Os passos a seguir utilizam um ID de 1029.

2. Para modificar o arquivo de configuração `Index.xml`. Este arquivo está localizado no diretório nomeado pela variável de sistema `character_sets_dir`. Você pode verificar o valor da variável da seguinte forma, embora o nome do caminho possa ser diferente no seu sistema:

   ```sql
   mysql> SHOW VARIABLES LIKE 'character_sets_dir';
   +--------------------+-----------------------------------------+
   | Variable_name      | Value                                   |
   +--------------------+-----------------------------------------+
   | character_sets_dir | /user/local/mysql/share/mysql/charsets/ |
   +--------------------+-----------------------------------------+
   ```

3. Escolha um nome para a ordenação e liste-o no arquivo `Index.xml`. Além disso, você precisará fornecer as regras de ordenação da ordenação. Encontre o elemento `<charset>` para o conjunto de caracteres ao qual a ordenação está sendo adicionada e adicione um elemento `<collation>` que indique o nome e o ID da ordenação, para associar o nome ao ID. Dentro do elemento `<collation>`, forneça um elemento `<rules>` contendo as regras de ordenação:

   ```sql
   <charset name="utf8">
     ...
     <collation name="utf8_phone_ci" id="1029">
       <rules>
         <reset>\u0000</reset>
         <i>\u0020</i> <!-- space -->
         <i>\u0028</i> <!-- left parenthesis -->
         <i>\u0029</i> <!-- right parenthesis -->
         <i>\u002B</i> <!-- plus -->
         <i>\u002D</i> <!-- hyphen -->
       </rules>
     </collation>
     ...
   </charset>
   ```

4. Se você deseja uma codificação semelhante para outros conjuntos de caracteres Unicode, adicione outros elementos `<collation>`. Por exemplo, para definir `ucs2_phone_ci`, adicione um elemento `<collation>` ao elemento `<charset name="ucs2">`. Lembre-se de que cada codificação deve ter seu próprio ID único.

5. Reinicie o servidor e use esta declaração para verificar se a collation está presente:

   ```sql
   mysql> SHOW COLLATION WHERE Collation = 'utf8_phone_ci';
   +---------------+---------+------+---------+----------+---------+
   | Collation     | Charset | Id   | Default | Compiled | Sortlen |
   +---------------+---------+------+---------+----------+---------+
   | utf8_phone_ci | utf8    | 1029 |         |          |       8 |
   +---------------+---------+------+---------+----------+---------+
   ```

Agora, teste a correção para garantir que ela tenha as propriedades desejadas.

Crie uma tabela contendo alguns números de telefone de amostra usando a nova ordenação:

```sql
mysql> CREATE TABLE phonebook (
         name VARCHAR(64),
         phone VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_phone_ci
       );
Query OK, 0 rows affected (0.09 sec)

mysql> INSERT INTO phonebook VALUES ('Svoj','+7 912 800 80 02');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Hf','+7 (912) 800 80 04');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Bar','+7-912-800-80-01');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Ramil','(7912) 800 80 03');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Sanja','+380 (912) 8008005');
Query OK, 1 row affected (0.00 sec)
```

Execute algumas consultas para verificar se os caracteres de pontuação ignorados estão, de fato, ignorados para comparação e ordenação:

```sql
mysql> SELECT * FROM phonebook ORDER BY phone;
+-------+--------------------+
| name  | phone              |
+-------+--------------------+
| Sanja | +380 (912) 8008005 |
| Bar   | +7-912-800-80-01   |
| Svoj  | +7 912 800 80 02   |
| Ramil | (7912) 800 80 03   |
| Hf    | +7 (912) 800 80 04 |
+-------+--------------------+
5 rows in set (0.00 sec)

mysql> SELECT * FROM phonebook WHERE phone='+7(912)800-80-01';
+------+------------------+
| name | phone            |
+------+------------------+
| Bar  | +7-912-800-80-01 |
+------+------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM phonebook WHERE phone='79128008001';
+------+------------------+
| name | phone            |
+------+------------------+
| Bar  | +7-912-800-80-01 |
+------+------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM phonebook WHERE phone='7 9 1 2 8 0 0 8 0 0 1';
+------+------------------+
| name | phone            |
+------+------------------+
| Bar  | +7-912-800-80-01 |
+------+------------------+
1 row in set (0.00 sec)
```

#### 10.14.4.2 Sintaxe LDML suportada no MySQL

Esta seção descreve a sintaxe LDML que o MySQL reconhece. Este é um subconjunto da sintaxe descrita na especificação LDML disponível em <http://www.unicode.org/reports/tr35/>, que deve ser consultada para obter mais informações. O MySQL reconhece um subconjunto suficientemente grande da sintaxe que, em muitos casos, é possível baixar uma definição de ordenação do Repositório de Dados de Local Comum Unicode e colar a parte relevante (ou seja, a parte entre as tags `<rules>` e `</rules>`) no arquivo `Index.xml` do MySQL. As regras descritas aqui são todas suportadas, exceto que a ordenação de caracteres ocorre apenas no nível primário. As regras que especificam diferenças em níveis de ordenação secundários ou superiores são reconhecidas (e, portanto, podem ser incluídas em definições de ordenação) mas são tratadas como igualdade no nível primário.

O servidor MySQL gera diagnósticos quando encontra problemas ao analisar o arquivo `Index.xml`. Veja a Seção 10.14.4.3, “Diagnósticos durante a análise do Index.xml”.

**Representação de Personagem**

Os caracteres nomeados nas regras LDML podem ser escritos literalmente ou no formato `\unnnn`, onde *`nnnn`* é o valor do ponto de código Unicode hexadecimal. Por exemplo, `A` e `á` podem ser escritos literalmente ou como `\u0041` e `\u00E1`. Dentro dos valores hexadecimais, os dígitos `A` a `F` não são sensíveis ao caso; `\u00E1` e `\u00e1` são equivalentes. Para as colunas UCA 4.0.0, a notação hexadecimal pode ser usada apenas para caracteres na Linguagem Multilíngue Básica, não para caracteres fora da faixa de BMP de `0000` a `FFFF`. Para as colunas UCA 5.2.0, a notação hexadecimal pode ser usada para qualquer caractere.

O próprio arquivo `Index.xml` deve ser escrito usando codificação UTF-8.

**Regras de Sintaxe**

O LDML redefiniu as regras e as regras de deslocamento para especificar a ordem dos caracteres. As ordens são dadas como um conjunto de regras que começam com uma regra de reajuste que estabelece um ponto de ancoragem, seguido por regras de deslocamento que indicam como os caracteres são ordenados em relação ao ponto de ancoragem.

* Uma regra `<reset>` não especifica qualquer ordem em si mesma. Em vez disso, ela “redefine” a ordem para as regras de deslocamento subsequentes, fazendo com que elas sejam tomadas em relação a um caractere dado. Qualquer uma das seguintes regras redefine as regras de deslocamento subsequentes para serem tomadas em relação à letra `'A'`:

  ```sql
  <reset>A</reset>

  <reset>\u0041</reset>
  ```

* As regras de mudança dos `<p>`, `<s>` e `<t>` definem as diferenças primárias, secundárias e terciárias de um personagem em relação a outro:

+ Use diferenças primárias para distinguir letras separadas.

+ Use diferenças secundárias para distinguir as variações de sotaque.

+ Use diferenças terciárias para distinguir variações de maiúsculas e minúsculas.

Uma dessas regras especifica uma regra de deslocamento primário para o caractere `'G'`:

  ```sql
  G

  \u0047
  ```

* A regra de deslocamento `<i>` indica que um caractere se classifica de forma idêntica a outro. As seguintes regras fazem com que `'b'` se classifique da mesma forma que `'a'`:

  ```sql
  <reset>a</reset>
  <i>b</i>
  ```

* A sintaxe de deslocamento abreviada especifica múltiplas regras de deslocamento usando um único par de tags. O quadro a seguir mostra a correspondência entre as regras de sintaxe abreviada e as regras equivalentes não abreviadas.

**Tabela 10.5 Sintaxe de Shift abreviada**

  <table summary="Abbreviated and corresponding nonabbreviated shift syntax rules."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Abbreviated Syntax</th> <th>Nonabbreviated Syntax</th> </tr></thead><tbody><tr> <td><code>&lt;pc&gt;xyz&lt;/pc&gt;</code></td> <td><code>&lt;p&gt;x&lt;/p&gt;&lt;p&gt;y&lt;/p&gt;&lt;p&gt;z&lt;/p&gt;</code></td> </tr><tr> <td><code>&lt;sc&gt;xyz&lt;/sc&gt;</code></td> <td><code>&lt;s&gt;x&lt;/s&gt;&lt;s&gt;y&lt;/s&gt;&lt;s&gt;z&lt;/s&gt;</code></td> </tr><tr> <td><code>&lt;tc&gt;xyz&lt;/tc&gt;</code></td> <td><code>&lt;t&gt;x&lt;/t&gt;&lt;t&gt;y&lt;/t&gt;&lt;t&gt;z&lt;/t&gt;</code></td> </tr><tr> <td><code>&lt;ic&gt;xyz&lt;/ic&gt;</code></td> <td><code>&lt;i&gt;x&lt;/i&gt;&lt;i&gt;y&lt;/i&gt;&lt;i&gt;z&lt;/i&gt;</code></td> </tr></tbody></table>

* Uma expansão é uma regra de reajuste que estabelece um ponto de ancoragem para uma sequência de vários caracteres. O MySQL suporta expansões de 2 a 6 caracteres. As seguintes regras colocam `'z'` no nível primário maior do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset>
  z
  ```

* Uma contração é uma regra de deslocamento que classifica uma sequência de vários caracteres. O MySQL suporta contrações de 2 a 6 caracteres. As seguintes regras colocam a sequência de três caracteres `'xyz'` no nível primário maior do que `'a'`:

  ```sql
  <reset>a</reset>
  xyz
  ```

* Expansões longas e contrações longas podem ser usadas juntas. Essas regras colocam a sequência de três caracteres `'xyz'` no nível primário maior do que a sequência de três caracteres `'abc'`:

  ```sql
  <reset>abc</reset>
  xyz
  ```

* A sintaxe de expansão normal usa `<x>` mais elementos `<extend>` para especificar uma expansão. As seguintes regras colocam o caractere `'k'` em um nível secundário maior do que a sequência `'ch'`. Isso significa que `'k'` se comporta como se expandisse para um caractere após `'c'`, seguido por `'h'`:

  ```sql
  <reset>c</reset>
  <x><s>k</s><extend>h</extend></x>
  ```

Essa sintaxe permite sequências longas. Essas regras classificam a sequência `'ccs'` no nível terciário como superior à sequência `'cscs'`:

  ```sql
  <reset>cs</reset>
  <x><t>ccs</t><extend>cs</extend></x>
  ```

A especificação LDML descreve a sintaxe de expansão normal como "complexa". Veja essa especificação para obter detalhes.

* A sintaxe de contexto anterior usa `<x>` mais os elementos `<context>` para especificar que o contexto antes de um caractere afeta como ele é classificado. As seguintes regras colocam `'-'` em um nível secundário maior do que `'a'`, mas apenas quando `'-'` ocorre após `'b'`:

  ```sql
  <reset>a</reset>
  <x><context>b</context><s>-</s></x>
  ```

* O contexto anterior da sintaxe pode incluir o elemento `<extend>`. Essas regras colocam `'def'` em um nível primário maior do que `'aghi'`, mas apenas quando `'def'` vem após `'abc'`:

  ```sql
  <reset>a</reset>
  <x><context>abc</context>def<extend>ghi</extend></x>
  ```

* As regras de deslocamento permitem um atributo `before`. Normalmente, as regras de deslocamento após uma regra de deslocamento indicam caracteres que se classificam após o caractere de deslocamento. As regras de deslocamento após uma regra de deslocamento que tem o atributo `before` indicam caracteres que se classificam antes do caractere de deslocamento. As seguintes regras colocam o caractere `'b'` imediatamente antes de `'a'` no nível primário:

  ```sql
  <reset before="primary">a</reset>
  b
  ```

Os valores de atributos `before` permitidos especificam o nível de classificação por nome ou o valor numérico equivalente:

  ```sql
  <reset before="primary">
  <reset before="1">

  <reset before="secondary">
  <reset before="2">

  <reset before="tertiary">
  <reset before="3">
  ```

* Uma regra de reposição pode nomear uma posição de reposição lógica em vez de um caractere literal:

  ```sql
  <first_tertiary_ignorable/>
  <last_tertiary_ignorable/>
  <first_secondary_ignorable/>
  <last_secondary_ignorable/>
  <first_primary_ignorable/>
  <last_primary_ignorable/>
  <first_variable/>
  <last_variable/>
  <first_non_ignorable/>
  <last_non_ignorable/>
  <first_trailing/>
  <last_trailing/>
  ```

Essas regras colocam `'z'` em uma posição superior ao nível primário em relação a caracteres não ignorais que possuem uma entrada na Tabela de Elementos de Colaboração Unicode Padrão (DUCET) e que não são CJK:

  ```sql
  <reset><last_non_ignorable/></reset>
  z
  ```

As posições lógicas têm os pontos de código mostrados na tabela a seguir.

**Tabela 10.6 Pontos de código de posição de reposição lógica**

  <table summary="Logical positions and Unicode 4.0.0 and Unicode 5.2.0 code points."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Posição Lógica</th> <th>Ponto de código Unicode 4.0.0</th> <th>Ponto de código Unicode 5.2.0</th> </tr></thead><tbody><tr> <th><code>&lt;first_non_ignorable/&gt;</code></th> <td>U+02D0</td> <td>U+02D0</td> </tr><tr> <th><code>&lt;last_non_ignorable/&gt;</code></th> <td>U+A48C</td> <td>U+1342E</td> </tr><tr> <th><code>&lt;first_primary_ignorable/&gt;</code></th> <td>U+0332</td> <td>U+0332</td> </tr><tr> <th><code>&lt;last_primary_ignorable/&gt;</code></th> <td>U+20EA</td> <td>U+101FD</td> </tr><tr> <th><code>&lt;first_secondary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_secondary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th><code>&lt;first_tertiary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_tertiary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th><code>&lt;first_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;last_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th><code>&lt;first_variable/&gt;</code></th> <td>U+0009</td> <td>U+0009</td> </tr><tr> <th><code>&lt;last_variable/&gt;</code></th> <td>U+2183</td> <td>U+1D371</td> </tr></tbody></table>

* O elemento `<collation>` permite um atributo `shift-after-method` que afeta o cálculo do peso do caractere para regras de deslocamento. O atributo tem esses valores permitidos:

+ `simple`: Calcular pesos de caracteres como para regras de redefinição que não possuem o atributo `before`. Este é o padrão se o atributo não for fornecido.

+ `expand`: Use expansões para mudanças após as regras de reajuste.

Suponha que `'0'` e `'1'` tenham pesos de `0E29` e `0E2A` e que queiramos colocar todas as letras latinas básicas entre `'0'` e `'1'`:

  ```sql
  <reset>0</reset>
  <pc>abcdefghijklmnopqrstuvwxyz</pc>
  ```

Para o modo de mudança simples, os pesos são calculados da seguinte forma:

  ```sql
  'a' has weight 0E29+1
  'b' has weight 0E29+2
  'c' has weight 0E29+3
  ...
  ```

No entanto, não há vagas suficientes para colocar 26 caracteres entre `'0'` e `'1'`. O resultado é que dígitos e letras estão misturados.

Para resolver isso, use `shift-after-method="expand"`. Em seguida, os pesos são calculados da seguinte forma:

  ```sql
  'a' has weight [0E29][233D+1]
  'b' has weight [0E29][233D+2]
  'c' has weight [0E29][233D+3]
  ...
  ```

`233D` é o peso UCA 4.0.0 para o caractere `0xA48C`, que é o último caractere não ignora (um tipo de maior caractere na colocação, excluindo CJK). O UCA 5.2.0 é semelhante, mas usa `3ACA`, para o caractere `0x1342E`.

Extensões específicas do MySQL para LDML

Uma extensão das regras do LDML permite que o elemento `<collation>` inclua um atributo opcional `version` nas tags `<collation>` para indicar a versão da UCA em que a ordenação se baseia. Se o atributo `version` for omitido, seu valor padrão é `4.0.0`. Por exemplo, esta especificação indica uma ordenação que se baseia na UCA 5.2.0:

```sql
<collation id="nnn" name="utf8_xxx_ci" version="5.2.0">
...
</collation>
```

#### 10.14.4.3 Diagnósticos durante a análise do Index.xml

O servidor MySQL gera diagnósticos quando encontra problemas ao analisar o arquivo `Index.xml`:

* Tags desconhecidas são escritas no log de erro. Por exemplo, a seguinte mensagem resulta se uma definição de collation contiver uma tag `<aaa>`:

  ```sql
  [Warning] Buffered warning: Unknown LDML tag:
  'charsets/charset/collation/rules/aaa'
  ```

* Se a inicialização da correção de texto não for possível, o servidor reporta um erro de "correção de texto desconhecida" e também gera avisos explicando os problemas, como no exemplo anterior. Em outros casos, quando uma descrição de correção de texto é geralmente correta, mas contém algumas etiquetas desconhecidas, a correção de texto é inicializada e está disponível para uso. As partes desconhecidas são ignoradas, mas um aviso é gerado no log de erro.

* Problemas com as codificações geram avisos que os clientes podem exibir com `SHOW WARNINGS`(show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). Suponha que uma regra de redefinição contenha uma expansão maior que o comprimento máximo suportado de 6 caracteres:

  ```sql
  <reset>abcdefghi</reset>
  <i>x</i>
  ```

Uma tentativa de usar a correção produz avisos:

  ```sql
  mysql> SELECT _utf8'test' COLLATE utf8_test_ci;
  ERROR 1273 (HY000): Unknown collation: 'utf8_test_ci'
  mysql> SHOW WARNINGS;
  +---------+------+----------------------------------------+
  | Level   | Code | Message                                |
  +---------+------+----------------------------------------+
  | Error   | 1273 | Unknown collation: 'utf8_test_ci'      |
  | Warning | 1273 | Expansion is too long at 'abcdefghi=x' |
  +---------+------+----------------------------------------+
  ```
