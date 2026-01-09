## 9.2 Nomes de Objetos de Esquema

9.2.1 Limites de comprimento do identificador

9.2.2 Identificadores qualificadores

9.2.3 Sensibilidade do identificador à maiúscula e minúscula

9.2.4 Mapeamento de Identificadores para Nomes de Arquivos

9.2.5 Análise e resolução do nome da função

Certos objetos dentro do MySQL, incluindo banco de dados, tabela, índice, coluna, alias, visualização, procedimento armazenado, partição, tablespace e outros nomes de objetos, são conhecidos como identificadores. Esta seção descreve a sintaxe permitida para identificadores no MySQL. A Seção 9.2.1, “Limites de comprimento de identificadores”, indica o comprimento máximo de cada tipo de identificador. A Seção 9.2.3, “Sensibilidade ao caso das letras dos identificadores”, descreve quais tipos de identificadores são sensíveis ao caso e sob quais condições.

Um identificador pode ser citado ou não. Se um identificador contém caracteres especiais ou é uma palavra reservada, você *deve* citá-lo sempre que se referir a ele. (Exceção: uma palavra reservada que segue um ponto em um nome qualificado deve ser um identificador, portanto, não precisa ser citada.) As palavras reservadas estão listadas na Seção 9.3, “Palavras-chave e Palavras Reservadas”.

Internamente, os identificadores são convertidos e armazenados como Unicode (UTF-8). Os caracteres Unicode permitidos nos identificadores são aqueles no Plano Multilíngue Básico (BMP). Caracteres suplementares não são permitidos. Portanto, os identificadores podem conter esses caracteres:

- Caracteres permitidos em identificadores não citados:

  - ASCII: [0-9, a-z, A-Z$_] (letras latinas básicas, dígitos 0-9, dólar, sublinhado)

  - Extendido: U+0080 .. U+FFFF

- Os caracteres permitidos em identificadores com aspas incluem o conjunto completo do plano básico multilíngue Unicode (BMP), exceto U+0000:

  - ASCII: U+0001 .. U+007F
  - Extendido: U+0080 .. U+FFFF

- Os caracteres ASCII NUL (U+0000) e os caracteres suplementares (U+10000 e superiores) não são permitidos em identificadores citados ou não citados.

- Os identificadores podem começar com um dígito, mas, a menos que citados, não podem ser compostos exclusivamente por dígitos.

- Os nomes de banco de dados, tabelas e colunas não podem terminar com caracteres de espaço.

O caractere de citação de identificador é o backtick (\`\`\`):

```sql
mysql> SELECT * FROM `select` WHERE `select`.id > 100;
```

Se o modo `ANSI_QUOTES` do SQL estiver ativado, também é permitido citar identificadores entre aspas duplas:

```sql
mysql> CREATE TABLE "test" (col INT);
ERROR 1064: You have an error in your SQL syntax...
mysql> SET sql_mode='ANSI_QUOTES';
mysql> CREATE TABLE "test" (col INT);
Query OK, 0 rows affected (0.00 sec)
```

O modo `ANSI_QUOTES` faz com que o servidor interprete cadeias de caracteres com aspas duplas como identificadores. Consequentemente, quando este modo é ativado, as cadeias de caracteres literais devem ser fechadas entre aspas simples. Elas não podem ser fechadas entre aspas duplas. O modo SQL do servidor é controlado conforme descrito na Seção 5.1.10, “Modos SQL do Servidor”.

Os caracteres de citação de identificadores podem ser incluídos dentro de um identificador se você citar o identificador. Se o caractere a ser incluído dentro do identificador for o mesmo usado para citar o próprio identificador, então você precisa duplicá-lo. A seguinte declaração cria uma tabela chamada `a`b`que contém uma coluna chamada`c"d\`:

```sql
mysql> CREATE TABLE `a``b` (`c"d` INT);
```

Na lista selecionada de uma consulta, um alias de coluna com aspas pode ser especificado usando caracteres de aspas para identificadores ou strings:

```sql
mysql> SELECT 1 AS `one`, 2 AS 'two';
+-----+-----+
| one | two |
+-----+-----+
|   1 |   2 |
+-----+-----+
```

Em outras partes da declaração, as referências a apelidos devem usar aspas de identificação ou a referência é tratada como um literal de string.

Recomenda-se que você não use nomes que comecem com `Me` ou `MeN`, onde *`M`* e *`N`* são inteiros. Por exemplo, evite usar `1e` como identificador, porque uma expressão como `1e+3` é ambígua. Dependendo do contexto, ela pode ser interpretada como a expressão \`1e

- 3 ou como o número "1e+3".

Tenha cuidado ao usar `MD5()` para criar nomes de tabelas, pois ele pode gerar nomes em formatos ilegais ou ambíguos, como os descritos acima.

Uma variável de usuário não pode ser usada diretamente em uma instrução SQL como um identificador ou como parte de um identificador. Consulte a Seção 9.4, “Variáveis Definidas pelo Usuário”, para obter mais informações e exemplos de soluções alternativas.

Os caracteres especiais nos nomes de bancos de dados e tabelas são codificados nos nomes correspondentes do sistema de arquivos, conforme descrito na Seção 9.2.4, “Mapeamento de Identificadores para Nomes de Arquivos”. Se você tiver bancos de dados ou tabelas de uma versão mais antiga do MySQL que contenham caracteres especiais e para os quais os nomes de diretórios ou arquivos subjacentes não tenham sido atualizados para usar o novo codificação, o servidor exibe seus nomes com um prefixo de `#mysql50#`. Para obter informações sobre como referenciar esses nomes ou convertê-los para a codificação mais recente, consulte essa seção.
