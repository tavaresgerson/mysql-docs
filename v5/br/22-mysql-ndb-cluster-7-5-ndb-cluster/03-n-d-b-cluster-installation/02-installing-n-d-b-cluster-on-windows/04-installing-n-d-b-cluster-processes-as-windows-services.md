#### 21.3.2.4 Instalar os processos do NDB Cluster como serviços do Windows

Depois de garantir que o NDB Cluster esteja funcionando conforme o esperado, você pode instalar os nós de gerenciamento e os nós de dados como serviços do Windows, para que esses processos sejam iniciados e interrompidos automaticamente sempre que o Windows for iniciado ou desligado. Isso também permite controlar esses processos a partir da linha de comando com os comandos apropriados **SC START** e **SC STOP**, ou usando o utilitário de serviços gráficos do Windows **Services**. Os comandos **NET START** e **NET STOP** também podem ser usados.

A instalação de programas como serviços do Windows geralmente deve ser feita usando uma conta que tenha direitos de administrador no sistema.

Para instalar o nó de gerenciamento como um serviço no Windows, inicie o **ndb\_mgmd.exe** a partir da linha de comando na máquina que hospeda o nó de gerenciamento, usando a opção `--install`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --install
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndbd.exe" "--service=ndb_mgmd"'
Service successfully installed.
```

Importante

Ao instalar um programa de NDB Cluster como um serviço do Windows, você deve sempre especificar o caminho completo; caso contrário, a instalação do serviço pode falhar com o erro O sistema não encontrou o arquivo especificado.

A opção `--install` deve ser usada primeiro, antes de qualquer outra opção que possa ser especificada para **ndb\_mgmd.exe**. No entanto, é preferível especificar essas opções em um arquivo de opções em vez disso. Se o seu arquivo de opções não estiver em um dos locais padrão, conforme mostrado na saída de **ndb\_mgmd.exe** `--help`, você pode especificar a localização usando a opção `--config-file`.

Agora você deve ser capaz de iniciar e parar o servidor de gerenciamento da seguinte maneira:

```sql
C:\> SC START ndb_mgmd

C:\> SC STOP ndb_mgmd
```

Nota

Se você estiver usando comandos **NET**, também pode iniciar ou parar o servidor de gerenciamento como um serviço do Windows usando o nome descritivo, conforme mostrado aqui:

```sql
C:\> NET START 'NDB Cluster Management Server'
The NDB Cluster Management Server service is starting.
The NDB Cluster Management Server service was started successfully.

C:\> NET STOP  'NDB Cluster Management Server'
The NDB Cluster Management Server service is stopping..
The NDB Cluster Management Server service was stopped successfully.
```

Geralmente, é mais simples especificar um nome de serviço curto ou permitir que o nome de serviço padrão seja usado durante a instalação do serviço, e então referenciar esse nome ao iniciar ou parar o serviço. Para especificar um nome de serviço diferente de `ndb_mgmd`, adicione-o à opção `--install`, conforme mostrado neste exemplo:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --install=mgmd1
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndb_mgmd.exe" "--service=mgmd1"'
Service successfully installed.
```

Agora você deve ser capaz de iniciar ou parar o serviço usando o nome que você especificou, assim:

```sql
C:\> SC START mgmd1

C:\> SC STOP mgmd1
```

Para remover o serviço do nó de gerenciamento, use **SC DELETE *`service_name`***:

```sql
C:\> SC DELETE mgmd1
```

Alternativamente, invoque **ndb\_mgmd.exe** com a opção `--remove`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --remove
Removing service 'NDB Cluster Management Server'
Service successfully removed.
```

Se você instalou o serviço usando um nome de serviço diferente do padrão, passe o nome do serviço como o valor da opção `--remove` do comando **ndb\_mgmd.exe**, assim:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --remove=mgmd1
Removing service 'mgmd1'
Service successfully removed.
```

A instalação de um processo de nó de dados de um cluster NDB como um serviço do Windows pode ser feita de maneira semelhante, usando a opção `--install` para o **ndbd.exe** (ou **ndbmtd.exe**), conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --install
Installing service 'NDB Cluster Data Node Daemon' as '"C:\mysql\bin\ndbd.exe" "--service=ndbd"'
Service successfully installed.
```

Agora você pode iniciar ou parar o nó de dados conforme mostrado no exemplo a seguir:

```sql
C:\> SC START ndbd

C:\> SC STOP ndbd
```

Para remover o serviço do nó de dados, use **SC DELETE *`service_name`***:

```sql
C:\> SC DELETE ndbd
```

Alternativamente, invoque **ndbd.exe** com a opção `--remove`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --remove
Removing service 'NDB Cluster Data Node Daemon'
Service successfully removed.
```

Assim como **ndb\_mgmd.exe** (e **mysqld.exe**), ao instalar **ndbd.exe** como um serviço do Windows, você também pode especificar um nome para o serviço como o valor de `--install` e, em seguida, usá-lo ao iniciar ou parar o serviço, da seguinte forma:

```sql
C:\> C:\mysql\bin\ndbd.exe --install=dnode1
Installing service 'dnode1' as '"C:\mysql\bin\ndbd.exe" "--service=dnode1"'
Service successfully installed.

C:\> SC START dnode1

C:\> SC STOP dnode1
```

Se você especificou um nome de serviço ao instalar o serviço de nó de dados, você pode usar esse nome ao removê-lo também, como mostrado aqui:

```sql
C:\> SC DELETE dnode1
```

Alternativamente, você pode passar o nome do serviço como o valor da opção `ndbd.exe` `--remove` (mysql-cluster-programs-ndbd.html#option\_ndbd\_remove), conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --remove=dnode1
Removing service 'dnode1'
Service successfully removed.
```

A instalação do nó SQL como um serviço do Windows, o início do serviço, a parada do serviço e a remoção do serviço são feitos de maneira semelhante, usando **mysqld** `--install`, **SC START**, **SC STOP** e **SC DELETE** (ou **mysqld** `--remove`). Os comandos **NET** também podem ser usados para iniciar ou parar um serviço. Para obter informações adicionais, consulte Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.
