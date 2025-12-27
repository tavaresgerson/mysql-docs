### 12.13.1 Arrays de Definição de Caracteres

Cada conjunto de caracteres simples tem um arquivo de configuração localizado no diretório `sql/share/charsets`. Para um conjunto de caracteres chamado *`MYSYS`*, o arquivo é chamado `MYSET.xml`. Ele usa elementos de arrays `<map>` para listar as propriedades do conjunto de caracteres. Os elementos `<map>` aparecem dentro desses elementos:

* `<ctype>` define atributos para cada caractere.

* `<lower>` e `<upper>` listam os caracteres minúsculas e maiúsculas.

* `<unicode>` mapeia valores de caracteres de 8 bits para valores Unicode.

* Os elementos `<collation>` indicam a ordem de caracteres para comparação e ordenação, um elemento por ordenação. As ordenações binárias não precisam de elemento `<map>` porque os códigos de caracteres próprios fornecem a ordenação.

Para um conjunto de caracteres complexo como implementado em um arquivo `ctype-MYSET.c` no diretório `strings`, existem arrays correspondentes: `ctype_MYSET[]`, `to_lower_MYSET[]`, e assim por diante. Nem todo conjunto de caracteres complexo tem todos os arrays. Veja também os arquivos `ctype-*`.c existentes para exemplos. Veja o arquivo `CHARSET_INFO.txt` no diretório `strings` para informações adicionais.

A maioria dos arrays é indexada pelo valor do caractere e tem 256 elementos. O array `<ctype>` é indexado pelo valor do caractere + 1 e tem 257 elementos. Esta é uma convenção legada para lidar com `EOF`.

Os elementos do array `<ctype>` são valores de bits. Cada elemento descreve os atributos de um único caractere no conjunto de caracteres. Cada atributo é associado a uma máscara de bits, conforme definido em `include/m_ctype.h`:

```
#define _MY_U   01      /* Upper case */
#define _MY_L   02      /* Lower case */
#define _MY_NMR 04      /* Numeral (digit) */
#define _MY_SPC 010     /* Spacing character */
#define _MY_PNT 020     /* Punctuation */
#define _MY_CTR 040     /* Control character */
#define _MY_B   0100    /* Blank */
#define _MY_X   0200    /* heXadecimal digit */
```

O valor `<ctype>` para um caractere dado deve ser a união dos valores de máscara de bits aplicáveis que descrevem o caractere. Por exemplo, `'A'` é um caractere maiúsculo (`_MY_U`) bem como um dígito hexadecimal (`_MY_X`), então seu valor `ctype` deve ser definido assim:

Os valores da máscara de bits em `m_ctype.h` são valores octais, mas os elementos do array `<ctype>` em `MYSET.xml` devem ser escritos como valores hexadecimais.

Os arrays `<lower>` e `<upper>` contêm os caracteres minúsculas e maiúsculas correspondentes a cada membro do conjunto de caracteres. Por exemplo:

```
ctype['A'+1] = _MY_U | _MY_X = 01 | 0200 = 0201
```

Cada array `<collation>` indica como os caracteres devem ser ordenados para fins de comparação e ordenação. O MySQL ordena os caracteres com base nos valores dessas informações. Em alguns casos, isso é o mesmo que o array `<upper>`, o que significa que a ordenação é insensível ao caso. Para regras de ordenação mais complicadas (para conjuntos de caracteres complexos), consulte a discussão sobre a ordenação de strings na Seção 12.13.2, “Suporte de ordenação de strings para conjuntos de caracteres complexos”.