### 2.9.1 Inicializando o Diretório de Dados

Após a instalação do MySQL, o diretório de dados deve ser inicializado, incluindo as tabelas no esquema de sistema `mysql`:

* Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados é automática, conforme descrito na Seção 2.9, “Configuração e Teste Pós-Instalação”.
* Para outros métodos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote de arquivo ZIP no Windows.

Esta seção descreve como inicializar manualmente o diretório de dados para métodos de instalação do MySQL para os quais a inicialização do diretório de dados não é automática. Para alguns comandos sugeridos que permitem testar se o servidor é acessível e funcionando corretamente, consulte a Seção 2.9.3, “Testando o Servidor”.

Nota

O plugin de autenticação padrão é `caching_sha2_password`, e a conta administrativa `'root'@'localhost'` usa `caching_sha2_password` por padrão.

* Visão Geral da Inicialização do Diretório de Dados
* Procedimento de Inicialização do Diretório de Dados
* Ações do Servidor Durante a Inicialização do Diretório de Dados
* Atribuição de Senha de Root Pós-Inicialização

#### Visão Geral da Inicialização do Diretório de Dados

Nos exemplos mostrados aqui, o servidor é destinado a ser executado com o ID de usuário da conta de login `mysql`. Crie a conta, se ela não existir (consulte Criar um Usuário e Grupo mysql), ou substitua o nome de uma conta de login existente diferente que você planeja usar para executar o servidor.

1. Mude para o diretório de nível superior da instalação do MySQL, que é tipicamente `/usr/local/mysql` (ajuste o nome do caminho para o seu sistema conforme necessário):

   ```
   cd /usr/local/mysql
   ```

Dentro deste diretório, você pode encontrar vários arquivos e subdiretórios, incluindo o subdiretório `bin` que contém o servidor, bem como programas de cliente e utilitários.

2. A variável de sistema `secure_file_priv` limita as operações de importação e exportação para um diretório específico. Crie um diretório cuja localização pode ser especificada como o valor dessa variável:

   ```
   mkdir mysql-files
   ```

   Atribua a propriedade do usuário e do grupo do diretório ao usuário `mysql` e ao grupo `mysql`, e defina as permissões do diretório adequadamente:

   ```
   chown mysql:mysql mysql-files
   chmod 750 mysql-files
   ```

3. Use o servidor para inicializar o diretório de dados, incluindo o esquema `mysql` que contém as tabelas iniciais de concessão do MySQL que determinam como os usuários são autorizados a se conectar ao servidor. Por exemplo:

   ```
   bin/mysqld --initialize --user=mysql
   ```

   Para informações importantes sobre o comando, especialmente sobre as opções de comando que você pode usar, consulte o Procedimento de Inicialização do Diretório de Dados. Para detalhes sobre como o servidor realiza a inicialização, consulte Ações do Servidor Durante a Inicialização do Diretório de Dados.

   Tipicamente, a inicialização do diretório de dados precisa ser feita apenas após a instalação inicial do MySQL. (Para atualizações para uma instalação existente, realize o procedimento de atualização em vez disso; consulte o Capítulo 3, *Atualizando o MySQL*.) No entanto, o comando que inicializa o diretório de dados não sobrescreve nenhuma tabela de esquema `mysql` existente, portanto, é seguro executá-lo em quaisquer circunstâncias.

4. Na ausência de arquivos de opções, o servidor inicia com suas configurações padrão. (Veja a Seção 7.1.2, “Configurações Padrão do Servidor”.) Para especificar explicitamente as opções que o servidor MySQL deve usar no início, coloque-as em um arquivo de opções, como `/etc/my.cnf` ou `/etc/mysql/my.cnf`. (Veja a Seção 6.2.2.2, “Usando Arquivos de Opções”.) Por exemplo, você pode usar um arquivo de opções para definir a variável de sistema `secure_file_priv`.

5. Para configurar o MySQL para iniciar sem intervenção manual no momento do boot do sistema, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

6. A inicialização do diretório de dados cria tabelas de fuso horário no esquema `mysql`, mas não as preenche. Para isso, use as instruções na Seção 7.1.15, “Suporte de fuso horário do MySQL Server”.

#### Procedimento de Inicialização do Diretório de Dados

Altere a localização para o diretório de nível superior da instalação do MySQL, que normalmente é `/usr/local/mysql` (ajuste o nome do caminho para o seu sistema conforme necessário):

```
cd /usr/local/mysql
```

Para inicializar o diretório de dados, inicie o **mysqld** com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o servidor gere uma senha inicial aleatória para a conta `'root'@'localhost'`, ou crie essa conta sem senha:

* Use `--initialize` para a instalação “segura por padrão” (ou seja, incluindo a geração de uma senha inicial aleatória para a conta `root`). Nesse caso, a senha é marcada como expirada e você deve escolher uma nova.

* Com `--initialize-insecure`, não é gerada senha para `root`. Isso é inseguro; presume-se que você pretende atribuir uma senha à conta de forma oportuna antes de colocar o servidor em uso produtivo.

Para instruções sobre a atribuição de uma nova senha para a conta `'root'@'localhost`, consulte Atribuição de senha de root após a inicialização.

Observação

O servidor escreve quaisquer mensagens (incluindo qualquer senha inicial) na saída padrão de erro. Isso pode ser redirecionado para o log de erro, então procure lá se você não vir as mensagens na tela. Para informações sobre o log de erro, incluindo onde ele está localizado, consulte a Seção 7.4.2, “O Log de Erro”.

No Windows, use a opção `--console` para direcionar as mensagens para a console.

Em sistemas Unix e similares, é importante que os diretórios e arquivos do banco de dados sejam de propriedade da conta de login `mysql` para que o servidor tenha acesso de leitura e escrita a eles quando você executá-lo mais tarde. Para garantir isso, inicie o **mysqld** usando a conta `root` do sistema e inclua a opção `--user`, conforme mostrado aqui:

```
bin/mysqld --initialize --user=mysql
bin/mysqld --initialize-insecure --user=mysql
```

Alternativamente, execute o **mysqld** enquanto estiver logado como `mysql`, nesse caso, você pode omitir a opção `--user` do comando.

No Windows, use um dos seguintes comandos:

```
bin\mysqld --initialize --console
bin\mysqld --initialize-insecure --console
```

Observação

A inicialização do diretório de dados pode falhar se as bibliotecas do sistema necessárias estiverem ausentes. Por exemplo, você pode ver um erro como este:

```
bin/mysqld: error while loading shared libraries:
libnuma.so.1: cannot open shared object file:
No such file or directory
```

Se isso acontecer, você deve instalar as bibliotecas ausentes manualmente ou com o gerenciador de pacotes do seu sistema. Em seguida, tente novamente o comando de inicialização do diretório de dados.

Pode ser necessário especificar outras opções, como `--basedir` ou `--datadir`, se o **mysqld** não conseguir identificar os locais corretos para o diretório de instalação ou o diretório de dados. Por exemplo (insira o comando em uma única linha):

```
bin/mysqld --initialize --user=mysql
  --basedir=/opt/mysql/mysql
  --datadir=/opt/mysql/mysql/data
```

Alternativamente, coloque as configurações da opção relevantes em um arquivo de opção e passe o nome desse arquivo para o **mysqld**. Para sistemas Unix e similares, suponha que o nome do arquivo de opção seja `/opt/mysql/mysql/etc/my.cnf`. Coloque essas linhas no arquivo:

```
[mysqld]
basedir=/opt/mysql/mysql
datadir=/opt/mysql/mysql/data
```

Em seguida, inicie o **mysqld** da seguinte forma (insira o comando em uma única linha, com a opção `--defaults-file` primeiro):

```
bin/mysqld --defaults-file=/opt/mysql/mysql/etc/my.cnf
  --initialize --user=mysql
```

No Windows, suponha que `C:\my.ini` contenha essas linhas:

```
[mysqld]
basedir=C:\\Program Files\\MySQL\\MySQL Server 9.5
datadir=D:\\MySQLdata
```

Em seguida, inicie o **mysqld** da seguinte forma (novamente, você deve inserir o comando em uma única linha, com a opção `--defaults-file` primeiro):

```
bin\mysqld --defaults-file=C:\my.ini
   --initialize --console
```

Importante
Português (Brasileiro)

Ao inicializar o diretório de dados, você não deve especificar nenhuma opção além das usadas para definir as localizações do diretório, como `--basedir` ou `--datadir`, e a opção `--user`, se necessário. As opções que o servidor MySQL pode usar durante o uso normal podem ser definidas ao reiniciá-lo após a inicialização. Consulte a descrição da opção `--initialize` para obter mais informações.

#### Ações do Servidor Durante a Inicialização do Diretório de Dados

Nota

A sequência de inicialização do diretório de dados realizada pelo servidor não substitui as ações realizadas pelo **mysql_secure_installation**.

Quando invocado com a opção `--initialize` ou `--initialize-insecure`, o **mysqld** executa as seguintes ações durante a sequência de inicialização do diretório de dados:

1. O servidor verifica a existência do diretório de dados da seguinte forma:

   * Se não existir um diretório de dados, o servidor cria-o.
   * Se o diretório de dados existir, mas não estiver vazio (ou seja, conter arquivos ou subdiretórios), o servidor sai após produzir uma mensagem de erro:

     ```
     [ERROR] --initialize specified but the data directory exists. Aborting.
     ```

     Nesse caso, remova ou renomeie o diretório de dados e tente novamente.

     Um diretório de dados existente é permitido estar não vazio se cada entrada tiver um nome que comece com um ponto (`.`).

2. Dentro do diretório de dados, o servidor cria o esquema `mysql` do sistema e suas tabelas, incluindo as tabelas do dicionário de dados, as tabelas de concessão, as tabelas de fuso horário e as tabelas de ajuda do lado do servidor. Consulte a Seção 7.3, “O esquema do sistema mysql”.

3. O servidor inicializa o espaço de tabelas do sistema e as estruturas de dados relacionadas necessárias para gerenciar as tabelas `InnoDB`.

   Nota

Após o **mysqld** configurar o espaço de tabelas `InnoDB`, certas alterações nas características do espaço de tabelas exigem a criação de uma nova instância. As alterações qualificadas incluem o nome do arquivo do primeiro arquivo no espaço de tabelas do sistema e o número de logs de desfazer. Além disso, certifique-se de especificar, se necessário, outros parâmetros que afetam a criação e a localização dos arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

Se essas opções estiverem no seu arquivo de configuração, mas o arquivo não estiver em um local que o MySQL lê por padrão, especifique a localização do arquivo usando a opção `--defaults-extra-file` ao executar o **mysqld**.

4. O servidor cria uma conta de superusuário `'root'@'localhost'` e outras contas reservadas (consulte a Seção 8.2.9, “Contas Reservadas”). Algumas contas reservadas estão bloqueadas e não podem ser usadas por clientes, mas `'root'@'localhost'` é destinado ao uso administrativo e você deve atribuir uma senha a ele.

As ações do servidor em relação a uma senha para a conta `'root'@'localhost'` dependem de como você a invoca:

* Com `--initialize` (mas não `--initialize-insecure`), o servidor gera uma senha aleatória, marca-a como expirada e escreve uma mensagem exibindo a senha:

```
     [Warning] A temporary password is generated for root@localhost:
     iTag*AfrH5ej
     ```

* Com `--initialize-insecure` (com ou sem `--initialize`, porque `--initialize-insecure` implica `--initialize`), o servidor não gera uma senha ou não a marca como expirada e escreve uma mensagem de aviso:

```
     [Warning] root@localhost is created with an empty password ! Please
     consider switching off the --initialize-insecure option.
     ```

Para obter instruções sobre como atribuir uma nova senha para a conta `'root'@'localhost'`, consulte Atribuição de Senha de Root após Inicialização.

5. O servidor popula as tabelas de ajuda do lado do servidor usadas para a instrução `HELP` (consulte a Seção 15.8.3, “Instrução HELP”). O servidor não popula as tabelas de fuso horário. Para fazer isso manualmente, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do Servidor MySQL”.

6. Se a variável de sistema `init_file` foi fornecida para nomear um arquivo de instruções SQL, o servidor executa as instruções no arquivo. Esta opção permite que você realize sequências de inicialização personalizadas.

   Quando o servidor opera no modo de inicialização, algumas funcionalidades estão indisponíveis, o que limita as instruções permitidas no arquivo. Isso inclui instruções relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transações globais.

7. O servidor encerra.

#### Atribuição de Senha de Root após a Inicialização

Após inicializar o diretório de dados iniciando o servidor com `--initialize` ou `--initialize-insecure`, inicie o servidor normalmente (ou seja, sem nenhuma dessas opções) e atribua uma nova senha à conta `'root'@'localhost'`:

1. Inicie o servidor. Para instruções, consulte a Seção 2.9.2, “Iniciar o Servidor”.

2. Conecte-se ao servidor:

   * Se você usou `--initialize` mas não `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root`:

     ```
     mysql -u root -p
     ```

     Em seguida, na prompt de senha, insira a senha aleatória que o servidor gerou durante a sequência de inicialização:

     ```
     Enter password: (enter the random root password here)
     ```

     Procure no log de erro do servidor se você não souber essa senha.

   * Se você usou `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root` sem senha:

     ```
     mysql -u root --skip-password
     ```

3. Após se conectar, use uma instrução `ALTER USER` para atribuir uma nova senha `root`:

   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
   ```

Veja também a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

Observação

Tentados de conexão com o host `127.0.0.1` normalmente resolvem para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que existe uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

```
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
```

É possível colocar essas instruções em um arquivo para ser executado usando a variável de sistema `init_file`, conforme discutido em Ações do Servidor Durante a Inicialização do Diretório de Dados.