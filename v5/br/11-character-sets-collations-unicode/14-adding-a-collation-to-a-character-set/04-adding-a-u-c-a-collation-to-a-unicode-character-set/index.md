### 10.14.4 Adicionando uma Codificação UCA a um Conjunto de Caracteres Unicode

10.14.4.1 Definindo uma Colaboração UCA Usando a Sintaxe LDML

10.14.4.2 Sintaxe LDML suportada no MySQL

10.14.4.3 Diagnósticos durante a análise do Index.xml

Esta seção descreve como adicionar uma colagem UCA para um conjunto de caracteres Unicode escrevendo o elemento `<collation>` dentro de uma descrição de conjunto de caracteres `<charset>` no arquivo `Index.xml` do MySQL. O procedimento descrito aqui não requer a recompilação do MySQL. Ele usa um subconjunto da especificação Locale Data Markup Language (LDML), disponível em <http://www.unicode.org/reports/tr35/>. Com este método, você não precisa definir toda a colagem. Em vez disso, você começa com uma colagem “base” existente e descreve a nova colagem em termos de como ela difere da colagem base. A tabela a seguir lista as coláguas base dos conjuntos de caracteres Unicode para os quais coláguas UCA podem ser definidas. Não é possível criar coláguas UCA definidas pelo usuário para `utf16le`; não existe uma colagem `utf16le_unicode_ci` que sirva como base para tais coláguas.

**Tabela 10.4 Conjuntos de Caracteres MySQL disponíveis para colorações UCA definidas pelo usuário**

<table summary="Conjunto de caracteres Unicode para os quais podem ser definidas colorações UCA definidas pelo usuário e suas colorações base."><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Conjunto de caracteres</th> <th>Base Collation</th> </tr></thead><tbody><tr> <td>[[<code class="literal">utf8</code>]]</td> <td>[[<code class="literal">utf8_unicode_ci</code>]]</td> </tr><tr> <td>[[<code class="literal">ucs2</code>]]</td> <td>[[<code class="literal">ucs2_unicode_ci</code>]]</td> </tr><tr> <td>[[<code class="literal">utf16</code>]]</td> <td>[[<code class="literal">utf16_unicode_ci</code>]]</td> </tr><tr> <td>[[<code class="literal">utf32</code>]]</td> <td>[[<code class="literal">utf32_unicode_ci</code>]]</td> </tr></tbody></table>

As seções a seguir mostram como adicionar uma concordância definida usando a sintaxe LDML e fornecem um resumo das regras LDML suportadas no MySQL.
