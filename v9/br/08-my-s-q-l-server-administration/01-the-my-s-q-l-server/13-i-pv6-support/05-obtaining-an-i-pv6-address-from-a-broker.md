#### 7.1.13.5 Obter uma Endereço IPv6 de um Broker

Se você não tiver um endereço IPv6 público que permita que seu sistema se comunique via IPv6 fora de sua rede local, você pode obtê-lo de um broker IPv6. A página do Wikipedia sobre o Broker de Túneis IPv6 lista vários brokers e suas características, como se eles fornecem endereços estáticos e os protocolos de roteamento suportados.

Após configurar seu servidor hospedeiro para usar um endereço IPv6 fornecido pelo broker, inicie o servidor MySQL com uma configuração apropriada de `bind_address` para permitir que o servidor aceite conexões IPv6. Você pode especificar * (ou `::`) como o valor de `bind_address`, ou vincular o servidor ao endereço IPv6 específico fornecido pelo broker. Para mais informações, consulte a descrição de `bind_address` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Lembre-se de que, se o broker alocar endereços dinâmicos, o endereço fornecido para seu sistema pode mudar na próxima vez que você se conectar ao broker. Nesse caso, quaisquer contas que você criar que nomeiem o endereço original se tornam inválidas. Para se vincular a um endereço específico, mas evitar esse problema de mudança de endereço, você pode negociar com o broker para obter um endereço IPv6 estático.

O exemplo a seguir mostra como usar o Freenet6 como o broker e o pacote de cliente IPv6 **gogoc** no Gentoo Linux.

1. Crie uma conta no Freenet6 visitando este URL e se inscrevendo:

   ```
   http://gogonet.gogo6.com
   ```

2. Após criar a conta, vá a este URL, faça login e crie um ID de usuário e senha para o broker IPv6:

   ```
   http://gogonet.gogo6.com/page/freenet6-registration
   ```

3. Como `root`, instale **gogoc**:

   ```
   $> emerge gogoc
   ```

4. Edite `/etc/gogoc/gogoc.conf` para definir os valores de `userid` e `password`. Por exemplo:

   ```
   userid=gogouser
   passwd=gogopass
   ```

5. Inicie **gogoc**:

   ```
   $> /etc/init.d/gogoc start
   ```

   Para iniciar **gogoc** a cada inicialização do sistema, execute este comando:

6. Use **ping6** para tentar pingar um host:

   ```
   $> rc-update add gogoc default
   ```

7. Para ver seu endereço IPv6:

   ```
   $> ping6 ipv6.google.com
   ```