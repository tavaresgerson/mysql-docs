### 21.6.10 Uso do MySQL Server para NDB Cluster

**mysqld** é o processo tradicional do MySQL Server. Para ser usado com o NDB Cluster, o **mysqld** precisa ser construído com suporte para a storage engine `NDB`, como ocorre nos binários pré-compilados disponíveis em <https://dev.mysql.com/downloads/>. Se você construir o MySQL a partir do código fonte, você deve invocar o **CMake** com a opção `-DWITH_NDBCLUSTER=1` para incluir o suporte ao `NDB`.

Para mais informações sobre a compilação do NDB Cluster a partir do código fonte, consulte Section 21.3.1.4, “Construindo o NDB Cluster a Partir do Código Fonte no Linux”, e Section 21.3.2.2, “Compilando e Instalando o NDB Cluster a Partir do Código Fonte no Windows”.

(Para informações sobre opções e variáveis do **mysqld**, além daquelas discutidas nesta seção, que são relevantes para o NDB Cluster, consulte Section 21.4.3.9, “Opções e Variáveis do MySQL Server para NDB Cluster”.)

Se o binário do **mysqld** foi construído com suporte a Cluster, a storage engine `NDBCLUSTER` ainda está desabilitada por padrão. Você pode usar uma destas duas opções possíveis para habilitar esta engine:

* Use `--ndbcluster` como uma opção de startup na linha de comando ao iniciar o **mysqld**.

* Insira uma linha contendo `ndbcluster` na seção `[mysqld]` do seu arquivo `my.cnf`.

Uma maneira fácil de verificar se o seu Server está rodando com a storage engine `NDBCLUSTER` habilitada é executar a instrução `SHOW ENGINES` no MySQL Monitor (**mysql**). Você deve ver o valor `YES` como o valor de `Support` na linha para `NDBCLUSTER`. Se você vir `NO` nesta linha ou se nenhuma linha desse tipo for exibida na saída (output), você não está executando uma versão do MySQL habilitada para `NDB`. Se você vir `DISABLED` nesta linha, você precisa habilitá-la de uma das duas maneiras acabadas de descrever.

Para ler dados de configuração do Cluster, o MySQL Server requer no mínimo três informações:

* O próprio Cluster Node ID do MySQL Server
* O host name ou IP address para o management server
* O número da porta TCP/IP na qual ele pode se conectar ao management server

Os Node IDs podem ser alocados dinamicamente, portanto não é estritamente necessário especificá-los explicitamente.

O parâmetro **mysqld** `ndb-connectstring` é usado para especificar a connection string, seja na linha de comando ao iniciar o **mysqld**, ou no `my.cnf`. A connection string contém o host name ou IP address onde o management server pode ser encontrado, assim como a porta TCP/IP que ele utiliza.

No exemplo a seguir, `ndb_mgmd.mysql.com` é o host onde o management server reside, e o management server escuta por mensagens do Cluster na porta 1186:

```sql
$> mysqld --ndbcluster --ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Consulte Section 21.4.3.3, “NDB Cluster Connection Strings”, para mais informações sobre connection strings.

Dadas estas informações, o MySQL Server pode atuar como um participante completo no Cluster. (Frequentemente nos referimos a um processo **mysqld** rodando desta maneira como um SQL node.) Ele está totalmente ciente de todos os data nodes do Cluster, bem como de seu status, e estabelece conexões com todos os data nodes. Neste caso, ele é capaz de usar qualquer data node como um transaction coordinator e para ler e atualizar dados do node.

Você pode ver no client **mysql** se um MySQL Server está conectado ao Cluster usando `SHOW PROCESSLIST`. Se o MySQL Server estiver conectado ao Cluster, e você tiver o privilege `PROCESS`, a primeira linha da saída (output) será mostrada aqui:

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

Para participar de um NDB Cluster, o processo **mysqld** deve ser iniciado com *ambas* as opções `--ndbcluster` e `--ndb-connectstring` (ou seus equivalentes em `my.cnf`). Se o **mysqld** for iniciado apenas com a opção `--ndbcluster`, ou se ele não conseguir contatar o Cluster, não será possível trabalhar com tabelas `NDB`, *nem será possível criar novas tabelas, independentemente da storage engine*. Esta última restrição é uma medida de segurança destinada a evitar a criação de tabelas com os mesmos nomes que tabelas `NDB` enquanto o SQL node não estiver conectado ao Cluster. Se você deseja criar tabelas usando uma storage engine diferente enquanto o processo **mysqld** não estiver participando de um NDB Cluster, você deve reiniciar o Server *sem* a opção `--ndbcluster`.