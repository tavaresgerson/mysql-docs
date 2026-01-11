#### 6.4.5.2 Instalar ou desinstalar o MySQL Enterprise Audit

Esta seção descreve como instalar ou desinstalar o MySQL Enterprise Audit, que é implementado usando o plugin de registro de auditoria e elementos relacionados descritos em Seção 6.4.5.1, “Elementos do MySQL Enterprise Audit”. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Importante

Leia toda esta seção antes de seguir as instruções. Algumas partes do procedimento diferem dependendo do seu ambiente.

Nota

Se instalado, o plugin `audit_log` envolve um pequeno custo adicional, mesmo quando desativado. Para evitar esse custo, não instale o MySQL Enterprise Audit a menos que você planeje usá-lo.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

Nota

As instruções aqui se aplicam ao MySQL 5.7.13 e versões posteriores.

Além disso, antes do MySQL 5.7.13, o MySQL Enterprise Audit consiste apenas no plugin `audit_log` e não inclui nenhum dos outros elementos descritos em Seção 6.4.5.1, “Elementos do MySQL Enterprise Audit”. A partir do MySQL 5.7.13, se o plugin `audit_log` já estiver instalado a partir de uma versão do MySQL anterior ao 5.7.13, desinstale-o usando a seguinte declaração e reinicie o servidor antes de instalar a versão atual:

```sql
UNINSTALL PLUGIN audit_log;
```

Para instalar o MySQL Enterprise Audit, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no sufixo usado para referenciar o arquivo da biblioteca de plugins:

- `audit_log_filter_win_install.sql`: Escolha este script para sistemas Windows que usam `.dll` como sufixo de nome de arquivo.

- `audit_log_filter_linux_install.sql`: Escolha este script para sistemas Linux e sistemas semelhantes que utilizam `.so` como sufixo do nome do arquivo.

Execute o script da seguinte forma. O exemplo abaixo usa o script de instalação do Linux. Faça a substituição apropriada para o seu sistema.

```sh
$> mysql -u root -p < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

Nota

Algumas versões do MySQL introduziram alterações na estrutura das tabelas de Auditoria do MySQL Enterprise. Para garantir que suas tabelas estejam atualizadas para atualizações a partir de versões anteriores do MySQL 5.7, execute **mysql_upgrade --force** (que também realiza quaisquer outras atualizações necessárias). Se você preferir executar as declarações de atualização apenas para as tabelas de Auditoria do MySQL Enterprise, consulte a discussão a seguir.

A partir do MySQL 5.7.23, para novas instalações do MySQL, as colunas `USER` e `HOST` na tabela `audit_log_user` usadas pelo MySQL Enterprise Audit têm definições que correspondem melhor às definições das colunas `User` e `Host` na tabela `mysql.user` do sistema. Para atualizações para 5.7.23 ou superior de uma instalação para a qual o MySQL Enterprise Audit já está instalado, recomenda-se alterar as definições da tabela da seguinte forma:

```sql
ALTER TABLE mysql.audit_log_user
  DROP FOREIGN KEY audit_log_user_ibfk_1;
ALTER TABLE mysql.audit_log_filter
  ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_filter
  CONVERT TO CHARACTER SET utf8 COLLATE utf8_bin;
ALTER TABLE mysql.audit_log_user
  ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_user
  CONVERT TO CHARACTER SET utf8 COLLATE utf8_bin;
ALTER TABLE mysql.audit_log_user
  MODIFY COLUMN USER VARCHAR(32);
ALTER TABLE mysql.audit_log_user
  ADD FOREIGN KEY (FILTERNAME) REFERENCES mysql.audit_log_filter(NAME);
```

A partir do MySQL 5.7.21, para uma nova instalação do MySQL Enterprise Audit, o `InnoDB` é usado em vez do `MyISAM` para as tabelas do log de auditoria. Para atualizações para 5.7.21 ou versões superiores de uma instalação para a qual o MySQL Enterprise Audit já está instalado, recomenda-se alterar as tabelas do log de auditoria para usar `InnoDB`:

```sql
ALTER TABLE mysql.audit_log_user ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_filter ENGINE=InnoDB;
```

Nota

Para usar o MySQL Enterprise Audit no contexto da replicação de origem/replica, da replicação em grupo ou do InnoDB Cluster, você deve usar o MySQL 5.7.21 ou uma versão superior e garantir que as tabelas do log de auditoria usem `InnoDB` como descrito acima. Em seguida, você deve preparar os nós da replica antes de executar o script de instalação no nó de origem. Isso é necessário porque a instrução `INSTALL PLUGIN` no script não é replicada.

1. Em cada nó de replicação, extraia a declaração `INSTALL PLUGIN` do script de instalação e execute-a manualmente.

2. No nó de origem, execute o script de instalação conforme descrito anteriormente.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
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

Após a instalação do MySQL Enterprise Audit, você pode usar a opção `--audit-log` (referência do log de auditoria.html#option_mysqld_audit-log) nas próximas inicializações do servidor para controlar a ativação do plugin `audit_log`. Por exemplo, para impedir que o plugin seja removido durante a execução, use esta opção:

```
[mysqld]
audit-log=FORCE_PLUS_PERMANENT
```

Se quiser impedir que o servidor seja executado sem o plugin de auditoria, use `--audit-log` com o valor `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o falhamento da inicialização do servidor se o plugin não for inicializado com sucesso.

Importante

Por padrão, o filtro de log de auditoria baseado em regras não registra eventos audíveis para nenhum usuário. Isso difere do comportamento do log de auditoria legítimo (antes do MySQL 5.7.13), que registra todos os eventos audíveis para todos os usuários (consulte Seção 6.4.5.10, “Filtro de Log de Auditoria Legado”). Se você deseja registrar tudo com o filtro baseado em regras, crie um filtro simples para habilitar o registro e atribua-o à conta padrão:

```sql
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O filtro atribuído a `%` é usado para conexões de qualquer conta que não tenha um filtro explicitamente atribuído (o que inicialmente é verdadeiro para todas as contas).

Uma vez instalado conforme descrito, o MySQL Enterprise Audit permanece instalado até ser desinstalado. Para removê-lo, execute as seguintes instruções:

```sql
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
```
