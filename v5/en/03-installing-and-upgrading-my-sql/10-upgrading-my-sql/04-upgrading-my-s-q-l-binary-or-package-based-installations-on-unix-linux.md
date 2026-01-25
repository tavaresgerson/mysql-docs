### 2.10.4 Atualizando Instalações Binárias ou Baseadas em Pacotes MySQL no Unix/Linux

Esta seção descreve como atualizar instalações MySQL binárias e baseadas em pacotes no Unix/Linux. Os métodos de atualização *in-place* e lógico são descritos.

* Atualização In-Place
* Atualização Lógica

#### Atualização In-Place

Uma atualização *in-place* envolve o desligamento do servidor MySQL antigo, a substituição dos *binaries* ou pacotes MySQL antigos pelos novos, a reinicialização do MySQL sobre o *data directory* existente e a atualização de quaisquer partes restantes da instalação existente que exijam atualização.

**Nota**

Atualize apenas uma instância do servidor MySQL que tenha sido desligada corretamente. Se a instância foi desligada inesperadamente (*unexpectedly shutdown*), reinicie a instância e desligue-a com `innodb_fast_shutdown=0` antes da atualização (*upgrade*).

**Nota**

Se você atualizar uma instalação originalmente produzida pela instalação de múltiplos pacotes RPM, atualize todos os pacotes, e não apenas alguns. Por exemplo, se você instalou anteriormente os RPMs do servidor e do *client*, não atualize apenas o RPM do servidor.

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao `systemd` para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado. Nesses casos, use o `systemd` para a inicialização e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Consulte a Seção 2.5.10, “Gerenciando o Servidor MySQL com systemd”.

Para realizar uma atualização *in-place*:

1. Se você usa XA transactions com `InnoDB`, execute `XA RECOVER` antes de atualizar para verificar se há XA transactions não confirmadas. Se houver resultados retornados, confirme ou reverta as XA transactions emitindo uma instrução `XA COMMIT` ou `XA ROLLBACK`.

2. Configure o MySQL para realizar um desligamento lento, definindo `innodb_fast_shutdown` como `0`. Por exemplo:

   ```sql
   mysql -u root -p --execute="SET GLOBAL innodb_fast_shutdown=0"
   ```

   Com um desligamento lento, o `InnoDB` executa um *full purge* e a *change buffer merge* antes de desligar, o que garante que os arquivos de dados estejam totalmente preparados em caso de diferenças no formato de arquivo entre as versões.

3. Desligue o servidor MySQL antigo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Atualize a instalação binária ou os pacotes MySQL. Se estiver atualizando uma instalação binária, descompacte o novo pacote de distribuição binária MySQL. Consulte Obter e Descompactar a Distribuição. Para instalações baseadas em pacotes, instale os novos pacotes.

5. Inicie o servidor MySQL 5.7, usando o *data directory* existente. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

6. Execute o **mysql_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql_upgrade** examina todas as *tables* em todos os *databases* em busca de incompatibilidades com a versão atual do MySQL. O **mysql_upgrade** também atualiza o *database* de sistema `mysql` para que você possa aproveitar novos *privileges* ou recursos.

   **Nota**

   O **mysql_upgrade** não atualiza o conteúdo das *time zone tables* ou *help tables*. Para instruções de atualização, consulte a Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”, e a Seção 5.1.14, “Suporte a Help no Lado do Servidor”.

7. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas *system tables* entrem em vigor. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

#### Atualização Lógica

Uma atualização lógica envolve a exportação de SQL da instância MySQL antiga usando uma utilidade de *backup* ou exportação como **mysqldump** ou **mysqlpump**, a instalação do novo servidor MySQL e a aplicação do SQL na sua nova instância MySQL.

**Nota**

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao `systemd` para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_safe** não é instalado. Nesses casos, use o `systemd` para a inicialização e o desligamento do servidor em vez dos métodos usados nas instruções a seguir. Consulte a Seção 2.5.10, “Gerenciando o Servidor MySQL com systemd”.

Para realizar uma atualização lógica:

1. Revise as informações na Seção 2.10.1, “Antes de Começar”.

2. Exporte seus dados existentes da instalação MySQL anterior:

   ```sql
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

   **Nota**

   Use as opções `--routines` e `--events` com **mysqldump** (conforme mostrado acima) se seus *databases* incluírem *stored programs*. A opção `--all-databases` inclui todos os *databases* no *dump*, incluindo o *database* `mysql` que contém as *system tables*.

   **Importante**

   Se você tiver *tables* que contêm *generated columns*, use a utilidade **mysqldump** fornecida com MySQL 5.7.9 ou superior para criar seus arquivos de *dump*. A utilidade **mysqldump** fornecida em versões anteriores usa sintaxe incorreta para definições de *generated column* (Bug #20769542). Você pode usar a *Information Schema* `COLUMNS table` para identificar *tables* com *generated columns*.

3. Desligue o servidor MySQL antigo. Por exemplo:

   ```sql
   mysqladmin -u root -p shutdown
   ```

4. Instale o MySQL 5.7. Para instruções de instalação, consulte o Capítulo 2, *Installing and Upgrading MySQL*.

5. Inicialize um novo *data directory*, conforme descrito na Seção 2.9.1, “Inicializando o Data Directory”. Por exemplo:

   ```sql
   mysqld --initialize --datadir=/path/to/5.7-datadir
   ```

   Copie a senha temporária de `'root'@'localhost'` exibida na sua tela ou gravada no seu *error log* para uso posterior.

6. Inicie o servidor MySQL 5.7, usando o novo *data directory*. Por exemplo:

   ```sql
   mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
   ```

7. Redefina a senha do `root`:

   ```sql
   $> mysql -u root -p
   Enter password: ****  <- enter temporary root password
   ```

   ```sql
   mysql> ALTER USER USER() IDENTIFIED BY 'your new password';
   ```

8. Carregue o arquivo de *dump* criado anteriormente no novo servidor MySQL. Por exemplo:

   ```sql
   mysql -u root -p --force < data-for-upgrade.sql
   ```

   **Nota**

   Não é recomendado carregar um arquivo de *dump* quando GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de *dump* incluir *system tables*. O **mysqldump** emite instruções DML para as *system tables* que usam o *storage engine* MyISAM, que não suporta *transactions*, e essa combinação não é permitida quando GTIDs estão habilitados. Esteja ciente também de que carregar um arquivo de *dump* de um servidor com GTIDs habilitados, em outro servidor com GTIDs habilitados, causa a geração de identificadores de *transaction* diferentes.

9. Execute o **mysql_upgrade**. Por exemplo:

   ```sql
   mysql_upgrade -u root -p
   ```

   O **mysql_upgrade** examina todas as *tables* em todos os *databases* em busca de incompatibilidades com a versão atual do MySQL. O **mysql_upgrade** também atualiza o *database* de sistema `mysql` para que você possa aproveitar novos *privileges* ou recursos.

   **Nota**

   O **mysql_upgrade** não atualiza o conteúdo das *time zone tables* ou *help tables*. Para instruções de atualização, consulte a Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”, e a Seção 5.1.14, “Suporte a Help no Lado do Servidor”.

10. Desligue e reinicie o servidor MySQL para garantir que quaisquer alterações feitas nas *system tables* entrem em vigor. Por exemplo:

    ```sql
    mysqladmin -u root -p shutdown
    mysqld_safe --user=mysql --datadir=/path/to/5.7-datadir &
    ```
