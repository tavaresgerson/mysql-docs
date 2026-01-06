### 21.3.4 Inicialização inicial do NDB Cluster

Iniciar o clúster não é muito difícil depois que ele é configurado. Cada processo do nó do clúster deve ser iniciado separadamente, no host onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, finalmente, pelos nós SQL:

1. No host de gerenciamento, execute o seguinte comando na shell do sistema para iniciar o processo do nó de gerenciamento:

   ```sql
   $> ndb_mgmd --initial -f /var/lib/mysql-cluster/config.ini
   ```

   Na primeira vez que ele for iniciado, **ndb\_mgmd** deve ser informado onde encontrar seu arquivo de configuração, usando a opção `-f` ou `--config-file`. Essa opção exige que `--initial` ou `--reload` também sejam especificados; veja Seção 21.5.4, “ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster”, para detalhes.

2. Em cada um dos hosts dos nós de dados, execute este comando para iniciar o processo **ndbd**:

   ```sql
   $> ndbd
   ```

3. Se você usou arquivos RPM para instalar o MySQL no host do clúster onde o nó SQL deve residir, você pode (e deve) usar o script de inicialização fornecido para iniciar o processo do servidor MySQL no nó SQL.

Se tudo tiver corrido bem e o clúster tiver sido configurado corretamente, ele agora deve estar operacional. Você pode testar isso invocando o cliente do nó de gerenciamento **ndb\_mgm**. A saída deve parecer como a mostrada aqui, embora você possa ver algumas pequenas diferenças na saída, dependendo da versão exata do MySQL que você está usando:

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

O nó SQL é referido aqui como `[mysqld(API)]`, o que reflete o fato de que o processo **mysqld** está atuando como um nó da API do NDB Cluster.

Nota

O endereço IP exibido para um determinado nó SQL do NDB Cluster ou outro nó da API no resultado do comando `SHOW` (mysql-cluster-mgm-client-commands.html#ndbclient-show) é o endereço usado pelo nó SQL ou API para se conectar aos nós de dados do cluster, e não a nenhum nó de gerenciamento.

Agora você deve estar pronto para trabalhar com bancos de dados, tabelas e dados no NDB Cluster. Consulte Seção 21.3.5, “Exemplo de NDB Cluster com Tabelas e Dados” para uma breve discussão.
