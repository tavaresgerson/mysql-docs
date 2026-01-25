### 11.1.5 Tipo de Valor de Bit - BIT

O tipo de dado `BIT` é usado para armazenar valores de bit. Um tipo `BIT(M)` permite o armazenamento de valores de *`M`* bits. *`M`* pode variar de 1 a 64.

Para especificar valores de bit, a notação `b'valor'` pode ser usada. *`valor`* é um valor binário escrito usando zeros e uns. Por exemplo, `b'111'` e `b'10000000'` representam 7 e 128, respectivamente. Consulte a Seção 9.1.5, “Bit-Value Literals”.

Se você atribuir um valor a uma coluna `BIT(M)` que tenha menos de *`M`* bits de comprimento, o valor será preenchido à esquerda com zeros. Por exemplo, atribuir um valor de `b'101'` a uma coluna `BIT(6)` é, na verdade, o mesmo que atribuir `b'000101'`.

**NDB Cluster.** O tamanho combinado máximo de todas as colunas `BIT` usadas em uma determinada tabela `NDB` não deve exceder 4096 bits.
