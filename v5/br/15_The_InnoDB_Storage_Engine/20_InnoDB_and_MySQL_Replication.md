## 14.20 InnoDB e Replicação do MySQL

É possível usar a replicação de uma maneira em que o motor de armazenamento na replica não é o mesmo que o motor de armazenamento na fonte. Por exemplo, você pode replicar modificações em uma tabela `InnoDB` na fonte para uma tabela `MyISAM` na replica. Para mais informações, consulte a Seção 16.3.3, “Usando replicação com diferentes motores de armazenamento de fonte e replica”.

Para obter informações sobre a configuração de uma replica, consulte a Seção 16.1.2.5, “Configurando Replicas”, e a Seção 16.1.2.4, “Escolhendo um Método para Instantâneos de Dados”. Para criar uma nova replica sem desativar a fonte ou uma replica existente, use o produto MySQL Enterprise Backup.

As transações que falham na fonte não afetam a replicação. A replicação do MySQL é baseada no log binário, onde o MySQL escreve declarações SQL que modificam os dados. Uma transação que falha (por exemplo, devido a uma violação de chave estrangeira ou porque é revertida) não é escrita no log binário, portanto, não é enviada para as réplicas. Veja a Seção 13.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”.

**Replicação e CASCADE.** Ações em cascata para as tabelas `InnoDB` na fonte são executadas na réplica *apenas* se as tabelas que compartilham a relação de chave estrangeira usam `InnoDB` tanto na fonte quanto na réplica. Isso é verdade, independentemente de você estar usando replicação baseada em declaração ou baseada em string. Suponha que você tenha iniciado a replicação e, em seguida, crie duas tabelas na fonte, onde `InnoDB` é definido como o motor de armazenamento padrão, usando as seguintes declarações `CREATE TABLE`:

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

Se a réplica tiver `MyISAM` definido como o motor de armazenamento padrão, as mesmas tabelas são criadas na réplica, mas elas usam o motor de armazenamento `MyISAM`, e a opção `FOREIGN KEY` é ignorada. Agora, inserimos algumas strings nas tabelas na fonte:

```sql
source> INSERT INTO fc1 VALUES (1, 1), (2, 2);
Query OK, 2 rows affected (0.09 sec)
Records: 2  Duplicates: 0  Warnings: 0

source> INSERT INTO fc2 VALUES (1, 1), (2, 2), (3, 1);
Query OK, 3 rows affected (0.19 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

Neste ponto, tanto na fonte quanto na réplica, a tabela `fc1` contém 2 strings, e a tabela `fc2` contém 3 strings, conforme mostrado aqui:

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

Agora, suponha que você execute a seguinte declaração `DELETE` na fonte:

```sql
source> DELETE FROM fc1 WHERE i=1;
Query OK, 1 row affected (0.09 sec)
```

Devido à cascata, a tabela `fc2` na fonte agora contém apenas 1 string:

```sql
source> SELECT * FROM fc2;
+---+---+
| m | n |
+---+---+
| 2 | 2 |
+---+---+
1 row in set (0.00 sec)
```

No entanto, a cascata não se propaga na replica porque, na replica, o `DELETE` para `fc1` não exclui nenhuma string de `fc2`. A cópia da replica de `fc2` ainda contém todas as strings que foram originalmente inseridas:

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

Essa diferença se deve ao fato de que as apagamentos em cascata são tratados internamente pelo mecanismo de armazenamento `InnoDB`, o que significa que nenhuma das alterações é registrada.