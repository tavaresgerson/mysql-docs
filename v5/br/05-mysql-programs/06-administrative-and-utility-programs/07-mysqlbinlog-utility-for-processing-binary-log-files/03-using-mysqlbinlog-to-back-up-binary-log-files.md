#### 4.6.7.3 Usar mysqlbinlog para fazer backup de arquivos de log binário

Por padrão, o **mysqlbinlog** lê arquivos de log binário e exibe seu conteúdo em formato de texto. Isso permite que você examine os eventos dentro dos arquivos com mais facilidade e os execute novamente (por exemplo, usando a saída como entrada para o **mysql**). O **mysqlbinlog** pode ler arquivos de log diretamente do sistema de arquivos local ou, com a opção `--read-from-remote-server`, pode se conectar a um servidor e solicitar o conteúdo do log binário desse servidor. O **mysqlbinlog** escreve a saída de texto em sua saída padrão ou no arquivo nomeado como o valor da opção `--result-file=file_name`, se essa opção for fornecida.

- Capacidades de backup do mysqlbinlog
- Opções de backup do mysqlbinlog
- Backup estático e em tempo real
- Nomeação de arquivos de saída
- Exemplo: mysqldump + mysqlbinlog para backup e restauração
- Restrições de backup do mysqlbinlog

##### Capacidades de backup do mysqlbinlog

O **mysqlbinlog** pode ler arquivos de log binários e escrever novos arquivos contendo o mesmo conteúdo, ou seja, em formato binário e não em formato de texto. Essa capacidade permite que você faça um backup estático de um log binário em seu formato original. O **mysqlbinlog** pode fazer um backup estático, fazendo backup de um conjunto de arquivos de log e parando quando o final do último arquivo é alcançado. Ele também pode fazer um backup contínuo (“ao vivo”), mantendo-se conectado ao servidor quando ele alcança o final do último arquivo de log e continuando a copiar novos eventos à medida que são gerados. Na operação de backup contínuo, o **mysqlbinlog** funciona até que a conexão termine (por exemplo, quando o servidor sai) ou o **mysqlbinlog** seja encerrado forçadamente. Quando a conexão termina, o **mysqlbinlog** não espera e não tenta reconectar, ao contrário de um servidor replica. Para continuar um backup ao vivo após o servidor ter sido reiniciado, você também deve reiniciar o **mysqlbinlog**.

##### Opções de backup do mysqlbinlog

O backup de log binário exige que você invoque **mysqlbinlog** com pelo menos duas opções:

- A opção `--read-from-remote-server` (ou `-R`) informa ao **mysqlbinlog** para se conectar a um servidor e solicitar seu log binário. (Isso é semelhante a um servidor replica se conectando ao servidor de origem da replicação.)

- A opção `--raw` indica ao **mysqlbinlog** que deve escrever a saída em formato bruto (binário), e não em texto.

Além de `--read-from-remote-server`, é comum especificar outras opções: `--host` indica onde o servidor está sendo executado, e você também pode precisar especificar opções de conexão, como `--user` e `--password`.

Várias outras opções são úteis em conjunto com `--raw`:

- `--stop-never`: Mantenha a conexão com o servidor após atingir o final do último arquivo de registro e continue lendo novos eventos.

- `--stop-never-slave-server-id=id`: O ID do servidor que o **mysqlbinlog** reporta ao servidor quando o `--stop-never` é usado. O padrão é 65535. Isso pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo **mysqlbinlog**. Veja a Seção 4.6.7.4, “Especificando o ID do Servidor mysqlbinlog”.

- `--result-file`: Um prefixo para os nomes dos arquivos de saída, conforme descrito mais adiante.

##### Backup estático e em tempo real

Para fazer backup dos arquivos de log binários de um servidor com o **mysqlbinlog**, você deve especificar nomes de arquivos que realmente existam no servidor. Se você não souber os nomes, conecte-se ao servidor e use a instrução `SHOW BINARY LOGS` para ver os nomes atuais. Suponha que a instrução produza esta saída:

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

Com essas informações, você pode usar o **mysqlbinlog** para fazer backup do log binário para o diretório atual da seguinte forma (insira cada comando em uma única linha):

- Para fazer um backup estático de `binlog.000130` através de `binlog.000132`, use um dos seguintes comandos:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    binlog.000130 binlog.000131 binlog.000132

  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --to-last-log binlog.000130
  ```

  O primeiro comando especifica explicitamente cada nome de arquivo. O segundo nomeia apenas o primeiro arquivo e usa `--to-last-log` para ler o último. Uma diferença entre esses comandos é que, se o servidor abrir `binlog.000133` antes de **mysqlbinlog** chegar ao final de `binlog.000132`, o primeiro comando não o lê, mas o segundo comando sim.

- Para fazer uma cópia de segurança em tempo real na qual o **mysqlbinlog** comece com `binlog.000130` para copiar os arquivos de log existentes, e, em seguida, permaneça conectado para copiar novos eventos à medida que o servidor os gera:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --stop-never binlog.000130
  ```

  Com `--stop-never`, não é necessário especificar `--to-last-log` para ler até o último arquivo de registro, pois essa opção é implícita.

##### Nomeação de arquivos de saída

Sem `--raw`, o **mysqlbinlog** produz saída em texto e a opção `--result-file`, se fornecida, especifica o nome do único arquivo para o qual toda a saída é escrita. Com `--raw`, o **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de log transferido do servidor. Por padrão, o **mysqlbinlog** escreve os arquivos no diretório atual com os mesmos nomes dos arquivos de log originais. Para modificar os nomes dos arquivos de saída, use a opção `--result-file`. Em conjunto com `--raw`, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

Suponha que um servidor tenha atualmente arquivos de log binários com o nome `binlog.000999` e em diante. Se você usar **mysqlbinlog --raw** para fazer o backup dos arquivos, a opção `--result-file` produz nomes de arquivos de saída conforme mostrado na tabela a seguir. Você pode escrever os arquivos para um diretório específico iniciando o valor `--result-file` com o caminho do diretório. Se o valor `--result-file` consistir apenas em um nome de diretório, o valor deve terminar com o caractere de separador de caminho. Os arquivos de saída são sobrescritos se existirem.

<table summary="mysqlbinlog --result-file opções e nomes de arquivos de saída correspondentes, conforme descrito no exemplo no texto anterior."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><code>--result-file</code>Opção</th> <th>Nomes dos arquivos de saída</th> </tr></thead><tbody><tr> <td><code>--result-file=x</code></td> <td><code>xbinlog.000999</code> e acima</td> </tr><tr> <td><code>--result-file=/tmp/</code></td> <td><code>/tmp/binlog.000999</code> e acima</td> </tr><tr> <td><code>--result-file=/tmp/x</code></td> <td><code>/tmp/xbinlog.000999</code> e acima</td> </tr></tbody></table>

##### Exemplo: mysqldump + mysqlbinlog para backup e restauração

O exemplo a seguir descreve um cenário simples que mostra como usar **mysqldump** e **mysqlbinlog** juntos para fazer backup dos dados e do log binário de um servidor, e como usar o backup para restaurar o servidor se ocorrer perda de dados. O exemplo assume que o servidor está rodando no host *`host_name`* e seu primeiro arquivo de log binário é chamado `binlog.000999`. Insira cada comando em uma única linha.

Use **mysqlbinlog** para fazer um backup contínuo do log binário:

```sql
mysqlbinlog --read-from-remote-server --host=host_name --raw
  --stop-never binlog.000999
```

Use o **mysqldump** para criar um arquivo de dump como um instantâneo dos dados do servidor. Use `--all-databases`, `--events` e `--routines` para fazer o backup de todos os dados e `--master-data=2` para incluir as coordenadas atuais do log binário no arquivo de dump.

```sql
mysqldump --host=host_name --all-databases --events --routines --master-data=2> dump_file
```

Execute o comando **mysqldump** periodicamente para criar instantâneos mais recentes conforme desejar.

Se ocorrer perda de dados (por exemplo, se o servidor sair inesperadamente), use o arquivo de dump mais recente para restaurar os dados:

```sql
mysql --host=host_name -u root -p < dump_file
```

Em seguida, use o backup do log binário para reexecutar eventos que foram escritos após as coordenadas listadas no arquivo de dump. Suponha que as coordenadas no arquivo sejam as seguintes:

```sql
-- CHANGE MASTER TO MASTER_LOG_FILE='binlog.001002', MASTER_LOG_POS=27284;
```

Se o arquivo de registro mais recente salvo tiver o nome `binlog.001004`, execute os eventos de registro novamente da seguinte forma:

```sql
mysqlbinlog --start-position=27284 binlog.001002 binlog.001003 binlog.001004
  | mysql --host=host_name -u root -p
```

Você pode achar mais fácil copiar os arquivos de backup (arquivo de dump e arquivos de log binários) para o host do servidor para facilitar a execução da operação de restauração, ou se o MySQL não permitir o acesso remoto ao `root`.

##### Restrições de backup do mysqlbinlog

Os backups de log binário com **mysqlbinlog** estão sujeitos a essas restrições:

- O **mysqlbinlog** não se reconecta automaticamente ao servidor MySQL se a conexão for perdida (por exemplo, se ocorrer um reinício do servidor ou houver uma interrupção na rede).

- Antes do MySQL 5.7.19, o **mysqlbinlog** não recebe todos os eventos assim que são registrados, mesmo que o servidor esteja configurado com `sync_binlog=1`. Isso significa que alguns dos eventos mais recentes podem estar faltando. Para garantir que o **mysqlbinlog** veja os eventos mais recentes, limpe o log binário no servidor que você está fazendo backup.

- O atraso para um backup é semelhante ao atraso para um servidor de replicação.
