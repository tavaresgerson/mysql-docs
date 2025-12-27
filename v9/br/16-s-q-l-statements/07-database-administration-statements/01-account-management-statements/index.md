### 15.7.1 Declarações de Gerenciamento de Conta

15.7.1.1 Declaração ALTER USER

15.7.1.2 Declaração CREATE ROLE

15.7.1.3 Declaração CREATE USER

15.7.1.4 Declaração DROP ROLE

15.7.1.5 Declaração DROP USER

15.7.1.6 Declaração GRANT

15.7.1.7 Declaração RENAME USER

15.7.1.8 Declaração REVOKE

15.7.1.9 Declaração SET DEFAULT ROLE

15.7.1.10 Declaração SET PASSWORD

15.7.1.11 Declaração SET ROLE

As informações da conta do MySQL são armazenadas nas tabelas do esquema do sistema `mysql`. Este banco de dados e o sistema de controle de acesso são discutidos extensivamente no Capítulo 7, *Administração do Servidor MySQL*, que você deve consultar para obter detalhes adicionais.

Importante

Algumas versões do MySQL introduzem alterações nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas capacidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Consulte o Capítulo 3, *Atualização do MySQL*.

Quando a variável de sistema `read_only` é habilitada, as declarações de gerenciamento de conta requerem o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`), além de quaisquer outros privilégios necessários. Isso ocorre porque elas modificam tabelas no esquema do sistema `mysql`.

As declarações de gerenciamento de conta são atômicas e seguras em caso de falha. Para mais informações, consulte a Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômicos”.