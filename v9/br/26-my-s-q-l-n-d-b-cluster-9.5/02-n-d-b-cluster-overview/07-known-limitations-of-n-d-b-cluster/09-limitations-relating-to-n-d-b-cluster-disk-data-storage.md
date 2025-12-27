#### 25.2.7.9 Limitações relacionadas ao armazenamento de dados de disco do NDB Cluster

**Máximos e mínimos de objetos de dados de disco.** Os objetos de dados de disco estão sujeitos aos seguintes máximos e mínimos:

* Número máximo de espaços de tabelas: 232 (4294967296)

* Número máximo de arquivos de dados por espaço de tabela: 216 (65536)

* Os tamanhos mínimos e máximos possíveis de extensões para arquivos de dados de espaço de tabela são de 32K e 2G, respectivamente. Consulte a Seção 15.1.25, “Instrução CREATE TABLESPACE”, para obter mais informações.

Além disso, ao trabalhar com tabelas de NDB Disk Data, você deve estar ciente dos seguintes problemas relacionados a arquivos de dados e extensões:

* Arquivos de dados usam `DataMemory`. O uso é o mesmo que para dados em memória.

* Arquivos de dados usam descritores de arquivo. É importante ter em mente que os arquivos de dados estão sempre abertos, o que significa que os descritores de arquivo estão sempre em uso e não podem ser reutilizados para outras tarefas do sistema.

* As extensões requerem `DiskPageBufferMemory` suficiente; você deve reservar o suficiente para este parâmetro para contabilizar toda a memória usada por todas as extensões (número de extensões vezes o tamanho das extensões).

**Tabelas de dados de disco e modo sem disco.** O uso de tabelas de Dados de Disco não é suportado quando o cluster está em modo sem disco.