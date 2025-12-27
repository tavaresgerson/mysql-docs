### 8.3.4 Conectando-se ao MySQL Remotamente a partir do Windows com SSH

Esta seção descreve como obter uma conexão criptografada a um servidor MySQL remoto com SSH. As informações foram fornecidas por David Carlson `<dcarlson@mplcomm.com>`.

1. Instale um cliente SSH em sua máquina Windows. Para uma comparação de clientes SSH, consulte <http://pt.wikipedia.org/wiki/Comparação_de_clientes_SSH>.
2. Inicie seu cliente SSH do Windows. Defina `Host_Name = yourmysqlserver_URL_or_IP`. Defina `userid=your_userid` para fazer login no seu servidor. Este valor `userid` pode não ser o mesmo que o nome de usuário da sua conta MySQL.
3. Configure o encaminhamento de porta. Faça um encaminhamento remoto (Defina `local_port: 3306`, `remote_host: yourmysqlservername_or_ip`, `remote_port: 3306`) ou um encaminhamento local (Defina `port: 3306`, `host: localhost`, `remote port: 3306`).
4. Salve tudo, caso contrário, você precisará refazê-lo na próxima vez.
5. Faça login no seu servidor com a sessão SSH que você acabou de criar.
6. Em sua máquina Windows, inicie algum aplicativo ODBC (como o Access).
7. Crie um novo arquivo no Windows e faça um link para o MySQL usando o driver ODBC da mesma maneira que você normalmente faz, exceto que insira `localhost` para o servidor do host MySQL, não `yourmysqlservername`.

Neste ponto, você deve ter uma conexão ODBC ao MySQL, criptografada usando SSH.