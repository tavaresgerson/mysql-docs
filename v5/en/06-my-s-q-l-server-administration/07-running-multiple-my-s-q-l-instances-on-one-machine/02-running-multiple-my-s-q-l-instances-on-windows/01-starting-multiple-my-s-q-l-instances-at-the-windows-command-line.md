#### 5.7.2.1 Iniciando Múltiplas Instâncias MySQL na Linha de Comando do Windows

O procedimento para iniciar um único servidor MySQL manualmente a partir da linha de comando é descrito na [Seção 2.3.4.6, “Iniciando MySQL a partir da Linha de Comando do Windows”](windows-start-command-line.html "2.3.4.6 Starting MySQL from the Windows Command Line"). Para iniciar múltiplos servidores dessa forma, você pode especificar as opções apropriadas na linha de comando ou em um option file. É mais conveniente colocar as opções em um option file, mas é necessário garantir que cada servidor receba seu próprio conjunto de opções. Para fazer isso, crie um option file para cada servidor e informe ao servidor o nome do arquivo usando a opção [`--defaults-file`](option-file-options.html#option_general_defaults-file) ao executá-lo.

Suponha que você deseja executar uma instância de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") na porta 3307 com um data directory de `C:\mydata1`, e outra instância na porta 3308 com um data directory de `C:\mydata2`. Use este procedimento:

1. Certifique-se de que cada data directory exista, incluindo sua própria cópia do Database `mysql` que contém as grant tables.

2. Crie dois option files. Por exemplo, crie um arquivo chamado `C:\my-opts1.cnf` que se parece com isto:

   ```sql
   [mysqld]
   datadir = C:/mydata1
   port = 3307
   ```

   Crie um segundo arquivo chamado `C:\my-opts2.cnf` que se parece com isto:

   ```sql
   [mysqld]
   datadir = C:/mydata2
   port = 3308
   ```

3. Use a opção [`--defaults-file`](option-file-options.html#option_general_defaults-file) para iniciar cada servidor com seu próprio option file:

   ```sql
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts1.cnf
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts2.cnf
   ```

   Cada servidor inicia em primeiro plano (nenhum novo prompt aparece até que o servidor seja encerrado mais tarde), então você deve emitir esses dois comandos em janelas de console separadas.

Para encerrar os servidores, conecte-se a cada um usando o número de porta apropriado:

```sql
C:\> C:\mysql\bin\mysqladmin --port=3307 --host=127.0.0.1 --user=root --password shutdown
C:\> C:\mysql\bin\mysqladmin --port=3308 --host=127.0.0.1 --user=root --password shutdown
```

Os servidores configurados conforme descrito permitem que os clientes se conectem via TCP/IP. Se sua versão do Windows suportar named pipes e você também quiser permitir conexões de named-pipe, especifique opções que habilitem o named pipe e definam seu nome. Cada servidor que suporta conexões de named-pipe deve usar um nome de pipe exclusivo. Por exemplo, o arquivo `C:\my-opts1.cnf` poderia ser escrito desta forma:

```sql
[mysqld]
datadir = C:/mydata1
port = 3307
enable-named-pipe
socket = mypipe1
```

Modifique `C:\my-opts2.cnf` de forma similar para uso pelo segundo servidor. Em seguida, inicie os servidores conforme descrito anteriormente.

Um procedimento semelhante se aplica a servidores que você deseja permitir conexões de shared-memory. Habilite tais conexões iniciando o servidor com a variável de sistema [`shared_memory`](server-system-variables.html#sysvar_shared_memory) ativada e especifique um nome de shared-memory exclusivo para cada servidor definindo a variável de sistema [`shared_memory_base_name`](server-system-variables.html#sysvar_shared_memory_base_name).