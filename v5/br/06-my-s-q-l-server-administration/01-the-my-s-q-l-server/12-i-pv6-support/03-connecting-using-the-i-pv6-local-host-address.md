#### 5.1.12.3 Conectar usando o endereço do host local IPv6

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes que se conectam ao servidor local usando o endereço de host local `::1`. As instruções aqui fornecidas assumem que seu sistema suporta IPv6.

1. Inicie o servidor MySQL com uma configuração apropriada de `bind_address` para permitir que ele aceite conexões IPv6. Por exemplo, coloque as seguintes linhas no arquivo de opção do servidor e reinicie o servidor:

   ```sql
   [mysqld]
   bind_address = *
   ```

   Como alternativa, você pode vincular o servidor ao `::1`, mas isso torna o servidor mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição da variável `bind_address` em Seção 5.1.7, “Variáveis do Sistema do Servidor”.

2. Como administrador, conecte-se ao servidor e crie uma conta para um usuário local que se conecta do endereço de host IPv6 local `::1`:

   ```sql
   mysql> CREATE USER 'ipv6user'@'::1' IDENTIFIED BY 'ipv6pass';
   ```

   Para a sintaxe permitida de endereços IPv6 em nomes de contas, consulte Seção 6.2.4, “Especificação de Nomes de Contas”. Além da instrução `CREATE USER`, você pode emitir instruções `GRANT` que dão privilégios específicos à conta, embora isso não seja necessário para as etapas restantes deste procedimento.

3. Invoque o cliente **mysql** para se conectar ao servidor usando a nova conta:

   ```sql
   $> mysql -h ::1 -u ipv6user -pipv6pass
   ```

4. Experimente algumas declarações simples que mostrem informações de conexão:

   ```sql
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
