### 14.9.2 Compressão de Página do InnoDB

O `InnoDB` suporta compressão no nível de página (page-level compression) para tabelas que residem em `tablespaces` `file-per-table`. Esse recurso é denominado *Compressão de Página Transparente (Transparent Page Compression)*. A Compressão de Página é habilitada especificando o atributo `COMPRESSION` com `CREATE TABLE` ou `ALTER TABLE`. Os algoritmos de compressão suportados incluem `Zlib` e `LZ4`.

#### Plataformas Suportadas

A Compressão de Página exige suporte a `sparse file` e `hole punching`. A Compressão de Página é suportada no Windows com NTFS e no seguinte subconjunto de plataformas Linux suportadas pelo MySQL, onde o nível do `kernel` fornece suporte a `hole punching`:

* RHEL 7 e distribuições derivadas que usam a versão 3.10.0-123 ou superior do `kernel`

* OEL 5.10 (UEK2) versão 2.6.39 ou superior do `kernel`
* OEL 6.5 (UEK3) versão 3.8.13 ou superior do `kernel`
* OEL 7.0 versão 3.8.13 ou superior do `kernel`
* SLE11 versão 3.0-x do `kernel`
* SLE12 versão 3.12-x do `kernel`
* OES11 versão 3.0-x do `kernel`
* Ubuntu 14.0.4 LTS versão 3.13 ou superior do `kernel`
* Ubuntu 12.0.4 LTS versão 3.2 ou superior do `kernel`
* Debian 7 versão 3.2 ou superior do `kernel`

Nota

Nem todos os sistemas de arquivos disponíveis para uma determinada distribuição Linux podem suportar `hole punching`.

#### Como a Compressão de Página Funciona

Quando uma página é gravada, ela é comprimida usando o algoritmo de compressão especificado. Os dados comprimidos são gravados em disco, onde o mecanismo de `hole punching` libera blocos vazios do final da página. Se a compressão falhar, os dados são gravados no estado em que se encontram (`as-is`).

#### Tamanho do Hole Punch no Linux

Em sistemas Linux, o tamanho do bloco do sistema de arquivos (`file system block size`) é a unidade usada para `hole punching`. Portanto, a Compressão de Página só funciona se os dados da página puderem ser comprimidos para um tamanho menor ou igual ao `page size` do `InnoDB` menos o tamanho do bloco do sistema de arquivos. Por exemplo, se `innodb_page_size=16K` e o tamanho do bloco do sistema de arquivos for 4K, os dados da página devem comprimir para menos ou igual a 12K para tornar o `hole punching` possível.

#### Tamanho do Hole Punch no Windows

Em sistemas Windows, a infraestrutura subjacente para `sparse files` é baseada na compressão NTFS. O tamanho do `hole punching` é a unidade de compressão NTFS, que é 16 vezes o tamanho do `cluster` NTFS. Os tamanhos dos `clusters` e suas unidades de compressão são mostrados na tabela a seguir:

**Tabela 14.8 Tamanho do Cluster NTFS e Unidades de Compressão do Windows**

| Tamanho do Cluster | Unidade de Compressão |
| :--- | :--- |
| 512 Bytes | 8 KB |
| 1 KB | 16 KB |
| 2 KB | 32 KB |
| 4 KB | 64 KB |

A Compressão de Página em sistemas Windows só funciona se os dados da página puderem ser comprimidos para um tamanho menor ou igual ao `page size` do `InnoDB` menos o tamanho da unidade de compressão.

O tamanho padrão do `cluster` NTFS é 4KB, para o qual o tamanho da unidade de compressão é 64KB. Isso significa que a Compressão de Página não traz benefício para uma configuração padrão ("out-of-the box") do Windows NTFS, visto que o `innodb_page_size` máximo também é 64KB.

Para que a Compressão de Página funcione no Windows, o sistema de arquivos deve ser criado com um tamanho de `cluster` menor que 4K, e o `innodb_page_size` deve ser pelo menos duas vezes o tamanho da unidade de compressão. Por exemplo, para que a Compressão de Página funcione no Windows, você pode construir o sistema de arquivos com um tamanho de `cluster` de 512 Bytes (que tem uma unidade de compressão de 8KB) e inicializar o `InnoDB` com um valor `innodb_page_size` de 16K ou maior.

#### Habilitando a Compressão de Página

Para habilitar a Compressão de Página, especifique o atributo `COMPRESSION` na instrução `CREATE TABLE`. Por exemplo:

```sql
CREATE TABLE t1 (c1 INT) COMPRESSION="zlib";
```

Você também pode habilitar a Compressão de Página em uma instrução `ALTER TABLE`. No entanto, `ALTER TABLE ... COMPRESSION` apenas atualiza o atributo de compressão do `tablespace`. Gravações no `tablespace` que ocorrem após a definição do novo algoritmo de compressão usam a nova configuração, mas para aplicar o novo algoritmo de compressão às páginas existentes, você deve reconstruir a tabela usando `OPTIMIZE TABLE`.

```sql
ALTER TABLE t1 COMPRESSION="zlib";
OPTIMIZE TABLE t1;
```

#### Desabilitando a Compressão de Página

Para desabilitar a Compressão de Página, defina `COMPRESSION=None` usando `ALTER TABLE`. Gravações no `tablespace` que ocorrem após a definição de `COMPRESSION=None` não usam mais a Compressão de Página. Para descomprimir páginas existentes, você deve reconstruir a tabela usando `OPTIMIZE TABLE` após definir `COMPRESSION=None`.

```sql
ALTER TABLE t1 COMPRESSION="None";
OPTIMIZE TABLE t1;
```

#### Metadados da Compressão de Página

Os metadados da Compressão de Página são encontrados na tabela `INNODB_SYS_TABLESPACES` do Information Schema, nas seguintes colunas:

* `FS_BLOCK_SIZE`: O tamanho do bloco do sistema de arquivos (`file system block size`), que é o tamanho da unidade usada para `hole punching`.

* `FILE_SIZE`: O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, descompactado.

* `ALLOCATED_SIZE`: O tamanho real do arquivo, que é a quantidade de espaço alocado em disco.

Nota

Em sistemas do tipo Unix, `ls -l tablespace_name.ibd` mostra o tamanho aparente do arquivo (equivalente a `FILE_SIZE`) em `bytes`. Para visualizar a quantidade real de espaço alocado em disco (equivalente a `ALLOCATED_SIZE`), use `du --block-size=1 tablespace_name.ibd`. A opção `--block-size=1` imprime o espaço alocado em `bytes` em vez de `blocks`, para que possa ser comparado com a saída de `ls -l`.

Use `SHOW CREATE TABLE` para visualizar a configuração atual da Compressão de Página (`Zlib`, `Lz4` ou `None`). Uma tabela pode conter uma mistura de páginas com diferentes configurações de compressão.

No exemplo a seguir, os metadados da Compressão de Página para a tabela `employees` são recuperados da tabela `INNODB_SYS_TABLESPACES` do Information Schema.

```sql
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

# Query page compression metadata in INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES

mysql> SELECT SPACE, NAME, FS_BLOCK_SIZE, FILE_SIZE, ALLOCATED_SIZE FROM
       INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='employees/employees'\G
*************************** 1. row ***************************
SPACE: 45
NAME: employees/employees
FS_BLOCK_SIZE: 4096
FILE_SIZE: 23068672
ALLOCATED_SIZE: 19415040
```

Os metadados da Compressão de Página para a tabela `employees` mostram que o tamanho aparente do arquivo é de 23068672 `bytes`, enquanto o tamanho real do arquivo (com Compressão de Página) é de 19415040 `bytes`. O tamanho do bloco do sistema de arquivos é de 4096 `bytes`, que é o tamanho do `block` usado para `hole punching`.

#### Identificando Tabelas que Usam Compressão de Página

Para identificar tabelas para as quais a Compressão de Página está habilitada, você pode consultar a coluna `CREATE_OPTIONS` da tabela `TABLES` do Information Schema para tabelas definidas com o atributo `COMPRESSION`:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%COMPRESSION=%';
+------------+--------------+--------------------+
| TABLE_NAME | TABLE_SCHEMA | CREATE_OPTIONS     |
+------------+--------------+--------------------+
| employees  | test         | COMPRESSION="zlib" |
+------------+--------------+--------------------+
```

`SHOW CREATE TABLE` também exibe o atributo `COMPRESSION`, se usado.

#### Limitações e Notas de Uso da Compressão de Página

* A Compressão de Página é desabilitada se o tamanho do bloco do sistema de arquivos (ou tamanho da unidade de compressão no Windows) \* 2 > `innodb_page_size`.

* A Compressão de Página não é suportada para tabelas que residem em `tablespaces` compartilhados, que incluem o `system tablespace`, o `temporary tablespace` e os `general tablespaces`.

* A Compressão de Página não é suportada para `undo log tablespaces`.
* A Compressão de Página não é suportada para páginas de `redo log`.
* Páginas R-tree, que são usadas para `spatial indexes`, não são comprimidas.

* Páginas que pertencem a tabelas comprimidas (`ROW_FORMAT=COMPRESSED`) são deixadas como estão (`as-is`).

* Durante a `Recovery`, as páginas atualizadas são gravadas em formato não comprimido.

* O carregamento de um `tablespace` com Compressão de Página em um servidor que não suporta o algoritmo de compressão usado causa um `I/O error`.

* Antes de fazer o `downgrade` para uma versão anterior do MySQL que não suporta Compressão de Página, descompacte as tabelas que usam o recurso de Compressão de Página. Para descompactar uma tabela, execute `ALTER TABLE ... COMPRESSION=None` e `OPTIMIZE TABLE`.

* `Tablespaces` com Compressão de Página podem ser copiados entre servidores Linux e Windows se o algoritmo de compressão usado estiver disponível em ambos os servidores.

* Preservar a Compressão de Página ao mover um arquivo de `tablespace` com Compressão de Página de um `host` para outro requer um utilitário que preserve `sparse files`.

* Uma melhor Compressão de Página pode ser alcançada em hardware Fusion-io com NVMFS do que em outras plataformas, já que o NVMFS é projetado para tirar proveito da funcionalidade de `punch hole`.

* Usar o recurso de Compressão de Página com um `InnoDB page size` grande e um tamanho de bloco de sistema de arquivos relativamente pequeno pode resultar em `write amplification`. Por exemplo, um `InnoDB page size` máximo de 64KB com um tamanho de bloco de sistema de arquivos de 4KB pode melhorar a compressão, mas também pode aumentar a demanda no `Buffer Pool`, levando a um aumento de `I/O` e potencial `write amplification`.