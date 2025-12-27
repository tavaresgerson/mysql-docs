### 12.9.5 O Conjunto de Caracteres UTF-16 (Codificação Unicode UTF-16)

O conjunto de caracteres `utf16` é o conjunto de caracteres `ucs2` com uma extensão que permite a codificação de caracteres suplementares:

* Para um caractere BMP, `utf16` e `ucs2` têm características de armazenamento idênticas: mesmos valores de código, mesma codificação, mesma comprimento.
* Para um caractere suplementar, `utf16` tem uma sequência especial para representar o caractere usando 32 bits. Isso é chamado de mecanismo de "surrogato": Para um número maior que `0xffff`, pegue 10 bits e adicione-os a `0xd800` e coloque-os na primeira palavra de 16 bits, pegue mais 10 bits e adicione-os a `0xdc00` e coloque-os na próxima palavra de 16 bits. Consequentemente, todos os caracteres suplementares requerem 32 bits, onde os primeiros 16 bits são um número entre `0xd800` e `0xdbff`, e os últimos 16 bits são um número entre `0xdc00` e `0xdfff`. Exemplos estão na Seção 15.5 Área de Surrogados do documento Unicode 4.0.

Como o `utf16` suporta surrogados e o `ucs2` não, há uma verificação de validade que se aplica apenas no `utf16`: Você não pode inserir um surrogato superior sem um surrogato inferior, ou vice-versa. Por exemplo:

```
INSERT INTO t (ucs2_column) VALUES (0xd800); /* legal */
INSERT INTO t (utf16_column)VALUES (0xd800); /* illegal */
```

Não há verificação de validade para caracteres que são tecnicamente válidos, mas não são verdadeiros Unicode (ou seja, caracteres que o Unicode considera como "pontos de código não atribuídos" ou caracteres de uso privado ou até mesmo "ilegais" como `0xffff`). Por exemplo, como `U+F8FF` é o Logotipo da Apple, isso é legal:

```
INSERT INTO t (utf16_column)VALUES (0xf8ff); /* legal */
```

Tais caracteres não podem ser esperados para significar a mesma coisa para todos.

Como o MySQL deve permitir o pior caso (que um caractere requer quatro bytes), o comprimento máximo de uma coluna ou índice `utf16` é apenas metade do comprimento máximo para uma coluna ou índice `ucs2`. Por exemplo, o comprimento máximo de uma chave de índice de tabela `MEMORY` é de 3072 bytes, então essas declarações criam tabelas com os índices mais longos permitidos para colunas `ucs2` e `utf16`:

```
CREATE TABLE tf (s1 VARCHAR(1536) CHARACTER SET ucs2) ENGINE=MEMORY;
CREATE INDEX i ON tf (s1);
CREATE TABLE tg (s1 VARCHAR(768) CHARACTER SET utf16) ENGINE=MEMORY;
CREATE INDEX i ON tg (s1);
```