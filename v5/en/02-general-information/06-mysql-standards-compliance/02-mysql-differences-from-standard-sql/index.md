### 1.6.2 Diferenças do MySQL em Relação ao SQL Padrão

1.6.2.1 Diferenças do SELECT INTO TABLE

1.6.2.2 Diferenças do UPDATE

1.6.2.3 Diferenças das Restrições FOREIGN KEY

1.6.2.4 '--' como Início de um Comentário

Tentamos fazer com que o MySQL Server siga o padrão ANSI SQL e o padrão ODBC SQL, mas o MySQL Server executa operações de maneira diferente em alguns casos:

* Existem várias diferenças entre os sistemas de privilégios do MySQL e do SQL padrão. Por exemplo, no MySQL, os privilégios para uma table não são automaticamente revogados quando você exclui uma table. Você deve emitir explicitamente uma instrução `REVOKE` para revogar privilégios para uma table. Para mais informações, consulte a Seção 13.7.1.6, “Instrução REVOKE”.

* A função `CAST()` não oferece suporte a CAST para `REAL` (FLOAT, DOUBLE) ou `BIGINT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT). Consulte a Seção 12.10, “Funções e Operadores de CAST”.