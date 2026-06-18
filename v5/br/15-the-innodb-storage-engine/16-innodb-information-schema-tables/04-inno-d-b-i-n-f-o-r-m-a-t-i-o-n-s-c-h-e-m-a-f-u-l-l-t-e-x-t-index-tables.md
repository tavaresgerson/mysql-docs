### 14.16.4 Tabelas de FULLTEXT Index do InnoDB no INFORMATION_SCHEMA

As seguintes tabelas fornecem metadados para os Index `FULLTEXT`:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_FT%';
+-------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_FT%) |
+-------------------------------------------+
| INNODB_FT_CONFIG                          |
| INNODB_FT_BEING_DELETED                   |
| INNODB_FT_DELETED                         |
| INNODB_FT_DEFAULT_STOPWORD                |
| INNODB_FT_INDEX_TABLE                     |
| INNODB_FT_INDEX_CACHE                     |
+-------------------------------------------+
```

#### Visão Geral da Tabela

* `INNODB_FT_CONFIG`: Fornece metadados sobre o Index `FULLTEXT` e o processamento associado para uma tabela `InnoDB`.

* `INNODB_FT_BEING_DELETED`: Fornece um snapshot da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção `OPTIMIZE TABLE`. Quando `OPTIMIZE TABLE` é executado, a tabela `INNODB_FT_BEING_DELETED` é esvaziada, e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Devido ao fato de o conteúdo de `INNODB_FT_BEING_DELETED` tipicamente ter uma curta vida útil, esta tabela tem utilidade limitada para monitoramento ou debugging. Para obter informações sobre a execução de `OPTIMIZE TABLE` em tabelas com Index `FULLTEXT`, consulte a Seção 12.9.6, “Ajuste Fino da Pesquisa Full-Text do MySQL”.

* `INNODB_FT_DELETED`: Armazena linhas que são excluídas do Index `FULLTEXT` para uma tabela `InnoDB`. Para evitar reorganização de Index custosa durante operações DML para um Index `FULLTEXT` do `InnoDB`, as informações sobre palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de busca ao realizar uma pesquisa de texto, e removidas do Index de busca principal somente quando você emite uma instrução `OPTIMIZE TABLE` para a tabela `InnoDB`.

* `INNODB_FT_DEFAULT_STOPWORD`: Contém uma lista de stopwords (palavras de parada) que são usadas por padrão ao criar um Index `FULLTEXT` em tabelas `InnoDB`.

  Para obter informações sobre a tabela `INNODB_FT_DEFAULT_STOPWORD`, consulte a Seção 12.9.4, “Full-Text Stopwords”.

* `INNODB_FT_INDEX_TABLE`: Fornece informações sobre o Index invertido usado para processar buscas de texto contra o Index `FULLTEXT` de uma tabela `InnoDB`.

* `INNODB_FT_INDEX_CACHE`: Fornece informações de token sobre linhas recém-inseridas em um Index `FULLTEXT`. Para evitar reorganização de Index custosa durante operações DML, a informação sobre palavras recém-indexadas é armazenada separadamente, e combinada com o Index de busca principal somente quando `OPTIMIZE TABLE` é executado, quando o servidor é desligado (shut down), ou quando o tamanho do cache excede um limite definido pelas variáveis de sistema `innodb_ft_cache_size` ou `innodb_ft_total_cache_size`.

Nota

Com exceção da tabela `INNODB_FT_DEFAULT_STOPWORD`, estas tabelas estão vazias inicialmente. Antes de consultar qualquer uma delas, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do Database) da tabela que contém o Index `FULLTEXT` (por exemplo, `test/articles`).

**Exemplo 14.5 Tabelas INFORMATION_SCHEMA de FULLTEXT Index do InnoDB**

Este exemplo usa uma tabela com um Index `FULLTEXT` para demonstrar os dados contidos nas tabelas `INFORMATION_SCHEMA` do Index `FULLTEXT`.

1. Crie uma tabela com um Index `FULLTEXT` e insira alguns dados:

   ```sql
   mysql> CREATE TABLE articles (
            id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
            title VARCHAR(200),
            body TEXT,
            FULLTEXT (title,body)
          ) ENGINE=InnoDB;

   mysql> INSERT INTO articles (title,body) VALUES
          ('MySQL Tutorial','DBMS stands for DataBase ...'),
          ('How To Use MySQL Well','After you went through a ...'),
          ('Optimizing MySQL','In this tutorial we show ...'),
          ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
          ('MySQL vs. YourSQL','In the following database comparison ...'),
          ('MySQL Security','When configured properly, MySQL ...');
   ```

2. Defina a variável `innodb_ft_aux_table` para o nome da tabela com o Index `FULLTEXT`. Se esta variável não for definida, as tabelas `INFORMATION_SCHEMA` de `FULLTEXT` do `InnoDB` estarão vazias, com exceção de `INNODB_FT_DEFAULT_STOPWORD`.

   ```sql
   SET GLOBAL innodb_ft_aux_table = 'test/articles';
   ```

3. Consulte a tabela `INNODB_FT_INDEX_CACHE`, que mostra informações sobre linhas recém-inseridas em um Index `FULLTEXT`. Para evitar reorganização de Index custosa durante operações DML, os dados para linhas recém-inseridas permanecem no cache do Index `FULLTEXT` até que `OPTIMIZE TABLE` seja executado (ou até que o servidor seja desligado ou os limites do cache sejam excedidos).

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

4. Habilite a variável de sistema `innodb_optimize_fulltext_only` e execute `OPTIMIZE TABLE` na tabela que contém o Index `FULLTEXT`. Esta operação despeja (flushes) o conteúdo do cache do Index `FULLTEXT` para o Index `FULLTEXT` principal. `innodb_optimize_fulltext_only` altera a maneira como a instrução `OPTIMIZE TABLE` opera em tabelas `InnoDB`, e destina-se a ser habilitada temporariamente, durante operações de manutenção em tabelas `InnoDB` com Index `FULLTEXT`.

   ```sql
   mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

5. Consulte a tabela `INNODB_FT_INDEX_TABLE` para visualizar informações sobre os dados no Index `FULLTEXT` principal, incluindo informações sobre os dados que acabaram de ser despejados do cache do Index `FULLTEXT`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

   A tabela `INNODB_FT_INDEX_CACHE` agora está vazia, uma vez que a operação `OPTIMIZE TABLE` despejou o cache do Index `FULLTEXT`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   Empty set (0.00 sec)
   ```

6. Exclua alguns registros da tabela `test/articles`.

   ```sql
   mysql> DELETE FROM test.articles WHERE id < 4;
   ```

7. Consulte a tabela `INNODB_FT_DELETED`. Esta tabela registra linhas que são excluídas do Index `FULLTEXT`. Para evitar reorganização de Index custosa durante operações DML, a informação sobre registros recém-excluídos é armazenada separadamente, filtrada dos resultados de busca ao realizar uma pesquisa de texto, e removida do Index de busca principal quando você executa `OPTIMIZE TABLE`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   +--------+
   | DOC_ID |
   +--------+
   |      2 |
   |      3 |
   |      4 |
   +--------+
   ```

8. Execute `OPTIMIZE TABLE` para remover os registros excluídos.

   ```sql
   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

   A tabela `INNODB_FT_DELETED` deve agora estar vazia.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   Empty set (0.00 sec)
   ```

9. Consulte a tabela `INNODB_FT_CONFIG`. Esta tabela contém metadados sobre o Index `FULLTEXT` e o processamento relacionado:

   * `optimize_checkpoint_limit`: O número de segundos após o qual uma execução de `OPTIMIZE TABLE` para.

   * `synced_doc_id`: O próximo `DOC_ID` a ser emitido.

   * `stopword_table_name`: O nome *`database/table`* para uma tabela de stopword (palavras de parada) definida pelo usuário. A coluna `VALUE` fica vazia se não houver uma tabela de stopword definida pelo usuário.

   * `use_stopword`: Indica se uma tabela de stopword é usada, o que é definido quando o Index `FULLTEXT` é criado.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
   +---------------------------+-------+
   | KEY                       | VALUE |
   +---------------------------+-------+
   | optimize_checkpoint_limit | 180   |
   | synced_doc_id             | 8     |
   | stopword_table_name       |       |
   | use_stopword              | 1     |
   +---------------------------+-------+
   ```

10. Desabilite `innodb_optimize_fulltext_only`, já que ela se destina a ser habilitada apenas temporariamente:

    ```sql
    mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
    ```
