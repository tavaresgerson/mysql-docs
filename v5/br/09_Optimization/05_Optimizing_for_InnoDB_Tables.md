## 8.5 Otimizando para Tabelas InnoDB

`InnoDB` é o mecanismo de armazenamento que os clientes do MySQL normalmente usam em bancos de dados de produção onde a confiabilidade e a concorrência são importantes. `InnoDB` é o mecanismo de armazenamento padrão no MySQL. Esta seção explica como otimizar as operações do banco de dados para as tabelas `InnoDB`.

### 8.5.1 Otimizando o Layout de Armazenamento para Tabelas InnoDB

* Quando seus dados atingem um tamanho estável ou uma tabela em crescimento tiver aumentado em dezenas ou algumas centenas de megabytes, considere usar a declaração `OPTIMIZE TABLE` para reorganizar a tabela e compactar qualquer espaço desperdiçado. As tabelas reorganizadas exigem menos I/O de disco para realizar varreduras completas da tabela. Esta é uma técnica simples que pode melhorar o desempenho quando outras técnicas, como a melhoria do uso de índices ou o ajuste do código da aplicação, não são práticas.

`OPTIMIZE TABLE` copia a parte de dados da tabela e reconstrui os índices. Os benefícios vêm da melhor embalagem dos dados dentro dos índices e da redução da fragmentação dentro dos espaços de tabela e no disco. Os benefícios variam dependendo dos dados em cada tabela. Você pode descobrir que há ganhos significativos para alguns e não para outros, ou que os ganhos diminuem com o tempo até que você otimize a tabela novamente. Essa operação pode ser lenta se a tabela for grande ou se os índices que estão sendo reconstruídos não se encaixarem na piscina de buffer. A primeira execução após adicionar muitos dados a uma tabela é muitas vezes muito mais lenta do que as execuções posteriores.

* Em `InnoDB`, ter um longo `PRIMARY KEY` (uma única coluna com um valor extenso ou várias colunas que formam um valor composto longo) desperdiça muito espaço em disco. O valor da chave primária de uma string é duplicado em todos os registros de índice secundário que apontam para a mesma string. (Veja a Seção 14.6.2.1, “Indekses Clusterizados e Secundários”). Crie uma coluna `AUTO_INCREMENT` como chave primária se sua chave primária for longa, ou indexe um prefixo de uma coluna `VARCHAR` longa em vez de toda a coluna.

* Use o tipo de dados `VARCHAR` em vez de `CHAR` para armazenar strings de comprimento variável ou para colunas com muitos valores de `NULL`. Uma coluna `CHAR(N)` sempre leva *`N`* caracteres para armazenar dados, mesmo que a string seja mais curta ou seu valor seja `NULL`. Tabelas menores se encaixam melhor no pool de buffer e reduzem o I/O em disco.

Quando se usa o formato de string `COMPACT` (o formato padrão `InnoDB`) e conjuntos de caracteres de comprimento variável, como `utf8` ou `sjis`, as colunas `CHAR(N)` ocupam uma quantidade variável de espaço, mas ainda pelo menos *`N`* bytes.

* Para tabelas grandes, ou que contenham muitos textos repetitivos ou dados numéricos, considere usar o formato de string `COMPRESSED`. Menos I/O de disco é necessário para trazer dados para o pool de buffer, ou para realizar varreduras completas da tabela. Antes de tomar uma decisão definitiva, meça a quantidade de compressão que pode ser alcançada usando o formato de string `COMPRESSED` versus o formato de string `COMPACT`.

### 8.5.2 Otimizando o Gerenciamento de Transações InnoDB

Para otimizar o processamento de transações do `InnoDB`, encontre o equilíbrio ideal entre o custo de desempenho das funcionalidades transacionais e a carga de trabalho do seu servidor. Por exemplo, um aplicativo pode encontrar problemas de desempenho se cometer milhares de vezes por segundo, e diferentes problemas de desempenho se cometer apenas a cada 2 a 3 horas.

* O ajuste padrão do MySQL `AUTOCOMMIT=1` pode impor limitações de desempenho em um servidor de banco de dados ocupado. Quando for possível, envolva várias operações relacionadas de alteração de dados em uma única transação, emitindo a declaração `SET AUTOCOMMIT=0` ou `START TRANSACTION`, seguida por uma declaração `COMMIT` após fazer todas as alterações.

`InnoDB` deve limpar o log no disco em cada commit de transação se essa transação tiver feito modificações no banco de dados. Quando cada alteração é seguida por um commit (como no ajuste de autocommit padrão), o desempenho de I/O do dispositivo de armazenamento coloca um limite no número de operações potenciais por segundo.

* Alternativamente, para transações que consistem apenas em uma única declaração `SELECT`, ativar `AUTOCOMMIT` ajuda o `InnoDB` a reconhecer transações somente de leitura e otimizá-las. Consulte a Seção 8.5.3, “Otimizando Transações somente de Leitura do InnoDB”, para requisitos.

* Evite realizar recuos após inserir, atualizar ou excluir um grande número de strings. Se uma grande transação está prejudicando o desempenho do servidor, reverter o problema pode piorar o problema, podendo levar várias vezes mais tempo para ser realizado do que as operações originais de alteração de dados. Matar o processo do banco de dados não ajuda, porque o recuo começa novamente na inicialização do servidor.

Para minimizar a chance de que essa questão ocorra:

+ Aumente o tamanho do pool de buffer para que todas as alterações de dados possam ser armazenadas em cache, em vez de serem escritas imediatamente no disco.

+ Defina `innodb_change_buffering=all` para que as operações de atualização e exclusão sejam armazenadas em buffer, além das inserções.

+ Considere emitir declarações `COMMIT` periodicamente durante a operação de mudança de big data, possivelmente dividindo uma única exclusão ou atualização em várias declarações que operam em um número menor de strings.

Para se livrar de um rollback descontrolado uma vez que ocorre, aumente o pool de buffer para que o rollback se torne limitado pela CPU e execute rapidamente, ou mate o servidor e reinicie com `innodb_force_recovery=3`, conforme explicado na Seção 14.19.2, "Recuperação do InnoDB".

Espera-se que essa questão seja rara com a configuração padrão `innodb_change_buffering=all`, que permite que as operações de atualização e exclusão sejam armazenadas em cache na memória, tornando-as mais rápidas para serem realizadas em primeiro lugar, e também mais rápidas para serem revertidas, se necessário. Certifique-se de usar essa configuração de parâmetro em servidores que processam transações de longa duração com muitas inserções, atualizações ou exclusões.

* Se você pode permitir a perda de algumas das transações mais recentes se uma saída inesperada ocorrer, você pode definir o parâmetro `innodb_flush_log_at_trx_commit` para 0. `InnoDB` tenta limpar o log uma vez por segundo, embora o apagamento não seja garantido. Além disso, defina o valor de `innodb_support_xa` para 0, o que reduz o número de apagamentos de disco devido à sincronização de dados no disco e no log binário.

Nota

`innodb_support_xa` é descontinuado; espere que ele seja removido em uma versão futura. A partir do MySQL 5.7.10, o suporte `InnoDB` para commit de duas fases em transações XA está sempre habilitado e desabilitar `innodb_support_xa` não é mais permitido.

* Quando as strings são modificadas ou excluídas, as strings e os registros de desfazer associados não são removidos fisicamente imediatamente, ou mesmo imediatamente após a transação ser confirmada. Os dados antigos são preservados até que as transações que começaram anteriormente ou simultaneamente sejam concluídas, para que essas transações possam acessar o estado anterior das strings modificadas ou excluídas. Assim, uma transação de longa duração pode impedir que `InnoDB` elimine dados que foram alterados por outra transação.

* Quando as strings são modificadas ou excluídas dentro de uma transação de longa duração, outras transações que utilizam os níveis de isolamento `READ COMMITTED` e `REPEATABLE READ` têm que fazer mais trabalho para reconstruir os dados mais antigos se elas leem essas mesmas strings.

* Quando uma transação de longa duração modifica uma tabela, as consultas feitas contra essa tabela por outras transações não utilizam a técnica de índice de cobertura. As consultas que normalmente poderiam recuperar todas as colunas do resultado de um índice secundário, em vez disso, procuram os valores apropriados nos dados da tabela.

Se páginas de índice secundário forem encontradas com um `PAGE_MAX_TRX_ID` que é muito novo, ou se os registros no índice secundário forem marcados para exclusão, o `InnoDB` pode precisar consultar registros usando um índice agrupado.

### 8.5.3 Otimizando Transações de Leitura Apenas de Leitura do InnoDB

`InnoDB` pode evitar o overhead associado à configuração do ID de transação (campo `TRX_ID`) para transações que são conhecidas como somente leitura. Um ID de transação é necessário apenas para uma transação que pode realizar operações de escrita ou bloqueio de leitura, como `SELECT ... FOR UPDATE`. A eliminação de IDs de transação desnecessários reduz o tamanho das estruturas de dados internas que são consultadas cada vez que uma consulta ou uma declaração de alteração de dados constrói uma visão de leitura.

`InnoDB` detecta transações somente de leitura quando:

* A transação é iniciada com a declaração `START TRANSACTION READ ONLY`. Nesse caso, tentar fazer alterações no banco de dados (para `InnoDB`, `MyISAM` ou outros tipos de tabelas) causa um erro, e a transação continua no estado de leitura somente:

  ```sql
  ERROR 1792 (25006): Cannot execute statement in a READ ONLY transaction.
  ```

Você ainda pode fazer alterações em tabelas temporárias específicas de sessão em uma transação somente leitura, ou emitir consultas de bloqueio para elas, porque essas alterações e bloqueios não são visíveis para nenhuma outra transação.

* O ajuste `autocommit` está ativado, de modo que a transação é garantida como uma única declaração, e a única declaração que compõe a transação é uma declaração de "não bloqueio" `SELECT`. Ou seja, um `SELECT` que não utiliza uma cláusula de `FOR UPDATE` ou `LOCK IN SHARED MODE`.

* A transação é iniciada sem a opção `READ ONLY`, mas ainda não foram executadas nenhuma atualização ou declaração que bloqueie explicitamente as strings. Até que atualizações ou bloqueios explícitos sejam necessários, a transação permanece no modo de leitura somente.

Assim, para uma aplicação intensiva de leitura, como um gerador de relatórios, você pode ajustar uma sequência de consultas `InnoDB` agrupando-as dentro de `START TRANSACTION READ ONLY` e `COMMIT`, ou ativando a configuração `autocommit` antes de executar as instruções `SELECT`, ou simplesmente evitando qualquer declaração de alteração de dados intercalada com as consultas.

Para informações sobre `START TRANSACTION` e `autocommit`, consulte a Seção 13.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”.

Nota

As transações que se qualificam como auto-commit, não bloqueáveis e apenas de leitura (AC-NL-RO) são excluídas de certas estruturas de dados internas `InnoDB` e, portanto, não são listadas no `SHOW ENGINE INNODB STATUS` de saída.

### 8.5.4 Otimizando o registro de InnoDB Redo

Considere as seguintes diretrizes para otimizar o registro de refazer:

* Faça seus arquivos de registro de refazer grandes, tão grandes quanto o pool de buffer. Quando o `InnoDB` tiver escrito os arquivos de registro de refazer completos, ele deve escrever os conteúdos modificados do pool de buffer no disco em um ponto de verificação. Arquivos de registro de refazer pequenos causam muitos escritos desnecessários no disco. Embora historicamente, grandes arquivos de registro de refazer causassem tempos de recuperação longos, a recuperação agora é muito mais rápida e você pode confiar em usar arquivos de registro de refazer grandes.

O tamanho e o número dos arquivos de registro de revisão são configurados usando as opções de configuração `innodb_log_file_size` e `innodb_log_files_in_group`. Para obter informações sobre a modificação de uma configuração de arquivo de registro de revisão existente, consulte Altere o número ou o tamanho dos arquivos de registro de revisão InnoDB.

* Considere aumentar o tamanho do buffer de registro. Um buffer de registro grande permite que transações grandes sejam executadas sem a necessidade de gravar o registro no disco antes do compromisso das transações. Assim, se você tiver transações que atualizam, inserem ou excluem muitas strings, aumentar o tamanho do buffer de registro economiza o I/O do disco. O tamanho do buffer de registro é configurado usando a opção de configuração `innodb_log_buffer_size`.

* Configure a opção de configuração `innodb_log_write_ahead_size` para evitar a opção "leitura na escrita". Esta opção define o tamanho do bloco de pré-escrita para o log de refazer. Defina `innodb_log_write_ahead_size` para corresponder ao tamanho de bloco de cache do sistema operacional ou do sistema de arquivos. A leitura na escrita ocorre quando os blocos do log de refazer não são totalmente cacheados no sistema operacional ou no sistema de arquivos devido a uma incompatibilidade entre o tamanho do bloco de pré-escrita para o log de refazer e o tamanho de bloco de cache do sistema operacional ou do sistema de arquivos.

Os valores válidos para `innodb_log_write_ahead_size` são múltiplos do tamanho do bloco do arquivo de registro `InnoDB` (2n). O valor mínimo é o tamanho do bloco do arquivo de registro `InnoDB` (512). O pré-escrita não ocorre quando o valor mínimo é especificado. O valor máximo é igual ao valor de `innodb_page_size`. Se você especificar um valor para `innodb_log_write_ahead_size` que é maior que o valor de `innodb_page_size`, a configuração de `innodb_log_write_ahead_size` é truncada para o valor de `innodb_page_size`.

Definir o valor `innodb_log_write_ahead_size` muito baixo em relação ao tamanho do bloco de cache do sistema operacional ou do sistema de arquivos resulta em leitura-escrita. Definir o valor muito alto pode ter um pequeno impacto no desempenho do `fsync` para gravações de arquivos de log devido ao fato de vários blocos serem escritos de uma só vez.

### 8.5.5 Carregamento de dados em massa para tabelas InnoDB

Esses conselhos de desempenho complementam as diretrizes gerais para inserções rápidas na Seção 8.2.4.1, “Otimizando as declarações INSERT”.

* Ao importar dados no `InnoDB`, desative o modo de autocommit, pois ele realiza um esvaziamento do log no disco para cada inserção. Para desabilitar o autocommit durante sua operação de importação, rode-a com as declarações `SET autocommit` e `COMMIT`:

  ```sql
  SET autocommit=0;
  ... SQL import statements ...
  COMMIT;
  ```

A opção **mysqldump** `--opt` cria arquivos de dump que são rápidos para importar em uma tabela `InnoDB`, mesmo sem serem envolvidos pelas declarações `SET autocommit` e `COMMIT`.

* Se você tiver restrições `UNIQUE` em chaves secundárias, pode acelerar as importações de tabela, desativando temporariamente as verificações de unicidade durante a sessão de importação:

  ```sql
  SET unique_checks=0;
  ... SQL import statements ...
  SET unique_checks=1;
  ```

Para tabelas grandes, isso economiza muito I/O de disco, pois o `InnoDB` pode usar seu buffer de alterações para escrever registros de índice secundário em lote. Certifique-se de que os dados não contenham chaves duplicadas.

* Se você tiver restrições `FOREIGN KEY` em suas tabelas, pode acelerar a importação de tabelas desativando as verificações de chave estrangeira durante a sessão de importação:

  ```sql
  SET foreign_key_checks=0;
  ... SQL import statements ...
  SET foreign_key_checks=1;
  ```

Para grandes tabelas, isso pode economizar muito I/O de disco.

* Use a sintaxe de múltiplos registros `INSERT` para reduzir o overhead de comunicação entre o cliente e o servidor, se você precisar inserir muitos registros:

  ```sql
  INSERT INTO yourtable VALUES (1,2), (5,5), ...;
  ```

Essa dica é válida para inserções em qualquer tabela, não apenas as tabelas `InnoDB`.

* Ao fazer inserções em massa em tabelas com colunas de auto-incremento, defina `innodb_autoinc_lock_mode` para 2 em vez do valor padrão 1. Consulte a Seção 14.6.1.6, “Tratamento de AUTO\_INCREMENT no InnoDB”, para obter detalhes.

* Ao realizar inserções em massa, é mais rápido inserir as strings na ordem de `PRIMARY KEY`. As tabelas `InnoDB` utilizam um índice agrupado, o que torna relativamente rápido usar dados na ordem do `PRIMARY KEY`. Realizar inserções em massa na ordem de `PRIMARY KEY` é particularmente importante para tabelas que não se encaixam inteiramente no pool de buffer.

* Para obter o desempenho ótimo ao carregar dados em um índice `InnoDB` `FULLTEXT`, siga este conjunto de passos:

1. Defina uma coluna `FTS_DOC_ID` no momento da criação da tabela, do tipo `BIGINT UNSIGNED NOT NULL`, com um índice único denominado `FTS_DOC_ID_INDEX`. Por exemplo:

     ```sql
     CREATE TABLE t1 (
     FTS_DOC_ID BIGINT unsigned NOT NULL AUTO_INCREMENT,
     title varchar(255) NOT NULL DEFAULT '',
     text mediumtext NOT NULL,
     PRIMARY KEY (`FTS_DOC_ID`)
     ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
     CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on t1(FTS_DOC_ID);
     ```

2. Carregue os dados na tabela.  
3. Crie o índice `FULLTEXT` após os dados serem carregados.

Nota

Ao adicionar a coluna `FTS_DOC_ID` no momento da criação da tabela, certifique-se de que a coluna `FTS_DOC_ID` seja atualizada quando a coluna indexada `FULLTEXT` for atualizada, pois o `FTS_DOC_ID` deve aumentar de forma monótona com cada chamada ao `INSERT` ou `UPDATE`. Se você optar por não adicionar a coluna `FTS_DOC_ID` no momento da criação da tabela e tiver `InnoDB` gerenciando os IDs DOC para você, o `InnoDB` adiciona o `FTS_DOC_ID` como uma coluna oculta com a próxima chamada ao `CREATE FULLTEXT INDEX`. Essa abordagem, no entanto, requer uma reconstrução da tabela, o que pode impactar o desempenho.

### 8.5.6 Otimizando consultas InnoDB

Para ajustar as consultas para as tabelas `InnoDB`, crie um conjunto apropriado de índices em cada tabela. Consulte a Seção 8.3.1, “Como o MySQL usa índices”, para obter detalhes. Siga essas diretrizes para os índices `InnoDB`:

* Como cada tabela `InnoDB` tem uma chave primária (se você solicitar uma ou não), especifique um conjunto de colunas da chave primária para cada tabela, colunas que são usadas nas consultas mais importantes e críticas.

* Não especifique colunas muito longas ou demasiadas na chave primária, pois esses valores de coluna são duplicados em cada índice secundário. Quando um índice contém dados desnecessários, o I/O para ler esses dados e a memória para cacheá-los reduzem o desempenho e a escalabilidade do servidor.

* Não crie um índice secundário separado para cada coluna, porque cada consulta pode utilizar apenas um índice. Índices em colunas raramente testadas ou colunas com apenas alguns valores diferentes podem não ser úteis para nenhuma consulta. Se você tiver muitas consultas para a mesma tabela, teste diferentes combinações de colunas, tente criar um pequeno número de índices concatenados em vez de um grande número de índices de uma única coluna. Se um índice contém todas as colunas necessárias para o conjunto de resultados (conhecido como índice coberto), a consulta pode ser capaz de evitar ler os dados da tabela em tudo.

* Se uma coluna indexada não puder conter quaisquer valores de `NULL`, declare-a como `NOT NULL` ao criar a tabela. O otimizador pode determinar melhor qual índice é o mais eficaz para usar em uma consulta, quando sabe se cada coluna contém valores de `NULL`.

* Você pode otimizar transações de consulta única para tabelas de `InnoDB`, usando a técnica na Seção 8.5.3, “Otimizando Transações de Leitura Apenas de InnoDB”.

### 8.5.7 Otimizando operações de DDL do InnoDB

* Muitas operações DDL em tabelas e índices (as declarações `CREATE`, `ALTER` e `DROP`) podem ser realizadas online. Consulte a Seção 14.13, “InnoDB e DDL Online”, para obter detalhes.

* O suporte online para DDL (Data Definition Language) para adicionar índices secundários significa que, geralmente, você pode acelerar o processo de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando índices secundários após o carregamento dos dados.

* Use `TRUNCATE TABLE` para esvaziar uma tabela, não `DELETE FROM tbl_name`. As restrições de chave estrangeira podem fazer uma declaração `TRUNCATE` funcionar como uma declaração regular `DELETE`, nesse caso, uma sequência de comandos como `DROP TABLE` e `CREATE TABLE` pode ser a mais rápida.

* Como a chave primária é fundamental para o layout de armazenamento de cada tabela `InnoDB`, e alterar a definição da chave primária envolve a reorganização de toda a tabela, configure sempre a chave primária como parte da declaração `CREATE TABLE`, e planeje com antecedência para que você não precise `ALTER` ou `DROP` a chave primária posteriormente.

### 8.5.8 Otimizando o I/O de disco do InnoDB

Se você seguir as melhores práticas de design de banco de dados e técnicas de ajuste para operações SQL, mas ainda assim o banco de dados estiver lento devido a uma atividade pesada de E/S de disco, considere essas otimizações de E/S de disco. Se a ferramenta Unix `top` ou o Gerenciador de Tarefas do Windows mostrar que a porcentagem de uso da CPU com sua carga de trabalho é menor que 70%, sua carga de trabalho provavelmente está limitada pelo disco.

* Aumente o tamanho do banco de buffers

Quando os dados da tabela são armazenados em cache no pool de buffers `InnoDB`, eles podem ser acessados repetidamente por consultas sem exigir qualquer I/O de disco. Especifique o tamanho do pool de buffers com a opção `innodb_buffer_pool_size`. Essa área de memória é suficientemente importante que, normalmente, é recomendado que `innodb_buffer_pool_size` seja configurado para 50 a 75 por cento da memória do sistema. Para mais informações, consulte a Seção 8.12.4.1, “Como o MySQL usa memória”.

* Ajuste o método de limpeza

Em algumas versões do GNU/Linux e Unix, limpar arquivos no disco com a chamada Unix `fsync()` (que `InnoDB` usa por padrão) e métodos semelhantes é surpreendentemente lento. Se o desempenho da escrita no banco de dados é um problema, realize benchmarks com o parâmetro `innodb_flush_method` definido como `O_DSYNC`.

* Use um planejador de I/O noop ou com prazo com AIO nativo no Linux

`InnoDB` utiliza o subsistema de E/S assíncrono (AIO nativo) no Linux para realizar solicitações de leitura antecipada e escrita para páginas de arquivos de dados. Esse comportamento é controlado pela opção de configuração `innodb_use_native_aio`, que é ativada por padrão. Com o AIO nativo, o tipo de agendamento de E/S tem maior influência no desempenho de E/S. Geralmente, os agendadores de E/S noop e com prazo são recomendados. Realize benchmarks para determinar qual agendamento de E/S fornece os melhores resultados para sua carga de trabalho e ambiente. Para mais informações, consulte a Seção 14.8.7, “Usando E/S Assíncrono no Linux”.

* Use I/O direto no Solaris 10 para arquitetura x86_64

Ao usar o motor de armazenamento `InnoDB` no Solaris 10 para arquitetura x86\_64 (AMD Opteron), use I/O direto para arquivos relacionados ao `InnoDB` para evitar a degradação do desempenho do `InnoDB`. Para usar I/O direto para um sistema de arquivos UFS inteiro usado para armazenar arquivos relacionados ao `InnoDB`, monte-o com a opção `forcedirectio`; veja `mount_ufs(1M)`. (O padrão no Solaris 10/x86\_64 é *não* usar essa opção.) Para aplicar I/O direto apenas para operações de arquivo `InnoDB`, em vez do sistema de arquivos inteiro, defina `innodb_flush_method = O_DIRECT`. Com essa configuração, o `InnoDB` chama `directio()` em vez de `fcntl()` para I/O a arquivos de dados (não para I/O a arquivos de log).

* Use armazenamento bruto para arquivos de dados e log com Solaris 2.6 ou posterior

Ao usar o motor de armazenamento `InnoDB` com um grande valor `innodb_buffer_pool_size` em qualquer versão do Solaris 2.6 e superior e em qualquer plataforma (sparc/x86/x64/amd64), realize benchmarks com arquivos de dados `InnoDB` e arquivos de log em dispositivos brutos ou em um sistema de arquivos UFS de I/O direto separado, usando a opção de montagem `forcedirectio` conforme descrito anteriormente. (É necessário usar a opção de montagem em vez de configurar `innodb_flush_method` se você deseja I/O direto para os arquivos de log.) Os usuários do sistema de arquivos Veritas VxFS devem usar a opção de montagem `convosync=direct`.

Não coloque outros arquivos de dados do MySQL, como os das tabelas do `MyISAM`, em um sistema de arquivos de E/S direto. Os executáveis ou bibliotecas *não devem* ser colocados em um sistema de arquivos de E/S direto.

* Use dispositivos de armazenamento adicionais

Dispositivos de armazenamento adicionais podem ser usados para configurar uma configuração RAID. Para informações relacionadas, consulte a Seção 8.12.2, “Otimizando o I/O de disco”.

Alternativamente, os arquivos de dados do espaço de tabela `InnoDB` e os arquivos de registro podem ser colocados em discos físicos diferentes. Para mais informações, consulte as seções a seguir:

+ Seção 14.8.1, “Configuração de inicialização do InnoDB”
+ Seção 14.6.1.2, “Criando tabelas externamente”
  + Criando um espaço de tabelas geral
  + Seção 14.6.1.4, “Movendo ou copiando tabelas InnoDB”
* Considere o armazenamento não rotativo

O armazenamento não rotativo geralmente oferece melhor desempenho para operações de E/S aleatórias; e o armazenamento rotativo para operações de E/S sequenciais. Ao distribuir dados e arquivos de registro entre dispositivos de armazenamento rotativo e não rotativo, considere o tipo de operações de E/S que são predominantemente realizadas em cada arquivo.

Arquivos orientados por E/S aleatórios geralmente incluem arquivos de dados de arquivo por tabela e espaços de tabela gerais, arquivos de espaço de tabela de desfazer e arquivos de espaço de tabela temporário. Arquivos orientados por E/S sequencial incluem arquivos de espaço de tabela `InnoDB` do sistema (devido ao buffer de escrita dupla e ao buffer de mudança) e arquivos de log, como arquivos de log binário e arquivos de log de refazer.

Revise as configurações para as seguintes opções de configuração ao usar armazenamento não rotativo:

+ `innodb_checksum_algorithm`

A opção `crc32` utiliza um algoritmo de verificação de checksum mais rápido e é recomendada para sistemas de armazenamento rápidos.

+ `innodb_flush_neighbors`

Otimiza o I/O para dispositivos de armazenamento rotativo. Desative-o para armazenamento não rotativo ou uma mistura de armazenamento rotativo e não rotativo.

+ `innodb_io_capacity`

O ajuste padrão de 200 é geralmente suficiente para um dispositivo de armazenamento não rotativo de menor porte. Para dispositivos de maior porte, com conexão em bus, considere um ajuste mais alto, como 1000.

+ `innodb_io_capacity_max`

O valor padrão de 2000 é destinado a cargas de trabalho que utilizam armazenamento não rotativo. Para um dispositivo de armazenamento não rotativo com alta performance e conectado por bus, considere um valor mais alto, como 2500.

+ `innodb_log_compressed_pages`

Se os registros de refazer estiverem em armazenamento não rotativo, considere desabilitar essa opção para reduzir o registro. Veja Desabilitar o registro de páginas compactadas.

+ `innodb_log_file_size`

Se os registros de refazer estiverem em armazenamento não rotativo, configure esta opção para maximizar o cache e a combinação de escrita.

+ `innodb_page_size`

Considere usar um tamanho de página que corresponda ao tamanho do setor interno do disco. Dispositivos de SSD de geração antiga geralmente têm um tamanho de setor de 4 KB. Alguns dispositivos mais recentes têm um tamanho de setor de 16 KB. O tamanho de página padrão `InnoDB` é de 16 KB. Manter o tamanho da página próximo ao tamanho do bloco do dispositivo de armazenamento minimiza a quantidade de dados não alterados que são reescritos no disco.

+ `binlog_row_image`

Se os registros binários estiverem em armazenamento não rotativo e todas as tabelas tiverem chaves primárias, considere definir essa opção para `minimal` para reduzir o registro.

Certifique-se de que o suporte TRIM esteja habilitado para o seu sistema operacional. Geralmente, ele está habilitado por padrão.

* Aumente a capacidade de I/O para evitar atrasos

Se o desempenho cair periodicamente devido às operações de verificação `InnoDB`, considere aumentar o valor da opção de configuração [[`innodb_io_capacity`]. Valores mais altos causam um esvaziamento mais frequente, evitando o acúmulo de trabalho que pode causar quedas no desempenho.

* Capacidade de I/O menor se o esvaziamento não ficar para trás

Se o sistema não estiver atrasado com as operações de limpeza `InnoDB`, considere diminuir o valor da opção de configuração `innodb_io_capacity`. Normalmente, você mantém esse valor da opção o mais baixo possível, mas não tão baixo que cause quedas periódicas no desempenho, conforme mencionado na bala de texto anterior. Em um cenário típico em que você poderia diminuir o valor da opção, você pode ver uma combinação como esta na saída do `SHOW ENGINE INNODB STATUS`:

+ A lista de histórico tem comprimento baixo, abaixo de alguns milhares.
+ O buffer de inserção combina perto de strings inseridas.
+ As páginas modificadas no buffer pool estão consistentemente bem abaixo de `innodb_max_dirty_pages_pct` do buffer pool. (Meça em um momento em que o servidor não está realizando inserções em massa; é normal durante inserções em massa que a porcentagem de páginas modificadas aumente significativamente.)

+ `Log sequence number - Last checkpoint` está em menos de 7/8 ou, idealmente, menos de 6/8 do tamanho total dos arquivos de registro `InnoDB`.

* Armazene os arquivos do espaço de tabela do sistema em dispositivos Fusion-io

Você pode aproveitar uma otimização de I/O relacionada ao buffer de escrita dupla armazenando arquivos de espaço de sistema de tabela (“arquivos ibdata”) em dispositivos Fusion-io que suportem escritas atômicas. Neste caso, o buffer de escrita dupla (`innodb_doublewrite`) é automaticamente desativado e as escritas atômicas da Fusion-io são usadas para todos os arquivos de dados. Esta funcionalidade é suportada apenas em hardware Fusion-io e é habilitada apenas para NVMFS da Fusion-io no Linux. Para aproveitar plenamente esta funcionalidade, é recomendada uma configuração `innodb_flush_method` de `O_DIRECT`.

Nota

Como o ajuste do buffer de escrita dupla é global, o buffer de escrita dupla também é desativado para arquivos de dados que residem em hardware que não é do Fusion-io.

* Desative o registro de páginas compactadas

Ao usar a característica de compressão da tabela `InnoDB`, as imagens das páginas recompressadas são escritas no log de refazer quando alterações são feitas nos dados comprimidos. Esse comportamento é controlado por `innodb_log_compressed_pages`, que é ativado por padrão para evitar a corrupção que pode ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante a recuperação. Se você tem certeza de que a versão `zlib` não está sujeita a alterações, desative `innodb_log_compressed_pages` para reduzir a geração do log de refazer para cargas de trabalho que modificam dados comprimidos.

### 8.5.9 Otimizando as Variáveis de Configuração do InnoDB

Configurações diferentes funcionam melhor para servidores com cargas leves e previsíveis, em comparação com servidores que estão funcionando quase na capacidade total o tempo todo, ou que experimentam picos de alta atividade.

Como o motor de armazenamento `InnoDB` realiza muitas de suas otimizações automaticamente, muitas tarefas de ajuste de desempenho envolvem monitoramento para garantir que o banco de dados esteja funcionando bem e alterando as opções de configuração quando o desempenho cai. Consulte a Seção 14.17, “Integração InnoDB com o Schema de Desempenho MySQL”, para obter informações sobre o monitoramento detalhado do desempenho `InnoDB`.

Os principais passos de configuração que você pode realizar incluem:

* Habilitar `InnoDB` para usar alocadores de memória de alto desempenho em sistemas que os incluem. Veja a Seção 14.8.4, “Configurando o Alocador de Memória para InnoDB”.

* Controlar os tipos de operações de alteração de dados para as quais os buffers `InnoDB` armazenam os dados alterados, para evitar frequentes pequenos escritos no disco. Veja Configurar o bufferamento de alterações. Como o padrão é armazenar todos os tipos de operações de alteração de dados, só alterar essa configuração se você precisar reduzir a quantidade de buffer.

* Ativação e desativação do recurso de indexação hash adaptável usando a opção `innodb_adaptive_hash_index`. Consulte a Seção 14.5.3, “Índice Hash Adaptável”, para mais informações. Você pode alterar essa configuração durante períodos de atividade incomum e, em seguida, restaurá-la para sua configuração original.

* Estabelecer um limite no número de threads concorrentes que o `InnoDB` processa, se a alternância de contexto for um gargalo. Veja a Seção 14.8.5, “Configurando a Concorrência de Threads para InnoDB”.

* Controlar a quantidade de preenchimento que o `InnoDB` faz com suas operações de leitura antecipada. Quando o sistema tem capacidade de E/S não utilizada, mais leitura antecipada pode melhorar o desempenho das consultas. Muito preenchimento antecipado pode causar quedas periódicas de desempenho em um sistema com grande carga. Veja a Seção 14.8.3.4, “Configurando o Prefilho de Buffer do InnoDB (Leitura Antecipada”)”).

* Aumentar o número de threads de fundo para operações de leitura ou escrita, se você tiver um subsistema de E/S de ponta que não é totalmente utilizado pelos valores padrão. Veja a Seção 14.8.6, “Configurando o Número de Threads de E/S InnoDB de Fundo”.

* Controlar a quantidade de I/O que o `InnoDB` realiza em segundo plano. Veja a Seção 14.8.8, “Configurando a Capacidade de I/O do InnoDB”. Você pode reduzir esse ajuste se observar quedas periódicas no desempenho.

* Controlar o algoritmo que determina quando o `InnoDB` realiza certos tipos de gravações de fundo. Veja a Seção 14.8.3.5, “Configurando a Limpeza do Pool de Buffer”. O algoritmo funciona para alguns tipos de cargas de trabalho, mas não para outros, então pode desligar essa configuração se você observar quedas periódicas no desempenho.

* Aproveitando os processadores multicore e sua configuração de memória cache, para minimizar os atrasos na troca de contexto. Veja a Seção 14.8.9, “Configurando a Pesquisa de Bloqueio Spin”.

* Evitar que operações únicas, como varreduras de tabela, interfiram com os dados frequentemente acessados armazenados no cache de buffer `InnoDB`. Veja a Seção 14.8.3.3, “Tornando a varredura do pool de buffer resistente”.

* Ajustar os arquivos de registro a um tamanho que faça sentido para a confiabilidade e recuperação em caso de falha. Arquivos de registro `InnoDB` frequentemente foram mantidos pequenos para evitar tempos de inicialização longos após uma falha. As otimizações introduzidas no MySQL 5.5 aceleram certos passos do processo de recuperação em caso de falha. Em particular, a varredura do log de refazer e a aplicação do log de refazer são mais rápidas devido a algoritmos aprimorados para gerenciamento de memória. Se você manteve seus arquivos de registro artificialmente pequenos para evitar tempos de inicialização longos, agora pode considerar aumentar o tamanho do arquivo de registro para reduzir o I/O que ocorre devido ao reciclagem de registros do log de refazer.

* Configurar o tamanho e o número de instâncias do pool de buffers `InnoDB`, especialmente importante para sistemas com pools de buffers de vários gigabytes. Veja a Seção 14.8.3.2, “Configurando múltiplas instâncias de pools de buffers”.

* Aumentar o número máximo de transações concorrentes, o que melhora drasticamente a escalabilidade para os bancos de dados mais movimentados. Veja a Seção 14.6.7, “Logs de Desfazer”.

* Transfira as operações de purga em segundo plano (um tipo de coleta de lixo) para um thread de segundo plano. Veja a Seção 14.8.10, “Configuração de purga”. Para medir efetivamente os resultados dessa configuração, ajuste primeiro as outras configurações relacionadas a I/O e relacionadas a thread.

* Reduzir a quantidade de alternância que o `InnoDB` faz entre os threads concorrentes, para que as operações SQL em um servidor ocupado não fiquem em fila e não forme um "congestionamento". Defina um valor para a opção `innodb_thread_concurrency`, até aproximadamente 32 para um sistema moderno de alta potência. Aumente o valor para a opção `innodb_concurrency_tickets`, normalmente para cerca de 5000. Essa combinação de opções define um limite para o número de threads que o `InnoDB` processa em qualquer momento e permite que cada thread realize um trabalho substancial antes de ser substituído, para que o número de threads em espera permaneça baixo e as operações possam ser concluídas sem alternância excessiva de contexto.

### 8.5.10 Otimizando o InnoDB para Sistemas com Muitas Tabelas

* Se você configurou estatísticas de otimizador não persistentes (uma configuração não padrão), `InnoDB` calcula os valores de cardinalidade do índice para uma tabela na primeira vez que a tabela é acessada após a inicialização, em vez de armazenar esses valores na tabela. Esse passo pode levar um tempo significativo em sistemas que dividem os dados em muitas tabelas. Como esse sobrecarga só se aplica à operação inicial de abertura da tabela, para "aquecer" uma tabela para uso posterior, acesse-a imediatamente após a inicialização, emitindo uma declaração como `SELECT 1 FROM tbl_name LIMIT 1`.

As estatísticas do otimizador são persistidas no disco por padrão, habilitadas pela opção de configuração `innodb_stats_persistent`. Para informações sobre estatísticas de otimizador persistidas, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistidas”.