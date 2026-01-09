### 25.6.11 Tabelas de Dados de Disco do NDB Cluster

25.6.11.1 Objetos de Dados de Disco do NDB Cluster

25.6.11.2 Requisitos de Armazenamento de Dados de Disco do NDB Cluster

O NDB Cluster suporta o armazenamento de colunas não indexadas de tabelas `NDB` no disco, em vez de na RAM. Os dados das colunas e os metadados de registro são mantidos em arquivos de dados e arquivos de log de desfazer, concebidos como espaços de tabelas e grupos de arquivos de log, conforme descrito na próxima seção—veja a Seção 25.6.11.1, “Objetos de Dados de Disco do NDB Cluster”.

O desempenho dos dados de disco do NDB Cluster pode ser influenciado por vários parâmetros de configuração. Para obter informações sobre esses parâmetros e seus efeitos, consulte Parâmetros de Configuração de Arquivos de Dados e Erros de Parâmetros de Latência de Arquivos de Dados e GCP.

Você também deve definir o parâmetro de configuração do nó de dados `DiskDataUsingSameDisk` para `false` ao usar discos separados para arquivos de dados de disco.

Para mais informações, consulte o seguinte:

* Parâmetros do sistema de arquivos de arquivos de dados de disco.
* Parâmetros de latência de dados de disco
* Seção 25.6.15.32, “A Tabela ndbinfo diskstat”
* Seção 25.6.15.33, “A Tabela ndbinfo diskstats_1sec”
* Seção 25.6.15.50, “A Tabela ndbinfo pgman_time_track_stats”