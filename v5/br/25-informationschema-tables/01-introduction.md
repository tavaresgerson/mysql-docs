## 24.1 Introdução

`INFORMATION_SCHEMA` fornece acesso aos metadados do banco de dados, informações sobre o servidor MySQL, como o nome de um banco de dados ou tabela, o tipo de dados de uma coluna ou privilégios de acesso. Outros termos que são às vezes usados para essa informação são dicionário de dados e catálogo do sistema.

- Notas de uso do esquema de informações
- Considerações sobre o conjunto de caracteres
- INFORMATION\_SCHEMA como alternativa às declarações SHOW
- SCHEMA DE INFORMAÇÕES e Privilegios
- Considerações de desempenho
- Considerações sobre Padrões
- Convenções nas seções de referência do esquema de informações
- Informações Relacionadas

### Notas de uso do INFORMATION\_SCHEMA

`INFORMATION_SCHEMA` é um banco de dados dentro de cada instância do MySQL, o local que armazena informações sobre todos os outros bancos de dados que o servidor MySQL mantém. O banco de dados `INFORMATION_SCHEMA` contém várias tabelas de leitura somente, que são, na verdade, visualizações, não tabelas de base, portanto, não há arquivos associados a elas, e você não pode definir gatilhos nelas. Além disso, não há um diretório de banco de dados com esse nome.

Embora você possa selecionar `INFORMATION_SCHEMA` como o banco de dados padrão com uma declaração `[USE]` (use.html), você só pode ler o conteúdo das tabelas, não realizar operações de `[INSERT]` (insert.html), `[UPDATE]` (update.html) ou `[DELETE]` (delete.html) nelas.

Aqui está um exemplo de uma declaração que recupera informações da `INFORMATION_SCHEMA`:

```sql
mysql> SELECT table_name, table_type, engine
       FROM information_schema.tables
       WHERE table_schema = 'db5'
       ORDER BY table_name;
+------------+------------+--------+
| table_name | table_type | engine |
+------------+------------+--------+
| fk         | BASE TABLE | InnoDB |
| fk2        | BASE TABLE | InnoDB |
| goto       | BASE TABLE | MyISAM |
| into       | BASE TABLE | MyISAM |
| k          | BASE TABLE | MyISAM |
| kurs       | BASE TABLE | MyISAM |
| loop       | BASE TABLE | MyISAM |
| pk         | BASE TABLE | InnoDB |
| t          | BASE TABLE | MyISAM |
| t2         | BASE TABLE | MyISAM |
| t3         | BASE TABLE | MyISAM |
| t7         | BASE TABLE | MyISAM |
| tables     | BASE TABLE | MyISAM |
| v          | VIEW       | NULL   |
| v2         | VIEW       | NULL   |
| v3         | VIEW       | NULL   |
| v56        | VIEW       | NULL   |
+------------+------------+--------+
17 rows in set (0.01 sec)
```

Explicação: A declaração solicita uma lista de todas as tabelas no banco de dados `db5`, mostrando apenas três informações: o nome da tabela, seu tipo e seu motor de armazenamento.

### Considerações sobre o conjunto de caracteres

A definição para as colunas de caracteres (por exemplo, `TABLES.TABLE_NAME`) é geralmente `VARCHAR(N) CHARACTER SET utf8`, onde *`N`* é no mínimo

64. O MySQL usa a collation padrão para este conjunto de caracteres (`utf8_general_ci`) para todas as pesquisas, ordenações, comparações e outras operações de string nessas colunas.

Como alguns objetos do MySQL são representados como arquivos, as pesquisas nas colunas de texto do `INFORMATION_SCHEMA` podem ser afetadas pela sensibilidade ao caso do sistema de arquivos. Para mais informações, consulte Seção 10.8.7, “Usando a Cotação em Pesquisas no INFORMATION\_SCHEMA”.

### INFORMATION\_SCHEMA como alternativa às instruções SHOW

A instrução `SELECT ... FROM INFORMATION_SCHEMA` é uma maneira mais consistente de fornecer acesso às informações fornecidas pelas várias instruções `SHOW` que o MySQL suporta (`SHOW DATABASES`, `SHOW TABLES`, e assim por diante). Usar `SELECT` tem essas vantagens em comparação com `SHOW`:

- Ele está em conformidade com as regras de Codd, porque todo acesso é feito em tabelas.

- Você pode usar a sintaxe familiar da instrução `SELECT` e apenas precisa aprender alguns nomes de tabelas e colunas.

- O implementador não precisa se preocupar em adicionar palavras-chave.

- Você pode filtrar, ordenar, concatenar e transformar os resultados das consultas do `INFORMATION_SCHEMA` no formato necessário para sua aplicação, como uma estrutura de dados ou uma representação de texto para análise.

- Essa técnica é mais interoperável com outros sistemas de banco de dados. Por exemplo, os usuários do Oracle Database estão familiarizados com a consulta de tabelas no dicionário de dados do Oracle.

Como o `SHOW` é familiar e amplamente utilizado, as instruções `SHOW` permanecem como uma alternativa. Na verdade, juntamente com a implementação do `INFORMATION_SCHEMA`, há melhorias nas instruções `SHOW`, conforme descrito na Seção 24.8, “Extensões para Instruções SHOW”.

### INFORMATION\_SCHEMA e Privilegios

Para a maioria das tabelas do `INFORMATION_SCHEMA`, cada usuário do MySQL tem o direito de acessá-las, mas pode ver apenas as linhas nas tabelas que correspondem aos objetos para os quais o usuário tenha os privilégios de acesso adequados. Em alguns casos (por exemplo, a coluna `ROUTINE_DEFINITION` na tabela `INFORMATION_SCHEMA `ROUTINES`), os usuários que têm privilégios insuficientes veem `NULL`. Algumas tabelas têm requisitos de privilégio diferentes; para essas, os requisitos são mencionados nas descrições das tabelas aplicáveis. Por exemplo, as tabelas `\[InnoDB]`(tabelas com nomes que começam com`INNODB\_`) requerem o privilégio `\[PROCESS]\` (privileges-provided.html#priv\_process).

Os mesmos privilégios se aplicam à seleção de informações da `INFORMATION_SCHEMA` e à visualização das mesmas informações por meio das instruções `SHOW`. Em ambos os casos, você deve ter algum privilégio em um objeto para ver informações sobre ele.

### Considerações sobre o desempenho

As consultas do `INFORMATION_SCHEMA` que buscam informações de mais de um banco de dados podem demorar muito e afetar o desempenho. Para verificar a eficiência de uma consulta, você pode usar `EXPLAIN`. Para obter informações sobre como usar a saída do `EXPLAIN` para ajustar as consultas do `INFORMATION_SCHEMA`, consulte Seção 8.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

### Considerações sobre Padrões

A implementação das estruturas da tabela `INFORMATION_SCHEMA` no MySQL segue o padrão ANSI/ISO SQL:2003, Parte 11 *Schemata*. Nossa intenção é a conformidade aproximada com o recurso central SQL:2003 F021 *Schema de informações básicas*.

Os usuários do SQL Server 2000 (que também segue o padrão) podem notar uma forte semelhança. No entanto, o MySQL omitiu muitas colunas que não são relevantes para nossa implementação e adicionou colunas específicas do MySQL. Uma dessas colunas adicionadas é a coluna `ENGINE` na tabela `INFORMATION_SCHEMA` `TABLES`.

Embora outros SGBDs use uma variedade de nomes, como `syscat` ou `system`, o nome padrão é `INFORMATION_SCHEMA`.

Para evitar o uso de qualquer nome reservado no padrão ou no DB2, SQL Server ou Oracle, alteramos os nomes de algumas colunas marcadas como “extensão MySQL”. (Por exemplo, alteramos `COLLATION` para `TABLE_COLLATION` na tabela `TABLES`. Veja a lista de palavras reservadas no final deste artigo: <https://web.archive.org/web/20070428032454/http://www.dbazine.com/db2/db2-disarticles/gulutzan5>.

### Convenções nas seções de Referência do INFORMATION\_SCHEMA

As seções a seguir descrevem cada uma das tabelas e colunas na `INFORMATION_SCHEMA`. Para cada coluna, há três informações:

- “`INFORMATION_SCHEMA` Name” indica o nome da coluna na tabela `INFORMATION_SCHEMA`. Isso corresponde ao nome padrão do SQL, a menos que o campo “Observações” diga “extensão MySQL”.

- “`SHOW` Nome” indica o nome do campo equivalente na instrução `SHOW` mais próxima, se houver.

- “Observações” fornece informações adicionais, quando aplicável. Se este campo for `NULL`, isso significa que o valor da coluna é sempre `NULL`. Se este campo disser “extensão MySQL”, a coluna é uma extensão MySQL para o SQL padrão.

Muitas seções indicam que a instrução `SHOW` é equivalente a uma instrução `SELECT` que recupera informações da `INFORMATION_SCHEMA`. Para as instruções `SHOW` que exibem informações para o banco de dados padrão, se você omitir uma cláusula `FROM db_name`, você pode frequentemente selecionar informações para o banco de dados padrão adicionando uma condição `AND TABLE_SCHEMA = SCHEMA()` à cláusula `WHERE` de uma consulta que recupera informações de uma tabela `INFORMATION_SCHEMA`.

### Informações Relacionadas

Essas seções discutem tópicos adicionais relacionados ao `INFORMATION_SCHEMA`:

- informações sobre as tabelas do esquema de informações `INFORMATION_SCHEMA` específicas para o mecanismo de armazenamento `InnoDB`: Seção 24.4, “Tabelas do Esquema de Informações INFORMATION\_SCHEMA”

- informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin de pool de threads: Seção 24.5, “Tabelas de Pool de Threads do INFORMATION\_SCHEMA”

- informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin `CONNECTION_CONTROL`: Seção 24.6, “Tabelas de Controle de Conexão do INFORMATION\_SCHEMA”

- Respostas a perguntas frequentemente feitas sobre o banco de dados `INFORMATION_SCHEMA`: Seção A.7, “Perguntas Frequentes do MySQL 5.7: INFORMATION\_SCHEMA”

- Consultas do `INFORMATION_SCHEMA` e o otimizador: Seção 8.2.3, “Otimização das consultas do INFORMATION\_SCHEMA”

- O efeito da ordenação nas comparações do `INFORMATION_SCHEMA`: Seção 10.8.7, “Usando ordenação em pesquisas do INFORMATION\_SCHEMA”
