### 2.5.5 Instalando o MySQL no Linux Usando Pacotes RPM da Oracle

A maneira recomendada de instalar o MySQL em distribuições Linux baseadas em RPM é usando os pacotes RPM fornecidos pela Oracle. Existem duas fontes para obtê-los, para a Community Edition do MySQL:

* Dos repositórios de software MySQL:

  + O repositório MySQL Yum (consulte a Seção 2.5.1, “Instalando o MySQL no Linux Usando o Repositório MySQL Yum” para obter detalhes).

  + O repositório MySQL SLES (consulte a Seção 2.5.4, “Instalando o MySQL no Linux Usando o Repositório MySQL SLES” para obter detalhes).

* Na página [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/) na [MySQL Developer Zone](https://dev.mysql.com/).

Note

Distribuições RPM do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir daquelas criadas pela Oracle em recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções de instalação neste manual não se aplicam necessariamente a elas. As instruções do fornecedor devem ser consultadas.

Se você tiver uma distribuição de MySQL de terceiros rodando em seu sistema e agora deseja migrar para a distribuição da Oracle usando os pacotes RPM baixados da MySQL Developer Zone, consulte Compatibilidade com Pacotes RPM de Outros Fornecedores abaixo. O método preferencial de migração, no entanto, é usar o repositório MySQL Yum ou o repositório MySQL SLES.

Os pacotes RPM para MySQL estão listados nas seguintes tabelas:

**Tabela 2.9 Pacotes RPM para MySQL Community Edition**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Nome do Package</th> <th>Resumo</th> </tr></thead><tbody><tr> <td><code>mysql-community-server</code></td> <td>Database server e ferramentas relacionadas</td> </tr><tr> <td><code>mysql-community-client</code></td> <td>Aplicações Client MySQL e ferramentas</td> </tr><tr> <td><code>mysql-community-common</code></td> <td>Arquivos comuns para Server e bibliotecas Client</td> </tr><tr> <td><code>mysql-community-devel</code></td> <td>Arquivos header de Development e bibliotecas para aplicações client de Database MySQL</td> </tr><tr> <td><code>mysql-community-libs</code></td> <td>Bibliotecas compartilhadas para aplicações client de Database MySQL</td> </tr><tr> <td><code>mysql-community-libs-compat</code></td> <td>Bibliotecas de compatibilidade compartilhadas para instalações MySQL anteriores</td> </tr><tr> <td><code>mysql-community-embedded</code></td> <td>Biblioteca embedded MySQL</td> </tr><tr> <td><code>mysql-community-embedded-devel</code></td> <td>Arquivos header de Development e bibliotecas para MySQL como uma biblioteca embeddable</td> </tr><tr> <td><code>mysql-community-test</code></td> <td>Suite de Teste para o MySQL Server</td> </tr></tbody></table>

**Tabela 2.10 Pacotes RPM para MySQL Enterprise Edition**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Nome do Package</th> <th>Resumo</th> </tr></thead><tbody><tr> <td><code>mysql-commercial-server</code></td> <td>Database server e ferramentas relacionadas</td> </tr><tr> <td><code>mysql-commercial-client</code></td> <td>Aplicações Client MySQL e ferramentas</td> </tr><tr> <td><code>mysql-commercial-common</code></td> <td>Arquivos comuns para Server e bibliotecas Client</td> </tr><tr> <td><code>mysql-commercial-devel</code></td> <td>Arquivos header de Development e bibliotecas para aplicações client de Database MySQL</td> </tr><tr> <td><code>mysql-commercial-libs</code></td> <td>Bibliotecas compartilhadas para aplicações client de Database MySQL</td> </tr><tr> <td><code>mysql-commercial-libs-compat</code></td> <td>Bibliotecas de compatibilidade compartilhadas para instalações MySQL anteriores</td> </tr><tr> <td><code>mysql-commercial-embedded</code></td> <td>Biblioteca embedded MySQL</td> </tr><tr> <td><code>mysql-commercial-embedded-devel</code></td> <td>Arquivos header de Development e bibliotecas para MySQL como uma biblioteca embeddable</td> </tr><tr> <td><code>mysql-commercial-test</code></td> <td>Suite de Teste para o MySQL Server</td> </tr></tbody></table>

Os nomes completos dos RPMs têm a seguinte sintaxe:

```sql
packagename-version-distribution-arch.rpm
```

Os valores *`distribution`* e *`arch`* indicam a distribuição Linux e o tipo de processador para o qual o Package foi construído. Veja a tabela abaixo para listas de identificadores de distribuição:

**Tabela 2.11 Identificadores de Distribuição de Pacotes RPM do MySQL para Linux**

<table><thead><tr> <th>Valor distribution</th> <th>Uso Pretendido</th> </tr></thead><tbody><tr> <td>el<em><code>{version}</code></em> onde <em><code>{version}</code></em> é a principal versão do Enterprise Linux, como <code>el8</code></td> <td>Plataformas baseadas em EL6 (8.0), EL7, EL8, EL9 e EL10 (por exemplo, as versões correspondentes do Oracle Linux, Red Hat Enterprise Linux e CentOS)</td> </tr><tr> <td><code>sles12</code></td> <td>SUSE Linux Enterprise Server 12</td> </tr></tbody></table>

Para ver todos os arquivos em um Package RPM (por exemplo, `mysql-community-server`), use o seguinte comando:

```sql
$> rpm -qpl mysql-community-server-version-distribution-arch.rpm
```

*A discussão no restante desta seção se aplica apenas a um processo de instalação que utiliza os pacotes RPM baixados diretamente da Oracle, em vez de um repositório MySQL.*

Relações de dependência existem entre alguns dos packages. Se você planeja instalar muitos dos packages, pode ser preferível baixar o arquivo **tar** do *bundle* RPM, que contém todos os pacotes RPM listados acima, para que você não precise baixá-los separadamente.

Na maioria dos casos, você precisará instalar os packages `mysql-community-server`, `mysql-community-client`, `mysql-community-libs`, `mysql-community-common` e `mysql-community-libs-compat` para obter uma instalação MySQL funcional e padrão. Para realizar uma instalação básica e padrão, vá para a pasta que contém todos esses packages (e, de preferência, nenhum outro pacote RPM com nomes semelhantes) e emita o seguinte comando para plataformas *diferentes* de Red Hat Enterprise Linux/Oracle Linux/CentOS:

```sql
$> sudo yum install mysql-community-{server,client,common,libs}-*
```

Substitua **yum** por **zypper** para SLES.

Para sistemas Red Hat Enterprise Linux/Oracle Linux/CentOS:

```sql
$> sudo yum install mysql-community-{server,client,common,libs}-* mysql-5.*­
```

Embora seja muito preferível usar uma ferramenta de gerenciamento de package de alto nível como **yum** para instalar os packages, usuários que preferem comandos **rpm** diretos podem substituir o comando **yum install** pelo comando **rpm -Uvh**; no entanto, o uso de **rpm -Uvh** torna o processo de instalação mais propenso a falhas, devido a possíveis problemas de dependência que o processo de instalação possa encontrar.

Para instalar apenas os programas client, você pode pular `mysql-community-server` em sua lista de packages a instalar; emita o seguinte comando para plataformas *diferentes* de Red Hat Enterprise Linux/Oracle Linux/CentOS:

```sql
$> sudo yum install mysql-community-{client,common,libs}-*
```

Substitua **yum** por **zypper** para SLES.

Para sistemas Red Hat Enterprise Linux/Oracle Linux/CentOS:

```sql
$> sudo yum install mysql-community-{client,common,libs}-* mysql-5.*
```

Uma instalação padrão do MySQL usando os pacotes RPM resulta em arquivos e recursos criados nos diretórios do sistema, conforme mostrado na tabela a seguir.

**Tabela 2.12 Layout de Instalação do MySQL para Pacotes RPM do Linux da MySQL Developer Zone**

<table><col style="width: 55%"/><col style="width: 45%"/><thead><tr> <th>Arquivos ou Recursos</th> <th>Localização</th> </tr></thead><tbody><tr> <td>Programas Client e scripts</td> <td><code>/usr/bin</code></td> </tr><tr> <td>Server <span><strong>mysqld</strong></span></td> <td><code>/usr/sbin</code></td> </tr><tr> <td>Arquivo de Configuration</td> <td><code>/etc/my.cnf</code></td> </tr><tr> <td>Diretório de Data</td> <td><code>/var/lib/mysql</code></td> </tr><tr> <td>Arquivo de log de Error</td> <td><p> Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>/var/log/mysqld.log</code> </p><p> Para SLES: <code>/var/log/mysql/mysqld.log</code> </p></td> </tr><tr> <td>Valor de <code>secure_file_priv</code></td> <td><code>/var/lib/mysql-files</code></td> </tr><tr> <td>Script de init do System V</td> <td><p> Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>/etc/init.d/mysqld</code> </p><p> Para SLES: <code>/etc/init.d/mysql</code> </p></td> </tr><tr> <td>Serviço Systemd</td> <td><p> Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>mysqld</code> </p><p> Para SLES: <code>mysql</code> </p></td> </tr><tr> <td>Arquivo Pid</td> <td><code> /var/run/mysql/mysqld.pid</code></td> </tr><tr> <td>Socket</td> <td><code>/var/lib/mysql/mysql.sock</code></td> </tr><tr> <td>Diretório Keyring</td> <td><code>/var/lib/mysql-keyring</code></td> </tr><tr> <td>Man pages Unix</td> <td><code>/usr/share/man</code></td> </tr><tr> <td>Arquivos Include (header)</td> <td><code>/usr/include/mysql</code></td> </tr><tr> <td>Bibliotecas</td> <td><code>/usr/lib/mysql</code></td> </tr><tr> <td>Arquivos de suporte diversos (por exemplo, mensagens de error e arquivos de character set)</td> <td><code>/usr/share/mysql</code></td> </tr></tbody></table>

A instalação também cria um user chamado `mysql` e um grupo chamado `mysql` no sistema.

Notes

* O user `mysql` é criado usando as opções `-r` e `-s /bin/false` do comando `useradd`, de modo que ele não tenha permissões de login para o host do seu Server (consulte Creating the mysql User and Group para obter detalhes). Para mudar para o user `mysql` no seu OS, use a opção `--shell=/bin/bash` para o comando `su`:

  ```sql
  su - mysql --shell=/bin/bash
  ```

* A instalação de versões anteriores do MySQL usando pacotes mais antigos pode ter criado um arquivo de configuration chamado `/usr/my.cnf`. É altamente recomendável que você examine o conteúdo do arquivo, migre as configurações desejadas para o arquivo `/etc/my.cnf` e, em seguida, remova `/usr/my.cnf`.

O MySQL não é iniciado automaticamente ao final do processo de instalação. Para sistemas Red Hat Enterprise Linux, Oracle Linux, CentOS e Fedora, use o seguinte comando para iniciar o MySQL:

```sql
$> sudo service mysqld start
```

Para sistemas SLES, o comando é o mesmo, mas o nome do Service é diferente:

```sql
$> sudo service mysql start
```

Se o sistema operacional tiver o systemd habilitado, os comandos **service** padrão, como **stop**, **start**, **status** e **restart**, devem ser usados para gerenciar o service do MySQL Server. O service `mysqld` é habilitado por padrão e inicia na reinicialização do sistema. Note que certas coisas podem funcionar de forma diferente em plataformas systemd: por exemplo, mudar a localização do diretório de data pode causar problemas. Consulte a Seção 2.5.10, “Gerenciando o MySQL Server com systemd” para obter informações adicionais.

Durante uma instalação de upgrade usando pacotes RPM e DEB, se o MySQL Server estiver em execução quando o upgrade ocorrer, o MySQL Server é interrompido, o upgrade é realizado e o MySQL Server é reiniciado. Uma exceção: se a edição também mudar durante um upgrade (como de community para commercial, ou vice-versa), o MySQL Server não é reiniciado.

Na inicialização do Server, o seguinte acontece, dado que o diretório de data do Server está vazio:

* O Server é inicializado.
* Um certificado SSL e arquivos key são gerados no diretório de data.

* `validate_password` é instalado e habilitado.

* Uma conta de superuser `'root'@'localhost'` é criada. Uma password para o superuser é definida e armazenada no arquivo de log de error. Para revelá-la, use o seguinte comando para sistemas RHEL, Oracle Linux, CentOS e Fedora:

  ```sql
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Use o seguinte comando para sistemas SLES:

  ```sql
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  O próximo passo é logar com a password temporária gerada e definir uma password customizada para a conta do superuser:

```sql
$> mysql -uroot -p
```

```sql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

Note

`validate_password` é instalado por padrão. A política de password padrão implementada por `validate_password` exige que as passwords contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da password seja de pelo menos 8 caracteres.

Se algo der errado durante a instalação, você poderá encontrar informações de debug no arquivo de log de error `/var/log/mysqld.log`.

Para algumas distribuições Linux, pode ser necessário aumentar o limite no número de file descriptors disponíveis para **mysqld**. Consulte a Seção B.3.2.16, “File Not Found and Similar Errors”.

**Compatibilidade com Pacotes RPM de Outros Fornecedores.** Se você instalou packages para MySQL a partir do repositório de software local da sua distribuição Linux, é muito preferível instalar os novos pacotes baixados diretamente da Oracle usando o sistema de gerenciamento de package da sua plataforma (**yum**, **dnf** ou **zypper**), conforme descrito acima. O comando substitui os packages antigos por novos para garantir a compatibilidade de aplicações antigas com a nova instalação; por exemplo, o package antigo `mysql-libs` é substituído pelo package `mysql-community-libs-compat`, que fornece uma biblioteca client de substituição compatível para aplicações que estavam usando sua instalação MySQL anterior. Se houver uma versão mais antiga de `mysql-community-libs-compat` no sistema, ela também será substituída.

Se você instalou packages de terceiros para MySQL que NÃO são do repositório de software local da sua distribuição Linux (por exemplo, packages baixados diretamente de um fornecedor que não seja a Oracle), você deve desinstalar todos esses packages antes de instalar os novos pacotes baixados diretamente da Oracle. Isso ocorre porque podem surgir conflitos entre os pacotes RPM desses fornecedores e os da Oracle: por exemplo, a convenção de um fornecedor sobre quais arquivos pertencem ao Server e quais pertencem à biblioteca client pode diferir daquela usada para os packages da Oracle. Tentativas de instalar um RPM da Oracle podem então resultar em mensagens dizendo que os arquivos no RPM a ser instalado conflitam com arquivos de um package já instalado.

**Instalando Bibliotecas Client de Múltiplas Versões do MySQL.** É possível instalar múltiplas versões de biblioteca client, por exemplo, no caso de você querer manter a compatibilidade com aplicações mais antigas vinculadas a bibliotecas anteriores. Para instalar uma biblioteca client mais antiga, use a opção `--oldpackage` com **rpm**. Por exemplo, para instalar `mysql-community-libs-5.5` em um sistema EL6 que possui `libmysqlclient.20` do MySQL 5.7, use um comando como este:

```sql
$> rpm --oldpackage -ivh mysql-community-libs-5.5.50-2.el6.x86_64.rpm
```

**Package Debug.** Uma variante especial do MySQL Server compilada com o package debug foi incluída nos pacotes RPM do Server. Ele realiza verificações de debugging e alocação de memória e produz um arquivo trace quando o Server está em execução. Para usar essa versão debug, inicie o MySQL com `/usr/sbin/mysqld-debug`, em vez de iniciá-lo como um service ou com `/usr/sbin/mysqld`. Consulte a Seção 5.8.3, “O Package DBUG” para as opções debug que você pode usar.

Note

O diretório de plugin padrão para builds debug mudou de `/usr/lib64/mysql/plugin` para `/usr/lib64/mysql/plugin/debug` no 5.7.21. Anteriormente, era necessário alterar `plugin_dir` para `/usr/lib64/mysql/plugin/debug` para builds debug.

**Reconstruindo RPMs a partir de SRPMs source.** Pacotes SRPM de código source para MySQL estão disponíveis para download. Eles podem ser usados como estão para reconstruir os RPMs do MySQL com a cadeia de ferramentas **rpmbuild** padrão.

**Passwords `root` para releases pré-GA.**

Para MySQL 5.7.4 e 5.7.5, a password `root` inicial aleatória é escrita no arquivo `.mysql_secret` no diretório nomeado pela variável de ambiente `HOME`. Ao tentar acessar o arquivo, lembre-se de que, dependendo do sistema operacional, usar um comando como **sudo** pode fazer com que o valor de `HOME` se refira ao diretório home do user de sistema `root`. O arquivo `.mysql_secret` é criado com o modo 600 para ser acessível apenas ao user de sistema para o qual foi criado. Antes do MySQL 5.7.4, as contas (incluindo `root`) criadas nas grant tables do MySQL para uma instalação RPM inicialmente não tinham passwords; depois de iniciar o Server, você deve atribuir passwords a elas usando as instruções na Seção 2.9, “Postinstallation Setup and Testing”.