#### 5.7.2.1 Iniciar múltiplas instâncias do MySQL na linha de comando do Windows

O procedimento para iniciar um único servidor MySQL manualmente a partir da linha de comando é descrito em Seção 2.3.4.6, “Iniciar o MySQL a partir da linha de comando do Windows”. Para iniciar vários servidores dessa maneira, você pode especificar as opções apropriadas na linha de comando ou em um arquivo de opções. É mais conveniente colocar as opções em um arquivo de opções, mas é necessário garantir que cada servidor receba seu próprio conjunto de opções. Para fazer isso, crie um arquivo de opções para cada servidor e informe ao servidor o nome do arquivo com a opção `--defaults-file` ao executá-lo.

Suponha que você queira executar uma instância do **mysqld** na porta 3307 com um diretório de dados de `C:\mydata1` e outra instância na porta 3308 com um diretório de dados de `C:\mydata2`. Use este procedimento:

1. Certifique-se de que cada diretório de dados exista, incluindo sua própria cópia do banco de dados `mysql` que contém as tabelas de concessão.

2. Crie dois arquivos de opção. Por exemplo, crie um arquivo chamado `C:\my-opts1.cnf` que tenha a seguinte aparência:

   ```sql
   [mysqld]
   datadir = C:/mydata1
   port = 3307
   ```

   Crie um segundo arquivo chamado `C:\my-opts2.cnf` que tenha a seguinte aparência:

   ```sql
   [mysqld]
   datadir = C:/mydata2
   port = 3308
   ```

3. Use a opção `--defaults-file` para iniciar cada servidor com seu próprio arquivo de opções:

   ```sql
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts1.cnf
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts2.cnf
   ```

   Cada servidor começa em primeiro plano (não aparece um novo prompt até que o servidor saia mais tarde), então você deve emitir esses dois comandos em janelas de console separadas.

Para desligar os servidores, conecte-se a cada um deles usando o número de porta apropriado:

```sql
C:\> C:\mysql\bin\mysqladmin --port=3307 --host=127.0.0.1 --user=root --password shutdown
C:\> C:\mysql\bin\mysqladmin --port=3308 --host=127.0.0.1 --user=root --password shutdown
```

Os servidores configurados conforme descrito permitem que os clientes se conectem via TCP/IP. Se a versão do Windows que você está usando suporta conexões por meio de tubos nomeados e você também deseja permitir conexões por meio de tubos nomeados, especifique as opções que habilitam o tubo nomeado e especifique seu nome. Cada servidor que suporte conexões por meio de tubos nomeados deve usar um nome de tubo exclusivo. Por exemplo, o arquivo `C:\my-opts1.cnf` pode ser escrito da seguinte forma:

```sql
[mysqld]
datadir = C:/mydata1
port = 3307
enable-named-pipe
socket = mypipe1
```

Modifique `C:\my-opts2.cnf` de forma semelhante para uso pelo segundo servidor. Em seguida, inicie os servidores conforme descrito anteriormente.

Um procedimento semelhante se aplica para servidores que você deseja permitir conexões de memória compartilhada. Ative essas conexões iniciando o servidor com a variável de sistema `shared_memory` habilitada e especifique um nome único de memória compartilhada para cada servidor, definindo a variável de sistema `shared_memory_base_name`.
