## 3.7 Atualizando instalações binárias ou baseadas em pacotes do MySQL em Unix/Linux

Esta seção descreve como fazer uma atualização das instalações binárias e baseadas em pacotes do MySQL em Unix/Linux. Métodos de atualização local e lógico são descritos.

* Upgrade no local
* Upgrade lógico
* Upgrade do MySQL Cluster

### Upgrade In-Place

Uma atualização in-place envolve desligar o servidor MySQL antigo, substituir os binários ou pacotes MySQL antigos pelos novos, reiniciar o MySQL no diretório de dados existente e atualizar quaisquer partes restantes da instalação existente que precisem de atualização. Para obter detalhes sobre o que pode precisar de atualização, consulte a Seção 3.4, “O que o processo de atualização do MySQL atualiza”.

Nota

Se você está atualizando uma instalação originalmente produzida instalando vários pacotes RPM, atualize todos os pacotes, não apenas alguns. Por exemplo, se você instalou anteriormente os RPMs do servidor e do cliente, não atualize apenas o RPM do servidor.

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.9, “Gerenciando o servidor MySQL com o systemd”.

Para atualizações de instalações do MySQL Cluster, consulte também MySQL Cluster Upgrade.

Para realizar uma atualização local:

1. Revise as informações na Seção 3.1, “Antes de Começar”.

2. Garanta a prontidão da atualização da sua instalação, completando as verificações preliminares na Seção 3.6, “Preparando sua instalação para atualização”.

3. Se você usar transações XA com `InnoDB`, execute [`XA RECOVER`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements") antes de fazer a atualização para verificar transações XA não comprometidas. Se resultados forem retornados, comprometa ou desconsome as transações XA emitindo uma declaração de [`XA COMMIT`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements") ou [`XA ROLLBACK`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements").

4. Se você está atualizando do MySQL 5.7.11 ou versões anteriores para o MySQL 8.0, e há espaços de `InnoDB` criptografados, gire a chave mestre do chaveiro executando esta declaração:

   ```
   ALTER INSTANCE ROTATE INNODB MASTER KEY;
   ```

5. Se você normalmente executa seu servidor MySQL configurado com `innodb_fast_shutdown` definido como `2` (desligamento frio), configure-o para realizar um desligamento rápido ou lento, executando uma das seguintes instruções:

   ```
   SET GLOBAL innodb_fast_shutdown = 1; -- fast shutdown
   SET GLOBAL innodb_fast_shutdown = 0; -- slow shutdown
   ```

Com uma parada rápida ou lenta, o `InnoDB` deixa seus registros de desfazer e arquivos de dados em um estado que pode ser tratado em caso de diferenças de formato de arquivo entre as versões.

6. Desative o servidor MySQL antigo. Por exemplo:

   ```
   mysqladmin -u root -p shutdown
   ```

7. Atualize os binários ou pacotes do MySQL. Se estiver atualizando uma instalação binária, descompacte o novo pacote de distribuição do binário MySQL. Veja Obter e descompacetar a distribuição. Para instalações baseadas em pacotes, instale os novos pacotes.

8. Inicie o servidor MySQL 8.0, usando o diretório de dados existente. Por exemplo:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

Se houver espaços de tabela `InnoDB` criptografados, use a opção `--early-plugin-load` para carregar o plugin de chave.

Quando você inicia o servidor MySQL 8.0, ele detecta automaticamente se as tabelas do dicionário de dados estão presentes. Se não estiverem, o servidor as cria no diretório de dados, as preenche com metadados e, em seguida, prossegue com sua sequência de inicialização normal. Durante esse processo, o servidor atualiza os metadados para todos os objetos do banco de dados, incluindo bancos, espaços de tabela, tabelas de sistema e de usuário, visualizações e programas armazenados (procedimentos armazenados e funções, gatilhos e eventos do Agendamento de Eventos). O servidor também remove arquivos que anteriormente eram usados para armazenamento de metadados. Por exemplo, após a atualização do MySQL 5.7 para o MySQL 8.0, você pode notar que as tabelas não têm mais arquivos `.frm`.

Se essa etapa falhar, o servidor reverte todas as alterações no diretório de dados. Nesse caso, você deve remover todos os arquivos de registro de revisão, iniciar o servidor MySQL 5.7 no mesmo diretório de dados e corrigir a causa de quaisquer erros. Em seguida, realize outro desligamento lento do servidor 5.7 e inicie o servidor MySQL 8.0 para tentar novamente.

9. No passo anterior, o servidor atualiza o dicionário de dados conforme necessário. Agora, é necessário realizar quaisquer operações de atualização restantes:

* A partir do MySQL 8.0.16, o servidor faz isso como parte da etapa anterior, fazendo quaisquer alterações necessárias no banco de dados do sistema `mysql` entre o MySQL 5.7 e o MySQL 8.0, para que você possa aproveitar novos privilégios ou capacidades. Também atualiza as bases de dados do Schema de Desempenho, `INFORMATION_SCHEMA` e `sys` para o MySQL 8.0 e examina todas as bases de dados do usuário em busca de incompatibilidades com a versão atual do MySQL.

* Antes do MySQL 8.0.16, o servidor atualiza apenas o dicionário de dados no passo anterior. Após o servidor MySQL 8.0 iniciar com sucesso, execute **mysql_upgrade** para realizar as tarefas de atualização restantes:

     ```
     mysql_upgrade -u root -p
     ```

Em seguida, desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

     ```
     mysqladmin -u root -p shutdown
     mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
     ```

A primeira vez que você inicia o servidor MySQL 8.0 (em uma etapa anterior), você pode notar mensagens no registro de erro em relação a tabelas não atualizadas. Se o **mysql_upgrade** tiver sido executado com sucesso, não deve haver tais mensagens na segunda vez que você iniciar o servidor.

Nota

O processo de atualização não atualiza o conteúdo das tabelas de fuso horário. Para obter instruções de atualização, consulte a Seção 7.1.15, “Suporte de fuso horário do MySQL Server”.

Se o processo de atualização utilizar o **mysql_upgrade** (ou seja, antes do MySQL 8.0.16), o processo também não atualiza o conteúdo das tabelas de ajuda. Para obter instruções de atualização nesse caso, consulte a Seção 7.1.17, “Suporte de Ajuda do Lado do Servidor”.

### Upgrade Lógico

Uma atualização lógica envolve exportar o SQL da antiga instância do MySQL usando um utilitário de backup ou exportação, como **mysqldump** ou **mysqlpump**, instalar o novo servidor MySQL e aplicar o SQL à sua nova instância do MySQL. Para obter detalhes sobre o que pode precisar ser atualizado, consulte a Seção 3.4, “O que o processo de atualização do MySQL atualiza”.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.9, “Gerenciando o servidor MySQL com o systemd”.

Aviso

Aplicar SQL extraído de uma versão anterior do MySQL a uma nova versão do MySQL pode resultar em erros devido a incompatibilidades introduzidas por novos, alterados, descontinuados ou removidos recursos e capacidades. Consequentemente, o SQL extraído de uma versão anterior do MySQL pode exigir modificação para permitir uma atualização lógica.

Para identificar incompatibilidades antes de fazer a atualização para a versão mais recente do MySQL 8.0, realize as etapas descritas na Seção 3.6, “Preparando sua instalação para atualização”.

Para realizar uma atualização lógica:

1. Revise as informações na Seção 3.1, “Antes de Começar”.

2. Exporte seus dados existentes da instalação anterior do MySQL:

   ```
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

Nota

Utilize as opções `--routines` e `--events` com o **mysqldump** (como mostrado acima) se seus bancos de dados incluem programas armazenados. A opção `--all-databases` inclui todos os bancos de dados no dump, incluindo o banco de dados `mysql` que contém as tabelas do sistema.

Importante

Se você tem tabelas que contêm colunas geradas, use o utilitário **mysqldump** fornecido com o MySQL 5.7.9 ou superior para criar seus arquivos de dump. O utilitário **mysqldump** fornecido em versões anteriores usa sintaxe incorreta para definições de colunas geradas (Bug #20769542). Você pode usar a tabela do esquema de informações `COLUMNS` para identificar tabelas com colunas geradas.

3. Desative o servidor MySQL antigo. Por exemplo:

   ```
   mysqladmin -u root -p shutdown
   ```

4. Instale o MySQL 8.0. Para obter instruções de instalação, consulte o Capítulo 2, *Instalando o MySQL*.

5. Inicie um novo diretório de dados, conforme descrito na Seção 2.9.1, “Inicializando o Diretório de Dados”. Por exemplo:

   ```
   mysqld --initialize --datadir=/path/to/8.0-datadir
   ```

Copie a senha temporária `'root'@'localhost'` exibida na tela ou escrita no seu registro de erro para uso posterior.

6. Inicie o servidor MySQL 8.0, usando o novo diretório de dados. Por exemplo:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/8.0-datadir &
   ```

7. Redefinir a senha do `root`:

   ```
   $> mysql -u root -p
   Enter password: ****  <- enter temporary root password
   ```

   ```
   mysql> ALTER USER USER() IDENTIFIED BY 'your new password';
   ```

8. Carregue o arquivo de dump criado anteriormente no novo servidor MySQL. Por exemplo:

   ```
   mysql -u root -p --force < data-for-upgrade.sql
   ```

Nota

Não é recomendado carregar um arquivo de dump quando GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que utilizam o mecanismo de armazenamento não transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados. Além disso, esteja ciente de que carregar um arquivo de dump de um servidor com GTIDs habilitados em outro servidor com GTIDs habilitados gera diferentes identificadores de transação.

9. Realize quaisquer operações de atualização restantes:

* Em MySQL 8.0.16 e superior, desligue o servidor e, em seguida, reinicie-o com a opção `--upgrade=FORCE` para realizar as tarefas de atualização restantes:

     ```
     mysqladmin -u root -p shutdown
     mysqld_safe --user=mysql --datadir=/path/to/8.0-datadir --upgrade=FORCE &
     ```

Ao reiniciar com `--upgrade=FORCE`, o servidor realiza as alterações necessárias no esquema do sistema `mysql` entre o MySQL 5.7 e o MySQL 8.0, para que você possa aproveitar novos privilégios ou capacidades. Também atualiza o Esquema do Performance Schema, `INFORMATION_SCHEMA` e `sys` para o MySQL 8.0 e examina todos os esquemas de usuário em busca de incompatibilidades com a versão atual do MySQL.

* Antes do MySQL 8.0.16, execute **mysql_upgrade** para realizar as tarefas de atualização restantes:

     ```
     mysql_upgrade -u root -p
     ```

Em seguida, desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

     ```
     mysqladmin -u root -p shutdown
     mysqld_safe --user=mysql --datadir=/path/to/8.0-datadir &
     ```

Nota

O processo de atualização não atualiza o conteúdo das tabelas de fuso horário. Para obter instruções de atualização, consulte a Seção 7.1.15, “Suporte de fuso horário do MySQL Server”.

Se o processo de atualização utilizar o **mysql_upgrade** (ou seja, antes do MySQL 8.0.16), o processo também não atualiza o conteúdo das tabelas de ajuda. Para obter instruções de atualização nesse caso, consulte a Seção 7.1.17, “Suporte de Ajuda do Lado do Servidor”.

Nota

Carregar um arquivo de implantação que contém um esquema MySQL 5.7 `mysql` recria duas tabelas que não são mais usadas: `event` e `proc`. (As tabelas correspondentes do MySQL 8.0 são `events` e `routines`, ambas tabelas do dicionário de dados e protegidas.) Após se certificar de que a atualização foi bem-sucedida, você pode remover as tabelas `event` e `proc` executando essas instruções SQL:

```
DROP TABLE mysql.event;
DROP TABLE mysql.proc;
```

### Atualização do MySQL Cluster

As informações desta seção são complementares ao procedimento de atualização in-place descrito em Atualização In-Place, para uso se você estiver atualizando o MySQL Cluster.

A partir do MySQL 8.0.16, uma atualização do MySQL Cluster pode ser realizada como uma atualização rotineira, seguindo os três passos ordenados habituais:

1. Atualize os nós MGM.  
2. Atualize os nós de dados um de cada vez.  
3. Atualize os nós de API um de cada vez (incluindo servidores MySQL).

A maneira de atualizar cada um dos nós permanece quase a mesma que antes do MySQL 8.0.16, porque há uma separação entre a atualização do dicionário de dados e a atualização das tabelas do sistema. Existem dois passos para atualizar cada um dos `mysqld`:

1. Importe o dicionário de dados.

Comece o novo servidor com a opção `--upgrade=MINIMAL` para atualizar o dicionário de dados, mas não as tabelas do sistema. Isso é essencialmente o mesmo que a ação pré-MySQL 8.0.16 de iniciar o servidor e não invocar **mysql_upgrade**.

O servidor MySQL deve estar conectado ao `NDB` para que esta fase seja concluída. Se houver quaisquer tabelas `NDB` ou `NDBINFO` e o servidor não conseguir se conectar ao clúster, ele sairá com uma mensagem de erro:

   ```
   Failed to Populate DD tables.
   ```

2. Atualize as tabelas do sistema.

Antes do MySQL 8.0.16, o DBA invoca o cliente **mysql_upgrade** para atualizar as tabelas do sistema. A partir do MySQL 8.0.16, o servidor realiza essa ação: Para atualizar as tabelas do sistema, reinicie cada **mysqld** individualmente sem a opção `--upgrade=MINIMAL`.