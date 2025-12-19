### 2.9.4 Proteger a conta inicial do MySQL

O processo de instalação do MySQL envolve a inicialização do diretório de dados, incluindo as tabelas de concessão no esquema do sistema `mysql` que definem as contas do MySQL.

Esta seção descreve como atribuir uma senha à conta inicial `root` criada durante o procedimento de instalação do MySQL, se você ainda não o fez.

::: info Note

Meios alternativos para realizar o processo descrito nesta secção:

- No Windows, você pode executar o processo durante a instalação com o MySQL Configurator (ver Seção 2.3.2,  Configuração: Usando o MySQL Configurator).
- Em todas as plataformas, a distribuição MySQL inclui **mysql\_secure\_installation**, um utilitário de linha de comando que automatiza grande parte do processo de segurança de uma instalação MySQL.
- Em todas as plataformas, o MySQL Workbench está disponível e oferece a capacidade de gerenciar contas de usuário (ver Capítulo 33, *MySQL Workbench*).

:::

Uma senha já pode ser atribuída à conta inicial nas seguintes circunstâncias:

- No Windows, as instalações realizadas usando o instalador MSI e o MySQL Configurator oferecem a opção de atribuir uma senha.
- A instalação usando o instalador do macOS gera uma senha inicial aleatória, que o instalador exibe ao usuário em uma caixa de diálogo.
- A instalação usando pacotes RPM gera uma senha inicial aleatória, que é escrita no registro de erros do servidor.
- As instalações que usam pacotes Debian dão-lhe a opção de atribuir uma senha.
- Para a inicialização do diretório de dados realizada manualmente usando **mysqld --initialize**, **mysqld** gera uma senha aleatória inicial, marca sua expiração e a escreve no registro de erros do servidor.

A `mysql.user` tabela de concessão define a conta de usuário inicial do MySQL e seus privilégios de acesso. A instalação do MySQL cria apenas uma conta de superusuário `'root'@'localhost'` que tem todos os privilégios e pode fazer qualquer coisa. Se a conta `root` tem uma senha vazia, sua instalação do MySQL não está protegida: Qualquer pessoa pode se conectar ao servidor MySQL como `root` \* sem uma senha \* e receber todos os privilégios.

A conta `'root'@'localhost'` também tem uma linha na tabela `mysql.proxies_priv` que permite a concessão do privilégio `PROXY` para `''@''`, isto é, para todos os usuários e todos os hosts. Isso permite a `root` configurar usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy.

Para atribuir uma senha para a conta inicial MySQL `root`, use o seguinte procedimento. Substitua `root-password` nos exemplos com a senha que você deseja usar.

Iniciar o servidor se ele não estiver em execução.

A conta inicial pode ou não ter uma senha. Escolha qual dos seguintes procedimentos se aplica:

- Se a conta \[`root`] existe com uma senha aleatória inicial que tenha expirado, conecte-se ao servidor como \[`root`] usando essa senha e, em seguida, escolha uma nova senha. Este é o caso se o diretório de dados foi inicializado usando **mysqld --initialize**, manualmente ou usando um instalador que não lhe dá a opção de especificar uma senha durante a operação de instalação. Como a senha existe, você deve usá-la para se conectar ao servidor. Mas como a senha está expirada, você não pode usar a conta para qualquer outro propósito além de escolher uma nova senha, até escolher uma.

  1. Se você não souber a senha aleatória inicial, procure no registro de erros do servidor.
  2. Conecte-se ao servidor como `root` usando a senha:

     ```
     $> mysql -u root -p
     Enter password: (enter the random root password here)
     ```
  3. Escolha uma nova senha para substituir a senha aleatória:

     ```
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```
- Se a conta `root` existe, mas não tem senha, conecte-se ao servidor como `root` sem usar senha, em seguida, atribuir uma senha. Este é o caso se você inicializou o diretório de dados usando \[**mysqld --initialize-insecure**] (mysqld.html).

  1. Conecte-se ao servidor como `root` sem usar senha:

     ```
     $> mysql -u root --skip-password
     ```
  2. Atribuir uma senha:

     ```
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

Depois de atribuir uma senha à conta `root`, você deve fornecer essa senha sempre que se conectar ao servidor usando a conta. Por exemplo, para se conectar ao servidor usando o cliente **mysql**, use este comando:

```
$> mysql -u root -p
Enter password: (enter root password here)
```

Para desligar o servidor com **mysqladmin**, use este comando:

```
$> mysqladmin -u root -p shutdown
Enter password: (enter root password here)
```

::: info Note

Para obter informações adicionais sobre a definição de senhas, consulte a Seção 8.2.14, "Asignação de senhas de conta". Se você esquecer sua senha `root` depois de configurá-la, consulte a Seção B.3.3.2, "Como redefinir a senha raiz".

Para a criação de contas adicionais, ver a Secção 8.2.8, "Adição de contas, atribuição de privilégios e eliminação de contas".

:::
