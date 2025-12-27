#### 6.6.9.3 Usando `mysqlbinlog` para fazer backup de arquivos de log binário

Por padrão, `mysqlbinlog` lê arquivos de log binário e exibe seu conteúdo em formato de texto. Isso permite que você examine os eventos dentro dos arquivos de forma mais fácil e os execute novamente (por exemplo, usando a saída como entrada para `mysql`). `mysqlbinlog` pode ler arquivos de log diretamente do sistema de arquivos local ou, com a opção `--read-from-remote-server`, pode se conectar a um servidor e solicitar o conteúdo do log binário desse servidor. `mysqlbinlog` escreve a saída de texto em sua saída padrão ou no arquivo nomeado como o valor da opção `--result-file=file_name` se essa opção for fornecida.

*  Capacidades de backup de `mysqlbinlog`
*  Opções de backup de `mysqlbinlog`
*  Backup estático e ao vivo
*  Nomeação de arquivos de saída
*  Exemplo: mysqldump + mysqlbinlog para backup e restauração
*  Restrições de backup de `mysqlbinlog`

##### Capacidades de backup de `mysqlbinlog`

`mysqlbinlog` pode ler arquivos de log binário e escrever novos arquivos contendo o mesmo conteúdo — ou seja, em formato binário em vez de texto. Essa capacidade permite que você faça um backup fácil de um log binário em seu formato original. `mysqlbinlog` pode fazer um backup estático, fazendo backup de um conjunto de arquivos de log e parando quando o final do último arquivo é alcançado. Também pode fazer um backup contínuo (“ao vivo”), permanecendo conectado ao servidor quando ele alcança o final do último arquivo de log e continuando a copiar novos eventos à medida que são gerados. Na operação de backup contínuo, `mysqlbinlog` funciona até que a conexão termine (por exemplo, quando o servidor sai) ou `mysqlbinlog` seja encerrado forçadamente. Quando a conexão termina, `mysqlbinlog` não espera e não tenta reconectar, ao contrário de um servidor replica. Para continuar um backup ao vivo após o servidor ter sido reiniciado, você também deve reiniciar `mysqlbinlog`.

Importante

`mysqlbinlog` pode fazer backup de arquivos de log binário criptografados e não criptografados. No entanto, as cópias de arquivos de log binário criptografados geradas usando `mysqlbinlog` são armazenadas em um formato não criptografado.

##### Opções de backup do mysqlbinlog

O backup do log binário exige que você invoque o `mysqlbinlog` com pelo menos duas opções:

* A opção `--read-from-remote-server` (ou `-R`) informa ao `mysqlbinlog` para se conectar a um servidor e solicitar seu log binário. (Isso é semelhante a um servidor replica se conectando ao seu servidor de fonte de replicação.)
* A opção `--raw` informa ao `mysqlbinlog` para escrever a saída em formato bruto (binário), e não em texto.

Juntamente com `--read-from-remote-server`, é comum especificar outras opções: `--host` indica onde o servidor está sendo executado, e você também pode precisar especificar opções de conexão, como `--user` e `--password`.

Várias outras opções são úteis em conjunto com `--raw`:
* `--stop-never`: Mantenha conectado ao servidor após alcançar o final do último arquivo de log e continue lendo novos eventos.
* `--connection-server-id=id`: O ID do servidor que o `mysqlbinlog` relata quando se conecta a um servidor. Quando `--stop-never` é usado, o ID de servidor reportado por padrão é 1. Se isso causar um conflito com o ID de um servidor replica ou outro processo `mysqlbinlog`, use `--connection-server-id` para especificar um ID de servidor alternativo. Veja a Seção 6.6.9.4, “Especificando o ID do servidor mysqlbinlog”.
* `--result-file`: Um prefixo para os nomes dos arquivos de saída, conforme descrito mais adiante.

##### Backups Estáticos e ao Vivo

Para fazer backup dos arquivos de log binário de um servidor com o `mysqlbinlog`, você deve especificar nomes de arquivos que realmente existam no servidor. Se você não souber os nomes, conecte-se ao servidor e use a declaração `SHOW BINARY LOGS` para ver os nomes atuais. Suponha que a declaração produza esta saída:

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000130 |     27459 | No        |
| binlog.000131 |     13719 | No        |
| binlog.000132 |     43268 | No        |
+---------------+-----------+-----------+
```

Com essas informações, você pode usar o `mysqlbinlog` para fazer backup do log binário para o diretório atual da seguinte forma (entre cada comando em uma única linha):

* Para fazer um backup estático de `binlog.000130` até `binlog.000132`, use um dos seguintes comandos:

  ```
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    binlog.000130 binlog.000131 binlog.000132

  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --to-last-log binlog.000130
  ```

O primeiro comando especifica cada nome de arquivo explicitamente. O segundo nomeia apenas o primeiro arquivo e usa `--to-last-log` para ler até o último log. Uma diferença entre esses comandos é que, se o servidor abrir `binlog.000133` antes de `mysqlbinlog` chegar ao final de `binlog.000132`, o primeiro comando não o lê, mas o segundo comando sim.
* Para fazer um backup em tempo real em que `mysqlbinlog` começa com `binlog.000130` para copiar arquivos de log existentes, e depois permanece conectado para copiar novos eventos à medida que o servidor os gera:

  ```
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --stop-never binlog.000130
  ```

  Com `--stop-never`, não é necessário especificar `--to-last-log` para ler até o último arquivo de log, porque essa opção é implícita.

##### Nomeação de Arquivos de Saída

Sem `--raw`, o `mysqlbinlog` produz saída de texto e a opção `--result-file`, se fornecida, especifica o nome do único arquivo para o qual toda a saída é escrita. Com `--raw`, o `mysqlbinlog` escreve um arquivo de saída binário para cada arquivo de log transferido do servidor. Por padrão, o `mysqlbinlog` escreve os arquivos no diretório atual com os mesmos nomes dos arquivos de log originais. Para modificar os nomes dos arquivos de saída, use a opção `--result-file`. Em conjunto com `--raw`, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.
Suponha que um servidor tenha atualmente arquivos de log binários com os nomes `binlog.000999` e assim por diante. Se você usar `mysqlbinlog --raw` para fazer o backup dos arquivos, a opção `--result-file` produz nomes de arquivos de saída conforme mostrado na tabela a seguir. Você pode escrever os arquivos em um diretório específico começando o valor da `--result-file` com o caminho do diretório. Se o valor da `--result-file` consistir apenas em um nome de diretório, o valor deve terminar com o caractere de separador de caminho. Os arquivos de saída são sobrescritos se existirem.

<table><thead><tr> <th>Opção `--result-file`</th> <th>Nomes dos Arquivos de Saída</th> </tr></thead><tbody><tr> <td><code>--result-file=x</code></td> <td><code>xbinlog.000999</code> e superior</td> </tr><tr> <td><code>--result-file=/tmp/</code></td> <td><code>/tmp/binlog.000999</code> e superior</td> </tr><tr> <td><code>--result-file=/tmp/x</code></td> <td><code>/tmp/xbinlog.000999</code> e superior</td> </tr></tbody></table>

##### Exemplo: mysqldump + mysqlbinlog para Backup e Restauração

O exemplo a seguir descreve um cenário simples que mostra como usar `mysqldump` e  `mysqlbinlog` juntos para fazer um backup dos dados e do log binário do servidor, e como usar o backup para restaurar o servidor se ocorrer perda de dados. O exemplo assume que o servidor está rodando no host *`host_name`* e seu primeiro arquivo de log binário é chamado `binlog.000999`. Insira cada comando em uma única linha.

Use `mysqlbinlog` para fazer um backup contínuo do log binário:

```
mysqlbinlog --read-from-remote-server --host=host_name --raw
  --stop-never binlog.000999
```

Use `mysqldump` para criar um arquivo de dump como um instantâneo dos dados do servidor. Use `--all-databases`, `--events` e `--routines` para fazer um backup de todos os dados, e `--source-data=2` para incluir as coordenadas do log binário atual no arquivo de dump.

```
mysqldump --host=host_name --all-databases --events --routines --source-data=2> dump_file
```

Execute o comando `mysqldump` periodicamente para criar instantâneos mais recentes conforme desejado.

Se ocorrer perda de dados (por exemplo, se o servidor sair inesperadamente), use o arquivo de dump mais recente para restaurar os dados:

```bash
mysql --host=host_name -u root -p < dump_file
```

Em seguida, use o backup do log binário para reexecutar eventos que foram escritos após as coordenadas listadas no arquivo de dump. Suponha que as coordenadas no arquivo sejam assim:

```sql
-- CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='binlog.001002', SOURCE_LOG_POS=27284;
```

Se o arquivo de log binário mais recente do backup for chamado `binlog.001004`, reexecute os eventos do log da seguinte maneira:

```bash
mysqlbinlog --start-position=27284 binlog.001002 binlog.001003 binlog.001004
  | mysql --host=host_name -u root -p
```

Você pode achar mais fácil copiar os arquivos de backup (arquivo de dump e arquivos de log binário) para o host do servidor para facilitar a operação de restauração, ou se o MySQL não permitir o acesso remoto como `root`.

##### Restrições de Backup do `mysqlbinlog`
English:

















































































































Os backups de log binário com `mysqlbinlog` estão sujeitos a essas restrições:

* O `mysqlbinlog` não se reconecta automaticamente ao servidor MySQL se a conexão for perdida (por exemplo, se ocorrer um reinício do servidor ou houver uma interrupção de rede).
* O atraso para um backup é semelhante ao atraso para um servidor replica.