### 6.3.3 mysql.server — Script de Inicialização do Servidor MySQL

As distribuições do MySQL em sistemas Unix e similares incluem um script chamado **mysql.server**, que inicia o servidor MySQL usando **mysqld\_safe**. Ele pode ser usado em sistemas como Linux e Solaris que utilizam diretórios de execução estilo System V para iniciar e parar serviços do sistema. Também é usado pelo Item de Inicialização do macOS para MySQL.

**mysql.server** é o nome do script conforme usado dentro da árvore de código-fonte do MySQL. O nome instalado pode ser diferente (por exemplo, **mysqld** ou **mysql**). Na discussão a seguir, ajuste o nome **mysql.server** conforme apropriado para o seu sistema.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, **mysql.server** e **mysqld\_safe** não são instalados porque são desnecessários. Para mais informações, consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com systemd”.

Para iniciar ou parar o servidor manualmente usando o script **mysql.server**, invocá-lo a partir da linha de comando com os argumentos `start` ou `stop`:

```
mysql.server start
mysql.server stop
```

**mysql.server** muda a localização para o diretório de instalação do MySQL, e então invoca **mysqld\_safe**. Para executar o servidor como um usuário específico, adicione uma opção apropriada `user` ao grupo `[mysqld]` do arquivo de opção global `/etc/my.cnf`, conforme mostrado mais adiante nesta seção. (É possível que você precise editar **mysql.server** se você instalou uma distribuição binária do MySQL em um local não padrão. Modifique-o para mudar a localização para o diretório apropriado antes que ele inicie **mysqld\_safe**. Se você fizer isso, sua versão modificada de **mysql.server** pode ser sobrescrita se você atualizar o MySQL no futuro; faça uma cópia da sua versão editada que você pode reinstalar.)

**mysql.server stop** para o servidor parar enviando um sinal para ele. Você também pode parar o servidor manualmente executando **mysqladmin shutdown**.

Para iniciar e parar o MySQL automaticamente no seu servidor, você deve adicionar os comandos de início e parada aos locais apropriados nos seus arquivos `/etc/rc*`:

* Se você usa o pacote RPM do servidor Linux (`MySQL-server-VERSION.rpm`), ou uma instalação de pacote nativo do Linux, o script **mysql.server** pode estar instalado no diretório `/etc/init.d` com o nome `mysqld` ou `mysql`. Veja a Seção 2.5.4, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle”, para mais informações sobre os pacotes RPM do Linux.

* Se você instalar o MySQL a partir de uma distribuição de fonte ou usando um formato de distribuição binária que não instala o **mysql.server** automaticamente, você pode instalar o script manualmente. Ele pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de fonte do MySQL. Copie o script para o diretório `/etc/init.d` com o nome **mysql** e torne-o executável:

  ```
  cp mysql.server /etc/init.d/mysql
  chmod +x /etc/init.d/mysql
  ```

  Após instalar o script, os comandos necessários para ativá-lo para execução no início do sistema dependem do seu sistema operacional. No Linux, você pode usar **chkconfig**:

  ```
  chkconfig --add mysql
  ```

  Em alguns sistemas Linux, o seguinte comando também parece ser necessário para habilitar completamente o script **mysql**:

  ```
  chkconfig --level 345 mysql on
  ```

* No FreeBSD, os scripts de inicialização geralmente devem ir para `/usr/local/etc/rc.d/`. Instale o script `mysql.server` como `/usr/local/etc/rc.d/mysql.server.sh` para habilitar a inicialização automática. A página de manual `rc(8)` afirma que os scripts neste diretório são executados apenas se o nome base corresponder ao padrão de nome de arquivo de shell `*.sh`. Qualquer outro arquivo ou diretório presente dentro do diretório é ignorado silenciosamente.

* Como alternativa à configuração anterior, alguns sistemas operacionais também usam `/etc/rc.local` ou `/etc/init.d/boot.local` para iniciar serviços adicionais ao iniciar o sistema. Para iniciar o MySQL usando esse método, adicione um comando como o seguinte ao arquivo de inicialização apropriado:

  ```
  /bin/sh -c 'cd /usr/local/mysql; ./bin/mysqld_safe --user=mysql &'
  ```

* Para outros sistemas, consulte a documentação do seu sistema operacional para saber como instalar scripts de inicialização.

**mysql.server** lê opções dos seções `[mysql.server]` e `[mysqld]` dos arquivos de opções. Para compatibilidade com versões anteriores, também lê as seções `[mysql_server]`, mas para manter a atualidade, você deve renomear essas seções para `[mysql.server]`.

Você pode adicionar opções para **mysql.server** em um arquivo global `/etc/my.cnf`. Um arquivo `my.cnf` típico pode parecer assim:

```
[mysqld]
datadir=/usr/local/mysql/var
socket=/var/tmp/mysql.sock
port=3306
user=mysql

[mysql.server]
basedir=/usr/local/mysql
```

O script **mysql.server** suporta as opções mostradas na tabela a seguir. Se especificadas, elas *devem* ser colocadas em um arquivo de opções, não na linha de comando. **mysql.server** suporta apenas `start` e `stop` como argumentos de linha de comando.

**Tabela 6.8 mysql.server Opções de Arquivo de Opções**

<table frame="box" rules="all" summary="Opções de arquivo disponíveis para mysql.server">
  <tr>
    <th>Nome da Opção</th>
    <th>Descrição</th>
    <th>Tipo</th>
  </tr>
  <tbody>
    <tr>
      <th><a class="link" href="mysql-server.html#option_mysql_server_basedir"><code>basedir</code></a></th>
      <td>Caminho para o diretório de instalação do MySQL</td>
      <td>Nome do diretório</td>
    </tr>
    <tr>
      <th><a class="link" href="mysql-server.html#option_mysql_server_datadir"><code>datadir</code></a></th>
      <td>Caminho para o diretório de dados do MySQL</td>
      <td>Nome do diretório</td>
    </tr>
    <tr>
      <th><a class="link" href="mysql-server.html#option_mysql_server_pid-file"><code>pid-file</code></a></th>
      <td>Nome do arquivo no qual o servidor deve gravar seu ID de processo</td>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th><a class="link" href="mysql-server.html#option_mysql_server_service-startup-timeout"><code>service-startup-timeout</code></a></th>
      <td>Tempo de espera para o início do servidor</td>
      <td>Inteiro</td>
    </tr>
  </tbody>
</table>

* `basedir=dir_name`

  O caminho para o diretório de instalação do MySQL.

* `datadir=dir_name`

  O caminho para o diretório de dados do MySQL.

* `pid-file=file_name`

  O nome do caminho do arquivo no qual o servidor deve gravar seu ID de processo. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Se essa opção não for fornecida, o **mysql.server** usa um valor padrão de `host_name.pid`. O valor do arquivo PID passado para **mysqld_safe** substitui qualquer valor especificado no grupo de opções `[mysqld_safe]`. Como o **mysql.server** lê o grupo de opções `[mysqld]` mas não o grupo `[mysqld_safe]`, você pode garantir que **mysqld_safe** receba o mesmo valor quando invocado a partir do **mysql.server** como quando invocado manualmente colocando o mesmo conjunto de configuração `pid-file` nos grupos `[mysqld_safe]` e `[mysqld]`.

* `service-startup-timeout=segundos`

  Quanto tempo em segundos para esperar a confirmação da inicialização do servidor. Se o servidor não iniciar dentro desse tempo, o **mysql.server** sai com um erro. O valor padrão é 900. Um valor de 0 significa não esperar para a inicialização. Valores negativos significam esperar para sempre (sem limite de tempo).