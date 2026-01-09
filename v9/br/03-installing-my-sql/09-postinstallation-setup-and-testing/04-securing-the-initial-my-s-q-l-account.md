### 2.9.4 Protegendo a Conta Inicial do MySQL

O processo de instalação do MySQL envolve a inicialização do diretório de dados, incluindo as tabelas de concessão no esquema do sistema `mysql` que definem as contas do MySQL. Para obter detalhes, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

Esta seção descreve como atribuir uma senha à conta inicial `root` criada durante o procedimento de instalação do MySQL, se você ainda não tiver feito isso.

Observação

Mtodos alternativos para realizar o processo descrito nesta seção:

* No Windows, você pode realizar o processo durante a instalação com o MySQL Configurator (consulte a Seção 2.3.2, “Configuração: Usando o MySQL Configurator”).

* Em todas as plataformas, a distribuição do MySQL inclui o **mysql_secure_installation**, um utilitário de linha de comando que automatiza grande parte do processo de segurança de uma instalação do MySQL.

* Em todas as plataformas, o MySQL Workbench está disponível e oferece a capacidade de gerenciar contas de usuário (consulte o Capítulo 33, *MySQL Workbench*).

Uma senha pode já estar atribuída à conta inicial nessas circunstâncias:

* No Windows, as instalações realizadas usando o instalador MSI e o MySQL Configurator oferecem a opção de atribuir uma senha.

* A instalação usando o instalador do macOS gera uma senha aleatória inicial, que o instalador exibe ao usuário em uma caixa de diálogo.

* A instalação usando pacotes RPM gera uma senha aleatória inicial, que é escrita no log de erro do servidor.

* As instalações usando pacotes Debian oferecem a opção de atribuir uma senha.

* Para a inicialização do diretório de dados realizada manualmente usando **mysqld --initialize**, o **mysqld** gera uma senha aleatória inicial, marca-a como expirada e escreve-a no log de erro do servidor. Consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

A tabela `mysql.user` define a conta de usuário inicial do MySQL e seus privilégios de acesso. A instalação do MySQL cria apenas uma conta de superusuário `'root'@'localhost'`, que possui todos os privilégios e pode fazer qualquer coisa. Se a conta `root` tiver uma senha vazia, sua instalação do MySQL não está protegida: qualquer pessoa pode se conectar ao servidor MySQL como `root` *sem uma senha* e receber todos os privilégios.

A conta `'root'@'localhost'` também tem uma linha na tabela `mysql.proxies_priv` que permite conceder o privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Veja a Seção 8.2.19, “Usuários Proxy”.

Para atribuir uma senha para a conta inicial do `root` do MySQL, use o seguinte procedimento. Substitua *`root-password`* nos exemplos pela senha que você deseja usar.

Inicie o servidor, se ele não estiver em execução. Para instruções, consulte a Seção 2.9.2, “Iniciar o Servidor”.

A conta inicial `root` pode ou não ter uma senha. Escolha o procedimento que se aplica:

* Se a conta `root` existir com uma senha aleatória inicial que expirou, conecte-se ao servidor como `root` usando essa senha, depois escolha uma nova senha. Esse é o caso se o diretório de dados foi inicializado usando **mysqld --initialize**, manualmente ou usando um instalador que não oferece a opção de especificar uma senha durante a operação de instalação. Como a senha existe, você deve usá-la para se conectar ao servidor. Mas como a senha expirou, você não pode usar a conta para qualquer outro propósito além de escolher uma nova senha, até que você escolha uma.

1. Se você não souber a senha aleatória inicial, procure no log de erro do servidor.

2. Conecte-se ao servidor como `root` usando a senha:

     ```
     $> mysql -u root -p
     Enter password: (enter the random root password here)
     ```

  3. Escolha uma nova senha para substituir a senha aleatória:

     ```
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

* Se a conta `root` existir, mas não tiver senha, conecte-se ao servidor como `root` sem senha, depois atribua uma senha. Este é o caso se você inicializar o diretório de dados usando **mysqld --initialize-insecure**.

  1. Conecte-se ao servidor como `root` sem senha:

     ```
     $> mysql -u root --skip-password
     ```

  2. Atribua uma senha:

     ```
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

Após atribuir uma senha à conta `root`, você deve fornecer essa senha sempre que se conectar ao servidor usando a conta. Por exemplo, para se conectar ao servidor usando o cliente **mysql**, use este comando:

```
$> mysql -u root -p
Enter password: (enter root password here)
```

Para desligar o servidor com **mysqladmin**, use este comando:

```
$> mysqladmin -u root -p shutdown
Enter password: (enter root password here)
```

Observação

Para obter informações adicionais sobre a configuração de senhas, consulte a Seção 8.2.14, “Atribuição de Senhas de Conta”. Se você esquecer a senha de `root` após a configuração, consulte a Seção B.3.3.2, “Como Redefinir a Senha de Root”.

Para configurar contas adicionais, consulte a Seção 8.2.8, “Adicionar Contas, Atribuir Privilegios e Remover Contas”.