### 1.7.2 Diferenças do MySQL em relação ao SQL Padrão

Tentamos fazer com que o MySQL Server siga o padrão ANSI SQL e o padrão ODBC SQL, mas o MySQL Server executa operações de maneira diferente em alguns casos:

* Existem várias diferenças entre os sistemas de privilégios do MySQL e do SQL padrão. Por exemplo, no MySQL, os privilégios de uma tabela não são revogados automaticamente quando você exclui uma tabela. Você deve emitir explicitamente uma declaração `REVOKE` para revogar os privilégios de uma tabela. Para mais informações.
* A função `CAST()` não suporta conversão para `REAL`, `FLOAT`, `DOUBLE` ou `BIGINT` - `INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`.