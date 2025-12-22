#### 7.1.13.3 Conexão usando o endereço de host local IPv6

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes que se conectam ao servidor local usando o endereço de host local `::1`.

1. Inicie o servidor MySQL com uma configuração apropriada de `bind_address` para permitir que ele aceite conexões IPv6. Por exemplo, coloque as seguintes linhas no arquivo de opções do servidor e reinicie o servidor:

   ```
   [mysqld]
   bind_address = *
   ```

   Especificar \* (ou `::`) como o valor para `bind_address` permite conexões IPv4 e IPv6 em todas as interfaces IPv4 e IPv6 do host do servidor. Se você quiser vincular o servidor a uma lista específica de endereços, você pode fazer isso especificando uma lista de valores separados por vírgulas para `bind_address`.

   ```
   [mysqld]
   bind_address = 127.0.0.1,::1
   ```

   Para obter mais informações, consulte a descrição do `bind_address` na Seção 7.1.8, Variaveis do sistema do servidor.
2. Como administrador, conecte-se ao servidor e crie uma conta para um usuário local que pode se conectar a partir do endereço de host local IPv6:

   ```
   mysql> CREATE USER 'ipv6user'@'::1' IDENTIFIED BY 'ipv6pass';
   ```

   Para a sintaxe permitida de endereços IPv6 em nomes de conta, veja Seção 8.2.4, Especificar nomes de conta. Além da instrução `CREATE USER`, você pode emitir instruções `GRANT` que dão privilégios específicos à conta, embora isso não seja necessário para as etapas restantes deste procedimento.
3. Invocar o \*\* mysql \*\* cliente para se conectar ao servidor usando a nova conta:

   ```
   $> mysql -h ::1 -u ipv6user -pipv6pass
   ```
4. Tente algumas instruções simples que mostram informações de conexão:

   ```
   mysql> STATUS
   ...
   Connection:   ::1 via TCP/IP
   ...

   mysql> SELECT CURRENT_USER(), @@bind_address;
   +----------------+----------------+
   | CURRENT_USER() | @@bind_address |
   +----------------+----------------+
   | ipv6user@::1   | ::             |
   +----------------+----------------+
   ```
