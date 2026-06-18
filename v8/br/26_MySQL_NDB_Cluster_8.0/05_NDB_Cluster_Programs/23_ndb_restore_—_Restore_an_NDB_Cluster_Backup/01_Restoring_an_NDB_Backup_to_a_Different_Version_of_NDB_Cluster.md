#### 25.5.23.1 Restaurando um backup do NDB para uma versão diferente do cluster NDB

As duas seções a seguir fornecem informações sobre como restaurar um backup nativo do NDB para uma versão diferente do NDB Cluster, diferente da versão em que o backup foi feito.

Além disso, consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”, para outras questões que você possa encontrar ao tentar restaurar um backup do NDB para um cluster que esteja executando uma versão diferente do software NDB.

Também é aconselhável revisar o que há de novo no NDB Cluster 8.0, bem como a Seção 3.5, “Alterações no MySQL 8.0”, para outras mudanças entre o NDB 8.0 e as versões anteriores do NDB Cluster que possam ser relevantes para suas circunstâncias específicas.

##### 25.5.23.1.1 Restaurando um backup do NDB para uma versão anterior do NDB Cluster

Você pode encontrar problemas ao restaurar um backup feito de uma versão mais recente do NDB Cluster para uma versão anterior, devido ao uso de recursos que não existem na versão anterior. Alguns desses problemas estão listados aqui:

- **Conjunto de caracteres utf8mb4\_ai\_ci.** As tabelas criadas no NDB 8.0, por padrão, usam o conjunto de caracteres `utf8mb4_ai_ci`, que não está disponível no NDB 7.6 e versões anteriores, e, portanto, não podem ser lidas por um **ndb\_restore** binário de uma dessas versões anteriores. Nesses casos, é necessário alterar quaisquer tabelas usando `utf8mb4_ai_ci` para que elas usem um conjunto de caracteres suportado na versão mais antiga antes de realizar o backup.

- **Formato de metadados da tabela.** Devido às mudanças na forma como o MySQL Server e o NDB gerenciam os metadados das tabelas, as tabelas criadas ou alteradas usando o binário do servidor MySQL incluído no NDB 8.0 não podem ser restauradas usando **ndb\_restore** para o NDB 7.6 ou uma versão anterior do NDB Cluster. Essas tabelas usam arquivos `.sdi` que não são compreendidos pelas versões mais antigas do **mysqld**.

  Um backup feito no NDB 8.0 de tabelas criadas no NDB 7.6 ou versões anteriores e que não foram alteradas desde a atualização para o NDB 8.0, deve ser recuperável para versões mais antigas do NDB Cluster.

  Como é possível restaurar os metadados e os dados da tabela separadamente, você pode, nesses casos, restaurar os esquemas da tabela a partir de um dump feito usando o **mysqldump**, ou executando as instruções necessárias `CREATE TABLE` manualmente, e, em seguida, importar apenas os dados da tabela usando o **ndb\_restore** com a opção `--restore-data`.

- **Backup multisserializado.** Os backups multisserializados realizados no NDB 8.0 podem ser restaurados em um clúster que esteja executando uma versão anterior do `NDB` de duas das seguintes maneiras:

  - Usando um binário **ndb\_restore** do NDB 8.0, realize uma restauração paralela. Veja a Seção 25.5.23.3.1, “Restauração de backup paralelo em paralelo”.

  - Restaure os backups em série; neste caso, não é necessário uma versão mais recente do **ndb\_restore**. Consulte a Seção 25.5.23.3.2, “Restauração de um backup paralelo em série”.

- **Backup criptografado.** Os backups criptografados criados no NDB 8.0.22 e versões posteriores não podem ser restaurados usando **ndb\_restore** a partir do NDB 8.0.21 ou versões anteriores.

- **Privilégio NDB\_STORED\_USER.** O privilégio `NDB_STORED_USER` é suportado apenas no NDB 8.0.

- **Número máximo de nós de dados.** O NDB Cluster 8.0 suporta até 144 nós de dados, enquanto versões anteriores suportam um máximo de apenas 48 nós de dados. Consulte a Seção 25.5.23.2.1, “Restauração com menos nós do que o original”, para obter informações sobre situações em que essa incompatibilidade causa um problema.

##### 25.5.23.1.2 Restaurando um backup do NDB para uma versão posterior do NDB Cluster

Em geral, deve ser possível restaurar um backup criado usando o comando **ndb\_mgm** `START BACKUP` em uma versão mais antiga do NDB para uma versão mais recente, desde que você use o binário **ndb\_restore** que vem com a versão mais recente. (Pode ser possível usar a versão mais antiga do **ndb\_restore**, mas isso não é recomendado.) Problemas adicionais potenciais estão listados aqui:

- Ao restaurar os metadados de um backup (opção `--restore-meta`), o **ndb\_restore** normalmente tenta reproduzir o esquema da tabela capturado exatamente como estava quando o backup foi feito.

  As tabelas criadas em versões do NDB anteriores à 8.0 utilizam arquivos `.frm` para seus metadados. Esses arquivos podem ser lidos pelo **mysqld** no NDB 8.0, que pode usar as informações contidas neles para criar os arquivos `.sdi` usados pelo dicionário de dados do MySQL em versões posteriores.

- Ao restaurar um backup mais antigo para uma versão mais recente do NDB, pode não ser possível aproveitar recursos mais recentes, como a partição de hashmap, maior número de buckets de hashmap, backup de leitura e diferentes layouts de partição. Por essa razão, pode ser preferível restaurar esquemas mais antigos usando o **mysqldump** e o cliente **mysql**, o que permite que o NDB utilize os novos recursos do esquema.

- As tabelas que utilizam os antigos tipos temporais e não suportam segundos fracionários (usados antes do MySQL 5.6.4 e do NDB 7.3.31) não podem ser restauradas no NDB 8.0 usando o **ndb\_restore**. Você pode verificar essas tabelas usando `CHECK TABLE` e, se necessário, atualizá-las para o novo formato de coluna temporal usando `REPAIR TABLE` no cliente **mysql**. Isso deve ser feito antes de fazer o backup. Consulte a Seção 3.6, “Preparando sua instalação para atualização”, para obter mais informações.

  Você também pode restaurar essas tabelas usando um dump criado com o **mysqldump**.

- As tabelas de concessão distribuídas criadas no NDB 7.6 e versões anteriores não são suportadas no NDB 8.0. Essas tabelas podem ser restauradas em um cluster NDB 8.0, mas não têm efeito no controle de acesso.
