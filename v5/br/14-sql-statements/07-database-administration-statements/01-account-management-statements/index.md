### 13.7.1 Demonstrações de Gestão de Conta

13.7.1.1 Declaração ALTER USER

13.7.1.2 Declaração CREATE USER

13.7.1.3 Declaração DROP USER

13.7.1.4 Declaração `GRANT`

13.7.1.5 Declaração de RENOMEAR USUÁRIO

13.7.1.6 Declaração de REVOGAÇÃO

13.7.1.7 Declaração de definir senha

As informações da conta do MySQL são armazenadas nas tabelas do banco de dados do sistema `mysql`. Este banco de dados e o sistema de controle de acesso são discutidos extensivamente no [Capítulo 5, *Administração do Servidor MySQL*] (server-administration.html), que você deve consultar para obter detalhes adicionais.

Importante

Algumas versões do MySQL introduzem alterações nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas funcionalidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Consulte Seção 2.10, “Atualização do MySQL”.

Quando a variável de sistema `read_only` está habilitada, as instruções de gerenciamento de contas exigem o privilégio `SUPER`, além de quaisquer outros privilégios necessários. Isso ocorre porque elas modificam tabelas no banco de dados do sistema `mysql`.
