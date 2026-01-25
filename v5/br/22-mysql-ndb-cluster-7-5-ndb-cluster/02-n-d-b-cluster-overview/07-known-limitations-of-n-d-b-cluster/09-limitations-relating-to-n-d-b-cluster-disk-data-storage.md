#### 21.2.7.9 Limitações Relacionadas ao Armazenamento Disk Data do NDB Cluster

**Máximos e mínimos de objetos Disk Data.** Objetos Disk Data estão sujeitos aos seguintes valores máximos e mínimos:

* Número máximo de tablespaces: 232 (4294967296)

* Número máximo de arquivos de dados por tablespace: 216 (65536)

* Os tamanhos mínimo e máximo possíveis de extents para arquivos de dados de tablespace são 32K e 2G, respectivamente. Consulte [Seção 13.1.19, “Instrução CREATE TABLESPACE”](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement"), para mais informações.

Além disso, ao trabalhar com tabelas NDB Disk Data, você deve estar ciente das seguintes questões relativas a arquivos de dados e extents:

* Arquivos de dados usam [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). O uso é o mesmo que para dados em memória (*in-memory*).

* Arquivos de dados usam file descriptors. É importante ter em mente que os arquivos de dados estão sempre abertos, o que significa que os file descriptors estão sempre em uso e não podem ser reutilizados para outras tarefas do sistema.

* Extents requerem `DiskPageBufferMemory` suficiente; você deve reservar o bastante para este parâmetro para contabilizar toda a memória utilizada por todos os extents (número de extents vezes tamanho dos extents).

**Tabelas Disk Data e modo diskless.** O uso de tabelas Disk Data não é suportado ao executar o cluster em modo diskless.