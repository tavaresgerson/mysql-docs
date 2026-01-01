### 2.10.4 Atualização de instalações binárias ou baseadas em pacotes do MySQL no Unix/Linux

Esta seção descreve como atualizar as instalações binárias e baseadas em pacotes do MySQL no Unix/Linux. Métodos de atualização local e lógica são descritos.

- Atualização no mesmo local
- Atualização lógica

#### Atualização no mesmo local

Uma atualização in-place envolve o desligamento do servidor MySQL antigo, a substituição dos binários ou pacotes MySQL antigos pelos novos, o reinício do MySQL no diretório de dados existente e a atualização de quaisquer partes restantes da instalação existente que precisem ser atualizadas.

Nota

Atualize apenas uma instância do servidor MySQL que foi desligada corretamente. Se a instância desligar inesperadamente, reinicie-a e desligue-a com `innodb_fast_shutdown=0` antes da atualização.

Nota

Se você atualizar uma instalação originalmente produzida instalando vários pacotes RPM, atualize todos os pacotes, não apenas alguns. Por exemplo, se você instalou anteriormente os RPMs do servidor e do cliente, não atualize apenas o RPM do servidor.

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld\_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.

Para realizar uma atualização local:

1. Se você estiver usando transações XA com o `InnoDB`, execute `XA RECOVER` antes de fazer a atualização para verificar transações XA não confirmadas. Se os resultados forem retornados, confirme ou desconfirme as transações XA emitindo uma declaração `XA COMMIT` ou `XA ROLLBACK`.

2. Configure o MySQL para realizar um desligamento lento, definindo `innodb_fast_shutdown` para `0`. Por exemplo:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

   Com uma parada lenta, o `InnoDB` realiza uma purga completa e a fusão do buffer de alteração antes de desligar, o que garante que os arquivos de dados estejam totalmente preparados para o caso de diferenças no formato de arquivo entre as versões.

3. Desligue o servidor MySQL antigo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Atualize a instalação ou os pacotes binários do MySQL. Se estiver atualizando uma instalação binária, descompacte o novo pacote de distribuição binária do MySQL. Consulte Obter e descompacetar a distribuição. Para instalações baseadas em pacotes, instale os novos pacotes.

5. Inicie o servidor MySQL 5.7, usando o diretório de dados existente. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

6. Execute **mysql\_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql\_upgrade** analisa todas as tabelas em todos os bancos de dados para encontrar incompatibilidades com a versão atual do MySQL. O **mysql\_upgrade** também atualiza o banco de dados do sistema **mysql** para que você possa aproveitar novos privilégios ou capacidades.

   Nota

   O **mysql\_upgrade** não atualiza o conteúdo das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”, e a Seção 5.1.14, “Suporte ao Ajuda no Servidor”.

7. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

#### Atualização lógica

Uma atualização lógica envolve exportar o SQL da antiga instância do MySQL usando um utilitário de backup ou exportação, como **mysqldump** ou **mysqlpump**, instalar o novo servidor MySQL e aplicar o SQL à sua nova instância do MySQL.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld\_safe** não é instalado. Nesses casos, use o systemd para o início e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Veja a Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.

Para realizar uma atualização lógica:

1. Revise as informações na Seção 2.10.1, “Antes de Começar”.

2. Exporte seus dados existentes da instalação anterior do MySQL:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

   Nota

   Use as opções `--routines` e `--events` com o **mysqldump** (como mostrado acima) se seus bancos de dados incluem programas armazenados. A opção `--all-databases` inclui todos os bancos de dados no dump, incluindo o banco de dados `mysql` que contém as tabelas do sistema.

   Importante

   Se você tem tabelas que contêm colunas geradas, use o utilitário **mysqldump** fornecido com o MySQL 5.7.9 ou superior para criar seus arquivos de dump. O utilitário **mysqldump** fornecido em versões anteriores usa sintaxe incorreta para definições de colunas geradas (Bug #20769542). Você pode usar a tabela `COLUMNS` do Schema de Informações para identificar tabelas com colunas geradas.

3. Desligue o servidor MySQL antigo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Instale o MySQL 5.7. Para obter instruções de instalação, consulte o Capítulo 2, *Instalando e Atualizando o MySQL*.

5. Inicialize um novo diretório de dados, conforme descrito na Seção 2.9.1, “Inicializando o Diretório de Dados”. Por exemplo:

   ```sql
   mysqld --initialize --datadir=/path/to/5.7-datadir
   ```

   Copie a senha temporária `'root'@'localhost'` exibida na tela ou escrita no log de erro para uso posterior.

6. Inicie o servidor MySQL 5.7, usando o novo diretório de dados. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
   ```

7. Reinicie a senha do `root`:

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

   Não é recomendado carregar um arquivo de dump quando os GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que usam o motor de armazenamento não transacional MyISAM, e essa combinação não é permitida quando os GTIDs estão habilitados. Além disso, esteja ciente de que carregar um arquivo de dump de um servidor com GTIDs habilitados para outro servidor com GTIDs habilitados gera identificadores de transação diferentes.

9. Execute **mysql\_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql\_upgrade** analisa todas as tabelas em todos os bancos de dados para encontrar incompatibilidades com a versão atual do MySQL. O **mysql\_upgrade** também atualiza o banco de dados do sistema **mysql** para que você possa aproveitar novos privilégios ou capacidades.

   Nota

   O **mysql\_upgrade** não atualiza o conteúdo das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”, e a Seção 5.1.14, “Suporte ao Ajuda no Servidor”.

10. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas tabelas do sistema sejam efetivas. Por exemplo:

    ```sql
    mysqladmin -u root -p shutdown
    mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
    ```
