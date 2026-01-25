### 13.7.1 Declarações de Gerenciamento de Contas

[13.7.1.1 Declaração ALTER USER](alter-user.html)

[13.7.1.2 Declaração CREATE USER](create-user.html)

[13.7.1.3 Declaração DROP USER](drop-user.html)

[13.7.1.4 Declaração GRANT](grant.html)

[13.7.1.5 Declaração RENAME USER](rename-user.html)

[13.7.1.6 Declaração REVOKE](revoke.html)

[13.7.1.7 Declaração SET PASSWORD](set-password.html)

As informações de conta do MySQL são armazenadas nas tabelas do banco de dados de sistema `mysql`. Este banco de dados e o sistema de controle de acesso são discutidos extensivamente no [Capítulo 5, *Administração do Servidor MySQL*](server-administration.html "Capítulo 5 Administração do Servidor MySQL"), o qual você deve consultar para detalhes adicionais.

Importante

Alguns lançamentos do MySQL introduzem alterações nas grant tables para adicionar novos privileges ou recursos. Para garantir que você possa aproveitar quaisquer novas capacidades, atualize suas grant tables para a estrutura atual sempre que fizer upgrade do MySQL. Consulte [Seção 2.10, “Fazendo Upgrade do MySQL”](upgrading.html "2.10 Fazendo Upgrade do MySQL").

Quando a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) está habilitada, as declarações de gerenciamento de contas exigem o privilege [`SUPER`](privileges-provided.html#priv_super), além de quaisquer outros privileges exigidos. Isso ocorre porque elas modificam tabelas no banco de dados de sistema `mysql`.