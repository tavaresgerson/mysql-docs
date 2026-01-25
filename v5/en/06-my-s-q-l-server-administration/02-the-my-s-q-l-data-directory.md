## 5.2 O Data Directory do MySQL

As informações gerenciadas pelo servidor MySQL são armazenadas em um diretório conhecido como *data directory*. A lista a seguir descreve brevemente os itens normalmente encontrados no *data directory*, com referências cruzadas para informações adicionais:

* Subdiretórios do *data directory*. Cada subdiretório do *data directory* é um diretório de Database e corresponde a um Database gerenciado pelo servidor. Todas as instalações MySQL possuem certos Databases padrão:

  + O diretório `mysql` corresponde ao Database de sistema `mysql`, que contém informações necessárias para o funcionamento do servidor MySQL. Consulte [Section 5.3, “The mysql System Database”](system-schema.html "5.3 The mysql System Database").

  + O diretório `performance_schema` corresponde ao Performance Schema, que fornece informações usadas para inspecionar a execução interna do servidor em tempo de execução (*runtime*). Consulte [Chapter 25, *MySQL Performance Schema*](performance-schema.html "Chapter 25 MySQL Performance Schema").

  + O diretório `sys` corresponde ao `sys` schema, que fornece um conjunto de objetos para ajudar a interpretar as informações do Performance Schema de forma mais fácil. Consulte [Chapter 26, *MySQL sys Schema*](sys-schema.html "Chapter 26 MySQL sys Schema").

  + O diretório `ndbinfo` corresponde ao Database `ndbinfo` que armazena informações específicas do NDB Cluster (presente apenas para instalações construídas para incluir o NDB Cluster). Consulte [Section 21.6.15, “ndbinfo: The NDB Cluster Information Database”](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").

  Outros subdiretórios correspondem a Databases criados por usuários ou aplicações.

  Nota

  [`INFORMATION_SCHEMA`](information-schema.html "Chapter 24 INFORMATION_SCHEMA Tables") é um Database padrão, mas sua implementação não utiliza um diretório de Database correspondente.

* Arquivos de Log escritos pelo servidor. Consulte [Section 5.4, “MySQL Server Logs”](server-logs.html "5.4 MySQL Server Logs").

* Tablespace e arquivos de Log do `InnoDB`. Consulte [Chapter 14, *The InnoDB Storage Engine*](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

* Arquivos de certificado e chave SSL e RSA padrão/autogerados. Consulte [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

* O arquivo de ID do processo do servidor (enquanto o servidor estiver em execução).

Alguns itens da lista anterior podem ser realocados para outro lugar por meio da reconfiguração do servidor. Além disso, a opção [`--datadir`](server-system-variables.html#sysvar_datadir) permite que a localização do *data directory* em si seja alterada. Para uma determinada instalação MySQL, verifique a configuração do servidor para determinar se os itens foram movidos.