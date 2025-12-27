### 17.9.2 Compressão de Páginas do InnoDB

O `InnoDB` suporta a compressão de nível de página para tabelas que residem em espaços de tabelas por arquivo. Esse recurso é conhecido como *Compressão de Página Transparente*. A compressão de página é habilitada especificando o atributo `COMPRESSION` com `CREATE TABLE` ou `ALTER TABLE`. Os algoritmos de compressão suportados incluem `Zlib` e `LZ4`.

#### Plataformas Compatíveis

A compressão de página requer suporte a perfuração de buracos e arquivos esparsos. A compressão de página é suportada no Windows com NTFS e nas seguintes subconjuntos de plataformas Linux suportadas pelo MySQL, onde o nível do kernel fornece suporte a perfuração de buracos:

* RHEL 7 e distribuições derivadas que usam a versão 3.10.0-123 ou superior do kernel
* Kernel OEL 5.10 (UEK2) versão 2.6.39 ou superior
* Kernel OEL 6.5 (UEK3) versão 3.8.13 ou superior
* Kernel OEL 7.0 versão 3.8.13 ou superior
* Kernel SLE11 versão 3.0-x
* Kernel SLE12 versão 3.12-x
* Kernel OES11 versão 3.0-x
* Kernel Ubuntu 14.0.4 LTS versão 3.13 ou superior
* Kernel Ubuntu 12.0.4 LTS versão 3.2 ou superior
* Kernel Debian 7 versão 3.2 ou superior

Observação

Todos os sistemas de arquivos disponíveis para uma determinada distribuição Linux podem não suportar perfuração de buracos.

#### Como Funciona a Compressão de Página

Quando uma página é escrita, ela é comprimida usando o algoritmo de compressão especificado. Os dados comprimidos são escritos no disco, onde o mecanismo de perfuração de buracos libera blocos vazios do final da página. Se a compressão falhar, os dados são escritos como estão.

#### Tamanho da Perfuração de Buracos no Linux

Nos sistemas Linux, o tamanho do bloco do sistema de arquivos é o tamanho da unidade usado para perfuração de furos. Portanto, a compressão de páginas só funciona se os dados das páginas puderem ser comprimidos para um tamanho menor ou igual ao tamanho da página `InnoDB` menos o tamanho do bloco do sistema de arquivos. Por exemplo, se `innodb_page_size=16K` e o tamanho do bloco do sistema de arquivos é de 4K, os dados das páginas devem ser comprimidos para menos ou igual a 12K para possibilitar a perfuração de furos.

#### Tamanho do Furo em Windows

Nos sistemas Windows, a infraestrutura subjacente para arquivos esparsos é baseada na compressão NTFS. O tamanho do furo é a unidade de compressão NTFS, que é 16 vezes o tamanho do clúster NTFS. Os tamanhos dos clústeres e suas unidades de compressão são mostrados na tabela a seguir:

**Tabela 17.11 Tamanho do Clúster NTFS e Unidades de Compressão Windows**

<table frame="all" summary="Tamanho do clúster NTFS e unidades de compressão Windows."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Tamanho do Clúster</th> <th>Unidade de Compressão</th> </tr></thead><tbody><tr> <td>512 Bytes</td> <td>8 KB</td> </tr><tr> <td>1 KB</td> <td>16 KB</td> </tr><tr> <td>2 KB</td> <td>32 KB</td> </tr><tr> <td>4 KB</td> <td>64 KB</td> </tr></tbody></table>

A compressão de páginas nos sistemas Windows só funciona se os dados das páginas puderem ser comprimidos para um tamanho menor ou igual ao tamanho da página `InnoDB` menos o tamanho da unidade de compressão.

O tamanho padrão do clúster NTFS é de 4KB, para o qual o tamanho da unidade de compressão é de 64KB. Isso significa que a compressão de páginas não traz nenhum benefício para uma configuração de NTFS Windows pronta para uso, pois o tamanho máximo de `innodb_page_size` também é de 64KB.

Para que a compressão de páginas funcione no Windows, o sistema de arquivos deve ser criado com um tamanho de cluster menor que 4K, e o `innodb_page_size` deve ser pelo menos o dobro do tamanho da unidade de compressão. Por exemplo, para que a compressão de páginas funcione no Windows, você pode construir o sistema de arquivos com um tamanho de cluster de 512 bytes (que tem uma unidade de compressão de 8KB) e inicializar o `InnoDB` com um valor de `innodb_page_size` de 16K ou maior.

#### Habilitando a Compressão de Páginas

Para habilitar a compressão de páginas, especifique o atributo `COMPRESSION` na instrução `CREATE TABLE`. Por exemplo:

```
CREATE TABLE t1 (c1 INT) COMPRESSION="zlib";
```

Você também pode habilitar a compressão de páginas em uma instrução `ALTER TABLE`. No entanto, `ALTER TABLE ... COMPRESSION` apenas atualiza o atributo de compressão do tablespace. As escritas no tablespace que ocorrem após a definição do novo algoritmo de compressão usam o novo ajuste, mas para aplicar o novo algoritmo de compressão a páginas existentes, você deve reconstruir a tabela usando `OPTIMIZE TABLE`.

```
ALTER TABLE t1 COMPRESSION="zlib";
OPTIMIZE TABLE t1;
```

#### Desabilitando a Compressão de Páginas

Para desabilitar a compressão de páginas, defina `COMPRESSION=None` usando `ALTER TABLE`. As escritas no tablespace que ocorrem após a definição de `COMPRESSION=None` não usam mais a compressão de páginas. Para descomprimir páginas existentes, você deve reconstruir a tabela usando `OPTIMIZE TABLE` após a definição de `COMPRESSION=None`.

```
ALTER TABLE t1 COMPRESSION="None";
OPTIMIZE TABLE t1;
```

#### Metadados da Compressão de Páginas

Os metadados da compressão de páginas são encontrados na tabela do esquema de informações `INNODB_TABLESPACES`, nas seguintes colunas:

* `FS_BLOCK_SIZE`: O tamanho do bloco do sistema de arquivos, que é o tamanho de unidade usado para perfuração de buracos.

* `FILE_SIZE`: O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, não comprimido.

* `ALLOCATED_SIZE`: O tamanho real do arquivo, que é a quantidade de espaço alocada no disco.

Nota

Em sistemas semelhantes ao Unix, `ls -l tablespace_name.ibd` mostra o tamanho aparente do arquivo (equivalente a `FILE_SIZE`) em bytes. Para visualizar a quantidade real de espaço alocado no disco (equivalente a `ALLOCATED_SIZE`), use `du --block-size=1 tablespace_name.ibd`. A opção `--block-size=1` imprime o espaço alocado em bytes, em vez de blocos, para que possa ser comparado ao resultado do `ls -l`.

Use `SHOW CREATE TABLE` para visualizar a configuração atual de compressão de página (`Zlib`, `Lz4` ou `None`). Uma tabela pode conter uma mistura de páginas com diferentes configurações de compressão.

No exemplo a seguir, os metadados de compressão de página para a tabela de funcionários são recuperados da tabela do esquema de informações `INNODB_TABLESPACES`.

```
# Create the employees table with Zlib page compression

CREATE TABLE employees (
    emp_no      INT             NOT NULL,
    birth_date  DATE            NOT NULL,
    first_name  VARCHAR(14)     NOT NULL,
    last_name   VARCHAR(16)     NOT NULL,
    gender      ENUM ('M','F')  NOT NULL,
    hire_date   DATE            NOT NULL,
    PRIMARY KEY (emp_no)
) COMPRESSION="zlib";

# Insert data (not shown)

# Query page compression metadata in INFORMATION_SCHEMA.INNODB_TABLESPACES

mysql> SELECT SPACE, NAME, FS_BLOCK_SIZE, FILE_SIZE, ALLOCATED_SIZE FROM
       INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE NAME='employees/employees'\G
*************************** 1. row ***************************
SPACE: 45
NAME: employees/employees
FS_BLOCK_SIZE: 4096
FILE_SIZE: 23068672
ALLOCATED_SIZE: 19415040
```

Os metadados de compressão de página para a tabela de funcionários mostram que o tamanho aparente do arquivo é de 23068672 bytes, enquanto o tamanho real do arquivo (com compressão de página) é de 19415040 bytes. O tamanho do bloco do sistema de arquivos é de 4096 bytes, que é o tamanho do bloco usado para perfuração de buracos.

#### Identificação de Tabelas Usando Compressão de Página

Para identificar tabelas para as quais a compressão de página está habilitada, você pode verificar a coluna `CREATE_OPTIONS` da tabela do esquema de informações `TABLES` para tabelas definidas com o atributo `COMPRESSION`:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%COMPRESSION=%';
+------------+--------------+--------------------+
| TABLE_NAME | TABLE_SCHEMA | CREATE_OPTIONS     |
+------------+--------------+--------------------+
| employees  | test         | COMPRESSION="zlib" |
+------------+--------------+--------------------+
```

`SHOW CREATE TABLE` também mostra o atributo `COMPRESSION`, se usado.

#### Limitações e Notas de Uso da Compressão de Página

* A compressão de página é desabilitada se o tamanho do bloco do sistema de arquivos (ou o tamanho da unidade de compressão no Windows) * 2 > `innodb_page_size`.

* A compressão de página não é suportada para tabelas que residem em espaços de tabelas compartilhados, que incluem o espaço de tabelas do sistema, espaços de tabelas temporários e espaços de tabelas gerais.

* A compactação de páginas não é suportada para tabelas de registro de desfazer.
* A compactação de páginas de registro de refazer não é suportada.
* As páginas do R-tree, que são usadas para índices espaciais, não são compactadas.

* Páginas que pertencem a tabelas compactadas (`ROW_FORMAT=COMPRESSED`) são deixadas como estão.

* Durante a recuperação, as páginas atualizadas são escritas em um formato não compactado.

* Carregar um espaço de tabelas compactado em um servidor que não suporta o algoritmo de compactação usado causa um erro de E/S.

* Antes de fazer uma atualização para uma versão anterior do MySQL que não suporte compactação de páginas, descompacte as tabelas que usam o recurso de compactação de páginas. Para descompacetar uma tabela, execute `ALTER TABLE ... COMPRESSION=None` e `OPTIMIZE TABLE`.

* Espaços de tabelas compactados podem ser copiados entre servidores Linux e Windows se o algoritmo de compactação usado estiver disponível em ambos os servidores.

* Preservar a compactação de páginas ao mover um arquivo de espaço de tabelas compactado de um host para outro requer uma ferramenta que preserve arquivos esparsos.

* Uma melhor compactação de páginas pode ser alcançada no hardware Fusion-io com NVMFS do que em outras plataformas, pois o NVMFS foi projetado para aproveitar a funcionalidade de furos de punho.

* Usar o recurso de compactação de páginas com um tamanho de página `InnoDB` grande e um tamanho de bloco do sistema de arquivos relativamente pequeno pode resultar em amplificação de escrita. Por exemplo, um tamanho máximo de página `InnoDB` de 64 KB com um tamanho de bloco do sistema de arquivos de 4 KB pode melhorar a compactação, mas também pode aumentar a demanda pelo pool de buffers, levando a um aumento no E/S e potencial amplificação de escrita.