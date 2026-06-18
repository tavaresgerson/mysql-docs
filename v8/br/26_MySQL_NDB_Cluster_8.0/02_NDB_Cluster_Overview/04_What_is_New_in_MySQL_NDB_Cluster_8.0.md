### 25.2.4 O que há de novo no MySQL NDB Cluster 8.0

As seções a seguir descrevem as mudanças na implementação do MySQL NDB Cluster no NDB Cluster 8.0 até 8.0.44, em comparação com as séries de lançamentos anteriores.

O NDB Cluster 8.4 também está disponível para produção; enquanto o NDB 8.0 ainda é suportado, sugerimos que você use o NDB 8.4 para novas implantações; para mais informações, consulte MySQL NDB Cluster 8.4. O NDB Cluster 9.3 está disponível como uma versão de desenvolvimento para visualização e teste de novos recursos atualmente em desenvolvimento; consulte O que há de novo no NDB Cluster 9.4.

O NDB Cluster 7.6 (veja o que há de novo no NDB Cluster 7.6) é uma versão GA anterior que ainda é suportada em produção, embora recomende-se que novas implantações para uso em produção do MySQL NDB Cluster 8.4 sejam feitas. O NDB Cluster 7.5, 7.4 e 7.3 foram versões GA anteriores que chegaram ao fim de sua vida útil e não são mais suportadas ou mantidas. Recomendamos que novas implantações para uso em produção do MySQL NDB Cluster 8.4 sejam feitas.

#### O que há de novo no NDB Cluster 8.0

As principais mudanças e novas funcionalidades do NDB Cluster 8.0 que provavelmente serão de interesse estão listadas a seguir:

- **Melhorias de compatibilidade.** As seguintes mudanças reduzem as diferenças não essenciais de longa data no comportamento do `NDB` em comparação com outros motores de armazenamento do MySQL:

  - **Desenvolvimento paralelo com o servidor MySQL.** A partir desta versão, o MySQL NDB Cluster está sendo desenvolvido em paralelo com o servidor padrão MySQL 8.0, sob um novo modelo de lançamento unificado, com as seguintes características:

    - O NDB 8.0 é desenvolvido a partir da árvore de código-fonte do MySQL 8.0 e é lançado com ela.

    - O esquema de numeração para as versões do NDB Cluster 8.0 segue o esquema do MySQL 8.0.

    - Ao construir a fonte com o aplicativo de suporte `NDB`, o `-cluster` é anexado à string de versão retornada pelo **mysql** `-V`, conforme mostrado aqui:

      ```
      $> mysql -V
      mysql  Ver 8.0.44-cluster for Linux on x86_64 (Source distribution)
      ```

      Os binários `NDB` continuam a exibir tanto a versão do MySQL Server quanto a versão do motor `NDB`, da seguinte forma:

      ```
      $> ndb_mgm -V
      MySQL distrib mysql-8.0.44 ndb-8.0.44, for Linux (x86_64)
      ```

      No MySQL Cluster NDB 8.0, esses dois números de versão são sempre os mesmos.

    Para construir o código-fonte do MySQL com suporte ao NDB Cluster, use a opção CMake `-DWITH_NDB` (NDB 8.0.31 e versões posteriores; para versões anteriores, use `-DWITH_NDBCLUSTER`).

  - **Notas de suporte à plataforma.** O NDB 8.0 traz as seguintes mudanças no suporte à plataforma:

    - `NDBCLUSTER` não suporta mais plataformas de 32 bits. A partir do NDB 8.0.21, o processo de construção do NDB verifica a arquitetura do sistema e interrompe se não for uma plataforma de 64 bits.

    - Agora é possível construir `NDB` a partir da fonte para CPUs `ARM` de 64 bits. Atualmente, esse suporte é apenas para a fonte e não fornecemos binários pré-compilados para essa plataforma.

  - **Nomes de bancos de dados e tabelas.** O NDB 8.0 remove o limite anterior de 63 bytes para identificadores de bancos de dados e tabelas. Esses identificadores agora podem usar até 64 bytes, assim como outros motores de armazenamento do MySQL. Veja a Seção 25.2.7.11, “Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0”.

  - **Nomes gerados para chaves estrangeiras.** `NDB` agora usa o padrão `tbl_name_fk_N` para nomear chaves estrangeiras geradas internamente. Isso é semelhante ao padrão usado por `InnoDB`.

- **Distribuição e sincronização de esquema e metadados.** O NDB 8.0 utiliza o dicionário de dados MySQL para distribuir informações de esquema para os nós SQL que se juntam a um clúster e para sincronizar novas alterações de esquema entre os nós SQL existentes. A lista a seguir descreve melhorias individuais relacionadas a este trabalho de integração:

  - Melhorias na distribuição de esquemas. O coordenador de distribuição de esquemas `NDB`, que gerencia operações de esquema e acompanha seu progresso, foi estendido no NDB 8.0 para garantir que os recursos usados durante uma operação de esquema sejam liberados ao final. Anteriormente, parte desse trabalho era feita pelo cliente de distribuição de esquema; isso foi alterado devido ao fato de que o cliente nem sempre tinha todas as informações de estado necessárias, o que poderia levar a vazamentos de recursos quando o cliente decidiu abandonar a operação de esquema antes do término e sem informar o coordenador.

    Para ajudar a corrigir esse problema, a detecção do tempo limite de operação do esquema foi movida do cliente de distribuição do esquema para o coordenador, proporcionando ao coordenador a oportunidade de limpar quaisquer recursos usados durante a operação do esquema. O coordenador agora verifica as operações de esquema em andamento em intervalos regulares e marca os participantes que ainda não completaram uma determinada operação do esquema como falhas ao detectar o tempo limite. Também fornece avisos adequados sempre que ocorre um tempo limite de operação do esquema. (Cabe notar que, após a detecção de tal tempo limite, a própria operação do esquema continua.) O relatório adicional é feito imprimindo uma lista de operações de esquema ativas em intervalos regulares sempre que uma ou mais dessas operações estiverem em andamento.

    Como parte adicional deste trabalho, uma nova opção do **mysqld** `--ndb-schema-dist-timeout` permite definir o tempo de espera até que uma operação de esquema seja marcada como tendo falhado.

  - **Distribuição de arquivos de dados do disco.** O NDB Cluster 8.0.14 utiliza o dicionário de dados do MySQL para garantir que os arquivos de dados do disco e construções relacionadas, como espaços de tabelas e grupos de arquivos de log, sejam distribuídos corretamente entre todos os nós SQL conectados.

  - **Sincronização de esquemas de objetos de espaço de tabela.** Quando um servidor MySQL se conecta como um nó SQL a um cluster NDB, ele verifica seu dicionário de dados contra as informações encontradas no dicionário `NDB`.

    Anteriormente, os únicos objetos `NDB` sincronizados na conexão de um novo nó SQL eram bancos de dados e tabelas; o MySQL NDB Cluster 8.0 também implementa a sincronização de esquema de objetos de dados de disco, incluindo espaços de tabelas e grupos de arquivos de log. Entre outros benefícios, isso elimina a possibilidade de uma discrepância entre o dicionário de dados do MySQL e o dicionário `NDB` após um backup e restauração nativas, na qual os espaços de tabelas e grupos de arquivos de log foram restaurados ao dicionário `NDB`, mas não ao dicionário de dados do MySQL Server.

    Também não é mais possível emitir uma declaração `CREATE TABLE` que se refere a um espaço de tabela inexistente. Tal declaração agora falha com um erro.

  - Melhorias na sincronização do DDL do banco de dados. O trabalho realizado para o NDB 8.0 garante que a sincronização dos bancos de dados por nós SQL recém-adicionados (ou reintegrados) com os de nós SQL existentes agora faça uso adequado do dicionário de dados, de modo que quaisquer operações de nível de banco de dados (`CREATE DATABASE`, `ALTER DATABASE` ou `DROP DATABASE`) que possam ter sido ignoradas por este nó SQL agora sejam duplicadas corretamente quando ele se conecta (ou reconecta) ao clúster.

    Como parte do procedimento de sincronização do esquema realizado ao iniciar, um nó SQL agora compara todos os bancos de dados nos nós de dados do clúster com os de seu próprio dicionário de dados, e se algum deles for encontrado ausente do dicionário de dados do nó SQL, o Nó SQL o instala localmente, executando uma instrução `CREATE DATABASE`. Um banco de dados assim criado usa as propriedades padrão do banco de dados do Servidor MySQL (como as determinadas por `character_set_database` e `collation_database`) que estão em vigor neste nó SQL no momento em que a instrução é executada.

  - **Detecção e sincronização de alterações de metadados do NDB.** O NDB 8.0 implementa um novo mecanismo para a detecção de atualizações de metadados para objetos de dados, como tabelas, espaços de tabela e grupos de arquivos de log, com o dicionário de dados do MySQL. Isso é feito usando um fio, o fio de monitoramento de alterações de metadados `NDB`, que funciona em segundo plano e verifica periodicamente por inconsistências entre o dicionário `NDB` e o dicionário de dados do MySQL.

    O monitor realiza verificações de metadados a cada 60 segundos por padrão. O intervalo de verificação pode ser ajustado definindo o valor da variável de sistema `ndb_metadata_check_interval`. A verificação pode ser desativada completamente definindo a variável de sistema `ndb_metadata_check` para `OFF`. A variável de status `Ndb_metadata_detected_count` mostra o número de vezes desde que o **mysqld** foi iniciado pela última vez que inconsistências foram detectadas.

    `NDB` garante que os objetos do banco de dados `NDB`, tabela, grupo de arquivos de log e tablespace enviados pelo fio de monitoramento de alterações de metadados durante operações após a inicialização sejam automaticamente verificados quanto a desvios e sincronizados pelo fio de binlog `NDB`.

    O NDB 8.0 adiciona duas variáveis de status relacionadas à sincronização automática: `Ndb_metadata_synced_count` mostra o número de objetos sincronizados automaticamente; `Ndb_metadata_excluded_count` indica o número de objetos para os quais a sincronização falhou (antes do NDB 8.0.22, essa variável era chamada de `Ndb_metadata_blacklist_size`). Além disso, você pode ver quais objetos foram sincronizados, inspecionando o log do cluster.

    Definir a variável de sistema `ndb_metadata_sync` para `true` substitui quaisquer configurações feitas para `ndb_metadata_check_interval` e `ndb_metadata_check`, fazendo com que o thread de monitoramento de mudanças comece a detectar mudanças contínuas de metadados.

    No NDB 8.0.22 e versões posteriores, definir `ndb_metadata_sync` para `true` limpa a lista de objetos para os quais a sincronização falhou anteriormente, o que significa que não é mais necessário descobrir tabelas individuais ou reativar a sincronização reconectando o nó SQL ao clúster. Além disso, definir essa variável para `false` limpa a lista de objetos que estão aguardando para serem reexecutados.

    A partir da versão 8.0.21 do NDB, informações mais detalhadas sobre o estado atual da sincronização automática, além das que podem ser obtidas a partir de mensagens de log ou variáveis de status, são fornecidas por duas novas tabelas adicionadas ao Schema de Desempenho do MySQL. As tabelas estão listadas aqui:

    - `ndb_sync_pending_objects`: Contém informações sobre objetos de banco de dados para os quais foram detectados desvios entre o dicionário `NDB` e o dicionário de dados do MySQL (e que não foram excluídos da sincronização automática).

    - `ndb_sync_excluded_objects`: Contém informações sobre os objetos de banco de dados `NDB` que foram excluídos porque não podem ser sincronizados entre o dicionário `NDB` e o dicionário de dados MySQL, e, portanto, requerem intervenção manual.

    Uma linha em uma dessas tabelas fornece o esquema, o nome e o tipo do objeto do banco de dados. Os tipos de objetos incluem esquemas, espaços de armazenamento de tabelas, grupos de arquivos de log e tabelas. (Se o objeto for um grupo de arquivos de log ou espaço de armazenamento de tabelas, o esquema pai é `NULL`.) Além disso, a tabela `ndb_sync_excluded_objects` mostra a razão pela qual o objeto foi excluído.

    Essas tabelas estão presentes apenas se o suporte ao mecanismo de armazenamento `NDBCLUSTER` estiver habilitado. Para obter mais informações sobre essas tabelas, consulte a Seção 29.12.12, “Tabelas do NDB Cluster do Schema de Desempenho”.

  - **Alterações no metadados extras da tabela NDB.** A propriedade de metadados extras de uma tabela `NDB` é usada para armazenar metadados serializados do dicionário de dados do MySQL, em vez de armazenar a representação binária da tabela, como nas versões anteriores. (Este era um arquivo `.frm`, que não é mais usado pelo MySQL Server — consulte o Capítulo 16, *Dicionário de Dados MySQL*.) Como parte do trabalho para suportar essa mudança, o tamanho disponível dos metadados extras da tabela foi aumentado. Isso significa que as tabelas `NDB` criadas no NDB Cluster 8.0 não são compatíveis com as versões anteriores do NDB Cluster. As tabelas criadas em versões anteriores podem ser usadas com o NDB 8.0, mas não podem ser abertas posteriormente por uma versão anterior.

    Esses metadados são acessíveis usando os métodos da API NDB `getExtraMetadata()` e `setExtraMetadata()`.

    Para obter mais informações, consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”.

  - **Atualizações em tempo real de tabelas usando arquivos .frm.** Uma tabela criada no NDB 7.6 e versões anteriores contém metadados na forma de um arquivo `.frm` compactado, que não é mais suportado no MySQL 8.0. Para facilitar as atualizações online para o NDB 8.0, o `NDB` realiza a tradução em tempo real desses metadados e os escreve no dicionário de dados do MySQL Server, o que permite que o **mysqld** no NDB Cluster 8.0 trabalhe com a tabela sem impedir o uso subsequente da tabela por uma versão anterior do software `NDB`.

    Importante

    Uma vez que a estrutura de uma tabela tenha sido modificada no NDB 8.0, seus metadados são armazenados usando o dicionário de dados, e não podem mais ser acessados pelo NDB 7.6 e versões anteriores.

    Essa melhoria também permite restaurar um backup `NDB` feito com uma versão anterior para um cluster que esteja executando o NDB 8.0 (ou uma versão posterior).

  - **Registro de erros de verificação de consistência de metadados.** Como parte do trabalho realizado anteriormente no NDB 8.0, a verificação de metadados realizada como parte da auto-sincronização entre a representação de uma tabela `NDB` no dicionário NDB e sua contraparte no dicionário de dados MySQL inclui o nome da tabela, o mecanismo de armazenamento e o ID interno. A partir do NDB 8.0.23, a faixa de propriedades verificadas é expandida para incluir propriedades dos seguintes objetos de dados:

    - Colunas
    - Índices
    - Chaves estrangeiras

    Além disso, os detalhes de quaisquer discrepâncias nas propriedades dos metadados agora são escritos no log de erro do servidor MySQL. Os formatos usados para as mensagens do log de erro diferem ligeiramente dependendo se a discrepância é encontrada no nível da tabela ou no nível de uma coluna, índice ou chave estrangeira. O formato para um erro de log resultante de uma discrepância em uma propriedade de nível de tabela é mostrado aqui, onde `property` é o nome da propriedade, `ndb_value` é o valor da propriedade conforme armazenado no dicionário NDB e `mysqld_value` é o valor da propriedade conforme armazenado no dicionário de dados MySQL:

    ```
    Diff in 'property' detected, 'ndb_value' != 'mysqld_value'
    ```

    Para desalinhamentos nas propriedades de colunas, índices e chaves estrangeiras, o formato é o seguinte, onde `obj_type` é um dos `column`, `index` ou `foreign key`, e `obj_name` é o nome do objeto:

    ```
    Diff in obj_type 'obj_name.property' detected, 'ndb_value' != 'mysqld_value'
    ```

    As verificações de metadados são realizadas durante a sincronização automática das tabelas `NDB` quando elas são instaladas no dicionário de dados de qualquer **mysqld** que esteja atuando como um nó SQL em um NDB Cluster. Se o **mysqld** for compilado em modo depuração, as verificações também são realizadas sempre que uma instrução `CREATE TABLE` for executada e sempre que uma tabela `NDB` for aberta.

- **Sincronização de privilégios de usuário com NDB\_STORED\_USER.** Um novo mecanismo para compartilhar e sincronizar usuários, papéis e privilégios entre nós SQL está disponível no NDB 8.0, usando o privilégio `NDB_STORED_USER`. Os privilégios distribuídos, como implementados no NDB 7.6 e versões anteriores (veja Privilegios Distribuídos Usando Tabelas de Concessão Compartilhadas), não são mais suportados.

  Uma vez que uma conta de usuário é criada em um nó SQL, o usuário e seus privilégios podem ser armazenados em `NDB` e, assim, compartilhados entre todos os nós SQL no clúster, emitindo uma declaração `GRANT` como esta:

  ```
  GRANT NDB_STORED_USER ON *.* TO 'jon'@'localhost';
  ```

  `NDB_STORED_USER` tem sempre escopo global e deve ser concedido usando `ON *.*`. Contas reservadas do sistema, como `mysql.session@localhost` ou `mysql.infoschema@localhost`, não podem receber esse privilégio.

  Os papéis também podem ser compartilhados entre os nós SQL ao emitir a declaração apropriada `GRANT NDB_STORED_USER`. Atribuir tal papel a um usuário não faz com que o usuário seja compartilhado; o privilégio `NDB_STORED_USER` deve ser concedido a cada usuário explicitamente.

  Um usuário ou papel com `NDB_STORED_USER`, juntamente com seus privilégios, é compartilhado com todos os nós SQL assim que eles se juntam a um determinado NDB Cluster. É possível fazer essas alterações a partir de qualquer nó SQL conectado, mas a prática recomendada é fazer isso apenas a partir de um nó SQL designado, pois a ordem de execução das instruções que afetam os privilégios de diferentes nós SQL não pode ser garantida para ser a mesma em todos os nós SQL.

  Antes da versão 8.0.27 do NDB, as alterações nos privilégios de um usuário ou papel eram sincronizadas imediatamente com todos os nós SQL conectados. A partir do MySQL 8.0.27, um nó SQL obtém um bloqueio de leitura global ao atualizar os privilégios, o que impede que mudanças concorrentes executadas por vários nós SQL causem um impasse.

  **Implicações para atualizações.** Devido às mudanças no sistema de privilégios do servidor MySQL (consulte a Seção 8.2.3, “Tabelas de Concessão”), as tabelas de privilégios que utilizam o mecanismo de armazenamento `NDB` não funcionam corretamente no NDB 8.0. É seguro, mas não necessário, manter tais tabelas de privilégios criadas no NDB 7.6 ou versões anteriores, mas elas não são mais usadas para controle de acesso. No NDB 8.0, um **mysqld** atuando como um nó SQL e detectando tais tabelas em `NDB` escreve uma mensagem de aviso no log do servidor MySQL e cria tabelas `InnoDB` de sombra locais para si mesmo; tais tabelas de sombra são criadas em cada servidor MySQL conectado ao clúster. Ao realizar uma atualização a partir do NDB 7.6 ou versões anteriores, as tabelas de privilégios que utilizam `NDB` podem ser removidas com segurança usando **ndb\_drop\_table** uma vez que todos os servidores MySQL atuando como nós SQL tenham sido atualizados (consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”).

  A opção `--restore-privilege-tables` do utilitário **ndb\_restore** está desatualizada, mas continua sendo respeitada no NDB 8.0 e ainda pode ser usada para restaurar tabelas de privilégios distribuídas presentes em um backup feito de uma versão anterior do NDB Cluster para um cluster que está executando o NDB 8.0. Essas tabelas são tratadas conforme descrito no parágrafo anterior.

  Os usuários compartilhados e as permissões são armazenados na tabela `ndb_sql_metadata`, que o **ndb\_restore** não restaura por padrão no NDB 8.0; você pode especificar a opção `--include-stored-grants` para fazer isso.

  Consulte a Seção 25.6.13, “Sincronização de privilégios e NDB\_STORED\_USER”, para obter mais informações.

- **Alterações no esquema de informações.** As seguintes alterações são feitas na exibição de informações sobre arquivos de dados de disco na tabela do esquema de informações `FILES`:

  - Os espaços de tabela e os grupos de arquivos de log não são mais representados na tabela `FILES`. (Esses construtos não são, na verdade, arquivos.)

  - Cada arquivo de dados é agora representado por uma única linha na tabela `FILES`. Cada arquivo de log de desfazer também é agora representado nesta tabela por apenas uma linha. (Anteriormente, uma linha era exibida para cada cópia de cada um desses arquivos em cada nó de dados.)

  Além disso, as tabelas `INFORMATION_SCHEMA` agora são preenchidas com estatísticas do espaço de tabelas para as tabelas do MySQL Cluster. (Bug #27167728)

- **Informações de erro com ndb\_perror.** A opção desatualizada `--ndb` para **perror** foi removida. Em vez disso, use **ndb\_perror** para obter informações da mensagem de erro a partir dos códigos de erro `NDB`. (Bug #81704, Bug #81705, Bug #23523926, Bug #23523957)

- Melhorias no empurrão de condições. Anteriormente, o empurrão de condições estava limitado a termos predicativos que se referiam a valores de coluna da mesma tabela para a qual a condição estava sendo empurrada. No NDB 8.0, essa restrição é removida, permitindo que valores de coluna de tabelas mais antigas no plano de consulta também possam ser referenciados a partir de condições empurradas. O NDB 8.0 suporta junções que comparam expressões de coluna, bem como comparações entre colunas da mesma tabela. As colunas e expressões de coluna a serem comparadas devem ser exatamente do mesmo tipo; isso significa que também devem ser da mesma sinalização, comprimento, conjunto de caracteres, precisão e escala, sempre que esses atributos se aplicarem. As condições sendo empurradas não podiam fazer parte de junções empurradas antes do NDB 8.0.27, quando essa restrição foi levantada.

  Deslocando partes maiores de uma condição, é possível filtrar mais linhas pelos nós de dados, reduzindo assim o número de linhas que o **mysqld** deve lidar durante o processamento de junção. Outro benefício dessas melhorias é que o filtro pode ser realizado em paralelo nos threads do LDM, em vez de em um único processo do mysqld em um nó SQL; isso tem o potencial de melhorar significativamente o desempenho das consultas.

  As regras existentes para a compatibilidade de tipo entre os valores das colunas que estão sendo comparados continuam a se aplicar (consulte a Seção 10.2.1.5, “Otimização de Empurrão de Condição do Motor”).

  **Desvio de junções externas e semijoinagens.** O trabalho realizado no NDB 8.0.20 permite que muitas junções externas e semijoinagens, e não apenas aquelas que utilizam uma chave primária ou busca por chave única, sejam deslocadas para os nós de dados (veja a Seção 10.2.1.5, “Otimização de Desvio de Condição do Motor”).

  As junções externas usando varreduras que agora podem ser empurradas incluem aquelas que atendem às seguintes condições:

  - Não há condições não resolvidas na mesa

  - Não há condições não pressionadas em outras tabelas no mesmo conjunto de junção, ou em conjuntos de junção superiores nos quais ele depende

  - Todas as outras tabelas no mesmo conjunto de junção ou em conjuntos de junção superiores nos quais ela depende também são empurradas

  Uma junção semijoia que utiliza uma varredura de índice pode agora ser empurrada se atender às condições mencionadas acima para uma junção externa empurrada, e utiliza a estratégia `firstMatch` (consulte a Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Junção Semijoia”).

  Essas melhorias adicionais foram feitas no NDB 8.0.21:

  - Os anticonjuntos produzidos pelo otimizador do MySQL através da transformação das consultas `NOT EXISTS` e `NOT IN` (veja a Seção 10.2.2.1, “Otimizando predicados de subconsultas IN e EXISTS com transformações de semijoin”) podem ser impulsionados para os nós de dados pelo `NDB`.

    Isso pode ser feito quando não há nenhuma condição não empurrada na tabela e a consulta atende a quaisquer outras condições que devem ser atendidas para que uma junção externa seja empurrada para baixo.

  - `NDB` tenta identificar e avaliar uma subconsulta escalar não dependente antes de tentar recuperar quaisquer linhas da tabela à qual ela está anexada. Quando isso for possível, o valor obtido é usado como parte de uma condição empurrada, em vez de usar a subconsulta que forneceu o valor.

  A partir da versão 8.0.27 do NDB, as condições impulsionadas como parte de uma consulta impulsionada agora podem se referir a colunas de tabelas ancestrais dentro da mesma consulta impulsionada, desde que cumpram as seguintes condições:

  - As condições impulsionadas podem incluir qualquer um dos operadores de comparação `<`, `<=`, `>`, `>=`, `=` e `<>`.

  - Os valores que estão sendo comparados devem ser do mesmo tipo, incluindo comprimento, precisão e escala.

  - O tratamento de `NULL` é realizado de acordo com a semântica de comparação especificada pelo padrão ISO SQL; qualquer comparação com `NULL` retorna `NULL`.

  Considere a tabela criada usando a declaração mostrada aqui:

  ```
  CREATE TABLE t (
      x INT PRIMARY KEY,
      y INT
  ) ENGINE=NDB;
  ```

  Uma consulta como \[\`SELECT

  - DE t AS m JOIN t AS n ON m.x >= n.y`](select.html "15.2.13 SELECT Statement") can now use the engine condition pushdown optimization to push down the condition column `y\`.

  Quando uma união não puder ser realizada, `EXPLAIN` deve fornecer a(s) razão(ões) para isso.

  Consulte a Seção 10.2.1.5, “Otimização da Depressão do Estado do Motor”, para obter mais informações.

  Os métodos da API NDB `branch_col_eq_param()`, `branch_col_ne_param()`, `branch_col_lt_param()`, `branch_col_le_param()`, `branch_col_gt_param()` e `branch_col_ge_param()` foram adicionados no NDB 8.0.27 como parte deste trabalho. Estes `NdbInterpretedCode` podem ser usados para comparar os valores das colunas com os valores dos parâmetros.

  Além disso, `NdbScanFilter::cmp_param()`, também adicionado no NDB 8.0.27, permite definir comparações entre os valores das colunas e os valores dos parâmetros para uso na realização de varreduras.

- **Aumento do tamanho máximo da linha.** O NDB 8.0 aumenta o número máximo de bytes que podem ser armazenados em uma tabela `NDBCLUSTER` de 14.000 para 30.000 bytes.

  Uma coluna `BLOB` ou `TEXT` continua a usar 264 bytes desse total, como antes.

  O deslocamento máximo para uma coluna de largura fixa de uma tabela `NDB` é de 8188 bytes; isso também não mudou em relação às versões anteriores.

  Consulte a Seção 25.2.7.5, “Limites associados a objetos de banco de dados no NDB Cluster”, para obter mais informações.

- **Comando ndb\_mgm SHOW e modo de usuário único.** No NDB 8.0, quando o clúster está no modo de usuário único, o resultado do comando do cliente de gerenciamento `SHOW` indica qual API ou nó SQL tem acesso exclusivo enquanto esse modo estiver em vigor.

- **Nome de coluna online alterado.** As colunas das tabelas `NDB` podem agora ser renomeadas online, usando `ALGORITHM=INPLACE`. Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

- **Melhorias nos tempos de inicialização do ndb\_mgmd.** Os tempos de inicialização do daemon de nós de gerenciamento foram significativamente melhorados no NDB 8.0, da seguinte forma:

  - Devido à substituição da estrutura de dados da lista anteriormente usada pelo `ndb_mgmd` para o gerenciamento de propriedades de nó a partir de dados de configuração por uma tabela hash, os tempos de inicialização gerais do servidor de gerenciamento foram reduzidos em um fator de 6 ou mais.

  - Além disso, nos casos em que os nomes de host de dados e nós SQL não estão presentes no arquivo `hosts` do servidor de gerenciamento, os tempos de início do **ndb\_mgmd** podem ser até 20 vezes menores do que no caso anterior.

- Melhorias na API do NDB. Agora é possível usar `NdbScanFilter::cmp()` e vários métodos de comparação de `NdbInterpretedCode` para comparar os valores das colunas de uma tabela entre si. Os métodos `NdbInterpretedCode` afetados estão listados aqui:

  - `branch_col_eq()`
  - `branch_col_ge()`
  - `branch_col_gt()`
  - `branch_col_le()`
  - `branch_col_lt()`
  - `branch_col_ne()`

  Para todos os métodos listados acima, os valores das colunas da tabela a serem comparados devem ser do mesmo tipo exato, incluindo, conforme aplicável, em relação ao comprimento, precisão, sinalização, escala, conjunto de caracteres e ordenação.

  Consulte as descrições dos métodos de API individuais para obter mais informações.

- **Construção de índices multithread offline.** Agora é possível especificar um conjunto de núcleos a serem usados para threads de E/S que realizam construções de índices ordenados offline, em oposição a tarefas normais de E/S, como E/S de arquivos, compressão ou descompactação. “Offline” neste contexto refere-se à construção de índices ordenados realizada quando a tabela pai não está sendo escrita; essa construção ocorre quando um cluster `NDB` realiza um reinício de nó ou sistema, ou como parte da restauração de um cluster a partir de um backup usando **ndb\_restore** `--rebuild-indexes`.

  Além disso, o comportamento padrão para a construção de índices offline é modificado para usar todas as cores disponíveis para **ndbmtd")**, em vez de se limitar ao núcleo reservado para o fio de E/S. Isso pode melhorar os tempos de reinício e restauração, além do desempenho, disponibilidade e experiência do usuário.

  Essa melhoria é implementada da seguinte forma:

  1. O valor padrão para `BuildIndexThreads` foi alterado de 0 para 128. Isso significa que as construções de índices solicitados offline agora são multithreadadas por padrão.

  2. O valor padrão para `TwoPassInitialNodeRestartCopy` é alterado de `false` para `true`. Isso significa que um reinício inicial do nó primeiro copia todos os dados de um nó "ativo" para um que está começando — sem criar nenhum índice — constrói índices ordenados offline e, em seguida, sincroniza novamente seus dados com o nó ativo, ou seja, sincronizando duas vezes e construindo índices offline entre as duas sincronizações. Isso faz com que um reinício inicial do nó se comporte mais como o reinício normal de um nó e reduza o tempo necessário para construir índices.

  3. Um novo tipo de fio (`idxbld`) é definido para o parâmetro de configuração `ThreadConfig`, para permitir o bloqueio de threads de construção de índice offline para CPUs específicas.

  Além disso, `NDB` agora distingue os tipos de thread que são acessíveis a `ThreadConfig` por esses dois critérios:

  1. Se o fio é um fio de execução. Os tipos de fios `main`, `ldm`, `recv`, `rep`, `tc` e `send` são fios de execução; os tipos de fios `io`, `watchdog` e `idxbld` não são.

  2. Se a alocação do fio para uma tarefa específica é permanente ou temporária. Atualmente, todos os tipos de fio, exceto `idxbld`, são permanentes.

  Para obter informações adicionais, consulte as descrições dos parâmetros indicados no Manual. (Bug #25835748, Bug #26928111)

- **Informações sobre o processo de backup da tabela logbuffers.** Ao realizar um backup do NDB, a tabela `ndbinfo.logbuffers` agora exibe informações sobre o uso do buffer pelo processo de backup em cada nó de dados. Isso é implementado como linhas que refletem dois novos tipos de log, além de `REDO` e `DD-UNDO`. Uma dessas linhas tem o tipo de log `BACKUP-DATA`, que mostra a quantidade de buffer de dados usado durante o backup para copiar fragmentos para os arquivos de backup. A outra linha tem o tipo de log `BACKUP-LOG`, que exibe a quantidade de buffer de log usado durante o backup para registrar as alterações feitas após o início do backup. Uma de cada uma dessas linhas `log_type` é mostrada na tabela `logbuffers` para cada nó de dados no clúster. Linhas que possuem esses dois tipos de log estão presentes na tabela apenas enquanto um backup do NDB estiver em andamento. (Bug #25822988)

- **tabela ndbinfo.processes no Windows.** O ID do processo do monitor usado nas plataformas Windows pelo `RESTART` para iniciar e reiniciar um **mysqld** agora é exibido na tabela `processes` como um `angel_pid`.

- Melhorias no hashing de strings. Antes da versão 8.0 do NDB, todo o hashing de strings era baseado na primeira transformação da string em um formato normalizado, e depois no hashing MD5 da imagem binária resultante. Isso poderia gerar alguns problemas de desempenho, pelas seguintes razões:

  - A string normalizada é sempre preenchida com espaços até atingir seu comprimento total. Para um `VARCHAR`, isso muitas vezes envolvia a adição de mais espaços do que havia caracteres na string original.

  - As bibliotecas de strings não foram otimizadas para esse alinhamento de espaços, o que adicionou um overhead considerável em alguns casos de uso.

  - A semântica de preenchimento variava entre os conjuntos de caracteres, alguns dos quais não eram preenchidos até o comprimento total.

  - A cadeia transformada pode se tornar bastante grande, mesmo sem o preenchimento de espaço; algumas colatações do Unicode 9.0 podem transformar um único ponto de código em 100 bytes ou mais de dados de caracteres.

  - A hashing MD5 subsequente consistia principalmente em preenchimento com espaços e não era particularmente eficiente, podendo causar penalidades adicionais de desempenho ao esvaziar porções significativas da cache L1.

  Uma ordenação fornece sua própria função de hash, que faz o hashing da string diretamente, sem primeiro criar uma string normalizada. Além disso, para uma ordenação Unicode 9.0, o hash é calculado sem preenchimento. `NDB` agora aproveita essa função embutida sempre que está fazendo o hashing de uma string identificada como usando uma ordenação Unicode 9.0.

  Como, para outras colatações, existem bancos de dados existentes que são particionados por hash na string transformada, o `NDB` continua a empregar o método anterior para hashing de strings que utilizam esses, para manter a compatibilidade. (Bug #89590, Bug #89604, Bug #89609, Bug #27515000, Bug #27523758, Bug #27522732)

- **Mudanças no RESET MASTER.** Como o MySQL Server agora executa `RESET MASTER` com um bloqueio de leitura global, o comportamento desta instrução quando usada com o NDB Cluster mudou nos seguintes dois aspectos:

  - Já não é mais garantido que seja sincronizado; ou seja, agora é possível que uma leitura que venha imediatamente antes de `RESET MASTER` não seja registrada até que o log binário tenha sido rotado.

  - Agora, ele se comporta exatamente da mesma maneira, seja a declaração emitida no mesmo nó SQL que está escrevendo o log binário, ou em um nó SQL diferente no mesmo clúster.

  Nota

  `SHOW BINLOG EVENTS`, `FLUSH LOGS` e a maioria das declarações de definição de dados continuam, como fizeram nas versões anteriores da `NDB`, a funcionar de forma síncrona.

- Uso da opção **ndb\_restore**. As opções `--nodeid` e `--backupid` são agora obrigatórias ao invocar **ndb\_restore**.

- **ndb\_log\_bin padrão.** O NDB 8.0 altera o valor padrão da variável de sistema `ndb_log_bin` de `TRUE` para `FALSE`.

- **Alocação dinâmica de recursos transacionais.** A alocação de recursos no coordenador de transações agora é realizada usando pools de memória dinâmica. Isso significa que a alocação de recursos determinada por parâmetros de configuração do nó de dados, como `MaxDMLOperationsPerTransaction`, `MaxNoOfConcurrentIndexOperations`, `MaxNoOfConcurrentOperations`, `MaxNoOfConcurrentScans`, `MaxNoOfConcurrentTransactions`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalScans` e `TransactionBufferMemory` é feita de maneira que, se a carga representada por cada um desses parâmetros estiver dentro da carga alvo para todos esses recursos, outros desses recursos podem ser limitados para não exceder os recursos totais disponíveis.

  Como parte deste trabalho, vários novos parâmetros de nós de dados que controlam recursos transacionais em `DBTC`, listados aqui, foram adicionados:

  - `ReservedConcurrentIndexOperations`
  - `ReservedConcurrentOperations`
  - `ReservedConcurrentScans`
  - `ReservedConcurrentTransactions`
  - `ReservedFiredTriggers`
  - `ReservedLocalScans`
  - `ReservedTransactionBufferMemory`.

  Consulte as descrições dos parâmetros listados acima para obter mais informações.

- **Backup usando múltiplos LDM por nó de dados.** Os backups `NDB` podem agora ser realizados de forma paralela em nós de dados individuais usando múltiplos gestores de dados locais (LDMs). (Anteriormente, os backups eram realizados em paralelo em todos os nós de dados, mas sempre eram seriados dentro dos processos dos nós de dados.) Não é necessária sintaxe especial para o comando `START BACKUP` no cliente **ndb\_mgm** para habilitar essa funcionalidade, mas todos os nós de dados devem estar usando múltiplos LDMs. Isso significa que os nós de dados devem estar executando **ndbmtd**") (**ndbd** é monosserial e, portanto, sempre tem apenas um LDM) e devem ser configurados para usar múltiplos LDMs antes de fazer o backup; você pode fazer isso escolhendo uma configuração apropriada para um dos parâmetros de configuração de nó de dados multisserial `MaxNoOfExecutionThreads` ou `ThreadConfig`.

  Os backups feitos com múltiplos LDM criam subdiretórios, um por LDM, sob o diretório `BACKUP/BACKUP-backup_id/`. O **ndb\_restore** agora detecta esses subdiretórios automaticamente e, se existirem, tenta restaurar o backup em paralelo; consulte a Seção 25.5.23.3, “Restauração a partir de um backup feito em paralelo”, para obter detalhes. (Os backups feitos com um único fio são restaurados como nas versões anteriores do `NDB`.) Também é possível restaurar backups feitos em paralelo usando um binário **ndb\_restore** de uma versão anterior do NDB Cluster, modificando o procedimento de restauração usual; a Seção 25.5.23.3.2, “Restauração de um backup paralelo em série”, fornece informações sobre como fazer isso.

  Você pode forçar a criação de backups monofilares definindo o parâmetro do nó de dados `EnableMultithreadedBackup` para 0 para todos os nós de dados na seção `[ndbd default]` do arquivo de configuração global do clúster (`config.ini`).

- **Melhorias no arquivo de configuração binário.** O NDB 8.0 utiliza um novo formato para o arquivo de configuração binário do servidor de gerenciamento. Anteriormente, o arquivo de configuração do clúster podia conter no máximo 16.381 seções; agora, o número máximo de seções é de 4G. Isso visa suportar um maior número de nós em um clúster do que era possível antes dessa mudança.

  As atualizações para o novo formato são relativamente fáceis e raramente, ou nunca, exigem intervenção manual, pois o servidor de gerenciamento continua a ser capaz de ler o formato antigo sem problemas. Uma desativação do NDB 8.0 para uma versão mais antiga do software do NDB Cluster requer a remoção manual de quaisquer arquivos de configuração binários ou, como alternativa, o início do binário do servidor de gerenciamento mais antigo com a opção `--initial`.

  Para obter mais informações, consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”.

- **Número maior de nós de dados.** O NDB 8.0 aumenta o número máximo de nós de dados suportados por cluster para 144 (anteriormente, era 48). Os nós de dados agora podem usar IDs de nó no intervalo de 1 a 144, inclusive.

  Anteriormente, os IDs de nó recomendados para os nós de gerenciamento eram 49 e 50. Estes ainda são suportados para os nós de gerenciamento, mas usá-los como tal limita o número máximo de nós de dados para 142; por essa razão, agora é recomendado que os IDs de nó 145 e 146 sejam usados para os nós de gerenciamento.

  Como parte desse trabalho, o formato usado para o nó de dados `sysfile` foi atualizado para a versão 2. Esse arquivo registra informações como o último índice de ponto de verificação global, o status de reinício e a associação ao grupo de nós de cada nó (veja o diretório do Sistema de Arquivos de Nó de Dados do NDB Cluster).

- Alterações no **RedoOverCommitCounter e RedoOverCommitLimit**. Devido a ambiguidades na semântica para defini-los como 0, o valor mínimo para cada um dos parâmetros de configuração do nó de dados `RedoOverCommitCounter` e `RedoOverCommitLimit` foi aumentado para 1.

- **Mudanças no ndb\_autoincrement\_prefetch\_sz.** O valor padrão da variável de sistema do servidor `ndb_autoincrement_prefetch_sz` foi aumentado para 512.

- **Alterações nos valores máximos e padrões dos parâmetros.** O NDB 8.0 faz as seguintes alterações nos valores máximos e padrões dos parâmetros de configuração:

  - O máximo para `DataMemory` é aumentado para 16 terabytes.

  - O limite máximo para `DiskPageBufferMemory` também foi aumentado para 16 terabytes.

  - O valor padrão para `StringMemory` é aumentado para 25%.

  - O tempo padrão para `LcpScanProgressTimeout` foi aumentado para 180 segundos.

- Melhorias no controle de pontos de verificação de dados de disco. O NDB Cluster 8.0 oferece várias novas melhorias que ajudam a reduzir a latência dos pontos de verificação de tabelas de dados de disco e de espaços de tabelas ao usar dispositivos de memória não volátil, como unidades de estado sólido e a especificação NVMe para esses dispositivos. Essas melhorias incluem as seguintes:

  - Evitar explosões de gravações de disco de ponto de verificação

  - Acelerar os pontos de verificação para tabelaspaces de dados de disco quando o log de reverso ou o log de desfazer ficar cheio

  - Equilibrar pontos de verificação no disco e pontos de verificação na memória com outros, quando necessário

  - Proteger os dispositivos de disco contra sobrecarga para ajudar a garantir baixa latência em cargas elevadas

  Como parte desse trabalho, dois parâmetros de configuração de nós de dados foram adicionados. `MaxDiskDataLatency` estabelece um limite para o grau de latência permitido para o acesso ao disco e faz com que as transações que demoram mais que esse tempo sejam abortadas. `DiskDataUsingSameDisk` permite aproveitar o uso de espaços de dados de disco em discos separados, aumentando a taxa na qual os pontos de verificação desses espaços de dados podem ser realizados.

  Além disso, três novas tabelas no banco de dados `ndbinfo` fornecem informações sobre o desempenho dos dados do disco:

  - A tabela `diskstat` relata os registros nas tabelaspaces de dados de disco durante o último segundo

  - A tabela `diskstats_1sec` relata os registros nos espaços de dados de disco para cada um dos últimos 20 segundos

  - A tabela `pgman_time_track_stats` relata a latência das operações de disco relacionadas aos espaços de dados de disco

- **Alocação de memória e TransactionMemory.** Um novo parâmetro `TransactionMemory` simplifica a alocação de memória para nós de dados durante transações, como parte do trabalho realizado para agrupar a memória de gerenciadores de dados transacionais e locais (LDM). Este parâmetro visa substituir vários parâmetros de memória de memória transacional mais antigos que foram desatualizados.

  A memória de transação agora pode ser configurada de qualquer uma das três maneiras listadas aqui:

  - Vários parâmetros de configuração são incompatíveis com `TransactionMemory`. Se algum desses parâmetros for definido, `TransactionMemory` não pode ser definido (veja Parâmetros incompatíveis com TransactionMemory), e a memória de transação do nó de dados é determinada como era antes do NDB 8.0.

    Nota

    Tentar definir `TransactionMemory` e qualquer um desses parâmetros simultaneamente no arquivo `config.ini` impede o início do servidor de gerenciamento.

  - Se `TransactionMemory` estiver definido, este valor é usado para determinar a memória de transação. `TransactionMemory` não pode ser definido se algum dos parâmetros incompatíveis mencionados no item anterior também tiver sido definido.

  - Se nenhum dos parâmetros incompatíveis estiverem definidos e `TransactionMemory` também não estiver definido, a memória de transação é definida por `NDB`.

  Para mais informações, consulte a descrição de `TransactionMemory`, bem como a Seção 25.4.3.13, “Gestão de Memória do Nó de Dados”.

- **Suporte para réplicas de fragmentos adicionais.** O NDB 8.0 aumenta o número máximo de réplicas de fragmentos suportadas em produção de dois para quatro. (Anteriormente, era possível definir `NoOfReplicas` para 3 ou 4, mas isso não era oficialmente suportado ou verificado em testes.)

- **Restauração por fatias.** A partir do NDB 8.0.20, é possível dividir um backup em porções aproximadamente iguais (fatias) e restaurar essas fatias em paralelo usando duas novas opções implementadas para **ndb\_restore**:

  - `--num-slices` determina o número de fatias em que o backup deve ser dividido.

  - `--slice-id` fornece o ID do fatiamento a ser restaurado pela instância atual de **ndb\_restore**.

  Isso permite que você use múltiplas instâncias do **ndb\_restore** para restaurar subconjuntos do backup em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

  Para mais informações, consulte a descrição da opção **ndb\_restore** `--num-slices`.

- **Leia de qualquer replica de fragmento habilitada.** Leia de qualquer replica de fragmento está habilitado por padrão para todas as tabelas `NDB`. Isso significa que o valor padrão da variável de sistema `ndb_read_backup` agora está ativado e que o valor da opção de comentário `NDB_TABLE` `READ_BACKUP` é 1 ao criar uma nova tabela `NDB`. Habilitar a leitura de qualquer replica de fragmento melhora significativamente o desempenho para leituras de tabelas `NDB`, com um impacto mínimo nas escritas.

  Para obter mais informações, consulte a descrição da variável de sistema `ndb_read_backup` e a Seção 15.1.20.12, “Definindo as Opções de Comentário NDB”.

- Melhorias no **ndb\_blob\_tool**. A partir do NDB 8.0.20, o utilitário **ndb\_blob\_tool** pode detectar partes de blob ausentes para as quais existem partes em linha e substituí-las por partes de blob de espaço (com caracteres de espaço) do comprimento correto. Para verificar se há partes de blob ausentes, use a opção `--check-missing` com este programa. Para substituir quaisquer partes de blob ausentes por marcadores, use a opção `--add-missing`.

  Para obter mais informações, consulte a Seção 25.5.6, “ndb\_blob\_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster”.

- **Versão do ndbinfo.** `NDB` 8.0.20 e versões posteriores suportam a versão para tabelas `ndbinfo` e mantêm as definições atuais para suas tabelas internamente. Ao inicializar, `NDB` compara a versão suportada por ele `ndbinfo` com a versão armazenada no dicionário de dados. Se as versões forem diferentes, `NDB` exclui quaisquer tabelas antigas `ndbinfo` e as recria usando as definições atuais.

- **Suporte para o Fedora Linux.** A partir da versão NDB 8.0.20, o Fedora Linux é uma plataforma suportada para as versões da Comunidade do NDB Cluster e pode ser instalado usando os RPMs fornecidos para esse propósito pela Oracle. Esses RPMs podem ser obtidos na página de downloads do NDB Cluster.

- **Programas do NDB — Remoção da dependência do NDBT.** A dependência de vários programas de utilitários `NDB` da biblioteca `NDBT` foi removida. Essa biblioteca é usada internamente para desenvolvimento e não é necessária para o uso normal; sua inclusão nesses programas poderia causar problemas indesejados durante os testes.

  Os programas afetados estão listados aqui, juntamente com as versões `NDB` nas quais a dependência foi removida:

  - **ndb\_restore**
  - **ndb\_delete\_all**
  - **ndb\_show\_tables** (NDB 8.0.20)
  - **ndb\_waiter** (NDB 8.0.20)

  O principal efeito dessa mudança para os usuários é que esses programas não imprimem mais `NDBT_ProgramExit - status` após a conclusão de uma execução. As aplicações que dependem desse comportamento devem ser atualizadas para refletir a mudança ao serem atualizadas para as versões indicadas.

- **Chaves estrangeiras e maiúsculas/minúsculas.** `NDB` armazena os nomes das chaves estrangeiras usando a maiúscula com a qual foram definidas. Anteriormente, quando o valor da variável de sistema `lower_case_table_names` era definido como 0, as comparações sensíveis à maiúscula dos nomes das chaves estrangeiras eram realizadas como usadas em `SELECT` e outras instruções SQL, com os nomes armazenados. A partir do NDB 8.0.20, essas comparações são agora sempre realizadas de forma insensível à maiúscula, independentemente do valor de `lower_case_table_names`.

- **Múltiplos transportadores.** O NDB 8.0.20 introduz suporte para múltiplos transportadores para gerenciar a comunicação entre pares de nós de dados. Isso facilita taxas mais altas de operações de atualização para cada grupo de nós no clúster e ajuda a evitar restrições impostas pelo sistema ou outras limitações nas comunicações entre nós usando um único soquete.

  Por padrão, `NDB` agora usa um número de transportadores baseado no número de threads de gerenciamento de dados locais (LDM) ou no número de threads de coordenador de transação (TC), o que for maior. Por padrão, o número de transportadores é igual a metade desse número. Embora o padrão deve funcionar bem para a maioria das cargas de trabalho, é possível ajustar o número de transportadores empregados por cada grupo de nós, configurando o parâmetro de configuração do nó de dados `NodeGroupTransporters` (também introduzido no NDB 8.0.20), até um máximo do maior número de threads de LDM ou threads de TC. Definir para 0 faz com que o número de transportadores seja o mesmo que o número de threads de LDM.

- **ndb\_restore: alterações no esquema da chave primária.** O NDB 8.0.21 (e versões posteriores) suporta diferentes definições de chave primária para tabelas de origem e destino ao restaurar um backup nativo `NDB` com **ndb\_restore** quando executado com a opção `--allow-pk-changes`. Ambos os casos de aumento e diminuição do número de colunas que compõem a chave primária original são suportados.

  Quando a chave primária é estendida com uma coluna ou colunas adicionais, todas as colunas adicionadas devem ser definidas como `NOT NULL`, e nenhum valor em tais colunas pode ser alterado durante o tempo em que o backup está sendo feito. Como algumas aplicações definem todos os valores das colunas em uma linha ao atualizá-la, independentemente de todos os valores realmente terem sido alterados, isso pode causar o falha de uma operação de restauração, mesmo que nenhum valor na coluna que será adicionada à chave primária tenha sido alterado. Você pode sobrepor esse comportamento usando a opção `--ignore-extended-pk-updates`, também adicionada no NDB 8.0.21; nesse caso, você deve garantir que nenhum desses valores seja alterado.

  Uma coluna pode ser removida da chave primária da tabela, independentemente de essa coluna permanecer ou não como parte da tabela.

  Para mais informações, consulte a descrição da opção `--allow-pk-changes` para **ndb\_restore**.

- **Unificando backups com ndb\_restore.** Em alguns casos, pode ser desejável consolidar os dados originalmente armazenados em diferentes instâncias do NDB Cluster (todos usando o mesmo esquema) em um único NDB Cluster de destino. Isso agora é suportado ao usar backups criados no cliente **ndb\_mgm** (veja a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e restaurá-los com **ndb\_restore**, usando a opção `--remap-column` adicionada no NDB 8.0.21, juntamente com `--restore-data` (e possivelmente opções compatíveis adicionais conforme necessário ou desejado). `--remap-column` pode ser empregado para lidar com casos em que os valores primários e de chave única estão sobrepostos entre os clusters de origem e é necessário que eles não se sobreponham no cluster de destino, além de preservar outras relações entre tabelas, como chaves estrangeiras.

  `--remap-column` aceita como argumento uma string no formato `db.tbl.col:fn:args`, onde `db`, `tbl` e `col` são, respectivamente, os nomes da base de dados, tabela e coluna, `fn` é o nome de uma função de mapeo e `args` é um ou mais argumentos para `fn`. Não há valor padrão. Apenas `offset` é suportado como o nome da função, com `args` como o deslocamento inteiro a ser aplicado ao valor da coluna ao inseri-la na tabela de destino a partir do backup. Esta coluna deve ser uma das `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT); o intervalo permitido do valor do deslocamento é o mesmo que a versão assinada desse tipo (isso permite que o deslocamento seja negativo, se desejado).

  A nova opção pode ser usada várias vezes na mesma invocação do **ndb\_restore**, para que você possa remappear para novos valores várias colunas da mesma tabela, de tabelas diferentes ou de ambas. O valor de deslocamento não precisa ser o mesmo para todas as instâncias da opção.

  Além disso, duas novas opções são fornecidas para **ndb\_desc**, também a partir do NDB 8.0.21:

  - `--auto-inc` (forma abreviada `-a`): Inclui o próximo valor de autoincremento na saída, se a tabela tiver uma coluna `AUTO_INCREMENT`.

  - `--context` (forma abreviada `-x`): Fornece informações adicionais sobre a tabela, incluindo o esquema, o nome do banco de dados, o nome da tabela e o ID interno.

  Para mais informações e exemplos, consulte a descrição da opção `--remap-column`.

- **Envie melhorias no fluxo de envio.** A partir da NDB 8.0.20, cada fio de envio agora gerencia envios para um subconjunto de transportadores, e cada fio de bloco agora auxilia apenas um fio de envio, resultando em mais fios de envio e, assim, melhor desempenho e escalabilidade do nó de dados.

- **Controle adaptativo de rotação usando o SpinMethod.** Uma interface simples para configurar a rotação adaptativa da CPU em plataformas que a suportam, usando o parâmetro do nó de dados `SpinMethod`. Este parâmetro (adicionado no NDB 8.0.20, funcional a partir do NDB 8.0.24) tem quatro configurações, uma para cada tipo de rotação adaptativa: estática, baseada em custo, otimizada para latência e adaptativa otimizada para máquinas de banco de dados em que cada thread tem sua própria CPU. Cada uma dessas configurações faz com que o nó de dados use um conjunto de valores predeterminados para um ou mais parâmetros de rotação que permitem a rotação adaptativa, definem o tempo de rotação e definem o overhead de rotação, conforme apropriado para um cenário específico, evitando assim a necessidade de definir esses valores diretamente para casos de uso comuns.

  Para ajustar o comportamento do spin, também é possível definir esses e outros parâmetros de spin diretamente, usando o parâmetro de configuração do nó de dados existente `SchedulerSpinTimer` e os seguintes comandos `DUMP` no cliente **ndb\_mgm**:

  - `DUMP 104000 (SetSchedulerSpinTimerAll)`: Define o tempo de rotação para todos os threads

  - `DUMP 104001 (SetSchedulerSpinTimerThread)`: Define o tempo de rotação para um fio especificado

  - `DUMP 104002 (SetAllowedSpinOverhead)`: Define o overhead de rotação como o número de unidades de tempo de CPU permitidas para ganhar 1 unidade de latência

  - `DUMP 104003 (SetSpintimePerCall)`: Define o tempo para uma chamada girar

  - `DUMP 104004 (EnableAdaptiveSpinning)`: Habilita ou desabilita a rotação adaptativa

  O NDB 8.0.20 também adiciona um novo parâmetro de configuração TCP `TcpSpinTime`, que define o tempo de rotação para uma conexão TCP específica.

  A ferramenta **ndb\_top** também foi aprimorada para fornecer informações sobre o tempo de rotação por fio.

  Para obter informações adicionais, consulte a descrição do parâmetro `SpinMethod`, os comandos listados `DUMP` e a Seção 25.5.29, “ndb\_top — Exibir informações de uso da CPU para os threads do NDB”.

- **Reinício de dados de disco e clusters.** A partir do NDB 8.0.21, um reinício inicial do cluster força a remoção de todos os objetos de dados de disco, como espaços de tabelas e grupos de arquivos de log, incluindo quaisquer arquivos de dados e arquivos de log de desfazer associados a esses objetos.

  Consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”, para obter mais informações.

- **Alocação da extensão dos dados do disco.** A partir do NDB 8.0.20, a alocação de extensões nos arquivos de dados é feita de forma round-robin entre todos os arquivos de dados usados por um determinado espaço de tabelas. Isso deve melhorar a distribuição dos dados em casos em que múltiplos dispositivos de armazenamento são usados para armazenamento de dados do disco.

  Para obter mais informações, consulte a Seção 25.6.11.1, “Objetos de dados de disco do cluster NDB”.

- **Opção ndb-log-fail-terminate.** A partir do NDB 8.0.21, você pode fazer com que o nó SQL termine sempre que não conseguir registrar todos os eventos de linha completamente. Isso pode ser feito iniciando o **mysqld** com a opção `--ndb-log-fail-terminate`.

- Parâmetro **AllowUnresolvedHostNames**. Por padrão, um nó de gerenciamento se recusa a iniciar quando não consegue resolver um nome de host presente no arquivo de configuração global, o que pode ser um problema em alguns ambientes, como o Kubernetes. A partir do NDB 8.0.22, é possível ignorar esse comportamento ao definir `AllowUnresolvedHostNames` para `true` na seção `[tcp default]` do arquivo de configuração global do cluster (arquivo `config.ini`). Isso faz com que esses erros sejam tratados como avisos e permitam que o **ndb\_mgmd** continue iniciando

- **Melhorias no desempenho da escrita de blobs.** O NDB 8.0.22 implementa várias melhorias que permitem uma batching mais eficiente ao modificar várias colunas de blobs na mesma linha ou ao modificar várias linhas que contêm colunas de blobs na mesma instrução, reduzindo o número de viagens necessárias entre um nó SQL ou outro nó de API e os nós de dados ao aplicar essas modificações. O desempenho de muitas instruções `INSERT`, `UPDATE` e `DELETE` pode, assim, ser melhorado. Exemplos dessas instruções estão listados aqui, onde `table` é uma tabela `NDB` que contém uma ou mais colunas Blob:

  - `INSERT INTO table VALUES ROW(1, blob_value1, blob_value2, ...)`, ou seja, inserção de uma linha contendo uma ou mais colunas Blob

  - `INSERT INTO table VALUES ROW(1, blob_value1), ROW(2, blob_value2), ROW(3, blob_value3), ...`, ou seja, inserção de múltiplas linhas contendo uma ou mais colunas Blob

  - `UPDATE table SET blob_column1 = blob_value1, blob_column2 = blob_value2, ...`

  - `UPDATE table SET blob_column = blob_value WHERE primary_key_column in (value_list)`, onde a coluna da chave primária não é do tipo Blob

  - `DELETE FROM table WHERE primary_key_column = value`, onde a coluna da chave primária não é do tipo Blob

  - `DELETE FROM table WHERE primary_key_column IN (value_list)`, onde a coluna da chave primária não é do tipo Blob

  Outras instruções SQL também podem se beneficiar dessas melhorias. Isso inclui `LOAD DATA INFILE` e `CREATE TABLE ... SELECT ...`. Além disso, `ALTER TABLE table ENGINE = NDB`, onde `table` usa um mecanismo de armazenamento diferente de `NDB` antes da execução da instrução, também pode ser executado de forma mais eficiente.

  Essa melhoria se aplica a declarações que afetam as colunas do tipo MySQL `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT` e `LONGTEXT`. Declarações que atualizam as colunas `TINYBLOB` ou `TINYTEXT` (ou ambos os tipos) não são afetadas por este trabalho, e não devem ser esperadas alterações em seu desempenho.

  O desempenho de algumas instruções SQL não é significativamente melhorado por essa melhoria, devido ao fato de que elas exigem varreduras das colunas Blob da tabela, o que quebra o agrupamento. Tais instruções incluem as do tipo listadas aqui:

  - `SELECT FROM table [WHERE key_column IN (blob_value_list)]`, onde as linhas são selecionadas por correspondência em uma chave primária ou coluna de chave única que usa um tipo Blob

  - `UPDATE table SET blob_column = blob_value WHERE condition`, usando um `condition` que não depende de um valor único

  - `DELETE FROM table WHERE condition` para excluir linhas que contêm uma ou mais colunas Blob, usando um `condition` que não depende de um valor único

  - Uma declaração de cópia `ALTER TABLE` em uma tabela que já utilizou o mecanismo de armazenamento `NDB` antes de executar a declaração, e cujas linhas contêm uma ou mais colunas Blob antes ou depois da execução da declaração (ou ambas)

  Para aproveitar ao máximo essa melhoria, você pode querer aumentar os valores usados para as opções `--ndb-batch-size` e `--ndb-blob-write-batch-bytes` para o **mysqld**, para minimizar o número de viagens necessárias para modificar blobs. Para a replicação, também é recomendável habilitar a variável de sistema `slave_allow_batching`, que minimiza o número de viagens necessárias pelo clúster de réplicas para aplicar transações de época.

  Nota

  A partir da versão NDB 8.0.30, você também deve usar `ndb_replica_batch_size` em vez de `--ndb-batch-size` e `ndb_replica_blob_write_batch_bytes` em vez de `--ndb-blob-write-batch-bytes`. Consulte as descrições dessas variáveis, bem como a Seção 25.7.5, “Preparando o NDB Cluster para Replicação”, para obter mais informações.

- **Atualização do Node.js.** A partir do NDB 8.0.22, o adaptador `NDB` para Node.js é construído com a versão 12.18.3, e apenas essa versão (ou uma versão posterior do Node.js) é agora suportada.

- **Backup criptografado.** O NDB 8.0.22 adiciona suporte para arquivos de backup criptografados usando AES-256-CBC; isso visa proteger contra a recuperação de dados de backups que tenham sido acessados por partes não autorizadas. Quando criptografado, os dados do backup são protegidos por uma senha fornecida pelo usuário. A senha pode ser qualquer string com até 256 caracteres do intervalo de caracteres ASCII imprimíveis, exceto `!`, `'`, `"`, `$`, `%`, `\` e `^`. A retenção da senha usada para criptografar qualquer backup de NDB Cluster deve ser realizada pelo usuário ou aplicativo; `NDB` não salva a senha. A senha pode ser vazia, embora isso não seja recomendado.

  Ao fazer um backup de um cluster NDB, você pode criptografá-lo usando `ENCRYPT PASSWORD=password` com o comando do cliente de gerenciamento `START BACKUP`. Os usuários da API MGM também podem iniciar um backup criptografado chamando `ndb_mgm_start_backup4()`.

  Você pode criptografar arquivos de backup existentes usando o utilitário **ndbxfrm**, que foi adicionado à distribuição do NDB Cluster na versão 8.0.22; este programa também pode ser usado para descriptografar arquivos de backup criptografados. Além disso, o **ndbxfrm** pode comprimir arquivos de backup e descomprimir arquivos de backup comprimidos usando o mesmo método utilizado pelo NDB Cluster para criar backups quando o parâmetro de configuração `CompressedBackup` estiver definido como 1.

  Para restaurar a partir de um backup criptografado, use **ndb\_restore** com as opções `--decrypt` e `--backup-password`. Ambas as opções são necessárias, juntamente com quaisquer outras que seriam necessárias para restaurar o mesmo backup se ele não estivesse criptografado. **ndb\_print\_backup\_file** e **ndbxfrm** também podem ler arquivos criptografados usando, respectivamente, `-P` `password` e `--decrypt-password=password`.

  Em todos os casos em que uma senha é fornecida junto com uma opção de criptografia ou descriptografia, a senha deve ser citada; você pode usar aspas simples ou duplas para delimitar a senha.

  A partir da versão NDB 8.0.24, vários programas `NDB` listados aqui também suportam a entrada da senha pelo padrão de entrada, da mesma forma que é feito ao fazer login interativamente com o cliente **mysql** usando a opção `--password` (sem incluir a senha na linha de comando):

  - Para **ndb\_restore** e **ndb\_print\_backup\_file**, a opção `--backup-password-from-stdin` permite a entrada da senha de forma segura, de maneira semelhante à realizada pelo cliente **mysql** com a opção `--password`. Para **ndb\_restore**, use a opção juntamente com a opção `--decrypt`; para **ndb\_print\_backup\_file**, use a opção em vez da opção `-P`.

  - Para o **ndb\_mgm**, a opção `--backup-password-from-stdin`, é suportada juntamente com `--execute "START BACKUP [options]"` para iniciar um backup de cluster a partir da linha de comando do sistema.

  - Duas opções do **ndbxfrm**, `--encrypt-password-from-stdin` e `--decrypt-password-from-stdin`, causam comportamentos semelhantes ao usar esse programa para criptografar ou descriptografar um arquivo de backup.

  Veja as descrições dos programas listados acima para mais informações.

  Também é possível, a partir da versão NDB 8.0.22, impor a criptografia dos backups definindo `RequireEncryptedBackup=1` na seção `[ndbd default]` do arquivo de configuração global do cluster. Quando isso é feito, o cliente **ndb\_mgm** rejeita qualquer tentativa de realizar um backup que não esteja criptografado.

  A partir da versão NDB 8.0.24, você pode fazer com que o **ndb\_mgm** use criptografia sempre que criar um backup, iniciando-o com `--encrypt-backup`. Nesse caso, o usuário será solicitado a fornecer uma senha ao invocar `START BACKUP`, caso nenhuma seja fornecida.

- **Suporte ao IPv6.** A partir do NDB 8.0.22, o endereçamento IPv6 é suportado para conexões a nós de gerenciamento e dados; isso inclui conexões entre nós de gerenciamento e dados com nós SQL. Ao configurar um clúster, você pode usar endereços IPv6 numéricos, nomes de host que resolvem para endereços IPv6 ou ambos.

  Para que o endereçamento IPv6 funcione, a plataforma operacional e a rede em que o clúster é implantado devem suportar o IPv6. Assim como ao usar o endereçamento IPv4, a resolução do nome de domínio para endereços IPv6 deve ser fornecida pela plataforma operacional.

  Um problema conhecido nas plataformas Linux ao executar o NDB 8.0.22 e versões posteriores era que o kernel do sistema operacional precisava fornecer suporte ao IPv6, mesmo quando não havia endereços IPv6 em uso. Esse problema foi corrigido no NDB 8.0.34 e versões posteriores, onde é seguro desativar o suporte ao IPv6 no kernel do Linux se você não pretende usar endereçamento IPv6 (Bug #33324817, Bug #33870642).

  O endereçamento IPv4 continua sendo suportado pelo `NDB`. Não é recomendado usar endereços IPv4 e IPv6 simultaneamente, mas isso pode ser feito nos seguintes casos:

  - Quando o nó de gerenciamento é configurado com IPv6 e os nós de dados são configurados com endereços IPv4 no arquivo `config.ini`: Isso funciona se `--bind-address` não for usado com **mgmd**, e os nós de dados são iniciados com `--ndb-connectstring` definido para o endereço IPv4 dos nós de gerenciamento.

  - Quando o nó de gerenciamento é configurado com IPv4 e os nós de dados são configurados com endereços IPv6 em `config.ini`: Da mesma forma que no outro caso, isso funciona se `--bind-address` não for passado para **mgmd** e os nós de dados forem iniciados com `--ndb-connectstring` definido para o endereço IPv6 do nó de gerenciamento.

  Esses casos funcionam porque o **ndb\_mgmd** não se liga a nenhum endereço IP por padrão.

  Para realizar uma atualização de uma versão do `NDB` que não suporta endereçamento IPv6 para uma que o suporte, desde que a rede suporte IPv4 e IPv6, primeiro realize a atualização do software; após isso, você pode atualizar os endereços IPv4 usados no arquivo `config.ini` com endereços IPv6. Depois disso, para que as alterações de configuração sejam efetivas e para que o clúster comece a usar os endereços IPv6, é necessário realizar um reinício do sistema do clúster.

- **Depreciação e remoção do Auto-Instalador.** A ferramenta de instalação baseada na web do Auto-Instalador do MySQL NDB Cluster (**ndb\_setup.py**) é descontinuada no NDB 8.0.22 e removida no NDB 8.0.23 e versões posteriores. Ela não é mais suportada.

- **Descontinuidade e remoção do ndbmemcache.** `ndbmemcache` não é mais suportado. `ndbmemcache` foi descontinuado no NDB 8.0.22 e removido no NDB 8.0.23.

- **tabela ndbinfo backup\_id.** O NDB 8.0.24 adiciona uma tabela `backup_id` ao banco de dados de informações `ndbinfo`. Isso visa servir como um substituto para obter essas informações usando **ndb\_select\_all** para drenar o conteúdo da tabela interna `SYSTAB_0`, que é propensa a erros e leva um tempo excessivamente longo para ser executado.

  Esta tabela tem uma única coluna e uma única linha contendo o ID do backup mais recente do clúster feito usando o comando do cliente de gerenciamento `START BACKUP`. No caso de não ser possível encontrar nenhum backup deste clúster, a tabela contém uma única linha cujo valor da coluna é `0`.

- Melhorias no particionamento de tabelas. O NDB 8.0.23 introduz um novo método para lidar com particionamentos e fragmentos de tabelas, que pode determinar o número de gestores de dados locais (LDMs) para um dado nó de dados, independentemente do número de partes do log de refazer. Isso significa que o número de LDMs pode agora ser altamente variável. O `NDB` pode empregar esse método quando o parâmetro de configuração do nó de dados `ClassicFragmentation`, também implementado no NDB 8.0.23, é definido como `false`; nesse caso, o número de LDMs não é mais usado para determinar quantas particionamentos criar para uma tabela por nó de dados, e o valor do parâmetro `PartitionsPerNode` (também introduzido no NDB 8.0.23) determina esse número, que também é usado para calcular o número de fragmentos usados para uma tabela.

  Quando `ClassicFragmentation` tem seu valor padrão `true`, então o método tradicional de usar o número de LDMs é usado para determinar o número de fragmentos que uma tabela deve ter.

  Para mais informações, consulte as descrições dos novos parâmetros referenciados anteriormente, na Configuração de Parâmetros de Multithreading (ndbmtd)").

- **Atualizações de terminologia.** Para alinhar com o trabalho iniciado no MySQL 8.0.21 e no NDB 8.0.21, o NDB 8.0.23 implementa várias mudanças na terminologia, listadas aqui:

  - A variável de sistema `ndb_slave_conflict_role` está sendo descontinuada. Ela é substituída por `ndb_conflict_role`.

  - Muitas variáveis de status `NDB` estão desatualizadas. Essas variáveis e suas substituições estão mostradas na tabela a seguir:

    **Tabela 25.1 Variáveis de status NDB obsoletas e suas substituições**

    <table><thead><tr> <th>Variável desatualizada</th> <th>Substituição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>Ndb_api_pk_op_count_slave</code>]</td> <td>[[PH_HTML_CODE_<code>Ndb_api_pk_op_count_slave</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>Ndb_api_pruned_scan_count_slave</code>]</td> <td>[[PH_HTML_CODE_<code>Ndb_api_pruned_scan_count_replica</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>Ndb_api_range_scan_count_slave</code>]</td> <td>[[PH_HTML_CODE_<code>Ndb_api_range_scan_count_replica</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>Ndb_api_read_row_count_slave</code>]</td> <td>[[PH_HTML_CODE_<code>Ndb_api_read_row_count_replica</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>Ndb_api_scan_batch_count_slave</code>]</td> <td>[[PH_HTML_CODE_<code>Ndb_api_scan_batch_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_pk_op_count_slave</code>]]</td> <td>[[<code>Ndb_api_adaptive_send_deferred_count_replica</code><code>Ndb_api_pk_op_count_slave</code>]</td> </tr><tr> <td>[[<code>Ndb_api_pruned_scan_count_slave</code>]]</td> <td>[[<code>Ndb_api_pruned_scan_count_replica</code>]]</td> </tr><tr> <td>[[<code>Ndb_api_range_scan_count_slave</code>]]</td> <td>[[<code>Ndb_api_range_scan_count_replica</code>]]</td> </tr><tr> <td>[[<code>Ndb_api_read_row_count_slave</code>]]</td> <td>[[<code>Ndb_api_read_row_count_replica</code>]]</td> </tr><tr> <td>[[<code>Ndb_api_scan_batch_count_slave</code>]]</td> <td>[[<code>Ndb_api_scan_batch_count_replica</code>]]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_pk_op_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_pk_op_count_slave</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_pruned_scan_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_pruned_scan_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_range_scan_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_range_scan_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_read_row_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_read_row_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_scan_batch_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_slave</code><code>Ndb_api_scan_batch_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_pk_op_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_pk_op_count_slave</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_pruned_scan_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_pruned_scan_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_range_scan_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_range_scan_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_read_row_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_read_row_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_scan_batch_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_forced_count_replica</code><code>Ndb_api_scan_batch_count_replica</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_unforced_count_slave</code><code>Ndb_api_pk_op_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_unforced_count_slave</code><code>Ndb_api_pk_op_count_slave</code>]</td> </tr><tr> <td>[[<code>Ndb_api_adaptive_send_unforced_count_slave</code><code>Ndb_api_pruned_scan_count_slave</code>]</td> <td>[[<code>Ndb_api_adaptive_send_unforced_count_slave</code><code>Ndb_api_pruned_scan_count_replica</code>]</td> </tr></tbody></table>

    As variáveis de status obsoletas continuam a ser exibidas na saída do `SHOW STATUS`, mas as aplicações devem ser atualizadas o mais rápido possível para não depender delas mais, uma vez que sua disponibilidade em futuras séries de lançamentos não é garantida.

  - Os valores `ADD_TABLE_MASTER` e `ADD_TABLE_SLAVE` anteriormente mostrados na coluna `tab_copy_status` da tabela `ndbinfo` `ndbinfo.table_distribution_status` estão desatualizados. Esses são substituídos, respectivamente, pelos valores `ADD_TABLE_COORDINATOR` e `ADD_TABLE_PARTICIPANT`.

  - A saída `--help` de alguns programas clientes e utilitários `NDB`, como o **ndb\_restore**, foi modificada.

- Melhorias no **ThreadConfig**. A partir da NDB 8.0.23, a configuração do parâmetro `ThreadConfig` foi estendida com dois novos tipos de thread, listados aqui:

  - `query`: Um fio de consulta funciona (apenas) em consultas `READ COMMITTED`. Um fio de consulta também atua como um fio de recuperação. O número de fios de consulta deve ser 0, 1, 2 ou 3 vezes o número de fios LDM. 0 (o padrão, a menos que esteja usando `ThreadConfig` ou `AutomaticThreadConfig` esteja habilitado) faz com que os LDM se comportem como faziam antes do NDB 8.0.23.

  - `recover`: Um fio de recuperação recupera dados de um ponto de verificação local. Um fio de recuperação especificado como tal nunca atua como um fio de consulta.

  É também possível combinar as threads existentes `main` e `rep` de duas maneiras:

  - Em um único fio, definindo um desses argumentos para 0. Quando isso for feito, o fio combinado resultante será exibido com o nome `main_rep` na tabela `ndbinfo.threads`.

  - Junto com o fio `recv`, definindo ambos `ldm` e `tc` para 0, e definindo `recv` para 1. Neste caso, o fio combinado é chamado de `main_rep_recv`.

  Além disso, o número máximo de tipos de threads existentes foi aumentado. Os novos máximos, incluindo os para threads de consulta e threads de recuperação, estão listados aqui:

  - LDM: 332
  - Consulta: 332
  - Recuperação: 332
  - TC: 128
  - Receba: 64
  - Enviar: 64
  - Principal: 2

  Os máximos para outros tipos de fios permanecem inalterados.

  Além disso, como resultado do trabalho realizado em relação a essa tarefa, o `NDB` agora utiliza mutexes para proteger os buffers de trabalho ao usar mais de 32 threads de bloco. Embora isso possa causar uma leve diminuição no desempenho (1 a 2 por cento na maioria dos casos), também reduz significativamente a quantidade de memória necessária para configurações muito grandes. Por exemplo, uma configuração com 64 threads que usava 2 GB de memória de buffer de trabalho antes do NDB 8.0.23 deve exigir apenas cerca de 1 GB no NDB 8.0.23 e versões posteriores. Em nossos testes, isso resultou em uma melhoria geral na ordem de 5 por cento na execução de consultas muito complexas.

  Para mais informações, consulte as descrições do parâmetro `ThreadConfig` e da tabela `ndbinfo.threads`.

- Alterações na contagem de fios **ThreadConfig.** Como resultado do trabalho realizado no NDB 8.0.30, definir o valor de `ThreadConfig` requer incluir explicitamente os valores de `main`, `rep`, `recv` e `ldm` na string de valor `ThreadConfig`, neste e em versões subsequentes do NDB Cluster. Além disso, `count=0` deve ser definido explicitamente para cada tipo de fio (de `main`, `rep` ou `ldm`) que não será utilizado, e definir `count=1` para os fios de replicação (`rep`) também requer definir `count=1` para `main`.

  Essas alterações podem ter um impacto significativo nas atualizações dos clusters NDB quando esse parâmetro estiver em uso; consulte a Seção 25.3.7, “Atualização e Downgrade do Cluster NDB”, para obter mais informações.

- **Autoconfiguração de Fios ndbmtd.** A partir do NDB 8.0.23, é possível utilizar a autoconfiguração de fios para nós de dados multi-threads usando o parâmetro de configuração **ndbmtd")** `AutomaticThreadConfig`. Quando este parâmetro é definido para 1, `NDB` configura automaticamente as atribuições de fios, com base no número de processadores disponíveis para as aplicações, para todos os tipos de fios suportados, incluindo os novos tipos de fios `query` e `recover` descritos no item anterior. Se o sistema não limitar o número de processadores, você pode fazê-lo, se desejar, definindo `NumCPUs` (também adicionado no NDB 8.0.23). Caso contrário, a configuração automática de fios acomoda até 1024 CPUs.

  A configuração automática do fio ocorre independentemente de quaisquer valores definidos para `ThreadConfig` ou `MaxNoOfExecutionThreads` em `config.ini`; isso significa que não é necessário definir nenhum desses parâmetros.

  Além disso, o NDB 8.0.23 implementa várias novas tabelas de banco de dados de informações `ndbinfo`, fornecendo informações sobre a disponibilidade de hardware e CPU, bem como o uso da CPU pelos nós de dados `NDB`. Essas tabelas estão listadas aqui:

  - `cpudata`
  - `cpudata_1sec`
  - `cpudata_20sec`
  - `cpudata_50ms`
  - `cpuinfo`
  - `hwinfo`

  Algumas dessas tabelas não estão disponíveis em todas as plataformas suportadas pelo NDB Cluster; consulte as descrições individuais delas para obter mais informações.

- **Visões hierárquicas dos objetos do banco de dados NDB.** A tabela `dict_obj_tree`, adicionada ao banco de dados de informações `ndbinfo` no NDB 8.0.24, pode fornecer visões hierárquicas e semelhantes a árvores de muitos objetos de banco de dados `NDB`, incluindo o seguinte:

  - Tabelas e índices associados
  - Tablespaces e arquivos de dados associados
  - Grupos de logfiles e arquivos de registro de desfazer associados

  Para obter mais informações e exemplos, consulte a Seção 25.6.16.25, “A tabela ndbinfo dict\_obj\_tree”.

- **Melhorias nas estatísticas do índice.** O NDB 8.0.24 implementa as seguintes melhorias no cálculo das estatísticas do índice:

  - As estatísticas do índice eram coletadas anteriormente a partir de apenas um fragmento; isso foi alterado para que essa extrapolação seja estendida a fragmentos adicionais.

  - O algoritmo utilizado para tabelas muito pequenas, como aquelas com poucas linhas e resultados descartados, foi aprimorado, de modo que as estimativas para essas tabelas devem ser mais precisas do que antes.

  A partir da NDB 8.0.27, as tabelas de estatísticas do índice são criadas e atualizadas automaticamente por padrão, `IndexStatAutoCreate` e `IndexStatAutoUpdate` têm como padrão `1` (ativado) em vez de `0` (desativado), e não é mais necessário executar `ANALYZE TABLE` para atualizar as estatísticas.

  Para obter informações adicionais, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- **Conversão entre NULL e NOT NULL durante operações de restauração.** A partir do NDB 8.0.26, o **ndb\_restore** pode suportar a restauração de colunas `NULL` como `NOT NULL` e vice-versa, usando as opções listadas aqui:

  - Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção `--lossy-conversions`.

    A coluna originalmente declarada como `NULL` não deve conter nenhuma linha `NULL`; se contiver, o **ndb\_restore** sai com um erro.

  - Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção `--promote-attributes`.

  Para obter mais informações, consulte as descrições das opções **ndb\_restore** indicadas.

- **Modo de comparação NULL compatível com SQL para NdbScanFilter.** Tradicionalmente, ao fazer comparações envolvendo `NULL`, `NdbScanFilter` trata `NULL` como igual a `NULL` (e, portanto, considera `NULL == NULL` como `TRUE`). Isso não é o mesmo que especificado pelo Padrão SQL, que exige que qualquer comparação com `NULL` retorne `NULL`, incluindo `NULL == NULL`.

  Anteriormente, não era possível que um aplicativo da API NDB sobrescrevesse esse comportamento; a partir do NDB 8.0.26, você pode fazer isso chamando `NdbScanFilter::setSqlCmpSemantics()` antes de criar um filtro de varredura. (Assim, esse método é sempre invocado como um método de classe e não como um método de instância.) Isso faz com que o próximo objeto `NdbScanFilter` seja criado para usar a comparação `NULL` compatível com SQL para todas as operações de comparação realizadas ao longo da vida útil da instância. Você deve invocar o método para cada objeto `NdbScanFilter` que deve usar comparações compatíveis com SQL.

  Para obter mais informações, consulte NdbScanFilter::setSqlCmpSemantics().

- **Deprecación dos métodos de arquivo NDB API .FRM.** MySQL 8.0 e NDB 8.0 não usam mais arquivos `.FRM` para armazenar metadados de tabelas. Por essa razão, os métodos da API NDB `getFrmData()`, `getFrmLength()` e `setFrm()` são desatualizados a partir da versão NDB 8.0.27 e estão sujeitos à remoção em uma futura versão. Para leitura e escrita de metadados de tabelas, use `getExtraMetadata()` e `setExtraMetadata()` em vez disso.

- **Preferência para endereçamento IPv4 ou IPv6.** O NDB 8.0.26 adiciona o parâmetro de configuração `PreferIPVersion`, que controla a preferência de endereçamento para resolução DNS. O IPv4 (`PreferIPVersion=4`) é o padrão. Como a recuperação de configuração no NDB exige que essa preferência seja a mesma para todas as conexões TCP, você deve configurá-la apenas na seção `[tcp default]` do arquivo de configuração global do clúster (`config.ini`).

  Consulte a Seção 25.4.3.10, “Conexões de TCP/IP do NDB Cluster”, para obter mais informações.

- Melhorias no registro. Anteriormente, a análise dos logs dos nós de dados e dos nós de gerenciamento do NDB Cluster poderia ser prejudicada pelo fato de que diferentes mensagens de log usavam formatos diferentes e que nem todas as mensagens de log incluíam timestamps. Esses problemas eram, em parte, devido ao fato de que o registro era realizado por vários mecanismos diferentes, como as funções `printf`, `fprintf`, `ndbout` e `ndbout_c`, o sobrecarregamento do operador `<<` e assim por diante.

  Resolvemos esses problemas padronizando o mecanismo `EventLogger`, que já está presente em `NDB`, e que começa cada mensagem de log com um timestamp no formato `YYYY-MM-DD HH:MM:SS`.

  Consulte a Seção 25.6.3, “Relatórios de Eventos Gerados no NDB Cluster”, para obter mais informações sobre os registros de eventos do NDB Cluster e o formato da mensagem de log `EventLogger`.

- **Copiar melhorias de ALTER TABLE.** A partir do NDB 8.0.27, uma cópia de `ALTER TABLE` em uma tabela `NDB` compara os números de commit de fragmentos da tabela de origem antes e depois de realizar a cópia. Isso permite que o nó SQL que executa essa instrução determine se houve alguma atividade de escrita concorrente na tabela que está sendo alterada; se houver, o nó SQL pode então encerrar a operação.

  Quando são detectadas escritas concorrentes sendo feitas na tabela que está sendo alterada, a instrução `ALTER TABLE` é rejeitada com o erro Alterações detectadas nos dados da tabela de origem durante a cópia ALTER TABLE. A alteração é abortada para evitar inconsistências (`ER_TABLE_DEF_CHANGED`). Parar a operação de alteração, em vez de permitir que ela prossiga com escritas concorrentes ocorrendo, pode ajudar a prevenir a perda ou corrupção silenciosa de dados.

- **tabela ndbinfo index\_stats.** O NDB 8.0.28 adiciona a tabela `index_stats`, que fornece informações básicas sobre as estatísticas dos índices do NDB. Ela é destinada principalmente para testes internos, mas pode ser útil como complemento ao **ndb\_index\_stat**.

- **Opção ndb\_import --table.** Antes da versão 8.0.28 do NDB, o **ndb\_import** sempre importava os dados lidos de um arquivo CSV em uma tabela cujo nome era derivado do nome do arquivo sendo lido. A versão 8.0.28 adiciona uma opção `--table` (forma abreviada: `-t`) para que este programa especifique diretamente o nome da tabela de destino e substitua o comportamento anterior.

  O comportamento padrão para **ndb\_import** continua sendo usar o nome base do arquivo de entrada como o nome da tabela de destino.

- **Opção ndb\_import --missing-ai-column.** A partir do NDB 8.0.29, o **ndb\_import** pode importar dados de um arquivo CSV que contenha valores vazios para uma coluna `AUTO_INCREMENT`, usando a opção `--missing-ai-column` introduzida nessa versão. A opção pode ser usada com uma ou mais tabelas que contenham essa coluna.

  Para que essa opção funcione, a coluna `AUTO_INCREMENT` no arquivo CSV não deve conter nenhum valor. Caso contrário, a operação de importação não poderá prosseguir.

- **ndb\_import e linhas vazias.** O **ndb\_import** sempre rejeitou quaisquer linhas vazias encontradas em um arquivo CSV de entrada. O NDB 8.0.30 adiciona suporte para importar linhas vazias em uma única coluna, desde que seja possível converter o valor vazio em um valor de coluna.

- **opção ndb\_restore --with-apply-status.** A partir do NDB 8.0.29, é possível restaurar a tabela `ndb_apply_status` a partir de um backup de `NDB`, usando **ndb\_restore** com a opção `--with-apply-status` adicionada nessa versão. Para usar essa opção, você também deve usar `--restore-data` ao invocar **ndb\_restore**.

  `--with-apply-status` restaura todas as linhas da tabela `ndb_apply_status`, exceto a linha que contém `server_id = 0`; para restaurar essa linha, use `--restore-epoch`. Para obter mais informações, consulte a tabela ndb\_apply\_status, conforme a descrição da opção `--with-apply-status`.

- **Acesso SQL a tabelas com índices ausentes.** Antes da versão NDB 8.0.29, quando uma consulta do usuário tentava abrir uma tabela `NDB` com um índice ausente ou quebrado, o servidor MySQL gerava o erro `NDB` `4243` (Índice não encontrado). Essa situação poderia ocorrer quando violações de restrição ou dados ausentes tornavam impossível restaurar um índice em uma tabela `NDB`, e o **ndb\_restore** `--disable-indexes` era usado para restaurar os dados sem o índice.

  A partir do NDB 8.0.29, uma consulta SQL contra uma tabela `NDB` que não possui índices válidos é bem-sucedida se a consulta não utilizar nenhum dos índices ausentes. Caso contrário, a consulta é rejeitada com `ER_NOT_KEYFILE`. Nesse caso, você pode usar `ALTER TABLE ... ALTER INDEX ... INVISIBLE` para impedir que o otimizador do MySQL tente usar o índice ou excluir o índice (e, em seguida, possivelmente recriá-lo) usando as instruções SQL apropriadas.

- Método **NDB API List::clear()**. Os métodos `Dictionary` da API NDB `listEvents()`, `listIndexes()` e `listObjects()` exigem cada um uma referência a um objeto `List` que está vazio. Anteriormente, reutilizar um `List` existente com qualquer um desses métodos era problemático por essa razão. O NDB 8.0.29 facilita isso ao implementar um método `clear()` que remove todos os dados da lista.

  Como parte deste trabalho, o destrutor da classe `List` agora chama `List::clear()` antes de remover quaisquer elementos ou atributos da lista.

- **Tabelas do dicionário NDB em ndbinfo.** O NDB 8.0.29 introduz várias novas tabelas no banco de dados `ndbinfo`, fornecendo informações do `NdbDictionary` que anteriormente exigiam o uso de **ndb\_desc**, **ndb\_select\_all** e outros programas de utilitário **NDB**.

  Dois desses quadros são, na verdade, visualizações. O quadro `hash_maps` fornece informações sobre mapas de hash usados por `NDB`; o quadro `files` mostra informações sobre os arquivos usados para armazenar dados no disco (veja a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”).

  As seis tabelas restantes `ndbinfo` adicionadas no NDB 8.0.29 são tabelas base. Essas tabelas não são ocultas e não são nomeadas usando o prefixo `ndb$`. Essas tabelas estão listadas aqui, com descrições dos objetos representados em cada tabela:

  - `blobs`: Tabelas de blobs usadas para armazenar as partes de tamanho variável das colunas `BLOB` e `TEXT`

  - `dictionary_columns`: Colunas de tabelas `NDB`

  - `dictionary_tables`: `NDB` tabelas

  - `events`: Assinaturas de eventos na API NDB

  - `foreign_keys`: Chaves estrangeiras nas tabelas `NDB`

  - `index_columns`: Índices em tabelas `NDB`

  O NDB 8.0.29 também traz mudanças na implementação do mecanismo de armazenamento `ndbinfo` de chaves primárias para melhorar a compatibilidade com `NdbDictionary`.

- **Plugin ndbcluster e Schema de Desempenho.** A partir da NDB 8.0.29, os tópicos do plugin `ndbcluster` são mostrados nas tabelas `threads` e `setup_threads` do Schema de Desempenho, permitindo obter informações sobre o desempenho desses tópicos. Os três tópicos exibidos nas tabelas `performance_schema` estão listados aqui:

  - `ndb_binlog`: Fundo de registro binário
  - `ndb_index_stat`: Fóssil de estatísticas de índice
  - `ndb_metadata`: Fóssil de metadados

  Veja os Tópicos do Plugin ndbcluster para obter mais informações e exemplos.

  No NDB 8.0.30 e versões posteriores, o uso de memória de lote de transações é visível como `memory/ndbcluster/Thd_ndb::batch_mem_root` nas tabelas do Gerenciamento de Desempenho `memory_summary_by_thread_by_event_name` e `setup_instruments`. Você pode usar essas informações para ver quanto memória está sendo usada pelas transações. Para obter informações adicionais, consulte Uso de Memória de Transações.

- **Tamanho inline de blob configurável.** A partir do NDB 8.0.30, é possível definir o tamanho inline de uma coluna de blob como parte do `CREATE TABLE` ou `ALTER TABLE`. O tamanho inline máximo suportado pelo NDB Cluster é de 29980 bytes.

  Para obter informações adicionais e exemplos, consulte Opções de NDB\_COLUMN, bem como Requisitos de Armazenamento do Tipo de String.

- **A opção replica\_allow\_batching está habilitada por padrão.** O agrupamento de escritas de replicação do NDB Cluster melhora significativamente o desempenho da replicação do NDB Cluster, especialmente ao replicar colunas do tipo blob (`TEXT`, `BLOB` e `JSON`), e, portanto, geralmente deve ser habilitado sempre que se usar a replicação com o NDB Cluster. Por essa razão, a partir do NDB 8.0.30, a variável de sistema `replica_allow_batching` está habilitada por padrão, e definir-a para `OFF` gera uma mensagem de aviso.

- **Suporte à operação de inserção de resolução de conflitos.** Antes da NDB 8.0.30, havia apenas duas estratégias disponíveis para resolver conflitos de chave primária para operações de atualização e exclusão, implementadas como as funções `NDB$MAX()` e `NDB$MAX_DELETE_WIN()`. Nenhuma dessas funções tem efeito em operações de escrita, exceto que uma operação de escrita com a mesma chave primária que uma escrita anterior é sempre rejeitada e aceita e aplicada apenas se nenhuma operação com a mesma chave primária já existir. A NDB 8.0.30 introduz duas novas funções de resolução de conflitos `NDB$MAX_INS()` e `NDB$MAX_DEL_WIN_INS()` que lidam com conflitos de chave primária entre operações de inserção. Essas funções lidam com escritas conflitantes da seguinte forma:

  1. Se não houver uma escrita conflitante, aplique esta (isso é o mesmo que `NDB$MAX()`).

  2. Caso contrário, aplique a resolução de conflitos com o "maior timestamp vence", conforme descrito a seguir:

     1. Se o timestamp da escrita de entrada for maior que o da escrita conflitante, aplique a operação de entrada.

     2. Se o timestamp da escrita de entrada *não* for maior, rejeite a operação de escrita de entrada.

  Para operações de atualização e exclusão conflitantes, `NDB$MAX_INS()` se comporta da mesma forma que `NDB$MAX()` e `NDB$MAX_DEL_WIN_INS()` se comporta da mesma forma que `NDB$MAX_DELETE_WIN()`.

  Essa melhoria oferece suporte para a configuração da detecção de conflitos ao lidar com operações de escrita replicadas conflitantes, de modo que um `INSERT` replicado com um valor de coluna de marcação de tempo mais alto seja aplicado de forma impessoal, enquanto um `INSERT` replicado com um valor de coluna de marcação de tempo mais baixo é rejeitado.

  Assim como nas outras funções de resolução de conflitos, as operações rejeitadas podem ser registradas opcionalmente em uma tabela de exceções; as operações rejeitadas incrementam um contador (variáveis de status `Ndb_conflict_fn_max` para “o maior timestamp vence” e `Ndb_conflict_fn_old` para “o mesmo timestamp vence”).

  Para obter mais informações, consulte as descrições das novas funções de resolução de conflitos e, além da Seção 25.7.12, “Resolução de conflitos de replicação de clúster NDB”.

- **Controle do tamanho do lote do aplicativo de replicação.** Anteriormente, o tamanho do lote usado ao gravar em um NDB Cluster replica era controlado por `--ndb-batch-size`, e o tamanho do lote usado para gravar dados blob na replica era determinado por `ndb-blob-write-batch-bytes`. Um problema com essa configuração era que a replica usava os valores globais dessas variáveis, o que significava que alterar qualquer uma delas para a replica também afetava o valor usado por todas as outras sessões. Além disso, não era possível definir diferentes valores padrão para esses valores exclusivos da replica, que, de preferência, deveriam ter um valor padrão mais alto do que os outros sessões.

  O NDB 8.0.30 adiciona duas novas variáveis de sistema que são específicas para o aplicativo de replicação. A variável `ndb_replica_batch_size` agora controla o tamanho do lote usado pelo aplicativo de replicação, e a variável `ndb_replica_blob_write_batch_bytes` agora determina o tamanho do lote de escrita de blobs usado para realizar escritas de lotes de blobs na replica.

  Essa mudança deve melhorar o comportamento da replicação do MySQL NDB Cluster usando configurações padrão e permitir que o usuário ajuste o desempenho da replicação NDB sem afetar os threads do usuário, como aqueles que realizam o processamento de consultas SQL.

  Para obter mais informações, consulte as descrições das novas variáveis. Veja também a Seção 25.7.5, “Preparando o NDB Cluster para Replicação”.

- **Compressão de Transações de Log Binário.** O NDB 8.0.31 adiciona suporte para logs binários usando transações comprimidas com compressão `ZSTD`. Para habilitar essa funcionalidade, defina a variável de sistema `ndb_log_transaction_compression` introduzida nessa versão para `ON`. O nível de compressão usado pode ser controlado usando a variável de sistema `ndb_log_transaction_compression_level_zstd`, que também é adicionada nessa versão; o nível de compressão padrão é 3.

  Embora as variáveis de sistema de servidor `binlog_transaction_compression` e `binlog_transaction_compression_level_zstd` não tenham efeito no registro binário das tabelas `NDB`, iniciar o **mysqld** com `--binlog-transaction-compression=ON` faz com que o `ndb_log_transaction_compression` seja habilitado automaticamente. Você pode desativá-lo em uma sessão do cliente MySQL usando `SET @@global.ndb_log_transaction_compression=OFF` após o início do servidor ter sido concluído.

  Consulte a descrição de `ndb_log_transaction_compression` e a Seção 7.4.4.5, “Compressão de Transações de Log Binário”, para obter mais informações.

- **Replicação do NDB: Aplicador Multithread.** A partir do NDB 8.0.33, a replicação do NDB suporta o aplicador multithread do MySQL (MTA) em servidores replicados (e valores não nulos de `replica_parallel_workers`), o que permite a aplicação de transações do log binário em paralelo no replicado, aumentando assim o desempenho. (Para mais informações sobre o aplicador multithread no servidor MySQL, consulte a Seção 19.2.3, “Threads de Replicação”.)

  Para habilitar essa funcionalidade na replica, é necessário que a fonte seja iniciada com `--ndb-log-transaction-dependency` definido como `ON` (esta opção também é implementada no NDB 8.0.33). Também é necessário na fonte definir `binlog_transaction_dependency_tracking` como `WRITESET`. Além disso, você deve garantir que `replica_parallel_workers` tenha um valor maior que 1 na replica e, portanto, que a replica use múltiplos threads de trabalho.

  Para obter informações adicionais e requisitos, consulte a Seção 25.7.11, “Replicação de aglomerado NDB usando o aplicativo multithread”.

- **Mudanças nas opções de compilação.** O NDB 8.0.31 faz as seguintes alterações nas opções do CMake usadas para a compilação do MySQL Cluster.

  - A opção `WITH_NDBCLUSTER` está desatualizada e a opção `WITH_PLUGIN_NDBCLUSTER` foi removida.

  - Para construir o MySQL Cluster a partir do código-fonte, use a opção recém-adicionada `WITH_NDB`.

  - O `WITH_NDBCLUSTER_STORAGE_ENGINE` continua sendo suportado, mas não é mais necessário para a maioria das compilações.

  Consulte Opções do CMake para Compilar o NDB Cluster, para obter mais informações.

- **Criptografia do sistema de arquivos.** A Criptografia de Dados Transparente (TDE) oferece proteção através da criptografia dos dados `NDB` em repouso, ou seja, de todos os dados das tabelas `NDB` e arquivos de log que são persistentes no disco. Isso visa proteger contra a recuperação de dados após a obtenção de acesso não autorizado aos arquivos de dados do NDB Cluster, como arquivos de espaço de tabela ou logs.

  A criptografia é implementada de forma transparente pela camada do sistema de arquivos NDB (`NDBFS`) nos nós de dados; os dados são criptografados e descriptografados conforme são lidos e escritos no arquivo, e os blocos internos de clientes `NDBFS` operam sobre os arquivos como de costume.

  `NDBFS` pode criptografar um arquivo de forma transparente diretamente a partir de uma senha fornecida pelo usuário, mas a desconexão da criptografia e descriptografia de arquivos individuais da senha fornecida pelo usuário pode ser vantajosa por razões de eficiência, usabilidade, segurança e flexibilidade. Veja a Seção 25.6.14.2, “Implementação de Criptografia do Sistema de Arquivos NDB”.

  O TDE utiliza dois tipos de chaves. Uma chave secreta é usada para criptografar os dados reais e os arquivos de registro armazenados no disco (incluindo arquivos LCP, redo, undo e tablespace). Uma chave mestre é então usada para criptografar a chave secreta.

  O parâmetro de configuração do nó de dados `EncryptedFileSystem`, disponível a partir do NDB 8.0.29, quando definido como `1`, aplica criptografia aos arquivos que armazenam dados de tabelas. Isso inclui arquivos de dados LCP, arquivos de log de redo, arquivos de espaço de tabela e arquivos de log de desfazer.

  Também é necessário fornecer uma senha para cada nó de dados ao iniciá-lo ou reiniciá-lo, usando uma das opções `--filesystem-password` ou `--filesystem-password-from-stdin`. Veja a Seção 25.6.14.1, “Configuração e Uso da Criptografia do Sistema de Arquivos NDB”. Essa senha usa o mesmo formato e está sujeita às mesmas restrições que a senha usada para um backup criptografado `NDB` (consulte a descrição da opção **ndb\_restore** `--backup-password` para detalhes).

  Somente as tabelas que utilizam o mecanismo de armazenamento `NDB` estão sujeitas à criptografia por meio deste recurso; consulte a Seção 25.6.14.3, “Limitações de Criptografia do Sistema de Arquivos NDB”. Outras tabelas, como as usadas para a distribuição de esquema `NDB`, replicação e registro binário, normalmente utilizam `InnoDB`; consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”. Para informações sobre a criptografia de arquivos de registro binário, consulte a Seção 19.3.2, “Criptografando Arquivos de Registro Binário e Arquivos de Registro de Retransmissão”.

  Os arquivos gerados ou usados pelos processos `NDB`, como logs do sistema operacional, logs de falhas e dumps de núcleo, não são criptografados. Os arquivos usados pelo `NDB`, mas que não contêm dados de nenhuma tabela de usuário, também não são criptografados; esses incluem arquivos de controle LCP, arquivos de esquema e arquivos do sistema (veja o Sistema de Arquivos de Nó de Dados do NDB Cluster). O cache de configuração do servidor de gerenciamento também não é criptografado.

  Além disso, o NDB 8.0.31 adiciona uma nova ferramenta **ndb\_secretsfile\_reader** para extrair informações-chave de um arquivo de segredos (`S0.sysfile`).

  Essa melhoria é baseada no trabalho realizado no NDB 8.0.22 para implementar backups criptografados `NDB`. Para obter mais informações sobre backups criptografados, consulte a descrição do parâmetro de configuração `RequireEncryptedBackup`, bem como a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento de NDB Cluster para Criar um Backup”.

- **Remoção de opções de programas desnecessárias.** Várias opções de linha de comando "desnecessárias" para o utilitário NDB e outros programas que nunca foram implementadas foram removidas no NDB Cluster 8.0.31. As opções e os programas de onde elas foram removidas estão listados aqui:

  - `--ndb-optimized-node-selection`:

    **ndbd**, **ndbmtd**"), **ndb\_mgm**, **ndb\_delete\_all**, **ndb\_desc**, **ndb\_drop\_index**, **ndb\_drop\_table**, **ndb\_show\_table**, **ndb\_blob\_tool**, **ndb\_config**, **ndb\_index\_stat**, **ndb\_move\_data**, **ndbinfo\_select\_all**, **ndb\_select\_count**

  - `--character-sets-dir`:

    **ndb\_mgm**, **ndb\_mgmd**, **ndb\_config**, **ndb\_delete\_all**, **ndb\_desc**, **ndb\_drop\_index**, **ndb\_drop\_table**, **ndb\_show\_table**, **ndb\_blob\_tool**, **ndb\_config**, **ndb\_index\_stat**, **ndb\_move\_data**, **ndbinfo\_select\_all**, **ndb\_select\_count**, **ndb\_waiter**

  - `--core-file`:

    **ndb\_mgm**, **ndb\_mgmd**, **ndb\_config**, **ndb\_delete\_all**, **ndb\_desc**, **ndb\_drop\_index**, **ndb\_drop\_table**, **ndb\_show\_table**, **ndb\_blob\_tool**, **ndb\_config**, **ndb\_index\_stat**, **ndb\_move\_data**, **ndbinfo\_select\_all**, **ndb\_select\_count**, **ndb\_waiter**

  - `--connect-retries` e `--connect-retry-delay`:

    **ndb\_mgmd**

  - `--ndb-nodeid`:

    **ndb\_config**

  Para obter mais informações, consulte as descrições dos programas e opções relevantes na Seção 25.5, “Programas de NDB Cluster”.

- **Leitura de arquivos de cache de configuração.** A partir do NDB 8.0.32, é possível ler arquivos de cache de configuração binários criados pelo **ndb\_mgmd** usando a opção **ndb\_config** `--config-binary-file` introduzida nessa versão. Isso pode simplificar o processo de determinar se as configurações em um arquivo de configuração específico foram aplicadas ao clúster ou de recuperação de configurações do cache binário após o arquivo `config.ini` ter sido danificado ou perdido de alguma forma.

  Para obter mais informações e exemplos, consulte a descrição desta opção na Seção 25.5.7, “ndb\_config — Extrair informações de configuração do NDB Cluster”.

- tabela **ndbinfo transporter\_details.** Esta tabela `ndbinfo` fornece informações sobre os transportadores individuais utilizados em um cluster NDB. Adicionada no NDB 8.0.37, ela é, de outra forma, semelhante à tabela `ndbinfo` `transporters`.

  Várias colunas adicionais foram adicionadas a esta tabela no NDB 8.0.38. Elas estão listadas aqui:

  - `sendbuffer_used_bytes`
  - `sendbuffer_max_used_bytes`
  - `sendbuffer_alloc_bytes`
  - `sendbuffer_max_alloc_bytes`
  - `type`

  Consulte a Seção 25.6.16.64, “A tabela transporter\_details ndbinfo”, para obter mais informações.

- **Tamanho do cache de transações de log binário.** `NDB` 8.0.40 adiciona a variável de sistema de servidor `ndb_log_cache_size`, que permite definir o tamanho do cache de transações usado para gravar o log binário. Isso permite o uso de um cache grande para registrar transações NDB e, (usando `binlog_cache_size`), um cache menor para registrar outras transações, tornando assim o uso de recursos mais eficiente.

- **Deprecacao do arquivo Ndb.cfg.** O uso de um arquivo `Ndb.cfg` para definir a string de conexão para um processo NDB não foi bem documentado ou suportado. A partir do NDB 8.0.40, o uso deste arquivo é agora formalmente desaconselhado; você deve esperar que o suporte a ele seja removido em uma futura versão do MySQL Cluster.

O MySQL Cluster Manager oferece suporte ao NDB Cluster 8.0. O MySQL Cluster Manager possui uma interface de linha de comando avançada que pode simplificar muitas tarefas complexas de gerenciamento do NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 8.0.43 para obter mais informações.
