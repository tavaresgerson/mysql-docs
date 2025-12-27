#### B.3.3.2 Como redefinir a senha do root

Se você nunca atribuiu uma senha de `root` para o MySQL, o servidor não requer uma senha para se conectar como `root`. No entanto, isso é inseguro. Para obter instruções sobre como atribuir uma senha, consulte  Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

Se você conhece a senha de `root` e deseja alterá-la, consulte  Seção 15.7.1.1, “Instrução ALTER USER” e  Seção 15.7.1.10, “Instrução SET PASSWORD”.

Se você atribuiu uma senha de `root` anteriormente, mas a esqueceu, pode atribuir uma nova senha. As seções a seguir fornecem instruções para sistemas Windows e Unix e sistemas semelhantes ao Unix, bem como instruções genéricas que se aplicam a qualquer sistema.

##### B.3.3.2.1 Redefinir a senha do root: Sistemas Windows

No Windows, use o seguinte procedimento para redefinir a senha da conta `'root'@'localhost'` do MySQL. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

1. Faça login no seu sistema como Administrador.
2. Parar o servidor MySQL se ele estiver em execução. Para um servidor que está em execução como um serviço do Windows, vá para o Gerenciador de Serviços: No menu Iniciar, selecione Painel de Controle, depois Ferramentas Administrativas, depois Serviços. Encontre o serviço MySQL na lista e pare-o.

   Se o seu servidor não estiver em execução como um serviço, você pode precisar usar o Gerenciador de Tarefas para forçá-lo a parar.
3. Crie um arquivo de texto contendo a instrução de atribuição de senha em uma única linha. Substitua a senha pela senha que você deseja usar.

   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```
4. Salve o arquivo. Este exemplo assume que você nomeia o arquivo `C:\mysql-init.txt`.
5. Abra uma janela de console para acessar o prompt de comando: No menu Iniciar, selecione Executar, depois insira **cmd** como o comando a ser executado.
6. Inicie o servidor MySQL com a variável de sistema `init_file` definida para nomear o arquivo (observe que a barra invertida no valor da opção é duplicada):

   ```
   C:\> cd "C:\Program Files\MySQL\MySQL Server 8.4\bin"
   C:\> mysqld --init-file=C:\\mysql-init.txt
   ```

Se você instalou o MySQL em um local diferente, ajuste o comando **cd** conforme necessário.

O servidor executa o conteúdo do arquivo nomeado pela variável de sistema `init_file` ao iniciar, alterando a senha da conta `'root'@'localhost'`.

Para que a saída do servidor apareça na janela de console em vez de em um arquivo de log, adicione a opção `--console` ao comando `mysqld`.

Se você instalou o MySQL usando o Assistente de Instalação do MySQL, pode ser necessário especificar a opção `--defaults-file`. Por exemplo:

```
   C:\> mysqld
            --defaults-file="C:\\ProgramData\\MySQL\\MySQL Server 8.4\\my.ini"
            --init-file=C:\\mysql-init.txt
   ```

O ajuste apropriado para `--defaults-file` pode ser encontrado usando o Gerenciador de Serviços: No menu Iniciar, selecione Painel de Controle, depois Ferramentas Administrativas, depois Serviços. Encontre o serviço MySQL na lista, clique com o botão direito nele e escolha a opção `Propriedades`. O campo `Caminho para executável` contém o ajuste `--defaults-file`.

Após o servidor ter iniciado com sucesso, exclua `C:\mysql-init.txt`.

Agora você deve ser capaz de se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor MySQL e reiniciá-lo normalmente. Se você executar o servidor como um serviço, inicie-o a partir da janela Serviços do Windows. Se você iniciar o servidor manualmente, use o comando que você normalmente usa.

##### B.3.3.2.2 Redefinindo a Senha do Root: Sistemas Unix e Unix-Like

No Unix, use o seguinte procedimento para redefinir a senha da conta MySQL `'root'@'localhost'`. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

As instruções assumem que você inicia o servidor MySQL a partir da conta de login Unix que você normalmente usa para executá-lo. Por exemplo, se você executar o servidor usando a conta de login `mysql`, você deve fazer login como `mysql` antes de usar as instruções. Alternativamente, você pode fazer login como `root`, mas, nesse caso, você *deve* iniciar o `mysqld` com a opção `--user=mysql`. Se você iniciar o servidor como `root` sem usar `--user=mysql`, o servidor pode criar arquivos de propriedade `root` no diretório de dados, como arquivos de log, e isso pode causar problemas relacionados a permissões para futuras inicializações do servidor. Se isso acontecer, você deve alterar a propriedade dos arquivos para `mysql` ou removê-los.

1. Faça login no seu sistema como o usuário Unix no qual o servidor MySQL é executado (por exemplo, `mysql`).
2. Parar o servidor MySQL se ele estiver em execução. Localize o arquivo `.pid` que contém o ID do processo do servidor. A localização exata e o nome deste arquivo dependem da sua distribuição, nome do host e configuração. Locais comuns são `/var/lib/mysql/`, `/var/run/mysqld/` e `/usr/local/mysql/data/`. Geralmente, o nome do arquivo tem a extensão `.pid` e começa com `mysqld` ou o nome do host do seu sistema.

   Pare o servidor MySQL enviando um `kill` normal (não `kill -9`) ao processo `mysqld`. Use o nome real do caminho do arquivo `.pid` no seguinte comando:

   ```
   $> kill `cat /mysql-data-directory/host_name.pid`
   ```

   Use aspas duplas (não aspas simples) com o comando `cat`. Isso faz com que a saída do `cat` seja substituída no comando `kill`.
3. Crie um arquivo de texto contendo a declaração de atribuição de senha em uma única linha. Substitua a senha pelo nome de senha que você deseja usar.

```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```
4. Salve o arquivo. Este exemplo assume que você nomeia o arquivo `/home/me/mysql-init`. O arquivo contém a senha, então não salve-o em um local onde ele possa ser lido por outros usuários. Se você não estiver logado como `mysql` (o usuário pelo qual o servidor é executado), certifique-se de que o arquivo tenha permissões que permitam que `mysql` o leia.
5. Inicie o servidor MySQL com a variável de sistema `init_file` definida para nomear o arquivo:

   ```
   $> mysqld --init-file=/home/me/mysql-init &
   ```

   O servidor executa o conteúdo do arquivo nomeado pela variável de sistema `init_file` ao iniciar, alterando a senha da conta `'root'@'localhost'`.
   Outras opções podem ser necessárias também, dependendo de como você normalmente inicia seu servidor. Por exemplo, `--defaults_file` pode ser necessário antes do argumento `init_file`.
6. Após o servidor ter iniciado com sucesso, exclua `/home/me/mysql-init`.
   Agora você deve ser capaz de se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor e reiniciá-lo normalmente.

##### B.3.3.2.3 Redefinindo a Senha do Usuário Root: Instruções Gerais

As seções anteriores fornecem instruções para redefinir a senha, especificamente para sistemas Windows e Unix e sistemas semelhantes ao Unix. Alternativamente, em qualquer plataforma, você pode redefinir a senha usando o cliente `mysql` (mas essa abordagem é menos segura):
1. Parar o servidor MySQL, se necessário, e depois reiniciá-lo com a opção `--skip-grant-tables`. Isso permite que qualquer pessoa se conecte sem senha e com todos os privilégios, e desabilita declarações de gerenciamento de contas, como `ALTER USER` e `SET PASSWORD`. Como isso é inseguro, se o servidor for iniciado com a opção `--skip-grant-tables`, ele também desabilita conexões remotas ao habilitar `skip_networking`. Em plataformas Windows, isso significa que você também deve habilitar `shared_memory` ou `named_pipe`; caso contrário, o servidor não pode ser iniciado.
2. Conecte-se ao servidor MySQL usando o cliente `mysql`; nenhuma senha é necessária porque o servidor foi iniciado com `--skip-grant-tables`:

3. No cliente `mysql`, peça ao servidor para recarregar as tabelas de concessão para que as instruções de gerenciamento de contas funcionem:

   ```
   $> mysql
   ```

   Em seguida, altere a senha da conta `'root'@'localhost'`. Substitua a senha pela senha que você deseja usar. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

   ```
   mysql> FLUSH PRIVILEGES;
   ```

Agora você deve ser capaz de se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor e reiniciá-lo normalmente (sem a opção `--skip-grant-tables` e sem habilitar a variável de sistema `skip_networking`).