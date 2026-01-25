### 21.3.6 Desligamento e Reinicialização Seguros do NDB Cluster

Para desligar o Cluster, insira o seguinte comando em um shell na máquina que hospeda o nó de gerenciamento (management node):

```sql
$> ndb_mgm -e shutdown
```

A opção `-e` é usada aqui para passar um comando para o cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") a partir do shell. O comando faz com que os processos [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") e quaisquer processos [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") sejam encerrados de forma segura (gracefully). Quaisquer SQL nodes podem ser encerrados usando [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e outros meios. Em plataformas Windows, assumindo que você instalou o SQL node como um Windows service, você pode usar **SC STOP *`nome_do_service`*** ou **NET STOP *`nome_do_service`***.

Para reiniciar o Cluster em plataformas Unix, execute estes comandos:

* No host de gerenciamento (management host) (`198.51.100.10` em nossa configuração de exemplo):

  ```sql
  $> ndb_mgmd -f /var/lib/mysql-cluster/config.ini
  ```

* Em cada um dos hosts dos data nodes (`198.51.100.30` e `198.51.100.40`):

  ```sql
  $> ndbd
  ```

* Use o cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") para verificar se ambos os data nodes foram iniciados com sucesso.

* No SQL host (`198.51.100.20`):

  ```sql
  $> mysqld_safe &
  ```

Em plataformas Windows, assumindo que você instalou todos os processos do NDB Cluster como Windows services usando os nomes de service padrão (veja [Section 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services")), você pode reiniciar o Cluster da seguinte forma:

* No host de gerenciamento (management host) (`198.51.100.10` em nossa configuração de exemplo), execute o seguinte comando:

  ```sql
  C:\> SC START ndb_mgmd
  ```

* Em cada um dos hosts dos data nodes (`198.51.100.30` e `198.51.100.40`), execute o seguinte comando:

  ```sql
  C:\> SC START ndbd
  ```

* No host do nó de gerenciamento, use o cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") para verificar se o nó de gerenciamento (management node) e ambos os data nodes foram iniciados com sucesso (veja [Section 21.3.2.3, “Initial Startup of NDB Cluster on Windows”](mysql-cluster-install-windows-initial-start.html "21.3.2.3 Initial Startup of NDB Cluster on Windows")).

* No host do SQL node (`198.51.100.20`), execute o seguinte comando:

  ```sql
  C:\> SC START mysql
  ```

Em um ambiente de produção (production setting), geralmente não é desejável desligar o Cluster completamente. Em muitos casos, mesmo ao fazer alterações de configuração ou realizar upgrades de hardware ou software (ou ambos) do Cluster, que exigem o desligamento de máquinas host individuais, é possível fazer isso sem desligar o Cluster como um todo, realizando um rolling restart do Cluster. Para mais informações sobre como fazer isso, veja [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster").