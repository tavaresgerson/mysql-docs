### 2.5.4 Instalar o MySQL no Linux usando pacotes RPM da Oracle

A maneira recomendada de instalar o MySQL em distribuições Linux baseadas em RPM é usando os pacotes RPM fornecidos pela Oracle.

- Dos repositórios de software MySQL:

  - O repositório MySQL Yum (ver Seção 2.5.1, Instalar MySQL no Linux Usando o Repositório MySQL Yum para detalhes).
  - O repositório MySQL SLES (ver Secção 2.5.3, "Utilizar o repositório MySQL SLES" para mais detalhes).
- A partir da página \[Download MySQL Community Server] (<https://dev.mysql.com/downloads/mysql/>) na MySQL Developer Zone.

::: info Note

As distribuições RPM do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir daquelas construídas pela Oracle em recursos, recursos e convenções (incluindo configuração de comunicação), e que as instruções de instalação neste manual não se aplicam necessariamente a elas. As instruções do fornecedor devem ser consultadas em vez disso.

:::

#### Pacotes de RPM do MySQL

**Tabela 2.10 Pacotes RPM para a Edição Comunitária do MySQL**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Nome da embalagem</th> <th>Resumo</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>mysql-community-test</code>]</td> <td>Aplicativos e ferramentas de cliente MySQL</td> </tr><tr> <td>[[PH_HTML_CODE_<code>mysql-community-test</code>]</td> <td>Plugins compartilhados para aplicações cliente MySQL</td> </tr><tr> <td>[[PH_HTML_CODE_<code>debuginfo</code>]</td> <td>Arquivos comuns para bibliotecas de servidor e cliente</td> </tr><tr> <td>[[<code>mysql-community-devel</code>]]</td> <td>Arquivos de cabeçalho de desenvolvimento e bibliotecas para aplicações cliente de banco de dados MySQL</td> </tr><tr> <td>[[<code>mysql-community-embedded-compat</code>]]</td> <td>Servidor MySQL como uma biblioteca incorporada com compatibilidade para aplicações usando a versão 18 da biblioteca</td> </tr><tr> <td>[[<code>mysql-community-icu-data-files</code>]]</td> <td>Embalagem MySQL de arquivos de dados da UTI necessários para expressões regulares MySQL</td> </tr><tr> <td>[[<code>mysql-community-libs</code>]]</td> <td>Bibliotecas compartilhadas para aplicações cliente de banco de dados MySQL</td> </tr><tr> <td>[[<code>mysql-community-libs-compat</code>]]</td> <td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL; apenas presentes se as versões anteriores do MySQL forem suportadas pela plataforma</td> </tr><tr> <td>[[<code>mysql-community-server</code>]]</td> <td>Servidor de base de dados e ferramentas relacionadas</td> </tr><tr> <td>[[<code>mysql-community-server-debug</code>]]</td> <td>Servidor de depuração e binários de plugins</td> </tr><tr> <td>[[<code>mysql-community-test</code>]]</td> <td>Suíte de testes para o servidor MySQL</td> </tr><tr> <td>[[<code>mysql-community-client-plugins</code><code>mysql-community-test</code>]</td> <td>O código fonte RPM parece semelhante ao mysql-community-8.4.6-1.el7.src.rpm, dependendo do sistema operacional selecionado</td> </tr><tr> <td>Informações adicionais de depuração</td> <td>Existem vários pacotes [[<code>debuginfo</code>]]: mysql-community-client-debuginfo, mysql-community-libs-debuginfo mysql-community-server-debug-debuginfo mysql-community-server-debuginfo, e mysql-community-test-debuginfo.</td> </tr></tbody></table>

**Tabela 2.11 Pacotes RPM para a Edição Empresarial do MySQL**

<table frame="all"><col style="width: 35%"/><col style="width: 25%"/><thead><tr> <th>Nome da embalagem</th> <th>Resumo</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>mysql-commercial-test</code>]</td> <td>Backup Empresarial do MySQL</td> </tr><tr> <td>[[PH_HTML_CODE_<code>mysql-commercial-test</code>]</td> <td>Aplicativos e ferramentas de cliente MySQL</td> </tr><tr> <td>[[<code>mysql-commercial-client-plugins</code>]]</td> <td>Plugins compartilhados para aplicações cliente MySQL</td> </tr><tr> <td>[[<code>mysql-commercial-common</code>]]</td> <td>Arquivos comuns para bibliotecas de servidor e cliente</td> </tr><tr> <td>[[<code>mysql-commercial-devel</code>]]</td> <td>Arquivos de cabeçalho de desenvolvimento e bibliotecas para aplicações cliente de banco de dados MySQL</td> </tr><tr> <td>[[<code>mysql-commercial-embedded-compat</code>]]</td> <td>Servidor MySQL como uma biblioteca incorporada com compatibilidade para aplicações usando a versão 18 da biblioteca</td> </tr><tr> <td>[[<code>mysql-commercial-icu-data-files</code>]]</td> <td>Embalagem MySQL de arquivos de dados da UTI necessários para expressões regulares MySQL</td> </tr><tr> <td>[[<code>mysql-commercial-libs</code>]]</td> <td>Bibliotecas compartilhadas para aplicações cliente de banco de dados MySQL</td> </tr><tr> <td>[[<code>mysql-commercial-libs-compat</code>]]</td> <td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL; apenas presentes se as versões anteriores do MySQL forem suportadas pela plataforma. A versão das bibliotecas corresponde à versão das bibliotecas instaladas por padrão pela distribuição que você está usando.</td> </tr><tr> <td>[[<code>mysql-commercial-server</code>]]</td> <td>Servidor de base de dados e ferramentas relacionadas</td> </tr><tr> <td>[[<code>mysql-commercial-test</code>]]</td> <td>Suíte de testes para o servidor MySQL</td> </tr><tr> <td>Informações adicionais de depuração</td> <td>Existem vários pacotes [[<code>mysql-commercial-client</code><code>mysql-commercial-test</code>]: mysql-commercial-client-debuginfo, mysql-commercial-libs-debuginfo mysql-commercial-server-debug-debuginfo mysql-commercial-server-debuginfo, e mysql-commercial-test-debuginfo.</td> </tr></tbody></table>

Os nomes completos dos RPMs têm a seguinte sintaxe:

```
packagename-version-distribution-arch.rpm
```

Os valores `distribution` e `arch` indicam a distribuição Linux e o tipo de processador para o qual o pacote foi construído.

**Tabela 2.12 Identificadores de distribuição de pacotes RPM do MySQL Linux**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Valor de distribuição</th> <th>Utilização prevista</th> </tr></thead><tbody><tr> <td>o<em class="replaceable">[[<code>{version}</code>]]</em>em que<em class="replaceable">[[<code>{version}</code>]]</em>é a principal versão do Enterprise Linux, como [[<code>el8</code>]]</td> <td>Plataformas baseadas em EL6 (8.0), EL7, EL8, EL9 e EL10 (por exemplo, as versões correspondentes de Oracle Linux, Red Hat Enterprise Linux e CentOS)</td> </tr><tr> <td>fc<em class="replaceable">[[<code>{version}</code>]]</em>em que<em class="replaceable">[[<code>{version}</code>]]</em>é a versão principal do Fedora, como [[<code>fc37</code>]]</td> <td>Fedora 41 e 42</td> </tr><tr> <td>[[<code>sl5</code>]]</td> <td>SUSE Linux Enterprise Server 15 (em inglês)</td> </tr></tbody></table>

Para ver todos os arquivos em um pacote RPM (por exemplo, `mysql-community-server`), use o seguinte comando:

```
$> rpm -qpl mysql-community-server-version-distribution-arch.rpm
```

- A discussão no resto desta seção aplica-se apenas a um processo de instalação usando os pacotes RPM baixados diretamente do Oracle, em vez de através de um repositório MySQL. \*

Existem relações de dependência entre alguns dos pacotes. Se você planeja instalar muitos dos pacotes, você pode baixar o arquivo **tar** do pacote RPM, que contém todos os pacotes RPM listados acima, para que você não precise baixá-los separadamente.

Na maioria dos casos, você precisa instalar os pacotes `mysql-community-server`, `mysql-community-client`, `mysql-community-client-plugins`, `mysql-community-libs`, `mysql-community-icu-data-files`, `mysql-community-common`, e `mysql-community-libs-compat` para obter uma instalação padrão e funcional do MySQL. Para executar essa instalação padrão e básica, acesse a pasta que contém todos esses pacotes (e, de preferência, nenhum outro pacote RPM com nomes semelhantes) e emita o seguinte comando:

```
$> sudo yum install mysql-community-{server,client,client-plugins,icu-data-files,common,libs}-*
```

Substitua **yum** por **zypper** para SLES, e por **dnf** para Fedora.

Embora seja muito preferível usar uma ferramenta de gerenciamento de pacotes de alto nível como **yum** para instalar os pacotes, os usuários que preferem comandos diretos **rpm** podem substituir o comando **yum install** pelo comando **rpm -Uvh**; no entanto, usar **rpm -Uvh** em vez disso torna o processo de instalação mais propenso a falhas, devido a possíveis problemas de dependência que o processo de instalação pode encontrar.

Para instalar apenas os programas cliente, você pode pular `mysql-community-server` na sua lista de pacotes para instalar; emitir o seguinte comando:

```
$> sudo yum install mysql-community-{client,client-plugins,common,libs}-*
```

Substitua **yum** por **zypper** para SLES, e por **dnf** para Fedora.

Uma instalação padrão do MySQL usando os pacotes RPM resulta em arquivos e recursos criados sob os diretórios do sistema, mostrados na tabela a seguir.

**Tabela 2.13 Layout de Instalação do MySQL para Pacotes RPM Linux da MySQL Developer Zone**

<table><col style="width: 55%"/><col style="width: 45%"/><thead><tr> <th>Arquivos ou Recursos</th> <th>Localização</th> </tr></thead><tbody><tr> <td>Programas e scripts de cliente</td> <td>[[PH_HTML_CODE_<code>mysqld</code>]</td> </tr><tr> <td><span><strong>- Não ,</strong></span>servidor</td> <td>[[PH_HTML_CODE_<code>mysqld</code>]</td> </tr><tr> <td>Arquivo de configuração</td> <td>[[PH_HTML_CODE_<code> /var/run/mysql/mysqld.pid</code>]</td> </tr><tr> <td>Repertório de dados</td> <td>[[PH_HTML_CODE_<code>/var/lib/mysql/mysql.sock</code>]</td> </tr><tr> <td>Arquivo de registo de erros</td> <td><p>Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: [[PH_HTML_CODE_<code>/var/lib/mysql-keyring</code>]</p><p>Para SLES: [[PH_HTML_CODE_<code>/usr/share/man</code>]</p></td> </tr><tr> <td>Valor de [[PH_HTML_CODE_<code>/usr/include/mysql</code>]</td> <td>[[PH_HTML_CODE_<code>/usr/lib/mysql</code>]</td> </tr><tr> <td>Escrito de inicialização do sistema V</td> <td><p>Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: [[PH_HTML_CODE_<code>/usr/share/mysql</code>]</p><p>Para SLES: [[<code>/etc/init.d/mysql</code>]]</p></td> </tr><tr> <td>Serviço Systemd</td> <td><p>Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: [[<code>mysqld</code>]]</p><p>Para SLES: [[<code>/usr/sbin</code><code>mysqld</code>]</p></td> </tr><tr> <td>Arquivo Pid</td> <td>[[<code> /var/run/mysql/mysqld.pid</code>]]</td> </tr><tr> <td>Porta de alimentação</td> <td>[[<code>/var/lib/mysql/mysql.sock</code>]]</td> </tr><tr> <td>Guia de chaveiros</td> <td>[[<code>/var/lib/mysql-keyring</code>]]</td> </tr><tr> <td>Páginas do manual do Unix</td> <td>[[<code>/usr/share/man</code>]]</td> </tr><tr> <td>Incluir arquivos de cabeçalho</td> <td>[[<code>/usr/include/mysql</code>]]</td> </tr><tr> <td>Bibliotecas</td> <td>[[<code>/usr/lib/mysql</code>]]</td> </tr><tr> <td>Arquivos de suporte diversos (por exemplo, mensagens de erro e arquivos de conjuntos de caracteres)</td> <td>[[<code>/usr/share/mysql</code>]]</td> </tr></tbody></table>

A instalação também cria um usuário chamado `mysql` e um grupo chamado `mysql` no sistema.

::: info Notes

- O usuário `mysql` é criado usando as opções `-r` e `-s /bin/false` do comando **useradd**, para que ele não tenha permissões de login para o seu servidor host (veja Criando o usuário e grupo mysql para detalhes). Para mudar para o usuário `mysql` em seu sistema operacional, use a opção `--shell=/bin/bash` para o comando **su**:

  ```
  $> su - mysql --shell=/bin/bash
  ```
- A instalação de versões anteriores do MySQL usando pacotes mais antigos pode ter criado um arquivo de configuração chamado `/usr/my.cnf`. É altamente recomendável que você examine o conteúdo do arquivo e migre as configurações desejadas para o arquivo `/etc/my.cnf` e remova `/usr/my.cnf`.

:::

O MySQL NÃO é iniciado automaticamente no final do processo de instalação. Para sistemas Red Hat Enterprise Linux, Oracle Linux, CentOS e Fedora, use o seguinte comando para iniciar o MySQL:

```
$> systemctl start mysqld
```

Para os sistemas SLES, o comando é o mesmo, mas o nome do serviço é diferente:

```
$> systemctl start mysql
```

Se o sistema operacional estiver habilitado, os comandos padrão \*\* systemctl \*\* (ou, alternativamente, \*\* service \*\* com os argumentos invertidos) como \*\* stop \*\*, \*\* start \*\*, \*\* status \*\* e \*\* restart \*\* devem ser usados para gerenciar o serviço do servidor MySQL. O serviço `mysqld` está habilitado por padrão e inicia-se na reinicialização do sistema. Observe que certas coisas podem funcionar de forma diferente nas plataformas systemd: por exemplo, mudar o local do diretório de dados pode causar problemas.

Durante uma instalação de atualização usando pacotes RPM e DEB, se o servidor MySQL estiver em execução quando a atualização ocorrer, o servidor MySQL será parado, a atualização ocorrerá e o servidor MySQL será reiniciado.

Na inicialização inicial do servidor, acontece o seguinte, dado que o diretório de dados do servidor está vazio:

- O servidor está inicializado.
- Um certificado SSL e arquivos de chave são gerados no diretório de dados.
- O `validate_password` está instalado e ativado.
- Uma conta de superusuário `'root'@'localhost'` é criada. Uma senha para o superusuário é definida e armazenada no arquivo de registro de erros. Para revelá-la, use o seguinte comando para sistemas RHEL, Oracle Linux, CentOS e Fedora:

  ```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```

  Utilize o seguinte comando para os sistemas SLES:

  ```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```

  O próximo passo é fazer login com a senha temporária gerada e definir uma senha personalizada para a conta do superusuário:

```
$> mysql -uroot -p
```

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

::: info Note

A política de senha padrão implementada por PH exige que as senhas contenham pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial, e que o comprimento total da senha seja de pelo menos 8 caracteres.

:::

Se algo der errado durante a instalação, você pode encontrar informações de depuração no arquivo de registro de erros `/var/log/mysqld.log`.

Para algumas distribuições Linux, pode ser necessário aumentar o limite de número de descritores de arquivos disponíveis para **mysqld**. Ver Seção B.3.2.16, "File Not Found and Similar Errors"

É possível instalar várias versões de bibliotecas de clientes, como no caso de você querer manter a compatibilidade com aplicativos mais antigos vinculados a bibliotecas anteriores. Para instalar uma biblioteca de clientes mais antiga, use a opção `--oldpackage` com **rpm**. Por exemplo, para instalar `mysql-community-libs-5.5` em um sistema EL6 que tem `libmysqlclient.21` do MySQL 8.0, use um comando como este:

```
$> rpm --oldpackage -ivh mysql-community-libs-5.5.50-2.el6.x86_64.rpm
```

\*\* Pacote de depuração. \*\* Uma variante especial do MySQL Server compilado com o pacote de depuração foi incluída nos pacotes RPM do servidor. Ele executa depuração e verifica a alocação de memória e produz um arquivo de rastreamento quando o servidor está em execução. Para usar essa versão de depuração, inicie o MySQL com `/usr/sbin/mysqld-debug`, em vez de iniciá-lo como um serviço ou com `/usr/sbin/mysqld`.

::: info Note

O diretório do plugin padrão é `/usr/lib64/mysql/plugin/debug` e é configurável com `plugin_dir`.

:::

\*\* Reconstrução de RPMs a partir de SRPMs de origem. \*\* Pacotes de código fonte SRPM para MySQL estão disponíveis para download. Eles podem ser usados como estão para reconstruir os RPMs do MySQL com a cadeia de ferramentas padrão \*\* rpmbuild \*\*.
