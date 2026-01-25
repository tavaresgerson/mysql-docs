### 10.13.1 Arrays de Definição de Caracteres

Cada *character set* simples possui um arquivo de configuração localizado no diretório `sql/share/charsets`. Para um *character set* chamado *`MYSYS`*, o arquivo é nomeado `MYSET.xml`. Ele usa elementos de *array* `<map>` para listar as propriedades do *character set*. Os elementos `<map>` aparecem dentro destes elementos:

* `<ctype>` define atributos para cada caractere.

* `<lower>` e `<upper>` listam os caracteres minúsculos e maiúsculos.

* `<unicode>` mapeia valores de caracteres de 8 bits para valores Unicode.

* Elementos `<collation>` indicam a ordenação de caracteres para comparação e classificação (*sorting*), um elemento por *collation*. *Collations* binárias não necessitam de um elemento `<map>` porque os próprios códigos de caracteres fornecem a ordenação.

Para um *character set* complexo, conforme implementado em um arquivo `ctype-MYSET.c` no diretório `strings`, existem *arrays* correspondentes: `ctype_MYSET[]`, `to_lower_MYSET[]` e assim por diante. Nem todo *character set* complexo possui todos esses *arrays*. Consulte também os arquivos `ctype-*.c` existentes para exemplos. Veja o arquivo `CHARSET_INFO.txt` no diretório `strings` para informações adicionais.

A maioria dos *arrays* é indexada pelo valor do caractere e possui 256 elementos. O *array* `<ctype>` é indexado pelo valor do caractere + 1 e possui 257 elementos. Esta é uma convenção herdada para lidar com `EOF`.

Os elementos do *array* `<ctype>` são valores de *bit*. Cada elemento descreve os atributos de um único caractere no *character set*. Cada atributo está associado a uma *bitmask*, conforme definido em `include/m_ctype.h`:

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

O valor `<ctype>` para um determinado caractere deve ser a união dos valores de *bitmask* aplicáveis que descrevem o caractere. Por exemplo, `'A'` é um caractere maiúsculo (`_MY_U`), bem como um dígito hexadecimal (`_MY_X`), portanto, seu valor `ctype` deve ser definido da seguinte forma:

```sql
ctype['A'+1] = _MY_U | _MY_X = 01 | 0200 = 0201
```

Os valores de *bitmask* em `m_ctype.h` são valores octais, mas os elementos do *array* `<ctype>` em `MYSET.xml` devem ser escritos como valores hexadecimais.

Os *arrays* `<lower>` e `<upper>` contêm os caracteres minúsculos e maiúsculos correspondentes a cada membro do *character set*. Por exemplo:

```sql
lower['A'] should contain 'a'
upper['a'] should contain 'A'
```

Cada *array* `<collation>` indica como os caracteres devem ser ordenados para fins de comparação e *sorting*. O MySQL classifica os caracteres com base nos valores desta informação. Em alguns casos, isso é o mesmo que o *array* `<upper>`, o que significa que o *sorting* é *case-insensitive*. Para regras de *sorting* mais complicadas (para *character sets* complexos), consulte a discussão sobre *string collating* na Seção 10.13.2, “Suporte a String Collating para Character Sets Complexos”.