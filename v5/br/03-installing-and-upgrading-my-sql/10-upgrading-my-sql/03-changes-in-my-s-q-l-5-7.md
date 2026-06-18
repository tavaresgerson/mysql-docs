### 2.10.3 Alterações no MySQL 5.7

Antes de atualizar para o MySQL 5.7, revise as alterações descritas nesta seção para identificar aquelas que se aplicam à sua instalação e aplicações atuais do MySQL. Realize as ações recomendadas.

As alterações marcadas como **Alterações incompatíveis** são incompatibilidades com versões anteriores do MySQL e podem exigir sua atenção *antes da atualização*. Nosso objetivo é evitar essas alterações, mas, ocasionalmente, elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre as versões. Se um problema de atualização aplicável à sua instalação envolver uma incompatibilidade, siga as instruções fornecidas na descrição. Às vezes, isso envolve o descarte e a recarga de tabelas ou o uso de uma declaração como `CHECK TABLE` ou `REPAIR TABLE`.

Para obter instruções de descarte e recarga, consulte a Seção 2.10.12, “Reestruturação ou reparo de tabelas ou índices”. Qualquer procedimento que envolva `REPAIR TABLE` com a opção `USE_FRM` *deve* ser feito antes da atualização. O uso desta declaração com uma versão do MySQL diferente daquela usada para criar a tabela (ou seja, usando-a após a atualização) pode danificar a tabela. Consulte a Seção 13.7.2.5, “Instrução REPAIR TABLE”.

- Alterações na configuração
- Alterações na tabela do sistema
- Alterações no servidor
- Alterações no InnoDB
- Alterações no SQL

#### Alterações na configuração

- **Mudança incompatível**: No MySQL 5.7.11, o valor padrão de `--early-plugin-load` é o nome do arquivo da biblioteca do plugin `keyring_file`, fazendo com que o plugin seja carregado por padrão. No MySQL 5.7.12 e versões superiores, o valor padrão de `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo da biblioteca do plugin `keyring_file`.

  A criptografia do espaço de tabelas `InnoDB` exige que o plugin de chave seja carregado antes da inicialização do `InnoDB`, portanto, essa alteração do valor padrão `--early-plugin-load` introduz uma incompatibilidade para atualizações de 5.7.11 para 5.7.12 ou superior. Os administradores que criptografaram os espaços de tabelas `InnoDB` devem tomar medidas explícitas para garantir o carregamento contínuo do plugin de chave: Inicie o servidor com uma opção `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para obter informações adicionais, consulte a Seção 6.4.4.1, “Instalação do Plugin de Chave”.

- **Mudança incompatível**: O `INFORMATION_SCHEMA` possui tabelas que contêm informações sobre variáveis de sistema e status (veja a Seção 24.3.11, “As tabelas GLOBAL_VARIABLES e SESSION_VARIABLES do INFORMATION_SCHEMA” e a Seção 24.3.10, “As tabelas GLOBAL_STATUS e SESSION_STATUS do INFORMATION_SCHEMA”). A partir do MySQL 5.7.6, o Schema de Desempenho também contém tabelas de variáveis de sistema e status (veja a Seção 25.12.13, “Tabelas de variáveis de sistema do Schema de Desempenho” e a Seção 25.12.14, “Tabelas de variáveis de status do Schema de Desempenho”). As tabelas do Schema de Desempenho são destinadas a substituir as tabelas do `INFORMATION_SCHEMA`, que são desaconselhadas a partir do MySQL 5.7.6 e serão removidas no MySQL 8.0.

  Para obter conselhos sobre a migração das tabelas do `INFORMATION_SCHEMA` para as tabelas do Performance Schema, consulte a Seção 25.20, “Migração para as tabelas do Sistema e Variáveis de Estado do Performance Schema”. Para auxiliar na migração, você pode usar a variável de sistema `show_compatibility_56`, que afeta a forma como as informações das variáveis de sistema e de estado são fornecidas pelas tabelas do `INFORMATION_SCHEMA` e do Performance Schema, além das instruções `SHOW VARIABLES` e `SHOW STATUS`. `show_compatibility_56` está habilitado por padrão no 5.7.6 e 5.7.7, e desabilitado por padrão no MySQL 5.7.8.

  Para obter detalhes sobre os efeitos de `show_compatibility_56`, consulte a Seção 5.1.7, “Variáveis do Sistema do Servidor”. Para uma melhor compreensão, é altamente recomendável que você leia também essas seções:

  - Seção 25.12.13, "Tabelas de variáveis do sistema do esquema de desempenho"
  - Seção 25.12.14, "Tabelas de variáveis de status do esquema de desempenho"
  - Seção 25.12.15.10, “Tabelas de Resumo de Estatísticas Variáveis”

- **Mudança incompatível**: a partir do MySQL 5.7.6, a inicialização do diretório de dados cria apenas uma única conta `root`, `'root'@'localhost'`. (Veja a Seção 2.9.1, “Inicializando o Diretório de Dados”.) Uma tentativa de se conectar ao host `127.0.0.1` normalmente resolve para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que existe uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

  ```sql
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

- **Mudança incompatível**: a partir do MySQL 5.7.6, para algumas plataformas Linux, quando o MySQL é instalado usando pacotes RPM e Debian, o início e o desligamento do servidor agora são gerenciados usando o systemd, em vez de **mysqld_safe**, e **mysqld_safe** não é instalado. Isso pode exigir algum ajuste na maneira como você especifica as opções do servidor. Para detalhes, consulte a Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.

- **Mudança incompatível**: No MySQL 5.7.5, a versão binária executável do **mysql_install_db** está localizada no diretório de instalação `bin`, enquanto a versão em Perl estava localizada no diretório de instalação `scripts`. Para atualizações de uma versão mais antiga do MySQL, você pode encontrar uma versão em ambos os diretórios. Para evitar confusão, remova a versão no diretório `scripts`. Para instalações novas do MySQL 5.7.5 ou posterior, o **mysql_install_db** só está presente no diretório `bin`, e o diretório `scripts` não está mais presente. Aplicativos que esperam encontrar o **mysql_install_db** no diretório `scripts` devem ser atualizados para procurar no diretório `bin` em vez disso.

  A localização do **mysql_install_db** torna-se menos importante a partir do MySQL 5.7.6, pois, a partir dessa versão, ele é desaconselhado em favor do **mysqld --initialize** (ou **mysqld --initialize-insecure**). Veja a Seção 2.9.1, “Inicializando o diretório de dados”

- **Mudança incompatível**: No MySQL 5.7.5, foram feitas as seguintes alterações no modo SQL:

  - O modo SQL estrito para os motores de armazenamento transacional (`STRICT_TRANS_TABLES`) está agora habilitado por padrão.

  - A implementação do modo SQL `ONLY_FULL_GROUP_BY` foi aprimorada, para não mais rejeitar consultas determinísticas que antes eram rejeitadas. Como consequência, `ONLY_FULL_GROUP_BY` agora está habilitado por padrão, para proibir consultas não determinísticas que contenham expressões que não são garantidamente determinadas de forma única dentro de um grupo.

  - As alterações no modo SQL padrão resultam em um valor padrão da variável de sistema `sql_mode` com esses modos habilitados: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ENGINE_SUBSTITUTION`.

  - O modo `ONLY_FULL_GROUP_BY` também está agora incluído nos modos que compõem o modo `ANSI` SQL.

  Se você perceber que a habilitação de `ONLY_FULL_GROUP_BY` faz com que as consultas para aplicativos existentes sejam rejeitadas, uma dessas ações deve restaurar o funcionamento:

  - Se for possível modificar uma consulta que contenha erros, faça isso de modo que as colunas não agregadas não determinísticas dependam funcionalmente das colunas `GROUP BY`, ou então faça referência às colunas não agregadas usando `ANY_VALUE()`.

  - Se não for possível modificar uma consulta que contenha erros (por exemplo, se ela for gerada por um aplicativo de terceiros), configure a variável de sistema `sql_mode` na inicialização do servidor para não habilitar `ONLY_FULL_GROUP_BY`.

  Para obter mais informações sobre os modos do SQL e as consultas `GROUP BY`, consulte a Seção 5.1.10, “Modos do SQL do servidor”, e a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

#### Alterações na tabela do sistema

- **Mudança incompatível**: A coluna `Password` da tabela de sistema `mysql.user` foi removida no MySQL 5.7.6. Todas as credenciais são armazenadas na coluna `authentication_string`, incluindo aquelas que antes estavam armazenadas na coluna `Password`. Se estiver realizando uma atualização local para o MySQL 5.7.6 ou uma versão posterior, execute **mysql_upgrade** conforme orientado pelo procedimento de atualização local para migrar o conteúdo da coluna `Password` para a coluna `authentication_string`.

  Se você estiver realizando uma atualização lógica usando um arquivo de dump **mysqldump** de uma instalação do MySQL anterior à versão 5.7.6, você deve observar essas condições para o comando **mysqldump** usado para gerar o arquivo de dump:

  - Você deve incluir a opção `--add-drop-table`

  - Você não deve incluir a opção `--flush-privileges`

  Como descrito no procedimento de atualização lógica, carregue o arquivo de dump pré-5.7.6 no servidor 5.7.6 (ou posterior) antes de executar o **mysql_upgrade**.

#### Alterações no servidor

- **Mudança incompatível**: a partir do MySQL 5.7.5, o suporte para senhas que usam o formato de hashing de senha anterior ao 4.1 é removido, o que envolve as seguintes mudanças. As aplicações que utilizam qualquer recurso que não seja mais suportado devem ser modificadas.

  - O plugin de autenticação `mysql_old_password` que usava valores de hash de senha anteriores à versão 4.1 foi removido. As contas que usam este plugin são desativadas ao iniciar o servidor e o servidor escreve uma mensagem de “plugin desconhecido” no log de erros. Para obter instruções sobre a atualização das contas que usam este plugin, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha anterior à versão 4.1 e do plugin mysql_old_password”.

  - Para a variável de sistema `old_passwords`, um valor de 1 (produzir valores de hash anteriores à versão 4.1) não é mais permitido.

  - A opção `--secure-auth` nos programas de servidor e cliente é a padrão, mas agora é uma opção sem efeito. Ela está desatualizada; espere que ela seja removida em uma futura versão do MySQL.

  - A opção `--skip-secure-auth` nos programas de servidor e cliente não é mais suportada e seu uso produz um erro.

  - A variável de sistema `secure_auth` permite apenas um valor de 1; um valor de 0 não é mais permitido.

  - A função `OLD_PASSWORD()` foi removida.

- **Mudança incompatível**: No MySQL 5.6.6, o tipo de dados `YEAR(2)` de 2 dígitos foi descontinuado. No MySQL 5.7.5, o suporte ao `YEAR(2)` foi removido. Uma vez que você faça a atualização para o MySQL 5.7.5 ou superior, quaisquer colunas `YEAR(2)` de 2 dígitos restantes devem ser convertidas em colunas `YEAR` de 4 dígitos para serem novamente utilizáveis. Para estratégias de conversão, consulte a Seção 11.2.5, “Limitações do `YEAR(2)` de 2 dígitos e Migração para `YEAR` de 4 dígitos” (Limitações e Migração para `YEAR` de 4 dígitos”). Executar **mysql_upgrade** após a atualização é uma das possíveis estratégias de conversão.

- A partir do MySQL 5.7.7, o comando `CHECK TABLE ... FOR UPGRADE` relata que uma tabela precisa ser reconstruída se contiver colunas temporais antigas no formato pré-5.6.4 (`TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo) e se a variável de sistema `avoid_temporal_upgrade` estiver desabilitada. Isso ajuda o **mysql_upgrade** a detectar e atualizar tabelas que contêm colunas temporais antigas. Se `avoid_temporal_upgrade` estiver habilitado, o comando `FOR UPGRADE` ignora as colunas temporais antigas presentes na tabela; consequentemente, o **mysql_upgrade** não as atualiza.

  A partir do MySQL 5.7.7, o comando `REPAIR TABLE` atualiza uma tabela se ela contiver colunas temporais antigas no formato anterior ao 5.6.4 e a variável de sistema `avoid_temporal_upgrade` estiver desabilitada. Se `avoid_temporal_upgrade` estiver habilitada, o comando `REPAIR TABLE` ignora as colunas temporais antigas presentes na tabela e não as atualiza.

  Para verificar tabelas que contêm colunas temporais e precisam ser reconstruídas, desative `avoid_temporal_upgrade` antes de executar `CHECK TABLE ... FOR UPGRADE`.

  Para atualizar tabelas que contêm colunas temporais, desative `avoid_temporal_upgrade` antes de executar `REPAIR TABLE` ou **mysql_upgrade**.

- **Mudança incompatível**: a partir do MySQL 5.7.2, o servidor exige que as linhas de conta na tabela de sistema `mysql.user` tenham um valor de coluna `plugin` não vazio e desabilita as contas com um valor vazio. Isso exige que você atualize sua tabela `mysql.user` para preencher todos os valores de `plugin`. A partir do MySQL 5.7.6, use este procedimento:

  Se você planeja fazer a atualização usando o diretório de dados da sua instalação MySQL existente:

  1. Parar o servidor antigo (MySQL 5.6)

  2. Atualize os binários do MySQL no local, substituindo os binários antigos pelos novos

  3. Inicie o servidor MySQL 5.7 normalmente (sem opções especiais)

  4. Execute o **mysql_upgrade** para atualizar as tabelas do sistema

  5. Reinicie o servidor MySQL 5.7

  Se você planeja fazer uma atualização recarregando um arquivo de dump gerado a partir de sua instalação MySQL existente:

  1. Para gerar o arquivo de dump, execute o **mysqldump** com a opção `--add-drop-table` e sem a opção `--flush-privileges`

  2. Parar o servidor antigo (MySQL 5.6)

  3. Atualize os binários do MySQL no local (substitua os binários antigos pelos novos)

  4. Inicie o servidor MySQL 5.7 normalmente (sem opções especiais)

  5. Recarregue o arquivo de dump (**mysql < *`dump_file`***)

  6. Execute o **mysql_upgrade** para atualizar as tabelas do sistema

  7. Reinicie o servidor MySQL 5.7

  Antes do MySQL 5.7.6, o procedimento é mais complexo:

  Se você planeja fazer a atualização usando o diretório de dados da sua instalação MySQL existente:

  1. Parar o servidor antigo (MySQL 5.6)

  2. Atualize os binários do MySQL no local (substitua os binários antigos pelos novos)

  3. Reinicie o servidor com a opção `--skip-grant-tables` para desabilitar a verificação de privilégios

  4. Execute o **mysql_upgrade** para atualizar as tabelas do sistema

  5. Reinicie o servidor normalmente (sem `--skip-grant-tables`)

  Se você planeja fazer uma atualização recarregando um arquivo de dump gerado a partir de sua instalação MySQL existente:

  1. Para gerar o arquivo de dump, execute o **mysqldump** sem a opção `--flush-privileges`

  2. Parar o servidor antigo (MySQL 5.6)

  3. Atualize os binários do MySQL no local (substitua os binários antigos pelos novos)

  4. Reinicie o servidor com a opção `--skip-grant-tables` para desabilitar a verificação de privilégios

  5. Recarregue o arquivo de dump (**mysql < *`dump_file`***)

  6. Execute o **mysql_upgrade** para atualizar as tabelas do sistema

  7. Reinicie o servidor normalmente (sem `--skip-grant-tables`)

  O **mysql_upgrade** é executado, por padrão, como usuário `root` do MySQL. Para os procedimentos anteriores, se a senha do `root` expirar quando você executar o **mysql_upgrade**, ele exibirá uma mensagem informando que sua senha expirou e que o **mysql_upgrade** falhou como resultado. Para corrigir isso, redefina a senha do `root` e execute o **mysql_upgrade** novamente:

  ```sh
  $> mysql -u root -p
  Enter password: ****  <- enter root password here
  mysql> ALTER USER USER() IDENTIFIED BY 'root-password'; # MySQL 5.7.6 and up
  mysql> SET PASSWORD = PASSWORD('root-password');        # Before MySQL 5.7.6
  mysql> quit

  $> mysql_upgrade -p
  Enter password: ****  <- enter root password here
  ```

  A declaração de redefinição da senha normalmente não funciona se o servidor for iniciado com `--skip-grant-tables`, mas a primeira invocação do **mysql_upgrade** esvazia os privilégios, então, quando você executa o **mysql**, a declaração é aceita.

  Se o próprio **mysql_upgrade** expirar a senha do usuário `root`, você deve redefinir a senha da mesma maneira.

  Após seguir as instruções anteriores, os administradores de banco de dados são aconselhados a converter contas que utilizam o plugin de autenticação `mysql_old_password` para usar `mysql_native_password` em vez disso, porque o suporte ao `mysql_old_password` foi removido. Para obter instruções de atualização de contas, consulte a Seção 6.4.1.3, “Migrando para fora da hashing de senhas pré-4.1 e do plugin mysql_old_password”.

- **Mudança incompatível**: É possível que o valor da coluna `DEFAULT` seja válido para o valor `sql_mode` no momento da criação da tabela, mas inválido para o valor `sql_mode` quando as linhas são inseridas ou atualizadas. Exemplo:

  ```sql
  SET sql_mode = '';
  CREATE TABLE t (d DATE DEFAULT 0);
  SET sql_mode = 'NO_ZERO_DATE,STRICT_ALL_TABLES';
  INSERT INTO t (d) VALUES(DEFAULT);
  ```

  Neste caso, o 0 deve ser aceito para a `CREATE TABLE`, mas rejeitado para a `INSERT`. No entanto, anteriormente, o servidor não avaliava os valores `DEFAULT` usados para inserções ou atualizações contra o `sql_mode` atual. No exemplo, a `INSERT` tem sucesso e insere `'0000-00-00'` na coluna `DATE`.

  A partir do MySQL 5.7.2, o servidor aplica as verificações adequadas do `sql_mode` para gerar um aviso ou erro no momento da inserção ou atualização.

  Uma incompatibilidade resultante para a replicação, se você usar o registro baseado em declarações (`binlog_format=STATEMENT`), é que, se uma réplica for atualizada, uma fonte que não foi atualizada executa o exemplo anterior sem erros, enquanto o `INSERT` falha na réplica e a replicação é interrompida.

  Para lidar com isso, interrompa todas as novas declarações na fonte e espere até que as réplicas recuperem. Em seguida, atualize as réplicas, seguido da fonte. Como alternativa, se você não puder interromper as novas declarações, mude temporariamente para o registro baseado em linhas na fonte (`binlog_format=ROW`) e espere até que todas as réplicas tenham processado todos os logs binários produzidos até o ponto dessa mudança. Em seguida, atualize as réplicas, seguido da fonte e mude a fonte de volta para o registro baseado em declarações.

- **Mudança incompatível**: Várias alterações foram feitas no plugin do log de auditoria para melhorar a compatibilidade com o Oracle Audit Vault. Para fins de atualização, o principal problema é que o formato padrão do arquivo de log de auditoria mudou: as informações dentro dos elementos `<AUDIT_RECORD>` que antes eram escritas com atributos agora são escritas com subelements.

  Exemplo do antigo formato de `<AUDIT_RECORD>`:

  ```xml
  <AUDIT_RECORD
   TIMESTAMP="2013-04-15T15:27:27"
   NAME="Query"
   CONNECTION_ID="3"
   STATUS="0"
   SQLTEXT="SELECT 1"
  />
  ```

  Exemplo de novo formato:

  ```xml
  <AUDIT_RECORD><TIMESTAMP>2013-04-15T15:27:27 UTC</TIMESTAMP><RECORD_ID>3998_2013-04-15T15:27:27</RECORD_ID><NAME>Query</NAME><CONNECTION_ID>3</CONNECTION_ID><STATUS>0</STATUS><STATUS_CODE>0</STATUS_CODE><USER>root[root] @ localhost [127.0.0.1]</USER><OS_LOGIN></OS_LOGIN><HOST>localhost</HOST><IP>127.0.0.1</IP><COMMAND_CLASS>select</COMMAND_CLASS><SQLTEXT>SELECT 1</SQLTEXT></AUDIT_RECORD>
  ```

  Se você já usou uma versão mais antiga do plugin de registro de auditoria, use este procedimento para evitar a gravação de novas entradas de log em um arquivo de log existente que contém entradas de formato antigo:

  1. Pare o servidor.

  2. Renomeie manualmente o arquivo de log de auditoria atual. Este arquivo contém entradas de log usando apenas o formato antigo.

  3. Atualize o servidor e reinicie-o. O plugin de log de auditoria cria um novo arquivo de log, que contém entradas de log usando apenas o novo formato.

  Para obter informações sobre o plugin de registro de auditoria, consulte a Seção 6.4.5, “MySQL Enterprise Audit”.

- A partir do MySQL 5.7.7, o tempo limite de conexão padrão para uma replica foi alterado de 3600 segundos (uma hora) para 60 segundos (um minuto). O novo padrão é aplicado quando uma replica sem configuração para a variável de sistema `slave_net_timeout` é atualizada para o MySQL 5.7. O intervalo de batida de coração, que regula o sinal de batida de coração para interromper o tempo limite de conexão que ocorre na ausência de dados se a conexão ainda estiver boa, é calculado como metade do valor de `slave_net_timeout`. O intervalo de batida de coração é registrado no log de informações de origem da replica (a tabela `mysql.slave_master_info` ou o arquivo `master.info`) e não é alterado automaticamente quando o valor ou configuração padrão de `slave_net_timeout` é alterado. Uma replica do MySQL 5.6 que usava o tempo limite de conexão padrão e o intervalo de batida de coração, e foi então atualizada para o MySQL 5.7, portanto, tem um intervalo de batida de coração muito maior que o tempo limite de conexão.

  Se o nível de atividade na fonte for tal que as atualizações no log binário sejam enviadas para a replica pelo menos uma vez a cada 60 segundos, essa situação não é um problema. No entanto, se nenhum dado for recebido da fonte, porque o batimento cardíaco não está sendo enviado, o tempo limite da conexão expira. A replica, portanto, pensa que a conexão com a fonte foi perdida e faz várias tentativas de reconexão (conforme controlado pelas configurações `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT`, que também podem ser vistas no log de informações da fonte). As tentativas de reconexão geram vários threads de varredura de zumbis que a fonte deve matar, causando o registro de erros na fonte conter vários erros da forma Enquanto inicializando o thread de varredura do escravo com UUID *`uuid`*, encontrou um thread de varredura de zumbi com o mesmo UUID. O mestre está matando o thread de varredura de zumbi *`threadid`*. Para evitar esse problema, imediatamente antes de atualizar uma replica para o MySQL 5.7, verifique se a variável de sistema `slave_net_timeout` está usando o ajuste padrão. Se sim, execute `CHANGE MASTER TO` com a opção `MASTER_HEARTBEAT_PERIOD` e defina o intervalo do batimento cardíaco para 30 segundos, para que funcione com o novo tempo limite de conexão de 60 segundos que se aplica após a atualização.

- **Mudança incompatível**: O MySQL 5.6.22 e versões posteriores reconheciam o privilégio `REFERENCES`, mas não o aplicavam totalmente; um usuário com pelo menos um dos privilégios `SELECT`, `INSERT`, `UPDATE`, `DELETE` ou `REFERENCES` poderia criar uma restrição de chave estrangeira em uma tabela. O MySQL 5.7 (e versões posteriores) exige que o usuário tenha o privilégio `REFERENCES` para fazer isso. Isso significa que, se você migrar usuários de um servidor MySQL 5.6 (qualquer versão) para um servidor que esteja executando o MySQL 5.7, você deve garantir que esse privilégio seja concedido explicitamente a quaisquer usuários que precisem ser capazes de criar chaves estrangeiras. Isso inclui a conta de usuário usada para importar dumps que contenham tabelas com chaves estrangeiras.

#### Alterações no InnoDB

- A partir do MySQL 5.7.24, a versão da biblioteca zlib incluída com o MySQL foi elevada da versão 1.2.3 para a versão 1.2.11.

  A função `compressBound()` do zlib 1.2.11 retorna uma estimativa ligeiramente maior do tamanho do buffer necessário para comprimir um determinado comprimento de bytes do que a função zlib versão 1.2.3. A função `compressBound()` é chamada por funções do `InnoDB` que determinam o tamanho máximo de linha permitido ao criar tabelas `InnoDB` comprimidas ou ao inserir linhas em tabelas `InnoDB` comprimidas. Como resultado, as operações `CREATE TABLE ... ROW_FORMAT=COMPRESSED` ou `INSERT` com tamanhos de linha muito próximos do tamanho máximo de linha que foram bem-sucedidas em versões anteriores podem agora falhar.

  Se você comprimir tabelas `InnoDB` com linhas grandes, é recomendável testar as instruções de criação de tabela comprimida `CREATE TABLE` em uma instância de teste do MySQL 5.7 antes de fazer a atualização.

- **Mudança incompatível**: Para simplificar a descoberta do espaço de tabela `InnoDB` durante a recuperação após falhas, novos tipos de registros de log de redo foram introduzidos no MySQL 5.7.5. Essa melhoria altera o formato do log de redo. Antes de realizar uma atualização local, faça um desligamento limpo usando a configuração `innodb_fast_shutdown` de `0` ou `1`. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

- **Mudança incompatível**: os registros de desfazer dos logs do MySQL 5.7.8 e 5.7.9 podem conter informações insuficientes sobre as colunas espaciais, o que pode resultar em um erro de atualização (Bug #21508582). Antes de realizar uma atualização local do MySQL 5.7.8 ou 5.7.9 para 5.7.10 ou superior, execute um desligamento lento usando `innodb_fast_shutdown=0` para limpar os logs de desfazer. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

- **Mudança incompatível**: os registros de desfazer do MySQL 5.7.8 podem conter informações insuficientes sobre colunas virtuais e índices de colunas virtuais, o que pode resultar em um fracasso na atualização (Bug #21869656). Antes de realizar uma atualização local do MySQL 5.7.8 para o MySQL 5.7.9 ou superior, execute um desligamento lento usando `innodb_fast_shutdown=0` para limpar os registros de desfazer. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

- **Mudança incompatível**: A partir do MySQL 5.7.9, o cabeçalho do log de refazer do primeiro arquivo de log de refazer (`ib_logfile0`) inclui um identificador de versão do formato e uma string de texto que identifica a versão do MySQL que criou os arquivos de log de refazer. Essa melhoria altera o formato do log de refazer, exigindo que o MySQL seja desligado corretamente usando uma configuração `innodb_fast_shutdown` de `0` ou `1` antes de realizar uma atualização local para o MySQL 5.7.9 ou superior. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

- No MySQL 5.7.9, `DYNAMIC` substitui `COMPACT` como o formato de linha padrão implícito para as tabelas `InnoDB`. Uma nova opção de configuração, `innodb_default_row_format`, especifica o formato de linha padrão `InnoDB`. Os valores permitidos incluem `DYNAMIC` (o padrão), `COMPACT` e `REDUNDANT`.

  Após a atualização para a versão 5.7.9, todas as novas tabelas que você criar usarão o formato de linha definido por `innodb_default_row_format`, a menos que você defina explicitamente um formato de linha (`ROW_FORMAT`).

  Para tabelas existentes que não definem explicitamente a opção `ROW_FORMAT` ou que usam `ROW_FORMAT=DEFAULT`, qualquer operação que reconstrua uma tabela também altera silenciosamente o formato de linha da tabela para o formato definido por `innodb_default_row_format`. Caso contrário, as tabelas existentes mantêm seu ajuste atual de formato de linha. Para mais informações, consulte Definindo o Formato de Linha de uma Tabela.

- A partir do MySQL 5.7.6, o mecanismo de armazenamento `InnoDB` usa seu próprio manipulador de particionamento integrado (nativo) para quaisquer novas tabelas particionadas criadas usando `InnoDB`. As tabelas `InnoDB` particionadas criadas em versões anteriores do MySQL não são atualizadas automaticamente. Você pode facilmente atualizar essas tabelas para usar o particionamento nativo do `InnoDB` no MySQL 5.7.9 ou posterior usando um dos seguintes métodos:

  - Para atualizar uma tabela individual do manipulador de particionamento genérico para a particionamento nativo do *`InnoDB`*, execute a instrução `ALTER TABLE table_name UPGRADE PARTITIONING`.

  - Para atualizar todas as tabelas `InnoDB` que usam o manipulador de particionamento genérico para usar o manipulador de particionamento nativo, execute **mysql_upgrade**.

#### Alterações no SQL

- **Mudança incompatível**: A função `GET_LOCK()` foi reimplementada no MySQL 5.7.5 usando o subsistema de bloqueio de metadados (MDL) e suas capacidades foram ampliadas:

  - Anteriormente, o `GET_LOCK()` permitia a aquisição de apenas um bloqueio nomeado de cada vez, e uma segunda chamada `GET_LOCK()` liberava qualquer bloqueio existente. Agora, o `GET_LOCK()` permite a aquisição de mais de um bloqueio nomeado simultaneamente e não libera blocos existentes.

    As aplicações que dependem do comportamento do `GET_LOCK()` para liberar qualquer bloqueio anterior devem ser modificadas para o novo comportamento.

  - A capacidade de adquirir múltiplas chaves introduz a possibilidade de um impasse entre os clientes. O subsistema MDL detecta o impasse e retorna um erro `ER_USER_LOCK_DEADLOCK` quando isso ocorre.

  - O subsistema MDL impõe um limite de 64 caracteres para os nomes de bloqueios, então esse limite agora também se aplica a bloqueios nomeados. Anteriormente, não havia nenhum limite de comprimento.

  - As bloqueadoras adquiridas com `GET_LOCK()` agora aparecem na tabela `metadata_locks` do Schema de Desempenho. A coluna `OBJECT_TYPE` diz `BLOQUEADOR DE NÍVEL DE USUÁRIO` e a coluna `OBJECT_NAME` indica o nome do bloqueio.

  - Uma nova função, `RELEASE_ALL_LOCKS()`, permite a liberação de todos os bloqueios nomeados adquiridos de uma só vez.

  Para mais informações, consulte a Seção 12.14, “Funções de bloqueio”.

- O otimizador agora trata tabelas e visualizações derivadas na cláusula `FROM` de maneira consistente para evitar a materialização desnecessária e permitir o uso de condições empurradas para baixo que produzem planos de execução mais eficientes.

  No entanto, no MySQL 5.7 antes do MySQL 5.7.11, e para instruções como `DELETE` ou `UPDATE` que modificam tabelas, o uso da estratégia de junção para uma tabela derivada que foi previamente materializada pode resultar em um erro `ER_UPDATE_TABLE_USED`:

  ```sql
  mysql> DELETE FROM t1
      -> WHERE id IN (SELECT id
      ->              FROM (SELECT t1.id
      ->                    FROM t1 INNER JOIN t2 USING (id)
      ->                    WHERE t2.status = 0) AS t);
  ERROR 1093 (HY000): You can't specify target table 't1'
  for update in FROM clause
  ```

  O erro ocorre quando uma tabela derivada é integrada aos resultados do bloco de consulta externa, resultando em uma instrução que seleciona e modifica uma tabela. (A materialização não causa o problema, pois, na verdade, converte a tabela derivada em uma tabela separada.) A solução para evitar esse erro era desabilitar a bandeira `derived_merge` da variável de sistema `optimizer_switch` antes de executar a instrução:

  ```sql
  SET optimizer_switch = 'derived_merge=off';
  ```

  A bandeira `derived_merge` controla se o otimizador tenta combinar subconsultas e visualizações na cláusula `FROM` no bloco de consulta externa, assumindo que nenhuma outra regra impeça a combinação. Por padrão, a bandeira está ativada para permitir a combinação. Definir a bandeira para `off` impede a combinação e evita o erro descrito acima. Para mais informações, consulte a Seção 8.2.2.4, “Otimizando tabelas derivadas e referências de visualizações com combinação ou materialização”.

- Alguns termos podem estar reservados no MySQL 5.7 que não estavam reservados no MySQL 5.6. Veja a Seção 9.3, “Palavras-chave e Palavras Reservadas”. Isso pode fazer com que palavras anteriormente usadas como identificadores se tornem ilegais. Para corrigir as declarações afetadas, use a citação de identificadores. Veja a Seção 9.2, “Nomes de Objetos do Esquema”.

- Após a atualização, recomenda-se que você teste as dicas de otimização especificadas no código do aplicativo para garantir que as dicas ainda sejam necessárias para alcançar a estratégia de otimização desejada. As melhorias no otimizador podem, às vezes, tornar certas dicas de otimização desnecessárias. Em alguns casos, uma dica de otimização desnecessária pode até ser contraproducente.

- Nas declarações `UNION`, para aplicar `ORDER BY` ou `LIMIT` a um `SELECT` individual, coloque a cláusula dentro dos parênteses que envolvem o `SELECT`:

  ```sql
  (SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
  UNION
  (SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
  ```

  Versões anteriores do MySQL podem permitir essas declarações sem as chaves. No MySQL 5.7, o requisito de chaves é exigido.
