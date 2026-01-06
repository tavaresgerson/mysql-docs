### 10.13.2 Suporte para a Colagem de Cadeias de Caracteres para Conjuntos Complejos de Caracteres

Para um conjunto de caracteres simples chamado *`MYSET`*, as regras de ordenação são especificadas no arquivo de configuração `MYSET.xml` usando elementos de matriz `<map>` dentro dos elementos `<collation>`. Se as regras de ordenação para o seu idioma forem muito complexas para serem manipuladas com matrizes simples, você deve definir funções de ordenação de strings no arquivo de código-fonte `ctype-MYSET.c` no diretório `strings`.

Os conjuntos de caracteres existentes fornecem a melhor documentação e exemplos para mostrar como essas funções são implementadas. Veja os arquivos `ctype-*.c` no diretório `strings`, como os arquivos para os conjuntos de caracteres `big5`, `czech`, `gbk`, `sjis` e `tis160`. Dê uma olhada nas estruturas `MY_COLLATION_HANDLER` para ver como elas são usadas. Veja também o arquivo `CHARSET_INFO.txt` no diretório `strings` para obter informações adicionais.
