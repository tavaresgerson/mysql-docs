#### B.3.3.2 Como redefinir a senha de root

Se você nunca tiver atribuído uma senha de `root` para o MySQL, o servidor não exigirá nenhuma senha para se conectar como `root`. No entanto, isso é inseguro. Para obter instruções sobre como atribuir uma senha, consulte [Seção 2.9.4, “Segurança da Conta Inicial do MySQL”](default-privileges.html).

Se você conhece a senha do `root` e deseja alterá-la, consulte [Seção 13.7.1.1, "Instrução ALTER USER"](alter-user.html) e [Seção 13.7.1.7, "Instrução SET PASSWORD"](set-password.html).

Se você definiu uma senha de `root` anteriormente, mas esqueceu-a, você pode definir uma nova senha. As seções a seguir fornecem instruções para sistemas Windows e Unix e sistemas semelhantes ao Unix, além de instruções genéricas que se aplicam a qualquer sistema.

##### B.3.3.2.1. Redefinir a senha de root: Sistemas Windows

No Windows, use o seguinte procedimento para redefinir a senha da conta `'root'@'localhost'` do MySQL. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

1. Faça login no seu sistema como Administrador.

2. Pare o servidor MySQL se ele estiver em execução. Para um servidor que está em execução como um serviço do Windows, vá para o Gerenciador de Serviços: No menu Iniciar, selecione Painel de Controle, depois Ferramentas Administrativas, depois Serviços. Encontre o serviço MySQL na lista e pare-o.

   Se o seu servidor não estiver rodando como serviço, você pode precisar usar o Gerenciador de Tarefas para forçá-lo a parar.

3. Crie um arquivo de texto contendo a declaração de atribuição de senha em uma única linha. Substitua a senha pela senha que você deseja usar.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Salve o arquivo. Este exemplo assume que você nomeia o arquivo como `C:\mysql-init.txt`.

5. Abra uma janela do console para acessar o prompt de comando: No menu Iniciar, selecione Executar e, em seguida, insira **cmd** como o comando a ser executado.

6. Inicie o servidor MySQL com a variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) definida para nomear o arquivo (observe que o traço duplo na opção de valor é necessário):

   ```sql
   C:\> cd "C:\Program Files\MySQL\MySQL Server 5.7\bin"
   C:\> mysqld --init-file=C:\\mysql-init.txt
   ```

   Se você instalou o MySQL em um local diferente, ajuste o comando **cd** conforme necessário.

   O servidor executa o conteúdo do arquivo nomeado pela variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) ao iniciar, alterando a senha da conta `'root'@'localhost'`.

   Para que a saída do servidor apareça na janela do console em vez de em um arquivo de log, adicione a opção [`--console`](server-options.html#option_mysqld_console) ao comando [**mysqld**](mysqld.html).

   Se você instalou o MySQL usando o Assistente de instalação do MySQL, talvez precise especificar a opção [`--defaults-file`](option-file-options.html#option_general_defaults-file). Por exemplo:

   ```sql
   C:\> mysqld
            --defaults-file="C:\\ProgramData\\MySQL\\MySQL Server 5.7\\my.ini"
            --init-file=C:\\mysql-init.txt
   ```

   A configuração apropriada [`--defaults-file`](option-file-options.html#option_general_defaults-file) pode ser encontrada usando o Gerenciador de Serviços: No menu Iniciar, selecione Painel de Controle, depois Ferramentas Administrativas, depois Serviços. Encontre o serviço MySQL na lista, clique com o botão direito nele e escolha a opção `Propriedades`. O campo `Caminho para executável` contém a configuração [`--defaults-file`](option-file-options.html#option_general_defaults-file).

7. Depois que o servidor tiver iniciado com sucesso, exclua `C:\mysql-init.txt`.

Agora você deve conseguir se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor MySQL e reiniciá-lo normalmente. Se você estiver executando o servidor como um serviço, inicie-o a partir da janela Serviços do Windows. Se você iniciar o servidor manualmente, use o comando que você normalmente usa.

Se a instrução [`ALTER USER`](alter-user.html) não conseguir redefinir a senha, tente repetir o procedimento usando as seguintes instruções para modificar diretamente a tabela `user`:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.2 Redefinindo a Senha de Root: Sistemas Unix e Unix-Like

No Unix, use o seguinte procedimento para redefinir a senha da conta `'root'@'localhost'` do MySQL. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

As instruções assumem que você inicia o servidor MySQL a partir da conta de login Unix que você normalmente usa para executá-lo. Por exemplo, se você executar o servidor usando a conta de login `mysql`, você deve fazer login como `mysql` antes de usar as instruções. Alternativamente, você pode fazer login como `root`, mas, nesse caso, você *deve* iniciar o [**mysqld**](mysqld.html) com a opção [`--user=mysql`](server-options.html#option_mysqld_user). Se você iniciar o servidor como `root` sem usar a opção [`--user=mysql`](server-options.html#option_mysqld_user), o servidor pode criar arquivos de propriedade de `root` no diretório de dados, como arquivos de log, e isso pode causar problemas relacionados a permissões para futuras inicializações do servidor. Se isso acontecer, você deve alterar a propriedade dos arquivos para `mysql` ou removê-los.

1. Faça login no seu sistema como o usuário Unix no qual o servidor MySQL está rodando (por exemplo, `mysql`).

2. Pare o servidor MySQL se ele estiver em execução. Localize o arquivo `.pid` que contém o ID do processo do servidor. A localização exata e o nome deste arquivo dependem da sua distribuição, nome do host e configuração. Locais comuns são `/var/lib/mysql/`, `/var/run/mysqld/` e `/usr/local/mysql/data/`. Geralmente, o nome do arquivo tem a extensão `.pid` e começa com `mysqld` ou com o nome do host do seu sistema.

   Pare o servidor MySQL enviando um `kill` normal (não `kill -9`) ao processo [**mysqld**](mysqld.html). Use o nome real do caminho do arquivo `.pid` no seguinte comando:

   ```sql
   $> kill `cat /mysql-data-directory/host_name.pid`
   ```

   Use backticks (não as aspas simples) com o comando `cat`. Esses fazem com que a saída do `cat` seja substituída pelo comando `kill`.

3. Crie um arquivo de texto contendo a declaração de atribuição de senha em uma única linha. Substitua a senha pela senha que você deseja usar.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Salve o arquivo. Este exemplo assume que você nomeia o arquivo `/home/me/mysql-init`. O arquivo contém a senha, então não o salve em um local onde ele possa ser lido por outros usuários. Se você não estiver logado como `mysql` (o usuário pelo qual o servidor é executado), certifique-se de que o arquivo tenha permissões que permitam que o `mysql` o leia.

5. Inicie o servidor MySQL com a variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) definida para nomear o arquivo:

   ```sql
   $> mysqld --init-file=/home/me/mysql-init &
   ```

   O servidor executa o conteúdo do arquivo nomeado pela variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) ao iniciar, alterando a senha da conta `'root'@'localhost'`.

   Outras opções também podem ser necessárias, dependendo de como você normalmente inicia seu servidor. Por exemplo, [`--defaults-file`](option-file-options.html#option_general_defaults-file) pode ser necessário antes do argumento [`init_file`](server-system-variables.html#sysvar_init_file).

6. Depois que o servidor tiver iniciado com sucesso, exclua `/home/me/mysql-init`.

Agora você deve conseguir se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor e reiniciá-lo normalmente.

Se a instrução [`ALTER USER`](alter-user.html) não conseguir redefinir a senha, tente repetir o procedimento usando as seguintes instruções para modificar diretamente a tabela `user`:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.3. Redefinir a senha de root: instruções genéricas

As seções anteriores fornecem instruções para redefinir a senha especificamente para sistemas Windows e Unix e sistemas semelhantes ao Unix. Alternativamente, em qualquer plataforma, você pode redefinir a senha usando o cliente [**mysql**](mysql.html) (mas essa abordagem é menos segura):

1. Interrompa o servidor MySQL, se necessário, e reinicie-o com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables). Isso permite que qualquer pessoa se conecte sem senha e com todos os privilégios, e desabilita declarações de gerenciamento de contas, como [`ALTER USER`](alter-user.html) e [`SET PASSWORD`](set-password.html). Como isso é inseguro, você pode querer usar [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) em conjunto com a habilitação da variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) para impedir que clientes remotos se conectem. Em plataformas Windows, se você habilitar `skip_networking`, também deve habilitar [`shared_memory`](server-system-variables.html#sysvar_shared_memory) ou [`named_pipe`](server-system-variables.html#sysvar_named_pipe); caso contrário, o servidor não poderá ser iniciado.

2. Conecte-se ao servidor MySQL usando o cliente [**mysql**](mysql.html); não é necessário digitar a senha, pois o servidor foi iniciado com [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables):

   ```sql
   $> mysql
   ```

3. No cliente `mysql`, peça ao servidor para recarregar as tabelas de concessão para que as declarações de gerenciamento de contas funcionem:

   ```sql
   mysql> FLUSH PRIVILEGES;
   ```

   Em seguida, altere a senha da conta `'root'@'localhost'`. Substitua a senha pela senha que você deseja usar. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

   ```sql
   mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

Agora você deve conseguir se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor e reiniciá-lo normalmente (sem a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) e sem habilitar a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking)).

Se a instrução [`ALTER USER`](alter-user.html) não conseguir redefinir a senha, tente repetir o procedimento usando as seguintes instruções para modificar diretamente a tabela `user`:

```sql
UPDATE mysql.user SET authentication_string = PASSWORD('MyNewPass')
WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```
