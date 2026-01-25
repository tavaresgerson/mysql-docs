### 3.6.6 Usando Foreign Keys

O MySQL oferece suporte a *foreign keys*, que permitem referenciar dados relacionados entre tabelas, e a *foreign key constraints* (restrições de chave estrangeira), que ajudam a manter a consistência dos dados relacionados.

Um relacionamento de *foreign key* envolve uma *parent table* (tabela pai) que contém os valores iniciais da coluna, e uma *child table* (tabela filha) com valores de coluna que referenciam os valores da coluna pai. Uma *foreign key constraint* é definida na *child table*.

O exemplo a seguir relaciona as tabelas `parent` e `child` por meio de uma *foreign key* de coluna única e mostra como uma *foreign key constraint* impõe a integridade referencial.

Crie as tabelas *parent* e *child* usando as seguintes instruções SQL:

```sql
CREATE TABLE parent (
    id INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;


CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
) ENGINE=INNODB;
```

Insira uma linha na tabela *parent*, assim:

```sql
mysql> INSERT INTO parent (id) VALUES (1);
```

Verifique se os dados foram inseridos. Você pode fazer isso simplesmente selecionando todas as linhas da tabela `parent`, conforme mostrado aqui:

```sql
mysql> SELECT * FROM parent;
+----+
| id |
+----+
|  1 |
+----+
```

Insira uma linha na tabela *child* usando a seguinte instrução SQL:

```sql
mysql> INSERT INTO child (id,parent_id) VALUES (1,1);
```

A operação de inserção é bem-sucedida porque `parent_id` 1 está presente na tabela *parent*.

A inserção de uma linha na tabela *child* com um valor de `parent_id` que não está presente na tabela *parent* é rejeitada com um erro, como você pode ver aqui:

```sql
mysql> INSERT INTO child (id,parent_id) VALUES(2,2);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
(`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
REFERENCES `parent` (`id`))
```

A operação falha porque o valor de `parent_id` especificado não existe na tabela *parent*.

A tentativa de excluir a linha previamente inserida da tabela *parent* também falha, conforme mostrado aqui:

```sql
mysql> DELETE FROM parent WHERE id = 1;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
(`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
REFERENCES `parent` (`id`))
```

Esta operação falha porque o registro na tabela *child* contém o valor do id referenciado (`parent_id`).

Quando uma operação afeta um valor de *key* na tabela *parent* que possui linhas correspondentes na tabela *child*, o resultado depende da ação referencial especificada pelas subcláusulas `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. Omitir as cláusulas `ON DELETE` e `ON UPDATE` (como na definição atual da tabela *child*) é o mesmo que especificar a opção `RESTRICT`, que rejeita operações que afetam um valor de *key* na tabela *parent* que possui linhas correspondentes na tabela *parent*.

Para demonstrar as ações referenciais `ON DELETE` e `ON UPDATE`, elimine (DROP) a tabela *child* e recrie-a para incluir as subcláusulas `ON UPDATE` e `ON DELETE` com a opção `CASCADE`. A opção `CASCADE` automaticamente deleta ou atualiza as linhas correspondentes na tabela *child* ao deletar ou atualizar linhas na tabela *parent*.

```sql
DROP TABLE child;

CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=INNODB;
```

Insira algumas linhas na tabela *child* usando a instrução mostrada aqui:

```sql
mysql> INSERT INTO child (id,parent_id) VALUES(1,1),(2,1),(3,1);
```

Verifique se os dados foram inseridos, assim:

```sql
mysql> SELECT * FROM child;
+------+-----------+
| id   | parent_id |
+------+-----------+
|    1 |         1 |
|    2 |         1 |
|    3 |         1 |
+------+-----------+
```

Atualize o ID na tabela *parent*, alterando-o de 1 para 2, usando a instrução SQL mostrada aqui:

```sql
mysql> UPDATE parent SET id = 2 WHERE id = 1;
```

Verifique se o *update* foi bem-sucedido, selecionando todas as linhas da tabela *parent*, conforme mostrado aqui:

```sql
mysql> SELECT * FROM parent;
+----+
| id |
+----+
|  2 |
+----+
```

Verifique se a ação referencial `ON UPDATE CASCADE` atualizou a tabela *child*, assim:

```sql
mysql> SELECT * FROM child;
+------+-----------+
| id   | parent_id |
+------+-----------+
|    1 |         2 |
|    2 |         2 |
|    3 |         2 |
+------+-----------+
```

Para demonstrar a ação referencial `ON DELETE CASCADE`, delete registros da tabela *parent* onde `parent_id = 2`; isso deleta todos os registros na tabela *parent*.

```sql
mysql> DELETE FROM parent WHERE id = 2;
```

Como todos os registros na tabela *child* estão associados a `parent_id = 2`, a ação referencial `ON DELETE CASCADE` remove todos os registros da tabela *child*, conforme mostrado aqui:

```sql
mysql> SELECT * FROM child;
Empty set (0.00 sec)
```

Para obter mais informações sobre *foreign key constraints*, consulte [Seção 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").