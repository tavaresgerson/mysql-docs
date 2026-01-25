### 21.3.4 Inicialização Inicial do NDB Cluster

Iniciar o cluster não é muito difícil após sua configuração. Cada processo de *node* do cluster deve ser iniciado separadamente, e no *host* onde reside. O *management node* deve ser iniciado primeiro, seguido pelos *data nodes*, e, por fim, por quaisquer *SQL nodes*:

1. No *management host*, execute o seguinte comando a partir do *shell* do sistema para iniciar o processo do *management node*:

   ```sql
   $> ndb_mgmd --initial -f /var/lib/mysql-cluster/config.ini
   ```

   Na primeira vez em que é iniciado, deve-se informar ao [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") onde encontrar seu arquivo de configuração, usando a opção `-f` ou [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file). Essa opção exige que [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) ou [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) também sejam especificados; consulte [Seção 21.5.4, “ndb_mgmd — The NDB Cluster Management Server Daemon”](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), para obter detalhes.

2. Em cada um dos *hosts* dos *data nodes*, execute este comando para iniciar o processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"):

   ```sql
   $> ndbd
   ```

3. Se você usou arquivos RPM para instalar o MySQL no *host* do cluster onde o *SQL node* deve residir, você pode (e deve) usar o *script* de *startup* fornecido para iniciar o processo do servidor MySQL no *SQL node*.

Se tudo correu bem e o cluster foi configurado corretamente, ele agora deve estar operacional. Você pode testar isso invocando o *client* do *management node* [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"). A saída deve ser semelhante à mostrada aqui, embora você possa notar algumas pequenas diferenças dependendo da versão exata do MySQL que está utilizando:

```sql
$> ndb_mgm
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=2    @198.51.100.30  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0, *)
id=3    @198.51.100.40  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @198.51.100.10  (Version: 5.7.44-ndb-7.6.36)

[mysqld(API)]   1 node(s)
id=4    @198.51.100.20  (Version: 5.7.44-ndb-7.6.36)
```

O *SQL node* é referenciado aqui como `[mysqld(API)]`, o que reflete o fato de que o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") está atuando como um *API node* do NDB Cluster.

Nota

O *IP address* mostrado para um determinado *SQL* ou outro *API node* do NDB Cluster na saída de [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) é o endereço usado pelo *SQL* ou *API node* para se conectar aos *data nodes* do cluster, e não a qualquer *management node*.

Você deve estar pronto agora para trabalhar com *databases*, *tables* e dados no NDB Cluster. Consulte [Seção 21.3.5, “NDB Cluster Example with Tables and Data”](mysql-cluster-install-example-data.html "21.3.5 NDB Cluster Example with Tables and Data"), para uma breve discussão.