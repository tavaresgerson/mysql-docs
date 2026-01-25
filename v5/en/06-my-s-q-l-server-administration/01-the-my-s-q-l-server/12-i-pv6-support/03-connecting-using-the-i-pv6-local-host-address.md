#### 5.1.12.3 Conectando Usando o Endereço IPv6 de Host Local

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes que se conectam ao servidor local usando o endereço de host local `::1`. As instruções fornecidas aqui presumem que seu sistema oferece suporte a IPv6.

1. Inicie o servidor MySQL com uma configuração [`bind_address`](server-system-variables.html#sysvar_bind_address) apropriada para permitir que ele aceite conexões IPv6. Por exemplo, insira as seguintes linhas no arquivo de opções do servidor e reinicie o servidor:

   ```sql
   [mysqld]
   bind_address = *
   ```

   Alternativamente, você pode fazer o bind do servidor para `::1`, mas isso torna o servidor mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição de [`bind_address`](server-system-variables.html#sysvar_bind_address) na [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

2. Como administrador, conecte-se ao servidor e crie uma conta para um usuário local que se conecta a partir do endereço de host IPv6 local `::1`:

   ```sql
   mysql> CREATE USER 'ipv6user'@'::1' IDENTIFIED BY 'ipv6pass';
   ```

   Para a sintaxe permitida de endereços IPv6 em nomes de conta, consulte [Seção 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). Além da instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), você pode emitir instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") que concedem privilégios específicos à conta, embora isso não seja necessário para as etapas restantes deste procedimento.

3. Invoque o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para se conectar ao servidor usando a nova conta:

   ```sql
   $> mysql -h ::1 -u ipv6user -pipv6pass
   ```

4. Tente algumas instruções simples que exibem informações de conexão:

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