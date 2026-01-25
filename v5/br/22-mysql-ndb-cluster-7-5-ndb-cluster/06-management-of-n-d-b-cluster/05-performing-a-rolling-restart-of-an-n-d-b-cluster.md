### 21.6.5 Realizando um Rolling Restart em um NDB Cluster

Esta seção discute como realizar um *rolling restart* de uma instalação do NDB Cluster, chamado assim porque envolve parar e iniciar (ou reiniciar) cada *node* em sequência, para que o *Cluster* em si permaneça operacional. Isso é frequentemente feito como parte de um *rolling upgrade* ou *rolling downgrade*, onde a *high availability* do *Cluster* é obrigatória e nenhuma interrupção (*downtime*) do *Cluster* como um todo é permissível. Onde nos referimos a *upgrades*, as informações fornecidas aqui também se aplicam geralmente a *downgrades*.

Existem várias razões pelas quais um *rolling restart* pode ser desejável. Elas são descritas nos próximos parágrafos.

**Mudança de Configuração (*Configuration change*).** Para fazer uma mudança na *configuration* do *Cluster*, como adicionar um *SQL node* ao *Cluster*, ou definir um parâmetro de *configuration* para um novo valor.

**Upgrade ou Downgrade do Software NDB Cluster.** Para fazer o *upgrade* do *Cluster* para uma versão mais recente do software NDB Cluster (ou para fazer o *downgrade* para uma versão mais antiga). Isso é geralmente referido como um “rolling upgrade” (ou “rolling downgrade”, ao reverter para uma versão anterior do NDB Cluster).

**Mudança no Host do Node.** Para fazer alterações no *hardware* ou sistema operacional no qual um ou mais processos de *node* do NDB Cluster estão sendo executados.

**Reset de Sistema (Cluster Reset).** Para resetar o *Cluster* porque ele atingiu um estado indesejável. Nesses casos, muitas vezes é desejável recarregar os *data* e *metadata* de um ou mais *data nodes*. Isso pode ser feito de três maneiras:

*   Iniciar cada processo de *data node* ([**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou possivelmente [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")) com a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial), o que força o *data node* a limpar seu sistema de arquivos e recarregar todos os *data* e *metadata* do NDB Cluster dos outros *data nodes*.

*   Criar um *backup* usando o comando [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") do cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") antes de realizar o *restart*. Após o *upgrade*, restaurar o *node* ou *nodes* usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

    Veja [Section 21.6.8, “Online Backup of NDB Cluster”](mysql-cluster-backup.html "21.6.8 Online Backup of NDB Cluster"), e [Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), para mais informações.

*   Usar [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") para criar um *backup* antes do *upgrade*; posteriormente, restaurar o *dump* usando [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

**Recuperação de Recursos (*Resource Recovery*).** Para liberar a memória previamente alocada a uma *table* por sucessivas operações [`INSERT`](insert.html "13.2.5 INSERT Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement"), para reutilização por outras *tables* do NDB Cluster.

O processo para realizar um *rolling restart* pode ser generalizado da seguinte forma:

1.  Parar todos os *management nodes* do *Cluster* (processos [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")), reconfigurá-los e, em seguida, reiniciá-los. (Veja [Rolling restarts with multiple management servers](mysql-cluster-rolling-restart.html#mysql-cluster-rolling-restart-multiple-ndb-mgmd "Rolling restarts with multiple management servers").)

2.  Parar, reconfigurar e, em seguida, reiniciar cada *data node* do *Cluster* (processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon")) em sequência.

    Alguns parâmetros de *configuration* do *node* podem ser atualizados emitindo [`RESTART`](mysql-cluster-mgm-client-commands.html#ndbclient-restart) para cada um dos *data nodes* no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") após a etapa anterior. Outros parâmetros exigem que o *data node* seja parado completamente usando o comando [`STOP`](mysql-cluster-mgm-client-commands.html#ndbclient-stop) do cliente de gerenciamento, e depois iniciado novamente a partir de um *shell* do sistema, invocando o executável [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") conforme apropriado. (Um comando de *shell* como [**kill**](kill.html "13.7.6.4 KILL Statement") também pode ser usado na maioria dos sistemas Unix para parar um processo de *data node*, mas o comando `STOP` é preferível e geralmente mais simples.)

    Note

    No Windows, você também pode usar os comandos **SC STOP** e **SC START**, os comandos `NET STOP` e `NET START`, ou o Windows Service Manager para parar e iniciar *nodes* que foram instalados como *Windows services* (veja [Section 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services")).

    O tipo de *restart* necessário é indicado na documentação para cada parâmetro de *configuration* do *node*. Veja [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files").

3.  Parar, reconfigurar e, em seguida, reiniciar cada *SQL node* do *Cluster* (processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")) em sequência.

O NDB Cluster suporta uma ordem um tanto flexível para o *upgrade* dos *nodes*. Ao fazer o *upgrade* de um NDB Cluster, você pode atualizar os *API nodes* (incluindo *SQL nodes*) antes de atualizar os *management nodes*, *data nodes* ou ambos. Em outras palavras, é permitido atualizar os *API nodes* e *SQL nodes* em qualquer ordem. Isso está sujeito às seguintes cláusulas:

*   Esta funcionalidade destina-se a ser usada apenas como parte de um *online upgrade*. Uma mistura de binários de *node* de diferentes versões do NDB Cluster não é pretendida nem suportada para uso contínuo e de longo prazo em um ambiente de produção.

*   Você deve atualizar todos os *nodes* do mesmo tipo (*management*, *data* ou *API node*) antes de atualizar qualquer *node* de um tipo diferente. Isso permanece verdadeiro, independentemente da ordem em que os *nodes* são atualizados.

*   Você deve atualizar todos os *management nodes* antes de atualizar quaisquer *data nodes*. Isso permanece verdadeiro, independentemente da ordem em que você atualiza os *API nodes* e *SQL nodes* do *Cluster*.

*   Funcionalidades específicas da versão “nova” não devem ser usadas até que todos os *management nodes* e *data nodes* tenham sido atualizados.

    Isso também se aplica a qualquer mudança de versão do MySQL Server que possa ser relevante, além da mudança de versão do *NDB engine*, então não se esqueça de levar isso em consideração ao planejar o *upgrade*. (Isso é verdadeiro para *online upgrades* do NDB Cluster em geral.)

Não é possível para nenhum *API node* realizar operações de *schema* (como *data definition statements*) durante um *node restart*. Devido, em parte, a esta limitação, as operações de *schema* também não são suportadas durante um *online upgrade* ou *downgrade*. Além disso, não é possível realizar *backups* nativos enquanto um *upgrade* ou *downgrade* estiver em andamento.

**Rolling restarts com múltiplos Management Servers.**

Ao realizar um *rolling restart* de um NDB Cluster com múltiplos *management nodes*, você deve ter em mente que [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") verifica se algum outro *management node* está em execução e, se estiver, tenta usar os dados de *configuration* desse *node*. Para evitar que isso ocorra, e para forçar o [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") a reler seu arquivo de *configuration*, execute as seguintes etapas:

1.  Parar todos os processos [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") do NDB Cluster.
2.  Atualizar todos os arquivos `config.ini`.
3.  Iniciar um único [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") com [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload), [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial), ou ambas as opções, conforme desejado.

4.  Se você iniciou o primeiro [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") com a opção [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial), você também deve iniciar todos os processos [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") restantes usando `--initial`.

    Independentemente de quaisquer outras opções usadas ao iniciar o primeiro [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), você não deve iniciar nenhum processo [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") restante após o primeiro usando [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload).

5.  Concluir os *rolling restarts* dos *data nodes* e *API nodes* normalmente.

Ao realizar um *rolling restart* para atualizar a *configuration* do *Cluster*, você pode usar a coluna `config_generation` da *table* [`ndbinfo.nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table") para monitorar quais *data nodes* foram reiniciados com sucesso com a nova *configuration*. Veja [Section 21.6.15.28, “The ndbinfo nodes Table”](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table").
