## 10.13 Adicionando um Conjunto de Caracteres

10.13.1 Matrizes de Definição de Caracteres

10.13.2 Suporte para a Colagem de Cadeias para Conjuntos de Caracteres Complexos

10.13.3 Suporte a Caracteres Multi-Bytes para Conjuntos de Caracteres Complexos

Esta seção discute o procedimento para adicionar um conjunto de caracteres ao MySQL. O procedimento adequado depende se o conjunto de caracteres é simples ou complexo:

- Se o conjunto de caracteres não precisar de rotinas especiais de ordenação de strings e não precisar de suporte para caracteres multibyte, é simples.

- Se o conjunto de caracteres precisar de qualquer uma dessas funcionalidades, isso é complexo.

Por exemplo, `greek` e `swe7` são conjuntos de caracteres simples, enquanto `big5` e `czech` são conjuntos de caracteres complexos.

Para usar as instruções a seguir, você deve ter uma distribuição de fonte MySQL. Nas instruções, *`MYSET`* representa o nome do conjunto de caracteres que você deseja adicionar.

1. Adicione um elemento `<charset>` para *`MYSET`* ao arquivo `sql/share/charsets/Index.xml`. Use o conteúdo existente no arquivo como guia para adicionar novos conteúdos. Uma lista parcial do elemento `<charset>` `latin1` segue:

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

   O elemento `<charset>` deve listar todas as colatações para o conjunto de caracteres. Essas devem incluir pelo menos uma colatação binária e uma colatação padrão (primaria). A colatação padrão é frequentemente nomeada usando um sufixo de `general_ci` (geral, não sensível a maiúsculas e minúsculas). É possível que a colatação binária seja a colatação padrão, mas geralmente elas são diferentes. A colatação padrão deve ter uma bandeira `primary`. A colatação binária deve ter uma bandeira `binary`.

   Você deve atribuir um número de ID único a cada colagem. A faixa de IDs de 1024 a 2047 é reservada para colagens definidas pelo usuário. Para encontrar o máximo dos IDs de colagem atualmente usados, use esta consulta:

   ```sql
   SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
   ```

2. Essa etapa depende de você estar adicionando um conjunto de caracteres simples ou complexo. Um conjunto de caracteres simples requer apenas um arquivo de configuração, enquanto um conjunto de caracteres complexo requer um arquivo de código C que defina funções de ordenação, funções multibyte ou ambas.

   Para um conjunto de caracteres simples, crie um arquivo de configuração, `MYSET.xml`, que descreva as propriedades do conjunto de caracteres. Crie esse arquivo no diretório `sql/share/charsets`. Você pode usar uma cópia de `latin1.xml` como base para esse arquivo. A sintaxe do arquivo é muito simples:

   - Os comentários são escritos como comentários XML comuns (`<!-- texto -->`).

   - As palavras dentro dos elementos do array `<map>` são separadas por quantidades arbitrárias de espaços em branco.

   - Cada palavra dentro dos elementos do array `<map>` deve ser um número no formato hexadecimal.

   - O elemento de matriz `<map>` para o elemento `<ctype>` tem 257 palavras. Os outros elementos de matriz `<map>` têm 256 palavras. Veja a Seção 10.13.1, “Matrizes de Definição de Caracteres”.

   - Para cada ordenação listada no elemento `<charset>` para o conjunto de caracteres no `Index.xml`, o arquivo `MYSET.xml` deve conter um elemento `<collation>` que defina a ordem de ordenação dos caracteres.

   Para um conjunto de caracteres complexo, crie um arquivo de código C que descreva as propriedades do conjunto de caracteres e defina as rotinas de suporte necessárias para realizar operações adequadas no conjunto de caracteres:

   - Crie o arquivo `ctype-MYSET.c` no diretório `strings`. Veja um dos arquivos `ctype-*.c` existentes (como `ctype-big5.c`) para ver o que precisa ser definido. Os arrays do seu arquivo devem ter nomes como `ctype_MYSET`, `to_lower_MYSET`, e assim por diante. Estes correspondem aos arrays para um conjunto de caracteres simples. Veja a Seção 10.13.1, “Arrays de Definição de Caracteres”.

   - Para cada elemento `<collation>` listado no elemento `<charset>` para o conjunto de caracteres em `Index.xml`, o arquivo `ctype-MYSET.c` deve fornecer uma implementação da colagem.

   - Se o conjunto de caracteres exigir funções de ordenação de cadeias, consulte a Seção 10.13.2, “Suporte de ordenação de cadeias para conjuntos de caracteres complexos”.

   - Se o conjunto de caracteres exigir suporte a caracteres multibyte, consulte a Seção 10.13.3, “Suporte a Caracteres Multibyte para Conjuntos de Caracteres Complexos”.

3. Modifique as informações de configuração. Use as informações de configuração existentes como guia para adicionar informações para *`MYSYS`*. O exemplo aqui assume que o conjunto de caracteres tem colunas padrão e binárias, mas são necessárias mais linhas se o *`MYSET`* tiver colunas adicionais.

   1. Editar `mysys/charset-def.c` e “registrar” as codificações para o novo conjunto de caracteres.

      Adicione essas linhas à seção “declaração”:

      ```sql
      #ifdef HAVE_CHARSET_MYSET
      extern CHARSET_INFO my_charset_MYSET_general_ci;
      extern CHARSET_INFO my_charset_MYSET_bin;
      #endif
      ```

      Adicione essas linhas à seção “registro”:

      ```sql
      #ifdef HAVE_CHARSET_MYSET
        add_compiled_collation(&my_charset_MYSET_general_ci);
        add_compiled_collation(&my_charset_MYSET_bin);
      #endif
      ```

   2. Se o conjunto de caracteres usa `ctype-MYSET.c`, edite `strings/CMakeLists.txt` e adicione `ctype-MYSET.c` à definição da variável `STRINGS_SOURCES`.

   3. Editar `cmake/character_sets.cmake`:

      1. Adicione *`MYSET`* ao valor de `CHARSETS_AVAILABLE` em ordem alfabética.

      2. Adicione *`MYSET`* ao valor de `CHARSETS_COMPLEX` em ordem alfabética. Isso é necessário mesmo para conjuntos de caracteres simples, ou **CMake** não reconhece `-DDEFAULT_CHARSET=MYSET`.

4. Reconfigurar, recompilar e testar.
