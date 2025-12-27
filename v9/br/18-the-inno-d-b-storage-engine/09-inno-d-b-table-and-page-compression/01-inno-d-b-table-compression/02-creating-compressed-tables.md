#### 17.9.1.2 Criando Tabelas Compridas

Tabelas comprimidas podem ser criadas em espaços de tabelas por arquivo ou em espaços de tabelas gerais. A compressão de tabelas não está disponível para o espaço de tabelas do sistema InnoDB. O espaço de tabelas do sistema (espaço 0, os arquivos .ibdata) pode conter tabelas criadas pelo usuário, mas também contém dados internos do sistema, que nunca são comprimidos. Assim, a compressão se aplica apenas a tabelas (e índices) armazenadas em espaços de tabelas por arquivo ou espaços de tabelas gerais.

##### Criando uma Tabela Compressa em um Espaço de Tabelas por Arquivo

Para criar uma tabela comprimida em um espaço de tabelas por arquivo, `innodb_file_per_table` deve estar habilitado (o padrão). Você pode definir esse parâmetro no arquivo de configuração do MySQL (`my.cnf` ou `my.ini`) ou dinamicamente, usando uma declaração `SET`.

Após a opção `innodb_file_per_table` ser configurada, especifique a cláusula `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE`, ou ambas, em uma declaração `CREATE TABLE` ou `ALTER TABLE` para criar uma tabela comprimida em um espaço de tabelas por arquivo.

Por exemplo, você pode usar as seguintes declarações:

```
SET GLOBAL innodb_file_per_table=1;
CREATE TABLE t1
 (c1 INT PRIMARY KEY)
 ROW_FORMAT=COMPRESSED
 KEY_BLOCK_SIZE=8;
```

##### Criando uma Tabela Compressa em um Espaço de Tabelas Gerais

Para criar uma tabela comprimida em um espaço de tabelas gerais, `FILE_BLOCK_SIZE` deve ser definido para o espaço de tabelas gerais, que é especificado ao criar o espaço de tabelas. O valor de `FILE_BLOCK_SIZE` deve ser um tamanho de página comprimida válido em relação ao valor `innodb_page_size`, e o tamanho de página da tabela comprimida, definido pela cláusula `KEY_BLOCK_SIZE` da declaração `CREATE TABLE` ou `ALTER TABLE`, deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16384` e `FILE_BLOCK_SIZE=8192`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

O exemplo a seguir demonstra como criar um espaço de tabelas geral e adicionar uma tabela compactada. O exemplo assume um tamanho padrão de `innodb_page_size` de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela compactada tenha um `KEY_BLOCK_SIZE` de 8.

```
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

##### Notas

* A partir do MySQL 9.5, o arquivo do espaço de tabelas para uma tabela compactada é criado usando o tamanho de página física em vez do tamanho de página `InnoDB`, o que torna o tamanho inicial de um arquivo de espaço de tabelas para uma tabela compactada vazia menor do que em versões anteriores do MySQL.

* Se você especificar `ROW_FORMAT=COMPRESSED`, pode omitir `KEY_BLOCK_SIZE`; o ajuste `KEY_BLOCK_SIZE` tem um valor padrão de metade do valor de `innodb_page_size`.

* Se você especificar um valor válido para `KEY_BLOCK_SIZE`, pode omitir `ROW_FORMAT=COMPRESSED`; a compressão é habilitada automaticamente.

* Para determinar o melhor valor para `KEY_BLOCK_SIZE`, geralmente você cria várias cópias da mesma tabela com diferentes valores para essa cláusula, depois mede o tamanho dos arquivos `.ibd` resultantes e vê como cada um se comporta bem com uma carga de trabalho realista. Para espaços de tabelas gerais, tenha em mente que a remoção de uma tabela não reduz o tamanho do arquivo `.ibd` do espaço de tabelas geral, nem retorna espaço em disco ao sistema operacional. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

* O valor `KEY_BLOCK_SIZE` é tratado como um indicativo; o `InnoDB` pode usar um tamanho diferente, se necessário. Para espaços de tabela por arquivo, o `KEY_BLOCK_SIZE` pode ser menor ou igual ao valor `innodb_page_size`. Se você especificar um valor maior que o valor `innodb_page_size`, o valor especificado é ignorado, uma mensagem de aviso é emitida e o `KEY_BLOCK_SIZE` é definido para metade do valor `innodb_page_size`. Se `innodb_strict_mode=ON`, especificar um valor inválido para `KEY_BLOCK_SIZE` retorna um erro. Para espaços de tabela gerais, os valores válidos de `KEY_BLOCK_SIZE` dependem do ajuste `FILE_BLOCK_SIZE` do espaço de tabela. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabela Gerais”.

* O `InnoDB` suporta tamanhos de página de 32KB e 64KB, mas esses tamanhos de página não suportam compressão. Para mais informações, consulte a documentação do `innodb_page_size`.

* O tamanho padrão dos dados das páginas do `InnoDB` é de 16KB. Dependendo da combinação de valores de opção, o MySQL usa um tamanho de página de 1KB, 2KB, 4KB, 8KB ou 16KB para o arquivo de dados do espaço de tabela (arquivo `.ibd`). O algoritmo de compressão real não é afetado pelo valor `KEY_BLOCK_SIZE`; o valor determina o tamanho de cada bloco comprimido, o que, por sua vez, afeta quantos registros podem ser compactados em cada página comprimida.

* Ao criar uma tabela compactada em um espaço de tabelas por arquivo, definir `KEY_BLOCK_SIZE` igual ao tamanho da página do `InnoDB` geralmente não resulta em muita compressão. Por exemplo, definir `KEY_BLOCK_SIZE=16` geralmente não resultaria em muita compressão, já que o tamanho normal da página do `InnoDB` é de 16KB. Esse ajuste ainda pode ser útil para tabelas com muitas colunas longas de tipos `BLOB`, `VARCHAR` ou `TEXT`, pois esses valores geralmente se comprimem bem e, portanto, podem exigir menos páginas de overflow, conforme descrito na Seção 17.9.1.5, “Como a Compressão Funciona para Tabelas InnoDB”. Para espaços de tabelas gerais, um valor de `KEY_BLOCK_SIZE` igual ao tamanho da página do `InnoDB` não é permitido. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

* Todos os índices de uma tabela (incluindo o índice agrupado) são compactados usando o mesmo tamanho de página, conforme especificado na instrução `CREATE TABLE` ou `ALTER TABLE`. Atributos da tabela, como `ROW_FORMAT` e `KEY_BLOCK_SIZE`, não fazem parte da sintaxe `CREATE INDEX` para tabelas `InnoDB` e são ignorados se forem especificados (embora, se especificados, apareçam na saída da instrução `SHOW CREATE TABLE`).

* Para opções de configuração relacionadas ao desempenho, consulte a Seção 17.9.1.3, “Ajuste da Compressão para Tabelas InnoDB”.

##### Restrições para Tabelas Compactadas

* Tabelas compactadas não podem ser armazenadas no espaço de tabelas do sistema `InnoDB`.

* Espaços de tabelas gerais podem conter múltiplas tabelas, mas tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabelas gerais.

* A compressão se aplica a toda a tabela e a todos os seus índices associados, e não a linhas individuais, apesar da cláusula `ROW_FORMAT`.

* O `InnoDB` não suporta tabelas temporárias compactadas. Quando o `innodb_strict_mode` está habilitado (o padrão), o `CREATE TEMPORARY TABLE` retorna erros se o `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` for especificado. Se o `innodb_strict_mode` estiver desativado, avisos são emitidos e a tabela temporária é criada usando um formato de linha não compactado. As mesmas restrições se aplicam às operações `ALTER TABLE` em tabelas temporárias.