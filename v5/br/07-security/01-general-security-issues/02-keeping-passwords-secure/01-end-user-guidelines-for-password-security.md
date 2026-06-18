#### 6.1.2.1 Diretrizes para o Usuário Final sobre Segurança de Senhas

Os usuários do MySQL devem seguir as diretrizes a seguir para manter as senhas seguras.

Quando você executa um programa cliente para se conectar ao servidor MySQL, não é recomendável especificar sua senha de uma maneira que a exponga à descoberta por outros usuários. Os métodos que você pode usar para especificar sua senha ao executar programas cliente estão listados aqui, juntamente com uma avaliação dos riscos de cada método. Em resumo, os métodos mais seguros são fazer o programa cliente solicitar a senha ou especificar a senha em um arquivo de opção de proteção adequada.

- Use o utilitário **mysql_config_editor**, que permite armazenar credenciais de autenticação em um arquivo criptografado de caminho de login chamado `.mylogin.cnf`. O arquivo pode ser lido posteriormente por programas clientes do MySQL para obter credenciais de autenticação para se conectar ao MySQL Server. Veja Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

- Use a opção `--password=password` ou `-ppassword` na linha de comando. Por exemplo:

  ```sh
  $> mysql -u francis -pfrank db_name
  ```

  Aviso

  Isso é conveniente, mas inseguro. Em alguns sistemas, sua senha fica visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes do MySQL geralmente sobrescrevem o argumento da senha de linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor fica visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

  Se o ambiente operacional estiver configurado para exibir o comando atual na barra de título da janela do terminal, a senha permanecerá visível enquanto o comando estiver em execução, mesmo que o comando tenha saído da área de conteúdo da janela.

- Use a opção `--password` (connection-options.html#option_general_password) ou `-p` na linha de comando sem valor de senha especificado. Nesse caso, o programa cliente solicita a senha de forma interativa:

  ```sh
  $> mysql -u francis -p db_name
  Enter password: ********
  ```

  Os caracteres `*` indicam onde você digita sua senha. A senha não é exibida enquanto você a digita.

  É mais seguro inserir sua senha dessa maneira do que especificá-la na linha de comando, pois ela não é visível para outros usuários. No entanto, esse método de inserir uma senha é adequado apenas para programas que você executa interativamente. Se você quiser invocar um cliente a partir de um script que não seja interativo, não há oportunidade de inserir a senha no teclado. Em alguns sistemas, você pode até encontrar que a primeira linha do seu script é lida e interpretada (incorretamente) como sua senha.

- Armazene sua senha em um arquivo de opção. Por exemplo, no Unix, você pode listar sua senha na seção `[client]` do arquivo `.my.cnf` em seu diretório home:

  ```
  [client]
  password=password
  ```

  Para manter a senha segura, o arquivo não deve ser acessível a ninguém, exceto a você. Para garantir isso, defina o modo de acesso ao arquivo para `400` ou `600`. Por exemplo:

  ```sh
  $> chmod 600 .my.cnf
  ```

  Para nomear, a partir da linha de comando, um arquivo de opções específico que contém a senha, use a opção `--defaults-file=file_name`, onde `file_name` é o nome completo do caminho do arquivo. Por exemplo:

  ```sh
  $> mysql --defaults-file=/home/francis/mysql-opts
  ```

  A seção 4.2.2.2, “Usando arquivos de opção” (option-files.html), discute arquivos de opção com mais detalhes.

- Armazene sua senha na variável de ambiente `MYSQL_PWD`. Consulte Seção 4.9, “Variáveis de Ambiente”.

  Este método de especificar sua senha do MySQL deve ser considerado *extremamente inseguro* e não deve ser usado. Algumas versões do **ps** incluem uma opção para exibir o ambiente dos processos em execução. Em alguns sistemas, se você definir `MYSQL_PWD`, sua senha será exposta a qualquer outro usuário que execute o **ps**. Mesmo em sistemas sem essa versão do **ps**, não é prudente assumir que não existem outros métodos pelos quais os usuários possam examinar os ambientes dos processos.

No Unix, o cliente **mysql** escreve um registro das instruções executadas em um arquivo de histórico (veja Seção 4.5.1.3, “Log de cliente mysql”). Por padrão, esse arquivo é chamado de `.mysql_history` e é criado no seu diretório de casa. Senhas podem ser escritas como texto simples em instruções SQL, como `CREATE USER` e `ALTER USER`, então, se você usar essas instruções, elas serão registradas no arquivo de histórico. Para manter esse arquivo seguro, use um modo de acesso restrito, da mesma maneira que foi descrito anteriormente para o arquivo `.my.cnf`.

Se o interpretador de comandos estiver configurado para manter um histórico, qualquer arquivo no qual os comandos são salvos contém senhas do MySQL inseridas na linha de comando. Por exemplo, o **bash** usa `~/.bash_history`. Qualquer arquivo desse tipo deve ter um modo de acesso restrito.
