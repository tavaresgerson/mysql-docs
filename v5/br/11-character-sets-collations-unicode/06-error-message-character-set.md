## 10.6 Character Set de Mensagens de Erro

Esta seção descreve como o servidor MySQL utiliza Character Sets para construir (constructing) mensagens de erro. Para informações sobre o idioma das mensagens de erro (em vez do Character Set), consulte a Seção 10.12, “Setting the Error Message Language” (Definindo o Idioma da Mensagem de Erro). Para informações gerais sobre a configuração do Error Logging, consulte a Seção 5.4.2, “The Error Log” (O Log de Erros).

* Character Set para a Construção de Mensagens de Erro
* Character Set para a Disposição de Mensagens de Erro

### Character Set para a Construção de Mensagens de Erro

O servidor constrói as mensagens de erro da seguinte forma:

* O template da mensagem utiliza UTF-8 (`utf8mb3`).

* Os Parameters no template da mensagem são substituídos por valores que se aplicam a uma ocorrência de erro específica:

  + Identifiers, como nomes de table ou column, utilizam UTF-8 internamente, portanto, são copiados como estão (as is).

  + Valores de String de caracteres (não binários) são convertidos de seu Character Set para UTF-8.

  + Valores de String binárias são copiados como estão (as is) para bytes no range de `0x20` a `0x7E`, e utilizando codificação hexadecimal `\x` para bytes fora desse range. Por exemplo, se ocorrer um erro de duplicate-key ao tentar inserir `0x41CF9F` em uma column `VARBINARY` unique, a mensagem de erro resultante usa UTF-8 com alguns bytes codificados em hexadecimal:

    ```sql
    Duplicate entry 'A\xCF\x9F' for key 1
    ```

### Character Set para a Disposição de Mensagens de Erro

Uma mensagem de erro, uma vez construída, pode ser gravada pelo servidor no Error Log ou enviada para os clients:

* Se o servidor gravar a mensagem de erro no Error Log, ele a grava em UTF-8, conforme construída, sem conversão para outro Character Set.

* Se o servidor enviar a mensagem de erro para um programa client, o servidor a converte de UTF-8 para o Character Set especificado pela variável de sistema `character_set_results`. Se `character_set_results` tiver um valor `NULL` ou `binary`, nenhuma conversão ocorrerá. Nenhuma conversão também ocorre se o valor da variável for `utf8mb3` ou `utf8mb4`, pois esses Character Sets possuem um repertório que inclui todos os caracteres UTF-8 usados na construção da mensagem.

  Se os caracteres não puderem ser representados em `character_set_results`, alguma codificação poderá ocorrer durante a conversão. A codificação usa valores de Unicode Code Point:

  + Caracteres no range Basic Multilingual Plane (BMP) (`0x0000` a `0xFFFF`) são escritos usando a notação `\nnnn`.

  + Caracteres fora do range BMP (`0x10000` a `0x10FFFF`) são escritos usando a notação `\+nnnnnn`.

  Clients podem definir `character_set_results` para controlar o Character Set no qual recebem mensagens de erro. A variável pode ser definida diretamente ou indiretamente por meios como `SET NAMES`. Para mais informações sobre `character_set_results`, consulte a Seção 10.4, “Connection Character Sets and Collations” (Character Sets e Collations de Conexão).