### 1.7.2 Diferenças entre o MySQL e o SQL padrão

Nós tentamos fazer o MySQL Server seguir o padrão ANSI SQL e o padrão ODBC SQL, mas o MySQL Server executa operações de forma diferente em alguns casos:

- Existem várias diferenças entre o MySQL e os sistemas de privilégios SQL padrão. Por exemplo, no MySQL, os privilégios para uma tabela não são automaticamente revogados quando você elimina uma tabela. Você deve emitir explicitamente uma instrução `REVOKE` para revogar privilégios para uma tabela. Para mais informações, consulte a Seção 15.7.1.8, REVOKE Statement.
- A função `CAST()` não suporta o cast para `REAL` - FLOAT, DOUBLE") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").
