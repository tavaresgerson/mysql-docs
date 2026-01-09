## 19.2 Configurando o MySQL como uma Armazenadora de Documentos

19.2.1 Instalação do MySQL Shell

19.2.2 Iniciar o MySQL Shell

Para usar o MySQL 5.7 como uma loja de documentos, o Plugin X precisa ser instalado. Em seguida, você pode usar o Protocolo X para se comunicar com o servidor. Sem o Plugin X rodando, os clientes do Protocolo X não podem se conectar ao servidor. O Plugin X vem com o MySQL (5.7.12 ou superior) — instalá-lo não envolve um download separado. Esta seção descreve como instalar o Plugin X.

Siga os passos descritos aqui:

1. **Instale ou atualize para o MySQL 5.7.12 ou superior.**

   Quando a instalação ou atualização estiver concluída, inicie o servidor. Para obter instruções sobre a inicialização do servidor, consulte a Seção 2.9.2, “Inicializando o Servidor”.

   Nota

   O Instalador do MySQL permite que você realize essa e a próxima etapa (Instale o Plugin X) ao mesmo tempo para novas instalações no Microsoft Windows. Na tela Plugin e Extensões, marque a caixa de seleção Habilitar X Protocol/MySQL como uma Armazenamento de Documentos. Após a instalação, verifique se o Plugin X foi instalado.

2. **Instale o Plugin X.** Uma conta não root pode ser usada para instalar o plugin, desde que a conta tenha o privilégio de `INSERT` para a tabela `mysql.plugin`.

   Sempre salve suas configurações existentes antes de reconfigurar o servidor.

   Para instalar o plugin X embutido, faça um dos seguintes:

   - Usando o Instalador do MySQL para Windows:

     1. Inicie o Instalador do MySQL para Windows. O painel do Instalador do MySQL é aberto.

     2. Clique na ação rápida Reconfigurar para o Servidor MySQL. Use Próximo e Voltar para configurar os seguintes itens:

        - Em Contas e papéis, confirme a senha da conta `root` atual.

        - Em Plugin e extensões, marque a caixa de seleção Habilitar X Protocol/MySQL como uma loja de documentos. O instalador do MySQL fornece um número de porta padrão e abre a porta do firewall para acesso à rede.

        - Na opção Aplicar configuração do servidor, clique em Executar.

        - Clique em Concluir para fechar o Instalador do MySQL.

     3. Instale o MySQL Shell.

   - Usando o MySQL Shell:

     1. Instale o MySQL Shell.

     2. Abra uma janela de terminal (prompt de comando no Windows) e navegue até o local dos binários do MySQL (por exemplo, `/usr/bin/` no Linux).

     3. Execute o seguinte comando:

        ```sql
        mysqlsh -u user -h localhost --classic --dba enableXProtocol
        ```

   - Usando o programa MySQL Client:

     1. Abra uma janela de terminal (prompt de comando no Windows) e navegue até o local dos binários do MySQL (por exemplo, `/usr/bin/` no Linux).

     2. Invoque o cliente de linha de comando **mysql**:

        ```sql
        mysql -u user -p
        ```

     3. Emita a seguinte declaração:

        ```sql
        mysql> INSTALL PLUGIN mysqlx SONAME 'mysqlx.so';
        ```

        Substitua `mysqlx.so` por `mysqlx.dll` para Windows.

        Importante

        O usuário `mysql.session` deve existir antes que você possa carregar o X Plugin. `mysql.session` foi adicionado na versão 5.7.19 do MySQL. Se seu dicionário de dados foi inicializado usando uma versão anterior, você deve executar o procedimento **mysql_upgrade**. Se o upgrade não for executado, o X Plugin não conseguirá iniciar com a mensagem de erro Houve um erro ao tentar acessar o servidor com o usuário: mysql.session\@localhost. Certifique-se de que o usuário está presente no servidor e que o mysql_upgrade foi executado após uma atualização do servidor.

     4. Instale o MySQL Shell.

3. **Verifique se o X Plugin foi instalado.**

   Quando o X Plugin é instalado corretamente, ele aparece na lista quando você consulta os plugins ativos no servidor com um dos seguintes comandos:

   - Comando do MySQL Shell:

     ```sql
     mysqlsh -u user --sqlc -e "show plugins"
     ```

   - Programa de cliente MySQL:

     ```sql
     mysql -u user -p -e "show plugins"
     ```

   Se você encontrar problemas com a instalação do X Plugin ou se quiser saber sobre maneiras alternativas de instalar, configurar ou desinstalar plugins do servidor, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

### Conta de usuário `mysqlxsys@localhost`

A instalação do X Plugin cria uma conta de usuário `mysqlxsys@localhost`. Se, por algum motivo, a criação da conta de usuário falhar, a instalação do X Plugin também falhará. Aqui está uma explicação sobre para que serve a conta de usuário `mysqlxsys@localhost` e o que fazer quando sua criação falhar.

O processo de instalação do X Plugin usa o usuário `root` do MySQL para criar uma conta interna para o usuário `mysqlxsys@localhost`. A conta `mysqlxsys@localhost` é usada pelo X Plugin para autenticação de usuários externos contra o sistema de contas do MySQL e para matar sessões quando solicitado por um usuário privilegiado. A conta `mysqlxsys@localhost` é criada como bloqueada, portanto, não pode ser usada para fazer login por usuários externos. Se, por algum motivo, a conta `root` do MySQL não estiver disponível, antes de iniciar a instalação do X Plugin, você deve criar manualmente o usuário `mysqlxsys@localhost` emitindo as seguintes instruções no cliente de linha de comando **mysql**:

```sql
CREATE USER IF NOT EXISTS mysqlxsys@localhost IDENTIFIED WITH
mysql_native_password AS 'password' ACCOUNT LOCK;
GRANT SELECT ON mysql.user TO mysqlxsys@localhost;
GRANT SUPER ON *.* TO mysqlxsys@localhost;
```

### Desinstalação do Plugin X

Se você quiser desinstalar (desativar) o X Plugin, execute a seguinte instrução no cliente de linha de comando **mysql**:

```sql
UNINSTALL PLUGIN mysqlx;
```

Não use o MySQL Shell para emitir a declaração anterior. Ele funciona a partir do MySQL Shell, mas você receberá um erro (código 1130). Além disso, a desinstalação do plugin remove o usuário mysqlxsys.
