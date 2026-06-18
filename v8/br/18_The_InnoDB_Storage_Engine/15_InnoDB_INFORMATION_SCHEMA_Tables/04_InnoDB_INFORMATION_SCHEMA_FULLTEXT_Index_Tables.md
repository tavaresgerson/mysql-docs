### 17.15.4 Tabelas de índice FULLTEXT do esquema de informações InnoDB

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

#### Resumo da tabela

- `INNODB_FT_CONFIG`: Fornece metadados sobre o índice `FULLTEXT` e o processamento associado a uma tabela `InnoDB`.

- `INNODB_FT_BEING_DELETED`: Fornece uma captura de tela da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção `OPTIMIZE TABLE`. Quando o `OPTIMIZE TABLE` é executado, a tabela `INNODB_FT_BEING_DELETED` é esvaziada e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo de `INNODB_FT_BEING_DELETED` geralmente tem uma vida útil curta, essa tabela tem utilidade limitada para monitoramento ou depuração. Para obter informações sobre como executar o `OPTIMIZE TABLE` em tabelas com índices `FULLTEXT`, consulte a Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

- `INNODB_FT_DELETED`: Armazena linhas que são excluídas do índice `FULLTEXT` para uma tabela `InnoDB`. Para evitar a reorganização cara do índice durante operações de DML para um índice `InnoDB` `FULLTEXT`, as informações sobre as palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal apenas quando você emite uma declaração `OPTIMIZE TABLE` para a tabela `InnoDB`.

- `INNODB_FT_DEFAULT_STOPWORD`: Mantém uma lista de palavras-chave que são usadas por padrão ao criar um índice `FULLTEXT` em tabelas `InnoDB`.

  Para obter informações sobre a tabela `INNODB_FT_DEFAULT_STOPWORD`, consulte a Seção 14.9.4, “Stopwords de Texto Completo”.

- `INNODB_FT_INDEX_TABLE`: Fornece informações sobre o índice invertido usado para processar pesquisas de texto contra o índice `FULLTEXT` de uma tabela `InnoDB`.

- `INNODB_FT_INDEX_CACHE`: Fornece informações sobre tokens sobre as linhas recém-inseridas em um índice `FULLTEXT`. Para evitar a reorganização cara do índice durante operações de DML, as informações sobre as palavras recém-indexadas são armazenadas separadamente e combinadas com o índice de pesquisa principal apenas quando o `OPTIMIZE TABLE` é executado, quando o servidor é desligado ou quando o tamanho do cache excede um limite definido pela variável de sistema `innodb_ft_cache_size` ou `innodb_ft_total_cache_size`.

Nota

Com exceção da tabela `INNODB_FT_DEFAULT_STOPWORD`, essas tabelas estão inicialmente vazias. Antes de fazer qualquer consulta a qualquer uma delas, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`).

**Exemplo 17.5: Tabelas do esquema de informações do InnoDB com índice FULLTEXT**

Este exemplo usa uma tabela com um índice `FULLTEXT` para demonstrar os dados contidos nas tabelas `FULLTEXT` e `INFORMATION_SCHEMA`.

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

2. Defina a variável `innodb_ft_aux_table` com o nome da tabela com o índice `FULLTEXT`. Se essa variável não for definida, as tabelas `InnoDB`, `FULLTEXT` e `INFORMATION_SCHEMA` ficarão vazias, com exceção de `INNODB_FT_DEFAULT_STOPWORD`.

   ```
   mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';
   ```

3. Consulte a tabela `INNODB_FT_INDEX_CACHE`, que exibe informações sobre as linhas recém-inseridas em um índice `FULLTEXT`. Para evitar a reorganização cara do índice durante operações de DML, os dados das linhas recém-inseridas permanecem no cache do índice `FULLTEXT` até que o `OPTIMIZE TABLE` seja executado (ou até que o servidor seja desligado ou os limites de cache sejam excedidos).

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

4. Ative a variável de sistema `innodb_optimize_fulltext_only` e execute `OPTIMIZE TABLE` na tabela que contém o índice `FULLTEXT`. Essa operação esvazia o conteúdo do cache do índice `FULLTEXT` para o índice principal `FULLTEXT`. `innodb_optimize_fulltext_only` altera a maneira como a instrução `OPTIMIZE TABLE` opera nas tabelas `InnoDB`, e é destinado a ser ativado temporariamente, durante operações de manutenção nas tabelas `InnoDB` com índices `FULLTEXT`.

   ```
   mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

5. Consulte a tabela `INNODB_FT_INDEX_TABLE` para visualizar informações sobre os dados no índice principal `FULLTEXT`, incluindo informações sobre os dados que foram recentemente descartados do cache de índice `FULLTEXT`.

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

   A tabela `INNODB_FT_INDEX_CACHE` está agora vazia, uma vez que a operação `OPTIMIZE TABLE` esvaziou o cache de índice `FULLTEXT`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   Empty set (0.00 sec)
   ```

6. Exclua alguns registros da tabela `test/articles`.

   ```
   mysql> DELETE FROM test.articles WHERE id < 4;
   ```

7. Consulte a tabela `INNODB_FT_DELETED`. Esta tabela registra linhas que são excluídas do índice `FULLTEXT`. Para evitar a reorganização cara do índice durante operações de DML, as informações sobre os registros recém-excluídos são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal quando você executa `OPTIMIZE TABLE`.

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

   A tabela `INNODB_FT_DELETED` deve estar agora vazia.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   Empty set (0.00 sec)
   ```

9. Consulte a tabela `INNODB_FT_CONFIG`. Esta tabela contém metadados sobre o índice `FULLTEXT` e o processamento relacionado:

   - `optimize_checkpoint_limit`: O número de segundos após o qual uma execução de `OPTIMIZE TABLE` é interrompida.

   - `synced_doc_id`: O próximo `DOC_ID` a ser emitido.

   - `stopword_table_name`: O nome `database/table` para uma tabela de palavras-chave definidas pelo usuário. A coluna `VALUE` está vazia se não houver uma tabela de palavras-chave definidas pelo usuário.

   - `use_stopword`: Indica se uma tabela de palavras-chave é usada, que é definida quando o índice `FULLTEXT` é criado.

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

10. Desative `innodb_optimize_fulltext_only`, pois ele deve ser habilitado apenas temporariamente:

    ```
    mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
    ```
