### 10.5.8 Otimizando o I/O de Disco do InnoDB

Se você seguir as melhores práticas de design de banco de dados e técnicas de ajuste para operações SQL, mas ainda assim seu banco de dados estiver lento devido à alta atividade de I/O de disco, considere essas otimizações de I/O de disco. Se a ferramenta `top` do Unix ou o Gerenciador de Tarefas do Windows mostrar que a porcentagem de uso da CPU com sua carga de trabalho é menor que 70%, sua carga de trabalho provavelmente está limitada ao disco.

* Aumente o tamanho do pool de buffers

  Quando os dados da tabela são cacheados no pool de buffers do `InnoDB`, eles podem ser acessados repetidamente por consultas sem exigir nenhum I/O de disco. Especifique o tamanho do pool de buffers com a opção `innodb_buffer_pool_size`. Essa área de memória é importante o suficiente para que, normalmente, seja recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75% da memória do sistema. Para mais informações, consulte a Seção 10.12.3.1, “Como o MySQL Usa Memória”.
* Ajuste o método de varredura

  Em algumas versões do GNU/Linux e Unix, a varredura de arquivos para disco com a chamada `fsync()` do Unix e métodos semelhantes é surpreendentemente lenta. Se o desempenho da escrita no banco de dados for um problema, realize benchmarks com o parâmetro `innodb_flush_method` definido como `O_DSYNC`.
* Configure um limiar para varreduras do sistema operacional

  Por padrão, quando o `InnoDB` cria um novo arquivo de dados, como um novo arquivo de log ou arquivo de espaço de tabelas, o arquivo é completamente escrito na cache do sistema operacional antes de ser varrido para o disco, o que pode causar uma grande quantidade de atividade de escrita no disco de uma só vez. Para forçar varreduras menores e periódicas do cache do sistema operacional, você pode usar a variável `innodb_fsync_threshold` para definir um valor de limiar, em bytes. Quando o limiar de bytes é atingido, o conteúdo da cache do sistema operacional é varrido para o disco. O valor padrão de 0 força o comportamento padrão, que é varrer os dados para o disco apenas após um arquivo ser completamente escrito na cache.

Especificar um limite para forçar limpezas periódicas menores pode ser benéfico em casos em que múltiplas instâncias do MySQL utilizam os mesmos dispositivos de armazenamento. Por exemplo, criar uma nova instância do MySQL e seus arquivos de dados associados pode causar grandes picos de atividade de escrita no disco, impedindo o desempenho de outras instâncias do MySQL que utilizam os mesmos dispositivos de armazenamento. Configurar um limite ajuda a evitar tais picos de atividade de escrita.
* Use fdatasync() em vez de fsync()

  Em plataformas que suportam chamadas de sistema `fdatasync()`, a variável `innodb_use_fdatasync` permite usar `fdatasync()` em vez de `fsync()` para limpezas do sistema operacional. Uma chamada de sistema `fdatasync()` não limpa as alterações no metadados do arquivo a menos que seja necessário para a recuperação subsequente de dados, proporcionando um benefício potencial de desempenho.

  Um subconjunto das configurações de `innodb_flush_method`, como `fsync`, `O_DSYNC` e `O_DIRECT`, usa chamadas de sistema `fsync()`. A variável `innodb_use_fdatasync` é aplicável ao usar essas configurações.
* Use um agendamento de I/O noop ou deadline com AIO nativo no Linux

  O `InnoDB` usa o subsistema de I/O assíncrono (AIO nativo) no Linux para realizar solicitações de leitura à frente e escrita para páginas de arquivos de dados. Esse comportamento é controlado pela opção de configuração `innodb_use_native_aio`, que está habilitada por padrão. Com AIO nativo, o tipo de agendamento de I/O tem maior influência no desempenho de I/O. Geralmente, são recomendados agendamentos de I/O noop e deadline. Realize benchmarks para determinar qual agendamento de I/O fornece os melhores resultados para sua carga de trabalho e ambiente. Para mais informações, consulte a Seção 17.8.6, “Usando I/O Assíncrono no Linux”.
* Use I/O direto no Solaris 10 para arquitetura x86_64

Ao usar o mecanismo de armazenamento `InnoDB` no Solaris 10 para a arquitetura x86_64 (AMD Opteron), use o I/O direto para os arquivos relacionados ao `InnoDB` para evitar a degradação do desempenho do `InnoDB`. Para usar o I/O direto para todo o sistema de arquivos UFS usado para armazenar arquivos relacionados ao `InnoDB`, monte-o com a opção `forcedirectio`; consulte `mount_ufs(1M)`. (O padrão no Solaris 10/x86_64 *não* é usar essa opção.) Para aplicar o I/O direto apenas às operações de arquivo do `InnoDB`, em vez de todo o sistema de arquivos, defina `innodb_flush_method = O_DIRECT`. Com essa configuração, o `InnoDB` chama o `directio()` em vez do `fcntl()` para o I/O para arquivos de dados (não para o I/O para arquivos de log).
* Use armazenamento bruto para arquivos de dados e log com o Solaris 2.6 ou posterior

  Ao usar o mecanismo de armazenamento `InnoDB` com um grande valor de `innodb_buffer_pool_size` em qualquer versão do Solaris 2.6 e superior e em qualquer plataforma (sparc/x86/x64/amd64), realize benchmarks com arquivos de dados e arquivos de log do `InnoDB` em dispositivos brutos ou em um sistema de arquivos UFS de I/O direto separado, usando a opção de montagem `forcedirectio` conforme descrito anteriormente. (É necessário usar a opção de montagem em vez de definir `innodb_flush_method` se você deseja o I/O direto para os arquivos de log.) Usuários do sistema de arquivos VxFS da Veritas devem usar a opção de montagem `convosync=direct`.

  Não coloque outros arquivos de dados do MySQL, como os das tabelas do `MyISAM`, em um sistema de arquivos de I/O direto. Os executáveis ou bibliotecas *não* devem ser colocados em um sistema de arquivos de I/O direto.
* Use dispositivos de armazenamento adicionais

  Dispositivos de armazenamento adicionais podem ser usados para configurar uma configuração RAID. Para informações relacionadas, consulte a Seção 10.12.1, “Otimizando o I/O de disco”.

  Alternativamente, os arquivos de dados e arquivos de log do espaço de tabela do `InnoDB` podem ser colocados em discos físicos diferentes. Para mais informações, consulte as seções seguintes:

+ Seção 17.8.1, “Configuração de Inicialização do InnoDB”
+ Seção 17.6.1.2, “Criar Tabelas Externamente”
+ Criando um Espaço de Tabelas Geral
+ Seção 17.6.1.4, “Mover ou Copiar Tabelas InnoDB”
* Considere o armazenamento não rotativo

O armazenamento não rotativo geralmente oferece melhor desempenho para operações de E/S aleatórias; e o armazenamento rotativo para operações de E/S sequenciais. Ao distribuir dados e arquivos de log em dispositivos de armazenamento rotativo e não rotativo, considere o tipo de operações de E/S que são predominantemente realizadas em cada arquivo.

Arquivos orientados para E/S aleatória incluem tipicamente arquivos de dados de tabela por arquivo e espaço de tabelas geral, arquivos de espaço de undo e arquivos de espaço de temporário. Arquivos orientados para E/S sequencial incluem arquivos de espaço de sistema `InnoDB`, arquivos de escrita dupla e arquivos de log, como arquivos de log binário e arquivos de log de recuperação.

Revise as configurações das seguintes opções de configuração ao usar armazenamento não rotativo:

+ `innodb_checksum_algorithm`

A opção `crc32` usa um algoritmo de verificação de integridade mais rápido e é recomendada para sistemas de armazenamento rápidos.
+ `innodb_flush_neighbors`

Otimiza a E/S para dispositivos de armazenamento rotativo. Desative-o para armazenamento não rotativo ou uma mistura de armazenamento rotativo e não rotativo. Ele é desativado por padrão.
+ `innodb_idle_flush_pct`

Permite definir um limite para o esvaziamento de páginas durante períodos de inatividade, o que pode ajudar a prolongar a vida útil dos dispositivos de armazenamento não rotativo.
+ `innodb_io_capacity`

O ajuste padrão de 10000 é geralmente suficiente.
+ `innodb_io_capacity_max`

O valor padrão de (2 * `innodb_io_capacity`) é destinado à maioria dos trabalhos de carga.
+ `innodb_log_compressed_pages`

Se os logs de recuperação estiverem em armazenamento não rotativo, considere desativar essa opção para reduzir o registro. Veja Desativar o registro de páginas compactadas.
+ `innodb_log_file_size` (desatualizado)

Se os registros de revisão estiverem em armazenamento não rotativo, configure esta opção para maximizar o cache e a combinação de escrita.
  +  `innodb_redo_log_capacity`

Se os registros de revisão estiverem em armazenamento não rotativo, configure esta opção para maximizar o cache e a combinação de escrita.
  +  `innodb_page_size`

Considere usar um tamanho de página que corresponda ao tamanho do setor interno do disco. Dispositivos SSD de geração anterior geralmente têm um tamanho de setor de 4 KB. Alguns dispositivos mais recentes têm um tamanho de setor de 16 KB. O tamanho de página padrão do `InnoDB` é de 16 KB. Manter o tamanho de página próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.
  +  `binlog_row_image`

Se os logs binários estiverem em armazenamento não rotativo e todas as tabelas tiverem chaves primárias, considere definir esta opção para `minimal` para reduzir o registro.

Certifique-se de que o suporte ao TRIM esteja habilitado no seu sistema operacional. Ele geralmente está habilitado por padrão.
* Aumente a capacidade de I/O para evitar atrasos

Se o desempenho cair periodicamente devido às operações de verificação do `InnoDB`, considere aumentar o valor da opção de configuração `innodb_io_capacity`. Valores mais altos causam um esvaziamento mais frequente, evitando o atraso no trabalho que pode causar quedas no desempenho.
* Reduza a capacidade de I/O se o esvaziamento não ficar para trás

Se o sistema não estiver atrasado com as operações de esvaziamento do `InnoDB`, considere reduzir o valor da opção de configuração `innodb_io_capacity`. Normalmente, você mantém o valor desta opção o mais baixo possível, mas não tão baixo que cause quedas periódicas no desempenho, conforme mencionado na bala de canhão anterior. Em um cenário típico onde você poderia reduzir o valor da opção, você pode ver uma combinação como esta na saída do `SHOW ENGINE INNODB STATUS`:

+ A lista de histórico tem comprimento baixo, abaixo de alguns milhares.
+ Os buffers de inserção de páginas próximas às inseridas são mesclados.
+ As páginas modificadas no pool de buffer estão consistentemente abaixo de `innodb_max_dirty_pages_pct` do pool de buffer. (Meça em um momento em que o servidor não está realizando inserções em massa; é normal que o percentual de páginas modificadas aumente significativamente durante inserções em massa.)
+ O `Número de sequência do log - Último ponto de verificação` está em menos de 7/8 ou, idealmente, menos de 6/8 do tamanho total dos arquivos de log do `InnoDB`.
* Armazene os arquivos do espaço de tabela do sistema em dispositivos Fusion-io

  Você pode aproveitar a otimização de I/O relacionada ao buffer de dupla escrita armazenando os arquivos que contêm a área de armazenamento de dupla escrita em dispositivos Fusion-io que suportam escritas atômicas. (A área de armazenamento de buffer de dupla escrita reside em arquivos de dupla escrita. Veja a Seção 17.6.4, “Buffer de Dupla Escrita”.) Quando os arquivos de área de armazenamento de dupla escrita são colocados em dispositivos Fusion-io que suportam escritas atômicas, o buffer de dupla escrita é desativado automaticamente e as escritas atômicas do Fusion-io são usadas para todos os arquivos de dados. Esta funcionalidade é suportada apenas em hardware Fusion-io e é habilitada apenas para Fusion-io NVMFS no Linux. Para aproveitar ao máximo esta funcionalidade, é recomendado o ajuste `innodb_flush_method` de `O_DIRECT`.

  ::: info Nota

  Como o ajuste do buffer de dupla escrita é global, o buffer de dupla escrita também é desativado para arquivos de dados que não residem em hardware Fusion-io.

Ao usar o recurso de compressão de tabelas `InnoDB`, as imagens das páginas recompressas são escritas no log de refazer quando alterações são feitas em dados comprimidos. Esse comportamento é controlado por `innodb_log_compressed_pages`, que está habilitado por padrão para evitar corrupções que podem ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante a recuperação. Se você tem certeza de que a versão do `zlib` não está sujeita a alterações, desabilite `innodb_log_compressed_pages` para reduzir a geração do log de refazer para cargas de trabalho que modificam dados comprimidos.