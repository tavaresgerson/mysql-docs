### 11.1.5 Tipo de Valor de Bit - BIT

O tipo de dados `BIT` é usado para armazenar valores de bits. Um tipo de `BIT(M)` permite o armazenamento de valores de *`M`* bits. *`M`* pode variar de 1 a 64.

Para especificar valores de bits, pode-se usar a notação `b'valor'`. *`valor`* é um valor binário escrito usando zeros e uns. Por exemplo, `b'111'` e `b'10000000'` representam, respectivamente, 7 e 128. Veja a Seção 9.1.5, “Literais de Valor de Bit”.

Se você atribuir um valor a uma coluna `BIT(M)` que tem menos de `M` bits, o valor é preenchido à esquerda com zeros. Por exemplo, atribuir o valor `b'101'` a uma coluna `BIT(6)` é, na verdade, o mesmo que atribuir `b'000101'`.

**NBD Cluster.** O tamanho combinado máximo de todas as colunas `BIT` usadas em uma tabela `NDB` específica não deve exceder 4096 bits.
