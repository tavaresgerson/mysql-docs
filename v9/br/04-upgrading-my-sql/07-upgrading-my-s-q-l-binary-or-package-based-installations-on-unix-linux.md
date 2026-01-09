## 3.7 Atualização de Instalações Binárias ou Baseadas em Pacotes do MySQL no Unix/Linux

Esta seção descreve como atualizar as instalações binárias e baseadas em pacotes do MySQL no Unix/Linux. Métodos de atualização local e lógica são descritos.

* Atualização Local
* Atualização Lógica
* Atualização do MySQL Cluster

### Atualização Local

Uma atualização local envolve o desligamento do servidor MySQL antigo, a substituição dos binários ou pacotes MySQL antigos pelos novos, o reinício do MySQL no diretório de dados existente e a atualização de quaisquer partes restantes da instalação existente que precisem de atualização. Para obter detalhes sobre o que pode precisar ser atualizado, consulte a Seção 3.4, “O que o Processo de Atualização do MySQL Atualiza”.

Nota

Se você estiver atualizando uma instalação originalmente produzida instalando vários pacotes RPM, atualize todos os pacotes, não apenas alguns. Por exemplo, se você instalou anteriormente os RPM do servidor e do cliente, não atualize apenas o RPM do servidor.

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, **mysqld_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com o systemd”.

Para atualizações de instalações do MySQL Cluster, consulte também a Atualização do MySQL Cluster.

Para realizar uma atualização local:

1. Revise as informações na Seção 3.1, “Antes de Começar”.

2. Garanta a prontidão da atualização da sua instalação completando os verificações preliminares na Seção 3.6, “Preparando Sua Instalação para Atualização”.

3. Se você usa transações XA com `InnoDB`, execute `XA RECOVER` antes de fazer a atualização para verificar transações XA não confirmadas. Se forem retornados resultados, confirme ou desconfirme as transações XA emitindo uma declaração `XA COMMIT` ou `XA ROLLBACK`.

4. Se você normalmente executa seu servidor MySQL configurado com `innodb_fast_shutdown` definido como `2` (desligamento frio), configure-o para realizar um desligamento rápido ou lento executando uma das seguintes declarações:

   ```
   SET GLOBAL innodb_fast_shutdown = 1; -- fast shutdown
   SET GLOBAL innodb_fast_shutdown = 0; -- slow shutdown
   ```

   Com um desligamento rápido ou lento, o `InnoDB` deixa seus registros de desfazer e arquivos de dados em um estado que pode ser tratado em caso de diferenças no formato de arquivo entre as versões.

5. Desligue o servidor MySQL antigo. Por exemplo:

   ```
   mysqladmin -u root -p shutdown
   ```

6. Atualize os binários ou pacotes do MySQL. Se estiver atualizando uma instalação binária, descompacte o novo pacote de distribuição do binário MySQL. Veja Obter e descompactar a distribuição. Para instalações baseadas em pacotes, instale os novos pacotes.

7. Inicie o servidor MySQL 9.5, usando o diretório de dados existente. Por exemplo:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

   Se houver espaços de tabelas `InnoDB` criptografadas, use a opção `--early-plugin-load` para carregar o plugin keyring.

   Nota

   A opção de inicialização do servidor `--early-plugin-load` é desatualizada e está sujeita à remoção em uma versão futura do MySQL. Veja a descrição desta opção para obter mais informações.

Quando você inicia o servidor MySQL 9.5, ele detecta automaticamente se as tabelas do dicionário de dados estão presentes. Se não estiverem, o servidor cria-as no diretório de dados, preenche-as com metadados e, em seguida, prossegue com sua sequência de inicialização normal. Durante esse processo, o servidor atualiza os metadados para todos os objetos do banco de dados, incluindo bancos de dados, espaços de tabelas, tabelas de sistema e de usuário, visualizações e programas armazenados (procedimentos armazenados e funções, gatilhos e eventos do Agendamento de Eventos). O servidor também remove arquivos que anteriormente eram usados para armazenamento de metadados. Por exemplo, após a atualização do MySQL 9.4 para o MySQL 9.5, você pode notar que as tabelas não têm mais arquivos `.frm`.

Se essa etapa falhar, o servidor reverte todas as alterações no diretório de dados. Nesse caso, você deve remover todos os arquivos de log de refazer, iniciar o servidor MySQL 9.4 no mesmo diretório de dados e corrigir a causa de quaisquer erros. Em seguida, realize outro desligamento lento do servidor 9.4 e inicie o servidor MySQL 9.5 para tentar novamente.

8. Na etapa anterior, o servidor atualiza o dicionário de dados conforme necessário, fazendo quaisquer alterações necessárias no banco de dados do sistema `mysql` entre o MySQL 9.4 e o MySQL 9.5, para que você possa aproveitar novos privilégios ou capacidades. Também atualiza os bancos de dados Performance Schema, `INFORMATION_SCHEMA` e `sys` para o MySQL 9.5 e examina todos os bancos de dados de usuário para incompatibilidades com a versão atual do MySQL.

Nota

O processo de atualização não atualiza o conteúdo das tabelas de fuso horário. Para instruções de atualização, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

### Atualização Lógica

Uma atualização lógica envolve exportar o SQL da antiga instância do MySQL usando um utilitário de backup ou exportação, como **mysqldump**, instalar o novo servidor MySQL e aplicar o SQL à sua nova instância do MySQL. Para obter detalhes sobre o que pode precisar ser atualizado, consulte a Seção 3.4, “O que o processo de atualização do MySQL atualiza”.

Observação

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Consulte a Seção 2.5.9, “Gerenciando o servidor MySQL com o systemd”.

Aviso

Aplicar o SQL extraído de uma versão anterior do MySQL para uma nova versão do MySQL pode resultar em erros devido a incompatibilidades introduzidas por novos, alterados, desatualizados ou removidos recursos e capacidades. Consequentemente, o SQL extraído de uma versão anterior do MySQL pode exigir modificação para permitir uma atualização lógica.

Para identificar incompatibilidades antes de atualizar para a versão mais recente do MySQL 9.5, siga os passos descritos na Seção 3.6, “Preparando sua instalação para atualização”.

Para realizar uma atualização lógica:

1. Revise as informações na Seção 3.1, “Antes de começar”.

2. Exporte seus dados existentes da instalação anterior do MySQL:

   ```
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

   Observação

   Use as opções `--routines` e `--events` com **mysqldump** (como mostrado acima) se suas bases de dados incluem programas armazenados. A opção `--all-databases` inclui todas as bases de dados no dump, incluindo a base de dados `mysql` que contém as tabelas do sistema.

Importante

Se você tiver tabelas que contêm colunas geradas, use o utilitário **mysqldump** fornecido com o MySQL 5.7.9 ou superior para criar seus arquivos de dump. O utilitário **mysqldump** fornecido em versões anteriores usa sintaxe incorreta para definições de colunas geradas (Bug #20769542). Você pode usar a tabela do Schema de Informações `COLUMNS` para identificar tabelas com colunas geradas.

3. Desligue o servidor MySQL antigo. Por exemplo:

   ```
   mysqladmin -u root -p shutdown
   ```

4. Instale o MySQL 9.5. Para instruções de instalação, consulte o Capítulo 2, *Instalando o MySQL*.

5. Inicie um novo diretório de dados, conforme descrito na Seção 2.9.1, “Inicializando o Diretório de Dados”. Por exemplo:

   ```
   mysqld --initialize --datadir=/path/to/9.5-datadir
   ```

   Copie a senha temporária `'root'@'localhost'` exibida na tela ou escrita no seu log de erro para uso posterior.

6. Inicie o servidor MySQL 9.5, usando o novo diretório de dados. Por exemplo:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/9.5-datadir &
   ```

7. Resete a senha `root`:

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

   Observação

   Não é recomendado carregar um arquivo de dump quando GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas de sistema. O **mysqldump** emite instruções DML para as tabelas de sistema que usam o motor de armazenamento não transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados. Além disso, esteja ciente de que carregar um arquivo de dump de um servidor com GTIDs habilitados para outro servidor com GTIDs habilitados gera diferentes identificadores de transação.

9. Realize quaisquer operações de atualização restantes:

   Desligue o servidor, depois reinicie-o com a opção `--upgrade=FORCE` para realizar as tarefas de atualização restantes:

   ```
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/9.5-datadir --upgrade=FORCE &
   ```

Ao reiniciar com `--upgrade=FORCE`, o servidor realiza quaisquer alterações necessárias no esquema do sistema `mysql` entre o MySQL 9.4 e o MySQL 9.5, para que você possa aproveitar novos privilégios ou capacidades. Ele também atualiza o esquema do Gerenciamento de Desempenho, `INFORMATION_SCHEMA` e `sys` para o MySQL 9.5 e examina todos os esquemas de usuário quanto à incompatibilidade com a versão atual do MySQL.

Nota

O processo de atualização não atualiza o conteúdo das tabelas de fuso horário. Para obter instruções de atualização, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

### Atualização do MySQL Cluster

As informações nesta seção são complementares ao procedimento de atualização in-place descrito em Atualização In-Place, para uso se você estiver atualizando o MySQL Cluster.

Uma atualização do MySQL Cluster pode ser realizada como uma atualização rolante regular, seguindo os três passos ordenados habituais:

1. Atualize os nós MGM.
2. Atualize os nós de dados um de cada vez.
3. Atualize os nós API um de cada vez (incluindo os servidores MySQL).

Há dois passos para a atualização de cada `mysqld` individual:

1. Importe o dicionário de dados.

Inicie o novo servidor com a opção `--upgrade=MINIMAL` para atualizar o dicionário de dados, mas não as tabelas do sistema.

O servidor MySQL deve estar conectado ao `NDB` para que essa fase seja concluída. Se existirem tabelas `NDB` ou `NDBINFO` e o servidor não conseguir se conectar ao cluster, ele será encerrado com uma mensagem de erro:

```
   Failed to Populate DD tables.
   ```

2. Atualize as tabelas do sistema reiniciando cada `mysqld` individual sem a opção `--upgrade=MINIMAL`.