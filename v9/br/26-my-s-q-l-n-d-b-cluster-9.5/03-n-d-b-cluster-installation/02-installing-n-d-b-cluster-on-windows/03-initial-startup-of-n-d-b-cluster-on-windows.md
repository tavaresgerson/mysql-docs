#### 25.3.2.3 Iniciação Inicial do NDB Cluster no Windows

Uma vez que os executáveis do NDB Cluster e os arquivos de configuração necessários estejam em seu lugar, realizar uma inicialização inicial do cluster é simplesmente uma questão de iniciar os executáveis do NDB Cluster para todos os nós do cluster. Cada processo do nó do cluster deve ser iniciado separadamente, no computador host onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, finalmente, pelos nós SQL.

1. No host do nó de gerenciamento, execute o seguinte comando da linha de comando para iniciar o processo do nó de gerenciamento. A saída deve parecer semelhante à que é mostrada aqui:

   ```
   C:\mysql\bin> ndb_mgmd
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- NDB Cluster Management Server. mysql-9.5.0-ndb-9.5.0
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- Reading cluster configuration from 'config.ini'
   ```

   O processo do nó de gerenciamento continua a imprimir a saída de log no console. Isso é normal, porque o nó de gerenciamento não está rodando como um serviço do Windows. (Se você já usou o NDB Cluster em uma plataforma semelhante ao Unix, como Linux, você pode notar que o comportamento padrão do nó de gerenciamento nesse aspecto no Windows é efetivamente o oposto do seu comportamento em sistemas Unix, onde ele roda por padrão como um processo daemon do Unix. Esse comportamento também é verdadeiro para os processos de nós de dados do NDB Cluster rodando no Windows.) Por essa razão, não feche a janela na qual o **ndb_mgmd.exe** está rodando; fazer isso mata o processo do nó de gerenciamento. (Veja a Seção 25.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”, onde mostramos como instalar e rodar processos do NDB Cluster como serviços do Windows.)

   A opção `-f` necessária indica ao nó de gerenciamento onde encontrar o arquivo de configuração global (`config.ini`). A forma longa dessa opção é `--config-file`.

   Importante

Um nó de gerenciamento de NDB Cluster armazena em cache os dados de configuração que lê do `config.ini`; uma vez que ele cria um cache de configuração, ele ignora o arquivo `config.ini` em inicializações subsequentes, a menos que seja forçado a fazer o contrário. Isso significa que, se o nó de gerenciamento não iniciar devido a um erro neste arquivo, você deve fazer o nó de gerenciamento reler `config.ini` depois de corrigir quaisquer erros nele. Você pode fazer isso iniciando o **ndb_mgmd.exe** com a opção `--reload` ou `--initial` na linha de comando. Qualquer uma dessas opções funciona para atualizar o cache de configuração.

Não é necessário nem aconselhável usar nenhuma dessas opções no arquivo `my.ini` do nó de gerenciamento.

2. Em cada um dos hosts dos nós de dados, execute o comando mostrado aqui para iniciar os processos do nó de dados:

   ```
   C:\mysql\bin> ndbd
   2010-06-23 07:53:46 [ndbd] INFO -- Configuration fetched from 'localhost:1186', generation: 1
   ```

   Em cada caso, a primeira linha de saída do processo do nó de dados deve se assemelhar ao que é mostrado no exemplo anterior, e é seguida por linhas adicionais de saída de log. Como no processo do nó de gerenciamento, isso é normal, porque o nó de dados não está sendo executado como um serviço do Windows. Por essa razão, não feche a janela de console na qual o processo do nó de dados está sendo executado; fazer isso mata o **ndbd.exe**. (Para mais informações, consulte a Seção 25.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”.)

3. Não inicie o nó SQL ainda; ele não pode se conectar ao clúster até que os nós de dados tenham terminado de iniciar, o que pode levar algum tempo. Em vez disso, em uma nova janela do console no host do nó de gerenciamento, inicie o cliente de gerenciamento do NDB Cluster **ndb_mgm.exe**, que deve estar em `C:\mysql\bin` no host do nó de gerenciamento. (Não tente reutilizar a janela do console onde o **ndb_mgmd.exe** está em execução digitando **CTRL**+**C**, pois isso interrompe o nó de gerenciamento.) A saída resultante deve parecer assim:

   ```
   C:\mysql\bin> ndb_mgm
   -- NDB Cluster -- Management Client --
   ndb_mgm>
   ```

   Quando o prompt `ndb_mgm>` aparecer, isso indica que o cliente de gerenciamento está pronto para receber comandos de gerenciamento do NDB Cluster. Você pode observar o status dos nós de dados à medida que eles começam digitando `ALL STATUS` no prompt do cliente de gerenciamento. Esse comando causa um relatório em execução da sequência de inicialização dos nós de dados, que deve parecer algo assim:

   ```
   ndb_mgm> ALL STATUS
   Connected to Management Server at: localhost:1186 (using cleartext)
   Node 2: starting (Last completed phase 3) (mysql-9.5.0-ndb-9.5.0)
   Node 3: starting (Last completed phase 3) (mysql-9.5.0-ndb-9.5.0)

   Node 2: starting (Last completed phase 4) (mysql-9.5.0-ndb-9.5.0)
   Node 3: starting (Last completed phase 4) (mysql-9.5.0-ndb-9.5.0)

   Node 2: Started (version 9.5.0)
   Node 3: Started (version 9.5.0)

   ndb_mgm>
   ```

   Observação

   Os comandos emitidos no cliente de gerenciamento não são case-sensitive; usamos maiúsculas como a forma canônica desses comandos, mas você não é obrigado a observar essa convenção ao digitá-los no cliente **ndb_mgm**. Para mais informações, consulte a Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”.

   A saída produzida por `ALL STATUS` provavelmente variará daquela mostrada aqui, de acordo com a velocidade com que os nós de dados conseguem iniciar, o número de versão da versão do software NDB Cluster que você está usando e outros fatores. O que é significativo é que, quando você vê que ambos os nós de dados iniciaram, você está pronto para iniciar o nó SQL.

Você pode deixar o **ndb_mgm.exe** rodando; ele não tem impacto negativo no desempenho do NDB Cluster, e o usamos no próximo passo para verificar se o nó SQL está conectado ao cluster após você tê-lo iniciado.

4. No computador designado como anfitrião do nó SQL, abra uma janela de console e navegue até o diretório onde você descompactado os binários do NDB Cluster (se você está seguindo nosso exemplo, isso é `C:\mysql\bin`).

Inicie o nó SQL invocando o **mysqld.exe** a partir da linha de comando, como mostrado aqui:

```
   C:\mysql\bin> mysqld --console
   ```

A opção `--console` faz com que as informações de log sejam escritas para o console, o que pode ser útil em caso de problemas. (Uma vez que você esteja satisfeito de que o nó SQL está rodando de maneira satisfatória, você pode parar e reiniciar sem a opção `--console`, para que o log seja realizado normalmente.)

Na janela de console onde o cliente de gerenciamento (**ndb_mgm.exe**) está rodando no anfitrião do nó de gerenciamento, insira o comando `SHOW`, que deve produzir uma saída semelhante à mostrada aqui:

```
   ndb_mgm> SHOW
   Connected to Management Server at: localhost:1186 (using cleartext)
   Cluster Configuration
   ---------------------
   [ndbd(NDB)]     2 node(s)
   id=2    @198.51.100.30  (Version: 9.5.0-ndb-9.5.0, Nodegroup: 0, *)
   id=3    @198.51.100.40  (Version: 9.5.0-ndb-9.5.0, Nodegroup: 0)

   [ndb_mgmd(MGM)] 1 node(s)
   id=1    @198.51.100.10  (Version: 9.5.0-ndb-9.5.0)

   [mysqld(API)]   1 node(s)
   id=4    @198.51.100.20  (Version: 9.5.0-ndb-9.5.0)
   ```

Você também pode verificar que o nó SQL está conectado ao NDB Cluster no cliente **mysql** (**mysql.exe**) usando a declaração `SHOW ENGINE NDB STATUS`.

Agora você deve estar pronto para trabalhar com objetos e dados de banco de dados usando o motor de armazenamento do NDB Cluster `NDBCLUSTER`. Veja a Seção 25.3.5, “Exemplo do NDB Cluster com Tabelas e Dados”, para mais informações e exemplos.

Você também pode instalar **ndb_mgmd.exe**, **ndbd.exe** e **ndbmtd.exe**") como serviços do Windows. Para obter informações sobre como fazer isso, veja a Seção 25.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”).