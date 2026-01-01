### 2.11.4 Desatualização de Instalações Binárias e Baseadas em Pacotes no Unix/Linux

Esta seção descreve como fazer uma atualização para uma versão anterior das instalações binárias e baseadas em pacotes do MySQL no Unix/Linux. Métodos de atualização local e lógica são descritos.

- Desgaste no local
- Desclassificação lógica

#### Desgaste no local

A atualização para uma versão anterior envolve o desligamento da nova versão do MySQL, a substituição dos binários ou pacotes do MySQL novos pelos antigos e o reinício da versão antiga do MySQL no diretório de dados existente.

A desativação local é suportada para desativar versões GA dentro da mesma série de versões.

A atualização para uma versão anterior não é suportada para instalações de repositórios MySQL APT, SLES e Yum.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld\_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.

Para realizar uma atualização para uma versão anterior no mesmo local:

1. Revise as informações na Seção 2.11.1, “Antes de Começar”.

2. Se você estiver usando transações XA com o `InnoDB`, execute `XA RECOVER` antes de fazer a atualização para verificar se há transações XA não confirmadas. Se os resultados forem retornados, confirme ou desconfirme as transações XA emitindo uma declaração `XA COMMIT` ou `XA ROLLBACK`.

3. Configure o MySQL para realizar um desligamento lento, definindo `innodb_fast_shutdown` para `0`. Por exemplo:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

   Com uma parada lenta, o `InnoDB` realiza uma purga completa e a fusão do buffer de alteração antes de desligar, o que garante que os arquivos de dados estejam totalmente preparados para o caso de diferenças no formato de arquivo entre as versões.

4. Desligue o servidor MySQL mais recente. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

5. Após o desligamento lento, remova os arquivos de log de refazer `InnoDB` (os arquivos `ib_logfile*`) do diretório `data` para evitar problemas de downgrade relacionados a mudanças no formato dos arquivos de log de refazer que possam ter ocorrido entre as versões.

   ```sql
   rm ib_logfile*
   ```

6. Desgrade o binário ou pacote MySQL no local, substituindo os binários ou pacotes mais recentes pelos mais antigos.

7. Inicie o servidor MySQL mais antigo (despromovido) usando o diretório de dados existente. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

8. Execute **mysql\_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql\_upgrade** analisa todas as tabelas em todos os bancos de dados quanto à incompatibilidade com a versão atual do MySQL e tenta reparar as tabelas se problemas forem encontrados.

9. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir
   ```

#### Desclassificação lógica

A desativação lógica envolve o uso do **mysqldump** para fazer o dump de todas as tabelas da nova versão do MySQL e, em seguida, carregar o arquivo de dump na versão antiga do MySQL.

As despromoções lógicas são suportadas para despromoções entre versões dentro da mesma série de lançamento e para despromoções para o nível de versão anterior. Apenas as despromoções entre versões de Disponibilidade Geral (GA) são suportadas. Antes de prosseguir, revise a Seção 2.11.1, “Antes de Começar”.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld\_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.

Para instalações de repositórios do MySQL APT, SLES e Yum, apenas são suportadas reduções para o nível de lançamento anterior. Quando as instruções solicitam a inicialização de uma instância mais antiga, use o utilitário de gerenciamento de pacotes para remover os pacotes do MySQL 5.7 e instalar os pacotes do MySQL 5.6.

Para realizar uma desativação lógica:

1. Revise as informações na Seção 2.11.1, “Antes de Começar”.

2. Descarte todas as bases de dados. Por exemplo:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-downgrade.sql
   ```

3. Desligue o servidor MySQL mais recente. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Para inicializar uma instância do MySQL 5.7, use o **mysqld** com a opção `--initialize` ou `--initialize-insecure`.

   ```sql
   mysqld --initialize --user=mysql
   ```

5. Inicie o servidor MySQL mais antigo, usando o novo diretório de dados. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```

6. Carregue o arquivo de dump no servidor MySQL mais antigo. Por exemplo:

   ```sql
   mysql -u root -p --force < data-for-upgrade.sql
   ```

7. Execute **mysql\_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql\_upgrade** analisa todas as tabelas em todos os bancos de dados quanto à incompatibilidade com a versão atual do MySQL e tenta reparar as tabelas se problemas forem encontrados.

8. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/new-datadir
   ```
