#### 27.3.6.2 Objeto SqlExecute

`SqlExecute` tem os seguintes métodos:

* `execute()`: Executa a instrução SQL e retorna um `SqlResult`.

* `getOption(String optionName)`: Obtém o valor para a opção nomeada desta instrução. Os valores suportados são `passResultToClient` e `charsetName`. Retorna uma string ou um valor `true/false`, dependendo do tipo da opção.