#### 15.7.7.31 Declaração de STATUS do procedimento

```
SHOW PROCEDURE STATUS
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração é uma extensão do MySQL. Ela retorna características de um procedimento armazenado, como a base de dados, nome, tipo, criador, datas de criação e modificação e informações sobre o conjunto de caracteres. Uma declaração semelhante, `SHOW FUNCTION STATUS`, exibe informações sobre funções armazenadas (consulte a Seção 15.7.7.22, “Declaração SHOW FUNCTION STATUS”).

Para usar qualquer uma dessas declarações, você deve ser o usuário nomeado como a rotina `DEFINER`, ter o privilégio `SHOW_ROUTINE`, ter o privilégio `SELECT` no nível global ou ter o privilégio `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedido em um escopo que inclua a rotina.

A cláusula `LIKE`, se presente, indica quais nomes de procedimentos ou funções devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

```
mysql> SHOW PROCEDURE STATUS LIKE 'sp1'\G
*************************** 1. row ***************************
                  Db: test
                Name: sp1
                Type: PROCEDURE
             Definer: testuser@localhost
            Modified: 2018-08-08 13:54:11
             Created: 2018-08-08 13:54:11
       Security_type: DEFINER
             Comment:
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci

mysql> SHOW FUNCTION STATUS LIKE 'hello'\G
*************************** 1. row ***************************
                  Db: test
                Name: hello
                Type: FUNCTION
             Definer: testuser@localhost
            Modified: 2020-03-10 11:10:03
             Created: 2020-03-10 11:10:03
       Security_type: DEFINER
             Comment:
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

`character_set_client` é o valor de sessão da variável de sistema `character_set_client` quando a rotina foi criada. `collation_connection` é o valor de sessão da variável de sistema `collation_connection` quando a rotina foi criada. `Database Collation` é a collation da base de dados com a qual a rotina está associada.

As informações sobre rotinas armazenadas também estão disponíveis nas tabelas `PARAMETERS` e `ROUTINES` do `INFORMATION_SCHEMA`. Consulte a Seção 28.3.25, “A Tabela INFORMATION\_SCHEMA PARAMETERS”, e a Seção 28.3.36, “A Tabela INFORMATION\_SCHEMA ROUTINES”.