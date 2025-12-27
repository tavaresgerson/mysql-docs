#### 7.8.2.1 Iniciar múltiplas instâncias do MySQL na linha de comando do Windows

O procedimento para iniciar um único servidor MySQL manualmente a partir da linha de comando é descrito na Seção 2.3.3.6, “Iniciar o MySQL a partir da linha de comando do Windows”. Para iniciar múltiplas instâncias dessa maneira, você pode especificar as opções apropriadas na linha de comando ou em um arquivo de opções. É mais conveniente colocar as opções em um arquivo de opções, mas é necessário garantir que cada servidor receba seu próprio conjunto de opções. Para fazer isso, crie um arquivo de opções para cada servidor e informe ao servidor o nome do arquivo com a opção `--defaults-file` ao executá-lo.

Suponha que você queira executar uma instância do `mysqld` na porta 3307 com um diretório de dados de `C:\mydata1` e outra instância na porta 3308 com um diretório de dados de `C:\mydata2`. Use este procedimento:

1. Certifique-se de que cada diretório de dados existe, incluindo sua própria cópia do banco de dados `mysql` que contém as tabelas de concessão.
2. Crie dois arquivos de opções. Por exemplo, crie um arquivo chamado `C:\my-opts1.cnf` que tenha a seguinte aparência:

   ```
   [mysqld]
   datadir = C:/mydata1
   port = 3307
   ```

   Crie um segundo arquivo chamado `C:\my-opts2.cnf` que tenha a seguinte aparência:

   ```
   [mysqld]
   datadir = C:/mydata2
   port = 3308
   ```
3. Use a opção `--defaults-file` para iniciar cada servidor com seu próprio arquivo de opções:

   ```
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts1.cnf
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts2.cnf
   ```

Cada servidor inicia em segundo plano (não aparece nova prompt até que o servidor saia mais tarde), então você precisa emitir esses dois comandos em janelas de console separadas.

Para desligar os servidores, conecte-se a cada um usando o número de porta apropriado:

```
C:\> C:\mysql\bin\mysqladmin --port=3307 --host=127.0.0.1 --user=root --password shutdown
C:\> C:\mysql\bin\mysqladmin --port=3308 --host=127.0.0.1 --user=root --password shutdown
```

Servidores configurados como descrito permitem que os clientes se conectem via TCP/IP. Se sua versão do Windows suportar tubos nomeados e você também quiser permitir conexões por tubos nomeados, especifique opções que habilitem o tubo nomeado e especifiquem seu nome. Cada servidor que suporte conexões por tubos nomeados deve usar um nome de tubo único. Por exemplo, o arquivo `C:\my-opts1.cnf` pode ser escrito da seguinte maneira:

```
[mysqld]
datadir = C:/mydata1
port = 3307
enable-named-pipe
socket = mypipe1
```

Modifique `C:\my-opts2.cnf` de forma semelhante para uso pelo segundo servidor. Em seguida, inicie os servidores conforme descrito anteriormente.

Um procedimento semelhante se aplica a servidores que você deseja permitir conexões de memória compartilhada. Habilite essas conexões iniciando o servidor com a variável de sistema `shared_memory` habilitada e especifique um nome único de memória compartilhada para cada servidor, definindo a variável de sistema `shared_memory_base_name`.