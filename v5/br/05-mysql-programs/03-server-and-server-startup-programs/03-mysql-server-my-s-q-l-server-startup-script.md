### 4.3.3 mysql.server — Script de inicialização do servidor MySQL

As distribuições do MySQL em sistemas Unix e similares incluem um script chamado **mysql.server**, que inicia o servidor MySQL usando **mysqld_safe**. Ele pode ser usado em sistemas como Linux e Solaris que utilizam diretórios de execução estilo System V para iniciar e parar serviços do sistema. Ele também é usado pelo item de inicialização do macOS para o MySQL.

**mysql.server** é o nome do script usado dentro da árvore de código-fonte do MySQL. O nome instalado pode ser diferente (por exemplo, **mysqld** ou **mysql**). Na discussão a seguir, ajuste o nome **mysql.server** conforme apropriado para o seu sistema.

::: info Nota
Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, **mysql.server** e **mysqld_safe** não são instalados porque são desnecessários. Para mais informações, consulte a Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.
:::

Para iniciar ou parar o servidor manualmente usando o script **mysql.server**, invólucvelo-o a partir da linha de comando com os argumentos `start` ou `stop`:

```sql
mysql.server start
mysql.server stop
```

O arquivo **mysql.server** muda a localização para o diretório de instalação do MySQL, e então invoca o **mysqld_safe**. Para executar o servidor como um usuário específico, adicione uma opção apropriada de `user` ao grupo **[mysqld]** do arquivo de opção global `/etc/my.cnf`, conforme mostrado mais adiante nesta seção. (É possível que você precise editar o **mysql.server** se você instalou uma distribuição binária do MySQL em um local não padrão. Modifique-o para alterar a localização para o diretório apropriado antes de executar o **mysqld_safe**. Se você fizer isso, sua versão modificada do **mysql.server** pode ser sobrescrita se você atualizar o MySQL no futuro; faça uma cópia da sua versão editada que você possa reinstalar.)

**mysql.server stop** para o servidor enviando um sinal para ele. Você também pode parar o servidor manualmente executando **mysqladmin shutdown**.

Para iniciar e parar o MySQL automaticamente no seu servidor, você deve adicionar os comandos start e stop aos locais apropriados nos arquivos `/etc/rc*`:

- Se você usar o pacote RPM do servidor Linux (`MySQL-server-VERSION.rpm`) ou uma instalação de pacote nativo do Linux, o script **mysql.server** pode ser instalado no diretório `/etc/init.d` com o nome `mysqld` ou `mysql`. Consulte a Seção 2.5.5, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle”, para obter mais informações sobre os pacotes RPM do Linux.

- Se você instalar o MySQL a partir de uma distribuição de fonte ou usando um formato de distribuição binária que não instala o **mysql.server** automaticamente, você pode instalar o script manualmente. Ele pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em um repositório de fonte do MySQL. Copie o script para o diretório `/etc/init.d` com o nome **mysql** e torne-o executável:

  ```sh
  cp mysql.server /etc/init.d/mysql
  chmod +x /etc/init.d/mysql
  ```

  Após instalar o script, os comandos necessários para ativá-lo e executá-lo ao iniciar o sistema dependem do seu sistema operacional. No Linux, você pode usar o **chkconfig**:

  ```sh
  chkconfig --add mysql
  ```

  Em alguns sistemas Linux, o seguinte comando também parece ser necessário para habilitar completamente o script **mysql**:

  ```sh
  chkconfig --level 345 mysql on
  ```

- No FreeBSD, os scripts de inicialização geralmente devem estar em `/usr/local/etc/rc.d/`. Instale o script `mysql.server` como `/usr/local/etc/rc.d/mysql.server.sh` para habilitar a inicialização automática. A página de manual `rc(8)` afirma que os scripts neste diretório são executados apenas se o nome do arquivo de shell correspondente ao nome do arquivo de shell `*.sh` for igual. Todos os outros arquivos ou diretórios presentes neste diretório são ignorados silenciosamente.

- Como alternativa à configuração anterior, alguns sistemas operacionais também usam `/etc/rc.local` ou `/etc/init.d/boot.local` para iniciar serviços adicionais ao iniciar o sistema. Para iniciar o MySQL usando esse método, adicione um comando como o seguinte ao arquivo de inicialização apropriado:

  ```sh
  /bin/sh -c 'cd /usr/local/mysql; ./bin/mysqld_safe --user=mysql &'
  ```

- Para outros sistemas, consulte a documentação do seu sistema operacional para saber como instalar scripts de inicialização.

O **mysql.server** lê as opções das seções `[mysql.server]` e `[mysqld]` dos arquivos de opções. Para compatibilidade com versões anteriores, ele também lê as seções `[mysql_server]`, mas para manter a atualidade, você deve renomear essas seções para `[mysql.server]`.

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

**Tabela 4.7 Opções de arquivo de opção mysql.server**

<table>
  <thead>
    <tr>
      <th>Nome da Opção</th>
      <th>Descrição</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <th><code>basedir</code></th>
        <td>Caminho para o diretório de instalação do MySQL</td>
        <td>Nome do diretório</td>
    </tr>
    <tr>
        <th><code>datadir</code></th>
        <td>Caminho para o diretório de dados do MySQL</td>
        <td>Nome do diretório</td>
    </tr>
    <tr>
        <th><code>pid-file</code></th>
        <td>Arquivo no qual o servidor deve escrever seu ID de processo</td>
        <td>Nome do arquivo</td>
    </tr>
    <tr>
        <th><code>service-startup-timeout</code></th>
        <td>Quanto tempo esperar para o servidor ser iniciado</td>
        <td>Inteiro</td>
    </tr>
  </tbody>
</table>

- `basedir=dir_name`

  O caminho para o diretório de instalação do MySQL.

- `datadir=dir_name`

  O caminho para o diretório de dados do MySQL.

- `pid-file=file_name`

  O nome do caminho do arquivo no qual o servidor deve escrever seu ID de processo. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

  Se essa opção não for fornecida, o **mysql.server** usa um valor padrão de `host_name.pid`. O valor do arquivo PID passado para o **mysqld_safe** substitui qualquer valor especificado no grupo de opções `[mysqld_safe]`. Como o **mysql.server** lê o grupo de opções `[mysqld]` mas não o grupo `[mysqld_safe]`, você pode garantir que o **mysqld_safe** receba o mesmo valor quando invocado pelo **mysql.server** como quando invocado manualmente, colocando o mesmo conjunto de configuração `pid-file` nos grupos `[mysqld_safe]` e `[mysqld]`.

- `service-startup-timeout=segundos`

  Quanto tempo em segundos esperar para confirmar o início do servidor. Se o servidor não iniciar dentro desse tempo, o **mysql.server** sai com um erro. O valor padrão é 900. Um valor de 0 significa não esperar para o início. Valores negativos significam esperar para sempre (sem tempo limite).
