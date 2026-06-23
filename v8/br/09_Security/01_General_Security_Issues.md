## 8.1 Questões Gerais de Segurança

Esta seção descreve questões gerais de segurança que você deve estar ciente e o que você pode fazer para tornar sua instalação MySQL mais segura contra ataques ou uso indevido. Para informações específicas sobre o sistema de controle de acesso que o MySQL usa para configurar contas de usuário e verificar o acesso ao banco de dados, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

Para respostas a algumas perguntas que são frequentemente feitas sobre questões de segurança do MySQL Server, consulte a Seção A.9, “Perguntas Frequentes do MySQL 8.0: Segurança”.

### 8.1.1 Diretrizes de Segurança

Qualquer pessoa que use o MySQL em um computador conectado à Internet deve ler esta seção para evitar os erros de segurança mais comuns.

Ao discutir segurança, é necessário considerar a proteção completa de todo o servidor hospedeiro (não apenas o servidor MySQL) contra todos os tipos de ataques aplicáveis: escuta, alteração, reprodução e negação de serviço. Não abordamos todos os aspectos de disponibilidade e tolerância a falhas aqui.

O MySQL utiliza segurança com base em Listas de Controle de Acesso (ACLs) para todas as conexões, consultas e outras operações que os usuários podem tentar realizar. Também há suporte para conexões criptografadas com SSL entre clientes e servidores MySQL. Muitos dos conceitos discutidos aqui não são específicos para o MySQL; as mesmas ideias gerais se aplicam a quase todas as aplicações.

Ao executar o MySQL, siga estas diretrizes:

* **Nunca dê acesso a ninguém (exceto contas do MySQL `root`!) à tabela `user` no banco de dados do sistema `mysql`!** Isso é crucial.

* Aprenda como o sistema de privilégios de acesso do MySQL funciona (consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Conta”). Use as declarações `GRANT` e `REVOKE` para controlar o acesso ao MySQL. Não conceda mais privilégios do que o necessário. Nunca conceda privilégios a todos os hosts.

Lista de verificação:

+ Tente `mysql -u root`. Se você conseguir se conectar com sucesso ao servidor sem ser solicitado uma senha, qualquer pessoa pode se conectar ao seu servidor MySQL como o usuário MySQL `root` com privilégios completos! Revise as instruções de instalação do MySQL, prestando atenção especial às informações sobre a definição de uma senha `root`. Veja a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

+ Use a declaração `SHOW GRANTS` para verificar quais contas têm acesso a o que. Em seguida, use a declaração `REVOKE` para remover os privilégios que não são necessários.

* Não armazene senhas em texto claro em seu banco de dados. Se o seu computador for comprometido, o invasor pode obter a lista completa das senhas e usá-las. Em vez disso, use `SHA2()` ou outra função de hashing unidirecional e armazene o valor do hash.

Para evitar a recuperação de senha usando tabelas arco-íris, não use essas funções com uma senha simples; em vez disso, escolha uma string que será usada como sal, e use os valores hash(hash(senha)+sal).

* Suponha que todas as senhas sejam sujeitas a tentativas automatizadas de quebra usando listas de senhas conhecidas, e também a adivinhação direcionada usando informações publicamente disponíveis sobre você, como postagens em redes sociais. Não escolha senhas que consistem em itens facilmente quebrados ou adivinhados, como uma palavra de dicionário, nome próprio, nome de equipe esportiva, acrônimo ou frase comumente conhecida, especialmente se forem relevantes para você. O uso de letras maiúsculas, substituições e adições de números e caracteres especiais não ajuda se forem usados de maneiras previsíveis. Além disso, não escolha nenhuma senha que tenha visto usada como exemplo em qualquer lugar, ou uma variação dela, mesmo que tenha sido apresentada como um exemplo de senha forte.

Em vez disso, escolha senhas que sejam tão longas e imprevisíveis quanto possível. Isso não significa que a combinação precisa ser uma string aleatória de caracteres que seja difícil de lembrar e reproduzir, embora essa seja uma boa abordagem se você, por exemplo, tiver um software de gerenciamento de senhas que possa gerar e preencher tais senhas e armazená-las com segurança. Uma frase de senhas que contenha várias palavras é fácil de criar, lembrar e reproduzir, e é muito mais segura do que uma senha típica selecionada pelo usuário, composta por uma única palavra modificada ou uma sequência previsível de caracteres. Para criar uma frase de senhas segura, garanta que as palavras e outros itens nela não sejam uma frase ou citação conhecida, não ocorram em uma ordem previsível e, de preferência, não tenham nenhuma relação prévia entre si.

* Invista em um firewall. Isso o protege contra pelo menos 50% de todos os tipos de exploração em qualquer software. Coloque o MySQL atrás do firewall ou em uma zona demilitarizada (DMZ).

Lista de verificação:

+ Tente escanear seus ports da Internet usando uma ferramenta como `nmap`. O MySQL usa a porta 3306 por padrão. Essa porta não deve ser acessível a hosts não confiáveis. Como uma maneira simples de verificar se sua porta MySQL está aberta, tente o seguinte comando em uma máquina remota, onde *`server_host`* é o nome do host ou endereço IP do host em que seu servidor MySQL está em execução:

    ```
    $> telnet server_host 3306
    ```

Se o **telnet** ficar parado ou a conexão for recusada, o porto está bloqueado, e é assim que você quer que seja. Se você conseguir uma conexão e alguns caracteres de lixo, o porto está aberto e deve ser fechado no seu firewall ou roteador, a menos que você realmente tenha uma boa razão para mantê-lo aberto.

* As aplicações que acessam o MySQL não devem confiar em quaisquer dados inseridos pelos usuários e devem ser escritas usando técnicas de programação defensiva adequadas. Veja a Seção 8.1.7, “Diretrizes de Segurança para Programação do Cliente”.

* Não transmita dados simples (não criptografados) pela Internet. Esta informação é acessível a todos que têm tempo e capacidade para interceptá-la e usá-la para seus próprios propósitos. Em vez disso, use um protocolo criptografado, como SSL ou SSH. O MySQL suporta conexões SSL internas. Outra técnica é usar encaminhamento de porta SSH para criar um túnel criptografado (e compactado) para a comunicação.

* Aprenda a usar os utilitários **tcpdump** e **strings**. Na maioria dos casos, você pode verificar se os fluxos de dados do MySQL estão não criptografados, emitindo um comando como o seguinte:

  ```
  $> tcpdump -l -i eth0 -w - src or dst port 3306 | strings
  ```

Isso funciona no Linux e deve funcionar com pequenas modificações em outros sistemas.

Aviso

Se você não ver dados em texto claro, isso nem sempre significa que a informação realmente está criptografada. Se você precisa de alta segurança, consulte um especialista em segurança.

### 8.1.2 Manter senhas seguras

As senhas ocorrem em vários contextos dentro do MySQL. As seções a seguir fornecem diretrizes que permitem que os usuários finais e administradores mantenham essas senhas seguras e evitem expô-las. Além disso, o plugin `validate_password` pode ser usado para impor uma política sobre senha aceitável. Veja a Seção 8.4.3, “O Componente de Validação de Senha”.

#### 8.1.2.1 Diretrizes para o Usuário Final sobre Segurança de Senhas

Os usuários do MySQL devem seguir as diretrizes a seguir para manter as senhas seguras.

Quando você executa um programa cliente para se conectar ao servidor MySQL, não é aconselhável especificar sua senha de uma maneira que a exponga à descoberta por outros usuários. Os métodos que você pode usar para especificar sua senha ao executar programas cliente estão listados aqui, juntamente com uma avaliação dos riscos de cada método. Em resumo, os métodos mais seguros são fazer com que o programa cliente solicite a senha ou especificar a senha em um arquivo de opção adequadamente protegido.

* Use o utilitário **mysql_config_editor**, que permite armazenar as credenciais de autenticação em um arquivo de caminho de login criptografado chamado `.mylogin.cnf`. O arquivo pode ser lido posteriormente por programas clientes do MySQL para obter as credenciais de autenticação para conectar ao MySQL Server. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração MySQL”.

* Use a opção `--password=password` ou `-ppassword` na linha de comando. Por exemplo:

  ```
  $> mysql -u francis -pfrank db_name
  ```

Aviso

Isso é conveniente, mas inseguro. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de linha de comando durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se o ambiente operacional está configurado para exibir seu comando atual na barra de título da janela do terminal, a senha permanece visível enquanto o comando estiver em execução, mesmo que o comando tenha saído da área de conteúdo da janela.

* Use a opção `--password` ou `-p` na linha de comando sem valor de senha especificado. Neste caso, o programa cliente solicita a senha de forma interativa:

  ```
  $> mysql -u francis -p db_name
  Enter password: ********
  ```

Os caracteres `*` indicam onde você deve inserir sua senha. A senha não é exibida enquanto você a digita.

É mais seguro digitar sua senha dessa maneira do que especificá-la na linha de comando, porque ela não é visível para outros usuários. No entanto, esse método de digitação de senha é adequado apenas para programas que você executa interativamente. Se você quiser invocar um cliente a partir de um script que não seja interativo, não há oportunidade de digitar a senha pelo teclado. Em alguns sistemas, você pode até encontrar que a primeira linha do seu script é lida e interpretada (incorretamente) como sua senha.

* Armazene sua senha em um arquivo de opção. Por exemplo, no Unix, você pode listar sua senha na seção `[client]` do arquivo `.my.cnf` em seu diretório doméstico:

  ```
  [client]
  password=password
  ```

Para manter a senha segura, o arquivo não deve ser acessível a ninguém, exceto a você. Para garantir isso, defina o modo de acesso ao arquivo como `400` ou `600`. Por exemplo:

  ```
  $> chmod 600 .my.cnf
  ```

Para nomear, a partir da linha de comando, um arquivo de opção específico que contenha a senha, use a opção `--defaults-file=file_name`, onde `file_name` é o nome completo do caminho do arquivo. Por exemplo:

  ```
  $> mysql --defaults-file=/home/francis/mysql-opts
  ```

A Seção 6.2.2.2, “Usando arquivos de opção”, discute os arquivos de opção com mais detalhes.

No Unix, o cliente **mysql** escreve um registro de declarações executadas em um arquivo de histórico (consulte a Seção 6.5.1.3, “Registro de histórico do cliente mysql”). Por padrão, este arquivo é denominado `.mysql_history` e é criado no seu diretório doméstico. Senhas podem ser escritas como texto simples em declarações SQL, como `CREATE USER` e `ALTER USER`, portanto, se você usar essas declarações, elas são registradas no arquivo de histórico. Para manter este arquivo seguro, use um modo de acesso restritivo, da mesma maneira que foi descrito anteriormente para o arquivo `.my.cnf`.

Se o interpretador de comandos mantém um histórico, qualquer arquivo no qual os comandos são salvos contém senhas do MySQL inseridas na linha de comando. Por exemplo, o **bash** usa `~/.bash_history`. Qualquer arquivo desse tipo deve ter um modo de acesso restritivo.

#### 8.1.2.2 Diretrizes do administrador para segurança de senha

Os administradores de banco de dados devem seguir as diretrizes a seguir para manter as senhas seguras.

O MySQL armazena senhas para contas de usuários na tabela do sistema `mysql.user`. O acesso a essa tabela nunca deve ser concedido a nenhuma conta não administrativa.

As senhas das contas podem expirar, portanto os usuários devem redefiní-las. Consulte a Seção 8.2.15, “Gestão de Senhas”, e a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”.

O plugin `validate_password` pode ser usado para impor uma política sobre senha aceitável. Veja a Seção 8.4.3, “O componente de validação de senha”.

Um usuário que tenha acesso para modificar o diretório do plugin (o valor da variável de sistema `plugin_dir`) ou o arquivo `my.cnf` que especifica a localização do diretório do plugin pode substituir plugins e modificar as capacidades fornecidas pelos plugins, incluindo plugins de autenticação.

Arquivos, como arquivos de registro, para os quais podem ser escritas senhas, devem ser protegidos. Veja a Seção 8.1.2.3, “Senhas e Registro”.

#### 8.1.2.3 Senhas e Registro

As senhas podem ser escritas como texto simples em declarações SQL, como `CREATE USER`, `GRANT` e `SET PASSWORD`. Se essas declarações forem registradas pelo servidor MySQL como escritas, as senhas nelas se tornam visíveis para qualquer pessoa com acesso aos registros.

O registro de declarações evita a escrita de senhas como texto claro para as seguintes declarações:

```
CREATE USER ... IDENTIFIED BY ...
ALTER USER ... IDENTIFIED BY ...
SET PASSWORD ...
START SLAVE ... PASSWORD = ...
START REPLICA ... PASSWORD = ...
CREATE SERVER ... OPTIONS(... PASSWORD ...)
ALTER SERVER ... OPTIONS(... PASSWORD ...)
```

As senhas nessas declarações são reescritas para não aparecerem literalmente no texto da declaração escrita no log de consulta geral, no log de consultas lentas e no log binário. A reescrita não se aplica a outras declarações. Em particular, as declarações `INSERT` ou `UPDATE` para a tabela do sistema `mysql.user` que se referem a senhas literais são registradas como está, portanto, você deve evitar tais declarações. (A modificação direta das tabelas de concessão é desencorajada, de qualquer forma.)

Para o log de consulta geral, a reescrita da senha pode ser suprimida ao iniciar o servidor com a opção `--log-raw`. Por razões de segurança, essa opção não é recomendada para uso em produção. Para fins de diagnóstico, pode ser útil ver o texto exato das declarações recebidas pelo servidor.

Por padrão, o conteúdo dos arquivos de registro de auditoria produzidos pelo plugin de registro de auditoria não são criptografados e podem conter informações sensíveis, como o texto das instruções SQL. Por razões de segurança, os arquivos de registro de auditoria devem ser escritos em um diretório acessível apenas ao servidor MySQL e aos usuários que têm um motivo legítimo para visualizar o log. Veja a Seção 8.4.5.3, “Considerações de segurança de auditoria da empresa MySQL”.

As declarações recebidas pelo servidor podem ser reescritas se um plugin de reescrita de consulta estiver instalado (consulte Plugins de reescrita de consulta). Neste caso, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

* Sem `--log-raw`, o servidor registra a declaração devolvida pelo plugin de reescrita de consulta. Isso pode diferir da declaração recebida.

* Com `--log-raw`, o servidor registra a declaração original como recebida.

Uma implicação da reescrita de senhas é que as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consulta geral, porque não é possível saber se elas estão livres de senha. Os casos de uso que exigem o registro de todas as declarações, incluindo aquelas com erros, devem usar a opção `--log-raw`, tendo em mente que isso também contorce a reescrita de senha.

A reescrita da senha ocorre apenas quando se espera senhas em texto simples. Para declarações com sintaxe que esperam um valor de hash de senha, não ocorre reescrita. Se uma senha em texto simples for fornecida erroneamente para tal sintaxe, a senha é registrada como fornecida, sem reescrita.

Para proteger os arquivos de registro contra exposição indevida, localize-os em um diretório que restrinja o acesso ao administrador do servidor e ao banco de dados. Se o servidor registrar em tabelas no banco de dados `mysql`, conceda acesso a essas tabelas apenas ao administrador do banco de dados.

As réplicas armazenam a senha do servidor de origem de replicação em seu repositório de metadados de conexão, que, por padrão, é uma tabela no banco de dados `mysql` chamada `slave_master_info`. O uso de um arquivo no diretório de dados para o repositório de metadados de conexão já é desaconselhado, mas ainda é possível (consulte Seção 19.2.4, “Repositórios de Relógio de Relay e Metadados de Replicação”). Certifique-se de que o repositório de metadados de conexão possa ser acessado apenas pelo administrador do banco de dados. Uma alternativa para armazenar a senha no repositório de metadados de conexão é usar a declaração `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") (ou antes do MySQL 8.0.22, `START SLAVE`(start-slave.html "15.4.2.7 START SLAVE Statement")) ou `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") para especificar as credenciais para conectar-se à fonte.

Use um modo de acesso restrito para proteger backups de banco de dados que incluem tabelas de registro ou arquivos de registro contendo senhas.

### 8.1.3 Tornando o MySQL Seguro Contra Ataque de Agentes Hostis

Quando você se conecta a um servidor MySQL, você deve usar uma senha. A senha não é transmitida como texto claro sobre a conexão.

Todas as outras informações são transferidas como texto e podem ser lidas por qualquer pessoa que consiga acompanhar a conexão. Se a conexão entre o cliente e o servidor passar por uma rede não confiável e você estiver preocupado com isso, pode usar o protocolo comprimido para tornar o tráfego muito mais difícil de decifrar. Também pode usar o suporte interno de SSL do MySQL para tornar a conexão ainda mais segura. Veja a Seção 8.3, “Usando Conexões Encriptadas”. Alternativamente, use o SSH para obter uma conexão TCP/IP encriptada entre um servidor MySQL e um cliente MySQL. Pode encontrar um cliente SSH de código aberto em <http://www.openssh.org/>, e uma comparação entre clientes SSH de código aberto e comerciais em <http://en.wikipedia.org/wiki/Comparison_of_SSH_clients>.

Para tornar um sistema MySQL seguro, você deve considerar fortemente as seguintes sugestões:

* Exigir que todas as contas do MySQL tenham uma senha. Um programa cliente não necessariamente conhece a identidade da pessoa que o executa. É comum em aplicativos cliente/servidor que o usuário possa especificar qualquer nome de usuário para o programa cliente. Por exemplo, qualquer pessoa pode usar o programa **mysql** para se conectar como qualquer outra pessoa, simplesmente invocando-o como `mysql -u other_user db_name` se *`other_user`* não tiver senha. Se todas as contas tiverem uma senha, conectar-se usando a conta de outro usuário se torna muito mais difícil.

Para uma discussão sobre os métodos para definir senhas, consulte a Seção 8.2.14, “Atribuição de senhas de conta”.

* Certifique-se de que a única conta de usuário Unix com privilégios de leitura ou escrita nos diretórios do banco de dados é a conta que é usada para executar o **mysqld**.

* Nunca execute o servidor MySQL como o usuário `root` do Unix. Isso é extremamente perigoso, porque qualquer usuário com o privilégio `FILE` pode fazer com que o servidor crie arquivos como `root` (por exemplo, `~root/.bashrc`). Para evitar isso, o **mysqld** se recusa a executar como `root` a menos que isso seja especificado explicitamente usando a opção `--user=root`.

O **mysqld** pode (e deve) ser executado como um usuário comum e não privilegiado. Você pode criar uma conta separada no Unix chamada `mysql` para tornar tudo ainda mais seguro. Use essa conta apenas para administrar o MySQL. Para iniciar o **mysqld** como um usuário diferente do Unix, adicione uma opção `user` que especifique o nome do usuário no grupo `[mysqld]` do arquivo de opção `my.cnf` onde você especifica as opções do servidor. Por exemplo:

  ```
  [mysqld]
  user=mysql
  ```

Isso faz com que o servidor comece como o usuário designado, seja iniciado manualmente ou usando **mysqld_safe** ou **mysql.server**. Para mais detalhes, consulte a Seção 8.1.5, “Como executar o MySQL como um usuário normal”.

Executar o **mysqld** como um usuário Unix diferente de `root` não significa que você precise alterar o nome do usuário `root` na tabela `user`. *Os nomes de usuário para contas MySQL não têm nada a ver com os nomes de usuário para contas Unix*.

* Não conceda o privilégio `FILE` a usuários não administrativos. Qualquer usuário que tenha esse privilégio pode escrever um arquivo em qualquer lugar do sistema de arquivos com os privilégios do daemon **mysqld**. Isso inclui o diretório de dados do servidor que contém os arquivos que implementam as tabelas de privilégio. Para tornar as operações de privilégio `FILE` um pouco mais seguras, os arquivos gerados com [`SELECT ... INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement") não sobrescrevem arquivos existentes e podem ser escritos por todos.

O privilégio `FILE` também pode ser usado para ler qualquer arquivo que seja legível para o mundo ou acessível ao usuário do Unix que o servidor executa como. Com este privilégio, você pode ler qualquer arquivo em uma tabela de banco de dados. Isso pode ser abusado, por exemplo, usando `LOAD DATA` (load-data.html "15.2.9 LOAD DATA Statement") para carregar `/etc/passwd` em uma tabela, que então pode ser exibida com `SELECT`.

Para limitar a localização em que os arquivos podem ser lidos e escritos, configure o sistema `secure_file_priv` para um diretório específico. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* Criptografar arquivos de registro binários e arquivos de registro de retransmissão. A criptografia ajuda a proteger esses arquivos e os dados potencialmente sensíveis contidos neles de serem mal utilizados por atacantes externos, e também de serem visualizados por usuários do sistema operacional onde eles são armazenados. Você pode habilitar a criptografia em um servidor MySQL configurando a variável de sistema `binlog_encryption` para `ON`. Para mais informações, consulte a Seção 19.3.2, “Criptografando Arquivos de Registro Binários e Arquivos de Registro de Retransmissão”.

* Não conceda o privilégio `PROCESS` ou `SUPER` a usuários não administrativos. A saída de [**mysqladmin processlist**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") e [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") mostra o texto de quaisquer declarações atualmente sendo executadas, portanto, qualquer usuário que tenha permissão para ver a lista de processos do servidor pode ser capaz de ver declarações emitidas por outros usuários.

O **mysqld** reserva uma conexão extra para usuários que possuem o privilégio `CONNECTION_ADMIN` ou `SUPER`, para que um usuário do MySQL `root` possa fazer login e verificar a atividade do servidor, mesmo se todas as conexões normais estiverem em uso.

O privilégio `SUPER` pode ser usado para encerrar conexões de clientes, alterar a operação do servidor, alterando o valor das variáveis do sistema, e controlar servidores de replicação.

* Não permita o uso de symlinks para tabelas. (Essa capacidade pode ser desativada com a opção `--skip-symbolic-links`. Isso é especialmente importante se você executar o **mysqld** como `root`, porque qualquer pessoa que tenha acesso de escrita ao diretório de dados do servidor pode então excluir qualquer arquivo do sistema! Veja a Seção 10.12.2.2, “Usando Links Simbólicos para Tabelas MyISAM em Unix”.

* Os programas e visualizações armazenados devem ser escritos seguindo as diretrizes de segurança discutidas na Seção 27.6, “Controle de Acesso ao Objeto Armazenado”.

* Se você não confia em seu DNS, deve usar endereços IP em vez de nomes de host nas tabelas de concessão. Em qualquer caso, você deve ter muito cuidado ao criar entradas na tabela de concessão usando valores de nomes de host que contenham caracteres de comodinho.

* Se você deseja restringir o número de conexões permitidas para uma única conta, pode fazer isso definindo a variável `max_user_connections` em **mysqld**. As instruções `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement") e `ALTER USER` também suportam opções de controle de recursos para limitar a extensão do uso do servidor permitido a uma conta. Veja a Seção 15.7.1.3, “Instrução CREATE USER”, e a Seção 15.7.1.1, “Instrução ALTER USER”.

* Se o diretório do plugin for legível pelo servidor, é possível que um usuário escreva código executável em um arquivo no diretório usando `SELECT ... INTO DUMPFILE` (select.html "15.2.13 SELECT Statement"). Isso pode ser prevenido ao tornar `plugin_dir` somente leitura para o servidor ou ao definir `secure_file_priv` em um diretório onde as `SELECT` podem ser escritas com segurança.

### 8.1.4 Opções e variáveis relacionadas à segurança do mysqld

A tabela a seguir mostra as opções do **mysqld** e as variáveis do sistema que afetam a segurança. Para descrições de cada uma dessas opções, consulte a Seção 7.1.7, “Opções de comando do servidor”, e a Seção 7.1.8, “Variáveis do sistema do servidor”.

**Tabela 8.1 Resumo das Opções e Variáveis de Segurança**

<table frame="box" rules="all" summary="Security-related command-line options and system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">allow-suspicious-udfs</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">automatic_sp_privileges</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">chroot</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">local_infile</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">safe-user-create</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">secure_file_priv</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">skip-grant-tables</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">skip_name_resolve</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">skip_networking</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">skip_show_database</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr></tbody></table>

### 8.1.5 Como executar o MySQL como um usuário normal

No Windows, você pode executar o servidor como um serviço do Windows usando uma conta de usuário normal.

Em Linux, para as instalações realizadas usando um repositório MySQL ou pacotes RPM, o servidor MySQL **mysqld** deve ser iniciado pelo usuário do sistema operacional local `mysql`. Iniciar por outro usuário do sistema operacional não é suportado pelos scripts de inicialização que são incluídos como parte dos repositórios MySQL.

Em Unix (ou Linux para instalações realizadas usando pacotes `tar.gz`), o servidor MySQL **mysqld** pode ser iniciado e executado por qualquer usuário. No entanto, você deve evitar executar o servidor como o usuário Unix `root` por razões de segurança. Para alterar **mysqld** para executar como um usuário Unix normal não privilegiado *`user_name`*, você deve fazer o seguinte:

1. Parar o servidor se ele estiver em execução (use [**mysqladmin shutdown**][(mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")]).

2. Altere os diretórios e arquivos do banco de dados para que *`user_name`* tenha privilégios para ler e escrever arquivos neles (você pode precisar fazer isso como o usuário Unix `root`):

   ```
   $> chown -R user_name /path/to/mysql/datadir
   ```

Se você não fizer isso, o servidor não poderá acessar bancos de dados ou tabelas quando estiver executando como *`user_name`*.

Se diretórios ou arquivos dentro do diretório de dados do MySQL forem links simbólicos, `chown -R` pode não seguir links simbólicos para você. Se não seguir, você também deve seguir esses links e alterar os diretórios e arquivos que eles apontam.

3. Inicie o servidor como usuário *`user_name`*. Outra alternativa é iniciar o **mysqld** como o usuário Unix `root` e usar a opção `--user=user_name`. O **mysqld** é iniciado e, em seguida, muda para executar como o usuário Unix *`user_name`* antes de aceitar quaisquer conexões.

4. Para iniciar o servidor automaticamente no momento da inicialização do sistema como o usuário especificado, especifique o nome do usuário adicionando uma opção `user` ao grupo `[mysqld]` do arquivo de opção `/etc/my.cnf` ou do arquivo de opção `my.cnf` no diretório de dados do servidor. Por exemplo:

   ```
   [mysqld]
   user=user_name
   ```

Se a própria máquina Unix não estiver protegida, você deve atribuir senhas à conta MySQL `root` nas tabelas de concessão. Caso contrário, qualquer usuário com uma conta de login naquela máquina pode executar o cliente **mysql** com a opção `--user=root` e realizar qualquer operação. (É uma boa ideia atribuir senhas às contas MySQL, em qualquer caso, mas especialmente quando existem outras contas de login no host do servidor.) Veja a Seção 2.9.4, “Segurando a Conta Inicial MySQL”.

### 8.1.6 Considerações de segurança para LOAD DATA LOCAL

A declaração `LOAD DATA` carrega um arquivo de dados em uma tabela. A declaração pode carregar um arquivo localizado no host do servidor, ou, se a palavra-chave `LOCAL` for especificada, no host do cliente.

A versão `LOCAL` de [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") tem dois problemas de segurança potenciais:

* Como `LOAD DATA LOCAL` (load-data.html "15.2.9 LOAD DATA Statement") é uma declaração SQL, a análise ocorre no lado do servidor, e a transferência do arquivo do host do cliente para o host do servidor é iniciada pelo servidor MySQL, que informa ao programa cliente o arquivo nomeado na declaração. Em teoria, um servidor com correção poderia informar ao programa cliente para transferir um arquivo da escolha do servidor, em vez do arquivo nomeado na declaração. Tal servidor poderia acessar qualquer arquivo no host do cliente para o qual o usuário cliente tenha acesso de leitura. (Um servidor com correção, de fato, poderia responder com uma solicitação de transferência de arquivo para qualquer declaração, não apenas `LOAD DATA LOCAL` (load-data.html "15.2.9 LOAD DATA Statement"), portanto, um problema mais fundamental é que os clientes não devem se conectar a servidores não confiáveis.)

* Em um ambiente web onde os clientes estão se conectando a partir de um servidor web, um usuário poderia usar `LOAD DATA LOCAL` para ler quaisquer arquivos que o servidor web tenha acesso de processamento, assumindo que um usuário poderia executar qualquer declaração contra o servidor SQL. Nesse ambiente, o cliente em relação ao servidor MySQL é na verdade o servidor web, e não um programa remoto executado por usuários que se conectam ao servidor web.

Para evitar a conexão com servidores não confiáveis, os clientes podem estabelecer uma conexão segura e verificar a identidade do servidor, conectando-se usando a opção `--ssl-mode=VERIFY_IDENTITY` e o certificado CA apropriado. Para implementar esse nível de verificação, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade resultarão. Para obter mais informações, consulte Opções de comando para conexões criptografadas.

Para evitar problemas com `LOAD DATA`, os clientes devem evitar o uso de `LOCAL`, a menos que precauções adequadas tenham sido tomadas do lado do cliente.

Para o controle da carga de dados locais, o MySQL permite que a capacidade seja habilitada ou desabilitada. Além disso, a partir do MySQL 8.0.21, o MySQL permite que os clientes restrinjam as operações de carga de dados locais a arquivos localizados em um diretório designado.

* Habilitar ou desabilitar a capacidade de carregar dados locais
* Restrição de arquivos permitidos para carregamento de dados locais
* Shell MySQL e carregamento de dados locais

#### Habilitando ou Desabilitando a Capacidade de Carregar Dados Locais

Os administradores e aplicativos podem configurar se é permitido carregar dados locais da seguinte forma:

* No lado do servidor:

+ A variável de sistema `local_infile` controla a capacidade `LOCAL` do lado do servidor. Dependendo da configuração `local_infile`, o servidor pode recusar ou permitir o carregamento de dados locais por clientes que solicitam o carregamento de dados locais.

+ Por padrão, `local_infile` está desativado. (Essa é uma mudança em relação às versões anteriores do MySQL.) Para fazer com que o servidor recusando ou permitir as declarações `LOAD DATA LOCAL`(load-data.html "15.2.9 LOAD DATA Statement") explicitamente (independentemente de como os programas e bibliotecas do cliente são configurados no momento da construção ou no tempo de execução), inicie o **mysqld** com `local_infile` desativado ou ativado. `local_infile` também pode ser definido no tempo de execução.

* Do lado do cliente:

+ A opção `ENABLED_LOCAL_INFILE` **CMake** controla a capacidade pré-compilada padrão `LOCAL` para a biblioteca de cliente MySQL (consulte Seção 2.8.7, “Opções de Configuração de Fonte MySQL”). Os clientes que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desativada ou ativada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento da construção do MySQL.

+ Por padrão, a biblioteca de clientes nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` desativado. Se você compilar o MySQL a partir de fonte, configure-o com `ENABLED_LOCAL_INFILE` desativado ou ativado, dependendo se os clientes que não fazem acordos explícitos devem ter a capacidade `LOCAL` desativada ou ativada.

+ Para programas de cliente que utilizam a API C, a capacidade de carregar dados local é determinada pelo padrão compilado na biblioteca de cliente MySQL. Para habilitar ou desabilitar explicitamente, invoque a função `mysql_options()` da API C para desabilitar ou habilitar a opção `MYSQL_OPT_LOCAL_INFILE`. Veja mysql_options().

+ Para o cliente **mysql**, a capacidade de carregar dados locais é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para desabilitar ou habilitar explicitamente, use a opção `--local-infile=0` ou `--local-infile[=1]`.

+ Para o cliente **mysqlimport**, o carregamento de dados locais não é usado por padrão. Para desabilitar ou habilitar explicitamente, use a opção `--local=0` ou `--local[=1]`.

+ Se você usar `LOAD DATA LOCAL` em scripts Perl ou outros programas que leem o grupo (load-data.html "15.2.9 LOAD DATA Statement") a partir de arquivos de opção, você pode adicionar um ajuste de opção `local-infile` a esse grupo. Para evitar problemas para programas que não entendem essa opção, especifique-a usando o prefixo `loose-`:

    ```
    [client]
    loose-local-infile=0
    ```

ou:

    ```
    [client]
    loose-local-infile=1
    ```

+ Em todos os casos, o uso bem-sucedido de uma operação de carregamento `LOCAL` por um cliente também exige que o servidor permita o carregamento local.

Se a capacidade `LOCAL` estiver desativada, seja no lado do servidor ou do cliente, um cliente que tente emitir uma declaração `LOAD DATA LOCAL`(load-data.html "15.2.9 LOAD DATA Statement") receberá a seguinte mensagem de erro:

```
ERROR 3950 (42000): Loading local data is disabled; this must be
enabled on both the client and server side
```

#### Restrição de arquivos permitidos para carregamento de dados locais

A partir do MySQL 8.0.21, a biblioteca de clientes MySQL permite que as aplicações de cliente restrinjam as operações de carregamento de dados locais a arquivos localizados em um diretório designado. Alguns programas de clientes MySQL aproveitam essa capacidade.

Os programas de cliente que utilizam a API C podem controlar quais arquivos devem ser permitidos para carregar dados usando as opções `MYSQL_OPT_LOCAL_INFILE` e `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` da função API C `mysql_options()` (ver mysql_options()).

O efeito de `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` depende se o carregamento de dados de `LOCAL` está habilitado ou desabilitado:

* Se o carregamento de dados do `LOCAL` estiver habilitado, seja por padrão na biblioteca do cliente MySQL ou explicitamente habilitando o `MYSQL_OPT_LOCAL_INFILE`, a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` não terá efeito.

* Se o carregamento de dados do `LOCAL` estiver desativado, seja por padrão na biblioteca do cliente MySQL ou ao desativar explicitamente o `MYSQL_OPT_LOCAL_INFILE`, a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` pode ser usada para designar um diretório permitido para arquivos carregados localmente. Neste caso, o carregamento de dados do `LOCAL` é permitido, mas restrito a arquivos localizados no diretório designado. A interpretação do valor do `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` é a seguinte:

+ Se o valor for o ponteiro nulo (o padrão), não é nomeado nenhum diretório, com o resultado de que não são permitidos arquivos para a carga de dados do `LOCAL`.

+ Se o valor for o nome de um caminho de diretório, o carregamento de dados `LOCAL` é permitido, mas restrito a arquivos localizados no diretório nomeado. A comparação do nome do caminho de diretório e do nome dos arquivos a serem carregados é sensível ao caso, independentemente da sensibilidade ao caso do sistema de arquivos subjacente.

Os programas de cliente MySQL utilizam as opções anteriores `mysql_options()` da seguinte forma:

* O cliente **mysql** tem uma opção `--load-data-local-dir` que aceita um caminho de diretório ou uma string vazia. **mysql** usa o valor da opção para definir a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` (com uma string vazia definindo o valor para o ponteiro nulo). O efeito de `--load-data-local-dir` depende se o carregamento de dados `LOCAL` está habilitado:

+ Se o carregamento de dados do `LOCAL` estiver habilitado, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile[=1]`, a opção `--load-data-local-dir` é ignorada.

+ Se o carregamento de dados do `LOCAL` estiver desativado, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile=0`, a opção `--load-data-local-dir` se aplica.

Quando o `--load-data-local-dir` se aplica, o valor da opção designa o diretório em que os arquivos de dados locais devem estar localizados. A comparação do nome do caminho do diretório e do nome do caminho dos arquivos a serem carregados é sensível ao caso, independentemente da sensibilidade ao caso do sistema de arquivos subjacente. Se o valor da opção for a string vazia, ele não nomeia nenhum diretório, com o resultado de que nenhum arquivo é permitido para carregamento de dados locais.

* **mysqlimport** define `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` para cada arquivo que processa, para que o diretório que contém o arquivo seja o diretório de carregamento local permitido.

* Para operações de carregamento de dados correspondentes às declarações `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos eventos do log binário, os escreve como arquivos temporários no sistema de arquivos local e escreve as declarações [[`LOAD DATA LOCAL`](load-data.html "15.2.9 LOAD DATA Statement") para fazer com que os arquivos sejam carregados. Por padrão, o **mysqlbinlog** escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar arquivos temporários locais.

Como outros processos podem escrever arquivos no diretório padrão específico do sistema, é aconselhável especificar a opção `--local-load` para o **mysqlbinlog** para designar um diretório diferente para os arquivos de dados, e, em seguida, designar o mesmo diretório especificando a opção `--load-data-local-dir` para o **mysql** ao processar a saída do **mysqlbinlog**.

#### Shell do MySQL e carregamento de dados locais

O MySQL Shell oferece uma série de utilitários para drenar tabelas, esquemas ou instâncias do servidor e carregá-los em outras instâncias. Quando você usa esses utilitários para manipular os dados, o MySQL Shell oferece funções adicionais, como pré-processamento de entrada, carregamento paralelo multithread, compressão e descomprição de arquivos e controle de acesso aos buckets do Oracle Cloud Infrastructure Object Storage. Para obter a melhor funcionalidade, sempre use a versão mais recente disponível dos utilitários de dump e carregamento do MySQL Shell.

As ferramentas de upload de dados do MySQL Shell utilizam as declarações `LOAD DATA LOCAL INFILE` (load-data.html "15.2.9 LOAD DATA Statement") para fazer o upload de dados, portanto, a variável de sistema `local_infile` deve ser definida como `ON` na instância do servidor de destino. Você pode fazer isso antes de fazer o upload dos dados e removê-lo novamente depois. As ferramentas tratam as solicitações de transferência de arquivos de forma segura para lidar com as considerações de segurança discutidas neste tópico.

O MySQL Shell inclui esses utilitários de dump e carregamento de dump:

Utilização de exportação de tabela `util.exportTable()` :   Exporta uma tabela relacional MySQL em um arquivo de dados, que pode ser carregado em uma instância do servidor MySQL usando a utilidade de importação de tabela paralela do MySQL Shell, importado para um aplicativo diferente ou usado como backup lógico. A utilidade tem opções predefinidas e opções de personalização para produzir diferentes formatos de saída.

Utilitário de importação de tabela paralela `util.importTable()` :   Importa um arquivo de dados para uma tabela relacional MySQL. O arquivo de dados pode ser a saída do utilitário de exportação de tabela do MySQL Shell ou outro formato suportado pelas opções pré-definidas e de personalização do utilitário. O utilitário pode realizar pré-processamento de entrada antes de adicionar os dados à tabela. Pode aceitar vários arquivos de dados para mesclar em uma única tabela relacional e descomprimir automaticamente arquivos comprimidos.

Utilitário de descarte de instância `util.dumpInstance()`, utilitário de descarte de esquema `util.dumpSchemas()` e utilitário de descarte de tabela `util.dumpTables()` :   Expor uma instância, um esquema ou uma tabela para um conjunto de arquivos de descarte, que podem então ser carregados em uma instância MySQL usando o utilitário de carregamento de descarte do MySQL Shell. Os utilitários fornecem verificações e modificações de compatibilidade do Oracle Cloud Infrastructure Object Storage, streaming e do MySQL HeatWave Service, além da capacidade de realizar uma execução em seco para identificar problemas antes de prosseguir com o descarte.

Utilitário de carregamento de dados `util.loadDump()` :   Importe arquivos de dump importados criados usando o utilitário de dump de instância, esquema ou tabela do MySQL Shell em um Sistema de Banco de Dados MySQL HeatWave ou em uma instância do MySQL Server. O utilitário gerencia o processo de upload e fornece streaming de dados de armazenamento remoto, carregamento paralelo de tabelas ou partes de tabela, rastreamento do estado de progresso, capacidade de retomada e reinício, e a opção de carregamento concorrente enquanto o dump ainda está ocorrendo. O utilitário de importação de tabela paralela do MySQL Shell pode ser usado em combinação com o utilitário de carregamento de dados para modificar os dados antes de enviá-los para a instância MySQL de destino.

Para obter detalhes sobre as utilidades, consulte as utilidades do MySQL Shell.

### 8.1.7 Diretrizes de segurança para programação de clientes

Os aplicativos de clientes que acessam o MySQL devem seguir as diretrizes a seguir para evitar interpretar dados externos incorretamente ou expor informações sensíveis.

* Trate os dados externos corretamente
* Trate os erros do MySQL corretamente

#### Gerencie os dados externos corretamente

Aplicativos que acessam o MySQL não devem confiar em quaisquer dados inseridos por usuários, que podem tentar enganar seu código ao inserir sequências de caracteres especiais ou escapadas em formulários da Web, URLs ou qualquer aplicativo que você tenha criado. Certifique-se de que sua aplicação permaneça segura se um usuário tentar realizar uma injeção SQL ao inserir algo como `; DROP DATABASE mysql;` em um formulário. Este é um exemplo extremo, mas grandes vazamentos de segurança e perda de dados podem ocorrer como resultado de hackers usando técnicas semelhantes, se você não se preparar para elas.

Um erro comum é proteger apenas os valores de dados de texto. Lembre-se de verificar os dados numéricos também. Se um aplicativo gerar uma consulta como `SELECT * FROM table WHERE ID=234` quando um usuário digita o valor `234`, o usuário pode digitar o valor `234 OR 1=1` para fazer com que o aplicativo gere a consulta `SELECT * FROM table WHERE ID=234 OR 1=1`. Como resultado, o servidor recupera cada linha da tabela. Isso expõe cada linha e causa uma carga excessiva no servidor. A maneira mais simples de se proteger desse tipo de ataque é usar aspas duplas ao redor das constantes numéricas: `SELECT * FROM table WHERE ID='234'`. Se o usuário digitar informações extras, tudo se torna parte do texto. Em um contexto numérico, o MySQL converte automaticamente esse texto em um número e remove quaisquer caracteres não numéricos finais.

Às vezes, as pessoas pensam que, se um banco de dados contém apenas dados disponíveis publicamente, ele não precisa ser protegido. Isso está incorreto. Mesmo que seja permitido exibir qualquer linha no banco de dados, você ainda deve proteger contra ataques de negação de serviço (por exemplo, aqueles que são baseados na técnica do parágrafo anterior que faz o servidor desperdiçar recursos). Caso contrário, seu servidor deixa de ser responsivo para usuários legítimos.

Lista de verificação:

* Habilite o modo SQL rigoroso para informar ao servidor que deve ser mais restritivo em relação aos valores de dados que aceita. Veja a Seção 7.1.11, “Modos SQL do servidor”.

* Tente inserir aspas simples e duplas (`'` e `"`) em todos os seus formulários da Web. Se você receber algum tipo de erro MySQL, investigue o problema imediatamente.

* Tente modificar URLs dinâmicas adicionando `%22` (`"`), `%23` (`#`), e `%27` (`'`) a eles.

* Tente modificar os tipos de dados em URLs dinâmicas de numeric para tipos de caracteres usando os caracteres mostrados nos exemplos anteriores. Sua aplicação deve ser segura contra esses e ataques semelhantes.

* Tente inserir caracteres, espaços e símbolos especiais em vez de números em campos numéricos. Sua aplicação deve removê-los antes de passá-los para o MySQL, caso contrário, gerará um erro. Passar valores não verificados para o MySQL é muito perigoso!

* Verifique o tamanho dos dados antes de passá-los para o MySQL.
* Faça com que sua aplicação se conecte ao banco de dados usando um nome de usuário diferente do que você usa para fins administrativos. Não dê às suas aplicações privilégios de acesso que eles não precisam.

Muitas interfaces de programação de aplicativos fornecem uma maneira de escapar de caracteres especiais nos valores dos dados. Quando usada corretamente, isso impede que os usuários do aplicativo digam valores que causem ao aplicativo a geração de declarações que tenham um efeito diferente do que você pretende:

* Declarações SQL do MySQL: Use declarações preparadas SQL e aceite valores de dados apenas por meio de marcadores; veja Seção 15.5, “Declarações preparadas”.

* API MySQL C: Use a chamada de API `mysql_real_escape_string_quote()`. Alternativamente, use a interface de declaração preparada da API C e aceite os valores dos dados apenas por meio de marcadores; veja a Interface de Declaração Preparada da API C.

* MySQL++: Use os modificadores `escape` e `quote` para fluxos de consulta.

* PHP: Use as extensões `mysqli` ou `pdo_mysql`, e não a extensão mais antiga `ext/mysql`. As APIs preferenciais oferecem suporte ao protocolo de autenticação MySQL aprimorado e senhas, além de instruções preparadas com marcadores. Veja também MySQL e PHP.

Se a extensão mais antiga `ext/mysql` precisar ser usada, então para escapar, use a função `mysql_real_escape_string_quote()` e não `mysql_escape_string()` ou `addslashes()`, pois apenas `mysql_real_escape_string_quote()` é sensível ao conjunto de caracteres; as outras funções podem ser "bypassadas" ao usar conjuntos de caracteres multibyte (inválidos).

* Perl DBI: Use marcadores ou o método `quote()`.

* Java JDBC: Use um objeto `PreparedStatement` e marcadores.

Outras interfaces de programação podem ter capacidades semelhantes.

#### Lidar com os Mensagens de Erro do MySQL corretamente

É responsabilidade do aplicativo interceptar erros que ocorrem como resultado da execução de instruções SQL com o servidor de banco de dados MySQL e lidar com eles de forma apropriada.

As informações devolvidas em um erro do MySQL não são gratuitas, pois essas informações são essenciais para depurar o MySQL usando aplicativos. Por exemplo, seria quase impossível depurar uma declaração comum de junção de 10 maneiras `SELECT` sem fornecer informações sobre quais bancos de dados, tabelas e outros objetos estão envolvidos com problemas. Assim, os erros do MySQL às vezes devem conter, necessariamente, referências aos nomes desses objetos.

Uma abordagem simples, mas insegura, para uma aplicação quando ela recebe um erro desse tipo do MySQL, é interceptá-lo e exibí-lo diretamente ao cliente. No entanto, revelar informações de erro é um tipo conhecido de vulnerabilidade de aplicação (CWE-209) e o desenvolvedor da aplicação deve garantir que a aplicação não tenha essa vulnerabilidade.

Por exemplo, um aplicativo que exibe uma mensagem como essa exibe tanto o nome do banco de dados quanto o nome da tabela aos clientes, que são informações que um cliente pode tentar explorar:

```
ERROR 1146 (42S02): Table 'mydb.mytable' doesn't exist
```

Em vez disso, o comportamento adequado para uma aplicação quando recebe tal erro do MySQL é registrar informações apropriadas, incluindo as informações do erro, em um local seguro de auditoria, acessível apenas ao pessoal de confiança. A aplicação pode retornar algo mais genérico, como “Erro interno”, ao usuário.