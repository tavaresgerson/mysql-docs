## 11.2 Nomes de Objetos do Esquema

Certos objetos dentro do MySQL, incluindo banco de dados, tabela, índice, coluna, alias, visualização, procedimento armazenado, partição, tablespace, grupo de recursos e outros nomes de objetos são conhecidos como identificadores. Esta seção descreve a sintaxe permitida para identificadores no MySQL. A Seção 11.2.1, “Limites de Comprimento de Identificadores”, indica o comprimento máximo de cada tipo de identificador. A Seção 11.2.3, “Sensibilidade ao Caso dos Identificadores”, descreve quais tipos de identificadores são sensíveis ao caso e sob quais condições.

Um identificador pode ser citado ou não. Se um identificador contém caracteres especiais ou é uma palavra reservada, você *deve* citá-lo sempre que o referenciar. (Exceção: Uma palavra reservada que segue um ponto em um nome qualificado deve ser um identificador, então não precisa ser citada.) As palavras reservadas estão listadas na Seção 11.3, “Palavras-Chave e Palavras Reservadas”.

Internacionalmente, os identificadores são convertidos e armazenados como Unicode (UTF-8). Os caracteres Unicode permitidos nos identificadores são aqueles no Plano Multilíngue Básico (BMP). Caracteres suplementares não são permitidos. Os identificadores podem, portanto, conter esses caracteres:

* Caracteres permitidos em identificadores não citados:

  + ASCII: [0-9,a-z,A-Z$_] (letras latinas básicas, dígitos 0-9, dólar, sublinhado)
  + Extendido: U+0080 .. U+FFFF
* Caracteres permitidos em identificadores citados incluem o Plano Multilíngue Básico Unicode (BMP) completo, exceto U+0000:

+ ASCII: U+0001 .. U+007F
  + Extendido: U+0080 .. U+FFFF
* ASCII NUL (U+0000) e caracteres suplementares (U+10000 e superiores) não são permitidos em identificadores citados ou não citados.
* Os identificadores podem começar com um dígito, mas, a menos que citados, não podem consistir exclusivamente de dígitos.
* Os nomes de banco de dados, tabelas e colunas não podem terminar com caracteres de espaço.
* O uso do sinal de dólar como o primeiro caractere no nome não citado de um banco de dados, tabela, visualização, coluna, programa armazenado ou alias é desaconselhado, incluindo tais nomes usados com qualificadores (veja  Seção 11.2.2, “Qualificadores de Identificador”). Um identificador não citado que começa com um sinal de dólar não pode conter quaisquer caracteres de sinal de dólar adicionais. Caso contrário, o sinal de dólar inicial é permitido, mas aciona uma advertência de descontinuidade.
* O sinal de dólar ainda pode ser usado como o caractere inicial de tal identificador sem produzir a advertência, quando é citado de acordo com as regras dadas mais adiante nesta seção.
O caractere de citação do identificador é o backtick (`` ` ``):

```
mysql> SELECT * FROM `select` WHERE `select`.id > 100;
```

Se o modo SQL  `ANSI_QUOTES` estiver habilitado, também é permitido citar identificadores dentro de aspas duplas:

```
mysql> CREATE TABLE "test" (col INT);
ERROR 1064: You have an error in your SQL syntax...
mysql> SET sql_mode='ANSI_QUOTES';
mysql> CREATE TABLE "test" (col INT);
Query OK, 0 rows affected (0.00 sec)
```
O modo  `ANSI_QUOTES` faz com que o servidor interprete strings com aspas duplas como identificadores. Consequentemente, quando este modo está habilitado, as literais de string devem ser fechadas entre aspas simples. Elas não podem ser fechadas entre aspas duplas. O modo SQL do servidor é controlado conforme descrito em  Seção 7.1.11, “Modos SQL do Servidor”.
Os caracteres de citação de identificador podem ser incluídos dentro de um identificador se você citar o identificador. Se o caractere a ser incluído dentro do identificador for o mesmo usado para citar o próprio identificador, então você precisa duplicar o caractere. A seguinte declaração cria uma tabela chamada `` a`b `` que contém uma coluna chamada `c"d`:

```
mysql> CREATE TABLE `a``b` (`c"d` INT);
```
Na lista de seleção de uma consulta, um alias de coluna citado pode ser especificado usando caracteres de citação de identificador ou de string:

```
mysql> SELECT 1 AS `one`, 2 AS 'two';
+-----+-----+
| one | two |
+-----+-----+
|   1 |   2 |
+-----+-----+
```

Em outros trechos da declaração, as referências a alias devem usar aspas para identificar o nome ou a referência é tratada como uma literal de string.

Recomenda-se que você não use nomes que comecem com `Me` ou `MeN`, onde *`M`* e *`N`* são inteiros. Por exemplo, evite usar `1e` como um identificador, porque uma expressão como `1e+3` é ambígua. Dependendo do contexto, pode ser interpretada como a expressão `1e
+ 3` ou como o número `1e+3`.

Tenha cuidado ao usar `MD5()` para criar nomes de tabelas, pois pode gerar nomes em formatos ilegais ou ambíguos, como os descritos acima.

Também é recomendável que você não use nomes de colunas que comecem com `!hidden!` para garantir que novos nomes não colidem com nomes usados por colunas ocultas existentes para índices funcionais.

Uma variável de usuário não pode ser usada diretamente em uma declaração SQL como um identificador ou como parte de um identificador. Consulte a Seção 11.4, “Variáveis Definidas pelo Usuário”, para obter mais informações e exemplos de soluções alternativas.

Caracteres especiais em nomes de banco de dados e tabelas são codificados nos nomes correspondentes do sistema de arquivos, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores para Nomes de Arquivos”.