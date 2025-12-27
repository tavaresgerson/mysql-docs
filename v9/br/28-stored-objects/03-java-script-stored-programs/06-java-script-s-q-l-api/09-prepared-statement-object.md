#### 27.3.6.9 Objeto `PreparedStatement`

O objeto `PreparedStatement` representa um manipulador para a execução de uma instrução preparada. Ele suporta os seguintes métodos:

* `bind(Value data)`: Registra uma lista de um ou mais valores a serem vinculados na execução da instrução SQL. Os parâmetros são vinculados na ordem listada e são específicos do tipo; consulte a Seção 27.3.4, “Tipos de Dados de Programa Armazenado em JavaScript e Manipulação de Argumentos”, para uma lista dos tipos de dados suportados.

  Antes da execução inicial de uma instrução preparada, todos os seus parâmetros devem ser vinculados a valores; não fazer isso gera um erro ao tentar chamar `PreparedStatement.execute()`. Execuções subsequentes da instrução preparada podem ser realizadas usando menos parâmetros de vinculação do que os marcadores de parâmetro na instrução; nesse caso, os parâmetros “ausentes” retêm seus valores da execução anterior.

  Tentar vincular mais parâmetros do que os marcadores de parâmetro ou a parâmetros de tipos incorretos é rejeitado com um erro. Chamar este método após `deallocate()` ter sido chamado para esta instrução preparada também gera um erro.

  Devolve uma referência ao mesmo objeto `PreparedStatement` em que foi invocado.

* `deallocate()`: Fecha a instrução preparada e libera os recursos associados. Nenhuma chamada de métodos `PreparedStatement` ou `SqlResult` deve ser feita após isso.

  Chamar este método é equivalente a executar uma instrução `DEALLOCATE PREPARE` no cliente **mysql**.

* `execute()`: Executa a consulta preparada e retorna o `SqlResult` correspondente.

  Chamar este método é equivalente a executar uma instrução `EXECUTE` no cliente **mysql**.

* `getOption(String optionName)`: obtenha o valor da opção `optionName` para esta declaração. Apenas os valores `passResultToClient` e `charsetName` são suportados.

Consulte a Seção 27.3.7.2, “Instruções Preparadas”, para obter informações e exemplos adicionais.