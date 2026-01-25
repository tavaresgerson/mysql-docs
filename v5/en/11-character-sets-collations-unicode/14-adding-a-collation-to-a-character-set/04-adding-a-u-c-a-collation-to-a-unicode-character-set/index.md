### 10.14.4 Adicionando uma Collation UCA a um Character Set Unicode

10.14.4.1 Definindo uma Collation UCA Usando Sintaxe LDML

10.14.4.2 Sintaxe LDML Suportada no MySQL

10.14.4.3 Diagnósticos Durante o Parsing de Index.xml

Esta seção descreve como adicionar uma Collation UCA para um Character Set Unicode escrevendo o elemento `<collation>` dentro de uma descrição de Character Set `<charset>` no arquivo `Index.xml` do MySQL. O procedimento descrito aqui não requer a recompilação do MySQL. Ele usa um subconjunto da especificação Locale Data Markup Language (LDML), que está disponível em <http://www.unicode.org/reports/tr35/>. Com este método, você não precisa definir a Collation inteira. Em vez disso, você começa com uma Collation “base” existente e descreve a nova Collation em termos de como ela difere da Collation base. A tabela a seguir lista as Collations base dos Character Sets Unicode para os quais Collations UCA podem ser definidas. Não é possível criar Collations UCA definidas pelo usuário para `utf16le`; não existe a Collation `utf16le_unicode_ci` que serviria como base para tais Collations.

**Tabela 10.4 Character Sets do MySQL Disponíveis para Collations UCA Definidas Pelo Usuário**

<table summary="Character Sets Unicode para os quais Collations UCA definidas pelo usuário podem ser definidas e suas Collations base."><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Character Set</th> <th>Collation Base</th> </tr></thead><tbody><tr> <td><code>utf8</code></td> <td><code>utf8_unicode_ci</code></td> </tr><tr> <td><code>ucs2</code></td> <td><code>ucs2_unicode_ci</code></td> </tr><tr> <td><code>utf16</code></td> <td><code>utf16_unicode_ci</code></td> </tr><tr> <td><code>utf32</code></td> <td><code>utf32_unicode_ci</code></td> </tr> </tbody></table>

As seções a seguir mostram como adicionar uma Collation que é definida usando a sintaxe LDML e fornecem um resumo das regras LDML suportadas no MySQL.