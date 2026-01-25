### 2.9.4 Protegendo a Conta Inicial do MySQL

O processo de instalação do MySQL envolve a inicialização do data directory, incluindo as grant tables no database de sistema `mysql` que definem as contas do MySQL. Para detalhes, consulte a Seção 2.9.1, “Inicializando o Data Directory”.

Esta seção descreve como atribuir uma senha à conta `root` inicial criada durante o procedimento de instalação do MySQL, caso você ainda não o tenha feito.

Nota

Meios alternativos para executar o processo descrito nesta seção:

*   No Windows, você pode executar o processo durante a instalação com o MySQL Installer (consulte a Seção 2.3.3, “MySQL Installer for Windows”).

*   Em todas as plataformas, a distribuição do MySQL inclui o **mysql_secure_installation**, um utilitário de linha de comando que automatiza grande parte do processo de proteção de uma instalação do MySQL.

*   Em todas as plataformas, o MySQL Workbench está disponível e oferece a capacidade de gerenciar user accounts (consulte o Capítulo 29, *MySQL Workbench* ).

Uma senha já pode estar atribuída à conta inicial sob estas circunstâncias:

*   No Windows, instalações realizadas usando o MySQL Installer oferecem a opção de atribuição de senha.

*   Instalações usando o instalador do macOS geram uma senha aleatória inicial, que o instalador exibe para o usuário em uma caixa de diálogo.

*   Instalações usando pacotes RPM geram uma senha aleatória inicial, que é escrita no error log do server.

*   Instalações usando pacotes Debian oferecem a opção de atribuição de senha.

*   Para a inicialização do data directory realizada manualmente usando **mysqld --initialize**, o **mysqld** gera uma senha aleatória inicial, a marca como expirada e a escreve no error log do server. Consulte a Seção 2.9.1, “Inicializando o Data Directory”.

A grant table `mysql.user` define a user account inicial do MySQL e seus privilégios de acesso. A instalação do MySQL cria apenas uma conta superuser `'root'@'localhost'` que possui todos os privilégios e pode fazer qualquer coisa. Se a conta `root` tiver uma senha vazia, sua instalação do MySQL fica desprotegida: Qualquer pessoa pode se conectar ao MySQL server como `root` *sem uma senha* e receber todos os privilégios.

A conta `'root'@'localhost'` também possui uma linha na tabela `mysql.proxies_priv` que permite conceder o privilégio `PROXY` para `''@''`, ou seja, para todos os users e todos os hosts. Isso permite que o `root` configure proxy users, bem como delegue a outras accounts a autoridade para configurar proxy users. Consulte a Seção 6.2.14, “Proxy Users”.

Para atribuir uma senha para a conta `root` inicial do MySQL, use o procedimento a seguir. Substitua *`root-password`* nos exemplos pela senha que você deseja usar.

Inicie o server se ele não estiver em execução. Para instruções, consulte a Seção 2.9.2, “Iniciando o Server”.

A conta `root` inicial pode ou não ter uma senha. Escolha qual dos seguintes procedimentos se aplica:

*   Se a conta `root` existir com uma senha aleatória inicial que tenha sido expirada, conecte-se ao server como `root` usando essa senha e, em seguida, escolha uma nova senha. Este é o caso se o data directory foi inicializado usando **mysqld --initialize**, seja manualmente ou usando um instalador que não oferece a opção de especificar uma senha durante a operação de instalação. Como a senha existe, você deve usá-la para se conectar ao server. Mas como a senha está expirada, você não pode usar a conta para nenhum outro propósito além de escolher uma nova senha, até que você escolha uma.

    1.  Se você não souber a senha aleatória inicial, procure no error log do server.

    2.  Conecte-se ao server como `root` usando a senha:

        ```sql
     $> mysql -u root -p
     Enter password: (enter the random root password here)
     ```

    3.  Escolha uma nova senha para substituir a senha aleatória:

        ```sql
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

*   Se a conta `root` existir, mas não tiver senha, conecte-se ao server como `root` sem usar senha e, em seguida, atribua uma senha. Este é o caso se você inicializou o data directory usando **mysqld --initialize-insecure**.

    1.  Conecte-se ao server como `root` sem usar senha:

        ```sql
     $> mysql -u root --skip-password
     ```

    2.  Atribua uma senha:

        ```sql
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

Após atribuir uma senha à conta `root`, você deve fornecê-la sempre que se conectar ao server usando a conta. Por exemplo, para se conectar ao server usando o **mysql** client, use este comando:

```sql
$> mysql -u root -p
Enter password: (enter root password here)
```

Para desligar o server com **mysqladmin**, use este comando:

```sql
$> mysqladmin -u root -p shutdown
Enter password: (enter root password here)
```

Nota

Para informações adicionais sobre como definir senhas, consulte a Seção 6.2.10, “Atribuindo Senhas de Conta”. Se você esquecer sua senha `root` depois de configurá-la, consulte a Seção B.3.3.2, “Como Resetar a Senha Root”.

Para configurar accounts adicionais, consulte a Seção 6.2.7, “Adicionando Contas, Atribuindo Privilégios e Removendo Contas”.
