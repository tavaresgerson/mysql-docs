## 12.13 Adicionando um Conjunto de Caracteres

12.13.1 Arrays de Definição de Caracteres

12.13.2 Suporte de Cotação de Strings para Conjuntos de Caracteres Complexos

12.13.3 Suporte a Caracteres Multi-Bytes para Conjuntos de Caracteres Complexos

Esta seção discute o procedimento para adicionar um conjunto de caracteres ao MySQL. O procedimento adequado depende se o conjunto de caracteres é simples ou complexo:

* Se o conjunto de caracteres não precisar de rotinas especiais de cotação de strings para ordenação e não precisar de suporte a caracteres multi-bytes, ele é simples.

* Se o conjunto de caracteres precisar de uma dessas características, ele é complexo.

Por exemplo, `greek` e `swe7` são conjuntos de caracteres simples, enquanto `big5` e `czech` são conjuntos de caracteres complexos.

Para usar as instruções a seguir, você deve ter uma distribuição de fonte do MySQL. Nas instruções, *`MYSET`* representa o nome do conjunto de caracteres que você deseja adicionar.

1. Adicione um elemento `<charset>` para *`MYSET`* no arquivo `sql/share/charsets/Index.xml`. Use o conteúdo existente no arquivo como guia para adicionar novos conteúdos. Uma lista parcial do elemento `<charset>` `latin1` segue:

   ```
   <charset name="latin1">
     <family>Western</family>
     <description>cp1252 West European</description>
     ...
     <collation name="latin1_swedish_ci" id="8" order="Finnish, Swedish">
       <flag>primary</flag>
       <flag>compiled</flag>
     </collation>
     <collation name="latin1_danish_ci" id="15" order="Danish"/>
     ...
     <collation name="latin1_bin" id="47" order="Binary">
       <flag>binary</flag>
       <flag>compiled</flag>
     </collation>
     ...
   </charset>
   ```

   O elemento `<charset>` deve listar todas as cotações para o conjunto de caracteres. Essas devem incluir pelo menos uma cotação binária e uma cotação padrão (primária). A cotação padrão é frequentemente nomeada usando um sufixo de `general_ci` (geral, não sensível ao caso). É possível que a cotação binária seja a cotação padrão, mas geralmente são diferentes. A cotação padrão deve ter um sinalizador `primary`. A cotação binária deve ter um sinalizador `binary`.

   Você deve atribuir um número de ID único a cada cotação. A faixa de IDs de 1024 a 2047 é reservada para cotas definidas pelo usuário. Para encontrar o máximo dos IDs de cotas atualmente usados, use esta consulta:

   ```
   SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
   ```

2. Esse passo depende de você estar adicionando um conjunto de caracteres simples ou complexo. Um conjunto de caracteres simples requer apenas um arquivo de configuração, enquanto um conjunto de caracteres complexo requer um arquivo de código C que define funções de ordenação, funções multibyte ou ambas.

   Para um conjunto de caracteres simples, crie um arquivo de configuração, `MYSET.xml`, que descreva as propriedades do conjunto de caracteres. Crie esse arquivo no diretório `sql/share/charsets`. Você pode usar uma cópia de `latin1.xml` como base para esse arquivo. A sintaxe do arquivo é muito simples:

   * Comentários são escritos como comentários XML comuns (`<!-- texto -->`).

   * As palavras dentro dos elementos da matriz `<map>` são separadas por quantidades arbitrárias de espaços em branco.

   * Cada palavra dentro dos elementos da matriz `<map>` deve ser um número no formato hexadecimal.

   * O elemento da matriz `<map>` para o elemento `<ctype>` tem 257 palavras. Os outros elementos da matriz `<map>` depois disso têm 256 palavras. Veja a Seção 12.13.1, “Matrizes de Definição de Caracteres”.

   Para um conjunto de caracteres complexo, crie um arquivo de código C que descreva as propriedades do conjunto de caracteres e defina as rotinas de suporte necessárias para realizar operações adequadas no conjunto de caracteres:

   * Crie o arquivo `ctype-MYSET.c` no diretório `strings`. Veja um dos arquivos `ctype-*.c` existentes (como `ctype-big5.c`) para ver o que precisa ser definido. Os arrays em seu arquivo devem ter nomes como `ctype_MYSET`, `to_lower_MYSET`, e assim por diante. Esses correspondem aos arrays para um conjunto de caracteres simples. Veja a Seção 12.13.1, “Matrizes de Definição de Caracteres”.

* Para cada elemento `<collation>` listado no elemento `<charset>` para o conjunto de caracteres em `Index.xml`, o arquivo `ctype-MYSET.c` deve fornecer uma implementação da collation.

* Se o conjunto de caracteres exigir funções de collation de strings, consulte a Seção 12.13.2, “Suporte a Collation de Strings para Conjuntos de Caracteres Complexos”.

* Se o conjunto de caracteres exigir suporte a caracteres multibyte, consulte a Seção 12.13.3, “Suporte a Caracteres Multibyte para Conjuntos de Caracteres Complexos”.

3. Modifique as informações de configuração. Use as informações de configuração existentes como guia para adicionar informações para *`MYSYS`*. O exemplo aqui assume que o conjunto de caracteres tem collation padrão e binária, mas mais linhas são necessárias se *`MYSET`* tiver collations adicionais.

1. Editar `mysys/charset-def.c` e “registrar” as collations para o novo conjunto de caracteres.

Adicione estas linhas à seção “declaração”:

```
      #ifdef HAVE_CHARSET_MYSET
      extern CHARSET_INFO my_charset_MYSET_general_ci;
      extern CHARSET_INFO my_charset_MYSET_bin;
      #endif
      ```

Adicione estas linhas à seção “registro”:

```
      #ifdef HAVE_CHARSET_MYSET
        add_compiled_collation(&my_charset_MYSET_general_ci);
        add_compiled_collation(&my_charset_MYSET_bin);
      #endif
      ```

2. Se o conjunto de caracteres usar `ctype-MYSET.c`, edite `strings/CMakeLists.txt` e adicione `ctype-MYSET.c` à definição da variável `STRINGS_SOURCES`.

3. Editar `cmake/character_sets.cmake`:

1. Adicione *`MYSET`* ao valor de com `CHARSETS_AVAILABLE` em ordem alfabética.

2. Adicione *`MYSET`* ao valor de `CHARSETS_COMPLEX` em ordem alfabética. Isso é necessário mesmo para conjuntos de caracteres simples, para que o **CMake** possa reconhecer `-DDEFAULT_CHARSET=MYSET`.

4. Reconfigurar, recompilar e testar.