#### 13.7.5.28 Mostrar o status do procedimento Declaração

```sql
SHOW PROCEDURE STATUS
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração é uma extensão do MySQL. Ela retorna características de um procedimento armazenado, como o banco de dados, nome, tipo, criador, datas de criação e modificação e informações sobre o conjunto de caracteres. Uma declaração semelhante, `SHOW FUNCTION STATUS`, exibe informações sobre funções armazenadas (consulte Seção 13.7.5.20, “Declaração SHOW FUNCTION STATUS”).

Para usar qualquer uma dessas declarações, você deve ser o proprietário da rotina ou ter acesso ao `mysql.proc` tabela com `SELECT` (select.html).

A cláusula `LIKE`, se presente, indica quais nomes de procedimentos ou funções devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

```sql
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
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci

mysql> SHOW FUNCTION STATUS LIKE 'hello'\G
*************************** 1. row ***************************
                  Db: test
                Name: hello
                Type: FUNCTION
             Definer: testuser@localhost
            Modified: 2020-03-10 11:09:33
             Created: 2020-03-10 11:09:33
       Security_type: DEFINER
             Comment:
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando a rotina foi criada. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando a rotina foi criada. `Database Collation` é a collation do banco de dados com o qual a rotina está associada.

As informações de rotina armazenadas também estão disponíveis nas tabelas `INFORMATION_SCHEMA `PARAMETERS` e [`ROUTINES\`]\(information-schema-routines-table.html). Veja Seção 24.3.15, “A Tabela INFORMATION_SCHEMA PARAMETERS” e Seção 24.3.21, “A Tabela INFORMATION_SCHEMA ROUTINES”.
