## 7.2 O diretório de dados do MySQL

As informações gerenciadas pelo servidor MySQL são armazenadas em um diretório conhecido como diretório de dados. A lista a seguir descreve brevemente os itens que geralmente são encontrados no diretório de dados, com referências cruzadas para informações adicionais:

* Diretório de subdiretórios de dados. Cada subdiretório do diretório de dados é um diretório de banco de dados e corresponde a um banco de dados gerenciado pelo servidor. Todas as instalações do MySQL têm certos bancos de dados padrão:

+ O diretório `mysql` corresponde ao esquema de sistema `mysql`, que contém as informações necessárias para o servidor MySQL conforme ele é executado. Este banco de dados contém tabelas de dicionário de dados e tabelas de sistema. Veja a Seção 7.3, “O esquema de sistema mysql”.

+ O diretório `performance_schema` corresponde ao Schema de Desempenho, que fornece informações usadas para inspecionar a execução interna do servidor em tempo de execução. Veja o Capítulo 29, *Schema de Desempenho MySQL*.

+ O diretório `sys` corresponde ao esquema `sys`, que fornece um conjunto de objetos para ajudar a interpretar as informações do Performance Schema de forma mais fácil. Veja o Capítulo 30, *MySQL sys Schema*.

+ O diretório `ndbinfo` corresponde ao banco de dados `ndbinfo` que armazena informações específicas para o NDB Cluster (presente apenas em instalações construídas para incluir o NDB Cluster). Veja a Seção 25.6.16, “ndbinfo: O banco de dados de informações do NDB Cluster”.

Outros subdiretórios correspondem a bancos de dados criados por usuários ou aplicativos.

Nota

`INFORMATION_SCHEMA` é um banco de dados padrão, mas sua implementação não utiliza um diretório de banco de dados correspondente.

* Arquivos de registro escritos pelo servidor. Veja a Seção 7.4, “Logs do servidor MySQL”.

* `InnoDB` tablespace e arquivos de registro. Veja o Capítulo 17, *O Engenheiro de Armazenamento InnoDB*.

* Certificados SSL e RSA padrão/gerados automaticamente e arquivos de chave. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

* O arquivo de ID do processo do servidor (enquanto o servidor estiver em execução). * O arquivo `mysqld-auto.cnf` que armazena configurações persistentes de variáveis de sistema global. Veja a Seção 15.7.6.1, "Sintaxe de definição para atribuição de variáveis".

Alguns itens da lista anterior podem ser realocados para outro lugar, reconfigurando o servidor. Além disso, a opção `--datadir` permite que a localização do próprio diretório de dados seja alterada. Para uma instalação MySQL específica, verifique a configuração do servidor para determinar se os itens foram movidos.