## 24.1 Introdução

`INFORMATION_SCHEMA` fornece acesso aos metadados do banco de dados, informações sobre o servidor MySQL, como o nome de um banco de dados ou tabela, o tipo de dados de uma coluna ou privilégios de acesso. Outros termos que são usados às vezes para essas informações são dicionário de dados e catálogo do sistema.

* Notas de uso do INFORMATION_SCHEMA
* Considerações sobre o conjunto de caracteres
* INFORMATION_SCHEMA como alternativa às declarações SHOW
* INFORMATION_SCHEMA e privilégios
* Considerações de desempenho
* Considerações sobre padrões
* Convenções nas seções de referência do INFORMATION_SCHEMA
* Informações relacionadas

### Notas de uso do INFORMATION_SCHEMA

`INFORMATION_SCHEMA` é um banco de dados dentro de cada instância do MySQL, o local que armazena informações sobre todos os outros bancos de dados que o servidor MySQL mantém. O banco de dados `INFORMATION_SCHEMA` contém várias tabelas somente de leitura. Na verdade, são visualizações, não tabelas de base, portanto, não há arquivos associados a elas, e você não pode definir gatilhos nelas. Além disso, não há um diretório de banco de dados com esse nome.

Embora você possa selecionar `INFORMATION_SCHEMA` como o banco de dados padrão com uma declaração `USE`, você só pode ler o conteúdo das tabelas, não realizar operações de `INSERT`, `UPDATE` ou `DELETE` sobre elas.

Aqui está um exemplo de uma declaração que recupera informações de `INFORMATION_SCHEMA`:

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

Explicação: A declaração solicita uma lista de todas as tabelas no banco de dados `db5`, mostrando apenas três informações: o nome da tabela, seu tipo e seu mecanismo de armazenamento.

### Considerações sobre o conjunto de caracteres

A definição para as colunas de caráter (por exemplo, `TABLES.TABLE_NAME`) é geralmente `VARCHAR(N) CHARACTER SET utf8`, onde *`N`* é, no mínimo

64. O MySQL utiliza a collation padrão para este conjunto de caracteres (`utf8_general_ci`) para todas as pesquisas, ordenamentos, comparações e outras operações de string nessas colunas.

Como alguns objetos do MySQL são representados como arquivos, as pesquisas em colunas de string do `INFORMATION_SCHEMA` podem ser afetadas pela sensibilidade ao caso do sistema de arquivos. Para mais informações, consulte a Seção 10.8.7, “Usando a Cotação em Pesquisas do SCHEMA_INFORMADO”.

### INFORMAÇÕES\_SCHEMA como alternativa às declarações SHOW

A declaração `SELECT ... FROM INFORMATION_SCHEMA` é destinada a uma maneira mais consistente de fornecer acesso às informações fornecidas pelas várias declarações `SHOW` que o MySQL suporta (`SHOW DATABASES`, `SHOW TABLES`, e assim por diante). Usar `SELECT` tem essas vantagens, em comparação com `SHOW`:

* Conforme as regras de Codd, pois todo acesso é feito em tabelas.

* Você pode usar a sintaxe familiar da declaração `SELECT`, e só precisa aprender alguns nomes de tabela e coluna.

* O implementador não precisa se preocupar em adicionar palavras-chave. * Você pode filtrar, ordenar, concatenar e transformar os resultados das consultas `INFORMATION_SCHEMA` em qualquer formato que sua aplicação precise, como uma estrutura de dados ou uma representação de texto para análise.

* Essa técnica é mais interoperável com outros sistemas de banco de dados. Por exemplo, os usuários do Oracle Database estão familiarizados com a consulta de tabelas no dicionário de dados Oracle.

Como o `SHOW` é familiar e amplamente utilizado, as declarações do `SHOW` permanecem como uma alternativa. De fato, juntamente com a implementação do `INFORMATION_SCHEMA`, há melhorias no `SHOW`, conforme descrito na Seção 24.8, “Extensões para Declarações SHOW”.

### INFORMAÇÕES\_SCHEMA e Privilegios

Para a maioria das tabelas `INFORMATION_SCHEMA`, cada usuário do MySQL tem o direito de acessá-las, mas pode ver apenas as linhas das tabelas que correspondem a objetos para os quais o usuário tenha os privilégios de acesso apropriados. Em alguns casos (por exemplo, a coluna `ROUTINE_DEFINITION` na tabela `INFORMATION_SCHEMA` `ROUTINES`, os usuários que têm privilégios insuficientes veem `NULL`. Algumas tabelas têm requisitos de privilégio diferentes; para essas, os requisitos são mencionados nas descrições das tabelas aplicáveis. Por exemplo, as tabelas `InnoDB` (tabelas com nomes que começam com `INNODB_`) requerem o privilégio `PROCESS`.

Os mesmos privilégios se aplicam à seleção de informações do `INFORMATION_SCHEMA` e à visualização das mesmas informações através das declarações do `SHOW`. Em qualquer caso, você deve ter algum privilégio em um objeto para ver informações sobre ele.

### Considerações de desempenho

`INFORMATION_SCHEMA` consultas que buscam informações em mais de um banco de dados podem levar um longo tempo e afetar o desempenho. Para verificar a eficiência de uma consulta, você pode usar `EXPLAIN`. Para informações sobre o uso da saída de `EXPLAIN` para ajustar as consultas de `INFORMATION_SCHEMA`, consulte a Seção 8.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

### Considerações sobre Padrões

A implementação para as estruturas de tabela `INFORMATION_SCHEMA` no MySQL segue o padrão ANSI/ISO SQL:2003, Parte 11 *Schemata*. Nosso objetivo é a conformidade aproximada com a característica central do SQL:2003 F021 *Esquema de informações básicas*.

Os usuários do SQL Server 2000 (que também segue o padrão) podem notar uma forte semelhança. No entanto, o MySQL omitiu muitas colunas que não são relevantes para nossa implementação e adicionou colunas específicas do MySQL. Uma dessas colunas adicionadas é a coluna `ENGINE` na tabela `INFORMATION_SCHEMA` `TABLES`.

Embora outros sistemas de gerenciamento de banco de dados utilizem uma variedade de nomes, como `syscat` ou `system`, o nome padrão é `INFORMATION_SCHEMA`.

Para evitar o uso de qualquer nome reservado no padrão ou no DB2, SQL Server ou Oracle, alteramos os nomes de algumas colunas marcadas como "extensão MySQL". (Por exemplo, alteramos `COLLATION` para `TABLE_COLLATION` na tabela `TABLES`. Veja a lista de palavras reservadas perto do final deste artigo: <https://web.archive.org/web/20070428032454/http://www.dbazine.com/db2/db2-disarticles/gulutzan5>.

### Convenções nas seções de referência do esquema de informações

As seções a seguir descrevem cada uma das tabelas e colunas em `INFORMATION_SCHEMA`. Para cada coluna, há três informações:

* “`INFORMATION_SCHEMA` Nome” indica o nome da coluna na tabela `INFORMATION_SCHEMA`. Isso corresponde ao nome padrão do SQL, a menos que o campo “Observações” diga “extensão MySQL”.

* “`SHOW` Nome” indica o nome do campo equivalente na declaração `SHOW` mais próxima, se houver uma.

* “Observações” fornece informações adicionais, quando aplicável. Se este campo for `NULL`, isso significa que o valor da coluna é sempre `NULL`. Se este campo diz “extensão MySQL”, a coluna é uma extensão MySQL para SQL padrão.

Muitas seções indicam qual declaração `SHOW` é equivalente a uma declaração `SELECT` que recupera informações de `INFORMATION_SCHEMA`. Para declarações `SHOW` que exibem informações para o banco de dados padrão, se você omitir uma cláusula `FROM db_name`, muitas vezes é possível selecionar informações para o banco de dados padrão, adicionando uma condição `AND TABLE_SCHEMA = SCHEMA()` à cláusula `WHERE` de uma consulta que recupera informações de uma tabela `INFORMATION_SCHEMA`.

### Informações Relacionadas

Essas seções discutem tópicos adicionais relacionados ao `INFORMATION_SCHEMA`:

* informações sobre as tabelas `INFORMATION_SCHEMA` específicas ao motor de armazenamento `InnoDB`: Seção 24.4, “TABELAS DO SCHEMA DE INFORMAÇÃO InnoDB”

* informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin de pool de threads: Seção 24.5, “TABELAS DO SCHEMA DE INFORMAÇÃO Thread Pool”

* informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin `CONNECTION_CONTROL`: Seção 24.6, “Tabelas de Controle de Conexão do INFORMATION_SCHEMA”

* Respostas a perguntas que são frequentemente feitas sobre o banco de dados `INFORMATION_SCHEMA`: Seção A.7, “Perguntas frequentes do MySQL 5.7: INFORMATION_SCHEMA”

* Perguntas do `INFORMATION_SCHEMA` e o otimizador: Seção 8.2.3, “Otimizando consultas do INFORMATION_SCHEMA”

* O efeito da ordenação nas comparações de `INFORMATION_SCHEMA`: Seção 10.8.7, “Usando ordenação nas pesquisas do INFORMATION\_SCHEMA”