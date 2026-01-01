## 1.3 O que há de novo no MySQL 5.7

Esta seção resume o que foi adicionado, descontinuado e removido no MySQL 5.7. Uma seção complementar lista as opções e variáveis do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 5.7; veja a Seção 1.4, “Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 5.7”.

### Recursos adicionados no MySQL 5.7

As seguintes funcionalidades foram adicionadas ao MySQL 5.7:

- Melhorias de segurança. Essas melhorias de segurança foram adicionadas:

  - No MySQL 8.0, `caching_sha2_password` é o plugin de autenticação padrão. Para permitir que clientes do MySQL 5.7 se conectem a servidores 8.0 usando contas que autenticam usando `caching_sha2_password`, a biblioteca de clientes do MySQL 5.7 e os programas de clientes suportam o plugin de autenticação do lado do cliente `caching_sha2_password` a partir do MySQL 5.7.23. Isso melhora a compatibilidade do MySQL 5.7 com servidores MySQL 8.0 e superiores. Veja a Seção 6.4.1.4, “Autenticação Personalizável SHA-2”.

  - O servidor agora exige que as linhas de conta na tabela de sistema `mysql.user` tenham um valor não vazio na coluna `plugin` e desabilita as contas com um valor vazio. Para obter instruções de atualização do servidor, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”. Os administradores de banco de dados são aconselhados a converter também as contas que usam o plugin de autenticação `mysql_old_password` para usar `mysql_native_password` em vez disso, porque o suporte ao `mysql_old_password` foi removido. Para obter instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora da hashing de senhas pré-4.1 e do plugin `mysql_old_password`”.

  - Agora, o MySQL permite que os administradores de banco de dados estabeleçam uma política para a expiração automática das senhas: qualquer usuário que se conectar ao servidor usando uma conta para a qual a senha já ultrapassou seu período de validade permitido deve alterar a senha. Para mais informações, consulte a Seção 6.2.11, “Gestão de Senhas”.

  - Os administradores podem bloquear e desbloquear contas para ter um melhor controle sobre quem pode fazer login. Para mais informações, consulte a Seção 6.2.15, “Bloqueio de Conta”.

  - Para facilitar o suporte a conexões seguras, os servidores MySQL compilados com o OpenSSL podem gerar automaticamente os arquivos de certificado e chave SSL e RSA ausentes durante o início. Veja a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando o MySQL”.

    Todos os servidores, se não estiverem configurados explicitamente para SSL, tentam habilitar o SSL automaticamente ao iniciar, se encontrarem os arquivos SSL necessários no diretório de dados. Veja a Seção 6.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”.

    Além disso, as distribuições do MySQL incluem um utilitário **mysql_ssl_rsa_setup** que pode ser acionado manualmente para criar arquivos de chave e certificado SSL e RSA. Para mais informações, consulte a Seção 4.4.5, “mysql_ssl_rsa_setup — Criar arquivos SSL/RSA”.

  - As implantações do MySQL instaladas usando **mysqld --initialize** são seguras por padrão. As seguintes alterações foram implementadas como características de implantação padrão:

    - O processo de instalação cria apenas uma conta `root`, `'root'@'localhost'`, gera automaticamente uma senha aleatória para essa conta e marca a senha como expirada. O administrador do MySQL deve se conectar como `root` usando a senha aleatória e atribuir uma nova senha. (O servidor escreve a senha aleatória no log de erro.)

    - A instalação não cria contas de usuário anônimo.

    - A instalação não cria um banco de dados `test`.

    Para obter mais informações, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

  - A Edição Empresarial do MySQL agora oferece capacidades de mascaramento e desidentificação de dados. O mascaramento de dados oculta informações sensíveis substituindo valores reais por substitutos. As funções de Mascaramento e Desidentificação de Dados do MySQL Enterprise permitem mascarar dados existentes usando vários métodos, como ofuscação (removendo características identificadoras), geração de dados aleatórios formatados e substituição ou substituição de dados. Para mais informações, consulte a Seção 6.5, “Mascaramento e Desidentificação de Dados do MySQL Enterprise”.

  - O MySQL agora define o controle de acesso concedido aos clientes no *pipe* nomeado para o mínimo necessário para uma comunicação bem-sucedida no Windows. O novo software de cliente MySQL pode abrir conexões de *pipe* nomeado sem nenhuma configuração adicional. Se o software de cliente mais antigo não puder ser atualizado imediatamente, a nova variável de sistema `named_pipe_full_access_group` pode ser usada para dar a um grupo do Windows as permissões necessárias para abrir uma conexão de *pipe* nomeado. A associação ao grupo de acesso completo deve ser restrita e temporária.

- **Mudanças no modo SQL.** O modo SQL rigoroso para motores de armazenamento transacional (`STRICT_TRANS_TABLES`) agora está habilitado por padrão.

  A implementação para o modo SQL `ONLY_FULL_GROUP_BY` foi aprimorada, para não mais rejeitar consultas determinísticas que antes eram rejeitadas. Como consequência, esse modo agora está habilitado por padrão, para proibir apenas consultas não determinísticas que contenham expressões que não são garantidamente determinadas de forma única dentro de um grupo.

  Os modos SQL `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` estão sendo descontinuados, mas estão habilitados por padrão. O plano a longo prazo é incluí-los no modo SQL estrito e removê-los como modos explícitos em uma futura versão do MySQL. Consulte as alterações no modo SQL no MySQL 5.7.

  As alterações no modo SQL padrão resultam em um valor padrão da variável de sistema `sql_mode` com esses modos habilitados: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`.

- **ALTER TABLE online.** A cláusula `ALTER TABLE` agora suporta uma cláusula `RENAME INDEX` que renomeia um índice. A alteração é feita *in loco*, sem a necessidade de uma operação de cópia da tabela. Funciona para todos os motores de armazenamento. Consulte a Seção 13.1.8, “Instrução ALTER TABLE”.

- **Plugins de analisador de texto completo ngram e MeCab.** O MySQL oferece um plugin de analisador de texto completo ngram integrado que suporta chinês, japonês e coreano (CJK) e um plugin de analisador de texto completo MeCab instalável para japonês.

  Para obter mais informações, consulte a Seção 12.9.8, “Parser de Texto Completo ngram”, e a Seção 12.9.9, “Plugin do Parser de Texto Completo MeCab”.

- **Melhorias no InnoDB.** Essas melhorias no InnoDB foram adicionadas:

  - O tamanho da coluna `VARCHAR` pode ser aumentado usando uma alteração `ALTER TABLE` in-place, como neste exemplo:

    ```sql
    ALTER TABLE t1 ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(255);
    ```

    Isso é verdade enquanto o número de bytes de comprimento necessários para uma coluna `VARCHAR` permanecer o mesmo. Para colunas `VARCHAR` de tamanho de 0 a 255 bytes, um byte de comprimento é necessário para codificar o valor. Para colunas `VARCHAR` de tamanho de 256 bytes ou mais, são necessários dois bytes de comprimento. Como resultado, a `ALTER TABLE` in-place só suporta o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. A `ALTER TABLE` in-place não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Nesse caso, o número de bytes de comprimento necessários muda de 1 para 2, o que é suportado apenas por uma cópia da tabela (`ALGORITHM=COPY`).

    A redução do tamanho do `VARCHAR` usando `ALTER TABLE` in-place não é suportada. A redução do tamanho do `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

    Para obter mais informações, consulte a Seção 14.13.1, “Operações DDL Online”.

  - O desempenho do DDL para tabelas temporárias do InnoDB foi aprimorado por meio da otimização das instruções `CREATE TABLE`, `DROP TABLE`, `TRUNCATE TABLE` e `ALTER TABLE`.

  - Os metadados das tabelas temporárias do `InnoDB` já não são armazenados nas tabelas do sistema `InnoDB`. Em vez disso, uma nova tabela, `INNODB_TEMP_TABLE_INFO`, oferece aos usuários um *snapshot* das tabelas temporárias ativas. A tabela contém metadados e relatórios sobre todas as tabelas temporárias criadas pelo usuário e pelo sistema que estão ativas dentro de uma determinada instância do `InnoDB`. A tabela é criada quando a primeira instrução `SELECT` é executada contra ela.

  - O `InnoDB` agora suporta os tipos de dados espaciais suportados pelo MySQL. Antes desta versão, o `InnoDB` armazenava dados espaciais como dados binários `BLOB`. O `BLOB` continua sendo o tipo de dados subjacente, mas os tipos de dados espaciais agora são mapeados para um novo tipo de dados interno do `InnoDB`, `DATA_GEOMETRY`.

  - Agora existe um espaço de tabelas separado para todas as tabelas temporárias `InnoDB` não compactadas. O novo espaço de tabelas é sempre recriado ao iniciar o servidor e está localizado em `DATADIR` por padrão. Uma opção de arquivo de configuração recém-adicionada, `innodb_temp_data_file_path`, permite um caminho de arquivo de dados temporário definido pelo usuário.

  - A funcionalidade **innochecksum** foi aprimorada com várias novas opções e capacidades ampliadas. Veja a Seção 4.6.1, “innochecksum — Ferramenta de Verificação de Checksum de Arquivo InnoDB Offline”.

  - Um novo tipo de registro de desfazer não-refazer para tabelas temporárias normais e comprimidas e objetos relacionados agora reside no espaço de tabelas temporárias. Para obter mais informações, consulte a Seção 14.6.7, “Registros de desfazer”.

  - As operações de exclusão e carregamento do pool de buffers de `InnoDB` foram aprimoradas. Uma nova variável de sistema, `innodb_buffer_pool_dump_pct`, permite que você especifique a porcentagem de páginas mais recentemente usadas em cada pool de buffers para exclusão. Quando há outra atividade de E/S sendo realizada por tarefas de segundo plano do `InnoDB`, o `InnoDB` tenta limitar o número de operações de carregamento do pool de buffers por segundo usando a configuração `innodb_io_capacity`.

  - O suporte foi adicionado ao `InnoDB` para plugins de analisadores de texto completo. Para obter informações sobre plugins de analisadores de texto completo, consulte Plugins de Analisador de Texto Completo e Como Escrever Plugins de Analisador de Texto Completo.

  - O `InnoDB` suporta vários threads de limpador de páginas para esvaziar páginas sujas das instâncias do pool de buffers. Uma nova variável de sistema, `innodb_page_cleaners`, é usada para especificar o número de threads de limpador de páginas. O valor padrão de `1` mantém a configuração anterior, na qual há um único thread de limpador de páginas. Essa melhoria é baseada no trabalho concluído no MySQL 5.6, que introduziu um único thread de limpador de páginas para transferir o trabalho de esvaziamento do pool de buffers do thread mestre do `InnoDB`.

  - O suporte online para DDL é estendido às seguintes operações para tabelas `InnoDB` regulares e particionadas:

    - `OPTIMIZE TABLE`

    - `ALTER TABLE ... FORCE`

    - `ALTER TABLE ... ENGINE=INNODB` (quando executado em uma tabela `InnoDB`)

      O suporte DDL online reduz o tempo de reconstrução da tabela e permite operações DML concorrentes. Consulte a Seção 14.13, “InnoDB e DDL Online”.

  - O sistema de arquivos de memória não volátil (NVM) Fusion-io no Linux oferece capacidade de gravação atômica, o que torna o buffer de gravação dupla do `InnoDB` redundante. O buffer de gravação dupla do `InnoDB` é desativado automaticamente para arquivos de tablespace do sistema (arquivos ibdata) localizados em dispositivos Fusion-io que suportam gravações atômicas.

  - O `InnoDB` suporta o recurso Transportable Tablespace para tabelas `InnoDB` particionadas e particionamentos individuais de tabelas `InnoDB`. Essa melhoria facilita os procedimentos de backup para tabelas particionadas e permite a cópia de tabelas particionadas e particionamentos individuais de tabelas entre instâncias do MySQL. Para mais informações, consulte a Seção 14.6.1.3, “Importando Tabelas InnoDB”.

  - O parâmetro `innodb_buffer_pool_size` é dinâmico, permitindo que você redimensione o pool de buffers sem precisar reiniciar o servidor. A operação de redimensionamento, que envolve o deslocamento de páginas para um novo local na memória, é realizada em lotes. O tamanho do lote é configurável usando a nova opção de configuração `innodb_buffer_pool_chunk_size`. Você pode monitorar o progresso do redimensionamento usando a nova variável de status `Innodb_buffer_pool_resize_status`. Para mais informações, consulte Configurando o Tamanho do Pool de Buffers InnoDB Online.

  - O suporte ao limpador de páginas multithread (`innodb_page_cleaners`) foi estendido para as fases de desligamento e recuperação.

  - O `InnoDB` suporta a indexação de tipos de dados espaciais usando índices `SPATIAL`, incluindo o uso de `ALTER TABLE ... ALGORITHM=INPLACE` para operações online (`ADD SPATIAL INDEX`).

  - O `InnoDB` realiza uma carga em massa ao criar ou reconstruir índices. Esse método de criação de índices é conhecido como “construção de índice ordenado”. Essa melhoria, que melhora a eficiência da criação de índices, também se aplica a índices de texto completo. Uma nova opção de configuração global, `innodb_fill_factor`, define a porcentagem de espaço em cada página que é preenchida com dados durante a construção de um índice ordenado, com o espaço restante reservado para o crescimento futuro do índice. Para mais informações, consulte a Seção 14.6.2.3, “Construções de Índices Ordenados”.

  - Um novo tipo de registro de log (`MLOG_FILE_NAME`) é usado para identificar espaços de tabela que foram modificados desde o último ponto de verificação. Essa melhoria simplifica a descoberta de espaços de tabela durante a recuperação em caso de falha e elimina as varreduras no sistema de arquivos antes da aplicação do log de *redo*. Para obter mais informações sobre os benefícios dessa melhoria, consulte Descoberta de Espaço de Tabela Durante a Recuperação em Caso de Falha.

    Essa melhoria altera o formato do log de reversão, exigindo que o MySQL seja desligado corretamente antes de fazer a atualização ou a desatualização para ou a partir do MySQL 5.7.5.

  - Você pode truncar os logs de desfazer que residem em tablespaces de desfazer. Esse recurso é habilitado usando a opção de configuração `innodb_undo_log_truncate`. Para obter mais informações, consulte Truncando Tablespaces de Desfazer.

  - O `InnoDB` suporta partição nativa. Anteriormente, o `InnoDB` dependia do manipulador `ha_partition`, que criava um objeto de manipulador para cada partição. Com a partição nativa, uma tabela `InnoDB` particionada usa um único objeto de manipulador sensível à partição. Essa melhoria reduz a quantidade de memória necessária para tabelas `InnoDB` particionadas.

    A partir do MySQL 5.7.9, o **mysql_upgrade** procura e tenta atualizar tabelas `InnoDB` particionadas que foram criadas usando o manipulador `ha_partition`. Além disso, no MySQL 5.7.9 e versões posteriores, você pode atualizar essas tabelas pelo nome no cliente **mysql** usando `ALTER TABLE ... UPGRADE PARTITIONING`.

  - O `InnoDB` suporta a criação de espaços de tabelas gerais usando a sintaxe `CREATE TABLESPACE`.

    ```sql
    CREATE TABLESPACE `tablespace_name`
      ADD DATAFILE 'file_name.ibd'
      [FILE_BLOCK_SIZE = n]
    ```

    Os espaços de tabela gerais podem ser criados fora do diretório de dados do MySQL, podem armazenar múltiplas tabelas e suportar tabelas de todos os formatos de linha.

    As tabelas são adicionadas a um espaço de tabelas geral usando a sintaxe `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`.

    Para obter mais informações, consulte a Seção 14.6.3.3, “Tabelas gerais”.

  - `DYNAMIC` substitui `COMPACT` como o formato de linha padrão implícito para tabelas `InnoDB`. Uma nova opção de configuração, `innodb_default_row_format`, especifica o formato de linha padrão `InnoDB`.

  - A partir do MySQL 5.7.11, o `InnoDB` suporta criptografia de dados em repouso para espaços de tabelas por arquivo. A criptografia é habilitada especificando a opção `ENCRYPTION` ao criar ou alterar uma tabela `InnoDB`. Esse recurso depende de um plugin `keyring` para gerenciamento de chaves de criptografia. Para mais informações, consulte a Seção 6.4.4, “O MySQL Keyring”, e a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

  - A partir do MySQL 5.7.24, a versão da biblioteca `zlib` incluída com o MySQL foi elevada da versão 1.2.3 para a versão 1.2.11. O MySQL implementa a compressão com a ajuda da biblioteca `zlib`.

    Se você estiver usando tabelas compactadas do InnoDB, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”, para obter informações sobre as implicações do upgrade.

- **Suporte JSON.** A partir do MySQL 5.7.8, o MySQL suporta um tipo nativo `JSON`. Os valores JSON não são armazenados como strings, mas sim em um formato binário interno que permite acesso rápido aos elementos do documento. Os documentos JSON armazenados em colunas `JSON` são automaticamente validados sempre que são inseridos ou atualizados, e um documento inválido produz um erro. Os documentos JSON são normalizados na criação e podem ser comparados usando a maioria dos operadores de comparação, como `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`; para informações sobre os operadores suportados, bem como sobre a precedência e outras regras que o MySQL segue ao comparar valores `JSON`, consulte Comparação e Ordenação de Valores JSON.

  O MySQL 5.7.8 também introduz várias funções para trabalhar com valores `JSON`. Essas funções incluem as listadas aqui:

  - Funções que criam valores `JSON`: `JSON_ARRAY()`, `JSON_MERGE()` e `JSON_OBJECT()`. Veja a Seção 12.17.2, “Funções que criam valores JSON”.

  - Funções que buscam valores `JSON`: `JSON_CONTAINS()`, `JSON_CONTAINS_PATH()`, `JSON_EXTRACT()`, `JSON_KEYS()` e `JSON_SEARCH()`. Consulte a Seção 12.17.3, “Funções que buscam valores JSON”.

  - Funções que modificam valores `JSON`: `JSON_APPEND()`, `JSON_ARRAY_APPEND()`, `JSON_ARRAY_INSERT()`, `JSON_INSERT()`, `JSON_QUOTE()`, `JSON_REMOVE()`, `JSON_REPLACE()`, `JSON_SET()` e `JSON_UNQUOTE()`. Consulte a Seção 12.17.4, “Funções que modificam valores JSON”.

  - Funções que fornecem informações sobre os valores `JSON`: `JSON_DEPTH()`, `JSON_LENGTH()`, `JSON_TYPE()` e `JSON_VALID()`. Consulte a Seção 12.17.5, “Funções que retornam atributos de valores JSON”.

  No MySQL 5.7.9 e versões posteriores, você pode usar `column->path` como uma abreviação para `JSON_EXTRACT(column, path)`. Isso funciona como um alias para uma coluna em qualquer lugar onde um identificador de coluna possa ocorrer em uma instrução SQL, incluindo cláusulas `WHERE`, `ORDER BY` e `GROUP BY`. Isso inclui `SELECT`, `UPDATE`, `DELETE`, `CREATE TABLE` e outras instruções SQL. O lado esquerdo deve ser um identificador de coluna `JSON` (e não um alias). O lado direito é uma expressão de caminho JSON entre aspas que é avaliada contra o documento JSON retornado como o valor da coluna.

  O MySQL 5.7.22 adiciona as seguintes funções JSON:

  - Duas funções de agregação JSON `JSON_ARRAYAGG()` e `JSON_OBJECTAGG()`. `JSON_ARRAYAGG()` recebe uma coluna ou expressão como argumento e agrupa o resultado como um único array `JSON`. A expressão pode avaliar qualquer tipo de dado MySQL; isso não precisa ser um valor `JSON`. `JSON_OBJECTAGG()` recebe duas colunas ou expressões que interpreta como uma chave e um valor; ele retorna o resultado como um único objeto `JSON`. Para mais informações e exemplos, consulte a Seção 12.19, “Funções de Agregação”.

  - A função utilitária JSON `JSON_PRETTY()`, que exibe um valor JSON existente em um formato fácil de ler; cada membro de um objeto JSON ou valor de um array é impresso em uma linha separada, e um objeto ou array filho é alinhado a 2 espaços em relação ao seu pai.

    Essa função também funciona com uma string que pode ser analisada como um valor JSON.

    Veja também a Seção 12.17.6, “Funções de Utilitário JSON”.

  - A função utilitária JSON `JSON_STORAGE_SIZE()`, que retorna o espaço de armazenamento em bytes usado para a representação binária de um documento JSON antes de qualquer atualização parcial (veja o item anterior).

    Essa função também aceita uma representação de string válida de um documento JSON. Para esse valor, `JSON_STORAGE_SIZE()` retorna o espaço usado por sua representação binária após sua conversão em um documento JSON. Para uma variável que contém a representação de string de um documento JSON, `JSON_STORAGE_FREE()` retorna zero. Qualquer uma dessas funções produz um erro se seu argumento (não nulo) não puder ser analisado como um documento JSON válido e `NULL` se o argumento for `NULL`.

    Para obter mais informações e exemplos, consulte a Seção 12.17.6, “Funções de Utilitário JSON”.

  - Uma função de junção de JSON destinada a conformar-se com o RFC 7396. `JSON_MERGE_PATCH()`, quando usada em 2 objetos JSON, os une em um único objeto JSON que tem como membros uma união dos seguintes conjuntos:

    - Cada membro do primeiro objeto para o qual não há nenhum membro com a mesma chave no segundo objeto.

    - Cada membro do segundo objeto para o qual não há nenhum membro com a mesma chave no primeiro objeto, e cujo valor não é o literal `null` do JSON.

    - Cada membro tem uma chave que existe em ambos os objetos e cujo valor no segundo objeto não é o literal `null` do JSON.

    Como parte desse trabalho, a função `JSON_MERGE()` foi renomeada para `JSON_MERGE_PRESERVE()`. `JSON_MERGE()` continua sendo reconhecida como um alias para `JSON_MERGE_PRESERVE()` no MySQL 5.7, mas agora é desaconselhada e está sujeita à remoção em uma versão futura do MySQL.

    Para obter mais informações e exemplos, consulte a Seção 12.17.4, “Funções que modificam valores JSON”.

  Consulte a Seção 12.17.3, “Funções que buscam valores JSON”, para obter mais informações sobre `->` e `JSON_EXTRACT()`. Para informações sobre o suporte a caminhos JSON no MySQL 5.7, consulte Procurar e modificar valores JSON. Veja também Indexação de uma coluna gerada para fornecer um índice de coluna JSON.

- **Variáveis de sistema e status.** As informações das variáveis de sistema e status agora estão disponíveis nas tabelas do Schema de Desempenho, em vez de usar as tabelas do `INFORMATION_SCHEMA` para obter essas variáveis. Isso também afeta o funcionamento das instruções `SHOW VARIABLES` e `SHOW STATUS`. O valor da variável de sistema `show_compatibility_56` afeta a saída produzida e os privilégios necessários para as instruções e tabelas de variáveis de sistema e status. Para mais detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

  ::: info Nota

  O valor padrão para `show_compatibility_56` é `OFF`. Aplicações que exigem o comportamento 5.6 devem definir essa variável para `ON` até que tenham sido migradas para o novo comportamento das variáveis de sistema e status. Consulte a Seção 25.20, “Migração para as tabelas de variáveis de sistema e status do Performance Schema”

  :::

- As distribuições do MySQL agora incluem o esquema `sys`, que é um conjunto de objetos que ajudam os administradores de banco de dados (DBAs) e desenvolvedores a interpretar os dados coletados pelo Schema de Desempenho. Os objetos do esquema `sys` podem ser usados para casos típicos de ajuste e diagnóstico. Para mais informações, consulte o Capítulo 26, *Esquema MySQL sys*.

- **Manipulação de condições.** O MySQL agora suporta áreas de diagnóstico empilhadas. Quando a pilha de áreas de diagnóstico é empilhada, a primeira (atual) área de diagnóstico torna-se a segunda (empilhada) área de diagnóstico e uma nova área de diagnóstico atual é criada como uma cópia dela. Dentro de um manipulador de condição, as instruções executadas modificam a nova área de diagnóstico atual, mas o `GET DIAGNOSTICS` pode ser usado para inspecionar a área de diagnóstico empilhada para obter informações sobre a condição que causou o acionamento do manipulador, independentemente das condições atuais dentro do próprio manipulador. (Anteriormente, havia uma única área de diagnóstico. Para inspecionar as condições que ativam o manipulador dentro de um manipulador, era necessário verificar essa área de diagnóstico antes de executar quaisquer instruções que pudessem modificá-la.) Veja a Seção 13.6.7.3, “Instrução GET DIAGNOSTICS” e a Seção 13.6.7.7, “A Área de Diagnóstico do MySQL”.

- **Otimizador.** Essas melhorias no otimizador foram adicionadas:

  - O comando `EXPLAIN` pode ser usado para obter o plano de execução de uma instrução explicável que esteja sendo executada em uma conexão nomeada:

    ```sql
    EXPLAIN [options] FOR CONNECTION connection_id;
    ```

    Para obter mais informações, consulte a Seção 8.8.4, “Obtendo informações do plano de execução para uma conexão nomeada”.

  - É possível fornecer dicas ao otimizador dentro de declarações SQL individuais, o que permite um controle mais preciso sobre os planos de execução das declarações do que pode ser alcançado usando a variável de sistema `optimizer_switch`. As dicas também são permitidas em declarações usadas com `EXPLAIN`, permitindo que você veja como as dicas afetam os planos de execução. Para mais informações, consulte a Seção 8.9.3, “Dicas do Otimizador”.

  - **indicador prefer_ordering_index.** Por padrão, o MySQL tenta usar um índice ordenado para qualquer consulta `ORDER BY` ou `GROUP BY` que tenha uma cláusula `LIMIT`, sempre que o otimizador determinar que isso resultaria em uma execução mais rápida. Como é possível, em alguns casos, que escolher uma otimização diferente para essas consultas realmente funcione melhor, é possível, a partir do MySQL 5.7.33, desativar essa otimização definindo o indicador `prefer_ordering_index` para `off`.

    O valor padrão para essa bandeira é `on`.

    Para obter mais informações e exemplos, consulte a Seção 8.9.2, “Otimizações Alternativas”, e a Seção 8.2.1.17, “Otimização da Consulta LIMIT”.

- **Triggers.** Anteriormente, uma tabela poderia ter no máximo um trigger para cada combinação de evento de trigger (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`). Essa limitação foi removida e múltiplos triggers são permitidos. Para mais informações, consulte a Seção 23.3, “Usando Triggers”.

- **Registro de atividades.** Essas melhorias no registro de atividades foram adicionadas:

  - Anteriormente, em sistemas Unix e similares, o suporte do MySQL para enviar o log de erros do servidor para o `syslog` era implementado com o **mysqld_safe** capturando a saída de erros do servidor e passando para o `syslog`. Agora, o servidor inclui suporte nativo para `syslog`, que foi estendido para incluir o Windows. Para mais informações sobre como enviar a saída de erros do servidor para o `syslog`, consulte a Seção 5.4.2, “O Log de Erros”.

  - O cliente **mysql** agora tem uma opção `--syslog` que faz com que as instruções interativas sejam enviadas para a ferramenta `syslog` do sistema. O registro é suprimido para instruções que correspondem à lista padrão de padrões de “ignorar” (`"*IDENTIFIED*:*PASSWORD*"`), bem como para instruções que correspondem a quaisquer padrões especificados usando a opção `--histignore`. Veja a Seção 4.5.1.3, “Registro do Cliente mysql”.

- **Colunas Geradas.** O MySQL agora suporta a especificação de colunas geradas nas instruções `CREATE TABLE` e `ALTER TABLE`. Os valores de uma coluna gerada são calculados a partir de uma expressão especificada no momento da criação da coluna. Colunas geradas podem ser virtuais (calculadas “on the fly” quando as linhas são lidas) ou armazenadas (calculadas quando as linhas são inseridas ou atualizadas). Para mais informações, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

- **Cliente MySQL.** Anteriormente, o **Control+C** no mysql interrompia a declaração atual, se houvesse uma, ou encerrava o mysql se não houvesse. Agora, o **Control+C** interrompe a declaração atual, se houvesse uma, ou cancela qualquer linha de entrada parcial, caso contrário, mas não encerra.

- **Reescrita do nome do banco de dados com mysqlbinlog.** O renomeamento de bancos de dados pelo **mysqlbinlog** ao ler logs binários escritos no formato baseado em linhas agora é suportado usando a opção `--rewrite-db` adicionada no MySQL 5.7.1.

  Esta opção utiliza o formato `--rewrite-db='dboldname->dbnewname'`. Você pode implementar várias regras de reescrita, especificando a opção várias vezes.

- **HANDLER com tabelas particionadas.** A instrução `HANDLER` agora pode ser usada com tabelas particionadas pelo usuário. Essas tabelas podem usar qualquer um dos tipos de particionamento disponíveis (consulte a Seção 22.2, “Tipos de particionamento”).

- Suporte à otimização de condições de índice para tabelas particionadas. As consultas em tabelas particionadas usando os motores de armazenamento `InnoDB` ou `MyISAM` podem utilizar a otimização de empilhamento de condições de índice, que foi introduzida no MySQL 5.6. Consulte a Seção 8.2.1.5, “Otimização de Empilhamento de Condições de Índice”, para obter mais informações.

- **WITHOUT VALIDATION, suporte para ALTER TABLE ... EXCHANGE PARTITION.** A partir do MySQL 5.7.5, a sintaxe `ALTER TABLE ... EXCHANGE PARTITION` inclui uma cláusula opcional `{WITH|WITHOUT} VALIDATION`. Quando `WITHOUT VALIDATION` é especificado, `ALTER TABLE ... EXCHANGE PARTITION` não realiza validação linha a linha ao trocar uma tabela preenchida com a partição, permitindo que os administradores de banco de dados assumam a responsabilidade de garantir que as linhas estejam dentro dos limites da definição da partição. `WITH VALIDATION` é o comportamento padrão e não precisa ser especificado explicitamente. Para mais informações, consulte a Seção 22.3.3, “Trocando Partições e Subpartições com Tabelas”.

- Melhorias no thread de exaustão de fontes. O thread de exaustão de fontes foi refatorado para reduzir a disputa por bloqueios e melhorar o desempenho da fonte. Antes do MySQL 5.7.2, o thread de exaustão de fontes tomava um bloqueio no log binário sempre que lia um evento; no MySQL 5.7.2 e versões posteriores, esse bloqueio é mantido apenas enquanto lê a posição no final do último evento escrito com sucesso. Isso significa que vários threads de exaustão de fontes agora podem ler simultaneamente do arquivo do log binário e que os threads de exaustão de fontes agora podem ler enquanto os clientes estão escrevendo no log binário.

- **Suporte a conjuntos de caracteres.** O MySQL 5.7.4 inclui um conjunto de caracteres `gb18030` que suporta o conjunto de caracteres padrão nacional da China GB18030. Para obter mais informações sobre o suporte a conjuntos de caracteres do MySQL, consulte o Capítulo 10, *Conjunto de caracteres, Colagens, Unicode*.

- **Mudando a fonte de replicação sem executar o comando `STOP SLAVE`.** No MySQL 5.7.4 e versões posteriores, a exigência rigorosa de executar o comando `STOP SLAVE` antes de emitir qualquer declaração `CHANGE MASTER TO` é removida. Em vez de depender se a replica está parada, o comportamento do `CHANGE MASTER TO` agora depende dos estados dos threads SQL da replica e dos threads de E/S da replica; qual desses threads está parado ou em execução agora determina as opções que podem ou não podem ser usadas com uma declaração `CHANGE MASTER TO` em um determinado momento. As regras para determinar isso estão listadas aqui:

  - Se a thread SQL estiver parada, você pode executar `CHANGE MASTER TO` usando qualquer combinação das opções `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `MASTER_DELAY`, mesmo que a thread de I/O da replica esteja em execução. Nenhuma outra opção pode ser usada com essa instrução quando a thread de I/O estiver em execução.

  - Se a thread de E/S estiver parada, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções desta instrução (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou `MASTER_DELAY`, mesmo quando a thread SQL estiver em execução. Essas três opções não podem ser usadas quando a thread de E/S estiver em execução.

  - Tanto a thread SQL quanto o thread de E/S devem ser interrompidos antes de emitir `CHANGE MASTER TO ... MASTER_AUTO_POSITION = 1`.

  Você pode verificar o estado atual das threads replicadas de SQL e I/O usando `SHOW SLAVE STATUS`.

  Se você estiver usando replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE MASTER TO` após uma declaração `STOP SLAVE` deixe tabelas temporárias na replica. Como parte deste conjunto de melhorias, agora é emitido um aviso sempre que `CHANGE MASTER TO` é emitido após `STOP SLAVE` quando a replicação baseada em declarações está em uso e `Slave_open_temp_tables` permanece maior que 0.

  Para obter mais informações, consulte a Seção 13.4.2.1, “Instrução CHANGE MASTER TO”, e a Seção 16.3.7, “Alteração de fontes durante o failover”.

- **Conjunto de testes.** O conjunto de testes do MySQL agora usa o `InnoDB` como o motor de armazenamento padrão.

- **A replicação de múltiplas fontes agora é possível.** A Replicação de Múltiplas Fontes do MySQL adiciona a capacidade de replicar de múltiplas fontes para uma réplica. As topologias de Replicação de Múltiplas Fontes do MySQL podem ser usadas para fazer backup de múltiplos servidores para um único servidor, para fundir fragmentos de tabelas e consolidar dados de múltiplos servidores para um único servidor. Veja a Seção 16.1.5, “Replicação de Múltiplas Fontes do MySQL”.

  Como parte da Replicação Multifonte do MySQL, canais de replicação foram adicionados. Os canais de replicação permitem que uma réplica abra múltiplas conexões para replicar, com cada canal sendo uma conexão a uma fonte. Veja a Seção 16.2.2, “Canais de Replicação”.

- **Tabelas do esquema de desempenho da replicação em grupo.** O MySQL 5.7 adiciona várias novas tabelas ao Esquema de Desempenho para fornecer informações sobre grupos e canais de replicação. Essas tabelas incluem as seguintes:

  + `replication_applier_configuration`
  + `replication_applier_status`
  + `replication_applier_status_by_coordinator`
  + `replication_applier_status_by_worker`
  + `replication_connection_configuration`
  + `replication_connection_status`
  + `replication_group_members`
  + `replication_group_member_stats`

  Todas essas tabelas foram adicionadas no MySQL 5.7.2, exceto `replication_group_members` e `replication_group_member_stats`, que foram adicionadas no MySQL 5.7.6. Para mais informações, consulte a Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”.

- **Replicação em grupo SQL.** As seguintes declarações foram adicionadas no MySQL 5.7.6 para controlar a Replicação em grupo:

  + `START GROUP_REPLICATION`
  + `STOP GROUP_REPLICATION`

  Para obter mais informações, consulte a Seção 13.4.3, “Instruções SQL para controle da replicação de grupo”.

### Recursos descontinuados no MySQL 5.7

As seguintes funcionalidades são desaconselhadas no MySQL 5.7 e podem ser removidas em uma futura versão. Quando houver alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações que utilizam recursos desatualizados no MySQL 5.7 e que foram removidos em uma versão superior do MySQL, as instruções podem falhar ao serem replicadas de uma fonte MySQL 5.7 para uma réplica de uma versão superior. Além disso, podem ter efeitos diferentes na fonte e na réplica. Para evitar esses problemas, as aplicações que utilizam recursos desatualizados no 5.7 devem ser revisadas para evitar esses problemas e usar alternativas quando possível.

- Os modos SQL `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` estão sendo descontinuados, mas estão habilitados por padrão. O plano a longo prazo é incluí-los no modo SQL estrito e removê-los como modos explícitos em uma futura versão do MySQL.

  Os modos SQL `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`, que estão sendo descontinuados, ainda são reconhecidos, para que as instruções que os nomeiam não produzam um erro, mas devem ser removidos em uma versão futura do MySQL. Para se preparar antecipadamente para versões do MySQL nas quais esses nomes de modos não existem, as aplicações devem ser modificadas para não se referirem a eles. Veja as alterações nos modos SQL no MySQL 5.7.

- Esses modos SQL estão sendo descontinuados; espere-os serem removidos em uma versão futura do MySQL: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`. Essas descontinuidades têm duas implicações:

  - Atribuir um modo desatualizado à variável de sistema `sql_mode` produz um aviso.

  - Com o modo SQL `MAXDB` ativado, o uso de `CREATE TABLE` ou `ALTER TABLE` para adicionar uma coluna `TIMESTAMP` a uma tabela gera uma mensagem de aviso.

- As alterações nas declarações de gerenciamento de contas tornam os seguintes recursos obsoletos. Eles agora estão desatualizados:

  - Use `GRANT` para criar usuários. Em vez disso, use `CREATE USER`. Seguir essa prática torna o modo SQL `NO_AUTO_CREATE_USER` irrelevante para as instruções `GRANT`, então ele também é desaconselhado.

  - Use `GRANT` para modificar propriedades da conta, exceto atribuições de privilégios. Isso inclui propriedades de autenticação, SSL e limite de recursos. Em vez disso, defina essas propriedades no momento da criação da conta com `CREATE USER` ou modifique-as depois com `ALTER USER`.

  - A sintaxe `IDENTIFIED BY PASSWORD 'auth_string'` para `CREATE USER` e `GRANT`. Em vez disso, use `IDENTIFIED WITH auth_plugin AS 'auth_string'` para `CREATE USER` e `ALTER USER`, onde o valor `'auth_string'` está em um formato compatível com o plugin nomeado.

  - A função `PASSWORD()` está desatualizada e deve ser evitada em qualquer contexto. Portanto, a sintaxe `SET PASSWORD ... = PASSWORD('auth_string')` também está desatualizada. A sintaxe `SET PASSWORD ... = 'auth_string'` não está desatualizada; no entanto, `ALTER USER` é agora a instrução preferida para atribuir senhas.

  - A variável de sistema `old_passwords`. Os plugins de autenticação de contas não podem mais ser deixados não especificados na tabela de sistema `mysql.user`, então qualquer declaração que atribua uma senha a partir de uma string em texto claro pode determinar de forma inequívoca o método de hashing a ser usado na string antes de armazená-la na tabela `mysql.user`. Isso torna `old_passwords` superfísico.

- O cache de consultas está desatualizado. A desatualização inclui os seguintes itens:

  - As instruções `FLUSH QUERY CACHE` e `RESET QUERY CACHE`.

  - Os modificadores `SQL_CACHE` e `SQL_NO_CACHE` do `SELECT`.

  - Essas variáveis de sistema: `have_query_cache`, `ndb_cache_check_time`, `query_cache_limit`, `query_cache_min_res_unit`, `query_cache_size`, `query_cache_type`, `query_cache_wlock_invalidate`.

  - Essas variáveis de status: `Qcache_free_blocks`, `Qcache_free_memory`, `Qcache_hits`, `Qcache_inserts`, `Qcache_lowmem_prunes`, `Qcache_not_cached`, `Qcache_queries_in_cache`, `Qcache_total_blocks`.

- Anteriormente, as opções de inicialização do servidor `--transaction-isolation` e `--transaction-read-only` correspondiam às variáveis de sistema `tx_isolation` e `tx_read_only`. Para uma melhor correspondência entre as opções de inicialização e os nomes das variáveis de sistema, `transaction_isolation` e `transaction_read_only` foram criadas como aliases para `tx_isolation` e `tx_read_only`. As variáveis `tx_isolation` e `tx_read_only` são agora desatualizadas; espera-se que sejam removidas no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_isolation` e `transaction_read_only` em vez disso.

- A opção `--skip-innodb` e seus sinônimos (`--innodb=OFF`, `--disable-innodb`, e assim por diante) estão desatualizadas. Essas opções não têm efeito a partir do MySQL 5.7, pois o `InnoDB` não pode ser desativado.

- As opções `--ssl` e `--ssl-verify-server-cert` do lado do cliente estão desatualizadas. Use `--ssl-mode=REQUIRED` em vez de `--ssl=1` ou `--enable-ssl`. Use `--ssl-mode=DISABLED` em vez de `--ssl=0`, `--skip-ssl` ou `--disable-ssl`. Use `--ssl-mode=VERIFY_IDENTITY` em vez das opções `--ssl-verify-server-cert`. (A opção `--ssl` do lado do servidor *não* está desatualizada.)

  Para a API C, as opções `MYSQL_OPT_SSL_ENFORCE` e `MYSQL_OPT_SSL_VERIFY_SERVER_CERT` para `mysql_options()` correspondem às opções `--ssl` e `--ssl-verify-server-cert` do lado do cliente e são desaconselhadas. Use `MYSQL_OPT_SSL_MODE` com um valor de opção de `SSL_MODE_REQUIRED` ou `SSL_MODE_VERIFY_IDENTITY` em vez disso.

- A variável de sistema `log_warnings` e a opção de servidor `--log-warnings` estão desatualizadas. Use a variável de sistema `log_error_verbosity` em vez disso.

- A opção de servidor `--temp-pool` está desatualizada.

- A variável de sistema `binlog_max_flush_queue_time` não faz nada no MySQL 5.7 e está desaconselhada a partir do MySQL 5.7.9.

- A variável de sistema `innodb_support_xa`, que habilita o suporte `InnoDB` para o compromisso de duas fases em transações XA, está desatualizada a partir do MySQL 5.7.10. O suporte `InnoDB` para o compromisso de duas fases em transações XA está sempre ativado a partir do MySQL 5.7.10.

- As variáveis de sistema `metadata_locks_cache_size` e `metadata_locks_hash_instances` estão desatualizadas. Essas variáveis não fazem nada a partir do MySQL 5.7.4.

- A variável de sistema `sync_frm` está desatualizada.

- As variáveis de sistema globais `character_set_database` e `collation_database` estão desatualizadas; espera-se que sejam removidas em uma versão futura do MySQL.

  Atribuir um valor às variáveis de sessão `character_set_database` e `collation_database` é desaconselhável e as atribuições produzem um aviso. Espera-se que as variáveis de sessão se tornem somente de leitura em uma versão futura do MySQL, e as atribuições a elas produzirão um erro, enquanto ainda é possível ler as variáveis de sessão para determinar o conjunto de caracteres e a collation do banco de dados padrão.

- O escopo global para a variável de sistema `sql_log_bin` foi descontinuado, e essa variável agora pode ser definida apenas com escopo de sessão. A instrução `SET GLOBAL SQL_LOG_BIN` agora produz um erro. Ainda é possível ler o valor global de `sql_log_bin`, mas isso produz uma mensagem de aviso. Você deve agir agora para remover de suas aplicações quaisquer dependências de leitura desse valor; o escopo global `sql_log_bin` é removido no MySQL 8.0.

- Com a introdução do dicionário de dados no MySQL 8.0, a opção `--ignore-db-dir` e a variável de sistema `ignore_db_dirs` tornaram-se supérfluas e foram removidas nessa versão. Consequentemente, elas são desaconselhadas no MySQL 5.7.

- O `GROUP BY` ordena implicitamente por padrão (ou seja, na ausência de designadores `ASC` ou `DESC`), mas a dependência da ordenação `GROUP BY` implícita no MySQL 5.7 é desaconselhada. Para obter uma ordem de classificação específica dos resultados agrupados, é preferível usar Para produzir uma ordem de classificação específica, use designadores `ASC` ou `DESC` explícitos para as colunas `GROUP BY` ou forneça uma cláusula `ORDER BY`. A ordenação `GROUP BY` é uma extensão do MySQL que pode ser alterada em uma futura versão; por exemplo, para permitir que o otimizador ordene os agrupamentos da maneira que considerar mais eficiente e para evitar o overhead de classificação.

- As palavras-chave `EXTENDED` e `PARTITIONS` para a declaração `EXPLAIN` estão desatualizadas. Essas palavras-chave ainda são reconhecidas, mas agora são desnecessárias porque seu efeito está sempre ativado.

- As funções de criptografia `ENCRYPT()`, `ENCODE()`, `DECODE()`, `DES_ENCRYPT()` e `DES_DECRYPT()` estão desatualizadas. Para `ENCRYPT()`, considere usar `SHA2()` em vez disso para hashing unidirecional. Para os outros, considere usar `AES_ENCRYPT()` e `AES_DECRYPT()`. A opção `--des-key-file`, a variável de sistema `have_crypt`, a opção `DES_KEY_FILE` para a instrução `FLUSH` e a opção **CMake** `HAVE_CRYPT` também estão desatualizadas.

- A função espacial `MBREqual()` foi descontinuada. Use `MBREquals()` em vez disso.

- As funções descritas na Seção 12.16.4, “Funções que criam valores de geometria a partir de valores WKB”, anteriormente aceitavam strings WKB ou argumentos de geometria. O uso de argumentos de geometria é desaconselhado. Consulte essa seção para obter orientações sobre como migrar consultas para não usar argumentos de geometria.

- A tabela `INFORMATION_SCHEMA` `PROFILING` está desatualizada. Use o Schema de Desempenho em vez disso; veja o Capítulo 25, *MySQL Schema de Desempenho*.

- As tabelas `INFORMATION_SCHEMA` `INNODB_LOCKS` e `INNODB_LOCK_WAITS` estão desatualizadas e serão removidas no MySQL 8.0, que oferece tabelas de substituição do Schema de Desempenho.

- A tabela do esquema de desempenho `setup_timers` está desatualizada e será removida no MySQL 8.0, assim como a linha `TICK` na tabela `performance_timers`.

- A visão `sys.version` do esquema `sys` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. As aplicações afetadas devem ser ajustadas para usar uma alternativa. Por exemplo, use a função `VERSION()` para recuperar a versão do servidor MySQL.

- O tratamento do caractere `\N` como sinônimo de `NULL` em instruções SQL é desaconselhável e será removido no MySQL 8.0; use `NULL` em vez disso.

  Essa alteração não afeta as operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, para as quais `NULL` continua sendo representado por `\N`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

- A sintaxe `PROCEDURE ANALYSE()` está desatualizada.

- Os comentários de remoção pelo cliente **mysql** e as opções para controlá-los (`--skip-comments`, `--comments`) estão desatualizados.

- O suporte do **mysqld_safe** para saída do `syslog` está desatualizado. Use o suporte nativo do servidor `syslog` em vez disso. Consulte a Seção 5.4.2, “O Log de Erros”.

- A conversão de nomes de bancos de dados anteriores ao MySQL 5.1 que contêm caracteres especiais para o formato 5.1, com a adição do prefixo `#mysql50#`, está desaconselhada. Por isso, as opções `--fix-db-names` e `--fix-table-names` para o **mysqlcheck** e a cláusula `UPGRADE DATA DIRECTORY NAME` para a instrução `ALTER DATABASE` também estão desaconselhadas.

  As atualizações são suportadas apenas de uma série de lançamentos para outra (por exemplo, 5.0 para 5.1 ou 5.1 para 5.5), portanto, deve haver pouca necessidade de conversão de nomes de bancos de dados mais antigos de 5.0 para as versões atuais do MySQL. Como solução alternativa, atualize uma instalação do MySQL 5.0 para o MySQL 5.1 antes de fazer a atualização para uma versão mais recente.

- A funcionalidade **mysql_install_db** foi integrada ao servidor MySQL, **mysqld**. Para usar essa capacidade para inicializar uma instalação do MySQL, se você já invocou **mysql_install_db** manualmente, invocando **mysqld** com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o servidor gere uma senha aleatória para a conta inicial `'root'@'localhost'`.

  O **mysql_install_db** está sendo descontinuado, assim como a opção especial `--bootstrap` que o **mysql_install_db** passa para o **mysqld**.

- O utilitário **mysql_plugin** está desatualizado. As alternativas incluem carregar plugins no início do servidor usando a opção `--plugin-load` ou `--plugin-load-add`, ou em tempo de execução usando a instrução `INSTALL PLUGIN`.

- O utilitário **resolveip** está desatualizado. **nslookup**, **host** ou **dig** podem ser usados em seu lugar.

- O utilitário **resolve_stack_dump** está desatualizado. Os vestígios de pilha dos builds oficiais do MySQL são sempre simbolizadas, portanto, não há necessidade de usar **resolve_stack_dump**.

- As funções C API `mysql_kill()`, `mysql_list_fields()`, `mysql_list_processes()` e `mysql_refresh()` estão desatualizadas. O mesmo vale para os comandos correspondentes do protocolo cliente/servidor `COM_PROCESS_KILL`, `COM_FIELD_LIST`, `COM_PROCESS_INFO` e `COM_REFRESH`. Em vez disso, use `mysql_query()` para executar uma instrução `KILL`, `SHOW COLUMNS`, `SHOW PROCESSLIST` ou `FLUSH`, respectivamente.

- A função `mysql_shutdown()` da API C está desatualizada. Em vez disso, use `mysql_query()` para executar uma instrução `SHUTDOWN`.

- A biblioteca de servidor embutida `libmysqld` está desatualizada a partir do MySQL 5.7.19. Estes também estão desatualizados:

  - As opções **mysql_config** `--libmysqld-libs`, `--embedded-libs` e `--embedded`

  - As opções **CMake** `WITH_EMBEDDED_SERVER`, `WITH_EMBEDDED_SHARED_LIBRARY` e `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`

  - A opção (não documentada) **mysql** `--server-arg`

  - As opções **mysqltest** `--embedded-server`, `--server-arg` e `--server-file`

  - Os programas de teste **mysqltest_embedded** e **mysql_client_test_embedded**

  Como o `libmysqld` usa uma API semelhante à do `libmysqlclient`, o caminho de migração para fora do `libmysqld` é simples:

  1. Instale um servidor MySQL autônomo (**mysqld**).

  2. Modifique o código da aplicação para remover as chamadas de API específicas do `libmysqld`.

  3. Modifique o código da aplicação para se conectar ao servidor MySQL autônomo.

  4. Modifique os scripts de compilação para usar `libmysqlclient` em vez de `libmysqld`. Por exemplo, se você usa **mysql_config**, invólucvelo-o com a opção `--libs` em vez de `--libmysqld-libs`.

- A ferramenta **replace** foi descontinuada.

- O suporte para DTrace foi descontinuado.

- A função `JSON_MERGE()` está desatualizada a partir do MySQL 5.7.22. Use `JSON_MERGE_PRESERVE()` em vez disso.

- O suporte para a colocação de partições de tabela em espaços de tabela compartilhados do `InnoDB` foi descontinuado a partir do MySQL 5.7.24. Os espaços de tabela compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabela gerais. Para obter informações sobre como identificar partições em espaços de tabela compartilhados e movê-las para espaços de tabela por arquivo, consulte Preparando sua instalação para atualização.

- O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` foi descontinuado a partir do MySQL 5.7.24.

- A opção `--ndb` **perror** está desatualizada. Use o utilitário **ndb_perror** em vez disso.

- As variáveis de sistema `myisam_repair_threads` e `myisam_repair_threads` são desaconselhadas a partir do MySQL 5.7.38; espera-se que o suporte para ambas seja removido em uma futura versão do MySQL.

  A partir do MySQL 5.7.38, valores diferentes de 1 (o padrão) para `myisam_repair_threads` geram uma mensagem de aviso.

### Recursos removidos no MySQL 5.7

Os seguintes itens estão obsoletos e foram removidos no MySQL 5.7. Quando houver alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações do MySQL 5.6 que utilizam recursos removidos no MySQL 5.7, as instruções podem falhar ao serem replicadas de uma fonte do MySQL 5.6 para uma réplica do MySQL 5.7, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que utilizam recursos removidos no MySQL 5.7 devem ser revisadas para evitar esses problemas e usar alternativas quando possível.

- O suporte para senhas que usam o formato de hashing de senha anterior à versão 4.1 foi removido, o que envolve as seguintes mudanças. As aplicações que utilizam qualquer recurso que não seja mais suportado devem ser modificadas.

  - O plugin de autenticação `mysql_old_password` foi removido. As contas que usam este plugin são desativadas ao iniciar o servidor e o servidor escreve uma mensagem de “plugin desconhecido” no log de erros. Para obter instruções sobre como atualizar as contas que usam este plugin, consulte a Seção 6.4.1.3, “Migrando para fora da hashing de senhas pré-4.1 e do plugin mysql_old_password”.

  - A opção `--secure-auth` nos programas de servidor e cliente é a padrão, mas agora é uma opção sem efeito. Ela está desatualizada; espere que ela seja removida em uma futura versão do MySQL.

  - A opção `--skip-secure-auth` nos programas de servidor e cliente não é mais suportada e seu uso produz um erro.

  - A variável de sistema `secure_auth` permite apenas um valor de 1; um valor de 0 não é mais permitido.

  - Para a variável de sistema `old_passwords`, um valor de 1 (produzir hashes anteriores à versão 4.1) não é mais permitido.

  - A função `OLD_PASSWORD()` foi removida.

- No MySQL 5.6.6, o tipo de dados `YEAR(2)` de 2 dígitos foi descontinuado. O suporte para `YEAR(2)` foi removido. Uma vez que você faça a atualização para o MySQL 5.7.5 ou superior, quaisquer colunas `YEAR(2)` de 2 dígitos restantes devem ser convertidas em colunas `YEAR` de 4 dígitos para serem novamente utilizáveis. Para estratégias de conversão, consulte a Seção 11.2.5, “Limitações do 2-Digit `YEAR(2)` e Migração para `YEAR` de 4 Dígitos” (Limitações e Migração para YEAR de 4 Dígitos"). Por exemplo, execute **mysql_upgrade** após a atualização.

- A variável de sistema `innodb_mirrored_log_groups`. O único valor suportado era 1, portanto, não tinha nenhum propósito.

- A variável de sistema `storage_engine`. Use `default_storage_engine` em vez disso.

- A variável de sistema `thread_concurrency`.

- A variável de sistema `timed_mutexes`, que não teve efeito.

- A cláusula `IGNORE` para `ALTER TABLE`.

- `INSERT DELAYED` não é mais suportado. O servidor reconhece, mas ignora a palavra-chave `DELAYED`, trata o inserimento como um inserimento não atrasado e gera uma mensagem de aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED` (O `INSERT DELAYED` não é mais suportado. A instrução foi convertida para `INSERT`). Da mesma forma, `REPLACE DELAYED` é tratado como um substituição não atrasada. Você deve esperar que a palavra-chave `DELAYED` seja removida em uma futura versão.

  Além disso, várias opções ou recursos relacionados ao `DELAYED` foram removidos:

  - A opção `--delayed-insert` para o **mysqldump**.

  - As colunas `COUNT_WRITE_DELAYED`, `SUM_TIMER_WRITE_DELAYED`, `MIN_TIMER_WRITE_DELAYED`, `AVG_TIMER_WRITE_DELAYED` e `MAX_TIMER_WRITE_DELAYED` da tabela `table_lock_waits_summary_by_table` do Schema de Desempenho.

  - O **mysqlbinlog** não escreve mais comentários que mencionam `INSERT DELAYED`.

- O vinculador de banco de dados no Windows usando arquivos `.sym` foi removido porque é redundante com o suporte nativo de vinculador disponível usando **mklink**. Qualquer vinculador simbólico de arquivo `.sym` agora é ignorado e deve ser substituído por vinculadores criados usando **mklink**. Veja a Seção 8.12.3.3, “Usando vinculadores simbólicos para bancos de dados no Windows”.

- As opções `--basedir`, `--datadir` e `--tmpdir` não utilizadas para o **mysql_upgrade** foram removidas.

- Anteriormente, as opções do programa podiam ser especificadas na íntegra ou como qualquer prefixo inequívoco. Por exemplo, a opção `--compress` poderia ser dada ao **mysqldump** como `--compr`, mas não como `--comp` porque este último é ambíguo. Os prefixos de opções não são mais suportados; apenas as opções completas são aceitas. Isso ocorre porque os prefixos podem causar problemas quando novas opções são implementadas para programas e um prefixo que atualmente é inequívoco pode se tornar ambíguo no futuro. Algumas implicações dessa mudança:

  - A opção `--key-buffer` agora deve ser especificada como `--key-buffer-size`.

  - A opção `--skip-grant` agora deve ser especificada como `--skip-grant-tables`.

- A saída `SHOW ENGINE INNODB MUTEX` foi removida. Informações comparáveis podem ser geradas criando vistas nas tabelas do Gerenciamento de Desempenho.

- O Monitor de Espaço de Tabelas `InnoDB` e o Monitor de Tabela `InnoDB` são removidos. Para o Monitor de Tabela, informações equivalentes podem ser obtidas a partir das tabelas `INFORMATION_SCHEMA` do `InnoDB`.

- As tabelas especificamente nomeadas usadas para habilitar e desabilitar o Monitor padrão `InnoDB` e o Monitor de bloqueio `InnoDB` (`innodb_monitor` e `innodb_lock_monitor`) são removidas e substituídas por duas variáveis de sistema dinâmicas: `innodb_status_output` e `innodb_status_output_locks`. Para obter informações adicionais, consulte a Seção 14.18, “Monitores InnoDB”.

- As variáveis de sistema `innodb_use_sys_malloc` e `innodb_additional_mem_pool_size`, desatualizadas no MySQL 5.6.3, foram removidas.

- Os utilitários **msql2mysql**, **mysql_convert_table_format**, **mysql_find_rows**, **mysql_fix_extensions**, **mysql_setpermission**, **mysql_waitpid**, **mysql_zap**, **mysqlaccess** e **mysqlbug**.

- O utilitário **mysqlhotcopy**. Alternativas incluem **mysqldump** e MySQL Enterprise Backup.

- O script **binary-configure.sh**.

- A opção `INNODB_PAGE_ATOMIC_REF_COUNT` do **CMake** foi removida.

- A opção `innodb_create_intrinsic` foi removida.

- A opção `innodb_optimize_point_storage` e os tipos de dados internos relacionados (`DATA_POINT` e `DATA_VAR_POINT`) são removidos.

- A opção `innodb_log_checksum_algorithm` foi removida.

- A variável de sistema `myisam_repair_threads` a partir do MySQL 5.7.39.
