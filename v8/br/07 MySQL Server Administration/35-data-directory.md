## 7.2 O Diretório de Dados MySQL

As informações gerenciadas pelo servidor MySQL são armazenadas em um diretório conhecido como diretório de dados. A lista a seguir descreve brevemente os itens normalmente encontrados no diretório de dados, com referências cruzadas para informações adicionais:

- Subdiretórios de diretório de dados. Cada subdiretório do diretório de dados é um diretório de banco de dados e corresponde a um banco de dados gerenciado pelo servidor. Todas as instalações do MySQL têm certos bancos de dados padrão:

  - O diretório `mysql` corresponde ao esquema do sistema `mysql`, que contém informações necessárias para o servidor MySQL ser executado. Este banco de dados contém tabelas de dicionário de dados e tabelas do sistema.
  - O diretório `performance_schema` corresponde ao Performance Schema, que fornece informações usadas para inspecionar a execução interna do servidor em tempo de execução. Veja Capítulo 29, *MySQL Performance Schema*.
  - O diretório `sys` corresponde ao esquema `sys`, que fornece um conjunto de objetos para ajudar a interpretar informações do esquema de desempenho com mais facilidade.
  - O diretório `ndbinfo` corresponde ao banco de dados `ndbinfo` que armazena informações específicas do Cluster NDB (presente apenas para instalações construídas para incluir o Cluster NDB).

  Outros subdiretórios correspondem a bases de dados criadas por utilizadores ou aplicações.

  ::: info Note

  `INFORMATION_SCHEMA` é um banco de dados padrão, mas sua implementação não usa diretório de banco de dados correspondente.

  :::
- Arquivos de log escritos pelo servidor. Ver Seção 7.4, "MySQL Server Logs".
- `InnoDB` arquivos de espaço de tabela e de log. Ver Capítulo 17, *The InnoDB Storage Engine*.
- Arquivos de chave e de certificado SSL e RSA padrão/auto-gerados. Ver Secção 8.3.3, "Criar certificados e chaves SSL e RSA".
- O ficheiro de ID do processo do servidor (enquanto o servidor está a ser executado).
- O arquivo `mysqld-auto.cnf` que armazena configurações de variáveis do sistema global persistentes. Ver Seção 15.7.6.1, Sintaxe SET para Atribuição de Variáveis.

Alguns itens na lista anterior podem ser realocados em outro lugar, reconfigurando o servidor. Além disso, a opção `--datadir` permite que a localização do próprio diretório de dados seja alterada. Para uma determinada instalação do MySQL, verifique a configuração do servidor para determinar se os itens foram movidos.
