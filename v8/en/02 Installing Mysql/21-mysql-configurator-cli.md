#### 2.3.2.2 MySQL Configurator CLI

O MySQL Configurator suporta modos GUI (padrão) e CLI (através da passagem de `--console`) usando o executável `mysql_configurator.exe`.

::: info Nota

A funcionalidade do MySQL Configurator CLI foi adicionada no MySQL Configurator 9.2.0.

:::

Para executar o MySQL Configurator, é necessário um usuário do Windows com privilégios administrativos, pois, caso contrário, o sistema solicitará as credenciais.

##### Sintaxe CLI

A sintaxe geral é:

```
mysql_configurator.exe --console [--help] | [--action=action_name | -a=action_name] | ...]
```

**Tabela 2.6 Sintaxe**

<table>
   <thead>
      <tr>
         <th>Nome da ação</th>
         <th>Atalho</th>
         <th>Valores suportados</th>
         <th>Exemplo de uso</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>console</td>
         <td>c</td>
         <td>N/A</td>
         <td>--console</td>
         <td>Ativa o CLI no Configuratore MySQL, caso contrário, o GUI é iniciado.</td>
      </tr>
      <tr>
         <td>action</td>
         <td>a</td>
         <td>configure, reconfigure, remove ou upgrade</td>
         <td>--action=configure</td>
         <td>Executa o CLI do Configuratore MySQL em modo de nova configuração, reconfiguração, remoção ou atualização.</td>
      </tr>
      <tr>
         <td>help</td>
         <td>h</td>
         <td>N/A</td>
         <td>--help</td>
         <td>Exibe ajuda geral ou ajuda para a ação correspondente. Se não for fornecido o elemento <code>--action</code>, a seção de ajuda geral é exibida.</td>
      </tr>
      <tr>
         <td>opção e valor da ação</td>
         <td>N/A</td>
         <td>Consulte a seção "Opções de Configurar/Reconfigurar/Remover/Atualizar" para valores e detalhes suportados</td>
         <td>--datadir="C:MySQL...", --port=3306</td>
         <td>Define as várias opções de configuração disponíveis para cada ação do CLI (configuração, reconfiguração, remoção ou atualização)</td>
      </tr>
   </tbody>
</table>

Cada ação (configurar, reconfigurar, remover e atualizar) tem um conjunto específico de opções que definem os elementos a serem configurados ao realizar a operação. A sintaxe é *`--action_option`*=*`action_value`* com uma lista completa das opções de ação abaixo:

**Tabela 2.7 Opções de Ação**

<table>
   <thead>
      <tr>
         <th>Opção</th>
         <th>Atalho</th>
         <th>Aliases</th>
         <th>Tipo</th>
         <th>Valores</th>
         <th>Valor padrão</th>
         <th>Ação</th>
         <th>Condição</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>datadir</td>
         <td>d</td>
         <td>data-dir, data-directory</td>
         <td>Caminho</td>
         <td>N/A</td>
         <td>"C:ProgramDataMySQLMySQL Server x.x" onde <code>x.x</code> corresponde à versão principal e menor do servidor.</td>
         <td>configure</td>
         <td>N/A</td>
         <td>Configura a variável de sistema <code>datadir</code>.</td>
      </tr>
      <tr>
         <td>config-type</td>
         <td>N/A</td>
         <td>list</td>
         <td>list</td>
         <td>Desenvolvedor, Servidor, Dedicado, Manual</td>
         <td>desenvolvedor, servidor, dedicado</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Optimiza os recursos do sistema dependendo do uso pretendido da instância do servidor.</td>
      </tr>
      <tr>
         <td>enable-tcp-ip</td>
         <td>N/A</td>
         <td>N/A</td>
         <td>bool</td>
         <td>true, false</td>
         <td>true</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Indica se o servidor permite conexões através de TCP/IP.</td>
      </tr>
      <tr>
         <td>port</td>
         <td>P</td>
         <td>N/A</td>
         <td>número</td>
         <td>N/A</td>
         <td>3306</td>
         <td>configure, reconfigure</td>
         <td>enable-tcp-ip=true</td>
         <td>O número de porta a usar ao ouvir conexões TCP/IP.</td>
      </tr>
      <tr>
         <td>mysqlx-port</td>
         <td>X</td>
         <td>x-port, xport</td>
         <td>número</td>
         <td>N/A</td>
         <td>3306</td>
         <td>configure, reconfigure</td>
         <td>enable-tcp-ip=true</td>
         <td>O equivalente do X Plugin à porta.</td>
      </tr>
      <tr>
         <td>open_win_firewall</td>
         <td>N/A</td>
         <td>open-windows-firewall, openfirewall</td>
         <td>bool</td>
         <td>true, false</td>
         <td>true</td>
         <td>configure, reconfigure</td>
         <td>enable-tcp-ip=true</td>
         <td>Cria regras de firewall do Windows para conexões TCP/IP tanto para a porta quanto para o X Plugin.</td>
      </tr>
      <tr>
         <td>enable-named-pipes</td>
         <td>N/A</td>
         <td>named-pipes</td>
         <td>bool</td>
         <td>true, false</td>
         <td>false</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Indica se o servidor permite conexões através de named pipes.</td>
      </tr>
      <tr>
         <td>socket</td>
         <td>N/A</td>
         <td>pipe-name, named-pipe-name, named-pipe</td>
         <td>string</td>
         <td>N/A</td>
         <td>MYSQL</td>
         <td>configure, reconfigure</td>
         <td>enable-named-pipes=true</td>
         <td>Especifica o nome do pipe usado ao ouvir conexões locais que utilizam um named pipe. O valor padrão é MySQL, e não é case-sensitive.</td>
      </tr>
      <tr>
         <td>named-pipe-full-access-group</td>
         <td>N/A</td>
         <td>full-access-group</td>
         <td>string</td>
         <td>"", <span><em>everyone</em></span>, válido o nome de grupo local do Windows</td>
         <td>"" (string vazio)</td>
         <td>configure, reconfigure</td>
         <td>enable-named-pipes=true</td>
         <td>Define o nome de um grupo de usuários do Windows cujos membros tenham acesso suficiente por parte do servidor para utilizar clientes de named pipe. O valor padrão é um string vazio, o que significa que nenhum usuário do Windows tem acesso total ao named pipe.</td>
      </tr>
      <tr>
         <td>shared-memory</td>
         <td>N/A</td>
         <td>enable-shared-memory</td>
         <td>bool</td>
         <td>true, false</td>
         <td>false</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Indica se o servidor permite conexões compartilhadas de memória.</td>
      </tr>
      <tr>
         <td>shared-memory-base-name</td>
         <td>N/A</td>
         <td>shared-memory-name, shared-mem-name</td>
         <td>string</td>
         <td>N/A</td>
         <td>MYSQL</td>
         <td>configure, reconfigure</td>
         <td>shared-memory=true</td>
         <td>Nome da conexão compartilhada de memória usada para comunicar-se com o servidor.</td>
      </tr>
      <tr>
         <td>password</td>
         <td>p</td>
         <td>pwd, root-password, passwd, rootpasswd</td>
         <td>string</td>
         <td>N/A</td>
         <td>N/A</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>A senha atribuída ao usuário root durante uma configuração ou reconfiguração. A senha não pode ser alterada durante uma reconfiguração, embora seja necessária para validar uma conexão ao servidor.</td>
      </tr>
      <tr>
         <td>configure-as-service</td>
         <td>N/A</td>
         <td>as-windows-service, as-win-service</td>
         <td>bool</td>
         <td>true, false</td>
         <td>true</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Configura o servidor MySQL Server para funcionar como um serviço do Windows. Por padrão, o serviço do Windows funciona usando a conta padrão do sistema (Network Service).</td>
      </tr>
      <tr>
         <td>windows-service-name</td>
         <td>N/A</td>
         <td>service-name, win-service-name, servicename</td>
         <td>string</td>
         <td>"MySQLxx" onde <code>xx</code> corresponde à versão principal e menor do servidor.</td>
         <td>configure, reconfigure</td>
         <td>configure-as-service=true</td>
         <td>O nome dado ao serviço do Windows usado para executar o servidor MySQL.</td>
      </tr>
      <tr>
         <td>windows-service-auto-start</td>
         <td>N/A</td>
         <td>win-service-auto-start, service-auto-start, autostart</td>
         <td>bool</td>
         <td>true, false</td>
         <td>true</td>
         <td>configure, reconfigure</td>
         <td>configure-as-service=true</td>
         <td>Se configurado como um serviço do Windows, este valor define se o serviço deve iniciar automaticamente ao iniciar o sistema.</td>
      </tr>
      <tr>
         <td>windows-service-user</td>
         <td>N/A</td>
         <td>win-service-user, service-user</td>
         <td>string</td>
         <td>N/A</td>
         <td>NT AUTHORITY</td>
         <td>configure, reconfigure</td>
         <td>configure-as-service=true</td>
         <td>O nome de um usuário do Windows que deve executar o serviço do Windows.</td>
      </tr>
      <tr>
         <td>windows-service-password</td>
         <td>N/A</td>
         <td>win-service-password, win-service-pwd, service-password, servicepwd</td>
         <td>string</td>
         <td>N/A</td>
         <td>"" (string vazio)</td>
         <td>configure, reconfigure</td>
         <td>configure-as-service=true</td>
         <td>O nome de um usuário do Windows que deve executar o serviço do Windows.</td>
      </tr>
      <tr>
         <td>server-file-permissions-access</td>
         <td>N/A</td>
         <td>server-file-access</td>
         <td>comma-separated list</td>
         <td>FullAccess, Configure, Manual</td>
         <td>windows users/groups</td>
         <td>user running the Windows service (if applicable) and Administrators group</td>
         <td>server-file-permissions-access=configure</td>
         <td>Define uma lista de separação por vírgula de usuários ou grupos que têm permissão para acessar os arquivos do servidor.</td>
      </tr>
      <tr>
         <td>server-file-no-access-list</td>
         <td>N/A</td>
         <td>no-access-list</td>
         <td>comma-separated list</td>
         <td>windows users/groups</td>
         <td>empty</td>
         <td>configure, reconfigure</td>
         <td>server-file-permissions-access=configure</td>
         <td>Define uma lista de separação por vírgula de usuários ou grupos que não devem ter acesso aos arquivos do servidor.</td>
      </tr>
      <tr>
         <td>enable-error-log</td>
         <td>N/A</td>
         <td>enable-err-log</td>
         <td>bool</td>
         <td>true, false</td>
         <td>true</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Habilita o log de erros. O log de erros contém um registro dos tempos de inicialização e desligamento do mysqld. Também contém mensagens de diagnóstico, como erros, avisos e notas, durante o funcionamento do servidor.</td>
      </tr>
      <tr>
         <td>log-error</td>
         <td>N/A</td>
         <td>error-log, logname</td>
         <td>File Name</td>
         <td>N/A</td>
         ="{host_name}.err</td>
         <td>configure, reconfigure</td>
         <td>log-error=true</td>
         <td>O nome do arquivo do log de erros. Se um caminho não for fornecido, o local do arquivo é o diretório de dados.</td>
      </tr>
      <tr>
         <td>general-log</td>
         <td>N/A</td>
         <td>generallogname</td>
         <td>File Name</td>
         <td>N/A</td>
         ="{host_name}-gen.log</td>
         <td>configure, reconfigure</td>
         <td>general-log=true</td>
         <td>O nome do arquivo do log geral.</td>
      </tr>
      <tr>
         <td>install-sample-database</td>
         <td>N/A</td>
         <td>install-example-database</td>
         <td>list</td>
         <td>All, Sakila, World, None</td>
         <td>none</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Instala as bases de dados de amostra especificadas.</td>
      </tr>
      <tr>
         <td>uninstall-sample-database</td>
         <td>N/A</td>
         <td>uninstall-example-database</td>
         <td>list</td>
         <td>All, Sakila, World, None</td>
         <td>none</td>
         <td>configure, reconfigure</td>
         <td>N/A</td>
         <td>Desinstala as bases de dados de amostra especificadas.</td>
      </tr>
      <tr>
         <td>old-instance-protocol</td>
         <td>N/A</td>
         <td>existing-instance-protocol</td>
         <td>list</td>
         <td>Socket, Sockets, Tcp, Pipe, NamedPipe, SharedMemory, Memory</td>
         <td>N/A</td>
         <td>tcp-ip</td>
         <td>upgrade</td>
         <td>O protocolo de conexão usado pela instância do servidor que está sendo atualizada.</td>
      </tr>
      <tr>
         <td>old-instance-port</td>
         <td>N/A</td>
         <td>existing-instance-port</td>
         <td>number</td>
         <td>N/A</td>
         <td>3306</td>
         <td>upgrade</td>
         <td>N/A</td>
         <td>O número de porta a usar pela instância do servidor que está sendo atualizada ao ouvir conexões TCP/IP.</td>
      </tr>
      <tr>
         <td>old-instance-pipe-name</td>
         <td>N/A</td>
         <td>existing-instance-pipe-name</td>
         <td>string</td>
         <td>N/A</td>
         <td>MYSQL</td>
         <td>upgrade</td>
         <td>N/A</td>
         <td>Especifica o nome do pipe usado pela instância do servidor que está sendo atualizada ao ouvir conexões locais que utilizam um named pipe. O valor padrão é MySQL, e não é case-sensitive.</td>
      </tr>
      <tr>
         <td>old-instance-password</td>
         <td>N/A</td>
         <td>old-instance-pwd, old-instance-root-password, existing-instance-password, existing-instance-pwd, existing-instance-pwd</td>
         <td>string</td>
         <td>N/A</td>
         <td>N/A</td>
         <td>upgrade</td>
         <td>N/A</td>
         <td>A senha do usuário root usada pela instância do servidor que está sendo atualizada.</td>
      </tr>
   </tbody>
</table>

##### Gerenciamento de Usuários do MySQL

As ações de configurar e reconfigurar permitem que você crie e edite usuários do MySQL conforme a opção `--add-user`:

* `--add-user='nome_do_usuário':'senha'|'caminho_do_arquivo'|'token_de_segurança_do_Windows':host:role:autenticação`

  Só válido para a ação de configurar (não reconfigurar).

O nome de usuário, senha e caminho do arquivo do token devem estar entre aspas simples ou duplas. Escape as aspas simples, duplas e barras invertidas se estiverem presentes no nome de usuário ou senha.

Exemplos de adição de usuários:

```
mysql_configurator.exe --console --action=configure --add-user='john':'mypass12%':%:"Db Admin":MYSQL
mysql_configurator.exe --console --action=configure --add-user='jenny':'jenny-T480jenny':localhost:"Administrator":Windows
```

##### Exemplos Gerais

Uma nova configuração:

```
# Simples
mysql_configurator.exe --console --action=configure --password=test

# Mais complexo
mysql_configurator.exe --console --action=configure --password=test --port=3320 --enable-pipe-names --pipe-name=MYSQL_PIPE --server-id=2 --install-sample-database=both

# Mais complexo, também com usuários
mysql_configurator.exe --console --action=configure --password=other123 --add-user='john':'pa$$':"Db Admin":MYSQL --add-user='mary':'p4ssW0rd':"Administrator":MYSQL
```

Uma reconfiguração:

```
# Reconfiguração básica
mysql_configurator.exe --console --action=reconfigure --password=test --port=3310

# Reconfiguração complexa
mysql_configurator.exe --console --action=reconfigure --password=test --enable-shared-memory=false
```

Uma remoção:

```
mysql_configurator.exe --console --action=remove --keep-data-directory=true
```

Uma atualização:

```
# Remoção básica
mysql_configurator.exe --console --action=upgrade --old-instance-password=test

# Remoção complexa
mysql_configurator.exe --console --action=upgrade --old-instance-password=test --backup-data=false --server-file-permissions-access=full
```

##### Gerenciamento da Senha do Usuário Root

Existem várias maneiras de passar a senha do usuário root, dependendo das necessidades em termos de segurança e simplicidade. Os diferentes métodos, em ordem de precedência:

1. Passar senhas como argumentos da linha de comando:

   Passe as senhas `--password` (para configuração e reconfiguração) ou `--old-instance-password` (para atualizações) na linha de comando.
2. Definir senhas no arquivo de configuração MySQL `my.ini`:

   Ter a entrada ``password={password_here}` diretamente no `my.ini` define a senha do usuário root.

   Ter a entrada ``password={password_here}` no arquivo de configuração extra (de acordo com `--defaults-extra-file`) pode definir a senha do usuário root.
3. Definir senhas usando variáveis de ambiente:

   `MYSQL_PWD`: Semelhante ao cliente MySQL, o valor definido na variável de ambiente `MYSQL_PWD` pode definir a senha do usuário root se nenhum outro método foi usado para defini-la. Esta variável se aplica às ações de configurar, reconfigurar e atualizar.

`WIN_SERVICE_ACCOUNT_PWD`: Esta variável de ambiente pode definir a senha do usuário da conta de serviço do Windows que está configurada para executar o serviço MySQL do Windows, se o servidor tiver sido configurado para ser executado como um serviço. Esta variável se aplica às ações de configuração e recarga.