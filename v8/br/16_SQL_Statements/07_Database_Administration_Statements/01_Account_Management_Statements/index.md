### 15.7.1 Demonstrações de Gestão de Conta

15.7.1.1 Declaração ALTER USER

15.7.1.2 Declaração de Criação de Papel

15.7.1.3 Declaração CREATE USER

15.7.1.4 Declaração DROP ROLE

15.7.1.5 Declaração DROP USER

15.7.1.6 Declaração GRANT

15.7.1.7 Declaração de RENOMEAR USUÁRIO

15.7.1.8 Declaração de REVOGAÇÃO

15.7.1.9 Declaração de definir o papel padrão

15.7.1.10 Declaração de definir senha

15.7.1.11 Declaração de DEFINIR PAPEL

As informações da conta do MySQL são armazenadas nas tabelas do esquema de sistema `mysql`. Este banco de dados e o sistema de controle de acesso são discutidos extensivamente no Capítulo 7, *Administração do Servidor MySQL*, que você deve consultar para obter detalhes adicionais.

Importante

Algumas versões do MySQL introduzem alterações nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas funcionalidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Consulte o Capítulo 3, *Atualizando o MySQL*.

Quando a variável de sistema `read_only` está habilitada, as declarações de gerenciamento de contas exigem o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`), além de quaisquer outros privilégios necessários. Isso ocorre porque elas modificam tabelas no esquema de sistema `mysql`.

As declarações de gerenciamento de contas são atômicas e seguras em caso de falha. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômicos”.
