### 6.3.5 Conectando-se ao MySQL remotamente a partir do Windows com SSH

Esta seção descreve como obter uma conexão criptografada a um servidor MySQL remoto com SSH. As informações foram fornecidas por David Carlson `<dcarlson@mplcomm.com>`.

1. Instale um cliente SSH na sua máquina Windows. Para uma comparação de clientes SSH, consulte <http://pt.wikipedia.org/wiki/Comparação_de_clientes_SSH>.

2. Inicie o cliente SSH do Windows. Defina `Host_Name = yourmysqlserver_URL_or_IP`. Defina `userid=your_userid` para fazer login no seu servidor. Este valor `userid` pode não ser o mesmo que o nome de usuário da sua conta MySQL.

3. Configure o encaminhamento de porta. Faça um encaminhamento remoto (defina `local_port: 3306`, `remote_host: seu_nome_do_servidor_ou_IP_do_MySQL`, `remote_port: 3306`) ou um encaminhamento local (defina `port: 3306`, `host: localhost`, `remote port: 3306`).

4. Salve tudo; caso contrário, você terá que refazer tudo na próxima vez.

5. Faça login no seu servidor com a sessão SSH que você acabou de criar.

6. No seu computador com Windows, inicie um aplicativo ODBC (como o Access).

7. Crie um novo arquivo no Windows e faça o link para o MySQL usando o driver ODBC da mesma maneira que você normalmente faz, exceto que digite `localhost` para o servidor do host MySQL, não `seu_nome_do_servidor_mysql`.

Neste ponto, você deve ter uma conexão ODBC com o MySQL, criptografada usando SSH.
