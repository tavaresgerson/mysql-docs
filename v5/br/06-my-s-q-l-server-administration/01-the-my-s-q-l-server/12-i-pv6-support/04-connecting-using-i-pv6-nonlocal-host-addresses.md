#### 5.1.12.4 Conectar usando endereços de host não locais IPv6

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes remotos. É semelhante ao procedimento anterior para clientes locais, mas os hosts do servidor e do cliente são distintos e cada um tem seu próprio endereço IPv6 não local. O exemplo usa esses endereços:

```sql
Server host: 2001:db8:0:f101::1
Client host: 2001:db8:0:f101::2
```

Esses endereços são escolhidos da faixa de endereços não roteáveis recomendada pela IANA para fins de documentação e são suficientes para testes na sua rede local. Para aceitar conexões IPv6 de clientes fora da rede local, o host do servidor deve ter um endereço público. Se o seu provedor de rede atribuir um endereço IPv6, você pode usá-lo. Caso contrário, outra maneira de obter um endereço é usar um intermediário IPv6; veja Seção 5.1.12.5, “Obtendo um Endereço IPv6 de um Intermediário”.

1. Inicie o servidor MySQL com uma configuração apropriada de `bind_address` para permitir que ele aceite conexões IPv6. Por exemplo, coloque as seguintes linhas no arquivo de opção do servidor e reinicie o servidor:

   ```sql
   [mysqld]
   bind_address = *
   ```

   Como alternativa, você pode vincular o servidor ao endereço `2001:db8:0:f101::1`, mas isso torna o servidor mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição da variável `bind_address` em Seção 5.1.7, “Variáveis do Sistema do Servidor”.

2. No host do servidor (`2001:db8:0:f101::1`), crie uma conta para um usuário que se conecta do host do cliente (`2001:db8:0:f101::2`):

   ```sql
   mysql> CREATE USER 'remoteipv6user'@'2001:db8:0:f101::2' IDENTIFIED BY 'remoteipv6pass';
   ```

3. No host do cliente (`2001:db8:0:f101::2`), invoque o cliente **mysql** para se conectar ao servidor usando a nova conta:

   ```sql
   $> mysql -h 2001:db8:0:f101::1 -u remoteipv6user -premoteipv6pass
   ```

4. Experimente algumas declarações simples que mostrem informações de conexão:

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
