## 19.2 Configurando o MySQL como um Document Store

19.2.1 Instalando o MySQL Shell

19.2.2 Iniciando o MySQL Shell

Para usar o MySQL 5.7 como um document store, o X Plugin precisa ser instalado. Em seguida, você pode usar o X Protocol para se comunicar com o server. Sem o X Plugin em execução, os clients X Protocol não podem se conectar ao server. O X Plugin é fornecido com o MySQL (5.7.12 ou superior) — a instalação dele não requer um download separado. Esta seção descreve como instalar o X Plugin.

Siga os passos descritos aqui:

1. **Instale ou faça o upgrade para o MySQL 5.7.12 ou superior.**

   Quando a instalação ou o upgrade estiver concluído, inicie o server. Para instruções de inicialização do server, consulte a Seção 2.9.2, “Starting the Server”.

   Nota

   O MySQL Installer permite que você execute esta e a próxima etapa (Instalar o X Plugin) ao mesmo tempo para novas instalações no Microsoft Windows. Na tela Plugin and Extensions, marque a caixa de seleção Enable X Protocol/MySQL as a Document Store. Após a instalação, verifique se o X Plugin foi instalado.

2. **Instale o X Plugin.** Uma conta que não seja `root` pode ser usada para instalar o plugin, desde que a conta tenha o privilégio `INSERT` para a tabela `mysql.plugin`.

   Sempre salve suas configurações existentes antes de reconfigurar o server.

   Para instalar o X Plugin integrado, faça um dos seguintes:

   * Usando o MySQL Installer para Windows:

     1. Inicie o MySQL Installer para Windows. O painel do MySQL Installer será aberto.

     2. Clique na ação rápida Reconfigure para o MySQL Server. Use Next e Back para configurar os seguintes itens:

        + Em Accounts and Roles, confirme a senha atual da conta `root`.

        + Em Plugin and Extensions, marque a caixa de seleção Enable X Protocol/MySQL as a Document Store. O MySQL Installer fornece um número de porta padrão e abre a porta do firewall para acesso à rede.

        + Em Apply Server Configuration, clique em Execute.

        + Clique em Finish para fechar o MySQL Installer.

     3. Instale o MySQL Shell.

   * Usando o MySQL Shell:

     1. Instale o MySQL Shell.

     2. Abra uma janela de terminal (prompt de comando no Windows) e navegue até o local dos binários do MySQL (por exemplo, `/usr/bin/` no Linux).

     3. Execute o seguinte comando:

        ```sql
        mysqlsh -u user -h localhost --classic --dba enableXProtocol
        ```

   * Usando o MySQL Client program:

     1. Abra uma janela de terminal (prompt de comando no Windows) e navegue até o local dos binários do MySQL (por exemplo, `/usr/bin/` no Linux).

     2. Invoque o **mysql** command-line client:

        ```sql
        mysql -u user -p
        ```

     3. Emita a seguinte declaração:

        ```sql
        mysql> INSTALL PLUGIN mysqlx SONAME 'mysqlx.so';
        ```

        Substitua `mysqlx.so` por `mysqlx.dll` para Windows.

        Importante

        O user `mysql.session` deve existir antes que você possa carregar o X Plugin. O `mysql.session` foi adicionado na versão 5.7.19 do MySQL. Se o seu dicionário de dados foi inicializado usando uma versão anterior, você deve executar o procedimento **mysql_upgrade**. Se o upgrade não for executado, o X Plugin falhará ao iniciar com a mensagem de erro There was an error when trying to access the server with user: mysql.session@localhost. Make sure the user is present in the server and that mysql_upgrade was ran after a server update..

     4. Instale o MySQL Shell.

3. **Verifique se o X Plugin foi instalado.**

   Quando o X Plugin está instalado corretamente, ele aparece na lista ao consultar os plugins ativos no server com um dos seguintes comandos:

   * Comando do MySQL Shell:

     ```sql
     mysqlsh -u user --sqlc -e "show plugins"
     ```

   * Comando do MySQL Client program:

     ```sql
     mysql -u user -p -e "show plugins"
     ```

   Se você encontrar problemas com a instalação do X Plugin, ou se quiser aprender sobre formas alternativas de instalar, configurar ou desinstalar server plugins, consulte a Seção 5.5.1, “Installing and Uninstalling Plugins”.

### A Conta de User `mysqlxsys@localhost`

A instalação do X Plugin cria uma conta de user `mysqlxsys@localhost`. Se, por algum motivo, a criação da conta falhar, a instalação do X Plugin também falha. Aqui está uma explicação sobre para que serve a conta de user `mysqlxsys@localhost` e o que fazer quando sua criação falha.

O processo de instalação do X Plugin usa o user `root` do MySQL para criar uma conta interna para o user `mysqlxsys@localhost`. A conta `mysqlxsys@localhost` é usada pelo X Plugin para autenticação de users externos no sistema de contas do MySQL e para encerrar sessões (`killing sessions`) quando solicitado por um user privilegiado. A conta `mysqlxsys@localhost` é criada como bloqueada (`locked`), portanto, não pode ser usada para login por users externos. Se por algum motivo a conta `root` do MySQL não estiver disponível, antes de iniciar a instalação do X Plugin, você deve criar manualmente o user `mysqlxsys@localhost` emitindo as seguintes declarações no **mysql** command-line client:

```sql
CREATE USER IF NOT EXISTS mysqlxsys@localhost IDENTIFIED WITH
mysql_native_password AS 'password' ACCOUNT LOCK;
GRANT SELECT ON mysql.user TO mysqlxsys@localhost;
GRANT SUPER ON *.* TO mysqlxsys@localhost;
```

### Desinstalando o X Plugin

Se você quiser desinstalar (desativar) o X Plugin, execute a seguinte declaração no **mysql** command-line client:

```sql
UNINSTALL PLUGIN mysqlx;
```

Não use o MySQL Shell para executar a declaração anterior. Embora funcione a partir do MySQL Shell, você receberá um erro (código 1130). Além disso, a desinstalação do plugin remove o user mysqlxsys.