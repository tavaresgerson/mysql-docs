#### 20.5.4.3 Configurando a Recuperação Distribuída

Vários aspectos do processo de recuperação distribuída do Grupo de Replicação podem ser configurados para se adequar ao seu sistema.

##### Número de tentativas de conexão

Para a transferência de estado do log binário, a Replicação em Grupo limita o número de tentativas que um membro associado faz ao tentar se conectar a um doador do conjunto de doadores. Se o limite de tentativas de reconexão for atingido sem uma conexão bem-sucedida, o procedimento de recuperação distribuída é encerrado com um erro. Observe que esse limite especifica o número total de tentativas que o membro associado faz para se conectar a um doador. Por exemplo, se 2 membros do grupo são doadores adequados e o limite de tentativas de reconexão é definido para 4, o membro associado faz 2 tentativas para se conectar a cada um dos doadores antes de atingir o limite.

O limite padrão de tentativas de conexão é de 10. Você pode configurar essa configuração usando a variável de sistema `group_replication_recovery_retry_count`. A seguinte declaração define o número máximo de tentativas para se conectar a um doador para 5:

```
mysql> SET GLOBAL group_replication_recovery_retry_count= 5;
```

Para operações de clonagem remota, esse limite não se aplica. A Replicação em Grupo faz apenas uma tentativa de conexão com cada doador adequado para clonagem, antes de começar a tentar a transferência de estado do log binário.

##### Intervalo de sono para tentativas de conexão

Para a transferência de estado do log binário, a variável de sistema `group_replication_recovery_reconnect_interval` define quanto tempo o processo de recuperação distribuída deve dormir entre as tentativas de conexão do doador. Note que a recuperação distribuída não dorme após cada tentativa de conexão do doador. Como o membro que está se juntando está se conectando a servidores diferentes e não ao mesmo repetidamente, ele pode assumir que o problema que afeta o servidor A não afeta o servidor B. Portanto, a recuperação distribuída suspende apenas quando passou por todos os possíveis doadores. Uma vez que o servidor que está se juntando ao grupo fez uma tentativa de conexão com cada um dos doadores adequados no grupo, o processo de recuperação distribuída dorme por o número de segundos configurados pela variável de sistema `group_replication_recovery_reconnect_interval`. Por exemplo, se 2 membros do grupo são doadores adequados e o limite de tentativa de conexão é definido para 4, o membro que está se juntando faz uma tentativa de conexão com cada um dos doadores, depois dorme pelo intervalo de tentativa de conexão, depois faz uma tentativa adicional de conexão com cada um dos doadores antes de atingir o limite.

O intervalo padrão de tentativa de conexão é de 60 segundos, e você pode alterar esse valor dinamicamente. A seguinte declaração define o intervalo de tentativa de conexão do doador de recuperação distribuída para 120 segundos:

```
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Para operações de clonagem remota, esse intervalo não se aplica. A Replicação em Grupo faz apenas uma tentativa de conexão com cada doador adequado para clonagem, antes de começar a tentar a transferência de estado do log binário.

##### Marcando o Membro Juntador Online

Quando a recuperação distribuída tiver concluído com sucesso a transferência de estado do doador para o membro que está se juntando, o membro que está se juntando pode ser marcado como online no grupo e pronto para participar. Por padrão, isso é feito após o membro que está se juntando ter recebido e aplicado todas as transações que estava faltando. Opcionalmente, você pode permitir que um membro que está se juntando seja marcado como online quando ele tiver recebido e certificado (ou seja, completado a detecção de conflitos para) todas as transações que estava faltando, mas antes de as ter aplicado. Se você quiser fazer isso, use a variável de sistema `group_replication_recovery_complete_at` para especificar o ajuste alternativo `TRANSACTIONS_CERTIFIED`.
