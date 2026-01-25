### 2.11.4 Downgrade de Instalações Baseadas em Binários e Pacotes no Unix/Linux

Esta seção descreve como realizar o downgrade de instalações MySQL baseadas em binários e pacotes no Unix/Linux. São descritos os métodos de downgrade *in-place* e lógico.

* Downgrade In-Place
* Downgrade Lógico

#### Downgrade In-Place

O downgrade *in-place* envolve o desligamento da nova versão do MySQL, a substituição dos novos binários ou pacotes do MySQL pelos antigos e a reinicialização da versão antiga do MySQL no diretório de *data* existente.

O downgrade *in-place* é suportado para downgrades entre *releases* GA (General Availability) dentro da mesma série de *release*.

O downgrade *in-place* não é suportado para instalações de repositórios MySQL APT, SLES e Yum.

Note

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao `systemd` para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado. Nesses casos, use o `systemd` para inicialização e desligamento do servidor em vez dos métodos utilizados nas instruções a seguir. Consulte a Seção 2.5.10, “Gerenciamento do Servidor MySQL com systemd”.

Para realizar um downgrade *in-place*:

1. Revise as informações na Seção 2.11.1, “Antes de Começar”.

2. Se você usa XA transactions com `InnoDB`, execute `XA RECOVER` antes do downgrade para verificar se há XA transactions não consolidadas (*uncommitted*). Se houver resultados, faça o `commit` ou `rollback` das XA transactions emitindo uma instrução `XA COMMIT` ou `XA ROLLBACK`.

3. Configure o MySQL para realizar um *slow shutdown* (desligamento lento) definindo `innodb_fast_shutdown` como `0`. Por exemplo:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

   Com um *slow shutdown*, o `InnoDB` executa um *full purge* e *change buffer merge* antes de desligar, o que garante que os arquivos de *data* estejam totalmente preparados em caso de diferenças de formato de arquivo entre *releases*.

4. Desligue o servidor MySQL mais novo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

5. Após o *slow shutdown*, remova os arquivos de *redo log* do `InnoDB` (os arquivos `ib_logfile*`) do diretório *data* para evitar problemas de downgrade relacionados a alterações no formato de arquivo de *redo log* que possam ter ocorrido entre *releases*.

   ```sql
   rm ib_logfile*
   ```

6. Faça o downgrade dos binários ou pacotes do MySQL *in-place* substituindo os binários ou pacotes mais novos pelos antigos.

7. Inicie o servidor MySQL mais antigo (com downgrade), usando o diretório *data* existente. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

8. Execute o **mysql_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql_upgrade** examina todas as *tables* em todos os *databases* em busca de incompatibilidades com a versão atual do MySQL e tenta reparar as *tables* se forem encontrados problemas.

9. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas *system tables* entrem em vigor. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

#### Downgrade Lógico

O downgrade lógico envolve o uso do **mysqldump** para realizar o *dump* de todas as *tables* da nova versão do MySQL e, em seguida, carregar o arquivo de *dump* na versão antiga do MySQL.

Downgrades lógicos são suportados para downgrades entre *releases* dentro da mesma série de *release* e para downgrades para o nível de *release* anterior. Apenas downgrades entre *releases* General Availability (GA) são suportados. Antes de prosseguir, revise a Seção 2.11.1, “Antes de Começar”.

Note

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao `systemd` para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado. Nesses casos, use o `systemd` para inicialização e desligamento do servidor em vez dos métodos utilizados nas instruções a seguir. Consulte a Seção 2.5.10, “Gerenciamento do Servidor MySQL com systemd”.

Para instalações de repositórios MySQL APT, SLES e Yum, apenas downgrades para o nível de *release* anterior são suportados. Onde as instruções solicitarem a inicialização de uma instância mais antiga, use o utilitário de gerenciamento de pacotes para remover os pacotes MySQL 5.7 e instalar os pacotes MySQL 5.6.

Para realizar um downgrade lógico:

1. Revise as informações na Seção 2.11.1, “Antes de Começar”.

2. Faça o *dump* de todos os *databases*. Por exemplo:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-downgrade.sql
   ```

3. Desligue o servidor MySQL mais novo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Para inicializar uma instância MySQL 5.7, use o **mysqld** com a opção `--initialize` ou `--initialize-insecure`.

   ```sql
   mysqld --initialize --user=mysql
   ```

5. Inicie o servidor MySQL mais antigo, usando o novo diretório *data*. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```

6. Carregue o arquivo de *dump* no servidor MySQL mais antigo. Por exemplo:

   ```sql
   mysql -u root -p --force < data-for-upgrade.sql
   ```

7. Execute o **mysql_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql_upgrade** examina todas as *tables* em todos os *databases* em busca de incompatibilidades com a versão atual do MySQL e tenta reparar as *tables* se forem encontrados problemas.

8. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas *system tables* entrem em vigor. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```