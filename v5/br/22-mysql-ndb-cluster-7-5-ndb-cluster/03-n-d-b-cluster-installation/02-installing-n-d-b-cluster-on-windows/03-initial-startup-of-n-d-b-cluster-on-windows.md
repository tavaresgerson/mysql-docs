#### 21.3.2.3 Inicialização inicial do NDB Cluster no Windows

Depois que os executáveis do NDB Cluster e os arquivos de configuração necessários estiverem instalados, iniciar o cluster é simplesmente uma questão de iniciar os executáveis do NDB Cluster em todos os nós do cluster. Cada processo do nó do cluster deve ser iniciado separadamente, no computador hospedeiro onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, finalmente, pelos nós SQL.

1. No nó de gerenciamento, execute o seguinte comando na linha de comando para iniciar o processo do nó de gerenciamento. A saída deve parecer semelhante à que está mostrada aqui:

   ```sql
   C:\mysql\bin> ndb_mgmd
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- NDB Cluster Management Server. mysql-5.7.44-ndb-7.6.36
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- Reading cluster configuration from 'config.ini'
   ```

   O processo do nó de gerenciamento continua a imprimir a saída de registro no console. Isso é normal, porque o nó de gerenciamento não está rodando como um serviço do Windows. (Se você usou o NDB Cluster em uma plataforma semelhante ao Unix, como o Linux, você pode notar que o comportamento padrão do nó de gerenciamento nesse sentido no Windows é efetivamente o oposto do seu comportamento em sistemas Unix, onde ele roda por padrão como um processo de daemon do Unix. Esse comportamento também é verdadeiro para os processos de nó de dados do NDB Cluster rodando no Windows.) Por essa razão, não feche a janela na qual o **ndb_mgmd.exe** está rodando; fazer isso mata o processo do nó de gerenciamento. (Veja Seção 21.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”, onde mostramos como instalar e rodar os processos do NDB Cluster como serviços do Windows.)

   A opção `-f` necessária indica ao nó de gerenciamento onde encontrar o arquivo de configuração global (`config.ini`). A forma longa desta opção é `--config-file`.

   Importante

   Um nó de gerenciamento de cluster do NDB armazena em cache os dados de configuração que lê do `config.ini`; uma vez que ele cria um cache de configuração, ele ignora o arquivo `config.ini` em inicializações subsequentes, a menos que seja forçado a fazer o contrário. Isso significa que, se o nó de gerenciamento não conseguir iniciar devido a um erro neste arquivo, você deve fazer o nó de gerenciamento reler `config.ini` depois de corrigir quaisquer erros nele. Você pode fazer isso iniciando **ndb_mgmd.exe** com a opção `--reload` ou `--initial` na linha de comando. Qualquer uma dessas opções funciona para atualizar o cache de configuração.

   Não é necessário nem aconselhável usar nenhuma dessas opções no arquivo `my.ini` do nó de gerenciamento.

2. Em cada um dos hosts dos nós de dados, execute o comando mostrado aqui para iniciar os processos do nó de dados:

   ```sql
   C:\mysql\bin> ndbd
   2010-06-23 07:53:46 [ndbd] INFO -- Configuration fetched from 'localhost:1186', generation: 1
   ```

   Em cada caso, a primeira linha de saída do processo do nó de dados deve se assemelhar ao que é mostrado no exemplo anterior, seguida por linhas adicionais de saída de registro. Como no processo do nó de gerenciamento, isso é normal, porque o nó de dados não está sendo executado como um serviço do Windows. Por essa razão, não feche a janela do console na qual o processo do nó de dados está sendo executado; isso mata o **ndbd.exe**. (Para mais informações, consulte Seção 21.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”).

3. Não inicie o nó SQL ainda; ele não pode se conectar ao clúster até que os nós de dados tenham terminado de iniciar, o que pode levar algum tempo. Em vez disso, em uma nova janela do console no host do nó de gerenciamento, inicie o cliente de gerenciamento do NDB Cluster **ndb_mgm.exe**, que deve estar em `C:\mysql\bin` no host do nó de gerenciamento. (Não tente reutilizar a janela do console onde **ndb_mgmd.exe** está em execução digitando **CTRL**+**C**, pois isso interrompe o nó de gerenciamento.) A saída resultante deve parecer assim:

   ```sql
   C:\mysql\bin> ndb_mgm
   -- NDB Cluster -- Management Client --
   ndb_mgm>
   ```

   Quando o prompt `ndb_mgm>` aparecer, isso indica que o cliente de gerenciamento está pronto para receber comandos de gerenciamento do NDB Cluster. Você pode observar o status dos nós de dados ao iniciar a entrada de `ALL STATUS` no prompt do cliente de gerenciamento. Esse comando gera um relatório em execução da sequência de inicialização dos nós de dados, que deve parecer algo como isso:

   ```sql
   ndb_mgm> ALL STATUS
   Connected to Management Server at: localhost:1186
   Node 2: starting (Last completed phase 3) (mysql-5.7.44-ndb-7.6.36)
   Node 3: starting (Last completed phase 3) (mysql-5.7.44-ndb-7.6.36)

   Node 2: starting (Last completed phase 4) (mysql-5.7.44-ndb-7.6.36)
   Node 3: starting (Last completed phase 4) (mysql-5.7.44-ndb-7.6.36)

   Node 2: Started (version 7.6.36)
   Node 3: Started (version 7.6.36)

   ndb_mgm>
   ```

   Nota

   Os comandos emitidos no cliente de gerenciamento não são sensíveis ao caso; usamos maiúsculas como a forma canônica desses comandos, mas você não precisa seguir essa convenção ao inseri-los no cliente **ndb_mgm**. Para mais informações, consulte Seção 21.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”.

   A saída produzida por `ALL STATUS` provavelmente variará do que é mostrado aqui, de acordo com a velocidade com que os nós de dados conseguem iniciar, o número da versão de lançamento do software NDB Cluster que você está usando e outros fatores. O que é significativo é que, quando você ver que ambos os nós de dados iniciaram, você está pronto para iniciar o nó SQL.

   Você pode deixar o **ndb_mgm.exe** rodando; ele não tem impacto negativo no desempenho do NDB Cluster, e o usaremos no próximo passo para verificar se o nó SQL está conectado ao cluster depois de tê-lo iniciado.

4. No computador designado como anfitrião do nó SQL, abra uma janela de console e navegue até o diretório onde você desempacotou os binários do NDB Cluster (se você estiver seguindo nosso exemplo, este é `C:\mysql\bin`).

   Inicie o nó SQL invocando **mysqld.exe** a partir da linha de comando, conforme mostrado aqui:

   ```sql
   C:\mysql\bin> mysqld --console
   ```

   A opção `--console` faz com que as informações de registro sejam escritas no console, o que pode ser útil em caso de problemas. (Depois de garantir que o nó SQL esteja funcionando de maneira satisfatória, você pode interromper e reiniciar sem a opção `--console`, para que o registro seja realizado normalmente.)

   Na janela do console onde o cliente de gerenciamento (**ndb_mgm.exe**) está rodando no host do nó de gerenciamento, insira o comando `SHOW`, que deve produzir uma saída semelhante à mostrada aqui:

   ```sql
   ndb_mgm> SHOW
   Connected to Management Server at: localhost:1186
   Cluster Configuration
   ---------------------
   [ndbd(NDB)]     2 node(s)
   id=2    @198.51.100.30  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0, *)
   id=3    @198.51.100.40  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0)

   [ndb_mgmd(MGM)] 1 node(s)
   id=1    @198.51.100.10  (Version: 5.7.44-ndb-7.6.36)

   [mysqld(API)]   1 node(s)
   id=4    @198.51.100.20  (Version: 5.7.44-ndb-7.6.36)
   ```

   Você também pode verificar se o nó SQL está conectado ao NDB Cluster no cliente **mysql** (**mysql.exe**) usando a instrução `SHOW ENGINE NDB STATUS`.

Agora você deve estar pronto para trabalhar com objetos de banco de dados e dados usando o mecanismo de armazenamento do NDB Cluster `NDBCLUSTER`. Consulte Seção 21.3.5, “Exemplo de NDB Cluster com Tabelas e Dados” para obter mais informações e exemplos.

Você também pode instalar **ndb_mgmd.exe**, **ndbd.exe** e **ndbmtd.exe** como serviços do Windows. Para obter informações sobre como fazer isso, consulte Seção 21.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”).
