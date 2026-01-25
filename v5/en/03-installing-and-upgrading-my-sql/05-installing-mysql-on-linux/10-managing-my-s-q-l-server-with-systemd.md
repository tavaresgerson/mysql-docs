### 2.5.10 Gerenciando o Servidor MySQL com systemd

Se você instalar o MySQL usando um pacote RPM ou Debian nas seguintes plataformas Linux, a inicialização e o desligamento do servidor são gerenciados pelo systemd:

* Plataformas de pacote RPM:

  + Variantes do Enterprise Linux versão 7 e superiores
  + SUSE Linux Enterprise Server 12 e superiores
* Plataformas da família Debian:

  + Plataformas Debian
  + Plataformas Ubuntu

Se você instalar o MySQL a partir de uma distribuição binária genérica em uma plataforma que usa systemd, você pode configurar manualmente o suporte systemd para MySQL seguindo as instruções fornecidas na seção de configuração pós-instalação do Guia de Implantação Segura do MySQL 5.7.

Se você instalar o MySQL a partir de uma distribuição de código-fonte em uma plataforma que usa systemd, obtenha suporte systemd para MySQL configurando a distribuição usando a opção **CMake** `-DWITH_SYSTEMD=1`. Consulte a Seção 2.8.7, “Opções de Configuração do Código-Fonte do MySQL”.

A discussão a seguir abrange estes tópicos:

* Visão Geral do systemd
* Configurando o systemd para MySQL
* Configurando Múltiplas Instâncias MySQL Usando systemd
* Migrando de mysqld_safe para systemd

Note

Em plataformas onde o suporte systemd para MySQL está instalado, scripts como **mysqld_safe** e o script de inicialização do System V são desnecessários e não são instalados. Por exemplo, **mysqld_safe** pode lidar com reinicializações do servidor, mas o systemd fornece a mesma capacidade, e o faz de uma maneira consistente com o gerenciamento de outros services, em vez de usar um programa específico da aplicação.

Uma implicação da não utilização de **mysqld_safe** em plataformas que usam systemd para gerenciamento de servidor é que o uso das seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opções não é suportado e pode levar a um comportamento inesperado.

Como o systemd tem a capacidade de gerenciar múltiplas instâncias MySQL em plataformas onde o suporte systemd para MySQL está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados.

#### Visão Geral do systemd

O systemd fornece inicialização e desligamento automáticos do servidor MySQL. Ele também permite o gerenciamento manual do servidor usando o comando **systemctl**. Por exemplo:

```sql
systemctl {start|stop|restart|status} mysqld
```

Alternativamente, use o comando **service** (com os argumentos invertidos), que é compatível com sistemas System V:

```sql
service mysqld {start|stop|restart|status}
```

Note

Para os comandos **systemctl** ou **service**, se o nome do service MySQL não for `mysqld`, use o nome apropriado. Por exemplo, use `mysql` em vez de `mysqld` em sistemas baseados em Debian e SLES.

O suporte para systemd inclui estes arquivos:

* `mysqld.service` (plataformas RPM), `mysql.service` (plataformas Debian): Arquivo de configuração da unit de service do systemd, com detalhes sobre o service MySQL.

* `mysqld@.service` (plataformas RPM), `mysql@.service` (plataformas Debian): Semelhante a `mysqld.service` ou `mysql.service`, mas usado para gerenciar múltiplas instâncias MySQL.

* `mysqld.tmpfiles.d`: Arquivo contendo informações para suportar o recurso `tmpfiles`. Este arquivo é instalado sob o nome `mysql.conf`.

* `mysqld_pre_systemd` (plataformas RPM), `mysql-system-start` (plataformas Debian): Script de suporte para o unit file. Este script auxilia na criação do arquivo de log de erros somente se a localização do log corresponder a um padrão (`/var/log/mysql*.log` para plataformas RPM, `/var/log/mysql/*.log` para plataformas Debian). Em outros casos, o diretório de log de erros deve ser gravável ou o log de erros deve estar presente e gravável para o usuário que executa o processo **mysqld**.

#### Configurando o systemd para MySQL

Para adicionar ou alterar opções do systemd para MySQL, estes métodos estão disponíveis:

* Usar um arquivo de configuração systemd localizado.
* Fazer com que o systemd defina variáveis de ambiente para o processo do servidor MySQL.
* Definir a variável systemd `MYSQLD_OPTS`.

Para usar um arquivo de configuração systemd localizado, crie o diretório `/etc/systemd/system/mysqld.service.d` se ele não existir. Nesse diretório, crie um arquivo que contenha uma seção `[Service]` listando as configurações desejadas. Por exemplo:

```sql
[Service]
LimitNOFILE=max_open_files
PIDFile=/path/to/pid/file
Nice=nice_level
LimitCore=core_file_limit
Environment="LD_PRELOAD=/path/to/malloc/library"
Environment="TZ=time_zone_setting"
```

A discussão aqui usa `override.conf` como o nome deste arquivo. Versões mais recentes do systemd suportam o seguinte comando, que abre um editor e permite editar o arquivo:

```sql
systemctl edit mysqld  # RPM platforms
systemctl edit mysql   # Debian platforms
```

Sempre que você criar ou alterar `override.conf`, recarregue a configuração do systemd e, em seguida, diga ao systemd para reiniciar o service MySQL:

```sql
systemctl daemon-reload
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Com systemd, o método de configuração `override.conf` deve ser usado para certos parâmetros, em vez de configurações em um grupo `[mysqld]`, `[mysqld_safe]` ou `[safe_mysqld]` em um arquivo de opções do MySQL:

* Para alguns parâmetros, `override.conf` deve ser usado porque o próprio systemd precisa saber seus valores e ele não pode ler arquivos de opções do MySQL para obtê-los.

* Parâmetros que especificam valores que, de outra forma, seriam configuráveis apenas usando opções conhecidas por **mysqld_safe**, devem ser especificados usando systemd porque não há um parâmetro **mysqld** correspondente.

Para obter informações adicionais sobre o uso do systemd em vez de **mysqld_safe**, consulte Migrando de mysqld_safe para systemd.

Você pode definir os seguintes parâmetros em `override.conf`:

* Para especificar o arquivo de ID do processo (Process ID File):

  + A partir do MySQL 5.7.10: Use `override.conf` e altere tanto `PIDFile` quanto `ExecStart` para nomear o caminho do arquivo PID. Qualquer configuração do arquivo de ID do processo em arquivos de opções do MySQL é ignorada. Para modificar `ExecStart`, ele deve ser limpo primeiro. Por exemplo:

    ```sql
    [Service]
    PIDFile=/var/run/mysqld/mysqld-custom.pid
    ExecStart=
    ExecStart=/usr/sbin/mysqld --pid-file=/var/run/mysqld/mysqld-custom.pid $MYSQLD_OPTS
    ```

  + Antes do MySQL 5.7.10: Use `PIDFile` em `override.conf` em vez da opção `--pid-file` para **mysqld** ou **mysqld_safe**. O systemd deve saber a localização do arquivo PID para que possa reiniciar ou parar o servidor. Se o valor do arquivo PID for especificado em um arquivo de opções do MySQL, o valor deve corresponder ao valor `PIDFile` ou a inicialização do MySQL pode falhar.

* Para definir o número de descritores de arquivo disponíveis para o servidor MySQL, use `LimitNOFILE` em `override.conf` em vez da variável de sistema `open_files_limit` para **mysqld** ou da opção `--open-files-limit` para **mysqld_safe**.

* Para definir o tamanho máximo do arquivo core, use `LimitCore` em `override.conf` em vez da opção `--core-file-size` para **mysqld_safe**.

* Para definir a prioridade de agendamento (scheduling priority) para o servidor MySQL, use `Nice` em `override.conf` em vez da opção `--nice` para **mysqld_safe**.

Alguns parâmetros MySQL são configurados usando variáveis de ambiente:

* `LD_PRELOAD`: Defina esta variável se o servidor MySQL deve usar uma biblioteca de alocação de memória específica.

* `TZ`: Defina esta variável para especificar o fuso horário padrão para o servidor.

Existem várias maneiras de especificar valores de variáveis de ambiente para uso pelo processo do servidor MySQL gerenciado pelo systemd:

* Use linhas `Environment` no arquivo `override.conf`. Para a sintaxe, consulte o exemplo na discussão anterior que descreve como usar este arquivo.

* Especifique os valores no arquivo `/etc/sysconfig/mysql` (crie o arquivo se não existir). Atribua valores usando a seguinte sintaxe:

  ```sql
  LD_PRELOAD=/path/to/malloc/library
  TZ=time_zone_setting
  ```

  Após modificar `/etc/sysconfig/mysql`, reinicie o servidor para que as alterações tenham efeito:

  ```sql
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

Para especificar opções para **mysqld** sem modificar diretamente os arquivos de configuração do systemd, defina ou indefina a variável systemd `MYSQLD_OPTS`. Por exemplo:

```sql
systemctl set-environment MYSQLD_OPTS="--general_log=1"
systemctl unset-environment MYSQLD_OPTS
```

`MYSQLD_OPTS` também pode ser definido no arquivo `/etc/sysconfig/mysql`.

Após modificar o ambiente systemd, reinicie o servidor para que as alterações tenham efeito:

```sql
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Para plataformas que usam systemd, o Data Directory é inicializado se estiver vazio na inicialização do servidor. Isso pode ser um problema se o Data Directory for um mount remoto que desapareceu temporariamente: O ponto de mount pareceria ser um Data Directory vazio, que então seria inicializado como um novo Data Directory. A partir do MySQL 5.7.20, para suprimir este comportamento de inicialização automática, especifique a seguinte linha no arquivo `/etc/sysconfig/mysql` (crie o arquivo se não existir):

```sql
NO_INIT=true
```

#### Configurando Múltiplas Instâncias MySQL Usando systemd

Esta seção descreve como configurar o systemd para múltiplas instâncias do MySQL.

Note

Como o systemd tem a capacidade de gerenciar múltiplas instâncias MySQL em plataformas onde o suporte systemd está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados. Isso é verdade a partir do MySQL 5.7.13 para plataformas RPM, e 5.7.19 para plataformas Debian.

Para usar a capacidade de múltiplas instâncias, modifique o arquivo de opções `my.cnf` para incluir a configuração de opções chave para cada instância. Estes locais de arquivo são típicos:

* `/etc/my.cnf` ou `/etc/mysql/my.cnf` (plataformas RPM)

* `/etc/mysql/mysql.conf.d/mysqld.cnf` (plataformas Debian)

Por exemplo, para gerenciar duas instâncias nomeadas `replica01` e `replica02`, adicione algo assim ao arquivo de opções:

Plataformas RPM:

```sql
[mysqld@replica01]
datadir=/var/lib/mysql-replica01
socket=/var/lib/mysql-replica01/mysql.sock
port=3307
log-error=/var/log/mysqld-replica01.log

[mysqld@replica02]
datadir=/var/lib/mysql-replica02
socket=/var/lib/mysql-replica02/mysql.sock
port=3308
log-error=/var/log/mysqld-replica02.log
```

Plataformas Debian:

```sql
[mysqld@replica01]
datadir=/var/lib/mysql-replica01
socket=/var/lib/mysql-replica01/mysql.sock
port=3307
log-error=/var/log/mysql/replica01.log

[mysqld@replica02]
datadir=/var/lib/mysql-replica02
socket=/var/lib/mysql-replica02/mysql.sock
port=3308
log-error=/var/log/mysql/replica02.log
```

Os nomes das réplicas mostrados aqui usam `@` como delimitador porque é o único delimitador suportado pelo systemd.

As instâncias são então gerenciadas por comandos systemd normais, tais como:

```sql
systemctl start mysqld@replica01
systemctl start mysqld@replica02
```

Para habilitar instâncias para rodar no momento da inicialização (boot time), faça o seguinte:

```sql
systemctl enable mysqld@replica01
systemctl enable mysqld@replica02
```

O uso de curingas (wildcards) também é suportado. Por exemplo, este comando exibe o status de todas as instâncias de réplica:

```sql
systemctl status 'mysqld@replica*'
```

Para o gerenciamento de múltiplas instâncias MySQL na mesma máquina, o systemd usa automaticamente um unit file diferente:

* `mysqld@.service` em vez de `mysqld.service` (plataformas RPM)

* `mysql@.service` em vez de `mysql.service` (plataformas Debian)

No unit file, `%I` e `%i` referenciam o parâmetro passado após o marcador `@` e são usados para gerenciar a instância específica. Para um comando como este:

```sql
systemctl start mysqld@replica01
```

O systemd inicia o servidor usando um comando como este:

```sql
mysqld --defaults-group-suffix=@%I ...
```

O resultado é que os grupos de opções `[server]`, `[mysqld]` e `[mysqld@replica01]` são lidos e usados para essa instância do service.

Note

Em plataformas Debian, o AppArmor impede que o servidor leia ou escreva em `/var/lib/mysql-replica*`, ou em qualquer outro lugar além dos locais padrão. Para resolver isso, você deve personalizar ou desabilitar o profile em `/etc/apparmor.d/usr.sbin.mysqld`.

Note

Em plataformas Debian, os scripts de empacotamento para desinstalação do MySQL atualmente não conseguem lidar com instâncias `mysqld@`. Antes de remover ou atualizar o pacote, você deve parar manualmente quaisquer instâncias extras primeiro.

#### Migrando de mysqld_safe para systemd

Como **mysqld_safe** não está instalado em plataformas que usam systemd para gerenciar MySQL, as opções previamente especificadas para esse programa (por exemplo, em um grupo de opções `[mysqld_safe]` ou `[safe_mysqld]`) devem ser especificadas de outra forma:

* Algumas opções do **mysqld_safe** também são compreendidas por **mysqld** e podem ser movidas do grupo de opções `[mysqld_safe]` ou `[safe_mysqld]` para o grupo `[mysqld]`. Isso *não* inclui `--pid-file`, `--open-files-limit` ou `--nice`. Para especificar essas opções, use o arquivo systemd `override.conf`, descrito anteriormente.

  Note

  Em plataformas systemd, o uso dos grupos de opções `[mysqld_safe]` e `[safe_mysqld]` não é suportado e pode levar a um comportamento inesperado.

* Para algumas opções do **mysqld_safe**, existem opções **mysqld** semelhantes. Por exemplo, a opção **mysqld_safe** para habilitar o logging `syslog` é `--syslog`, que está depreciada. Para **mysqld**, habilite a variável de sistema `log_syslog` em vez disso. Para detalhes, consulte a Seção 5.4.2, “O Error Log”.

* Opções do **mysqld_safe** não compreendidas por **mysqld** podem ser especificadas em `override.conf` ou variáveis de ambiente. Por exemplo, com **mysqld_safe**, se o servidor deve usar uma biblioteca de alocação de memória específica, isso é especificado usando a opção `--malloc-lib`. Para instalações que gerenciam o servidor com systemd, providencie para definir a variável de ambiente `LD_PRELOAD` em vez disso, conforme descrito anteriormente.