#### 8.4.5.2 Instalar ou desinstalar o MySQL Enterprise Audit

Esta seção descreve como instalar ou desinstalar o MySQL Enterprise Audit, que é implementado usando o plugin de registro de auditoria e elementos relacionados descritos na Seção 8.4.5.1, “Elementos do MySQL Enterprise Audit”. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

As atualizações dos plugins não são automáticas quando você atualiza uma instalação do MySQL e algumas funções carregáveis do plugin devem ser carregadas manualmente (veja Instalação de Funções Carregáveis). Alternativamente, você pode reinstalar o plugin após a atualização do MySQL para carregar novas funções.

Importante

Leia toda esta seção antes de seguir as instruções. Algumas partes do procedimento diferem dependendo do seu ambiente.

Nota

Se instalado, o plugin `audit_log` envolve um pequeno custo adicional, mesmo quando desativado. Para evitar esse custo adicional, não instale o MySQL Enterprise Audit a menos que você planeje usá-lo.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

Para instalar o MySQL Enterprise Audit, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no nome do arquivo usado para referenciar o script:

- `audit_log_filter_win_install.sql`
- `audit_log_filter_linux_install.sql`

Execute o script da seguinte forma. O exemplo abaixo usa o script de instalação do Linux. Faça a substituição apropriada para o seu sistema.

Antes do MySQL 8.0.34:

```
$> mysql -u root -p < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

MySQL 8.0.34 e superior:

```
$> mysql -u root -p -D mysql < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

A partir do MySQL 8.0.34, é possível selecionar um banco de dados para armazenar tabelas de filtro JSON ao executar o script de instalação. Crie o banco de dados primeiro; seu nome não deve exceder 64 caracteres. Por exemplo:

```
mysql> CREATE DATABASE IF NOT EXISTS database-name;
```

Em seguida, execute o script usando o nome alternativo do banco de dados.

```
$> mysql -u root -p -D database-name < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

Nota

Algumas versões do MySQL introduziram alterações na estrutura das tabelas de Auditoria do MySQL Enterprise. Para garantir que suas tabelas estejam atualizadas para as atualizações de versões anteriores do MySQL 8.0, realize o procedimento de atualização do MySQL, garantindo que você use a opção que força uma atualização (consulte o Capítulo 3, *Atualizando o MySQL*). Se você preferir executar as instruções de atualização apenas para as tabelas de Auditoria do MySQL Enterprise, consulte a discussão a seguir.

A partir do MySQL 8.0.12, para novas instalações do MySQL, as colunas `USER` e `HOST` na tabela `audit_log_user` usada pelo MySQL Enterprise Audit têm definições que correspondem melhor às definições das colunas `User` e `Host` na tabela de sistema `mysql.user`. Para atualizações para uma instalação para a qual o MySQL Enterprise Audit já está instalado, recomenda-se alterar as definições da tabela da seguinte forma:

```
ALTER TABLE mysql.audit_log_user
  DROP FOREIGN KEY audit_log_user_ibfk_1;
ALTER TABLE mysql.audit_log_filter
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;
ALTER TABLE mysql.audit_log_user
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;
ALTER TABLE mysql.audit_log_user
  MODIFY COLUMN USER VARCHAR(32);
ALTER TABLE mysql.audit_log_user
  ADD FOREIGN KEY (FILTERNAME) REFERENCES mysql.audit_log_filter(NAME);
```

Nota

Para usar o MySQL Enterprise Audit no contexto da replicação de origem/replica, da replicação em grupo ou do clúster InnoDB, você deve preparar os nós da replica antes de executar o script de instalação no nó de origem. Isso é necessário porque a instrução `INSTALL PLUGIN` no script não é replicada.

1. Em cada nó de replicação, extraia a declaração `INSTALL PLUGIN` do script de instalação e execute-a manualmente.

2. No nó de origem, execute o script de instalação conforme descrito anteriormente.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'audit%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| audit_log   | ACTIVE        |
+-------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Após a instalação do MySQL Enterprise Audit, você pode usar a opção `--audit-log` para o início subsequente do servidor para controlar a ativação do plugin `audit_log`. Por exemplo, para impedir que o plugin seja removido durante a execução, use esta opção:

```
[mysqld]
audit-log=FORCE_PLUS_PERMANENT
```

Se quiser impedir que o servidor seja executado sem o plugin de auditoria, use `--audit-log` com um valor de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o falhanço da inicialização do servidor se o plugin não for inicializado com sucesso.

Importante

Por padrão, o filtro de registro de auditoria baseado em regras não registra eventos audíveis para nenhum usuário. Isso difere do comportamento do registro de auditoria do legado, que registra todos os eventos audíveis para todos os usuários (consulte a Seção 8.4.5.10, “Filtragem de Registro de Auditoria em Modo Legado”). Se você deseja registrar tudo com o filtro baseado em regras, crie um filtro simples para habilitar o registro e atribua-o à conta padrão:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O filtro atribuído a `%` é usado para conexões de qualquer conta que não tenha um filtro explicitamente atribuído (o que inicialmente é verdadeiro para todas as contas).

Quando instalado conforme descrito, o MySQL Enterprise Audit permanece instalado até ser desinstalado. Para removê-lo no MySQL 8.0.35 e versões posteriores, execute o script de desinstalação localizado no diretório `share` da sua instalação do MySQL. O exemplo aqui especifica o banco de dados do sistema padrão, `mysql`. Faça a substituição apropriada para o seu sistema.

```
$> mysql -u root -p -D mysql < audit_log_filter_uninstall.sql
Enter password: (enter root password here)
```

Se o script não estiver disponível, execute as seguintes instruções para remover as tabelas, o plugin e as funções manualmente.

```
DROP TABLE IF EXISTS mysql.audit_log_user;
DROP TABLE IF EXISTS mysql.audit_log_filter;
UNINSTALL PLUGIN audit_log;
DROP FUNCTION audit_log_filter_set_filter;
DROP FUNCTION audit_log_filter_remove_filter;
DROP FUNCTION audit_log_filter_set_user;
DROP FUNCTION audit_log_filter_remove_user;
DROP FUNCTION audit_log_filter_flush;
DROP FUNCTION audit_log_encryption_password_get;
DROP FUNCTION audit_log_encryption_password_set;
DROP FUNCTION audit_log_read;
DROP FUNCTION audit_log_read_bookmark;
DROP FUNCTION audit_log_rotate;
```
