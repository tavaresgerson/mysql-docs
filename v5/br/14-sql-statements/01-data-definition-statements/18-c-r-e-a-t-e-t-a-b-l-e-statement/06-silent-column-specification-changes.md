#### 13.1.18.6 Alterações nas especificações da coluna silenciosa

Em alguns casos, o MySQL altera silenciosamente as especificações das colunas das que foram fornecidas em uma declaração de `CREATE TABLE` ou `ALTER TABLE`. Essas alterações podem ser mudanças em um tipo de dado, em atributos associados a um tipo de dado ou em uma especificação de índice.

Todas as alterações estão sujeitas ao limite interno de tamanho de linha de 65.535 bytes, o que pode fazer com que algumas tentativas de alteração do tipo de dados falhem. Consulte Seção 8.4.7, “Limites de contagem de colunas de tabela e tamanho de linha”.

- As colunas que fazem parte de uma `PRIMARY KEY` são definidas como `NOT NULL`, mesmo que não sejam declaradas dessa forma.

- Os espaços em branco finais são excluídos automaticamente dos valores dos membros de `ENUM` e `SET` quando a tabela é criada.

- O MySQL mapeia certos tipos de dados usados por outros fornecedores de bancos de dados SQL para tipos MySQL. Veja Seção 11.9, “Usando Tipos de Dados de Outros Motores de Banco de Dados”.

- Se você incluir uma cláusula `USING` para especificar um tipo de índice que não é permitido para um determinado motor de armazenamento, mas houver outro tipo de índice disponível que o motor possa usar sem afetar os resultados das consultas, o motor usará o tipo disponível.

- Se o modo SQL rigoroso não estiver habilitado, uma coluna `VARCHAR` com uma especificação de comprimento maior que 65535 é convertida para `TEXT`, e uma coluna `VARBINARY` com uma especificação de comprimento maior que 65535 é convertida para `BLOB`. Caso contrário, ocorrerá um erro em qualquer um desses casos.

- Especificar o atributo `CHARACTER SET binary` para um tipo de dado de caracteres faz com que a coluna seja criada como o tipo de dados binário correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY` e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma tabela usando essa definição:

  ```sql
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

  A tabela resultante tem esta definição:

  ```sql
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

Para verificar se o MySQL usou um tipo de dado diferente do especificado, execute uma instrução `DESCRIBE` ou `SHOW CREATE TABLE` após criar ou alterar a tabela.

Certos outros tipos de dados podem ser alterados se você comprimir uma tabela usando **myisampack**. Veja Seção 15.2.3.3, “Características da Tabela Compressa”.
