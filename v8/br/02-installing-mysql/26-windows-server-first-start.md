#### 2.3.3.5 Iniciar o servidor pela primeira vez

Esta seção fornece uma visão geral de como iniciar o servidor MySQL. As seções seguintes fornecem informações mais específicas para iniciar o servidor MySQL a partir da linha de comando ou como um serviço do Windows.

As informações aqui se aplicam principalmente se você instalou o MySQL usando a versão `noinstall`, ou se você deseja configurar e testar o MySQL manualmente em vez de usar o MySQL Configurator.

Os exemplos nestas seções assumem que o MySQL está instalado sob a localização padrão de `C:\Program Files\MySQL\MySQL Server 8.4`. Ajuste os nomes de caminho mostrados nos exemplos se você tiver o MySQL instalado em um local diferente.

Os clientes têm duas opções. Eles podem usar TCP/IP, ou podem usar um tubo nomeado se o servidor suportar conexões de tubo nomeado.

O MySQL para Windows também suporta conexões de memória compartilhada se o servidor for iniciado com a variável de sistema `shared_memory` ativada. Os clientes podem se conectar através de memória compartilhada usando a opção `--protocol=MEMORY`.

Para obter informações sobre qual servidor binário executar, consulte a Seção 2.3.3.3, "Seleção de um tipo de servidor MySQL".

O teste é melhor feito a partir de um prompt de comando em uma janela de console (ou Windows DOS). desta forma, você pode ter o servidor exibir mensagens de status na janela onde eles são fáceis de ver.

::: info Note

Para obter informações adicionais sobre o processo de inicialização, consulte a Seção 2.9.1, "Initializando o Diretório de Dados".

:::

Para iniciar o servidor, digite este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld" --console
```

Você deve ver mensagens semelhantes às seguintes quando ele começa (os nomes de caminho e tamanhos podem ser diferentes). As mensagens `ready for connections` indicam que o servidor está pronto para atender conexões de cliente.

```
[Server] C:\mysql\bin\mysqld.exe (mysqld 8.0.30) starting as process 21236
[InnoDB] InnoDB initialization has started.
[InnoDB] InnoDB initialization has ended.
[Server] CA certificate ca.pem is self signed.
[Server] Channel mysql_main configured to support TLS.
Encrypted connections are now supported for this channel.
[Server] X Plugin ready for connections. Bind-address: '::' port: 33060
[Server] C:\mysql\bin\mysqld.exe: ready for connections.
Version: '8.0.30'  socket: ''  port: 3306  MySQL Community Server - GPL.
```

Agora você pode abrir uma nova janela de console na qual executar programas de cliente.

Se você omitir a opção `--console`, o servidor escreve a saída de diagnóstico para o log de erro no diretório de dados (`C:\Program Files\MySQL\MySQL Server 8.4\data` por padrão). O log de erro é o arquivo com a extensão `.err`, e pode ser definido usando a opção `--log-error`.

::: info Note

A conta inicial `root` nas tabelas de concessão do MySQL não tem senha. Depois de iniciar o servidor, você deve configurar uma senha para ele usando as instruções na Seção 2.9.4, Securing the Initial MySQL Account.

:::
