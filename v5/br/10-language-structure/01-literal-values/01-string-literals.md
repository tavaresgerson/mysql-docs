### 9.1.1 Literais de String

Uma cadeia é uma sequência de bytes ou caracteres, contida entre aspas simples (`'`) ou aspas duplas (`"`). Exemplos:

```sql
'a string'
"another string"
```

As cadeias de caracteres citadas colocadas uma ao lado da outra são concatenadas em uma única cadeia de caracteres. As linhas seguintes são equivalentes:

```sql
'a string'
'a' ' ' 'string'
```

Se o modo `ANSI_QUOTES` do SQL estiver ativado, as linguagens de caracteres podem ser citadas apenas entre aspas simples, pois uma string citada entre aspas duplas é interpretada como um identificador.

Uma string binária é uma string de bytes. Cada string binária tem um conjunto de caracteres e uma ordenação nomeados `binary`. Uma string não binária é uma string de caracteres. Ela tem um conjunto de caracteres diferente de `binary` e uma ordenação compatível com o conjunto de caracteres.

Para ambos os tipos de strings, as comparações são baseadas nos valores numéricos da unidade de string. Para strings binárias, a unidade é o byte; as comparações usam valores numéricos de byte. Para strings não binárias, a unidade é o caractere e alguns conjuntos de caracteres suportam caracteres multibyte; as comparações usam valores numéricos de código de caracteres. A ordem do código de caracteres é uma função da ordenação da string. (Para mais informações, consulte a Seção 10.8.5, “A Colagem Binária Comparada às Colagens _bin”).

Nota

No cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

Uma literal de cadeia de caracteres pode ter um introduzir de conjunto de caracteres opcional e uma cláusula `COLLATE`, para designá-la como uma cadeia de caracteres que usa um conjunto de caracteres e uma ordenação específicas:

```sql
[_charset_name]'string' [COLLATE collation_name]
```

Exemplos:

```sql
SELECT _latin1'string';
SELECT _binary'string';
SELECT _utf8'string' COLLATE utf8_danish_ci;
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Essas declarações são equivalentes:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

Para obter informações sobre essas formas de sintaxe de strings, consulte a Seção 10.3.7, “O Conjunto Nacional de Caracteres”, e a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

Dentro de uma cadeia, certas sequências têm um significado especial, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 9.1, “Sequências de escape de caracteres especiais”. Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como uma tecla de recuo, mas `\B` é interpretado como `B`. O processamento de escape é feito de acordo com o conjunto de caracteres indicado pela variável de sistema `character_set_connection`. Isso é verdadeiro mesmo para cadeias que são precedidas por um introducer que indica um conjunto de caracteres diferente, conforme discutido na Seção 10.3.6, “Conjunto de caracteres e cotação de caracteres literais de string”.

**Tabela 9.1 Sequências de Escape de Caracteres Especiais**

<table summary="Sequências de escape e os caracteres que elas representam."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Sequência de fuga</th> <th>Personagem representado pela sequência</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>\Z</code>]</td> <td>Um caractere ASCII NUL ([[PH_HTML_CODE_<code>\Z</code>])</td> </tr><tr> <td>[[PH_HTML_CODE_<code>\</code>]</td> <td>Um único caractere de citação ([[PH_HTML_CODE_<code>\%</code>])</td> </tr><tr> <td>[[PH_HTML_CODE_<code>%</code>]</td> <td>Um caractere de citação dupla ([[PH_HTML_CODE_<code>_</code>])</td> </tr><tr> <td>[[PH_HTML_CODE_<code>_</code>]</td> <td>Um caractere de retrocesso</td> </tr><tr> <td>[[<code>\n</code>]]</td> <td>Um caractere de nova linha (linefeed)</td> </tr><tr> <td>[[<code>\r</code>]]</td> <td>Um caractere de retorno de carro</td> </tr><tr> <td>[[<code>\t</code>]]</td> <td>Um caractere de tabulação</td> </tr><tr> <td>[[<code>\Z</code>]]</td> <td>ASCII 26 (Control+Z); consulte a nota após a tabela</td> </tr><tr> <td>[[<code>X'00'</code><code>\Z</code>]</td> <td>Um caractere barra invertida ([[<code>\</code>]])</td> </tr><tr> <td>[[<code>\%</code>]]</td> <td>Um caractere [[<code>%</code>]]; veja a nota após a tabela</td> </tr><tr> <td>[[<code>_</code>]]</td> <td>Um caractere [[<code>_</code>]]; veja a nota após a tabela</td> </tr></tbody></table>

O caractere ASCII 26 pode ser codificado como `\Z` para permitir que você trabalhe ao redor do problema de que o ASCII 26 representa o FIM DE ARQUIVO no Windows. O ASCII 26 dentro de um arquivo causa problemas se você tentar usar `mysql db_name < nome_arquivo`.

As sequências `\%` e `_` são usadas para procurar instâncias literais de `%` e `_` em contextos de correspondência de padrões, onde, de outra forma, seriam interpretadas como caracteres curinga. Veja a descrição do operador `LIKE` na Seção 12.8.1, “Funções e Operadores de Comparação de Strings”. Se você usar `\%` ou `_` fora de contextos de correspondência de padrões, eles serão avaliados como as strings `\%` e `_`, e não como `%` e `_`.

Há várias maneiras de incluir caracteres de citação dentro de uma string:

- Um `'` dentro de uma string citada com `'` pode ser escrito como `''`.

- Um `"` dentro de uma string citada com `"` pode ser escrito como `""`.

- Antecipe o caractere de citação com um caractere de escape (`\`).

- Um `'` dentro de uma string citada com `"` não precisa de tratamento especial e não precisa ser duplicado ou escamado. Da mesma forma, `"` dentro de uma string citada com `'` não precisa de tratamento especial.

As seguintes instruções `SELECT` demonstram como a citação e a escavação funcionam:

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

Para inserir dados binários em uma coluna de string (como uma coluna `BLOB`), você deve representar certos caracteres por sequências de escape. O backslash (`\`) e o caractere de citação usado para citar a string devem ser escapados. Em certos ambientes de cliente, também pode ser necessário escapar `NUL` ou Control+Z. O cliente **mysql** trunca strings citadas que contêm caracteres `NUL` se não forem escapados, e Control+Z pode ser interpretado como FIM DE ARQUIVO no Windows se não for escapado. Para as sequências de escape que representam cada um desses caracteres, consulte a Tabela 9.1, “Sequências de Escape de Caracteres Especiais”.

Ao escrever programas de aplicação, qualquer string que possa conter qualquer um desses caracteres especiais deve ser escapada corretamente antes de a string ser usada como um valor de dados em uma instrução SQL enviada ao servidor MySQL. Você pode fazer isso de duas maneiras:

- Processar a string com uma função que escape os caracteres especiais. Em um programa em C, você pode usar a função `mysql_real_escape_string_quote()` da API C para escapar caracteres. Veja mysql_real_escape_string_quote(). Dentro das instruções SQL que constroem outras instruções SQL, você pode usar a função `QUOTE()`. A interface DBI Perl fornece um método `quote` para converter caracteres especiais em sequências de escape apropriadas. Veja a Seção 27.9, “MySQL Perl API”. Outras interfaces de linguagem podem fornecer uma capacidade semelhante.

- Como alternativa para escapar explicitamente de caracteres especiais, muitas APIs do MySQL oferecem uma capacidade de marcador de lugar que permite que você insira marcadores especiais em uma string de declaração e, em seguida, vincule os valores dos dados a eles quando você emitir a declaração. Nesse caso, a API cuida de escapar os caracteres especiais nos valores para você.
