#### 1.7.2.3 Diferenças entre as restrições da chave estrangeira

A implementação MySQL de restrições de chave estrangeira difere do padrão SQL nos seguintes aspectos principais:

- Se houver várias linhas na tabela principal com o mesmo valor de chave referenciado, `InnoDB` executa uma verificação de chave estrangeira como se as outras linhas principais com o mesmo valor de chave não existissem. Por exemplo, se você definir uma restrição de tipo `RESTRICT` e houver uma linha filho com várias linhas principais, `InnoDB` não permite a exclusão de nenhuma das linhas principais. Isto é mostrado no seguinte exemplo:

  ```sql
  mysql> CREATE TABLE parent (
      ->     id INT,
      ->     INDEX (id)
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.04 sec)

  mysql> CREATE TABLE child (
      ->     id INT,
      ->     parent_id INT,
      ->     INDEX par_ind (parent_id),
      ->     FOREIGN KEY (parent_id)
      ->         REFERENCES parent(id)
      ->         ON DELETE RESTRICT
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.02 sec)

  mysql> INSERT INTO parent (id)
      ->     VALUES ROW(1), ROW(2), ROW(3), ROW(1);
  Query OK, 4 rows affected (0.01 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> INSERT INTO child (id,parent_id)
      ->     VALUES ROW(1,1), ROW(2,2), ROW(3,3);
  Query OK, 3 rows affected (0.01 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> DELETE FROM parent WHERE id=1;
  ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key
  constraint fails (`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY
  (`parent_id`) REFERENCES `parent` (`id`) ON DELETE RESTRICT)
  ```
- Se `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` recorrer para atualizar a *mesma tabela* que foi atualizada anteriormente durante a mesma cascata, ele age como `RESTRICT`. Isso significa que você não pode usar operações auto-referenciais `ON UPDATE CASCADE` ou `ON UPDATE SET NULL`. Isso é para evitar loops infinitos resultantes de atualizações em cascata. Um `ON DELETE SET NULL` auto-referencial, por outro lado, é possível, assim como um `ON DELETE CASCADE` auto-referencial. As operações em cascata não podem ser aninhadas mais de 15 níveis.
- Em uma instrução SQL que insere, exclui ou atualiza muitas linhas, as restrições de chaves externas (como restrições únicas) são verificadas linha por linha. Ao executar verificações de chaves externas, `InnoDB` define bloqueios de nível de linha compartilhados em registros filhos ou pais que ele deve examinar. O MySQL verifica as restrições de chaves externas imediatamente; a verificação não é diferida para o commit de transação. De acordo com o padrão SQL, o comportamento padrão deve ser deferida verificação. Ou seja, as restrições só são verificadas depois que a instrução SQL \* inteira \* foi processada. Isso significa que não é possível excluir uma linha que se refere a si mesma usando uma chave externa.
- Nenhum mecanismo de armazenamento, incluindo `InnoDB`, reconhece ou impõe a cláusula `MATCH` usada nas definições de restrição de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. A especificação do `MATCH` deve ser evitada.

  A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (múltipla coluna) são tratados quando comparados a uma chave primária na tabela referenciada. O MySQL essencialmente implementa a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja toda ou parcialmente `NULL`. Nesse caso, uma linha (tabela filho) contendo tal chave estrangeira pode ser inserida mesmo que não corresponda a nenhuma linha na tabela referenciada (pai).
- Uma restrição `FOREIGN KEY` que faz referência a uma chave não-`UNIQUE` não é SQL padrão, mas sim uma extensão `InnoDB` que agora está desatualizada, e deve ser habilitada pela definição de `restrict_fk_on_non_standard_key`.

  O motor de armazenamento `NDB` requer uma chave única explícita (ou chave primária) em qualquer coluna referenciada como uma chave estrangeira, de acordo com o padrão SQL.
- Para motores de armazenamento que não suportam chaves estrangeiras (como `MyISAM`), o MySQL Server analisa e ignora as especificações de chaves estrangeiras.
- O MySQL analisa, mas ignora as especificações em linha (conforme definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna.

  Definir uma coluna para usar uma cláusula `REFERENCES tbl_name(col_name)` não tem efeito real e *serve apenas como um memorando ou comentário para você que a coluna que você está definindo atualmente é destinado a referir-se a uma coluna em outra tabela*. É importante perceber ao usar esta sintaxe que:

  - O MySQL não executa nenhum tipo de verificação para se certificar de que `col_name` realmente existe em `tbl_name` (ou mesmo que `tbl_name` em si existe).
  - O MySQL não executa nenhum tipo de ação em `tbl_name` como excluir linhas em resposta a ações tomadas em linhas na tabela que você está definindo; em outras palavras, essa sintaxe não induz nenhum comportamento de `ON DELETE` ou `ON UPDATE` (embora você possa escrever uma cláusula de `ON DELETE` ou `ON UPDATE` como parte da cláusula de `REFERENCES`, ela também é ignorada).
  - Esta sintaxe cria uma coluna; não cria qualquer tipo de índice ou chave.

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
      ROW(NULL, 'polo', 'blue', @last),
      ROW(NULL, 'dress', 'white', @last),
      ROW(NULL, 't-shirt', 'blue', @last);

  INSERT INTO person VALUES (NULL, 'Lilliana Angelovska');

  SELECT @last := LAST_INSERT_ID();

  INSERT INTO shirt VALUES
      ROW(NULL, 'dress', 'orange', @last),
      ROW(NULL, 'polo', 'red', @last),
      ROW(NULL, 'dress', 'blue', @last),
      ROW(NULL, 't-shirt', 'white', @last);

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

  Quando usado desta forma, a cláusula `REFERENCES` não é exibida na saída de `SHOW CREATE TABLE` ou `DESCRIBE`:

  ```
  mysql> SHOW CREATE TABLE shirt\G
  *************************** 1. row ***************************
  Table: shirt
  Create Table: CREATE TABLE `shirt` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `style` enum('t-shirt','polo','dress') NOT NULL,
  `color` enum('red','blue','orange','white','black') NOT NULL,
  `owner` smallint(5) unsigned NOT NULL,
  PRIMARY KEY  (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ```

Para informações sobre restrições de chave estrangeira, ver Secção 15.1.20.5, "Restrições de chave estrangeira".
