### 10.9.5 O Conjunto de Caracteres utf16 (Codificação Unicode UTF-16)

O conjunto de caracteres `utf16` é o conjunto de caracteres `ucs2` com uma extensão que permite a codificação de caracteres suplementares:

* Para um caractere BMP (Basic Multilingual Plane), `utf16` e `ucs2` têm características de armazenamento idênticas: mesmos valores de código, mesma codificação (*encoding*), mesmo comprimento (*length*).

* Para um caractere suplementar, `utf16` possui uma sequência especial para representar o caractere usando 32 bits. Isso é chamado de mecanismo “surrogate” (substituto): Para um número maior que `0xffff`, pegue 10 bits, adicione-os a `0xd800` e coloque-os na primeira palavra de 16 bits; pegue mais 10 bits, adicione-os a `0xdc00` e coloque-os na próxima palavra de 16 bits. Consequentemente, todos os caracteres suplementares exigem 32 bits, onde os primeiros 16 bits são um número entre `0xd800` e `0xdbff`, e os últimos 16 bits são um número entre `0xdc00` e `0xdfff`. Exemplos podem ser encontrados na Seção 15.5 Surrogates Area do documento Unicode 4.0.

Como `utf16` suporta *surrogates* e `ucs2` não, há uma verificação de validade que se aplica somente em `utf16`: Você não pode inserir um *top surrogate* sem um *bottom surrogate*, ou vice-versa. Por exemplo:

```sql
INSERT INTO t (ucs2_column) VALUES (0xd800); /* legal */
INSERT INTO t (utf16_column)VALUES (0xd800); /* illegal */
```

Não há verificação de validade para caracteres que são tecnicamente válidos, mas que não são Unicode verdadeiros (ou seja, caracteres que o Unicode considera como *“unassigned code points”* (pontos de código não atribuídos) ou caracteres de *“private use”* (uso privado) ou até mesmo *“illegals”* (ilegais) como `0xffff`). Por exemplo, visto que `U+F8FF` é o Logo da Apple, isso é legal:

```sql
INSERT INTO t (utf16_column)VALUES (0xf8ff); /* legal */
```

Não se pode esperar que tais caracteres signifiquem a mesma coisa para todas as pessoas.

Como o MySQL deve considerar o pior caso (em que um caractere requer quatro bytes), o comprimento máximo de uma coluna ou índice `utf16` é apenas metade do comprimento máximo para uma coluna ou índice `ucs2`. Por exemplo, o comprimento máximo de uma chave de índice (*index key*) de uma tabela `MEMORY` é de 3072 bytes, portanto, estas instruções criam tabelas com os índices de maior comprimento permitido para colunas `ucs2` e `utf16`:

```sql
CREATE TABLE tf (s1 VARCHAR(1536) CHARACTER SET ucs2) ENGINE=MEMORY;
CREATE INDEX i ON tf (s1);
CREATE TABLE tg (s1 VARCHAR(768) CHARACTER SET utf16) ENGINE=MEMORY;
CREATE INDEX i ON tg (s1);
```