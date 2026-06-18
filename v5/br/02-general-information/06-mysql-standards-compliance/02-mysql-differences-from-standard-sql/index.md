### 1.6.2 Diferenças do MySQL em relação ao SQL Padrão

Tentamos fazer com que o MySQL Server siga o padrão ANSI SQL e o padrão ODBC SQL, mas o MySQL Server executa operações de maneira diferente em alguns casos:

- Existem várias diferenças entre os sistemas de privilégios MySQL e o SQL padrão. Por exemplo, no MySQL, os privilégios de uma tabela não são revogados automaticamente quando você exclui uma tabela. Você deve emitir explicitamente uma declaração `REVOKE` para revogar os privilégios de uma tabela. Para mais informações, consulte a Seção 13.7.1.6, “Declaração REVOKE”.

- A função `CAST()` não suporta conversão para `REAL` - (FLOAT, DOUBLE") ou `BIGINT` - (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Veja a Seção 12.10, “Funções e Operadores de Conversão”.
