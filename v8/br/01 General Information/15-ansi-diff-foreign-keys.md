#### 1.7.2.3 Diferenças nas Restrições de `FOREIGN KEY`

A implementação do MySQL das restrições de chave estrangeira difere do padrão SQL nos seguintes aspectos-chave:

* Se houver várias linhas na tabela pai com o mesmo valor da chave referenciada, o `InnoDB` realiza uma verificação de chave estrangeira como se as outras linhas pai com o mesmo valor de chave não existissem. Por exemplo, se você definir uma restrição de tipo `RESTRICT` e houver uma linha filha com várias linhas pai, o `InnoDB` não permite a exclusão de nenhuma das linhas pai. Isso é mostrado no exemplo a seguir:

```
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
* Se a cláusula `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` recorrer para atualizar a *mesma tabela* que ela já havia atualizado anteriormente durante a mesma casca, ela age como `RESTRICT`. Isso significa que você não pode usar operações `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` auto-referenciadas. Isso é para evitar loops infinitos resultantes de atualizações em cascata. Uma cláusula `ON DELETE SET NULL` auto-referenciada, por outro lado, é possível, assim como uma cláusula `ON DELETE CASCADE` auto-referenciada. As operações em cascata não podem ser aninhadas mais de 15 níveis de profundidade.
* Em uma instrução SQL que insere, exclui ou atualiza muitas linhas, as restrições de chave estrangeira (como restrições únicas) são verificadas linha por linha. Ao realizar verificações de chave estrangeira, o `InnoDB` define bloqueios compartilhados em nível de linha em registros filhos ou pais que ele deve examinar. O MySQL verifica as restrições de chave estrangeira imediatamente; a verificação não é adiada para o commit da transação. De acordo com o padrão SQL, o comportamento padrão deve ser a verificação adiada. Ou seja, as restrições são verificadas apenas após o *todo o comando SQL* ter sido processado. Isso significa que não é possível excluir uma linha que se refere a si mesma usando uma chave estrangeira.
* Nenhum motor de armazenamento, incluindo o `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada nas definições de restrições de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. A especificação do `MATCH` deve ser evitada.

A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com múltiplas colunas) são tratados ao serem comparados a uma chave primária na tabela referenciada. O MySQL implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja `NULL` total ou parcialmente. Nesse caso, uma linha (de uma tabela filha) que contenha tal chave estrangeira pode ser inserida, mesmo que não corresponda a nenhuma linha na tabela referenciada (pai). (É possível implementar outras semânticas usando gatilhos.)
* A restrição `FOREIGN KEY` que referencia uma chave não única não é padrão do SQL, mas sim uma extensão do `InnoDB` que agora está desatualizada e deve ser habilitada definindo `restrict_fk_on_non_standard_key`. Você deve esperar que o suporte para o uso de chaves não padrão seja removido em uma versão futura do MySQL e migrar para elas agora.

* O motor de armazenamento `NDB` requer uma chave explícita única (ou chave primária) em qualquer coluna referenciada como chave estrangeira, conforme o padrão SQL.
* Para motores de armazenamento que não suportam chaves estrangeiras (como `MyISAM`), o MySQL Server analisa e ignora as especificações de chave estrangeira.
* O MySQL analisa, mas ignora as especificações de `inline `REFERENCES` (como definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna. O MySQL aceita cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação separada de `FOREIGN KEY`.
* Definir uma coluna para usar a cláusula `REFERENCES tbl_name(col_name)` não tem efeito real e *serve apenas como uma nota ou comentário para você de que a coluna que você está atualmente definindo é destinada a referenciar uma coluna em outra tabela*. É importante perceber quando usar essa sintaxe que:

+ O MySQL não realiza nenhum tipo de verificação para garantir que *`col_name`* realmente exista em *`tbl_name`* (ou até mesmo que *`tbl_name`* em si exista).
+ O MySQL não realiza nenhuma ação em *`tbl_name`* como a exclusão de linhas em resposta às ações realizadas nas linhas da tabela que você está definindo; em outras palavras, essa sintaxe não induz nenhum comportamento `ON DELETE` ou `ON UPDATE`. (Embora você possa escrever uma cláusula `ON DELETE` ou `ON UPDATE` como parte da cláusula `REFERENCES`, ela também é ignorada.)
+ Essa sintaxe cria uma *coluna*; ela **não** cria nenhum tipo de índice ou chave.

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

Quando usada dessa maneira, a cláusula `REFERENCES` não é exibida na saída de `SHOW CREATE TABLE` ou `DESCRIBE`:

```sql
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