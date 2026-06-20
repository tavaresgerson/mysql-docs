## 2.10 Atualizando o MySQL

Esta seção descreve os passos para atualizar uma instalação do MySQL.

A atualização é um procedimento comum, pois você obtém correções de bugs na mesma série de lançamento do MySQL ou recursos significativos entre os lançamentos principais do MySQL. Você realiza esse procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas e, em seguida, nos sistemas de produção.

Nota

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta do MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário do MySQL `root`. Os comandos que exigem uma senha para `root` também incluem uma opção `-p`. Como `-p` não é seguido por nenhum valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).

### 2.10.1 Antes de começar

Revise as informações nesta seção antes de fazer a atualização. Realize as ações recomendadas.

* Proteja seus dados criando um backup. O backup deve incluir o banco de dados do sistema `mysql`, que contém as tabelas do sistema do MySQL. Veja a Seção 7.2, “Métodos de backup de banco de dados”.

* Revise a Seção 2.10.2, “Caminhos de Atualização”, para garantir que o caminho de atualização pretendido seja suportado.

* Revise a Seção 2.10.3, “Alterações no MySQL 5.7”, para as alterações que você deve estar ciente antes de fazer a atualização. Algumas alterações podem exigir ação.

* Revise a Seção 1.3, “O que há de novo no MySQL 5.7”, para obter informações sobre as funcionalidades obsoletas e removidas. Um upgrade pode exigir alterações em relação a essas funcionalidades, se você as utilizar.

* Revise a Seção 1.4, “Variáveis e opções de servidor e status adicionadas, descontinuadas ou removidas no MySQL 5.7”. Se você usar variáveis descontinuadas ou removidas, uma atualização pode exigir alterações na configuração.

* Revise as Notas de Lançamento para obter informações sobre correções, alterações e novos recursos.

* Se você usa replicação, revise a Seção 16.4.3, “Atualizando uma topologia de replicação”.

* Os procedimentos de atualização variam de acordo com a plataforma e com a forma como a instalação inicial foi realizada. Use o procedimento que se aplica à sua instalação MySQL atual:

+ Para instalações binárias e baseadas em pacotes em plataformas que não são do Windows, consulte a Seção 2.10.4, “Atualizando instalações binárias ou baseadas em pacotes do MySQL em Unix/Linux”.

Nota

Para as distribuições Linux suportadas, o método preferido para atualizar instalações baseadas em pacotes é usar os repositórios de software MySQL (MySQL Yum Repository, MySQL APT Repository e MySQL SLES Repository).

+ Para instalações em uma plataforma Enterprise Linux ou Fedora usando o Repositório MySQL Yum, consulte a Seção 2.10.5, “Atualizando o MySQL com o Repositório MySQL Yum”.

+ Para instalações no Ubuntu usando o repositório MySQL APT, consulte a Seção 2.10.6, “Atualizando o MySQL com o repositório MySQL APT”.

+ Para instalações em SLES usando o repositório MySQL SLES, consulte a Seção 2.10.7, “Atualizando o MySQL com o repositório MySQL SLES”.

+ Para instalações realizadas usando Docker, consulte a Seção 2.10.9, “Atualizando uma Instalação Docker do MySQL”.

+ Para instalações no Windows, consulte a Seção 2.10.8, “Atualizando o MySQL no Windows”.

* Se a sua instalação do MySQL contiver uma grande quantidade de dados que podem levar um longo tempo para serem convertidos após uma atualização in-place, pode ser útil criar uma instância de teste para avaliar as conversões necessárias e o trabalho envolvido para as realizar. Para criar uma instância de teste, faça uma cópia da sua instância do MySQL que contenha o banco de dados `mysql` e outros bancos de dados sem os dados. Execute o procedimento de atualização na instância de teste para avaliar o trabalho envolvido para realizar a conversão real dos dados.

* Recomenda-se a reconstrução e reinstalação das interfaces de linguagem do MySQL quando você instala ou atualiza para uma nova versão do MySQL. Isso se aplica a interfaces do MySQL, como as extensões PHP `mysql` e o módulo Perl `DBD::mysql`.

### 2.10.2 Caminhos de Atualização

* A atualização é apenas compatível entre as versões de Disponibilidade Geral (GA).

* O upgrade do MySQL 5.6 para 5.7 é suportado. Recomenda-se fazer o upgrade para a versão mais recente antes de fazer o upgrade para a próxima versão. Por exemplo, faça o upgrade para a versão mais recente do MySQL 5.6 antes de fazer o upgrade para o MySQL 5.7.

* A atualização que ignora as versões não é suportada. Por exemplo, a atualização direta de MySQL 5.5 para 5.7 não é suportada.

* A atualização dentro de uma série de lançamento é suportada. Por exemplo, a atualização de MySQL 5.7.*`x`* para 5.7.*`y`* é suportada. Também é suportada a omissão de uma versão. Por exemplo, a atualização de MySQL 5.7.*`x`* para 5.7.*`z`* é suportada.

### 2.10.3 Alterações no MySQL 5.7

Antes de fazer a atualização para o MySQL 5.7, revise as alterações descritas nesta seção para identificar aquelas que se aplicam à sua instalação e aplicações atuais do MySQL. Realize as ações recomendadas.

As alterações marcadas como **Alterações Incompatíveis** são incompatibilidades com versões anteriores do MySQL e podem exigir sua atenção *antes da atualização*. Nosso objetivo é evitar essas alterações, mas, ocasionalmente, elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre as versões. Se um problema de atualização aplicável à sua instalação envolver uma incompatibilidade, siga as instruções fornecidas na descrição. Às vezes, isso envolve drenar e recarregar tabelas ou o uso de uma declaração como `CHECK TABLE` ou `REPAIR TABLE`.

Para obter instruções de descarte e recarga, consulte a Seção 2.10.12, “Reconstrução ou reparo de tabelas ou índices”. Qualquer procedimento que envolva `REPAIR TABLE` com a opção `USE_FRM` *deve* ser feito antes da atualização. O uso desta declaração com uma versão do MySQL diferente daquela usada para criar a tabela (ou seja, usando-a após a atualização) pode danificar a tabela. Consulte a Seção 13.7.2.5, “Declaração de REPARAR TABELA”.

* Alterações de configuração
* Alterações de tabela do sistema
* Alterações no servidor
* Alterações no InnoDB
* Alterações no SQL

#### Alterações de Configuração

* **Mudança incompatível**: No MySQL 5.7.11, o valor padrão `--early-plugin-load` é o nome do arquivo da biblioteca de plugins `keyring_file`, o que faz com que o plugin seja carregado por padrão. No MySQL 5.7.12 e versões posteriores, o valor padrão `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo da biblioteca de plugins `keyring_file`.

A criptografia do tablespace `InnoDB` exige que o plugin de chave seja carregado antes da inicialização do `InnoDB`, portanto, essa mudança no valor padrão do `--early-plugin-load` introduz uma incompatibilidade para atualizações de 5.7.11 para 5.7.12 ou superior. Os administradores que criptografaram os tablespaces `InnoDB` devem tomar ação explícita para garantir o carregamento contínuo do plugin de chave: Inicie o servidor com uma opção de `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para informações adicionais, consulte a Seção 6.4.4.1, “Instalação do Plugin de Chave”.

* **Mudança incompatível**: O `INFORMATION_SCHEMA` possui tabelas que contêm informações de variáveis de sistema e status (consulte a Seção 24.3.11, “As tabelas GLOBAL\_VARIABLES e SESSION\_VARIABLES do INFORMATION_SCHEMA”, e a Seção 24.3.10, “As tabelas GLOBAL\_STATUS e SESSION\_STATUS do INFORMATION_SCHEMA”). A partir do MySQL 5.7.6, o Schema de Desempenho também contém tabelas de variáveis de sistema e status (consulte a Seção 25.12.13, “Tabelas de variáveis de sistema do Schema de Desempenho”, e a Seção 25.12.14, “Tabelas de variáveis de status do Schema de Desempenho”). As tabelas do Schema de Desempenho são destinadas a substituir as tabelas `INFORMATION_SCHEMA`, que são descontinuadas a partir do MySQL 5.7.6 e são removidas no MySQL 8.0.

Para obter conselhos sobre a migração das tabelas do `INFORMATION_SCHEMA` para as tabelas do Performance Schema, consulte a Seção 25.20, “Migração para as tabelas do Sistema e Variáveis de Estado do Performance Schema”. Para auxiliar na migração, você pode usar a variável de sistema `show_compatibility_56`, que afeta a forma como as informações de variáveis de sistema e estado são fornecidas pelas tabelas do `INFORMATION_SCHEMA` e do Performance Schema, e também pelas declarações do `SHOW VARIABLES` e do `SHOW STATUS`. O `show_compatibility_56` é habilitado por padrão no 5.7.6 e 5.7.7, e desabilitado por padrão no MySQL 5.7.8.

Para obter detalhes sobre os efeitos de `show_compatibility_56`, consulte a Seção 5.1.7, “Variáveis do Sistema de Servidor”. Para uma melhor compreensão, é altamente recomendável que você leia também essas seções:

+ Seção 25.12.13, “Tabelas de variáveis de sistema do Schema de desempenho”
  + Seção 25.12.14, “Tabelas de variáveis de status do Schema de desempenho”
  + Seção 25.12.15.10, “Tabelas de resumo de variáveis de status”
* **Alterações incompatíveis**: a partir do MySQL 5.7.6, a inicialização do diretório de dados cria apenas uma única conta `root` `'root'@'localhost'`. (Veja Seção 2.9.1, “Inicializando o diretório de dados”.) Uma tentativa de se conectar ao host `127.0.0.1` normalmente resolve para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que existe uma conta que pode aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

  ```sql
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

* **Mudança incompatível**: a partir do MySQL 5.7.6, para algumas plataformas Linux, quando o MySQL é instalado usando pacotes RPM e Debian, o início e o desligamento do servidor agora são gerenciados usando systemd em vez de `mysqld_safe`, e `mysqld_safe` não é instalado. Isso pode exigir algum ajuste na maneira como você especifica as opções do servidor. Para detalhes, consulte a Seção 2.5.10, “Gerenciando o servidor MySQL com systemd”.

* **Mudança incompatível**: No MySQL 5.7.5, a versão binária executável do **mysql\_install\_db** está localizada no diretório de instalação `bin`, enquanto a versão Perl estava localizada no diretório de instalação `scripts`. Para atualizações de uma versão mais antiga do MySQL, você pode encontrar uma versão em ambos os diretórios. Para evitar confusão, remova a versão no diretório `scripts`. Para instalações novas do MySQL 5.7.5 ou posterior, o **mysql\_install\_db** só é encontrado no diretório `bin`, e o diretório `scripts` não está mais presente. Aplicativos que esperam encontrar **mysql\_install\_db** no diretório `scripts` devem ser atualizados para procurar no diretório `bin`.

A localização de **mysql\_install\_db** se torna menos importante a partir do MySQL 5.7.6, pois, a partir dessa versão, ela é descontinuada em favor de **mysqld --initialize** (ou **mysqld --initialize-insecure**). Veja a Seção 2.9.1, “Inicializando o diretório de dados”

* **Mudança incompatível**: No MySQL 5.7.5, essas mudanças no modo SQL foram feitas:

O modo SQL rigoroso para motores de armazenamento transacional (`STRICT_TRANS_TABLES`) é agora ativado por padrão.

+ A implementação do modo SQL `ONLY_FULL_GROUP_BY` foi aprimorada, para não mais rejeitar consultas determinísticas que anteriormente eram rejeitadas. Em consequência, `ONLY_FULL_GROUP_BY` é agora habilitado por padrão, para proibir consultas não determinísticas que contenham expressões que não são garantidas como sendo única e determinada dentro de um grupo.

+ As alterações no modo SQL padrão resultam em um valor padrão da variável de sistema `sql_mode` com esses modos habilitados: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ENGINE_SUBSTITUTION`.

+ O modo `ONLY_FULL_GROUP_BY` também está incluído agora nos modos compreendidos pelo modo SQL `ANSI`.

Se você perceber que a habilitação de `ONLY_FULL_GROUP_BY` faz com que as consultas para aplicativos existentes sejam rejeitadas, uma dessas ações deve restaurar o funcionamento:

+ Se for possível modificar uma consulta que contenha uma coluna não determinada e não agregada, faça isso de tal forma que as colunas não determinadas e não agregadas dependam funcionalmente das colunas `GROUP BY`, ou então, faça referência às colunas não agregadas usando `ANY_VALUE()`.

+ Se não for possível modificar uma consulta que contenha uma violação (por exemplo, se ela foi gerada por uma aplicação de terceiros), configure a variável de sistema `sql_mode` na inicialização do servidor para não habilitar `ONLY_FULL_GROUP_BY`.

Para mais informações sobre os modos SQL e as consultas `GROUP BY`, consulte a Seção 5.1.10, “Modos SQL do servidor”, e a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

#### Alterações na tabela do sistema

* **Mudança incompatível**: A coluna `Password` da tabela do sistema `mysql.user` foi removida no MySQL 5.7.6. Todas as credenciais são armazenadas na coluna `authentication_string`, incluindo as que anteriormente estavam armazenadas na coluna `Password`. Se estiver realizando uma atualização local para o MySQL 5.7.6 ou posterior, execute `mysqld_upgrade` conforme orientado pelo procedimento de atualização local para migrar o conteúdo da coluna `Password` para a coluna `authentication_string`.

Se você estiver realizando uma atualização lógica usando um arquivo de dump **mysqldump** de uma instalação de MySQL anterior à versão 5.7.6, você deve observar essas condições para o comando **mysqldump** usado para gerar o arquivo de dump:

+ Você deve incluir a opção `--add-drop-table`

+ Não deve incluir a opção `--flush-privileges`

Como descrito no procedimento de atualização lógica, carregue o arquivo de dump pré-5.7.6 no servidor 5.7.6 (ou posterior) antes de executar `mysqld_upgrade`.

#### Alterações no servidor

* **Mudança incompatível**: a partir do MySQL 5.7.5, o suporte para senhas que utilizam o formato de hashing de senha pré-4.1 é removido, o que envolve as seguintes mudanças. As aplicações que utilizam qualquer recurso que não é mais suportado devem ser modificadas.

+ O plugin de autenticação `mysql_old_password` que usava valores de hash de senha pré-4.1 é removido. As contas que usam este plugin são desativadas no início e o servidor escreve uma mensagem de “plugin desconhecido” no log de erro. Para instruções sobre a atualização de contas que usam este plugin, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

+ Para a variável de sistema `old_passwords`, um valor de 1 (produzir valores de hash pré-4.1) não é mais permitido.

+ A opção `--secure-auth` nos programas de servidor e cliente é a padrão, mas agora é uma opção sem efeito. Ela é desaconselhada; espera-se que ela seja removida em uma versão futura do MySQL.

+ A opção `--skip-secure-auth` nos programas de servidor e cliente não é mais suportada e o uso dela produz um erro.

+ A variável de sistema `secure_auth` permite apenas um valor de 1; um valor de 0 não é mais permitido.

+ A função `OLD_PASSWORD()` é removida.

* **Mudança incompatível**: No MySQL 5.6.6, o tipo de dados de 2 dígitos `YEAR(2)` foi descontinuado. No MySQL 5.7.5, o suporte para `YEAR(2)` é removido. Uma vez que você faça a atualização para o MySQL 5.7.5 ou superior, quaisquer colunas restantes de 2 dígitos `YEAR(2)` devem ser convertidas em colunas de 4 dígitos `YEAR` para serem reutilizáveis novamente. Para estratégias de conversão, consulte a Seção 11.2.5, “Limitações de ANO(2) de 2 dígitos e Migração para ANO(4) de 4 dígitos” Limitações e Migração para ANO(4) de 4 dígitos”). Executar `mysqld_upgrade` após a atualização é uma das possíveis estratégias de conversão.

* A partir do MySQL 5.7.7, `CHECK TABLE ... FOR UPGRADE` relata que uma tabela precisa ser reconstruída se ela contiver colunas temporais antigas no formato pré-5.6.4 (as colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de segundos fracionários) e a variável de sistema `avoid_temporal_upgrade` estiver desativada. Isso ajuda `mysqld_upgrade` a detectar e atualizar tabelas que contêm colunas temporais antigas. Se `avoid_temporal_upgrade` estiver ativado, `FOR UPGRADE` ignora as colunas temporais antigas presentes na tabela; consequentemente, `mysqld_upgrade` não as atualiza.

A partir do MySQL 5.7.7, `REPAIR TABLE` atualiza uma tabela se ela contiver colunas temporais antigas no formato pré-5.6.4 e a variável de sistema `avoid_temporal_upgrade` estiver desativada. Se `avoid_temporal_upgrade` estiver ativado, `REPAIR TABLE` ignora as colunas temporais antigas presentes na tabela e não as atualiza.

Para verificar as tabelas que contêm colunas temporais e precisam de uma reconstrução, desative `avoid_temporal_upgrade` antes de executar `CHECK TABLE ... FOR UPGRADE`.

Para atualizar tabelas que contêm colunas temporais, desative `avoid_temporal_upgrade` antes de executar `REPAIR TABLE` ou `mysqld_upgrade`.

* **Mudança incompatível**: a partir do MySQL 5.7.2, o servidor exige que as linhas de conta na tabela `mysql.user` do sistema tenham um valor não vazio na coluna `plugin` e desabilita as contas com um valor vazio. Isso exige que você atualize sua tabela `mysql.user` para preencher todos os valores de `plugin`. a partir do MySQL 5.7.6, use este procedimento:

Se você planeja fazer uma atualização usando o diretório de dados da sua instalação MySQL existente:

1. Parar o servidor antigo (MySQL 5.6)  2. Atualizar os binários do MySQL no local, substituindo os binários antigos pelos novos.

3. Inicie o servidor MySQL 5.7 normalmente (sem opções especiais)  4. Execute `mysqld_upgrade` para atualizar as tabelas do sistema

5. Reinicie o servidor MySQL 5.7

Se você planeja fazer uma atualização recarregando um arquivo de dump gerado a partir de sua instalação MySQL existente:

1. Para gerar o arquivo de dump, execute o **mysqldump** com a opção `--add-drop-table` e sem a opção `--flush-privileges`

2. Parar o servidor antigo (MySQL 5.6)  3. Atualizar os binários do MySQL no local (substitua os binários antigos pelos novos)

4. Inicie o servidor MySQL 5.7 normalmente (sem opções especiais)
5. Recarregue o arquivo de dump (**mysql < *`dump_file`***)

6. Execute `mysqld_upgrade` para atualizar as tabelas do sistema

7. Reinicie o servidor MySQL 5.7

Antes do MySQL 5.7.6, o procedimento é mais complexo:

Se você planeja fazer uma atualização usando o diretório de dados da sua instalação MySQL existente:

1. Parar o servidor antigo (MySQL 5.6)  2. Atualizar os binários do MySQL no local (substitua os binários antigos pelos novos)

3. Reinicie o servidor com a opção `--skip-grant-tables` para desabilitar a verificação de privilégios

4. Execute `mysqld_upgrade` para atualizar as tabelas do sistema

5. Reinicie o servidor normalmente (sem `--skip-grant-tables`)

Se você planeja fazer uma atualização recarregando um arquivo de dump gerado a partir de sua instalação MySQL existente:

1. Para gerar o arquivo de dump, execute o **mysqldump** sem a opção `--flush-privileges`

2. Parar o servidor antigo (MySQL 5.6)  3. Atualizar os binários do MySQL no local (substitua os binários antigos pelos novos)

4. Reinicie o servidor com a opção `--skip-grant-tables` para desabilitar a verificação de privilégios

5. Recarregue o arquivo de dump (**mysql < *`dump_file`***)

6. Execute `mysqld_upgrade` para atualizar as tabelas do sistema

7. Reinicie o servidor normalmente (sem `--skip-grant-tables`)

`mysqld_upgrade` funciona, por padrão, como o usuário `root` do MySQL. Para os procedimentos anteriores, se a senha do `root` expirar quando você executar `mysqld_upgrade`, ela exibirá uma mensagem informando que sua senha expirou e que o `mysqld_upgrade` falhou como resultado. Para corrigir isso, reconfigure a senha do `root` e execute novamente `mysqld_upgrade`:

  ```sql
  $> mysql -u root -p
  Enter password: ****  <- enter root password here
  mysql> ALTER USER USER() IDENTIFIED BY 'root-password'; # MySQL 5.7.6 and up
  mysql> SET PASSWORD = PASSWORD('root-password');        # Before MySQL 5.7.6
  mysql> quit

  $> mysql_upgrade -p
  Enter password: ****  <- enter root password here
  ```

A declaração de reposição de senha normalmente não funciona se o servidor for iniciado com `--skip-grant-tables`, mas a primeira invocação de `mysqld_upgrade` esvazia os privilégios, então quando você executa **mysql**, a declaração é aceita.

Se a própria senha do `mysqld_upgrade` expirar, você deve redefinir a senha novamente da mesma maneira.

Após seguir as instruções anteriores, os DBA são aconselhados a também converter contas que utilizam o plugin de autenticação `mysql_old_password` para utilizar `mysql_native_password` em vez disso, porque o suporte para `mysql_old_password` foi removido. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora da hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

* **Mudança incompatível**: É possível que o valor da coluna `DEFAULT` seja válido para o valor `sql_mode` no momento da criação da tabela, mas inválido para o valor `sql_mode` quando as linhas são inseridas ou atualizadas. Exemplo:

  ```sql
  SET sql_mode = '';
  CREATE TABLE t (d DATE DEFAULT 0);
  SET sql_mode = 'NO_ZERO_DATE,STRICT_ALL_TABLES';
  INSERT INTO t (d) VALUES(DEFAULT);
  ```

Neste caso, o valor de 0 deve ser aceito para o `CREATE TABLE`, mas rejeitado para o `INSERT`. No entanto, anteriormente, o servidor não avaliou os valores de `DEFAULT` usados para inserções ou atualizações contra o atual `sql_mode`. No exemplo, o `INSERT` é bem-sucedido e insere `'0000-00-00'` na coluna `DATE`.

A partir do MySQL 5.7.2, o servidor aplica as verificações adequadas do `sql_mode` para gerar um aviso ou erro no momento de inserção ou atualização.

Uma incompatibilidade resultante para replicação se você usar o registro baseado em declarações (`binlog_format=STATEMENT`) é que, se uma réplica for atualizada, uma fonte que não foi atualizada executa o exemplo anterior sem erro, enquanto o `INSERT` falha na réplica e a replicação é interrompida.

Para lidar com isso, pare todas as novas declarações na fonte e espere até que as réplicas recuperem o atraso. Em seguida, atualize as réplicas, seguido da fonte. Alternativamente, se você não puder parar as novas declarações, mude temporariamente para o registro baseado em linha na fonte (`binlog_format=ROW`) e espere até que todas as réplicas tenham processado todos os logs binários produzidos até o ponto desta mudança. Em seguida, atualize as réplicas, seguido da fonte e mude a fonte de volta para o registro baseado em declarações.

* **Mudança incompatível**: Várias alterações foram feitas no plugin do registro de auditoria para melhor compatibilidade com o Oracle Audit Vault. Para fins de atualização, o principal problema é que o formato padrão do arquivo de registro de auditoria mudou: as informações dentro dos elementos `<AUDIT_RECORD>` que anteriormente eram escritas usando atributos agora são escritas usando subelementos.

Exemplo do formato antigo `<AUDIT_RECORD>`:

  ```sql
  <AUDIT_RECORD
   TIMESTAMP="2013-04-15T15:27:27"
   NAME="Query"
   CONNECTION_ID="3"
   STATUS="0"
   SQLTEXT="SELECT 1"
  />
  ```

Exemplo de novo formato:

  ```sql
  <AUDIT_RECORD>
   <TIMESTAMP>2013-04-15T15:27:27 UTC</TIMESTAMP>
   <RECORD_ID>3998_2013-04-15T15:27:27</RECORD_ID>
   <NAME>Query</NAME>
   <CONNECTION_ID>3</CONNECTION_ID>
   <STATUS>0</STATUS>
   <STATUS_CODE>0</STATUS_CODE>
   <USER>root[root] @ localhost [127.0.0.1]</USER>
   <OS_LOGIN></OS_LOGIN>
   <HOST>localhost</HOST>
   <IP>127.0.0.1</IP>
   <COMMAND_CLASS>select</COMMAND_CLASS>
   <SQLTEXT>SELECT 1</SQLTEXT>
  </AUDIT_RECORD>
  ```

Se você já usou uma versão mais antiga do plugin de registro de auditoria, use este procedimento para evitar escrever entradas de registro de novo formato em um arquivo de registro existente que contém entradas de formato antigo:

1. Parar o servidor.  
2. Renomear o arquivo de registro de auditoria atual manualmente. Esse arquivo contém entradas de registro usando apenas o formato antigo.

3. Atualize o servidor e reinicie-o. O plugin de registro de auditoria cria um novo arquivo de registro, que contém entradas de registro usando apenas o novo formato.

Para informações sobre o plugin de registro de auditoria, consulte a Seção 6.4.5, “Auditoria da Empresa MySQL”.

* A partir do MySQL 5.7.7, o limite de tempo de conexão padrão para uma réplica foi alterado de 3600 segundos (uma hora) para 60 segundos (um minuto). O novo limite de tempo padrão é aplicado quando uma réplica sem configuração para a variável de sistema `slave_net_timeout` é atualizada para o MySQL 5.7. O ajuste padrão do intervalo de batida de coração, que regula o sinal de batida de coração para interromper o tempo de espera de conexão que ocorre na ausência de dados, se a conexão ainda estiver boa, é calculado como metade do valor de `slave_net_timeout`. O intervalo de batida de coração é registrado no log de informações de origem da réplica (a tabela `mysql.slave_master_info` ou o arquivo `master.info`) e não é alterado automaticamente quando o valor ou ajuste padrão de `slave_net_timeout` é alterado. Uma réplica do MySQL 5.6 que usava o limite de conexão padrão e o intervalo de batida de coração, e que foi então atualizada para o MySQL 5.7, portanto, tem um intervalo de batida de coração muito mais longo que o limite de conexão.

Se o nível de atividade na fonte for tal que as atualizações no log binário sejam enviadas para a replica pelo menos uma vez a cada 60 segundos, essa situação não é um problema. No entanto, se não houver dados recebidos da fonte, porque o batimento cardíaco não está sendo enviado, o tempo de espera da conexão expira. A replica, portanto, pensa que a conexão com a fonte foi perdida e faz várias tentativas de reconexão (conforme controlado pelas configurações `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT`, que também podem ser vistas no log de informações da fonte). As tentativas de reconexão geram vários threads de dump zombie que a fonte deve matar, causando o registro de erros na fonte para conter vários erros da forma "Ao inicializar o thread de dump para o escravo com UUID *`uuid`*, encontrou um thread de dump zombie com o mesmo UUID. O mestre está matando o thread de dump zombie *`threadid`*. Para evitar esse problema, imediatamente antes de atualizar uma replica para MySQL 5.7, verifique se a variável de sistema `slave_net_timeout` está usando o ajuste padrão. Se sim, emita `CHANGE MASTER TO` com a opção `MASTER_HEARTBEAT_PERIOD`, e defina o intervalo de batimento cardíaco para 30 segundos, para que funcione com o novo tempo de espera de conexão de 60 segundos que se aplica após a atualização.

* **Mudança incompatível**: O MySQL 5.6.22 e versões posteriores reconheceram o privilégio `REFERENCES`, mas não o aplicaram totalmente; um usuário com pelo menos um dos privilégios `SELECT`, `INSERT`, `UPDATE`, `DELETE` ou `REFERENCES` poderia criar uma restrição de chave estrangeira em uma tabela. O MySQL 5.7 (e versões posteriores) exige que o usuário tenha o privilégio `REFERENCES` para fazer isso. Isso significa que, se você migrar usuários de um servidor MySQL 5.6 (qualquer versão) para um que esteja executando MySQL 5.7, você deve garantir que esse privilégio seja concedido explicitamente a qualquer usuário que precise ser capaz de criar chaves estrangeiras. Isso inclui a conta de usuário empregada para importar dumps que contenham tabelas com chaves estrangeiras.

#### Alterações no InnoDB

* a partir do MySQL 5.7.24, a versão da biblioteca zlib empacotada com o MySQL foi elevada da versão 1.2.3 para a versão 1.2.11.

A função zlib `compressBound()` no zlib 1.2.11 retorna uma estimativa ligeiramente mais alta do tamanho do buffer necessário para comprimir um determinado comprimento de bytes do que a função zlib versão 1.2.3. A função `compressBound()` é chamada pelas funções `InnoDB` que determinam o tamanho máximo de linha permitido ao criar tabelas `InnoDB` comprimidas ou ao inserir linhas em tabelas `InnoDB` comprimidas. Como resultado, as operações `CREATE TABLE ... ROW_FORMAT=COMPRESSED` ou `INSERT` com tamanhos de linha muito próximos ao tamanho máximo de linha que foram bem-sucedidas em versões anteriores podem agora falhar.

Se você tiver tabelas compactadas `InnoDB` com linhas grandes, é recomendável testar as declarações de tabela compactada `CREATE TABLE` em uma instância de teste MySQL 5.7 antes de fazer a atualização.

* **Mudança incompatível**: Para simplificar a descoberta do espaço de tabelas `InnoDB` durante a recuperação em caso de falha, novos tipos de registro de log de refazer foram introduzidos no MySQL 5.7.5. Essa melhoria altera o formato do log de refazer. Antes de realizar uma atualização local, realize um desligamento limpo usando uma configuração `innodb_fast_shutdown` de `0` ou `1`. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

* **Mudança incompatível**: os registros de desfazer do MySQL 5.7.8 e 5.7.9 podem conter informações insuficientes sobre as colunas espaciais, o que pode resultar em um fracasso na atualização (Bug #21508582). Antes de realizar uma atualização local a partir do MySQL 5.7.8 ou 5.7.9 para 5.7.10 ou superior, realize uma parada lenta usando `innodb_fast_shutdown=0` para limpar os registros de desfazer. Uma parada lenta usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

* **Mudança incompatível**: os registros de desfazer do MySQL 5.7.8 podem conter informações insuficientes sobre colunas virtuais e índices de coluna virtual, o que pode resultar em um fracasso na atualização (Bug #21869656). Antes de realizar uma atualização local do MySQL 5.7.8 para o MySQL 5.7.9 ou superior, realize uma parada lenta usando `innodb_fast_shutdown=0` para limpar os registros de desfazer. Uma parada lenta usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

* **Mudança incompatível**: a partir do MySQL 5.7.9, o cabeçalho do log de refazer do primeiro arquivo de log de refazer (`ib_logfile0`) inclui um identificador de versão do formato e uma string de texto que identifica a versão do MySQL que criou os arquivos de log de refazer. Essa melhoria altera o formato do log de refazer, exigindo que o MySQL seja desligado corretamente usando uma configuração `innodb_fast_shutdown` de `0` ou `1` antes de realizar uma atualização local para o MySQL 5.7.9 ou superior. Um desligamento lento usando `innodb_fast_shutdown=0` é uma etapa recomendada na Atualização Local.

* Em MySQL 5.7.9, `DYNAMIC` substitui `COMPACT` como o formato de linha padrão implícito para as tabelas `InnoDB`. Uma nova opção de configuração, `innodb_default_row_format`, especifica o formato de linha padrão `InnoDB`. Os valores permitidos incluem `DYNAMIC` (o padrão), `COMPACT` e `REDUNDANT`.

Após a atualização para 5.7.9, todas as novas tabelas que você criar usarão o formato de linha definido por `innodb_default_row_format`, a menos que você defina explicitamente um formato de linha (`ROW_FORMAT`).

Para tabelas existentes que não definem explicitamente uma opção `ROW_FORMAT` ou que utilizam `ROW_FORMAT=DEFAULT`, qualquer operação que reconstrua uma tabela também altera silenciosamente o formato da linha da tabela para o formato definido por `innodb_default_row_format`. Caso contrário, as tabelas existentes retêm seu ajuste atual de formato de linha. Para mais informações, consulte Definindo o Formato de Linha de uma Tabela.

* A partir do MySQL 5.7.6, o mecanismo de armazenamento `InnoDB` usa seu próprio manipulador de particionamento interno ("nativo") para quaisquer novas tabelas particionadas criadas usando `InnoDB`. As tabelas particionadas `InnoDB` criadas em versões anteriores do MySQL não são atualizadas automaticamente. Você pode facilmente atualizar essas tabelas para usar o particionamento nativo `InnoDB` no MySQL 5.7.9 ou posterior usando qualquer um dos seguintes métodos:

+ Para atualizar uma tabela individual do manipulador de particionamento genérico para particionamento nativo *`InnoDB`*, execute a instrução `ALTER TABLE table_name UPGRADE PARTITIONING`.

+ Para atualizar todas as tabelas `InnoDB` que utilizam o manipulador de particionamento genérico para usar o manipulador de particionamento nativo, execute `mysqld_upgrade`.

#### Alterações no SQL

* **Mudança incompatível**: A função `GET_LOCK()` foi reimplementada no MySQL 5.7.5 usando o subsistema de bloqueio de metadados (MDL) e suas capacidades foram estendidas:

+ Anteriormente, `GET_LOCK()` permitia a aquisição de apenas um bloqueio nomeado de cada vez, e uma segunda chamada `GET_LOCK()` liberava qualquer bloqueio existente. Agora, `GET_LOCK()` permite a aquisição de mais de um bloqueio nomeado simultaneamente e não libera blocos existentes.

As aplicações que dependem do comportamento do `GET_LOCK()` que libera qualquer bloqueio anterior devem ser modificadas para o novo comportamento.

+ A capacidade de adquirir múltiplos bloqueios introduz a possibilidade de impasse entre os clientes. O subsistema MDL detecta o impasse e retorna um erro `ER_USER_LOCK_DEADLOCK` quando isso ocorre.

+ O subsistema MDL impõe um limite de 64 caracteres para os nomes de bloqueio, então esse limite agora também se aplica a bloqueios nomeados. Anteriormente, não havia limite de comprimento aplicado.

Os bloqueios adquiridos com `GET_LOCK()` agora aparecem na tabela do Schema de desempenho `metadata_locks`. A coluna `OBJECT_TYPE` diz `USER LEVEL LOCK` e a coluna `OBJECT_NAME` indica o nome do bloqueio.

+ Uma nova função, `RELEASE_ALL_LOCKS()`, permite a liberação de todos os bloqueios nomeados adquiridos de uma só vez.

Para mais informações, consulte a Seção 12.14, “Funções de bloqueio”.

* O otimizador agora lida com tabelas e visualizações derivadas na cláusula `FROM` de maneira consistente para evitar a materialização desnecessária e permitir o uso de condições empurradas para baixo que produzem planos de execução mais eficientes.

No entanto, no MySQL 5.7 antes do MySQL 5.7.11, e para declarações como `DELETE` ou `UPDATE` que modificam tabelas, o uso da estratégia de junção para uma tabela derivada que foi anteriormente materializada pode resultar em um erro `ER_UPDATE_TABLE_USED`:

  ```sql
  mysql> DELETE FROM t1
      -> WHERE id IN (SELECT id
      ->              FROM (SELECT t1.id
      ->                    FROM t1 INNER JOIN t2 USING (id)
      ->                    WHERE t2.status = 0) AS t);
  ERROR 1093 (HY000): You can't specify target table 't1'
  for update in FROM clause
  ```

O erro ocorre quando uma tabela derivada é integrada aos resultados do bloco de consulta externa, resultando em uma declaração que seleciona e modifica uma tabela. (A materialização não causa o problema, pois, na verdade, converte a tabela derivada em uma tabela separada.) A solução para evitar esse erro era desabilitar a bandeira `derived_merge` da variável de sistema `optimizer_switch` antes de executar a declaração:

  ```sql
  SET optimizer_switch = 'derived_merge=off';
  ```

A bandeira `derived_merge` controla se o otimizador tenta combinar subconsultas e visualizações na cláusula `FROM` no bloco de consulta externa, assumindo que nenhuma outra regra impeça a combinação. Por padrão, a bandeira é `on` para habilitar a combinação. Definir a bandeira para `off` impede a combinação e evita o erro descrito acima. Para mais informações, consulte a Seção 8.2.2.4, “Otimizando tabelas derivadas e referências de visualizações com combinação ou materialização”.

* Algumas palavras-chave podem estar reservadas no MySQL 5.7 que não estavam reservadas no MySQL 5.6. Veja a Seção 9.3, “Palavras-chave e Palavras Reservadas”. Isso pode fazer com que palavras anteriormente usadas como identificadores se tornem ilegais. Para corrigir as declarações afetadas, use a citação de identificadores. Veja a Seção 9.2, “Nomes de Objetos do Esquema”.

* Após a atualização, é recomendável testar as dicas de otimização especificadas no código da aplicação para garantir que as dicas ainda sejam necessárias para alcançar a estratégia de otimização desejada. As melhorias do otimizador podem, às vezes, tornar certas dicas de otimização desnecessárias. Em alguns casos, uma dica de otimização desnecessária pode até ser contraproducente.

* Nas declarações do `UNION`, para aplicar `ORDER BY` ou `LIMIT` a um indivíduo `SELECT`, coloque a cláusula dentro dos parênteses que encerram o `SELECT`:

  ```sql
  (SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
  UNION
  (SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
  ```

Versões anteriores do MySQL podem permitir essas declarações sem parênteses. No MySQL 5.7, o requisito de parênteses é exigido.

### 2.10.4 Atualizando instalações binárias ou baseadas em pacotes do MySQL em Unix/Linux

Esta seção descreve como fazer uma atualização das instalações binárias e baseadas em pacotes do MySQL em Unix/Linux. Métodos de atualização local e lógico são descritos.

* Upgrade no local
* Upgrade lógico

#### Upgrade In-Place

Uma atualização in-place envolve desligar o servidor MySQL antigo, substituir os binários ou pacotes MySQL antigos pelos novos, reiniciar o MySQL no diretório de dados existente e atualizar quaisquer partes restantes da instalação existente que necessitem de atualização.

Nota

Atualize apenas uma instância do servidor MySQL que foi corretamente desligada. Se a instância tiver sido desligada inesperadamente, então reinicie a instância e desligue-a com `innodb_fast_shutdown=0` antes da atualização.

Nota

Se você atualizar uma instalação originalmente produzida instalando vários pacotes RPM, atualize todos os pacotes, não apenas alguns. Por exemplo, se você instalou anteriormente os RPMs do servidor e do cliente, não atualize apenas o RPM do servidor.

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o `mysqld_safe` não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

Para realizar uma atualização local:

1. Se você usar transações XA com `InnoDB`, execute `XA RECOVER` antes de fazer a atualização para verificar transações XA não comprometidas. Se os resultados forem retornados, comprometa ou desconsome as transações XA emitindo uma declaração `XA COMMIT` ou `XA ROLLBACK`.

2. Configure o MySQL para realizar um desligamento lento, definindo `innodb_fast_shutdown` para `0`. Por exemplo:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

Com uma parada lenta, `InnoDB` realiza uma purga completa e uma fusão de buffers antes de desligar, o que garante que os arquivos de dados estejam totalmente preparados para o caso de diferenças de formato de arquivo entre as versões.

3. Desative o servidor MySQL antigo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Atualize a instalação binária do MySQL ou os pacotes. Se estiver atualizando uma instalação binária, desempacote o novo pacote de distribuição binária do MySQL. Veja Obter e desempacotar a distribuição. Para instalações baseadas em pacotes, instale os novos pacotes.

5. Inicie o servidor MySQL 5.7, usando o diretório de dados existente. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

6. Execute `mysqld_upgrade`. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

`mysqld_upgrade` examina todas as tabelas em todos os bancos de dados para incompatibilidades com a versão atual do MySQL. `mysqld_upgrade` também atualiza o banco de dados do sistema `mysql` para que você possa aproveitar novos privilégios ou capacidades.

Nota

`mysqld_upgrade` não atualiza o conteúdo das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 5.1.13, “Suporte de fuso horário do MySQL Server”, e a Seção 5.1.14, “Suporte de ajuda do lado do servidor”.

7. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

#### Upgrade Lógico

Uma atualização lógica envolve exportar o SQL da antiga instância MySQL usando um utilitário de backup ou exportação, como **mysqldump** ou **mysqlpump**, instalar o novo servidor MySQL e aplicar o SQL à sua nova instância MySQL.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o `mysqld_safe` não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

Para realizar uma atualização lógica:

1. Revise as informações na Seção 2.10.1, “Antes de Começar”.

2. Exporte seus dados existentes da instalação anterior do MySQL:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

Nota

Utilize as opções `--routines` e `--events` com o **mysqldump** (como mostrado acima) se seus bancos de dados incluem programas armazenados. A opção `--all-databases` inclui todos os bancos de dados no dump, incluindo o banco de dados `mysql` que contém as tabelas do sistema.

Importante

Se você tem tabelas que contêm colunas geradas, use o utilitário **mysqldump** fornecido com o MySQL 5.7.9 ou superior para criar seus arquivos de dump. O utilitário **mysqldump** fornecido em versões anteriores usa sintaxe incorreta para definições de colunas geradas (Bug #20769542). Você pode usar a tabela do esquema de informações `COLUMNS` para identificar tabelas com colunas geradas.

3. Desative o servidor MySQL antigo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Instale o MySQL 5.7. Para obter instruções de instalação, consulte o Capítulo 2, *Instalando e atualizando o MySQL*.

5. Inicie um novo diretório de dados, conforme descrito na Seção 2.9.1, “Inicializando o diretório de dados”. Por exemplo:

   ```sql
   mysqld --initialize --datadir=/path/to/5.7-datadir
   ```

Copie a senha temporária `'root'@'localhost'` exibida na tela ou escrita no seu registro de erro para uso posterior.

6. Inicie o servidor MySQL 5.7, usando o novo diretório de dados. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
   ```

7. Redefinir a senha do `root`:

   ```sql
   $> mysql -u root -p
   Enter password: ****  <- enter temporary root password
   ```

   ```sql
   mysql> ALTER USER USER() IDENTIFIED BY 'your new password';
   ```

8. Carregue o arquivo de dump criado anteriormente no novo servidor MySQL. Por exemplo:

   ```sql
   mysql -u root -p --force < data-for-upgrade.sql
   ```

Nota

Não é recomendado carregar um arquivo de dump quando GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que utilizam o mecanismo de armazenamento não transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados. Além disso, esteja ciente de que carregar um arquivo de dump de um servidor com GTIDs habilitados em outro servidor com GTIDs habilitados gera diferentes identificadores de transação.

9. Execute `mysqld_upgrade`. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

`mysqld_upgrade` examina todas as tabelas em todos os bancos de dados para incompatibilidades com a versão atual do MySQL. `mysqld_upgrade` também atualiza o banco de dados do sistema `mysql` para que você possa aproveitar novos privilégios ou capacidades.

Nota

`mysqld_upgrade` não atualiza os conteúdos das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 5.1.13, “Suporte de fuso horário do MySQL Server”, e a Seção 5.1.14, “Suporte de ajuda do lado do servidor”.

10. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

    ```sql
    mysqladmin -u root -p shutdown
    mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
    ```

### 2.10.5 Atualizando o MySQL com o Repositório MySQL Yum

Para plataformas com suporte ao Yum (consulte a Seção 2.5.1, "Instalando o MySQL no Linux usando o Repositório Yum do MySQL", para uma lista), você pode realizar uma atualização in-place para o MySQL (ou seja, substituir a versão antiga e, em seguida, executar a nova versão usando os arquivos de dados antigos) com o repositório Yum do MySQL.

Notas

* Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções na Seção 2.10, “Atualização do MySQL”. Entre outras instruções discutidas, é especialmente importante fazer backup do seu banco de dados antes da atualização.

* As instruções a seguir pressupõem que você instalou o MySQL com o repositório MySQL Yum ou com um pacote RPM diretamente baixado da página de download da MySQL Developer Zone [(https://dev.mysql.com/downloads/)]; se não for esse o caso, siga as instruções na Seção 2.5.2, “Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório MySQL Yum”.

1. #### Selecionando uma série-alvo

Por padrão, o repositório MySQL Yum atualiza o MySQL para a versão mais recente na série de lançamento que você escolheu durante a instalação (consulte Selecionar uma Série de Lançamento para obter detalhes), o que significa, por exemplo, que uma instalação 5.6.x *não* é atualizada automaticamente para uma versão 5.7.x. Para atualizar para outra série de lançamento, você precisa primeiro desativar o subrepositório para a série que foi selecionada (por padrão, ou por você mesmo) e ativar o subrepositório para a série que você deseja. Para fazer isso, consulte as instruções gerais fornecidas em Selecionar uma Série de Lançamento. Para atualizar de MySQL 5.6 para 5.7, realize o *reverso* dos passos ilustrados em Selecionar uma Série de Lançamento, desativando o subrepositório para a série MySQL 5.6 e ativando-o para a série MySQL 5.7.

Como regra geral, para fazer uma atualização de uma série de lançamento para outra, vá para a próxima série em vez de pular uma série. Por exemplo, se você está atualmente executando o MySQL 5.5 e deseja fazer uma atualização para 5.7, faça uma atualização para o MySQL 5.6 primeiro antes de fazer a atualização para 5.7.

Importante

Para informações importantes sobre a atualização do MySQL 5.6 para o 5.7, consulte a atualização do MySQL 5.6 para o 5.7.

2. #### Atualização do MySQL

Atualize o MySQL e seus componentes pelo seguinte comando, para plataformas que não são habilitadas para dnf:

   ```sql
   sudo yum update mysql-server
   ```

Para plataformas que são habilitadas para dnf:

   ```sql
   sudo dnf upgrade mysql-server
   ```

Como alternativa, você pode atualizar o MySQL dizendo ao Yum para atualizar tudo no seu sistema, o que pode levar um tempo consideravelmente maior. Para plataformas que não são habilitadas para dnf:

   ```sql
   sudo yum update
   ```

Para plataformas que são habilitadas para dnf:

   ```sql
   sudo dnf upgrade
   ```

3. #### Reiniciar o MySQL

O servidor MySQL sempre é reiniciado após uma atualização pelo Yum. Uma vez que o servidor é reiniciado, execute `mysqld_upgrade` para verificar e, possivelmente, resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. `mysqld_upgrade` também realiza outras funções; consulte a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas MySQL”, para obter detalhes.

Você também pode atualizar apenas um componente específico. Use o seguinte comando para listar todos os pacotes instalados para os componentes do MySQL (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

```sql
sudo yum list installed | grep "^mysql"
```

Após identificar o nome do pacote do componente da sua escolha, atualize o pacote com o seguinte comando, substituindo *`package-name`* pelo nome do pacote. Para plataformas que não são habilitadas para dnf:

```sql
sudo yum update package-name
```

Para plataformas com dnf habilitado:

```sql
sudo dnf upgrade package-name
```

#### Atualizando as Bibliotecas de Cliente Compartilhadas

Após atualizar o MySQL usando o repositório Yum, as aplicações compiladas com versões mais antigas das bibliotecas de cliente compartilhadas devem continuar a funcionar.

*Se você recompilar aplicativos e vincular dinamicamente com as bibliotecas atualizadas:* Como é típico com novas versões de bibliotecas compartilhadas, onde há diferenças ou adições na versionamento de símbolos entre as bibliotecas mais novas e as mais antigas (por exemplo, entre as bibliotecas de cliente compartilhadas padrão 5.7 mais novas e algumas versões mais antigas — anteriores ou variantes — das bibliotecas compartilhadas entregues nativamente pelos repositórios de software das distribuições Linux, ou de algumas outras fontes), quaisquer aplicativos compilados usando as bibliotecas compartilhadas atualizadas requerem essas bibliotecas atualizadas nos sistemas onde os aplicativos são implantados. Se essas bibliotecas não estiverem disponíveis, os aplicativos que requerem as bibliotecas compartilhadas falham. Por esse motivo, certifique-se de implantar os pacotes para as bibliotecas compartilhadas do MySQL nesses sistemas. Para fazer isso, adicione o repositório MySQL Yum aos sistemas (veja Adicionando o repositório MySQL Yum) e instale as bibliotecas compartilhadas mais recentes usando as instruções fornecidas em Instalando Produtos e Componentes Adicionais do MySQL com Yum.

### 2.10.6 Atualizando o MySQL com o Repositório MySQL APT

Nas plataformas Debian e Ubuntu, para realizar uma atualização in-place do MySQL e seus componentes, use o repositório MySQL APT. Veja Atualizando o MySQL com o repositório MySQL APT em Um guia rápido para usar o repositório MySQL APT.

### 2.10.7 Atualizando o MySQL com o Repositório MySQL SLES

Na plataforma SUSE Linux Enterprise Server (SLES), para realizar uma atualização in-place do MySQL e seus componentes, use o repositório SLES MySQL. Veja Atualizando o MySQL com o repositório SLES MySQL em Um guia rápido para usar o repositório SLES MySQL.

### 2.10.8 Atualizando o MySQL no Windows

Existem duas abordagens para atualizar o MySQL no Windows:

* Usando o Instalador MySQL
* Usando a distribuição de arquivo ZIP do Windows

A abordagem que você seleciona depende de como a instalação existente foi realizada. Antes de prosseguir, revise a Seção 2.10, “Atualizando o MySQL”, para obter informações adicionais sobre a atualização do MySQL que não são específicas do Windows.

Nota

Independentemente da abordagem que você escolher, sempre faça um backup da sua instalação MySQL atual antes de realizar uma atualização. Veja a Seção 7.2, “Métodos de backup de banco de dados”.

As atualizações entre as versões de marco (ou de uma versão de marco para uma versão GA) não são suportadas. Alterações significativas de desenvolvimento ocorrem em versões de marco e você pode encontrar problemas de compatibilidade ou problemas ao iniciar o servidor. Para obter instruções sobre como realizar uma atualização lógica com uma versão de marco, consulte Atualização lógica.

Nota

O Instalador do MySQL não suporta atualizações entre as versões *Community* e as versões *Comerciais*. Se você precisar desse tipo de atualização, realize-a usando a abordagem do arquivo ZIP.

#### Atualizando o MySQL com o Instalador do MySQL

Realizar uma atualização com o MySQL Installer é a melhor abordagem quando a instalação atual do servidor foi realizada com ele e a atualização está dentro da série atual de lançamento. O MySQL Installer não suporta atualizações entre séries de lançamento, como de 5.6 para 5.7, e não fornece um indicador de atualização para solicitar a atualização. Para obter instruções sobre a atualização entre séries de lançamento, consulte a atualização do MySQL usando a distribuição ZIP do Windows.

Para realizar uma atualização usando o Instalador do MySQL:

1. Inicie o Instalador do MySQL. 2. No painel de controle, clique em Catálogo para fazer o download das últimas alterações no catálogo. O servidor instalado só pode ser atualizado se o painel de controle exibir uma seta ao lado do número da versão do servidor.

3. Clique em Atualizar. Todos os produtos que têm uma versão mais recente aparecem agora em uma lista.

Nota

O Instalador do MySQL desmarca a opção de atualização do servidor para versões de marco (Pré-Lançamento) na mesma série de lançamento. Além disso, ele exibe um aviso para indicar que a atualização não é suportada, identifica os riscos de continuar e fornece um resumo dos passos para realizar uma atualização lógica manualmente. Você pode remarcar a atualização do servidor e prosseguir por sua conta e risco.

4. Desmarque todos, exceto o produto do servidor MySQL, a menos que você pretenda atualizar outros produtos neste momento, e clique em Próximo.

5. Clique em Executar para iniciar o download. Quando o download terminar, clique em Próximo para iniciar a operação de atualização.

6. Configure o servidor.

#### Atualizando o MySQL usando a distribuição ZIP do Windows

Para realizar uma atualização usando a distribuição de arquivo ZIP do Windows:

1. Baixe a última distribuição do Arquivo ZIP do MySQL do <https://dev.mysql.com/downloads/>.

2. Se o servidor estiver em execução, pare-o. Se o servidor estiver instalado como um serviço, pare o serviço com o seguinte comando no prompt de comando:

   ```sql
   C:\> SC STOP mysqld_service_name
   ```

Como alternativa, use **NET STOP *`mysqld_service_name`***.

Se você não está executando o servidor MySQL como um serviço, use **mysqladmin** para interromper o serviço. Por exemplo, antes de fazer a atualização do MySQL 5.6 para 5.7, use **mysqladmin** do MySQL 5.6 da seguinte forma:

   ```sql
   C:\> "C:\Program Files\MySQL\MySQL Server 5.6\bin\mysqladmin" -u root shutdown
   ```

Nota

Se a conta de usuário MySQL `root` tiver uma senha, invoque o **mysqladmin** com a opção `-p` e insira a senha quando solicitado.

3. Extraia o arquivo ZIP. Você pode substituir a instalação MySQL existente (geralmente localizada em `C:\mysql`), ou instalá-la em um diretório diferente, como `C:\mysql5`. É recomendável substituir a instalação existente.

4. Reinicie o servidor. Por exemplo, use o comando **SC START *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`*** se você executar o MySQL como um serviço, ou invoque `mysqld` diretamente caso contrário.

5. Como administrador, execute `mysqld_upgrade` para verificar suas tabelas, tente repará-las, se necessário, e atualize suas tabelas de concessão, se elas tiverem sido alteradas, para que você possa aproveitar quaisquer novas funcionalidades. Veja a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas MySQL”.

6. Se você encontrar erros, consulte a Seção 2.3.5, “Solucionando problemas de instalação do Microsoft Windows MySQL Server”.

### 2.10.9 Atualizando uma Instalação Docker do MySQL

Para atualizar uma instalação do Docker do MySQL, consulte Atualizando um contêiner do servidor MySQL.

### 2.10.10 Atualizando o MySQL com pacotes RPM baixados diretamente

É preferível usar o repositório MySQL Yum ou o [Repositório SLES MySQL][(https://dev.mysql.com/downloads/repo/suse/)] para atualizar o MySQL em plataformas baseadas em RPM. No entanto, se você tiver que atualizar o MySQL usando os pacotes RPM baixados diretamente da [Zona de Desenvolvimento MySQL][(https://dev.mysql.com/)] (consulte a Seção 2.5.5, “Instalando MySQL no Linux Usando Pacotes RPM da Oracle” para obter informações sobre os pacotes), vá até a pasta que contém todos os pacotes baixados (e, de preferência, sem outros pacotes RPM com nomes semelhantes) e execute o seguinte comando:

```sql
yum install mysql-community-{server,client,common,libs}-*
```

Substitua **yum** por **zypper** para sistemas SLES e por **dnf** para sistemas habilitados para dnf.

Embora seja muito preferível usar uma ferramenta de gerenciamento de pacotes de alto nível, como o **yum**, para instalar os pacotes, os usuários que preferem comandos diretos de **rpm** podem substituir o comando **yum install** pelo comando **rpm -Uvh**. No entanto, usar **rpm -Uvh** em vez disso torna o processo de instalação mais propenso a falhas, devido a potenciais problemas de dependência que o processo de instalação pode encontrar.

Para uma instalação de atualização usando pacotes RPM, o servidor MySQL é automaticamente reiniciado no final da instalação se ele estivesse em execução quando a instalação de atualização começou. Se o servidor não estivesse em execução quando a instalação de atualização começou, você deve reiniciar o servidor você mesmo após a instalação de atualização ser concluída; faça isso com, por exemplo, o comando a seguir:

```sql
service mysqld start
```

Depois que o servidor for reiniciado, execute `mysqld_upgrade` para verificar e, se necessário, resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. `mysqld_upgrade` também realiza outras funções; consulte a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas MySQL”, para obter detalhes.

Nota

Devido às relações de dependência entre os pacotes RPM, todos os pacotes instalados devem ter a mesma versão. Portanto, sempre atualize todos os pacotes instalados para o MySQL. Por exemplo, não atualize apenas o servidor sem também atualizar o cliente, os arquivos comuns para as bibliotecas do servidor e do cliente, e assim por diante.

**Migração e atualização de instalações por pacotes RPM mais antigos.** Algumas versões mais antigas dos pacotes RPM do MySQL Server têm nomes na forma de MySQL-\* (por exemplo, MySQL-server-\* e MySQL-client-\*). As versões mais recentes dos RPMs, quando instaladas usando a ferramenta padrão de gerenciamento de pacotes (**yum**, **dnf** ou **zypper**), atualizam perfeitamente essas instalações mais antigas, tornando desnecessário desinstalar esses pacotes antigos antes de instalar os novos. Aqui estão algumas diferenças de comportamento entre os pacotes RPM mais antigos e os atuais:

**Tabela 2.16 Diferenças entre os pacotes RPM anteriores e os atuais para instalação do MySQL**

<table>
<thead>
<tr>
<th>Característica</th>
<th>Comportamento de pacotes anteriores</th>
<th>Comportamento dos pacotes atuais</th>
</tr>
</thead>
<tbody>
<tr>
<th>O serviço começa após a instalação ser concluída</th>
<td>Sim</td>
<td>Não, a menos que seja uma instalação de atualização e o servidor estivesse em execução quando a atualização começou.</td>
</tr>
<tr>
<th>Nome do serviço</th>
<td>mysql</td>
<td>Para RHEL, Oracle Linux, CentOS e Fedora:<strong>mysqld</strong>Para SLES:<strong>mysql</strong>
</td>
</tr>
<tr>
<th>Arquivo de registro de erro</th>
<td>Em<code>/var/lib/mysql/<code>hostname</code>.err</code></td>
<td>Para RHEL, Oracle Linux, CentOS e Fedora: em<code>/var/log/mysqld.log</code>Para SLES: em<code>/var/log/mysql/mysqld.log</code>
</td>
</tr>
<tr>
<th>Shipped with the <code>/etc/my.cnf</code> file</th>
<td>No</td>
<td>Yes</td>
</tr>
<tr>
<th>Multilib support</th>
<td>No</td>
<td>Yes</td>
</tr>
</tbody>
</table>

Nota

A instalação de versões anteriores do MySQL usando pacotes mais antigos pode ter criado um arquivo de configuração chamado `/usr/my.cnf`. É altamente recomendável que você examine o conteúdo do arquivo e migre as configurações desejadas para o arquivo `/etc/my.cnf`, e depois remova `/usr/my.cnf`.

**Atualizando para o MySQL Enterprise Server.** Para fazer a atualização de uma versão comunitária para uma versão comercial do MySQL, você deve primeiro desinstalar a versão comunitária e, em seguida, instalar a versão comercial. Nesse caso, você deve reiniciar o servidor manualmente após a atualização.

**Interoperabilidade com pacotes nativos do sistema operacional MySQL.** Muitas distribuições Linux entregam o MySQL como uma parte integrada do sistema operacional. As versões mais recentes dos RPMs da Oracle, quando instaladas usando a ferramenta padrão de gerenciamento de pacotes (**yum**, **dnf** ou **zypper**), atualizam e substituem perfeitamente a versão do MySQL que vem com o sistema operacional, e o gerenciador de pacotes substitui automaticamente os pacotes de compatibilidade do sistema, como `mysql-community-libs-compat`, com as versões novas relevantes.

**Atualizando pacotes de MySQL não nativos.** Se você instalou o MySQL com pacotes de terceiros NÃO provenientes do repositório de software nativo da sua distribuição Linux (por exemplo, pacotes baixados diretamente do fornecedor), você deve desinstalar todos esses pacotes antes de poder fazer a atualização usando os pacotes da Oracle.

### 2.10.11 Solução de problemas de atualização

* Se ocorrerem problemas, como o novo servidor `mysqld` não iniciar, verifique se você não tem um arquivo antigo `my.cnf` da sua instalação anterior. Você pode verificar isso com a opção `--print-defaults` (por exemplo, **mysqld --print-defaults**). Se este comando exibir algo além do nome do programa, você tem um arquivo ativo `my.cnf` que afeta a operação do servidor ou do cliente.

* Se, após uma atualização, você tiver problemas com programas compilados do cliente, como `Commands out of sync` ou descargas inesperadas do núcleo, provavelmente você usou arquivos de cabeçalho ou bibliotecas antigos ao compilar seus programas. Neste caso, verifique a data do seu arquivo `mysql.h` e biblioteca `libmysqlclient.a` para verificar se são da nova distribuição do MySQL. Se não forem, recomponha seus programas com os novos cabeçalhos e bibliotecas. A recompilação também pode ser necessária para programas compilados contra a biblioteca de cliente compartilhada se o número da versão principal da biblioteca tiver mudado (por exemplo, de `libmysqlclient.so.15` para `libmysqlclient.so.16`).

* Se você criou uma função carregável com um nome específico e atualizou o MySQL para uma versão que implementa uma nova função integrada com o mesmo nome, a função carregável se torna inacessível. Para corrigir isso, use `DROP FUNCTION` para descartar a função carregável e, em seguida, use `CREATE FUNCTION` para recriar a função carregável com um nome diferente e não conflitante. O mesmo vale se a nova versão do MySQL implementar uma função integrada com o mesmo nome que uma função armazenada existente. Consulte a Seção 9.2.5, “Parágrafo e Resolução do Nome da Função”, para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções.

### 2.10.12 Reestruturação ou reparação de tabelas ou índices

Esta seção descreve como reconstruir ou reparar tabelas ou índices, o que pode ser necessário por:

* Alterações sobre como o MySQL lida com tipos de dados ou conjuntos de caracteres. Por exemplo, um erro em uma codificação pode ter sido corrigido, o que exige a reconstrução de uma tabela para atualizar os índices para colunas de caracteres que utilizam a codificação.

* Reparos ou atualizações de tabela necessárias relatadas por `CHECK TABLE`, **mysqlcheck** ou `mysqld_upgrade`.

Os métodos para reconstruir uma tabela incluem:

* Método de descarte e recarga
* Método ALTER TABLE
* Método REPAIR TABLE

#### Método de descarte e recarga

Se você está reconstruindo tabelas porque uma versão diferente do MySQL não as pode manipular após uma atualização ou downgrade binário (em local), você deve usar o método de dump e recarregar. Faça o dump das tabelas *antes* de fazer a atualização ou downgrade usando sua versão original do MySQL. Em seguida, recarregue as tabelas *depois* da atualização ou downgrade.

Se você usar o método de descarte e recarga para reconstruir tabelas apenas para a finalidade de reconstruir índices, você pode realizar o descarte antes ou depois da atualização ou redução. A recarga ainda deve ser feita posteriormente.

Se você precisar reconstruir uma tabela `InnoDB` porque uma operação `CHECK TABLE` indica que uma atualização da tabela é necessária, use **mysqldump** para criar um arquivo de dump e **mysql** para recarregar o arquivo. Se a operação `CHECK TABLE` indicar que há uma corrupção ou causa o `InnoDB` a falhar, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”, para obter informações sobre o uso da opção `innodb_force_recovery` para reiniciar o `InnoDB`. Para entender o tipo de problema que o `CHECK TABLE` pode estar enfrentando, consulte as notas do `InnoDB` na Seção 13.7.2.2, “Declaração CHECK TABLE”.

Para reconstruir uma tabela, descartando e recarregando-a, use **mysqldump** para criar um arquivo de dump e **mysql** para recarregar o arquivo:

```sql
mysqldump db_name t1 > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tabelas em um único banco de dados, especifique o nome do banco de dados sem qualquer nome de tabela subsequente:

```sql
mysqldump db_name > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tabelas em todos os bancos de dados, use a opção `--all-databases`:

```sql
mysqldump --all-databases > dump.sql
mysql < dump.sql
```

#### Método ALTER TABLE

Para reconstruir uma tabela com `ALTER TABLE`, use uma alteração “nulo”; ou seja, uma declaração `ALTER TABLE` que “altera” a tabela para usar o mecanismo de armazenamento que ela já tem. Por exemplo, se `t1` é uma tabela `InnoDB`, use esta declaração:

```sql
ALTER TABLE t1 ENGINE = InnoDB;
```

Se você não tiver certeza de qual motor de armazenamento especificar na declaração `ALTER TABLE`, use `SHOW CREATE TABLE` para exibir a definição da tabela.

#### Método de REPARAÇÃO DE TABELA

O método `REPAIR TABLE` só é aplicável às tabelas `MyISAM`, `ARCHIVE` e `CSV`.

Você pode usar `REPAIR TABLE` se a operação de verificação de tabela indicar que há uma corrupção ou que é necessário fazer uma atualização. Por exemplo, para reparar uma tabela `MyISAM`, use esta declaração:

```sql
REPAIR TABLE t1;
```

O **mysqlcheck --repair** oferece acesso à linha de comando à declaração `REPAIR TABLE`. Isso pode ser uma maneira mais conveniente de reparar tabelas, pois você pode usar a opção `--databases` ou `--all-databases` para reparar todas as tabelas em bancos de dados específicos ou todos os bancos de dados, respectivamente:

```sql
mysqlcheck --repair --databases db_name ...
mysqlcheck --repair --all-databases
```

### 2.10.13 Copiar bancos de dados MySQL para outra máquina

Nos casos em que você precisa transferir bancos de dados entre diferentes arquiteturas, você pode usar o **mysqldump** para criar um arquivo contendo declarações SQL. Em seguida, você pode transferir o arquivo para a outra máquina e alimentá-lo como entrada para o cliente **mysql**.

Use **mysqldump --help** para ver quais opções estão disponíveis.

A maneira mais fácil (embora não a mais rápida) de mover um banco de dados entre duas máquinas é executar os seguintes comandos na máquina na qual o banco de dados está localizado:

```sql
mysqladmin -h 'other_hostname' create db_name
mysqldump db_name | mysql -h 'other_hostname' db_name
```

Se você deseja copiar um banco de dados de uma máquina remota em uma rede lenta, pode usar esses comandos:

```sql
mysqladmin create db_name
mysqldump -h 'other_hostname' --compress db_name | mysql db_name
```

Você também pode armazenar o dump em um arquivo, transferir o arquivo para a máquina de destino e, em seguida, carregar o arquivo no banco de dados lá. Por exemplo, você pode dumper um banco de dados em um arquivo comprimido na máquina de origem da seguinte forma:

```sql
mysqldump --quick db_name | gzip > db_name.gz
```

Transfira o arquivo contendo o conteúdo do banco de dados para a máquina de destino e execute esses comandos lá:

```sql
mysqladmin create db_name
gunzip < db_name.gz | mysql db_name
```

Você também pode usar **mysqldump** e **mysqlimport** para transferir o banco de dados. Para tabelas grandes, isso é muito mais rápido do que simplesmente usar **mysqldump**. Nos comandos a seguir, *`DUMPDIR`* representa o nome completo do caminho do diretório que você usa para armazenar o resultado de **mysqldump**.

Primeiro, crie o diretório para os arquivos de saída e faça o dump do banco de dados:

```sql
mkdir DUMPDIR
mysqldump --tab=DUMPDIR db_name
```

Em seguida, transfira os arquivos no diretório *`DUMPDIR`* para algum diretório correspondente na máquina de destino e carregue os arquivos no MySQL lá:

```sql
mysqladmin create db_name           # create database
cat DUMPDIR/*.sql | mysql db_name   # create tables in database
mysqlimport db_name DUMPDIR/*.txt   # load data into tables
```

Não se esqueça de copiar o banco de dados `mysql`, pois é onde as tabelas de concessão são armazenadas. Você pode precisar executar comandos como o usuário `root` do MySQL na nova máquina até que o banco de dados `mysql` esteja pronto.

Depois de importar o banco de dados `mysql` na nova máquina, execute **mysqladmin flush-privileges** para que o servidor recarregue as informações da tabela de concessão.

Nota

Você pode copiar os arquivos `.frm`, `.MYI` e `.MYD` para as tabelas `MyISAM` entre diferentes arquiteturas que suportem o mesmo formato de ponto flutuante. (O MySQL cuida de quaisquer problemas de troca de bytes.) Veja a Seção 15.2, “O Motor de Armazenamento MyISAM”.

