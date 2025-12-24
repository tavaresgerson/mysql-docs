### 6.3.3 mysql.server  MySQL Server Startup Script

As distribuições MySQL em Unix e sistemas semelhantes a Unix incluem um script chamado `mysql.server`, que inicia o servidor MySQL usando `mysqld_safe`. Ele pode ser usado em sistemas como Linux e Solaris que usam diretórios de execução do estilo System V para iniciar e parar os serviços do sistema. Ele também é usado pelo item de inicialização do macOS para o MySQL.

`mysql.server` é o nome do script usado na árvore de origem do MySQL. O nome instalado pode ser diferente (por exemplo, `mysqld` ou `mysql`). Na discussão a seguir, ajuste o nome `mysql.server` conforme apropriado para o seu sistema.

::: info Note

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui o suporte do systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nestas plataformas, `mysql.server` e `mysqld_safe` não são instalados porque são desnecessários. Para mais informações, consulte a Seção 2.5.9, Gerenciando o MySQL Server com o systemd.

:::

Para iniciar ou parar o servidor manualmente usando o script `mysql.server`, invoque-o da linha de comando com os argumentos `start` ou `stop`:

```
mysql.server start
mysql.server stop
```

`mysql.server` altera o local para o diretório de instalação do MySQL, em seguida, invoca `mysqld_safe`. Para executar o servidor como algum usuário específico, adicione uma opção `user` apropriada ao grupo `[mysqld]` do arquivo de opções global `/etc/my.cnf`, como mostrado mais adiante nesta seção. (É possível que você deva editar `mysql.server` se você instalou uma distribuição binária do MySQL em um local não padrão. Modifique-o para mudar o local para o diretório apropriado antes de executá-lo `mysqld_safe`. Se você fizer isso, sua versão modificada do `mysql.server` pode ser substituída se você atualizar o MySQL no futuro; faça uma cópia de sua versão editada que você pode reinstalar.)

**mysql.server stop** para o servidor enviando um sinal para ele. Você também pode parar o servidor manualmente executando **mysqladmin shutdown**.

Para iniciar e parar o MySQL automaticamente em seu servidor, você deve adicionar comandos de iniciar e parar para os lugares apropriados em seus arquivos `/etc/rc*`:

- Se você usar o pacote RPM do servidor Linux (`MySQL-server-VERSION.rpm`), ou uma instalação de pacote Linux nativa, o script `mysql.server` pode ser instalado no diretório `/etc/init.d` com o nome `mysqld` ou `mysql`.
- Se você instalar o MySQL a partir de uma distribuição de origem ou usando um formato de distribuição binário que não instala `mysql.server` automaticamente, você pode instalar o script manualmente. Ele pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de origem do MySQL. Copie o script para o diretório `/etc/init.d` com o nome `mysql` e torná-lo executável:

  ```
  cp mysql.server /etc/init.d/mysql
  chmod +x /etc/init.d/mysql
  ```

  Após a instalação do script, os comandos necessários para ativá-lo para ser executado na inicialização do sistema dependem do seu sistema operacional. No Linux, você pode usar **chkconfig**:

  ```
  chkconfig --add mysql
  ```

  Em alguns sistemas Linux, o seguinte comando também parece ser necessário para habilitar completamente o script `mysql`:

  ```
  chkconfig --level 345 mysql on
  ```
- No FreeBSD, os scripts de inicialização geralmente devem ir no `/usr/local/etc/rc.d/`. Instale o `mysql.server` como `/usr/local/etc/rc.d/mysql.server.sh` para habilitar a inicialização automática. A página do manual do `rc(8)` afirma que os scripts neste diretório são executados apenas se seu nome base coincidir com o padrão de nome de arquivo do `*.sh` shell. Quaisquer outros arquivos ou diretórios presentes no diretório são silenciosamente ignorados.
- Como alternativa à configuração anterior, alguns sistemas operacionais também usam `/etc/rc.local` ou `/etc/init.d/boot.local` para iniciar serviços adicionais na inicialização.

  ```
  /bin/sh -c 'cd /usr/local/mysql; ./bin/mysqld_safe --user=mysql &'
  ```
- Para outros sistemas, consulte a documentação do sistema operacional para ver como instalar scripts de inicialização.

`mysql.server` lê as opções das seções `[mysql.server]` e `[mysqld]` dos arquivos de opções. Para compatibilidade com versões anteriores, ele também lê as seções `[mysql_server]`, mas para estar atualizado, você deve renomear essas seções para `[mysql.server]`.

Você pode adicionar opções para `mysql.server` em um arquivo global `/etc/my.cnf`.

```
[mysqld]
datadir=/usr/local/mysql/var
socket=/var/tmp/mysql.sock
port=3306
user=mysql

[mysql.server]
basedir=/usr/local/mysql
```

O script `mysql.server` suporta as opções mostradas na tabela a seguir. Se especificadas, elas *devem* ser colocadas em um arquivo de opções, não na linha de comando. `mysql.server` suporta apenas `start` e `stop` como argumentos de linha de comando.

**Tabela 6.8 mysql.server Opção-Arquivo Opções**

<table><col align="left" style="width: 20%"/><col align="left" style="width: 70%"/><col align="left" style="width: 10%"/><thead><tr><th scope="col">Nome da opção</th> <th scope="col">Descrição</th> <th scope="col">Tipo do produto</th> </tr></thead><tbody><tr><th>[[<code>basedir</code>]]</th> <td>Caminho para o diretório de instalação do MySQL</td> <td>Nome do diretório</td> </tr><tr><th>[[<code>datadir</code>]]</th> <td>Caminho para o diretório de dados MySQL</td> <td>Nome do diretório</td> </tr><tr><th>[[<code>pid-file</code>]]</th> <td>Arquivo no qual o servidor deve escrever o ID do processo</td> <td>Nome do ficheiro</td> </tr><tr><th>[[<code>service-startup-timeout</code>]]</th> <td>Quanto tempo esperar para a inicialização do servidor</td> <td>Número inteiro</td> </tr></tbody></table>

- `basedir=dir_name`

O caminho para o diretório de instalação do MySQL.

- `datadir=dir_name`

O caminho para o diretório de dados MySQL.

- `pid-file=file_name`

O nome de caminho do ficheiro no qual o servidor deve escrever o seu ID de processo. O servidor cria o ficheiro no diretório de dados, a menos que seja dado um nome de caminho absoluto para especificar um diretório diferente.

Se essa opção não for dada, `mysql.server` usa um valor padrão de `host_name.pid`. O valor do arquivo PID passado para `mysqld_safe` substitui qualquer valor especificado no grupo de arquivos de opções `[mysqld_safe]`. Como `mysql.server` lê o grupo de arquivos de opções `[mysqld]` mas não o grupo `[mysqld_safe]`, você pode garantir que `mysqld_safe` receba o mesmo valor quando invocado a partir de `mysql.server` como quando invocado manualmente colocando a mesma configuração `pid-file` em ambos os grupos `[mysqld_safe]` e `[mysqld]` .

- `service-startup-timeout=seconds`

Quanto tempo em segundos para esperar a confirmação da inicialização do servidor. Se o servidor não for iniciado dentro desse tempo, `mysql.server` sairá com um erro. O valor padrão é 900. Um valor de 0 significa não esperar nada para a inicialização. Valores negativos significam esperar para sempre (sem tempo limite).
