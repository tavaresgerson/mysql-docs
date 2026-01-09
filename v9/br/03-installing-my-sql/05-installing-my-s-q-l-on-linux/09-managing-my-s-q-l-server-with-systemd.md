### 2.5.9 Gerenciando o servidor MySQL com o systemd

Se você instalar o MySQL usando um pacote RPM ou Debian nas seguintes plataformas Linux, o início e o desligamento do servidor são gerenciados pelo systemd:

* Plataformas de pacotes RPM:

  + Variantes de Enterprise Linux versão 7 e superior
  + SUSE Linux Enterprise Server 12 e superior
  + Fedora 29 e superior
* Plataformas da família Debian:

  + Plataformas Debian
  + Plataformas Ubuntu

Se você instalar o MySQL a partir de uma distribuição binária genérica em uma plataforma que usa o systemd, você pode configurar manualmente o suporte do systemd para o MySQL seguindo as instruções fornecidas na seção de configuração pós-instalação do Guia de Implantação Segura do MySQL 8.4.

Se você instalar o MySQL a partir de uma distribuição de fonte em uma plataforma que usa o systemd, obtenha o suporte do systemd para o MySQL configurando a distribuição usando a opção `-DWITH_SYSTEMD=1` do **CMake**. Veja a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

A discussão a seguir aborda esses tópicos:

* Visão geral do systemd
* Configurando o systemd para o MySQL
* Configurando Múltiplas Instâncias do MySQL Usando o systemd
* Migrando do mysqld_safe para o systemd

Nota

Em plataformas para as quais o suporte do systemd para o MySQL está instalado, scripts como **mysqld_safe** e o script de inicialização System V são desnecessários e não são instalados. Por exemplo, **mysqld_safe** pode lidar com reinicializações do servidor, mas o systemd oferece a mesma capacidade, de maneira consistente com a gestão de outros serviços, em vez de usar um programa específico para a aplicação.

Uma implicação do não uso de **mysqld_safe** em plataformas que usam o systemd para gerenciamento de servidores é que o uso de seções como `[mysqld_safe]` ou `[safe_mysqld]` em arquivos de opções não é suportado e pode levar a comportamentos inesperados.

Como o systemd tem a capacidade de gerenciar múltiplas instâncias do MySQL em plataformas para as quais o suporte do systemd para o MySQL está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados.

#### Visão geral do systemd

O systemd fornece inicialização e desligamento automáticos do servidor MySQL. Ele também permite a gestão manual do servidor usando o comando **systemctl**. Por exemplo:

```
$> systemctl {start|stop|restart|status} mysqld
```

Alternativamente, use o comando **service** (com os argumentos invertidos), que é compatível com sistemas System V:

```
$> service mysqld {start|stop|restart|status}
```

Observação

Para o comando **systemctl** (e o comando **service** alternativo), se o nome do serviço MySQL não for `mysqld`, use o nome apropriado. Por exemplo, use `mysql` em vez de `mysqld` em sistemas baseados no Debian e SLES.

O suporte ao systemd inclui esses arquivos:

* `mysqld.service` (plataformas RPM), `mysql.service` (plataformas Debian): arquivo de configuração da unidade de serviço do systemd, com detalhes sobre o serviço MySQL.

* `mysqld@.service` (plataformas RPM), `mysql@.service` (plataformas Debian): como `mysqld.service` ou `mysql.service`, mas usado para gerenciar múltiplas instâncias do MySQL.

* `mysqld.tmpfiles.d`: Arquivo contendo informações para suportar o recurso `tmpfiles`. Este arquivo é instalado com o nome `mysql.conf`.

* `mysqld_pre_systemd` (plataformas RPM), `mysql-system-start` (plataformas Debian): script de suporte para o arquivo de unidade. Este script auxilia na criação do arquivo de log de erro apenas se a localização do log corresponder a um padrão (`/var/log/mysql*.log` para plataformas RPM, `/var/log/mysql/*.log` para plataformas Debian). Em outros casos, o diretório do log de erro deve ser legível ou o log de erro deve estar presente e legível para o usuário que executa o processo **mysqld**.

#### Configurando o systemd para MySQL

Para adicionar ou alterar opções do systemd para o MySQL, esses métodos estão disponíveis:

* Use um arquivo de configuração do systemd localizado.
* Configure o systemd para definir variáveis de ambiente para o processo do servidor MySQL.

* Defina a variável `MYSQLD_OPTS` do systemd.

Para usar um arquivo de configuração do systemd localizado, crie o diretório `/etc/systemd/system/mysqld.service.d` se ele não existir. Nesse diretório, crie um arquivo que contenha uma seção `[Service]` listando as configurações desejadas. Por exemplo:

```
[Service]
LimitNOFILE=max_open_files
Nice=nice_level
LimitCore=core_file_limit
Environment="LD_PRELOAD=/path/to/malloc/library"
Environment="TZ=time_zone_setting"
```

A discussão aqui usa `override.conf` como o nome desse arquivo. Novas versões do systemd suportam o seguinte comando, que abre um editor e permite editar o arquivo:

```
systemctl edit mysqld  # RPM platforms
systemctl edit mysql   # Debian platforms
```

Sempre que você criar ou alterar `override.conf`, recarregue a configuração do systemd e, em seguida, informe ao systemd para reiniciar o serviço MySQL:

```
systemctl daemon-reload
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Com o systemd, o método de configuração `override.conf` deve ser usado para certos parâmetros, em vez de configurações em um grupo `[mysqld]`, `[mysqld_safe]` ou `[safe_mysqld]` em um arquivo de opções do MySQL:

* Para alguns parâmetros, `override.conf` deve ser usado porque o próprio systemd deve conhecer seus valores e não pode ler arquivos de opções do MySQL para obtê-los.

* Parâmetros que especificam valores que de outra forma podem ser definidos apenas usando opções conhecidas pelo **mysqld_safe** devem ser especificados usando o systemd porque não há um parâmetro correspondente ao **mysqld**.

Para obter informações adicionais sobre o uso do systemd em vez do **mysqld_safe**, consulte Migrando do mysqld_safe para o systemd.

Você pode definir os seguintes parâmetros em `override.conf`:

* Para definir o número de descritores de arquivo disponíveis para o servidor MySQL, use `LimitNOFILE` em `override.conf` em vez da variável de sistema `open_files_limit` para **mysqld** ou da opção `--open-files-limit` para **mysqld_safe**.

* Para definir o tamanho máximo do arquivo de núcleo, use `LimitCore` no arquivo `override.conf` em vez da opção `--core-file-size` para **mysqld_safe**.

* Para definir a prioridade de agendamento do servidor MySQL, use `Nice` no arquivo `override.conf` em vez da opção `--nice` para **mysqld_safe**.

Alguns parâmetros do MySQL são configurados usando variáveis de ambiente:

* `LD_PRELOAD`: Defina essa variável se o servidor MySQL deve usar uma biblioteca específica de alocação de memória.

* `NOTIFY_SOCKET`: Esta variável de ambiente especifica o socket que o **mysqld** usa para comunicar a conclusão da inicialização e a mudança do status do serviço com o systemd. Ela é definida pelo systemd quando o serviço **mysqld** é iniciado. O serviço **mysqld** lê o ajuste da variável e escreve na localização definida.

* `TZ`: Defina essa variável para especificar a zona horária padrão para o servidor.

Existem várias maneiras de especificar os valores das variáveis de ambiente para uso pelo processo do servidor MySQL gerenciado pelo systemd:

* Use as linhas `Environment` no arquivo `override.conf`. Para a sintaxe, consulte o exemplo na discussão anterior que descreve como usar esse arquivo.

* Especifique os valores no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir). Atribua valores usando a seguinte sintaxe:

  ```
  LD_PRELOAD=/path/to/malloc/library
  TZ=time_zone_setting
  ```

* Após modificar o `/etc/sysconfig/mysql`, reinicie o servidor para que as alterações sejam efetivas:

  ```
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

Para especificar opções para **mysqld** sem modificar diretamente os arquivos de configuração do systemd, defina ou desative a variável `MYSQLD_OPTS` do systemd. Por exemplo:

```
systemctl set-environment MYSQLD_OPTS="--general_log=1"
systemctl unset-environment MYSQLD_OPTS
```

O arquivo `MYSQLD_OPTS` também pode ser configurado no arquivo `/etc/sysconfig/mysql`.

Após modificar o ambiente do systemd, reinicie o servidor para que as alterações sejam efetivas:

```
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Para plataformas que utilizam o systemd, o diretório de dados é inicializado se estiver vazio no início do servidor. Isso pode ser um problema se o diretório de dados for um montagem remota que desapareceu temporariamente: O ponto de montagem parecerá ser um diretório de dados vazio, que será então inicializado como um novo diretório de dados. Para suprimir esse comportamento de inicialização automática, especifique a seguinte linha no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir):

```
NO_INIT=true
```

#### Configurando Instâncias Múltiplas do MySQL Usando o systemd

Esta seção descreve como configurar o systemd para múltiplas instâncias do MySQL.

Nota

Como o systemd tem a capacidade de gerenciar múltiplas instâncias do MySQL em plataformas para as quais o suporte ao systemd está instalado, **mysqld_multi** e **mysqld_multi.server** são desnecessários e não são instalados.

Para usar a capacidade de instâncias múltiplas, modifique o arquivo de opção `my.cnf` para incluir a configuração de opções-chave para cada instância. Esses locais de arquivo são típicos:

* `/etc/my.cnf` ou `/etc/mysql/my.cnf` (plataformas RPM)

* `/etc/mysql/mysql.conf.d/mysqld.cnf` (plataformas Debian)

Por exemplo, para gerenciar duas instâncias chamadas `replica01` e `replica02`, adicione algo como isso ao arquivo de opção:

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

Os nomes de replica mostrados aqui usam `@` como delimitador porque esse é o único delimitador suportado pelo systemd.

As instâncias são então gerenciadas por comandos normais do systemd, como:

```
systemctl start mysqld@replica01
systemctl start mysqld@replica02
```

Para habilitar as instâncias a serem executadas no momento do boot, faça isso:

```
systemctl enable mysqld@replica01
systemctl enable mysqld@replica02
```

O uso de asteriscos também é suportado. Por exemplo, este comando exibe o status de todas as instâncias replicadas:

```
systemctl status 'mysqld@replica*'
```

Para a gestão de múltiplas instâncias MySQL na mesma máquina, o systemd usa automaticamente um arquivo de unidade diferente:

* `mysqld@.service` em vez de `mysqld.service` (plataformas RPM)

* `mysql@.service` em vez de `mysql.service` (plataformas Debian)

No arquivo de unidade, `%I` e `%i` referenciam o parâmetro passado após o marcador `@` e são usados para gerenciar a instância específica. Para um comando como este:

```
systemctl start mysqld@replica01
```

O systemd inicia o servidor usando um comando como este:

```
mysqld --defaults-group-suffix=@%I ...
```

O resultado é que os grupos de opções `[server]`, `[mysqld]`, e `[mysqld@replica01]` são lidos e usados para essa instância do serviço.

Observação

Em plataformas Debian, o AppArmor impede que o servidor leia ou escreva em `/var/lib/mysql-replica*`, ou qualquer outro local além dos locais padrão. Para resolver isso, você deve personalizar ou desativar o perfil em `/etc/apparmor.d/usr.sbin.mysqld`.

Observação

Em plataformas Debian, os scripts de embalagem para a desinstalação do MySQL atualmente não podem lidar com instâncias `mysqld@`. Antes de remover ou atualizar o pacote, você deve parar manualmente quaisquer instâncias extras primeiro.

#### Migrando do mysqld_safe para o systemd

Como o **mysqld_safe** não é instalado em plataformas que usam o systemd para gerenciar o MySQL, as opções especificadas anteriormente para esse programa (por exemplo, em um grupo de opções `[mysqld_safe]` ou `[safe_mysqld]`) devem ser especificadas de outra maneira:

* Algumas opções do **mysqld_safe** também são compreendidas pelo **mysqld** e podem ser movidas do grupo de opções `[mysqld_safe]` ou `[safe_mysqld]` para o grupo `[mysqld]`. Isso *não* inclui `--pid-file`, `--open-files-limit` ou `--nice`. Para especificar essas opções, use o arquivo `override.conf` do systemd, descrito anteriormente.

  Nota

  Em plataformas systemd, o uso dos grupos de opções `[mysqld_safe]` e `[safe_mysqld]` não é suportado e pode levar a comportamentos inesperados.

* Para algumas opções do **mysqld_safe**, existem procedimentos alternativos do **mysqld**. Por exemplo, a opção do **mysqld_safe** para habilitar o registro de logs no `syslog` é `--syslog`, que está desatualizada. Para gravar a saída do log de erro no log do sistema, use as instruções na Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

* Opções do **mysqld_safe** que não são compreendidas pelo **mysqld** podem ser especificadas no `override.conf` ou em variáveis de ambiente. Por exemplo, com o **mysqld_safe**, se o servidor deve usar uma biblioteca específica de alocação de memória, isso é especificado usando a opção `--malloc-lib`. Para instalações que gerenciam o servidor com systemd, organize-se para definir a variável de ambiente `LD_PRELOAD` em vez disso, conforme descrito anteriormente.