#### 6.5.1.3 Registro do Cliente do mysql

O cliente `mysql` pode fazer esses tipos de registro para instruções executadas interativamente:

- No Unix, `mysql` escreve as instruções para um arquivo de histórico. Por padrão, este arquivo é chamado de `.mysql_history` em seu diretório inicial. Para especificar um arquivo diferente, defina o valor da variável de ambiente `MYSQL_HISTFILE`.
- Em todas as plataformas, se a opção `--syslog` for dada, `mysql` escreve as instruções para o sistema de registro de instalações. Em Unix, este é `syslog`; no Windows, é o Windows Event Log. O destino onde as mensagens registradas aparecem é dependente do sistema. No Linux, o destino é geralmente o arquivo `/var/log/messages`.

A discussão a seguir descreve as características que se aplicam a todos os tipos de exploração madeireira e fornece informações específicas para cada tipo de exploração madeireira.

- Como ocorre a extração de madeira
- Controle do arquivo histórico
- Características de registo de syslog

##### Como ocorre a extração de madeira

Para cada destino de registo habilitado, o registo de instruções ocorre da seguinte forma:

- As instruções são registradas apenas quando executadas interativamente. As instruções não são interativas, por exemplo, quando lidas de um arquivo ou de um tubo. Também é possível suprimir o registro de instruções usando a opção `--batch` ou `--execute`.
- As instruções são ignoradas e não registradas se corresponderem a qualquer padrão na lista ignore. Esta lista é descrita mais tarde.
- `mysql` registra cada linha de instrução não ignorada e não vazia individualmente.
- Se uma instrução não ignorada abrange várias linhas (sem incluir o delimitador de terminação), `mysql` concatena as linhas para formar a instrução completa, mapeia novas linhas para espaços e registra o resultado, além de um delimitador.

Consequentemente, uma instrução de entrada que abrange várias linhas pode ser registrada duas vezes.

```
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```

Neste caso, `mysql` registra as linhas SELECT, 'Today is', ,, CURDATE) e ; conforme as lê. Também registra a instrução completa, depois de mapear `SELECT\n'Today is'\n,\nCURDATE()` para `SELECT 'Today is' , CURDATE()`, mais um delimitador. Assim, essas linhas aparecem na saída registrada:

```
SELECT
'Today is'
,
CURDATE()
;
SELECT 'Today is' , CURDATE();
```

`mysql` ignora, para fins de registro, instruções que correspondem a qualquer padrão na lista ignore. Por padrão, a lista de padrões é `"*IDENTIFIED*:*PASSWORD*"`, para ignorar instruções que se referem a senhas. A correspondência de padrões não é sensível a maiúsculas e minúsculas. Dentro de padrões, dois caracteres são especiais:

- `?` corresponde a qualquer caractere.
- `*` corresponde a qualquer sequência de zero ou mais caracteres.

Para especificar padrões adicionais, use a opção `--histignore` ou defina a variável de ambiente `MYSQL_HISTIGNORE`. (Se ambos forem especificados, o valor da opção tem precedência.) O valor deve ser uma lista de um ou mais padrões separados por pontos, que são anexados à lista de padrões padrão.

Os padrões especificados na linha de comando podem precisar ser citados ou escapados para evitar que seu interpretador de comandos os trate especialmente. Por exemplo, para suprimir o registro de instruções `UPDATE` e `DELETE` além de instruções que se referem a senhas, invoque `mysql` assim:

```
mysql --histignore="*UPDATE*:*DELETE*"
```

##### Controle do arquivo histórico

O arquivo `.mysql_history` deve ser protegido com um modo de acesso restritivo porque informações sensíveis podem ser escritas nele, como o texto de instruções SQL que contêm senhas. Veja Seção 8.1.2.1, "Diretrizes do Usuário Final para Segurança de Senhas". As instruções no arquivo são acessíveis a partir do cliente `mysql` quando a tecla de seta para cima\*\* é usada para recordar o histórico. Veja Desabilitar Histórico Interativo.

Se você não quiser manter um arquivo de histórico, primeiro remova `.mysql_history` se ele existir. Em seguida, use uma das seguintes técnicas para evitar que ele seja criado novamente:

- Defina a variável de ambiente `MYSQL_HISTFILE` em `/dev/null`. Para fazer com que esta configuração tenha efeito cada vez que você iniciar sessão, coloque-a em um dos arquivos de inicialização do seu shell.
- Criar `.mysql_history` como um link simbólico para `/dev/null`; isso precisa ser feito apenas uma vez:

  ```
  ln -s /dev/null $HOME/.mysql_history
  ```

##### Características de registo de syslog

Se a opção `--syslog` for dada, `mysql` escreve instruções interativas para o sistema de registro de instalações.

O registro ocorre no nível informação. Isso corresponde à prioridade `LOG_INFO` para a capacidade `syslog` no Unix/Linux e à prioridade `EVENTLOG_INFORMATION_TYPE` para o Registro de Eventos do Windows. Consulte a documentação do sistema para a configuração de sua capacidade de registro.

O tamanho da mensagem é limitado a 1024 bytes.

As mensagens consistem no identificador `MysqlClient` seguido destes valores:

- `SYSTEM_USER`

  O nome do utilizador do sistema operativo (nome de acesso) ou `--` se o utilizador for desconhecido.
- `MYSQL_USER`

  O nome do usuário MySQL (especificado com a opção `--user`) ou `--` se o usuário for desconhecido.
- `CONNECTION_ID`:

  O identificador de conexão do cliente. Este é o mesmo que o valor da função `CONNECTION_ID()` dentro da sessão.
- `DB_SERVER`

  O host do servidor ou `--` se o host for desconhecido.
- `DB`

  A base de dados padrão ou `--` se nenhuma base de dados tiver sido selecionada.
- `QUERY`

  O texto da declaração registada.

Aqui está uma amostra de saída gerada no Linux usando `--syslog`.

```
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```
