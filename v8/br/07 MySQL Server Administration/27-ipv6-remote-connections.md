#### 7.1.13.4 Conectando usando endereços de host não locais IPv6

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes remotos. É semelhante ao procedimento anterior para clientes locais, mas os hosts do servidor e do cliente são distintos e cada um tem seu próprio endereço IPv6 não local. O exemplo usa esses endereços:

```
Server host: 2001:db8:0:f101::1
Client host: 2001:db8:0:f101::2
```

Esses endereços são escolhidos da faixa de endereços não roteáveis recomendada pela IANA para fins de documentação e são suficientes para testes na sua rede local. Para aceitar conexões IPv6 de clientes fora da rede local, o host do servidor deve ter um endereço público. Se o seu provedor de rede atribuir um endereço IPv6, você pode usá-lo. Caso contrário, outra maneira de obter um endereço é usar um intermediário IPv6; veja a Seção 7.1.13.5, “Obtendo um endereço IPv6 de um intermediário”.

1. Inicie o servidor MySQL com uma configuração apropriada de `bind_address` para permitir que ele aceite conexões IPv6. Por exemplo, coloque as seguintes linhas no arquivo de opção do servidor e reinicie o servidor:

   ```
   [mysqld]
   bind_address = *
   ```

   Especificar \* (ou `::`) como o valor para `bind_address` permite conexões IPv4 e IPv6 em todas as interfaces IPv4 e IPv6 do host do servidor. Se você quiser vincular o servidor a uma lista específica de endereços, você pode fazer isso especificando uma lista de valores separados por vírgula para `bind_address`. Este exemplo especifica um endereço IPv4, bem como o endereço IPv6 do host do servidor necessário:

   ```
   [mysqld]
   bind_address = 198.51.100.20,2001:db8:0:f101::1
   ```

   Para mais informações, consulte a descrição de `bind_address` na Seção 7.1.8, “Variáveis do sistema do servidor”.
2. No host do servidor (`2001:db8:0:f101::1`), crie uma conta para um usuário que possa se conectar do host do cliente (`2001:db8:0:f101::2`):

   ```
   mysql> CREATE USER 'remoteipv6user'@'2001:db8:0:f101::2' IDENTIFIED BY 'remoteipv6pass';
   ```
3. No host do cliente (`2001:db8:0:f101::2`), inicie o cliente `mysql` para se conectar ao servidor usando a nova conta:

   ```
   $> mysql -h 2001:db8:0:f101::1 -u remoteipv6user -premoteipv6pass
   ```
4. Tente algumas instruções simples que mostram informações de conexão:

   ```
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