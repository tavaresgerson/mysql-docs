#### 19.4.10.1 Instalação da Replicação Semisincronizada

A replicação semiesincronizada é implementada usando plugins, que devem ser instalados na fonte e nas réplicas para tornar a replicação semiesincronizada disponível nas instâncias. Existem diferentes plugins para uma fonte e para uma réplica. Após a instalação de um plugin, você o controla por meio das variáveis de sistema associadas a ele. Essas variáveis de sistema estão disponíveis apenas quando o plugin associado foi instalado.

Esta seção descreve como instalar os plugins de replicação semisoincronizada. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para usar a replicação semiesincronizada, os seguintes requisitos devem ser atendidos:

- A capacidade de instalar plugins requer um servidor MySQL que suporte carregamento dinâmico. Para verificar isso, verifique se o valor da variável de sistema `have_dynamic_loading` é `YES`. As distribuições binárias devem suportar o carregamento dinâmico.

- A replicação já deve estar funcionando, veja a Seção 19.1, “Configurando a Replicação”.

- Não deve haver vários canais de replicação configurados. A replicação semiesincronizada é compatível apenas com o canal de replicação padrão. Consulte a Seção 19.2.2, “Canais de replicação”.

O MySQL 8.0.26 e versões posteriores fornecem novas versões dos plugins que implementam a replicação semi-sincronizada, um para o servidor fonte e outro para a replica. Os novos plugins substituem os termos “master” e “slave” pelos termos “source” e “replica” nas variáveis de sistema e variáveis de status, e você pode (e deve) instalar essas versões em vez das versões antigas (que agora estão desatualizadas e, portanto, sujeitas à remoção em uma futura versão do MySQL). Você não pode ter ambas as versões novas e as versões antigas do plugin relevante instaladas em uma instância. Se você usar as novas versões dos plugins, as novas variáveis de sistema e variáveis de status estarão disponíveis, mas as antigas não; se você usar as versões antigas dos plugins, as variáveis de sistema e variáveis de status antigas estarão disponíveis, mas as novas

O sufixo do nome do arquivo para os arquivos da biblioteca de plugins difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, e `.dll` para Windows). Os nomes dos arquivos de plugin e biblioteca são os seguintes:

- Servidor de origem, terminologia antiga: `rpl_semi_sync_master` plugin (biblioteca `semisync_master.so` ou `semisync_master.dll`)

- Servidor de origem, nova terminologia (a partir do MySQL 8.0.26): plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so` ou `semisync_source.dll`)

- Replicação, terminologia antiga: `rpl_semi_sync_slave` plugin (biblioteca `semisync_slave.so` ou `semisync_slave.dll`)

- Replica, nova terminologia (a partir do MySQL 8.0.26): plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so` ou `semisync_replica.dll`)

Para ser utilizado por um servidor fonte ou replica, o arquivo da biblioteca de plugins apropriado deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor. O arquivo da biblioteca de plugins fonte deve estar presente no diretório do plugin do servidor fonte. O arquivo da biblioteca de plugins replica deve estar presente no diretório do plugin de cada servidor replica.

Para configurar a replicação semisoincronizada, use as instruções a seguir. As instruções `INSTALL PLUGIN`, `SET GLOBAL`, `STOP REPLICA` e `START REPLICA` mencionadas aqui exigem o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio desatualizado `SUPER`).

Para carregar os plugins, use a instrução `INSTALL PLUGIN` na fonte e em cada réplica que deve ser semi-sincronizada, ajustando o sufixo `.so` para sua plataforma conforme necessário.

Sobre a fonte:

```
INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';

Or from MySQL 8.0.26:
INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
```

Em cada réplica:

```
INSTALL PLUGIN rpl_semi_sync_slave SONAME 'semisync_slave.so';

Or from MySQL 8.0.26:
INSTALL PLUGIN rpl_semi_sync_replica SONAME 'semisync_replica.so';
```

Se uma tentativa de instalar um plugin resultar em um erro no Linux semelhante ao mostrado aqui, você deve instalar `libimf`:

```
mysql> INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
ERROR 1126 (HY000): Can't open shared library
'/usr/local/mysql/lib/plugin/semisync_source.so'
(errno: 22 libimf.so: cannot open shared object file:
No such file or directory)
```

Você pode obter o `libimf` em <https://dev.mysql.com/downloads/os-linux.html>.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%semi%';
+----------------------+---------------+
| PLUGIN_NAME          | PLUGIN_STATUS |
+----------------------+---------------+
| rpl_semi_sync_source | ACTIVE        |
+----------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico.

Após a instalação de um plugin de replicação semissíncrona, ele é desativado por padrão. Os plugins devem ser habilitados tanto no lado de origem quanto no lado da replica para habilitar a replicação semissíncrona. Se apenas um lado for habilitado, a replicação será assíncrona. Para habilitar os plugins, defina a variável de sistema apropriada, seja no tempo de execução usando `SET GLOBAL`, ou na inicialização do servidor na linha de comando ou em um arquivo de opção. Por exemplo:

```
On the source:
SET GLOBAL rpl_semi_sync_master_enabled = 1;

Or from MySQL 8.0.26 with the rpl_semi_sync_source plugin:
SET GLOBAL rpl_semi_sync_source_enabled = 1;
```

```
On each replica:
SET GLOBAL rpl_semi_sync_slave_enabled = 1;

Or from MySQL 8.0.26 with the rpl_semi_sync_replica plugin:
SET GLOBAL rpl_semi_sync_replica_enabled = 1;
```

Se você ativar a replicação semi-sincronizada em uma replica durante a execução, também é necessário iniciar o thread de I/O de replicação (receptor) (parando-o primeiro, se ele já estiver em execução) para fazer com que a replica se conecte à fonte e se registre como uma replica semi-sincronizada:

```
STOP SLAVE IO_THREAD;
START SLAVE IO_THREAD;

Or from MySQL 8.0.22:
STOP REPLICA IO_THREAD;
START REPLICA IO_THREAD;
```

Se a thread de I/O de replicação (receptor) já estiver em execução e você não reiniciá-la, a replica continuará usando a replicação assíncrona.

Uma configuração listada em um arquivo de opções entra em vigor sempre que o servidor é iniciado. Por exemplo, você pode definir as variáveis nos arquivos `my.cnf` nos servidores de origem e replicação da seguinte forma:

```
 On the source:

[mysqld]
rpl_semi_sync_master_enabled=1

Or from MySQL 8.0.26 with the rpl_semi_sync_source plugin:
rpl_semi_sync_source_enabled=1
```

```
 On each replica:

[mysqld]
rpl_semi_sync_slave_enabled=1

Or from MySQL 8.0.26 with the rpl_semi_sync_source plugin:
rpl_semi_sync_replica_enabled=1
```

Você pode configurar o comportamento dos plugins de replicação semisoincronizada usando as variáveis de sistema que ficam disponíveis quando você instala os plugins. Para obter informações sobre as principais variáveis de sistema, consulte a Seção 19.4.10.2, “Configurando a Replicação Semisoincronizada”.
