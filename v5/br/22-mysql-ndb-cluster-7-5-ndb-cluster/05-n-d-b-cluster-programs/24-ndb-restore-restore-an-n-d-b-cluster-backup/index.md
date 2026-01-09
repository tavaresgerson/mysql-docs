### 21.5.24 ndb\_restore — Restaurar um backup de um cluster NDB

21.5.24.1 Restauração de um backup do NDB para uma versão diferente do NDB Cluster

21.5.24.2 Restauração para um número diferente de nós de dados

O programa de restauração do NDB Cluster é implementado como um utilitário separado de linha de comando **ndb\_restore**, que normalmente pode ser encontrado no diretório `bin` do MySQL. Este programa lê os arquivos criados como resultado do backup e insere as informações armazenadas no banco de dados.

Nota

A partir do NDB 7.5.15 e 7.6.11, este programa não imprime mais `NDBT_ProgramExit: ...` quando termina sua execução. As aplicações que dependem desse comportamento devem ser modificadas conforme necessário ao atualizar de versões anteriores.

**ndb\_restore** deve ser executado uma vez para cada um dos arquivos de backup criados pelo comando `START BACKUP` usado para criar o backup (veja Seção 21.6.8.2, “Usando o NDB Cluster Management Client para Criar um Backup”). Isso é igual ao número de nós de dados no cluster no momento em que o backup foi criado.

Nota

Antes de usar **ndb\_restore**, recomenda-se que o clúster esteja em modo de usuário único, a menos que você esteja restaurando vários nós de dados em paralelo. Consulte Seção 21.6.6, “Modo de Usuário Único do Clúster NDB” para obter mais informações.

As opções que podem ser usadas com **ndb\_restore** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.38 Opções de linha de comando usadas com o programa ndb\_restore**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Permitir que as alterações sejam feitas no conjunto de colunas que compõem a chave primária da tabela</td> <td><p>ADICIONADO: NDB 7.6.14</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Adicione dados a um arquivo separado por tabulação</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>] </p></th> <td>Caminho para o diretório de arquivos de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Restaurar a partir do backup com este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>] </p></th> <td>Alias para --connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_append">--append</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>]] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>]] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>]] </p></th> <td>Isto faz com que os índices dos backups sejam ignorados; pode diminuir o tempo necessário para restaurar os dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>]] </p></th> <td>Não ignore a tabela do sistema durante a restauração; experimental; não para uso em produção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>]] </p></th> <td>Lista de uma ou mais bases de dados para excluir (inclui aquelas não nomeadas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Não restaure nenhuma tabela intermediária (com nomes prefixados por '#sql-') que ficaram para trás das operações de ALTER TABLE; especifique FALSE para restaurar essas tabelas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>As colunas das versões de backup da tabela que estão faltando na versão da tabela no banco de dados serão ignoradas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>] </p></th> <td>As tabelas de backup que estão faltando no banco de dados serão ignoradas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Lista de uma ou mais tabelas a serem excluídas (inclui aquelas da mesma base de dados que não tenham um nome); cada referência de tabela deve incluir o nome da base de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Campos são delimitados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Os campos são opcionalmente delimitados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>] </p></th> <td>Os campos são encerrados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path">--backup-path=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>] </p></th> <td>Imprimir tipos binários no formato hexadecimal</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Ignorar entradas de log que contenham atualizações de colunas agora incluídas na chave primária estendida</td> <td><p>ADICIONADO: NDB 7.6.14</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Lista de uma ou mais bases de dados para restaurar (excluindo aquelas que não estão nomeadas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>] </p></th> <td>Lista de uma ou mais tabelas para restaurar (excluindo aquelas na mesma base de dados que não tenham um nome); cada referência de tabela deve incluir o nome da base de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>As linhas são encerradas por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>] </p></th> <td>Permitir conversões com perda de dados de valores de coluna (tipo redução ou mudança de sinal) ao restaurar dados de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>] </p></th> <td>Se o mysqld estiver conectado e usando o registro binário, não registre os dados restaurados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">--backupid=#</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Não restaure objetos relacionados aos dados do disco</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>] </p></th> <td>Não atualize o tipo de matriz para atributos varsize que não redimensionem os dados VAR e não mude os atributos de coluna</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>] </p></th> <td>Especifique o mapa do grupo de nós; não utilizado, não suportado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>] </p></th> <td>ID do nó onde o backup foi feito</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Número de fatias a serem aplicadas ao restaurar por fatia</td> <td><p>ADICIONADO: NDB 7.6.13</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de transações paralelas a serem usadas durante a restauração dos dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>] </p></th> <td>Permitir a preservação de espaços finais (incluindo alinhamento) ao promover tipos de strings de largura fixa para tipos de largura variável</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>] </p></th> <td>Imprima metadados, dados e log no stdout (equivalente a --print-meta --print-data --print-log)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>] </p></th> <td>Imprimir dados no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Imprima o log no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>] </p></th> <td>Imprimir metadados no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Escreva o log SQL no stdout</td> <td><p>ADICIONADO: NDB 7.5.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Status de impressão do restauração de cada número dado de segundos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>] </p></th> <td>Permitir que atributos sejam promovidos ao restaurar dados de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>] </p></th> <td>Causa a reconstrução em múltiplos fios de índices ordenados encontrados em backups; o número de fios usados é determinado pela configuração BuildIndexThreads</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>] </p></th> <td>Aplicar deslocamento ao valor da coluna especificada usando a função e os argumentos indicados. O formato é [db].[tb<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>.[co<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>:[fn]:[arg<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>; consulte a documentação para obter detalhes</td> <td><p>ADICIONADO: NDB 7.6.14</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">--connect=connection_string</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Restaure os dados e os registros da tabela no NDB Cluster usando a API NDB</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>] </p></th> <td>Restaure as informações da época na tabela de status; útil em um cluster de replicação para iniciar a replicação; atualize ou insira uma linha no mysql.ndb_apply_status com o ID 0</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Restaure metadados no NDB Cluster usando a API NDB</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Restaure as tabelas de privilégios do MySQL que foram anteriormente movidas para o NDB</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>] </p></th> <td>Restaure para um banco de dados com um nome diferente; o formato é olddb, newdb</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>] </p></th> <td>Ignorar tabelas de blobs ausentes no arquivo de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>] </p></th> <td>Ignorar a verificação da estrutura da tabela durante a restauração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>Os objetos do esquema que não são reconhecidos pelo ndb_restore são ignorados ao restaurar o backup feito de uma versão mais nova do NDB para uma versão mais antiga</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">--connect-string=connection_string</a></code>] </p></th> <td>ID do corte, ao restaurar por cortes</td> <td><p>ADICIONADO: NDB 7.6.13</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_core-file">--core-file</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Cria um arquivo .txt separado por tabulação para cada tabela no caminho fornecido</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Prefixe todas as mensagens de informações, erros e depuração com timestamps</td> <td><p>ADICIONADO: NDB 7.5.30, 5.7.41-ndb-7.6.26</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes">--disable-indexes</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">--dont-ignore-systab-0</a></code>] </p></th> <td>Nível de verbosidade na saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_dont-ignore-systab-0">-f</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases">--exclude-databases=list</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--allow-pk-changes`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>

  Quando essa opção é definida como `1`, o **ndb\_restore** permite que as chaves primárias em uma definição de tabela diferem da mesma tabela no backup. Isso pode ser desejável ao fazer backup e restaurar entre diferentes versões do esquema com alterações nas chaves primárias em uma ou mais tabelas, e parece que realizar a operação de restauração usando ndb\_restore é mais simples ou mais eficiente do que emitir muitas instruções de `ALTER TABLE` após restaurar os esquemas e dados das tabelas.

  As seguintes alterações nas definições de chave primária são suportadas pelo `--allow-pk-changes`:

  - **Extensão da chave primária**: Uma coluna não nula que existe no esquema da tabela no backup se torna parte da chave primária da tabela no banco de dados.

    Importante

    Ao estender a chave primária de uma tabela, quaisquer colunas que se tornem parte da chave primária não devem ser atualizadas enquanto o backup estiver sendo feito; quaisquer atualizações desse tipo descobertas pelo **ndb\_restore** causam o falha da operação de restauração, mesmo quando não há alteração no valor. Em alguns casos, pode ser possível ignorar esse comportamento usando a opção `--ignore-extended-pk-updates`; consulte a descrição dessa opção para obter mais informações.

  - **Adicionando a chave primária (1)**: Uma coluna que já faz parte da chave primária da tabela no esquema de backup não faz mais parte da chave primária, mas permanece na tabela.

  - **Conectando a chave primária (2)**: Uma coluna que já faz parte da chave primária da tabela no esquema de backup é removida da tabela completamente.

  Essas diferenças podem ser combinadas com outras diferenças de esquema suportadas pelo **ndb\_restore**, incluindo alterações em colunas de blob e texto que exigem o uso de tabelas de preparação.

  Aqui estão os passos básicos em um cenário típico que envolve alterações no esquema de chave primária:

  1. Restaure os esquemas de tabelas usando **ndb\_restore** com a opção `--restore-meta` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_restore-meta)

  2. Alterar o esquema para o desejado ou criá-lo

  3. Faça backup do esquema desejado

  4. Execute **ndb\_restore** com a opção `--disable-indexes` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_disable-indexes) usando o backup do passo anterior, para descartar índices e restrições

  5. Execute **ndb\_restore** `--allow-pk-changes` (possível com `--ignore-extended-pk-updates`, `--disable-indexes`, e possivelmente outras opções conforme necessário) para restaurar todos os dados

  6. Execute **ndb\_restore** `--rebuild-indexes` usando o backup feito com o esquema desejado, para reconstruir índices e restrições

  Ao estender a chave primária, pode ser necessário que **ndb\_restore** use um índice único secundário temporário durante a operação de restauração para mapear a antiga chave primária para a nova. Esse índice é criado apenas quando necessário para aplicar eventos do log de backup a uma tabela que tenha uma chave primária estendida. Esse índice é chamado de `NDB$RESTORE_PK_MAPPING` e é criado em cada tabela que o requer; ele pode ser compartilhado, se necessário, por múltiplas instâncias da **ndb\_restore** em execução em paralelo. (Executar **ndb\_restore** `--rebuild-indexes` no final do processo de restauração faz com que esse índice seja excluído.)

- `--append`

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>

  Quando usado com as opções `--tab` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_tab) e `--print-data` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_print-data), isso faz com que os dados sejam anexados a quaisquer arquivos existentes com nomes iguais.

- `--backup-path=*`dir\_name\`\*

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>

  O caminho para o diretório de backup é necessário; ele é fornecido para **ndb\_restore** usando a opção `--backup-path`, e deve incluir o subdiretório correspondente ao ID do backup do backup a ser restaurado. Por exemplo, se o `DataDir` do nó de dados for `/var/lib/mysql-cluster`, então o diretório de backup é `/var/lib/mysql-cluster/BACKUP`, e os arquivos de backup do backup com o ID 3 podem ser encontrados em `/var/lib/mysql-cluster/BACKUP/BACKUP-3`. O caminho pode ser absoluto ou relativo ao diretório em que o executável **ndb\_restore** está localizado, e pode ser precedido opcionalmente por `backup-path=`.

  É possível restaurar um backup para um banco de dados com uma configuração diferente daquela em que foi criado. Por exemplo, suponha que um backup com o ID `12`, criado em um clúster com dois nós de armazenamento com os IDs de nó `2` e `3`, deva ser restaurado para um clúster com quatro nós. Nesse caso, o **ndb\_restore** deve ser executado duas vezes — uma vez para cada nó de armazenamento no clúster onde o backup foi feito. No entanto, o **ndb\_restore** nem sempre pode restaurar backups feitos de um clúster que está executando uma versão do MySQL para um clúster que está executando uma versão diferente do MySQL. Consulte Seção 21.3.7, “Atualização e Downgrade do NDB Cluster” para obter mais informações.

  Importante

  Não é possível restaurar um backup feito a partir de uma versão mais recente do NDB Cluster usando uma versão mais antiga do **ndb\_restore**. Você pode restaurar um backup feito a partir de uma versão mais recente do MySQL para um cluster mais antigo, mas você deve usar uma cópia do **ndb\_restore** da versão mais recente do NDB Cluster para fazer isso.

  Por exemplo, para restaurar um backup de cluster feito de um cluster que está rodando o NDB Cluster 7.6.36 para um cluster que está rodando o NDB Cluster 7.5.36, você deve usar o **ndb\_restore** que vem com a distribuição do NDB Cluster 7.6.36.

  Para uma restauração mais rápida, os dados podem ser restaurados em paralelo, desde que haja um número suficiente de conexões de cluster disponíveis. Ou seja, ao restaurar para múltiplos nós em paralelo, você deve ter uma seção `[api]` ou `[mysqld]` no arquivo `config.ini` do cluster disponível para cada processo de restauração **ndb\_restore** concorrente. No entanto, os arquivos de dados devem ser aplicados sempre antes dos logs.

- `--backupid`=*`#`*, `-b`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>

  Esta opção é usada para especificar o ID ou o número de sequência do backup e é o mesmo número exibido pelo cliente de gerenciamento na mensagem `Backup backup_id completed` exibida após a conclusão de um backup. (Veja Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”).

  Importante

  Ao restaurar backups de clúster, você deve ter certeza de que restaura todos os nós de dados a partir de backups com o mesmo ID de backup. Usar arquivos de backups diferentes pode, no máximo, resultar na restauração do clúster a um estado inconsistente e pode falhar completamente.

  Em NDB 7.5.13 e versões posteriores, e em NDB 7.6.9 e versões posteriores, essa opção é obrigatória.

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect`, `-c`

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>

  Alias para `--ndb-connectstring`.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>0

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>1

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>2

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>3

  Leia também grupos com concatenação (grupo, sufixo).

- `--disable-indexes`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>4

  Desative a restauração de índices durante a restauração dos dados de um backup nativo do `NDB`. Em seguida, você pode restaurar os índices para todas as tabelas de uma vez com a construção de índices em múltiplos threads usando `--rebuild-indexes`, o que deve ser mais rápido do que reconstruir índices simultaneamente para tabelas muito grandes.

  A partir do NDB 7.5.24 e do NDB 7.6.20, essa opção também exclui todas as chaves estrangeiras especificadas no backup.

- `--dont-ignore-systab-0`, `-f`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>5

  Normalmente, ao restaurar dados de tabela e metadados, **ndb\_restore** ignora a cópia da tabela do sistema `NDB` presente no backup. `--dont-ignore-systab-0` faz com que a tabela do sistema seja restaurada. *Esta opção é destinada apenas para uso experimental e de desenvolvimento e não é recomendada em um ambiente de produção*.

- `--exclude-databases=*`db-list\`\*

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>6

  Lista delimitada por vírgula de uma ou mais bases de dados que não devem ser restauradas.

  Esta opção é frequentemente usada em combinação com `--exclude-tables`; consulte a descrição dessa opção para obter mais informações e exemplos.

- `--exclude-intermediate-sql-tables[`=*`TRUE|FALSE]`*

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>7

  Ao realizar operações de cópia de `ALTER TABLE` (alter-table.html), o **mysqld** cria tabelas intermediárias (cujos nomes são prefixados com `#sql-`). Quando `TRUE`, a opção `--exclude-intermediate-sql-tables` impede que o **ndb\_restore** restaure essas tabelas que possam ter sido deixadas para trás dessas operações. Esta opção está ativada por padrão.

- `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>8

  É possível restaurar apenas as colunas selecionadas da tabela usando essa opção, o que faz com que o **ndb\_restore** ignore quaisquer colunas ausentes das tabelas que estão sendo restauradas em comparação com as versões dessas tabelas encontradas no backup. Essa opção se aplica a todas as tabelas que estão sendo restauradas. Se você deseja aplicar essa opção apenas a tabelas ou bancos de dados selecionados, pode usá-la em combinação com uma ou mais das opções `--include-*` ou `--exclude-*` descritas em outra parte desta seção para fazer isso, e depois restaurar os dados para as tabelas restantes usando um conjunto complementar dessas opções.

- `--exclude-missing-tables`

  <table frame="box" rules="all" summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--allow-pk-changes[=0|<code class="literal">0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>9

  É possível restaurar apenas as tabelas selecionadas usando essa opção, o que faz com que o **ndb\_restore** ignore quaisquer tabelas do backup que não sejam encontradas no banco de dados de destino.

- `--exclude-tables=*``lista-de-tabelas`\*

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>0

  Lista de uma ou mais tabelas a serem excluídas; cada referência de tabela deve incluir o nome do banco de dados. Frequentemente usada em conjunto com `--exclude-databases`.

  Quando o `--exclude-databases` ou `--exclude-tables` é usado, apenas os bancos de dados ou tabelas nomeados pela opção são excluídos; todos os outros bancos de dados e tabelas são restaurados pelo **ndb\_restore**.

  Esta tabela mostra várias invocatórias do **ndb\_restore** usando as opções `--exclude-*` (outras opções que podem ser necessárias foram omitidas para maior clareza), e os efeitos que essas opções têm na restauração a partir de um backup do NDB Cluster:

  **Tabela 21.39: Várias invocatórias do ndb\_restore usando as opções --exclude-* e os efeitos dessas opções na restauração a partir de um backup do NDB Cluster.*\*

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>1

  Você pode usar essas duas opções juntas. Por exemplo, o seguinte comando restaura todas as tabelas em todos os bancos de dados *exceto* os bancos de dados `db1` e `db2`, e as tabelas `t1` e `t2` no banco de dados `db3`:

  ```sql
  $> ndb_restore [...] --exclude-databases=db1,db2 --exclude-tables=db3.t1,db3.t2
  ```

  (Novamente, omitimos outras opções que poderiam ser necessárias, por questões de clareza e brevidade, do exemplo mostrado anteriormente.)

  Você pode usar as opções `--include-*` e `--exclude-*` juntas, sujeito às seguintes regras:

  - As ações de todas as opções `--include-*` e `--exclude-*` são cumulativas.

  - Todas as opções `--include-*` e `--exclude-*` são avaliadas na ordem passada para ndb\_restore, da direita para a esquerda.

  - Em caso de opções conflitantes, a primeira (a mais à direita) tem precedência. Em outras palavras, a primeira opção (da direita para a esquerda) que corresponde a um banco de dados ou tabela específica "vence".

  Por exemplo, o seguinte conjunto de opções faz com que **ndb\_restore** restaure todas as tabelas do banco de dados `db1`, exceto `db1.t1`, sem restaurar outras tabelas de nenhum outro banco de dados:

  ```sql
  --include-databases=db1 --exclude-tables=db1.t1
  ```

  No entanto, inverter a ordem das opções acima simplesmente faz com que todas as tabelas do banco de dados `db1` sejam restauradas (incluindo `db1.t1`, mas sem tabelas de nenhum outro banco de dados), porque a opção `--include-databases`, sendo a mais à direita, é a primeira correspondência com o banco de dados `db1` e, portanto, tem precedência sobre qualquer outra opção que corresponda a `db1` ou a qualquer tabela em `db1`:

  ```sql
  --exclude-tables=db1.t1 --include-databases=db1
  ```

- `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>2

  Cada valor da coluna é delimitado pela string passada para esta opção (independentemente do tipo de dados; veja a descrição de `--fields-optionally-enclosed-by`).

- `--fields-optionally-enclosed-by`

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>3

  A cadeia passada para esta opção é usada para envolver os valores das colunas que contêm dados de caracteres (como `CHAR`, `VARCHAR`, `BINARY`, `TEXT` ou `ENUM`).

- `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>4

  A string passada para esta opção é usada para separar os valores das colunas. O valor padrão é um caractere de tabulação (`\t`).

- `--help`

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>5

  Exibir texto de ajuda e sair.

- `--hex`

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>6

  Se esta opção for usada, todos os valores binários serão exibidos no formato hexadecimal.

- `--ignore-extended-pk-updates`

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>7

  Ao usar a opção `--allow-pk-changes` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_allow-pk-changes), as colunas que se tornam parte da chave primária de uma tabela não devem ser atualizadas durante a criação do backup; essas colunas devem manter os mesmos valores do momento em que os valores são inseridos nelas até que as linhas que contêm os valores sejam excluídas. Se o **ndb\_restore** encontrar atualizações nessas colunas ao restaurar um backup, o processo de restauração falha. Como alguns aplicativos podem definir valores para todas as colunas ao atualizar uma linha, mesmo quando alguns valores das colunas não são alterados, o backup pode incluir eventos de log que parecem atualizar colunas que, na verdade, não são modificadas. Nesses casos, você pode definir `--ignore-extended-pk-updates` para `1`, forçando o **ndb\_restore** a ignorar tais atualizações.

  Importante

  Ao fazer com que essas atualizações sejam ignoradas, o usuário é responsável por garantir que não haja atualizações nos valores de quaisquer colunas que se tornem parte da chave primária.

  Para obter mais informações, consulte a descrição de `--allow-pk-changes`.

- `--include-databases=*`db-list\*

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>8

  Lista de vírgula separada de uma ou mais bases de dados a serem restauradas. Muitas vezes usada em conjunto com `--include-tables`; consulte a descrição dessa opção para obter mais informações e exemplos.

- `--include-tables=*``lista-de-tabelas`\*

  <table frame="box" rules="all" summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--append</code>]]</td> </tr></tbody></table>9

  Lista de tabelas separadas por vírgula para restaurar; cada referência de tabela deve incluir o nome do banco de dados.

  Quando o `--include-databases` ou `--include-tables` é usado, apenas os bancos de dados ou tabelas nomeados pela opção são restaurados; todos os outros bancos de dados e tabelas são excluídos pelo **ndb\_restore**, e não são restaurados.

  A tabela a seguir mostra várias invocatórias do **ndb\_restore** usando as opções `--include-*` (outras opções que podem ser necessárias foram omitidas para clareza), e os efeitos que elas têm na restauração a partir de um backup do NDB Cluster:

  **Tabela 21.40: Várias invocatórias do ndb\_restore usando as opções --include-* e seus efeitos na restauração a partir de um backup do NDB Cluster.*\*

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>0

  Você também pode usar essas duas opções juntas. Por exemplo, o seguinte comando restaura todas as tabelas nos bancos de dados `db1` e `db2`, juntamente com as tabelas `t1` e `t2` no banco de dados `db3` (e nenhuma outra base de dados ou tabela):

  ```sql
  $> ndb_restore [...] --include-databases=db1,db2 --include-tables=db3.t1,db3.t2
  ```

  (Mais uma vez, omitimos outras opções, possivelmente necessárias, no exemplo mostrado acima.)

  Também é possível restaurar apenas bancos de dados selecionados ou tabelas selecionadas de um único banco de dados, sem quaisquer opções `--include-*` (ou `--exclude-*`), usando a sintaxe mostrada aqui:

  ```sql
  ndb_restore other_options db_name,[db_name[,...] | tbl_name[,tbl_name][,...]]
  ```

  Em outras palavras, você pode especificar qualquer uma das seguintes opções para ser restaurada:

  - Todas as tabelas de um ou mais bancos de dados
  - Uma ou mais tabelas de um único banco de dados

- `--lines-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>1

  Especifica a string usada para encerrar cada linha de saída. O padrão é um caractere de nova linha (`\n`).

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>2

  Leia o caminho fornecido a partir do arquivo de login.

- `--lossy-conversions`, `-L`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>3

  Esta opção é destinada a complementar a opção `--promote-attributes`. O uso de `--lossy-conversions` permite conversões não-perfeitas de valores de coluna (reduções de tipo ou alterações no sinal) ao restaurar dados de backup. Com algumas exceções, as regras que regem a redução são as mesmas da replicação do MySQL; consulte Seção 16.4.1.10.2, “Replicação de Colunas com Diferentes Tipos de Dados” para obter informações sobre as conversões de tipo específicas atualmente suportadas pela redução de atributos.

  A partir do NDB 7.5.23 e do NDB 7.6.19, essa opção também permite restaurar uma coluna `NULL` como `NOT NULL`. A coluna não pode conter entradas `NULL`; caso contrário, o **ndb\_restore** pára com um erro.

  O **ndb\_restore** relata qualquer truncação de dados que ele realiza durante as conversões com perda uma vez por atributo e coluna.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>4

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>5

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodegroup-map=*`map`*, `-z\`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>6

  Destinado a restaurar um backup feito de um grupo de nós para um grupo de nós diferente, mas nunca completamente implementado; não é suportado.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>7

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>8

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-binlog`

  <table frame="box" rules="all" summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">./</code>]]</td> </tr></tbody></table>9

  Essa opção impede que quaisquer nós SQL conectados escrevam dados restaurados por **ndb\_restore** em seus logs binários.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>0

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--no-restore-disk-objects`, `-d`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>1

  Essa opção impede que o **ndb\_restore** restaure quaisquer objetos de dados de disco do NDB Cluster, como espaços de tabela e grupos de arquivos de log; consulte Seção 21.6.11, “Tabelas de Dados de Disco do NDB Cluster” para obter mais informações sobre esses objetos.

- `--no-upgrade`, `-u`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>2

  Ao usar **ndb\_restore** para restaurar um backup, as colunas `VARCHAR` criadas usando o antigo formato fixo são redimensionadas e recriadas usando o formato de largura variável agora empregado. Esse comportamento pode ser ignorado especificando `--no-upgrade`.

- `--nodeid`=*`#`*, `-n`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>3

  Especifique o ID do nó do nó de dados em que o backup foi feito.

  Ao restaurar um clúster com um número diferente de nós de dados daquele em que o backup foi feito, essas informações ajudam a identificar o conjunto ou conjuntos de arquivos corretos a serem restaurados a um determinado nó. (Nesses casos, geralmente é necessário restaurar vários arquivos a um único nó de dados.) Consulte Seção 21.5.24.2, “Restauração a um número diferente de nós de dados” para obter informações e exemplos adicionais.

  Em NDB 7.5.13 e versões posteriores, e em NDB 7.6.9 e versões posteriores, essa opção é obrigatória.

- `--num-slices=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>4

  Ao restaurar um backup por fatias, essa opção define o número de fatias em que o backup será dividido. Isso permite que múltiplas instâncias do **ndb\_restore** restauram subconjuntos disjuntos em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

  Um *slice* é um subconjunto dos dados em um backup específico; ou seja, é um conjunto de fragmentos com o mesmo ID de *slice*, especificado usando a opção `--slice-id`. As duas opções devem ser sempre usadas juntas, e o valor definido por `--slice-id` deve sempre ser menor que o número de *slices*.

  **ndb\_restore** encontra fragmentos e atribui a cada um um contador de fragmento. Ao restaurar por fatias, um ID de fatia é atribuído a cada fragmento; esse ID de fatia está no intervalo de 0 a 1 menos que o número de fatias. Para uma tabela que não é uma tabela de `BLOB`, a fatia à qual um determinado fragmento pertence é determinada usando a fórmula mostrada aqui:

  ```sql
  [slice_ID] = [fragment_counter] % [number_of_slices]
  ```

  Para uma tabela `BLOB` (blob.html), um contador de fragmentos não é usado; o número do fragmento é usado, juntamente com o ID da tabela principal para a tabela `BLOB` (lembre-se de que o `NDB` armazena os valores de `BLOB` em uma tabela separada internamente). Neste caso, o ID do corte para um fragmento dado é calculado da seguinte forma:

  ```sql
  [slice_ID] =
  ([main_table_ID] + [fragment_ID]) % [number_of_slices]
  ```

  Assim, restaurar por *`N`* fatias significa executar *`N`* instâncias de **ndb\_restore**, todas com `--num-slices=N` (junto com quaisquer outras opções necessárias) e uma para cada com `--slice-id=1`, `--slice-id=2`, `--slice-id=3`, e assim por diante até `slice-id=N-1`.

- `--parallelism=*#`, `-p`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>5

  **ndb\_restore** utiliza transações de uma única linha para aplicar muitas linhas simultaneamente. Este parâmetro determina o número de transações paralelas (linhas concorrentes) que uma instância de **ndb\_restore** tenta usar. Por padrão, este é 128; o mínimo é 1 e o máximo é 1024.

  O trabalho de execução dos insertos é realizado em paralelo em todos os fios dos nós de dados envolvidos. Esse mecanismo é empregado para restaurar dados em massa a partir do arquivo `.Data`, ou seja, o instantâneo desfocado dos dados; ele não é usado para criar ou reconstruir índices. O log de alterações é aplicado seriamente; as operações de criação e reconstrução de índices são operações DDL e são tratadas separadamente. Não há paralelismo em nível de fio no lado do cliente do restauro.

- `--preserve-trailing-spaces`, `-P`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>6

  Mantenha os espaços finais preservados ao promover um tipo de dados de caracteres de largura fixa para o equivalente de largura variável — ou seja, ao promover um valor da coluna `CHAR` para `VARCHAR` ou um valor de coluna `BINARY` para `VARBINARY`. Caso contrário, quaisquer espaços finais são eliminados desses valores de coluna quando eles são inseridos nas novas colunas.

  Nota

  Embora você possa promover colunas de tipo `CHAR` para colunas de tipo `VARCHAR` e colunas de tipo `BINARY` para colunas de tipo `VARBINARY`, você não pode promover colunas de tipo `VARCHAR` para colunas de tipo `CHAR` ou colunas de tipo `VARBINARY` para `BINARY`.

- `--print`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>7

  Faz com que **ndb\_restore** imprima todos os dados, metadados e logs no `stdout`. É equivalente ao uso das opções `--print-data`, `--print-meta` e `--print-log` juntas.

  Nota

  O uso de `--print` ou qualquer uma das opções `--print_*` está efetuando uma execução em seco. Incluir uma ou mais dessas opções faz com que qualquer saída seja redirecionada para `stdout`; nesses casos, **ndb\_restore** não tenta restaurar dados ou metadados em um NDB Cluster.

- `--print-data`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>8

  Faça com que **ndb\_restore** direcione sua saída para `stdout`. Muitas vezes usado em conjunto com uma ou mais das opções `--tab` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_tab), `--fields-enclosed-by` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_fields-enclosed-by), `--fields-optionally-enclosed-by` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_fields-optionally-enclosed-by), `--fields-terminated-by` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_fields-terminated-by), `--hex` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_hex) e `--append` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_append).

  Os valores das colunas `TEXT` e `BLOB` são sempre truncados. Esses valores são truncados para os primeiros 256 bytes na saída. Isso atualmente não pode ser sobrescrito ao usar `--print-data`.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">none</code>]]</td> </tr></tbody></table>9

  Imprima a lista de argumentos do programa e saia.

- `--print-log`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Faça com que **ndb\_restore** exiba seu log no `stdout`.

- `--print-meta`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Imprima todos os metadados no `stdout`.

- `print-sql-log`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  Registre as instruções SQL no `stdout`. Use a opção para habilitar; normalmente, esse comportamento está desativado. A opção verifica se todas as tabelas sendo restauradas têm chaves primárias explicitamente definidas antes de tentar registrar; consultas em uma tabela que tenha apenas a chave primária oculta implementada pelo `NDB` não podem ser convertidas em SQL válido.

  Esta opção não funciona com tabelas que possuem colunas `BLOB` (blob.html).

  A opção `--print-sql-log` foi adicionada no NDB 7.5.4. (Bug #13511949)

- `--progress-frequency=*`N\`\*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  Imprima um relatório de status a cada *`N`* segundos enquanto o backup estiver em andamento. 0 (o padrão) não imprime relatórios de status. O máximo é 65535.

- `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  O **ndb\_restore** suporta a promoção limitada de atributos da mesma maneira que é suportada pela replicação do MySQL; ou seja, os dados respaldados a partir de uma coluna de um tipo específico geralmente podem ser restaurados para uma coluna usando um tipo “maior e semelhante”. Por exemplo, os dados de uma coluna `CHAR(20)` podem ser restaurados para uma coluna declarada como `VARCHAR(20)`, `VARCHAR(30)` ou `CHAR(30)`; os dados de uma coluna `MEDIUMINT` podem ser restaurados para uma coluna do tipo `INT` ou `BIGINT`. Consulte Seção 16.4.1.10.2, “Replicação de Colunas com Diferentes Tipos de Dados” para uma tabela de conversões de tipos atualmente suportada pela promoção de atributos.

  A partir do NDB 7.5.23 e do NDB 7.6.19, essa opção também permite restaurar uma coluna `NOT NULL` como `NULL`.

  A promoção de atributos por **ndb\_restore** deve ser habilitada explicitamente, conforme a seguir:

  1. Prepare a tabela para a qual o backup deve ser restaurado. **ndb\_restore** não pode ser usado para recriar a tabela com uma definição diferente da original; isso significa que você deve criar a tabela manualmente ou alterar as colunas que deseja promover usando `ALTER TABLE` após restaurar os metadados da tabela, mas antes de restaurar os dados.

  2. Invoque **ndb\_restore** com a opção `--promote-attributes` (forma abreviada `-A`) ao restaurar os dados da tabela. A promoção de atributos não ocorre se essa opção não for usada; em vez disso, a operação de restauração falha com um erro.

  Ao converter entre tipos de dados de caracteres e `TEXT` ou `BLOB`, apenas as conversões entre tipos de caracteres (`CHAR` e `VARCHAR`) e tipos binários (`BINARY` e `VARBINARY`) podem ser realizadas ao mesmo tempo. Por exemplo, você não pode promover uma coluna de `INT` para `BIGINT` enquanto promove uma coluna `VARCHAR` para `TEXT` na mesma invocação de **ndb\_restore**.

  A conversão entre colunas de `[TEXT]` (blob.html) usando diferentes conjuntos de caracteres não é suportada e é expressamente proibida.

  Ao realizar conversões de tipos de caracteres ou binários para `TEXT` ou `BLOB` com **ndb\_restore**, você pode notar que ele cria e usa uma ou mais tabelas de preparação com o nome `table_name$STnode_id`. Essas tabelas não são necessárias depois disso e, normalmente, são excluídas pelo **ndb\_restore** após uma restauração bem-sucedida.

- `--rebuild-indexes`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Ative a reconstrução multisserial dos índices ordenados durante a restauração de um backup nativo do `NDB`. O número de threads usados para a construção de índices ordenados pelo **ndb\_restore** com esta opção é controlado pelo parâmetro de configuração do nó de dados `BuildIndexThreads` e pelo número de LDMs.

  É necessário usar essa opção apenas na primeira execução de **ndb\_restore**; isso faz com que todos os índices ordenados sejam reconstruídos sem usar `--rebuild-indexes` novamente ao restaurar nós subsequentes. Você deve usar essa opção antes de inserir novas linhas no banco de dados; caso contrário, é possível que uma linha seja inserida que, posteriormente, cause uma violação da restrição de unicidade ao tentar reconstruir os índices.

  A construção de índices ordenados é paralela ao número de LDMs por padrão. A construção de índices offline realizada durante reinicializações de nós e sistemas pode ser feita mais rapidamente usando o parâmetro de configuração do nó de dados `BuildIndexThreads`; este parâmetro não tem efeito na remoção e reconstrução de índices pelo **ndb\_restore**, que é realizado online.

  A reconstrução de índices únicos utiliza a largura de banda de escrita em disco para o registro de redo e o checkpoint local. Uma quantidade insuficiente dessa largura de banda pode levar a erros de sobrecarga do buffer de redo ou de sobrecarga do log. Nesses casos, você pode executar novamente **ndb\_restore** `--rebuild-indexes`; o processo é retomado no ponto em que o erro ocorreu. Você também pode fazer isso quando encontrou erros temporários. Você pode repetir a execução de **ndb\_restore** `--rebuild-indexes` indefinidamente; você pode ser capaz de parar tais erros reduzindo o valor de `--parallelism`. Se o problema for espaço insuficiente, você pode aumentar o tamanho do log de redo (`FragmentLogFileSize` parâmetro de configuração do nó) ou você pode aumentar a velocidade com que os LCPs são realizados (`MaxDiskWriteSpeed` e parâmetros relacionados), a fim de liberar o espaço mais rapidamente.

- `--remap-column=db.tbl.col:fn:args`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Quando usado juntamente com `--restore-data`, esta opção aplica uma função ao valor da coluna indicada. Os valores na string de argumento estão listados aqui:

  - *`db`*: Nome do banco de dados, após quaisquer renomeações realizadas pelo `--rewrite-database`.

  - *`tbl`*: Nome da tabela.

  - *`col`*: Nome da coluna a ser atualizada. Essa coluna deve ser do tipo `INT` ou `BIGINT`. A coluna também pode ser, mas não é obrigatório que seja `UNSIGNED`.

  - *`fn`*: Nome da função; atualmente, o único nome suportado é `offset`.

  - *`args`*: Argumentos fornecidos à função. Atualmente, apenas um único argumento, o tamanho do deslocamento a ser adicionado pela função `offset`, é suportado. Valores negativos são suportados. O tamanho do argumento não pode exceder o da variante assinada do tipo da coluna; por exemplo, se *`col`* for uma coluna `INT`, então o intervalo permitido do argumento passado para a função `offset` é `-2147483648` a `2147483647` (veja Seção 11.1.2, “Tipos Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”).

    Se a aplicação do valor de deslocamento à coluna causar um excesso ou escassez, a operação de restauração falhará. Isso pode acontecer, por exemplo, se a coluna for `BIGINT` e a opção tentar aplicar um valor de deslocamento de 8 em uma linha em que o valor da coluna é 4294967291, pois `4294967291 + 8 = 4294967299 > 4294967295`.

  Esta opção pode ser útil quando você deseja mesclar dados armazenados em múltiplas instâncias de origem do NDB Cluster (todas usando o mesmo esquema) em um único NDB Cluster de destino, usando o backup nativo do NDB (consulte Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e **ndb\_restore** para mesclar os dados, onde os valores de chave primária e exclusiva estão sobrepostos entre os clusters de origem, e é necessário como parte do processo remapea-los para faixas que não se sobreponham. Também pode ser necessário preservar outras relações entre tabelas. Para atender a esses requisitos, é possível usar a opção várias vezes na mesma invocação de **ndb\_restore** para remapea-las colunas de diferentes tabelas, como mostrado aqui:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.id:offset:1000 \
      --remap-column=hr.manager.id:offset:1000 --remap-column=hr.firstaiders.id:offset:1000
  ```

  (Outras opções não mostradas aqui também podem ser usadas.)

  `--remap-column` também pode ser usado para atualizar várias colunas da mesma tabela. Combinações de várias tabelas e colunas são possíveis. Diferentes valores de deslocamento também podem ser usados para diferentes colunas da mesma tabela, como este:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.salary:offset:10000 \
      --remap-column=hr.employee.hours:offset:-10
  ```

  Quando os backups de origem contêm tabelas duplicadas que não devem ser mescladas, você pode lidar com isso usando `--exclude-tables`, `--exclude-databases` ou por outros meios em sua aplicação.

  Informações sobre a estrutura e outras características das tabelas a serem unidas podem ser obtidas usando `SHOW CREATE TABLE`; a ferramenta **ndb\_desc**; e `MAX()`, `MIN()`, `LAST_INSERT_ID()` e outras funções do MySQL.

  A replicação de alterações de tabelas unidas para tabelas não unidas ou de tabelas não unidas para tabelas unidas em instâncias separadas do NDB Cluster não é suportada.

- `--restore-data`, `-r`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Exiba os dados e os logs da tabela `[`NDB\`]\(mysql-cluster.html).

- `--restore-epoch`, `-e`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Adicione (ou restaure) informações de época à tabela de status da replicação do clúster. Isso é útil para iniciar a replicação em um clúster de replica NDB. Quando essa opção é usada, a linha no `mysql.ndb_apply_status` que tem `0` na coluna `id` é atualizada se ela já existir; uma nova linha é inserida se ela ainda não existir. (Veja Seção 21.7.9, “Backup de Clúster NDB com Replicação de Clúster NDB”).

- `--restore-meta`, `-m`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>9

  Essa opção faz com que **ndb\_restore** imprima os metadados da tabela `**NDB**`.

  A primeira vez que você executar o programa de restauração **ndb\_restore**, você também precisa restaurar os metadados. Em outras palavras, você deve recriar as tabelas do banco de dados — isso pode ser feito executando-o com a opção `--restore-meta` (`-m`). A restauração dos metadados deve ser feita apenas em um único nó de dados; isso é suficiente para restaurá-los para todo o clúster.

  Em versões mais antigas do NDB Cluster, as tabelas cujos esquemas foram restaurados usando essa opção usavam o mesmo número de partições que tinham no cluster original, mesmo que ele tivesse um número diferente de nós de dados em relação ao novo cluster. No NDB 7.5.2 e versões posteriores, ao restaurar metadados, isso não é mais um problema; o **ndb\_restore** agora usa o número padrão de partições para o cluster de destino, a menos que o número de threads do gerenciador de dados local também seja alterado em relação ao que era para os nós de dados no cluster original.

  Nota

  O clúster deve ter um banco de dados vazio ao iniciar a restauração de um backup. (Em outras palavras, você deve iniciar os nós de dados com `--initial` antes de realizar a restauração.)

- `--restore-privilege-tables`

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>0

  **ndb\_restore** não restaura, por padrão, as tabelas de privilégios distribuídas do MySQL. Esta opção faz com que **ndb\_restore** restaure as tabelas de privilégios.

  Isso só funciona se as tabelas de privilégios foram convertidas para `NDB` antes de fazer o backup. Para mais informações, consulte Seção 21.6.13, “Privilégios Distribuídos Usando Tabelas de Concessão Compartilhadas”.

- `--rewrite-database=*`olddb,newdb\`\*

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>1

  Essa opção permite restaurar um banco de dados com um nome diferente do usado no backup. Por exemplo, se um backup for feito de um banco de dados chamado `produtos`, você pode restaurar os dados que ele contém para um banco de dados chamado `inventário`, usando essa opção conforme mostrado aqui (omitiendo quaisquer outras opções que possam ser necessárias):

  ```sql
  $> ndb_restore --rewrite-database=product,inventory
  ```

  A opção pode ser usada várias vezes em uma única invocação de **ndb\_restore**. Assim, é possível restaurar simultaneamente de um banco de dados chamado `db1` para um banco de dados chamado `db2` e de um banco de dados chamado `db3` para um chamado `db4` usando `--rewrite-database=db1,db2 --rewrite-database=db3,db4`. Outras opções de **ndb\_restore** podem ser usadas entre múltiplas ocorrências de `--rewrite-database`.

  Em caso de conflitos entre várias opções de `--rewrite-database`, a última opção de `--rewrite-database` usada, lendo da esquerda para a direita, é a que tem efeito. Por exemplo, se `--rewrite-database=db1,db2 --rewrite-database=db1,db3` for usada, apenas `--rewrite-database=db1,db3` será considerada, e `--rewrite-database=db1,db2` será ignorada. Também é possível restaurar de múltiplas bases de dados para uma única base de dados, de modo que `--rewrite-database=db1,db3 --rewrite-database=db2,db3` restaura todas as tabelas e dados das bases de dados `db1` e `db2` para a base de dados `db3`.

  Importante

  Ao restaurar de múltiplas bases de dados de backup para uma única base de dados de destino usando `--rewrite-database`, não é feita nenhuma verificação para colisões entre nomes de tabelas ou outros objetos, e a ordem em que as linhas são restauradas não é garantida. Isso significa que, nesses casos, é possível que as linhas sejam sobrescritas e as atualizações sejam perdidas.

- `--skip-broken-objects`

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>2

  Essa opção faz com que **ndb\_restore** ignore tabelas corrompidas ao ler um backup nativo do `NDB` e continue restaurando quaisquer tabelas restantes (que não estejam também corrompidas). Atualmente, a opção `--skip-broken-objects` funciona apenas no caso de tabelas de partes de blob ausentes.

- `--skip-table-check`, `-s`

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>3

  É possível restaurar dados sem restaurar os metadados da tabela. Por padrão, ao fazer isso, o **ndb\_restore** falha com um erro se uma incompatibilidade for encontrada entre os dados da tabela e o esquema da tabela; essa opção substitui esse comportamento.

  Algumas das restrições sobre desalinhamentos nas definições de colunas ao restaurar dados usando **ndb\_restore** foram relaxadas; quando um desses tipos de desalinhamentos é encontrado, **ndb\_restore** não para com um erro como fazia anteriormente, mas sim aceita os dados e os insere na tabela de destino, emitindo um aviso ao usuário de que isso está sendo feito. Esse comportamento ocorre independentemente de uma das opções `--skip-table-check` ou `--promote-attributes` estar em uso. Essas diferenças nas definições de colunas são dos seguintes tipos:

  - Diferentes configurações de `COLUMN_FORMAT` (`FIXED`, `DYNAMIC`, `DEFAULT`)

  - Diferentes configurações de `STORAGE` (`MEMORY`, `DISK`)

  - Diferentes valores padrão

  - Diferentes configurações da chave de distribuição

- `--skip-unknown-objects`

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>4

  Essa opção faz com que **ndb\_restore** ignore quaisquer objetos de esquema que não reconheça ao ler um backup nativo do `NDB`. Isso pode ser usado para restaurar um backup feito de um cluster que está rodando, por exemplo, NDB 7.6, para um cluster que está rodando o NDB Cluster 7.5.

- `--slice-id`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>5

  Ao restaurar por fatias, este é o ID da fatia a ser restaurada. Esta opção é sempre usada juntamente com `--num-slices`, e seu valor deve ser sempre menor que o de `--num-slices`.

  Para obter mais informações, consulte a descrição da opção `--num-slices` em outro lugar nesta seção.

- `--tab=*`nome\_pasta\`\`, `-T` *`nome_pasta`*

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>6

  A opção `--print-data` cria arquivos de dump, um por tabela, cada um com o nome `tbl_name.txt`. Ela requer como argumento o caminho para o diretório onde os arquivos devem ser salvos; use `.` para o diretório atual.

- `--timestamp-printouts`

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>7

  As mensagens de informações, erros e logs de depuração são prefixadas com timestamps.

  Esta opção está desabilitada por padrão no NDB 7.5 e no NDB 7.6. Defina explicitamente como `true` para a habilitar.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>8

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose=*`#\*

  <table frame="box" rules="all" summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost:1186</code>]]</td> </tr></tbody></table>9

  Define o nível de detalhamento da saída. O valor mínimo é 0; o máximo é 255. O valor padrão é 1.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>0

  Exibir informações da versão e sair.

As opções típicas para este utilitário são mostradas aqui:

```sql
ndb_restore [-c connection_string] -n node_id -b backup_id \
      [-m] -r --backup-path=/path/to/backup/files
```

Normalmente, ao restaurar de um backup de um NDB Cluster, **ndb\_restore** requer, no mínimo, as opções `--nodeid` (forma abreviada: `-n`), `--backupid` (forma abreviada: `-b`) e `--backup-path` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_backup-path). Além disso, quando **ndb\_restore** é usado para restaurar tabelas que contêm índices únicos, você deve incluir as opções `--disable-indexes` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_disable-indexes) ou `--rebuild-indexes` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_rebuild-indexes). (Bug #57782, Bug #11764893)

A opção `-c` é usada para especificar uma string de conexão que indica ao `ndb_restore` onde localizar o servidor de gerenciamento do clúster (consulte Seção 21.4.3.3, “Strings de Conexão de NDB Cluster”). Se essa opção não for usada, o **ndb\_restore** tentará se conectar a um servidor de gerenciamento em `localhost:1186`. Esse utilitário atua como um nó da API do clúster e, portanto, requer um “slot” de conexão livre para se conectar ao servidor de gerenciamento do clúster. Isso significa que deve haver pelo menos uma seção `[api]` ou `[mysqld]` que possa ser usada por ele no arquivo `config.ini` do clúster. É uma boa ideia manter pelo menos uma seção `[api]` ou `[mysqld]` vazia em `config.ini` que não esteja sendo usada por um servidor MySQL ou outra aplicação por essa razão (consulte Seção 21.4.3.7, “Definindo Nodos SQL e Outros Nodos API em um NDB Cluster”).

Você pode verificar se **ndb\_restore** está conectado ao clúster usando o comando `SHOW` no cliente de gerenciamento **ndb\_mgm**. Você também pode fazer isso a partir de uma janela de sistema, como mostrado aqui:

```sql
$> ndb_mgm -e "SHOW"
```

**Relatório de erros.** **ndb\_restore** relata tanto erros temporários quanto permanentes. No caso de erros temporários, ele pode ser capaz de recuperá-los, e, nesses casos, relata `Restauração bem-sucedida, mas ocorreu um erro temporário, consulte a configuração`.

Importante

Após usar **ndb\_restore** para inicializar um NDB Cluster para uso na replicação circular, os logs binários no nó SQL que atua como replica não são criados automaticamente e você deve criar manualmente. Para criar os logs binários, execute uma declaração `SHOW TABLES` nesse nó SQL antes de executar `START SLAVE`. Esse é um problema conhecido no NDB Cluster.
