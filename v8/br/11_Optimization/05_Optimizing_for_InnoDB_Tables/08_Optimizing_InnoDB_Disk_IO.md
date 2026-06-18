### 10.5.8 Otimizando o I/O de disco do InnoDB

Se você seguir as melhores práticas de design de banco de dados e técnicas de ajuste para operações SQL, mas seu banco de dados ainda estiver lento devido à alta atividade de E/S de disco, considere essas otimizações de E/S de disco. Se a ferramenta Unix `top` ou o Gerenciador de Tarefas do Windows mostrar que a porcentagem de uso da CPU com sua carga de trabalho é menor que 70%, sua carga de trabalho provavelmente está limitada ao disco.

- Aumente o tamanho do pool de buffer

  Quando os dados da tabela são armazenados em cache no pool de buffers `InnoDB`, eles podem ser acessados repetidamente por consultas sem exigir nenhum I/O de disco. Especifique o tamanho do pool de buffers com a opção `innodb_buffer_pool_size`. Essa área de memória é importante o suficiente para que, normalmente, seja recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75 por cento da memória do sistema. Para mais informações, consulte a Seção 10.12.3.1, “Como o MySQL Usa a Memória”.

- Ajuste o método de limpeza

  Em algumas versões do GNU/Linux e do Unix, o processo de gravação de arquivos no disco com a chamada Unix `fsync()` (que o `InnoDB` usa por padrão) e métodos semelhantes é surpreendentemente lento. Se o desempenho da escrita no banco de dados for um problema, realize benchmarks com o parâmetro `innodb_flush_method` definido como `O_DSYNC`.

- Configure um limiar para limpezas do sistema operacional

  Por padrão, quando o `InnoDB` cria um novo arquivo de dados, como um novo arquivo de log ou arquivo de espaço de tabelas, o arquivo é totalmente escrito no cache do sistema operacional antes de ser descarregado no disco, o que pode causar uma grande quantidade de atividade de escrita no disco de uma só vez. Para forçar limpezas periódicas e menores dos dados do cache do sistema operacional, você pode usar a variável `innodb_fsync_threshold` para definir um valor limite, em bytes. Quando o limite de bytes é atingido, o conteúdo do cache do sistema operacional é descarregado no disco. O valor padrão de 0 força o comportamento padrão, que é descarregar os dados no disco apenas após um arquivo ser totalmente escrito no cache.

  Especificar um limite para forçar limpezas periódicas menores pode ser benéfico em casos em que múltiplas instâncias do MySQL utilizam os mesmos dispositivos de armazenamento. Por exemplo, criar uma nova instância do MySQL e seus arquivos de dados associados pode causar grandes picos de atividade de escrita no disco, impedindo o desempenho de outras instâncias do MySQL que utilizam os mesmos dispositivos de armazenamento. Configurar um limite ajuda a evitar tais picos de atividade de escrita.

- Use fdatasync() em vez de fsync()

  Em plataformas que suportam chamadas de sistema `fdatasync()`, a variável `innodb_use_fdatasync`, introduzida no MySQL 8.0.26, permite usar `fdatasync()` em vez de `fsync()` para limpezas do sistema operacional. Uma chamada de sistema `fdatasync()` não limpa as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um potencial benefício de desempenho.

  Um subconjunto das configurações de `innodb_flush_method`, como `fsync`, `O_DSYNC` e `O_DIRECT`, utiliza chamadas de sistema `fsync()`. A variável `innodb_use_fdatasync` é aplicável ao usar essas configurações.

- Use um agendamento noop ou com prazo I/O com AIO nativo no Linux

  O `InnoDB` utiliza o subsistema de E/S assíncrona (AIO nativo) no Linux para realizar solicitações de leitura antecipada e escrita de páginas de arquivos de dados. Esse comportamento é controlado pela opção de configuração `innodb_use_native_aio`, que está habilitada por padrão. Com o AIO nativo, o tipo de agendador de E/S tem maior influência no desempenho de E/S. Geralmente, os agendadores de E/S noop e deadline são recomendados. Realize benchmarks para determinar qual agendador de E/S fornece os melhores resultados para sua carga de trabalho e ambiente. Para mais informações, consulte a Seção 17.8.6, “Usando E/S Assíncrona no Linux”.

- Uso de E/S direta no Solaris 10 para arquitetura x86\_64

  Ao usar o mecanismo de armazenamento `InnoDB` no Solaris 10 para a arquitetura x86\_64 (AMD Opteron), use a entrada/saída direta para arquivos relacionados a `InnoDB` para evitar a degradação do desempenho de `InnoDB`. Para usar a entrada/saída direta para um sistema de arquivos UFS inteiro usado para armazenar arquivos relacionados a `InnoDB`, monte-o com a opção `forcedirectio`; veja `mount_ufs(1M)`. (O padrão no Solaris 10/x86\_64 é *não* usar essa opção.) Para aplicar a entrada/saída direta apenas às operações de arquivo `InnoDB` em vez de todo o sistema de arquivos, defina `innodb_flush_method = O_DIRECT`. Com essa configuração, `InnoDB` chama `directio()` em vez de `fcntl()` para a entrada/saída de arquivos de dados (não para a entrada/saída de arquivos de log).

- Use armazenamento bruto para arquivos de dados e log com Solaris 2.6 ou posterior

  Ao usar o mecanismo de armazenamento `InnoDB` com um grande valor `innodb_buffer_pool_size` em qualquer versão do Solaris 2.6 e superior e em qualquer plataforma (sparc/x86/x64/amd64), realize benchmarks com arquivos de dados `InnoDB` e arquivos de log em dispositivos brutos ou em um sistema de arquivos UFS de I/O direto separado, usando a opção de montagem `forcedirectio` conforme descrito anteriormente. (É necessário usar a opção de montagem em vez de definir `innodb_flush_method` se você deseja I/O direto para os arquivos de log.) Os usuários do sistema de arquivos Veritas VxFS devem usar a opção de montagem `convosync=direct`.

  Não coloque outros arquivos de dados do MySQL, como os das tabelas `MyISAM`, em um sistema de arquivos de E/S direto. Os executáveis ou bibliotecas *não podem* ser colocados em um sistema de arquivos de E/S direto.

- Use dispositivos de armazenamento adicionais

  Dispositivos de armazenamento adicionais podem ser usados para configurar uma configuração RAID. Para informações relacionadas, consulte a Seção 10.12.1, “Otimização do I/O de Disco”.

  Alternativamente, os arquivos de dados e os arquivos de log do espaço de tabelas `InnoDB` podem ser colocados em discos físicos diferentes. Para obter mais informações, consulte as seções a seguir:

  - Seção 17.8.1, “Configuração de inicialização do InnoDB”
  - Seção 17.6.1.2, “Criando tabelas externamente”
  - Criando um Espaço de Tabelas Geral
  - Seção 17.6.1.4, “Mover ou Copiar Tabelas InnoDB”

- Considere o armazenamento não rotativo

  O armazenamento não rotativo geralmente oferece melhor desempenho para operações de E/S aleatórias; e o armazenamento rotativo para operações de E/S sequenciais. Ao distribuir dados e arquivos de log entre dispositivos de armazenamento rotativo e não rotativo, considere o tipo de operações de E/S que são predominantemente realizadas em cada arquivo.

  Arquivos orientados por E/S aleatórios geralmente incluem arquivos de dados de tabela por arquivo e arquivos de espaço de tabela geral, arquivos de espaço de tabela de desfazer e arquivos de espaço de tabela temporários. Arquivos orientados por E/S sequenciais incluem arquivos de espaço de sistema `InnoDB` (devido ao buffer de escrita dupla antes do MySQL 8.0.20 e à mudança de buffer), arquivos de escrita dupla introduzidos no MySQL 8.0.20 e arquivos de log, como arquivos de log binário e arquivos de log de refazer.

  Revise as configurações das seguintes opções de configuração ao usar armazenamento não rotacional:

  - `innodb_checksum_algorithm`

    A opção `crc32` utiliza um algoritmo de verificação de checksum mais rápido e é recomendada para sistemas de armazenamento rápidos.

  - `innodb_flush_neighbors`

    Otimiza as operações de entrada/saída para dispositivos de armazenamento rotativo. Desative-o para armazenamento não rotativo ou uma combinação de armazenamento rotativo e não rotativo. Ele está desativado por padrão.

  - `innodb_idle_flush_pct`

    Permite definir um limite para o esvaziamento da página durante períodos de inatividade, o que pode ajudar a prolongar a vida útil dos dispositivos de armazenamento não rotativos. Introduzido no MySQL 8.0.18.

  - `innodb_io_capacity`

    A configuração padrão de 200 é geralmente suficiente para um dispositivo de armazenamento não rotativo de menor custo. Para dispositivos de maior qualidade, com conexão em barramento, considere uma configuração mais alta, como 1000.

  - `innodb_io_capacity_max`

    O valor padrão de 2000 é destinado a cargas de trabalho que utilizam armazenamento não rotacional. Para um dispositivo de armazenamento não rotacional de alta qualidade, acoplado à barra, considere um valor mais alto, como 2500.

  - `innodb_log_compressed_pages`

    Se os registros de revisão estiverem em armazenamento não rotacional, considere desabilitar essa opção para reduzir o registro. Veja Desativar o registro de páginas compactadas.

  - `innodb_log_file_size` (desatualizado no MySQL 8.0.30)

    Se os registros de revisão estiverem em armazenamento não rotacional, configure esta opção para maximizar o cache e a combinação de escrita.

  - `innodb_redo_log_capacity`

    Se os registros de revisão estiverem em armazenamento não rotacional, configure esta opção para maximizar o cache e a combinação de escrita.

  - `innodb_page_size`

    Considere usar um tamanho de página que corresponda ao tamanho do setor interno do disco. Dispositivos SSD de geração anterior geralmente têm um tamanho de setor de 4 KB. Alguns dispositivos mais recentes têm um tamanho de setor de 16 KB. O tamanho de página padrão `InnoDB` é de 16 KB. Manter o tamanho de página próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

  - `binlog_row_image`

    Se os logs binários estiverem em armazenamento não rotativo e todas as tabelas tiverem chaves primárias, considere definir essa opção para `minimal` para reduzir o registro.

  - `innodb_doublewrite_pages`

    O valor padrão de 4 (copiado de `innodb_write_io_threads`) pode significar muitas operações fsync para operações de doublewrite. Considere aumentar o valor, que tem um valor padrão de 128 em vez de 4 a partir do MySQL 8.4.0.

    Nota

    Embora essa opção tenha sido introduzida no MySQL 8.0.20, seu comportamento era de 120 no MySQL 5.7. Essa mudança pode causar uma degradação do desempenho para algumas operações, como o uso de `ALTER` para reconstruir uma tabela com o algoritmo `INPLACE`.

  Certifique-se de que o suporte TRIM esteja habilitado no seu sistema operacional. Ele geralmente está habilitado por padrão.

- Aumente a capacidade de entrada/saída para evitar atrasos

  Se o desempenho cair periodicamente devido às operações de verificação `InnoDB`, considere aumentar o valor da opção de configuração `innodb_io_capacity`. Valores mais altos causam um esvaziamento mais frequente, evitando o acúmulo de trabalho que pode causar quedas no desempenho.

- Capacidade de E/S menor se o esvaziamento não ficar para trás

  Se o sistema não estiver atrasado com as operações de limpeza `InnoDB`, considere diminuir o valor da opção de configuração `innodb_io_capacity`. Normalmente, você mantém esse valor da opção o mais baixo possível, mas não tão baixo que cause quedas periódicas no desempenho, conforme mencionado na bala de canhão anterior. Em um cenário típico em que você poderia diminuir o valor da opção, você pode ver uma combinação como esta na saída do `SHOW ENGINE INNODB STATUS`:

  - A lista de histórico tem poucas entradas, abaixo de algumas mil.

  - Insira fusões de tampão perto das linhas inseridas.

  - As páginas modificadas no pool de buffer estão consistentemente abaixo do `innodb_max_dirty_pages_pct` do pool de buffer. (Meça em um momento em que o servidor não está realizando inserções em massa; é normal que a porcentagem de páginas modificadas aumente significativamente durante inserções em massa.)

  - `Log sequence number - Last checkpoint` está em menos de 7/8 ou, idealmente, menos de 6/8 do tamanho total dos arquivos de registro `InnoDB`.

- Armazenar os arquivos do espaço de tabela do sistema no dispositivo Fusion-io

  Você pode aproveitar uma otimização de E/S relacionada ao buffer de escrita dupla armazenando os arquivos que contêm a área de armazenamento de escrita dupla em dispositivos Fusion-io que suportam escritas atômicas. (Antes do MySQL 8.0.20, os arquivos de armazenamento de buffer de escrita dupla residiam nos arquivos de dados do espaço de tabela do sistema. A partir do MySQL 8.0.20, a área de armazenamento reside em arquivos de escrita dupla. Veja a Seção 17.6.4, “Buffer de Escrita Dupla”.) Quando os arquivos de área de armazenamento de escrita dupla são colocados em dispositivos Fusion-io que suportam escritas atômicas, o buffer de escrita dupla é desativado automaticamente e as escritas atômicas do Fusion-io são usadas para todos os arquivos de dados. Esta funcionalidade é suportada apenas em hardware Fusion-io e é habilitada apenas para o NVMFS Fusion-io no Linux. Para aproveitar ao máximo esta funcionalidade, é recomendado um ajuste `innodb_flush_method` de `O_DIRECT`.

  Nota

  Como o ajuste do buffer de escrita dupla é global, o buffer de escrita dupla também é desativado para arquivos de dados que não estão localizados no hardware Fusion-io.

- Desativar o registro de páginas compactadas

  Ao usar o recurso de compressão da tabela `InnoDB`, as imagens das páginas recompressas são escritas no log de refazer quando alterações são feitas nos dados comprimidos. Esse comportamento é controlado por `innodb_log_compressed_pages`, que é ativado por padrão para evitar corrupções que podem ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante a recuperação. Se você tem certeza de que a versão `zlib` não está sujeita a alterações, desative `innodb_log_compressed_pages` para reduzir a geração do log de refazer para cargas de trabalho que modificam dados comprimidos.
