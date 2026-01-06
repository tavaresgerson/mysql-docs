#### 16.3.9.2 Instalação e configuração da replicação semiesincronizada

A replicação semiesincronizada é implementada usando plugins, então os plugins devem ser instalados no servidor para torná-los disponíveis. Após a instalação de um plugin, você controla ele por meio das variáveis de sistema associadas a ele. Essas variáveis de sistema não estão disponíveis até que o plugin associado tenha sido instalado.

Esta seção descreve como instalar os plugins de replicação semisoincronizada. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para usar a replicação semiesincronizada, os seguintes requisitos devem ser atendidos:

- A capacidade de instalar plugins requer um servidor MySQL que suporte carregamento dinâmico. Para verificar isso, verifique se o valor da variável de sistema `have_dynamic_loading` é `YES`. As distribuições binárias devem suportar o carregamento dinâmico.

- A replicação já deve estar funcionando, veja Seção 16.1, “Configurando a Replicação”.

- Não deve haver múltiplos canais de replicação configurados. A replicação semi-sincronizada é compatível apenas com o canal de replicação padrão. Consulte Seção 16.2.2, “Canais de replicação”.

Para configurar a replicação semissoríncrona, use as instruções a seguir. As instruções `INSTALL PLUGIN`, `SET GLOBAL`, `STOP SLAVE` e `START SLAVE` mencionadas aqui exigem o privilégio `SUPER`.

As distribuições do MySQL incluem arquivos de plugins de replicação semi-sincronizados para o lado da fonte e para o lado da replica.

Para que um servidor de origem ou replicação possa usá-lo, o arquivo da biblioteca de plugins apropriado deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

Os nomes de arquivo da biblioteca de plugins são `semisync_master` e `semisync_slave`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

O arquivo da biblioteca de plugins de origem deve estar presente no diretório de plugins do servidor de origem. O arquivo da biblioteca de plugins de replicação deve estar presente no diretório de plugins de cada servidor de replicação.

Para carregar os plugins, use a instrução `INSTALL PLUGIN` na fonte e em cada réplica que deve ser semi-sincronizada, ajustando o sufixo `.so` para sua plataforma conforme necessário.

Sobre a fonte:

```sql
INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';
```

Em cada réplica:

```sql
INSTALL PLUGIN rpl_semi_sync_slave SONAME 'semisync_slave.so';
```

Se uma tentativa de instalar um plugin resultar em um erro no Linux semelhante ao mostrado aqui, você deve instalar o `libimf`:

```sql
mysql> INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';
ERROR 1126 (HY000): Can't open shared library
'/usr/local/mysql/lib/plugin/semisync_master.so'
(errno: 22 libimf.so: cannot open shared object file:
No such file or directory)
```

Você pode obter o `libimf` em <https://dev.mysql.com/downloads/os-linux.html>.

Para ver quais plugins estão instalados, use a instrução `SHOW PLUGINS` ou consulte a tabela do Schema de Informações `PLUGINS`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

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

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Após a instalação de um plugin de replicação semissíncrona, ele é desativado por padrão. Os plugins devem ser ativados tanto no lado de origem quanto no lado da replica para habilitar a replicação semissíncrona. Se apenas um lado for ativado, a replicação será assíncrona.

Para controlar se um plugin instalado está habilitado, defina as variáveis de sistema apropriadas. Você pode definir essas variáveis em tempo de execução usando `SET GLOBAL`, ou na inicialização do servidor na linha de comando ou em um arquivo de opções.

Durante a execução, essas variáveis de sistema do lado da fonte estão disponíveis:

```sql
SET GLOBAL rpl_semi_sync_master_enabled = {0|1};
SET GLOBAL rpl_semi_sync_master_timeout = N;
```

No lado da replicação, esta variável do sistema está disponível:

```sql
SET GLOBAL rpl_semi_sync_slave_enabled = {0|1};
```

Para [`rpl_semi_sync_master_enabled`](https://docs.mariadb.org/mariadb/10.0/en/replication-options-source.html#sysvar_rpl_semi_sync_master_enabled) ou [`rpl_semi_sync_slave_enabled`](https://docs.mariadb.org/mariadb/10.0/en/replication-options-replica.html#sysvar_rpl_semi_sync_slave_enabled), o valor deve ser 1 para habilitar a replicação semi-sincronizada ou 0 para desabilitá-la. Por padrão, essas variáveis são definidas como 0.

Para `rpl_semi_sync_master_timeout`, o valor *`N`* é dado em milissegundos. O valor padrão é 10000 (10 segundos).

Se você ativar a replicação semi-sincronizada em uma replica durante a execução, também é necessário iniciar a thread de I/O de replicação (parando-a primeiro, se ela já estiver em execução) para fazer com que a replica se conecte à fonte e se registre como uma replica semi-sincronizada:

```sql
STOP SLAVE IO_THREAD;
START SLAVE IO_THREAD;
```

Se a thread de I/O de replicação já estiver em execução e você não reiniciá-la, a replica continuará usando a replicação assíncrona.

Ao iniciar o servidor, as variáveis que controlam a replicação semiesincronizada podem ser definidas como opções de linha de comando ou em um arquivo de opções. Uma configuração listada em um arquivo de opções entra em vigor sempre que o servidor é iniciado. Por exemplo, você pode definir as variáveis nos arquivos `my.cnf` dos lados de origem e replicação da seguinte forma.

Sobre a fonte:

```sql
[mysqld]
rpl_semi_sync_master_enabled=1
rpl_semi_sync_master_timeout=1000 # 1 second
```

Em cada réplica:

```sql
[mysqld]
rpl_semi_sync_slave_enabled=1
```
