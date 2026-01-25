### 10.13.3 Suporte a Caracteres Multi-Byte para Character Sets Complexos

Se você deseja adicionar suporte para um novo *Character Set* chamado *`MYSET`* que inclua caracteres *multibyte*, você deve usar funções de caracteres *multibyte* no *source file* `ctype-MYSET.c` no *directory* `strings`.

Os *Character Sets* existentes fornecem a melhor documentação e exemplos para mostrar como essas funções são implementadas. Consulte os arquivos `ctype-*.c` no *directory* `strings`, como os arquivos para os *Character Sets* `euc_kr`, `gb2312`, `gbk`, `sjis` e `ujis`. Dê uma olhada nas estruturas `MY_CHARSET_HANDLER` para ver como elas são usadas. Consulte também o arquivo `CHARSET_INFO.txt` no *directory* `strings` para obter informações adicionais.