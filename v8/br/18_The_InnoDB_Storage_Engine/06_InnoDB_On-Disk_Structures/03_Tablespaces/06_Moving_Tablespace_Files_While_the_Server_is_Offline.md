#### 17.6.3.6 Mover arquivos do espaço de tabela enquanto o servidor estiver offline

A variável `innodb_directories`, que define os diretórios a serem verificados ao iniciar para encontrar arquivos de espaço de tabela, suporta o movimento ou restauração de arquivos de espaço de tabela para um novo local enquanto o servidor está offline. Durante o início, os arquivos de espaço de tabela descobertos são usados em vez dos referenciados no dicionário de dados, e o dicionário de dados é atualizado para referenciar os arquivos realocados. Se duplicatas de arquivos de espaço de tabela forem descobertas durante a verificação, o início falhará com um erro indicando que múltiplos arquivos foram encontrados para o mesmo ID de espaço de tabela.

Os diretórios definidos pelas variáveis `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor do argumento `innodb_directories`. Esses diretórios são verificados ao iniciar o sistema, independentemente de uma configuração `innodb_directories` ser especificada explicitamente. A adição implícita desses diretórios permite mover arquivos de espaço de tabela do sistema, o diretório de dados ou arquivos de espaço de tabela de desfazer sem configurar a configuração `innodb_directories`. No entanto, as configurações devem ser atualizadas quando os diretórios mudam. Por exemplo, após a realocação do diretório de dados, você deve atualizar a configuração `--datadir` antes de reiniciar o servidor.

A variável `innodb_directories` pode ser especificada em um comando de inicialização ou em um arquivo de opção do MySQL. Aspas são usadas ao redor do valor do argumento porque um ponto e vírgula (;) é interpretado como um caractere especial por alguns interpretadores de comandos. (As caixas de comando do Unix o tratam, por exemplo, como um marcador de fim de comando.)

Comando de inicialização:

```
mysqld --innodb-directories="directory_path_1;directory_path_2"
```

Arquivo de opção do MySQL:

```
[mysqld]
innodb_directories="directory_path_1;directory_path_2"
```

O procedimento a seguir é aplicável para mover arquivos individuais por tabela e arquivos de espaço de tabela geral, arquivos de espaço de tabela de sistema, arquivos de espaço de tabela de desfazer ou o diretório de dados. Antes de mover arquivos ou diretórios, revise as notas de uso que seguem.

1. Pare o servidor.

2. Mova os arquivos ou diretórios do espaço de tabelas para o local desejado.

3. Informe o novo diretório ao `InnoDB`.

   - Se você estiver movendo arquivos individuais por tabela ou arquivos de espaço de tabela geral, adicione diretórios desconhecidos ao valor `innodb_directories`.

     - Os diretórios definidos pelas variáveis `innodb_data_home_dir`, `innodb_undo_directory` e `datadir` são automaticamente anexados ao valor do argumento `innodb_directories`, então você não precisa especiá-los.

     - Um arquivo de espaço de tabela por tabela só pode ser movido para um diretório com o mesmo nome que o esquema. Por exemplo, se a tabela `actor` pertence ao esquema `sakila`, então o arquivo de dados `actor.ibd` só pode ser movido para um diretório chamado `sakila`.

     - Os arquivos de espaço de tabela geral não podem ser movidos para o diretório de dados ou para um subdiretório do diretório de dados.

   - Se você estiver movendo os arquivos do espaço de tabela do sistema, desfazer espaços de tabela ou o diretório de dados, atualize as configurações dos `innodb_data_home_dir`, `innodb_undo_directory` e `datadir`, conforme necessário.

4. Reinicie o servidor.

##### Observações de uso

- As expressões com asterisco não podem ser usadas no valor do argumento `innodb_directories`.

- A varredura `innodb_directories` também percorre subdiretórios de diretórios especificados. Diretórios e subdiretórios duplicados são descartados da lista de diretórios a serem verificados.

- O `innodb_directories` suporta o movimento de arquivos do espaço de tabelas `InnoDB`. O movimento de arquivos que pertencem a um mecanismo de armazenamento diferente de `InnoDB` não é suportado. Esta restrição também se aplica ao movimento de todo o diretório de dados.

- O `innodb_directories` suporta a renomeação de arquivos de espaço de tabela ao mover arquivos para um diretório escaneado. Ele também suporta a transferência de arquivos de espaços de tabela para outros sistemas operacionais suportados.

- Ao mover arquivos de espaço de tabela para um sistema operacional diferente, certifique-se de que os nomes dos arquivos de espaço de tabela não incluam caracteres proibidos ou caracteres com significado especial no sistema de destino.

- Ao mover um diretório de dados de um sistema operacional Windows para um sistema operacional Linux, modifique as passagens dos arquivos de log binário no arquivo de índice de log binário para usar barras invertidas em vez de barras verticais. Por padrão, o arquivo de índice de log binário tem o mesmo nome de base que o arquivo de log binário, com a extensão '`.index`'. A localização do arquivo de índice de log binário é definida por `--log-bin`. A localização padrão é o diretório de dados.

- Se a transferência de arquivos de espaço de tabela para um sistema operacional diferente introduzir a replicação entre plataformas, cabe ao administrador do banco de dados garantir a replicação adequada das instruções DDL que contêm diretórios específicos da plataforma. As instruções que permitem especificar diretórios incluem `CREATE TABLE ... DATA DIRECTORY` e `CREATE TABLESPACE ... ADD DATAFILE`.

- Adicione os diretórios de file-per-table e espaços de tabelas gerais criados com um caminho absoluto ou em um local fora do diretório de dados à configuração `innodb_directories`. Caso contrário, o `InnoDB` não conseguirá localizar os arquivos durante a recuperação. Para informações relacionadas, consulte Recuperação de Crash durante a Descoberta de Espaços de Tabela.

  Para visualizar as localizações dos arquivos do espaço de tabelas, consulte a tabela Schema de Informações `FILES`:

  ```
  mysql> SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES \G
  ```
