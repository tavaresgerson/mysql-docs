#### 5.1.12.5. Obter uma Endereço IPv6 de um Broker

Se você não tiver um endereço IPv6 público que permita que seu sistema se comunique via IPv6 fora da sua rede local, você pode obtê-lo de um intermediário de túnel IPv6. A página Wikipedia IPv6 Tunnel Broker lista vários intermediários e suas características, como se eles fornecem endereços estáticos e os protocolos de roteamento suportados.

Depois de configurar o seu servidor hospedeiro para usar um endereço IPv6 fornecido pelo intermediário, inicie o servidor MySQL com um ajuste apropriado para o endereço de ligação (`bind_address`) (server-system-variables.html#sysvar_bind_address) para permitir que o servidor aceite conexões IPv6. Por exemplo, coloque as seguintes linhas no arquivo de opção do servidor e reinicie o servidor:

```sql
[mysqld]
bind_address = *
```

Alternativamente, você pode vincular o servidor ao endereço IPv6 específico fornecido pelo corretor, mas isso torna o servidor mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição de `bind_address` em Seção 5.1.7, “Variáveis do Sistema do Servidor”. Além disso, se o corretor alocar endereços dinâmicos, o endereço fornecido para o seu sistema pode mudar da próxima vez que você se conectar ao corretor. Nesse caso, quaisquer contas que você criar que nomeiem o endereço original se tornam inválidas. Para vincular-se a um endereço específico, mas evitar esse problema de mudança de endereço, você pode conseguir um endereço IPv6 estático com o corretor.

O exemplo a seguir mostra como usar o Freenet6 como intermediário e o pacote de cliente IPv6 **gogoc** no Gentoo Linux.

1. Crie uma conta no Freenet6 visitando este URL e se inscrevendo:

   ```sql
   http://gogonet.gogo6.com
   ```

2. Depois de criar a conta, vá até essa URL, faça login e crie um ID de usuário e uma senha para o intermediário IPv6:

   ```sql
   http://gogonet.gogo6.com/page/freenet6-registration
   ```

3. Como `root`, instale o **gogoc**:

   ```sql
   $> emerge gogoc
   ```

4. Edita o arquivo `/etc/gogoc/gogoc.conf` para definir os valores de `userid` e `password`. Por exemplo:

   ```sql
   userid=gogouser
   passwd=gogopass
   ```

5. Comece **gogoc**:

   ```sql
   $> /etc/init.d/gogoc start
   ```

   Para iniciar o **gogoc** a cada inicialização do sistema, execute este comando:

   ```sql
   $> rc-update add gogoc default
   ```

6. Use **ping6** para tentar pingar um host:

   ```sql
   $> ping6 ipv6.google.com
   ```

7. Para ver seu endereço IPv6:

   ```sql
   $> ifconfig tun
   ```
