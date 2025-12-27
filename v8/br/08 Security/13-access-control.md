## 8.2 Controle de Acesso e Gerenciamento de Contas

O MySQL permite a criação de contas que permitem que os usuários clientes se conectem ao servidor e acessem dados gerenciados pelo servidor. A função principal do sistema de privilégios do MySQL é autenticar um usuário que se conecta de um determinado host e associar esse usuário a privilégios em um banco de dados, como `SELECT`, `INSERT`, `UPDATE` e `DELETE`. A funcionalidade adicional inclui a capacidade de conceder privilégios para operações administrativas.

Para controlar quais usuários podem se conectar, cada conta pode ser atribuída credenciais de autenticação, como uma senha. A interface de usuário para contas do MySQL consiste em instruções SQL, como `CREATE USER`, `GRANT` e `REVOKE`. Veja a Seção 15.7.1, “Instruções de Gerenciamento de Contas”.

O sistema de privilégios do MySQL garante que todos os usuários possam realizar apenas as operações permitidas a eles. Como usuário, quando você se conecta a um servidor MySQL, sua identidade é determinada por *o host de onde você se conecta* e *o nome de usuário que você especifica*. Quando você emite solicitações após se conectar, o sistema concede privilégios de acordo com sua identidade e *o que você deseja fazer*.

O MySQL considera tanto o nome do seu host quanto o nome de usuário para identificá-lo, pois não há motivo para assumir que um determinado nome de usuário pertence à mesma pessoa em todos os hosts. Por exemplo, o usuário `joe` que se conecta de `office.example.com` não precisa ser a mesma pessoa que o usuário `joe` que se conecta de `home.example.com`. O MySQL lida isso permitindo que você distinga usuários em diferentes hosts que, por acaso, têm o mesmo nome: você pode conceder um conjunto de privilégios para conexões por `joe` de `office.example.com` e um conjunto diferente de privilégios para conexões por `joe` de `home.example.com`. Para ver quais privilégios uma determinada conta tem, use a instrução `SHOW GRANTS`. Por exemplo:

```
SHOW GRANTS FOR 'joe'@'office.example.com';
SHOW GRANTS FOR 'joe'@'home.example.com';
```

Internamente, o servidor armazena informações de privilégio nas tabelas de concessão do banco de dados do sistema `mysql`. O servidor MySQL lê o conteúdo dessas tabelas na memória quando ele é iniciado e baseia as decisões de controle de acesso nas cópias de memória das tabelas de concessão.

O controle de acesso do MySQL envolve duas etapas ao executar um programa cliente que se conecta ao servidor:

**Etapa 1:** O servidor aceita ou rejeita a conexão com base na sua identidade e se você pode verificar sua identidade fornecendo a senha correta.

**Etapa 2:** Supondo que você possa se conectar, o servidor verifica cada declaração que você emite para determinar se você tem privilégios suficientes para executá-la. Por exemplo, se você tentar selecionar linhas de uma tabela em um banco de dados ou excluir uma tabela do banco de dados, o servidor verifica se você tem o privilégio `SELECT` para a tabela ou o privilégio `DROP` para o banco de dados.

Para uma descrição mais detalhada do que acontece em cada etapa, consulte a Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”, e a Seção 8.2.7, “Controle de Acesso, Etapa 2: Verificação da Solicitação”. Para obter ajuda no diagnóstico de problemas relacionados a privilégios, consulte a Seção 8.2.22, “Soluções de Problemas de Conexão ao MySQL”.

Se seus privilégios forem alterados (seja por você ou por outra pessoa) enquanto você estiver conectado, essas alterações não necessariamente entram em vigor imediatamente para a próxima declaração que você emitir. Para obter detalhes sobre as condições sob as quais o servidor recarrega as tabelas de concessão, consulte a Seção 8.2.13, “Quando as Alterações de Privilégios Entram em Vigor”.

Há algumas coisas que você não pode fazer com o sistema de privilégios do MySQL:

* Você não pode especificar explicitamente que um usuário específico deve ser negado o acesso. Ou seja, você não pode combinar explicitamente um usuário e, em seguida, recusar a conexão.
* Você não pode especificar que um usuário tem privilégios para criar ou excluir tabelas em um banco de dados, mas não para criar ou excluir o próprio banco de dados.
* Uma senha se aplica globalmente a uma conta. Você não pode associar uma senha a um objeto específico, como um banco de dados, tabela ou rotina.