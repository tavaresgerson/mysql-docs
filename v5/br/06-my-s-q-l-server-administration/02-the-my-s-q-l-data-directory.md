## 5.2 O Diretório de Dados MySQL

As informações gerenciadas pelo servidor MySQL são armazenadas em um diretório conhecido como diretório de dados. A lista a seguir descreve brevemente os itens normalmente encontrados no diretório de dados, com referências cruzadas para informações adicionais:

- Diretório de dados subdiretórios. Cada subdiretório do diretório de dados é um diretório de banco de dados e corresponde a um banco de dados gerenciado pelo servidor. Todas as instalações do MySQL têm certos bancos de dados padrão:

  - O diretório `mysql` corresponde ao banco de dados do sistema `mysql`, que contém as informações necessárias para o servidor MySQL funcionar. Veja Seção 5.3, “O Banco de Dados do Sistema mysql”.

  - O diretório `performance_schema` corresponde ao Schema de Desempenho, que fornece informações usadas para inspecionar a execução interna do servidor em tempo de execução. Veja Capítulo 25, *MySQL Performance Schema*.

  - O diretório `sys` corresponde ao esquema `sys`, que fornece um conjunto de objetos para ajudar a interpretar as informações do Schema de Performance Schema de forma mais fácil. Veja Capítulo 26, *Esquema sys do MySQL*.

  - O diretório `ndbinfo` corresponde ao banco de dados `ndbinfo`, que armazena informações específicas do NDB Cluster (presentes apenas em instalações construídas para incluir o NDB Cluster). Veja Seção 21.6.15, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.

  Outras subdiretórios correspondem a bancos de dados criados por usuários ou aplicativos.

  Nota

  `INFORMATION_SCHEMA` é um banco de dados padrão, mas sua implementação não utiliza um diretório de banco de dados correspondente.

- Arquivos de registro escritos pelo servidor. Consulte Seção 5.4, “Logs do Servidor MySQL”.

- Espaço de armazenamento e arquivos de log do banco de dados \`InnoDB. Consulte o \[Capítulo 14, *O motor de armazenamento InnoDB*] (innodb-storage-engine.html).

- Certificados e arquivos de chave SSL e RSA padrão/gerados automaticamente. Consulte Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”.

- O arquivo de ID do processo do servidor (enquanto o servidor estiver em execução).

Alguns itens da lista anterior podem ser realocados para outro local ao reconfigurar o servidor. Além disso, a opção `--datadir` permite alterar a localização do próprio diretório de dados. Para uma instalação específica do MySQL, verifique a configuração do servidor para determinar se os itens foram movidos.
