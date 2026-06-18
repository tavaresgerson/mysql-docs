### 10.9.5 O Conjunto de Caracteres utf16 (Codificação Unicode UTF-16)

O conjunto de caracteres `utf16` é o conjunto de caracteres `ucs2` com uma extensão que permite a codificação de caracteres suplementares:

* Para um caractere BMP, `utf16` e `ucs2` possuem características de armazenamento idênticas: mesmos valores de code, mesma codificação, mesmo comprimento.

* Para um caractere suplementar, `utf16` possui uma sequência especial para representar o caractere usando 32 bits. Isso é chamado de mecanismo “surrogate”: Para um número maior que `0xffff`, pegue 10 bits e adicione-os a `0xd800` e coloque-os na primeira word de 16 bits, pegue mais 10 bits e adicione-os a `0xdc00` e coloque-os na próxima word de 16 bits. Consequentemente, todos os caracteres suplementares exigem 32 bits, onde os primeiros 16 bits são um número entre `0xd800` e `0xdbff`, e os últimos 16 bits são um número entre `0xdc00` e `0xdfff`. Exemplos estão na Seção 15.5 Surrogates Area do documento Unicode 4.0.

Como `utf16` suporta surrogates e `ucs2` não, há uma verificação de validade que se aplica apenas em `utf16`: Você não pode inserir um top surrogate sem um bottom surrogate, ou vice-versa. Por exemplo:

```sql
INSERT INTO t (ucs2_column) VALUES (0xd800); /* legal */
INSERT INTO t (utf16_column)VALUES (0xd800); /* illegal */
```

Não há verificação de validade para caracteres que são tecnicamente válidos, mas não são true Unicode (ou seja, caracteres que o Unicode considera como “unassigned code points” ou caracteres de “private use” ou até mesmo “ilegais” como `0xffff`). Por exemplo, visto que `U+F8FF` é o Logotipo da Apple, isto é legal:

```sql
INSERT INTO t (utf16_column)VALUES (0xf8ff); /* legal */
```

Não se pode esperar que tais caracteres signifiquem a mesma coisa para todos.

Como o MySQL deve prever o pior cenário (que um caractere exija quatro bytes), o comprimento máximo de uma coluna ou Index `utf16` é apenas metade do comprimento máximo para uma coluna ou Index `ucs2`. Por exemplo, o comprimento máximo de uma chave de Index de tabela `MEMORY` é de 3072 bytes, portanto, estas instruções criam tabelas com os Indexes mais longos permitidos para colunas `ucs2` e `utf16`:

```sql
CREATE TABLE tf (s1 VARCHAR(1536) CHARACTER SET ucs2) ENGINE=MEMORY;
CREATE INDEX i ON tf (s1);
CREATE TABLE tg (s1 VARCHAR(768) CHARACTER SET utf16) ENGINE=MEMORY;
CREATE INDEX i ON tg (s1);
```