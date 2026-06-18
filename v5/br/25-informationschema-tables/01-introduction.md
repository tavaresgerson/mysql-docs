## 24.1 Introdução

`INFORMATION_SCHEMA` fornece acesso a metadados de Database, informações sobre o servidor MySQL como o nome de um Database ou Table, o tipo de dados de uma Column, ou privilégios de acesso. Outros termos que são por vezes utilizados para esta informação são dicionário de dados e catálogo de sistema.

* Notas de Uso do INFORMATION_SCHEMA
* Considerações sobre Character Set
* INFORMATION_SCHEMA como Alternativa para Instruções SHOW
* INFORMATION_SCHEMA e Privilégios
* Considerações sobre Performance
* Considerações sobre Padrões
* Convenções nas Seções de Referência do INFORMATION_SCHEMA
* Informações Relacionadas

### Notas de Uso do INFORMATION_SCHEMA

`INFORMATION_SCHEMA` é um Database dentro de cada instância MySQL, o local que armazena informações sobre todos os outros Databases que o servidor MySQL mantém. O Database `INFORMATION_SCHEMA` contém várias Tables somente leitura. Na verdade, são views, e não base tables, portanto, não há arquivos associados a elas, e você não pode definir triggers nelas. Além disso, não há um diretório de Database com esse nome.

Embora você possa selecionar `INFORMATION_SCHEMA` como o Database padrão com uma instrução `USE`, você pode apenas ler o conteúdo das Tables, e não realizar operações `INSERT`, `UPDATE` ou `DELETE` nelas.

Aqui está um exemplo de uma instrução que recupera informações do `INFORMATION_SCHEMA`:

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

Explicação: A instrução solicita uma lista de todas as Tables no Database `db5`, mostrando apenas três informações: o nome da Table, seu tipo e seu storage engine.

### Considerações sobre Character Set

A definição para character columns (por exemplo, `TABLES.TABLE_NAME`) é geralmente `VARCHAR(N) CHARACTER SET utf8`, onde *`N`* é pelo menos 64. O MySQL usa o collation padrão para este character set (`utf8_general_ci`) para todas as buscas, ordenações (sorts), comparações e outras operações de string nessas columns.

Como alguns objetos MySQL são representados como arquivos, as buscas em string columns do `INFORMATION_SCHEMA` podem ser afetadas pela sensibilidade a maiúsculas e minúsculas do sistema de arquivos (file system case sensitivity). Para mais informações, consulte Section 10.8.7, “Using Collation in INFORMATION_SCHEMA Searches”.

### INFORMATION_SCHEMA como Alternativa para Instruções SHOW

A instrução `SELECT ... FROM INFORMATION_SCHEMA` destina-se a ser uma forma mais consistente de fornecer acesso às informações fornecidas pelas várias instruções `SHOW` que o MySQL suporta (`SHOW DATABASES`, `SHOW TABLES`, e assim por diante). O uso de `SELECT` tem estas vantagens, em comparação com `SHOW`:

* Está em conformidade com as regras de Codd, pois todo o acesso é feito em Tables.

* Você pode usar a sintaxe familiar da instrução `SELECT` e precisa apenas aprender alguns nomes de Table e Column.

* O implementador não precisa se preocupar em adicionar palavras-chave (keywords).
* Você pode filtrar, ordenar (sort), concatenar e transformar os resultados de Queries do `INFORMATION_SCHEMA` para o formato que sua aplicação precisar, como uma estrutura de dados ou uma representação de texto para parsear.

* Essa técnica é mais interoperável com outros sistemas de Database. Por exemplo, usuários do Oracle Database estão familiarizados com o Query em Tables no dicionário de dados Oracle.

Como `SHOW` é familiar e amplamente usado, as instruções `SHOW` permanecem como uma alternativa. De fato, juntamente com a implementação do `INFORMATION_SCHEMA`, existem aprimoramentos no `SHOW`, conforme descrito em Section 24.8, “Extensions to SHOW Statements”.

### INFORMATION_SCHEMA e Privilégios

Para a maioria das Tables do `INFORMATION_SCHEMA`, cada usuário MySQL tem o direito de acessá-las, mas só pode ver as linhas nas Tables que correspondem a objetos para os quais o usuário tem os privilégios de acesso apropriados. Em alguns casos (por exemplo, a Column `ROUTINE_DEFINITION` na Table `ROUTINES` do `INFORMATION_SCHEMA`), usuários que têm privilégios insuficientes veem `NULL`. Algumas Tables têm requisitos de privilégio diferentes; para estas, os requisitos são mencionados nas descrições de Table aplicáveis. Por exemplo, Tables `InnoDB` (Tables com nomes que começam com `INNODB_`) exigem o privilégio `PROCESS`.

Os mesmos privilégios se aplicam ao selecionar informações do `INFORMATION_SCHEMA` e ao visualizar as mesmas informações através de instruções `SHOW`. Em ambos os casos, você deve ter algum privilégio em um objeto para ver informações sobre ele.

### Considerações sobre Performance

Queries do `INFORMATION_SCHEMA` que buscam informações de mais de um Database podem levar muito tempo e impactar a performance. Para verificar a eficiência de uma Query, você pode usar `EXPLAIN`. Para obter informações sobre o uso da saída do `EXPLAIN` para otimizar Queries do `INFORMATION_SCHEMA`, consulte Section 8.2.3, “Optimizing INFORMATION_SCHEMA Queries”.

### Considerações sobre Padrões

A implementação para as estruturas de Table do `INFORMATION_SCHEMA` no MySQL segue o padrão ANSI/ISO SQL:2003 Parte 11 *Schemata*. Nossa intenção é a conformidade aproximada com o recurso central F021 *Basic information schema* do SQL:2003.

Usuários do SQL Server 2000 (que também segue o padrão) podem notar uma forte similaridade. No entanto, o MySQL omitiu muitas Columns que não são relevantes para nossa implementação e adicionou Columns que são específicas do MySQL. Uma dessas Columns adicionadas é a Column `ENGINE` na Table `TABLES` do `INFORMATION_SCHEMA`.

Embora outros DBMSs usem uma variedade de nomes, como `syscat` ou `system`, o nome padrão é `INFORMATION_SCHEMA`.

Para evitar o uso de qualquer nome reservado no padrão ou no DB2, SQL Server ou Oracle, alteramos os nomes de algumas Columns marcadas como “MySQL extension”. (Por exemplo, alteramos `COLLATION` para `TABLE_COLLATION` na Table `TABLES`.) Veja a lista de palavras reservadas perto do final deste artigo: <https://web.archive.org/web/20070428032454/http://www.dbazine.com/db2/db2-disarticles/gulutzan5>.

### Convenções nas Seções de Referência do INFORMATION_SCHEMA

As seções a seguir descrevem cada uma das Tables e Columns no `INFORMATION_SCHEMA`. Para cada Column, há três informações:

* “Nome do `INFORMATION_SCHEMA`” indica o nome para a Column na Table do `INFORMATION_SCHEMA`. Isso corresponde ao nome SQL padrão, a menos que o campo “Observações” diga “MySQL extension.”

* “Nome do `SHOW`” indica o nome de campo equivalente na instrução `SHOW` mais próxima, se houver.

* “Observações” fornece informações adicionais onde aplicável. Se este campo for `NULL`, significa que o valor da Column é sempre `NULL`. Se este campo disser “MySQL extension”, a Column é uma extensão MySQL para o SQL padrão.

Muitas seções indicam qual instrução `SHOW` é equivalente a um `SELECT` que recupera informações do `INFORMATION_SCHEMA`. Para instruções `SHOW` que exibem informações para o Database padrão se você omitir uma cláusula `FROM db_name`, muitas vezes você pode selecionar informações para o Database padrão adicionando uma condição `AND TABLE_SCHEMA = SCHEMA()` à cláusula `WHERE` de uma Query que recupera informações de uma Table do `INFORMATION_SCHEMA`.

### Informações Relacionadas

Estas seções discutem tópicos adicionais relacionados ao `INFORMATION_SCHEMA`:

* informações sobre Tables do `INFORMATION_SCHEMA` específicas do storage engine `InnoDB`: Section 24.4, “INFORMATION_SCHEMA InnoDB Tables”

* informações sobre Tables do `INFORMATION_SCHEMA` específicas do plugin Thread Pool: Section 24.5, “INFORMATION_SCHEMA Thread Pool Tables”

* informações sobre Tables do `INFORMATION_SCHEMA` específicas do plugin `CONNECTION_CONTROL`: Section 24.6, “INFORMATION_SCHEMA Connection Control Tables”

* Respostas para perguntas frequentemente feitas sobre o Database `INFORMATION_SCHEMA`: Section A.7, “MySQL 5.7 FAQ: INFORMATION_SCHEMA”

* Queries do `INFORMATION_SCHEMA` e o optimizer: Section 8.2.3, “Optimizing INFORMATION_SCHEMA Queries”

* O efeito do collation nas comparações do `INFORMATION_SCHEMA`: Section 10.8.7, “Using Collation in INFORMATION_SCHEMA Searches”
