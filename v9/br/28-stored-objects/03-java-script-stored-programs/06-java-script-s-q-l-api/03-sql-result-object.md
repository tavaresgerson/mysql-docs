#### 27.3.6.3 Objeto SqlResult

Um `SqlResult` é gerado sempre que uma consulta é executada usando `sqlExecute.execute()`, `PreparedStatement.execute()` ou `Session.runSql()`.

Observação

Não é gerado um `SqlResult` se `passResultsToClient` for usado.

Os métodos suportados pelo `SqlResult` estão listados aqui:

* `close()`: Fecha o conjunto de resultados. O valor retornado é indefinido.

* `fetchAll()`: Obtém uma lista de todas as linhas no conjunto de resultados.

* `fetchOne()`: Obtém a próxima `Row` no conjunto de resultados.

* `getAffectedItemsCount()`: Obtém o número de linhas afetadas pela operação mais recente.

* `getAutoIncrementValue()`: Obtém o ID gerado automaticamente usado para a operação de inserção mais recente.

Chamar este método é equivalente a executar `LAST_INSERT_ID()` no cliente **mysql**.

* `getColumnCount()`: Obtém o número de colunas no conjunto de resultados.

* `getColumnNames()`: Obtém os nomes das colunas no conjunto de resultados atual.

* `getColumns()`: Obtém os metadados das colunas no conjunto de resultados atual.

* `getExecutionTime()`: Obtém o tempo gasto executando esta consulta, ao mais próximo segundo inteiro.

* `getWarnings()`: Obtém quaisquer avisos (como uma lista de objetos `Warning`) emitidos pela operação executada mais recentemente.

* `getWarningsCount()`: Obtém o número de avisos emitidos pela operação executada mais recentemente.

* `hasData()`: Retorna `true` se a declaração mais recentemente executada gerou um conjunto de resultados, `false` caso contrário.

* `nextResult()`: Move para o próximo conjunto de resultados, se disponível. Retorna `true` se o conjunto de resultados estiver disponível e conter dados.