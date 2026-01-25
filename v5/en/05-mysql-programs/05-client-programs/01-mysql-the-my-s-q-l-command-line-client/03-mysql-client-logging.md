#### 4.5.1.3 Logging do Client mysql

O **mysql** client pode realizar estes tipos de *logging* para *statements* executados interativamente:

* No Unix, o **mysql** grava os *statements* em um *history file*. Por padrão, este arquivo é nomeado `.mysql_history` no seu diretório *home*. Para especificar um arquivo diferente, defina o valor da *environment variable* `MYSQL_HISTFILE`.

* Em todas as plataformas, se a opção `--syslog` for fornecida, o **mysql** grava os *statements* no recurso de *system logging*. No Unix, este é o `syslog`; no Windows, é o Windows Event Log. O destino onde as mensagens registradas aparecem depende do sistema. No Linux, o destino é geralmente o arquivo `/var/log/messages`.

A discussão a seguir descreve as características que se aplicam a todos os tipos de *logging* e fornece informações específicas para cada tipo de *logging*.

* Como o Logging Ocorre
* Controlando o History File
* Características do Logging com syslog

##### Como o Logging Ocorre

Para cada destino de *logging* habilitado, o *statement logging* ocorre da seguinte forma:

* Os *statements* são registrados (logged) apenas quando executados interativamente. Os *statements* são não interativos, por exemplo, quando lidos de um arquivo ou de um *pipe*. Também é possível suprimir o *statement logging* usando as opções `--batch` ou `--execute`.

* Os *statements* são ignorados e não registrados se corresponderem a qualquer *pattern* na lista de “ignorar” (*ignore* list). Esta lista é descrita posteriormente.

* O **mysql** registra cada linha de *statement* individualmente, desde que não esteja vazia e não seja ignorada.

* Se um *statement* não ignorado abranger múltiplas linhas (sem incluir o *delimiter* de terminação), o **mysql** concatena as linhas para formar o *statement* completo, mapeia as quebras de linha (*newlines*) para espaços e registra o resultado, mais um *delimiter*.

Consequentemente, um *statement* de entrada que abrange múltiplas linhas pode ser registrado duas vezes. Considere esta entrada:

```sql
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```

Neste caso, o **mysql** registra as linhas “SELECT”, “'Today is'”, “,”, “CURDATE()” e “;” conforme as lê. Ele também registra o *statement* completo, após mapear `SELECT\n'Today is'\n,\nCURDATE()` para `SELECT 'Today is' , CURDATE()`, mais um *delimiter*. Assim, estas linhas aparecem na saída de *logging*:

```sql
SELECT
'Today is'
,
CURDATE()
;
SELECT 'Today is' , CURDATE();
```

Para fins de *logging*, o **mysql** ignora *statements* que correspondam a qualquer *pattern* na lista de “ignorar” (*ignore* list). Por padrão, a lista de *patterns* é `"*IDENTIFIED*:*PASSWORD*"`, para ignorar *statements* que se refiram a senhas. A correspondência de *patterns* (*Pattern matching*) não diferencia maiúsculas de minúsculas (*case-sensitive*). Dentro dos *patterns*, dois caracteres são especiais:

* `?` corresponde a qualquer caractere único.
* `*` corresponde a qualquer sequência de zero ou mais caracteres.

Para especificar *patterns* adicionais, use a opção `--histignore` ou defina a *environment variable* `MYSQL_HISTIGNORE`. (Se ambos forem especificados, o valor da opção tem precedência.) O valor deve ser uma lista de um ou mais *patterns* separados por dois-pontos, que são anexados à lista de *patterns* padrão.

Pode ser necessário colocar os *patterns* especificados na linha de comando entre aspas (*quoted*) ou usar caracteres de escape (*escaped*) para evitar que seu interpretador de comandos os trate de forma especial. Por exemplo, para suprimir o *logging* de *statements* `UPDATE` e `DELETE`, além dos *statements* que se referem a senhas, invoque o **mysql** desta forma:

```sql
mysql --histignore="*UPDATE*:*DELETE*"
```

##### Controlando o History File

O arquivo `.mysql_history` deve ser protegido com um modo de acesso restritivo, pois informações confidenciais podem ser gravadas nele, como o texto de *SQL statements* que contêm senhas. Consulte a Seção 6.1.2.1, “End-User Guidelines for Password Security” (Diretrizes para o Usuário Final sobre Segurança de Senha). Os *statements* no arquivo são acessíveis a partir do **mysql** client quando a tecla **seta para cima** é usada para recuperar o histórico. Consulte Disabling Interactive History (Desabilitando o Histórico Interativo).

Se você não deseja manter um *history file*, primeiro remova `.mysql_history` se ele existir. Em seguida, use qualquer uma das técnicas a seguir para evitar que ele seja criado novamente:

* Defina a *environment variable* `MYSQL_HISTFILE` como `/dev/null`. Para que essa configuração tenha efeito sempre que você fizer login, coloque-a em um dos arquivos de inicialização do seu *shell*.

* Crie `.mysql_history` como um *symbolic link* para `/dev/null`; isso só precisa ser feito uma vez:

  ```sql
  ln -s /dev/null $HOME/.mysql_history
  ```

##### Características do Logging com syslog

Se a opção `--syslog` for fornecida, o **mysql** grava *statements* interativos no recurso de *system logging*. O *logging* de mensagens possui as seguintes características.

O *logging* ocorre no nível de “informação” (*information*). Isso corresponde à prioridade `LOG_INFO` para o recurso `syslog` no Unix/Linux e a `EVENTLOG_INFORMATION_TYPE` para o Windows Event Log. Consulte a documentação do seu sistema para a configuração do seu recurso de *logging*.

O tamanho da mensagem é limitado a 1024 *bytes*.

As mensagens consistem no identificador `MysqlClient` seguido por estes valores:

* `SYSTEM_USER`

  O nome de usuário do sistema operacional (*operating system user name* ou *login name*) ou `--` se o usuário for desconhecido.

* `MYSQL_USER`

  O nome de usuário do MySQL (especificado com a opção `--user`) ou `--` se o usuário for desconhecido.

* `CONNECTION_ID`:

  O identificador da conexão do *client*. Este é o mesmo valor da função `CONNECTION_ID()` dentro da sessão.

* `DB_SERVER`

  O *host* do *server* ou `--` se o *host* for desconhecido.

* `DB`

  O *database* padrão ou `--` se nenhum *database* tiver sido selecionado.

* `QUERY`

  O texto do *statement* registrado (*logged*).

Aqui está um exemplo de saída gerada no Linux usando `--syslog`. Esta saída é formatada para legibilidade; cada mensagem registrada ocupa, na verdade, uma única linha.

```sql
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```