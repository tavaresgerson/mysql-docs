#### 14.6.3.2 Tablespaces File-Per-Table

Um tablespace file-per-table contém dados e Indexes para uma única tabela `InnoDB`, e é armazenado no file system em um único arquivo de dados.

As características do tablespace file-per-table são descritas nos seguintes tópicos nesta seção:

* Configuração do Tablespace File-Per-Table
* Arquivos de Dados do Tablespace File-Per-Table
* Vantagens do Tablespace File-Per-Table
* Desvantagens do Tablespace File-Per-Table

##### Configuração do Tablespace File-Per-Table

Por padrão, o `InnoDB` cria tabelas em tablespaces file-per-table. Este comportamento é controlado pela variável `innodb_file_per_table`. Desabilitar `innodb_file_per_table` faz com que o `InnoDB` crie tabelas no system tablespace.

Uma configuração de `innodb_file_per_table` pode ser especificada em um option file ou configurada em runtime usando uma instrução `SET GLOBAL`. Alterar a configuração em runtime requer privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “System Variable Privileges”.

Option file:

```sql
[mysqld]
innodb_file_per_table=ON
```

Usando `SET GLOBAL` em runtime:

```sql
mysql> SET GLOBAL innodb_file_per_table=ON;
```

`innodb_file_per_table` é habilitado por padrão no MySQL 5.6 e superior. Você pode considerar desabilitá-lo se a compatibilidade retroativa com versões anteriores do MySQL for uma preocupação.

Aviso

Desabilitar `innodb_file_per_table` impede que operações `ALTER TABLE` de cópia de tabela movam implicitamente uma tabela que reside no system tablespace para um tablespace file-per-table. Uma operação `ALTER TABLE` de cópia de tabela recria a tabela usando a configuração atual de `innodb_file_per_table`. Este comportamento não se aplica ao adicionar ou remover secondary indexes, nem se aplica a operações `ALTER TABLE` que usam o algoritmo `INPLACE`, ou a tabelas adicionadas ao system tablespace usando a sintaxe `CREATE TABLE ... TABLESPACE` ou `ALTER TABLE ... TABLESPACE`.

##### Arquivos de Dados do Tablespace File-Per-Table

Um tablespace file-per-table é criado em um arquivo de dados `.ibd` em um diretório de schema sob o data directory do MySQL. O arquivo `.ibd` é nomeado para a tabela (`nome_da_tabela.ibd`). Por exemplo, o arquivo de dados para a tabela `test.t1` é criado no diretório `test` sob o data directory do MySQL:

```sql
mysql> USE test;

mysql> CREATE TABLE t1 (
   id INT PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(100)
 ) ENGINE = InnoDB;

$> cd /path/to/mysql/data/test
$> ls
t1.ibd
```

Você pode usar a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` para criar implicitamente um arquivo de dados do tablespace file-per-table fora do data directory. Para mais informações, consulte a Seção 14.6.1.2, “Creating Tables Externally”.

##### Vantagens do Tablespace File-Per-Table

Os tablespaces file-per-table apresentam as seguintes vantagens sobre os shared tablespaces, como o system tablespace ou general tablespaces.

* O espaço em disco é retornado ao sistema operacional após truncar (`truncating`) ou descartar (`dropping`) uma tabela criada em um tablespace file-per-table. Truncar ou descartar uma tabela armazenada em um shared tablespace cria espaço livre dentro do arquivo de dados do shared tablespace, que só pode ser usado para dados `InnoDB`. Em outras palavras, um arquivo de dados de shared tablespace não diminui de tamanho após uma tabela ser truncada ou descartada.

* Uma operação `ALTER TABLE` de cópia de tabela em uma tabela que reside em um shared tablespace pode aumentar a quantidade de espaço em disco ocupado pelo tablespace. Tais operações podem requerer tanto espaço adicional quanto os dados na tabela mais os indexes. Este espaço não é liberado de volta ao sistema operacional, ao contrário do que acontece com os tablespaces file-per-table.

* O desempenho de `TRUNCATE TABLE` é melhor quando executado em tabelas que residem em tablespaces file-per-table.

* Arquivos de dados de tablespace file-per-table podem ser criados em dispositivos de armazenamento separados para otimização de I/O, gerenciamento de espaço ou para fins de Backup. Consulte a Seção 14.6.1.2, “Creating Tables Externally”.

* Você pode importar uma tabela que reside em um tablespace file-per-table de outra instância do MySQL. Consulte a Seção 14.6.1.3, “Importing InnoDB Tables”.

* Tabelas criadas em tablespaces file-per-table usam o formato de arquivo Barracuda. Consulte a Seção 14.10, “InnoDB File-Format Management”. O formato de arquivo Barracuda habilita recursos associados aos row formats `DYNAMIC` e `COMPRESSED`. Consulte a Seção 14.11, “InnoDB Row Formats”.

* Tabelas armazenadas em arquivos de dados de tablespace individuais podem economizar tempo e melhorar as chances de uma Recovery bem-sucedida quando ocorre corrupção de dados, quando Backups ou binary logs não estão disponíveis, ou quando a instância do servidor MySQL não pode ser reiniciada.

* Você pode fazer Backup ou Restore de tabelas criadas em tablespaces file-per-table rapidamente usando o MySQL Enterprise Backup, sem interromper o uso de outras tabelas `InnoDB`. Isso é benéfico para tabelas com agendamentos de Backup variados ou que exigem Backup com menos frequência. Consulte Making a Partial Backup para obter detalhes.

* Tablespaces file-per-table permitem monitorar o tamanho da tabela no file system monitorando o tamanho do arquivo de dados do tablespace.

* File systems comuns do Linux não permitem gravações concorrentes em um único arquivo, como um arquivo de dados de shared tablespace, quando `innodb_flush_method` está definido como `O_DIRECT`. Como resultado, há possíveis melhorias de desempenho ao usar tablespaces file-per-table em conjunto com esta configuração.

* Tabelas em um shared tablespace são limitadas em tamanho pelo limite de 64TB do tablespace. Em comparação, cada tablespace file-per-table tem um limite de tamanho de 64TB, o que oferece bastante espaço para o crescimento de tabelas individuais.

##### Desvantagens do Tablespace File-Per-Table

Os tablespaces file-per-table apresentam as seguintes desvantagens em comparação com os shared tablespaces, como o system tablespace ou general tablespaces.

* Com tablespaces file-per-table, cada tabela pode ter espaço não utilizado que só pode ser aproveitado por linhas da mesma tabela, o que pode levar a desperdício de espaço se não for gerenciado adequadamente.

* Operações `fsync` são realizadas em múltiplos arquivos de dados file-per-table em vez de em um único arquivo de dados de shared tablespace. Como as operações `fsync` são por arquivo, as operações de Write para múltiplas tabelas não podem ser combinadas, o que pode resultar em um número total maior de operações `fsync`.

* O **mysqld** deve manter um file handle aberto para cada tablespace file-per-table, o que pode afetar o desempenho se você tiver inúmeras tabelas em tablespaces file-per-table.

* Mais file descriptors são necessários quando cada tabela tem seu próprio arquivo de dados.

* Há potencial para mais fragmentação, o que pode prejudicar o desempenho de `DROP TABLE` e de table scan. No entanto, se a fragmentação for gerenciada, os tablespaces file-per-table podem melhorar o desempenho dessas operações.

* O Buffer Pool é escaneado ao descartar uma tabela que reside em um tablespace file-per-table, o que pode levar vários segundos para Buffer Pools grandes. O scan é realizado com um Lock interno amplo, o que pode atrasar outras operações.

* A variável `innodb_autoextend_increment`, que define o tamanho do incremento para estender o tamanho de um arquivo de shared tablespace com auto-extensão quando ele fica cheio, não se aplica aos arquivos de tablespace file-per-table, que são auto-extensíveis independentemente da configuração de `innodb_autoextend_increment`. As extensões iniciais de tablespace file-per-table são em pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4MB.