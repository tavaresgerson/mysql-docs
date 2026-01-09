### 21.6.10 Uso do MySQL Server para o NDB Cluster

**mysqld** é o processo tradicional do servidor MySQL. Para ser usado com o NDB Cluster, **mysqld** precisa ser compilado com suporte ao mecanismo de armazenamento `NDB`, como está nos binários pré-compilados disponíveis em <https://dev.mysql.com/downloads/>. Se você compilar o MySQL a partir da fonte, deve invocar o **CMake** com a opção `-DWITH_NDBCLUSTER=1` para incluir suporte para `NDB`.

Para obter mais informações sobre a compilação do NDB Cluster a partir da fonte, consulte Seção 21.3.1.4, “Compilação do NDB Cluster a partir da fonte no Linux” e Seção 21.3.2.2, “Compilação e instalação do NDB Cluster a partir da fonte no Windows”.

(Para informações sobre as opções e variáveis do **mysqld**, além das discutidas nesta seção, que são relevantes para o NDB Cluster, consulte Seção 21.4.3.9, “Opções e variáveis do servidor MySQL para NDB Cluster”.)

Se o binário **mysqld** foi compilado com suporte ao Cluster, o mecanismo de armazenamento `NDBCLUSTER` ainda está desativado por padrão. Você pode usar uma das duas opções possíveis para ativar esse mecanismo:

- Use `--ndbcluster` como uma opção de inicialização na linha de comando ao iniciar o **mysqld**.

- Insira uma linha contendo `ndbcluster` na seção `[mysqld]` do seu arquivo `my.cnf`.

Uma maneira fácil de verificar se seu servidor está rodando com o mecanismo de armazenamento `NDBCLUSTER` habilitado é emitir a declaração `SHOW ENGINES` no Monitor MySQL (**mysql**). Você deve ver o valor `YES` como o valor `Support` na linha para `NDBCLUSTER`. Se você vir `NO` nesta linha ou se não houver uma linha desse tipo exibida na saída, você não está executando uma versão do MySQL habilitada para `NDB`. Se você vir `DISABLED` nesta linha, você precisa habilitá-lo de uma das duas maneiras descritas anteriormente.

Para ler os dados de configuração do cluster, o servidor MySQL requer, no mínimo, três informações:

- O próprio ID do nó do cluster do servidor MySQL
- O nome do host ou endereço IP do servidor de gerenciamento
- O número da porta TCP/IP na qual ele pode se conectar ao servidor de gerenciamento

Os IDs dos nós podem ser alocados dinamicamente, portanto, não é estritamente necessário especificá-los explicitamente.

O parâmetro **mysqld** `ndb-connectstring` é usado para especificar a string de conexão na linha de comando ao iniciar o **mysqld** ou no `my.cnf`. A string de conexão contém o nome do host ou o endereço IP onde o servidor de gerenciamento pode ser encontrado, além da porta TCP/IP que ele usa.

No exemplo a seguir, `ndb_mgmd.mysql.com` é o host onde o servidor de gerenciamento reside, e o servidor de gerenciamento escuta mensagens de cluster na porta 1186:

```sql
$> mysqld --ndbcluster --ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Consulte Seção 21.4.3.3, "Cadeias de Conexão do NDB Cluster" para obter mais informações sobre as cadeias de conexão.

Com essas informações, o servidor MySQL pode atuar como um participante completo no clúster. (Muitas vezes, chamamos um processo **mysqld** que está executando dessa maneira de um nó SQL.) Ele está totalmente ciente de todos os nós de dados do clúster, bem como de seu status, e estabelece conexões com todos os nós de dados. Neste caso, ele é capaz de usar qualquer nó de dados como um coordenador de transações e ler e atualizar os dados dos nós.

Você pode ver no cliente **mysql** se um servidor MySQL está conectado ao cluster usando `SHOW PROCESSLIST`. Se o servidor MySQL estiver conectado ao cluster e você tiver o privilégio `PROCESS`, a primeira linha do resultado será a seguinte:

```sql
mysql> SHOW PROCESSLIST \G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db:
Command: Daemon
   Time: 1
  State: Waiting for event from ndbcluster
   Info: NULL
```

Importante

Para participar de um NDB Cluster, o processo **mysqld** deve ser iniciado com *ambas* as opções `--ndbcluster` e [`--ndb-connectstring`]\(mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring] (ou seus equivalentes na `my.cnf`). Se o **mysqld** for iniciado com apenas a opção `--ndbcluster`, ou se não conseguir se conectar ao cluster, não é possível trabalhar com as tabelas de **NDB**, *nem é possível criar novas tabelas, independentemente do motor de armazenamento*. Esta última restrição é uma medida de segurança destinada a prevenir a criação de tabelas com os mesmos nomes das tabelas de **NDB** enquanto o nó SQL não estiver conectado ao cluster. Se você deseja criar tabelas usando um motor de armazenamento diferente enquanto o processo **mysqld** não estiver participando de um NDB Cluster, você deve reiniciar o servidor *sem* a opção `--ndbcluster`.
