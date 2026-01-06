### 3.6.6 Uso de Chaves Estrangeiras

O MySQL suporta chaves estrangeiras, que permitem a referência cruzada de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter os dados relacionados consistentes.

Uma relação de chave estrangeira envolve uma tabela pai que contém os valores iniciais da coluna e uma tabela filho com valores de coluna que fazem referência aos valores da coluna pai. Uma restrição de chave estrangeira é definida na tabela filho.

O exemplo a seguir relaciona as tabelas `parent` e `child` por meio de uma chave estrangeira de uma única coluna e mostra como uma restrição de chave estrangeira garante a integridade referencial.

Crie as tabelas pai e filho usando as seguintes instruções SQL:

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

Insira uma linha na tabela pai, assim:

```sql
mysql> INSERT INTO parent (id) VALUES (1);
```

Verifique se os dados foram inseridos. Você pode fazer isso simplesmente selecionando todas as linhas de `parent`, como mostrado aqui:

```sql
mysql> SELECT * FROM parent;
+----+
| id |
+----+
|  1 |
+----+
```

Insira uma linha na tabela filha usando a seguinte instrução SQL:

```sql
mysql> INSERT INTO child (id,parent_id) VALUES (1,1);
```

A operação de inserção foi bem-sucedida porque `parent_id` 1 está presente na tabela pai.

A inserção de uma linha na tabela de filhos com um valor de `parent_id` que não está presente na tabela de pais é rejeitada com um erro, como você pode ver aqui:

```sql
mysql> INSERT INTO child (id,parent_id) VALUES(2,2);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
(`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
REFERENCES `parent` (`id`))
```

A operação falha porque o valor especificado `parent_id` não existe na tabela pai.

Tentar excluir a linha inserida anteriormente da tabela pai também falha, como mostrado aqui:

```sql
mysql> DELETE FROM parent WHERE id = 1;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
(`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
REFERENCES `parent` (`id`))
```

Esta operação falha porque o registro na tabela de filhos contém o valor do ID referenciado (`parent_id`).

Quando uma operação afeta um valor chave na tabela pai que tem linhas correspondentes na tabela filho, o resultado depende da ação referencial especificada pelas cláusulas `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. O omitindo as cláusulas `ON DELETE` e `ON UPDATE` (como na definição atual da tabela filho) é o mesmo que especificar a opção `RESTRICT`, que rejeita operações que afetam um valor chave na tabela pai que tem linhas correspondentes na tabela pai.

Para demonstrar as ações referenciais `ON DELETE` e `ON UPDATE`, exclua a tabela filha e crie-a novamente para incluir as cláusulas `ON UPDATE` e `ON DELETE` com a opção `CASCADE`. A opção `CASCADE` exclui ou atualiza automaticamente as linhas correspondentes na tabela filha ao excluir ou atualizar linhas na tabela pai.

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

Insira algumas linhas na tabela de filhos usando a declaração mostrada aqui:

```sql
mysql> INSERT INTO child (id,parent_id) VALUES(1,1),(2,1),(3,1);
```

Verifique se os dados foram inseridos, da seguinte forma:

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

Atualize o ID na tabela pai, alterando-o de 1 para 2, usando a instrução SQL mostrada aqui:

```sql
mysql> UPDATE parent SET id = 2 WHERE id = 1;
```

Verifique se a atualização foi bem-sucedida selecionando todas as linhas da tabela pai, conforme mostrado aqui:

```sql
mysql> SELECT * FROM parent;
+----+
| id |
+----+
|  2 |
+----+
```

Verifique se a ação de referência `ON UPDATE CASCADE` atualizou a tabela filha, da seguinte forma:

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

Para demonstrar a ação referencial `ON DELETE CASCADE`, exclua registros da tabela pai onde `parent_id = 2`; isso exclui todos os registros na tabela pai.

```sql
mysql> DELETE FROM parent WHERE id = 2;
```

Como todos os registros na tabela de filhos estão associados a `parent_id = 2`, a ação referencial `ON DELETE CASCADE` remove todos os registros da tabela de filhos, conforme mostrado aqui:

```sql
mysql> SELECT * FROM child;
Empty set (0.00 sec)
```

Para obter mais informações sobre restrições de chave estrangeira, consulte [Seção 13.1.18.5, “Restrições de Chave Estrangeira”](create-table-foreign-keys.html).
