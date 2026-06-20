## 10.13 Adicionando um Conjunto de Caracteres

Esta seção discute o procedimento para adicionar um conjunto de caracteres ao MySQL. O procedimento adequado depende se o conjunto de caracteres é simples ou complexo:

* Se o conjunto de caracteres não precisar de rotinas especiais de ordenação de cadeias de caracteres e não precise de suporte a caracteres multibyte, é simples.

* Se o conjunto de caracteres precisar de qualquer uma dessas características, é complexo.

Por exemplo, `greek` e `swe7` são conjuntos de caracteres simples, enquanto `big5` e `czech` são conjuntos de caracteres complexos.

Para usar as instruções a seguir, você deve ter uma distribuição de fonte MySQL. Nas instruções, *`MYSET`* representa o nome do conjunto de caracteres que você deseja adicionar.

1. Adicione um elemento `<charset>` para *`MYSET`* ao arquivo `sql/share/charsets/Index.xml`. Use o conteúdo existente no arquivo como guia para adicionar novos conteúdos. Uma lista parcial para o elemento `latin1` `<charset>` segue:

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

O elemento `<charset>` deve listar todas as colatações para o conjunto de caracteres. Essas devem incluir pelo menos uma colatação binária e uma colatação padrão (primária). A colatação padrão é frequentemente nomeada usando um sufixo de `general_ci` (geral, não sensível ao caso). É possível que a colatação binária seja a colatação padrão, mas geralmente elas são diferentes. A colatação padrão deve ter uma `primary` flag. A colatação binária deve ter uma `binary` flag.

Você deve atribuir um número de ID único a cada correção. A faixa de IDs de 1024 a 2047 é reservada para correções definidas pelo usuário. Para encontrar o máximo dos IDs de correção atualmente usados, use esta consulta:

   ```sql
   SELECT MAX(ID) FROM INFORMATION_SCHEMA.COLLATIONS;
   ```

2. Esse passo depende de você estar adicionando um conjunto de caracteres simples ou complexo. Um conjunto de caracteres simples requer apenas um arquivo de configuração, enquanto um conjunto de caracteres complexo requer um arquivo de fonte C que defina funções de cotação, funções multiletradas ou ambas.

Para um conjunto de caracteres simples, crie um arquivo de configuração, `MYSET.xml`, que descreva as propriedades do conjunto de caracteres. Crie este arquivo no diretório `sql/share/charsets`. Você pode usar uma cópia de `latin1.xml` como base para este arquivo. A sintaxe do arquivo é muito simples:

* Os comentários são escritos como comentários comuns em XML (`<!-- text -->`).

* As palavras dentro dos elementos da matriz `<map>` são separadas por quantidades arbitrárias de espaços em branco.

* Cada palavra dentro dos elementos da matriz `<map>` deve ser um número no formato hexadecimal.

* O elemento do array `<map>` para o elemento `<ctype>` tem 257 palavras. Os outros elementos do array `<map>` depois disso têm 256 palavras. Veja a Seção 10.13.1, “Arrays de Definição de Caracteres”.

* Para cada combinação listada no elemento `<charset>` para o conjunto de caracteres em `Index.xml`, o `MYSET.xml` deve conter um elemento `<collation>` que defina a ordem de ordenação dos caracteres.

Para um conjunto de caracteres complexo, crie um arquivo de fonte C que descreva as propriedades do conjunto de caracteres e defina as rotinas de suporte necessárias para realizar operações adequadas no conjunto de caracteres:

* Crie o arquivo `ctype-MYSET.c` no diretório `strings`. Veja um dos arquivos existentes `ctype-*.c` (como `ctype-big5.c`) para ver o que precisa ser definido. Os arrays em seu arquivo devem ter nomes como `ctype_MYSET`, `to_lower_MYSET`, e assim por diante. Esses correspondem aos arrays para um conjunto de caracteres simples. Veja a Seção 10.13.1, “Arrays de Definição de Caracteres”.

* Para cada elemento `<collation>` listado no elemento `<charset>` para o conjunto de caracteres em `Index.xml`, o arquivo `ctype-MYSET.c` deve fornecer uma implementação da correção de caracteres.

* Se o conjunto de caracteres exigir funções de ordenação de cadeias, consulte a Seção 10.13.2, “Suporte de ordenação de cadeias para conjuntos de caracteres complexos”.

* Se o conjunto de caracteres exigir suporte a caracteres multibyte, consulte a Seção 10.13.3, “Suporte a caracteres multibyte para conjuntos de caracteres complexos”.

3. Modifique as informações de configuração. Use as informações de configuração existentes como guia para adicionar informações para *`MYSYS`*. O exemplo aqui assume que o conjunto de caracteres tem colunas padrão e binárias, mas são necessárias mais strings se *`MYSET`* tiver colunas adicionais.

1. Editar `mysys/charset-def.c` e “registrar” as colatões para o novo conjunto de caracteres.

Adicione essas strings à seção “declaração”:

      ```sql
      #ifdef HAVE_CHARSET_MYSET
      extern CHARSET_INFO my_charset_MYSET_general_ci;
      extern CHARSET_INFO my_charset_MYSET_bin;
      #endif
      ```

Adicione essas strings à seção “registro”:

      ```sql
      #ifdef HAVE_CHARSET_MYSET
        add_compiled_collation(&my_charset_MYSET_general_ci);
        add_compiled_collation(&my_charset_MYSET_bin);
      #endif
      ```

2. Se o conjunto de caracteres utiliza `ctype-MYSET.c`, edite `strings/CMakeLists.txt` e adicione `ctype-MYSET.c` à definição da variável `STRINGS_SOURCES`.

3. Editar `cmake/character_sets.cmake`:

1. Adicione *`MYSET`* ao valor de com `CHARSETS_AVAILABLE` em ordem alfabética.

2. Adicione *`MYSET`* ao valor de `CHARSETS_COMPLEX` em ordem alfabética. Isso é necessário mesmo para conjuntos de caracteres simples, ou **CMake** não reconhece `-DDEFAULT_CHARSET=MYSET`.

4. Reconfigurar, recompilar e testar.

### 10.13.1 Arrays de definição de caracteres

Cada conjunto de caracteres simples tem um arquivo de configuração localizado no diretório `sql/share/charsets`. Para um conjunto de caracteres chamado *`MYSYS`*, o arquivo é chamado `MYSET.xml`. Ele usa elementos da matriz `<map>` para listar as propriedades do conjunto de caracteres. Os elementos `<map>` aparecem dentro desses elementos:

* `<ctype>` define atributos para cada personagem.

* `<lower>` e `<upper>` listam os caracteres minúsculos e maiúsculos.

* `<unicode>` mapeia valores de caracteres de 8 bits para valores Unicode.

* Os elementos `<collation>` indicam a ordem de caracteres para comparação e ordenação, um elemento por cotação. As cotações binárias não necessitam do elemento `<map>`, porque os próprios códigos de caracteres fornecem a ordem.

Para um conjunto de caracteres complexo implementado em um arquivo `ctype-MYSET.c` no diretório `strings`, existem matrizes correspondentes: `ctype_MYSET[]`, `to_lower_MYSET[]`, e assim por diante. Nem todo conjunto de caracteres complexo tem todas as matrizes. Veja também os arquivos existentes `ctype-*.c` para exemplos. Veja o arquivo `CHARSET_INFO.txt` no diretório `strings` para informações adicionais.

A maioria dos arrays é indexada pelo valor de caractere e tem 256 elementos. O array `<ctype>` é indexado pelo valor de caractere + 1 e tem 257 elementos. Esta é uma convenção legítima para lidar com `EOF`.

Os elementos do array `<ctype>` são valores de bits. Cada elemento descreve os atributos de um único caractere no conjunto de caracteres. Cada atributo está associado a uma máscara de bits, conforme definido em `include/m_ctype.h`:

```sql
#define _MY_U   01      /* Upper case */
#define _MY_L   02      /* Lower case */
#define _MY_NMR 04      /* Numeral (digit) */
#define _MY_SPC 010     /* Spacing character */
#define _MY_PNT 020     /* Punctuation */
#define _MY_CTR 040     /* Control character */
#define _MY_B   0100    /* Blank */
#define _MY_X   0200    /* heXadecimal digit */
```

O valor `<ctype>` para um caractere dado deve ser a união dos valores de máscara de bits aplicáveis que descrevem o caractere. Por exemplo, `'A'` é um caractere maiúsculo (`_MY_U`) e também um dígito hexadecimal (`_MY_X`), então seu valor `ctype` deve ser definido assim:

```sql
ctype['A'+1] = _MY_U | _MY_X = 01 | 0200 = 0201
```

Os valores de bitmask em `m_ctype.h` são valores octal, mas os elementos da matriz `<ctype>` em `MYSET.xml` devem ser escritos como valores hexadecimais.

Os arrays `<lower>` e `<upper>` contêm os caracteres minúsculos e maiúsculos correspondentes a cada membro do conjunto de caracteres. Por exemplo:

```sql
lower['A'] should contain 'a'
upper['a'] should contain 'A'
```

Cada matriz `<collation>` indica como os caracteres devem ser ordenados para fins de comparação e ordenação. O MySQL ordena os caracteres com base nos valores dessa informação. Em alguns casos, isso é o mesmo que a matriz `<upper>`, o que significa que a ordenação é insensível ao caso. Para regras de ordenação mais complicadas (para conjuntos de caracteres complexos), consulte a discussão sobre a ordenação de strings na Seção 10.13.2, “Suporte de ordenação de strings para conjuntos de caracteres complexos”.

### 10.13.2 Suporte para a Colaboração de Cadeias para Conjuntos de Caracteres Complexos

Para um conjunto de caracteres simples denominado *`MYSET`*, as regras de classificação são especificadas no arquivo de configuração `MYSET.xml` usando elementos da matriz `<map>` dentro dos elementos `<collation>`. Se as regras de classificação para o seu idioma forem muito complexas para serem manipuladas com arrays simples, você deve definir funções de comparação de strings no arquivo fonte `ctype-MYSET.c` no diretório `strings`.

Os conjuntos de caracteres existentes fornecem a melhor documentação e exemplos para mostrar como essas funções são implementadas. Veja os arquivos `ctype-*.c` no diretório `strings`, como os arquivos para os conjuntos de caracteres `big5`, `czech`, `gbk`, `sjis` e `tis160`. Dê uma olhada nas estruturas `MY_COLLATION_HANDLER` para ver como elas são usadas. Veja também o arquivo `CHARSET_INFO.txt` no diretório `strings` para informações adicionais.

### 10.13.3 Suporte a Caracteres Multi-Bytes para Conjuntos de Caracteres Complexos

Se você deseja adicionar suporte para um novo conjunto de caracteres chamado *`MYSET`* que inclui caracteres multibyte, você deve usar funções de caracteres multibyte no arquivo de fonte `ctype-MYSET.c` no diretório `strings`.

Os conjuntos de caracteres existentes fornecem a melhor documentação e exemplos para mostrar como essas funções são implementadas. Veja os arquivos `ctype-*.c` no diretório `strings`, como os arquivos para os conjuntos de caracteres `euc_kr`, `gb2312`, `gbk`, `sjis` e `ujis`. Dê uma olhada nas estruturas `MY_CHARSET_HANDLER` para ver como elas são usadas. Veja também o arquivo `CHARSET_INFO.txt` no diretório `strings` para informações adicionais.