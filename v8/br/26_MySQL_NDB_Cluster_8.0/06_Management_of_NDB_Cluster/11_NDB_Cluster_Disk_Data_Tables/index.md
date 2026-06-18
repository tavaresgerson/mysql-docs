### 25.6.11 Tabelas de dados de disco do cluster do NDB

25.6.11.1 Objetos de dados de disco do cluster NDB

25.6.11.2 Requisitos de armazenamento de dados do disco do cluster do NDB

O NDB Cluster suporta o armazenamento de colunas não indexadas das tabelas `NDB` no disco, em vez de na RAM. Os dados das colunas e os metadados de registro são mantidos em arquivos de dados e arquivos de log de desfazer, conceituados como espaços de tabelas e grupos de arquivos de log, conforme descrito na próxima seção — consulte a Seção 25.6.11.1, “Objetos de Dados de Disco do NDB Cluster”.

O desempenho dos discos de cluster do NDB pode ser influenciado por vários parâmetros de configuração. Para obter informações sobre esses parâmetros e seus efeitos, consulte Parâmetros de Configuração de Dados de Disco e Erros de Parada de Dados e GCP.

Você também deve definir o parâmetro de configuração do nó de dados `DiskDataUsingSameDisk` para `false` ao usar discos separados para arquivos de dados de disco.

Veja também os parâmetros do sistema de arquivos de dados de disco.

O NDB 8.0 oferece suporte aprimorado ao usar tabelas de Dados de Disco com unidades de estado sólido, especialmente aquelas que utilizam NVMe. Consulte a documentação a seguir para obter mais informações:

- Parâmetros de latência de dados do disco
- Seção 25.6.16.31, “Tabela ndbinfo diskstat”
- Seção 25.6.16.32, “A tabela ndbinfo diskstats\_1sec”
- Seção 25.6.16.49, “A tabela ndbinfo pgman\_time\_track\_stats”
