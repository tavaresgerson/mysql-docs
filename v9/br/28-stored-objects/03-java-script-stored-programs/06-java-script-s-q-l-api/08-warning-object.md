#### 27.3.6.8 Objeto de Aviso

`Aviso` representa um aviso emitido pela execução de uma declaração e possui as seguintes propriedades:

* `código`: Código de erro do MySQL (número inteiro).
* `nível`: Nível de aviso. Pode ser qualquer um dos valores 1 (`NOTA`), 2 (`AVISO`) ou 3 (`ERRO`).

* `mensagem`: Texto da mensagem de aviso; uma string.

Você também pode utilizar o objeto `Error` do JavaScript, como o obtido a partir de um bloco try-catch. Consulte Gerenciamento de Erros, para mais informações.