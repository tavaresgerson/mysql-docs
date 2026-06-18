#### 1.6.2.3 Diferenças entre a restrição de chave estrangeira

A implementação do MySQL de restrições de chave estrangeira difere do padrão SQL nos seguintes aspectos-chave:

- Se houver várias linhas na tabela pai com o mesmo valor da chave referenciada, o `InnoDB` realiza uma verificação de chave estrangeira como se as outras linhas pai com o mesmo valor da chave não existissem. Por exemplo, se você definir uma restrição de tipo `RESTRICT` e houver uma linha filha com várias linhas pai, o `InnoDB` não permite a exclusão de nenhuma das linhas pai.

- Se `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` for recursivo para atualizar a mesma tabela que já foi atualizada anteriormente durante a mesma casca, ele age como `RESTRICT`. Isso significa que você não pode usar operações `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` auto-referenciadas. Isso é para evitar loops infinitos resultantes de atualizações em cascata. Uma operação `ON DELETE SET NULL` auto-referenciada, por outro lado, é possível, assim como uma operação `ON DELETE CASCADE` auto-referenciada. As operações em cascata não podem ser aninhadas em mais de 15 níveis de profundidade.

- Em uma instrução SQL que insere, exclui ou atualiza muitas linhas, as restrições de chave estrangeira (como restrições únicas) são verificadas linha por linha. Ao realizar verificações de chave estrangeira, o `InnoDB` define bloqueios compartilhados em nível de linha em registros filhos ou pais que ele deve examinar. O MySQL verifica as restrições de chave estrangeira imediatamente; a verificação não é adiada para o commit da transação. De acordo com o padrão SQL, o comportamento padrão deve ser a verificação adiada. Isso significa que não é possível excluir uma linha que se refere a si mesma usando uma chave estrangeira.

- Nenhum motor de armazenamento, incluindo o `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada nas definições de restrições de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. A especificação da cláusula `MATCH` deve ser evitada.

  A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com múltiplos colunas) são tratados ao serem comparados com uma chave primária na tabela referenciada. O MySQL implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja `NULL` total ou parcialmente. Nesse caso, uma linha (de uma tabela filha) que contenha essa chave estrangeira pode ser inserida, mesmo que não corresponda a nenhuma linha na tabela referenciada (pai). (É possível implementar outras semânticas usando gatilhos.)

- O MySQL exige que as colunas referenciadas estejam indexadas por razões de desempenho. No entanto, o MySQL não exige que as colunas referenciadas sejam `UNIQUE` ou sejam declaradas `NOT NULL`.

  Uma restrição `FOREIGN KEY` que faz referência a uma chave não `UNIQUE` não é padrão no SQL, mas sim uma extensão do `InnoDB`. O motor de armazenamento `NDB`, por outro lado, exige uma chave única explícita (ou chave primária) em qualquer coluna referenciada como chave estrangeira.

  O tratamento de referências de chave estrangeira para chaves não únicas ou chaves que contêm valores `NULL` não está bem definido para operações como `UPDATE` ou `DELETE CASCADE`. Você é aconselhado a usar chaves estrangeiras que façam referência apenas a chaves `UNIQUE` (incluindo `PRIMARY`) e `NOT NULL`.

- Para motores de armazenamento que não suportam chaves estrangeiras (como `MyISAM`), o MySQL Server analisa e ignora as especificações de chaves estrangeiras.

- O MySQL analisa, mas ignora as especificações `inline `REFERENCES`(conforme definido no padrão SQL) quando as referências são definidas como parte da especificação da coluna. O MySQL aceita cláusulas`REFERENCES`apenas quando especificadas como parte de uma especificação`FOREIGN KEY\` separada.

  Definir uma coluna para usar uma cláusula `REFERENCES tbl_name(col_name)` não tem efeito real e *serve apenas como uma nota ou comentário para você de que a coluna que você está definindo atualmente é destinada a referenciar uma coluna em outra tabela*. É importante perceber quando usar essa sintaxe que:

  - O MySQL não realiza nenhum tipo de verificação para garantir que *`col_name`* realmente exista em *`tbl_name`* (ou até mesmo que *`tbl_name`* em si exista).

  - O MySQL não executa nenhuma ação em *`tbl_name`* como a exclusão de linhas em resposta às ações realizadas nas linhas da tabela que você está definindo; em outras palavras, essa sintaxe não induz nenhum comportamento `ON DELETE` ou `ON UPDATE` (embora você possa escrever uma cláusula `ON DELETE` ou `ON UPDATE` como parte da cláusula `REFERENCES`, ela também é ignorada).

  - Essa sintaxe cria uma *coluna*; ela **não** cria nenhum tipo de índice ou chave.

  Você pode usar uma coluna assim criada como uma coluna de junção, como mostrado aqui:

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

  Quando usado dessa maneira, a cláusula `REFERENCES` não é exibida na saída de `SHOW CREATE TABLE` ou `DESCRIBE`:

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

Para obter informações sobre restrições de chave estrangeira, consulte a Seção 13.1.18.5, “Restrições de Chave Estrangeira”.
