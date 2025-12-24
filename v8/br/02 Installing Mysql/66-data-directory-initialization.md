### 2.9.1 Inicialização do Directório de Dados

Após a instalação do MySQL, o diretório de dados deve ser inicializado, incluindo as tabelas no esquema do sistema `mysql`:

- Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados é automática, conforme descrito na Seção 2.9, "Configuração e teste pós-instalação".
- Para outros métodos de instalação, você deve inicializar o diretório de dados manualmente.

Esta seção descreve como inicializar o diretório de dados manualmente para métodos de instalação do MySQL para os quais a inicialização do diretório de dados não é automática.

::: info Note

O plugin de autenticação padrão é `caching_sha2_password`, e a conta administrativa `'root'@'localhost'` usa `caching_sha2_password` por padrão.

`mysql_native_password` (o plugin de autenticação padrão antes do MySQL 8.0) ainda é suportado, mas desativado por padrão a partir do MySQL 8.4.0 e removido a partir do MySQL 9.0.0.

:::

- Análise da inicialização do diretório de dados
- Procedimento de inicialização do diretório de dados
- Ações do servidor durante a inicialização do diretório de dados
- Atribuição de senha de raiz pós- inicialização

#### Análise da inicialização do diretório de dados

Nos exemplos mostrados aqui, o servidor está destinado a ser executado sob o ID de usuário da conta de login `mysql`. Crie a conta se ela não existir (veja Criar um usuário e grupo mysql), ou substitua o nome de uma conta de login existente diferente que você planeja usar para executar o servidor.

1. Altere o local para o diretório de nível superior da sua instalação do MySQL, que é tipicamente `/usr/local/mysql` (ajuste o nome do caminho para o seu sistema conforme necessário):

   ```
   cd /usr/local/mysql
   ```

   Dentro deste diretório, você pode encontrar vários arquivos e subdiretórios, incluindo o subdiretório `bin` que contém o servidor, bem como programas de cliente e utilitários.
2. A variável do sistema `secure_file_priv` limita as operações de importação e exportação a um diretório específico. Crie um diretório cuja localização pode ser especificada como o valor dessa variável:

   ```
   mkdir mysql-files
   ```

   Concede a propriedade do usuário e do grupo do diretório ao usuário `mysql` e ao grupo `mysql`, e defina as permissões do diretório apropriadamente:

   ```
   chown mysql:mysql mysql-files
   chmod 750 mysql-files
   ```
3. Use o servidor para inicializar o diretório de dados, incluindo o `mysql` esquema contendo as tabelas iniciais de concessão do MySQL que determinam como os usuários estão autorizados a se conectar ao servidor. Por exemplo:

   ```
   bin/mysqld --initialize --user=mysql
   ```

   Para obter informações importantes sobre o comando, especialmente sobre as opções de comando que você pode usar, consulte Processo de inicialização do diretório de dados. Para detalhes sobre como o servidor executa a inicialização, consulte Ações do servidor durante a inicialização do diretório de dados.

   Normalmente, a inicialização do diretório de dados só precisa ser feita após a primeira instalação do MySQL. (Para atualizações para uma instalação existente, execute o procedimento de atualização em vez disso; veja Capítulo 3, \* Atualização do MySQL \*.) No entanto, o comando que inicializa o diretório de dados não sobrescreve nenhuma tabela de esquema existente `mysql`, por isso é seguro para ser executado em qualquer circunstância.
4. Para especificar explicitamente as opções que o servidor MySQL deve usar na inicialização, coloque-as em um arquivo de opções, como `/etc/my.cnf` ou `/etc/mysql/my.cnf`. (Veja Seção 6.2.2.2, Utilizar Arquivos de Opção.) Por exemplo, você pode usar um arquivo de opções para definir a variável de sistema `secure_file_priv`.
5. Para organizar o arranque do MySQL sem intervenção manual no momento da inicialização do sistema, consulte a Secção 2.9.5, "Início e paragem automáticos do MySQL".
6. A inicialização do diretório de dados cria tabelas de fuso horário no esquema `mysql` mas não as preenche.

#### Procedimento de inicialização do diretório de dados

Altere o local para o diretório de nível superior da sua instalação do MySQL, que é tipicamente `/usr/local/mysql` (ajuste o nome do caminho para o seu sistema conforme necessário):

```
cd /usr/local/mysql
```

Para inicializar o diretório de dados, invoque `mysqld` com a opção `--initialize` ou `--initialize-insecure`, dependendo se você quer que o servidor gere uma senha inicial aleatória para a conta `'root'@'localhost'`, ou para criar essa conta sem senha:

- Use `--initialize` para secure by default instalação (isto é, incluindo a geração de uma senha inicial aleatória `root`). Neste caso, a senha é marcada como expirada e você deve escolher uma nova.
- Com `--initialize-insecure`, nenhuma senha `root` é gerada. Isto é inseguro; assume-se que você pretende atribuir uma senha à conta em tempo hábil antes de colocar o servidor em uso de produção.

Para instruções sobre como atribuir uma nova senha, consulte Post-Initialization root Password Assignment.

::: info Note

O servidor escreve qualquer mensagem (incluindo qualquer senha inicial) para sua saída de erro padrão.

No Windows, use a opção `--console` para direcionar mensagens para o console.

:::

Em sistemas Unix e Unix-like, é importante que os diretórios e arquivos de banco de dados sejam de propriedade da conta de login `mysql` para que o servidor tenha acesso de leitura e gravação quando você o executar mais tarde. Para garantir isso, inicie `mysqld` a partir da conta do sistema `root` e inclua a opção `--user` como mostrado aqui:

```
bin/mysqld --initialize --user=mysql
bin/mysqld --initialize-insecure --user=mysql
```

Alternativamente, execute `mysqld` enquanto estiver logado como `mysql`, caso em que você pode omitir a opção `--user` do comando.

No Windows, use um destes comandos:

```
binmysqld --initialize --console
binmysqld --initialize-insecure --console
```

::: info Note

A inicialização do diretório de dados pode falhar se as bibliotecas de sistema necessárias estiverem ausentes. Por exemplo, você pode ver um erro como este:

```
bin/mysqld: error while loading shared libraries:
libnuma.so.1: cannot open shared object file:
No such file or directory
```

Se isso acontecer, você deve instalar as bibliotecas faltantes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização de diretório de dados.

:::

Pode ser necessário especificar outras opções como `--basedir` ou `--datadir` se `mysqld` não puder identificar os locais corretos para o diretório de instalação ou diretório de dados. Por exemplo (inserir o comando em uma única linha):

```
bin/mysqld --initialize --user=mysql
  --basedir=/opt/mysql/mysql
  --datadir=/opt/mysql/mysql/data
```

Alternativamente, coloque as configurações de opções relevantes em um arquivo de opções e passe o nome desse arquivo para `mysqld`.

```
[mysqld]
basedir=/opt/mysql/mysql
datadir=/opt/mysql/mysql/data
```

Em seguida, invoque `mysqld` da seguinte forma (inserir o comando em uma única linha, com a opção `--defaults-file` primeiro):

```
bin/mysqld --defaults-file=/opt/mysql/mysql/etc/my.cnf
  --initialize --user=mysql
```

No Windows, suponha que `C:my.ini` contém estas linhas:

```
[mysqld]
basedir=C:Program FilesMySQLMySQL Server 8.4
datadir=D:MySQLdata
```

Em seguida, invoque `mysqld` da seguinte forma (novamente, você deve inserir o comando em uma única linha, com a opção `--defaults-file` primeiro):

```
binmysqld --defaults-file=C:my.ini
   --initialize --console
```

Importância

Ao inicializar o diretório de dados, você não deve especificar nenhuma outra opção além daquelas usadas para definir os locais do diretório, como `--basedir` ou `--datadir`, e a opção `--user` se necessário. As opções a serem empregadas pelo servidor MySQL durante o uso normal podem ser definidas ao reinicializá-lo após a inicialização. Veja a descrição da opção `--initialize` para mais informações.

#### Ações do servidor durante a inicialização do diretório de dados

::: info Note

A sequência de inicialização de diretório de dados executada pelo servidor não substitui as ações executadas por `mysql_secure_installation`.

:::

Quando invocado com a opção `--initialize` ou `--initialize-insecure`, `mysqld` executa as seguintes ações durante a sequência de inicialização do diretório de dados:

1. O servidor verifica a existência do diretório de dados da seguinte forma:

   - Se não existir um diretório de dados, o servidor cria-o.
   - Se o diretório de dados existir, mas não estiver vazio (isto é, ele contém arquivos ou subdiretórios), o servidor sai após produzir uma mensagem de erro:

     ```
     [ERROR] --initialize specified but the data directory exists. Aborting.
     ```

     Neste caso, remova ou renomeie o diretório de dados e tente novamente.

     Um diretório de dados existente pode ser não vazio se cada entrada tiver um nome que comece com um ponto (`.`).

2. Dentro do diretório de dados, o servidor cria o `mysql` esquema do sistema e suas tabelas, incluindo as tabelas de dicionário de dados, tabelas de concessão, tabelas de fuso horário e tabelas de ajuda do lado do servidor.

3. O servidor inicializa o espaço de tabelas do sistema e as estruturas de dados relacionadas necessárias para gerenciar tabelas `InnoDB`.

   ::: info Note

   Depois de `mysqld` configurar o `InnoDB` sistema de tabelas, certas mudanças nas características de tabelas exigem a criação de uma nova instância. As mudanças qualificadas incluem o nome do arquivo do primeiro arquivo no sistema de tabelas e o número de registros de anulação. Se você não quiser usar os valores padrão, certifique-se de que as configurações para os parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estão em vigor no arquivo de configuração do MySQL \* antes de executar `mysqld`. Também certifique-se de especificar como necessários outros parâmetros que afetam a criação e localização de arquivos \[\[PH\_CODE\_DE5]], como \[\[PH\_CODE\_DE6]] e `innodb_log_group_home_dir`.

   Se essas opções estiverem no seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL leia por padrão, especifique o local do arquivo usando a opção `--defaults-extra-file` quando você executar `mysqld`.

   :::

4. O servidor cria uma conta de superusuário `'root'@'localhost'` e outras contas reservadas. Algumas contas reservadas são bloqueadas e não podem ser usadas pelos clientes, mas `'root'@'localhost'` é destinado a uso administrativo e você deve atribuir uma senha.

   As ações do servidor com relação a uma senha para a conta `'root'@'localhost'` dependem de como você a invoca:

   - Com `--initialize` mas não `--initialize-insecure`, o servidor gera uma senha aleatória, marca-a como expirada e escreve uma mensagem exibindo a senha:

     ```
     [Warning] A temporary password is generated for root@localhost:
     iTag*AfrH5ej
     ```
   - Com `--initialize-insecure`, (com ou sem `--initialize` porque `--initialize-insecure` implica `--initialize`), o servidor não gera uma senha ou a marca expirada, e escreve uma mensagem de aviso:

     ```
     [Warning] root@localhost is created with an empty password ! Please
     consider switching off the --initialize-insecure option.
     ```

   Para instruções sobre como atribuir uma nova senha, consulte Post-Initialization root Password Assignment.

5. O servidor preenche as tabelas de ajuda do lado do servidor usadas para a instrução `HELP`. O servidor não preenche as tabelas de fuso horário. Para fazê-lo manualmente, veja Seção 7.1.15, Suporte de fuso horário do servidor MySQL.

6. Se a variável de sistema `init_file` foi dada para nomear um arquivo de instruções SQL, o servidor executa as instruções no arquivo. Esta opção permite executar sequências de bootstrapping personalizadas.

   Quando o servidor opera no modo de inicialização, algumas funcionalidades não estão disponíveis que limitam as instruções permitidas no arquivo. Estas incluem instruções relacionadas ao gerenciamento de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores globais de transação.

7. O servidor sai.

#### Atribuição de senha de raiz pós- inicialização

Depois de inicializar o diretório de dados iniciando o servidor com `--initialize` ou `--initialize-insecure`, inicie o servidor normalmente (ou seja, sem nenhuma dessas opções) e atribua à conta `'root'@'localhost'` uma nova senha:

1. Iniciar o servidor: ver instruções na secção 2.9.2, "Iniciar o servidor".
2. Ligação ao servidor:

   - Se você usou `--initialize` mas não `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root`:

     ```
     mysql -u root -p
     ```

     Em seguida, no prompt de senha, digite a senha aleatória que o servidor gerou durante a sequência de inicialização:

     ```
     Enter password: (enter the random root password here)
     ```

     Procure no registro de erros do servidor se você não souber essa senha.
   - Se você usou `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root` sem uma senha:

     ```
     mysql -u root --skip-password
     ```
3. Após a conexão, use uma instrução `ALTER USER` para atribuir uma nova senha `root`:

   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
   ```

Ver também a secção 2.9.4, "Segurança da conta MySQL inicial".

::: info Note

As tentativas de conexão com o host `127.0.0.1` normalmente resolvem para a conta `localhost` . No entanto, isso falha se o servidor estiver executado com o `skip_name_resolve` habilitado. Se você planeja fazer isso, verifique se existe uma conta que pode aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

```
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
```

É possível colocar essas instruções em um arquivo a ser executado usando a variável de sistema `init_file`, conforme discutido em Ações do Servidor Durante a Inicialização do Diretório de Dados.

:::
