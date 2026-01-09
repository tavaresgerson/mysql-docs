### 21.3.6 Desligamento e Reinício Seguro do NDB Cluster

Para desligar o clúster, insira o seguinte comando em uma janela de comandos na máquina que hospeda o nó de gerenciamento:

```sql
$> ndb_mgm -e shutdown
```

A opção `-e` é usada aqui para passar um comando ao cliente **ndb_mgm** a partir do shell. O comando faz com que os processos **ndb_mgm**, **ndb_mgmd** e quaisquer processos **ndbd** ou **ndbmtd** sejam encerrados de forma suave. Qualquer nó SQL pode ser encerrado usando **mysqladmin shutdown** e outros meios. Em plataformas Windows, assumindo que você instalou o nó SQL como um serviço do Windows, você pode usar **SC STOP *`service_name`*** ou **NET STOP *`service_name`***.

Para reiniciar o clúster em plataformas Unix, execute os seguintes comandos:

- No host de gerenciamento (`198.51.100.10` no nosso exemplo de configuração):

  ```sql
  $> ndb_mgmd -f /var/lib/mysql-cluster/config.ini
  ```

- Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`):

  ```sql
  $> ndbd
  ```

- Use o cliente **ndb_mgm** para verificar se ambos os nós de dados iniciaram com sucesso.

- No host SQL (`198.51.100.20`):

  ```sql
  $> mysqld_safe &
  ```

Nas plataformas Windows, assumindo que você instalou todos os processos do NDB Cluster como serviços do Windows usando os nomes de serviço padrão (consulte Seção 21.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”), você pode reiniciar o cluster da seguinte forma:

- No host de gerenciamento (`198.51.100.10` no nosso exemplo), execute o seguinte comando:

  ```sql
  C:\> SC START ndb_mgmd
  ```

- Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`), execute o seguinte comando:

  ```sql
  C:\> SC START ndbd
  ```

- No nó de gerenciamento, use o cliente **ndb_mgm** para verificar se o nó de gerenciamento e ambos os nós de dados iniciaram com sucesso (consulte Seção 21.3.2.3, “Início Inicial do NDB Cluster no Windows”).

- No host do nó SQL (`198.51.100.20`), execute o seguinte comando:

  ```sql
  C:\> SC START mysql
  ```

Em um ambiente de produção, geralmente não é desejável desligar completamente o clúster. Em muitos casos, mesmo ao fazer alterações na configuração ou ao realizar atualizações no hardware ou software do clúster (ou em ambos), que exigem o desligamento de máquinas hospedeiras individuais, é possível fazê-lo sem desligar o clúster como um todo, realizando um reinício contínuo do clúster. Para obter mais informações sobre como fazer isso, consulte Seção 21.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.
