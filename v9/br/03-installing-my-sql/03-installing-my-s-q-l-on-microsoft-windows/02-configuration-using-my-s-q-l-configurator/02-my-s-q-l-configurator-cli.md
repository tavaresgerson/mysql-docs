#### 2.3.2.2 MySQL Configurator CLI

O MySQL Configurator suporta modos GUI (padrão) e CLI (através da passagem de `--console`) usando o executável `mysql_configurator.exe`.

Observação

A funcionalidade do MySQL Configurator CLI foi adicionada no MySQL Configurator 9.2.0.

Para executar o MySQL Configurator, é necessário um usuário do Windows com privilégios administrativos, pois, caso contrário, o sistema solicitará as credenciais.

##### Sintaxe CLI

A sintaxe geral é:

```
mysql_configurator.exe --console [--help] | [--action=action_name | -a=action_name] | ...]
```

**Tabela 2.6 Sintaxe

<table summary="Sintaxe da interface de linha de comando do MySQL Configurator"><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><thead><tr> <th>Nome da opção</th> <th>Atalho</th> <th>Valores suportados</th> <th>Exemplo de uso</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>console</td> <td>c</td> <td>N/A</td> <td>--console</td> <td>Ativa a interface de linha de comando no MySQL Configurator, caso contrário, a GUI é iniciada.</td> </tr><tr> <td>action</td> <td>a</td> <td>configure, reconfigure, remove ou upgrade</td> <td>--action=configure</td> <td>Executa a interface de linha de comando do MySQL Configurator no modo de nova configuração, reconfiguração, remoção ou atualização.</td> </tr><tr> <td>help</td> <td>h</td> <td>N/A</td> <td>--help</td> <td>Exibe a ajuda geral ou a ajuda para a ação correspondente. Se não for fornecido o elemento <code>--action</code>, a seção de ajuda geral é exibida.</td> </tr><tr> <td>opção e valor da ação</td> <td>N/A</td> <td>Consulte a seção "Opções de Configurar/Reconfigurar/Remover/Atualizar" para valores e detalhes suportados</td> <td>--datadir="C:\MySQL...", --port=3306</td> <td>Define as várias opções de configuração disponíveis para cada ação de linha de comando (configuração, reconfiguração, remoção ou atualização)</td> </tr></tbody></table>

##### Ações disponíveis

Cada ação (configurar, reconfigurar, remover e atualizar) tem um conjunto específico de opções que definem os elementos a serem configurados ao realizar a operação. A sintaxe é *`--action_option`*=*`action_value`* com uma lista completa das opções de ação abaixo:

**Tabela 2.7 Opções de ação**

<table summary="Ações da interface de linha de comando do MySQL Configurator"><tr><th>Opção</th><th>Atalho</th><th>Aliases</th><th>Tipo</th><th>Valores</th><th>Valor padrão</th><th>Ação</th><th>Condição</th><th>Descrição</th></tr><tr><th>datadir</th><th>d</th><th>data-dir, data-directory</th><th>Caminho</th><th>N/A</th><th>"C:\ProgramData\MySQL\MySQL Server x.x" onde <code>x.x</code> corresponde à versão major e minor do servidor.</th><td>configure</td><td>N/A</td><td>O caminho para o diretório de dados do MySQL. Esta opção define a variável de sistema <code>datadir</code>.</td></tr><tr><th>config-type</th><th>N/A</th><th>configuration-type</th><th>Lista</th><th>N/A</th><th>N/A</th><td>Developer, Server, Dedicated, Manual</td><td>development</td><td>configure, reconfigure</td><td>N/A</td><td>Optimiza os recursos do sistema dependendo do uso pretendido da instância do servidor.</td></tr><tr><th>enable-tcp-ip</th><th>N/A</th><th>N/A</th><th>bool</th><th>true, false</th><td>true</td><td>configure, reconfigure</td><td>N/A</td><td>Indica se o servidor permite conexões através do TCP/IP.</td></tr><tr><th>port</th><th>P</th><th>N/A</th><th>number</th><th>N/A</th><td>3306</td><td>configure, reconfigure</td><td>enable-tcp-ip=true</td><td>O número de porta a usar ao ouvir conexões TCP/IP.</td></tr><tr><th>mysqlx-port</th><th>X</th><th>x-port, xport</th><th>number</th><th>N/A</th><td>3306</td><td>configure, reconfigure</td><td>enable-tcp-ip=true</td><td>O número de porta de rede do X Plugin que escuta conexões TCP/IP. Este é o equivalente de <code>port</code>.</td></tr><tr><th>open_win_firewall</th><th>N/A</th><th>open-windows-firewall, openfirewall</th><th>bool</th><th>true, false</th><td>true</td><td>configure, reconfigure</td><td>enable-tcp-ip=true</td><td>Cria regras do firewall do Windows para conexões TCP/IP tanto para as opções <code>port</code> quanto <code>mysqlx-port</code>.</td></tr><tr><th>upgrade-enterprise-firewall</th><th>N/A</th><th><p> upgrade-ent-fw, upgrade-ef</p></th><th>bool</th><th>true, false</th><td>false</td><td>upgrade</td><td>N/A</td><td>Atualize o plugin firewall deprecated para o componente firewall do MySQL Enterprise.</td></tr><tr><th>enable-named-pipes</th><th>N/A</th><th>named-pipes</th><th>bool</th><th>true, false</th><td>false</td><td>configure, reconfigure</td><td>N/A</td><td>Indica se o servidor permite conexões através de um pipe nomeado.</td></tr><tr><th>socket</th><th>N/A</th><th>pipe-name, named-pipe-name, named-pipe, pipename</th><th>string</th><th>N/A</th><th>MYSQL</th><td>configure, reconfigure</td><td>enable-named-pipes=true</td><td>Especifica o nome do cliente de pipe nomeado usado para comunicar com o servidor. O valor padrão é MySQL, e não é case-sensitive.</td></tr><tr><th>named-pipe-full-access-group</th><th>N/A</th><th>full-access-group</th><th>string</th><th>N/A</th><th>"" (string vazio)</th><td>N/A</td><td>configure, reconfigure</td><td>enable-named-pipes=true</td><td>Define o nome de um grupo local do Windows cujo membros recebem acesso suficiente por meio do servidor para usar clientes de pipe nomeados. O valor padrão é uma string vazia, o que significa que nenhum usuário do Windows tem acesso total ao pipe nomeado.</td></tr><tr><th>shared-memory</th><th>N/A</th><th>enable-shared-memory</th><th>bool</th><th>true, false</th><td>false</td><td>configure, reconfigure</td><td>N/A</td><td>Indica se o servidor permite conexões compartilhadas de memória.</td></tr><tr><th>shared-memory-base-name</th><th>N/A</th><th>shared-memory-name, shared-mem-name</th><th>string</th><th>N/A</th><th>MYSQL</th><td>configure, reconfigure</td><td>shared-memory=true</td><td>Nome da conexão compartilhada de memória usada para comunicar com o servidor.</td></tr><tr><th>password</th><th>p</th><th>pwd, root-password, passwd, rootpasswd</th><th>string</th><th>N/A</th><th>N/A</th><td>configure, reconfigure</td><td>N/A</td><td>A senha atribuída ao usuário root durante uma configuração ou reconfiguração. A senha

##### Gerenciamento de Usuários do MySQL

As ações de configurar e reconfigurar permitem que você crie e edite usuários do MySQL conforme a opção `--add-user`:

* `--add-user='nome_do_usuario':'senha'`|'caminho_do_arquivo'`|'token_de_segurança_do_Windows`':host:role:autenticação

  Só válido para a ação de configurar (não reconfigurar).

O nome de usuário, senha e caminho do arquivo do token devem estar entre aspas simples ou duplas. Escape as aspas simples, duplas e barras invertidas se estiverem presentes no nome de usuário ou senha.

Exemplos de adição de usuário:

```
mysql_configurator.exe --console --action=configure --add-user='john':'mypass12%':%:"Db Admin":MYSQL
mysql_configurator.exe --console --action=configure --add-user='jenny':'jenny-T480\jenny':localhost:"Administrator":Windows
```

##### Exemplos Gerais

Uma nova configuração:

```
# Simple
mysql_configurator.exe --console --action=configure --password=test

# More complex
mysql_configurator.exe --console --action=configure --password=test --port=3320 --enable-pipe-names --pipe-name=MYSQL_PIPE --server-id=2 --install-sample-database=both

# More complex, also with users
mysql_configurator.exe --console --action=configure --password=other123 --add-user='john':'pa$$':"Db Admin":MYSQL --add-user='mary':'p4ssW0rd':"Administrator":MYSQL
```

Uma reconfiguração:

```
# Basic reconfiguration
mysql_configurator.exe --console --action=reconfigure --password=test --port=3310

# Complex reconfiguration
mysql_configurator.exe --console --action=reconfigure --password=test --enable-shared-memory=false
```

Uma remoção:

```
mysql_configurator.exe --console --action=remove --keep-data-directory=true
```

Uma atualização:

```
# Basic removal
mysql_configurator.exe --console --action=upgrade --old-instance-password=test

# Complex removal
mysql_configurator.exe --console --action=upgrade --old-instance-password=test --backup-data=false --server-file-permissions-access=full
```

##### Gerenciamento da Senha do Usuário Root

Existem várias maneiras de passar a senha do usuário root, dependendo das necessidades em termos de segurança e simplicidade. Os diferentes métodos, em ordem de precedência:

1. Passar senhas como argumentos da linha de comando:

   Passe as senhas `--password` (para configuração e reconfiguração) ou `--old-instance-password` (para atualizações) na linha de comando.

2. Definir senhas no arquivo de configuração do MySQL `my.ini`:

   Ter a entrada "password={senha_aqui}" diretamente no `my.ini` define a senha do usuário root.

   Ter a entrada "password={senha_aqui}" no arquivo de configuração extra (de acordo com `--defaults-extra-file`) pode definir a senha do usuário root.

3. Definir senhas usando variáveis de ambiente:

   `MYSQL_PWD`: Semelhante ao cliente MySQL, o valor definido na variável de ambiente `MYSQL_PWD` pode definir a senha do usuário root se nenhum outro método foi usado para defini-la. Esta variável se aplica às ações de configurar, reconfigurar e atualizar.

`WIN_SERVICE_ACCOUNT_PWD`: Esta variável de ambiente pode definir a senha do usuário da conta de serviço do Windows que está configurada para executar o serviço MySQL do Windows, se o servidor tiver sido configurado para ser executado como um serviço. Esta variável se aplica às ações de configuração e recarga.