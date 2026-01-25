### 6.1.5 Como Executar o MySQL como um Usuário Normal

No Windows, você pode executar o server como um Windows Service usando uma conta de usuário normal.

No Linux, para instalações realizadas usando um repositório MySQL, pacotes RPM ou pacotes Debian, o MySQL server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve ser iniciado pelo usuário local do sistema operacional `mysql`. A inicialização por outro usuário do sistema operacional não é suportada pelos `init scripts` que são incluídos como parte da instalação.

No Unix (ou Linux para instalações realizadas usando pacotes `tar` ou `tar.gz`), o MySQL server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") pode ser iniciado e executado por qualquer usuário. No entanto, você deve evitar executar o server como o usuário `root` do Unix por razões de segurança. Para alterar [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para ser executado como um usuário Unix normal sem privilégios (*unprivileged*) *`user_name`*, você deve fazer o seguinte:

1. Pare o server se ele estiver em execução (use [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — Um Programa de Administração do MySQL Server")).

2. Altere os `directories` e arquivos do `database` para que *`user_name`* tenha privilégios de leitura e escrita nos arquivos (você pode precisar fazer isso como o usuário `root` do Unix):

   ```sql
   $> chown -R user_name /path/to/mysql/datadir
   ```

   Se você não fizer isso, o server não conseguirá acessar `databases` ou `tables` quando for executado como *`user_name`*.

   Se `directories` ou arquivos dentro do `data directory` do MySQL forem `symbolic links`, o `chown -R` pode não seguir os `symbolic links` automaticamente. Se isso ocorrer, você deve seguir esses `links` e alterar também os `directories` e arquivos para os quais eles apontam.

3. Inicie o server como o usuário *`user_name`*. Outra alternativa é iniciar [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como o usuário `root` do Unix e usar a `option` [`--user=user_name`](server-options.html#option_mysqld_user). O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") inicia e, em seguida, alterna para ser executado como o usuário Unix *`user_name`* antes de aceitar qualquer `connection`.

4. Para iniciar o server como o usuário especificado automaticamente na inicialização do sistema (`system startup time`), defina o nome de usuário adicionando uma `user option` ao grupo `[mysqld]` no arquivo de `option` `/etc/my.cnf` ou no arquivo de `option` `my.cnf` localizado no `data directory` do server. Por exemplo:

   ```sql
   [mysqld]
   user=user_name
   ```

Se sua máquina Unix não estiver segura, você deve atribuir `passwords` à conta `root` do MySQL nas `grant tables`. Caso contrário, qualquer usuário com uma conta de `login` nessa máquina pode executar o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") `client` com a `option` [`--user=root`](mysql-command-options.html#option_mysql_user) e realizar qualquer operação. (É uma boa prática atribuir `passwords` às contas MySQL em qualquer caso, mas especialmente quando outras contas de `login` existem no `server host`.) Consulte [Seção 2.9.4, “Protegendo a Conta Inicial do MySQL”](default-privileges.html "2.9.4 Securing the Initial MySQL Account").