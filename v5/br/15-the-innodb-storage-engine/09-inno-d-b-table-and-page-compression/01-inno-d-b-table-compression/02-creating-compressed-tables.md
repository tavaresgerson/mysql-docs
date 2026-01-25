#### 14.9.1.2 Criação de Tabelas Comprimidas

Tabelas comprimidas podem ser criadas em *tablespaces* *file-per-table* ou em *tablespaces* gerais. A compressão de tabela não está disponível para o *InnoDB system tablespace*. O *system tablespace* (espaço 0, os arquivos .ibdata) pode conter tabelas criadas pelo usuário, mas também contém dados internos do sistema, que nunca são comprimidos. Assim, a compressão se aplica apenas a tabelas (e *indexes*) armazenadas em *tablespaces* *file-per-table* ou gerais.

##### Criação de uma Tabela Comprimida em um Tablespace File-Per-Table

Para criar uma tabela comprimida em um *tablespace* *file-per-table*, `innodb_file_per_table` deve estar habilitado (o padrão no MySQL 5.6.6) e `innodb_file_format` deve ser definido como `Barracuda`. Você pode configurar esses parâmetros no arquivo de configuração do MySQL (`my.cnf` ou `my.ini`) ou dinamicamente, usando uma instrução `SET`.

Após as opções `innodb_file_per_table` e `innodb_file_format` estarem configuradas, especifique a cláusula `ROW_FORMAT=COMPRESSED` ou a cláusula `KEY_BLOCK_SIZE`, ou ambas, em uma instrução `CREATE TABLE` ou `ALTER TABLE` para criar uma tabela comprimida em um *tablespace* *file-per-table*.

Por exemplo, você pode usar as seguintes instruções:

```sql
SET GLOBAL innodb_file_per_table=1;
SET GLOBAL innodb_file_format=Barracuda;
CREATE TABLE t1
 (c1 INT PRIMARY KEY)
 ROW_FORMAT=COMPRESSED
 KEY_BLOCK_SIZE=8;
```

##### Criação de uma Tabela Comprimida em um Tablespace Geral

Para criar uma tabela comprimida em um *general tablespace*, `FILE_BLOCK_SIZE` deve ser definido para o *general tablespace*, o que é especificado quando o *tablespace* é criado. O valor de `FILE_BLOCK_SIZE` deve ser um tamanho de página comprimida válido em relação ao valor de `innodb_page_size`, e o tamanho da página da tabela comprimida, definido pela cláusula `KEY_BLOCK_SIZE` no `CREATE TABLE` ou `ALTER TABLE`, deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16384` e `FILE_BLOCK_SIZE=8192`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 14.6.3.3, “General Tablespaces”.

O exemplo a seguir demonstra a criação de um *general tablespace* e a adição de uma tabela comprimida. O exemplo assume um `innodb_page_size` padrão de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela comprimida tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

##### Notas

* Se você especificar `ROW_FORMAT=COMPRESSED`, você pode omitir `KEY_BLOCK_SIZE`; a configuração de `KEY_BLOCK_SIZE` assume como padrão metade do valor de `innodb_page_size`.

* Se você especificar um valor válido para `KEY_BLOCK_SIZE`, você pode omitir `ROW_FORMAT=COMPRESSED`; a compressão é habilitada automaticamente.

* Para determinar o melhor valor para `KEY_BLOCK_SIZE`, tipicamente você cria várias cópias da mesma tabela com valores diferentes para esta cláusula, depois mede o tamanho dos arquivos `.ibd` resultantes e observa o desempenho de cada um com uma carga de trabalho (*workload*) realista. Para *general tablespaces*, lembre-se de que descartar uma tabela não reduz o tamanho do arquivo `.ibd` do *general tablespace*, nem retorna espaço em disco ao sistema operacional. Para mais informações, consulte a Seção 14.6.3.3, “General Tablespaces”.

* O valor de `KEY_BLOCK_SIZE` é tratado como uma dica (*hint*); um tamanho diferente pode ser usado pelo `InnoDB` se necessário. Para *tablespaces* *file-per-table*, o `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor de `innodb_page_size`. Se você especificar um valor maior que o valor de `innodb_page_size`, o valor especificado será ignorado, um aviso será emitido e `KEY_BLOCK_SIZE` será definido como metade do valor de `innodb_page_size`. Se `innodb_strict_mode=ON`, a especificação de um valor inválido de `KEY_BLOCK_SIZE` retorna um *error*. Para *general tablespaces*, valores válidos de `KEY_BLOCK_SIZE` dependem da configuração `FILE_BLOCK_SIZE` do *tablespace*. Para mais informações, consulte a Seção 14.6.3.3, “General Tablespaces”.

* Tamanhos de página de 32KB e 64KB não suportam compressão. Para mais informações, consulte a documentação de `innodb_page_size`.

* O tamanho padrão não comprimido das páginas de dados do `InnoDB` é 16KB. Dependendo da combinação de valores de opção, o MySQL usa um tamanho de página de 1KB, 2KB, 4KB, 8KB ou 16KB para o arquivo de dados do *tablespace* (arquivo `.ibd`). O algoritmo de compressão real não é afetado pelo valor de `KEY_BLOCK_SIZE`; o valor determina o quão grande é cada pedaço comprimido (*chunk*), o que, por sua vez, afeta quantas *rows* podem ser empacotadas em cada página comprimida.

* Ao criar uma tabela comprimida em um *tablespace* *file-per-table*, definir `KEY_BLOCK_SIZE` igual ao tamanho de página do `InnoDB` geralmente não resulta em muita compressão. Por exemplo, definir `KEY_BLOCK_SIZE=16` tipicamente não resultaria em muita compressão, visto que o tamanho normal da página do `InnoDB` é 16KB. Esta configuração ainda pode ser útil para tabelas com muitas colunas longas `BLOB`, `VARCHAR` ou `TEXT`, porque esses valores geralmente se comprimem bem e, portanto, podem exigir menos páginas de *overflow*, conforme descrito na Seção 14.9.1.5, “How Compression Works for InnoDB Tables”. Para *general tablespaces*, um valor de `KEY_BLOCK_SIZE` igual ao tamanho de página do `InnoDB` não é permitido. Para mais informações, consulte a Seção 14.6.3.3, “General Tablespaces”.

* Todos os *indexes* de uma tabela (incluindo o *clustered index*) são comprimidos usando o mesmo tamanho de página, conforme especificado na instrução `CREATE TABLE` ou `ALTER TABLE`. Atributos de tabela como `ROW_FORMAT` e `KEY_BLOCK_SIZE` não fazem parte da sintaxe `CREATE INDEX` para tabelas `InnoDB` e são ignorados se forem especificados (embora, se especificados, eles apareçam na saída da instrução `SHOW CREATE TABLE`).

* Para opções de configuração relacionadas a performance, consulte a Seção 14.9.1.3, “Tuning Compression for InnoDB Tables”.

##### Restrições em Tabelas Comprimidas

* Versões do MySQL anteriores a 5.1 não conseguem processar tabelas comprimidas.

* Tabelas comprimidas não podem ser armazenadas no *InnoDB system tablespace*.

* *General tablespaces* podem conter múltiplas tabelas, mas tabelas comprimidas e não comprimidas não podem coexistir dentro do mesmo *general tablespace*.

* A compressão se aplica a uma tabela inteira e a todos os seus *indexes* associados, e não a *rows* individuais, apesar do nome da cláusula `ROW_FORMAT`.