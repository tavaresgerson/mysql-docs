### 25.5.23 ndb\_restore — Restaurar um backup de um cluster NDB

25.5.23.1 Restauração de um backup do NDB para uma versão diferente do cluster NDB

25.5.23.2 Restauração para um número diferente de nós de dados

25.5.23.3 Restauração a partir de um backup feito em paralelo

O programa de restauração do NDB Cluster é implementado como um utilitário separado de linha de comando **ndb\_restore**, que normalmente pode ser encontrado no diretório MySQL `bin`. Este programa lê os arquivos criados como resultado do backup e insere as informações armazenadas no banco de dados.

No NDB 7.6 e versões anteriores, este programa imprimia `NDBT_ProgramExit - status` após a conclusão de sua execução, devido a uma dependência desnecessária da biblioteca de teste `NDBT`. Essa dependência foi removida no NDB 8.0, eliminando a saída desnecessária.

O comando **ndb\_restore** deve ser executado uma vez para cada um dos arquivos de backup criados pelo comando `START BACKUP` usado para criar o backup (consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”). Isso é igual ao número de nós de dados no cluster no momento em que o backup foi criado.

Nota

Antes de usar o **ndb\_restore**, recomenda-se que o clúster esteja em modo de usuário único, a menos que você esteja restaurando vários nós de dados em paralelo. Consulte a Seção 25.6.6, “Modo de Usuário Único do Clúster NDB”, para obter mais informações.

As opções que podem ser usadas com **ndb\_restore** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.42 Opções de linha de comando usadas com o programa ndb\_restore**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --connect-retries=# </code>] </p></th> <td>Permitir que as alterações sejam feitas no conjunto de colunas que compõem a chave primária da tabela</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --connect-retries=# </code>] </p></th> <td>Adicione dados a um arquivo separado por tabulação</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--connect-string=connection_string</code>] </p></th> <td>Forneça uma senha para descriptografar um backup criptografado com --decrypt; consulte a documentação para valores permitidos</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir de STDIN; use junto com a opção --decrypt</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --core-file </code>] </p></th> <td>Caminho para o diretório de arquivos de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --decrypt </code>],</p><p> [[PH_HTML_CODE_<code> --defaults-extra-file=path </code>] </p></th> <td>Restaurar a partir do backup com este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-file=path </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>],</p><p> [[PH_HTML_CODE_<code> --disable-indexes </code>] </p></th> <td>Alias para --connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code>]] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --append </code><code> --connect-retries=# </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--connect-string=connection_string</code>]],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --core-file </code>]] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --decrypt </code>]] </p></th> <td>Descifre um backup criptografado; requer --backup-password</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-extra-file=path </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-file=path </code>]] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-group-suffix=string </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --disable-indexes </code>]] </p></th> <td>Isto faz com que os índices dos backups sejam ignorados; pode diminuir o tempo necessário para restaurar os dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-password=password </code><code> --connect-retries=# </code>],</p><p> [[<code> --backup-password=password </code><code> --connect-retries=# </code>] </p></th> <td>Não ignore a tabela do sistema durante a restauração; experimental; não para uso em produção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code>--connect-string=connection_string</code>] </p></th> <td>Lista de uma ou mais bases de dados para excluir (inclui aquelas não nomeadas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code> -c connection_string </code>] </p></th> <td>Não restaure nenhuma tabela intermediária (com nomes prefixados por '#sql-') que ficaram para trás das operações de ALTER TABLE; especifique FALSE para restaurar essas tabelas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code> --core-file </code>] </p></th> <td>As colunas das versões de backup da tabela que estão faltando na versão da tabela no banco de dados serão ignoradas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code> --decrypt </code>] </p></th> <td>As tabelas de backup que estão faltando no banco de dados serão ignoradas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code> --defaults-extra-file=path </code>] </p></th> <td>Lista de uma ou mais tabelas a serem excluídas (inclui aquelas da mesma base de dados que não tenham um nome); cada referência de tabela deve incluir o nome da base de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code> --defaults-file=path </code>] </p></th> <td>Campos são delimitados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Os campos são opcionalmente delimitados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password=password </code><code> --disable-indexes </code>] </p></th> <td>Os campos são encerrados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-password-from-stdin </code><code> --connect-retries=# </code>],</p><p> [[<code> --backup-password-from-stdin </code><code> --connect-retries=# </code>] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password-from-stdin </code><code>--connect-string=connection_string</code>] </p></th> <td>Imprimir tipos binários no formato hexadecimal</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password-from-stdin </code><code> -c connection_string </code>] </p></th> <td>Ignorar entradas de log que contenham atualizações de colunas agora incluídas na chave primária estendida</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password-from-stdin </code><code> --core-file </code>] </p></th> <td>Lista de uma ou mais bases de dados para restaurar (excluindo aquelas que não estão nomeadas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password-from-stdin </code><code> --decrypt </code>] </p></th> <td>Restaure usuários compartilhados e concessões para a tabela ndb_sql_metadata</td> <td><p>ADICIONADO: NDB 8.0.19</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password-from-stdin </code><code> --defaults-extra-file=path </code>] </p></th> <td>Lista de uma ou mais tabelas para restaurar (excluindo aquelas na mesma base de dados que não tenham um nome); cada referência de tabela deve incluir o nome da base de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password-from-stdin </code><code> --defaults-file=path </code>] </p></th> <td>As linhas são encerradas por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-password-from-stdin </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-password-from-stdin </code><code> --disable-indexes </code>],</p><p> [[<code> --backup-path=path </code><code> --connect-retries=# </code>] </p></th> <td>Permitir conversões com perda de dados de valores de coluna (tipo redução ou mudança de sinal) ao restaurar dados de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-path=path </code><code> --connect-retries=# </code>] </p></th> <td>Se o mysqld estiver conectado e usando o registro binário, não registre os dados restaurados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-path=path </code><code>--connect-string=connection_string</code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-path=path </code><code> -c connection_string </code>],</p><p> [[<code> --backup-path=path </code><code> --core-file </code>] </p></th> <td>Não restaure objetos relacionados aos dados do disco</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-path=path </code><code> --decrypt </code>],</p><p> [[<code> --backup-path=path </code><code> --defaults-extra-file=path </code>] </p></th> <td>Não atualize o tipo de matriz para atributos varsize que não redimensionem os dados VAR e não mude os atributos de coluna</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-path=path </code><code> --defaults-file=path </code>],</p><p> [[<code> --backup-path=path </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> --connect-retries=# </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-path=path </code><code> --disable-indexes </code>],</p><p> [[<code>--backupid=#</code><code> --connect-retries=# </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backupid=#</code><code> --connect-retries=# </code>],</p><p> [[<code>--backupid=#</code><code>--connect-string=connection_string</code>] </p></th> <td>Especifique o mapa do grupo de nós; não utilizado, não suportado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--backupid=#</code><code> -c connection_string </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--backupid=#</code><code> --core-file </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backupid=#</code><code> --decrypt </code>],</p><p> [[<code>--backupid=#</code><code> --defaults-extra-file=path </code>] </p></th> <td>ID do nó onde o backup foi feito</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--backupid=#</code><code> --defaults-file=path </code>] </p></th> <td>Número de fatias a serem aplicadas ao restaurar por fatia</td> <td><p>ADICIONADO: NDB 8.0.20</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backupid=#</code><code> --defaults-group-suffix=string </code>],</p><p> [[<code>--backupid=#</code><code> --disable-indexes </code>] </p></th> <td>Número de transações paralelas a serem usadas durante a restauração dos dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --connect-retries=# </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --connect-retries=# </code>] </p></th> <td>Permitir a preservação de espaços finais (incluindo alinhamento) ao promover tipos de strings de largura fixa para tipos de largura variável</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code>--connect-string=connection_string</code>] </p></th> <td>Imprima metadados, dados e log no stdout (equivalente a --print-meta --print-data --print-log)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> -c connection_string </code>] </p></th> <td>Imprimir dados no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --core-file </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --decrypt </code>] </p></th> <td>Imprima o log no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --defaults-extra-file=path </code>] </p></th> <td>Imprimir metadados no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --defaults-file=path </code>] </p></th> <td>Escreva o log SQL no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Status de impressão do restauração de cada número dado de segundos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code><code> --disable-indexes </code>],</p><p> [[<code> --character-sets-dir=path </code><code> --connect-retries=# </code>] </p></th> <td>Permitir que atributos sejam promovidos ao restaurar dados de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --character-sets-dir=path </code><code> --connect-retries=# </code>] </p></th> <td>Causa a reconstrução em múltiplos fios de índices ordenados encontrados em backups; o número de fios usados é determinado pela configuração BuildIndexThreads</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --character-sets-dir=path </code><code>--connect-string=connection_string</code>] </p></th> <td>Aplicar deslocamento ao valor da coluna especificada usando a função e os argumentos indicados. O formato é [db].[tb<code> --connect-retries=# </code>.[co<code> --connect-retries=# </code>:[fn]:[arg<code> --connect-retries=# </code>; consulte a documentação para obter detalhes</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --character-sets-dir=path </code><code> -c connection_string </code>],</p><p> [[<code> --character-sets-dir=path </code><code> --core-file </code>] </p></th> <td>Restaure os dados e os registros da tabela no NDB Cluster usando a API NDB</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --character-sets-dir=path </code><code> --decrypt </code>],</p><p> [[<code> --character-sets-dir=path </code><code> --defaults-extra-file=path </code>] </p></th> <td>Restaure as informações da época na tabela de status; útil em um cluster de replicação para iniciar a replicação; atualize ou insira uma linha no mysql.ndb_apply_status com o ID 0</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --character-sets-dir=path </code><code> --defaults-file=path </code>],</p><p> [[<code> --character-sets-dir=path </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Restaure metadados no NDB Cluster usando a API NDB</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --character-sets-dir=path </code><code> --disable-indexes </code>] </p></th> <td>Restaure as tabelas de privilégios do MySQL que foram anteriormente movidas para o NDB</td> <td><p>DESCONTINUADA: NDB 8.0.16</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--connect=connection_string</code><code> --connect-retries=# </code>] </p></th> <td>Restaure para um banco de dados com um nome diferente; o formato é olddb, newdb</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--connect=connection_string</code><code> --connect-retries=# </code>] </p></th> <td>Ignorar tabelas de blobs ausentes no arquivo de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--connect=connection_string</code><code>--connect-string=connection_string</code>],</p><p> [[<code>--connect=connection_string</code><code> -c connection_string </code>] </p></th> <td>Ignorar a verificação da estrutura da tabela durante a restauração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--connect=connection_string</code><code> --core-file </code>] </p></th> <td>Os objetos do esquema que não são reconhecidos pelo ndb_restore são ignorados ao restaurar o backup feito de uma versão mais nova do NDB para uma versão mais antiga</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--connect=connection_string</code><code> --decrypt </code>] </p></th> <td>ID do corte, ao restaurar por cortes</td> <td><p>ADICIONADO: NDB 8.0.20</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--connect=connection_string</code><code> --defaults-extra-file=path </code>],</p><p> [[<code>--connect=connection_string</code><code> --defaults-file=path </code>] </p></th> <td>Cria um arquivo .txt separado por tabulação para cada tabela no caminho fornecido</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code>--connect=connection_string</code><code> --defaults-group-suffix=string </code>] </p></th> <td>Prefixe todas as mensagens de informações, erros e depuração com timestamps</td> <td><p>ADICIONADO: NDB 8.0.33</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--connect=connection_string</code><code> --disable-indexes </code>],</p><p> [[<code> -c connection_string </code><code> --connect-retries=# </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> -c connection_string </code><code> --connect-retries=# </code>] </p></th> <td>Nível de verbosidade na saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> -c connection_string </code><code>--connect-string=connection_string</code>],</p><p> [[<code> -c connection_string </code><code> -c connection_string </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> -c connection_string </code><code> --core-file </code>] </p></th> <td>Restaure a tabela ndb_apply_status. Requer --restore-data</td> <td><p>ADICIONADO: NDB 8.0.29</p></td> </tr></tbody></table>

- `--allow-pk-changes`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>

  Quando essa opção é definida como `1`, o **ndb\_restore** permite que as chaves primárias em uma definição de tabela diferem daquelas da mesma tabela no backup. Isso pode ser desejável ao fazer backup e restaurar entre diferentes versões do esquema com alterações nas chaves primárias em uma ou mais tabelas, e parece que realizar a operação de restauração usando o **ndb\_restore** é mais simples ou mais eficiente do que emitir muitas instruções `ALTER TABLE` após restaurar os esquemas e os dados das tabelas.

  As seguintes alterações nas definições de chave primária são suportadas por `--allow-pk-changes`:

  - **Extensão da chave primária**: Uma coluna não nula que existe no esquema da tabela no backup se torna parte da chave primária da tabela no banco de dados.

    Importante

    Ao estender a chave primária de uma tabela, quaisquer colunas que se tornem parte da chave primária não devem ser atualizadas enquanto o backup estiver sendo realizado; quaisquer atualizações desse tipo descobertas pelo **ndb\_restore** causam o falha da operação de restauração, mesmo quando não há alteração no valor. Em alguns casos, pode ser possível sobrepor esse comportamento usando a opção `--ignore-extended-pk-updates`; consulte a descrição dessa opção para obter mais informações.

  - **Adicionando a chave primária (1)**: Uma coluna que já faz parte da chave primária da tabela no esquema de backup não faz mais parte da chave primária, mas permanece na tabela.

  - **Conectando a chave primária (2)**: Uma coluna que já faz parte da chave primária da tabela no esquema de backup é removida da tabela completamente.

  Essas diferenças podem ser combinadas com outras diferenças de esquema suportadas pelo **ndb\_restore**, incluindo alterações nas colunas blob e texto que exigem o uso de tabelas de preparação.

  Aqui estão os passos básicos em um cenário típico que envolve alterações no esquema de chave primária:

  1. Restaure os esquemas de tabelas usando **ndb\_restore** `--restore-meta`

  2. Alterar o esquema para o desejado ou criá-lo

  3. Faça backup do esquema desejado

  4. Execute **ndb\_restore** `--disable-indexes` usando o backup do passo anterior, para descartar índices e restrições

  5. Execute **ndb\_restore** `--allow-pk-changes` (possívelmente junto com `--ignore-extended-pk-updates`, `--disable-indexes` e, se necessário, outras opções) para restaurar todos os dados

  6. Execute **ndb\_restore** `--rebuild-indexes` usando o backup feito com o esquema desejado, para reconstruir índices e restrições

  Ao estender a chave primária, pode ser necessário que o **ndb\_restore** use um índice único secundário temporário durante a operação de restauração para mapear a antiga chave primária para a nova. Esse índice é criado apenas quando necessário para aplicar eventos do log de backup a uma tabela que tenha uma chave primária estendida. Esse índice é chamado de `NDB$RESTORE_PK_MAPPING` e é criado em cada tabela que o requer; ele pode ser compartilhado, se necessário, por várias instâncias do **ndb\_restore** em execução em paralelo. (Executar **ndb\_restore** `--rebuild-indexes` no final do processo de restauração faz com que esse índice seja descartado.)

- `--append`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>

  Quando usado com as opções `--tab` e `--print-data`, isso faz com que os dados sejam anexados a quaisquer arquivos existentes com os mesmos nomes.

- `--backup-path`=`dir_name`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>

  O caminho para o diretório de backup é necessário; isso é fornecido ao **ndb\_restore** usando a opção `--backup-path`, e deve incluir o subdiretório correspondente ao backup de ID do backup a ser restaurado. Por exemplo, se o `DataDir` do nó de dados é `/var/lib/mysql-cluster`, então o diretório de backup é `/var/lib/mysql-cluster/BACKUP`, e os arquivos de backup para o backup com o ID 3 podem ser encontrados em `/var/lib/mysql-cluster/BACKUP/BACKUP-3`. O caminho pode ser absoluto ou relativo ao diretório em que o executável **ndb\_restore** está localizado, e pode ser precedido opcionalmente com `backup-path=`.

  É possível restaurar um backup para um banco de dados com uma configuração diferente daquela em que foi criado. Por exemplo, suponha que um backup com o ID de backup `12`, criado em um clúster com dois nós de armazenamento com os IDs de nó `2` e `3`, deva ser restaurado para um clúster com quatro nós. Nesse caso, o **ndb\_restore** deve ser executado duas vezes — uma vez para cada nó de armazenamento no clúster onde o backup foi feito. No entanto, o **ndb\_restore** nem sempre pode restaurar backups feitos de um clúster que está executando uma versão do MySQL para um clúster que está executando uma versão diferente do MySQL. Consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, para obter mais informações.

  Importante

  Não é possível restaurar um backup feito a partir de uma versão mais recente do NDB Cluster usando uma versão mais antiga do **ndb\_restore**. Você pode restaurar um backup feito a partir de uma versão mais recente do MySQL para um cluster mais antigo, mas você deve usar uma cópia do **ndb\_restore** da versão mais recente do NDB Cluster para fazer isso.

  Por exemplo, para restaurar um backup de cluster feito de um cluster que está rodando o NDB Cluster 8.0.44 para um cluster que está rodando o NDB Cluster 7.6.36, você deve usar o **ndb\_restore** que vem com a distribuição do NDB Cluster 7.6.36.

  Para uma restauração mais rápida, os dados podem ser restaurados em paralelo, desde que haja um número suficiente de conexões de cluster disponíveis. Ou seja, ao restaurar para múltiplos nós em paralelo, você deve ter uma seção `[api]` ou `[mysqld]` no arquivo de cluster `config.ini` disponível para cada processo de **ndb\_restore** concorrente. No entanto, os arquivos de dados devem ser aplicados sempre antes dos logs.

- `--backup-password=password`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Esta opção especifica uma senha a ser usada ao descriptografar um backup criptografado com a opção `--decrypt`. Esta senha deve ser a mesma que foi usada para criptografar o backup.

  A senha deve ter de 1 a 256 caracteres e deve estar entre aspas simples ou duplas. Ela pode conter qualquer um dos caracteres ASCII com códigos de caracteres 32, 35, 38, 40-91, 93, 95 e 97-126; em outras palavras, pode usar qualquer caractere ASCII imprimível, exceto `!`, `'`, `"`, `$`, `%`, `\` e `^`.

  No MySQL 8.0.24 e versões posteriores, é possível omitir a senha, caso em que o **ndb\_restore** espera que ela seja fornecida pelo `stdin`, como ao usar o `--backup-password-from-stdin`.

- `--backup-password-from-stdin[=TRUE|FALSE]`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

  Quando usado no lugar de `--backup-password`, esta opção permite a entrada da senha de backup a partir da shell do sistema (`stdin`), de forma semelhante à maneira como isso é feito ao fornecer a senha interativamente ao **mysql** ao usar o `--password` sem fornecer a senha na linha de comando.

- `--backupid`=`#`, `-b`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>

  Essa opção é usada para especificar o ID ou o número de sequência do backup e é o mesmo número exibido pelo cliente de gerenciamento na mensagem `Backup backup_id completed` exibida após a conclusão de um backup. (Veja a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”.)

  Importante

  Ao restaurar backups de clúster, você deve ter certeza de que restaura todos os nós de dados a partir de backups com o mesmo ID de backup. Usar arquivos de backups diferentes resulta, no máximo, em restaurar o clúster a um estado inconsistente e provavelmente falhará completamente.

  Na NDB 8.0, essa opção é necessária.

- `--character-sets-dir`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect`, `-c`

  <table summary="Propriedades para conectar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost:1186</code>]]</td> </tr></tbody></table>

  Alias para `--ndb-connectstring`.

- `--connect-retries`

  <table summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>0

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>1

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>2

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--decrypt`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>3

  Descifreren um backup criptografado usando a senha fornecida pela opção `--backup-password`.

- `--defaults-extra-file`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>4

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>5

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>6

  Leia também grupos com concatenação (grupo, sufixo).

- `--disable-indexes`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>7

  Desative a restauração de índices durante a restauração dos dados de um backup nativo `NDB`. Em seguida, você pode restaurar os índices para todas as tabelas de uma vez com a construção de índices multithread usando `--rebuild-indexes`, o que deve ser mais rápido do que reconstruir os índices simultaneamente para tabelas muito grandes.

  No NDB 8.0.27 e versões posteriores, essa opção também exclui quaisquer chaves estrangeiras especificadas no backup.

  Antes da versão 8.0.29 do NDB, tentar acessar uma tabela `NDB` do MySQL para a qual um ou mais índices não pudessem ser encontrados sempre era rejeitado com o erro `4243` Índice não encontrado. A partir da versão 8.0.29 do NDB, é possível abrir essa tabela no MySQL, desde que a consulta não utilize nenhum dos índices afetados; caso contrário, a consulta é rejeitada com `ER_NOT_KEYFILE`. No último caso, você pode contornar temporariamente o problema executando uma instrução `ALTER TABLE` como esta:

  ```
  ALTER TABLE tbl ALTER INDEX idx INVISIBLE;
  ```

  Isso faz com que o MySQL ignore o índice `idx` na tabela `tbl`. Consulte Chave Primária e Índices para obter mais informações.

- `--dont-ignore-systab-0`, `-f`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>8

  Normalmente, ao restaurar dados de tabela e metadados, o **ndb\_restore** ignora a cópia da tabela de sistema `NDB` presente no backup. `--dont-ignore-systab-0` faz com que a tabela de sistema seja restaurada. *Esta opção é destinada apenas para uso experimental e de desenvolvimento e não é recomendada em um ambiente de produção*.

- `--exclude-databases`=`db-list`

  <table summary="Propriedades para permitir alterações de pk"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--allow-pk-changes[=0|<code>0</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>9

  Lista delimitada por vírgula de uma ou mais bases de dados que não devem ser restauradas.

  Essa opção é frequentemente usada em combinação com `--exclude-tables`; consulte a descrição dessa opção para obter mais informações e exemplos.

- \[`--exclude-intermediate-sql-tables`=`TRUE|FALSE]`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>0

  Ao realizar operações de cópia `ALTER TABLE`, o **mysqld** cria tabelas intermediárias (cujos nomes são prefixados com `#sql-`). Quando a opção `TRUE`, `--exclude-intermediate-sql-tables` é ativada, o **ndb\_restore** é impedido de restaurar essas tabelas que possam ter sido deixadas para trás por essas operações. Esta opção é a padrão `TRUE`.

- `--exclude-missing-columns`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>1

  É possível restaurar apenas as colunas selecionadas da tabela usando essa opção, o que faz com que o **ndb\_restore** ignore quaisquer colunas ausentes das tabelas que estão sendo restauradas em comparação com as versões dessas tabelas encontradas no backup. Essa opção se aplica a todas as tabelas que estão sendo restauradas. Se você deseja aplicar essa opção apenas a tabelas ou bancos de dados selecionados, pode usá-la em combinação com uma ou mais das opções `--include-*` ou `--exclude-*` descritas em outra parte desta seção para fazer isso, e depois restaurar os dados para as tabelas restantes usando um conjunto complementar dessas opções.

- `--exclude-missing-tables`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>2

  É possível restaurar apenas as tabelas selecionadas usando essa opção, o que faz com que o **ndb\_restore** ignore quaisquer tabelas do backup que não sejam encontradas no banco de dados de destino.

- `--exclude-tables`=`table-list`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>3

  Lista de uma ou mais tabelas a serem excluídas; cada referência de tabela deve incluir o nome do banco de dados. Muitas vezes usado em conjunto com `--exclude-databases`.

  Quando `--exclude-databases` ou `--exclude-tables` é usado, apenas os bancos de dados ou tabelas nomeados pela opção são excluídos; todos os outros bancos de dados e tabelas são restaurados pelo **ndb\_restore**.

  Esta tabela mostra várias invocatórias do **ndb\_restore** usando as opções `--exclude-*` (outras opções que podem ser necessárias foram omitidas para maior clareza), e os efeitos que essas opções têm na restauração a partir de um backup do NDB Cluster:

  **Tabela 25.43: Várias invocatórias do ndb\_restore usando as opções --exclude-* e os efeitos dessas opções na restauração a partir de um backup do NDB Cluster.*\*

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>4

  Você pode usar essas duas opções juntas. Por exemplo, o seguinte comando restaura todas as tabelas em todos os bancos de dados *exceto* os bancos de dados `db1` e `db2`, e as tabelas `t1` e `t2` no banco de dados `db3`:

  ```
  $> ndb_restore [...] --exclude-databases=db1,db2 --exclude-tables=db3.t1,db3.t2
  ```

  (Novamente, omitimos outras opções que poderiam ser necessárias, por questões de clareza e brevidade, do exemplo mostrado anteriormente.)

  Você pode usar as opções `--include-*` e `--exclude-*` juntas, sujeito às seguintes regras:

  - As ações de todas as opções `--include-*` e `--exclude-*` são cumulativas.

  - Todas as opções `--include-*` e `--exclude-*` são avaliadas na ordem passada para ndb\_restore, da direita para a esquerda.

  - Em caso de opções conflitantes, a primeira (a mais à direita) tem precedência. Em outras palavras, a primeira opção (da direita para a esquerda) que corresponde a um banco de dados ou tabela específica "vence".

  Por exemplo, o seguinte conjunto de opções faz com que o **ndb\_restore** restaure todas as tabelas do banco de dados `db1`, exceto `db1.t1`, sem restaurar outras tabelas de nenhum outro banco de dados:

  ```
  --include-databases=db1 --exclude-tables=db1.t1
  ```

  No entanto, alterar a ordem das opções acima simplesmente faz com que todas as tabelas do banco de dados `db1` sejam restauradas (incluindo `db1.t1`, mas sem tabelas de nenhum outro banco de dados), porque a opção `--include-databases`, sendo a mais à direita, é a primeira correspondência com o banco de dados `db1` e, portanto, tem precedência sobre qualquer outra opção que corresponda a `db1` ou qualquer tabela em `db1`:

  ```
  --exclude-tables=db1.t1 --include-databases=db1
  ```

- `--fields-enclosed-by`=`char`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>5

  Cada valor da coluna é encerrado pela string passada para esta opção (independentemente do tipo de dados; veja a descrição de `--fields-optionally-enclosed-by`).

- `--fields-optionally-enclosed-by`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>6

  A string passada para esta opção é usada para envolver os valores das colunas que contêm dados de caracteres (como `CHAR`, `VARCHAR`, `BINARY`, `TEXT` ou `ENUM`).

- `--fields-terminated-by`=`char`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>7

  A string passada para esta opção é usada para separar os valores das colunas. O valor padrão é um caractere de tabulação (`\t`).

- `--help`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>8

  Exibir texto de ajuda e sair.

- `--hex`

  <table summary="Propriedades para anexar"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--append</code>]]</td> </tr></tbody></table>9

  Se esta opção for usada, todos os valores binários serão exibidos no formato hexadecimal.

- `--ignore-extended-pk-updates`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>0

  Ao usar `--allow-pk-changes`, as colunas que se tornam parte da chave primária de uma tabela não devem ser atualizadas durante a realização do backup; essas colunas devem manter os mesmos valores desde que os valores forem inseridos nelas até que as linhas que contêm os valores sejam excluídas. Se o **ndb\_restore** encontrar atualizações nessas colunas ao restaurar um backup, o processo de restauração falhará. Como alguns aplicativos podem definir valores para todas as colunas ao atualizar uma linha, mesmo quando alguns valores das colunas não são alterados, o backup pode incluir eventos de log que parecem atualizar colunas que, na verdade, não são modificadas. Nesses casos, você pode definir `--ignore-extended-pk-updates` para `1`, forçando o **ndb\_restore** a ignorar tais atualizações.

  Importante

  Ao fazer com que essas atualizações sejam ignoradas, o usuário é responsável por garantir que não haja atualizações nos valores de quaisquer colunas que se tornem parte da chave primária.

  Para mais informações, consulte a descrição de `--allow-pk-changes`.

- `--include-databases`=`db-list`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>1

  Lista de um ou mais bancos de dados a serem restaurados, separados por vírgula. Muitas vezes usada em conjunto com `--include-tables`; consulte a descrição dessa opção para obter mais informações e exemplos.

- `--include-stored-grants`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>2

  No NDB 8.0, o **ndb\_restore** não restaura, por padrão, usuários compartilhados e concessões (veja a Seção 25.6.13, “Sincronização de privilégios e NDB\_STORED\_USER”) para a tabela `ndb_sql_metadata`. Especificar essa opção faz com que ele faça isso.

- `--include-tables`=`table-list`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>3

  Lista de tabelas separadas por vírgula para restaurar; cada referência de tabela deve incluir o nome do banco de dados.

  Quando `--include-databases` ou `--include-tables` é usado, apenas os bancos de dados ou tabelas nomeados pela opção são restaurados; todos os outros bancos de dados e tabelas são excluídos pelo **ndb\_restore** e não são restaurados.

  A tabela a seguir mostra várias invocatórias do **ndb\_restore** usando as opções `--include-*` (outras opções que podem ser necessárias foram omitidas para maior clareza), e os efeitos que elas têm na restauração a partir de um backup do NDB Cluster:

  **Tabela 25.44 Várias invocatórias do ndb\_restore usando as opções --include-* e seus efeitos na restauração a partir de um backup do NDB Cluster.*\*

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>4

  Você também pode usar essas duas opções juntas. Por exemplo, o seguinte comando restaura todas as tabelas dos bancos de dados `db1` e `db2`, juntamente com as tabelas `t1` e `t2` do banco de dados `db3`, sem restaurar outras bases de dados ou tabelas:

  ```
  $> ndb_restore [...] --include-databases=db1,db2 --include-tables=db3.t1,db3.t2
  ```

  (Mais uma vez, omitimos outras opções, possivelmente necessárias, no exemplo mostrado acima.)

  Também é possível restaurar apenas bancos de dados selecionados ou tabelas selecionadas de um único banco de dados, sem quaisquer opções `--include-*` (ou `--exclude-*`), usando a sintaxe mostrada aqui:

  ```
  ndb_restore other_options db_name,[db_name[,...] | tbl_name[,tbl_name][,...]]
  ```

  Em outras palavras, você pode especificar qualquer uma das seguintes opções para ser restaurada:

  - Todas as tabelas de um ou mais bancos de dados
  - Uma ou mais tabelas de um único banco de dados

- `--lines-terminated-by`=`char`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>5

  Especifica a string usada para encerrar cada linha de saída. O padrão é um caractere de nova linha (`\n`).

- `--login-path`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>6

  Leia o caminho fornecido a partir do arquivo de login.

- `--lossy-conversions`, `-L`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>7

  Esta opção é destinada a complementar a opção `--promote-attributes`. O uso de `--lossy-conversions` permite conversões com perda de dados dos valores das colunas (tipos de degraus ou mudanças de sinal) ao restaurar dados de um backup. Com algumas exceções, as regras que regem o degrau são as mesmas da replicação do MySQL; consulte a Seção 19.5.1.9.2, “Replicação de Colunas com Diferentes Tipos de Dados”, para obter informações sobre as conversões de tipos específicas atualmente suportadas pela demoção de atributos.

  A partir da versão 8.0.26 do NDB, essa opção também permite restaurar uma coluna `NULL` como `NOT NULL`. A coluna não pode conter entradas `NULL`; caso contrário, o **ndb\_restore** será interrompido com um erro.

  O **ndb\_restore** relata qualquer truncação de dados que ele realiza durante as conversões com perda uma vez por atributo e coluna.

- `--no-binlog`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>8

  Essa opção impede que quaisquer nós SQL conectados escrevam dados restaurados pelo **ndb\_restore** em seus logs binários.

- `--no-restore-disk-objects`, `-d`

  <table summary="Propriedades para caminho de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>./</code>]]</td> </tr></tbody></table>9

  Essa opção impede que o **ndb\_restore** restaure quaisquer objetos de dados de disco do NDB Cluster, como espaços de tabela e grupos de arquivos de log; consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”, para obter mais informações sobre esses objetos.

- `--no-upgrade`, `-u`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Ao usar o **ndb\_restore** para restaurar um backup, as colunas `VARCHAR` criadas usando o antigo formato fixo são redimensionadas e recriadas usando o formato de largura variável agora empregado. Esse comportamento pode ser ignorado especificando `--no-upgrade`.

- `--ndb-connectstring`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>2

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodegroup-map`=`map`, `-z`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>3

  Destinado a restaurar um backup feito de um grupo de nós para um grupo de nós diferente, mas nunca completamente implementado; não é suportado.

  Todo o código que suporta essa opção foi removido no NDB 8.0.27; nessa e em versões posteriores, qualquer valor definido para ela é ignorado, e a própria opção não faz nada.

- `--ndb-nodeid`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>4

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>5

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>6

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--nodeid`=`#`, `-n`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>7

  Especifique o ID do nó do nó de dados em que o backup foi feito.

  Ao restaurar um clúster com um número diferente de nós de dados daquele onde o backup foi feito, essas informações ajudam a identificar o conjunto ou conjuntos de arquivos corretos a serem restaurados a um determinado nó. (Nesses casos, geralmente é necessário restaurar vários arquivos a um único nó de dados.) Consulte a Seção 25.5.23.2, “Restauração a um número diferente de nós de dados”, para obter informações e exemplos adicionais.

  Na NDB 8.0, essa opção é necessária.

- `--num-slices`=`#`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>8

  Ao restaurar um backup por fatias, essa opção define o número de fatias em que o backup será dividido. Isso permite que múltiplas instâncias do **ndb\_restore** restauram subconjuntos disjuntos em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

  Um *slice* é um subconjunto dos dados em um backup específico; ou seja, é um conjunto de fragmentos que possuem o mesmo ID de *slice*, especificado usando a opção `--slice-id`. As duas opções devem ser sempre usadas juntas, e o valor definido por `--slice-id` deve sempre ser menor que o número de *slices*.

  O **ndb\_restore** encontra fragmentos e atribui a cada um um contador de fragmento. Ao restaurar por fatias, um ID de fatia é atribuído a cada fragmento; esse ID de fatia está no intervalo de 0 a 1 menos que o número de fatias. Para uma tabela que não é uma tabela `BLOB`, a fatia à qual um determinado fragmento pertence é determinada usando a fórmula mostrada aqui:

  ```
  [slice_ID] = [fragment_counter] % [number_of_slices]
  ```

  Para uma tabela `BLOB`, um contador de fragmentos não é usado; o número do fragmento é usado, juntamente com o ID da tabela principal para a tabela `BLOB` (lembre-se de que `NDB` armazena valores de `BLOB` em uma tabela separada internamente). Neste caso, o ID do corte para um fragmento dado é calculado conforme mostrado aqui:

  ```
  [slice_ID] =
  ([main_table_ID] + [fragment_ID]) % [number_of_slices]
  ```

  Assim, restaurar por `N` fatias significa executar `N` instâncias do **ndb\_restore**, todas com `--num-slices=N` (juntamente com quaisquer outras opções necessárias) e uma cada com `--slice-id=1`, `--slice-id=2`, `--slice-id=3` e assim por diante até `slice-id=N-1`.

  **Exemplo.** Suponha que você queira restaurar um backup chamado `BACKUP-1`, encontrado no diretório padrão `/var/lib/mysql-cluster/BACKUP/BACKUP-3` no sistema de arquivos do nó em cada nó de dados, para um cluster com quatro nós de dados com os IDs de nó 1, 2, 3 e 4. Para executar essa operação usando cinco fatias, execute os conjuntos de comandos mostrados na lista a seguir:

  1. Restaure os metadados do cluster usando **ndb\_restore** conforme mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 -m --disable-indexes --backup-path=/home/ndbuser/backups
     ```

  2. Restaure os dados do cluster nos nós de dados invocando **ndb\_restore** conforme mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

     Todos os comandos mostrados neste passo podem ser executados em paralelo, desde que haja espaço suficiente para as conexões ao clúster (consulte a descrição da opção `--backup-path`).

  3. Restaure os índices como de costume, conforme mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 --rebuild-indexes --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

  4. Por fim, restaure a época, usando o comando mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 --restore-epoch --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

  Você deve usar o fatiamento para restaurar apenas os dados do cluster; não é necessário usar `--num-slices` ou `--slice-id` ao restaurar os metadados, índices ou informações de época. Se uma ou ambas essas opções forem usadas com as opções **ndb\_restore** controlando a restauração desses, o programa as ignora.

  Os efeitos de usar a opção `--parallelism` na velocidade de restauração são independentes daqueles produzidos pelo corte ou restauração paralela usando múltiplas instâncias do **ndb\_restore** (`--parallelism` especifica o número de transações paralelas executadas por um único **ndb\_restore** thread), mas pode ser usado junto com qualquer um ou ambos. Você deve estar ciente de que aumentar `--parallelism` faz com que o **ndb\_restore** imponha uma carga maior no cluster; se o sistema puder lidar com isso, a restauração deve ser concluída ainda mais rapidamente.

  O valor de `--num-slices` não depende diretamente de valores relacionados ao hardware, como o número de CPUs ou núcleos de CPU, quantidade de RAM, etc., nem depende do número de LDMs.

  É possível usar diferentes valores para essa opção em diferentes nós de dados como parte da mesma restauração; fazer isso não deve, por si só, causar nenhum efeito negativo.

- `--parallelism`=`#`, `-p`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>9

  O **ndb\_restore** utiliza transações de uma única linha para aplicar muitas linhas simultaneamente. Este parâmetro determina o número de transações paralelas (linhas concorrentes) que uma instância do **ndb\_restore** tenta usar. Por padrão, este é 128; o mínimo é 1 e o máximo é 1024.

  O trabalho de execução dos insertos é realizado em paralelo em todos os fios dos nós de dados envolvidos. Esse mecanismo é empregado para restaurar dados em massa a partir do arquivo `.Data` — ou seja, o instantâneo desfocado dos dados; ele não é usado para criar ou reconstruir índices. O log de alterações é aplicado seriamente; as operações de criação e reconstrução de índices são operações DDL e são tratadas separadamente. Não há paralelismo em nível de fio no lado do cliente do restauro.

- `--preserve-trailing-spaces`, `-P`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>0

  Mantenha os espaços finais preservados ao promover um tipo de dados de caracteres de largura fixa para seu equivalente de largura variável—ou seja, ao promover um valor da coluna `CHAR` para `VARCHAR`, ou um valor da coluna `BINARY` para `VARBINARY`. Caso contrário, quaisquer espaços finais são eliminados desses valores de coluna quando eles são inseridos nas novas colunas.

  Nota

  Embora você possa promover colunas `CHAR` para colunas `VARCHAR` e `BINARY` para colunas `VARBINARY`, você não pode promover colunas `VARCHAR` para colunas `CHAR` ou `VARBINARY` para colunas `BINARY`.

- `--print`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>1

  Faz com que **ndb\_restore** imprima todos os dados, metadados e logs para `stdout`. É equivalente ao uso das opções `--print-data`, `--print-meta` e `--print-log` juntas.

  Nota

  O uso de `--print` ou qualquer uma das opções `--print_*` está efetuando uma execução em seco. Incluir uma ou mais dessas opções faz com que qualquer saída seja redirecionada para `stdout`; nesses casos, o **ndb\_restore** não tenta restaurar dados ou metadados em um NDB Cluster.

- `--print-data`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>2

  Faça com que o **ndb\_restore** direcione sua saída para `stdout`. Muitas vezes usado em conjunto com um ou mais de `--tab`, `--fields-enclosed-by`, `--fields-optionally-enclosed-by`, `--fields-terminated-by`, `--hex` e `--append`.

  Os valores das colunas `TEXT` e `BLOB` são sempre truncados. Esses valores são truncados para os primeiros 256 bytes na saída. Isso atualmente não pode ser sobrescrito ao usar `--print-data`.

- `--print-defaults`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>3

  Imprima a lista de argumentos do programa e saia.

- `--print-log`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>4

  Faça com que o **ndb\_restore** exiba seu log no `stdout`.

- `--print-meta`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>5

  Imprima todos os metadados para `stdout`.

- `print-sql-log`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>6

  Registre as instruções SQL em `stdout`. Use a opção para habilitar; normalmente, esse comportamento está desativado. A opção verifica antes de tentar registrar se todas as tabelas sendo restauradas têm chaves primárias explicitamente definidas; consultas em uma tabela que tenha apenas a chave primária oculta implementada por `NDB` não podem ser convertidas em SQL válido.

  Esta opção não funciona com tabelas que possuem colunas `BLOB`.

- `--progress-frequency`=`N`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>7

  Imprima um relatório de status a cada `N` segundos enquanto o backup estiver em andamento. 0 (o padrão) não imprime relatórios de status. O máximo é 65535.

- `--promote-attributes`, `-A`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>8

  O **ndb\_restore** suporta a promoção limitada de atributos da mesma forma que é suportado pela replicação do MySQL; ou seja, os dados respaldados a partir de uma coluna de um tipo específico geralmente podem ser restaurados para uma coluna usando um tipo “maior e semelhante”. Por exemplo, os dados de uma coluna `CHAR(20)` podem ser restaurados para uma coluna declarada como `VARCHAR(20)`, `VARCHAR(30)` ou `CHAR(30)`; os dados de uma coluna `MEDIUMINT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) podem ser restaurados para uma coluna do tipo `INT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) ou `BIGINT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT). Consulte a Seção 19.5.1.9.2, “Replicação de Colunas com Diferentes Tipos de Dados”, para uma tabela de conversões de tipos atualmente suportadas pela promoção de atributos.

  A partir da versão 8.0.26 do NDB, essa opção também permite restaurar uma coluna `NOT NULL` como `NULL`.

  A promoção de atributos por **ndb\_restore** deve ser habilitada explicitamente, conforme segue:

  1. Prepare a tabela para a qual o backup deve ser restaurado. O **ndb\_restore** não pode ser usado para recriar a tabela com uma definição diferente da original; isso significa que você deve criar a tabela manualmente ou alterar as colunas que deseja promover usando `ALTER TABLE` após restaurar os metadados da tabela, mas antes de restaurar os dados.

  2. Invoque **ndb\_restore** com a opção `--promote-attributes` (forma abreviada `-A`) ao restaurar os dados da tabela. A promoção de atributos não ocorre se essa opção não for usada; em vez disso, a operação de restauração falha com um erro.

  Ao converter entre tipos de dados de caracteres e `TEXT` ou `BLOB`, apenas as conversões entre tipos de caracteres (`CHAR` e `VARCHAR`) e tipos binários (`BINARY` e `VARBINARY`) podem ser realizadas ao mesmo tempo. Por exemplo, você não pode promover uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") enquanto promove uma coluna `VARCHAR` para `TEXT` na mesma invocação do **ndb\_restore**.

  A conversão entre colunas `TEXT` usando diferentes conjuntos de caracteres não é suportada e é expressamente proibida.

  Ao realizar conversões de tipos de caracteres ou binários para `TEXT` ou `BLOB` com **ndb\_restore**, você pode notar que ele cria e usa uma ou mais tabelas de preparação nomeadas `table_name$STnode_id`. Essas tabelas não são necessárias depois disso e, normalmente, são excluídas pelo **ndb\_restore** após uma restauração bem-sucedida.

- `--rebuild-indexes`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>9

  Ative a reconstrução multisserial dos índices ordenados durante a restauração de um backup nativo do `NDB`. O número de threads usados para a construção de índices ordenados pelo **ndb\_restore** com esta opção é controlado pelo parâmetro de configuração do nó de dados `BuildIndexThreads` e pelo número de LDMs.

  É necessário usar essa opção apenas na primeira execução do **ndb\_restore**; isso faz com que todos os índices ordenados sejam reconstruídos sem usar novamente `--rebuild-indexes` ao restaurar nós subsequentes. Você deve usar essa opção antes de inserir novas linhas no banco de dados; caso contrário, é possível que uma linha seja inserida que, posteriormente, cause uma violação da restrição de unicidade ao tentar reconstruir os índices.

  A construção de índices ordenados é paralela ao número de LDMs por padrão. A construção de índices offline realizada durante reinicializações de nós e sistemas pode ser feita mais rapidamente usando o parâmetro de configuração do nó de dados `BuildIndexThreads`; este parâmetro não tem efeito na remoção e reconstrução de índices pelo **ndb\_restore**, que é realizado online.

  A reconstrução de índices únicos utiliza a largura de banda de escrita em disco para o registro de redo e o checkpoint local. Uma quantidade insuficiente dessa largura de banda pode levar a erros de sobrecarga do buffer de redo ou de sobrecarga do log. Nesses casos, você pode executar novamente o **ndb\_restore** `--rebuild-indexes` novamente; o processo é retomado no ponto em que o erro ocorreu. Você também pode fazer isso quando encontrou erros temporários. Você pode repetir a execução do **ndb\_restore** `--rebuild-indexes` indefinidamente; você pode ser capaz de parar tais erros reduzindo o valor de `--parallelism`. Se o problema for espaço insuficiente, você pode aumentar o tamanho do log de redo (parâmetro de configuração do nó `FragmentLogFileSize`), ou você pode aumentar a velocidade com que os LCPs são realizados (`MaxDiskWriteSpeed` e parâmetros relacionados), a fim de liberar espaço mais rapidamente.

- `--remap-column=db.tbl.col:fn:args`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>0

  Quando usado junto com `--restore-data`, esta opção aplica uma função ao valor da coluna indicada. Os valores na string de argumento estão listados aqui:

  - `db`: Nome do banco de dados, após quaisquer renomeações realizadas por `--rewrite-database`.

  - `tbl`: Nome da tabela.

  - `col`: Nome da coluna a ser atualizada. Essa coluna deve ser do tipo `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). A coluna também pode ser, mas não é obrigatória, `UNSIGNED`.

  - `fn`: Nome da função; atualmente, o único nome suportado é `offset`.

  - `args`: Argumentos fornecidos à função. Atualmente, apenas um único argumento, o tamanho do deslocamento a ser adicionado pela função `offset`, é suportado. Valores negativos são suportados. O tamanho do argumento não pode exceder o da variante assinada do tipo da coluna; por exemplo, se `col` for uma coluna `INT`, então o intervalo permitido do argumento passado para a função `offset` é `-2147483648` a `2147483647` (veja Seção 13.1.2, “Tipos Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT” - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

    Se a aplicação do valor de deslocamento à coluna causar um excesso ou esvaziamento, a operação de restauração falhará. Isso pode acontecer, por exemplo, se a coluna for `BIGINT` e a opção tentar aplicar um valor de deslocamento de 8 em uma linha em que o valor da coluna é 4294967291, pois `4294967291 + 8 = 4294967299 > 4294967295`.

  Esta opção pode ser útil quando você deseja mesclar dados armazenados em múltiplas instâncias de origem do NDB Cluster (todas usando o mesmo esquema) em um único NDB Cluster de destino, usando o backup nativo do NDB (consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e **ndb\_restore** para mesclar os dados, onde os valores primários e de chave únicos estão sobrepostos entre os clusters de origem, e é necessário como parte do processo remapea-los para faixas que não se sobreponham. Também pode ser necessário preservar outras relações entre tabelas. Para atender a esses requisitos, é possível usar a opção várias vezes na mesma invocação de **ndb\_restore** para remapea-las colunas de diferentes tabelas, como mostrado aqui:

  ```
  $> ndb_restore --restore-data --remap-column=hr.employee.id:offset:1000 \
      --remap-column=hr.manager.id:offset:1000 --remap-column=hr.firstaiders.id:offset:1000
  ```

  (Outras opções não mostradas aqui também podem ser usadas.)

  `--remap-column` também pode ser usado para atualizar várias colunas da mesma tabela. Combinações de várias tabelas e colunas são possíveis. Diferentes valores de deslocamento também podem ser usados para diferentes colunas da mesma tabela, como este:

  ```
  $> ndb_restore --restore-data --remap-column=hr.employee.salary:offset:10000 \
      --remap-column=hr.employee.hours:offset:-10
  ```

  Quando os backups de origem contêm tabelas duplicadas que não devem ser unidas, você pode lidar com isso usando `--exclude-tables`, `--exclude-databases` ou por outros meios em sua aplicação.

  Informações sobre a estrutura e outras características das tabelas a serem unidas podem ser obtidas usando `SHOW CREATE TABLE`; a ferramenta **ndb\_desc** e os `MAX()`, `MIN()`, `LAST_INSERT_ID()` e outras funções do MySQL.

  A replicação de alterações de tabelas unidas para tabelas não unidas ou de tabelas não unidas para tabelas unidas em instâncias separadas do NDB Cluster não é suportada.

- `--restore-data`, `-r`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>1

  Exiba os dados e os registros da tabela `NDB`.

- `--restore-epoch`, `-e`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>2

  Adicione (ou restaure) informações de época à tabela de status da replicação do clúster. Isso é útil para iniciar a replicação em uma réplica do NDB Cluster. Quando essa opção é usada, a linha no `mysql.ndb_apply_status` que tem `0` na coluna `id` é atualizada se ela já existir; uma tal linha é inserida se ela ainda não existir. (Veja a Seção 25.7.9, “Backup do NDB Cluster com Replicação do NDB Cluster”.)

- `--restore-meta`, `-m`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>3

  Essa opção faz com que o **ndb\_restore** imprima os metadados da tabela `NDB`.

  A primeira vez que você executar o programa de restauração **ndb\_restore**, também é necessário restaurar os metadados. Em outras palavras, você deve recriar as tabelas do banco de dados — isso pode ser feito executando-o com a opção `--restore-meta` (`-m`). A restauração dos metadados deve ser feita apenas em um único nó de dados; isso é suficiente para restaurá-los para todo o clúster.

  Em versões mais antigas do NDB Cluster, as tabelas cujos esquemas foram restaurados usando essa opção usavam o mesmo número de partições que tinham no cluster original, mesmo que ele tivesse um número diferente de nós de dados em relação ao novo cluster. No NDB 8.0, ao restaurar metadados, isso não é mais um problema; o **ndb\_restore** agora usa o número padrão de partições para o cluster de destino, a menos que o número de threads do gerenciador de dados local também seja alterado em relação ao que era para os nós de dados no cluster original.

  Ao usar essa opção no NDB 8.0, recomenda-se desativar a sincronização automática definindo `ndb_metadata_check=OFF` até que o **ndb\_restore** tenha concluído a restauração dos metadados, após o que pode ser ativado novamente para sincronizar objetos recém-criados no dicionário NDB.

  Nota

  O grupo deve ter um banco de dados vazio ao iniciar a restauração de um backup. (Em outras palavras, você deve iniciar os nós de dados com `--initial` antes de realizar a restauração.)

- `--restore-privilege-tables`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>4

  O **ndb\_restore** não restaura, por padrão, as tabelas de privilégios distribuídos do MySQL criadas em versões do NDB Cluster anteriores à versão 8.0, que não suportam privilégios distribuídos como implementados no NDB 7.6 e versões anteriores. Esta opção faz com que o **ndb\_restore** as restaure.

  No NDB 8.0, essas tabelas não são usadas para controle de acesso; como parte do processo de atualização do servidor MySQL, o servidor cria `InnoDB` cópias dessas tabelas localizadas nele mesmo. Para mais informações, consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, bem como a Seção 8.2.3, “Tabelas de Concessão”.

- `--rewrite-database`=`olddb,newdb`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>5

  Essa opção permite restaurar um banco de dados com um nome diferente do usado no backup. Por exemplo, se um backup for feito de um banco de dados chamado `products`, você pode restaurar os dados que ele contém para um banco de dados chamado `inventory`, usando essa opção conforme mostrado aqui (omitiendo quaisquer outras opções que possam ser necessárias):

  ```
  $> ndb_restore --rewrite-database=product,inventory
  ```

  A opção pode ser usada várias vezes em uma única invocação de **ndb\_restore**. Assim, é possível restaurar simultaneamente de um banco de dados chamado `db1` para um banco de dados chamado `db2` e de um banco de dados chamado `db3` para um chamado `db4` usando `--rewrite-database=db1,db2 --rewrite-database=db3,db4`. Outras opções de **ndb\_restore** podem ser usadas entre múltiplas ocorrências de `--rewrite-database`.

  Em caso de conflitos entre várias opções de `--rewrite-database`, a última opção de `--rewrite-database` usada, lendo da esquerda para a direita, é a que entra em vigor. Por exemplo, se `--rewrite-database=db1,db2 --rewrite-database=db1,db3` for usado, apenas `--rewrite-database=db1,db3` será atendido, e `--rewrite-database=db1,db2` será ignorado. Também é possível restaurar de várias bases de dados para uma única base de dados, de modo que `--rewrite-database=db1,db3 --rewrite-database=db2,db3` restaura todas as tabelas e dados das bases de dados `db1` e `db2` para a base de dados `db3`.

  Importante

  Ao restaurar de múltiplas bases de dados de backup para uma única base de dados de destino usando `--rewrite-database`, não é realizada uma verificação para colisões entre nomes de tabelas ou outros objetos, e a ordem em que as linhas são restauradas não é garantida. Isso significa que, nesses casos, é possível que as linhas sejam sobrescritas e as atualizações sejam perdidas.

- `--skip-broken-objects`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>6

  Essa opção faz com que o **ndb\_restore** ignore tabelas corrompidas ao ler um backup nativo do `NDB` e continue restaurando quaisquer tabelas restantes (que não estejam também corrompidas). Atualmente, a opção `--skip-broken-objects` funciona apenas no caso de tabelas de partes de blob ausentes.

- `--skip-table-check`, `-s`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>7

  É possível restaurar dados sem restaurar os metadados da tabela. Por padrão, ao fazer isso, o **ndb\_restore** falha com um erro se uma incompatibilidade for encontrada entre os dados da tabela e o esquema da tabela; essa opção substitui esse comportamento.

  Algumas das restrições sobre desalinhamentos nas definições das colunas ao restaurar dados usando **ndb\_restore** foram relaxadas; quando um desses tipos de desalinhamentos é encontrado, **ndb\_restore** não pára com um erro como fazia anteriormente, mas sim aceita os dados e os insere na tabela de destino, emitindo um aviso ao usuário de que isso está sendo feito. Esse comportamento ocorre independentemente de uma das opções `--skip-table-check` ou `--promote-attributes` estar em uso. Essas diferenças nas definições das colunas são dos seguintes tipos:

  - Diferentes configurações de `COLUMN_FORMAT` (`FIXED`, `DYNAMIC`, `DEFAULT`)

  - Diferentes configurações de `STORAGE` (`MEMORY`, `DISK`)

  - Diferentes valores padrão

  - Diferentes configurações da chave de distribuição

- `--skip-unknown-objects`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>8

  Essa opção faz com que o **ndb\_restore** ignore quaisquer objetos do esquema que ele não reconheça ao ler um backup nativo `NDB`. Isso pode ser usado para restaurar um backup feito de um cluster que está rodando, por exemplo, NDB 7.6, para um cluster que está rodando NDB Cluster 7.5.

- `--slice-id`=`#`

  <table summary="Propriedades para backupid"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backupid=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>none</code>]]</td> </tr></tbody></table>9

  Ao restaurar por fatias, este é o ID da fatia a ser restaurada. Esta opção é sempre usada juntamente com `--num-slices`, e seu valor deve ser sempre menor que o de `--num-slices`.

  Para mais informações, consulte a descrição do `--num-slices` em outro lugar nesta seção.

- `--tab`=`dir_name`, `-T` `dir_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>0

  Faz com que `--print-data` crie arquivos de depuração, um por tabela, cada um com o nome `tbl_name.txt`. Ele requer como argumento o caminho para o diretório onde os arquivos devem ser salvos; use `.` para o diretório atual.

- `--timestamp-printouts`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>1

  As mensagens de informações, erros e logs de depuração são prefixadas com timestamps.

  Esta opção está habilitada por padrão no NDB 8.0. Desative-a com `--timestamp-printouts=false`.

- `--usage`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>2

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`=`#`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>3

  Define o nível de detalhamento da saída. O valor mínimo é 0; o máximo é 255. O valor padrão é 1.

- `--version`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>4

  Exibir informações da versão e sair.

- `--with-apply-status`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>5

  Restaure todas as linhas da tabela `ndb_apply_status` do backup (exceto a linha que contém `server_id = 0`, que é gerada usando `--restore-epoch`). Esta opção exige que `--restore-data` também seja usado.

  Se a tabela `ndb_apply_status` do backup já contiver uma linha com `server_id = 0`, o **ndb\_restore** `--with-apply-status` a exclui. Por essa razão, recomendamos que você use o **ndb\_restore** `--restore-epoch` após invocar o **ndb\_restore** com a opção `--with-apply-status`. Você também pode usar o **ndb\_restore** `--restore-epoch` simultaneamente com o último de quaisquer invocatórias do **ndb\_restore** `--with-apply-status` usado para restaurar o clúster.

  Para mais informações, consulte a tabela ndb\_apply\_status.

As opções típicas para este utilitário são mostradas aqui:

```
ndb_restore [-c connection_string] -n node_id -b backup_id \
      [-m] -r --backup-path=/path/to/backup/files
```

Normalmente, ao restaurar de um backup de um NDB Cluster, o **ndb\_restore** requer, no mínimo, as opções `--nodeid` (forma abreviada: `-n`), `--backupid` (forma abreviada: `-b`), e `--backup-path`.

A opção `-c` é usada para especificar uma string de conexão que indica ao `ndb_restore` onde localizar o servidor de gerenciamento do cluster (veja a Seção 25.4.3.3, “Strings de Conexão de NDB Cluster”). Se essa opção não for usada, o **ndb\_restore** tentará se conectar a um servidor de gerenciamento em `localhost:1186`. Esse utilitário atua como um nó da API do cluster e, portanto, requer um “slot” de conexão livre para se conectar ao servidor de gerenciamento do cluster. Isso significa que deve haver pelo menos uma seção `[api]` ou `[mysqld]` que possa ser usada por ele no arquivo de cluster `config.ini`. É uma boa ideia manter pelo menos uma seção `[api]` ou `[mysqld]` vazia em `config.ini` que não esteja sendo usada por um servidor MySQL ou outra aplicação por essa razão (veja a Seção 25.4.3.7, “Definindo Nodos SQL e Outros Nodos de API em um NDB Cluster”).

No NDB 8.0.22 e versões posteriores, o **ndb\_restore** pode descriptografar um backup criptografado usando `--decrypt` e `--backup-password`. Ambas as opções devem ser especificadas para realizar a descriptografia. Consulte a documentação do comando do cliente de gerenciamento `START BACKUP` para obter informações sobre a criação de backups criptografados.

Você pode verificar se o **ndb\_restore** está conectado ao cluster usando o comando `SHOW` no cliente de gerenciamento **ndb\_mgm**. Você também pode fazer isso a partir de uma janela de sistema, como mostrado aqui:

```
$> ndb_mgm -e "SHOW"
```

**Relatório de erros.** O **ndb\_restore** relata tanto erros temporários quanto permanentes. No caso de erros temporários, ele pode recuperá-los e, nesses casos, relata `Restore successful, but encountered temporary error, please look at configuration`.

Importante

Após usar o **ndb\_restore** para inicializar um NDB Cluster para uso na replicação circular, os logs binários no nó SQL que atua como replica não são criados automaticamente e você deve criar manualmente. Para fazer com que os logs binários sejam criados, execute uma declaração `SHOW TABLES` nesse nó SQL antes de executar `START SLAVE`. Esse é um problema conhecido no NDB Cluster.
