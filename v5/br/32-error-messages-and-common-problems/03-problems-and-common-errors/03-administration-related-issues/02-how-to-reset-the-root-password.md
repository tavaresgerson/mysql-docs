#### B.3.3.2 Como Redefinir a Senha do Root

Se você nunca atribuiu uma senha para o `root` do MySQL, o Server não exige senha alguma para conectar como `root`. No entanto, isso é inseguro. Para instruções sobre como atribuir uma senha, consulte [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account").

Se você souber a senha do `root` e quiser alterá-la, consulte [Section 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement") e [Section 13.7.1.7, “SET PASSWORD Statement”](set-password.html "13.7.1.7 SET PASSWORD Statement").

Se você atribuiu uma senha de `root` anteriormente, mas a esqueceu, é possível atribuir uma nova senha. As seções a seguir fornecem instruções para sistemas Windows, Unix e Unix-like, bem como instruções genéricas que se aplicam a qualquer sistema.

##### B.3.3.2.1 Redefinindo a Senha do Root: Sistemas Windows

No Windows, use o procedimento a seguir para redefinir a senha da conta MySQL `'root'@'localhost'`. Para alterar a senha de uma conta `root` com uma parte de `host name` diferente, modifique as instruções para usar esse `host name`.

1. Faça `log on` no seu sistema como Administrator.
2. Pare o MySQL Server se ele estiver em execução. Para um Server que está rodando como um serviço do Windows, vá para o gerenciador de Serviços (`Services manager`): No menu Iniciar (`Start`), selecione Painel de Controle (`Control Panel`), depois Ferramentas Administrativas (`Administrative Tools`), e então Serviços (`Services`). Encontre o serviço MySQL na lista e pare-o.

   Se o seu Server não estiver rodando como um serviço, você pode precisar usar o Gerenciador de Tarefas (`Task Manager`) para forçar a parada.

3. Crie um arquivo de texto contendo a instrução de atribuição de senha em uma única linha. Substitua a senha pela senha que você deseja usar.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Salve o arquivo. Este exemplo pressupõe que você nomeie o arquivo como `C:\mysql-init.txt`.

5. Abra uma janela de console para acessar o prompt de comando: No menu Iniciar (`Start`), selecione Executar (`Run`), e então insira **cmd** como o comando a ser executado.

6. Inicie o MySQL Server com a variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) definida para nomear o arquivo (observe que a barra invertida no valor da opção é duplicada):

   ```sql
   C:\> cd "C:\Program Files\MySQL\MySQL Server 5.7\bin"
   C:\> mysqld --init-file=C:\\mysql-init.txt
   ```

   Se você instalou o MySQL em um local diferente, ajuste o comando **cd** de acordo.

   O Server executa o conteúdo do arquivo nomeado pela variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) na inicialização, alterando a senha da conta `'root'@'localhost'`.

   Para que a saída do Server apareça na janela do console em vez de em um Log File, adicione a opção [`--console`](server-options.html#option_mysqld_console) ao comando [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

   Se você instalou o MySQL usando o Assistente de Instalação do MySQL (`MySQL Installation Wizard`), talvez seja necessário especificar a opção [`--defaults-file`](option-file-options.html#option_general_defaults-file). Por exemplo:

   ```sql
   C:\> mysqld
            --defaults-file="C:\\ProgramData\\MySQL\\MySQL Server 5.7\\my.ini"
            --init-file=C:\\mysql-init.txt
   ```

   A configuração apropriada de [`--defaults-file`](option-file-options.html#option_general_defaults-file) pode ser encontrada usando o Gerenciador de Serviços: No menu Iniciar (`Start`), selecione Painel de Controle (`Control Panel`), depois Ferramentas Administrativas (`Administrative Tools`), e então Serviços (`Services`). Encontre o serviço MySQL na lista, clique com o botão direito e escolha a opção `Properties` (Propriedades). O campo `Path to executable` (Caminho para o executável) contém a configuração de [`--defaults-file`](option-file-options.html#option_general_defaults-file).

7. Depois que o Server iniciar com sucesso, exclua `C:\mysql-init.txt`.

Agora você deve ser capaz de conectar ao MySQL Server como `root` usando a nova senha. Pare o MySQL Server e reinicie-o normalmente. Se você executa o Server como um serviço, inicie-o a partir da janela de Serviços do Windows. Se você iniciar o Server manualmente, use o comando que você usa normalmente.

Se o [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") falhar ao redefinir a senha, tente repetir o procedimento usando as seguintes instruções para modificar a tabela `user` diretamente:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.2 Redefinindo a Senha do Root: Sistemas Unix e Unix-Like

No Unix, use o procedimento a seguir para redefinir a senha da conta MySQL `'root'@'localhost'`. Para alterar a senha de uma conta `root` com uma parte de `host name` diferente, modifique as instruções para usar esse `host name`.

As instruções pressupõem que você inicie o MySQL Server a partir da conta de `login` Unix que você normalmente usa para executá-lo. Por exemplo, se você executa o Server usando a conta de `login` `mysql`, você deve fazer `login` como `mysql` antes de usar as instruções. Alternativamente, você pode fazer `login` como `root`, mas neste caso você *deve* iniciar [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--user=mysql`](server-options.html#option_mysqld_user). Se você iniciar o Server como `root` sem usar [`--user=mysql`](server-options.html#option_mysqld_user), o Server pode criar arquivos pertencentes ao `root` no Data Directory, como Log Files, e isso pode causar problemas relacionados a permissões em futuras inicializações do Server. Se isso acontecer, você deve mudar a posse (`ownership`) dos arquivos para `mysql` ou removê-los.

1. Faça `log on` no seu sistema como o usuário Unix sob o qual o MySQL Server é executado (por exemplo, `mysql`).

2. Pare o MySQL Server se ele estiver em execução. Localize o arquivo `.pid` que contém o Process ID (PID) do Server. A localização exata e o nome deste arquivo dependem da sua distribuição, `host name` e Configuration. Localizações comuns são `/var/lib/mysql/`, `/var/run/mysqld/` e `/usr/local/mysql/data/`. Geralmente, o nome do arquivo tem a extensão `.pid` e começa com `mysqld` ou com o `host name` do seu sistema.

   Pare o MySQL Server enviando um `kill` normal (não `kill -9`) para o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Use o nome de caminho real do arquivo `.pid` no seguinte comando:

   ```sql
   $> kill `cat /mysql-data-directory/host_name.pid`
   ```

   Use *backticks* (crases, não aspas simples ou duplas) com o comando `cat`. Isso faz com que a saída de `cat` seja substituída no comando `kill`.

3. Crie um arquivo de texto contendo a instrução de atribuição de senha em uma única linha. Substitua a senha pela senha que você deseja usar.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Salve o arquivo. Este exemplo pressupõe que você nomeie o arquivo como `/home/me/mysql-init`. O arquivo contém a senha, portanto, não o salve onde possa ser lido por outros usuários. Se você não estiver logado como `mysql` (o usuário sob o qual o Server é executado), certifique-se de que o arquivo tenha permissões que permitam ao `mysql` lê-lo.

5. Inicie o MySQL Server com a variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) definida para nomear o arquivo:

   ```sql
   $> mysqld --init-file=/home/me/mysql-init &
   ```

   O Server executa o conteúdo do arquivo nomeado pela variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file) na inicialização, alterando a senha da conta `'root'@'localhost'`.

   Outras opções também podem ser necessárias, dependendo de como você normalmente inicia o seu Server. Por exemplo, [`--defaults-file`](option-file-options.html#option_general_defaults-file) pode ser necessário antes do argumento [`init_file`](server-system-variables.html#sysvar_init_file).

6. Depois que o Server iniciar com sucesso, exclua `/home/me/mysql-init`.

Agora você deve ser capaz de conectar ao MySQL Server como `root` usando a nova senha. Pare o Server e reinicie-o normalmente.

Se o [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") falhar ao redefinir a senha, tente repetir o procedimento usando as seguintes instruções para modificar a tabela `user` diretamente:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.3 Redefinindo a Senha do Root: Instruções Genéricas

As seções precedentes fornecem instruções de redefinição de senha especificamente para sistemas Windows, Unix e Unix-like. Alternativamente, em qualquer plataforma, você pode redefinir a senha usando o Client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") (mas esta abordagem é menos segura):

1. Pare o MySQL Server, se necessário, e então reinicie-o com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables). Isso permite que qualquer pessoa conecte sem senha e com todos os Privileges, e desabilita instruções de gerenciamento de conta, como [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") e [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"). Como isso é inseguro, você pode querer usar [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) em conjunto com a habilitação da variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) para evitar que Clients remotos se conectem. Em plataformas Windows, se você habilitar `skip_networking`, você também deve habilitar [`shared_memory`](server-system-variables.html#sysvar_shared_memory) ou [`named_pipe`](server-system-variables.html#sysvar_named_pipe); caso contrário, o Server não pode iniciar.

2. Conecte-se ao MySQL Server usando o Client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"); nenhuma senha é necessária porque o Server foi iniciado com [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables):

   ```sql
   $> mysql
   ```

3. No Client `mysql`, instrua o Server a recarregar as `grant tables` para que as instruções de gerenciamento de conta funcionem:

   ```sql
   mysql> FLUSH PRIVILEGES;
   ```

   Em seguida, altere a senha da conta `'root'@'localhost'`. Substitua a senha pela senha que você deseja usar. Para alterar a senha de uma conta `root` com uma parte de `host name` diferente, modifique as instruções para usar esse `host name`.

   ```sql
   mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

Agora você deve ser capaz de conectar ao MySQL Server como `root` usando a nova senha. Pare o Server e reinicie-o normalmente (sem a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) e sem habilitar a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking)).

Se o [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") falhar ao redefinir a senha, tente repetir o procedimento usando as seguintes instruções para modificar a tabela `user` diretamente:

```sql
UPDATE mysql.user SET authentication_string = PASSWORD('MyNewPass')
WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```
