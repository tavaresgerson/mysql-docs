#### 2.3.4.5 Iniciando o Server pela Primeira Vez

Esta seção fornece uma visão geral sobre como iniciar o MySQL Server. As seções seguintes oferecem informações mais específicas para iniciar o MySQL Server a partir da linha de comando ou como um serviço Windows.

As informações aqui se aplicam principalmente se você instalou o MySQL usando a versão `noinstall`, ou se você deseja configurar e testar o MySQL manualmente em vez de usar as ferramentas GUI.

Os exemplos nestas seções assumem que o MySQL está instalado no local padrão `C:\Program Files\MySQL\MySQL Server 5.7`. Ajuste os nomes de caminho mostrados nos exemplos caso você tenha instalado o MySQL em um local diferente.

Os Clients têm duas opções. Eles podem usar TCP/IP, ou podem usar um *named pipe* (canal nomeado) se o Server suportar conexões por *named pipe*.

O MySQL para Windows também suporta conexões de *shared-memory* (memória compartilhada) se o Server for iniciado com a variável de sistema `shared_memory` habilitada. Os Clients podem se conectar através de *shared memory* usando a opção `--protocol=MEMORY`.

Para obter informações sobre qual binário do Server executar, consulte a Seção 2.3.4.3, “Selecionando um Tipo de MySQL Server”.

O teste é melhor executado a partir de um *command prompt* em uma janela *console* (ou “janela DOS”). Dessa forma, você pode fazer com que o Server exiba mensagens de status na janela onde são fáceis de visualizar. Se algo estiver errado com sua configuração, essas mensagens facilitam a identificação e a correção de quaisquer problemas.

Note

O Database deve ser inicializado antes que o MySQL possa ser iniciado. Para obter informações adicionais sobre o processo de inicialização, consulte a Seção 2.9.1, “Inicializando o Data Directory”.

Para iniciar o Server, digite este comando:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --console
```

Para um Server que inclui suporte a `InnoDB`, você deve ver mensagens semelhantes às seguintes durante a inicialização (os nomes de caminho e tamanhos podem diferir):

```sql
InnoDB: The first specified datafile c:\ibdata\ibdata1 did not exist:
InnoDB: a new database to be created!
InnoDB: Setting file c:\ibdata\ibdata1 size to 209715200
InnoDB: Database physically writes the file full: wait...
InnoDB: Log file c:\iblogs\ib_logfile0 did not exist: new to be created
InnoDB: Setting log file c:\iblogs\ib_logfile0 size to 31457280
InnoDB: Log file c:\iblogs\ib_logfile1 did not exist: new to be created
InnoDB: Setting log file c:\iblogs\ib_logfile1 size to 31457280
InnoDB: Log file c:\iblogs\ib_logfile2 did not exist: new to be created
InnoDB: Setting log file c:\iblogs\ib_logfile2 size to 31457280
InnoDB: Doublewrite buffer not found: creating new
InnoDB: Doublewrite buffer created
InnoDB: creating foreign key constraint system tables
InnoDB: foreign key constraint system tables created
011024 10:58:25  InnoDB: Started
```

Quando o Server concluir sua sequência de inicialização (*startup sequence*), você deve ver algo assim, o que indica que o Server está pronto para atender conexões de Clients:

```sql
mysqld: ready for connections
Version: '5.7.44'  socket: ''  port: 3306
```

O Server continua a escrever no *console* qualquer outra saída de diagnóstico que produza. Você pode abrir uma nova janela *console* na qual executar programas *client*.

Se você omitir a opção `--console`, o Server escreve a saída de diagnóstico no *error log* (log de erro) no *data directory* (`C:\Program Files\MySQL\MySQL Server 5.7\data` por padrão). O *error log* é o arquivo com a extensão `.err` e pode ser definido usando a opção `--log-error`.

Note

A conta `root` inicial nas *grant tables* do MySQL não tem senha. Após iniciar o Server, você deve configurar uma senha para ela usando as instruções na Seção 2.9.4, “Protegendo a Conta Inicial do MySQL”.