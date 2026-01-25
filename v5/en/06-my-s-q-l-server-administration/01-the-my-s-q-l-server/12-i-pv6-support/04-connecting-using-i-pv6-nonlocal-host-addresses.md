#### 5.1.12.4 Conectando Usando Endereços IPv6 de Hosts Não Locais

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por meio de Clients remotos. É semelhante ao procedimento anterior para Clients locais, mas os hosts do Server e do Client são distintos e cada um tem seu próprio endereço IPv6 não local. O exemplo utiliza estes endereços:

```sql
Server host: 2001:db8:0:f101::1
Client host: 2001:db8:0:f101::2
```

Esses endereços são escolhidos a partir do intervalo de endereços não roteáveis recomendado pela [IANA](http://www.iana.org/assignments/ipv6-unicast-address-assignments/ipv6-unicast-address-assignments.xml) para fins de documentação e são suficientes para testes em sua rede local. Para aceitar conexões IPv6 de Clients fora da rede local, o host do Server deve ter um endereço público. Se seu provedor de rede lhe atribuir um endereço IPv6, você pode usá-lo. Caso contrário, outra maneira de obter um endereço é usar um IPv6 broker; consulte [Section 5.1.12.5, “Obtaining an IPv6 Address from a Broker”](ipv6-brokers.html "5.1.12.5 Obtaining an IPv6 Address from a Broker").

1. Inicie o MySQL Server com uma configuração apropriada de [`bind_address`](server-system-variables.html#sysvar_bind_address) para permitir que ele aceite conexões IPv6. Por exemplo, insira as seguintes linhas no arquivo de opções do Server e reinicie o Server:

   ```sql
   [mysqld]
   bind_address = *
   ```

   Alternativamente, você pode vincular o Server a `2001:db8:0:f101::1`, mas isso torna o Server mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição de [`bind_address`](server-system-variables.html#sysvar_bind_address) em [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

2. No host do Server (`2001:db8:0:f101::1`), crie uma conta para um usuário que se conecta a partir do host do Client (`2001:db8:0:f101::2`):

   ```sql
   mysql> CREATE USER 'remoteipv6user'@'2001:db8:0:f101::2' IDENTIFIED BY 'remoteipv6pass';
   ```

3. No host do Client (`2001:db8:0:f101::2`), invoque o Client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para se conectar ao Server usando a nova conta:

   ```sql
   $> mysql -h 2001:db8:0:f101::1 -u remoteipv6user -premoteipv6pass
   ```

4. Tente algumas instruções simples que mostram informações de conexão:

   ```sql
   mysql> STATUS
   ...
   Connection:   2001:db8:0:f101::1 via TCP/IP
   ...

   mysql> SELECT CURRENT_USER(), @@bind_address;
   +-----------------------------------+----------------+
   | CURRENT_USER()                    | @@bind_address |
   +-----------------------------------+----------------+
   | remoteipv6user@2001:db8:0:f101::2 | ::             |
   +-----------------------------------+----------------+
   ```