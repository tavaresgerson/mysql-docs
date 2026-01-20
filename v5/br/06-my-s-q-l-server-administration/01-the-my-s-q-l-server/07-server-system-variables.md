### 5.1.7 Variáveis do Sistema de Servidor

O servidor MySQL mantém muitas variáveis de sistema que afetam seu funcionamento. A maioria das variáveis de sistema pode ser definida na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente durante a execução usando a instrução `SET`, que permite modificar o funcionamento do servidor sem precisar parar e reiniciá-lo. Algumas variáveis são somente de leitura, e seus valores são determinados pelo ambiente do sistema, pela maneira como o MySQL está instalado no sistema ou, possivelmente, pelas opções usadas para compilar o MySQL. A maioria das variáveis de sistema tem um valor padrão, mas há exceções, incluindo variáveis somente de leitura. Você também pode usar os valores das variáveis de sistema em expressões.

Durante a execução, definir o valor de uma variável de sistema global requer o privilégio `SUPER`. Definir o valor de uma variável de sistema de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora existam exceções. Para mais informações, consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”

Existem várias maneiras de ver os nomes e valores das variáveis do sistema:

- Para ver os valores que um servidor usa com base em seus padrões pré-compilados e em quaisquer arquivos de opção que ele lê, use este comando:

  ```sql
  mysqld --verbose --help
  ```

- Para ver os valores que um servidor usa com base apenas em seus padrões compilados, ignorando as configurações em quaisquer arquivos de opção, use este comando:

  ```sql
  mysqld --no-defaults --verbose --help
  ```

- Para ver os valores atuais usados por um servidor em execução, use a instrução `SHOW VARIABLES` ou as tabelas de variáveis do sistema do Schema de Desempenho. Veja Seção 25.12.13, “Tabelas de Variáveis do Sistema do Schema de Desempenho”.

Esta seção fornece uma descrição de cada variável do sistema. Para uma tabela de resumo das variáveis do sistema, consulte Seção 5.1.4, “Referência de variáveis do sistema do servidor”. Para mais informações sobre a manipulação de variáveis do sistema, consulte Seção 5.1.8, “Usando variáveis do sistema”.

Para informações adicionais sobre variáveis do sistema, consulte estas seções:

- Seção 5.1.8, “Usando Variáveis do Sistema”, discute a sintaxe para definir e exibir os valores das variáveis do sistema.

- Seção 5.1.8.2, “Variáveis dinâmicas do sistema”, lista as variáveis que podem ser definidas em tempo de execução.

- Informações sobre as variáveis do sistema de sintonização podem ser encontradas em Seção 5.1.1, “Configurando o Servidor”.

- Seção 14.15, “Opções de inicialização do InnoDB e variáveis do sistema”, lista as variáveis do sistema do InnoDB.

- Seção 21.4.3.9.2, “Variáveis do Sistema de Clúster NDB”, lista as variáveis do sistema que são específicas do NDB Cluster.

- Para obter informações sobre as variáveis do sistema do servidor específicas para replicação, consulte Seção 16.1.6, “Opções e variáveis de registro binário de replicação”.

Nota

Algumas das seguintes descrições de variáveis referem-se a “ativar” ou “desativar” uma variável. Essas variáveis podem ser ativadas com a instrução `SET` definindo-as como `ON` ou `1`, ou desativadas definindo-as como `OFF` ou `0`. Variáveis booleanas podem ser definidas no início como os valores `ON`, `TRUE`, `OFF` e `FALSE` (não case-sensitive), bem como `1` e `0`. Veja Seção 4.2.2.4, “Modificadores de Opção do Programa”.

Algumas variáveis do sistema controlam o tamanho dos buffers ou caches. Para um buffer específico, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, quando você atribui um valor a uma variável que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma variável para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de tampão, comprimentos e tamanhos de pilha são fornecidos em bytes, a menos que especificado de outra forma.

Nota

Algumas descrições de variáveis do sistema incluem um tamanho de bloco, caso em que um valor que não seja um múltiplo inteiro do tamanho de bloco declarado é arredondado para o próximo múltiplo inferior do tamanho de bloco antes de ser armazenado pelo servidor, ou seja, [`FLOOR(valor)`](https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_FLOOR) `* tamanho_de_bloco`.

*Exemplo*: Suponha que o tamanho do bloco para uma variável específica seja dado como 4096, e você defina o valor da variável para 100000 (assumimos que o valor máximo da variável é maior que este número). Como 100000 / 4096 = 24,4140625, o servidor reduz automaticamente o valor para 98304 (24 \* 4096) antes de armazená-lo.

Em alguns casos, o valor máximo declarado para uma variável é o máximo permitido pelo analisador do MySQL, mas não é um múltiplo exato do tamanho do bloco. Nesses casos, o valor máximo efetivo é o próximo múltiplo menor do tamanho do bloco.

*Exemplo*: O valor máximo de uma variável de sistema é mostrado como 4294967295 (232-1), e seu tamanho de bloco é de 1024. 4294967295 / 1024 = 4194303.9990234375, então, se você definir essa variável para seu valor máximo declarado, o valor realmente armazenado será 4194303 \* 1024 = 4294966272.

Algumas variáveis do sistema aceitam valores de nomes de arquivos. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados, se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma variável com valor de arquivo for fornecida como um nome de caminho relativo, ela estará localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será conforme o nome do caminho fornecido.

- `nivel_de_log_de_autenticação`

  <table frame="box" rules="all" summary="Propriedades para authentication_windows_log_level"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-log-level=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_log_level</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4</code></td> </tr></tbody></table>

  Esta variável está disponível apenas se o plugin de autenticação Windows `authentication_windows` estiver habilitado e o código de depuração estiver ativado. Consulte Seção 6.4.1.8, “Autenticação Pluggable Windows”.

  Essa variável define o nível de registro para o plugin de autenticação do Windows. A tabela a seguir mostra os valores permitidos.

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

- `authentication_windows_use_principal_name`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável está disponível apenas se o plugin de autenticação Windows `authentication_windows` estiver habilitado. Consulte Seção 6.4.1.8, “Autenticação Pluggable Windows”.

  Um cliente que se autentica usando a função `InitSecurityContext()` deve fornecer uma string que identifica o serviço ao qual ele se conecta (*`targetName`*). O MySQL usa o nome do principal (UPN) da conta sob a qual o servidor está em execução. O UPN tem a forma `user_id@computer_name` e não precisa ser registrado em nenhum lugar para ser usado. Esse UPN é enviado pelo servidor no início do aperto de mão de autenticação.

  Esta variável controla se o servidor envia o UPN no desafio inicial. Por padrão, a variável está habilitada. Por razões de segurança, ela pode ser desabilitada para evitar enviar o nome da conta do servidor para um cliente como texto claro. Se a variável for desabilitada, o servidor sempre envia um byte `0x00` no primeiro desafio, o cliente não especifica *`targetName`*, e, como resultado, a autenticação NTLM é usada.

  Se o servidor não conseguir obter seu UPN (o que ocorre principalmente em ambientes que não suportam autenticação Kerberos), o UPN não é enviado pelo servidor e a autenticação NTLM é usada.

- `autocommit`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O modo de autocommit. Se definido como 1, todas as alterações em uma tabela entram em vigor imediatamente. Se definido como 0, você deve usar `COMMIT` para aceitar uma transação ou `ROLLBACK` para cancelá-la. Se `autocommit` for 0 e você alterá-lo para 1, o MySQL realiza um `COMMIT` automático de qualquer transação aberta. Outra maneira de iniciar uma transação é usar uma declaração de `START TRANSACTION` ou `BEGIN`. Veja Seção 13.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”.

  Por padrão, as conexões dos clientes começam com `autocommit` definido como 1. Para fazer com que os clientes comecem com um valor padrão de 0, defina o valor global `autocommit` iniciando o servidor com a opção `--autocommit=0`. Para definir a variável usando um arquivo de opção, inclua as seguintes linhas:

  ```sql
  [mysqld]
  autocommit=0
  ```

- `automatic_sp_privileges`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Quando essa variável tiver o valor 1 (padrão), o servidor concederá automaticamente os privilégios de `EXECUTE` e `ALTER ROUTINE` ao criador de uma rotina armazenada, se o usuário não puder executar, alterar ou descartar a rotina. (O privilégio de `ALTER ROUTINE` é necessário para descartar a rotina. O servidor também descarta automaticamente esses privilégios do criador quando a rotina é descartada. Se `automatic_sp_privileges` for 0, o servidor não adicionará ou descartará automaticamente esses privilégios.)

  O criador de uma rotina é a conta usada para executar a instrução `CREATE` para ela. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

  Se você iniciar **mysqld** com `--skip-new`, `automatic_sp_privileges` está definido como `OFF`.

  Veja também Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

- `auto_generate_certs`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável está disponível se o servidor foi compilado usando o OpenSSL (consulte Seção 6.3.4, "Capacidades Dependentes da Biblioteca SSL"). Ela controla se o servidor gera automaticamente os arquivos de chave e certificado SSL no diretório de dados, se eles ainda não existirem.

  Ao inicializar, o servidor gera automaticamente os arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver habilitada, não forem especificadas outras opções SSL além de `--ssl` e os arquivos SSL do lado do servidor estiverem ausentes do diretório de dados. Esses arquivos permitem conexões seguras do cliente usando SSL; veja Seção 6.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”.

  Para obter mais informações sobre a autogeração de arquivos SSL, incluindo nomes e características dos arquivos, consulte Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”

  A variável de sistema `sha256_password_auto_generate_rsa_keys` está relacionada, mas controla a geração automática de arquivos de par de chaves RSA necessários para a troca segura de senhas usando RSA em conexões não criptografadas.

- `avoid_temporal_upgrade`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta variável controla se a alteração implícita de uma tabela (`ALTER TABLE`) atualiza colunas temporais que são encontradas no formato anterior à versão 5.6.4 (colunas `TIME`, `DATETIME`]\(datetime.html) e `TIMESTAMP`]\(datetime.html) sem suporte para precisão de frações de segundo). Para atualizar essas colunas, é necessário uma reconstrução da tabela, o que impede o uso de alterações rápidas que poderiam ser aplicadas à operação a ser realizada.

  Esta variável está desabilitada por padrão. Ao a habilitar, o `ALTER TABLE` não reconstruirá as colunas temporais e, assim, poderá aproveitar possíveis alterações rápidas.

  Essa variável está desatualizada; espere que ela seja removida em uma futura versão do MySQL.

- `back_log`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número de solicitações de conexão pendentes que o MySQL pode ter. Isso entra em jogo quando o principal thread do MySQL recebe muitas solicitações de conexão em um curto período de tempo. Em seguida, leva algum tempo (embora muito pouco) para o thread principal verificar a conexão e iniciar um novo thread. O valor de `back_log` indica quantos pedidos podem ser empilhados durante esse curto período antes de o MySQL parar momentaneamente de responder a novos pedidos. Você precisa aumentar isso apenas se você esperar um grande número de conexões em um curto período de tempo.

  Em outras palavras, esse valor é o tamanho da fila de espera para conexões TCP/IP de entrada. Seu sistema operacional tem seu próprio limite para o tamanho dessa fila. A página manual da chamada de sistema Unix `listen()` deve ter mais detalhes. Verifique a documentação do seu SO para o valor máximo para essa variável. `back_log` não pode ser definido como maior que o limite do seu sistema operacional.

  O valor padrão é baseado na seguinte fórmula, limitada a um limite de 900:

  ```sql
  50 + (max_connections / 5)
  ```

- `basedir`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  O caminho para o diretório de instalação da base de dados MySQL.

- `big_tables`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se ativado, o servidor armazena todas as tabelas temporárias no disco em vez de na memória. Isso previne a maioria dos erros `A tabela tbl_name está cheia` para operações de `SELECT` (select.html) que exigem uma grande tabela temporária, mas também desacelera as consultas para as quais tabelas na memória seriam suficientes.

  O valor padrão para novas conexões é `OFF` (usar tabelas temporárias na memória). Normalmente, nunca é necessário habilitar essa variável, pois o servidor consegue lidar com grandes conjuntos de resultados automaticamente, usando memória para tabelas temporárias pequenas e alternando para tabelas baseadas em disco conforme necessário.

- `bind_address`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O servidor MySQL escuta em uma única porta de rede para conexões TCP/IP. Essa porta está vinculada a um único endereço, mas é possível que um endereço seja mapeado para múltiplas interfaces de rede. Para especificar um endereço, defina `bind_address=addr` no início do servidor, onde *`addr`* é um endereço IPv4 ou IPv6 ou um nome de host. Se *`addr`* for um nome de host, o servidor resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o servidor usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

  O servidor trata diferentes tipos de endereços da seguinte forma:

  - Se o endereço for `*`, o servidor aceitará conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões IPv4 e IPv6 em todas as interfaces do servidor. Este valor é o padrão.

  - Se o endereço for `0.0.0.0`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor.

  - Se o endereço for `::`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do host do servidor.

  - Se o endereço for um endereço mapeado para IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

  - Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

  Se a vinculação ao endereço falhar, o servidor produz um erro e não inicia.

  Se você pretende vincular o servidor a um endereço específico, certifique-se de que a tabela de sistema `mysql.user` contenha uma conta com privilégios administrativos que você possa usar para se conectar a esse endereço. Caso contrário, você não poderá desligar o servidor. Por exemplo, se você vincular o servidor a `*`, você pode se conectar a ele usando todas as contas existentes. Mas se você vincular o servidor a `::1`, ele aceita conexões apenas nesse endereço. Nesse caso, primeiro certifique-se de que a conta `'root'@'::1'` esteja presente na tabela `mysql.user` para que você ainda possa se conectar ao servidor para o desligá-lo.

  Essa variável não tem efeito no servidor integrado (`libmysqld`) e não é visível dentro do servidor integrado.

- `block_encryption_mode`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável controla o modo de criptografia de bloco para algoritmos baseados em blocos, como o AES. Ela afeta a criptografia para `AES_ENCRYPT()` e `AES_DECRYPT()`.

  `block_encryption_mode` aceita um valor no formato `aes-keylen-mode`, onde *`keylen`* é o comprimento da chave em bits e *`mode`* é o modo de criptografia. O valor não é case-sensitive. Os valores permitidos de *`keylen`* são 128, 192 e

  256. Os modos de criptografia permitidos dependem de se o MySQL foi compilado com o OpenSSL ou com o yaSSL:

  - Para o OpenSSL, os valores de *`mode`* permitidos são: `ECB`, `CBC`, `CFB1`, `CFB8`, `CFB128`, `OFB`

  - Para o yaSSL, os valores permitidos para o `mode` são: `ECB`, `CBC`

  Por exemplo, essa declaração faz com que as funções de criptografia AES usem um comprimento de chave de 256 bits e o modo CBC:

  ```sql
  SET block_encryption_mode = 'aes-256-cbc';
  ```

  Um erro ocorre para tentativas de definir `block_encryption_mode` para um valor que contenha um comprimento de chave não suportado ou um modo que a biblioteca SSL não suporte.

- `bulk_insert_buffer_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  `MyISAM` usa um cache especial semelhante a uma árvore para tornar as inserções em massa mais rápidas para `INSERT ... SELECT` (insert-select.html), `INSERT ... VALUES (...), (...), ...` e `LOAD DATA` (load-data.html) ao adicionar dados a tabelas não vazias. Esta variável limita o tamanho da árvore de cache em bytes por thread. Definindo-a como 0, essa otimização é desativada. O valor padrão é de 8 MB.

- `character_set_client`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de caracteres para as declarações que chegam do cliente. O valor da sessão desta variável é definido usando o conjunto de caracteres solicitado pelo cliente quando este se conecta ao servidor. (Muitos clientes suportam a opção `--default-character-set` para permitir que este conjunto de caracteres seja especificado explicitamente. Veja também Seção 10.4, “Conjunto de caracteres de conexão e colagens”.) O valor global da variável é usado para definir o valor da sessão em casos em que o valor solicitado pelo cliente é desconhecido ou não está disponível, ou o servidor está configurado para ignorar solicitações do cliente:

  - O cliente solicita um conjunto de caracteres desconhecido pelo servidor. Por exemplo, um cliente habilitado para japonês solicita `sjis` ao se conectar a um servidor não configurado com suporte para `sjis`.

  - O cliente é de uma versão do MySQL mais antiga que o MySQL 4.1, e, portanto, não solicita um conjunto de caracteres.

  - O **mysqld** foi iniciado com a opção `--skip-character-set-client-handshake` (server-options.html#option_mysqld_character-set-client-handshake), que faz com que ele ignore a configuração do conjunto de caracteres do cliente. Isso reproduz o comportamento do MySQL 4.0 e é útil se você quiser atualizar o servidor sem atualizar todos os clientes.

  Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentar usá-los como o valor de `character_set_client` produz um erro. Veja Conjunto de caracteres do cliente impermissível.

- `character_set_connection`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de caracteres usado para literais especificados sem um introduzir de conjunto de caracteres e para conversão de número para string. Para informações sobre introdutores, consulte Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

- `character_set_database`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de caracteres usado pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, a variável terá o mesmo valor que `character_set_server`.

  As variáveis de sistema `character_set_database` (server-system-variables.html#sysvar_character_set_database) e `collation_database` (server-system-variables.html#sysvar_collation_database) são desaconselhadas no MySQL 5.7; espera-se que sejam removidas em uma versão futura do MySQL.

  Atribuir um valor às variáveis de sistema `character_set_database` (server-system-variables.html#sysvar_character_set_database) e `collation_database` (server-system-variables.html#sysvar_collation_database) é desaconselhável no MySQL 5.7 e as atribuições produzem um aviso. Você deve esperar que as variáveis de sessão se tornem somente de leitura em uma futura versão do MySQL e as atribuições produzam um erro, enquanto ainda é possível acessar as variáveis de sessão para determinar o conjunto de caracteres e a collation da base de dados padrão.

- `character_set_filesystem`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de caracteres do sistema de arquivos. Esta variável é usada para interpretar literais de string que se referem a nomes de arquivos, como nas instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e na função `LOAD_FILE()`. Esses nomes de arquivos são convertidos de `character_set_client` para [`character_set_filesystem`]\(server-system-variables.html#sysvar_character_set_filesystem] antes da tentativa de abertura do arquivo. O valor padrão é `binary`, o que significa que nenhuma conversão ocorre. Para sistemas em que nomes de arquivos multibyte são permitidos, um valor diferente pode ser mais apropriado. Por exemplo, se o sistema representar nomes de arquivos usando UTF-8, defina `character_set_filesystem` para `'utf8mb4'`.

- `character_set_results`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de caracteres usado para retornar os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de colunas e mensagens de erro.

- `character_set_server`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de caracteres padrão dos servidores. Consulte Seção 10.15, “Configuração de Conjunto de Caracteres”. Se você definir essa variável, também deve definir `collation_server` para especificar a collation para o conjunto de caracteres.

- `character_set_system`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de caracteres usado pelo servidor para armazenar identificadores. O valor é sempre `utf8`.

- `character_sets_dir`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `check_proxy_users`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. Destes, alguns podem solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos: `mysql_native_password`, `sha256_password`.

  Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza o mapeamento de usuários proxy para quaisquer plugins de autenticação que façam essa solicitação. No entanto, também pode ser necessário habilitar variáveis de sistema específicas do plugin para aproveitar o suporte ao mapeamento de usuários proxy do servidor:

  - Para o plugin `mysql_native_password`, habilite `mysql_native_password_proxy_users`.

  - Para o plugin `sha256_password`, habilite `sha256_password_proxy_users`.

  Para obter informações sobre o encaminhamento de usuários, consulte Seção 6.2.14, “Usuários de Proxy”.

- `collation_connection`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  A combinação do conjunto de caracteres de conexão é importante para comparações de strings literais. Para comparações de strings com valores de coluna, `collation_connection` não importa, porque as colunas têm sua própria collation, que tem precedência de collation mais alta (veja Seção 10.8.4, “Coercibilidade de collation em expressões”).

- `collation_database`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  A collation usada pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, a variável terá o mesmo valor que `collation_server`.

  As variáveis de sistema `character_set_database` (server-system-variables.html#sysvar_character_set_database) e `collation_database` (server-system-variables.html#sysvar_collation_database) são desaconselhadas no MySQL 5.7; espera-se que sejam removidas em uma versão futura do MySQL.

  Atribuir um valor às variáveis de sistema `character_set_database` (server-system-variables.html#sysvar_character_set_database) e `collation_database` (server-system-variables.html#sysvar_collation_database) é desaconselhável no MySQL 5.7 e as atribuições produzem um aviso. Espere que as variáveis de sessão se tornem somente de leitura em uma versão futura do MySQL e as atribuições produzam um erro, enquanto ainda é possível acessar as variáveis de sessão para determinar o conjunto de caracteres e a collation do banco de dados padrão.

- `collation_server`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  A collation padrão do servidor. Consulte Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `completion_type`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O tipo de conclusão da transação. Esta variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O `completion_type` afeta as transações que começam com `START TRANSACTION` ou `BEGIN` e terminam com `COMMIT` ou `ROLLBACK`. Ele não se aplica a compromissos implícitos resultantes da execução das instruções listadas em Seção 13.3.3, “Instruções que Causam um Compromisso Implícito”. Ele também não se aplica para `XA COMMIT`, `XA ROLLBACK` ou quando `autocommit=1`.

- `concurrent_insert`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se for `AUTO` (o padrão), o MySQL permite que as instruções `INSERT` e `SELECT` sejam executadas simultaneamente para tabelas `MyISAM` que não têm blocos livres no meio do arquivo de dados.

  Essa variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se você iniciar **mysqld** com `--skip-new`, `concurrent_insert` é definido como `NEVER`.

  Veja também Seção 8.11.3, “Inserções Concorrentes”.

- `connect_timeout`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número de segundos que o servidor **mysqld** espera por um pacote de conexão antes de responder com `Mau handshake`. O valor padrão é de 10 segundos.

  Aumentar o valor de `connect_timeout` pode ajudar se os clientes frequentemente encontrarem erros na forma `Conexão perdida com o servidor MySQL em 'XXX', erro do sistema: errno`.

- `core_file`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se deve escrever um arquivo de núcleo caso o servidor saia inesperadamente. Essa variável é definida pela opção `--core-file`.

- `datadir`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O caminho para o diretório de dados do servidor MySQL. Os caminhos relativos são resolvidos em relação ao diretório atual. Se você espera que o servidor seja iniciado automaticamente (ou seja, em contextos para os quais você não pode assumir qual é o diretório atual), é melhor especificar o valor `datadir` como um caminho absoluto.

- `data_format`

  Esta variável não é usada. Ela está desatualizada e será removida no MySQL 8.0.

- `datetime_format`

  Esta variável não é usada. Ela está desatualizada e será removida no MySQL 8.0.

- `debug`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável indica as configurações atuais de depuração. Ela está disponível apenas para servidores construídos com suporte de depuração. O valor inicial vem do valor das instâncias da opção `--debug` fornecida durante o início do servidor. Os valores globais e de sessão podem ser definidos em tempo de execução.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

  Atribuir um valor que começa com `+` ou `-` faz com que o valor seja adicionado ou subtraído do valor atual:

  ```sql
  mysql> SET debug = 'T';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+

  mysql> SET debug = '+P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | P:T     |
  +---------+

  mysql> SET debug = '-P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+
  ```

  Para mais informações, consulte Seção 5.8.3, “O pacote DBUG”.

- `debug_sync`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável é a interface de usuário para a ferramenta Debug Sync. O uso do Debug Sync exige que o MySQL seja configurado com a opção **CMake** `-DWITH_DEBUG=ON` (consulte Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”); caso contrário, essa variável do sistema não estará disponível.

  O valor da variável global é apenas de leitura e indica se a facilidade está habilitada. Por padrão, o Debug Sync está desabilitado e o valor de `debug_sync` é `OFF`. Se o servidor for iniciado com `--debug-sync-timeout=N`, onde *`N`* é um valor de timeout maior que 0, o Debug Sync é habilitado e o valor de `debug_sync` é `ON - sinal atual`, seguido do nome do sinal. Além disso, *`N`* se torna o timeout padrão para pontos de sincronização individuais.

  O valor da sessão pode ser lido por qualquer usuário e tem o mesmo valor que a variável global. O valor da sessão pode ser definido para controlar os pontos de sincronização.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

  Para uma descrição da funcionalidade Debug Sync e de como usar os pontos de sincronização, consulte a Documentação do MySQL Server Doxygen.

- `default_authentication_plugin`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O plugin de autenticação padrão. Esses valores são permitidos:

  - `mysql_native_password`: Use senhas nativas do MySQL; consulte Seção 6.4.1.1, “Autenticação Pluggable Native”.

  - `sha256_password`: Use senhas SHA-256; consulte Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

  Nota

  Se essa variável tiver um valor diferente de `mysql_native_password`, os clientes mais antigos do MySQL 5.5.7 não poderão se conectar, pois, entre os plugins de autenticação padrão permitidos, eles entendem apenas o protocolo de autenticação `mysql_native_password`.

  O valor de `default_authentication_plugin` afeta esses aspectos do funcionamento do servidor:

  - Ele determina qual plugin de autenticação o servidor atribui às novas contas criadas por declarações de `CREATE USER` (create-user.html) e `GRANT` (grant.html) que não especificam explicitamente um plugin de autenticação.

  - A variável de sistema `old_passwords` afeta o hashing de senhas para contas que utilizam o plugin de autenticação `mysql_native_password` ou `sha256_password`. Se o plugin de autenticação padrão for um desses plugins, o servidor define `old_passwords` no momento do início com o valor exigido pelo método de hashing de senha do plugin.

  - Para uma conta criada com uma das seguintes declarações, o servidor associa a conta ao plugin de autenticação padrão e atribui à conta a senha fornecida, criptografada conforme exigido por esse plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY 'cleartext password';
    GRANT ...  IDENTIFIED BY 'cleartext password';
    ```

  - Para uma conta criada com uma das seguintes declarações, o servidor associa a conta ao plugin de autenticação padrão e atribui o hash da senha fornecido à conta, se o hash da senha tiver o formato exigido pelo plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY PASSWORD 'encrypted password';
    GRANT ...  IDENTIFIED BY PASSWORD 'encrypted password';
    ```

    Se o hash da senha não estiver no formato exigido pelo plugin de autenticação padrão, a declaração falhará.

- `default_password_lifetime`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável define a política global de expiração automática da senha. O valor padrão de `default_password_lifetime` é 0, o que desativa a expiração automática da senha. Se o valor de `default_password_lifetime` for um inteiro positivo *`N`*, ele indica o tempo de vida permitido da senha; as senhas devem ser alteradas a cada *`N`* dias.

  A política global de expiração de senhas pode ser alterada conforme desejado para contas individuais usando as opções de expiração de senha da instrução `ALTER USER`. Veja Seção 6.2.11, “Gestão de Senhas”.

  Nota

  Antes do MySQL 5.7.11, o valor padrão da variável `default_password_lifetime` é 360 (as senhas devem ser alteradas aproximadamente uma vez por ano). Para essas versões, esteja ciente de que, se você não fizer alterações na variável `default_password_lifetime` ou nas contas individuais dos usuários, todas as senhas dos usuários expiram após 360 dias e todas as contas dos usuários começam a funcionar em modo restrito quando isso acontece. Os clientes (que são efetivamente usuários) que se conectam ao servidor recebem então um erro indicando que a senha deve ser alterada: `ERROR 1820 (HY000): Você deve redefinir sua senha usando o comando ALTER USER antes de executar este comando.`

  No entanto, isso pode ser facilmente ignorado por clientes que se conectam automaticamente ao servidor, como as conexões feitas a partir de scripts. Para evitar que esses clientes parem de funcionar de repente devido à expiração da senha, certifique-se de alterar as configurações de expiração da senha para esses clientes, da seguinte forma:

  ```sql
  ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER;
  ```

  Alternativamente, defina a variável `default_password_lifetime` para `0`, desativando assim a expiração automática da senha para todos os usuários.

- `default_storage_engine`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O motor de armazenamento padrão para tabelas. Veja Capítulo 15, *Motores de Armazenamento Alternativos*. Esta variável define o motor de armazenamento para tabelas permanentes apenas. Para definir o motor de armazenamento para tabelas `TEMPORARY`, defina a variável de sistema `default_tmp_storage_engine`.

  Para ver quais os motores de armazenamento estão disponíveis e habilitados, use a instrução `SHOW ENGINES` ou consulte a tabela `INFORMATION_SCHEMA [`ENGINES\`]\(information-schema-engines-table.html).

  Se você desabilitar o motor de armazenamento padrão ao iniciar o servidor, você deve definir o motor padrão tanto para tabelas permanentes quanto para `TEMPORARY` para um motor diferente, caso contrário, o servidor não poderá ser iniciado.

- `default_tmp_storage_engine`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O mecanismo de armazenamento padrão para tabelas `TEMPORARY` (criadas com `CREATE TEMPORARY TABLE`). Para definir o mecanismo de armazenamento para tabelas permanentes, defina a variável de sistema `default_storage_engine`. Veja também a discussão sobre essa variável em relação aos possíveis valores.

  Se você desabilitar o motor de armazenamento padrão ao iniciar o servidor, você deve definir o motor padrão tanto para tabelas permanentes quanto para `TEMPORARY` para um motor diferente, caso contrário, o servidor não poderá ser iniciado.

- `default_week_format`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O valor padrão a ser usado para a função `WEEK()`. Consulte Seção 12.7, "Funções de data e hora".

- `delay_key_write`

  <table frame="box" rules="all" summary="Propriedades para autocommit"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>autocommit</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável especifica como usar escritas de chave com atraso. Ela se aplica apenas a tabelas `MyISAM`. A escrita de chave com atraso faz com que os buffers de chave não sejam descarregados entre as escritas. Veja também Seção 15.2.1, “Opções de inicialização do MyISAM”.

  Essa variável pode ter um dos seguintes valores para afetar o tratamento da opção da tabela `DELAY_KEY_WRITE`, que pode ser usada em instruções de `CREATE TABLE` (create-table.html).

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Nota

  Se você definir essa variável para `ALL`, não deve usar tabelas `MyISAM` dentro de outro programa (como outro servidor MySQL ou **myisamchk**) quando as tabelas estiverem em uso. Isso pode causar corrupção de índices.

  Se a opção `DELAY_KEY_WRITE` estiver habilitada para uma tabela, o buffer de chaves não é esvaziado para a tabela em todas as atualizações de índice, mas apenas quando a tabela é fechada. Isso acelera muito os escritos nas chaves, mas se você usar essa funcionalidade, deve adicionar a verificação automática de todas as tabelas `MyISAM` ao iniciar o servidor com a variável de sistema `[myisam_recover_options]` definida (por exemplo, `myisam_recover_options='BACKUP,FORCE'`). Veja Seção 5.1.7, “Variáveis de Sistema do Servidor” e Seção 15.2.1, “Opções de Inicialização do MyISAM”.

  Se você iniciar **mysqld** com `--skip-new`, `delay_key_write` está definido como `OFF`.

  Aviso

  Se você ativar o bloqueio externo com `--external-locking` (server-options.html#option_mysqld_external-locking), não haverá proteção contra corrupção de índices para tabelas que utilizam escritas de chave atrasadas.

- `limite_de_inserção_atrasada`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `delayed_insert_timeout`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `tamanho_fila_atrasada`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `dispositivos de armazenamento desativados`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável indica quais motores de armazenamento não podem ser usados para criar tabelas ou espaços de tabelas. Por exemplo, para impedir que novas tabelas `MyISAM` ou `FEDERATED` sejam criadas, inicie o servidor com essas linhas no arquivo de opção do servidor:

  ```sql
  [mysqld]
  disabled_storage_engines="MyISAM,FEDERATED"
  ```

  Por padrão, `disabled_storage_engines` está vazio (sem motores desabilitados), mas pode ser configurado como uma lista de um ou mais motores separados por vírgula (não case-sensitive). Qualquer motor mencionado no valor não pode ser usado para criar tabelas ou espaços de tabela com `CREATE TABLE` ou `CREATE TABLESPACE`, e não pode ser usado com `ALTER TABLE ... ENGINE` ou `ALTER TABLESPACE ... ENGINE` para alterar o motor de armazenamento de tabelas ou espaços de tabela existentes. Tentativas de fazer isso resultam em um erro `ER_DISABLED_STORAGE_ENGINE`.

  `disabled_storage_engines` não restringe outras instruções DDL para tabelas existentes, como `CREATE INDEX`, `TRUNCATE TABLE`, `ANALYZE TABLE`, `DROP TABLE` ou `DROP TABLESPACE`. Isso permite uma transição suave para que tabelas ou espaços de tabelas existentes que utilizam um motor desativado possam ser migradas para um motor permitido por meio de ações como `ALTER TABLE ... ENGINE permitted_engine`.

  É permitido definir a variável de sistema `default_storage_engine` ou `default_tmp_storage_engine` para um motor de armazenamento desativado. Isso pode fazer com que as aplicações se comportem de forma errática ou falhem, embora isso possa ser uma técnica útil em um ambiente de desenvolvimento para identificar aplicações que usam motores desativados, para que possam ser modificadas.

  `disabled_storage_engines` está desativado e não tem efeito se o servidor for iniciado com qualquer uma dessas opções: `--bootstrap`, `--initialize`, `--initialize-insecure`, `--skip-grant-tables`.

  Nota

  Definir `disabled_storage_engines` pode causar um problema com **mysql_upgrade**. Para obter detalhes, consulte Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

- `desconectar_na_expiração_da_senha`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável controla como o servidor lida com clientes com senhas expiradas:

  - Se o cliente indicar que pode lidar com senhas expiradas, o valor de `disconnect_on_expired_password` é irrelevante. O servidor permite que o cliente se conecte, mas coloca-o no modo sandbox.

  - Se o cliente não indicar que pode lidar com senhas expiradas, o servidor trata o cliente de acordo com o valor de `disconnect_on_expired_password`:

    - Se `disconnect_on_expired_password` estiver habilitado, o servidor desconecta o cliente.

    - Se `disconnect_on_expired_password` estiver desativado, o servidor permite que o cliente se conecte, mas coloca-o no modo sandbox.

  Para obter mais informações sobre a interação entre as configurações do cliente e do servidor relacionadas ao gerenciamento de senhas expiradas, consulte Seção 6.2.12, “Gerenciamento de senhas expiradas pelo servidor”.

- `div_precision_increment`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável indica o número de dígitos pelo qual a escala do resultado das operações de divisão realizadas com o operador `/` deve ser aumentada. O valor padrão é 4. Os valores mínimo e máximo são, respectivamente, 0 e 30. O exemplo a seguir ilustra o efeito de aumentar o valor padrão.

  ```sql
  mysql> SELECT 1/7;
  +--------+
  | 1/7    |
  +--------+
  | 0.1429 |
  +--------+
  mysql> SET div_precision_increment = 12;
  mysql> SELECT 1/7;
  +----------------+
  | 1/7            |
  +----------------+
  | 0.142857142857 |
  +----------------+
  ```

- `end_markers_in_json`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se a saída do otimizador JSON deve adicionar marcadores de fim. Consulte Seção 8.15.9, “A variável de sistema end_markers_in_json”.

- `eq_range_index_dive_limit`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável indica o número de intervalos de igualdade em uma condição de comparação de igualdade quando o otimizador deve mudar de usar mergulhos de índice para estatísticas de índice na estimativa do número de linhas qualificadoras. Ela se aplica à avaliação de expressões que têm uma das seguintes formas equivalentes, onde o otimizador usa um índice não único para procurar valores de *`col_name`*:

  ```sql
  col_name IN(val1, ..., valN)
  col_name = val1 OR ... OR col_name = valN
  ```

  Em ambos os casos, a expressão contém faixas de igualdade *`N`*. O otimizador pode fazer estimativas de linha usando mergulhos de índice ou estatísticas de índice. Se `eq_range_index_dive_limit` for maior que 0, o otimizador usa estatísticas de índice existentes em vez de mergulhos de índice se houver [`eq_range_index_dive_limit`]\(server-system-variables.html#sysvar_eq_range_index_dive_limit] ou mais faixas de igualdade. Assim, para permitir o uso de mergulhos de índice para até *`N`* faixas de igualdade, defina `eq_range_index_dive_limit` para *`N`* + 1. Para desabilitar o uso de estatísticas de índice e sempre usar mergulhos de índice, independentemente de *`N`*, defina `eq_range_index_dive_limit` para 0.

  Para mais informações, consulte Otimização da faixa de igualdade de comparações de muitos valores.

  Para atualizar as estatísticas do índice da tabela para as melhores estimativas, use `ANALYZE TABLE`.

- `error_count`

  O número de erros que resultaram da última declaração que gerou mensagens. Essa variável é apenas de leitura. Consulte Seção 13.7.5.17, “Declaração SHOW ERRORS”.

- `event_scheduler`

  <table frame="box" rules="all" summary="Propriedades para automatic_sp_privileges"><tbody><tr><th>Formato de linha de comando</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável habilita ou desabilita, e inicia ou para o Cronômetro de Eventos. Os valores de status possíveis são `ON`, `OFF` e `DISABLED`. Desativar o Cronômetro de Eventos não é o mesmo que desabilitar o Cronômetro de Eventos, o que requer definir o status para `DISABLED`. Essa variável e seus efeitos na operação do Cronômetro de Eventos são discutidos em mais detalhes em Seção 23.4.2, “Configuração do Cronômetro de Eventos”

- `explicit_defaults_for_timestamp`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável de sistema determina se o servidor habilita certos comportamentos não padrão para valores padrão e o tratamento de valores `NULL` nas colunas de `TIMESTAMP`. Por padrão, \`explicit_defaults_for_timestamp está desativado, o que habilita os comportamentos não padrão.

  Se `explicit_defaults_for_timestamp` estiver desativado, o servidor habilita os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

  - As colunas ``TIMESTAMP` que não são explicitamente declaradas com o atributo `NULL`são declaradas automaticamente com o atributo`NOT NULL`. Atribuir um valor de `NULL\` a uma coluna é permitido e define a coluna como o timestamp atual.

  - A primeira coluna `TIMESTAMP` em uma tabela, se não for declarada explicitamente com o atributo `NULL` ou um atributo `DEFAULT` ou `ON UPDATE` explícito, é declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`.

  - As colunas ``TIMESTAMP` que seguem a primeira, se não forem explicitamente declaradas com o atributo `NULL`ou um atributo`DEFAULT`explícito, são declaradas automaticamente como`DEFAULT '0000-00-00 00:00:00'`(o timestamp "zero"). Para as linhas inseridas que não especificam um valor explícito para uma dessas colunas, a coluna é atribuída`'0000-00-00 00:00:00'\` e nenhum aviso ocorre.

    Dependendo se o modo SQL rigoroso ou o modo SQL `NO_ZERO_DATE` está habilitado, um valor padrão de `'0000-00-00 00:00:00'` pode ser inválido. Esteja ciente de que o modo SQL `TRADITIONAL` inclui o modo rigoroso e o modo `NO_ZERO_DATE`. Veja Seção 5.1.10, “Modos SQL do Servidor”.

  Os comportamentos não padrão descritos acima estão sendo desaconselhados; espere-os serem removidos em uma futura versão do MySQL.

  Se `explicit_defaults_for_timestamp` estiver habilitado, o servidor desabilita os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

  - Não é possível atribuir um valor de `NULL` a uma coluna de ``TIMESTAMP` para defini-la como o timestamp atual. Para atribuir o timestamp atual, defina a coluna como ``CURRENT_TIMESTAMP` ou um sinônimo como `[`NOW()\`]\(date-and-time-functions.html#function_now).

  - As colunas ``TIMESTAMP` que não são explicitamente declaradas com o atributo `NOT NULL`são automaticamente declaradas com o atributo`NULL`e permitem valores`NULL`. Ao atribuir um valor `NULL`a uma coluna desse tipo, ela é definida como`NULL\`, e não como o timestamp atual.

  - As colunas ``TIMESTAMP` declaradas com o atributo `NOT NULL`não permitem valores`NULL`. Para inserções que especificam `NULL`para uma coluna desse tipo, o resultado é um erro para uma inserção de uma única linha se o modo SQL rigoroso estiver ativado, ou`'0000-00-00 00:00:00'`é inserido para inserções de várias linhas com o modo SQL rigoroso desativado. Em nenhum caso, atribuir um valor`NULL\` à coluna o configura para o timestamp atual.

  - As colunas `TIMESTAMP` explicitamente declaradas com o atributo `NOT NULL` e sem um atributo `DEFAULT` explícito são tratadas como não tendo um valor padrão. Para as linhas inseridas que não especificam um valor explícito para essa coluna, o resultado depende do modo SQL. Se o modo SQL rigoroso estiver habilitado, um erro ocorre. Se o modo SQL rigoroso não estiver habilitado, a coluna é declarada com o valor padrão implícito de `'0000-00-00 00:00:00'` e uma mensagem de aviso é exibida. Isso é semelhante ao modo como o MySQL trata outros tipos temporais, como `DATETIME`.

  - Não há uma coluna `TIMESTAMP` declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP`. Esses atributos devem ser especificados explicitamente.

  - A primeira coluna `TIMESTAMP` em uma tabela não é tratada de maneira diferente das colunas `TIMESTAMP` que seguem a primeira.

  Se `explicit_defaults_for_timestamp` for desativado durante a inicialização do servidor, este aviso aparecerá no log de erro:

  ```sql
  [Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
  Please use --explicit_defaults_for_timestamp server option (see
  documentation for more details).
  ```

  Como indicado pelo aviso, para desabilitar os comportamentos não padrão obsoletos, habilite a variável de sistema `explicit_defaults_for_timestamp` durante a inicialização do servidor.

  Nota

  `explicit_defaults_for_timestamp` é ele mesmo desatualizado, pois seu único propósito é permitir o controle sobre comportamentos do `TIMESTAMP` (datetime.html) que estão sendo removidos em uma futura versão do MySQL. Quando a remoção desses comportamentos ocorrer, `explicit_defaults_for_timestamp` não terá mais nenhum propósito, e você pode esperar que ele também seja removido.

  Para obter informações adicionais, consulte Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

- `external_user`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nome de usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com autenticação nativa (incorporada) do MySQL ou se o plugin não definir o valor, essa variável é `NULL`. Veja Seção 6.2.14, “Usuários Proxy”.

- `flush`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se `ON`, o servidor esvazia (sincroniza) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL escreve todas as alterações no disco apenas após cada instrução SQL e permite que o sistema operacional gere a sincronização com o disco. Veja Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”. Esta variável é definida como `ON` se você iniciar o **mysqld** com a opção `--flush`.

  Nota

  Se o `flush` estiver habilitado, o valor de `flush_time` não importa e alterações no `flush_time` não afetam o comportamento do flush.

- `flush_time`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se este valor for diferente de zero, todas as tabelas serão fechadas a cada `[`flush_time\`]\(server-system-variables.html#sysvar_flush_time) segundos para liberar recursos e sincronizar os dados não descarregados no disco. Esta opção é melhor usada apenas em sistemas com recursos mínimos.

  Nota

  Se o `flush` estiver habilitado, o valor de `flush_time` não importa e alterações no `flush_time` não afetam o comportamento do flush.

- `foreign_key_checks`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se definido para 1 (o padrão), as restrições de chave estrangeira são verificadas. Se definido para 0, as restrições de chave estrangeira são ignoradas, com algumas exceções. Ao recriar uma tabela que foi excluída, um erro é retornado se a definição da tabela não atender às restrições de chave estrangeira que a referenciam. Da mesma forma, uma operação de `ALTER TABLE` retorna um erro se uma definição de chave estrangeira for formada incorretamente. Para mais informações, consulte Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

  Definir essa variável tem o mesmo efeito nas tabelas de `NDB` quanto nas tabelas de `InnoDB`. Normalmente, você deixa essa configuração habilitada durante o funcionamento normal, para impor a integridade referencial. Desabilitar a verificação de chaves estrangeiras pode ser útil para recarregar as tabelas de `InnoDB` em uma ordem diferente da exigida por suas relações pai/filho. Veja Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

  Definir `foreign_key_checks` para 0 também afeta as declarações de definição de dados: `DROP SCHEMA` exclui um esquema, mesmo que ele contenha tabelas que têm chaves estrangeiras referenciadas por tabelas fora do esquema, e `DROP TABLE` exclui tabelas que têm chaves estrangeiras referenciadas por outras tabelas.

  Nota

  Definir `foreign_key_checks` para 1 não aciona uma varredura dos dados da tabela existente. Portanto, as linhas adicionadas à tabela enquanto `foreign_key_checks=0` não são verificadas quanto à consistência.

  Não é permitido excluir um índice exigido por uma restrição de chave estrangeira, mesmo com `foreign_key_checks=0`. A restrição de chave estrangeira deve ser removida antes de excluir o índice (Bug #70260).

- `ft_boolean_syntax`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  A lista de operadores suportados por pesquisas de texto completo booleanas realizadas usando `IN BOOLEAN MODE`. Veja Seção 12.9.2, “Pesquisas de Texto Completo Booleanas”.

  O valor padrão da variável é `'+ -><()~*:""&|'`. As regras para alterar o valor são as seguintes:

  - A função do operador é determinada pela posição dentro da string.

  - O valor de substituição deve ser de 14 caracteres.

  - Cada caractere deve ser um caractere não alfanumérico ASCII.

  - O primeiro ou o segundo caractere deve ser um espaço.

  - Não são permitidas duplicações, exceto nas frases que citam operadores nas posições 11 e 12. Esses dois caracteres não precisam ser iguais, mas são os únicos que podem ser.

  - As posições 10, 13 e 14 (que, por padrão, estão definidas como `:`, `&` e `|`) são reservadas para extensões futuras.

- `ft_max_word_len`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O comprimento máximo da palavra a ser incluída em um índice `FULLTEXT` de `MyISAM`.

  Nota

  Os índices `FULLTEXT` em tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

- `ft_min_word_len`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O comprimento mínimo da palavra a ser incluída em um índice `FULLTEXT` de `MyISAM`.

  Nota

  Os índices `FULLTEXT` em tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

- `ft_query_expansion_limit`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número de partidas principais a serem usadas para pesquisas de texto completo realizadas com `WITH QUERY EXPANSION`.

- `ft_stopword_file`

  <table frame="box" rules="all" summary="Propriedades para auto_generate_certs"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O arquivo a partir do qual ler a lista de palavras-chave para pesquisas de texto completo em tabelas `MyISAM`. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Todas as palavras do arquivo são usadas; os comentários *não* são considerados. Por padrão, uma lista integrada de palavras-chave é usada (conforme definido no arquivo `storage/myisam/ft_static.c`). Definir essa variável como uma string vazia (`''`) desabilita o filtro de palavras-chave. Veja também Seção 12.9.4, “Palavras-chave de Texto Completo”.

  Nota

  Os índices `FULLTEXT` em tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável ou dos conteúdos do arquivo de palavras-chave. Use `REPAIR TABLE tbl_name QUICK`.

- `general_log`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o log de consulta geral está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o log ou 1 (ou `ON`) para habilitar o log. O destino para a saída do log é controlado pela variável de sistema `log_output`; se esse valor for `NONE`, nenhuma entrada de log é escrita, mesmo que o log esteja habilitado.

- `general_log_file`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O nome do arquivo de log de consulta geral. O valor padrão é `host_name.log`, mas o valor inicial pode ser alterado com a opção `--general_log_file`.

- `group_concat_max_len`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O comprimento máximo permitido do resultado em bytes para a função `GROUP_CONCAT()`. O padrão é 1024.

- `have_compress`

  `SIM` se a biblioteca de compressão `zlib` estiver disponível para o servidor, `NÃO` se não estiver. Caso contrário, as funções `[COMPRESSAR()](https://pt.docs.aws.amazon.com/encryption-functions/latest/userguide/encryption-functions.html#function_compress) e `DESCOMPRIMIR()]\(<https://pt.docs.aws.amazon.com/encryption-functions/latest/userguide/encryption-functions.html#function_uncompress)`> não podem ser usadas.

- `have_crypt`

  `SIM` se a chamada de sistema `crypt()` estiver disponível para o servidor, `NÃO` se não estiver. Caso contrário, a função `ENCRYPT()` não pode ser usada.

  Nota

  A função `ENCRYPT()` está desatualizada no MySQL 5.7, será removida em uma futura versão do MySQL e não deve mais ser usada. (Para hashing unidirecional, considere usar `SHA2()` em vez disso.) Consequentemente, `have_crypt` também está desatualizada; espere-se que seja removida em uma futura versão.

- `have_dynamic_loading`

  `SIM` se o **mysqld** suportar o carregamento dinâmico de plugins, `NÃO` se não. Se o valor for `NÃO`, você não poderá usar opções como `--plugin-load` para carregar plugins no início do servidor ou a instrução `INSTALL PLUGIN` para carregar plugins em tempo de execução.

- `have_geometry`

  `SIM` se o servidor suportar tipos de dados espaciais, `NÃO` se não o fizer.

- `have_openssl`

  Essa variável é sinônimo de `have_ssl`.

- `have_profiling`

  `YES` se a capacidade de perfilamento estiver presente, `NO` se não estiver. Se estiver presente, a variável de sistema `profiling` controla se essa capacidade está habilitada ou desabilitada. Veja Seção 13.7.5.31, "Instrução SHOW PROFILES".

  Essa variável está desatualizada; espere que ela seja removida em uma futura versão do MySQL.

- `have_query_cache`

  `SIM` se o **mysqld** suportar o cache de consultas, `NÃO` se não o suportar.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `have_query_cache`.

- `have_rtree_keys`

  `SIM` se os índices `RTREE` estiverem disponíveis, `NÃO` se não estiverem. (Eles são usados para índices espaciais em tabelas `MyISAM`.)

- `have_ssl`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  `SIM` se o **mysqld** suportar conexões SSL, `DESABILITADO` se o servidor foi compilado com suporte SSL, mas não foi iniciado com as opções de criptografia de conexão apropriadas. Para mais informações, consulte Seção 2.8.6, “Configurando Suporte à Biblioteca SSL”.

- `have_statement_timeout`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a funcionalidade de limite de tempo de execução da declaração está disponível (consulte Dicas de otimização do tempo de execução da declaração). O valor pode ser `NO` se o thread de fundo usado por essa funcionalidade não puder ser inicializado.

- `have_symlink`

  `SIM` se o suporte a links simbólicos estiver habilitado, `NÃO` se não estiver. Isso é necessário no Unix para o suporte às opções de tabelas `DATA DIRECTORY` e `INDEX DIRECTORY`. Se o servidor for iniciado com a opção `--skip-symbolic-links`, o valor é `DESABILITADO`.

  Essa variável não tem significado no Windows.

- `host_cache_size`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O servidor MySQL mantém um cache de hosts em memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar consultas no Sistema de Nomes de Domínio (DNS); consulte Seção 5.1.11.2, “Consultas DNS e o Cache de Hosts”.

  A variável `host_cache_size` controla o tamanho do cache do host, bem como o tamanho da tabela do Schema de Desempenho `host_cache` que expõe o conteúdo do cache. Definir `host_cache_size` tem esses efeitos:

  - Definir o tamanho para 0 desabilita o cache do host. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

  - Alterar o tamanho em tempo de execução causa uma operação de esvaziamento implícito do cache do host, que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia quaisquer hosts bloqueados.

  O valor padrão é dimensionado automaticamente para 128, mais 1 para um valor de `max_connections` até 500, mais 1 para cada incremento de 20 acima de 500 no valor de `max_connections`, limitado a um limite de 2000.

  Usar a opção `--skip-host-cache` é semelhante a definir a variável de sistema `host_cache_size` para 0, mas `host_cache_size` é mais flexível porque também pode ser usado para redimensionar, habilitar e desabilitar o cache do host em tempo de execução, não apenas no início do servidor.

  Iniciar o servidor com `--skip-host-cache` não impede alterações no valor de `host_cache_size` durante a execução, mas essas alterações não têm efeito e o cache não é reativado, mesmo que `host_cache_size` seja definido como maior que 0.

  Definir a variável de sistema `host_cache_size` em vez da opção `--skip-host-cache` (server-options.html#option_mysqld_skip-host-cache) é preferível pelas razões mencionadas no parágrafo anterior. Além disso, a opção `--skip-host-cache` está desatualizada no MySQL 8.0 e sua remoção é esperada em uma versão futura do MySQL.

- `hostname`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O servidor define essa variável com o nome do host do servidor durante a inicialização.

- `identidade`

  Esta variável é sinônimo da variável `last_insert_id`. Ela existe para compatibilidade com outros sistemas de banco de dados. Você pode ler seu valor com `SELECT @@identity` e configurá-lo usando `SET identity`.

- `ignore_db_dirs`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Uma lista separada por vírgula de nomes que não são considerados diretórios de banco de dados no diretório de dados. O valor é definido a partir de quaisquer instâncias de `--ignore-db-dir` fornecidas durante o início do servidor.

  A partir do MySQL 5.7.11, `--ignore-db-dir` pode ser usado no momento da inicialização do diretório de dados com **mysqld --initialize** para especificar diretórios que o servidor deve ignorar para avaliar se um diretório de dados existente é considerado vazio. Veja Seção 2.9.1, “Inicializando o Diretório de Dados”.

  Essa variável de sistema está desatualizada no MySQL 5.7. Com a introdução do dicionário de dados no MySQL 8.0, ela se tornou supérflua e foi removida nessa versão.

- `init_connect`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Uma cadeia a ser executada pelo servidor para cada cliente que se conecta. A cadeia consiste em uma ou mais instruções SQL, separadas por caracteres ponto e vírgula.

  Para os usuários que possuem o privilégio `SUPER`, o conteúdo de `init_connect` não é executado. Isso é feito para evitar que um valor incorreto para `init_connect` impeça que todos os clientes se conectem. Por exemplo, o valor pode conter uma instrução com um erro sintático, causando o fracasso das conexões dos clientes. Não executar `init_connect` para usuários que possuem o privilégio `SUPER` permite que eles abram uma conexão e corrijam o valor de `init_connect`.

  A partir do MySQL 5.7.22, a execução de `init_connect` é ignorada para qualquer usuário cliente com uma senha expirada. Isso é feito porque um usuário dessa natureza não pode executar instruções arbitrárias, e, portanto, a execução de `init_connect` falha, deixando o cliente incapaz de se conectar. Ignorar a execução de `init_connect` permite que o usuário se conecte e mude a senha.

  O servidor descarta quaisquer conjuntos de resultados produzidos por declarações no valor de `init_connect`.

- `init_file`

  <table frame="box" rules="all" summary="Propriedades para avoid_temporal_upgrade"><tbody><tr><th>Formato de linha de comando</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se especificado, essa variável nomeia um arquivo que contém instruções SQL a serem lidas e executadas durante o processo de inicialização. Cada instrução deve estar em uma única linha e não deve incluir comentários.

  Se o servidor for iniciado com qualquer uma das opções `--bootstrap`, `--initialize` ou `--initialize-insecure`, ele opera no modo bootstap e algumas funcionalidades estão indisponíveis, limitando as instruções permitidas no arquivo. Isso inclui instruções relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transações globais. Veja Seção 16.1.3, “Replicação com Identificadores de Transações Globais”.

- `innodb_xxx`

  As variáveis de sistema do sistema `InnoDB` estão listadas na Seção 14.15, “Opções de Inicialização e Variáveis de Sistema do InnoDB”. Essas variáveis controlam muitos aspectos do armazenamento, uso de memória e padrões de E/S para as tabelas do `InnoDB`, e são especialmente importantes agora que o `InnoDB` é o motor de armazenamento padrão.

- `insert_id`

  O valor a ser usado pela seguinte instrução `INSERT` ou `ALTER TABLE` ao inserir um valor `AUTO_INCREMENT`. Isso é usado principalmente com o log binário.

- `interactive_timeout`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número de segundos que o servidor espera por atividade em uma conexão interativa antes de fechá-la. Um cliente interativo é definido como um cliente que usa a opção `CLIENT_INTERACTIVE` para `mysql_real_connect()` (/doc/c-api/5.7/pt-BR/mysql-real-connect.html). Veja também `wait_timeout` (server-system-variables.html#sysvar_wait_timeout).

- `internal_tmp_disk_storage_engine`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O mecanismo de armazenamento para tabelas internas temporárias no disco (consulte Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”). Os valores permitidos são `MYISAM` e `INNODB` (o padrão).

  O optimizador utiliza o mecanismo de armazenamento definido por `internal_tmp_disk_storage_engine` para tabelas internas temporárias no disco.

  Ao usar `internal_tmp_disk_storage_engine=INNODB` (o padrão), as consultas que geram tabelas temporárias internas no disco que excedam os limites de linha ou coluna do `InnoDB` (innodb-limits.html) retornam erros de Tamanho da linha muito grande ou Muitas colunas. A solução é definir `internal_tmp_disk_storage_engine` para `MYISAM`.

- `join_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O tamanho mínimo do buffer usado para varreduras de índice simples, varreduras de índice de intervalo e junções que não usam índices e, portanto, realizam varreduras completas da tabela. Normalmente, a melhor maneira de obter junções rápidas é adicionar índices. Aumente o valor de `join_buffer_size` para obter uma junção completa mais rápida quando não for possível adicionar índices. Um buffer de junção é alocado para cada junção completa entre duas tabelas. Para uma junção complexa entre várias tabelas para as quais não são usados índices, pode ser necessário múltiplos buffers de junção.

  O valor padrão é de 256 KB. O ajuste máximo permitido para `join_buffer_size` é de 4 GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto o Windows de 64 bits, para o qual valores grandes são truncados para 4 GB−1 com uma advertência). O tamanho do bloco é de 128, e um valor que não seja um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o valor máximo real é menor que o tamanho do bloco.

  A menos que seja usado um algoritmo de Bloco em Rede ou Acesso a Chave em Massa, não há vantagem em definir o buffer maior do que o necessário para armazenar cada linha correspondente, e todas as junções alocam pelo menos o tamanho mínimo, então use cautela ao definir essa variável para um valor grande globalmente. É melhor manter o ajuste global pequeno e alterar o ajuste da sessão para um valor maior apenas em sessões que realizam junções grandes. O tempo de alocação de memória pode causar quedas substanciais de desempenho se o tamanho global for maior do que o necessário pela maioria das consultas que o utilizam.

  Quando o Bloco de Loop Aninhado é usado, um buffer de junção maior pode ser benéfico até o ponto em que todas as colunas necessárias de todas as linhas da primeira tabela estejam armazenadas no buffer de junção. Isso depende da consulta; o tamanho ótimo pode ser menor do que o de manter todas as linhas das primeiras tabelas.

  Quando o acesso por chave em lote é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao motor de armazenamento. Quanto maior o buffer, mais acesso sequencial é feito à tabela da direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

  Para obter informações adicionais sobre a junção de buffer, consulte Seção 8.2.1.6, “Algoritmos de Junção de Loop Aninhado”. Para informações sobre o Acesso a Chave em Batel, consulte Seção 8.2.1.11, “Junções de Loop Aninhado em Bloco e Acesso a Chave em Batel”.

- `keep_files_on_create`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se o `MyISAM` encontrar um arquivo `.MYD` existente nesse caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, defina a variável `keep_files_on_create` para `ON` (1), caso em que o `MyISAM` não sobrescreverá os arquivos existentes e retornará um erro. O valor padrão é `OFF` (0).

  Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo `.MYD` ou `.MYI` existente for encontrado, o MyISAM sempre retorna um erro. Ele não sobrescreve um arquivo no diretório especificado.

- `key_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Os blocos de índice para tabelas `MyISAM` são armazenados em cache e são compartilhados por todos os threads. `key_buffer_size` é o tamanho do buffer usado para os blocos de índice. O buffer de chave também é conhecido como cache de chave.

  O ajuste mínimo permitido é 0, mas você não pode definir `key_buffer_size` para 0 dinamicamente. Um ajuste de 0 elimina o cache de chaves, o que não é permitido em tempo de execução. Definir `key_buffer_size` para 0 é permitido apenas no início, caso em que o cache de chaves não é inicializado. Alterar o ajuste de `key_buffer_size` em tempo de execução de um valor de 0 para um valor não nulo permitido inicializa o cache de chaves.

  O valor de `key_buffer_size` pode ser aumentado ou diminuído apenas em incrementos ou múltiplos de 4096 bytes. Aumentar ou diminuir o ajuste por um valor não compatível produz uma mensagem de alerta e corta o ajuste para um valor compatível.

  O ajuste máximo permitido para `key_buffer_size` é de 4GB−1 em plataformas de 32 bits. Valores maiores são permitidos para plataformas de 64 bits. O tamanho máximo efetivo pode ser menor, dependendo da RAM física disponível e dos limites de RAM por processo impostos pelo sistema operacional ou pela plataforma de hardware. O valor desta variável indica a quantidade de memória solicitada. Internamente, o servidor aloca a maior quantidade de memória possível até esse valor, mas a alocação real pode ser menor.

  Você pode aumentar o valor para obter um melhor gerenciamento de índice para todas as leituras e múltiplas escritas; em um sistema cuja função principal é executar o MySQL usando o mecanismo de armazenamento `MyISAM`, 25% da memória total da máquina é um valor aceitável para essa variável. No entanto, você deve estar ciente de que, se você aumentar o valor muito (por exemplo, mais de 50% da memória total da máquina), seu sistema pode começar a fazer paginação e se tornar extremamente lento. Isso ocorre porque o MySQL depende do sistema operacional para realizar o cache do sistema de arquivos para leituras de dados, então você deve deixar um pouco de espaço para o cache do sistema de arquivos. Você também deve considerar os requisitos de memória de quaisquer outros mecanismos de armazenamento que você possa estar usando além do `MyISAM`.

  Para obter ainda mais velocidade ao escrever muitas linhas ao mesmo tempo, use `LOCK TABLES`. Veja Seção 8.2.4.1, “Otimização de Instruções INSERT”.

  Você pode verificar o desempenho do buffer de chave emitindo uma declaração `SHOW STATUS` e examinando as variáveis de status [`Key_read_requests`]\(server-status-variables.html#statvar_Key_read_requests], `Key_reads`, `Key_write_requests` e `Key_writes`. (Veja Seção 13.7.5, “Declarações SHOW”.) A proporção `Key_reads/Key_read_requests` normalmente deve ser menor que 0,01. A proporção `Key_writes/Key_write_requests` geralmente está próxima de 1 se você estiver usando principalmente atualizações e exclusões, mas pode ser muito menor se você tiver a tendência de fazer atualizações que afetam muitas linhas ao mesmo tempo ou se estiver usando a opção de tabela `DELAY_KEY_WRITE`.

  A fração do buffer de chave em uso pode ser determinada usando `key_buffer_size` em conjunto com a variável de status `Key_blocks_unused` e o tamanho do bloco do buffer, que está disponível na variável de sistema `key_cache_block_size`:

  ```sql
  1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
  ```

  Esse valor é uma aproximação, pois um espaço interno é alocado para estruturas administrativas no buffer de chave. Os fatores que influenciam a quantidade de overhead dessas estruturas incluem o tamanho do bloco e o tamanho do ponteiro. À medida que o tamanho do bloco aumenta, a porcentagem do buffer de chave perdida para overhead tende a diminuir. Blocos maiores resultam em um menor número de operações de leitura (porque mais chaves são obtidas por leitura), mas, inversamente, um aumento nas leituras de chaves que não são examinadas (se nem todas as chaves de um bloco forem relevantes para uma consulta).

  É possível criar vários caches de chave `MyISAM`. O limite de tamanho de 4 GB aplica-se a cada cache individualmente, não como um grupo. Consulte Seção 8.10.2, “O Cache de Chave MyISAM”.

- `key_cache_age_threshold`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Esse valor controla a redução dos buffers da sublista quente de um cache de chaves para a sublista quente. Valores menores fazem com que a redução ocorra mais rapidamente. O valor mínimo é 100. O valor padrão é 300. Consulte Seção 8.10.2, “O Cache de Chaves MyISAM”.

- `key_cache_block_size`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O tamanho em bytes dos blocos na cache de chaves. O valor padrão é 1024. Consulte Seção 8.10.2, “A Cache de Chaves MyISAM”.

- `key_cache_division_limit`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O ponto de divisão entre as sublistas quentes e quentes da lista de cache de chave da memória cache. O valor é a porcentagem da lista de cache a ser usada para a sublista quente. Os valores permitidos variam de 1 a 100. O valor padrão é 100. Consulte Seção 8.10.2, “O Cache de Chave MyISAM”.

- `large_files_support`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Se o **mysqld** foi compilado com opções para suporte a arquivos grandes.

- `large_pages`

  <table frame="box" rules="all" summary="Propriedades para back_log"><tbody><tr><th>Formato de linha de comando</th> <td><code>--back-log=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>back_log</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Se o suporte a páginas grandes estiver habilitado (através da opção `--large-pages`). Consulte Seção 8.12.4.3, “Habilitar Suporte a Páginas Grandes”.

- `large_page_size`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  Se o suporte a páginas grandes estiver habilitado, isso mostrará o tamanho das páginas de memória. Páginas de memória grandes são suportadas apenas no Linux; em outras plataformas, o valor desta variável é sempre 0. Consulte Seção 8.12.4.3, “Habilitar Suporte a Páginas Grandes”.

- `last_insert_id`

  O valor a ser retornado por `LAST_INSERT_ID()`. Este valor é armazenado no log binário quando você usa `LAST_INSERT_ID()` em uma instrução que atualiza uma tabela. Definir essa variável não atualiza o valor retornado pela função C API `mysql_insert_id()`.

- `lc_messages`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e combina-o com o valor de `lc_messages_dir` para produzir a localização do arquivo de mensagem de erro. Veja Seção 10.12, “Definindo o Idioma da Mensagem de Erro”.

- `lc_messages_dir`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor junto com o valor de `lc_messages` para determinar a localização do arquivo de mensagem de erro. Veja Seção 10.12, “Definindo o Idioma da Mensagem de Erro”.

- `lc_time_names`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  Esta variável especifica o local que controla o idioma usado para exibir os nomes e abreviações de dia e mês. Esta variável afeta a saída das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`. Os nomes do local são valores no estilo POSIX, como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'` independentemente da configuração do local do sistema. Para mais informações, consulte Seção 10.16, “Suporte ao Local do MySQL Server”.

- `licença`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  O tipo de licença que o servidor tem.

- `local_infile`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  Esta variável controla a capacidade `LOCAL` do servidor para as instruções de `LOAD DATA` (load-data.html). Dependendo da configuração de `local_infile` (server-system-variables.html#sysvar_local_infile), o servidor pode recusar ou permitir o carregamento de dados locais por clientes que tenham `LOCAL` habilitado no lado do cliente.

  Para fazer com que o servidor explicitamente recuse ou permita as instruções `LOAD DATA LOCAL`, independentemente de como os programas e bibliotecas do cliente estiverem configurados no momento da compilação ou do tempo de execução, inicie o **mysqld** com a opção `local_infile` desabilitada ou habilitada, respectivamente. A opção `local_infile` também pode ser definida no tempo de execução. Para obter mais informações, consulte a Seção 6.1.6, “Considerações de segurança para LOAD DATA LOCAL”.

- `lock_wait_timeout`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  Esta variável especifica o tempo de espera em segundos para tentativas de adquirir bloqueios de metadados. Os valores permitidos variam de 1 a 31536000 (1 ano). O valor padrão é 31536000.

  Esse tempo de espera se aplica a todas as declarações que utilizam bloqueios de metadados. Isso inclui operações DML e DDL em tabelas, visualizações, procedimentos armazenados e funções armazenadas, bem como as declarações `LOCK TABLES`, `FLUSH TABLES WITH READ LOCK` e `HANDLER`.

  Esse tempo de espera não se aplica a acessos implícitos a tabelas do sistema no banco de dados `mysql`, como as tabelas de concessão modificadas por instruções `GRANT` ou `REVOKE` (grant.html) ou instruções de registro de tabelas. O tempo de espera se aplica a tabelas do sistema acessadas diretamente, como com `SELECT` (select.html) ou `UPDATE` (update.html).

  O valor do tempo de espera aplica-se separadamente para cada tentativa de bloqueio de metadados. Uma determinada instrução pode exigir mais de um bloqueio, portanto, é possível que a instrução fique bloqueada por mais tempo do que o valor de `lock_wait_timeout` antes de relatar um erro de tempo de espera. Quando o tempo de espera do bloqueio ocorre, `ER_LOCK_WAIT_TIMEOUT` é relatado.

  O `lock_wait_timeout` não se aplica a inserções atrasadas, que sempre são executadas com um tempo limite de 1 ano. Isso é feito para evitar tempos limtes desnecessários, pois uma sessão que emite uma inserção atrasada não recebe notificação sobre os tempos limtes da inserção atrasada.

- `locked_in_memory`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  Se o **mysqld** foi bloqueado na memória com `--memlock`.

- `log_error`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  O destino da saída do log de erro. Se o destino for o console, o valor é `stderr`. Caso contrário, o destino é um arquivo e o valor de `log_error` é o nome do arquivo. Veja Seção 5.4.2, “O Log de Erro”.

- `log_error_verbosity`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>basedir</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  A verbosidade do servidor ao escrever mensagens de erro, aviso e nota no log de erro. A tabela a seguir mostra os valores permitidos. O padrão é 3.

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  `log_error_verbosity` foi adicionado no MySQL 5.7.2. Ele é preferido e deve ser usado em vez da antiga variável de sistema `log_warnings`. Consulte a descrição de `log_warnings` para obter informações sobre como essa variável se relaciona com `log_error_verbosity`. Em particular, atribuir um valor a `log_warnings` atribui um valor a `log_error_verbosity` e vice-versa.

- `log_output`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O(s) destino(s) para a saída do log de consulta geral e do log de consultas lentas. O valor é uma lista de uma ou mais palavras separadas por vírgula escolhidas entre `TABLE`, `FILE` e `NONE`. `TABLE` seleciona o registro nas tabelas `general_log` e `slow_log` no banco de dados do sistema `mysql`. `FILE` seleciona o registro em arquivos de log. `NONE` desabilita o registro. Se `NONE` estiver presente no valor, ele terá precedência sobre quaisquer outras palavras presentes. `TABLE` e `FILE` podem ser usados para selecionar ambos os destinos de saída de log.

  Essa variável seleciona destinos de saída de log, mas não habilita a saída de log. Para isso, habilite as variáveis de sistema `general_log` e `slow_query_log`. Para o registro em arquivo `FILE`, as variáveis de sistema `general_log_file` e `slow_query_log_file` determinam os locais dos arquivos de log. Para mais informações, consulte Seção 5.4.1, “Selecionando destinos de saída de log de consultas gerais e log de consultas lentas”.

- `log_queries_not_using_indexes`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se você ativar essa variável com o registro de consultas lentas ativado, as consultas que devem recuperar todas as linhas serão registradas. Veja Seção 5.4.5, “O Registro de Consultas Lentas”. Esta opção não significa necessariamente que nenhum índice é usado. Por exemplo, uma consulta que usa uma varredura completa do índice usa um índice, mas seria registrada porque o índice não limitaria o número de linhas.

- `log_slow_admin_statements`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Inclua declarações administrativas lentas nas declarações escritas para o log de consultas lentas. As declarações administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

- `log_syslog`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se deve escrever a saída do log de erros no log do sistema. Isso é o Registro de Eventos no Windows e o `syslog` em sistemas Unix e Unix-like. O valor padrão é específico da plataforma:

  - No Windows, a saída do Log de Eventos está habilitada por padrão.
  - Nos sistemas Unix e Unix-like, a saída do `syslog` está desativada por padrão.

  Independentemente do padrão, `log_syslog` pode ser definido explicitamente para controlar a saída em qualquer plataforma suportada.

  O controle da saída do log do sistema é distinto da transmissão de saída de erro para um arquivo ou o console. A saída de erro pode ser direcionada para um arquivo ou o console, além ou em vez do log do sistema, conforme desejado. Consulte Seção 5.4.2, “O Log de Erros”.

- `log_syslog_facility`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  A opção para a saída do log de erros no `syslog` (que tipo de programa está enviando a mensagem). Esta variável não tem efeito a menos que a variável de sistema `log_syslog` esteja habilitada. Veja Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

  Os valores permitidos podem variar conforme o sistema operacional; consulte a documentação do `syslog` do seu sistema.

  Essa variável não existe no Windows.

- `log_syslog_include_pid`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se incluir o ID do processo do servidor em cada linha de saída do log de erro escrito no `syslog`. Essa variável não tem efeito a menos que a variável de sistema `log_syslog` esteja habilitada. Veja Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

  Essa variável não existe no Windows.

- `log_syslog_tag`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  A tag a ser adicionada ao identificador do servidor na saída do log de erro escrito no `syslog`. Essa variável não tem efeito a menos que a variável de sistema `log_syslog` esteja habilitada. Veja Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

  Por padrão, o identificador do servidor é `mysqld` sem nenhuma tag. Se um valor de tag de `*``tag`` for especificado, ele será anexado ao identificador do servidor com um hífen no início, resultando em um identificador de `mysqld-tag\`.

  No Windows, para usar uma etiqueta que ainda não existe, o servidor deve ser executado a partir de uma conta com privilégios de administrador, para permitir a criação de uma entrada de registro para a etiqueta. Privilegios elevados não são necessários se a etiqueta já existir.

- `log_timestamps`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Essa variável controla o fuso horário dos timestamps nas mensagens escritas no log de erros e, de forma geral, nas mensagens do log de consultas lentas e do log de consultas lentas escritas em arquivos. Ela não afeta o fuso horário das mensagens do log de consultas lentas e do log de consultas lentas escritas em tabelas (`mysql.general_log`, `mysql.slow_log`). As linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema de sessão `time_zone`.

  Os valores permitidos de `log_timestamps` são `UTC` (padrão) e `SYSTEM` (fuso horário do sistema local).

  Os timestamps são escritos no formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais o valor de cauda `Z`, que indica a hora Zulu (UTC) ou `±hh:mm` (um deslocamento em relação ao UTC).

- `log_throttle_queries_not_using_indexes`

  <table frame="box" rules="all" summary="Propriedades para big_tables"><tbody><tr><th>Formato de linha de comando</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>big_tables</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se `log_queries_not_using_indexes` estiver habilitado, a variável `log_throttle_queries_not_using_indexes` limita o número de consultas desse tipo por minuto que podem ser escritas no log de consultas lentas. Um valor de 0 (o padrão) significa “sem limite”. Para mais informações, consulte Seção 5.4.5, “O Log de Consultas Lentas”.

- `log_warnings`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se deve produzir mensagens de aviso adicionais no log de erros. A partir do MySQL 5.7.2, os itens de informações anteriormente regidos por `log_warnings` são regidos por `log_error_verbosity`, que é preferível e deve ser usado em vez da antiga variável de sistema `log_warnings`. (A variável de sistema `log_warnings` e a opção de linha de comando `--log-warnings` são desatualizadas; espere-os serem removidos em uma futura versão do MySQL.)

  O `log_warnings` está habilitado por padrão (o valor padrão é 1 antes do MySQL 5.7.2 e 2 a partir do 5.7.2). Para desabilitá-lo, defina-o para 0. Se o valor for maior que 0, o servidor registra mensagens sobre instruções que são inseguras para o registro baseado em instruções. Se o valor for maior que 1, o servidor registra conexões abortadas e erros de acesso negado para novas tentativas de conexão. Consulte Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

  Se você estiver usando a replicação, é recomendável habilitar essa variável, definindo-a maior que 0, para obter mais informações sobre o que está acontecendo, como mensagens sobre falhas na rede e reconexões.

  Se um servidor replicador for iniciado com o `log_warnings` habilitado, o replicador imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de retransmissão onde ele inicia seu trabalho, quando está mudando para outro log de retransmissão, quando se reconecta após uma desconexão, e assim por diante.

  Ao atribuir um valor a `log_warnings`, você está atribuindo um valor a `log_error_verbosity` e vice-versa. As variáveis estão relacionadas da seguinte forma:

  - A supressão de todos os itens de `log_warnings`, alcançada com `log_warnings=0`, é alcançada com `log_error_verbosity=1` (apenas erros).

  - Itens impressos para `log_warnings=1` ou superior contam como avisos e são impressos para `log_error_verbosity=2` ou superior.

  - Os itens impressos para `log_warnings=2` são considerados notas e são impressos para `log_error_verbosity=3`.

  A partir do MySQL 5.7.2, o nível de log padrão é controlado por `log_error_verbosity`, que tem um valor padrão de 3. Além disso, o valor padrão de `log_warnings` muda de 1 para 2, o que corresponde a `log_error_verbosity=3`. Para obter um nível de log semelhante ao padrão anterior, defina `log_error_verbosity=2`.

  No MySQL 5.7.2 e versões posteriores, o uso de `log_warnings` ainda é permitido, mas é mapeado para o uso de `log_error_verbosity` da seguinte forma:

  - Definir `log_warnings=0` é equivalente a `log_error_verbosity=1` (apenas erros).

  - Definir `log_warnings=1` é equivalente a `log_error_verbosity=2` (erros, avisos).

  - Definir `log_warnings=2` (ou superior) é equivalente a `log_error_verbosity=3` (erros, avisos, notas), e o servidor define `log_warnings` para 2 se um valor maior for especificado.

- `long_query_time`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se uma consulta demorar mais do que esse número de segundos, o servidor incrementa a variável de status `Slow_queries`. Se o log de consultas lentas estiver habilitado, a consulta é registrada no arquivo de log de consultas lentas. Esse valor é medido em tempo real, não em tempo de CPU, então uma consulta que está abaixo do limite em um sistema levemente carregado pode estar acima do limite em um sistema fortemente carregado. Os valores mínimo e padrão de `long_query_time` são 0 e 10, respectivamente. O máximo é 31536000, que é 365 dias em segundos. O valor pode ser especificado com uma resolução de microsegundos. Veja Seção 5.4.5, “O Log de Consultas Lentas”.

  Valores menores dessa variável resultam em mais declarações sendo consideradas de longa duração, com o resultado de que mais espaço é necessário para o log de consultas lentas. Para valores muito pequenos (menos de um segundo), o log pode crescer bastante em um curto período de tempo. Aumentar o número de declarações consideradas de longa duração também pode resultar em falsos positivos para o alerta “Número excessivo de processos de longa duração” no MySQL Enterprise Monitor, especialmente se a Replicação por Grupo estiver habilitada. Por essas razões, valores muito pequenos devem ser usados apenas em ambientes de teste, ou, em ambientes de produção, apenas por um curto período.

- `low_priority_updates`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se definido como `1`, os comandos `INSERT`, `UPDATE`, `DELETE` e `LOCK TABLE WRITE` aguardam até que não haja nenhum `SELECT` pendente ou `LOCK TABLE READ` na tabela afetada. O mesmo efeito pode ser obtido usando `{INSERT | REPLACE | DELETE | UPDATE} LOW_PRIORITY ...` para diminuir a prioridade de apenas uma consulta. Esta variável afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`). Veja Seção 8.11.2, “Problemas de Bloqueio de Tabela”.

- `lower_case_file_system`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável descreve a sensibilidade à maiúscula ou minúscula dos nomes de arquivos no sistema de arquivos onde o diretório de dados está localizado. `OFF` significa que os nomes de arquivos são sensíveis à maiúscula e minúscula, `ON` significa que não são sensíveis à maiúscula e minúscula. Esta variável é apenas de leitura porque reflete um atributo do sistema de arquivos e definir isso não teria efeito no sistema de arquivos.

- `lower_case_table_names`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se definido como 0, os nomes das tabelas são armazenados conforme especificado e as comparações são sensíveis ao caso. Se definido como 1, os nomes das tabelas são armazenados em minúsculas no disco e as comparações não são sensíveis ao caso. Se definido como 2, os nomes das tabelas são armazenados conforme fornecidos, mas comparados em minúsculas. Esta opção também se aplica aos nomes de banco de dados e aos aliases das tabelas. Para obter detalhes adicionais, consulte Seção 9.2.3, “Sensibilidade ao Caso dos Identificadores”.

  O valor padrão desta variável depende da plataforma (consulte `lower_case_file_system`). No Linux e em outros sistemas Unix-like, o valor padrão é `0`. No Windows, o valor padrão é `1`. No macOS, o valor padrão é `2`. No Linux (e em outros sistemas Unix-like), definir o valor para `2` não é suportado; o servidor força o valor para `0` em vez disso.

  Você *não* deve definir `lower_case_table_names` para 0 se você estiver executando o MySQL em um sistema onde o diretório de dados reside em um sistema de arquivos sensível a maiúsculas e minúsculas (como no Windows ou no macOS). É uma combinação não suportada que pode resultar em uma condição de travamento ao executar uma operação `INSERT INTO ... SELECT ... FROM tbl_name` com a letra *`tbl_name`* errada. Com `MyISAM`, acessar os nomes das tabelas usando diferentes maiúsculas e minúsculas pode causar corrupção de índices.

  Uma mensagem de erro é impressa e o servidor é encerrado se você tentar iniciar o servidor com `--lower_case_table_names=0` em um sistema de arquivos que não faz distinção entre maiúsculas e minúsculas.

  A definição desta variável afeta o comportamento das opções de filtragem de replicação em relação à sensibilidade de maiúsculas e minúsculas. Para mais informações, consulte Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.

- `max_allowed_packet`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho máximo de um pacote ou de qualquer string gerada/intermediária, ou qualquer parâmetro enviado pela função da API C `mysql_stmt_send_long_data()`. O padrão é de 4 MB.

  O buffer de mensagens do pacote é inicializado com `net_buffer_length` bytes, mas pode crescer até `max_allowed_packet` bytes quando necessário. Esse valor é pequeno por padrão, para capturar pacotes grandes (possíveis incorretos).

  Você deve aumentar esse valor se estiver usando colunas grandes de `BLOB` ou strings longas. Ele deve ser tão grande quanto o maior `BLOB` que você deseja usar. O limite do protocolo para `max_allowed_packet` é de 1 GB. O valor deve ser um múltiplo de 1024; os não múltiplos são arredondados para o próximo múltiplo.

  Quando você altera o tamanho do buffer de mensagem alterando o valor da variável `max_allowed_packet`, você também deve alterar o tamanho do buffer no lado do cliente, se o seu programa de cliente permitir. O valor padrão de `max_allowed_packet` embutido na biblioteca do cliente é de 1 GB, mas os programas de cliente individuais podem sobrepor isso. Por exemplo, **mysql** e **mysqldump** têm valores padrão de 16 MB e 24 MB, respectivamente. Eles também permitem que você altere o valor do lado do cliente configurando `max_allowed_packet` na linha de comando ou em um arquivo de opção.

  O valor da sessão desta variável é apenas de leitura. O cliente pode receber até tantos bytes quanto o valor da sessão. No entanto, o servidor não pode enviar mais bytes ao cliente do que o valor atual do global `max_allowed_packet`. (O valor global pode ser menor que o valor da sessão se o valor global for alterado após a conexão do cliente.)

- `max_connect_errors`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Após que sucessivas solicitações de conexão de um host sejam interrompidas sem uma conexão bem-sucedida, o servidor bloqueia essa conexão. Se uma conexão de um host for estabelecida com sucesso em menos de `max_connect_errors` tentativas após uma conexão anterior ter sido interrompida, o contador de erros para o host é zerado. Para desbloquear hosts bloqueados, limpe o cache do host; veja Limpar o Cache do Host.

- `max_connections`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número máximo de conexões de clientes simultâneos permitido. O valor efetivo máximo é o menor entre o valor efetivo de `open_files_limit` `- 810` e o valor realmente definido para `max_connections`.

  Para mais informações, consulte Seção 5.1.11.1, “Interfaces de Conexão”.

- `max_delayed_threads`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `max_digest_length`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número máximo de bytes de memória reservados por sessão para a computação de resumos normalizados de declarações. Quando essa quantidade de espaço é usada durante a computação do resumo, ocorre a redução: mais tokens de uma declaração analisada não são coletados ou incluídos no valor do resumo. Declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo resumo normalizado de declarações e são consideradas idênticas quando comparadas ou quando agregadas para estatísticas de resumo.

  O comprimento utilizado para calcular um resumo normalizado de uma declaração é a soma do comprimento do resumo normalizado de uma declaração e do comprimento do resumo da declaração. Como o comprimento do resumo da declaração é sempre de 64, quando o valor de `max_digest_length` é 1024 (o padrão), o comprimento máximo para uma declaração SQL normalizada antes da ocorrência de corte é de 1024 - 64 = 960 bytes.

  Aviso

  Definir `max_digest_length` para zero desativa a produção de digests, o que também desativa a funcionalidade do servidor que requer digests, como o MySQL Enterprise Firewall.

  Reduzir o valor de `max_digest_length` diminui o uso de memória, mas faz com que o valor do digest de mais declarações se torne indistinguível se elas diferirem apenas no final. Aumentar o valor permite que declarações mais longas sejam distinguidas, mas aumenta o uso de memória, especialmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca `max_digest_length` bytes por sessão).

  O analisador utiliza essa variável de sistema como um limite para o comprimento máximo de resumos de declarações normalizados que ele calcula. O Schema de Desempenho, se ele rastrear resumos de declarações, faz uma cópia do valor do resumo, usando a variável de sistema `performance_schema_max_digest_length`. como um limite para o comprimento máximo de resumos que ele armazena. Consequentemente, se `performance_schema_max_digest_length` for menor que `max_digest_length`, os valores de resumo armazenados no Schema de Desempenho são truncados em relação aos valores originais do resumo.

  Para obter mais informações sobre a digestão de declarações, consulte Seção 25.10, “Digestas de declarações do Schema de Desempenho”.

- `max_error_count`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número máximo de mensagens de erro, aviso e informação que serão armazenadas para serem exibidas pelas declarações `SHOW ERRORS` e `SHOW WARNINGS`. Isso é o mesmo número de áreas de condição na área de diagnóstico, e, portanto, o número de condições que podem ser inspecionadas pelo `GET DIAGNOSTICS`.

- `max_execution_time`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tempo de espera para a execução de instruções `[SELECT]` (select.html), em milissegundos. Se o valor for 0, os tempos de espera não serão habilitados.

  `max_execution_time` se aplica da seguinte forma:

  - O valor global `max_execution_time` fornece o valor padrão para o valor da sessão para novas conexões. O valor da sessão se aplica a execuções `SELECT` executadas dentro da sessão que não incluem nenhuma dica de otimização `MAX_EXECUTION_TIME(N)` ou para as quais *`N`* é 0.

  - `max_execution_time` se aplica a instruções `SELECT` somente de leitura. As instruções que não são somente de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

  - `max_execution_time` é ignorado para as instruções `SELECT` em programas armazenados.

- `max_heap_table_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável define o tamanho máximo permitido para as tabelas `MEMORY` criadas pelo usuário crescer. O valor da variável é usado para calcular os valores `MAX_ROWS` das tabelas `MEMORY`.

  Definir essa variável não afeta nenhuma tabela `MEMORY` existente, a menos que a tabela seja recarregada com uma instrução como `CREATE TABLE` ou alterada com `ALTER TABLE` ou `TRUNCATE TABLE`. A reinicialização do servidor também define o tamanho máximo das tabelas `MEMORY` existentes no valor global `max_heap_table_size`.

  Essa variável também é usada em conjunto com `tmp_table_size` para limitar o tamanho das tabelas internas de memória. Veja Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  `max_heap_table_size` não é replicado. Consulte Seção 16.4.1.20, “Replicação e Tabelas de MEMORY” e Seção 16.4.1.37, “Replicação e Variáveis” para obter mais informações.

- `max_insert_delayed_threads`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável é sinônimo de `max_delayed_threads`.

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `max_join_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Não permita declarações que provavelmente precisem examinar mais de `max_join_size` linhas (para declarações de uma única tabela) ou combinações de linhas (para declarações de múltiplas tabelas) ou que provavelmente realizem mais de `max_join_size` buscas no disco. Ao definir esse valor, você pode detectar declarações em que as chaves não são usadas corretamente e que provavelmente levarão muito tempo. Defina-o se seus usuários tendem a realizar junções que não têm uma cláusula `WHERE`, que levam muito tempo ou que retornam milhões de linhas. Para mais informações, consulte Usando o Modo Safe-Updates (--safe-updates).

  Definir essa variável para um valor diferente de `DEFAULT` redefiniu o valor de `sql_big_selects` para `0`. Se você definir o valor de `sql_big_selects` novamente, a variável `max_join_size` será ignorada.

  Se o resultado de uma consulta estiver no cache de consultas, não é realizada nenhuma verificação do tamanho do resultado, porque o resultado já foi calculado anteriormente e não sobrecarrega o servidor para enviá-lo ao cliente.

- `max_length_for_sort_data`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O limite de tamanho dos valores do índice que determina qual algoritmo de `filesort` deve ser usado. Veja Seção 8.2.1.14, “Otimização de ORDER BY”.

- `max_points_in_geometry`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O valor máximo do argumento *`points_per_circle`* da função `ST_Buffer_Strategy()`.

- `max_prepared_stmt_count`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável limita o número total de declarações preparadas no servidor. Ela pode ser usada em ambientes onde há o potencial de ataques de negação de serviço, baseados em esgotar a memória do servidor ao preparar um grande número de declarações. Se o valor for definido como menor que o número atual de declarações preparadas, as declarações existentes não serão afetadas e podem ser usadas, mas novas declarações não poderão ser preparadas até que o número atual caia abaixo do limite. Definir o valor para 0 desabilita as declarações preparadas.

- `max_seeks_for_key`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Limite o número máximo de buscas assumido ao procurar linhas com base em uma chave. O otimizador do MySQL assume que não são necessários mais que esse número de buscas por chave ao procurar linhas correspondentes em uma tabela, realizando uma varredura em um índice, independentemente da cardinalidade real do índice (veja Seção 13.7.5.22, “Instrução SHOW INDEX”). Ao definir esse valor para um valor baixo (digamos, 100), você pode forçar o MySQL a preferir índices em vez de varreduras de tabela.

- `max_sort_length`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número de bytes a serem usados ao ordenar os valores dos dados. O servidor usa apenas os primeiros max_sort_length bytes de cada valor e ignora o resto. Consequentemente, os valores que diferem apenas após os primeiros max_sort_length bytes são considerados iguais nas operações `GROUP BY`, `ORDER BY` e `DISTINCT`.

  Para aumentar o valor de `max_sort_length`, pode ser necessário aumentar o valor de `sort_buffer_size` também. Para mais detalhes, consulte Seção 8.2.1.14, “Otimização de ORDER BY”

- `max_sp_recursion_depth`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número de vezes que um procedimento armazenado específico pode ser chamado recursivamente. O valor padrão para essa opção é 0, que desabilita completamente a recursão em procedimentos armazenados. O valor máximo é 255.

  A recursão de procedimentos armazenados aumenta a demanda por espaço na pilha de threads. Se você aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da pilha de threads ao aumentar o valor de `thread_stack` no momento do início do servidor.

- `max_tmp_tables`

  Esta variável não é usada. Ela está desatualizada e será removida no MySQL 8.0.

- `max_user_connections`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número máximo de conexões simultâneas permitidas para qualquer conta de usuário do MySQL. Um valor de 0 (o padrão) significa "sem limite".

  Essa variável tem um valor global que pode ser definido na inicialização ou durante o runtime do servidor. Ela também tem um valor de sessão somente de leitura que indica o limite efetivo de conexões simultâneas que se aplica à conta associada à sessão atual. O valor da sessão é inicializado da seguinte forma:

  - Se a conta de usuário tiver um limite de recursos `MAX_USER_CONNECTIONS` não nulo, o valor da sessão `max_user_connections` será definido nesse limite.

  - Caso contrário, o valor da sessão `max_user_connections` é definido pelo valor global.

  Os limites de recursos da conta são especificados usando a declaração `CREATE USER` ou `ALTER USER`. Veja Seção 6.2.16, “Definindo Limites de Recursos da Conta”.

- `max_write_lock_count`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Após muitas tentativas de escrita, permita que alguns pedidos de bloqueio de leitura pendentes sejam processados entre eles. Os pedidos de bloqueio de escrita têm prioridade maior do que os pedidos de bloqueio de leitura. No entanto, se `max_write_lock_count` estiver definido para um valor baixo (digamos, 10), os pedidos de bloqueio de leitura podem ser preferidos em relação aos pedidos de bloqueio de escrita pendentes, se os pedidos de bloqueio de leitura já tiverem sido atendidos em favor de 10 pedidos de bloqueio de escrita. Normalmente, esse comportamento não ocorre porque `max_write_lock_count` tem um valor muito grande por padrão.

- `mecab_rc_file`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  A opção `mecab_rc_file` é usada ao configurar o analisador de texto completo MeCab.

  A opção `mecab_rc_file` define o caminho para o arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. A opção é somente de leitura e só pode ser definida durante o início. O arquivo de configuração `mecabrc` é necessário para inicializar o MeCab.

  Para obter informações sobre o analisador de texto completo MeCab, consulte Seção 12.9.9, “Plugin de Analisador de Texto Completo MeCab”.

  Para obter informações sobre as opções que podem ser especificadas no arquivo de configuração do MeCab `mecabrc`, consulte a Documentação do MeCab no site [Google Developers](https://code.google.com/).

- `metadata_locks_cache_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho do cache de bloqueios de metadados. O servidor usa esse cache para evitar a criação e destruição de objetos de sincronização. Isso é particularmente útil em sistemas onde essas operações são caras, como o Windows XP.

  Na versão 5.7.4 do MySQL, as mudanças na implementação de bloqueio de metadados tornam essa variável desnecessária, e, portanto, ela é desaconselhada; espere que ela seja removida em uma futura versão do MySQL.

- `metadata_locks_hash_instances`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O conjunto de bloqueios de metadados pode ser dividido em hashes separados para permitir que conexões que acessam diferentes objetos usem hashes de bloqueio diferentes e reduzam a concorrência. A variável de sistema `metadata_locks_hash_instances` especifica o número de hashes (padrão 8).

  Na versão 5.7.4 do MySQL, as mudanças na implementação de bloqueio de metadados tornam essa variável desnecessária, e, portanto, ela é desaconselhada; espere que ela seja removida em uma futura versão do MySQL.

- `min_examined_row_limit`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  As consultas que examinam menos de esse número de linhas não são registradas no log de consultas lentas.

- `multi_range_count`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável não tem efeito. Ela foi descontinuada e será removida no MySQL 8.0.

- `myisam_data_pointer_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho padrão do ponteiro em bytes, a ser usado por `CREATE TABLE` para tabelas `MyISAM` quando nenhuma opção `MAX_ROWS` é especificada. Esta variável não pode ser menor que 2 ou maior que 7. O valor padrão é

  6. Veja Seção B.3.2.10, “A tabela está cheia”.

- `myisam_max_sort_file_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho máximo do arquivo temporário que o MySQL é permitido usar enquanto recria um índice `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE` ou `LOAD DATA`). Se o tamanho do arquivo for maior que esse valor, o índice é criado usando o cache de chaves em vez disso, o que é mais lento. O valor é dado em bytes.

  Se os arquivos de índice `MyISAM` ultrapassarem esse tamanho e houver espaço em disco disponível, aumentar o valor pode ajudar no desempenho. O espaço deve estar disponível no sistema de arquivos que contém o diretório onde o arquivo de índice original está localizado.

- `myisam_mmap_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O valor máximo de memória a ser usado para mapear a memória de arquivos comprimidos de `MyISAM` (myisam-storage-engine.html). Se muitas tabelas `MyISAM` comprimidas forem usadas, o valor pode ser reduzido para diminuir a probabilidade de problemas de troca de memória.

- `myisam_recover_options`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Defina o modo de recuperação do mecanismo de armazenamento `MyISAM`. O valor da variável é qualquer combinação dos valores `OFF`, `DEFAULT`, `BACKUP`, `FORCE` ou `QUICK`. Se você especificar múltiplos valores, separe-os por vírgula. Especificar a variável sem valor no início do servidor é o mesmo que especificar `DEFAULT`, e especificar com um valor explícito de `""` desabilita a recuperação (mesmo que seja um valor de `OFF`). Se a recuperação estiver habilitada, cada vez que o **mysqld** abre uma tabela `MyISAM`, ele verifica se a tabela está marcada como quebrada ou se não foi fechada corretamente. (A última opção só funciona se você estiver executando com o bloqueio externo desativado.) Nesse caso, o **mysqld** executa uma verificação na tabela. Se a tabela estiver corrompida, o **mysqld** tenta repará-la.

  As seguintes opções afetam o funcionamento da reparação.

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Antes que o servidor repare automaticamente uma tabela, ele escreve uma nota sobre a reparação no log de erros. Se você quiser ser capaz de recuperar a maioria dos problemas sem intervenção do usuário, você deve usar as opções `BACKUP,FORCE`. Isso força uma reparação de uma tabela, mesmo que algumas linhas sejam excluídas, mas mantém o arquivo de dados antigo como uma cópia de segurança para que você possa examinar mais tarde o que aconteceu.

  Veja Seção 15.2.1, “Opções de inicialização do MyISAM”.

- `myisam_repair_threads`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Nota

  Essa variável de sistema está desatualizada no MySQL 5.7; espere-se que ela seja removida em uma futura versão do MySQL.

  A partir do MySQL 5.7.38, valores diferentes de 1 geram um aviso.

  Se esse valor for maior que 1, os índices da tabela `MyISAM` serão criados em paralelo (cada índice em sua própria thread) durante o processo de `Reparo por ordenação`. O valor padrão é 1.

  Nota

  A reparação multithreading é código de qualidade beta.

- `myisam_sort_buffer_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho do buffer que é alocado ao ordenar índices `MyISAM` durante uma `REPAIR TABLE` (reparo de tabela) ou ao criar índices com `CREATE INDEX` (criar índice) ou `ALTER TABLE` (alterar tabela).

- `myisam_stats_method`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Como o servidor trata os valores `NULL` ao coletar estatísticas sobre a distribuição dos valores de índice para tabelas `MyISAM`. Esta variável tem três valores possíveis, `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores de índice `NULL` são considerados iguais e formam um único grupo de valores que tem um tamanho igual ao número de valores `NULL`. Para `nulls_unequal`, os valores `NULL` são considerados diferentes, e cada `NULL` forma um grupo de valores distinto de tamanho igual a

  1. Para `nulls_ignored`, os valores `NULL` são ignorados.

  O método utilizado para gerar estatísticas de tabela influencia a forma como o otimizador escolhe índices para a execução de consultas, conforme descrito em Seção 8.3.7, “Coleta de Estatísticas de Índices InnoDB e MyISAM”.

- `myisam_use_mmap`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Use mapeamento de memória para leitura e escrita de tabelas `MyISAM`.

- `mysql_native_password_proxy_users`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável controla se o plugin de autenticação integrado `mysql_native_password` suporta usuários proxy. Ela não tem efeito a menos que a variável de sistema `check_proxy_users` esteja habilitada. Para informações sobre o proxeamento de usuários, consulte Seção 6.2.14, “Usuários Proxy”.

- `named_pipe`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  (Apenas para Windows.) Indica se o servidor suporta conexões por meio de tubos nomeados.

- `named_pipe_full_access_group`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  (Apenas para Windows.) O controle de acesso concedido aos clientes na pipe nomeada criada pelo servidor MySQL está configurado para o mínimo necessário para uma comunicação bem-sucedida quando a variável de sistema `named_pipe` está habilitada para suportar conexões por pipe nomeada. Alguns softwares de cliente MySQL podem abrir conexões por pipe nomeada sem nenhuma configuração adicional; no entanto, outros softwares de cliente ainda podem exigir acesso total para abrir uma conexão por pipe nomeada.

  Essa variável define o nome de um grupo local do Windows, cujos membros recebem acesso suficiente do servidor MySQL para usar clientes de pipe nomeado. A partir do MySQL 5.7.34, o valor padrão é definido como uma string vazia, o que significa que nenhum usuário do Windows recebe acesso total ao pipe nomeado.

  Um novo nome de grupo local do Windows (por exemplo, `mysql_access_client_users`) pode ser criado no Windows e, em seguida, usado para substituir o valor padrão quando o acesso for absolutamente necessário. Nesse caso, limite a associação do grupo ao menor número possível de usuários, removendo os usuários do grupo quando o software do cliente for atualizado. Um usuário que não faz parte do grupo e tenta abrir uma conexão com o cliente de canal nomeado afetado é negado o acesso até que um administrador do Windows adicione o usuário ao grupo. Os usuários recém-adicionados devem fazer logout e fazer login novamente para se juntar ao grupo (requisitado pelo Windows).

  Definir o valor para `'*everyone*'` fornece uma maneira independente da linguagem de se referir ao grupo Todos no Windows. O grupo Todos não é seguro por padrão.

- `net_buffer_length`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Cada thread de cliente está associado a um buffer de conexão e um buffer de resultados. Ambos começam com um tamanho definido por `net_buffer_length`, mas são ampliados dinamicamente até [`max_allowed_packet`]\(server-system-variables.html#sysvar_max_allowed_packet] bytes conforme necessário. O buffer de resultados diminui para [`net_buffer_length`]\(server-system-variables.html#sysvar_net_buffer_length] após cada instrução SQL.

  Essa variável normalmente não deve ser alterada, mas se você tiver muito pouca memória, pode configurá-la para o comprimento esperado das declarações enviadas pelos clientes. Se as declarações ultrapassarem esse comprimento, o buffer de conexão será automaticamente ampliado. O valor máximo para o qual `net_buffer_length` pode ser configurado é de 1 MB.

  O valor da sessão desta variável é apenas de leitura.

- `net_read_timeout`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número de segundos para esperar por mais dados de uma conexão antes de abortar a leitura. Quando o servidor está lendo do cliente, `net_read_timeout` é o valor de tempo de espera que controla quando abortar. Quando o servidor está escrevendo para o cliente, `net_write_timeout` é o valor de tempo de espera que controla quando abortar. Veja também `slave_net_timeout`.

- `net_retry_count`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se uma leitura ou gravação em um port de comunicação for interrompida, tente novamente esse número de vezes antes de desistir. Esse valor deve ser configurado bastante alto no FreeBSD, pois interrupções internas são enviadas para todos os threads.

- `net_write_timeout`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número de segundos para esperar que um bloco seja escrito em uma conexão antes de abortar a escrita. Veja também `net_read_timeout`.

- `novo`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável foi usada no MySQL 4.0 para ativar alguns comportamentos do 4.1 e foi mantida para compatibilidade reversa. Seu valor é sempre `OFF`.

  No NDB Cluster, definir essa variável para `ON` permite o uso de tipos de particionamento diferentes de `KEY` ou `LINEAR KEY` com tabelas de `NDB`. Esse recurso experimental não é suportado em produção e agora está desatualizado e, portanto, sujeito à remoção em uma futura versão. Para obter informações adicionais, consulte Particionamento definido pelo usuário e o motor de armazenamento NDB (NDB Cluster).

- `ngram_token_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Define o tamanho do token de n-gramas para o analisador de texto completo de n-gramas. A opção `ngram_token_size` é somente de leitura e só pode ser modificada durante o inicialização. O valor padrão é 2 (bigram). O valor máximo é 10.

  Para obter mais informações sobre como configurar essa variável, consulte Seção 12.9.8, “Parser de Texto Completo ngram”.

- `offline_mode`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se o servidor estiver no modo "offline", que possui essas características:

  - Os usuários do cliente conectados que não possuem o privilégio `SUPER` são desconectados na próxima solicitação, com um erro apropriado. A desconexão inclui o encerramento de instruções em execução e a liberação de bloqueios. Esses clientes também não podem iniciar novas conexões e receberão um erro apropriado.

  - Os usuários de clientes conectados que possuem o privilégio `SUPER` não são desconectados e podem iniciar novas conexões para gerenciar o servidor.

  - Os tópicos de réplica podem continuar a enviar dados para o servidor.

  Apenas os usuários que possuem o privilégio `SUPER` podem controlar o modo offline. Para colocar um servidor no modo offline, altere o valor da variável de sistema `offline_mode` de `OFF` para `ON`. Para retomar as operações normais, altere `offline_mode` de `ON` para `OFF`. No modo offline, os clientes que são recusados recebem um erro `ER_SERVER_OFFLINE_MODE`.

- `antigo`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  `old` é uma variável de compatibilidade. Ela é desabilitada por padrão, mas pode ser habilitada durante o início para reverter o servidor para comportamentos presentes em versões mais antigas.

  Quando `old` está habilitado, ele altera o escopo padrão das dicas de índice para o usado antes do MySQL 5.1.17. Ou seja, as dicas de índice sem cláusula `FOR` aplicam-se apenas à forma como os índices são usados para recuperação de linhas e não à resolução das cláusulas `ORDER BY` ou `GROUP BY` (Consulte Seção 8.9.4, “Dicas de Índice”). Tenha cuidado ao habilitar isso em uma configuração de replicação. Com o registro binário baseado em instruções, ter modos diferentes para a fonte e réplicas pode levar a erros de replicação.

- `old_alter_table`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Quando essa variável estiver habilitada, o servidor não usará o método otimizado para processar uma operação de `ALTER TABLE`. Ele voltará a usar uma tabela temporária, copiando os dados e renomeando a tabela temporária para a original, como era feito pelo MySQL 5.0 e versões anteriores. Para mais informações sobre a operação de `ALTER TABLE`, consulte Seção 13.1.8, “Instrução ALTER TABLE”.

- `old_passwords`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Nota

  Essa variável de sistema está desatualizada no MySQL 5.7; espere-se que ela seja removida em uma futura versão do MySQL.

  Essa variável controla o método de hashing de senha usado pela função `PASSWORD()`. Ela também influencia o hashing de senha realizado pelas instruções `CREATE USER` e `GRANT` que especificam uma senha usando uma cláusula `IDENTIFIED BY`.

  A tabela a seguir mostra, para cada método de hashing de senha, o valor permitido de `old_passwords` e quais plugins de autenticação usam o método de hashing.

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se você definir `old_passwords=2`, siga as instruções para usar o plugin `sha256_password` na Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

  O servidor define o valor global `old_passwords` durante a inicialização para ser consistente com o método de hashing de senhas exigido pelo plugin de autenticação indicado pela variável de sistema `default_authentication_plugin`.

  Quando um cliente se conecta com sucesso ao servidor, o servidor define o valor da sessão `old_passwords` de forma apropriada para o método de autenticação da conta. Por exemplo, se a conta usa o plugin de autenticação `sha256_password`, o servidor define `old_passwords=2`.

  Para obter informações adicionais sobre plugins de autenticação e formatos de hashing, consulte Seção 6.2.13, “Autenticação Conectada” e Seção 6.1.2.4, “Hashing de Senhas no MySQL”.

- `open_files_limit`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número de descritores de arquivo disponíveis para **mysqld** a partir do sistema operacional:

  - Ao inicializar, o **mysqld** reserva descritores com `setrlimit()`, usando o valor solicitado ao definir diretamente essa variável ou usando a opção `--open-files-limit` para **mysqld_safe**. Se o **mysqld** produzir o erro `Too many open files`, tente aumentar o valor da variável `open_files_limit`. Internamente, o valor máximo para essa variável é o valor máximo de inteiro não assinado, mas o máximo real depende da plataforma.

  - Durante a execução, o valor de `open_files_limit` indica o número de descritores de arquivo realmente permitidos para o **mysqld** pelo sistema operacional, que pode diferir do valor solicitado durante o início. Se o número de descritores de arquivo solicitados durante o início não puder ser alocado, o **mysqld** escreve uma mensagem de aviso no log de erro.

  O valor efetivo de `open_files_limit` é baseado no valor especificado na inicialização do sistema (se houver) e nos valores de `max_connections` e `table_open_cache`, utilizando as seguintes fórmulas:

  - `10 + max_connections + (cache_de_abertura_da_tabela * 2)`

  - `max_connections * 5`

  - O limite do sistema operacional, se esse limite for positivo, mas não infinito.

  - Se o limite do sistema operacional for Infinito: o valor `open_files_limit` se especificado na inicialização, 5000 se não for.

  O servidor tenta obter o número de descritores de arquivo usando o máximo desses valores. Se não for possível obter tantos descritores, o servidor tenta obter quantos o sistema permitir.

  O valor efetivo é 0 em sistemas onde o MySQL não pode alterar o número de arquivos abertos.

  No Unix, o valor não pode ser maior que o valor exibido pelo comando **ulimit -n**. Em sistemas Linux que usam o `systemd`, o valor não pode ser maior que `LimitNOFile` (se `LimitNOFile` não estiver definido, será `DefaultLimitNOFILE`); caso contrário, no Linux, o valor de `open_files_limit` não pode exceder **ulimit -n**.

- `optimizer_prune_level`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Controla as heurísticas aplicadas durante a otimização da consulta para eliminar planos parciais menos promissores do espaço de busca do otimizador. Um valor de 0 desabilita as heurísticas para que o otimizador realize uma busca exaustiva. Um valor de 1 faz com que o otimizador elimine planos com base no número de linhas recuperadas pelos planos intermediários.

- `optimizer_search_depth`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  A profundidade máxima de pesquisa realizada pelo otimizador de consultas. Valores maiores que o número de relações em um resultado de consulta resultam em melhores planos de consulta, mas demoram mais para gerar um plano de execução para uma consulta. Valores menores que o número de relações em uma consulta retornam um plano de execução mais rápido, mas o plano resultante pode estar longe de ser ótimo. Se definido para 0, o sistema escolhe automaticamente um valor razoável.

- `optimizer_switch`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  A variável de sistema `optimizer_switch` permite controlar o comportamento do otimizador. O valor dessa variável é um conjunto de flags, cada uma com um valor de `on` ou `off` para indicar se o comportamento do otimizador correspondente está habilitado ou desabilitado. Essa variável tem valores globais e de sessão e pode ser alterada em tempo de execução. O valor padrão global pode ser definido na inicialização do servidor.

  Para ver o conjunto atual de flags do otimizador, selecione o valor da variável:

  ```sql
  mysql> SELECT @@optimizer_switch\G
  *************************** 1. row ***************************
  @@optimizer_switch: index_merge=on,index_merge_union=on,
                      index_merge_sort_union=on,
                      index_merge_intersection=on,
                      engine_condition_pushdown=on,
                      index_condition_pushdown=on,
                      mrr=on,mrr_cost_based=on,
                      block_nested_loop=on,batched_key_access=off,
                      materialization=on,semijoin=on,loosescan=on,
                      firstmatch=on,duplicateweedout=on,
                      subquery_materialization_cost_based=on,
                      use_index_extensions=on,
                      condition_fanout_filter=on,derived_merge=on,
                      prefer_ordering_index=on
  ```

  Para obter mais informações sobre a sintaxe desta variável e os comportamentos do otimizador que ela controla, consulte Seção 8.9.2, “Otimizações Desativáveis”.

- `optimizer_trace`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável controla o rastreamento do otimizador. Para obter detalhes, consulte Seção 8.15, “Rastreamento do Otimizador”.

- `optimizer_trace_features`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável habilita ou desabilita as funcionalidades de rastreamento do otimizador selecionadas. Para obter detalhes, consulte Seção 8.15, “Rastreamento do Otimizador”.

- `optimizer_trace_limit`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número máximo de traços do otimizador a serem exibidos. Para detalhes, consulte Seção 8.15, “Rastrear o Otimizador”.

- `optimizer_trace_max_mem_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho cumulativo máximo de registros armazenados do otimizador. Para obter detalhes, consulte Seção 8.15, “Rastreamento do Otimizador”.

- `optimizer_trace_offset`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O deslocamento das traças do otimizador para exibição. Para obter detalhes, consulte Seção 8.15, “Rastrear o Otimizador”.

- `schema_de_desempenho_xxx`

  As variáveis do sistema do Schema de Desempenho estão listadas em Seção 25.15, “Variáveis do Sistema do Schema de Desempenho”. Essas variáveis podem ser usadas para configurar a operação do Schema de Desempenho.

- `parser_max_mem_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O valor máximo de memória disponível para o analisador. O valor padrão não define nenhum limite para a memória disponível. O valor pode ser reduzido para proteger contra situações de falta de memória causadas pela análise de instruções SQL longas ou complexas.

- `pid_file`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O nome do caminho do arquivo no qual o servidor escreve seu ID de processo. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Se você especificar essa variável, deve especificar um valor. Se você não especificar essa variável, o MySQL usa um valor padrão de `host_name.pid`, onde *`host_name`* é o nome da máquina do host.

  O arquivo de ID do processo é usado por outros programas, como **mysqld_safe**, para determinar o ID do processo do servidor. No Windows, essa variável também afeta o nome do arquivo de log de erro padrão. Veja Seção 5.4.2, “O Log de Erro”.

- `plugin_dir`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O nome do caminho do diretório do plugin.

  Se o diretório do plugin for legível pelo servidor, pode ser possível para um usuário escrever código executável em um arquivo no diretório usando `SELECT ... INTO DUMPFILE`. Isso pode ser evitado tornando `plugin_dir` somente leitura para o servidor ou configurando `secure_file_priv` para um diretório onde as escritas de `SELECT` possam ser feitas com segurança.

- `port`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O número do porto no qual o servidor escuta as conexões TCP/IP. Essa variável pode ser definida com a opção `--port`.

- `preload_buffer_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho do buffer que é alocado durante o pré-carregamento de índices.

- `profiling`

  Se definido para 0 ou `OFF` (o padrão), o perfilamento de instruções é desativado. Se definido para 1 ou `ON`, o perfilamento de instruções é ativado e as instruções `SHOW PROFILE` e `SHOW PROFILES` fornecem acesso às informações de perfilamento. Veja Seção 13.7.5.31, “Instrução SHOW PROFILES”.

  Essa variável está desatualizada; espere que ela seja removida em uma futura versão do MySQL.

- `história_de_profilagem_tamanho`

  O número de declarações para as quais manter as informações de perfilamento se `profiling` estiver habilitado. O valor padrão é 15. O valor máximo é 100. Definir o valor para 0 desabilita efetivamente o perfilamento. Veja Seção 13.7.5.31, “Declaração SHOW PROFILES”.

  Essa variável está desatualizada; espere que ela seja removida em uma futura versão do MySQL.

- `protocol_version`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  A versão do protocolo cliente/servidor usado pelo servidor MySQL.

- `proxy_user`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se o cliente atual for um proxy para outro usuário, essa variável é o nome da conta do usuário proxy. Caso contrário, essa variável é `NULL`. Veja Seção 6.2.14, “Usuários Proxy”.

- `pseudo_slave_mode`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável de sistema é para uso interno do servidor. `pseudo_slave_mode` auxilia no tratamento correto das transações que foram geradas em servidores mais antigos ou mais novos do que o servidor que está processando-as atualmente. **mysqlbinlog** define o valor de `pseudo_slave_mode` para true antes de executar quaisquer instruções SQL.

  O modo `pseudo_slave_mode` (variáveis do sistema do servidor.html#sysvar_pseudo_slave_mode) tem os seguintes efeitos no tratamento de transações XA preparadas, que podem ser anexados ou desacoplados da sessão de tratamento (por padrão, a sessão que emite `XA START` (xa.html)):

  - Se for verdade e a sessão de manipulação executou uma instrução de uso interno `BINLOG`, as transações XA são automaticamente desconectadas da sessão assim que a primeira parte da transação até o `XA PREPARE` terminar, para que possam ser comprometidas ou revertidas por qualquer sessão que tenha o privilégio `XA_RECOVER_ADMIN`.

  - Se falsa, as transações XA permanecem anexadas à sessão de processamento enquanto essa sessão estiver ativa, durante o qual nenhuma outra sessão poderá confirmar a transação. A transação preparada só é desanexada se a sessão se desconectar ou o servidor reiniciar.

- `pseudo_thread_id`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável é para uso interno do servidor.

  Aviso

  Alterar o valor da variável de sistema `pseudo_thread_id` altera o valor retornado pela função `CONNECTION_ID()`.

- `query_alloc_block_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho da alocação em bytes dos blocos de memória que são alocados para objetos criados durante a análise e execução da instrução. Se você tiver problemas com a fragmentação de memória, pode ser útil aumentar este parâmetro.

  O tamanho do bloco para o número de bytes é de 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco menor.

- `query_cache_limit`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Não cache resultados que sejam maiores que este número de bytes. O valor padrão é de 1 MB.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `query_cache_limit`.

- `query_cache_min_res_unit`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho mínimo (em bytes) para blocos alocados pelo cache de consultas. O valor padrão é 4096 (4 KB). As informações de ajuste para essa variável estão disponíveis em Seção 8.10.3.3, “Configuração do Cache de Consultas”.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `query_cache_min_res_unit`.

- `query_cache_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  A quantidade de memória alocada para o cache de resultados de consultas. Por padrão, o cache de consultas está desativado. Isso é feito usando um valor padrão de 1M, com um valor padrão para `query_cache_type` de 0. (Para reduzir significativamente o overhead se você definir o tamanho para 0, você também deve iniciar o servidor com `query_cache_type=0`.

  Os valores permitidos são múltiplos de 1024; outros valores são arredondados para o múltiplo mais próximo. Para valores não nulos de `query_cache_size`, serão alocados tantos bytes de memória, mesmo que `query_cache_type=0`. Consulte Seção 8.10.3.3, “Configuração do Cache de Consultas” para obter mais informações.

  O cache de consultas precisa de um tamanho mínimo de cerca de 40 KB para alocar suas estruturas. (O tamanho exato depende da arquitetura do sistema.) Se você definir o valor de `query_cache_size` muito pequeno, um aviso será exibido, conforme descrito na Seção 8.10.3.3, “Configuração do Cache de Consultas”.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `query_cache_size`.

- `query_cache_type`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Defina o tipo de cache de consulta. Definir o valor `GLOBAL` define o tipo para todos os clientes que se conectarem posteriormente. Clientes individuais podem definir o valor `SESSION` para afetar o uso próprio do cache de consulta. Os valores possíveis estão mostrados na tabela a seguir.

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável tem o valor padrão `OFF`.

  Se o servidor for iniciado com `query_cache_type` definido como 0, ele não adquiri o mutex do cache de consultas, o que significa que o cache de consultas não pode ser habilitado em tempo de execução e há um overhead reduzido na execução das consultas.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `query_cache_type`.

- `query_cache_wlock_invalidate`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Normalmente, quando um cliente adquire um bloqueio `WRITE` em uma tabela, outros clientes não são impedidos de emitir instruções que leem a tabela se os resultados da consulta estiverem presentes no cache de consultas. Definir essa variável para 1 faz com que a aquisição de um bloqueio `WRITE` para uma tabela in valide quaisquer consultas no cache de consultas que se referem à tabela. Isso obriga outros clientes que tentam acessar a tabela a aguardar enquanto o bloqueio estiver em vigor.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `query_cache_wlock_invalidate`.

- `query_prealloc_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho em bytes do buffer persistente usado para a análise e execução das instruções. Esse buffer não é liberado entre as instruções. Se você estiver executando consultas complexas, um valor maior para `query_prealloc_size` pode ser útil para melhorar o desempenho, pois pode reduzir a necessidade do servidor de realizar a alocação de memória durante as operações de execução da consulta. Você deve estar ciente de que fazer isso não elimina necessariamente a alocação completamente; o servidor ainda pode alocar memória em algumas situações, como para operações relacionadas a transações ou a programas armazenados.

- `rand_seed1`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  As variáveis `rand_seed1` e `rand_seed2` existem apenas como variáveis de sessão e podem ser definidas, mas não lidas. As variáveis — mas não seus valores — são exibidas na saída da consulta `SHOW VARIABLES`.

  O propósito dessas variáveis é suportar a replicação da função `RAND()`. Para as instruções que invocam `RAND()`, a fonte passa dois valores para a replica, onde eles são usados para gerar o gerador de números aleatórios. A replica usa esses valores para definir as variáveis de sessão `rand_seed1` e `rand_seed2` para que a função `RAND()` na replica gere o mesmo valor que na fonte.

- `rand_seed2`

  Consulte a descrição de `rand_seed1`.

- `range_alloc_block_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O tamanho em bytes dos blocos alocados durante a otimização de intervalo.

  O tamanho do bloco para o número de bytes é de 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco menor.

- `range_optimizer_max_mem_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O limite de consumo de memória para o otimizador de intervalo. Um valor de 0 significa "sem limite". Se um plano de execução considerado pelo otimizador usar o método de acesso de intervalo, mas o otimizador estimar que a quantidade de memória necessária para esse método excederia o limite, ele abandona o plano e considera outros planos. Para mais informações, consulte Limitar o uso de memória para otimização de intervalo.

- `rbr_exec_mode`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Para uso interno por **mysqlbinlog**. Esta variável troca o servidor entre o modo `IDEMPOTENT` e o modo `STRICT`. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada nas instruções `BINLOG` geradas por **mysqlbinlog**. Este modo é útil ao reproduzir um log binário baseado em linhas em um servidor que causa conflitos com dados existentes. **mysqlbinlog** define este modo quando você especifica a opção `--idempotent` (mysqlbinlog.html#option_mysqlbinlog_idempotent) escrevendo o seguinte na saída:

  ```sql
  SET SESSION RBR_EXEC_MODE=IDEMPOTENT;
  ```

- `read_buffer_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Cada thread que realiza uma varredura sequencial em uma tabela `MyISAM` aloca um buffer desse tamanho (em bytes) para cada tabela que ele varre. Se você fizer muitas varreduras sequenciais, talvez queira aumentar esse valor, que tem o valor padrão de 131072. O valor dessa variável deve ser um múltiplo de 4KB. Se ele for definido para um valor que não é um múltiplo de 4KB, seu valor é arredondado para baixo para o próximo múltiplo de 4KB.

  Essa opção também é usada no seguinte contexto para todos os motores de armazenamento:

  - Para armazenar os índices em um arquivo temporário (não em uma tabela temporária), ao ordenar linhas para `ORDER BY`.

  - Para inserção em massa em partições.

  - Para armazenar resultados de consultas aninhadas.

  O `read_buffer_size` também é usado de outra maneira específica para um motor de armazenamento: para determinar o tamanho do bloco de memória para as tabelas `MEMORY`.

  Para obter mais informações sobre o uso da memória durante diferentes operações, consulte Seção 8.12.4.1, “Como o MySQL usa a memória”.

- `read_only`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se a variável de sistema `read_only` estiver habilitada, o servidor não permite atualizações de clientes, exceto por usuários que tenham o privilégio `SUPER`. Essa variável está desabilitada por padrão.

  O servidor também suporta uma variável de sistema `super_read_only` (desativada por padrão), que tem esses efeitos:

  - Se `super_read_only` estiver habilitado, o servidor proíbe atualizações do cliente, mesmo de usuários que tenham o privilégio `SUPER`.

  - Definir `super_read_only` para `ON` força implicitamente `read_only` para `ON`.

  - Definir `read_only` para `OFF` força implicitamente `super_read_only` para `OFF`.

  Mesmo com `read_only` ativado, o servidor permite essas operações:

  - Atualizações realizadas por threads de replicação, se o servidor for uma replica. Em configurações de replicação, pode ser útil habilitar `read_only` nos servidores replicados para garantir que as réplicas aceitem atualizações apenas do servidor de origem e não dos clientes.

  - Uso das instruções `ANALYZE TABLE` ou `OPTIMIZE TABLE`. O propósito do modo de leitura somente é impedir alterações na estrutura ou conteúdo da tabela. Análises e otimizações não são consideradas como tais alterações. Isso significa, por exemplo, que verificações de consistência em réplicas de leitura somente podem ser realizadas com **mysqlcheck** `--all-databases` `--analyze`.

  - Utilize as instruções `FLUSH STATUS`, que são sempre escritas no log binário.

  - Operações em tabelas `TEMPORARY`.

  - Insere nas tabelas de log (`mysql.general_log` e `mysql.slow_log`); veja Seção 5.4.1, “Selecionando destinos de saída do log de consultas gerais e do log de consultas lentas”.

  - A partir do MySQL 5.7.16, as atualizações nas tabelas do Gerenciador de Desempenho, como as operações de atualização (`UPDATE`) ou `TRUNCATE TABLE`, estão disponíveis.

  As alterações em `read_only` em um servidor de origem de replicação não são replicadas para os servidores de replica. O valor pode ser definido em um replica independente da configuração na origem.

  As seguintes condições se aplicam às tentativas de habilitar `read_only` (incluindo tentativas implícitas resultantes da habilitação de `super_read_only`):

  - A tentativa falha e um erro ocorre se você tiver bloqueios explícitos (adquiridos com `LOCK TABLES`) ou tiver uma transação pendente.

  - A tentativa é bloqueada enquanto outros clientes tiverem uma declaração em andamento, `LOCK TABLES WRITE` ativo ou uma transação em andamento, até que os bloqueios sejam liberados e as declarações e transações terminem. Enquanto a tentativa de habilitar `read_only` estiver pendente, os pedidos de outros clientes para bloqueios de tabelas ou para iniciar transações também são bloqueados até que `read_only` seja definido.

  - A tentativa é bloqueada se houver transações ativas que mantêm bloqueios de metadados, até que essas transações sejam concluídas.

  - O `read_only` pode ser habilitado enquanto você mantém um bloqueio de leitura global (adquirido com `FLUSH TABLES WITH READ LOCK`, pois isso não envolve bloqueios de tabela.

- `read_rnd_buffer_size`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável é usada para leituras de tabelas `MyISAM` e, para qualquer mecanismo de armazenamento, para otimização de leitura de Multi-Range.

  Ao ler linhas de uma tabela `MyISAM` em ordem classificada após uma operação de classificação por chave, as linhas são lidas através deste buffer para evitar buscas no disco. Veja Seção 8.2.1.14, “Otimização de ORDER BY”. Definir a variável para um valor grande pode melhorar muito o desempenho do `ORDER BY`. No entanto, este é um buffer alocado para cada cliente, portanto, você não deve definir a variável global para um valor grande. Em vez disso, altere a variável de sessão apenas dentro dos clientes que precisam executar consultas grandes.

  Para obter mais informações sobre o uso da memória durante diferentes operações, consulte Seção 8.12.4.1, “Como o MySQL Usa a Memória”. Para informações sobre a otimização da leitura de Multi-Range, consulte Seção 8.2.1.10, “Otimização da Leitura de Multi-Range”.

- `require_secure_transport`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se as conexões do cliente com o servidor são necessárias para usar algum tipo de transporte seguro. Quando essa variável é habilitada, o servidor permite apenas conexões TCP/IP criptografadas usando TLS/SSL, ou conexões que usam um arquivo de soquete (no Unix) ou memória compartilhada (no Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

  Essa capacidade complementa os requisitos de SSL por conta, que têm precedência. Por exemplo, se uma conta é definida com `REQUER SSL`, habilitar `require_secure_transport` não permite que a conta seja usada para se conectar usando um arquivo de socket Unix.

  É possível que um servidor não tenha nenhum transporte seguro disponível. Por exemplo, um servidor no Windows não suporta nenhum transporte seguro se for iniciado sem especificar nenhum arquivo de certificado ou chave SSL e com a variável de sistema `shared_memory` desativada. Nessas condições, as tentativas de habilitar `require_secure_transport` no momento do início fazem o servidor escrever uma mensagem no log de erro e sair. As tentativas de habilitar a variável em tempo de execução falham com um erro `ER_NO_SECURE_TRANSPORTS_CONFIGURED`.

  Veja também Configurando Conexões Encriptadas como Obrigatórias.

- `secure_auth`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Se essa variável estiver habilitada, o servidor bloqueia as conexões de clientes que tentam usar contas com senhas armazenadas no formato antigo (pré-4.1). Habilite essa variável para impedir o uso de senhas que empregam o formato antigo (e, portanto, a comunicação insegura na rede).

  Esta variável está desatualizada; espere-se que ela seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la produz um erro.

  A inicialização do servidor falha com um erro se essa variável estiver habilitada e as tabelas de privilégios estiverem no formato pré-4.1. Consulte Seção 6.4.1.3, “Migrando para fora da hashing de senhas pré-4.1 e do plugin mysql_old_password”.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 são desaconselhadas e o suporte para elas é removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql_old_password”.

- `secure_file_priv`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Essa variável é usada para limitar o efeito das operações de importação e exportação de dados, como as realizadas pelas instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e a função `LOAD_FILE()`. Essas operações são permitidas apenas para usuários que possuem o privilégio `FILE`.

  `secure_file_priv` pode ser configurado da seguinte forma:

  - Se estiver vazia, a variável não terá efeito. Esse não é um ajuste seguro.

  - Se configurado para o nome de um diretório, o servidor limita as operações de importação e exportação para trabalhar apenas com arquivos nesse diretório. O diretório deve existir; o servidor não o cria.

  - Se configurado como `NULL`, o servidor desabilita as operações de importação e exportação.

  O valor padrão é específico da plataforma e depende do valor da opção **CMake** `INSTALL_LAYOUT`, conforme mostrado na tabela a seguir. Para especificar explicitamente o valor da variável de sistema `secure_file_priv` se você estiver compilando a partir da fonte, use a opção **CMake** `INSTALL_SECURE_FILE_PRIVDIR`.

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Para definir o valor padrão de `secure_file_priv` para o servidor integrado `libmysqld`, use a opção **CMake** `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`. O valor padrão para essa opção é `NULL`.

  O servidor verifica o valor de `secure_file_priv` no momento do início e escreve uma mensagem de aviso no log de erro se o valor for inseguro. Um valor que não seja `NULL` é considerado inseguro se for vazio, ou se o valor for o diretório de dados ou um subdiretório dele, ou um diretório acessível por todos os usuários. Se `secure_file_priv` for definido para um caminho inexistente, o servidor escreve uma mensagem de erro no log de erro e sai.

- `session_track_gtids`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Controla se o servidor retorna GTIDs ao cliente, permitindo que o cliente os use para rastrear o estado do servidor. Dependendo do valor da variável, no final da execução de cada transação, os GTIDs do servidor são capturados e retornados ao cliente como parte do reconhecimento. Os valores possíveis para `session_track_gtids` são os seguintes:

  - `OFF`: O servidor não retorna GTIDs ao cliente. Este é o padrão.

  - `OWN_GTID`: O servidor retorna os GTIDs para todas as transações que foram comprometidas com sucesso por este cliente em sua sessão atual desde o último reconhecimento. Tipicamente, este é o único GTID para a última transação comprometida, mas se um único pedido de cliente resultou em várias transações, o servidor retorna um conjunto de GTIDs contendo todos os GTIDs relevantes.

  - `ALL_GTIDS`: O servidor retorna o valor global da sua variável de sistema `gtid_executed`, que ele lê em um ponto após a transação ser comprometida com sucesso. Além do GTID da transação que foi comprometida, este conjunto de GTID inclui todas as transações comprometidas no servidor por qualquer cliente e pode incluir transações comprometidas após o ponto em que a transação atualmente reconhecida foi comprometida.

  `session_track_gtids` não pode ser definido dentro de um contexto transacional.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_schema`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Controla se o servidor registra quando o esquema padrão (banco de dados) é definido na sessão atual e notifica o cliente para disponibilizar o nome do esquema.

  Se o rastreador de nomes de esquema estiver habilitado, a notificação de nome ocorrerá toda vez que o esquema padrão for definido, mesmo que o novo nome do esquema seja o mesmo do antigo.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_state_change`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Controla se o servidor acompanha as alterações no estado da sessão atual e notifica o cliente quando ocorrem alterações de estado. As alterações podem ser relatadas para esses atributos do estado da sessão do cliente:

  - O esquema padrão (banco de dados).
  - Valores específicos para sessão de variáveis do sistema.
  - Variáveis definidas pelo usuário.
  - Tabelas temporárias.
  - Declarações preparadas.

  Se o rastreador de estado de sessão estiver habilitado, uma notificação será exibida para cada alteração que envolva atributos de sessão rastreados, mesmo que os novos valores dos atributos sejam os mesmos dos antigos. Por exemplo, definir uma variável definida pelo usuário para seu valor atual resulta em uma notificação.

  A variável `session_track_state_change` controla apenas a notificação de quando as alterações ocorrem, não o que são essas alterações. Por exemplo, as notificações de alterações de estado ocorrem quando o esquema padrão é definido ou quando as variáveis de sistema de sessão são atribuídas, mas a notificação não inclui o nome do esquema ou os valores das variáveis de sistema da sessão. Para receber notificações do nome do esquema ou dos valores das variáveis de sistema da sessão, use, respectivamente, as variáveis de sistema `session_track_schema` ou `session_track_system_variables`.

  Nota

  Atribuir um valor a `session_track_state_change` em si não é considerado uma mudança de estado e não é relatada como tal. No entanto, se seu nome estiver listado no valor de `session_track_system_variables`, quaisquer atribuições a ele resultarão na notificação do novo valor.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_system_variables`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Controla se o servidor registra as atribuições às variáveis do sistema de sessão e notifica o cliente sobre o nome e o valor de cada variável atribuída. O valor da variável é uma lista de variáveis separadas por vírgula para as quais deseja-se rastrear as atribuições. Por padrão, a notificação está habilitada para `time_zone`, `autocommit`, `character_set_client`, `character_set_results` e `character_set_connection`. (Os três últimos são as variáveis afetadas por `SET NAMES`.)

  O valor especial `*` faz com que o servidor acompanhe as atribuições a todas as variáveis de sessão. Se fornecido, esse valor deve ser especificado por si mesmo, sem nomes específicos de variáveis do sistema.

  Para desativar a notificação das atribuições de variáveis de sessão, defina `session_track_system_variables` para a string vazia.

  Se a opção de rastreamento de variáveis de sessão do sistema estiver habilitada, uma notificação será enviada para todas as atribuições às variáveis de sessão rastreadas, mesmo que os novos valores sejam os mesmos dos antigos.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_transaction_info`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Controla se o servidor registra o estado e as características das transações dentro da sessão atual e notifica o cliente para disponibilizar essas informações. Esses valores de `session_track_transaction_info` são permitidos:

  - `OFF`: Desative o rastreamento do estado da transação. Isso é o padrão.

  - `ESTADO`: Ative o rastreamento do estado da transação sem o rastreamento de características. O rastreamento de estado permite que o cliente determine se uma transação está em andamento e se ela pode ser movida para uma sessão diferente sem ser revertida.

  - `CARACTERÍSTICAS`: Ative o rastreamento do estado da transação, incluindo o rastreamento de características. O rastreamento de características permite que o cliente determine como reiniciar uma transação em outra sessão, para que ela tenha as mesmas características da sessão original. As seguintes características são relevantes para esse propósito:

    ```sql
    ISOLATION LEVEL
    READ ONLY
    READ WRITE
    WITH CONSISTENT SNAPSHOT
    ```

  Para que um cliente possa transferir uma transação com segurança para outra sessão, ele deve rastrear não apenas o estado da transação, mas também suas características. Além disso, o cliente deve rastrear as variáveis de sistema `transaction_isolation` e `transaction_read_only` para determinar corretamente os padrões da sessão. (Para rastrear essas variáveis, liste-as no valor da variável de sistema `session_track_system_variables`.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

- `sha256_password_auto_generate_rsa_keys`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável está disponível se o servidor foi compilado com o OpenSSL (consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”). Ela controla se o servidor gera automaticamente os arquivos de par de chaves privadas/públicas RSA no diretório de dados, se eles ainda não existirem.

  Ao inicializar, o servidor gera automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados se a variável de sistema `sha256_password_auto_generate_rsa_keys` estiver habilitada, não forem especificadas opções RSA e os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`; veja Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

  Para obter mais informações sobre a autogeração de arquivos RSA, incluindo nomes e características dos arquivos, consulte Seção 6.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”

  A variável de sistema `auto_generate_certs` está relacionada, mas controla a autogeração de arquivos de certificado e chave SSL necessários para conexões seguras usando SSL.

- `sha256_password_private_key_path`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável está disponível se o MySQL foi compilado com o OpenSSL (consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”). Seu valor é o nome do caminho do arquivo da chave privada RSA para o plugin de autenticação `sha256_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

  Importante

  Como este arquivo armazena uma chave privada, seu modo de acesso deve ser restrito para que apenas o servidor MySQL possa lê-lo.

  Para obter informações sobre `sha256_password`, consulte Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

- `sha256_password_proxy_users`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável controla se o plugin de autenticação integrado `sha256_password` suporta usuários proxy. Ela não tem efeito a menos que a variável de sistema `check_proxy_users` esteja habilitada. Para informações sobre o proxying de usuários, consulte Seção 6.2.14, “Usuários Proxy”.

- `sha256_password_public_key_path`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  Esta variável está disponível se o MySQL foi compilado com o OpenSSL (consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”). Seu valor é o nome do caminho do arquivo de chave pública RSA para o plugin de autenticação `sha256_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM. Como este arquivo armazena uma chave pública, as cópias podem ser distribuídas livremente aos usuários do cliente. (Os clientes que especificam explicitamente uma chave pública ao se conectar ao servidor usando criptografia de senha RSA devem usar a mesma chave pública usada pelo servidor.)

  Para obter informações sobre `sha256_password`, incluindo informações sobre como os clientes especificam a chave pública RSA, consulte Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

- `shared_memory`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  (Apenas para Windows.) Se o servidor permite conexões de memória compartilhada.

- `shared_memory_base_name`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  (Apenas para Windows.) O nome da memória compartilhada a ser usado para conexões de memória compartilhada. Isso é útil ao executar múltiplas instâncias do MySQL em uma única máquina física. O nome padrão é `MYSQL`. O nome é sensível a maiúsculas e minúsculas.

  Esta variável só se aplica se o servidor for iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `show_compatibility_56`

  <table summary="Valores permitidos para a variável de sistema authentication_windows."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registrar apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informações</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>

  O `INFORMATION_SCHEMA` possui tabelas que contêm informações sobre variáveis de sistema e status (consulte Seção 24.3.11, “As tabelas GLOBAL_VARIABLES e SESSION_VARIABLES do INFORMATION_SCHEMA” e Seção 24.3.10, “As tabelas GLOBAL_STATUS e SESSION_STATUS do INFORMATION_SCHEMA”). A partir do MySQL 5.7.6, o Performance Schema também contém tabelas de variáveis de sistema e status (consulte Seção 25.12.13, “Tabelas de variáveis de sistema do Performance Schema” e Seção 25.12.14, “Tabelas de variáveis de status do Performance Schema”). As tabelas do Performance Schema são destinadas a substituir as tabelas do `INFORMATION_SCHEMA`, que são desaconselhadas a partir do MySQL 5.7.6 e serão removidas no MySQL 8.0.

  Para obter conselhos sobre a migração das tabelas do `INFORMATION_SCHEMA` para as tabelas do Performance Schema, consulte Seção 25.20, “Migração para as tabelas do Sistema e Variáveis de Estado do Performance Schema”. Para auxiliar na migração, você pode usar a variável de sistema `show_compatibility_56`, que afeta se a compatibilidade com o MySQL 5.6 está habilitada em relação à forma como as informações das variáveis de sistema e de estado são fornecidas pelas tabelas do `INFORMATION_SCHEMA` e do Performance Schema, além das instruções `SHOW VARIABLES` e `SHOW STATUS`.

  Nota

  `show_compatibility_56` está desatualizado porque seu único propósito é permitir o controle sobre fontes de informações de variáveis de sistema e status desatualizadas, que você pode esperar serem removidas em uma futura versão do MySQL. Quando essas fontes forem removidas, `show_compatibility_56` não terá mais nenhum propósito, e você pode esperar que ele também seja removido.

  A discussão a seguir descreve os efeitos de `show_compatibility_56`:

  - Visão geral do show_compatibility_56 Efeitos
  - Efeito do show_compatibility_56 nas declarações SHOW
  - Efeito do show_compatibility_56 nas tabelas do INFORMATION_SCHEMA
  - Efeito do show_compatibility_56 nas tabelas do Schema de Desempenho
  - Efeito do show_compatibility_56 nas variáveis de status do escravo
  - Efeito do show_compatibility_56 no FLUSH STATUS

  Para uma melhor compreensão, é altamente recomendado que você também leia essas seções:

  - Seção 25.12.13, "Tabelas de Variáveis de Sistema do Schema de Desempenho"
  - Seção 25.12.14, "Tabelas de Variáveis de Status do Schema de Desempenho"
  - Seção 25.12.15.10, “Tabelas de Resumo de Variáveis de Status”

  #### Visão geral do show_compatibility_56 Efeitos

  A variável de sistema `show_compatibility_56` afeta esses aspectos da operação do servidor em relação às variáveis de sistema e status:

  - Informações disponíveis nas declarações `SHOW VARIABLES` e `SHOW STATUS`

  - Informações disponíveis nas tabelas `INFORMATION_SCHEMA` que fornecem informações sobre variáveis de sistema e status

  - Informações disponíveis nas tabelas do Schema de Desempenho que fornecem informações sobre variáveis de sistema e status

  - O efeito da instrução `FLUSH STATUS` nas variáveis de status

  Esta lista resume os efeitos de `show_compatibility_56`, com detalhes adicionais fornecidos mais adiante:

  - Quando `show_compatibility_56` está ativado, a compatibilidade com o MySQL 5.6 é habilitada. As fontes de informações de variáveis mais antigas (`instruções SHOW`, tabelas `INFORMATION_SCHEMA`) produzem o mesmo resultado que no MySQL 5.6.

  - Quando `show_compatibility_56` está em `OFF`, a compatibilidade com o MySQL 5.6 é desativada. A seleção das tabelas do `INFORMATION_SCHEMA` produz um erro porque as tabelas do Performance Schema são destinadas a substituí-las. As tabelas do `INFORMATION_SCHEMA` são desaconselhadas a partir do MySQL 5.7.6 e são removidas no MySQL 8.0.

    Para obter informações sobre variáveis de sistema e status. Quando `show_compatibility_56=OFF`, use as tabelas do Performance Schema ou as instruções `SHOW`.

    Nota

    Quando `show_compatibility_56=OFF`, as instruções `SHOW VARIABLES` e `SHOW STATUS` exibem linhas das tabelas do Schema de Desempenho `global_variables`, `session_variables`, `global_status` e `session_status`.

    A partir do MySQL 5.7.9, essas tabelas são legíveis e acessíveis para todos, sem o privilégio `SELECT`, o que significa que o `SELECT` também não é necessário para usar as instruções `SHOW`. Antes do MySQL 5.7.9, o privilégio `SELECT` é necessário para acessar essas tabelas do Schema de Desempenho, seja diretamente ou indiretamente por meio das instruções `SHOW`.

  - Várias variáveis de status `Slave_xxx` estão disponíveis no `SHOW STATUS` quando `show_compatibility_56` está ativado. Quando `show_compatibility_56` está desativado, algumas dessas variáveis não são exibidas no `SHOW STATUS`. As informações que elas fornecem estão disponíveis nas tabelas do Schema de Desempenho relacionadas à replicação, conforme descrito mais adiante.

  - `show_compatibility_56` não tem efeito no acesso às variáveis do sistema usando a notação `@@`: `@@GLOBAL.var_name`, `@@SESSION.var_name`, `@@var_name`.

  - `show_compatibility_56` não tem efeito no servidor integrado, que produz saída compatível com 5.6 em todos os casos.

  As descrições a seguir detalham o efeito de definir `show_compatibility_56` para `ON` ou `OFF` nos contextos em que essa variável se aplica.

  #### Efeito do show_compatibility_56 nas declarações SHOW

  Instrução `SHOW GLOBAL VARIABLES`:

  - `ON`: Saída do MySQL 5.6.
  - `OFF`: A saída exibe as linhas da tabela do Schema de Desempenho `global_variables`.

  Instrução `SHOW [SESSION | LOCAL] VARIABLES`:

  - `ON`: Saída do MySQL 5.6.
  - `OFF`: A saída exibe as linhas da tabela do Schema de Desempenho `session_variables`. (No MySQL 5.7.6 e 5.7.7, a saída `OFF` não reflete completamente todos os valores das variáveis de sistema em vigor para a sessão atual; não inclui linhas para variáveis globais que não têm contraparte de sessão. Isso é corrigido no MySQL 5.7.8.)

  Declaração `SHOW GLOBAL STATUS`:

  - `ON`: Saída do MySQL 5.6.
  - `OFF`: A saída exibe as linhas da tabela do Schema de Desempenho `global_status`, além dos contadores de execução da instrução `Com_xxx`.

    A saída `OFF` não inclui linhas para variáveis de sessão que não têm contraparte global, ao contrário da saída `ON`.

  Declaração `SHOW [SESSION | LOCAL] STATUS`:

  - `ON`: Saída do MySQL 5.6.
  - `OFF`: A saída exibe as linhas da tabela do Schema de Desempenho `session_status`, além dos contadores de execução da instrução `Com_xxx`. (No MySQL 5.7.6 e 5.7.7, a saída `OFF` não reflete completamente todos os valores das variáveis de status em vigor para a sessão atual; não inclui linhas para variáveis globais que não têm contraparte de sessão. Isso é corrigido no MySQL 5.7.8.)

  No MySQL 5.7.6 e 5.7.7, para cada uma das instruções `SHOW` descritas acima, o uso de uma cláusula `WHERE` produz um aviso quando `show_compatibility_56=ON` e um erro quando `show_compatibility_56=OFF`. (Isso se aplica a cláusulas `WHERE` que não são otimizadas. Por exemplo, `WHERE 1` é trivialmente verdadeiro, é otimizado e, portanto, não produz aviso ou erro.) Esse comportamento não ocorre a partir do MySQL 5.7.8; `WHERE` é suportado como antes do 5.7.6.

  #### Efeito do show_compatibility_56 nas tabelas do INFORMATION_SCHEMA

  Tabelas `INFORMATION_SCHEMA` (`GLOBAL_VARIABLES`, `SESSION_VARIABLES`, `GLOBAL_STATUS` e `SESSION_STATUS`):

  - `ON`: Saída do MySQL 5.6, com um aviso de depreciação.

  - `OFF`: A seleção dessas tabelas produz um erro. (Antes da versão 5.7.9, a seleção dessas tabelas não produzia saída, com um aviso de depreciação.)

  #### Efeito do show_compatibility_56 nas tabelas do Schema de Desempenho

  Tabelas de variáveis do sistema do esquema de desempenho:

  - `OFF`:

    - `variáveis globais`: Apenas variáveis globais do sistema.

    - `variáveis_sessão`: Variáveis de sistema em vigor para a sessão atual: uma linha para cada variável de sessão e uma linha para cada variável global que não tenha uma contraparte de sessão.

    - `variables_by_thread`: Apenas variáveis do sistema de sessão, para cada sessão ativa.

  - `ON`: O mesmo resultado que para `OFF`. (Antes da versão 5.7.8, essas tabelas não produzem nenhum resultado.)

  Tabelas de variáveis de status do esquema de desempenho:

  - `OFF`:

    - `global_status`: Variáveis de status global apenas.

    - `session_status`: Variáveis de status que afetam a sessão atual: uma linha para cada variável de sessão e uma linha para cada variável global que não tenha uma contraparte na sessão.

    - `status_by_account` Apenas variáveis de status de sessão, agregadas por conta.

    - `status_by_host`: Somente variáveis de status de sessão, agregadas por nome de host.

    - `status_by_thread`: Variáveis de status de sessão apenas, para cada sessão ativa.

    - `status_by_user`: Somente variáveis de status de sessão, agregadas por nome do usuário.

    O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagem de execução de declarações globais e por sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente.

  - `ON`: O mesmo resultado que para `OFF`. (Antes da versão 5.7.9, essas tabelas não produzem nenhum resultado.)

  #### Efeito do show_compatibility_56 nas variáveis de status de escravos

  Variáveis de status de réplica:

  - `ON`: Várias variáveis de status `Slave_xxx` estão disponíveis em `SHOW STATUS` (show-status.html).

  - `OFF`: Algumas dessas variáveis de replicação não são exibidas na tabela de variáveis de status do Schema de Desempenho `SHOW STATUS` ou nas tabelas de variáveis de status do Schema de Desempenho. As informações que elas fornecem estão disponíveis nas tabelas relacionadas à replicação do Schema de Desempenho. A tabela a seguir mostra quais variáveis de status `Slave_xxx` ficam indisponíveis em `SHOW STATUS` e seus locais nas tabelas de replicação do Schema de Desempenho.

    <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  #### Efeito do show_compatibility_56 no estado de FLUSH

  Instrução `FLUSH STATUS`:

  - `ON`: Esta declaração produz o comportamento do MySQL 5.6. Ela adiciona os valores das variáveis de status de sessão do thread atual aos valores globais e redefere os valores de sessão para zero. Algumas variáveis globais também podem ser redefinidas para zero. Ela também redefere os contadores para caches de chaves (padrão e nomeados) para zero e define `Max_used_connections` para o número atual de conexões abertas.

  - `OFF`: Esta declaração adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, redefini o status de todas as sessões ativas e redefini os valores de status de conta, host e usuário agregados de sessões desconectadas.

- `show_create_table_verbosity`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  `SHOW CREATE TABLE` normalmente não exibe a opção `ROW_FORMAT` da tabela se o formato da linha for o formato padrão. Ativação desta variável faz com que `SHOW CREATE TABLE` exiba `ROW_FORMAT` independentemente de ser o formato padrão.

- `show_old_temporals`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se a saída de `SHOW CREATE TABLE` incluir comentários para marcar colunas temporais encontradas no formato anterior a 5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo), essa variável está desabilitada por padrão. Se ativada, a saída de `SHOW CREATE TABLE` ficará assim:

  ```sql
  CREATE TABLE `mytbl` (
    `ts` timestamp /* 5.5 binary format */ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt` datetime /* 5.5 binary format */ DEFAULT NULL,
    `t` time /* 5.5 binary format */ DEFAULT NULL
  ) DEFAULT CHARSET=latin1
  ```

  A saída para a coluna `COLUMN_TYPE` da tabela do esquema de informações `COLUMNS` é afetada de maneira semelhante.

  Essa variável está desatualizada; espere que ela seja removida em uma futura versão do MySQL.

- `skip_external_locking`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta opção está desativada se o **mysqld** usar o bloqueio externo (bloqueio do sistema), e ativada se o bloqueio externo estiver desativado. Isso afeta apenas o acesso à tabela `**MyISAM**`.

  Essa variável é definida pela opção `--external-locking` ou `--skip-external-locking`. O bloqueio externo é desativado por padrão.

  O bloqueio externo afeta apenas o acesso à tabela \`MyISAM. Para obter mais informações, incluindo as condições em que ele pode e não pode ser usado, consulte Seção 8.11.5, “Bloqueio Externo”.

- `skip_name_resolve`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se resolver nomes de host ao verificar conexões de clientes. Se essa variável for `OFF`, o **mysqld** resolve nomes de host ao verificar conexões de clientes. Se for `ON`, o **mysqld** usa apenas números de IP; nesse caso, todos os valores da coluna `Host` nas tabelas de concessão devem ser endereços IP. Veja Seção 5.1.11.2, “Consultas DNS e Cache de Host”.

  Dependendo da configuração da rede do seu sistema e dos valores de `Host` das suas contas, os clientes podem precisar se conectar usando uma opção explícita `--host`, como `--host=127.0.0.1` ou `--host=::1`.

  Uma tentativa de conexão com o host `127.0.0.1` normalmente resolve para a conta `localhost`. No entanto, isso falha se o servidor for executado com o `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que existe uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

  ```sql
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

- `skip_networking`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável controla se o servidor permite conexões TCP/IP. Por padrão, ela está desabilitada (permitir conexões TCP). Se habilitada, o servidor permite apenas conexões locais (não TCP/IP) e toda interação com **mysqld** deve ser feita usando tubos nomeados ou memória compartilhada (no Windows) ou arquivos de soquetes Unix (no Unix). Esta opção é altamente recomendada para sistemas onde apenas clientes locais são permitidos. Veja Seção 5.1.11.2, “Consultas DNS e Cache de Anfitriões”.

- `skip_show_database`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Isso impede que as pessoas usem a instrução `SHOW DATABASES` se não tiverem o privilégio `SHOW DATABASES`. Isso pode melhorar a segurança se você tiver preocupações sobre os usuários poderem ver bancos de dados pertencentes a outros usuários. Seu efeito depende do privilégio `SHOW DATABASES`: Se o valor da variável for `ON`, a instrução `SHOW DATABASES` só é permitida para usuários que têm o privilégio `SHOW DATABASES`, e a instrução exibe todos os nomes dos bancos de dados. Se o valor for `OFF`, a instrução `SHOW DATABASES` é permitida para todos os usuários, mas exibe os nomes apenas dos bancos de dados para os quais o usuário tem o privilégio `SHOW DATABASES` ou outro privilégio.

  Cuidado

  Como um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de bases de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

- `slow_launch_time`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se a criação de um thread levar mais tempo do que esse número de segundos, o servidor incrementa a variável de status `Slow_launch_threads`.

- `slow_query_log`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se o registro de consultas lentas está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o registro ou 1 (ou `ON`) para habilitar o registro. O destino da saída do log é controlado pela variável de sistema `log_output`; se esse valor for `NONE`, nenhuma entrada de log será escrita, mesmo que o log esteja habilitado.

  O termo “lento” é determinado pelo valor da variável `long_query_time`. Veja a Seção 5.4.5, “O Log de Consultas Lentas”.

- `slow_query_log_file`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nome do arquivo de registro de consultas lentas. O valor padrão é `host_name-slow.log`, mas o valor inicial pode ser alterado com a opção `--slow_query_log_file`.

- `socket`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Em plataformas Unix, essa variável é o nome do arquivo de soquete usado para conexões locais do cliente. O padrão é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

  No Windows, essa variável é o nome do tubo nomeado que é usado para conexões de clientes locais. O valor padrão é `MySQL` (não case-sensitive).

- `sort_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Cada sessão que precisa realizar uma ordenação aloca um buffer desse tamanho. `sort_buffer_size` não é específico de nenhum motor de armazenamento e é aplicado de maneira geral para otimização. No mínimo, o valor de `sort_buffer_size` deve ser grande o suficiente para acomodar quinze tuplas no buffer de ordenação. Além disso, o aumento do valor de `max_sort_length` pode exigir o aumento do valor de `sort_buffer_size`. Para mais informações, consulte Seção 8.2.1.14, “Otimização de ORDER BY”

  Se você ver muitos `Sort_merge_passes` por segundo na saída do `SHOW GLOBAL STATUS`, você pode considerar aumentar o valor de `sort_buffer_size` para acelerar as operações `ORDER BY` ou `GROUP BY` que não podem ser melhoradas com otimização de consulta ou indexação aprimorada.

  O otimizador tenta descobrir quanto espaço é necessário, mas pode alocar mais, até o limite. Definir um valor maior do que o necessário globalmente desacelera a maioria das consultas de ordenação. É melhor aumentá-lo como um ajuste de sessão e apenas para as sessões que precisam de um tamanho maior. No Linux, existem limiares de 256KB e 2MB, onde valores maiores podem desacelerar significativamente a alocação de memória, então você deve considerar ficar abaixo de um desses valores. Experimente para encontrar o melhor valor para sua carga de trabalho. Veja Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”.

  O valor máximo permitido para `sort_buffer_size` é 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto o Windows de 64 bits, para o qual valores grandes são truncados para 4GB−1 com uma mensagem de aviso).

- `sql_auto_is_null`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se essa variável estiver habilitada, após uma instrução que insere com sucesso um valor `AUTO_INCREMENT` gerado automaticamente, você poderá encontrar esse valor executando uma instrução do seguinte formato:

  ```sql
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  Se a declaração retornar uma linha, o valor retornado será o mesmo se você invocasse a função `LAST_INSERT_ID()`. Para obter detalhes, incluindo o valor de retorno após uma inserção de várias linhas, consulte Seção 12.15, “Funções de Informação”. Se nenhum valor de `AUTO_INCREMENT` foi inserido com sucesso, a declaração `SELECT` retorna nenhuma linha.

  O comportamento de recuperar um valor `AUTO_INCREMENT` usando uma comparação com `IS NULL` é utilizado por alguns programas ODBC, como o Access. Veja Obtendo Valores de Auto-Incremento. Esse comportamento pode ser desativado definindo `sql_auto_is_null` para `OFF`.

  O valor padrão de `sql_auto_is_null` é `OFF`.

- `sql_big_selects`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se configurado para `OFF`, o MySQL interrompe as instruções `SELECT` que provavelmente levarão muito tempo para serem executadas (ou seja, instruções para as quais o otimizador estima que o número de linhas examinadas exceda o valor de `max_join_size`). Isso é útil quando uma instrução `WHERE` desaconselhável foi emitida. O valor padrão para uma nova conexão é `ON`, que permite todas as instruções `SELECT`.

  Se você definir a variável de sistema `max_join_size` para um valor diferente de `DEFAULT`, `sql_big_selects` será definido como `OFF`.

- `sql_buffer_result`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se ativado, `sql_buffer_result` obriga os resultados das instruções `SELECT` a serem colocados em tabelas temporárias. Isso ajuda o MySQL a liberar os bloqueios da tabela mais cedo e pode ser benéfico em casos em que leva muito tempo para enviar os resultados ao cliente. O valor padrão é `OFF`.

- `sql_log_off`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável controla se o registro no log de consultas gerais é desativado para a sessão atual (assumindo que o próprio log de consultas gerais esteja habilitado). O valor padrão é `OFF` (ou seja, habilite o registro). Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável da sessão `sql_log_off` para `ON` ou `OFF`.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

- `sql_mode`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O modo SQL do servidor atual, que pode ser definido dinamicamente. Para mais detalhes, consulte Seção 5.1.10, “Modos SQL do Servidor”.

  Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação. Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê ao iniciar.

- `sql_notes`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se ativado (padrão), os diagnósticos de nível `Note` incrementam `warning_count` e o servidor os registra. Se desativado, os diagnósticos de nível `Note` não incrementam `warning_count` e o servidor não os registra. **mysqldump** inclui a saída para desabilitar essa variável, para que a recarga do arquivo de dump não produza avisos para eventos que não afetam a integridade da operação de recarga.

- `sql_quote_show_create`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se habilitado (padrão), o servidor cita identificadores para as instruções `SHOW CREATE TABLE` (show-create-table.html) e `SHOW CREATE DATABASE` (show-create-database.html). Se desabilitado, a citação é desativada. Esta opção é habilitada por padrão para que a replicação funcione para identificadores que exigem citação. Veja Seção 13.7.5.10, “Instrução SHOW CREATE TABLE” e Seção 13.7.5.6, “Instrução SHOW CREATE DATABASE”.

- `sql_safe_updates`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se essa variável estiver habilitada, as instruções `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou na cláusula `LIMIT` produzem um erro. Isso permite capturar instruções `UPDATE` e `DELETE` em que as chaves não são usadas corretamente e que provavelmente alterariam ou excluiriam um grande número de linhas. O valor padrão é `OFF`.

  Para o cliente **mysql**, o `sql_safe_updates` pode ser habilitado usando a opção `--safe-updates`. Para mais informações, consulte Usando o modo de atualizações seguras (--safe-updates.

- `sql_select_limit`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número máximo de linhas a serem retornadas a partir das instruções `SELECT`. Para mais informações, consulte Usando o modo Safe-Updates (--safe-updates.

  O valor padrão para uma nova conexão é o número máximo de linhas que o servidor permite por tabela. Os valores padrão típicos são (232)−1 ou (264)−1. Se você alterou o limite, o valor padrão pode ser restaurado atribuindo um valor de `DEFAULT`.

  Se uma consulta `SELECT` tiver uma cláusula `LIMIT`, a cláusula `LIMIT` terá precedência sobre o valor de `sql_select_limit`.

- `sql_warnings`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável controla se as instruções de inserção de uma única linha (`INSERT` - insert.html) produzem uma string de informações se ocorrerem avisos. O valor padrão é `OFF`. Defina o valor para `ON` para produzir uma string de informações.

- `ssl_ca`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

- `ssl_capath`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nome do caminho do diretório que contém os arquivos de certificado da Autoridade de Certificação SSL (CA) confiável no formato PEM. Você deve executar o `rehash` do OpenSSL no diretório especificado por esta opção antes de usá-lo. Em sistemas Linux, você pode invocar o `rehash` da seguinte maneira:

  ```sql
  $> openssl rehash path/to/directory
  ```

  Nas plataformas Windows, você pode usar o script `c_rehash` em um prompt de comando, da seguinte maneira:

  ```sql
  \> c_rehash path/to/directory
  ```

  Consulte [openssl-rehash](https://docs.openssl.org/3.1/man1/openssl-rehash.1.html) para obter a sintaxe completa e outras informações.

  O suporte para essa capacidade depende da biblioteca SSL usada para compilar o MySQL; consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

- `ssl_cert`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado de chave pública SSL do servidor no formato PEM.

  Se o servidor for iniciado com `ssl_cert` definido para um certificado que utiliza qualquer cifra ou categoria de cifra restrita, o servidor será iniciado com o suporte para conexões criptografadas desativado. Para obter informações sobre as restrições de cifra, consulte Configuração de cifra de conexão.

- `ssl_cipher`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  A lista de cifra permitida para a criptografia da conexão. Se nenhuma cifra na lista for suportada, as conexões criptografadas não funcionarão.

  Para maior portabilidade, a lista de cifra deve ser uma lista de um ou mais nomes de cifra, separados por dois pontos (:). Esse formato é compreendido tanto pelo OpenSSL quanto pelo yaSSL. O exemplo a seguir mostra dois nomes de cifra separados por dois pontos:

  ```sql
  [mysqld]
  ssl_cipher="DHE-RSA-AES128-GCM-SHA256:AES128-SHA"
  ```

  O OpenSSL suporta uma sintaxe mais flexível para especificar cifra, conforme descrito na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/openssl-ciphers.html>. O yaSSL não suporta essa sintaxe estendida, portanto, as tentativas de usar essa sintaxe estendida falham para uma distribuição do MySQL compilada com o yaSSL.

  Para obter informações sobre os criptogramas de codificação que o MySQL suporta, consulte Seção 6.3.2, “Protocolos e criptogramas de conexão TLS criptografados”.

- `ssl_crl`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nome do caminho do arquivo que contém as listas de revogação de certificados no formato PEM. O suporte para a capacidade de listas de revogação depende da biblioteca SSL usada para compilar o MySQL. Consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

- `ssl_crlpath`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O caminho do diretório que contém arquivos da lista de revogação de certificados no formato PEM. O suporte para a capacidade de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

- `ssl_key`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nome do caminho do arquivo de chave privada SSL do servidor no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

  Se o arquivo de chave estiver protegido por uma senha, o servidor solicita ao usuário a senha. A senha deve ser fornecida interativamente; ela não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não conseguisse ler a chave.

- `cache de programas armazenados`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Define um limite superior suave para o número de rotinas armazenadas em cache por conexão. O valor desta variável é especificado em termos do número de rotinas armazenadas mantidas em cada um dos dois caches mantidos pelo MySQL Server para procedimentos armazenados e funções armazenadas, respectivamente.

  Sempre que uma rotina armazenada é executada, esse tamanho de cache é verificado antes da primeira ou da declaração de nível superior na rotina ser analisada; se o número de rotinas do mesmo tipo (procedimentos armazenados ou funções armazenadas, dependendo de qual está sendo executada) exceder o limite especificado por essa variável, o cache correspondente é esvaziado e a memória previamente alocada para objetos armazenados é liberada. Isso permite que o cache seja esvaziado com segurança, mesmo quando há dependências entre rotinas armazenadas.

- `super_read_only`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se a variável de sistema `read_only` estiver habilitada, o servidor não permite atualizações de clientes, exceto por usuários que tenham o privilégio `SUPER`. Se a variável de sistema `super_read_only` também estiver habilitada, o servidor proíbe atualizações de clientes, mesmo por usuários que tenham o privilégio `SUPER`. Consulte a descrição da variável de sistema `read_only` para obter uma descrição do modo de leitura apenas e informações sobre como `read_only` e `super_read_only` interagem.

  As atualizações do cliente prevenidas quando o `super_read_only` está habilitado incluem operações que nem sempre parecem ser atualizações, como `CREATE FUNCTION` (para instalar uma função carregável) e `INSTALL PLUGIN`. Essas operações são proibidas porque envolvem alterações em tabelas no banco de dados do sistema `mysql`.

  As alterações em `super_read_only` em um servidor de origem de replicação não são replicadas para os servidores de replica. O valor pode ser definido em um replica independente da configuração na origem.

- `sync_frm`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se essa variável estiver definida como 1, quando qualquer tabela não temporária for criada, seu arquivo `.frm` será sincronizado com o disco (usando `fdatasync()`). Isso é mais lento, mas mais seguro em caso de falha. O padrão é 1.

  Essa variável é desaconselhada no MySQL 5.7 e será removida no MySQL 8.0 (quando os arquivos `.frm` se tornarem obsoletos).

- `system_time_zone`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O fuso horário do sistema do servidor. Quando o servidor começa a ser executado, ele herda um ajuste do fuso horário das configurações padrão da máquina, possivelmente modificado pelo ambiente da conta usada para executar o servidor ou pelo script de inicialização. O valor é usado para definir `system_time_zone`. Para especificar explicitamente o fuso horário do sistema, defina a variável de ambiente `TZ` ou use a opção `--timezone` do script **mysqld_safe** **mysqld_safe**.

  A variável `system_time_zone` difere da variável `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”.

- `cache de definição de tabela`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número de definições de tabela (de arquivos `.frm`) que podem ser armazenadas no cache de definição de tabela. Se você usar um grande número de tabelas, pode criar um cache de definição de tabela grande para acelerar a abertura das tabelas. O cache de definição de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache normal de tabela. O valor mínimo é 400. O valor padrão é baseado na seguinte fórmula, limitada a um limite de 2000:

  ```sql
  400 + (table_open_cache / 2)
  ```

  Para o `InnoDB`, o ajuste `table_definition_cache` atua como um limite suave para o número de instâncias de tabela no cache do dicionário de dados do `InnoDB` e o número de espaços de tabela por arquivo que podem ser abertos de uma só vez.

  Se o número de instâncias de tabela no cache do dicionário de dados do `InnoDB` exceder o limite de `table_definition_cache`, um mecanismo LRU começa a marcar as instâncias de tabela para remoção e, eventualmente, as remove do cache do dicionário de dados do InnoDB. O número de tabelas abertas com metadados armazenados em cache pode ser maior que o limite de `table_definition_cache` devido às instâncias de tabela com relações de chave estrangeira, que não são colocadas na lista LRU.

  O número de espaços de tabela por arquivo que podem ser abertos de uma só vez é limitado tanto pelas configurações de `table_definition_cache` quanto por `innodb_open_files`. Se ambas as variáveis estiverem definidas, a configuração mais alta é usada. Se nenhuma das variáveis estiver definida, a configuração de `table_definition_cache`, que tem um valor padrão mais alto, é usada. Se o número de espaços de tabela abertos exceder o limite definido por `table_definition_cache` ou `innodb_open_files`, um mecanismo LRU (Least Recently Used) busca os arquivos de espaços de tabela na lista LRU que estão completamente descarregados e atualmente não estão sendo estendidos. Esse processo é realizado cada vez que um novo espaço de tabela é aberto. Apenas os espaços de tabela inativos são fechados.

- `cache_de_abertura_da_tabela`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número de tabelas abertas para todos os threads. Aumentar esse valor aumenta o número de descritores de arquivo que o **mysqld** requer. O valor efetivo dessa variável é o maior entre o valor efetivo de `open_files_limit` `- 10 -` o valor efetivo de `max_connections` `/ 2`, e 400; ou seja

  ```sql
  MAX(
      (open_files_limit - 10 - max_connections) / 2,
      400
     )
  ```

  Você pode verificar se precisa aumentar o cache de tabelas verificando a variável de status `Opened_tables`. Se o valor de `Opened_tables` for grande e você não usar `FLUSH TABLES` com frequência (o que força todas as tabelas a serem fechadas e reabertas), então você deve aumentar o valor da variável `table_open_cache`. Para obter mais informações sobre o cache de tabelas, consulte Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tabelas”.

- `table_open_cache_instances`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Número de instâncias de cache de tabelas abertas. Para melhorar a escalabilidade, reduzindo a concorrência entre as sessões, o cache de tabelas abertas pode ser dividido em várias instâncias menores de tamanho `table_open_cache` / `table_open_cache_instances`. Uma sessão precisa bloquear apenas uma instância para acessá-la para instruções DML. Isso segmenta o acesso ao cache entre as instâncias, permitindo um desempenho maior para operações que usam o cache quando há muitas sessões acessando tabelas. (As instruções DDL ainda requerem um bloqueio em todo o cache, mas essas instruções são muito menos frequentes do que as instruções DML.)

  Um valor de 8 ou 16 é recomendado em sistemas que utilizam rotineiramente 16 ou mais núcleos. No entanto, se você tiver muitos gatilhos grandes em suas tabelas que causam um alto consumo de memória, o ajuste padrão para `table_open_cache_instances` pode levar a um uso excessivo de memória. Nessa situação, pode ser útil definir `table_open_cache_instances` para 1 para restringir o uso de memória.

- `thread_cache_size`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Quantos fios o servidor deve armazenar para reutilização. Quando um cliente se desconecta, os fios do cliente são colocados na cache se houver menos de `thread_cache_size` fios. As solicitações de fios são atendidas reutilizando fios da cache, se possível, e apenas quando a cache estiver vazia, um novo thread é criado. Essa variável pode ser aumentada para melhorar o desempenho se você tiver muitas novas conexões. Normalmente, isso não proporciona uma melhoria notável no desempenho se você tiver uma boa implementação de fios. No entanto, se o seu servidor receber centenas de conexões por segundo, você deve definir `thread_cache_size` o suficiente para que a maioria das novas conexões use fios armazenados na cache. Ao examinar a diferença entre as variáveis de status `Connections` e `Threads_created`, você pode ver quão eficiente é a cache de fios. Para detalhes, consulte Seção 5.1.9, “Variáveis de Status do Servidor”.

  O valor padrão é baseado na seguinte fórmula, limitada a um limite de 100:

  ```sql
  8 + (max_connections / 100)
  ```

  Essa variável não tem efeito no servidor integrado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não é mais visível no servidor integrado.

- `thread_handling`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O modelo de manipulação de threads usado pelo servidor para threads de conexão. Os valores permitidos são `no-threads` (o servidor usa um único thread para lidar com uma conexão), `one-thread-per-connection` (o servidor usa um único thread para lidar com cada conexão de cliente) e `loaded-dynamically` (definido pelo plugin do pool de threads ao ser inicializado). `no-threads` é útil para depuração no Linux; veja Seção 5.8, “Depuração do MySQL”.

  Essa variável não tem efeito no servidor integrado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não é mais visível no servidor integrado.

- `thread_pool_algorithm`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável controla qual algoritmo o plugin de pool de threads utiliza:

  - Um valor de 0 (o padrão) utiliza um algoritmo conservador de baixa concorrência, que é o mais bem testado e é conhecido por produzir resultados muito bons.

  - Um valor de 1 aumenta a concorrência e utiliza um algoritmo mais agressivo, que, por vezes, tem sido conhecido por apresentar um desempenho 5–10% melhor em contagem ótima de threads, mas apresenta um desempenho degradante à medida que o número de conexões aumenta. Seu uso deve ser considerado experimental e não é suportado.

  Esta variável está disponível apenas se o plugin de pilha de threads estiver habilitado. Consulte Seção 5.5.3, "Pilha de Threads do MySQL Enterprise".

- `thread_pool_high_priority_connection`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável afeta a fila de espera de novas declarações antes da execução. Se o valor for 0 (falso, o padrão), a fila de espera de declarações usa as filas de baixa e alta prioridade. Se o valor for 1 (verdadeiro), as declarações em fila sempre vão para a fila de alta prioridade.

  Esta variável está disponível apenas se o plugin de pilha de threads estiver habilitado. Consulte Seção 5.5.3, "Pilha de Threads do MySQL Enterprise".

- `thread_pool_max_unused_threads`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número máximo permitido de threads não utilizadas na pilha de threads. Esta variável permite limitar a quantidade de memória usada por threads em estado de espera.

  Um valor de 0 (o padrão) significa que não há limite no número de threads em espera. Um valor de *`N`* onde *`N`* é maior que 0 significa 1 thread consumidor e *`N`−1* threads de reserva. Nesse caso, se uma thread estiver pronta para dormir, mas o número de threads em espera já estiver no máximo, a thread sai em vez de dormir.

  Um thread de sono está dormindo como um thread de consumo ou um thread de reserva. O pool de fios permite que um thread seja o thread de consumo quando estiver dormindo. Se um thread for colocado em sono e não houver um thread de consumo existente, ele dormirá como um thread de consumo. Quando um thread precisa ser acordado, um thread de consumo é selecionado, se houver um. Um thread de reserva é selecionado apenas quando não houver um thread de consumo para ser acordado.

  Esta variável está disponível apenas se o plugin de pilha de threads estiver habilitado. Consulte Seção 5.5.3, "Pilha de Threads do MySQL Enterprise".

- `thread_pool_prio_kickup_timer`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável afeta as instruções que estão aguardando execução na fila de baixa prioridade. O valor é o número de milissegundos antes que uma instrução em espera seja movida para a fila de alta prioridade. O valor padrão é 1000 (1 segundo).

  Esta variável está disponível apenas se o plugin de pilha de threads estiver habilitado. Consulte Seção 5.5.3, "Pilha de Threads do MySQL Enterprise".

- `thread_pool_size`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads. Ele afeta quantos comandos podem ser executados simultaneamente. Se um valor fora do intervalo de valores permitidos for especificado, o plugin do pool de threads não é carregado e o servidor escreve uma mensagem no log de erro.

  Esta variável está disponível apenas se o plugin de pilha de threads estiver habilitado. Consulte Seção 5.5.3, "Pilha de Threads do MySQL Enterprise".

- `thread_pool_stall_limit`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável afeta a execução de instruções. O valor é o tempo que uma instrução tem para terminar após começar a ser executada antes de ser definida como travada, momento em que o grupo de threads permite que o grupo de threads comece a executar outra instrução. O valor é medido em unidades de 10 milissegundos, então o valor padrão de 6 significa 60ms. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas novas instruções enquanto as atuais estão sendo executadas.

  Esta variável está disponível apenas se o plugin de pilha de threads estiver habilitado. Consulte Seção 5.5.3, "Pilha de Threads do MySQL Enterprise".

- `thread_stack`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O tamanho da pilha para cada thread. O padrão é suficiente para o funcionamento normal. Se o tamanho da pilha da thread for muito pequeno, isso limita a complexidade das instruções SQL que o servidor pode manipular, a profundidade de recursividade de procedimentos armazenados e outras ações que consomem memória.

- `time_format`

  Esta variável não é usada. Ela está desatualizada e será removida no MySQL 8.0.

- `time_zone`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O fuso horário atual. Esta variável é usada para inicializar o fuso horário para cada cliente que se conecta. Por padrão, o valor inicial desta é `'SYSTEM'` (o que significa, “use o valor de `system_time_zone`). O valor pode ser especificado explicitamente na inicialização do servidor com a opção `--default-time-zone`. Veja Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

  Nota

  Se configurado como `SYSTEM`, cada chamada de função do MySQL que requer um cálculo de fuso horário faz uma chamada à biblioteca do sistema para determinar o fuso horário do sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em concorrência.

- `timestamp`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Defina o horário para este cliente. Isso é usado para obter o timestamp original se você usar o log binário para restaurar linhas. *`timestamp_value`* deve ser um timestamp do epoch Unix (um valor como o retornado por `UNIX_TIMESTAMP()`, não um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou `DEFAULT`).

  Definir `timestamp` para um valor constante faz com que ele retorne esse valor até que seja alterado novamente. Definir `timestamp` para `DEFAULT` faz com que seu valor seja a data e hora atuais na data em que é acessado. O valor máximo corresponde a `'2038-01-19 03:14:07'` UTC, o mesmo que para o tipo de dados `TIMESTAMP`.

  `timestamp` é um `DOUBLE` em vez de `BIGINT` porque seu valor inclui uma parte em microsegundos.

  `SET timestamp` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de marcação de tempo no log binário não têm efeito nas invocações de `SYSDATE()`. O servidor pode ser iniciado com a opção `--sysdate-is-now` (server-options.html#option_mysqld_sysdate-is-now) para fazer com que `SYSDATE()` seja sinônimo de `NOW()`, caso em que `SET timestamp` afeta ambas as funções.

- `tls_version`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Quais protocolos o servidor permite para conexões criptografadas. O valor é uma lista separada por vírgula contendo uma ou mais versões de protocolo. Os protocolos que podem ser nomeados para essa variável dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Para detalhes, consulte Seção 6.3.2, "Protocolos e cifra TLS de Conexão Criptografada".

  Nota

  A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são desatualizados e o suporte a eles está sujeito à remoção em uma versão futura do MySQL. Consulte Protocolos TLS Desatualizados.

  Definir essa variável para uma string vazia desativa as conexões criptografadas.

- `tmp_table_size`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O tamanho máximo de tabelas temporárias internas de memória. Esta variável não se aplica a tabelas `MEMORY` criadas pelo usuário.

  O limite real é o menor entre `tmp_table_size` e `max_heap_table_size`. Quando uma tabela temporária em memória excede o limite, o MySQL a converte automaticamente para uma tabela temporária em disco. A opção `internal_tmp_disk_storage_engine` define o mecanismo de armazenamento usado para tabelas temporárias em disco.

  Aumente o valor de `tmp_table_size` (e `max_heap_table_size` se necessário) se você fizer muitas consultas avançadas de `GROUP BY` e tiver muita memória.

  Você pode comparar o número de tabelas temporárias internas criadas no disco com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Veja também Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `tmpdir`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é muito pequena para armazenar tabelas temporárias. Essa variável pode ser definida como uma lista de vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por colchetes (`:`) no Unix e por pontos e vírgulas (`;`) no Windows.

  `tmpdir` pode ser uma localização não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica e você estiver usando uma localização não permanente para `tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável `slave_load_tmpdir`. Para uma replica, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então, com uma localização permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

  Para obter mais informações sobre o local de armazenamento de arquivos temporários, consulte Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

- `transaction_alloc_block_size`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O valor em bytes pelo qual aumentar o pool de memória por transação que precisa de memória. Veja a descrição de `transaction_prealloc_size`.

- `transaction_isolation`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nível de isolamento de transação. O padrão é `REPEATABLE-READ`.

  O nível de isolamento de transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de nível de isolamento não padrão, conforme descrito mais adiante.

  Para definir o nível de isolamento de transação global ao iniciar, use a opção de servidor `--transaction-isolation`.

  Durante a execução, o nível de isolamento pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável de sistema `transaction_isolation`, ou indiretamente usando a instrução `SET TRANSACTION`. Se você definir `transaction_isolation` diretamente para um nome de nível de isolamento que contenha um espaço, o nome deve ser colocado entre aspas, com o espaço substituído por uma barra. Por exemplo, use esta instrução `SET` para definir o valor global:

  ```sql
  SET GLOBAL transaction_isolation = 'READ-COMMITTED';
  ```

  Definir o valor global de `transaction_isolation` define o nível de isolamento para todas as sessões subsequentes. As sessões existentes não são afetadas.

  Para definir o valor da sessão ou do nível seguinte de `transaction_isolation`, use a instrução `SET`. Para a maioria das variáveis de sistema de sessão, essas instruções são maneiras equivalentes de definir o valor:

  ```sql
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

  Como mencionado anteriormente, o nível de isolamento de transação tem um escopo de próxima transação, além dos escopos global e de sessão. Para habilitar o escopo de próxima transação, a sintaxe de atribuição de valores de variáveis de sistema de sessão, `SET`, tem uma semântica não padrão para `transaction_isolation`:

  - Para definir o nível de isolamento de sessão, use qualquer uma dessas sintaxes:

    ```sql
    SET @@SESSION.transaction_isolation = value;
    SET SESSION transaction_isolation = value;
    SET transaction_isolation = value;
    ```

    Para cada uma dessas sintáticas, essas semânticas se aplicam:

    - Define o nível de isolamento para todas as transações subsequentes realizadas durante a sessão.

    - Permitido dentro das transações, mas não afeta a transação em andamento atual.

    - Se executado entre transações, substitui qualquer declaração anterior que defina o nível de isolamento da próxima transação.

    - Correspondente a `SET SESSION TRANSACTION ISOLATION LEVEL` (com a palavra-chave `SESSION`).

  - Para definir o nível de isolamento da próxima transação, use a seguinte sintaxe:

    ```sql
    SET @@transaction_isolation = value;
    ```

    Para essa sintaxe, essas semânticas se aplicam:

    - Define o nível de isolamento apenas para a próxima transação única realizada dentro da sessão.

    - As transações subsequentes retornam ao nível de isolamento de sessão.

    - Não é permitido dentro das transações.

    - Correspondente a `SET TRANSACTION ISOLATION LEVEL` (sem a palavra-chave `SESSION`).

  Para obter mais informações sobre `SET TRANSACTION` e sua relação com a variável de sistema `transaction_isolation`, consulte Seção 13.3.6, “Instrução SET TRANSACTION”.

  Nota

  `transaction_isolation` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_isolation`, que agora está desatualizado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_isolation` em vez de `tx_isolation`.

- `transaction_prealloc_size`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Existe um pool de memória por transação a partir do qual várias alocações relacionadas à transação pegam memória. O tamanho inicial do pool em bytes é `transaction_prealloc_size`. Para cada alocação que não pode ser atendida a partir do pool porque não há memória disponível suficiente, o pool é aumentado em [`transaction_alloc_block_size`]\(server-system-variables.html#sysvar_transaction_alloc_block_size] bytes. Quando a transação termina, o pool é truncado para [`transaction_prealloc_size`]\(server-system-variables.html#sysvar_transaction_prealloc_size] bytes.

  Ao definir `transaction_prealloc_size` suficientemente grande para conter todas as instruções em uma única transação, você pode evitar muitas chamadas do `malloc()`.

- `transaction_read_only`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O modo de acesso à transação. O valor pode ser `OFF` (leitura/escrita; o padrão) ou `ON` (somente leitura).

  O modo de acesso à transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de modo de acesso não padrão, conforme descrito mais adiante.

  Para definir o modo de acesso de transações global ao iniciar, use a opção de servidor `--transaction-read-only`.

  Durante a execução, o modo de acesso pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável de sistema `transaction_read_only`, ou indiretamente usando a instrução `SET TRANSACTION`. Por exemplo, use esta instrução `SET` para definir o valor global:

  ```sql
  SET GLOBAL transaction_read_only = ON;
  ```

  Definir o valor global `transaction_read_only` define o modo de acesso para todas as sessões subsequentes. As sessões existentes não são afetadas.

  Para definir o valor da sessão ou do nível seguinte de `transaction_read_only`, use a instrução `SET`. Para a maioria das variáveis de sistema de sessão, essas instruções são maneiras equivalentes de definir o valor:

  ```sql
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

  Como mencionado anteriormente, o modo de acesso à transação tem um escopo de próxima transação, além dos escopos global e de sessão. Para habilitar o escopo de próxima transação, a sintaxe de atribuição de valores de variáveis do sistema de sessão, `SET`, tem uma semântica não padrão para `transaction_read_only`,

  - Para definir o modo de acesso à sessão, use qualquer uma dessas sintaxes:

    ```sql
    SET @@SESSION.transaction_read_only = value;
    SET SESSION transaction_read_only = value;
    SET transaction_read_only = value;
    ```

    Para cada uma dessas sintáticas, essas semânticas se aplicam:

    - Define o modo de acesso para todas as transações subsequentes realizadas durante a sessão.

    - Permitido dentro das transações, mas não afeta a transação em andamento atual.

    - Se executado entre transações, substitui qualquer declaração anterior que defina o modo de acesso da próxima transação.

    - Correspondente a `SET SESSION TRANSACTION {READ WRITE | READ ONLY}` (com a palavra-chave `SESSION`).

  - Para definir o modo de acesso da próxima transação, use a seguinte sintaxe:

    ```sql
    SET @@transaction_read_only = value;
    ```

    Para essa sintaxe, essas semânticas se aplicam:

    - Define o modo de acesso apenas para a próxima transação única realizada dentro da sessão.

    - As transações subsequentes retornam ao modo de acesso à sessão.

    - Não é permitido dentro das transações.

    - Correspondente a `SET TRANSACTION {READ WRITE | READ ONLY}` (sem a palavra-chave `SESSION`).

  Para obter mais informações sobre `SET TRANSACTION` e sua relação com a variável de sistema `transaction_read_only`, consulte Seção 13.3.6, “Instrução SET TRANSACTION”.

  Nota

  `transaction_read_only` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_read_only`, que agora está desatualizado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_read_only` em vez de `tx_read_only`.

- `tx_isolation`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O nível de isolamento de transação padrão. Definiu como `REPEATABLE-READ`.

  Nota

  `transaction_isolation` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_isolation`, que agora está desatualizado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_isolation` em vez de `tx_isolation`. Consulte a descrição de `transaction_isolation` para obter detalhes.

- `tx_read_only`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O modo de acesso padrão à transação. O valor pode ser `OFF` (leitura/escrita, o padrão) ou `ON` (somente leitura).

  Nota

  `transaction_read_only` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_read_only`, que agora está desatualizado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_read_only` em vez de `tx_read_only`. Veja a descrição de `transaction_read_only` para obter detalhes.

- `unique_checks`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se definido para 1 (o padrão), as verificações de unicidade para índices secundários em tabelas `InnoDB` são realizadas. Se definido para 0, os motores de armazenamento são autorizados a assumir que chaves duplicadas não estão presentes nos dados de entrada. Se você tem certeza de que seus dados não contêm violações de unicidade, você pode definir isso para 0 para acelerar a importação de grandes tabelas para `InnoDB`.

  Definir essa variável para 0 não **obriga** os motores de armazenamento a ignorar chaves duplicadas. Ainda assim, é permitido que o motor verifique essas chaves e emita erros de chave duplicada se as detectar.

- `updatable_views_with_limit`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Essa variável controla se as atualizações de uma visualização podem ser feitas quando a visualização não contém todas as colunas da chave primária definida na tabela subjacente, se a instrução de atualização contiver uma cláusula `LIMIT` (Tais atualizações são frequentemente geradas por ferramentas de interface gráfica). Uma atualização é uma instrução `[UPDATE]` (update.html) ou `DELETE` (delete.html). Chave primária aqui significa uma `PRIMARY KEY`, ou um índice `UNIQUE` no qual nenhuma coluna pode conter `NULL`.

  A variável pode ter dois valores:

  - `1` ou `SIM`: Emitir apenas uma mensagem de aviso (não uma mensagem de erro). Este é o valor padrão.

  - `0` ou `NÃO`: Proibir a atualização.

- `validar_senha_xxx`

  O plugin `validate_password` implementa um conjunto de variáveis de sistema com nomes na forma `validate_password_xxx`. Essas variáveis afetam o teste de senhas desse plugin; veja Seção 6.4.3.2, “Opções e Variáveis do Plugin de Validação de Senhas”.

- `version`

  O número da versão do servidor. O valor também pode incluir um sufixo que indica informações de construção ou configuração do servidor. `-log` indica que um ou mais dos logs gerais, logs de consultas lentas ou logs binários estão habilitados. `-debug` indica que o servidor foi construído com o suporte de depuração habilitado.

- `version_comment`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O programa de configuração **CMake** tem uma opção `COMPILATION_COMMENT` que permite especificar um comentário durante a compilação do MySQL. Essa variável contém o valor desse comentário. Veja Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”.

- `version_compile_machine`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O tipo do binário do servidor.

- `version_compile_os`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O tipo de sistema operacional no qual o MySQL foi construído.

- `wait_timeout`

  <table frame="box" rules="all" summary="Propriedades para autenticação_windows_use_principal_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O número de segundos que o servidor espera por atividade em uma conexão não interativa antes de fechá-la.

  Ao iniciar o thread, o valor da sessão `wait_timeout` é inicializado a partir do valor global `wait_timeout` ou do valor global `interactive_timeout`, dependendo do tipo de cliente (como definido pela opção de conexão `CLIENT_INTERACTIVE` para `mysql_real_connect()`). Veja também `interactive_timeout`.

- `contagem_de_aviso`

  O número de erros, avisos e notas resultantes da última declaração que gerou mensagens. Essa variável é apenas de leitura. Consulte Seção 13.7.5.40, “Declaração SHOW WARNINGS”.
