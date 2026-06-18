#### 2.3.4.5 Começando o servidor pela primeira vez

Esta seção oferece uma visão geral geral sobre como iniciar o servidor MySQL. As seções a seguir fornecem informações mais específicas para iniciar o servidor MySQL a partir da linha de comando ou como um serviço do Windows.

As informações aqui aplicam-se principalmente se você instalou o MySQL usando a versão `noinstall`, ou se deseja configurar e testar o MySQL manualmente, em vez das ferramentas de interface gráfica.

Os exemplos nessas seções assumem que o MySQL está instalado na localização padrão de `C:\Program Files\MySQL\MySQL Server 5.7`. Ajuste os nomes de caminho mostrados nos exemplos se o MySQL estiver instalado em um local diferente.

Os clientes têm duas opções. Eles podem usar TCP/IP ou podem usar um tubo nomeado, se o servidor suportar conexões por tubo nomeado.

O MySQL para Windows também suporta conexões de memória compartilhada se o servidor for iniciado com a variável de sistema `shared_memory` habilitada. Os clientes podem se conectar através da memória compartilhada usando a opção `--protocol=MEMORY`.

Para obter informações sobre qual binário do servidor deve ser executado, consulte a Seção 2.3.4.3, “Selecionando um tipo de servidor MySQL”.

Os testes são melhores realizados a partir de um prompt de comando em uma janela de console (ou "janela DOS"). Dessa forma, você pode ter o servidor exibindo mensagens de status na janela, onde elas são fáceis de ver. Se algo estiver errado com sua configuração, essas mensagens facilitam a identificação e a correção de quaisquer problemas.

::: info Nota
O banco de dados deve ser inicializado antes que o MySQL possa ser iniciado. Para obter informações adicionais sobre o processo de inicialização, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.
:::

Para iniciar o servidor, insira este comando:

```shell
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --console
```

Para um servidor que inclui suporte ao `InnoDB`, você deve ver mensagens semelhantes às seguintes quando ele for iniciado (os nomes de caminho e tamanhos podem variar):

```shell
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

Quando o servidor terminar sua sequência de inicialização, você deve ver algo como este, o que indica que o servidor está pronto para atender as conexões dos clientes:

```sql
mysqld: ready for connections
Version: '5.7.44'  socket: ''  port: 3306
```

O servidor continua a escrever na consola qualquer outra saída de diagnóstico que produzir. Pode abrir uma nova janela de consola para executar programas de cliente.

Se você omitir a opção `--console`, o servidor escreverá a saída de diagnóstico no log de erro no diretório de dados (`C:\Program Files\MySQL\MySQL Server 5.7\data` por padrão). O log de erro é o arquivo com a extensão `.err` e pode ser configurado usando a opção `--log-error`.

::: info Nota
A conta `root` inicial nas tabelas de concessão do MySQL não tem senha. Após iniciar o servidor, você deve configurá-la usando as instruções na Seção 2.9.4, "Segurança da Conta Inicial do MySQL".
:::
