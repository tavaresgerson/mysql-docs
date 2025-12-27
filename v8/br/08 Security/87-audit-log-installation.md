#### 8.4.5.2 Instalando ou Desinstalando o Auditoria do MySQL Enterprise

Esta seção descreve como instalar ou desinstalar o Auditoria do MySQL Enterprise, que é implementado usando o plugin de log de auditoria e elementos relacionados descritos na Seção 8.4.5.1, “Elementos do Auditoria do MySQL Enterprise”. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

As atualizações de plugins não são automáticas ao atualizar uma instalação do MySQL e algumas funções carregáveis do plugin devem ser carregadas manualmente (veja a Seção 8.4.5.2, “Instalando Funções Carregáveis”). Alternativamente, você pode reinstalar o plugin após atualizar o MySQL para carregar novas funções.

Importante

Leia toda esta seção antes de seguir suas instruções. Parte do procedimento difere dependendo do seu ambiente.

::: info Nota

Se instalado, o plugin `audit_log` envolve um overhead mínimo mesmo quando desativado. Para evitar esse overhead, não instale o Auditoria do MySQL Enterprise a menos que planeje usá-lo.

:::

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin do MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` no início do servidor.

Para instalar o Auditoria do MySQL Enterprise, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no nome do arquivo usado para referenciar o script:

* `audit_log_filter_win_install.sql`
* `audit_log_filter_linux_install.sql`

Execute o script da seguinte forma. O exemplo aqui usa o script de instalação do Linux e a base de dados do sistema `mysql` padrão. Faça a substituição apropriada para o seu sistema.

```
$> mysql -u root -p -D mysql < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

É possível especificar um banco de dados personalizado para armazenar tabelas de filtro JSON ao executar o script de instalação. Crie o banco de dados primeiro; seu nome não deve exceder 64 caracteres. Por exemplo:

```
mysql> CREATE DATABASE IF NOT EXISTS database-name;
```

Em seguida, execute o script usando o nome alternativo do banco de dados.

```
$> mysql -u root -p -D database-name < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

::: info Nota

Algumas versões do MySQL introduziram alterações na estrutura das tabelas de auditoria do MySQL Enterprise. Para garantir que suas tabelas estejam atualizadas para atualizações de versões anteriores do MySQL, realize o procedimento de atualização do MySQL, garantindo que use a opção que força uma atualização (consulte Capítulo 3, *Atualizando o MySQL*). Se você preferir executar as instruções de atualização apenas para as tabelas de auditoria do MySQL Enterprise, consulte a discussão a seguir.

Para novas instalações do MySQL, as colunas `USER` e `HOST` na tabela `audit_log_user` usadas pelo MySQL Enterprise Audit têm definições que correspondem melhor às definições das colunas `User` e `Host` na tabela de sistema `mysql.user`. Para atualizações para uma instalação para a qual o MySQL Enterprise Audit já está instalado, recomenda-se alterar as definições da tabela da seguinte forma:

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

:::

::: info Nota

Para usar o MySQL Enterprise Audit no contexto da replicação de origem/replica, da Replicação em Grupo ou do Cluster InnoDB, você deve preparar os nós de replica antes de executar o script de instalação no nó de origem. Isso é necessário porque a instrução `INSTALL PLUGIN` no script não é replicada.

1. Em cada nó de replica, extraia a instrução `INSTALL PLUGIN` do script de instalação e execute-a manualmente.
2. No nó de origem, execute o script de instalação conforme descrito anteriormente.

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Se o plugin não conseguir inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Após o MySQL Enterprise Audit ser instalado, você pode usar a opção `--audit-log` para as próximas inicializações do servidor para controlar a ativação do plugin `audit_log`. Por exemplo, para impedir que o plugin seja removido em tempo de execução, use essa opção:

```
[mysqld]
audit-log=FORCE_PLUS_PERMANENT
```

Se quiser impedir que o servidor seja executado sem o plugin de auditoria, use `--audit-log` com o valor `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o falhamento da inicialização do servidor se o plugin não se inicializar com sucesso.

Importante

Por padrão, a filtragem do log de auditoria com base em regras não registra eventos audíveis para nenhum usuário. Isso difere do comportamento do log de auditoria legítimo, que registra todos os eventos audíveis para todos os usuários (consulte a Seção 8.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”). Se você deseja registrar tudo com base em regras de filtragem, crie um filtro simples para habilitar o registro e atribua-o à conta padrão:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O filtro atribuído a `%` é usado para conexões de qualquer conta que não tenha um filtro atribuído explicitamente (o que inicialmente é verdadeiro para todas as contas).

Quando instalado como descrito, o MySQL Enterprise Audit permanece instalado até ser desinstalado. Para removê-lo, execute o script de desinstalação localizado no diretório `share` da sua instalação do MySQL. O exemplo aqui especifica o banco de dados de sistema padrão, `mysql`. Faça a substituição apropriada para o seu sistema.

```
$> mysql -u root -p -D mysql < audit_log_filter_uninstall.sql
Enter password: (enter root password here)
```