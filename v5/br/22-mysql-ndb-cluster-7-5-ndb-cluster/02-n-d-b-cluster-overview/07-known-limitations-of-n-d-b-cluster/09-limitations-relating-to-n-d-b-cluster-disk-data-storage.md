#### 21.2.7.9 Limitações relacionadas ao armazenamento de dados do disco do cluster NDB

**Máximos e mínimos de objetos de dados de disco.** Os objetos de dados de disco estão sujeitos aos seguintes máximos e mínimos:

- Número máximo de espaços de tabela: 232 (4294967296)

- Número máximo de arquivos de dados por espaço de tabela: 216 (65536)

- Os tamanhos mínimos e máximos possíveis de extensões para arquivos de dados de espaço de tabela são, respectivamente, 32K e 2G. Consulte Seção 13.1.19, “Instrução CREATE TABLESPACE” para obter mais informações.

Além disso, ao trabalhar com tabelas de NDB Disk Data, você deve estar ciente dos seguintes problemas relacionados a arquivos de dados e extensões:

- Os arquivos de dados utilizam `DataMemory`. O uso é o mesmo que para dados em memória.

- Os arquivos de dados utilizam descritores de arquivo. É importante lembrar que os arquivos de dados estão sempre abertos, o que significa que os descritores de arquivo estão sempre em uso e não podem ser reutilizados para outras tarefas do sistema.

- Os extensões exigem memória `DiskPageBufferMemory` suficiente; você deve reservar espaço suficiente para este parâmetro para cobrir toda a memória usada por todas as extensões (número de extensões vezes o tamanho das extensões).

Tabelas de dados de disco e modo sem disco. O uso de tabelas de dados de disco não é suportado quando o clúster está em modo sem disco.
