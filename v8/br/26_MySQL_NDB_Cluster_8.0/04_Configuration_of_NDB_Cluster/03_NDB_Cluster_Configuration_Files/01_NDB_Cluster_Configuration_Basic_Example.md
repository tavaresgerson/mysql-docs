#### 25.4.3.1 Configuração do Clúster NDB: Exemplo Básico

Para suportar o NDB Cluster, você deve atualizar `my.cnf` conforme mostrado no exemplo a seguir. Você também pode especificar esses parâmetros na linha de comando ao invocar os executáveis.

Nota

As opções mostradas aqui não devem ser confundidas com as que são usadas nos arquivos de configuração global `config.ini`. As opções de configuração global são discutidas mais adiante nesta seção.

```
# my.cnf
# example additions to my.cnf for NDB Cluster
# (valid in MySQL 8.0)

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

(Para mais informações sobre cadeias de conexão, consulte a Seção 25.4.3.3, “Cadeias de conexão de cluster NDB”.)

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

Depois de iniciar um processo **mysqld** com os parâmetros `NDBCLUSTER` e `ndb-connectstring` no arquivo `[mysqld]` na pasta `my.cnf` conforme mostrado anteriormente, você não pode executar quaisquer instruções `CREATE TABLE` ou `ALTER TABLE` sem ter iniciado o cluster. Caso contrário, essas instruções falharão com um erro. *Isso é por design*.

Você também pode usar uma seção `[mysql_cluster]` separada no arquivo de cluster `my.cnf` para definir configurações que serão lidas e usadas por todos os executáveis:

```
# cluster-specific settings
[mysql_cluster]
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Para variáveis adicionais `NDB` que podem ser definidas no arquivo `my.cnf`, consulte a Seção 25.4.3.9.2, “Variáveis do Sistema de Clúster NDB”.

O arquivo de configuração global do NDB Cluster é, por convenção, chamado de `config.ini` (mas isso não é obrigatório). Se necessário, ele é lido pelo **ndb\_mgmd** durante o início e pode ser colocado em qualquer local que ele possa ler. A localização e o nome da configuração são especificados usando `--config-file=path_name` com o **ndb\_mgmd** na linha de comando. Esta opção não tem um valor padrão e é ignorada se o **ndb\_mgmd** usar o cache de configuração.

O arquivo de configuração global do NDB Cluster usa o formato INI, que consiste em seções precedidas por cabeçalhos de seção (envolvidos por colchetes), seguidos pelos nomes e valores apropriados dos parâmetros. Uma exceção ao formato INI padrão é que o nome e o valor do parâmetro podem ser separados por um colon (`:`) assim como pelo sinal de igual (`=`); no entanto, o sinal de igual é preferido. Outra exceção é que as seções não são identificadas de forma única pelo nome da seção. Em vez disso, seções únicas (como dois nós diferentes do mesmo tipo) são identificadas por um ID único especificado como um parâmetro dentro da seção.

Os valores padrão são definidos para a maioria dos parâmetros e também podem ser especificados em `config.ini`. Para criar uma seção de valor padrão, basta adicionar a palavra `default` ao nome da seção. Por exemplo, uma seção `[ndbd]` contém parâmetros que se aplicam a um nó de dados específico, enquanto uma seção `[ndbd default]` contém parâmetros que se aplicam a todos os nós de dados. Suponha que todos os nós de dados devam usar o mesmo tamanho de memória de dados. Para configurá-los todos, crie uma seção `[ndbd default]` que contenha uma linha `DataMemory` para especificar o tamanho da memória de dados.

Se utilizado, a seção `[ndbd default]` deve preceder quaisquer seções `[ndbd]` no arquivo de configuração. Isso também é válido para as seções `default` de qualquer outro tipo.

Nota

Em algumas versões mais antigas do NDB Cluster, não havia um valor padrão para `NoOfReplicas`, que sempre precisava ser especificado explicitamente na seção `[ndbd default]`. Embora esse parâmetro agora tenha um valor padrão de 2, que é o ajuste recomendado na maioria dos cenários de uso comum, ainda é uma prática recomendada definir esse parâmetro explicitamente.

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

O exemplo anterior é destinado como uma configuração inicial mínima para fins de familiarização com o NDB Cluster e quase certamente não será suficiente para configurações de produção. Veja a Seção 25.4.3.2, “Configuração Inicial Recomendada para NDB Cluster”, que fornece uma configuração de inicialização mais completa.

Cada nó tem sua própria seção no arquivo `config.ini`. Por exemplo, este clúster tem dois nós de dados, então o arquivo de configuração anterior contém duas seções `[ndbd]` definindo esses nós.

Nota

Não coloque comentários na mesma linha que o cabeçalho de uma seção no arquivo `config.ini`; isso faz com que o servidor de gerenciamento não inicie, porque ele não consegue analisar o arquivo de configuração nesses casos.

##### Seções do arquivo config.ini

Existem seis seções diferentes que você pode usar no arquivo de configuração `config.ini`, conforme descrito na lista a seguir:

- `[computer]`: Define os hosts do cluster. Isso não é necessário para configurar um NDB Cluster viável, mas pode ser usado como uma conveniência ao configurar um grande cluster. Consulte a Seção 25.4.3.4, “Definindo Computadores em um NDB Cluster”, para obter mais informações.

- `[ndbd]`: Define um nó de dados do cluster (processo **ndbd**). Consulte a Seção 25.4.3.6, “Definindo Nodos de Dados do Cluster NDB”, para obter detalhes.

- `[mysqld]`: Define os nós do servidor MySQL do cluster (também chamados de nós SQL ou API). Para uma discussão sobre a configuração do nó SQL, consulte a Seção 25.4.3.7, “Definindo nós SQL e outros nós API em um NDB Cluster”.

- `[mgm]` ou `[ndb_mgmd]`: Define um nó do servidor de gerenciamento de clúster (MGM). Para obter informações sobre a configuração dos nós de gerenciamento, consulte a Seção 25.4.3.5, “Definindo um servidor de gerenciamento de clúster NDB”.

- `[tcp]`: Define uma conexão TCP/IP entre os nós do cluster, com TCP/IP sendo o protocolo de transporte padrão. Normalmente, as seções `[tcp]` ou `[tcp default]` não são necessárias para configurar um NDB Cluster, pois o cluster gerencia isso automaticamente; no entanto, pode ser necessário, em algumas situações, sobrescrever os padrões fornecidos pelo cluster. Consulte a Seção 25.4.3.10, “Conexões TCP/IP do NDB Cluster”, para obter informações sobre os parâmetros de configuração TCP/IP disponíveis e como usá-los. (Você também pode achar interessante a Seção 25.4.3.11, “Conexões TCP/IP do NDB Cluster Usando Conexões Direitas”, em alguns casos.)

- `[shm]`: Define conexões de memória compartilhada entre nós. No MySQL 8.0, elas estão habilitadas por padrão, mas ainda devem ser consideradas experimentais. Para uma discussão sobre as interconexões de memória compartilhada NDB, consulte a Seção 25.4.3.12, “Conexões de Memória Compartilhada de NDB Cluster”.

- `[sci]`: Define conexões de Interface Coerente Escalável entre nós de dados do cluster. Não é suportado no NDB 8.0.

Você pode definir os valores `default` para cada seção. Se usado, uma seção `default` deve vir antes de qualquer outra seção desse tipo. Por exemplo, uma seção `[ndbd default]` deve aparecer no arquivo de configuração antes de qualquer seção `[ndbd]`.

Os nomes dos parâmetros do cluster do NDB são case-insensitive, a menos que sejam especificados nos arquivos do MySQL Server `my.cnf` ou `my.ini`.
