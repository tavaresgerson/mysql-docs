### 17.15.4 Tabelas de Índices FULLTEXT do Schema de Informações InnoDB

As tabelas a seguir fornecem metadados para os índices `FULLTEXT`:

```
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

* `INNODB_FT_CONFIG`: Fornece metadados sobre o índice `FULLTEXT` e o processamento associado a uma tabela `InnoDB`.

* `INNODB_FT_BEING_DELETED`: Fornece um instantâneo da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção `OPTIMIZE TABLE`. Quando a `OPTIMIZE TABLE` é executada, a tabela `INNODB_FT_BEING_DELETED` é esvaziada e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo de `INNODB_FT_BEING_DELETED` geralmente tem uma vida útil curta, essa tabela tem utilidade limitada para monitoramento ou depuração. Para obter informações sobre como executar a `OPTIMIZE TABLE` em tabelas com índices `FULLTEXT`, consulte a Seção 14.9.6, “Ajuste fino da pesquisa full-text do MySQL”.

* `INNODB_FT_DELETED`: Armazena linhas que são excluídas do índice `FULLTEXT` para uma tabela `InnoDB`. Para evitar a reorganização do índice cara durante operações DML para um índice `FULLTEXT` `InnoDB`, as informações sobre as palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de pesquisa ao realizar uma pesquisa de texto e removidas do índice de pesquisa principal apenas quando uma declaração `OPTIMIZE TABLE` é emitida para a tabela `InnoDB`.

* `INNODB_FT_DEFAULT_STOPWORD`: Armazena uma lista de palavras-stop que são usadas por padrão ao criar um índice `FULLTEXT` em tabelas `InnoDB`.

Para obter informações sobre a tabela `INNODB_FT_DEFAULT_STOPWORD`, consulte a Seção 14.9.4, “Palavras-stop full-text”.

* `INNODB_FT_INDEX_TABLE`: Fornece informações sobre o índice invertido usado para processar pesquisas de texto contra o índice `FULLTEXT` de uma tabela `InnoDB`.

* `INNODB_FT_INDEX_CACHE`: Fornece informações sobre tokens de novas linhas inseridas em um índice `FULLTEXT`. Para evitar a reorganização do índice de alto custo durante operações DML, as informações sobre as palavras recém-indexadas são armazenadas separadamente e combinadas com o índice de busca principal apenas quando a instrução `OPTIMIZE TABLE` é executada, quando o servidor é desligado ou quando o tamanho do cache excede um limite definido pela variável de sistema `innodb_ft_cache_size` ou `innodb_ft_total_cache_size`.

Nota

Com exceção da tabela `INNODB_FT_DEFAULT_STOPWORD`, essas tabelas estão vazias inicialmente. Antes de fazer qualquer consulta a elas, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`).

**Exemplo 17.5 Tabelas do esquema `INFORMATION_SCHEMA` de índice `FULLTEXT` InnoDB**

Este exemplo usa uma tabela com um índice `FULLTEXT` para demonstrar os dados contidos nas tabelas do esquema `INFORMATION_SCHEMA` do `FULLTEXT`.

1. Crie uma tabela com um índice `FULLTEXT` e insira alguns dados:

   ```
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

2. Defina a variável `innodb_ft_aux_table` para o nome da tabela com o índice `FULLTEXT`. Se essa variável não for definida, as tabelas do esquema `INFORMATION_SCHEMA` do `FULLTEXT` do `InnoDB` ficarão vazias, com exceção de `INNODB_FT_DEFAULT_STOPWORD`.

   ```
   mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';
   ```

3. Faça uma consulta à tabela `INNODB_FT_INDEX_CACHE`, que mostra informações sobre linhas inseridas recentemente em um índice `FULLTEXT`. Para evitar a reorganização do índice de alto custo durante operações DML, os dados de linhas recém-inseridas permanecem no cache do índice `FULLTEXT` até que a instrução `OPTIMIZE TABLE` seja executada (ou até que o servidor seja desligado ou os limites do cache sejam excedidos).

   ```
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

4. Ative a variável de sistema `innodb_optimize_fulltext_only` e execute `OPTIMIZE TABLE` na tabela que contém o índice `FULLTEXT`. Essa operação esvazia o conteúdo do cache do índice `FULLTEXT` para o índice `FULLTEXT` principal. `innodb_optimize_fulltext_only` altera a maneira como a instrução `OPTIMIZE TABLE` opera em tabelas `InnoDB` e é destinada a ser habilitada temporariamente durante operações de manutenção em tabelas `InnoDB` com índices `FULLTEXT`.

```
   mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

5. Execute uma consulta na tabela `INNODB_FT_INDEX_TABLE` para visualizar informações sobre os dados no índice `FULLTEXT` principal, incluindo informações sobre os dados que foram recentemente esvaziados do cache do índice `FULLTEXT`.

```
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

A tabela `INNODB_FT_INDEX_CACHE` agora está vazia, uma vez que a operação `OPTIMIZE TABLE` esvaziou o cache do índice `FULLTEXT`.

```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   Empty set (0.00 sec)
   ```

6. Exclua alguns registros da tabela `test/articles`.

```
   mysql> DELETE FROM test.articles WHERE id < 4;
   ```

7. Execute uma consulta na tabela `INNODB_FT_DELETED`. Essa tabela registra linhas que são excluídas do índice `FULLTEXT`. Para evitar a reorganização do índice que é cara durante operações DML, as informações sobre os registros excluídos recentemente são armazenadas separadamente, filtradas dos resultados de pesquisa ao realizar uma pesquisa de texto e removidas do índice de pesquisa principal ao executar `OPTIMIZE TABLE`.

```
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

```
   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

A tabela `INNODB_FT_DELETED` agora deve estar vazia.

```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   Empty set (0.00 sec)
   ```

9. Execute uma consulta na tabela `INNODB_FT_CONFIG`. Essa tabela contém metadados sobre o índice `FULLTEXT` e o processamento relacionado:

* `optimize_checkpoint_limit`: O número de segundos após o qual uma execução de `OPTIMIZE TABLE` para.

* `synced_doc_id`: O próximo `DOC_ID` a ser emitido.

* `stopword_table_name`: O nome do *`banco de dados/tabela`* para uma tabela de palavras-chave definida pelo usuário. A coluna `VALUE` está vazia se não houver uma tabela de palavras-chave definida pelo usuário.

* `use_stopword`: Indica se uma tabela de palavras-chave é usada, o que é definido quando o índice `FULLTEXT` é criado.

```
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

10. Desative `innodb_optimize_fulltext_only`, pois é destinado a ser habilitado apenas temporariamente:

    ```
    mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
    ```