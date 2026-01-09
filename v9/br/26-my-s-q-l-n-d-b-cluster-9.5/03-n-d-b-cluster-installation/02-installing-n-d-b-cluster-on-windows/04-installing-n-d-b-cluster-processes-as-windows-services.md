#### 25.3.2.4 Instalando os processos do NDB Cluster como serviços do Windows

Depois de garantir que o NDB Cluster esteja funcionando conforme o esperado, você pode instalar os nós de gerenciamento e os nós de dados como serviços do Windows, para que esses processos sejam iniciados e interrompidos automaticamente sempre que o Windows for iniciado ou desligado. Isso também permite controlar esses processos a partir da linha de comando com os comandos apropriados **SC START** e **SC STOP**, ou usando o utilitário de **Serviços** gráfico do Windows. Os comandos **NET START** e **NET STOP** também podem ser usados.

Instalar programas como serviços do Windows geralmente deve ser feito usando uma conta que tenha direitos de administrador no sistema.

Para instalar o nó de gerenciamento como um serviço no Windows, inicie o **ndb_mgmd.exe** a partir da linha de comando na máquina que hospeda o nó de gerenciamento, usando a opção `--install`, conforme mostrado aqui:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --install
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndbd.exe" "--service=ndb_mgmd"'
Service successfully installed.
```

Importante

Ao instalar um programa do NDB Cluster como um serviço do Windows, você deve sempre especificar o caminho completo; caso contrário, a instalação do serviço pode falhar com o erro O sistema não encontrou o arquivo especificado.

A opção `--install` deve ser usada primeiro, antes de qualquer outra opção que possa ser especificada para o **ndb_mgmd.exe**. No entanto, é preferível especificar essas opções em um arquivo de opções em vez disso. Se o seu arquivo de opções não estiver em um dos locais padrão conforme mostrado na saída do **ndb_mgmd.exe** `--help`, você pode especificar o local usando a opção `--config-file`.

Agora você deve ser capaz de iniciar e interromper o servidor de gerenciamento da seguinte maneira:

```
C:\> SC START ndb_mgmd

C:\> SC STOP ndb_mgmd
```

Observação

Se estiver usando comandos **NET**, você também pode iniciar ou interromper o servidor de gerenciamento como um serviço do Windows usando o nome descritivo, conforme mostrado aqui:

```
C:\> NET START 'NDB Cluster Management Server'
The NDB Cluster Management Server service is starting.
The NDB Cluster Management Server service was started successfully.

C:\> NET STOP  'NDB Cluster Management Server'
The NDB Cluster Management Server service is stopping..
The NDB Cluster Management Server service was stopped successfully.
```

Geralmente é mais simples especificar um nome de serviço curto ou permitir que o nome de serviço padrão seja usado ao instalar o serviço, e então referenciar esse nome ao iniciar ou parar o serviço. Para especificar um nome de serviço diferente de `ndb_mgmd`, adicione-o à opção `--install`, como mostrado neste exemplo:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --install=mgmd1
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndb_mgmd.exe" "--service=mgmd1"'
Service successfully installed.
```

Agora você deve ser capaz de iniciar ou parar o serviço usando o nome que você especificou, assim:

```
C:\> SC START mgmd1

C:\> SC STOP mgmd1
```

Para remover o serviço do nó de gerenciamento, use **SC DELETE *`service_name`***:

```
C:\> SC DELETE mgmd1
```

Alternativamente, invoque **ndb_mgmd.exe** com a opção `--remove`, como mostrado aqui:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --remove
Removing service 'NDB Cluster Management Server'
Service successfully removed.
```

Se você instalou o serviço usando um nome de serviço diferente do padrão, passe o nome do serviço como o valor da opção `--remove` do **ndb_mgmd.exe**, como mostrado aqui:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --remove=mgmd1
Removing service 'mgmd1'
Service successfully removed.
```

A instalação de um processo de nó de dados do NDB Cluster como um serviço do Windows pode ser feita de maneira semelhante, usando a opção `--install` para **ndbd.exe** (ou **ndbmtd.exe")), como mostrado aqui:

```
C:\> C:\mysql\bin\ndbd.exe --install
Installing service 'NDB Cluster Data Node Daemon' as '"C:\mysql\bin\ndbd.exe" "--service=ndbd"'
Service successfully installed.
```

Agora você pode iniciar ou parar o nó de dados como mostrado no exemplo seguinte:

```
C:\> SC START ndbd

C:\> SC STOP ndbd
```

Para remover o serviço do nó de dados, use **SC DELETE *`service_name`***:

```
C:\> SC DELETE ndbd
```

Alternativamente, invoque **ndbd.exe** com a opção `--remove`, como mostrado aqui:

```
C:\> C:\mysql\bin\ndbd.exe --remove
Removing service 'NDB Cluster Data Node Daemon'
Service successfully removed.
```

Assim como **ndb_mgmd.exe** (e **mysqld.exe**), ao instalar **ndbd.exe** como um serviço do Windows, você também pode especificar um nome para o serviço como o valor de `--install`, e então usá-lo ao iniciar ou parar o serviço, como mostrado aqui:

```
C:\> C:\mysql\bin\ndbd.exe --install=dnode1
Installing service 'dnode1' as '"C:\mysql\bin\ndbd.exe" "--service=dnode1"'
Service successfully installed.

C:\> SC START dnode1

C:\> SC STOP dnode1
```

Se você especificou um nome de serviço ao instalar o serviço do nó de dados, você pode usar esse nome ao removê-lo também, como mostrado aqui:

```
C:\> SC DELETE dnode1
```wuYQ3YIdSY```

A instalação do nó SQL como um serviço do Windows, o início do serviço, a parada do serviço e a remoção do serviço são feitas de maneira semelhante, usando **mysqld** `--install`, **SC START**, **SC STOP** e **SC DELETE** (ou **mysqld** `--remove`). Os comandos **NET** também podem ser usados para iniciar ou parar um serviço. Para obter informações adicionais, consulte a Seção 2.3.3.8, “Iniciando o MySQL como um serviço do Windows”.