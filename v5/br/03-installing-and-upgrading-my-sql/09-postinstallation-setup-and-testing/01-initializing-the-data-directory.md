### 2.9.1 Inicializando o Diretório de Dados

Depois que o MySQL for instalado, o diretório de dados deve ser inicializado, incluindo as tabelas no banco de dados do sistema `mysql`:

- Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados é automática, conforme descrito na Seção 2.9, “Configuração e Teste Pós-Instalação”.

- Para outros métodos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de código-fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote de arquivo ZIP no Windows.

Esta seção descreve como inicializar o diretório de dados manualmente para os métodos de instalação do MySQL para os quais a inicialização do diretório de dados não é automática. Para obter alguns comandos sugeridos que permitem testar se o servidor é acessível e está funcionando corretamente, consulte a Seção 2.9.3, “Testando o Servidor”.

- Visão geral da inicialização do diretório de dados
- Procedimento de Inicialização do Diretório de Dados
- Ações do servidor durante a inicialização do diretório de dados
- Atribuição da senha de root após a inicialização

#### Visão geral da inicialização do diretório de dados

Nos exemplos mostrados aqui, o servidor deve ser executado sob o ID de usuário da conta de login `mysql`. Crie a conta, se ela não existir (veja Criar um usuário e grupo mysql), ou substitua o nome de uma conta de login existente que você planeja usar para executar o servidor.

1. Altere a localização para o diretório de nível superior da instalação do MySQL, que normalmente é `/usr/local/mysql` (ajuste o nome do caminho conforme necessário para o seu sistema):

   ```sql
   cd /usr/local/mysql
   ```

   Neste diretório, há vários arquivos e subdiretórios, incluindo o subdiretório `bin`, que contém o servidor, bem como programas de cliente e utilitários.

2. A variável de sistema `secure_file_priv` limita as operações de importação e exportação para um diretório específico. Crie um diretório cuja localização pode ser especificada como o valor dessa variável:

   ```sql
   mkdir mysql-files
   ```

   Atribua a propriedade do diretório ao usuário e ao grupo `mysql` e ao grupo `mysql`, e defina as permissões do diretório adequadamente:

   ```sql
   chown mysql:mysql mysql-files
   chmod 750 mysql-files
   ```

3. Use o servidor para inicializar o diretório de dados, incluindo o banco de dados `mysql` que contém as tabelas iniciais de concessão do MySQL que determinam como os usuários são autorizados a se conectar ao servidor. Por exemplo:

   ```sql
   bin/mysqld --initialize --user=mysql
   ```

   Para informações importantes sobre o comando, especialmente sobre as opções de comando que você pode usar, consulte o procedimento de inicialização do diretório de dados. Para obter detalhes sobre como o servidor realiza a inicialização, consulte Ações do servidor durante a inicialização do diretório de dados.

   Normalmente, a inicialização do diretório de dados só precisa ser feita após a instalação inicial do MySQL. (Para atualizações de uma instalação existente, realize o procedimento de atualização em vez disso; veja a Seção 2.10, “Atualizando o MySQL”.) No entanto, o comando que inicializa o diretório de dados não sobrescreve nenhuma tabela de banco de dados `mysql` existente, portanto, é seguro executá-lo em qualquer circunstância.

   Nota

   A inicialização do diretório de dados pode falhar se as bibliotecas do sistema necessárias estiverem ausentes. Por exemplo, você pode ver um erro como este:

   ```sql
   bin/mysqld: error while loading shared libraries:
   libnuma.so.1: cannot open shared object file:
   No such file or directory
   ```

   Se isso acontecer, você deve instalar as bibliotecas ausentes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização do diretório de dados.

4. Se você deseja implementar o servidor com suporte automático para conexões seguras, use o utilitário **mysql\_ssl\_rsa\_setup** para criar arquivos SSL e RSA padrão:

   ```sql
   bin/mysql_ssl_rsa_setup
   ```

   Para obter mais informações, consulte a Seção 4.4.5, “mysql\_ssl\_rsa\_setup — Criar arquivos SSL/RSA”.

5. Na ausência de arquivos de opções, o servidor inicia com suas configurações padrão. (Veja a Seção 5.1.2, “Configurações Padrão do Servidor”.) Para especificar explicitamente as opções que o servidor MySQL deve usar ao iniciar, coloque-as em um arquivo de opções, como `/etc/my.cnf` ou `/etc/mysql/my.cnf`. (Veja a Seção 4.2.2.2, “Uso de Arquivos de Opções”.) Por exemplo, você pode usar um arquivo de opções para definir a variável de sistema `secure_file_priv`.

6. Para configurar o MySQL para iniciar sem intervenção manual no momento do boot do sistema, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

7. A inicialização do diretório de dados cria tabelas de fuso horário no banco de dados `mysql`, mas não as preenche. Para isso, use as instruções na Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

#### Procedimento de Inicialização do Diretório de Dados

Altere a localização para o diretório de nível superior da instalação do MySQL, que normalmente é `/usr/local/mysql` (ajuste o nome do caminho conforme necessário para o seu sistema):

```sql
cd /usr/local/mysql
```

Para inicializar o diretório de dados, invocando o **mysqld** com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o servidor gere uma senha inicial aleatória para a conta `'root'@'localhost'` ou crie essa conta sem senha:

- Use `--initialize` para a instalação "segura por padrão" (ou seja, incluindo a geração de uma senha inicial aleatória para o `root`). Nesse caso, a senha está marcada como expirada e você deve escolher uma nova.

- Com `--initialize-insecure`, não é gerada nenhuma senha `root`. Isso é inseguro; é assumido que você atribuirá uma senha à conta de forma oportuna antes de colocar o servidor em uso produtivo.

Para obter instruções sobre como atribuir uma nova senha para o `'root'@'localhost'`, consulte Atribuição de senha do root após a inicialização.

Nota

O servidor escreve quaisquer mensagens (incluindo qualquer senha inicial) na saída padrão de erro. Isso pode ser redirecionado para o log de erro, então, procure lá se você não vir as mensagens na tela. Para obter informações sobre o log de erro, incluindo onde ele está localizado, consulte a Seção 5.4.2, “O Log de Erro”.

No Windows, use a opção `--console` para direcionar as mensagens para o console.

Em sistemas Unix e similares, é importante que os diretórios e arquivos do banco de dados sejam de propriedade da conta de login `mysql` para que o servidor tenha acesso de leitura e escrita a eles quando você executá-lo mais tarde. Para garantir isso, inicie o **mysqld** a partir da conta `root` do sistema e inclua a opção `--user`, conforme mostrado aqui:

```sql
bin/mysqld --initialize --user=mysql
bin/mysqld --initialize-insecure --user=mysql
```

Alternativamente, execute **mysqld** enquanto estiver logado como `mysql`, nesse caso, você pode omitir a opção `--user` do comando.

No Windows, use um desses comandos:

```sql
bin\mysqld --initialize --console
bin\mysqld --initialize-insecure --console
```

Nota

A inicialização do diretório de dados pode falhar se as bibliotecas do sistema necessárias estiverem ausentes. Por exemplo, você pode ver um erro como este:

```sql
bin/mysqld: error while loading shared libraries:
libnuma.so.1: cannot open shared object file:
No such file or directory
```

Se isso acontecer, você deve instalar as bibliotecas ausentes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização do diretório de dados.

Pode ser necessário especificar outras opções, como `--basedir` ou `--datadir`, se o **mysqld** não conseguir identificar os locais corretos para o diretório de instalação ou o diretório de dados. Por exemplo (insira o comando em uma única linha):

```sql
bin/mysqld --initialize --user=mysql
  --basedir=/opt/mysql/mysql
  --datadir=/opt/mysql/mysql/data
```

Alternativamente, coloque as configurações de opção relevantes em um arquivo de opção e passe o nome desse arquivo para o **mysqld**. Para sistemas Unix e similares, suponha que o nome do arquivo de opção seja `/opt/mysql/mysql/etc/my.cnf`. Coloque essas linhas no arquivo:

```sql
[mysqld]
basedir=/opt/mysql/mysql
datadir=/opt/mysql/mysql/data
```

Em seguida, invoque o **mysqld** da seguinte forma (insira o comando em uma única linha, com a opção `--defaults-file` primeiro):

```sql
bin/mysqld --defaults-file=/opt/mysql/mysql/etc/my.cnf
  --initialize --user=mysql
```

No Windows, suponha que `C:\my.ini` contenha essas linhas:

```sql
[mysqld]
basedir=C:\\Program Files\\MySQL\\MySQL Server 5.7
datadir=D:\\MySQLdata
```

Em seguida, invoque o **mysqld** da seguinte forma (novamente, você deve digitar o comando em uma única linha, com a opção `--defaults-file` primeiro):

```sql
bin\mysqld --defaults-file=C:\my.ini
   --initialize --console
```

Importante

Ao inicializar o diretório de dados, você não deve especificar nenhuma opção além das usadas para definir as localizações do diretório, como `--basedir` ou `--datadir`, e a opção `--user`, se necessário. As opções que o servidor MySQL deve usar durante o uso normal podem ser definidas ao reiniciá-lo após a inicialização. Consulte a descrição da opção `--initialize` para obter mais informações.

#### Ações do servidor durante a inicialização do diretório de dados

Nota

A sequência de inicialização do diretório de dados realizada pelo servidor não substitui as ações realizadas por **mysql\_secure\_installation** e **mysql\_ssl\_rsa\_setup**. Veja a Seção 4.4.4, “mysql\_secure\_installation — Melhorar a Segurança da Instalação do MySQL”, e a Seção 4.4.5, “mysql\_ssl\_rsa\_setup — Criar Arquivos SSL/RSA”.

Quando invocado com a opção `--initialize` ou `--initialize-insecure`, o **mysqld** executa as seguintes ações durante a sequência de inicialização do diretório de dados:

1. O servidor verifica a existência do diretório de dados da seguinte forma:

   - Se o diretório de dados não existir, o servidor cria-o.
   - Se o diretório de dados existir, mas não estiver vazio (ou seja, se contiver arquivos ou subdiretórios), o servidor será encerrado após exibir uma mensagem de erro:

     ```sql
     [ERROR] --initialize specified but the data directory exists. Aborting.
     ```

     Nesse caso, remova ou renomeie o diretório de dados e tente novamente.

     A partir do MySQL 5.7.11, um diretório de dados existente pode ser permitido que não esteja vazio se cada entrada tiver um nome que comece com um ponto (`.`) ou se o nome for definido usando a opção `--ignore-db-dir`.

     Nota

     Evite o uso da opção `--ignore-db-dir`, que foi descontinuada desde o MySQL 5.7.16.

2. Dentro do diretório de dados, o servidor cria o banco de dados do sistema `mysql` e suas tabelas, incluindo as tabelas de concessão, tabelas de fuso horário e tabelas de ajuda do lado do servidor. Veja a Seção 5.3, “O Banco de Dados do Sistema mysql”.

3. O servidor inicializa o espaço de tabela do sistema e as estruturas de dados relacionadas necessárias para gerenciar as tabelas `InnoDB`.

   Nota

   Após o **mysqld** configurar o espaço de tabelas `InnoDB`, certas alterações nas características do espaço de tabelas exigem a criação de uma nova instância. As alterações qualificadas incluem o nome do arquivo do primeiro arquivo no espaço de tabelas do sistema e o número de logs de desfazer. Se você não quiser usar os valores padrão, certifique-se de que as configurações dos parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estejam no arquivo de configuração do MySQL *antes* de executar o **mysqld**. Além disso, certifique-se de especificar outros parâmetros necessários que afetam a criação e a localização dos arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

   Se essas opções estiverem no seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL lê por padrão, especifique a localização do arquivo usando a opção `--defaults-extra-file` quando você executar o **mysqld**.

4. O servidor cria uma conta de superusuário `'root'@'localhost'` e outras contas reservadas (consulte a Seção 6.2.8, "Contas Reservadas"). Algumas contas reservadas estão bloqueadas e não podem ser usadas por clientes, mas `'root'@'localhost'` é destinado ao uso administrativo e você deve atribuir uma senha a ela.

   As ações do servidor em relação a uma senha para a conta `'root'@'localhost'` dependem de como você a invoca:

   - Com `--initialize` (mas não `--initialize-insecure`), o servidor gera uma senha aleatória, marca-a como expirada e escreve uma mensagem exibindo a senha:

     ```sql
     [Warning] A temporary password is generated for root@localhost:
     iTag*AfrH5ej
     ```

   - Com `--initialize-insecure`, (com ou sem `--initialize`, pois `--initialize-insecure` implica em `--initialize`), o servidor não gera uma senha ou marca-a como expirada e escreve uma mensagem de aviso:

     ```sql
     [Warning] root@localhost is created with an empty password ! Please
     consider switching off the --initialize-insecure option.
     ```

   Para obter instruções sobre como atribuir uma nova senha para o `'root'@'localhost'`, consulte Atribuição de senha do root após a inicialização.

5. O servidor preenche as tabelas de ajuda do lado do servidor usadas para a instrução `HELP` (consulte a Seção 13.8.3, “Instrução HELP”). O servidor não preenche as tabelas de fuso horário. Para fazer isso manualmente, consulte a Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

6. Se a variável de sistema `init_file` foi fornecida para nomear um arquivo de instruções SQL, o servidor executa as instruções no arquivo. Esta opção permite que você realize sequências de inicialização personalizadas.

   Quando o servidor opera no modo bootstrap, algumas funcionalidades não estão disponíveis, o que limita as instruções permitidas no arquivo. Essas incluem instruções relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transações globais.

7. O servidor sai.

#### Atribuição da senha de root após a inicialização

Depois de inicializar o diretório de dados iniciando o servidor com `--initialize` ou `--initialize-insecure`, inicie o servidor normalmente (ou seja, sem nenhuma dessas opções) e atribua uma nova senha à conta `'root'@'localhost'`:

1. Inicie o servidor. Para obter instruções, consulte a Seção 2.9.2, “Iniciar o Servidor”.

2. Conecte-se ao servidor:

   - Se você usou `--initialize` mas não `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root`:

     ```sql
     mysql -u root -p
     ```

     Em seguida, na tela de senha, insira a senha aleatória que o servidor gerou durante a sequência de inicialização:

     ```sql
     Enter password: (enter the random root password here)
     ```

     Procure no log de erro do servidor se você não souber essa senha.

   - Se você usou `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root` sem senha:

     ```sql
     mysql -u root --skip-password
     ```

3. Após a conexão, use uma instrução `ALTER USER` para atribuir uma nova senha para o `root`:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
   ```

Veja também a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

Nota

As tentativas de conexão com o host `127.0.0.1` normalmente resolvem para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que exista uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

```sql
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
```

É possível colocar essas declarações em um arquivo para ser executado usando a variável de sistema `init_file`, conforme discutido em Ações do servidor durante a inicialização do diretório de dados.
