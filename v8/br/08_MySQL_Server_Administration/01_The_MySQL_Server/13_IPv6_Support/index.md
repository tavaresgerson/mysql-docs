### 7.1.13 Suporte ao IPv6

7.1.13.1 Verificar o suporte do sistema para IPv6

7.1.13.2 Configurando o servidor MySQL para permitir conexões IPv6

7.1.13.3 Conectar usando a Endereço de Host Local IPv6

7.1.13.4 Conectar usando endereços de host não locais IPv6

7.1.13.5 Obter uma Endereço IPv6 de um Broker

O suporte ao IPv6 no MySQL inclui as seguintes funcionalidades:

- O MySQL Server pode aceitar conexões TCP/IP de clientes que se conectam via IPv6. Por exemplo, este comando se conecta via IPv6 ao servidor MySQL no host local:

  ```
  $> mysql -h ::1
  ```

  Para usar essa capacidade, duas coisas devem ser verdadeiras:

  - Seu sistema deve ser configurado para suportar o IPv6. Consulte a Seção 7.1.13.1, “Verificação do Suporte do Sistema para IPv6”.

  - A configuração padrão do servidor MySQL permite conexões IPv6, além das conexões IPv4. Para alterar a configuração padrão, inicie o servidor com a variável de sistema `bind_address` definida para um valor apropriado. Consulte a Seção 7.1.8, “Variáveis de sistema do servidor”.

- Os nomes de contas do MySQL permitem que os administradores de banco de dados (DBAs) especifiquem privilégios para clientes que se conectam ao servidor via IPv6. Veja a Seção 8.2.4, “Especificação de Nomes de Contas”. Endereços IPv6 podem ser especificados em nomes de contas em declarações como `CREATE USER`, `GRANT` e `REVOKE`. Por exemplo:

  ```
  mysql> CREATE USER 'bill'@'::1' IDENTIFIED BY 'secret';
  mysql> GRANT SELECT ON mydb.* TO 'bill'@'::1';
  ```

- As funções do IPv6 permitem a conversão entre formatos de endereço IPv6 internos e de string, além de verificar se os valores representam endereços IPv6 válidos. Por exemplo, `INET6_ATON()` e `INET6_NTOA()` são semelhantes a `INET_ATON()` e `INET_NTOA()`, mas lidam com endereços IPv6, além de endereços IPv4. Veja a Seção 14.23, “Funções Diversas”.

- A partir do MySQL 8.0.14, os membros do grupo de replicação em grupo podem usar endereços IPv6 para comunicações dentro do grupo. Um grupo pode conter uma mistura de membros que usam IPv6 e membros que usam IPv4. Consulte a Seção 20.5.5, “Suporte para IPv6 e para grupos mistos IPv6 e IPv4”.

As seções a seguir descrevem como configurar o MySQL para que os clientes possam se conectar ao servidor via IPv6.
