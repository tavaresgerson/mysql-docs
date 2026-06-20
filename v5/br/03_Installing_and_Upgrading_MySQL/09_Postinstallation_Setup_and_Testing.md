## 2.9 Configuração e Teste Pós-Instalação

Esta seção discute as tarefas que você deve realizar após instalar o MySQL:

* Se necessário, inicialize o diretório de dados e crie as tabelas de concessão do MySQL. Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados pode ser feita automaticamente:

+ Operações de instalação do Windows realizadas pelo Instalador MySQL.  + Instalação em Linux usando um RPM de servidor ou uma distribuição Debian da Oracle.

+ Instalação usando o sistema de embalagem nativo em muitas plataformas, incluindo Debian Linux, Ubuntu Linux, Gentoo Linux e outras.

+ Instalação no macOS usando uma distribuição DMG.

Para outras plataformas e tipos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote de arquivo ZIP no Windows. Para instruções, consulte a Seção 2.9.1, “Inicializando o diretório de dados”.

* Inicie o servidor e verifique se ele pode ser acessado. Para obter instruções, consulte a Seção 2.9.2, “Iniciar o servidor”, e a Seção 2.9.3, “Testar o servidor”.

* Atribua senhas à conta inicial `root` nas tabelas de concessão, se isso ainda não foi feito durante a inicialização do diretório de dados. As senhas impedem o acesso não autorizado ao servidor MySQL. Para instruções, consulte a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

* Opcionalmente, configure o servidor para iniciar e parar automaticamente quando o seu sistema começa e para. Para instruções, consulte a Seção 2.9.5, “Iniciando e Parando o MySQL automaticamente”.

* Opcionalmente, preencha as tabelas de fuso horário para permitir o reconhecimento de fusos horários nominais. Para instruções, consulte a Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

Quando estiver pronto para criar contas de usuário adicionais, você pode encontrar informações sobre o sistema de controle de acesso MySQL e gerenciamento de contas na Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”.

### 2.9.1 Inicializando o Diretório de Dados

Após a instalação do MySQL, o diretório de dados deve ser inicializado, incluindo as tabelas no banco de dados do sistema `mysql`:

* Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados é automática, conforme descrito na Seção 2.9, “Configuração e Teste Pós-Instalação”.

* Para outros métodos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote de arquivo ZIP no Windows.

Esta seção descreve como inicializar o diretório de dados manualmente para os métodos de instalação do MySQL para os quais a inicialização do diretório de dados não é automática. Para alguns comandos sugeridos que permitem testar se o servidor é acessível e está funcionando corretamente, consulte a Seção 2.9.3, “Testando o servidor”.

* Visão geral da inicialização do diretório de dados
* Procedimento de inicialização do diretório de dados
* Ações do servidor durante a inicialização do diretório de dados
* Atribuição da senha de raiz após a inicialização

#### Visão geral da inicialização do diretório de dados

Nos exemplos mostrados aqui, o servidor deve ser executado sob o ID de usuário da conta de login `mysql`. Crie a conta se ela não existir (consulte Criar um usuário e grupo mysql), ou substitua o nome de uma conta de login existente que você planeja usar para executar o servidor.

1. Mude a localização para o diretório de nível superior da sua instalação do MySQL, que normalmente é `/usr/local/mysql` (ajuste o nome do caminho conforme necessário para o seu sistema):

   ```sql
   cd /usr/local/mysql
   ```

Dentro deste diretório, há vários arquivos e subdiretórios, incluindo o subdiretório `bin`, que contém o servidor, bem como programas de cliente e utilitários.

2. A variável de sistema `secure_file_priv` limita as operações de importação e exportação para um diretório específico. Crie um diretório cuja localização pode ser especificada como o valor dessa variável:

   ```sql
   mkdir mysql-files
   ```

Atribua a propriedade de diretório ao usuário `mysql` e ao grupo `mysql`, e defina as permissões de diretório adequadamente:

   ```sql
   chown mysql:mysql mysql-files
   chmod 750 mysql-files
   ```

3. Use o servidor para inicializar o diretório de dados, incluindo o banco de dados `mysql`, que contém as tabelas iniciais de concessão de acesso MySQL que determinam como os usuários são autorizados a se conectar ao servidor. Por exemplo:

   ```sql
   bin/mysqld --initialize --user=mysql
   ```

Para informações importantes sobre o comando, especialmente sobre as opções de comando que você pode usar, consulte o procedimento de inicialização do diretório de dados. Para detalhes sobre como o servidor realiza a inicialização, consulte Ações do servidor durante a inicialização do diretório de dados.

Normalmente, a inicialização do diretório de dados só precisa ser feita após a primeira instalação do MySQL. (Para atualizações em uma instalação existente, realize o procedimento de atualização em vez disso; veja Seção 2.10, “Atualizando o MySQL”.) No entanto, o comando que inicializa o diretório de dados não sobrescreve quaisquer tabelas de banco de dados `mysql` existentes, portanto, é seguro executá-lo em quaisquer circunstâncias.

Nota

A inicialização do diretório de dados pode falhar se as bibliotecas do sistema necessárias estiverem ausentes. Por exemplo, você pode ver um erro como este:

   ```sql
   bin/mysqld: error while loading shared libraries:
   libnuma.so.1: cannot open shared object file:
   No such file or directory
   ```

Se isso acontecer, você deve instalar as bibliotecas ausentes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização do diretório de dados.

4. Se você deseja implantar o servidor com suporte automático para conexões seguras, use o utilitário `mysql_ssl_rsa_setup` para criar arquivos SSL e RSA padrão:

   ```sql
   bin/mysql_ssl_rsa_setup
   ```

Para mais informações, consulte a Seção 4.4.5, “mysql_ssl_rsa_setup — Crie arquivos SSL/RSA”.

5. Na ausência de arquivos de opções, o servidor começa com suas configurações padrão. (Veja a Seção 5.1.2, “Configurações padrão do servidor”.) Para especificar explicitamente as opções que o servidor MySQL deve usar no início, coloque-as em um arquivo de opções, como `/etc/my.cnf` ou `/etc/mysql/my.cnf`. (Veja a Seção 4.2.2.2, “Uso de arquivos de opções”.) Por exemplo, você pode usar um arquivo de opções para definir a variável de sistema `secure_file_priv`.

6. Para configurar o MySQL para iniciar sem intervenção manual no momento do arranque do sistema, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

7. A inicialização do diretório de dados cria tabelas de fuso horário no banco de dados `mysql`, mas não as preenche. Para fazer isso, use as instruções na Seção 5.1.13, “Suporte de fuso horário do MySQL Server”.

#### Procedimento de Inicialização do Diretório de Dados

Altere a localização para o diretório de nível superior da sua instalação do MySQL, que normalmente é `/usr/local/mysql` (ajuste o nome do caminho conforme necessário para o seu sistema):

```sql
cd /usr/local/mysql
```

Para inicializar o diretório de dados, invoque `mysqld` com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o servidor gere uma senha inicial aleatória para a conta `'root'@'localhost'`, ou criar essa conta sem senha:

* Use `--initialize` para instalação "segura por padrão" (ou seja, incluindo a geração de uma senha inicial aleatória `root`. Nesse caso, a senha é marcada como expirada e você deve escolher uma nova.

* Com `--initialize-insecure`, não é gerada senha `root`. Isso é inseguro; é assumido que você atribua uma senha à conta de forma oportuna antes de colocar o servidor em uso produtivo.

Para obter instruções sobre como atribuir uma nova senha `'root'@'localhost'`, consulte a atribuição de senha de raiz após a inicialização.

Nota

O servidor escreve quaisquer mensagens (incluindo qualquer senha inicial) na saída padrão de erro. Isso pode ser redirecionado para o log de erro, então, procure lá se não vir as mensagens na tela. Para informações sobre o log de erro, incluindo onde ele está localizado, consulte a Seção 5.4.2, “O Log de Erro”.

Em Windows, use a opção `--console` para direcionar mensagens para o console.

Em sistemas Unix e semelhantes, é importante que os diretórios e arquivos do banco de dados sejam de propriedade da conta de login `mysql` para que o servidor tenha acesso de leitura e escrita a eles quando você executá-lo posteriormente. Para garantir isso, inicie `mysqld` a partir da conta do sistema `root` e inclua a opção `--user` conforme mostrado aqui:

```sql
bin/mysqld --initialize --user=mysql
bin/mysqld --initialize-insecure --user=mysql
```

Alternativamente, execute `mysqld` enquanto estiver logado como `mysql`, nesse caso, você pode omitir a opção `--user` do comando.

Em Windows, use um desses comandos:

```sql
bin\mysqld --initialize --console
bin\mysqld --initialize-insecure --console
```

Nota

A inicialização do diretório de dados pode falhar se as bibliotecas de sistema necessárias estiverem ausentes. Por exemplo, você pode ver um erro como este:

```sql
bin/mysqld: error while loading shared libraries:
libnuma.so.1: cannot open shared object file:
No such file or directory
```

Se isso acontecer, você deve instalar as bibliotecas ausentes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização do diretório de dados.

Pode ser necessário especificar outras opções, como `--basedir` ou `--datadir`, se o `mysqld` não conseguir identificar os locais corretos para o diretório de instalação ou o diretório de dados. Por exemplo (entre no comando em uma única linha):

```sql
bin/mysqld --initialize --user=mysql
  --basedir=/opt/mysql/mysql
  --datadir=/opt/mysql/mysql/data
```

Alternativamente, coloque as configurações relevantes das opções em um arquivo de opções e passe o nome desse arquivo para `mysqld`. Para sistemas Unix e Unix-like, suponha que o nome do arquivo de opções é `/opt/mysql/mysql/etc/my.cnf`. Coloque essas linhas no arquivo:

```sql
[mysqld]
basedir=/opt/mysql/mysql
datadir=/opt/mysql/mysql/data
```

Em seguida, invoque `mysqld` da seguinte forma (entre no comando em uma única linha, com a opção `--defaults-file` primeiro):

```sql
bin/mysqld --defaults-file=/opt/mysql/mysql/etc/my.cnf
  --initialize --user=mysql
```

Em Windows, suponha que `C:\my.ini` contenha essas linhas:

```sql
[mysqld]
basedir=C:\\Program Files\\MySQL\\MySQL Server 5.7
datadir=D:\\MySQLdata
```

Em seguida, invoque `mysqld` da seguinte forma (novamente, você deve inserir o comando em uma única linha, com a opção `--defaults-file` primeiro):

```sql
bin\mysqld --defaults-file=C:\my.ini
   --initialize --console
```

Importante

Ao inicializar o diretório de dados, você não deve especificar nenhuma opção além daquelas usadas para definir as localizações do diretório, como `--basedir` ou `--datadir`, e a opção `--user`, se necessário. As opções que devem ser empregadas pelo servidor MySQL durante o uso normal podem ser definidas ao reiniciá-lo após a inicialização. Consulte a descrição da opção `--initialize` para obter mais informações.

#### Ações do servidor durante a inicialização do diretório de dados

Nota

A sequência de inicialização do diretório de dados realizada pelo servidor não substitui as ações realizadas pelos `mysql_secure_installation` e `mysql_ssl_rsa_setup`.

Quando invocado com a opção `--initialize` ou `--initialize-insecure`, o `mysqld` realiza as seguintes ações durante a sequência de inicialização do diretório de dados:

1. O servidor verifica a existência do diretório de dados da seguinte forma:

* Se não existir um diretório de dados, o servidor o cria. * Se o diretório de dados existir, mas não estiver vazio (ou seja, conter arquivos ou subdiretórios), o servidor sai após produzir uma mensagem de erro:

     ```sql
     [ERROR] --initialize specified but the data directory exists. Aborting.
     ```

Nesse caso, remova ou renomeie o diretório de dados e tente novamente.

A partir do MySQL 5.7.11, um diretório de dados existente é permitido que não esteja vazio se cada entrada tiver um nome que comece com um ponto (`.`) ou seja nomeado usando a opção `--ignore-db-dir`.

Nota

Evite o uso da opção `--ignore-db-dir`, que foi descontinuada desde o MySQL 5.7.16.

2. Dentro do diretório de dados, o servidor cria o banco de dados do sistema `mysql` e suas tabelas, incluindo as tabelas de concessão, tabelas de fuso horário e tabelas de ajuda do lado do servidor. Veja a Seção 5.3, “O banco de dados do sistema mysql”.

3. O servidor inicializa o espaço de tabela do sistema e as estruturas de dados relacionadas necessárias para gerenciar as tabelas `InnoDB`.

Nota

Após o `mysqld` configurar o espaço de tabelas `InnoDB` do sistema, certas alterações nas características do espaço de tabelas exigem a configuração de uma nova instância. As alterações qualificadas incluem o nome do arquivo do primeiro arquivo no espaço de tabelas do sistema e o número de registros de desfazer. Se você não deseja usar os valores padrão, certifique-se de que as configurações dos parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estejam em vigor no arquivo de configuração do MySQL *antes* de executar `mysqld`. Além disso, certifique-se de especificar, se necessário, outros parâmetros que afetam a criação e a localização dos arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

Se essas opções estiverem em seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL leia por padrão, especifique a localização do arquivo usando a opção `--defaults-extra-file` quando você executar `mysqld`.

4. O servidor cria uma conta de superusuário `'root'@'localhost'` e outras contas reservadas (consulte a Seção 6.2.8, “Contas Reservadas”). Algumas contas reservadas estão bloqueadas e não podem ser usadas por clientes, mas `'root'@'localhost'` é destinado ao uso administrativo e você deve atribuí-la uma senha.

As ações do servidor em relação a uma senha para a conta `'root'@'localhost'` dependem de como você a invoca:

* Com `--initialize`, mas não `--initialize-insecure`, o servidor gera uma senha aleatória, marca-a como expirada e escreve uma mensagem exibindo a senha:

     ```sql
     [Warning] A temporary password is generated for root@localhost:
     iTag*AfrH5ej
     ```

* Com `--initialize-insecure`, (com ou sem `--initialize`, porque `--initialize-insecure` implica em `--initialize`, o servidor não gera uma senha ou marca-a como expirada, e escreve uma mensagem de aviso:

     ```sql
     [Warning] root@localhost is created with an empty password ! Please
     consider switching off the --initialize-insecure option.
     ```

Para obter instruções sobre como atribuir uma nova senha do `'root'@'localhost'`, consulte a atribuição da senha de raiz após a inicialização.

5. O servidor preenche as tabelas de ajuda do lado do servidor usadas para a declaração `HELP` (consulte Seção 13.8.3, “Declaração HELP”). O servidor não preenche as tabelas de fuso horário. Para fazer isso manualmente, consulte Seção 5.1.13, “Suporte de fuso horário do servidor MySQL”.

6. Se a variável de sistema `init_file` foi dada para nomear um arquivo de declarações SQL, o servidor executa as declarações no arquivo. Esta opção permite que você realize sequências de inicialização personalizadas.

Quando o servidor opera no modo bootstrap, algumas funcionalidades não estão disponíveis, o que limita as declarações permitidas no arquivo. Essas incluem declarações relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transação global.

7. O servidor sai.

#### Atribuição da senha de raiz após a inicialização

Depois de inicializar o diretório de dados iniciando o servidor com `--initialize` ou `--initialize-insecure`, inicie o servidor normalmente (ou seja, sem nenhuma dessas opções) e atribua uma nova senha à conta `'root'@'localhost'`:

1. Inicie o servidor. Para obter instruções, consulte a Seção 2.9.2, “Iniciando o servidor”.

2. Conecte-se ao servidor:

* Se você usou `--initialize`, mas não `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root`:

     ```sql
     mysql -u root -p
     ```

Em seguida, na tela de senha, insira a senha aleatória que o servidor gerou durante a sequência de inicialização:

     ```sql
     Enter password: (enter the random root password here)
     ```

Procure no log de erro do servidor se você não souber essa senha.

* Se você usou `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root` sem senha:

     ```sql
     mysql -u root --skip-password
     ```

3. Após a conexão, use uma declaração `ALTER USER` para atribuir uma nova senha `root`:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
   ```

Veja também a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

Nota

As tentativas de se conectar ao host `127.0.0.1` normalmente resolvem para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que existe uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

```sql
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
```

É possível colocar essas declarações em um arquivo para ser executado usando a variável de sistema `init_file`, conforme discutido em Ações do servidor durante a inicialização do diretório de dados.

### 2.9.2 Começando o servidor

#### 2.9.2.1 Solução de problemas para problemas de início do servidor MySQL

Esta seção descreve como iniciar o servidor em sistemas Unix e semelhantes ao Unix. (Para o Windows, consulte a Seção 2.3.4.5, “Iniciando o servidor pela primeira vez”.) Para algumas sugestões de comandos que você pode usar para testar se o servidor é acessível e funcionando corretamente, consulte a Seção 2.9.3, “Testando o servidor”.

Inicie o servidor MySQL da seguinte forma, se sua instalação incluir `mysqld_safe`:

```sql
$> bin/mysqld_safe --user=mysql &
```

Nota

Para sistemas Linux nos quais o MySQL é instalado usando pacotes RPM, o início e o término do servidor são gerenciados usando systemd em vez de `mysqld_safe`, e `mysqld_safe` não é instalado. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com systemd”.

Comece o servidor da seguinte forma, se sua instalação incluir suporte ao systemd:

```sql
$> systemctl start mysqld
```

Substitua o nome do serviço apropriado, se ele for diferente de `mysqld` (por exemplo, `mysql` em sistemas SLES).

É importante que o servidor MySQL seja executado usando uma conta de login não privilegiada (não `root`). Para garantir isso, execute `mysqld_safe` como `root` e inclua a opção `--user` conforme mostrado. Caso contrário, você deve executar o programa enquanto estiver conectado como `mysql`, nesse caso, você pode omitir a opção `--user` do comando.

Para obter instruções adicionais sobre como executar o MySQL como um usuário não privilegiado, consulte a Seção 6.1.5, “Como executar o MySQL como um usuário normal”.

Se o comando falhar imediatamente e imprimir `mysqld ended`, procure informações no log de erro (que, por padrão, é o arquivo `host_name.err` no diretório de dados).

Se o servidor não conseguir acessar o diretório de dados que ele inicia ou lê as tabelas de concessão no banco de dados `mysql`, ele escreve uma mensagem em seu log de erro. Tais problemas podem ocorrer se você negligenciar a criação das tabelas de concessão ao inicializar o diretório de dados antes de prosseguir com este passo, ou se você executou o comando que inicializa o diretório de dados sem a opção `--user`. Remova o diretório `data` e execute o comando com a opção `--user`.

Se você tiver outros problemas para iniciar o servidor, consulte a Seção 2.9.2.1, “Soluções para problemas de início do servidor MySQL”. Para mais informações sobre `mysqld_safe`, consulte a Seção 4.3.2, “`mysqld_safe` — Script de inicialização do servidor MySQL”. Para mais informações sobre o suporte do systemd, consulte a Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

#### 2.9.2.1 Solução de problemas para problemas de início do servidor MySQL

Esta seção fornece sugestões de solução de problemas para problemas de inicialização do servidor. Para sugestões adicionais para sistemas Windows, consulte a Seção 2.3.5, “Solução de problemas de uma instalação do Microsoft Windows MySQL Server”.

Se você tiver problemas para iniciar o servidor, aqui estão algumas coisas que você pode tentar:

* Verifique o log de erro para ver por que o servidor não inicia. Os arquivos de log estão localizados no diretório [data](glossary.html#glos_data_directory "data directory") (tipicamente `C:\Program Files\MySQL\MySQL Server 5.7\data` no Windows, `/usr/local/mysql/data` para uma distribuição binária Unix/Linux, e `/usr/local/var` para uma distribuição de código fonte Unix/Linux). Procure no diretório de dados por arquivos com nomes na forma `host_name.err` e `host_name.log`, onde *`host_name`* é o nome do seu host do servidor. Em seguida, examine as últimas linhas desses arquivos. Use `tail` para exibí-los:

  ```sql
  $> tail host_name.err
  $> tail host_name.log
  ```

* Especifique quaisquer opções especiais necessárias pelos motores de armazenamento que você está usando. Você pode criar um arquivo `my.cnf` e especificar opções de inicialização para os motores que você planeja usar. Se você vai usar motores de armazenamento que suportam tabelas transacionais (`InnoDB`, `NDB`), certifique-se de que eles estão configurados da maneira que você deseja antes de iniciar o servidor. Se você está usando tabelas `InnoDB`, consulte a Seção 14.8, “Configuração do InnoDB”, para diretrizes e a Seção 14.15, “Opções de inicialização do InnoDB e variáveis do sistema”, para a sintaxe da opção.

Embora as engines de armazenamento usem valores padrão para opções que você omite, a Oracle recomenda que você revise as opções disponíveis e especifique valores explícitos para quaisquer opções cujos valores padrão não sejam apropriados para sua instalação.

* Certifique-se de que o servidor saiba onde encontrar o diretório de dados. O servidor `mysqld` usa este diretório como seu diretório atual. É aqui que ele espera encontrar bancos de dados e onde espera escrever arquivos de log. O servidor também escreve o arquivo pid (ID de processo) no diretório de dados.

A localização padrão do diretório de dados é codificada em tempo de compilação do servidor. Para determinar quais são as configurações do caminho padrão, invoque `mysqld` com as opções `--verbose` e `--help`. Se o diretório de dados estiver localizado em outro lugar no seu sistema, especifique essa localização com a opção `--datadir` para `mysqld` ou `mysqld_safe`, na linha de comando ou em um arquivo de opção. Caso contrário, o servidor não funcionará corretamente. Como alternativa à opção `--datadir`, você pode especificar a localização do diretório base sob o qual o MySQL está instalado com a opção `--basedir`, e `mysqld` procura o diretório `data` lá.

Para verificar o efeito de especificar opções de caminho, invoque `mysqld` com essas opções seguidas pelas opções `--verbose` e `--help`. Por exemplo, se você alterar a localização para o diretório onde o `mysqld` está instalado e, em seguida, executar o seguinte comando, ele mostrará o efeito de iniciar o servidor com um diretório base de `/usr/local`:

  ```sql
  $> ./mysqld --basedir=/usr/local --verbose --help
  ```

Você pode especificar outras opções, como `--datadir`, mas `--verbose` e `--help` devem ser as últimas opções.

Depois de definir as configurações do caminho que você deseja, inicie o servidor sem `--verbose` e `--help`.

Se o `mysqld` estiver em execução, você pode descobrir quais configurações de caminho está usando executando este comando:

  ```sql
  $> mysqladmin variables
  ```

Ou:

  ```sql
  $> mysqladmin -h host_name variables
  ```

*`host_name`* é o nome do host do servidor MySQL.

* Certifique-se de que o servidor possa acessar o diretório de dados. A propriedade e as permissões do diretório de dados e seu conteúdo devem permitir que o servidor os leia e os modifique.

Se você receber `Errcode 13` (o que significa `Permission denied`) ao iniciar `mysqld`, isso significa que os privilégios do diretório de dados ou seus conteúdos não permitem o acesso do servidor. Neste caso, você altera as permissões dos arquivos e diretórios envolvidos para que o servidor tenha o direito de usá-los. Você também pode iniciar o servidor como `root`, mas isso levanta questões de segurança e deve ser evitado.

Altere a localização para o diretório de dados e verifique a propriedade do diretório de dados e seu conteúdo para garantir que o servidor tenha acesso. Por exemplo, se o diretório de dados for `/usr/local/mysql/var`, use este comando:

  ```sql
  $> ls -la /usr/local/mysql/var
  ```

Se o diretório de dados ou seus arquivos ou subdiretórios não pertencem à conta de login que você usa para executar o servidor, mude a propriedade para essa conta. Se a conta for chamada de `mysql`, use esses comandos:

  ```sql
  $> chown -R mysql /usr/local/mysql/var
  $> chgrp -R mysql /usr/local/mysql/var
  ```

Mesmo com a propriedade correta, o MySQL pode não iniciar se houver outro software de segurança em execução no seu sistema que gere o acesso do aplicativo a várias partes do sistema de arquivos. Nesse caso, reconfigure esse software para permitir que o `mysqld` acesse os diretórios que ele usa durante o funcionamento normal.

* Verifique se as interfaces de rede que o servidor deseja usar estão disponíveis.

Se ocorrer algum dos seguintes erros, isso significa que algum outro programa (talvez outro servidor `mysqld`) está usando a porta TCP/IP ou o arquivo de soquete Unix que o `mysqld` está tentando usar:

  ```sql
  Can't start server: Bind on TCP/IP port: Address already in use
  Can't start server: Bind on unix socket...
  ```

Use o **ps** para determinar se você tem outro servidor `mysqld` em execução. Se sim, desligue o servidor antes de iniciar novamente o `mysqld`. (Se outro servidor estiver em execução e você realmente quiser executar vários servidores, você pode encontrar informações sobre como fazer isso na Seção 5.7, “Executando várias instâncias do MySQL em uma máquina”.)

Se nenhum outro servidor estiver em execução, execute o comando `telnet your_host_name tcp_ip_port_number`. (O número padrão da porta do MySQL é 3306.) Em seguida, pressione Enter algumas vezes. Se não receber uma mensagem de erro como `telnet: Unable to connect to remote host: Connection refused`, algum outro programa está usando a porta TCP/IP que o `mysqld` está tentando usar. Identifique qual programa é esse e desative-o, ou informe o `mysqld` para ouvir uma porta diferente com a opção `--port`. Neste caso, especifique o mesmo número de porta não padrão para os programas cliente ao se conectar ao servidor usando TCP/IP.

Outra razão pela qual o porto pode não ser acessível é que você tem um firewall em execução que bloqueia as conexões a ele. Se assim for, modifique as configurações do firewall para permitir o acesso à porta.

Se o servidor começar a funcionar, mas você não conseguir se conectar a ele, certifique-se de que você tem uma entrada em `/etc/hosts` que se parece com esta:

  ```sql
  127.0.0.1       localhost
  ```

* Se não conseguir iniciar o `mysqld`, tente criar um arquivo de depuração para encontrar o problema usando a opção `--debug`. Veja a Seção 5.8.3, “O pacote DBUG”.

### 2.9.3 Testando o servidor

Após o diretório de dados ser inicializado e você ter iniciado o servidor, realize alguns testes simples para garantir que ele funcione satisfatoriamente. Esta seção assume que sua localização atual é o diretório de instalação do MySQL e que ele possui um subdiretório `bin` contendo os programas MySQL utilizados aqui. Se isso não for verdade, ajuste os nomes dos caminhos do comando conforme necessário.

Como alternativa, adicione o diretório `bin` à configuração da variável de ambiente `PATH`. Isso permite que seu shell (interpretador de comandos) encontre os programas MySQL corretamente, para que você possa executar um programa digitando apenas seu nome, e não o nome do caminho. Veja a Seção 4.2.7, “Definindo Variáveis de Ambiente”.

Use **mysqladmin** para verificar se o servidor está em execução. Os seguintes comandos fornecem testes simples para verificar se o servidor está ativo e respondendo às conexões:

```sql
$> bin/mysqladmin version
$> bin/mysqladmin variables
```

Se você não conseguir se conectar ao servidor, especifique uma opção `-u root` para se conectar como `root`. Se você já tiver atribuído uma senha para a conta `root`, também precisará especificar `-p` na linha de comando e inserir a senha quando solicitado. Por exemplo:

```sql
$> bin/mysqladmin -u root -p version
Enter password: (enter root password here)
```

A saída da versão **mysqladmin** varia um pouco dependendo da sua plataforma e da versão do MySQL, mas deve ser semelhante àquela mostrada aqui:

```sql
$> bin/mysqladmin version
mysqladmin  Ver 14.12 Distrib 5.7.44, for pc-linux-gnu on i686
...

Server version          5.7.44
Protocol version        10
Connection              Localhost via UNIX socket
UNIX socket             /var/lib/mysql/mysql.sock
Uptime:                 14 days 5 hours 5 min 21 sec

Threads: 1  Questions: 366  Slow queries: 0
Opens: 0  Flush tables: 1  Open tables: 19
Queries per second avg: 0.000
```

Para ver o que mais você pode fazer com o **mysqladmin**, invólctelo com a opção `--help`.

Verifique se você pode desligar o servidor (inclua uma opção `-p` se a conta `root` tiver uma senha já):

```sql
$> bin/mysqladmin -u root shutdown
```

Verifique se você pode iniciar o servidor novamente. Faça isso usando `mysqld_safe` ou invocando diretamente `mysqld`. Por exemplo:

```sql
$> bin/mysqld_safe --user=mysql &
```

Se o `mysqld_safe` falhar, consulte a Seção 2.9.2.1, “Soluções para problemas ao iniciar o servidor MySQL”.

Realize alguns testes simples para verificar se você pode recuperar informações do servidor. A saída deve ser semelhante àquela mostrada aqui.

Use **mysqlshow** para ver quais bancos de dados existem:

```sql
$> bin/mysqlshow
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

A lista de bancos de dados instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`.

Se você especificar um nome de banco de dados, o **mysqlshow** exibe uma lista das tabelas dentro do banco de dados:

```sql
$> bin/mysqlshow mysql
Database: mysql
+---------------------------+
|          Tables           |
+---------------------------+
| columns_priv              |
| db                        |
| engine_cost               |
| event                     |
| func                      |
| general_log               |
| gtid_executed             |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| innodb_index_stats        |
| innodb_table_stats        |
| ndb_binlog_index          |
| plugin                    |
| proc                      |
| procs_priv                |
| proxies_priv              |
| server_cost               |
| servers                   |
| slave_master_info         |
| slave_relay_log_info      |
| slave_worker_info         |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
+---------------------------+
```

Use o programa **mysql** para selecionar informações de uma tabela no banco de dados `mysql`:

```sql
$> bin/mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | mysql_native_password |
+------+-----------+-----------------------+
```

Neste ponto, o seu servidor está em execução e você pode acessá-lo. Para aumentar a segurança, se ainda não tiver atribuído uma senha à conta inicial, siga as instruções na Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

Para mais informações sobre **mysql**, **mysqladmin** e **mysqlshow**, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”, a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL” e a Seção 4.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.

### 2.9.4 Asegurando a Conta Inicial do MySQL

O processo de instalação do MySQL envolve a inicialização do diretório de dados, incluindo as tabelas de concessão no banco de dados do sistema `mysql` que definem as contas do MySQL. Para detalhes, consulte a Seção 2.9.1, “Inicializando o diretório de dados”.

Esta seção descreve como atribuir uma senha à conta inicial `root` criada durante o procedimento de instalação do MySQL, se você ainda não a fez.

Nota

Meios alternativos para realizar o processo descrito nesta seção:

* Em Windows, você pode realizar o processo durante a instalação com o Instalador MySQL (consulte a Seção 2.3.3, “Instalador MySQL para Windows”).

* Em todas as plataformas, a distribuição do MySQL inclui o `mysql_secure_installation`, uma ferramenta de linha de comando que automatiza grande parte do processo de segurança de uma instalação do MySQL.

* Em todas as plataformas, o MySQL Workbench está disponível e oferece a capacidade de gerenciar contas de usuário (consulte o Capítulo 29, *MySQL Workbench*).

Uma senha pode já estar atribuída à conta inicial nessas circunstâncias:

* Em Windows, as instalações realizadas usando o Instalador MySQL oferecem a opção de atribuir uma senha.

* A instalação usando o instalador do macOS gera uma senha aleatória inicial, que o instalador exibe ao usuário em uma caixa de diálogo.

* A instalação usando pacotes RPM gera uma senha aleatória inicial, que é escrita no log de erro do servidor.

* As instalações que utilizam pacotes do Debian oferecem a opção de atribuir uma senha.

* Para a inicialização do diretório de dados realizada manualmente usando **mysqld --initialize**, `mysqld` gera uma senha aleatória inicial, marca-a como expirada e escreve-a no log de erro do servidor. Veja a Seção 2.9.1, “Inicializando o diretório de dados”.

A tabela de concessão `mysql.user` define a conta inicial do usuário MySQL e seus privilégios de acesso. A instalação do MySQL cria apenas uma conta de superusuário `'root'@'localhost'` que tem todos os privilégios e pode fazer qualquer coisa. Se a conta `root` tiver uma senha vazia, sua instalação do MySQL não está protegida: Qualquer pessoa pode se conectar ao servidor MySQL como `root` *sem uma senha* e receber todos os privilégios.

A conta `'root'@'localhost'` também tem uma linha na tabela `mysql.proxies_priv` que permite conceder o privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Veja a Seção 6.2.14, “Usuários Proxy”.

Para atribuir uma senha para a conta inicial do MySQL `root`, use o procedimento a seguir. Substitua *`root-password`* nos exemplos pela senha que você deseja usar.

Inicie o servidor, se ele não estiver em execução. Para obter instruções, consulte a Seção 2.9.2, “Iniciando o servidor”.

A conta inicial `root` pode ou não ter uma senha. Escolha o procedimento que se aplica:

* Se a conta `root` existir com uma senha inicial aleatória que expirou, conecte-se ao servidor como `root` usando essa senha, em seguida, escolha uma nova senha. Este é o caso se o diretório de dados foi inicializado usando **mysqld --initialize**, seja manualmente ou usando um instalador que não lhe dê a opção de especificar uma senha durante a operação de instalação. Como a senha existe, você deve usá-la para se conectar ao servidor. Mas, como a senha expirou, você não pode usar a conta para qualquer outro propósito além de escolher uma nova senha, até que você escolha uma.

1. Se você não conhece a senha aleatória inicial, procure no registro de erro do servidor.

2. Conecte-se ao servidor como `root` usando a senha:

     ```sql
     $> mysql -u root -p
     Enter password: (enter the random root password here)
     ```

3. Escolha uma nova senha para substituir a senha aleatória:

     ```sql
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

* Se a conta `root` existir, mas não tiver senha, conecte-se ao servidor como `root` sem senha, e, em seguida, atribua uma senha. Este é o caso se você iniciou o diretório de dados usando **mysqld --initialize-insecure**.

1. Conecte-se ao servidor como `root` sem senha:

     ```sql
     $> mysql -u root --skip-password
     ```

2. Atribua uma senha:

     ```sql
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
     ```

Depois de atribuir uma senha à conta `root`, você deve fornecer essa senha sempre que se conectar ao servidor usando a conta. Por exemplo, para se conectar ao servidor usando o cliente **mysql**, use este comando:

```sql
$> mysql -u root -p
Enter password: (enter root password here)
```

Para desligar o servidor com **mysqladmin**, use este comando:

```sql
$> mysqladmin -u root -p shutdown
Enter password: (enter root password here)
```

Nota

Para obter informações adicionais sobre a definição de senhas, consulte a Seção 6.2.10, “Atribuição de Senhas de Conta”. Se você esquecer sua senha do `root` após defini-la, consulte a Seção B.3.3.2, “Como Redefinir a Senha do Root”.

Para configurar contas adicionais, consulte a Seção 6.2.7, “Adicionar contas, atribuir privilégios e excluir contas”.

### 2.9.5 Iniciar e parar o MySQL automaticamente

Esta seção discute métodos para iniciar e parar o servidor MySQL.

Geralmente, você inicia o servidor `mysqld` de uma das seguintes maneiras:

* Invoque `mysqld` diretamente. Isso funciona em qualquer plataforma.

* No Windows, você pode configurar um serviço MySQL que é executado automaticamente quando o Windows é iniciado. Veja a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

* Em sistemas Unix e semelhantes, você pode invocar `mysqld_safe`, que tenta determinar as opções apropriadas para `mysqld` e, em seguida, executá-lo com essas opções. Veja a Seção 4.3.2, “`mysqld_safe` — Script de inicialização do MySQL Server”.

* Em sistemas Linux que suportam o systemd, você pode usá-lo para controlar o servidor. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

* Em sistemas que utilizam diretórios de execução no estilo System V (ou seja, `/etc/init.d` e diretórios específicos para nível de execução), invoque **mysql.server**. Este script é usado principalmente no início e no desligamento do sistema. Ele geralmente é instalado com o nome `mysql`. O script **mysql.server** inicia o servidor invocando `mysqld_safe`. Veja a Seção 4.3.3, “mysql.server — Script de inicialização do servidor MySQL”.

* Em macOS, instale um daemon de launchd para habilitar o início automático do MySQL no início do sistema. O daemon inicia o servidor invocando `mysqld_safe`. Para detalhes, consulte a Seção 2.4.3, “Instalando um daemon de inicialização MySQL”. Um Painel de Preferências MySQL também oferece controle para iniciar e parar o MySQL através das Preferências do Sistema. Consulte a Seção 2.4.4, “Instalando e Usando o Painel de Preferências MySQL”.

* No Solaris, use o sistema de gerenciamento de serviços (SMF) para iniciar e controlar o início do MySQL.

O systemd, os scripts `mysqld_safe` e **mysql.server**, o Solaris SMF e o item de inicialização do macOS (ou Painel de Preferências do MySQL) podem ser usados para iniciar o servidor manualmente ou automaticamente no momento do início do sistema. O systemd, **mysql.server** e o item de inicialização também podem ser usados para parar o servidor.

A tabela a seguir mostra quais grupos de opções agrupam os scripts de servidor e de inicialização lidos a partir de arquivos de opção.

**Tabela 2.15 Scripts de inicialização do MySQL e grupos de opções de servidor suportados**

<table>
<thead>
<tr>
<th>Script</th>
<th>Grupos de opções</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>mysqld</code></td>
<td><code>[mysqld]</code>,<code>[server]</code>,<code>[mysqld-major_version]</code></td>
</tr>
<tr>
<td><code>mysqld_safe</code></td>
<td><code>[mysqld]</code>,<code>[server]</code>,<code>[mysqld_safe]</code></td>
</tr>
<tr>
<td><code>mysql.server</code></td>
<td><code>[mysqld]</code>,<code>[mysql.server]</code>,<code>[server]</code></td>
</tr>
</tbody>
</table>

`[mysqld-major_version]` significa que grupos com nomes como `[mysqld-5.6]` e `[mysqld-5.7]` são lidos por servidores que possuem versões 5.6.x, 5.7.x, e assim por diante. Esse recurso pode ser usado para especificar opções que só podem ser lidas por servidores dentro de uma série de lançamento específica.

Para compatibilidade reversa, o **mysql.server** também lê o grupo `[mysql_server]` e o `mysqld_safe` também lê o grupo `[safe_mysqld]`. Para ser atualizado, você deve atualizar seus arquivos de opção para usar os grupos `[mysql.server]` e `[mysqld_safe]` em vez disso.

