### 9.2.3 Sensibilidade a Maiúsculas e Minúsculas de Identificadores

Em MySQL, Databases correspondem a diretórios dentro do data directory. Cada table dentro de um Database corresponde a pelo menos um file dentro do Database directory (e possivelmente mais, dependendo do storage engine). Triggers também correspondem a files. Consequentemente, a sensibilidade a maiúsculas e minúsculas do operating system subjacente tem um papel na sensibilidade a maiúsculas e minúsculas dos nomes de Database, table e trigger. Isso significa que tais nomes não são sensíveis a maiúsculas e minúsculas no Windows, mas são sensíveis na maioria das variedades de Unix. Uma exceção notável é o macOS, que é baseado em Unix mas usa um tipo de file system (HFS+) padrão que não é sensível a maiúsculas e minúsculas. No entanto, o macOS também suporta volumes UFS, que são sensíveis a maiúsculas e minúsculas, assim como em qualquer Unix. Veja Seção 1.6.1, “Extensões MySQL para SQL Padrão”. A system variable `lower_case_table_names` também afeta como o server lida com a sensibilidade a maiúsculas e minúsculas de identificadores, conforme descrito mais adiante nesta seção.

Nota

Embora nomes de Database, table e trigger não sejam sensíveis a maiúsculas e minúsculas em algumas plataformas, você não deve se referir a um deles usando caixas diferentes dentro do mesmo statement. O seguinte statement não funcionaria porque se refere a uma table tanto como `my_table` quanto como `MY_TABLE`:

```sql
mysql> SELECT * FROM my_table WHERE MY_TABLE.col=1;
```

Nomes de Column, Index, stored routine e event não são sensíveis a maiúsculas e minúsculas em nenhuma plataforma, nem os column aliases.

No entanto, nomes de logfile groups são sensíveis a maiúsculas e minúsculas. Isso difere do SQL padrão.

Por padrão, table aliases são sensíveis a maiúsculas e minúsculas no Unix, mas não no Windows ou macOS. O seguinte statement não funcionaria no Unix, porque se refere ao alias tanto como `a` quanto como `A`:

```sql
mysql> SELECT col_name FROM tbl_name AS a
       WHERE a.col_name = 1 OR A.col_name = 2;
```

No entanto, este mesmo statement é permitido no Windows. Para evitar problemas causados por tais diferenças, é melhor adotar uma convenção consistente, como sempre criar e referir-se a Databases e tables usando nomes em minúsculas. Esta convenção é recomendada para máxima portabilidade e facilidade de uso.

Como os nomes de table e Database são armazenados em disco e usados no MySQL é afetado pela system variable `lower_case_table_names`, que você pode definir ao iniciar o **mysqld**. `lower_case_table_names` pode assumir os valores mostrados na tabela a seguir. Esta variável *não* afeta a sensibilidade a maiúsculas e minúsculas de trigger identifiers. No Unix, o valor padrão de `lower_case_table_names` é 0. No Windows, o valor padrão é 1. No macOS, o valor padrão é 2.

<table summary="Valores para a system variable lower_case_table_names."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>0</code></td> <td>Os nomes de Table e Database são armazenados em disco usando a caixa de letras especificada no statement <code>CREATE TABLE</code> ou <code>CREATE DATABASE</code>. Comparações de nomes são sensíveis a maiúsculas e minúsculas. Você <span><em>não</em></span> deve definir esta variável para 0 se estiver executando o MySQL em um sistema que tenha file names que não são sensíveis a maiúsculas e minúsculas (como Windows ou macOS). Se você forçar esta variável a 0 com <code>--lower-case-table-names=0</code> em um file system que não é sensível a maiúsculas e minúsculas e acessar <code>MyISAM</code> tablenames usando diferentes caixas de letras, pode ocorrer corrupção de Index.</td> </tr><tr> <td><code>1</code></td> <td>Os nomes de Table são armazenados em minúsculas no disco e as comparações de nomes não são sensíveis a maiúsculas e minúsculas. O MySQL converte todos os nomes de table para minúsculas no armazenamento e na pesquisa (lookup). Este comportamento também se aplica a nomes de Database e table aliases.</td> </tr><tr> <td><code>2</code></td> <td>Os nomes de Table e Database são armazenados em disco usando a caixa de letras especificada no statement <code>CREATE TABLE</code> ou <code>CREATE DATABASE</code>, mas o MySQL os converte para minúsculas na pesquisa (lookup). Comparações de nomes não são sensíveis a maiúsculas e minúsculas. Isso funciona <span><em>apenas</em></span> em file systems que não são sensíveis a maiúsculas e minúsculas! Nomes de table <code>InnoDB</code> e nomes de view são armazenados em minúsculas, assim como para <code>lower_case_table_names=1</code>.</td> </tr></tbody></table>

Se você estiver usando MySQL em apenas uma plataforma, normalmente não precisa alterar a variável `lower_case_table_names` em relação ao seu valor padrão. No entanto, você pode encontrar dificuldades se quiser transferir tables entre plataformas que diferem na sensibilidade a maiúsculas e minúsculas do file system. Por exemplo, no Unix, você pode ter duas tables diferentes chamadas `my_table` e `MY_TABLE`, mas no Windows esses dois nomes são considerados idênticos. Para evitar problemas de transferência de dados decorrentes da caixa de letras de nomes de Database ou table, você tem duas opções:

* Use `lower_case_table_names=1` em todos os sistemas. A principal desvantagem disso é que quando você usa `SHOW TABLES` ou `SHOW DATABASES`, você não vê os nomes na sua caixa de letras original.

* Use `lower_case_table_names=0` no Unix e `lower_case_table_names=2` no Windows. Isso preserva a caixa de letras dos nomes de Database e table. A desvantagem disso é que você deve garantir que seus statements sempre se refiram aos nomes de seus Database e table com a caixa de letras correta no Windows. Se você transferir seus statements para o Unix, onde a caixa de letras é significativa, eles não funcionarão se a caixa de letras estiver incorreta.

  **Exceção**: Se você estiver usando tables `InnoDB` e estiver tentando evitar esses problemas de transferência de dados, você deve definir `lower_case_table_names` como 1 em todas as plataformas para forçar que os nomes sejam convertidos para minúsculas.

Se você planeja definir a system variable `lower_case_table_names` para 1 no Unix, você deve primeiro converter seus nomes antigos de Database e table para minúsculas antes de parar o **mysqld** e reiniciá-lo com a nova configuração da variável. Para fazer isso para uma table individual, use `RENAME TABLE`:

```sql
RENAME TABLE T1 TO t1;
```

Para converter um ou mais Databases inteiros, faça o dump deles antes de definir `lower_case_table_names`, depois descarte os Databases e recarregue-os após definir `lower_case_table_names`:

1. Use **mysqldump** para fazer o dump de cada Database:

   ```sql
   mysqldump --databases db1 > db1.sql
   mysqldump --databases db2 > db2.sql
   ...
   ```

   Faça isso para cada Database que deve ser recriado.

2. Use `DROP DATABASE` para descartar cada Database.
3. Pare o server, defina `lower_case_table_names` e reinicie o server.

4. Recarregue o dump file para cada Database. Como `lower_case_table_names` está definida, cada nome de Database e table é convertido para minúsculas à medida que é recriado:

   ```sql
   mysql < db1.sql
   mysql < db2.sql
   ...
   ```

Nomes de objeto podem ser considerados duplicados se suas formas em maiúsculas forem iguais de acordo com uma binary collation. Isso é verdade para nomes de cursors, conditions, procedures, functions, savepoints, stored routine parameters, stored program local variables e plugins. Não é verdade para nomes de columns, constraints, databases, partitions, statements prepared com `PREPARE`, tables, triggers, users e user-defined variables.

A sensibilidade a maiúsculas e minúsculas do file system pode afetar as buscas em string columns de tables `INFORMATION_SCHEMA`. Para mais informações, veja Seção 10.8.7, “Usando Collation em Buscas no INFORMATION_SCHEMA”.