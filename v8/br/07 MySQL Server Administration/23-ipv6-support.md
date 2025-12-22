### 7.1.13 Suporte IPv6

O suporte para IPv6 no MySQL inclui essas capacidades:

- O MySQL Server pode aceitar conexões TCP/IP de clientes que se conectam por IPv6. Por exemplo, este comando se conecta por IPv6 ao servidor MySQL no host local:

  ```
  $> mysql -h ::1
  ```

  Para usar esta capacidade, duas coisas têm de ser verdade:

  - O sistema deve ser configurado para suportar o IPv6. Ver Secção 7.1.13.1, "Verificação do suporte do sistema para o IPv6".
  - A configuração padrão do servidor MySQL permite conexões IPv6 além de conexões IPv4. Para alterar a configuração padrão, inicie o servidor com a variável de sistema `bind_address` definida para um valor apropriado.
- Os nomes de conta do MySQL permitem endereços IPv6 para permitir que os DBAs especifiquem privilégios para clientes que se conectam ao servidor através do IPv6. Veja Seção 8.2.4, "Especificar nomes de conta". Os endereços IPv6 podem ser especificados em nomes de conta em instruções como `CREATE USER`, `GRANT`, e `REVOKE`.

  ```
  mysql> CREATE USER 'bill'@'::1' IDENTIFIED BY 'secret';
  mysql> GRANT SELECT ON mydb.* TO 'bill'@'::1';
  ```
- As funções IPv6 permitem a conversão entre os formatos de endereço IPv6 de string e formato interno, e verificam se os valores representam endereços IPv6 válidos. Por exemplo, `INET6_ATON()` e `INET6_NTOA()` são semelhantes a `INET_ATON()` e `INET_NTOA()`, mas tratam de endereços IPv6 além de endereços IPv4.
- Um grupo pode conter uma mistura de membros usando IPv6 e membros usando IPv4.

As seções a seguir descrevem como configurar o MySQL para que os clientes possam se conectar ao servidor via IPv6.
