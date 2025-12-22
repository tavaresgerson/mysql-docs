#### 7.8.2.1 Iniciar múltiplas instâncias do MySQL na Linha de Comando do Windows

O procedimento para iniciar um único servidor MySQL manualmente a partir da linha de comando é descrito na Seção 2.3.3.6, "Início do MySQL a partir da Linha de Comando do Windows". Para iniciar vários servidores desta forma, você pode especificar as opções apropriadas na linha de comando ou em um arquivo de opções. É mais conveniente colocar as opções em um arquivo de opções, mas é necessário garantir que cada servidor receba seu próprio conjunto de opções. Para fazer isso, crie um arquivo de opções para cada servidor e diga ao servidor o nome do arquivo com uma opção `--defaults-file` quando você o executar.

Suponha que você queira executar uma instância de `mysqld` na porta 3307 com um diretório de dados de `C:\mydata1`, e outra instância na porta 3308 com um diretório de dados de `C:\mydata2`. Use este procedimento:

1. Certifique-se de que cada diretório de dados existe, incluindo sua própria cópia do banco de dados `mysql` que contém as tabelas de concessão.
2. Crie dois arquivos de opções. Por exemplo, crie um arquivo chamado `C:\my-opts1.cnf` que se parece com este:

   ```
   [mysqld]
   datadir = C:/mydata1
   port = 3307
   ```

   Crie um segundo arquivo chamado `C:\my-opts2.cnf` que se parece com este:

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

   Cada servidor começa no primeiro plano (nenhum novo prompt aparece até que o servidor saia mais tarde), então você precisa emitir esses dois comandos em janelas de console separadas.

Para desligar os servidores, conecte-se a cada um usando o número de porta apropriado:

```
C:\> C:\mysql\bin\mysqladmin --port=3307 --host=127.0.0.1 --user=root --password shutdown
C:\> C:\mysql\bin\mysqladmin --port=3308 --host=127.0.0.1 --user=root --password shutdown
```

Os servidores configurados como acabamos de descrever permitem que os clientes se conectem através de TCP/IP. Se a sua versão do Windows suporta tubos nomeados e você também quer permitir conexões de tubos nomeados, especifique opções que habilitem o tubo nomeado e especifique seu nome. Cada servidor que suporta conexões de tubos nomeados deve usar um nome de tubos exclusivo. Por exemplo, o arquivo `C:\my-opts1.cnf` pode ser escrito assim:

```
[mysqld]
datadir = C:/mydata1
port = 3307
enable-named-pipe
socket = mypipe1
```

Modifique o `C:\my-opts2.cnf` da mesma forma para uso pelo segundo servidor. Em seguida, inicie os servidores como descrito anteriormente.

Um procedimento semelhante se aplica aos servidores que você deseja permitir conexões de memória compartilhada. Ative essas conexões iniciando o servidor com a variável de sistema `shared_memory` ativada e especifique um nome de memória compartilhada exclusivo para cada servidor definindo a variável de sistema `shared_memory_base_name`.
