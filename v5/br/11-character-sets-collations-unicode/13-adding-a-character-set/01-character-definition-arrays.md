### 10.13.1 Matrizes de Definição de Caracteres

Cada conjunto de caracteres simples tem um arquivo de configuração localizado no diretório `sql/share/charsets`. Para um conjunto de caracteres chamado *`MYSYS`*, o arquivo é chamado `MYSET.xml`. Ele usa elementos de matriz `<map>` para listar as propriedades do conjunto de caracteres. Os elementos `<map>` aparecem dentro desses elementos:

- `<ctype>` define atributos para cada caractere.

- `<lower>` e `<upper>` listam os caracteres minúsculos e maiúsculos.

- `<unicode>` mapeia valores de caracteres de 8 bits para valores Unicode.

- Os elementos `<collation>` indicam a ordem de caracteres para comparação e ordenação, um elemento por collation. As collation binárias não precisam do elemento `<map>` porque os próprios códigos de caracteres fornecem a ordem.

Para um conjunto de caracteres complexo, conforme implementado em um arquivo `ctype-MYSET.c` no diretório `strings`, existem arrays correspondentes: `ctype_MYSET[]`, `to_lower_MYSET[]`, e assim por diante. Nem todos os conjuntos de caracteres complexos têm todos os arrays. Veja também os arquivos `ctype-*.c` existentes para exemplos. Veja o arquivo `CHARSET_INFO.txt` no diretório `strings` para informações adicionais.

A maioria dos arrays é indexada pelo valor do caractere e tem 256 elementos. O array `<ctype>` é indexado pelo valor do caractere + 1 e tem 257 elementos. Essa é uma convenção herdada para lidar com o `EOF`.

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

O valor `<ctype>` para um caractere específico deve ser a união dos valores de máscara de bits aplicáveis que descrevem o caractere. Por exemplo, `'A'` é um caractere maiúsculo (_MY_U) e também um dígito hexadecimal (_MY_X), então seu valor `ctype` deve ser definido da seguinte forma:

```sql
ctype['A'+1] = _MY_U | _MY_X = 01 | 0200 = 0201
```

Os valores de bitmask em `m_ctype.h` são valores octal, mas os elementos do array `<ctype>` em `MYSET.xml` devem ser escritos como valores hexadecimais.

Os arrays `<lower>` e `<upper>` contêm os caracteres minúsculos e maiúsculos correspondentes a cada membro do conjunto de caracteres. Por exemplo:

```sql
lower['A'] should contain 'a'
upper['a'] should contain 'A'
```

Cada matriz `<collation>` indica como os caracteres devem ser ordenados para fins de comparação e ordenação. O MySQL ordena os caracteres com base nos valores dessa informação. Em alguns casos, isso é o mesmo que a matriz `<upper>`, o que significa que a ordenação é case-insensitive. Para regras de ordenação mais complicadas (para conjuntos de caracteres complexos), consulte a discussão sobre a ordenação de strings na Seção 10.13.2, “Suporte à Ordenação de Strings para Conjuntos de Caracteres Complexos”.
