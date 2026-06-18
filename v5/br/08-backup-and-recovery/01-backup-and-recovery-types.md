## 7.1 Tipos de backup e recuperação

Esta seção descreve as características dos diferentes tipos de backups.

### Backup físico (cru) versus backup lógico

Os backups físicos consistem em cópias brutas dos diretórios e arquivos que armazenam o conteúdo do banco de dados. Esse tipo de backup é adequado para grandes bancos de dados importantes que precisam ser recuperados rapidamente quando ocorrem problemas.

Os backups lógicos salvam informações representadas como estrutura de banco de dados lógica (instruções `CREATE DATABASE`, `CREATE TABLE`) e conteúdo (instruções `INSERT` ou arquivos de texto delimitado). Esse tipo de backup é adequado para quantidades menores de dados, onde você pode editar os valores dos dados ou a estrutura da tabela ou recriar os dados em uma arquitetura de máquina diferente.

Os métodos de backup físico têm essas características:

- O backup consiste em cópias exatas dos diretórios e arquivos do banco de dados. Normalmente, é uma cópia de todo ou parte do diretório de dados do MySQL.

- Os métodos de backup físico são mais rápidos que os lógicos porque envolvem apenas a cópia de arquivos sem conversão.

- A saída é mais compacta do que no caso de backup lógico.

- Como a velocidade de backup e a compactação são importantes para bancos de dados importantes e ocupados, o produto MySQL Enterprise Backup realiza backups físicos. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 28.1, “MySQL Enterprise Backup Overview”.

- A granularidade do backup e restauração varia do nível do diretório de dados completo até o nível de arquivos individuais. Isso pode ou não proporcionar granularidade de nível de tabela, dependendo do mecanismo de armazenamento. Por exemplo, as tabelas `InnoDB` podem estar em um arquivo separado ou compartilhar o armazenamento de arquivos com outras tabelas `InnoDB`; cada tabela `MyISAM` corresponde de forma única a um conjunto de arquivos.

- Além das bases de dados, o backup pode incluir quaisquer arquivos relacionados, como arquivos de log ou de configuração.

- Os dados das tabelas `MEMORY` são difíceis de fazer backup dessa maneira, pois seus conteúdos não são armazenados em disco. (O produto MySQL Enterprise Backup tem uma funcionalidade que permite recuperar dados das tabelas `MEMORY` durante um backup.)

- As cópias de segurança são portáteis apenas para outras máquinas que tenham características de hardware idênticas ou semelhantes.

- As cópias de segurança podem ser realizadas enquanto o servidor MySQL não estiver em execução. Se o servidor estiver em execução, é necessário realizar o bloqueio apropriado para que o servidor não mude o conteúdo do banco de dados durante a cópia de segurança. O MySQL Enterprise Backup realiza esse bloqueio automaticamente para as tabelas que o exigem.

- As ferramentas de backup físico incluem o **mysqlbackup** do MySQL Enterprise Backup para `InnoDB` ou quaisquer outras tabelas, ou comandos de nível de sistema de arquivos (como **cp**, **scp**, **tar**, **rsync**) para tabelas `MyISAM`.

- Para restaurar:

  - O MySQL Enterprise Backup restaura as tabelas `InnoDB` e outras tabelas que foram restauradas.

  - O **ndb_restore** restaura as tabelas `NDB`.

  - Os arquivos copiados no nível do sistema de arquivos podem ser copiados de volta para seus locais originais com comandos do sistema de arquivos.

Os métodos de backup lógicos têm essas características:

- O backup é feito consultando o servidor MySQL para obter informações sobre a estrutura e o conteúdo do banco de dados.

- O backup é mais lento do que os métodos físicos, pois o servidor precisa acessar as informações do banco de dados e convertê-las em formato lógico. Se a saída for escrita no lado do cliente, o servidor também precisa enviá-la para o programa de backup.

- A saída é maior do que no caso de backup físico, especialmente quando salva em formato de texto.

- A granularidade de backup e restauração está disponível ao nível do servidor (todas as bases de dados), ao nível da base de dados (todas as tabelas de uma base de dados específica) ou ao nível da tabela. Isso é válido independentemente do mecanismo de armazenamento.

- O backup não inclui arquivos de registro ou de configuração, ou outros arquivos relacionados ao banco de dados que não fazem parte dos bancos de dados.

- Os backups armazenados em formato lógico são independentes da máquina e altamente portáteis.

- Os backups lógicos são realizados enquanto o servidor MySQL está em funcionamento. O servidor não é desligado.

- As ferramentas de backup lógicas incluem o programa **mysqldump** e a instrução `SELECT ... INTO OUTFILE`. Elas funcionam para qualquer mecanismo de armazenamento, mesmo o `MEMORY`.

- Para restaurar backups lógicos, os arquivos de dump no formato SQL podem ser processados usando o cliente **mysql**. Para carregar arquivos de texto delimitado, use a instrução `LOAD DATA` ou o cliente **mysqlimport**.

### Backup online versus offline

Os backups online são realizados enquanto o servidor MySQL está em funcionamento, para que as informações do banco de dados possam ser obtidas do servidor. Os backups offline são realizados enquanto o servidor está parado. Essa distinção também pode ser descrita como backups "quentes" versus backups "frios"; um backup "quente" é aquele em que o servidor permanece em funcionamento, mas bloqueado para modificar dados enquanto você acessa os arquivos do banco de dados externamente.

Os métodos de backup online têm essas características:

- O backup é menos intrusivo para outros clientes, que podem se conectar ao servidor MySQL durante o backup e podem ter acesso aos dados, dependendo das operações que precisam realizar.

- É necessário tomar cuidado para impor o bloqueio apropriado para que as modificações de dados não ocorram de forma a comprometer a integridade do backup. O produto MySQL Enterprise Backup faz esse bloqueio automaticamente.

Os métodos de backup offline têm essas características:

- Os clientes podem ser afetados negativamente porque o servidor está indisponível durante o backup. Por essa razão, esses backups são frequentemente feitos em um servidor replica que pode ser desconectado sem prejudicar a disponibilidade.

- O procedimento de backup é mais simples porque não há possibilidade de interferência da atividade do cliente.

Uma distinção semelhante entre operações online e offline se aplica às operações de recuperação, e características semelhantes se aplicam. No entanto, é mais provável que os clientes sejam afetados por recuperação online do que por backup online, porque a recuperação requer um bloqueio mais forte. Durante o backup, os clientes podem ser capazes de ler os dados enquanto estão sendo protegidos. A recuperação modifica os dados e não apenas os lê, então os clientes devem ser impedidos de acessar os dados enquanto estão sendo restaurados.

### Backup local versus remoto

Um backup local é realizado no mesmo host onde o servidor MySQL está em execução, enquanto um backup remoto é feito a partir de um host diferente. Para alguns tipos de backups, o backup pode ser iniciado a partir de um host remoto, mesmo que a saída seja escrita localmente no servidor. host.

- O **mysqldump** pode se conectar a servidores locais ou remotos. Para saída SQL (`CREATE` e `INSERT` instruções), podem ser feitas dumps locais ou remotos e geradas saídas no cliente. Para saída de texto delimitado (com a opção `--tab`), arquivos de dados são criados no host do servidor.

- A instrução `SELECT ... INTO OUTFILE` pode ser iniciada a partir de um host cliente local ou remoto, mas o arquivo de saída é criado no host do servidor.

- Os métodos de backup físico são normalmente iniciados localmente no host do servidor MySQL, para que o servidor possa ser desconectado, embora o destino dos arquivos copiados possa ser remoto.

### Backup de instantâneos

Algumas implementações de sistemas de arquivos permitem a criação de "instantâneos". Esses fornecem cópias lógicas do sistema de arquivos em um determinado momento, sem a necessidade de uma cópia física de todo o sistema de arquivos. (Por exemplo, a implementação pode usar técnicas de cópia por escrita para que apenas partes do sistema de arquivos modificadas após o momento do instantâneo precisem ser copiadas.) O próprio MySQL não oferece a capacidade de criar instantâneos de sistemas de arquivos. Está disponível através de soluções de terceiros, como Veritas, LVM ou ZFS.

### Backup completo versus backup incremental

Um backup completo inclui todos os dados gerenciados por um servidor MySQL em um determinado momento. Um backup incremental consiste nas alterações feitas aos dados durante um determinado período de tempo (de um momento para outro). O MySQL tem diferentes maneiras de realizar backups completos, como as descritas anteriormente nesta seção. Os backups incrementais são possíveis ao habilitar o log binário do servidor, que o servidor usa para registrar as alterações de dados.

### Recuperação completa versus recuperação pontual (incremental)

Uma recuperação completa restaura todos os dados de um backup completo. Isso restaura a instância do servidor ao estado em que ele estava quando o backup foi feito. Se esse estado não for suficientemente atual, uma recuperação completa pode ser seguida pela recuperação de backups incrementais feitos desde o backup completo, para levar o servidor a um estado mais atualizado.

A recuperação incremental é a recuperação de alterações feitas durante um determinado período de tempo. Isso também é chamado de recuperação em um ponto no tempo, porque ele mantém o estado do servidor atual até um determinado momento. A recuperação em um ponto no tempo é baseada no log binário e, normalmente, segue uma recuperação completa a partir dos arquivos de backup que restaura o servidor ao seu estado quando o backup foi feito. Em seguida, as alterações de dados escritas nos arquivos do log binário são aplicadas como recuperação incremental para refazer as modificações de dados e restaurar o servidor ao ponto desejado no tempo.

### Manutenção da tabela

A integridade dos dados pode ser comprometida se as tabelas ficarem corrompidas. Para as tabelas `InnoDB`, esse não é um problema típico. Para que os programas possam verificar as tabelas `MyISAM` e repará-las se problemas forem encontrados, consulte a Seção 7.6, “Manutenção e Recuperação de Falhas de Tabelas \`MyISAM’”.

### Agendamento de backup, compressão e criptografia

A programação de backups é valiosa para automatizar os procedimentos de backup. A compressão do resultado do backup reduz os requisitos de espaço, e a criptografia do resultado oferece uma melhor segurança contra o acesso não autorizado dos dados de backup. O MySQL em si não oferece essas capacidades. O produto MySQL Enterprise Backup pode comprimir backups de `InnoDB`, e a compressão ou criptografia do resultado do backup pode ser realizada usando utilitários do sistema de arquivos. Outras soluções de terceiros podem estar disponíveis.
