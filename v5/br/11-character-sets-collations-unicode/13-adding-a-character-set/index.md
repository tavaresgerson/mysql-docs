## 10.13 Adicionando um Character Set

10.13.1 Character Definition Arrays

10.13.2 Suporte a String Collating para Character Sets Complexos

10.13.3 Suporte a Caracteres Multi-Byte para Character Sets Complexos

Esta seção discute o procedimento para adicionar um *Character Set* ao MySQL. O procedimento adequado depende se o *Character Set* é simples ou complexo:

* Se o *Character Set* não necessitar de rotinas especiais de *string collating* para ordenação e não necessitar de suporte a caracteres *multibyte*, ele é simples.

* Se o *Character Set* necessitar de qualquer uma dessas funcionalidades, ele é complexo.

Por exemplo, `greek` e `swe7` são *Character Sets* simples, enquanto `big5` e `czech` são *Character Sets* complexos.

Para usar as instruções a seguir, você deve ter uma *source distribution* do MySQL. Nas instruções, *`MYSET`* representa o nome do *Character Set* que você deseja adicionar.

1. Adicione um elemento `<charset>` para *`MYSET`* ao arquivo `sql/share/charsets/Index.xml`. Use o conteúdo existente no arquivo como guia para adicionar novo conteúdo. Segue uma listagem parcial para o elemento `<charset>` de `latin1`:

   ```sql
   <charset name="latin1"><family>Western</family><description>cp1252 West European</description>
     ...
     <collation name="latin1_swedish_ci" id="8" order="Finnish, Swedish"><flag>primary</flag><flag>compiled</flag></collation><collation name="latin1_danish_ci" id="15" order="Danish"/>
     ...
     <collation name="latin1_bin" id="47" order="Binary"><flag>binary</flag><flag>compiled</flag></collation>
     ...
   </charset>
   ```

   O elemento `<charset>` deve listar todas as *Collations* para o *Character Set*. Elas devem incluir pelo menos uma *Binary Collation* e uma *Collation* padrão (*Primary*). A *Collation* padrão é frequentemente nomeada usando o sufixo `general_ci` (geral, insensível a maiúsculas e minúsculas). É possível que a *Binary Collation* seja a *Collation* padrão, mas geralmente elas são diferentes. A *Collation* padrão deve ter um *flag* `primary`. A *Binary Collation* deve ter um *flag* `binary`.

   Você deve atribuir um número de ID exclusivo para cada *Collation*. O intervalo de IDs de 1024 a 2047 é reservado para *Collations* definidas pelo usuário. Para encontrar o máximo dos IDs de *Collation* atualmente utilizados, use esta *Query*:

   ```sql
   SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
   ```

2. Esta etapa depende se você está adicionando um *Character Set* simples ou complexo. Um *Character Set* simples requer apenas um arquivo de configuração, enquanto um *Character Set* complexo requer um arquivo C *source* que define funções de *Collation*, funções *multibyte*, ou ambas.

   Para um *Character Set* simples, crie um arquivo de configuração, `MYSET.xml`, que descreva as propriedades do *Character Set*. Crie este arquivo no diretório `sql/share/charsets`. Você pode usar uma cópia de `latin1.xml` como base para este arquivo. A sintaxe para o arquivo é muito simples:

   * Comentários são escritos como comentários XML comuns (`<!-- text -->`).

   * Palavras dentro de elementos de *array* `<map>` são separadas por quantidades arbitrárias de espaços em branco (*whitespace*).

   * Cada palavra dentro de elementos de *array* `<map>` deve ser um número em formato hexadecimal.

   * O elemento de *array* `<map>` para o elemento `<ctype>` possui 257 palavras. Os outros elementos de *array* `<map>` após esse possuem 256 palavras. Consulte a Seção 10.13.1, “Character Definition Arrays”.

   * Para cada *Collation* listada no elemento `<charset>` para o *Character Set* em `Index.xml`, `MYSET.xml` deve conter um elemento `<collation>` que defina a ordenação dos caracteres.

   Para um *Character Set* complexo, crie um arquivo C *source* que descreva as propriedades do *Character Set* e defina as rotinas de suporte necessárias para executar corretamente as operações no *Character Set*:

   * Crie o arquivo `ctype-MYSET.c` no diretório `strings`. Consulte um dos arquivos `ctype-*.c` existentes (como `ctype-big5.c`) para ver o que precisa ser definido. Os *arrays* em seu arquivo devem ter nomes como `ctype_MYSET`, `to_lower_MYSET`, e assim por diante. Estes correspondem aos *arrays* para um *Character Set* simples. Consulte a Seção 10.13.1, “Character Definition Arrays”.

   * Para cada elemento `<collation>` listado no elemento `<charset>` para o *Character Set* em `Index.xml`, o arquivo `ctype-MYSET.c` deve fornecer uma implementação da *Collation*.

   * Se o *Character Set* exigir funções de *string collating*, consulte a Seção 10.13.2, “String Collating Support for Complex Character Sets”.

   * Se o *Character Set* exigir suporte a caracteres *multibyte*, consulte a Seção 10.13.3, “Multi-Byte Character Support for Complex Character Sets”.

3. Modifique as informações de configuração. Use as informações de configuração existentes como guia para adicionar informações para *`MYSYS`*. O exemplo aqui assume que o *Character Set* possui *Collations* padrão e *binary*, mas mais linhas são necessárias se *`MYSET`* tiver *Collations* adicionais.

   1. Edite `mysys/charset-def.c` e "registre" as *Collations* para o novo *Character Set*.

      Adicione estas linhas à seção de “declaração”:

      ```sql
      #ifdef HAVE_CHARSET_MYSET
      extern CHARSET_INFO my_charset_MYSET_general_ci;
      extern CHARSET_INFO my_charset_MYSET_bin;
      #endif
      ```

      Adicione estas linhas à seção de “registro”:

      ```sql
      #ifdef HAVE_CHARSET_MYSET
        add_compiled_collation(&my_charset_MYSET_general_ci);
        add_compiled_collation(&my_charset_MYSET_bin);
      #endif
      ```

   2. Se o *Character Set* usar `ctype-MYSET.c`, edite `strings/CMakeLists.txt` e adicione `ctype-MYSET.c` à definição da variável `STRINGS_SOURCES`.

   3. Edite `cmake/character_sets.cmake`:

      1. Adicione *`MYSET`* ao valor de `CHARSETS_AVAILABLE` em ordem alfabética.

      2. Adicione *`MYSET`* ao valor de `CHARSETS_COMPLEX` em ordem alfabética. Isso é necessário mesmo para *Character Sets* simples, ou o **CMake** não reconhecerá `-DDEFAULT_CHARSET=MYSET`.

4. Reconfigure, recompile e test.