#### 6.5.1.3 Registro do cliente do MySQL

O cliente **mysql** pode realizar esse tipo de registro para instruções executadas interativamente:

- No Unix, o **mysql** escreve as instruções em um arquivo de histórico. Por padrão, esse arquivo é chamado `.mysql_history` no seu diretório de casa. Para especificar um arquivo diferente, defina o valor da variável de ambiente `MYSQL_HISTFILE`.

- Em todas as plataformas, se a opção `--syslog` for fornecida, o **mysql** escreve as instruções na ferramenta de registro do sistema. No Unix, isso é `syslog`; no Windows, é o Registro de Eventos do Windows. O destino onde as mensagens registradas aparecem depende do sistema. No Linux, o destino é frequentemente o arquivo `/var/log/messages`.

A discussão a seguir descreve características que se aplicam a todos os tipos de registro e fornece informações específicas para cada tipo de registro.

- Como o registro ocorre
- Controlar o arquivo de histórico
- syslog Logística de características

##### Como o registro ocorre

Para cada destino de registro habilitado, o registro de declarações ocorre da seguinte forma:

- As declarações são registradas apenas quando executadas interativamente. As declarações são não interativas, por exemplo, quando lidas de um arquivo ou de uma canalização. É também possível suprimir o registro de declarações usando a opção `--batch` ou `--execute`.

- As declarações são ignoradas e não registradas se corresponderem a qualquer padrão na lista de "ignorar". Esta lista é descrita mais adiante.

- O **mysql** registra cada linha de declaração não ignorada e não vazia individualmente.

- Se uma declaração não ignorada abranger várias linhas (excluindo o delimitador final), o **mysql** concatena as linhas para formar a declaração completa, mapeia as novas linhas para espaços e registra o resultado, além de um delimitador.

Consequentemente, uma declaração de entrada que se estende por várias linhas pode ser registrada duas vezes. Considere este exemplo de entrada:

```
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```

Neste caso, o **mysql** registra as linhas “SELECT”, “'Hoje é'”, “,”, “CURDATE()” e “;” à medida que as lê. Ele também registra a declaração completa, após mapear `SELECT\n'Today is'\n,\nCURDATE()` para `SELECT 'Today is' , CURDATE()`, além de um delimitador. Assim, essas linhas aparecem na saída registrada:

```
SELECT
'Today is'
,
CURDATE()
;
SELECT 'Today is' , CURDATE();
```

O **mysql** ignora, para fins de registro, as instruções que correspondem a qualquer padrão na lista “ignore”. Por padrão, a lista de padrões é `"*IDENTIFIED*:*PASSWORD*"`, para ignorar instruções que se referem a senhas. A correspondência de padrões não é case-sensitive. Dentro dos padrões, dois caracteres são especiais:

- `?` corresponde a qualquer caractere único.
- `*` corresponde a qualquer sequência de zero ou mais caracteres.

Para especificar padrões adicionais, use a opção `--histignore` ou defina a variável de ambiente `MYSQL_HISTIGNORE`. (Se ambos forem especificados, o valor da opção tem precedência.) O valor deve ser uma lista de um ou mais padrões separados por vírgula, que são anexados à lista de padrões padrão.

Os padrões especificados na linha de comando podem precisar ser entre aspas ou escapar para evitar que o interpretador do comando os trate de forma especial. Por exemplo, para suprimir o registro para as instruções `UPDATE` e `DELETE`, além das instruções que se referem a senhas, invoque o **mysql** da seguinte forma:

```
mysql --histignore="*UPDATE*:*DELETE*"
```

##### Controlar o arquivo de histórico

O arquivo `.mysql_history` deve ser protegido com um modo de acesso restrito, pois informações sensíveis podem ser escritas nele, como o texto das instruções SQL que contêm senhas. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. As declarações no arquivo são acessíveis a partir do cliente **mysql** quando a tecla **seta para cima** é usada para recuperar o histórico. Veja Desativar Histórico Interativo.

Se você não quiser manter um arquivo de histórico, primeiro remova `.mysql_history` (se existir). Em seguida, use uma das seguintes técnicas para impedir que ele seja criado novamente:

- Defina a variável de ambiente `MYSQL_HISTFILE` para `/dev/null`. Para que essa configuração seja aplicada a cada login, coloque-a em um dos arquivos de inicialização do seu shell.

- Crie `.mysql_history` como um link simbólico para `/dev/null`; isso precisa ser feito apenas uma vez:

  ```
  ln -s /dev/null $HOME/.mysql_history
  ```

##### syslog Logística de características

Se a opção `--syslog` for fornecida, o **mysql** escreve instruções interativas no mecanismo de registro do sistema. O registro de mensagens tem as seguintes características.

O registro ocorre no nível de “informação”. Isso corresponde à prioridade `LOG_INFO` para `syslog` no Unix/Linux `syslog` capacidade e a `EVENTLOG_INFORMATION_TYPE` para o Registro de Eventos do Windows. Consulte a documentação do seu sistema para configurar sua capacidade de registro.

O tamanho da mensagem é limitado a 1024 bytes.

As mensagens são compostas pelo identificador `MysqlClient` seguido desses valores:

- `SYSTEM_USER`

  O nome do usuário do sistema operacional (nome de login) ou `--` se o usuário for desconhecido.

- `MYSQL_USER`

  O nome do usuário do MySQL (especificado com a opção `--user`) ou `--` se o usuário for desconhecido.

- `CONNECTION_ID`:

  O identificador de conexão do cliente. Isso é o mesmo que o valor da função `CONNECTION_ID()` dentro da sessão.

- `DB_SERVER`

  O host do servidor ou `--` se o host for desconhecido.

- `DB`

  O banco de dados padrão ou `--` se nenhum banco de dados tiver sido selecionado.

- `QUERY`

  O texto da declaração registrada.

Aqui está uma amostra de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única linha.

```
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```
