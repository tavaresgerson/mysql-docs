#### 6.1.2.1 Diretrizes para Usuários Finais sobre Segurança de Senhas

Usuários MySQL devem seguir as diretrizes a seguir para manter as senhas seguras.

Ao executar um programa Client para se conectar ao MySQL Server, é desaconselhável especificar sua senha de uma forma que a exponha à descoberta por outros usuários. Os métodos que você pode usar para especificar sua senha ao executar programas Client estão listados aqui, juntamente com uma avaliação dos riscos de cada método. Em resumo, os métodos mais seguros são fazer com que o programa Client solicite a senha interativamente ou especificá-la em um arquivo de option file devidamente protegido.

* Use o utilitário [**mysql_config_editor**](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility"), que permite armazenar credenciais de autenticação em um arquivo de login path criptografado chamado `.mylogin.cnf`. O arquivo pode ser lido posteriormente por programas Client MySQL para obter credenciais de autenticação para conexão com o MySQL Server. Consulte [Section 4.6.6, “mysql_config_editor — MySQL Configuration Utility”](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility").

* Use uma opção `--password=password` ou `-ppassword` na linha de comando. Por exemplo:

  ```sql
  $> mysql -u francis -pfrank db_name
  ```

  Aviso

  Isso é conveniente *mas inseguro*. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Clients MySQL tipicamente sobrescrevem o argumento de senha da linha de comando com zeros durante sua sequência de inicialização. Contudo, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, esta estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a este problema.)

  Se o seu ambiente operacional estiver configurado para exibir seu comando atual na barra de título da janela do seu terminal, a senha permanecerá visível enquanto o comando estiver em execução, mesmo que o comando tenha saído da visualização na área de conteúdo da janela.

* Use a opção [`--password`](connection-options.html#option_general_password) ou `-p` na linha de comando sem um valor de senha especificado. Neste caso, o programa Client solicita a senha interativamente:

  ```sql
  $> mysql -u francis -p db_name
  Enter password: ********
  ```

  Os caracteres `*` indicam onde você insere sua senha. A senha não é exibida enquanto você a digita.

  É mais seguro inserir sua senha desta forma do que especificá-la na linha de comando, pois ela não fica visível para outros usuários. Contudo, este método de inserção de senha é adequado apenas para programas que você executa interativamente. Se você deseja invocar um Client a partir de um script que é executado de forma não interativa, não há oportunidade de inserir a senha pelo teclado. Em alguns sistemas, você pode até descobrir que a primeira linha do seu script é lida e interpretada (incorretamente) como sua senha.

* Armazene sua senha em um option file. Por exemplo, no Unix, você pode listar sua senha na seção `[client]` do arquivo `.my.cnf` no seu diretório home:

  ```sql
  [client]
  password=password
  ```

  Para manter a senha segura, o arquivo não deve ser acessível a ninguém além de você. Para garantir isso, defina o modo de acesso ao arquivo para `400` ou `600`. Por exemplo:

  ```sql
  $> chmod 600 .my.cnf
  ```

  Para nomear um option file específico contendo a senha a partir da linha de comando, use a opção [`--defaults-file=file_name`](option-file-options.html#option_general_defaults-file), onde `file_name` é o nome do caminho completo para o arquivo. Por exemplo:

  ```sql
  $> mysql --defaults-file=/home/francis/mysql-opts
  ```

  [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files"), discute option files em mais detalhes.

* Armazene sua senha na variável de ambiente `MYSQL_PWD`. Consulte [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").

  Este método de especificação de sua senha MySQL deve ser considerado *extremamente inseguro* e não deve ser usado. Algumas versões do **ps** incluem uma opção para exibir o environment de processos em execução. Em alguns sistemas, se você definir `MYSQL_PWD`, sua senha será exposta a qualquer outro usuário que execute o **ps**. Mesmo em sistemas sem tal versão do **ps**, não é sensato presumir que não existam outros métodos pelos quais os usuários possam examinar os environments de processos.

No Unix, o Client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") grava um registro das instruções executadas em um history file (consulte [Section 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging")). Por padrão, este arquivo é nomeado `.mysql_history` e é criado no seu diretório home. As senhas podem ser gravadas como plain text em SQL statements como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), portanto, se você usar essas instruções, elas serão registradas no history file. Para manter este arquivo seguro, use um modo de acesso restritivo, da mesma forma que descrito anteriormente para o arquivo `.my.cnf`.

Se o seu interpretador de comandos estiver configurado para manter um histórico, qualquer arquivo no qual os comandos são salvos conterá senhas MySQL inseridas na linha de comando. Por exemplo, o **bash** usa `~/.bash_history`. Qualquer arquivo desse tipo deve ter um modo de acesso restritivo.