## 9.1 Tipos de Backup e Recuperação

Esta seção descreve as características dos diferentes tipos de backups.

### Backups Físicos (Brutos) Contra Backups Lógicos

Os backups físicos consistem em cópias brutas dos diretórios e arquivos que armazenam o conteúdo do banco de dados. Esse tipo de backup é adequado para grandes bancos de dados importantes que precisam ser recuperados rapidamente quando ocorrem problemas.

Os backups lógicos salvam informações representadas como estrutura lógica do banco de dados (`CREATE DATABASE`, `CREATE TABLE` instruções) e conteúdo (`INSERT` instruções ou arquivos de texto delimitado). Esse tipo de backup é adequado para quantidades menores de dados onde você pode editar os valores dos dados ou a estrutura da tabela, ou recriar os dados em uma arquitetura de máquina diferente.

Os métodos de backup físico têm essas características:

* O backup consiste em cópias exatas dos diretórios e arquivos do banco de dados. Tipicamente, é uma cópia de todo ou parte do diretório de dados MySQL.

* Os métodos de backup físico são mais rápidos que os lógicos porque envolvem apenas a cópia de arquivos sem conversão.

* A saída é mais compacta que a dos backups lógicos.
* Como a velocidade de backup e a compactação são importantes para bancos de dados importantes e ocupados, o produto MySQL Enterprise Backup realiza backups físicos. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.

* A granularidade do backup e restauração varia do nível de todo o diretório de dados até o nível de arquivos individuais. Isso pode ou não fornecer granularidade de nível de tabela, dependendo do mecanismo de armazenamento. Por exemplo, as tabelas `InnoDB` podem estar em um arquivo separado ou compartilhar armazenamento de arquivo com outras tabelas `InnoDB`; cada tabela `MyISAM` corresponde de forma única a um conjunto de arquivos.

* Além das bases de dados, o backup pode incluir quaisquer arquivos relacionados, como arquivos de log ou de configuração.

* Os dados das tabelas `MEMORY` são difíceis de fazer backup dessa maneira, pois seus conteúdos não são armazenados em disco. (O produto MySQL Enterprise Backup tem uma funcionalidade que permite recuperar dados das tabelas `MEMORY` durante um backup.)

* Os backups são portáteis apenas para outras máquinas que tenham características de hardware idênticas ou semelhantes.

* Os backups podem ser realizados enquanto o servidor MySQL não está em execução. Se o servidor estiver em execução, é necessário realizar o bloqueio apropriado para que o servidor não mude o conteúdo da base de dados durante o backup. O MySQL Enterprise Backup realiza esse bloqueio automaticamente para as tabelas que exigem isso.

* As ferramentas de backup físico incluem o **mysqlbackup** do MySQL Enterprise Backup para `InnoDB` ou quaisquer outras tabelas, ou comandos de nível de sistema de arquivos (como **cp**, **scp**, **tar**, **rsync**) para tabelas `MyISAM`.

* Para a restauração:

  + O MySQL Enterprise Backup restaura `InnoDB` e outras tabelas que ele fez backup.

  + O **ndb\_restore** restaura tabelas `NDB`.

  + Arquivos copiados em nível de sistema de arquivos podem ser copiados de volta para seus locais originais com comandos de sistema de arquivos.

Os métodos de backup lógicos têm essas características:

* O backup é feito consultando o servidor MySQL para obter informações sobre a estrutura e o conteúdo da base de dados.

* O backup é mais lento que os métodos físicos porque o servidor deve acessar as informações da base de dados e convertê-las para o formato lógico. Se a saída for escrita no lado do cliente, o servidor também deve enviá-la para o programa de backup.

* A saída é maior que no backup físico, particularmente quando salva em formato de texto.

* A granularidade de backup e restauração está disponível no nível do servidor (todas as bases de dados), no nível do banco de dados (todas as tabelas de um banco de dados específico) ou no nível da tabela. Isso é verdade independentemente do mecanismo de armazenamento.

* O backup não inclui arquivos de log ou de configuração, ou outros arquivos relacionados ao banco de dados que não fazem parte das bases de dados.

* Os backups armazenados no formato lógico são independentes da máquina e altamente portáteis.

* Os backups lógicos são realizados com o servidor MySQL em execução. O servidor não é desligado.

* As ferramentas de backup lógico incluem o programa **mysqldump** e a instrução `SELECT ... INTO OUTFILE`. Elas funcionam para qualquer mecanismo de armazenamento, mesmo o `MEMORY`.

* Para restaurar backups lógicos, arquivos de dump no formato SQL podem ser processados usando o cliente **mysql**. Para carregar arquivos de texto delimitados, use a instrução `LOAD DATA` ou o cliente **mysqlimport**.

### Backup Online versus Offline

Os backups online ocorrem enquanto o servidor MySQL está em execução, para que as informações da base de dados possam ser obtidas do servidor. Os backups offline ocorrem enquanto o servidor está parado. Essa distinção também pode ser descrita como backups "quentes" versus backups "frios"; um backup "quente" é aquele em que o servidor permanece em execução, mas bloqueado para modificar dados enquanto você acessa os arquivos da base de dados externamente.

Os métodos de backup online têm essas características:

* O backup é menos intrusivo para outros clientes, que podem se conectar ao servidor MySQL durante o backup e podem ter acesso aos dados, dependendo das operações que precisam realizar.

* É necessário tomar cuidado para impor bloqueios apropriados para que as modificações de dados não ocorram de forma a comprometer a integridade do backup. O produto MySQL Enterprise Backup realiza esse bloqueio automaticamente.

Os métodos de backup offline têm essas características:

* Os clientes podem ser afetados negativamente porque o servidor está indisponível durante o backup. Por essa razão, esses backups são frequentemente feitos a partir de uma replica que pode ser desconectada sem prejudicar a disponibilidade.

* O procedimento de backup é mais simples porque não há possibilidade de interferência da atividade do cliente.

Uma distinção semelhante entre backups online e offline se aplica às operações de recuperação, e características semelhantes se aplicam. No entanto, é mais provável que os clientes sejam afetados pela recuperação online do que pelo backup online, porque a recuperação requer bloqueio mais forte. Durante o backup, os clientes podem ser capazes de ler dados enquanto estão sendo gravados, mas a recuperação modifica os dados e não apenas os lê, então os clientes devem ser impedidos de acessar os dados enquanto estão sendo restaurados.

### Backups Locais versus Remotas

Um backup local é realizado no mesmo host onde o servidor MySQL está rodando, enquanto um backup remoto é feito a partir de um host diferente. Para alguns tipos de backups, o backup pode ser iniciado a partir de um host remoto, mesmo que a saída seja escrita localmente no servidor.

* O **mysqldump** pode se conectar a servidores locais ou remotos. Para a saída SQL (`CREATE` e `INSERT` instruções), backups locais ou remotos podem ser feitos e gerar saída no cliente. Para a saída de texto delimitado (com a opção `--tab`), os arquivos de dados são criados no host do servidor.

* `SELECT ... INTO OUTFILE` pode ser iniciado a partir de um host cliente local ou remoto, mas o arquivo de saída é criado no host do servidor.

* Métodos de backup físicos são tipicamente iniciados localmente no host do servidor MySQL para que o servidor possa ser desconectado, embora o destino dos arquivos copiados possa ser remoto.

### Backups de Instantâneo

Algumas implementações de sistemas de arquivos permitem a criação de "instantâneos". Esses fornecem cópias lógicas do sistema de arquivos em um determinado momento, sem a necessidade de uma cópia física de todo o sistema de arquivos. (Por exemplo, a implementação pode usar técnicas de cópia por escrita para que apenas as partes do sistema de arquivos modificadas após o momento do instantâneo precisem ser copiadas.) O próprio MySQL não fornece a capacidade de criar instantâneos de sistemas de arquivos. Eles estão disponíveis através de soluções de terceiros, como Veritas, LVM ou ZFS.

### Backups Completos versus Incrementais

Um backup completo inclui todos os dados gerenciados por um servidor MySQL em um determinado momento. Um backup incremental consiste nas alterações feitas nos dados durante um determinado período de tempo (de um momento para outro). O MySQL tem diferentes maneiras de realizar backups completos, como as descritas anteriormente nesta seção. Os backups incrementais são possíveis ao habilitar o log binário do servidor, que o servidor usa para registrar as alterações de dados.

### Recuperação Completa versus Recuperação em Ponto no Tempo (Incremental)

Uma recuperação completa restaura todos os dados de um backup completo. Isso restaura a instância do servidor ao estado em que ele estava quando o backup foi feito. Se esse estado não for suficientemente atual, uma recuperação completa pode ser seguida pela recuperação de backups incrementais feitos desde o backup completo, para trazer o servidor a um estado mais atualizado.

A recuperação incremental é a recuperação de alterações feitas durante um determinado período de tempo. Isso também é chamado de recuperação em um ponto no tempo, pois ele mantém o estado do servidor atualizado até um determinado momento. A recuperação em um ponto no tempo é baseada no log binário e, normalmente, segue uma recuperação completa a partir dos arquivos de backup que restauram o servidor ao seu estado quando o backup foi feito. Em seguida, as alterações de dados escritas nos arquivos do log binário são aplicadas como recuperação incremental para refazer as modificações de dados e restaurar o servidor ao ponto desejado no tempo.

### Manutenção de Tabelas

A integridade dos dados pode ser comprometida se as tabelas ficarem corrompidas. Para tabelas `InnoDB`, isso não é um problema típico. Para que os programas possam verificar as tabelas `MyISAM` e repará-las se problemas forem encontrados, consulte a Seção 9.6, “Manutenção de Tabelas MyISAM e Recuperação em Caso de Falha”.

### Agendamento, Compressão e Criptografia de Backup

O agendamento de backup é valioso para automatizar os procedimentos de backup. A compressão do output do backup reduz os requisitos de espaço, e a criptografia do output fornece uma melhor segurança contra o acesso não autorizado dos dados de backup. O MySQL em si não oferece essas capacidades. O produto MySQL Enterprise Backup pode comprimir backups `InnoDB`, e a compressão ou criptografia do output do backup pode ser realizada usando utilitários do sistema de arquivos. Outras soluções de terceiros podem estar disponíveis.