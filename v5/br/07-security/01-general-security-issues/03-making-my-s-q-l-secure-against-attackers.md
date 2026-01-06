### 6.1.3 Tornar o MySQL seguro contra atacantes

Ao se conectar a um servidor MySQL, você deve usar uma senha. A senha não é transmitida em texto claro durante a conexão. O gerenciamento de senhas durante a sequência de conexão do cliente foi atualizado no MySQL 4.1.1 para ser muito seguro. Se você ainda estiver usando senhas do estilo anterior ao MySQL 4.1.1, o algoritmo de criptografia não é tão forte quanto o algoritmo mais recente. Com algum esforço, um atacante inteligente que possa escutar o tráfego entre o cliente e o servidor pode quebrar a senha. (Consulte Seção 6.1.2.4, “Hashing de Senhas no MySQL” para uma discussão sobre os diferentes métodos de gerenciamento de senhas.)

Todas as outras informações são transferidas como texto e podem ser lidas por qualquer pessoa que consiga acompanhar a conexão. Se a conexão entre o cliente e o servidor passar por uma rede não confiável e você estiver preocupado com isso, pode usar o protocolo comprimido para tornar o tráfego muito mais difícil de decifrar. Você também pode usar o suporte interno de SSL do MySQL para tornar a conexão ainda mais segura. Veja Seção 6.3, “Usando Conexões Encriptadas”. Alternativamente, use o SSH para obter uma conexão TCP/IP encriptada entre um servidor MySQL e um cliente MySQL. Você pode encontrar um cliente SSH de código aberto em <http://www.openssh.org/> e uma comparação entre clientes SSH de código aberto e comerciais em <http://en.wikipedia.org/wiki/Comparison_of_SSH_clients>.

Para tornar um sistema MySQL seguro, você deve considerar fortemente as seguintes sugestões:

- Exigir que todas as contas do MySQL tenham uma senha. Um programa cliente não necessariamente conhece a identidade da pessoa que o está executando. É comum em aplicações cliente/servidor que o usuário possa especificar qualquer nome de usuário para o programa cliente. Por exemplo, qualquer pessoa pode usar o programa **mysql** para se conectar como qualquer outra pessoa, simplesmente invocando-o como `mysql -u other_user db_name` se *`other_user`* não tiver senha. Se todas as contas tiverem uma senha, conectar-se usando a conta de outro usuário se torna muito mais difícil.

  Para uma discussão sobre os métodos de definição de senhas, consulte Seção 6.2.10, “Atribuição de Senhas de Conta”.

- Certifique-se de que a única conta de usuário Unix com privilégios de leitura ou escrita nos diretórios do banco de dados é a conta usada para executar **mysqld**.

- Nunca execute o servidor MySQL como o usuário `root` do Unix. Isso é extremamente perigoso, porque qualquer usuário com o privilégio `FILE` pode fazer com que o servidor crie arquivos como `root` (por exemplo, `~root/.bashrc`). Para evitar isso, o **mysqld** se recusa a ser executado como `root`, a menos que isso seja especificado explicitamente usando a opção `--user=root`.

  **mysqld** pode (e deve) ser executado como um usuário comum e não privilegiado. Você pode criar uma conta Unix separada chamada `mysql` para tornar tudo ainda mais seguro. Use essa conta apenas para administrar o MySQL. Para iniciar **mysqld** como um usuário Unix diferente, adicione uma opção `user` que especifique o nome do usuário no grupo `[mysqld]` do arquivo de opção `my.cnf` onde você especifica as opções do servidor. Por exemplo:

  ```sql
  [mysqld]
  user=mysql
  ```

  Isso faz com que o servidor seja iniciado como o usuário designado, seja iniciado manualmente ou usando **mysqld\_safe** ou **mysql.server**. Para mais detalhes, consulte Seção 6.1.5, “Como executar o MySQL como um usuário normal”.

  Executar **mysqld** como um usuário Unix diferente de `root` não significa que você precise alterar o nome do usuário `root` na tabela `user`. *Os nomes de usuário para contas MySQL não têm nada a ver com os nomes de usuário para contas Unix*.

- Não conceda o privilégio `FILE` a usuários não administrativos. Qualquer usuário que tenha esse privilégio pode escrever um arquivo em qualquer lugar do sistema de arquivos com os privilégios do daemon **mysqld**. Isso inclui o diretório de dados do servidor, que contém os arquivos que implementam as tabelas de privilégios. Para tornar as operações de privilégios `FILE` um pouco mais seguras, os arquivos gerados com `SELECT ... INTO OUTFILE` não sobrescrevem arquivos existentes e podem ser escritos por todos.

  O privilégio `FILE` também pode ser usado para ler qualquer arquivo que seja legível para o mundo ou acessível ao usuário Unix pelo qual o servidor está sendo executado. Com este privilégio, você pode ler qualquer arquivo em uma tabela de banco de dados. Isso pode ser abusado, por exemplo, usando `LOAD DATA` para carregar o `/etc/passwd` em uma tabela, que pode então ser exibida com `SELECT`.

  Para limitar a localização em que os arquivos podem ser lidos e escritos, defina o sistema `secure_file_priv` para um diretório específico. Veja Seção 5.1.7, “Variáveis do Sistema do Servidor”.

- Não conceda os privilégios `PROCESS` ou `SUPER` a usuários não administrativos. A saída do comando **mysqladmin processlist** e do comando `SHOW PROCESSLIST` exibe o texto de quaisquer instruções atualmente em execução, portanto, qualquer usuário autorizado a ver a lista de processos do servidor pode ser capaz de ver instruções emitidas por outros usuários, como `UPDATE user SET password=PASSWORD('not_secure')`.

  O **mysqld** reserva uma conexão extra para usuários que possuem o privilégio `SUPER`, para que um usuário `root` do MySQL possa fazer login e verificar a atividade do servidor, mesmo que todas as conexões normais estejam em uso.

  O privilégio `SUPER` pode ser usado para encerrar conexões de clientes, alterar a operação do servidor alterando o valor das variáveis do sistema e controlar os servidores de replicação.

- Não permita o uso de symlinks para tabelas. (Essa capacidade pode ser desativada com a opção `--skip-symbolic-links`. Isso é especialmente importante se você executar o **mysqld** como `root`, porque qualquer pessoa que tenha acesso de escrita ao diretório de dados do servidor pode então excluir qualquer arquivo do sistema! Veja Seção 8.12.3.2, “Usando Links Simbólicos para Tabelas MyISAM no Unix”.

- Os programas e visualizações armazenados devem ser escritos seguindo as diretrizes de segurança discutidas em Seção 23.6, “Controle de Acesso a Objetos Armazenados”.

- Se você não confiar no seu DNS, deve usar endereços IP em vez de nomes de host nas tabelas de concessão. Em qualquer caso, você deve ter muito cuidado ao criar entradas na tabela de concessão usando valores de nomes de host que contenham asteriscos.

- Se você deseja restringir o número de conexões permitidas para uma única conta, pode fazê-lo definindo a variável `max_user_connections` em **mysqld**. As instruções `CREATE USER` e `ALTER USER` também suportam opções de controle de recursos para limitar a extensão do uso do servidor permitido a uma conta. Veja Seção 13.7.1.2, “Instrução CREATE USER” e Seção 13.7.1.1, “Instrução ALTER USER”.

- Se o diretório do plugin for legível pelo servidor, pode ser possível para um usuário escrever código executável em um arquivo no diretório usando `SELECT ... INTO DUMPFILE`. Isso pode ser evitado tornando `plugin_dir` somente leitura para o servidor ou configurando `secure_file_priv` para um diretório onde as escritas de `SELECT` possam ser feitas com segurança.
