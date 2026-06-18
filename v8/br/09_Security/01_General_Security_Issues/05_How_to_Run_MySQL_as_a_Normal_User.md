### 8.1.5 Como executar o MySQL como um usuário normal

No Windows, você pode executar o servidor como um serviço do Windows usando uma conta de usuário normal.

Em Linux, para instalações realizadas usando um repositório MySQL ou pacotes RPM, o servidor MySQL **mysqld** deve ser iniciado pelo usuário do sistema operacional local `mysql`. Iniciar por outro usuário do sistema operacional não é suportado pelos scripts de inicialização incluídos como parte dos repositórios MySQL.

No Unix (ou Linux para instalações realizadas com pacotes `tar.gz`), o servidor MySQL **mysqld** pode ser iniciado e executado por qualquer usuário. No entanto, você deve evitar executar o servidor como o usuário Unix `root` por razões de segurança. Para alterar o **mysqld** para executar como um usuário Unix comum e não privilegiado `user_name`, você deve fazer o seguinte:

1. Pare o servidor se ele estiver em execução (use **mysqladmin shutdown**).

2. Altere os diretórios e arquivos do banco de dados para que `user_name` tenha privilégios de leitura e escrita nos mesmos (você pode precisar fazer isso como o usuário Unix `root`):

   ```
   $> chown -R user_name /path/to/mysql/datadir
   ```

   Se você não fizer isso, o servidor não poderá acessar bancos de dados ou tabelas quando estiver rodando como `user_name`.

   Se os diretórios ou arquivos dentro do diretório de dados do MySQL forem links simbólicos, `chown -R` pode não seguir os links simbólicos para você. Se não seguir, você também deve seguir esses links e alterar os diretórios e arquivos que eles apontam.

3. Comece o servidor como usuário `user_name`. Outra alternativa é iniciar o **mysqld** como o usuário Unix `root` e usar a opção `--user=user_name`. O **mysqld** começa e, em seguida, muda para executar como o usuário Unix `user_name` antes de aceitar quaisquer conexões.

4. Para iniciar o servidor como o usuário especificado automaticamente ao iniciar o sistema, especifique o nome do usuário adicionando uma opção `user` ao grupo `[mysqld]` do arquivo de opção `/etc/my.cnf` ou do arquivo de opção `my.cnf` no diretório de dados do servidor. Por exemplo:

   ```
   [mysqld]
   user=user_name
   ```

Se a própria máquina Unix não estiver segura, você deve atribuir senhas à conta MySQL `root` nas tabelas de concessão. Caso contrário, qualquer usuário com uma conta de login naquela máquina pode executar o cliente **mysql** com a opção `--user=root` e realizar qualquer operação. (É uma boa ideia atribuir senhas às contas MySQL, em qualquer caso, mas especialmente quando existem outras contas de login no host do servidor.) Veja a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.
