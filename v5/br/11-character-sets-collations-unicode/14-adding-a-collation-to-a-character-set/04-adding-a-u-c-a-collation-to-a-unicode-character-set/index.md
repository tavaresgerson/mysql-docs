### 10.14.4 Adicionando uma Collation UCA a um Unicode Character Set

10.14.4.1 Definindo uma Collation UCA Usando Sintaxe LDML

10.14.4.2 Sintaxe LDML Suportada no MySQL

10.14.4.3 Diagnóstico Durante a Análise do Index.xml

Esta seção descreve como adicionar uma collation UCA para um Unicode Character Set, escrevendo o elemento `<collation>` dentro de uma descrição de character set `<charset>` no arquivo `Index.xml` do MySQL. O procedimento descrito aqui não requer a recompilação do MySQL. Ele usa um subconjunto da especificação Locale Data Markup Language (LDML), que está disponível em <http://www.unicode.org/reports/tr35/>. Com este método, não é necessário definir a collation inteira. Em vez disso, você começa com uma collation “base” existente e descreve a nova collation em termos de como ela difere da collation base. A tabela a seguir lista as collations base dos Unicode character sets para os quais collations UCA podem ser definidas. Não é possível criar collations UCA definidas pelo usuário para `utf16le`; não existe uma collation `utf16le_unicode_ci` que serviria como base para tais collations.

**Tabela 10.4 Character Sets do MySQL Disponíveis para Collations UCA Definidas pelo Usuário**

<table summary="Unicode character sets para os quais collations UCA definidas pelo usuário podem ser definidas e suas collations base."><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Character Set</th> <th>Collation Base</th> </tr></thead><tbody><tr> <td><code>utf8</code></td> <td><code>utf8_unicode_ci</code></td> </tr><tr> <td><code>ucs2</code></td> <td><code>ucs2_unicode_ci</code></td> </tr><tr> <td><code>utf16</code></td> <td><code>utf16_unicode_ci</code></td> </tr><tr> <td><code>utf32</code></td> <td><code>utf32_unicode_ci</code></td> </tr> </tbody></table>

As seções a seguir mostram como adicionar uma collation que é definida usando a sintaxe LDML e fornecem um resumo das regras LDML suportadas no MySQL.