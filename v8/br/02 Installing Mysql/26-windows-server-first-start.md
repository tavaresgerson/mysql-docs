#### 2.3.3.5 Começando o Servidor pela Primeira Vez

Esta seção fornece uma visão geral geral sobre como iniciar o servidor MySQL. As seções seguintes fornecem informações mais específicas sobre como iniciar o servidor MySQL a partir da linha de comando ou como um serviço do Windows.

As informações aqui aplicam-se principalmente se você instalou o MySQL usando a versão `noinstall`, ou se deseja configurar e testar o MySQL manualmente em vez de usar o Configurável MySQL.

Os exemplos nessas seções assumem que o MySQL está instalado na localização padrão de `C:\Program Files\MySQL\MySQL Server 8.4`. Ajuste os nomes de caminho mostrados nos exemplos se o MySQL estiver instalado em um local diferente.

Os clientes têm duas opções. Eles podem usar TCP/IP ou podem usar um tubo nomeado se o servidor suportar conexões por tubo nomeado.

O MySQL para Windows também suporta conexões de memória compartilhada se o servidor for iniciado com a variável de sistema `shared_memory` habilitada. Os clientes podem se conectar através da memória compartilhada usando a opção `--protocol=MEMORY`.

Para obter informações sobre qual binário do servidor deve ser executado, consulte a Seção 2.3.3.3, “Selecionando um Tipo de Servidor MySQL”.

Testar é melhor feito a partir de um prompt de comando em uma janela de console (ou “janela DOS”). Dessa forma, você pode ter o servidor exibindo mensagens de status na janela onde elas são fáceis de ver. Se algo estiver errado com sua configuração, essas mensagens facilitam a identificação e correção de quaisquer problemas.

::: info Nota

A base de dados deve ser inicializada antes que o MySQL possa ser iniciado. Para obter informações adicionais sobre o processo de inicialização, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

:::

Para iniciar o servidor, insira este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld" --console
```

Você deve ver mensagens semelhantes às seguintes enquanto ele inicia (os nomes de caminho e tamanhos podem diferir). As mensagens `pronto para conexões` indicam que o servidor está pronto para atender conexões de clientes.

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

Agora você pode abrir uma nova janela de console na qual executar programas de clientes.

Se você omitir a opção `--console`, o servidor escreverá a saída de diagnóstico no log de erro no diretório de dados (`C:\Program Files\MySQL\MySQL Server 8.4\data` por padrão). O log de erro é o arquivo com a extensão `.err` e pode ser configurado usando a opção `--log-error`.

::: info Nota

A conta `root` inicial nas tabelas de concessão do MySQL não tem senha. Após iniciar o servidor, você deve configurá-la usando as instruções na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.