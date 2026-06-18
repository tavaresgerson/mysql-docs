#### 15.7.7.28 Declaração de STATUS do procedimento de exibição

```
SHOW PROCEDURE STATUS
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração é uma extensão do MySQL. Ela retorna características de um procedimento armazenado, como o banco de dados, nome, tipo, criador, datas de criação e modificação e informações sobre o conjunto de caracteres. Uma declaração semelhante, `SHOW FUNCTION STATUS`, exibe informações sobre funções armazenadas (consulte a Seção 15.7.7.20, “Declaração SHOW FUNCTION STATUS”).

Para usar qualquer uma dessas declarações, você deve ser o usuário nomeado como a rotina `DEFINER`, ter o privilégio `SHOW_ROUTINE`, ter o privilégio `SELECT` no nível global ou ter os privilégios `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedidos em um escopo que inclua a rotina.

A cláusula `LIKE`, se presente, indica quais nomes de procedimentos ou funções devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

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

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando a rotina foi criada. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando a rotina foi criada. `Database Collation` é a collation do banco de dados com o qual a rotina está associada.

As informações de rotina armazenadas também estão disponíveis nas tabelas `INFORMATION_SCHEMA` `PARAMETERS` e `ROUTINES`. Consulte a Seção 28.3.20, “A Tabela INFORMATION\_SCHEMA PARAMETERS”, e a Seção 28.3.30, “A Tabela INFORMATION\_SCHEMA ROUTINES”.
