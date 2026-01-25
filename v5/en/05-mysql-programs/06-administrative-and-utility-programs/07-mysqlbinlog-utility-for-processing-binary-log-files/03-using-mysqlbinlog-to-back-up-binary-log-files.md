#### 4.6.7.3 Usando mysqlbinlog para Fazer Backup de Arquivos de Log Binário

Por padrão, o **mysqlbinlog** lê arquivos de log binário e exibe seus conteúdos em formato de texto. Isso permite que você examine eventos dentro dos arquivos mais facilmente e os re-execute (por exemplo, usando a saída como entrada para o **mysql**). O **mysqlbinlog** pode ler arquivos de log diretamente do file system local ou, com a opção `--read-from-remote-server`, pode se conectar a um server e solicitar o conteúdo do log binário desse server. O **mysqlbinlog** grava a saída de texto em sua standard output, ou no arquivo nomeado como o valor da opção `--result-file=file_name`, caso essa opção seja fornecida.

* Capacidades de Backup do mysqlbinlog
* Opções de Backup do mysqlbinlog
* Backups Estáticos e Contínuos
* Nomenclatura de Arquivos de Saída
* Exemplo: mysqldump + mysqlbinlog para Backup e Restore
* Restrições de Backup do mysqlbinlog

##### Capacidades de Backup do mysqlbinlog

O **mysqlbinlog** pode ler arquivos de log binário e gravar novos arquivos contendo o mesmo conteúdo—isto é, em formato binário em vez de formato de texto. Essa capacidade permite que você faça backup de um log binário facilmente em seu formato original. O **mysqlbinlog** pode fazer um backup estático, fazendo backup de um conjunto de arquivos de log e parando quando o fim do último arquivo é atingido. Ele também pode fazer um backup contínuo (“ao vivo”), permanecendo conectado ao server quando atinge o fim do último arquivo de log e continuando a copiar novos eventos à medida que são gerados. Na operação de backup contínuo, o **mysqlbinlog** é executado até que a conexão termine (por exemplo, quando o server é encerrado) ou o **mysqlbinlog** seja encerrado à força. Quando a conexão termina, o **mysqlbinlog** não espera e tenta a conexão novamente, diferentemente de um replica server. Para continuar um backup ao vivo após o server ter sido reiniciado, você também deve reiniciar o **mysqlbinlog**.

##### Opções de Backup do mysqlbinlog

O backup de log binário exige que você invoque o **mysqlbinlog** com no mínimo duas opções:

* A opção `--read-from-remote-server` (ou `-R`) instrui o **mysqlbinlog** a se conectar a um server e solicitar seu log binário. (Isso é semelhante a um replica server se conectando ao seu source server de Replication.)

* A opção `--raw` instrui o **mysqlbinlog** a gravar a saída raw (binária), e não a saída de texto.

Juntamente com `--read-from-remote-server`, é comum especificar outras opções: `--host` indica onde o server está sendo executado, e você também pode precisar especificar opções de conexão como `--user` e `--password`.

Várias outras opções são úteis em conjunto com `--raw`:

* `--stop-never`: Permanece conectado ao server após atingir o fim do último arquivo de log e continua a ler novos eventos.

* `--stop-never-slave-server-id=id`: O ID do server que o **mysqlbinlog** reporta ao server quando `--stop-never` é usado. O padrão é 65535. Isso pode ser usado para evitar um conflito com o ID de um replica server ou outro processo **mysqlbinlog**. Consulte a Seção 4.6.7.4, “Especificando o ID do Server do mysqlbinlog”.

* `--result-file`: Um prefixo para nomes de arquivos de saída, conforme descrito posteriormente.

##### Backups Estáticos e Contínuos

Para fazer backup dos arquivos de log binário de um server com **mysqlbinlog**, você deve especificar nomes de arquivos que realmente existem no server. Se você não souber os nomes, conecte-se ao server e use a instrução `SHOW BINARY LOGS` para ver os nomes atuais. Suponha que a instrução produza esta saída:

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000130 |     27459 |
| binlog.000131 |     13719 |
| binlog.000132 |     43268 |
+---------------+-----------+
```

Com essa informação, você pode usar o **mysqlbinlog** para fazer backup do log binário para o diretório atual da seguinte forma (digite cada comando em uma única linha):

* Para fazer um backup estático de `binlog.000130` até `binlog.000132`, use qualquer um desses comandos:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    binlog.000130 binlog.000131 binlog.000132

  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --to-last-log binlog.000130
  ```

  O primeiro comando especifica explicitamente cada nome de arquivo. O segundo nomeia apenas o primeiro arquivo e usa `--to-last-log` para ler até o último. Uma diferença entre esses comandos é que, se o server abrir acidentalmente `binlog.000133` antes que o **mysqlbinlog** atinja o fim de `binlog.000132`, o primeiro comando não o lê, mas o segundo comando lê.

* Para fazer um backup ao vivo em que o **mysqlbinlog** inicia com `binlog.000130` para copiar arquivos de log existentes e, em seguida, permanece conectado para copiar novos eventos à medida que o server os gera:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --stop-never binlog.000130
  ```

  Com `--stop-never`, não é necessário especificar `--to-last-log` para ler até o último arquivo de log, pois essa opção está implícita.

##### Nomenclatura de Arquivos de Saída

Sem `--raw`, o **mysqlbinlog** produz saída de texto e a opção `--result-file`, se fornecida, especifica o nome do único arquivo para o qual toda a saída é gravada. Com `--raw`, o **mysqlbinlog** grava um arquivo de saída binário para cada arquivo de log transferido do server. Por padrão, o **mysqlbinlog** grava os arquivos no diretório atual com os mesmos nomes dos arquivos de log originais. Para modificar os nomes dos arquivos de saída, use a opção `--result-file`. Em conjunto com `--raw`, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

Suponha que um server tenha atualmente arquivos de log binário nomeados `binlog.000999` e superiores. Se você usar **mysqlbinlog --raw** para fazer backup dos arquivos, a opção `--result-file` produz nomes de arquivos de saída conforme mostrado na tabela a seguir. Você pode gravar os arquivos em um diretório específico começando o valor de `--result-file` com o caminho do diretório. Se o valor de `--result-file` consistir apenas em um nome de diretório, o valor deve terminar com o caractere separador de pathname. Os arquivos de saída são sobrescritos se existirem.

<table summary="Opções --result-file do mysqlbinlog e nomes de arquivos de saída correspondentes, conforme descrito no exemplo no texto precedente."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><code>Opção --result-file</code></th> <th>Nomes dos Arquivos de Saída</th> </tr></thead><tbody><tr> <td><code>--result-file=x</code></td> <td><code>xbinlog.000999</code> e superiores</td> </tr><tr> <td><code>--result-file=/tmp/</code></td> <td><code>/tmp/binlog.000999</code> e superiores</td> </tr><tr> <td><code>--result-file=/tmp/x</code></td> <td><code>/tmp/xbinlog.000999</code> e superiores</td> </tr></tbody></table>

##### Exemplo: mysqldump + mysqlbinlog para Backup e Restore

O exemplo a seguir descreve um cenário simples que mostra como usar o **mysqldump** e o **mysqlbinlog** juntos para fazer backup dos dados e do log binário de um server, e como usar o backup para fazer o restore do server caso ocorra perda de dados. O exemplo assume que o server está sendo executado no host *`host_name`* e seu primeiro arquivo de log binário se chama `binlog.000999`. Digite cada comando em uma única linha.

Use o **mysqlbinlog** para fazer um backup contínuo do log binário:

```sql
mysqlbinlog --read-from-remote-server --host=host_name --raw
  --stop-never binlog.000999
```

Use o **mysqldump** para criar um dump file como um snapshot dos dados do server. Use `--all-databases`, `--events` e `--routines` para fazer backup de todos os dados, e `--master-data=2` para incluir as coordenadas atuais do log binário no dump file.

```sql
mysqldump --host=host_name --all-databases --events --routines --master-data=2> dump_file
```

Execute o comando **mysqldump** periodicamente para criar snapshots mais recentes, conforme desejado.

Se ocorrer perda de dados (por exemplo, se o server for encerrado inesperadamente), use o dump file mais recente para fazer o restore dos dados:

```sql
mysql --host=host_name -u root -p < dump_file
```

Em seguida, use o backup do log binário para re-executar eventos que foram gravados após as coordenadas listadas no dump file. Suponha que as coordenadas no arquivo se pareçam com isto:

```sql
-- CHANGE MASTER TO MASTER_LOG_FILE='binlog.001002', MASTER_LOG_POS=27284;
```

Se o arquivo de log de backup mais recente se chamar `binlog.001004`, re-execute os eventos de log assim:

```sql
mysqlbinlog --start-position=27284 binlog.001002 binlog.001003 binlog.001004
  | mysql --host=host_name -u root -p
```

Pode ser mais fácil copiar os arquivos de backup (dump file e arquivos de log binário) para o host do server para facilitar a execução da operação de restore, ou se o MySQL não permitir acesso `root` remoto.

##### Restrições de Backup do mysqlbinlog

Backups de log binário com **mysqlbinlog** estão sujeitos a estas restrições:

* O **mysqlbinlog** não se reconecta automaticamente ao MySQL server se a conexão for perdida (por exemplo, se ocorrer um restart do server ou houver uma falha de network).

* Antes do MySQL 5.7.19, o **mysqlbinlog** não obtém todos os eventos assim que são committed, mesmo que o server esteja configurado com `sync_binlog=1`. Isso significa que alguns dos eventos mais recentes podem estar faltando. Para garantir que o **mysqlbinlog** veja os eventos mais recentes, faça o flush do log binário no server do qual você está fazendo backup.

* O delay de um backup é semelhante ao delay de um replica server.