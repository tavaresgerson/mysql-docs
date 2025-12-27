## 8.2 Controle de Acesso e Gerenciamento de Contas

8.2.1 Nomes de Usuários e Senhas de Contas

8.2.2 Privilegios Fornecidos pelo MySQL

8.2.3 Tabelas de Concessão

8.2.4 Especificação de Nomes de Contas

8.2.5 Especificação de Nomes de Papéis

8.2.6 Controle de Acesso, Etapa 1: Verificação de Conexão

8.2.7 Controle de Acesso, Etapa 2: Verificação de Solicitação

8.2.8 Adição de Contas, Atribuição de Privilegios e Remoção de Contas

8.2.9 Contas Reservadas

8.2.10 Uso de Papéis

8.2.11 Categorias de Contas

8.2.12 Restrição de Privilegios Usando Revocações Parciais

8.2.13 Quando as Alterações nos Privilegios Se Tornam Efetivas

8.2.14 Atribuição de Senhas de Contas

8.2.15 Gerenciamento de Senhas

8.2.16 Manipulação do Servidor de Senhas Expirantes

8.2.17 Autenticação Conectada

8.2.18 Autenticação Multifator

8.2.19 Usuários de Proxy

8.2.20 Bloqueio de Contas

8.2.21 Definição de Limites de Recursos de Contas

8.2.22 Solução de Problemas para Conectar-se ao MySQL

8.2.23 Auditoria de Atividade de Contas Baseada em SQL

O MySQL permite a criação de contas que permitem que os usuários clientes se conectem ao servidor e acessem dados gerenciados pelo servidor. A função principal do sistema de privilégios do MySQL é autenticar um usuário que se conecta de um determinado host e associar esse usuário a privilégios em um banco de dados, como `SELECT`, `INSERT`, `UPDATE` e `DELETE`. A funcionalidade adicional inclui a capacidade de conceder privilégios para operações administrativas.

Para controlar quais usuários podem se conectar, cada conta pode ser atribuída credenciais de autenticação, como uma senha. A interface de usuário para contas MySQL consiste em instruções SQL, como `CREATE USER`, `GRANT` e `REVOKE`. Veja a Seção 15.7.1, “Instruções de Gerenciamento de Contas”.

O sistema de privilégios do MySQL garante que todos os usuários possam realizar apenas as operações permitidas a eles. Como usuário, quando você se conecta a um servidor MySQL, sua identidade é determinada por *o host a partir do qual você se conecta* e *o nome de usuário que você especifica*. Quando você emite solicitações após a conexão, o sistema concede privilégios de acordo com sua identidade e *o que você deseja fazer*.

O MySQL considera tanto o nome do seu host quanto o nome de usuário para identificá-lo, pois não há motivo para assumir que um nome de usuário específico pertence à mesma pessoa em todos os hosts. Por exemplo, o usuário `joe` que se conecta de `office.example.com` não precisa ser a mesma pessoa que o usuário `joe` que se conecta de `home.example.com`. O MySQL lida com isso ao permitir que você distinga usuários em diferentes hosts que, por acaso, tenham o mesmo nome: você pode conceder um conjunto de privilégios para conexões por `joe` de `office.example.com` e um conjunto diferente de privilégios para conexões por `joe` de `home.example.com`. Para ver quais privilégios uma conta específica tem, use a instrução `SHOW GRANTS`. Por exemplo:

```
SHOW GRANTS FOR 'joe'@'office.example.com';
SHOW GRANTS FOR 'joe'@'home.example.com';
```

Internamente, o servidor armazena informações de privilégios nas tabelas de concessão do banco de dados do sistema `mysql`. O servidor MySQL lê o conteúdo dessas tabelas na memória quando ele é iniciado e baseia as decisões de controle de acesso nas cópias de memória das tabelas de concessão.

O controle de acesso do MySQL envolve duas etapas quando você executa um programa cliente que se conecta ao servidor:

**Etapa 1:** O servidor aceita ou rejeita a conexão com base em sua identidade e se você pode verificar sua identidade fornecendo a senha correta.

**Fase 2:** Supondo que você consiga se conectar, o servidor verifica cada declaração que você emite para determinar se você tem privilégios suficientes para executá-la. Por exemplo, se você tentar selecionar linhas de uma tabela em um banco de dados ou excluir uma tabela do banco de dados, o servidor verifica se você tem o privilégio `SELECT` para a tabela ou o privilégio `DROP` para o banco de dados.

Para uma descrição mais detalhada do que acontece em cada fase, consulte a Seção 8.2.6, “Controle de Acesso, Fase 1: Verificação de Conexão”, e a Seção 8.2.7, “Controle de Acesso, Fase 2: Verificação da Solicitação”. Para obter ajuda no diagnóstico de problemas relacionados a privilégios, consulte a Seção 8.2.22, “Soluções de Problemas de Conexão ao MySQL”.

Se seus privilégios forem alterados (por você ou por outra pessoa) enquanto você estiver conectado, essas alterações não necessariamente terão efeito imediatamente na próxima declaração que você emitir. Para obter detalhes sobre as condições sob as quais o servidor recarrega as tabelas de concessão, consulte a Seção 8.2.13, “Quando as Alterações de Privilégios Têm Efeito”.

Há algumas coisas que você não pode fazer com o sistema de privilégios do MySQL:

* Você não pode especificar explicitamente que um usuário específico deve ser negado o acesso. Ou seja, você não pode corresponder explicitamente um usuário e, em seguida, recusar a conexão.

* Você não pode especificar que um usuário tem privilégios para criar ou excluir tabelas em um banco de dados, mas não para criar ou excluir o próprio banco de dados.

* Uma senha se aplica globalmente a uma conta. Você não pode associar uma senha a um objeto específico, como um banco de dados, tabela ou rotina.