#### 19.1.2.7 Configurando a Configuração de Fonte na Replica

Para configurar a replica para se comunicar com a fonte para replicação, configure a replica com as informações de conexão necessárias. Para fazer isso, na replica, execute a seguinte instrução `CHANGE REPLICATION SOURCE TO`, substituindo os valores das opções pelos valores reais relevantes para o seu sistema:

```
mysql> CHANGE REPLICATION SOURCE TO
    ->     SOURCE_HOST='source_host_name',
    ->     SOURCE_USER='replication_user_name',
    ->     SOURCE_PASSWORD='replication_password',
    ->     SOURCE_LOG_FILE='recorded_log_file_name',
    ->     SOURCE_LOG_POS=recorded_log_position;
```

Observação

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor MySQL da fonte usando TCP/IP.

A instrução `CHANGE REPLICATION SOURCE TO` tem outras opções também. Por exemplo, é possível configurar a replicação segura usando SSL. Para uma lista completa das opções e informações sobre o comprimento máximo permitido para as opções de valor de string, consulte a Seção 15.4.2.2, “Instrução CHANGE REPLICATION SOURCE TO”.

Importante

Como observado na Seção 19.1.2.3, “Criando um Usuário para Replicação”, se você não estiver usando uma conexão segura e a conta de usuário nomeada na opção `SOURCE_USER` autentica com o plugin `caching_sha2_password` (o padrão no MySQL 9.5), você deve especificar a opção `SOURCE_PUBLIC_KEY_PATH` ou `GET_SOURCE_PUBLIC_KEY` na instrução `CHANGE REPLICATION SOURCE TO` para habilitar a troca de senha com par de chaves RSA.