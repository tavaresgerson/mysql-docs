#### 17.6.3.2 Espaços de Tabelas por Arquivo

Um espaço de tabelas por arquivo contém dados e índices para uma única tabela `InnoDB` e é armazenado no sistema de arquivos em um único arquivo de dados.

As características de um espaço de tabelas por arquivo são descritas nos seguintes tópicos nesta seção:

* Configuração de Espaço de Tabelas por Arquivo
* Arquivos de Dados de Espaço de Tabelas por Arquivo
* Vantagens de Espaço de Tabelas por Arquivo
* Desvantagens de Espaço de Tabelas por Arquivo

##### Configuração de Espaço de Tabelas por Arquivo

O `InnoDB` cria tabelas em espaços de tabelas por arquivo por padrão. Esse comportamento é controlado pela variável `innodb_file_per_table`. Desativar `innodb_file_per_table` faz com que o `InnoDB` crie tabelas no espaço de tabelas do sistema.

Uma configuração de `innodb_file_per_table` pode ser especificada em um arquivo de opções ou configurada em tempo de execução usando uma declaração `SET GLOBAL`. Alterar a configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Arquivo de opções:

```
[mysqld]
innodb_file_per_table=ON
```

Usando `SET GLOBAL` em tempo de execução:

```
mysql> SET GLOBAL innodb_file_per_table=ON;
```

##### Arquivos de Dados de Espaço de Tabelas por Arquivo

Um espaço de tabelas por arquivo é criado em um arquivo de dados `.ibd` em um diretório de esquema sob o diretório de dados do MySQL. O arquivo `.ibd` é nomeado para a tabela (`table_name.ibd`). Por exemplo, o arquivo de dados para a tabela `test.t1` é criado no diretório `test` sob o diretório de dados do MySQL:

```
mysql> USE test;

mysql> CREATE TABLE t1 (
    ->     id INT PRIMARY KEY AUTO_INCREMENT,
    ->     name VARCHAR(100)
    ->     ) ENGINE = InnoDB;

mysql> EXIT;
```

```
$> cd /path/to/mysql/data/test
$> ls
t1.ibd
```

Você pode usar a cláusula `DATA DIRECTORY` da declaração `CREATE TABLE` para criar implicitamente um arquivo de dados de espaço de tabelas por arquivo fora do diretório de dados. Para mais informações, veja a Seção 17.6.1.2, “Criando Tabelas Externamente”.

##### Vantagens de Espaço de Tabelas por Arquivo

Os espaços de tabelas por arquivo têm as seguintes vantagens em relação aos espaços de tabelas compartilhados, como o espaço de tabelas do sistema ou os espaços de tabelas gerais.

* O espaço em disco é devolvido ao sistema operacional após a truncagem ou remoção de uma tabela criada em um espaço de tabelas por arquivo. A truncagem ou remoção de uma tabela armazenada em um espaço de tabelas compartilhado cria espaço livre dentro do arquivo de dados do espaço de tabelas compartilhado, que só pode ser usado para dados do `InnoDB`. Em outras palavras, o arquivo de dados de um espaço de tabelas compartilhado não diminui de tamanho após a truncagem ou remoção de uma tabela.

* Uma operação de cópia de tabela `ALTER TABLE` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço em disco ocupado pelo espaço de tabelas. Tais operações podem exigir tanto espaço adicional quanto os dados da tabela mais os índices. Esse espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

* O desempenho da operação `TRUNCATE TABLE` é melhor quando executada em tabelas que residem em espaços de tabelas por arquivo.

* Os arquivos de dados de espaços de tabelas por arquivo podem ser criados em dispositivos de armazenamento separados para otimização de I/O, gerenciamento de espaço ou fins de backup. Veja a Seção 17.6.1.2, “Criando Tabelas Externamente”.

* Você pode importar uma tabela que reside em um espaço de tabelas por arquivo de outra instância do MySQL. Veja a Seção 17.6.1.3, “Importando Tabelas InnoDB”.

* As tabelas criadas em espaços de tabelas por arquivo suportam recursos associados aos formatos de linha `DYNAMIC` e `COMPRESSED`, que não são suportados pelo espaço de tabelas do sistema. Veja a Seção 17.10, “Formatos de Linha InnoDB”.

* Tabelas armazenadas em arquivos de dados de espaço de tabelas individuais podem economizar tempo e melhorar as chances de recuperação bem-sucedida quando ocorre corrupção de dados, quando backups ou logs binários estão indisponíveis ou quando a instância do servidor MySQL não pode ser reiniciada.

* As tabelas criadas em espaços de tabelas por arquivo podem ser protegidas ou restauradas rapidamente usando o MySQL Enterprise Backup, sem interromper o uso de outras tabelas `InnoDB`. Isso é benéfico para tabelas com cronogramas de backup variados ou que requerem backup com menos frequência. Veja Fazendo um backup parcial para detalhes.

* Os espaços de tabelas por arquivo permitem monitorar o tamanho da tabela no sistema de arquivos, monitorando o tamanho do arquivo de dados do espaço de tabelas.

* Sistemas de arquivos comuns do Linux não permitem escritas concorrentes em um único arquivo, como o arquivo de dados do espaço de tabelas compartilhado, quando `innodb_flush_method` está definido como `O_DIRECT`. Como resultado, há possíveis melhorias de desempenho ao usar espaços de tabelas por arquivo em conjunto com essa configuração.

* As tabelas em um espaço de tabelas compartilhado são limitadas pelo limite de tamanho do espaço de tabelas de 64 TB. Por comparação, cada espaço de tabelas por arquivo tem um limite de tamanho de 64 TB, o que oferece bastante espaço para que as tabelas individuais cresçam em tamanho.

##### Desvantagens dos Espaços de Tabelas por Arquivo

Os espaços de tabelas por arquivo têm as seguintes desvantagens em comparação com espaços de tabelas compartilhados, como o espaço de tabelas do sistema ou espaços de tabelas gerais.

* Com espaços de tabelas por arquivo, cada tabela pode ter espaço não utilizado que só pode ser utilizado por linhas da mesma tabela, o que pode levar a um desperdício de espaço se não for gerenciado adequadamente.

* As operações `fsync` são realizadas em múltiplos arquivos de dados de tabelas por arquivo, em vez de um único arquivo de dados do espaço de tabelas compartilhado. Como as operações `fsync` são por arquivo, as operações de escrita para múltiplas tabelas não podem ser combinadas, o que pode resultar em um número total maior de operações `fsync`.

* O **mysqld** deve manter uma alça de arquivo aberta para cada espaço de tabelas por arquivo, o que pode impactar o desempenho se você tiver várias tabelas em espaços de tabelas por arquivo.

* São necessários mais descritores de arquivo quando cada tabela tem seu próprio arquivo de dados.

* Há potencial para mais fragmentação, o que pode impedir o desempenho da operação `DROP TABLE` e da varredura da tabela. No entanto, se a fragmentação for gerenciada, os espaços de tabela por arquivo podem melhorar o desempenho dessas operações.

* O pool de buffers é verificado ao excluir uma tabela que reside em um espaço de tabela por arquivo, o que pode levar vários segundos para pools de buffers grandes. A verificação é realizada com um bloqueio interno amplo, o que pode atrasar outras operações.

* A variável `innodb_autoextend_increment`, que define o tamanho do incremento para a expansão do tamanho de um arquivo de espaço de tabela compartilhado que se torna cheio, não se aplica aos arquivos de espaço de tabela por arquivo, que são autoexpansíveis independentemente da configuração `innodb_autoextend_increment`. As extensões iniciais dos espaços de tabela por arquivo são em pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4 MB.