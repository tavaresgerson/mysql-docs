## 1.3 O que há de novo no MySQL 8.0

Esta seção resume o que foi adicionado, descontinuado e removido no MySQL 8.0. Uma seção complementar lista as opções e variáveis do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 8.0; veja a Seção 1.4, “Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 8.0”.

- Recursos adicionados no MySQL 8.0
- Recursos descontinuados no MySQL 8.0
- Recursos removidos no MySQL 8.0

### Recursos adicionados no MySQL 8.0

As seguintes funcionalidades foram adicionadas ao MySQL 8.0:

- **Dicionário de dados.** O MySQL agora incorpora um dicionário de dados transacional que armazena informações sobre objetos do banco de dados. Em versões anteriores do MySQL, os dados do dicionário eram armazenados em arquivos de metadados e tabelas não transacionais. Para mais informações, consulte o Capítulo 16, *Dicionário de Dados MySQL*.

- **Declarações de definição de dados atômicos (Atomic DDL).** Uma declaração de DDL atômica combina as atualizações do dicionário de dados, as operações do motor de armazenamento e os registros binários associados a uma operação de DDL em uma única transação atômica. Para mais informações, consulte a Seção 15.1.1, “Suporte a Declarações de Definição de Dados Atômicos”.

- **Procedimento de atualização.** Anteriormente, após a instalação de uma nova versão do MySQL, o servidor MySQL atualizava automaticamente as tabelas do dicionário de dados na próxima inicialização, após o que o DBA era esperado para invocar manualmente o **mysql\_upgrade** para atualizar as tabelas do sistema no esquema `mysql`, bem como os objetos em outros esquemas, como o esquema `sys` e os esquemas de usuário.

  A partir do MySQL 8.0.16, o servidor executa as tarefas anteriormente gerenciadas pelo **mysql\_upgrade**. Após a instalação de uma nova versão do MySQL, o servidor agora executa automaticamente todas as tarefas de atualização necessárias na próxima inicialização e não depende do DBA de invocar o **mysql\_upgrade**. Além disso, o servidor atualiza o conteúdo das tabelas de ajuda (algo que o **mysql\_upgrade** não fazia). Uma nova opção de servidor `--upgrade` oferece controle sobre como o servidor executa operações automáticas de dicionário de dados e atualização do servidor. Para mais informações, consulte a Seção 3.4, “O que o processo de atualização do MySQL atualiza”.

- **Reutilização de Sessões.** O MySQL Server agora suporta a reutilização de sessões SSL por padrão com um ajuste de tempo limite para controlar por quanto tempo o servidor mantém um cache de sessão que estabelece o período durante o qual um cliente é permitido solicitar a reutilização de sessão para novas conexões. Todos os programas de cliente MySQL suportam a reutilização de sessões. Para informações de configuração do lado do servidor e do lado do cliente, consulte a Seção 8.3.5, “Reutilizando Sessões SSL”.

  Além disso, as aplicações C agora podem usar as capacidades da API C para permitir a reutilização de sessões para conexões criptografadas (veja Reutilização de Sessão SSL).

- **Segurança e gerenciamento de contas.** Essas melhorias foram adicionadas para melhorar a segurança e permitir maior flexibilidade do DBA no gerenciamento de contas:

  - O MySQL Enterprise Audit agora suporta o uso do componente agendador para configurar e executar uma tarefa recorrente para limpar o cache de memória. Para obter instruções de configuração, consulte Habilitar a Tarefa de Limpeza do Log de Auditoria.

  - Uma nova variável do sistema de validação de senha permite a configuração e a aplicação de um número mínimo de caracteres que os usuários devem alterar ao tentar substituir suas próprias senhas de conta MySQL. Esta nova configuração de verificação é uma porcentagem dos caracteres totais da senha atual. Por exemplo, se `validate_password.changed_characters_percentage` tiver um valor de 50, pelo menos metade dos caracteres da senha da conta de substituição não deve estar presente na senha atual, ou a senha será rejeitada. Para mais informações, consulte a Seção 8.4.3, “O Componente de Validação de Senha”.

  - A Edição Empresarial do MySQL agora oferece capacidades de mascaramento e desidentificação de dados com base em componentes, em vez de se basear em uma biblioteca de plugins que foi introduzida no MySQL 8.0.13. Os componentes de mascaramento e desidentificação de dados do MySQL Enterprise suportam caracteres multibyte, dicionários de mascaramento armazenados em uma tabela de banco de dados e várias novas funções. Para mais informações, consulte a Seção 8.5.1, “Componentes de Mascaramento de Dados versus o Plugin de Mascaramento de Dados”.

  - Antes do MySQL 8.0.33, o banco de dados `mysql` do sistema era usado para o armazenamento persistente de dados de filtro e contas de usuário do MySQL Enterprise Audit. Para maior flexibilidade, a nova variável de sistema `audit_log_database` permite agora especificar outros bancos de dados no namespace do esquema global ao iniciar o servidor. O banco de dados `mysql` é o ajuste padrão para o armazenamento de tabelas.

  - As tabelas de concessão no banco de dados do sistema `mysql` agora são tabelas `InnoDB` (transacionais). Anteriormente, essas tabelas eram tabelas `MyISAM` (não transacionais). A mudança do mecanismo de armazenamento da tabela de concessão está relacionada a uma mudança acompanhante no comportamento das declarações de gerenciamento de contas. Anteriormente, uma declaração de gerenciamento de contas (como `CREATE USER` ou `DROP USER`) que mencionava vários usuários poderia ter sucesso para alguns usuários e falhar para outros. Agora, cada declaração é transacional e tem sucesso para todos os usuários mencionados ou é revertida e não tem efeito se ocorrer algum erro. A declaração é escrita no log binário se tiver sucesso, mas não se falhar; nesse caso, ocorre uma reversão e nenhuma mudança é feita. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômicos”.

  - Um novo plugin de autenticação `caching_sha2_password` está disponível. Assim como o plugin `sha256_password`, o `caching_sha2_password` implementa a hash de senha SHA-256, mas utiliza o cache para resolver problemas de latência no momento da conexão. Ele também suporta mais protocolos de transporte e não requer a vinculação ao OpenSSL para as capacidades de troca de senha com par de chaves RSA. Veja a Seção 8.4.1.2, “Cacheamento de Autenticação Personalizável SHA-2”.

    Os plugins de autenticação `caching_sha2_password` e `sha256_password` oferecem criptografia de senha mais segura do que o plugin `mysql_native_password` (desatualizado na versão 8.0.34), e o `caching_sha2_password` oferece melhor desempenho do que o `sha256_password`. Devido a essas características de segurança e desempenho superiores do `caching_sha2_password`, ele é agora o plugin de autenticação preferido, e também é o plugin de autenticação padrão em vez do `mysql_native_password`. Para obter informações sobre as implicações dessa mudança do plugin padrão para a operação do servidor e a compatibilidade do servidor com clientes e conectores, consulte caching\_sha2\_password como o Plugin de Autenticação Preferido.

  - O plugin de autenticação SASL LDAP da Edição Empresarial do MySQL agora suporta o GSSAPI/Kerberos como método de autenticação para clientes e servidores MySQL no Linux. Isso é útil em ambientes Linux onde as aplicações acessam o LDAP usando o Microsoft Active Directory, que tem o Kerberos habilitado por padrão. Veja Métodos de Autenticação LDAP.

  - A Edição Empresarial do MySQL agora suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando o Kerberos, desde que os ingressos Kerberos apropriados estejam disponíveis ou possam ser obtidos. Para obter detalhes, consulte a Seção 8.4.1.8, “Autenticação Pluggable Kerberos”.

  - O MySQL agora suporta papéis, que são coleções nomeadas de privilégios. Papéis podem ser criados e removidos. Papéis podem ter privilégios concedidos a eles e revogados. Papéis podem ser concedidos a contas de usuário e revogados delas. Os papéis ativos aplicáveis a uma conta podem ser selecionados entre aqueles concedidos à conta e podem ser alterados durante as sessões dessa conta. Para mais informações, consulte a Seção 8.2.10, “Usando Papéis”.

  - O MySQL agora incorpora o conceito de categorias de contas de usuário, com usuários do sistema e usuários regulares distinguidos de acordo com a presença do privilégio `SYSTEM_USER`. Veja a Seção 8.2.11, “Categorias de Contas”.

  - Anteriormente, não era possível conceder privilégios que se aplicam globalmente, exceto para certos esquemas. Isso agora é possível se a variável de sistema `partial_revokes` estiver habilitada. Veja a Seção 8.2.12, “Restrição de privilégios usando revogações parciais”.

  - A declaração `GRANT` possui uma cláusula `AS user [WITH ROLE]` que especifica informações adicionais sobre o contexto de privilégio a ser usado para a execução da declaração. Essa sintaxe é visível ao nível do SQL, embora seu propósito principal seja permitir a replicação uniforme em todos os nós das restrições de privilégio do concedente impostas por revogações parciais, fazendo com que essas restrições apareçam no log binário. Veja a Seção 15.7.1.6, “Declaração GRANT”.

  - O MySQL agora mantém informações sobre o histórico das senhas, permitindo restrições para a reutilização de senhas anteriores. Os administradores de banco de dados podem exigir que novas senhas não sejam selecionadas a partir de senhas anteriores por um número determinado de alterações de senha ou por um período de tempo. É possível estabelecer políticas de reutilização de senha globalmente, bem como por conta de cada conta.

    Agora é possível exigir que as tentativas de alterar senhas de conta sejam verificadas, especificando a senha atual a ser substituída. Isso permite que os administradores de banco de dados impeçam que os usuários mudem a senha sem comprovar que conhecem a senha atual. É possível estabelecer políticas de verificação de senha globalmente, bem como por conta de cada usuário.

    Agora, as contas podem ter senhas duplas, o que permite que as mudanças de senha sejam realizadas de forma contínua em sistemas complexos com múltiplos servidores, sem interrupções.

    O MySQL agora permite que os administradores configurem contas de usuário de forma que falhas consecutivas de login devido a senhas incorretas causem bloqueio temporário da conta. O número necessário de falhas e o tempo de bloqueio são configuráveis por conta.

    Essas novas funcionalidades oferecem aos DBAs um controle mais completo sobre a gestão de senhas. Para mais informações, consulte a Seção 8.2.15, “Gestão de Senhas”.

  - O MySQL agora suporta o modo FIPS, se compilado com o OpenSSL, e uma biblioteca OpenSSL e o Módulo de Objeto FIPS estão disponíveis em tempo de execução. O modo FIPS impõe condições às operações criptográficas, como restrições a algoritmos de criptografia aceitáveis ou requisitos para comprimentos de chave mais longos. Veja a Seção 8.8, “Suporte FIPS”.

  - O contexto TLS que o servidor usa para novas conexões agora é reconfigurável em tempo de execução. Essa capacidade pode ser útil, por exemplo, para evitar reiniciar um servidor MySQL que está em execução há tanto tempo que seu certificado SSL expirou. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas.

  - O OpenSSL 1.1.1 suporta o protocolo TLS v1.3 para conexões criptografadas, e o MySQL 8.0.16 e versões posteriores também suportam o TLS v1.3, desde que o servidor e o cliente sejam compilados com o OpenSSL 1.1.1 ou versões superiores. Consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  - Agora, o MySQL define o controle de acesso concedido aos clientes no tubo nomeado para o mínimo necessário para uma comunicação bem-sucedida no Windows. O novo software do cliente MySQL pode abrir conexões de tubo nomeado sem nenhuma configuração adicional. Se o software do cliente mais antigo não puder ser atualizado imediatamente, a nova variável de sistema `named_pipe_full_access_group` pode ser usada para dar ao grupo do Windows as permissões necessárias para abrir uma conexão de tubo nomeado. A associação ao grupo de acesso total deve ser restrita e temporária.

  - Anteriormente, as contas de usuário do MySQL eram autenticadas no servidor usando um único método de autenticação. A partir do MySQL 8.0.27, o MySQL suporta a autenticação multifator (MFA), o que permite criar contas com até três métodos de autenticação. O suporte à MFA implica nessas mudanças:

    - A sintaxe `CREATE USER` e `ALTER USER` foi estendida para permitir a especificação de múltiplos métodos de autenticação.

    - A variável de sistema `authentication_policy` permite que a política de MFA seja estabelecida controlando quantos fatores podem ser usados e os tipos de autenticação permitidos para cada fator. Isso coloca restrições sobre como as cláusulas relacionadas à autenticação das declarações `CREATE USER` e `ALTER USER` podem ser usadas.

    - Os programas do cliente têm novas opções de linha de comando `--password1`, `--password2` e `--password3` para especificar múltiplas senhas. Para aplicativos que utilizam a API C, a nova opção `MYSQL_OPT_USER_PASSWORD` para a função `mysql_options4()` da API C habilita a mesma capacidade.

    Além disso, a Edição Empresarial do MySQL agora suporta autenticação ao Servidor MySQL usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos. Esse método de autenticação é baseado no padrão Fast Identity Online (FIDO) e utiliza um par de plugins, `authentication_fido` no lado do servidor e `authentication_fido_client` no lado do cliente. O plugin de autenticação FIDO no lado do servidor é incluído apenas nas distribuições da Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. No entanto, o plugin do lado do cliente está incluído em todas as distribuições, incluindo as comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor carregado.

    A autenticação multifator pode usar métodos de autenticação MySQL existentes, o novo método de autenticação FIDO ou uma combinação de ambos. Para mais informações, consulte a Seção 8.2.18, “Autenticação Multifator”, e a Seção 8.4.1.11, “FIDO Pluggable Authentication”.

- **Gestão de recursos.** O MySQL agora suporta a criação e a gestão de grupos de recursos e permite atribuir threads que estão em execução no servidor a grupos específicos, para que as threads sejam executadas de acordo com os recursos disponíveis para o grupo. Os atributos do grupo permitem controlar os seus recursos, para habilitar ou restringir o consumo de recursos pelas threads do grupo. Os administradores de banco de dados podem modificar esses atributos conforme apropriado para diferentes cargas de trabalho. Atualmente, o tempo de CPU é um recurso gerenciável, representado pelo conceito de “CPU virtual” como um termo que inclui núcleos de CPU, hiperthreads, threads de hardware, e assim por diante. O servidor determina, ao iniciar, quantos CPUs virtuais estão disponíveis, e os administradores de banco de dados com privilégios apropriados podem associar essas CPUs a grupos de recursos e atribuir threads a grupos. Para mais informações, consulte a Seção 7.1.16, “Grupos de Recursos”.

- **Gerenciamento de criptografia de tabela.** A criptografia de tabela agora pode ser gerenciada globalmente definindo e aplicando padrões de criptografia. A variável `default_table_encryption` define um padrão de criptografia para esquemas e espaços de tabelas criados recentemente. O padrão de criptografia para um esquema também pode ser definido usando a cláusula `DEFAULT ENCRYPTION` ao criar um esquema. Por padrão, uma tabela herda a criptografia do esquema ou espaço de tabelas em que é criada. Os padrões de criptografia são aplicados ao habilitar a variável `table_encryption_privilege_check`. A verificação de privilégio ocorre ao criar ou alterar um esquema ou espaço de tabelas com uma configuração de criptografia diferente da configuração `default_table_encryption`, ou ao criar ou alterar uma tabela com uma configuração de criptografia diferente da criptografia padrão do esquema. O privilégio `TABLE_ENCRYPTION_ADMIN` permite a supressão de configurações de criptografia padrão quando `table_encryption_privilege_check` está habilitado. Para mais informações, consulte Definindo um padrão de criptografia para esquemas e espaços de tabelas gerais.

- Melhorias do InnoDB. Essas `InnoDB` melhorias foram adicionadas:

  - O valor atual do contador de incremento automático é escrito no log de refazer cada vez que o valor muda e salvo em uma tabela do sistema privada do motor em cada ponto de verificação. Essas alterações tornam o valor atual do contador de incremento automático persistente após reinicializações do servidor. Além disso:

    - Um reinício do servidor não cancela mais o efeito da opção da tabela `AUTO_INCREMENT = N`. Se você inicializar o contador de autoincremento para um valor específico ou alterar o valor do contador de autoincremento para um valor maior, o novo valor é persistido em reinícios do servidor.

    - Um reinício do servidor imediatamente após uma operação `ROLLBACK` já não resulta na reutilização dos valores de autoincremento que foram alocados para a transação revertida.

    - Se você modificar o valor de uma coluna `AUTO_INCREMENT` para um valor maior que o valor máximo atual de autoincremento (por exemplo, em uma operação `UPDATE`), o novo valor é persistido, e as operações subsequentes `INSERT` alocam valores de autoincremento a partir do novo valor maior.

    Para obter mais informações, consulte a Seção 17.6.1.6, “Tratamento do AUTO\_INCREMENT no InnoDB” e Inicialização do Contador AUTO\_INCREMENT do InnoDB.

  - Quando ocorre a corrupção da árvore de índices, o `InnoDB` escreve uma bandeira de corrupção no log de refazer, o que torna a corrupção segura. O `InnoDB` também escreve dados da bandeira de corrupção na memória em uma tabela do sistema privada do motor em cada ponto de verificação. Durante a recuperação, o `InnoDB` lê as bandeiras de corrupção de ambos os locais e combina os resultados antes de marcar as tabelas e objetos de índice na memória como corrompidos.

  - O plugin `InnoDB` **memcached** suporta várias operações `get` (recuperação de múltiplos pares chave-valor em uma única consulta **memcached**) e consultas de intervalo. Veja a Seção 17.20.4, “Suporte a consultas de intervalo e get múltiplos do memcached do InnoDB”.

  - Uma nova variável dinâmica, `innodb_deadlock_detect`, pode ser usada para desativar a detecção de impasses. Em sistemas de alta concorrência, a detecção de impasses pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desativar a detecção de impasses e confiar na configuração `innodb_lock_wait_timeout` para o rollback de transações quando um impasse ocorre.

  - A nova tabela do esquema de informações `INNODB_CACHED_INDEXES` relata o número de páginas de índice armazenadas em cache no pool de buffer `InnoDB` para cada índice.

  - Agora, as tabelas temporárias `InnoDB` são criadas no espaço de tabelas temporárias compartilhado `ibtmp1`.

  - O recurso de criptografia do espaço de tabelas `InnoDB` suporta a criptografia dos dados do log de reversão e do log de desfazer. Consulte Criptografia de Log de Reversão e Criptografia de Log de Desfazer.

  - `InnoDB` suporta as opções `NOWAIT` e `SKIP LOCKED` com os bloqueios de instruções de leitura `SELECT ... FOR SHARE` e `SELECT ... FOR UPDATE`. `NOWAIT` faz com que a instrução retorne imediatamente se uma linha solicitada for bloqueada por outra transação. `SKIP LOCKED` remove as linhas bloqueadas do conjunto de resultados. Veja Bloqueio de Concorrência de Leitura com NOWAIT e SKIP LOCKED.

    `SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE`, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa. As declarações são equivalentes. No entanto, `FOR UPDATE` e `FOR SHARE` suportam as opções `NOWAIT`, `SKIP LOCKED` e `OF tbl_name`. Veja a Seção 15.2.13, “Declaração SELECT”.

    `OF tbl_name` aplica consultas de bloqueio a tabelas nomeadas.

  - As opções `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION` e `REBUILD PARTITION` são suportadas pelas APIs nativas de particionamento in-place e podem ser usadas com as cláusulas `ALGORITHM={COPY|INPLACE}` e `LOCK`.

    `DROP PARTITION` com `ALGORITHM=INPLACE` exclui os dados armazenados na partição e elimina a partição. No entanto, `DROP PARTITION` com `ALGORITHM=COPY` ou `old_alter_table=ON` reconstrui a tabela particionada e tenta mover os dados da partição eliminada para outra partição com uma definição `PARTITION ... VALUES` compatível. Os dados que não podem ser movidos para outra partição são excluídos.

  - O mecanismo de armazenamento `InnoDB` agora usa o dicionário de dados do MySQL em vez do dicionário de dados específico do mecanismo de armazenamento. Para obter informações sobre o dicionário de dados, consulte o Capítulo 16, *Dicionário de Dados do MySQL*.

  - As tabelas do sistema `mysql` e as tabelas do dicionário de dados agora são criadas em um único arquivo de espaço de tabelas `InnoDB`, chamado `mysql.ibd`, no diretório de dados do MySQL. Anteriormente, essas tabelas eram criadas em arquivos de espaço de tabelas `InnoDB` individuais no diretório do banco de dados `mysql`.

  - As seguintes tabelas de desfazer são introduzidas no MySQL 8.0:

    - Por padrão, os registros de desfazer agora residem em dois espaços de tabelas de desfazer criados quando a instância do MySQL é inicializada. Os registros de desfazer não são mais criados no espaço de tabelas do sistema.

    - A partir do MySQL 8.0.14, é possível criar espaços de tabelas de desfazer em um local escolhido durante a execução usando a sintaxe `CREATE UNDO TABLESPACE`.

      ```
      CREATE UNDO TABLESPACE tablespace_name ADD DATAFILE 'file_name.ibu';
      ```

      As tabelas espaços criadas usando a sintaxe `CREATE UNDO TABLESPACE` podem ser excluídas em tempo de execução usando a sintaxe `DROP UNDO TABLESPACE`.

      ```
      DROP UNDO TABLESPACE tablespace_name;
      ```

      A sintaxe `ALTER UNDO TABLESPACE` pode ser usada para marcar um espaço de tabela de desfazer como ativo ou inativo.

      ```
      ALTER UNDO TABLESPACE tablespace_name SET {ACTIVE|INACTIVE};
      ```

      Uma coluna `STATE` que mostra o estado de um tablespace foi adicionada à tabela Schema de Informações `INNODB_TABLESPACES`. Um tablespace de desfazer deve estar em um estado `empty` antes que possa ser excluído.

    - A variável `innodb_undo_log_truncate` está habilitada por padrão.

    - A variável `innodb_rollback_segments` define o número de segmentos de rollback por espaço de tabelas de desfazer. Anteriormente, `innodb_rollback_segments` especificava o número total de segmentos de rollback para a instância do MySQL. Essa mudança aumenta o número de segmentos de rollback disponíveis para transações concorrentes. Mais segmentos de rollback aumenta a probabilidade de que transações concorrentes usem segmentos de rollback separados para os registros de desfazer, resultando em menos disputa de recursos.

  - Os valores padrão para variáveis que afetam o comportamento de pré-limpeza e limpeza do pool de tampão foram modificados:

    - O valor padrão `innodb_max_dirty_pages_pct_lwm` agora é 10. O valor padrão anterior de 0 desativa o pré-limpeza do pool de buffers. Um valor de 10 habilita a pré-limpeza quando a porcentagem de páginas sujas no pool de buffers excede 10%. A habilitação da pré-limpeza melhora a consistência do desempenho.

    - O valor padrão `innodb_max_dirty_pages_pct` foi aumentado de 75 para 90. `InnoDB` tenta limpar os dados do pool de buffer para que a porcentagem de páginas sujas não exceda esse valor. O valor padrão aumentado permite uma maior porcentagem de páginas sujas no pool de buffer.

  - O ajuste padrão `innodb_autoinc_lock_mode` é agora 2 (interlaçado). O modo de bloqueio interlaçado permite a execução de inserções de várias linhas em paralelo, o que melhora a concorrência e a escalabilidade. O novo ajuste padrão `innodb_autoinc_lock_mode` reflete a mudança da replicação baseada em declarações para a replicação baseada em linhas como o tipo de replicação padrão no MySQL 5.7. A replicação baseada em declarações requer o modo de bloqueio de incremento automático consecutivo (o ajuste padrão anterior) para garantir que os valores de incremento automático sejam atribuídos em uma ordem previsível e repetiível para uma sequência específica de declarações SQL, enquanto a replicação baseada em linhas não é sensível à ordem de execução das declarações SQL. Para mais informações, consulte Modos de bloqueio de AUTO\_INCREMENT do InnoDB.

    Para sistemas que utilizam replicação baseada em declarações, o novo ajuste padrão `innodb_autoinc_lock_mode` pode comprometer aplicativos que dependem de valores de autoincremento sequenciais. Para restaurar o padrão anterior, defina `innodb_autoinc_lock_mode` para 1.

  - O renomeamento de um espaço de tabelas geral é suportado pela sintaxe `ALTER TABLESPACE ... RENAME TO`.

  - A opção de servidor `--innodb-dedicated-server`, que está desativada por padrão, pode ser usada para que os valores das seguintes variáveis de sistema sejam definidos automaticamente pelo `InnoDB` de acordo com a quantidade de memória detectada no servidor:

    - `innodb_buffer_pool_size`
    - `innodb_log_file_size`
    - `innodb_flush_method`

    Esta opção é destinada às instâncias do servidor MySQL que são executadas em um servidor dedicado. Para obter mais informações, consulte a Seção 17.8.12, “Habilitar a Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

  - A nova visão do esquema de informações `INNODB_TABLESPACES_BRIEF` fornece dados de espaço, nome, caminho, bandeira e tipo de espaço para os espaços de tabelas `InnoDB`.

  - A versão da biblioteca zlib incluída no MySQL foi elevada da versão 1.2.3 para a versão 1.2.11. O MySQL implementa a compressão com a ajuda da biblioteca zlib.

    Se você estiver usando tabelas compactadas `InnoDB` consulte a Seção 3.5, “Alterações no MySQL 8.0” para entender as implicações relacionadas à atualização.

  - As informações do dicionário serializadas (SDI) estão presentes em todos os arquivos de espaço de tabela `InnoDB`, exceto nos arquivos de espaço de tabela temporário global e espaço de tabela de desfazer. O SDI é metadados serializados para objetos de tabela e espaço de tabela. A presença de dados SDI fornece redundância de metadados. Por exemplo, os metadados do objeto do dicionário podem ser extraídos dos arquivos de espaço de tabela se o dicionário de dados ficar indisponível. A extração de SDI é realizada usando a ferramenta **ibd2sdi**. Os dados SDI são armazenados no formato `JSON`.

    A inclusão de dados SDI em arquivos de tablespace aumenta o tamanho do arquivo de tablespace. Um registro SDI requer uma única página de índice, que tem 16 KB de tamanho por padrão. No entanto, os dados SDI são compactados quando armazenados para reduzir a pegada de armazenamento.

  - O mecanismo de armazenamento `InnoDB` agora suporta DDL atômico, o que garante que as operações de DDL sejam totalmente comprometidas ou revertidas, mesmo que o servidor seja interrompido durante a operação. Para mais informações, consulte a Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômicos”.

  - Os arquivos do espaço de tabela podem ser movidos ou restaurados para um novo local enquanto o servidor estiver offline usando a opção `innodb_directories`. Para mais informações, consulte a Seção 17.6.3.6, “Movendo Arquivos de Espaço de Tabela Enquanto o Servidor Está Offline”.

  - As seguintes otimizações de registro de refazer foram implementadas:

    - Os tópicos de usuário agora podem escrever simultaneamente no buffer de log sem sincronizar as escritas.

    - Os tópicos de usuários agora podem adicionar páginas sujas à lista de limpeza em uma ordem relaxada.

    - Agora, um fio de registro dedicado é responsável por gravar o buffer de registro nos buffers do sistema, esvaziar os buffers do sistema no disco, notificar os threads do usuário sobre o redo escrito e esvaziado, manter o atraso necessário para a ordem de lista de esvaziamento relaxada e pontos de verificação de escrita.

    - Variáveis do sistema foram adicionadas para configurar o uso do atraso de rotação por threads do usuário que estão aguardando um redo esvaziado:

      - `innodb_log_wait_for_flush_spin_hwm`: Define o tempo médio máximo de esvaziamento do log, após o qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado.

      - `innodb_log_spin_cpu_abs_lwm`: Define o valor mínimo de uso da CPU abaixo do qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado.

      - `innodb_log_spin_cpu_pct_hwm`: Define o valor máximo de uso da CPU acima do qual os threads do usuário não giram mais enquanto aguardam o redo esvaziado.

    - A variável `innodb_log_buffer_size` agora é dinâmica, o que permite o redimensionamento do buffer de log enquanto o servidor estiver em execução.

    Para obter mais informações, consulte a Seção 10.5.4, “Otimização do registro de reinicialização do InnoDB”.

  - A partir do MySQL 8.0.12, o registro de desfazer é suportado para pequenas atualizações de dados de objetos grandes (LOB), o que melhora o desempenho das atualizações de LOB que têm 100 bytes ou menos. Anteriormente, as atualizações de LOB tinham pelo menos uma página de LOB, o que é menos que ideal para atualizações que podem apenas modificar alguns bytes. Essa melhoria é baseada no suporte adicionado no MySQL 8.0.4 para atualização parcial de dados de LOB.

  - A partir do MySQL 8.0.12, o `ALGORITHM=INSTANT` é suportado para as seguintes operações `ALTER TABLE`:

    - Adicionar uma coluna. Esse recurso também é conhecido como “Instant \[\[`ADD COLUMN`] ]”. Aplicam-se limitações. Consulte a Seção 17.12.1, “Operações DDL Online”.

    - Adicionar ou remover uma coluna virtual.

    - Adicionar ou remover um valor padrão de coluna.

    - Modificar a definição de uma coluna `ENUM` ou `SET`.

    - Alterando o tipo de índice.

    - Renomear uma tabela.

    As operações que suportam `ALGORITHM=INSTANT` apenas modificam os metadados no dicionário de dados. Não são tomadas blocadias de metadados na tabela, e os dados da tabela não são afetados, tornando as operações instantâneas. Se não for especificado explicitamente, `ALGORITHM=INSTANT` é usado por padrão por operações que o suportam. Se `ALGORITHM=INSTANT` for especificado, mas não suportado, a operação falhará imediatamente com um erro.

    Para obter mais informações sobre operações que suportam `ALGORITHM=INSTANT`, consulte a Seção 17.12.1, “Operações DDL Online”.

  - A partir do MySQL 8.0.13, o mecanismo de armazenamento `TempTable` suporta o armazenamento de colunas do tipo objeto grande binário (BLOB). Essa melhoria melhora o desempenho para consultas que utilizam tabelas temporárias contendo dados BLOB. Anteriormente, as tabelas temporárias que continham dados BLOB eram armazenadas no mecanismo de armazenamento no disco definido por `internal_tmp_disk_storage_engine`. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  - A partir do MySQL 8.0.13, o recurso de criptografia de dados em repouso `InnoDB` suporta espaços de tabelas gerais. Anteriormente, apenas os espaços de tabelas por arquivo poderiam ser criptografados. Para suportar a criptografia de espaços de tabelas gerais, a sintaxe `CREATE TABLESPACE` e `ALTER TABLESPACE` foi estendida para incluir uma cláusula `ENCRYPTION`.

    A tabela Schema de Informações `INNODB_TABLESPACES` agora inclui uma coluna `ENCRYPTION` que indica se um espaço de tabela está criptografado ou

    O instrumento de estágio do esquema de desempenho `stage/innodb/alter tablespace (encryption)` foi adicionado para permitir o monitoramento das operações de criptografia de tablespace geral.

  - Desativar a variável `innodb_buffer_pool_in_core_file` reduz o tamanho dos arquivos principais excluindo as páginas do pool de buffers `InnoDB`. Para usar essa variável, a variável `core_file` deve estar habilitada e o sistema operacional deve suportar a extensão não POSIX `MADV_DONTDUMP` para `madvise()`, que é suportada no Linux 3.4 e versões posteriores. Para mais informações, consulte a Seção 17.8.3.7, “Excluindo Páginas do Pool de Buffers dos Arquivos Principais”.

  - A partir do MySQL 8.0.13, as tabelas temporárias criadas pelo usuário e as tabelas temporárias internas criadas pelo otimizador são armazenadas em espaços temporários de sessão que são alocados para uma sessão a partir de um conjunto de espaços temporários. Quando uma sessão se desconecta, seus espaços temporários são truncados e liberados de volta ao conjunto. Em versões anteriores, as tabelas temporárias eram criadas no espaço temporário de tabelas global (`ibtmp1`), que não devolvia espaço em disco ao sistema operacional após as tabelas temporárias serem excluídas.

    A variável `innodb_temp_tablespaces_dir` define o local onde as tabelas temporárias de sessão são criadas. O local padrão é o diretório `#innodb_temp` no diretório de dados.

    A tabela `INNODB_SESSION_TEMP_TABLESPACES` fornece metadados sobre os espaços de tabelas temporárias de sessão.

    O espaço de tabela temporário global (`ibtmp1`) agora armazena segmentos de rollback para alterações feitas em tabelas temporárias criadas pelo usuário.

  - A partir do MySQL 8.0.14, o `InnoDB` suporta leituras paralelas de índices agrupados, o que pode melhorar o desempenho do `CHECK TABLE`. Esse recurso não se aplica a varreduras de índices secundários. A variável de sessão `innodb_parallel_read_threads` deve ser definida para um valor maior que 1 para que as leituras paralelas de índices agrupados ocorram. O valor padrão é 4. O número real de threads usados para realizar uma leitura paralela de índice agrupado é determinado pelo ajuste `innodb_parallel_read_threads` ou pelo número de subárvores de índice a serem varridas, o menor dos dois valores.

  - A partir da versão 8.0.14, quando o servidor é iniciado com `--innodb-dedicated-server`, o tamanho e o número de arquivos de log são configurados de acordo com o tamanho do pool de buffers configurado automaticamente. Anteriormente, o tamanho do arquivo de log era configurado de acordo com a quantidade de memória detectada no servidor, e o número de arquivos de log não era configurado automaticamente.

  - A partir da versão 8.0.14, a cláusula `ADD DATAFILE` da declaração `CREATE TABLESPACE` é opcional, o que permite que usuários sem o privilégio `FILE` criem espaços de tabela. Uma declaração `CREATE TABLESPACE` executada sem uma cláusula `ADD DATAFILE` cria implicitamente um arquivo de dados do espaço de tabela com um nome de arquivo único.

  - Por padrão, quando a quantidade de memória ocupada pelo mecanismo de armazenamento TempTable excede o limite de memória definido pela variável `temptable_max_ram`, o mecanismo de armazenamento TempTable começa a alocar arquivos temporários mapeados em memória a partir do disco. A partir do MySQL 8.0.16, esse comportamento é controlado pela variável `temptable_use_mmap`. Desativar `temptable_use_mmap` faz com que o mecanismo de armazenamento TempTable use as tabelas temporárias internas `InnoDB` no disco em vez de arquivos mapeados em memória como seu mecanismo de overflow. Para mais informações, consulte o mecanismo de armazenamento de tabelas temporárias internas.

  - A partir do MySQL 8.0.16, o recurso de criptografia de dados em repouso `InnoDB` suporta a criptografia do espaço de tabelas de sistema `mysql`. O espaço de tabelas de sistema `mysql` contém o banco de dados do sistema `mysql` e as tabelas do dicionário de dados do MySQL. Para mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso InnoDB”.

  - A variável `innodb_spin_wait_pause_multiplier`, introduzida no MySQL 8.0.16, oferece maior controle sobre a duração dos atrasos de verificação de bloqueio de rotação que ocorrem quando um thread aguarda para adquirir um mutex ou um bloqueio rw. Os atrasos podem ser ajustados com mais precisão para levar em conta as diferenças na duração da instrução PAUSE em diferentes arquiteturas de processadores. Para mais informações, consulte a Seção 17.8.8, “Configurando a Verificação de Bloqueio de Rotação”.

  - O desempenho da thread de leitura paralela para grandes conjuntos de dados foi melhorado no MySQL 8.0.17 com uma melhor utilização das threads de leitura, uma redução no I/O das threads de leitura para a atividade de pré-visualização que ocorre durante as varreduras paralelas e suporte para varredura paralela de partições.

    O recurso de leitura em paralelo é controlado pela variável `innodb_parallel_read_threads`. O ajuste máximo é agora de 256, que é o número total de threads para todas as conexões do cliente. Se o limite de threads for atingido, as conexões retornam a usar uma única thread.

  - A variável `innodb_idle_flush_pct`, introduzida no MySQL 8.0.18, permite definir um limite para o esvaziamento de páginas durante períodos de inatividade, o que pode ajudar a prolongar a vida útil dos dispositivos de armazenamento em estado sólido. Veja Limitar o esvaziamento de buffers durante períodos de inatividade.

  - A amostragem eficiente dos dados `InnoDB` para a geração de estatísticas de histogramas é suportada a partir do MySQL 8.0.19. Veja Análise de Estatísticas de Histogramas.

  - A partir do MySQL 8.0.20, a área de armazenamento do buffer de escrita dupla reside em arquivos de escrita dupla. Em versões anteriores, a área de armazenamento residia no espaço de tabelas do sistema. Ao mover a área de armazenamento para fora do espaço de tabelas do sistema, a latência de escrita é reduzida, o desempenho é aumentado e há mais flexibilidade em relação à localização das páginas do buffer de escrita dupla. As seguintes variáveis de sistema foram introduzidas para a configuração avançada do buffer de escrita dupla:

    - `innodb_doublewrite_dir`

      Define o diretório do arquivo de buffer de escrita dupla.

    - `innodb_doublewrite_files`

      Define o número de arquivos de escrita dupla.

    - `innodb_doublewrite_pages`

      Define o número máximo de páginas de escrita dupla por fio para uma escrita em lote.

    - `innodb_doublewrite_batch_size`

      Define o número de páginas de dupla gravação a serem escritas em um lote.

    Para obter mais informações, consulte a Seção 17.6.4, “Buffer de escrita dupla”.

  - O algoritmo de Agendamento de Transações Atento à Concorrência (CATS), que prioriza as transações que estão aguardando por bloqueios, foi aprimorado no MySQL 8.0.20. O cálculo do peso do agendamento de transações agora é realizado em um fio de execução separado, o que melhora o desempenho e a precisão da computação.

    O algoritmo FIFO (First In First Out), que também havia sido usado para agendamento de transações, foi removido. O algoritmo FIFO tornou-se redundante devido às melhorias no algoritmo CATS. O agendamento de transações anteriormente realizado pelo algoritmo FIFO agora é realizado pelo algoritmo CATS.

    Uma coluna `TRX_SCHEDULE_WEIGHT` foi adicionada à tabela `INFORMATION_SCHEMA.INNODB_TRX`, o que permite consultar os pesos de agendamento de transações atribuídos pelo algoritmo CATS.

    Os seguintes contadores `INNODB_METRICS` foram adicionados para monitorar eventos de agendamento de transações em nível de código:

    - `lock_rec_release_attempts`

      O número de tentativas para liberar bloqueios de registro.

    - `lock_rec_grant_attempts`

      O número de tentativas para conceder bloqueios de registro.

    - `lock_schedule_refreshes`

      O número de vezes que o gráfico de espera foi analisado para atualizar os pesos do cronograma de transações.

    Para obter mais informações, consulte a Seção 17.7.6, “Agendamento de Transações”.

  - A partir do MySQL 8.0.21, para melhorar a concorrência para operações que requerem acesso às filas de bloqueio para recursos de tabela e linha, o mutex do sistema de bloqueio (`lock_sys->mutex`) foi substituído por travares divididos, e as filas de bloqueio foram agrupadas em *travas de fila de bloqueio de tabela e página*, com cada trava protegida por um mutex dedicado. Anteriormente, o único mutex do sistema de bloqueio protegia todas as filas de bloqueio, o que era um ponto de conflito em sistemas de alta concorrência. A nova implementação dividida permite um acesso mais granular às filas de bloqueio.

    O sistema de bloqueio mutex (`lock_sys->mutex`) foi substituído pelos seguintes bloqueios divididos:

    - Um gatilho global (`lock_sys->latches.global_latch`) composto por 64 objetos de bloqueio de leitura/escrita (`rw_lock_t`). O acesso a uma fila de bloqueio individual requer um gatilho global compartilhado e um gatilho na partição da fila de bloqueio. As operações que exigem acesso a todas as filas de bloqueio exigem um gatilho global exclusivo, que bloqueia todas as partições das filas de bloqueio de tabela e página.

    - Alçapões de tabela (`lock_sys->latches.table_shards.mutexes`), implementados como um array de 512 mútuos, com cada mútuo dedicado a um dos 512 fragmentos da fila de bloqueio de tabela.

    - Alçapões de página (`lock_sys->latches.page_shards.mutexes`), implementados como um array de 512 mútues, com cada mútuo dedicado a um dos 512 fragmentos da fila de bloqueio de página.

    O instrumento de esquema de desempenho `wait/synch/mutex/innodb/lock_mutex` para monitorar o mutex do sistema de bloqueio único foi substituído por instrumentos para monitorar os novos bloqueios globais, de tabela e de página:

    - `wait/synch/sxlock/innodb/lock_sys_global_rw_lock`
    - `wait/synch/mutex/innodb/lock_sys_table_mutex`
    - `wait/synch/mutex/innodb/lock_sys_page_mutex`

  - A partir do MySQL 8.0.21, os arquivos de dados de tabela e partição de tabela criados fora do diretório de dados usando a cláusula `DATA DIRECTORY` são restritos a diretórios conhecidos por `InnoDB`. Essa mudança permite que os administradores de banco de dados controlem onde os arquivos de dados do espaço de tabela são criados e garante que os arquivos de dados possam ser encontrados durante a recuperação.

    Os arquivos de dados de tabelas de arquivos gerais e por arquivo (arquivos `.ibd`) não podem mais ser criados no diretório do espaço de tabelas de desfazer (`innodb_undo_directory`) a menos que isso seja diretamente conhecido por `InnoDB`.

    Os diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`.

    O truncamento de uma tabela `InnoDB` que reside em um espaço de tabelas por arquivo elimina o espaço de tabelas existente e cria um novo. A partir do MySQL 8.0.21, `InnoDB` cria o novo espaço de tabelas na localização padrão e escreve uma mensagem de aviso no log de erro se o diretório atual do espaço de tabelas for desconhecido. Para que `TRUNCATE TABLE` crie o espaço de tabelas na sua localização atual, adicione o diretório à configuração `innodb_directories` antes de executar `TRUNCATE TABLE`.

  - A partir do MySQL 8.0.21, o registro de redo pode ser ativado e desativado usando a sintaxe `ALTER INSTANCE {ENABLE|DISABLE} INNODB REDO_LOG`. Essa funcionalidade é destinada ao carregamento de dados em uma nova instância do MySQL. Desativar o registro de redo ajuda a acelerar o carregamento de dados, evitando gravações no log de redo.

    O novo privilégio `INNODB_REDO_LOG_ENABLE` permite ativar e desativar o registro de redo.

    A nova variável de estado `Innodb_redo_log_enabled` permite monitorar o status do registro de redo.

    Veja Desativar o registro de refazer.

  - Ao inicializar, `InnoDB` valida os caminhos dos arquivos de espaço de tabela conhecidos contra os caminhos dos arquivos de espaço de tabela armazenados no dicionário de dados, caso os arquivos de espaço de tabela tenham sido movidos para um local diferente. A nova variável `innodb_validate_tablespace_paths`, introduzida no MySQL 8.0.21, permite desabilitar a validação de caminhos de espaço de tabela. Esta funcionalidade é destinada a ambientes onde os arquivos de espaço de tabela não são movidos. Desabilitar a validação de caminhos de espaço de tabela melhora o tempo de inicialização em sistemas com um grande número de arquivos de espaço de tabela.

    Para obter mais informações, consulte a Seção 17.6.3.7, “Desativando a Validação do Caminho do Espaço de Tabela”.

  - A partir do MySQL 8.0.21, em motores de armazenamento que suportam DDL atômico, a instrução `CREATE TABLE ... SELECT` é registrada como uma transação no log binário quando a replicação baseada em linhas está em uso. Anteriormente, ela era registrada como duas transações, uma para criar a tabela e outra para inserir dados. Com essa mudança, as instruções `CREATE TABLE ... SELECT` agora são seguras para a replicação baseada em linhas e permitidas para uso com replicação baseada em GTID. Para mais informações, consulte a Seção 15.1.1, “Suporte à Instrução de Definição de Dados Atômicos”.

  - O truncamento de um espaço de undo em um sistema ocupado pode afetar o desempenho devido às operações de limpeza associadas que removem páginas antigas do espaço de undo do buffer e limpam as páginas iniciais do novo espaço de undo para o disco. Para resolver esse problema, as operações de limpeza foram removidas a partir do MySQL 8.0.21.

    As páginas do espaço de tabela de desfazer são liberadas passivamente à medida que se tornam menos utilizadas recentemente ou são removidas na próxima verificação completa. As páginas iniciais do novo espaço de tabela de desfazer agora são registradas novamente em vez de serem descarregadas no disco durante a operação de truncar, o que também melhora a durabilidade da operação de truncar do espaço de tabela de desfazer.

    Para evitar problemas potenciais causados por um número excessivo de operações de truncação de espaço de undo, as operações de truncação no mesmo espaço de undo entre os pontos de verificação são agora limitadas a 64. Se o limite for excedido, um espaço de undo ainda pode ser tornado inativo, mas não será truncado até após o próximo ponto de verificação.

    Os contadores `INNODB_METRICS` associados às operações de liberação de esvaziamento de desfazer que foram desativadas foram removidos. Os contadores removidos incluem: `undo_truncate_sweep_count`, `undo_truncate_sweep_usec`, `undo_truncate_flush_count` e `undo_truncate_flush_usec`.

    Consulte a Seção 17.6.3.4, "Desfazer Espaços de Tabela".

  - A partir do MySQL 8.0.22, a nova variável `innodb_extend_and_initialize` permite configurar como o `InnoDB` aloca espaço para espaços de tabela por arquivo e espaços de tabela gerais no Linux. Por padrão, quando uma operação requer espaço adicional em um espaço de tabela, o `InnoDB` aloca páginas para o espaço de tabela e escreve fisicamente NULLs nessas páginas. Esse comportamento afeta o desempenho se novas páginas forem alocadas frequentemente. Você pode desabilitar o `innodb_extend_and_initialize` em sistemas Linux para evitar escrever fisicamente NULLs em páginas de espaço de tabela recém-alocadas. Quando o `innodb_extend_and_initialize` é desativado, o espaço é alocado usando chamadas de `posix_fallocate()`, que reservam espaço sem escrever fisicamente NULLs.

    Uma operação `posix_fallocate()` não é atômica, o que permite que uma falha ocorra entre a alocação de espaço para um arquivo de tablespace e a atualização dos metadados do arquivo. Essa falha pode deixar as páginas recém-alocadas em um estado não inicializado, resultando em uma falha quando a `InnoDB` tenta acessar essas páginas. Para evitar esse cenário, a `InnoDB` escreve um registro de log de refazer antes de alocar uma nova página de tablespace. Se uma operação de alocação de página for interrompida, a operação é rejogada a partir do registro de log de refazer durante a recuperação.

  - A partir do MySQL 8.0.23, o `InnoDB` suporta a criptografia de páginas de arquivos de escrita dupla pertencentes a espaços de tabelas criptografados. As páginas são criptografadas usando a chave de criptografia do espaço de tabelas associado. Para mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

  - A variável `temptable_max_mmap`, introduzida no MySQL 8.0.23, define a quantidade máxima de memória que o mecanismo de armazenamento TempTable é autorizado a alocar de arquivos mapeados em memória (MMAP) antes de começar a armazenar dados de tabelas temporárias internas em disco. Um valor de 0 desabilita a alocação de arquivos MMAP. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  - A opção `AUTOEXTEND_SIZE`, introduzida no MySQL 8.0.23, define a quantidade pela qual `InnoDB` estende o tamanho de um espaço de tabela quando ele fica cheio, permitindo que o tamanho do espaço de tabela seja aumentado em incrementos maiores. A opção `AUTOEXTEND_SIZE` é suportada com as instruções `CREATE TABLE`, `ALTER TABLE`, `CREATE TABLESPACE` e `ALTER TABLESPACE`. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND\_SIZE para Espaços de Tabela”.

    Uma coluna do tamanho `AUTOEXTEND_SIZE` foi adicionada à tabela do esquema de informações `INNODB_TABLESPACES`.

  - A variável de sistema `innodb_segment_reserve_factor`, introduzida no MySQL 8.0.26, permite configurar a porcentagem de páginas do segmento de arquivo do espaço de tabela que são reservadas como páginas vazias. Para mais informações, consulte Configurando a porcentagem de páginas reservadas do segmento de arquivo.

  - Em plataformas que suportam chamadas de sistema `fdatasync()`, a variável `innodb_use_fdatasync`, introduzida no MySQL 8.0.26, permite usar `fdatasync()` em vez de `fsync()` para limpezas do sistema operacional. Uma chamada de sistema `fdatasync()` não limpa as alterações no metadados do arquivo, a menos que seja necessário para a recuperação subsequente de dados, proporcionando um potencial benefício de desempenho.

  - A partir do MySQL 8.0.28, a variável `tmp_table_size` define o tamanho máximo de qualquer tabela temporária interna em memória individual criada pelo mecanismo de armazenamento TempTable. Um limite de tamanho apropriado impede que consultas individuais consumam uma quantidade excessiva de recursos globais do TempTable. Veja o Mecanismo de Armazenamento de Tabelas Temporárias Internas.

  - A partir do MySQL 8.0.28, a variável `innodb_open_files`, que define o número de arquivos `InnoDB` que podem estar abertos ao mesmo tempo, pode ser definida em tempo de execução usando uma instrução `SELECT innodb_set_open_files_limit(N)`. A instrução executa um procedimento armazenado que define o novo limite.

    Para evitar que arquivos gerenciados que não são LRU consumam todo o limite `innodb_open_files`, os arquivos gerenciados que não são LRU têm um limite de 90% do limite `innodb_open_files`, que reserva 10% do limite `innodb_open_files` para arquivos gerenciados por LRU.

    O limite `innodb_open_files` inclui arquivos de espaço de tabela temporários, que não eram contabilizados anteriormente.

  - A partir do MySQL 8.0.28, o `InnoDB` suporta as operações do `ALTER TABLE ... RENAME COLUMN` usando o `ALGORITHM=INSTANT`.

    Para obter mais informações sobre isso e outras operações DDL que suportam `ALGORITHM=INSTANT`, consulte a Seção 17.12.1, “Operações DDL Online”.

  - A partir do MySQL 8.0.29, o `InnoDB` suporta as operações do `ALTER TABLE ... DROP COLUMN` usando o `ALGORITHM=INSTANT`.

    Antes do MySQL 8.0.29, uma coluna adicionada instantaneamente só poderia ser adicionada como a última coluna da tabela. A partir do MySQL 8.0.29, uma coluna adicionada instantaneamente pode ser adicionada a qualquer posição na tabela.

    Colunas adicionadas ou excluídas instantaneamente criam uma nova versão da linha afetada. São permitidas até 64 versões de linha. Uma nova coluna `TOTAL_ROW_VERSIONS` foi adicionada à tabela do Schema de Informações `INNODB_TABLES` para rastrear o número de versões de linha.

    Para obter mais informações sobre operações DDL que suportam `ALGORITHM=INSTANT`, consulte a Seção 17.12.1, “Operações DDL Online”.

  - A partir do MySQL 8.0.30, a variável de sistema `innodb_doublewrite` suporta as configurações `DETECT_ONLY` e `DETECT_AND_RECOVER`. Com a configuração `DETECT_ONLY`, o conteúdo da página do banco de dados não é escrito no buffer de dupla gravação, e a recuperação não usa o buffer de dupla gravação para corrigir escritas de página incompletas. Esta configuração leve é destinada apenas ao rastreamento de escritas de página incompletas. A configuração `DETECT_AND_RECOVER` é equivalente à configuração existente `ON`. Para mais informações, consulte a Seção 17.6.4, “Buffer de Dupla Gravação”.

  - A partir do MySQL 8.0.30, o `InnoDB` suporta a configuração dinâmica da capacidade do log de reverso. A variável de sistema `innodb_redo_log_capacity` pode ser definida em tempo de execução para aumentar ou diminuir a quantidade total de espaço em disco ocupada pelos arquivos do log de reverso.

    Com essa mudança, o número de arquivos de registro de revisão e sua localização padrão também foram alterados. A partir do MySQL 8.0.30, o `InnoDB` mantém 32 arquivos de registro de revisão no diretório `#innodb_redo` no diretório de dados. Anteriormente, o `InnoDB` criava dois arquivos de registro de revisão no diretório de dados por padrão, e o número e o tamanho dos arquivos de registro de revisão eram controlados pelas variáveis `innodb_log_files_in_group` e `innodb_log_file_size`. Essas duas variáveis são agora desatualizadas.

    Quando a configuração `innodb_redo_log_capacity` é definida, as configurações `innodb_log_files_in_group` e `innodb_log_file_size` são ignoradas; caso contrário, essas configurações são usadas para calcular a configuração `innodb_redo_log_capacity` (`innodb_log_files_in_group` \* `innodb_log_file_size` = `innodb_redo_log_capacity`). Se nenhuma dessas variáveis for definida, a capacidade do log de refazer é definida pelo valor padrão da `innodb_redo_log_capacity`, que é de 104857600 bytes (100 MB).

    Várias variáveis de status são fornecidas para monitorar o log de reversão e as operações de redimensionamento do log de reversão.

    Para obter mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

  - Com o MySQL 8.0.31, há duas novas variáveis de status para monitorar operações de redimensionamento do pool de buffers online. A variável de status `Innodb_buffer_pool_resize_status_code` relata um código de status que indica a fase de uma operação de redimensionamento do pool de buffers online. A variável de status `Innodb_buffer_pool_resize_status_progress` relata um valor percentual que indica o progresso de cada fase.

    Para obter mais informações, consulte a Seção 17.8.3.1, “Configurando o tamanho do pool de buffers do InnoDB”.

- **Suporte a conjuntos de caracteres.** O conjunto de caracteres padrão mudou de `latin1` para `utf8mb4`. O conjunto de caracteres `utf8mb4` tem várias novas colatações, incluindo `utf8mb4_ja_0900_as_cs`, a primeira colatação específica para o idioma japonês disponível para o Unicode no MySQL. Para mais informações, consulte a Seção 12.10.1, “Conjunto de caracteres Unicode”.

- **Melhorias no JSON.** As seguintes melhorias ou adições foram feitas à funcionalidade JSON do MySQL:

  - Foi adicionado o operador `->>` (caminho inline), que é equivalente a chamar `JSON_UNQUOTE()` no resultado de `JSON_EXTRACT()`.

    Este é um refinamento do operador de caminho de coluna `->`, introduzido no MySQL 5.7; `col->>"$.path"` é equivalente a `JSON_UNQUOTE(col->"$.path")`. O operador de caminho inline pode ser usado sempre que você puder usar `JSON_UNQUOTE(JSON_EXTRACT())`, como listas de colunas `SELECT`, cláusulas `WHERE` e `HAVING` e cláusulas `ORDER BY` e `GROUP BY`. Para mais informações, consulte a descrição do operador, bem como a Sintaxe de Caminho JSON.

  - Foram adicionadas duas funções de agregação JSON `JSON_ARRAYAGG()` e `JSON_OBJECTAGG()`. `JSON_ARRAYAGG()` recebe uma coluna ou expressão como argumento e agrega o resultado como um único array `JSON`. A expressão pode avaliar qualquer tipo de dado MySQL; isso não precisa ser um valor `JSON`. `JSON_OBJECTAGG()` recebe duas colunas ou expressões que interpreta como uma chave e um valor; ele retorna o resultado como um único objeto `JSON`. Para mais informações e exemplos, consulte a Seção 14.19, “Funções de Agregação”.

  - Foi adicionada a função de utilitário JSON `JSON_PRETTY()`, que exibe um valor existente de `JSON` em um formato fácil de ler; cada membro de objeto JSON ou valor de matriz é impresso em uma linha separada, e um objeto ou matriz filho é alinhado 2 espaços à frente do seu pai.

    Essa função também funciona com uma string que pode ser analisada como um valor JSON.

    Para obter informações mais detalhadas e exemplos, consulte a Seção 14.17.8, “Funções de Utilitário JSON”.

  - Ao ordenar os valores de `JSON` em uma consulta usando `ORDER BY`, cada valor é agora representado por uma parte de comprimento variável da chave de ordenação, em vez de uma parte de um tamanho fixo de 1K. Em muitos casos, isso pode reduzir o uso excessivo. Por exemplo, um valor escalar de `INT` ou até mesmo `BIGINT` requer muito poucos bytes, de modo que o restante desse espaço (até 90% ou mais) foi ocupado por preenchimento. Essa mudança traz os seguintes benefícios para o desempenho:

    - O espaço de buffer é agora usado de forma mais eficaz, de modo que os arquivos não precisam ser limpos no disco tão cedo ou com tanta frequência quanto com chaves de classificação de comprimento fixo. Isso significa que mais dados podem ser classificados na memória, evitando o acesso desnecessário ao disco.

    - As teclas mais curtas podem ser comparadas mais rapidamente do que as mais longas, proporcionando uma melhoria notável no desempenho. Isso é verdade tanto para ordenamentos realizados inteiramente na memória quanto para aqueles que exigem a gravação e a leitura de disco.

  - Foi adicionado suporte no MySQL 8.0.2 para atualizações parciais, in loco, dos valores da coluna `JSON`, o que é mais eficiente do que remover completamente um valor JSON existente e escrever um novo no seu lugar, como era feito anteriormente ao atualizar qualquer coluna `JSON`. Para que essa otimização seja aplicada, a atualização deve ser feita usando `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()`. Não é possível adicionar novos elementos ao documento JSON que está sendo atualizado; os valores dentro do documento não podem ocupar mais espaço do que antes da atualização. Consulte Atualizações Parciais de Valores JSON, para uma discussão detalhada dos requisitos.

    Atualizações parciais de documentos JSON podem ser escritas no log binário, ocupando menos espaço do que o registro de documentos JSON completos. Atualizações parciais são sempre registradas como tal quando a replicação baseada em declarações está em uso. Para que isso funcione com a replicação baseada em linhas, você deve primeiro definir `binlog_row_value_options=PARTIAL_JSON`; consulte a descrição desta variável para obter mais informações.

  - Adicionei as funções de utilitário JSON `JSON_STORAGE_SIZE()` e `JSON_STORAGE_FREE()`. `JSON_STORAGE_SIZE()` retorna o espaço de armazenamento em bytes usado para a representação binária de um documento JSON antes de qualquer atualização parcial (veja o item anterior). `JSON_STORAGE_FREE()` mostra a quantidade de espaço restante em uma coluna de tabela do tipo `JSON` após ela ter sido parcialmente atualizada usando `JSON_SET()` ou `JSON_REPLACE()`; este valor é maior que zero se a representação binária do novo valor for menor que a do valor anterior.

    Cada uma dessas funções também aceita uma representação de string válida de um documento JSON. Para tal valor, `JSON_STORAGE_SIZE()` retorna o espaço usado pela sua representação binária após a conversão para um documento JSON. Para uma variável que contém a representação de string de um documento JSON, `JSON_STORAGE_FREE()` retorna zero. Qualquer uma dessas funções produz um erro se o seu argumento (não nulo) não puder ser analisado como um documento JSON válido, e `NULL` se o argumento for `NULL`.

    Para obter mais informações e exemplos, consulte a Seção 14.17.8, “Funções de Utilitário JSON”.

    `JSON_STORAGE_SIZE()` e `JSON_STORAGE_FREE()` foram implementados no MySQL 8.0.2.

  - Foi adicionado suporte no MySQL 8.0.2 para intervalos como `$[1 to 5]` em expressões XPath. Também foi adicionado suporte nesta versão para a palavra-chave `last` e endereçamento relativo, de modo que `$[last]` sempre seleciona o último (com o número mais alto) elemento no array e `$[last-1]` o elemento imediatamente anterior. `last` e expressões que o utilizam também podem ser incluídas em definições de intervalo. Por exemplo, `$[last-2 to last-1]` retorna os dois últimos elementos, mas um deles, de um array. Consulte Procurar e Modificar Valores JSON, para obter informações e exemplos adicionais.

  - Foi adicionada uma função de junção de JSON destinada a conformar-se com o RFC 7396. `JSON_MERGE_PATCH()`, quando usada em 2 objetos JSON, os une em um único objeto JSON que tem como membros uma união dos seguintes conjuntos:

    - Cada membro do primeiro objeto para o qual não há nenhum membro com a mesma chave no segundo objeto.

    - Cada membro do segundo objeto para o qual não há nenhum membro com a mesma chave no primeiro objeto, e cujo valor não é o literal JSON `null`.

    - Cada membro tem uma chave que existe em ambos os objetos e cujo valor no segundo objeto não é o literal JSON \[\[`null`] ].

    Como parte desse trabalho, a função `JSON_MERGE()` foi renomeada para `JSON_MERGE_PRESERVE()`. `JSON_MERGE()` continua sendo reconhecido como um alias para `JSON_MERGE_PRESERVE()` no MySQL 8.0, mas agora é desaconselhado e está sujeito à remoção em uma versão futura do MySQL.

    Para obter mais informações e exemplos, consulte a Seção 14.17.4, “Funções que modificam valores JSON”.

  - Implementou a normalização de chaves duplicadas “a chave duplicada que aparece por último vence”, conforme o RFC 7159 e a maioria dos analisadores de JavaScript. Um exemplo desse comportamento é mostrado aqui, onde apenas o membro mais à direita com a chave `x` é preservado:

    ```
    mysql> SELECT JSON_OBJECT('x', '32', 'y', '[true, false]',
         >                     'x', '"abc"', 'x', '100') AS Result;
    +------------------------------------+
    | Result                             |
    +------------------------------------+
    | {"x": "100", "y": "[true, false]"} |
    +------------------------------------+
    1 row in set (0.00 sec)
    ```

    Os valores inseridos nas colunas `JSON` do MySQL também são normalizados dessa maneira, como mostrado neste exemplo:

    ```
    mysql> CREATE TABLE t1 (c1 JSON);

    mysql> INSERT INTO t1 VALUES ('{"x": 17, "x": "red", "x": [3, 5, 7]}');

    mysql> SELECT c1 FROM t1;
    +------------------+
    | c1               |
    +------------------+
    | {"x": [3, 5, 7]} |
    +------------------+
    ```

    Essa é uma alteração incompatível com as versões anteriores do MySQL, onde um algoritmo de "primeiro duplicado vence" era usado nesses casos.

    Consulte Normalização, Fusão e Autoenrolagem de Valores JSON para obter mais informações e exemplos.

  - Foi adicionada a função `JSON_TABLE()` no MySQL 8.0.4. Essa função aceita dados JSON e os retorna como uma tabela relacional com as colunas especificadas.

    Essa função tem a sintaxe `JSON_TABLE(expr, path COLUMNS column_list) [AS] alias)`, onde `expr` é uma expressão que retorna dados JSON, `path` é um caminho JSON aplicado à fonte e `column_list` é uma lista de definições de coluna. Um exemplo é mostrado aqui:

    ```
    mysql> SELECT *
        -> FROM
        ->   JSON_TABLE(
        ->     '[{"a":3,"b":"0"},{"a":"3","b":"1"},{"a":2,"b":1},{"a":0},{"b":[1,2]}]',
        ->     "$[*]" COLUMNS(
        ->       rowid FOR ORDINALITY,
        ->
        ->       xa INT EXISTS PATH "$.a",
        ->       xb INT EXISTS PATH "$.b",
        ->
        ->       sa VARCHAR(100) PATH "$.a",
        ->       sb VARCHAR(100) PATH "$.b",
        ->
        ->       ja JSON PATH "$.a",
        ->       jb JSON PATH "$.b"
        ->     )
        ->   ) AS  jt1;
    +-------+------+------+------+------+------+--------+
    | rowid | xa   | xb   | sa   | sb   | ja   | jb     |
    +-------+------+------+------+------+------+--------+
    |     1 |    1 |    1 | 3    | 0    | 3    | "0"    |
    |     2 |    1 |    1 | 3    | 1    | "3"  | "1"    |
    |     3 |    1 |    1 | 2    | 1    | 2    | 1      |
    |     4 |    1 |    0 | 0    | NULL | 0    | NULL   |
    |     5 |    0 |    1 | NULL | NULL | NULL | [1, 2] |
    +-------+------+------+------+------+------+--------+
    ```

    A expressão de origem JSON pode ser qualquer expressão que produza um documento JSON válido, incluindo um literal JSON, uma coluna de tabela ou uma chamada de função que retorne JSON, como `JSON_EXTRACT(t1, data, '$.post.comments')`. Para mais informações, consulte a Seção 14.17.6, “Funções de Tabela JSON”.

- **Suporte a tipos de dados.** O MySQL agora suporta o uso de expressões como valores padrão nas especificações de tipos de dados. Isso inclui o uso de expressões como valores padrão para os tipos de dados `BLOB`, `TEXT`, `GEOMETRY` e `JSON`, que anteriormente não podiam ter valores padrão definidos. Para mais detalhes, consulte a Seção 13.6, “Valores padrão de tipos de dados”.

- **Otimizador.** Essas melhorias no otimizador foram adicionadas:

  - O MySQL agora suporta índices invisíveis. Um índice invisível não é usado pelo otimizador, mas é mantido normalmente. Os índices são visíveis por padrão. Os índices invisíveis permitem testar o efeito da remoção de um índice no desempenho da consulta, sem fazer uma alteração destrutiva que deve ser desfeita caso o índice se revele necessário. Veja a Seção 10.3.12, “Indizes Invisíveis”.

  - O MySQL agora suporta índices descendentes: `DESC` em uma definição de índice não é mais ignorado, mas faz com que os valores de chave sejam armazenados em ordem decrescente. Anteriormente, os índices podiam ser pesquisados em ordem inversa, mas com uma penalidade de desempenho. Um índice descendente pode ser pesquisado em ordem direta, o que é mais eficiente. Os índices descendentes também permitem que o otimizador use índices de múltiplos colunas quando a ordem de varredura mais eficiente mistura a ordem crescente para algumas colunas e a ordem decrescente para outras. Veja a Seção 10.3.13, “Índices Descendentes”.

  - O MySQL agora suporta a criação de partes de chave de índice funcional que indexam os valores da expressão em vez dos valores das colunas. As partes de chave funcionais permitem a indexação de valores que não poderiam ser indexados de outra forma, como os valores `JSON`. Para obter detalhes, consulte a Seção 15.1.15, “Instrução CREATE INDEX”.

  - No MySQL 8.0.14 e versões posteriores, as condições triviais `WHERE` que surgem de expressões literais constantes são removidas durante a preparação, em vez de serem removidas mais tarde durante a otimização. A remoção da condição mais cedo no processo permite simplificar as junções para consultas com junções externas que têm condições triviais, como esta:

    ```
    SELECT * FROM t1 LEFT JOIN t2 ON condition_1 WHERE condition_2 OR 0 = 1
    ```

    O otimizador agora percebe durante a preparação que 0 = 1 é sempre falso, tornando `OR 0 = 1` redundante e removendo-o, deixando assim:

    ```
    SELECT * FROM t1 LEFT JOIN t2 ON condition_1 where condition_2
    ```

    Agora, o otimizador pode reescrever a consulta como uma junção interna, assim:

    ```
    SELECT * FROM t1 LEFT JOIN t2 WHERE condition_1 AND condition_2
    ```

    Para obter mais informações, consulte a Seção 10.2.1.9, “Otimização de Conexão Externa”.

  - No MySQL 8.0.16 e versões posteriores, o MySQL pode usar o dobramento constante no momento da otimização para lidar com comparações entre uma coluna e um valor constante, onde o constante está fora de faixa ou na borda de uma faixa em relação ao tipo da coluna, em vez de fazer isso para cada linha no momento da execução. Por exemplo, dada uma tabela `t` com uma coluna `TINYINT UNSIGNED` `c`, o otimizador pode reescrever uma condição como `WHERE c < 256` para `WHERE 1` (e otimizar a condição completamente) ou `WHERE c >= 255` para `WHERE c = 255`.

    Consulte a Seção 10.2.1.14, “Otimização de Dobramento Constante”, para obter mais informações.

  - A partir do MySQL 8.0.16, as otimizações de junção parcial usadas com subconsultas `IN` agora podem ser aplicadas também a subconsultas `EXISTS`. Além disso, o otimizador agora descorrelaciona predicados de igualdade trivialmente correlacionados na condição `WHERE` anexada à subconsulta, para que possam ser tratados de forma semelhante a expressões em subconsultas `IN`; isso se aplica tanto às subconsultas `EXISTS` quanto às `IN`.

    Para obter mais informações, consulte a Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações Semijoin”.

  - A partir do MySQL 8.0.17, o servidor reescreve internamente quaisquer predicados SQL incompletos (ou seja, predicados na forma `WHERE value`, nos quais `value` é o nome de uma coluna ou uma expressão constante e nenhum operador de comparação é usado) durante a fase de contextualização, para que o resolutor de consultas, o otimizador de consultas e o executor de consultas precisem trabalhar apenas com predicados completos.

    Um efeito visível dessa mudança é que, para valores lógicos, a saída `EXPLAIN` agora mostra `true` e `false`, em vez de `1` e `0`.

    Outro efeito dessa mudança é que a avaliação de um valor JSON em um contexto booleano SQL realiza uma comparação implícita contra o inteiro JSON 0. Considere a tabela criada e preenchida conforme mostrado aqui:

    ```
    mysql> CREATE TABLE test (id INT, col JSON);

    mysql> INSERT INTO test VALUES (1, '{"val":true}'), (2, '{"val":false}');
    ```

    Anteriormente, o servidor tentava converter um valor extraído de `true` ou `false` para um booleano SQL ao compará-lo em um contexto booleano SQL, conforme demonstrado pela seguinte consulta usando `IS TRUE`:

    ```
    mysql> SELECT id, col, col->"$.val" FROM test WHERE col->"$.val" IS TRUE;
    +------+---------------+--------------+
    | id   | col           | col->"$.val" |
    +------+---------------+--------------+
    |    1 | {"val": true} | true         |
    +------+---------------+--------------+
    ```

    No MySQL 8.0.17 e versões posteriores, a comparação implícita do valor extraído com o inteiro JSON 0 resulta em um resultado diferente:

    ```
    mysql> SELECT id, col, col->"$.val" FROM test WHERE col->"$.val" IS TRUE;
    +------+----------------+--------------+
    | id   | col            | col->"$.val" |
    +------+----------------+--------------+
    |    1 | {"val": true}  | true         |
    |    2 | {"val": false} | false        |
    +------+----------------+--------------+
    ```

    A partir do MySQL 8.0.21, você pode usar `JSON_VALUE()` no valor extraído para realizar a conversão de tipo antes de realizar o teste, como mostrado aqui:

    ```
    mysql> SELECT id, col, col->"$.val" FROM test
        ->     WHERE JSON_VALUE(col, "$.val" RETURNING UNSIGNED) IS TRUE;
    +------+---------------+--------------+
    | id   | col           | col->"$.val" |
    +------+---------------+--------------+
    |    1 | {"val": true} | true         |
    +------+---------------+--------------+
    ```

    Além disso, a partir do MySQL 8.0.21, o servidor fornece a seguinte mensagem de aviso: "Ao avaliar um valor JSON em um contexto booleano SQL, uma comparação implícita é feita com o número inteiro JSON 0. Se isso não for o que você deseja, considere converter o JSON para um tipo numérico SQL usando JSON\_VALUE RETURNING ao comparar valores extraídos em um contexto booleano SQL dessa maneira."

  - No MySQL 8.0.17 e versões posteriores, uma condição `WHERE` com `NOT IN (subquery)` ou `NOT EXISTS (subquery)` é transformada internamente em um antijoin. (Um antijoin retorna todas as linhas da tabela para as quais não há nenhuma linha na tabela à qual está sendo unido que corresponda à condição de junção.) Isso remove a subconsulta, o que pode resultar em uma execução mais rápida da consulta, pois as tabelas da subconsulta agora são tratadas no nível superior.

    Isso é semelhante e reutiliza a otimização existente `IS NULL` (`Not exists`) para junções externas; veja Informações Adicionais do EXPLAIN.

  - A partir do MySQL 8.0.21, uma instrução de tabela única `UPDATE` ou `DELETE` pode, em muitos casos, utilizar uma transformação de semijoin ou materialização de subconsulta. Isso se aplica a instruções das formas mostradas aqui:

    - `UPDATE t1 SET t1.a=value WHERE t1.a IN (SELECT t2.a FROM t2)`

    - `DELETE FROM t1 WHERE t1.a IN (SELECT t2.a FROM t2)`

    Isso pode ser feito para uma reunião de `UPDATE` ou `DELETE` de uma única mesa que atenda às seguintes condições:

    - A declaração `UPDATE` ou `DELETE` usa uma subconsulta com um predicado `[NOT] IN` ou `[NOT] EXISTS`.

    - A declaração não tem cláusula `ORDER BY` e não tem cláusula `LIMIT`.

      (As versões de mesa múltipla de `UPDATE` e `DELETE` não suportam `ORDER BY` ou `LIMIT`.)

    - A tabela de destino não suporta a remoção de leitura antes da escrita (relevante apenas para as tabelas `NDB`).

    - A materialização por junção parcial ou subconsulta é permitida, com base em quaisquer dicas contidas na subconsulta e no valor de `optimizer_switch`.

    Quando a otimização de junção parcial é usada para uma única tabela `DELETE` ou `UPDATE` elegível, isso é visível na traça do otimizador: para uma declaração de várias tabelas, há um objeto `join_optimization` na traça, enquanto não há nenhum para uma declaração de uma única tabela. A conversão também é visível na saída de `EXPLAIN FORMAT=TREE` ou `EXPLAIN ANALYZE`; uma declaração de uma única tabela mostra `<not executable by iterator executor>`, enquanto uma declaração de várias tabelas relata um plano completo.

    Além disso, a partir do MySQL 8.0.21, as leituras semi-consistentes são suportadas por instruções multitabela `UPDATE` usando tabelas `InnoDB`, para níveis de isolamento de transação mais fracos do que `REPEATABLE READ`.

  - **Melhoria no desempenho da junção hash.** O MySQL 8.0.23 reimplementa a tabela hash usada para junções hash, resultando em várias melhorias no desempenho da junção hash. Esse trabalho inclui uma correção para um problema (Bug #31516149, Bug #99933) em que apenas aproximadamente 2/3 da memória alocada para o buffer de junção (`join_buffer_size`) poderia realmente ser usada por uma junção hash.

    A nova tabela hash é geralmente mais rápida que a antiga e usa menos memória para alinhamento, chaves/valores e em cenários em que há muitas chaves iguais. Além disso, o servidor agora pode liberar memória antiga quando o tamanho da tabela hash aumenta.

- **Expressões comuns de tabela.** O MySQL agora suporta expressões comuns de tabela, tanto não-recursivas quanto recursivas. As expressões comuns de tabela permitem o uso de conjuntos de resultados temporários nomeados, implementados permitindo uma cláusula `WITH`") antes das instruções `SELECT` e de certas outras instruções. Para mais informações, consulte a Seção 15.2.20, “Com (Expressões Comuns de Tabela”)”).

  A partir do MySQL 8.0.19, a parte recursiva `SELECT` de uma expressão comum recursiva de tabela (CTE) suporta uma cláusula `LIMIT`. `LIMIT` com `OFFSET` também é suportado. Consulte Expressões Comuns de Tabela Recursivas para obter mais informações.

- **Funções de janela.** O MySQL agora suporta funções de janela que, para cada linha de uma consulta, realizam um cálculo usando linhas relacionadas a essa linha. Essas funções incluem funções como `RANK()`, `LAG()` e `NTILE()`. Além disso, várias funções agregadas existentes agora podem ser usadas como funções de janela (por exemplo, `SUM()` e `AVG()`). Para mais informações, consulte a Seção 14.20, “Funções de Janela”.

- **Tabelas derivadas laterais.** Uma tabela derivada agora pode ser precedida pela palavra-chave `LATERAL` para especificar que é permitido referenciar (depender) de colunas de tabelas anteriores na mesma cláusula `FROM`. As tabelas derivadas laterais possibilitam certas operações SQL que não podem ser realizadas com tabelas derivadas não laterais ou que exigem soluções menos eficientes. Veja a Seção 15.2.15.9, “Tabelas Derivadas Laterais”.

- **Aliases em declarações DELETE de uma única tabela.** No MySQL 8.0.16 e versões posteriores, as declarações `DELETE` de uma única tabela suportam o uso de aliases de tabela.

- Suporte a expressões regulares. Anteriormente, o MySQL usava a biblioteca de expressões regulares de Henry Spencer para suportar operadores de expressões regulares (`REGEXP`, `RLIKE`). O suporte a expressões regulares foi reimplementado usando os Componentes Internacionais para Unicode (ICU), que oferece suporte completo ao Unicode e é seguro para multibyte. A função `REGEXP_LIKE()` realiza a correspondência de expressões regulares da maneira dos operadores `REGEXP` e `RLIKE`, que agora são sinônimos dessa função. Além disso, as funções `REGEXP_INSTR()`, `REGEXP_REPLACE()` e `REGEXP_SUBSTR()` estão disponíveis para encontrar posições de correspondência e realizar substituição e extração de substratos, respectivamente. As variáveis de sistema `regexp_stack_limit` e `regexp_time_limit` fornecem controle sobre o consumo de recursos pelo motor de correspondência. Para mais informações, consulte a Seção 14.8.2, “Expressões Regulares”. Para informações sobre como as aplicações que usam expressões regulares podem ser afetadas pela mudança de implementação, consulte Considerações sobre a Compatibilidade com Expressões Regulares.

  Um dos efeitos dessa mudança é que `[a-zA-Z]` e `[0-9]` funcionam muito melhor no MySQL 8.0 do que `[[:alpha:]]` e `[[:digit:]]`, respectivamente. Aplicações existentes que utilizam as classes de caracteres na correspondência de padrões devem ser atualizadas para usar os intervalos.

- **Tabelas temporárias internas.** O mecanismo de armazenamento `TempTable` substitui o mecanismo de armazenamento `MEMORY` como o mecanismo padrão para tabelas temporárias internas em memória. O mecanismo de armazenamento `TempTable` oferece armazenamento eficiente para as colunas `VARCHAR` e `VARBINARY`. A variável de sessão `internal_tmp_mem_storage_engine` define o mecanismo de armazenamento para tabelas temporárias internas em memória. Os valores permitidos são `TempTable` (o padrão) e `MEMORY`. A variável `temptable_max_ram` define a quantidade máxima de memória que o mecanismo de armazenamento `TempTable` pode usar antes de os dados serem armazenados em disco.

- **Registro de eventos.** Essas melhorias foram adicionadas para melhorar o registro de eventos:

  - O registro de erros foi reescrito para usar a arquitetura do componente MySQL. O registro de erros tradicional é implementado usando componentes integrados, e o registro de logs usando o log do sistema é implementado como um componente carregável. Além disso, um escritor de log JSON carregável está disponível. Para mais informações, consulte a Seção 7.4.2, “O Log de Erros”.

  - A partir do MySQL 8.0.30, os componentes do log de erro podem ser carregados implicitamente no início antes que o mecanismo de armazenamento `InnoDB` esteja disponível. Esse novo método de carregamento dos componentes do log de erro carrega e habilita os componentes definidos pela variável `log_error_services`.

    Anteriormente, os componentes do log de erros tinham que ser instalados primeiro usando `INSTALL COMPONENT` e só podiam ser carregados depois que `InnoDB` estava totalmente disponível, pois a lista de componentes a serem carregados era lida da tabela `mysql.components`, que é uma tabela `InnoDB`.

    O carregamento implícito de componentes do log de erros tem essas vantagens:

    - Os componentes do log são carregados mais cedo na sequência de inicialização, tornando as informações registradas disponíveis mais cedo.

    - Isso ajuda a evitar a perda de informações do log armazenado, caso ocorra uma falha durante o início.

    - Não é necessário carregar componentes do log de carregamento usando `INSTALL COMPONENT`, o que simplifica a configuração do log de erros.

    O método explícito de carregar componentes de log usando `INSTALL COMPONENT` continua sendo suportado para compatibilidade reversa.

    Para obter mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

- **Bloqueio de backup.** Um novo tipo de bloqueio de backup permite a DML durante um backup online, impedindo operações que possam resultar em um instantâneo inconsistente. O novo bloqueio de backup é suportado pela sintaxe `LOCK INSTANCE FOR BACKUP` e `UNLOCK INSTANCE`. O privilégio `BACKUP_ADMIN` é necessário para usar essas instruções.

- **Replicação.** As seguintes melhorias foram feitas na Replicação do MySQL:

  - A replicação do MySQL agora suporta o registro binário de atualizações parciais em documentos JSON usando um formato binário compacto, economizando espaço no log em comparação com o registro de documentos JSON completos. Esse registro compacto é feito automaticamente quando o registro baseado em instruções está em uso e pode ser habilitado definindo a nova variável de sistema `binlog_row_value_options` para `PARTIAL_JSON`. Para mais informações, consulte Atualizações Parciais de Valores JSON, bem como a descrição de `binlog_row_value_options`.

- **Gestão de conexões.** O MySQL Server agora permite que uma porta TCP/IP seja configurada especificamente para conexões administrativas. Isso oferece uma alternativa à única conexão administrativa permitida nas interfaces de rede usadas para conexões comuns, mesmo quando as conexões `max_connections` já estiverem estabelecidas. Veja a Seção 7.1.12.1, “Interfaces de Conexão”.

  O MySQL agora oferece mais controle sobre o uso da compressão para minimizar o número de bytes enviados através das conexões com o servidor. Anteriormente, uma conexão específica era ou não comprimida ou usava o algoritmo de compressão `zlib`. Agora, também é possível usar o algoritmo `zstd` e selecionar um nível de compressão para conexões `zstd`. Os algoritmos de compressão permitidos podem ser configurados no lado do servidor, bem como no lado de origem da conexão para conexões por programas cliente e por servidores que participam da replicação de origem/replica ou da Replicação em Grupo. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

- **Configuração.** O comprimento máximo permitido de nomes de host no MySQL foi aumentado para 255 caracteres ASCII, em comparação com o limite anterior de 60 caracteres. Isso se aplica, por exemplo, a colunas relacionadas a nomes de host no dicionário de dados, ao esquema de sistema `mysql`, ao Schema de Desempenho, aos esquemas `INFORMATION_SCHEMA` e `sys`; ao valor `MASTER_HOST` para a declaração `CHANGE MASTER TO`; à coluna `Host` na saída da declaração `SHOW PROCESSLIST`; nomes de host em nomes de contas (como os usados em declarações de gerenciamento de contas e em atributos `DEFINER`); e opções de comando relacionadas a nomes de host e variáveis de sistema.

  Observações:

  - O aumento do comprimento permitido para o nome do host pode afetar tabelas com índices em colunas de nome do host. Por exemplo, as tabelas no esquema de sistema `mysql` que indexam nomes de host agora têm um atributo explícito `ROW_FORMAT` de `DYNAMIC` para acomodar valores de índice mais longos.

  - Algumas configurações de nome de arquivo com valor podem ser construídas com base no nome do host do servidor. Os valores permitidos são limitados pelo sistema operacional subjacente, que pode não permitir nomes de host longos o suficiente para incluir nomes de host de 255 caracteres. Isso afeta as variáveis de sistema `general_log_file`, `log_error`, `pid_file`, `relay_log` e `slow_query_log_file` e as opções correspondentes. Se os valores baseados no nome do host forem muito longos para o SO, valores mais curtos devem ser fornecidos explicitamente.

  - Embora o servidor agora suporte nomes de host de 255 caracteres, as conexões ao servidor estabelecidas usando a opção `--ssl-mode=VERIFY_IDENTITY` são limitadas pelo comprimento máximo de nome de host suportado pelo OpenSSL. As correspondências de nome de host se referem a dois campos de certificados SSL, que têm comprimentos máximos conforme o RFC#1034.

- **Plugins.** Anteriormente, os plugins do MySQL podiam ser escritos em C ou C++. Os arquivos de cabeçalho do MySQL usados pelos plugins agora contêm código em C++, o que significa que os plugins devem ser escritos em C++, e não em C.

- **C API.** A API C do MySQL agora suporta funções assíncronas para comunicação não bloqueada com o servidor MySQL. Cada função é a contraparte assíncrona de uma função síncrona existente. As funções síncronas bloqueiam se as leituras ou escritas na conexão do servidor precisarem esperar. As funções assíncronas permitem que uma aplicação verifique se o trabalho na conexão do servidor está pronto para prosseguir. Se não estiver, a aplicação pode realizar outras tarefas antes de verificar novamente mais tarde. Veja a Interface Assíncrona da API C.

- **Tipos de alvo adicionais para lançamentos.** As funções `CAST()` e `CONVERT()` agora suportam conversões para os tipos `DOUBLE` - FLOAT, DOUBLE"), `FLOAT` - FLOAT, DOUBLE"), e `REAL` - FLOAT, DOUBLE"). Adicionada no MySQL 8.0.17. Veja a Seção 14.10, “Funções e Operadores de Lançamento”.

- **Validação de esquema JSON.** O MySQL 8.0.17 adiciona duas funções `JSON_SCHEMA_VALID()` e `JSON_SCHEMA_VALIDATION_REPORT()` para validar documentos JSON novamente contra esquemas JSON. `JSON_SCHEMA_VALID()` retorna TRUE (1) se o documento validar contra o esquema e FALSE (0) se não validar. `JSON_SCHEMA_VALIDATION_REPORT()` retorna um documento JSON contendo informações detalhadas sobre os resultados da validação. As seguintes declarações se aplicam a ambas essas funções:

  - O esquema deve estar em conformidade com o rascunho 4 da especificação JSON Schema.

  - Os atributos `required` são suportados.

  - Os recursos externos e a palavra-chave `$ref` não são suportados.

  - Os padrões de expressão regular são suportados; padrões inválidos são ignorados silenciosamente.

  Consulte a Seção 14.17.7, “Funções de Validação de Esquemas JSON”, para obter mais informações e exemplos.

- **Índices de múltiplos valores.** A partir do MySQL 8.0.17, o `InnoDB` suporta a criação de um índice de múltiplos valores, que é um índice secundário definido em uma coluna `JSON` que armazena um array de valores e que pode ter múltiplos registros de índice para um único registro de dados. Esse índice usa uma definição de parte chave como `CAST(data->'$.zipcode' AS UNSIGNED ARRAY)`. Um índice de múltiplos valores é usado automaticamente pelo otimizador do MySQL para consultas adequadas, como pode ser visto na saída do `EXPLAIN`.

  Como parte desse trabalho, o MySQL adiciona uma nova função `JSON_OVERLAPS()` e um novo operador `MEMBER OF()` para trabalhar com documentos `JSON`, além de estender a função `CAST()` com uma nova palavra-chave `ARRAY`, conforme descrito na lista a seguir:

  - `JSON_OVERLAPS()` compara dois documentos `JSON`. Se eles contiverem pares chave-valor ou elementos de array em comum, a função retorna TRUE (1); caso contrário, retorna FALSE (0). Se ambos os valores forem escalares, a função realiza um teste simples de igualdade. Se um argumento for um array JSON e o outro for um escalar, o escalar é tratado como um elemento de array. Assim, `JSON_OVERLAPS()` atua como um complemento de `JSON_CONTAINS()`.

  - `MEMBER OF()` testa se o primeiro operando (um escalar ou documento JSON) é um membro do array JSON passado como o segundo operando, retornando VERDADEIRO (1) se for, e FALSO (0) se não for. Não há conversão de tipo do operando.

  - `CAST(expression AS type ARRAY)` permite a criação de um índice funcional ao converter o array JSON encontrado em um documento JSON em `json_path` em um array SQL. Os especificadores de tipo são limitados aos já suportados por `CAST()`, com exceção de `BINARY` (não suportado). Esse uso de `CAST()` (e da palavra-chave `ARRAY`) é suportado apenas por `InnoDB`, e apenas para a criação de um índice de múltiplos valores.

  Para informações detalhadas sobre índices de múltiplos valores, incluindo exemplos, consulte Índices de Múltiplos Valores. A Seção 14.17.3, “Funções que Pescam Valores JSON”, fornece informações sobre `JSON_OVERLAPS()` e `MEMBER OF()`, juntamente com exemplos de uso.

- \*\*Tempo de reserva\_zona. \*\* A partir do MySQL 8.0.17, a variável de sessão `time_zone` pode ser reservada usando `SET_VAR`.

- **Arquivamento do Log de Revisão.** A partir do MySQL 8.0.17, o `InnoDB` suporta o arquivamento do log de revisão. Ferramentas de backup que copiam registros do log de revisão podem, às vezes, não acompanhar a geração do log de revisão enquanto uma operação de backup está em andamento, resultando na perda de registros do log de revisão devido a esses registros serem sobrescritos. O recurso de arquivamento do log de revisão resolve esse problema ao escrever sequencialmente os registros do log de revisão em um arquivo de arquivamento. Ferramentas de backup podem copiar registros do log de revisão do arquivo de arquivamento conforme necessário, evitando assim a perda potencial de dados. Para mais informações, consulte Arquivamento do Log de Revisão.

- **O Plugin de Clonagem.** A partir do MySQL 8.0.17, o MySQL oferece um plugin de clonagem que permite clonar dados `InnoDB` localmente ou a partir de uma instância remota do servidor MySQL. Uma operação de clonagem local armazena os dados clonados no mesmo servidor ou nó onde a instância do MySQL está em execução. Uma operação de clonagem remota transfere os dados clonados pela rede de uma instância do servidor MySQL doador para o servidor ou nó receptor onde a operação de clonagem foi iniciada.

  O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai e transfere as coordenadas de replicação do doador e aplica-as no destinatário, o que permite usar o plugin de clonagem para provisionamento de membros e réplicas da Replicação em Grupo. O provisionamento com o plugin de clonagem é consideravelmente mais rápido e eficiente do que a replicação de um grande número de transações. Os membros da Replicação em Grupo também podem ser configurados para usar o plugin de clonagem como um método alternativo de recuperação, de modo que os membros escolham automaticamente a maneira mais eficiente de recuperar os dados do grupo a partir dos membros de semente.

  Para obter mais informações, consulte a Seção 7.6.7, “O Plugin Clone”, e a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

  A partir do MySQL 8.0.27, operações DDL concorrentes na instância do servidor MySQL doador são permitidas enquanto uma operação de clonagem está em andamento. Anteriormente, um bloqueio de backup era mantido durante a operação de clonagem, impedindo operações DDL concorrentes no doador. Para reverter ao comportamento anterior de bloquear operações DDL concorrentes no doador durante uma operação de clonagem, habilite a variável `clone_block_ddl`. Consulte a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

  A partir do MySQL 8.0.29, a variável `clone_delay_after_data_drop` permite especificar um período de atraso imediatamente após a remoção de dados existentes na instância do servidor MySQL do destinatário no início de uma operação de clonagem remota. O atraso visa fornecer tempo suficiente para que o sistema de arquivos do host do destinatário libere espaço antes de os dados serem clonados da instância do servidor MySQL do doador. Alguns sistemas de arquivos liberam espaço de forma assíncrona em um processo em segundo plano. Nesses sistemas de arquivos, a clonagem de dados muito cedo após a remoção de dados existentes pode resultar em falhas na operação de clonagem devido ao espaço insuficiente. O período máximo de atraso é de 3600 segundos (1 hora). O ajuste padrão é 0 (sem atraso).

  A partir do MySQL 8.0.37, o clonamento é permitido entre diferentes versões pontuais. Em outras palavras, apenas os números das versões principal e secundária devem corresponder, pois anteriormente o número da versão pontual também tinha que corresponder.

  Por exemplo, a funcionalidade de clonagem agora permite clonar de 8.0.37 para 8.0.41 ou de 8.0.51 para 8.0.39. As restrições anteriores ainda se aplicam às versões mais antigas que 8.0.37, então a clonagem de versões como 8.0.36 para 8.0.42 ou vice-versa não é permitida.

- **Otimização da Conjunção Hash.** A partir do MySQL 8.0.18, uma junção hash é usada sempre que cada par de tabelas em uma junção inclui pelo menos uma condição de junção equi, e nenhum índice é aplicado a nenhuma condição de junção. Uma junção hash não requer índices, embora possa ser usada com índices que se aplicam apenas a predicados de uma única tabela. A junção hash é mais eficiente na maioria dos casos do que o algoritmo de loop aninhado em blocos. Junções como as mostradas aqui podem ser otimizadas dessa maneira:

  ```
  SELECT *
      FROM t1
      JOIN t2
          ON t1.c1=t2.c1;

  SELECT *
      FROM t1
      JOIN t2
          ON (t1.c1 = t2.c1 AND t1.c2 < t2.c2)
      JOIN t3
          ON (t2.c1 = t3.c1)
  ```

  As junções hash também podem ser usadas para produtos cartesianos, ou seja, quando nenhuma condição de junção é especificada.

  Você pode ver quando a otimização de junção hash está sendo usada para uma consulta específica usando `EXPLAIN FORMAT=TREE` ou `EXPLAIN ANALYZE`. (No MySQL 8.0.20 e versões posteriores, você também pode usar `EXPLAIN`, omitindo `FORMAT=TREE`.)

  A quantidade de memória disponível para uma união hash é limitada pelo valor de `join_buffer_size`. Uma união hash que requer mais memória do que isso é executada em disco; o número de arquivos de disco que podem ser usados por uma união hash em disco é limitado por `open_files_limit`.

  A partir do MySQL 8.0.19, o interruptor `hash_join` do otimizador, que foi introduzido no MySQL 8.0.18, deixou de ser suportado (hash\_join=on ainda aparece como parte do valor do otimizador\_switch, mas configurá-lo não tem mais efeito). Os guias de otimização `HASH_JOIN` e `NO_HASH_JOIN` também deixaram de ser suportados. O interruptor e o guia são agora desaconselhados; espere-os serem removidos em uma futura versão do MySQL. No MySQL 8.0.18 e versões posteriores, as junções hash podem ser desativadas usando o interruptor `NO_BNL` do otimizador.

  No MySQL 8.0.20 e versões posteriores, o loop aninhado em bloco não é mais usado no servidor MySQL, e uma união hash é empregada sempre que um loop aninhado em bloco teria sido usado anteriormente, mesmo quando a consulta não contém condições de união equi. Isso se aplica a não-uniões internas, uniões semijoias, uniões anti, uniões externas à esquerda e uniões externas à direita. A `block_nested_loop` bandeira para a variável de sistema `optimizer_switch` e as dicas de otimizador `BNL` e `NO_BNL` ainda são suportadas, mas, a partir de agora, controlam apenas o uso de uniões hash. Além disso, tanto as uniões internas quanto as externas (incluindo uniões semijoias e anti) agora podem empregar acesso a chave em lote (BKA), que aloca memória do buffer de junção incrementalmente, para que as consultas individuais não precisem consumir grandes quantidades de recursos que elas não realmente requerem para resolução. O BKA para uniões internas só é suportado a partir do MySQL 8.0.18.

  O MySQL 8.0.20 também substitui o executor usado nas versões anteriores do MySQL pelo executor iterador. Esse trabalho inclui a substituição dos antigos motores de subconsultas de índice que governavam as consultas do tipo `WHERE value IN (SELECT column FROM table WHERE ...)` para as consultas `IN` que não foram otimizadas como semijoins, bem como consultas materializadas na mesma forma, que anteriormente dependiam do antigo executor.

  Para obter mais informações e exemplos, consulte a Seção 10.2.1.4, “Otimização da Conjunção de Hash”. Veja também as Conjunções de Acesso por Chave em Bateladas.

- **Instrução EXPLAIN ANALYZE.** Uma nova forma da instrução `EXPLAIN` foi implementada no MySQL 8.0.18, `EXPLAIN ANALYZE`, que fornece informações expandidas sobre a execução das instruções `SELECT` no formato `TREE` para cada iterador usado no processamento da consulta, e possibilita a comparação do custo estimado com o custo real da consulta. Essas informações incluem o custo inicial, o custo total, o número de linhas devolvidas por esse iterador e o número de loops executados.

  No MySQL 8.0.21 e versões posteriores, essa declaração também suporta o especificador `FORMAT=TREE`. `TREE` é o único formato suportado.

  Veja Obtenção de informações com EXPLAIN ANALYZE, para mais informações.

- **Injeção de tipo de dados na consulta.** Na versão 8.0.18 e posterior, o MySQL injeta operações de cast na árvore de itens da consulta dentro de expressões e condições em que o tipo de dados do argumento e o tipo de dados esperado não correspondem. Isso não afeta os resultados da consulta ou a velocidade de execução, mas torna a consulta executada equivalente a uma que é compatível com o padrão SQL, mantendo a compatibilidade reversa com versões anteriores do MySQL.

  Esses tipos implícitos são agora realizados entre tipos temporais (`DATE`, `DATETIME`, `TIMESTAMP`, `TIME`) e tipos numéricos (`SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")/`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"); `DECIMAL` - DECIMAL, NUMERIC")/`NUMERIC` - DECIMAL, NUMERIC"); `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE"); `BIT`) sempre que são comparados usando qualquer um dos operadores padrão de comparação numérica (`=`, `>=`, `>`, `<`, `<=`, `<>`/`!=`, ou `<=>`). Neste caso, qualquer valor que não seja já um `DOUBLE` é convertido como um. A injeção de cast também é agora realizada para comparações entre valores de `DATE` ou `TIME` e valores de `DATETIME`, onde os argumentos são convertidos sempre que necessário como `DATETIME`.

  A partir do MySQL 8.0.21, esses tipos de conversão também são realizados ao comparar tipos de string com outros tipos. Os tipos de string que são convertidos incluem `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `BLOB`, `TEXT`, `ENUM` e `SET`. Ao comparar um valor de um tipo de string com um tipo numérico ou `YEAR`, a conversão de string é para `DOUBLE`; se o tipo do outro argumento não for `FLOAT`, `DOUBLE` ou `REAL`, ele também é convertido para `DOUBLE`. Ao comparar um tipo de string com um valor de `DATETIME` ou `TIMESTAMP`, a conversão de string é para `DATETIME`; ao comparar um tipo de string com `DATE`, a string é convertida para `DATE`.

  É possível ver quando os registros são inseridos em uma consulta específica ao visualizar a saída de `EXPLAIN ANALYZE`, `EXPLAIN FORMAT=JSON` ou, como mostrado aqui, `EXPLAIN FORMAT=TREE`:

  ```
  mysql> CREATE TABLE d (dt DATETIME, d DATE, t TIME);
  Query OK, 0 rows affected (0.62 sec)

  mysql> CREATE TABLE n (i INT, d DECIMAL, f FLOAT, dc DECIMAL);
  Query OK, 0 rows affected (0.51 sec)

  mysql> CREATE TABLE s (c CHAR(25), vc VARCHAR(25),
      ->     bn BINARY(50), vb VARBINARY(50), b BLOB, t TEXT,
      ->     e ENUM('a', 'b', 'c'), se SET('x' ,'y', 'z'));
  Query OK, 0 rows affected (0.50 sec)

  mysql> EXPLAIN FORMAT=TREE SELECT * from d JOIN n ON d.dt = n.i\G
  *************************** 1. row ***************************
  EXPLAIN: -> Inner hash join (cast(d.dt as double) = cast(n.i as double))
  (cost=0.70 rows=1)
      -> Table scan on n  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on d  (cost=0.35 rows=1)

  mysql> EXPLAIN FORMAT=TREE SELECT * from s JOIN d ON d.dt = s.c\G
  *************************** 1. row ***************************
  EXPLAIN: -> Inner hash join (d.dt = cast(s.c as datetime(6)))  (cost=0.72 rows=1)
      -> Table scan on d  (cost=0.37 rows=1)
      -> Hash
          -> Table scan on s  (cost=0.35 rows=1)

  1 row in set (0.01 sec)

  mysql> EXPLAIN FORMAT=TREE SELECT * from n JOIN s ON n.d = s.c\G
  *************************** 1. row ***************************
  EXPLAIN: -> Inner hash join (cast(n.d as double) = cast(s.c as double))  (cost=0.70 rows=1)
      -> Table scan on s  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on n  (cost=0.35 rows=1)

  1 row in set (0.00 sec)
  ```

  Esses casts também podem ser vistos ao executar `EXPLAIN [FORMAT=TRADITIONAL]`, nesse caso, também é necessário emitir `SHOW WARNINGS` após a execução da instrução `EXPLAIN`.

- **Suporte a fuso horário para TIMESTAMP e DATETIME.** A partir do MySQL 8.0.19, o servidor aceita um deslocamento de fuso horário com valores de datetime inseridos (`TIMESTAMP` e `DATETIME`). Esse deslocamento usa o mesmo formato que é empregado ao definir a variável de sistema `time_zone`, exceto que um zero inicial é necessário quando a parte das horas do deslocamento é menor que 10, e `'-00:00'` não é permitido. Exemplos de literais de datetime que incluem deslocamentos de fuso horário são `'2019-12-11 10:40:30-05:00'`, `'2003-04-14 03:30:00+10:00'` e `'2020-01-01 15:35:45+05:30'`.

  Os desvios dos fusos horários não são exibidos ao selecionar valores de data e hora.

  Literais de data e hora que incorporam desvios de fuso horário podem ser usados como valores de parâmetros de declaração preparada.

  Como parte deste trabalho, o valor usado para definir a variável de sistema `time_zone` agora também é restrito ao intervalo `-13:59` a `+14:00`, inclusive. (Ainda é possível atribuir valores de nome à variável `time_zone`, como `'EST'`, `'Posix/Australia/Brisbane'` e `'Europe/Stockholm'`, desde que as tabelas de fuso horário do MySQL sejam carregadas; veja População das Tabelas de Fuso Horário).

  Para obter mais informações e exemplos, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”, bem como a Seção 13.2.2, “Os Tipos DATE, DATETIME e TIMESTAMP”.

- **Informações precisas para falhas na restrição CHECK do esquema JSON.** Ao usar `JSON_SCHEMA_VALID()` para especificar uma restrição `CHECK`, o MySQL 8.0.19 e versões posteriores fornecem informações precisas sobre as razões das falhas dessas restrições.

  Para exemplos e mais informações, consulte JSON\_SCHEMA\_VALID() e as restrições CHECK e restrições CHECK). Veja também a Seção 15.1.20.6, “Restrições CHECK”.

- **Aliases de linha e coluna com ON DUPLICATE KEY UPDATE.** A partir do MySQL 8.0.19, é possível referenciar a linha a ser inserida e, opcionalmente, suas colunas, usando aliases. Considere a seguinte declaração `INSERT` em uma tabela `t` com as colunas `a` e `b`:

  ```
  INSERT INTO t SET a=9,b=5
      ON DUPLICATE KEY UPDATE a=VALUES(a)+VALUES(b);
  ```

  Usando o alias `new` para a nova linha e, em alguns casos, os aliases `m` e `n` para as colunas dessa linha, a declaração `INSERT` pode ser reescrita de várias maneiras diferentes, alguns exemplos das quais são mostrados aqui:

  ```
  INSERT INTO t SET a=9,b=5 AS new
      ON DUPLICATE KEY UPDATE a=new.a+new.b;

  INSERT INTO t VALUES(9,5) AS new
      ON DUPLICATE KEY UPDATE a=new.a+new.b;

  INSERT INTO t SET a=9,b=5 AS new(m,n)
      ON DUPLICATE KEY UPDATE a=m+n;

  INSERT INTO t VALUES(9,5) AS new(m,n)
      ON DUPLICATE KEY UPDATE a=m+n;
  ```

  Para obter mais informações e exemplos, consulte a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

- **Cláusula de tabela explícita padrão SQL e construtor de valor de tabela.** Adicionamos construtores de valor de tabela e cláusulas de tabela explícitas de acordo com o padrão SQL. Estes são implementados no MySQL 8.0.19, respectivamente, como a declaração `TABLE` e a declaração `VALUES`.

  A declaração `TABLE` tem o formato `TABLE table_name` e é equivalente a `SELECT * FROM table_name`. Ela suporta cláusulas `ORDER BY` e `LIMIT` (a última com a cláusula opcional `OFFSET`), mas não permite a seleção de colunas individuais da tabela. `TABLE` pode ser usado em qualquer lugar onde você empregaria a declaração equivalente `SELECT`; isso inclui junções, uniões, declarações `INSERT ... SELECT`, `REPLACE`, `CREATE TABLE ... SELECT` e subconsultas. Por exemplo:

  - `TABLE t1 UNION TABLE t2` é equivalente a `SELECT * FROM t1 UNION SELECT * FROM t2`

  - `CREATE TABLE t2 TABLE t1` é equivalente a `CREATE TABLE t2 SELECT * FROM t1`

  - `SELECT a FROM t1 WHERE b > ANY (TABLE t2)` é equivalente a `SELECT a FROM t1 WHERE b > ANY (SELECT * FROM t2)`.

  `VALUES` pode ser usado para fornecer um valor de tabela a uma instrução `INSERT`, `REPLACE` ou `SELECT`, e consiste na palavra-chave `VALUES`, seguida por uma série de construtores de linha (`ROW()`) separados por vírgulas. Por exemplo, a instrução `INSERT INTO t1 VALUES ROW(1,2,3), ROW(4,5,6), ROW(7,8,9)` fornece um equivalente compatível com SQL ao específico para MySQL `INSERT INTO t1 VALUES (1,2,3), (4,5,6), (7,8,9)`. Você também pode selecionar um construtor de valor de tabela `VALUES` da mesma forma que selecionaria uma tabela, tendo em mente que você deve fornecer um alias de tabela ao fazer isso, e usar este `SELECT` da mesma forma que qualquer outro; isso inclui junções, uniões e subconsultas.

  Para obter mais informações sobre `TABLE` e `VALUES`, e para exemplos de seu uso, consulte as seções seguintes desta documentação:

  - Seção 15.2.16, “Declaração TABLE”
  - Seção 15.2.19, “Declaração de VALORES”
  - Seção 15.1.20.4, “CREATE TABLE ... Statement SELECT”
  - Seção 15.2.7.1, “INSERT ... Instrução SELECT”
  - Seção 15.2.13.2, “Cláusula JOIN”
  - Seção 15.2.15, “Subconsultas”
  - Seção 15.2.18, “Cláusula de UNIÃO”

- **Dicas do otimizador para FORCE INDEX e IGNORE INDEX.** O MySQL 8.0 introduz dicas do otimizador em nível de índice, que funcionam como análogos às dicas tradicionais de índice descritas na Seção 10.9.4, “Dicas de índice”. As novas dicas estão listadas aqui, juntamente com seus equivalentes `FORCE INDEX` ou `IGNORE INDEX`:

  - `GROUP_INDEX`: Equivalente a `FORCE INDEX FOR GROUP BY`

    `NO_GROUP_INDEX`: Equivalente a `IGNORE INDEX FOR GROUP BY`

  - `JOIN_INDEX`: Equivalente a `FORCE INDEX FOR JOIN`

    `NO_JOIN_INDEX`: Equivalente a `IGNORE INDEX FOR JOIN`

  - `ORDER_INDEX`: Equivalente a `FORCE INDEX FOR ORDER BY`

    `NO_ORDER_INDEX`: Equivalente a `IGNORE INDEX FOR ORDER BY`

  - `INDEX`: Igual a `GROUP_INDEX` mais `JOIN_INDEX` mais `ORDER_INDEX`; equivalente a `FORCE INDEX` sem modificador

    `NO_INDEX`: Igual a `NO_GROUP_INDEX` mais `NO_JOIN_INDEX` mais `NO_ORDER_INDEX`; equivalente a `IGNORE INDEX` sem modificador

  Por exemplo, as seguintes duas consultas são equivalentes:

  ```
  SELECT a FROM t1 FORCE INDEX (i_a) FOR JOIN WHERE a=1 AND b=2;

  SELECT /*+ JOIN_INDEX(t1 i_a) */ a FROM t1 WHERE a=1 AND b=2;
  ```

  Os dicas de otimização listados anteriormente seguem as mesmas regras básicas de sintaxe e uso que as dicas de otimização existentes em nível de índice.

  Essas dicas de otimização são destinadas a substituir `FORCE INDEX` e `IGNORE INDEX`, que planejamos depreciar em uma futura versão do MySQL e, posteriormente, remover do MySQL. Elas não implementam um equivalente exato para `USE INDEX`; em vez disso, você pode usar um ou mais de `NO_INDEX`, `NO_JOIN_INDEX`, `NO_GROUP_INDEX` ou `NO_ORDER_INDEX` para obter o mesmo efeito.

  Para obter mais informações e exemplos de uso, consulte Dicas de otimização de nível de índice.

- **Função JSON\_VALUE()**. O MySQL 8.0.21 implementa uma nova função `JSON_VALUE()` destinada a simplificar o indexação de colunas `JSON`. Em sua forma mais básica, ela aceita como argumentos um documento JSON e um caminho JSON apontando para um único valor nesse documento, além de (opcionalmente) permitir que você especifique um tipo de retorno com a palavra-chave `RETURNING`. `JSON_VALUE(json_doc, path RETURNING type)` é equivalente a isso:

  ```
  CAST(
      JSON_UNQUOTE( JSON_EXTRACT(json_doc, path) )
      AS type
  );
  ```

  Você também pode especificar as cláusulas `ON EMPTY`, `ON ERROR` ou ambas, de forma semelhante às utilizadas com `JSON_TABLE()`.

  Você pode usar `JSON_VALUE()` para criar um índice em uma expressão em uma coluna `JSON` assim:

  ```
  CREATE TABLE t1(
      j JSON,
      INDEX i1 ( (JSON_VALUE(j, '$.id' RETURNING UNSIGNED)) )
  );

  INSERT INTO t1 VALUES ROW('{"id": "123", "name": "shoes", "price": "49.95"}');
  ```

  Uma consulta usando essa expressão, como a mostrada aqui, pode utilizar o índice:

  ```
  SELECT j->"$.name" as name, j->"$.price" as price
      FROM t1
      WHERE JSON_VALUE(j, '$.id' RETURNING UNSIGNED) = 123;
  ```

  Em muitos casos, isso é mais simples do que criar uma coluna gerada a partir da coluna `JSON` e, em seguida, criar um índice na coluna gerada.

  Para mais informações e exemplos, consulte a descrição de `JSON_VALUE()`.

- **Comentários de usuários e atributos de usuário.** O MySQL 8.0.21 introduz a capacidade de definir comentários de usuário e atributos de usuário ao criar ou atualizar contas de usuário. Um comentário de usuário consiste em texto arbitrário passado como argumento para uma cláusula `COMMENT` usada com uma cláusula `CREATE USER` ou `ALTER USER`. Um atributo de usuário consiste em dados na forma de um objeto JSON passado como argumento para uma cláusula `ATTRIBUTE` usada com qualquer uma dessas duas cláusulas. O atributo pode conter quaisquer pares de chave-valor válidos na notação de objeto JSON. Apenas uma das cláusulas `COMMENT` ou `ATTRIBUTE` pode ser usada em uma única cláusula `CREATE USER` ou `ALTER USER`.

  Os comentários dos usuários e os atributos dos usuários são armazenados internamente juntos como um objeto JSON, com o texto do comentário como o valor de um elemento que tem `comment` como sua chave. Essas informações podem ser recuperadas da coluna `ATTRIBUTE` da tabela do Schema de Informações `USER_ATTRIBUTES`; como está no formato JSON, você pode usar a função e operadores JSON do MySQL para analisar seu conteúdo (veja a Seção 14.17, “Funções JSON”). Alterações sucessivas no atributo do usuário são mescladas com seu valor atual, como ao usar a função `JSON_MERGE_PATCH()`.

  Exemplo:

  ```
  mysql> CREATE USER 'mary'@'localhost' COMMENT 'This is Mary Smith\'s account';
  Query OK, 0 rows affected (0.33 sec)

  mysql> ALTER USER 'mary'@'localhost'
      -≫     ATTRIBUTE '{"fname":"Mary", "lname":"Smith"}';
  Query OK, 0 rows affected (0.14 sec)

  mysql> ALTER USER 'mary'@'localhost'
      -≫     ATTRIBUTE '{"email":"mary.smith@example.com"}';
  Query OK, 0 rows affected (0.12 sec)

  mysql> SELECT
      ->    USER,
      ->    HOST,
      ->    ATTRIBUTE->>"$.fname" AS 'First Name',
      ->    ATTRIBUTE->>"$.lname" AS 'Last Name',
      ->    ATTRIBUTE->>"$.email" AS 'Email',
      ->    ATTRIBUTE->>"$.comment" AS 'Comment'
      -> FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
      -> WHERE USER='mary' AND HOST='localhost'\G
  *************************** 1. row ***************************
        USER: mary
        HOST: localhost
  First Name: Mary
   Last Name: Smith
       Email: mary.smith@example.com
     Comment: This is Mary Smith's account
  1 row in set (0.00 sec)
  ```

  Para obter mais informações e exemplos, consulte a Seção 15.7.1.3, “Instrução CREATE USER”, a Seção 15.7.1.1, “Instrução ALTER USER” e a Seção 28.3.46, “A Tabela INFORMATION\_SCHEMA USER\_ATTRIBUTES”.

- **Novos indicadores de otimizador\_switch.** O MySQL 8.0.21 adiciona dois novos indicadores para a variável de sistema `optimizer_switch`, conforme descrito na lista a seguir:

  - `prefer_ordering_index` bandeira

    Por padrão, o MySQL tenta usar um índice ordenado para qualquer consulta `ORDER BY` ou `GROUP BY` que tenha uma cláusula `LIMIT`, sempre que o otimizador determinar que isso resultaria em uma execução mais rápida. Como é possível, em alguns casos, que escolher uma otimização diferente para essas consultas realmente funcione melhor, agora é possível desativar essa otimização definindo a bandeira `prefer_ordering_index` para `off`.

    O valor padrão para essa bandeira é `on`.

  - `subquery_to_derived` bandeira

    Quando essa bandeira é definida como `on`, o otimizador transforma subconsultas escalares elegíveis em junções em tabelas derivadas. Por exemplo, a consulta `SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)` é reescrita como `SELECT t1.a FROM t1 JOIN ( SELECT COUNT(t2.a) AS c FROM t2 ) AS d WHERE t1.a > d.c`.

    Essa otimização pode ser aplicada a uma subconsulta que faça parte de uma cláusula `SELECT`, `WHERE`, `JOIN` ou `HAVING`; contém uma ou mais funções agregadas, mas não contém nenhuma cláusula `GROUP BY`; não é correlacionada e não utiliza funções não determinísticas.

    A otimização também pode ser aplicada a uma subconsulta de tabela que é o argumento de `IN`, `NOT IN`, `EXISTS` ou `NOT EXISTS`, e que não contém um `GROUP BY`. Por exemplo, a consulta `SELECT * FROM t1 WHERE t1.b < 0 OR t1.a IN (SELECT t2.a + 1 FROM t2)` é reescrita como `SELECT a, b FROM t1 LEFT JOIN (SELECT DISTINCT 1 AS e1, t2.a AS e2 FROM t2) d ON t1.a + 1 = d.e2 WHERE t1.b < 0 OR d.e1 IS NOT NULL`.

    A partir do MySQL 8.0.24, essa otimização também pode ser aplicada a uma subconsulta escalar correlacionada, aplicando um agrupamento extra a ela e, em seguida, uma união externa no predicado levantado. Por exemplo, uma consulta como `SELECT * FROM t1 WHERE (SELECT a FROM t2 WHERE t2.a=t1.a) > 0` pode ser reescrita como `SELECT t1.* FROM t1 LEFT OUTER JOIN (SELECT a, COUNT(*) AS ct FROM t2 GROUP BY a) AS derived ON t1.a = derived.a WHERE derived.a > 0`. O MySQL realiza uma verificação de cardinalidade para garantir que a subconsulta não retorne mais de uma linha (`ER_SUBQUERY_NO_1_ROW`). Consulte a Seção 15.2.15.7, “Subconsultas Correlacionadas”, para obter mais informações.

    Essa otimização normalmente é desativada, pois não oferece um benefício notável de desempenho na maioria dos casos; a bandeira é definida como `off` por padrão.

  Para obter mais informações, consulte a Seção 10.9.2, “Otimizações Desativáveis”. Veja também a Seção 10.2.1.19, “Otimização da Consulta LIMIT”, a Seção 10.2.2.1, “Otimização de Predicados de Subconsultas IN e EXISTS com Transformações Semijoin” e a Seção 10.2.2.4, “Otimização de Tabelas Derivadas, Referências de Visualizações e Expressões de Tabela Comuns com Fusão ou Materialização”.

- **Melhorias no XML.** A partir do MySQL 8.0.21, a instrução `LOAD XML` agora suporta seções `CDATA` no XML a ser importado.

- **O casting para o tipo YEAR agora é suportado.** A partir do MySQL 8.0.22, o servidor permite o casting para `YEAR`. As funções `CAST()` e `CONVERT()` suportam valores `YEAR` de um dígito, dois dígitos e quatro dígitos. Para valores de um dígito e dois dígitos, o intervalo permitido é de 0 a 99. Valores de quatro dígitos devem estar no intervalo de 1901-2155. `YEAR` também pode ser usado como tipo de retorno para a função `JSON_VALUE()`; esta função suporta apenas anos de quatro dígitos.

  Valores de tipo string, data e hora, e de ponto flutuante podem ser convertidos para `YEAR`. A conversão de valores de tipo `GEOMETRY` para `YEAR` não é suportada.

  Para obter mais informações, incluindo as regras de conversão, consulte a descrição da função `CONVERT()`.

- **Recuperação de valores de TIMESTAMP como UTC.** O MySQL 8.0.22 e versões posteriores suportam a conversão de um valor da coluna `TIMESTAMP` do fuso horário do sistema para um UTC `DATETIME` na recuperação, usando `CAST(value AT TIME ZONE specifier AS DATETIME)`, onde o especificador é um dos `[INTERVAL] '+00:00'` ou `'UTC'`. A precisão do valor `DATETIME` retornado pelo cast pode ser especificada até 6 casas decimais, se desejado. A palavra-chave `ARRAY` não é suportada com essa construção.

  Os valores `TIMESTAMP` inseridos em uma tabela com um deslocamento de fuso horário também são suportados. O uso de `AT TIME ZONE` não é suportado para `CONVERT()` ou qualquer outra função ou construção do MySQL.

  Para mais informações e exemplos, consulte a descrição da função `CAST()`.

- **Sincronização da saída do arquivo de dump.** O MySQL 8.0.22 e versões posteriores suportam a sincronização periódica ao gravar em arquivos por meio das instruções `SELECT INTO DUMPFILE` e `SELECT INTO OUTFILE`. Isso pode ser habilitado definindo a variável de sistema `select_into_disk_sync` para `ON`; o tamanho do buffer de escrita é determinado pelo valor definido para `select_into_buffer_size`; o padrão é de 131072 (217) bytes.

  Além disso, um atraso opcional após a sincronização com o disco pode ser definido usando `select_into_disk_sync_delay`; o padrão é sem atraso (0 milissegundos).

  Para mais informações, consulte as descrições das variáveis referenciadas anteriormente neste item.

- **Preparação única das declarações.** A partir do MySQL 8.0.22, uma declaração preparada é preparada uma única vez, em vez de uma vez a cada execução. Isso é feito ao executar `PREPARE`. Isso também é verdadeiro para qualquer declaração dentro de um procedimento armazenado; a declaração é preparada uma vez, quando o procedimento armazenado é executado pela primeira vez.

  Um dos resultados dessa mudança é que a forma como os parâmetros dinâmicos usados em declarações preparadas são resolvidos também é alterada nas maneiras listadas aqui:

  - Um parâmetro de declaração preparada recebe um tipo de dado quando a declaração é preparada; o tipo persiste em cada execução subsequente da declaração (a menos que a declaração seja preparada novamente; veja o parágrafo seguinte).

    Usar um tipo de dado diferente para um parâmetro ou variável de usuário específico dentro de uma instrução preparada para execuções da instrução subsequente à primeira pode fazer com que a instrução seja repreparada; por essa razão, é aconselhável usar o mesmo tipo de dado para um parâmetro específico ao reexecutar uma instrução preparada.

  - Os seguintes construções que utilizam funções de janela não são mais aceitas, a fim de alinhar com o padrão SQL:

    - `NTILE(NULL)`

    - `NTH_VALUE(expr, NULL)`

    - `LEAD(expr, nn)` e `LAG(expr, nn)`, onde `nn` é um número negativo

    Isso facilita uma maior conformidade com o padrão SQL. Consulte as descrições individuais das funções para obter mais detalhes.

  - Uma variável de usuário referenciada dentro de uma instrução preparada agora tem seu tipo de dados determinado quando a instrução é preparada; o tipo persiste para cada execução subsequente da instrução.

  - Uma variável de usuário referenciada por uma instrução dentro de um procedimento armazenado agora tem seu tipo de dados determinado pela primeira vez quando a instrução é executada; o tipo persiste em qualquer invocação subsequente do procedimento armazenado que a contém.

  - Ao executar uma declaração preparada na forma `SELECT expr1, expr2, ... FROM table ORDER BY ?`, passar um valor inteiro `N` para o parâmetro não mais causa a ordenação dos resultados pela expressão `N` na lista de seleção; os resultados não são mais ordenados, conforme esperado com `ORDER BY constant`.

  Preparar uma declaração usada como uma declaração preparada ou dentro de um procedimento armazenado apenas uma vez melhora o desempenho da declaração, pois elimina o custo adicional da preparação repetida. Isso também evita possíveis rollback múltiplos de estruturas de preparação, que tem sido a fonte de inúmeros problemas no MySQL.

  Para mais informações, consulte a Seção 15.5.1, “Instrução PREPARE”.

- **Tratamento de JOINES DIRETOS como JOINES ESQUERDA.** A partir do MySQL 8.0.22, o servidor trata todas as instâncias de `RIGHT JOIN` internamente como `LEFT JOIN`, eliminando vários casos especiais em que uma conversão completa não foi realizada no momento da análise.

- **Otimização de empilhamento de condições derivadas.** O MySQL 8.0.22 (e versões posteriores) implementa o empilhamento de condições derivadas para consultas que possuem tabelas derivadas materializadas. Para uma consulta como `SELECT * FROM (SELECT i, j FROM t1) AS dt WHERE i > constant`, agora é possível, em muitos casos, empilhar a condição externa `WHERE` para a tabela derivada, resultando, neste caso, em `SELECT * FROM (SELECT i, j FROM t1 WHERE i > constant) AS dt`.

  Anteriormente, se a tabela derivada fosse materializada e não unificada, o MySQL materializava toda a tabela e, em seguida, qualificava as linhas com a condição `WHERE`. Ao mover a condição `WHERE` para a subconsulta usando a otimização de empurrão de condição derivada, muitas vezes é possível reduzir o número de linhas que precisam ser processadas, o que pode diminuir o tempo necessário para executar a consulta.

  Uma condição externa `WHERE` pode ser empurrada diretamente para uma tabela derivada materializada quando a tabela derivada não usa funções agregadas ou de janela. Quando a tabela derivada tem um `GROUP BY` e não usa funções de janela, a condição externa `WHERE` pode ser empurrada para a tabela derivada como uma condição `HAVING`. A condição `WHERE` também pode ser empurrada quando a tabela derivada usa uma função de janela e a condição externa `WHERE` faz referência a colunas usadas na cláusula `PARTITION` da função de janela.

  A otimização descendente de condições derivadas está habilitada por padrão, conforme indicado pela bandeira `derived_condition_pushdown` da variável de sistema `optimizer_switch`. A bandeira, adicionada no MySQL 8.0.22, está definida como `on` por padrão; para desabilitar a otimização para uma consulta específica, você pode usar a dica de otimizador `NO_DERIVED_CONDITION_PUSHDOWN` (também adicionada no MySQL 8.0.22). Se a otimização for desabilitada devido ao `derived_condition_pushdown` estar definido como `off`, você pode habilitá-la para uma consulta específica usando `DERIVED_CONDITION_PUSHDOWN`.

  A otimização por empilhamento de condições derivadas não pode ser aplicada a uma tabela derivada que contenha uma cláusula `LIMIT`. Antes do MySQL 8.0.29, a otimização também não pode ser usada quando a consulta contém `UNION`. No MySQL 8.0.29 e versões posteriores, as condições podem ser empilhadas em ambos os blocos de consulta de uma união na maioria dos casos; consulte a Seção 10.2.2.5, “Otimização por Empilhamento de Condições Derivadas”, para obter mais informações.

  Além disso, uma condição que usa uma subconsulta em si não pode ser empurrada para baixo, e uma condição `WHERE` não pode ser empurrada para uma tabela derivada que também é uma tabela interna de uma junção externa. Para obter informações adicionais e exemplos, consulte a Seção 10.2.2.5, “Otimização de Empurrar Condições Derivadas”.

- **Leitura não bloqueável em tabelas MySQL concede permissões.** A partir do MySQL 8.0.22, para permitir operações simultâneas de DML e DDL em tabelas MySQL concede permissões, as operações de leitura que anteriormente adquiriram bloqueios de linha em tabelas MySQL concede permissões são executadas como leituras não bloqueáveis.

  As operações que agora são realizadas como leituras não bloqueantes no MySQL incluem:

  - `SELECT` declarações e outras declarações de leitura somente que leem dados de tabelas de concessão por meio de listas de junção e subconsultas, incluindo `SELECT ... FOR SHARE` declarações, usando qualquer nível de isolamento de transação.

  - Operações DML que leem dados de tabelas de concessão (através de listas de junção ou subconsultas), mas não as modificam, usando qualquer nível de isolamento de transação.

  Para obter informações adicionais, consulte Concorrência na Tabela de Subvenções.

- Suporte a 64 bits para FROM\_UNIXTIME(), UNIX\_TIMESTAMP(), CONVERT\_TZ(). A partir do MySQL 8.0.28, as funções `FROM_UNIXTIME()`, `UNIX_TIMESTAMP()` e `CONVERT_TZ()` lidam com valores de 64 bits em plataformas que as suportam. Isso inclui versões de 64 bits do Linux, MacOS e Windows.

  Em plataformas compatíveis, `UNIX_TIMESTAMP()` agora lida com valores até `'3001-01-18 23:59:59.999999'` UTC, e `FROM_UNIXTIME()` pode converter valores até 32536771199,999999 segundos desde o Unix Epoch; `CONVERT_TZ()` agora aceita valores que não excedem `'3001-01-18 23:59:59.999999'` UTC após a conversão.

  O comportamento dessas funções em plataformas de 32 bits não é afetado por essas mudanças. O comportamento do tipo `TIMESTAMP` também não é afetado (em qualquer plataforma); para trabalhar com datas e horários após `'2038-01-19 03:14:07.999999'`, UTC, use o tipo `DATETIME`.

  Para obter mais informações, consulte as descrições das funções individuais discutidas anteriormente, na Seção 14.7, “Funções de Data e Hora”.

- **Controle da alocação de recursos.** A partir do MySQL 8.0.28, você pode ver a quantidade de memória usada para consultas emitidas por todos os usuários regulares, verificando a variável `Global_connection_memory`. (Esse total não inclui os recursos usados por usuários do sistema, como o MySQL root. Também exclui qualquer memória usada pelo pool de buffers `InnoDB`.)

  Para habilitar as atualizações do `Global_connection_memory`, é necessário definir o `global_connection_memory_tracking = 1`; isso é `0` (desativado) por padrão. Você pode controlar com que frequência o `Global_connection_memory` é atualizado, definindo o `connection_memory_chunk_size`.

  É também possível definir limites de uso de memória para usuários normais no nível de sessão ou global, ou em ambos, definindo uma ou ambas as variáveis de sistema listadas aqui:

  - `connection_memory_limit`: Quantidade de memória alocada para cada conexão. Sempre que esse limite for excedido para qualquer usuário, novas consultas desse usuário serão rejeitadas.

  - `global_connection_memory_limit`: Quantidade de memória alocada para todas as conexões. Sempre que esse limite for excedido, novas consultas de qualquer usuário regular serão rejeitadas.

  Esses limites não se aplicam a processos do sistema ou contas administrativas.

  Consulte as descrições das variáveis referenciadas para obter mais informações.

- **Transações XA isoladas.** O MySQL 8.0.29 adiciona suporte para transações XA, que, uma vez preparadas, não estão mais conectadas à conexão original. Isso significa que elas podem ser confirmadas ou revertidas por outra conexão, e que a sessão atual pode iniciar imediatamente outra transação.

  Uma variável de sistema `xa_detach_on_prepare` controla se as transações XA são desvinculadas; o padrão é `ON`, que faz com que todas as transações XA sejam desvinculadas. O uso de tabelas temporárias é desativado para transações XA quando isso estiver em vigor.

  Para obter mais informações, consulte a Seção 15.3.8.2, “Estados de Transação XA”.

- **Controle automático de purga de log binário.** O MySQL 8.0.29 adiciona a variável de sistema `binlog_expire_logs_auto_purge`, que fornece uma interface única para habilitar e desabilitar a purga automática dos logs binários. Isso está habilitado (`ON`) por padrão; para desabilitar a purga automática dos arquivos de log binário, defina essa variável para `OFF`.

  `binlog_expire_logs_auto_purge` deve ser `ON` para que a purga automática dos arquivos de log binário possa prosseguir; o valor desta variável tem precedência sobre qualquer outra opção ou variável do servidor, incluindo (mas não se limitando a) `binlog_expire_logs_seconds`.

  O cenário para `binlog_expire_logs_auto_purge` não tem efeito sobre `PURGE BINARY LOGS`.

- **Instruções de criação de rotinas condicionais e gatilhos.** A partir do MySQL 8.0.29, as seguintes instruções suportam a opção `IF NOT EXISTS`:

  - `CREATE FUNCTION`
  - `CREATE PROCEDURE`
  - `CREATE TRIGGER`

  Para `CREATE FUNCTION` ao criar uma função armazenada e `CREATE PROCEDURE`, esta opção impede que um erro ocorra se já houver uma rotina com o mesmo nome. Para `CREATE FUNCTION`, quando usada para criar uma função carregável, a opção impede que um erro ocorra se já existir uma função carregável com esse nome. Para `CREATE TRIGGER`, a opção impede que um erro ocorra se já existir no mesmo esquema e na mesma tabela um gatilho com o mesmo nome.

  Essa melhoria alinha a sintaxe dessas declarações mais de perto com a de `CREATE DATABASE`, `CREATE TABLE`, `CREATE USER` e `CREATE EVENT` (todos os quais já suportam `IF NOT EXISTS`), e atua para complementar a opção `IF EXISTS` suportada pelas declarações `DROP PROCEDURE`, `DROP FUNCTION` e `DROP TRIGGER`.

  Para obter mais informações, consulte as descrições das instruções SQL indicadas, bem como a Resolução de Nome de Função. Veja também a Seção 19.5.1.7, “Replicação de Instruções CREATE TABLE ... SELECT”.

- **Atualização da biblioteca FIDO incluída.** O MySQL 8.0.30 atualiza a biblioteca `fido2` incluída (usada com o plugin `authentication_fido`) da versão 1.5.0 para a versão 1.8.0.

  Consulte a Seção 8.4.1.11, “Autenticação FIDO Pluggable”, para obter mais informações.

- **Conjunto de caracteres: Colagens específicas de idioma.** Anteriormente, quando mais de um idioma tinha a mesma definição de colagem, o MySQL implementava colégens apenas para um dos idiomas, o que significava que alguns idiomas eram cobertos apenas pelas colégens `utf8mb4` do Unicode 9.0 específicas para outros idiomas. O MySQL 8.0.30 (e versões posteriores) corrige esses problemas ao fornecer colégens específicas de idioma para os idiomas que anteriormente eram cobertos apenas por colégens específicas de idioma para outros idiomas. Os idiomas cobertos pelas novas colégens estão listados aqui:

  - Norueguês (Nynorsk)

    e

    Norueguês (Bokmål)

  - Sérvio (letras latinas)

  - Bósnio (letras latinas)

  - Búlgaro

  - Galego

  - Mongolês (com caracteres cirílicos)

  O MySQL fornece as collation `*_as_cs` e `*_ai_ci` para cada uma das línguas listadas acima.

  Para obter mais informações, consulte Colagens específicas de idioma.

- **Opções IF EXISTS e IGNORE UNKNOWN USER para REVOKE.** O MySQL 8.0.30 implementa duas novas opções para `REVOKE` que podem ser usadas para determinar se uma instrução gera um erro ou um aviso quando um usuário, um papel ou um privilégio especificados na instrução não podem ser encontrados ou não podem ser atribuídos. Aqui está uma sintaxe muito básica mostrando o posicionamento dessas novas opções:

  ```
  REVOKE [IF EXISTS] privilege_or_role
      ON object
      FROM user_or_role [IGNORE UNKNOWN USER]
  ```

  `IF EXISTS` faz com que uma instrução `REVOKE` malsucedida gere uma mensagem de aviso em vez de um erro, desde que o usuário ou papel almejado exista, apesar de quaisquer referências na instrução a qualquer papel ou privilégio que não possam ser encontrados.

  `IGNORE UNKNOWN USER` faz com que um `REVOKE` não bem-sucedido gere uma mensagem de alerta em vez de um erro quando o usuário ou o papel alvo mencionados na declaração não podem ser encontrados.

  Para obter mais informações e exemplos, consulte a Seção 15.7.1.8, “Declaração de REVOGAÇÃO”.

- **Chaves primárias invisíveis geradas.** A partir do MySQL 8.0.30, é possível executar um servidor de origem de replicação de forma que uma chave primária invisível (GIPK) gerada seja adicionada a qualquer tabela `InnoDB` que seja criada sem uma chave primária explícita. A definição da coluna de chave primária gerada adicionada a tal tabela é equivalente à mostrada aqui:

  ```
  my_row_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT INVISIBLE PRIMARY KEY
  ```

  O modo GIPK não está habilitado por padrão. Para habilitá-lo, defina a variável de sistema do servidor `sql_generate_invisible_primary_key` para `ON`.

  As chaves primárias primárias invisíveis geradas normalmente são visíveis na saída de declarações como `SHOW CREATE TABLE` e `SHOW INDEX`, bem como nas tabelas do Schema de Informações do MySQL, como as tabelas `COLUMNS` e `STATISTICS`. Em tais casos, você pode fazê-las ficar ocultas, definindo `show_gipk_in_create_table_and_information_schema` para `OFF`.

  Como parte desse trabalho, uma nova opção `--skip-generated-invisible-primary-key` é adicionada ao **mysqldump** e ao **mysqlpump** para excluir chaves primárias, colunas e valores de colunas gerados que são invisíveis de suas saídas.

  **GIPKs e replicação entre tabelas com ou sem chaves primárias.** Na replicação do MySQL, uma replica ignora efetivamente qualquer configuração para `sql_generate_invisible_primary_key` na fonte, de modo que não tem efeito nas tabelas replicadas. O MySQL 8.0.32 e versões posteriores permitem que a replica adicione uma chave primária gerada invisível a qualquer tabela `InnoDB` que, de outra forma, como replicada, não tenha chave primária. Você pode fazer isso invocando `CHANGE REPLICATION SOURCE TO ... REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` na replica.

  `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` não é compatível com a replicação de grupo do MySQL.

  Para obter mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.

- Transações XA seguras em caso de falha. Anteriormente, as transações XA não eram totalmente resistentes a uma parada inesperada em relação ao log binário, e se isso ocorresse enquanto o servidor estivesse executando `XA PREPARE`, `XA COMMIT` ou `XA ROLLBACK`, não se garantiria que o servidor pudesse ser recuperado ao estado correto, possivelmente deixando o log binário com transações XA extras que não haviam sido aplicadas ou faltando uma ou mais transações XA que haviam sido aplicadas. A partir do MySQL 8.0.30, isso não é mais um problema, e um servidor que sai de uma topologia de replicação por qualquer motivo sempre pode ser trazido de volta a um estado consistente de transação XA ao se reconectar.

  *Problema conhecido*: Quando a mesma XID de transação é usada para executar transações XA sequencialmente e ocorre uma interrupção durante a execução do `XA COMMIT ... ONE PHASE`, usando essa mesma XID, após essa transação ter sido preparada no motor de armazenamento, pode não ser mais possível sincronizar o estado entre o log binário e o motor de armazenamento.

  Para obter mais informações, consulte a Seção 15.3.8.3, “Restrições para Transações XA”.

- **Nestando com UNION.** A partir do MySQL 8.0.31, os corpos das expressões de consulta entre parênteses podem ser aninhados até 63 níveis de profundidade em combinação com `UNION`. Tantas consultas eram anteriormente rejeitadas com o erro `ER_NOT_SUPPORTED_YET`, mas agora são permitidas. A saída `EXPLAIN` para tal consulta é mostrada aqui:

  ```
  mysql> EXPLAIN FORMAT=TREE (
      ->   (SELECT a, b, c FROM t ORDER BY a LIMIT 3) ORDER BY b LIMIT 2
      -> ) ORDER BY c LIMIT 1\G
  *************************** 1. row ***************************
  EXPLAIN: -> Limit: 1 row(s)  (cost=5.55..5.55 rows=1)
      -> Sort: c, limit input to 1 row(s) per chunk  (cost=2.50 rows=0)
          -> Table scan on <result temporary>  (cost=2.50 rows=0)
              -> Temporary table  (cost=5.55..5.55 rows=1)
                  -> Limit: 2 row(s)  (cost=2.95..2.95 rows=1)
                      -> Sort: b, limit input to 2 row(s) per chunk  (cost=2.50 rows=0)
                          -> Table scan on <result temporary>  (cost=2.50 rows=0)
                              -> Temporary table  (cost=2.95..2.95 rows=1)
                                  -> Limit: 3 row(s)  (cost=0.35 rows=1)
                                      -> Sort: t.a, limit input to 3 row(s) per chunk  (cost=0.35 rows=1)
                                          -> Table scan on t  (cost=0.35 rows=1)

  1 row in set (0.00 sec)
  ```

  O MySQL segue a semântica padrão do SQL ao compactar os corpos das expressões de consulta entre parênteses, de modo que um limite externo superior não possa anular um limite interno inferior. Por exemplo, `(SELECT ... LIMIT 5) LIMIT 10` não pode retornar mais de cinco linhas.

  O limite de 63 níveis é imposto apenas após o analisador do otimizador do MySQL ter realizado quaisquer simplificações ou fusões que ele puder.

  Para obter mais informações, consulte a Seção 15.2.11, “Expressões de consulta entre parênteses”.

- **Desativando a reescrita de consultas.** Anteriormente, ao usar o plugin `Rewriter`, todas as consultas eram sujeitas à reescrita, independentemente do usuário. Isso poderia ser um problema em certos casos, como ao administrar o sistema ou ao aplicar declarações originadas de uma fonte de replicação ou de um arquivo de dump criado pelo **mysqldump** ou outro programa MySQL. O MySQL 8.0.31 oferece uma solução para esses problemas ao implementar um novo privilégio de usuário `SKIP_QUERY_REWRITE`; declarações emitidas por um usuário com esse privilégio são ignoradas por `Rewriter` e não reescritas.

  O MySQL 8.0.31 também adiciona uma nova variável de sistema do servidor `rewriter_enabled_for_threads_without_privilege_checks`. Quando definida como `OFF`, instruções reescrivíveis emitidas por threads para as quais `PRIVILEGE_CHECKS_USER` é `NULL` (como threads de aplicador de replicação) não são reescritas pelo plugin `Rewriter`. O padrão é `ON`, o que significa que essas instruções são reescritas.

  Para obter mais informações, consulte a Seção 7.6.4, “O Plugin de Reescrita da Consulta de Reescrita”.

- **Filtragem de replicação de declarações XA.** Anteriormente, as declarações `XA START`, `XA END`, `XA COMMIT` e `XA ROLLBACK` eram filtradas pelo banco de dados padrão sempre que se usava `--replicate-do-db` ou `--replicate-ignore-db`, o que poderia levar à perda de transações. A partir do MySQL 8.0.31, essas declarações não são filtradas nessas situações, independentemente do valor de `binlog_format`.

- **Filtragem de replicação e verificação de privilégios.** A partir do MySQL 8.0.31, quando a filtragem de replicação está em uso, uma replica não mais gera erros de replicação relacionados a verificações de privilégios ou validação `require_row_format` para eventos que são filtrados, permitindo filtrar quaisquer transações que falhem na validação.

  Como os verificações de privilégio em linhas filtradas não podem mais fazer com que a replicação seja interrompida, uma replica agora pode aceitar apenas a parte de um banco de dados para a qual um usuário específico foi concedido acesso; isso é verdade enquanto as atualizações desta parte do banco de dados forem replicadas apenas no formato baseado em linha.

  Essa capacidade também pode ser útil ao migrar para o MySQL HeatWave Service a partir de um serviço local ou na nuvem que utiliza tabelas para administração ou outros fins a que o usuário de replicação de entrada não tenha acesso.

  Para obter mais informações, consulte a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”, bem como a Seção 19.5.1.29, “Erros na Replicação Durante a Replicação”.

- Operadores de tabelas **INTERSECT e EXCEPT**. O MySQL 8.0.31 adiciona suporte aos operadores de tabela SQL `INTERSECT` e `EXCEPT`. Onde `a` e `b` representam conjuntos de resultados de consultas, esses operadores se comportam da seguinte forma:

  - `a INTERSECT b` inclui apenas as linhas que aparecem nos dois conjuntos de resultados `a` e `b`.

  - `a EXCEPT b` retorna apenas as linhas do conjunto de resultados `a` que *não* aparecem também em `b`.

  `INTERSECT DISTINCT`, `INTERSECT ALL`, `EXCEPT DISTINCT` e `EXCEPT ALL` são todos suportados; `DISTINCT` é o padrão tanto para `INTERSECT` quanto para `EXCEPT` (isso é o mesmo que para `UNION`).

  Para mais informações e exemplos, consulte a Seção 15.2.8, “Cláusula INTERSEÇÃO”, e a Seção 15.2.4, “Cláusula EXCEÇÃO”.

- **Histogramas definidos pelo usuário.** A partir do MySQL 8.0.31, é possível definir o histograma de uma coluna para um valor JSON especificado pelo usuário. Isso pode ser feito usando a seguinte sintaxe SQL:

  ```
  ANALYZE TABLE tbl_name
    UPDATE HISTOGRAM ON col_name
    USING DATA 'json_data'
  ```

  Essa declaração cria ou sobrescreve um histograma para a coluna `col_name` da tabela `tbl_name` usando a representação JSON do histograma `json_data`. Após executar essa declaração, você pode verificar se o histograma foi criado ou atualizado consultando a tabela Schema de Informações `COLUMN_STATISTICS`, da seguinte maneira:

  ```
  SELECT HISTOGRAM FROM INFORMATION_SCHEMA.COLUMN_STATISTICS
    WHERE TABLE_NAME='tbl_name'
    AND COLUMN_NAME='col_name';
  ```

  O valor da coluna retornado deve ser o mesmo `json_data` usado na declaração anterior `ANALYZE TABLE`.

  Isso pode ser útil em casos em que valores considerados importantes são ignorados pelo processo de amostragem do histograma. Quando isso acontece, você pode querer modificar o histograma ou definir seu próprio histograma com base no conjunto de dados completo. Além disso, a amostragem de um grande conjunto de dados de usuários e a construção de um histograma a partir dele são operações que consomem muitos recursos e podem afetar as consultas dos usuários. Com essa melhoria, a geração de histograma pode ser movida do (servidor) primário e realizada em uma replica; os histogramas gerados podem então ser atribuídos às colunas da tabela apropriadas no servidor de origem.

  Para mais informações e exemplos, consulte Análise de Estatísticas de Histograma.

- **ID de construção do servidor (Linux).** O MySQL 8.0.31 adiciona a variável de sistema `build_id` somente de leitura para sistemas Linux, onde uma assinatura de 160 bits `SHA1` é gerada no momento da compilação; o valor de `build_id` é o do valor gerado convertido em uma string hexadecimal, fornecendo um identificador único para a construção.

  `build_id` é escrito no log do servidor toda vez que o MySQL é iniciado.

  Se você construir o MySQL a partir do código-fonte, você pode observar que esse valor muda toda vez que você recompila o servidor. Consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”, para obter mais informações.

  Esta variável não é suportada em plataformas que não sejam Linux.

- **Formato padrão de saída do EXPLAIN.** O MySQL 8.0.32 adiciona uma variável de sistema `explain_format` que determina o formato da saída de uma instrução `EXPLAIN` usada para obter um plano de execução da consulta na ausência de qualquer opção `FORMAT`. Por exemplo, se o valor de `explain_format` for `TREE`, então a saída de qualquer `EXPLAIN` usa o formato em forma de árvore, assim como se a instrução tivesse especificado `FORMAT=TREE`.

  Esse comportamento é substituído pelo valor definido na opção `FORMAT`. Suponha que `explain_format` esteja definido como `TREE`; mesmo assim, `EXPLAIN FORMAT=JSON stmt` exibe o resultado usando o formato de saída JSON.

  Para obter mais informações e exemplos, consulte a descrição da variável de sistema `explain_format`, bem como a seção Obtenção de Informações sobre o Plano de Execução. Há também implicações para o comportamento do `EXPLAIN ANALYZE`; veja Obtenção de Informações com EXPLAIN ANALYZE.

- **Suporte ao ST\_TRANSFORM() Cartesian SRS.** Antes do MySQL 8.0.30, a função `ST_TRANSFORM()` não suportava Sistemas de Referência Espacial Cartesianos. No MySQL 8.0.30 e versões posteriores, essa função oferece suporte ao método de projeção Popular Visualisation Pseudo Mercator (EPSG 1024), usado para WGS 84 Pseudo-Mercator (SRID 3857). O MySQL 8.0.32 e versões posteriores suportam todos os SRS Cartesianos, exceto EPSG 1042, EPSG 1043, EPSG 9816 e EPSG 9826.

- **Opção mysql client --system-command.** A opção `--system-command` para o cliente **mysql**, disponível no MySQL 8.0.40 e versões posteriores, habilita ou desabilita o comando `system`.

  Esta opção está habilitada por padrão. Para desabilitá-la, use `--system-command=OFF` ou `--skip-system-command`, o que faz com que o comando `system` seja rejeitado com um erro.

- **Opção mysql client --commands.** A opção `--commands` do cliente **mysql**, introduzida no MySQL 8.0.43, habilita ou desabilita a maioria dos comandos do cliente **mysql**.

  Esta opção está habilitada por padrão. Para desabilitá-la, inicie o cliente **mysql** com `--commands=OFF` ou `--skip-commands`.

  Para obter mais informações, consulte a Seção 6.5.1.1, “Opções do cliente do MySQL”.

### Recursos descontinuados no MySQL 8.0

As seguintes funcionalidades são desaconselhadas no MySQL 8.0 e podem ser removidas em uma futura versão. Quando houver alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações que utilizam recursos descontinuados no MySQL 8.0 e que foram removidos em uma versão superior do MySQL, as instruções podem falhar ao serem replicadas de uma fonte do MySQL 8.0 para uma réplica de uma versão superior, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que utilizam recursos descontinuados no 8.0 devem ser revisadas para evitar esses problemas e usar alternativas quando possível.

- **Caracteres curinga em concessões de banco de dados.** O uso dos caracteres `%` e `_` como curingas em concessões de banco de dados é desaconselhável a partir do MySQL 8.0.35. Você deve esperar que a funcionalidade de curinga seja removida em uma futura versão do MySQL e que esses caracteres sejam sempre tratados como literais, pois já são tratados assim quando o valor da variável de sistema do servidor `partial_revokes` é `ON`.

  Além disso, o tratamento do `%` pelo servidor como sinônimo do `localhost` ao verificar privilégios também foi desaconselhado a partir do MySQL 8.0.35, e, portanto, está sujeito à remoção em uma versão futura do MySQL.

- A autenticação FIDO plugável é descontinuada no MySQL 8.0.35 e versões posteriores.

- A opção `--character-set-client-handshake`, originalmente destinada ao uso em atualizações de versões muito antigas do MySQL, está sendo desaconselhada no MySQL 8.0.35 e em versões posteriores do MySQL 8.0, onde um aviso é emitido sempre que ela é usada. Você deve esperar que essa opção seja removida em uma versão futura do MySQL; as aplicações que dependem dessa opção devem começar a migrar para fora dela o mais rápido possível.

- As variáveis de sistema de servidor `old` e `new` e as opções de servidor relacionadas estão desatualizadas no MySQL 8.0, a partir do MySQL 8.0.35. Agora, uma mensagem de aviso é emitida sempre que uma dessas variáveis é definida ou lida. Como essas variáveis estão destinadas a serem removidas em uma versão futura do MySQL, as aplicações que dependem delas devem começar a migrar delas o mais rápido possível.

- O modo de filtragem do log de auditoria do legado foi descontinuado a partir do MySQL 8.0.34. Novos avisos de descontinuidade são emitidos para as variáveis do sistema de filtragem do log de auditoria do legado. Essas variáveis descontinuadas são de leitura somente ou dinâmicas.

  (Apenas leitura) `audit_log_policy` agora escreve uma mensagem de aviso no log de erro do servidor MySQL durante a inicialização do servidor quando o valor não for `ALL` (valor padrão).

  (Dinâmico) `audit_log_include_accounts`, `audit_log_exclude_accounts`, `audit_log_statement_policy` e `audit_log_connection_policy`. As variáveis dinâmicas exibem uma mensagem de aviso com base no uso:

  - Ao passar um valor não nulo para `audit_log_include_accounts` ou `audit_log_exclude_accounts` durante o início do servidor MySQL, agora é exibida uma mensagem de aviso no log de erro do servidor.

  - Ao passar um valor não padrão para `audit_log_statement_policy` ou `audit_log_connection_policy` durante o início do servidor MySQL, agora é exibida uma mensagem de aviso no log de erro do servidor. `ALL` é o valor padrão para ambas as variáveis.

  - A mudança de um valor existente usando a sintaxe `SET` durante uma sessão do cliente MySQL agora escreve uma mensagem de aviso no log do cliente.

  - A persistência de uma variável usando a sintaxe `SET PERSIST` durante uma sessão do cliente MySQL agora escreve uma mensagem de aviso no log do cliente.

- No MySQL 8.0.34 e versões posteriores, o plugin de autenticação `mysql_native_password` foi descontinuado e agora gera uma mensagem de aviso de descontinuidade no log de erro do servidor se uma conta tentar se autenticar usando `mysql_native_password` como método de autenticação.

- A variável de sistema de servidor `ssl_fips_mode`, a opção de cliente `--ssl-fips-mode` e a opção `MYSQL_OPT_SSL_FIPS_MODE` estão desatualizadas e estão sujeitas à remoção em uma versão futura do MySQL.

- Os plugins `keyring_file` e `keyring_encrypted_file` estão desatualizados a partir do MySQL 8.0.34. Esses plugins de chaveiro são substituídos pelos componentes `component_keyring_file` e `component_keyring_encrypted_file`. Para uma comparação concisa entre os componentes de chaveiro e os plugins, consulte a Seção 8.4.4.1, “Componentes de Chaveiro Versus Plugins de Chaveiro”.

- A partir do MySQL 8.0.31, o plugin `keyring_oci` está desatualizado e está sujeito à remoção em uma futura versão do MySQL. Em vez disso, considere usar o componente `component_keyring_oci` para armazenar dados do carteiro (consulte a Seção 8.4.4.11, “Usando o componente de carteiro de vault da Oracle Cloud Infrastructure”).

- O conjunto de caracteres `utf8mb3` está desatualizado. Por favor, use `utf8mb4` em vez disso.

- Os seguintes conjuntos de caracteres são desaconselhados:

  - `ucs2` (consulte a Seção 12.9.4, “O Conjunto de Caracteres ucs2 (Codificação Unicode UCS-2”)])

  - `macroman` e `macce` (consulte a Seção 12.10.2, “Caracteres do Ocidente Europeu”, e a Seção 12.10.3, “Caracteres do Centro Europeu”)

  - `dec` (ver Seção 12.10.2, “Caracteres de Caracteres da Europa Ocidental”)

  - `hp8` (ver Seção 12.10.2, “Caracteres de Caracteres da Europa Ocidental”)

  No MySQL 8.0.28 e versões posteriores, qualquer um desses conjuntos de caracteres ou suas colatações gera uma mensagem de depreciação quando usados de alguma das seguintes maneiras:

  - Ao iniciar o servidor MySQL com `--character-set-server` ou `--collation-server`

  - Quando especificados em qualquer declaração SQL, incluindo, mas não se limitando a `CREATE TABLE`, `CREATE DATABASE`, `SET NAMES` e `ALTER TABLE`

  Você deve usar `utf8mb4` em vez de qualquer um dos conjuntos de caracteres listados anteriormente.

  As colateções definidas pelo usuário estão desatualizadas. A partir do MySQL 8.0.33, qualquer uma das seguintes ações gera uma mensagem de aviso no log:

  - Uso de `COLLATE` em qualquer instrução SQL junto com o nome de uma agregação definida pelo usuário

  - Usando o nome de uma ordenação definida pelo usuário para o valor de `collation_server`, `collation_database` ou `collation_connection`.

  Você deve esperar que o suporte para collationes definidos pelo usuário seja removido em uma versão futura do MySQL.

- Como o `caching_sha2_password` é o plugin de autenticação padrão no MySQL 8.0 e oferece um conjunto superconjunto de recursos do plugin de autenticação `sha256_password`, o `sha256_password` é desatualizado; espere que ele seja removido em uma versão futura do MySQL. As contas do MySQL que autenticam usando o `sha256_password` devem ser migradas para usar o `caching_sha2_password` em vez disso.

- O plugin `validate_password` foi reimplementado para usar a infraestrutura do componente. O formulário do plugin `validate_password` ainda está disponível, mas agora é desatualizado; espere-se que ele seja removido em uma versão futura do MySQL. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

- A cláusula `ENGINE` para as instruções `ALTER TABLESPACE` e `DROP TABLESPACE` está desatualizada.

- O modo SQL `PAD_CHAR_TO_FULL_LENGTH` está desatualizado.

- O suporte ao `AUTO_INCREMENT` é desatualizado para colunas do tipo `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") (e quaisquer sinônimos). Considere remover o atributo `AUTO_INCREMENT` dessas colunas ou convertê-las para um tipo inteiro.

- O atributo `UNSIGNED` é desaconselhável para colunas do tipo `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), e `DECIMAL` - DECIMAL, NUMERIC") (e quaisquer sinônimos). Considere usar uma simples restrição `CHECK` em vez disso para tais colunas.

- A sintaxe `FLOAT(M,D)` e `DOUBLE(M,D)` para especificar o número de dígitos para colunas do tipo `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") (e quaisquer sinônimos) é uma extensão MySQL não padrão. Esta sintaxe está desatualizada.

- O atributo `ZEROFILL` é desaconselhado para tipos de dados numéricos, assim como o atributo largura de exibição para tipos de dados inteiros. Considere usar um meio alternativo para produzir o efeito desses atributos. Por exemplo, as aplicações podem usar a função `LPAD()` para zero-padar números até a largura desejada ou podem armazenar os números formatados nas colunas `CHAR`.

- Para os tipos de dados de string, o atributo `BINARY` é uma extensão não padrão do MySQL que é uma abreviação para especificar a collation binária (`_bin`) do conjunto de caracteres da coluna (ou do conjunto de caracteres padrão da tabela, se nenhum conjunto de caracteres da coluna for especificado). No MySQL 8.0, esse uso não padrão do `BINARY` é ambíguo porque o conjunto de caracteres `utf8mb4` tem múltiplas collationes `_bin`, então o atributo `BINARY` é desatualizado; espere que o suporte a ele seja removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar uma collation explícita `_bin` em vez disso.

  O uso de `BINARY` para especificar um tipo de dado ou conjunto de caracteres permanece inalterado.

- Versões anteriores do MySQL suportavam as expressões abreviadas não padronizadas `ASCII` e `UNICODE`, respectivamente, para `CHARACTER SET latin1` e `CHARACTER SET ucs2`. `ASCII` e `UNICODE` estão desatualizados (MySQL 8.0.28 e versões posteriores) e agora geram uma mensagem de aviso. Use `CHARACTER SET` em vez disso, em ambos os casos.

- Os operadores de estilo C não padrão `&&`, `||` e `!`, que são sinônimos dos operadores SQL padrão `AND`, `OR` e `NOT`, respectivamente, estão desatualizados. As aplicações que utilizam os operadores não padrão devem ser ajustadas para usar os operadores padrão.

  Nota

  O uso de `||` é desaconselhável, a menos que o modo SQL `PIPES_AS_CONCAT` esteja habilitado. Nesse caso, `||` indica o operador de concatenação de strings padrão do SQL).

- A função `JSON_MERGE()` está desatualizada. Use `JSON_MERGE_PRESERVE()` em vez disso.

- O modificador de consulta `SQL_CALC_FOUND_ROWS` e a função `FOUND_ROWS()` associada estão desatualizadas. Consulte a descrição `FOUND_ROWS()` para obter informações sobre uma estratégia alternativa.

- O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` foi descontinuado a partir do MySQL 8.0.13.

- Para as declarações `SELECT`, o uso de uma cláusula `INTO` após `FROM`, mas não no final de `SELECT`, é desaconselhável a partir do MySQL 8.0.20. É preferível colocar o `INTO` no final da declaração.

  Para as declarações `UNION`, essas duas variantes que contêm `INTO` estão desatualizadas a partir do MySQL 8.0.20:

  - No bloco de consulta subsequente de uma expressão de consulta, use `INTO` antes de `FROM`.

  - Em um bloco final entre parênteses de uma expressão de consulta, o uso de `INTO`, independentemente de sua posição em relação a `FROM`.

  Consulte a Seção 15.2.13.1, “Instrução SELECT ... INTO”, e a Seção 15.2.18, “Cláusula UNION”.

- `FLUSH HOSTS` é desaconselhável a partir do MySQL 8.0.23. Em vez disso, truncate a tabela do Schema de Desempenho `host_cache`:

  ```
  TRUNCATE TABLE performance_schema.host_cache;
  ```

  A operação `TRUNCATE TABLE` requer o privilégio `DROP` para a tabela.

- O cliente **mysql\_upgrade** é desatualizado porque suas capacidades para atualizar as tabelas do sistema no esquema de sistema `mysql` e objetos em outros esquemas foram movidas para o servidor MySQL. Veja a Seção 3.4, “O que o processo de atualização do MySQL atualiza”.

- A opção de servidor `--no-dd-upgrade` está desatualizada. Ela é substituída pela opção `--upgrade`, que oferece um controle mais preciso sobre o comportamento do dicionário de dados e da atualização do servidor.

- O arquivo `mysql_upgrade_info`, que é criado no diretório de dados e usado para armazenar o número da versão do MySQL, está desatualizado; espere-se que ele seja removido em uma versão futura do MySQL.

- A variável de sistema `relay_log_info_file` e a opção `--master-info-file` estão desatualizadas. Anteriormente, essas variáveis eram usadas para especificar o nome dos logs de informações de relé e logs de informações de origem quando os valores `relay_log_info_repository=FILE` e `master_info_repository=FILE` eram definidos, mas essas configurações foram desatualizadas. O uso de arquivos para os logs de informações de relé e logs de informações de origem foi substituído por tabelas de replica seguras em caso de falha, que são a opção padrão no MySQL 8.0.

- A variável de sistema `max_length_for_sort_data` foi descontinuada devido às mudanças no otimizador que a tornaram obsoleta e sem efeito.

- Esses parâmetros de legado para a compressão de conexões ao servidor estão desatualizados: a opção de linha de comando `--compress` do comando cliente; a opção `MYSQL_OPT_COMPRESS` para a função C API `mysql_options()`; e a variável de sistema `slave_compressed_protocol`. Para obter informações sobre os parâmetros a serem usados, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

- O uso da variável de ambiente `MYSQL_PWD` para especificar uma senha do MySQL está desaconselhado.

- O uso de `VALUES()` para acessar novos valores de linha no `INSERT ... ON DUPLICATE KEY UPDATE` foi descontinuado a partir do MySQL 8.0.20. Use, em vez disso, aliases para as novas linhas e colunas.

- Como especificar `ON ERROR` antes de `ON EMPTY` ao invocar `JSON_TABLE()` é contrário ao padrão SQL, essa sintaxe já foi descontinuada no MySQL. A partir do MySQL 8.0.20, o servidor exibe um aviso sempre que você tenta fazer isso. Ao especificar ambas as cláusulas em uma única invocação de `JSON_TABLE()`, certifique-se de que `ON EMPTY` seja usado primeiro.

- Colunas com prefixos de índice nunca foram suportadas como parte da chave de particionamento de uma tabela; anteriormente, essas colunas eram permitidas ao criar, alterar ou atualizar tabelas particionadas, mas eram excluídas pela função de particionamento da tabela, e o servidor não emitia nenhum aviso de que isso havia ocorrido. Esse comportamento permissivo agora é desaconselhado e está sujeito à remoção em uma versão futura do MySQL, na qual o uso de tais colunas na chave de particionamento faz com que as instruções `CREATE TABLE` ou `ALTER TABLE` sejam rejeitadas quando ocorrem.

  A partir do MySQL 8.0.21, sempre que colunas que usam prefixos de índice são especificadas como parte da chave de particionamento, um aviso é gerado para cada coluna desse tipo. Sempre que uma declaração `CREATE TABLE` ou `ALTER TABLE` é rejeitada porque todas as colunas na chave de particionamento proposta teriam prefixos de índice, o erro resultante agora fornece a razão exata para a rejeição. Em ambos os casos, isso inclui casos em que as colunas usadas na função de particionamento são definidas implicitamente como as da chave primária da tabela, empregando uma cláusula `PARTITION BY KEY()` vazia.

  Para obter mais informações e exemplos, consulte Prefixos de índice de colunas não suportados para partição de chaves.

- O plugin InnoDB memcached está desatualizado a partir do MySQL 8.0.22; espere que o suporte a ele seja removido em uma versão futura do MySQL.

- A variável `temptable_use_mmap` está desatualizada a partir do MySQL 8.0.26; espere que o suporte a ela seja removido em uma versão futura do MySQL.

- O operador `BINARY` está desatualizado a partir do MySQL 8.0.27 e você deve esperar sua remoção em uma versão futura do MySQL. O uso de `BINARY` agora gera uma mensagem de aviso. Use `CAST(... AS BINARY)` em vez disso.

- A variável `default_authentication_plugin` está desatualizada a partir do MySQL 8.0.27; espere que o suporte a ela seja removido em uma versão futura do MySQL.

  A variável `default_authentication_plugin` ainda é usada no MySQL 8.0.27, mas em conjunto com a nova variável de sistema `authentication_policy` e com menor precedência, que é introduzida no MySQL 8.0.27 com o recurso de autenticação multifator. Para obter detalhes, consulte o plugin de autenticação padrão.

- As opções de servidor `--abort-slave-event-count` e `--disconnect-slave-event-count`, usadas pela suíte de testes do MySQL e normalmente não utilizadas em produção, estão desatualizadas a partir do MySQL 8.0.29; espera-se que ambas as opções sejam removidas em uma versão futura do MySQL.

- A variável de sistema `myisam_repair_threads` e a opção **myisamchk** `--parallel-recover` estão desatualizadas a partir do MySQL 8.0.29; espera-se que o suporte para ambas seja removido em uma futura versão do MySQL.

  A partir do MySQL 8.0.29, valores diferentes de 1 (o padrão) para `myisam_repair_threads` geram um aviso.

- Anteriormente, o MySQL aceitava os literais `DATE`, `TIME`, `DATETIME` e `TIMESTAMP` que continham um número arbitrário de caracteres de delimitador, bem como os literais `DATETIME` e `TIMESTAMP` com um número arbitrário de caracteres de espaço em branco antes, depois e entre as partes da data e hora. A partir do MySQL 8.0.29, o servidor emite uma advertência de depreciação sempre que o valor literal contiver qualquer um dos seguintes:

  - Um ou mais caracteres de delimitador não padrão

  - Caracteres de delimitador em excesso

  - Espaço em branco, exceto o caractere de espaço (' ', `0x20`)

  - Espaço em excesso

  Um aviso de depreciação é emitido por valor temporal, mesmo que haja vários problemas com ele. Esse aviso não é promovido a um erro no modo estrito, para que a execução de um `INSERT` desse valor ainda seja bem-sucedida quando o modo estrito estiver em vigor.

  Você deve esperar que o comportamento não padrão seja removido em uma versão futura do MySQL e tomar medidas agora para garantir que suas aplicações não dependem dele.

  Consulte String e literais numéricos no contexto de data e hora, para obter mais informações e exemplos.

- A variável de sistema `replica_parallel_type` e sua opção de servidor associada `--replica-parallel-type` estão desatualizadas a partir do MySQL 8.0.29. A partir desta versão, ler ou definir esse valor gera uma mensagem de aviso de desatualização; espere que ele seja removido em uma versão futura do MySQL.

- A partir do MySQL 8.0.30, definir a variável de sistema `replica_parallel_workers` (ou a opção de servidor equivalente) para 0 é desaconselhável e gera uma mensagem de aviso. Quando você deseja que uma replica use o modelo de execução único, use `replica_parallel_workers=1` em vez disso, que produz o mesmo resultado, mas sem aviso.

- A opção de servidor `--skip-host-cache` está desatualizada a partir do MySQL 8.0.30; espere sua remoção em uma futura versão do MySQL. Use a variável de sistema `host_cache_size` em vez disso.

- A opção `--old-style-user-limits`, destinada à compatibilidade reversa com versões muito antigas (antes da versão 5.0.3), está desaconselhada a partir do MySQL 8.0.30; usar essa opção agora gera uma mensagem de aviso. Você deve esperar que essa opção seja removida em uma futura versão do MySQL.

- As variáveis `innodb_log_files_in_group` e `innodb_log_file_size` estão desatualizadas a partir do MySQL 8.0.30. Essas variáveis são substituídas pela variável `innodb_redo_log_capacity`. Para mais informações, consulte a Seção 17.6.5, “Registro de Refazer”.

- A partir do MySQL 8.0.32, o uso de “FULL” como um identificador não citado é desaconselhável, devido ao fato de ser uma palavra-chave reservada no padrão SQL. Isso significa que uma declaração como `CREATE TABLE full (c1 INT, c2 INT)` agora gera uma mensagem de aviso (`ER_WARN_DEPRECATED_IDENT`). Para evitar isso, altere o nome ou, como mostrado aqui, encapsule-o em aspas duplas (`` ` ``):

  ```
  CREATE TABLE `full` (c1 INT, c2 INT);
  ```

  Para mais informações, consulte a Seção 11.3, “Palavras-chave e Palavras Reservadas”.

- A partir do MySQL 8.0.32, o uso do sinal de dólar (`$`) como o primeiro caractere de um identificador não citado é desaconselhado e gera uma mensagem de aviso. Esse uso está sujeito à remoção em uma futura versão do MySQL. Isso inclui identificadores usados como nomes de bancos de dados, tabelas, visualizações, colunas ou programas armazenados, bem como aliases para qualquer um deles. O sinal de dólar ainda pode ser usado como o primeiro caractere de um identificador citado. Consulte a Seção 11.2, “Nomes de Objetos do Esquema”, para obter mais informações.

- A variável de sistema de servidor `binlog_format` está desatualizada a partir do MySQL 8.0.34 e está sujeita à remoção em uma futura versão. A mudança no formato de registro binário também está desatualizada, com a expectativa de que a remoção de `binlog_format` deixe o registro binário baseado em linhas, já o padrão no MySQL 8.0, como o único formato de registro binário usado ou suportado pelo MySQL. Por essa razão, novas instalações do MySQL devem usar *apenas* o registro binário baseado em linhas; as configurações de replicação existentes que usam o formato de registro `binlog_format=STATEMENT` ou `binlog_format=MIXED` devem ser migradas para o formato baseado em linhas.

  As variáveis de sistema `log_bin_trust_function_creators` e `log_statements_unsafe_for_binlog` são usadas exclusivamente para registro e replicação baseados em declarações. Por esse motivo, elas estão sendo desaconselhadas e estão sujeitas à remoção em uma versão futura do MySQL.

  Definir ou selecionar o valor de `binlog_format`, `log_bin_trust_function_creators` ou `log_statements_unsafe_for_binlog` gera uma mensagem de alerta no MySQL 8.0.34 e versões posteriores.

- O programa utilitário cliente **mysqlpump** está desatualizado a partir do MySQL 8.0.34 e emite um aviso de desatualização quando executado. Este programa está sujeito à remoção em uma versão futura do MySQL. Como o MySQL oferece outros meios de realizar backups e dump de bancos de dados com a mesma ou funcionalidades adicionais, incluindo **mysqldump** e o MySQL Shell, este programa é considerado redundante.

  As ferramentas **lz4\_decompress** e **zlib\_decompress** associadas também estão desatualizadas a partir do MySQL 8.0.34.

- O uso de um número de versão sem um caractere de espaço em branco após (ou no final do comentário) é desaconselhável a partir do MySQL 8.0.34 e gera uma mensagem de aviso. Esta declaração gera uma mensagem de aviso no MySQL 8.0.34 ou posterior, conforme mostrado aqui:

  ```
  mysql> CREATE TABLE t1(a INT, KEY (a)) /*!50110KEY_BLOCK_SIZE=1024*/ ENGINE=MYISAM;
  Query OK, 0 rows affected, 1 warning (0.01 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 4164
  Message: Immediately starting the version comment after the version number is
  deprecated and may change behavior in a future release. Please insert a
  white-space character after the version number.
  1 row in set (0.00 sec)
  ```

  Para evitar tais avisos, insira um ou mais caracteres de espaço após o número da versão, como este:

  ```
  mysql> CREATE TABLE t2(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024*/ ENGINE=MYISAM;
  Query OK, 0 rows affected (0.00 sec)
  ```

  Veja também a Seção 11.7, “Comentários”.

- A partir do MySQL 8.0.34, a variável de sistema `sync_relay_log_info` é desaconselhada, assim como sua opção de inicialização do servidor equivalente `--sync-relay-log-info`. Você deve esperar que o suporte a essa variável e para o armazenamento de metadados do aplicativo de replicação em um arquivo seja removido em uma versão futura do MySQL. Você é aconselhado a atualizar quaisquer de seus aplicativos MySQL que possam depender disso antes que isso ocorra.

- A variável de sistema de servidor `binlog_transaction_dependency_tracking` está desatualizada a partir do MySQL 8.0.35 e está sujeita à remoção em uma versão futura do MySQL. Referenciar essa variável ou a opção de inicialização equivalente **mysqld** `--binlog-transaction-dependency-tracking` agora aciona um aviso. Não há planos para substituir essa variável ou sua funcionalidade, que, espera-se, será feita internamente ao servidor mais tarde.

### Recursos removidos no MySQL 8.0

Os seguintes itens estão obsoletos e foram removidos no MySQL 8.0. Quando houver alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações do MySQL 5.7 que utilizam recursos removidos no MySQL 8.0, as instruções podem falhar ao serem replicadas de uma fonte do MySQL 5.7 para uma réplica do MySQL 8.0, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que utilizam recursos removidos no MySQL 8.0 devem ser revisadas para evitar esses problemas e usar alternativas quando possível.

- A variável de sistema `innodb_locks_unsafe_for_binlog` foi removida. O nível de isolamento `READ COMMITTED` oferece uma funcionalidade semelhante.

- A variável `information_schema_stats`, introduzida no MySQL 8.0.0, foi removida e substituída por `information_schema_stats_expiry` no MySQL 8.0.3.

  `information_schema_stats_expiry` define um parâmetro de expiração para as estatísticas de tabela `INFORMATION_SCHEMA` em cache. Para mais informações, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

- Os códigos relacionados às tabelas de sistema obsoletas `InnoDB` foram removidos no MySQL 8.0.3. As visualizações `INFORMATION_SCHEMA` baseadas em tabelas de sistema `InnoDB` foram substituídas por visualizações internas de sistema em tabelas do dicionário de dados. As visualizações `InnoDB` e `INFORMATION_SCHEMA` afetadas foram renomeadas:

  **Tabela 1.1: Nomes Renomeados de Visualizações do Esquema de Informações InnoDB**

  <table><thead><tr> <th>Antigo Nome</th> <th>Novo nome</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_INDEXES</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_SYS_INDEXES</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_TABLES</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_TABLES</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_TABLESPACES</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_TABLESPACES</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_TABLESTATS</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_TABLESTATS</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_VIRTUAL</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_VIRTUAL</code>]</td> </tr><tr> <td>[[<code>INNODB_SYS_INDEXES</code>]]</td> <td>[[<code>INNODB_COLUMNS</code><code>INNODB_SYS_INDEXES</code>]</td> </tr><tr> <td>[[<code>INNODB_SYS_TABLES</code>]]</td> <td>[[<code>INNODB_TABLES</code>]]</td> </tr><tr> <td>[[<code>INNODB_SYS_TABLESPACES</code>]]</td> <td>[[<code>INNODB_TABLESPACES</code>]]</td> </tr><tr> <td>[[<code>INNODB_SYS_TABLESTATS</code>]]</td> <td>[[<code>INNODB_TABLESTATS</code>]]</td> </tr><tr> <td>[[<code>INNODB_SYS_VIRTUAL</code>]]</td> <td>[[<code>INNODB_VIRTUAL</code>]]</td> </tr></tbody></table>

  Após a atualização para o MySQL 8.0.3 ou versão posterior, atualize quaisquer scripts que façam referência a nomes de visualizações anteriores `InnoDB` `INFORMATION_SCHEMA`.

- As seguintes funcionalidades relacionadas à gestão da conta são removidas:

  - Use `GRANT` para criar usuários. Em vez disso, use `CREATE USER`. Seguir essa prática torna o modo SQL `NO_AUTO_CREATE_USER` irrelevante para as instruções `GRANT`, então ele também é removido, e agora um erro é escrito no log do servidor quando a presença desse valor para a opção `sql_mode` no arquivo de opções impede que o **mysqld** seja iniciado.

  - Use `GRANT` para modificar propriedades da conta que não sejam atribuições de privilégios. Isso inclui propriedades de autenticação, SSL e limite de recursos. Em vez disso, defina essas propriedades no momento da criação da conta com `CREATE USER` ou modifique-as depois com `ALTER USER`.

  - Utilize a sintaxe `IDENTIFIED BY PASSWORD 'auth_string'` para `CREATE USER` e `GRANT`. Em vez disso, use `IDENTIFIED WITH auth_plugin AS 'auth_string'` para `CREATE USER` e `ALTER USER`, onde o valor `'auth_string'` esteja em um formato compatível com o plugin nomeado.

    Além disso, como a sintaxe `IDENTIFIED BY PASSWORD` foi removida, a variável de sistema `log_builtin_as_identified_by_password` é supérflua e foi removida.

  - A função `PASSWORD()`. Além disso, a remoção de `PASSWORD()` significa que a sintaxe de `SET PASSWORD ... = PASSWORD('auth_string')` não está mais disponível.

  - A variável de sistema `old_passwords`.

- O cache de consultas foi removido. A remoção inclui os seguintes itens:

  - As declarações `FLUSH QUERY CACHE` e `RESET QUERY CACHE`.

  - Essas variáveis do sistema: `query_cache_limit`, `query_cache_min_res_unit`, `query_cache_size`, `query_cache_type`, `query_cache_wlock_invalidate`.

  - Essas variáveis de status: `Qcache_free_blocks`, `Qcache_free_memory`, `Qcache_hits`, `Qcache_inserts`, `Qcache_lowmem_prunes`, `Qcache_not_cached`, `Qcache_queries_in_cache`, `Qcache_total_blocks`.

  - Estes estados de fio são: `checking privileges on cached query`, `checking query cache for query`, `invalidating query cache entries`, `sending cached result to client`, `storing result in query cache`, `Waiting for query cache lock`.

  - O modificador `SQL_CACHE` `SELECT`.

  Esses itens de cache de consulta desatualizados permanecem desatualizados, mas não têm efeito; espere-os serem removidos em uma futura versão do MySQL:

  - O modificador `SQL_NO_CACHE` `SELECT`.

  - A variável de sistema `ndb_cache_check_time`.

  A variável de sistema `have_query_cache` permanece desaconselhada e sempre tem um valor de `NO`; espere-se que ela seja removida em uma futura versão do MySQL.

- O dicionário de dados fornece informações sobre os objetos do banco de dados, então o servidor não verifica mais os nomes de diretórios no diretório de dados para encontrar os bancos de dados. Consequentemente, as variáveis de sistema `--ignore-db-dir` e `ignore_db_dirs` são desnecessárias e são removidas.

- O log DDL, também conhecido como log de metadados, foi removido. A partir do MySQL 8.0.3, essa funcionalidade é gerenciada pela tabela do dicionário de dados `innodb_ddl_log`. Veja Visualizar logs DDL.

- As variáveis de sistema `tx_isolation` e `tx_read_only` foram removidas. Use `transaction_isolation` e `transaction_read_only` em vez disso.

- A variável de sistema `sync_frm` foi removida porque os arquivos `.frm` se tornaram obsoletos.

- A variável de sistema `secure_auth` e a opção de cliente `--secure-auth` foram removidas. A opção `MYSQL_SECURE_AUTH` para a função C API `mysql_options()` foi removida.

- A variável de sistema `multi_range_count` é removida.

- A variável de sistema `log_warnings` e a opção de servidor `--log-warnings` foram removidas. Use a variável de sistema `log_error_verbosity` em vez disso.

- O escopo global para a variável de sistema `sql_log_bin` foi removido. `sql_log_bin` tem escopo de sessão apenas, e as aplicações que dependem do acesso a `@@GLOBAL.sql_log_bin` devem ser ajustadas.

- As variáveis de sistema `metadata_locks_cache_size` e `metadata_locks_hash_instances` são removidas.

- As variáveis de sistema não utilizadas `date_format`, `datetime_format`, `time_format` e `max_tmp_tables` são removidas.

- Esses modos de compatibilidade desatualizados do SQL foram removidos: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`. Eles não podem mais ser atribuídos à variável de sistema `sql_mode` ou usados como valores permitidos para a opção **mysqldump** `--compatible`.

  A remoção de `MAXDB` significa que o tipo de dados `TIMESTAMP` para `CREATE TABLE` ou `ALTER TABLE` é tratado como `TIMESTAMP` e não é mais tratado como `DATETIME`.

- Os qualificadores desatualizados `ASC` ou `DESC` para as cláusulas `GROUP BY` são removidos. Consultas que anteriormente dependiam da classificação `GROUP BY` podem produzir resultados diferentes das versões anteriores do MySQL. Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

- As palavras-chave `EXTENDED` e `PARTITIONS` para a declaração `EXPLAIN` foram removidas. Essas palavras-chave são desnecessárias porque seu efeito está sempre ativado.

- Estes itens relacionados à criptografia são removidos:

  - As funções `ENCODE()` e `DECODE()`.

  - A função `ENCRYPT()`.

  - As funções `DES_ENCRYPT()`, `DES_DECRYPT()` e `--des-key-file`, a opção `have_crypt` da variável de sistema, a opção `DES_KEY_FILE` para a instrução `FLUSH` e a opção `HAVE_CRYPT` **CMake**.

  Em vez das funções de criptografia removidas: Para `ENCRYPT()`, considere usar `SHA2()` em vez disso para hashing unidirecional. Para os outros, considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez disso.

- No MySQL 5.7, várias funções espaciais disponíveis sob vários nomes foram descontinuadas para seguir em direção à criação de um namespace de funções espaciais mais consistente, com o objetivo de que cada nome de função espacial começasse com `ST_` se realizasse uma operação exata, ou com `MBR` se realizasse uma operação baseada em retângulos de delimitação mínima. No MySQL 8.0, as funções descontinuadas são removidas, deixando apenas as funções correspondentes `ST_` e `MBR`:

  - Essas funções são removidas em favor dos nomes `MBR`: `Contains()`, `Disjoint()`, `Equals()`, `Intersects()`, `Overlaps()`, `Within()`.

  - Essas funções são removidas em favor dos nomes `ST_`s: `Area()`, `AsBinary()`, `AsText()`, `AsWKB()`, `AsWKT()`, `Buffer()`, `Centroid()`, `ConvexHull()`, `Crosses()`, `Dimension()`, `Distance()`, `EndPoint()`, `Envelope()`, `ExteriorRing()`, `GeomCollFromText()`, `GeomCollFromWKB()`, `GeomFromText()`, `GeomFromWKB()`, `GeometryCollectionFromText()`, `GeometryCollectionFromWKB()`, `GeometryFromText()`, `GeometryFromWKB()`, `GeometryN()`, `GeometryType()`, `InteriorRingN()`, `IsClosed()`, `IsEmpty()`, `IsSimple()`, `LineFromText()`, `LineFromWKB()`, `LineStringFromText()`, `LineStringFromWKB()`, `MLineFromText()`, `MLineFromWKB()`, `MPointFromText()`, `MPointFromWKB()`, `MPolyFromText()`, `MPolyFromWKB()`, `MultiLineStringFromText()`, `MultiLineStringFromWKB()`, `MultiPointFromText()`, `MultiPointFromWKB()`, `MultiPolygonFromText()`, `MultiPolygonFromWKB()`, `NumGeometries()`, `NumInteriorRings()`, `NumPoints()`, `PointFromText()`, `PointFromWKB()`, `PointN()`, `PolyFromText()`, `PolyFromWKB()`, `PolygonFromText()`, `PolygonFromWKB()`, `SRID()`, `StartPoint()`, `Touches()`, `X()`, `Y()`.

  - `GLength()` é removido em favor de `ST_Length()`.

- As funções descritas na Seção 14.16.4, “Funções que criam valores de geometria a partir de valores WKB”, anteriormente aceitavam strings WKB ou argumentos de geometria. Argumentos de geometria não são mais permitidos e produzem um erro. Consulte essa seção para obter orientações sobre como migrar consultas para não usar argumentos de geometria.

- O analisador não trata mais `\N` como sinônimo de `NULL` em instruções SQL. Use `NULL` em vez disso.

  Essa alteração não afeta as operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, para as quais `NULL` continua sendo representado por `\N`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

- A sintaxe `PROCEDURE ANALYSE()` é removida.

- As opções `--ssl` e `--ssl-verify-server-cert` do lado do cliente foram removidas. Use `--ssl-mode=REQUIRED` em vez de `--ssl=1` ou `--enable-ssl`. Use `--ssl-mode=DISABLED` em vez de `--ssl=0`, `--skip-ssl` ou `--disable-ssl`. Use as opções `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-verify-server-cert`. (A opção `--ssl` do lado do servidor ainda está disponível, mas é desaconselhada a partir do MySQL 8.0.26 e está sujeita à remoção em uma versão futura do MySQL.)

  Para a API C, as opções `MYSQL_OPT_SSL_ENFORCE` e `MYSQL_OPT_SSL_VERIFY_SERVER_CERT` para `mysql_options()` correspondem às opções `--ssl` e `--ssl-verify-server-cert` do lado do cliente e são removidas. Use `MYSQL_OPT_SSL_MODE` com um valor de opção de `SSL_MODE_REQUIRED` ou `SSL_MODE_VERIFY_IDENTITY` em vez disso.

- A opção de servidor `--temp-pool` foi removida.

- A variável de sistema `ignore_builtin_innodb` é removida.

- O servidor não realiza mais a conversão de nomes de bancos de dados anteriores à versão 5.1 do MySQL que contêm caracteres especiais para o formato 5.1, com a adição do prefixo `#mysql50#`. Como essas conversões não são mais realizadas, as opções `--fix-db-names` e `--fix-table-names` para o **mysqlcheck**, a cláusula `UPGRADE DATA DIRECTORY NAME` para a instrução `ALTER DATABASE` e a variável de status `Com_alter_db_upgrade` são removidas.

  As atualizações são suportadas apenas de uma versão principal para outra (por exemplo, 5.0 para 5.1 ou 5.1 para 5.5), portanto, deve haver pouca necessidade de conversão de nomes de bancos de dados mais antigos de 5.0 para as versões atuais do MySQL. Como solução alternativa, atualize uma instalação do MySQL 5.0 para o MySQL 5.1 antes de fazer a atualização para uma versão mais recente.

- O programa **mysql\_install\_db** foi removido das distribuições do MySQL. A inicialização do diretório de dados deve ser realizada invocando o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Além disso, a opção `--bootstrap` para o **mysqld** que era usada pelo **mysql\_install\_db** foi removida, e a opção `INSTALL_SCRIPTDIR` `CMake` que controlava a localização de instalação para o **mysql\_install\_db** foi removida.

- O manipulador de particionamento genérico foi removido do servidor MySQL. Para suportar a particionamento de uma tabela específica, o mecanismo de armazenamento usado para a tabela deve agora fornecer seu próprio manipulador de particionamento ("nativo"). As opções `--partition` e `--skip-partition` são removidas do MySQL Server, e as entradas relacionadas ao particionamento não são mais exibidas na saída do `SHOW PLUGINS` ou na tabela do Schema de Informações `PLUGINS`.

  Atualmente, dois motores de armazenamento do MySQL oferecem suporte nativo para partição: `InnoDB` e `NDB`. Desses, apenas o `InnoDB` é suportado no MySQL 8.0. Qualquer tentativa de criar tabelas particionadas no MySQL 8.0 usando qualquer outro motor de armazenamento falha.

  **Consequências para atualizações.** A atualização direta de uma tabela particionada usando um mecanismo de armazenamento diferente de `InnoDB` (como `MyISAM`) do MySQL 5.7 (ou versões anteriores) para o MySQL 8.0 não é suportada. Existem duas opções para lidar com essa tabela:

  - Remova a partição da tabela, usando `ALTER TABLE ... REMOVE PARTITIONING`.

  - Altere o mecanismo de armazenamento usado para a tabela para `InnoDB`, com `ALTER TABLE ... ENGINE=INNODB`.

  Pelo menos uma das duas operações listadas acima deve ser realizada para cada tabela particionada que não seja `InnoDB` antes de atualizar o servidor para o MySQL 8.0. Caso contrário, essa tabela não poderá ser usada após a atualização.

  Devido ao fato de que as declarações de criação de tabelas que resultariam em uma tabela particionada usando um mecanismo de armazenamento sem suporte à particionamento agora falham com um erro (ER\_CHECK\_NOT\_IMPLEMENTED), você deve garantir que quaisquer declarações em um arquivo de dump (como o escrito pelo **mysqldump**) de uma versão mais antiga do MySQL que você deseja importar para um servidor MySQL 8.0 que criam tabelas particionadas não especifiquem também um mecanismo de armazenamento como `MyISAM` que não tenha um manipulador de particionamento nativo. Você pode fazer isso realizando uma das seguintes ações:

  - Remova quaisquer referências à partição das declarações `CREATE TABLE` que utilizem um valor para a opção `STORAGE ENGINE` diferente de `InnoDB`.

  - Especificar o motor de armazenamento como `InnoDB`, ou permitir que `InnoDB` seja usado como motor de armazenamento da tabela por padrão.

  Para obter mais informações, consulte a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

- As informações das variáveis de sistema e status não são mais mantidas no `INFORMATION_SCHEMA`. Essas tabelas são removidas: `GLOBAL_VARIABLES`, `SESSION_VARIABLES`, `GLOBAL_STATUS`, `SESSION_STATUS`. Use as tabelas correspondentes do Schema de Desempenho. Consulte a Seção 29.12.14, “Tabelas de Variáveis de Sistema do Schema de Desempenho” e a Seção 29.12.15, “Tabelas de Variáveis de Status do Schema de Desempenho”. Além disso, a variável de sistema `show_compatibility_56` foi removida. Ela foi usada no período de transição durante o qual as informações das variáveis de sistema e status nas tabelas `INFORMATION_SCHEMA` foram movidas para as tabelas do Schema de Desempenho, e não é mais necessária. Essas variáveis de status são removidas: `Slave_heartbeat_period`, `Slave_last_heartbeat`, `Slave_received_heartbeats`, `Slave_retried_transactions`, `Slave_running`. As informações que elas forneciam estão disponíveis nas tabelas do Schema de Desempenho; consulte a seção Migrar para as tabelas de variáveis de sistema e status do Schema de Desempenho.

- A tabela Schema de Desempenho `setup_timers` foi removida, assim como a linha `TICK` na tabela `performance_timers`.

- A biblioteca de servidor embutida `libmysqld` é removida, juntamente com:

  - As opções `mysql_options()`, `MYSQL_OPT_GUESS_CONNECTION`, `MYSQL_OPT_USE_EMBEDDED_CONNECTION`, `MYSQL_OPT_USE_REMOTE_CONNECTION` e `MYSQL_SET_CLIENT_IP`

  - As opções **mysql\_config** `--libmysqld-libs`, `--embedded-libs` e `--embedded`

  - As opções **CMake** `WITH_EMBEDDED_SERVER`, `WITH_EMBEDDED_SHARED_LIBRARY` e `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`

  - A opção (não documentada) **mysql** `--server-arg`

  - As opções **mysqltest** `--embedded-server`, `--server-arg` e `--server-file`

  - Os programas de teste **mysqltest\_embedded** e **mysql\_client\_test\_embedded**

- O utilitário **mysql\_plugin** foi removido. As alternativas incluem carregar plugins na inicialização do servidor usando a opção `--plugin-load` ou `--plugin-load-add`, ou em tempo de execução usando a instrução `INSTALL PLUGIN`.

- A utilidade **resolveip** foi removida. **nslookup**, **host** ou **dig** podem ser usados em seu lugar.

- O utilitário **resolve\_stack\_dump** foi removido. As traças de pilha dos builds oficiais do MySQL são sempre simbolizadas, portanto, não há necessidade de usar **resolve\_stack\_dump**.

- Os seguintes códigos de erro do servidor não são usados e foram removidos. As aplicações que testam especificamente para qualquer um desses erros devem ser atualizadas.

  ```
  ER_BINLOG_READ_EVENT_CHECKSUM_FAILURE
  ER_BINLOG_ROW_RBR_TO_SBR
  ER_BINLOG_ROW_WRONG_TABLE_DEF
  ER_CANT_ACTIVATE_LOG
  ER_CANT_CHANGE_GTID_NEXT_IN_TRANSACTION
  ER_CANT_CREATE_FEDERATED_TABLE
  ER_CANT_CREATE_SROUTINE
  ER_CANT_DELETE_FILE
  ER_CANT_GET_WD
  ER_CANT_SET_GTID_PURGED_WHEN_GTID_MODE_IS_OFF
  ER_CANT_SET_WD
  ER_CANT_WRITE_LOCK_LOG_TABLE
  ER_CREATE_DB_WITH_READ_LOCK
  ER_CYCLIC_REFERENCE
  ER_DB_DROP_DELETE
  ER_DELAYED_NOT_SUPPORTED
  ER_DIFF_GROUPS_PROC
  ER_DISK_FULL
  ER_DROP_DB_WITH_READ_LOCK
  ER_DROP_USER
  ER_DUMP_NOT_IMPLEMENTED
  ER_ERROR_DURING_CHECKPOINT
  ER_ERROR_ON_CLOSE
  ER_EVENTS_DB_ERROR
  ER_EVENT_CANNOT_DELETE
  ER_EVENT_CANT_ALTER
  ER_EVENT_COMPILE_ERROR
  ER_EVENT_DATA_TOO_LONG
  ER_EVENT_DROP_FAILED
  ER_EVENT_MODIFY_QUEUE_ERROR
  ER_EVENT_NEITHER_M_EXPR_NOR_M_AT
  ER_EVENT_OPEN_TABLE_FAILED
  ER_EVENT_STORE_FAILED
  ER_EXEC_STMT_WITH_OPEN_CURSOR
  ER_FAILED_ROUTINE_BREAK_BINLOG
  ER_FLUSH_MASTER_BINLOG_CLOSED
  ER_FORM_NOT_FOUND
  ER_FOUND_GTID_EVENT_WHEN_GTID_MODE_IS_OFF__UNUSED
  ER_FRM_UNKNOWN_TYPE
  ER_GOT_SIGNAL
  ER_GRANT_PLUGIN_USER_EXISTS
  ER_GTID_MODE_REQUIRES_BINLOG
  ER_GTID_NEXT_IS_NOT_IN_GTID_NEXT_LIST
  ER_HASHCHK
  ER_INDEX_REBUILD
  ER_INNODB_NO_FT_USES_PARSER
  ER_LIST_OF_FIELDS_ONLY_IN_HASH_ERROR
  ER_LOAD_DATA_INVALID_COLUMN_UNUSED
  ER_LOGGING_PROHIBIT_CHANGING_OF
  ER_MALFORMED_DEFINER
  ER_MASTER_KEY_ROTATION_ERROR_BY_SE
  ER_NDB_CANT_SWITCH_BINLOG_FORMAT
  ER_NEVER_USED
  ER_NISAMCHK
  ER_NO_CONST_EXPR_IN_RANGE_OR_LIST_ERROR
  ER_NO_FILE_MAPPING
  ER_NO_GROUP_FOR_PROC
  ER_NO_RAID_COMPILED
  ER_NO_SUCH_KEY_VALUE
  ER_NO_SUCH_PARTITION__UNUSED
  ER_OBSOLETE_CANNOT_LOAD_FROM_TABLE
  ER_OBSOLETE_COL_COUNT_DOESNT_MATCH_CORRUPTED
  ER_ORDER_WITH_PROC
  ER_PARTITION_SUBPARTITION_ERROR
  ER_PARTITION_SUBPART_MIX_ERROR
  ER_PART_STATE_ERROR
  ER_PASSWD_LENGTH
  ER_QUERY_ON_MASTER
  ER_RBR_NOT_AVAILABLE
  ER_SKIPPING_LOGGED_TRANSACTION
  ER_SLAVE_CHANNEL_DELETE
  ER_SLAVE_MULTIPLE_CHANNELS_HOST_PORT
  ER_SLAVE_MUST_STOP
  ER_SLAVE_WAS_NOT_RUNNING
  ER_SLAVE_WAS_RUNNING
  ER_SP_GOTO_IN_HNDLR
  ER_SP_PROC_TABLE_CORRUPT
  ER_SQL_MODE_NO_EFFECT
  ER_SR_INVALID_CREATION_CTX
  ER_TABLE_NEEDS_UPG_PART
  ER_TOO_MUCH_AUTO_TIMESTAMP_COLS
  ER_UNEXPECTED_EOF
  ER_UNION_TABLES_IN_DIFFERENT_DIR
  ER_UNSUPPORTED_BY_REPLICATION_THREAD
  ER_UNUSED1
  ER_UNUSED2
  ER_UNUSED3
  ER_UNUSED4
  ER_UNUSED5
  ER_UNUSED6
  ER_VIEW_SELECT_DERIVED_UNUSED
  ER_WRONG_MAGIC
  ER_WSAS_FAILED
  ```

- As tabelas desatualizadas `INFORMATION_SCHEMA` `INNODB_LOCKS` e `INNODB_LOCK_WAITS` são removidas. Use as tabelas do Gerenciador de Desempenho `data_locks` e `data_lock_waits` em vez delas.

  Nota

  No MySQL 5.7, a coluna `LOCK_TABLE` na tabela `INNODB_LOCKS` e a coluna `locked_table` nas visões de esquema `innodb_lock_waits` e `x$innodb_lock_waits` do esquema `sys` contêm valores combinados de nome de esquema e tabela. No MySQL 8.0, a tabela `data_locks` e as visões de esquema `sys` contêm colunas separadas para o nome do esquema e do nome da tabela. Consulte a Seção 30.4.3.9, “As visões innodb\_lock\_waits e x$innodb\_lock\_waits”.

- `InnoDB` não suporta mais tabelas temporárias compactadas. Quando `innodb_strict_mode` está habilitado (padrão), `CREATE TEMPORARY TABLE` retorna um erro se `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` for especificado. Se `innodb_strict_mode` estiver desativado, avisos são emitidos e a tabela temporária é criada usando um formato de linha não compactado.

- `InnoDB` não cria mais arquivos `.isl` (arquivos de Encaminhamento Simbólico `InnoDB`) ao criar arquivos de dados do espaço de tabelas fora do diretório de dados do MySQL. A opção `innodb_directories` agora suporta a localização de arquivos de espaço de tabelas criados fora do diretório de dados.

  Com essa mudança, mover um espaço de tabela remoto enquanto o servidor está offline, modificando manualmente um arquivo `.isl`, não é mais suportado. O movimento de arquivos de espaço de tabela remoto agora é suportado pela opção `innodb_directories`. Veja a Seção 17.6.3.6, “Movimento de Arquivos de Espaço de Tabela Enquanto o Servidor está Offline”.

- As seguintes variáveis de formato de arquivo `InnoDB` foram removidas:

  - `innodb_file_format`
  - `innodb_file_format_check`
  - `innodb_file_format_max`
  - `innodb_large_prefix`

  As variáveis de formato de arquivo eram necessárias para criar tabelas compatíveis com versões anteriores do `InnoDB` no MySQL 5.1. Agora que o MySQL 5.1 atingiu o fim de seu ciclo de vida do produto, essas opções não são mais necessárias.

  A coluna `FILE_FORMAT` foi removida das tabelas `INNODB_TABLES` e `INNODB_TABLESPACES` do esquema de informações.

- A variável de sistema `innodb_support_xa`, que permite o suporte para o commit de duas fases em transações XA, foi removida. O suporte `InnoDB` para o commit de duas fases em transações XA está sempre ativado.

- O suporte para o DTrace foi removido.

- A função `JSON_APPEND()` foi removida. Use `JSON_ARRAY_APPEND()` em vez disso.

- O suporte para a colocação de partições de tabelas em espaços de tabelas compartilhados `InnoDB` foi removido no MySQL 8.0.13. Os espaços de tabelas compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabelas gerais. Para obter informações sobre como identificar partições em espaços de tabelas compartilhados e movê-las para espaços de tabelas por arquivo, consulte a Seção 3.6, “Preparando sua instalação para atualização”.

- O suporte para definir variáveis de usuário em declarações que não sejam `SET` foi descontinuado no MySQL 8.0.13. Essa funcionalidade está sujeita à remoção no MySQL 8.4.

- A opção `--ndb` **perror** foi removida. Use o utilitário **ndb\_perror** em vez disso.

- A variável `innodb_undo_logs` foi removida. As variáveis `innodb_rollback_segments` desempenham a mesma função e devem ser usadas em vez dela.

- A variável de status `Innodb_available_undo_logs` foi removida. O número de segmentos de rollback disponíveis por espaço de tabela pode ser obtido usando `SHOW VARIABLES LIKE 'innodb_rollback_segments';`

- A partir do MySQL 8.0.14, a variável `innodb_undo_tablespaces`, anteriormente desaconselhada, não é mais configurável. Para mais informações, consulte a Seção 17.6.3.4, “Reverter Espaços de Tabela”.

- O suporte para a declaração `ALTER TABLE ... UPGRADE PARTITIONING` foi removido.

- A partir do MySQL 8.0.16, o suporte para a variável de sistema `internal_tmp_disk_storage_engine` foi removido; as tabelas temporárias internas no disco agora usam sempre o mecanismo de armazenamento `InnoDB`. Consulte Mecanismo de Armazenamento para Tabelas Temporárias Internas no Disco para obter mais informações.

- A opção `DISABLE_SHARED` **CMake** não foi usada e foi removida.

- A variável de sistema `myisam_repair_threads` é removida a partir do MySQL 8.0.30.
