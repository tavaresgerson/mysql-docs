### 25.3.7 Atualização e Downgrade do NDB Cluster

- Versões suportadas para atualização para NDB 8.0
- Reverter uma atualização do NDB Cluster 8.0
- Problemas conhecidos ao atualizar ou desatualizar um cluster NDB

Esta seção fornece informações sobre o software NDB Cluster e a compatibilidade entre diferentes versões do NDB Cluster 8.0 em relação à realização de atualizações e reduções. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar uma atualização ou redução. Consulte a Seção 25.4, “Configuração do NDB Cluster”.

Importante

As atualizações e desatualizações online entre versões menores do motor de armazenamento `NDB` são suportadas no NDB 8.0. As atualizações localizadas do MySQL Server incluído (nó SQL **mysqld**) também são suportadas; com múltiplos nós SQL, é possível manter uma aplicação SQL online enquanto os processos individuais **mysqld** são reiniciados. As desatualizações locais do MySQL Server incluído *não* são suportadas (consulte o Capítulo 4, *Desatualizando o MySQL*).

Em alguns casos, pode ser possível reverter uma atualização recente de uma versão menor da NDB 8.0 para uma versão mais recente e restaurar os estados necessários de quaisquer instâncias do MySQL Server que estejam funcionando como nós SQL. Se isso se tornar desejável ou necessário, é altamente recomendável que você faça um backup completo de cada nó SQL antes de atualizar o NDB Cluster. Por esse mesmo motivo, você também deve iniciar os binários do **mysqld** da nova versão com `--ndb-schema-dist-upgrade-allowed=0` e não permitir que ele seja definido novamente para 1 até que você esteja certo de que não há mais possibilidade de retornar a uma versão anterior. Para obter mais informações, consulte Reverter uma Atualização do NDB Cluster 8.0.

Para obter informações sobre as atualizações do NDB 8.0 a partir de versões anteriores ao 8.0, consulte Versões suportadas para atualização para o NDB 8.0.

Para obter informações sobre problemas conhecidos e problemas encontrados ao atualizar ou desatualizar o NDB 8.0, consulte Problemas Conhecidos ao Atualizar ou Desatualizar o NDB Cluster.

#### Versões suportadas para atualização para NDB 8.0

As seguintes versões do NDB Cluster são suportadas para atualizações para versões GA do NDB Cluster 8.0 (8.0.19 e versões posteriores):

- NDB Cluster 7.6: NDB 7.6.4 e versões posteriores
- NDB Cluster 7.5: NDB 7.5.4 e versões posteriores
- NDB Cluster 7.4: NDB 7.4.6 e versões posteriores

Para fazer a atualização a partir de uma versão anterior à NDB 7.4, você deve fazer a atualização em etapas, primeiro para uma das versões listadas acima e, em seguida, dessa versão para a versão mais recente da NDB 8.0. Nesse caso, é recomendado que você comece com a atualização para a versão mais recente da NDB 7.6. Para obter informações sobre as atualizações para a NDB 7.6 a partir de versões anteriores, consulte Atualizando e Desatualizando a NDB 7.6.

#### Reverter uma atualização do NDB Cluster 8.0

Após uma atualização recente de software de um NDB Cluster para uma versão do NDB 8.0, é possível reverter o software `NDB` para a versão anterior, desde que certas condições sejam atendidas antes da atualização, durante o tempo em que o cluster estiver executando a versão mais recente e após o software do NDB Cluster ser revertido para a versão anterior. Os detalhes dependem das condições locais; esta seção fornece informações gerais sobre o que deve ser feito em cada um dos pontos do processo de atualização e rollback descrito anteriormente.

Na maioria dos casos, a atualização e a desatualização dos nós de dados podem ser feitas sem problemas, conforme descrito em outro lugar; consulte a Seção 25.6.5, “Realizando um Reinício Rotativo de um NDB Cluster”. (Antes de realizar uma atualização ou desatualização, você deve realizar um backup `NDB`; consulte a Seção 25.6.8, “Backup Online de um NDB Cluster”, para obter informações sobre como fazer isso.) A desatualização de nós SQL online não é suportada, devido aos seguintes problemas:

- O **mysqld** a partir de uma versão 8.0 não pode ser iniciado se detectar um sistema de arquivos de uma versão mais recente do MySQL.

- Em muitos casos, o **mysqld** não consegue abrir tabelas criadas ou modificadas por uma versão mais recente do MySQL.

- Na maioria, se não em todos os casos, o **mysqld** não consegue ler arquivos de log binários que foram criados ou modificados em uma versão mais recente do MySQL.

O procedimento descrito a seguir fornece as etapas básicas necessárias para atualizar um clúster da versão `X` para a versão `Y` enquanto permite um possível retorno futuro para `X`. (O procedimento para reverter o clúster atualizado para a versão `X` segue mais adiante nesta seção.) Para esse propósito, a versão `X` é qualquer versão GA do NDB 8.0, ou qualquer versão anterior do NDB suportada para atualização para o NDB 8.0 (veja Versões Suportadas para Atualização para NDB 8.0), e a versão `Y` é uma versão do NDB 8.0 que é posterior a `X`.

- *Antes da atualização*: Faça backups dos estados dos nós SQL NDB `X`. Isso pode ser feito de uma ou mais das seguintes maneiras:

  - Uma cópia do sistema de arquivos do nó SQL `X` em estado de repouso, usando uma ou mais ferramentas do sistema, como **cp**, **rsync**, **fwbackups**, Amanda, e assim por diante.

    Um dump de quaisquer tabelas da versão `X` que não estejam armazenadas em `NDB`. Você pode gerar esse dump usando **mysqldump**.

    Um backup criado usando o MySQL Enterprise Backup; consulte a Seção 32.1, “MySQL Enterprise Backup Overview”, para obter mais informações.

  Recomenda-se fazer backup dos nós SQL antes de qualquer atualização, independentemente de você pretender ou não reverter o clúster para a versão anterior da `NDB`.

- \*Atualize para NDB \*`Y`\*\*: Todos os binários do `Y` **mysqld** do NDB devem ser iniciados com `--ndb-schema-dist-upgrade-allowed=0` para evitar qualquer atualização automática do esquema. (Uma vez que qualquer possibilidade de downgrade tenha passado, você pode alterar com segurança a variável de sistema correspondente `ndb_schema_dist_upgrade_allowed` de volta para 1, o padrão, no cliente **mysql**.) Quando cada nó SQL do NDB `Y` começa, ele se conecta ao cluster e sincroniza seus esquemas de tabelas `NDB`. Após isso, você pode restaurar os dados de tabelas e estado do MySQL a partir de backup.

  Para garantir a continuidade da replicação do NDB, é necessário atualizar os nós SQL do cluster de tal forma que, em qualquer momento durante a atualização, pelo menos um **mysqld** esteja atuando como fonte de replicação. Com dois nós SQL `A` e `B`, você pode fazer isso da seguinte maneira:

  1. Ao usar o nó SQL `B` como o canal de replicação, atualize o nó SQL `A` da versão NDB `X` para a versão `Y`. Isso resulta em uma lacuna no log binário em `A` na época `E1`.

  2. Após todos os aplicativos de replicação consumirem o log binário do nó SQL `B` após a época `E1`, mude o canal de replicação para usar o nó SQL `A`.

  3. Atualize o nó SQL `B` para a versão NDB `Y`. Isso resulta em uma lacuna no log binário em `B` na época `E2`.

  4. Depois que todos os aplicativos de replicação consumirem o log binário do nó SQL `A` após a época `E2`, você pode, novamente, alternar o canal de replicação para usar qualquer um dos nós SQL conforme desejar.

  Não use `ALTER TABLE` em nenhuma tabela existente `NDB`; não crie nenhuma nova tabela `NDB` que não possa ser removida com segurança antes da desativação.

O procedimento a seguir mostra os passos básicos necessários para reverter (reverter) um NDB Cluster da versão `X` para a versão `Y` após uma atualização realizada como descrita acima. Aqui, a versão `X` é qualquer versão GA do NDB 8.0, ou qualquer versão anterior do NDB suportada para atualização para o NDB 8.0 (veja Versões Suportadas para Atualização para NDB 8.0); a versão `Y` é uma versão do NDB 8.0 que é posterior a `X`.

- *Antes do rollback*: Reúna todas as informações de estado do **mysqld** dos nós SQL NDB `Y` que devem ser mantidas. Na maioria dos casos, você pode fazer isso usando **mysqldump**.

  Após fazer o backup dos dados do estado, elimine todas as tabelas `NDB` que foram criadas ou alteradas desde que a atualização ocorreu.

  Fazer backup dos nós SQL é sempre recomendado antes de qualquer mudança na versão do software do NDB Cluster.

  Você deve fornecer um sistema de arquivos compatível com o MySQL `X` para cada **mysqld** (nó SQL). Você pode usar um dos dois métodos a seguir:

  - Crie um novo estado de sistema de arquivos compatível reiniciando o estado no disco do nó SQL da versão `X`. Você pode fazer isso removendo o sistema de arquivos do nó SQL, depois executando o **mysqld** `--initialize`.

  - Restaure um sistema de arquivos compatível a partir de um backup feito antes da atualização (consulte a Seção 9.4, “Usando mysqldump para backups”).

- *Após a degradação do `NDB`*: Após a degradação dos nós de dados para NDB `X`, inicie os nós de SQL da versão `X` (instâncias do **mysqld**). Restaure ou repare qualquer outra informação de estado local necessária em cada nó SQL. O estado MySQLD pode ser alinhado conforme necessário com algumas combinações (0 ou mais) das seguintes ações:

  - Os comandos de inicialização, como **mysqld** `--initialize`.

  - Restaure as informações de estado desejadas ou necessárias capturadas a partir do nó SQL da versão `X`.

  - Restaure as informações de estado desejadas ou necessárias capturadas a partir do nó SQL da versão `Y`.

  - Realize a limpeza, como a exclusão de logs desatualizados, como logs binários, ou logs de retransmissão, e remova qualquer estado dependente do tempo que não seja mais válido.

  Assim como ao atualizar, é necessário, ao fazer uma atualização para uma versão anterior, manter a continuidade da replicação do NDB, para isso, é necessário desativar os nós SQL do cluster de tal forma que, em algum momento durante o processo de atualização, pelo menos um **mysqld** esteja atuando como fonte de replicação. Isso pode ser feito de uma maneira muito semelhante à descrita anteriormente para a atualização dos nós SQL. Com dois nós SQL `A` e `B`, você pode manter o registro binário sem lacunas durante a atualização da seguinte forma:

  1. Com o nó SQL `B` atuando como o canal de replicação, desça o nó SQL `A` da versão NDB `Y` para a versão `X`. Isso resulta em uma lacuna no log binário em `A` na época `F1`.

  2. Após todos os aplicativos de replicação consumirem o log binário do nó SQL `B` após a época `F1`, mude o canal de replicação para usar o nó SQL `A`.

  3. Desgradeie o nó SQL `B` para a versão NDB `X`. Isso resulta em uma lacuna no log binário em `B` na época `F2`.

  4. Após todos os aplicativos de replicação consumirem o log binário do nó SQL `A` após a época `F2`, a redundância do registro binário é restaurada e você pode usar novamente qualquer um dos nós SQL como o canal de replicação conforme desejar.

  Veja também a Seção 25.7.7, “Usando dois canais de replicação para replicação de NDB Cluster”.

#### Problemas conhecidos ao atualizar ou desatualizar um cluster NDB

Nesta seção, forneça informações sobre os problemas conhecidos que ocorrem ao atualizar ou desatualizar para, a partir de ou entre as versões do NDB 8.0.

Recomendamos que você não tente fazer alterações no esquema durante qualquer atualização ou downgrade do software do NDB Cluster. Algumas das razões para isso estão listadas aqui:

- As declarações DDL nas tabelas `NDB` não são possíveis durante algumas fases do início do nó de dados.

- As declarações DDL nas tabelas `NDB` podem ser rejeitadas se algum nó de dados for parado durante a execução; é necessário parar o binário de cada nó de dados (para que possa ser substituído por um binário da versão de destino) como parte do processo de atualização ou downgrade.

- As declarações DDL nas tabelas `NDB` não são permitidas enquanto houver nós de dados no mesmo clúster executando diferentes versões de lançamento do software NDB Cluster.

Para obter informações adicionais sobre o procedimento de reinício em rotação usado para realizar uma atualização ou uma redução online dos nós de dados, consulte a Seção 25.6.5, “Realizando um Reinício em Rotação de um NDB Cluster”.

Você deve estar ciente dos problemas na lista a seguir ao realizar uma atualização online entre versões menores do NDB 8.0. Esses problemas também se aplicam ao fazer a atualização de uma versão anterior do NDB Cluster para qualquer uma das versões do NDB 8.0 mencionadas.

- A versão 8.0.22 do NDB adiciona suporte para endereçamento IPv6 para nós de gerenciamento e nós de dados no arquivo `config.ini`. Para começar a usar endereços IPv6 como parte de uma atualização, siga os passos abaixo:

  1. Realize uma atualização do clúster para a versão 8.0.22 ou uma versão posterior do software NDB Cluster da maneira usual.

  2. Altere os endereços usados no arquivo `config.ini` para endereços IPv6.

  3. Realize um reinício do sistema do clúster.

  Um problema conhecido nas plataformas Linux ao executar o NDB 8.0.22 e versões posteriores era que o kernel do sistema operacional precisava fornecer suporte ao IPv6, mesmo quando nenhum endereço IPv6 estava em uso. Esse problema foi corrigido no NDB 8.0.34 e versões posteriores (Bug #33324817, Bug #33870642).

  Se você estiver usando uma versão afetada e deseja desativar o suporte ao IPv6 no sistema (porque você não planeja usar nenhuma endereço IPv6 para os nós do NDB Cluster), faça isso após inicializar o sistema, da seguinte forma:

  ```
  $> sysctl -w net.ipv6.conf.all.disable_ipv6=1
  $> sysctl -w net.ipv6.conf.default.disable_ipv6=1
  ```

  (Alternativamente, você pode adicionar as linhas correspondentes ao `/etc/sysctl.conf`.) No NDB Cluster 8.0.34 e versões posteriores, o que precede não é necessário, e você pode simplesmente desabilitar o suporte ao IPv6 no kernel Linux se não quiser ou precisar.

- Devido às alterações na tabela interna `mysql.ndb_schema`, se você atualizar para uma versão do NDB 8.0 anterior a 8.0.24, é recomendável usar `--ndb-schema-dist-upgrade-allowed = 0` para evitar interrupções inesperadas (Bug #30876990, Bug #31016905).

  Além disso, se houver alguma possibilidade de você voltar para uma versão anterior do NDB Cluster após uma atualização para uma versão mais recente, você deve iniciar todos os processos do **mysqld** a partir da versão mais recente com `--ndb-schema-dist-upgrade-allowed = 0` para evitar que alterações incompatíveis com a versão mais antiga sejam feitas na tabela `ndb_schema`. Consulte Reverter uma Atualização do NDB Cluster 8.0 para obter informações sobre como fazer isso.

- O parâmetro de configuração `EncryptedFileSystem`, introduzido no NDB 8.0.29, em alguns casos, poderia fazer com que os arquivos de log de desfazer fossem criptografados, mesmo quando configurados explicitamente para `0`, o que poderia levar a problemas ao usar tabelas de Dados de Disco e tentar fazer uma atualização ou uma redução para o NDB 8.0.29. Nesses casos, você pode contornar o problema realizando reinicializações iniciais dos nós de dados como parte do processo de reinicialização contínua.

- Se você estiver usando nós de dados multithread (\*\*ndbmtd")) e o parâmetro de configuração `ThreadConfig`, você pode precisar fazer alterações no valor definido para isso no arquivo `config.ini` ao fazer a atualização de uma versão anterior para o NDB 8.0.30 ou posterior. Ao fazer a atualização do NDB 8.0.23 ou anterior, qualquer uso de threads `main`, `rep`, `recv` ou `ldm` que estava implícito na versão anterior deve ser definido explicitamente. Ao fazer a atualização do NDB 8.0.23 ou posterior para o NDB 8.0.30 ou posterior, qualquer uso de threads `recv` deve ser definido explicitamente na string `ThreadConfig`. Além disso, para evitar o uso de threads `main`, `rep` ou `ldm` no NDB 8.0.30 ou posterior, você deve definir explicitamente o número de threads para o tipo dado em `0`.

  Segue um exemplo.

  *NDB 8.0.22 e versões anteriores*:

  - O arquivo `config.ini` contém `ThreadConfig=ldm`.

  - Essas versões do `NDB` são interpretadas como `ThreadConfig=main,ldm,recv,rep`.

  - Requerido em `config.ini` para corresponder ao efeito no NDB 8.0.30 ou posterior: `ThreadConfig=main,ldm,recv,rep`.

  *NDB 8.0.23—8.0.29*:

  - O arquivo `config.ini` contém `ThreadConfig=ldm`.

  - Essas versões do `NDB` são interpretadas como `ThreadConfig=ldm,recv`.

  - Requerido em `config.ini` para corresponder ao efeito no NDB 8.0.30 ou posterior: `ThreadConfig=main={count=0},ldm,recv,rep={count=0}`.

  Para mais informações, consulte a descrição do parâmetro de configuração `ThreadConfig`.

As atualizações das versões principais anteriores do NDB Cluster (7.4, 7.5, 7.6) para o NDB 8.0 são suportadas; consulte Versões Suportadas para Atualização para NDB 8.0, para versões específicas. Tais atualizações estão sujeitas aos problemas listados aqui:

- No NDB 8.0, o valor padrão para `log_bin` é 1, uma mudança em relação às versões anteriores. Além disso, a partir do NDB 8.0.16, o valor padrão para `ndb_log_bin` mudou de 1 para 0, o que significa que `ndb_log_bin` deve ser definido explicitamente para 1 para habilitar o registro binário nesta e em versões posteriores.

- Os privilégios distribuídos compartilhados entre os servidores MySQL, conforme implementados nas séries de lançamentos anteriores (veja Privilegios Distribuídos Usando Tabelas de Concessão Compartilhadas), não são suportados no NDB Cluster 8.0. Ao serem iniciados, o **mysqld** fornecido com o NDB 8.0 e versões posteriores verifica a existência de quaisquer tabelas de concessão que utilizem o mecanismo de armazenamento `NDB`; se encontrar alguma, cria cópias locais (“tabelas sombra”) dessas usando `InnoDB`. Isso é verdade para cada servidor MySQL conectado ao NDB Cluster. Após isso ter sido realizado em todos os servidores MySQL que atuam como nós SQL do NDB Cluster, as tabelas de concessão `NDB` podem ser removidas com segurança usando o utilitário **ndb\_drop\_table** fornecido com a distribuição do NDB Cluster, da seguinte forma:

  ```
  ndb_drop_table -d mysql user db columns_priv tables_priv proxies_priv procs_priv
  ```

  É seguro manter as tabelas de concessão `NDB`, mas elas não são usadas para controle de acesso e são efetivamente ignoradas.

  Para obter mais informações sobre o sistema de privilégios do MySQL utilizado no NDB 8.0, consulte a Seção 25.6.13, “Sincronização de privilégios e NDB\_STORED\_USER”, bem como a Seção 8.2.3, “Tabelas de concessão”.

- É necessário reiniciar todos os nós de dados com `--initial` ao atualizar qualquer versão anterior à NDB 7.6 para qualquer versão NDB 8.0. Isso ocorre devido à adição do suporte para um número maior de nós no NDB 8.0.

Os problemas encontrados ao tentar fazer uma atualização para uma versão anterior da NDB 8.0 podem ser encontrados na seguinte lista:

- As tabelas criadas no NDB 8.0 não são compatíveis com versões anteriores do NDB 7.6 devido a uma mudança no uso da propriedade de metadados extras implementada pelas tabelas `NDB` para fornecer suporte completo ao dicionário de dados do MySQL. Isso significa que é necessário tomar medidas adicionais para preservar qualquer informação de estado desejada dos nós SQL do cluster antes da desativação e, em seguida, restaurá-la posteriormente.

  Mais especificamente, as atualizações online do motor de armazenamento `NDBCLUSTER`—ou seja, dos nós de dados—são suportadas, mas os nós SQL não podem ser atualizados online. Isso ocorre porque um servidor MySQL (**mysqld**) de uma versão MySQL 8.0 ou anterior não pode usar arquivos de sistema de uma versão 8.0 (mais recente) e não pode abrir tabelas criadas na versão mais recente. É possível reverter um clúster que foi recentemente atualizado a partir de uma versão anterior do NDB; consulte Reverter uma Atualização de NDB Cluster 8.0 para obter informações sobre quando e como isso pode ser feito.

  Para obter informações adicionais sobre essas questões, consulte Mudanças no metadados extras da tabela NDB; consulte também o Capítulo 16, *Dicionário de Dados MySQL*.

- No NDB 8.0, o formato de arquivo de configuração binário foi aprimorado para oferecer suporte a um maior número de nós do que nas versões anteriores. O novo formato não é acessível aos nós que executam versões mais antigas do `NDB`, embora os novos servidores de gerenciamento possam detectar nós mais antigos e comunicá-los usando o formato apropriado.

  Embora as atualizações para o NDB 8.0 não devam ser problemáticas nesse sentido, os servidores de gerenciamento mais antigos não podem ler o novo formato de arquivo de configuração binária, portanto, é necessária alguma intervenção manual ao fazer a desinstalação do NDB 8.0 para uma versão anterior da versão principal. Ao realizar essa desinstalação, é necessário remover quaisquer arquivos de configuração binária cacheados antes de iniciar o gerenciamento usando a versão mais antiga do software `NDB`, e ter o arquivo de configuração em texto claro disponível para o servidor de gerenciamento ler. Alternativamente, você pode iniciar o servidor de gerenciamento mais antigo usando a opção `--initial` (novamente, é necessário ter o `config.ini` disponível). Se o clúster usar vários servidores de gerenciamento, uma dessas duas coisas deve ser feita para cada arquivo binário do servidor de gerenciamento.

  Além disso, em relação ao suporte para um maior número de nós, e devido às alterações incompatíveis implementadas no NDB 8.0 no nó de dados LCP `Sysfile`, é necessário, ao realizar uma atualização online do NDB 8.0 para uma versão anterior, reiniciar todos os nós de dados usando a opção `--initial`.

- As atualizações online de clústeres que executam mais de 48 nós de dados ou com nós de dados usando IDs de nó maiores que 48 para versões anteriores do NDB Cluster a partir do NDB 8.0 não são suportadas. Nesses casos, é necessário reduzir o número de nós de dados, alterar as configurações de todos os nós de dados para que eles usem IDs de nó menores ou iguais a 48, ou ambos, conforme necessário para não exceder os antigos máximos.

- Se você estiver desativando o NDB 8.0 para o NDB 7.5 ou NDB 7.4, você deve definir um valor explícito para `IndexMemory` no arquivo de configuração do cluster, se ainda não estiver presente. Isso ocorre porque o NDB 8.0 não usa esse parâmetro (que foi removido no NDB 7.6) e o define como 0 por padrão, enquanto é necessário no NDB 7.5 e NDB 7.4, nos quais o cluster se recusa a iniciar com configuração inválida recebida do servidor de gerenciamento... se `IndexMemory` não estiver definido para um valor não nulo.

  A definição de `IndexMemory` *não é* necessária para as reduções de NDB 8.0 para NDB 7.6.
