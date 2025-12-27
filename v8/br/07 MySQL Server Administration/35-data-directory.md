## 7.2 O Diretório de Dados do MySQL

As informações gerenciadas pelo servidor MySQL são armazenadas em um diretório conhecido como diretório de dados. A lista a seguir descreve brevemente os itens normalmente encontrados no diretório de dados, com referências cruzadas para informações adicionais:

* Subdiretórios do diretório de dados. Cada subdiretório do diretório de dados é um diretório de banco de dados e corresponde a um banco de dados gerenciado pelo servidor. Todas as instalações do MySQL têm certos bancos de dados padrão:

  + O diretório `mysql` corresponde ao esquema `mysql` do sistema, que contém informações necessárias para o servidor MySQL conforme ele está em execução. Este banco de dados contém tabelas de dicionário de dados e tabelas de sistema. Consulte a Seção 7.3, “O Esquema de Sistema mysql”.
  + O diretório `performance_schema` corresponde ao Schema de Desempenho, que fornece informações usadas para inspecionar a execução interna do servidor em tempo de execução. Consulte o Capítulo 29, *MySQL Schema de Desempenho*.
  + O diretório `sys` corresponde ao esquema `sys`, que fornece um conjunto de objetos para ajudar a interpretar as informações do Schema de Desempenho mais facilmente. Consulte o Capítulo 30, *MySQL Schema de Sistema sys*.
  + O diretório `ndbinfo` corresponde ao banco de dados `ndbinfo` que armazena informações específicas do NDB Cluster (presentes apenas para instalações construídas para incluir o NDB Cluster). Consulte a Seção 25.6.15, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.

  Outros subdiretórios correspondem a bancos de dados criados por usuários ou aplicativos.

::: info Nota

`INFORMATION_SCHEMA` é um banco de dados padrão, mas sua implementação não usa um diretório de banco de dados correspondente.

* Arquivos de registro escritos pelo servidor. Consulte a Seção 7.4, “Logs do Servidor MySQL”.
* Espaço de tabela e arquivos de registro `InnoDB`. Consulte o Capítulo 17, *O Motor de Armazenamento InnoDB*.
* Arquivos de certificado e chave SSL e RSA gerados automaticamente. Consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.
* Arquivo do ID do processo do servidor (enquanto o servidor estiver em execução).
* O arquivo `mysqld-auto.cnf` que armazena as configurações persistentes das variáveis de sistema globais. Consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.
* Alguns itens na lista anterior podem ser realocados para outro local reconfigurando o servidor. Além disso, a opção `--datadir` permite alterar a localização do diretório de dados. Para uma instalação MySQL específica, verifique a configuração do servidor para determinar se os itens foram movidos.