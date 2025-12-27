#### 19.4.10.1 Instalação da Replicação Semisincronizada

A replicação semisincronizada é implementada usando plugins, que devem ser instalados na fonte e nas réplicas para tornar a replicação semisincronizada disponível nas instâncias. Existem diferentes plugins para uma fonte e para uma réplica. Após a instalação de um plugin, você o controla por meio das variáveis de sistema associadas a ele. Essas variáveis de sistema estão disponíveis apenas quando o plugin associado foi instalado.

Esta seção descreve como instalar os plugins de replicação semisincronizada. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para usar a replicação semisincronizada, os seguintes requisitos devem ser atendidos:

* A capacidade de instalar plugins requer um servidor MySQL que suporte carregamento dinâmico. Para verificar isso, verifique se o valor da variável de sistema `have_dynamic_loading` é `YES`. As distribuições binárias devem suportar o carregamento dinâmico.

* A replicação deve estar funcionando, consulte a Seção 19.1, “Configurando a Replicação”.

* Não deve haver múltiplos canais de replicação configurados. A replicação semisincronizada é compatível apenas com o canal de replicação padrão. Consulte a Seção 19.2.2, “Canais de Replicação”.

O MySQL 9.5 fornece versões dos plugins que implementam replicação semisoincronizada — um para o servidor de origem e um para a replica — que substituem os termos “mestre” e “escravo” por “fonte” e “replica” nas variáveis de sistema e variáveis de status; você deve instalar essas versões em vez das antigas (que agora foram removidas). As topologias de replicação que ainda usam os antigos plugins semisoincronizados devem ser atualizadas para usar os novos plugins. Para obter mais informações, consulte Atualizando as Topologias de Replicação para Usar Novos Plugins de Replicação Semisoincronizada.

O sufixo do nome do arquivo para os arquivos da biblioteca de plugins difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, e `.dll` para Windows). Os nomes dos arquivos de plugin e biblioteca são os seguintes:

* Servidor de origem: plugin `rpl_semi_sync_source` (`semisync_source.so` ou `semisync_source.dll` biblioteca)

* Replica: plugin `rpl_semi_sync_replica` (`semisync_replica.so` ou `semisync_replica.dll` biblioteca)

Para ser utilizável por um servidor de origem ou replica, o arquivo da biblioteca de plugin apropriado deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor. O arquivo da biblioteca de plugin de origem deve estar presente no diretório do plugin do servidor de origem. O arquivo da biblioteca de plugin de replica deve estar presente no diretório do plugin de cada servidor de replica.

Para configurar a replicação semisoincronizada, use as instruções a seguir. As declarações `INSTALL PLUGIN`, `SET GLOBAL`, `STOP REPLICA` e `START REPLICA` mencionadas aqui requerem o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio desatualizado `SUPER`).

Para carregar os plugins, use a instrução `INSTALL PLUGIN` no arquivo fonte e em cada réplica que deve ser semi-sincronizada, ajustando o sufixo `.so` para a sua plataforma conforme necessário.

No arquivo fonte:

```
INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
```

Em cada réplica:

```
INSTALL PLUGIN rpl_semi_sync_replica SONAME 'semisync_replica.so';
```

Se uma tentativa de instalação de um plugin resultar em um erro no Linux semelhante ao mostrado aqui, você deve instalar o `libimf`:

```
mysql> INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
ERROR 1126 (HY000): Can't open shared library
'/usr/local/mysql/lib/plugin/semisync_source.so'
(errno: 22 libimf.so: cannot open shared object file:
No such file or directory)
```

Você pode obter o `libimf` em <https://dev.mysql.com/downloads/os-linux.html>.

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (veja a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Se um plugin não conseguir inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Após a instalação de um plugin de replicação semi-sincronizada, ele é desativado por padrão. Os plugins devem ser ativados tanto no lado fonte quanto no lado da réplica para habilitar a replicação semi-sincronizada. Se apenas um lado estiver ativado, a replicação é assíncrona. Para ativar os plugins, defina a variável de sistema apropriada, seja em tempo de execução usando `SET GLOBAL`, ou na inicialização do servidor na linha de comando ou em um arquivo de opção. Por exemplo:

```
SET GLOBAL rpl_semi_sync_source_enabled = 1;
```

```
SET GLOBAL rpl_semi_sync_replica_enabled = 1;
```

Se você ativar a replicação semi-sincronizada em uma réplica em tempo de execução, também deve iniciar o fio de I/O de replicação (receptor) para que a réplica se conecte ao servidor e se registre como uma réplica semi-sincronizada:

```
STOP REPLICA IO_THREAD;
START REPLICA IO_THREAD;
```

Se o fio de I/O de replicação (receptor) já estiver em execução e você não reiniciá-lo, a réplica continuará usando a replicação assíncrona.

Uma configuração listada em um arquivo de opções entra em vigor sempre que o servidor é iniciado. Por exemplo, você pode definir as variáveis nos arquivos `my.cnf` nos servidores de origem e replicação da seguinte forma. Na origem:

```
[mysqld]
rpl_semi_sync_source_enabled=1
```

Em cada replica:

```
[mysqld]
rpl_semi_sync_replica_enabled=1
```

Você pode configurar o comportamento dos plugins de replicação semisoincronizada usando as variáveis de sistema que ficam disponíveis quando você instala os plugins. Para informações sobre as variáveis de sistema chave, consulte a Seção 19.4.10.2, “Configurando a Replicação Semisoincronizada”.

##### Atualizando as Topologias de Replicação para Usar Novos Plugins de Replicação Semisoincronizada

Em topologias de replicação que ainda usam os antigos plugins semisoincronizados, as instâncias do MySQL devem ser reconfiguradas primeiro para usar os novos plugins de replicação semisoincronizada. Para reconfigurar as instâncias do MySQL:

1. Pare a replicação em cada instância de replica e origem.
2. Desinstale os antigos plugins `rpl_semi_sync_master` e `rpl_semi_sync_slave`.

3. Instale os novos plugins `rpl_semi_sync_source` e `rpl_semi_sync_source`.

4. Ative a replicação semisoincronizada novamente.

A atualização da topologia de replicação deve então ser realizada da maneira padrão, começando com as réplicas e depois progredindo para a origem. Para mais informações, consulte a Seção 19.5.3, “Atualizando ou Desatualizando uma Topologia de Replicação”.