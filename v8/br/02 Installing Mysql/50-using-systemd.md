### 2.5.9 Gestão do MySQL Server com o systemd

Se você instalar o MySQL usando um pacote RPM ou Debian nas seguintes plataformas Linux, a inicialização e o desligamento do servidor são gerenciados pelo systemd:

- Plataformas de pacotes RPM:

  - Variantes Enterprise Linux versão 7 e superior
  - SUSE Linux Enterprise Server 12 e superior
  - Fedora 29 e superior
- Plataformas da família Debian:

  - Plataformas Debian
  - Plataformas Ubuntu

Se você instalar o MySQL a partir de uma distribuição binária genérica em uma plataforma que usa o systemd, você pode configurar manualmente o suporte do systemd para o MySQL seguindo as instruções fornecidas na seção de configuração pós-instalação do Guia de implantação segura do MySQL 8.4.

Se você instalar o MySQL a partir de uma distribuição de origem em uma plataforma que usa o systemd, obtenha o suporte do systemd para o MySQL configurando a distribuição usando a opção `-DWITH_SYSTEMD=1` `CMake`.

A seguinte discussão abrange estes tópicos:

- Visão geral do sistema
- Configurar systemd para MySQL
- Configurar múltiplas instâncias do MySQL usando systemd
- Migração de `mysqld_safe` para systemd

::: info Note

Em plataformas para as quais o suporte do systemd para o MySQL está instalado, scripts como o `mysqld_safe` e o script de inicialização `System V` são desnecessários e não são instalados. Por exemplo, o `mysqld_safe` pode lidar com reinicializações de servidor, mas o systemd fornece a mesma capacidade e o faz de uma maneira consistente com o gerenciamento de outros serviços, em vez de usar um programa específico de aplicativo.

Uma implicação do não uso de `mysqld_safe` em plataformas que usam systemd para gerenciamento de servidor é que o uso de `[mysqld_safe]` ou `[safe_mysqld]` seções em arquivos de opção não é suportado e pode levar a um comportamento inesperado.

Como o systemd tem a capacidade de gerenciar várias instâncias do MySQL em plataformas para as quais o suporte do systemd para o MySQL está instalado, o `mysqld_multi` e o `mysqld_multi.server` são desnecessários e não são instalados.

:::

#### Visão geral do sistema

systemd fornece inicialização e desligamento automático do servidor MySQL. Ele também permite o gerenciamento manual do servidor usando o comando `systemctl`. Por exemplo:

```
$> systemctl {start|stop|restart|status} mysqld
```

Alternativamente, use o comando `service` (com os argumentos invertidos), que é compatível com os sistemas do Sistema V:

```
$> service mysqld {start|stop|restart|status}
```

::: info Note

Para o comando `systemctl` (e o comando alternativo `service`), se o nome do serviço MySQL não for `mysqld` então use o nome apropriado. Por exemplo, use `mysql` em vez de `mysqld` em sistemas baseados no Debian e SLES.

:::

O suporte para o systemd inclui estes arquivos:

- `mysqld.service` (plataformas RPM), `mysql.service` (plataformas Debian): arquivo de configuração da unidade de serviço do sistema, com detalhes sobre o serviço MySQL.
- `mysqld@.service` (plataformas RPM), `mysql@.service` (plataformas Debian): Como `mysqld.service` ou `mysql.service`, mas usado para gerenciar várias instâncias do MySQL.
- `mysqld.tmpfiles.d`: Arquivo contendo informações para suportar o recurso `tmpfiles`. Este arquivo é instalado sob o nome `mysql.conf`.
- Este script auxilia na criação do arquivo de registro de erro somente se a localização do registro coincidir com um padrão (`/var/log/mysql*.log` para plataformas RPM, `/var/log/mysql/*.log` para plataformas Debian). Em outros casos, o diretório de registro de erro deve ser escrevível ou o registro de erro deve estar presente e escrevível para o usuário executando o processo `mysqld`.

#### Configurar systemd para MySQL

Para adicionar ou alterar as opções do systemd para o MySQL, estão disponíveis os seguintes métodos:

- Use um arquivo de configuração localizado.
- Configure para que o systemd defina variáveis de ambiente para o processo do servidor MySQL.
- Defina a variável systemd `MYSQLD_OPTS`.

Para usar um arquivo de configuração localizado do systemd, crie o diretório `/etc/systemd/system/mysqld.service.d` se ele não existir. Nesse diretório, crie um arquivo que contenha uma seção `[Service]` listando as configurações desejadas. Por exemplo:

```
[Service]
LimitNOFILE=max_open_files
Nice=nice_level
LimitCore=core_file_limit
Environment="LD_PRELOAD=/path/to/malloc/library"
Environment="TZ=time_zone_setting"
```

A discussão aqui usa `override.conf` como o nome deste arquivo. Versões mais recentes do systemd suportam o seguinte comando, que abre um editor e permite que você edite o arquivo:

```
systemctl edit mysqld  # RPM platforms
systemctl edit mysql   # Debian platforms
```

Sempre que você criar ou alterar `override.conf`, recarregar a configuração do systemd, em seguida, diga ao systemd para reiniciar o serviço MySQL:

```
systemctl daemon-reload
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Com systemd, o método de configuração `override.conf` deve ser usado para certos parâmetros, em vez de configurações em um grupo `[mysqld]`, `[mysqld_safe]`, ou `[safe_mysqld]` em um arquivo de opções do MySQL:

- Para alguns parâmetros, `override.conf` deve ser usado porque o próprio systemd deve saber seus valores e não pode ler os arquivos de opção do MySQL para obtê-los.
- Os parâmetros que especificam valores que de outra forma só podem ser definidos usando opções conhecidas por `mysqld_safe` devem ser especificados usando systemd porque não há parâmetro `mysqld` correspondente.

Para obter informações adicionais sobre o uso do systemd em vez do `mysqld_safe`, consulte Migrar do mysqld\_safe para o systemd.

Você pode definir os seguintes parâmetros em `override.conf`:

- Para definir o número de descritores de arquivos disponíveis para o servidor MySQL, use `LimitNOFILE` em `override.conf` em vez da `open_files_limit` variável de sistema para `mysqld` ou `--open-files-limit` opção para `mysqld_safe`.
- Para definir o tamanho máximo do arquivo do núcleo, use `LimitCore` em `override.conf` em vez da opção `--core-file-size` para `mysqld_safe`.
- Para definir a prioridade de agendamento para o servidor MySQL, use `Nice` em `override.conf` em vez da `--nice` opção para `mysqld_safe`.

Alguns parâmetros do MySQL são configurados usando variáveis de ambiente:

- `LD_PRELOAD`: Defina esta variável se o servidor MySQL usar uma biblioteca de alocação de memória específica.
- `NOTIFY_SOCKET`: Esta variável de ambiente especifica o soquete que `mysqld` usa para comunicar a notificação de conclusão da inicialização e mudança de status do serviço com o systemd. É definido pelo systemd quando o serviço `mysqld` é iniciado. O serviço `mysqld` lê a configuração da variável e escreve para o local definido.

  No MySQL 8.4, `mysqld` usa o `Type=notify` tipo de inicialização do processo. (`Type=forking` foi usado no MySQL 5.7.) Com `Type=notify`, o systemd configura automaticamente um arquivo de socket e exporta o caminho para a variável de ambiente `NOTIFY_SOCKET`.
- `TZ`: Defina esta variável para especificar o fuso horário padrão para o servidor.

Existem várias maneiras de especificar valores de variáveis de ambiente para uso pelo processo do servidor MySQL gerenciado pelo systemd:

- Use linhas `Environment` no arquivo `override.conf`. Para a sintaxe, veja o exemplo na discussão anterior que descreve como usar este arquivo.
- Especifique os valores no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir). Atribua valores usando a seguinte sintaxe:

  ```
  LD_PRELOAD=/path/to/malloc/library
  TZ=time_zone_setting
  ```

  Depois de modificar `/etc/sysconfig/mysql`, reinicie o servidor para fazer as alterações efetivas:

  ```
  systemctl restart mysqld  # RPM platforms
  systemctl restart mysql   # Debian platforms
  ```

Para especificar opções para `mysqld` sem modificar os arquivos de configuração do systemd diretamente, defina ou desafine a variável do systemd `MYSQLD_OPTS`. Por exemplo:

```
systemctl set-environment MYSQLD_OPTS="--general_log=1"
systemctl unset-environment MYSQLD_OPTS
```

O `MYSQLD_OPTS` também pode ser definido no arquivo `/etc/sysconfig/mysql`.

Depois de modificar o ambiente systemd, reinicie o servidor para que as alterações sejam efetivas:

```
systemctl restart mysqld  # RPM platforms
systemctl restart mysql   # Debian platforms
```

Para plataformas que usam systemd, o diretório de dados é inicializado se estiver vazio na inicialização do servidor. Isso pode ser um problema se o diretório de dados for uma montagem remota que tenha desaparecido temporariamente: o ponto de montagem pareceria ser um diretório de dados vazio, que então seria inicializado como um novo diretório de dados. Para suprimir esse comportamento de inicialização automática, especifique a seguinte linha no arquivo `/etc/sysconfig/mysql` (crie o arquivo se ele não existir):

```
NO_INIT=true
```

#### Configurar múltiplas instâncias do MySQL usando systemd

Esta seção descreve como configurar o systemd para várias instâncias do MySQL.

::: info Note

Como o systemd tem a capacidade de gerenciar várias instâncias do MySQL em plataformas para as quais o suporte do systemd está instalado, o `mysqld_multi` e o `mysqld_multi.server` não são necessários e não são instalados.

:::

Para usar a capacidade de múltiplas instâncias, modifique o arquivo de opções `my.cnf` para incluir a configuração das opções de chave para cada instância.

- `/etc/my.cnf` ou `/etc/mysql/my.cnf` (plataformas RPM)
- `/etc/mysql/mysql.conf.d/mysqld.cnf` (plataformas Debian)

Por exemplo, para gerenciar duas instâncias nomeadas `replica01` e `replica02`, adicione algo como isso ao arquivo de opções:

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

Os nomes de réplica mostrados aqui usam `@` como delimitador porque é o único delimitador suportado pelo systemd.

As instâncias são então gerenciadas por comandos normais do sistema, como:

```
systemctl start mysqld@replica01
systemctl start mysqld@replica02
```

Para habilitar instâncias para executar na hora de inicialização, faça o seguinte:

```
systemctl enable mysqld@replica01
systemctl enable mysqld@replica02
```

Por exemplo, este comando exibe o status de todas as instâncias de réplica:

```
systemctl status 'mysqld@replica*'
```

Para o gerenciamento de várias instâncias do MySQL na mesma máquina, o systemd usa automaticamente um arquivo de unidade diferente:

- `mysqld@.service` em vez de `mysqld.service` (plataformas RPM)
- `mysql@.service` em vez de `mysql.service` (plataformas Debian)

No arquivo de unidade, `%I` e `%i` fazem referência ao parâmetro passado após o marcador `@` e são usados para gerenciar a instância específica.

```
systemctl start mysqld@replica01
```

systemd inicia o servidor usando um comando como este:

```
mysqld --defaults-group-suffix=@%I ...
```

O resultado é que os grupos de opções `[server]`, `[mysqld]`, e `[mysqld@replica01]` são lidos e usados para essa instância do serviço.

::: info Note

Nas plataformas Debian, o AppArmor impede que o servidor leia ou escreva o `/var/lib/mysql-replica*`, ou qualquer outra coisa que não os locais padrão. Para resolver isso, você deve personalizar ou desativar o perfil no `/etc/apparmor.d/usr.sbin.mysqld`.

:::

::: info Note

Nas plataformas Debian, os scripts de empacotamento para desinstalação do MySQL não podem atualmente lidar com instâncias `mysqld@`. Antes de remover ou atualizar o pacote, você deve parar quaisquer instâncias extras manualmente primeiro.

:::

#### Migração de mysqld\_safe para systemd

Como `mysqld_safe` não é instalado em plataformas que usam systemd para gerenciar o MySQL, as opções especificadas anteriormente para esse programa (por exemplo, em um grupo de opções `[mysqld_safe]` ou `[safe_mysqld]`) devem ser especificadas de outra maneira:

- Algumas opções de `mysqld_safe` também são compreendidas por `mysqld` e podem ser movidas do grupo de opções de `[mysqld_safe]` ou `[safe_mysqld]` para o grupo de opções de `[mysqld]`. Isto não inclui `--pid-file`, `--open-files-limit`, ou `--nice`.

  ::: info Note

  Nas plataformas systemd, o uso de grupos de opções `[mysqld_safe]` e `[safe_mysqld]` não é suportado e pode levar a comportamentos inesperados.

  :::

- Por exemplo, a opção `mysqld_safe` para habilitar o registro `syslog` é `--syslog`, que está desatualizado. Para escrever a saída do registro de erro no registro do sistema, use as instruções na Seção 7.4.2.8, Error Logging to the System Log.

- As opções `mysqld_safe` não compreendidas por `mysqld` podem ser especificadas em `override.conf` ou variáveis de ambiente. Por exemplo, com `mysqld_safe`, se o servidor deve usar uma biblioteca de alocação de memória específica, isso é especificado usando a opção `--malloc-lib`. Para instalações que gerenciam o servidor com systemd, providencie para definir a variável de ambiente `LD_PRELOAD` em vez disso, como descrito anteriormente.
