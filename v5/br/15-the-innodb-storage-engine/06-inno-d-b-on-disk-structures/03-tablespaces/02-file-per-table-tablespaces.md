#### 14.6.3.2 Espaços de tabela por arquivo

Um espaço de tabela por arquivo contém dados e índices para uma única tabela `InnoDB` e é armazenado no sistema de arquivos em um único arquivo de dados.

As características do espaço de tabela por arquivo são descritas nos tópicos a seguir nesta seção:

- Configuração do espaço de tabela por arquivo
- Arquivos de dados do espaço de tabela por tabela
- Vantagens do espaço de tabela por arquivo
- Desvantagens do espaço de tabela por arquivo

##### Configuração do espaço de tabela por arquivo

O `InnoDB` cria tabelas em espaços de tabelas por arquivo por padrão. Esse comportamento é controlado pela variável `innodb_file_per_table`. Desativar `innodb_file_per_table` faz com que o `InnoDB` crie tabelas no espaço de tabelas do sistema.

Uma configuração `innodb_file_per_table` pode ser especificada em um arquivo de opções ou configurada em tempo de execução usando uma instrução `SET GLOBAL`. Alterar a configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

Arquivo de opção:

```sql
[mysqld]
innodb_file_per_table=ON
```

Usando `SET GLOBAL` no tempo de execução:

```sql
mysql> SET GLOBAL innodb_file_per_table=ON;
```

`innodb_file_per_table` está habilitado por padrão no MySQL 5.6 e versões posteriores. Você pode considerar desabilitá-lo se a compatibilidade reversa com versões anteriores do MySQL for uma preocupação.

Aviso

Desativar `innodb_file_per_table` impede que operações de cópia de tabela `ALTER TABLE` mudem implicitamente uma tabela que reside no espaço de tabelas do sistema para um espaço de tabelas por arquivo. Uma operação de cópia de tabela `ALTER TABLE` recria a tabela usando a configuração atual de `innodb_file_per_table`. Esse comportamento não se aplica ao adicionar ou excluir índices secundários, nem se aplica a operações de `ALTER TABLE` que usam o algoritmo `INPLACE`, ou a tabelas adicionadas ao espaço de tabelas do sistema usando a sintaxe `CREATE TABLE ... TABLESPACE` ou `ALTER TABLE ... TABLESPACE`.

##### Arquivos de dados do espaço de tabela por tabela

Um espaço de tabela por arquivo é criado em um arquivo de dados `.ibd` em um diretório de esquema sob o diretório de dados do MySQL. O arquivo `.ibd` é nomeado para a tabela (`table_name.ibd`). Por exemplo, o arquivo de dados para a tabela `test.t1` é criado no diretório `test` sob o diretório de dados do MySQL:

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

Você pode usar a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` para criar implicitamente um arquivo de dados do espaço de tabelas por arquivo fora do diretório de dados. Para obter mais informações, consulte a Seção 14.6.1.2, “Criando tabelas externamente”.

##### Vantagens do espaço de tabela por arquivo

Os espaços de tabela por arquivo têm as seguintes vantagens em relação aos espaços de tabela compartilhados, como o espaço de tabela do sistema ou os espaços de tabela gerais.

- O espaço em disco é devolvido ao sistema operacional após a truncação ou remoção de uma tabela criada em um espaço de tabelas por arquivo. A truncação ou remoção de uma tabela armazenada em um espaço de tabelas compartilhado cria espaço livre dentro do arquivo de dados do espaço de tabelas compartilhado, que só pode ser usado para dados do `InnoDB`. Em outras palavras, um arquivo de dados de um espaço de tabelas compartilhado não diminui de tamanho após a truncação ou remoção de uma tabela.

- Uma operação de cópia de tabela `ALTER TABLE` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço em disco ocupada pelo espaço de tabelas. Tais operações podem exigir tanto espaço adicional quanto os dados da tabela mais os índices. Esse espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

- O desempenho da instrução `TRUNCATE TABLE` é melhor quando executada em tabelas que residem em espaços de tabelas por arquivo.

- Os arquivos de dados do espaço de tabela por arquivo podem ser criados em dispositivos de armazenamento separados para otimização de I/O, gerenciamento de espaço ou fins de backup. Consulte a Seção 14.6.1.2, “Criando Tabelas Externamente”.

- Você pode importar uma tabela que reside em um espaço de tabelas por arquivo para outra instância do MySQL. Consulte a Seção 14.6.1.3, “Importando Tabelas InnoDB”.

- As tabelas criadas em espaços de tabelas por arquivo usam o formato de arquivo Barracuda. Consulte a Seção 14.10, “Gerenciamento do Formato de Arquivo InnoDB”. O formato de arquivo Barracuda permite recursos associados aos formatos de linha `DINÂMICA` e `COMPREENSO`. Consulte a Seção 14.11, “Formatos de Linha InnoDB”.

- As tabelas armazenadas em arquivos de dados de espaço de tabela individual podem economizar tempo e melhorar as chances de recuperação bem-sucedida quando ocorre corrupção de dados, quando os backups ou logs binários estão indisponíveis ou quando a instância do servidor MySQL não pode ser reiniciada.

- Você pode fazer backup ou restaurar tabelas criadas em espaços de tabelas por arquivo rapidamente usando o MySQL Enterprise Backup, sem interromper o uso de outras tabelas `InnoDB`. Isso é benéfico para tabelas com cronogramas de backup variados ou que exigem backup com menos frequência. Veja Fazendo um Backup Parcial para obter detalhes.

- Os espaços de tabela por arquivo permitem monitorar o tamanho da tabela no sistema de arquivos, monitorando o tamanho do arquivo de dados do espaço de tabela.

- Os sistemas de arquivos comuns do Linux não permitem gravações concorrentes em um único arquivo, como um arquivo de dados de um espaço de tabelas compartilhado, quando o `innodb_flush_method` está configurado para `O_DIRECT`. Como resultado, há possíveis melhorias de desempenho ao usar espaços de tabelas por arquivo em conjunto com essa configuração.

- As tabelas em um espaço de tabelas compartilhado têm um limite de tamanho de 64 TB. Em comparação, cada espaço de tabela por arquivo tem um limite de tamanho de 64 TB, o que oferece bastante espaço para que as tabelas individuais cresçam em tamanho.

##### Desvantagens do espaço de tabela por arquivo

Os espaços de tabela por arquivo têm as seguintes desvantagens em comparação com os espaços de tabela compartilhados, como o espaço de tabela do sistema ou os espaços de tabela gerais.

- Com os espaços de tabelas por arquivo, cada tabela pode ter espaço não utilizado que só pode ser utilizado por linhas da mesma tabela, o que pode levar a um desperdício de espaço se não for gerenciado adequadamente.

- As operações `fsync` são realizadas em múltiplos arquivos por tabela em vez de um único arquivo de dados do espaço de tabelas compartilhado. Como as operações `fsync` são por arquivo, as operações de escrita para múltiplas tabelas não podem ser combinadas, o que pode resultar em um número total maior de operações `fsync`.

- O **mysqld** deve manter uma abertura de arquivo para cada espaço de tabela por arquivo, o que pode afetar o desempenho se você tiver várias tabelas em espaços de tabela por arquivo.

- São necessários mais descritores de arquivo quando cada tabela tem seu próprio arquivo de dados.

- Há potencial para mais fragmentação, o que pode prejudicar o desempenho da instrução `DROP TABLE` e da varredura da tabela. No entanto, se a fragmentação for gerenciada, os espaços de tabela por arquivo podem melhorar o desempenho dessas operações.

- O pool de tampão é verificado ao excluir uma tabela que esteja em um espaço de tabela por arquivo, o que pode levar vários segundos para pools de tampão grandes. A verificação é realizada com um bloqueio interno amplo, o que pode atrasar outras operações.

- A variável `innodb_autoextend_increment`, que define o tamanho do incremento para a expansão do tamanho de um arquivo de espaço de tabela compartilhado que se autoexpande quando ele fica cheio, não se aplica aos arquivos de espaço de tabela por arquivo, que se autoexpande independentemente da configuração `innodb_autoextend_increment`. As primeiras expansões de espaço de tabela por arquivo são em pequenas quantidades, após as quais as expansões ocorrem em incrementos de 4 MB.
