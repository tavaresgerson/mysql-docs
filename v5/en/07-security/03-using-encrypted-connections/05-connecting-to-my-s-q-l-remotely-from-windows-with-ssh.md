### 6.3.5 Conectando-se ao MySQL Remotamente a Partir do Windows com SSH

Esta seção descreve como obter uma conexão criptografada com um servidor MySQL remoto usando SSH. A informação foi fornecida por David Carlson `<dcarlson@mplcomm.com>`.

1. Instale um cliente SSH na sua máquina Windows. Para uma comparação de clientes SSH, consulte <http://en.wikipedia.org/wiki/Comparison_of_SSH_clients>.

2. Inicie seu cliente SSH do Windows. Defina `Host_Name = URL_ou_IP_doseu_servidor_mysql`. Defina `userid=seu_userid` para fazer o login no seu servidor. Este valor de `userid` pode não ser o mesmo que o nome de usuário (user name) da sua conta MySQL.

3. Configure o Port Forwarding (encaminhamento de porta). Execute um remote forward (Defina `local_port: 3306`, `remote_host: nomedoservidor_mysql_ou_ip`, `remote_port: 3306`) ou um local forward (Defina `port: 3306`, `host: localhost`, `remote port: 3306`).

4. Salve tudo; caso contrário, você terá que refazer a configuração na próxima vez.
5. Faça login no seu servidor com a sessão SSH que você acabou de criar.
6. Na sua máquina Windows, inicie algum aplicativo ODBC (como o Access).

7. Crie um novo arquivo no Windows e conecte-se ao MySQL usando o driver ODBC da mesma forma que faria normalmente, exceto que você deve digitar `localhost` para o servidor host MySQL, e não *`nomedoseuservidormysql`*.

Neste ponto, você deve ter uma conexão ODBC com o MySQL, criptografada usando SSH.