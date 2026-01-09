## 28.1 Introdução

`INFORMATION_SCHEMA` fornece acesso aos metadados do banco de dados, informações sobre o servidor MySQL, como o nome de um banco de dados ou tabela, o tipo de dado de uma coluna ou privilégios de acesso. Outros termos que são às vezes usados para essa informação são dicionário de dados e catálogo do sistema.

* Notas de Uso de INFORMATION_SCHEMA
* Considerações sobre o Conjunto de Caracteres
* INFORMATION_SCHEMA como Alternativa aos Comandos SHOW
* INFORMATION_SCHEMA e Privilegios
* Considerações de Desempenho
* Considerações de Padrões
* Convenções nas Seções de Referência do INFORMATION_SCHEMA
* Informações Relacionadas

### Notas de Uso de INFORMATION_SCHEMA

`INFORMATION_SCHEMA` é um banco de dados dentro de cada instância do MySQL, o local que armazena informações sobre todos os outros bancos de dados que o servidor MySQL mantém. O banco de dados `INFORMATION_SCHEMA` contém várias tabelas de leitura apenas. Elas são, na verdade, visualizações, não tabelas base, então não há arquivos associados a elas, e você não pode definir gatilhos nelas. Além disso, não há um diretório de banco de dados com esse nome.

Embora você possa selecionar `INFORMATION_SCHEMA` como o banco de dados padrão com um comando `USE`, você só pode ler o conteúdo das tabelas, não realizar operações de `INSERT`, `UPDATE` ou `DELETE` nelas.

Aqui está um exemplo de um comando que recupera informações de `INFORMATION_SCHEMA`:

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

Explicação: O comando solicita uma lista de todas as tabelas no banco de dados `db5`, mostrando apenas três pedaços de informação: o nome da tabela, seu tipo e seu motor de armazenamento.

As informações sobre as chaves primárias invisíveis geradas são visíveis por padrão em todas as tabelas do `INFORMATION_SCHEMA` que descrevem colunas de tabelas, chaves ou ambas, como as tabelas `COLUMNS` e `STATISTICS`. Se você deseja ocultar essas informações de consultas que selecionam dessas tabelas, pode fazer isso configurando o valor da variável de sistema `show_gipk_in_create_table_and_information_schema` para `OFF`. Para mais informações, consulte a Seção 15.1.24.11, “Chaves Primárias Invisíveis Geradas”.

### Considerações sobre o Conjunto de Caracteres

A definição para colunas de caracteres (por exemplo, `TABLES.TABLE_NAME`) é geralmente `VARCHAR(N) CHARACTER SET utf8mb3`, onde *`N`* é de pelo menos

64. O MySQL usa a collation padrão para esse conjunto de caracteres (`utf8mb3_general_ci`) para todas as pesquisas, ordenações, comparações e outras operações de string nessas colunas.

Como alguns objetos do MySQL são representados como arquivos, as pesquisas em colunas de texto do `INFORMATION_SCHEMA` podem ser afetadas pela sensibilidade ao caso do sistema de arquivos. Para mais informações, consulte a Seção 12.8.7, “Usando a Cotação em Pesquisas do INFORMATION_SCHEMA”.

### INFORMATION_SCHEMA como Alternativa aos Estados SHOW

A instrução `SELECT ... FROM INFORMATION_SCHEMA` é destinada a ser uma maneira mais consistente de fornecer acesso às informações fornecidas pelas várias instruções `SHOW` que o MySQL suporta (`SHOW DATABASES`, `SHOW TABLES`, e assim por diante). Usar `SELECT` tem essas vantagens em comparação com `SHOW`:

* Conforma às regras de Codd, porque todo o acesso é feito em tabelas.

* Você pode usar a sintaxe familiar da instrução `SELECT`, e só precisa aprender alguns nomes de tabelas e colunas.

* O implementador não precisa se preocupar em adicionar palavras-chave.
* Você pode filtrar, ordenar, concatenar e transformar os resultados das consultas do `INFORMATION_SCHEMA` em qualquer formato que sua aplicação precise, como uma estrutura de dados ou uma representação de texto para análise.

* Essa técnica é mais interoperável com outros sistemas de banco de dados. Por exemplo, os usuários do Oracle Database estão familiarizados com a consulta de tabelas no dicionário de dados do Oracle.

Como o `SHOW` é familiar e amplamente utilizado, as instruções `SHOW` permanecem como uma alternativa. De fato, juntamente com a implementação do `INFORMATION_SCHEMA`, há melhorias no `SHOW` conforme descrito na Seção 28.8, “Extensões para Instruções SHOW”.

### INFORMATION_SCHEMA e Privilegios

Para a maioria das tabelas do `INFORMATION_SCHEMA`, cada usuário do MySQL tem o direito de acessá-las, mas pode ver apenas as linhas nas tabelas que correspondem a objetos para os quais o usuário tenha os privilégios de acesso adequados. Em alguns casos (por exemplo, a coluna `ROUTINE_DEFINITION` na tabela `ROUTINES` do `INFORMATION_SCHEMA`), usuários que têm privilégios insuficientes veem `NULL`. Algumas tabelas têm requisitos de privilégio diferentes; para essas, os requisitos são mencionados nas descrições das tabelas aplicáveis. Por exemplo, as tabelas `InnoDB` (tabelas com nomes que começam com `INNODB_`) requerem o privilégio `PROCESS`.

Os mesmos privilégios se aplicam à seleção de informações do `INFORMATION_SCHEMA` e à visualização das mesmas informações através das instruções `SHOW`. Em ambos os casos, você deve ter algum privilégio em um objeto para ver informações sobre ele.

### Considerações de Desempenho

As consultas do `INFORMATION_SCHEMA` que buscam informações de mais de um banco de dados podem demorar muito e afetar o desempenho. Para verificar a eficiência de uma consulta, você pode usar `EXPLAIN`. Para obter informações sobre como usar a saída de `EXPLAIN` para ajustar as consultas do `INFORMATION_SCHEMA`, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION_SCHEMA”.

### Considerações de Padrões

A implementação das estruturas da tabela `INFORMATION_SCHEMA` no MySQL segue o padrão ANSI/ISO SQL:2003, Parte 11 *Schemata*. Nossa intenção é a conformidade aproximada com o recurso central SQL:2003 F021 *Schema básico de informações*.

Usuários do SQL Server 2000 (que também segue o padrão) podem notar uma forte semelhança. No entanto, o MySQL omitiu muitas colunas que não são relevantes para nossa implementação e adicionou colunas específicas do MySQL. Uma dessas colunas adicionadas é a coluna `ENGINE` na tabela `TABLES` do `INFORMATION_SCHEMA`.

Embora outros SGBD usem uma variedade de nomes, como `syscat` ou `system`, o nome padrão é `INFORMATION_SCHEMA`.

Para evitar usar qualquer nome reservado no padrão ou no DB2, SQL Server ou Oracle, alteramos os nomes de algumas colunas marcadas como “extensão MySQL”. (Por exemplo, alteramos `COLLATION` para `TABLE_COLLATION` na tabela `TABLES`.) Veja a lista de palavras reservadas perto do final deste artigo: <https://web.archive.org/web/20070428032454/http://www.dbazine.com/db2/db2-disarticles/gulutzan5>.

### Convenções nas Seções de Referência do INFORMATION_SCHEMA

As seções a seguir descrevem cada uma das tabelas e colunas do `INFORMATION_SCHEMA`. Para cada coluna, há três informações:

* “`INFORMATION_SCHEMA` Nome” indica o nome da coluna na tabela `INFORMATION_SCHEMA`. Isso corresponde ao nome padrão do SQL, a menos que o campo “Observações” diga “extensão MySQL”.

* “`SHOW` Nome” indica o nome do campo equivalente na declaração `SHOW` mais próxima, se houver.

* “Observações” fornece informações adicionais, quando aplicável. Se este campo for `NULL`, isso significa que o valor da coluna é sempre `NULL`. Se este campo disser “extensão MySQL”, a coluna é uma extensão MySQL para o SQL padrão.

Muitas seções indicam o que a declaração `SHOW` é equivalente a um `SELECT` que recupera informações da `INFORMATION_SCHEMA`. Para declarações `SHOW` que exibem informações para o banco de dados padrão se você omitir uma cláusula `FROM db_name`, você pode frequentemente selecionar informações para o banco de dados padrão adicionando uma condição `AND TABLE_SCHEMA = SCHEMA()` à cláusula `WHERE` de uma consulta que recupera informações de uma tabela `INFORMATION_SCHEMA`.

### Informações Relacionadas

Essas seções discutem tópicos adicionais relacionados à `INFORMATION_SCHEMA`:

* informações sobre as tabelas `INFORMATION_SCHEMA` específicas do motor de armazenamento `InnoDB`: Seção 28.4, “Tabelas `INFORMATION_SCHEMA InnoDB”

* informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin de pool de threads: Seção 28.5, “Tabelas `INFORMATION_SCHEMA Thread Pool`”

* informações sobre as tabelas `INFORMATION_SCHEMA` específicas do plugin `CONNECTION_CONTROL`: Seção 28.6, “Tabelas `INFORMATION_SCHEMA Connection Control`”

* Respostas a perguntas frequentemente feitas sobre o banco de dados `INFORMATION_SCHEMA`: Seção A.7, “Perguntas Frequentes do MySQL 9.5: `INFORMATION_SCHEMA`”

* Consultas `INFORMATION_SCHEMA` e o otimizador: Seção 10.2.3, “Otimizando Consultas `INFORMATION_SCHEMA`”

* O efeito da ordenação nas comparações do `INFORMATION_SCHEMA`: Seção 12.8.7, “Usando a Ordenação em Pesquisas do INFORMATION_SCHEMA”