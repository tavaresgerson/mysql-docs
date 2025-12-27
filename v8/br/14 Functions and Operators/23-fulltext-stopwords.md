### 14.9.4 Palavras-chave completas

A lista de palavras-chave é carregada e pesquisada para consultas de texto completo usando o conjunto de caracteres do servidor e a ordenação (os valores das variáveis de sistema `character_set_server` e `collation_server`). Pode ocorrer falhas ou erros na busca de palavras-chave se o arquivo de palavras-chave ou as colunas usadas para indexação ou buscas de texto completo tiverem um conjunto de caracteres ou ordenação diferentes de `character_set_server` ou `collation_server`.

A sensibilidade ao caso das buscas de palavras-chave depende da ordenação do servidor. Por exemplo, as buscas são sensíveis ao caso se a ordenação for `utf8mb4_0900_ai_ci`, enquanto as buscas são sensíveis ao caso se a ordenação for `utf8mb4_0900_as_cs` ou `utf8mb4_bin`.

*  Palavras-chave para índices de pesquisa de InnoDB
*  Palavras-chave para índices de pesquisa de MyISAM

#### Palavras-chave para índices de pesquisa de InnoDB

O `InnoDB` tem uma lista relativamente curta de palavras-chave padrão, porque documentos de fontes técnicas, literárias e outras frequentemente usam palavras curtas como palavras-chave ou em frases significativas. Por exemplo, você pode pesquisar por “to be or not to be” e esperar obter um resultado sensível, em vez de ignorar todas essas palavras.

Para ver a lista padrão de palavras-chave de `InnoDB`, execute a consulta na tabela do Esquema de Informações `INNODB_FT_DEFAULT_STOPWORD`.

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;
+-------+
| value |
+-------+
| a     |
| about |
| an    |
| are   |
| as    |
| at    |
| be    |
| by    |
| com   |
| de    |
| en    |
| for   |
| from  |
| how   |
| i     |
| in    |
| is    |
| it    |
| la    |
| of    |
| on    |
| or    |
| that  |
| the   |
| this  |
| to    |
| was   |
| what  |
| when  |
| where |
| who   |
| will  |
| with  |
| und   |
| the   |
| www   |
+-------+
36 rows in set (0.00 sec)
```

Para definir sua própria lista de palavras-chave para todas as tabelas de `InnoDB`, defina uma tabela com a mesma estrutura que a tabela `INNODB_FT_DEFAULT_STOPWORD`, preencha-a com palavras-chave e defina o valor da opção `innodb_ft_server_stopword_table` para um valor na forma `db_name/table_name` antes de criar o índice de texto completo. A tabela de palavras-chave deve ter uma única coluna `VARCHAR` chamada `value`. O exemplo a seguir demonstra como criar e configurar uma nova tabela de palavras-chave global para `InnoDB`.

```
-- Create a new stopword table

mysql> CREATE TABLE my_stopwords(value VARCHAR(30)) ENGINE = INNODB;
Query OK, 0 rows affected (0.01 sec)

-- Insert stopwords (for simplicity, a single stopword is used in this example)

mysql> INSERT INTO my_stopwords(value) VALUES ('Ishmael');
Query OK, 1 row affected (0.00 sec)

-- Create the table

mysql> CREATE TABLE opening_lines (
id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
opening_line TEXT(500),
author VARCHAR(200),
title VARCHAR(200)
) ENGINE=InnoDB;
Query OK, 0 rows affected (0.01 sec)

-- Insert data into the table

mysql> INSERT INTO opening_lines(opening_line,author,title) VALUES
('Call me Ishmael.','Herman Melville','Moby-Dick'),
('A screaming comes across the sky.','Thomas Pynchon','Gravity\'s Rainbow'),
('I am an invisible man.','Ralph Ellison','Invisible Man'),
('Where now? Who now? When now?','Samuel Beckett','The Unnamable'),
('It was love at first sight.','Joseph Heller','Catch-22'),
('All this happened, more or less.','Kurt Vonnegut','Slaughterhouse-Five'),
('Mrs. Dalloway said she would buy the flowers herself.','Virginia Woolf','Mrs. Dalloway'),
('It was a pleasure to burn.','Ray Bradbury','Fahrenheit 451');
Query OK, 8 rows affected (0.00 sec)
Records: 8  Duplicates: 0  Warnings: 0

-- Set the innodb_ft_server_stopword_table option to the new stopword table

mysql> SET GLOBAL innodb_ft_server_stopword_table = 'test/my_stopwords';
Query OK, 0 rows affected (0.00 sec)

-- Create the full-text index (which rebuilds the table if no FTS_DOC_ID column is defined)

mysql> CREATE FULLTEXT INDEX idx ON opening_lines(opening_line);
Query OK, 0 rows affected, 1 warning (1.17 sec)
Records: 0  Duplicates: 0  Warnings: 1
```

Verifique se a palavra-chave especificada ('Ishmael') não aparece consultando a tabela do Esquema de Informações `INNODB_FT_INDEX_TABLE`.

::: info Nota
Português (Brasil):

Por padrão, palavras com menos de 3 caracteres ou com mais de 84 caracteres não aparecem em um índice de pesquisa de texto completo de `InnoDB`. Os valores máximos e mínimos de comprimento de palavra são configuráveis usando as variáveis `innodb_ft_max_token_size` e `innodb_ft_min_token_size`. Esse comportamento padrão não se aplica ao plugin de analisador de ngram. O tamanho do token de ngram é definido pela opção `ngram_token_size`.


:::

```
mysql> SET GLOBAL innodb_ft_aux_table='test/opening_lines';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT word FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 15;
+-----------+
| word      |
+-----------+
| across    |
| all       |
| burn      |
| buy       |
| call      |
| comes     |
| dalloway  |
| first     |
| flowers   |
| happened  |
| herself   |
| invisible |
| less      |
| love      |
| man       |
+-----------+
15 rows in set (0.00 sec)
```

Para criar listas de palavras-chave de forma tabela por tabela, crie outras tabelas de palavras-chave e use a opção `innodb_ft_user_stopword_table` para especificar a tabela de palavras-chave que você deseja usar antes de criar o índice de texto completo.

#### Palavras-chave para Índices de Pesquisa MyISAM

O arquivo de palavras-chave é carregado e pesquisado usando `latin1` se `character_set_server` for `ucs2`, `utf16`, `utf16le` ou `utf32`.

Para substituir a lista de palavras-chave padrão para tabelas MyISAM, defina a variável de sistema `ft_stopword_file`. (Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”.) O valor da variável deve ser o nome do caminho do arquivo contendo a lista de palavras-chave, ou a string vazia para desabilitar a filtragem de palavras-chave. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Após alterar o valor desta variável ou o conteúdo do arquivo de palavras-chave, reinicie o servidor e reconstrua seus índices `FULLTEXT`.

A lista de palavras-chave é livre, separando as palavras-chave com qualquer caractere não alfanumérico, como nova linha, espaço ou vírgula. Exceções são o caractere sublinhado (`_`) e uma única apóstrofe (`'`) que são tratados como parte de uma palavra. O conjunto de caracteres da lista de palavras-chave é o conjunto de caracteres padrão do servidor; veja a Seção 12.3.2, “Conjunto de Caracteres do Servidor e Cotação”.

A lista a seguir mostra as palavras-chave padrão para índices de pesquisa `MyISAM`. Em uma distribuição de fonte MySQL, você pode encontrar essa lista no arquivo `storage/myisam/ft_static.c`.


```ZE0PwU2xQp