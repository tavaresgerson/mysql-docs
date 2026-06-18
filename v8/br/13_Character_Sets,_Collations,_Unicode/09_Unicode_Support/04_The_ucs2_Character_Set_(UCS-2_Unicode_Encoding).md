### 12.9.4 O Conjunto de Caracteres ucs2 (Codificação Unicode UCS-2)

Nota

O conjunto de caracteres `ucs2` é desatualizado no MySQL 8.0.28; espere-se que ele seja removido em uma futura versão do MySQL. Por favor, use `utf8mb4` em vez disso.

No UCS-2, cada caractere é representado por um código Unicode de 2 bytes, com o byte mais significativo primeiro. Por exemplo: `LATIN CAPITAL LETTER A` tem o código `0x0041` e é armazenado como uma sequência de 2 bytes: `0x00 0x41`. `CYRILLIC SMALL LETTER YERU` (Unicode `0x044B`) é armazenado como uma sequência de 2 bytes: `0x04 0x4B`. Para caracteres Unicode e seus códigos, consulte o site do Consórcio Unicode.

O conjunto de caracteres `ucs2` tem essas características:

- Suporta apenas caracteres BMP (sem suporte para caracteres suplementares)

- Usa uma codificação de 16 bits de comprimento fixo e requer dois bytes por caractere.
