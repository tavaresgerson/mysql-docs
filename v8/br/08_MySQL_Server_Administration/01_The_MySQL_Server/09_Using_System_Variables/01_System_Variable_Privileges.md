#### 7.1.9.1 Privilegios de variáveis de sistema

Uma variável de sistema pode ter um valor global que afeta o funcionamento do servidor como um todo, um valor de sessão que afeta apenas a sessão atual ou ambos:

- Para variáveis de sistema dinâmicas, a instrução `SET` pode ser usada para alterar seu valor de execução global ou de sessão (ou ambos), afetando o funcionamento da instância atual do servidor. (Para informações sobre variáveis dinâmicas, consulte a Seção 7.1.9.2, “Variáveis de Sistema Dinâmicas”.)

- Para certas variáveis do sistema global, `SET` pode ser usado para persistir seu valor no arquivo `mysqld-auto.cnf` no diretório de dados, para afetar o funcionamento do servidor em futuras inicializações. (Para informações sobre a persistência de variáveis do sistema e o arquivo `mysqld-auto.cnf`, consulte a Seção 7.1.9.3, “Variáveis do Sistema Persistidas”.)

- Para variáveis de sistema globais persistentes, `RESET PERSIST` pode ser usado para remover seu valor de `mysqld-auto.cnf`, afetando o funcionamento do servidor para as próximas inicializações.

Esta seção descreve os privilégios necessários para operações que atribuem valores às variáveis do sistema em tempo de execução. Isso inclui operações que afetam valores em tempo de execução e operações que persistem valores.

Para definir uma variável de sistema global, use uma declaração `SET` com a palavra-chave apropriada. Esses privilégios se aplicam:

- Para definir o valor de execução de uma variável de sistema global, use a instrução `SET GLOBAL`, que requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`).

- Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` (e definir o valor de tempo de execução), use a instrução `SET PERSIST`, que requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.

- Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` (sem definir o valor de execução), use a instrução `SET PERSIST_ONLY`, que requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`. `SET PERSIST_ONLY` pode ser usado tanto para variáveis de sistema dinâmicas quanto de leitura somente, mas é particularmente útil para persistir variáveis de leitura somente, para as quais `SET PERSIST` não pode ser usado.

- Algumas variáveis de sistema globais são restritas ao persistente (consulte a Seção 7.1.9.4, “Variáveis de sistema não persistidas e restritas ao persistente”). Para persistir essas variáveis, use a instrução `SET PERSIST_ONLY`, que requer os privilégios descritos anteriormente. Além disso, você deve se conectar ao servidor usando uma conexão criptografada e fornecer um certificado SSL com o valor do Sujeito especificado pela variável de sistema `persist_only_admin_x509_subject`.

Para remover uma variável de sistema global persistente do arquivo `mysqld-auto.cnf`, use a instrução `RESET PERSIST`. Esses privilégios se aplicam:

- Para variáveis dinâmicas do sistema, o `RESET PERSIST` requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.

- Para variáveis de sistema somente de leitura, `RESET PERSIST` requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`.

- Para variáveis com restrição de persistência, `RESET PERSIST` não exige uma conexão criptografada com o servidor feita usando um certificado SSL específico.

Se uma variável de sistema global tiver exceções às exigências de privilégio anteriores, a descrição da variável indica essas exceções. Exemplos incluem `default_table_encryption` e `mandatory_roles`, que exigem privilégios adicionais. Esses privilégios adicionais se aplicam a operações que definem o valor de execução global, mas não a operações que persistem o valor.

Para definir o valor de execução de uma variável de sistema de sessão, use a instrução `SET SESSION`. Em contraste com a definição de valores de execução globais, definir valores de execução de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário para afetar a sessão atual. Para algumas variáveis de sistema, definir o valor da sessão pode ter efeitos fora da sessão atual e, portanto, é uma operação restrita que só pode ser feita por usuários que têm um privilégio especial:

- A partir do MySQL 8.0.14, o privilégio necessário é `SESSION_VARIABLES_ADMIN`.

  Nota

  Qualquer usuário que tenha `SYSTEM_VARIABLES_ADMIN` ou `SUPER` efetivamente tem `SESSION_VARIABLES_ADMIN` por implicação e não precisa ser concedido `SESSION_VARIABLES_ADMIN` explicitamente.

- Antes do MySQL 8.0.14, o privilégio necessário é `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.

Se uma variável de sistema de sessão estiver restringida, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format` e `sql_log_bin`. Definir o valor da sessão dessas variáveis afeta o registro binário para a sessão atual, mas também pode ter implicações mais amplas para a integridade da replicação e backups do servidor.

`SESSION_VARIABLES_ADMIN` permite que os administradores minimizem a pegada de privilégios dos usuários que podem ter sido previamente concedidos `SYSTEM_VARIABLES_ADMIN` ou `SUPER` com o objetivo de permitir que eles modifiquem as variáveis do sistema de sessão restritas. Suponha que um administrador tenha criado o seguinte papel para conferir a capacidade de definir variáveis do sistema de sessão restritas:

```
CREATE ROLE set_session_sysvars;
GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
```

Qualquer usuário com o papel `set_session_sysvars` (e que tenha esse papel ativo) pode definir variáveis de sistema de sessão restritas. No entanto, esse usuário também pode definir variáveis de sistema globais, o que pode ser indesejável.

Ao modificar o papel para ter `SESSION_VARIABLES_ADMIN` em vez de `SYSTEM_VARIABLES_ADMIN`, os privilégios do papel podem ser reduzidos à capacidade de definir variáveis de sistema de sessão restritas e nada mais. Para modificar o papel, use as seguintes instruções:

```
GRANT SESSION_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
REVOKE SYSTEM_VARIABLES_ADMIN ON *.* FROM set_session_sysvars;
```

A modificação do papel tem um efeito imediato: qualquer conta que tenha recebido o papel `set_session_sysvars` não tem mais `SYSTEM_VARIABLES_ADMIN` e não pode definir variáveis de sistema globais sem ser concedida explicitamente essa habilidade. Uma sequência semelhante de `GRANT`/`REVOKE` pode ser aplicada a qualquer conta que tenha recebido diretamente `SYSTEM_VARIABLES_ADMIN` em vez de por meio de um papel.
