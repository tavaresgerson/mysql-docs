## 17.19 InnoDB e replicação do MySQL

É possível usar a replicação de uma maneira em que o mecanismo de armazenamento na replica não seja o mesmo que o do banco de dados de origem. Por exemplo, você pode replicar as modificações de uma tabela `InnoDB` no banco de dados de origem para uma tabela `MyISAM` na replica. Para obter mais informações, consulte a Seção 19.4.4, “Usando a Replicação com Diferentes Mecanismos de Armazenamento de Banco de Dados de Origem e Replicação”.

Para obter informações sobre a configuração de uma replica, consulte a Seção 19.1.2.6, “Configurando Replicas”, e a Seção 19.1.2.5, “Escolhendo um Método para Instantâneos de Dados”. Para criar uma nova replica sem interromper a fonte ou uma replica existente, use o produto MySQL Enterprise Backup.

As transações que falham na fonte não afetam a replicação. A replicação do MySQL é baseada no log binário, onde o MySQL escreve instruções SQL que modificam os dados. Uma transação que falha (por exemplo, devido a uma violação de chave estrangeira ou porque é revertida) não é escrita no log binário, portanto, não é enviada para as réplicas. Veja a Seção 15.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”.

**Replicação e CASCADE.** As ações em cascata para as tabelas `InnoDB` na fonte são executadas na replica *apenas* se as tabelas que compartilham a relação de chave estrangeira usarem `InnoDB` tanto na fonte quanto na replica. Isso é verdadeiro, independentemente de você estar usando replicação baseada em declarações ou baseada em linhas. Suponha que você tenha iniciado a replicação e, em seguida, crie duas tabelas na fonte, onde `InnoDB` é definido como o motor de armazenamento padrão, usando as seguintes declarações `CREATE TABLE`:

```
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

Se a réplica tiver `MyISAM` definido como o motor de armazenamento padrão, as mesmas tabelas serão criadas na réplica, mas elas usarão o motor de armazenamento `MyISAM`, e a opção `FOREIGN KEY` será ignorada. Agora, vamos inserir algumas linhas nas tabelas na fonte:

```
source> INSERT INTO fc1 VALUES (1, 1), (2, 2);
Query OK, 2 rows affected (0.09 sec)
Records: 2  Duplicates: 0  Warnings: 0

source> INSERT INTO fc2 VALUES (1, 1), (2, 2), (3, 1);
Query OK, 3 rows affected (0.19 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

Neste ponto, tanto na fonte quanto na réplica, a tabela `fc1` contém 2 linhas e a tabela `fc2` contém 3 linhas, conforme mostrado aqui:

```
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

```
source> DELETE FROM fc1 WHERE i=1;
Query OK, 1 row affected (0.09 sec)
```

Devido à cascata, a tabela `fc2` na fonte agora contém apenas 1 linha:

```
source> SELECT * FROM fc2;
+---+---+
| m | n |
+---+---+
| 2 | 2 |
+---+---+
1 row in set (0.00 sec)
```

No entanto, a cascata não se propaga na replica porque, na replica, o `DELETE` para `fc1` não exclui nenhuma linha de `fc2`. A cópia da replica de `fc2` ainda contém todas as linhas que foram originalmente inseridas:

```
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

Essa diferença ocorre porque as exclusões em cascata são gerenciadas internamente pelo motor de armazenamento `InnoDB`, o que significa que nenhuma das alterações é registrada.
