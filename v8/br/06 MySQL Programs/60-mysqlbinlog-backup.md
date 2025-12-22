#### 6.6.9.3 Usando mysqlbinlog para fazer backup de arquivos de log binário

Por padrão, **mysqlbinlog** lê arquivos de log binários e exibe seu conteúdo em formato de texto. Isso permite que você examine eventos dentro dos arquivos com mais facilidade e re-executá-los (por exemplo, usando a saída como entrada para `mysql`). **mysqlbinlog** pode ler arquivos de log diretamente do sistema de arquivos local, ou, com a opção `--read-from-remote-server` , pode se conectar a um servidor e solicitar conteúdo de log binário desse servidor. **mysqlbinlog** escreve a saída de texto em sua saída padrão, ou para o arquivo nomeado como o valor da opção `--result-file=file_name` se essa opção for dada.

- Capacidades de Backup do mysqlbinlog
- Opções de backup do mysqlbinlog
- Backups estáticos e ao vivo
- Nome do arquivo de saída
- Exemplo: mysqldump + mysqlbinlog para Backup e Restauração
- Restrições de backup do mysqlbinlog

##### Capacidades de Backup do mysqlbinlog

**mysqlbinlog** pode ler arquivos de log binários e escrever novos arquivos contendo o mesmo conteúdo, ou seja, em formato binário em vez de formato de texto. Esta capacidade permite que você faça facilmente um backup de um log binário em seu formato original. **mysqlbinlog** pode fazer um backup estático, fazendo backup de um conjunto de arquivos de log e parando quando o final do último arquivo é atingido. Ele também pode fazer um backup contínuo (live), permanecendo conectado ao servidor quando ele atinge o final do último arquivo de log e continuando a copiar novos eventos à medida que eles são gerados. Em operação de backup contínuo, **mysqlbinlog** é executado até que a conexão termine (por exemplo, quando o servidor sai) ou **mysqlbinlog** é terminada forçosamente. Quando a conexão termina, o servidor **mysqlbinlog** não espera e tenta a conexão novamente, ao contrário de uma cópia de backup ao vivo. Para continuar após o servidor ter sido reiniciado

Importância

**mysqlbinlog** pode fazer backup de arquivos de log binários criptografados e não criptografados. No entanto, cópias de arquivos de log binários criptografados gerados usando **mysqlbinlog** são armazenados em um formato não criptografado.

##### Opções de backup do mysqlbinlog

Backup de log binário requer que você invoque **mysqlbinlog** com duas opções no mínimo:

- A opção `--read-from-remote-server` (ou `-R`) diz ao **mysqlbinlog** para se conectar a um servidor e solicitar seu log binário. (Isso é semelhante a um servidor de réplica se conectando ao seu servidor de origem de réplica.)
- A opção `--raw` diz ao **mysqlbinlog** para escrever a saída (binária) bruta, não a saída de texto.

Juntamente com `--read-from-remote-server`, é comum especificar outras opções: `--host` indica onde o servidor está sendo executado, e você também pode precisar especificar opções de conexão, como `--user` e `--password`.

Várias outras opções são úteis em conjunto com o `--raw`:

- `--stop-never`: Mantenha-se conectado ao servidor depois de chegar ao final do último arquivo de log e continue a ler novos eventos.
- `--connection-server-id=id`: O ID do servidor que **mysqlbinlog** relata quando se conecta a um servidor. Quando `--stop-never` é usado, o ID do servidor relatado por padrão é 1. Se isso causar um conflito com o ID de um servidor de réplica ou outro processo **mysqlbinlog**, use `--connection-server-id` para especificar um ID de servidor alternativo. Veja Seção 6.6.9.4, Especificar o ID do servidor mysqlbinlog.
- `--result-file`: Um prefixo para nomes de arquivos de saída, como descrito mais adiante.

##### Backups estáticos e ao vivo

Para fazer backup dos arquivos de log binário de um servidor com **mysqlbinlog**, você deve especificar nomes de arquivos que realmente existem no servidor. Se você não conhece os nomes, conecte-se ao servidor e use a instrução `SHOW BINARY LOGS` para ver os nomes atuais. Suponha que a instrução produza esta saída:

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

Com essa informação, você pode usar **mysqlbinlog** para fazer backup do log binário para o diretório atual da seguinte forma (entrar cada comando em uma única linha):

- Para fazer um backup estático do `binlog.000130` através do `binlog.000132`, use um destes comandos:

  ```
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    binlog.000130 binlog.000131 binlog.000132

  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --to-last-log binlog.000130
  ```

  O primeiro comando especifica cada nome de arquivo explicitamente. O segundo nomeia apenas o primeiro arquivo e usa `--to-last-log` para ler o último. Uma diferença entre esses comandos é que, se o servidor abrir `binlog.000133` antes de **mysqlbinlog** chegar ao final de `binlog.000132`, o primeiro comando não o lê, mas o segundo comando o faz.
- Para fazer um backup ao vivo no qual **mysqlbinlog** começa com `binlog.000130` para copiar arquivos de log existentes, então permanece conectado para copiar novos eventos à medida que o servidor os gera:

  ```
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --stop-never binlog.000130
  ```

  Com `--stop-never`, não é necessário especificar `--to-last-log` para ler o último arquivo de log porque essa opção está implícita.

##### Nome do arquivo de saída

Sem `--raw`, **mysqlbinlog** produz saída de texto e a opção `--result-file`, se dada, especifica o nome do arquivo único para o qual toda a saída é escrita. Com `--raw`, **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de log transferido do servidor. Por padrão, **mysqlbinlog** escreve os arquivos no diretório atual com os mesmos nomes que os arquivos de log originais. Para modificar os nomes dos arquivos de saída, use a opção `--result-file`. Em conjunto com `--raw`, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

Suponha que um servidor atualmente tenha arquivos de log binários com o nome `binlog.000999` e acima. Se você usar **mysqlbinlog --raw** para fazer backup dos arquivos, a opção `--result-file` produz nomes de arquivos de saída como mostrado na tabela a seguir. Você pode escrever os arquivos em um diretório específico começando o valor `--result-file` com o caminho do diretório. Se o valor `--result-file` consiste apenas de um nome de diretório, o valor deve terminar com o caractere separador do nome do caminho. Os arquivos de saída são sobrescritos se existirem.

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>[[<code class="option">--result-file</code>]] Opção</th> <th>Nomes de arquivo de saída</th> </tr></thead><tbody><tr> <td>[[<code class="option">--result-file=x</code>]]</td> <td>[[<code>xbinlog.000999</code>]] e superior</td> </tr><tr> <td>[[<code class="option">--result-file=/tmp/</code>]]</td> <td>[[<code>/tmp/binlog.000999</code>]] e superior</td> </tr><tr> <td>[[<code class="option">--result-file=/tmp/x</code>]]</td> <td>[[<code>/tmp/xbinlog.000999</code>]] e superior</td> </tr></tbody></table>

##### Exemplo: mysqldump + mysqlbinlog para Backup e Restauração

O exemplo a seguir descreve um cenário simples que mostra como usar `mysqldump` e **mysqlbinlog** juntos para fazer backup de dados de um servidor e log binário, e como usar o backup para restaurar o servidor se ocorrer perda de dados. O exemplo assume que o servidor está em execução no host \* `host_name` \* e seu primeiro arquivo de log binário é chamado `binlog.000999`. Insira cada comando em uma única linha.

Use **mysqlbinlog** para fazer um backup contínuo do log binário:

```
mysqlbinlog --read-from-remote-server --host=host_name --raw
  --stop-never binlog.000999
```

Use `mysqldump` para criar um arquivo de despejo como um instantâneo dos dados do servidor. Use `--all-databases`, `--events`, e `--routines` para fazer backup de todos os dados, e `--source-data=2` para incluir as coordenadas de registro binário atuais no arquivo de despejo.

```
mysqldump --host=host_name --all-databases --events --routines --source-data=2> dump_file
```

Execute o comando `mysqldump` periodicamente para criar novas instantâneas conforme desejado.

Se ocorrer perda de dados (por exemplo, se o servidor sair inesperadamente), use o arquivo de descarte mais recente para restaurar os dados:

```
mysql --host=host_name -u root -p < dump_file
```

Em seguida, use o backup do log binário para re-executar eventos que foram escritos após as coordenadas listadas no arquivo de despejo.

```
-- CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='binlog.001002', SOURCE_LOG_POS=27284;
```

Se o arquivo de registro de backup mais recente tiver o nome `binlog.001004`, re-execute os eventos de registro assim:

```
mysqlbinlog --start-position=27284 binlog.001002 binlog.001003 binlog.001004
  | mysql --host=host_name -u root -p
```

Você pode achar mais fácil copiar os arquivos de backup (arquivo de despejo e arquivos de log binário) para o host do servidor para facilitar a execução da operação de restauração, ou se o MySQL não permitir o acesso remoto `root`.

##### Restrições de backup do mysqlbinlog

Os backups de log binário com **mysqlbinlog** estão sujeitos a estas restrições:

- **mysqlbinlog** não se reconecta automaticamente ao servidor MySQL se a conexão for perdida (por exemplo, se ocorrer uma reinicialização do servidor ou houver uma interrupção de rede).
- O atraso para um backup é semelhante ao atraso para um servidor de réplica.
