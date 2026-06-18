### 6.1.5 Como executar o MySQL como um usuário normal

No Windows, você pode executar o servidor como um serviço do Windows usando uma conta de usuário normal.

Em Linux, para instalações realizadas usando um repositório MySQL, pacotes RPM ou pacotes Debian, o servidor MySQL **mysqld** deve ser iniciado pelo usuário do sistema operacional local `mysql`. Iniciar por outro usuário do sistema operacional não é suportado pelos scripts de inicialização incluídos como parte da instalação.

No Unix (ou Linux para instalações realizadas com pacotes `tar` ou `tar.gz`), o servidor MySQL **mysqld** pode ser iniciado e executado por qualquer usuário. No entanto, você deve evitar executar o servidor como o usuário `root` do Unix por razões de segurança. Para alterar **mysqld** para executar como um usuário Unix comum e não privilegiado *`user_name`*, você deve fazer o seguinte:

1. Pare o servidor se ele estiver em execução (use **mysqladmin shutdown**).

2. Altere os diretórios e arquivos do banco de dados para que o *`user_name`* tenha privilégios de leitura e escrita nos mesmos (você pode precisar fazer isso como o usuário `root` do Unix):

   ```sh
   $> chown -R user_name /path/to/mysql/datadir
   ```

   Se você não fizer isso, o servidor não poderá acessar os bancos de dados ou tabelas quando estiver rodando como *`user_name`*.

   Se os diretórios ou arquivos dentro do diretório de dados do MySQL forem links simbólicos, o comando `chown -R` pode não seguir os links simbólicos. Se isso não acontecer, você também deve seguir esses links e alterar os diretórios e arquivos a que eles se referem.

3. Comece o servidor como usuário *`user_name`*. Outra alternativa é iniciar o **mysqld** como o usuário `root` do Unix e usar a opção `--user=user_name`. O **mysqld** é iniciado e, em seguida, muda para executar como o usuário Unix *`user_name`* antes de aceitar quaisquer conexões.

4. Para iniciar o servidor como o usuário especificado automaticamente ao iniciar o sistema, especifique o nome do usuário adicionando uma opção `user` ao grupo `[mysqld]` do arquivo de opções `/etc/my.cnf` ou do arquivo de opções `my.cnf` no diretório de dados do servidor. Por exemplo:

   ```
   [mysqld]
   user=user_name
   ```

Se a própria máquina Unix não estiver segura, você deve atribuir senhas à conta `root` do MySQL nas tabelas de concessão. Caso contrário, qualquer usuário com uma conta de login naquela máquina pode executar o cliente **mysql** com a opção `--user=root` (mysql-command-options.html#option_mysql_user) e realizar qualquer operação. (É uma boa ideia atribuir senhas às contas do MySQL, em qualquer caso, mas especialmente quando existem outras contas de login no host do servidor.) Veja Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.
