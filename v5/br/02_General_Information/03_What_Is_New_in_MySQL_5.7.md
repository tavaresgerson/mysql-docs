## 1.3 O que há de novo no MySQL 5.7

Esta seção resume o que foi adicionado, descontinuado e removido no MySQL 5.7. Uma seção complementar lista as opções e variáveis do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 5.7; veja a Seção 1.4, “Variáveis e opções de status do servidor adicionadas, descontinuadas ou removidas no MySQL 5.7”.

* Recursos adicionados no MySQL 5.7
* Recursos descontinuados no MySQL 5.7
* Recursos removidos no MySQL 5.7

### Características Adicionadas no MySQL 5.7

As seguintes funcionalidades foram adicionadas ao MySQL 5.7:

**Melhorias de segurança.** Essas melhorias de segurança foram adicionadas:

+ Em MySQL 8.0, `caching_sha2_password` é o plugin de autenticação padrão. Para permitir que clientes do MySQL 5.7 se conectem a servidores 8.0 usando contas que autenticam usando `caching_sha2_password`, a biblioteca de clientes do MySQL 5.7 e os programas de clientes suportam o plugin de autenticação do lado do cliente `caching_sha2_password` a partir do MySQL 5.7.23. Isso melhora a compatibilidade do MySQL 5.7 com servidores MySQL 8.0 e superiores. Veja a Seção 6.4.1.4, “Cacheamento de Autenticação SHA-2 Alterável”.

+ O servidor agora exige que as linhas de conta na tabela do sistema `mysql.user` tenham um valor não vazio na coluna `plugin` e desabilita as contas com um valor vazio. Para instruções de atualização do servidor, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”. Os administradores de banco de dados são aconselhados a também converter contas que utilizam o plugin de autenticação `mysql_old_password` para usar `mysql_native_password` em vez disso, porque o suporte para `mysql_old_password` foi removido. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora da hashing de senha pré-4.1 e do plugin mysql_old_password”.

+ O MySQL agora permite que os administradores de banco de dados estabeleçam uma política para a expiração automática da senha: Qualquer usuário que se conecte ao servidor usando uma conta para a qual a senha tenha expirado seu período permitido deve alterar a senha. Para mais informações, consulte a Seção 6.2.11, “Gestão de Senhas”.

+ Os administradores podem bloquear e desbloquear contas para ter um melhor controle sobre quem pode fazer login. Para mais informações, consulte a Seção 6.2.15, “Bloqueio de contas”.

+ Para facilitar o suporte a conexões seguras, os servidores MySQL compilados usando OpenSSL podem gerar automaticamente os arquivos de certificado e chave SSL e RSA ausentes no início. Veja a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

Todos os servidores, se não forem configurados explicitamente para SSL, tentam habilitar o SSL automaticamente no início se encontrarem os arquivos SSL necessários no diretório de dados. Veja a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Além disso, as distribuições do MySQL incluem uma ferramenta `mysql_ssl_rsa_setup` que pode ser invocada manualmente para criar arquivos de chave e certificado SSL e RSA. Para mais informações, consulte a Seção 4.4.5, “mysql_ssl_rsa_setup — Crie arquivos SSL/RSA”.

+ As implantações do MySQL instaladas usando **mysqld --initialize** são seguras por padrão. As seguintes alterações foram implementadas como características de implantação padrão:

- O processo de instalação cria apenas uma única conta `root`, `'root'@'localhost'`, que gera automaticamente uma senha aleatória para esta conta e marca a senha como expirada. O administrador do MySQL deve se conectar como `root` usando a senha aleatória e atribuir uma nova senha. (O servidor escreve a senha aleatória no log de erro.)

- A instalação não cria contas de usuário anônimo. - A instalação não cria um banco de dados `test`.

Para mais informações, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

+ A Edição Empresarial do MySQL agora oferece capacidades de mascaramento e desidentificação de dados. O mascaramento de dados oculta informações sensíveis, substituindo os valores reais por substitutos. As funções de Mascaramento e Desidentificação de Dados do MySQL Enterprise permitem o mascaramento de dados existentes usando vários métodos, como o ofuscamento (removendo características identificáveis), geração de dados aleatórios formatados e substituição ou substituição de dados. Para mais informações, consulte a Seção 6.5, “Mascaramento e Desidentificação de Dados do MySQL Enterprise”.

+ O MySQL agora define o controle de acesso concedido aos clientes no tubo nomeado para o mínimo necessário para uma comunicação bem-sucedida no Windows. O novo software do cliente MySQL pode abrir conexões de tubo nomeado sem qualquer configuração adicional. Se o software do cliente mais antigo não puder ser atualizado imediatamente, a nova variável de sistema `named_pipe_full_access_group` pode ser usada para dar ao grupo do Windows as permissões necessárias para abrir uma conexão de tubo nomeado. A associação no grupo de acesso completo deve ser restrita e temporária.

**Alterações no modo SQL.**

O modo SQL rigoroso para motores de armazenamento transacional (`STRICT_TRANS_TABLES`) é agora ativado por padrão.

A implementação para o modo SQL `ONLY_FULL_GROUP_BY` foi feita de forma mais sofisticada, para não mais rejeitar consultas determinísticas que anteriormente eram rejeitadas. Em consequência, este modo é agora habilitado por padrão, para proibir apenas consultas não determinísticas que contenham expressões que não são garantidas para serem única e exclusivamente determinadas dentro de um grupo.

Os modos SQL `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` estão sendo descontinuados, mas estão habilitados por padrão. O plano a longo prazo é incluí-los no modo SQL estrito e removê-los como modos explícitos em um lançamento futuro do MySQL. Veja as alterações no modo SQL no MySQL 5.7.

As alterações no modo SQL padrão resultam em um valor padrão da variável de sistema `sql_mode` com esses modos habilitados: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`.

**ALTER TABLE online.**

`ALTER TABLE` agora suporta uma cláusula `RENAME INDEX` que renomeia um índice. A mudança é feita in loco, sem uma operação de cópia de tabela. Funciona para todos os motores de armazenamento. Veja a Seção 13.1.8, “Instrução ALTER TABLE”.

**Plugins de análise de texto full-text ngram e MeCab.** O MySQL oferece um plugin de análise de texto full-text ngram embutido que suporta chinês, japonês e coreano (CJK), e um plugin de análise de texto full-text MeCab instalável para japonês.

Para mais informações, consulte a Seção 12.9.8, “Parser de Texto Completo ngram”, e a Seção 12.9.9, “Plugin do Parser de Texto Completo MeCab”.

**Melhorias no InnoDB.**

Essas melhorias `InnoDB` foram adicionadas:

O tamanho da coluna `VARCHAR` pode ser aumentado usando um `ALTER TABLE` em local, como neste exemplo:

  ```sql
  ALTER TABLE t1 ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(255);
  ```

Isso é verdade enquanto o número de bytes de comprimento exigido por uma coluna `VARCHAR` permanecer o mesmo. Para colunas `VARCHAR` com tamanho de 0 a 255 bytes, é necessário um byte de comprimento para codificar o valor. Para colunas `VARCHAR` com tamanho de 256 bytes ou mais, são necessários dois bytes de comprimento. Como resultado, o `ALTER TABLE` in-place só suporta o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. O `ALTER TABLE` in-place não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de bytes de comprimento necessários muda de 1 para 2, o que é suportado apenas por uma cópia da tabela (`ALGORITHM=COPY`).

A redução do tamanho de `VARCHAR` usando `ALTER TABLE` em local não é suportada. A redução do tamanho de `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

Para mais informações, consulte a Seção 14.13.1, “Operações DDL Online”.

O desempenho do DDL para as tabelas temporárias `InnoDB` foi aprimorado através da otimização das instruções `CREATE TABLE`, `DROP TABLE`, `TRUNCATE TABLE` e `ALTER TABLE`.

+ Os metadados da tabela temporária `InnoDB` não são mais armazenados nas tabelas do sistema `InnoDB`. Em vez disso, uma nova tabela, `INNODB_TEMP_TABLE_INFO`, fornece aos usuários um instantâneo das tabelas temporárias ativas. A tabela contém metadados e relatórios sobre todas as tabelas temporárias criadas pelo usuário e pelo sistema que estão ativas dentro de uma instância específica de `InnoDB`. A tabela é criada quando a primeira declaração `SELECT` é executada contra ela.

+ `InnoDB` agora suporta os tipos de dados espaciais suportados pelo MySQL. Antes desta versão, `InnoDB` armazenaria dados espaciais como dados binários `BLOB`. `BLOB` permanece como o tipo de dados subjacente, mas os tipos de dados espaciais agora são mapeados para um novo tipo de dados interno `InnoDB`, `DATA_GEOMETRY`.

+ Agora, há um espaço de tabela separado para todas as tabelas temporárias não compactadas `InnoDB`. O novo espaço de tabela é sempre recriado na inicialização do servidor e está localizado em `DATADIR` por padrão. Uma opção de arquivo de configuração recém-adicionada, `innodb_temp_data_file_path`, permite um caminho de arquivo de dados temporário definido pelo usuário.

+ A funcionalidade do **innochecksum** foi aprimorada com várias novas opções e capacidades ampliadas. Veja a Seção 4.6.1, “innochecksum — Ferramenta de verificação de checksum de arquivo InnoDB off-line”.

+ Um novo tipo de registro de desfazer não-refeito para tabelas temporárias normais e comprimidas e objetos relacionados agora reside no espaço de tabelas temporárias. Para mais informações, consulte a Seção 14.6.7, “Logs de desfazer”.

As operações de dumper e carregamento do pool de tampão `InnoDB` foram aprimoradas. Uma nova variável de sistema, `innodb_buffer_pool_dump_pct`, permite que você especifique a porcentagem de páginas mais recentemente usadas em cada pool de tampão para leitura e dumper. Quando há outra atividade de E/S sendo realizada por tarefas de segundo plano `InnoDB`, `InnoDB` tenta limitar o número de operações de carregamento do pool de tampão por segundo usando a configuração `innodb_io_capacity`.

+ O suporte é adicionado ao `InnoDB` para plugins de analisador de texto completo. Para informações sobre plugins de analisador de texto completo, consulte Plugins de Analisador de Texto Completo e Escrita de Plugins de Analisador de Texto Completo.

+ `InnoDB` suporta vários threads de limpador de página para limpar páginas sujas das instâncias do pool de buffer. Uma nova variável de sistema, `innodb_page_cleaners`, é usada para especificar o número de threads de limpador de página. O valor padrão de `1` mantém a configuração anterior, na qual há um único thread de limpador de página. Esta melhoria é baseada no trabalho concluído no MySQL 5.6, que introduziu um único thread de limpador de página para descarregar o trabalho de limpeza do pool de buffer do thread mestre `InnoDB`.

+ O suporte DDL online é estendido às seguintes operações para tabelas regulares e particionadas `InnoDB`:

- `OPTIMIZE TABLE`
  - `ALTER TABLE ... FORCE`
  - `ALTER TABLE ... ENGINE=INNODB` (quando executado em uma tabela `InnoDB`). O suporte DDL online reduz o tempo de reconstrução da tabela e permite DML concorrente. Veja a Seção 14.13, “InnoDB e DDL Online”.

+ O sistema de arquivos de memória não volátil (NVM) da Fusion-io no Linux oferece capacidade de escrita atômica, o que torna o buffer de dupla escrita `InnoDB` redundante. O buffer de dupla escrita `InnoDB` é automaticamente desativado para arquivos de espaço de tabela do sistema (arquivos ibdata) localizados em dispositivos Fusion-io que suportam escritas atômicas.

+ `InnoDB` suporta o recurso Transportable Tablespace para tabelas particionadas `InnoDB` e particionamentos individuais de tabelas `InnoDB`. Essa melhoria facilita os procedimentos de backup para tabelas particionadas e permite a cópia de tabelas particionadas e particionamentos individuais de tabelas entre instâncias do MySQL. Para mais informações, consulte a Seção 14.6.1.3, “Importando Tabelas InnoDB”.

+ O parâmetro `innodb_buffer_pool_size` é dinâmico, permitindo que você redimensione o pool de buffers sem precisar reiniciar o servidor. A operação de redimensionamento, que envolve o movimento de páginas para uma nova localização na memória, é realizada em lotes. O tamanho do lote é configurável usando a nova opção de configuração `innodb_buffer_pool_chunk_size`. Você pode monitorar o progresso do redimensionamento usando a nova variável de status `Innodb_buffer_pool_resize_status`. Para mais informações, consulte Configurando o tamanho do pool de buffers do InnoDB online.

+ O suporte ao limpador de página multithread (`innodb_page_cleaners`) é estendido para as fases de desligamento e recuperação.

+ `InnoDB` suporta a indexação de tipos de dados espaciais usando índices de `SPATIAL`, incluindo o uso de `ALTER TABLE ... ALGORITHM=INPLACE` para operações online (`ADD SPATIAL INDEX`).

+ `InnoDB` realiza uma carga em massa ao criar ou reconstruir índices. Esse método de criação de índices é conhecido como “construção de índice ordenado”. Essa melhoria, que melhora a eficiência da criação de índices, também se aplica a índices de texto completo. Uma nova opção de configuração global, `innodb_fill_factor`, define a porcentagem de espaço em cada página que é preenchida com dados durante uma construção de índice ordenado, com o espaço restante reservado para o crescimento futuro do índice. Para mais informações, consulte a Seção 14.6.2.3, “Construções de Índices Ordenados”.

+ Um novo tipo de registro de log (`MLOG_FILE_NAME`) é usado para identificar tablespaces que foram modificados desde o último ponto de verificação. Essa melhoria simplifica a descoberta de tablespace durante a recuperação em caso de falha e elimina varreduras no sistema de arquivos antes da aplicação do log de refazer. Para mais informações sobre os benefícios dessa melhoria, consulte Descoberta de tablespace durante a recuperação em caso de falha.

Essa melhoria altera o formato do log de refazer, exigindo que o MySQL seja desligado corretamente antes de fazer a atualização ou a desatualização do MySQL 5.7.5.

+ Você pode truncar os registros de desfazer que residem em espaços de tabela de desfazer. Esse recurso é ativado usando a opção de configuração `innodb_undo_log_truncate`. Para mais informações, consulte Truncar espaços de tabelas de desfazer.

+ `InnoDB` suporta particionamento nativo. Anteriormente, `InnoDB` dependia do manipulador `ha_partition`, que cria um objeto de manipulador para cada partição. Com o particionamento nativo, uma tabela `InnoDB` particionada usa um único objeto de manipulador sensível à partição. Essa melhoria reduz a quantidade de memória necessária para tabelas `InnoDB` particionadas.

A partir do MySQL 5.7.9, `mysqld_upgrade` procura e tenta atualizar as tabelas particionadas `InnoDB` que foram criadas usando o manipulador `ha_partition`. Além disso, no MySQL 5.7.9 e versões posteriores, você pode atualizar essas tabelas pelo nome no cliente **mysql** usando `ALTER TABLE ... UPGRADE PARTITIONING`.

+ `InnoDB` suporta a criação de espaços de tabela gerais usando a sintaxe de `CREATE TABLESPACE`.

  ```sql
  CREATE TABLESPACE `tablespace_name`
    ADD DATAFILE 'file_name.ibd'
    [FILE_BLOCK_SIZE = n]
  ```

As tabelas gerais podem ser criadas fora do diretório de dados do MySQL, podem conter múltiplas tabelas e suportar tabelas de todos os formatos de linha.

As tabelas são adicionadas a um espaço de tabelas geral usando a sintaxe `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`.

Para mais informações, consulte a Seção 14.6.3.3, “Tabelas gerais”.

+ `DYNAMIC` substitui `COMPACT` como o formato de linha padrão implícito para as tabelas `InnoDB`. Uma nova opção de configuração, `innodb_default_row_format`, especifica o formato de linha padrão `InnoDB`. Para mais informações, consulte Definindo o Formato de Linha de uma Tabela.

+ A partir do MySQL 5.7.11, `InnoDB` suporta criptografia de dados em repouso para espaços de tabela por tabela. A criptografia é habilitada especificando a opção `ENCRYPTION` ao criar ou alterar uma tabela `InnoDB`. Este recurso depende de um plugin `keyring` para gerenciamento de chave de criptografia. Para mais informações, consulte a Seção 6.4.4, “O Keyring MySQL”, e a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

+ A partir do MySQL 5.7.24, a versão da biblioteca zlib incluída no MySQL foi elevada da versão 1.2.3 para a versão 1.2.11. O MySQL implementa a compressão com a ajuda da biblioteca zlib.

Se você usar tabelas compactadas `InnoDB`, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”, para as implicações relacionadas à atualização.

**Suporte a JSON.** A partir do MySQL 5.7.8, o MySQL suporta um tipo nativo `JSON`. Os valores JSON não são armazenados como strings, mas sim usando um formato binário interno que permite acesso rápido aos elementos do documento. Os documentos JSON armazenados em colunas `JSON` são automaticamente validados sempre que são inseridos ou atualizados, com um documento inválido gerando um erro. Os documentos JSON são normalizados na criação e podem ser comparados usando a maioria dos operadores de comparação, como `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`; para informações sobre os operadores suportados, bem como sobre a precedência e outras regras que o MySQL segue ao comparar os valores de `JSON`, consulte Comparação e Ordenação de Valores JSON.

O MySQL 5.7.8 também introduz uma série de funções para trabalhar com os valores de `JSON`. Essas funções incluem as listadas aqui:

+ Funções que criam valores de `JSON`: `JSON_ARRAY()`, `JSON_MERGE()` e `JSON_OBJECT()`. Ver Seção 12.17.2, “Funções que criam valores JSON”.

+ Funções que procuram valores de `JSON`: `JSON_CONTAINS()`, `JSON_CONTAINS_PATH()`, `JSON_EXTRACT()`, `JSON_KEYS()` e `JSON_SEARCH()`. Ver Seção 12.17.3, “Funções que procuram valores JSON”.

+ Funções que modificam os valores de `JSON`: `JSON_APPEND()`, `JSON_ARRAY_APPEND()`, `JSON_ARRAY_INSERT()`, `JSON_INSERT()`, `JSON_QUOTE()`, `JSON_REMOVE()`, `JSON_REPLACE()`, `JSON_SET()` e `JSON_UNQUOTE()`. Ver Seção 12.17.4, “Funções que Modificam Valores JSON”.

+ Funções que fornecem informações sobre os valores de `JSON`: `JSON_DEPTH()`, `JSON_LENGTH()`, `JSON_TYPE()` e `JSON_VALID()`. Ver Seção 12.17.5, “Funções que retornam atributos de valores JSON”.

Em MySQL 5.7.9 e versões posteriores, você pode usar `column->path` como abreviação para `JSON_EXTRACT(column, path)`. Isso funciona como um alias para uma coluna onde um identificador de coluna pode ocorrer em uma declaração SQL, incluindo cláusulas `WHERE`, `ORDER BY` e `GROUP BY`. Isso inclui `SELECT`, `UPDATE`, `DELETE`, `CREATE TABLE` e outras declarações SQL. O lado esquerdo deve ser um identificador de coluna `JSON` (e não um alias). O lado direito é uma expressão de caminho JSON citada que é avaliada contra o documento JSON retornado como o valor da coluna.

O MySQL 5.7.22 adiciona as seguintes funções JSON:

+ Duas funções de agregação JSON `JSON_ARRAYAGG()` e `JSON_OBJECTAGG()`. `JSON_ARRAYAGG()` recebe uma coluna ou expressão como argumento e agrega o resultado como um único array `JSON`. A expressão pode avaliar qualquer tipo de dados MySQL; isso não precisa ser um valor de `JSON`. `JSON_OBJECTAGG()` recebe duas colunas ou expressões que interpreta como uma chave e um valor; retorna o resultado como um único objeto `JSON`. Para mais informações e exemplos, consulte a Seção 12.19, “Funções de Agregação”.

+ A função utilitária JSON `JSON_PRETTY()`, que exibe um valor existente do `JSON` em um formato fácil de ler; cada membro do objeto JSON ou valor de matriz é impresso em uma linha separada, e um objeto ou matriz filho é intencionalmente espaçado 2 espaços em relação ao seu pai.

Essa função também funciona com uma string que pode ser analisada como um valor JSON.

Veja também a Seção 12.17.6, “Funções de Utilidade JSON”.

+ A função utilitária JSON `JSON_STORAGE_SIZE()`, que retorna o espaço de armazenamento em bytes utilizado para a representação binária de um documento JSON antes de qualquer atualização parcial (ver item anterior).

Essa função também aceita uma representação válida de uma string de um documento JSON. Para tal valor, `JSON_STORAGE_SIZE()` retorna o espaço usado por sua representação binária após sua conversão em um documento JSON. Para uma variável que contém a representação de string de um documento JSON, `JSON_STORAGE_FREE()` retorna zero. Qualquer uma dessas funções produz um erro se seu argumento (não nulo) não puder ser analisado como um documento JSON válido, e `NULL` se o argumento for `NULL`.

Para mais informações e exemplos, consulte a Seção 12.17.6, “Funções de Utilidade JSON”.

+ Uma função de junção JSON destinada a conformar-se com o RFC 7396. `JSON_MERGE_PATCH()`, quando usada em 2 objetos JSON, as une em um único objeto JSON que tem como membros uma união dos seguintes conjuntos:

- Cada membro do primeiro objeto para o qual não há membro com a mesma chave no segundo objeto.

- Cada membro do segundo objeto para o qual não há membro com a mesma chave no primeiro objeto e cujo valor não é o literal JSON `null`.

- Cada membro que tenha uma chave que exista em ambos os objetos e cujo valor no segundo objeto não seja o literal JSON `null`.

Como parte desse trabalho, a função `JSON_MERGE()` foi renomeada para `JSON_MERGE_PRESERVE()`. `JSON_MERGE()` continua sendo reconhecida como um alias para `JSON_MERGE_PRESERVE()` no MySQL 5.7, mas agora é desaconselhada e está sujeita à remoção em uma versão futura do MySQL.

Para mais informações e exemplos, consulte a Seção 12.17.4, “Funções que modificam valores JSON”.

Consulte a Seção 12.17.3, “Funções que buscam valores JSON”, para obter mais informações sobre `->` e `JSON_EXTRACT()`. Para informações sobre o suporte de caminho JSON no MySQL 5.7, consulte Procurando e modificando valores JSON. Veja também Indexação de uma coluna gerada para fornecer um índice de coluna JSON.

**Variáveis de sistema e status.** As informações sobre variáveis de sistema e status estão agora disponíveis nas tabelas do Schema de desempenho, em vez de usar as tabelas `INFORMATION_SCHEMA` para obter essas variáveis. Isso também afeta o funcionamento das declarações `SHOW VARIABLES` e `SHOW STATUS`. O valor da variável de sistema `show_compatibility_56` afeta a saída produzida e os privilégios necessários para as declarações e tabelas de variáveis de sistema e status. Para obter detalhes, consulte a descrição daquela variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

Nota

O padrão para `show_compatibility_56` é `OFF`. As aplicações que exigem comportamento de 5,6 devem definir essa variável para `ON` até que tenham sido migradas para o novo comportamento para variáveis de sistema e variáveis de status. Veja a Seção 25.20, “Migrando para as Tabelas de Sistema e Variáveis de Status do Schema de Desempenho”

**sys schema.**

As distribuições do MySQL agora incluem o esquema `sys`, que é um conjunto de objetos que ajudam os administradores de banco de dados e os desenvolvedores a interpretar os dados coletados pelo Gerador de Desempenho. Os objetos do esquema `sys` podem ser usados para casos típicos de ajuste e diagnóstico. Para mais informações, consulte o Capítulo 26, *Esquema sys do MySQL*.

**Tratamento de condições.**

O MySQL agora suporta áreas de diagnóstico empilhadas. Quando a pilha de áreas de diagnóstico é empilhada, a primeira (atual) área de diagnóstico se torna a segunda (empilhada) área de diagnóstico e uma nova área de diagnóstico atual é criada como uma cópia dela. Dentro de um manipulador de condição, as instruções executadas modificam a nova área de diagnóstico atual, mas `GET STACKED DIAGNOSTICS` pode ser usado para inspecionar a área de diagnóstico empilhada para obter informações sobre a condição que causou o manipulador a ser ativado, independentemente das condições atuais dentro do próprio manipulador. (Anteriormente, havia uma única área de diagnóstico. Para inspecionar as condições que ativam o manipulador dentro de um manipulador, era necessário verificar essa área de diagnóstico antes de executar quaisquer instruções que pudessem modificá-la.) Veja a Seção 13.6.7.3, “Instrução GET DIAGNOSTICS”, e a Seção 13.6.7.7, “A Área de Diagnóstico MySQL”.


**Optimizer.**

Esses aprimoramentos do otimizador foram adicionados:

+ `EXPLAIN` pode ser usado para obter o plano de execução de uma declaração explicável que está sendo executada em uma conexão nomeada:

  ```sql
  EXPLAIN [options] FOR CONNECTION connection_id;
  ```

Para mais informações, consulte a Seção 8.8.4, “Obtenção de informações sobre o plano de execução para uma conexão nomeada”.

+ É possível fornecer dicas ao otimizador dentro de declarações SQL individuais, o que permite um controle mais fino sobre os planos de execução das declarações do que pode ser alcançado usando a variável de sistema `optimizer_switch`. As dicas também são permitidas em declarações usadas com `EXPLAIN`, permitindo que você veja como as dicas afetam os planos de execução. Para mais informações, consulte a Seção 8.9.3, “Dicas do otimizador”.

+ **indicador prefer_ordering_index.** Por padrão, o MySQL tenta usar um índice ordenado para qualquer consulta `ORDER BY` ou `GROUP BY` que tenha uma cláusula `LIMIT`, sempre que o otimizador determinar que isso resultaria em uma execução mais rápida. Como é possível, em alguns casos, que escolher uma otimização diferente para essas consultas realmente funcione melhor, é possível a partir do MySQL 5.7.33 desativar essa otimização, definindo o indicador `prefer_ordering_index` para `off`.

O valor padrão para esta bandeira é `on`.

Para mais informações e exemplos, consulte a Seção 8.9.2, “Otimizações Desconectables”, e a Seção 8.2.1.17, “Otimização da Consulta LIMIT”.

**Triggers.**

Anteriormente, uma tabela poderia ter no máximo um gatilho para cada combinação de evento de gatilho (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`). Essa limitação foi levantada e múltiplos gatilhos são permitidos. Para mais informações, consulte a Seção 23.3, “Usando gatilhos”.

**Logging.**

Essas melhorias de registro foram adicionadas:

+ Anteriormente, em sistemas Unix e similares, o suporte do MySQL para enviar o log de erro do servidor para o `syslog` era implementado com o `mysqld_safe` capturando a saída de erro do servidor e passando para o `syslog`. O servidor agora inclui suporte nativo ao `syslog`, que foi estendido para incluir o Windows. Para mais informações sobre o envio da saída de erro do servidor para o `syslog`, consulte a Seção 5.4.2, “O Log de Erro”.

+ O cliente **mysql** agora tem uma opção `--syslog` que faz com que declarações interativas sejam enviadas para a instalação `syslog` do sistema. O registro é suprimido para declarações que correspondem à lista padrão de padrões de "ignorar" (`"*IDENTIFIED*:*PASSWORD*"`) e também para declarações que correspondem a quaisquer padrões especificados usando a opção `--histignore`. Veja a Seção 4.5.1.3, “Registro do Cliente mysql”.

Colunas geradas.

O MySQL agora suporta a especificação de colunas geradas nas declarações `CREATE TABLE` e `ALTER TABLE`. Os valores de uma coluna gerada são calculados a partir de uma expressão especificada no momento da criação da coluna. Colunas geradas podem ser virtuais (calculadas “on the fly” quando as linhas são lidas) ou armazenadas (calculadas quando as linhas são inseridas ou atualizadas). Para mais informações, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

**cliente mysql.**

Anteriormente, **Control+C** em mysql interrompia a declaração atual, se houver uma, ou saía do mysql se não houvesse. Agora **Control+C** interrompe a declaração atual, se houver uma, ou cancela qualquer linha de entrada parcial, caso contrário, mas não sai.

**Reescrita do nome do banco de dados com mysqlbinlog.**

O renomeamento de bancos de dados pelo **mysqlbinlog** ao ler logs binários escritos usando o formato baseado em linha agora é suportado usando a opção `--rewrite-db` adicionada no MySQL 5.7.1.

Esta opção utiliza o formato `--rewrite-db='dboldname->dbnewname'`. Você pode implementar várias regras de reescrita, especificando a opção várias vezes.

**HANDLER com tabelas particionadas.**

A declaração `HANDLER` pode agora ser usada com tabelas com partições de usuário. Essas tabelas podem usar qualquer um dos tipos de partição disponíveis (consulte a Seção 22.2, “Tipos de Partição”).

Suporte para empurrar condições de índice em tabelas particionadas.  
Consultas em tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` ou `MyISAM` podem empregar a otimização de empurrar condições de índice que foi introduzida no MySQL 5.6. Consulte a Seção 8.2.1.5, “Otimização de Empurrar Condições de Índice”, para mais informações.

**SEM VALIDAÇÃO, o suporte para ALTER TABLE ... EXCHANGE PARTITION não é permitido.**

A partir do MySQL 5.7.5, a sintaxe `ALTER TABLE ... EXCHANGE PARTITION` inclui uma cláusula opcional `{WITH|WITHOUT} VALIDATION`. Quando `WITHOUT VALIDATION` é especificado, `ALTER TABLE ... EXCHANGE PARTITION` não realiza validação linha a linha ao trocar uma tabela preenchida com a partição, permitindo que os administradores de banco de dados assumam a responsabilidade de garantir que as linhas estejam dentro dos limites da definição da partição. `WITH VALIDATION` é o comportamento padrão e não precisa ser especificado explicitamente. Para mais informações, consulte a Seção 22.3.3, “Trocando Partições e Subpartições com Tabelas”.

Melhorias no thread de descarte de dados.

O fio de descarte de fonte foi refatorado para reduzir a disputa por bloqueio e melhorar o desempenho da fonte. Anteriormente ao MySQL 5.7.2, o fio de descarte tomava um bloqueio no log binário sempre que lia um evento; no MySQL 5.7.2 e versões posteriores, esse bloqueio é mantido apenas enquanto lê a posição no final do último evento escrito com sucesso. Isso significa que tanto é possível que vários fios de descarte leiam simultaneamente do arquivo de log binário quanto que os fios de descarte agora podem ler enquanto os clientes estão escrevendo no log binário.

Suporte para conjuntos de caracteres.

O MySQL 5.7.4 inclui um conjunto de caracteres `gb18030` que suporta o conjunto de caracteres GB18030 da China. Para mais informações sobre o suporte de conjuntos de caracteres do MySQL, consulte o Capítulo 10, *Conjunto de caracteres, colatinas, Unicode*.

**Mudando a fonte de replicação sem STOP SLAVE.**

Em MySQL 5.7.4 e versões posteriores, o requisito estrito de executar `STOP SLAVE` antes de emitir qualquer declaração `CHANGE MASTER TO` é removido. Em vez de depender se a replica está parada, o comportamento de `CHANGE MASTER TO` agora depende dos estados dos threads SQL da replica e dos threads de E/S da replica; qual desses threads está parado ou em execução agora determina as opções que podem ou não ser usadas com uma declaração `CHANGE MASTER TO` em um determinado momento. As regras para fazer essa determinação estão listadas aqui:

+ Se o fio SQL estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer combinação das opções `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `MASTER_DELAY`, mesmo que o fio de I/O da replica esteja em execução. Nenhuma outra opção pode ser usada com essa declaração quando o fio de I/O estiver em execução.

+ Se a thread de E/S estiver parada, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções para essa declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou `MASTER_DELAY`, mesmo quando a thread SQL estiver em execução. Essas três opções não podem ser usadas quando a thread de E/S estiver em execução.

+ Tanto o fio SQL quanto o fio de E/S devem ser interrompidos antes de emitir `CHANGE MASTER TO ... MASTER_AUTO_POSITION = 1`.

Você pode verificar o estado atual das réplicas das threads SQL e de I/O usando `SHOW SLAVE STATUS`.

Se você estiver usando replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE MASTER TO` após uma declaração `STOP SLAVE` deixe tabelas temporárias no replica. Como parte deste conjunto de melhorias, agora é emitido um aviso sempre que `CHANGE MASTER TO` é emitido após `STOP SLAVE` quando a replicação baseada em declarações está em uso e `Slave_open_temp_tables` permanece maior que 0.

Para mais informações, consulte a Seção 13.4.2.1, “Declaração de MUDAR O MESTRE”, e a Seção 16.3.7, “Alteração de fontes durante o failover”.

**Conjunto de testes.**

A suíte de testes do MySQL agora usa `InnoDB` como o mecanismo de armazenamento padrão.

A replicação de várias fontes é agora possível.

A Replicação Multifonte do MySQL adiciona a capacidade de replicar de múltiplas fontes para uma réplica. As topologias de Replicação Multifonte do MySQL podem ser usadas para fazer backup de múltiplos servidores em um único servidor, para fundir fragmentos de tabela e consolidar dados de múltiplos servidores em um único servidor. Veja a Seção 16.1.5, “Replicação Multifonte do MySQL”.

Como parte da Replicação Multifonte do MySQL, canais de replicação foram adicionados. Os canais de replicação permitem que uma replica abra múltiplas conexões para replicar, com cada canal sendo uma conexão a uma fonte. Veja a Seção 16.2.2, “Canais de replicação”.

**Tabelas do esquema de desempenho da replicação em grupo.**

O MySQL 5.7 adiciona várias tabelas novas ao Gerador de Desempenho para fornecer informações sobre grupos e canais de replicação. Essas incluem as seguintes tabelas:

+ `replication_applier_configuration`
+ `replication_applier_status`
+ `replication_applier_status_by_coordinator`
+ `replication_applier_status_by_worker`
+ `replication_connection_configuration`
+ `replication_connection_status`
+ `replication_group_members`
+ `replication_group_member_stats`

Todas essas tabelas foram adicionadas no MySQL 5.7.2, exceto para `replication_group_members` e `replication_group_member_stats`, que foram adicionadas no MySQL 5.7.6. Para mais informações, consulte a Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”.

**Replicação em grupo SQL.**

As seguintes declarações foram adicionadas no MySQL 5.7.6 para o controle da Replicação de Grupo:

+ `START GROUP_REPLICATION`
+ `STOP GROUP_REPLICATION`

Para mais informações, consulte a Seção 13.4.3, “Declarações SQL para controle da replicação de grupo”.

### Características Descontinuadas no MySQL 5.7

As seguintes funcionalidades são descontinuadas no MySQL 5.7 e podem ser removidas em uma série futura. Onde alternativas são mostradas, as aplicações devem ser atualizadas para usá-las.

Para aplicações que utilizam recursos descontinuados no MySQL 5.7 e que foram removidos em uma versão superior do MySQL, as declarações podem falhar ao serem replicadas de uma fonte MySQL 5.7 para uma réplica de uma versão superior. Ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que utilizam recursos descontinuados no 5.7 devem ser revisadas para evitar esses problemas e utilizar alternativas quando possível.

* Os modos SQL `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` estão sendo descontinuados, mas estão habilitados por padrão. O plano a longo prazo é incluí-los no modo SQL estrito e removê-los como modos explícitos em um lançamento futuro do MySQL.

Os modos de consulta SQL `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` obsoletos ainda são reconhecidos, de modo que as declarações que os nomeiam não produzem um erro, mas espera-se que sejam removidos em uma versão futura do MySQL. Para fazer uma preparação antecipada para versões do MySQL nas quais esses nomes de modos não existem, as aplicações devem ser modificadas para não se referirem a eles. Veja Alterações no Modo de Consulta no MySQL 5.7.

* Esses modos SQL estão sendo descontinuados; espere que eles sejam removidos em uma versão futura do MySQL: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`. Essas descontinuidades têm duas implicações:

+ Atribuir um modo obsoleto à variável de sistema `sql_mode` produz um aviso.

+ Com o modo SQL `MAXDB` habilitado, o uso de `CREATE TABLE` ou `ALTER TABLE` para adicionar uma coluna `TIMESTAMP` a uma tabela produz um aviso.

* As alterações nas declarações de gestão de contas tornam os seguintes recursos obsoletos. Eles são agora desaconselhados:

+ Use `GRANT` para criar usuários. Em vez disso, use `CREATE USER`. Seguir essa prática torna o modo SQL do `NO_AUTO_CREATE_USER` irrelevante para as declarações do `GRANT`, então também é descontinuado.

+ Utilizando `GRANT` para modificar propriedades de conta que não sejam atribuições de privilégios. Isso inclui propriedades de autenticação, SSL e limite de recursos. Em vez disso, estabeleça essas propriedades no momento da criação da conta com `CREATE USER` ou modifique-as posteriormente com `ALTER USER`.

+ A sintaxe `IDENTIFIED BY PASSWORD 'auth_string'` para `CREATE USER` e `GRANT`. Em vez disso, use `IDENTIFIED WITH auth_plugin AS 'auth_string'` para `CREATE USER` e `ALTER USER`, onde o valor `'auth_string'` está em um formato compatível com o plugin nomeado.

+ A função `PASSWORD()` é descontinuada e deve ser evitada em qualquer contexto. Assim, a sintaxe `SET PASSWORD ... = PASSWORD('auth_string')` também é descontinuada. A sintaxe `SET PASSWORD ... = 'auth_string'` não é descontinuada; no entanto, `ALTER USER` é agora a declaração preferida para atribuir senhas.

+ A variável de sistema `old_passwords`. Os plugins de autenticação de conta não podem mais ser deixados não especificados na tabela de sistema `mysql.user`, portanto, qualquer declaração que atribua uma senha a partir de uma string em texto claro pode determinar de forma inequívoca o método de hashing a ser usado na string antes de armazená-la na tabela `mysql.user`. Isso torna `old_passwords` superfísico.

O cache de consulta é descontinuado. A descontinuidade inclui os seguintes itens:

+ As declarações `FLUSH QUERY CACHE` e `RESET QUERY CACHE`.

+ os modificadores `SQL_CACHE` e `SQL_NO_CACHE` `SELECT`.

+ Essas variáveis do sistema: `have_query_cache`, `ndb_cache_check_time`, `query_cache_limit`, `query_cache_min_res_unit`, `query_cache_size`, `query_cache_type`, `query_cache_wlock_invalidate`.

+ Essas variáveis de status: `Qcache_free_blocks`, `Qcache_free_memory`, `Qcache_hits`, `Qcache_inserts`, `Qcache_lowmem_prunes`, `Qcache_not_cached`, `Qcache_queries_in_cache`, `Qcache_total_blocks`.

* Anteriormente, as opções de inicialização dos servidores `--transaction-isolation` e `--transaction-read-only` correspondiam às variáveis de sistema `tx_isolation` e `tx_read_only`. Para uma melhor correspondência de nomes entre as opções de inicialização e os nomes das variáveis de sistema, foram criados `transaction_isolation` e `transaction_read_only` como aliases para `tx_isolation` e `tx_read_only`. As variáveis `tx_isolation` e `tx_read_only` são agora desatualizadas; espera-se que elas sejam removidas no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_isolation` e `transaction_read_only` em vez disso.

* A opção `--skip-innodb` e seus sinônimos (`--innodb=OFF`, `--disable-innodb` e assim por diante) são desaconselhadas. Essas opções não têm efeito a partir do MySQL 5.7, porque `InnoDB` não pode ser desativado.

* As opções `--ssl` e `--ssl-verify-server-cert` do lado do cliente são desatualizadas. Use `--ssl-mode=REQUIRED` em vez de `--ssl=1` ou `--enable-ssl`. Use `--ssl-mode=DISABLED` em vez de `--ssl=0`, `--skip-ssl` ou `--disable-ssl`. Use as opções `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-verify-server-cert`. (A opção `--ssl` do lado do servidor *não* é desatualizada.)

Para a API C, as opções `MYSQL_OPT_SSL_ENFORCE` e `MYSQL_OPT_SSL_VERIFY_SERVER_CERT` para `mysql_options()` correspondem às opções `--ssl` e `--ssl-verify-server-cert` do lado do cliente e são desatualizadas. Use `MYSQL_OPT_SSL_MODE` com um valor de opção de `SSL_MODE_REQUIRED` ou `SSL_MODE_VERIFY_IDENTITY` em vez disso.

* A variável de sistema `log_warnings` e a opção de servidor `--log-warnings` são desatualizadas. Use a variável de sistema `log_error_verbosity` em vez disso.

* A opção de servidor `--temp-pool` é desatualizada.

* A variável de sistema `binlog_max_flush_queue_time` não faz nada no MySQL 5.7 e é desaconselhada a partir do MySQL 5.7.9.

* A variável de sistema `innodb_support_xa`, que habilita o suporte ao compromisso de duas fases em transações XA, `InnoDB` é descontinuada a partir do MySQL 5.7.10. O suporte `InnoDB` para compromisso de duas fases em transações XA é sempre habilitado a partir do MySQL 5.7.10.

* As variáveis de sistema `metadata_locks_cache_size` e `metadata_locks_hash_instances` são desatualizadas. Essas variáveis não fazem nada a partir do MySQL 5.7.4.

* A variável de sistema `sync_frm` é descontinuada.

* As variáveis globais `character_set_database` e `collation_database` do sistema são descontinuadas; espera-se que elas sejam removidas em uma versão futura do MySQL.

Atribuir um valor às variáveis de sistema de sessão `character_set_database` e `collation_database` é desaconselhável e as atribuições produzem um aviso. Espera-se que as variáveis de sessão se tornem somente de leitura em uma versão futura do MySQL, e as atribuições a elas produzirão um erro, enquanto permanecem possíveis para ler as variáveis de sessão para determinar o conjunto de caracteres do banco de dados e a collation para o banco de dados padrão.

* O escopo global para a variável de sistema `sql_log_bin` foi descontinuado, e agora essa variável pode ser definida apenas com escopo de sessão. A declaração `SET GLOBAL SQL_LOG_BIN` agora produz um erro. Ainda é possível ler o valor global de `sql_log_bin`, mas isso produz um aviso. Você deve agir agora para remover de seus aplicativos quaisquer dependências de leitura desse valor; o escopo global `sql_log_bin` é removido no MySQL 8.0.

* Com a introdução do dicionário de dados no MySQL 8.0, a opção `--ignore-db-dir` e a variável de sistema `ignore_db_dirs` tornaram-se supérfluas e foram removidas naquela versão. Consequentemente, elas são desaconselhadas no MySQL 5.7.

* `GROUP BY` ordena implicitamente por padrão (ou seja, na ausência de `ASC` ou `DESC` designators), mas depende da ordenação implícita de `GROUP BY` no MySQL 5.7. Para obter uma ordem de classificação específica de resultados agrupados, é preferível usar Para produzir uma ordem de classificação específica, use explicitamente os designators `ASC` ou `DESC` para as colunas `GROUP BY` ou forneça uma cláusula `ORDER BY`. A ordenação `GROUP BY` é uma extensão do MySQL que pode mudar em uma versão futura; por exemplo, para permitir que o otimizador ordene os agrupamentos da maneira que considere mais eficiente e para evitar o overhead de classificação.

* As palavras-chave `EXTENDED` e `PARTITIONS` para a declaração `EXPLAIN` são desatualizadas. Essas palavras-chave ainda são reconhecidas, mas agora são desnecessárias, pois seu efeito é sempre ativado.

As funções de criptografia `ENCRYPT()`, `ENCODE()`, `DECODE()`, `DES_ENCRYPT()` e `DES_DECRYPT()` são descontinuadas. Para `ENCRYPT()`, considere usar `SHA2()` em vez disso para hashing unidirecional. Para as outras, considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez disso. A opção `--des-key-file`, a variável de sistema `have_crypt`, a opção `DES_KEY_FILE` para a declaração `FLUSH` e a opção **CMake** `HAVE_CRYPT` também são descontinuadas.

* A função espacial `MBREqual()` é descontinuada. Use `MBREquals()` em vez disso.

* As funções descritas na Seção 12.16.4, "Funções que criam valores de geometria a partir de valores WKB", anteriormente aceitavam strings WKB ou argumentos de geometria. O uso de argumentos de geometria é desaconselhado. Consulte essa seção para obter diretrizes sobre como migrar consultas que não utilizam argumentos de geometria.

* A tabela `INFORMATION_SCHEMA` `PROFILING` é desatualizada. Use o Schema de desempenho em vez disso; veja o Capítulo 25, *MySQL Schema de desempenho*.

* As tabelas `INFORMATION_SCHEMA` `INNODB_LOCKS` e `INNODB_LOCK_WAITS` são desatualizadas e serão removidas no MySQL 8.0, que oferece tabelas de Solução de Desempenho de substituição.

* A tabela Schema de desempenho `setup_timers` é desatualizada e será removida no MySQL 8.0, assim como a linha `TICK` na tabela `performance_timers`.

* A visão `sys` do esquema `sys.version` é desatualizada; espera-se que seja removida em uma versão futura do MySQL. As aplicações afetadas devem ser ajustadas para usar uma alternativa. Por exemplo, use a função `VERSION()` para recuperar a versão do servidor MySQL.

* O tratamento de `\N` como sinônimo de `NULL` em declarações SQL é desaconselhável e será removido no MySQL 8.0; use `NULL` em vez disso.

Essa alteração não afeta as operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, para as quais `NULL` continua a ser representado por `\N`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

* A sintaxe `PROCEDURE ANALYSE()` é desatualizada. * A remoção de comentários pelo cliente **mysql** e as opções para controlá-la (`--skip-comments`, `--comments`) são desatualizadas.

* O suporte `mysqld_safe` para saída `syslog` é desatualizado. Use o suporte do servidor nativo `syslog` em vez disso. Veja a Seção 5.4.2, “O Diário de Erros”.

* A conversão de nomes de bancos de dados pré-MySQL 5.1 que contêm caracteres especiais para o formato 5.1, com a adição de um prefixo `#mysql50#`, é descontinuada. Por isso, as opções `--fix-db-names` e `--fix-table-names` para o **mysqlcheck** e a cláusula `UPGRADE DATA DIRECTORY NAME` para a declaração `ALTER DATABASE` também são descontinuadas.

As atualizações são suportadas apenas de uma série de lançamento para outra (por exemplo, 5.0 para 5.1 ou 5.1 para 5.5), portanto, deve haver pouca necessidade de conversão de nomes de banco de dados mais antigos de 5.0 para versões atuais do MySQL. Como uma solução alternativa, atualize uma instalação do MySQL 5.0 para MySQL 5.1 antes de atualizar para uma versão mais recente.

* A funcionalidade `mysql_install_db` foi integrada ao servidor MySQL, `mysqld`. Para usar essa capacidade para inicializar uma instalação do MySQL, se você anteriormente invocou manualmente `mysql_install_db`, invocando `mysqld` com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o servidor gere uma senha aleatória para a conta inicial `'root'@'localhost'`.

`mysql_install_db` já está desatualizado, assim como a opção especial `--bootstrap` que `mysql_install_db` passa para `mysqld`.

* O utilitário **mysql_plugin** é desatualizado. As alternativas incluem carregar plugins na inicialização do servidor usando a opção `--plugin-load` ou `--plugin-load-add`, ou em tempo real usando a declaração `INSTALL PLUGIN`.

* A utilidade **resolveip** é descontinuada. **nslookup**, **host** ou **dig** podem ser usados em seu lugar.

* O utilitário **resolve_stack_dump** é desatualizado. As traçadas de pilha dos builds oficiais do MySQL são sempre simbolizadas, portanto, não há necessidade de usar **resolve_stack_dump**.

As funções API `mysql_kill()`, `mysql_list_fields()`, `mysql_list_processes()` e `mysql_refresh()` são descontinuadas. O mesmo vale para os comandos correspondentes aos `COM_PROCESS_KILL`, `COM_FIELD_LIST`, `COM_PROCESS_INFO` e `COM_REFRESH` do protocolo cliente/servidor. Em vez disso, use `mysql_query()` para executar uma declaração `KILL`, `SHOW COLUMNS`, `SHOW PROCESSLIST` ou `FLUSH`, respectivamente.

* A função API `mysql_shutdown()` C é desatualizada. Em vez disso, use `mysql_query()` para executar uma declaração `SHUTDOWN`.

* A biblioteca de servidor embutida `libmysqld` é descontinuada a partir do MySQL 5.7.19. Também são descontinuadas:

+ As opções **mysql_config** `--libmysqld-libs`, `--embedded-libs` e `--embedded`

+ As opções **CMake** `WITH_EMBEDDED_SERVER`, `WITH_EMBEDDED_SHARED_LIBRARY` e `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`

+ A opção (não documentada) **mysql** `--server-arg`

+ As opções **mysqltest** `--embedded-server`, `--server-arg` e `--server-file`

+ Os programas de teste **mysqltest_embedded** e **mysql_client_test_embedded**

Como o `libmysqld` utiliza uma API comparável à do `libmysqlclient`, o caminho de migração para longe do `libmysqld` é direto:

1. Configure um servidor MySQL independente (`mysqld`).

2. Modifique o código do aplicativo para remover as chamadas de API que são específicas para `libmysqld`.

3. Modifique o código da aplicação para se conectar ao servidor MySQL autônomo.

4. Modifique os scripts de compilação para usar `libmysqlclient` em vez de `libmysqld`. Por exemplo, se você usa **mysql_config**, invólcá-lo com a opção `--libs` em vez de `--libmysqld-libs`.

* A ferramenta **replace** é descontinuada. * O suporte para DTrace é descontinuado. * A função `JSON_MERGE()` é descontinuada a partir do MySQL 5.7.22. Use `JSON_MERGE_PRESERVE()` em vez disso.

* O suporte para a colocação de partições de tabela em `InnoDB` espaços de tabela compartilhados é descontinuado a partir do MySQL 5.7.24. Os espaços de tabela compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabela gerais. Para obter informações sobre a identificação de partições em espaços de tabela compartilhados e a transferência para espaços de tabela por arquivo, consulte Preparando sua instalação para atualização.

* O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` é descontinuado a partir do MySQL 5.7.24.

* A opção `--ndb` **perror** é desatualizada. Use o utilitário **ndb_perror** em vez disso.

* A variável de sistema `myisam_repair_threads` `myisam_repair_threads` é descontinuada a partir do MySQL 5.7.38; espera-se que o suporte para ambas seja removido em um lançamento futuro do MySQL.

A partir do MySQL 5.7.38, valores diferentes de 1 (padrão) para `myisam_repair_threads` produzem um aviso.

### Características removidas no MySQL 5.7

Os seguintes itens estão obsoletos e foram removidos no MySQL 5.7. Onde são apresentadas alternativas, as aplicações devem ser atualizadas para usá-las.

Para aplicações do MySQL 5.6 que utilizam recursos removidos no MySQL 5.7, as declarações podem falhar quando replicadas a partir de uma fonte do MySQL 5.6 para uma réplica do MySQL 5.7, ou podem ter efeitos diferentes na fonte e na réplica. Para evitar tais problemas, as aplicações que utilizam recursos removidos no MySQL 5.7 devem ser revisadas para evitar esses problemas e utilizar alternativas quando possível.

* O suporte para senhas que utilizam o formato de hashing de senha pré-4.1 é removido, o que envolve as seguintes mudanças. Aplicações que utilizam qualquer recurso que não seja mais suportado devem ser modificadas.

+ O plugin de autenticação `mysql_old_password` é removido. As contas que usam este plugin são desativadas no início e o servidor escreve uma mensagem de “plugin desconhecido” no log de erro. Para instruções sobre a atualização de contas que usam este plugin, consulte a Seção 6.4.1.3, “Migrando para fora da hashing de senha pré-4.1 e do plugin mysql_old_password”.

+ A opção `--secure-auth` nos programas de servidor e cliente é a padrão, mas agora é uma opção sem efeito. Ela é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL.

+ A opção `--skip-secure-auth` nos programas de servidor e cliente não é mais suportada e o uso dela produz um erro.

+ A variável de sistema `secure_auth` permite apenas um valor de 1; um valor de 0 não é mais permitido.

+ Para a variável de sistema `old_passwords`, um valor de 1 (produzir hashes pré-4.1) não é mais permitido.

+ A função `OLD_PASSWORD()` é removida.

* No MySQL 5.6.6, o tipo de dados de 2 dígitos `YEAR(2)` foi descontinuado. O suporte para `YEAR(2)` foi removido. Uma vez que você faça a atualização para o MySQL 5.7.5 ou superior, quaisquer colunas de 2 dígitos restantes `YEAR(2)` devem ser convertidas em colunas de 4 dígitos `YEAR` para serem reutilizáveis novamente. Para estratégias de conversão, consulte a Seção 11.2.5, “Limitações de ANO(2) de 2 dígitos e Migração para ANO de 4 dígitos” Limitações e Migração para ANO de 4 dígitos”). Por exemplo, execute `mysqld_upgrade` após a atualização.

* A variável de sistema `innodb_mirrored_log_groups`. O único valor suportado era 1, portanto, não tinha propósito.

* A variável de sistema `storage_engine`. Use `default_storage_engine` em vez disso.

* A variável de sistema `thread_concurrency`. * A variável de sistema `timed_mutexes`, que não teve efeito.

* A cláusula `IGNORE` para `ALTER TABLE`.

* `INSERT DELAYED` não é mais suportado. O servidor reconhece, mas ignora a palavra-chave `DELAYED`, trata o inserto como um inserto não atrasado e gera um aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`. (“INSERT DELAYED não é mais suportado. A declaração foi convertida em INSERT.”) Da mesma forma, `REPLACE DELAYED` é tratado como uma substituição não atrasada. Você deve esperar que a palavra-chave `DELAYED` seja removida em uma versão futura.

Além disso, várias opções ou recursos relacionados ao `DELAYED` foram removidos:

+ A opção `--delayed-insert` para o **mysqldump**.

as colunas `COUNT_WRITE_DELAYED`, `SUM_TIMER_WRITE_DELAYED`, `MIN_TIMER_WRITE_DELAYED`, `AVG_TIMER_WRITE_DELAYED` e `MAX_TIMER_WRITE_DELAYED` da tabela do Gerador de Desempenho `table_lock_waits_summary_by_table`.

+ **mysqlbinlog** não escreve mais comentários que mencionam `INSERT DELAYED`.

* O enlaçamento de banco de dados no Windows usando arquivos `.sym` foi removido porque é redundante com o suporte nativo de enlaçamento disponível usando **mklink**. Qualquer enlaçamento simbólico de arquivos `.sym` agora é ignorado e deve ser substituído por enlaços criados usando **mklink**. Veja a Seção 8.12.3.3, “Usando Enlaços Simbólicos para Bancos de Dados no Windows”.

* As opções não utilizadas `--basedir`, `--datadir` e `--tmpdir` para `mysqld_upgrade` foram removidas.

* Anteriormente, as opções do programa podiam ser especificadas na íntegra ou como qualquer prefixo inequívoco. Por exemplo, a opção `--compress` poderia ser dada ao **mysqldump** como `--compr`, mas não como `--comp`, porque esta última é ambígua. Os prefixos de opções não são mais suportados; apenas as opções completas são aceitas. Isso ocorre porque os prefixos podem causar problemas quando novas opções são implementadas para programas e um prefixo que atualmente é inequívoco pode se tornar ambíguo no futuro. Algumas implicações dessa mudança:

+ A opção `--key-buffer` deve agora ser especificada como `--key-buffer-size`.

+ A opção `--skip-grant` deve agora ser especificada como `--skip-grant-tables`.

* A saída `SHOW ENGINE INNODB MUTEX` é removida. Informações comparáveis podem ser geradas ao criar visualizações em tabelas do Gerador de Desempenho.

* O monitor de espaço de tabela `InnoDB` e o monitor de tabela `InnoDB` são removidos. Para o monitor de tabela, informações equivalentes podem ser obtidas a partir das tabelas `InnoDB` `INFORMATION_SCHEMA`.

* As tabelas especificamente nomeadas usadas para habilitar e desabilitar o Monitor padrão `InnoDB` e o Monitor de bloqueio `InnoDB` (`innodb_monitor` e `innodb_lock_monitor`) são removidas e substituídas por duas variáveis dinâmicas do sistema: `innodb_status_output` e `innodb_status_output_locks`. Para informações adicionais, consulte a Seção 14.18, “Monitores InnoDB”.

As variáveis de sistema `innodb_use_sys_malloc` e `innodb_additional_mem_pool_size`, descontinuadas no MySQL 5.6.3, foram removidas.

* os utilitários **msql2mysql**, **mysql_convert_table_format**, **mysql_find_rows**, **mysql_fix_extensions**, **mysql_setpermission**, **mysql_waitpid**, **mysql_zap**, **mysqlaccess** e **mysqlbug**.

* O utilitário **mysqlhotcopy**. Alternativas incluem **mysqldump** e MySQL Enterprise Backup.

* O script **binary-configure.sh**. * A opção `INNODB_PAGE_ATOMIC_REF_COUNT` do **CMake** é removida.

* A opção `innodb_create_intrinsic` é removida.

* A opção `innodb_optimize_point_storage` e os tipos de dados internos relacionados (`DATA_POINT` e `DATA_VAR_POINT`) são removidos.

* A opção `innodb_log_checksum_algorithm` é removida.

* A variável de sistema `myisam_repair_threads` a partir do MySQL 5.7.39.