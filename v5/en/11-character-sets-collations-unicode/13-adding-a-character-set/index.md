## 10.13 Adicionando um Conjunto de Caracteres

10.13.1 Arrays de Definição de Caracteres

10.13.2 Suporte à Ordenação de Strings para Conjuntos de Caracteres Complexos

10.13.3 Suporte a Caracteres Multi-Byte para Conjuntos de Caracteres Complexos

Esta seção discute o procedimento para adicionar um conjunto de caracteres ao MySQL. O procedimento adequado depende se o conjunto de caracteres é simples ou complexo:

* Se o conjunto de caracteres não precisar de rotinas especiais de ordenação de strings para classificação (sorting) e não precisar de suporte a caracteres multi-byte, ele é simples.

* Se o conjunto de caracteres precisar de qualquer um desses recursos, ele é complexo.

Por exemplo, `greek` e `swe7` são conjuntos de caracteres simples, enquanto `big5` e `czech` são conjuntos de caracteres complexos.

Para usar as seguintes instruções, você deve ter uma distribuição de código-fonte do MySQL. Nas instruções, *`MYSET`* representa o nome do conjunto de caracteres que você deseja adicionar.

1. Adicione um elemento `<charset>` para *`MYSET`* ao arquivo `sql/share/charsets/Index.xml`. Use o conteúdo existente no arquivo como guia para adicionar novo conteúdo. Uma listagem parcial para o elemento `<charset>` de `latin1` segue:

   ```sql
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

   O elemento `<charset>` deve listar todas as collations para o conjunto de caracteres. Estas devem incluir pelo menos uma collation binária e uma collation padrão (primária). A collation padrão é frequentemente nomeada usando o sufixo `general_ci` (geral, insensível a maiúsculas/minúsculas). É possível que a collation binária seja a collation padrão, mas geralmente elas são diferentes. A collation padrão deve ter um flag `primary`. A collation binária deve ter um flag `binary`.

   Você deve atribuir um número de ID exclusivo a cada collation. O intervalo de IDs de 1024 a 2047 é reservado para collations definidas pelo usuário. Para encontrar o máximo de IDs de collation atualmente usados, utilize esta Query:

   ```sql
   SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
   ```

2. Esta etapa depende se você está adicionando um conjunto de caracteres simples ou complexo. Um conjunto de caracteres simples requer apenas um arquivo de configuração, enquanto um conjunto de caracteres complexo requer um arquivo de código-fonte C que define funções de collation, funções multi-byte, ou ambos.

   Para um conjunto de caracteres simples, crie um arquivo de configuração, `MYSET.xml`, que descreve as propriedades do conjunto de caracteres. Crie este arquivo no diretório `sql/share/charsets`. Você pode usar uma cópia de `latin1.xml` como base para este arquivo. A sintaxe para o arquivo é muito simples:

   * Comentários são escritos como comentários XML comuns (`<!-- text -->`).

   * Palavras dentro dos elementos array `<map>` são separadas por quantidades arbitrárias de espaço em branco (whitespace).

   * Cada palavra dentro dos elementos array `<map>` deve ser um número em formato hexadecimal.

   * O elemento array `<map>` para o elemento `<ctype>` possui 257 palavras. Os outros elementos array `<map>` seguintes possuem 256 palavras. Consulte a Seção 10.13.1, “Arrays de Definição de Caracteres”.

   * Para cada collation listada no elemento `<charset>` para o conjunto de caracteres em `Index.xml`, `MYSET.xml` deve conter um elemento `<collation>` que define a ordenação dos caracteres.

   Para um conjunto de caracteres complexo, crie um arquivo de código-fonte C que descreve as propriedades do conjunto de caracteres e define as rotinas de suporte necessárias para realizar operações corretamente no conjunto de caracteres:

   * Crie o arquivo `ctype-MYSET.c` no diretório `strings`. Observe um dos arquivos `ctype-*.c` existentes (como `ctype-big5.c`) para ver o que precisa ser definido. Os arrays em seu arquivo devem ter nomes como `ctype_MYSET`, `to_lower_MYSET`, e assim por diante. Estes correspondem aos arrays para um conjunto de caracteres simples. Consulte a Seção 10.13.1, “Arrays de Definição de Caracteres”.

   * Para cada elemento `<collation>` listado no elemento `<charset>` para o conjunto de caracteres em `Index.xml`, o arquivo `ctype-MYSET.c` deve fornecer uma implementação da collation.

   * Se o conjunto de caracteres exigir funções de ordenação de strings (string collating functions), consulte a Seção 10.13.2, “Suporte à Ordenação de Strings para Conjuntos de Caracteres Complexos”.

   * Se o conjunto de caracteres exigir suporte a caracteres multi-byte, consulte a Seção 10.13.3, “Suporte a Caracteres Multi-Byte para Conjuntos de Caracteres Complexos”.

3. Modifique as informações de configuração. Use as informações de configuração existentes como guia para adicionar informações para *`MYSYS`*. O exemplo aqui assume que o conjunto de caracteres possui collations padrão e binárias, mas mais linhas serão necessárias se *`MYSET`* tiver collations adicionais.

   1. Edite `mysys/charset-def.c`, e “registre” as collations para o novo conjunto de caracteres.

      Adicione estas linhas à seção de “declaration” (declaração):

      ```sql
      #ifdef HAVE_CHARSET_MYSET
      extern CHARSET_INFO my_charset_MYSET_general_ci;
      extern CHARSET_INFO my_charset_MYSET_bin;
      #endif
      ```

      Adicione estas linhas à seção de “registration” (registro):

      ```sql
      #ifdef HAVE_CHARSET_MYSET
        add_compiled_collation(&my_charset_MYSET_general_ci);
        add_compiled_collation(&my_charset_MYSET_bin);
      #endif
      ```

   2. Se o conjunto de caracteres usar `ctype-MYSET.c`, edite `strings/CMakeLists.txt` e adicione `ctype-MYSET.c` à definição da variável `STRINGS_SOURCES`.

   3. Edite `cmake/character_sets.cmake`:

      1. Adicione *`MYSET`* ao valor de `CHARSETS_AVAILABLE` em ordem alfabética.

      2. Adicione *`MYSET`* ao valor de `CHARSETS_COMPLEX` em ordem alfabética. Isto é necessário mesmo para conjuntos de caracteres simples, caso contrário, o **CMake** não reconhecerá `-DDEFAULT_CHARSET=MYSET`.

4. Reconfigure, recompile e teste.
