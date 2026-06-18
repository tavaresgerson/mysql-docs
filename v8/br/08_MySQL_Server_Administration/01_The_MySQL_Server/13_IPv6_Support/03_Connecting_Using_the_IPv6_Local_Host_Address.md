#### 7.1.13.3 Conectar usando o endereço do host local IPv6

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes que se conectam ao servidor local usando o endereço de host local `::1`. As instruções aqui fornecidas assumem que o seu sistema suporta IPv6.

1. Inicie o servidor MySQL com uma configuração apropriada `bind_address` para permitir que ele aceite conexões IPv6. Por exemplo, coloque as seguintes linhas no arquivo de opção do servidor e reinicie o servidor:

   ```
   [mysqld]
   bind_address = *
   ```

   Especificar \* (ou `::`) como o valor para `bind_address` permite conexões IPv4 e IPv6 em todas as interfaces IPv4 e IPv6 do host do servidor. Se você quiser vincular o servidor a uma lista específica de endereços, pode fazer isso a partir do MySQL 8.0.13, especificando uma lista de valores separados por vírgula para `bind_address`. Este exemplo especifica os endereços do host local tanto para IPv4 quanto para IPv6:

   ```
   [mysqld]
   bind_address = 127.0.0.1,::1
   ```

   Para mais informações, consulte a descrição do `bind_address` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

2. Como administrador, conecte-se ao servidor e crie uma conta para um usuário local que possa se conectar a partir do endereço de host IPv6 local `::1`:

   ```
   mysql> CREATE USER 'ipv6user'@'::1' IDENTIFIED BY 'ipv6pass';
   ```

   Para a sintaxe permitida de endereços IPv6 em nomes de contas, consulte a Seção 8.2.4, “Especificando Nomes de Contas”. Além da declaração `CREATE USER`, você pode emitir declarações `GRANT` que dão privilégios específicos à conta, embora isso não seja necessário para as etapas restantes deste procedimento.

3. Invoque o cliente **mysql** para se conectar ao servidor usando a nova conta:

   ```
   $> mysql -h ::1 -u ipv6user -pipv6pass
   ```

4. Experimente algumas declarações simples que mostrem informações de conexão:

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
