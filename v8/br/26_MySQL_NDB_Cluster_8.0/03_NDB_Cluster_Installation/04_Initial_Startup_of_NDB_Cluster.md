### 25.3.4 Inicialização inicial do NDB Cluster

Iniciar o clúster não é muito difícil depois que ele é configurado. Cada processo do nó do clúster deve ser iniciado separadamente, no host onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, finalmente, pelos nós SQL:

1. No host de gerenciamento, execute o seguinte comando na shell do sistema para iniciar o processo do nó de gerenciamento:

   ```
   $> ndb_mgmd --initial -f /var/lib/mysql-cluster/config.ini
   ```

   Na primeira vez que ele for iniciado, o **ndb\_mgmd** deve ser informado sobre o local onde está localizado seu arquivo de configuração, usando a opção `-f` ou `--config-file`. Essa opção exige que `--initial` ou `--reload` também sejam especificados; consulte a Seção 25.5.4, “ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster”, para obter detalhes.

2. Em cada um dos hosts dos nós de dados, execute este comando para iniciar o processo **ndbd**:

   ```
   $> ndbd
   ```

3. Se você usou arquivos RPM para instalar o MySQL no host do clúster onde o nó SQL deve residir, você pode (e deve) usar o script de inicialização fornecido para iniciar o processo do servidor MySQL no nó SQL.

Se tudo tiver corrido bem e o clúster tiver sido configurado corretamente, ele agora deve estar operacional. Você pode testar isso invocando o cliente do nó de gerenciamento **ndb\_mgm**. A saída deve parecer com a mostrada aqui, embora você possa ver algumas pequenas diferenças na saída, dependendo da versão exata do MySQL que você está usando:

```
$> ndb_mgm
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=2    @198.51.100.30  (Version: 8.0.44-ndb-8.0.44, Nodegroup: 0, *)
id=3    @198.51.100.40  (Version: 8.0.44-ndb-8.0.44, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @198.51.100.10  (Version: 8.0.44-ndb-8.0.44)

[mysqld(API)]   1 node(s)
id=4    @198.51.100.20  (Version: 8.0.44-ndb-8.0.44)
```

O nó SQL é referido aqui como `[mysqld(API)]`, o que reflete o fato de que o processo **mysqld** está atuando como um nó da API do NDB Cluster.

Nota

O endereço IP exibido para um determinado nó SQL do NDB Cluster ou outro nó da API na saída do `SHOW` é o endereço usado pelo nó SQL ou API para se conectar aos nós de dados do cluster, e não a nenhum nó de gerenciamento.

Agora você deve estar pronto para trabalhar com bancos de dados, tabelas e dados no NDB Cluster. Consulte a Seção 25.3.5, “Exemplo de NDB Cluster com Tabelas e Dados”, para uma breve discussão.
