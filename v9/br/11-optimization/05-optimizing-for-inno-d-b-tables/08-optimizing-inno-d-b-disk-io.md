### 10.5.8 Otimização do I/O de Disco do InnoDB

Se você seguir as melhores práticas de design de banco de dados e técnicas de ajuste para operações SQL, mas ainda assim o banco de dados estiver lento devido à alta atividade de I/O de disco, considere essas otimizações de I/O de disco. Se a ferramenta `top` do Unix ou o Gerenciador de Tarefas do Windows mostrar que a porcentagem de uso da CPU com sua carga de trabalho é menor que 70%, sua carga de trabalho provavelmente está limitada ao disco.

* Aumente o tamanho do pool de buffers

  Quando os dados da tabela são cacheados no pool de buffers do `InnoDB`, eles podem ser acessados repetidamente por consultas sem exigir nenhum I/O de disco. Especifique o tamanho do pool de buffers com a opção `innodb_buffer_pool_size`. Essa área de memória é importante o suficiente para que, normalmente, seja recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75% da memória do sistema. Para mais informações, consulte a Seção 10.12.3.1, “Como o MySQL Usa Memória”.

* Ajuste o método de varredura

  Em algumas versões do GNU/Linux e Unix, a varredura de arquivos para disco com a chamada `fsync()` do Unix e métodos semelhantes é surpreendentemente lenta. Se o desempenho da escrita do banco de dados for um problema, realize benchmarks com o parâmetro `innodb_flush_method` definido como `O_DSYNC`.

* Configure um limiar para varreduras do sistema operacional

Por padrão, quando o `InnoDB` cria um novo arquivo de dados, como um novo arquivo de log ou arquivo de espaço de tabelas, o arquivo é totalmente escrito no cache do sistema operacional antes de ser descarregado no disco, o que pode causar uma grande quantidade de atividade de escrita no disco de uma só vez. Para forçar limpezas periódicas e menores do cache do sistema operacional, você pode usar a variável `innodb_fsync_threshold` para definir um valor limite, em bytes. Quando o limite de bytes é atingido, o conteúdo do cache do sistema operacional é descarregado no disco. O valor padrão de 0 força o comportamento padrão, que é descarregar os dados no disco apenas após um arquivo ser totalmente escrito no cache.

Especificar um limite para forçar limpezas periódicas e menores pode ser benéfico em casos em que múltiplas instâncias do MySQL usam os mesmos dispositivos de armazenamento. Por exemplo, criar uma nova instância do MySQL e seus arquivos de dados associados pode causar grandes surtos de atividade de escrita no disco, impedindo o desempenho de outras instâncias do MySQL que usam os mesmos dispositivos de armazenamento. Configurar um limite ajuda a evitar tais surtos de atividade de escrita.

* Use fdatasync() em vez de fsync()

  Em plataformas que suportam chamadas de sistema `fdatasync()`, a variável `innodb_use_fdatasync` permite usar `fdatasync()` em vez de `fsync()` para limpezas do sistema operacional. Uma chamada de sistema `fdatasync()` não descarrega as alterações no metadados do arquivo a menos que seja necessário para a recuperação subsequente de dados, proporcionando um benefício potencial de desempenho.

  Um subconjunto das configurações de `innodb_flush_method`, como `fsync`, `O_DSYNC` e `O_DIRECT`, usa chamadas de sistema `fsync()`. A variável `innodb_use_fdatasync` é aplicável ao usar essas configurações.

* Use um agendador de I/O noop ou deadline com AIO nativo no Linux

`InnoDB` usa o subsistema de E/S assíncrona (AIO nativo) no Linux para realizar solicitações de leitura à frente e escrita de páginas de arquivos de dados. Esse comportamento é controlado pela opção de configuração `innodb_use_native_aio`, que está habilitada por padrão. Com o AIO nativo, o tipo de agendador de E/S tem maior influência no desempenho da E/S. Geralmente, os agendadores de E/S noop e deadline são recomendados. Realize benchmarks para determinar qual agendador de E/S fornece os melhores resultados para sua carga de trabalho e ambiente. Para mais informações, consulte a Seção 17.8.6, “Usando E/S Assíncrona no Linux”.

* Use E/S direta no Solaris 10 para arquitetura x86_64

  Ao usar o mecanismo de armazenamento `InnoDB` no Solaris 10 para arquitetura x86_64 (AMD Opteron), use E/S direta para arquivos relacionados ao `InnoDB` para evitar a degradação do desempenho do `InnoDB`. Para usar E/S direta para um sistema de arquivos UFS inteiro usado para armazenar arquivos relacionados ao `InnoDB`, monte-o com a opção `forcedirectio`; consulte `mount_ufs(1M)`. (O padrão no Solaris 10/x86_64 não é usar essa opção.) Para aplicar E/S direta apenas às operações de arquivo do `InnoDB` em vez de todo o sistema de arquivos, defina `innodb_flush_method = O_DIRECT`. Com essa configuração, o `InnoDB` chama `directio()` em vez de `fcntl()` para E/S de arquivos de dados (não para E/S de arquivos de log).

* Use armazenamento bruto para arquivos de dados e log com o Solaris 2.6 ou posterior

Ao usar o mecanismo de armazenamento `InnoDB` com um valor grande de `innodb_buffer_pool_size` em qualquer versão do Solaris 2.6 e superior e em qualquer plataforma (sparc/x86/x64/amd64), realize benchmarks com arquivos de dados e arquivos de log do `InnoDB` em dispositivos brutos ou em um sistema de arquivos UFS de I/O direto separado, usando a opção de montagem `forcedirectio` conforme descrito anteriormente. (É necessário usar a opção de montagem em vez de definir `innodb_flush_method` se você deseja I/O direto para os arquivos de log.) Usuários do sistema de arquivos Veritas VxFS devem usar a opção de montagem `convosync=direct`.

Não coloque outros arquivos de dados do MySQL, como os das tabelas `MyISAM`, em um sistema de arquivos de I/O direto. Os executáveis ou bibliotecas *não devem* ser colocados em um sistema de arquivos de I/O direto.

* Use dispositivos de armazenamento adicionais

Dispositivos de armazenamento adicionais podem ser usados para configurar uma configuração RAID. Para informações relacionadas, consulte a Seção 10.12.1, “Otimizando o I/O de Disco”.

Alternativamente, os arquivos de dados e os arquivos de log do espaço de tabela do `InnoDB` podem ser colocados em discos físicos diferentes. Para mais informações, consulte as seguintes seções:

+ Seção 17.8.1, “Configuração de Inicialização do InnoDB”
+ Seção 17.6.1.2, “Criando Tabelas Externamente”
+ Criando um Espaço de Tabelas Geral
+ Seção 17.6.1.4, “Movendo ou Copiando Tabelas InnoDB”
* Considere o armazenamento não rotativo

O armazenamento não rotativo geralmente oferece melhor desempenho para operações de I/O aleatórias; e armazenamento rotativo para operações de I/O sequenciais. Ao distribuir dados e arquivos de log entre dispositivos de armazenamento rotativo e não rotativo, considere o tipo de operações de I/O que são predominantemente realizadas em cada arquivo.

Arquivos orientados por E/S aleatórios geralmente incluem arquivos de dados de espaço de tabela por arquivo e arquivos de espaço de tabela geral, arquivos de espaço de tabela de desfazer e arquivos de espaço de tabela temporários. Arquivos orientados por E/S sequencial incluem arquivos de espaço de sistema `InnoDB`, arquivos de escrita dupla e arquivos de log, como arquivos de log binário e arquivos de log de refazer.

Revise as configurações das seguintes opções de configuração ao usar armazenamento não rotacional:

+ `innodb_checksum_algorithm`

A opção `crc32` usa um algoritmo de verificação de integridade mais rápido e é recomendada para sistemas de armazenamento rápidos.

+ `innodb_flush_neighbors`

Otimiza o E/S para dispositivos de armazenamento rotacional. Desative-o para armazenamento não rotacional ou uma mistura de armazenamento rotacional e não rotacional. Ele está desativado por padrão.

+ `innodb_idle_flush_pct`

Permite definir um limite para o esvaziamento de páginas durante períodos de inatividade, o que pode ajudar a prolongar a vida útil dos dispositivos de armazenamento não rotacional.

+ `innodb_io_capacity`

O valor padrão de 10000 é geralmente suficiente.

+ `innodb_io_capacity_max`

O valor padrão de (2 * `innodb_io_capacity`) é destinado à maioria dos trabalhos de carga.

+ `innodb_log_compressed_pages`

Se os logs de refazer estiverem em armazenamento não rotacional, considere desativar essa opção para reduzir o registro. Veja Desativar o registro de páginas compactadas.

+ `innodb_redo_log_capacity`

Se os logs de refazer estiverem em armazenamento não rotacional, configure essa opção para maximizar o cache e a combinação de escrita.

+ `innodb_page_size`

Considere usar um tamanho de página que corresponda ao tamanho do setor interno do disco. Dispositivos SSD de geração anterior geralmente têm um tamanho de setor de 4 KB. Alguns dispositivos mais recentes têm um tamanho de setor de 16 KB. O tamanho de página padrão do `InnoDB` é de 16 KB. Manter o tamanho da página próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

+ `binlog_row_image`

    Se os logs binários estiverem em armazenamento não rotacional e todas as tabelas tiverem chaves primárias, considere definir essa opção para `minimal` para reduzir o registro.

  Certifique-se de que o suporte ao TRIM esteja habilitado no seu sistema operacional. Ele geralmente está habilitado por padrão.

* Aumente a capacidade de I/O para evitar atrasos

  Se o desempenho cair periodicamente devido às operações de verificação `InnoDB`, considere aumentar o valor da opção de configuração `innodb_io_capacity`. Valores mais altos causam um esvaziamento mais frequente, evitando o acúmulo de trabalho que pode causar quedas no desempenho.

* Reduza a capacidade de I/O se o esvaziamento não ficar para trás

  Se o sistema não estiver ficando para trás com as operações de esvaziamento `InnoDB`, considere reduzir o valor da opção de configuração `innodb_io_capacity`. Normalmente, você mantém o valor dessa opção o mais baixo possível, mas não tão baixo que cause quedas periódicas no desempenho, conforme mencionado na bala de canhão anterior. Em um cenário típico em que você poderia reduzir o valor da opção, você pode ver uma combinação como esta na saída do `SHOW ENGINE INNODB STATUS`:

  + O comprimento da lista de histórico é baixo, abaixo de alguns milhares.
  + Os fusos de buffer de inserção estão próximos das linhas inseridas.
  + As páginas modificadas no pool de buffer estão consistentemente muito abaixo de `innodb_max_dirty_pages_pct` do pool de buffer. (Meça em um momento em que o servidor não está realizando inserções em massa; é normal durante inserções em massa que o percentual de páginas modificadas aumente significativamente.)

  + `Número de sequência do log - Última verificação` está em menos de 7/8 ou idealmente menos de 6/8 do tamanho total dos arquivos de log `InnoDB`.

Você pode aproveitar uma otimização de E/S relacionada ao buffer de escrita dupla armazenando os arquivos que contêm a área de armazenamento de escrita dupla em dispositivos Fusion-io que suportam escritas atômicas. (A área de armazenamento do buffer de escrita dupla reside em arquivos de escrita dupla. Veja a Seção 17.6.4, “Buffer de Escrita Dupla”.) Quando os arquivos da área de armazenamento de escrita dupla são colocados em dispositivos Fusion-io que suportam escritas atômicas, o buffer de escrita dupla é desativado automaticamente e as escritas atômicas do Fusion-io são usadas para todos os arquivos de dados. Esta funcionalidade é suportada apenas em hardware Fusion-io e é habilitada apenas para Fusion-io NVMFS no Linux. Para aproveitar ao máximo esta funcionalidade, é recomendado o ajuste `innodb_flush_method` de `O_DIRECT`.

Nota

Como o ajuste do buffer de escrita dupla é global, o buffer de escrita dupla também é desativado para arquivos de dados que não residem em hardware Fusion-io.

* Desativar o registro de páginas compactadas

  Ao usar o recurso de compressão de tabela `InnoDB`, as imagens de páginas re-comprimetidas são escritas no log de refazer quando alterações são feitas em dados compactados. Esse comportamento é controlado por `innodb_log_compressed_pages`, que é habilitado por padrão para evitar corrupções que podem ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante a recuperação. Se você tem certeza de que a versão do `zlib` não está sujeita a alterações, desative `innodb_log_compressed_pages` para reduzir a geração do log de refazer para cargas de trabalho que modificam dados compactados.