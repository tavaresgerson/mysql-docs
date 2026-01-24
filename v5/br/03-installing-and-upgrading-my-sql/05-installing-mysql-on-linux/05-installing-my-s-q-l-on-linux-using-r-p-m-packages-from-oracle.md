### 2.5.5 Instalar o MySQL no Linux usando pacotes RPM da Oracle

A maneira recomendada de instalar o MySQL em distribuições Linux baseadas em RPM é usando os pacotes RPM fornecidos pela Oracle. Existem duas fontes para obtê-los, para a Edição Comunitária do MySQL:

- Dos repositórios de software MySQL:
  + O repositório MySQL Yum (consulte a Seção 2.5.1, “Instalando o MySQL no Linux usando o repositório MySQL Yum”, para obter detalhes).
  + O repositório MySQL SLES (consulte a Seção 2.5.4, “Instalando o MySQL no Linux usando o repositório MySQL SLES”, para obter detalhes).
- Na página [Baixar MySQL Community Server](https://dev.mysql.com/downloads/mysql/) na [MySQL Developer Zone](https://dev.mysql.com/).

::: info Nota
Distribuições RPM do MySQL também são fornecidas por outros fornecedores. Tenha em mente que elas podem diferir das construídas pela Oracle em termos de recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções de instalação neste manual não se aplicam necessariamente a elas. As instruções do fornecedor devem ser consultadas em vez disso.
:::

Se você tem uma distribuição de terceiros do MySQL rodando no seu sistema e agora deseja migrar para a distribuição da Oracle usando os pacotes RPM baixados da MySQL Developer Zone, consulte a seção Compatibilidade com Pacotes RPM de Outros Fornecedores abaixo. O método preferido de migração, no entanto, é usar o repositório MySQL Yum ou o repositório MySQL SLES.

Os pacotes RPM para o MySQL estão listados nas seguintes tabelas:

**Tabela 2.9 Pacotes RPM para a Edição Comunitária do MySQL**

<table><thead><tr><th>Nome do pacote</th><th>Resumo</th></tr></thead><tbody><tr><td><code>mysql-community-server</code></td><td>Servidor de banco de dados e ferramentas relacionadas</td></tr><tr><td><code>mysql-community-client</code></td><td>Aplicativos e ferramentas de cliente MySQL</td></tr><tr><td><code>mysql-community-common</code></td><td>Arquivos comuns para bibliotecas de servidor e cliente</td></tr><tr><td><code>mysql-community-devel</code></td><td>Arquivos de cabeçalho e bibliotecas de desenvolvimento para aplicações cliente de banco de dados MySQL</td></tr><tr><td><code>mysql-community-libs</code></td><td>Bibliotecas compartilhadas para aplicações de clientes de banco de dados MySQL</td></tr><tr><td><code>mysql-community-libs-compat</code></td><td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL</td></tr><tr><td><code>mysql-community-embedded</code></td><td>Biblioteca integrada MySQL</td></tr><tr><td><code>mysql-community-embedded-devel</code></td><td>Arquivos de cabeçalho e bibliotecas de desenvolvimento para MySQL como uma biblioteca incorporável</td></tr><tr><td><code>mysql-community-test</code></td><td>Conjunto de testes para o servidor MySQL</td></tr></tbody></table>

**Tabela 2.10 Pacotes RPM para a Edição Empresarial do MySQL**

<table><thead><tr><th>Nome do pacote</th><th>Resumo</th></tr></thead><tbody><tr><td><code>mysql-commercial-server</code></td><td>Servidor de banco de dados e ferramentas relacionadas</td></tr><tr><td><code>mysql-commercial-client</code></td><td>Aplicativos e ferramentas de cliente MySQL</td></tr><tr><td><code>mysql-commercial-common</code></td><td>Arquivos comuns para bibliotecas de servidor e cliente</td></tr><tr><td><code>mysql-commercial-devel</code></td><td>Arquivos de cabeçalho e bibliotecas de desenvolvimento para aplicações cliente de banco de dados MySQL</td></tr><tr><td><code>mysql-commercial-libs</code></td><td>Bibliotecas compartilhadas para aplicações de clientes de banco de dados MySQL</td></tr><tr><td><code>mysql-commercial-libs-compat</code></td><td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL</td></tr><tr><td><code>mysql-commercial-embedded</code></td><td>Biblioteca integrada MySQL</td></tr><tr><td><code>mysql-commercial-embedded-devel</code></td><td>Arquivos de cabeçalho e bibliotecas de desenvolvimento para MySQL como uma biblioteca incorporável</td></tr><tr><td><code>mysql-commercial-test</code></td><td>Conjunto de testes para o servidor MySQL</td></tr></tbody></table>

Os nomes completos dos RPMs têm a seguinte sintaxe:

```
packagename-version-distribution-arch.rpm
```

Os valores de *`distribution`* e *`arch`* indicam a distribuição Linux e o tipo de processador para o qual o pacote foi construído. Veja a tabela abaixo para listas dos identificadores de distribuição:

**Tabela 2.11 Identificadores de distribuição de pacotes RPM do MySQL Linux**

<table><thead><tr><th>distribuição Valor</th><th>Uso pretendido</th></tr></thead><tbody><tr><td>el <code>{version}</code> onde <code>{version}</code> é a principal versão do Enterprise Linux, como <code>el8</code></td><td>Plataformas baseadas no EL6 (8.0), EL7, EL8, EL9 e EL10 (por exemplo, as versões correspondentes do Oracle Linux, Red Hat Enterprise Linux e CentOS)</td></tr><tr><td><code>sles12</code></td><td>SUSE Linux Enterprise Server 12</td></tr></tbody></table>

Para ver todos os arquivos de um pacote RPM (por exemplo, `mysql-community-server`), use o seguinte comando:

```
$> rpm -qpl mysql-community-server-version-distribution-arch.rpm
```

*A discussão no restante desta seção se aplica apenas a um processo de instalação usando os pacotes RPM baixados diretamente da Oracle, em vez de através de um repositório MySQL.*

Existem relações de dependência entre alguns dos pacotes. Se você planeja instalar muitos dos pacotes, talvez queira baixar o arquivo de pacote RPM **tar** em vez disso, que contém todos os pacotes RPM listados acima, para que você não precise baixá-los separadamente.

Na maioria dos casos, você precisa instalar os pacotes `mysql-community-server`, `mysql-community-client`, `mysql-community-libs`, `mysql-community-common` e `mysql-community-libs-compat` para obter uma instalação funcional e padrão do MySQL. Para realizar uma instalação padrão e básica, vá para a pasta que contém todos esses pacotes (e, de preferência, nenhum outro pacote RPM com nomes semelhantes) e execute o seguinte comando para plataformas **exceto** Red Hat Enterprise Linux/Oracle Linux/CentOS:

```shell
$> sudo yum install mysql-community-{server,client,common,libs}-*
```

Substitua **yum** por **zypper** para SLES.

Para sistemas Red Hat Enterprise Linux/Oracle Linux/CentOS:

```shell
$> sudo yum install mysql-community-{server,client,common,libs}-* mysql-5.*­
```

Embora seja muito preferível usar uma ferramenta de gerenciamento de pacotes de alto nível, como o **yum**, para instalar os pacotes, os usuários que preferem comandos diretos do **rpm** podem substituir o comando **yum install** pelo comando **rpm -Uvh**. No entanto, usar **rpm -Uvh** torna o processo de instalação mais propenso a falhas, devido a possíveis problemas de dependência que o processo de instalação possa encontrar.

Para instalar apenas os programas do cliente, você pode pular o `mysql-community-server` na sua lista de pacotes a serem instalados; execute o seguinte comando para plataformas **exceto** Red Hat Enterprise Linux/Oracle Linux/CentOS:

```shell
$> sudo yum install mysql-community-{client,common,libs}-*
```

Substitua **yum** por **zypper** para SLES.

Para sistemas Red Hat Enterprise Linux/Oracle Linux/CentOS:

```shell
$> sudo yum install mysql-community-{client,common,libs}-* mysql-5.*
```

Uma instalação padrão do MySQL usando os pacotes RPM resulta em arquivos e recursos criados sob os diretórios do sistema, mostrados na tabela a seguir.

**Tabela 2.12 Estrutura de instalação do MySQL para pacotes RPM do Linux da MySQL Developer Zone**

<table><thead><tr><th>Arquivos ou Recursos</th><th>Localização</th></tr></thead><tbody><tr><td>Programas e scripts para clientes</td><td><code>mysqld</code></td></tr><tr><td><strong>mysqld</strong> servidor</td><td><code>mysqld</code></td></tr><tr><td>Arquivo de configuração</td><td><code> /var/run/mysql/mysqld.pid</code></td></tr><tr><td>Diretório de dados</td><td><code>/var/lib/mysql/mysql.sock</code></td></tr><tr><td>Arquivo de registro de erros</td><td><p>Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>/var/lib/mysql-keyring</code></p><p>Para SLES: <code>/usr/share/man</code></p></td></tr><tr><td>Valor de <code>/usr/include/mysql</code></td><td><code>/usr/lib/mysql</code></td></tr><tr><td>Roteiro de inicialização do Sistema V</td><td><p>Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>/usr/share/mysql</code></p><p>Para SLES: <code>/etc/init.d/mysql</code></p></td></tr><tr><td>Serviço Systemd</td><td><p>Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>mysqld</code></p><p>Para SLES: <code>/usr/sbin</code><code>mysqld</code></p></td></tr><tr><td>Arquivo Pid</td><td><code> /var/run/mysql/mysqld.pid</code></td></tr><tr><td>Soquete</td><td><code>/var/lib/mysql/mysql.sock</code></td></tr><tr><td>Diretório de carteiras de identificação</td><td><code>/var/lib/mysql-keyring</code></td></tr><tr><td>Páginas de manual do Unix</td><td><code>/usr/share/man</code></td></tr><tr><td>Incluir arquivos (cabeçalho)</td><td><code>/usr/include/mysql</code></td></tr><tr><td>Livrarias</td><td><code>/usr/lib/mysql</code></td></tr><tr><td>Arquivos de suporte variados (por exemplo, mensagens de erro e arquivos de conjunto de caracteres)</td><td><code>/usr/share/mysql</code></td></tr></tbody></table>

A instalação também cria um usuário chamado `mysql` e um grupo chamado `mysql` no sistema.

Notas

- O usuário `mysql` é criado usando as opções `-r` e `-s /bin/false` do comando `useradd`, para que ele não tenha permissões de login no seu host do servidor (veja Criando o usuário e o grupo mysql para detalhes). Para alternar para o usuário `mysql` no seu sistema operacional, use a opção `--shell=/bin/bash` para o comando `su`:

  ```sql
  su - mysql --shell=/bin/bash
  ```

- A instalação de versões anteriores do MySQL usando pacotes mais antigos pode ter criado um arquivo de configuração chamado `/usr/my.cnf`. É altamente recomendável que você examine o conteúdo do arquivo e migre as configurações desejadas para o arquivo `/etc/my.cnf`, depois remova o `/usr/my.cnf`.

O MySQL não é iniciado automaticamente no final do processo de instalação. Para sistemas Red Hat Enterprise Linux, Oracle Linux, CentOS e Fedora, use o seguinte comando para iniciar o MySQL:

```shell
$> sudo service mysqld start
```

Para sistemas SLES, o comando é o mesmo, mas o nome do serviço é diferente:

```shell
$> sudo service mysql start
```

Se o sistema operacional estiver habilitado para systemd, os comandos padrão do **service**, como **stop**, **start**, **status** e **restart**, devem ser usados para gerenciar o serviço do servidor MySQL. O serviço `mysqld` está habilitado por padrão e é iniciado ao reiniciar o sistema. Observe que certas coisas podem funcionar de maneira diferente em plataformas systemd: por exemplo, alterar a localização do diretório de dados pode causar problemas. Consulte a Seção 2.5.10, “Gerenciando o Servidor MySQL com systemd”, para obter informações adicionais.

Durante uma instalação de atualização usando pacotes RPM e DEB, se o servidor MySQL estiver em execução quando a atualização ocorrer, o servidor MySQL será parado, a atualização ocorrerá e o servidor MySQL será reiniciado. Uma exceção: se a edição também for alterada durante uma atualização (como de comunidade para comercial ou vice-versa), o servidor MySQL não será reiniciado.

Ao inicializar o servidor pela primeira vez, o seguinte acontece, dado que o diretório de dados do servidor está vazio:

- O servidor foi inicializado.
- Um certificado SSL e arquivos de chave são gerados no diretório de dados.
- `validate_password` está instalado e ativado.
- Uma conta de superusuário `'root'@'localhost'` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de log de erro. Para revelá-la, use o seguinte comando para sistemas RHEL, Oracle Linux, CentOS e Fedora:

  ```shell
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Use o seguinte comando para sistemas SLES:

  ```shell
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  O próximo passo é fazer login com a senha temporária gerada e definir uma senha personalizada para a conta de superusuário:

```shell
$> mysql -uroot -p
```

```sql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

Nota

`validate_password` está instalado por padrão. A política de senha padrão implementada pelo `validate_password` exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

Se algo der errado durante a instalação, você pode encontrar informações de depuração no arquivo de log de erro `/var/log/mysqld.log`.

Para algumas distribuições Linux, pode ser necessário aumentar o limite do número de descritores de arquivo disponíveis para o **mysqld**. Consulte a Seção B.3.2.16, “Arquivo não encontrado e erros semelhantes”

**Compatibilidade com pacotes RPM de outros fornecedores.** Se você instalou pacotes para MySQL do repositório de software local da sua distribuição Linux, é muito preferível instalar os novos pacotes baixados diretamente da Oracle usando o sistema de gerenciamento de pacotes da sua plataforma (**yum**, **dnf** ou **zypper**), conforme descrito acima. O comando substitui os pacotes antigos por novos para garantir a compatibilidade das aplicações antigas com a nova instalação; por exemplo, o antigo pacote `mysql-libs` é substituído pelo pacote `mysql-community-libs-compat`, que fornece uma biblioteca de cliente compatível com a substituição para aplicações que estavam usando sua instalação mais antiga do MySQL. Se houvesse uma versão mais antiga do `mysql-community-libs-compat` no sistema, ele também é substituído.

Se você instalou pacotes de terceiros para o MySQL que NÃO são do repositório de software local da sua distribuição Linux (por exemplo, pacotes baixados diretamente de um fornecedor diferente da Oracle), você deve desinstalar todos esses pacotes antes de instalar os novos pacotes baixados diretamente da Oracle. Isso ocorre porque podem surgir conflitos entre os pacotes RPM do fornecedor e os pacotes da Oracle: por exemplo, a convenção de um fornecedor sobre quais arquivos pertencem ao servidor e quais pertencem à biblioteca do cliente pode diferir da usada para os pacotes da Oracle. Tentativas de instalar um RPM da Oracle podem resultar em mensagens dizendo que os arquivos do RPM a ser instalado conflitam com arquivos de um pacote instalado.

**Instalando bibliotecas de clientes de várias versões do MySQL.** É possível instalar várias versões de bibliotecas de clientes, como no caso em que você deseja manter a compatibilidade com aplicativos mais antigos vinculados a bibliotecas anteriores. Para instalar uma biblioteca de cliente mais antiga, use a opção `--oldpackage` com **rpm**. Por exemplo, para instalar `mysql-community-libs-5.5` em um sistema EL6 que tem `libmysqlclient.20` do MySQL 5.7, use um comando como este:

```shell
$> rpm --oldpackage -ivh mysql-community-libs-5.5.50-2.el6.x86_64.rpm
```

**Pacote de depuração.** Uma variante especial do MySQL Server compilada com o pacote de depuração foi incluída nos pacotes RPM do servidor. Ela realiza verificações de depuração e alocação de memória e produz um arquivo de registro quando o servidor está em execução. Para usar essa versão de depuração, inicie o MySQL com `/usr/sbin/mysqld-debug`, em vez de iniciá-lo como um serviço ou com `/usr/sbin/mysqld`. Consulte a Seção 5.8.3, “O pacote DBUG”, para as opções de depuração que você pode usar.

::: info Nota
O diretório padrão do plugin para builds de depuração mudou de `/usr/lib64/mysql/plugin` para `/usr/lib64/mysql/plugin/debug` na versão 5.7.21. Anteriormente, era necessário alterar `plugin_dir` para `/usr/lib64/mysql/plugin/debug` para builds de depuração.
:::

**Refazendo RPMs a partir de SRPMs de origem.** Os pacotes de código-fonte SRPM para o MySQL estão disponíveis para download. Eles podem ser usados como estão para reconstruir os RPMs do MySQL com a cadeia de ferramentas padrão **rpmbuild**.

**Senhas de root para versões pré-GA.**

Para o MySQL 5.7.4 e 5.7.5, a senha inicial aleatória do `root` é escrita no arquivo `.mysql_secret` no diretório nomeado pela variável de ambiente `HOME`. Ao tentar acessar o arquivo, tenha em mente que, dependendo do sistema operacional, o uso de um comando como **sudo** pode fazer com que o valor de `HOME` se refira ao diretório de casa do usuário `root` do sistema. O `.mysql_secret` é criado com o modo 600 para ser acessível apenas ao usuário do sistema para o qual foi criado. Antes do MySQL 5.7.4, as contas (incluindo o `root`) criadas nas tabelas de concessão do MySQL para uma instalação RPM inicialmente não têm senhas; após iniciar o servidor, você deve atribuir-lhes senhas usando as instruções na Seção 2.9, “Configuração e Teste Pós-Instalação”.
