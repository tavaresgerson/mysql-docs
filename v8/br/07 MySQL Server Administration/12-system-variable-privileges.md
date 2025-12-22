#### 7.1.9.1 Privilégios das variáveis do sistema

Uma variável de sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta apenas a sessão atual, ou ambos:

- Para variáveis dinâmicas do sistema, a instrução `SET` pode ser usada para alterar seu valor de tempo de execução global ou de sessão (ou ambos), para afetar a operação da instância do servidor atual. (Para informações sobre variáveis dinâmicas, consulte a Seção 7.1.9.2, "Variáveis de Sistema Dinâmicas")
- Para certas variáveis globais do sistema, `SET` pode ser usado para persistir seu valor para o arquivo `mysqld-auto.cnf` no diretório de dados, para afetar a operação do servidor para inicializações subsequentes. (Para informações sobre variáveis persistentes do sistema e o arquivo `mysqld-auto.cnf`, veja Seção 7.1.9.3, Variáveis Persistentes do Sistema.)
- Para variáveis globais de sistema persistentes, `RESET PERSIST` pode ser usado para remover seu valor de `mysqld-auto.cnf`, para afetar a operação do servidor para startups subsequentes.

Esta seção descreve os privilégios necessários para operações que atribuem valores a variáveis do sistema em tempo de execução. Isto inclui operações que afetam valores de tempo de execução e operações que persistem valores.

Para definir uma variável de sistema global, use uma instrução `SET` com a palavra-chave apropriada.

- Para definir um valor de tempo de execução de uma variável de sistema global, use a instrução `SET GLOBAL`, que requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio depreciado `SUPER`).
- Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` (e definir o valor de tempo de execução), use a instrução `SET PERSIST`, que requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.
- Para persistir uma variável de sistema global para o arquivo `mysqld-auto.cnf` (sem definir o valor de tempo de execução), use a instrução `SET PERSIST_ONLY`, que requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`. O `SET PERSIST_ONLY` pode ser usado para variáveis de sistema dinâmicas e somente leitura, mas é particularmente útil para persistir variáveis somente leitura, para as quais o `SET PERSIST` não pode ser usado.
- Algumas variáveis globais do sistema são restritas à persistência (ver Seção 7.1.9.4, "Variáveis do sistema não persistentes e restritas à persistência"). Para persistir essas variáveis, use a instrução `SET PERSIST_ONLY`, que requer os privilégios descritos anteriormente. Além disso, você deve se conectar ao servidor usando uma conexão criptografada e fornecer um certificado SSL com o valor Subject especificado pela variável do sistema `persist_only_admin_x509_subject`.

Para remover uma variável de sistema global persistente do arquivo `mysqld-auto.cnf`, use a instrução `RESET PERSIST`.

- Para variáveis dinâmicas do sistema, `RESET PERSIST` requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.
- Para variáveis de sistema somente leitura, `RESET PERSIST` requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`.
- Para variáveis com restrição de persistência, `RESET PERSIST` não requer uma conexão criptografada com o servidor feita usando um certificado SSL específico.

Se uma variável de sistema global tem exceções aos requisitos de privilégio anteriores, a descrição da variável indica essas exceções. Exemplos incluem `default_table_encryption` e `mandatory_roles`, que requerem privilégios adicionais. Esses privilégios adicionais se aplicam a operações que definem o valor de tempo de execução global, mas não a operações que persistem o valor.

Para definir um valor de tempo de execução de uma variável de sistema de sessão, use a instrução `SET SESSION`. Em contraste com a definição de valores de tempo de execução globais, a definição de valores de tempo de execução de sessão normalmente não requer privilégios especiais e pode ser feita por qualquer usuário para afetar a sessão atual. Para algumas variáveis do sistema, a definição do valor de sessão pode ter efeitos fora da sessão atual e, portanto, é uma operação restrita que só pode ser feita por usuários que tenham um privilégio especial:

- O privilégio necessário é `SESSION_VARIABLES_ADMIN`.

  ::: info Note

  Qualquer usuário que tenha `SYSTEM_VARIABLES_ADMIN` ou `SUPER` efetivamente tem `SESSION_VARIABLES_ADMIN` por implicação e não precisa ser concedido `SESSION_VARIABLES_ADMIN` explicitamente.

  :::

Se uma variável do sistema de sessão é restrita, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format` e `sql_log_bin`. A definição do valor de sessão dessas variáveis afeta o registro binário para a sessão atual, mas também pode ter implicações mais amplas para a integridade da replicação e backups do servidor.

\[`SESSION_VARIABLES_ADMIN`] permite aos administradores minimizar a pegada de privilégios de usuários que podem ter sido previamente concedidos \[`SYSTEM_VARIABLES_ADMIN`] ou \[`SUPER`] com o propósito de habilitá-los a modificar variáveis de sistema de sessão restritas. Suponha que um administrador tenha criado a seguinte função para conferir a capacidade de definir variáveis de sistema de sessão restritas:

```
CREATE ROLE set_session_sysvars;
GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
```

Qualquer usuário concedido a função `set_session_sysvars` (e que tenha essa função ativa) é capaz de definir variáveis de sistema de sessão restritas. No entanto, esse usuário também é capaz de definir variáveis de sistema globais, o que pode ser indesejável.

Ao modificar a função para ter `SESSION_VARIABLES_ADMIN` em vez de `SYSTEM_VARIABLES_ADMIN`, os privilégios de função podem ser reduzidos à capacidade de definir variáveis de sistema de sessão restritas e nada mais. Para modificar a função, use estas instruções:

```
GRANT SESSION_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
REVOKE SYSTEM_VARIABLES_ADMIN ON *.* FROM set_session_sysvars;
```

A modificação da função tem um efeito imediato: qualquer conta concedida a função `set_session_sysvars` não tem mais `SYSTEM_VARIABLES_ADMIN` e não é capaz de definir variáveis globais do sistema sem ser concedida essa capacidade explicitamente. Uma sequência similar de `GRANT` / `REVOKE` pode ser aplicada a qualquer conta que recebeu `SYSTEM_VARIABLES_ADMIN` diretamente em vez de por meio de uma função.
