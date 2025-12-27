### 25.6.10 Uso do Servidor MySQL para o NDB Cluster

O **mysqld** é o processo tradicional do servidor MySQL. Para ser usado com o NDB Cluster, o **mysqld** precisa ser compilado com suporte ao motor de armazenamento `NDB`, como está nos binários pré-compilados disponíveis em <https://dev.mysql.com/downloads/>. Se você compilar o MySQL a partir da fonte, deve invocar o **CMake** com a opção `-DWITH_NDB=1` ou (desatualizada) `-DWITH_NDBCLUSTER=1` para incluir suporte para `NDB`.

Para obter mais informações sobre a compilação do NDB Cluster a partir da fonte, consulte a Seção 25.3.1.4, “Compilação do NDB Cluster a partir da Fonte no Linux” e a Seção 25.3.2.2, “Compilação e Instalação do NDB Cluster a partir da Fonte no Windows”.

(Para informações sobre as opções e variáveis do **mysqld**, além das discutidas nesta seção, que são relevantes para o NDB Cluster, consulte a Seção 25.4.3.9, “Opções e Variáveis do Servidor MySQL para o NDB Cluster”.)

Se o binário **mysqld** foi compilado com suporte ao Cluster, o motor de armazenamento `NDBCLUSTER` ainda está desativado por padrão. Você pode usar uma das duas opções possíveis para habilitar esse motor:

* Use `--ndbcluster` como uma opção de inicialização na linha de comando ao iniciar o **mysqld**.

* Insira uma linha contendo `ndbcluster` na seção `[mysqld]` do seu arquivo `my.cnf`.

Uma maneira fácil de verificar se seu servidor está rodando com o motor de armazenamento `NDBCLUSTER` habilitado é emitir a declaração `SHOW ENGINES` no Monitor MySQL (**mysql**). Você deve ver o valor `YES` como o valor `Support` na linha para `NDBCLUSTER`. Se você vir `NO` nesta linha ou se não houver uma linha desse tipo exibida na saída, você não está executando uma versão do MySQL habilitada para `NDB`. Se você vir `DISABLED` nesta linha, você precisa habilitá-lo de uma das duas maneiras descritas anteriormente.

Para ler os dados de configuração do cluster, o servidor MySQL requer, no mínimo, três informações:

* O ID do nó do servidor MySQL
* O nome do host ou o endereço IP do servidor de gerenciamento
* O número da porta TCP/IP na qual ele pode se conectar ao servidor de gerenciamento

Os IDs dos nós podem ser alocados dinamicamente, portanto, não é estritamente necessário especificá-los explicitamente.

O parâmetro **mysqld** `ndb-connectstring` é usado para especificar a string de conexão, seja na linha de comando ao iniciar o **mysqld** ou no `my.cnf`. A string de conexão contém o nome do host ou o endereço IP onde o servidor de gerenciamento pode ser encontrado, bem como a porta TCP/IP que ele usa.

No exemplo a seguir, `ndb_mgmd.mysql.com` é o host onde o servidor de gerenciamento reside, e o servidor de gerenciamento escuta mensagens de cluster na porta 1186:

```
$> mysqld --ndbcluster --ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Consulte a Seção 25.4.3.3, “Strings de Conexão de Cluster NDB”, para obter mais informações sobre as strings de conexão.

Com essas informações, o servidor MySQL pode atuar como um participante completo no cluster. (Muitas vezes, chamamos um processo **mysqld** que está executando dessa maneira de um nó SQL.) Ele está totalmente ciente de todos os nós de dados do cluster, bem como de seu status, e estabelece conexões com todos os nós de dados. Neste caso, ele é capaz de usar qualquer nó de dados como coordenador de transação e ler e atualizar dados de nó.

Você pode ver no cliente **mysql** se um servidor MySQL está conectado ao cluster usando `SHOW PROCESSLIST`. Se o servidor MySQL estiver conectado ao cluster e você tiver o privilégio `PROCESS`, a primeira linha do resultado será mostrada aqui:

```
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

Para participar de um NDB Cluster, o processo **mysqld** deve ser iniciado com *ambas* as opções `--ndbcluster` e `--ndb-connectstring` (ou seus equivalentes no `my.cnf`). Se o **mysqld** for iniciado apenas com a opção `--ndbcluster`, ou se ele não conseguir se conectar ao cluster, não será possível trabalhar com as tabelas `NDB`, *nem será possível criar novas tabelas, independentemente do motor de armazenamento*. Esta última restrição é uma medida de segurança destinada a prevenir a criação de tabelas com nomes iguais às tabelas `NDB` enquanto o nó SQL não estiver conectado ao cluster. Se você deseja criar tabelas usando um motor de armazenamento diferente enquanto o processo **mysqld** não estiver participando de um NDB Cluster, você deve reiniciar o servidor *sem* a opção `--ndbcluster`.