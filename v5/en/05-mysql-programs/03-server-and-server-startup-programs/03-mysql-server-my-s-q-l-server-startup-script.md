### 4.3.3 mysql.server — Script de Inicialização do MySQL Server

As distribuições MySQL em sistemas Unix e do tipo Unix incluem um script chamado **mysql.server**, que inicia o MySQL Server usando **mysqld_safe**. Ele pode ser usado em sistemas como Linux e Solaris que utilizam diretórios de execução (run directories) no estilo System V para iniciar e parar serviços de sistema. Ele também é usado pelo Item de Inicialização (Startup Item) do macOS para MySQL.

**mysql.server** é o nome do script conforme usado dentro da árvore de código-fonte do MySQL. O nome instalado pode ser diferente (por exemplo, **mysqld** ou **mysql**). Na discussão a seguir, ajuste o nome **mysql.server** conforme apropriado para o seu sistema.

Nota

Em algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte a systemd para gerenciar a inicialização e o encerramento do MySQL Server. Nessas plataformas, **mysql.server** e **mysqld_safe** não são instalados porque são desnecessários. Para mais informações, consulte a Seção 2.5.10, “Gerenciando o MySQL Server com systemd”.

Para iniciar ou parar o Server manualmente usando o script **mysql.server**, invoque-o a partir da linha de comando com os argumentos `start` ou `stop`:

```sql
mysql.server start
mysql.server stop
```

**mysql.server** muda o local para o diretório de instalação do MySQL e, em seguida, invoca **mysqld_safe**. Para executar o Server como um usuário específico, adicione uma opção `user` apropriada ao grupo `[mysqld]` do option file global `/etc/my.cnf`, conforme mostrado mais adiante nesta seção. (É possível que você precise editar **mysql.server** se tiver instalado uma distribuição binária do MySQL em um local não padrão. Modifique-o para mudar o local para o diretório apropriado antes que ele execute **mysqld_safe**. Se você fizer isso, sua versão modificada de **mysql.server** poderá ser sobrescrita se você atualizar o MySQL no futuro; faça uma cópia da sua versão editada que você possa reinstalar.)

**mysql.server stop** para o Server enviando um sinal a ele. Você também pode parar o Server manualmente executando **mysqladmin shutdown**.

Para iniciar e parar o MySQL automaticamente no seu Server, você deve adicionar comandos de início e parada aos locais apropriados nos seus arquivos `/etc/rc*`:

* Se você usa o pacote RPM do Server Linux (`MySQL-server-VERSION.rpm`), ou uma instalação de pacote Linux nativa, o script **mysql.server** pode estar instalado no diretório `/etc/init.d` com o nome `mysqld` ou `mysql`. Consulte a Seção 2.5.5, “Instalando MySQL no Linux Usando Pacotes RPM da Oracle”, para obter mais informações sobre os pacotes RPM para Linux.

* Se você instalar o MySQL a partir de uma distribuição de código-fonte ou usando um formato de distribuição binária que não instala o **mysql.server** automaticamente, você pode instalar o script manualmente. Ele pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de código-fonte do MySQL. Copie o script para o diretório `/etc/init.d` com o nome **mysql** e torne-o executável:

  ```sql
  cp mysql.server /etc/init.d/mysql
  chmod +x /etc/init.d/mysql
  ```

  Após instalar o script, os comandos necessários para ativá-lo para ser executado na inicialização do sistema (system startup) dependem do seu sistema operacional. No Linux, você pode usar **chkconfig**:

  ```sql
  chkconfig --add mysql
  ```

  Em alguns sistemas Linux, o seguinte comando também parece ser necessário para habilitar totalmente o script **mysql**:

  ```sql
  chkconfig --level 345 mysql on
  ```

* No FreeBSD, os scripts de inicialização (startup scripts) geralmente devem ir para `/usr/local/etc/rc.d/`. Instale o script `mysql.server` como `/usr/local/etc/rc.d/mysql.server.sh` para habilitar a inicialização automática. A página de manual `rc(8)` declara que os scripts neste diretório são executados apenas se seu nome base corresponder ao padrão de nome de arquivo shell `*.sh`. Quaisquer outros arquivos ou diretórios presentes no diretório são silenciosamente ignorados.

* Como alternativa à configuração anterior, alguns sistemas operacionais também usam `/etc/rc.local` ou `/etc/init.d/boot.local` para iniciar serviços adicionais na inicialização. Para iniciar o MySQL usando este método, anexe um comando como o seguinte ao arquivo de inicialização apropriado:

  ```sql
  /bin/sh -c 'cd /usr/local/mysql; ./bin/mysqld_safe --user=mysql &'
  ```

* Para outros sistemas, consulte a documentação do seu sistema operacional para ver como instalar scripts de inicialização.

**mysql.server** lê opções das seções `[mysql.server]` e `[mysqld]` dos option files. Para compatibilidade retroativa, ele também lê seções `[mysql_server]`, mas para estar atualizado, você deve renomear essas seções para `[mysql.server]`.

Você pode adicionar opções para **mysql.server** em um arquivo global `/etc/my.cnf`. Um arquivo `my.cnf` típico pode ser parecido com isto:

```sql
[mysqld]
datadir=/usr/local/mysql/var
socket=/var/tmp/mysql.sock
port=3306
user=mysql

[mysql.server]
basedir=/usr/local/mysql
```

O script **mysql.server** suporta as opções mostradas na tabela a seguir. Se especificadas, elas *devem* ser colocadas em um option file, e não na linha de comando. **mysql.server** suporta apenas `start` e `stop` como argumentos de linha de comando.

**Tabela 4.7 Opções de Option-File para mysql.server**

| Nome da Opção | Descrição | Tipo |
| :--- | :--- | :--- |
| `basedir` | Path para o diretório de instalação do MySQL | Nome de Diretório |
| `datadir` | Path para o diretório de dados do MySQL | Nome de Diretório |
| `pid-file` | Arquivo no qual o Server deve gravar seu Process ID | Nome de Arquivo |
| `service-startup-timeout` | Quanto tempo esperar pela inicialização do Server | Inteiro |

* `basedir=dir_name`

  O path para o diretório de instalação do MySQL.

* `datadir=dir_name`

  O path para o diretório de dados do MySQL.

* `pid-file=file_name`

  O nome do path do arquivo no qual o Server deve gravar seu Process ID. O Server cria o arquivo no diretório de dados, a menos que um nome de path absoluto seja fornecido para especificar um diretório diferente.

  Se esta opção não for fornecida, **mysql.server** usa um valor padrão de `host_name.pid`. O valor do PID file passado para **mysqld_safe** sobrescreve qualquer valor especificado no grupo de option file `[mysqld_safe]`. Como **mysql.server** lê o grupo de option file `[mysqld]`, mas não o grupo `[mysqld_safe]`, você pode garantir que **mysqld_safe** obtenha o mesmo valor quando invocado por **mysql.server** e quando invocado manualmente, colocando a mesma configuração de `pid-file` nos grupos `[mysqld_safe]` e `[mysqld]`.

* `service-startup-timeout=seconds`

  Quanto tempo, em segundos, esperar pela confirmação da inicialização do Server. Se o Server não iniciar dentro deste tempo, **mysql.server** sai com um erro. O valor padrão é 900. Um valor de 0 significa não esperar pela inicialização. Valores negativos significam esperar indefinidamente (sem timeout).