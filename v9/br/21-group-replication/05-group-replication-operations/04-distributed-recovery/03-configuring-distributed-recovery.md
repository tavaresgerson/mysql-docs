#### 20.5.4.3 Configurando a Recuperação Distribuída

Vários aspectos do processo de recuperação distribuída da Replicação em Grupo podem ser configurados para atender às suas necessidades do sistema.

##### Número de Tentativas de Conexão

Para a transferência de estado do log binário, a Replicação em Grupo limita o número de tentativas que um membro associado faz ao tentar se conectar a um doador do pool de doadores. Se o limite de tentativas de reconexão for atingido sem uma conexão bem-sucedida, o procedimento de recuperação distribuída é encerrado com um erro. Observe que esse limite especifica o número total de tentativas que o membro associado faz para se conectar a um doador. Por exemplo, se 2 membros do grupo são doadores adequados e o limite de tentativas de reconexão é definido para 4, o membro associado faz 2 tentativas para se conectar a cada um dos doadores antes de atingir o limite.

O limite padrão de tentativas de reconexão é de 10. Você pode configurar essa configuração usando a variável de sistema `group_replication_recovery_retry_count`. O seguinte comando define o número máximo de tentativas para se conectar a um doador para 5:

```
mysql> SET GLOBAL group_replication_recovery_retry_count= 5;
```

Para operações de clonagem remota, esse limite não se aplica. A Replicação em Grupo faz apenas uma tentativa de conexão a cada doador adequado para clonagem, antes de começar a tentar a transferência de estado do log binário.

##### Intervalo de Sono para Tentativas de Conexão

Para a transferência de estado a partir do log binário, a variável de sistema `group_replication_recovery_reconnect_interval` define quanto tempo o processo de recuperação distribuída deve esperar entre as tentativas de conexão do doador. Note que a recuperação distribuída não espera após cada tentativa de conexão do doador. Como o membro que está se juntando está se conectando a servidores diferentes e não ao mesmo repetidamente, ele pode assumir que o problema que afeta o servidor A não afeta o servidor B. Portanto, a recuperação distribuída suspende apenas quando passou por todos os possíveis doadores. Uma vez que o servidor que está se juntando ao grupo faz uma tentativa de conexão com cada um dos doadores adequados no grupo, o processo de recuperação distribuída dorme por um número de segundos configurado pela variável de sistema `group_replication_recovery_reconnect_interval`. Por exemplo, se 2 membros do grupo são doadores adequados e o limite de tentativa de conexão é definido para 4, o membro que está se juntando faz uma tentativa de conexão com cada um dos doadores, depois dorme pelo intervalo de tentativa de conexão, depois faz uma tentativa adicional de conexão com cada um dos doadores antes de atingir o limite.

O intervalo padrão de tentativa de conexão é de 60 segundos, e você pode alterar esse valor dinamicamente. O seguinte comando define o intervalo de tentativa de conexão do doador de recuperação distribuída para 120 segundos:

```
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Para operações de clonagem remota, esse intervalo não se aplica. A Replicação em Grupo faz apenas uma tentativa de conexão com cada doador adequado para clonagem, antes de começar a tentar a transferência de estado a partir do log binário.

##### Marcando o Membro que Está se Juntando Online

Quando a recuperação distribuída tiver concluído com sucesso a transferência de estado do doador para o membro que está se juntando, o membro que está se juntando pode ser marcado como online no grupo e pronto para participar. Isso é feito após o novo membro ter recebido e aplicado todas as transações que ele perdeu antes de se juntar ao grupo.