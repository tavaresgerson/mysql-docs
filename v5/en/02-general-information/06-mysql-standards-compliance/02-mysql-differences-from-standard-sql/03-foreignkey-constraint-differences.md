#### 1.6.2.3 Diferenças nas Constraints FOREIGN KEY

A implementação MySQL das constraints `FOREIGN KEY` difere do `SQL standard` nos seguintes aspectos principais:

*   Se houver várias rows na tabela *parent* (pai) com o mesmo valor de chave referenciada, o `InnoDB` executa uma verificação de `FOREIGN KEY` como se as outras rows *parent* com o mesmo valor de chave não existissem. Por exemplo, se você definir uma `constraint` do tipo `RESTRICT`, e houver uma row *child* (filha) com várias rows *parent*, o `InnoDB` não permite a exclusão de nenhuma das rows *parent*.

*   Se `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` recursar para atualizar a *mesma tabela* que atualizou anteriormente durante o mesmo *cascade*, ele age como `RESTRICT`. Isso significa que você não pode usar operações autorreferenciais `ON UPDATE CASCADE` ou `ON UPDATE SET NULL`. Isso serve para evitar loops infinitos resultantes de atualizações em cascata. Por outro lado, um `ON DELETE SET NULL` autorreferencial é possível, assim como um `ON DELETE CASCADE` autorreferencial. Operações em cascata não podem ser aninhadas em mais de 15 níveis de profundidade.

*   Em uma instrução SQL que insere, deleta ou atualiza muitas rows, as constraints `FOREIGN KEY` (assim como as `UNIQUE constraints`) são verificadas row por row. Ao realizar verificações de `FOREIGN KEY`, o `InnoDB` define `shared row-level locks` em registros *child* ou *parent* que ele deve examinar. O MySQL verifica as constraints `FOREIGN KEY` imediatamente; a verificação não é adiada para o `transaction commit`. De acordo com o `SQL standard`, o comportamento padrão deve ser a verificação adiada (`deferred checking`). Ou seja, as constraints são verificadas somente após o processamento da *instrução SQL inteira*. Isso significa que não é possível deletar uma row que se refere a si mesma usando uma `FOREIGN KEY`.

*   Nenhum `storage engine`, incluindo o `InnoDB`, reconhece ou impõe a cláusula `MATCH` usada em definições de `constraint` de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Deve-se evitar a especificação do `MATCH`.

    A cláusula `MATCH` no `SQL standard` controla como os valores `NULL` em uma `FOREIGN KEY` composta (múltiplas colunas) são tratados ao comparar com uma `Primary Key` na tabela referenciada. O MySQL implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma `FOREIGN KEY` seja totalmente ou parcialmente `NULL`. Nesse caso, uma row (tabela *child*) contendo tal `FOREIGN KEY` pode ser inserida mesmo que não corresponda a nenhuma row na tabela referenciada (*parent*). (É possível implementar outras semânticas usando `triggers`.)

*   O MySQL exige que as colunas referenciadas sejam indexadas por motivos de performance. No entanto, o MySQL não impõe que as colunas referenciadas sejam `UNIQUE` ou sejam declaradas `NOT NULL`.

    Uma `FOREIGN KEY constraint` que referencia uma chave não-`UNIQUE` não é `SQL standard`, mas sim uma extensão do `InnoDB`. O `storage engine NDB`, por outro lado, exige uma chave `UNIQUE` explícita (ou `Primary Key`) em qualquer coluna referenciada como `FOREIGN KEY`.

    O tratamento de referências de `FOREIGN KEY` para chaves não-`UNIQUE` ou chaves que contêm valores `NULL` não é bem definido para operações como `UPDATE` ou `DELETE CASCADE`. É aconselhável usar `FOREIGN KEYs` que referenciem apenas chaves `UNIQUE` (incluindo `PRIMARY`) e `NOT NULL`.

*   Para `storage engines` que não suportam `FOREIGN KEYs` (como o `MyISAM`), o MySQL Server analisa e ignora as especificações de `FOREIGN KEY`.

*   O MySQL analisa, mas ignora, as “especificações `REFERENCES` *inline*” (conforme definido no `SQL standard`), onde as referências são definidas como parte da especificação da coluna. O MySQL aceita cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação `FOREIGN KEY` separada.

    Definir uma coluna para usar uma cláusula `REFERENCES tbl_name(col_name)` não tem efeito real e *serve apenas como um lembrete ou comentário para você de que a coluna que está definindo atualmente se destina a referenciar uma coluna em outra tabela*. É importante notar, ao usar esta sintaxe, que:

    + O MySQL não executa nenhum tipo de verificação para garantir que *`col_name`* realmente exista em *`tbl_name`* (ou mesmo que *`tbl_name`* exista).

    + O MySQL não executa nenhum tipo de ação em *`tbl_name`*, como deletar rows em resposta a ações realizadas em rows na tabela que você está definindo; em outras palavras, esta sintaxe não induz nenhum comportamento `ON DELETE` ou `ON UPDATE`. (Embora você possa escrever uma cláusula `ON DELETE` ou `ON UPDATE` como parte da cláusula `REFERENCES`, ela também é ignorada.)

    + Esta sintaxe cria uma *coluna*; ela **não** cria nenhum tipo de `Index` ou chave.

    Você pode usar uma coluna criada dessa forma como uma coluna de `JOIN`, conforme mostrado aqui:

    ```sql
  CREATE TABLE person (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name CHAR(60) NOT NULL,
      PRIMARY KEY (id)
  );

  CREATE TABLE shirt (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      style ENUM('t-shirt', 'polo', 'dress') NOT NULL,
      color ENUM('red', 'blue', 'orange', 'white', 'black') NOT NULL,
      owner SMALLINT UNSIGNED NOT NULL REFERENCES person(id),
      PRIMARY KEY (id)
  );

  INSERT INTO person VALUES (NULL, 'Antonio Paz');

  SELECT @last := LAST_INSERT_ID();

  INSERT INTO shirt VALUES
  (NULL, 'polo', 'blue', @last),
  (NULL, 'dress', 'white', @last),
  (NULL, 't-shirt', 'blue', @last);

  INSERT INTO person VALUES (NULL, 'Lilliana Angelovska');

  SELECT @last := LAST_INSERT_ID();

  INSERT INTO shirt VALUES
  (NULL, 'dress', 'orange', @last),
  (NULL, 'polo', 'red', @last),
  (NULL, 'dress', 'blue', @last),
  (NULL, 't-shirt', 'white', @last);

  SELECT * FROM person;
  +----+---------------------+
  | id | name                |
  +----+---------------------+
  |  1 | Antonio Paz         |
  |  2 | Lilliana Angelovska |
  +----+---------------------+

  SELECT * FROM shirt;
  +----+---------+--------+-------+
  | id | style   | color  | owner |
  +----+---------+--------+-------+
  |  1 | polo    | blue   |     1 |
  |  2 | dress   | white  |     1 |
  |  3 | t-shirt | blue   |     1 |
  |  4 | dress   | orange |     2 |
  |  5 | polo    | red    |     2 |
  |  6 | dress   | blue   |     2 |
  |  7 | t-shirt | white  |     2 |
  +----+---------+--------+-------+


  SELECT s.* FROM person p INNER JOIN shirt s
     ON s.owner = p.id
   WHERE p.name LIKE 'Lilliana%'
     AND s.color <> 'white';

  +----+-------+--------+-------+
  | id | style | color  | owner |
  +----+-------+--------+-------+
  |  4 | dress | orange |     2 |
  |  5 | polo  | red    |     2 |
  |  6 | dress | blue   |     2 |
  +----+-------+--------+-------+
  ```

    Quando usada dessa maneira, a cláusula `REFERENCES` não é exibida na saída de `SHOW CREATE TABLE` ou `DESCRIBE`:

    ```sql
  SHOW CREATE TABLE shirt\G
  *************************** 1. row ***************************
  Table: shirt
  Create Table: CREATE TABLE `shirt` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `style` enum('t-shirt','polo','dress') NOT NULL,
  `color` enum('red','blue','orange','white','black') NOT NULL,
  `owner` smallint(5) unsigned NOT NULL,
  PRIMARY KEY  (`id`)
  ) ENGINE=MyISAM DEFAULT CHARSET=latin1
  ```

Para informações sobre constraints `FOREIGN KEY`, consulte a Seção 13.1.18.5, “FOREIGN KEY Constraints”.