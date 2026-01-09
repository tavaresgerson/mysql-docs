#### 8.1.2.1 Diretrizes para o Usuário Final sobre Segurança de Senhas

Os usuários do MySQL devem seguir as diretrizes abaixo para manter suas senhas seguras.

Quando você executa um programa cliente para se conectar ao servidor MySQL, não é recomendável especificar sua senha de uma maneira que a exponga à descoberta por outros usuários. Os métodos que você pode usar para especificar sua senha ao executar programas cliente estão listados aqui, juntamente com uma avaliação dos riscos de cada método. Em resumo, os métodos mais seguros são solicitar a senha ao programa cliente ou especificar a senha em um arquivo de opção de proteção adequada.

* Use o utilitário **mysql_config_editor**, que permite que você armazene credenciais de autenticação em um arquivo de caminho de login criptografado chamado `.mylogin.cnf`. O arquivo pode ser lido mais tarde por programas clientes do MySQL para obter credenciais de autenticação para se conectar ao MySQL Server. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

* Use a opção `--password=password` ou `-ppassword` na linha de comando. Por exemplo:

  ```
  $> mysql -u francis -pfrank db_name
  ```

  Aviso

  Este é um método conveniente, mas inseguro. Em alguns sistemas, sua senha torna-se visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL normalmente sobrescrevem o argumento de senha da linha de comando com zeros durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix System V e talvez outros estão sujeitos a esse problema.)

Se o ambiente operacional estiver configurado para exibir o comando atual na barra de título da janela do terminal, a senha permanecerá visível enquanto o comando estiver em execução, mesmo que o comando tenha saído da área de conteúdo da janela.

* Use a opção `--password` ou `-p` na linha de comando sem valor de senha especificado. Nesse caso, o programa cliente solicitará a senha de forma interativa:

  ```
  $> mysql -u francis -p db_name
  Enter password: ********
  ```

  Os caracteres `*` indicam onde você digita sua senha. A senha não é exibida enquanto você a digita.

* É mais seguro digitar sua senha dessa maneira do que especificá-la na linha de comando, pois ela não é visível para outros usuários. No entanto, esse método de digitação de senha é adequado apenas para programas que você executa de forma interativa. Se você quiser invocar um cliente a partir de um script que seja executado de forma não interativa, não há oportunidade de digitar a senha pelo teclado. Em alguns sistemas, você pode até encontrar que a primeira linha do seu script é lida e interpretada (incorretamente) como sua senha.

* Armazene sua senha em um arquivo de opções. Por exemplo, no Unix, você pode listar sua senha na seção `[client]` do arquivo `.my.cnf` em seu diretório home:

  ```
  [client]
  password=password
  ```

* Para manter a senha segura, o arquivo não deve ser acessível a ninguém além de você. Para garantir isso, defina o modo de acesso do arquivo para `400` ou `600`. Por exemplo:

  ```
  $> chmod 600 .my.cnf
  ```

* Para nomear um arquivo de opções específico contendo a senha a partir da linha de comando, use a opção `--defaults-file=nome_do_arquivo`, onde `nome_do_arquivo` é o nome completo do caminho do arquivo. Por exemplo:

  ```
  $> mysql --defaults-file=/home/francis/mysql-opts
  ```

* A Seção 6.2.2.2, “Usando Arquivos de Opções”, discute arquivos de opções com mais detalhes.

No Unix, o cliente **mysql** escreve um registro das instruções executadas em um arquivo de histórico (consulte a Seção 6.5.1.3, “Log de cliente mysql”). Por padrão, esse arquivo é chamado de `.mysql_history` e é criado no seu diretório de casa. As senhas podem ser escritas como texto simples em instruções SQL, como `CREATE USER` e `ALTER USER`, então, se você usar essas instruções, elas serão registradas no arquivo de histórico. Para manter esse arquivo seguro, use um modo de acesso restrito, da mesma maneira que foi descrito anteriormente para o arquivo `.my.cnf`.

Se o interpretador de comandos mantém um histórico, qualquer arquivo no qual os comandos são salvos contém senhas do MySQL inseridas na linha de comando. Por exemplo, o **bash** usa `~/.bash_history`. Qualquer arquivo desse tipo deve ter um modo de acesso restrito.