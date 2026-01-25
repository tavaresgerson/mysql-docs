## 10.6 Conjunto de Caracteres de Mensagens de Erro

Esta seção descreve como o MySQL server usa conjuntos de caracteres para construir mensagens de erro. Para informações sobre o idioma das mensagens de erro (em vez do conjunto de caracteres), consulte a Seção 10.12, “Configurando o Idioma das Mensagens de Erro”. Para informações gerais sobre a configuração do log de erros, consulte a Seção 5.4.2, “O Log de Erro”.

* Conjunto de Caracteres para Construção de Mensagens de Erro
* Conjunto de Caracteres para Disposição de Mensagens de Erro

### Conjunto de Caracteres para Construção de Mensagens de Erro

O server constrói mensagens de erro da seguinte forma:

* O template da mensagem usa UTF-8 (`utf8mb3`).

* Parâmetros no template da mensagem são substituídos por valores que se aplicam a uma ocorrência de erro específica:

  + Identificadores, como nomes de tabela ou coluna, usam UTF-8 internamente, então eles são copiados como estão (*as is*).

  + Valores de string de caractere (não-binary) são convertidos de seu conjunto de caracteres para UTF-8.

  + Valores de string Binary são copiados como estão (*as is*) para bytes no range de `0x20` a `0x7E`, e usando codificação hexadecimal `\x` para bytes fora desse range. Por exemplo, se ocorrer um erro de duplicate-key em uma tentativa de inserir `0x41CF9F` em uma coluna unique `VARBINARY`, a mensagem de erro resultante usa UTF-8 com alguns bytes codificados em hexadecimal:

    ```sql
    Duplicate entry 'A\xCF\x9F' for key 1
    ```

### Conjunto de Caracteres para Disposição de Mensagens de Erro

Uma mensagem de erro, uma vez construída, pode ser escrita pelo server no log de erro ou enviada a clientes:

* Se o server escrever a mensagem de erro no log de erro, ele a escreve em UTF-8, conforme construída, sem conversão para outro conjunto de caracteres.

* Se o server enviar a mensagem de erro a um programa cliente, o server a converte de UTF-8 para o conjunto de caracteres especificado pela variável de sistema `character_set_results`. Se `character_set_results` tiver um valor `NULL` ou `binary`, nenhuma conversão ocorre. Nenhuma conversão também ocorre se o valor da variável for `utf8mb3` ou `utf8mb4`, pois esses conjuntos de caracteres possuem um repertório que inclui todos os caracteres UTF-8 usados na construção da mensagem.

  Se os caracteres não puderem ser representados em `character_set_results`, alguma codificação pode ocorrer durante a conversão. A codificação usa valores de code point Unicode:

  + Caracteres no range do Basic Multilingual Plane (BMP) (`0x0000` a `0xFFFF`) são escritos usando a notação `\nnnn`.

  + Caracteres fora do range do BMP (`0x10000` a `0x10FFFF`) são escritos usando a notação `\+nnnnnn`.

  Clientes podem definir `character_set_results` para controlar o conjunto de caracteres no qual recebem mensagens de erro. A variável pode ser definida diretamente ou indiretamente por meios como `SET NAMES`. Para mais informações sobre `character_set_results`, consulte a Seção 10.4, “Conjuntos de Caracteres e Collations de Conexão”.