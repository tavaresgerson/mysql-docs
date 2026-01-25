### 8.5.8 Otimizando I/O de Disco do InnoDB

Se você seguir as melhores práticas para design de Database e técnicas de tuning para operações SQL, mas seu Database ainda estiver lento devido à intensa atividade de I/O de disco, considere estas otimizações de I/O de disco. Se a ferramenta `top` do Unix ou o Gerenciador de Tarefas do Windows mostrar que a porcentagem de uso da CPU com sua workload é inferior a 70%, sua workload está provavelmente limitada pelo disco (*disk-bound*).

* Aumentar o tamanho do Buffer Pool

  Quando os dados da tabela são armazenados em cache no `InnoDB` Buffer Pool, eles podem ser acessados repetidamente por Queries sem exigir I/O de disco. Especifique o tamanho do Buffer Pool com a opção `innodb_buffer_pool_size`. Esta área de memória é importante o suficiente para que geralmente seja recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75 por cento da memória do sistema. Para mais informações, consulte a Seção 8.12.4.1, “Como o MySQL Usa Memória”.

* Ajustar o método de Flush

  Em algumas versões do GNU/Linux e Unix, o *flushing* (descarga) de arquivos para o disco com a chamada `fsync()` do Unix (que o `InnoDB` usa por padrão) e métodos semelhantes é surpreendentemente lento. Se a performance de escrita do Database for um problema, realize benchmarks com o parâmetro `innodb_flush_method` definido como `O_DSYNC`.

* Usar um scheduler de I/O noop ou deadline com AIO nativo no Linux

  O `InnoDB` usa o subsistema de I/O assíncrono (AIO nativo) no Linux para executar requisições de *read-ahead* e de escrita para páginas de arquivos de dados. Este comportamento é controlado pela opção de configuração `innodb_use_native_aio`, que está habilitada por padrão. Com o AIO nativo, o tipo de *I/O scheduler* tem maior influência na performance de I/O. Geralmente, os *I/O schedulers* noop e deadline são recomendados. Realize benchmarks para determinar qual *I/O scheduler* fornece os melhores resultados para sua workload e ambiente. Para mais informações, consulte a Seção 14.8.7, “Usando I/O Assíncrono no Linux”.

* Usar Direct I/O no Solaris 10 para arquitetura x86_64

  Ao usar o storage engine `InnoDB` no Solaris 10 para arquitetura x86_64 (AMD Opteron), use Direct I/O para arquivos relacionados ao `InnoDB` para evitar a degradação da performance do `InnoDB`. Para usar Direct I/O para um sistema de arquivos UFS inteiro usado para armazenar arquivos relacionados ao `InnoDB`, monte-o com a opção `forcedirectio`; consulte `mount_ufs(1M)`. (O padrão no Solaris 10/x86_64 é *não* usar esta opção.) Para aplicar Direct I/O apenas às operações de arquivo do `InnoDB`, e não a todo o sistema de arquivos, defina `innodb_flush_method = O_DIRECT`. Com esta configuração, o `InnoDB` chama `directio()` em vez de `fcntl()` para I/O em arquivos de dados (não para I/O em arquivos de Log).

* Usar armazenamento *Raw* para arquivos de dados e Log no Solaris 2.6 ou posterior

  Ao usar o storage engine `InnoDB` com um valor grande de `innodb_buffer_pool_size` em qualquer release do Solaris 2.6 ou superior e em qualquer plataforma (sparc/x86/x64/amd64), realize benchmarks com arquivos de dados e arquivos de Log do `InnoDB` em dispositivos *raw* (brutos) ou em um sistema de arquivos UFS separado com Direct I/O, usando a opção de mount `forcedirectio`, conforme descrito anteriormente. (É necessário usar a opção de mount em vez de configurar `innodb_flush_method` se você quiser Direct I/O para os arquivos de Log.) Usuários do sistema de arquivos Veritas VxFS devem usar a opção de mount `convosync=direct`.

  Não coloque outros arquivos de dados do MySQL, como aqueles para tabelas `MyISAM`, em um sistema de arquivos Direct I/O. Executáveis ou bibliotecas *não devem* ser colocados em um sistema de arquivos Direct I/O.

* Usar dispositivos de armazenamento adicionais

  Dispositivos de armazenamento adicionais podem ser usados para configurar uma configuração RAID. Para informações relacionadas, consulte a Seção 8.12.2, “Otimizando I/O de Disco”.

  Alternativamente, arquivos de dados de Tablespace do `InnoDB` e arquivos de Log podem ser colocados em discos físicos diferentes. Para mais informações, consulte as seguintes seções:

  + Seção 14.8.1, “Configuração de Inicialização do InnoDB”
  + Seção 14.6.1.2, “Criando Tabelas Externamente”
  + Criando um Tablespace Geral
  + Seção 14.6.1.4, “Movendo ou Copiando Tabelas InnoDB”

* Considerar armazenamento não rotacional

  O armazenamento não rotacional geralmente oferece melhor performance para operações de I/O aleatório; e o armazenamento rotacional para operações de I/O sequencial. Ao distribuir arquivos de dados e Log por dispositivos de armazenamento rotacionais e não rotacionais, considere o tipo de operações de I/O predominantemente executadas em cada arquivo.

  Arquivos orientados a I/O aleatório tipicamente incluem arquivos de dados de Tablespace *file-per-table* e geral, arquivos de Tablespace de *undo*, e arquivos de Tablespace temporários. Arquivos orientados a I/O sequencial incluem arquivos de Tablespace do sistema `InnoDB` (devido a *doublewrite buffering* e *change buffering*) e arquivos de Log, como arquivos de *binary log* e *redo log*.

  Revise as configurações para as seguintes opções de configuração ao usar armazenamento não rotacional:

  + `innodb_checksum_algorithm`

    A opção `crc32` usa um algoritmo de checksum mais rápido e é recomendada para sistemas de armazenamento rápidos.

  + `innodb_flush_neighbors`

    Otimiza I/O para dispositivos de armazenamento rotacionais. Desabilite-o para armazenamento não rotacional ou uma mistura de armazenamento rotacional e não rotacional.

  + `innodb_io_capacity`

    A configuração padrão de 200 é geralmente suficiente para um dispositivo de armazenamento não rotacional de baixo custo. Para dispositivos de alto desempenho anexados via *bus*, considere uma configuração mais alta, como 1000.

  + `innodb_io_capacity_max`

    O valor padrão de 2000 é destinado a workloads que usam armazenamento não rotacional. Para um dispositivo de armazenamento não rotacional de alto desempenho anexado via *bus*, considere uma configuração mais alta, como 2500.

  + `innodb_log_compressed_pages`

    Se os *redo logs* estiverem em armazenamento não rotacional, considere desabilitar esta opção para reduzir o *logging*. Consulte Desabilitar o logging de páginas compactadas.

  + `innodb_log_file_size`

    Se os *redo logs* estiverem em armazenamento não rotacional, configure esta opção para maximizar o *caching* e o *write combining*.

  + `innodb_page_size`

    Considere usar um *page size* que corresponda ao tamanho interno do setor do disco. Dispositivos SSD de primeira geração geralmente têm um tamanho de setor de 4KB. Alguns dispositivos mais novos têm um tamanho de setor de 16KB. O *page size* padrão do `InnoDB` é 16KB. Manter o *page size* próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados inalterados que são reescritos no disco.

  + `binlog_row_image`

    Se os *binary logs* estiverem em armazenamento não rotacional e todas as tabelas tiverem Primary Keys, considere definir esta opção como `minimal` para reduzir o *logging*.

  Certifique-se de que o suporte a TRIM esteja habilitado para o seu sistema operacional. Geralmente, ele é habilitado por padrão.

* Aumentar a capacidade de I/O para evitar acúmulos (*backlogs*)

  Se o *throughput* cair periodicamente devido a operações de Checkpoint do `InnoDB`, considere aumentar o valor da opção de configuração `innodb_io_capacity`. Valores mais altos causam *flushing* mais frequente, evitando o acúmulo de trabalho que pode causar quedas no *throughput*.

* Reduzir a capacidade de I/O se o flushing não estiver atrasado

  Se o sistema não estiver atrasando as operações de *flushing* do `InnoDB`, considere diminuir o valor da opção de configuração `innodb_io_capacity`. Normalmente, você mantém o valor desta opção o mais baixo possível na prática, mas não tão baixo a ponto de causar quedas periódicas no *throughput*, conforme mencionado no item anterior. Em um cenário típico em que você poderia diminuir o valor da opção, você pode ver uma combinação como esta na saída de `SHOW ENGINE INNODB STATUS`:

  + O tamanho da lista de histórico (*History list length*) é baixo, abaixo de alguns milhares.
  + As *merges* do *Insert Buffer* estão próximas ao número de linhas inseridas.
  + As páginas modificadas no Buffer Pool estão consistentemente bem abaixo de `innodb_max_dirty_pages_pct` do Buffer Pool. (Meça em um momento em que o servidor não esteja fazendo *bulk inserts*; é normal que a porcentagem de páginas modificadas aumente significativamente durante *bulk inserts*.)
  + `Log sequence number - Last checkpoint` está em menos de 7/8 ou, idealmente, menos de 6/8 do tamanho total dos arquivos de Log do `InnoDB`.

* Armazenar arquivos de Tablespace do sistema em dispositivos Fusion-io

  Você pode aproveitar uma otimização de I/O relacionada ao *doublewrite buffer* armazenando arquivos de Tablespace do sistema (“arquivos ibdata”) em dispositivos Fusion-io que suportam escritas atômicas (*atomic writes*). Neste caso, o *doublewrite buffering* (`innodb_doublewrite`) é automaticamente desabilitado e as escritas atômicas Fusion-io são usadas para todos os arquivos de dados. Este recurso é suportado apenas em hardware Fusion-io e está habilitado somente para Fusion-io NVMFS no Linux. Para tirar o máximo proveito deste recurso, é recomendada uma configuração de `innodb_flush_method` como `O_DIRECT`.

  Note

  Como a configuração do *doublewrite buffer* é global, o *doublewrite buffering* também é desabilitado para arquivos de dados que residem em hardware que não seja Fusion-io.

* Desabilitar o logging de páginas compactadas

  Ao usar o recurso de compressão de tabela do `InnoDB`, imagens de páginas recompactadas são escritas no *redo log* quando alterações são feitas em dados compactados. Este comportamento é controlado por `innodb_log_compressed_pages`, que é habilitado por padrão para prevenir corrupção que pode ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante a recuperação (*recovery*). Se você tiver certeza de que a versão `zlib` não está sujeita a alterações, desabilite `innodb_log_compressed_pages` para reduzir a geração de *redo log* para workloads que modificam dados compactados.
