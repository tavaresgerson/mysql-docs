### 2.5.10 Gerenciando o servidor MySQL com o systemd

Se você instalar o MySQL usando um pacote RPM ou Debian nas seguintes plataformas Linux, o início e o desligamento do servidor são gerenciados pelo `systemd`:

- Plataformas de pacotes RPM:

  - Variantes da Enterprise Linux versão 7 e superior
  - SUSE Linux Enterprise Server 12 e versões superiores
- Plataformas da família Debian:

  - Plataformas Debian
  - Plataformas Ubuntu

Se você instalar o MySQL a partir de uma distribuição binária genérica em uma plataforma que usa o `systemd`, você pode configurar manualmente o suporte do `systemd` para o MySQL seguindo as instruções fornecidas na seção de configuração pós-instalação do Guia de Implantação Segura do MySQL 5.7.

Se você instalar o MySQL a partir de uma distribuição de fonte em uma plataforma que usa o `systemd`, obtenha suporte para o MySQL no `systemd` configurando a distribuição usando a opção `-DWITH_SYSTEMD=1` do **CMake**. Veja a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

A discussão a seguir aborda esses tópicos:

- Visão geral do `systemd`
- Configurando o `systemd` para MySQL
- Configurando múltiplas instâncias do MySQL usando o `systemd`
- Migrando do `mysqld_safe` para o `systemd`

::: info Nota
Em plataformas para as quais o suporte do systemd para MySQL está instalado, scripts como **mysqld_safe** e o script de inicialização System V são desnecessários e não são instalados. Por exemplo, **mysqld_safe** pode lidar com reinicializações do servidor, mas o systemd oferece a mesma capacidade, de maneira consistente com a gestão de outros serviços, e não usando um programa específico para a aplicação.
:::

Uma implicação do não uso do **mysqld_safe** em plataformas que utilizam o systemd para gerenciamento de servidores é que o uso das seções `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opções não é suportado e pode levar a comportamentos inesperados.

Como o systemd tem a capacidade de gerenciar múltiplas instâncias do MySQL em plataformas para as quais o suporte do systemd para o MySQL está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados.

#### Visão geral do systemd

O systemd oferece inicialização e desligamento automáticos do servidor MySQL. Ele também permite a gestão manual do servidor usando o comando **systemctl**. Por exemplo:

```sql
systemctl {start|stop|restart|status} mysqld
```

Alternativamente, use o comando **service** (com os argumentos invertidos), que é compatível com sistemas System V:

```sql
service mysqld {start|stop|restart|status}
```

::: info Nota
Para os comandos **systemctl** ou **service**, se o nome do serviço MySQL não for `mysqld`, use o nome apropriado. Por exemplo, use `mysql` em vez de `mysqld` em sistemas baseados no Debian e SLES.
:::

O suporte para o systemd inclui esses arquivos:

- `mysqld.service` (plataformas RPM), `mysql.service` (plataformas Debian): arquivo de configuração da unidade de serviço systemd, com detalhes sobre o serviço MySQL.

- `mysqld@.service` (plataformas RPM), `mysql@.service` (plataformas Debian): Iguais a `mysqld.service` ou `mysql.service`, mas usados para gerenciar múltiplas instâncias do MySQL.

- `mysqld.tmpfiles.d`: Arquivo que contém informações para suportar o recurso `tmpfiles`. Este arquivo é instalado com o nome `mysql.conf`.

- `mysqld_pre_systemd` (plataformas RPM), `mysql-system-start` (plataformas Debian): Script de suporte para o arquivo de unidade. Este script auxilia na criação do arquivo de log de erro apenas se a localização do log corresponder a um padrão (`/var/log/mysql*.log` para plataformas RPM, `/var/log/mysql/*.log` para plataformas Debian). Em outros casos, o diretório do log de erro deve ser legível ou o log de erro deve estar presente e legível para o usuário que executa o processo **mysqld**.

#### Configurando o systemd para MySQL

Para adicionar ou alterar as opções do systemd para o MySQL, esses métodos estão disponíveis:

- Use um arquivo de configuração do systemd localizado.
- Configure o systemd para definir variáveis de ambiente para o processo do servidor MySQL.
- Defina a variável `MYSQLD_OPTS` do systemd.

Para usar um arquivo de configuração do systemd localizado, crie o diretório `/etc/systemd/system/mysqld.service.d` se ele não existir. Nesse diretório, crie um arquivo que contenha uma seção `[Service]` listando as configurações desejadas. Por exemplo:

```
[Service]
LimitNOFILE=max_open_files
PIDFile=/path/to/pid/file
Nice=nice_level
LimitCore=core_file_limit
Environment="LD_PRELOAD=/path/to/malloc/library"
Environment="TZ=time_zone_setting"
```

A discussão aqui usa `override.conf` como o nome desse arquivo. Novas versões do systemd suportam o seguinte comando, que abre um editor e permite que você edite o arquivo:

```shell
systemctl edit mysqld  # RPM platforms
systemctl edit mysql   # Debian platforms
```

Sempre que você criar ou alterar o `override.conf`, recarregue a configuração do systemd e, em seguida, peça ao systemd para reiniciar o serviço MySQL:

```shell
systemctl daemon-reload
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Com o systemd, o método de configuração `override.conf` deve ser usado para certos parâmetros, em vez de configurações em um grupo `[mysqld]`, `[mysqld_safe]` ou `[safe_mysqld]` em um arquivo de opções do MySQL:

- Para alguns parâmetros, o `override.conf` deve ser usado, pois o próprio systemd precisa conhecer seus valores e não pode ler arquivos de opções do MySQL para obtê-los.
- Os parâmetros que especificam valores que, de outra forma, só poderiam ser definidos usando opções conhecidas pelo **mysqld_safe** devem ser especificados usando o systemd, pois não há um parâmetro correspondente ao **mysqld**.

Para obter informações adicionais sobre o uso do systemd em vez do **mysqld_safe**, consulte a seção Migrando do mysqld_safe para o systemd.

Você pode definir os seguintes parâmetros no `override.conf`:

- Para especificar o arquivo de ID do processo:
  - A partir do MySQL 5.7.10: Use `override.conf` e altere `PIDFile` e `ExecStart` para o nome do caminho do arquivo de PID. Qualquer configuração do arquivo de ID de processo nos arquivos de opção do MySQL é ignorada. Para modificar `ExecStart`, ele deve ser limpo primeiro. Por exemplo:

    ```
    [Service]
    PIDFile=/var/run/mysqld/mysqld-custom.pid
    ExecStart=
    ExecStart=/usr/sbin/mysqld --pid-file=/var/run/mysqld/mysqld-custom.pid $MYSQLD_OPTS
    ```

  - Antes do MySQL 5.7.10: Use `PIDFile` no `override.conf` em vez da opção `--pid-file` para **mysqld** ou **mysqld_safe**. O systemd deve conhecer a localização do arquivo PID para que possa reiniciar ou parar o servidor. Se o valor do arquivo PID for especificado em um arquivo de opção do MySQL, o valor deve corresponder ao valor `PIDFile` ou o inicialização do MySQL pode falhar.

- Para definir o número de descritores de arquivo disponíveis para o servidor MySQL, use `LimitNOFILE` no arquivo `override.conf` em vez da variável de sistema `open_files_limit` para o **mysqld** ou da opção `--open-files-limit` para o **mysqld_safe**.
- Para definir o tamanho máximo do arquivo de núcleo, use `LimitCore` no arquivo `override.conf` em vez da opção `--core-file-size` para o **mysqld_safe**.
- Para definir a prioridade de agendamento do servidor MySQL, use `Nice` no arquivo `override.conf` em vez da opção `--nice` para o **mysqld_safe**.

Alguns parâmetros do MySQL são configurados usando variáveis de ambiente:

- `LD_PRELOAD`: Defina essa variável se o servidor MySQL deve usar uma biblioteca específica de alocação de memória.
- `TZ`: Defina esta variável para especificar o fuso horário padrão do servidor.
Existem várias maneiras de especificar os valores das variáveis de ambiente para serem usadas pelo processo do servidor MySQL gerenciado pelo systemd:
- Use as linhas `Ambiente` no arquivo `override.conf`. Para a sintaxe, consulte o exemplo na discussão anterior que descreve como usar esse arquivo.
- Especifique os valores no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir). Atribua os valores usando a seguinte sintaxe:

  ```
  LD_PRELOAD=/path/to/malloc/library
  TZ=time_zone_setting
  ```

  Após modificar o `/etc/sysconfig/mysql`, reinicie o servidor para que as alterações sejam efetivas:

  ```shell
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

Para especificar opções para o **mysqld** sem modificar diretamente os arquivos de configuração do systemd, defina ou desative a variável `MYSQLD_OPTS` do systemd. Por exemplo:

```sql
systemctl set-environment MYSQLD_OPTS="--general_log=1"
systemctl unset-environment MYSQLD_OPTS
```

`MYSQLD_OPTS` também pode ser definido no arquivo `/etc/sysconfig/mysql`.

Após modificar o ambiente do systemd, reinicie o servidor para que as alterações sejam efetivas:

```sql
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Para plataformas que usam o systemd, o diretório de dados é inicializado se estiver vazio ao iniciar o servidor. Isso pode ser um problema se o diretório de dados for um montagem remota que desapareceu temporariamente: o ponto de montagem pareceria ser um diretório de dados vazio, que então seria inicializado como um novo diretório de dados. A partir do MySQL 5.7.20, para suprimir esse comportamento de inicialização automática, especifique a seguinte linha no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir):

```shell
NO_INIT=true
```

#### Configurando múltiplas instâncias do MySQL usando o systemd

Esta seção descreve como configurar o systemd para múltiplas instâncias do MySQL.

::: info Nota
Como o systemd tem a capacidade de gerenciar múltiplas instâncias do MySQL em plataformas para as quais o suporte do systemd está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados. Isso é verdade a partir do MySQL 5.7.13 para plataformas RPM, 5.7.19 para plataformas Debian.
:::

Para usar a capacidade de múltiplas instâncias, modifique o arquivo de opção `my.cnf` para incluir a configuração das opções de chave para cada instância. Esses locais de arquivo são típicos:

- `/etc/my.cnf` ou `/etc/mysql/my.cnf` (plataformas RPM)

- `/etc/mysql/mysql.conf.d/mysqld.cnf` (plataformas Debian)

Por exemplo, para gerenciar duas instâncias chamadas `replica01` e `replica02`, adicione algo como isso ao arquivo de opções:

Plataformas RPM:

```
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

```
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

Os nomes das réplicas mostrados aqui usam `@` como delimitador, porque esse é o único delimitador suportado pelo systemd.

Os instâncias são então gerenciadas por comandos normais do systemd, como:

```shell
systemctl start mysqld@replica01
systemctl start mysqld@replica02
```

Para permitir que as instâncias sejam executadas no momento do boot, faça o seguinte:

```shell
systemctl enable mysqld@replica01
systemctl enable mysqld@replica02
```

O uso de asteriscos também é suportado. Por exemplo, este comando exibe o status de todas as instâncias replicadas:

```shell
systemctl status 'mysqld@replica*'
```

Para o gerenciamento de múltiplas instâncias do MySQL na mesma máquina, o systemd usa automaticamente um arquivo de unidade diferente:

- `mysqld@.service` em vez de `mysqld.service` (plataformas RPM)
- `mysql@.service` em vez de `mysql.service` (plataformas Debian)

No arquivo de unidade, `%I` e `%i` referenciam o parâmetro passado após o marcador `@` e são usados para gerenciar a instância específica. Para um comando como este:

```shell
systemctl start mysqld@replica01
```

O systemd inicia o servidor usando um comando como este:

```shell
mysqld --defaults-group-suffix=@%I ...
```

O resultado é que os grupos de opções `[server]`, `[mysqld]` e `[mysqld@replica01]` são lidos e usados para essa instância do serviço.

::: info Nota
Nas plataformas Debian, o AppArmor impede que o servidor leia ou escreva em `/var/lib/mysql-replica*`, ou em qualquer outro local que não seja o padrão. Para resolver isso, você deve personalizar ou desativar o perfil em `/etc/apparmor.d/usr.sbin.mysqld`.
:::

::: info Nota
Nas plataformas Debian, os scripts de embalagem para a desinstalação do MySQL atualmente não conseguem lidar com instâncias `mysqld@`. Antes de remover ou atualizar o pacote, você deve parar manualmente quaisquer instâncias extras primeiro.
:::

#### Migrando do mysqld_safe para o systemd

Como o **mysqld_safe** não está instalado em plataformas que usam o systemd para gerenciar o MySQL, as opções especificadas anteriormente para esse programa (por exemplo, em um grupo de opções de `[mysqld_safe]` ou `[safe_mysqld]`) devem ser especificadas de outra maneira:

- Algumas opções do **mysqld_safe** também são compreendidas pelo **mysqld** e podem ser movidas do grupo de opções `[mysqld_safe]` ou `[safe_mysqld]` para o grupo `[mysqld]`. Isso *não* inclui `--pid-file`, `--open-files-limit` ou `--nice`. Para especificar essas opções, use o arquivo `override.conf` do systemd, descrito anteriormente.

  ::: info Nota
  Em plataformas do systemd, o uso de grupos de opções `[mysqld_safe]` e `[safe_mysqld]` não é suportado e pode levar a comportamentos inesperados.
  :::

- Para algumas opções do **mysqld_safe**, existem opções semelhantes do **mysqld**. Por exemplo, a opção do **mysqld_safe** para habilitar o registro no `syslog` é `--syslog`, que está desatualizada. Para o **mysqld**, habilite a variável de sistema `log_syslog`. Para mais detalhes, consulte a Seção 5.4.2, “O Log de Erros”.

- As opções do **mysqld_safe** que não são compreendidas pelo **mysqld** podem ser especificadas no `override.conf` ou em variáveis de ambiente. Por exemplo, com o **mysqld_safe**, se o servidor deve usar uma biblioteca específica de alocação de memória, isso é especificado usando a opção `--malloc-lib`. Para instalações que gerenciam o servidor com o systemd, organize-se para definir a variável de ambiente `LD_PRELOAD` em vez disso, conforme descrito anteriormente.
