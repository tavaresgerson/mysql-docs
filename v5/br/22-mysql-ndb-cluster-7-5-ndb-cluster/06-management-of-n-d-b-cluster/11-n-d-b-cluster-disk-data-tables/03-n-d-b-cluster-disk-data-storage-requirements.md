#### 21.6.11.3 Requisitos de Armazenamento de Dados em Disco do NDB Cluster (Disk Data)

Os seguintes itens se aplicam aos requisitos de armazenamento Disk Data:

* Colunas de comprimento variável em tabelas Disk Data ocupam uma quantidade fixa de espaço. Para cada linha, isso é igual ao espaço necessário para armazenar o maior valor possível para aquela coluna.

  Para informações gerais sobre como calcular esses valores, consulte [Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”](storage-requirements.html "11.7 Data Type Storage Requirements").

  Você pode obter uma estimativa da quantidade de espaço disponível em arquivos de dados (data files) e arquivos de undo log (undo log files) consultando a tabela [\`FILES\`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do Information Schema. Para mais informações e exemplos, consulte [Seção 24.3.9, “A Tabela INFORMATION_SCHEMA FILES”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").

  Note

  O Statement [\`OPTIMIZE TABLE\`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") não tem qualquer efeito sobre tabelas Disk Data.

* Em uma tabela Disk Data, os primeiros 256 bytes de uma coluna [\`TEXT\`](blob.html "11.3.4 The BLOB and TEXT Types") ou [\`BLOB\`](blob.html "11.3.4 The BLOB and TEXT Types") são armazenados em memória; apenas o restante é armazenado em disco.

* Cada linha em uma tabela Disk Data usa 8 bytes na memória para apontar para os dados armazenados em disco. Isso significa que, em alguns casos, converter uma coluna armazenada em memória (in-memory) para o formato baseado em disco pode, na verdade, resultar em um uso maior de memória. Por exemplo, converter uma coluna `CHAR(4)` do formato baseado em memória para o formato baseado em disco aumenta a quantidade de [\`DataMemory\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) usada por linha de 4 para 8 bytes.

Important

Iniciar o cluster com a opção `--initial` *não* remove arquivos Disk Data. Você deve removê-los manualmente antes de realizar um reinício inicial do cluster.

O desempenho das tabelas Disk Data pode ser melhorado minimizando o número de buscas em disco (disk seeks), garantindo que o [\`DiskPageBufferMemory\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) tenha um tamanho suficiente. Você pode consultar a tabela [\`diskpagebuffer\`](mysql-cluster-ndbinfo-diskpagebuffer.html "21.6.15.20 The ndbinfo diskpagebuffer Table") para ajudar a determinar se o valor deste parâmetro precisa ser aumentado.