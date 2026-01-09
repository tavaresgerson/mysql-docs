### 11.1.1 Literais de String

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

Uma string binária é uma string de bytes. Cada string binária tem um conjunto de caracteres e uma ordenação nomeados `binary`. Uma string não binária é uma string de caracteres. Ela tem um conjunto de caracteres diferente de `binary` e uma ordenação compatível com o conjunto de caracteres.

Para ambos os tipos de strings, as comparações são baseadas nos valores numéricos da unidade de string. Para strings binárias, a unidade é o byte; as comparações usam valores numéricos de bytes. Para strings não binárias, a unidade é o caractere e alguns conjuntos de caracteres suportam caracteres multibyte; as comparações usam valores numéricos de código de caracteres. A ordem do código de caracteres é uma função da ordenação de string. (Para mais informações, consulte a Seção 12.8.5, “A ordenação binária comparada às ordenações _bin”).

::: info Nota

Dentro do cliente `mysql`, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.


:::

Um literal de string de caracteres pode ter um introduzir de conjunto de caracteres opcional e a cláusula `COLLATE`, para designá-lo como uma string que usa um conjunto de caracteres e ordenação particulares:

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

Para obter informações sobre essas formas de sintaxe de strings, consulte a Seção 12.3.7, “O Conjunto de Caracteres Nacional”, e a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Dentro de uma string, certas sequências têm um significado especial, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 11.1, “Sequências de Escape de Caracteres Especiais”. Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como uma barra de recuo, mas `\B` é interpretado como `B`. O processamento de escape é feito de acordo com o conjunto de caracteres indicado pela variável de sistema `character_set_connection`. Isso é verdadeiro mesmo para strings que são precedidas por um introduzir que indica um conjunto de caracteres diferente, conforme discutido na Seção 12.3.6, “Conjunto de Caracteres de Literal de String de Caracteres e Cotação”.

**Tabela 11.1 Sequências de Escape de Caracteres Especiais**

<table><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Sequência de Escape</th> <th>Caractere Representado pela Sequência</th> </tr></thead><tbody><tr> <td><code>\0</code></td> <td>Um caractere ASCII NUL (<code>X'00'</code>)</td> </tr><tr> <td><code>\'</code></td> <td>Um caractere de aspas simples (<code>'</code>)</td> </tr><tr> <td><code>\"</code></td> <td>Um caractere de aspas duplas (<code>"</code>)</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere de retrocesso (<code>\</code>)</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha (<code>\n</code>)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro (<code>\r</code>)</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação (<code>\t</code>)</td> </tr><tr> <td><code>\Z</code></td> <td>ASCII 26 (Control+Z); veja a nota a seguir</td> </tr><tr> <td><code>\\</code></td> <td>Um caractere barra (<code>\</code>)</td> </tr><tr> <td><code>\%</code></td> <td>Um caractere <code>%</code>; veja a nota a seguir</td> </tr><tr> <td><code>_</code></td> <td>Um caractere <code>_</code>; veja a nota a seguir</td> </tr></tbody></table>

O caractere ASCII 26 pode ser codificado como `\Z` para permitir que você trabalhe ao redor do problema de que o ASCII 26 representa o FIM DE ARQUIVO no Windows. O ASCII 26 dentro de um arquivo causa problemas se você tentar usar `mysql db_name < nome_arquivo`.

As sequências `\%` e `_` são usadas para procurar por instâncias literais de `%` e `_` em contextos de correspondência de padrões, onde, de outra forma, seriam interpretadas como caracteres curinga. Veja a descrição do operador `LIKE` na Seção 14.8.1, “Funções e Operadores de Comparação de Strings”. Se você usar `\%` ou `_` fora de contextos de correspondência de padrões, eles avaliam para as strings `\%` e `_`, não para `%` e `_`.

Há várias maneiras de incluir caracteres de aspas dentro de uma string:

* Uma `'` dentro de uma string citada com `'` pode ser escrita como `''`.
* Uma `"` dentro de uma string citada com `"` pode ser escrita como `""`.
* Antecipe o caractere de citação com um caractere de escape (`\`).
* A `'` dentro de uma string citada com `"` não precisa de tratamento especial e não precisa ser duplicada ou escamada. Da mesma forma, `"` dentro de uma string citada com `'` não precisa de tratamento especial.

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

Para inserir dados binários em uma coluna de string (como uma coluna `BLOB`), você deve representar certos caracteres por sequências de escape. O backslash (`\`) e o caractere de citação usado para citar a string devem ser escavados. Em certos ambientes de cliente, também pode ser necessário escavar `NUL` ou Control+Z. O cliente `mysql` trunca strings citadas que contêm caracteres `NUL` se não forem escavados, e Control+Z pode ser interpretado como FIM DE ARQUIVO em Windows se não for escavado. Para as sequências de escape que representam cada um desses caracteres, consulte a Tabela 11.1, “Sequências de Escape de Caracteres Especiais”.

Ao escrever programas de aplicação, qualquer string que possa conter qualquer um desses caracteres especiais deve ser corretamente escavada antes de a string ser usada como um valor de dados em uma instrução SQL enviada ao servidor MySQL. Você pode fazer isso de duas maneiras:

* Processe a string com uma função que escape os caracteres especiais. Em um programa em C, você pode usar a função `mysql_real_escape_string_quote()` da API C para escapar caracteres. Veja mysql_real_escape_string_quote(). Dentro das instruções SQL que constroem outras instruções SQL, você pode usar a função  `QUOTE()`. A interface DBI Perl fornece um método `quote` para converter caracteres especiais em aspas apropriadas. Veja Seção 31.9, “MySQL Perl API”. Outras interfaces de linguagem podem fornecer uma capacidade semelhante.
* Como alternativa ao escape explícito de caracteres especiais, muitas APIs MySQL fornecem uma capacidade de marcador que permite que você insira marcadores especiais em uma string de declaração e, em seguida, vincula valores de dados a eles ao emitir a declaração. Neste caso, a API cuida do escape de caracteres especiais nos valores para você.