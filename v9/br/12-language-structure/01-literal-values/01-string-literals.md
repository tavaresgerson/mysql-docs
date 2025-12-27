### 11.1.1 Literal de String

Uma string é uma sequência de bytes ou caracteres, contida entre aspas simples (`'`) ou aspas duplas (`"`). Exemplos:

```
'a string'
"another string"
```

Strings com aspas colocadas uma ao lado da outra são concatenadas a uma única string. As seguintes linhas são equivalentes:

```
'a string'
'a' ' ' 'string'
```

Se o modo SQL `ANSI_QUOTES` estiver habilitado, os literais de string podem ser com aspas apenas dentro de aspas simples, pois uma string com aspas duplas é interpretada como um identificador.

Uma string binária é uma string de bytes. Cada string binária tem um conjunto de caracteres e uma ordenação nomeados `binary`. Uma string não binária é uma string de caracteres. Ela tem um conjunto de caracteres diferente de `binary` e uma ordenação que é compatível com o conjunto de caracteres.

Para ambos os tipos de strings, as comparações são baseadas nos valores numéricos da unidade de string. Para strings binárias, a unidade é o byte; as comparações usam valores numéricos de bytes. Para strings não binárias, a unidade é o caractere e alguns conjuntos de caracteres suportam caracteres multibyte; as comparações usam valores numéricos de código de caracteres. A ordem do código de caracteres é uma função da ordenação de string. (Para mais informações, consulte a Seção 12.8.5, “A ordenação binária comparada às ordenações \_bin”.)

Nota

Dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

Um literal de string de caracteres pode ter um introduzir opcional de conjunto de caracteres e a cláusula `COLLATE`, para designá-lo como uma string que usa um conjunto de caracteres e ordenação particulares:

```
[_charset_name]'string' [COLLATE collation_name]
```

Exemplos:

```
SELECT _latin1'string';
SELECT _binary'string';
SELECT _utf8mb4'string' COLLATE utf8mb4_danish_ci;
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Essas declarações são equivalentes:

```
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

Para obter informações sobre essas formas de sintaxe de string, consulte a Seção 12.3.7, “O Conjunto de Caracteres Nacional”, e a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Dentro de uma string, certas sequências têm um significado especial, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 11.1, “Sequências de Escape de Caracteres Especiais”. Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como um recuo, mas `\B` é interpretado como `B`. O processamento de escape é feito de acordo com o conjunto de caracteres indicado pela variável de sistema `character_set_connection`. Isso é verdadeiro mesmo para strings que são precedidas por um introduzir que indica um conjunto de caracteres diferente, conforme discutido na Seção 12.3.6, “Conjunto de Caracteres de Literal de String de Caracteres e Colaboração”.

**Tabela 11.1 Sequências de Escape de Caracteres Especiais**

<table summary="Sequências de escape e os caracteres que elas representam."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Sequência de Escape</th> <th>Caractere Representado pela Sequência</th> </tr></thead><tbody><tr> <td><code class="literal">\0</code><a class="indexterm" name="id192220"></a><a class="indexterm" name="id192222"></a></td> <td>Um caractere ASCII NUL (<code class="literal">X'00'</code>)</td> </tr><tr> <td><code class="literal">\'</code><a class="indexterm" name="id192229"></a><a class="indexterm" name="id192231"></a></td> <td>Um caractere de aspas simples (<code class="literal">'</code>)</td> </tr><tr> <td><code class="literal">\"</code><a class="indexterm" name="id192238"></a><a class="indexterm" name="id192240"></a></td> <td>Um caractere de aspas duplas (<code class="literal">"</code>)</td> </tr><tr> <td><code class="literal">\b</code><a class="indexterm" name="id192247"></a><a class="indexterm" name="id192249"></a></td> <td>Um caractere de recuo</td> </tr><tr> <td><code class="literal">\n</code><a class="indexterm" name="id192255"></a><a class="indexterm" name="id192257"></a><a class="indexterm" name="id192259"></a><a class="indexterm" name="id192261"></a></td> <td>Um caractere de nova linha (linefeed)</td> </tr><tr> <td><code class="literal">\r</code><a class="indexterm" name="id192267"></a><a class="indexterm" name="id192269"></a><a class="indexterm" name="id192271"></a></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td><code class="literal">\t</code><a class="indexterm" name="id192277"></a><a class="indexterm" name="id192279"></a></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code class="literal">\Z</code><a class="indexterm" name="id192285"></a><a class="indexterm" name="id192287"></a></td> <td>ASCII 26 (Control+Z); veja a nota a seguir</td> </tr><tr> <td><code class="literal">\\</code><a class="indexterm" name="id192293"></a><a class="indexterm" name="id192295"></a></td> <td>Um caractere de barra invertida (<code class="literal">\</code>)</td> </tr><tr> <td><code class="literal">\%</code><a class="indexterm" name="id192302"></a><a class="indexterm" name="id192304"></a></td> <td>Um caractere <code class="literal">%</code>; veja a nota a seguir</td> </tr><tr> <td><code class="literal">\_</code><a class="indexterm" name="id192311"></a><a class="indexterm" name="id192313"></a></td> <td>Um caractere <code class="literal">_</code>; veja a nota a seguir</td> </tr></tbody></table>

O caractere ASCII 26 pode ser codificado como `\Z` para permitir que você trabalhe ao redor do problema de que o ASCII 26 representa o FIM DE ARQUIVO no Windows. O ASCII 26 dentro de um arquivo causa problemas se você tentar usar `mysql db_name < nome_arquivo`.

As sequências `\%` e `\_` são usadas para procurar instâncias literais de `%` e `_` em contextos de correspondência de padrões, onde, de outra forma, seriam interpretadas como caracteres curinga. Veja a descrição do operador `LIKE` na Seção 14.8.1, “Funções e Operadores de Comparação de Strings”. Se você usar `\%` ou `\_` fora de contextos de correspondência de padrões, eles são avaliados como as strings `\%` e `\_`, e não como `%` e `_`.

Há várias maneiras de incluir caracteres de citação dentro de uma string:

* Uma `'` dentro de uma string citada com `'` pode ser escrita como `''`.

* Uma `"` dentro de uma string citada com `"` pode ser escrita como `""`.

* Antecipe o caractere de citação com um caractere de escape (`\`).

* Uma `'` dentro de uma string citada com `"` não precisa de tratamento especial e não precisa ser duplicada ou escamada. Da mesma forma, `"` dentro de uma string citada com `'` não precisa de tratamento especial.

As seguintes instruções `SELECT` demonstram como a citação e a escavação funcionam:

```
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

Para inserir dados binários em uma coluna de string (como uma coluna `BLOB`), você deve representar certos caracteres por sequências de escape. O barra invertida (`\`) e o caractere de citação usado para citar a string devem ser escamados. Em certos ambientes de cliente, também pode ser necessário escapar `NUL` ou Control+Z. O cliente **mysql** trunca strings citadas que contêm caracteres `NUL` se não forem escamados, e Control+Z pode ser interpretado como FIM DE ARQUIVO no Windows se não for escamado. Para as sequências de escape que representam cada um desses caracteres, consulte a Tabela 11.1, “Sequências de Escape de Caracteres Especiais”.

Ao escrever programas de aplicação, qualquer string que possa conter qualquer um desses caracteres especiais deve ser corretamente escapada antes de a string ser usada como um valor de dados em uma instrução SQL enviada ao servidor MySQL. Você pode fazer isso de duas maneiras:

* Processar a string com uma função que escapa os caracteres especiais. Em um programa em C, você pode usar a função `mysql_real_escape_string_quote()` da API C para escapar caracteres. Veja mysql\_real\_escape\_string\_quote(). Dentro de instruções SQL que constroem outras instruções SQL, você pode usar a função `QUOTE()`. A interface DBI de Perl fornece um método `quote` para converter caracteres especiais em aspas apropriadas. Veja a Seção 31.9, “MySQL Perl API”. Outras interfaces de linguagem podem fornecer uma capacidade semelhante.

* Como alternativa ao escape explícito de caracteres especiais, muitas APIs MySQL fornecem uma capacidade de marcador que permite que você insira marcadores especiais em uma string de declaração e, em seguida, vincule valores de dados a eles ao emitir a declaração. Neste caso, a API cuida do escape de caracteres especiais nos valores para você.