### 12.14.4 Adicionando uma Cotação UCA a um Conjunto de Caracteres Unicode

12.14.4.1 Definindo uma Cotação UCA Usando a Sintaxe LDML

12.14.4.2 Sintaxe LDML Suportada no MySQL

12.14.4.3 Diagnósticos Durante a Análise do Index.xml

Esta seção descreve como adicionar uma cotação UCA para um conjunto de caracteres Unicode escrevendo o elemento `<collation>` dentro de uma descrição de conjunto de caracteres `<charset>` no arquivo `Index.xml` do MySQL. O procedimento descrito aqui não requer a recompilação do MySQL. Ele usa um subconjunto da especificação Locale Data Markup Language (LDML), disponível em <http://www.unicode.org/reports/tr35/>. Com este método, você não precisa definir toda a cotação. Em vez disso, você começa com uma cotação “base” existente e descreve a nova cotação em termos de como ela difere da cotação base. A tabela a seguir lista as cotas base dos conjuntos de caracteres Unicode para os quais cotas UCA podem ser definidas. Não é possível criar cotas UCA definidas pelo usuário para `utf16le`; não existe uma cotação `utf16le_unicode_ci` que sirva como base para tais cotas.

**Tabela 12.4 Conjuntos de Caracteres MySQL Disponíveis para Cotas UCA Definidas pelo Usuário**

<table summary="Conjunto de caracteres Unicode para os quais podem ser definidas colorações UCA definidas pelo usuário e suas colorações base."><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Conjunto de caracteres</th> <th>Colagem base</th> </tr></thead><tbody><tr> <td><code>utf8mb4</code></td> <td><code>utf8mb4_unicode_ci</code></td> </tr><tr> <td><code>ucs2</code></td> <td><code>ucs2_unicode_ci</code></td> </tr><tr> <td><code>utf16</code></td> <td><code>utf16_unicode_ci</code></td> </tr><tr> <td><code>utf32</code></td> <td><code>utf32_unicode_ci</code></td> </tr></tbody></table>

As seções a seguir mostram como adicionar uma colagem definida usando a sintaxe LDML e fornecem um resumo das regras LDML suportadas no MySQL.