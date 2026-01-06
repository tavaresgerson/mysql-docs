## 10.6 Conjunto de caracteres de mensagem de erro

Esta seção descreve como o servidor MySQL utiliza conjuntos de caracteres para construir mensagens de erro. Para informações sobre o idioma das mensagens de erro (em vez do conjunto de caracteres), consulte a Seção 10.12, “Definindo o Idioma da Mensagem de Erro”. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 5.4.2, “O Log de Erros”.

- Conjunto de caracteres para a construção de mensagens de erro
- Conjunto de caracteres para a disposição de mensagens de erro

### Conjunto de caracteres para a construção de mensagens de erro

O servidor constrói as mensagens de erro da seguinte forma:

- O modelo de mensagem usa UTF-8 (`utf8mb3`).

- Os parâmetros no modelo de mensagem são substituídos por valores que se aplicam a uma ocorrência específica de erro:

  - Identificadores como nomes de tabelas ou colunas usam UTF-8 internamente, então eles são copiados como estão.

  - Os valores de cadeias de caracteres (não binários) são convertidos de seu conjunto de caracteres para UTF-8.

  - Os valores de cadeia binária são copiados como estão para os bytes na faixa de `0x20` a `0x7E`, e usando a codificação hexadecimal `\x` para bytes fora dessa faixa. Por exemplo, se ocorrer um erro de chave duplicada para uma tentativa de inserir `0x41CF9F` em uma coluna `VARBINARY` única, a mensagem de erro resultante usa UTF-8 com alguns bytes codificados hexadecimalmente:

    ```sql
    Duplicate entry 'A\xCF\x9F' for key 1
    ```

### Conjunto de caracteres para a disposição de mensagens de erro

Uma mensagem de erro, uma vez construída, pode ser escrita pelo servidor no log de erros ou enviada aos clientes:

- Se o servidor escrever a mensagem de erro no log de erros, ele a escreverá em UTF-8, conforme construído, sem conversão para outro conjunto de caracteres.

- Se o servidor enviar a mensagem de erro para um programa cliente, ele a converte do UTF-8 para o conjunto de caracteres especificado pela variável de sistema `character_set_results`. Se `character_set_results` tiver o valor `NULL` ou `binary`, não ocorre conversão. Não ocorre conversão se o valor da variável for `utf8mb3` ou `utf8mb4`, pois esses conjuntos de caracteres têm um repertório que inclui todos os caracteres UTF-8 usados na construção da mensagem.

  Se os caracteres não puderem ser representados no `character_set_results`, pode ocorrer uma codificação durante a conversão. A codificação utiliza valores de pontos de código Unicode:

  - Os caracteres do Plano Multilíngue Básico (BMP) (`0x0000` a `0xFFFF`) são escritos usando a notação `\nnnn`.

  - Os caracteres fora da faixa BMP (de `0x10000` a `0x10FFFF`) são escritos usando a notação `\+nnnnnn`.

  Os clientes podem definir `character_set_results` para controlar o conjunto de caracteres no qual recebem mensagens de erro. A variável pode ser definida diretamente ou indiretamente por meio de métodos como `SET NAMES`. Para obter mais informações sobre `character_set_results`, consulte a Seção 10.4, “Conjunto de caracteres de conexão e colagens”.
