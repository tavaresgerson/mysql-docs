#### 7.1.9.1 Privilegios de Variáveis de Sistema

Uma variável de sistema pode ter um valor global que afeta o funcionamento do servidor como um todo, um valor de sessão que afeta apenas a sessão atual ou ambos:

* Para variáveis de sistema dinâmicas, a instrução `SET` pode ser usada para alterar seu valor de execução global ou de sessão (ou ambos), para afetar o funcionamento da instância atual do servidor. (Para informações sobre variáveis dinâmicas, consulte a Seção 7.1.9.2, “Variáveis de Sistema Dinâmicas”.)

* Para certas variáveis de sistema globais, a instrução `SET` pode ser usada para persistir seu valor no arquivo `mysqld-auto.cnf` no diretório de dados, para afetar o funcionamento do servidor para inicializações subsequentes. (Para informações sobre a persistência de variáveis de sistema e o arquivo `mysqld-auto.cnf`, consulte a Seção 7.1.9.3, “Variáveis de Sistema Persistidas”.)

* Para variáveis de sistema persistidas globais, a instrução `RESET PERSIST` pode ser usada para remover seu valor de `mysqld-auto.cnf`, para afetar o funcionamento do servidor para inicializações subsequentes.

Esta seção descreve os privilégios necessários para operações que atribuem valores a variáveis de sistema em tempo de execução. Isso inclui operações que afetam valores de tempo de execução e operações que persistem valores.

Para definir uma variável de sistema global, use uma instrução `SET` com a palavra-chave apropriada. Esses privilégios se aplicam:

* Para definir o valor de execução de uma variável de sistema global, use a instrução `SET GLOBAL`, que requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`).

* Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` (e definir o valor de execução), use a instrução `SET PERSIST`, que requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.

* Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` (sem definir o valor de execução), use a instrução `SET PERSIST_ONLY`, que requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`. `SET PERSIST_ONLY` pode ser usado tanto para variáveis de sistema dinâmicas quanto para variáveis de leitura somente, mas é particularmente útil para persistir variáveis de leitura somente, para as quais `SET PERSIST` não pode ser usado.

* Algumas variáveis de sistema globais são restritas à persistência (consulte a Seção 7.1.9.4, “Variáveis de Sistema Não Persistidas e Restritas à Persistição”). Para persistir essas variáveis, use a instrução `SET PERSIST_ONLY`, que requer os privilégios descritos anteriormente. Além disso, você deve se conectar ao servidor usando uma conexão criptografada e fornecer um certificado SSL com o valor do Sujeito especificado pela variável de sistema `persist_only_admin_x509_subject`.

Para remover uma variável de sistema global persistida do arquivo `mysqld-auto.cnf`, use a instrução `RESET PERSIST`. Esses privilégios se aplicam:

* Para variáveis de sistema dinâmicas, `RESET PERSIST` requer o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.

* Para variáveis de sistema de leitura somente, `RESET PERSIST` requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`.

* Para variáveis restritas à persistência, `RESET PERSIST` não requer uma conexão criptografada ao servidor feita usando um certificado SSL específico.

Se uma variável de sistema global tiver exceções às exigências de privilégios anteriores, a descrição da variável indica essas exceções. Exemplos incluem `default_table_encryption` e `mandatory_roles`, que requerem privilégios adicionais. Esses privilégios adicionais se aplicam a operações que definem o valor de execução global, mas não a operações que persistem o valor.

Para definir o valor de runtime de uma variável de sistema de sessão, use a instrução `SET SESSION`. Em contraste com a definição de valores de runtime globais, definir valores de runtime de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário para afetar a sessão atual. Para algumas variáveis de sistema, definir o valor da sessão pode ter efeitos fora da sessão atual e, portanto, é uma operação restrita que só pode ser feita por usuários que têm um privilégio especial:

* O privilégio necessário é `SESSION_VARIABLES_ADMIN`.

  Nota

  Qualquer usuário que tenha `SYSTEM_VARIABLES_ADMIN` ou `SUPER` efetivamente tem `SESSION_VARIABLES_ADMIN` por implicação e não precisa ser concedido `SESSION_VARIABLES_ADMIN` explicitamente.

Se uma variável de sistema de sessão estiver restrita, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format` e `sql_log_bin`. Definir o valor da sessão dessas variáveis afeta o registro binário para a sessão atual, mas também pode ter implicações mais amplas para a integridade da replicação e backups do servidor.

`SESSION_VARIABLES_ADMIN` permite que os administradores minimizem a pegada de privilégio dos usuários que podem ter sido concedidos `SYSTEM_VARIABLES_ADMIN` ou `SUPER` anteriormente, com o propósito de permitir que eles modifiquem variáveis de sistema de sessão restritas. Suponha que um administrador tenha criado o seguinte papel para conferir a capacidade de definir variáveis de sistema de sessão restritas:

```
CREATE ROLE set_session_sysvars;
GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
```

Qualquer usuário concedido o papel `set_session_sysvars` (e que tenha esse papel ativo) é capaz de definir variáveis de sistema de sessão restritas. No entanto, esse usuário também é capaz de definir variáveis de sistema globais, o que pode ser indesejável.

Ao modificar o papel para ter `SESSION_VARIABLES_ADMIN` em vez de `SYSTEM_VARIABLES_ADMIN`, os privilégios do papel podem ser reduzidos à capacidade de definir variáveis de sistema de sessão restritas e nada mais. Para modificar o papel, use essas instruções:

```
GRANT SESSION_VARIABLES_ADMIN ON *.* TO set_session_sysvars;
REVOKE SYSTEM_VARIABLES_ADMIN ON *.* FROM set_session_sysvars;
```

A modificação do papel tem um efeito imediato: qualquer conta que tenha sido concedida o papel `set_session_sysvars` não tem mais `SYSTEM_VARIABLES_ADMIN` e não pode definir variáveis de sistema globais sem ser concedida explicitamente essa capacidade. Uma sequência semelhante de `GRANT`/`REVOKE` pode ser aplicada a qualquer conta que tenha sido concedida `SYSTEM_VARIABLES_ADMIN` diretamente, em vez de por meio de um papel.