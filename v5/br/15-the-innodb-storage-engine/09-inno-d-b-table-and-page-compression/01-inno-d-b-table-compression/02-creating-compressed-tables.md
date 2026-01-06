#### 14.9.1.2 Criando tabelas compactadas

As tabelas compactadas podem ser criadas em espaços de tabelas por arquivo ou em espaços de tabelas gerais. A compactação de tabelas não está disponível para o espaço de tabela do sistema InnoDB. O espaço de tabela do sistema (espaço 0, os arquivos .ibdata) pode conter tabelas criadas pelo usuário, mas também contém dados internos do sistema, que nunca são compactados. Assim, a compactação se aplica apenas às tabelas (e índices) armazenadas em espaços de tabelas por arquivo ou espaços de tabelas gerais.

##### Criando uma tabela compactada no espaço de tabela por arquivo

Para criar uma tabela compactada em um espaço de tabela por arquivo, o `innodb_file_per_table` deve estar habilitado (o padrão no MySQL 5.6.6) e o `innodb_file_format` deve ser definido como `Barracuda`. Você pode definir esses parâmetros no arquivo de configuração do MySQL (`my.cnf` ou `my.ini`) ou dinamicamente, usando uma instrução `SET`.

Após as opções `innodb_file_per_table` e `innodb_file_format` serem configuradas, especifique a cláusula `ROW_FORMAT=COMPRESSED` ou a cláusula `KEY_BLOCK_SIZE`, ou ambas, em uma instrução `CREATE TABLE` ou `ALTER TABLE` para criar uma tabela comprimida em um espaço de tabelas por arquivo.

Por exemplo, você pode usar as seguintes declarações:

```sql
SET GLOBAL innodb_file_per_table=1;
SET GLOBAL innodb_file_format=Barracuda;
CREATE TABLE t1
 (c1 INT PRIMARY KEY)
 ROW_FORMAT=COMPRESSED
 KEY_BLOCK_SIZE=8;
```

##### Criando uma tabela compactada em um espaço de tabelas geral

Para criar uma tabela compactada em um espaço de tabelas geral, o valor `FILE_BLOCK_SIZE` deve ser definido para o espaço de tabelas geral, que é especificado quando o espaço de tabelas é criado. O valor `FILE_BLOCK_SIZE` deve ser um tamanho de página compactada válido em relação ao valor `innodb_page_size`, e o tamanho de página da tabela compactada, definido pela cláusula `CREATE TABLE` ou `ALTER TABLE` `KEY_BLOCK_SIZE`, deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16384` e `FILE_BLOCK_SIZE=8192`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

O exemplo a seguir demonstra como criar um espaço de tabelas geral e adicionar uma tabela compactada. O exemplo assume um tamanho padrão de `innodb_page_size` de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela compactada tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

##### Notas

- Se você especificar `ROW_FORMAT=COMPRESSED`, pode omitir `KEY_BLOCK_SIZE`; o ajuste `KEY_BLOCK_SIZE` tem como padrão metade do valor de `innodb_page_size`.

- Se você especificar um valor válido para `KEY_BLOCK_SIZE`, você pode omitir `ROW_FORMAT=COMPRESSED`; a compressão é habilitada automaticamente.

- Para determinar o melhor valor para `KEY_BLOCK_SIZE,`, geralmente você cria várias cópias da mesma tabela com diferentes valores para essa cláusula, depois mede o tamanho dos arquivos `.ibd` resultantes e verifica o desempenho de cada uma com uma carga de trabalho realista. Para espaços de tabelas gerais, tenha em mente que a remoção de uma tabela não reduz o tamanho do arquivo `.ibd` do espaço de tabelas geral, nem retorna espaço em disco ao sistema operacional. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

- O valor `KEY_BLOCK_SIZE` é tratado como um indicativo; o `InnoDB` pode usar um tamanho diferente, se necessário. Para os espaços de tabela por arquivo, o `KEY_BLOCK_SIZE` pode ser menor ou igual ao valor `innodb_page_size`. Se você especificar um valor maior que o valor `innodb_page_size`, o valor especificado é ignorado, uma mensagem de aviso é emitida e o `KEY_BLOCK_SIZE` é definido para metade do valor `innodb_page_size`. Se `innodb_strict_mode=ON`, especificar um valor inválido para `KEY_BLOCK_SIZE` retorna um erro. Para espaços de tabela gerais, os valores válidos de `KEY_BLOCK_SIZE` dependem do ajuste `FILE_BLOCK_SIZE` do espaço de tabela. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabela Gerais”.

- Os tamanhos de página de 32 KB e 64 KB não suportam compressão. Para obter mais informações, consulte a documentação do `innodb_page_size`.

- O tamanho padrão não compactado das páginas de dados do `InnoDB` é de 16 KB. Dependendo da combinação dos valores das opções, o MySQL usa um tamanho de página de 1 KB, 2 KB, 4 KB, 8 KB ou 16 KB para o arquivo de dados do espaço de tabelas (arquivo `.ibd`). O algoritmo de compressão real não é afetado pelo valor de `KEY_BLOCK_SIZE`; o valor determina o tamanho de cada bloco comprimido, o que, por sua vez, afeta quantos registros podem ser compactados em cada página comprimida.

- Ao criar uma tabela compactada em um espaço de tabela por arquivo, definir `KEY_BLOCK_SIZE` igual ao tamanho da página do `InnoDB` geralmente não resulta em muita compressão. Por exemplo, definir `KEY_BLOCK_SIZE=16` geralmente não resultaria em muita compressão, já que o tamanho normal da página do `InnoDB` é de 16 KB. Esse ajuste ainda pode ser útil para tabelas com muitas colunas longas de tipos `BLOB`, `VARCHAR` ou `TEXT`, pois esses valores geralmente se comprimem bem e, portanto, podem exigir menos páginas de overflow, conforme descrito na Seção 14.9.1.5, “Como a compressão funciona para tabelas InnoDB”. Para espaços de tabela gerais, um valor de `KEY_BLOCK_SIZE` igual ao tamanho da página do `InnoDB` não é permitido. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de tabela gerais”.

- Todos os índices de uma tabela (incluindo o índice agrupado) são compactados com o mesmo tamanho de página, conforme especificado na instrução `CREATE TABLE` ou `ALTER TABLE`. Atributos da tabela, como `ROW_FORMAT` e `KEY_BLOCK_SIZE`, não fazem parte da sintaxe `CREATE INDEX` para tabelas `InnoDB` e são ignorados se forem especificados (embora, se especificados, apareçam na saída da instrução `SHOW CREATE TABLE`).

- Para opções de configuração relacionadas ao desempenho, consulte a Seção 14.9.1.3, “Ajuste da Compressão para Tabelas InnoDB”.

##### Restrições para tabelas compactadas

- As versões do MySQL anteriores à 5.1 não podem processar tabelas compactadas.

- Tabelas compactadas não podem ser armazenadas no espaço de tabela do sistema `InnoDB`.

- Os espaços de tabelas gerais podem conter várias tabelas, mas tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabelas gerais.

- A compressão se aplica a uma tabela inteira e a todos os índices associados, e não a linhas individuais, apesar do nome da cláusula `ROW_FORMAT`.
