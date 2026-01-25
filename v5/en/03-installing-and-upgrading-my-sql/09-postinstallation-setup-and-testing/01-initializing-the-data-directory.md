### 2.9.1 Inicializando o Diretório de Dados

Após a instalação do MySQL, o diretório de dados deve ser inicializado, incluindo as tabelas na database do sistema `mysql`:

* Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados é automática, conforme descrito na Seção 2.9, “Configuração Pós-instalação e Testes”.

* Para outros métodos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui instalações a partir de distribuições binárias genéricas e de código-fonte em sistemas Unix e Unix-like, e instalações a partir de um pacote ZIP Archive no Windows.

Esta seção descreve como inicializar o diretório de dados manualmente para métodos de instalação do MySQL para os quais a inicialização do diretório de dados não é automática. Para alguns comandos sugeridos que permitem testar se o Server está acessível e funcionando corretamente, consulte a Seção 2.9.3, “Testando o Server”.

* Visão Geral da Inicialização do Diretório de Dados
* Procedimento de Inicialização do Diretório de Dados
* Ações do Server Durante a Inicialização do Diretório de Dados
* Atribuição de Senha de root Pós-Inicialização

#### Visão Geral da Inicialização do Diretório de Dados

Nos exemplos mostrados aqui, o Server deve ser executado sob o ID de usuário da conta de login `mysql`. Crie a conta, se ela não existir (consulte Criar um Usuário e Grupo mysql), ou substitua pelo nome de uma conta de login existente diferente que você planeja usar para executar o Server.

1. Altere a localização para o diretório de nível superior de sua instalação do MySQL, que geralmente é `/usr/local/mysql` (ajuste o nome do caminho para o seu sistema conforme necessário):

   ```sql
   cd /usr/local/mysql
   ```

   Dentro deste diretório estão vários arquivos e subdiretórios, incluindo o subdiretório `bin` que contém o Server, bem como programas clientes e utilitários.

2. A variável de sistema `secure_file_priv` limita as operações de importação e exportação a um diretório específico. Crie um diretório cuja localização possa ser especificada como o valor dessa variável:

   ```sql
   mkdir mysql-files
   ```

   Conceda a propriedade de usuário e grupo do diretório ao usuário `mysql` e ao grupo `mysql`, e defina as permissões do diretório apropriadamente:

   ```sql
   chown mysql:mysql mysql-files
   chmod 750 mysql-files
   ```

3. Use o Server para inicializar o diretório de dados, incluindo a database `mysql` que contém as tabelas GRANT iniciais do MySQL que determinam como os usuários têm permissão para se conectar ao Server. Por exemplo:

   ```sql
   bin/mysqld --initialize --user=mysql
   ```

   Para informações importantes sobre o comando, especialmente em relação às opções de comando que você pode usar, consulte Procedimento de Inicialização do Diretório de Dados. Para obter detalhes sobre como o Server executa a inicialização, consulte Ações do Server Durante a Inicialização do Diretório de Dados.

   Geralmente, a inicialização do diretório de dados só precisa ser feita após a primeira instalação do MySQL. (Para atualizações em uma instalação existente, execute o procedimento de upgrade; consulte a Seção 2.10, “Atualizando o MySQL”.) No entanto, o comando que inicializa o diretório de dados não sobrescreve nenhuma tabela de database `mysql` existente, portanto, é seguro executá-lo em qualquer circunstância.

   Note

   A inicialização do diretório de dados pode falhar se bibliotecas de sistema obrigatórias estiverem faltando. Por exemplo, você pode ver um erro como este:

   ```sql
   bin/mysqld: error while loading shared libraries:
   libnuma.so.1: cannot open shared object file:
   No such file or directory
   ```

   Se isso acontecer, você deve instalar as bibliotecas ausentes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização do diretório de dados.

4. Se você deseja implantar o Server com suporte automático para conexões seguras, use o utilitário **mysql_ssl_rsa_setup** para criar arquivos SSL e RSA padrão:

   ```sql
   bin/mysql_ssl_rsa_setup
   ```

   Para obter mais informações, consulte a Seção 4.4.5, “mysql_ssl_rsa_setup — Criar Arquivos SSL/RSA”.

5. Na ausência de quaisquer arquivos de opções, o Server é iniciado com suas configurações padrão. (Consulte a Seção 5.1.2, “Padrões de Configuração do Server”.) Para especificar explicitamente as opções que o Server MySQL deve usar na inicialização, coloque-as em um arquivo de opções, como `/etc/my.cnf` ou `/etc/mysql/my.cnf`. (Consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.) Por exemplo, você pode usar um arquivo de opções para definir a variável de sistema `secure_file_priv`.

6. Para configurar o MySQL para iniciar sem intervenção manual no momento da inicialização do sistema, consulte a Seção 2.9.5, “Iniciando e Parando o MySQL Automaticamente”.

7. A inicialização do diretório de dados cria tabelas de fuso horário na database `mysql`, mas não as preenche. Para fazer isso, use as instruções na Seção 5.1.13, “Suporte a Fuso Horário do Server MySQL”.

#### Procedimento de Inicialização do Diretório de Dados

Altere a localização para o diretório de nível superior de sua instalação do MySQL, que geralmente é `/usr/local/mysql` (ajuste o nome do caminho para o seu sistema conforme necessário):

```sql
cd /usr/local/mysql
```

Para inicializar o diretório de dados, invoque **mysqld** com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o Server gere uma senha inicial aleatória para a conta `'root'@'localhost'`, ou crie essa conta sem senha:

* Use `--initialize` para instalação “segura por padrão” (ou seja, incluindo a geração de uma senha de `root` inicial aleatória). Neste caso, a senha é marcada como expirada e você deve escolher uma nova.

* Com `--initialize-insecure`, nenhuma senha de `root` é gerada. Isso é inseguro; presume-se que você atribua uma senha à conta em tempo hábil antes de colocar o Server em uso de produção.

Para obter instruções sobre como atribuir uma nova senha a `'root'@'localhost'`, consulte Atribuição de Senha de root Pós-Inicialização.

Note

O Server grava quaisquer mensagens (incluindo qualquer senha inicial) em sua saída de erro padrão. Isso pode ser redirecionado para o log de erro, então procure lá se você não vir as mensagens na sua tela. Para obter informações sobre o log de erro, incluindo onde ele está localizado, consulte a Seção 5.4.2, “O Log de Erro”.

No Windows, use a opção `--console` para direcionar as mensagens para o console.

Em sistemas Unix e Unix-like, é importante que os diretórios e arquivos da database sejam de propriedade da conta de login `mysql` para que o Server tenha acesso de leitura e gravação a eles quando você o executar posteriormente. Para garantir isso, inicie **mysqld** a partir da conta `root` do sistema e inclua a opção `--user` conforme mostrado aqui:

```sql
bin/mysqld --initialize --user=mysql
bin/mysqld --initialize-insecure --user=mysql
```

Alternativamente, execute **mysqld** enquanto estiver logado como `mysql`, caso em que você pode omitir a opção `--user` do comando.

No Windows, use um destes comandos:

```sql
bin\mysqld --initialize --console
bin\mysqld --initialize-insecure --console
```

Note

A inicialização do diretório de dados pode falhar se bibliotecas de sistema obrigatórias estiverem faltando. Por exemplo, você pode ver um erro como este:

```sql
bin/mysqld: error while loading shared libraries:
libnuma.so.1: cannot open shared object file:
No such file or directory
```

Se isso acontecer, você deve instalar as bibliotecas ausentes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização do diretório de dados.

Pode ser necessário especificar outras opções, como `--basedir` ou `--datadir`, se o **mysqld** não conseguir identificar as localizações corretas para o diretório de instalação ou o diretório de dados. Por exemplo (insira o comando em uma única linha):

```sql
bin/mysqld --initialize --user=mysql
  --basedir=/opt/mysql/mysql
  --datadir=/opt/mysql/mysql/data
```

Alternativamente, coloque as configurações de opção relevantes em um arquivo de opções e passe o nome desse arquivo para o **mysqld**. Para sistemas Unix e Unix-like, suponha que o nome do arquivo de opções seja `/opt/mysql/mysql/etc/my.cnf`. Coloque estas linhas no arquivo:

```sql
[mysqld]
basedir=/opt/mysql/mysql
datadir=/opt/mysql/mysql/data
```

Em seguida, invoque **mysqld** da seguinte forma (insira o comando em uma única linha, com a opção `--defaults-file` primeiro):

```sql
bin/mysqld --defaults-file=/opt/mysql/mysql/etc/my.cnf
  --initialize --user=mysql
```

No Windows, suponha que `C:\my.ini` contenha estas linhas:

```sql
[mysqld]
basedir=C:\\Program Files\\MySQL\\MySQL Server 5.7
datadir=D:\\MySQLdata
```

Em seguida, invoque **mysqld** da seguinte forma (novamente, você deve inserir o comando em uma única linha, com a opção `--defaults-file` primeiro):

```sql
bin\mysqld --defaults-file=C:\my.ini
   --initialize --console
```

Important

Ao inicializar o diretório de dados, você não deve especificar nenhuma opção além daquelas usadas para definir localizações de diretório, como `--basedir` ou `--datadir`, e a opção `--user`, se necessário. As opções a serem empregadas pelo Server MySQL durante o uso normal podem ser definidas ao reiniciá-lo após a inicialização. Consulte a descrição da opção `--initialize` para obter mais informações.

#### Ações do Server Durante a Inicialização do Diretório de Dados

Note

A sequência de inicialização do diretório de dados realizada pelo Server não substitui as ações realizadas por **mysql_secure_installation** e **mysql_ssl_rsa_setup**. Consulte a Seção 4.4.4, “mysql_secure_installation — Melhorar a Segurança da Instalação do MySQL”, e a Seção 4.4.5, “mysql_ssl_rsa_setup — Criar Arquivos SSL/RSA”.

Quando invocado com a opção `--initialize` ou `--initialize-insecure`, o **mysqld** executa as seguintes ações durante a sequência de inicialização do diretório de dados:

1. O Server verifica a existência do diretório de dados da seguinte forma:

   * Se nenhum diretório de dados existir, o Server o cria.
   * Se o diretório de dados existir, mas não estiver vazio (ou seja, contiver arquivos ou subdiretórios), o Server é encerrado após produzir uma mensagem de erro:

     ```sql
     [ERROR] --initialize specified but the data directory exists. Aborting.
     ```

     Neste caso, remova ou renomeie o diretório de dados e tente novamente.

     A partir do MySQL 5.7.11, um diretório de dados existente pode não estar vazio se cada entrada tiver um nome que comece com um ponto (`.`) ou for nomeada usando uma opção `--ignore-db-dir`.

     Note

     Evite o uso da opção `--ignore-db-dir`, que foi descontinuada desde o MySQL 5.7.16.

2. Dentro do diretório de dados, o Server cria a database do sistema `mysql` e suas tabelas, incluindo as tabelas GRANT, tabelas de fuso horário e tabelas de ajuda do lado do Server. Consulte a Seção 5.3, “A Database do Sistema mysql”.

3. O Server inicializa o tablespace do sistema e as estruturas de dados relacionadas necessárias para gerenciar as tabelas `InnoDB`.

   Note

   Depois que o **mysqld** configura o tablespace do sistema `InnoDB`, certas alterações nas características do tablespace exigem a configuração de uma nova instância completa. As alterações qualificadas incluem o nome do primeiro arquivo no tablespace do sistema e o número de logs de undo. Se você não quiser usar os valores padrão, certifique-se de que as configurações para os parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estejam no lugar no arquivo de configuração do MySQL *antes* de executar o **mysqld**. Além disso, certifique-se de especificar, conforme necessário, outros parâmetros que afetam a criação e localização dos arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

   Se essas opções estiverem no seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL leia por padrão, especifique a localização do arquivo usando a opção `--defaults-extra-file` ao executar o **mysqld**.

4. O Server cria uma conta de superusuário `'root'@'localhost'` e outras contas reservadas (consulte a Seção 6.2.8, “Contas Reservadas”). Algumas contas reservadas são bloqueadas e não podem ser usadas por clientes, mas `'root'@'localhost'` é destinada ao uso administrativo e você deve atribuir-lhe uma senha.

   As ações do Server em relação a uma senha para a conta `'root'@'localhost'` dependem de como você o invoca:

   * Com `--initialize`, mas não `--initialize-insecure`, o Server gera uma senha aleatória, a marca como expirada e escreve uma mensagem exibindo a senha:

     ```sql
     [Warning] A temporary password is generated for root@localhost:
     iTag*AfrH5ej
     ```

   * Com `--initialize-insecure` (com ou sem `--initialize`, pois `--initialize-insecure` implica `--initialize`), o Server não gera uma senha nem a marca como expirada, e escreve uma mensagem de aviso:

     ```sql
     [Warning] root@localhost is created with an empty password ! Please
     consider switching off the --initialize-insecure option.
     ```

   Para obter instruções sobre como atribuir uma nova senha a `'root'@'localhost'`, consulte Atribuição de Senha de root Pós-Inicialização.

5. O Server preenche as tabelas de ajuda do lado do Server usadas para a instrução `HELP` (consulte a Seção 13.8.3, “Instrução HELP”). O Server não preenche as tabelas de fuso horário. Para fazer isso manualmente, consulte a Seção 5.1.13, “Suporte a Fuso Horário do Server MySQL”.

6. Se a variável de sistema `init_file` foi fornecida para nomear um arquivo de instruções SQL, o Server executa as instruções no arquivo. Esta opção permite que você execute sequências de bootstrap personalizadas.

   Quando o Server opera no modo de bootstrap, algumas funcionalidades ficam indisponíveis, o que limita as instruções permitidas no arquivo. Isso inclui instruções relacionadas ao gerenciamento de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transação global.

7. O Server é encerrado.

#### Atribuição de Senha de root Pós-Inicialização

Depois de inicializar o diretório de dados iniciando o Server com `--initialize` ou `--initialize-insecure`, inicie o Server normalmente (ou seja, sem nenhuma dessas opções) e atribua uma nova senha à conta `'root'@'localhost'`:

1. Inicie o Server. Para obter instruções, consulte a Seção 2.9.2, “Iniciando o Server”.

2. Conecte-se ao Server:

   * Se você usou `--initialize`, mas não `--initialize-insecure`, para inicializar o diretório de dados, conecte-se ao Server como `root`:

     ```sql
     mysql -u root -p
     ```

     Em seguida, no prompt de senha, insira a senha aleatória que o Server gerou durante a sequência de inicialização:

     ```sql
     Enter password: (enter the random root password here)
     ```

     Procure no log de erro do Server se você não souber esta senha.

   * Se você usou `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao Server como `root` sem uma senha:

     ```sql
     mysql -u root --skip-password
     ```

3. Após a conexão, use uma instrução `ALTER USER` para atribuir uma nova senha de `root`:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
   ```

Consulte também a Seção 2.9.4, “Protegendo a Conta MySQL Inicial”.

Note

As tentativas de conexão ao host `127.0.0.1` normalmente se resolvem para a conta `localhost`. No entanto, isso falha se o Server for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que exista uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie estas contas:

```sql
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
```

É possível colocar essas instruções em um arquivo a ser executado usando a variável de sistema `init_file`, conforme discutido em Ações do Server Durante a Inicialização do Diretório de Dados.