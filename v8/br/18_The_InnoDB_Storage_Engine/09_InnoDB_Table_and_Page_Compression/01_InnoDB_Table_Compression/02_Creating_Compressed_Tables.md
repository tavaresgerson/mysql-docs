#### 17.9.1.2 Criando tabelas compactadas

As tabelas compactadas podem ser criadas em espaços de tabelas por arquivo ou em espaços de tabelas gerais. A compactação de tabelas não está disponível para o espaço de tabela do sistema InnoDB. O espaço de tabela do sistema (espaço 0, os arquivos .ibdata) pode conter tabelas criadas pelo usuário, mas também contém dados internos do sistema, que nunca são compactados. Assim, a compactação se aplica apenas às tabelas (e índices) armazenadas em espaços de tabelas por arquivo ou espaços de tabelas gerais.

##### Criando uma tabela compactada no espaço de tabela por arquivo

Para criar uma tabela compactada em um espaço de tabela por arquivo, o `innodb_file_per_table` deve estar habilitado (o padrão). Você pode definir esse parâmetro no arquivo de configuração do MySQL (`my.cnf` ou `my.ini`) ou dinamicamente, usando uma declaração `SET`.

Após a opção `innodb_file_per_table` ser configurada, especifique a cláusula `ROW_FORMAT=COMPRESSED` ou a cláusula `KEY_BLOCK_SIZE`, ou ambas, em uma declaração `CREATE TABLE` ou `ALTER TABLE` para criar uma tabela compactada em um espaço de tabelas por arquivo.

Por exemplo, você pode usar as seguintes declarações:

```
SET GLOBAL innodb_file_per_table=1;
CREATE TABLE t1
 (c1 INT PRIMARY KEY)
 ROW_FORMAT=COMPRESSED
 KEY_BLOCK_SIZE=8;
```

##### Criando uma tabela compactada em um espaço de tabelas geral

Para criar uma tabela compactada em um espaço de tabelas geral, `FILE_BLOCK_SIZE` deve ser definido para o espaço de tabelas geral, que é especificado quando o espaço de tabelas é criado. O valor `FILE_BLOCK_SIZE` deve ser um tamanho de página compactada válido em relação ao valor `innodb_page_size`, e o tamanho de página da tabela compactada, definido pela cláusula `CREATE TABLE` ou `ALTER TABLE` `KEY_BLOCK_SIZE`, deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16384` e `FILE_BLOCK_SIZE=8192`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

O exemplo a seguir demonstra como criar um espaço de tabelas geral e adicionar uma tabela comprimida. O exemplo assume um `innodb_page_size` padrão de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela comprimida tenha um `KEY_BLOCK_SIZE` de 8.

```
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

##### Notas

- A partir do MySQL 8.0, o arquivo de espaço de tabela para uma tabela compactada é criado usando o tamanho de página física em vez do tamanho de página `InnoDB`, o que faz com que o tamanho inicial de um arquivo de espaço de tabela para uma tabela vazia compactada seja menor do que em versões anteriores do MySQL.

- Se você especificar `ROW_FORMAT=COMPRESSED`, pode omitir `KEY_BLOCK_SIZE`; o ajuste `KEY_BLOCK_SIZE` tem o valor padrão da metade do valor de `innodb_page_size`.

- Se você especificar um valor válido para `KEY_BLOCK_SIZE`, você pode omitir `ROW_FORMAT=COMPRESSED`; a compressão é ativada automaticamente.

- Para determinar o melhor valor para `KEY_BLOCK_SIZE,`, geralmente você cria várias cópias da mesma tabela com diferentes valores para essa cláusula, depois mede o tamanho dos arquivos resultantes de `.ibd` e verifica o desempenho de cada um com uma carga de trabalho realista. Para tabelas gerais, tenha em mente que a remoção de uma tabela não reduz o tamanho do arquivo do espaço de tabelas geral `.ibd`, nem retorna espaço em disco ao sistema operacional. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

- O valor `KEY_BLOCK_SIZE` é tratado como um indicativo; um tamanho diferente pode ser usado pelo `InnoDB` se necessário. Para os espaços de tabela por arquivo, o `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor `innodb_page_size`. Se você especificar um valor maior que o valor `innodb_page_size`, o valor especificado é ignorado, um aviso é emitido e `KEY_BLOCK_SIZE` é definido como metade do valor `innodb_page_size`. Se `innodb_strict_mode=ON`, especificar um valor `KEY_BLOCK_SIZE` inválido retorna um erro. Para espaços de tabela gerais, os valores válidos `KEY_BLOCK_SIZE` dependem da configuração `FILE_BLOCK_SIZE` do espaço de tabela. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabela Geral”.

- `InnoDB` suporta tamanhos de página de 32 KB e 64 KB, mas esses tamanhos de página não suportam compressão. Para mais informações, consulte a documentação do `innodb_page_size`.

- O tamanho padrão não compactado das páginas de dados do `InnoDB` é de 16 KB. Dependendo da combinação dos valores das opções, o MySQL usa um tamanho de página de 1 KB, 2 KB, 4 KB, 8 KB ou 16 KB para o arquivo de dados do espaço de tabelas (arquivo `.ibd`). O algoritmo de compressão real não é afetado pelo valor do `KEY_BLOCK_SIZE`; o valor determina o tamanho de cada bloco comprimido, o que, por sua vez, afeta quantos registros podem ser compactados em cada página comprimida.

- Ao criar uma tabela compactada em um espaço de tabela por arquivo, definir `KEY_BLOCK_SIZE` igual ao tamanho de página `InnoDB` geralmente não resulta em muita compressão. Por exemplo, definir `KEY_BLOCK_SIZE=16` geralmente não resultaria em muita compressão, já que o tamanho de página normal `InnoDB` é de 16 KB. Esse ajuste ainda pode ser útil para tabelas com muitas colunas longas `BLOB`, `VARCHAR` ou `TEXT`, pois esses valores geralmente se comprimem bem e, portanto, podem exigir menos páginas de sobreposição, conforme descrito na Seção 17.9.1.5, “Como a compressão funciona para tabelas InnoDB”. Para espaços de tabela gerais, um valor de `KEY_BLOCK_SIZE` igual ao tamanho de página `InnoDB` não é permitido. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de tabela gerais”.

- Todos os índices de uma tabela (incluindo o índice agrupado) são compactados usando o mesmo tamanho de página, conforme especificado na declaração `CREATE TABLE` ou `ALTER TABLE`. Atributos da tabela, como `ROW_FORMAT` e `KEY_BLOCK_SIZE`, não fazem parte da sintaxe `CREATE INDEX` para tabelas `InnoDB`, e são ignorados se forem especificados (embora, se especificados, apareçam na saída da declaração `SHOW CREATE TABLE`).

- Para opções de configuração relacionadas ao desempenho, consulte a Seção 17.9.1.3, “Ajuste da Compressão para Tabelas InnoDB”.

##### Restrições para tabelas compactadas

- Tabelas compactadas não podem ser armazenadas no espaço de tabela `InnoDB` do sistema.

- Os espaços de tabelas gerais podem conter várias tabelas, mas tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabelas gerais.

- A compressão se aplica a uma tabela inteira e a todos os índices associados, e não a linhas individuais, apesar do nome da cláusula `ROW_FORMAT`.

- `InnoDB` não suporta tabelas temporárias compactadas. Quando `innodb_strict_mode` está habilitado (padrão), `CREATE TEMPORARY TABLE` retorna erros se `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` for especificado. Se `innodb_strict_mode` for desativado, avisos são emitidos e a tabela temporária é criada usando um formato de linha não compactado. As mesmas restrições se aplicam às operações `ALTER TABLE` em tabelas temporárias.
