#### 25.4.3.1 Configuração do NDB Cluster: Exemplo Básico

Para suportar o NDB Cluster, você deve atualizar o `my.cnf` conforme mostrado no exemplo a seguir. Você também pode especificar esses parâmetros na linha de comando ao invocar os executáveis.

Nota

As opções mostradas aqui não devem ser confundidas com as que são usadas nos arquivos de configuração global `config.ini`. As opções de configuração global são discutidas mais adiante nesta seção.

```
# my.cnf
# example additions to my.cnf for NDB Cluster
# (valid in MySQL 9.5)

# enable ndbcluster storage engine, and provide connection string for
# management server host (default port is 1186)
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com


# provide connection string for management server host (default port: 1186)
[ndbd]
connect-string=ndb_mgmd.mysql.com

# provide connection string for management server host (default port: 1186)
[ndb_mgm]
connect-string=ndb_mgmd.mysql.com

# provide location of cluster configuration file
# IMPORTANT: When starting the management server with this option in the
# configuration file, the use of --initial or --reload on the command line when
# invoking ndb_mgmd is also required.
[ndb_mgmd]
config-file=/etc/config.ini
```

(Para mais informações sobre cadeias de conexão, consulte a Seção 25.4.3.3, “Cadeias de Conexão do NDB Cluster”.)

```
# my.cnf
# example additions to my.cnf for NDB Cluster
# (works on all versions)

# enable ndbcluster storage engine, and provide connection string for management
# server host to the default port 1186
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Importante

Uma vez que você tenha iniciado um processo **mysqld** com os parâmetros `NDBCLUSTER` e `ndb-connectstring` no `[mysqld]` no arquivo `my.cnf` conforme mostrado anteriormente, você não pode executar quaisquer instruções `CREATE TABLE` ou `ALTER TABLE` sem ter iniciado o cluster. Caso contrário, essas instruções falharão com um erro. *Isso é por design*.

Você também pode usar uma seção separada `[mysql_cluster]` no arquivo `my.cnf` do cluster para que as configurações sejam lidas e usadas por todos os executáveis:

```
# cluster-specific settings
[mysql_cluster]
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Para variáveis adicionais de `NDB` que podem ser definidas no arquivo `my.cnf`, consulte a Seção 25.4.3.9.2, “Variáveis de Sistema do NDB Cluster”.

O arquivo de configuração global do NDB Cluster é, por convenção, chamado `config.ini` (mas isso não é obrigatório). Se necessário, ele é lido pelo **ndb_mgmd** no início e pode ser colocado em qualquer local que possa ser lido por ele. A localização e o nome da configuração são especificados usando `--config-file=caminho_nome` com **ndb_mgmd** na linha de comando. Esta opção não tem valor padrão e é ignorada se o **ndb_mgmd** usar o cache de configuração.

O arquivo de configuração global do NDB Cluster usa o formato INI, que consiste em seções precedidas por cabeçalhos de seção (envoltos em colchetes), seguidos pelos nomes e valores apropriados dos parâmetros. Uma exceção ao formato INI padrão é que o nome e o valor do parâmetro podem ser separados por um colon (`:`) e também pelo sinal de igual (`=`); no entanto, o sinal de igual é preferido. Outra exceção é que as seções não são identificadas de forma única pelo nome da seção. Em vez disso, seções únicas (como dois nós diferentes do mesmo tipo) são identificadas por um ID único especificado como um parâmetro dentro da seção.

Valores padrão são definidos para a maioria dos parâmetros e também podem ser especificados no `config.ini`. Para criar uma seção de valor padrão, basta adicionar a palavra `default` ao nome da seção. Por exemplo, uma seção `[ndbd]` contém parâmetros que se aplicam a um nó de dados específico, enquanto uma seção `[ndbd default]` contém parâmetros que se aplicam a todos os nós de dados. Suponha que todos os nós de dados devam usar o mesmo tamanho de memória de dados. Para configurá-los todos, crie uma seção `[ndbd default]` que contenha uma linha `DataMemory` para especificar o tamanho da memória de dados.

Se usado, a seção `[ndbd default]` deve preceder quaisquer seções `[ndbd]` no arquivo de configuração. Isso também é verdadeiro para as seções `default` de qualquer outro tipo.

Nota

Em algumas versões mais antigas do NDB Cluster, não havia valor padrão para `NoOfReplicas`, que sempre teve que ser especificado explicitamente na seção `[ndbd default]`. Embora este parâmetro agora tenha um valor padrão de 2, que é o ajuste recomendado na maioria dos cenários de uso comum, ainda é uma prática recomendada definir este parâmetro explicitamente.

O arquivo de configuração global deve definir os computadores e nós envolvidos no clúster e em quais computadores esses nós estão localizados. Um exemplo de um arquivo de configuração simples para um clúster composto por um servidor de gerenciamento, dois nós de dados e dois servidores MySQL é mostrado aqui:

```
# file "config.ini" - 2 data nodes and 2 SQL nodes
# This file is placed in the startup directory of ndb_mgmd (the
# management server)
# The first MySQL Server can be started from any host. The second
# can be started only on the host mysqld_5.mysql.com

[ndbd default]
NoOfReplicas= 2
DataDir= /var/lib/mysql-cluster

[ndb_mgmd]
Hostname= ndb_mgmd.mysql.com
DataDir= /var/lib/mysql-cluster

[ndbd]
HostName= ndbd_2.mysql.com

[ndbd]
HostName= ndbd_3.mysql.com

[mysqld]
[mysqld]
HostName= mysqld_5.mysql.com
```

Nota

O exemplo anterior é destinado como uma configuração inicial mínima para fins de familiarização com o NDB Cluster, e quase certamente não será suficiente para configurações de produção. Veja a Seção 25.4.3.2, “Configuração Inicial Recomendada para o NDB Cluster”, que fornece uma configuração de inicialização mais completa.

Cada nó tem sua própria seção no arquivo `config.ini`. Por exemplo, este clúster tem dois nós de dados, então o arquivo de configuração anterior contém duas seções `[ndbd]` definindo esses nós.

Nota

Não coloque comentários na mesma linha que o cabeçalho de uma seção no arquivo `config.ini`; isso faz com que o servidor de gerenciamento não inicie porque não consegue parsear o arquivo de configuração nesses casos.

##### Seções do arquivo config.ini

Existem seis seções diferentes que você pode usar no arquivo de configuração `config.ini`, conforme descrito na lista a seguir:

* `[computer]`: Define os hosts do clúster. Isso não é necessário para configurar um NDB Cluster viável, mas pode ser usado como uma conveniência ao configurar um grande clúster. Veja a Seção 25.4.3.4, “Definindo Computadores em um NDB Cluster”, para mais informações.

* `[ndbd]`: Define um nó de dados de clúster (**processo ndbd**). Veja a Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”, para detalhes.

* `[mysqld]`: Define os nós do servidor MySQL do clúster (também chamados de nós SQL ou API). Para uma discussão sobre a configuração do nó SQL, veja a Seção 25.4.3.7, “Definindo Nodos SQL e Outros Nodos API em um NDB Cluster”.

* `[mgm]` ou `[ndb_mgmd]`: Define um nó do servidor de gerenciamento de clúster (MGM). Para obter informações sobre a configuração dos nós de gerenciamento, consulte a Seção 25.4.3.5, “Definindo um Servidor de Gerenciamento de Clúster NDB”.

* `[tcp]`: Define uma conexão TCP/IP entre nós do clúster, com TCP/IP sendo o protocolo de transporte padrão. Normalmente, as seções `[tcp]` ou `[tcp default]` não são necessárias para configurar um Clúster NDB, pois o clúster lida com isso automaticamente; no entanto, pode ser necessário em algumas situações para substituir os padrões fornecidos pelo clúster. Consulte a Seção 25.4.3.10, “Conexões TCP/IP de Clúster NDB”, para obter informações sobre os parâmetros de configuração TCP/IP disponíveis e como usá-los. (Você também pode achar a Seção 25.4.3.11, “Conexões TCP/IP de Clúster NDB Usando Conexões Direitas”, interessante em alguns casos.)

* `[shm]`: Define conexões de memória compartilhada entre nós. No MySQL 9.5, elas estão habilitadas por padrão, mas ainda devem ser consideradas experimentais. Para uma discussão sobre as interconexões SHM, consulte a Seção 25.4.3.12, “Conexões de Memória Compartilhada de Clúster NDB”.

* `[sci]`: Define conexões de Interface Coherente Escalável entre nós de dados do clúster. Não é suportada no NDB 9.5.