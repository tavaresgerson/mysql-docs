## 28.1 Introdução

`INFORMATION_SCHEMA` fornece acesso aos metadados do banco de dados, informações sobre o servidor MySQL, como o nome de um banco de dados ou tabela, o tipo de dados de uma coluna ou privilégios de acesso. Outros termos que são usados às vezes para essa informação são dicionário de dados e catálogo do sistema.

- Notas de uso do INFORMATION\_SCHEMA
- Considerações sobre o conjunto de caracteres
- INFORMATION\_SCHEMA como alternativa às instruções SHOW
- INFORMATION\_SCHEMA e Privilegios
- Considerações sobre o desempenho
- Considerações sobre Padrões
- Convenções nas seções de Referência do INFORMATION\_SCHEMA
- Informações Relacionadas

### Notas de uso do INFORMATION\_SCHEMA

`INFORMATION_SCHEMA` é um banco de dados dentro de cada instância do MySQL, o local que armazena informações sobre todos os outros bancos de dados que o servidor MySQL mantém. O banco de dados `INFORMATION_SCHEMA` contém várias tabelas somente de leitura. Na verdade, são visualizações, não tabelas de base, então não há arquivos associados a elas, e você não pode definir gatilhos nelas. Além disso, não há um diretório de banco de dados com esse nome.

Embora você possa selecionar `INFORMATION_SCHEMA` como o banco de dados padrão com uma declaração `USE`, você só pode ler o conteúdo das tabelas, não realizar operações de `INSERT`, `UPDATE` ou `DELETE` nelas.

Aqui está um exemplo de uma declaração que recupera informações do `INFORMATION_SCHEMA`:

```
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

A partir do MySQL 8.0.30, as informações sobre as chaves primárias invisíveis geradas são visíveis por padrão em todas as tabelas `INFORMATION_SCHEMA` que descrevem as colunas da tabela, as chaves ou ambas, como as tabelas `COLUMNS` e `STATISTICS`. Se você deseja ocultar essas informações de consultas que selecionam dessas tabelas, pode fazê-lo definindo o valor da variável de sistema do servidor `show_gipk_in_create_table_and_information_schema` para `OFF`. Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.

### Considerações sobre o conjunto de caracteres

A definição para as colunas de caracteres (por exemplo, `TABLES.TABLE_NAME`) é geralmente `VARCHAR(N) CHARACTER SET utf8mb3` onde `N` é no mínimo

64. O MySQL usa a collation padrão para este conjunto de caracteres (`utf8mb3_general_ci`) para todas as pesquisas, ordenações, comparações e outras operações de string nessas colunas.

Como alguns objetos do MySQL são representados como arquivos, as pesquisas em colunas de strings `INFORMATION_SCHEMA` podem ser afetadas pela sensibilidade ao caso do sistema de arquivos. Para mais informações, consulte a Seção 12.8.7, “Usando a Cotação em Pesquisas do INFORMATION\_SCHEMA”.

### INFORMATION\_SCHEMA como alternativa às instruções SHOW

A declaração `SELECT ... FROM INFORMATION_SCHEMA` é destinada a ser uma maneira mais consistente de fornecer acesso às informações fornecidas pelas várias declarações `SHOW` que o MySQL suporta (`SHOW DATABASES`, `SHOW TABLES` e assim por diante). Usar `SELECT` tem essas vantagens, em comparação com `SHOW`:

- Ele está em conformidade com as regras de Codd, porque todo acesso é feito em tabelas.

- Você pode usar a sintaxe familiar da declaração `SELECT` e apenas precisa aprender alguns nomes de tabelas e colunas.

- O implementador não precisa se preocupar em adicionar palavras-chave.

- Você pode filtrar, ordenar, concatenar e transformar os resultados das consultas `INFORMATION_SCHEMA` no formato que sua aplicação precisa, como uma estrutura de dados ou uma representação de texto para análise.

- Essa técnica é mais interoperável com outros sistemas de banco de dados. Por exemplo, os usuários do Oracle Database estão familiarizados com a consulta de tabelas no dicionário de dados do Oracle.

Como o `SHOW` é familiar e amplamente utilizado, as instruções `SHOW` permanecem como uma alternativa. Na verdade, juntamente com a implementação do `INFORMATION_SCHEMA`, há melhorias no `SHOW`, conforme descrito na Seção 28.8, “Extensões para instruções SHOW”.

### INFORMATION\_SCHEMA e Privilegios

Para a maioria das tabelas `INFORMATION_SCHEMA`, cada usuário do MySQL tem o direito de acessá-las, mas pode ver apenas as linhas nas tabelas que correspondem aos objetos para os quais o usuário tenha os privilégios de acesso adequados. Em alguns casos (por exemplo, a coluna `ROUTINE_DEFINITION` na tabela `INFORMATION_SCHEMA` `ROUTINES`, os usuários que têm privilégios insuficientes veem `NULL`. Algumas tabelas têm requisitos de privilégio diferentes; para essas, os requisitos são mencionados nas descrições das tabelas aplicáveis. Por exemplo, as tabelas `InnoDB` (tabelas com nomes que começam com `INNODB_`) requerem o privilégio `PROCESS`.

Os mesmos privilégios se aplicam à seleção de informações de `INFORMATION_SCHEMA` e à visualização das mesmas informações por meio das instruções `SHOW`. Em ambos os casos, você deve ter algum privilégio em um objeto para ver informações sobre ele.

### Considerações sobre o desempenho

Consultas `INFORMATION_SCHEMA` que buscam informações em mais de um banco de dados podem demorar muito e afetar o desempenho. Para verificar a eficiência de uma consulta, você pode usar `EXPLAIN`. Para obter informações sobre como usar a saída `EXPLAIN` para ajustar consultas `INFORMATION_SCHEMA`, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

### Considerações sobre Padrões

A implementação das estruturas de tabela `INFORMATION_SCHEMA` no MySQL segue o padrão ANSI/ISO SQL:2003, Parte 11 *Schemata*. Nossa intenção é a conformidade aproximada com o recurso central SQL:2003 F021 *Esquema de informações básicas*.

Os usuários do SQL Server 2000 (que também segue o padrão) podem notar uma forte semelhança. No entanto, o MySQL omitiu muitas colunas que não são relevantes para nossa implementação e adicionou colunas específicas do MySQL. Uma dessas colunas adicionadas é a coluna `ENGINE` na tabela `INFORMATION_SCHEMA` `TABLES`.

Embora outros SGBDs use uma variedade de nomes, como `syscat` ou `system`, o nome padrão é `INFORMATION_SCHEMA`.

Para evitar o uso de qualquer nome reservado no padrão ou no DB2, SQL Server ou Oracle, alteramos os nomes de algumas colunas marcadas como “extensão MySQL”. (Por exemplo, alteramos `COLLATION` para `TABLE_COLLATION` na tabela `TABLES`. Veja a lista de palavras reservadas no final deste artigo: <https://web.archive.org/web/20070428032454/http://www.dbazine.com/db2/db2-disarticles/gulutzan5>.

### Convenções nas seções de Referência do INFORMATION\_SCHEMA

As seções a seguir descrevem cada uma das tabelas e colunas em `INFORMATION_SCHEMA`. Para cada coluna, há três informações:

- “`INFORMATION_SCHEMA` Nome” indica o nome da coluna na tabela `INFORMATION_SCHEMA`. Isso corresponde ao nome padrão do SQL, a menos que o campo “Observações” diga “extensão MySQL”.

- “`SHOW` Nome” indica o nome do campo equivalente na declaração `SHOW` mais próxima, se houver uma.

- “Observações” fornece informações adicionais quando aplicável. Se este campo for `NULL`, isso significa que o valor da coluna é sempre `NULL`. Se este campo disser “extensão MySQL”, a coluna é uma extensão MySQL para o SQL padrão.

Muitas seções indicam que a declaração `SHOW` é equivalente a uma declaração `SELECT` que recupera informações de `INFORMATION_SCHEMA`. Para declarações `SHOW` que exibem informações para o banco de dados padrão, se você omitir uma cláusula `FROM db_name`, você pode frequentemente selecionar informações para o banco de dados padrão adicionando uma condição `AND TABLE_SCHEMA = SCHEMA()` à cláusula `WHERE` de uma consulta que recupera informações de uma tabela `INFORMATION_SCHEMA`.

### Informações Relacionadas

Essas seções discutem tópicos adicionais relacionados ao `INFORMATION_SCHEMA`:

- Informações sobre as tabelas `INFORMATION_SCHEMA` específicas ao motor de armazenamento `InnoDB`: Seção 28.4, “Tabelas do esquema de informações InnoDB”

- informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin de pool de threads: Seção 28.5, “Tabelas do Schema de Informação do Pool de Threads”

- informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin `CONNECTION_CONTROL`: Seção 28.6, “Tabelas de controle de conexão do INFORMATION\_SCHEMA”

- Respostas a perguntas frequentemente feitas sobre o banco de dados `INFORMATION_SCHEMA`: Seção A.7, “Perguntas frequentes do MySQL 8.0: INFORMATION\_SCHEMA”

- `INFORMATION_SCHEMA` consultas e o otimizador: Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”

- O efeito da ordenação nas comparações de `INFORMATION_SCHEMA`: Seção 12.8.7, “Usando a ordenação nas pesquisas do INFORMATION\_SCHEMA”
