#### 2.3.2.2 MySQL Configurator CLI

O MySQL Configurator suporta modos GUI (padrão) e CLI (através da passagem de `--console`) usando o executável `mysql_configurator.exe`.

::: info Nota

A funcionalidade do MySQL Configurator CLI foi adicionada no MySQL Configurator 9.2.0.

:::

Executar o MySQL Configurator requer um usuário do Windows com privilégios administrativos, pois, caso contrário, o sistema solicitará as credenciais.

##### Sintaxe CLI

A sintaxe geral é:

```
mysql_configurator.exe --console [--help] | [--action=action_name | -a=action_name] | ...]
```

**Tabela 2.6 Sintaxe**

<table>
	<thead>
		<tr>
			<th>Nome da opção</th>
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
			<td>Ativa o CLI no MySQL Configurator, caso contrário, o GUI é iniciado.</td>
		</tr>
		<tr>
			<td>action</td>
			<td>a</td>
			<td>configure, reconfigure, remove ou upgrade</td>
			<td>--action=configure</td>
			<td>Executa o MySQL Configurator CLI em um novo modo de configuração, reconfiguração, remoção ou atualização.</td>
		</tr>
		<tr>
			<td>help</td>
			<td>h</td>
			<td>N/A</td>
			<td>--help</td>
			<td>Exibe ajuda geral ou ajuda para a ação correspondente. Se não for fornecido o elemento <code>--action</code>, a seção de ajuda geral é exibida.</td>
		</tr>
		<tr>
			<td>opção da ação e valor</td>
			<td>N/A</td>
			<td>Veja a seção "Opções de Configuração/Reconfiguração/Remoção/Atualização" para valores e detalhes suportados</td>
			<td>--datadir="C:MySQL...", --port=3306</td>
			<td>Define as várias opções de configuração disponíveis para cada ação CLI (configuração, reconfiguração, remoção ou atualização)</td>
		</tr>
	</tbody>
</table>

##### Ações disponíveis

Cada ação (configurar, reconfigurar, remover e atualizar) tem um conjunto específico de opções que definem os elementos a serem configurados ao realizar a operação. A sintaxe é *`--action_option`*=*`action_value`* com uma lista completa das opções de ação abaixo:

**Tabela 2.7 Opções de ação**

<table><thead><tr> <th>Opção</th> <th>Atalho</th> <th>Aliases</th> <th>Tipo</th> <th>Valores</th> <th>Valor padrão</th> <th>Ação</th> <th>Condição</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>datadir</td> <td>d</td> <td>data-dir, data-directory</td> <td>Caminho</td> <td>N/A</td>  `"C:ProgramDataMySQLMySQL Server x.x"` onde <code>x.x</code> corresponde à versão principal e menor do servidor.</td> <td>configure</td> <td>N/A</td> <td>Configura</td> <td>N/A</td> <td>Optimiza os recursos do sistema dependendo do uso pretendido da instância do servidor.</td> </tr><tr> <td>config-type</td> <td>N/A</td> <td>configuration-type</td> <td>lista</td> <td>Developer, Server, Dedicated, Manual</td> <td>development</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Otimiza os recursos do sistema de acordo com o uso pretendido da instância do servidor.</td> </tr><tr> <td>enable-tcp-ip</td> <td>N/A</td> <td>N/A</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Indica se o servidor permite conexões através do TCP/IP.</td> </tr><tr> <td>port</td> <td>P</td> <td>N/A</td> <td>número</td> <td>N/A</td> <td>3306</td> <td>configure, reconfigure</td> <td>enable-tcp-ip=true</td> <td>O número de porta a usar ao ouvir conexões TCP/IP.</td> </tr><tr> <td>mysqlx-port</td> <td>X</td> <td>x-port, xport</td> <td>número</td> <td>N/A</td> <td>3306</td> <td>configure, reconfigure</td> <td>enable-tcp-ip=true</td> <td>O nome do porto de rede no qual o Plugin X/MySQL Server escuta conexões TCP/IP. Este é o equivalente ao <code class="option">port</code>.</td> </tr><tr> <td>open_win_firewall</td> <td>N/A</td> <td>open-windows-firewall, openfirewall</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>enable-tcp-ip=true</td> <td>Cria regras do Firewall do Windows para conexões TCP/IP tanto para a opção <code class="option">port</code> quanto para o porto <code class="option">mysqlx-port</code>.</td> </tr><tr> <td>enable-named-pipes</td> <td>N/A</td> <td>named-pipes</td> <td>bool</td> <td>true, false</td> <td>false</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Indica se o servidor permite conexões através de um pipe nomeado.</td> </tr><tr> <td>socket</td> <td>N/A</td> <td>pipe-name, named-pipe-name, named-pipe, pipename</td> <td>string</td> <td>N/A</td>  `"MYSQL"`</td> <td>configure, reconfigure</td> <td>enable-named-pipes=true</td> <td>Especifica o nome do pipe nomeado a usar ao ouvir conexões locais que utilizam um pipe nomeado. O valor padrão é MySQL, e não é case-sensitive.</td> </tr><tr> <td>named-pipe-full-access-group</td> <td>N/A</td> <td>full-access-group</td> <td>string</td> <td>N/A</td> EmptyString</td> <td>configure, reconfigure</td> <td>enable-named-pipes=true</td> <td>Define o nome de um grupo local do Windows cujos membros recebem acesso suficiente do servidor para usar clientes de pipe nomeado. O valor padrão é uma string vazia, o que significa que nenhum usuário do Windows tem acesso total ao pipe nomeado.</td> </tr><tr> <td>shared-memory</td> <td>N/A</td> <td>enable-shared-memory</td> <td>bool</td> <td>true, false</td> <td>false</td> <td>configure, upgrade</td> <td>N/A</td> <td>Indica se o servidor permite conexões compartilhadas de memória.</td> </tr><tr> <td>shared-memory-base-name</td> <td>N/A</td> <td>shared-memory-name, shared-mem-name</td> <td>string</td> <td>N/A</td>  `"MYSQL"`</td> <td>configure, reconfigure</td> <td>shared-memory=true</td> <td>Nome da conexão compartilhada de memória usada para comunicar-se com o servidor.</td> </tr><tr> <td>password</td> <td>p</td> <td>pwd, root-password, passwd, rootpasswd</td> <td>string</td> <td>N/A</td>

##### Gerenciamento de Usuários do MySQL

As ações de configurar e reconfigurar permitem que você crie e edite usuários do MySQL conforme a opção `--add-user`:

* `--add-user='nome_do_usuario':'senha'|'caminho_do_arquivo'|'token_de_segurança_do_windows':host:role:autenticação`

  Só válido para a ação de configurar (não reconfigurar).

O nome de usuário, senha e caminho do arquivo de token devem estar entre aspas simples ou duplas. Escape as aspas simples, duplas e barras invertidas se estiverem presentes no nome de usuário ou senha.

Exemplos de adição de usuário:

```
mysql_configurator.exe --console --action=configure --add-user='john':'mypass12%':%:"Db Admin":MYSQL
mysql_configurator.exe --console --action=configure --add-user='jenny':'jenny-T480jenny':localhost:"Administrator":Windows
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

   Passe as senhas como `--password` (para configuração e reconfiguração) ou `--old-instance-password` (para atualizações) na linha de comando.
2. Definir senhas no arquivo de configuração do MySQL `my.ini`:

   Ter a entrada ``password={password_here}` diretamente no `my.ini` define a senha do usuário root.

   Ter a entrada ``password={password_here}` no arquivo de configuração extra (de acordo com `--defaults-extra-file`) pode definir a senha do usuário root.
3. Definir senhas usando variáveis de ambiente:

   `MYSQL_PWD`: Semelhante ao cliente MySQL, o valor definido na variável de ambiente `MYSQL_PWD` pode definir a senha do usuário root se nenhum outro método foi usado para defini-la. Esta variável se aplica às ações de configurar, reconfigurar e atualizar.

   `WIN_SERVICE_ACCOUNT_PWD`: Esta variável de ambiente pode definir a senha do usuário da conta de serviço do Windows que está configurada para executar o Serviço MySQL do Windows se o servidor tiver sido configurado para ser executado como serviço. Esta variável se aplica às ações de configurar e reconfigurar.