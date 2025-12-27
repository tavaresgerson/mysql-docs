## 12.6 Conjunto de Caracteres de Mensagens de Erro

Esta seção descreve como o servidor MySQL utiliza conjuntos de caracteres para construir mensagens de erro. Para informações sobre o idioma das mensagens de erro (em vez do conjunto de caracteres), consulte a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2, “O Log de Erros”.

* Conjunto de Caracteres para Construção de Mensagens de Erro
* Conjunto de Caracteres para Disposition de Mensagens de Erro

### Conjunto de Caracteres para Construção de Mensagens de Erro

O servidor constrói mensagens de erro da seguinte forma:

* O modelo de mensagem utiliza UTF-8 (`utf8mb3`).
* Os parâmetros no modelo de mensagem são substituídos por valores que se aplicam a uma ocorrência específica de erro:

  + Identificadores, como nomes de tabela ou coluna, utilizam UTF-8 internamente, portanto, são copiados como estão.
  + Valores de strings (não binárias) são convertidos de seu conjunto de caracteres para UTF-8.
  * Valores de strings binárias são copiados como estão para bytes na faixa `0x20` a `0x7E`, e usando a codificação hexadecimal `\x` para bytes fora dessa faixa. Por exemplo, se ocorrer um erro de chave duplicada para uma tentativa de inserir `0x41CF9F` em uma coluna única `VARBINARY`, a mensagem de erro resultante utiliza UTF-8 com alguns bytes codificados hexadecimalmente:

    ```
    Duplicate entry 'A\xCF\x9F' for key 1
    ```

### Conjunto de Caracteres para Disposition de Mensagens de Erro

Uma mensagem de erro, uma vez construída, pode ser escrita pelo servidor no log de erros ou enviada aos clientes:

* Se o servidor escrever a mensagem de erro no log de erros, ele a escreve em UTF-8, conforme construído, sem conversão para outro conjunto de caracteres.
* Se o servidor enviar a mensagem de erro para um programa cliente, o servidor a converte de UTF-8 para o conjunto de caracteres especificado pela variável de sistema `character_set_results`. Se `character_set_results` tiver o valor `NULL` ou `binary`, não ocorre conversão. Não ocorre conversão se o valor da variável for `utf8mb3` ou `utf8mb4`, pois esses conjuntos de caracteres têm um repertório que inclui todos os caracteres UTF-8 usados na construção da mensagem.

Se os caracteres não puderem ser representados em `character_set_results`, pode ocorrer uma codificação durante a conversão. A codificação usa valores de pontos de código Unicode:

+ Caracteres na faixa da Planilha Multilíngue Básica (BMP) (`0x0000` a `0xFFFF`) são escritos usando a notação `\nnnn`.
+ Caracteres fora da faixa BMP (`0x10000` a `0x10FFFF`) são escritos usando a notação `\+nnnnnn`.

Os clientes podem definir `character_set_results` para controlar o conjunto de caracteres em que recebem mensagens de erro. A variável pode ser definida diretamente ou indiretamente por meio de métodos como `SET NAMES`. Para mais informações sobre `character_set_results`, consulte a Seção 12.4, “Conjunto de caracteres de conexão e colagens”.