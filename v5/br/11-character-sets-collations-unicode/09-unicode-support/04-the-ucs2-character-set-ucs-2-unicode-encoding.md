### 10.9.4 O Conjunto de Caracteres ucs2 (Codificação Unicode UCS-2)

Em UCS-2, cada caractere é representado por um código Unicode de 2 bytes, com o byte mais significativo primeiro. Por exemplo: A LETRA MAIÚSCULA LATINA A tem o código `0x0041` e é armazenada como uma sequência de 2 bytes: `0x00 0x41`. A LETRA MINÚSCULA CIRÍLICA YERU (Unicode `0x044B`) é armazenada como uma sequência de 2 bytes: `0x04 0x4B`. Para caracteres Unicode e seus códigos, consulte o website do Unicode Consortium.

O conjunto de caracteres ucs2 possui estas características:

* Suporta apenas caracteres BMP (não há suporte para caracteres suplementares)

* Utiliza uma codificação de 16 bits de comprimento fixo e requer dois bytes por caractere.