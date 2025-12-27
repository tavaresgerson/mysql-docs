### 13.3.5 Tipo VECTOR

Um `VECTOR` é uma estrutura que pode armazenar até um número especificado de entradas *`N`*, definido como mostrado aqui:

```
VECTOR(N)
```

Cada entrada é um valor de ponto flutuante de 4 bytes (de precisão simples).

O comprimento padrão é de 2048; o máximo é de 16383 entradas. Para declarar uma coluna `VECTOR` do comprimento padrão, defina-a como `VECTOR` sem parênteses; tentar definir uma coluna como `VECTOR()` (com parênteses vazios) gera um erro de sintaxe.

Um `VECTOR` não pode ser comparado a nenhum outro tipo. Pode ser comparado a outro `VECTOR` para igualdade, mas nenhuma outra comparação é possível.

Uma coluna `VECTOR` não pode ser usada como qualquer tipo de chave. Isso inclui todos os seguintes tipos:

* Chave primária
* Chave estrangeira
* Chave única
* Chave de partição

Uma coluna `VECTOR` também não pode ser usada como fonte de histograma.

#### Funções Suportadas e Não Suportadas por VECTOR

Os valores de `VECTOR` podem ser usados com as funções de string do MySQL `BIT_LENGTH()`, `CHAR_LENGTH()`, `HEX()`, `LENGTH()` e `TO_BASE64()`. Outras funções de string não aceitam o tipo `VECTOR` como argumento.

`VECTOR` pode ser usado como argumento para qualquer uma das funções de criptografia `AES_ENCRYPT()`, `COMPRESS()`, `MD5()`, `SHA1()` e `SHA2()`. `VECTOR` não é suportado como tipo de argumento por nenhuma outra função de criptografia.

`VECTOR` pode ser usado como argumento no operador `CASE` e em funções relacionadas de controle de fluxo, incluindo `COALESCE()`, `IFNULL()`, `NULLIF()` e `IF()`.

`VECTOR` pode ser usado como argumento em `CAST(expressão COMO BINARY);` o resultado é uma string binária com o mesmo conteúdo que o argumento `VECTOR`. A conversão para `VECTOR` com `CAST` não é suportada; você pode converter uma string adequada para `VECTOR` usando `STRING_TO_VECTOR()`.

Os tipos de dados `VECTOR` não podem ser usados como argumentos em funções agregadas ou funções de janela, exceto em `COUNT` [DISTINCT].

`VECTOR` não pode ser usado como argumento em nenhum dos seguintes tipos de funções e operadores:

* Funções e operadores numéricos
* Funções temporais
* Funções de pesquisa de texto completo
* Funções XML
* Funções de bits, como `AND` e `OR` de bits

* Funções JSON

Para obter mais informações, consulte a Seção 14.21, “Funções Vector”.

Os valores de `VECTOR` são suportados por programas armazenados em JavaScript. Consulte a Seção 27.3.4, “Tipos de dados de programas armazenados em JavaScript e manipulação de argumentos”, para obter mais informações.