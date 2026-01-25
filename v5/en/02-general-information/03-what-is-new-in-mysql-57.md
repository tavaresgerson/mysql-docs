## 1.3 O Que Há de Novo no MySQL 5.7

Esta seção resume o que foi adicionado, descontinuado e removido no MySQL 5.7. Uma seção complementar lista as opções e variáveis de servidor do MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 5.7; veja Seção 1.4, “Variáveis e Opções de Servidor e Status Adicionadas, Descontinuadas ou Removidas no MySQL 5.7”.

### Funcionalidades Adicionadas no MySQL 5.7

As seguintes funcionalidades foram adicionadas ao MySQL 5.7:

* **Melhorias de segurança.** Esses aprimoramentos de segurança foram adicionados:

  + No MySQL 8.0, `caching_sha2_password` é o plugin de autenticação padrão. Para permitir que clientes MySQL 5.7 se conectem a servidores 8.0 usando contas que autenticam via `caching_sha2_password`, a biblioteca cliente e os programas cliente do MySQL 5.7 suportam o plugin de autenticação `caching_sha2_password` do lado do cliente a partir do MySQL 5.7.23. Isso melhora a compatibilidade do MySQL 5.7 com o MySQL 8.0 e servidores superiores. Veja Seção 6.4.1.4, “Autenticação Plug-in SHA-2 com Caching”.

  + O servidor agora exige que as linhas de conta na tabela de sistema `mysql.user` tenham um valor não vazio na coluna `plugin` e desativa contas com um valor vazio. Para instruções de atualização do servidor, veja Seção 2.10.3, “Mudanças no MySQL 5.7”. Aconselha-se aos DBAs que também convertam contas que usam o plugin de autenticação `mysql_old_password` para usar `mysql_native_password` em seu lugar, pois o suporte para `mysql_old_password` foi removido. Para instruções de atualização de conta, veja Seção 6.4.1.3, “Migrando da Geração de Hash de Senha Pré-4.1 e do Plugin mysql_old_password”.

  + O MySQL agora permite que os administradores de banco de dados estabeleçam uma política para expiração automática de senha: Qualquer usuário que se conectar ao servidor usando uma conta cuja senha expirou o prazo de validade permitido deve alterar a senha. Para mais informações, veja Seção 6.2.11, “Gerenciamento de Senhas”.

  + Os administradores podem bloquear e desbloquear contas para um melhor controle sobre quem pode fazer login. Para mais informações, veja Seção 6.2.15, “Bloqueio de Contas”.

  + Para facilitar o suporte a conexões seguras, os servidores MySQL compilados usando OpenSSL podem gerar automaticamente certificados SSL e RSA e arquivos de chave ausentes na inicialização. Veja Seção 6.3.3.1, “Criação de Certificados e Chaves SSL e RSA usando MySQL”.

    Todos os servidores, se não configurados explicitamente para SSL, tentam habilitar o SSL automaticamente na inicialização, caso encontrem os arquivos SSL necessários no `data directory`. Veja Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

    Além disso, as distribuições do MySQL incluem um utilitário **mysql_ssl_rsa_setup** que pode ser invocado manualmente para criar arquivos de chave e certificado SSL e RSA. Para mais informações, veja Seção 4.4.5, “mysql_ssl_rsa_setup — Criar Arquivos SSL/RSA”.

  + As implantações do MySQL instaladas usando **mysqld --initialize** são seguras por padrão. As seguintes alterações foram implementadas como características de implantação padrão:

    - O processo de instalação cria apenas uma única conta `root`, `'root'@'localhost'`, gera automaticamente uma senha aleatória para esta conta e marca a senha como expirada. O administrador do MySQL deve se conectar como `root` usando a senha aleatória e atribuir uma nova senha. (O servidor registra a senha aleatória no `error log`.)

    - A instalação não cria contas de usuário anônimas.
    - A instalação não cria o `database` `test`.

    Para mais informações, veja Seção 2.9.1, “Inicializando o Data Directory”.

  + O MySQL Enterprise Edition agora fornece recursos de mascaramento e desidentificação de dados. O mascaramento de dados oculta informações confidenciais, substituindo valores reais por substitutos. As funções MySQL Enterprise Data Masking and De-Identification permitem mascarar dados existentes usando vários métodos, como ofuscação (remoção de características de identificação), geração de dados aleatórios formatados e substituição ou substituição de dados. Para mais informações, veja Seção 6.5, “Mascaramento e Desidentificação de Dados do MySQL Enterprise”.

  + O MySQL agora define o controle de acesso concedido aos clientes no `named pipe` para o mínimo necessário para uma comunicação bem-sucedida no Windows. O software cliente MySQL mais recente pode abrir conexões de `named pipe` sem qualquer configuração adicional. Se o software cliente mais antigo não puder ser atualizado imediatamente, a nova variável de sistema `named_pipe_full_access_group` pode ser usada para dar a um grupo do Windows as permissões necessárias para abrir uma conexão de `named pipe`. A associação ao grupo de acesso total deve ser restrita e temporária.

* **Alterações no SQL mode.** O `strict SQL mode` para `transactional storage engines` (`STRICT_TRANS_TABLES`) agora está habilitado por padrão.

  A implementação para o SQL mode `ONLY_FULL_GROUP_BY` foi tornada mais sofisticada, para não mais rejeitar `queries` determinísticas que antes eram rejeitadas. Consequentemente, este modo agora está habilitado por padrão, para proibir apenas `queries` não determinísticas que contenham expressões que não têm garantia de serem determinadas unicamente dentro de um grupo.

  Os SQL modes `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` agora estão descontinuados, mas habilitados por padrão. O plano de longo prazo é tê-los incluídos no `strict SQL mode` e removê-los como modos explícitos em uma futura versão do MySQL. Veja Mudanças no SQL Mode no MySQL 5.7.

  As alterações no SQL mode padrão resultam em um valor padrão da variável de sistema `sql_mode` com estes modos habilitados: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`.

* **ALTER TABLE Online.** `ALTER TABLE` agora suporta uma cláusula `RENAME INDEX` que renomeia um `Index`. A mudança é feita no local sem uma operação de cópia de tabela. Funciona para todos os `storage engines`. Veja Seção 13.1.8, “Instrução ALTER TABLE”.

* **Plugins de parser full-text ngram e MeCab.** O MySQL fornece um plugin de parser full-text ngram embutido que suporta Chinês, Japonês e Coreano (CJK), e um plugin de parser full-text MeCab instalável para Japonês.

  Para mais informações, veja Seção 12.9.8, “Parser Full-Text ngram”, e Seção 12.9.9, “Plugin de Parser Full-Text MeCab”.

* **Aprimoramentos do InnoDB.** Estes aprimoramentos do `InnoDB` foram adicionados:

  + O tamanho da coluna `VARCHAR` pode ser aumentado usando um `ALTER TABLE` in-place, como neste exemplo:

    ```sql
    ALTER TABLE t1 ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(255);
    ```

    Isso é verdade desde que o número de `length bytes` exigidos por uma coluna `VARCHAR` permaneça o mesmo. Para colunas `VARCHAR` de 0 a 255 bytes de tamanho, um `length byte` é necessário para codificar o valor. Para colunas `VARCHAR` de 256 bytes de tamanho ou mais, dois `length bytes` são necessários. Como resultado, o `ALTER TABLE` in-place apenas suporta o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. O `ALTER TABLE` in-place não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de `length bytes` necessários muda de 1 para 2, o que é suportado apenas por uma cópia de tabela (`ALGORITHM=COPY`).

    A diminuição do tamanho `VARCHAR` usando `ALTER TABLE` in-place não é suportada. A diminuição do tamanho `VARCHAR` requer uma cópia de tabela (`ALGORITHM=COPY`).

    Para mais informações, veja Seção 14.13.1, “Operações DDL Online”.

  + O desempenho de DDL para tabelas temporárias `InnoDB` é melhorado por meio da otimização das instruções `CREATE TABLE`, `DROP TABLE`, `TRUNCATE TABLE` e `ALTER TABLE`.

  + Os metadados da tabela temporária `InnoDB` não são mais armazenados nas tabelas de sistema `InnoDB`. Em vez disso, uma nova tabela, `INNODB_TEMP_TABLE_INFO`, fornece aos usuários um instantâneo de tabelas temporárias ativas. A tabela contém metadados e relatórios sobre todas as tabelas temporárias criadas pelo usuário e pelo sistema que estão ativas dentro de uma determinada instância `InnoDB`. A tabela é criada quando a primeira instrução `SELECT` é executada nela.

  + O `InnoDB` agora suporta tipos de dados espaciais suportados pelo MySQL. Antes desta versão, o `InnoDB` armazenava dados espaciais como dados `BLOB` binários. `BLOB` continua sendo o tipo de dados subjacente, mas os tipos de dados espaciais agora são mapeados para um novo tipo de dados interno do `InnoDB`, `DATA_GEOMETRY`.

  + Agora existe um `tablespace` separado para todas as tabelas temporárias `InnoDB` não compactadas. O novo `tablespace` é sempre recriado na inicialização do servidor e está localizado em `DATADIR` por padrão. Uma nova opção de arquivo de configuração adicionada, `innodb_temp_data_file_path`, permite um caminho de arquivo de dados temporário definido pelo usuário.

  + A funcionalidade **innochecksum** é aprimorada com várias novas opções e capacidades estendidas. Veja Seção 4.6.1, “innochecksum — Utilitário de Checksum de Arquivo InnoDB Offline”.

  + Um novo tipo de `undo log` sem `redo` para tabelas temporárias normais e compactadas e objetos relacionados agora reside no `temporary tablespace`. Para mais informações, veja Seção 14.6.7, “Undo Logs”.

  + As operações de `dump` e `load` do `InnoDB buffer pool` são aprimoradas. Uma nova variável de sistema, `innodb_buffer_pool_dump_pct`, permite especificar a porcentagem das páginas usadas mais recentemente em cada `buffer pool` para serem lidas e despejadas (`dump`). Quando há outra atividade de I/O sendo executada por tarefas de background do `InnoDB`, o `InnoDB` tenta limitar o número de operações de `load` do `buffer pool` por segundo usando a configuração `innodb_io_capacity`.

  + O suporte a plugins de parser full-text é adicionado ao `InnoDB`. Para obter informações sobre plugins de parser full-text, veja Plugins de Parser Full-Text e Escrevendo Plugins de Parser Full-Text.

  + O `InnoDB` suporta múltiplos `page cleaner threads` para descarregar (`flush`) páginas sujas de instâncias do `buffer pool`. Uma nova variável de sistema, `innodb_page_cleaners`, é usada para especificar o número de `page cleaner threads`. O valor padrão de `1` mantém a configuração anterior em que há um único `page cleaner thread`. Este aprimoramento se baseia no trabalho concluído no MySQL 5.6, que introduziu um único `page cleaner thread` para descarregar o trabalho de `flush` do `buffer pool` do `InnoDB master thread`.

  + O suporte a DDL Online é estendido para as seguintes operações para tabelas `InnoDB` regulares e particionadas:

    - `OPTIMIZE TABLE`
    - `ALTER TABLE ... FORCE`

    - `ALTER TABLE ... ENGINE=INNODB` (quando executado em uma tabela `InnoDB`)

      O suporte a DDL Online reduz o tempo de reconstrução da tabela e permite DML concorrente. Veja Seção 14.13, “InnoDB e DDL Online”.

  + O sistema de arquivos Fusion-io Non-Volatile Memory (NVM) no Linux fornece capacidade de `atomic write`, o que torna o `InnoDB doublewrite buffer` redundante. O `InnoDB doublewrite buffer` é desabilitado automaticamente para arquivos de `system tablespace` (`ibdata files`) localizados em dispositivos Fusion-io que suportam `atomic writes`.

  + O `InnoDB` suporta o recurso Transportable Tablespace para tabelas `InnoDB` particionadas e partições de tabela `InnoDB` individuais. Este aprimoramento facilita os procedimentos de backup para tabelas particionadas e permite a cópia de tabelas particionadas e partições de tabela individuais entre instâncias do MySQL. Para mais informações, veja Seção 14.6.1.3, “Importando Tabelas InnoDB”.

  + O parâmetro `innodb_buffer_pool_size` é dinâmico, permitindo que você redimensione o `buffer pool` sem reiniciar o servidor. A operação de redimensionamento, que envolve a movimentação de páginas para um novo local na memória, é realizada em `chunks`. O tamanho do `chunk` é configurável usando a nova opção de configuração `innodb_buffer_pool_chunk_size`. Você pode monitorar o progresso do redimensionamento usando a nova variável de status `Innodb_buffer_pool_resize_status`. Para mais informações, veja Configurando o Tamanho do Buffer Pool do InnoDB Online.

  + O suporte ao `page cleaner` multithreaded (`innodb_page_cleaners`) é estendido para fases de desligamento e recuperação.

  + O `InnoDB` suporta a indexação de tipos de dados espaciais usando `SPATIAL indexes`, incluindo o uso de `ALTER TABLE ... ALGORITHM=INPLACE` para operações online (`ADD SPATIAL INDEX`).

  + O `InnoDB` executa um `bulk load` ao criar ou reconstruir `indexes`. Este método de criação de `index` é conhecido como “construção de `index` classificado” (`sorted index build`). Este aprimoramento, que melhora a eficiência da criação de `index`, também se aplica a `full-text indexes`. Uma nova opção de configuração global, `innodb_fill_factor`, define a porcentagem de espaço em cada página que é preenchida com dados durante uma construção de `index` classificado, com o espaço restante reservado para crescimento futuro do `index`. Para mais informações, veja Seção 14.6.2.3, “Construção de Indexes Classificados”.

  + Um novo tipo de registro de log (`MLOG_FILE_NAME`) é usado para identificar `tablespaces` que foram modificados desde o último `checkpoint`. Este aprimoramento simplifica a descoberta de `tablespace` durante a recuperação de falhas e elimina varreduras no sistema de arquivos antes da aplicação do `redo log`. Para mais informações sobre os benefícios deste aprimoramento, veja Descoberta de Tablespace Durante a Recuperação de Falhas.

    Este aprimoramento altera o formato do `redo log`, exigindo que o MySQL seja desligado de forma limpa antes de atualizar ou fazer downgrade para ou de MySQL 5.7.5.

  + Você pode truncar `undo logs` que residem em `undo tablespaces`. Este recurso é habilitado usando a opção de configuração `innodb_undo_log_truncate`. Para mais informações, veja Truncando Undo Tablespaces.

  + O `InnoDB` suporta particionamento nativo. Anteriormente, o `InnoDB` dependia do manipulador `ha_partition`, que criava um objeto manipulador para cada partição. Com o particionamento nativo, uma tabela `InnoDB` particionada usa um único objeto manipulador com reconhecimento de partição. Este aprimoramento reduz a quantidade de memória necessária para tabelas `InnoDB` particionadas.

    A partir do MySQL 5.7.9, o **mysql_upgrade** procura e tenta atualizar tabelas `InnoDB` particionadas que foram criadas usando o manipulador `ha_partition`. Também no MySQL 5.7.9 e posterior, você pode atualizar essas tabelas por nome no cliente **mysql** usando `ALTER TABLE ... UPGRADE PARTITIONING`.

  + O `InnoDB` suporta a criação de `general tablespaces` usando a sintaxe `CREATE TABLESPACE`.

    ```sql
    CREATE TABLESPACE `tablespace_name`
      ADD DATAFILE 'file_name.ibd'
      [FILE_BLOCK_SIZE = n]
    ```

    Os `General tablespaces` podem ser criados fora do `MySQL data directory`, são capazes de armazenar múltiplas tabelas e suportam tabelas de todos os formatos de linha.

    As tabelas são adicionadas a um `general tablespace` usando a sintaxe `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`.

    Para mais informações, veja Seção 14.6.3.3, “General Tablespaces”.

  + `DYNAMIC` substitui `COMPACT` como o formato de linha padrão implícito para tabelas `InnoDB`. Uma nova opção de configuração, `innodb_default_row_format`, especifica o formato de linha padrão do `InnoDB`. Para mais informações, veja Definindo o Formato de Linha de uma Tabela.

  + A partir do MySQL 5.7.11, o `InnoDB` suporta criptografia de dados em repouso (`data-at-rest encryption`) para `file-per-table tablespaces`. A criptografia é habilitada especificando a opção `ENCRYPTION` ao criar ou alterar uma tabela `InnoDB`. Este recurso depende de um plugin `keyring` para gerenciamento de chaves de criptografia. Para mais informações, veja Seção 6.4.4, “O Keyring do MySQL”, e Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

  + A partir do MySQL 5.7.24, a versão da biblioteca zlib incluída com o MySQL foi elevada da versão 1.2.3 para a versão 1.2.11. O MySQL implementa compressão com a ajuda da biblioteca zlib.

    Se você usar tabelas compactadas `InnoDB`, veja Seção 2.10.3, “Mudanças no MySQL 5.7” para implicações de atualização relacionadas.

* **Suporte a JSON.** A partir do MySQL 5.7.8, o MySQL suporta um tipo `JSON` nativo. Os valores JSON não são armazenados como `strings`, usando em vez disso um formato binário interno que permite acesso rápido de leitura a elementos do documento. Os documentos JSON armazenados em colunas `JSON` são validados automaticamente sempre que são inseridos ou atualizados, com um documento inválido produzindo um erro. Os documentos JSON são normalizados na criação e podem ser comparados usando a maioria dos operadores de comparação, como `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`; para obter informações sobre operadores suportados, bem como precedência e outras regras que o MySQL segue ao comparar valores `JSON`, veja Comparação e Ordenação de Valores JSON.

  O MySQL 5.7.8 também introduz uma série de funções para trabalhar com valores `JSON`. Estas funções incluem as listadas aqui:

  + Funções que criam valores `JSON`: `JSON_ARRAY()`, `JSON_MERGE()` e `JSON_OBJECT()`. Veja Seção 12.17.2, “Funções Que Criam Valores JSON”.

  + Funções que pesquisam valores `JSON`: `JSON_CONTAINS()`, `JSON_CONTAINS_PATH()`, `JSON_EXTRACT()`, `JSON_KEYS()` e `JSON_SEARCH()`. Veja Seção 12.17.3, “Funções Que Pesquisam Valores JSON”.

  + Funções que modificam valores `JSON`: `JSON_APPEND()`, `JSON_ARRAY_APPEND()`, `JSON_ARRAY_INSERT()`, `JSON_INSERT()`, `JSON_QUOTE()`, `JSON_REMOVE()`, `JSON_REPLACE()`, `JSON_SET()` e `JSON_UNQUOTE()`. Veja Seção 12.17.4, “Funções Que Modificam Valores JSON”.

  + Funções que fornecem informações sobre valores `JSON`: `JSON_DEPTH()`, `JSON_LENGTH()`, `JSON_TYPE()` e `JSON_VALID()`. Veja Seção 12.17.5, “Funções Que Retornam Atributos de Valor JSON”.

  No MySQL 5.7.9 e posterior, você pode usar `column->path` como abreviação para `JSON_EXTRACT(column, path)`. Isso funciona como um `alias` para uma coluna onde quer que um identificador de coluna possa ocorrer em uma instrução SQL, incluindo as cláusulas `WHERE`, `ORDER BY` e `GROUP BY`. Isso inclui `SELECT`, `UPDATE`, `DELETE`, `CREATE TABLE` e outras instruções SQL. O lado esquerdo deve ser um identificador de coluna `JSON` (e não um `alias`). O lado direito é uma expressão de caminho JSON entre aspas que é avaliada em relação ao documento JSON retornado como o valor da coluna.

  O MySQL 5.7.22 adiciona as seguintes funções JSON:

  + Duas funções de agregação JSON, `JSON_ARRAYAGG()` e `JSON_OBJECTAGG()`. `JSON_ARRAYAGG()` recebe uma coluna ou expressão como argumento e agrega o resultado como um único `JSON array`. A expressão pode ser avaliada para qualquer tipo de dados MySQL; não precisa ser um valor `JSON`. `JSON_OBJECTAGG()` recebe duas colunas ou expressões que interpreta como uma chave e um valor; ele retorna o resultado como um único `JSON object`. Para mais informações e exemplos, veja Seção 12.19, “Funções de Agregação”.

  + A função de utilidade JSON `JSON_PRETTY()`, que exibe um valor `JSON` existente em um formato fácil de ler; cada membro do `JSON object` ou valor do `array` é impresso em uma linha separada, e um objeto ou `array` filho é recuado 2 espaços em relação ao seu pai.

    Esta função também funciona com uma `string` que pode ser analisada como um valor JSON.

    Veja também Seção 12.17.6, “Funções de Utilidade JSON”.

  + A função de utilidade JSON `JSON_STORAGE_SIZE()`, que retorna o espaço de armazenamento em bytes usado para a representação binária de um documento JSON antes de qualquer atualização parcial (veja o item anterior).

    Esta função também aceita uma representação de `string` válida de um documento JSON. Para tal valor, `JSON_STORAGE_SIZE()` retorna o espaço usado por sua representação binária após sua conversão para um documento JSON. Para uma variável contendo a representação de `string` de um documento JSON, `JSON_STORAGE_FREE()` retorna zero. Qualquer uma das funções produz um erro se seu argumento (não nulo) não puder ser analisado como um documento JSON válido e `NULL` se o argumento for `NULL`.

    Para mais informações e exemplos, veja Seção 12.17.6, “Funções de Utilidade JSON”.

  + Uma função de mesclagem JSON destinada a estar em conformidade com o RFC 7396. `JSON_MERGE_PATCH()`, quando usado em 2 objetos JSON, os mescla em um único `JSON object` que tem como membros uma união dos seguintes conjuntos:

    - Cada membro do primeiro objeto para o qual não há membro com a mesma chave no segundo objeto.

    - Cada membro do segundo objeto para o qual não há membro com a mesma chave no primeiro objeto e cujo valor não é o literal JSON `null`.

    - Cada membro com uma chave que existe em ambos os objetos e cujo valor no segundo objeto não é o literal JSON `null`.

    Como parte deste trabalho, a função `JSON_MERGE()` foi renomeada para `JSON_MERGE_PRESERVE()`. `JSON_MERGE()` continua a ser reconhecida como um `alias` para `JSON_MERGE_PRESERVE()` no MySQL 5.7, mas agora está descontinuada e sujeita a remoção em uma versão futura do MySQL.

    Para mais informações e exemplos, veja Seção 12.17.4, “Funções Que Modificam Valores JSON”.

  Veja Seção 12.17.3, “Funções Que Pesquisam Valores JSON”, para mais informações sobre `->` e `JSON_EXTRACT()`. Para obter informações sobre o suporte a caminhos JSON no MySQL 5.7, veja Pesquisando e Modificando Valores JSON. Veja também Indexando uma Coluna Gerada para Fornecer um Index de Coluna JSON.

* **Variáveis de sistema e status.** As informações de variáveis de sistema e status agora estão disponíveis em tabelas do Performance Schema, em preferência ao uso de tabelas `INFORMATION_SCHEMA` para obter essas variáveis. Isso também afeta a operação das instruções `SHOW VARIABLES` e `SHOW STATUS`. O valor da variável de sistema `show_compatibility_56` afeta a saída produzida e os privilégios exigidos para instruções e tabelas de variáveis de sistema e status. Para detalhes, veja a descrição dessa variável na Seção 5.1.7, “Variáveis de Sistema do Servidor”.

  Nota

  O padrão para `show_compatibility_56` é `OFF`. Os aplicativos que exigem o comportamento 5.6 devem definir esta variável como `ON` até que tenham sido migrados para o novo comportamento de variáveis de sistema e variáveis de status. Veja Seção 25.20, “Migrando para as Tabelas de Variáveis de Sistema e Status do Performance Schema”

* **sys schema.** As distribuições do MySQL agora incluem o `sys schema`, que é um conjunto de objetos que ajudam DBAs e desenvolvedores a interpretar os dados coletados pelo Performance Schema. Os objetos do `sys schema` podem ser usados para casos de uso típicos de `tuning` e diagnóstico. Para mais informações, veja Capítulo 26, *MySQL sys Schema*.

* **Tratamento de condição.** O MySQL agora suporta áreas de diagnóstico empilhadas (`stacked diagnostics areas`). Quando a pilha da área de diagnóstico é empurrada (`pushed`), a primeira área de diagnóstico (atual) se torna a segunda área de diagnóstico (empilhada) e uma nova área de diagnóstico atual é criada como uma cópia dela. Dentro de um `condition handler`, as instruções executadas modificam a nova área de diagnóstico atual, mas `GET STACKED DIAGNOSTICS` pode ser usado para inspecionar a área de diagnóstico empilhada para obter informações sobre a condição que causou a ativação do `handler`, independentemente das condições atuais dentro do próprio `handler`. (Anteriormente, havia uma única área de diagnóstico. Para inspecionar as condições de ativação do `handler` dentro de um `handler`, era necessário verificar esta área de diagnóstico antes de executar qualquer instrução que pudesse alterá-la.) Veja Seção 13.6.7.3, “Instrução GET DIAGNOSTICS”, e Seção 13.6.7.7, “A Área de Diagnóstico do MySQL”.

* **Optimizer.** Estes aprimoramentos do `optimizer` foram adicionados:

  + `EXPLAIN` pode ser usado para obter o plano de execução para uma instrução explicável sendo executada em uma conexão nomeada:

    ```sql
    EXPLAIN [options] FOR CONNECTION connection_id;
    ```

    Para mais informações, veja Seção 8.8.4, “Obtendo Informações do Plano de Execução para uma Conexão Nomeada”.

  + É possível fornecer `hints` ao `optimizer` dentro de instruções SQL individuais, o que permite um controle mais refinado sobre os planos de execução de instrução do que pode ser alcançado usando a variável de sistema `optimizer_switch`. `Hints` também são permitidos em instruções usadas com `EXPLAIN`, permitindo que você veja como os `hints` afetam os planos de execução. Para mais informações, veja Seção 8.9.3, “Optimizer Hints”.

  + **flag prefer_ordering_index.** Por padrão, o MySQL tenta usar um `ordered index` para qualquer `Query ORDER BY` ou `GROUP BY` que tenha uma cláusula `LIMIT`, sempre que o `optimizer` determinar que isso resultaria em execução mais rápida. Como é possível em alguns casos que a escolha de uma otimização diferente para tais `queries` realmente tenha um desempenho melhor, é possível a partir do MySQL 5.7.33 desabilitar esta otimização definindo a `flag` `prefer_ordering_index` como `off`.

    O valor padrão para esta `flag` é `on`.

    Para mais informações e exemplos, veja Seção 8.9.2, “Otimizações Alternáveis”, e Seção 8.2.1.17, “Otimização de Query LIMIT”.

* **Triggers.** Anteriormente, uma tabela podia ter no máximo um `trigger` para cada combinação de evento de `trigger` (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`). Esta limitação foi removida e múltiplos `triggers` são permitidos. Para mais informações, veja Seção 23.3, “Usando Triggers”.

* **Logging.** Estes aprimoramentos de `logging` foram adicionados:

  + Anteriormente, em sistemas Unix e semelhantes ao Unix, o suporte do MySQL para enviar o `server error log` para o `syslog` era implementado fazendo com que **mysqld_safe** capturasse a saída de erro do servidor e a passasse para o `syslog`. O servidor agora inclui suporte nativo ao `syslog`, que foi estendido para incluir o Windows. Para mais informações sobre como enviar a saída de erro do servidor para o `syslog`, veja Seção 5.4.2, “O Error Log”.

  + O cliente **mysql** agora tem uma opção `--syslog` que faz com que as instruções interativas sejam enviadas para o recurso `syslog` do sistema. O `logging` é suprimido para instruções que correspondem à lista de padrões “ignorar” padrão (`"*IDENTIFIED*:*PASSWORD*"`), bem como instruções que correspondem a quaisquer padrões especificados usando a opção `--histignore`. Veja Seção 4.5.1.3, “Logging do Cliente mysql”.

* **Generated Columns.** O MySQL agora suporta a especificação de `generated columns` nas instruções `CREATE TABLE` e `ALTER TABLE`. Os valores de uma `generated column` são calculados a partir de uma expressão especificada no momento da criação da coluna. As `Generated columns` podem ser virtuais (calculadas “on the fly” quando as linhas são lidas) ou armazenadas (calculadas quando as linhas são inseridas ou atualizadas). Para mais informações, veja Seção 13.1.18.7, “CREATE TABLE e Generated Columns”.

* **Cliente mysql.** Anteriormente, **Control+C** no mysql interrompia a instrução atual, se houvesse, ou saía do mysql, se não houvesse. Agora, **Control+C** interrompe a instrução atual, se houver, ou cancela qualquer linha de entrada parcial, caso contrário, mas não sai.

* **Renomeação de database com mysqlbinlog.** A renomeação de `databases` por **mysqlbinlog** ao ler a partir de `binary logs` escritos usando o formato baseado em linha agora é suportada usando a opção `--rewrite-db` adicionada no MySQL 5.7.1.

  Esta opção usa o formato `--rewrite-db='dboldname->dbnewname'`. Você pode implementar múltiplas regras de reescrita, especificando a opção várias vezes.

* **HANDLER com tabelas particionadas.** A instrução `HANDLER` agora pode ser usada com tabelas particionadas pelo usuário. Tais tabelas podem usar qualquer um dos tipos de particionamento disponíveis (veja Seção 22.2, “Tipos de Particionamento”).

* **Suporte a Index condition pushdown para tabelas particionadas.** Queries em tabelas particionadas usando o `storage engine` `InnoDB` ou `MyISAM` podem empregar a otimização `index condition pushdown` que foi introduzida no MySQL 5.6. Veja Seção 8.2.1.5, “Otimização Index Condition Pushdown”, para mais informações.

* **Suporte a WITHOUT VALIDATION para ALTER TABLE ... EXCHANGE PARTITION.** A partir do MySQL 5.7.5, a sintaxe `ALTER TABLE ... EXCHANGE PARTITION` inclui uma cláusula opcional `{WITH|WITHOUT} VALIDATION`. Quando `WITHOUT VALIDATION` é especificado, `ALTER TABLE ... EXCHANGE PARTITION` não executa a validação linha por linha ao trocar uma tabela populada pela partição, permitindo que os administradores de banco de dados assumam a responsabilidade de garantir que as linhas estejam dentro dos limites da definição da partição. `WITH VALIDATION` é o comportamento padrão e não precisa ser especificado explicitamente. Para mais informações, veja Seção 22.3.3, “Trocando Partições e Subpartições com Tabelas”.

* **Melhorias no source dump thread.** O `source dump thread` foi refatorado para reduzir a contenção de `lock` e melhorar o `throughput` da `source`. Antes do MySQL 5.7.2, o `dump thread` pegava um `lock` no `binary log` sempre que lia um evento; no MySQL 5.7.2 e posterior, este `lock` é mantido apenas durante a leitura da posição no final do último evento escrito com sucesso. Isso significa que agora múltiplos `dump threads` são capazes de ler concorrentemente do arquivo `binary log`, e que os `dump threads` agora são capazes de ler enquanto os clientes estão escrevendo no `binary log`.

* **Suporte a Character set.** O MySQL 5.7.4 inclui um `character set` `gb18030` que suporta o `character set` China National Standard GB18030. Para mais informações sobre o suporte a `character set` do MySQL, veja Capítulo 10, *Character Sets, Collation, Unicode*.

* **Alterando a source de Replication sem STOP SLAVE.** No MySQL 5.7.4 e posterior, o requisito estrito de executar `STOP SLAVE` antes de emitir qualquer instrução `CHANGE MASTER TO` é removido. Em vez de depender se a `replica` está parada, o comportamento de `CHANGE MASTER TO` agora depende dos estados do `replica SQL thread` e dos `replica I/O threads`; qual desses `threads` está parado ou em execução agora determina as opções que podem ou não ser usadas com uma instrução `CHANGE MASTER TO` em um determinado momento. As regras para fazer esta determinação estão listadas aqui:

  + Se o `SQL thread` estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer combinação das opções `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `MASTER_DELAY`, mesmo que o `replica I/O thread` esteja em execução. Nenhuma outra opção pode ser usada com esta instrução quando o `I/O thread` está em execução.

  + Se o `I/O thread` estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções para esta instrução (em qualquer combinação permitida), *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou `MASTER_DELAY`, mesmo quando o `SQL thread` está em execução. Estas três opções não podem ser usadas quando o `I/O thread` está em execução.

  + Tanto o `SQL thread` quanto o `I/O thread` devem ser interrompidos antes de emitir `CHANGE MASTER TO ... MASTER_AUTO_POSITION = 1`.

  Você pode verificar o estado atual dos `SQL` e `I/O threads` da `replica` usando `SHOW SLAVE STATUS`.

  Se você estiver usando `statement-based replication` e tabelas temporárias, é possível que uma instrução `CHANGE MASTER TO` após uma instrução `STOP SLAVE` deixe tabelas temporárias na `replica`. Como parte deste conjunto de melhorias, agora é emitido um aviso sempre que `CHANGE MASTER TO` é emitido após `STOP SLAVE` quando o `statement-based replication` está em uso e `Slave_open_temp_tables` permanece maior que 0.

  Para mais informações, veja Seção 13.4.2.1, “Instrução CHANGE MASTER TO”, e Seção 16.3.7, “Mudança de Sources Durante o Failover”.

* **Test suite.** O `test suite` do MySQL agora usa `InnoDB` como o `storage engine` padrão.

* **Replication Multi-Source agora é possível.** O MySQL Multi-Source Replication adiciona a capacidade de replicar de múltiplas `sources` para uma `replica`. As topologias do MySQL Multi-Source Replication podem ser usadas para fazer backup de múltiplos servidores em um único servidor, para mesclar `table shards` e consolidar dados de múltiplos servidores em um único servidor. Veja Seção 16.1.5, “MySQL Multi-Source Replication”.

  Como parte do MySQL Multi-Source Replication, `replication channels` foram adicionados. Os `Replication channels` permitem que uma `replica` abra múltiplas conexões para replicar, sendo cada `channel` uma conexão com uma `source`. Veja Seção 16.2.2, “Replication Channels”.

* **Tabelas do Performance Schema do Group Replication.** O MySQL 5.7 adiciona uma série de novas tabelas ao Performance Schema para fornecer informações sobre `replication groups` e `channels`. Estas incluem as seguintes tabelas:

  + `replication_applier_configuration`
  + `replication_applier_status`
  + `replication_applier_status_by_coordinator`
  + `replication_applier_status_by_worker`
  + `replication_connection_configuration`
  + `replication_connection_status`
  + `replication_group_members`
  + `replication_group_member_stats`

  Todas essas tabelas foram adicionadas no MySQL 5.7.2, exceto `replication_group_members` e `replication_group_member_stats`, que foram adicionadas no MySQL 5.7.6. Para mais informações, veja Seção 25.12.11, “Tabelas de Replication do Performance Schema”.

* **SQL do Group Replication.** As seguintes instruções foram adicionadas no MySQL 5.7.6 para controlar o Group Replication:

  + `START GROUP_REPLICATION`
  + `STOP GROUP_REPLICATION`

  Para mais informações, veja Seção 13.4.3, “Instruções SQL para Controle de Group Replication”.

### Funcionalidades Descontinuadas no MySQL 5.7

As seguintes funcionalidades estão descontinuadas no MySQL 5.7 e podem ser removidas em uma série futura. Onde alternativas são mostradas, os aplicativos devem ser atualizados para usá-las.

Para aplicativos que usam funcionalidades descontinuadas no MySQL 5.7 que foram removidas em uma série MySQL superior, as instruções podem falhar quando replicadas de uma `source` MySQL 5.7 para uma `replica` de série superior, ou podem ter efeitos diferentes na `source` e na `replica`. Para evitar tais problemas, os aplicativos que usam funcionalidades descontinuadas no 5.7 devem ser revisados para evitá-las e usar alternativas quando possível.

* Os SQL modes `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` agora estão descontinuados, mas habilitados por padrão. O plano de longo prazo é tê-los incluídos no `strict SQL mode` e removê-los como modos explícitos em uma futura versão do MySQL.

  Os SQL modes descontinuados `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` ainda são reconhecidos para que as instruções que os nomeiam não produzam um erro, mas espera-se que sejam removidos em uma versão futura do MySQL. Para se preparar antecipadamente para versões do MySQL nas quais esses nomes de modo não existam, os aplicativos devem ser modificados para não se referirem a eles. Veja Mudanças no SQL Mode no MySQL 5.7.

* Estes SQL modes agora estão descontinuados; espere que sejam removidos em uma versão futura do MySQL: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`. Estas descontinuações têm duas implicações:

  + Atribuir um modo descontinuado à variável de sistema `sql_mode` produz um aviso.

  + Com o SQL mode `MAXDB` habilitado, usar `CREATE TABLE` ou `ALTER TABLE` para adicionar uma coluna `TIMESTAMP` a uma tabela produz um aviso.

* Alterações nas instruções de gerenciamento de contas tornam os seguintes recursos obsoletos. Eles agora estão descontinuados:

  + Usar `GRANT` para criar usuários. Em vez disso, use `CREATE USER`. Seguir esta prática torna o SQL mode `NO_AUTO_CREATE_USER` imaterial para instruções `GRANT`, então ele também está descontinuado.

  + Usar `GRANT` para modificar propriedades de conta diferentes das atribuições de privilégio. Isso inclui propriedades de autenticação, SSL e `resource-limit`. Em vez disso, estabeleça tais propriedades no momento da criação da conta com `CREATE USER` ou modifique-as depois com `ALTER USER`.

  + Sintaxe `IDENTIFIED BY PASSWORD 'auth_string'` para `CREATE USER` e `GRANT`. Em vez disso, use `IDENTIFIED WITH auth_plugin AS 'auth_string'` para `CREATE USER` e `ALTER USER`, onde o valor `'auth_string'` está em um formato compatível com o plugin nomeado.

  + A função `PASSWORD()` está descontinuada e deve ser evitada em qualquer contexto. Assim, a sintaxe `SET PASSWORD ... = PASSWORD('auth_string')` também está descontinuada. A sintaxe `SET PASSWORD ... = 'auth_string'` não está descontinuada; no entanto, `ALTER USER` agora é a instrução preferida para atribuição de senhas.

  + A variável de sistema `old_passwords`. Os plugins de autenticação de conta não podem mais ser deixados sem especificação na tabela de sistema `mysql.user`, então qualquer instrução que atribua uma senha a partir de uma `string` de texto simples pode determinar inequivocamente o método de `hashing` a ser usado na `string` antes de armazená-la na tabela `mysql.user`. Isso torna `old_passwords` supérflua.

* O `Query cache` está descontinuado. A descontinuação inclui estes itens:

  + As instruções `FLUSH QUERY CACHE` e `RESET QUERY CACHE`.

  + Os modificadores `SELECT` `SQL_CACHE` e `SQL_NO_CACHE`.

  + Estas variáveis de sistema: `have_query_cache`, `ndb_cache_check_time`, `query_cache_limit`, `query_cache_min_res_unit`, `query_cache_size`, `query_cache_type`, `query_cache_wlock_invalidate`.

  + Estas variáveis de status: `Qcache_free_blocks`, `Qcache_free_memory`, `Qcache_hits`, `Qcache_inserts`, `Qcache_lowmem_prunes`, `Qcache_not_cached`, `Qcache_queries_in_cache`, `Qcache_total_blocks`.

* Anteriormente, as opções de inicialização do servidor `--transaction-isolation` e `--transaction-read-only` correspondiam às variáveis de sistema `tx_isolation` e `tx_read_only`. Para melhor correspondência de nomes entre a opção de inicialização e os nomes das variáveis de sistema, `transaction_isolation` e `transaction_read_only` foram criados como `aliases` para `tx_isolation` e `tx_read_only`. As variáveis `tx_isolation` e `tx_read_only` agora estão descontinuadas; espere que sejam removidas no MySQL 8.0. Os aplicativos devem ser ajustados para usar `transaction_isolation` e `transaction_read_only` em seu lugar.

* A opção `--skip-innodb` e seus sinônimos (`--innodb=OFF`, `--disable-innodb`, e assim por diante) estão descontinuados. Essas opções não têm efeito a partir do MySQL 5.7. porque o `InnoDB` não pode ser desabilitado.

* As opções do lado do cliente `--ssl` e `--ssl-verify-server-cert` estão descontinuadas. Use `--ssl-mode=REQUIRED` em vez de `--ssl=1` ou `--enable-ssl`. Use `--ssl-mode=DISABLED` em vez de `--ssl=0`, `--skip-ssl` ou `--disable-ssl`. Use `--ssl-mode=VERIFY_IDENTITY` em vez das opções `--ssl-verify-server-cert`. (A opção `--ssl` do lado do servidor *não* está descontinuada.)

  Para a C API, as opções `MYSQL_OPT_SSL_ENFORCE` e `MYSQL_OPT_SSL_VERIFY_SERVER_CERT` para `mysql_options()` correspondem às opções do lado do cliente `--ssl` e `--ssl-verify-server-cert` e estão descontinuadas. Use `MYSQL_OPT_SSL_MODE` com um valor de opção de `SSL_MODE_REQUIRED` ou `SSL_MODE_VERIFY_IDENTITY` em seu lugar.

* A variável de sistema `log_warnings` e a opção de servidor `--log-warnings` estão descontinuadas. Use a variável de sistema `log_error_verbosity` em seu lugar.

* A opção de servidor `--temp-pool` está descontinuada.

* A variável de sistema `binlog_max_flush_queue_time` não faz nada no MySQL 5.7 e está descontinuada a partir do MySQL 5.7.9.

* A variável de sistema `innodb_support_xa`, que habilita o suporte do `InnoDB` para `two-phase commit` em XA `transactions`, está descontinuada a partir do MySQL 5.7.10. O suporte do `InnoDB` para `two-phase commit` em XA `transactions` está sempre habilitado a partir do MySQL 5.7.10.

* As variáveis de sistema `metadata_locks_cache_size` e `metadata_locks_hash_instances` estão descontinuadas. Elas não fazem nada a partir do MySQL 5.7.4.

* A variável de sistema `sync_frm` está descontinuada.

* As variáveis de sistema global `character_set_database` e `collation_database` estão descontinuadas; espere que sejam removidas em uma versão futura do MySQL.

  Atribuir um valor às variáveis de sistema de sessão `character_set_database` e `collation_database` está descontinuado e as atribuições produzem um aviso. Espera-se que as variáveis de sessão se tornem somente leitura em uma versão futura do MySQL, e as atribuições a elas produzam um erro, enquanto permanece possível ler as variáveis de sessão para determinar o `database character set` e `collation` para o `default database`.

* O escopo global para a variável de sistema `sql_log_bin` foi descontinuado, e esta variável agora pode ser definida apenas com escopo de sessão. A instrução `SET GLOBAL SQL_LOG_BIN` agora produz um erro. Continua sendo possível ler o valor global de `sql_log_bin`, mas fazê-lo produz um aviso. Você deve agir agora para remover de seus aplicativos quaisquer dependências na leitura deste valor; o escopo global `sql_log_bin` é removido no MySQL 8.0.

* Com a introdução do dicionário de dados no MySQL 8.0, a opção `--ignore-db-dir` e a variável de sistema `ignore_db_dirs` se tornaram supérfluas e foram removidas nessa versão. Consequentemente, elas estão descontinuadas no MySQL 5.7.

* `GROUP BY` implicitamente ordena por padrão (ou seja, na ausência de designadores `ASC` ou `DESC`), mas confiar na ordenação implícita de `GROUP BY` no MySQL 5.7 está descontinuado. Para obter uma ordem de classificação específica de resultados agrupados, é preferível usar designadores explícitos `ASC` ou `DESC` para colunas `GROUP BY` ou fornecer uma cláusula `ORDER BY`. A ordenação `GROUP BY` é uma extensão do MySQL que pode mudar em uma versão futura; por exemplo, para tornar possível que o `optimizer` ordene agrupamentos da maneira que julgar mais eficiente e evitar a sobrecarga de ordenação.

* As palavras-chave `EXTENDED` e `PARTITIONS` para a instrução `EXPLAIN` estão descontinuadas. Essas palavras-chave ainda são reconhecidas, mas agora são desnecessárias porque seu efeito está sempre habilitado.

* As funções de criptografia `ENCRYPT()`, `ENCODE()`, `DECODE()`, `DES_ENCRYPT()` e `DES_DECRYPT()` estão descontinuadas. Para `ENCRYPT()`, considere usar `SHA2()` em vez disso para `one-way hashing`. Para as outras, considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em seu lugar. A opção `--des-key-file`, a variável de sistema `have_crypt`, a opção `DES_KEY_FILE` para a instrução `FLUSH` e a opção `HAVE_CRYPT` do **CMake** também estão descontinuadas.

* A função espacial `MBREqual()` está descontinuada. Use `MBREquals()` em seu lugar.

* As funções descritas na Seção 12.16.4, “Funções Que Criam Valores de Geometria a partir de Valores WKB” anteriormente aceitavam `strings` WKB ou argumentos de geometria. O uso de argumentos de geometria está descontinuado. Veja essa seção para diretrizes sobre como migrar `queries` para longe do uso de argumentos de geometria.

* A tabela `PROFILING` do `INFORMATION_SCHEMA` está descontinuada. Use o Performance Schema em seu lugar; veja Capítulo 25, *MySQL Performance Schema*.

* As tabelas `INNODB_LOCKS` e `INNODB_LOCK_WAITS` do `INFORMATION_SCHEMA` estão descontinuadas, para serem removidas no MySQL 8.0, que fornece tabelas de substituição do Performance Schema.

* A tabela `setup_timers` do Performance Schema está descontinuada e é removida no MySQL 8.0, assim como a linha `TICK` na tabela `performance_timers`.

* A `view` `sys.version` do `sys schema` está descontinuada; espere que seja removida em uma versão futura do MySQL. Os aplicativos afetados devem ser ajustados para usar uma alternativa em seu lugar. Por exemplo, use a função `VERSION()` para recuperar a versão do servidor MySQL.

* O tratamento de `\N` como sinônimo de `NULL` em instruções SQL está descontinuado e é removido no MySQL 8.0; use `NULL` em seu lugar.

  Esta alteração não afeta as operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, para as quais `NULL` continua a ser representado por `\N`. Veja Seção 13.2.6, “Instrução LOAD DATA”.

* A sintaxe `PROCEDURE ANALYSE()` está descontinuada.
* A remoção de comentários pelo cliente **mysql** e as opções para controlá-la (`--skip-comments`, `--comments`) estão descontinuadas.

* O suporte de **mysqld_safe** para saída `syslog` está descontinuado. Use o suporte nativo do `syslog` do servidor em vez disso. Veja Seção 5.4.2, “O Error Log”.

* A conversão de nomes de `database` pré-MySQL 5.1 contendo caracteres especiais para o formato 5.1 com a adição de um prefixo `#mysql50#` está descontinuada. Por causa disso, as opções `--fix-db-names` e `--fix-table-names` para **mysqlcheck** e a cláusula `UPGRADE DATA DIRECTORY NAME` para a instrução `ALTER DATABASE` também estão descontinuadas.

  As atualizações são suportadas apenas de uma série de lançamento para outra (por exemplo, 5.0 para 5.1, ou 5.1 para 5.5), então deve haver pouca necessidade restante de conversão de nomes de `database` 5.0 mais antigos para versões atuais do MySQL. Como solução alternativa, atualize uma instalação do MySQL 5.0 para o MySQL 5.1 antes de atualizar para uma versão mais recente.

* A funcionalidade **mysql_install_db** foi integrada ao servidor MySQL, **mysqld**. Para usar este recurso para inicializar uma instalação do MySQL, se você invocou **mysql_install_db** manualmente anteriormente, invoque **mysqld** com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o servidor gere uma senha aleatória para a conta inicial `'root'@'localhost'`.

  **mysql_install_db** agora está descontinuado, assim como a opção especial `--bootstrap` que **mysql_install_db** passa para **mysqld**.

* O utilitário **mysql_plugin** está descontinuado. As alternativas incluem carregar `plugins` na inicialização do servidor usando a opção `--plugin-load` ou `--plugin-load-add`, ou em tempo de execução usando a instrução `INSTALL PLUGIN`.

* O utilitário **resolveip** está descontinuado. **nslookup**, **host** ou **dig** podem ser usados em seu lugar.

* O utilitário **resolve_stack_dump** está descontinuado. Os rastreamentos de pilha de compilações oficiais do MySQL são sempre simbolizados, então não há necessidade de usar **resolve_stack_dump**.

* As funções C API `mysql_kill()`, `mysql_list_fields()`, `mysql_list_processes()` e `mysql_refresh()` estão descontinuadas. O mesmo se aplica aos comandos de protocolo cliente/servidor correspondentes `COM_PROCESS_KILL`, `COM_FIELD_LIST`, `COM_PROCESS_INFO` e `COM_REFRESH`. Em vez disso, use `mysql_query()` para executar uma instrução `KILL`, `SHOW COLUMNS`, `SHOW PROCESSLIST` ou `FLUSH`, respectivamente.

* A função C API `mysql_shutdown()` está descontinuada. Em vez disso, use `mysql_query()` para executar uma instrução `SHUTDOWN`.

* A biblioteca de servidor embarcado `libmysqld` está descontinuada a partir do MySQL 5.7.19. Estes também estão descontinuados:

  + As opções **mysql_config** `--libmysqld-libs`, `--embedded-libs` e `--embedded`

  + As opções **CMake** `WITH_EMBEDDED_SERVER`, `WITH_EMBEDDED_SHARED_LIBRARY` e `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`

  + A opção (não documentada) **mysql** `--server-arg`

  + As opções **mysqltest** `--embedded-server`, `--server-arg` e `--server-file`

  + Os programas de teste **mysqltest_embedded** e **mysql_client_test_embedded**

  Como `libmysqld` usa uma API comparável à de `libmysqlclient`, o caminho de migração para longe de `libmysqld` é direto:

  1. Inicie um servidor MySQL autônomo (**mysqld**).

  2. Modifique o código do aplicativo para remover chamadas de API específicas para `libmysqld`.

  3. Modifique o código do aplicativo para conectar-se ao servidor MySQL autônomo.

  4. Modifique os scripts de compilação para usar `libmysqlclient` em vez de `libmysqld`. Por exemplo, se você usar **mysql_config**, invoque-o com a opção `--libs` em vez de `--libmysqld-libs`.

* O utilitário **replace** está descontinuado.
* O suporte para DTrace está descontinuado.
* A função `JSON_MERGE()` está descontinuada a partir do MySQL 5.7.22. Use `JSON_MERGE_PRESERVE()` em seu lugar.

* O suporte para colocar partições de tabela em `InnoDB tablespaces` compartilhados está descontinuado a partir do MySQL 5.7.24. Os `tablespaces` compartilhados incluem o `InnoDB system tablespace` e os `general tablespaces`. Para obter informações sobre como identificar partições em `tablespaces` compartilhados e movê-las para `file-per-table tablespaces`, veja Preparando Sua Instalação para Atualização.

* O suporte para cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` está descontinuado a partir do MySQL 5.7.24.

* A opção **perror** `--ndb` está descontinuada. Use o utilitário **ndb_perror** em seu lugar.

* A variável de sistema `myisam_repair_threads` está descontinuada a partir do MySQL 5.7.38; espere que o suporte para ambos seja removido em uma futura versão do MySQL.

  A partir do MySQL 5.7.38, valores diferentes de 1 (o padrão) para `myisam_repair_threads` produzem um aviso.

### Funcionalidades Removidas no MySQL 5.7

Os seguintes itens estão obsoletos e foram removidos no MySQL 5.7. Onde alternativas são mostradas, os aplicativos devem ser atualizados para usá-las.

Para aplicativos MySQL 5.6 que usam funcionalidades removidas no MySQL 5.7, as instruções podem falhar quando replicadas de uma `source` MySQL 5.6 para uma `replica` MySQL 5.7, ou podem ter efeitos diferentes na `source` e na `replica`. Para evitar tais problemas, os aplicativos que usam funcionalidades removidas no MySQL 5.7 devem ser revisados para evitá-las e usar alternativas quando possível.

* O suporte para senhas que usam o formato de `password hashing` mais antigo pré-4.1 é removido, o que envolve as seguintes alterações. Os aplicativos que usam qualquer recurso não mais suportado devem ser modificados.

  + O plugin de autenticação `mysql_old_password` é removido. As contas que usam este plugin são desabilitadas na inicialização e o servidor escreve uma mensagem de “unknown plugin” no `error log`. Para obter instruções sobre como atualizar contas que usam este plugin, veja Seção 6.4.1.3, “Migrando da Geração de Hash de Senha Pré-4.1 e do Plugin mysql_old_password”.

  + A opção `--secure-auth` para o servidor e programas cliente é o padrão, mas agora é um `no-op`. Está descontinuada; espere que seja removida em uma futura versão do MySQL.

  + A opção `--skip-secure-auth` para o servidor e programas cliente não é mais suportada e usá-la produz um erro.

  + A variável de sistema `secure_auth` permite apenas um valor de 1; um valor de 0 não é mais permitido.

  + Para a variável de sistema `old_passwords`, um valor de 1 (produzir `hashes` pré-4.1) não é mais permitido.

  + A função `OLD_PASSWORD()` é removida.

* No MySQL 5.6.6, o tipo de dados `YEAR(2)` de 2 dígitos foi descontinuado. O suporte para `YEAR(2)` agora é removido. Assim que você atualizar para o MySQL 5.7.5 ou superior, quaisquer colunas `YEAR(2)` de 2 dígitos restantes devem ser convertidas em colunas `YEAR` de 4 dígitos para se tornarem utilizáveis novamente. Para estratégias de conversão, veja Seção 11.2.5, “Limitações do YEAR(2) de 2 Dígitos e Migração para YEAR de 4 Dígitos”). Por exemplo, execute **mysql_upgrade** após a atualização.

* A variável de sistema `innodb_mirrored_log_groups`. O único valor suportado era 1, então não tinha propósito.

* A variável de sistema `storage_engine`. Use `default_storage_engine` em seu lugar.

* A variável de sistema `thread_concurrency`.
* A variável de sistema `timed_mutexes`, que não tinha efeito.

* A cláusula `IGNORE` para `ALTER TABLE`.

* `INSERT DELAYED` não é mais suportado. O servidor reconhece, mas ignora a palavra-chave `DELAYED`, trata a inserção como uma inserção não atrasada e gera um aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`. (“INSERT DELAYED não é mais suportado. A instrução foi convertida para INSERT.”) Da mesma forma, `REPLACE DELAYED` é tratado como um `replace` não atrasado. Você deve esperar que a palavra-chave `DELAYED` seja removida em uma versão futura.

  Além disso, várias opções ou recursos relacionados a `DELAYED` foram removidos:

  + A opção `--delayed-insert` para **mysqldump**.

  + As colunas `COUNT_WRITE_DELAYED`, `SUM_TIMER_WRITE_DELAYED`, `MIN_TIMER_WRITE_DELAYED`, `AVG_TIMER_WRITE_DELAYED` e `MAX_TIMER_WRITE_DELAYED` da tabela `table_lock_waits_summary_by_table` do Performance Schema.

  + **mysqlbinlog** não escreve mais comentários mencionando `INSERT DELAYED`.

* A criação de `symlinks` de `database` no Windows usando arquivos `.sym` foi removida porque é redundante com o suporte nativo a `symlink` disponível usando **mklink**. Quaisquer `symbolic links` de arquivo `.sym` agora são ignorados e devem ser substituídos por `symlinks` criados usando **mklink**. Veja Seção 8.12.3.3, “Usando Symbolic Links para Databases no Windows”.

* As opções não utilizadas `--basedir`, `--datadir` e `--tmpdir` para **mysql_upgrade** foram removidas.

* Anteriormente, as opções de programa podiam ser especificadas por completo ou como qualquer prefixo não ambíguo. Por exemplo, a opção `--compress` podia ser dada a **mysqldump** como `--compr`, mas não como `--comp` porque esta última é ambígua. Prefixos de opção não são mais suportados; apenas opções completas são aceitas. Isso ocorre porque os prefixos podem causar problemas quando novas opções são implementadas para programas e um prefixo que é atualmente não ambíguo pode se tornar ambíguo no futuro. Algumas implicações desta mudança:

  + A opção `--key-buffer` agora deve ser especificada como `--key-buffer-size`.

  + A opção `--skip-grant` agora deve ser especificada como `--skip-grant-tables`.

* A saída de `SHOW ENGINE INNODB MUTEX` é removida. Informações comparáveis podem ser geradas criando `views` nas tabelas do Performance Schema.

* O `InnoDB Tablespace Monitor` e o `InnoDB Table Monitor` são removidos. Para o `Table Monitor`, informações equivalentes podem ser obtidas das tabelas `INFORMATION_SCHEMA` do `InnoDB`.

* As tabelas nomeadas especialmente usadas para habilitar e desabilitar o `InnoDB Monitor` padrão e o `InnoDB Lock Monitor` (`innodb_monitor` e `innodb_lock_monitor`) são removidas e substituídas por duas variáveis de sistema dinâmicas: `innodb_status_output` e `innodb_status_output_locks`. Para informações adicionais, veja Seção 14.18, “Monitors do InnoDB”.

* As variáveis de sistema `innodb_use_sys_malloc` e `innodb_additional_mem_pool_size`, descontinuadas no MySQL 5.6.3, foram removidas.

* Os utilitários **msql2mysql**, **mysql_convert_table_format**, **mysql_find_rows**, **mysql_fix_extensions**, **mysql_setpermission**, **mysql_waitpid**, **mysql_zap**, **mysqlaccess** e **mysqlbug**.

* O utilitário **mysqlhotcopy**. As alternativas incluem **mysqldump** e MySQL Enterprise Backup.

* O `script` **binary-configure.sh**.
* A opção **CMake** `INNODB_PAGE_ATOMIC_REF_COUNT` é removida.

* A opção `innodb_create_intrinsic` é removida.

* A opção `innodb_optimize_point_storage` e os tipos de dados internos relacionados (`DATA_POINT` e `DATA_VAR_POINT`) são removidos.

* A opção `innodb_log_checksum_algorithm` é removida.

* A variável de sistema `myisam_repair_threads` a partir do MySQL 5.7.39.