#### 13.1.18.6 Alterações Silenciosas na Especificação de Colunas

Em alguns casos, o MySQL altera silenciosamente as especificações de colunas em relação às fornecidas em uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"). Essas podem ser alterações no tipo de dado, em atributos associados a um tipo de dado ou em uma especificação de Index.

Todas as alterações estão sujeitas ao limite interno de tamanho de linha (row-size limit) de 65.535 bytes, o que pode fazer com que algumas tentativas de alteração de tipo de dado falhem. Consulte [Section 8.4.7, “Limits on Table Column Count and Row Size”](column-count-limit.html "8.4.7 Limits on Table Column Count and Row Size").

* Colunas que fazem parte de uma `PRIMARY KEY` são definidas como `NOT NULL`, mesmo que não tenham sido declaradas dessa forma.

* Espaços finais (trailing spaces) são automaticamente excluídos dos valores de membros [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type") quando a Table é criada.

* O MySQL mapeia certos tipos de dados usados por outros fornecedores de Database SQL para tipos MySQL. Consulte [Section 11.9, “Using Data Types from Other Database Engines”](other-vendor-data-types.html "11.9 Using Data Types from Other Database Engines").

* Se você incluir uma cláusula `USING` para especificar um tipo de Index que não é permitido para um determinado storage engine, mas houver outro tipo de Index disponível que o engine possa usar sem afetar os resultados da Query, o engine usará o tipo disponível.

* Se o modo SQL estrito (strict SQL mode) não estiver habilitado, uma coluna [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") com uma especificação de comprimento maior que 65535 é convertida para [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), e uma coluna [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") com uma especificação de comprimento maior que 65535 é convertida para [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). Caso contrário, ocorre um erro em qualquer um desses casos.

* Especificar o atributo `CHARACTER SET binary` para um tipo de dado de caractere faz com que a coluna seja criada como o tipo de dado binário correspondente: [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") se torna [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") se torna [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") se torna [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). Para os tipos de dados [`ENUM`](enum.html "11.3.5 The ENUM Type") e [`SET`](set.html "11.3.6 The SET Type"), isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma Table usando esta definição:

```sql
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

A Table resultante tem esta definição:

```sql
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

Para verificar se o MySQL usou um tipo de dado diferente do que você especificou, execute uma instrução [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") ou [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") após criar ou alterar a Table.

Certas outras alterações de tipo de dado podem ocorrer se você comprimir uma Table usando [**myisampack**](myisampack.html "4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables"). Consulte [Section 15.2.3.3, “Compressed Table Characteristics”](compressed-format.html "15.2.3.3 Compressed Table Characteristics").