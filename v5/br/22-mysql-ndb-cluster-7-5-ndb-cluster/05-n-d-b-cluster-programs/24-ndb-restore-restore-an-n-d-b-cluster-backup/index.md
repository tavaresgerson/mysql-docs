### 21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster

[21.5.24.1 Restaurando um Backup NDB para uma Versão Diferente do NDB Cluster](ndb-restore-to-different-version.html)

[21.5.24.2 Restaurando para um número diferente de nós de dados](ndb-restore-different-number-nodes.html)

O programa de restauração do NDB Cluster é implementado como um utilitário de linha de comando separado [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"), que normalmente pode ser encontrado no diretório `bin` do MySQL. Este programa lê os arquivos criados como resultado do backup e insere as informações armazenadas no Database.

Nota

A partir do NDB 7.5.15 e 7.6.11, este programa não imprime mais `NDBT_ProgramExit: ...` ao finalizar sua execução. Aplicações que dependem deste comportamento devem ser modificadas adequadamente ao fazer o upgrade de releases anteriores.

[**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") deve ser executado uma vez para cada um dos arquivos de backup que foram criados pelo comando [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") usado para criar o backup (veja [Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup")). Isso é igual ao número de nós de dados no cluster no momento em que o backup foi criado.

Nota

Antes de usar [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"), é recomendado que o cluster esteja rodando em modo single user, a menos que você esteja restaurando múltiplos nós de dados em paralelo. Veja [Seção 21.6.6, “Modo Single User do NDB Cluster”](mysql-cluster-single-user-mode.html "21.6.6 NDB Cluster Single User Mode"), para mais informações.

As opções que podem ser usadas com [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.38 Opções de Linha de Comando Usadas com o Programa ndb_restore**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --allow-pk-changes[=0|1] </code> </p></th> <td>Permite alterações no conjunto de colunas que compõem a Primary Key da tabela</td> <td><p> ADICIONADO: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --append </code> </p></th> <td>Anexa dados a um arquivo delimitado por tabulação</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --backup-path=path </code> </p></th> <td>Caminho para o diretório de arquivos de backup</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--backupid=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code> </p></th> <td>Restaura a partir do backup que possui este ID</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo os Character Sets</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Alias para --connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a reconexão antes de desistir</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos a esperar entre as tentativas de contato com o management server</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve core file em caso de erro; usado em debug</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê opções default apenas do arquivo fornecido</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(grupo, suffix)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --disable-indexes </code> </p></th> <td>Faz com que os Indexes do backup sejam ignorados; pode diminuir o tempo necessário para restaurar os dados</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--dont-ignore-systab-0</code>, </p><p> <code> -f </code> </p></th> <td>Não ignora a tabela de sistema durante a restauração; apenas experimental; não para uso em produção</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-databases=list </code> </p></th> <td>Lista de um ou mais Databases a excluir (inclui aqueles que não foram nomeados)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-intermediate-sql-tables[=TRUE|FALSE] </code> </p></th> <td>Não restaura quaisquer tabelas intermediárias (com nomes prefixados com '#sql-') que sobraram das operações ALTER TABLE de cópia; especifique FALSE para restaurar essas tabelas</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-missing-columns </code> </p></th> <td>Faz com que as colunas do backup que estão faltando na versão da tabela no Database sejam ignoradas</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-missing-tables </code> </p></th> <td>Faz com que as tabelas do backup que estão faltando no Database sejam ignoradas</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-tables=list </code> </p></th> <td>Lista de uma ou mais tabelas a excluir (inclui aquelas no mesmo Database que não foram nomeadas); cada referência de tabela deve incluir o nome do Database</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-enclosed-by=char </code> </p></th> <td>Os campos são delimitados por este caractere</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-optionally-enclosed-by </code> </p></th> <td>Os campos são opcionalmente delimitados por este caractere</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-terminated-by=char </code> </p></th> <td>Os campos são terminados por este caractere</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --hex </code> </p></th> <td>Imprime tipos binários em formato hexadecimal</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ignore-extended-pk-updates[=0|1] </code> </p></th> <td>Ignora entradas de log contendo Updates para colunas agora incluídas na Primary Key estendida</td> <td><p> ADICIONADO: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --include-databases=list </code> </p></th> <td>Lista de um ou mais Databases a restaurar (exclui aqueles que não foram nomeados)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --include-tables=list </code> </p></th> <td>Lista de uma ou mais tabelas a restaurar (exclui aquelas no mesmo Database que não foram nomeadas); cada referência de tabela deve incluir o nome do Database</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --lines-terminated-by=char </code> </p></th> <td>As linhas são terminadas por este caractere</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do login file</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lossy-conversions</code>, </p><p> <code> -L </code> </p></th> <td>Permite conversões com perda de valor de colunas (diminuições de tipo ou mudanças de sinal) ao restaurar dados do backup</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-binlog </code> </p></th> <td>Se mysqld estiver conectado e usando binary logging, não registra os dados restaurados</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções default de nenhum arquivo de opção, exceto o login file</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-restore-disk-objects</code>, </p><p> <code> -d </code> </p></th> <td>Não restaura objetos relacionados a Disk Data</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-upgrade</code>, </p><p> <code> -u </code> </p></th> <td>Não faz upgrade do tipo array para atributos varsize que ainda não redimensionam dados VAR, e não altera atributos de coluna</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connection string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-nodegroup-map=map</code>, </p><p> <code> -z </code> </p></th> <td>Especifica o mapeamento do node group; não utilizado, sem suporte</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID do nó para este nó, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nós para Transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--nodeid=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid">-n
                #</a> </code> </p></th> <td>ID do nó onde o backup foi realizado</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --num-slices=# </code> </p></th> <td>Número de slices a aplicar ao restaurar por slice</td> <td><p> ADICIONADO: NDB 7.6.13 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_parallelism">-p
                #</a> </code> </p></th> <td>Número de Transactions paralelas a usar durante a restauração de dados</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--preserve-trailing-spaces</code>, </p><p> <code> -P </code> </p></th> <td>Permite a preservação de espaços em branco finais (incluindo padding) ao promover tipos de string de largura fixa para tipos de largura variável</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print </code> </p></th> <td>Imprime metadata, data e log para stdout (equivalente a --print-meta --print-data --print-log)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-data </code> </p></th> <td>Imprime dados para stdout</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-log </code> </p></th> <td>Imprime log para stdout</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-meta </code> </p></th> <td>Imprime metadata para stdout</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-sql-log </code> </p></th> <td>Escreve SQL log para stdout</td> <td><p> ADICIONADO: NDB 7.5.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --progress-frequency=# </code> </p></th> <td>Imprime o status da restauração a cada número de segundos fornecido</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--promote-attributes</code>, </p><p> <code> -A </code> </p></th> <td>Permite que atributos sejam promovidos ao restaurar dados do backup</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rebuild-indexes </code> </p></th> <td>Faz a reconstrução multithreaded de Ordered Indexes encontrados no backup; o número de Threads usados é determinado pela configuração BuildIndexThreads</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --remap-column=string </code> </p></th> <td>Aplica offset ao valor da coluna especificada usando a função e argumentos indicados. O formato é [db].[tbl].[col]:[fn]:[args]; veja a documentação para detalhes</td> <td><p> ADICIONADO: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-data</code>, </p><p> <code> -r </code> </p></th> <td>Restaura dados de tabela e logs no NDB Cluster usando NDB API</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-epoch</code>, </p><p> <code> -e </code> </p></th> <td>Restaura informações de epoch na tabela de status; útil em Replica Cluster para iniciar Replication; atualiza ou insere linha em mysql.ndb_apply_status com ID 0</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-meta</code>, </p><p> <code> -m </code> </p></th> <td>Restaura metadata no NDB Cluster usando NDB API</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --restore-privilege-tables </code> </p></th> <td>Restaura tabelas de privilégios do MySQL que foram previamente movidas para NDB</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rewrite-database=string </code> </p></th> <td>Restaura para um Database com nome diferente; o formato é olddb,newdb</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-broken-objects </code> </p></th> <td>Ignora tabelas BLOB ausentes no arquivo de backup</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--skip-table-check</code>, </p><p> <code> -s </code> </p></th> <td>Pula a verificação da estrutura da tabela durante a restauração</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-unknown-objects </code> </p></th> <td>Faz com que os objetos de schema não reconhecidos por ndb_restore sejam ignorados ao restaurar backup feito de uma versão NDB mais nova para uma versão mais antiga</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --slice-id=# </code> </p></th> <td>ID do Slice, ao restaurar por slices</td> <td><p> ADICIONADO: NDB 7.6.13 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--tab=path</code>, </p><p> <code> -T path </code> </p></th> <td>Cria um arquivo .txt separado por tabulação para cada tabela no caminho fornecido</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --timestamp-printouts{=true|false} </code> </p></th> <td>Prefixa todas as mensagens de log de informação, erro e debug com Timestamps</td> <td><p> ADICIONADO: NDB 7.5.30, 5.7.41-ndb-7.6.26 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --verbose=# </code> </p></th> <td>Nível de verbosidade na saída</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody></table>

* `--allow-pk-changes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Quando esta opção é definida como `1`, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") permite que as Primary Keys em uma definição de tabela sejam diferentes da mesma tabela no backup. Isso pode ser desejável ao fazer backup e restaurar entre diferentes versões de schema com alterações na Primary Key em uma ou mais tabelas, e parece que realizar a operação de restauração usando ndb_restore é mais simples ou mais eficiente do que emitir muitas instruções [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") após restaurar os schemas e dados da tabela.

  As seguintes alterações nas definições de Primary Key são suportadas por `--allow-pk-changes`:

  + **Estender a Primary Key**: Uma coluna não-nula que existe no schema da tabela no backup torna-se parte da Primary Key da tabela no Database.

    Importante

    Ao estender a Primary Key de uma tabela, quaisquer colunas que se tornarem parte da Primary Key não devem ser atualizadas enquanto o backup estiver sendo realizado; quaisquer Updates descobertos por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") causam a falha da operação de restauração, mesmo que não ocorra nenhuma alteração de valor. Em alguns casos, pode ser possível anular este comportamento usando a opção [`--ignore-extended-pk-updates`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ignore-extended-pk-updates); veja a descrição desta opção para mais informações.

  + **Contrair a Primary Key (1)**: Uma coluna que já faz parte da Primary Key da tabela no schema de backup não é mais parte da Primary Key, mas permanece na tabela.

  + **Contrair a Primary Key (2)**: Uma coluna que já faz parte da Primary Key da tabela no schema de backup é removida inteiramente da tabela.

  Essas diferenças podem ser combinadas com outras diferenças de schema suportadas por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"), incluindo alterações em colunas BLOB e TEXT que exigem o uso de tabelas de staging.

  As etapas básicas em um cenário típico usando alterações de schema de Primary Key estão listadas aqui:

  1. Restaure os schemas das tabelas usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") [`--restore-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-meta)

  2. Altere o schema para o desejado ou crie-o
  3. Faça backup do schema desejado
  4. Execute [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes) usando o backup da etapa anterior, para remover Indexes e constraints

  5. Execute [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes) (possivelmente junto com [`--ignore-extended-pk-updates`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ignore-extended-pk-updates), [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes), e possivelmente outras opções conforme necessário) para restaurar todos os dados

  6. Execute [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes) usando o backup feito com o schema desejado, para reconstruir Indexes e constraints

  Ao estender a Primary Key, pode ser necessário que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") use um Secondary Unique Index temporário durante a operação de restauração para mapear da Primary Key antiga para a nova. Tal Index é criado apenas quando necessário para aplicar eventos do log de backup a uma tabela que tenha uma Primary Key estendida. Este Index é nomeado `NDB$RESTORE_PK_MAPPING` e é criado em cada tabela que o requer; ele pode ser compartilhado, se necessário, por múltiplas instâncias de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") rodando em paralelo. (A execução de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes) no final do processo de restauração faz com que este Index seja descartado.)

* `--append`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Quando usado com as opções [`--tab`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_tab) e [`--print-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-data), faz com que os dados sejam anexados a quaisquer arquivos existentes com os mesmos nomes.

* `--backup-path`=*`dir_name`*

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  O caminho para o diretório de backup é obrigatório; ele é fornecido a [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") usando a opção `--backup-path` e deve incluir o subdiretório correspondente ao ID do backup a ser restaurado. Por exemplo, se o [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) do nó de dados for `/var/lib/mysql-cluster`, então o diretório de backup é `/var/lib/mysql-cluster/BACKUP`, e os arquivos de backup para o backup com ID 3 podem ser encontrados em `/var/lib/mysql-cluster/BACKUP/BACKUP-3`. O caminho pode ser absoluto ou relativo ao diretório onde o executável [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") está localizado, e pode ser opcionalmente prefixado com `backup-path=`.

  É possível restaurar um backup para um Database com uma configuração diferente daquela de onde foi criado. Por exemplo, suponha que um backup com ID de backup `12`, criado em um cluster com dois nós de armazenamento tendo os IDs de nó `2` e `3`, deve ser restaurado para um cluster com quatro nós. Então, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") deve ser executado duas vezes – uma para cada nó de armazenamento no cluster onde o backup foi realizado. No entanto, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") nem sempre pode restaurar backups feitos de um cluster rodando uma versão do MySQL para um cluster rodando uma versão diferente do MySQL. Veja [Seção 21.3.7, “Upgrade e Downgrade do NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster"), para mais informações.

  Importante

  Não é possível restaurar um backup feito a partir de uma versão mais nova do NDB Cluster usando uma versão mais antiga do [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"). Você pode restaurar um backup feito de uma versão mais nova do MySQL para um cluster mais antigo, mas deve usar uma cópia do [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") da versão mais nova do NDB Cluster para fazê-lo.

  Por exemplo, para restaurar um backup de cluster feito de um cluster rodando NDB Cluster 7.6.36 para um cluster rodando NDB Cluster 7.5.36, você deve usar o [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") que acompanha a distribuição NDB Cluster 7.6.36.

  Para uma restauração mais rápida, os dados podem ser restaurados em paralelo, desde que haja um número suficiente de conexões de cluster disponíveis. Ou seja, ao restaurar para múltiplos nós em paralelo, você deve ter uma seção `[api]` ou `[mysqld]` no arquivo `config.ini` do cluster disponível para cada processo [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") concorrente. No entanto, os arquivos de dados devem ser sempre aplicados antes dos logs.

* `--backupid`=*`#`*, `-b`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Esta opção é usada para especificar o ID ou número de sequência do backup, e é o mesmo número mostrado pelo management client na mensagem `Backup backup_id completed` exibida após a conclusão de um backup. (Veja [Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup").)

  Importante

  Ao restaurar backups de cluster, você deve se certificar de restaurar todos os nós de dados a partir de backups que tenham o mesmo Backup ID. Usar arquivos de backups diferentes pode, na melhor das hipóteses, resultar na restauração do cluster para um estado inconsistente e pode falhar completamente.

  No NDB 7.5.13 e posterior, e no NDB 7.6.9 e posterior, esta opção é obrigatória.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo os Character Sets.

* `--connect`, `-c`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Alias para [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos a esperar entre as tentativas de contato com o management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Escreve core file em caso de erro; usado em debug.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Lê opções default apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--disable-indexes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Desabilita a restauração de Indexes durante a restauração dos dados de um backup `NDB` nativo. Depois, você pode restaurar Indexes para todas as tabelas de uma só vez com a construção multithreaded de Indexes usando [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes), o que deve ser mais rápido do que reconstruir Indexes concorrentemente para tabelas muito grandes.

  A partir do NDB 7.5.24 e NDB 7.6.20, esta opção também descarta quaisquer Foreign Keys especificadas no backup.

* `--dont-ignore-systab-0`, `-f`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Normalmente, ao restaurar dados e metadata de tabelas, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") ignora a cópia da tabela de sistema [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que está presente no backup. `--dont-ignore-systab-0` faz com que a tabela de sistema seja restaurada. *Esta opção destina-se apenas a uso experimental e de desenvolvimento, e não é recomendada em um ambiente de produção*.

* `--exclude-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Lista delimitada por vírgulas de um ou mais Databases que não devem ser restaurados.

  Esta opção é frequentemente usada em combinação com [`--exclude-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-tables); veja a descrição dessa opção para mais informações e exemplos.

* `--exclude-intermediate-sql-tables[`=*`TRUE|FALSE]`*

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  Ao realizar operações [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") de cópia, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") cria tabelas intermediárias (cujos nomes são prefixados com `#sql-`). Quando `TRUE`, a opção `--exclude-intermediate-sql-tables` impede que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") restaure tais tabelas que possam ter sobrado dessas operações. Esta opção é `TRUE` por default.

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  É possível restaurar apenas colunas de tabela selecionadas usando esta opção, o que faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") ignore quaisquer colunas ausentes nas tabelas sendo restauradas em comparação com as versões dessas tabelas encontradas no backup. Esta opção se aplica a todas as tabelas sendo restauradas. Se você deseja aplicar esta opção apenas a tabelas ou Databases selecionados, você pode usá-la em combinação com uma ou mais das opções `--include-*` ou `--exclude-*` descritas em outro lugar nesta seção para fazer isso, e então restaurar os dados para as tabelas restantes usando um conjunto complementar dessas opções.

* `--exclude-missing-tables`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></tbody></table>

  É possível restaurar apenas tabelas selecionadas usando esta opção, o que faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") ignore quaisquer tabelas do backup que não sejam encontradas no Database de destino.

* `--exclude-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Lista de uma ou mais tabelas para excluir; cada referência de tabela deve incluir o nome do Database. Frequentemente usada junto com [`--exclude-databases`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases).

  Quando `--exclude-databases` ou `--exclude-tables` é usado, apenas os Databases ou tabelas nomeados pela opção são excluídos; todos os outros Databases e tabelas são restaurados por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster").

  Esta tabela mostra várias invocações de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") usando opções `--exclude-*` (outras opções possivelmente necessárias foram omitidas por clareza), e os efeitos que estas opções têm na restauração de um backup do NDB Cluster:

  **Tabela 21.39 Várias invocações de ndb_restore usando opções --exclude-\*, e os efeitos que estas opções têm na restauração de um backup do NDB Cluster.**

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Você pode usar estas duas opções juntas. Por exemplo, o seguinte faz com que todas as tabelas em todos os Databases *exceto* os Databases `db1` e `db2`, e as tabelas `t1` e `t2` no Database `db3`, sejam restauradas:

  ```sql
  $> ndb_restore [...] --exclude-databases=db1,db2 --exclude-tables=db3.t1,db3.t2
  ```

  (Novamente, omitimos outras opções possivelmente necessárias no interesse de clareza e brevidade do exemplo recém-mostrado.)

  Você pode usar as opções `--include-*` e `--exclude-*` juntas, sujeitas às seguintes regras:

  + As ações de todas as opções `--include-*` e `--exclude-*` são cumulativas.

  + Todas as opções `--include-*` e `--exclude-*` são avaliadas na ordem em que são passadas para ndb_restore, da direita para a esquerda.

  + Em caso de opções conflitantes, a primeira opção (mais à direita) tem precedência. Em outras palavras, a primeira opção (indo da direita para a esquerda) que corresponde a um determinado Database ou tabela "ganha".

  Por exemplo, o seguinte conjunto de opções faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") restaure todas as tabelas do Database `db1`, exceto `db1.t1`, enquanto não restaura nenhuma outra tabela de qualquer outro Database:

  ```sql
  --include-databases=db1 --exclude-tables=db1.t1
  ```

  No entanto, inverter a ordem das opções recém-fornecidas simplesmente faz com que todas as tabelas do Database `db1` sejam restauradas (incluindo `db1.t1`, mas nenhuma tabela de qualquer outro Database), porque a opção [`--include-databases`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_include-databases), estando mais à direita, é a primeira correspondência contra o Database `db1` e, portanto, tem precedência sobre qualquer outra opção que corresponda a `db1` ou a qualquer tabela em `db1`:

  ```sql
  --exclude-tables=db1.t1 --include-databases=db1
  ```

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Cada valor de coluna é delimitado pela string passada para esta opção (independentemente do tipo de dado; veja a descrição de [`--fields-optionally-enclosed-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-optionally-enclosed-by)).

* `--fields-optionally-enclosed-by`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  A string passada para esta opção é usada para delimitar valores de coluna que contêm dados de caracteres (como [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), ou [`ENUM`](enum.html "11.3.5 The ENUM Type")).

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  A string passada para esta opção é usada para separar os valores das colunas. O valor default é um caractere de tabulação (`\t`).

* `--help`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--hex`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Se esta opção for usada, todos os valores binários são exibidos em formato hexadecimal.

* `--ignore-extended-pk-updates`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Ao usar a opção [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes), as colunas que se tornam parte da Primary Key de uma tabela não devem ser atualizadas enquanto o backup estiver sendo realizado; tais colunas devem manter os mesmos valores desde o momento em que os valores são inseridos nelas até que as linhas contendo os valores sejam excluídas. Se [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") encontrar Updates para essas colunas ao restaurar um backup, a restauração falhará. Como alguns aplicativos podem definir valores para todas as colunas ao atualizar uma linha, mesmo quando alguns valores de coluna não são alterados, o backup pode incluir eventos de log que parecem atualizar colunas que na verdade não são modificadas. Nesses casos, você pode definir `--ignore-extended-pk-updates` como `1`, forçando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") a ignorar tais Updates.

  Importante

  Ao fazer com que esses Updates sejam ignorados, o usuário é responsável por garantir que não haja Updates nos valores de quaisquer colunas que se tornem parte da Primary Key.

  Para mais informações, veja a descrição de [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes).

* `--include-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Lista delimitada por vírgulas de um ou mais Databases a serem restaurados. Frequentemente usada junto com [`--include-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_include-tables); veja a descrição dessa opção para mais informações e exemplos.

* `--include-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--append</code></td> </tr></tbody></table>

  Lista delimitada por vírgulas de tabelas a serem restauradas; cada referência de tabela deve incluir o nome do Database.

  Quando `--include-databases` ou `--include-tables` é usado, apenas os Databases ou tabelas nomeados pela opção são restaurados; todos os outros Databases e tabelas são excluídos por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") e não são restaurados.

  A tabela a seguir mostra várias invocações de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") usando opções `--include-*` (outras opções possivelmente necessárias foram omitidas por clareza), e os efeitos que elas têm na restauração de um backup do NDB Cluster:

  **Tabela 21.40 Várias invocações de ndb_restore usando opções --include-\*, e seus efeitos na restauração de um backup do NDB Cluster.**

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Você também pode usar estas duas opções juntas. Por exemplo, o seguinte faz com que todas as tabelas nos Databases `db1` e `db2`, juntamente com as tabelas `t1` e `t2` no Database `db3`, sejam restauradas (e nenhum outro Database ou tabela):

  ```sql
  $> ndb_restore [...] --include-databases=db1,db2 --include-tables=db3.t1,db3.t2
  ```

  (Novamente, omitimos outras opções, possivelmente necessárias, no exemplo recém-mostrado.)

  Também é possível restaurar apenas Databases selecionados, ou tabelas selecionadas de um único Database, sem quaisquer opções `--include-*` (ou `--exclude-*`), usando a sintaxe mostrada aqui:

  ```sql
  ndb_restore other_options db_name,[db_name[,...] | tbl_name[,tbl_name][,...
  ```

  Em outras palavras, você pode especificar qualquer um dos seguintes para ser restaurado:

  + Todas as tabelas de um ou mais Databases
  + Uma ou mais tabelas de um único Database
* `--lines-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Especifica a string usada para finalizar cada linha de saída. O default é um caractere de quebra de linha (`\n`).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do login file.

* `--lossy-conversions`, `-L`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Esta opção se destina a complementar a opção [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes). Usar `--lossy-conversions` permite conversões com perda de valor de colunas (diminuições de tipo ou mudanças de sinal) ao restaurar dados do backup. Com algumas exceções, as regras que regem a diminuição são as mesmas que para o MySQL Replication; veja [Seção 16.4.1.10.2, “Replication de Colunas com Tipos de Dados Diferentes”](replication-features-differing-tables.html#replication-features-different-data-types "16.4.1.10.2 Replication of Columns Having Different Data Types"), para informações sobre conversões de tipo específicas atualmente suportadas pela diminuição de atributos.

  A partir do NDB 7.5.23 e NDB 7.6.19, esta opção também torna possível restaurar uma coluna `NULL` como `NOT NULL`. A coluna não deve conter nenhuma entrada `NULL`; caso contrário, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") para com um erro.

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") relata qualquer truncamento de dados que realiza durante conversões com perda de valor uma vez por atributo e coluna.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--ndb-nodegroup-map`=*`map`*, `-z`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Destinado a restaurar um backup feito de um node group para um node group diferente, mas nunca totalmente implementado; sem suporte.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Define o ID do nó para este nó, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nós para Transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-binlog`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Default</th> <td><code>./</code></td> </tr></tbody></table>

  Esta opção impede que quaisquer SQL nodes conectados escrevam dados restaurados por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") em seus Binary Logs.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Não lê opções default de nenhum arquivo de opção além do login file.

* `--no-restore-disk-objects`, `-d`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Esta opção impede que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") restaure quaisquer objetos NDB Cluster Disk Data, como tablespaces e log file groups; veja [Seção 21.6.11, “Tabelas Disk Data do NDB Cluster”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables"), para mais informações sobre estes.

* `--no-upgrade`, `-u`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Ao usar [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") para restaurar um backup, as colunas [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") criadas usando o formato fixo antigo são redimensionadas e recriadas usando o formato de largura variável agora empregado. Este comportamento pode ser anulado especificando `--no-upgrade`.

* `--nodeid`=*`#`*, `-n`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Especifica o ID do nó de dados no qual o backup foi realizado.

  Ao restaurar para um cluster com número diferente de nós de dados daquele onde o backup foi realizado, esta informação ajuda a identificar o conjunto correto de arquivos a serem restaurados para um determinado nó. (Nesses casos, múltiplos arquivos geralmente precisam ser restaurados para um único nó de dados.) Veja [Seção 21.5.24.2, “Restaurando para um número diferente de nós de dados”](ndb-restore-different-number-nodes.html "21.5.24.2 Restoring to a different number of data nodes"), para informações adicionais e exemplos.

  No NDB 7.5.13 e posterior, e no NDB 7.6.9 e posterior, esta opção é obrigatória.

* `--num-slices`=*`#`*

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Ao restaurar um backup por slices, esta opção define o número de slices em que o backup deve ser dividido. Isso permite que múltiplas instâncias de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") restaurem subconjuntos disjuntos em paralelo, potencialmente reduzindo o tempo necessário para realizar a operação de restauração.

  Um *slice* é um subconjunto dos dados em um determinado backup; ou seja, é um conjunto de fragments que possuem o mesmo ID de slice, especificado usando a opção [`--slice-id`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_slice-id). As duas opções devem ser sempre usadas juntas, e o valor definido por `--slice-id` deve ser sempre menor que o número de slices.

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") encontra fragments e atribui a cada um um contador de fragment. Ao restaurar por slices, um ID de slice é atribuído a cada fragment; este ID de slice está no intervalo de 0 a 1 a menos que o número de slices. Para uma tabela que não é uma tabela [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), o slice ao qual um determinado fragment pertence é determinado usando a fórmula mostrada aqui:

  ```sql
  [slice_ID] = [fragment_counter] % [number_of_slices]
  ```

  Para uma tabela [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), um contador de fragment não é usado; o número do fragment é usado em vez disso, juntamente com o ID da tabela principal para a tabela `BLOB` (lembre-se que `NDB` armazena valores *`BLOB`* em uma tabela separada internamente). Neste caso, o ID do slice para um determinado fragment é calculado conforme mostrado aqui:

  ```sql
  [slice_ID] =
  ([main_table_ID] + [fragment_ID]) % [number_of_slices]
  ```

  Assim, restaurar por *`N`* slices significa rodar *`N`* instâncias de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"), todas com `--num-slices=N` (juntamente com quaisquer outras opções necessárias) e uma com [`--slice-id=1`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_slice-id), `--slice-id=2`, `--slice-id=3`, e assim por diante até `slice-id=N-1`.

* `--parallelism`=*`#`*, `-p`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") usa Transactions de linha única para aplicar muitas linhas concorrentemente. Este parâmetro determina o número de Transactions paralelas (linhas concorrentes) que uma instância de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") tenta usar. Por default, este é 128; o mínimo é 1 e o máximo é 1024.

  O trabalho de realizar as inserções é paralelizado entre os Threads nos nós de dados envolvidos. Este mecanismo é empregado para restaurar dados em massa do arquivo `.Data` — ou seja, o fuzzy snapshot dos dados; não é usado para construir ou reconstruir Indexes. O Change Log é aplicado serialmente; os Index Drops e Builds são operações DDL e tratadas separadamente. Não há paralelismo em nível de Thread no lado do Client da restauração.

* `--preserve-trailing-spaces`, `-P`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Faz com que os espaços em branco finais sejam preservados ao promover um tipo de dado de caractere de largura fixa para seu equivalente de largura variável — ou seja, ao promover um valor de coluna [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") para [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), ou um valor de coluna `BINARY` para [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"). Caso contrário, quaisquer espaços em branco finais são descartados de tais valores de coluna quando são inseridos nas novas colunas.

  Nota

  Embora você possa promover colunas [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") para [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") e colunas `BINARY` para [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), você não pode promover colunas [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") para [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") ou colunas [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") para `BINARY`.

* `--print`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") imprima todos os dados, metadata e logs para `stdout`. Equivalente a usar as opções [`--print-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-data), [`--print-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-meta) e [`--print-log`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-log) juntas.

  Nota

  O uso de `--print` ou de qualquer uma das opções `--print_*` é, na verdade, realizar um dry run. Incluir uma ou mais destas opções faz com que qualquer saída seja redirecionada para `stdout`; em tais casos, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") não faz nenhuma tentativa de restaurar dados ou metadata para um NDB Cluster.

* `--print-data`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") direcione sua saída para `stdout`. Frequentemente usado junto com uma ou mais das opções [`--tab`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_tab), [`--fields-enclosed-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-enclosed-by), [`--fields-optionally-enclosed-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-optionally-enclosed-by), [`--fields-terminated-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-terminated-by), [`--hex`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_hex) e [`--append`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_append).

  Valores de coluna [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") e [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") são sempre truncados. Tais valores são truncados para os primeiros 256 bytes na saída. Atualmente, isso não pode ser anulado ao usar `--print-data`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backupid=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>none</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--print-log`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") gere seu log para `stdout`.

* `--print-meta`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime todos os metadata para `stdout`.

* `print-sql-log`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Registra instruções SQL em `stdout`. Use a opção para habilitar; normalmente, este comportamento é desabilitado. A opção verifica antes de tentar registrar se todas as tabelas sendo restauradas têm Primary Keys explicitamente definidas; Queries em uma tabela que possui apenas a Primary Key oculta implementada pelo `NDB` não podem ser convertidas em SQL válido.

  Esta opção não funciona com tabelas que possuem colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types").

  A opção [`--print-sql-log`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-sql-log) foi adicionada no NDB 7.5.4. (Bug #13511949)

* `--progress-frequency`=*`N`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime um relatório de status a cada *`N`* segundos enquanto o backup está em andamento. 0 (o default) faz com que nenhum relatório de status seja impresso. O máximo é 65535.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") suporta a promoção limitada de atributos da mesma forma que é suportada pelo MySQL Replication; ou seja, dados submetidos a backup de uma coluna de um determinado tipo podem geralmente ser restaurados para uma coluna usando um tipo "similar e maior". Por exemplo, dados de uma coluna `CHAR(20)` podem ser restaurados para uma coluna declarada como `VARCHAR(20)`, `VARCHAR(30)` ou `CHAR(30)`; dados de uma coluna [`MEDIUMINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") podem ser restaurados para uma coluna do tipo [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Veja [Seção 16.4.1.10.2, “Replication de Colunas com Tipos de Dados Diferentes”](replication-features-differing-tables.html#replication-features-different-data-types "16.4.1.10.2 Replication of Columns Having Different Data Types"), para uma tabela de conversões de tipo atualmente suportadas pela promoção de atributos.

  A partir do NDB 7.5.23 e NDB 7.6.19, esta opção também torna possível restaurar uma coluna `NOT NULL` como `NULL`.

  A promoção de atributos por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") deve ser habilitada explicitamente, da seguinte forma:

  1. Prepare a tabela para a qual o backup será restaurado. [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") não pode ser usado para recriar a tabela com uma definição diferente da original; isso significa que você deve criar a tabela manualmente ou alterar as colunas que deseja promover usando [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") após restaurar o metadata da tabela, mas antes de restaurar os dados.

  2. Invoque [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") com a opção [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes) (forma curta `-A`) ao restaurar os dados da tabela. A promoção de atributos não ocorre se esta opção não for usada; em vez disso, a operação de restauração falha com um erro.

  Ao converter entre tipos de dados de caracteres e `TEXT` ou `BLOB`, apenas conversões entre tipos de caracteres ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") e [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types")) e tipos binários ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") e [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types")) podem ser realizadas ao mesmo tempo. Por exemplo, você não pode promover uma coluna [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") enquanto promove uma coluna `VARCHAR` para `TEXT` na mesma invocação de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster").

  A conversão entre colunas [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") usando diferentes Character Sets não é suportada e é expressamente proibida.

  Ao realizar conversões de tipos de caracteres ou binários para `TEXT` ou `BLOB` com [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"), você pode notar que ele cria e usa uma ou mais tabelas de staging nomeadas `table_name$STnode_id`. Essas tabelas não são necessárias depois e são normalmente excluídas por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") após uma restauração bem-sucedida.

* `--rebuild-indexes`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita a reconstrução multithreaded dos Ordered Indexes ao restaurar um backup `NDB` nativo. O número de Threads usados para construir Ordered Indexes por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") com esta opção é controlado pelo parâmetro de configuração do nó de dados [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads) e o número de LDMs.

  É necessário usar esta opção apenas para a primeira execução de [**ndb_restore**](mysql-cluster-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"); isso faz com que todos os Ordered Indexes sejam reconstruídos sem usar `--rebuild-indexes` novamente ao restaurar nós subsequentes. Você deve usar esta opção antes de inserir novas linhas no Database; caso contrário, é possível que uma linha seja inserida e posteriormente cause uma violação de Unique Constraint ao tentar reconstruir os Indexes.

  A construção de Ordered Indexes é paralelizada com o número de LDMs por default. As Index Builds offline realizadas durante reinicializações de nó e sistema podem ser aceleradas usando o parâmetro de configuração do nó de dados [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads); este parâmetro não tem efeito sobre a remoção e reconstrução de Indexes por [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"), que é realizada online.

  A reconstrução de Unique Indexes usa a largura de banda de escrita em disco para redo logging e Local Checkpointing (LCP). Uma quantidade insuficiente dessa largura de banda pode levar a sobrecarga do Buffer de Redo Log ou erros de sobrecarga de Log. Nesses casos, você pode executar [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") `--rebuild-indexes` novamente; o processo será retomado no ponto onde o erro ocorreu. Você também pode fazer isso quando tiver encontrado erros temporários. Você pode repetir a execução de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") `--rebuild-indexes` indefinidamente; você pode ser capaz de interromper tais erros reduzindo o valor de [`--parallelism`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_parallelism). Se o problema for espaço insuficiente, você pode aumentar o tamanho do Redo Log ([`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize) parâmetro de configuração do nó), ou você pode aumentar a velocidade com que os LCPs são realizados ([`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed) e parâmetros relacionados), a fim de liberar espaço mais rapidamente.

* `--remap-column=db.tbl.col:fn:args`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Quando usada juntamente com [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data), esta opção aplica uma função ao valor da coluna indicada. Os valores na string de argumento estão listados aqui:

  + *`db`*: Nome do Database, após quaisquer renomeações realizadas por [`--rewrite-database`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rewrite-database).

  + *`tbl`*: Nome da tabela.
  + *`col`*: Nome da coluna a ser atualizada. Esta coluna deve ser do tipo [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). A coluna também pode ser, mas não é obrigatório, `UNSIGNED`.

  + *`fn`*: Nome da função; atualmente, o único nome suportado é `offset`.

  + *`args`*: Argumentos fornecidos à função. Atualmente, apenas um único argumento, o tamanho do offset a ser adicionado pela função `offset`, é suportado. Valores negativos são suportados. O tamanho do argumento não pode exceder o da variante com sinal do tipo da coluna; por exemplo, se *`col`* é uma coluna `INT`, então o intervalo permitido do argumento passado para a função `offset` é de `-2147483648` a `2147483647` (veja [Seção 11.1.2, “Tipos de Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")).

    Se a aplicação do valor de offset à coluna causar um overflow ou underflow, a operação de restauração falhará. Isso pode acontecer, por exemplo, se a coluna for um `BIGINT`, e a opção tentar aplicar um valor de offset de 8 em uma linha na qual o valor da coluna é 4294967291, já que `4294967291 + 8 = 4294967299 > 4294967295`.

  Esta opção pode ser útil quando você deseja mesclar dados armazenados em múltiplas instâncias de origem do NDB Cluster (todas usando o mesmo schema) em um único NDB Cluster de destino, usando backup nativo NDB (veja [Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup")) e [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") para mesclar os dados, onde os valores de Primary e Unique Key se sobrepõem entre os clusters de origem, e é necessário como parte do processo remapear esses valores para intervalos que não se sobreponham. Também pode ser necessário preservar outras relações entre tabelas. Para atender a tais requisitos, é possível usar a opção várias vezes na mesma invocação de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") para remapear colunas de diferentes tabelas, conforme mostrado aqui:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.id:offset:1000 \
      --remap-column=hr.manager.id:offset:1000 --remap-column=hr.firstaiders.id:offset:1000
  ```

  (Outras opções não mostradas aqui também podem ser usadas.)

  `--remap-column` também pode ser usado para atualizar múltiplas colunas da mesma tabela. Combinações de múltiplas tabelas e colunas são possíveis. Diferentes valores de offset também podem ser usados para diferentes colunas da mesma tabela, assim:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.salary:offset:10000 \
      --remap-column=hr.employee.hours:offset:-10
  ```

  Quando os backups de origem contêm tabelas duplicadas que não devem ser mescladas, você pode lidar com isso usando [`--exclude-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-tables), [`--exclude-databases`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases), ou por algum outro meio em sua aplicação.

  Informações sobre a estrutura e outras características das tabelas a serem mescladas podem ser obtidas usando [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"); a ferramenta [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables"); e [`MAX()`](aggregate-functions.html#function_max), [`MIN()`](aggregate-functions.html#function_min), [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) e outras funções MySQL.

  A Replication de alterações de tabelas mescladas para não mescladas, ou de não mescladas para mescladas, em instâncias separadas do NDB Cluster não é suportada.

* `--restore-data`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe dados e logs da tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* `--restore-epoch`, `-e`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Adiciona (ou restaura) informações de epoch à tabela de status da Replication do cluster. Isso é útil para iniciar a Replication em um NDB Replica Cluster. Quando esta opção é usada, a linha em `mysql.ndb_apply_status` que tem `0` na coluna `id` é atualizada se já existir; tal linha é inserida se ainda não existir. (Veja [Seção 21.7.9, “Backups do NDB Cluster com NDB Cluster Replication”](mysql-cluster-replication-backups.html "21.7.9 NDB Cluster Backups With NDB Cluster Replication").)

* `--restore-meta`, `-m`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Esta opção faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") imprima o metadata da tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  Na primeira vez que você executa o programa de restauração [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"), você também precisa restaurar o metadata. Em outras palavras, você deve recriar as tabelas do Database — isso pode ser feito executando-o com a opção `--restore-meta` (`-m`). A restauração do metadata precisa ser feita apenas em um único nó de dados; isso é suficiente para restaurá-lo em todo o cluster.

  Em versões mais antigas do NDB Cluster, as tabelas cujos schemas foram restaurados usando esta opção usavam o mesmo número de partitions que tinham no cluster original, mesmo que tivesse um número diferente de nós de dados do novo cluster. No NDB 7.5.2 e posterior, ao restaurar o metadata, isso não é mais um problema; [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") agora usa o número default de partitions para o cluster de destino, a menos que o número de Local Data Manager Threads também seja alterado em relação ao que era para os nós de dados no cluster original.

  Nota

  O cluster deve ter um Database vazio ao iniciar a restauração de um backup. (Em outras palavras, você deve iniciar os nós de dados com [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) antes de realizar a restauração.)

* `--restore-privilege-tables`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") não restaura as tabelas de privilégios distribuídas do MySQL por default. Esta opção faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") restaure as tabelas de privilégios.

  Isso funciona apenas se as tabelas de privilégios foram convertidas para [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") antes que o backup fosse realizado. Para mais informações, veja [Seção 21.6.13, “Privilégios Distribuídos Usando Tabelas de Concessão Compartilhadas”](mysql-cluster-privilege-distribution.html "21.6.13 Distributed Privileges Using Shared Grant Tables").

* `--rewrite-database`=*`olddb,newdb`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Esta opção torna possível restaurar para um Database com um nome diferente do usado no backup. Por exemplo, se um backup for feito de um Database chamado `products`, você pode restaurar os dados que ele contém para um Database chamado `inventory`, use esta opção conforme mostrado aqui (omitindo quaisquer outras opções que possam ser necessárias):

  ```sql
  $> ndb_restore --rewrite-database=product,inventory
  ```

  A opção pode ser empregada várias vezes em uma única invocação de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"). Assim, é possível restaurar simultaneamente de um Database chamado `db1` para um Database chamado `db2` e de um Database chamado `db3` para um chamado `db4` usando `--rewrite-database=db1,db2 --rewrite-database=db3,db4`. Outras opções de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") podem ser usadas entre múltiplas ocorrências de `--rewrite-database`.

  Em caso de conflitos entre múltiplas opções `--rewrite-database`, a última opção `--rewrite-database` usada, lendo da esquerda para a direita, é a que entra em vigor. Por exemplo, se `--rewrite-database=db1,db2 --rewrite-database=db1,db3` for usado, apenas `--rewrite-database=db1,db3` será honrado, e `--rewrite-database=db1,db2` será ignorado. Também é possível restaurar de múltiplos Databases para um único Database, de modo que `--rewrite-database=db1,db3 --rewrite-database=db2,db3` restaure todas as tabelas e dados dos Databases `db1` e `db2` para o Database `db3`.

  Importante

  Ao restaurar de múltiplos Databases de backup para um único Database de destino usando `--rewrite-database`, nenhuma verificação é feita para colisões entre nomes de tabela ou outros objetos, e a ordem em que as linhas são restauradas não é garantida. Isso significa que é possível em tais casos que as linhas sejam sobrescritas e os Updates sejam perdidos.

* `--skip-broken-objects`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Esta opção faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") ignore tabelas corrompidas ao ler um backup [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") nativo, e continue restaurando quaisquer tabelas restantes (que não estejam também corrompidas). Atualmente, a opção `--skip-broken-objects` funciona apenas no caso de tabelas de partes BLOB ausentes.

* `--skip-table-check`, `-s`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  É possível restaurar dados sem restaurar o metadata da tabela. Por default, ao fazer isso, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") falha com um erro se for encontrada uma incompatibilidade entre os dados da tabela e o schema da tabela; esta opção anula esse comportamento.

  Algumas das restrições sobre incompatibilidades nas definições de coluna ao restaurar dados usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") são relaxadas; quando um destes tipos de incompatibilidades é encontrado, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") não para com um erro como fazia anteriormente, mas sim aceita os dados e os insere na tabela de destino, emitindo um aviso ao usuário de que isso está sendo feito. Este comportamento ocorre independentemente de qualquer uma das opções `--skip-table-check` ou [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes) estar em uso. Essas diferenças nas definições de coluna são dos seguintes tipos:

  + Configurações `COLUMN_FORMAT` diferentes (`FIXED`, `DYNAMIC`, `DEFAULT`)

  + Configurações `STORAGE` diferentes (`MEMORY`, `DISK`)

  + Valores default diferentes
  + Configurações de chave de distribuição diferentes
* `--skip-unknown-objects`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Esta opção faz com que [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") ignore quaisquer objetos de schema que não reconheça ao ler um backup [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") nativo. Isso pode ser usado para restaurar um backup feito de um cluster rodando (por exemplo) NDB 7.6 para um cluster rodando NDB Cluster 7.5.

* `--slice-id`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Ao restaurar por slices, este é o ID do slice a ser restaurado. Esta opção é sempre usada juntamente com [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices), e seu valor deve ser sempre menor que o de `--num-slices`.

  Para mais informações, veja a descrição de [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices) em outro lugar nesta seção.

* `--tab`=*`dir_name`*, `-T` *`dir_name`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Faz com que [`--print-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-data) crie dump files, um por tabela, cada um nomeado `tbl_name.txt`. Requer como argumento o caminho para o diretório onde os arquivos devem ser salvos; use `.` para o diretório atual.

* `--timestamp-printouts`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Faz com que as mensagens de log de info, error e debug sejam prefixadas com Timestamps.

  Esta opção é desabilitada por default no NDB 7.5 e NDB 7.6. Defina-a explicitamente como `true` para habilitar.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_help).

* `--verbose`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Define o nível de verbosidade da saída. O mínimo é 0; o máximo é 255. O valor default é 1.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

Opções típicas para este utilitário são mostradas aqui:

```sql
ndb_restore [-c connection_string] -n node_id -b backup_id \
      [-m] -r --backup-path=/path/to/backup/files
```

Normalmente, ao restaurar de um backup do NDB Cluster, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") requer no mínimo as opções [`--nodeid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid) (forma curta: `-n`), [`--backupid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid) (forma curta: `-b`) e [`--backup-path`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path). Além disso, quando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") é usado para restaurar quaisquer tabelas contendo Unique Indexes, você deve incluir [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes) ou [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes). (Bug
#57782, Bug #11764893)

A opção `-c` é usada para especificar uma connection string que informa ao `ndb_restore` onde localizar o cluster management server (veja [Seção 21.4.3.3, “Connection Strings do NDB Cluster”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings")). Se esta opção não for usada, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") tenta conectar-se a um management server em `localhost:1186`. Este utilitário atua como um Cluster API Node e, portanto, requer um "slot" de conexão livre para se conectar ao cluster management server. Isso significa que deve haver pelo menos uma seção `[api]` ou `[mysqld]` que possa ser usada por ele no arquivo `config.ini` do cluster. É uma boa ideia manter pelo menos uma seção `[api]` ou `[mysqld]` vazia em `config.ini` que não esteja sendo usada por um MySQL server ou outro aplicativo por este motivo (veja [Seção 21.4.3.7, “Definindo Nós SQL e Outros API Nodes em um NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster")).

Você pode verificar se [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") está conectado ao cluster usando o comando [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) no management client [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"). Você também pode realizar isso a partir de um shell do sistema, conforme mostrado aqui:

```sql
$> ndb_mgm -e "SHOW"
```

**Relatório de erros.** [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") relata erros temporários e permanentes. No caso de erros temporários, ele pode ser capaz de se recuperar, e relata `Restore successful, but encountered temporary error, please look at configuration` (Restauração bem-sucedida, mas encontrou erro temporário, por favor verifique a configuração) em tais casos.

Importante

Após usar [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") para inicializar um NDB Cluster para uso em Circular Replication, os Binary Logs no SQL node que atua como a replica não são criados automaticamente, e você deve fazê-los ser criados manualmente. Para fazer com que os Binary Logs sejam criados, emita uma instrução [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") nesse SQL node antes de executar [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"). Este é um problema conhecido no NDB Cluster.