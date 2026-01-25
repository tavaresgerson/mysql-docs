### 5.1.12 Suporte a IPv6

[5.1.12.1 Verificando o Suporte do Sistema a IPv6](ipv6-system-support.html)

[5.1.12.2 Configurando o MySQL Server para Permitir Conexões IPv6](ipv6-server-config.html)

[5.1.12.3 Conectando Usando o Endereço IPv6 do Host Local](ipv6-local-connections.html)

[5.1.12.4 Conectando Usando Endereços IPv6 de Hosts Não Locais](ipv6-remote-connections.html)

[5.1.12.5 Obtendo um Endereço IPv6 de um Broker](ipv6-brokers.html)

O suporte a IPv6 no MySQL inclui as seguintes capacidades:

* O MySQL Server pode aceitar conexões TCP/IP de Clients que se conectam via IPv6. Por exemplo, este comando se conecta via IPv6 ao MySQL Server no host local:

  ```sql
  $> mysql -h ::1
  ```

  Para usar esta capacidade, duas condições devem ser verdadeiras:

  + Seu sistema deve estar configurado para oferecer suporte a IPv6. Consulte [Seção 5.1.12.1, “Verificando o Suporte do Sistema a IPv6”](ipv6-system-support.html "5.1.12.1 Verifying System Support for IPv6").

  + A configuração padrão do MySQL Server permite conexões IPv6 além das conexões IPv4. Para alterar a configuração padrão, inicie o Server com a [system variable `bind_address`](server-system-variables.html#sysvar_bind_address) definida para um valor apropriado. Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* Nomes de conta MySQL permitem endereços IPv6 para capacitar DBAs a especificar privilégios para Clients que se conectam ao Server via IPv6. Consulte [Seção 6.2.4, “Especificando Nomes de Conta”](account-names.html "6.2.4 Specifying Account Names"). Endereços IPv6 podem ser especificados em nomes de conta em statements como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"). Por exemplo:

  ```sql
  mysql> CREATE USER 'bill'@'::1' IDENTIFIED BY 'secret';
  mysql> GRANT SELECT ON mydb.* TO 'bill'@'::1';
  ```

* Funções IPv6 permitem a conversão entre formatos de endereço IPv6 de string e formato interno, e a verificação se os valores representam endereços IPv6 válidos. Por exemplo, [`INET6_ATON()`](miscellaneous-functions.html#function_inet6-aton) e [`INET6_NTOA()`](miscellaneous-functions.html#function_inet6-ntoa) são semelhantes a [`INET_ATON()`](miscellaneous-functions.html#function_inet-aton) e [`INET_NTOA()`](miscellaneous-functions.html#function_inet-ntoa), mas lidam com endereços IPv6 além dos endereços IPv4. Consulte [Seção 12.20, “Funções Diversas”](miscellaneous-functions.html "12.20 Miscellaneous Functions").

As seções a seguir descrevem como configurar o MySQL para que os Clients possam se conectar ao Server via IPv6.