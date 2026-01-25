## 7.1 Tipos de Backup e Recovery

Esta seção descreve as características dos diferentes tipos de *backups*.

### Backups Físicos (Raw) Versus Lógicos

*Backups* físicos consistem em cópias *raw* (brutas) dos diretórios e arquivos que armazenam o conteúdo do *database*. Este tipo de *backup* é adequado para *databases* grandes e importantes que precisam ser recuperados rapidamente quando ocorrem problemas.

*Backups* lógicos salvam informações representadas como estrutura lógica do *database* (*statements* `CREATE DATABASE`, `CREATE TABLE`) e conteúdo (*statements* `INSERT` ou arquivos de texto delimitados). Este tipo de *backup* é adequado para quantidades menores de dados, onde você pode editar os valores dos dados ou a estrutura da tabela, ou recriar os dados em uma arquitetura de máquina diferente.

Os métodos de *backup* físico apresentam estas características:

* O *backup* consiste em cópias exatas de diretórios e arquivos do *database*. Tipicamente, esta é uma cópia total ou parcial do diretório de dados do MySQL.
* Métodos de *backup* físico são mais rápidos do que os lógicos porque envolvem apenas cópia de arquivo sem conversão.
* A saída é mais compacta do que para *backup* lógico.
* Como a velocidade e a compactação do *backup* são importantes para *databases* movimentados e críticos, o produto MySQL Enterprise Backup realiza *backups* físicos. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 28.1, “Visão Geral do MySQL Enterprise Backup”.
* A granularidade de *backup* e *restore* varia do nível do diretório de dados inteiro até o nível de arquivos individuais. Isso pode ou não fornecer granularidade no nível da tabela, dependendo do *storage engine*. Por exemplo, tabelas `InnoDB` podem estar cada uma em um arquivo separado, ou compartilhar o armazenamento de arquivos com outras tabelas `InnoDB`; cada tabela `MyISAM` corresponde unicamente a um conjunto de arquivos.
* Além dos *databases*, o *backup* pode incluir quaisquer arquivos relacionados, como arquivos de *log* ou de configuração.
* Os dados de tabelas `MEMORY` são difíceis de fazer *backup* dessa forma porque seu conteúdo não é armazenado em disco. (O produto MySQL Enterprise Backup possui um recurso onde você pode recuperar dados de tabelas `MEMORY` durante um *backup*.)
* *Backups* são portáteis apenas para outras máquinas que possuem características de *hardware* idênticas ou semelhantes.
* *Backups* podem ser realizados enquanto o *MySQL server* não está em execução. Se o *server* estiver em execução, é necessário realizar o *locking* apropriado para que o *server* não altere o conteúdo do *database* durante o *backup*. O MySQL Enterprise Backup realiza esse *locking* automaticamente para tabelas que o exigem.
* As ferramentas de *backup* físico incluem o **mysqlbackup** do MySQL Enterprise Backup para `InnoDB` ou quaisquer outras tabelas, ou comandos de nível de *file system* (como **cp**, **scp**, **tar**, **rsync**) para tabelas `MyISAM`.
* Para *restore*:
    + O MySQL Enterprise Backup realiza o *restore* de `InnoDB` e outras tabelas das quais ele fez *backup*.
    + **ndb_restore** realiza o *restore* de tabelas `NDB`.
    + Arquivos copiados no nível do *file system* podem ser copiados de volta para seus locais originais com comandos de *file system*.

Os métodos de *backup* lógico apresentam estas características:

* O *backup* é feito consultando o *MySQL server* para obter a estrutura do *database* e informações de conteúdo.
* O *backup* é mais lento do que os métodos físicos porque o *server* deve acessar as informações do *database* e convertê-las para o formato lógico. Se a saída for gravada no lado do *client*, o *server* também deve enviá-la para o programa de *backup*.
* A saída é maior do que para *backup* físico, particularmente quando salva em formato de texto.
* A granularidade de *backup* e *restore* está disponível no nível do *server* (todos os *databases*), no nível do *database* (todas as tabelas em um *database* específico) ou no nível da tabela. Isso é verdade independentemente do *storage engine*.
* O *backup* não inclui arquivos de *log* ou de configuração, ou outros arquivos relacionados ao *database* que não fazem parte dos *databases*.
* *Backups* armazenados em formato lógico são independentes da máquina e altamente portáteis.
* *Backups* lógicos são realizados com o *MySQL server* em execução. O *server* não é desativado.
* As ferramentas de *backup* lógico incluem o programa **mysqldump** e o *statement* `SELECT ... INTO OUTFILE`. Estes funcionam para qualquer *storage engine*, até mesmo `MEMORY`.
* Para realizar o *restore* de *backups* lógicos, arquivos de *dump* no formato SQL podem ser processados usando o *client* **mysql**. Para carregar arquivos de texto delimitados, use o *statement* `LOAD DATA` ou o *client* **mysqlimport**.

### Backups Online Versus Offline

*Backups Online* ocorrem enquanto o *MySQL server* está em execução para que as informações do *database* possam ser obtidas do *server*. *Backups Offline* ocorrem enquanto o *server* está parado. Essa distinção também pode ser descrita como *backups* “*hot*” versus “*cold*”; um *backup* “*warm*” é aquele em que o *server* permanece em execução, mas bloqueado contra a modificação de dados enquanto você acessa os arquivos do *database* externamente.

Os métodos de *backup Online* apresentam estas características:

* O *backup* é menos intrusivo para outros *clients*, que podem se conectar ao *MySQL server* durante o *backup* e podem acessar os dados dependendo das operações que precisam realizar.
* Deve-se tomar cuidado para impor o *locking* apropriado para que modificações de dados não ocorram e comprometam a integridade do *backup*. O produto MySQL Enterprise Backup realiza tal *locking* automaticamente.

Os métodos de *backup Offline* apresentam estas características:

* Os *clients* podem ser afetados adversamente porque o *server* fica indisponível durante o *backup*. Por essa razão, esses *backups* são frequentemente realizados a partir de um *replica server* que pode ser desativado sem prejudicar a disponibilidade.
* O procedimento de *backup* é mais simples porque não há possibilidade de interferência da atividade do *client*.

Uma distinção semelhante entre *online* e *offline* se aplica às operações de *recovery* (recuperação), e características semelhantes se aplicam. No entanto, é mais provável que os *clients* sejam afetados pelo *recovery online* do que pelo *backup online*, porque o *recovery* exige um *locking* mais forte. Durante o *backup*, os *clients* podem ler os dados enquanto estão sendo copiados. O *Recovery* modifica os dados e não apenas os lê, então os *clients* devem ser impedidos de acessar os dados enquanto estão sendo restaurados.

### Backups Locais Versus Remotos

Um *backup* local é realizado no mesmo *host* onde o *MySQL server* é executado, enquanto um *backup* remoto é feito a partir de um *host* diferente. Para alguns tipos de *backup*, o *backup* pode ser iniciado a partir de um *host* remoto, mesmo que a saída seja gravada localmente no *server host*.

* **mysqldump** pode se conectar a *servers* locais ou remotos. Para saída SQL (*statements* `CREATE` e `INSERT`), *dumps* locais ou remotos podem ser feitos e gerar saída no *client*. Para saída de texto delimitado (com a opção `--tab`), os arquivos de dados são criados no *server host*.
* `SELECT ... INTO OUTFILE` pode ser iniciado a partir de um *client host* local ou remoto, mas o arquivo de saída é criado no *server host*.
* Métodos de *backup* físico são tipicamente iniciados localmente no *host* do *MySQL server* para que o *server* possa ser desativado, embora o destino para os arquivos copiados possa ser remoto.

### Snapshot Backups

Algumas implementações de *file system* permitem que "snapshots" (capturas instantâneas) sejam realizados. Estes fornecem cópias lógicas do *file system* em um determinado ponto no tempo, sem exigir uma cópia física do *file system* inteiro. (Por exemplo, a implementação pode usar técnicas de *copy-on-write* para que apenas partes do *file system* modificadas após o tempo do *snapshot* precisem ser copiadas.) O MySQL em si não fornece a capacidade de tirar *snapshots* do *file system*. Está disponível através de soluções de terceiros, como Veritas, LVM ou ZFS.

### Full Versus Incremental Backups

Um *full backup* (backup completo) inclui todos os dados gerenciados por um *MySQL server* em um determinado ponto no tempo. Um *incremental backup* (backup incremental) consiste nas alterações feitas nos dados durante um determinado período (de um ponto no tempo para outro). O MySQL tem diferentes maneiras de realizar *full backups*, conforme descrito anteriormente nesta seção. *Incremental backups* são possíveis ativando o *binary log* do *server*, que o *server* usa para registrar as alterações de dados.

### Full Versus Point-in-Time (Incremental) Recovery

Um *full recovery* (recuperação completa) realiza o *restore* de todos os dados de um *full backup*. Isso restaura a instância do *server* ao estado que ela tinha quando o *backup* foi feito. Se esse estado não estiver suficientemente atualizado, um *full recovery* pode ser seguido pela recuperação de *incremental backups* feitos desde o *full backup*, para levar o *server* a um estado mais atualizado.

O *Incremental recovery* é a recuperação de alterações feitas durante um determinado período. Isso também é chamado de *point-in-time recovery* (recuperação pontual), pois torna o estado de um *server* atualizado até um determinado momento. O *Point-in-time recovery* é baseado no *binary log* e geralmente segue um *full recovery* a partir dos arquivos de *backup* que restauram o *server* ao seu estado quando o *backup* foi feito. Em seguida, as alterações de dados escritas nos arquivos do *binary log* são aplicadas como *incremental recovery* para refazer as modificações de dados e levar o *server* até o ponto no tempo desejado.

### Manutenção de Tabela

A integridade dos dados pode ser comprometida se as tabelas ficarem corrompidas. Para tabelas `InnoDB`, este não é um problema típico. Para programas verificarem tabelas `MyISAM` e repará-las se forem encontrados problemas, consulte a Seção 7.6, “Manutenção de Tabela MyISAM e Crash Recovery”.

### Backup Scheduling, Compressão e Criptografia

O *Backup scheduling* (agendamento de *backup*) é valioso para automatizar procedimentos de *backup*. A compressão da saída do *backup* reduz os requisitos de espaço, e a criptografia da saída fornece melhor segurança contra acesso não autorizado aos dados de *backup*. O MySQL em si não oferece esses recursos. O produto MySQL Enterprise Backup pode compactar *backups* `InnoDB`, e a compressão ou criptografia da saída de *backup* pode ser alcançada usando utilitários de *file system*. Outras soluções de terceiros podem estar disponíveis.