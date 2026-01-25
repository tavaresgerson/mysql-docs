## 14.20 InnoDB e Replicação MySQL

É possível usar a Replication de forma que o Storage Engine na Replica não seja o mesmo que o Storage Engine no Source. Por exemplo, você pode replicar modificações em uma tabela `InnoDB` no Source para uma tabela `MyISAM` na Replica. Para mais informações, consulte a Seção 16.3.3, “Using Replication with Different Source and Replica Storage Engines”.

Para obter informações sobre como configurar uma Replica, consulte a Seção 16.1.2.5, “Setting Up Replicas”, e a Seção 16.1.2.4, “Choosing a Method for Data Snapshots”. Para criar uma nova Replica sem desativar o Source ou uma Replica existente, use o produto MySQL Enterprise Backup.

Transactions que falham no Source não afetam a Replication. A Replication do MySQL é baseada no Binary Log, onde o MySQL escreve as instruções SQL que modificam dados. Uma Transaction que falha (por exemplo, devido a uma violação de Foreign Key, ou porque é rolled back) não é escrita no Binary Log, portanto, não é enviada para as Replicas. Consulte a Seção 13.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”.

**Replication e CASCADE.** Ações de cascading para tabelas `InnoDB` no Source são executadas na Replica *apenas* se as tabelas que compartilham a relação de Foreign Key usarem `InnoDB` tanto no Source quanto na Replica. Isso é verdade, esteja você usando Replication baseada em statement ou baseada em row. Suponha que você tenha iniciado a Replication e, em seguida, crie duas tabelas no Source, onde `InnoDB` é definido como o Storage Engine padrão, usando as seguintes instruções `CREATE TABLE`:

```sql
CREATE TABLE fc1 (
    i INT PRIMARY KEY,
    j INT
);

CREATE TABLE fc2 (
    m INT PRIMARY KEY,
    n INT,
    FOREIGN KEY ni (n) REFERENCES fc1 (i)
        ON DELETE CASCADE
);
```

Se a Replica tiver `MyISAM` definido como o Storage Engine padrão, as mesmas tabelas serão criadas na Replica, mas elas usarão o Storage Engine `MyISAM`, e a opção `FOREIGN KEY` será ignorada. Agora, inserimos algumas rows nas tabelas no Source:

```sql
source> INSERT INTO fc1 VALUES (1, 1), (2, 2);
Query OK, 2 rows affected (0.09 sec)
Records: 2  Duplicates: 0  Warnings: 0

source> INSERT INTO fc2 VALUES (1, 1), (2, 2), (3, 1);
Query OK, 3 rows affected (0.19 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

Neste ponto, tanto no Source quanto na Replica, a tabela `fc1` contém 2 rows, e a tabela `fc2` contém 3 rows, conforme mostrado aqui:

```sql
source> SELECT * FROM fc1;
+---+------+
| i | j    |
+---+------+
| 1 |    1 |
| 2 |    2 |
+---+------+
2 rows in set (0.00 sec)

source> SELECT * FROM fc2;
+---+------+
| m | n    |
+---+------+
| 1 |    1 |
| 2 |    2 |
| 3 |    1 |
+---+------+
3 rows in set (0.00 sec)

replica> SELECT * FROM fc1;
+---+------+
| i | j    |
+---+------+
| 1 |    1 |
| 2 |    2 |
+---+------+
2 rows in set (0.00 sec)

replica> SELECT * FROM fc2;
+---+------+
| m | n    |
+---+------+
| 1 |    1 |
| 2 |    2 |
| 3 |    1 |
+---+------+
3 rows in set (0.00 sec)
```

Agora, suponha que você execute a seguinte instrução `DELETE` no Source:

```sql
source> DELETE FROM fc1 WHERE i=1;
Query OK, 1 row affected (0.09 sec)
```

Devido ao cascade, a tabela `fc2` no Source agora contém apenas 1 row:

```sql
source> SELECT * FROM fc2;
+---+---+
| m | n |
+---+---+
| 2 | 2 |
+---+---+
1 row in set (0.00 sec)
```

No entanto, o cascade não se propaga na Replica porque na Replica o `DELETE` para `fc1` não exclui nenhuma row de `fc2`. A cópia de `fc2` da Replica ainda contém todas as rows que foram inseridas originalmente:

```sql
replica> SELECT * FROM fc2;
+---+---+
| m | n |
+---+---+
| 1 | 1 |
| 3 | 1 |
| 2 | 2 |
+---+---+
3 rows in set (0.00 sec)
```

Essa diferença se deve ao fato de que as exclusões em cascade (cascading deletes) são tratadas internamente pelo Storage Engine `InnoDB`, o que significa que nenhuma das alterações é logada.