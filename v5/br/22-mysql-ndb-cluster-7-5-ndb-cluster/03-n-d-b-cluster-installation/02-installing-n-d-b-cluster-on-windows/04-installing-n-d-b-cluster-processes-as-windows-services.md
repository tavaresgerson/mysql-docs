#### 21.3.2.4 Instalando Processos NDB Cluster como Windows Services

Assim que você estiver satisfeito que o NDB Cluster está rodando conforme o desejado, você pode instalar os management nodes e data nodes como Windows Services, para que esses processos sejam iniciados e parados automaticamente sempre que o Windows for iniciado ou parado. Isso também torna possível controlar esses processos a partir da Command Line com os comandos **SC START** e **SC STOP** apropriados, ou usando o utilitário gráfico do Windows **Services**. Os comandos **NET START** e **NET STOP** também podem ser usados.

A instalação de programas como Windows Services geralmente deve ser feita usando uma conta que tenha direitos de Administrator no sistema.

Para instalar o management node como um Service no Windows, invoque [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") a partir da Command Line na máquina que hospeda o management node, usando a opção [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install), conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --install
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndbd.exe" "--service=ndb_mgmd"'
Service successfully installed.
```

Importante

Ao instalar um programa NDB Cluster como um Windows Service, você deve sempre especificar o caminho completo; caso contrário, a instalação do Service pode falhar com o erro The system cannot find the file specified.

A opção [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install) deve ser usada primeiro, antes de quaisquer outras opções que possam ser especificadas para [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). No entanto, é preferível especificar tais opções em um options file. Se o seu options file não estiver em um dos locais padrão, conforme mostrado na saída de [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") [`--help`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help), você pode especificar o local usando a opção [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file).

Agora você deve ser capaz de iniciar e parar o management server desta forma:

```sql
C:\> SC START ndb_mgmd

C:\> SC STOP ndb_mgmd
```

Nota

Se estiver usando comandos **NET**, você também pode iniciar ou parar o management server como um Windows Service usando o nome descritivo, conforme mostrado aqui:

```sql
C:\> NET START 'NDB Cluster Management Server'
The NDB Cluster Management Server service is starting.
The NDB Cluster Management Server service was started successfully.

C:\> NET STOP  'NDB Cluster Management Server'
The NDB Cluster Management Server service is stopping..
The NDB Cluster Management Server service was stopped successfully.
```

Geralmente, é mais simples especificar um nome de Service curto ou permitir que o nome de Service padrão seja usado ao instalar o Service, e então fazer referência a esse nome ao iniciar ou parar o Service. Para especificar um nome de Service diferente de `ndb_mgmd`, anexe-o à opção [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install), conforme mostrado neste exemplo:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --install=mgmd1
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndb_mgmd.exe" "--service=mgmd1"'
Service successfully installed.
```

Agora você deve ser capaz de iniciar ou parar o Service usando o nome que você especificou, desta forma:

```sql
C:\> SC START mgmd1

C:\> SC STOP mgmd1
```

Para remover o management node service, use **SC DELETE *`service_name`***:

```sql
C:\> SC DELETE mgmd1
```

Alternativamente, invoque [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") com a opção [`--remove`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_remove), conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --remove
Removing service 'NDB Cluster Management Server'
Service successfully removed.
```

Se você instalou o Service usando um nome de Service diferente do padrão, passe o nome do Service como valor da opção [`--remove`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_remove) de [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), desta forma:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --remove=mgmd1
Removing service 'mgmd1'
Service successfully removed.
```

A instalação de um processo data node do NDB Cluster como um Windows Service pode ser feita de maneira semelhante, usando a opção [`--install`](mysql-cluster-programs-ndbd.html#option_ndbd_install) para [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") (ou [**ndbmtd.exe**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")), conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --install
Installing service 'NDB Cluster Data Node Daemon' as '"C:\mysql\bin\ndbd.exe" "--service=ndbd"'
Service successfully installed.
```

Agora você pode iniciar ou parar o data node conforme mostrado no exemplo a seguir:

```sql
C:\> SC START ndbd

C:\> SC STOP ndbd
```

Para remover o data node service, use **SC DELETE *`service_name`***:

```sql
C:\> SC DELETE ndbd
```

Alternativamente, invoque [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") com a opção [`--remove`](mysql-cluster-programs-ndbd.html#option_ndbd_remove), conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --remove
Removing service 'NDB Cluster Data Node Daemon'
Service successfully removed.
```

Assim como com [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") (e [**mysqld.exe**](mysqld.html "4.3.1 mysqld — The MySQL Server")), ao instalar [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") como um Windows Service, você também pode especificar um nome para o Service como valor de [`--install`](mysql-cluster-programs-ndbd.html#option_ndbd_install) e então usá-lo ao iniciar ou parar o Service, desta forma:

```sql
C:\> C:\mysql\bin\ndbd.exe --install=dnode1
Installing service 'dnode1' as '"C:\mysql\bin\ndbd.exe" "--service=dnode1"'
Service successfully installed.

C:\> SC START dnode1

C:\> SC STOP dnode1
```

Se você especificou um nome de Service ao instalar o data node service, você também pode usar esse nome ao removê-lo, conforme mostrado aqui:

```sql
C:\> SC DELETE dnode1
```

Alternativamente, você pode passar o nome do Service como valor da opção [`--remove`](mysql-cluster-programs-ndbd.html#option_ndbd_remove) de `ndbd.exe`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --remove=dnode1
Removing service 'dnode1'
Service successfully removed.
```

A instalação do SQL node como um Windows Service, iniciar o Service, parar o Service e remover o Service são feitos de maneira semelhante, usando [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") `--install`, **SC START**, **SC STOP** e **SC DELETE** (ou [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") [`--remove`](server-options.html#option_mysqld_remove)). Comandos **NET** também podem ser usados para iniciar ou parar um Service. Para informações adicionais, consulte [Section 2.3.4.8, “Starting MySQL as a Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").