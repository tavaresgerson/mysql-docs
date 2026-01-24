### 10.13.3 Suporte a Caracteres Multi-Byte para Conjuntos de Caracteres Complexos

Se você quiser adicionar suporte para um novo conjunto de caracteres chamado *`MYSET`* que inclua caracteres multibyte, você deve usar funções de caracteres multibyte no arquivo fonte `ctype-MYSET.c` no diretório `strings`.

Os conjuntos de caracteres existentes fornecem a melhor documentação e exemplos para mostrar como essas funções são implementadas. Observe os arquivos `ctype-*.c` no diretório `strings`, como os arquivos para os conjuntos de caracteres `euc_kr`, `gb2312`, `gbk`, `sjis` e `ujis`. Dê uma olhada nas estruturas `MY_CHARSET_HANDLER` para ver como elas são usadas. Consulte também o arquivo `CHARSET_INFO.txt` no diretório `strings` para obter informações adicionais.