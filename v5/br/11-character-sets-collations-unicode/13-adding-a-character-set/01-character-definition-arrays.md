### 10.13.1 Arrays de Definição de Caracteres

Cada conjunto de caracteres simples possui um arquivo de configuração localizado no diretório `sql/share/charsets`. Para um conjunto de caracteres chamado *`MYSYS`*, o arquivo é nomeado `MYSET.xml`. Ele usa elementos de array `<map>` para listar as propriedades do conjunto de caracteres. Os elementos `<map>` aparecem dentro destes elementos:

* `<ctype>` define os atributos para cada caractere.

* `<lower>` e `<upper>` listam os caracteres minúsculos e maiúsculos.

* `<unicode>` mapeia valores de caracteres de 8 bits para valores Unicode.

* Os elementos `<collation>` indicam a ordenação de caracteres para comparação e sorting (classificação), um elemento por Collation. Collations binárias não precisam de um elemento `<map>` porque os próprios códigos de caracteres fornecem a ordenação.

Para um conjunto de caracteres complexo, conforme implementado em um arquivo `ctype-MYSET.c` no diretório `strings`, existem os Arrays correspondentes: `ctype_MYSET[]`, `to_lower_MYSET[]`, e assim por diante. Nem todo conjunto de caracteres complexo possui todos os Arrays. Veja também os arquivos `ctype-*.c` existentes para exemplos. Consulte o arquivo `CHARSET_INFO.txt` no diretório `strings` para informações adicionais.

A maioria dos Arrays é indexada pelo valor do caractere e possui 256 elementos. O Array `<ctype>` é indexado pelo valor do caractere + 1 e possui 257 elementos. Esta é uma convenção legada para o tratamento de `EOF`.

Os elementos do Array `<ctype>` são valores de bit. Cada elemento descreve os atributos de um único caractere no conjunto de caracteres. Cada atributo está associado a um Bitmask, conforme definido em `include/m_ctype.h`:

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

O valor `<ctype>` para um determinado caractere deve ser a união dos valores de Bitmask aplicáveis que descrevem o caractere. Por exemplo, `'A'` é um caractere maiúsculo (`_MY_U`), bem como um dígito hexadecimal (`_MY_X`), portanto, seu valor `ctype` deve ser definido assim:

```sql
ctype['A'+1] = _MY_U | _MY_X = 01 | 0200 = 0201
```

Os valores de Bitmask em `m_ctype.h` são valores octais, mas os elementos do Array `<ctype>` em `MYSET.xml` devem ser escritos como valores hexadecimais.

Os Arrays `<lower>` e `<upper>` contêm os caracteres minúsculos e maiúsculos correspondentes a cada membro do conjunto de caracteres. Por exemplo:

```sql
lower['A'] should contain 'a'
upper['a'] should contain 'A'
```

Cada Array `<collation>` indica como os caracteres devem ser ordenados para fins de comparação e sorting (classificação). O MySQL classifica os caracteres com base nos valores desta informação. Em alguns casos, isso é o mesmo que o Array `<upper>`, o que significa que o sorting é *case-insensitive* (não diferencia maiúsculas de minúsculas). Para regras de sorting mais complicadas (para conjuntos de caracteres complexos), consulte a discussão sobre String Collating na Seção 10.13.2, “Suporte a String Collating para Conjuntos de Caracteres Complexos”.