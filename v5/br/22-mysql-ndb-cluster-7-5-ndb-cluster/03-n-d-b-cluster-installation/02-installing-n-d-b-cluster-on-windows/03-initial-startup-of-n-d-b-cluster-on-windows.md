#### 21.3.2.3 Inicialização Inicial do NDB Cluster no Windows

Depois que os executáveis do NDB Cluster e os arquivos de configuração necessários estiverem no lugar, realizar uma inicialização inicial do Cluster é simplesmente uma questão de iniciar os executáveis do NDB Cluster para todos os Nodes no Cluster. Cada processo de Node do Cluster deve ser iniciado separadamente e no computador host onde reside. O Management Node deve ser iniciado primeiro, seguido pelos Data Nodes e, finalmente, por quaisquer SQL Nodes.

1. No host do Management Node, execute o seguinte comando na linha de comando para iniciar o processo do Management Node. A saída deve ser semelhante ao que é mostrado aqui:

   ```sql
   C:\mysql\bin> ndb_mgmd
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- NDB Cluster Management Server. mysql-5.7.44-ndb-7.6.36
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- Reading cluster configuration from 'config.ini'
   ```

   O processo do Management Node continua a imprimir a saída de log no console. Isso é normal, pois o Management Node não está sendo executado como um Windows Service. (Se você usou o NDB Cluster em uma plataforma tipo Unix, como Linux, você pode notar que o comportamento padrão do Management Node neste aspecto no Windows é efetivamente o oposto de seu comportamento em sistemas Unix, onde ele é executado por padrão como um processo Unix Daemon. Este comportamento também é verdadeiro para os processos de Data Node do NDB Cluster rodando no Windows.) Por esta razão, não feche a janela na qual [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") está sendo executado; fazer isso encerrará o processo do Management Node. (Consulte [Seção 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services"), onde mostramos como instalar e executar processos NDB Cluster como Windows Services.)

   A opção `-f` obrigatória informa ao Management Node onde encontrar o arquivo de configuração global (`config.ini`). A forma longa desta opção é [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file).

   Importante

   Um Management Node do NDB Cluster armazena em cache os dados de configuração que lê de `config.ini`; depois de criar um cache de configuração, ele ignora o arquivo `config.ini` nas inicializações subsequentes, a menos que seja forçado a fazer o contrário. Isso significa que, se o Management Node falhar ao iniciar devido a um erro neste arquivo, você deve fazer com que o Management Node releia `config.ini` depois de corrigir quaisquer erros nele. Você pode fazer isso iniciando [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") com a opção [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) ou [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) na linha de comando. Qualquer uma dessas opções funciona para atualizar o cache de configuração.

   Não é necessário nem aconselhável usar nenhuma dessas opções no arquivo `my.ini` do Management Node.

2. Em cada um dos hosts de Data Node, execute o comando mostrado aqui para iniciar os processos de Data Node:

   ```sql
   C:\mysql\bin> ndbd
   2010-06-23 07:53:46 [ndbd] INFO -- Configuration fetched from 'localhost:1186', generation: 1
   ```

   Em cada caso, a primeira linha de saída do processo do Data Node deve se assemelhar ao que é mostrado no exemplo anterior e é seguida por linhas adicionais de saída de log. Assim como no processo do Management Node, isso é normal, pois o Data Node não está sendo executado como um Windows Service. Por esta razão, não feche a janela do console na qual o processo do Data Node está sendo executado; fazer isso encerra [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"). (Para mais informações, consulte [Seção 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services").)

3. Não inicie o SQL Node ainda; ele não pode se conectar ao Cluster até que os Data Nodes tenham terminado de iniciar, o que pode levar algum tempo. Em vez disso, em uma nova janela de console no host do Management Node, inicie o Management Client do NDB Cluster [**ndb_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), que deve estar em `C:\mysql\bin` no host do Management Node. (Não tente reutilizar a janela do console onde [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") está sendo executado digitando **CTRL**+**C**, pois isso encerraria o Management Node.) A saída resultante deve ser parecida com esta:

   ```sql
   C:\mysql\bin> ndb_mgm
   -- NDB Cluster -- Management Client --
   ndb_mgm>
   ```

   Quando o prompt `ndb_mgm>` aparecer, isso indica que o Management Client está pronto para receber comandos de gerenciamento do NDB Cluster. Você pode observar o Status dos Data Nodes à medida que eles iniciam digitando [`ALL STATUS`](mysql-cluster-mgm-client-commands.html#ndbclient-status) no prompt do Management Client. Este comando gera um relatório contínuo da sequência de inicialização dos Data Nodes, que deve ser semelhante a isto:

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

   Comandos emitidos no Management Client não diferenciam maiúsculas de minúsculas (case-sensitive); usamos letras maiúsculas como a forma canônica desses comandos, mas você não é obrigado a observar esta convenção ao inseri-los no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"). Para mais informações, consulte [Seção 21.6.1, “Commands in the NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "21.6.1 Commands in the NDB Cluster Management Client").

   A saída produzida por [`ALL STATUS`](mysql-cluster-mgm-client-commands.html#ndbclient-status) provavelmente variará do que é mostrado aqui, de acordo com a velocidade com que os Data Nodes conseguem iniciar, o número da versão do software NDB Cluster que você está usando e outros fatores. O que é significativo é que, quando você vir que ambos os Data Nodes foram iniciados, estará pronto para iniciar o SQL Node.

   Você pode deixar [**ndb_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") em execução; isso não tem impacto negativo no desempenho do NDB Cluster, e o usaremos na próxima etapa para verificar se o SQL Node está conectado ao Cluster depois que você o iniciar.

4. No computador designado como host do SQL Node, abra uma janela do console e navegue até o diretório onde você descompactou os binários do NDB Cluster (se você estiver seguindo nosso exemplo, este é `C:\mysql\bin`).

   Inicie o SQL Node invocando [**mysqld.exe**](mysqld.html "4.3.1 mysqld — The MySQL Server") a partir da linha de comando, conforme mostrado aqui:

   ```sql
   C:\mysql\bin> mysqld --console
   ```

   A opção [`--console`](server-options.html#option_mysqld_console) faz com que as informações de log sejam gravadas no console, o que pode ser útil em caso de problemas. (Assim que estiver satisfeito que o SQL Node está sendo executado de maneira satisfatória, você pode pará-lo e reiniciá-lo sem a opção [`--console`](server-options.html#option_mysqld_console), para que o log seja realizado normalmente.)

   Na janela do console onde o Management Client ([**ndb_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")) está sendo executado no host do Management Node, insira o comando [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show), que deve produzir uma saída semelhante à mostrada aqui:

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

   Você também pode verificar se o SQL Node está conectado ao NDB Cluster no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") ([**mysql.exe**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")) usando a instrução [`SHOW ENGINE NDB STATUS`](show-engine.html#show-engine-ndb-status "SHOW ENGINE NDB STATUS").

Agora você deve estar pronto para trabalhar com objetos e dados de Database usando o Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") do NDB Cluster. Consulte [Seção 21.3.5, “NDB Cluster Example with Tables and Data”](mysql-cluster-install-example-data.html "21.3.5 NDB Cluster Example with Tables and Data"), para obter mais informações e exemplos.

Você também pode instalar [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") e [**ndbmtd.exe**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") como Windows Services. Para obter informações sobre como fazer isso, consulte [Seção 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services")).