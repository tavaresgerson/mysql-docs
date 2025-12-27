## 7.2 O Diretório de Dados do MySQL

As informações gerenciadas pelo servidor MySQL são armazenadas em um diretório conhecido como diretório de dados. A lista a seguir descreve brevemente os itens normalmente encontrados no diretório de dados, com referências cruzadas para informações adicionais:

* Subdiretórios do diretório de dados. Cada subdiretório do diretório de dados é um diretório de banco de dados e corresponde a um banco de dados gerenciado pelo servidor. Todas as instalações do MySQL têm certos bancos de dados padrão:

  + O diretório `mysql` corresponde ao esquema `mysql` do sistema, que contém informações necessárias para o servidor MySQL conforme ele está em execução. Este banco de dados contém tabelas de dicionário de dados e tabelas de sistema. Veja a Seção 7.3, “O Esquema de Sistema mysql”.

  + O diretório `performance_schema` corresponde ao Schema de Desempenho, que fornece informações usadas para inspecionar a execução interna do servidor em tempo de execução. Veja o Capítulo 29, *Schema de Desempenho do MySQL*.

  + O diretório `sys` corresponde ao esquema `sys`, que fornece um conjunto de objetos para ajudar a interpretar as informações do Schema de Desempenho de forma mais fácil. Veja o Capítulo 30, *Esquema de Sistema MySQL sys*.

  + O diretório `ndbinfo` corresponde ao banco de dados `ndbinfo` que armazena informações específicas para o NDB Cluster (presentes apenas para instalações construídas para incluir o NDB Cluster). Veja a Seção 25.6.15, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.

  Outros subdiretórios correspondem a bancos de dados criados por usuários ou aplicativos.

Nota

`INFORMATION_SCHEMA` é um banco de dados padrão, mas sua implementação não usa um diretório de banco de dados correspondente.

* Arquivos de log escritos pelo servidor. Veja a Seção 7.4, “Logs do Servidor MySQL”.

* Espaço de armazenamento e arquivos de log `InnoDB`. Veja o Capítulo 17, *O Motor de Armazenamento InnoDB*.

* Arquivos de certificado e chave SSL e RSA padrão/gerados automaticamente. Consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

* O arquivo do ID do processo do servidor (enquanto o servidor estiver em execução).
* O arquivo `mysqld-auto.cnf` que armazena as configurações persistentes de variáveis de sistema globais. Consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Alguns itens na lista anterior podem ser realocados para outro local ao reconfigurar o servidor. Além disso, a opção `--datadir` permite alterar a localização do próprio diretório de dados. Para uma instalação específica do MySQL, verifique a configuração do servidor para determinar se os itens foram movidos.