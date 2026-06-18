#### 15.7.7.12 Declaração SHOW CREATE USER

```
SHOW CREATE USER user
```

Esta declaração mostra a declaração `CREATE USER` que cria o usuário nomeado. Um erro ocorre se o usuário não existir. A declaração requer o privilégio `SELECT` para o esquema de sistema `mysql`, exceto para ver informações para o usuário atual. Para o usuário atual, o privilégio `SELECT` para a tabela de sistema `mysql.user` é necessário para exibir o hash da senha na cláusula `IDENTIFIED AS`; caso contrário, o hash é exibido como `<secret>`.

Para nomear a conta, use o formato descrito na Seção 8.2.4, “Especificando Nomes de Conta”. A parte do nome da conta que contém o nome do host, se omitida, tem como padrão `'%'`. Também é possível especificar `CURRENT_USER` ou `CURRENT_USER()` para se referir à conta associada à sessão atual.

Os valores de hash de senha exibidos na cláusula `IDENTIFIED WITH` do resultado de `SHOW CREATE USER` podem conter caracteres não imprimíveis que têm efeitos adversos em telas de terminal e em outros ambientes. Ativação da variável de sistema `print_identified_with_as_hex` (disponível a partir do MySQL 8.0.17) faz com que `SHOW CREATE USER` exiba esses valores de hash como strings hexadecimais, em vez de como literais de string regulares. Valores de hash que não contêm caracteres não imprimíveis ainda são exibidos como literais de string regulares, mesmo com essa variável ativada.

```
mysql> CREATE USER 'u1'@'localhost' IDENTIFIED BY 'secret';
mysql> SET print_identified_with_as_hex = ON;
mysql> SHOW CREATE USER 'u1'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for u1@localhost: CREATE USER `u1`@`localhost`
IDENTIFIED WITH 'caching_sha2_password'
AS 0x244124303035240C7745603626313D613C4C10633E0A104B1E14135A544A7871567245614F4872344643546336546F624F6C7861326932752F45622F4F473273597557627139
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
PASSWORD HISTORY DEFAULT PASSWORD REUSE INTERVAL DEFAULT
PASSWORD REQUIRE CURRENT DEFAULT
```

Para exibir os privilégios concedidos a uma conta, use a declaração `SHOW GRANTS`. Veja a Seção 15.7.7.21, “Declaração SHOW GRANTS”.
