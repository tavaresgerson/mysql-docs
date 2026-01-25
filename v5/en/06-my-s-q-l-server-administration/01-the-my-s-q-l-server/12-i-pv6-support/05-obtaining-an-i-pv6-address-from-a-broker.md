#### 5.1.12.5 Obtendo um Endereço IPv6 de um Broker

Se você não possui um endereço IPv6 público que permita que seu sistema se comunique via IPv6 fora da sua rede local, você pode obter um de um IPv6 *broker*. A [página de IPv6 Tunnel Broker na Wikipedia](http://en.wikipedia.org/wiki/List_of_IPv6_tunnel_brokers) lista diversos *brokers* e suas funcionalidades, como se eles fornecem endereços estáticos e os protocolos de roteamento suportados.

Após configurar o seu *host* do *server* para usar um endereço IPv6 fornecido pelo *broker*, inicie o MySQL *server* com uma configuração apropriada de [`bind_address`](server-system-variables.html#sysvar_bind_address) para permitir que o *server* aceite conexões IPv6. Por exemplo, insira as seguintes linhas no arquivo de opções do *server* e reinicie o *server*:

```sql
[mysqld]
bind_address = *
```

Alternativamente, você pode vincular (bind) o *server* ao endereço IPv6 específico fornecido pelo *broker*, mas isso torna o *server* mais restritivo para conexões *TCP/IP*. Ele aceita apenas conexões IPv6 para aquele único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição de [`bind_address`](server-system-variables.html#sysvar_bind_address) na [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). Além disso, se o *broker* alocar endereços dinâmicos, o endereço fornecido para o seu sistema pode mudar na próxima vez que você se conectar ao *broker*. Nesse caso, quaisquer contas que você criar que nomeiem o endereço original se tornam inválidas. Para vincular a um endereço específico, mas evitar esse problema de mudança de endereço, você pode tentar negociar com o *broker* por um endereço IPv6 estático.

O exemplo a seguir mostra como usar o Freenet6 como o *broker* e o pacote **gogoc** *client* IPv6 no Gentoo Linux.

1. Crie uma conta no Freenet6 visitando este URL e se inscrevendo:

   ```sql
   http://gogonet.gogo6.com
   ```

2. Após criar a conta, vá para este URL, faça *login* e crie um ID de usuário e senha para o IPv6 *broker*:

   ```sql
   http://gogonet.gogo6.com/page/freenet6-registration
   ```

3. Como `root`, instale o **gogoc**:

   ```sql
   $> emerge gogoc
   ```

4. Edite `/etc/gogoc/gogoc.conf` para definir os valores de `userid` e `password`. Por exemplo:

   ```sql
   userid=gogouser
   passwd=gogopass
   ```

5. Inicie o **gogoc**:

   ```sql
   $> /etc/init.d/gogoc start
   ```

   Para iniciar o **gogoc** toda vez que o seu sistema inicializar (boot), execute este comando:

   ```sql
   $> rc-update add gogoc default
   ```

6. Use **ping6** para tentar fazer *ping* em um *host*:

   ```sql
   $> ping6 ipv6.google.com
   ```

7. Para ver o seu endereço IPv6:

   ```sql
   $> ifconfig tun
   ```