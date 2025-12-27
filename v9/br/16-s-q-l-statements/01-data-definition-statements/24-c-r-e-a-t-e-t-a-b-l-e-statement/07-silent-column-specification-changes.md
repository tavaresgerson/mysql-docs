#### 15.1.24.7 Mudanças nas Especificações das Colunas Silenciosas

Em alguns casos, o MySQL altera silenciosamente as especificações das colunas das que foram fornecidas em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Essas alterações podem ser mudanças em um tipo de dado, em atributos associados a um tipo de dado ou em uma especificação de índice.

Todas as alterações estão sujeitas ao limite interno de tamanho de linha de 65.535 bytes, o que pode fazer com que algumas tentativas de alterar o tipo de dado falhem. Veja a Seção 10.4.7, “Limites de Contagem de Colunas de Tabela e Tamanho de Linha”.

* Colunas que fazem parte de uma `PRIMARY KEY` são tornadas `NOT NULL`, mesmo que não tenham sido declaradas dessa forma.

* Espaços finais são automaticamente excluídos dos valores dos membros `ENUM` e `SET` quando a tabela é criada.

* O MySQL mapeia certos tipos de dados usados por outros fornecedores de bancos de dados SQL para tipos MySQL. Veja a Seção 13.9, “Usando Tipos de Dados de Outros Motores de Banco de Dados”.

* Se você incluir uma cláusula `USING` para especificar um tipo de índice que não é permitido para um determinado motor de armazenamento, mas há outro tipo de índice disponível que o motor pode usar sem afetar os resultados das consultas, o motor usa o tipo disponível.

* Se o modo SQL rigoroso não estiver habilitado, uma coluna `VARCHAR` com uma especificação de comprimento maior que 65535 é convertida para `TEXT`, e uma coluna `VARBINARY` com uma especificação de comprimento maior que 65535 é convertida para `BLOB`. Caso contrário, ocorre um erro em qualquer um desses casos.

* Especificar o atributo `CHARACTER SET binary` para um tipo de dado de caracteres faz com que a coluna seja criada como o tipo de dados binário correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY` e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma tabela usando essa definição:

  ```
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

  A tabela resultante tem essa definição:

Para verificar se o MySQL usou um tipo de dado diferente do especificado, execute uma instrução `DESCRIBE` ou `SHOW CREATE TABLE` após criar ou alterar a tabela.

Algumas outras alterações de tipo de dado podem ocorrer se você comprimir uma tabela usando **myisampack**. Veja a Seção 18.2.3.3, “Características da Tabela Compressa”.