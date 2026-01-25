### 9.1.1 Literais de String

Uma String é uma sequência de bytes ou caracteres, delimitada por aspas simples (`'`) ou aspas duplas (`"`). Exemplos:

```sql
'a string'
"another string"
```

Strings entre aspas colocadas lado a lado são concatenadas em uma única String. As seguintes linhas são equivalentes:

```sql
'a string'
'a' ' ' 'string'
```

Se o SQL mode `ANSI_QUOTES` estiver ativado, literais de String podem ser delimitados apenas por aspas simples, pois uma String delimitada por aspas duplas é interpretada como um identifier.

Uma String binária é uma String de bytes. Toda String binária tem um character set e collation nomeados `binary`. Uma String não binária é uma String de caracteres. Ela tem um character set diferente de `binary` e um collation que é compatível com o character set.

Para ambos os tipos de Strings, as comparações são baseadas nos valores numéricos da unidade da String. Para Strings binárias, a unidade é o byte; as comparações usam valores numéricos de byte. Para Strings não binárias, a unidade é o caractere, e alguns character sets suportam caracteres multibyte; as comparações usam valores de código de caractere numérico. A ordenação do código de caractere é uma função do string collation. (Para mais informações, consulte a Seção 10.8.5, “A Collation binary Comparada às Collations _bin”).

Nota

Dentro do cliente **mysql**, Strings binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

Um literal de String de caractere pode ter um *character set introducer* opcional e uma cláusula `COLLATE`, para designá-lo como uma String que usa um character set e collation específicos:

```sql
[_charset_name]'string' [COLLATE collation_name]
```

Exemplos:

```sql
SELECT _latin1'string';
SELECT _binary'string';
SELECT _utf8'string' COLLATE utf8_danish_ci;
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma String no *national character set*. Estas instruções são equivalentes:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

Para obter informações sobre essas formas de sintaxe de String, consulte a Seção 10.3.7, “O National Character Set”, e a Seção 10.3.8, “Character Set Introducers”.

Dentro de uma String, certas sequências têm um significado especial, a menos que o SQL mode `NO_BACKSLASH_ESCAPES` esteja ativado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como o *escape character*. O MySQL reconhece as escape sequences mostradas na Tabela 9.1, “Escape Sequences de Caracteres Especiais”. Para todas as outras escape sequences, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências diferenciam maiúsculas de minúsculas (*case-sensitive*). Por exemplo, `\b` é interpretado como um *backspace*, mas `\B` é interpretado como `B`. O processamento de escape é realizado de acordo com o character set indicado pela variável de sistema `character_set_connection`. Isso é verdade mesmo para Strings que são precedidas por um *introducer* que indica um character set diferente, conforme discutido na Seção 10.3.6, “Character Set e Collation de Literal de String de Caractere”.

**Tabela 9.1 Escape Sequences de Caracteres Especiais**

<table summary="Sequências de escape e os caracteres que elas representam."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Escape Sequence</th> <th>Caractere Representado pela Sequência</th> </tr></thead><tbody><tr> <td><code>\0</code></td> <td>Um caractere ASCII NUL (<code>X'00'</code>)</td> </tr><tr> <td><code>\'</code></td> <td>Um caractere de aspa simples (<code>'</code>)</td> </tr><tr> <td><code>\"</code></td> <td>Um caractere de aspa dupla (<code>"</code>)</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere backspace</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere newline (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere carriage return</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere tab</td> </tr><tr> <td><code>\Z</code></td> <td>ASCII 26 (Control+Z); veja a nota após a tabela</td> </tr><tr> <td><code>\\</code></td> <td>Um caractere de barra invertida (<code>\</code>)</td> </tr><tr> <td><code>\%</code></td> <td>Um caractere <code>%</code>; veja a nota após a tabela</td> </tr><tr> <td><code>\_</code></td> <td>Um caractere <code>_</code>; veja a nota após a tabela</td> </tr></tbody></table>

O caractere ASCII 26 pode ser codificado como `\Z` para contornar o problema de que o ASCII 26 representa END-OF-FILE no Windows. O ASCII 26 dentro de um arquivo causa problemas se você tentar usar `mysql db_name < file_name`.

As sequências `\%` e `\_` são usadas para buscar instâncias literais de `%` e `_` em contextos de *pattern-matching* onde, de outra forma, seriam interpretadas como *wildcard characters*. Consulte a descrição do operator `LIKE` na Seção 12.8.1, “Funções e Operators de Comparação de String”. Se você usar `\%` ou `\_` fora dos contextos de *pattern-matching*, eles serão avaliados como as Strings `\%` e `\_`, e não como `%` e `_`.

Existem várias maneiras de incluir caracteres de aspas dentro de uma String:

* Uma `'` dentro de uma String delimitada por `'` pode ser escrita como `''`.
* Uma `"` dentro de uma String delimitada por `"` pode ser escrita como `""`.
* Preceder o caractere de aspas por um escape character (`\`).
* Uma `'` dentro de uma String delimitada por `"` não requer tratamento especial e não precisa ser dobrada ou escapada. Da mesma forma, uma `"` dentro de uma String delimitada por `'` não requer tratamento especial.

As seguintes instruções `SELECT` demonstram como funcionam a delimitação por aspas (*quoting*) e o *escaping*:

```sql
mysql> SELECT 'hello', '"hello"', '""hello""', 'hel''lo', '\'hello';
+-------+---------+-----------+--------+--------+
| hello | "hello" | ""hello"" | hel'lo | 'hello |
+-------+---------+-----------+--------+--------+

mysql> SELECT "hello", "'hello'", "''hello''", "hel""lo", "\"hello";
+-------+---------+-----------+--------+--------+
| hello | 'hello' | ''hello'' | hel"lo | "hello |
+-------+---------+-----------+--------+--------+

mysql> SELECT 'This\nIs\nFour\nLines';
+--------------------+
| This
Is
Four
Lines |
+--------------------+

mysql> SELECT 'disappearing\ backslash';
+------------------------+
| disappearing backslash |
+------------------------+
```

Para inserir dados binários em uma coluna de String (como uma coluna `BLOB`), você deve representar certos caracteres por escape sequences. A barra invertida (`\`) e o caractere de aspas usado para delimitar a String devem ser escapados. Em certos ambientes client, pode ser necessário também escapar `NUL` ou Control+Z. O client **mysql** trunca Strings delimitadas que contêm caracteres `NUL` se eles não forem escapados, e Control+Z pode ser interpretado como END-OF-FILE no Windows se não for escapado. Para as escape sequences que representam cada um desses caracteres, consulte a Tabela 9.1, “Escape Sequences de Caracteres Especiais”.

Ao escrever programas de aplicação, qualquer String que possa conter qualquer um desses caracteres especiais deve ser devidamente escapada antes que a String seja usada como um valor de dado em uma instrução SQL que é enviada ao MySQL server. Você pode fazer isso de duas maneiras:

* Processar a String com uma função que escapa os caracteres especiais. Em um C program, você pode usar a função C API `mysql_real_escape_string_quote()` para escapar caracteres. Consulte mysql_real_escape_string_quote(). Dentro de instruções SQL que constroem outras instruções SQL, você pode usar a função `QUOTE()`. A interface Perl DBI fornece um método `quote` para converter caracteres especiais nas escape sequences apropriadas. Consulte a Seção 27.9, “API Perl MySQL”. Outras interfaces de linguagem podem fornecer uma capacidade semelhante.
* Como alternativa ao escape explícito de caracteres especiais, muitas APIs MySQL fornecem um recurso de *placeholder* (marcador de posição) que permite inserir marcadores especiais em uma String de instrução e, em seguida, vincular valores de dados a eles ao emitir a instrução. Neste caso, a API se encarrega de escapar os caracteres especiais nos valores por você.