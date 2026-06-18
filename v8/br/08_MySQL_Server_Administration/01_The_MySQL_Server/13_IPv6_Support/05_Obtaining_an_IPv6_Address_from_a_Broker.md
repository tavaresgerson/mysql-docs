#### 7.1.13.5. Obter uma Endereço IPv6 de um Broker

Se você não tiver um endereço IPv6 público que permita que seu sistema se comunique via IPv6 fora da sua rede local, você pode obtê-lo de um intermediário de IPv6. A página do intermediário de túnel IPv6 da Wikipedia lista vários intermediários e suas características, como se eles fornecem endereços estáticos e os protocolos de roteamento suportados.

Depois de configurar o seu servidor hospedeiro para usar um endereço IPv6 fornecido pelo intermediário, inicie o servidor MySQL com uma configuração apropriada `bind_address` para permitir que o servidor aceite conexões IPv6. Você pode especificar \* (ou `::`) como o valor `bind_address`, ou vincular o servidor ao endereço IPv6 específico fornecido pelo intermediário. Para mais informações, consulte a descrição do `bind_address` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Observe que, se o corretor alocar endereços dinâmicos, o endereço fornecido para o seu sistema pode mudar na próxima vez que você se conectar ao corretor. Nesse caso, quaisquer contas que você criar que nomeiem o endereço original se tornam inválidas. Para se conectar a um endereço específico, mas evitar esse problema de mudança de endereço, você pode negociar com o corretor para obter um endereço IPv6 estático.

O exemplo a seguir mostra como usar o Freenet6 como intermediário e o pacote de cliente IPv6 **gogoc** no Gentoo Linux.

1. Crie uma conta no Freenet6 visitando este URL e se inscrevendo:

   ```
   http://gogonet.gogo6.com
   ```

2. Depois de criar a conta, vá até essa URL, faça login e crie um ID de usuário e uma senha para o intermediário IPv6:

   ```
   http://gogonet.gogo6.com/page/freenet6-registration
   ```

3. Como `root`, instale o **gogoc**:

   ```
   $> emerge gogoc
   ```

4. Editar `/etc/gogoc/gogoc.conf` para definir os valores de `userid` e `password`. Por exemplo:

   ```
   userid=gogouser
   passwd=gogopass
   ```

5. Comece **gogoc**:

   ```
   $> /etc/init.d/gogoc start
   ```

   Para iniciar o **gogoc** a cada inicialização do sistema, execute este comando:

   ```
   $> rc-update add gogoc default
   ```

6. Use **ping6** para tentar pingar um host:

   ```
   $> ping6 ipv6.google.com
   ```

7. Para ver seu endereço IPv6:

   ```
   $> ifconfig tun
   ```
