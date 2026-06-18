#### 19.1.2.7 Definindo a configuração de fonte no replicador

Para configurar a replica para se comunicar com a fonte de replicação, configure a replica com as informações de conexão necessárias. Para fazer isso, na replica, execute a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23), substituindo os valores da opção pelos valores reais relevantes para o seu sistema:

```
mysql> CHANGE MASTER TO
    ->     MASTER_HOST='source_host_name',
    ->     MASTER_USER='replication_user_name',
    ->     MASTER_PASSWORD='replication_password',
    ->     MASTER_LOG_FILE='recorded_log_file_name',
    ->     MASTER_LOG_POS=recorded_log_position;

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO
    ->     SOURCE_HOST='source_host_name',
    ->     SOURCE_USER='replication_user_name',
    ->     SOURCE_PASSWORD='replication_password',
    ->     SOURCE_LOG_FILE='recorded_log_file_name',
    ->     SOURCE_LOG_POS=recorded_log_position;
```

Nota

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor MySQL de origem usando TCP/IP.

A declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` tem outras opções também. Por exemplo, é possível configurar a replicação segura usando SSL. Para uma lista completa das opções e informações sobre o comprimento máximo permitido para as opções de valor de string, consulte a Seção 15.4.2.1, “Declaração CHANGE MASTER TO”.

Importante

Como observado na Seção 19.1.2.3, “Criando um Usuário para Replicação”, se você não estiver usando uma conexão segura e a conta de usuário nomeada na opção `SOURCE_USER` | `MASTER_USER` autentica-se com o plugin `caching_sha2_password` (o padrão do MySQL 8.0), você deve especificar a opção `SOURCE_PUBLIC_KEY_PATH` | `MASTER_PUBLIC_KEY_PATH` ou `GET_SOURCE_PUBLIC_KEY` | `GET_MASTER_PUBLIC_KEY` na declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para habilitar a troca de senha baseada em par de chaves RSA.
