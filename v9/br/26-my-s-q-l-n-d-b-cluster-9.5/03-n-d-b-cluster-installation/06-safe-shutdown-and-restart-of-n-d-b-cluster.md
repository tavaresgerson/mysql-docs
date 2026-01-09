### 25.3.6 Sair e Reiniciar com Segurança o NDB Cluster

Para desligar o cluster, insira o seguinte comando em uma janela de shell na máquina que hospeda o nó de gerenciamento:

```
$> ndb_mgm -e shutdown
```

A opção `-e` é usada para passar um comando ao cliente **ndb_mgm** a partir da shell. O comando faz com que o **ndb_mgm**, **ndb_mgmd** e quaisquer processos **ndbd** ou **ndbmtd**) sejam encerrados de forma suave. Qualquer nó SQL pode ser encerrado usando **mysqladmin shutdown** e outros meios. Em plataformas Windows, assumindo que você instalou o nó SQL como um serviço do Windows, você pode usar **SC STOP *`service_name`*** ou **NET STOP *`service_name`***.

Para reiniciar o cluster em plataformas Unix, execute esses comandos:

* No host de gerenciamento (`198.51.100.10` em nossa configuração de exemplo):

  ```
  $> ndb_mgmd -f /var/lib/mysql-cluster/config.ini
  ```

* Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`):

  ```
  $> ndbd
  ```

* Use o cliente **ndb_mgm** para verificar se ambos os nós de dados iniciaram com sucesso.

* No host SQL (`198.51.100.20`):

  ```
  $> mysqld_safe &
  ```

Em plataformas Windows, assumindo que você instalou todos os processos do NDB Cluster como serviços do Windows usando os nomes de serviço padrão (veja a Seção 25.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”), você pode reiniciar o cluster da seguinte forma:

* No host de gerenciamento (`198.51.100.10` em nossa configuração de exemplo), execute o seguinte comando:

  ```
  C:\> SC START ndb_mgmd
  ```

* Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`), execute o seguinte comando:

  ```
  C:\> SC START ndbd
  ```

* No host do nó de gerenciamento, use o cliente **ndb_mgm** para verificar se o nó de gerenciamento e ambos os nós de dados iniciaram com sucesso (veja a Seção 25.3.2.3, “Início Inicial do NDB Cluster no Windows”).

* No host do nó SQL (`198.51.100.20`), execute o seguinte comando:

  ```
  C:\> SC START mysql
  ```

Em um ambiente de produção, geralmente não é desejável desligar completamente o clúster. Em muitos casos, mesmo ao fazer alterações na configuração ou ao realizar atualizações no hardware ou software do clúster (ou em ambos), que exigem o desligamento de máquinas individuais, é possível fazê-lo sem desligar o clúster como um todo, realizando um reinício contínuo do clúster. Para obter mais informações sobre como fazer isso, consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.