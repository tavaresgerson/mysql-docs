### 2.5.4 Instalando o MySQL no Linux Usando Pacotes RPM da Oracle

A maneira recomendada para instalar o MySQL em distribuições Linux baseadas em RPM é usando os pacotes RPM fornecidos pela Oracle. Existem duas fontes para obtê-los, para a Edição Comunitária do MySQL:

* Dos repositórios de software MySQL:

  + O repositório MySQL Yum (consulte a Seção 2.5.1, “Instalando o MySQL no Linux Usando o Repositório MySQL Yum” para detalhes).
  + O repositório SLES MySQL (consulte a Seção 2.5.3, “Usando o Repositório SLES MySQL” para detalhes).
[Página do MySQL Community Server para download](https://dev.mysql.com/downloads/mysql/) na Zona de Desenvolvimento do MySQL.

::: info Nota

Distribuições RPM do MySQL também são fornecidas por outros fornecedores. Esteja ciente de que elas podem diferir das construídas pela Oracle em termos de recursos, capacidades e convenções (incluindo configuração de comunicação), e que as instruções de instalação neste manual não se aplicam necessariamente a elas. As instruções do fornecedor devem ser consultadas.

:::

#### Pacotes RPM do MySQL

**Tabela 2.10 Pacotes RPM para a Edição Comunitária do MySQL**

<table><thead><tr> <th>Nome do Pacote</th> <th>Resumo</th> </tr></thead><tbody><tr> <td><code>mysql-community-client</code></td> <td>Aplicativos e ferramentas do cliente MySQL</td> </tr><tr> <td><code>mysql-community-client-plugins</code></td> <td>Plugins compartilhados para aplicativos do cliente MySQL</td> </tr><tr> <td><code>mysql-community-common</code></td> <td>Arquivos comuns para bibliotecas de servidor e cliente</td> </tr><tr> <td><code>mysql-community-devel</code></td> <td>Arquivos de cabeçalho e bibliotecas de desenvolvimento para aplicativos de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-community-embedded-compat</code></td> <td>Servidor MySQL como uma biblioteca embutida com compatibilidade para aplicativos que usam a versão 18 da biblioteca</td> </tr><tr> <td><code>mysql-community-icu-data-files</code></td> <td>Pacote MySQL de arquivos de dados ICU necessários para expressões regulares MySQL</td> </tr><tr> <td><code>mysql-community-libs</code></td> <td>Bibliotecas compartilhadas para aplicativos de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-community-libs-compat</code></td> <td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL; apenas presentes se as versões anteriores do MySQL forem suportadas pela plataforma</td> </tr><tr> <td><code>mysql-community-server</code></td> <td>Servidor de banco de dados e ferramentas relacionadas</td> </tr><tr> <td><code>mysql-community-server-debug</code></td> <td>Binários do servidor e plugins de depuração</td> </tr><tr> <td><code>mysql-community-test</code></td> <td>Conjunto de testes para o servidor MySQL</td> </tr><tr> <td><code>mysql-community</code></td> <td>O código-fonte RPM do mysql-community-8.4.6-1.el7.src.rpm é semelhante ao mysql-community-8.4.6-1.el7.src.rpm, dependendo do sistema operacional selecionado</td> </tr><tr> <td>RPMs adicionais de <code>debuginfo</code></td> <td>Existem vários pacotes <code>debuginfo</code>: <code>mysql-community-client-debuginfo</code>, <code>mysql-community-libs-debuginfo</code> <code>mysql-community-server-debug-debuginfo</code> <code>mysql-community-server-debuginfo</code> e <code>mysql-community-test-debuginfo</code>.</td> </tr></tbody></table>

**Tabela 2.11 Pacotes RPM para a Edição Empresarial do MySQL**

<table><thead><tr> <th>Nome do Pacote</th> <th>Resumo</th> </tr></thead><tbody><tr> <td><code>mysql-commercial-backup</code></td> <td>MySQL Enterprise Backup</td> </tr><tr> <td><code>mysql-commercial-client</code></td> <td>Aplicativos e ferramentas de cliente MySQL</td> </tr><tr> <td><code>mysql-commercial-client-plugins</code></td> <td>Plugins compartilhados para aplicativos de cliente MySQL</td> </tr><tr> <td><code>mysql-commercial-common</code></td> <td>Arquivos comuns para bibliotecas de servidor e cliente</td> </tr><tr> <td><code>mysql-commercial-devel</code></td> <td>Arquivos de cabeçalho e bibliotecas de desenvolvimento para aplicativos de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-commercial-embedded-compat</code></td> <td>Servidor MySQL como uma biblioteca embutida com compatibilidade para aplicativos que usam a versão 18 da biblioteca</td> </tr><tr> <td><code>mysql-commercial-icu-data-files</code></td> <td>Pacote MySQL de arquivos de dados ICU necessários para expressões regulares MySQL</td> </tr><tr> <td><code>mysql-commercial-libs</code></td> <td>Bibliotecas compartilhadas para aplicativos de cliente de banco de dados MySQL</td> </tr><tr> <td><code>mysql-commercial-libs-compat</code></td> <td>Bibliotecas de compatibilidade compartilhadas para instalações anteriores do MySQL; apenas presentes se as versões anteriores do MySQL forem suportadas pela plataforma. A versão das bibliotecas corresponde à versão das bibliotecas instaladas por padrão pela distribuição que você está usando.</td> </tr><tr> <td><code>mysql-commercial-server</code></td> <td>Servidor de banco de dados e ferramentas relacionadas</td> </tr><tr> <td><code>mysql-commercial-test</code></td> <td>Conjunto de testes para o servidor MySQL</td> </tr><tr> <td>RPMs adicionais de *debuginfo*</td> <td>Existem vários pacotes <code>debuginfo</code>: <code>mysql-commercial-client-debuginfo</code>, <code>mysql-commercial-libs-debuginfo</code> <code>mysql-commercial-server-debug-debuginfo</code> <code>mysql-commercial-server-debuginfo</code> e <code>mysql-commercial-test-debuginfo</code>.</td> </tr></tbody></table>

Os nomes completos dos RPM têm a seguinte sintaxe:

```
packagename-version-distribution-arch.rpm
```

Os valores de *`distribution`* e *`arch`* indicam a distribuição Linux e o tipo de processador para o qual o pacote foi construído. Veja a tabela abaixo para listas dos identificadores de distribuição:

**Tabela 2.12 Identificadores de Distribuição de Pacotes RPM de MySQL Linux**

<table><thead><tr> <th>Valor da Distribuição</th> <th>Uso Pretendido</th> </tr></thead><tbody><tr> <td>el<em><code>{version}</code></em> onde <em><code>{version}</code></em> é a versão principal da Enterprise Linux, como <code>el8</code></td> <td>Plataformas baseadas em EL6 (8.0), EL7, EL8, EL9 e EL10, como as versões correspondentes do Oracle Linux, Red Hat Enterprise Linux e CentOS</td> </tr><tr> <td>fc<em><code>{version}</code></em> onde <em><code>{version}</code></em> é a versão principal do Fedora, como <code>fc37</code></td> <td>Fedora 41 e 42</td> </tr><tr> <td><code>sl5</code></td> <td>SUSE Linux Enterprise Server 15</td> </tr></tbody></table>

Para ver todos os arquivos de um pacote RPM (por exemplo, `mysql-community-server`), use o seguinte comando:

```
$> rpm -qpl mysql-community-server-version-distribution-arch.rpm
```

*A discussão no restante desta seção aplica-se apenas a um processo de instalação usando os pacotes RPM baixados diretamente da Oracle, em vez de através de um repositório do MySQL.*

Existem relações de dependência entre alguns dos pacotes. Se você planeja instalar muitos dos pacotes, talvez queira baixar o arquivo `tar` do pacote RPM em bundle, que contém todos os pacotes RPM listados acima, para que você não precise baixá-los separadamente.

Na maioria dos casos, você precisa instalar os pacotes `mysql-community-server`, `mysql-community-client`, `mysql-community-client-plugins`, `mysql-community-libs`, `mysql-community-icu-data-files`, `mysql-community-common` e `mysql-community-libs-compat` para obter uma instalação funcional e padrão do MySQL. Para realizar uma instalação padrão e básica, vá para a pasta que contém todos esses pacotes (e, de preferência, nenhum outro pacote RPM com nomes semelhantes) e execute o seguinte comando:

```
$> sudo yum install mysql-community-{server,client,client-plugins,icu-data-files,common,libs}-*
```

Substitua `yum` por `zypper` para SLES e por `dnf` para Fedora.

Embora seja muito preferível usar uma ferramenta de gerenciamento de pacotes de alto nível como `yum` para instalar os pacotes, os usuários que preferem comandos diretos de `rpm` podem substituir o comando `yum install` pelo comando `rpm -Uvh`; no entanto, usar `rpm -Uvh` torna o processo de instalação mais propenso a falhas, devido a potenciais problemas de dependência que o processo de instalação pode encontrar.

Para instalar apenas os programas cliente, você pode pular `mysql-community-server` na sua lista de pacotes a serem instalados; execute o seguinte comando:

```
$> sudo yum install mysql-community-{client,client-plugins,common,libs}-*
```

Substitua `yum` por `zypper` para SLES e por `dnf` para Fedora.

Uma instalação padrão do MySQL usando os pacotes RPM resulta em arquivos e recursos criados sob os diretórios do sistema, mostrados na tabela a seguir.

**Tabela 2.13 Layout de Instalação do MySQL para Pacotes RPM do MySQL Developer Zone para Linux**

<table><thead><tr> <th>Arquivos ou Recursos</th> <th>Localização</th> </tr></thead><tbody><tr> <td>Programas e scripts do cliente</td> <td><code>/usr/bin</code></td> </tr><tr> <td>Servidor <code>mysqld</code></td> <td><code>/usr/sbin</code></td> </tr><tr> <td>Arquivo de configuração</td> <td><code>/etc/my.cnf</code></td> </tr><tr> <td>Diretório de dados</td> <td><code>/var/lib/mysql</code></td> </tr><tr> <td>Arquivo de log de erro</td> <td><p> Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>/var/log/mysqld.log</code> </p><p> Para SLES: <code>/var/log/mysql/mysqld.log</code> </p></td> </tr><tr> <td>Valor de <code>secure_file_priv</code></td> <td><code>/var/lib/mysql-files</code></td> </tr><tr> <td>Script de inicialização System V</td> <td><p> Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>/etc/init.d/mysqld</code> </p><p> Para SLES: <code>/etc/init.d/mysql</code> </p></td> </tr><tr> <td>Serviço Systemd</td> <td><p> Para plataformas RHEL, Oracle Linux, CentOS ou Fedora: <code>mysqld</code> </p><p> Para SLES: <code>mysql</code> </p></td> </tr><tr> <td>Arquivo de PID</td> <td><code> /var/run/mysql/mysqld.pid</code></td> </tr><tr> <td>Soquete</td> <td><code>/var/lib/mysql/mysql.sock</code></td> </tr><tr> <td>Diretório de chaveiro</td> <td><code>/var/lib/mysql-keyring</code></td> </tr><tr> <td>Páginas do manual do Unix</td> <td><code>/usr/share/man</code></td> </tr><tr> <td>Arquivos de cabeçalho (incluídos)</td> <td><code>/usr/include/mysql</code></td> </tr><tr> <td>Bibliotecas</td> <td><code>/usr/lib/mysql</code></td> </tr><tr> <td>Arquivos de suporte diversos (por exemplo, mensagens de erro e arquivos de conjunto de caracteres)</td> <td><code>/usr/share/mysql</code></td> </tr></tbody></table>

A instalação também cria um usuário chamado `mysql` e um grupo chamado `mysql` no sistema.

::: info Notas
O usuário e o grupo `mysql` são criados no sistema.

* O usuário `mysql` é criado usando as opções `-r` e `-s /bin/false` do comando `useradd`, para que ele não tenha permissões de login no seu host do servidor (consulte Criando o usuário e o grupo mysql para detalhes). Para alternar para o usuário `mysql` no seu sistema operacional, use a opção `--shell=/bin/bash` para o comando `su`:

  ```
  $> su - mysql --shell=/bin/bash
  ```9ONbFMmtdL
Para sistemas SLES, o comando é o mesmo, mas o nome do serviço é diferente:

```
$> systemctl start mysqld
```qhTVtC82gl```
$> systemctl start mysql
```RfbtQhuVvS```
  $> sudo grep 'temporary password' /var/log/mysqld.log
  ```1JAjS1fnw1```
  $> sudo grep 'temporary password' /var/log/mysql/mysqld.log
  ```UDOBPg3MKX```
$> mysql -uroot -p
```jsHI5JW4cM```

**Pacote de depuração.** Uma variante especial do MySQL Server compilada com o pacote de depuração foi incluída nos pacotes RPM do servidor. Ela realiza verificações de depuração e alocação de memória e produz um arquivo de registro quando o servidor está em execução. Para usar essa versão de depuração, inicie o MySQL com `/usr/sbin/mysqld-debug`, em vez de iniciá-lo como serviço ou com `/usr/sbin/mysqld`.

::: info Nota

O diretório padrão do plugin é `/usr/lib64/mysql/plugin/debug` e pode ser configurado com `plugin_dir`.

:::

**Reestruturação dos pacotes RPM a partir de SRPMs de código-fonte.** Os pacotes SRPM de código-fonte do MySQL estão disponíveis para download. Eles podem ser usados como estão para reconstruir os pacotes RPM do MySQL com a cadeia de ferramentas padrão `rpmbuild`.