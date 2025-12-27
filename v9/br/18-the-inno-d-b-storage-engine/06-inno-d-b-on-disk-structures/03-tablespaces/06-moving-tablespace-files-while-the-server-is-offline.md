#### 17.6.3.6 Movimentando arquivos do espaço de tabelas enquanto o servidor está offline

A variável `innodb_directories`, que define os diretórios a serem verificados ao iniciar para encontrar arquivos do espaço de tabelas, suporta o movimento ou restauração de arquivos do espaço de tabelas para um novo local enquanto o servidor está offline. Durante o início, os arquivos do espaço de tabelas descobertos são usados em vez dos referenciados no dicionário de dados, e o dicionário de dados é atualizado para referenciar os arquivos realocados. Se duplicatas de arquivos do espaço de tabelas forem descobertas pela verificação, o início falhará com um erro indicando que múltiplos arquivos foram encontrados para o mesmo ID de espaço de tabelas.

Os diretórios definidos pelas variáveis `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor do argumento `innodb_directories`. Esses diretórios são verificados ao iniciar, independentemente de uma configuração explícita do `innodb_directories` ser especificada. A adição implícita desses diretórios permite o movimento de arquivos de espaço de tabelas do sistema, o diretório de dados ou arquivos de espaço de tabelas de undo sem configurar a configuração do `innodb_directories`. No entanto, as configurações devem ser atualizadas quando os diretórios mudam. Por exemplo, após realocar o diretório de dados, você deve atualizar a configuração `--datadir` antes de reiniciar o servidor.

A variável `innodb_directories` pode ser especificada em um comando de início ou em um arquivo de opção do MySQL. Aspas são usadas ao redor do valor do argumento porque um ponto e vírgula (;) é interpretado como um caractere especial por alguns interpretadores de comandos. (As shells Unix o tratam como um terminal de comando, por exemplo.)

Comando de início:

```
mysqld --innodb-directories="directory_path_1;directory_path_2"
```

Arquivo de opção do MySQL:

```
[mysqld]
innodb_directories="directory_path_1;directory_path_2"
```

O procedimento a seguir é aplicável para mover arquivos individuais por tabela e arquivos de espaço de tabela geral, arquivos de espaço de tabela de undo ou o diretório de dados. Antes de mover arquivos ou diretórios, revise as notas de uso que seguem.

1. Parar o servidor.
2. Mover os arquivos ou diretórios de espaço de tabela para o local desejado.

3. Tornar o novo diretório conhecido pelo `InnoDB`.

   * Se estiver movendo arquivos individuais por tabela ou arquivos de espaço de tabela geral, adicione diretórios desconhecidos ao valor do argumento `innodb_directories`.

     + Os diretórios definidos pelas variáveis `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor do argumento `innodb_directories`, então você não precisa especiá-los.

     * Um arquivo de espaço de tabela por tabela só pode ser movido para um diretório com o mesmo nome que o esquema. Por exemplo, se a tabela `actor` pertence ao esquema `sakila`, então o arquivo de dados `actor.ibd` só pode ser movido para um diretório nomeado `sakila`.

     * Arquivos de espaço de tabela geral não podem ser movidos para o diretório de dados ou um subdiretório do diretório de dados.

   * Se estiver movendo arquivos de espaço de tabela, espaços de tabela de undo ou o diretório de dados, atualize as configurações `innodb_data_home_dir`, `innodb_undo_directory` e `datadir`, conforme necessário.

4. Reiniciar o servidor.

##### Notas de Uso

* Expressões com asterisco não podem ser usadas no valor do argumento `innodb_directories`.

* A varredura `innodb_directories` também percorre subdiretórios de diretórios especificados. Diretórios e subdiretórios duplicados são descartados da lista de diretórios a serem verificados.

* `innodb_directories` suporta a movimentação de arquivos do espaço de tabelas `InnoDB`. A movimentação de arquivos que pertencem a um mecanismo de armazenamento diferente de `InnoDB` não é suportada. Esta restrição também se aplica ao mover o diretório de dados inteiro.

* `innodb_directories` suporta o renomeamento de arquivos de espaço de tabelas ao mover arquivos para um diretório escaneado. Também suporta a movimentação de arquivos de espaço de tabelas para outros sistemas operacionais suportados.

* Ao mover arquivos de espaço de tabelas para um sistema operacional diferente, certifique-se de que os nomes dos arquivos de espaço de tabelas não incluam caracteres proibidos ou caracteres com significado especial no sistema de destino.

* Ao mover um diretório de dados de um sistema operacional Windows para um sistema operacional Linux, modifique as passagens dos arquivos de log binário no arquivo de índice de log binário para usar barras invertidas em vez de barras verticais. Por padrão, o arquivo de índice de log binário tem o mesmo nome de base que o arquivo de log binário, com a extensão '`.index'`. A localização do arquivo de índice de log binário é definida por `--log-bin`. A localização padrão é o diretório de dados.

* Se a movimentação de arquivos de espaço de tabelas para um sistema operacional diferente introduzir replicação entre plataformas, é responsabilidade do administrador do banco de dados garantir a replicação adequada das declarações DDL que contêm diretórios específicos da plataforma. As declarações que permitem especificar diretórios incluem `CREATE TABLE ... DATA DIRECTORY` e `CREATE TABLESPACE ... ADD DATAFILE`.

* Adicione os diretórios de espaços de tabelas por arquivo e gerais criados com um caminho absoluto ou em um local fora do diretório de dados à configuração `innodb_directories`. Caso contrário, o `InnoDB` não consegue localizar os arquivos durante a recuperação. Para informações relacionadas, consulte Espaço de Tabela de Descoberta Durante a Recuperação de Falha.

Para visualizar as localizações dos arquivos do espaço de tabelas, consulte a tabela do esquema de informações `FILES`:

```
  mysql> SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES \G
  ```