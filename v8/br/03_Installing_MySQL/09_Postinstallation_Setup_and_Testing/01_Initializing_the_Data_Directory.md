### 2.9.1 Inicializando o Diretório de Dados

Depois que o MySQL for instalado, o diretório de dados deve ser inicializado, incluindo as tabelas no esquema de sistema `mysql`:

- Para alguns métodos de instalação do MySQL, a inicialização do diretório de dados é automática, conforme descrito na Seção 2.9, “Configuração e Teste Pós-Instalação”.

- Para outros métodos de instalação, você deve inicializar o diretório de dados manualmente. Isso inclui a instalação a partir de distribuições binárias e de código-fonte genéricas em sistemas Unix e Unix-like, e a instalação a partir de um pacote de arquivo ZIP no Windows.

Esta seção descreve como inicializar o diretório de dados manualmente para os métodos de instalação do MySQL para os quais a inicialização do diretório de dados não é automática. Para obter alguns comandos sugeridos que permitem testar se o servidor é acessível e está funcionando corretamente, consulte a Seção 2.9.3, “Testando o Servidor”.

Nota

No MySQL 8.0, o plugin de autenticação padrão mudou de `mysql_native_password` para `caching_sha2_password`, e a conta administrativa `'root'@'localhost'` usa `caching_sha2_password` por padrão. Se você prefere que a conta `root` use o plugin de autenticação padrão anterior (`mysql_native_password`), consulte caching\_sha2\_password e a Conta Administrativa Principal.

O plugin `mysql_native_password` está desatualizado a partir do MySQL 8.0.34, desabilitado por padrão a partir do MySQL 8.4.0 e removido a partir do MySQL 9.0.0.

- Visão geral da inicialização do diretório de dados
- Procedimento de Inicialização do Diretório de Dados
- Ações do servidor durante a inicialização do diretório de dados
- Atribuição da senha de root após a inicialização

#### Visão geral da inicialização do diretório de dados

Nos exemplos mostrados aqui, o servidor deve ser executado sob o ID de usuário da conta de login `mysql`. Crie a conta se ela não existir (veja Criar um usuário e um grupo no MySQL), ou substitua o nome de uma conta de login existente que você planeja usar para executar o servidor.

1. Altere a localização para o diretório de nível superior da instalação do MySQL, que normalmente é `/usr/local/mysql` (ajuste o nome do caminho conforme necessário para o seu sistema):

   ```
   cd /usr/local/mysql
   ```

   Neste diretório, você pode encontrar vários arquivos e subdiretórios, incluindo o subdiretório `bin` que contém o servidor, bem como programas de cliente e utilitários.

2. A variável de sistema `secure_file_priv` limita as operações de importação e exportação para um diretório específico. Crie um diretório cuja localização pode ser especificada como o valor dessa variável:

   ```
   mkdir mysql-files
   ```

   Atribua a propriedade do diretório ao usuário `mysql` e ao grupo `mysql` e defina as permissões do diretório adequadamente:

   ```
   chown mysql:mysql mysql-files
   chmod 750 mysql-files
   ```

3. Use o servidor para inicializar o diretório de dados, incluindo o esquema `mysql` que contém as tabelas de concessão inicial do MySQL que determinam como os usuários são autorizados a se conectar ao servidor. Por exemplo:

   ```
   bin/mysqld --initialize --user=mysql
   ```

   Para informações importantes sobre o comando, especialmente sobre as opções de comando que você pode usar, consulte o procedimento de inicialização do diretório de dados. Para obter detalhes sobre como o servidor realiza a inicialização, consulte Ações do servidor durante a inicialização do diretório de dados.

   Normalmente, a inicialização do diretório de dados só precisa ser feita após a instalação inicial do MySQL. (Para atualizações de uma instalação existente, realize o procedimento de atualização em vez disso; consulte o Capítulo 3, *Atualizando o MySQL*.) No entanto, o comando que inicializa o diretório de dados não sobrescreve as tabelas de esquema `mysql` existentes, portanto, é seguro executá-lo em qualquer circunstância.

4. Se você deseja implementar o servidor com suporte automático para conexões seguras, use o utilitário **mysql\_ssl\_rsa\_setup** para criar arquivos SSL e RSA padrão:

   ```
   bin/mysql_ssl_rsa_setup
   ```

   Para obter mais informações, consulte a Seção 6.4.3, “mysql\_ssl\_rsa\_setup — Criar arquivos SSL/RSA”.

   Nota

   O utilitário **mysql\_ssl\_rsa\_setup** está desatualizado a partir do MySQL 8.0.34.

5. Na ausência de arquivos de opções, o servidor inicia com suas configurações padrão. (Veja a Seção 7.1.2, “Configurações Padrão do Servidor”.) Para especificar explicitamente as opções que o servidor MySQL deve usar ao iniciar, coloque-as em um arquivo de opções, como `/etc/my.cnf` ou `/etc/mysql/my.cnf`. (Veja a Seção 6.2.2.2, “Uso de Arquivos de Opções”.) Por exemplo, você pode usar um arquivo de opções para definir a variável de sistema `secure_file_priv`.

6. Para configurar o MySQL para iniciar sem intervenção manual no momento do boot do sistema, consulte a Seção 2.9.5, “Iniciar e Parar o MySQL automaticamente”.

7. A inicialização do diretório de dados cria tabelas de fuso horário no esquema `mysql`, mas não as preenche. Para fazer isso, use as instruções na Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

#### Procedimento de Inicialização do Diretório de Dados

Altere a localização para o diretório de nível superior da instalação do MySQL, que normalmente é `/usr/local/mysql` (ajuste o nome do caminho conforme necessário para o seu sistema):

```
cd /usr/local/mysql
```

Para inicializar o diretório de dados, invocando o **mysqld** com a opção `--initialize` ou `--initialize-insecure`, dependendo se você deseja que o servidor gere uma senha inicial aleatória para a conta `'root'@'localhost'`, ou criar essa conta sem senha:

- Use `--initialize` para a instalação “segura por padrão” (ou seja, incluindo a geração de uma senha inicial aleatória `root`). Nesse caso, a senha está marcada como expirada e você deve escolher uma nova.

- Com `--initialize-insecure`, não é gerada nenhuma senha `root`. Isso é inseguro; presume-se que você pretende atribuir uma senha à conta de forma oportuna antes de colocar o servidor em uso produtivo.

Para obter instruções sobre como atribuir uma nova senha `'root'@'localhost'`, consulte Atribuição de senha de raiz após inicialização.

Nota

O servidor escreve quaisquer mensagens (incluindo qualquer senha inicial) na saída padrão de erro. Isso pode ser redirecionado para o log de erro, então, procure lá se você não vir as mensagens na tela. Para obter informações sobre o log de erro, incluindo onde ele está localizado, consulte a Seção 7.4.2, “O Log de Erro”.

No Windows, use a opção `--console` para direcionar mensagens para o console.

Em sistemas Unix e similares, é importante que os diretórios e arquivos do banco de dados sejam de propriedade da conta de login `mysql` para que o servidor tenha acesso de leitura e escrita a eles quando você executá-lo mais tarde. Para garantir isso, inicie o **mysqld** a partir da conta do sistema `root` e inclua a opção `--user` conforme mostrado aqui:

```
bin/mysqld --initialize --user=mysql
bin/mysqld --initialize-insecure --user=mysql
```

Alternativamente, execute **mysqld** enquanto estiver logado como `mysql`, nesse caso, você pode omitir a opção `--user` do comando.

No Windows, use um desses comandos:

```
bin\mysqld --initialize --console
bin\mysqld --initialize-insecure --console
```

Nota

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

Alternativamente, coloque as configurações de opção relevantes em um arquivo de opção e passe o nome desse arquivo para o **mysqld**. Para sistemas Unix e similares, suponha que o nome do arquivo de opção seja `/opt/mysql/mysql/etc/my.cnf`. Coloque essas linhas no arquivo:

```
[mysqld]
basedir=/opt/mysql/mysql
datadir=/opt/mysql/mysql/data
```

Em seguida, invoque o **mysqld** da seguinte forma (insira o comando em uma única linha, com a opção `--defaults-file` primeiro):

```
bin/mysqld --defaults-file=/opt/mysql/mysql/etc/my.cnf
  --initialize --user=mysql
```

No Windows, suponha que `C:\my.ini` contenha essas linhas:

```
[mysqld]
basedir=C:\\Program Files\\MySQL\\MySQL Server 8.0
datadir=D:\\MySQLdata
```

Em seguida, invoque o **mysqld** da seguinte forma (novamente, você deve digitar o comando em uma única linha, com a opção `--defaults-file` primeiro):

```
bin\mysqld --defaults-file=C:\my.ini
   --initialize --console
```

Importante

Ao inicializar o diretório de dados, você não deve especificar nenhuma opção além das usadas para definir as localizações do diretório, como `--basedir` ou `--datadir`, e a opção `--user`, se necessário. As opções que o servidor MySQL deve usar durante o uso normal podem ser definidas ao reiniciá-lo após a inicialização. Consulte a descrição da opção `--initialize` para obter mais informações.

#### Ações do servidor durante a inicialização do diretório de dados

Nota

A sequência de inicialização do diretório de dados realizada pelo servidor não substitui as ações realizadas por **mysql\_secure\_installation** e **mysql\_ssl\_rsa\_setup**. Veja a Seção 6.4.2, “mysql\_secure\_installation — Melhorar a Segurança da Instalação do MySQL”, e a Seção 6.4.3, “mysql\_ssl\_rsa\_setup — Criar Arquivos SSL/RSA”.

Quando invocado com as opções `--initialize` ou `--initialize-insecure`, o **mysqld** executa as seguintes ações durante a sequência de inicialização do diretório de dados:

1. O servidor verifica a existência do diretório de dados da seguinte forma:

   - Se o diretório de dados não existir, o servidor cria-o.
   - Se o diretório de dados existir, mas não estiver vazio (ou seja, se contiver arquivos ou subdiretórios), o servidor será encerrado após exibir uma mensagem de erro:

     ```
     [ERROR] --initialize specified but the data directory exists. Aborting.
     ```

     Nesse caso, remova ou renomeie o diretório de dados e tente novamente.

     Um diretório de dados existente pode ser não vazio se cada entrada tiver um nome que comece com um ponto (`.`).

2. Dentro do diretório de dados, o servidor cria o esquema de sistema `mysql` e suas tabelas, incluindo as tabelas do dicionário de dados, as tabelas de concessão, as tabelas de fuso horário e as tabelas de ajuda do lado do servidor. Veja a Seção 7.3, “O Esquema de Sistema mysql”.

3. O servidor inicializa o espaço de tabela do sistema e as estruturas de dados relacionadas necessárias para gerenciar as tabelas `InnoDB`.

   Nota

   Após o **mysqld** configurar o espaço de tabelas `InnoDB` do sistema, certas alterações nas características do espaço de tabelas exigem a configuração de uma nova instância. As alterações qualificadas incluem o nome do arquivo do primeiro arquivo no espaço de tabelas do sistema e o número de logs de desfazer. Se você não quiser usar os valores padrão, certifique-se de que as configurações dos parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estejam no arquivo de configuração do MySQL *antes* de executar o **mysqld**. Além disso, certifique-se de especificar, se necessário, outros parâmetros que afetam a criação e a localização dos arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

   Se essas opções estiverem no seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL lê por padrão, especifique a localização do arquivo usando a opção `--defaults-extra-file` quando você executar o **mysqld**.

4. O servidor cria uma conta de superusuário `'root'@'localhost'` e outras contas reservadas (consulte a Seção 8.2.9, “Contas Reservadas”). Algumas contas reservadas estão bloqueadas e não podem ser usadas pelos clientes, mas `'root'@'localhost'` é destinado ao uso administrativo e você deve atribuir uma senha a ele.

   As ações do servidor em relação a uma senha para a conta `'root'@'localhost'` dependem de como você a invoca:

   - Com `--initialize`, mas não `--initialize-insecure`, o servidor gera uma senha aleatória, marca-a como expirada e escreve uma mensagem exibindo a senha:

     ```
     [Warning] A temporary password is generated for root@localhost:
     iTag*AfrH5ej
     ```

   - Com `--initialize-insecure`, (com ou sem `--initialize` porque `--initialize-insecure` implica em `--initialize`), o servidor não gera uma senha ou marca-a como expirada, e escreve uma mensagem de aviso:

     ```
     [Warning] root@localhost is created with an empty password ! Please
     consider switching off the --initialize-insecure option.
     ```

   Para obter instruções sobre como atribuir uma nova senha `'root'@'localhost'`, consulte Atribuição de senha de raiz após inicialização.

5. O servidor preenche as tabelas de ajuda do lado do servidor usadas para a declaração `HELP` (consulte a Seção 15.8.3, “Declaração HELP”). O servidor não preenche as tabelas de fuso horário. Para fazer isso manualmente, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

6. Se a variável de sistema `init_file` foi fornecida para nomear um arquivo de instruções SQL, o servidor executa as instruções no arquivo. Esta opção permite que você realize sequências de inicialização personalizadas.

   Quando o servidor opera no modo bootstrap, algumas funcionalidades não estão disponíveis, o que limita as instruções permitidas no arquivo. Essas incluem instruções relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transações globais.

7. O servidor sai.

#### Atribuição da senha de root após a inicialização

Depois de inicializar o diretório de dados iniciando o servidor com `--initialize` ou `--initialize-insecure`, inicie o servidor normalmente (ou seja, sem nenhuma dessas opções) e atribua uma nova senha à conta `'root'@'localhost'`:

1. Inicie o servidor. Para obter instruções, consulte a Seção 2.9.2, “Iniciar o Servidor”.

2. Conecte-se ao servidor:

   - Se você usou `--initialize` para inicializar o diretório de dados, mas não `--initialize-insecure`, conecte-se ao servidor como `root`:

     ```
     mysql -u root -p
     ```

     Em seguida, na tela de senha, insira a senha aleatória que o servidor gerou durante a sequência de inicialização:

     ```
     Enter password: (enter the random root password here)
     ```

     Procure no log de erro do servidor se você não souber essa senha.

   - Se você usou `--initialize-insecure` para inicializar o diretório de dados, conecte-se ao servidor como `root` sem senha:

     ```
     mysql -u root --skip-password
     ```

3. Após a conexão, use uma declaração `ALTER USER` para atribuir uma nova senha `root`:

   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root-password';
   ```

Veja também a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

Nota

As tentativas de conexão com o host `127.0.0.1` normalmente resultam na conta `localhost`. No entanto, isso falha se o servidor for executado com o `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que exista uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

```
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
```

É possível colocar essas declarações em um arquivo para ser executado usando a variável de sistema `init_file`, conforme discutido em Ações do servidor durante a inicialização do diretório de dados.
