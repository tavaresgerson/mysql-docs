#### 13.1.18.6 Alterações Silenciosas na Especificação de Colunas

Em alguns casos, o MySQL altera silenciosamente as especificações de colunas em relação às fornecidas em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Essas podem ser alterações no tipo de dado, em atributos associados a um tipo de dado ou em uma especificação de Index.

Todas as alterações estão sujeitas ao limite interno de tamanho de linha (row-size limit) de 65.535 bytes, o que pode fazer com que algumas tentativas de alteração de tipo de dado falhem. Consulte Section 8.4.7, “Limits on Table Column Count and Row Size”.

* Colunas que fazem parte de uma `PRIMARY KEY` são definidas como `NOT NULL`, mesmo que não tenham sido declaradas dessa forma.

* Espaços finais (trailing spaces) são automaticamente excluídos dos valores de membros `ENUM` e `SET` quando a Table é criada.

* O MySQL mapeia certos tipos de dados usados por outros fornecedores de Database SQL para tipos MySQL. Consulte Section 11.9, “Using Data Types from Other Database Engines”.

* Se você incluir uma cláusula `USING` para especificar um tipo de Index que não é permitido para um determinado storage engine, mas houver outro tipo de Index disponível que o engine possa usar sem afetar os resultados da Query, o engine usará o tipo disponível.

* Se o modo SQL estrito (strict SQL mode) não estiver habilitado, uma coluna `VARCHAR` com uma especificação de comprimento maior que 65535 é convertida para `TEXT`, e uma coluna `VARBINARY` com uma especificação de comprimento maior que 65535 é convertida para `BLOB`. Caso contrário, ocorre um erro em qualquer um desses casos.

* Especificar o atributo `CHARACTER SET binary` para um tipo de dado de caractere faz com que a coluna seja criada como o tipo de dado binário correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY`, e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma Table usando esta definição:

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

Para verificar se o MySQL usou um tipo de dado diferente do que você especificou, execute uma instrução `DESCRIBE` ou `SHOW CREATE TABLE` após criar ou alterar a Table.

Certas outras alterações de tipo de dado podem ocorrer se você comprimir uma Table usando **myisampack**. Consulte Section 15.2.3.3, “Compressed Table Characteristics”.