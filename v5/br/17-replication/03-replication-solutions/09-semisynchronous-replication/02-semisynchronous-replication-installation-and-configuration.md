#### 16.3.9.2 Instalação e Configuração da Replicação Semissíncrona

A replicação semissíncrona é implementada usando Plugins, portanto, os Plugins devem ser instalados no servidor para que fiquem disponíveis. Depois que um Plugin é instalado, você o controla por meio das variáveis de sistema associadas a ele. Essas variáveis de sistema ficam indisponíveis até que o Plugin associado tenha sido instalado.

Esta seção descreve como instalar os Plugins de replicação semissíncrona. Para informações gerais sobre a instalação de Plugins, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Para usar a replicação semissíncrona, os seguintes requisitos devem ser satisfeitos:

* A capacidade de instalar Plugins requer um servidor MySQL que suporte carregamento dinâmico. Para verificar isso, confira se o valor da variável de sistema [`have_dynamic_loading`](server-system-variables.html#sysvar_have_dynamic_loading) é `YES`. Distribuições binárias devem suportar carregamento dinâmico.

* A Replicação já deve estar funcionando, consulte [Seção 16.1, “Configurando a Replicação”](replication-configuration.html "16.1 Configuring Replication").

* Não deve haver múltiplos Canais de Replicação configurados. A replicação semissíncrona é compatível apenas com o Canal de Replicação padrão. Consulte [Seção 16.2.2, “Canais de Replicação”](replication-channels.html "16.2.2 Replication Channels").

Para configurar a replicação semissíncrona, use as seguintes instruções. As declarações [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), [`SET GLOBAL`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") e [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") mencionadas aqui exigem o privilégio [`SUPER`](privileges-provided.html#priv_super).

As distribuições MySQL incluem arquivos de Plugin de replicação semissíncrona para o lado Source e para o lado Replica.

Para serem utilizáveis por um servidor Source ou Replica, o arquivo de biblioteca de Plugin apropriado deve estar localizado no diretório de Plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de Plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do servidor.

Os nomes base dos arquivos de biblioteca de Plugin são `semisync_master` e `semisync_slave`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e similares a Unix, `.dll` para Windows).

O arquivo de biblioteca de Plugin do Source deve estar presente no diretório de Plugins do servidor Source. O arquivo de biblioteca de Plugin do Replica deve estar presente no diretório de Plugins de cada servidor Replica.

Para carregar os Plugins, use a declaração [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") no Source e em cada Replica que será semissíncrono, ajustando o sufixo `.so` para sua plataforma conforme necessário.

No Source:

```sql
INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';
```

Em cada Replica:

```sql
INSTALL PLUGIN rpl_semi_sync_slave SONAME 'semisync_slave.so';
```

Se uma tentativa de instalação de um Plugin resultar em um erro no Linux semelhante ao mostrado aqui, você deve instalar `libimf`:

```sql
mysql> INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';
ERROR 1126 (HY000): Can't open shared library
'/usr/local/mysql/lib/plugin/semisync_master.so'
(errno: 22 libimf.so: cannot open shared object file:
No such file or directory)
```

Você pode obter `libimf` em <https://dev.mysql.com/downloads/os-linux.html>.

Para ver quais Plugins estão instalados, use a declaração [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement"), ou consulte a tabela Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table").

Para verificar a instalação do Plugin, examine a tabela Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") ou use a declaração [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Seção 5.5.2, “Obtendo Informações de Plugin do Servidor”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%semi%';
+----------------------+---------------+
| PLUGIN_NAME          | PLUGIN_STATUS |
+----------------------+---------------+
| rpl_semi_sync_master | ACTIVE        |
+----------------------+---------------+
```

Se o Plugin falhar ao inicializar, verifique o Log de Erros do servidor em busca de mensagens de diagnóstico.

Depois que um Plugin de replicação semissíncrona é instalado, ele fica desabilitado por padrão. Os Plugins devem ser habilitados tanto no lado Source quanto no lado Replica para ativar a replicação semissíncrona. Se apenas um lado estiver habilitado, a replicação será assíncrona.

Para controlar se um Plugin instalado está habilitado, defina as variáveis de sistema apropriadas. Você pode definir essas variáveis em tempo de execução (runtime) usando [`SET GLOBAL`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), ou na inicialização do servidor na linha de comando ou em um arquivo de opção.

Em tempo de execução, estas variáveis de sistema do lado Source estão disponíveis:

```sql
SET GLOBAL rpl_semi_sync_master_enabled = {0|1};
SET GLOBAL rpl_semi_sync_master_timeout = N;
```

No lado Replica, esta variável de sistema está disponível:

```sql
SET GLOBAL rpl_semi_sync_slave_enabled = {0|1};
```

Para [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled) ou [`rpl_semi_sync_slave_enabled`](replication-options-replica.html#sysvar_rpl_semi_sync_slave_enabled), o valor deve ser 1 para habilitar a replicação semissíncrona ou 0 para desabilitá-la. Por padrão, estas variáveis são definidas como 0.

Para [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout), o valor *`N`* é dado em milissegundos. O valor padrão é 10000 (10 segundos).

Se você habilitar a replicação semissíncrona em um Replica em tempo de execução, você também deve iniciar a Thread I/O de replicação (parando-a primeiro, se já estiver em execução) para fazer com que o Replica se conecte ao Source e se registre como um Replica semissíncrono:

```sql
STOP SLAVE IO_THREAD;
START SLAVE IO_THREAD;
```

Se a Thread I/O de replicação já estiver em execução e você não a reiniciar, o Replica continuará a usar a replicação assíncrona.

Na inicialização do servidor, as variáveis que controlam a replicação semissíncrona podem ser definidas como opções de linha de comando ou em um arquivo de opção. Uma configuração listada em um arquivo de opção entra em vigor toda vez que o servidor é iniciado. Por exemplo, você pode definir as variáveis nos arquivos `my.cnf` no lado Source e Replica da seguinte forma.

No Source:

```sql
[mysqld]
rpl_semi_sync_master_enabled=1
rpl_semi_sync_master_timeout=1000 # 1 second
```

Em cada Replica:

```sql
[mysqld]
rpl_semi_sync_slave_enabled=1
```