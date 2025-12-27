### 8.1.5 Como executar o MySQL como um usuário normal

No Windows, você pode executar o servidor como um serviço do Windows usando uma conta de usuário normal.

No Linux, para instalações realizadas usando um repositório MySQL ou pacotes RPM, o servidor MySQL `mysqld` deve ser iniciado pelo usuário do sistema operacional local `mysql`. Iniciar com outro usuário do sistema operacional não é suportado pelos scripts de inicialização incluídos como parte dos repositórios MySQL.

No Unix (ou Linux para instalações realizadas usando pacotes `tar.gz`), o servidor MySQL `mysqld` pode ser iniciado e executado por qualquer usuário. No entanto, você deve evitar executar o servidor como o usuário Unix `root` por razões de segurança. Para alterar o `mysqld` para executar como um usuário Unix normal e não privilegiado *`user_name`*, você deve fazer o seguinte:

1. Parar o servidor se ele estiver em execução (use `mysqladmin shutdown`).
2. Alterar os diretórios e arquivos de banco de dados para que *`user_name`* tenha permissão para ler e escrever arquivos neles (você pode precisar fazer isso como o usuário `root` do Unix):

   ```
   $> chown -R user_name /path/to/mysql/datadir
   ```

   Se você não fizer isso, o servidor não poderá acessar bancos de dados ou tabelas quando estiver executando como *`user_name`*.

   Se diretórios ou arquivos dentro do diretório de dados MySQL forem links simbólicos, o `chown -R` pode não seguir links simbólicos para você. Se não seguir, você também deve seguir esses links e alterar os diretórios e arquivos que eles apontam.
3. Iniciar o servidor como o usuário *`user_name`*. Outra alternativa é iniciar `mysqld` como o usuário `root` do Unix e usar a opção `--user=user_name`. `mysqld` inicia, depois muda para executar como o usuário Unix *`user_name`* antes de aceitar quaisquer conexões.
4. Para iniciar o servidor como o usuário fornecido automaticamente no momento do início do sistema, especifique o nome do usuário adicionando uma opção `user` ao grupo `[mysqld]` do arquivo de opção `/etc/my.cnf` ou do arquivo de opção `my.cnf` no diretório de dados do servidor. Por exemplo:

   ```
   [mysqld]
   user=user_name
   ```

Se a própria máquina Unix não estiver segura, você deve atribuir senhas à conta `root` do MySQL nas tabelas de concessão. Caso contrário, qualquer usuário com uma conta de login naquela máquina pode executar o cliente `mysql` com a opção `--user=root` e realizar qualquer operação. (É uma boa ideia atribuir senhas às contas do MySQL, em qualquer caso, mas especialmente quando existem outras contas de login no host do servidor.) Veja a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.