#### Obtenção de um endereço IPv6 de um corretor

Se você não tem um endereço IPv6 público que permita ao seu sistema se comunicar por IPv6 fora da sua rede local, você pode obter um de um corretor IPv6. A página do corretor de túnel IPv6 da Wikipédia lista vários corretores e suas características, como se eles fornecem endereços estáticos e os protocolos de roteamento suportados.

Depois de configurar o host do servidor para usar um endereço IPv6 fornecido pelo corretor, inicie o servidor MySQL com uma configuração apropriada de `bind_address` para permitir que o servidor aceite conexões IPv6. Você pode especificar \* (ou `::`) como o valor `bind_address` ou vincular o servidor ao endereço IPv6 específico fornecido pelo corretor. Para mais informações, consulte a descrição `bind_address` na Seção 7.1.8, Variaveis do Sistema do Servidor.

Observe que, se o corretor alocar endereços dinâmicos, o endereço fornecido para o seu sistema pode mudar na próxima vez que você se conectar ao corretor.

O exemplo a seguir mostra como usar o Freenet6 como corretor e o pacote de cliente IPv6 **gogoc** no Gentoo Linux.

1. Crie uma conta no Freenet6 visitando este URL e inscrevendo-se:

   ```
   http://gogonet.gogo6.com
   ```
2. Depois de criar a conta, vá para esta URL, faça login e crie um ID de usuário e senha para o corretor IPv6:

   ```
   http://gogonet.gogo6.com/page/freenet6-registration
   ```
3. Como `root`, instalar **gogoc**:

   ```
   $> emerge gogoc
   ```
4. Edite `/etc/gogoc/gogoc.conf` para definir os valores `userid` e `password`.

   ```
   userid=gogouser
   passwd=gogopass
   ```
5. Começa a tocar.

   ```
   $> /etc/init.d/gogoc start
   ```

   Para iniciar **gogoc** cada vez que o seu sistema inicia, execute este comando:

   ```
   $> rc-update add gogoc default
   ```
6. Use **ping6** para tentar pingar um host:

   ```
   $> ping6 ipv6.google.com
   ```
7. Para ver o seu endereço IPv6:

   ```
   $> ifconfig tun
   ```
